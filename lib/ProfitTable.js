const _ = require('lodash');
const Joi = require('joi');

const Trader = require('./Trader');

const orderSchema = Joi.object().keys({
	OrderId: Joi.number().integer().min(1),
	Trader: Joi.string(),
	StkCode: Joi.string(),
	Quantity: Joi.number().integer().min(0),
	Price: Joi.number().min(0),
	TradeType: Joi.string().valid(['Buy', 'Sell']),
	Fee: Joi.number().min(0),
	Timestamp: Joi.date()
});

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

	addOrder(order) {
		const result = orderSchema.validate(order);
		if (result.error) throw result.error;

		const { Trader: traderId, StkCode: stkCode, Quantity: qty, TradeType: type, Timestamp: ts } = result.value;
		const { Price: price, Fee: fee } = order;
		// const { Trader: traderId, StkCode: stkCode, Quantity: qty, Price: price, TradeType: type, Fee: fee, Timestamp: ts } = order;

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
				if (a.profit.eq(b.profit)) return a.traderId < b.traderId ? 1 : -1;
				if (a.profit.gt(b.profit)) return 1;
				return -1;
			}).reverse();
	}
}

module.exports = ProfitTable;
