const express = require('express');
const { _getResponseTime, _getSourceData, _getWaitingTimeUrl } = require('./helpers');
// constants
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 8000;
//
app.use(express.static('public'));

app.listen(PORT, () => {
	console.log(`server started at ${PORT}`);
});
// UI APIs
app.get('/api/codes', GetCodes);
app.get('/api/cities', GetCities);
app.get('/api/response-time', GetResponseTime);
// GOogle Sheet APIs
app.use('/api/sheets', require('./sheets.api'));
// helpers
// ! table UI APIs
async function GetCodes(req, res) {
	try {
		const sourceData = await _getSourceData();
		const codes = sourceData.map((elem) => elem.code);
		res.json(codes);
	} catch (err) {
		res.status(500).send();
	}
}

async function GetCities(req, res) {
	try {
		const sourceData = await _getSourceData();
		const cities = sourceData.map((elem) => elem.value);
		res.json(cities);
	} catch (err) {
		res.status(500).send();
	}
}

async function GetResponseTime(req, res) {
	try {
		// const sourceData = await _getSourceData(); // takes 3 seconds
		const sourceData = require('./resources/sourceData');
		const processedSourceData = {};
		const promiseArr = [];
		for (const elem of sourceData) {
			promiseArr.push(_getResponseTime(elem));
		}
		Promise.allSettled(promiseArr)
			.then((promises) => {
				const processedData = promises.map((promise) => promise.value);
				return processedData;
			})
			.then((data) => {
				res.send(data);
			});
	} catch (err) {
		res.status(500).send(err);
	}
}
