$(document).on('click', '#departmentMaster', function() {

	$("#offcanvasCloseButton").click();
	$("#masterHeading").text("DEPARTMENT MASTER");

	$("#tableContainer").empty();
	$("#pagerContainer").empty();
	makePagerBody("pagerContainer");

	var headerList = ["S. No.", "Department Name", "Created By", "Date & Time"];
	var searchList = ["searchDepartmentName", "searchCreatedBy", ""];
	var placeholderList = ["Department Name", "Created By"];
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

window.loadLikeDepartmentData = loadLikeDepartmentData;
function loadLikeDepartmentData(page, pageSize) {

	var departmentName = $('#searchDepartmentName').val() ?? "";
	var createdBy = $('#searchCreatedBy').val() ?? "";

	var formData = {
		departmentName: departmentName,
		createdBy: createdBy
	}

	console.log(formData);
	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getLikeDepartmentMasterData/' + page + '/' + pageSize,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {

			makePagerByTotalPages(res, page);
			insertDepartmentMasterInTable(res.content, "table1");
			console.log(res);
		},
		error: function(response) {

		}
	});
}

window.departmentMasterInputs = departmentMasterInputs;
function departmentMasterInputs(modalBodyId) {

	$("#" + modalBodyId).empty();
	var container46 = document.createElement("div");

	container46.setAttribute("class", "dataContainer mt-1");

	$("#" + modalBodyId).append(container46);

	var deparmentnameAttr = ["id", "departmentnameinput", "type", "text", "name", "name", "class", "inputs m1 textInput", "placeholder", "Department Name...", "maxlength", "50"];

	createInput(deparmentnameAttr, container46, "Department Name");

}


/*-------------------------------- For visibility on frontend ---------------------*/
window.insertDepartmentMasterInTable = insertDepartmentMasterInTable;
function insertDepartmentMasterInTable($item, tableId) {
	$("#" + tableId + "Body").empty();

	var sequenceNumber = getSequenceNumber();

	$.each($item, function(index, value) {

		var row = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId" class="width50">' + (sequenceNumber + 1) + '</td>'
			+ '<td data-column="departmentName" class="width100">' + (value.departmentName == null ? '' : value.departmentName) + '</td>'
			+ '<td data-column="createdBy" class="width100">' + (value.createdBy == null ? '' : value.createdBy) + '</td>'
			+ '<td data-column="dateTime" class="width100">' + (value.dateTime == null ? '' : value.dateTime) + '</td>'
			+ '<td data-column="dateTimeCreationd" style="display:none;">' + (value.dateTime == null ? '' : value.dateTime) + '</td>'
			+ '<td data-column="departmentId" style="display:none;">' + (value.departmentId == null ? '' : value.departmentId) + '</td></tr>';
		$("#" + tableId).append(row);
		sequenceNumber++;
	});
}


window.addDepartment = addDepartment;
function addDepartment() {

	var departmentName = $('#departmentnameinput').val() ?? "";
	var createdBy = sessionStorage.getItem('employeeId');
	var status = "1";

	if (!showMandatory(['#departmentnameinput'])) {

		showErrorResponse("responseContainer", "Add these mandatory fields");
		return;// Stop execution
	}
	else {

		var formData = {
			departmentName: departmentName,
			status: status,
			createdBy: createdBy
		}

		console.log(formData);

		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/insertDepartmentMaster',
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

window.editDepartment = editDepartment;
function editDepartment() {

	var departmentName = $('#departmentnameinput').val() ?? "";
	var createdBy = sessionStorage.getItem('employeeId');

	if (!showMandatory(['#departmentnameinput'])) {

		showErrorResponse("responseContainer", "Add these mandatory fields");

		return;;// Stop execution
	}
	else {
		var formData = {
			departmentId: rowId,
			departmentName: departmentName,
			createdBy: createdBy,
		}

		console.log(formData);
		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/editDepartmentMaster',
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

window.deleteDepartment = deleteDepartment;
function deleteDepartment() {

	if (deleteAllList.length >= 1) {


		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/delete/deleteAllDepartmentMaster',
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

		$("#warningInformationModalBody").text("Please select row from table to delete Role.");
		$("#warningBackdropButton").click();
	}

}