let currentMachineId = null; // Declare globally
var storedDetails;
var lotSize = [];
// Global variables used across your app
window.lineStationSheetMappingId = injectedLineStationSheetMappingId;// getting from the set value in the html, which set up in WebPageController
window.lineName = injectedLineName;// getting from the set value in the html, which set up in WebPageController
window.stationName = injectedStationName;// getting from the set value in the html, which set up in WebPageController
window.sheetName = injectedSheetName;
window.sheetTabNo = injectedSheetTabNo;
window.resumeMode = resumeModeInjected;
window.dateTime = dateTime;


$(document).ready(function() {
	storedDetails = JSON.parse(sessionStorage.getItem('details'));
	getAllStationInList("stationList");
	$("#stationList").val(lineStationSheetMappingId);
	loadPHUpperFormBody(lineStationSheetMappingId);
	createPhFormBody(lineStationSheetMappingId);
	currentMachineId = lineStationSheetMappingId;
});

$(document).on("change", "#stationList", function() {
	var selectedPage = parseInt($(this).val());
	lineStationSheetMappingId = selectedPage;
	loadPHUpperFormBody(lineStationSheetMappingId);
	createPhFormBody(lineStationSheetMappingId);
	currentMachineId = lineStationSheetMappingId;
});

$(document).on('click', '#capture', function() {
	/*    $("#dotPlotCanvas").css("width", "100%");*/

	/*    // Convert canvas to image
		var canvas = document.getElementById('dotPlotCanvas');
		var imgData = canvas.toDataURL('image/png');*/

	// Clone print area
	var printArea = document.querySelector('.processDataPrintArea').cloneNode(true);

	/*    // Replace canvas with image
		var canvasInPrint = printArea.querySelector('#dotPlotCanvas');
		if (canvasInPrint) {
			var img = document.createElement('img');
			img.src = imgData;
			img.style.width = '100%';
			canvasInPrint.parentNode.replaceChild(img, canvasInPrint);
		}*/

	// Open print window
	var printWindow = window.open('', '', 'height=768,width=1366');
	printWindow.document.write('<html><head><title>Print</title>');

	// Include your stylesheets
	printWindow.document.write('<link rel="stylesheet" href="/WebApplication/css/Importedcss/coreui.min.css">');
	printWindow.document.write('<link rel="stylesheet" href="/WebApplication/css/masterCommonCSS.css">');
	printWindow.document.write('<link rel="stylesheet" href="/WebApplication/css/viewPdSheet.css">');
	// ✅ Add print-specific CSS
	printWindow.document.write('<style>');
	printWindow.document.write('@page { size: portrait; margin: 5px; }'); // Landscape & margins
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



$(document).on('click', '#approveDetails', function() {

	var signType = $(this).attr("data-id");
	var table = document.getElementById("pdDataTableBody");
	var rows = table.rows;
	var IdList = [];

	for (var i = 0; i < rows.length; i++) { // Start from 1 to skip the header row
		var row = rows[i];
		if (row.cells[0].innerText != "") {
			IdList.push(row.cells[0].innerText);
		}
	}

	var formDataList = [];
	var OTP = $('#otp-input-1').val() ?? "";


	if (OTP == "") {
		alert("Please enter OTP.");
		return false;
	}


	for (var i = 0; i < IdList.length; i++) {

		const selector = '[name="input' + IdList[i] + 'text"],select[name="input' + IdList[i] + 'yesno"]';
		const startOfProduction = $(selector).val();
		const sopDate = $('input[name="input' + IdList[i] + 'date"]').val() ?? '';

		// 🔹 Collect all Lot Change entries dynamically
		const lotChanges = [];

		for (var j = 0; j < lotSize.length; j++) {

			const lotNo = $('[name="inputlotNo' + IdList[i] + j + 'text"]').val();
			const dateVal = $('[name="inputdateVal' + IdList[i] + j + 'text"]').val();
			const timeVal = $('[name="inputtimeVal' + IdList[i] + j + 'text"]').val();
			const ampm = $('[name="inputampm' + IdList[i] + j + 'text"]').val();

			// Validate: all must be filled
			if (!lotNo || !dateVal || !timeVal) {
				missingLotChange = true;
				//lotChangeInput.css("border", "2px solid red");
			} else {
				//lotChangeInput.css("border", "");
			}

			lotChanges.push({ lotNo, timeVal, dateVal, ampm });
		}

		var formData = {
			id: parseInt(IdList[i]),
			batchId: OTP,
			variant: signType,
			startOfProduction: startOfProduction,
			sopDate: sopDate,
			lotChangesJson: JSON.stringify(lotChanges),
			lineLeaderSign: sessionStorage.getItem('employeeId'),
			lineStationSheetMapping: {
				id: lineStationSheetMappingId
			}
		}
		formDataList.push(formData);
	}

	if (rows.length != IdList.length) {

		alert("Data is not yet submitted! Please check station.");
		return false;

	}

	console.log(formDataList);


	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/ph/approvePhData',
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



$(document).on('input', '.phsInput', function(e) {

	e.stopImmediatePropagation();
	const name = $(this).attr('name');
	const value = $(this).val();
	$('[name="' + name + '"]').not(this).val(value);

});


$(document).on('change', '.phsInput', function(e) {
	e.stopImmediatePropagation();
	let name = $(this).attr('name');
	let value = $(this).val();
	$('select[name="' + name + '"]').not(this).val(value);
});




$(document).on('click', '#lineleaderSign', function() {

	appendApproveValueInForm();
	$("#approveDetails").attr("data-id", "lineLeader");

});

$(document).on('click', '#lineInchargeSign', function() {

	appendApproveValueInForm();
	$("#approveDetails").attr("data-id", "lineIncharge");

});

$(document).on('click', '#qAEngineerSign', function() {

	appendApproveValueInForm();
	$("#approveDetails").attr("data-id", "qaEngieer");

});


$(document).on('click', '#detailCloseButton', function() {

	$(".phsInputContainer").hide("d-none");
	$(".phsDataContainer").show("d-none");



});

function refreshPage() {

	loadPHUpperFormBody(lineStationSheetMappingId);
	createPhFormBody(lineStationSheetMappingId);
	hideModal("detailBackdropButton");

}


function appendApproveValueInForm() {

	$("#upper_ph_approval_form_body").empty();
	showModal("detailBackdropButton");
	var headerHtml = $("#upper_ph_form_body").html();
	var bodyHtml = $("#phDataContainer").html();

	$("#upper_ph_approval_form_body").append(headerHtml);
	$("#upper_ph_approval_form_body").append(bodyHtml);
	$("#selectedStation").text("STATION NAME: " + " " + $("#stationList option:selected").text());

	$(".phsInputContainer").show();
	$(".phsDataContainer").hide();

}



function getAllStationInList(id) {

	var formData = {
		sheet: {
			sheetType: 'ph'
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

function loadPHUpperFormBody(lineStationSheetMappingId) {
	$("#pdDataTableHead").empty();

	const formData = {
		model: storedDetails.model,
		variant: storedDetails.variant,
		shift: storedDetails.shift,
		filledNo: storedDetails.filledNo,
		dateTimeModified: storedDetails.dateTime + " 00:00:00," + storedDetails.dateTime + " 23:59:59",
		lineStationSheetMapping: {
			id: lineStationSheetMappingId
		}
	}

	console.log(formData);

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/ph/getAllHeaderDataOfPHSheetByDateTime',
		data: JSON.stringify(formData),
		async: false,
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {
			appendPhUppedFormBodyData(res);

		},
		error: function(response) {
			appendEmptyPhUppedFormBodyData();

		}
	});
}


function appendPhUppedFormBodyData(list) {

	const html = `		<tr class="tableDataRows">
							<td class="tall fw-bold" colspan="13" style="font-size: 20px;">Product History Sheet.</td>
						</tr>


						<tr class="tableDataRows">
							<td class="tall textLeftAlign width150 fw-bold">PART : </td>
							<td class="tall textLeftAlign" >METER ASSY COMB</td>
							
							<td class="tall textLeftAlign width150 fw-bold">START TIME : </td>
							<td class="tall textLeftAlign" >${list[0][2] || ''}</td>
							
							<td class="tall textLeftAlign width150 fw-bold">DATE : </td>
							<td class="tall textLeftAlign" colspan="2">${formatDateTime(list[0][4] || '')}</td>
						</tr>


						<tr class="tableDataRows">
							<td class="tall textLeftAlign width150 fw-bold">MODEL :</td>
							<td class="tall textLeftAlign" >${list[0][0] || ''}</td>
							
							<td class="tall textLeftAlign width150 fw-bold">FINISH TIME : </td>
							<td class="tall textLeftAlign" >${list[0][3] || ''}</td>
							
							<td class="tall textLeftAlign width150 fw-bold">QUANTITY : </td>
							<td class="tall textLeftAlign" colspan="2">${list[0][5] || ''}</td>
						</tr>

						<tr class="tableDataRows">
							<td class="tall textLeftAlign width150 fw-bold">PART No :</td>
							<td class="tall textLeftAlign" >${list[0][1] || ''}</td>
							
							<td class="tall textLeftAlign width150 fw-bold">SHIFT : </td>
							<td class="tall textLeftAlign" >${list[0][6] || ''}</td>

							<td class="tall textLeftAlign width150 fw-bold" colspan="2"></td>
						</tr>
						
						<tr>
								<th class="tableheading">इन्स्पेक्शन</th>
								<th class="tableheading" rowspan="2">इन्स्पेक्शन रिक्वायर्मेंट</th>
								<th class="tableheading" colspan="3">रिजल्ट</th>
								<th class="tableheading" rowspan="2">ऑपरेटर का नाम / ऑपरेटर का नाम और टाइम यदि बदलता
									है</th>
							</tr>
							<tr>
								<th class="tableheading">पार्ट / प्रोसेस</th>
								<th class="tableheading">स्टार्ट ऑफ प्रोडक्शन (SOP)</th>
								<th class="tableheading" colspan="2">लॉट चेंज / टाइम</th>
							</tr>`;

	$("#pdDataTableHead").prepend(html);

	var col1;
	var col2;
	var col3;


	if (list[0][7] == null && (sessionStorage.getItem('role') == "LINE LEADER" || sessionStorage.getItem('role') == "SUPER ADMIN")) {

		col1 = `<td class="tall py-1" colspan="2"><button id="lineleaderSign" style="max-height:80px; max-width:100%;" class="btn btn-warning">Pending</button></td>`

	} else {

		if (list[0][7] == null) {
			col1 = `<td class="tall py-1 lineLeaderSign" colspan="2" ><span class="badge bg-warning fs-6">Pending</span></td>`;

		} else {
			col1 = `<td class="tall py-1 lineLeaderSign" colspan="2"><img src="/WebApplication/Controllers/image/sign/sign_${list[0][7] || ''}.png"
											alt="Image" style="max-height:80px; max-width:100%;"></td>`
		}
	}

	if (list[0][8] == null && (sessionStorage.getItem('role') == "LINE INCHARGE" || sessionStorage.getItem('role') == "SUPER ADMIN")) {

		col2 = `<td class="tall py-1" colspan="2"><button id="lineInchargeSign" style="max-height:80px; max-width:100%;" class="btn btn-warning">Pending</button></td>`

	} else {

		if (list[0][8] == null) {
			col2 = `<td class="tall py-1 lineInchargeSign" colspan="2"><span class="badge bg-warning fs-6">Pending</span></td>`;

		} else {
			col2 = `<td class="tall py-1 lineInchargeSign" colspan="2"><img src="/WebApplication/Controllers/image/sign/sign_${list[0][8] || ''}.png"
											alt="Image" style="max-height:80px; max-width:100%;"></td>`
		}
	}

	if (list[0][9] == null && (sessionStorage.getItem('role') == "QA ENGINEER" || sessionStorage.getItem('role') == "SUPER ADMIN")) {

		col3 = `<td class="tall py-1" colspan="2"><button id="qAEngineerSign" style="max-height:80px; max-width:100%;" class="btn btn-warning">Pending</button></td>`

	} else {

		if (list[0][9] == null) {
			col3 = `<td class="tall py-1 qaEngineerSign" colspan="2"><span class="badge bg-warning fs-6">Pending</span></td>`;

		} else {
			col3 = `<td class="tall py-1 qaEngineerSign" colspan="2"><img src="/WebApplication/Controllers/image/sign/sign_${list[0][9] || ''}.png"
											alt="Image" style="max-height:80px; max-width:100%;"></td>`
		}
	}



	const html2 = '<tr class="tableDataRows">'
		+ '<td colspan="2">Line Leader Sign</td>'
		+ '<td colspan="2">Line Incharge Sign</td>'
		+ '<td colspan="4">QA Engineer Sign</td>'
		+ '</tr>'

		+ '<tr class="tableDataRows" style="height: 100px;">' + col1 + col2 + col3 + '</tr>';

	$("#pdDataTablefoot").html(html2);

}

function formatDateTime(dateTimeString) {
	if (!dateTimeString) return '';
	const date = new Date(dateTimeString);

	// Format as dd-MM-yyyy HH:mm
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const year = date.getFullYear();
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');

	/*return `${day}-${month}-${year} ${hours}:${minutes}`;*/
	return `${year}-${month}-${day}`;
}


function appendEmptyPhUppedFormBodyData() {


	const html = `	
						<tr class="tableDataRows">
							<td class="tall fw-bold" colspan="13" style="font-size: 20px;">Product History Sheet.</td>
						</tr>


						<tr class="tableDataRows">
							<td class="tall textLeftAlign width150 fw-bold">PART : </td>
							<td class="tall textLeftAlign" colspan="4">METER ASSY COMB</td>
							
							<td class="tall textLeftAlign width150 fw-bold">START TIME : </td>
							<td class="tall textLeftAlign" colspan="4">N/A</td>
							
							<td class="tall textLeftAlign width150 fw-bold">DATE : </td>
							<td class="tall textLeftAlign" colspan="4">N/A</td>
						
						</tr>


						<tr class="tableDataRows">
							<td class="tall textLeftAlign width150 fw-bold">MODEL :</td>
							<td class="tall textLeftAlign" colspan="4">N/A</td>
							
							<td class="tall textLeftAlign width150 fw-bold">FINISH TIME : </td>
							<td class="tall textLeftAlign" colspan="4">N/A</td>
							
							<td class="tall textLeftAlign width150 fw-bold">QUANTITY : </td>
							<td class="tall textLeftAlign" colspan="4">N/A</td>
						</tr>

						<tr class="tableDataRows">
							<td class="tall textLeftAlign width150 fw-bold">PART No :</td>
							<td class="tall textLeftAlign" colspan="4">N/A</td>
							
							<td class="tall textLeftAlign width150 fw-bold">SHIFT : </td>
							<td class="tall textLeftAlign" colspan="4">N/A</td>

							<td class="tall textLeftAlign width150 fw-bold" colspan="3"></td>
						</tr>`;

	$("#pdDataTableHead").prepend(html);

	var col1 = `<td class="tall py-1 lineLeaderSign" colspan="2" ><span class="badge bg-warning fs-6">N/A</span></td>`;
	var col2 = `<td class="tall py-1 lineLeaderSign" colspan="2" ><span class="badge bg-warning fs-6">N/A</span></td>`;
	var col3 = `<td class="tall py-1 lineLeaderSign" colspan="2" ><span class="badge bg-warning fs-6">N/A</span></td>`;


	const html2 = '<table>'
		+ '<tr class="tableDataRows">'
		+ '<td colspan="2">Line Leader Sign</td>'
		+ '<td colspan="2">Line Incharge Sign</td>'
		+ '<td colspan="2">QA Engineer Sign</td>'
		+ '</tr>'

		+ '<tr class="tableDataRows" style="height: 100px;">' + col1 + col2 + col3

		+ '</tr>'
		+ '</table>';

	$("#pdDataTablefoot").html(html2);


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


function createPhFormBody(lineStationSheetMappingId) {
	$("#pdDataTableBody").empty();

	const formData = {
		model: storedDetails.model,
		variant: storedDetails.variant,
		shift: storedDetails.shift,
		filledNo: storedDetails.filledNo,
		batchId: storedDetails.batchId,
		dateTimeModified: storedDetails.dateTime + " 00:00:00," + storedDetails.dateTime + " 23:59:59",
		lineStationSheetMapping: {
			id: lineStationSheetMappingId
		}
	}

	$.ajax({  // this also updates the backend  with Mark sheet open (status = 0) in saveStatus table
		url: `/WebApplication/Controllers/ph/getAllDataOfPhSheetByDateTime`,
		method: "post",
		data: JSON.stringify(formData),
		async: false,
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {

			appendTableBody(response);

		},
		error: function(response) {

		}
	});
}


function appendTableBody(data) {

	// Step 1: Group consecutive rows with same partOrProcess
	const grouped = [];
	let i = 0;
	while (i < data.length) {
		const current = data[i];
		let count = 1;

		let j = i + 1;
		while (j < data.length && data[j][2] === current[2]) {
			count++;
			j++;
		}

		for (let k = i; k < j; k++) {
			grouped.push({
				...data[k],
				rowspan: k === i ? count : 0 // rowspan only for first item of group
			});
		}
		i = j;
	}


	const lineLeaderSign = grouped.some(obj => obj["11"] === null);
	const lineInchargeSign = grouped.some(obj => obj["12"] === null);
	const qaEngineerSign = grouped.some(obj => obj["13"] === null);

	if (lineLeaderSign == true) {
		var status = `<span class="badge bg-warning fs-6">Pending</span>`;

		$(".lineLeaderSign").html(status);
	}

	if (lineInchargeSign == true) {
		var status = `<span class="badge bg-warning fs-6">Pending</span>`;

		$(".lineInchargeSign").html(status);
	}

	if (qaEngineerSign == true) {
		var status = `<span class="badge bg-warning fs-6">Pending</span>`;

		$(".qaEngineerSign").html(status);
	}

	console.log(grouped);
	// Step 2: Build table rows

	grouped.forEach((item, index) => {
		let firstColumn = "";
		let lotChangeColumn = "";
		let operatorColumn = "";

		// only insert first column if rowspan > 0
		if (item["rowspan"] > 0) {
			firstColumn = `<td class="textLeftAlign py-2" rowspan="${item["rowspan"]}">${item[2]}</td>`;
			lotChangeColumn = `<td class="width150" colspan="2" rowspan="${item["rowspan"]}">${convertJsonListToDivAndInput(item[5], "text", item[7])}
								</td>`;
			operatorColumn = `<td class="width150" rowspan="${item.rowspan}">${convertJsonListToDivOnly(item[6])}</td>`;
		}

		const row = `
			<tr class="tableDataRows" >
				<td class="d-none">${item[7] == null ? '' : item[7]}</td>
				${firstColumn}
				<td class="textLeftAlign py-2">${item[1] == null ? '' : item[1]} </td>
				<td id="sop_${index}" class="textLeftAlign width150">
								<div class="phsDataContainer ">${showTickHTML(item[3] == null ? '' : item[3])} </br> ${item[4] == null ? '' : item[4]}</div>
								${convertDataToInputs(item[3], item[11], item[7])} ${convertDataToInputs(item[4], "date", item[7])}
				</td>
				${lotChangeColumn}
				${operatorColumn}
			</tr>
		`;

		$("#pdDataTableBody").append(row);
	});
}


function convertDataToInputs(data, inputType, inputName) {
	const outerDiv = document.createElement("div");
	outerDiv.className = "phsInputContainer"
	outerDiv.style = "display: none;"

	if (data != null) {

		/*			const inputField = document.createElement("input");
					inputField.type = inputType;
					inputField.name = "input" + inputName + inputType;
					inputField.className = "form-control form-control-sm input-box my-1 phsInput";
					inputField.setAttribute("value", data); // ✅ ensures value appears in HTML
					outerDiv.appendChild(inputField);*/

		outerDiv.insertAdjacentHTML("beforeend", renderInputField(inputType, inputName, data));



	}

	return outerDiv.outerHTML;
}


function renderInputField(vtype, inputId, value) {
	/*    const baseName = `dataInput_${index}_${partIndex}`;
		const key = parts[partIndex].trim().toUpperCase(); // <-- exact key for this input (e.g., "SOP" or "ALB")*/

	if (vtype === "yesno") {
		return `
            <select name="input${inputId}${vtype}" class="form-control form-control-sm input-box my-1 phsInput" >
                <option value="Yes" ${value == "Yes" ? "selected" : ""}>Yes</option>
                <option value="No" ${value == "No" ? "selected" : ""}>No</option>
            </select>
        `;
	} else if (vtype === "number") {
		return `
            <input name="input${inputId}${vtype}" type="number" value="${value}" class="form-control form-control-sm input-box my-1 phsInput" />
        `;
	} else if (vtype === "date") {
		return `
	        <input name="input${inputId}${vtype}" type="date" value="${value}" class="form-control form-control-sm input-box my-1 phsInput" />
	    `;
	} else { // default: text
		return `
            <input name="input${inputId}${vtype}" type="text" value="${value}" class="form-control form-control-sm input-box my-1 phsInput" />
        `;
	}
}


function convertJsonListToDivAndInput(data, inputType, inputName) {
	// If data is a JSON string, parse it

	const outerDiv = document.createElement("div");

	if (data != null) {
		let dataList = JSON.parse(JSON.parse(data));
		lotSize = dataList;
		dataList.forEach((obj, index) => {
			const itemDiv = document.createElement("div");
			itemDiv.className = "border-bottom border-secondary d-flex flex-wrap py-3 px-3";

			//itemDiv.innerHTML = `<span class="fs-6">Lot Change : ${index + 1}</span>`;
			Object.keys(obj).forEach(key => {
				const fieldDiv = document.createElement("div");
				fieldDiv.className = "phsDataContainer fs-6 container w-50 px-2 text-start";
				fieldDiv.textContent = `${obj[key]}`;
				itemDiv.appendChild(fieldDiv);

				itemDiv.insertAdjacentHTML("beforeend", convertDataToInputs(obj[key], inputType, key + inputName + index));
			});

			outerDiv.appendChild(itemDiv);
		});
		return outerDiv.outerHTML;
	}
	return outerDiv.outerHTML;
}


function convertJsonListToDivOnly(data) {
	// If data is a JSON string, parse it

	const outerDiv = document.createElement("div");

	if (data != null) {
		let dataList = JSON.parse(JSON.parse(data));
		dataList.forEach((obj, index) => {
			const itemDiv = document.createElement("div");
			itemDiv.className = "itemBox py-2 border-bottom border-secondary";

			//itemDiv.innerHTML = `<span class="fs-6">Lot Change : ${index + 1}</span>`;
			Object.keys(obj).forEach(key => {
				const fieldDiv = document.createElement("div");
				fieldDiv.className = "fs-6 w-100 px-2 text-start";
				fieldDiv.textContent = `${obj[key]}`;
				itemDiv.appendChild(fieldDiv);
			});

			outerDiv.appendChild(itemDiv);
		});
		return outerDiv.outerHTML;
	}
	return outerDiv.outerHTML;
}


function resetFormInputs() {
	// Select all inputs inside your form (adjust selector if needed)
	const inputs = document.querySelectorAll("input[type='text'], input[type='time'], input[type='number']");

	inputs.forEach(input => {
		input.value = "";

		// Restore placeholder styling if needed (for italic effect)
		if (input.placeholder) {
			input.style.fontStyle = 'italic';
			input.style.color = '#999';
		}
	});
}