var allsheets;
var sheetsAndId = {};
var selectedTab = "";
var lineId;
var totalItems = 0;
var currentPage = 0;
var allSheetPageSize = {

};
var perPageEl;
var summaryEl;
var perPage;
var pageSize = 25;


$(document).on('click', '#excelReportMaster', function() {

	// $(".fromToDiv").css("display", "block");

	// Reset the date values
	$("#from").val("");
	$("#to").val("");

	$("#offcanvasCloseButton").click();
	$("#masterHeading").text("EXCEL REPORT MASTER");

	$("#tableContainer").empty();
	$("#pagerContainer").empty();
	makePagerBody("pagerContainer");

	var headerList = ["S. No.", "Line", "Station Name", "Ip Address", ""];
	var searchList = ["searchLine", "searchStation", "seachIpAddress", ""];
	var placeholderList = ["Line", "Station", "Ip Address", ""];
	makeTable(headerList, placeholderList, searchList, "tableContainer", "table1", "100%");

	handlePageChange(0);

	// Example Usage
	configureButtons({
		add: "hide",
		edit: "hide",
		delete: "hide",
		template: "hide",
		data: "hide",
		upload: "hide",
		pdfUpload: "hide",
		userDetails: "show"
	});


	replaceButton(
		"pdfUpload",       // old button base id (without "Container")
		"filterBtn",    // new button id
		"filter",       // new button class for styling
		"Search Filters",    // title tooltip
		function() {      // click handler
			console.log("Search Filters Review clicked");
			// Your actual logic here
		}
	);

	getIdByMasterName($(this).attr('id'));

	totalItems = allSheetPageSize[selectedTab] || 0;
	perPage = parseInt(document.getElementById('perPage').value);
	currentPage = 1;

	summaryEl = document.getElementById('summaryText');
	perPageEl = document.getElementById('perPage');

	refreshAll();

});

$(document).on('click', '#prevBtn', function(e) {
	e.preventDefault();
	if (currentPage > 1) {
		currentPage--;
		refreshAll();
		loadCurrentTabData();
	};

});

$(document).on('click', '#nextBtn', function(e) {
	e.preventDefault();
	const pageCount = Math.ceil(totalItems / perPage);
	if (currentPage < pageCount) {
		currentPage++;
		refreshAll();
		loadCurrentTabData();
	};

});

$(document).on('click', '#firstBtn', function(e) {
	e.preventDefault();
	currentPage = 1;
	refreshAll();
	loadCurrentTabData();
});

$(document).on('click', '#lastBtn', function(e) {
	e.preventDefault();
	currentPage = Math.ceil(totalItems / perPage);
	refreshAll();
	loadCurrentTabData();
});


$(document).on('change', '#perPage', function(e) {
	e.preventDefault();
	currentPage = 1;
	pageSize = parseInt(e.target.value);
	refreshAll();
	loadCurrentTabData();
});


function loadCurrentTabData() {

	const tableId = removeSpaces(selectedTab);
	getAllDataOfSheet(tableId + "Table", sheetsAndId[selectedTab], selectedTab);

}

function updateSummary() {
	const start = (currentPage - 1) * pageSize + 1;
	const end = Math.min(currentPage * pageSize, totalItems);
	summaryEl.textContent = `Items ${start} to ${end} of ${totalItems}`;
}

function renderPageNumbers() {
	const pagUl = document.querySelector('.pagination');
	const items = Array.from(pagUl.querySelectorAll('li'));
	items.slice(2, items.length - 2).forEach(i => i.remove());

	const pageCount = Math.ceil(totalItems / pageSize);
	let startPage, endPage;

	if (pageCount <= 3) {
		startPage = 1;
		endPage = pageCount;
	} else {
		if (currentPage === 1) {
			startPage = 1; endPage = 3;
		} else if (currentPage === pageCount) {
			startPage = pageCount - 2; endPage = pageCount;
		} else {
			startPage = currentPage - 1;
			endPage = currentPage + 1;
		}
	}

	const nextBtn = document.getElementById('nextBtn');
	for (let p = startPage; p <= endPage; p++) {
		const li = document.createElement('li');
		li.className = 'page-item' + (p === currentPage ? ' active' : '');
		li.innerHTML = `<a class="page-link" href="#" data-page="${p}">${p}</a>`;
		pagUl.insertBefore(li, nextBtn);
	}

	pagUl.querySelectorAll('a[data-page]').forEach(a => {
		a.addEventListener('click', function(e) {
			e.preventDefault();
			currentPage = parseInt(this.dataset.page, 10);
			refreshAll();
			loadCurrentTabData();
		});
	});
}


function refreshAll() {
	totalItems = allSheetPageSize[selectedTab] || 0;
	updateSummary();
	renderPageNumbers();
	const pageCount = Math.ceil(totalItems / pageSize);
	document.getElementById('firstBtn').classList.toggle('disabled', currentPage === 1);
	document.getElementById('prevBtn').classList.toggle('disabled', currentPage === 1);
	document.getElementById('nextBtn').classList.toggle('disabled', currentPage === pageCount);
	document.getElementById('lastBtn').classList.toggle('disabled', currentPage === pageCount);
}


window.loadLikeExcelReportData = loadLikeExcelReportData;
function loadLikeExcelReportData(page, pageSize) {

	const formdata = {
		line: {
			lineName: $('#searchLine').val() ?? "",

		},
		name: $('#searchStation').val() ?? "",
		ipAddress: $('#seachIpAddress').val() ?? '',

	};

	$.ajax({      // used StationMasterAjaxController
		type: 'POST',
		url: '/WebApplication/Controllers/getLikeLineStationSheetData/' + page + '/' + pageSize,
		data: JSON.stringify(formdata),
		contentType: "application/json",
		headers: {
			Authorization: `Bearer ${sessionStorage.getItem('token')}`
		},
		success: function(res) {

			makePagerByTotalPages(res, page);
			insertExcelReportDataInTable(res.content, "table1");
		},
		error: function(err) {
			console.error("Failed to fetch Excel report data", err);
		}
	});
}

function formatDateTime(dateTimeString) {
	if (!dateTimeString) return '';
	const date = new Date(dateTimeString);

	// Format as dd-MM-yyyy HH:mm
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const year = date.getFullYear();
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');

	/*return `${day}-${month}-${year} ${hours}:${minutes}`;*/
	return `${year}-${month}-${day}`;
}


function formatYearOnly(dateTimeString) {
	if (!dateTimeString) return '';
	const date = new Date(dateTimeString);

	const year = date.getFullYear();

	/*return `${day}-${month}-${year} ${hours}:${minutes}`;*/
	return `${year}`;
}


/*-------------------------------- For visibility on frontend ---------------------*/
window.insertExcelReportDataInTable = insertExcelReportDataInTable;
function insertExcelReportDataInTable($item, tableId) {
	$("#" + tableId + "Body").empty();

	var sequenceNumber = getSequenceNumber();

	$.each($item, function(index, value) {

		var row = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId" class="width50">' + (sequenceNumber + 1) + '</td>'
			+ '<td data-column="line" class="width100 textLeftAlign">' + (value.line == null ? '' : value.line.lineName) + '</td>'
			+ '<td data-column="stationName" class="width250 textLeftAlign">' + (value.name == null ? '' : value.name) + '</td>'
			+ '<td data-column="ipAddress" class="width100">' + (value.ipAddress == null ? '' : value.ipAddress) + '</td>'
			+ '<td data-column="stationId" style="display:none;">' + (value.id == null ? '' : value.id) + '</td>'
			+ '<td data-column="showStationSheets"><button type="button" class="btn btn-primary btn-sm my-1 downloadSheets">View Sheets</button></td></tr>';

		$("#" + tableId).append(row);
		sequenceNumber++;
	});
}

$(document).on('click', '.downloadSheets', function() {
	// find the closest row <tr>
	let row = $(this).closest("tr");

	// grab all cell values
	lineId = row.find("td:eq(1)").text();
	let stationName = row.find("td:eq(2)").text();
	let stationId = row.find("td:eq(4)").text();

	setTextById("reportBackdropLabel", "STATION : " + stationName)

	filterModalShow(lineId, stationId);
});

$(document).on('click', '.viewPhSheet', function() {
	// find the closest row <tr>
	let row = $(this).closest("tr");

	// grab all cell values
	let model = row.find("td:eq(1)").text();
	let variant = row.find("td:eq(2)").text();
	let shift = row.find("td:eq(3)").text();
	let dateTime = row.find("td:eq(4)").text();
	let batchId = row.find("td:eq(8)").text();
	let filledNo = row.find("td:eq(10)").text();

	var detailsObject = {
		model: model,
		variant: variant,
		batchId: batchId,
		shift: shift,
		dateTime: dateTime,
		lineId: lineId,
		filledNo: filledNo
	};
	// Convert object to string before storing
	sessionStorage.setItem('details', JSON.stringify(detailsObject));

	// ✅ open login page in a new tab
	window.open("/WebApplication/viewPhSheet/" + sheetsAndId[selectedTab] + "?token=" + sessionStorage.getItem("token"));
});

$(document).on('click', '.viewPdSheet', function() {
	// find the closest row <tr>
	let row = $(this).closest("tr");

	// grab all cell values
	let model = row.find("td:eq(1)").text();
	let variant = row.find("td:eq(2)").text();
	let shift = row.find("td:eq(3)").text();
	let countNo = row.find("td:eq(4)").text();
	let dateTime = row.find("td:eq(5)").text();
	let filledNo = row.find("td:eq(12)").text();

	var detailsObject = {
		model: model,
		variant: variant,
		shift: shift,
		dateTime: dateTime,
		countNo: countNo,
		lineId: lineId,
		filledNo: filledNo
	};
	// Convert object to string before storing
	sessionStorage.setItem('details', JSON.stringify(detailsObject));

	// ✅ open login page in a new tab
	window.open("/WebApplication/viewPdSheet/" + sheetsAndId[selectedTab] + "?token=" + sessionStorage.getItem("token"));
});

$(document).on('click', '.viewMcSheet', function() {
	// find the closest row <tr>
	let row = $(this).closest("tr");
	// grab all cell values
	let shift = row.find("td:eq(1)").text();
	let dateTime = row.find("td:eq(2)").text();

	var detailsObject = {
		shift: shift,
		dateTime: dateTime,
		lineId: lineId
	};
	// Convert object to string before storing
	sessionStorage.setItem('details', JSON.stringify(detailsObject));
	window.open("/WebApplication/viewMcSheet/" + sheetsAndId[selectedTab] + "?token=" + sessionStorage.getItem("token"));
});


$(document).on('click', '.viewIonizerSheet', function() {
	// find the closest row <tr>
	let row = $(this).closest("tr");
	// grab all cell values
	let shift = row.find("td:eq(1)").text();
	let dateTime = row.find("td:eq(2)").text();

	var detailsObject = {
		shift: shift,
		dateTime: dateTime,
		lineId: lineId
	};
	// Convert object to string before storing
	sessionStorage.setItem('details', JSON.stringify(detailsObject));
	window.open("/WebApplication/viewIonizerSheet/" + sheetsAndId[selectedTab] + "?token=" + sessionStorage.getItem("token"));
});

$(document).on('click', '.tabs', function(event) {

	selectedTab = $(this).text().trim(); // get button text and remove spaces
	refreshAll();

});


$(document).on('click', '#searchReportButton', function() {

	const fromDate = $("#reportFrom").val();
	const toDate = $("#reportTo").val();

	if (!fromDate || !toDate) { // throw alert if dates not selected
		alert("⚠️ Please select both From and To dates.");
		return; // ⛔ stop execution, loop won't run
	}

	for (var i = 0; i < allsheets.length; i++) {
		const tableId = removeSpaces(allsheets[i]);
		console.log()
		getAllDataOfSheet(tableId + "Table", sheetsAndId[allsheets[i]], allsheets[i]);
	}

	refreshAll();
});


function getAllSheetNameByLineAndStation(lineId, stationId) {
	var result = null;

	var formData = {
		line: { lineId: lineId },
		station: { id: stationId }
	};

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getAllSheetNameByLineAndStation',
		data: JSON.stringify(formData),
		async: false,   // sync request (not recommended, blocks UI)
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {
			result = res;
		},
		error: function(response) {
			$("#warningInformationModalBody").text(response.responseText);
			$("#warningBackdropButton").click();
		}
	});

	return result;  // return after ajax call finishes
}

function splitByComma(str) {
	return str.split(',').map(s => s.trim()); // trims spaces around each item
}

function filterModalShow(lineId, stationId) {

	$("#sheetStatusContainer").empty();

	const sheets = getAllSheetNameByLineAndStation(lineId, stationId);
	var sheetsName = [];

	showModal("reportBackdropButton");
	$("#reportModalBody").empty();

	$("#lineId").text(lineId);
	$("#stationId").text(stationId);

	for (var j = 0; j < sheets.length; j++) {

		let list = splitByComma(sheets[j]);
		sheetsName.push(list[0]);
		sheetsAndId[list[0]] = list[1];

		selectedTab = list[0];

		makeSheetStatus(list[0], list[1]);
	}

	multipleTabs(sheetsName, "reportModalBody");

	const sheetHeaders = {
		"Product History Sheet": ["S. No.", "Model", "Variant", "Shift", "Date", "Sheet No", "View & Approve"],
		"Process Data Sheet": ["S. No.", "Model", "Variant", "Shift", "Pages In Sheet", "Month & year", "Sheet No", "View & Approve"],
		"Machine Check Sheet": ["S. No.", "Shift", "Month & year", "View & Approve"],
		"Ionizer Sheet": ["S. No.", "Shift", "Month & year", "View & Approve"]
	};

	const searchHeaderList = {
		"Product History Sheet": ["searchModelProductHistorySheet", "searchVariantProductHistorySheet", "searchShiftProductHistorySheet", "", "", ""],
		"Process Data Sheet": ["searchModelProcessDataSheet", "searchVariantProcessDataSheet", "searchShiftProcessDataSheet", "", "", "", ""],
		"Machine Check Sheet": ["searchShiftMachineCheckSheet", "", ""],
		"Ionizer Sheet": ["searchShiftMachineCheckSheet", "", ""]
	};

	const placeholderList = {
		"Product History Sheet": ["model", "variant", "shift"],
		"Process Data Sheet": ["model", "variant", "shift"],
		"Machine Check Sheet": ["shift"],
		"Ionizer Sheet": ["shift"]
	};

	for (var i = 0; i < sheetsName.length; i++) {

		// var headerList = ["S. No.", "Model", "Variant", "Shift", "Date", "View Sheet", "Download Sheet"];
		// This way new sheets can be supported by just extending sheetHeaders.
		var headerList = sheetHeaders[sheetsName[i]] || [];

		var searchList = searchHeaderList[sheetsName[i]] || [];

		var placeList = placeholderList[sheetsName[i]] || [];

		const conatinerId = removeSpaces(sheetsName[i]) + "TabBody";
		const tableId = removeSpaces(sheetsName[i]) + "Table";

		makeReportTable(headerList, placeList, searchList, conatinerId, tableId, "100%");

	}

	allsheets = sheetsName;

}


function makeSheetStatus(sheetName, l_s_s_id) {

	var returnObject = getSheetStatus(l_s_s_id);



	if (returnObject != null) {
		const keysList = Object.keys(returnObject.signatures);
		console.log(keysList);
		var hasMultiple = keysList.length > 1;

		var card = `
		<div class="col-md-3">
		  <div class="card my-2">
		    <div class="card-body ${returnObject.all_signatures_done === true ? 'bg-success' : 'bg-warning'} 
		    			text-white p-1 d-flex justify-content-between align-items-end">
		      <h6 class="card-title mb-0"><b>${sheetName}</b></h6>
		      <span style="font-size: 10px;">${formatDateTime(returnObject.last_filled_at)}</span>
		    </div>
		    
		    <ul class="list-group list-group-flush" style="font-size: 12px;">
		      <!-- First item -->
		      <li class="list-group-item p-1 d-flex justify-content-between align-items-center">
		        ${toTitleCase(toNormalForm(keysList[0] ? keysList[0] : "No Data"))} - ${keysList[0] ? returnObject.signatures[keysList[0]] : ""}
		        
		         <!-- Hidden items -->
		      ${hasMultiple ? `
		          <button class="btn btn-sm p-0 toggle-collapse" style="font-size: 12px;"
				        data-target="#collapse-${removeSpaces(sheetName)}">Show All</button>
		      ` : ""}
		      </li>
		
		      <!-- Hidden items -->
		      ${hasMultiple ? `
		        <div class="collapse" id="collapse-${removeSpaces(sheetName)}">
		          ${keysList.slice(1).map(s => `
		            <li class="list-group-item p-1 d-flex justify-content-between align-items-center">
		              ${toTitleCase(toNormalForm(s))} - ${returnObject.signatures[s]}
		            </li>
		          `).join("")}
		        </div>
		      ` : ""}
		    </ul>
		  </div>
		</div>`;


		$("#sheetStatusContainer").append(card);

		/*	var div = document.createElement("div");
			div.setAttribute("class", "col-md-2 badge bg-secondary bg-gradient mx-3");
			div.innerText = sheetName;
			$("#sheetStatusContainer").append(div);*/

	}



}

$(document).on('click', '.toggle-collapse', function() {
	const target = $(this).data('target');
	console.log($(this).text());
	if ($(this).text() == "Show All") {
		$(this).text("Hide All");

	} else if ($(this).text() == "Hide All") {

		$(this).text("Show All");
	}
	$(target).collapse('toggle');
});


function toNormalForm(str) {
	return str
		.replace(/_/g, " ")
		.toLowerCase()
		.replace(/^./, char => char.toUpperCase());
}

function toTitleCase(str) {
	return str
		.replace(/_/g, " ")
		.toLowerCase()
		.replace(/\b\w/g, char => char.toUpperCase());
}

function getSheetStatus(l_s_s_id) {

	var returnObject = null

	$.ajax({
		type: 'get',
		url: '/WebApplication/Controllers/sign-status/' + l_s_s_id,  // in StationMasterAjaxController
		async: false,   // sync request (not recommended, blocks UI)
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {

			returnObject = res;


		},
		error: function(response) {

		}
	});

	return returnObject;

}

function makeReportTable(headerList, placeholderList, searchList, containerId, tableId, width) {

	var table = document.createElement("table");
	$("#" + containerId).append(table);
	table.setAttribute("id", tableId);
	table.setAttribute("style", "width:" + width + ";")
	table.setAttribute("cellspacing", "0px");
	table.setAttribute("class", "table-hover");

	var searchRow = document.createElement("tr");
	var headingRow = document.createElement("tr");

	if (searchList.length > 0) {

		searchRow.setAttribute("id", "searchRow");
		var imgContainer = document.createElement("th");
		imgContainer.setAttribute("class", "tableheading");
		var img = document.createElement("img");
		img.setAttribute("src", "/WebApplication/images/searchFilter.png");
		img.setAttribute("id", "searchReportButton");
		img.setAttribute("width", "22");
		img.setAttribute("height", "22");
		// Add the tooltip text
		img.setAttribute("title", "Type in the search box and click this icon to find results.");
		imgContainer.append(img);
		searchRow.append(imgContainer);

		for (var i = 0; i < searchList.length; i++) {
			var th = document.createElement("th");
			th.setAttribute("class", "tableheading");
			th.setAttribute("style", "padding-top: 8px;"); // Add padding to create space
			if (searchList[i] != "") {
				var input = document.createElement("input");
				input.setAttribute("name", searchList[i]);
				input.setAttribute("id", searchList[i]);
				input.setAttribute("class", "searchFilterClass inputs");
				// Set placeholder dynamically
				input.setAttribute("placeholder", placeholderList[i] + " ....."); // set placeholder

				th.append(input);
			}

			searchRow.append(th);
		}
	}

	for (var i = 0; i < headerList.length; i++) {
		var th = document.createElement("th");
		th.setAttribute("class", "tableheading");
		th.append(headerList[i]);
		headingRow.append(th);
	}

	var thead = document.createElement("thead");
	thead.setAttribute("id", tableId + "Head");

	var tbody = document.createElement("tbody");
	tbody.setAttribute("id", tableId + "Body");

	table.append(thead, tbody);
	thead.append(searchRow, headingRow);
}


function getAllDataOfSheet(tableId, stationId, sheetName) {

	/*	const model = $("#selectedModel").val() ?? "";
		const variant = $("#selectedVariant").val() ?? "";
		const shift = $("#selectedShift").val() ?? "";*/


	const model = $("#searchModel" + removeSpaces(selectedTab)).val() ?? "";
	const variant = $("#searchVariant" + removeSpaces(selectedTab)).val() ?? "";
	const shift = $("#searchShift" + removeSpaces(selectedTab)).val() ?? "";
	const startDate = $('#reportFrom').val();
	const endDate = $('#reportTo').val();
	//	const stationId = sheetsAndId["Product History Sheet"]

	var formData = {
		model: model,
		variant: variant,
		shift: shift,
		paramNo: sheetName,
		startOfProduction: startDate + " 00:00" + "," + endDate + " 23:59",
		lineStationSheetMapping: {
			id: stationId
		}
	};

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getAllDataOfSheet/' + (currentPage - 1) + '/' + pageSize,  // in StationMasterAjaxController
		data: JSON.stringify(formData),
		async: false,   // sync request (not recommended, blocks UI)
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {

			allSheetPageSize[sheetName] = res.data.totalElements;
			//currentPage = res.data.number + 1;

			if (res.sheetType === "ph") {
				insertPHReportDataInTable(res.data.content, tableId, res.sheetType);
			} else if (res.sheetType === "pds") {
				insertPDReportDataInTable(res.data.content, tableId, res.sheetType);
			} else if (res.sheetType === "mcs") {
				insertMCReportDataInTable(res.data.content, tableId, res.sheetType);
			} else if (res.sheetType === "ionizer") {
				insertIonizerReportDataInTable(res.data.content, tableId, res.sheetType);
			}

		},
		error: function(response) {
			$("#warningInformationModalBody").text(response.responseText);
			$("#warningBackdropButton").click();
		}
	});
}


function getMonthName(dateString) {
	const date = new Date(dateString);
	const monthNames = [
		"January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	];
	return monthNames[date.getMonth()];
}


/*-------------------------------- For visibility on frontend ---------------------*/
window.insertPHReportDataInTable = insertPHReportDataInTable;
function insertPHReportDataInTable($item, tableId, sheetType) { // shows based on the return Distinct dates only for the first call.
	$("#" + tableId + "Body").empty();

	var sequenceNumber = getSequence();

	$.each($item, function(index, value) {

		var row = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId" class="width100">' + (sequenceNumber + 1) + '</td>'
			+ '<td data-column="model" class="width2500 ">' + (value.model == null ? '' : value.model) + '</td>'
			+ '<td data-column="variant" class="width250 textLeftAlign">' + (value.variant == null ? '' : value.variant) + '</td>'
			+ '<td data-column="shift" class="textLeftAlign">' + (value.shift == null ? '' : value.shift) + '</td>'
			+ '<td data-column="date" class="width120">' + (value.logicalShiftDateTime == null ? '' : formatDateTime(value.logicalShiftDateTime)) + '</td>'
			// 👇 You can add the sheetType in a hidden column or attribute
			+ '<td data-column="sheetType" style="display:none;">' + sheetType + '</td>'
			+ '<td data-column="lineStationSheetMappingId" style="display:none;">' + value.lineStationSheetMapping.id + '</td>'
			+ '<td data-column="sheetId" style="display:none;">' + value.lineStationSheetMapping.sheet.id + '</td>'
			+ '<td data-column="batchId" style="display:none;">' + (value.batchId == null ? '' : value.batchId) + '</td>'
			+ '<td data-column="id" style="display:none;">' + (value.id == null ? '' : value.id) + '</td>'
			+ '<td data-column="filledNo">' + (value.filledNo == null ? '' : value.filledNo) + '</td>'
			+ '<td data-column="viewSheet"><button type="button" class="btn btn-primary btn-sm my-1 viewPhSheet">Open Sheet</button></td></tr>';

		$("#" + tableId).append(row);
		sequenceNumber++;
	});
}


window.insertPDReportDataInTable = insertPDReportDataInTable;
function insertPDReportDataInTable($item, tableId, sheetType) {
	$("#" + tableId + "Body").empty();

	var sequenceNumber = getSequence();

	$.each($item, function(index, value) {

		var row = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId" class="width100">' + (sequenceNumber + 1) + '</td>'
			+ '<td data-column="model" class="width2500 ">' + (value.model == null ? '' : value.model) + '</td>'
			+ '<td data-column="variant" class="width250 textLeftAlign">' + (value.variant == null ? '' : value.variant) + '</td>'
			+ '<td data-column="shift" class="textLeftAlign">' + (value.shift == null ? '' : value.shift) + '</td>'
			+ '<td data-column="countNo" class="textLeftAlign">' + (value.countNo == null ? '' : value.countNo) + '</td>'
			+ '<td data-column="date" class="width120 d-none">' + (value.logicalShiftDateTime == null ? '' : formatDateTime(value.logicalShiftDateTime)) + '</td>'
			+ '<td data-column="date" class="width120">' + getMonthName((value.logicalShiftDateTime == null ? '' : formatDateTime(value.logicalShiftDateTime))) + ' ' + formatYearOnly((value.logicalShiftDateTime == null ? '' : formatDateTime(value.logicalShiftDateTime))) + '</td>'
			// 👇 You can add the sheetType in a hidden column or attribute
			+ '<td data-column="sheetType" style="display:none;">' + sheetType + '</td>'
			+ '<td data-column="lineStationSheetMappingId" style="display:none;">' + value.lineStationSheetMapping.id + '</td>'
			+ '<td data-column="sheetId" style="display:none;">' + value.lineStationSheetMapping.sheet.id + '</td>'
			+ '<td data-column="batchId" style="display:none;">' + (value.batchId == null ? '' : value.batchId) + '</td>'
			+ '<td data-column="id" style="display:none;">' + (value.id == null ? '' : value.id) + '</td>'
			+ '<td data-column="filledNo">' + (value.filledNo == null ? '' : value.filledNo) + '</td>'
			+ '<td data-column="viewSheet"><button type="button" class="btn btn-primary btn-sm my-1 viewPdSheet">Open Sheet</button></td></tr>';

		$("#" + tableId).append(row);
		sequenceNumber++;
	});
}

window.insertMCReportDataInTable = insertMCReportDataInTable;
function insertMCReportDataInTable($item, tableId, sheetType) {
	$("#" + tableId + "Body").empty();

	var sequenceNumber = getSequence();

	$.each($item, function(index, value) {

		var row = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId" class="width100">' + (sequenceNumber + 1) + '</td>'
			+ '<td data-column="shift" class="textLeftAlign">' + (value.shift == null ? '' : value.shift) + '</td>'
			+ '<td data-column="date" class="width120 d-none">' + (value.logicalShiftDateTime == null ? '' : formatDateTime(value.logicalShiftDateTime)) + '</td>'
			+ '<td data-column="date" class="width120">' + getMonthName((value.logicalShiftDateTime == null ? '' : formatDateTime(value.logicalShiftDateTime))) + ' ' + formatYearOnly((value.logicalShiftDateTime == null ? '' : formatDateTime(value.logicalShiftDateTime))) + '</td>'
			// 👇 You can add the sheetType in a hidden column or attribute
			+ '<td data-column="sheetType" style="display:none;">' + sheetType + '</td>'
			+ '<td data-column="lineStationSheetMappingId" style="display:none;">' + value.lineStationSheetMapping.id + '</td>'
			+ '<td data-column="sheetId" style="display:none;">' + value.lineStationSheetMapping.sheet.id + '</td>'
			+ '<td data-column="batchId" style="display:none;">' + (value.batchId == null ? '' : value.batchId) + '</td>'
			+ '<td data-column="id" style="display:none;">' + (value.id == null ? '' : value.id) + '</td>'
			+ '<td data-column="viewSheet"><button type="button" class="btn btn-primary btn-sm my-1 viewMcSheet">Open Sheet</button></td></tr>';

		$("#" + tableId).append(row);
		sequenceNumber++;
	});

}


function getSequence() {

	return pageSize * (currentPage - 1);
}

window.insertIonizerReportDataInTable = insertIonizerReportDataInTable;
function insertIonizerReportDataInTable($item, tableId, sheetType) {
	$("#" + tableId + "Body").empty();

	var sequenceNumber = getSequence();

	$.each($item, function(index, value) {

		var row = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId" class="width100">' + (sequenceNumber + 1) + '</td>'
			+ '<td data-column="shift" class="textLeftAlign">' + (value.shift == null ? '' : value.shift) + '</td>'
			+ '<td data-column="date" class="width120 d-none">' + (value.logicalShiftDateTime == null ? '' : formatDateTime(value.logicalShiftDateTime)) + '</td>'
			+ '<td data-column="date" class="width120">' + getMonthName((value.logicalShiftDateTime == null ? '' : formatDateTime(value.logicalShiftDateTime))) + ' ' + formatYearOnly((value.logicalShiftDateTime == null ? '' : formatDateTime(value.logicalShiftDateTime))) + '</td>'
			// 👇 You can add the sheetType in a hidden column or attribute
			+ '<td data-column="sheetType" style="display:none;">' + sheetType + '</td>'
			+ '<td data-column="lineStationSheetMappingId" style="display:none;">' + value.lineStationSheetMapping.id + '</td>'
			+ '<td data-column="sheetId" style="display:none;">' + value.lineStationSheetMapping.sheet.id + '</td>'
			+ '<td data-column="batchId" style="display:none;">' + (value.batchId == null ? '' : value.batchId) + '</td>'
			+ '<td data-column="id" style="display:none;">' + (value.id == null ? '' : value.id) + '</td>'
			+ '<td data-column="viewSheet"><button type="button" class="btn btn-primary btn-sm my-1 viewIonizerSheet">Open Sheet</button></td></tr>';

		$("#" + tableId).append(row);
		sequenceNumber++;
	});


}



/*
$(document).on("click", ".downloadPdf", function() {
	const row = $(this).closest("tr");

	let sheetType = row.find("td[data-column='sheetType']").text().trim();
	let createdAt = row.find("td[data-column='date']").text().trim(); // ✅ get date cell text
	let startDate = "", endDate = "";
	if (sheetType.toLowerCase() === "ph") {

		({ startDate, endDate } = getStartAndEndDateForDaily(createdAt));
	} else if (sheetType.toLowerCase() === "pds" || sheetType.toLowerCase() === "mcs") {
		
		({ startDate, endDate } = getStartAndEndDateForMonthly(createdAt));
	}
	 
	console.log("startDate", startDate, "endDate", endDate);
	let shift = row.find("td[data-column='shift']").text().trim();
	let batchId = row.find("td[data-column='batchId']").text().trim()
	const formData = {
		shift: shift,
		model: row.find("td[data-column='model']").text().trim(),
		variant: row.find("td[data-column='variant']").text().trim(),
		batchId: batchId,
		sheetId: row.find("td[data-column='sheetId']").text().trim(),
		startDate: startDate,
		endDate: endDate,
	};

	// ✅ build query params string for GET
	const queryString = new URLSearchParams(formData).toString();
 //   const endpoint = `/WebApplication/Controllers/download-phsheet-pdf?${queryString}`;
 
 let endpoint = "";
 let fileName = "";
 const now = new Date();
 const formattedDate = now.getFullYear() + '-' +
	 String(now.getMonth() + 1).padStart(2, '0') + '-' +
	 String(now.getDate()).padStart(2, '0');
 const formattedTime = String(now.getHours()).padStart(2, '0') + '-' +
	 String(now.getMinutes()).padStart(2, '0') + '-' +
	 String(now.getSeconds()).padStart(2, '0');
 const timestamp = `${formattedDate}_${formattedTime}`;
 // console.log("Downloading sheet with sheetId:", sheetId);
	console.log("shhet type", sheetType);
	console.log("batchId", batchId);
	
	if (sheetType.toLowerCase() === "ph") { // currently written in ExcelDownloadController
		endpoint = `/WebApplication/Controllers/download-phsheet-pdf?${queryString}`;
		fileName = `PHSheet_Report_${shift}_${timestamp}.pdf`;
	} else if (sheetType.toLowerCase() === "pds") {
		endpoint = `/WebApplication/Controllers/download-pdsheet-pdf?${queryString}`;
		fileName = `PDSheet_Report_${shift}_${timestamp}.pdf`;
	} else if (sheetType.toLowerCase() === "mcs") {
		//    endpoint = `/WebApplication/Controllers/download-mcssheet-pdf?shift=${shift}&model=${model}&variant=${variant}&startDate=${startDate}&endDate=${endDate}&batchId=${batchId}&sheetId=${sheetId}&lssid=${lssid}`;
		   fileName = `MCSSheet_Report_${shift}_${timestamp}.pdf`;
	}

	fetch(endpoint, {
		method: "GET",
		headers: {
			Authorization: "Bearer " + sessionStorage.getItem("token")
		}
	})
	.then(async response => {
		if (!response.ok) {
			const text = await response.text();
			throw new Error(text || `HTTP error! Status: ${response.status}`);
		}
		return response.blob();
	})
	.then(blob => {
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = fileName; // you can make this dynamic
		document.body.appendChild(link);
		link.click();
		link.remove();
	})
	.catch(error => {
		console.error("Download failed:", error.message);
		setTimeout(() => {
			setTextById("warningInformationModalBody", error.message);
			showModal("warningBackdropButton");
		}, 500);
	});
});

function getStartAndEndDateForDaily(createdAt) {
	let dateOnly = createdAt ? createdAt.split(/[ T]/)[0] : "";

	// Reformat dd-MM-yyyy -> yyyy-MM-dd if needed
	if (dateOnly.includes("-") && dateOnly.split("-")[0].length === 2) {
		let [dd, mm, yyyy] = dateOnly.split("-");
		dateOnly = `${yyyy}-${mm}-${dd}`;
	}

	if (!dateOnly) return { startDate: "", endDate: "" };

	let dateObj = new Date(dateOnly);

	// ✅ Start of day (00:00:00)
	let start = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 0, 0, 0);
	// ✅ End of day (23:59:59)
	let end = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 23, 59, 59);

	// Format yyyy-MM-dd HH:mm:ss
	const formatDateTime = d =>
		d.getFullYear() + "-" +
		String(d.getMonth() + 1).padStart(2, "0") + "-" +
		String(d.getDate()).padStart(2, "0") + " " +
		String(d.getHours()).padStart(2, "0") + ":" +
		String(d.getMinutes()).padStart(2, "0") + ":" +
		String(d.getSeconds()).padStart(2, "0");

	return {
		startDate: formatDateTime(start),
		endDate: formatDateTime(end)
	};
}

function getStartAndEndDateForMonthly(createdAt) {
	let dateOnly = createdAt ? createdAt.split(/[ T]/)[0] : "";

	// Reformat dd-MM-yyyy -> yyyy-MM-dd if needed
	if (dateOnly.includes("-") && dateOnly.split("-")[0].length === 2) {
		// dd-MM-yyyy
		let [dd, mm, yyyy] = dateOnly.split("-");
		dateOnly = `${yyyy}-${mm}-${dd}`;
	}

	if (!dateOnly) return { startDate: "", endDate: "" };

	let dateObj = new Date(dateOnly);

	// ✅ Start of month (1st day, midnight)
	let start = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1, 0, 0, 0);
	// ✅ End of month (last day, 23:59:59)
	let end = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0, 23, 59, 59);

	// Format yyyy-MM-dd HH:mm:ss
	const formatDateTime = d =>
		d.getFullYear() + "-" +
		String(d.getMonth() + 1).padStart(2, "0") + "-" +
		String(d.getDate()).padStart(2, "0") + " " +
		String(d.getHours()).padStart(2, "0") + ":" +
		String(d.getMinutes()).padStart(2, "0") + ":" +
		String(d.getSeconds()).padStart(2, "0");

	return {
		startDate: formatDateTime(start),
		endDate: formatDateTime(end)
	};
}
*/
/*
$(document).on("click", ".downloadPdf", function () {
	const row = $(this).closest("tr");

	// ✅ get date cell text
	let createdAt = row.find("td[data-column='date']").text().trim();

	// ✅ take only YYYY-MM-DD part (before "T" or space)
	let dateOnly = createdAt ? createdAt.split(/[ T]/)[0] : "";
	// Reformat dd-MM-yyyy -> yyyy-MM-dd if needed
	if (dateOnly.includes("-") && dateOnly.split("-")[0].length === 2) {
		// dd-MM-yyyy
		let [dd, mm, yyyy] = dateOnly.split("-");
		dateOnly = `${yyyy}-${mm}-${dd}`;
	}
	
	const formData = {
		shift: row.find("td[data-column='shift']").text().trim(),
		model: row.find("td[data-column='model']").text().trim(),
		variant: row.find("td[data-column='variant']").text().trim(),
		batchId: row.find("td[data-column='batchId']").text().trim(),
		sheetId: row.find("td[data-column='sheetId']").text().trim(),
		startDate: dateOnly ? dateOnly : "",
		endDate: dateOnly ? dateOnly : "",
	};

	$.ajax({
		type: "GET",  // ✅ must be GET to match @GetMapping
		url: "/WebApplication/Controllers/download-phsheet-pdf",
		data: formData, // ✅ no need for JSON.stringify
		headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
		xhrFields: {
			responseType: 'blob'
		},
		success: function (blob) {
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = "phsheet.pdf";
			document.body.appendChild(a);
			a.click();
			a.remove();
		},
		error: function (xhr) {
			console.error("Download failed", xhr.status, xhr.responseText);
		}
	});
});
*/

function fetchStationsByLine(lineId) {
	if (!lineId) {
		console.warn("fetchStationsByLine called with undefined lineId");
		return;
	}

	$.ajax({
		type: 'GET',   // in SelectListAjaxController
		url: `/WebApplication/Controllers/getStationsByLine/${lineId}`,
		headers: {
			Authorization: `Bearer ${sessionStorage.getItem('token')}`
		},
		success: function(stations) {
			const stationSelect = document.getElementById("stationSelect");
			stationSelect.innerHTML = '<option disabled selected>Select Station</option>' +
				stations.map(station => `
						<option value="${station.id}">${station.name}</option>
					`).join('');
		},
		error: function(xhr, status, error) {
			console.error("Failed to fetch stations for line", lineId, error);
		}
	});
}

function loadSheetTypes() {
	fetch("/WebApplication/Controllers/sheet-types", {
		headers: {
			Authorization: "Bearer " + sessionStorage.getItem("token")
		}
	})
		.then(res => res.json())
		.then(types => {
			const select = document.getElementById("sheetTypeSelect");
			select.innerHTML = '<option value="" disabled selected>Select Sheet Name</option>'; // reset
			types.forEach(type => {
				const option = document.createElement("option");
				option.value = type;
				option.textContent = type;
				select.appendChild(option);
			});
		})
		.catch(err => console.error("Failed to load sheet types", err));
}


