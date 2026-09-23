
$(document).on('click', '#samplingPlanMaster', function() {

	$("#offcanvasCloseButton").click();
	$("#masterHeading").text("SAMPLING PLAN MASTER")

	$("#tableContainer").empty();
	$("#pagerContainer").empty();
	makePagerBody("pagerContainer");


	var headerList = ["S. No.", "Lot Size (e.g. 1 to 100)", "Inspection Letter", "Sample Size", "Acc.", "Rej.", "Remarks", "Created By", "Date & Time"];
	var searchList = ["searchLotSize", "searchInspectionLetter", "searchSampleSize",  "searchAcc", "searchRej", "searchRemarks", "searchCreatedBy", ""];
	var placeholderList = ["Lot Size", "Inspection Letter", "Sample Size", "Acc.", "Rej.", "Remarks", "Created By"];
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

window.loadLikeSamplingPlanData = loadLikeSamplingPlanData;
function loadLikeSamplingPlanData(page, pageSize) {
	// f part is for form
	var lotSizef = $('#searchLotSize').val() ?? "";
	var inspectionLetterf = $('#searchInspectionLetter').val() ?? "";
	var sampleSizef = $('#searchSampleSize').val() ?? "";
	var accf = $('#searchAcc').val() ?? "";
	var rejf = $('#searchRej').val() ?? "";
	var remarksf = $('#searchRemarks').val() ?? "";
	var createdfBy = $('#searchCreatedBy').val() ?? "";

	var formData = {
		lotSize: lotSizef,
		inspectionLetter: inspectionLetterf,
		sampleSize: sampleSizef,
		acc: accf,
		rej: rejf,
		remarks: remarksf,
		createdBy: createdfBy
	}

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getLikeSamplingPlanMaster/' + page + '/' + pageSize,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {

			makePagerByTotalPages(res, page);
			insertSamplingPlanInTable(res.content, "table1");
		},
		error: function(response) {


		}
	});
}

/*-------------------------------- For visibility on frontend ---------------------*/
window.insertSamplingPlanInTable = insertSamplingPlanInTable;
function insertSamplingPlanInTable($item, tableId) {
	$("#" + tableId + "Body").empty();

	var sequenceNumber = getSequenceNumber();

	$.each($item, function(index, value) {
		/* will use data-column="instrumentNamed"  in edit for getting data from roof table*/
		var row = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId" class="width50">' + (sequenceNumber + 1) + '</td>'
			+ '<td data-column="lotSize" class="width125">' + (value.lotSize == null ? '' : value.lotSize) + '</td>'
			+ '<td data-column="inspectionLetter" class="width100 textLeftAlign">' + (value.inspectionLetter == null ? '' : value.inspectionLetter) + '</td>'
			+ '<td data-column="sampleSize" class="width100 textLeftAlign">' + (value.sampleSize == null ? '' : value.sampleSize) + '</td>'
			+ '<td data-column="acc" class="width100">' + (value.acc == null ? '' : value.acc) + '</td>'
			+ '<td data-column="rej" class="width100">' + (value.rej == null ? '' : value.rej) + '</td>'
			+ '<td data-column="remarks" class="width100">' + (value.remarks == null ? '' : value.remarks) + '</td>'
			+ '<td data-column="createdBy" class="width50">' + (value.createdBy == null ? '' : value.createdBy) + '</td>'
			+ '<td data-column="dateTime" class="width150">' + (value.dateTime == null ? '' : value.dateTime) + '</td>'
			+ '<td data-column="samplingPlanId" style="display:none;">' + (value.samplingPlanId == null ? '' : value.samplingPlanId) +'</td></tr>';
		$("#" + tableId).append(row);
		sequenceNumber++;
	});
}


window.SamplingPlanMasterInputs = SamplingPlanMasterInputs;
function SamplingPlanMasterInputs(modalBodyId) {

	// Clear existing content
	$("#" + modalBodyId).empty();

	// Create containers
	var container1 = document.createElement("div");
	var container2 = document.createElement("div");
	var container3 = document.createElement("div");
	var container4 = document.createElement("div");
	var container5 = document.createElement("div");
	var container6 = document.createElement("div");

	// Set class attributes
	container1.setAttribute("class", "dataContainer smallContainer mt-1");
	container2.setAttribute("class", "dataContainer smallContainer mt-1");
	container3.setAttribute("class", "dataContainer smallContainer mt-1");
	container4.setAttribute("class", "dataContainer smallContainer mt-1");
	container5.setAttribute("class", "dataContainer smallContainer mt-1");
	container6.setAttribute("class", "dataContainer smallContainer mt-1");
	
	// Append to modal body
	$("#" + modalBodyId).append(container1, container2, container3, container4, container5, container6);

	// Define attributes and create inputs
	const lotSizeAttr = ["id", "lotSizeInput", "type", "text", "name", "lotSize", "class", "inputs m1 textInput", "placeholder", "Lot Size Format: A to B(e.g. 1 to 100)...", "maxlength", "50"];
	const inspectionLetterAttr = ["id", "inspectionLetterInput", "type", "text", "name", "inspectionLetter", "class", "inputs m1 textInput", "placeholder", "Inspection Letter...", "maxlength", "50"];
	const sampleSizeAttr = ["id", "sampleSizeInput", "type", "text", "name", "sampleSize", "class", "inputs m1 textInput", "placeholder", "Sample Size...", "maxlength", "50"];
	const accAttr = ["id", "accInput", "type", "text", "name", "acc", "class", "inputs m1 textInput", "placeholder", "Acc...", "maxlength", "50"];
	const rejAttr = ["id", "rejInput", "type", "text", "name", "rej", "class", "inputs m1 textInput", "placeholder", "Rej...", "maxlength", "50"];
	const remarksAttr = ["id", "remarksInput", "type", "text", "name", "remarks", "class", "inputs m1 textInput", "placeholder", "Remarks...", "maxlength", "50"];

	// Call helper function to create inputs with labels
	createInput(lotSizeAttr, container1, "Lot Size (e.g. 1 to 100)");
	createInput(inspectionLetterAttr, container2, "Inspection Letter");
	createInput(sampleSizeAttr, container3, "Sample Size");
	createInput(accAttr, container4, "Acc");
	createInput(rejAttr, container5, "Rej");
	createInput(remarksAttr, container6, "Remarks");
}

window.addSamplingPlan = addSamplingPlan;
function addSamplingPlan() {

	const lotSize = ($('#lotSizeInput').val()?.trim() ?? "").toLowerCase();
	const inspectionLetter = $('#inspectionLetterInput').val()?.trim() ?? "";
	const sampleSize = $('#sampleSizeInput').val()?.trim() ?? "";	
	const acc = $('#accInput').val()?.trim() ?? "";
	const rej = $('#rejInput').val()?.trim() ?? "";
	const remarks = $('#remarksInput').val()?.trim() ?? "";
	const createdBy = sessionStorage.getItem('employeeId');

	// 1.. No spaces around "to"
	if (/^\d+to\d+$/i.test(lotSize) || /^\d+\s+to\d+$/.test(lotSize) || /^\d+to\s+\d+$/.test(lotSize)) { // it rejects "1to100" (no spaces) 
	    showErrorResponse("responseContainer", "Lot Size must have spaces around 'to' (e.g. 1 to 100)");
	    return;
	}// Reject if "to" does not have a space before AND after
	

	// 2. Non-numeric values   "abc to 100" (not digits), "1 to abc" (not digits),  "to 100" (missing first number)
	const parts = lotSize.toLowerCase().split(" to ");
	if (parts.length === 2) {
	    if (isNaN(parts[0]) || isNaN(parts[1])) {
	        showErrorResponse("responseContainer", "Lot Size must contain only numbers around 'to' (e.g. 1 to 100)");
	        return;
	    }
	} else {
	    showErrorResponse("responseContainer", "Lot Size must be in format: number to number (e.g. 1 to 100)");
	    return;
	}
	
	// 3. Word mismatch (must be exactly "to")
	if (!lotSize.toLowerCase().includes(" to ")) {   //it rejects "1 upto 100" (word mismatch)
	    showErrorResponse("responseContainer", "Lot Size must include the word ' to ' (e.g. 1 to 100)");
	    return;
	}

	if (!/^\d+\s+to\s+\d+$/i.test(lotSize)) { // all mix check
	    showErrorResponse("responseContainer", "Lot Size must be in format: A to B (e.g. 1 to 100)");
	    return;
	}	// it rejects "1to100" (no spaces) ,   "1 upto 100" (word mismatch),  "abc to 100" (not digits), 
	//  "1 to abc" (not digits), "to 100" (missing first number)


	if (!showMandatory(['#lotSizeInput', '#inspectionLetterInput', '#sampleSizeInput', '#accInput', '#rejInput'])) {

		showErrorResponse("responseContainer", "Add these mandatory fields");
		return;// Stop execution
	}
	else {
		const formData = {
		  lotSize: lotSize,
		  inspectionLetter: inspectionLetter,
		  sampleSize: sampleSize,
		  acc: acc,
		  rej: rej,
		  remarks: remarks,
		  createdBy: createdBy
		};

		console.log(formData);

		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/insertSamplingPlanMaster',
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


window.editSamplingPlan = editSamplingPlan;
function editSamplingPlan() {
	
	const lotSize = ($('#lotSizeInput').val()?.trim() ?? "").toLowerCase();
	const inspectionLetter = $('#inspectionLetterInput').val()?.trim() ?? "";
	const sampleSize = $('#sampleSizeInput').val()?.trim() ?? "";	
	const acc = $('#accInput').val()?.trim() ?? "";
	const rej = $('#rejInput').val()?.trim() ?? "";
	const remarks = $('#remarksInput').val()?.trim() ?? "";
	const createdBy = sessionStorage.getItem('employeeId');
	const status = "1";
	
	// 1.. No spaces around "to"
	if (/^\d+to\d+$/i.test(lotSize) || /^\d+\s+to\d+$/.test(lotSize) || /^\d+to\s+\d+$/.test(lotSize)) { // it rejects "1to100" (no spaces) 
	    showErrorResponse("responseContainer", "Lot Size must have spaces around 'to' (e.g. 1 to 100)");
	    return;
	}// Reject if "to" does not have a space before AND after

	// 2. Word mismatch (must be exactly "to")
	if (!lotSize.toLowerCase().includes(" to ")) {   //it rejects "1 upto 100" (word mismatch)
	    showErrorResponse("responseContainer", "Lot Size must include the word ' to ' (e.g. 1 to 100)");
	    return;
	}
	
	// 3. Non-numeric values   "abc to 100" (not digits), "1 to abc" (not digits),  "to 100" (missing first number)
	const parts = lotSize.toLowerCase().split(" to ");
	if (parts.length === 2) {
	    if (isNaN(parts[0]) || isNaN(parts[1])) {
	        showErrorResponse("responseContainer", "Lot Size must contain only numbers around 'to' (e.g. 1 to 100)");
	        return;
	    }
	} else {
	    showErrorResponse("responseContainer", "Lot Size must be in format: number to number (e.g. 1 to 100)");
	    return;
	}
	
	if (!/^\d+\s+to\s+\d+$/i.test(lotSize)) { // all mix check
	    showErrorResponse("responseContainer", "Lot Size must be in format: A to B (e.g. 1 to 100)");
	    return;
	}	// it rejects "1to100" (no spaces) ,   "1 upto 100" (word mismatch),  "abc to 100" (not digits), 
	//  "1 to abc" (not digits), "to 100" (missing first number)
	
	if (!showMandatory(['#lotSizeInput', '#inspectionLetterInput', '#sampleSizeInput', '#accInput', '#rejInput'])) {

		showErrorResponse("responseContainer", "Add these mandatory fields");
		return;// Stop execution
	}
	else {

		const formData = {
		  samplingPlanId:samplingPlanId,
		  lotSize: lotSize,
		  inspectionLetter: inspectionLetter,
		  sampleSize: sampleSize,
		  acc: acc,
		  rej: rej,
		  remarks: remarks,
		  status: status,
		  createdBy: createdBy
		};
		console.log(formData);
		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/editSamplingPlanMaster',
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

window.deleteSamplingPlan = deleteSamplingPlan;
function deleteSamplingPlan() {

	if (deleteAllList.length >= 1) {


		console.log("del", deleteAllList);

		$('#delete').off('click').on('click', function() {

			$.ajax({
				type: 'post',
				url: '/WebApplication/Controllers/delete/deleteAllSamplingPlanMaster',
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