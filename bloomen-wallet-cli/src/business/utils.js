const web3Ctx = require('../web3/web3Ctx');
const common = require('../common/common');
const uuidv4 = require('uuid/v4');
const inquirer = require('inquirer');
const _ = require( 'underscore');
const fs = require('fs');
const csv = require('csv-parser');
const text2png = require('text2png');

const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const handlebars = require('express-handlebars');
const i18n = require('i18n');
const path = require('path');

//const Canvas  = require('canvas');
const { createCanvas, Image } = require('canvas')
const sharp = require('sharp');
const qr = require('qr-image');
const mergeImages = require( 'merge-images');

const opts = {
    errorEventName:'error',
        logDirectory: path.join(__dirname, '..', '..', 'csv', 'outbox'), // NOTE: folder must exist and be writable...
        fileNamePattern:'csv-process-<DATE>.log',
        dateFormat:'YYYY.MM.DD'
};

const log = require('simple-node-logger').createRollingFileLogger( opts );

let _mailer;

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
            console.log(address[i].name, address[i].address,' balance:',balance.toString());
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
        console.log('Balance for '+ answer.address + ' :' + response.toString());
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


//[UB4] Burn 
async function _ub4() {    
    const ctx = web3Ctx.getCurrentContext();

    let questions = [
        { type: 'input', name: 'amount', message: 'Specify the amount:' }
    ];    
    let answer = await inquirer.prompt(questions);
    
    return new Promise((resolve, reject) => {
        ctx.erc223.methods.burn(parseInt(answer.amount)).send(ctx.transactionObject)
        .on('transactionHash', (hash) => {
            web3Ctx.checkTransaction(hash).then( () => resolve(), (err) => reject(err));
        });
    });
}

//[UB5] my Burns  
async function _ub5() {    
    const ctx = web3Ctx.getCurrentContext();
    try{
        let response = await ctx.burns.methods.getBurns(1).call(ctx.transactionObject);
        console.log( 'burns(page:1): ' ,response);
    } catch(e){
        console.log('Error:',e);
    }

}

//[UB6] Burns for Address 
async function _ub6() {    

    const ctx = web3Ctx.getCurrentContext();
    let questions = [
        { type: 'input', name: 'address', message: 'Address:'},
        { type: 'input', name: 'page', message: 'Specify the page (1-N):' }
    ];    
    let answer = await inquirer.prompt(questions)

    try{
        let response = await ctx.burns.methods.getBurnsFrom(parseInt(answer.page), answer.address).call(ctx.transactionObject);
        console.log( 'burns(page: ${answer.page} ): ' ,response);
    } catch(e){
        console.log('Error:',e);
    }

}

//[U1] Test of device access to an asset
async function _u1() { 
    const ctx = web3Ctx.getCurrentContext();   
    let questions = [
        { type: 'input', name: 'device', message: 'Specify the device key:' },
        { type: 'input', name: 'dappId', message: 'Specify the dappId:' }, 
    ];
    let answer = await inquirer.prompt(questions);
    try{
        let response = await ctx.devices.methods.isAllowed(ctx.web3.utils.keccak256(answer.device),answer.dappId).call(ctx.transactionObject);
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


//[U9] CSV 
async function _u9() {

    log.info('START - Import users from CSV ');
    const ctx = web3Ctx.getCurrentContext();
    const files = fs.readdirSync('./csv/inbox/').filter( (file) => file.toLowerCase().endsWith('.csv'));

    if (files.length == 0 ) { 
        log.info('END - no files found');
        return;
    }

    questions = [
        { type: 'list', name: 'file', message: 'Select a file', choices: files }
    ];
    let answer = await inquirer.prompt(questions);
    log.info('Process file ', answer.file);
    const execDate = new Date().toUTCString();

    fs.createReadStream('./csv/inbox/' +  answer.file)
    .pipe(csv({ separator: ';' }))
    .on('data', async (data) => {
        const cardId = getRandomId();
        const cardSecret = 'card://' + uuidv4();
        
        // INFO: por cada linea creamos la card BC
        // await ctx.business.methods.addCard(cardId, amount,ctx.web3.utils.keccak256(cardSecret)).send(ctx.transactionObject)
        // .then((tx) => {
        //     console.log('Transaction sent.');
        //     return web3Ctx.checkTransaction(tx.transactionHash);
        // });
        
        // INFO: por cada linea activamos la card BC
        // await ctx.business.methods.activateCard(randomId).send(ctx.transactionObject)
        // .then((tx) => {
        //     console.log('Transaction sent.');
        //     return web3Ctx.checkTransaction(tx.transactionHash);
        // });

        // generamos la imagen
        const qrCardFileName = await generateQRCard(cardId,cardSecret,1000);

        // persistimos el log de los procesados.
        log.info(`Process row ${data.email} ${data.firstName} ${data.lastName} ${data.lang} ${qrCardFileName}`);

        await generateEmail(data.email, data.lang, data.firstName, data.lastName, qrCardFileName);
    }).on('end', () => {
        // movemos el fichero csv a procesado
        fs.rename('./csv/inbox/' +  answer.file, path.join(__dirname, '..', '..', 'csv', 'outbox', `[${execDate}]_${answer.file}`) , (err) => {
            if (err) throw err;
            log.info('[END] File rename complete! ', `[${execDate}]_${answer.file}`);
          });
        log.info('[END] CSV File processed ',answer.file); 
    });

}



function setupMailer(){

    i18n.configure({
        locales: process.env.LOCALES,
        directory: path.join(__dirname, '..', '..', 'locales'),
      });

    _mailer = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
        },
        tls: { rejectUnauthorized: false },
    });
    const viewEngineCfg = {
        extname: '.hbs',
        layoutsDir: path.join(__dirname, '..', '..', 'templates', 'emails', 'layouts'),
        defaultLayout : 'default',
        partialsDir : path.join(__dirname, '..', '..', 'templates', 'emails', 'partials'),
        helpers: {
            __: (...args) => {
                const options = args.pop();
                return Reflect.apply(i18n.__, options.data.root, args);
              },
            __n:  (...args) => {
                const options = args.pop();
                return Reflect.apply(i18n.__n, options.data.root, args);
                },
            concat: (...args) => {
              const options = args.pop();
              return args.join('');
              },
        },
    };

    const viewEngine = handlebars.create(viewEngineCfg);

    const hbsCfg = {
      viewEngine,
      viewPath: path.join(__dirname, '..', '..', 'templates', 'emails'),
      extName: '.hbs',
    };

    const hbsInstance = hbs(hbsCfg);

    _mailer.use('compile', hbsInstance);
}


async function generateEmail(email, lang, firstName, lastName, cardFileName){
    
    if( !_mailer) {
        setupMailer();
    }

    const attachments = [
        {
          filename: 'bloomenCardCid.png',
          path: path.join(__dirname, '..', '..', cardFileName),
          cid: 'bloomenCardCid.png' 
        },
        {
            filename: 'bloomenCard.png',
            path: path.join(__dirname, '..', '..', cardFileName),
            cid: 'bloomenCard.png' 
        },
        {
            filename: 'app-store-badge.png',
            path: path.join(__dirname, '..', '..', 'img', `${lang}-app-store-badge.png`),
            cid: 'app-store-badge.png' 
        },
        {
            filename: 'google-play-badge.png',
            path: path.join(__dirname, '..', '..', 'img', `${lang}-google-play-badge.png`),
            cid: 'google-play-badge.png' 
        },
        {
            filename: 'eu-flag.jpg',
            path: path.join(__dirname, '..', '..', 'img', 'flag_yellow_low-300x201.jpg'),
            cid: 'eu-flag.jpg' 
        }
    ];


    const msg =  {
        from: process.env.MAIL_FROM,
        to: email,
        subject: i18n.__({phrase: 'email.enrollment.subject', locale: lang}),
        template: 'email_base',
        context: {
            template: 'enrollment',
            locale: lang,
            firstName: firstName,
            lastName: lastName
        },
        attachments
        };

    _mailer.sendMail(msg).then(
        () => { //success
            log.info('OK-EMAIL ',email);
            // eliminamos la imagen generada
            fs.unlinkSync(cardFileName);
        },
        (error) => { //error
            log.info('KO-EMAIL ',email,error);
            // eliminamos la imagen generada
            fs.unlinkSync(cardFileName);
        }
    );
}


async function generateQRCard(id,secret,points){
    
    const qr_png = qr.imageSync(secret, { type: 'png' , ec_level: 'H',margin: 2 });
    await sharp(qr_png).resize(185, 185).toFile(`./data/tmp/tmp_${id}_qr_resized.png`);

    fs.writeFileSync(`./data/tmp/tmp_${id}_points.png`, text2png(points + '', {color: 'white',font:'90px Roboto', localFontPath: 'fonts/roboto/Roboto-Regular.ttf',
    localFontName: 'Roboto' }));

    fs.writeFileSync(`./data/tmp/tmp_${id}_units.png`, text2png('CR', {color: 'white',font:'40px Roboto', localFontPath: 'fonts/roboto/Roboto-Regular.ttf',
    localFontName: 'Roboto'}));

    const cfgCard=[
        { src: './img/bloomen_card.png', x: 0, y: 0 },
        { src: `./data/tmp/tmp_${id}_qr_resized.png`, x: 290, y: 5 },
        { src: `./data/tmp/tmp_${id}_points.png`, x: 170, y: 205 },
        { src: `./data/tmp/tmp_${id}_units.png`, x: 400, y: 240 },
      ];
      createCanvas.Image =Image;
    let data = await mergeImages(cfgCard, {
    Canvas: createCanvas
    });
    
    data = data.replace(/^data:image\/png;base64,/, '');

    fs.writeFileSync('./data/cards/'+id+'.png', data, 'base64', function(err) {
        if (err) throw err;
    });
    
    fs.unlinkSync(cfgCard[1].src);
    fs.unlinkSync(cfgCard[2].src);
    fs.unlinkSync(cfgCard[3].src);
    return './data/cards/'+id+'.png';
}

module.exports = {
    ub1: _ub1,
    ub2: _ub2,
    ub3: _ub3,
    ub4: _ub4,
    ub5: _ub5,
    ub6: _ub6,
    u1: _u1,
    u2: _u2,
    u3: _u3,
    u4: _u4,
    u6: _u6,
    u7: _u7,
    u8: _u8,
    u9: _u9,   
};