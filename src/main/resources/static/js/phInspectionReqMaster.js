
$(document).on('click', '#phInspectionReqMaster', function() {

	
	$(".fromToDiv").css("display", "none");
	
	$("#offcanvasCloseButton").click();
	$("#masterHeading").text("PH INSPECTION  MASTER")

	$("#tableContainer").empty();
	$("#pagerContainer").empty();
	makePagerBody("pagerContainer");


	var headerList = ["S. No.", "Line", "Station", "Sheet", "Inspection Requirment", "Part or  Process", "Param No","Sop Date Required","Sop Val Type","Created By", "Creation Date", "Modified Date"];
	var searchList = ["searchLine", "searchStation", "searchSheet", "searchInspection", "searchPartProcess","","","", "searchCreatedBy", "", ""];
	var placeholderList = ["Line", "Station", "Sheet.", "Inspection", "Part or Process","","","", "Created By" ];
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

window.loadLikePhInspectionReqMasterData = loadLikePhInspectionReqMasterData;
function loadLikePhInspectionReqMasterData(page, pageSize) {

	var line = $('#searchLine').val() ?? "";
	var station = $('#searchStation').val() ?? "";
	var sheet = $('#searchSheet').val() ?? "";
	var inspection = $('#searchInspection').val() ?? "";
	var partProcess = $('#searchPartProcess').val().trim();
	var createdBy = $('#searchCreatedBy').val() ?? "";


	var formData = {
		line:line,
		station:station,
		sheet:sheet,
		inspection:inspection,
		partProcess:partProcess,
		createdBy: createdBy
	}
//	console.log(formData);

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getLikePhInspectionReqMasterData/' + page + '/' + pageSize,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {
	     console.log(res);
			makePagerByTotalPages(res, page);
			insertPhInspectionReqMasterInTable(res.content, "table1");
		},
		error: function(response) {


		}
	});
}

window.phInspectionReqMasterInputs = phInspectionReqMasterInputs;
function phInspectionReqMasterInputs(modalBodyId) {

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

	container46.setAttribute("class", "dataContainer smallContainer mt-1");
	container47.setAttribute("class", "dataContainer smallContainer mt-1");
	container48.setAttribute("class", "dataContainer smallContainer mt-1");
	container49.setAttribute("class", "dataContainer smallContainer mt-1");
	container50.setAttribute("class", "dataContainer smallContainer mt-1");
	container51.setAttribute("class", "dataContainer smallContainer mt-1");
	container52.setAttribute("class", "dataContainer  mt-1");
	container53.setAttribute("class", "dataContainer  mt-1");
	container54.setAttribute("class", "dataContainer  mt-1");


	//-- sheet Detail:- sheetId, fieldName, cellNo, fieldType, fieldMandatory
	$("#" + modalBodyId).append(container46, container47, container48, container49, container50,container51,container52,container53,container54);

	var lineAttr = ["id", "lineinput", "class", "inputs m1 selectInput"];
	createSelectList(lineAttr, container46, "Line");
	insertOptionById("lineinput", "Select");
	
	var stationAttr = ["id", "stationinput", "class", "inputs m1 selectInput"];
		createSelectList(stationAttr, container47, "Station");
		insertOptionById("stationinput", "Select");
		$("#stationinput").prop("disabled", true);
		
	var sheetAttr = ["id", "sheetinput", "class", "inputs m1 selectInput"];
		createSelectList(sheetAttr, container48, "Sheet");
		insertOptionById("sheetinput", "Select");	
		$("#sheetinput").prop("disabled", true);
		

	var paramNoAttr = ["id", "paramNoinput", "type", "text", "name", "paramNo", "class", "inputs m1 textInput", "placeholder", "Param No...", "maxlength", "50"];
	 createInput(paramNoAttr, container49, "Param No: ");
	 
	 var sopDateReqAttr = ["id", "sopDateReqinput", "class", "inputs m1 selectInput"];
	 	createSelectList(sopDateReqAttr, container50, "Sop Date Required");
	 	insertOptionById("sopDateReqinput", "Select");
	 	insertOptionById("sopDateReqinput", "Yes");
	 	insertOptionById("sopDateReqinput", "No");
		
	var sopValTypeAttr = ["id", "sopValTypeinput", "class", "inputs m1 selectInput"];
	 	createSelectList(sopValTypeAttr, container51, "Sop Val Type");
	 	insertOptionById("sopValTypeinput", "Select");
	 	insertOptionById("sopValTypeinput", "text");
	 	insertOptionById("sopValTypeinput", "yesno");	
		

	var inspectionReqAttr = ["id", "inspectionReqinput", "type", "text", "name", "inspectionReq", "class", "inputs m1 textInput", "placeholder", "Inspection Req..."];
	 createInput(inspectionReqAttr, container52, "Inspection Requirement:");
	 
    var partOrProcessAttr = ["id", "partOrProcessinput", "type", "text", "name", "partOrProcess", "class", "inputs m1 textInput", "placeholder", "Part Or Process..."];
 	 createInput(partOrProcessAttr, container53, "Part Or Process:");


	 getAllLinesInListforPhInspection("lineinput").then(() => {
	         $("#lineinput").on("change", function () {
	             const lineId = $(this).val();
	             $("#stationinput").empty().append('<option>Select</option>').prop("disabled", !lineId);
	             $("#sheetinput").empty().append('<option>Select</option>').prop("disabled", true);

	             if (lineId) {
	                 getStationsByLine(lineId, "stationinput");
	             }
	         });

	         $("#stationinput").on("change", function () {
	             const lineId = $("#lineinput").val();
	             const stationId = $(this).val();
	             $("#sheetinput").empty().append('<option>Select</option>').prop("disabled", !stationId);

	             if (lineId && stationId) {
	                 getSheetsByLineAndStation(lineId, stationId, "sheetinput");
	             }
	         });
	     });
}


/*-------------------------------- For visibility on frontend ---------------------*/
window.insertPhInspectionReqMasterInTable = insertPhInspectionReqMasterInTable;
function insertPhInspectionReqMasterInTable($item, tableId) {
	$("#" + tableId + "Body").empty();

	var sequenceNumber = getSequenceNumber();

	$.each($item, function(index, value) {
// these data-column="sheetIdd" is used in .edit in masterCommon.js for getting access
		var row = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId" class="width50">' + (sequenceNumber + 1) + '</td>'
			+ '<td data-column="lineId" class="width20 textLeftAlign">' + (value?.lineStationSheetMapping?.line?.lineName == null ? '' : value?.lineStationSheetMapping?.line?.lineName) + '</td>'
			+ '<td data-column="stationId" class="width250 textLeftAlign">' + (value?.lineStationSheetMapping?.station?.name == null ? '' :value?.lineStationSheetMapping?.station?.name ) + '</td>'
			+ '<td data-column="sheetId" class="width30 textLeftAlign">' + (value?.lineStationSheetMapping?.sheet?.sheetType == null ? '' : value?.lineStationSheetMapping?.sheet?.sheetType) + '</td>'
			+ '<td data-column="inspectionReq" class="width200 textLeftAlign">' + (value?.inspectionRequirement == null ? '' : value?.inspectionRequirement) + '</td>'
			+ '<td data-column="partOrProcess" class="width300 textLeftAlign">' + (value?.partOrProcess == null ? '' : value?.partOrProcess) + '</td>'
			+ '<td data-column="paramNo" class="width40 textLeftAlign">' + (value?.paramNo == null ? '' : value?.paramNo) + '</td>'
			+ '<td data-column="sopDateRequired" class="width40 textLeftAlign">' + (value?.sopDateRequired == null ? '' : value?.sopDateRequired) + '</td>'
			+ '<td data-column="sopValType" class="width30 textLeftAlign">' + (value?.sopValType == null ? '' : value?.sopValType) + '</td>'
			+ '<td data-column="createdByd" class="width100">' + (value.createdBy == null ? '' : value.createdBy) + '</td>'
			+ '<td data-column="dateTimeCreationd" class="width100">' + (value?.createdAt == null ? '' : value?.createdAt) + '</td>'
			+ '<td data-column="dateTimeModifiedd" class="width100">' + (value.dateTimeModified == null ? '' : value.dateTimeModified) + '</td>'
			+ '<td data-column="lineId" style="display:none;">' + (value?.lineStationSheetMapping?.line?.lineId== null ? '' : value?.lineStationSheetMapping?.line?.lineId) + '</td>'
			+ '<td data-column="stationId" style="display:none;">' + (value?.lineStationSheetMapping?.station?.id == null ? '' : value?.lineStationSheetMapping?.station?.id) + '</td>'
			+ '<td data-column="sheetId" style="display:none;">' + (value?.lineStationSheetMapping?.sheet?.id ==null? '' : value?.lineStationSheetMapping?.sheet?.id) + '</td>'
			+ '<td data-column="phInspectionReqId" style="display:none;">' + (value.id == null ? '' : value.id) + '</td></tr>';
			
		$("#" + tableId).append(row);
		sequenceNumber++;
	});
}


window.addPhInspectionReqMaster = addPhInspectionReqMaster;
function addPhInspectionReqMaster() {
	var line = $('#lineinput').val() ?? "";
	var station = $('#stationinput').val() ?? "";
	var sheet = $('#sheetinput').val() ?? "";
	var paramNo = $('#paramNoinput').val() ?? "";
	var sopDateReq = $('#sopDateReqinput').val() ?? "";
	var sopValType = $('#sopValTypeinput').val() ??"";
	var inspectionReq = $('#inspectionReqinput').val()??"";
	var partOrProcess = $('#partOrProcessinput').val()??"";
	var createdBy = sessionStorage.getItem('employeeId');

	
	if (!showMandatory(['#lineinput', '#stationinput', '#sheetinput', '#paramNoinput', '#sopDateReqinput','#sopValTypeinput','#inspectionReqinput','#partOrProcessinput'])) {
		showErrorResponse("responseContainer", "Add these mandatory fields");
		return;// Stop execution
	}
	else {

		var formData = {
			line:line,
			station: station,
			sheet: sheet,
			paramNo: paramNo,
			sopDateReq: sopDateReq,
			sopValType:sopValType,
			inspectionReq:inspectionReq,
			partOrProcess:partOrProcess,
			createdBy: createdBy
		}
	
		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/insertPhInspectionReqMaster',
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

window.editPhInspectionReqMaster = editPhInspectionReqMaster;
function editPhInspectionReqMaster() {

	var line = $('#lineinput').val() ?? "";
	var station = $('#stationinput').val() ?? "";
	var sheet = $('#sheetinput').val() ?? "";
	var paramNo = $('#paramNoinput').val() ?? "";
	var sopDateReq = $('#sopDateReqinput').val() ?? "";
	var sopValType = $('#sopValTypeinput').val() ??"";
	var inspectionReq = $('#inspectionReqinput').val()??"";
	var partOrProcess = $('#partOrProcessinput').val()??"";
	var createdBy = sessionStorage.getItem('employeeId');


	if (!showMandatory(['#lineinput', '#stationinput', '#sheetinput', '#paramNoinput', '#sopDateReqinput','#sopValTypeinput','#inspectionReqinput','#partOrProcessinput'])) {
			showErrorResponse("responseContainer", "Add these mandatory fields");
			return;// Stop execution
		}
	else {
	
		var formData = {
				id:phInspectionReqId,
				line:line,
				station: station,
				sheet: sheet,
				paramNo: paramNo,
				sopDateReq: sopDateReq,
				sopValType:sopValType,
				inspectionReq:inspectionReq,
				partOrProcess:partOrProcess,
				createdBy: createdBy
			}

		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/editPhInspectionReqMaster',
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

window.deletePhInspectionReqMaster = deletePhInspectionReqMaster;
function deletePhInspectionReqMaster() { 

	if (deleteAllList.length >= 1) {

		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/delete/deletePhInspectionReqMaster',
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