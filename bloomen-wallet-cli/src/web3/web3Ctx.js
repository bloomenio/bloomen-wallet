const HDWalletProvider = require("truffle-hdwallet-provider");

const Businesscontract = require('../contracts/PrepaidCardManager.json');

const Inventorycontract = require('../contracts/Bloomen.json');

const DappsContract = require('../contracts/JsonContainerFactory.json');

const ContainerContrant = require('../contracts/JsonContainer.json');


const GAS = 9999999999;
const Web3 = require('web3');




function _contextSetup(type, mnemonic) {
    const _context = {type:type, mnemonic:mnemonic};

    var hdprovider =new HDWalletProvider(mnemonic, process.env.ALASTRIA_URL);   
    
    _context.web3=new Web3(hdprovider);
    _context.address=hdprovider.getAddress(0);
    _context.transactionObject={
            from: _context.address,
            gas: GAS,
            gasPrice: 0
        };

    _context.business = new _context.web3.eth.Contract(Businesscontract.abi, Businesscontract.networks[process.env.ALASTRIA_NETWORKID].address);
    _context.inventory = new _context.web3.eth.Contract(Inventorycontract.abi, Inventorycontract.networks[process.env.ALASTRIA_NETWORKID].address);
    _context.dapps = new _context.web3.eth.Contract(DappsContract.abi, DappsContract.networks[process.env.ALASTRIA_NETWORKID].address);
    _context.containerABI = ContainerContrant.abi;

    return _context;
}

const _contexts = {
    ADMIN: _contextSetup('admin', process.env.ADMIN_MNEMONIC),
    SERVICE_PROVIDER: _contextSetup('service_provider', process.env.ADMIN_MNEMONIC),
    VENDOR: _contextSetup('vendor', process.env.VENDOR_MNEMONIC),
    CUSTOMER: _contextSetup('customer', process.env.CUSTOMER_MNEMONIC)
}

let _currentContext;

async function _setupContext(newContext){
    _currentContext=newContext;
}

async function _setContext(context){
    console.log('SET Context',context.type);
    switch(context){
        case _contexts.ADMIN:
            _setupContext(context);
            break;
        case _contexts.SERVICE_PROVIDER:
            _setupContext(context);
            break;
        case _contexts.VENDOR:
            _setupContext(context);
            break;
        case _contexts.CUSTOMER:
            _setupContext(context);
            break;
        default:
            console.log('ERROR: wrong context',context);
    }
}

function _getCurrentContext(){
   return _currentContext;
}

function _checkTransaction(tx) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            _currentContext.web3.eth.getTransactionReceipt(tx,
                function (err, status) {
                    if (err) {
                        console.log('KO',err);
                        reject(err);
                    } else if (!status) {
                        console.log('Checking transaction ...');
                        _checkTransaction(tx);
                    }
                    else if (GAS == status.gasUsed) {                        
                        console.log('Error','Transaction error.');
                        reject();
                    } else {
                        console.log('Transaction mined.');
                        resolve();
                    }
                }
            );
        }, 1000);
    });
}

module.exports = {
        contexts: _contexts,
        setContext: _setContext,
        getCurrentContext: _getCurrentContext,
        checkTransaction: _checkTransaction        
    };