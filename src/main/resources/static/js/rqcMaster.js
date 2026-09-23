var currentEditableRow = "";
var NoOfParameter = 0;
var parameterTypeList = ["inspectionItem", "criteria", "inspectionMethod", "inspectionTool", "min", "max", "samplingplan", "multidimensionval"];
var iterableformData = [];
var imageWidth = 100;
// object.status == "1" means it is approved mis-p

$(document).on('click', '#addEditDeleteCloseButton', function() {
	
	$("tr").removeAttr("style");
	deleteAllList = [];
	object = "";
	qualityId = "";
	NoOfParameter = 0;
	
	
	$("#addEditDeleteBackdropModal :first-child").removeClass("modal-xl");
	$("#addEditDeleteBackdropModal :first-child").addClass("modal-l");
	$("#modalContent").attr("style", "max-height: 550px;");
	$("#sendForApproval").css("display", "none");
});

$(document).on('click', '#rqcMaster', function() {

	$("#offcanvasCloseButton").click();
	$("#masterHeading").text("RQC CREATION MASTER");

	$("#tableContainer").empty();
	$("#pagerContainer").empty();
	makePagerBody("pagerContainer");

	var headerList = ["S.No.", "RQC-P No.", "Rev No.", "Part No.", "Part Description", "No. of Parameter", "Created By", "Date & Time", "Approve / Discard", "Implement Date", "Customer", "Model", "Status"];
	var searchList = ["searchrqcNo", "searchrevNo", "searchPartNumber", "","", "" , "" , "" , "", "", "", ""];  // "searchCustomer", "searchModel",   searchPartDescription
	var placeholderList = ["RQC-P No.", "Rev No.", "Part No.", "Part Description","", "" , "" , "" , "", "", "", ""];// "Customer", "Model", 
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
		pdfUpload: "show",
		userDetails: "show"
	});
	
	replaceButton(
		"pdfUpload",       // old button base id (without "Container")
		"summerizeBtn",    // new button id
		"summerize",       // new button class for styling
		"RQC-P Review",    // title tooltip
		function () {      // click handler
			console.log("RQC-P Review clicked");
			// Your actual logic here
		}
	);

	getIdByMasterName($(this).attr('id'));
});

// 'click', '.summerize'
window.getAllMispParameterInDetailModal = getAllMispParameterInDetailModal;
function getAllMispParameterInDetailModal(mispNumber, revNumber) {
	console.log("hellr");
	$.ajax({
		url: "/WebApplication/Controllers/getAllParameterByMISP/" + mispNumber + "/" + revNumber,
		type: 'GET',
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		dataType: 'json',
		async: false,
		success: function(response) {

			createMispDetailModal();
			$("#detailResponseContainer").text("");
			$("#mispNumberDisplay").text(response[0].mispNumber);
			$("#revNumberDisplay").text("Rev No : " + response[0].revNumber);
			$("#partNumberDisplay").text(response[0].partNumber);
			$("#partNumberDescription").text(response[0].partDescription);
			/*$("#mispImageContainer").css("background-image", "url('/WebApplication/uploadImages/" + response[0].partNumber + ".png')");*/
			
			// Construct image filename and URL
			const fileName = `${response[0].partNumber}_${response[0].revNumber}.png`;
			//const imageUrl = `/WebApplication/Controllers/rqcuploadImages/${fileName}`
			//a timestamp query param:  // Optional cache-busting if needed: so time to time refreshed and not cached.
			const imageUrl = `/WebApplication/Controllers/rqcuploadImages/${fileName}?t=${Date.now()}`;

			// Create and set image element
			const img = document.createElement("img");
			img.setAttribute("src", imageUrl);
			img.setAttribute("style", `width: ${imageWidth}%`);
			
			
			/*$("#imageContainer").css("background-image", "url('/WebApplication/uploadImages/" + Inspectionlist[11] + ".png')");*/
			// Append image
			$("#mispImageContainer").children("img").remove();
			$("#mispImageContainer").append(img);
			insertMispParameterInDetailModal(response);

		}, error: function(response) {
			$("#warningInformationModalBody").text(response.responseText);
			$("#warningBackdropButton").click();
		}
	});

}

// used in above function getAllMispParameterInDetailModal
function insertMispParameterInDetailModal($item) {

	$("#detailTableBody").remove();
	var tablebody = document.createElement("tbody");
	tablebody.setAttribute("id", "detailTableBody");

	$("#detailTable").append(tablebody);

	$.each($item, function(index, value) {


		var row = '<tr class="smalTextRows">' +
			'<td data-column="columnId" style="width:80px;">' + (index + 1) + '</td>' +
			'<td data-column="inspectionItem" >' + value.inspectionItem + '</td>' +
			'<td data-column="criteria">' + value.criteria + '</td>' +
			'<td data-column="method">' + value.inspectionMethod + '</td>' +
			'<td data-column="instrumentName">' + (value.instrument == null ? "" : value.instrument.instrumentName) + '</td>' +
			'<td data-column="min">' + value.min + '</td>' +
			'<td data-column="max">' + value.max + '</td>' +
			'<td data-column="samplingPlan">' + value.samplingPlan + '</td>' +
			'<td data-column="multiDimensionValue">' + value.multiDimensionValue + '</td>' +
			'<td data-column="qualityId" style="display:none;">' + value.qualityId + '</td>' +
			'</tr>';
			
		$('#detailTable').append(row);
	});
}


window.loadLikeRqcCreationMasterData = loadLikeRqcCreationMasterData;
function loadLikeRqcCreationMasterData(page, pageSize) {

	var rqcNumber = $('#searchrqcNo').val() ?? "";
	var revNumber = $('#searchrevNo').val() ?? "";
	var partNumber = $('#searchPartNumber').val() ?? "";
	var partDescription = $('#searchPartDescription').val() ?? "";
	var customer = $('#searchCustomer').val() ?? "";
	var model = $('#searchModel').val() ?? "";
	
	var formData = {
		mispNumber: rqcNumber,
		revNumber: revNumber,
		partNumber: partNumber,
		partDescription: partDescription,
/*		customer: customer,
		model:model,*/
	}
		console.log(formData);
	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getLikeMispNo/' + page + '/' + pageSize,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {
			console.log(res, page);
			makePagerByTotalPages(res, page);
			insertRqcCreationMasterInTable(res.mispMaster, "table1");
			
		}, error: function(response) {
			/*
			$("#warningInformationModalBody").text(response.responseText);
			$("#warningBackdropButton").click();*/
		}
	});
}

$(document).on('click', '#increase, #increase2', function() {

	if (imageWidth < 500) {
		imageWidth = imageWidth + 10;
		$("#mispImageContainer").children("img").attr("style", "width:" + imageWidth + "%");
	}


});
$(document).on('click', '#decrease , #decrease2', function() {

	if (imageWidth > 100) {
		imageWidth = imageWidth - 10;
		$("#mispImageContainer").children("img").attr("style", "width:" + imageWidth + "%");
	}

});

// called in getAllMispParameterInDetailModal for 'click', '.summerize' button
window.createMispDetailModal = createMispDetailModal;
function createMispDetailModal() {

	// Apply flex to modal body
	$("#detailModalBody").css({
	    display: "flex",
	    gap: "10px"
	});
	
	var element11 = document.createElement("div");
	var element12 = document.createElement("div");

	element11.setAttribute("class", "dataContainer smallContainer");
	element12.setAttribute("class", "dataContainer smallContainer");
	element12.setAttribute("id", "mispImageContainer");


	// flex ratios
	element11.style.flex = "2";  // table larger
	element12.style.flex = "1";  // image smaller
	
	$("#detailModalBody").append(element11, element12);
	
	var table = document.createElement("table");
	table.setAttribute("style", "width:100%;")
	table.setAttribute("id", "detailTable");
	table.style.width = "100%";
	table.style.tableLayout = "fixed";  // prevents uneven column collapse
	table.style.wordWrap = "break-word";
	table.style.whiteSpace = "normal";
	table.style.overflowWrap = "anywhere";


	var thead = document.createElement("thead");
	thead.setAttribute("id", "detailTableHead")

	var thead2 = document.createElement("thead");
	thead2.setAttribute("id", "detailTableHead2")

	var tbody = document.createElement("tbody");
	tbody.setAttribute("id", "detailTableBody")

	var tr = document.createElement("tr");

	var thh1 = document.createElement("th");
	thh1.innerText = "RQC-P:";
	thh1.setAttribute("class", "tableheading2");
	var thh2 = document.createElement("th");
	thh2.setAttribute("Id", "mispNumberDisplay");
	thh2.setAttribute("class", "tableheading2");
	var thh3 = document.createElement("th");
	thh3.innerText = "Rev No :";
	thh3.setAttribute("class", "tableheading2");
	thh3.setAttribute("Id", "revNumberDisplay");
	var thh5 = document.createElement("th");
	thh5.innerText = "P No :"
	thh5.setAttribute("class", "tableheading2");
	var thh6 = document.createElement("th");
	thh6.setAttribute("Id", "partNumberDisplay");
	thh6.setAttribute("class", "tableheading2");
	var thh7 = document.createElement("th");
	thh7.setAttribute("colspan", "4");
	thh7.setAttribute("Id", "partNumberDescription");
	thh7.setAttribute("class", "tableheading2");

	tr.append(thh1, thh2, thh3, thh5, thh6, thh7);
	/*tr1.append();*/


	var tr1 = document.createElement("tr");
	var tr2 = document.createElement("tr");
	var tr3 = document.createElement("tr");
	var tr4 = document.createElement("tr");
	
	var sNo = document.createElement("th");
	sNo.setAttribute("class", "tableheading");
	sNo.innerText = "Id";

	var th = document.createElement("th");
	th.setAttribute("class", "tableheading");
	th.innerText = "Item";

	var th1 = document.createElement("th");
	th1.setAttribute("class", "tableheading");
	th1.innerText = "Criteria";

	var th2 = document.createElement("th");
	th2.setAttribute("class", "tableheading");
	th2.innerText = "Method";

	var th3 = document.createElement("th");
	th3.setAttribute("class", "tableheading");
	th3.innerText = "Tool";

	var th4 = document.createElement("th");
	th4.setAttribute("class", "tableheading");
	th4.innerText = "Min";

	var th5 = document.createElement("th");
	th5.setAttribute("class", "tableheading");
	th5.innerText = "Max";

	var th6 = document.createElement("th");
	th6.setAttribute("class", "tableheading");
	th6.innerText = "Samples";
	
	var th7 = document.createElement("th");
	th7.setAttribute("class", "tableheading");
	th7.innerText = "Mul. Dim. Val.";

	element11.append(table);
	table.append(thead, thead2, tbody);

	thead.append(tr);
	thead2.append(tr3);
	tr3.append(sNo, th, th1, th2, th3, th4, th5, th6, th7);
}



function insertRqcCreationMasterInTable(response, tableId) {
/*
	$("#tableBody").remove();
	var tablebody = document.createElement("tbody");
	tablebody.setAttribute("id", "tableBody");*/
	
	$("#" + tableId + "Body").empty();
/*
	$("#table1").append(tablebody);

	var sequenceNumber = pageSize * parseInt($('#pageSelect :selected').val());*/
	var sequenceNumber = getSequenceNumber();

	
	for (var i = 0; i < response.length; i++) {
		var str = response[i];
		var list = str.split(',');

		if (list[8] == "0") {
			var row = '<tr class="tableDataRows" title="Double click to select the row.">' +
				'<td data-column="columnId" style="width:50px">' + (sequenceNumber + 1) + '</td>' +
				'<td data-column="mispNumber" style="width:100px">' + (list[0] == "null" ? '' : list[0]) + '</td>' +
				'<td data-column="revNumber" style="width:70px">' + (list[1] == "null" ? '' : list[1]) + '</td>' +
				'<td data-column="partNumber" style="width:150px">' + (list[2] == "null" ? '' : list[2]) + '</td>' +
				'<td data-column="partDescription" style="width:400px; text-align:left; padding-left:10px;">' + (list[9] == "null" ? '' : list[9]) + '</td>' +
				'<td data-column="noOfParameter">' + (list[3] == "null" ? '' : list[3]) + '</td>' +
				'<td data-column="createdBy">' + (list[4] == "null" ? '' : list[4]) + '</td>' +
				'<td data-column="dateTime">' + (list[5] == "null" ? '' : list[5]) + '</td>' +
				'<td data-column="Approved By">' + (list[6] == "null" ? '' : list[6]) + '</td>' +
				'<td data-column="implementDate" >' + (list[7] == "null" ? '' : list[7]) + '</td>' +
				'<td data-column="customer">' + (list[10] == "null" ? '' : list[10]) + '</td>' +
				'<td data-column="model" style="width:100px;">' + (list[11] == "null" ? '' : list[11]) + '</td>' +
				'<td style="background-color:Yellow;">Editable</td>' +
				'<td data-column="status" style="display:none;">' + (list[8] == "null" ? '' : list[8]) + '</td>' +
				'</tr>';
		} else if (list[8] == "1") {
			var row = '<tr class="tableDataRows" title="Double click to select the row.">' +
				'<td data-column="columnId" style="width:50px">' + (sequenceNumber + 1) + '</td>' +
				'<td data-column="mispNumber" style="width:100px">' + (list[0] == "null" ? '' : list[0]) + '</td>' +
				'<td data-column="revNumber" style="width:70px">' + (list[1] == "null" ? '' : list[1]) + '</td>' +
				'<td data-column="partNumber">' + (list[2] == "null" ? '' : list[2]) + '</td>' +
				'<td data-column="partDescription" style="width:400px; text-align:left; padding-left:10px;">' + (list[9] == "null" ? '' : list[9]) + '</td>' +
				'<td data-column="noOfParameter">' + (list[3] == "null" ? '' : list[3]) + '</td>' +
				'<td data-column="createdBy">' + (list[4] == "null" ? '' : list[4]) + '</td>' +
				'<td data-column="dateTime">' + (list[5] == "null" ? '' : list[5]) + '</td>' +
				'<td data-column="Approved By">' + (list[6] == "null" ? '' : list[6]) + '</td>' +
				'<td data-column="implementDate" >' + (list[7] == "null" ? '' : list[7]) + '</td>' +
				'<td data-column="customer">' + (list[10] == "null" ? '' : list[10]) + '</td>' +
				'<td data-column="model" >' + (list[11] == "null" ? '' : list[11]) + '</td>' +
				'<td style="background-color:limeGreen; color:white">Approved</td>' +
				'<td data-column="status" style="display:none;">' + (list[8] == "null" ? '' : list[8]) + '</td>' +
				'</tr>';
		} else if (list[8] == "2") {
			var row = '<tr class="tableDataRows" title="Double click to select the row.">' +
				'<td data-column="columnId" style="width:50px">' + (sequenceNumber + 1) + '</td>' +
				'<td data-column="mispNumber" style="width:100px">' + list[0] + '</td>' +
				'<td data-column="revNumber" style="width:70px">' + list[1] + '</td>' +
				'<td data-column="partNumber">' + list[2] + '</td>' +
				'<td data-column="partDescription" style="width:400px; text-align:left; padding-left:10px;">' + list[9] + '</td>' +
				'<td data-column="noOfParameter">' + list[3] + '</td>' +
				'<td data-column="createdBy">' + list[4] + '</td>' +
				'<td data-column="dateTime">' + list[5] + '</td>' +
				'<td data-column="Approved By">' + list[6] + '</td>' +
				'<td data-column="implementDate" >' + list[7] + '</td>' +
				'<td data-column="customer">' + (list[10] == "null" ? '' : list[10]) + '</td>' +
				'<td data-column="model" >' + (list[11] == "null" ? '' : list[11]) + '</td>' +
				'<td style="background-color:red; color:white">Re-Consider</td>' +
				'<td data-column="status" style="display:none;">' + (list[8] == "null" ? '' : list[8]) + '</td>' +
				'</tr>';
		} else if (list[8] == "3") {
			var row = '<tr class="tableDataRows" title="Double click to select the row.">' +
				'<td data-column="columnId" style="width:50px">' + (sequenceNumber + 1) + '</td>' +
				'<td data-column="mispNumber" style="width:100px">' + (list[0] == "null" ? '' : list[0]) + '</td>' +
				'<td data-column="revNumber" style="width:70px">' + (list[1] == "null" ? '' : list[1]) + '</td>' +
				'<td data-column="partNumber">' + (list[2] == "null" ? '' : list[2]) + '</td>' +
				'<td data-column="partDescription" style="width:400px; text-align:left; padding-left:10px;">' + (list[9] == "null" ? '' : list[9]) + '</td>' +
				'<td data-column="noOfParameter">' + (list[3] == "null" ? '' : list[3]) + '</td>' +
				'<td data-column="createdBy">' + (list[4] == "null" ? '' : list[4]) + '</td>' +
				'<td data-column="dateTime">' + (list[5] == "null" ? '' : list[5]) + '</td>' +
				'<td data-column="Approved By">' + (list[6] == "null" ? '' : list[6]) + '</td>' +
				'<td data-column="implementDate" >' + (list[7] == "null" ? '' : list[7]) + '</td>' +
				'<td data-column="customer">' + (list[10] == "null" ? '' : list[10]) + '</td>' +
				'<td data-column="model" >' + (list[11] == "null" ? '' : list[11]) + '</td>' +
				'<td style="background-color:blue; color:white">Approval Pending</td>' +
				'<td data-column="status" style="display:none;">' + (list[8] == "null" ? '' : list[8]) + '</td>' +
				'</tr>';
		} else if (list[8] == "4") {
			var row = '<tr class="tableDataRows" title="Double click to select the row.">' +
				'<td data-column="columnId" style="width:50px">' + (sequenceNumber + 1) + '</td>' +
				'<td data-column="mispNumber" style="width:100px">' + (list[0] == "null" ? '' : list[0]) + '</td>' +
				'<td data-column="revNumber" style="width:70px">' + (list[1] == "null" ? '' : list[1]) + '</td>' +
				'<td data-column="partNumber">' + (list[2] == "null" ? '' : list[2]) + '</td>' +
				'<td data-column="partDescription" style="width:400px; text-align:left; padding-left:10px;">' + (list[9] == "null" ? '' : list[9]) + '</td>' +
				'<td data-column="noOfParameter">' + (list[3] == "null" ? '' : list[3]) + '</td>' +
				'<td data-column="createdBy">' + (list[4] == "null" ? '' : list[4]) + '</td>' +
				'<td data-column="dateTime">' + (list[5] == "null" ? '' : list[5]) + '</td>' +
				'<td data-column="Approved By">' + (list[6] == "null" ? '' : list[6]) + '</td>' +
				'<td data-column="implementDate" >' + (list[7] == "null" ? '' : list[7]) + '</td>' +
				'<td data-column="customer">' + (list[10] == "null" ? '' : list[10]) + '</td>' +
				'<td data-column="model" >' + (list[11] == "null" ? '' : list[11]) + '</td>' +
				'<td style="background-color:orange; color:white">Re-consider</td>' +
				'<td data-column="status" style="display:none;">' + (list[8] == "null" ? '' : list[8]) + '</td>' +
				'</tr>';
		}
		// $('#table1').append(row);
		$("#" + tableId).append(row);
		sequenceNumber++;

	}
}

/*-----------------------------------------MISP Master  RQC Master -------------------------------------*/



/*
$(document).ready(function() {

	$(document).on('click', '#mispMaster', function() {

		searchLoad = true;

		$("#offcanvasCloseButton").click();

		var child1 = document.getElementById("div3");
		var child2 = document.getElementById("div4");

		child1.remove();
		child2.remove();

		document.getElementById("masterHeading").innerText = "";
		$("#masterHeading").append("RQC CREATION MASTER");

		var div3 = document.createElement("div");
		var div4 = document.createElement("div");

		$("#div2").append(div3, div4);

		div3.setAttribute("id", "div3");
		div3.setAttribute("class", "masterBody");

		div4.setAttribute("id", "div4");
		div4.setAttribute("class", "masterBody");
		div4.setAttribute("Style", "overflow-y:scroll;");


		var bottom = document.createElement("div");

		bottom.setAttribute("id", "bottom");
			bottom.setAttribute("style","height: 50%;")

		$("#div4").append(bottom);

		var element1 = document.createElement("table");
		$("#div3").append(element1);
		element1.setAttribute("id", "table1");
		element1.setAttribute("cellspacing", "0px");
		element1.setAttribute("cellpaddding","10px");
		element1.setAttribute("class", "table-hover");
		var w = window.innerWidth;

		if (w < 500) {
			element1.setAttribute("style", "width:300%;");
		} else if (w < 1100) {
			element1.setAttribute("style", "width:200%;");
		}
		else if (w < 1500) {
			element1.setAttribute("style", "width:100%;");
		} else if (w < 2000) {
			element1.setAttribute("style", "width:100%;");
		} else {
			element1.setAttribute("style", "width:100%;");
		}

		var element1_1 = document.createElement("thead");
		element1.append(element1_1);

		var element1_2 = document.createElement("tr");

		var element1_3 = document.createElement("tbody");
		element1.append(element1_3)
		element1_3.setAttribute("id", "tableBody")

		// search
		*******************



		var searchRow = document.createElement("tr");
		searchRow.setAttribute("id", "searchRow");
		var imgContainer = document.createElement("th");
		imgContainer.setAttribute("class", "tableheading");
		var img = document.createElement("img");
		img.setAttribute("src", "/WebApplication/images/searchFilter.png"); img.setAttribute("id", "searchButton");
		img.setAttribute("width", "22");
		img.setAttribute("height", "22");
		imgContainer.append(img);
		searchRow.append(imgContainer);

		var searchTitles = ["searchmispNo", "searchrevNo", "searchPartNumber"];

		for (var i = 0; i < searchTitles.length; i++) {
			var searchContainer = document.createElement("th");
			searchContainer.setAttribute("class", "tableheading");
			var searchinput = document.createElement("input");
			searchinput.setAttribute("style", "width:100%;");
			searchinput.setAttribute("title", searchTitles[i]);
			searchinput.setAttribute("class", "searchFilterClass inputs");
			searchContainer.append(searchinput);
			searchRow.append(searchContainer);
		}

		element1_1.append(searchRow);

		*******************

		element1_1.append(element1_2);

		var element2 = document.createElement("th");
		element2.innerText = "S.No.";
		var element3 = document.createElement("th");
		element3.innerText = "RQC-P No.";
		var element4 = document.createElement("th");
		element4.innerText = "Rev No.";
		var element5 = document.createElement("th");
		element5.innerText = "Part No.";
		var element5_2 = document.createElement("th");
		element5_2.innerText = "Part Description";
		var element6 = document.createElement("th");
		element6.innerText = "No. of Parameter";
		var element7 = document.createElement("th");
		element7.innerText = "Created By";
		var element8 = document.createElement("th");
		element8.innerText = "Date & Time";
		var element9 = document.createElement("th");
		element9.innerText = "Approve / Discard";
		var element9_2 = document.createElement("th");
		element9_2.innerText = "Implement Date";
		var element9_3 = document.createElement("th");
		element9_3.innerText = "Status";
		var element9_4 = document.createElement("th");
		element9_4.innerText = "Customer";
		var element9_5 = document.createElement("th");
		element9_5.innerText = "Model";
		
		element1_2.append(element2, element3, element4, element5, element5_2, element6, element7, element8, element9, element9_2, element9_4,element9_5, element9_3);
		element2.setAttribute("class", "tableheading");
		// element2.setAttribute("scope","col");
		element3.setAttribute("class", "tableheading");
		// element3.setAttribute("scope","col");
		element4.setAttribute("class", "tableheading");
		// element4.setAttribute("scope","col");
		element5.setAttribute("class", "tableheading");
		// element5.setAttribute("scope","col");
		element5_2.setAttribute("class", "tableheading");
		// element5.setAttribute("scope","col");
		element6.setAttribute("class", "tableheading");
		// element6.setAttribute("scope","col");
		element7.setAttribute("class", "tableheading");
		// element7.setAttribute("scope","col");
		element8.setAttribute("class", "tableheading");
		// element8.setAttribute("scope","col");
		element9.setAttribute("class", "tableheading");
		element9_2.setAttribute("class", "tableheading");
		element9_3.setAttribute("class", "tableheading");
		element9_4.setAttribute("class", "tableheading");
		element9_5.setAttribute("class", "tableheading");

		var element18_2 = document.createElement("div");


		var element34 = document.createElement("div");
		var element35 = document.createElement("div");
		var element36 = document.createElement("div");

		$("#bottom").append(element18_2);
		element18_2.append(element34, element35, element36);

		element34.setAttribute("class", "buttonsContainer");
		element35.setAttribute("class", "buttonsContainer");
		element36.setAttribute("class", "buttonsContainer");

		var element37 = document.createElement("button");
		var element38 = document.createElement("button");
		var element39 = document.createElement("button");

		element34.append(element37);
		element35.append(element38);
		element36.append(element39);

		var addbuttonAttr = ["class", "add", "title", "Add", "disabled", "disabled", "style", "opacity:0.5"];
		for (var i = 0; i <= addbuttonAttr.length - 1; i = i + 2) {
			for (var j = 0; j <= i; j = j + 2) {
				element37.setAttribute(addbuttonAttr[i], addbuttonAttr[j + 1]);

			}
		}
		var ediybuttonAttr = ["class", "edit", "title", "Edit", "disabled", "disabled", "style", "opacity:0.5"];
		for (var i = 0; i <= ediybuttonAttr.length - 1; i = i + 2) {
			for (var j = 0; j <= i; j = j + 2) {
				element38.setAttribute(ediybuttonAttr[i], ediybuttonAttr[j + 1]);

			}
		}
		var deletebuttonAttr = ["class", "delete", "title", "Delete", "disabled", "disabled", "style", "opacity:0.5"];
		for (var i = 0; i <= deletebuttonAttr.length - 1; i = i + 2) {
			for (var j = 0; j <= i; j = j + 2) {
				element39.setAttribute(deletebuttonAttr[i], deletebuttonAttr[j + 1]);

			}
		}
		//------------------------------------
		var element40 = document.createElement("div");
		var element41 = document.createElement("div");
		var element42 = document.createElement("div");
		var element42_2 = document.createElement("div");
		var element42_3 = document.createElement("div");


		element18_2.append(element40, element41, element42, element42_2, element42_3);

		element40.setAttribute("class", "buttonsContainer");
		element41.setAttribute("class", "buttonsContainer");
		element42.setAttribute("class", "buttonsContainer");
		element42_2.setAttribute("class", "buttonsContainer");
		element42_3.setAttribute("class", "buttonsContainer");

		var element43 = document.createElement("button");
		element43.setAttribute("class", "template");
		element43.setAttribute("title", "Template");


		var element44 = document.createElement("button");
		element44.setAttribute("class", "data");
		element44.setAttribute("title", "Excel Download");

		var element45 = document.createElement("button");
		element45.setAttribute("class", "upload");
		element45.setAttribute("title", "Excel Upload"); element45.setAttribute("style", "opacity:0.5"); element45.setAttribute("disabled", "disabled");

		var element45_2 = document.createElement("button");
		element45_2.setAttribute("class", "summerize");
		element45_2.setAttribute("title", "RQC-P Review");

		var element45_3 = document.createElement("button");
		element45_3.setAttribute("class", "userDetails");
		element45_3.setAttribute("title", "User");

		element40.append(element43);
		element41.append(element44);
		element42.append(element45);
		element42_2.append(element45_2);
		element42_3.append(element45_3);
		getIdByMasterName($(this).attr('id'));
		loadLikeMispMasterData(0);

	});
});
*/
/*
function makePager(response, page) {

	$("#pageSelect").empty();
	for (var i = 0; i < Math.ceil(parseInt(response) / pageSize); i++) {
		$("#pageSelect").append("<option value='" + i + "'>" + (i + 1) + "</option>");
	}
	$("#pageSelect").val(page);

}
*/
/*
function loadLikeMispMasterData(page) {

	var mispNumber = $('input[title="searchmispNo"]').val() ?? "";
	var revNumber = $('input[title="searchrevNo"]').val() ?? "";
	var partNumber = $('input[title="searchPartNumber"]').val() ?? "";

	var formData = {
		mispNumber: mispNumber,
		revNumber: revNumber,
		partNumber: partNumber
	}

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getLikeMispNo/' + page,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {
			makePager(res.mispMasterPager, page);
			insertMispMasterInTable(res.mispMaster);
		}, error: function(response) {
			$("#warningInformationModalBody").text(response.responseText);
			$("#warningBackdropButton").click();
		}
	});
}
*/


//   of no use
function createUploadQualityInputs() {

	var element10 = document.createElement("div");
	var element11 = document.createElement("div");
	var element12 = document.createElement("div");
	var element13 = document.createElement("div");
	var element14 = document.createElement("div");
	var element15 = document.createElement("div");


	$("#addEditDeleteModalBody").append(element11, element12, element13, element14);
	element10.setAttribute("class", "dataContainer headingContainer");
	element11.setAttribute("class", "dataContainer smallContainer");
	element12.setAttribute("class", "dataContainer smallContainer");
	element13.setAttribute("class", "dataContainer smallContainer");
	element14.setAttribute("class", "dataContainer smallContainer");
	element15.setAttribute("class", "dataContainer smallContainer");

	var element20 = document.createElement("span");
	element20.setAttribute("class", "heading3");
	element20.innerText = "Part No. :";

	var element21 = document.createElement("span");
	element21.setAttribute("class", "heading3");
	element21.innerText = "Rev No. :";

	var element22 = document.createElement("span");
	element22.setAttribute("class", "heading3");
	element22.innerText = "Part Not Image (PDF) :";

	var element23 = document.createElement("span");
	element23.setAttribute("class", "heading3");
	element23.innerText = "Part No's Parameter (.xlsx):";


	var element27 = document.createElement("input");
	element11.append(element20, element27);
	var element27Attr = ["type", "number", "placeholder", "Part No....", "id", "input1", "class", "inputs", "autocomplete", "off", "name", "PartNumber"];

	for (var i = 0; i <= element27Attr.length - 1; i = i + 2) {
		for (var j = 0; j <= i; j = j + 2) {
			element27.setAttribute(element27Attr[i], element27Attr[j + 1]);

		}
	}

	var element28 = document.createElement("input");
	element13.append(element22, element28);
	var element28Attr = ["type", "file", "name", "PartNumberImage", "id", "input3", "style", "margin-top:4%"];

	for (var i = 0; i <= element28Attr.length - 1; i = i + 2) {
		for (var j = 0; j <= i; j = j + 2) {
			element28.setAttribute(element28Attr[i], element28Attr[j + 1]);

		}
	}

	var element29 = document.createElement("input");
	var element29Attr = ["type", "number", "placeholder", "Rev No....", "id", "input2", "class", "inputs", "autocomplete", "off", "name", "revNumber"];
	element12.append(element21, element29);
	for (var i = 0; i <= element29Attr.length - 1; i = i + 2) {
		for (var j = 0; j <= i; j = j + 2) {
			element29.setAttribute(element29Attr[i], element29Attr[j + 1]);

		}
	}

	var element30 = document.createElement("input");
	var element30Attr = ["type", "file", "name", "PartNumberImage", "id", "input4", "style", "margin-top:4%"];
	element14.append(element23, element30);
	for (var i = 0; i <= element30Attr.length - 1; i = i + 2) {
		for (var j = 0; j <= i; j = j + 2) {
			element30.setAttribute(element30Attr[i], element30Attr[j + 1]);

		}
	}

}


// used css of rqc.css for this purpose
window.createQualityMasterInputs=createQualityMasterInputs;
function createQualityMasterInputs(modalBodyId) {

	$("#" + modalBodyId).empty();
	
	var element10 = document.createElement("div");
	var element11 = document.createElement("div");
	var element12 = document.createElement("div");
	var element13 = document.createElement("div");
	var element14 = document.createElement("div");
	var element15 = document.createElement("div");
	var element16 = document.createElement("div");
	var element17 = document.createElement("div");
	var element18 = document.createElement("div");


	$("#addEditDeleteModalBody").append(element11, element12, element14, element13);
	element10.setAttribute("class", "dataContainer headingContainer");
	element11.setAttribute("class", "dataContainer smallContainer");
	element12.setAttribute("class", "dataContainer smallContainer");
	element13.setAttribute("class", "dataContainer");
	element14.setAttribute("class", "dataContainer");
	element15.setAttribute("class", "dataContainer smallContainer");
	element16.setAttribute("class", "dataContainer");
	element17.setAttribute("class", "dataContainer smallContainer");
	element18.setAttribute("class", "dataContainer smallContainer");


	var element20 = document.createElement("span");
	element20.setAttribute("class", "heading2");
	element20.innerText = "Select Part Image (PDF)";

	var button = document.createElement("button");
	button.setAttribute("id", "createNewParameter");
	button.innerText = "New Parameter";


	var element27 = document.createElement("input");
	var element27Attr = ["type", "text", "placeholder", "Part No....", "id", "input1", "class", "inputs", "autocomplete", "off", "name", "PartNumber", "list", "partNumberDataList"];

	for (var i = 0; i <= element27Attr.length - 1; i = i + 2) {
		for (var j = 0; j <= i; j = j + 2) {
			element27.setAttribute(element27Attr[i], element27Attr[j + 1]);

		}
	}

	var element28 = document.createElement("input");
	element12.append(element16, element17, element18);
	element16.append(element20);
	element17.append(element28);
	element18.append(button);
	var element28Attr = ["type", "file", "name", "PartNumberImage", "id", "input3", "style", "margin-top:4%", "accept", "application/pdf"];

	for (var i = 0; i <= element28Attr.length - 1; i = i + 2) {
		for (var j = 0; j <= i; j = j + 2) {
			element28.setAttribute(element28Attr[i], element28Attr[j + 1]);

		}
	}


	var element29 = document.createElement("datalist");
	var element29Attr = ["id", "partNumberDataList"];

	for (var i = 0; i <= element29Attr.length - 1; i = i + 2) {
		for (var j = 0; j <= i; j = j + 2) {
			element29.setAttribute(element29Attr[i], element29Attr[j + 1]);

		}
	}


	var table = document.createElement("table");
	table.setAttribute("style", "width:100%;")
	table.setAttribute("id", "parameterTable");
	var thead = document.createElement("thead");
	thead.setAttribute("id", "parameterTableHead")
	var tbody = document.createElement("tbody");
	tbody.setAttribute("id", "parameterTableBody")

	var tr = document.createElement("tr");
	var tr1 = document.createElement("tr");
	var tr2 = document.createElement("tr");

	var sNo = document.createElement("th");
	sNo.setAttribute("class", "tableheading");
	sNo.innerText = "S No.";

	var th = document.createElement("th");
	th.setAttribute("class", "tableheading");
	th.innerText = "Insp. Item";

	var th1 = document.createElement("th");
	th1.setAttribute("class", "tableheading");
	th1.innerText = "Criteria";

	var th2 = document.createElement("th");
	th2.setAttribute("class", "tableheading");
	th2.innerText = "Insp. Method";

	var th3 = document.createElement("th");
	th3.setAttribute("class", "tableheading");
	th3.innerText = "Insp. Tool";

	var th4 = document.createElement("th");
	th4.setAttribute("class", "tableheading");
	th4.innerText = "Min. Val";

	var th5 = document.createElement("th");
	th5.setAttribute("class", "tableheading");
	th5.innerText = "Max. Val";

	var th6 = document.createElement("th");
	th6.setAttribute("class", "tableheading");
	th6.innerText = "Samples";

	var th6_1 = document.createElement("th");
	th6_1.setAttribute("class", "tableheading");
	th6_1.innerText = "Mul. Dim. Val.";

	
	var th7 = document.createElement("th");
	th7.setAttribute("class", "tableheading");
	

	var th8 = document.createElement("th");
	th8.setAttribute("class", "tableheading");
	th8.innerText = "Part No";

	var th9 = document.createElement("th");
	th9.setAttribute("class", "tableheading");
	th9.innerText = "Description";

	var th10 = document.createElement("th");
	th10.setAttribute("class", "tableheading");
	th10.innerText = "UOM";


	element13.append(table);
	table.append(thead, tbody);
	thead.append(tr);
	tr.append(sNo, th, th1, th2, th3, th4, th5, th6, th6_1, th7);


	var table1 = document.createElement("table");
	table1.setAttribute("style", "width:100%;, margin-bottom:2%;");
	table1.setAttribute("id", "partDescriptionTable");
	var thead1 = document.createElement("thead");
	thead1.setAttribute("id", "partDescriptionHead")
	var tbody1 = document.createElement("tbody");
	tbody1.setAttribute("id", "partDescriptionBody");


	element11.append(table1);
	table1.append(thead1, tbody1);
	thead1.append(tr1, tr2);
	tr1.append(th8, th9, th10);

	var td = document.createElement("td");
	td.setAttribute("id", "partNumberContainer");
	td.setAttribute("style", "width:70px;");
	td.append(element27, element29);

	var td1 = document.createElement("td");
	td1.setAttribute("id", "partDescriptionContainer");
	td1.setAttribute("style", "width:180px;font-size:13px;text-align:left;padding-left:10px;");

	var td2 = document.createElement("td");
	td2.setAttribute("id", "uomContainer");
	td2.setAttribute("style", "width:30px;font-size:13px;");

	tr2.append(td, td1, td2);
	tr2.setAttribute("id", "tableDataRows");
	tr2.setAttribute("style", "background-color:white;");
	
	
	/*  adding customer and model input in the modal and appending in the tbody1  */
	
	// Create new row for Customer and Model
	var tr3 = document.createElement("tr");
	tr3.setAttribute("id", "customerModelRow");
	tr3.setAttribute("style", "background-color:white;");

	// Customer cell
	var customerTd = document.createElement("td");
	customerTd.setAttribute("colspan", "2");
	customerTd.setAttribute("style", "padding: 5px 10px;");

	var customerLabel = document.createElement("label");
	customerLabel.innerText = "Customer: ";
	customerLabel.setAttribute("style", "margin-right: 5px; font-weight: bold;");

	
	// Customer dropdown
	var customerSelect = document.createElement("select");
	customerSelect.setAttribute("id", "inputCustomer");
	customerSelect.setAttribute("class", "inputs2");
	customerSelect.setAttribute("style", "width: 60%;");

	// Append label and input
	customerTd.append(customerLabel, customerSelect);

	// Model cell
	var modelTd = document.createElement("td");
	modelTd.setAttribute("style", "padding: 5px 10px;");

	var modelLabel = document.createElement("label");
	modelLabel.innerText = "Model: ";
	modelLabel.setAttribute("style", "margin-right: 5px; font-weight: bold;");

	
	// Model dropdown
	var modelSelect = document.createElement("select");
	modelSelect.setAttribute("id", "inputModel");
	modelSelect.setAttribute("class", "inputs2");
	modelSelect.setAttribute("style", "width: 60%;");

	// Append label and input
	modelTd.append(modelLabel, modelSelect);


	// Append both cells to row
	tr3.append(customerTd, modelTd);

	// Append the new row to tbody
	tbody1.appendChild(tr3);

	loadCustomerDropdown();
	

}

// Reusable function to load customers (and optionally preselect + load model)
window.loadCustomerDropdown = loadCustomerDropdown;
function loadCustomerDropdown(selectedCustomer = "", selectedModel = "") {
    $.ajax({
        url: "/WebApplication/Controllers/getAllCustomers",
        type: "GET",
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
        success: function (customers) {
            const customerSelect = document.getElementById("inputCustomer");
            customerSelect.innerHTML = '<option value="">-- Select Customer --</option>';
            customers.forEach(cust => {
                const opt = document.createElement("option");
                opt.value = cust;
                opt.textContent = cust;
                customerSelect.appendChild(opt);
            });

            if (selectedCustomer) {
                $("#inputCustomer").val(selectedCustomer).prop("disabled", false);
                loadModelDropdown(selectedCustomer, selectedModel);
				console.log(" hel");
            }
        }
    });
}
// Keep this if manual change is needed
$(document).on("change", "#inputCustomer", function () {
  const selectedCustomer = this.value;
  loadModelDropdown(selectedCustomer); // Load models manually when dropdown changes
});

// Reusable model loader
function loadModelDropdown(customer, selectedModel = "") {
    const modelSelect = document.getElementById("inputModel");
    modelSelect.innerHTML = '<option value="">-- Select Model --</option>';

    if (customer) {
        $.ajax({
            url: `/WebApplication/Controllers/getModelsByCustomer/${encodeURIComponent(customer)}`,
            type: "GET",
            headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
            success: function (models) {
                models.forEach(model => {
                    const opt = document.createElement("option");
                    opt.value = model;
                    opt.textContent = model;
                    modelSelect.appendChild(opt);
                });

                if (selectedModel) {
                    $("#inputModel").val(selectedModel).prop("disabled", false);
                }
            }
        });
    }
}

// name is older but internally code is changed
window.getAllPartNoFromBom = getAllPartNoFromBom;
function getAllPartNoFromBom() {
	$.ajax({
		url: "/WebApplication/Controllers/getAllPartNoInList",
		type: 'GET',
		contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		dataType: 'json',
		success: function(res) {
			for (var i = 0; i < res.length; i++) {
				var row = '<option value="' + res[i] + '">';
				$('#partNumberDataList').append(row);
			}
		}
	});
}

// name is older but internally code is changed
window.getDescriptionAndUom = getDescriptionAndUom;
function getDescriptionAndUom() {

	var partNumber = $("input[name=PartNumber]").val();

	$.ajax({
		url: "/WebApplication/Controllers/getDescriptionAndUomInList/" + partNumber,
		type: 'GET',
		contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		/*async: false,*/
		dataType: 'json',
		success: function(res) {
			for (var i = 0; i < res.length; i++) {
				var str = res[i];
				var desc_uom = str.split(',');
				$("#partDescriptionContainer").text(desc_uom[0]);
				$("#uomContainer").text(desc_uom[1]);
				
				console.log(res);
			}
		}, error: function(response) {
			$("#partDescriptionContainer").text(response.responseText);
			$("#uomContainer").text(response.responseText);
		}
	});
}


function getCustomerModelAndDescription() {

	var partNumber = $("input[name=PartNumber]").val();

	$.ajax({
		url: "/WebApplication/Controllers/getProductDescriptionAndUomInList/" + partNumber,
		type: 'GET',
		contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		/*async: false,*/
		dataType: 'json',
		success: function(res) {
			for (var i = 0; i < res.length; i++) {
				var str = res[i];
				var desc_uom = str.split(',');
				$("#customerPartContainer").text(desc_uom[0]);
				$("#modelContainer").text(desc_uom[1]);
				$("#DescriptionContainer").text(desc_uom[2]);
			}
		}, error: function(response) {
			$("#customerPartContainer").text(response.responseText);
			$("#modelContainer").text(response.responseText);
			$("#DescriptionContainer").text(response.responseText);
		}
	});
}



function getApproveMispNumberWithImplementDate() {

	$.ajax({
		url: "/WebApplication/Controllers/getApproveMispNumberInList",
		type: 'GET',
		contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		/*	async: false,*/
		dataType: 'json',
		success: function(res) {
			for (var i = 0; i < res.length; i++) {
				var str = res[i];
				var mispNumber = str.split(',');
				var row = '<option value="' + mispNumber[1] + '">';
				$('#mispNumberDataList').append(row);
			}
		}
	});
}

// for  "FINAL INSPECTION RQC-P AND PRODUCT MAPPING"
/*
function getApproveFinalControlMispNumberWithImplementDate() {

	$.ajax({
		url: "/WebApplication/Controllers/getApproveFinalControlMispNumberInList",
		type: 'GET',
		contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
			async: false,
		dataType: 'json',
		success: function(res) {
			for (var i = 0; i < res.length; i++) {
				var str = res[i];
				var mispNumber = str.split(',');
				var row = '<option value="' + mispNumber[1] + '">';
				$('#mispNumberDataList').append(row);
			}
		}
	});
}
*/

// "RQC-P AND PART MAPPING"
/*
function getRevAndPart() {

	var mispNumber = $("input[name=mispNumber]").val();

	$.ajax({
		url: "/WebApplication/Controllers/getApproveMispNumberParameters/" + mispNumber,
		type: 'GET',
		contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		async: false,
		dataType: 'json',
		success: function(response) {
			if (response.length == "0") {

				$("#detailTableBody").remove();
				var tablebody = document.createElement("tbody");
				tablebody.setAttribute("id", "detailTableBody");

				$("#detailTable").append(tablebody);

				$("#responseContainer").text("NO Parameter found as per implement date aganist RQC-P No = " + mispNumber);
				$("#responseContainer").attr("style", "font-size:15px;color:red; width:80%; height:30px; text-align:center;");

			} else {

				$("#revNumberContainer").text(response[0].revNumber);
				$("#partNumberContainer").text(response[0].partNumber);
				$("#mispPartNumberContainer").text(response[0].partDescription);
				var img = document.createElement("img");
				img.setAttribute("src", "/WebApplication/Controllers/rqcuploadImages/" + response[0].partNumber + "_" + response[0].revNumber + ".png");
				img.setAttribute("style", "width:" + imageWidth + "%");
				$("#imageContainer").css("background-image", "url('/WebApplication/uploadImages/" + Inspectionlist[11] + ".png')");
				$("#mispImageContainer").children("img").remove();
				$("#mispImageContainer").append(img);
				$("#mispImageContainer").css("background-image", "url('/WebApplication/uploadImages/" + response[0].partNumber + ".png')");
				insertApproveMispParameterWithImplementdate(response);
			}

		}
	});
}*/

// for "FINAL INSPECTION RQC-P AND PRODUCT MAPPING"
/*
function getFinalControlRevAndPart() {

	var mispNumber = $("input[name=mispNumber]").val();

	$.ajax({
		url: "/WebApplication/Controllers/getApproveFinalControlMispNumberParameters/" + mispNumber,
		type: 'GET',
		contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		async: false,
		dataType: 'json',
		success: function(response) {
			if (response.length == "0") {

				$("#detailTableBody").remove();
				var tablebody = document.createElement("tbody");
				tablebody.setAttribute("id", "detailTableBody");

				$("#detailTable").append(tablebody);

				$("#responseContainer").text("NO Parameter found as per implement date aganist RQC-P No = " + mispNumber);
				$("#responseContainer").attr("style", "font-size:15px;color:red; width:80%; height:30px; text-align:center;");

			} else {

				$("#revNumberContainer").text(response[0].revNumber);
				$("#partNumberContainer").text(response[0].partNumber);
				$("#mispPartNumberContainer").text(response[0].partDescription);
				$("#mispImageContainer").css("background-image", "url('/WebApplication/uploadImages/" + response[0].partNumber + ".png')");
				var img = document.createElement("img");
				img.setAttribute("src", "/WebApplication/Controllers/rqcuploadImages/" + response[0].partNumber + "_" + response[0].revNumber + ".png");
				img.setAttribute("style", "width:" + imageWidth + "%");
				$("#imageContainer").css("background-image", "url('/WebApplication/uploadImages/" + Inspectionlist[11] + ".png')");
				$("#mispImageContainer").children("img").remove();
				$("#mispImageContainer").append(img);
				insertApproveFinalControlMispParameterWithImplementdate(response);
			}

		}
	});
}
*/

//  "RQC-P AND PART MAPPING"  was  used in getRevAndPart
/*
function insertApproveMispParameterWithImplementdate($item) {

	$("#detailTableBody").remove();
	var tablebody = document.createElement("tbody");
	tablebody.setAttribute("id", "detailTableBody");

	$("#detailTable").append(tablebody);

	$.each($item, function(index, value) {

		var row = '<tr class="smalTextRows">' +
			'<td data-column="columnId" style="width:40px;">' + (index + 1) + '</td>' +
			'<td data-column="inspectionItem" >' + value.inspectionItem + '</td>' +
			'<td data-column="criteria">' + value.criteria + '</td>' +
			'<td data-column="method">' + value.inspectionMethod + '</td>' +
			'<td data-column="instrumentName">' + value.instrument.instrumentName + '</td>' +
			'<td data-column="min">' + value.min + '</td>' +
			'<td data-column="max">' + value.max + '</td>' +
			'<td data-column="samplingPlan">' + value.samplingPlan + '</td>' +
			'<td data-column="qualityId" id="qualityId' + (index + 1) + '" style="display:none;">' + value.qualityId + '</td>' +
			'</tr>';
		$('#detailTable').append(row);
	});

}
*/

// // for "FINAL INSPECTION RQC-P AND PRODUCT MAPPING"  was used in getFinalControlRevAndPart() 
/*
function insertApproveFinalControlMispParameterWithImplementdate($item) {

	$("#detailTableBody").remove();
	var tablebody = document.createElement("tbody");
	tablebody.setAttribute("id", "detailTableBody");

	$("#detailTable").append(tablebody);

	$.each($item, function(index, value) {

		var row = '<tr class="smalTextRows">' +
			'<td data-column="columnId" style="width:40px;">' + (index + 1) + '</td>' +
			'<td data-column="inspectionItem" >' + value.inspectionItem + '</td>' +
			'<td data-column="criteria">' + value.criteria + '</td>' +
			'<td data-column="method">' + value.inspectionMethod + '</td>' +
			'<td data-column="instrumentName">' + value.instrument.instrumentName + '</td>' +
			'<td data-column="min">' + value.min + '</td>' +
			'<td data-column="max">' + value.max + '</td>' +
			'<td data-column="samplingPlan">' + value.samplingPlan + '</td>' +
			'<td data-column="qualityId" id="qualityId' + (index + 1) + '" style="display:none;">' + value.finalControlId + '</td>' +
			'</tr>';
		$('#detailTable').append(row);
	});

}*/

function createNewParameter() {

	var tr = document.createElement("tr");
	tr.setAttribute("id", NoOfParameter);
	tr.setAttribute("class", "tableDataRows");

	var sNo = document.createElement("td");
	sNo.setAttribute("style", "padding-left:10px;width:60px;");
	sNo.innerText = NoOfParameter;

	var td = document.createElement("td");
	var input = document.createElement("input");
	td.append(input);

	var inputAttr = ["style", "width:80%; margin-left:10px;", "type", "text", "placeholder", "Item...", "id", parameterTypeList[0] + NoOfParameter, "class", "inputs2 inspectionItem textInput", "autocomplete", "off", "name", parameterTypeList[0] + NoOfParameter];
	for (var i = 0; i <= inputAttr.length - 1; i = i + 2) {
		for (var j = 0; j <= i; j = j + 2) {
			input.setAttribute(inputAttr[i], inputAttr[j + 1]);

		}
	}

	var td1 = document.createElement("td");
	var input1 = document.createElement("input");
	td1.append(input1);

	var input1Attr = ["style", "width:80%; margin-left:10px;", "type", "text", "placeholder", "Criteria...", "id", parameterTypeList[1] + NoOfParameter, "class", "inputs2", "autocomplete", "off", "name", parameterTypeList[1] + NoOfParameter];
	for (var i = 0; i <= input1Attr.length - 1; i = i + 2) {
		for (var j = 0; j <= i; j = j + 2) {
			input1.setAttribute(input1Attr[i], input1Attr[j + 1]);

		}
	}

	var td2 = document.createElement("td");
	td2.setAttribute("style", "padding-left:10px;width:150px;");
	var input2 = document.createElement("select");
	var option = document.createElement("option");
	option.innerText = "Select";
	option.setAttribute("value", "Select");
	/*var option1 = document.createElement("option");
	option1.innerText = "visual";
	option1.setAttribute("value", "visual");
	var option2 = document.createElement("option");
	option2.innerText = "measure";
	option2.setAttribute("value", "measure");*/
	input2.append(option);
	td2.append(input2);

	var input2Attr = ["style", "width:80%; margin-left:10px;", "id", parameterTypeList[2] + NoOfParameter, "class", "inputs2 visualMeasure", "name", parameterTypeList[2] + NoOfParameter];
	for (var i = 0; i <= input2Attr.length - 1; i = i + 2) {
		for (var j = 0; j <= i; j = j + 2) {
			input2.setAttribute(input2Attr[i], input2Attr[j + 1]);

		}
	}

	var td3 = document.createElement("td");

	td3.setAttribute("style", "padding-left:10px;width:150px;");
	var input3 = document.createElement("select");
	var option3 = document.createElement("option");
	option3.innerText = "Select";
	option3.setAttribute("value", "Select");
	input3.append(option3);
	td3.append(input3);

	var input3Attr = ["style", "width:80%; margin-left:10px;", "id", parameterTypeList[3] + NoOfParameter, "class", "inputs2", "autocomplete", "off", "name", parameterTypeList[3] + NoOfParameter];
	for (var i = 0; i <= input3Attr.length - 1; i = i + 2) {
		for (var j = 0; j <= i; j = j + 2) {
			input3.setAttribute(input3Attr[i], input3Attr[j + 1]);
		}
	}


	var td4 = document.createElement("td");
	var input4 = document.createElement("input");
	td4.append(input4);

	var input4Attr = ["style", "width:80%; margin-left:10px;", "type", "number", "placeholder", "Min...", "id", parameterTypeList[4] + NoOfParameter, "class", "inputs2", "autocomplete", "off", "name", parameterTypeList[4] + NoOfParameter, "disabled", "disabled"];
	for (var i = 0; i <= input4Attr.length - 1; i = i + 2) {
		for (var j = 0; j <= i; j = j + 2) {
			input4.setAttribute(input4Attr[i], input4Attr[j + 1]);

		}
	}


	var td5 = document.createElement("td");
	var input5 = document.createElement("input");
	td5.append(input5);

	var input5Attr = ["style", "width:80%; margin-left:10px;", "type", "number", "placeholder", "Max...", "id", parameterTypeList[5] + NoOfParameter, "class", "inputs2", "autocomplete", "off", "name", parameterTypeList[5] + NoOfParameter, "disabled", "disabled"];
	for (var i = 0; i <= input5Attr.length - 1; i = i + 2) {
		for (var j = 0; j <= i; j = j + 2) {
			input5.setAttribute(input5Attr[i], input5Attr[j + 1]);

		}
	}

	var td6 = document.createElement("td");
	var input6 = document.createElement("input");
	td6.append(input6);

	var input6Attr = ["style", "width:80%; margin-left:10px;", "type", "text", "placeholder", "Sample plan...", "id", parameterTypeList[6] + NoOfParameter, "class", "inputs2 samplingPlan", "name", parameterTypeList[6] + NoOfParameter];
	for (var i = 0; i <= input6Attr.length - 1; i = i + 2) {
		for (var j = 0; j <= i; j = j + 2) {
			input6.setAttribute(input6Attr[i], input6Attr[j + 1]);

		}
	}
	
	var td6_1 = document.createElement("td");
	var input6_1 = document.createElement("input");
	td6_1.append(input6_1);

	var input6_1Attr = ["style", "width:80%; margin-left:10px;", "type", "number", "placeholder", "Multi-Dimension Value...", "id", parameterTypeList[7] + NoOfParameter, "class", "inputs2 multiDimensionValue", "name", parameterTypeList[7] + NoOfParameter];
	for (var i = 0; i <= input6_1Attr.length - 1; i = i + 2) {
		for (var j = 0; j <= i; j = j + 2) {
			input6_1.setAttribute(input6_1Attr[i], input6_1Attr[j + 1]);

		}
	}

	var td7 = document.createElement("td");
	td7.setAttribute("style", "width:100px;");

	var td8 = document.createElement("td");
	td8.setAttribute("id", "qualityId" + NoOfParameter);
	td8.setAttribute("style", "display:none");


	var button = document.createElement("button");
	var button2 = document.createElement("button");

	td7.append(button2, button);


	var buttonAttr = ["id", ("remove" + NoOfParameter), "class", "remove"];
	for (var i = 0; i <= buttonAttr.length - 1; i = i + 2) {
		for (var j = 0; j <= i; j = j + 2) {
			button.setAttribute(buttonAttr[i], buttonAttr[j + 1]);

		}
	}

	var button2Attr = ["id", ("edit" + NoOfParameter), "class", "rowEdit"];
	for (var i = 0; i <= button2Attr.length - 1; i = i + 2) {
		for (var j = 0; j <= i; j = j + 2) {
			button2.setAttribute(button2Attr[i], button2Attr[j + 1]);

		}
	}



	$("#parameterTableBody").append(tr);
	tr.append(td8, sNo, td, td1, td2, td3, td4, td5, td6,  td6_1, td7,);

	getAllMethodInQualityList();

	// Trigger when criteria changes
	$("#" + parameterTypeList[1] + NoOfParameter).on("input", function () {
	    autoUpdateTolerance(NoOfParameter);
	});

	// Trigger when inspection method changes
	$("#" + parameterTypeList[2] + NoOfParameter).on("change", function () {
	    autoUpdateTolerance(NoOfParameter);
	});

	console.log("NoOfParameter", NoOfParameter);

} 

function createAndCheckNewParameter() {

	var partNumber = $("input[name=PartNumber]").val();

	if (!partNumber) {
		$("#responseContainer").text("Part Number is mandatory to create parameter");
		$("#responseContainer").attr("style", "font-size:15px;color:red; width:60%; height:30px; text-align:center;");

		setTimeout(function() {

		}, 3000)
	} else {
		var inspectionItem = $("input[name=" + parameterTypeList[0] + NoOfParameter + "]").val();
		var criteria = $("input[name=" + parameterTypeList[1] + NoOfParameter + "]").val();
		var inspectionMethod = $('#' + parameterTypeList[2] + NoOfParameter + ' :selected').val();
		var inspectionTool = $('#' + parameterTypeList[3] + NoOfParameter + ' :selected').val();
		var min = $("input[name=" + parameterTypeList[4] + NoOfParameter + "]").val();
		var max = $("input[name=" + parameterTypeList[5] + NoOfParameter + "]").val();
		var samplingplan = $("input[name=" + parameterTypeList[6] + NoOfParameter + "]").val();
		var multidimensionval = $("input[name=" + parameterTypeList[7] + NoOfParameter + "]").val();

		if (NoOfParameter == "0") {
			NoOfParameter++;
			currentEditableRow = NoOfParameter;
			createNewParameter();
			$("#input1").attr("disabled", "disabled");
		} else {

			if (inspectionMethod.toLowerCase() == "visual" ||  inspectionMethod.toLowerCase() == "calendar" ||  inspectionMethod.toLowerCase() == "cavity") {
				if (!inspectionItem || !criteria || inspectionMethod == "Select" || inspectionTool == "Select" || !samplingplan || !multidimensionval) {

					$("#responseContainer").text("To create next parameter please fill the existing parameter details.");
					$("#responseContainer").attr("style", "font-size:15px;color:red; width:60%; height:30px; text-align:center;");
					
					setTimeout(function() {
						$("#responseContainer").text("");  // clears the text
						$("#responseContainer").removeAttr("style"); // optional: removes the styling as well
					}, 2000);

				} else {
					disabledParameterRow(); 
					removeId = "#remove" + NoOfParameter;
					$(removeId).remove();
					NoOfParameter++;
					currentEditableRow = NoOfParameter;
					createNewParameter();
				}
			} else {
				if (!inspectionItem || !criteria || inspectionMethod == "Select" || inspectionTool == "Select" || !min || !max || !samplingplan || !multidimensionval) {

					$("#responseContainer").text("To create next parameter please fill the existing parameter details.");
					$("#responseContainer").attr("style", "font-size:15px;color:red; width:60%; height:30px; text-align:center;");

					setTimeout(function() {
						$("#responseContainer").text("");  // clears the text
						$("#responseContainer").removeAttr("style"); // optional: removes the styling as well
					}, 2000)

				} else {
					disabledParameterRow();
					removeId = "#remove" + NoOfParameter;
					$(removeId).remove();
					NoOfParameter++;
					currentEditableRow = NoOfParameter;
					createNewParameter();
				}
			}
		}
	}
}

function disabledParameterRow(rowNumber) {
	if (!rowNumber) {
		$("#" + parameterTypeList[0] + NoOfParameter).attr("disabled", "disabled");
		$("#" + parameterTypeList[1] + NoOfParameter).attr("disabled", "disabled");
		$("#" + parameterTypeList[2] + NoOfParameter).attr("disabled", "disabled");
		$("#" + parameterTypeList[3] + NoOfParameter).attr("disabled", "disabled");
		$("#" + parameterTypeList[4] + NoOfParameter).attr("disabled", "disabled");
		$("#" + parameterTypeList[5] + NoOfParameter).attr("disabled", "disabled");
		$("#" + parameterTypeList[6] + NoOfParameter).attr("disabled", "disabled");
		$("#" + parameterTypeList[7] + NoOfParameter).attr("disabled", "disabled");
	} else {
		$("#" + parameterTypeList[0] + rowNumber).attr("disabled", "disabled");
		$("#" + parameterTypeList[1] + rowNumber).attr("disabled", "disabled");
		$("#" + parameterTypeList[2] + rowNumber).attr("disabled", "disabled");
		$("#" + parameterTypeList[3] + rowNumber).attr("disabled", "disabled");
		$("#" + parameterTypeList[4] + rowNumber).attr("disabled", "disabled");
		$("#" + parameterTypeList[5] + rowNumber).attr("disabled", "disabled");
		$("#" + parameterTypeList[6] + rowNumber).attr("disabled", "disabled");
		$("#" + parameterTypeList[7] + rowNumber).attr("disabled", "disabled");
	}
}


function enableParameterRow(rowNumber) {

	var inspectionMethod = $('#' + (parameterTypeList[2] + rowNumber) + ' :selected').val();
	
	// console.log("parameterTypeList", parameterTypeList);
	// console.log("inspectionMethod", inspectionMethod);
	$("#" + parameterTypeList[0] + rowNumber).removeAttr("disabled", "disabled");
	$("#" + parameterTypeList[1] + rowNumber).removeAttr("disabled", "disabled");
	$("#" + parameterTypeList[2] + rowNumber).removeAttr("disabled", "disabled");
	$("#" + parameterTypeList[3] + rowNumber).removeAttr("disabled", "disabled");
	
	// Now check the inspection method
	if(inspectionMethod && inspectionMethod.toLowerCase() != "visual" && inspectionMethod.toLowerCase() != "calendar" && inspectionMethod.toLowerCase() != "cavity") {

	    // Disable these extra fields only if not one of the 3 special cases
		$("#" + parameterTypeList[4] + rowNumber).removeAttr("disabled", "disabled");
		$("#" + parameterTypeList[5] + rowNumber).removeAttr("disabled", "disabled");
	}
	$("#" + parameterTypeList[6] + rowNumber).removeAttr("disabled", "disabled");
	$("#" + parameterTypeList[7] + rowNumber).removeAttr("disabled", "disabled");
}


$(document).on('click', '#createNewParameter', function() {
	// Get the content of the partDescriptionContainer cell
	  const partDescription = document.getElementById("partDescriptionContainer").textContent.trim();

	  // If it's empty, show an error message and return early
	  if (!partDescription) {
	      $("#responseContainer").text("Please Press Enter after filling the part number");
	      $("#responseContainer").attr("style", "font-size:15px;color:red; width:60%; height:30px; text-align:center;");
	      return;
	  }
	createAndCheckNewParameter();
	$(".inspectionItem").focus();
});

$(document).on('click', '.remove', function() {

	var selfButtonId = $(this).attr("id");
	var selfDataArray = selfButtonId.match(/[a-z]+|[^a-z]+/gi);

	var text = document.getElementById("masterHeading").innerHTML;
	if (text == "RQC CREATION MASTER") {

		if (selfDataArray[1] == "1") {
			alert("You cannot delete this parameter because one parameter is always mandatory for RQCP No.")
			return;
		}

		var qualityId = $("#qualityId" + selfDataArray[1]).text();
		deleteParameter(qualityId);

		var button = document.createElement("button");
		$("#" + (selfDataArray[1] - 1) + " " + "td:last").append(button);

		var buttonAttr = ["id", "remove" + (NoOfParameter - 1), "class", "remove"];
		for (var i = 0; i <= buttonAttr.length - 1; i = i + 2) {
			for (var j = 0; j <= i; j = j + 2) {
				button.setAttribute(buttonAttr[i], buttonAttr[j + 1]);
			}
		}
		$("#" + selfDataArray[1]).remove();
		NoOfParameter = NoOfParameter - 1;
		currentEditableRow = NoOfParameter;

	} /*else if (text == "FINAL INSPECTION RQC-P CREATION MASTER") {
		if (selfDataArray[1] == "1") {
			alert("You cannot delete this parameter beacause one parameter is always mandatory for RQCP No.")
			return
		}

		var qualityId = $("#qualityId" + selfDataArray[1]).text();
		deleteFinalParameter(qualityId);

		var button = document.createElement("button");
		$("#" + (selfDataArray[1] - 1) + " " + "td:last").append(button);

		var buttonAttr = ["id", "remove" + (NoOfParameter - 1), "class", "remove"];
		for (var i = 0; i <= buttonAttr.length - 1; i = i + 2) {
			for (var j = 0; j <= i; j = j + 2) {
				button.setAttribute(buttonAttr[i], buttonAttr[j + 1]);
			}
		}
		$("#" + selfDataArray[1]).remove();
		NoOfParameter = NoOfParameter - 1;
		currentEditableRow = NoOfParameter;
	}*/
});


$(document).on('keydown', '#createNewParameter', function(e) {
	if (e.key === "Enter") {
		e.preventDefault();
		createAndCheckNewParameter();
	}
});

$(document).on('keydown', '#input1', function(e) {
	if (e.key === "Enter") {
		e.preventDefault();

		var text = $("#masterHeading").text();
		if (text == "RQC CREATION MASTER") {
			checkMispAganistPartNumber();
		} else if (text == "FINAL INSPECTION RQC-P CREATION MASTER") {
			checkFinalControlMispAganistProductNumber();
		} else if (text == "MANPOWER DEPLOYMENT MASTER") {
			checkLinePlannedFromSelectedDate();
		}
	}
});


function checkMispAganistPartNumber() {
	var partNumber = $("input[name=PartNumber]").val();

	$.ajax({
		url: "/WebApplication/Controllers/checkMispAganistPartNumber/" + partNumber,
		type: 'GET',
		contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		/*async: false,*/
		dataType: 'json',
		success: function(response) {

			getDescriptionAndUom();
			createAndCheckNewParameter();
		}, error: function(response) {
			$("#addEditDeleteBackdropButton").click();
			$("#warningInformationModalBody").text(response.responseText);
			$("#warningBackdropButton").click();
		}
	});
}

// for "FINAL INSPECTION RQC-P CREATION MASTER"
/*
function checkFinalControlMispAganistProductNumber() {
	var partNumber = $("input[name=PartNumber]").val();

	$.ajax({
		url: "/WebApplication/Controllers/checkFinalControlMispAganistProductNumber/" + partNumber,
		type: 'GET',
		contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		async: false,
		dataType: 'json',
		success: function(response) {
			getCustomerModelAndDescription();
			createAndCheckNewParameter();
		}, error: function(response) {
			$("#addEditDeleteBackdropButton").click();
			$("#warningInformationModalBody").text(response.responseText);
			$("#warningBackdropButton").click();
		}
	});
}
*/

$(document).on('keydown', '.multiDimensionValue', function(e) {
	if (e.key === "Enter") {
		e.preventDefault();

		if (rowStatus) {
			var selfButtonId = $(this).attr("id");
			var selfDataArray = selfButtonId.match(/[a-z]+|[^a-z]+/gi);
			disabledParameterRow(selfDataArray[1]);
			$("#edit" + selfDataArray[1]).css("display", "flex");
			createAndCheckNewParameter();
			$(".inspectionItem").focus();
			rowStatus = false;
		} else {
			createAndCheckNewParameter();
			$(".inspectionItem").focus();
		}
	}
});


$(document).on('click', '.rowEdit', function() {

	var selfButtonId = $(this).attr("id");
	var selfDataArray = selfButtonId.match(/[a-z]+|[^a-z]+/gi);

	rowStatus = true;
	currentEditableRow = selfDataArray[1];
	// enableParameterRow(selfDataArray[1]);
	// $("#edit" + selfDataArray[1]).css("display", "none");

	// instead of only enabling → toggle the row
	toggleParameterRow(selfDataArray[1]);
	
	console.log("selfButtonId", selfButtonId, "selfDataArray", selfDataArray, "currentEditableRow", currentEditableRow);
	
	$("#" + parameterTypeList[1] + currentEditableRow).on("input", function () {
	    autoUpdateTolerance(currentEditableRow);
	});

	// Trigger when inspection method changes
	$("#" + parameterTypeList[2] + currentEditableRow).on("change", function () {
	    autoUpdateTolerance(currentEditableRow);
	});

});

function toggleParameterRow(rowNumber) { //toggle  to disable and enable parameters.
    // pick one input field from the row to check state
    const firstField = $("#" + parameterTypeList[0] + rowNumber);

    if (firstField.is(":disabled")) {
        enableParameterRow(rowNumber);   // if disabled → enable
    } else {
        disabledParameterRow(rowNumber); // if enabled → disable
    }
}


$(document).on("change", ".visualMeasure", function() { // for getting inspection method in modal.

	var id = this.id;
	currentEditableRow = id.match(/[^a-z]+/gi);

	var inspectionMethod = $('#' + (parameterTypeList[2] + currentEditableRow) + ' :selected').val();
	getAllInstrumentInQualityList(inspectionMethod);


	if (inspectionMethod.toLowerCase() == "measure" || inspectionMethod.toLowerCase() == "manual" || inspectionMethod.toLowerCase() == "counting") {

		$("#" + parameterTypeList[4] + currentEditableRow).removeAttr("disabled");
		$("#" + parameterTypeList[5] + currentEditableRow).removeAttr("disabled");

	} else if (inspectionMethod.toLowerCase() == "visual" || inspectionMethod.toLowerCase() == "calendar" ||  inspectionMethod.toLowerCase() == "cavity") {

/*		$("#" + parameterTypeList[4] + currentEditableRow).attr("disabled", "disabled");
		$("#" + parameterTypeList[5] + currentEditableRow).attr("disabled", "disabled");*/
 
	    $("#" + parameterTypeList[4] + currentEditableRow)
	        .val("") // clear the field
	        .attr("disabled", "disabled"); // disable it

	    $("#" + parameterTypeList[5] + currentEditableRow)
	        .val("")
	        .attr("disabled", "disabled");
	}
});

// when a particular parameter is deleted from using the modal.
function deleteParameter(qualityId) {
	if (!qualityId) {
		return;
	} else {
		$.ajax({
			type: 'DELETE',
			headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
			async: false,
			url: '/WebApplication/Controllers/delete/deleteQuality/' + qualityId,
			success: function(response) {

				$("#responseContainer").text(response);
				$("#responseContainer").attr("style", "font-size:15px;color:green; width:60%;  height:30px; text-align:center;");
				loadDataAndPager();
				// hideModal("informationBackdropButton");
				// resetValues();
				// resetQualityDetails();
			},
			error: function(response) {
				$("#addEditDeleteBackdropButton").click();
				$("#warningInformationModalBody").text(response.responseText);
				$("#warningBackdropButton").click();
			}
		});
	}

}


// for "FINAL INSPECTION MIS-P CREATION MASTER"
/*
function deleteFinalParameter(qualityId) {
	if (!qualityId) {
		return;
	} else {
		$.ajax({
			type: 'DELETE',
			headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
			async: false,
			url: '/WebApplication/Controllers/delete/deleteFinalControlMisp/' + qualityId,
			success: function(response) {

				$("#responseContainer").text(response);
				$("#responseContainer").attr("style", "font-size:15px;color:green; width:60%;  height:30px; text-align:center;");
			},
			error: function(response) {
				$("#addEditDeleteBackdropButton").click();
				$("#warningInformationModalBody").text(response.responseText);
				$("#warningBackdropButton").click();
			}
		});
	}

}*/

/*function loadMispData(page) {

	$("#pageSelect").val(page);

	$.ajax({
		url: "/WebApplication/Controllers/getAllMispData/" + page,
		type: 'GET',
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		dataType: 'json',
		success: function(response) {

			insertMispMasterInTable(response);

		}, error: function(response) {
			$("#warningInformationModalBody").text(response.responseText);
			$("#warningBackdropButton").click();
		}
	});
}

function loadMispDataPager() {
	$.ajax({
		url: "/WebApplication/Controllers/getAllMispDataPager",
		type: 'GET',
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		dataType: 'json',
		success: function(res) {

			var totalpage = Math.ceil(parseInt(res.length) / pageSize);
			$("#pageSelect").empty();

			for (var i = 0; i < totalpage; i++) {
				var row = '<option value="' + i + '">' + (i + 1) + '</option>';
				$("#pageSelect").append(row);
			}

		}, error: function(response) {
			$("#warningInformationModalBody").text(response.responseText);
			$("#warningBackdropButton").click();
		}
	});
}
*/


// called in .edit
window.loadParameterDataByMISP = loadParameterDataByMISP;
function loadParameterDataByMISP(mispNumber, revNumber) {

	$.ajax({
		url: "/WebApplication/Controllers/getAllParameterByMISP/" + mispNumber + "/" + revNumber,
		type: 'GET',
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		dataType: 'json',
		async: false,
		success: function(response) {
			NoOfParameter = 0;

			for (var i = 0; i < response.length; i++) {
				$("#input1").val(response[i].partNumber);
				createAndCheckNewParameter();
				FillMispDetailsInTable(response[i]);
			}
		}, error: function(response) {
			$("#warningInformationModalBody").text(response.responseText);
			$("#warningBackdropButton").click();
		}
	});
}

// for "FINAL INSPECTION RQC-P CREATION MASTER"
/*
function loadParameterDataByFinalControlMISP(mispNumber, revNumber) {

	$.ajax({
		url: "/WebApplication/Controllers/getAllParameterByFinalControlMISP/" + mispNumber + "/" + revNumber,
		type: 'GET',
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		dataType: 'json',
		async: false,
		success: function(response) {
			NoOfParameter = 0;

			for (var i = 0; i < response.length; i++) {
				$("#input1").val(response[i].partNumber);
				createAndCheckNewParameter();
				FillFinalControlMispDetailsInTable(response[i]);
			}
		}, error: function(response) {
			$("#warningInformationModalBody").text(response.responseText);
			$("#warningBackdropButton").click();
		}
	});
}
*/

// called in loadParameterDataByMISP()
function FillMispDetailsInTable(value) {

	$("#qualityId" + NoOfParameter).text(value.qualityId);
	$("#inspectionItem" + NoOfParameter).prop("value", value.inspectionItem);
	$("#criteria" + NoOfParameter).prop("value", value.criteria);
	$("#inspectionMethod" + NoOfParameter).prop("value", value.inspectionMethod);
	getAllInstrumentInQualityList(value.inspectionMethod);
	$("#inspectionTool" + NoOfParameter).prop("value", value.instrument.instrumentId);
	$("#min" + NoOfParameter).prop("value", value.min);
	$("#max" + NoOfParameter).prop("value", value.max);
	$("#samplingplan" + NoOfParameter).prop("value", value.samplingPlan);
	$("#multidimensionval" + NoOfParameter).prop("value", value.multiDimensionValue);
}

// for "FINAL INSPECTION RQC-P CREATION MASTER"
/*
function FillFinalControlMispDetailsInTable(value) {

	$("#qualityId" + NoOfParameter).text(value.finalControlId);
	$("#inspectionItem" + NoOfParameter).prop("value", value.inspectionItem);
	$("#criteria" + NoOfParameter).prop("value", value.criteria);
	$("#inspectionMethod" + NoOfParameter).prop("value", value.inspectionMethod);
	getAllInstrumentInQualityList(value.inspectionMethod);
	$("#inspectionTool" + NoOfParameter).prop("value", value.instrument.instrumentId);
	$("#min" + NoOfParameter).prop("value", value.min);
	$("#max" + NoOfParameter).prop("value", value.max);
	$("#samplingplan" + NoOfParameter).prop("value", value.samplingPlan);
}*/

// renamed above at top 
/*
function insertMispMasterInTable(response) {

	$("#tableBody").remove();
	var tablebody = document.createElement("tbody");
	tablebody.setAttribute("id", "tableBody");

	$("#table1").append(tablebody);

	var sequenceNumber = pageSize * parseInt($('#pageSelect :selected').val());

	for (var i = 0; i < response.length; i++) {
		var str = response[i];
		var list = str.split(',');

		if (list[8] == "0") {
			var row = '<tr class="tableDataRows" title="Double click to select the row.">' +
				'<td data-column="columnId" style="width:50px">' + (sequenceNumber + 1) + '</td>' +
				'<td data-column="mispNumber" style="width:100px">' + (list[0] == "null" ? '' : list[0]) + '</td>' +
				'<td data-column="revNumber" style="width:70px">' + (list[1] == "null" ? '' : list[1]) + '</td>' +
				'<td data-column="partNumber">' + (list[2] == "null" ? '' : list[2]) + '</td>' +
				'<td data-column="partDescription" style="width:400px; text-align:left; padding-left:10px;">' + (list[9] == "null" ? '' : list[9]) + '</td>' +
				'<td data-column="noOfParameter">' + (list[3] == "null" ? '' : list[3]) + '</td>' +
				'<td data-column="createdBy">' + (list[4] == "null" ? '' : list[4]) + '</td>' +
				'<td data-column="dateTime">' + (list[5] == "null" ? '' : list[5]) + '</td>' +
				'<td data-column="Approved By">' + (list[6] == "null" ? '' : list[6]) + '</td>' +
				'<td data-column="implementDate" >' + (list[7] == "null" ? '' : list[7]) + '</td>' +
				'<td data-column="customer">' + (list[10] == "null" ? '' : list[10]) + '</td>' +
				'<td data-column="model" style="width:100px;">' + (list[11] == "null" ? '' : list[11]) + '</td>' +
				'<td style="background-color:Yellow;">Editable</td>' +
				'<td data-column="status" style="display:none;">' + (list[8] == "null" ? '' : list[8]) + '</td>' +
				'</tr>';
		} else if (list[8] == "1") {
			var row = '<tr class="tableDataRows" title="Double click to select the row.">' +
				'<td data-column="columnId" style="width:50px">' + (sequenceNumber + 1) + '</td>' +
				'<td data-column="mispNumber" style="width:100px">' + (list[0] == "null" ? '' : list[0]) + '</td>' +
				'<td data-column="revNumber" style="width:70px">' + (list[1] == "null" ? '' : list[1]) + '</td>' +
				'<td data-column="partNumber">' + (list[2] == "null" ? '' : list[2]) + '</td>' +
				'<td data-column="partDescription" style="width:400px; text-align:left; padding-left:10px;">' + (list[9] == "null" ? '' : list[9]) + '</td>' +
				'<td data-column="noOfParameter">' + (list[3] == "null" ? '' : list[3]) + '</td>' +
				'<td data-column="createdBy">' + (list[4] == "null" ? '' : list[4]) + '</td>' +
				'<td data-column="dateTime">' + (list[5] == "null" ? '' : list[5]) + '</td>' +
				'<td data-column="Approved By">' + (list[6] == "null" ? '' : list[6]) + '</td>' +
				'<td data-column="implementDate" >' + (list[7] == "null" ? '' : list[7]) + '</td>' +
				'<td data-column="customer">' + (list[10] == "null" ? '' : list[10]) + '</td>' +
				'<td data-column="model" >' + (list[11] == "null" ? '' : list[11]) + '</td>' +
				'<td style="background-color:limeGreen; color:white">Approved</td>' +
				'<td data-column="status" style="display:none;">' + (list[8] == "null" ? '' : list[8]) + '</td>' +
				'</tr>';
		} else if (list[8] == "2") {
			var row = '<tr class="tableDataRows" title="Double click to select the row.">' +
				'<td data-column="columnId" style="width:50px">' + (sequenceNumber + 1) + '</td>' +
				'<td data-column="mispNumber" style="width:100px">' + list[0] + '</td>' +
				'<td data-column="revNumber" style="width:70px">' + list[1] + '</td>' +
				'<td data-column="partNumber">' + list[2] + '</td>' +
				'<td data-column="partDescription" style="width:400px; text-align:left; padding-left:10px;">' + list[9] + '</td>' +
				'<td data-column="noOfParameter">' + list[3] + '</td>' +
				'<td data-column="createdBy">' + list[4] + '</td>' +
				'<td data-column="dateTime">' + list[5] + '</td>' +
				'<td data-column="Approved By">' + list[6] + '</td>' +
				'<td data-column="implementDate" >' + list[7] + '</td>' +
				'<td data-column="customer">' + (list[10] == "null" ? '' : list[10]) + '</td>' +
				'<td data-column="model" >' + (list[11] == "null" ? '' : list[11]) + '</td>' +
				'<td style="background-color:red; color:white">Re-Consider</td>' +
				'<td data-column="status" style="display:none;">' + (list[8] == "null" ? '' : list[8]) + '</td>' +
				'</tr>';
		} else if (list[8] == "3") {
			var row = '<tr class="tableDataRows" title="Double click to select the row.">' +
				'<td data-column="columnId" style="width:50px">' + (sequenceNumber + 1) + '</td>' +
				'<td data-column="mispNumber" style="width:100px">' + (list[0] == "null" ? '' : list[0]) + '</td>' +
				'<td data-column="revNumber" style="width:70px">' + (list[1] == "null" ? '' : list[1]) + '</td>' +
				'<td data-column="partNumber">' + (list[2] == "null" ? '' : list[2]) + '</td>' +
				'<td data-column="partDescription" style="width:400px; text-align:left; padding-left:10px;">' + (list[9] == "null" ? '' : list[9]) + '</td>' +
				'<td data-column="noOfParameter">' + (list[3] == "null" ? '' : list[3]) + '</td>' +
				'<td data-column="createdBy">' + (list[4] == "null" ? '' : list[4]) + '</td>' +
				'<td data-column="dateTime">' + (list[5] == "null" ? '' : list[5]) + '</td>' +
				'<td data-column="Approved By">' + (list[6] == "null" ? '' : list[6]) + '</td>' +
				'<td data-column="implementDate" >' + (list[7] == "null" ? '' : list[7]) + '</td>' +
				'<td data-column="customer">' + (list[10] == "null" ? '' : list[10]) + '</td>' +
				'<td data-column="model" >' + (list[11] == "null" ? '' : list[11]) + '</td>' +
				'<td style="background-color:blue; color:white">Approval Pending</td>' +
				'<td data-column="status" style="display:none;">' + (list[8] == "null" ? '' : list[8]) + '</td>' +
				'</tr>';
		} else if (list[8] == "4") {
			var row = '<tr class="tableDataRows" title="Double click to select the row.">' +
				'<td data-column="columnId" style="width:50px">' + (sequenceNumber + 1) + '</td>' +
				'<td data-column="mispNumber" style="width:100px">' + (list[0] == "null" ? '' : list[0]) + '</td>' +
				'<td data-column="revNumber" style="width:70px">' + (list[1] == "null" ? '' : list[1]) + '</td>' +
				'<td data-column="partNumber">' + (list[2] == "null" ? '' : list[2]) + '</td>' +
				'<td data-column="partDescription" style="width:400px; text-align:left; padding-left:10px;">' + (list[9] == "null" ? '' : list[9]) + '</td>' +
				'<td data-column="noOfParameter">' + (list[3] == "null" ? '' : list[3]) + '</td>' +
				'<td data-column="createdBy">' + (list[4] == "null" ? '' : list[4]) + '</td>' +
				'<td data-column="dateTime">' + (list[5] == "null" ? '' : list[5]) + '</td>' +
				'<td data-column="Approved By">' + (list[6] == "null" ? '' : list[6]) + '</td>' +
				'<td data-column="implementDate" >' + (list[7] == "null" ? '' : list[7]) + '</td>' +
				'<td data-column="customer">' + (list[10] == "null" ? '' : list[10]) + '</td>' +
				'<td data-column="model" >' + (list[11] == "null" ? '' : list[11]) + '</td>' +
				'<td style="background-color:orange; color:white">Re-consider</td>' +
				'<td data-column="status" style="display:none;">' + (list[8] == "null" ? '' : list[8]) + '</td>' +
				'</tr>';
		}
		$('#table1').append(row);
		sequenceNumber++;

	}
}
*/

function resetQualityDetails() {

	$("tr").siblings().removeAttr("style");
	$("#input1").removeAttr("disabled");
	iterableformData = [];
	deleteAllList = [];
	materialId = "";
	object = "";
}


// used in addQuality and editQuality
function uploadQualityImage(form_data, partNumber, revNumber) {

	var status = false;

	if (partNumber == "" || !partNumber) {
		alert("Part No is mandatory to generate RQCP No and part image.")
		return status;
	}

	console.log(form_data, partNumber, revNumber);
	$.ajax({
		url: '/WebApplication/Controllers/uploadQualityPartNumberImage/' + partNumber + "/" + revNumber,
		type: 'POST',
		data: form_data,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		contentType: false,
		async: false,
		processData: false,
		success: function(response) {
			$("#responseContainer").text(response);
			$("#responseContainer").attr("style", "font-size:15px;color:green; width:60%;  height:30px; text-align:center;");
			status = true;
		},
		error: function(error) {
			$("#responseContainer").text(error.responseText);
			response = error.responseText;
		}
	});
	return status;
}


window.addQuality = addQuality;
function addQuality() {

	var QualityMaster = {};
	iterableformData = []; // reset global variable per edit
	let form_data = new FormData();
	let imageFile = $("#input3")[0].files;
	var partNumber = $("input[name=PartNumber]").val();
	var partDescription = $("#partDescriptionContainer").text();
	var imageStatus = true;
	var customerValue = document.getElementById("inputCustomer").value;
	var modelValue = document.getElementById("inputModel").value;

	if (!customerValue || !modelValue) {
	    alert("Please select both Customer and Model before proceeding.");
	    return;
	}
	
	if (imageFile.length > 0) {
		form_data.append('image', imageFile[0]);
		
		for (let pair of form_data.entries()) {
		    console.log(pair[0] + ':', pair[1]);
		}
		
		imageStatus = uploadQualityImage(form_data, partNumber, "0");
		console.log(imageStatus);
		if (imageStatus == false) {
			return;
		}

	}
	//if (imageStatus == false) {
		if (NoOfParameter == "0") {
			$("#responseContainer").text("At least one parameter is mandatory to add RQCP No. parameter.");
			$("#responseContainer").attr("style", "font-size:15px;color:red; width:60%; height:30px; text-align:center;");
			return;
		}
	// }

	for (var i = 1; i <= NoOfParameter; i++) {

		var inspectionItem = $("input[name=" + parameterTypeList[0] + i + "]").val();
		var criteria = $("input[name=" + parameterTypeList[1] + i + "]").val();
		var inspectionMethod = $('#' + parameterTypeList[2] + i + ' :selected').val();
		var inspectionTool = $('#' + parameterTypeList[3] + i + ' :selected').val();
		var min = $("input[name=" + parameterTypeList[4] + i + "]").val();
		var max = $("input[name=" + parameterTypeList[5] + i + "]").val();
		var samplingPlan = $("input[name=" + parameterTypeList[6] + i + "]").val();
		var multiDimensionValue = $("input[name=" + parameterTypeList[7] + i + "]").val();
		var createdBy = sessionStorage.getItem('name');


		if (inspectionMethod.toLowerCase() == "visual"  || inspectionMethod.toLowerCase() == "calendar" ||  inspectionMethod.toLowerCase() == "cavity") {
			if (!inspectionItem || !criteria || inspectionMethod == "Select" || inspectionTool == "Select" || !samplingPlan || !multiDimensionValue) {

				$("#responseContainer").text("Please fill required fields properly as per Inspection method selection In Row = " + i);
				$("#responseContainer").attr("style", "font-size:15px;color:red; width:60%; height:30px; text-align:center;");

				setTimeout(function() {

				}, 10000);
				return;
			}
		} else {
			if (!inspectionItem || !criteria || inspectionMethod == "Select" || inspectionTool == "Select" || !min || !max || !samplingPlan || !multiDimensionValue) {

				$("#responseContainer").text("Please fill required fields properly as per Inspection method selection In Row = " + i);
				$("#responseContainer").attr("style", "font-size:15px;color:red; width:60%; height:30px; text-align:center;");

				setTimeout(function() {

				}, 10000);
				return;
			}
		}

		QualityMaster = {
			partNumber: partNumber,
			partDescription: partDescription,
			inspectionItem: inspectionItem,
			criteria: criteria,
			min: min,
			max: max,
			inspectionMethod: inspectionMethod,
			samplingPlan: samplingPlan,
			multiDimensionValue: multiDimensionValue,
			customer: customerValue,
			model: modelValue,
			createdBy: createdBy,
			instrument: {
				instrumentId: inspectionTool
			}
		}

		iterableformData.push(QualityMaster);
	}

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/insertQuality',
		data: JSON.stringify(iterableformData),
		contentType: 'application/json',
		async: false,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			
			showSuccessResponse("responseContainer", response);
			loadDataAndPager();
			resetValues();
			
			resetQualityDetails();
			$("#parameterTableBody").empty();
			NoOfParameter = 0;
		},
		error: function(response) {
			hideModal("addEditDeleteModalBody");
			setTextById("warningInformationModalBody", response.responseText);
			showModal("warningBackdropButton");
			loadDataAndPager();
			resetValues();
			
			resetQualityDetails();
			$("#parameterTableBody").empty();
			NoOfParameter = 0;

		}
	});

	$("#input3").val(null);

}

window.editQuality = editQuality;
function editQuality() {

	iterableformData = []; // reset global variable per edit
	var QualityMaster = {};
	let form_data = new FormData();
	let imageFile = $("#input3")[0].files;
	var partNumber = $("input[name=PartNumber]").val();
	var mispNumber = object.mispNumber;
	var revNumber = object.revNumber;
	var approveStatus = object.status;
	var partDescription = $("#partDescriptionContainer").text();
	var imageStatus = true;
	var customerValue = document.getElementById("inputCustomer").value;
	var modelValue = document.getElementById("inputModel").value;

	if (imageFile.length > 0) {
		form_data.append('image', imageFile[0]);
		
		for (let pair of form_data.entries()) {
		    console.log(pair[0] + ':', pair[1]);
		}
		console.log(object.status);
		if (object.status == "1") {  // means editing on approved mis-p
			imageStatus = uploadQualityImage(form_data, partNumber, parseInt(object.revNumber) + 1); // generate new rev number
		} else {
			imageStatus = uploadQualityImage(form_data, partNumber, object.revNumber);
		}
		
		console.log(imageStatus);
		if (imageStatus == false) {
			return;
		}
	}
	if (imageStatus == false) {
		if (NoOfParameter == "0") {
			$("#responseContainer").text("At least one parameter is mandatory to edit RQCP No. parameter.");
			$("#responseContainer").attr("style", "font-size:15px;color:red; width:60%; height:30px; text-align:center;");
			return;
		}
	}

	for (var i = 1; i <= NoOfParameter; i++) {

		var qualityId = $("#qualityId" + i).text();
		var inspectionItem = $("input[name=" + parameterTypeList[0] + i + "]").val();
		var criteria = $("input[name=" + parameterTypeList[1] + i + "]").val();
		var inspectionMethod = $('#' + parameterTypeList[2] + i + ' :selected').val();
		var inspectionTool = $('#' + parameterTypeList[3] + i + ' :selected').val();
		var min = $("input[name=" + parameterTypeList[4] + i + "]").val();
		var max = $("input[name=" + parameterTypeList[5] + i + "]").val();
		var samplingPlan = $("input[name=" + parameterTypeList[6] + i + "]").val();
		var multiDimensionValue = $("input[name=" + parameterTypeList[7] + i + "]").val();
		var createdBy = sessionStorage.getItem('name');


		if (inspectionMethod.toLowerCase() == "visual" || inspectionMethod.toLowerCase() == "calendar" ||  inspectionMethod.toLowerCase() == "cavity") {
			if (!inspectionItem || !criteria || inspectionMethod == "Select" || inspectionTool == "Select" || !samplingPlan || !multiDimensionValue) {

				$("#responseContainer").text("Please fill required fields properly as per Inspection method selection In Row = " + i);
				$("#responseContainer").attr("style", "font-size:15px;color:red; width:60%; height:30px; text-align:center;");

				setTimeout(function() {

				}, 1000)
				return;
			}
		} else {
			if (!inspectionItem || !criteria || inspectionMethod == "Select" || inspectionTool == "Select" || !min || !max || !samplingPlan || !multiDimensionValue) {

				$("#responseContainer").text("Please fill required fields properly as per Inspection method selection In Row = " + i);
				$("#responseContainer").attr("style", "font-size:15px;color:red; width:60%; height:30px; text-align:center;");

				setTimeout(function() {

				}, 1000)
				return;
			}
		}

		console.log("QualityMaster", QualityMaster);
		QualityMaster = {
			qualityId: qualityId,
			mispNumber: mispNumber,
			partDescription: partDescription,
			revNumber: revNumber,
			partNumber: partNumber,
			inspectionItem: inspectionItem,
			criteria: criteria,
			min: min,
			max: max,
			customer: customerValue,
			model: modelValue,
			inspectionMethod: inspectionMethod,
			samplingPlan: samplingPlan,
			multiDimensionValue: multiDimensionValue,
			createdBy: createdBy,
			instrument: {
				instrumentId: inspectionTool
			}
		}
		iterableformData.push(QualityMaster);
	}

	console.log(iterableformData);
	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/editQuality/' + approveStatus,
		data: JSON.stringify(iterableformData),
		contentType: 'application/json',
		async: false,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
		
			showSuccessResponse("responseContainer", response);
			loadDataAndPager();
			resetValues();

			resetQualityDetails();
			// $("#parameterTableBody").empty();
			// NoOfParameter = 0;
		},
		error: function(response) {

			hideModal("addEditDeleteModalBody");
			setTextById("warningInformationModalBody", response.responseText);
			showModal("warningBackdropButton");
			loadDataAndPager();
			resetValues();

			resetQualityDetails();
			// $("#parameterTableBody").empty();
			// NoOfParameter = 0;
		}
	});
	$("#input3").val(null);

}

// for deleting whole mis-p
window.deleteQuality = deleteQuality;
function deleteQuality() {

	if (object == "") {

		$("#warningInformationModalBody").text("Please select row from table to delete RQC-P.");
		$("#warningBackdropButton").click();
	} else if (object.status == "1") {
		alert("You can not delete an approved RQC-P.");

	} else {

		if (object.status == "0" || object.status == "1" || object.status == "4") {
			// can be deleted. below code runs
		} else if (object.status == "3"){ // object.status == "3" for approval pending
			alert("You cannot delete selected RQC-P No while it will not reconsider or reconcern by Quality head.");
			return;
		} else if (object.status == "2"){ // object.status == "2" for reconsider or reconcern
			alert("You cannot delete the reconsidered or reconcern RQC-P by Quality head.");
			return;
		}

/*		$("#informationModalBody").text("Do you really want to delete this selected RQC-P.");

		$("#informationBackdropButton").click();*/

		$('#informationCancel').off('click').on('click', function() {
			resetQualityDetails();
		});

		$('#delete').off('click').on('click', function() {
			//console.log("delte called");
			$.ajax({
				type: 'DELETE', headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
				url: '/WebApplication/Controllers/delete/deleteFullMisp/' + object.mispNumber + "/" + object.revNumber+ "/" + object.partNumber,
				success: function(response) {
	
					loadDataAndPager();
					hideModal("informationBackdropButton");
					resetValues();
					resetQualityDetails();
				},
				error: function(response) {
					
					hideModal("informationBackdropButton");
					setTextById("warningInformationModalBody", response.responseText);
					showModal("warningBackdropButton");
					loadDataAndPager();
					resetValues();
					
					resetQualityDetails();
				}
			});

		});
	}
}


$(document).on('click', '#sendForApproval', function() {

	var mispheading = $("#addEditDeleteBackdropLabel").text();
	var mispheadingArray = mispheading.match(/\d+/);

	var QualityMaster = {};
	var partNumber = $("input[name=PartNumber]").val();

	var mispNumber = mispheadingArray[0];
	var partDescription = $("#partDescriptionContainer").text();

	var approveStatus = "3";


	var text = $("#masterHeading").text();
	if (text == "RQC CREATION MASTER") {

		for (var i = 1; i <= NoOfParameter; i++) {

			var qualityId = $("#qualityId" + i).text();
			var inspectionItem = $("input[name=" + parameterTypeList[0] + i + "]").val();
			var criteria = $("input[name=" + parameterTypeList[1] + i + "]").val();
			var inspectionMethod = $('#' + parameterTypeList[2] + i + ' :selected').val();
			var inspectionTool = $('#' + parameterTypeList[3] + i + ' :selected').val();
			var min = $("input[name=" + parameterTypeList[4] + i + "]").val();
			var max = $("input[name=" + parameterTypeList[5] + i + "]").val();
			var samplingPlan = $("input[name=" + parameterTypeList[6] + i + "]").val();
			var multiDimensionValue = $("input[name=" + parameterTypeList[7] + i + "]").val();
			var createdBy = sessionStorage.getItem('employeeId');


			if (inspectionMethod.toLowerCase() == "visual" || inspectionMethod.toLowerCase() == "calendar" ||  inspectionMethod.toLowerCase() == "cavity") {
				if (!inspectionItem || !criteria || inspectionMethod == "Select" || inspectionTool == "Select" || !samplingPlan || !multiDimensionValue) {

					$("#responseContainer").text("Please fill required fields properly as per Inspection method selection In Row = " + i);
					$("#responseContainer").attr("style", "font-size:15px;color:red; width:80%; height:30px; text-align:center;");

					setTimeout(function() {

					}, 10000)
					return
				}
			} else {
				if (!inspectionItem || !criteria || inspectionMethod == "Select" || inspectionTool == "Select" || !min || !max || !samplingPlan || !multiDimensionValue) {

					$("#responseContainer").text("Please fill required fields properly as per Inspection method selection In Row = " + i);
					$("#responseContainer").attr("style", "font-size:15px;color:red; width:80%; height:30px; text-align:center;");

					setTimeout(function() {

					}, 10000)
					return
				}
			}

			QualityMaster = {
				qualityId: qualityId,
				mispNumber: mispNumber,
				partDescription: partDescription,
				partNumber: partNumber,
				inspectionItem: inspectionItem,
				criteria: criteria,
				min: min,
				max: max,
				inspectionMethod: inspectionMethod,
				samplingPlan: samplingPlan,
				multiDimensionValue: multiDimensionValue,
				createdBy: createdBy,
				instrument: {
					instrumentId: inspectionTool
				}
			}

			iterableformData.push(QualityMaster);
		}


		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/sendForApproval/' + approveStatus,
			data: JSON.stringify(iterableformData),
			contentType: 'application/json',
			async: false,
			headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
			success: function(response) {

				$("#responseContainer").text(response);
				$("#responseContainer").attr("style", "font-size:15px;color:green; width:60%;  height:30px; text-align:center;");
				loadDataAndPager();
				
				resetQualityDetails();
				$("#parameterTableBody").empty();
				NoOfParameter = 0;
			},
			error: function(response) {
				loadDataAndPager();
				
				resetQualityDetails();
				$("#parameterTableBody").empty();
				NoOfParameter = 0;

				$("#addEditDeleteBackdropButton").click();
				$("#warningInformationModalBody").text(response.responseText);
				$("#warningBackdropButton").click();
			}
		});
	} /*else if (text == "FINAL INSPECTION RQC-P CREATION MASTER") {

		for (var i = 1; i <= NoOfParameter; i++) {

			var qualityId = $("#qualityId" + i).text();
			var inspectionItem = $("input[name=" + parameterTypeList[0] + i + "]").val();
			var criteria = $("input[name=" + parameterTypeList[1] + i + "]").val();
			var inspectionMethod = $('#' + parameterTypeList[2] + i + ' :selected').val();
			var inspectionTool = $('#' + parameterTypeList[3] + i + ' :selected').val();
			var min = $("input[name=" + parameterTypeList[4] + i + "]").val();
			var max = $("input[name=" + parameterTypeList[5] + i + "]").val();
			var samplingPlan = $("input[name=" + parameterTypeList[6] + i + "]").val();
			var createdBy = sessionStorage.getItem('employeeId');


			if (inspectionMethod.toLowerCase() == "visual") {
				if (!inspectionItem || !criteria || inspectionMethod == "Select" || inspectionTool == "Select" || !samplingPlan) {

					$("#responseContainer").text("Please fill required fields properly as per Inspection method selection In Row = " + i);
					$("#responseContainer").attr("style", "font-size:15px;color:red; width:80%; height:30px; text-align:center;");

					setTimeout(function() {

					}, 10000)
					return
				}
			} else {
				if (!inspectionItem || !criteria || inspectionMethod == "Select" || inspectionTool == "Select" || !min || !max || !samplingPlan) {

					$("#responseContainer").text("Please fill required fields properly as per Inspection method selection In Row = " + i);
					$("#responseContainer").attr("style", "font-size:15px;color:red; width:80%; height:30px; text-align:center;");

					setTimeout(function() {

					}, 10000)
					return
				}
			}

			QualityMaster = {
				finalControlId: qualityId,
				mispNumber: mispNumber,
				partDescription: partDescription,
				partNumber: partNumber,
				inspectionItem: inspectionItem,
				criteria: criteria,
				min: min,
				max: max,
				inspectionMethod: inspectionMethod,
				samplingPlan: samplingPlan,
				createdBy: createdBy,
				instrument: {
					instrumentId: inspectionTool
				}
			}

			iterableformData.push(QualityMaster);
		}



		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/sendForApprovalFinalControlMispNo/' + approveStatus,
			data: JSON.stringify(iterableformData),
			contentType: 'application/json',
			async: false,
			headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
			success: function(response) {

				$("#responseContainer").text(response);
				$("#responseContainer").attr("style", "font-size:15px;color:green; width:60%;  height:30px; text-align:center;");
				if (!$('#pageSelect :selected').val()) {
					loadLikeFinalControlMispMasterData(0);
				} else {
					loadLikeFinalControlMispMasterData($('#pageSelect :selected').val());
				}
				resetFinalControlDetails();
				$("#parameterTableBody").empty();
				NoOfParameter = 0;
			},
			error: function(response) {
				if (!$('#pageSelect :selected').val()) {
					loadLikeFinalControlMispMasterData(0);
				} else {
					loadLikeFinalControlMispMasterData($('#pageSelect :selected').val());
				}
				resetFinalControlDetails();
				$("#parameterTableBody").empty();
				NoOfParameter = 0;

				$("#addEditDeleteBackdropButton").click();
				$("#warningInformationModalBody").text(response.responseText);
				$("#warningBackdropButton").click();
			}
		});
	}*/

});


window.getAllInstrumentInQualityList = getAllInstrumentInQualityList;
function getAllInstrumentInQualityList(inspectionMethod) {


	$(("#" + parameterTypeList[3] + currentEditableRow)).find('option')
		.remove()
		.end()
		.append('<option value="Select">Select</option>')
		.val('Select');

	$.ajax({
		url: "/WebApplication/Controllers/getAllInstrumentsInQualityList/" + inspectionMethod,
		type: 'GET',
		async: false,
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		dataType: 'json',
		success: function(res) {
			for (var i = 0; i < res.length; i++) {
				var str = res[i];
				var id_Instrument = str.split(',');
				for (var j = 0; j < id_Instrument.length - 1; j++) {
					var row = '<option value="' + id_Instrument[j] + '">' + id_Instrument[j + 1] + '</option>';
					$(("#" + parameterTypeList[3] + currentEditableRow)).append(row);
				}
			}
		}, error: function(response) {
			$("#warningInformationModalBody").text(response.responseText);
			$("#warningBackdropButton").click();
		}
	});
}


window.getAllMethodInQualityList = getAllMethodInQualityList;
function getAllMethodInQualityList() {
	inspectionMethodList = [];

	$.ajax({
		url: "/WebApplication/Controllers/getAllMethodsInQualityList",
		type: 'GET',
		async: false,
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		dataType: 'json',
		success: function(res) {

			for (var i = 0; i < res.length; i++) {
				inspectionMethodList.push(res[i]);
				var row = '<option value="' + res[i] + '">' + res[i] + '</option>';
				$(("#" + parameterTypeList[2] + NoOfParameter)).append(row);
			}
		}, error: function(response) {
			$("#warningInformationModalBody").text(response.responseText);
			$("#warningBackdropButton").click();
		}
	});
}

window.uploadQualityDetails = uploadQualityDetails;
function uploadQualityDetails() {

	let form_data = new FormData();
	let excelFile = $("#uploadExcel")[0].files;

	if (excelFile.length > 0) {
		// Append Excel file
		form_data.append('excelFile', excelFile[0]);
	} else {
		alert("Please select excel.");
		return;
	}
	if (excelFile.length > 0) {
		form_data.append('file', excelFile[0]);

		document.querySelector("#uploadImage").setAttribute("src", "/WebApplication/images/processing.gif");
		$("#upload").attr("style", "display:none");
		$("#uploadExcel").attr("style", "display:none");
		$("#uploadCloseButton").attr("style", "background: transparent; height: 30px; width: 30px; border: 0px; display:none;");
		$("#uploadWaiting").removeAttr("style");
		$("#uploadWaiting").text("Please wait......");
		$("#uploadCloseButton").attr("style", "display:none");

		$.ajax({  // written in RQCPMasterAjaxController
			url: '/WebApplication/Controllers/uploadQuality/' + sessionStorage.getItem('name'),
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
					
				} else {
					convertErrorListToCsV(response); // written in master common js
					document.querySelector("#uploadImage").setAttribute("src", "/WebApplication/images/success.png");
					$("#uploadCloseButton").css("display", "flex");
					$("#uploadWaiting").text(response.body.message);
					loadDataAndPager();
					
					setTimeout(function() {
						$("#uploadBackdropButton").click();
					}, 2000);
				}
			},
			error: function(response) {
				document.querySelector("#uploadImage").setAttribute("src", "/WebApplication/images/error.png");
				$("#uploadCloseButton").css("display", "flex");
				$("#uploadWaiting").text(response.responseText);
				loadDataAndPager();
			}
		});
	} else {
		alert("Please select excel.");
	}

}


//// --- Smart auto-fill tolerance ---
function autoUpdateTolerance(rowNum) {
    const criteriaVal = $("#" + parameterTypeList[1] + rowNum).val()?.trim();
    const inspectionMethod = $("#" + parameterTypeList[2] + rowNum).val();
    const minField = $("#" + parameterTypeList[4] + rowNum);
    const maxField = $("#" + parameterTypeList[5] + rowNum);

    if (!criteriaVal || !inspectionMethod) return; // wait until both are filled

    const method = inspectionMethod.toLowerCase();

    // Apply only for numeric inspection types
    if (method !== "measure" && method !== "manual") return;

    // --- special measure cases ---
    if (method === "measure") {
		// Case 1: "0.10~0.30" type
        if (criteriaVal.includes("~")) {
			const [val1, val2] = criteriaVal.split("~").map(v => parseFloat(v));
			if (!isNaN(val1) && !isNaN(val2)) {
			    const [low, high] = [val1, val2].sort((a, b) => a - b); // sort them into low and high value
			    minField.val(low.toFixed(3));
			    maxField.val(high.toFixed(3));
			}
            return;
        } else if (criteriaVal.toLowerCase().includes("max")) {
			// Case 2: "MAX" keyword (e.g. "11.8 N MAX")
            const val = parseFloat(criteriaVal.match(/[\d.]+/));
            if (!isNaN(val)) {
                minField.val("0.000");
                maxField.val(val.toFixed(3));
            }
            return;
        } else if (criteriaVal.toLowerCase().includes("min")) {
			// Case 3: "MIN" keyword (e.g. "11.8 N MIN")
            const val = parseFloat(criteriaVal.match(/[\d.]+/));
            if (!isNaN(val)) {
                minField.val(val.toFixed(3));
                maxField.val("0");
            }
            return;
        } else{ // else it may be tolerance of ++ or -- or +- tolerance.
			// --- fallback to parser ---
			const { min, max } = parseAdvancedTolerance(criteriaVal);
			if (!isNaN(min) && !isNaN(max)) {
				minField.val(min.toFixed(3)); // Lower Limit
				maxField.val(max.toFixed(3)); // Upper Limit
			}
		}
    }

	if (method === "manual") {
		// --- fallback to parser ---
		const { min, max } = parseAdvancedTolerance(criteriaVal);
		if (!isNaN(min) && !isNaN(max)) {
			minField.val(min.toFixed(3)); // Lower Limit
			maxField.val(max.toFixed(3)); // Upper Limit
		}
	}
}

function parseAdvancedTolerance(criteria) {
    if (!criteria || typeof criteria !== "string")
        return { baseVal: 0, min: 0, max: 0 };

    criteria = criteria.replace(/\s+/g, ""); // remove spaces

    // Extract base numeric value
    const baseMatch = criteria.match(/^[-+]?[0-9]*\.?[0-9]+/);
    if (!baseMatch) return { baseVal: 0, min: 0, max: 0 };
    const baseVal = parseFloat(baseMatch[0]);

    // Helper to safely convert to float
    const num = v => (isNaN(parseFloat(v)) ? 0 : parseFloat(v));

    // ✅ ± case: "3.95±0.05"
    if (criteria.includes("±")) {
        const [valStr, tolStr] = criteria.split("±");
        const tol = num(tolStr);
        return { baseVal, min: baseVal - tol, max: baseVal + tol };
    }

    // ✅ + / - mix case: "3.95+0.02/-0.06" or "3.95-0.02/+0.06"
    if (criteria.match(/[+-][0-9.]+\/[+-][0-9.]+/)) {
        const match = criteria.match(/^([0-9.]+)([+-][0-9.]+)\/([+-][0-9.]+)/);
        if (match) {
            const val = num(match[1]);
            const tol1 = num(match[2]);
            const tol2 = num(match[3]);
            const min = val + Math.min(tol1, tol2);
            const max = val + Math.max(tol1, tol2);
            return { baseVal: val, min, max };
        }
    }

    // ✅ Double same-sign (unilateral): "3.95+0.02+0.06", "3.95-0.02-0.06"
    if (criteria.match(/^[0-9.]+[+-][0-9.]+[+-][0-9.]+$/)) {
        const parts = criteria.match(/^([0-9.]+)([+-])([0-9.]+)[+-]([0-9.]+)/);
        if (parts) {
            const val = num(parts[1]);
            const sign = parts[2];
            const tol1 = num(parts[3]);
            const tol2 = num(parts[4]);
            const high = Math.max(tol1, tol2);
            const low = Math.min(tol1, tol2);
            if (sign === "+")
                return { baseVal: val, min: val + low, max: val + high };
            else
                return { baseVal: val, min: val - high, max: val - low };
        }
    }

    // ✅ Single tolerance (12+0.1 or 12-0.1)
    if (criteria.match(/^[0-9.]+[+-][0-9.]+$/)) {
        const match = criteria.match(/^([0-9.]+)([+-])([0-9.]+)/);
        if (match) {
            const val = num(match[1]);
            const sign = match[2];
            const tol = num(match[3]);
            if (sign === "+") return { baseVal: val, min: val, max: val + tol };
            else return { baseVal: val - tol, min: val - tol, max: val };
        }
    }

    // ✅ Fallback — if only a single number or text like "88.3 N/ 9Kgf Min"
    if (criteria.toLowerCase().includes("min")) {
        return { baseVal, min: baseVal, max: null }; // Max not defined
    }

    return { baseVal, min: baseVal, max: baseVal };
}


/*
function parseAdvancedTolerance(criteria) {
    if (!criteria || typeof criteria !== "string")
        return { baseVal: 0, min: 0, max: 0 };

    criteria = criteria.replace(/\s+/g, "");  // remove spaces
	
    const baseValMatch = criteria.match(/[-+]?[0-9]*\.?[0-9]+/);
    if (!baseValMatch) return { baseVal: 0, min: 0, max: 0 };

    const baseVal = parseFloat(baseValMatch[0]);

    // ++ tolerance (3.95+0.06+0.02 or 3.95+0.02+0.06)
    if (/^\d+(\.\d+)?\+\d+(\.\d+)?\+\d+(\.\d+)?$/.test(criteria)) {
        const parts = criteria.split("+").map(Number).filter(v => !isNaN(v));
        const [val, t1, t2] = parts;
        const upper = Math.max(t1, t2);
        const lower = Math.min(t1, t2);
        return { baseVal: val, min: val + lower, max: val + upper };
    }

    // -- tolerance (3.95-0.06/-0.02 or 3.95-0.02-0.06)
    if (/^\d+(\.\d+)?-0?\d+(\.\d+)?(\/-0?\d+(\.\d+)?)?$/.test(criteria)) {
        const match = criteria.match(/(\d+(\.\d+)?)\-0?(\d+(\.\d+)?)(?:[\/\-]0?(\d+(\.\d+)?))?/);
        if (match) {
            const val = parseFloat(match[1]);
            const t1 = parseFloat(match[3]);
            const t2 = parseFloat(match[5] || t1);
            const upper = Math.min(t1, t2);
            const lower = Math.max(t1, t2);
            return { baseVal: val, min: val - lower, max: val - upper };
        }
    }

    // + / - format (12+0.5/-0.2)
    const plusMinusMatch = criteria.match(/([0-9]*\.?[0-9]+)\+([0-9]*\.?[0-9]+)\/-([0-9]*\.?[0-9]+)/);
    if (plusMinusMatch) {
        const val = parseFloat(plusMinusMatch[1]);
        const tolPlus = parseFloat(plusMinusMatch[2]);
        const tolMinus = parseFloat(plusMinusMatch[3]);
        return { baseVal: val, min: val - tolMinus, max: val + tolPlus };
    }

    // ± format (12±0.5)
    if (criteria.includes("±")) {
        const [valStr, tolStr] = criteria.split("±");
        const val = parseFloat(valStr);
        const tol = parseFloat(tolStr);
        return { baseVal: val, min: val - tol, max: val + tol };
    }

    // single + or -  ( NOT 2 SIGNS)
	// ✅ Simple + or - tolerance (e.g., ONLY 12+0.1 or  ONLY 12-0.1)
    if (/^\d+(\.\d+)?[+-]\d+(\.\d+)?$/.test(criteria)) {
        const parts = criteria.match(/([\d.]+)([+-])([\d.]+)/);
        if (parts) {
            const base = parseFloat(parts[1]);
            const sign = parts[2];
            const tol = parseFloat(parts[3]);
            if (sign === "+") return { baseVal: base, min: base, max: base + tol };
            else return { baseVal: base, min: base - tol, max: base };
        }
    }

    return { baseVal, min: baseVal, max: baseVal };
}*/


/*
| Input             | Min  | Max  | Works?  |
| ----------------- | ---- | ---- | ------  |
| `3.95+0.06+0.02`  | 3.97 | 4.01 | ✅      |
| `3.95+0.02+0.06`  | 3.97 | 4.01 | ✅      |
| `3.95-0.06/-0.02` | 3.89 | 3.93 | ✅      |
| `3.95-0.02-0.06`  | 3.89 | 3.93 | ✅      |
| `12+0.5/-0.2`     | 11.8 | 12.5 | ✅      |
| `12±0.5`          | 11.5 | 12.5 | ✅      |
| `12+0.1`          | 12.0 | 12.1 | ✅      |
| `12-0.1`          | 11.9 | 12.0 | ✅      |

*/
