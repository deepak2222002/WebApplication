
$(document).on('click', '#subProductMaster', function() {

	$("#offcanvasCloseButton").click();
	$("#masterHeading").text("SUB PRODUCT MASTER")

	$("#tableContainer").empty();
	$("#pagerContainer").empty();
	makePagerBody("pagerContainer");


	var headerList = ["S. No.", "Product", "Sub Product", "Product Barcode", "Type", "Material Type", "Barcode Type", "Created By", "Date & Time"];
	var searchList = ["searchProductName", "searchSubProductName", "searchProductBarCode", "searchType", "searchMaterialType", "searchBarcodeType", "searchCreatedBy", ""];
	var placeholderList = ["Product", "Sub Product", "Product Barcode", "Type", "Material Type", "Barcode Type", "Created By"];
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

window.loadLikeSubProductData = loadLikeSubProductData;
function loadLikeSubProductData(page, pageSize) {
	// sub PRODUCT:- ID, NAME, PRODUCTBARCODE, MATERIALTYPE, BARCODETYPE, CREATED BY, DATE CREATED , MODIFIED, STATUS
	var productName = $('#searchProductName').val() ?? "";
	var subProductName = $('#searchSubProductName').val() ?? "";
	var productBarCode = $('#searchProductBarCode').val() ?? "";
	var type = $('#searchType').val() ?? "";
	var materialType = $('#searchMaterialType').val() ?? "";
	var barcodeType = $('#searchBarcodeType').val() ?? "";
	var createdBy = $('#searchCreatedBy').val() ?? "";

	var formData = {
		product: {
			productName: productName
		},
		subProductName: subProductName,
		productBarCode: productBarCode,
		type: type,
		materialType: materialType,
		barcodeType: barcodeType,
		createdBy: createdBy
	}

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getLikeSubProductMasterData/' + page + '/' + pageSize,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {

			makePagerByTotalPages(res, page);
			insertSubProductInTable(res.content, "table1");
		},
		error: function(response) {


		}
	});
}

window.subProductMasterInputs = subProductMasterInputs;
function subProductMasterInputs(modalBodyId) {

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


	//-- sub PRODUCT:- ID, NAME, PRODUCTBARCODE, MATERIALTYPE, BARCODETYPE, CREATED BY, DATE CREATED , MODIFIED, STATUS
	$("#" + modalBodyId).append(container46, container47, container48, container49, container50, container51, container52, container53);

	var productNameAttr = ["id", "productnameinput", "class", "inputs m1 selectInput"];

	createSelectList(productNameAttr, container46, "Product Name");
	insertOptionById("productnameinput", "Select");

	var subproductnameAttr = ["id", "subproductnameinput", "type", "text", "name", "subproductname", "class", "inputs m1 textInput", "placeholder", "Sub Product Name...", "maxlength", "50"];

	createInput(subproductnameAttr, container47, "Sub Product Name");

	var productbarcodeAttr = ["id", "productbarcodeinput", "type", "text", "name", "productbarcode", "class", "inputs m1 textInput", "placeholder", "Product Barcode...", "maxlength", "15"];

	createInput(productbarcodeAttr, container48, "Product Barcode");


	var typeAttr = ["id", "typeinput", "class", "inputs m1 selectInput"];

	createSelectList(typeAttr, container49, "Type");
	insertOptionById("typeinput", "Select");
	insertOptionById("typeinput", "Child Part");
	insertOptionById("typeinput", "Final Product");


	var materialtypeAttr = ["id", "materialtypeinput", "class", "inputs m1 selectInput"];

	createSelectList(materialtypeAttr, container50, "Material Type");
	insertOptionById("materialtypeinput", "Select");
	insertOptionById("materialtypeinput", "Sub Ass");
	insertOptionById("materialtypeinput", "Child Part with MRN");
	insertOptionById("materialtypeinput", "PCBA");
	insertOptionById("materialtypeinput", "Dial");

	var barcodetypeAttr = ["id", "barcodetypeinput", "class", "inputs m1 selectInput"];

	createSelectList(barcodetypeAttr, container51, "Barcode Type");
	insertOptionById("barcodetypeinput", "Select");
	insertOptionById("barcodetypeinput", "Unique");
	insertOptionById("barcodetypeinput", "Batch");
	insertOptionById("barcodetypeinput", "Multiple Scan");

	getAllProductByLineInList("productnameinput");

}


/*-------------------------------- For visibility on frontend ---------------------*/
window.insertSubProductInTable = insertSubProductInTable;
function insertSubProductInTable($item, tableId) {
	$("#" + tableId + "Body").empty();

	var sequenceNumber = getSequenceNumber();

	$.each($item, function(index, value) {

		var row = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId" class="width50">' + (sequenceNumber + 1) + '</td>'
			+ '<td data-column="productdName" class="width150 textLeftAlign">' + (value.product == null ? '' : value.product.productName) + '</td>'
			+ '<td data-column="subProductdName" class="width150 textLeftAlign">' + (value.subProductName == null ? '' : value.subProductName) + '</td>'
			+ '<td data-column="productBarCode" class="width150 textLeftAlign">' + (value.productBarCode == null ? '' : value.productBarCode) + '</td>'
			+ '<td data-column="type" class="width100 textLeftAlign">' + (value.type == null ? '' : value.type) + '</td>'
			+ '<td data-column="materialType" class="width100 textLeftAlign">' + (value.materialType == null ? '' : value.materialType) + '</td>'
			+ '<td data-column="barcodeType" class="width100">' + (value.barcodeType == null ? '' : value.barcodeType) + '</td>'
			+ '<td data-column="createdBy" class="width100">' + (value.createdBy == null ? '' : value.createdBy) + '</td>'
			+ '<td data-column="dateTime" class="width150">' + (value.dateTimeModified == null ? '' : value.dateTimeModified) + '</td>'
			+ '<td data-column="subProductId" style="display:none;">' + (value.subProductId == null ? '' : value.subProductId) + '</td>'
			+ '<td data-column="dateTimeCreationd" style="display:none;">' + (value.dateTimeCreation == null ? '' : value.dateTimeCreation) + '</td></tr>';
		$("#" + tableId).append(row);
		sequenceNumber++;
	});
}


window.addSubProduct = addSubProduct;
function addSubProduct() {

	var productId = $('#productnameinput').val() ?? "";
	var type = $('#typeinput').val() ?? "";
	var subProductName = $('#subproductnameinput').val() ?? "";
	var productBarCode = $('#productbarcodeinput').val() ?? "";
	var materialType = $('#materialtypeinput').val() ?? "";
	var barcodeType = $('#barcodetypeinput').val() ?? "";
	var createdBy = sessionStorage.getItem('employeeId');
	var status = "1";

	if (!showMandatory(['#subproductnameinput', '#productbarcodeinput', '#materialtypeinput', '#barcodetypeinput', '#productnameinput', '#typeinput'])) {

		showErrorResponse("responseContainer", "Add these mandatory fields");
		return;// Stop execution
	}
	else {

		var formData = {
			product: {
				productId: productId
			},
			subProductName: subProductName,
			productBarCode: productBarCode,
			type: type,
			materialType: materialType,
			type: type,
			barcodeType: barcodeType,
			status: status,
			createdBy: createdBy
		}

		console.log(formData);

		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/insertSubProductMaster',
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

window.editSubProduct = editSubProduct;
function editSubProduct() {

	var subProductName = $('#subproductnameinput').val() ?? "";
	var productBarCode = $('#productbarcodeinput').val() ?? "";
	var materialType = $('#materialtypeinput').val() ?? "";
	var barcodeType = $('#barcodetypeinput').val() ?? "";
	var createdBy = sessionStorage.getItem('employeeId');
	var status = "1";

	if (!showMandatory(['#subproductnameinput', '#productbarcodeinput', '#materialtypeinput', '#barcodetypeinput'])) {

		showErrorResponse("responseContainer", "Add these mandatory fields");

		return;// Stop execution
	}
	else {

		var formData = {
			subProductId: subProductId,
			subProductName: subProductName,
			productBarCode: productBarCode,
			type: type,
			materialType: materialType,
			barcodeType: barcodeType,
			status: status,
			createdBy: createdBy,
			dateTimeCreation: dateTimeCreation
		}

		console.log(formData);
		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/editSubProductMaster',
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

window.deleteSubProduct = deleteSubProduct;
function deleteSubProduct() {

	if (deleteAllList.length >= 1) {

		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/delete/deleteAllSubProductMaster',
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