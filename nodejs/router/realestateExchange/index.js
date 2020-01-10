var express = require('express')
var router = express.Router()
var mysql = require('mysql')
const request = require('request')
var Web3 = require('web3');
var web3_ws = new Web3('ws://localhost:8545');
web3_ws.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8545'));
var web3_rpc = new Web3('http://localhost:8546');
const compileData = require('../../../smartcontract/compileData.js')
const contract = require('../../custom_modules/contract')


var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'realestatetransaction'
});

connection.connect();

router.get('/list', (req, res) => {
    var mb_id = req.user;
    if (mb_id !== undefined) {
        connection.query('select mb_account from member where mb_id = ?', [mb_id], (err, rows) => {
            if (err) res.redirect('/');
            if (rows[0].mb_account == null) res.redirect('/');
            res.render('realestateExchange/transactionList.ejs', {
                'mb_id': mb_id,
                'mb_account': rows[0].mb_account
            });
        })
    } else {
        res.redirect('/');
    }
})

router.get('/detail', (req, res) => {
    var mb_id = req.user;
    var contract_address = req.query.contract_address;
    contract.getInfo(contract_address).then((info)=>{
        if (mb_id !== undefined) info.mb_id = mb_id;
        else info.mb_id = '';
        res.render('realestateExchange/transactionDetail.ejs',info);
    }).catch((error)=>{
        res.redirect('/');
    })
})

router.get('/my_realestate_list', (req, res) => {
    var result = {};
    var mb_id = req.query.mb_id;
    var status = req.query.status;
    if (mb_id !== undefined) {
        connection.query('select realestate_ca,realestate_ctx from realestate where realestate_seller = (select mb_account from member where mb_id = ?) AND realestate_status = ?', [mb_id, status], (err, rows) => {
            if (err) {
                result.result = 0;
                result.message = '잘 못된 접근 방법입니다.';
                res.json(result);
            }
            result.result = -1;
            result.data = rows;
            res.json(result);
        })
    } else {
        result.result = 0;
        result.message = '잘 못된 접근 방법입니다.';
        res.json(result);
    }
})

router.get('/realestate_list', (req, res) => {
    var result = {};
    var status = req.query.status;
    connection.query('select realestate_seller,realestate_ca from realestate where realestate_status = ?', [status], (err, rows) => {
        if (err) {
            result.result = 0;
            result.message = '잘 못된 접근 방법입니다.';
            res.json(result);
        }
        result.result = -1;
        result.data = rows;
        res.json(result);
    })    
})

router.get('/title',(req, res) => {
    var contract_address = req.query.contract_address;
    if (contract_address) {
        contract.getTitle(contract_address).then((title)=>{
            res.json({'title':title});
        }).catch(console.log)
    }else{
        res.json({'title':''});
    }
})

router.get('/registration', (req, res) => {
    var mb_id = req.user;
    if (mb_id !== undefined) {
        connection.query('select mb_account from member where mb_id = ?', [mb_id], (err, rows) => {
            if (err) res.redirect('/');
            if (rows[0].mb_account == null) res.redirect('/');
            res.render('realestateExchange/registration.ejs', {
                'mb_id': mb_id,
                'mb_account': rows[0].mb_account
            });
        })
    } else {
        res.redirect('/');
    }
})

router.post('/registration', (req, res) => {
    var body = req.body;
    var result = {};
    web3_rpc.eth.personal.unlockAccount(body.seller, body.account_password, 600).then(() => {
        var myContract = new web3_ws.eth.Contract(compileData.ABI);
        var ctx = '';
        myContract.deploy({
                data: compileData.byte_code,
                arguments: [body.title, body.seller, body.locationAddress, Number(body.coin_type), Number(body.price)]
            })
            .send({
                from: body.seller,
                gas: 1811589,
                gasPrice: '0'
            }, function (error, transactionHash) {})
            .on('error', function (error) {
                console.log(error);
            })
            .on('transactionHash', function (transactionHash) {
                console.log('transactionHash' + transactionHash);
                ctx = transactionHash;
                result.result = -1;
                result.realestate_ctx = transactionHash;
                res.json(result);
            })
            .on('receipt', function (receipt) {
                console.log('contract address' + receipt.contractAddress) // contains the new contract address
            })
            .on('confirmation', function (confirmationNumber, receipt) {})
            .then(function (newContractInstance) {
                connection.query('insert into realestate(realestate_ca,realestate_ctx,realestate_seller) values(?,?,?)', [newContractInstance.options.address, ctx, body.seller], (err, rows) => {
                    if (err) console.log(err)
                })
            });
    }).catch(() => {
        result.result = 0;
        result.message = '블로체인 계정 비밀번호 오류';
        res.json(result);
    })
})



module.exports = router;