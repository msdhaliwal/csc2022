// imports
const express = require('express');
const { google } = require('googleapis');
const { _getResponseTime, _getSourceData, _getWaitingTimeUrl } = require('./helpers');
//constants
const router = express.Router();
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = process.env.SHEET_NAME;
//

router.get('/update', async (req, res) => {
	const dataToWrite = await _getResponseTimes();
	const auth = new google.auth.GoogleAuth({
		keyFile: './credentials.json',
		scopes: 'https://www.googleapis.com/auth/spreadsheets',
	});
	//
	const client = await auth.getClient();

	const googleSheets = google.sheets({ version: 'v4', auth: client });
	// get metadata about sheets
	// const metaData = await googleSheets.spreadsheets.get({
	// 	auth,
	// 	spreadsheetId: SPREADSHEET_ID,
	// });
	// read rows from spreadsheet
	// const getRows = await googleSheets.spreadsheets.values.get({
	// 	auth,
	// 	spreadsheetId: SPREADSHEET_ID,
	// 	range: SHEET_NAME,
	// });
	// write rows to spreadsheet
	await googleSheets.spreadsheets.values.append({
		auth,
		spreadsheetId: SPREADSHEET_ID,
		range: `${SHEET_NAME}!A:E`, //id, date. time, name, time1, time2, time3
		valueInputOption: 'USER_ENTERED', // RAW, USER_ENTERED, etc
		resource: {
			values: dataToWrite,
		},
	});

	res.send();
});
module.exports = router;

const _getResponseTimes = () => {
	return new Promise((resolve, reject) => {
		try {
			const _date = new Date();
			const date = _date.toJSON().split('T')[0];
			const time = `${_date.getHours()}:${_date.getMinutes()}`;
			const sourceData = require('./resources/sourceData');
			const promiseArr = [];
			for (const elem of sourceData) {
				promiseArr.push(_getResponseTime({ ...elem, date, time }));
			}
			Promise.allSettled(promiseArr).then((promises) => {
				const processedData = promises.map((promise) => promise.value);
				const googleSheetRowsData = processedData.map((obj) => [obj.code, obj.value, obj.time1, obj.time3, obj.time3, obj.date, obj.time]);
				resolve(googleSheetRowsData);
			});
		} catch (err) {
			console.log('err :>> ', err);
			reject();
		}
	});
};
