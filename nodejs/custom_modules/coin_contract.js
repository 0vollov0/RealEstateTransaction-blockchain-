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

function transfer(recipient,amount,coin_type){  
    var contract_address = getCoinContractAddress(coin_type);
    var contract = new web3_ws.eth.Contract(compile_data.ABI, contract_address);
    return new Promise((resolve, reject) => {
        contract.methods.transfer(recipient,amount).send({
            from: '0xdd4c3bd95e204ebe5d086f38f4ecadeac7379dbc'
        }, function (error, result) {
            if (error) reject(error);
            resolve(result);
        });
    })
}

function transferFrom(sender,recipient,amount,coin_type){  
    var contract_address = getCoinContractAddress(coin_type);
    var contract = new web3_ws.eth.Contract(compile_data.ABI, contract_address);
    return new Promise((resolve, reject) => {
        contract.methods.transferFrom(sender,recipient,amount).call({
            from: '0xdd4c3bd95e204ebe5d086f38f4ecadeac7379dbc'
        }, function (error, result) {
            if (error) reject(error);
            resolve(result);
        });
    })
}

function getCoinContractAddress(coin_type) {
    var contract_address = '';
    switch (coin_type) {
        case '1':
            contract_address = compile_data.bit_contract_address;
            break;
        case '2':
            contract_address = compile_data.eth_contract_address;
            break;
        default:
            contract_address = compile_data.bit_contract_address;
            break;
    }

    return contract_address;
}

module.exports = {
    balanceOf : balanceOf,
    transfer : transfer,
    transferFrom : transferFrom
}