
$(document).on('click', '#rqcApproval', function() {

	$("#offcanvasCloseButton").click();
	$("#masterHeading").text("RQC APPROVAL")

	$("#tableContainer").empty();
	$("#pagerContainer").empty();
	makePagerBody("pagerContainer");

	var headerList = ["S.No.", "RQC-P No.", "Rev No.", "Part No.", "Part Description", "No. of Parameter", "Created By", "Date & Time", "Approve / Discard", "Implement Date", "Customer", "Model", "Status"];
	var searchList = ["searchrqcNo", "searchrevNo", "searchPartNumber", "","", "" , "" , "" , "", "", "", ""]; // "searchCustomer", "searchModel", searchPartDescription
	var placeholderList = ["RQC-P No.", "Rev No.", "Part No.", "Part Description","", "" , "" , "" , "", "", "Moel", ""]; //  "Customer", "Model",
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

	getIdByMasterName($(this).attr('id'));
});


window.loadApprovalPendingMispData = loadApprovalPendingMispData;
function loadApprovalPendingMispData(page, pageSize) {
	const isSearch = isSearchApplied(); // You write this function
	//$("#pageSelect").val(page);

	var mispNumber = $('#searchrqcNo').val() ?? "";
	var revNumber = $('#searchrevNo').val() ?? "";
	var partNumber = $('#searchPartNumber').val() ?? "";
	//var partDescription = $('#searchPartDescription').val() ?? "";
	//var customer = $('#searchCustomer').val() ?? "";
	//var model = $('#searchModel').val() ?? "";
	
/*	const mispNumber = $('input[title="searchmispNo"]').val() ?? "";
	const revNumber = $('input[title="searchrevNo"]').val() ?? "";
	const partNumber = $('input[title="searchPartNumber"]').val() ?? "";
	const customer = $('input[title="searchCustomer"]').val() ?? "";
	const model = $('input[title="searchModel"]').val() ?? "";*/

	const formData = {
		mispNumber, revNumber, partNumber
	}; //, customer, model

	const url = isSearch
		? '/WebApplication/Controllers/getLikeApprovalPendingMispData/' + page 
		: '/WebApplication/Controllers/getAllApprovalPendingMispData/' + page * pageSize;

	const method = isSearch ? 'POST' : 'GET';

	$.ajax({
		url: url,
		type: method,
		data: isSearch ? JSON.stringify(formData) : null,
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function (res) {
			const content = isSearch ? res.content : res;
			makePagerByTotalPages(isSearch ? res : { totalPages: calculatePages(res.length) }, page);
			// insertApprovalMispMasterInTable(content, "table1");
			
			
			if (res.length > 0) {
				insertApprovalMispMasterInTable(content, "table1");
			} else {
				alert(" No RQC-P found for approval.")
				insertApprovalMispMasterInTable(content, "table1");
				$("#tableBody").remove();
				var tablebody = document.createElement("tbody");
				tablebody.setAttribute("id", "tableBody");
				$("#table1").append(tablebody);

			}
		},
		error: function (response) {
			$("#warningInformationModalBody").text(response.responseText);
			$("#warningBackdropButton").click();
		}
	});
}

function calculatePages(length) {
	const pageSize = parseInt($("#pageSize").val()) || 25;
	return Math.ceil(length / pageSize);
}


function isSearchApplied() {
	
	var hasMisp = $('#searchrqcNo').val()?.trim() ?? "";
	var hasRev = $('#searchrevNo').val()?.trim() ?? "";
	var hasPart = $('#searchPartNumber').val()?.trim() ?? "";
	var customer = $('#searchCustomer').val()?.trim() ?? "";
	var model = $('#searchModel').val()?.trim() ?? "";

	return hasMisp || hasRev || hasPart;  // || hasCust || hasModel
}

/*
window.loadLikeInstrumentData = loadLikeInstrumentData;
function loadLikeInstrumentData(page, pageSize) {
	// f part is for form
	var instrumentNamef = $('#searchInstrumentName').val() ?? "";
	var instrumentControlNof = $('#searchInstrumentControlNo').val() ?? "";
	var calibrationFrequencyf = $('#searchCalibrationFrequency').val() ?? "";
	var calibrationDatef = $('#searchCalibrationDate').val() ?? "";
	var inspectionMethodf = $('#searchInspectionMethod').val() ?? "";
	var createdfBy = $('#searchCreatedBy').val() ?? "";

	var formData = {
		instrumentName: instrumentNamef,
		instrumentControlNo: instrumentControlNof,
		calibrationFrequency: calibrationFrequencyf,
		calibrationDate: calibrationDatef,
		inspectionMethod: inspectionMethodf,
		createdBy: createdfBy
	}

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getLikeInstrumentMaster/' + page + '/' + pageSize,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {

			makePagerByTotalPages(res, page);
			insertInstrumentInTable(res.content, "table1");
		},
		error: function(response) {


		}
	});
}
*/
/*-------------------------------- For visibility on frontend ---------------------*/
/*window.insertInstrumentInTable = insertInstrumentInTable;
function insertInstrumentInTable($item, tableId) {
	$("#" + tableId + "Body").empty();

	var sequenceNumber = getSequenceNumber();

	$.each($item, function(index, value) {
		 will use data-column="instrumentNamed"  in edit for getting data from roof table
		var row = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId" class="width50">' + (sequenceNumber + 1) + '</td>'
			+ '<td data-column="instrumentNamed" class="width125">' + (value.instrumentName == null ? '' : value.instrumentName) + '</td>'
			+ '<td data-column="instrumentControlNo" class="width100 textLeftAlign">' + (value.instrumentControlNo == null ? '' : value.instrumentControlNo) + '</td>'
			+ '<td data-column="calibrationFrequency" class="width100 textLeftAlign">' + (value.calibrationFrequency == null ? '' : value.calibrationFrequency) + '</td>'
			+ '<td data-column="calibrationDate" class="width100">' + (value.calibrationDate == null ? '' : value.calibrationDate) + '</td>'
			+ '<td data-column="inspectionMethod" class="width100">' + (value.inspectionMethod == null ? '' : value.inspectionMethod) + '</td>'
			+ '<td data-column="createdBy" class="width50">' + (value.createdBy == null ? '' : value.createdBy) + '</td>'
			+ '<td data-column="dateTime" class="width150">' + (value.dateTime == null ? '' : value.dateTime) + '</td>'
			+ '<td data-column="instrumentId" style="display:none;">' + (value.instrumentId == null ? '' : value.instrumentId) +'</td></tr>';
		$("#" + tableId).append(row);
		sequenceNumber++;
	});
}

*/


/*-----------------------------------------MISP Approval Master RQC Approval Master---------------------------------------------*/
/*
$(document).ready(function() {

	$(document).on('click', '#rqcApproval', function() {

		searchLoad = true;

		$("#offcanvasCloseButton").click();

		var child1 = document.getElementById("div3");
		var child2 = document.getElementById("div4");

		child1.remove();
		child2.remove();

		document.getElementById("masterHeading").innerText = "";
		$("#masterHeading").append("RQC APPROVAL");

		var div3 = document.createElement("div");
		var div4 = document.createElement("div");

		$("#div2").append(div3, div4);

		div3.setAttribute("id", "div3");
		div3.setAttribute("class", "masterBody");

		div4.setAttribute("id", "div4");
		div4.setAttribute("class", "masterBody");
		div4.setAttribute("Style", "overflow-y:scroll;");


		var bottom = document.createElement("div");

		bottom.setAttribute("id", "bottom");
			bottom.setAttribute("style","height: 50%;")

		$("#div4").append(bottom);

		var element1 = document.createElement("table");
		$("#div3").append(element1);
		element1.setAttribute("id", "table1");
		element1.setAttribute("cellspacing", "0px");
		element1.setAttribute("cellpaddding","10px");
		element1.setAttribute("class", "table-hover");
		var w = window.innerWidth;

		if (w < 500) {
			element1.setAttribute("style", "width:300%;");
		} else if (w < 1100) {
			element1.setAttribute("style", "width:200%;");
		}
		else if (w < 1500) {
			element1.setAttribute("style", "width:100%;");
		} else if (w < 2000) {
			element1.setAttribute("style", "width:100%;");
		} else {
			element1.setAttribute("style", "width:100%;");
		}

		var element1_1 = document.createElement("thead");
		element1.append(element1_1);

		var element1_2 = document.createElement("tr");

		var element1_3 = document.createElement("tbody");
		element1.append(element1_3)
		element1_3.setAttribute("id", "tableBody")

		// search
		*******************



		var searchRow = document.createElement("tr");
		searchRow.setAttribute("id", "searchRow");
		var imgContainer = document.createElement("th");
		imgContainer.setAttribute("class", "tableheading");
		var img = document.createElement("img");
		img.setAttribute("src", "/WebApplication/images/searchFilter.png"); img.setAttribute("id", "searchButton");
		img.setAttribute("width", "22");
		img.setAttribute("height", "22");
		imgContainer.append(img);
		searchRow.append(imgContainer);

		var searchTitles = ["searchmispNo", "searchrevNo", "searchPartNumber"];

		for (var i = 0; i < searchTitles.length; i++) {
			var searchContainer = document.createElement("th");
			searchContainer.setAttribute("class", "tableheading");
			var searchinput = document.createElement("input");
			searchinput.setAttribute("style", "width:100%;");
			searchinput.setAttribute("title", searchTitles[i]);
			searchinput.setAttribute("class", "searchFilterClass inputs");
			searchContainer.append(searchinput);
			searchRow.append(searchContainer);
		}

		element1_1.append(searchRow);

		*******************

		element1_1.append(element1_2);

		var element2 = document.createElement("th");
		element2.innerText = "S.N.";
		var element3 = document.createElement("th");
		element3.innerText = "RQC-P No.";
		var element3_1 = document.createElement("th");
		element3_1.innerText = "Description";
		element3_1.setAttribute("style", "width:300px");
		var element4 = document.createElement("th");
		element4.innerText = "Rev No.";
		var element5 = document.createElement("th");
		element5.innerText = "Part No.";
		var element6 = document.createElement("th");
		element6.innerText = "No. of Parameter";
		var element7 = document.createElement("th");
		element7.innerText = "Created By";
		var element8 = document.createElement("th");
		element8.innerText = "Date";
		var element9 = document.createElement("th");
		element9.innerText = "Approved By";
		var element9_2 = document.createElement("th");
		element9_2.innerText = "Impl. Date";
		var element9_3 = document.createElement("th");
		element9_3.innerText = "Status";

		element1_2.append(element2, element3, element4, element5, element3_1, element6, element7, element8, element9, element9_2, element9_3);
		element2.setAttribute("class", "tableheading");
		// element2.setAttribute("scope","col");
		element3.setAttribute("class", "tableheading");
		element3_1.setAttribute("class", "tableheading");
		// element3.setAttribute("scope","col");
		element4.setAttribute("class", "tableheading");
		// element4.setAttribute("scope","col");
		element5.setAttribute("class", "tableheading");
		// element5.setAttribute("scope","col");
		element6.setAttribute("class", "tableheading");
		// element6.setAttribute("scope","col");
		element7.setAttribute("class", "tableheading");
		// element7.setAttribute("scope","col");
		element8.setAttribute("class", "tableheading");
		// element8.setAttribute("scope","col");
		element9.setAttribute("class", "tableheading");
		element9_2.setAttribute("class", "tableheading");
		element9_3.setAttribute("class", "tableheading");


		var element18_2 = document.createElement("div");
		$("#bottom").append(element18_2);


		var element34 = document.createElement("div");
		var element35 = document.createElement("div");
		var element36 = document.createElement("div");

		$("#bottom").append(element18_2);
		element18_2.append(element34, element35, element36);

		element34.setAttribute("class", "buttonsContainer");
		element35.setAttribute("class", "buttonsContainer");
		element36.setAttribute("class", "buttonsContainer");

		var element37 = document.createElement("button");
		var element38 = document.createElement("button");
		var element39 = document.createElement("button");

		element34.append(element37);
		element35.append(element38);
		element36.append(element39);

		var addbuttonAttr = ["class", "add", "title", "Add", "disabled", "disabled", "style", "opacity:0.5"];
		for (var i = 0; i <= addbuttonAttr.length - 1; i = i + 2) {
			for (var j = 0; j <= i; j = j + 2) {
				element37.setAttribute(addbuttonAttr[i], addbuttonAttr[j + 1]);

			}
		}
		var ediybuttonAttr = ["class", "edit", "title", "Edit", "disabled", "disabled", "style", "opacity:0.5"];
		for (var i = 0; i <= ediybuttonAttr.length - 1; i = i + 2) {
			for (var j = 0; j <= i; j = j + 2) {
				element38.setAttribute(ediybuttonAttr[i], ediybuttonAttr[j + 1]);

			}
		}
		var deletebuttonAttr = ["class", "delete", "title", "Delete", "disabled", "disabled", "style", "opacity:0.5"];
		for (var i = 0; i <= deletebuttonAttr.length - 1; i = i + 2) {
			for (var j = 0; j <= i; j = j + 2) {
				element39.setAttribute(deletebuttonAttr[i], deletebuttonAttr[j + 1]);

			}
		}
		//------------------------------------
		var element40 = document.createElement("div");
		var element41 = document.createElement("div");
		var element42 = document.createElement("div");
		var element42_2 = document.createElement("div");
		var element42_3 = document.createElement("div");


		element18_2.append(element40, element41, element42, element42_2, element42_3);

		element40.setAttribute("class", "buttonsContainer");
		element41.setAttribute("class", "buttonsContainer");
		element42.setAttribute("class", "buttonsContainer");
		element42_2.setAttribute("class", "buttonsContainer");
		element42_3.setAttribute("class", "buttonsContainer");

		var element43 = document.createElement("button");
		element43.setAttribute("class", "template");
		element43.setAttribute("title", "Template");


		var element44 = document.createElement("button");
		element44.setAttribute("class", "data");
		element44.setAttribute("title", "Excel Download");

		var element45 = document.createElement("button");
		element45.setAttribute("class", "upload");
		element45.setAttribute("title", "Excel Upload"); element45.setAttribute("style", "opacity:0.5"); element45.setAttribute("disabled", "disabled");

		var element45_2 = document.createElement("button");
		element45_2.setAttribute("class", "search");
		element45_2.setAttribute("title", "Home");

		var element45_3 = document.createElement("button");
		element45_3.setAttribute("class", "userDetails");
		element45_3.setAttribute("title", "User");

		element40.append(element43);
		element41.append(element44);
		element42.append(element45);
		element42_2.append(element45_2);
		element42_3.append(element45_3);

		getIdByMasterName($(this).attr('id'));
		loadApprovalPendingMispDataPager();
		loadApprovalPendingMispData(0);

	});
});
*/


// these 3 function is now replaced by my dynamic function :-  loadApprovalPendingMispData()
/*
function loadApprovalPendingMispData(page, pageSize) {

	$("#pageSelect").val(page);
	$.ajax({
		url: "/WebApplication/Controllers/getAllApprovalPendingMispData/" + page * pageSize,
		type: 'GET',
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		dataType: 'json',
		success: function(response) {

			if (response.length > 0) {
				insertApprovalMispMasterInTable(response, "table1");
			} else {
				alert("Anyone RQC-P No are not found for approval.")

				$("#tableBody").remove();
				var tablebody = document.createElement("tbody");
				tablebody.setAttribute("id", "tableBody");
				$("#table1").append(tablebody);

			}

		}, error: function(response) {
			$("#warningInformationModalBody").text(response.responseText);
			$("#warningBackdropButton").click();
		}
	});
}

function loadApprovalPendingMispDataPager() {
	$.ajax({
		url: "/WebApplication/Controllers/getAllApprovalPendingMispDataPager",
		type: 'GET',
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		async: false,
		dataType: 'json',
		success: function(res) {

			var totalpage = Math.ceil(parseInt(res.length) / pageSize);

			$("#pageSelect").empty();

			for (var i = 0; i < totalpage; i++) {
				var row = '<option value="' + i + '">' + (i + 1) + '</option>';
				$("#pageSelect").append(row);
			}

		}, error: function(response) {
			$("#warningInformationModalBody").text(response.responseText);
			$("#warningBackdropButton").click();
		}
	});
}



function loadLikeApprovalPendingMispData(page) {


	var mispNumber = $('input[title="searchmispNo"]').val() ?? "";
	var revNumber = $('input[title="searchrevNo"]').val() ?? "";
	var partNumber = $('input[title="searchPartNumber"]').val() ?? "";

	var formData = {
		mispNumber: mispNumber,
		revNumber: revNumber,
		partNumber: partNumber,
	}
	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getLikeApprovalPendingMispData/' + page,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {

			makePagerByTotalPages(res, page);
			insertApprovalMispMasterInTable(res.content, page + 1);
		},
		error: function(response) {
			$("#warningInformationModalBody").text(response.responseText);
			$("#warningBackdropButton").click();
		}
	});
}
*/
//  for   "FINAL INSPECTION RQC-P APPROVAL"   not used here 
/*function loadLikeFinalApprovalPendingMispData(page) {


	var mispNumber = $('input[title="searchmispNo"]').val() ?? "";
	var revNumber = $('input[title="searchrevNo"]').val() ?? "";
	var partNumber = $('input[title="searchPartNumber"]').val() ?? "";

	var formData = {
		mispNumber: mispNumber,
		revNumber: revNumber,
		partNumber: partNumber,
	}
	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getLikeFinalApprovalPendingMispData/' + page,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {

			makePagerByTotalPages(res, page);
			insertFinalMispApprovalMispMasterInTable(res.content, page + 1);
		},
		error: function(response) {
			$("#warningInformationModalBody").text(response.responseText);
			$("#warningBackdropButton").click();
		}
	});
}
*/


function insertApprovalMispMasterInTable(response, tableId) {

console.log(response);

	/*
		$("#tableBody").remove();
		var tablebody = document.createElement("tbody");
		tablebody.setAttribute("id", "tableBody");*/
		
		$("#" + tableId + "Body").empty();
	/*
		$("#table1").append(tablebody);

		var sequenceNumber = pageSize * parseInt($('#pageSelect :selected').val());*/
		var sequenceNumber = getSequenceNumber();
		
	for (var i = 0; i < response.length; i++) {
		var str = response[i];
		var list = str.split(',');

/*		if (list[8] == "0") {
			var row = '<tr class="tableDataRows" title="Double click to select the row.">' +
				'<td data-column="columnId" style="width:50px">' + (sequenceNumber + 1) + '</td>' +
				'<td data-column="mispNumber" style="width:100px">' + (list[0] == "null" ? '' : list[0]) + '</td>' +
				'<td data-column="revNumber" style="width:70px">' + (list[1] == "null" ? '' : list[1]) + '</td>' +
				'<td data-column="partNumber">' + (list[2] == "null" ? '' : list[2]) + '</td>' +
				'<td data-column="partDescription" style="width:400px; text-align:left; padding-left:10px;">' + (list[9] == "null" ? '' : list[9]) + '</td>' +
				'<td data-column="noOfParameter">' + (list[3] == "null" ? '' : list[3]) + '</td>' +
				'<td data-column="createdBy">' + (list[4] == "null" ? '' : list[4]) + '</td>' +
				'<td data-column="dateTime">' + (list[5] == "null" ? '' : list[5]) + '</td>' +
				'<td data-column="Approved By">' + (list[6] == "null" ? '' : list[6]) + '</td>' +
				'<td data-column="implementDate" >' + (list[7] == "null" ? '' : list[7]) + '</td>' +
				'<td style="background-color:Yellow;">Editable</td>' +
				'<td data-column="status" style="display:none;">' + (list[8] == "null" ? '' : list[8]) + '</td>' +
				'</tr>';
		} else if (list[8] == "1") {
			var row = '<tr class="tableDataRows" title="Double click to select the row.">' +
				'<td data-column="columnId" style="width:50px">' + (sequenceNumber + 1) + '</td>' +
				'<td data-column="mispNumber" style="width:100px">' + (list[0] == "null" ? '' : list[0]) + '</td>' +
				'<td data-column="revNumber" style="width:70px">' + (list[1] == "null" ? '' : list[1]) + '</td>' +
				'<td data-column="partNumber">' + (list[2] == "null" ? '' : list[2]) + '</td>' +
				'<td data-column="partDescription" style="width:400px; text-align:left; padding-left:10px;">' + (list[9] == "null" ? '' : list[9]) + '</td>' +
				'<td data-column="noOfParameter">' + (list[3] == "null" ? '' : list[3]) + '</td>' +
				'<td data-column="createdBy">' + (list[4] == "null" ? '' : list[4]) + '</td>' +
				'<td data-column="dateTime">' + (list[5] == "null" ? '' : list[5]) + '</td>' +
				'<td data-column="Approved By">' + (list[6] == "null" ? '' : list[6]) + '</td>' +
				'<td data-column="implementDate" >' + (list[7] == "null" ? '' : list[7]) + '</td>' +
				'<td style="background-color:limeGreen; color:white">Approved</td>' +
				'<td data-column="status" style="display:none;">' + (list[8] == "null" ? '' : list[8]) + '</td>' +
				'</tr>';
		} else if (list[8] == "2") {
			var row = '<tr class="tableDataRows" title="Double click to select the row.">' +
				'<td data-column="columnId" style="width:50px">' + (sequenceNumber + 1) + '</td>' +
				'<td data-column="mispNumber" style="width:100px">' + list[0] + '</td>' +
				'<td data-column="revNumber" style="width:70px">' + list[1] + '</td>' +
				'<td data-column="partNumber">' + list[2] + '</td>' +
				'<td data-column="partDescription" style="width:400px; text-align:left; padding-left:10px;">' + list[9] + '</td>' +
				'<td data-column="noOfParameter">' + list[3] + '</td>' +
				'<td data-column="createdBy">' + list[4] + '</td>' +
				'<td data-column="dateTime">' + list[5] + '</td>' +
				'<td data-column="Approved By">' + list[6] + '</td>' +
				'<td data-column="implementDate" >' + list[7] + '</td>' +
				'<td style="background-color:red; color:white">Re-Consider</td>' +
				'<td data-column="status" style="display:none;">' + (list[8] == "null" ? '' : list[8]) + '</td>' +
				'</tr>';
		} else */if (list[8] == "3") {
			var row = '<tr class="tableDataRows" title="Double click to select the row.">' +
				'<td data-column="columnId" style="width:50px">' + (sequenceNumber + 1) + '</td>' +
				'<td data-column="mispNumber" style="width:100px">' + (list[0] == "null" ? '' : list[0]) + '</td>' +
				'<td data-column="revNumber" style="width:70px">' + (list[1] == "null" ? '' : list[1]) + '</td>' +
				'<td data-column="partNumber">' + (list[2] == "null" ? '' : list[2]) + '</td>' +
				'<td data-column="partDescription" style="width:400px; text-align:left; padding-left:10px;">' + (list[9] == "null" ? '' : list[9]) + '</td>' +
				'<td data-column="noOfParameter">' + (list[3] == "null" ? '' : list[3]) + '</td>' +
				'<td data-column="createdBy">' + (list[4] == "null" ? '' : list[4]) + '</td>' +
				'<td data-column="dateTime">' + (list[5] == "null" ? '' : list[5]) + '</td>' +
				'<td data-column="Approved By">' + (list[6] == "null" ? '' : list[6]) + '</td>' +
				'<td data-column="implementDate" >' + (list[7] == "null" ? '' : list[7]) + '</td>' +
				'<td data-column="customer" >' + (list[10] == "null" ? '' : list[10]) + '</td>' +
				'<td data-column="model" >' + (list[11] == "null" ? '' : list[11]) + '</td>' +
				'<td style="background-color:blue; color:white">Approval Pending</td>' +
				'<td data-column="status" style="display:none;">' + (list[8] == "null" ? '' : list[8]) + '</td>' +
				'</tr>';
		}/* else if (list[8] == "4") {
			var row = '<tr class="tableDataRows" title="Double click to select the row.">' +
				'<td data-column="columnId" style="width:50px">' + (sequenceNumber + 1) + '</td>' +
				'<td data-column="mispNumber" style="width:100px">' + (list[0] == "null" ? '' : list[0]) + '</td>' +
				'<td data-column="revNumber" style="width:70px">' + (list[1] == "null" ? '' : list[1]) + '</td>' +
				'<td data-column="partNumber">' + (list[2] == "null" ? '' : list[2]) + '</td>' +
				'<td data-column="partDescription" style="width:400px; text-align:left; padding-left:10px;">' + (list[9] == "null" ? '' : list[9]) + '</td>' +
				'<td data-column="noOfParameter">' + (list[3] == "null" ? '' : list[3]) + '</td>' +
				'<td data-column="createdBy">' + (list[4] == "null" ? '' : list[4]) + '</td>' +
				'<td data-column="dateTime">' + (list[5] == "null" ? '' : list[5]) + '</td>' +
				'<td data-column="Approved By">' + (list[6] == "null" ? '' : list[6]) + '</td>' +
				'<td data-column="implementDate" >' + (list[7] == "null" ? '' : list[7]) + '</td>' +
				'<td style="background-color:orange; color:white">Re-consider</td>' +
				'<td data-column="status" style="display:none;">' + (list[8] == "null" ? '' : list[8]) + '</td>' +
				'</tr>';
		}*/
		$('#table1').append(row);
		sequenceNumber++;

	}
}


// only for rqc creation master .summerize button click so already copied there
/*function getAllMispParameterInDetailModal(mispNumber, revNumber) {

	$.ajax({
		url: "/WebApplication/Controllers/getAllParameterByMISP/" + mispNumber + "/" + revNumber,
		type: 'GET',
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		dataType: 'json',
		async: false,
		success: function(response) {

			createMispDetailModal();
			$("#detailResponseContainer").text("");
			$("#mispNumberDisplay").text(response[0].mispNumber);
			$("#revNumberDisplay").text("Rev No : " + response[0].revNumber);
			$("#partNumberDisplay").text(response[0].partNumber);
			$("#partNumberDescription").text(response[0].partDescription);
			$("#mispImageContainer").css("background-image", "url('/WebApplication/uploadImages/" + response[0].partNumber + ".png')");
			var img = document.createElement("img");
			img.setAttribute("src", "/WebApplication/uploadImages/" + response[0].partNumber + "_" + response[0].revNumber + ".png");
			img.setAttribute("style", "width:" + imageWidth + "%");
			$("#imageContainer").css("background-image", "url('/WebApplication/uploadImages/" + Inspectionlist[11] + ".png')");
			$("#mispImageContainer").children("img").remove();
			$("#mispImageContainer").append(img);
			insertMispParameterInDetailModal(response);

		}, error: function(response) {
			$("#warningInformationModalBody").text(response.responseText);
			$("#warningBackdropButton").click();
		}
	});

}
*/

// i guess similarly for this is for the detail modal of other master not used now.
/*function getAllFinalControlMispParameterInDetailModal(mispNumber, revNumber) {

	$.ajax({
		url: "/WebApplication/Controllers/getAllFinalControlParameterByMISP/" + mispNumber + "/" + revNumber,
		type: 'GET',
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		dataType: 'json',
		async: false,
		success: function(response) {

			createMispDetailModal();
			$("#detailResponseContainer").text("");
			$("#mispNumberDisplay").text(response[0].mispNumber);
			$("#revNumberDisplay").text("Rev No: " + response[0].revNumber);
			$("#partNumberDisplay").text(response[0].partNumber);
			$("#partNumberDescription").text(response[0].partDescription);
			var img = document.createElement("img");
			img.setAttribute("src", "/WebApplication/uploadImages/" + response[0].partNumber + "_" + response[0].revNumber + ".png");
			img.setAttribute("style", "width:" + imageWidth + "%");
			$("#mispImageContainer").children("img").remove();
			$("#mispImageContainer").append(img);
			insertMispParameterInDetailModal(response);

		}, error: function(response) {
			$("#warningInformationModalBody").text(response.responseText);
			$("#warningBackdropButton").click();
		}
	});

}
*/
// used in rqc approval for rqc called in getAllMispParameterInDetailModal 
// for 'click', '.summerize' button
/*
function createMispDetailModal() {

	var element11 = document.createElement("div");
	var element12 = document.createElement("div");

	$("#detailModalBody").append(element11, element12);
	element11.setAttribute("class", "dataContainer smallContainer");
	element12.setAttribute("class", "dataContainer smallContainer");
	element12.setAttribute("id", "mispImageContainer");


	var table = document.createElement("table");
	table.setAttribute("style", "width:100%;")
	table.setAttribute("id", "detailTable");

	var thead = document.createElement("thead");
	thead.setAttribute("id", "detailTableHead")

	var thead2 = document.createElement("thead");
	thead2.setAttribute("id", "detailTableHead2")

	var tbody = document.createElement("tbody");
	tbody.setAttribute("id", "detailTableBody")

	var tr = document.createElement("tr");
	var tr1 = document.createElement("tr");
	var tr2 = document.createElement("tr");
	var tr3 = document.createElement("tr");
	var tr4 = document.createElement("tr");



	var thh1 = document.createElement("th");
	thh1.innerText = "RQC-P:";
	thh1.setAttribute("class", "tableheading2");
	var thh2 = document.createElement("th");
	thh2.setAttribute("Id", "mispNumberDisplay");
	thh2.setAttribute("class", "tableheading2");
	var thh3 = document.createElement("th");
	thh3.innerText = "Rev No :";
	thh3.setAttribute("class", "tableheading2");
	thh3.setAttribute("Id", "revNumberDisplay");
	var thh5 = document.createElement("th");
	thh5.innerText = "P No :"
	thh5.setAttribute("class", "tableheading2");
	var thh6 = document.createElement("th");
	thh6.setAttribute("Id", "partNumberDisplay");
	thh6.setAttribute("class", "tableheading2");
	var thh7 = document.createElement("th");
	thh7.setAttribute("colspan", "3");
	thh7.setAttribute("Id", "partNumberDescription");
	thh7.setAttribute("class", "tableheading2");

	tr.append(thh1, thh2, thh3, thh5, thh6, thh7);
	tr1.append();



	var sNo = document.createElement("th");
	sNo.setAttribute("class", "tableheading");
	sNo.innerText = "Id";

	var th = document.createElement("th");
	th.setAttribute("class", "tableheading");
	th.innerText = "Item";

	var th1 = document.createElement("th");
	th1.setAttribute("class", "tableheading");
	th1.innerText = "Criteria";

	var th2 = document.createElement("th");
	th2.setAttribute("class", "tableheading");
	th2.innerText = "Method";

	var th3 = document.createElement("th");
	th3.setAttribute("class", "tableheading");
	th3.innerText = "Tool";

	var th4 = document.createElement("th");
	th4.setAttribute("class", "tableheading");
	th4.innerText = "Min";

	var th5 = document.createElement("th");
	th5.setAttribute("class", "tableheading");
	th5.innerText = "Max";

	var th6 = document.createElement("th");
	th6.setAttribute("class", "tableheading");
	th6.innerText = "Samples";

	element11.append(table);
	table.append(thead, thead2, tbody);

	thead.append(tr);
	thead2.append(tr3);
	tr3.append(sNo, th, th1, th2, th3, th4, th5, th6);

}

*/


// used in rqc creation master. for summarize button click.
/*
function insertMispParameterInDetailModal($item) {

	$("#detailTableBody").remove();
	var tablebody = document.createElement("tbody");
	tablebody.setAttribute("id", "detailTableBody");

	$("#detailTable").append(tablebody);

	$.each($item, function(index, value) {


		var row = '<tr class="smalTextRows">' +
			'<td data-column="columnId" style="width:80px;">' + (index + 1) + '</td>' +
			'<td data-column="inspectionItem" >' + value.inspectionItem + '</td>' +
			'<td data-column="criteria">' + value.criteria + '</td>' +
			'<td data-column="method">' + value.inspectionMethod + '</td>' +
			'<td data-column="instrumentName">' + (value.instrument == null ? "" : value.instrument.instrumentName) + '</td>' +
			'<td data-column="min">' + value.min + '</td>' +
			'<td data-column="max">' + value.max + '</td>' +
			'<td data-column="samplingPlan">' + value.samplingPlan + '</td>' +
			'<td data-column="qualityId" style="display:none;">' + value.qualityId + '</td>' +
			'</tr>';
		$('#detailTable').append(row);
	});
}
*/

$(document).on('click', '#approve', function() {

	var implementDate = $("input[name=implementDate]").val();
	var mispNumber = object.mispNumber;
	var revNumber = object.revNumber;
	var partNumber = object.partNumber;
	var approveStatus = "1";
	var approveBy = sessionStorage.getItem('name');

	if (!implementDate) {
		$("#detailResponseContainer").text("");
		$("#detailResponseContainer").text("Implement date is mandatory to approve the RQC-P No.");
		$("#detailResponseContainer").attr("style", "font-size:15px; color:red; width:60%; height:30px; text-align:center;");

	} else {

		var formData = {
			partNumber: partNumber,
			revNumber: revNumber,
			mispNumber: mispNumber,
			approveStatus: approveStatus,
			approveBy: approveBy,
			implementDate: implementDate
		}

		var text = document.getElementById("masterHeading").innerHTML;
		if (text == "RQC APPROVAL") {

			$.ajax({
				type: 'post',
				url: '/WebApplication/Controllers/approveMispNo',
				data: JSON.stringify(formData),
				contentType: 'application/json',
				async: false,
				headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
				success: function(response) {
					$("#detailResponseContainer").text("");
					$("#detailResponseContainer").text(response);
					$("#detailResponseContainer").attr("style", "font-size:15px;color:green; width:60%;  height:30px; text-align:center;");
					loadDataAndPager();
					resetValues();
					resetQualityDetails();
				},
				error: function(response) {
					loadDataAndPager();
					resetValues();
					resetQualityDetails();

					$("#detailBackdropButton").click();
					$("#warningInformationModalBody").text(response.responseText);
					$("#warningBackdropButton").click();
				}
			});

		} /*else if (text == "FINAL INSPECTION RQC-P APPROVAL") {
			$.ajax({
				type: 'post',
				url: '/WebApplication/Controllers/approveFinalControlMispNo',
				data: JSON.stringify(formData),
				contentType: 'application/json',
				async: false,
				headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
				success: function(response) {
					$("#detailResponseContainer").text("");
					$("#detailResponseContainer").text(response);
					$("#detailResponseContainer").attr("style", "font-size:15px;color:green; width:60%;  height:30px; text-align:center;");
					if (!$('#pageSelect :selected').val()) {
						loadFinalMispApprovalPendingMispDataPager();
						loadFinalMispApprovalPendingMispData(0);
					} else {
						loadFinalMispApprovalPendingMispDataPager();
						loadFinalMispApprovalPendingMispData($('#pageSelect :selected').val());
					}
					resetFinalControlDetails();
				},
				error: function(response) {
					if (!$('#pageSelect :selected').val()) {
						loadFinalMispApprovalPendingMispDataPager();
						loadFinalMispApprovalPendingMispData(0);
					} else {
						loadFinalMispApprovalPendingMispDataPager();
						loadFinalMispApprovalPendingMispData($('#pageSelect :selected').val());
					}
					resetFinalControlDetails();

					$("#detailBackdropButton").click();
					$("#warningInformationModalBody").text(response.responseText);
					$("#warningBackdropButton").click();
				}
			});
		}*/
	}
});

$(document).on('click', '#reconsider', function() {

	var implementDate = object.implementDate;
	var revNumber = object.revNumber;
	var mispNumber = object.mispNumber;
	var partNumber = object.partNumber;
	var approveStatus = "2";
	var approveBy = sessionStorage.getItem('name');

	/*	if (implementDate == "null") {
			var approveStatus = "2";
		} else {
			
		}*/

	var formData = {
		partNumber: partNumber,
		revNumber: revNumber,
		mispNumber: mispNumber,
		approveStatus: approveStatus,
		approveBy: approveBy,
		implementDate: implementDate
	}

	var text = document.getElementById("masterHeading").innerHTML;
	if (text == "RQC APPROVAL") {

		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/approveMispNo',
			data: JSON.stringify(formData),
			contentType: 'application/json',
			async: false,
			headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
			success: function(response) {
				$("#detailResponseContainer").text("");
				$("#detailResponseContainer").text(response);
				$("#detailResponseContainer").attr("style", "font-size:15px;color:green; width:60%;  height:30px; text-align:center;");
							
				loadDataAndPager();
				resetValues();

				resetQualityDetails();
			},
			error: function(response) {

				loadDataAndPager();
				resetValues();
				resetQualityDetails();

				$("#detailBackdropButton").click();
				$("#warningInformationModalBody").text(response.responseText);
				$("#warningBackdropButton").click();
			}
		});

	} /*else if (text == "FINAL INSPECTION RQC-P APPROVAL") {
		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/approveFinalControlMispNo',
			data: JSON.stringify(formData),
			contentType: 'application/json',
			async: false,
			headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
			success: function(response) {
				$("#detailResponseContainer").text("");
				$("#detailResponseContainer").text(response);
				$("#detailResponseContainer").attr("style", "font-size:15px;color:green; width:60%;  height:30px; text-align:center;");
				if (!$('#pageSelect :selected').val()) {
					loadFinalMispApprovalPendingMispDataPager();
					loadFinalMispApprovalPendingMispData(0);
				} else {
					loadFinalMispApprovalPendingMispDataPager();
					loadFinalMispApprovalPendingMispData($('#pageSelect :selected').val());
				}
				resetFinalControlDetails();
			},
			error: function(response) {
				if (!$('#pageSelect :selected').val()) {
					loadFinalMispApprovalPendingMispDataPager();
					loadFinalMispApprovalPendingMispData(0);
				} else {
					loadFinalMispApprovalPendingMispDataPager();
					loadFinalMispApprovalPendingMispData($('#pageSelect :selected').val());
				}
				resetFinalControlDetails();

				$("#detailBackdropButton").click();
				$("#warningInformationModalBody").text(response.responseText);
				$("#warningBackdropButton").click();
			}
		});
	}*/


});

