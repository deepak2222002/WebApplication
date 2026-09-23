
$(document).on('click', '#lineMaster', function() {

	$("#offcanvasCloseButton").click();
	$("#masterHeading").text("LINE MASTER");

	$("#tableContainer").empty();
	$("#pagerContainer").empty();
	makePagerBody("pagerContainer");

	var headerList = ["S. No.", "Line Name", "Plant Code", "Line Type", "Created By", "Date & Time"];
	var searchList = ["searchLineName", "searchPlantCode", "searchLineType", "searchCreatedBy", ""];
	var placeholderList = ["Line Name", "Plant Code", "Line Type", "Created By"];
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

window.loadLikeLineData = loadLikeLineData;
function loadLikeLineData(page, pageSize) {

	var linefName = $('#searchLineName').val() ?? "";
	var plantCode = $('#searchPlantCode').val() ?? "";
	var linefType = $('#searchLineType').val() ?? "";
	var createdfBy = $('#searchCreatedBy').val() ?? "";

	var formData = {
		lineName: linefName,
		plant: {
			plantId: null,
			plantCode: plantCode
		},
		lineType: linefType,
		createdBy: createdfBy
	}

	console.log(formData);
	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getLikeLineMasterData/' + page + '/' + pageSize,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {
			console.log(res);
			makePagerByTotalPages(res, page);
			insertLineMasterInTable(res.content, "table1");

		},
		error: function(response) {

		}
	});
}

window.lineMasterInputs = lineMasterInputs;
function lineMasterInputs(modalBodyId) {

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

	var linenameAttr = ["id", "linenameinput", "type", "text", "name", "name", "class", "inputs m1 textInput", "placeholder", "Line Name...", "maxlength", "50"];

	createInput(linenameAttr, container46, "Line Name");

	var plantcodeAttr = ["id", "plantcodeinput", "class", "inputs m1 selectInput"];

	createSelectList(plantcodeAttr, container47, "Plant Code");
	insertOptionById("plantcodeinput", "Select");


	var linetypeAttr = ["id", "linetypeinput", "type", "text", "name", "linetype", "class", "inputs m1 textInput", "placeholder", "Line Type...", "maxlength", "50"];

	createInput(linetypeAttr, container48, "Line Type");

	getAllPlantsInList("plantcodeinput");
}


/*-------------------------------- For visibility on frontend ---------------------*/
window.insertLineMasterInTable = insertLineMasterInTable;
function insertLineMasterInTable($item, tableId) {
	$("#" + tableId + "Body").empty();

	var sequenceNumber = getSequenceNumber();

	$.each($item, function(index, value) {

		var row = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId" class="width50">' + (sequenceNumber + 1) + '</td>'
			+ '<td data-column="linedName" class="width100">' + (value.lineName == null ? '' : value.lineName) + '</td>'
			+ '<td data-column="plantdCode" class="width100 textLeftAlign">' + (value.plant == null ? '' : value.plant.plantCode) + '</td>'
			+ '<td data-column="linedType" class="width100">' + (value.lineType == null ? '' : value.lineType) + '</td>'
			+ '<td data-column="createdBy" class="width100">' + (value.createdBy == null ? '' : value.createdBy) + '</td>'
			+ '<td data-column="dateTime" class="width100">' + (value.dateTimeModified == null ? '' : value.dateTimeModified) + '</td>'
			+ '<td data-column="dateTimeCreationd" style="display:none;">' + (value.dateTimeCreation == null ? '' : value.dateTimeCreation) + '</td>'
			+ '<td data-column="lineId" style="display:none;">' + (value.lineId == null ? '' : value.lineId) + '</td></tr>';
		$("#" + tableId).append(row);
		sequenceNumber++;
	});
}


window.addLine = addLine;
function addLine() {

	var lineName = $('#linenameinput').val() ?? "";
	var plantCode = $('#plantcodeinput').val() ?? "";
	var lineType = $('#linetypeinput').val() ?? "";
	var createdBy = sessionStorage.getItem('employeeId');
	var status = "1";

	if (!showMandatory(['#linenameinput', '#plantcodeinput', '#linetypeinput'])) {

		showErrorResponse("responseContainer", "Add these mandatory fields");
		return;// Stop execution
	}
	else {

		var formData = {
			lineName: lineName,
			plant: {
				plantId: parseInt(plantCode)
			},
			lineType: lineType,
			status: status,
			createdBy: createdBy
		}

		console.log(formData);

		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/insertLineMaster',
			data: JSON.stringify(formData),
			contentType: "application/json",
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
}

window.editLine = editLine;
function editLine() {

	var lineName = $('#linenameinput').val() ?? "";
	var plantCode = $('#plantcodeinput').val() ?? "";
	var lineType = $('#linetypeinput').val() ?? "";
	var createdBy = sessionStorage.getItem('employeeId');
	var status = "1";

	if (!showMandatory(['#linenameinput', '#plantcodeinput', '#linetypeinput'])) {

		showErrorResponse("responseContainer", "Add these mandatory fields");

		return;;// Stop execution
	}
	else {
		var formData = {
			lineId: rowId,
			lineName: lineName,
			plant: {
				plantId: parseInt(plantCode)
			},
			lineType: lineType,
			status: status,
			createdBy: createdBy,
			dateTimeCreation: dateTimeCreation
		}

		console.log(formData);
		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/editLineMaster',
			data: JSON.stringify(formData),
			contentType: "application/json",
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
}

window.deleteLine = deleteLine;
function deleteLine() {

	if (deleteAllList.length >= 1) {

		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/delete/deleteAllLineMaster',
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