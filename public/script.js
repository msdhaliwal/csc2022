const tBody = document.querySelector('#tBody');
const searchBox = document.querySelector('#searchBox');

const search = (arr, searchKey) => arr.filter((obj) => Object.keys(obj).some((key) => String(obj[key].toLowerCase()).includes(String(searchKey).toLowerCase())));

const sort = (data, sort_type = 'default') => {
	// fixme: code breaks when it encounters non Numeric value, in this case Emergency, Temporarily closed OR Closed
	let sortedData;
	switch (sort_type.trim().toLowerCase()) {
		// by name
		case 'default':
		case 'name_asc':
			return data.sort((a, b) => a.value.localeCompare(b.value));
		case 'name_desc':
			return data.sort((a, b) => b.value.localeCompare(a.value));
		// by time 1
		case 'time1_asc':
			return data.sort((a, b) => a.time1 - b.time1);
		case 'time1_desc':
			return data.sort((a, b) => b.time1 - a.time1);
		// by time 2
		case 'time2_asc':
			return data.sort((a, b) => a.time2 - b.time2);
		case 'time2_desc':
			return data.sort((a, b) => b.time2 - a.time2);
		// by time 3
		case 'time3_asc':
			return data.sort((a, b) => a.time3 - b.time3);
		case 'time3_desc':
			return data.sort((a, b) => b.time3 - a.time3);
	}
};

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

const PopulateTable = (data) => {
	if (!data || data.length <= 0) {
		tBody.innerHTML = '<h4>No Data Found</h4>';
		return;
	}
	tBody.innerHTML = '';
	let index = 1;
	let _data = sort(data, 'time1_asc');
	for (const row of _data) {
		const elem = TableRow(row, index);
		tBody.appendChild(elem);
		index++;
	}
};

const TableRow = ({ value: name, time1, time2, time3, code }, index) => {
	const rowElem = document.createElement('tr');
	const srNoElem = document.createElement('td');
	const nameElem = document.createElement('td');
	const time1Elem = document.createElement('td');
	const time2Elem = document.createElement('td');
	const time3Elem = document.createElement('td');

	rowElem.id = code;

	srNoElem.textContent = index;
	nameElem.textContent = name;
	time1Elem.textContent = time1;
	time2Elem.textContent = time2;
	time3Elem.textContent = time3;

	rowElem.appendChild(srNoElem);
	rowElem.appendChild(nameElem);
	rowElem.appendChild(time1Elem);
	rowElem.appendChild(time2Elem);
	rowElem.appendChild(time3Elem);

	return rowElem;
};
// event listeners
searchBox.addEventListener('input', (event) => {
	const searchKey = event.target.value.trim();
	if (!searchKey) PopulateTable(tableData);
	else {
		let data = search(tableData, searchKey);
		PopulateTable(data);
	}
});
//
let tableData;
(() => {
	GetWaitingTime((error, data) => {
		if (error) {
			console.log('error');
		} else {
			searchBox.readOnly = false;
			tableData = data;
			PopulateTable(tableData);
		}
	});
})();
