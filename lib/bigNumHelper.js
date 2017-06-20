
const bigNumHelper = {};

bigNumHelper.calculateSubTotal = (price, qty) =>
	price.times(qty);

bigNumHelper.calculateBuyGain = (revenue, price, qty) =>
	revenue.minus(bigNumHelper.calculateSubTotal(price, qty));

bigNumHelper.calculateSellGain = (cost, price, qty) =>
	bigNumHelper.calculateSubTotal(price, qty).minus(cost);

bigNumHelper.calculateTotalProfit = (originalProfit, gain, fee) =>
	originalProfit.plus(gain).minus(fee);

module.exports = bigNumHelper;
