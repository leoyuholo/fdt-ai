const chai = require('chai');

chai.should();

const Stock = require('../lib/Stock');

describe('lib', function () {
	describe('Stock', function () {
		describe('computeProfit', function () {
			it('should compute profit for 1 buy and 1 sell', function () {
				const stock = new Stock();
				stock.buy(1, 0.7, 0, new Date());
				stock.sell(1, 0.8, 0, new Date());
				stock.computeProfit().valueOf().should.be.equal('0.1');
			});

			it('should compute profit for short selling', function () {
				const stock = new Stock();
				stock.sell(8, 1.2, 0, new Date());
				stock.buy(8, 1, 0, new Date());
				stock.computeProfit().valueOf().should.be.equal('1.6');
			});

			it('should compute only realized profit', function () {
				const stock = new Stock();
				stock.sell(8, 1.2, 0, new Date());
				stock.buy(8, 1, 0, new Date());
				stock.buy(8, 1, 0, new Date());
				stock.computeProfit().valueOf().should.be.equal('1.6');
			});

			it('should be paying transaction fee', function () {
				const stock = new Stock();
				stock.buy(1, 0.7, 0.035, new Date());
				stock.sell(1, 0.8, 0.04, new Date());
				stock.computeProfit().valueOf().should.be.equal('0.025');
			});

			it('should be paying transaction fee even not yet realized', function () {
				const stock = new Stock();
				stock.sell(8, 1.2, 0.04, new Date());
				stock.buy(8, 1, 0.03, new Date());
				stock.buy(8, 1, 0.03, new Date());
				stock.computeProfit().valueOf().should.be.equal('1.5');
			});
		});
	});
});
