
$(document).on('click', '#machineCheckSheetLink', function() {

	$(".fromToDiv").css("display", "none");
	
	$("#offcanvasCloseButton").click();
	$("#masterHeading").text("MACHINE CHECK SHEET LINK MASTER");

	$("#tableContainer").empty();
	$("#pagerContainer").empty();
	makePagerBody("pagerContainer");

	var headerList = ["S. No.", "Line", "Station", "Check Sheet Field",  "Order No.", "Created by","Creation Date", "Date Modified"];
	var searchList = ["searchLine", "searchStation", "searchCheckSheetField", "", "", "",""];
	var placeholderList = ["Line", "Station", "Check Sheet Field"];
	makeTable(headerList, placeholderList, searchList, "tableContainer", "table1", "100%");

	handlePageChange(0);

	// Example Usage
	configureButtons({
		add: "show",
		edit: "show",
		delete: "show",
		template: "hide",
		data: "hide",
		upload: "hide",
		pdfUpload: "hide",
		userDetails: "show"
	});
	

	getIdByMasterName($(this).attr('id'));

});
	

window.loadLikeMachineCheckSheetLinkData = loadLikeMachineCheckSheetLinkData;
function loadLikeMachineCheckSheetLinkData(page, pageSize) {

	const lineId = $('#searchLine').val();
	const stationId = $('#searchStation').val();
	const mcsFieldId = $('#searchCheckSheetField').val();

	const formData = {
	    line: lineId ? { id: parseInt(lineId) } : null,
	    station: stationId ? { id: parseInt(stationId) } : null,
	    mcsField: mcsFieldId ? { rowId: parseInt(mcsFieldId) } : null
	};

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getLikeMachineCheckSheetLinkData/' + page + '/' + pageSize,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {
	 console.log(res);
			makePagerByTotalPages(res, page);
			insertMachineCheckSheetLinkInTable(res.content, "table1");
		},
		error: function(response) {


		}
	});
}


window.machineCheckSheetLinkInputs = machineCheckSheetLinkInputs;
function machineCheckSheetLinkInputs(modalBodyId) {

	$("#" + modalBodyId).empty();

	var container46 = document.createElement("div");
	var container47 = document.createElement("div");
	var container48 = document.createElement("div");
	var container49 = document.createElement("div");
	var container50 = document.createElement("div");
	var container51 = document.createElement("div");
	var container52 = document.createElement("div");
	var container53 = document.createElement("div");

	container46.setAttribute("class", "dataContainer smallContainer mt-1");
	container47.setAttribute("class", "dataContainer smallContainer mt-1");
	container48.setAttribute("class", "dataContainer smallContainer mt-1");
	container49.setAttribute("class", "dataContainer smallContainer mt-1");
	container50.setAttribute("class", "dataContainer smallContainer mt-1");
	container51.setAttribute("class", "dataContainer smallContainer mt-1");
	container52.setAttribute("class", "dataContainer smallContainer mt-1");
	container53.setAttribute("class", "dataContainer smallContainer mt-1");

	$("#" + modalBodyId).append(container46, container47, container48, container49, container50, container51, container52, container53);
		
	var lineDropdownAttr = ["id", "lineDropdown", "class", "inputs m1 selectInput"];
	createSelectList(lineDropdownAttr, container46, "Line");
	insertOptionById("lineDropdown", "Select");
	
	
	var stationDropdownAttr = ["id", "stationDropdown", "class", "inputs m1 selectInput"];
	createSelectList(stationDropdownAttr, container47, "Station");
	insertOptionById("stationDropdown", "Select");
	
	
	var mcsfieldDropdownAttr = ["id", "mcsfieldDropdown", "class", "inputs m1 selectInput"];
	createSelectList(mcsfieldDropdownAttr, container49, "MCS Field");
	insertOptionById("mcsfieldDropdown", "Select");
	
	var orderAttr = ["id", "orderinput", "type", "number", "name", "order", "class", "inputs m1 textInput", "placeholder", "Order...", "maxlength", "20"];
	createInput(orderAttr, container48, "Order No:");

	
	// Call it when page loads or required
	getAllLinesInList("lineDropdown");

	$("#lineDropdown").on("change", function () {
		const lineId = $(this).val();
		getStationsByLineId("stationDropdown", lineId);
	});

	getAllCheckSheetFieldsInList("mcsfieldDropdown");
	
}


/*-------------------------------- For visibility on frontend ---------------------*/
window.insertMachineCheckSheetLinkInTable = insertMachineCheckSheetLinkInTable;
function insertMachineCheckSheetLinkInTable($item, tableId) {
	$("#" + tableId + "Body").empty();

	var sequenceNumber = getSequenceNumber();

	$.each($item, function(index, value) {

		var row = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId" class="width50">' + (sequenceNumber + 1) + '</td>'
			
		
			+ '<td data-column="line" class="width50" data-line-id="' + (value.line?.lineId ?? '') + '">' +
		  		(value.line != null ? value.line.lineName : '') + '</td>' 

			+ '<td data-column="station" class="width150" data-station-id="' + (value.station?.id ?? '') + '">' +
		  		(value.station != null ? value.station.name : '') + '</td>' 

			+ '<td data-column="mcsfield" class="width200" data-field-id="' + (value.mcsField?.rowId ?? '') + '">' +
				  (value.mcsField?.ptype === 1
				    ? '<span style="color:#002366;">Image</span><span class="hiddenUrl" style="display:none;">' + value.mcsField.parameter + '</span>'
				    : (value.mcsField?.parameter ?? '')) +
				  (value.mcsField?.reference ? '<br/><small style="color:#126180;">Ref: ' + value.mcsField.reference + '</small>' : '') +
				'</td>'

			+ '<td data-column="orderNo" class="width50">' + (value.orderNo == null ? '' : value.orderNo) + '</td>'
			+ '<td data-column="createdBy" class="width50">' + (value.createdBy == null ? '' : value.createdBy) + '</td>'
			+ '<td data-column="dateTimeCreation" class="width100">' + (value.dateTimeCreation == null ? '' : value.dateTimeCreation) + '</td>'
			+ '<td data-column="dateTimeModified" class="width100">' + (value.dateTimeModified == null ? '' : value.dateTimeModified) + '</td>'
			+ '<td data-column="MCSLinkId" style="display:none;">' + (value.rowId == null ? '' : value.rowId) + '</td></tr>';
		$("#" + tableId).append(row);
		sequenceNumber++;
	});
}



window.addMachineCheckSheetLink = addMachineCheckSheetLink;
function addMachineCheckSheetLink() {
	const lineId = $('#lineDropdown').val();
	const stationId = $('#stationDropdown').val();
	const mcsFieldId = $('#mcsfieldDropdown').val();
	const order = $('#orderinput').val();
	const createdBy = sessionStorage.getItem('employeeId');

	// Validation
	if (!lineId || lineId === "Select" ||
		!stationId || stationId === "Select" ||
		!mcsFieldId || mcsFieldId === "Select" ||
		!order) {
		showErrorResponse("responseContainer", "Please fill all required fields.");
		return;
	}

	const formData = new FormData();
	formData.append("lineId", lineId);
	formData.append("stationId", stationId);
	formData.append("mcsFieldId", mcsFieldId);
	formData.append("orderNo", order);
	formData.append("createdBy", createdBy);
	
	$.ajax({
		type: 'POST',
		url: '/WebApplication/Controllers/insertMachineCheckSheetLink',
		data: formData, //  may also contain the input image file
		processData: false,
		contentType: false,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {

			showSuccessResponse("responseContainer", response);
			loadDataAndPager();
			resetValues();
		},
		error: function(response) {
			hideModal("addEditDeleteModalBody");
			setTextById("warningInformationModalBody", response.responseText);
			showModal("warningBackdropButton");
			loadDataAndPager();
			resetValues();
		}
	});
	

	// Delay execution of the code related to #addEditDeleteCloseButton by 1 second (1000 milliseconds) so as to cut the model automatically
	setTimeout(function() {
		$('#addEditDeleteCloseButton').trigger('click');
	}, 1000);
}




window.editMachineCheckSheetLink = editMachineCheckSheetLink;
function editMachineCheckSheetLink() {
	const lineId = $('#lineDropdown').val();
	const stationId = $('#stationDropdown').val();
	const mcsFieldId = $('#mcsfieldDropdown').val();
	const order = $('#orderinput').val();
	const createdBy = sessionStorage.getItem('employeeId');

	// Validation
	if (!lineId || lineId === "Select" ||
		!stationId || stationId === "Select" ||
		!mcsFieldId || mcsFieldId === "Select" ||
		!order) {
		showErrorResponse("responseContainer", "Please fill all required fields.");
		return;
	}

	const formData = new FormData();
	formData.append("rowId", MCSLinkId); // 🔴 Must match your backend param
	formData.append("lineId", lineId);
	formData.append("stationId", stationId);
	formData.append("mcsFieldId", mcsFieldId);
	formData.append("orderNo", order);
	formData.append("createdBy", createdBy);
	formData.append("dateTimeCreation", dateTimeCreation); //Preserve original creation timestamp which i set in .edit of master common js

	// Optional: debug log
	for (const [key, value] of formData.entries()) {
		console.log(`${key}:`, value);
	}

		$.ajax({
			type: 'POST',
			url: '/WebApplication/Controllers/editMachineCheckSheetLink',
			data: formData, //  may also contain the input image file
			processData: false,
			contentType: false,
			headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
			success: function(response) {

				showSuccessResponse("responseContainer", response);
				loadDataAndPager();
				resetValues();

			},
			error: function(response) {
				hideModal("addEditDeleteModalBody");
				setTextById("warningInformationModalBody", response.responseText);
				showModal("warningBackdropButton");

				loadDataAndPager();
				resetValues();
			}
		});

		// Delay execution of the code related to #addEditDeleteCloseButton by 1 second (1000 milliseconds) so as to cut the model automatically
		setTimeout(function() {
			$('#addEditDeleteCloseButton').trigger('click');
		}, 1000);
	
}

window.deleteMachineCheckSheetLink = deleteMachineCheckSheetLink;
function deleteMachineCheckSheetLink() {

	if (deleteAllList.length >= 1) {

		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/delete/deleteAllMachineCheckSheetLink',
			data: JSON.stringify(deleteAllList),
			contentType: "application/json",
			headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
			success: function(response) {
				loadDataAndPager();
				$("#informationBackdropButton").click();
				resetValues();
			},
			error: function(response) {
				loadDataAndPager();
				$("#informationBackdropButton").click();
				$("#warningInformationModalBody").text(response.responseText);
				$("#warningBackdropButton").click();
				resetValues();
			}
		});
	} else if (!object.rowId && deleteAllList.length == 0) {

		$("#warningInformationModalBody").text("Please select row from table to delete line.");
		$("#warningBackdropButton").click();
	}

}