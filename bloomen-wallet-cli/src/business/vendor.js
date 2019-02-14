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
    await ctx.business.methods.activateCard(answer.id).send(ctx.transactionObject)
        .then((tx) => {
            console.log('Transaction sent.');
            return web3Ctx.checkTransaction(tx.transactionHash);
        }).then(()=> {
            cards.forEach(card => {
                if (card.id == answer.id) {
                    card.active = true;
                }
            });
            common.setCards(cards);   
        },(err)=>{
            console.log(err);
            }
        );   
}
module.exports = {
        v1: _v1
    };