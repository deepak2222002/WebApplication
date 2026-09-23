$(document).on('click', '#roleMaster', function() {

	$("#offcanvasCloseButton").click();
	$("#masterHeading").text("ROLE MASTER");

	$("#tableContainer").empty();
	$("#pagerContainer").empty();
	makePagerBody("pagerContainer");

	var headerList = ["S. No.", "Role Name", "Created By", "Date & Time"];
	var searchList = ["searchRoleName", "searchCreatedBy", ""];
	var placeholderList = ["Role Name", "Created By"];
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

window.loadLikeRoleData = loadLikeRoleData;
function loadLikeRoleData(page, pageSize) {

	var roleName = $('#searchRoleName').val() ?? "";
	var createdBy = $('#searchCreatedBy').val() ?? "";

	var formData = {
		roleName: roleName,
		createdBy: createdBy
	}

	console.log(formData);
	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getLikeRoleMasterData/' + page + '/' + pageSize,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {

			makePagerByTotalPages(res, page);
			insertRoleMasterInTable(res.content, "table1");
			console.log(res);
		},
		error: function(response) {

		}
	});
}

window.roleMasterInputs = roleMasterInputs;
function roleMasterInputs(modalBodyId) {

	$("#" + modalBodyId).empty();
	var container46 = document.createElement("div");

	container46.setAttribute("class", "dataContainer mt-1");

	$("#" + modalBodyId).append(container46);

	var rolenameAttr = ["id", "rolenameinput", "type", "text", "name", "name", "class", "inputs m1 textInput", "placeholder", "Role Name...", "maxlength", "50"];

	createInput(rolenameAttr, container46, "Role Name");

	
	$('#rolenameinput').on('input', function () {
	    $(this).val($(this).val().toUpperCase());
	});

}


/*-------------------------------- For visibility on frontend ---------------------*/
window.insertRoleMasterInTable = insertRoleMasterInTable;
function insertRoleMasterInTable($item, tableId) {
	$("#" + tableId + "Body").empty();

	var sequenceNumber = getSequenceNumber();

	$.each($item, function(index, value) {

		var row = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId" class="width50">' + (sequenceNumber + 1) + '</td>'
			+ '<td data-column="roleName" class="width100">' + (value.roleName == null ? '' : value.roleName) + '</td>'
			+ '<td data-column="createdBy" class="width100">' + (value.createdBy == null ? '' : value.createdBy) + '</td>'
			+ '<td data-column="dateTime" class="width100">' + (value.dateTimeModified == null ? '' : value.dateTimeModified) + '</td>'
			+ '<td data-column="dateTimeCreationd" style="display:none;">' + (value.dateTimeCreation == null ? '' : value.dateTimeCreation) + '</td>'
			+ '<td data-column="roleId" style="display:none;">' + (value.roleId == null ? '' : value.roleId) + '</td></tr>';
		$("#" + tableId).append(row);
		sequenceNumber++;
	});
}

window.addRole = addRole;
function addRole() {

	let roleName = $('#rolenameinput').val()?.toUpperCase() ?? "";
	var createdBy = sessionStorage.getItem('employeeId');
	var status = "1";

	if (!showMandatory(['#rolenameinput'])) {

		showErrorResponse("responseContainer", "Add these mandatory fields");
		return;// Stop execution
	}
	else {

		var formData = {
			roleName: roleName,
			status: status,
			createdBy: createdBy
		}

		console.log(formData);

		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/insertRoleMaster',
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

window.editRole = editRole;
function editRole() {

	var roleName = $('#rolenameinput').val() ?? "";
	var createdBy = sessionStorage.getItem('employeeId');
	var status = "1";

	if (!showMandatory(['#rolenameinput'])) {

		showErrorResponse("responseContainer", "Add these mandatory fields");

		return;;// Stop execution
	}
	else {
		var formData = {
			roleId: rowId,
			roleName: roleName,
			status: status,
			createdBy: createdBy,
			dateTimeCreation: dateTimeCreation
		}

		console.log(formData);
		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/editRoleMaster',
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

window.deleteRole = deleteRole;
function deleteRole() {

	if (deleteAllList.length >= 1) {


		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/delete/deleteAllRoleMaster',
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