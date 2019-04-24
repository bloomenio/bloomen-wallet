const web3Ctx = require('../web3/web3Ctx');
const common = require('../common/common');
const uuidv4 = require('uuid/v4');
const inquirer = require('inquirer');
const _ = require( 'underscore');
const fs = require('fs');

function getRandomId() {
    return Math.floor(Math.random() * (Math.pow(2, 50) - 1)) + 1;
}

//[UB1] Balance Dashboard
async function _ub1() {
    const ctx = web3Ctx.getCurrentContext();
    let address = common.getAddress();
    if (address.length == 0 ){
        console.log('No address registered');
        return;
    }
    for (i=0;i<address.length;i++){
        try{
            let balance = await ctx.erc223.methods.balanceOf(address[i].address).call(ctx.transactionObject)
            console.log(address[i].name, address[i].address,' balance:',balance);
        } catch(e){
            console.log('Error:',e);
        }      
    }
}

//[UB2] Balance for address
async function _ub2() {    
    const ctx = web3Ctx.getCurrentContext();
    let questions = [
        { type: 'input', name: 'address', message: 'Specify the address:' },
    ];    
    let answer = await inquirer.prompt(questions);
    try{
        let response =  await ctx.erc223.methods.balanceOf(answer.address).call(ctx.transactionObject);       
        console.log('Balance for '+ answer.address + ' :' + response);
    } catch(e){
        console.log('Error:',e);
    }
        
}

//[UB3] Mint for address
async function _ub3() {    
    const ctx = web3Ctx.getCurrentContext();
    let address = common.getAddress();
    if (address.length == 0 ){
        console.log('No address registered');
        return;
    }

    const choices = [];
    address.forEach(item => {         
        choices.push({name: item.name +' '+ item.address,value: item});
    });
    let questions = [
        { type: 'list', name: 'address', message: 'Address:',choices:choices },
        { type: 'input', name: 'amount', message: 'Specify the amount:' }
    ];    
    let answer = await inquirer.prompt(questions);
    
    return new Promise((resolve, reject) => {
        ctx.erc223.methods.mint(answer.address.address,parseInt(answer.amount)).send(ctx.transactionObject)
        .on('transactionHash', (hash) => {
            web3Ctx.checkTransaction(hash).then( () => resolve(), (err) => reject(err));
        });
    });
    
}

//[U1] Test of device access to an asset
async function _u1() { 
    const ctx = web3Ctx.getCurrentContext();   
    let questions = [
        { type: 'input', name: 'device', message: 'Specify the device key:' },
    ];
    let answer = await inquirer.prompt(questions);
    try{
        let response = await ctx.devices.methods.isAllowed(ctx.web3.utils.keccak256(answer.device)).call(ctx.transactionObject);
        console.log( answer.device +'  access: ' +response);
    } catch(e){
        console.log('Error:',e);
    }
}

//[U2] Purge all prepaid card
async function _u2() {
    common.deleteAllCards();    
}

//[U3] Generate 10 random PPC
async function _u3() {
    let cards = common.getCards();
    const ctx = web3Ctx.getCurrentContext();
    const cardNumber=10;
    const amount= 1000;
    for (i=0;i<cardNumber;i++){
        const secret = 'card://' + uuidv4();
        const randomId = getRandomId();
        try {
            await _addCard(ctx,randomId,amount,secret);
            await _activateCard(ctx,randomId);
            cards.push({ id: randomId, secret: secret, active: true, points: amount});
        } catch (err) {
            console.log(err);
        }     
    }
    common.setCards(cards);    
}

function _addCard(ctx,randomId,amount,secret) {
    return new Promise((resolve, reject) => {
        ctx.prepaidCardManager.methods.addCard(randomId, amount,ctx.web3.utils.keccak256(secret)).send(ctx.transactionObject)
        .on('transactionHash', (hash) => {
            web3Ctx.checkTransaction(hash).then( () => resolve(), (err) => reject(err));
        });
    });
}

function _activateCard(ctx,randomId) {
    return new Promise((resolve, reject) => {
        ctx.prepaidCardManager.methods.activateCard(randomId).send(ctx.transactionObject)
        .on('transactionHash', (hash) => {
            web3Ctx.checkTransaction(hash).then( () => resolve(), (err) => reject(err));
        });
    });
}


//[U4] Re-activate all cards
async function _u4() {
    let cards = common.getCards();
    const ctx = web3Ctx.getCurrentContext();
    for (i = 0; i < cards.length; i++) {
        let card=cards[i];
        if (card.active) {
            try {
                await _addCard(ctx,card.id, card.points,card.secret);        
            } catch(err) {
               // nothing todo
            } 
            try {
                await _activateCard(ctx,card.id);
            } catch(err) {
                // nothing todo
            }            
        }
    }
}

//[U6] List user addresses
async function _u6() {
    common.getAddress().forEach(item => {         
        console.log(item.name,item.address);
      });  
}

//[U7] Add address
async function _u7() {
    let address = common.getAddress();
    questions = [
        { type: 'input', name: 'name', message: 'Address name' },
        { type: 'input', name: 'address', message: 'Address value' }
    ];

    let answer = await inquirer.prompt(questions);
    address.push( {name: answer.name,address: answer.address});
    common.setAddress(address);    
}

//[U8] Delete address
async function _u8() {
    let address = common.getAddress();
    const choices = [];
    address.forEach(item => {         
        choices.push({name: item.name +' '+ item.address,value: item});
    });  
    questions = [
        { type: 'list', name: 'value', message: 'Choose address', choices: choices }
    ];
    let answer = await inquirer.prompt(questions);
    address = _.reject(address, (item) => item.address===answer.value.address && item.name === answer.value.name );
    common.setAddress(address); 
}

module.exports = {
    ub1: _ub1,
    ub2: _ub2,
    ub3: _ub3,
    u1: _u1,
    u2: _u2,
    u3: _u3,
    u4: _u4,
    u6: _u6,
    u7: _u7,
    u8: _u8
};