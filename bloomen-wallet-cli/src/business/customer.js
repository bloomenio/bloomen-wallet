const common = require('../common/common');
const qrcode = require('qrcode-terminal');
const inquirer = require('inquirer');

//[C1] Generate Prepaid card QR
async function  _c1() {
    let cards = common.getCards();
    let cardIds = [];
    cards.forEach(card => {
        if (card.active) {
            cardIds.push(card.id.toString());
        }
    });
    if (cardIds.length == 0) {
        console.log('There are no active prepaid cards.');
        return;
    }
    let questions = [
        { type: 'list', name: 'id', message: 'Select a prepaid card:', choices: cardIds }
    ];
    console.log('Get prepaid card QR');
    let answer = await inquirer.prompt(questions);
    let secret;
    let points;
    cards.forEach(card => {
        if (card.id == answer.id) {
            secret = card.secret;
            points = card.points;
        }
    });
    console.log(secret);
    await qrcode.generate(secret);   
}

//[C2] Generate purchase operation QR
async function _c2() {    
    let questions = [        
        { type: 'input', name: 'dappId', message: 'Specify the dappId:' },
        { type: 'input', name: 'assetId', message: 'Specify the assetId key:' },
        { type: 'input', name: 'schemaId', message: 'Specify the schemaId key:' },
        { type: 'input', name: 'amount', message: 'Specify the amount key:' },
        { type: 'input', name: 'description', message: 'Specify the description:' }
    ];
    
    let answer = await inquirer.prompt(questions);
    const qrData = 'buy://'+answer.assetId+'#'+answer.schemaId+'#'+answer.amount+'#'+answer.dappId+'#'+encodeURI(answer.description);
    console.log(qrData);    
    qrcode.generate(qrData, (str) => { 
      console.log(str);
    });     
}

//[C3] Generate asset access request QR for device
async function _c3() {    
    let questions = [
        { type: 'input', name: 'dappId', message: 'Specify the dappId:' },
        { type: 'input', name: 'device', message: 'Specify the device key:' },
        { type: 'input', name: 'assetId', message: 'Specify the assetId key:' },
        { type: 'input', name: 'schemaId', message: 'Specify the schemaId key:' }
    ];
    
    let answer = await inquirer.prompt(questions);
    const qrData ='allow://'+encodeURI(answer.device)+'#'+answer.assetId+'#'+answer.schemaId+'#'+answer.dappId;
    console.log(qrData); 
    qrcode.generate(qrData, (str) => { 
      console.log(str);
    });     
}

//[C4] Generate asset access request QR for device and buy option
async function _c4() {
    let questions = [
        { type: 'input', name: 'dappId', message: 'Specify the dappId:' },
        { type: 'input', name: 'assetId', message: 'Specify the assetId key:' },
        { type: 'input', name: 'schemaId', message: 'Specify the schemaId key:' },
        { type: 'input', name: 'amount', message: 'Specify the amount key:' },
        { type: 'input', name: 'description', message: 'Specify the description:' },
        { type: 'input', name: 'device', message: 'Specify the device:' },
    ];

    let answer = await inquirer.prompt(questions);
    const qrData = 'allow_buy://'+answer.assetId+'#'+answer.schemaId+'#'+answer.amount+'#'+answer.dappId+'#'+encodeURI(answer.description)+'#'+encodeURI(answer.device);
    console.log(qrData);
    qrcode.generate(qrData, (str) => {
        console.log(str);
    });
}

module.exports = {
        c1: _c1,
        c2: _c2,
        c3: _c3,
        c4: _c4
    };
