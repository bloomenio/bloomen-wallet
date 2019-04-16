const web3Ctx = require('../web3/web3Ctx');
const inquirer = require('inquirer');
const common = require('../common/common');

async function _v1() {
    let cards = common.getCards();
    const ctx = web3Ctx.getCurrentContext();
    let cardIds = [];
    cards.forEach(card => {
        if (!card.active) {
            cardIds.push(card.id.toString());
        }
    });
    if (cardIds.length == 0) {
        console.log('There are no inactive prepaid cards.');
        return;
    }
    let questions = [
        { type: 'list', name: 'id', message: 'Select a prepaid card:', choices: cardIds }
    ];
    console.log('Activate prepaid card');
    let answer = await inquirer.prompt(questions);
    await _activateCard(ctx,cards,answer.id); 
}

function _activateCard(ctx,cards,_id){
    return new Promise((resolve, reject) => {
        ctx.prepaidCardManager.methods.activateCard(_id).send(ctx.transactionObject)
        .on('transactionHash', (hash) => {
            web3Ctx.checkTransaction(hash).then( () => {
                cards.forEach(card => {
                    if (card.id == _id) {
                        card.active = true;
                    }
                });
                common.setCards(cards);  
                resolve();
            }, (err) => reject(err));
        });
    });
}

module.exports = {
        v1: _v1
    };