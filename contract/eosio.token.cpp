/**
 *  @file
 *  @copyright defined in eos/LICENSE.txt
 */

#include "eosio.token.hpp"

namespace eosio {

void token::create( account_name issuer,
                    asset        maximum_supply )
{
    require_auth( _self );


    auto sym = maximum_supply.symbol;
    eosio_assert( sym.is_valid(), "invalid symbol name" );
    eosio_assert( maximum_supply.is_valid(), "invalid supply");
    eosio_assert( maximum_supply.amount > 0, "max-supply must be positive");

    stats statstable( _self, sym.name() );
    auto existing = statstable.find( sym.name() );
    eosio_assert( existing == statstable.end(), "token with symbol already exists" );

    statstable.emplace( _self, [&]( auto& s ) {
       s.supply.symbol = maximum_supply.symbol;
       s.max_supply    = maximum_supply;
       s.issuer        = issuer;
    });
}


void token::issue( account_name to, asset quantity, string memo )
{
    auto sym = quantity.symbol;
    eosio_assert( sym.is_valid(), "invalid symbol name" );
    eosio_assert( memo.size() <= 256, "memo has more than 256 bytes" );

    auto sym_name = sym.name();
    stats statstable( _self, sym_name );
    auto existing = statstable.find( sym_name );
    eosio_assert( existing != statstable.end(), "token with symbol does not exist, create token before issue" );
    const auto& st = *existing;

    require_auth( st.issuer );
    eosio_assert( quantity.is_valid(), "invalid quantity" );
    eosio_assert( quantity.amount > 0, "must issue positive quantity" );

    eosio_assert( quantity.symbol == st.supply.symbol, "symbol precision mismatch" );
    eosio_assert( quantity.amount <= st.max_supply.amount - st.supply.amount, "quantity exceeds available supply");

    statstable.modify( st, 0, [&]( auto& s ) {
       s.supply += quantity;
    });

    add_balance( st.issuer, quantity, st.issuer );

    if( to != st.issuer ) {
       SEND_INLINE_ACTION( *this, transfer, {st.issuer,N(active)}, {st.issuer, to, quantity, memo} );
    }
}

void token::transfer( account_name from,
                      account_name to,
                      asset        quantity,
                      string       memo )
{
    eosio_assert( from != to, "cannot transfer to self" );
    require_auth( from );
    eosio_assert( is_account( to ), "to account does not exist");
    auto sym = quantity.symbol.name();
    stats statstable( _self, sym );
    const auto& st = statstable.get( sym );

    require_recipient( from );
    require_recipient( to );



    eosio_assert( quantity.is_valid(), "invalid quantity" );
    eosio_assert( quantity.amount > 0, "must transfer positive quantity" );
    eosio_assert( quantity.symbol == st.supply.symbol, "symbol precision mismatch" );
    eosio_assert( memo.size() <= 256, "memo has more than 256 bytes" );


    accounts from_acnts( _self, from );
    const auto& fromaccount = from_acnts.get( quantity.symbol.name(), "no balance object found" );
    auto itewhi = fromaccount.whitelist.begin();
    bool find=false;
    while(itewhi != fromaccount.whitelist.end()){
        if(*itewhi==to){
            find=true;
            break;
        }
        itewhi++;
    }
    asset addedasset=quantity;
    addedasset.amount=0;
    if(!find){
        auto iterec = fromaccount.latesttransrec.begin();
        while(iterec!=fromaccount.latesttransrec.end()){
            if(iterec->transtime>now()-fromaccount.limitime){
                addedasset+=iterec->quantity;
            }
            iterec++;
        }
        eosio_assert(addedasset.amount<=fromaccount.limittrans.amount, "trans exceed the limit");
    }

    from_acnts.modify(fromaccount, from, [&](auto &data){
        auto iterec = data.latesttransrec.begin();
        while(iterec!=data.latesttransrec.end()){
            if(iterec->transtime<=now()-fromaccount.limitime){
                iterec=data.latesttransrec.erase(iterec);
            }else
            {
             iterec++;
            }
        }
    });


    transrecord tr;
    tr.transtime=now();
    tr.quantity=quantity;
    from_acnts.modify(fromaccount, from, [&](auto &data){
        data.latesttransrec.push_back(tr);
    });


    sub_balance( from, quantity );
    add_balance( to, quantity, from );
}


void  token::setlimit(account_name account, asset quantitylim, uint32_t period){
    require_auth2(account, N(owner));
    accounts from_acnts( _self, account );
    const auto& from = from_acnts.get( quantitylim.symbol.name(), "no balance object found" );
    from_acnts.modify(from, account, [&](auto & data){
        data.limittrans = quantitylim;
        data.limitime=period;
    });
}

void token::addwhitelist(account_name account, asset symbol, account_name white){
    require_auth2(account, N(owner));
    accounts from_acnts( _self, account );
    const auto& from = from_acnts.get( symbol.symbol.name(), "no balance object found" );
    auto ite = from.whitelist.begin();
    while(ite != from.whitelist.end()){
        if(*ite==white){
            return;
        }
        ite++;
    }

    from_acnts.modify(from, account, [&](auto & data){
        data.whitelist.push_back(white);
    });
}

void token::rmwhitelist(account_name account,  asset symbol, account_name white){
    require_auth2(account, N(owner));
    accounts from_acnts( _self, account );
    const auto& from = from_acnts.get( symbol.symbol.name(), "no balance object found" );

    from_acnts.modify(from, account, [&](auto & data){
        auto ite = data.whitelist.begin();
        while(ite != data.whitelist.end()){
            if(*ite==white){
                data.whitelist.erase(ite);
                return;
            }
            white++;
        }
    });
}

void token::sub_balance( account_name owner, asset value ) {
   accounts from_acnts( _self, owner );

   const auto& from = from_acnts.get( value.symbol.name(), "no  balance object found" );
   eosio_assert( from.balance.amount >= value.amount, "overdrawn balance" );

   if( from.balance.amount == value.amount ) {
      from_acnts.erase( from );
   } else {
      from_acnts.modify( from, owner, [&]( auto& a ) {
          a.balance -= value;
      });
   }
}

void token::add_balance( account_name owner, asset value, account_name ram_payer )
{
   accounts to_acnts( _self, owner );
   auto to = to_acnts.find( value.symbol.name() );
   if( to == to_acnts.end() ) {
      to_acnts.emplace( ram_payer, [&]( auto& a ){
        a.balance = value;
      });
   } else {
      to_acnts.modify( to, 0, [&]( auto& a ) {
        a.balance += value;
      });
   }
}

} /// namespace eosio

EOSIO_ABI( eosio::token, (create)(issue)(transfer)(setlimit)(addwhitelist)(rmwhitelist))
