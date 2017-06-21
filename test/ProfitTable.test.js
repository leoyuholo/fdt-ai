const chai = require('chai');
const _ = require('lodash');

chai.should();

const ProfitTable = require('../lib/ProfitTable');

describe('lib', () => {
	describe('ProfitTable', () => {
		describe('addOrder', () => {
			it('should throw error for invalid arguments', () => {
				const table = new ProfitTable();
				const sampleOrder = {
					OrderId: '1',
					Trader: 'BBB',
					StkCode: '333333',
					Quantity: '1000',
					Price: '8.8',
					TradeType: 'Sell',
					Fee: '10.56',
					Timestamp: '2016-05-09 10:37:16'
				};

				(() => table.addOrder(_.chain(sampleOrder).clone().set('OrderId', 'A').value())).should.throw();
				(() => table.addOrder(_.chain(sampleOrder).clone().set('Trader', 123).value())).should.throw();
				(() => table.addOrder(_.chain(sampleOrder).clone().set('StkCode', 333333).value())).should.throw();
				(() => table.addOrder(_.chain(sampleOrder).clone().set('Quantity', -1).value())).should.throw();
				(() => table.addOrder(_.chain(sampleOrder).clone().set('Price', -1.23).value())).should.throw();
				(() => table.addOrder(_.chain(sampleOrder).clone().set('TradeType', 'Clear').value())).should.throw();
				(() => table.addOrder(_.chain(sampleOrder).clone().set('Fee', -2.34).value())).should.throw();
				(() => table.addOrder(_.chain(sampleOrder).clone().set('Timestamp', 'Not a date').value())).should.throw();
			});
		});

		describe('computeRanking', () => {
			it('should compute ranking for one trader', () => {
				const table = new ProfitTable();
				table.addOrder({ OrderId: '1', Trader: 'BBB', StkCode: '333333', Quantity: '1000', Price: '8.8', TradeType: 'Sell', Fee: '10.56', Timestamp: '2016-05-09 10:37:16' });
				table.addOrder({ OrderId: '2', Trader: 'BBB', StkCode: '333333', Quantity: '800', Price: '9.0', TradeType: 'Buy', Fee: '1.6', Timestamp: '2016-05-11 14:58:30' });
				table.addOrder({ OrderId: '3', Trader: 'BBB', StkCode: '333333', Quantity: '400', Price: '9.2', TradeType: 'Buy', Fee: '0.8', Timestamp: '2016-05-16 10:28:24' });
				const ranking = table.computeRanking();
				ranking.length.should.be.equal(1);
				ranking[0].traderId.should.be.equal('BBB');
				ranking[0].profit.valueOf().should.be.equal('-252.96');
			});

			it('should compute ranking for two traders', () => {
				const table = new ProfitTable();
				table.addOrder({ OrderId: '1', Trader: 'AAA', StkCode: '222222', Quantity: '100', Price: '10', TradeType: 'Buy', Fee: '0.2', Timestamp: '2016-05-09 13:38:24' });
				table.addOrder({ OrderId: '2', Trader: 'BBB', StkCode: '333333', Quantity: '1000', Price: '8.8', TradeType: 'Sell', Fee: '10.56', Timestamp: '2016-05-09 10:37:16' });
				table.addOrder({ OrderId: '3', Trader: 'AAA', StkCode: '222222', Quantity: '100', Price: '11', TradeType: 'Sell', Fee: '1.32', Timestamp: '2016-05-10 13:38:24' });
				table.addOrder({ OrderId: '4', Trader: 'BBB', StkCode: '333333', Quantity: '800', Price: '9.0', TradeType: 'Buy', Fee: '1.6', Timestamp: '2016-05-11 14:58:30' });
				table.addOrder({ OrderId: '5', Trader: 'BBB', StkCode: '333333', Quantity: '400', Price: '9.2', TradeType: 'Buy', Fee: '0.8', Timestamp: '2016-05-16 10:28:24' });
				table.addOrder({ OrderId: '6', Trader: 'AAA', StkCode: '555555', Quantity: '600', Price: '15.5', TradeType: 'Buy', Fee: '2.0', Timestamp: '2016-05-16 10:31:33' });
				const ranking = table.computeRanking();
				ranking.length.should.be.equal(2);
				ranking[0].traderId.should.be.equal('AAA');
				ranking[0].profit.valueOf().should.be.equal('96.48');
				ranking[1].traderId.should.be.equal('BBB');
				ranking[1].profit.valueOf().should.be.equal('-252.96');
			});

			it('should tie break by trader id', () => {
				const table = new ProfitTable();
				table.addOrder({ OrderId: '1', Trader: 'AAA', StkCode: '222222', Quantity: '100', Price: '10', TradeType: 'Buy', Fee: '0.2', Timestamp: '2016-05-09 13:38:24' });
				table.addOrder({ OrderId: '2', Trader: 'CCC', StkCode: '222222', Quantity: '100', Price: '10', TradeType: 'Buy', Fee: '0.2', Timestamp: '2016-05-09 13:38:25' });
				table.addOrder({ OrderId: '3', Trader: 'BBB', StkCode: '333333', Quantity: '1000', Price: '8.8', TradeType: 'Sell', Fee: '10.56', Timestamp: '2016-05-09 10:37:16' });
				table.addOrder({ OrderId: '4', Trader: 'AAA', StkCode: '222222', Quantity: '100', Price: '11', TradeType: 'Sell', Fee: '1.32', Timestamp: '2016-05-10 13:38:24' });
				table.addOrder({ OrderId: '5', Trader: 'CCC', StkCode: '222222', Quantity: '100', Price: '11', TradeType: 'Sell', Fee: '1.32', Timestamp: '2016-05-10 13:38:25' });
				table.addOrder({ OrderId: '6', Trader: 'BBB', StkCode: '333333', Quantity: '800', Price: '9.0', TradeType: 'Buy', Fee: '1.6', Timestamp: '2016-05-11 14:58:30' });
				table.addOrder({ OrderId: '7', Trader: 'BBB', StkCode: '333333', Quantity: '400', Price: '9.2', TradeType: 'Buy', Fee: '0.79', Timestamp: '2016-05-16 10:28:24' });
				table.addOrder({ OrderId: '8', Trader: 'BBB', StkCode: '333333', Quantity: '500', Price: '9.2', TradeType: 'Buy', Fee: '0.89', Timestamp: '2016-05-16 10:28:24' });
				table.addOrder({ OrderId: '9', Trader: 'AAA', StkCode: '555555', Quantity: '600', Price: '15.5', TradeType: 'Buy', Fee: '2.0', Timestamp: '2016-05-16 10:31:33' });
				table.addOrder({ OrderId: '10', Trader: 'CCC', StkCode: '555555', Quantity: '600', Price: '15.5', TradeType: 'Buy', Fee: '2.0', Timestamp: '2016-05-16 10:31:34' });
				const ranking = table.computeRanking();
				ranking.length.should.be.equal(3);
				ranking[0].traderId.should.be.equal('AAA');
				ranking[0].profit.valueOf().should.be.equal('96.48');
				ranking[1].traderId.should.be.equal('CCC');
				ranking[1].profit.valueOf().should.be.equal('96.48');
				ranking[2].traderId.should.be.equal('BBB');
				ranking[2].profit.valueOf().should.be.equal('-253.84');
			});
		});
	});
});
