
$(document).on('click', '#whoMaster', function() {

	
	$(".fromToDiv").css("display", "none");
	
	$("#offcanvasCloseButton").click();
	$("#masterHeading").text("WHO MASTER")

	$("#tableContainer").empty();
	$("#pagerContainer").empty();
	makePagerBody("pagerContainer");


	var headerList = ["S. No.", "Who"];
	var searchList = ["searchWho"];
	var placeholderList = ["Who"];
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

window.loadLikeWhoDetailData = loadLikeWhoDetailData;
function loadLikeWhoDetailData(page, pageSize) {

	var whoInput = $('#searchWho').val() ?? "";

	var formData = {
		who: whoInput,
	}
//	console.log(formData);

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getLikeWhoDetailMasterData/' + page + '/' + pageSize,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {
	// console.log(res);
			makePagerByTotalPages(res, page);
			insertWhoDetailInTable(res.content, "table1");
		},
		error: function(response) {


		}
	});
}

window.whoDetailMasterInputs = whoDetailMasterInputs;
function whoDetailMasterInputs(modalBodyId) {

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


	var whoAttr = ["id", "whoinput", "type", "text", "name", "who", "class", "inputs m1 textInput", "placeholder", "Who...", "maxlength", "100"];

	createInput(whoAttr, container46, "Who: ");

}


/*-------------------------------- For visibility on frontend ---------------------*/
window.insertWhoDetailInTable = insertWhoDetailInTable;
function insertWhoDetailInTable($item, tableId) {
	$("#" + tableId + "Body").empty();

	var sequenceNumber = getSequenceNumber();

	$.each($item, function(index, value) {
		var row = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId" class="width50">' + (sequenceNumber + 1) + '</td>'
			+ '<td data-column="whoInput" class="width150 textLeftAlign">' + (value.who == null ? '' : value.who) + '</td>'
			+ '<td data-column="whoId" style="display:none;">' + (value.id == null ? '' : value.id) + '</td></tr>';
		$("#" + tableId).append(row);
		sequenceNumber++;
	});
}


window.addWhoDetail = addWhoDetail;
function addWhoDetail() {

	var whoInput = $('#whoinput').val() ?? "";
	var createdBy = sessionStorage.getItem('employeeId');

	
	if (!showMandatory(['#whoinput'])) {

		showErrorResponse("responseContainer", "Add these mandatory fields");
		return;// Stop execution
	}
	else {

		var formData = {
			who: whoInput,
			// createdBy: createdBy
		}
//		console.log(formData);

		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/insertWhoDetailMaster',
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

window.editWhoDetail = editWhoDetail;
function editWhoDetail() {

	var whoInput = $('#whoinput').val() ?? "";
	var createdBy = sessionStorage.getItem('employeeId');

	if (!showMandatory(['#whoinput'])) {

		showErrorResponse("responseContainer", "Add these mandatory fields");
		return;// Stop execution
	}
	else {
	
		var formData = {
			id: whoId,
			who: whoInput,
			// createdBy: createdBy,
			// dateTimeCreation: dateTimeCreation
		}

//		console.log(formData);
		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/editWhoDetailMaster',
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

window.deleteWhoDetail = deleteWhoDetail;
function deleteWhoDetail() { 

	if (deleteAllList.length >= 1) {

		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/delete/deleteWhoDetail',
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