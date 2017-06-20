const chai = require('chai');

chai.should();

const Big = require('big.js');

const OrderQueue = require('../lib/OrderQueue');

describe('lib', () => {
	describe('OrderQueue', () => {
		describe('enqueue', () => {
			it('should increase qty', () => {
				const orders = new OrderQueue();
				orders.enqueue({ qty: 1, price: new Big(0.7) });
				orders.qty.should.be.equal(1);
			});

			it('should increate qty for more orders', () => {
				const orders = new OrderQueue();
				orders.enqueue({ qty: 1, price: new Big(0.7) });
				orders.enqueue({ qty: 27, price: new Big(0.7) });
				orders.qty.should.be.equal(28);
			});
		});

		describe('dequeueQty', () => {
			it('should return total price for 1 unit', () => {
				const orders = new OrderQueue();
				orders.enqueue({ qty: 1, price: new Big(0.7) });
				orders.dequeueQty(1).valueOf().should.be.equal('0.7');
			});

			it('should return total price for 3 units', () => {
				const orders = new OrderQueue();
				orders.enqueue({ qty: 1, price: new Big(0.7) });
				orders.enqueue({ qty: 2, price: new Big(0.7) });
				orders.dequeueQty(3).valueOf().should.be.equal('2.1');
			});

			it('should have 1 unit remaining', () => {
				const orders = new OrderQueue();
				orders.enqueue({ qty: 1, price: new Big(0.7) });
				orders.enqueue({ qty: 2, price: new Big(0.7) });
				orders.dequeueQty(2).valueOf().should.be.equal('1.4');
				orders.qty.should.be.equal(1);
			});

			it('should return total price for 2 units', () => {
				const orders = new OrderQueue();
				orders.enqueue({ qty: 1, price: new Big(0.7) });
				orders.enqueue({ qty: 2, price: new Big(0.7) });
				orders.dequeueQty(2).valueOf().should.be.equal('1.4');
			});

			it('should return total price for the first 2 units', () => {
				const orders = new OrderQueue();
				orders.enqueue({ qty: 1, price: new Big(0.7) });
				orders.enqueue({ qty: 2, price: new Big(0.8) });
				orders.dequeueQty(2).valueOf().should.be.equal('1.5');
			});

			it('should return 0 for 0 units', () => {
				const orders = new OrderQueue();
				orders.enqueue({ qty: 1, price: new Big(0.7) });
				orders.dequeueQty(0).valueOf().should.be.equal('0');
			});

			it('should throw error if no enough quantity', () => {
				const orders = new OrderQueue();
				orders.enqueue({ qty: 1, price: new Big(0.7) });
				(() => orders.dequeueQty(2).valueOf()).should.throw();
			});

			it('should throw error if quantity is not an integer', () => {
				const orders = new OrderQueue();
				orders.enqueue({ qty: 1, price: new Big(0.7) });
				(() => orders.dequeueQty(1.5).valueOf()).should.throw();
			});
		});
	});
});
