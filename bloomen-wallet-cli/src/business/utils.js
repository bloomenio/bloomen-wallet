const web3Ctx = require('../web3/web3Ctx');
const common = require('../common/common');
const uuidv4 = require('uuid/v4');
const inquirer = require('inquirer');
const mergeImages = require( 'merge-images');
const _ = require( 'underscore');

const text2png = require('text2png');

const Canvas  = require('canvas');
const sharp = require('sharp');
const qr = require('qr-image');
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
            let balance = await ctx.business.methods.balanceOf(address[i].address).call(ctx.transactionObject)
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
        let response =  await ctx.business.methods.balanceOf(answer.address).call(ctx.transactionObject);       
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
    
    await ctx.business.methods.mint(answer.address.address,parseInt(answer.amount)).send(ctx.transactionObject).then((tx) => {
        console.log('Transaction sent.');
        return web3Ctx.checkTransaction(tx.transactionHash);
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
        let response = await ctx.business.methods.isAllowed(ctx.web3.utils.keccak256(answer.device)).call(ctx.transactionObject);
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
        await ctx.business.methods.addCard(randomId, amount,ctx.web3.utils.keccak256(secret)).send(ctx.transactionObject)
        .then((tx) => {
            console.log('Transaction sent.');
            return web3Ctx.checkTransaction(tx.transactionHash);
        });
        await ctx.business.methods.activateCard(randomId).send(ctx.transactionObject)
        .then((tx) => {
            console.log('Transaction sent.');
            return web3Ctx.checkTransaction(tx.transactionHash);
        });
        cards.push({ id: randomId, secret: secret, active: true, points: amount});        
    }
    common.setCards(cards);    
}

//[U4] Re-activate all cards
async function _u4() {
    let cards = common.getCards();
    const ctx = web3Ctx.getCurrentContext();
    for (i = 0; i < cards.length; i++) {
        let card=cards[i];
        if (card.active) {
            try {
                await ctx.business.methods.addCard(card.id, card.points, ctx.web3.utils.keccak256(card.secret)).send(ctx.transactionObject)
                .then((tx) => {
                    console.log('Transaction sent.');
                    return web3Ctx.checkTransaction(tx.transactionHash);
                });
            } catch(err) {
               // nothing todo
            } 
            try {
                await ctx.business.methods.activateCard(card.id).send(ctx.transactionObject)
                .then((tx) => {
                    console.log('Transaction sent.');
                    return web3Ctx.checkTransaction(tx.transactionHash);
                });
            } catch(err) {
                // nothing todo
            }            
        }
    }
}

//[U5] Generate all image cards
async function _u5() {
    let cards = common.getCards();
    for (i = 0; i < cards.length; i++) {
        await generateQRCard(cards[i].id,cards[i].secret,cards[i].points);
    }
}

async function generateQRCard(id,secret,points){
    
    const qr_png = qr.imageSync(secret, { type: 'png' , ec_level: 'H',margin: 2 });
    await sharp(qr_png).resize(185, 185).toFile('./data/tmp/tmp_qr_resized.png');

    fs.writeFileSync('./data/tmp/tmp_points.png', text2png(points + '', {color: 'white',font:'90px Roboto', localFontPath: 'fonts/roboto/Roboto-Regular.ttf',
    localFontName: 'Roboto' }));

    fs.writeFileSync('./data/tmp/tmp_units.png', text2png('CR', {color: 'white',font:'40px Roboto', localFontPath: 'fonts/roboto/Roboto-Regular.ttf',
    localFontName: 'Roboto'}));

    const cfgCard=[
        { src: './img/bloomen_card.png', x: 0, y: 0 },
        { src: './data/tmp/tmp_qr_resized.png', x: 290, y: 5 },
        { src: './data/tmp/tmp_points.png', x: 170, y: 205 },
        { src: './data/tmp/tmp_units.png', x: 400, y: 240 },
      ];

    let data = await mergeImages(cfgCard, {
    Canvas: Canvas
    });
    
    data = data.replace(/^data:image\/png;base64,/, '');

    fs.writeFileSync('./data/cards/'+id+'.png', data, 'base64', function(err) {
        if (err) throw err;
    });
    
    fs.unlinkSync(cfgCard[1].src);
    fs.unlinkSync(cfgCard[2].src);
    fs.unlinkSync(cfgCard[3].src);
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
    u5: _u5,
    u6: _u6,
    u7: _u7,
    u8: _u8
};