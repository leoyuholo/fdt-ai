const _ = require('lodash');

const Trader = require('./Trader');

class ProfitTable {
	constructor() {
		this.traders = {};
	}

	findTrader(traderId) {
		let trader = this.traders[traderId];

		if (!trader) {
			trader = new Trader(traderId);
			this.traders[traderId] = trader;
		}

		return trader;
	}

	addOrder({ Trader: traderId, StkCode: stkCode, Quantity: qty, Price: price, TradeType: type, Fee: fee, Timestamp: ts }) {
		const trader = this.findTrader(traderId);

		if (type === 'Buy')
			trader.buy(stkCode, qty, price, fee, ts);
		else if (type === 'Sell')
			trader.sell(stkCode, qty, price, fee, ts);
		else
			throw new Error(`Unknown TradeType: ${type}`);

		return true;
	}

	computeRanking() {
		return _.values(this.traders)
			.map(trader => ({ traderId: trader.id, profit: trader.computeProfit() }))
			.sort((a, b) => {
				if (a.profit.eq(b.profit)) return 0;
				if (a.profit.gt(b.profit)) return 1;
				return -1;
			}).reverse();
	}
}

module.exports = ProfitTable;
