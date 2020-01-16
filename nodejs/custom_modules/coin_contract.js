const Web3 = require('web3');
const web3_ws = new Web3('ws://localhost:8545');
web3_ws.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8545'));
const compile_data = require('../../smartcontract/token/compileData');


function balanceOf(account, coin_type) {
    var contract_address = getCoinContractAddress(coin_type);
    var contract = new web3_ws.eth.Contract(compile_data.ABI, contract_address);
    return new Promise((resolve, reject) => {
        contract.methods.balanceOf(account).call({
            from: '0xdd4c3bd95e204ebe5d086f38f4ecadeac7379dbc'
        }, function (error, result) {
            if (error) reject(error);
            resolve(result);
        });
    })
}

function transfer(recipient, amount, coin_type) {
    var contract_address = getCoinContractAddress(coin_type);
    var contract = new web3_ws.eth.Contract(compile_data.ABI, contract_address);
    return new Promise((resolve, reject) => {
        contract.methods.transfer(recipient, amount).send({
            from: '0xdd4c3bd95e204ebe5d086f38f4ecadeac7379dbc'
        }, function (error, result) {
            if (error) reject(error);
            resolve(result);
        });
    })
}

// function transferFrom(sender, recipient, amount, coin_type) {
//     var contract_address = getCoinContractAddress(coin_type);
//     var contract = new web3_ws.eth.Contract(compile_data.ABI, contract_address);
//     return new Promise((resolve, reject) => {
//         contract.methods.transferFrom(sender, recipient, amount).send({
//             from: '0xdd4c3bd95e204ebe5d086f38f4ecadeac7379dbc',
//             gas : 70000
//         }, function (error, result) {
//             if (error) reject(error);
//             resolve(result);
//         });
//     })
// }

// function transfer(recipient, amount, coin_type) {
//     var contract_address = getCoinContractAddress(coin_type);
//     var contract = new web3_ws.eth.Contract(compile_data.ABI, contract_address);
//     return new Promise((resolve, reject) => {
//         contract.methods.transfer(recipient, amount).send({
//             from: '0xdd4c3bd95e204ebe5d086f38f4ecadeac7379dbc'
//         }).on('transactionHash', function (hash) {
//             console.log('transactionHash :: ' + hash)
//         }).on('confirmation', function (confirmationNumber, receipt) {
//             console.log('confirmation :: ' + confirmationNumber + receipt);
//         }).on('receipt', function (receipt) {
//             // receipt example
//             resolve(receipt);
//         })
//     })
// }


function transferFrom(sender, recipient, amount, coin_type) {
    var contract_address = getCoinContractAddress(coin_type);
    var contract = new web3_ws.eth.Contract(compile_data.ABI, contract_address);
    return new Promise((resolve, reject) => {
        contract.methods.transferFrom(sender, recipient, amount).send({
            from: '0xdd4c3bd95e204ebe5d086f38f4ecadeac7379dbc'
        }).on('transactionHash', function (hash) {
            console.log('transactionHash :: ' + hash)
        }).on('confirmation', function (confirmationNumber, receipt) {
            console.log('confirmation :: ' + confirmationNumber + receipt);
        }).on('receipt', function (receipt) {
            // receipt example
            resolve(receipt);
        }).catch((error) => {
            reject(error);
        })
    })
}

// function increaseAllowance(spender, addedValue, coin_type) {
//     var contract_address = getCoinContractAddress(coin_type);
//     var contract = new web3_ws.eth.Contract(compile_data.ABI, contract_address);
//     return new Promise((resolve, reject) => {
//         contract.methods.increaseAllowance(spender, addedValue).send({
//                 from: '0xdd4c3bd95e204ebe5d086f38f4ecadeac7379dbc'
//             },
//             function (error, result) {
//                 if (error) reject(error);
//                 resolve(result);
//             });
//     })
// }

// function increaseAllowance(spender, addedValue, coin_type) {
//     var contract_address = getCoinContractAddress(coin_type);
//     var contract = new web3_ws.eth.Contract(compile_data.ABI, contract_address);
//     return new Promise((resolve, reject) => {
//         contract.methods.increaseAllowance(spender, addedValue).send({
//             from: '0xdd4c3bd95e204ebe5d086f38f4ecadeac7379dbc'
//         }).on('transactionHash', function (hash) {
//             console.log('transactionHash :: ' + hash)
//         }).on('confirmation', function (confirmationNumber, receipt) {
//             console.log('confirmation :: ' + confirmationNumber + receipt);
//         }).on('receipt', (receipt) => {
//             console.log('receipt :: ' + receipt);
//         }, (error, result) => {
//             if (error) reject(error);
//             resolve(result);
//         })
//     })
// }

//transfer('0x06a825b614e3154d8097ab72271c68e8f28434f3', 3, '2').then(console.log);
//transferFrom('0xdd4c3bd95e204ebe5d086f38f4ecadeac7379dbc', '0x06a825b614e3154d8097ab72271c68e8f28434f3', 10, '2').then(console.log);
//transferFrom('0x0c2565068573ae7d26e765bc7b7fa6655787963d', '0xdd4c3bd95e204ebe5d086f38f4ecadeac7379dbc', 10, '1').then(console.log);
//increaseAllowance('0xdd4c3bd95e204ebe5d086f38f4ecadeac7379dbc', 10000000, '2').then(console.log)

function getCoinContractAddress(coin_type) {
    var contract_address = '';
    switch (coin_type) {
        case '1':
            contract_address = compile_data.btc_contract_address;
            break;
        case '2':
            contract_address = compile_data.eth_contract_address;
            break;
        default:
            contract_address = compile_data.btc_contract_address;
            break;
    }

    return contract_address;
}

module.exports = {
    balanceOf: balanceOf,
    transfer: transfer,
    transferFrom: transferFrom
}