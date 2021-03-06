const chai = require('chai');

chai.should();

const Trader = require('../lib/Trader');

describe('lib', () => {
	describe('Trader', () => {
		describe('computeProfit', () => {
			it('should compute profit for one stock', () => {
				const trader = new Trader();
				trader.buy('GOOGL', 352, 975.22, 343.27744);
				trader.buy('GOOGL', 253, 1075.22, 272.03066);
				trader.sell('GOOGL', 605, 1100.22, 665.6331);
				trader.computeProfit().valueOf().should.be.equal('49044.0588');
			});

			it('should compute profit for more than one stock', () => {
				const trader = new Trader();
				trader.buy('GOOGL', 352, 975.22, 343.27744);
				trader.buy('GOOGL', 253, 1075.22, 272.03066);
				trader.sell('GOOGL', 605, 1100.22, 665.6331);
				trader.sell('AAPL', 4340, 146.34, 635.1156);
				trader.buy('AAPL', 7560, 166.34, 1257.5304);
				trader.sell('AAPL', 2240, 253.45, 567.728);
				trader.computeProfit().valueOf().should.be.equal('154910.0848');
			});
		});
	});
});
