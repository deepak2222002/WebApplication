
$(document).on('click', '#whenMaster', function() {

	
	$(".fromToDiv").css("display", "none");
	
	$("#offcanvasCloseButton").click();
	$("#masterHeading").text("WHEN MASTER")

	$("#tableContainer").empty();
	$("#pagerContainer").empty();
	makePagerBody("pagerContainer");


	var headerList = ["S. No.", "When"];
	var searchList = ["searchWhen"];
	var placeholderList = ["When"];
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

window.loadLikeWhenDetailData = loadLikeWhenDetailData;
function loadLikeWhenDetailData(page, pageSize) {

	var whenInput = $('#searchWhen').val() ?? "";

	var formData = {
		when: whenInput,
	}
//	console.log(formData);

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getLikeWhenDetailMasterData/' + page + '/' + pageSize,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {
	// console.log(res);
			makePagerByTotalPages(res, page);
			insertWhenDetailInTable(res.content, "table1");
		},
		error: function(response) {


		}
	});
}

window.whenDetailMasterInputs = whenDetailMasterInputs;
function whenDetailMasterInputs(modalBodyId) {

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


	var whenAttr = ["id", "wheninput", "type", "text", "name", "when", "class", "inputs m1 textInput", "placeholder", "When...", "maxlength", "100"];

	createInput(whenAttr, container46, "When: ");

}


/*-------------------------------- For visibility on frontend ---------------------*/
window.insertWhenDetailInTable = insertWhenDetailInTable;
function insertWhenDetailInTable($item, tableId) {
	$("#" + tableId + "Body").empty();

	var sequenceNumber = getSequenceNumber();

	$.each($item, function(index, value) {
		var row = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId" class="width50">' + (sequenceNumber + 1) + '</td>'
			+ '<td data-column="whenInput" class="width150 textLeftAlign">' + (value.whenColumn == null ? '' : value.whenColumn) + '</td>'
			+ '<td data-column="whenId" style="display:none;">' + (value.id == null ? '' : value.id) + '</td></tr>';
		$("#" + tableId).append(row);
		sequenceNumber++;
	});
}


window.addWhenDetail = addWhenDetail;
function addWhenDetail() {

	var whenInput = $('#wheninput').val() ?? "";
	var createdBy = sessionStorage.getItem('employeeId');

	
	if (!showMandatory(['#wheninput'])) {

		showErrorResponse("responseContainer", "Add these mandatory fields");
		return;// Stop execution
	}
	else {

		var formData = {
			whenColumn: whenInput,
			// createdBy: createdBy
		}
//		console.log(formData);

		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/insertWhenDetailMaster',
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

window.editWhenDetail = editWhenDetail;
function editWhenDetail() {

	var whenInput = $('#wheninput').val() ?? "";
	var createdBy = sessionStorage.getItem('employeeId');

	if (!showMandatory(['#wheninput'])) {

		showErrorResponse("responseContainer", "Add these mandatory fields");
		return;// Stop execution
	}
	else {
	
		var formData = {
			id: whenId,
			whenColumn: whenInput,
			// createdBy: createdBy,
			// dateTimeCreation: dateTimeCreation
		}

//		console.log(formData);
		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/editWhenDetailMaster',
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

window.deleteWhenDetail = deleteWhenDetail;
function deleteWhenDetail() { 

	if (deleteAllList.length >= 1) {

		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/delete/deleteWhenDetail',
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