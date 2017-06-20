const Big = require('big.js');

const OrderQueue = require('./OrderQueue');
const bigNumHelper = require('./bigNumHelper');

class Stock {
	constructor(stkCode) {
		this.stkCode = stkCode;
		this.orders = [];
	}

	buy(qty, price, fee, ts) {
		this.orders.push({
			type: 'buy',
			qty: new Big(qty),
			price: new Big(price),
			fee: new Big(fee),
			ts
		});
	}

	sell(qty, price, fee, ts) {
		this.orders.push({
			type: 'sell',
			qty: new Big(qty),
			price: new Big(price),
			fee: new Big(fee),
			ts
		});
	}

	computeProfit() {
		return this.orders.reduce(({ profit, buyQueue, sellQueue }, order) => {
			let gain = new Big(0);

			if (order.type === 'buy') {
				// if enough to settle order, just calculate gain
				// if not, enqueue the remainder, calculate the settled gain
				let qty;
				if (sellQueue.qty.gte(order.qty))
					qty = order.qty;
				else {
					qty = sellQueue.qty;

					buyQueue.enqueue({
						qty: order.qty.minus(qty),
						price: order.price
					});
				}
				gain = bigNumHelper.calculateBuyGain(sellQueue.dequeueQty(qty), order.price, qty);
			} else {
				let qty;
				if (buyQueue.qty.gte(order.qty))
					qty = order.qty;
				else {
					qty = buyQueue.qty;

					sellQueue.enqueue({
						qty: order.qty.minus(qty),
						price: order.price
					});
				}
				gain = bigNumHelper.calculateSellGain(buyQueue.dequeueQty(qty), order.price, qty);
			}

			return {
				profit: bigNumHelper.calculateTotalProfit(profit, gain, order.fee),
				buyQueue,
				sellQueue
			};
		},
		{
			profit: new Big(0),
			buyQueue: new OrderQueue(),
			sellQueue: new OrderQueue()
		}).profit;
	}
}

module.exports = Stock;
