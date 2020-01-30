
const { generateKeyPairSync, createSign, createVerify } = require('crypto');
const inquirer = require('inquirer');
const fs = require('fs');
const common = require('../common/common');

//[X1] Create Asimetric key pair for dapp
async function _x1() {
  files = fs.readdirSync('./data/dapp/');
  questions = [
    { type: 'list', name: 'file', message: 'Select a file', choices: files }
  ];
  let answer = await inquirer.prompt(questions);
  let jsonObject = JSON.parse(fs.readFileSync('./data/dapp/'+ answer.file, 'utf8'));
  
  if (jsonObject.publicKey) {
    console.log("Error: existing pki for:", answer.file );
    return;
  }

  const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 1024,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });

  jsonObject.publicKey=publicKey;

  fs.writeFileSync('./data/dapp/'+ answer.file, JSON.stringify(jsonObject, null, 4) );
  fs.writeFileSync(`./data/private/${answer.file}.pem` , privateKey );
  
}

//[X2] Delete Asimetric key pair for dapp
async function _x2() {
  files = fs.readdirSync('./data/dapp/');
  questions = [
    { type: 'list', name: 'file', message: 'Select a file', choices: files }
  ];
  let answer = await inquirer.prompt(questions);
  let jsonObject = JSON.parse(fs.readFileSync('./data/dapp/'+ answer.file, 'utf8'));
  if (!jsonObject.publicKey) {
    console.log("Error: not existing pki for:", answer.file );
    return;
  }
  delete jsonObject.publicKey;

  questions = [
    { type: 'confirm', name: 'confirm', message: 'Are you sure (this action cannot be undone)?', default: false }
  ];
  let answer2 = await inquirer.prompt(questions);
  if (answer2.confirm) {
    fs.writeFileSync('./data/dapp/'+ answer.file, JSON.stringify(jsonObject, null, 4) );
    fs.unlinkSync(`./data/private/${answer.file}.pem` );
  } else {
    console.log('Noop');
  }
  
}

//[X3] Sign
async function _x3() {
  files = fs.readdirSync('./data/dapp/');
  questions = [
    { type: 'list', name: 'file', message: 'Select a file', choices: files },
    { type: 'input', name: 'payload', message: 'Payload' }

  ];
  let answer = await inquirer.prompt(questions);
  let jsonObject = JSON.parse(fs.readFileSync('./data/dapp/'+ answer.file, 'utf8'));
  if (!jsonObject.publicKey) {
    console.log("Error: not existing pki for:", answer.file );
    return;
  }

  const privateKey = fs.readFileSync(`./data/private/${answer.file}.pem`, { encoding : 'utf8' });

  const signer = createSign('RSA-SHA512');
  signer.update(answer.payload);
  const signature = signer.sign(privateKey, 'hex');
  console.log('Payload: ', answer.payload);
  console.log('Signature: ', signature);
}

//[X4] Verify
async function _x4() {
  files = fs.readdirSync('./data/dapp/');
  questions = [
    { type: 'list', name: 'file', message: 'Select a file', choices: files },
    { type: 'input', name: 'payload', message: 'Payload' },
    { type: 'input', name: 'signature', message: 'Signature' }

  ];
  let answer = await inquirer.prompt(questions);
  let jsonObject = JSON.parse(fs.readFileSync('./data/dapp/'+ answer.file, 'utf8'));
  if (!jsonObject.publicKey) {
    console.log("Error: not existing pki for:", answer.file );
    return;
  }

  const verifier = createVerify('RSA-SHA512');
  verifier.update(answer.payload);
  const publicKeyBuf = new Buffer.from(jsonObject.publicKey, 'utf-8');
  const signatureBuf = new Buffer.from(answer.signature, 'hex');
  const result       = verifier.verify(publicKeyBuf, signatureBuf);

  console.log('Verified: ' ,result);

}

module.exports = {
        x1: _x1,
        x2: _x2,
        x3: _x3,
        x4: _x4
};