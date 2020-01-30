#!/usr/bin/env node
require('dotenv').config();

const web3Ctx = require('./web3/web3Ctx');
const customer = require('./business/customer');
const vendor = require('./business/vendor');
const serviceProvider = require('./business/serviceProvider');
const utils = require('./business/utils');
const crypto = require('./business/crypto');


const figlet = require('figlet');
const inquirer = require('inquirer');
const commander = require('commander');
const version = require('../package.json').version;

const menuCommands = {};
menuCommands['SP1'] = {name: '[SP1] Create a prepaid card', value:serviceProvider.sp1};
menuCommands['SP2'] = {name: '[SP2] Add vendor', value:serviceProvider.sp2};
menuCommands['SP3'] = {name: '[SP3] Create Schema', value:serviceProvider.sp3 };
menuCommands['SP4'] = {name: '[SP4] List Schemas', value:serviceProvider.sp4 };
menuCommands['SP5'] = {name: '[SP5] Detail Schema', value: serviceProvider.sp5 };
menuCommands['SP6'] = {name: '[SP6] ON/OFF Schema', value: serviceProvider.sp6 };
menuCommands['SP61'] = {name: '[SP61] Delete Schema', value: serviceProvider.sp61 };
menuCommands['SP7'] = {name: '[SP7] Create Dapp', value: serviceProvider.sp7 };
menuCommands['SP8'] = {name: '[SP8] Show Dapp', value: serviceProvider.sp8 };
menuCommands['SP9'] = {name: '[SP9] Update Dapp', value: serviceProvider.sp9 };
menuCommands['SP10'] = {name: '[SP10] dapps List', value: serviceProvider.sp10 };                
menuCommands['SP11'] = {name: '[SP11] dapp add common repo', value: serviceProvider.sp11 };                
menuCommands['SP12'] = {name: '[SP12] dapp delete common repo', value: serviceProvider.sp12 };                
menuCommands['SP13'] = {name: '[SP13] dapp show QR', value: serviceProvider.sp13 };  
menuCommands['V1'] = {name: '[V1] Activate Prepaid card', value: vendor.v1 };
menuCommands['C1'] = {name: '[C1] Generate Prepaid card QR', value: customer.c1 };
menuCommands['C2'] = {name: '[C2] Generate purchase operation QR', value: customer.c2 };        
menuCommands['C3'] = {name: '[C3] Generate asset access request QR for device', value: customer.c3 };
menuCommands['C4'] = {name: '[C4] Generate asset access QR and purchase', value: customer.c4 };
menuCommands['UB1'] = {name: '[UB1] Balance Dashboard', value: utils.ub1 };
menuCommands['UB2'] = {name: '[UB2] Balance for address', value: utils.ub2 };
menuCommands['UB3'] = {name: '[UB3] Mint for address', value: utils.ub3 };
menuCommands['UB4'] = {name: '[UB4] Burn', value: utils.ub4 };
menuCommands['UB5'] = {name: '[UB5] My Burns', value: utils.ub5 };
menuCommands['UB6'] = {name: '[UB6] Burns for Address', value: utils.ub6 };
menuCommands['U1'] = {name: '[U1] Test of device access to an asset', value: utils.u1 };
menuCommands['U2'] = {name: '[U2] Purge all prepaid card', value: utils.u2 };                
menuCommands['U3'] = {name: '[U3] Generate 10 random PPC', value: utils.u3 };
menuCommands['U4'] = {name: '[U4] Re-activate all cards', value: utils.u4 };     
menuCommands['U6'] = {name: '[U6] List user addresses', value: utils.u6 };
menuCommands['U7'] = {name: '[U7] Add address', value: utils.u7 };
menuCommands['U8'] = {name: '[U8] Delete address', value: utils.u8 };
menuCommands['U9'] = {name: '[U9] CSV', value: utils.u9 };
menuCommands['X1'] = {name: '[X1] Create Key pair', value: crypto.x1 };
menuCommands['X2'] = {name: '[X2] Delete Key pair', value: crypto.x2 };
menuCommands['X3'] = {name: '[X3] Sign', value: crypto.x3 };
menuCommands['X4'] = {name: '[X4] Verify', value: crypto.x4 };
     
menuCommands['EXIT'] = {name: 'Exit', value: () => {process.exit()} };  
menuCommands['BACK_MAIN_MENU'] = {name:'Back', value: 0};     
 
async function prepaidCardMenu() {
    let options = [
        menuCommands['SP1'],
        menuCommands['SP2'],
        menuCommands['U2'],                
        menuCommands['U3'],
        menuCommands['U4'],
        menuCommands['BACK_MAIN_MENU'],
        menuCommands['EXIT']
                
    ];
    let questions = [
        { type: 'list', name: 'operation', message: 'Main -> Service Provider -> Prepaid Card:', choices: options }
    ];
    let answer = {operation:()=>{return;}};
    while( answer.operation != 0  ) {
        await answer.operation();        
        answer = await inquirer.prompt(questions);
    }
    return;
}

async function demoMenu() {
    let options = [
        menuCommands['U1'],
        menuCommands['BACK_MAIN_MENU'],
        menuCommands['EXIT']        
    ];
    let questions = [
        { type: 'list', name: 'operation', message: 'Main -> Service Provider -> Demo:', choices: options }
    ];
    let answer = {operation:()=>{return;}};
    while( answer.operation != 0  ) {
        await answer.operation();        
        answer = await inquirer.prompt(questions);
    }
    return;
}

async function schemasMenu() {
    let options = [
        menuCommands['SP3'],
        menuCommands['SP4'],         
        menuCommands['SP5'], 
        menuCommands['SP6'],
        menuCommands['SP61'],
        menuCommands['BACK_MAIN_MENU'],
        menuCommands['EXIT']               
    ];
    let questions = [
        { type: 'list', name: 'operation', message: 'Main -> Service Provider -> Schemas:', choices: options }
    ];
    let answer = {operation:()=>{return;}};
    while( answer.operation != 0  ) {
        await answer.operation();        
        answer = await inquirer.prompt(questions);
    }
    return;
}

async function dappsMenu() {
    let options = [
        menuCommands['SP7'], 
        menuCommands['SP8'], 
        menuCommands['SP9'], 
        menuCommands['SP10'],                 
        menuCommands['SP11'],                 
        menuCommands['SP12'],                
        menuCommands['SP13'],
        menuCommands['BACK_MAIN_MENU'],
        menuCommands['EXIT']            
    ];
    let questions = [
        { type: 'list', name: 'operation', message: 'Main -> Service Provider -> DAPPS:', choices: options }
    ];
    let answer = {operation:()=>{return;}};
    while( answer.operation != 0  ) {
        await answer.operation();        
        answer = await inquirer.prompt(questions);
    }
    return;
}

async function serviceProviderMenu() {
    
    web3Ctx.setContext(web3Ctx.contexts.SERVICE_PROVIDER);

    let options = [
        { name: 'Menu Prepaid card', value: prepaidCardMenu },
        { name: 'Menu Demo', value: demoMenu },        
        { name: 'Menu Schemas', value: schemasMenu },
        { name: 'Menu DAPPS', value: dappsMenu },
        menuCommands['BACK_MAIN_MENU'],
        menuCommands['EXIT']
    ];
    let questions = [
        { type: 'list', name: 'operation', message: 'Main -> Service Provider:', choices: options }
    ];
    let answer = {operation:()=>{return;}};
    while( answer.operation != 0  ) {
        await answer.operation();        
        answer = await inquirer.prompt(questions);
    }
    return;
}

async function cryptoMenu() {
    web3Ctx.setContext(web3Ctx.contexts.CUSTOMER);
    let options = [
        menuCommands['X1'],
        menuCommands['X2'],
        menuCommands['X3'],
        menuCommands['X4'],
        menuCommands['BACK_MAIN_MENU'],
        menuCommands['EXIT']     
    ];
    let questions = [
        { type: 'list', name: 'operation', message: 'Main -> Vendor:', choices: options }
    ];
    let answer = {operation:()=>{return;}};
    while( answer.operation != 0  ) {
        await answer.operation();        
        answer = await inquirer.prompt(questions);
    }
    return;
}


async function vendorMenu() {

    web3Ctx.setContext(web3Ctx.contexts.VENDOR);

    let options = [
        menuCommands['V1'],
        menuCommands['BACK_MAIN_MENU'],
        menuCommands['EXIT']     
    ];
    let questions = [
        { type: 'list', name: 'operation', message: 'Main -> Vendor:', choices: options }
    ];
    let answer = {operation:()=>{return;}};
    while( answer.operation != 0  ) {
        await answer.operation();        
        answer = await inquirer.prompt(questions);
    }
    return;
}

async function customerMenu() {

    web3Ctx.setContext(web3Ctx.contexts.CUSTOMER);

    let options = [
        menuCommands['C1'], 
        menuCommands['C2'],         
        menuCommands['C3'],
        menuCommands['C4'],
        menuCommands['SP13'],
        menuCommands['BACK_MAIN_MENU'],
        menuCommands['EXIT']         
    ];
    let questions = [
        { type: 'list', name: 'operation', message: 'Main -> Customer:', choices: options }
    ];
    let answer = {operation:()=>{return;}};
    while( answer.operation != 0  ) {
        await answer.operation();        
        answer = await inquirer.prompt(questions);
    }
    return;
}

async function balanceMenu() {
    let options = [
        menuCommands['UB1'], 
        menuCommands['UB2'],
        menuCommands['UB3'],
        menuCommands['UB4'],
        menuCommands['UB5'],
        menuCommands['UB6'],
        menuCommands['BACK_MAIN_MENU'],
        menuCommands['EXIT']
    ];
    let questions = [
        { type: 'list', name: 'operation', message: 'Main -> Utils -> Balance:', choices: options }
    ];
    let answer = {operation:()=>{return;}};
    while( answer.operation != 0  ) {
        await answer.operation();        
        answer = await inquirer.prompt(questions);
    }
    return;
}

async function utilsMenu() {

    web3Ctx.setContext(web3Ctx.contexts.ADMIN);

    let options = [
        { name: 'Menu Balance', value: balanceMenu },
        menuCommands['U1'],        
        menuCommands['U2'],                
        menuCommands['U3'], 
        menuCommands['U4'],
        menuCommands['U6'],
        menuCommands['U7'],
        menuCommands['U8'],
        menuCommands['U9'],
        menuCommands['BACK_MAIN_MENU'],
        menuCommands['EXIT']
    ];
    let questions = [
        { type: 'list', name: 'operation', message: 'Main -> Utils:', choices: options }
    ];
    let answer = {operation:()=>{return;}};
    while( answer.operation != 0  ) {
        await answer.operation();        
        answer = await inquirer.prompt(questions);
    }
    return;
}

async function mainMenu() {
    let menuOptions = [
        { name: "Service Provider(SP)", value: serviceProviderMenu },
        { name: "Vendor(V)", value: vendorMenu },
        { name: "Customer(C)", value: customerMenu },
        { name: "Utils(U)", value: utilsMenu },
        { name: "Crypto(X)", value: cryptoMenu },
        menuCommands['EXIT']
    ];
    let questions = [
        { type: "list", name: "operation", message: "Main:", choices: menuOptions }
    ];
    let answer = {operation:()=>{return;}};
    while( answer.operation != 0  ) {
        await answer.operation();        
        answer = await inquirer.prompt(questions);        
    }
}

figlet.text('BLOOMEN-CLI ' + version, {
    font: 'Big'
}, async function (err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data);
    commander.parse(process.argv);
    if (commander.args.length == 0) {
        mainMenu();
    }
});
