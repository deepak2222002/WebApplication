
$(document).on('click', '#supplierMaster', function() {

	$("#offcanvasCloseButton").click();
	$("#masterHeading").text("SUPPLIER MASTER")

	$("#tableContainer").empty();
	$("#pagerContainer").empty();
	makePagerBody("pagerContainer");


	var headerList = ["S. No.", "Supplier Name", "Created By", "Creation Date","Updated Date"];
	var searchList = ["searchSupplierName", "searchCreatedBy", "",""];
	var placeholderList = ["Supplier Name","Created By"];
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

window.loadLikeSupplierData = loadLikeSupplierData;
function loadLikeSupplierData(page, pageSize) {
	// f part is for form
	var supplierName = $('#searchSupplierName').val() ?? "";
	var createdfBy = $('#searchCreatedBy').val() ?? "";

	var formData = {
		supplierName: supplierName,
		createdBy: createdfBy
	}

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getLikeSupplierMaster/' + page + '/' + pageSize,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {
			console.log("response aaya",res);

			makePagerByTotalPages(res, page);
			insertSupplierInTable(res.content, "table1");
		},
		error: function(response) {


		}
	});
}

/*-------------------------------- For visibility on frontend ---------------------*/
window.insertSupplierInTable = insertSupplierInTable;
function insertSupplierInTable($item, tableId) {
	$("#" + tableId + "Body").empty();

	var sequenceNumber = getSequenceNumber();

	$.each($item, function(index, value) {
		/* will use data-column="instrumentNamed"  in edit for getting data from roof table*/
		var row = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId" class="width50">' + (sequenceNumber + 1) + '</td>'
			+ '<td data-column="supplierName" class="width150">' + (value.supplierName == null ? '' : value.supplierName) + '</td>'
			+ '<td data-column="createdBy" class="width50">' + (value.createdBy == null ? '' : value.createdBy) + '</td>'
			+ '<td data-column="createdTime" class="width70">' + (value.createdTime == null ? '' : value.createdTime) + '</td>'
			+ '<td data-column="updatedTime" class="width70">' + (value.updatedTime == null ? '' : value.updatedTime) + '</td>'
			+ '<td data-column="supplierId" style="display:none;">' + (value.supplierId == null ? '' : value.supplierId) +'</td></tr>';
		$("#" + tableId).append(row);
		sequenceNumber++;
	});
}


window.SupplierMasterInputs = SupplierMasterInputs;
function SupplierMasterInputs(modalBodyId) {

	// Clear existing content
	$("#" + modalBodyId).empty();

	// Create containers
	var container1 = document.createElement("div");
	

	// Set class attributes
	container1.setAttribute("class", "dataContainer  mt-1");
	

	// Append to modal body
	$("#" + modalBodyId).append(container1);

	// Define attributes and create inputs
	const supplierNameAttr = ["id", "supplierNameInput", "type", "text", "name", "supplierName", "class", "inputs m1 textInput", "placeholder", "Supplier Name...",];

	// Call helper function to create inputs with labels
	createInput(supplierNameAttr, container1, "Supplier Name");
	
}

window.addSupplier = addSupplier;
function addSupplier() {
	const supplierName=  $('#supplierNameInput').val();
	const createdBy = sessionStorage.getItem('employeeId');

	if (!showMandatory(['#supplierNameInput'])) {

		showErrorResponse("responseContainer", "Add these mandatory fields");
		return;// Stop execution
	}
	else {
		const formData = {
		  supplierName: supplierName,
		  createdBy: createdBy
		};

		console.log(formData);

		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/insertSupplierMaster',
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


window.editSupplier = editSupplier;
function editSupplier() {

	const supplierName=  $('#supplierNameInput').val();
	const createdBy = sessionStorage.getItem('employeeId');
	
	

	if (!showMandatory(['#supplierNameInput'])) {

		showErrorResponse("responseContainer", "Add these mandatory fields");
		return;// Stop execution
	}
	else {
		
		const formData = {
		  supplierId: supplierId,
		  supplierName: supplierName,
		  createdBy: createdBy
		};

		console.log(formData);
		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/editSupplierMaster',
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

window.deleteSupplier = deleteSupplier;
function deleteSupplier() {

	if (deleteAllList.length >= 1) {


		console.log("del", deleteAllList);

		$('#delete').off('click').on('click', function() {

			$.ajax({
				type: 'post',
				url: '/WebApplication/Controllers/delete/deleteAllSupplierMaster',
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