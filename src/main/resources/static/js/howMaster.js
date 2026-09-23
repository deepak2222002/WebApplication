
$(document).on('click', '#howMaster', function() {

	
	$(".fromToDiv").css("display", "none");
	
	$("#offcanvasCloseButton").click();
	$("#masterHeading").text("HOW MASTER")

	$("#tableContainer").empty();
	$("#pagerContainer").empty();
	makePagerBody("pagerContainer");


	var headerList = ["S. No.", "How"];
	var searchList = ["searchHow"];
	var placeholderList = ["How"];
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

window.loadLikeHowDetailData = loadLikeHowDetailData;
function loadLikeHowDetailData(page, pageSize) {

	var howInput = $('#searchHow').val() ?? "";

	var formData = {
		how: howInput,
	}
//	console.log(formData);

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getLikeHowDetailMasterData/' + page + '/' + pageSize,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {
	// console.log(res);
			makePagerByTotalPages(res, page);
			insertHowDetailInTable(res.content, "table1");
		},
		error: function(response) {


		}
	});
}

window.howDetailMasterInputs = howDetailMasterInputs;
function howDetailMasterInputs(modalBodyId) {

	$("#" + modalBodyId).empty();

	var container46 = document.createElement("div");
	var container47 = document.createElement("div");
	var container48 = document.createElement("div");
	var container49 = document.createElement("div");
	var container50 = document.createElement("div");
	var container51 = document.createElement("div");
	var container52 = document.createElement("div");
	var container53 = document.createElement("div");

	container46.setAttribute("class", "dataContainer mt-1");
	container47.setAttribute("class", "dataContainer mt-1");
	container48.setAttribute("class", "dataContainer mt-1");
	container49.setAttribute("class", "dataContainer smallContainer mt-1");
	container50.setAttribute("class", "dataContainer smallContainer mt-1");
	container51.setAttribute("class", "dataContainer smallContainer mt-1");
	container52.setAttribute("class", "dataContainer smallContainer mt-1");
	container53.setAttribute("class", "dataContainer smallContainer mt-1");



	$("#" + modalBodyId).append(container46, container47, container48, container49, container50);


	var whoAttr = ["id", "howInput", "type", "text", "name", "how", "class", "inputs m1 textInput", "placeholder", "How...", "maxlength", "100"];

	createInput(whoAttr, container46, "How: ");

}


/*-------------------------------- For visibility on frontend ---------------------*/
window.insertHowDetailInTable = insertHowDetailInTable;
function insertHowDetailInTable($item, tableId) {
	$("#" + tableId + "Body").empty();

	var sequenceNumber = getSequenceNumber();

	$.each($item, function(index, value) {
		var row = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId" class="width50">' + (sequenceNumber + 1) + '</td>'
			+ '<td data-column="howInput" class="width150 textLeftAlign">' + (value.how == null ? '' : value.how) + '</td>'
			+ '<td data-column="howId" style="display:none;">' + (value.id == null ? '' : value.id) + '</td></tr>';
		$("#" + tableId).append(row);
		sequenceNumber++;
	});
}


window.addHowDetail = addHowDetail;
function addHowDetail() {

	var howInput = $('#howInput').val() ?? "";
	var createdBy = sessionStorage.getItem('employeeId');

	
	if (!showMandatory(['#howInput'])) {

		showErrorResponse("responseContainer", "Add these mandatory fields");
		return;// Stop execution
	}
	else {

		var formData = {
			how: howInput,
			// createdBy: createdBy
		}
//		console.log(formData);

		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/insertHowDetailMaster',
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

window.editHowDetail = editHowDetail;
function editHowDetail() {

	var howInput = $('#howInput').val() ?? "";
	var createdBy = sessionStorage.getItem('employeeId');

	if (!showMandatory(['#howInput'])) {

		showErrorResponse("responseContainer", "Add these mandatory fields");
		return;// Stop execution
	}
	else {
	
		var formData = {
			id: howId,
			how: howInput,
			// createdBy: createdBy,
			// dateTimeCreation: dateTimeCreation
		}

//		console.log(formData);
		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/editHowDetailMaster',
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

window.deleteHowDetail = deleteHowDetail;
function deleteHowDetail() { 

	if (deleteAllList.length >= 1) {

		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/delete/deleteHowDetail',
			data: JSON.stringify(deleteAllList),
			contentType: "application/json",
			headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
			success: function(response) {
				loadDataAndPager();
				hideModal("informationBackdropButton");
				resetValues();
			},
			error: function(response) {

				hideModal("informationBackdropButton");
				setTextById("warningInformationModalBody", response.responseText);
				showModal("warningBackdropButton");
				loadDataAndPager();
				resetValues();
			}
		});
	} else if (!object.rowId && deleteAllList.length == 0) {

		$("#warningInformationModalBody").text("Please select row from table to delete plant.");
		$("#warningBackdropButton").click();
	}

}