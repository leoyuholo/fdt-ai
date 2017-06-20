const Big = require('big.js');
const _ = require('lodash');

const bigNumHelper = require('./bigNumHelper');

class OrderQueue {
	constructor() {
		this.queue = [];
		this.qty = 0;
	}

	enqueue({ qty, price }) {
		this.queue.push({ qty, price: new Big(price) });
		this.qty += qty;
	}

	// dequeue for specified amount and return total
	dequeueQty(qty) {
		if (qty === 0) return new Big(0);
		if (!_.isInteger(qty)) throw new Error('Quantity must be an integer');
		if (this.qty < qty) throw new Error('No enough quantity to dequeue');

		let total = new Big(0);
		let i = qty;
		while (i > 0) {
			const head = this.queue.shift();

			if (head.qty <= i) {
				total = total.plus(bigNumHelper.calculateSubTotal(head.price, head.qty));
				i -= head.qty;
			} else {
				this.queue.unshift({
					qty: head.qty - i,
					price: head.price
				});

				total = total.plus(bigNumHelper.calculateSubTotal(head.price, i));
				i = 0;
			}
		}

		this.qty -= qty;

		return total;
	}
}

module.exports = OrderQueue;
