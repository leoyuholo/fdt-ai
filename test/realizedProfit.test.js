const fs = require('fs');
const path = require('path');

const chai = require('chai');
const chaiFiles = require('chai-files');
const _ = require('lodash');
const streamBuffers = require('stream-buffers');
const moment = require('moment');

chai.should();
chai.use(chaiFiles);

const file = chaiFiles.file;

const realizedProfit = require('../lib/realizedProfit');

describe('lib', () => {
	describe('realizedProfit', () => {
		describe('testcases', () => {
			const testcases = fs.readdirSync(path.join(__dirname, '../testcases'));
			testcases.forEach((dirName) => {
				it(`should match testcases/${dirName}/out`, (done) => {
					const inputFilePath = path.join(__dirname, `../testcases/${dirName}/in`);
					const expectedOutputFilePath = path.join(__dirname, `../testcases/${dirName}/out`);
					const writeStream = new streamBuffers.WritableStreamBuffer();

					realizedProfit(fs.createReadStream(inputFilePath, { encoding: 'utf-8' }), writeStream);

					writeStream.on('finish', () => {
						file(expectedOutputFilePath).should.be.equal(writeStream.getContentsAsString('utf-8'));
						done();
					});
				});
			});
		});

		describe.skip('random testing', function () {
			this.timeout(100000);
			it('should generate random test case', function () {
				const generateTestcase = (stream) => {
					let numberOfOrders = _.random(1, 100) * _.random(1, 100) * _.random(1, 100);
					const buySell = ['Buy', 'Sell'];

					stream.write('OrderId\tTrader\tStkCode\tQuantity\tPrice\tTradeType\tFee	Timestamp\n');

					let cnt = 1;
					let dt = Date.now() - 10000000;
					while (numberOfOrders > 0) {
						numberOfOrders--;
						dt += _.random(0, 10000);
						const trader = _.random(1, 100);
						const stkCode = _.random(1, 200);
						const qty = _.random(0, 100) * _.random(0, 100);
						const price = _.random(0, 1000, true);
						const type = buySell[_.random(0, 1)];
						const fee = qty * price * _.random(0, 0.01, true);
						const ts = moment(dt).format('YYYY-MM-DD hh:mm:ss');
						stream.write(`${cnt++}\t${trader}\t${stkCode}\t${qty}\t${price}\t${type}\t${fee}\t${ts}\n`);
					}
					if (stream !== process.stdout)
						stream.end();
				}

				generateTestcase(process.stdout);
			});
		});
	});
});
