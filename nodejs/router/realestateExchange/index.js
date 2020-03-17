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
const coin_contract = require('../../custom_modules/coin_contract')


var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'realestatetransaction'
});

connection.connect();

function getAccount(mb_id) {
    return new Promise((resolve, reject) => {
        if (mb_id !== undefined) {
            connection.query('select mb_account from member where mb_id = ?', [mb_id], (err, rows) => {
                if (err) reject(err)
                if (rows[0].mb_account == null) reject(err)
                else resolve(rows[0].mb_account)
            })
        } else {
            resolve('');
        }
    })
}

router.get('/list', (req, res) => {
    var mb_id = req.user;
    getAccount(mb_id).then((mb_account) => {
        res.render('realestateExchange/transactionList.ejs', {
            'mb_id': mb_id,
            'mb_account': mb_account
        });
    }).catch((err) => {
        res.redirect('/');
    })
})

router.get('/detail', (req, res) => {
    var mb_id = req.user;
    var contract_address = req.query.contract_address;
    contract.getInfo(contract_address).then((info) => {
        if (mb_id !== undefined) info.mb_id = mb_id;
        else info.mb_id = '';
        var status = '';

        switch (info.status) {
            case '0':
                status = 'trading';
                info.status = '판매중';
                break;
            case '1':
                status = 'complete';
                info.status = '거래완료';
                break;
            case '2':
                status = 'terminated';
                info.status = '판매중지';
                break;
            default:
                status = 'trading';
                info.status = '판매중';
                break;
        }
        getAccount(mb_id).then((mb_account) => {
            info.mb_account = mb_account;
            contract.getTimestamp(contract_address, status).then((timestamp) => {
                info.contract_address = contract_address;
                info.timestamp = timestamp;
                res.render('realestateExchange/transactionDetail.ejs', info);
            }).catch((error) => {
                res.render('realestateExchange/transactionDetail.ejs', info);
            })
        })
    }).catch((error) => {
        res.redirect('/');
    })
})

router.get('/my_realestate_list', (req, res) => {
    var result = {};
    var mb_id = req.query.mb_id;
    var status = req.query.status;
    if (mb_id !== undefined) {
        connection.query('select realestate_ca,realestate_ctx from realestate where (realestate_seller = (select mb_account from member where mb_id = ?) OR realestate_buyer = (select mb_account from member where mb_id = ?)) AND realestate_status = ?', [mb_id, mb_id, status], (err, rows) => {
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

router.get('/title', (req, res) => {
    var contract_address = req.query.contract_address;
    if (contract_address) {
        contract.getTitle(contract_address).then((title) => {
            res.json({
                'title': title
            });
        }).catch(console.log)
    } else {
        res.json({
            'title': ''
        });
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
                gas: 2002767,
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
        result.message = '블록체인 계정 비밀번호 오류';
        res.json(result);
    })
})

router.post('/purchase', (req, res) => {
    var body = req.body;
    var contract_address = body.contract_address;
    var seller = body.seller;
    var buyer = body.buyer;
    var price = Number(body.price);
    var coin_type = body.coin_type;

    contract.purchase(contract_address, price, buyer).then((result) => {
        console.log(result);
        connection.query('update realestate set realestate_status = 1, realestate_buyer = ? where realestate_ca = ?', [buyer, contract_address], (err, rows) => {
            if (err) console.log(err)
            coin_contract.transferFrom(buyer, seller, price, coin_type).then((result) => {
                if (result) {
                    console.log('코인 전송 : ' + result)
                    res.json({
                        'result': true
                    });
                }
            }).catch((error) => {
                console.log('코인 전송 : ' + error)
                res.json({
                    'result': false,
                    'message': '코인 전송 에러'
                });
            })

        })
    }).catch((error) => {
        console.log('purchase error ' + error);
        res.json({
            'result': false,
            'message': '부동산 구매 에러'
        });
    })
})

router.get('/modify', (req, res) => {
    var mb_id = req.user;
    getAccount(mb_id).then((mb_account) => {
        var contract_address = req.query.contract_address;
        var title = req.query.title;
        var seller = req.query.seller;
        var price = req.query.price;
        var locationAddress = req.query.locationAddress;
        var coinType = req.query.coinType;

        if (Number(seller) != Number(mb_account)) res.redirect('/');
        else res.render('realestateExchange/modify.ejs', {
            'contract_address': contract_address,
            'mb_id': mb_id,
            'mb_account': mb_account,
            'title': title,
            'coinType': coinType,
            'price': price,
            'locationAddress': locationAddress
        });

    }).catch((err) => {
        res.redirect('/');
    })
})

router.post('/modify', (req, res) => {
    var body = req.body;
    var result = {};
    contract.modify(body.contract_address, body.seller, body.account_password, body.title, body.locationAddress, body.coinType, body.price).then((transactionHash) => {
        result.result = -1;
        result.realestate_ctx = transactionHash;
        res.json(result);
    }).catch(() => {
        result.result = 0;
        result.message = '블록체인 계정 비밀번호 오류';
        res.json(result);
    })
})

router.post('/status', (req, res) => {
    var body = req.body;
    var result = {};

    contract.updateStatus(body.contract_address, body.status).then(() => {
        result.result = true;
        res.json(result);
    }).catch((err) => {
        result.result = false;
        res.json(result);
    })
})

module.exports = router;