
$(document).on('click', '#instrumentMaster', function() {

	$("#offcanvasCloseButton").click();
	$("#masterHeading").text("INSTRUMENT MASTER")

	$("#tableContainer").empty();
	$("#pagerContainer").empty();
	makePagerBody("pagerContainer");


	var headerList = ["S. No.", "Inspection Method", "Instrument Name", "Instrument Control No", "Calibration Frequency", "Last Calibration Date", "Calibration Due Date", "Created By", "Date & Time"];
	var searchList = ["searchInspectionMethod", "searchInstrumentName", "searchInstrumentControlNo", "searchCalibrationFrequency",  "searchLastCalibrationDate", "searchCalibrationDueDate","searchCreatedBy", ""];
	var placeholderList = ["Inspection Method", "Instrument Name", "Control No. ", "Calibration Frequency", "Last Calibration Date", "Calibration Due Date","Created By"];
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

window.loadLikeInstrumentData = loadLikeInstrumentData;
function loadLikeInstrumentData(page, pageSize) {
	// f part is for form
	var instrumentNamef = $('#searchInstrumentName').val() ?? "";
	var instrumentControlNof = $('#searchInstrumentControlNo').val() ?? "";
	var calibrationFrequencyf = $('#searchCalibrationFrequency').val() ?? "";
	var lastcalibrationDatef = $('#searchLastCalibrationDate').val() ?? "";
	var calibrationDueDatef = $('#searchCalibrationDueDate').val() ?? "";
	var inspectionMethodf = $('#searchInspectionMethod').val() ?? "";
	var createdfBy = $('#searchCreatedBy').val() ?? "";

	var formData = {
		instrumentName: instrumentNamef,
		instrumentControlNo: instrumentControlNof,
		calibrationFrequency: calibrationFrequencyf,
		calibrationDate: lastcalibrationDatef,
		calibrationDue:calibrationDueDatef,
		inspectionMethod: inspectionMethodf,
		createdBy: createdfBy
	}
console.log("loading done");
	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getLikeInstrumentMaster/' + page + '/' + pageSize,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {
			console.log(res, page);
			makePagerByTotalPages(res, page);
			insertInstrumentInTable(res.content, "table1");
		},
		error: function(response) {

		}
	});
}

/*-------------------------------- For visibility on frontend ---------------------*/
/*window.insertInstrumentInTable = insertInstrumentInTable;
function insertInstrumentInTable($item, tableId) {
	$("#" + tableId + "Body").empty();

	var sequenceNumber = getSequenceNumber();

	$.each($item, function(index, value) {
		 will use data-column="instrumentNamed"  in edit for getting data from roof table
		var row = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId" class="width50">' + (sequenceNumber + 1) + '</td>'
			+ '<td data-column="inspectionMethod" class="width100">' + (value.inspectionMethod == null ? '' : value.inspectionMethod) + '</td>'
			+ '<td data-column="instrumentNamed" class="width125">' + (value.instrumentName == null ? '' : value.instrumentName) + '</td>'
			+ '<td data-column="instrumentControlNo" class="width100 textLeftAlign">' + (value.instrumentControlNo == null ? '' : value.instrumentControlNo) + '</td>'
			+ '<td data-column="calibrationFrequency" class="width100 textLeftAlign">' + (value.calibrationFrequency == null ? '' : value.calibrationFrequency) + '</td>'
			+ '<td data-column="calibrationDate" class="width100">' + (value.calibrationDate == null ? '' : value.calibrationDate) + '</td>'
			+ '<td data-column="calibrationDue" class="width100">' + (value.calibrationDue == null ? '' : value.calibrationDue) + '</td>'
			+ '<td data-column="createdBy" class="width50">' + (value.createdBy == null ? '' : value.createdBy) + '</td>'
			+ '<td data-column="dateTime" class="width150">' + (value.dateTime == null ? '' : value.dateTime) + '</td>'
			+ '<td data-column="instrumentId" style="display:none;">' + (value.instrumentId == null ? '' : value.instrumentId) +'</td></tr>';
		$("#" + tableId).append(row);
		sequenceNumber++;
	});
}
*/
window.insertInstrumentInTable = insertInstrumentInTable;
async function insertInstrumentInTable($item, tableId) {
    $("#" + tableId + "Body").empty();

    var sequenceNumber = getSequenceNumber();

    // ⏳ fetch server date once before looping
    const today = await getServerCurrentDate();

    $.each($item, function(index, value) {
        let calibrationDue = value.calibrationDue;
        let rowStyle = "";
        let calibrationDueStyle = "";

        if (calibrationDue) {
            let dueDate = new Date(calibrationDue);
            if (dueDate < today) {
                // row only gets background
                rowStyle = 'style="background-color:#f8d7da;"';
                // calibrationDue text gets red color
                calibrationDueStyle = 'style="color:#721c24; font-weight:bold;"';
            }
        }

        var row = '<tr class="tableDataRows" ' + rowStyle + ' title="Double click to select the row.">'
            + '<td data-column="columnId" class="width50">' + (sequenceNumber + 1) + '</td>'
            + '<td data-column="inspectionMethod" class="width100">' + (value.inspectionMethod ?? '') + '</td>'
            + '<td data-column="instrumentNamed" class="width125">' + (value.instrumentName ?? '') + '</td>'
            + '<td data-column="instrumentControlNo" class="width100 textLeftAlign">' + (value.instrumentControlNo ?? '') + '</td>'
            + '<td data-column="calibrationFrequency" class="width100 textLeftAlign">' + (value.calibrationFrequency ?? '') + '</td>'
            + '<td data-column="calibrationDate" class="width100">' + (value.calibrationDate ?? '') + '</td>'
            + '<td data-column="calibrationDue" class="width100" ' + calibrationDueStyle + '>' + (value.calibrationDue ?? '') + '</td>'
            + '<td data-column="createdBy" class="width50">' + (value.createdBy ?? '') + '</td>'
            + '<td data-column="dateTime" class="width150">' + (value.dateTime ?? '') + '</td>'
            + '<td data-column="instrumentId" style="display:none;">' + (value.instrumentId ?? '') + '</td></tr>';

        $("#" + tableId).append(row);
        sequenceNumber++;
    });
}

// Fetch server date before running your calibration check
async function getServerCurrentDate() { // checking date from CurrentDateTimeController

    const response = await fetch("/WebApplication/Controllers/server-date", {
        method: "GET",
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch server date: " + response.status);
    }

    const serverDateStr = await response.text();  // e.g., "2025-08-22"
	// console.log("serverDateStr", serverDateStr);
    return new Date(serverDateStr); // JS Date object
}

window.InstrumentMasterInputs = InstrumentMasterInputs;
function InstrumentMasterInputs(modalBodyId) {

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
	const instrumentNameAttr = ["id", "instrumentNameInput", "type", "text", "name", "instrumentName", "class", "inputs m1 textInput", "placeholder", "Instrument Name...", "maxlength", "50"];
	const instrumentControlNoAttr = ["id", "instrumentControlNoInput", "type", "text", "name", "instrumentControlNo", "class", "inputs m1 textInput", "placeholder", "Instrument Control No...", "maxlength", "50"];
	const calibrationFrequencyAttr = ["id", "calibrationFrequencyInput", "type", "number", "name", "calibrationFrequency", "class", "inputs m1 textInput", "placeholder", "Calibration Frequency...", "maxlength", "50"];
	const calibrationDateAttr = ["id", "calibrationDateInput", "type", "date", "name", "calibrationDate", "class", "inputs m1 textInput", "placeholder", "Calibration Date...", "maxlength", "50"];
	const inspectionMethodAttr = ["id", "inspectionMethodInput", "type", "text", "name", "inspectionMethod", "class", "inputs m1 textInput", "placeholder", "Inspection Method...", "maxlength", "50"];

	// Call helper function to create inputs with labels
	createInput(inspectionMethodAttr, container1, "Inspection Method");
	createInput(instrumentNameAttr, container2, "Instrument Name");
	createInput(instrumentControlNoAttr, container3, "Instrument Control No");
	createInput(calibrationFrequencyAttr, container4, "Calibration Frequency(Months)");
	createInput(calibrationDateAttr, container5, "Last Calibration Date");

}

function calculateCalibrationDue(calibrationDate, calibrationFrequency) {
    if (!calibrationDate || isNaN(calibrationFrequency)) {
        return "";
    }

    // Convert to ISO format for parsing
    const dateObj = new Date(calibrationDate.replace(" ", "T"));

    // Add months
    dateObj.setMonth(dateObj.getMonth() + parseInt(calibrationFrequency));

    // Subtract 1 day
    dateObj.setDate(dateObj.getDate() - 1); // → reduces by 1 day.

    // Format YYYY-MM-DD only
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
	
/*    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;*/

	  return `${year}-${month}-${day}`;
}


window.addInstrument = addInstrument;
function addInstrument() {

	const instrumentName = $('#instrumentNameInput').val()?.trim() ?? "";
	const instrumentControlNo = $('#instrumentControlNoInput').val()?.trim() ?? "";
	const calibrationFrequency = $('#calibrationFrequencyInput').val()?.trim() ?? "";	
	const calibrationDateRaw = $('#calibrationDateInput').val()?.trim() ?? "";
	const calibrationDate = calibrationDateRaw || "";
	const inspectionMethod = $('#inspectionMethodInput').val()?.trim() ?? "";
	const createdBy = sessionStorage.getItem('employeeId');
	const calibrationDue = calculateCalibrationDue(calibrationDate, calibrationFrequency);
	
	// Define mandatory fields based on inspection method
	let mandatoryFields = [
	    '#instrumentNameInput',
	    '#inspectionMethodInput'
	];

	if (inspectionMethod.toUpperCase() !== "VISUAL" && inspectionMethod.toUpperCase() !== "CALENDAR" && inspectionMethod.toUpperCase() !== "CAVITY") { 
	    // Only add these check if not VISUAL method and not CALENDAR METHOD or NOT CAVITY METHOD
	    mandatoryFields.push('#calibrationFrequencyInput','#instrumentControlNoInput', '#calibrationDateInput');
	}

	// Run the check
	if (!showMandatory(mandatoryFields)) {
	    showErrorResponse("responseContainer", "Add these mandatory fields");
	    return; // Stop execution
	}
	else {
		const formData = {
		  instrumentName: instrumentName,
		  instrumentControlNo: instrumentControlNo,
		  calibrationFrequency: calibrationFrequency,
		  calibrationDate: calibrationDate,
		  calibrationDue: calibrationDue, // <-- new field
		  inspectionMethod: inspectionMethod,
		  createdBy: createdBy
		};

		console.log(formData);

		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/insertInstrumentMaster',
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
			// $('#addEditDeleteCloseButton').trigger('click');
			$('#addEditDeleteBackdropButton').trigger('click');
		}, 1000);
	}
}


window.editInstrument = editInstrument;
function editInstrument() {

	const instrumentName = $('#instrumentNameInput').val()?.trim() ?? "";
	const instrumentControlNo = $('#instrumentControlNoInput').val()?.trim() ?? "";
	const calibrationFrequency = $('#calibrationFrequencyInput').val()?.trim() ?? "";	
	const calibrationDateRaw = $('#calibrationDateInput').val()?.trim() ?? "";
	const calibrationDate = calibrationDateRaw || "";
	const inspectionMethod = $('#inspectionMethodInput').val()?.trim() ?? "";
	const createdBy = sessionStorage.getItem('employeeId');
	const status = "1";
	const calibrationDue = calculateCalibrationDue(calibrationDate, calibrationFrequency)?? "";
	

	// Define mandatory fields based on inspection method
	let mandatoryFields = [
	    '#instrumentNameInput',
	    '#inspectionMethodInput'
	];

	if (inspectionMethod.toUpperCase() !== "VISUAL" && inspectionMethod.toUpperCase() !== "CALENDAR" && inspectionMethod.toUpperCase() !== "CAVITY") { 
	    // Only add these check if not VISUAL method and not CALENDAR METHOD or NOT CAVITY METHOD
	    mandatoryFields.push('#calibrationFrequencyInput','#instrumentControlNoInput', '#calibrationDateInput');
	}

	// Run the check
	if (!showMandatory(mandatoryFields)) {
	    showErrorResponse("responseContainer", "Add these mandatory fields");
	    return; // Stop execution
	}
	else {

		const formData = {
		  instrumentId: instrumentId,
		  instrumentName: instrumentName,
		  instrumentControlNo: instrumentControlNo,
		  calibrationFrequency: calibrationFrequency,
		  calibrationDate: calibrationDate,
		  calibrationDue: calibrationDue, // <-- new field
		  inspectionMethod: inspectionMethod,
		  status: status,
		  createdBy: createdBy
		};

		console.log(formData);
		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/editInstrumentMaster',
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
			$('#addEditDeleteBackdropButton').trigger('click');
		}, 1000);
	}
}

window.deleteInstrument = deleteInstrument;
function deleteInstrument() {

	if (deleteAllList.length >= 1) {


		console.log("del", deleteAllList);

		$('#delete').off('click').on('click', function() {

			$.ajax({
				type: 'post',
				url: '/WebApplication/Controllers/delete/deleteAllInstrumentMaster',
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