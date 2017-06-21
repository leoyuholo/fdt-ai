const csv = require('csv');

const ProfitTable = require('./ProfitTable');

const realizedProfit = {};

const reportProfitTable = (profitTable, reportStream) => {
	const ranking = profitTable.computeRanking();
	ranking.forEach((trader) => {
		reportStream.write(`${trader.traderId}\t${trader.profit.valueOf()}\n`);
	});

	if (reportStream !== process.stdout)
		reportStream.end();
};

realizedProfit.fromStream = (tsvStream, reportStream) => {
	const profitTable = new ProfitTable();
	tsvStream
		.on('end', () => reportProfitTable(profitTable, reportStream))
		.on('error', (err) => {
			console.error(err);
			process.exit(1);
		})
		.pipe(csv.parse({ delimiter: '\t', columns: true }))
		.pipe(csv.transform((record) => {
			profitTable.addOrder(record);
		}));
};

module.exports = realizedProfit.fromStream;
