const _ = require('lodash');
const Big = require('big.js');

const Stock = require('./Stock');

class Trader {

	constructor (id) {
		this.id = id;
		this.stocks = {};
	}

	findStock (stkCode) {
		var stock = this.stocks[stkCode];
		if (!stock) stock = this.stocks[stkCode] = new Stock(stkCode);
		return stock;
	}

	buy (stkCode, qty, price, fee, ts) {
		this.findStock(stkCode).buy(qty, price, fee, ts);
	}

	sell (stkCode, qty, price, fee, ts) {
		this.findStock(stkCode).sell(qty, price, fee, ts);
	}

	computeProfit () {
		return _.chain(this.stocks)
			.values()
			.invokeMap('computeProfit')
			.reduce((accuProfit, profit) => accuProfit.plus(profit), new Big(0))
			.value();
	}
}

module.exports = Trader;
