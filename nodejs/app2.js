// // in node.js
// var Web3 = require('web3');
// var web3_ws = new Web3('ws://localhost:8545');
// web3_ws.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8545'));
// var web3_rpc = new Web3('http://localhost:8546');
// var rpc = require('node-json-rpc');
// const request = require('request');
// var fs = require('fs')
// var HDWalletProvider = require('truffle-hdwallet-provider'); 
// var ABI = require('./ABI.js')

// var mnemonic = "mountains supernatural bird..."; // 12 word mnemonic
// var provider = new HDWalletProvider(mnemonic, "http://localhost:8546");


// var web3_truffle = new Web3(provider);






// //console.log(contract);
// //contract.methods.getTitle().call();
// // contract.methods.getInfo().call().then((result) =>{
// //     //status = result;
// //     console.log(result)
// // })
// // contract.methods.getTitle().call({from: '0xdd4c3bd95e204ebe5d086f38f4ecadeac7379dbc'}, function(error, result){
// //     console.log(result);
// // });




// web3_ws.eth.getBlockNumber(function(err, rtn) {
//     var latest_block_number = rtn;
//     for(var i=0; i < latest_block_number; i++){
//         (function(i){
//             web3_ws.eth.getBlockTransactionCount(i, true, function(err, cnt) {
//                 if(cnt > 0){
//                     for(var j=0; j < cnt; j++){
//                         web3_ws.eth.getTransactionFromBlock(i,j,function(err,tx){
//                             //console.log(tx.hash);
//                         }); 
//                     }
//                 }
//             });
//         })(i);
//     }
// });



