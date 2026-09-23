
$(document).on('click', '#ionizerLinkMaster', function() {

	$(".fromToDiv").css("display", "none");
	
	$("#offcanvasCloseButton").click();
	$("#masterHeading").text("IONIZER LINK MASTER");

	$("#tableContainer").empty();
	$("#pagerContainer").empty();
	makePagerBody("pagerContainer");

	var headerList = ["S. No.", "Line", "Station", "Ionizer Field",  "Order No.", "Created by","Creation Date", "Date Modified"];
	var searchList = ["searchLine", "searchStation", "searchIonizerField", "", "", "",""];
	var placeholderList = ["Line", "Station", "Ionizer Field"];
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
	

window.loadLikeIonizerLinkData = loadLikeIonizerLinkData;
function loadLikeIonizerLinkData(page, pageSize) {

	const lineId = $('#searchLine').val();
	const stationId = $('#searchStation').val();
	const IonizerFieldId = $('#searchIonizerField').val();

	const formData = {
	    line: lineId ? { id: parseInt(lineId) } : null,
	    station: stationId ? { id: parseInt(stationId) } : null,
	    ionizerField: IonizerFieldId ? { rowId: parseInt(IonizerFieldId) } : null
	};

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getLikeIonizerLinkData/' + page + '/' + pageSize,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {
	 console.log(res);
			makePagerByTotalPages(res, page);
			insertIonizerLinkInTable(res.content, "table1");
		},
		error: function(response) {


		}
	});
}


window.ionizerLinkInputs = ionizerLinkInputs;
function ionizerLinkInputs(modalBodyId) {

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
	
	
	var ionizerfieldDropdownAttr = ["id", "ionizerfieldDropdown", "class", "inputs m1 selectInput"];
	createSelectList(ionizerfieldDropdownAttr, container49, "Ionizer Field");
	insertOptionById("ionizerfieldDropdown", "Select");
	
	var orderAttr = ["id", "orderinput", "type", "number", "name", "order", "class", "inputs m1 textInput", "placeholder", "Order...", "maxlength", "20"];
	createInput(orderAttr, container48, "Order No:");

	
	// Call it when page loads or required
	getAllLinesInList("lineDropdown");

	$("#lineDropdown").on("change", function () {
		const lineId = $(this).val();
		getStationsByLineId("stationDropdown", lineId);
	});

	getAllIonizerFieldsInList("ionizerfieldDropdown");
	
}


/*-------------------------------- For visibility on frontend ---------------------*/
window.insertIonizerLinkInTable = insertIonizerLinkInTable;
function insertIonizerLinkInTable($item, tableId) {
	$("#" + tableId + "Body").empty();

	var sequenceNumber = getSequenceNumber();

	$.each($item, function(index, value) {

		var row = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId" class="width50">' + (sequenceNumber + 1) + '</td>'
			
		
			+ '<td data-column="line" class="width50" data-line-id="' + (value.line?.lineId ?? '') + '">' +
		  		(value.line != null ? value.line.lineName : '') + '</td>' 

			+ '<td data-column="station" class="width150" data-station-id="' + (value.station?.id ?? '') + '">' +
		  		(value.station != null ? value.station.name : '') + '</td>' 

			+ '<td data-column="ionizerfield" class="width200" data-field-id="' + (value.ionizerField?.rowId ?? '') + '">' +
				  (value.ionizerField?.ptype === 1
				    ? '<span style="color:#002366;">Image</span><span class="hiddenUrl" style="display:none;">' + value.ionizerField.parameter + '</span>'
				    : (value.ionizerField?.parameter ?? '')) +
				  (value.ionizerField?.reference ? '<br/><small style="color:#126180;">Ref: ' + value.ionizerField.reference + '</small>' : '') +
				'</td>'

			+ '<td data-column="orderNo" class="width50">' + (value.orderNo == null ? '' : value.orderNo) + '</td>'
			+ '<td data-column="createdBy" class="width50">' + (value.createdBy == null ? '' : value.createdBy) + '</td>'
			+ '<td data-column="dateTimeCreation" class="width100">' + (value.dateTimeCreation == null ? '' : value.dateTimeCreation) + '</td>'
			+ '<td data-column="dateTimeModified" class="width100">' + (value.dateTimeModified == null ? '' : value.dateTimeModified) + '</td>'
			+ '<td data-column="IonizerLinkId" style="display:none;">' + (value.rowId == null ? '' : value.rowId) + '</td></tr>';
		$("#" + tableId).append(row);
		sequenceNumber++;
	});
}



window.addIonizerLink = addIonizerLink;
function addIonizerLink() {
	const lineId = $('#lineDropdown').val();
	const stationId = $('#stationDropdown').val();
	const ionizerFieldId = $('#ionizerfieldDropdown').val();
	const order = $('#orderinput').val();
	const createdBy = sessionStorage.getItem('employeeId');

	// Validation
	if (!lineId || lineId === "Select" ||
		!stationId || stationId === "Select" ||
		!ionizerFieldId || ionizerFieldId === "Select" ||
		!order) {
		showErrorResponse("responseContainer", "Please fill all required fields.");
		return;
	}

	const formData = new FormData();
	formData.append("lineId", lineId);
	formData.append("stationId", stationId);
	formData.append("ionizerFieldId", ionizerFieldId);
	formData.append("orderNo", order);
	formData.append("createdBy", createdBy);
	
	$.ajax({
		type: 'POST',
		url: '/WebApplication/Controllers/insertIonizerLink',
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




window.editIonizerLink = editIonizerLink;
function editIonizerLink() {
	const lineId = $('#lineDropdown').val();
	const stationId = $('#stationDropdown').val();
	const ionizerFieldId = $('#ionizerfieldDropdown').val();
	const order = $('#orderinput').val();
	const createdBy = sessionStorage.getItem('employeeId');

	// Validation
	if (!lineId || lineId === "Select" ||
		!stationId || stationId === "Select" ||
		!ionizerFieldId || ionizerFieldId === "Select" ||
		!order) {
		showErrorResponse("responseContainer", "Please fill all required fields.");
		return;
	}

	const formData = new FormData();
	formData.append("rowId", IonizerLinkId); // 🔴 Must match your backend param
	formData.append("lineId", lineId);
	formData.append("stationId", stationId);
	formData.append("ionizerFieldId",ionizerFieldId);
	formData.append("orderNo", order);
	formData.append("createdBy", createdBy);
	formData.append("dateTimeCreation", dateTimeCreation); //Preserve original creation timestamp which i set in .edit of master common js

	// Optional: debug log
	for (const [key, value] of formData.entries()) {
		console.log(`${key}:`, value);
	}

		$.ajax({
			type: 'POST',
			url: '/WebApplication/Controllers/editIonizerLink',
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

window.deleteIonizerLink = deleteIonizerLink;
function deleteIonizerLink() {

	if (deleteAllList.length >= 1) {

		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/delete/deleteAllIonizerLink',
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