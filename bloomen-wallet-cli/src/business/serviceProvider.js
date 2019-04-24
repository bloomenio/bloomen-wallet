const web3Ctx = require('../web3/web3Ctx');
const common = require('../common/common');
const jsonPathLibrary = require('json-path-value');
const jsonPath = new jsonPathLibrary.JsonPath();
const inquirer = require('inquirer');
const fs = require('fs');
const prettyJson = require('prettyjson');
const qrcode = require('qrcode-terminal');
const RLP = require('rlp');
const _ = require( 'underscore');

const jsonPrintOptions = {
    noColor: false
};

//[SP1] Create a prepaid card
async function _sp1() {
    let cards = common.getCards();
    const ctx = web3Ctx.getCurrentContext();
    let questions = [
        { type: 'input', name: 'secret', message: 'Specify the secret key:' },
        { type: 'input', name: 'amount', message: 'Amount of tokens:' }
    ];    
    let answer = await inquirer.prompt(questions);
    let randomId = Math.floor(Math.random() * (Math.pow(2, 50) - 1)) + 1;

    return new Promise((resolve, reject) => {
        ctx.prepaidCardManager.methods.addCard(randomId, answer.amount, ctx.web3.utils.keccak256(answer.secret)).send(ctx.transactionObject)
        .on('transactionHash', (hash) => {
            web3Ctx.checkTransaction(hash).then( () => 
            {
                cards.push({ id: randomId, secret: answer.secret, active: false, points: answer.amount});
                common.setCards(cards); 
                resolve();
            }
            , (err) => reject(err));
        });
    });
       
}

//[SP2] Add vendor
async function _sp2() {
    console.log('VENDOR Address:', web3Ctx.contexts.VENDOR.address);
    const ctx = web3Ctx.getCurrentContext();
    let questions = [
        { type: 'input', name: 'vendor', message: 'Vendor Address:' }
    ];

    let answer = await inquirer.prompt(questions);
    
    
    let data = await ctx.prepaidCardManager.methods.isSigner(answer.vendor).call(ctx.transactionObject);
    console.log('isSigner:',data);

    return new Promise((resolve, reject) => {
        ctx.prepaidCardManager.methods.addSigner(answer.vendor).send(ctx.transactionObject)
        .on('transactionHash', (hash) => {
            web3Ctx.checkTransaction(hash).then( () => resolve(), (err) => reject(err));
        });
    });
    
}

//[SP3] Create Schema
async function _sp3() {
    let questions = [
        { type: 'input', name: 'schemaId', message: 'Schema id:' },
        { type: 'input', name: 'schemaValidityDays', message: 'Schema validity days:' },
        { type: 'input', name: 'schemaPrice', message: 'Schema price:' },
        { type: 'input', name: 'assetValidityDays', message: 'Asset validity days:' },        
    ]; 

    let answer = await inquirer.prompt(questions); 

    const pathValues = [];
    const schemaId=parseInt(answer.schemaId);

    let n =  Date.now();
    n = n / 1000;
    n += 60*60*24*parseInt(answer.schemaValidityDays); // schema valid for one year 
    n = Math.trunc(n);
    pathValues.push(n); // schema expiration date
    pathValues.push(schemaId); // id

    pathValues.push(parseInt(answer.schemaPrice)); // price
    pathValues.push(60*60*24*parseInt(answer.assetValidityDays)); // asset valid for 30 days

    let clearArray = await _getClearHouseArray();

    pathValues.push(clearArray);
    const encodedData = RLP.encode(pathValues);

    const ctx = web3Ctx.getCurrentContext();

    return new Promise((resolve, reject) => {
        ctx.schemas.methods.createSchema(schemaId,encodedData).send(ctx.transactionObject)
        .on('transactionHash', (hash) => {
            web3Ctx.checkTransaction(hash).then( () => resolve(), (err) => reject(err));
        });
    });
}

async function _getClearHouseArray() {
    const clearArray = [];
    let address = common.getAddress();
    const choices = [];
    address.forEach(item => {         
        choices.push({name: item.name +' '+ item.address,value: item});
    });

    let questions = [
        { type: 'list', name: 'percentage', message: 'Percentage', choices: ['10','20','30','40','50'] },
        { type: 'list', name: 'address', message: 'Address', choices: choices},
        { type: 'confirm', name: 'more', message: 'more?', default: false},
               
    ]; 

    let moreItems = true;
    while (moreItems){
        let answer = await inquirer.prompt(questions); 
        const clearItem=[];
        clearItem.push(parseInt(answer.percentage));
        clearItem.push(answer.address.address);
        clearItem.push(answer.address.name);

        clearArray.push(clearItem);

        moreItems = answer.more;
    }

    return clearArray;
}

//[SP4] List Schemas
async function _sp4() {    
  
    const ctx = web3Ctx.getCurrentContext();
    try {
        let schemas = await ctx.schemas.methods.getSchemas().call(ctx.transactionObject);
        console.log('Schemas:',schemas);
    } catch(e) {
        console.log('Error:',e);
    }   
}


//[SP5] Detail Schema
async function _sp5() {    
    let questions = [
        { type: 'input', name: 'schemaId', message: 'Schema id:' }
    ];    
    let answer = await inquirer.prompt(questions);

    const ctx = web3Ctx.getCurrentContext();
    try {
        let schema = await ctx.schemas.methods.getSchema(answer.schemaId).call(ctx.transactionObject);
        console.log('Schema:',schema);
    } catch(e) {
        console.log('Error:',e);
    }   
}

//[SP6] ON/OFF Schema
async function _sp6() {
    let questions = [
        { type: 'input', name: 'schemaId', message: 'Schema id:' },
        { type: 'list', name: 'status', message: 'Schema status:' , choices: ['enabled','disabled']},
    ];    
    let answer = await inquirer.prompt(questions);

    const ctx = web3Ctx.getCurrentContext();

    let operation = ctx.schemas.methods.validateSchema;
    
    if (answer.status == 'disabled') {
        operation = ctx.schemas.methods.invalidateSchema
    }

    return new Promise((resolve, reject) => {
        operation(answer.schemaId).send(ctx.transactionObject)
        .on('transactionHash', (hash) => {
            web3Ctx.checkTransaction(hash).then( () => resolve(), (err) => reject(err));
        });
    });

}

//[SP7] Create Dapp
async function _sp7() {
    console.log('Create a new JSON container.');
    const files = fs.readdirSync('./data/dapp/');
    questions = [
        { type: 'input', name: 'name', message: 'Give a name' },
        { type: 'list', name: 'file', message: 'Select a file', choices: files }
    ];
    let answer = await inquirer.prompt(questions);
    let json = JSON.parse(fs.readFileSync('./data/dapp/' + answer.file, 'utf8'));
    try{
        await _createContainer(json, answer.name);
        console.log(answer.name + ' container created.');
    } catch(err) {
        console.log(err);
    }
}

function _createContainer(json, name) {
    const ctx = web3Ctx.getCurrentContext();
    let jsonPathPairs = jsonPath.marshall(json, "", []);
    let pathValues = [];
    for (i = 0; i < jsonPathPairs.length; i++) {
        let pathValue = [];
        pathValue.push(jsonPathPairs[i].getPath());
        pathValue.push(jsonPathPairs[i].getValue());
        pathValue.push(jsonPathPairs[i].getType());
        pathValues.push(pathValue);
    }
    let encodedData = RLP.encode(pathValues);
    
    return new Promise((resolve, reject) => {
        ctx.dapps.methods.createContainer(encodedData, name).send(ctx.transactionObject)
        .on('transactionHash', (hash) => {
            web3Ctx.checkTransaction(hash).then( () => resolve(), (err) => reject(err));
        });
    });
   
}

//[SP8] Show Dapp
async function _sp8() {    
    const ctx = web3Ctx.getCurrentContext();
    let containers = await ctx.dapps.methods.getContainers().call(ctx.transactionObject);
    let containersMetadata = [];
    let i;
    for (i = 0; i < containers.length; i++) {
        containersMetadata.push({ name: containers[i].name + " "+ containers[i].addr, value: containers[i].addr });
    }
    if (containersMetadata.length == 0) {
        console.log("There are no containers.");
        return;
    }
    let questions = [
        { type: 'list', name: 'container', message: 'Choose a container', choices: containersMetadata }
    ];
    console.log('Get data from a container');
    let answer = await inquirer.prompt(questions);
    let container = await _getDapp(answer.container);
    console.log(answer.container+'\n',prettyJson.render(jsonPath.unMarshall(container), jsonPrintOptions));
}

async function _getDapp(address) {
    const ctx = web3Ctx.getCurrentContext();
    let jsonContainerInstance = new ctx.web3.eth.Contract(ctx.containerABI, address);
    let result = await jsonContainerInstance.methods.getData().call(ctx.transactionObject);
    let storedJsonPathPairs = [];
    let i;
    for (i = 0; i < result.length; i++) {
        let jsonPathValue = result[i];
        let type = jsonPathValue[2];
        let value;
        if (jsonPath.TYPE_ARRAY == type) {
            value = JSON.parse(jsonPathValue[1]);
        } else {
            value = jsonPathValue[1];
        }
        storedJsonPathPairs.push(new jsonPathLibrary.JsonPathPair(jsonPathValue[0], value, type, -1));
    }
    return storedJsonPathPairs;
}

//[SP9] Update Dapp
async function _sp9() {
    const ctx = web3Ctx.getCurrentContext();
    let containers = await ctx.dapps.methods.getContainers().call(ctx.transactionObject);
    let containersMetadata = [];
    let i;
    for (i = 0; i < containers.length; i++) {
        containersMetadata.push({ name: containers[i].name + " "+ containers[i].addr, value: containers[i].addr });
    }
    if (containersMetadata.length == 0) {
        console.log("There are no containers.");
        return;
    }        
    files = fs.readdirSync('./data/dapp/');
    questions = [
        { type: 'list', name: 'container', message: 'Choose a container', choices: containersMetadata },
        { type: 'list', name: 'file', message: 'Select a file', choices: files }
    ];
    let answer = await inquirer.prompt(questions);
    let json = JSON.parse(fs.readFileSync('./data/dapp/'+ answer.file, 'utf8'));
    try {
        await _updateContainer(json, answer.container); 
        console.log('Container updated.');  
    } catch(err) {
        console.log(err);
    }
    
}

async function _updateContainer(json, address) {
    const ctx = web3Ctx.getCurrentContext();    
    let jsonContainerInstance = new ctx.web3.eth.Contract(ctx.containerABI, address);
    let unmarshalledStorage = jsonPath.unMarshall(await _getDapp(address));
    let differences = jsonPath.compareJsonPath(unmarshalledStorage, json);
    let i;
    let changes = [];
    for (i = 0; i < differences.length; i++) {
        let pathValueDiff = [];
        let difference = differences[i];
        pathValueDiff.push(difference.path);
        if (difference.type == jsonPath.TYPE_STRING) {
            pathValueDiff.push(difference.value);
        } else {
            pathValueDiff.push(JSON.stringify(difference.value));
        }
        pathValueDiff.push(difference.type);
        pathValueDiff.push(difference.diff);
        changes.push(pathValueDiff);
    }
    let encodedDataUpdate = RLP.encode(changes);

    return new Promise((resolve, reject) => {
        jsonContainerInstance.methods.update(encodedDataUpdate).send(ctx.transactionObject)
        .on('transactionHash', (hash) => {
            web3Ctx.checkTransaction(hash).then( () => resolve(), (err) => reject(err));
        });
    });

}

//[SP10] dapps List
async function _sp10() {
  let dapps = await _dappList();
  console.log('DAPP List:')
  dapps.forEach(dapp => {   
    console.log(dapp.name,dapp.addr,dapp.mandatory);
  });  
}

async function _dappList() {
    const ctx = web3Ctx.getCurrentContext();
    let dapps = await ctx.dapps.methods.getContainers().call(ctx.transactionObject);
    let dappsInvetory = await ctx.inventory.methods.getDapps().call(ctx.transactionObject);
    dapps.forEach(dapp => { 
      dapp.mandatory = (dappsInvetory.indexOf(dapp.addr) > -1);        
    });  
    return dapps;
}

//[SP11] dapp add common repo
async function _sp11() {
  const ctx = web3Ctx.getCurrentContext();
  let dapps = await _dappList();  
  const proposedDapps = _.reject(dapps, (item) => item.mandatory);
  const choices = [];
  proposedDapps.forEach(item => {         
      choices.push({name: item.name +' '+ item.addr,value: item});
  });

  questions = [
    { type: 'list', name: 'container', message: 'Choose a dapp', choices: choices }
  ];

  let answer = await inquirer.prompt(questions);
  return new Promise((resolve, reject) => {
    ctx.inventory.methods.addDapp(answer.container.addr).send(ctx.transactionObject)
    .on('transactionHash', (hash) => {
        web3Ctx.checkTransaction(hash).then( () => resolve(), (err) => reject(err));
    });
  });


}

//[SP12] dapp delete common repo
async function _sp12() {
    const ctx = web3Ctx.getCurrentContext();
    let dapps = await _dappList();  
    const proposedDapps = _.reject(dapps, (item) => !item.mandatory);
    const choices = [];
    proposedDapps.forEach(item => {         
        choices.push({name: item.name +' '+ item.addr,value: item});
    });

    questions = [
        { type: 'list', name: 'container', message: 'Choose a dapp', choices: choices }
    ];
    let answer = await inquirer.prompt(questions);

    return new Promise((resolve, reject) => {
        ctx.inventory.methods.deleteDapp(answer.container.addr).send(ctx.transactionObject)
        .on('transactionHash', (hash) => {
            web3Ctx.checkTransaction(hash).then( () => resolve(), (err) => reject(err));
        });
    });

}

//[SP13] dapp show QR
async function _sp13() {
    const ctx = web3Ctx.getCurrentContext();
    let containers = await ctx.dapps.methods.getContainers().call(ctx.transactionObject);
    let containersMetadata = [];
    let i;
    for (i = 0; i < containers.length; i++) {
        containersMetadata.push({ name: containers[i].name + " "+ containers[i].addr, value: containers[i].addr });
    }
    if (containersMetadata.length == 0) {
        console.log("There are no containers.");
        return;
    }
    let questions = [
        { type: 'list', name: 'container', message: 'Choose a container', choices: containersMetadata }
    ];
    console.log('Get data from a container');
    let answer = await inquirer.prompt(questions);
    const qrData= 'dapp://'+answer.container;
    console.log(qrData);
    qrcode.generate(qrData, function (str) { 
        console.log(str);
    });
}

module.exports = {
        sp1: _sp1,
        sp2: _sp2,
        sp3: _sp3,
        sp4: _sp4,
        sp5: _sp5,
        sp6: _sp6,
        sp7: _sp7,
        sp8: _sp8,
        sp9: _sp9,
        sp10: _sp10,
        sp11: _sp11,
        sp12: _sp12,
        sp13: _sp13
    };
