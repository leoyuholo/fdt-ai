const chai = require('chai');

chai.should();

const Big = require('big.js');

const OrderQueue = require('../lib/OrderQueue');

describe('lib', () => {
	describe('OrderQueue', () => {
		describe('enqueue', () => {
			it('should increase qty', () => {
				const orders = new OrderQueue();
				orders.enqueue({ qty: new Big(1), price: new Big(0.7) });
				orders.qty.valueOf().should.be.equal('1');
			});

			it('should increate qty for more orders', () => {
				const orders = new OrderQueue();
				orders.enqueue({ qty: new Big(1), price: new Big(0.7) });
				orders.enqueue({ qty: new Big(2.75), price: new Big(0.7) });
				orders.qty.valueOf().should.be.equal('3.75');
			});
		});

		describe('dequeueQty', () => {
			it('should return total price for 1 unit', () => {
				const orders = new OrderQueue();
				orders.enqueue({ qty: new Big(1), price: new Big(0.7) });
				orders.dequeueQty(new Big(1)).valueOf().should.be.equal('0.7');
			});

			it('should return total price for 3 unit', () => {
				const orders = new OrderQueue();
				orders.enqueue({ qty: new Big(1), price: new Big(0.7) });
				orders.enqueue({ qty: new Big(2), price: new Big(0.7) });
				orders.dequeueQty(new Big(3)).valueOf().should.be.equal('2.1');
			});

			it('should have 1.5 unit remaining', () => {
				const orders = new OrderQueue();
				orders.enqueue({ qty: new Big(1), price: new Big(0.7) });
				orders.enqueue({ qty: new Big(2.5), price: new Big(0.7) });
				orders.dequeueQty(new Big(2)).valueOf().should.be.equal('1.4');
				orders.qty.valueOf().should.be.equal('1.5');
			});

			it('should return total price for 1.75 unit', () => {
				const orders = new OrderQueue();
				orders.enqueue({ qty: new Big(1), price: new Big(0.7) });
				orders.enqueue({ qty: new Big(2), price: new Big(0.7) });
				orders.dequeueQty(new Big(1.75)).valueOf().should.be.equal('1.225');
			});

			it('should return total price for the first 2.5 unit', () => {
				const orders = new OrderQueue();
				orders.enqueue({ qty: new Big(1), price: new Big(0.7) });
				orders.enqueue({ qty: new Big(2), price: new Big(0.8) });
				orders.dequeueQty(new Big(2.5)).valueOf().should.be.equal('1.9');
			});

			it('should throw error if no enough quantity', () => {
				const orders = new OrderQueue();
				orders.enqueue({ qty: new Big(1), price: new Big(0.7) });
				(() => orders.dequeueQty(new Big(1.5)).valueOf()).should.throw();
			});
		});
	});
});
