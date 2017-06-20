const Big = require('big.js');

const bigNumHelper = require('./bigNumHelper');

class OrderQueue {
	constructor() {
		this.queue = [];
		this.qty = new Big(0);
	}

	enqueue({ qty, price }) {
		this.queue.push({ qty, price });
		this.qty = this.qty.add(qty);
	}

	// dequeue for specified amount and return total
	dequeueQty(qty) {
		if (qty.eq(0)) return new Big(0);
		if (this.qty.lt(qty)) throw new Error('No enough quantity to dequeue');

		let total = new Big(0);
		let i = qty;
		while (i.gt(0)) {
			const head = this.queue.shift();

			if (head.qty.lte(i)) {
				total = total.plus(bigNumHelper.calculateSubTotal(head.price, head.qty));
				i = i.minus(head.qty);
			} else {
				this.queue.unshift({
					qty: head.qty.minus(i),
					price: head.price
				});

				total = total.plus(bigNumHelper.calculateSubTotal(head.price, i));
				i = new Big(0);
			}
		}

		this.qty = this.qty.minus(qty);

		return total;
	}
}

module.exports = OrderQueue;
