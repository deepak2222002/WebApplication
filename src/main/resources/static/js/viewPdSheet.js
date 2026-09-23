let currentMachineId = null; // Declare globally
var storedDetails;
var specList;
var selectedDate;
// Global variables used across your app
window.lineStationSheetMappingId = injectedLineStationSheetMappingId;// getting from the set value in the html, which set up in WebPageController
window.lineName = injectedLineName;// getting from the set value in the html, which set up in WebPageController
window.stationName = injectedStationName;// getting from the set value in the html, which set up in WebPageController
window.sheetName = injectedSheetName;
window.sheetTabNo = injectedSheetTabNo;
window.resumeMode = resumeModeInjected;

$(document).ready(function() {
	storedDetails = JSON.parse(sessionStorage.getItem('details'));
	setCountInList("countList");
	$("#countList").val(storedDetails.countNo);
	loadPdSheetUpperFormBody(lineStationSheetMappingId);
	createPdSheetMiddleFormBody();
	fillPdSheetByDateTimeAndCount(lineStationSheetMappingId);
	makeGraphOfPdSheet();
});



$(document).on("change", "#countList", function() {
	var selectedPage = parseInt($(this).val());

	storedDetails.countNo = selectedPage;
	loadPdSheetUpperFormBody(lineStationSheetMappingId);
	createPdSheetMiddleFormBody();
	fillPdSheetByDateTimeAndCount(lineStationSheetMappingId);
	makeGraphOfPdSheet();
});


$(document).on('click', '.approve', function() {

	$("#upper_pd_approval_form_body").empty();
	var recordId = $(this).data("id");
	showModal("detailBackdropButton");
	var headerHtml = $("#upper_processDataSheet_form_body").html();

	$("#upper_pd_approval_form_body").html(headerHtml);

	selectedDate = $(this).attr("id");
	$("#approvePdDetails").show();
	$("#approvePdDetails").attr("data-id", recordId);
	$(".validationDates").removeClass("d-none");

	appendApproveValueInForm();

});


$(document).on('click', '#detailCloseButton', function() {

	$(".validationDates").addClass("d-none");

});

$(document).on('click', '.approvedData', function() {

	$("#upper_pd_approval_form_body").empty();
	var recordId = $(this).data("id");
	showModal("detailBackdropButton");
	var headerHtml = $("#upper_processDataSheet_form_body").html();

	$("#upper_pd_approval_form_body").html(headerHtml);

	selectedDate = $(this).attr("id");
	$("#approvePdDetails").hide();
	appendApproveValueInForm();

});


$(document).on('input', '.valueInput', function(e) {

	e.stopImmediatePropagation();
	const name = $(this).attr('name');
	const value = $(this).val();
	$('[name="' + name + '"]').not(this).val(value);

});


function appendApproveValueInForm() {

	$('input[name="selectedProduction"]').prop('checked', false);

	const list = ["SOP N 3", "ALB N 2", "EOP N 2"];
	const signList = ["SOP", "ALB", "EOP"];
	const list2 = ["sop-input-", "alb-input-", "eop-input-"];

	const colSpanMap = {
		"SOP N 3": 3,
		"ALB N 2": 2,
		"EOP N 2": 2,
		"SOP": 1,
		"ALB": 1,
		"EOP": 1,
	};

	const date = selectedDate.slice(-2);
	$("#selectedDate").text("DATE : " + " " + date);

	for (var i = 0; i < list.length; i++) {
		for (var j = 0; j < colSpanMap[list[i]]; j++) {
			$("#" + list2[i] + (j + 1)).val($("#" + removeSpaces(list[i]) + (j + 1) + date).text());

			validateInputRange($("#" + list2[i] + (j + 1)));

			const imagePath = $("#" + removeSpaces(signList[i]) + "1" + date).text();
			if (imagePath != "") {
				var innerHTML = '<img src="/WebApplication/Controllers/image/sign/sign_' + imagePath +
					'.png" alt="Image" style="max-height:80px; max-width:100%;">';


				$("#" + signList[i] + "-sign-" + (j + 1)).html(innerHTML);
				$("#" + list2[i] + (j + 1)).attr("disabled", "disabled");
				$("#" + list2[i] + "radio").attr("disabled", "disabled");
				$("#" + signList[i].toLowerCase() + "Status").text("Approved");
				$("#" + signList[i].toLowerCase() + "Status").removeClass().addClass("badge bg-success");
				$("#supervisorSign" + signList[i]).text(imagePath);

			} else {
				$("#" + signList[i] + "-sign-" + (j + 1)).html("");
				$("#supervisorSign" + signList[i]).text("");
				$("#" + list2[i] + (j + 1)).removeAttr("disabled", "disabled");
				$("#" + list2[i] + "radio").removeAttr("disabled", "disabled");
				$("#" + signList[i].toLowerCase() + "Status").text("Pending");
				$("#" + signList[i].toLowerCase() + "Status").removeClass().addClass("badge bg-warning");
			}

		}
	}

}


$(document).on('click', '#approvePdDetails', function() {

	var recordId = $(this).attr("data-id");  // get the ID stored in data-id

	const selectedValue = $('input[name="selectedProduction"]:checked').val();

	var formData = {};

	var OTP = $('#otp-input-1').val() ?? "";

	if (OTP == "") {
		alert("Please enter OTP.");
		return false;
	}


	if ($('#supervisorSignSOP').text() == "" && selectedValue == "alb") {

		alert("Please first approve SOP.");
		return false;

	} else if ($('#supervisorSignALB').text() == "" && selectedValue == "eop") {

		if ($('#supervisorSignSOP').text() == "") {
			alert("Please first approve SOP.");
			return false;
		} else {
			const date = selectedDate.slice(-2);
			//$("#selectedDate").text("DATE : " + " " + date);
			if ($("#ALBN21" + date).text() != "" || $("#ALBN22" + date).text() != "") {
				alert("Please first approve ALB.");
				return false;
			}
		}
	}


	if (selectedValue == "sop") {

		formData = {
			id: recordId,
			sop1: $('#sop-input-1').val() ?? "",
			sop2: $('#sop-input-2').val() ?? "",
			sop3: $('#sop-input-3').val() ?? "",
			alb1: $('#alb-input-1').val() ?? "",
			alb2: $('#alb-input-2').val() ?? "",
			eop1: $('#eop-input-1').val() ?? "",
			eop2: $('#eop-input-2').val() ?? "",
			validUpTo: $('input[name="validUpto"]').val(),
			countNo: OTP,
			supervisorSignSop: sessionStorage.getItem('employeeId'),
			lineStationSheetMapping: {
				id: lineStationSheetMappingId
			}
		}

	} else if (selectedValue == "alb") {

		formData = {
			id: recordId,
			sop1: $('#sop-input-1').val() ?? "",
			sop2: $('#sop-input-2').val() ?? "",
			sop3: $('#sop-input-3').val() ?? "",
			alb1: $('#alb-input-1').val() ?? "",
			alb2: $('#alb-input-2').val() ?? "",
			eop1: $('#eop-input-1').val() ?? "",
			eop2: $('#eop-input-2').val() ?? "",
			validUpTo: $('input[name="validUpto"]').val(),
			countNo: OTP,
			supervisorSignSop: $('#supervisorSignSOP').text(),
			supervisorSignAlb: sessionStorage.getItem('employeeId'),
			lineStationSheetMapping: {
				id: lineStationSheetMappingId
			}
		}

	} else if (selectedValue == "eop") {

		formData = {
			id: recordId,
			sop1: $('#sop-input-1').val() ?? "",
			sop2: $('#sop-input-2').val() ?? "",
			sop3: $('#sop-input-3').val() ?? "",
			alb1: $('#alb-input-1').val() ?? "",
			alb2: $('#alb-input-2').val() ?? "",
			eop1: $('#eop-input-1').val() ?? "",
			eop2: $('#eop-input-2').val() ?? "",
			validUpTo: $('input[name="validUpto"]').val(),
			countNo: OTP,
			supervisorSignSop: $('#supervisorSignSOP').text(),
			supervisorSignAlb: $('#supervisorSignALB').text(),
			supervisorSignEop: sessionStorage.getItem('employeeId'),
			supervisorSign: sessionStorage.getItem('employeeId'),
			lineStationSheetMapping: {
				id: lineStationSheetMappingId
			}
		}

	} else {

		alert("Please select a timeline to approve value ");
		return false;

	}

	console.log(formData)

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/pd/approvePdDataBySupervisor',
		data: JSON.stringify(formData),
		async: false,
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {

			alert(response);
			refreshPage();
			appendApproveValueInForm();

		},
		error: function(response) {

			alert(response.responseText);

		}
	});

});



$(document).on('click', '.editColumns', function() {

	const buttonId = $(this).attr("id");

	const list = ["SOP N 3", "ALB N 2", "EOP N 2"];

	const colSpanMap = {
		"SOP N 3": 3,
		"ALB N 2": 2,
		"EOP N 2": 2,
	};

	const inputAttr = {
		"SOP N 3": ["id", "SOPN3", "type", "text", "name", "SOPN3", "class", "inputs m1 textInput"],

		"ALB N 2": ["id", "ALBN2", "type", "text", "name", "ALBN2", "class", "inputs m1 textInput"],

		"EOP N 2": ["id", "EOPN2", "type", "text", "name", "EOPN2", "class", "inputs m1 textInput"],

	}

	const date = buttonId.slice(-2);

	for (var i = 0; i < list.length; i++) {

		for (var j = 0; j < colSpanMap[list[i]]; j++) {

			var container1 = document.createElement("div");

			var attr = inputAttr[list[i]];
			attr.push("value");
			attr.push($("#" + removeSpaces(list[i]) + (j + 1) + date).text());
			createInput(attr, container1, "");
			$("#" + removeSpaces(list[i]) + (j + 1) + date).text("");

			$("#" + removeSpaces(list[i]) + (j + 1) + date).append(container1);
		}
	}

});

/*
$(document).on('click', '#capture', function() {
	$("#dotPlotCanvas").css("width", "100%");

	var printContents = $('.processDataPrintArea').first().html(); // get first element’s HTML
	var originalContents = $('body').html();

	$('body').html(printContents);
	window.print();
	$('body').html(originalContents);
});
*/


/*$(document).on('click', '#capture', function() {
	$("#dotPlotCanvas").css("width", "100%");

	// Get the target div’s full HTML
	var printContents = document.querySelector('.processDataPrintArea').outerHTML;
	// Open new window
	var printWindow = window.open('', '', 'height=768,width=1366');
	// Write the content to the new window
	printWindow.document.write('<html><head><title>Print</title>');
	// Include Bootstrap CSS or your stylesheet (if required)
	printWindow.document.write('<link rel="stylesheet" href="/WebApplication/css/Importedcss/coreui.min.css">');
	printWindow.document.write('<link rel="stylesheet" href="/WebApplication/css/masterCommonCSS.css">');
	printWindow.document.write('</head><body class="bg-transparent border border-secondary">');
	printWindow.document.write(printContents);
	printWindow.document.write('</body></html>');

	// Finish writing and wait for resources to load
	printWindow.document.close();

	// Wait a bit for images/canvas to render before printing
	printWindow.onload = function() {
		printWindow.focus();
		printWindow.print();
		printWindow.close();
	};
});*/


$(document).on('click', '#capture', function() {
	$("#dotPlotCanvas").css("width", "100%");

	// Convert canvas to image
	var canvas = document.getElementById('dotPlotCanvas');
	var imgData = canvas.toDataURL('image/png');

	// Clone print area
	var printArea = document.querySelector('.processDataPrintArea').cloneNode(true);

	// Replace canvas with image
	var canvasInPrint = printArea.querySelector('#dotPlotCanvas');
	if (canvasInPrint) {
		var img = document.createElement('img');
		img.src = imgData;
		img.style.width = '100%';
		canvasInPrint.parentNode.replaceChild(img, canvasInPrint);
	}

	// Open print window
	var printWindow = window.open('', '', 'height=768,width=1366');
	printWindow.document.write('<html><head><title>Print</title>');

	// Include your stylesheets
	printWindow.document.write('<link rel="stylesheet" href="/WebApplication/css/Importedcss/coreui.min.css">');
	printWindow.document.write('<link rel="stylesheet" href="/WebApplication/css/masterCommonCSS.css">');
	printWindow.document.write('<link rel="stylesheet" href="/WebApplication/css/viewPdSheet.css">');
	// ✅ Add print-specific CSS
	printWindow.document.write('<style>');
	printWindow.document.write('@page { size: landscape; margin: 5px; }'); // Landscape & margins
	printWindow.document.write('body { -webkit-print-color-adjust: exact; }'); // For colors
	printWindow.document.write('</style>');

	printWindow.document.write('</head><body class="bg-transparent border border-secondary">');
	printWindow.document.write(printArea.outerHTML);
	printWindow.document.write('</body></html>');

	printWindow.document.close();

	printWindow.onload = function() {
		printWindow.focus();
		printWindow.print();
		printWindow.close();
	};
});


function loadPdSheetUpperFormBody(lineStationSheetMappingId) {
	$("#upper_processDataSheet_form_body").empty();

	const formData = {
		model: storedDetails.model,
		variant: storedDetails.variant,
		shift: storedDetails.shift,
		filledNo: storedDetails.filledNo,
		createdAt: storedDetails.dateTime + " 00:00:00," + getLastDateOfMonth(storedDetails.dateTime) + " 23:59:59",
		countNo: storedDetails.countNo,
		lineStationSheetMapping: {
			id: lineStationSheetMappingId
		}
	}

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/pd/getAllHeaderDataOfPDSheetByCount',
		data: JSON.stringify(formData),
		async: false,
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {

			appendUppedFormBodyData(response);

		},
		error: function(response) {

			appendEmptyUpperFormBody();

		}
	});
}

function numberSpecsHighlight(specification) {
	// ✅ Extract range from SPEC like "2 ~ 4.0 Kgf.cm"
	let minValue = null, maxValue = null;
	if (specification) {
		const match = specification.match(/([\d.]+)\s*~\s*([\d.]+)/);
		if (match) {
			minValue = parseFloat(match[1]);
			maxValue = parseFloat(match[2]);
			console.log("Parsed SPEC Range:", minValue, "to", maxValue);
		}
	}



	// ✅ Attach event listeners to all SOP, ALB, EOP inputs
	/*	$("#sop-input-1, #sop-input-2, #sop-input-3, #alb-input-1, #alb-input-2, #eop-input-1, #eop-input-2")
			.on("input", function() {
				validateInputRange(this);
			});*/
}


$(document).on('input', '.pdsInput', function(e) {

	validateInputRange(this);

});

// ✅ Function to validate and color input boxes
function validateInputRange(input) {


	let minValue = null, maxValue = null;
	if (specList.length > 0) {

		if (specList.length == 1) {
			minValue = 0;
			maxValue = specList[0];
		} else {
			minValue = specList[0];
			maxValue = specList[1];
		}

		minValue = parseFloat(minValue);
		maxValue = parseFloat(maxValue);

	}

	const val = parseFloat($(input).val());
	if (isNaN(val)) {
		$(input).css("border", "1px solid #ccc"); // reset default
		return;
	}

	if (minValue !== null && maxValue !== null) {
		if (val >= minValue && val <= maxValue) {
			$(input).css("border", "2px solid green");
		} else {
			$(input).css("border", "2px solid red");
		}
	}
}


function fillPdSheetByDateTimeAndCount(lineStationSheetMappingId) {


	const formData = {
		model: storedDetails.model,
		variant: storedDetails.variant,
		shift: storedDetails.shift,
		filledNo: storedDetails.filledNo,
		createdAt: storedDetails.dateTime + " 00:00:00," + getLastDateOfMonth(storedDetails.dateTime) + " 23:59:59",
		countNo: storedDetails.countNo,
		lineStationSheetMapping: {
			id: lineStationSheetMappingId
		}
	}

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/pd/getAllDataOfPDSheetByCount',
		data: JSON.stringify(formData),
		async: false,
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			setDataInTable(response);

		},
		error: function(response) {


		}
	});

}


function refreshPage() {

	loadPdSheetUpperFormBody(lineStationSheetMappingId);
	fillPdSheetByDateTimeAndCount(lineStationSheetMappingId);
	makeGraphOfPdSheet();

}

function appendEmptyUpperFormBody() {

	const html = `<table>
						<!-- First big row -->
						<tr class="tableDataRows">
							<td class="tall textLeftAlign width150 py-1"><img
									src="/WebApplication/Controllers/image/excelCommonImage/jns.png" alt="Image"
									style="max-height:80px; max-width:100%;"></td>
							<td class="tall fw-bold" rowspan="2" colspan="4" style="font-size: 20px;">PROCESS DATA SHEET</td>
							<td class="tall fw-bold">MEASURING INSTRUMENT </br> USED</td>
							<td class="tall width50 fw-bold">CONTROL NO</td>
							<td class="tall width50 fw-bold">VAL UP TO</td>
							<td class="tall width50 fw-bold">Document No. </td>
							<td class="tall width50 fw-bold">Rev. No.</td>
							<td class="tall width50 fw-bold">Effective date </td>

						</tr>

						<!-- Second row (small legend row) -->
						<tr class="tableDataRows">
							<td class="tall textLeftAlign width150 fw-bold">MONTH / YEAR :-</td>
							<td class="tall width100"</td>
							<td class="tall width100"></td>
							<td class="tall width100"></td>
							<td class="tall width100"></td>
							<td class="tall width100"></td>
							<td class="tall width100"></td>
						</tr>

						<!-- First big row -->
						<tr class="tableDataRows">
							<td class="tall textLeftAlign width150 fw-bold">PRODUCT & MODEL NAME</td>
							<td class="tall textLeftAlign" colspan="2"> Meter Assy  Comb</td>
							<td class="tall" colspan="2"></td>
							<td class="tall" colspan="6" rowspan="7"><img
									 id="machineImage" src="" alt="Reference" class="img-fluid" 
									style="height:100px; width:50%;"></td>
						</tr>


						<!-- First big row -->
						<tr class="tableDataRows">
							<td class="tall textLeftAlign width150 fw-bold">PRODUCT PART NO</td>
							<td class="tall textLeftAlign" colspan="4"></td>
						</tr>

						<tr class="tableDataRows">
							<td class="tall textLeftAlign width150 fw-bold">PROCESS NAME</td>
							<td class="tall textLeftAlign" colspan="4"></td>
						</tr>

						<tr class="tableDataRows">
							<td class="tall textLeftAlign width150 fw-bold">CHECK POINT</td>
							<td class="tall textLeftAlign" colspan="4"></td>
						</tr>

						<tr class="tableDataRows">
							<td class="tall textLeftAlign width150 fw-bold">SPECIFICATION</td>
							<td class="tall textLeftAlign" colspan="4"></td>
						</tr>

						<tr class="tableDataRows">
							<td class="tall textLeftAlign width150 fw-bold">LINE NO. / JIG NUMBER</td>
							<td class="tall textLeftAlign"></td>
							<td class="tall textLeftAlign fw-bold">SHIFT</td>
							<td class="tall textLeftAlign">A</td>
						</tr>
					</table>`;


	$("#upper_processDataSheet_form_body").html(html);


}

function appendUppedFormBodyData(list) {


	var daysDifference = getDaysFromToday(list[0][5] || '');
	var classList;

	if (daysDifference < 5) {
		classList = "border border-3 border-danger rounded-3 blink-border";
	}

	const html = `<table style="width:100%;" cellspacing="0px" class="table-hover overflow-hidden">
						<!-- First big row -->
						<tr class="tableDataRows">
							<td class="tall textLeftAlign width150 py-1"><img
									src="/WebApplication/Controllers/image/excelCommonImage/jns.png" alt="Image"
									style="max-height:80px; max-width:100%;"></td>
							<td class="tall fw-bold" rowspan="2" colspan="4" style="font-size: 20px;">PROCESS DATA SHEET</td>
							<td class="tall fw-bold">MEASURING INSTRUMENT </br> USED</td>
							<td class="tall width50 fw-bold">CONTROL NO</td>
							<td class="tall width50 fw-bold">VAL UP TO</td>
							<td class="tall width50 fw-bold">Document No. </td>
							<td class="tall width50 fw-bold">Rev. No.</td>
							<td class="tall width50 fw-bold">Effective date </td>

						</tr>

						<!-- Second row (small legend row) -->
						<tr class="tableDataRows">
							<td class="tall textLeftAlign width150 fw-bold">MONTH / YEAR  :  ${formatMonthAndYearByDate(list[0][16] || '')}</td>
							<td class="tall width100">${list[0][9] || ''}</td>
							<td class="tall width100">${list[0][4] || ''}</td>
							<td class="tall width100 ${classList}">${list[0][5] || ''} 
								<div><input type="date" name="validUpto" id="validUpto" class="hiddenInput valueInput d-none validationDates" value="${list[0][5] || ''}"></div></td>
							<td class="tall width100">${list[0][11] || ''}</td>
							<td class="tall width100">${list[0][13] || ''}</td>
							<td class="tall width100">${list[0][12] || ''}</td>
						</tr>

						<!-- First big row -->
						<tr class="tableDataRows">
							<td class="tall textLeftAlign width150 fw-bold">PRODUCT & MODEL NAME</td>
							<td class="tall textLeftAlign" colspan="2"> Meter Assy  Comb</td>
							<td class="tall" colspan="2">${list[0][1] || ''}</td>
							<td class="tall" colspan="6" rowspan="7"><img
									 id="machineImage" src="" alt="Reference" class="img-fluid" 
									style="height:100px; width:50%;"></td>
						</tr>


						<!-- First big row -->
						<tr class="tableDataRows">
							<td class="tall textLeftAlign width150 fw-bold">PRODUCT PART NO</td>
							<td class="tall textLeftAlign" colspan="4">${list[0][2] || ''}</td>
						</tr>

						<tr class="tableDataRows">
							<td class="tall textLeftAlign width150 fw-bold">PROCESS NAME</td>
							<td class="tall textLeftAlign" colspan="4">${list[0][14] || ''}</td>
						</tr>

						<tr class="tableDataRows">
							<td class="tall textLeftAlign width150 fw-bold">CHECK POINT</td>
							<td class="tall textLeftAlign" colspan="4">${list[0][8] || ''}</td>
						</tr>

						<tr class="tableDataRows">
							<td class="tall textLeftAlign width150 fw-bold">SPECIFICATION</td>
							<td class="tall textLeftAlign" id="graphSpecs" colspan="4">${list[0][10] || ''}</td>
						</tr>

						<tr class="tableDataRows">
							<td class="tall textLeftAlign width150 fw-bold">LINE NO. / JIG NUMBER</td>
							<td class="tall textLeftAlign">${list[0][6] || ''}  /  ${list[0][7] || ''}</td>
							<td class="tall textLeftAlign fw-bold">SHIFT</td>
							<td class="tall textLeftAlign">${list[0][3] || ''}</td>
						</tr>
					</table>`;


	$("#upper_processDataSheet_form_body").html(html);


	if (list[0][15]) {
		const imageUrl = `/WebApplication/Controllers/pd/image/${list[0][15] || ''}`;
		$("#machineImage").attr("src", imageUrl);
	} else {
		$("#machineImage").attr("alt", "No image available");
	}
}

function getDaysFromToday(date) {
	if (date == '') {
		alert("Date not found");
		return
	}
	const today = new Date();
	const givenDate = new Date(date);

	const diffTime = givenDate - today;
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

	return diffDays; // Can be negative if the date is in the past
}


function formatMonthAndYearByDate(dateTimeString) {
	if (!dateTimeString) return '';
	const date = new Date(dateTimeString);

	// Format as dd-MM-yyyy HH:mm
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const year = date.getFullYear();

	let mon = getMonthName(month)

	return `${mon} - ${year}`;
}

function getMonthName(dateString) {
	const date = new Date(dateString);
	const monthNames = [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun",
		"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
	];
	return monthNames[date.getMonth()];
}




function setDataInTable(pdSheetList) {


	const variableList = ["sop", "operatorSign", "alb", "operatorSign", "eop", "operatorSign", "supervisorSign", "supervisorSignSop", "supervisorSignAlb", "supervisorSignEop"]; // heights of merged first cells
	const list = ["SOP N 3", "OP Sign 1", "ALB N 2", "OP Sign 2", "EOP N 2", "OP Sign 3", "Sp Sign", "SOP", "ALB", "EOP"];

	const colSpanMap = {
		"SOP N 3": 3,
		"OP Sign 1": 1,
		"ALB N 2": 2,
		"OP Sign 2": 2,
		"EOP N 2": 2,
		"OP Sign 3": 3,
		"Sp Sign": 1,
		"SOP": 1,
		"ALB": 1,
		"EOP": 1
	};
	var nextParameter = 0;

	for (var i = 0; i < pdSheetList.length; i++) {

		const date = getDayFromDateTime(pdSheetList[i].createdAt);

		for (var k = 0; k < list.length; k++) {

			for (var j = 0; j < colSpanMap[list[nextParameter]]; j++) {

				if (variableList[nextParameter] == "operatorSign") {

					$("#" + removeSpaces(list[nextParameter]) + "1" + date).text(pdSheetList[i][variableList[k] + (j + 1)]);

				} else if (variableList[nextParameter] == "supervisorSign") {
					if (pdSheetList[i][variableList[k]] != null) {
						var innerHTML = '<img src="/WebApplication/Controllers/image/sign/sign_' + pdSheetList[i][variableList[k]] +
							'.png" alt="Image" class="approvedData" style="max-height:80px; max-width:100%;" id = "SignImage' + date + '" data-id = " ' + pdSheetList[i].id + '">';

						$("#" + removeSpaces(list[nextParameter]) + "1" + date).html(innerHTML);
						$("#" + removeSpaces(list[nextParameter]) + "1" + date).html(innerHTML);
						$("#SpSign1" + date).show();
						$("#SpSignApprovebutton1" + date).hide();
					} else {

						$("#SpSign1" + date).show();
						$("#SpSignApprovebutton1" + date).show();
					}

					$("#SpSignApprovebutton1" + date).attr("data-id", pdSheetList[i].id);
					//$("#StatusEditbutton1" + date).attr("data-id", pdSheetList[i].id);
				} else if (variableList[nextParameter] == "supervisorSignSop" || variableList[nextParameter] == "supervisorSignAlb" || variableList[nextParameter] == "supervisorSignEop") {

					$("#" + removeSpaces(list[nextParameter]) + "1" + date).html(pdSheetList[i][variableList[k]]);

				}
				else {

					$("#" + removeSpaces(list[nextParameter]) + (j + 1) + date).text(pdSheetList[i][variableList[k] + (j + 1)]);

				}

			}
			nextParameter++;
		}

		nextParameter = 0;
	}
}


/*function makeDataset(label, xVals, yVals, color) {
	const data = xVals.map((x, i) => ({ x, y: yVals[i] }));
	return {
		label,
		data,
		backgroundColor: color,
		pointRadius: 4
	};
}*/


function makeDataset(label, xValues, yValues, minRange, maxRange) {
	/*const data = xValues.map((x, i) => ({
		x: x,
		y: yValues[i],
		backgroundColor:
			yValues[i] >= minRange && yValues[i] <= maxRange
				? 'green'
				: 'red'
	}));*/

	const data = xValues
		.map((x, i) => {
			const y = yValues[i];

			// Only return an object if both x and y are valid numbers
			if (x != null && y != null && x !== '' && y !== '') {
				return {
					x: x,
					y: y,
					backgroundColor:
						y >= minRange && y <= maxRange ? 'green' : 'red'
				};
			}
			return null; // filter out later
		})
		.filter(point => point !== null); // remove null entries

	return {
		label: label,
		data: data,
		pointRadius: 3,
		pointBackgroundColor: data.map(point => point.backgroundColor), // apply per point
		borderColor: 'transparent'
	};
}


function getLastDateOfMonth(dateString) {
	const date = new Date(dateString);
	const lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

	const year = lastDate.getFullYear();
	const month = String(lastDate.getMonth() + 1).padStart(2, '0');
	const day = String(lastDate.getDate()).padStart(2, '0');

	return `${year}-${month}-${day}`;
}

window.getDayFromDateTime = getDayFromDateTime;
function getDayFromDateTime(dateTimeStr) {
	const date = new Date(dateTimeStr.replace(" ", "T"));
	// getDate() returns 1–31, so pad with leading zero if needed
	return String(date.getDate()).padStart(2, "0");
}

let allCounts = [];


function createPdSheetMiddleFormBody() {

	$("#pdDataContainer").empty();

	var headerList = ["Date", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
	makeTable(headerList, [], [], "pdDataContainer", "pdDataTable", "100%");

	const colSpanList = [3, 1, 2, 1, 2, 1, 1, 1, 1, 1]; // heights of merged first cells
	const list = ["SOP N 3", "OP Sign 1", "ALB N 2", "OP Sign 2", "EOP N 2", "OP Sign 3", "Sp Sign", "SOP", "ALB", "EOP"];
	const totalRows = 14;                 // or compute as needed

	let spanIndex = 0;   // index in colSpanList
	let rowsLeft = colSpanList[spanIndex]; // remaining rows in current span
	let currentRow = 1;

	for (let i = 0; i < totalRows; i++) {
		const tr = document.createElement("tr");
		tr.className = "tableDataRows tall";

		// Add first cell only when starting a new rowspan group
		if (rowsLeft === colSpanList[spanIndex]) {
			const td = document.createElement("td");
			td.setAttribute("rowspan", rowsLeft);
			td.textContent = list[spanIndex]; // optional content
			tr.append(td);

		} else {

			for (let k = 0; k < 1; k++) {
				let td = document.createElement("td")
				td.setAttribute("style", "display: none;");
				tr.append(td);
			}

		}

		// Add the rest of the 31 columns
		for (let k = 0; k < 31; k++) {
			let td = document.createElement("td")
			let div = document.createElement("div")
			div.setAttribute("id", removeSpaces(list[spanIndex]) + currentRow + headerList[k + 1]);
			div.setAttribute("class", "text-primary");
			tr.append(td);
			td.append(div);

			if (i == 10) {
				td.setAttribute("class", "py-1");
				div.setAttribute("style", "width: 100%; height: 30px; display: none;");

				if (sessionStorage.getItem('role') == "SUPERVISOR" || sessionStorage.getItem('role') == "SUPER ADMIN") {

					let button = document.createElement("button");
					button.setAttribute("id", removeSpaces(list[spanIndex]) + "Approvebutton" + currentRow + headerList[k + 1]);
					button.setAttribute("style", "display: none;");
					button.setAttribute("class", "approve container");
					div.append(button)

				}

			}

			if (i > 10) {

				tr.className = "tableDataRows tall d-none";

			}

			/*			if (i == 10) {
							div.setAttribute("style", "width: 100%; height: 30px; display: none;");
							let button2 = document.createElement("button")
							button2.setAttribute("id", removeSpaces(list[spanIndex]) + "Editbutton" + currentRow + headerList[k + 1]);
							button2.setAttribute("style", "display: none;");
							button2.setAttribute("class", "editColumns container");
							div.append(button2)
						}*/

		}

		$("#pdDataTable").append(tr);

		// Decrease remaining count; move to next span when finished
		rowsLeft--;
		currentRow++;
		if (rowsLeft === 0 && spanIndex < colSpanList.length - 1) {
			spanIndex++;
			rowsLeft = colSpanList[spanIndex];
			currentRow = 1;
		}
	}
}

function createDotPlot(canvasId, tableList, options = {}) {

	$("#" + canvasId).empty();

	const ctx = document.getElementById(canvasId);

	// Destroy existing chart instance if already exists
	if (ctx.chartInstance) {
		ctx.chartInstance.destroy();
	}

	let minRange = 0;
	let maxRange = 0;

	if (specList.length == 1) {
		minRange = 0;
		maxRange = specList[0];
	} else {
		minRange = specList[0];
		maxRange = specList[1];
	}
	// Define your target range (you can pass these in `options`)


	const chart = new Chart(ctx, {
		type: 'scatter',
		data: {
			datasets: [
				makeDataset('SOP N 3', tableList[0], tableList[1], minRange, maxRange),
				makeDataset('SOP N 3', tableList[0], tableList[2], minRange, maxRange),
				makeDataset('SOP N 3', tableList[0], tableList[3], minRange, maxRange),
				makeDataset('ALB N 2', tableList[0], tableList[5], minRange, maxRange),
				makeDataset('ALB N 2', tableList[0], tableList[6], minRange, maxRange),
				makeDataset('EOP N 2', tableList[0], tableList[8], minRange, maxRange),
				makeDataset('EOP N 2', tableList[0], tableList[9], minRange, maxRange),
			]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: { display: false }
			},
			scales: {
				x: {
					beginAtZero: true,
					min: 0,
					max: 31,
					ticks: { stepSize: 1 }
				},
				y: {
					beginAtZero: true,
					min: options.min,
					max: options.max,
					ticks: { stepSize: 1 }
				}
			}
		}
	});

	ctx.chartInstance = chart;
	return chart;
}



function makeGraphOfPdSheet() {

	var table = document.getElementById("pdDataTable");
	var rows = table.rows;
	var data = [];

	for (var i = 1; i < rows.length; i++) { // Start from 1 to skip the header row
		var row = rows[i];
		var rowData = [];

		for (var j = 1; j < row.cells.length; j++) {
			rowData.push(row.cells[j].innerText);
		}
		data.push(rowData);
	}

	specList = $("#graphSpecs").text().match(/[\d.]+/g).map(Number);

	createDotPlot('dotPlotCanvas', data, {
		min: parseInt(specList[0] - 1),
		max: parseInt((specList[1] || specList[0]) + 1),
	});


}


function setCountInList(id) {

	for (var i = 0; i < storedDetails.countNo; i++) {

		var row = '<option value="' + (i + 1) + '">' + (i + 1) + '</option>';
		$('#' + id).append(row);
	}
}

function createInput(attr, containerId, heading) {

	var input = document.createElement("input");
	var Attr = attr;

	for (var i = 0; i <= Attr.length - 1; i = i + 2) {
		for (var j = 0; j <= i; j = j + 2) {
			input.setAttribute(Attr[i], Attr[j + 1]);
		}
	}

	input.setAttribute("autocomplete", "off");
	/*	// Create heading with the 'heading3' class
		var headingElement = document.createElement("span");
		headingElement.className = "heading3";
		headingElement.textContent = heading + ":";
	*/
	// Append heading and input to the container
	containerId.append(input);

}

