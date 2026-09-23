
$(document).on('click', '#materialMaster', function() {

	$("#offcanvasCloseButton").click();
	$("#masterHeading").text("MATERIAL MASTER")

	$("#tableContainer").empty();
	$("#pagerContainer").empty();
	makePagerBody("pagerContainer");


	var headerList = ["S. No.", "Plant Code", "Part No", "Part Description", "UOM", "Material Group", "Created By", "Date & Time"];
	var searchList = ["searchPlantCode", "searchMaterial", "searchMaterialDescription", "searchUOM", "searchMaterialGroup", "searchCreatedBy", ""];
	var placeholderList = ["Plant Code", "Part No. ", "Part Description", "UOM", "Material Group", "Created By"];
	makeTable(headerList, placeholderList, searchList, "tableContainer", "table1", "100%");

	handlePageChange(0);

	// Example Usage
	configureButtons({
		add: "show",
		edit: "show",
		delete: "show",
		template: "show",
		data: "show",
		upload: "show",
		pdfUpload: "hide",
		userDetails: "show"
	});

	getIdByMasterName($(this).attr('id'));
});


window.loadLikeMaterialData = loadLikeMaterialData;
function loadLikeMaterialData(page, pageSize) {
	// f part is for form
	var plantCodef = $('#searchPlantCode').val() ?? "";
	var material = $('#searchMaterial').val() ?? "";
	var materialDescription = $('#searchMaterialDescription').val() ?? "";
	var uom = $('#searchUOM').val() ?? "";
	var materialGroup = $('#searchMaterialGroup').val() ?? "";
	var createdfBy = $('#searchCreatedBy').val() ?? "";
	
	var formData = {
		plant: {
			plantCode: plantCodef,
		},
		material: material,
		materialDescription: materialDescription,
		uom: uom,
		materialGroup: materialGroup,
		createdBy: createdfBy
	}
	console.log(formData);
	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getLikeMaterial/' + page + '/' + pageSize,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {

			makePagerByTotalPages(res, page);
			insertMaterialMasterInTable(res.content, "table1"); 
		},
		error: function(response) {


		}
	});
}

/*-------------------------------- For visibility on frontend ---------------------*/
window.insertMaterialMasterInTable = insertMaterialMasterInTable;
function insertMaterialMasterInTable($item, tableId) {
	$("#" + tableId + "Body").empty();

	var sequenceNumber = getSequenceNumber();

	$.each($item, function(index, value) {
		var row = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId" class="width50">' + (sequenceNumber + 1) + '</td>'
			+ '<td data-column="plantCode" class="width50 textLeftAlign">' + (value.plant == null ? '' : value.plant.plantCode) + '</td>'
			+ '<td data-column="material" class="width125">' + (value.material  == null ? '' : value.material ) + '</td>'			
			+ '<td data-column="materialDescription" class="width250 textLeftAlign">' + (value.materialDescription == null ? '' : value.materialDescription) + '</td>'
			+ '<td data-column="uom" class="width100">' + (value.uom == null ? '' : value.uom) + '</td>'
			+ '<td data-column="materialGroup" class="width100">' + (value.materialGroup == null ? '' : value.materialGroup) + '</td>'
			+ '<td data-column="createdBy" class="width50">' + (value.createdBy == null ? '' : value.createdBy) + '</td>'
			+ '<td data-column="dateTime" class="width150">' + (value.dateTime == null ? '' : value.dateTime) + '</td>'
			+ '<td data-column="materialId" style="display:none;">' + (value.materialId  == null ? '' : value.materialId ) +'</td></tr>';
		$("#" + tableId).append(row);
		sequenceNumber++;
	});
}

window.materialMasterInputs = materialMasterInputs;
function materialMasterInputs(modalBodyId) {

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
	var plantCodeAttr = ["id", "plantcodeinput", "class", "inputs m1 selectInput"];

	createSelectList(plantCodeAttr, container1, "Plant Code");
	insertOptionById("plantcodeinput", "Select");
	
	
	// Call helper function to create inputs with labels
	const materialAttr = ["id", "materialInput", "type", "text", "name", "material", "class", "inputs m1 textInput", "placeholder", "Part No...", "maxlength", "50"];
	createInput(materialAttr, container2, "Part No");
	
	const materialDescriptionAttr = ["id", "materialDescriptionInput", "type", "text", "name", "materialDescription", "class", "inputs m1 textInput", "placeholder", "Part Description...", "maxlength", "50"];
	createInput(materialDescriptionAttr, container3, "Part Description");
	
	
	const uomAttr = ["id", "uomInput", "type", "text", "name", "uom", "class", "inputs m1 textInput", "placeholder", "UOM...", "maxlength", "50"];
	createInput(uomAttr, container4, "UOM");
	
	
	const materialGroupAttr = ["id", "materialGroupInput", "type", "text", "name", "materialGroup", "class", "inputs m1 textInput", "placeholder", "Material Group...", "maxlength", "50"];
	createInput(materialGroupAttr, container5, "Material Group");
	
	
	getAllPlantsInList("plantcodeinput");

}


window.addMaterial = addMaterial;
function addMaterial() {

	const plantCode = $('#plantcodeinput').val()?.trim() ?? "";
	const material = $('#materialInput').val()?.trim() ?? "";
	const materialDescription = $('#materialDescriptionInput').val()?.trim() ?? "";
	const uom = $('#uomInput').val()?.trim() ?? "";
	const materialGroup = $('#materialGroupInput').val()?.trim() ?? "";
	const createdBy = sessionStorage.getItem('employeeId');

	if (!showMandatory(['#plantcodeinput', '#materialInput', '#materialDescriptionInput', '#uomInput', '#materialGroupInput'])) {

		showErrorResponse("responseContainer", "Add these mandatory fields");
		return;// Stop execution
	}
	else {
		const formData = {
		  plant: {
				plantId: plantCode
		  },
		  material: material,
		  materialDescription: materialDescription,
		  uom: uom,
		  materialGroup: materialGroup,
		  createdBy: createdBy
		};

		console.log(formData);

		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/insertMaterialMaster',
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


window.editMaterial = editMaterial;
function editMaterial() {

	const plantId = $('#plantcodeinput').val()?.trim() ?? "";
	const material = $('#materialInput').val()?.trim() ?? "";
	const materialDescription = $('#materialDescriptionInput').val()?.trim() ?? "";
	const uom = $('#uomInput').val()?.trim() ?? "";
	const materialGroup = $('#materialGroupInput').val()?.trim() ?? "";
	const createdBy = sessionStorage.getItem('employeeId');
	var status = "1";

	if (!showMandatory(['#plantcodeinput', '#materialInput', '#materialDescriptionInput', '#uomInput', '#materialGroupInput'])) {

		showErrorResponse("responseContainer", "Add these mandatory fields");
		return;// Stop execution
	}
	else {

		const formData = {
			materialId: materialId,
			plant: {
				plantId: plantId
			},
			material: material,
			materialDescription: materialDescription,
			uom: uom,
			materialGroup: materialGroup, 
			createdBy: createdBy,
			status: status,
		}

		console.log(formData);
		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/editMaterialMaster',
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

window.deleteMaterial = deleteMaterial;
function deleteMaterial() {

	if (deleteAllList.length >= 1) {


		console.log("del", deleteAllList);

		$('#delete').off('click').on('click', function() {

			$.ajax({
				type: 'post',
				url: '/WebApplication/Controllers/delete/deleteMaterialMaster',
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

		$("#warningInformationModalBody").text("Please select row from table to delete plant.");
		$("#warningBackdropButton").click();
	}

}











/*-----------------------------------------Material Master---------------------------------------------*/
// done in it's ajax controller
window.uploadMaterialDetails = uploadMaterialDetails;
function uploadMaterialDetails() {

	let form_data = new FormData();
	let excelFile = $("#uploadExcel")[0].files;

	if (excelFile.length > 0) {
		form_data.append('file', excelFile[0]);


		document.querySelector("#uploadImage").setAttribute("src", "/WebApplication/images/processing.gif");
		$("#upload").attr("style", "display:none");
		$("#uploadExcel").attr("style", "display:none");
		$("#uploadCloseButton").attr("style", "background: transparent; height: 30px; width: 30px; border: 0px; display:none;");
		$("#uploadWaiting").removeAttr("style");
		$("#uploadWaiting").text("Please wait......");
		$("#myProgress").removeAttr("style");

		document.querySelector("#uploadImage").setAttribute("src", "/WebApplication/images/processing.gif");
		$("#upload").attr("style", "display:none");
		$("#uploadExcel").attr("style", "display:none");
		$("#uploadCloseButton").attr("style", "background: transparent; height: 30px; width: 30px; border: 0px; display:none;");
		$("#uploadWaiting").removeAttr("style");

		$.ajax({   // code is // written in RQCPMasterAjaxController   -> then it calls excelUploadHelper
			url: '/WebApplication/Controllers/uploadmaterial/' + sessionStorage.getItem('employeeId') + '',
			type: 'POST',
			data: form_data,
			headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
			contentType: false,
			/*	async: false,*/
			processData: false,
			success: function(response) {

				if (response.statusCodeValue == 404) {
					document.querySelector("#uploadImage").setAttribute("src", "/WebApplication/images/error.png");
					$("#uploadCloseButton").css("display", "flex");
					$("#uploadWaiting").text(response.body);
					loadDataAndPager();
					clearInterval(interval);
					var elem = document.getElementById("myBar");
					elem.style.width = "1%";
				} else {

					convertErrorListToCsV(response); // written in master common js
					document.querySelector("#uploadImage").setAttribute("src", "/WebApplication/images/success.png");
					$("#uploadCloseButton").css("display", "flex");
					$("#uploadWaiting").text(response.body.message);
					loadDataAndPager();
				}
				/*clearInterval(interval);
				clearInterval(totalRowInterval);*/
				var elem = document.getElementById("myBar");
				elem.style.width = "1%";
				$("#myProgress").attr("style", "display:none;");
			},
			error: function(response) {
				document.querySelector("#uploadImage").setAttribute("src", "/WebApplication/images/error.png");
				$("#uploadCloseButton").css("display", "flex");
				$("#uploadWaiting").text(response.responseText);
				loadDataAndPager();
				/*clearInterval(interval);
				clearInterval(totalRowInterval);*/
				var elem = document.getElementById("myBar");
				elem.style.width = "1%";
				$("#myProgress").attr("style", "display:none;");
			}
		});
	} else {
		alert("Please select excel.");
	}

	// totalRowInterval = setInterval(getTotalRows, 1000); //getDowloadTotalRows() in master commonjs
	// let totalRowInterval; in master common js
}
