// table code
// constants
const tBody = document.querySelector('#tBody');

const GetWaitingTime = (cb) => {
	try {
		const xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				const response = JSON.parse(xhr.response);
				cb(null, response);
			}
		};
		xhr.open('GET', `/api/response-time`, 'true');
		xhr.setRequestHeader('content-type', 'application/json');
		xhr.send();
	} catch (error) {
		cb(error, null);
	}
};

GetWaitingTime((error, data) => {
	if (error) {
		console.log('error');
	} else {
		for (const row of data) {
			const elem = TableRow(row);
			tBody.appendChild(elem);
		}
	}
});

const TableRow = ({ value: name, time1, time2, time3, code }) => {
	const rowElem = document.createElement('tr');
	const nameElem = document.createElement('td');
	const time1Elem = document.createElement('td');
	const time2Elem = document.createElement('td');
	const time3Elem = document.createElement('td');

	rowElem.id = code;

	nameElem.textContent = name;
	time1Elem.textContent = time1;
	time2Elem.textContent = time2;
	time3Elem.textContent = time3;

	rowElem.appendChild(nameElem);
	rowElem.appendChild(time1Elem);
	rowElem.appendChild(time2Elem);
	rowElem.appendChild(time3Elem);

	return rowElem;
};
