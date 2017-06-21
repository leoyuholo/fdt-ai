const Big = require('big.js');

const OrderQueue = require('./OrderQueue');
const bigNumHelper = require('./bigNumHelper');

class Stock {
	constructor(stkCode) {
		this.stkCode = stkCode;
		this.profit = new Big(0);
		this.buyQueue = new OrderQueue();
		this.sellQueue = new OrderQueue();
	}

	buy(buyQty, buyPrice, fee, ts) {
		buyQty = +buyQty;
		buyPrice = new Big(buyPrice);
		fee = new Big(fee);
		// if enough to settle order, just calculate gain
		// if not, enqueue the remainder, calculate the settled gain
		let qty;
		if (this.sellQueue.qty >= buyQty)
			qty = buyQty;
		else {
			qty = this.sellQueue.qty;

			this.buyQueue.enqueue({
				qty: buyQty - qty,
				price: buyPrice
			});
		}
		const gain = bigNumHelper.calculateBuyGain(this.sellQueue.dequeueQty(qty), buyPrice, qty);
		this.profit = bigNumHelper.calculateTotalProfit(this.profit, gain, fee);
	}

	sell(sellQty, sellPrice, fee, ts) {
		sellQty = +sellQty;
		sellPrice = new Big(sellPrice);
		fee = new Big(fee);

		let qty;
		if (this.buyQueue.qty >= sellQty)
			qty = sellQty;
		else {
			qty = this.buyQueue.qty;

			this.sellQueue.enqueue({
				qty: sellQty - qty,
				price: sellPrice
			});
		}
		const gain = bigNumHelper.calculateSellGain(this.buyQueue.dequeueQty(qty), sellPrice, qty);
		this.profit = bigNumHelper.calculateTotalProfit(this.profit, gain, fee);
	}

	computeProfit() {
		return this.profit;
	}
}

module.exports = Stock;
