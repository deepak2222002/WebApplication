/*                           USER MASTER   or  LOGIN MASTER                     */
$(document).on('click', '#createUser', function() {

	$("#offcanvasCloseButton").click();
	$("#masterHeading").text("LOGIN MASTER");

	$("#tableContainer").empty();
	$("#pagerContainer").empty();
	makePagerBody("pagerContainer");

	var headerList = ["S.No.", "Plant Code", "Department", "Role", "Employee Id", "Title", "First Name", "Last Name", "Email", "Password", "D.O.B", "D.O.J", "D.O.L", "Contact No.", "Created By", "Date & Time"];
	var searchList = ["searchPlantCode", "searchDepartment", "searchRole", "searchEmployeeId", "", "searchFirstName", "searchLastName", "searchEmail", "", "", "", "", "searchContactNo", "searchCreatedBy", ""];
	var placeholderList = ["Plant Code", "Department", "Role", "Employee Id", "Title", "First Name", "Last Name", "Email", "Password", "D.O.B", "D.O.J", "D.O.L", "Contact No.", "Created By", "Date & Time"];
	makeTable(headerList, placeholderList, searchList, "tableContainer", "table1", "200%");

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

window.loadLikeLoginMasterData = loadLikeLoginMasterData;
function loadLikeLoginMasterData(page, pageSize) {

	var plantCode = $('#searchPlantCode').val() ?? "";
	var departmentName = $('#searchDepartment').val() ?? "";
	var roleName = $('#searchRole').val() ?? "";
	var employeeId = $('#searchEmployeeId').val() ?? "";
	var firstName = $('#searchFirstName').val() ?? "";
	var lastName = $('#searchLastName').val() ?? "";
	var email = $('#searchEmail').val() ?? "";
	var contactNo = $('#searchContactNo').val() ?? "";
	var createdfBy = $('#searchCreatedBy').val() ?? "";

	var formData = {
		plant: {
			plantCode: plantCode
		},
		department: {
			departmentName: departmentName
		},
		role: {
			roleName: roleName
		},
		employeeId: employeeId,
		firstName: firstName,
		lastName: lastName,
		email: email,
		contact: contactNo,
		excludeEmployeeId: sessionStorage.getItem('employeeId'), // this will go to backend as exclusion param
		createdBy: createdfBy
	}
	console.log(formData);
	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getLikeUserMaster/' + page + '/' + pageSize,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {
			console.log(res);
			makePagerByTotalPages(res, page);
			insertLoginMasterInTable(res.content, "table1");
		},
		error: function(response) {

		}
	});
}

window.loginMasterInputs = loginMasterInputs;
function loginMasterInputs(modalBodyId) {

	$("#" + modalBodyId).empty();

	var container46 = document.createElement("div");
	var container47 = document.createElement("div");
	var container48 = document.createElement("div");
	var container49 = document.createElement("div");
	var container50 = document.createElement("div");
	var container51 = document.createElement("div");
	var container52 = document.createElement("div");
	var container53 = document.createElement("div");
	var container54 = document.createElement("div");
	var container55 = document.createElement("div");
	var container56 = document.createElement("div");
	var container57 = document.createElement("div");
	var container58 = document.createElement("div");

	container46.setAttribute("class", "dataContainer smallContainer mt-1");
	container47.setAttribute("class", "dataContainer smallContainer mt-1");
	container48.setAttribute("class", "dataContainer smallContainer mt-1");
	container49.setAttribute("class", "dataContainer smallContainer mt-1");
	container50.setAttribute("class", "dataContainer smallContainer mt-1");
	container51.setAttribute("class", "dataContainer smallContainer mt-1");
	container52.setAttribute("class", "dataContainer smallContainer mt-1");
	container53.setAttribute("class", "dataContainer smallContainer mt-1");
	container54.setAttribute("class", "dataContainer smallContainer mt-1");
	container55.setAttribute("class", "dataContainer smallContainer mt-1");
	container56.setAttribute("class", "dataContainer smallContainer mt-1");
	container57.setAttribute("class", "dataContainer smallContainer mt-1");
	container58.setAttribute("class", "dataContainer smallContainer mt-1");
	
	$("#" + modalBodyId).append(container46, container47, container48, container49, container50, container51, container52, container53, container54, container55, container56, container57, container58);

	var plantcodeAttr = ["id", "plantcodeinput", "type", "text", "name", "plantcode", "class", "inputs m1 selectInput", "placeholder", "Plant Code...", "maxlength", "50"];

	createSelectList(plantcodeAttr, container46, "Plant Code");

	insertOptionById("plantcodeinput", "Select");

	var departmentnameAttr = ["id", "departmentnameinput", "type", "text", "name", "departmentname", "class", "inputs m1 selectInput", "placeholder", "Department Name...", "maxlength", "50"];

	createSelectList(departmentnameAttr, container47, "Department Name");
	insertOptionById("departmentnameinput", "Select");

	var roleAttr = ["id", "roleinput", "type", "text", "name", "role", "class", "inputs m1 selectInput", "placeholder", "Role...", "maxlength", "50"];

	createSelectList(roleAttr, container48, "Role");
	insertOptionById("roleinput", "Select");

	var employeeidAttr = ["id", "employeeidinput", "type", "text", "name", "employeeid", "class", "inputs m1 textInput", "placeholder", "Employee Id...", "maxlength", "50"];

	createInput(employeeidAttr, container49, "Employee Id");

	var emailAttr = ["id", "emailinput", "type", "text", "name", "email", "class", "inputs m1 textInput", "placeholder", "E-mail...", "maxlength", "50"];

	createInput(emailAttr, container50, "E-mail");

	var titleAttr = ["id", "titleinput", "type", "text", "name", "title", "class", "inputs m1 selectInput", "placeholder", "Title...", "maxlength", "50"];

	createSelectList(titleAttr, container51, "Title");
	insertOptionById("titleinput", "Select");
	insertOptionById("titleinput", "Mr.");
	insertOptionById("titleinput", "Mrs.");

	var firstnameAttr = ["id", "firstnameinput", "type", "text", "name", "firstname", "class", "inputs m1 textInput", "placeholder", "First Name...", "maxlength", "50"];

	createInput(firstnameAttr, container52, "First Name");

	var lastnameAttr = ["id", "lastnameinput", "type", "text", "name", "lastname", "class", "inputs m1 textInput", "placeholder", "Last Name...", "maxlength", "50"];

	createInput(lastnameAttr, container53, "Last Name");

 
	var contactnoAttr = ["id", "contactnoinput", "type", "text", "name", "contactno", "class", "inputs m1 textInput", "placeholder", "Contact No ...", "maxlength", "10"];

	createInput(contactnoAttr, container54, "Contact No.");

	var dobAttr = ["id", "dobinput", "type", "date", "name", "dob", "class", "inputs m1 textInput"];

	createInput(dobAttr, container55, "Date of Birth :");

	var dojAttr = ["id", "dojinput", "type", "date", "name", "doj", "class", "inputs m1 textInput"];

	createInput(dojAttr, container56, "Date of Joining :");

	var dolAttr = ["id", "dolinput", "type", "date", "name", "dol", "class", "inputs m1 textInput"];

	createInput(dolAttr, container57, "Date of Leaving :");
	
	var passwordAttr = ["id", "passwordinput", "type", "password", "name", "password", "class", "inputs m1 textInput", "placeholder", " Password...", "maxlength", "50"];

	createPasswordInput(passwordAttr, container58, "Password");

	getMasterAuthorityByRole("Master_AuthorityTabBody");
	getReportsAuthorityByRole("Report_AuthorityTabBody");
	getAllPlantsInList("plantcodeinput");
	getAllRoleInList("roleinput");
	getAllDepartmentInList("departmentnameinput");
	
	$('#roleinput, #departmentnameinput').on('change', function () {
	    const selectedRole = $('#roleinput').find(':selected').text().trim();
	    const selectedDepartment = $('#departmentnameinput').find(':selected').text().trim();

	    if (selectedRole === "CREATOR PE" && selectedDepartment !== "Process Engineering") {
	        alert("For the role 'CREATOR PE', the department must be 'Process Engineering'.");

	        // Highlight both dropdowns
	        $('#roleinput').css('border', '2px solid red');
	        $('#departmentnameinput').css('border', '2px solid red');
	    } else {
	        // Reset border styles
	        $('#roleinput').css('border', '');
	        $('#departmentnameinput').css('border', '');
	    }
	});
	
}


/*-------------------------------- For visibility on frontend ---------------------*/
window.insertLoginMasterInTable = insertLoginMasterInTable;
function insertLoginMasterInTable($item, tableId) {
	$("#" + tableId + "Body").empty();

	var sequenceNumber = getSequenceNumber();

	$.each($item, function(index, value) {

		var row = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId" class="width50">' + (sequenceNumber + 1) + '</td>'
			+ '<td data-column="plantdCode" class="width100 textLeftAlign">' + (value.plant == null ? '' : value.plant.plantCode) + '</td>'
			+ '<td data-column="departdName" class="width200">' + (value.department == null ? '' : value.department.departmentName) + '</td>'
			+ '<td data-column="roledName" class="width200">' + (value.role == null ? '' : value.role.roleName) + '</td>'
			+ '<td data-column="employeedId" class="width100">' + (value.employeeId == null ? '' : value.employeeId) + '</td>'
			+ '<td data-column="titled" class="width100">' + (value.title == null ? '' : value.title) + '</td>'
			+ '<td data-column="firstdName" class="width100">' + (value.firstName == null ? '' : value.firstName) + '</td>'
			+ '<td data-column="lastdName" class="width100">' + (value.lastName == null ? '' : value.lastName) + '</td>'
			+ '<td data-column="emaild" class="width150 textLeftAlign">' + (value.email == null ? '' : value.email) + '</td>'
			+ '<td data-column="passwordd" class="width100">*************</td>'
			+ '<td data-column="dobd" class="width100">' + (value.dob == null ? '' : value.dob) + '</td>'
			+ '<td data-column="dateOfJoiningd" class="width100">' + (value.dateOfJoining == null ? '' : value.dateOfJoining) + '</td>'
			+ '<td data-column="dateOfLeavingd" class="width100">' + (value.dateOfLeaving == null ? '' : value.dateOfLeaving) + '</td>'
			+ '<td data-column="contactd" class="width100">' + (value.contact == null ? '' : value.contact) + '</td>'
			+ '<td data-column="createdByd" class="width100">' + (value.createdBy == null ? '' : value.createdBy) + '</td>'
			+ '<td data-column="dateTime" class="width100">' + (value.dateTime == null ? '' : value.dateTime) + '</td>'
			+ '<td data-column="loginId" style="display:none;">' + (value.loginId == null ? '' : value.loginId) + '</td>'
			+ '<td data-column="departmentId" style="display:none;">' + (value.department == null ? '' : value.department.departmentId) + '</td>'
			+ '<td data-column="roleId" style="display:none;">' + (value.role == null ? '' : value.role.roleId) + '</td>'
			+ '<td data-column="authorization" style="display:none;">' + (value.authorization == null ? '' : value.authorization) + '</td>'
			+ '<td data-column="reportAuthorization" style="display:none;">' + (value.reportAuthorization == null ? '' : value.reportAuthorization) + '</td></tr>';
		$("#" + tableId).append(row);
		sequenceNumber++;
	});
}

window.getMasterAuthorityByRole = getMasterAuthorityByRole;
function getMasterAuthorityByRole(masterDetailContaier) {

	masterIds = [];

	$.ajax({
		url: '/WebApplication/Controllers/getMasterAuthorityByRole/' + sessionStorage.getItem('employeeId') + '',
		type: 'GET',
		contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		dataType: 'json',
		success: function(res) {

			for (var i = 0; i < res.modules.length; i++) {

				var masterHeading = document.createElement("div");

				$("#" + masterDetailContaier).append(masterHeading);
				masterHeading.setAttribute("class", "dataContainer");

				var table = document.createElement("table");
				var tableHead = document.createElement("thead");
				var tableBody = document.createElement("tbody");

				table.append(tableHead, tableBody);
				/*table.setAttribute("style", "width:100%; margin-top:10px;");*/
				table.setAttribute("border", "1px");
				table.setAttribute("class", "authorityTable");
				table.setAttribute("style", "width:100%;");
				tableBody.setAttribute("id", "masterAuthorityTable" + i);
				/*tableBody.setAttribute("style", "display:none;");*/
				masterHeading.append(table);


				var trh = document.createElement("tr");
				var th = document.createElement("th");
				var button = document.createElement("button");
				th.setAttribute("class", "tableheading3");
				th.setAttribute("colspan", "3");
				th.setAttribute("style", "text-align :left; padding-left:20px;");
				th.innerText = res.modules[i];
				button.setAttribute("class", "showHide");
				button.innerText = "Show";
				th.append(button);
				trh.append(th);
				tableHead.setAttribute("class", "authorityHead")
				tableHead.append(trh);


				for (var j = 0; j < res.masterId.length; j++) {

					if (res.modules[i] == res.masterId[j].module) {


						var tr = document.createElement("tr");
						var td = document.createElement("td");
						var td_2 = document.createElement("td");
						var td_3 = document.createElement("td");
						var label_1 = document.createElement("label");
						var label_2 = document.createElement("label");

						var span = document.createElement("span");
						span.innerText = res.masterId[j].masterName;

						span.setAttribute("class", "heading3");

						var input = document.createElement("input");
						var input_2 = document.createElement("input");

						var read = ["type", "checkbox", "style", "margin:2%;", "class", "read"];

						for (var k = 0; k <= read.length - 1; k = k + 2) {
							for (var l = 0; l <= k; l = l + 2) {
								input.setAttribute(read[k], read[l + 1]);

							}
						}

						var write = ["type", "checkbox", "style", "margin:2%;", "class", "write"];

						for (var k = 0; k <= write.length - 1; k = k + 2) {
							for (var l = 0; l <= k; l = l + 2) {
								input_2.setAttribute(write[k], write[l + 1]);
							}
						}

						input.setAttribute("id", "read" + res.masterId[j].masterId);
						masterIds.push(res.masterId[j].masterId);
						td.append(span);
						td.setAttribute("style", "text-align:left; padding-left:4%;");
						td_2.append(input, label_1);
						label_1.innerText = "Read";
						td_2.setAttribute("style", "width:100px;font-size:12px;");

						input_2.setAttribute("id", "write" + res.masterId[j].masterId)
						td_3.append(input_2, label_2);
						label_2.innerText = "Write";
						td_3.setAttribute("style", "width:80px;font-size:12px;");
						tr.append(td, td_2, td_3);
						$("#masterAuthorityTable" + i).append(tr);

					}
				}
			}
		}, error: function(res) {

		}
	});

}

window.getReportsAuthorityByRole = getReportsAuthorityByRole;
function getReportsAuthorityByRole(masterDetailContaier) {

	reportsIds = [];

	$.ajax({
		url: '/WebApplication/Controllers/getReportsAuthorityByRole/' + sessionStorage.getItem('employeeId') + '',
		type: 'GET',
		contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		dataType: 'json',
		success: function(res) {

			console.log("res", res);
			for (var i = 0; i < res.modules.length; i++) {

				var masterHeading = document.createElement("div");

				$("#" + masterDetailContaier).append(masterHeading);
				masterHeading.setAttribute("class", "dataContainer");

				var table = document.createElement("table");
				var tableHead = document.createElement("thead");
				var tableBody = document.createElement("tbody");

				table.append(tableHead, tableBody);
				/*table.setAttribute("style", "width:100%; margin-top:10px;");*/
				table.setAttribute("border", "1px");
				table.setAttribute("class", "authorityTable");
				table.setAttribute("style", "width:100%;");
				tableBody.setAttribute("id", "reportAuthorityTable" + i);
				/*tableBody.setAttribute("style", "display:none;");*/
				masterHeading.append(table);


				var trh = document.createElement("tr");
				var th = document.createElement("th");
				var button = document.createElement("button");
				th.setAttribute("class", "tableheading3");
				th.setAttribute("colspan", "3");
				th.setAttribute("style", "text-align :left; padding-left:20px;");
				th.innerText = res.modules[i];
				button.setAttribute("class", "showHide");
				button.innerText = "Show";
				th.append(button);
				trh.append(th);
				tableHead.setAttribute("class", "authorityHead")
				tableHead.append(trh);


				for (var j = 0; j < res.masterId.length; j++) {

					if (res.modules[i] == res.masterId[j].module) {


						var tr = document.createElement("tr");
						var td = document.createElement("td");
						var td_2 = document.createElement("td");
						var td_3 = document.createElement("td");
						var label_1 = document.createElement("label");
						var label_2 = document.createElement("label");

						var span = document.createElement("span");
						span.innerText = res.masterId[j].masterName;

						span.setAttribute("class", "heading3");

						var input = document.createElement("input");
						// var input_2 = document.createElement("input");

						var read = ["type", "checkbox", "style", "margin:2%;", "class", "read"];

						for (var k = 0; k <= read.length - 1; k = k + 2) {
							for (var l = 0; l <= k; l = l + 2) {
								input.setAttribute(read[k], read[l + 1]);

							}
						}

					/*	var write = ["type", "checkbox", "style", "margin:2%;", "class", "write"];

						for (var k = 0; k <= write.length - 1; k = k + 2) {
							for (var l = 0; l <= k; l = l + 2) {
								input_2.setAttribute(write[k], write[l + 1]);
							}
						}*/

						input.setAttribute("id", "read" + res.masterId[j].masterId);
						reportsIds.push(res.masterId[j].masterId);
						td.append(span);
						td.setAttribute("style", "text-align:left; padding-left:4%;");
						td_2.append(input, label_1);
						label_1.innerText = "Read";
						td_2.setAttribute("style", "width:100px;font-size:12px;");

					/*	input_2.setAttribute("id", "write" + res.masterId[j].masterId)
						td_3.append(input_2, label_2);
						label_2.innerText = "Write";
						td_3.setAttribute("style", "width:80px;font-size:12px;");
						tr.append(td, td_2, td_3);*/
						
						tr.append(td, td_2);
						$("#reportAuthorityTable" + i).append(tr);

					}
				}
			}
		}, error: function(res) {

		}
	});

}

window.addLogin = addLogin;
function addLogin() {

	var authorization = null;
	var plantId = $('#plantcodeinput').find(':selected').val() ?? "";
	var departmentId = $('#departmentnameinput').find(':selected').val() ?? "";
	var roleId = $('#roleinput').find(':selected').val() ?? "";
	var employeeId = $('#employeeidinput').val() ?? "";
	var email = $('#emailinput').val() ?? "";
	var title = $('#titleinput').val() ?? "";
	var firstName = $('#firstnameinput').val() ?? "";
	var lastName = $('#lastnameinput').val() ?? "";
	var contactno = $('#contactnoinput').val() ?? "";
	var dob = $('#dobinput').val() ?? "";
	var doj = $('#dojinput').val() ?? "";
	var dol = $('#dolinput').val() ?? "";
	var createdfBy = sessionStorage.getItem('employeeId');
	var password = $('#passwordinput').val() || employeeId;
	var status = "1";
	var reportAuthorization = null;

	for (var i = 0; i <= masterIds.length; i++) {
		var id = "#write" + masterIds[i];
		if ($(id).prop('checked') == true) {
			authorization = authorization + masterIds[i] + ",1" + "-";
		} else {
			var id2 = "#read" + masterIds[i];
			if ($(id2).prop('checked') == true) {
				authorization = authorization + masterIds[i] + ",0" + "-";
			}
		}
	}

	for (var i = 0; i <= reportsIds.length; i++) {
		var id2 = "#read" + reportsIds[i];
		if ($(id2).prop('checked') == true) {
			console.log("id2: ", id2);
			reportAuthorization = reportAuthorization + reportsIds[i] + "-";
		}
	}
	
	// Get selected values
	var departmentText = $('#departmentnameinput').find(':selected').text().trim();
	var roleText = $('#roleinput').find(':selected').text().trim();

	console.log("roleText", roleText, "departmentText", departmentText);

	// Validation check
	if (roleText === "CREATOR PE" && departmentText !== "Process Engineering") {
		
		showErrorResponse("responseContainer", "For the role 'CREATOR PE', the department must be 'Process Engineering'.");
	    // Highlight both dropdowns with red border
	    $('#departmentnameinput').css('border', '2px solid red');
	    $('#roleinput').css('border', '2px solid red');

	    return; // Stop execution
	} else {
	    // Reset border if validation passes
	    $('#departmentnameinput').css('border', '');
	    $('#roleinput').css('border', '');
	}


	if (!showMandatory(['#plantcodeinput', '#departmentnameinput', '#roleinput', '#employeeidinput', '#emailinput', '#titleinput', '#firstnameinput', '#lastnameinput', '#contactnoinput', '#dobinput', '#dojinput', '#passwordinput'])) {

		showErrorResponse("responseContainer", "Add these mandatory fields");
		return;// Stop execution
	}
	else {		

		
		var formData = {
			loginId: employeeId,
			plant: {
				plantId: parseInt(plantId)
			},
			department: {
				departmentId: parseInt(departmentId)
			},
			role: {
				roleId: parseInt(roleId)
			},
			employeeId: employeeId,
			email: email,
			title: title,
			firstName: firstName,
			lastName: lastName,
			contact: contactno,
			dob: dob,
			dateOfJoining: doj,
			dateOfLeaving: dol,
			password: password,
			status: status,
			authorization: authorization,
			reportAuthorization:reportAuthorization,
			createdBy: createdfBy
		}

		console.log(formData);

		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/insertLoginMaster',
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

window.editLogin = editLogin;
function editLogin() {

	var authorization = null;
	// var reportAuthorization = null;
	var plantId = $('#plantcodeinput').find(':selected').val() ?? "";
	var departmentId = $('#departmentnameinput').find(':selected').val() ?? "";
	var roleId = $('#roleinput').find(':selected').val() ?? "";
	var employeeId = $('#employeeidinput').val() ?? "";
	var email = $('#emailinput').val() ?? "";
	var title = $('#titleinput').val() ?? "";
	var firstName = $('#firstnameinput').val() ?? "";
	var lastName = $('#lastnameinput').val() ?? "";
	var contactno = $('#contactnoinput').val() ?? "";
	var dob = $('#dobinput').val() ?? "";
	var doj = $('#dojinput').val() ?? "";
	var dol = $('#dolinput').val() ?? "";
	var password = $('#passwordinput').val() || employeeId;
	var createdfBy = sessionStorage.getItem('employeeId');
	var status = "1";
	var reportAuthorization = null;

	for (var i = 0; i <= masterIds.length; i++) {
		var id = "#write" + masterIds[i];
		if ($(id).prop('checked') == true) {
			authorization = authorization + masterIds[i] + ",1" + "-";
		} else {
			var id2 = "#read" + masterIds[i];
			if ($(id2).prop('checked') == true) {
				authorization = authorization + masterIds[i] + ",0" + "-";
			}
		}
	}


		for (var i = 0; i <= reportsIds.length; i++) {
			var id2 = "#read" + reportsIds[i];
			console.log("id2: ", id2)
			if ($(id2).prop('checked') == true) {
				reportAuthorization = reportAuthorization + reportsIds[i] + "-";
				console.log("id2vvvvvvvvvvvvvvvvv: ", id2)
			}
		}

	if (!showMandatory(['#plantcodeinput', '#departmentnameinput', '#roleinput', '#employeeidinput', '#emailinput', '#titleinput', '#firstnameinput', '#lastnameinput', '#contactnoinput', '#dobinput', '#dojinput', '#passwordinput'])) {

		showErrorResponse("responseContainer", "Add these mandatory fields");

		return;;// Stop execution
	}
	else {
		var formData = {
			loginId: employeeId,
			plant: {
				plantId: parseInt(plantId)
			},
			department: {
				departmentId: parseInt(departmentId)
			},
			role: {
				roleId: parseInt(roleId)
			},
			employeeId: employeeId,
			email: email,
			title: title,
			firstName: firstName,
			lastName: lastName,
			contact: contactno,
			dob: dob,
			dateOfJoining: doj,
			dateOfLeaving: dol,
			password: password,
			status: status,
			authorization: authorization,
			reportAuthorization:reportAuthorization,
			createdBy: createdfBy
		}

		console.log(formData);
		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/editLoginMaster',
			data: JSON.stringify(formData),
			contentType: "application/json",
			headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
			success: function(response) {

				showSuccessResponse("responseContainer", response);

				if (!$('#pager :selected').val()) {
					loadLikeLoginMasterData(0, pageSize);
				} else {
					loadLikeLoginMasterData($('#pager :selected').val(), pageSize);
				}

				resetValues();

			},
			error: function(response) {
				hideModal("addEditDeleteModalBody");
				setTextById("warningInformationModalBody", response.responseText);
				showModal("warningBackdropButton");

				if (!$('#pager :selected').val()) {
					loadLikeLoginMasterData(0, pageSize);
				} else {
					loadLikeLoginMasterData($('#pager :selected').val(), pageSize);
				}
				resetValues();
			}
		});

		// Delay execution of the code related to #addEditDeleteCloseButton by 1 second (1000 milliseconds) so as to cut the model automatically
		setTimeout(function() {
			$('#addEditDeleteCloseButton').trigger('click');
		}, 1000);
	}
}

window.deleteLogin = deleteLogin;
function deleteLogin() {

	if (deleteAllList.length >= 1) {


		$("#informationModalBody").text("Do you really want to delete all selected login.");

		$("#informationBackdropButton").click();

		$('#informationCancel').off('click').on('click', function() {
			resetValues();
		});
		console.log("del", deleteAllList);

		$('#delete').off('click').on('click', function() {

			$.ajax({
				type: 'post',
				url: '/WebApplication/Controllers/delete/deleteLoginMaster/'+ deleteAllList[0],
				data: JSON.stringify(deleteAllList),
				contentType: "application/json",
				headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
				success: function(response) {
					if (!$('#pager :selected').val()) {
						loadLikeLoginMasterData(0, pageSize);
					} else {
						loadLikeLoginMasterData($('#pager :selected').val(), pageSize);
					}
					$("#informationBackdropButton").click();
					resetValues();
				},
				error: function(response) {
					if (!$('#pager :selected').val()) {
						loadLikeLoginMasterData(0, pageSize);
					} else {

						loadLikeLoginMasterData($('#pager :selected').val(), pageSize);
					}
					$("#informationBackdropButton").click();
					$("#warningInformationModalBody").text(response.responseText);
					$("#warningBackdropButton").click();
					resetValues();
				}
			});
		});
	} else if (!object.loginId && deleteAllList.length == 0) {

		$("#warningInformationModalBody").text("Please select row from table to delete login.");
		$("#warningBackdropButton").click();
	}

}