const fs = require('fs');
const _CARDS_PATH= './data/cards.json';
const _ADDRESS_PATH= './data/address.json';

function _getCards() {
    return JSON.parse(fs.readFileSync(_CARDS_PATH, 'utf8'));
}

function _getAddress() {
    return JSON.parse(fs.readFileSync(_ADDRESS_PATH, 'utf8'));
}

function _setCards(_cards) {    
    fs.writeFileSync(_CARDS_PATH, JSON.stringify(_cards), 'utf8'); 
}

function _setAddress(_address) {
    fs.writeFileSync(_ADDRESS_PATH, JSON.stringify(_address), 'utf8'); 
}

function _deleteAllCards() {
    const tmpCards = [];
    fs.writeFileSync(_CARDS_PATH, JSON.stringify(tmpCards), 'utf8');
}


function _deleteAllAddress() {
    const tmpAddress = [];
    fs.writeFileSync(_ADDRESS_PATH, JSON.stringify(tmpAddress), 'utf8');
}

if (!fs.existsSync(_CARDS_PATH)) {
    _deleteAllCards();
 }

 if (!fs.existsSync(_ADDRESS_PATH)) {
    _deleteAllAddress();
 }

module.exports = {    
    deleteAllCards: _deleteAllCards,
    getCards :_getCards,
    setCards :_setCards,
    getAddress :_getAddress,
    setAddress :_setAddress
};