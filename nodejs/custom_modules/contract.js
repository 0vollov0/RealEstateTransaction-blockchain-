const Web3 = require('web3');
const web3_ws = new Web3('ws://localhost:8545');
web3_ws.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8545'));
const compile_data = require('../../smartcontract/compileData');
var web3_rpc = new Web3('http://localhost:8546');
var mysql = require('mysql')

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'realestatetransaction'
});

connection.connect();

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
                'coinType' : result._coinType,
                'price' : result._price,
                'status' : result._status,
            }
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

function purchase(contract_address,price,buyer){
    var contract = new web3_ws.eth.Contract(compile_data.ABI, contract_address);
    return new Promise((resolve, reject) => {
        contract.methods.purchase(price,buyer).send({
            from: '0xdd4c3bd95e204ebe5d086f38f4ecadeac7379dbc'
        }, function (error, result) {
            if (error) reject(error);
            resolve(result);
        });
    })
}

//status number 0,1,2
function updateStatus(contract_address,status){
    var contract = new web3_ws.eth.Contract(compile_data.ABI, contract_address);
    return new Promise((resolve, reject) => {
        contract.methods.updateStatus(status).send({
            from: '0xdd4c3bd95e204ebe5d086f38f4ecadeac7379dbc'
        }, function (error, result) {
            if (error) reject(error);
            resolve(result);
        })
    })
}

function modify(contract_address,seller,account_password,title,locationAddress,coinType,price){
    return new Promise((resolve, reject) => {
        web3_rpc.eth.personal.unlockAccount(seller, account_password, 600).then(() => {
            var contract = new web3_ws.eth.Contract(compile_data.ABI, contract_address);
            contract.methods.modify(title,locationAddress,Number(coinType),Number(price)).send({
                from: seller
            },function (error, result) {
                if (error) reject(error);
                resolve(result);
            })
        })
    })
}

//updateStatus('0x357e4f4f4A010e38150417158C9E0d4DaDDc5e0c',3).then(console.log);

module.exports = {
    getInfo : getInfo,
    getTitle : getTitle,
    getTimestamp : getTimestamp,
    purchase : purchase,
    updateStatus : updateStatus,
    modify : modify
}