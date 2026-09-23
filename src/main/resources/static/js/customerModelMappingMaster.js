
$(document).on('click', '#customerModelMappingMaster', function() {

	$("#offcanvasCloseButton").click();
	$("#masterHeading").text("CUSTOMER MODEL MAPPING MASTER")

	$("#tableContainer").empty();
	$("#pagerContainer").empty();
	makePagerBody("pagerContainer");


	var headerList = ["S. No.", "Cust. Name", "Model", "Created By", "Date & Time"];
	var searchList = ["searchCustomerName", "searchModel", "searchCreatedBy", ""];
	var placeholderList = ["Cust. Name", "Model", "Created By"];
	makeTable(headerList, placeholderList, searchList, "tableContainer", "table1", "100%");

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

window.loadLikeCustomerModelMappingData = loadLikeCustomerModelMappingData;
function loadLikeCustomerModelMappingData(page, pageSize) {
	// f part is for form
	var customerNamef = $('#searchCustomerName').val() ?? "";
	var modelf = $('#searchModel').val() ?? "";
	var createdfBy = $('#searchCreatedBy').val() ?? "";

	var formData = {
		customerName: customerNamef,
		model: modelf,
		createdBy: createdfBy
	}

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getLikeCustomerModelMappingMaster/' + page + '/' + pageSize,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {

			makePagerByTotalPages(res, page);
			insertCustomerModelMappingInTable(res.content, "table1");
		},
		error: function(response) {


		}
	});
}

/*-------------------------------- For visibility on frontend ---------------------*/
window.insertCustomerModelMappingInTable = insertCustomerModelMappingInTable;
function insertCustomerModelMappingInTable($item, tableId) {
	$("#" + tableId + "Body").empty();

	var sequenceNumber = getSequenceNumber();

	$.each($item, function(index, value) {
		/* will use data-column="instrumentNamed"  in edit for getting data from roof table*/
		var row = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId" class="width50">' + (sequenceNumber + 1) + '</td>'
			+ '<td data-column="customerNamed" class="width125">' + (value.customerName == null ? '' : value.customerName) + '</td>'
			+ '<td data-column="model" class="width100 textLeftAlign">' + (value.model == null ? '' : value.model) + '</td>'
			+ '<td data-column="createdBy" class="width50">' + (value.createdBy == null ? '' : value.createdBy) + '</td>'
			+ '<td data-column="dateTime" class="width150">' + (value.dateTime == null ? '' : value.dateTime) + '</td>'
			+ '<td data-column="customerModelId" style="display:none;">' + (value.customerModelId == null ? '' : value.customerModelId) +'</td></tr>';
		$("#" + tableId).append(row);
		sequenceNumber++;
	});
}


window.CustomerModelMappingMasterInputs = CustomerModelMappingMasterInputs;
function CustomerModelMappingMasterInputs(modalBodyId) {

	// Clear existing content
	$("#" + modalBodyId).empty();

	// Create containers
	var container1 = document.createElement("div");
	var container2 = document.createElement("div");
	var container3 = document.createElement("div");
	var container4 = document.createElement("div");
	var container5 = document.createElement("div");

	// Set class attributes
	container1.setAttribute("class", "dataContainer smallContainer mt-1");
	container2.setAttribute("class", "dataContainer smallContainer mt-1");
	container3.setAttribute("class", "dataContainer smallContainer mt-1");
	container4.setAttribute("class", "dataContainer smallContainer mt-1");
	container5.setAttribute("class", "dataContainer smallContainer mt-1");

	// Append to modal body
	$("#" + modalBodyId).append(container1, container2, container3, container4, container5);

	// Define attributes and create inputs
	const customerNameAttr = ["id", "customerNameInput", "type", "text", "name", "customerName", "class", "inputs m1 textInput", "placeholder", "Customer Name...", "maxlength", "50", "style", "text-transform: uppercase;"];
	const modelAttr = ["id", "modelInput", "type", "text", "name", "model", "class", "inputs m1 textInput", "placeholder", "Model...", "maxlength", "50", "style", "text-transform: uppercase;"];

	// Call helper function to create inputs with labels
	createInput(customerNameAttr, container1, "Customer Name");
	createInput(modelAttr, container2, "Model");
	
	
	// Force uppercase for stored values
	$("#customerNameInput, #modelInput").on("input", function () {
		this.value = this.value.toUpperCase();
	});
}

window.addCustomerModelMapping = addCustomerModelMapping;
function addCustomerModelMapping() {

	const customerName = ($('#customerNameInput').val()?.trim() ?? "").toUpperCase();
	const model =($('#modelInput').val()?.trim() ?? "").toUpperCase();
	const createdBy = sessionStorage.getItem('employeeId');

	if (!showMandatory(['#customerNameInput', '#modelInput'])) {

		showErrorResponse("responseContainer", "Add these mandatory fields");
		return;// Stop execution
	}
	else {
		const formData = {
		  customerName: customerName,
		  model: model,
		  createdBy: createdBy
		};

		console.log(formData);

		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/insertCustomerModelMappingMaster',
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


window.editCustomerModelMapping = editCustomerModelMapping;
function editCustomerModelMapping() {

	const customerName = ($('#customerNameInput').val()?.trim() ?? "").toUpperCase();
	const model =($('#modelInput').val()?.trim() ?? "").toUpperCase();
	const createdBy = sessionStorage.getItem('employeeId');
	const status = "1";
	

	if (!showMandatory(['#customerNameInput', '#modelInput'])) {

		showErrorResponse("responseContainer", "Add these mandatory fields");
		return;// Stop execution
	}
	else {
		
		const formData = {
		  customerModelId: customerModelId,
		  customerName: customerName,
		  model: model,
		  createdBy: createdBy,
		  status: status,
		};


		console.log(formData);
		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/editCustomerModelMappingMaster',
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

window.deleteCustomerModelMapping = deleteCustomerModelMapping;
function deleteCustomerModelMapping() {

	if (deleteAllList.length >= 1) {


		console.log("del", deleteAllList);

		$('#delete').off('click').on('click', function() {

			$.ajax({
				type: 'post',
				url: '/WebApplication/Controllers/delete/deleteAllCustomerModelMappingMaster',
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
		});
	} else if (!object.plantId && deleteAllList.length == 0) {

		$("#warningInformationModalBody").text("Please select row from table to delete mapping.");
		$("#warningBackdropButton").click();
	}

}