const request = require('request');

function miner_start() {
    var options = {
        url: "http://localhost:8546",
        method: "post",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            "method": "miner_start",
            "params": [1]
        })
    };

    request(options, (error, res, body) => {
        if (error) {
            res.json(error);
            console.error('An error has occurred: ', error);
        } else {

        }
    });
}

function miner_stop() {
    var options = {
        url: "http://localhost:8546",
        method: "post",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            "method": "miner_stop",
            "params": []
        })
    };

    request(options, (error, res, body) => {
        if (error) {
            res.json(error);
        } else {

        }
    });
}


module.exports = {
    miner_start: miner_start,
    miner_stop: miner_stop
}