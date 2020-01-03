const axios = require("axios");
const cheerio = require("cheerio");
const log = console.log;
var mysql = require('mysql')

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'realestatetransaction'
});

connection.connect();

function crawling_coin_cost() {
  const getHtml = async () => {
    try {
      return await axios.get("https://www.bithumb.com/");
    } catch (error) {
      console.error(error);
    }
  };

  getHtml()
    .then(html => {
      let coin_cost = [];
      const $ = cheerio.load(html.data);
      var btc = $('strong#assetRealBTC_KRW').text();
      var eth = $('strong#assetRealETH_KRW').text();

      btc = parseFloat(btc.replace(/[^0-9]/g, ""));
      eth = parseFloat(eth.replace(/[^0-9]/g, ""));

      coin_cost[0] = btc;
      coin_cost[1] = eth;
      return coin_cost;
    })
    .then(coin_cost =>{
      connection.query('UPDATE coin SET coin_yesterday_value = coin_today_value, coin_today_value = ? WHERE coin_idx = 1',[coin_cost[0]], (err,rows) =>{
        if(err) log(err)
      })
      connection.query('UPDATE coin SET coin_yesterday_value = coin_today_value, coin_today_value = ? WHERE coin_idx = 2',[coin_cost[1]], (err,rows) =>{
        if(err) log(err)
      })
    });
}

module.exports = {
  crawling_coin_cost : crawling_coin_cost
}