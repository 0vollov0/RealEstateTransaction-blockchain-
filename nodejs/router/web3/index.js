var express = require('express')
var router = express.Router()
var Web3 = require('web3');
var rpc = require('node-json-rpc');
const request = require('request');
var fs = require('fs')
var HDWalletProvider = require('truffle-hdwallet-provider');
// var ABI = require('../../ABI.js')

var web3_ws = new Web3('ws://localhost:8545');
web3_ws.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8545'));
var web3_rpc = new Web3('http://localhost:8546');


router.get('/web3', (req, res) => {
    var mb_id = req.user;
    if (mb_id !== undefined) {
        res.render('realestateExchange/registration.ejs', {
            'mb_id': mb_id
        });
    } else {
        res.render('realestateExchange/registration.ejs', {
            'mb_id': null
        });
    }
})

router.post('/personal_newAccount', (req, res) => {
    var params = req.body.params;
    var options = {
        url: "http://localhost:8546",
        method: "post",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            "jsonrpc": "2.0",
            "id": 10,
            "method": "personal_newAccount",
            "params": [params]
        })
    };

    request(options, (error, response, body) => {
        if (error) {
            res.json(error);
            console.error('An error has occurred: ', error);
        } else {
            res.json(body);
            console.log('Post successful: response: ', body);
        }
    });
})

router.get('/eth_pendingTransactions', (req, res) => {
    var options = {
        url: "http://localhost:8546",
        method: "post",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            "jsonrpc": "2.0",
            "method": "eth_pendingTransactions",
            "params": [],
            "id": 1
        })
    };

    request(options, (error, response, body) => {
        if (error) {
            res.json(error);
            console.error('An error has occurred: ', error);
        } else {
            var peding_transaction = new Array();

            var result = JSON.parse(body).result;
            for (let index = 0; index < result.length; index++) {
                const element = result[index];
                if(req.query.account == element.from){
                    peding_transaction.push({
                        'from': element.from,
                        'hash': element.hash
                    })
                }
            }
            res.json(peding_transaction);
        }
    });
})



module.exports = router;