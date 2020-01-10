const Web3 = require('web3');
const web3_ws = new Web3('ws://localhost:8545');
web3_ws.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8545'));
const compile_data = require('../../smartcontract/compileData');

function getInfo(contract_address) {
    var contract = new web3_ws.eth.Contract(compile_data.ABI, contract_address);
    return new Promise((resolve,reject)=>{
        contract.methods.getInfo().call({
            from: '0xdd4c3bd95e204ebe5d086f38f4ecadeac7379dbc'
        }, function (error, result) {
            if (error) reject(error);
            var data = {
                'title' : result._title,
                'seller' : result._seller,
                'buyer' : result._buyer,
                'locationAddress' : result._locationAddress,
                'cointType' : result._cointType,
                'price' : result._price,
                'status' : result._status,
            }
            console.log(data);
            resolve(data);
        });
    })
}

function getTitle(contract_address){
    var contract = new web3_ws.eth.Contract(compile_data.ABI, contract_address);
    return new Promise((resolve,reject)=>{
        contract.methods.getTitle().call({
            from: '0xdd4c3bd95e204ebe5d086f38f4ecadeac7379dbc'
        }, function (error, result) {
            if (error) reject(error);
            resolve(result);
        });
    })
}

function getTimestamp(contract_address,status){
    var contract = new web3_ws.eth.Contract(compile_data.ABI, contract_address);
    return new Promise((resolve,reject)=>{
        contract.methods.getTimestamp(status).call({
            from: '0xdd4c3bd95e204ebe5d086f38f4ecadeac7379dbc'
        }, function (error, result) {
            if (error) reject(error);
            resolve(result);
        });
    })
}

getTimestamp('0x05cFFFC240EaF43e87560d8b61e8414FA0650257','trading').then(console.log);

module.exports = {
    getInfo : getInfo,
    getTitle : getTitle,
    getTimestamp : getTimestamp
}