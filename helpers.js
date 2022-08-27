const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const jQuery = require('jquery');

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

const _getResponseTime = ({ code, value, date, time }) => {
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
					resolve({ code, value, time1, time2, time3, date, time });
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

module.exports = {
	_getResponseTime,
	_getSourceData,
	_getWaitingTimeUrl,
};
