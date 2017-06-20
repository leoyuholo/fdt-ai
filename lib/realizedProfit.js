
const csv = require('csv');

const ProfitTable = require('./ProfitTable');

const realizedProfit = {};

const reportProfitTable = (profitTable, reportStream) => {
	profitTable.computeRanking().forEach(trader => {
		reportStream.write(`${trader.traderId}\t${trader.profit.valueOf()}\n`);
	});

	if (reportStream !== process.stdout) {
		reportStream.end();
	}
};

realizedProfit.fromStream = (tsvStream, reportStream) => {
	const profitTable = new ProfitTable();
	return tsvStream
		.on('end', () => reportProfitTable(profitTable, reportStream))
		.pipe(csv.parse({delimiter: '\t', columns: true}))
		.pipe(csv.transform(record => profitTable.addOrder(record)));
};

module.exports = realizedProfit.fromStream;
