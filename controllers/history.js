const { History } = require('../models');

exports.saveUrl = async (url) => {
	await History.create({ url });
	return;
}

exports.getUrls = async () => {
	const urls = History.findAll({ raw: true });
	return urls;
}
