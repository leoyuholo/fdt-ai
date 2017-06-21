const _ = require('lodash');
const Big = require('big.js');

const Stock = require('./Stock');

class Trader {
	constructor(id) {
		this.id = id;
		this.stocks = {};
	}

	findStock(stkCode) {
		let stock = this.stocks[stkCode];

		if (!stock) {
			stock = new Stock(stkCode);
			this.stocks[stkCode] = stock;
		}

		return stock;
	}

	buy(stkCode, qty, price, fee) {
		this.findStock(stkCode).buy(qty, price, fee);
	}

	sell(stkCode, qty, price, fee) {
		this.findStock(stkCode).sell(qty, price, fee);
	}

	computeProfit() {
		return _.chain(this.stocks)
			.values()
			.invokeMap('computeProfit')
			.reduce((accuProfit, profit) => accuProfit.plus(profit), new Big(0))
			.value();
	}
}

module.exports = Trader;
