const _ = require('lodash');

const Trader = require('./Trader');

class ProfitTable {

	constructor () {
		this.traders = {};
	}

	findTrader (traderId) {
		var trader = this.traders[traderId];
		if (!trader) trader = this.traders[traderId] = new Trader(traderId);
		return trader;
	}

	addOrder ({Trader: traderId, StkCode: stkCode, Quantity: qty, Price: price, TradeType: type, Fee: fee, Timestamp: ts}) {
		const trader = this.findTrader(traderId);

		if (type === 'Buy')
			trader.buy(stkCode, qty, price, fee, ts);
		else if (type === 'Sell')
			trader.sell(stkCode, qty, price, fee, ts);
		else
			throw new Error(`Unknown TradeType: ${type}`);

		return true;
	}

	computeRanking () {
		return _.values(this.traders)
			.map(trader => ({traderId: trader.id, profit: trader.computeProfit()}))
			.sort((a, b) => a.profit.lt(b.profit));
	}
}

module.exports = ProfitTable;