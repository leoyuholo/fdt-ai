const fs = require('fs');
const path = require('path');

const chai = require('chai');
const chaiFiles = require('chai-files');
const streamBuffers = require('stream-buffers');

chai.should();
chai.use(chaiFiles);

const file = chaiFiles.file;

const realizedProfit = require('../lib/realizedProfit');

describe('lib', function () {
	describe('realizedProfit', function () {
		describe('testcases', function () {
			const testcases = fs.readdirSync(path.join(__dirname, '../testcases'));
			testcases.forEach(dirName => {
				it(`should match testcases/${dirName}/out`, function (done) {
					const inputFilePath = path.join(__dirname, `../testcases/${dirName}/in`);
					const expectedOutputFilePath = path.join(__dirname, `../testcases/${dirName}/out`);
					const writeStream = new streamBuffers.WritableStreamBuffer();

					realizedProfit(fs.createReadStream(inputFilePath, {encoding: 'utf-8'}), writeStream);

					writeStream.on('finish', () => {
						file(expectedOutputFilePath).should.be.equal(writeStream.getContentsAsString('utf-8'));
						done();
					});
				});
			});
		});
	});
});
