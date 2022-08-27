const express = require('express');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const jQuery = require('jquery');
// constants
const app = express();
const PORT = process.env.PORT || 8080;
//
app.use(express.static('public'));

app.listen(PORT, () => {
	console.log(`server started at ${PORT}`);
});

app.get('/api/codes', GetCodes);
app.get('/api/cities', GetCities);
app.get('/api/response-time', GetResponseTime);
// helpers
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
		for (const elem of sourceData) {
			//
		}
		/* case 1 */
		/* const processedData = [];
		for (const elem of sourceData) {
			const responseTimes = await _getResponseTime(elem.code);
			processedData.push({ ...elem, ...responseTimes });
		} 
		res.send(processedData); */
		/* case 2 | 2x faster than case 1 */
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

const _getSourceData = () => {
	return new Promise((resolve, reject) => {
		try {
			const xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function () {
				if (this.readyState == 4 && this.status == 200) {
					// resolve({ status: this.status, response: this.responseText });
					const responseText = this.responseText;
					const regex = /window/gi;
					const replacedText = responseText.replaceAll(regex, 'global');
					// resolve({ response: replacedText });
					eval(replacedText);
					const sourceData = global.travelStateGov && global.travelStateGov.PostsVWT ? global.travelStateGov.PostsVWT.sourceData : null;
					resolve(sourceData);
				}
			};
			xhr.open('GET', `https://travel.state.gov/etc/designs/travel/TSGglobal_libs/data/PostsVWT.js`, 'true');
			xhr.setRequestHeader('content-type', 'application/json');
			xhr.send();
		} catch (err) {
			reject(err);
		}
	});
};

const _getResponseTime = ({ code, value }) => {
	// const _url = _getWaitingTimeUrl(elem.code);
	return new Promise((resolve, reject) => {
		try {
			const xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function () {
				if (this.readyState == 4 && this.status == 200) {
					// console.log(xhr.response);
					let [time1, time2, time3] = xhr.responseText.trim().split(',');
					time1 = !Number.isNaN(Number(time1.split(' ')[0])) ? time1.split(' ')[0] : time1;
					time2 = !Number.isNaN(Number(time2.split(' ')[0])) ? time2.split(' ')[0] : time2;
					time3 = !Number.isNaN(Number(time3.split(' ')[0])) ? time3.split(' ')[0] : time3;
					resolve({ code, value, time1, time2, time3 });
				}
			};
			xhr.open('GET', _getWaitingTimeUrl(code), 'true');
			xhr.setRequestHeader('content-type', 'application/json');
			xhr.send();
		} catch (err) {
			reject();
		}
	});
};

const _getWaitingTimeUrl = (code) => `https://travel.state.gov/content/travel/resources/database/database.getVisaWaitTimes.html?cid=${code}&aid=VisaWaitTimesHomePage`;
