let currentMachineId = null; // Declare globally
var storedDetails;
var keysListByDate = {};


// Global variables used across your app
window.lineStationSheetMappingId = injectedLineStationSheetMappingId;// getting from the set value in the html, which set up in WebPageController
window.lineName = injectedLineName;// getting from the set value in the html, which set up in WebPageController
window.stationName = injectedStationName;// getting from the set value in the html, which set up in WebPageController
window.sheetName = injectedSheetName;
window.sheetTabNo = injectedSheetTabNo;
window.resumeMode = resumeModeInjected;


$(document).ready(function() {
	storedDetails = JSON.parse(sessionStorage.getItem('details'));
	getAllStationInList("stationList");
	$("#stationList").val(lineStationSheetMappingId);
	createIonizerSheetBody();
	loadIonizerSheetUpperFormBody(lineStationSheetMappingId, 1);
	createIonizerSheetFooter();
	getIonizerSheetBodyData();
});

$(document).on("change", "#stationList", function() {
	var selectedPage = parseInt($(this).val());
	lineStationSheetMappingId = selectedPage;
	createIonizerSheetBody();
	loadIonizerSheetUpperFormBody(lineStationSheetMappingId, 1);
	createIonizerSheetFooter();
	getIonizerSheetBodyData();
});

$(document).on('click', '#capture', function() {

	var printArea = document.querySelector('.ionizerCheckSheetPrintArea').cloneNode(true);

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




$(document).on('click', '.approves', function() {

	var batchId = $(this).data("id");
	$("#approveDetails").attr("data-id", batchId);
	appendApproveValueInForm();
	$(".hiddenTableData").addClass("d-none");
	$(".td" + batchId.slice(0, 2)).removeClass("d-none");
	$(".validationDates").removeClass("d-none");
	$(".input" + batchId.slice(0, 2)).removeClass("d-none");
	$(".td" + batchId.slice(0, 2)).attr("style", "min-width: 200px; max-width:200px;");
	$(".td" + batchId.slice(0, 2)).attr("colspan", "30");
	$(".statusRow").removeClass("tilt-text");
	$(".statusRow").removeClass("tilt-text2");
});



$(document).on('click', '#detailCloseButton', function() {

	$(".hiddenTableData").removeClass("d-none");
	$(".hiddenInput").addClass("d-none");
	$(".validationDates").addClass("d-none");
	$(".hiddenTableData").attr("style", "min-width: 25px; max-width:25px;");
	$(".hiddenTableData").removeAttr("colspan");
	$(".statusRow").addClass("tilt-text");

});

function renderInputField(vtype, passif, value1, value2, date, inputId) {
	/*    const baseName = `dataInput_${index}_${partIndex}`;
		const key = parts[partIndex].trim().toUpperCase(); // <-- exact key for this input (e.g., "SOP" or "ALB")*/

	if (vtype === "yesno") {
		return `
            <select name="${inputId}" class="hiddenInput selectInput d-none input${date} ms-auto"  
			 oninput="validateField(this, '${passif}', '${value1}', '${value2}')" >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
            </select>
        `;
	} else if (vtype === "number") {
		return `
            <input name="${inputId}" type="number" class="hiddenInput valueInput d-none input${date} ms-auto" oninput="validateField(this, '${passif}', '${value1}', '${value2}')" />
        `;
	} else if (vtype === "date") {
		return `
	        <input name="${inputId}" type="date" class="hiddenInput valueInput d-none input${date} ms-auto" oninput="validateField(this, '${passif}', '${value1}', '${value2}')" />
	    `;
	} else { // default: text
		return `
            <input name="${inputId}" type="text" class="hiddenInput valueInput d-none input${date} ms-auto" oninput="validateField(this, '${passif}', '${value1}', '${value2}')" />
        `;
	}
}


function validateField(input, passif, value1, value2) {
	let val = input.value.trim();
	let isValid = false;

	// If no validation rule, don't mark invalid
	if (!passif) {
		input.style.border = ""; // reset border
		return true;
	}

	if (passif === "Between") {
		let num = parseFloat(val);
		isValid = !isNaN(num) && num >= parseFloat(value1) && num <= parseFloat(value2);
	}
	else if (passif === "Not_between") {
		let num = parseFloat(val);
		isValid = !isNaN(num) && (num < parseFloat(value1) || num > parseFloat(value2));
	}
	else if (passif === "Equal") {
		isValid = val === value1;
	}
	else if (passif === "Greater_than") {
		let num = parseFloat(val);
		isValid = !isNaN(num) && num > parseFloat(value1);
	}
	else if (passif === "Less_than") {
		let num = parseFloat(val);
		isValid = !isNaN(num) && num < parseFloat(value1);
	}
	else if (passif === "Yes" || passif === "No") {
		isValid = val.toLowerCase() === passif.toLowerCase();
	}

	// Apply border color
	if (isValid) {
		input.style.border = "2px solid green";
	} else {
		input.style.border = "2px solid red";
	}

	return isValid;
}




$(document).on('input', '.valueInput', function(e) {

	e.stopImmediatePropagation();
	const name = $(this).attr('name');
	const value = $(this).val();
	$('[name="' + name + '"]').not(this).val(value);

});


$(document).on('change', '.selectInput', function(e) {
	e.stopImmediatePropagation();
	let name = $(this).attr('name');
	let value = $(this).val();
	$('select[name="' + name + '"]').not(this).val(value);
});



$(document).on('click', '#approveDetails', function() {

	var table = document.getElementById("ionizerDataTableBody");
	var rows = table.rows;
	var IdList = [];

	for (var i = 0; i < rows.length; i++) { // Start from 1 to skip the header row
		var row = rows[i];
		if (row.cells[0].innerText != "") {
			IdList.push(row.cells[0].innerText);
		}
	}

	var batchId = $(this).attr("data-id");
	let date = batchId.slice(0, 2);
	var formDataList = [];
	var OTP = $('#otp-input-1').val() ?? "";


	if (OTP == "") {
		alert("Please enter OTP.");
		return false;
	}


	/*	var formData = {
			batchId: batchId,
			jigNo: OTP,
			inchargeSign: sessionStorage.getItem('employeeId'),
			lineStationSheetMapping: {
				id: lineStationSheetMappingId
			}
		}*/


	var selectedDateIdListObject = keysListByDate[date];

	//const obj = JSON.parse(list[i].inputData);
	const keysList = Object.keys(selectedDateIdListObject);

	keysList.forEach((key, keyIndex) => {

		const whenList = selectedDateIdListObject[key];
		let whenObject = {};
		let dateDue = $('input[name="dateDue' + IdList[keyIndex] + '"]').val();
		let dateDone = $('input[name="dateDone' + IdList[keyIndex] + '"]').val();



		whenList.forEach((when, whenIndex) => {

			const selector = `input[name="input${when}${date}${IdList[keyIndex]}${whenIndex}"],
                  select[name="input${when}${date}${IdList[keyIndex]}${whenIndex}"]`;
			const val = $(selector).val();
			whenObject[when] = val;

		});

		var formData = {
			paramUserInputId: parseInt(key),
			jigNo: OTP,
			inputData: JSON.stringify(whenObject),
			dateDue: dateDue ? dateDue : null,
			dateDone: dateDone ? dateDone : null,
			inchargeSign: sessionStorage.getItem('employeeId'),
			lineStationSheetMapping: {
				id: lineStationSheetMappingId
			}
		};

		formDataList.push(formData);
	});

	if (rows.length != IdList.length) {

		alert("Data is not yet submitted! Please check station.");
		return false;

	}


	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/ionizer/approveMcsData',
		data: JSON.stringify(formDataList),
		async: false,
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {

			alert(response);
			refreshPage();

		},
		error: function(response) {

			alert(response.responseText);

		}
	});

});


function refreshPage() {

	createIonizerSheetBody();
	loadIonizerSheetUpperFormBody(lineStationSheetMappingId, 1);
	createIonizerSheetFooter();
	getIonizerSheetBodyData();
	hideModal("detailBackdropButton");

}


function getAllStationInList(id) {

	var formData = {
		sheet: {
			sheetType: 'ionizer'
		},
		line: {
			lineName: storedDetails.lineId
		}
	}

	$.ajax({
		url: "/WebApplication/Controllers/getAllStationInList",
		type: 'post',
		data: JSON.stringify(formData),
		async: false,
		contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		async: false,
		dataType: 'json',
		success: function(res) {
			for (var i = 0; i < res.length; i++) {
				var str = res[i];
				var id_ = str.split(',');

				for (var j = 0; j < id_.length - 1; j++) {
					var row = '<option value="' + id_[j] + '">' + id_[j + 1] + '</option>';
					$('#' + id).append(row);
				}
			}
		}, error: function(response) {
			alert(response.responseText);
		}
	});
}


function appendApproveValueInForm() {

	$("#ionizer_approval_form_body").empty();
	showModal("detailBackdropButton");
	var headerHtml = $("#ionizer_form_body").clone(true, true);
	//var bodyHtml = $("#ionizer_form_body").html();

	$("#ionizer_approval_form_body").append(headerHtml);
	//$("#ionizer_approval_form_body").append(bodyHtml);
	$("#selectedStation").text("STATION NAME: " + " " + $("#stationList option:selected").text());

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



function loadIonizerSheetUpperFormBody(lineStationSheetMappingId, countNo) {
	//$("#ionizer_header_body").empty();

	const formData = {
		shift: storedDetails.shift,
		createdAt: storedDetails.dateTime + " 00:00:00," + getLastDateOfMonth(storedDetails.dateTime) + " 23:59:59",
		lineStationSheetMapping: {
			id: lineStationSheetMappingId
		}
	}

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/ionizer/getAllHeaderDataOfMcsSheet',
		data: JSON.stringify(formData),
		async: false,
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {
			appendIonizerSheetUppedFormBodyData(res);

		},
		error: function(response) {
			appendEmptyHeader()

		}
	});
}

function appendEmptyHeader() {

	const tableHeader = `<thead>
						<!-- First big row -->
						<tr class="tableDataRows">
							<td class="tall textLeftAlign width150 py-1" colspan="2"><img
									src="/WebApplication/Controllers/image/excelCommonImage/jns.png" alt="Image"
									style="max-height:80px; max-width:100%;"></td>
							<td class="tall fw-bold" colspan="6" style="font-size: 20px;">Machine Check Sheet</td>
							
							<td class="tall textLeftAlign width150" colspan="32">
									<div class="d-flex justify-content-end text-align-center p-2" >PAGE NO.1 OF 2 </br>
										DOCUMENT No.  BH-C - AS -S - 0560A)/02</div>
							</td>
						</tr>

						<!-- First big row -->
						<tr class="tableDataRows">
							<td class="tall textLeftAlign width150 fw-bold" colspan="2">Machine Name : </td>
							<td class="tall textLeftAlign" colspan="4">NOT FOUND</td>
							
							<td class="tall textLeftAlign width150 fw-bold" colspan="2">Shift : </td>
							<td class="tall textLeftAlign" colspan="8">NOT FOUND</td>
							
							
							<td class="tall textLeftAlign width150" colspan="24" rowspan="3">
									<div>[ &#10004; ] OK (If value write value)</div>
									<div>[ &#10008; ] NG</div>
									<div>[ ] No Work</div>
									<div>Sign by: Section Incharge</div>
							</td>
						</tr>


						<!-- First big row -->
						<tr class="tableDataRows">
							<td class="tall textLeftAlign width150 fw-bold" colspan="2">Machine No. :</td>
							<td class="tall textLeftAlign" colspan="4">NOT FOUND</td>
							
							<td class="tall textLeftAlign width150 fw-bold" colspan="2">Month / Year : </td>
							<td class="tall textLeftAlign" colspan="8">NOT FOUND</td>
						</tr>

						<tr class="tableDataRows">
							<td class="tall textLeftAlign width150 fw-bold" colspan="2">Location :</td>
							<td class="tall textLeftAlign" colspan="4">NOT FOUND</td>
							
							<td class="tall textLeftAlign width150 fw-bold" colspan="2">Jig No. : </td>
							<td class="tall textLeftAlign" colspan="8">NOT FOUND</td>
						</tr>

					</thead>`;


	//$("#ionizer_header_body").html(html);

	$("#ionizerDataTable").prepend(tableHeader);

}



function appendIonizerSheetUppedFormBodyData(list) {


	const tableHeader = `<tr class="tableDataRows">
							<td class="tall textLeftAlign width150 py-1" colspan="2"><img
									src="/WebApplication/Controllers/image/excelCommonImage/jns.png" alt="Image"
									style="max-height:80px; max-width:100%;"></td>
							<td class="tall fw-bold" colspan="14" style="font-size: 20px;">Machine Check Sheet</td>
							
							<td class="tall textLeftAlign width150" colspan="24">
									<div class="d-flex justify-content-end text-align-center p-2" >PAGE NO.1 OF 2 </br>
										DOCUMENT No.  BH-C - AS -S - 0560A)/02</div>
							</td>
						</tr>

						<!-- First big row -->
						<tr class="tableDataRows">
							<td class="tall textLeftAlign width150 fw-bold" colspan="2">Machine Name : </td>
							<td class="tall textLeftAlign" colspan="4">${list[0][4] || ''}</td>
							
							<td class="tall textLeftAlign width150 fw-bold" colspan="2">Shift : </td>
							<td class="tall textLeftAlign" colspan="8">${list[0][1] || ''}</td>
							
							
							<td class="tall textLeftAlign width150" colspan="24" rowspan="3">
									<div>[ &#10004; ] OK (If value write value)</div>
									<div>[ &#10008; ] NG</div>
									<div>[ ] No Work</div>
									<div>Sign by: Section Incharge</div>
							</td>
						</tr>


						<!-- First big row -->
						<tr class="tableDataRows">
							<td class="tall textLeftAlign width150 fw-bold" colspan="2">Machine No. :</td>
							<td class="tall textLeftAlign" colspan="4">${list[0][6] || ''}</td>
							
							<td class="tall textLeftAlign width150 fw-bold" colspan="2">Month / Year : </td>
							<td class="tall textLeftAlign" colspan="8">${formatMonthAndYearByDate(list[0][3] || '')}</td>
						</tr>

						<tr class="tableDataRows">
							<td class="tall textLeftAlign width150 fw-bold" colspan="2">Location :</td>
							<td class="tall textLeftAlign" colspan="4">${list[0][5] || ''}</td>
							
							<td class="tall textLeftAlign width150 fw-bold" colspan="2">Jig No. : </td>
							<td class="tall textLeftAlign" colspan="8">${list[0][2] || ''}</td>
						</tr>`;


	//$("#ionizer_header_body").html(html);

	$("#ionizerDataTableHead").prepend(tableHeader);

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



function createIonizerSheetBody() {

	$.ajax({ 	// written in MachineCheckSheetFormAjaxController
		url: "/WebApplication/Controllers/ionizer/machineparameters/" + lineStationSheetMappingId,
		method: "GET",
		async: false,
		headers: {
			Authorization: `Bearer ${sessionStorage.getItem('token')}` // ✅ Add token here
		},
		success: function(response) {

			createIonizerSheetMiddleBody(response);

		},
		error: function(err) {
			$("#ionizer_form_body").html("<div class='text-danger'>Failed to load data</div>");
		}
	});


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


function createIonizerSheetMiddleBody(response) {

	$("#ionizer_form_body").empty();


	var headerList = ["S.No", "MACHINE PARAMETER", "Due", "Done", "How", "Who", "When", "vtype", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23",
		"24", "25", "26", "27", "28", "29", "30", "31"];

	makeMcsTable(headerList, "ionizer_form_body", "ionizerDataTable", "100%");
	var headerList2 = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];

	var variableList = ["paramId", "machParam_content", "due_text", "done_text", "how", "who", "whenData", "vtype"];
	var listWidth = ["70", "1500", "200", "200", "200", "200", "200", "0"];



	for (let i = 0; i < response.length; i++) {

		let fileName = null;
		if (response[i].ptype == 1) {
			const imageurl = response[i].machParam_content?.trim() || '';
			fileName = imageurl.split(/[/\\]/).pop(); // Extract just the filename
		}

		const tr = document.createElement("tr");
		tr.className = "tableDataRows";
		tr.setAttribute("style", "height: 80px;");

		// for print serial Number
		for (let k = 0; k < 1; k++) {
			let td = document.createElement("td");
			td.setAttribute("style", "display: none;");
			td.innerText = response[i]["paramId"];

			let td2 = document.createElement("td");
			td2.setAttribute("style", "width:" + listWidth[k] + "px;");
			td2.innerText = (i + 1);
			tr.append(td, td2);
		}

		// For print parameter with text and image
		var whenList;

		for (let k = 1; k < 8; k++) {



			let td = document.createElement("td");
			td.setAttribute("style", "width:" + listWidth[k] + "px;");
			if (k == 1) {
				if (fileName == null) {
					td.innerText = response[i][variableList[k]];
					td.setAttribute("colspan", "3");
				} else {
					td.innerHTML = '<img src="/WebApplication/Controllers/image/sign/sign_' + fileName +
						'" alt="Image" style="max-height:80px; max-width:100%;">';
					td.setAttribute("colspan", "3");
				}

			} else if (k == 2) {
				if (response[i]["due_date"] != null) {

					var daysDifference = getDaysFromToday(response[i]["due_date"] || '');
					var classList;
					if (daysDifference < 5) {

						classList = "border border-3 border-danger rounded-3 blink-border";
					}

					let div = document.createElement("div");
					let dueDate = response[i]["due_date"];
					//div.setAttribute("class", "tilt-text py-2 px-2 border-start border-secondary");
					td.innerHTML = response[i][variableList[k]] + "</br>" + dueDate;
					td.setAttribute("class", classList);
					let date = `<input type="date" name="dateDue${response[i].paramId}" class="hiddenInput valueInput d-none ms-auto validationDates" value="${dueDate}" />`
					div.innerHTML = date;
					td.append(div);
				} else {
					td.innerText = response[i][variableList[k]];
				}

			} else if (k == 3) {
				if (response[i]["done_date"] != null) {


					/*var daysDifference = getDaysFromToday(response[i]["done_date"] || '');
					var classList; 
					if(daysDifference < 5){
						
						classList = "border border-3 border-danger rounded-3 p-3 blink-border"; 
					}
					*/
					let div = document.createElement("div");
					let doneDate = response[i]["done_date"];
					//div.setAttribute("class", "tilt-text py-2 px-2 border-start border-secondary");
					td.innerHTML = response[i][variableList[k]] + "</br>" + doneDate;
					//td.setAttribute("class", classList);
					let date = `<input type="date" name="dateDone${response[i].paramId}" class="hiddenInput valueInput d-none ms-auto validationDates" value="${doneDate}" />`
					div.innerHTML = date;
					td.append(div);
				}/*else{
					td.innerText = response[i][variableList[k]];
				}*/

			} else if (k == 6) {
				whenList = response[i][variableList[k]].split("-");
				for (var j = 0; j < whenList.length; j++) {
					let div = document.createElement("div");
					div.innerText = whenList[j];

					/*	if(whenList.length == 1){
							div.setAttribute("style", "height:80px; width:80px;");
						}*/

					if (j < whenList.length - 1) {
						div.setAttribute("class", whenList[j] + " tilt-text py-2 px-2 border-start border-secondary");
						//div.setAttribute("style", "height:80px; width:80px;");
					} else {
						div.setAttribute("class", whenList[j] + " tilt-text py-2 px-2");
						//div.setAttribute("style", "height:80px; width:80px;");
					}

					td.setAttribute("style", "min-width: 30px; max-width:30px;");
					td.append(div);
				}
			}
			else if (k == 7) {
				td.setAttribute("style", "display: none;");
				td.innerText = response[i][variableList[k]];
			} else {
				td.innerText = response[i][variableList[k]];
			}
			tr.append(td);
		}

		// for readings
		for (let k = 0; k < headerList2.length; k++) {
			let td = document.createElement("td");
			td.setAttribute("class", "hiddenTableData td" + headerList2[k]);
			for (var j = 0; j < whenList.length; j++) {

				let vtype = response[i].vtype;
				let passif = response[i].passif;
				let value1 = response[i].value1;
				let value2 = response[i].value2;
				let date = headerList2[k];
				let inputId = "input" + whenList[j] + headerList2[k] + response[i].paramId;

				let input = renderInputField(vtype, passif, value1, value2, date, (inputId + j));

				let div = document.createElement("div");
				div.setAttribute("id", whenList[j] + headerList2[k] + response[i].paramId);
				div.setAttribute("class", "d-flex align-items-center tilt-text py-2 px-2 text-primary statusRow");
				td.setAttribute("style", "min-width: 25px; max-width:25px;");
				td.append(div);

				// ✅ Append input string as HTML element
				div.insertAdjacentHTML('beforeend', input);
			}
			tr.append(td);
		}

		$("#ionizerDataTable").append(tr);

	}



	var tableFooter = '<tfoot>' +
		'<tr class="tableDataRows" id="operatorRow" style="height:80px;">' +
		'<td class="tall"></td>' +
		'<td class="tall">Prepared By</td>' +
		'<td class="tall">Checked By</td>' +
		'<td class="tall">Approved By</td>' +
		'<td class="tall">Effective Date</td>' +
		'<td class="tall" colspan="4">Operator Sign</td>' +
		'</tr>' +
		'<tr class="tableDataRows" id="inchargeRow">' +
		'<td class="tall"></td>' +
		'<td class="tall py-1"><img ' +
		'src="/WebApplication/Controllers/image/excelCommonImage/ankur.png" alt="Image"' +
		'style="max-height:80px; max-width:100%;"></td>' +
		'<td class="tall py-1"><img ' +
		'src="/WebApplication/Controllers/image/excelCommonImage/harpal.png" alt="Image"' +
		'style="max-height:80px; max-width:100%;"></td>' +
		'<td class="tall py-1"><img src="/WebApplication/Controllers/image/excelCommonImage/arun.png"' +
		'alt="Image" style="max-height:80px; max-width:100%;"></td>' +
		'<td class="tall" rowspan="2">12.11.2024</td>' +
		'<td class="tall" rowspan="2" colspan="4" style="width: 700px;">Incharge Sign</td>' +
		'</tr>' +
		'<tr class="tableDataRows">' +
		'<td class="tall"></td>' +
		'<td class="tall">ANKUR</td>' +
		'<td class="tall">HARPAL</td>' +
		'<td class="tall">ARUN</td>' +
		'</tr>' +
		'</tfoot>'

	$("#ionizerDataTable").append(tableFooter);




}

function makeMcsTable(headerList, containerId, tableId, width) {

	var table = document.createElement("table");
	$("#" + containerId).append(table);
	table.setAttribute("id", tableId);
	table.setAttribute("style", "width:" + width + ";")
	table.setAttribute("cellspacing", "0px");
	table.setAttribute("class", "table-hover overflow-hidden");

	var headingRow = document.createElement("tr");


	for (var i = 0; i < headerList.length; i++) {
		var th = document.createElement("th");
		th.setAttribute("class", "tableheading");

		if (i == 1) {
			th.setAttribute("colspan", "3");
		}

		if (i > 7) {
			th.setAttribute("class", "tableheading hiddenTableData td" + headerList[i]);
		}

		if (i == 7) {
			th.setAttribute("style", "display: none;");
		}
		th.append(headerList[i]);
		headingRow.append(th);
	}

	var thead = document.createElement("thead");
	thead.setAttribute("id", tableId + "Head");

	var tbody = document.createElement("tbody");
	tbody.setAttribute("id", tableId + "Body");

	table.append(thead, tbody);
	thead.append(headingRow);
}




function createIonizerSheetFooter() {

	var rowList = ["operatorRow", "inchargeRow"];
	for (let i = 0; i < rowList.length; i++) {

		var headerList = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
		for (let k = 0; k < headerList.length; k++) {

			if (i == 0) {

				let td = document.createElement("td")
				let div = document.createElement("div");
				td.setAttribute("style", "min-width: 20px; max-width:20px;");
				td.setAttribute("class", "hiddenTableData td" + headerList[k]);
				div.setAttribute("class", "d-flex align-items-center tilt-text py-2 px-2 text-primary statusRow");
				if (i > 0) {
					td.setAttribute("rowspan", "2");
				}
				div.setAttribute("id", rowList[i] + headerList[k]);
				td.append(div);

				$("#" + rowList[i]).append(td);

			} else {

				let td = document.createElement("td")
				let div = document.createElement("div");
				td.setAttribute("style", "min-width: 25px; max-width:25px;");
				td.setAttribute("class", "hiddenTableData td" + headerList[k]);
				div.setAttribute("class", "d-flex align-items-center tilt-text py-2 px-2 text-primary statusRow");
				//div.setAttribute("style", "width: 100%; height: 30px; display: none;");

				if (i > 0) {
					td.setAttribute("rowspan", "2");
				}

				div.setAttribute("id", rowList[i] + headerList[k]);
				td.append(div);

				$("#" + rowList[i]).append(td);

				if (sessionStorage.getItem('role') == "LINE INCHARGE" || sessionStorage.getItem('role') == "SUPER ADMIN") {
					let button = document.createElement("button");
					button.setAttribute("id", "approvebutton" + rowList[i] + headerList[k]);
					button.setAttribute("style", "display: none;");
					button.innerText = "Pending";
					button.setAttribute("class", "approves container");
					div.append(button);
				}
			}
		}
	}
}


function getIonizerSheetBodyData() {

	const formData = {
		shift: storedDetails.shift,
		createdAt: storedDetails.dateTime + " 00:00:00," + getLastDateOfMonth(storedDetails.dateTime) + " 23:59:59",
		lineStationSheetMapping: {
			id: lineStationSheetMappingId
		}
	}

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/ionizer/getAllDataOfMcSheetByIdAndDate',
		data: JSON.stringify(formData),
		async: false,
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			appendDataInIonizerBody(response);

		},
		error: function(err) {
			console.error("Error resuming data", err);
		}
	});

}

window.getDayFromDateTime = getDayFromDateTime;
function getDayFromDateTime(dateTimeStr) {
	const date = new Date(dateTimeStr.replace(" ", "T"));
	// getDate() returns 1–31, so pad with leading zero if needed
	return String(date.getDate()).padStart(2, "0");
}


function showTickHTML(value) {
	if (value === "Yes") {
		return "<span>&#10004;</span>"; // ✔
	} else if (value === "No") {
		return "<span>&#10008;</span>"; // ✘
	} else if (value === null) {
		return "<span></span>"; // ✘
	} else {
		return "<span>" + value + "</span>"; // return original value for anything else
	}
}

function appendDataInIonizerBody(list) {

	var headerList = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];

	for (let i = 0; i < list.length; i++) {

		const date = getDayFromDateTime(list[i].createdAt);
		$("#operatorRow" + date).html(showTickHTML(list[i].operatorSign));

		var inchargeSign = list[i].inchargeSign;

		if (inchargeSign != null) {
			var innerHTML = '<img src="/WebApplication/Controllers/image/sign/sign_' + inchargeSign +
				'.png" alt="Image" class="approvedData" style="height:30px; width:100px;" id = "SignImage' + date + '" data-id = " ' + list[i].batchId + '">';

			$("#inchargeRow" + date).html(innerHTML);
			$("#inchargeRow" + date).show();
			$("#approvebuttoninchargeRow" + date).hide();
		} else {

			$("#inchargeRow" + date).show();
			$("#approvebuttoninchargeRow" + date).show();
		}

		$("#approvebuttoninchargeRow" + date).attr("data-id", list[i].batchId);

		//$("#inchargeRow" + date).text(list[i].inchargeSign);

		const obj = JSON.parse(list[i].inputData);
		const keysList = Object.keys(obj);

		const id = list[i].paramUserInputId

		/*		var objectList = {};
				objectList[id] = keysList;*/
		if (!keysListByDate[date]) keysListByDate[date] = {};
		if (!keysListByDate[date][id]) keysListByDate[date][id] = [];
		keysListByDate[date][id].push(...keysList);

		for (var j = 0; j < keysList.length; j++) {
			let value = obj[keysList[j]]

			setFieldValueByName(("input" + keysList[j] + date + list[i].field.rowId + j), value, list[i]);

			$("#" + keysList[j] + date + list[i].field.rowId).prepend(showTickHTML(value));

		}
	}
}

function setFieldValueByName(name, value, responseList) {
	const elements = document.getElementsByName(name);
	elements.forEach(el => {
		if (el.type === 'radio' || el.type === 'checkbox') {
			el.checked = (el.value == value);
		} else if (el.type === 'select-one') {
			$('[name="' + name + '"] option').removeAttr('selected');
			$('[name="' + name + '"] option[value="' + value + '"]').attr('selected', true);
		} else {
			el.value = value;
		}

		let passif = responseList.field.passif;
		let value1 = responseList.field.value1;
		let value2 = responseList.field.value2;
		validateField(el, passif, value1, value2)
	});

}



function loadMCSUpperFormBody(lineStationSheetMappingId) {
	$("#ionizer_header_body").empty();

	$.ajax({
		url: "/WebApplication/Controllers/ionizer/JigNo/" + lineStationSheetMappingId,
		method: "GET",
		headers: {
			Authorization: `Bearer ${sessionStorage.getItem('token')}`
		},
		success: function(machine) {

			const html = `
                <div class="row mb-3">
                    <div class="col-md-6 small-text">
                        <strong>SHIFT :</strong> 
                        <span id="shiftDisplay">${machine.shift}</span>
                        <input type="hidden" id="shiftInput" name="shift" value="${machine.shift}">
                    </div>
                    <div class="col-md-6 small-text">
                        <label for="jigNumberInput"><strong>JIG NUMBER :</strong></label>
                        <input 
                            type="text" 
                            id="jigNumberInput" 
                            name="jigNumber" 
                            class="form-control form-control-sm d-inline-block w-auto ms-2"
                            value="${machine.jigNumber || ''}" 
                            placeholder="Enter Jig Number"
                        >
                    </div>
                </div>
            `;
			$("#ionizer_header_body").html(html);
		},
		error: function() {
			$("#ionizer_header_body").html("<div class='text-danger'>Machine data not found.</div>");
		}
	});
}


// --- Shift calculation function (JS equivalent of your Java version) ---
function determineShift(dateObj) {
	const currentTime = dateObj.getHours() * 60 + dateObj.getMinutes(); // minutes since midnight
	const dayStart = 7 * 60 + 30;   // 7:30 AM
	const nightStart = 19 * 60 + 30; // 7:30 PM

	return (currentTime >= dayStart && currentTime < nightStart) ? "A" : "B";
}
