
$(document).on('click', '#plantMaster', function() {

	$("#offcanvasCloseButton").click();
	$("#masterHeading").text("PLANT MASTER");

	$("#tableContainer").empty();
	$("#pagerContainer").empty();
	makePagerBody("pagerContainer");

	var headerList = ["S. No.", "Name", "Plant Code", "Address", "City", "State", "Pin Code", "Contact Person", "Mobile No.", "Created By", "Date & Time"];
	var searchList = ["searchName", "searchPlantCode", "searchAddress", "searchCity", "searchState", "searchPinCode", "searchContactPerson", "searchMobileNo", "searchCreatedBy", ""];
	var placeholderList = ["Name", "Plant Code", "Address", "City", "State", "Pin Code", "Contact Person", "Mobile No.", "Created By"];
	makeTable(headerList, placeholderList, searchList, "tableContainer", "table1", "120%");

	handlePageChange(0);

	// Example Usage
	configureButtons({
		add: "show",
		edit: "show",
		delete: "show",
		template: "hide",
		data: "show",
		upload: "hide",
		pdfUpload: "hide",
		userDetails: "show"
	});

	getIdByMasterName($(this).attr('id'));
});

window.loadLikePlantData = loadLikePlantData;
function loadLikePlantData(page, pageSize) {

	var plantName = $('#searchName').val() ?? "";
	var plantCode = $('#searchPlantCode').val() ?? "";
	var plantAddress = $('#searchAddress').val() ?? "";
	var plantCity = $('#searchCity').val() ?? "";
	var plantState = $('#searchState').val() ?? "";
	var plantPincode = $('#searchPinCode').val() ?? "";
	var plantContactPerson = $('#searchContactPerson').val() ?? "";
	var plantMobileNo = $('#searchMobileNo').val() ?? "";
	var createdfBy = $('#searchCreatedBy').val() ?? "";

	var formData = {
		plantId: parseInt(plantCode),
		plantName: plantName,
		plantCode: plantCode,
		plantAddress: plantAddress,
		plantCity: plantCity,
		plantState: plantState,
		plantPincode: plantPincode,
		plantContactPerson: plantContactPerson,
		plantMobileNo: plantMobileNo,
		createdBy: createdfBy
	}

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getLikePlantMasterData/' + page + '/' + pageSize,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {
			console.log(res);
			makePagerByTotalPages(res, page);
			insertPlantMasterInTable(res.content, "table1");
		},
		error: function(response) {

		}
	});
}

window.plantMasterInputs = plantMasterInputs;
function plantMasterInputs(modalBodyId) {

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

	var plantnameAttr = ["id", "plantnameinput", "type", "text", "name", "name", "class", "inputs m1 textInput", "placeholder", "Plant Name...", "maxlength", "50"];

	createInput(plantnameAttr, container46, "Plant Name");

	var plantcodeAttr = ["id", "plantcodeinput", "type", "number", "name", "code", "class", "inputs m1 textInput", "placeholder", "Plant Code...", "maxlength", "15"];

	createInput(plantcodeAttr, container47, "Plant Code");

	var plantaddressAttr = ["id", "plantaddressinput", "type", "text", "name", "address", "class", "inputs m1 textInput", "placeholder", "Plant Address...", "maxlength", "50"];

	createInput(plantaddressAttr, container48, "Address");

	var plantcityAttr = ["id", "plantcityinput", "type", "text", "name", "city", "class", "inputs m1 textInput", "placeholder", "City...", "maxlength", "30"];

	createInput(plantcityAttr, container49, "City");

	var plantstateAttr = ["id", "plantstateinput", "type", "text", "name", "state", "class", "inputs m1 textInput", "placeholder", "State...", "maxlength", "30"];

	createInput(plantstateAttr, container50, "State");

	var plantpinCodeAttr = ["id", "plantpinCodeinput", "type", "text", "name", "pinCode", "class", "inputs m1 textInput", "placeholder", "Pin Code...", "maxlength", "6"];

	createInput(plantpinCodeAttr, container51, "Pin Code");

	var plantcontactPersonAttr = ["id", "plantcontactPersoninput", "type", "text", "name", "contactPerson", "class", "inputs m1 textInput", "placeholder", "Contact Person...", "maxlength", "50"];

	createInput(plantcontactPersonAttr, container52, "Contact Person");

	var plantmobileNoAttr = ["id", "plantmobileNoinput", "type", "text", "name", "mobileNo", "class", "inputs m1 textInput", "placeholder", "Mobile No. ...", "maxlength", "10"];

	createInput(plantmobileNoAttr, container53, "Mobile No.");
}


/*-------------------------------- For visibility on frontend ---------------------*/
window.insertPlantMasterInTable = insertPlantMasterInTable;
function insertPlantMasterInTable($item, tableId) {
	$("#" + tableId + "Body").empty();

	var sequenceNumber = getSequenceNumber();

	$.each($item, function(index, value) {

		var row = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId" class="width50">' + (sequenceNumber + 1) + '</td>'
			+ '<td data-column="plantdName" class="width100">' + (value.plantName == null ? '' : value.plantName) + '</td>'
			+ '<td data-column="plantdCode" class="width50 textLeftAlign">' + (value.plantCode == null ? '' : value.plantCode) + '</td>'
			+ '<td data-column="plantdAddress" class="width150 textLeftAlign">' + (value.plantAddress == null ? '' : value.plantAddress) + '</td>'
			+ '<td data-column="plantdCity" class="width100">' + (value.plantCity == null ? '' : value.plantCity) + '</td>'
			+ '<td data-column="plantdState" class="width100">' + (value.plantState == null ? '' : value.plantState) + '</td>'
			+ '<td data-column="plantdPincode" class="width50">' + (value.plantPincode == null ? '' : value.plantPincode) + '</td>'
			+ '<td data-column="plantdContactPerson" class="width100">' + (value.plantContactPerson == null ? '' : value.plantContactPerson) + '</td>'
			+ '<td data-column="plantdMobileNo" class="width100">' + (value.plantMobileNo == null ? '' : value.plantMobileNo) + '</td>'
			+ '<td data-column="createdBy" class="width100">' + (value.createdBy == null ? '' : value.createdBy) + '</td>'
			+ '<td data-column="dateTime" class="width100">' + (value.dateTimeModified == null ? '' : value.dateTimeModified) + '</td>'
			+ '<td data-column="dateTimeCreationd" style="display:none;">' + (value.dateTimeCreation == null ? '' : value.dateTimeCreation) + '</td>'
			+ '<td data-column="plantId" style="display:none;">' + (value.plantId == null ? '' : value.plantId) + '</td></tr>';
		$("#" + tableId).append(row);
		sequenceNumber++;
	});
}


window.addPlant = addPlant;
function addPlant() {

	var plantName = $('#plantnameinput').val() ?? "";
	var plantCode = $('#plantcodeinput').val() ?? "";
	var plantAddress = $('#plantaddressinput').val() ?? "";
	var plantCity = $('#plantcityinput').val() ?? "";
	var plantState = $('#plantstateinput').val() ?? "";
	var plantPincode = $('#plantstateinput').val() ?? "";
	var plantContactPerson = $('#plantcontactPersoninput').val() ?? "";
	var plantMobileNo = $('#plantmobileNoinput').val() ?? "";
	var createdBy = sessionStorage.getItem('employeeId');
	var status = "1";

	if (!showMandatory(['#plantnameinput', '#plantcodeinput', '#plantaddressinput', '#plantcityinput', '#plantstateinput', '#plantpinCodeinput', '#plantcontactPersoninput', '#plantmobileNoinput'])) {

		showErrorResponse("responseContainer", "Add these mandatory fields");
		return;// Stop execution
	}
	else {

		var formData = {
			plantId: parseInt(plantCode),
			plantName: plantName,
			plantCode: plantCode,
			plantAddress: plantAddress,
			plantCity: plantCity,
			plantState: plantState,
			plantPincode: plantPincode,
			plantContactPerson: plantContactPerson,
			plantMobileNo: plantMobileNo,
			status: status,
			createdBy: createdBy
		}

		console.log(formData);

		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/insertPlantMaster',
			data: JSON.stringify(formData),
			contentType: "application/json",
			headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
			success: function(response) {
				
				console.log("success");
				showSuccessResponse("responseContainer", response);
				loadDataAndPager();
				resetValues();

			},
			error: function(response) {
				console.log("error");
				console.log(response);

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

window.editPlant = editPlant;
function editPlant() {

	var plantName = $('#plantnameinput').val() ?? "";
	var plantCode = $('#plantcodeinput').val() ?? "";
	var plantAddress = $('#plantaddressinput').val() ?? "";
	var plantCity = $('#plantcityinput').val() ?? "";
	var plantState = $('#plantstateinput').val() ?? "";
	var plantPincode = $('#plantpinCodeinput').val() ?? "";
	var plantContactPerson = $('#plantcontactPersoninput').val() ?? "";
	var plantMobileNo = $('#plantmobileNoinput').val() ?? "";
	var createdBy = sessionStorage.getItem('employeeId');
	var status = "1";

	if (!showMandatory(['#plantnameinput', '#plantcodeinput', '#plantaddressinput', '#plantcityinput', '#plantstateinput', '#plantpinCodeinput', '#plantcontactPersoninput', '#plantmobileNoinput'])) {

		showErrorResponse("responseContainer", "Add these mandatory fields");

		return;// Stop execution
	}
	else {
		var formData = {
			plantId: rowId,
			plantName: plantName,
			plantCode: plantCode,
			plantAddress: plantAddress,
			plantCity: plantCity,
			plantState: plantState,
			plantPincode: plantPincode,
			plantContactPerson: plantContactPerson,
			plantMobileNo: plantMobileNo,
			createdBy: createdBy,
			status: status,
			dateTimeCreation: dateTimeCreation
		}

		console.log(formData);
		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/editPlantMaster',
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

window.deletePlant = deletePlant;
function deletePlant() {

	if (deleteAllList.length >= 1) {

		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/delete/deleteAllPlantMaster',
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