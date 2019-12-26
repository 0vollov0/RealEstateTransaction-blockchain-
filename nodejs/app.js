// in node.js
var Web3 = require('web3');
var rpc = require('node-json-rpc');
const request = require('request');
var fs = require('fs')
var ABI = require('./ABI.js')

var web3_ws = new Web3('ws://localhost:8545');
web3_ws.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8545'));
var web3_rpc = new Web3('http://localhost:8546');
/*
let options = {
    url: "http://localhost:8546",
    method: "post",
    headers:
    { 
     "content-type": "application/json"
    },
    body: JSON.stringify({
        "jsonrpc":"2.0","method":"miner_start","params":[1],"id":74
    })
};

request(options, (error, response, body) => {
    if (error) {
        console.error('An error has occurred: ', error);
    } else {
        console.log('Post successful: response: ', body);
    }
});
*/

web3_ws.eth.getCoinbase().then(function(coinbase){    
    web3_rpc.eth.personal.unlockAccount(coinbase, "1", 600).then(console.log('Account unlocked!'))
});
/*
var myContract = new web3_ws.eth.Contract(ABI.ABI, '0xdd4c3bd95e204ebe5d086f38f4ecadeac7379dbc', {
    gasPrice: '3000000' // default gas price in wei, 20 gwei in this case
});


// When the data is already set as an option to the contract itself
myContract.options.data = '0xdd4c3bd95e204ebe5d086f38f4ecadeac7379dbc';

myContract.deploy({
    arguments: ['0xdd4c3bd95e204ebe5d086f38f4ecadeac7379dbc', 'My String','My String',21321]
})
.send({
    from: '0xdd4c3bd95e204ebe5d086f38f4ecadeac7379dbc',
    gas: 1500000,
    gasPrice: '3000000'
})
.then(function(newContractInstance){
    console.log("gregergerger"+newContractInstance.options.address) // instance with the new contract address
});


web3_ws.eth.getBlockNumber(function(err,rtn){
    if(err) return console.log(err);
    var latest_block_number = rtn;
    for(var i=0; i <= latest_block_number; i++){
        web3_ws.eth.getBlock(i, false, function(err, block) {
            //console.log(block);
        });
    }
});
*/
/*
var contract = new web3_ws.eth.Contract(ABI.ABI, '0x84c6b3495de306dfa3c048b331208ff73811655bcf23011976475a91cebe46bc',{
    gasPrice: '3000000' // default gas price in wei, 20 gwei in this case
})
console.log(contract);
*/


// var contract = new web3_ws.eth.Contract(ABI.ABI,'0x978b3569B6B3A2586AF07894B4649F839D36d7A3');
// var status;
// contract.methods.getInfo().call().then((result) =>{
//     status = result;
// })



var subscription1 = web3_ws.eth.subscribe('pendingTransactions', function(error, result){
    if (!error)
        console.log(result);
})
.on("data", function(transaction){
    console.log(transaction);
});

// unsubscribes the subscription
subscription1.unsubscribe(function(error, success){
    if(success)
        console.log('Successfully unsubscribed!');
});

var subscription2 = web3_ws.eth.subscribe('newBlockHeaders', function(error, result){
    if (!error) {
        console.log(result);

        return;
    }

    console.error(error);
})
.on("data", function(blockHeader){
    console.log(blockHeader);
})
.on("error", console.error);

// unsubscribes the subscription
subscription2.unsubscribe(function(error, success){
    if (success) {
        console.log('Successfully unsubscribed!');
    }
});

var subscription3 = web3_ws.eth.subscribe('syncing', function(error, sync){
    if (!error)
        console.log(sync);
})
.on("data", function(sync){
    // show some syncing stats
})
.on("changed", function(isSyncing){
    if(isSyncing) {
        // stop app operation
    } else {
        // regain app operation
    }
});

// unsubscribes the subscription
subscription3.unsubscribe(function(error, success){
    if(success)
        console.log('Successfully unsubscribed!');
});

web3_ws.eth.getBlockNumber(function(err, rtn) {
    var latest_block_number = rtn;
    for(var i=0; i < latest_block_number; i++){
        (function(i){
            web3_ws.eth.getBlockTransactionCount(i, true, function(err, cnt) {
                if(cnt > 0){
                    for(var j=0; j < cnt; j++){
                        web3_ws.eth.getTransactionFromBlock(i,j,function(err,tx){
                            console.log(tx.hash);
                        }); 
                    }
                }
            });
        })(i);
    }
});