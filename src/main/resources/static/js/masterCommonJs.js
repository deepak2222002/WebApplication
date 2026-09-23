
var pageSize = 25;
var lastSequenceNumber = 0; //check
var lastPage; //check
var lastSelectedRow = -1; // To keep track of the last selected row
var deleteAllList = []; // To keep track of selected row IDs // Global Array to store all selected rows
var masterIdAndAuthority = {};
var rowId;
var object;
let totalRowInterval;

window.addEventListener('beforeunload', function(event) {
	event.preventDefault();
	event.returnValue = '';
	var confirmationMessage = 'Are you sure you want to leave?';
	(event || window.event).returnValue = confirmationMessage; // Standard
	return confirmationMessage; // For some older browsers
});


readWrite();
function readWrite() {

	$.ajax({
		url: '/WebApplication/Controllers/getMasterAuthorityByUser/' + sessionStorage.getItem('employeeId') + '',
		type: 'GET',
		contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		dataType: 'json',
		success: function(res) {
			var list = res.masterId.split("-");
			for (var i = 0; i < list.length; i++) {
				var list2 = list[i].split(",");
				masterIdAndAuthority[list2[0]] = list2[1];
			}

		}, error: function(res) {
		}
	});
}


window.logout = logout;
function logout() {
	//window.location.replace("/WebApplication/loginpage");

	$.ajax({
		url: '/WebApplication/auth/logout',
		type: 'POST',
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		dataType: 'json',
		success: function(res) {

			window.location.replace("/WebApplication/loginpage");

		}, error: function(res) {

			window.location.replace("/WebApplication/loginpage");
		}
	});
}


//home module modal display
$(document).on('click', '#developer', function() {
	$('#myModal').modal('show');
});


$('.link').off('click').on('click', function(event) {


	var target = event.target.id;

	if (target == "masters") {
		window.location.replace("/WebApplication/masters/dashboard");
	} else if (target == "training") {
		window.location.replace("/WebApplication/dashboard");
	}
});



$(document).ready(function() {

	$("#loadingBackdropButton").click();
	setTimeout(function() {
		$("#ulList  li:first ul li:first a").click();
		$("#loadingBackdropButton").click();
		$("#offcanvasCloseButton").click();
	}, 1000)
});
$(document).on('input', '#masterSearch', function() {

	var masterName = $("input[name=masterSearch]").val();

	if (!masterName) {
		masterName = "-";
	}

	$.ajax({
		type: 'GET',
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		url: '/WebApplication/Controllers/getMastersDetails/' + masterName + '/' + sessionStorage.getItem('employeeId'),
		success: function(response) {
			$("#ulList").empty();

			for (var i = 0; i < response.modules.length; i++) {
				var li = document.createElement("li");
				li.setAttribute("class", "nav-items");
				var img = document.createElement("img");
				var a = document.createElement("a");
				a.setAttribute("id", response.modules[i]);
				a.innerText = response.modules[i];
				img.setAttribute("class", "upwardDownward");
				img.setAttribute("src", "/WebApplication/images/upward.png");
				img.setAttribute("style", "float:right; right: 20px; margin-top: 15px; height: 8px; width: 15px;");
				li.append(img, a);
				var ul = document.createElement("ul");
				ul.setAttribute("class", "list");
				ul.setAttribute("style", "display:block");
				li.append(ul);
				for (var j = 0; j < response.masterId.length; j++) {

					if (response.modules[i] == response.masterId[j].module) {

						var subLi = document.createElement("li");
						ul.append(subLi);
						subLi.setAttribute("style", "display:block");
						subLi.setAttribute("class", "sub-menu");
						var suba = document.createElement("a");
						subLi.append(suba);
						suba.setAttribute("id", response.masterId[j].masterIdS);
						suba.append(response.masterId[j].masterName);
						$("#ulList").append(li);

					}
				}
			}
		},
		error: function(response) {

		}
	});
});

$(document).on('keydown', '#masterSearch', function(e) {
	if (e.key === "Enter") {
		e.preventDefault();
		$("#ulList  li:first ul li:first a").click();
	}

});

window.makePagerBody = makePagerBody;
function makePagerBody(container) {

	var pager = '<div class="d-flex justify-content-between align-items-center p-1">' +
		'<div><button class="btn btn-dark" id="previous">Previous</button></div>' +
		'<div class="container d-flex justify-content-end align-items-center">' +
		'<div class="pageSizeAndNo mr-3"> Page Size <select id="pageSize" class="inputs">' +
		'<option value="25">25</option>' +
		'<option value="50">50</option>' +
		'<option value="75">75</option>' +
		'<option value="100">100</option>' +
		'</select></div>' +
		'<div class="pageSizeAndNo mr-3"> Page <select id="pager" class="inputs"></select></div>' +
		'</div> ' +
		'<div ><button class="btn btn-dark" id="next">Next</button></div>' +
		'</div>';

	$("#" + container).append(pager);

}

$(document).on('click', '.sub-menu', function(event) {

	addAndRemoveClass();
});

window.addAndRemoveClass = addAndRemoveClass;
function addAndRemoveClass() {

	var text = $("#masterHeading").text();

	if (text == "STATION AND SETTING MASTER") {
		$("#tableContainer").addClass("row").css("background", "transparent");
	} else {
		$("#tableContainer").removeClass("row").css("background", "white");
	}
}

window.loadDataAndPager = loadDataAndPager;
function loadDataAndPager() {

	if (!$('#pager :selected').val()) {

		handlePageChange(0);
	} else {
		handlePageChange($('#pager :selected').val());
	}
}

window.showModal = showModal;
function showModal(modalButton) {

	setTimeout(function() {
		$("#" + modalButton).click();
	}, 200);

}

window.hideModal = hideModal;
function hideModal(modalButton) {

	setTimeout(function() {
		$("#" + modalButton).click();
	}, 500);

}

window.showSuccessResponse = showSuccessResponse;
function showSuccessResponse(id, text) {

	$("#" + id).text(text);
	$("#" + id).attr("style", "color:limegreen;");

}

window.showErrorResponse = showErrorResponse;
function showErrorResponse(id, text) {
	$("#" + id).text(text);
	$("#" + id).attr("style", " color:red;");
}

window.clearInputs = clearInputs;
function clearInputs(id) {
	$("." + id).prop("value", "");

}


window.clearSelectInputs = clearSelectInputs;
function clearSelectInputs(id) {
	$("." + id).prop("value", "Select");

}

window.resetValues = resetValues;
function resetValues() {
	var masterheading = getTextById("masterHeading");

	var skipResetMasters = ["INSTRUMENT MASTER"];
	if (skipResetMasters.includes(masterheading)) { // skipping reset for these masters.

		// For INSTRUMENT MASTER → reset but keep calibration red rows
		// Loop through each row and only remove style if it's NOT your red one
		$("#table1 tr").each(function() {
			const isRed = (color) => color.includes("248, 215, 218");

			// 'rgb(248, 215, 218)' is the browser-computed value for '#f8d7da'
			if (!isRed($(this).css("background-color"))) { // don't remove the RED color which is for calibration due
				$(this).removeAttr("style");
				$(this).removeClass("selected");
			}
			console.log("resdone1");
		});
		console.log("resdone2");

	} else { // for other master reset the colors of row and other things as it is

		// 1. Remove row highlighting
		$("tr").siblings().removeAttr("style");
		$("#table1 tr.selected").removeClass("selected"); // remove the .selected class
		console.log("resdone3");
	}

	console.log("resetValues called");
	clearInputs("textInput");
	clearSelectInputs("selectInput");
	deleteAllList = [];
	object = "";
	lastSelectedRow = -1;

	// below values which are set in this DOCUMENT REGISTER MASTER edit part
	documentId = "";
	existingDocPath = "";
}

window.makeTable = makeTable;
function makeTable(headerList, placeholderList, searchList, containerId, tableId, width) {

	var table = document.createElement("table");
	$("#" + containerId).append(table);
	table.setAttribute("id", tableId);
	table.setAttribute("style", "width:" + width + ";")
	table.setAttribute("cellspacing", "0px");
	table.setAttribute("class", "table-hover");

	var searchRow = document.createElement("tr");
	var headingRow = document.createElement("tr");

	if (searchList.length > 0) {

		searchRow.setAttribute("id", "searchRow");
		var imgContainer = document.createElement("th");
		imgContainer.setAttribute("class", "tableheading");
		var img = document.createElement("img");
		img.setAttribute("src", "/WebApplication/images/searchFilter.png");
		img.setAttribute("id", "searchButton");
		img.setAttribute("width", "22");
		img.setAttribute("height", "22");
		// Add the tooltip text
		img.setAttribute("title", "Type in the search box and click this icon to find results.");
		imgContainer.append(img);
		searchRow.append(imgContainer);

		for (var i = 0; i < searchList.length; i++) {
			var th = document.createElement("th");
			th.setAttribute("class", "tableheading");
			th.setAttribute("style", "padding-top: 8px;"); // Add padding to create space
			if (searchList[i] != "") {
				var input = document.createElement("input");
				input.setAttribute("name", searchList[i]);
				input.setAttribute("id", searchList[i]);
				input.setAttribute("class", "searchFilterClass inputs");
				// Set placeholder dynamically
				input.setAttribute("placeholder", placeholderList[i] + " ....."); // set placeholder

				th.append(input);
			}

			searchRow.append(th);
		}
	}

	for (var i = 0; i < headerList.length; i++) {
		var th = document.createElement("th");
		th.setAttribute("class", "tableheading");
		th.append(headerList[i]);
		headingRow.append(th);
	}

	var thead = document.createElement("thead");
	thead.setAttribute("id", tableId + "Head");

	var tbody = document.createElement("tbody");
	tbody.setAttribute("id", tableId + "Body");

	table.append(thead, tbody);
	thead.append(searchRow, headingRow);
}


window.makeTableEmptyBody = makeTableEmptyBody;
function makeTableEmptyBody(tableId, trSize, tdSize) {

	$("#" + tableId + "Body").empty();

	for (var i = 0; i <= trSize; i++) {

		var tr = document.createElement("tr");
		tr.setAttribute("class", "tableDataRows");

		for (var j = 0; j < tdSize; j++) {
			var td = document.createElement("td");
			tr.append(td);
		}
		$("#" + tableId).append(tr);
	}
}

window.multipleTabs = multipleTabs;
function multipleTabs(tabList, containerId) {

	var tabButtonContainer = document.createElement("div");
	tabButtonContainer.setAttribute("class", "d-flex");
	$("#" + containerId).append(tabButtonContainer);

	for (var i = 0; i < tabList.length; i++) {

		var button = document.createElement("button");
		var list = tabList[i].split("_");

		var text = "";

		for (var j = 0; j < list.length; j++) {
			text = text + " " + list[j];
		}

		button.innerText = text;
		button.setAttribute("id", removeSpaces(tabList[i]) + "Tab");
		button.setAttribute("class", "tabs selectedTab");
		tabButtonContainer.append(button);

		var tabBodyContainer = document.createElement("div");
		tabBodyContainer.setAttribute("id", removeSpaces(tabList[i]) + "TabBody");
		tabBodyContainer.setAttribute("class", "TabBody");
		$("#" + containerId).append(tabBodyContainer);

		if (i <= tabList.length - 2) {
			button.setAttribute("class", "tabs");
			tabBodyContainer.setAttribute("style", "display:none");
		}
	}
}


window.removeSpaces = removeSpaces;
function removeSpaces(str) {
	return str.replace(/\s+/g, '');
}


$(document).on('click', '.tabs', function(event) {
	$("#" + event.target.id + "Body").css("display", "block");
	$("#" + event.target.id).addClass("selectedTab");
	$("#" + event.target.id).siblings().removeClass("selectedTab");
	$("#" + event.target.id + "Body").siblings().css("display", "none");

});


$(document).on('click', '.inputs', function(event) {

	$("#" + event.target.id).removeAttr("style");

});

window.createInput = createInput;
function createInput(attr, containerId, heading) {

	var input = document.createElement("input");
	var Attr = attr;

	for (var i = 0; i <= Attr.length - 1; i = i + 2) {
		for (var j = 0; j <= i; j = j + 2) {
			input.setAttribute(Attr[i], Attr[j + 1]);
		}
	}

	input.setAttribute("autocomplete", "off");
	// Create heading with the 'heading3' class
	var headingElement = document.createElement("span");
	headingElement.className = "heading3";
	headingElement.textContent = heading + ":";

	// Append heading and input to the container
	containerId.append(headingElement, input);

}

window.createPasswordInput = createPasswordInput;
function createPasswordInput(attr, containerId, heading) {
	// Create wrapper
	const wrapper = document.createElement("div");
	wrapper.className = "password-wrapper";
	wrapper.style.marginTop = "10px";

	// Create heading
	const headingElement = document.createElement("span");
	headingElement.className = "heading3";
	headingElement.textContent = heading + ":";

	// Create password input
	const input = document.createElement("input");
	for (let i = 0; i < attr.length; i += 2) {
		input.setAttribute(attr[i], attr[i + 1]);
	}
	input.setAttribute("autocomplete", "off");

	// Create checkbox and label
	const checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.id = "check";
	checkbox.className = "radio";

	const label = document.createElement("span");
	label.id = "show";
	label.innerText = " Show password";

	checkbox.onclick = function() {
		input.type = input.type === "password" ? "text" : "password";
	};

	// Append everything
	wrapper.appendChild(headingElement);
	wrapper.appendChild(input);
	wrapper.appendChild(document.createElement("br")); // optional
	wrapper.appendChild(checkbox);
	wrapper.appendChild(label);

	containerId.appendChild(wrapper);
}



window.createTextarea = createTextarea;
function createTextarea(attr, containerId, heading) {
	const textarea = document.createElement("textarea");

	// Apply all attributes from the attr array
	for (let i = 0; i < attr.length; i += 2) {
		textarea.setAttribute(attr[i], attr[i + 1]);
	}

	// Optional defaults (you can remove or adjust as needed)
	textarea.setAttribute("autocomplete", "off");
	textarea.style.resize = "vertical";

	// Create heading label
	const headingElement = document.createElement("span");
	headingElement.className = "heading3";
	headingElement.textContent = heading + " ";

	// Append to container
	containerId.append(headingElement, textarea);
}

window.createSelectList = createSelectList;
function createSelectList(attr, containerId, heading) {

	var input = document.createElement("select");
	var Attr = attr;

	for (var i = 0; i <= Attr.length - 1; i = i + 2) {
		for (var j = 0; j <= i; j = j + 2) {
			input.setAttribute(Attr[i], Attr[j + 1]);
		}
	}

	// Create heading with the 'heading3' class
	var headingElement = document.createElement("span");
	headingElement.className = "heading3";
	headingElement.textContent = heading + " : ";

	// Append heading and input to the container
	containerId.append(headingElement, input);

}

window.showMandatory = showMandatory;
function showMandatory(selectors) {
	var missingFields = [];

	selectors.forEach(function(selector) {
		var $field = $(selector);
		var fieldValue = $field.val();

		// Check for 'textInput' class
		// also works for the date input just make the class as textInput in Inputs modal
		if ($field.hasClass("textInput")) {
			if (!fieldValue) {
				$field.css("border", "1px solid red"); // Highlight as mandatory
				missingFields.push($field.attr("placeholder") || $field.attr("name") || selector);
			} else {
				$field.css("border", ""); // Reset border
			}
		}

		if ($field.hasClass("selectInput")) {

			// Check for 'selectInput' class
			if (fieldValue === "Select") {
				$field.css("border", "1px solid red"); // Highlight as mandatory
				missingFields.push($field.attr("placeholder") || $field.attr("name") || selector);
			} else {
				$field.css("border", ""); // Reset border
			}
		}
	});

	if (missingFields.length > 0) {
		$("#responseContainer").attr("style", "font-size:15px;color:red; width:80%; height:30px; text-align:center;");
		return false; // Indicate missing mandatory fields
	}
	return true; // All fields are valid
}

window.insertOptionById = insertOptionById;
function insertOptionById(id, text) {

	var option = document.createElement("option");
	option.setAttribute("value", text);
	option.innerText = text;

	$("#" + id).append(option);

}


window.setOptionById = setOptionById;
function setOptionById(id, text) {

	$("#" + id).text(text);
}


window.setTextById = setTextById;
function setTextById(id, text) {

	$("#" + id).text(text);

}

window.getTextById = getTextById;
function getTextById(id) {

	return $("#" + id).text();

}

window.getSequenceNumber = getSequenceNumber;
function getSequenceNumber() {

	if (!$('#pager :selected').val()) {
		return 0;
	} else {
		return pageSize * parseInt($('#pager :selected').val());
	}

}

window.makePagerByTotalPages = makePagerByTotalPages;
async function makePagerByTotalPages(res, page) {

	var totalPages = res.totalPages;

	$("#pager").empty();

	for (var i = 0; i <= totalPages - 1; i++) {
		$("#pager").append("<option value='" + i + "'>" + (i + 1) + "</option>");
	}

	$("#pager").val(page);
}


$(document).on("change", "#pageSize", function() {

	pageSize = parseInt($(this).val());

	handlePageChange(0);

});

$(document).on("change", "#pager", function() {
	var selectedPage = parseInt($(this).val());
	handlePageChange(selectedPage);
});

$(document).on("click", "#previous", function() {
	var selectedPage = parseInt($("#pager").val());
	if (selectedPage > 0) {
		handlePageChange(selectedPage - 1);
	}
});

$(document).on("click", "#next", function() {
	var selectedPage = parseInt($("#pager").val());
	var totalPages = parseInt($("#pager option:last").val());
	if (selectedPage < totalPages) {
		handlePageChange(selectedPage + 1);
	}
});

$(document).on("click", "#searchButton", function() {
	var selectedPage = getSequenceNumber();
	handlePageChange(selectedPage);
});


$(document).on('click', '.summerize', function() {

	// console.log(object);
	var text = document.getElementById("masterHeading").innerHTML;

	var returnValue = checkSelectedRow();

	if (returnValue == false) {
		return;
	}

	$("#addEditDeleteModalBody").empty();
	$("#detailModalBody").empty();
	$("#detailBackdropButton").click();
	$("#detailBackdropLabel").text("RQC-P Review");
	$("#detailModalFooter").css("display", "none");

	if (text == "RQC CREATION MASTER") {
		console.log(returnValue)
		getAllMispParameterInDetailModal(object.mispNumber, object.revNumber);
	}/* else if (text == "FINAL INSPECTION RQC-P CREATION MASTER") {
		getAllFinalControlMispParameterInDetailModal(object.mispNumber, object.revNumber);
	}*/

});


window.getIdByMasterName = getIdByMasterName;
function getIdByMasterName(masterName) {

	$.ajax({
		url: '/WebApplication/Controllers/getIdByMasterName/' + masterName,
		type: 'GET',
		contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		dataType: 'json',
		success: function(res) {

			enableAndDisableButtons(res.masterId);

		}, error: function(res) {

		}
	});
}

window.enableAndDisableButtons = enableAndDisableButtons;
function enableAndDisableButtons(id) {

	if (masterIdAndAuthority[id] == "0") {

		$(".add").attr("disabled", "disabled");
		$(".edit").attr("disabled", "disabled");
		$(".delete").attr("disabled", "disabled");
		$(".upload").attr("disabled", "disabled");

		$(".add").attr("style", "opacity:0.5");
		$(".edit").attr("style", "opacity:0.5");
		$(".delete").attr("style", "opacity:0.5");
		$(".upload").attr("style", "opacity:0.5");

		$(".add").attr("title", "Disable");
		$(".edit").attr("title", "Disable");
		$(".delete").attr("title", "Disable");
		$(".upload").attr("title", "Disable");

	} else if (masterIdAndAuthority[id] == "1") {

		$(".add").removeAttr("disabled");
		$(".edit").removeAttr("disabled");
		$(".delete").removeAttr("disabled");
		$(".upload").removeAttr("disabled");

		$(".add").removeAttr("style");
		$(".edit").removeAttr("style");
		$(".delete").removeAttr("style");
		$(".upload").removeAttr("style");

		$(".add").attr("title", "Add");
		$(".edit").attr("title", "Edit");
		$(".delete").attr("title", "Delete", "disabled", "disabled", "style", "opacity:0.5");
		$(".upload").attr("title", "Upload");
	} else {


		$(".add").attr("disabled", "disabled");
		$(".edit").attr("disabled", "disabled");
		$(".delete").attr("disabled", "disabled");
		$(".upload").attr("disabled", "disabled");
	}
}

window.configureButtons = configureButtons;
function configureButtons(buttonStates) {
	// All containers off by default
	document.querySelectorAll("#div4 .buttonsContainer").forEach(container => {
		container.style.display = "none"; // Hide the container
		const button = container.querySelector("button");
		if (button) {
			button.disabled = true; // Disable the button
		}
	});

	// Enable and show containers specified as "show"
	for (const [buttonClass, state] of Object.entries(buttonStates)) {
		const container = document.querySelector(`#div4 #${buttonClass}Container`);
		if (container) {
			if (state.toLowerCase() === "show") {
				container.style.display = ""; // Use "" to restore original display style applied in css
				const button = container.querySelector("button");
				if (button) {
					button.disabled = false; // Enable the button
				}
			}
		}
	}
}

// replacing any older button
window.replaceButton = replaceButton;
function replaceButton(oldId, newId, newClass, newTitle, clickHandler) {
	const oldContainer = document.getElementById(oldId + "Container");

	if (!oldContainer) {
		console.warn(`Container for ID '${oldId}' not found.`);
		return;
	}

	// Remove the old button
	oldContainer.innerHTML = "";

	// Create a new button
	const newButton = document.createElement("button");
	newButton.setAttribute("id", newId); // Optional: set id
	newButton.setAttribute("class", newClass); // Example: "summerize"
	newButton.setAttribute("title", newTitle); // Example: "MIS-P Review"

	// Apply click event handler
	if (typeof clickHandler === "function") {
		newButton.addEventListener("click", clickHandler);
	}

	// Append new button to container
	oldContainer.appendChild(newButton);
}
/*------------------------------------------------------------pagination-----------------------------------------------------*/
function handlePageChange(page) {
	var text = $("#masterHeading").text();
	searchLoad = false;
	var text = document.getElementById("masterHeading").innerHTML;
	if (text == "PLANT MASTER") {
		loadLikePlantData(page, pageSize);
	} else if (text == "LINE MASTER") {
		loadLikeLineData(page, pageSize);
	} else if (text == "LINE STATION MASTER") {
		loadLikeLineStationData(page, pageSize);
	} else if (text == "STATION LINK MASTER") {
		loadLikeStationLinkData(page, pageSize);
	} else if (text == "LOGIN MASTER") {
		loadLikeLoginMasterData(page, pageSize);
	} else if (text == "PRODUCT MASTER") {
		loadLikeProductData(page, pageSize);
	} else if (text == "SUB PRODUCT MASTER") {
		loadLikeSubProductData(page, pageSize);
	} else if (text == "ROLE MASTER") {
		loadLikeRoleData(page, pageSize);
	} else if (text == "SHEET DETAIL MASTER") {
		loadLikeSheetDetailData(page, pageSize);
	} else if (text == "EXCEL REPORT MASTER") {
		loadLikeExcelReportData(page, pageSize);
	} else if (text == "MACHINE CHECK SHEET FIELD MASTER") {
		loadLikeMachineCheckSheetFieldData(page, pageSize);
	} else if (text == "MACHINE CHECK SHEET LINK MASTER") {
		loadLikeMachineCheckSheetLinkData(page, pageSize);
	} else if (text == "WHO MASTER") {
		loadLikeWhoDetailData(page, pageSize);
	} else if (text == "HOW MASTER") {
		loadLikeHowDetailData(page, pageSize);
	} else if (text == "WHEN MASTER") {
		loadLikeWhenDetailData(page, pageSize);
	} else if (text == "DEPARTMENT MASTER") {
		loadLikeDepartmentData(page, pageSize);
	} else if (text == "INSTRUMENT MASTER") {
		loadLikeInstrumentData(page, pageSize);
	} else if (text == "MATERIAL MASTER") {
		loadLikeMaterialData(page, pageSize);
	} else if (text == "CUSTOMER MODEL MAPPING MASTER") {
		loadLikeCustomerModelMappingData(page, pageSize);
	} else if (text == "SAMPLING PLAN MASTER") {
		loadLikeSamplingPlanData(page, pageSize);
	} else if (text == "RQC CREATION MASTER") {
		loadLikeRqcCreationMasterData(page, pageSize);
	} else if (text == "RQC APPROVAL") {
		loadApprovalPendingMispData(page, pageSize); // This handles both search & non-search
		// console.log(page, pageSize);
	} else if (text == "DOCUMENT CATEGORY MASTER") {
		loadLikeDocumentCategoryData(page, pageSize);
	} else if (text == "DOCUMENT REGISTER MASTER") {
		loadLikeDocumentRegisterData(page, pageSize);
	} else if (text == "SIGN MASTER") {
		loadLikeExcelSignData(page, pageSize);
	} else if (text == "PH INSPECTION  MASTER") {
		loadLikePhInspectionReqMasterData(page, pageSize);
	} else if (text == "SUPPLIER MASTER") {
		loadLikeSupplierData(page, pageSize);
	} else if (text == "IONIZER FIELD MASTER") {
		loadLikeIonizerFieldData(page, pageSize);
	} else if (text == "IONIZER LINK MASTER") {
		loadLikeIonizerLinkData(page, pageSize);
	}

	lastSequenceNumber = (page - 1) * 10 + 1;
	lastPage = page;
}


$(document).on('click', '.nav-items', function(event) {
	var menuItems = $(this).children("ul");
	var innerEventHandled = false;

	var image = $(this).children(".upwardDownward");
	var srcValue = image.attr("src");

	if (srcValue == "/WebApplication/images/upward.png") {
		image.attr("src", "/WebApplication/images/downword.png");
	} else {
		image.attr("src", "/WebApplication/images/upward.png");
	}
	$(document).on('click', '.list li.sub-menu', function() {
		innerEventHandled = true;
		return false;
	});

	menuItems.each(function() {
		$(this).find('li').each(function() {
			if (innerEventHandled) {
				return false;
			}
			event.preventDefault();
			toggleSubMenu(this);
		});
	});
});

// Function to toggle visibility of submenu
function toggleSubMenu(subMenu) {
	var isVisible = subMenu.style.display === 'block';
	subMenu.style.display = isVisible ? 'none' : 'block';
}


/******************************************* CLICK EVENT ***************************************/
// Map masterHeading to corresponding ID keys
const masterIdMap = {
	"DOCUMENT CATEGORY MASTER": "categoryId",
	"DOCUMENT REGISTER MASTER": "documentId",
	"PLANT MASTER": "plantId",
	"LINE MASTER": "lineId",
	"SHEET DETAIL MASTER": "sheetDetailId",
	"EXCEL REPORT MASTER": "reportId",
	"MACHINE CHECK SHEET FIELD MASTER": "MCSfieldId",
	"MACHINE CHECK SHEET LINK MASTER": "MCSLinkId",
	"WHO MASTER": "whoId",
	"WHEN MASTER": "whenId",
	"HOW MASTER": "howId",
	"DEPARTMENT MASTER": "departmentId",
	"ROLE MASTER": "roleId",
	"INSTRUMENT MASTER": "instrumentId",
	"MATERIAL MASTER": "materialId",
	"CUSTOMER MODEL MAPPING MASTER": "customerModelId",
	"SAMPLING PLAN MASTER": "samplingPlanId",
	"RQC CREATION MASTER": "qualityId",
	"LOGIN MASTER": "loginId",
	"SUPPLIER MASTER": "supplierId",
	"SIGN MASTER": "excelSignId",
	"PH INSPECTION  MASTER": "phInspectionReqId",
	"IONIZER FIELD MASTER": "IonizerfieldId",
	"IONIZER LINK MASTER": "IonizerLinkId"
};

// Common function to handle row selection styling
function updateRowStyle(row) {
	row.css({ "background-color": "blue", "color": "white" })
		.siblings().removeAttr("style");
}

// click event
$(document).on('click', '#table1 tbody tr', function() {

	resetValues(); // different from resetselection

});


// Double-click event
$(document).on('dblclick', '#table1 tbody tr', function() {
	// Double-click logic
	$(this).addClass('selected').siblings().removeClass('selected');
	selectedRow = $(this); // <-- Store globally
	var row = $(this);
	let rowValues = {}; //An empty object to hold data
	let temp;
	deleteAllList = []; 	// Reset the list

	// Populate rowValues object
	row.find('td').each(function() {
		temp = $(this);
		rowValues[temp.data('column')] = temp.text();
	});

	let text = $("#masterHeading").text(); // Get current master heading
	let masterKey = masterIdMap[text]; // Get corresponding key
	// console.log(masterKey);

	// If masterKey exists, process the row
	if (masterKey) {
		deleteAllList.push(rowValues[masterKey]);
		createUserId = rowValues[masterKey];
		object = rowValues;
		object._rowRef = $(this); // Store selected row inside object
		updateRowStyle(row); // Apply styling
	}
	console.log(object);

	// console.log(deleteAllList);


	if (text == "RQC APPROVAL") {

		object = rowValues;
		$(this).attr("style", "background-color:blue;color:white;");
		$(this).siblings().removeAttr("style");
		$("#addEditDeleteModalBody").empty();
		$("#detailModalBody").empty();
		$("#detailBackdropButton").click();
		$("#detailBackdropLabel").text("RQC-P Approval")
		getAllMispParameterInDetailModal(object.mispNumber, object.revNumber);  // written in the rqc creation master. i.e. rqcMaster.js
		getCurrentDate();
		$("#implementDatee").val("");  // clears the previously selected date
		$("#detailModalFooter").removeAttr("style");
	}
});



function getCurrentDate() {   // used above for "RQC APPROVAL"

	var formData = {
		lineLeaderId: 1,
	}
	$.ajax({
		type: 'post',
		url: "/WebApplication/Controllers/getCurrentDate",
		data: JSON.stringify(formData),
		contentType: "application/json",
		async: false,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			$("#implementDatee").attr("min", response); //It sets today date as the minimum selectable date
		},
		error: function(response) {

		}
	});
}

window.resetselection = resetselection;   // different from resetValues() function
function resetselection() { // to remove the property of 'selected' class

	console.log("resetselection doe")
	// Find all rows with the 'selected' class
	$('#table1 tbody tr.selected').each(function() {
		$(this).removeClass('selected'); // Remove the 'selected' class
		$(this).css("background-color", "").css("color", ""); // Reset the styles
	});

	deleteAllList = [];// Clear the deleteAllList array

	// Reset any related variables if necessary
	lastSelectedRow = -1; // Reset lastSelectedRow
	loginId = "";
	createUserId = "";
	MCSfieldId = "";
	reportId = "";
	sheetDetailId = "";
	whoId = "";
	whenId = "";
	qualityId = "";
}


$(document).on('click', '#submit', function() {
	const Heading = document.getElementById("masterHeading").innerHTML;
	const text = document.getElementById("submit").innerHTML;

	// Disable the submit button
	$('#submit').css("opacity", "0.3").attr("disabled", "disabled");

	// Map master headings to their respective functions
	const functionMap = {
		"PLANT MASTER": { Add: addPlant, Edit: editPlant },
		"LINE MASTER": { Add: addLine, Edit: editLine },
		"MACHINE CHECK SHEET FIELD MASTER": { Add: addMachineCheckSheetField, Edit: editMachineCheckSheetField },
		"MACHINE CHECK SHEET LINK MASTER": { Add: addMachineCheckSheetLink, Edit: editMachineCheckSheetLink },
		"WHO MASTER": { Add: addWhoDetail, Edit: editWhoDetail },
		"WHEN MASTER": { Add: addWhenDetail, Edit: editWhenDetail },
		"HOW MASTER": { Add: addHowDetail, Edit: editHowDetail },
		"DEPARTMENT MASTER": { Add: addDepartment, Edit: editDepartment },
		"ROLE MASTER": { Add: addRole, Edit: editRole },
		"INSTRUMENT MASTER": { Add: addInstrument, Edit: editInstrument },
		"MATERIAL MASTER": { Add: addMaterial, Edit: editMaterial },
		"CUSTOMER MODEL MAPPING MASTER": { Add: addCustomerModelMapping, Edit: editCustomerModelMapping },
		"SAMPLING PLAN MASTER": { Add: addSamplingPlan, Edit: editSamplingPlan },
		"RQC CREATION MASTER": { Add: addQuality, Edit: editQuality },
		"LOGIN MASTER": { Add: addLogin, Edit: editLogin },
		"SIGN MASTER": { Add: addExcelSign, Edit: editExcelSign },
		"PH INSPECTION  MASTER": { Add: addPhInspectionReqMaster, Edit: editPhInspectionReqMaster },
		"SUPPLIER MASTER": { Add: addSupplier, Edit: editSupplier },
		"IONIZER FIELD MASTER": { Add: addIonizerField, Edit: editIonizerField },
		"IONIZER LINK MASTER": { Add: addIonizerLink, Edit: editIonizerLink }
		/*"ROLE MASTER": { Add: addRole, Edit: editRole },
		"LINE STATION MASTER": { Add: addLineStation, Edit: editLineStation }, */
	};

	// Execute the corresponding function
	if (functionMap[Heading] && functionMap[Heading][text]) {
		functionMap[Heading][text]();
	} else {
		console.error("No function found for", Heading, text);
	}

	// Re-enable submit button after 2 seconds
	setTimeout(function() {
		$('#submit').removeAttr("style").removeAttr("disabled").css("color", "white");
	}, 2000);

});

$(document).on('click', '.authorityHead', function() {
	var menuItems = $(this).siblings("tbody");
	var childrens = $(this).children("tr");

	var innerEventHandled = false;

	menuItems.each(function() {
		var isVisible = $(this).css('display') === 'none';

		if (isVisible) {
			$(this).attr("class", 'show');
		} else {
			$(this).removeClass("show");
		}
	});

	childrens.each(function() {

		var button = $(this).children('th').children('button').text();

		if (button == "Show") {
			$(this).children('th').children('button').text("Hide");
		} else {
			$(this).children('th').children('button').text("Show");
		}

	});
});

$(document).on('click', '.write', function() {

	var read = $(this).parent().siblings().children(".read");
	read.prop("checked", true);


});

$(document).on('click', '.read', function() {

	var readChecked = $(this).prop('checked');

	var write = $(this).parent().siblings().children(".write");

	if (!readChecked) {
		write.prop("checked", false);
	}
});

$(document).on('click', '.add', function() {

	var masterheading = getTextById("masterHeading");
	$("#submit").prop("disabled", false);

	// revert back to the class if rqc- creation made it xl modal again make it from xl to l
	$("#addEditDeleteBackdropModal :first-child").removeClass("modal-xl");
	// revert back to the class if doc category we made it lg modal again make it from lg to l
	$("#addEditDeleteBackdropModal :first-child").removeClass("modal-lg");
	$("#addEditDeleteBackdropModal :first-child").addClass("modal-l");
	$("#sendForApproval").css("display", "none"); // revert back to the class if rqc- creation made it

	showAddModal();

	if (masterheading == "PLANT MASTER") {
		setTextById("addEditDeleteBackdropLabel", "Add Plant:");
		plantMasterInputs("addEditDeleteModalBody");
		resetselection();
	} else if (masterheading == "LINE MASTER") {
		setTextById("addEditDeleteBackdropLabel", "Add Line:");
		lineMasterInputs("addEditDeleteModalBody");
		resetselection();
	} else if (masterheading == "LINE STATION MASTER") {
		setTextById("addEditDeleteBackdropLabel", "Add Line Station:");
		lineStationMasterInputs("addEditDeleteModalBody");
		resetselection();
	} else if (masterheading == "STATION LINK MASTER") {
		setTextById("addEditDeleteBackdropLabel", "Add Station Linking:");
		stationLinkMasterInputs("addEditDeleteModalBody");
		resetselection();
	} else if (masterheading == "LOGIN MASTER") {
		setTextById("addEditDeleteBackdropLabel", "Add Login:");
		var tabList = ["User_Details", "Master_Authority", "Report_Authority"];
		multipleTabs(tabList, "addEditDeleteModalBody");
		loginMasterInputs("User_DetailsTabBody");
		resetselection();
	} else if (masterheading == "PRODUCT MASTER") {
		setTextById("addEditDeleteBackdropLabel", "Add Product:");
		productMasterInputs("addEditDeleteModalBody");
		resetselection();
	} else if (masterheading == "SUB PRODUCT MASTER") {
		setTextById("addEditDeleteBackdropLabel", "Add SubProduct:");
		subProductMasterInputs("addEditDeleteModalBody");
		resetselection();
	} else if (masterheading == "BOM MASTER") {
		setTextById("addEditDeleteBackdropLabel", "Add BOM:");
		bomMasterInputs("addEditDeleteModalBody");
		resetselection();
	} else if (masterheading == "MANUFACTURING ORDER MASTER") {
		setTextById("addEditDeleteBackdropLabel", "Add Manufacturing Order:");
		manufacturingOrderMasterInputs("addEditDeleteModalBody");
		resetselection();
	} else if (masterheading == "STATION AND SETTING MASTER") {
		setTextById("addEditDeleteBackdropLabel", "Add Station Setting:");
		StationSettingMasterInputs("addEditDeleteModalBody");
		resetselection();
	} else if (masterheading == "ROLE MASTER") {
		setTextById("addEditDeleteBackdropLabel", "Add ROLE:");
		roleMasterInputs("addEditDeleteModalBody");
		resetselection();
	} else if (masterheading == "SHEET DETAIL MASTER") {
		setTextById("addEditDeleteBackdropLabel", "Add Sheet Details:");
		sheetDetailMasterInputs("addEditDeleteModalBody");
		resetselection();
	} else if (masterheading == "MACHINE CHECK SHEET FIELD MASTER") {
		setTextById("addEditDeleteBackdropLabel", "Add MC. Check Sheet Field Details:");
		machineCheckSheetFieldInputs("addEditDeleteModalBody");
		resetselection();
	} else if (masterheading == "MACHINE CHECK SHEET LINK MASTER") {
		setTextById("addEditDeleteBackdropLabel", "Add MC. Check Sheet Link Details:");
		machineCheckSheetLinkInputs("addEditDeleteModalBody");
		resetselection();
	} else if (masterheading == "WHO MASTER") {
		setTextById("addEditDeleteBackdropLabel", "Add Who Details:");
		whoDetailMasterInputs("addEditDeleteModalBody");
		resetselection();
	} else if (masterheading == "WHEN MASTER") {
		setTextById("addEditDeleteBackdropLabel", "Add When Details:");
		whenDetailMasterInputs("addEditDeleteModalBody");
		resetselection();
	} else if (masterheading == "HOW MASTER") {
		setTextById("addEditDeleteBackdropLabel", "Add How Details:");
		howDetailMasterInputs("addEditDeleteModalBody");
		resetselection();
	} else if (masterheading == "DEPARTMENT MASTER") {
		setTextById("addEditDeleteBackdropLabel", "Add Department Details:");
		departmentMasterInputs("addEditDeleteModalBody");
		resetselection();
	} else if (masterheading == "INSTRUMENT MASTER") {
		setTextById("addEditDeleteBackdropLabel", "Add Instrument Details:");
		InstrumentMasterInputs("addEditDeleteModalBody");
		resetselection();
	} else if (masterheading == "MATERIAL MASTER") {
		setTextById("addEditDeleteBackdropLabel", "Add Material Details:");
		materialMasterInputs("addEditDeleteModalBody");
		resetselection();
	} else if (masterheading == "CUSTOMER MODEL MAPPING MASTER") {
		setTextById("addEditDeleteBackdropLabel", "Add Cust. Model Details:");
		CustomerModelMappingMasterInputs("addEditDeleteModalBody");
		resetselection();
	} else if (masterheading == "SAMPLING PLAN MASTER") {
		setTextById("addEditDeleteBackdropLabel", "Add Sampling Plan Details:");
		SamplingPlanMasterInputs("addEditDeleteModalBody");
		resetselection();
	} else if (masterheading == "RQC CREATION MASTER") {
		setTextById("addEditDeleteBackdropLabel", "Add RQC-P :");

		$("#addEditDeleteBackdropModal :first-child").removeClass("modal-l");
		$("#addEditDeleteBackdropModal :first-child").addClass("modal-xl");

		createQualityMasterInputs("addEditDeleteModalBody");
		getAllInstrumentInQualityList();  // specially written in rqcMaster.js
		getAllPartNoFromBom();   // specially written in rqcMaster.js

		resetselection();

	} else if (masterheading == "DOCUMENT CATEGORY MASTER") {
		setTextById("addEditDeleteBackdropLabel", "Add Document Category Details:");

		// Revert back to modal-l
		$("#addEditDeleteBackdropModal :first-child").removeClass("modal-xl");
		$("#addEditDeleteBackdropModal :first-child").removeClass("modal-l");
		$("#addEditDeleteBackdropModal :first-child").addClass("modal-lg");

		documentCategoryMasterInputs("addEditDeleteModalBody");
		resetselection();

	} else if (masterheading == "DOCUMENT REGISTER MASTER") {
		setTextById("addEditDeleteBackdropLabel", "Add Document Register Details:");

		/*		// Revert back to modal-l
				$("#addEditDeleteBackdropModal :first-child").removeClass("modal-xl");
				$("#addEditDeleteBackdropModal :first-child").removeClass("modal-l");
				$("#addEditDeleteBackdropModal :first-child").addClass("modal-lg");*/

		documentRegisterMasterInputs("addEditDeleteModalBody");
		resetselection();
	} else if (masterheading == "SIGN MASTER") {
		setTextById("addEditDeleteBackdropLabel", "Add Excel Sign");
		ExcelSignMasterInputs("addEditDeleteModalBody");
		resetselection();
	} else if (masterheading == "PH INSPECTION  MASTER") {
		console.log("sdsd")
		setTextById("addEditDeleteBackdropLabel", "Add Ph Inspection Requirement");
		phInspectionReqMasterInputs("addEditDeleteModalBody");
		resetselection();
	} else if (masterheading == "SUPPLIER MASTER") {
		setTextById("addEditDeleteBackdropLabel", "Add Supplier");
		SupplierMasterInputs("addEditDeleteModalBody");
		resetselection();
	} else if (masterheading == "IONIZER FIELD MASTER") {
		setTextById("addEditDeleteBackdropLabel", "Add Ionizer Field Details");
		ionizerFieldInputs("addEditDeleteModalBody");
		resetselection();
	} else if (masterheading == "IONIZER LINK MASTER") {
		setTextById("addEditDeleteBackdropLabel", "Add Ionizer Link Details:");
		ionizerLinkInputs("addEditDeleteModalBody");
		resetselection();
	}
});

window.showAddModal = showAddModal;
function showAddModal() {

	showModal("addEditDeleteBackdropButton");
	$("#addEditDeleteModalBody").empty();
	setTextById("responseContainer", "");
	setTextById("submit", "Add");

}


$(document).on('click', '.edit', function() {

	var masterheading = getTextById("masterHeading");

	var returnValue = checkSelectedRow();

	if (returnValue == false) {
		return;
	}

	// revert back to the class if rqc- creation made it xl modal again make it from xl to l
	$("#addEditDeleteBackdropModal :first-child").removeClass("modal-xl");
	// revert back to the class if doc category we made it lg modal again make it from lg to l
	$("#addEditDeleteBackdropModal :first-child").removeClass("modal-lg");
	$("#addEditDeleteBackdropModal :first-child").addClass("modal-l");


	$("#sendForApproval").css("display", "none"); // revert back to the class if rqc- creation made it


	showEditModal();

	if (masterheading == "PLANT MASTER") {

		setTextById("addEditDeleteBackdropLabel", "Updating Plant:");
		plantMasterInputs("addEditDeleteModalBody");
		rowId = object.plantId;
		dateTimeCreation = object.dateTimeCreationd;
		$("#plantnameinput").prop("value", object.plantdName);
		$("#plantcodeinput").prop("value", object.plantdCode);
		$("#plantaddressinput").prop("value", object.plantdAddress);
		$("#plantcityinput").prop("value", object.plantdCity);
		$("#plantstateinput").prop("value", object.plantdState);
		$("#plantpinCodeinput").prop("value", object.plantdPincode);
		$("#plantcontactPersoninput").prop("value", object.plantdContactPerson);
		$("#plantmobileNoinput").prop("value", object.plantdMobileNo);

	} else if (masterheading == "SHEET DETAIL MASTER") {

		setTextById("addEditDeleteBackdropLabel", "Updating Sheet Details:");
		sheetDetailMasterInputs("addEditDeleteModalBody");
		rowId = object.sheetDetailId;
		dateTimeCreation = object.dateTimeCreationd;
		$("#sheetidinput").prop("value", object.sheetIdd);
		$("#fieldnameinput").prop("value", object.fieldNamed);
		$("#cellnoinput").prop("value", object.cellNod);
		$("#fieldtypeinput").prop("value", object.fieldTyped);
		$("#fieldmandatoryinput").prop("value", object.fieldMandatoryd);

	} else if (masterheading == "MACHINE CHECK SHEET FIELD MASTER") {

		setTextById("addEditDeleteBackdropLabel", "Updating MC Check Sheet Field Details:");
		machineCheckSheetFieldInputs("addEditDeleteModalBody");

		// Inject hidden input inside the form after rendering the modal body
		$("#addEditDeleteModalBody").append('<input type="hidden" id="existingParameterFilename" name="parameter">');
		// $("#parameterfileinput").val(fileName); // can't set this programmatically the input path. can only chose from browser.

		// console.log(object);
		MCSfieldId = object.MCSfieldId;
		dateTimeCreation = object.dateTimeCreationd;

		createdBy = object.createdBy;
		createdAt = object.createdAt;

		// Set Param Type (Text/Image)
		$("#ptypeinput").val(object.ptype).trigger("change"); // trigger change so wrapper visibility adjusts

		if (object.ptype == 0) {
			// Text
			$("#parameternameinput").val(object.parameter);
		} else if (object.ptype == 1) {
			// Image
			// Extract the actual image URL from hidden span inside the selected row in parameter field
			const fullPath = object._rowRef.find('td[data-column="parameter"] .hiddenUrl').text().trim();

			// Extract just the filename from the full path
			// Handles both Windows (`\`) and Unix-style (`/`) slashes
			const fileName = fullPath.split(/[/\\]/).pop(); // Handles Windows-style paths like D:\...\file.png


			// $("#parameterfileinput").val(fileName); // can't set this programmatically the input path. can only chose from browser.
			$("#existingParameterFilename").val(fileName);

			// Construct URL
			// 	 getting from MachineCheckSheetFieldAjaxController
			const url = `/WebApplication/Controllers/MachineCheckSheetFieldImage/${fileName}`;

			// console.log(url);
			const imgPreview = `<img src="${url}" style="max-width: 100%; max-height: 180px;" />`;
			$('#imagePreviewBox').html(imgPreview).show();

		}

		const howId = object._rowRef.find('td[data-column="how"]').data('how-id');
		const whoId = object._rowRef.find('td[data-column="who"]').data('who-id');
		const whenId = object._rowRef.find('td[data-column="whenColumn"]').data('whencolumn-id')

		$("#referenceinput").val(object.reference);

		// Set dropdowns
		setTimeout(() => {
			// Set dropdowns using the IDs
			$("#howDropdown").val(howId).trigger("change");
			$("#whoDropdown").val(whoId).trigger("change");
			$("#whenDropdown").val(whenId).trigger("change");
		}, 500); // waits for 0.5s

		// --- Date Required ---
		$("#dateRequired").val(object.dateRequired ?? "Select").trigger("change");
		console.log(object.dateRequired);
		// --- DateText ---
		if (object.dateRequired === "Yes") {
			$("#dateTextinput").val(object.dateText ?? "");
		}

		$("#vtypeDropdown").val(object.vtype).trigger("change");

		// Delay setting Pass If / Value 1 / Value 2, because they depend on VType
		setTimeout(() => {
			$("#passifDropdown").val(object.passif).trigger("change");

			setTimeout(() => {
				$("#value1Input").val(object.value1);
				$("#value2Input").val(object.value2);
			}, 100); // wait for Value 2 field to appear
		}, 100);


	} else if (masterheading == "MACHINE CHECK SHEET LINK MASTER") {
		setTextById("addEditDeleteBackdropLabel", "Updating MC. Sheet Link Details:");

		// Create the input layout again
		machineCheckSheetLinkInputs("addEditDeleteModalBody");

		console.log(object);
		// Save rowId and creation timestamp if needed
		MCSLinkId = object.MCSLinkId;
		dateTimeCreation = object.dateTimeCreation;

		// Get values from DOM if available
		const lineId = object._rowRef.find('td[data-column="line"]').data('line-id');
		const stationId = object._rowRef.find('td[data-column="station"]').data('station-id');
		const mcsFieldId = object._rowRef.find('td[data-column="mcsfield"]').data('field-id');
		const orderNo = object._rowRef.find('td[data-column="orderNo"]').text().trim();


		// Set Line after some delay
		setTimeout(() => {
			// Set dropdowns/inputs
			$("#lineDropdown").val(lineId).trigger("change");

			// Wait for stations to be populated
			getStationsByLineId("stationDropdown", lineId);

			// Then Trigger change so Station list loads based on selected line
			setTimeout(() => {
				// After station list is loaded, set the station
				$("#stationDropdown").val(stationId);
			}, 300); // Adjust if needed

		}, 300);

		// Set MCS Field after MCS field dropdown is ready
		setTimeout(() => {
			//$("#mcsfieldDropdown").val(mcsFieldId);
			$('#mcsfieldDropdown').val(mcsFieldId).trigger('change');

		}, 500);

		// Set Order immediately
		$("#orderinput").val(orderNo);


	} else if (masterheading == "LINE MASTER") {


		setTextById("addEditDeleteBackdropLabel", "Updating Line:");
		lineMasterInputs("addEditDeleteModalBody");
		rowId = object.lineId;
		dateTimeCreation = object.dateTimeCreationd;
		$("#linenameinput").prop("value", object.linedName);
		$("#plantcodeinput").prop("value", object.plantdCode);
		$("#linetypeinput").prop("value", object.linedType);

	} else if (masterheading == "LOGIN MASTER") {

		setTextById("addEditDeleteBackdropLabel", "Updating Login:");
		var tabList = ["User_Details", "Master_Authority", "Report_Authority"];
		multipleTabs(tabList, "addEditDeleteModalBody");
		loginMasterInputs("User_DetailsTabBody");
		rowId = object.loginId;
		dateTimeCreation = object.dateTimeCreationd;


		$("#plantcodeinput").prop("value", object.plantdCode);
		$("#departmentnameinput").prop("value", object.departmentId);
		$("#roleinput").prop("value", object.roleId);
		$("#employeeidinput").prop("value", object.employeedId);
		$("#emailinput").prop("value", object.emaild);
		$("#titleinput").prop("value", object.titled);
		$("#firstnameinput").prop("value", object.firstdName);
		$("#lastnameinput").prop("value", object.lastdName);
		$("#contactnoinput").prop("value", object.contactd);
		$("#dobinput").prop("value", object.dobd);
		$("#dojinput").prop("value", object.dateOfJoiningd);
		$("#dolinput").prop("value", object.dateOfLeavingd);
		authorization = object.authorization;
		reportAuthorization = object.reportAuthorization;
		console.log("reportAuthorization", reportAuthorization);
		setTimeout(function() {
			var masters = authorization.split('-');
			for (var j = 0; j < masters.length; j++) {
				var idlist = masters[j].split(",");
				if (idlist[1] == "1") {
					var id = "#write" + idlist[0];
					$(id).prop("checked", true);

					var id2 = "#read" + idlist[0];
					$(id2).prop("checked", true);
				} else {
					var id = "#read" + idlist[0];
					$(id).prop("checked", true);
				}
			}
		}, 1000)



		setTimeout(function() {
			var reports = reportAuthorization.split('-');
			for (var j = 0; j < reports.length; j++) {

				var id2 = "#read" + reports[j];
				$(id2).prop("checked", true);

			}
		}, 1000)

		$("#employeeidinput").prop("disabled", true);

	} else if (masterheading == "WHO MASTER") {

		setTextById("addEditDeleteBackdropLabel", "Updating Who detail:");
		whoDetailMasterInputs("addEditDeleteModalBody");
		whoId = object.whoId;
		//dateTimeCreation = object.dateTimeCreationd;
		$("#whoinput").prop("value", object.whoInput);

	} else if (masterheading == "HOW MASTER") {

		setTextById("addEditDeleteBackdropLabel", "Updating How detail:");
		howDetailMasterInputs("addEditDeleteModalBody");
		howId = object.howId;
		//dateTimeCreation = object.dateTimeCreationd;
		$("#howInput").prop("value", object.howInput);


	} else if (masterheading == "WHEN MASTER") {

		setTextById("addEditDeleteBackdropLabel", "Updating When detail:");
		whenDetailMasterInputs("addEditDeleteModalBody");
		whenId = object.whenId;
		//dateTimeCreation = object.dateTimeCreationd;
		$("#wheninput").prop("value", object.whenInput);

	} else if (masterheading == "ROLE MASTER") {

		setTextById("addEditDeleteBackdropLabel", "Updating Role:");
		roleMasterInputs("addEditDeleteModalBody");
		rowId = object.roleId;
		dateTimeCreation = object.dateTimeCreationd;
		$("#rolenameinput").prop("value", object.roleName);

	} else if (masterheading == "DEPARTMENT MASTER") {

		setTextById("addEditDeleteBackdropLabel", "Updating Department:");
		departmentMasterInputs("addEditDeleteModalBody");
		rowId = object.departmentId;
		dateTimeCreation = object.dateTimeCreationd;
		$("#departmentnameinput").prop("value", object.departmentName);

	} else if (masterheading == "INSTRUMENT MASTER") {

		setTextById("addEditDeleteBackdropLabel", "Updating Instrument:");
		InstrumentMasterInputs("addEditDeleteModalBody");

		// console.log("instrument object: ", object);
		instrumentId = object.instrumentId; // If you store ID globally
		//dateTimeCreation = object.dateTime;
		$("#instrumentNameInput").prop("value", object.instrumentNamed);
		$("#instrumentControlNoInput").prop("value", object.instrumentControlNo);
		$("#calibrationFrequencyInput").prop("value", object.calibrationFrequency);

		// calibrationDate comes like "2025-07-31 17:14:00"
		let calibrationDate = object.calibrationDate;

		// If it has time, cut everything after the space
		if (calibrationDate && calibrationDate.includes(" ")) {
			calibrationDate = calibrationDate.split(" ")[0];  // → "2025-07-31"
		}

		$("#calibrationDateInput").prop("value", calibrationDate);

		$("#inspectionMethodInput").prop("value", object.inspectionMethod);
		resetselection();

	} else if (masterheading == "MATERIAL MASTER") {

		setTextById("addEditDeleteBackdropLabel", "Updating Material:");
		materialMasterInputs("addEditDeleteModalBody");

		materialId = object.materialId; // If you store ID globally
		//dateTimeCreation = object.dateTime;
		$("#plantcodeinput").prop("value", object.plantCode);
		$("#materialInput").prop("value", object.material);
		$("#materialDescriptionInput").prop("value", object.materialDescription);
		$("#uomInput").prop("value", object.uom);
		$("#materialGroupInput").prop("value", object.materialGroup);
		resetselection();

	} else if (masterheading == "CUSTOMER MODEL MAPPING MASTER") {

		setTextById("addEditDeleteBackdropLabel", "Updating Cust. Model:");
		CustomerModelMappingMasterInputs("addEditDeleteModalBody");

		customerModelId = object.customerModelId; // If you store ID globally
		//dateTimeCreation = object.dateTime;
		$("#customerNameInput").prop("value", object.customerNamed);
		$("#modelInput").prop("value", object.model);
		resetselection();

	} else if (masterheading == "SAMPLING PLAN MASTER") {

		setTextById("addEditDeleteBackdropLabel", "Updating Sampling Plan Model:");
		SamplingPlanMasterInputs("addEditDeleteModalBody");

		samplingPlanId = object.samplingPlanId; // If you store ID globally
		//dateTimeCreation = object.dateTime;
		$("#lotSizeInput").prop("value", object.lotSize);
		$("#inspectionLetterInput").prop("value", object.inspectionLetter);
		$("#sampleSizeInput").prop("value", object.sampleSize);
		$("#accInput").prop("value", object.acc);
		$("#rejInput").prop("value", object.rej);
		$("#remarksInput").prop("value", object.remarks);
		resetselection();

	} else if (masterheading == "RQC CREATION MASTER") {
		// setTextById("addEditDeleteBackdropLabel", "Updating RQC-P No. : " + object.mispNumber);

		qualityId = object.qualityId; // If you store ID globally

		console.log(object.status);
		if (object.status == "2" || object.status == "0" || object.status == "1" || object.status == "4") {

			console.log(object);

			if (object.status == "1") { // approved one
				//$("#sendForApproval").hide();
				document.getElementById("sendForApproval").style.display = "none";

			} else {
				$("#sendForApproval").css("display", "block");
			}
			$("#addEditDeleteModalBody").empty();
			$("#addEditDeleteBackdropLabel").text("Updating RQC-P No. : " + object.mispNumber);

			$("#responseContainer").attr("style", "display:none;");
			$("#addEditDeleteBackdropButton").click();
			$("#submit").text("Edit");
			$("#addEditDeleteBackdropModal :first-child").removeClass("modal-l");
			$("#addEditDeleteBackdropModal :first-child").addClass("modal-xl");

			createQualityMasterInputs();
			getAllInstrumentInQualityList();
			$("#input1").prop("value", object.partNumber);
			$("#input1").prop("disabled", "disabled");


			// it is made as callback no need to provide setTimeout()
			// Load all customers into the dropdown, preselect the saved customer,
			// then automatically load the corresponding models and preselect the saved model.
			loadCustomerDropdown(object.customer.trim(), object.model.trim());


			loadParameterDataByMISP(object.mispNumber, object.revNumber);
			getDescriptionAndUom();



		} else { // object.status == "3" for approval pending
			alert("You cannot edit selected RQC-P No while it will not reconsider or reconcern by Quality head.");
			setTimeout(function() {
				$('#addEditDeleteCloseButton').trigger('click');
			}, 1000);
		}

		resetselection();

	} else if (masterheading == "DOCUMENT CATEGORY MASTER") {

		// 1️⃣ Set Modal Title
		setTextById("addEditDeleteBackdropLabel", "Updating Document Category Details :");


		// Revert back to modal-l
		$("#addEditDeleteBackdropModal :first-child").removeClass("modal-xl");
		$("#addEditDeleteBackdropModal :first-child").removeClass("modal-l");
		$("#addEditDeleteBackdropModal :first-child").addClass("modal-lg");


		// 2️⃣ Load Inputs (clears modal and rebuilds form)
		documentCategoryMasterInputs("addEditDeleteModalBody");

		// 3️⃣ Store ID globally if you’re using it
		categoryId = object.categoryId;
		createdBy = object.createdBy;
		createdAt = object.createdAt;

		// 4️⃣ Fill field values
		$("#categoryNameInput").prop("value", object.categoryName);
		$("#targetDaysInput").prop("value", object.targetDays);

		// 5️⃣ Show modal
		$("#addEditDeleteBackdropButton").click();

		// 6️⃣ Fetch approval mapping details and render dynamically
		getDocumentCategoryApprovalMapping(categoryId);

		resetselection();
	} else if (masterheading === "DOCUMENT REGISTER MASTER") {
		// 1️⃣ Set Modal Title
		setTextById("addEditDeleteBackdropLabel", `Update Document Register Details : ${object.documentCode}`);

		console.log(object);
		//  Build Inputs inside modal
		documentRegisterMasterInputs("addEditDeleteModalBody");

		//  Store IDs globally for using in edit saving function
		documentId = object.documentId;
		documentCode = object.documentCode;
		existingDocPath = object.fileExcelPath;

		// 5️⃣ Fill the fields
		$("#customerNameInput").val(object.customerName ?? "");
		$("#modelNameInput").val(object.modelName ?? "");
		$("#drawingNumberInput").val(object.drawingNumber ?? "");

		getAllDocumentCategoriesList("categorySelect"); // has async false

		// Synchronous — safe to set value immediately
		$("#categorySelect").val(object.categoryId ?? "").trigger("change");

		$.ajax({
			url: `/WebApplication/Controllers/getDocumentRegisterById/${documentId}`,
			type: 'GET',
			async: true,
			headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
			success: function(fullObject) {
				//  openDocumentRegisterEditModal(fullObject);
				console.log("fullObject", fullObject);

				$("#plantcodeinput").prop("value", fullObject.plantId);

				// 6️⃣ Load plants & target days AFTER category is set
				if (fullObject.categoryId) {
					// Listen for plantsLoaded event
					$("#plantCheckboxContainer").one("plantsLoaded", function() {
						// ✅ Check selected plants
						if (fullObject.plants && fullObject.plants.length > 0) {
							fullObject.plants.forEach(p => {
								$(`#plant_${p.plantId}`).prop("checked", true);
							});
						}

						// ✅ Set target day and remarks AFTER plants loaded
						$("#targetDayInput").val(fullObject.targetDays ?? "");
						$("#remarksInput").val(fullObject.remarks ?? "");
					});

				}

			},
			error: function() {
				alert("Error fetching document details.");
			}
		});


		// 6️⃣ Show revision remarks box if revisionNo exists
		if (object.revisionNo != null && object.revisionNo !== "") {
			if ($("#revisionRemarksContainer").length === 0) {
				const revContainer = $('<div class="dataContainer smallContainer mt-1" id="revisionRemarksContainer"></div>');
				$("#addEditDeleteModalBody").append(revContainer);
				const revAttr = [
					"id", "revisionRemarksInput",
					"name", "revisionRemarks",
					"class", "inputs textareaInput",
					"placeholder", "Enter revision remarks..."
				];
				createTextarea(revAttr, revContainer[0], "Revision Remarks");
			}
			$("#revisionRemarksInput").val(object.revisionRemarks ?? "");
		}


		if (object.status == "Draft") {
			$("#sendForApproval")
				.css("display", "block")
				.text("Start Approval Process"); // Set button text	
			$("#sendForApproval").prop("disabled", false);
			$("#submit").prop("disabled", false);

		} else if (object.status === "Rejected") {

			$("#submit").prop("disabled", false);
			$("#sendForApproval")
				.css("display", "block")
				.text("Re-Start Approval Process")
				.prop("disabled", false);

		} else if (object.status === "Approved") {

			$("#submit").prop("disabled", true);
			$("#sendForApproval").hide();
		} else if (object.status === "Final Released") { // text in frontend

			$("#submit").prop("disabled", false); // allow edit ( and on edit it will create anew row with draft whi will be editable and sendforapproval enabled.)
			$("#sendForApproval").hide(); // because still not draft
		} else {
			//$("#sendForApproval").hide();
			document.getElementById("sendForApproval").style.display = "none";
			document.getElementById("submit").disabled = true;
		}

		// 7️⃣ Show modal
		$("#addEditDeleteBackdropButton").click();
	} else if (masterheading == "SIGN MASTER") {
		setTextById("addEditDeleteBackdropLabel", "Updating SIGN:");
		ExcelSignMasterInputs("addEditDeleteModalBody");
		console.log("object edit", object);

		excelSignId = object.excelSignId;
		const plantCode = object.plantCode;
		const departmentId = object.departmentId;
		const loginId = object.loginId;

		// STEP 1️⃣ — Load plant list
		getAllPlantsInList("plantcodeinput");

		// STEP 2️⃣ — When plant list is ready, set selected plant and fetch departments
		$("#plantcodeinput").val(plantCode).trigger("change");

		// ✅ Call department loader right after setting plant
		getDepartmentsByPlant("departmentinput", plantCode);
		setTimeout(() => {
			$("#departmentinput").val(departmentId).trigger("change");
		}, 500);
		/*		// STEP 3️⃣ — When departments are loaded, select department & fetch users
				$("#departmentinput").off("departmentsLoaded").on("departmentsLoaded", function () {
					console.log("Departments loaded for plant:", plantCode);
					$("#departmentinput").val(departmentId).trigger("change");
	
					// Fetch users now
					getUsersByPlantAndDepartment("nameInput", plantCode, departmentId);
				});*/

		// STEP 4️⃣ — When users are loaded, select the user
		$("#nameInput").off("usersLoaded").on("usersLoaded", function() {
			console.log("Users loaded for dept:", departmentId);
			$("#nameInput").val(loginId);
		});

		// STEP 5️⃣ — Load signature if exists
		if (object.signature) {
			const imgUrl = '/WebApplication/Controllers/sign/' + object.signature +
				'?token=' + sessionStorage.getItem('token');
			$("#signPreview").attr("src", imgUrl).show();

			let cropper;
			const image = document.getElementById("signPreview");
			cropper = new Cropper(image, {
				aspectRatio: 3 / 1,
				viewMode: 1,
				autoCropArea: 1
			});
			$("#cropBtn").show();
			window.currentCropper = cropper;
		}

		resetselection();

	} else if (masterheading == "PH INSPECTION  MASTER") {
		setTextById("addEditDeleteBackdropLabel", "Updating Ph Inspection Required:");
		phInspectionReqMasterInputs("addEditDeleteModalBody");
		phInspectionReqId = object.phInspectionReqId;
		getAllLinesInList("lineinput", object.lineId)
			.then(() => getStationsByLine(object.lineId, "stationinput", object.stationId))
			.then(() => getSheetsByLineAndStation(object.lineId, object.stationId, "sheetinput", object.sheetId))
			.then(() => {
				// Ensure user can freely change any field
				$("#stationinput").prop("disabled", false);
				$("#sheetinput").prop("disabled", false);
			})
			.catch(err => console.error("Prefill error:", err));
		$("#paramNoinput").prop("value", object.paramNo);
		$("#sopDateReqinput").prop("value", object.sopDateRequired);
		$("#sopValTypeinput").prop("value", object.sopValType);
		$("#inspectionReqinput").prop("value", object.inspectionReq);
		$("#partOrProcessinput").prop("value", object.partOrProcess);

	} else if (masterheading == "SUPPLIER MASTER") {
		console.log("objedt aa", object);
		setTextById("addEditDeleteBackdropLabel", "Updating Supplier Name:");
		SupplierMasterInputs("addEditDeleteModalBody");

		supplierId = object.supplierId; // If you store ID globally
		//createdTime = object.createdTime;
		$("#supplierNameInput").prop("value", object.supplierName);
		resetselection();

	} else if (masterheading == "IONIZER FIELD MASTER") {

		setTextById("addEditDeleteBackdropLabel", "Updating Ionzizer Field Details:");
		machineCheckSheetFieldInputs("addEditDeleteModalBody");

		// Inject hidden input inside the form after rendering the modal body
		$("#addEditDeleteModalBody").append('<input type="hidden" id="existingParameterFilename" name="parameter">');
		// $("#parameterfileinput").val(fileName); // can't set this programmatically the input path. can only chose from browser.

		// console.log(object);
		IonizerfieldId = object.IonizerfieldId;
		dateTimeCreation = object.dateTimeCreationd;

		createdBy = object.createdBy;
		createdAt = object.createdAt;

		// Set Param Type (Text/Image)
		$("#ptypeinput").val(object.ptype).trigger("change"); // trigger change so wrapper visibility adjusts

		if (object.ptype == 0) {
			// Text
			$("#parameternameinput").val(object.parameter);
		} else if (object.ptype == 1) {
			// Image
			// Extract the actual image URL from hidden span inside the selected row in parameter field
			const fullPath = object._rowRef.find('td[data-column="parameter"] .hiddenUrl').text().trim();

			// Extract just the filename from the full path
			// Handles both Windows (`\`) and Unix-style (`/`) slashes
			const fileName = fullPath.split(/[/\\]/).pop(); // Handles Windows-style paths like D:\...\file.png


			// $("#parameterfileinput").val(fileName); // can't set this programmatically the input path. can only chose from browser.
			$("#existingParameterFilename").val(fileName);

			// Construct URL
			// 	 getting from MachineCheckSheetFieldAjaxController
			const url = `/WebApplication/Controllers/IonizerFieldImage/${fileName}`;

			// console.log(url);
			const imgPreview = `<img src="${url}" style="max-width: 100%; max-height: 180px;" />`;
			$('#imagePreviewBox').html(imgPreview).show();

		}

		const howId = object._rowRef.find('td[data-column="how"]').data('how-id');
		const whoId = object._rowRef.find('td[data-column="who"]').data('who-id');
		const whenId = object._rowRef.find('td[data-column="whenColumn"]').data('whencolumn-id')

		$("#referenceinput").val(object.reference);

		// Set dropdowns
		setTimeout(() => {
			// Set dropdowns using the IDs
			$("#howDropdown").val(howId).trigger("change");
			$("#whoDropdown").val(whoId).trigger("change");
			$("#whenDropdown").val(whenId).trigger("change");
		}, 500); // waits for 0.5s

		// --- Date Required ---
		$("#dateRequired").val(object.dateRequired ?? "Select").trigger("change");
		console.log(object.dateRequired);
		// --- DateText ---
		if (object.dateRequired === "Yes") {
			$("#dateTextinput").val(object.dateText ?? "");
		}

		$("#vtypeDropdown").val(object.vtype).trigger("change");

		// Delay setting Pass If / Value 1 / Value 2, because they depend on VType
		setTimeout(() => {
			$("#passifDropdown").val(object.passif).trigger("change");

			setTimeout(() => {
				$("#value1Input").val(object.value1);
				$("#value2Input").val(object.value2);
			}, 100); // wait for Value 2 field to appear
		}, 100);


	} else if (masterheading == "IONIZER LINK MASTER") {
		setTextById("addEditDeleteBackdropLabel", "Updating Ionizer Link Details:");

		// Create the input layout again
		ionizerLinkInputs("addEditDeleteModalBody");

		console.log(object);
		// Save rowId and creation timestamp if needed
		IonizerLinkId = object.IonizerLinkId;
		dateTimeCreation = object.dateTimeCreation;

		// Get values from DOM if available
		const lineId = object._rowRef.find('td[data-column="line"]').data('line-id');
		const stationId = object._rowRef.find('td[data-column="station"]').data('station-id');
		const ionizerFieldId = object._rowRef.find('td[data-column="ionizerfield"]').data('field-id');
		const orderNo = object._rowRef.find('td[data-column="orderNo"]').text().trim();


		// Set Line after some delay
		setTimeout(() => {
			// Set dropdowns/inputs
			$("#lineDropdown").val(lineId).trigger("change");

			// Wait for stations to be populated
			getStationsByLineId("stationDropdown", lineId);

			// Then Trigger change so Station list loads based on selected line
			setTimeout(() => {
				// After station list is loaded, set the station
				$("#stationDropdown").val(stationId);
			}, 300); // Adjust if needed

		}, 300);

		// Set MCS Field after MCS field dropdown is ready
		setTimeout(() => {
			//$("#mcsfieldDropdown").val(mcsFieldId);
			$('#ionizerfieldDropdown').val(ionizerFieldId).trigger('change');

		}, 500);

		// Set Order immediately
		$("#orderinput").val(orderNo);


	}


});


function checkSelectedRow() {

	var selectedRow = $('.selected');

	var text = document.getElementById("masterHeading").innerHTML;

	if (selectedRow.length === 0) {

		if (text == "RQC CREATION MASTER") { // for summerise in rqc creation
			$("#warningInformationModalBody").text("Please select a row from the table to view its content.");
			$("#warningBackdropButton").click();
			resetselection();
			return false;
		}

		// otherwise for edit 
		$("#warningInformationModalBody").text("Please select a row from the table to update its content.");
		$("#warningBackdropButton").click();
		resetselection();
		return false;
	} else if (selectedRow.length > 1) {
		$("#warningInformationModalBody").text("Please select a single row, Can't edit multiple rows at a time.");
		$("#warningBackdropButton").click();
		resetselection();
		return false;
	}

}

window.showEditModal = showEditModal;
function showEditModal() {

	showModal("addEditDeleteBackdropButton");
	$("#addEditDeleteModalBody").empty();
	setTextById("responseContainer", "");
	setTextById("submit", "Edit");

}



$(document).on('click', '#delete', function() {

	const text = $("#masterHeading").text();

	// Adjust button text based on the number of selected rows
	$("#delete").text(deleteAllList.length > 1 ? "Delete All" : "Delete");

	// Map masterHeading to corresponding delete functions
	const deleteFunctionsMap = {
		"PLANT MASTER": () => deletePlant(),
		"DOCUMENT CATEGORY MASTER": () => deleteDocumentCategory(),
		"LINE MASTER": () => deleteLine(),
		"SHEET DETAIL MASTER": () => deleteSheetDetail(),
		"MACHINE CHECK SHEET FIELD MASTER": () => deleteMachineCheckSheetField(),
		"MACHINE CHECK SHEET LINK MASTER": () => deleteMachineCheckSheetLink(),
		"WHO MASTER": () => deleteWhoDetail(),
		"HOW MASTER": () => deleteHowDetail(),
		"WHEN MASTER": () => deleteWhenDetail(),
		"ROLE MASTER": () => deleteRole(),
		"DEPARTMENT MASTER": () => deleteDepartment(),
		"INSTRUMENT MASTER": () => deleteInstrument(),
		"MATERIAL MASTER": () => deleteMaterial(),
		"CUSTOMER MODEL MAPPING MASTER": () => deleteCustomerModelMapping(),
		"SAMPLING PLAN MASTER": () => deleteSamplingPlan(),
		"RQC CREATION MASTER": () => deleteQuality(),
		"LOGIN MASTER": () => deleteLogin(),
		"SUPPLIER MASTER": () => deleteSupplier(),
		"SIGN MASTER": () => deleteExcelSign(),
		"PH INSPECTION  MASTER": () => deletePhInspectionReqMaster(),
		"IONIZER FIELD MASTER": () => deleteIonizerField(),
		"IONIZER LINK MASTER": () => deleteIonizerLink()
		/* "PRODUCT MASTER": () => deletePro(),*/
	};

	// Call the corresponding delete function if it exists
	if (deleteFunctionsMap[text]) {
		deleteFunctionsMap[text]();
	} else {
		console.error("No delete function found for master heading:", text);
	}
});


$(document).on('click', '.delete', function() {
	if (deleteAllList.length === 0) {
		$("#warningInformationModalBody").text("Please select a row from the table to delete its content.");
		$("#warningBackdropButton").click();
		return;
	} else {

		$("#informationModalBody").text("Do you really want to delete selected row.");
		showModal("informationBackdropButton");

		$('#informationCancel').off('click').on('click', function() {
			resetValues();
		});
	}

});

$(document).on('click', '.template', function() {
	const text = document.getElementById("masterHeading").innerHTML;

	// Map text values to endpoint URLs and filenames
	const masterTemplates = {
		"PLANT MASTER": { endpoint: "plantmaster", filename: "plant master template" },
		"LOGIN MASTER": { endpoint: "loginmaster", filename: "login master template" },
		"MATERIAL MASTER": { endpoint: "MaterialMasterTemplate", filename: "material master template" },
		"LINE MASTER": { endpoint: "linemaster", filename: "line master template" },
		"SHEET DETAIL MASTER": { endpoint: "sheetDetailmaster", filename: "sheetDetail master template" },
		"RQC CREATION MASTER": { endpoint: "qualitymaster", filename: "rqc creation master template" },
		// /WebApplication/Controllers/download/template/qualitymaster
		/*		"PRODUCT MASTER": { endpoint: "productmaster", filename: "product master template" },
				"LINE PRODUCT MAPPING MASTER": { endpoint: "lineproductmappingmaster", filename: "line product mapping master template" },
				"ROLE MASTER": { endpoint: "rolemaster", filename: "role master template" },
				"DEPARTMENT MASTER": { endpoint: "departmentmaster", filename: "department master template" },
				"OPERATION MASTER": { endpoint: "operationmaster", filename: "operation master template" },
				"PREVENTIVE MAINTENANCE MASTER": { endpoint: "preventivemaintenancemaster", filename: "preventive maintenance master template" },
				*/
	};

	// Retrieve endpoint and filename based on text
	const template = masterTemplates[text];
	if (!template) {
		console.error("No matching template found for:", text);
		return;
	}

	// Common fetch logic
	fetch(`/WebApplication/Controllers/download/template/${template.endpoint}`, {
		method: 'GET',
		headers: {
			'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
		},
	})
		.then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			return response.blob();
		})
		.then(blob => {
			const link = document.createElement('a');
			link.href = URL.createObjectURL(blob);
			link.download = `${template.filename}.xlsx`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		})
		.catch(error => {
			console.error('Error:', error);
		});
});


/*   *****************       download  ****************  */
let interval;
function forRQCdatadownload() {  // separate because here it is POST mapping for searched data.
	$("#uploadBackdropLabel").text("Converting Excel :");
	document.querySelector("#uploadImage").setAttribute("src", "/WebApplication/images/processing.gif");
	$("#upload").attr("style", "display:none");
	$("#uploadExcel").attr("style", "display:none"); $("#uploadCloseButton").attr("style", "background: transparent; height: 30px; width: 30px; border: 0px; display:none;");
	$("#uploadWaiting").removeAttr("style");
	$("#uploadWaiting").text("Please wait......");
	$("#myProgress").removeAttr("style");

	$("#uploadBackdropButton").click();
	var mispNumber = $('input[title="searchmispNo"]').val() ?? "";
	var revNumber = $('input[title="searchrevNo"]').val() ?? "";
	var partNumber = $('input[title="searchPartNumber"]').val() ?? "";

	var formData = {
		mispNumber: mispNumber,
		revNumber: revNumber,
		partNumber: partNumber
	}
	console.log("formdta:: ", formData);
	fetch('/WebApplication/Controllers/download/data/mispcreation', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
		},
		body: JSON.stringify(formData),
	})
		.then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			return response.blob();
		})
		.then(blob => {

			$("#uploadBackdropButton").click();
			var elem = document.getElementById("myBar");
			elem.style.width = "1%";
			$("#myProgress").attr("style", "display:none;");
			clearInterval(totalRowInterval);
			clearInterval(interval);

			const link = document.createElement('a');
			link.href = URL.createObjectURL(blob);
			let currDateTime = new Date();
			link.download = 'RQC CREATION MASTER' + '.xlsx';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		})
		.catch(error => {
			console.error('Error:', error);
		});

	// totalRowInterval = setInterval(getDowloadTotalRows, 1000);

}

window.getDowloadTotalRows = getDowloadTotalRows;
function getDowloadTotalRows() {

	$.ajax({
		url: "/WebApplication/Controllers/getDownloadTotalRows",
		type: 'GET',
		async: false,
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		dataType: 'json',
		success: function(res) {

			if (res > 0) {
				totalRows = res;
				interval = setInterval(getInsertedRows, 100);
				clearInterval(totalRowInterval);
			}
		}
	});
}

//used in uploads
window.getTotalRows = getTotalRows;
function getTotalRows() {

	$.ajax({
		url: "/WebApplication/getTotalRows",
		type: 'GET',
		async: false,
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		dataType: 'json',
		success: function(res) {
			if (res > 0) {
				totalRows = res;
				interval = setInterval(getCurrentRow, 100);
				clearInterval(totalRowInterval);
			}
		}
	});
}


/* ************   download for document master  ************************/
function downloadDocumentFile() {
	const row = object; // get selected doc row
	if (!row) return alert("Select a document");

	// const revisionNo = prompt("Enter Revision No (leave empty for latest):") || "";
	console.log(object, object.documentId, object.revisionNo);
	const revision = Number(row.revisionNo); // from the table row selected 

	console.log(revision);
	const role = sessionStorage.getItem("role")?.toLowerCase();
	const department = sessionStorage.getItem("userDepartment")?.toLowerCase();
	const currentPersonId = sessionStorage.getItem("employeeId");

	const url = `/WebApplication/Controllers/download/${row.documentId}?revisionNo=${revision}&userId=${currentPersonId}&role=${role}&dept=${department}`;

	fetch(url, {
		method: "GET",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
	})
		.then(async response => {

			if (!response.ok) {
				// Read backend error text
				const errorText = await response.text();
				throw new Error(errorText || "Unknown error occurred");
			}

			return response.blob();
		})
		.then(blob => {

			const contentType = blob.type;
			const ext = contentType.includes("pdf") ? ".pdf" : ".xlsx";

			const a = document.createElement("a");
			a.href = URL.createObjectURL(blob);
			// a.download = `Doc_${row.documentCode}_Rev_${revision || 'Latest'}.xlsx`;
			a.download = `DOC_${object.documentCode}_REV_${revision}${ext}`;
			document.body.appendChild(a);
			a.click();
			a.remove();
		})
		.catch(err => {
			console.error("Download Error:", err);
			alert("Download failed: " + err.message);
		});
}

////************** for all other masters ************************* */
$(document).on('click', '.data', function() {
	var text = document.getElementById("masterHeading").innerHTML;
	if (text == "EXCEL REPORT MASTER") {

		previewExcelPdf(object);

	}

	if (text == "RQC CREATION MASTER") {
		forRQCdatadownload(); // separate because here it is post mapping for searched data.
		return;
	}

	if (text === "DOCUMENT REGISTER MASTER") {
		downloadDocumentFile();
	}

	var downloadDetails = {
		"PLANT MASTER": { url: '/WebApplication/Controllers/download/data/plantmaster', fileName: 'plant master data' },
		"INSTRUMENT MASTER": { url: '/WebApplication/Controllers/download/data/InstrumentMaster', fileName: 'instrument master data' },
		"LINE MASTER": { url: '/WebApplication/Controllers/download/data/linemaster', fileName: 'line master data' },
		"CUSTOMER MODEL MAPPING MASTER": { url: '/WebApplication/Controllers/download/data/customerModelmaster', fileName: 'customer model master data' },
		"SHEET DETAIL MASTER": { url: '/WebApplication/Controllers/download/data/sheetDetailmaster', fileName: 'sheet Detail master data' },
		"MATERIAL MASTER": { url: '/WebApplication/Controllers/download/data/MaterialMasterdata', fileName: 'material master data' },
		"PRODUCT MASTER": { url: '/WebApplication/Controllers/download/data/productmaster', fileName: 'product master data' },
		"LINE PRODUCT MAPPING MASTER": { url: '/WebApplication/Controllers/download/data/lineproductmappingmaster', fileName: 'line product mapping master data' },
		"ROLE MASTER": { url: '/WebApplication/Controllers/download/data/rolemaster', fileName: 'role master data' },
		"DEPARTMENT MASTER": { url: '/WebApplication/Controllers/download/data/departmentmaster', fileName: 'department master data' },
		"PLANT MASTER": { url: '/WebApplication/Controllers/download/data/plantmaster', fileName: 'plant master data' },
		"SAMPLING PLAN MASTER": { url: '/WebApplication/Controllers/download/data/samplingPlanmaster', fileName: 'sampling plan master data' },

	};

	if (downloadDetails[text]) {
		initiateDownload(downloadDetails[text]);
	}

	function initiateDownload(details) {
		$("#uploadBackdropLabel").text("Converting Excel :");
		document.querySelector("#uploadImage").setAttribute("src", "/WebApplication/images/processing.gif");
		$("#upload").attr("style", "display:none");
		$("#uploadExcel").attr("style", "display:none");
		$("#uploadCloseButton").attr("style", "background: transparent; height: 30px; width: 30px; border: 0px; display:none;");
		$("#uploadWaiting").removeAttr("style");
		$("#uploadWaiting").text("Please wait......");
		$("#myProgress").removeAttr("style");

		$("#uploadBackdropButton").click();

		fetch(details.url, {
			method: details.method || 'GET',
			headers: {
				'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
				'Content-Type': details.method === 'GET' ? 'application/json' : ''
			},
			body: details.method === 'GET' ? JSON.stringify(details.body) : undefined
		})
			.then(response => {
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}
				return response.blob();
			})
			.then(blob => {
				var elem = document.getElementById("myBar");
				elem.style.width = "1%";
				$("#myProgress").attr("style", "display:none;");
				//          clearInterval(totalRowInterval);
				//          clearInterval(interval);

				const link = document.createElement('a');
				link.href = URL.createObjectURL(blob);
				link.download = details.fileName + '.xlsx';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);

				setTimeout(function() {
					$("#uploadBackdropButton").click();
				}, 1000);

			})
			.catch(error => {
				console.error('Error:', error);
				$("#uploadBackdropButton").click();
			});

		//      totalRowInterval = setInterval(getDowloadTotalRows, 1000);
	}
});


// making upload function
window.showUploadModal = showUploadModal
function showUploadModal() {

	var text = document.getElementById("masterHeading").innerHTML;

	$("#uploadBackdropLabel").text("Upload Excel :");
	document.querySelector("#uploadImage").setAttribute("src", "/WebApplication/images/uploadexcel.png");
	$("#upload").removeAttr("style");
	$("#uploadExcel").removeAttr("style");
	$("#uploadCloseButton").attr("style", "background: transparent; height: 30px; width: 30px; border: 2px;");
	$("#uploadWaiting").attr("style", "display:none");
	$("#uploadExcel").val(null);
	$("#myProgress").hide();
	$("#uploadBackdropButton").click();

}


$(document).on('click', '.upload', function() {

	showUploadModal();

});

let uploadFinished = false; // global

function animateProgressBar() {
	let width = 1;
	const bar = document.getElementById("myBar");
	bar.style.width = width + "%";
	bar.style.backgroundColor = "#007bff";
	bar.innerHTML = "";

	const interval = setInterval(() => {
		if (uploadFinished || width >= 90) {
			clearInterval(interval);
		} else {
			width += 1;
			bar.style.width = width + "%";
		}
	}, 30);
}


// Change background color of text to green when a file is selected for upload
$(document).on('change', '#uploadExcel', function() {
	if ($(this).val()) {
		$(this).css('color', 'green');
	} else { // reset if no file is there
		$(this).css('color', 'black');
	}
});

$(document).on('click', '#upload', function() {
	const text = $("#masterHeading").text();
	const employeeId = sessionStorage.getItem('employeeId');
	uploadFinished = false; // reset flag here ✅
	// Map masterHeading to corresponding delete functions
	const uploadMap = {
		/*"STATION AND SETTING MASTER": () => uploadStationResources(),*/
		"SHEET DETAIL MASTER": () => uploadSheetDetailMaster(),
		"MATERIAL MASTER": () => uploadMaterialDetails(),
		"RQC CREATION MASTER": () => uploadQualityDetails(),
		"RQC APPROVAL": () => uploadMaterialDetails(),
	};

	// Call the corresponding delete function if it exists
	if (uploadMap[text]) {
		uploadMap[text]();
	} else {
		console.error("No upload function found for master heading:", text);
	}
});


function handleResponse(response, errorFileName, reloadFunction) {
	const contentType = response.headers.get('Content-Type');
	uploadFinished = true;


	if (contentType?.includes('application/json')) {
		return response.json().then(data => {
			if (data.error) throw new Error(data.error);
			setTimeout(() => {
				updateUIOnSuccess(reloadFunction);
			}, 200);
		});
	} else if (contentType?.includes('application/vnd.ms-excel')) {
		return response.blob().then(blob => {
			downloadErrorFile(blob, errorFileName);
			setTimeout(() => {
				updateUIOnPartialSuccess(reloadFunction);
			}, 200);
		});
	} else {
		throw new Error('Unexpected response type');
	}
}


//  means process is completed without any error, so reload page and 
function updateUIOnSuccess(reloadFunction) {
	const bar = document.getElementById("myBar");
	bar.style.width = "95%";
	bar.style.backgroundColor = "green";

	// Show success image and message
	document.querySelector("#uploadImage").setAttribute("src", "/WebApplication/images/success.png");
	document.querySelector("#uploadCloseButton").style.display = "flex";
	document.querySelector("#uploadWaiting").textContent = "Upload Successful! (No duplicates found in file)";
	document.querySelector("#uploadWaiting").style.color = "green";

	const selectedPage = document.querySelector('#pager')?.value || 0;
	reloadFunction?.(selectedPage);
	bar.style.width = "100%";

	document.querySelector("#uploadCloseButton").style.display = "flex";

}

function updateUIOnPartialSuccess(reloadFunction) {// called when error file is generated so means process is completed

	const bar = document.getElementById("myBar");
	bar.style.width = "95%";
	bar.style.backgroundColor = "orange";
	// patial upload message 
	document.querySelector("#uploadWaiting").textContent = "Data uploaded, but some duplicates were not uploaded.";
	document.querySelector("#uploadWaiting").style.color = "orange";

	const selectedPage = document.querySelector('#pager')?.value || 0;
	reloadFunction?.(selectedPage);
	bar.style.width = "100%";

	document.querySelector("#uploadCloseButton").style.display = "flex";
}

function downloadErrorFile(blob, fileName) {
	const link = document.createElement('a');
	const url = window.URL.createObjectURL(blob);
	link.href = url;
	link.download = fileName;
	document.body.appendChild(link);
	link.click();
	link.remove();
	window.URL.revokeObjectURL(url);
}

function handleError(error, reloadFunction) {
	const bar = document.getElementById("myBar");
	bar.style.backgroundColor = "red";
	document.querySelector("#uploadImage").setAttribute("src", "/WebApplication/images/error.png");
	document.querySelector("#uploadCloseButton").style.display = "flex";
	document.querySelector("#uploadWaiting").innerHTML = error.message.replace(/\n/g, '<br>') || "An unexpected error occurred";
	document.querySelector("#uploadWaiting").style.color = "red";
	const selectedPage = document.querySelector('#pager')?.value || 0;
	reloadFunction(selectedPage);
	document.querySelector("#myProgress").style.display = "none";
}

function uploadSheetDetailMaster() {
	const fileInput = document.querySelector("#uploadExcel");
	const file = fileInput.files[0];

	if (!file) {
		alert("Please select a file to upload.");
		return;
	}

	const formData = new FormData();
	formData.append("file", file);

	const employeeId = sessionStorage.getItem("employeeId");

	// Show uploading UI
	["#upload", "#uploadExcel", "#uploadCloseButton"].forEach(id => {
		document.querySelector(id).style.display = "none";
	});
	document.querySelector("#uploadWaiting").style.display = "block";
	document.querySelector("#uploadWaiting").textContent = "Please wait...";
	document.querySelector("#uploadWaiting").style.color = "black";
	document.querySelector("#uploadImage").setAttribute("src", "/WebApplication/images/processing.gif");
	document.querySelector("#myProgress").style.display = "block";
	animateProgressBar();
	//	$("#myProgress").show();

	fetch(`/WebApplication/Controllers/upload/sheetdetail/${employeeId}`, {
		method: "POST",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		body: formData
	})
		//.then(res => handleResponse(res, "sheet_detail_upload_errors.xlsx", loadDataAndPager))
		.then(response => {
			if (response.status === 400 && response.headers.get("Content-Type")?.includes("application/vnd.ms-excel")) {
				return handleResponse(response, "sheet_detail_upload_errors.xlsx", loadDataAndPager);
			} else if (response.ok) {
				return handleResponse(response, "sheet_detail_upload_errors.xlsx", loadDataAndPager);
			} else {
				throw new Error("Unexpected error occurred.");
			}
		})
		.catch(err => handleError(err, loadDataAndPager));
}
window.convertErrorListToCsV = convertErrorListToCsV;
function convertErrorListToCsV(response) {
	CSVFile = new Blob([response.body.unUploadList.join('\n')], { type: "text/csv" });
	//CSVFile = new Blob([response.body.unUploadList], { type: "text/csv" });

	let temp_link = document.createElement('a');
	temp_link.download = "error.csv";
	let url = window.URL.createObjectURL(CSVFile);
	temp_link.href = url;
	temp_link.style.display = "none";
	document.body.appendChild(temp_link);
	temp_link.click();
	document.body.removeChild(temp_link);
}

/*---------------------------------------------------   User Detail ----------------------------------------------*/
$(document).on('click', '.userDetails', function() {
	$("#userDetailsBackdropButton").click();
	$("#editUser").text("Edit");
	getUserName();

});


function getUserName() {
	var formData = {
		loginId: sessionStorage.getItem('employeeId')
	}
	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getUserNameByEmployeeId',
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			insertUserDetails(response);
			personalDetails = [];
			personalDetails.push(response);
		}
	});
}

function insertUserDetails(response) {

	$("#userDetailBody").remove();
	var tablebody = document.createElement("tbody");
	$("#userDetailTable").append(tablebody);
	tablebody.setAttribute("id", "userDetailBody");

	var row = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId">Employee Id</td>' + '<td data-column="plantCode">' + response.employeeId + '</td></tr>';
	var row1 = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId">First Name</td>' + '<td data-column="plantCode" >' + response.title + " " + response.firstName + '</td></tr>';
	var row2 = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId">Last Name</td>' + '<td data-column="plantCode">' + response.lastName + '</td></tr>';
	var row3 = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId">Email</td>' + '<td data-column="plantCode">' + response.email + '</td></tr>';
	var row4 = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId">Contact</td>' + '<td data-column="plantCode">' + response.contact + '</td></tr>';
	var row5 = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId">Date of Birth</td>' + '<td data-column="plantCode">' + response.dob + '</td></tr>';
	var row6 = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId">Contact</td>' + '<td data-column="plantCode">' + response.contact + '</td></tr>';
	var row7 = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId">Role</td>' + '<td data-column="plantCode">' + response.role.roleName + '</td></tr>';

	$('#userDetailTable').append(row, row1, row2, row3, row4, row5, row7);

}



$(document).on('click', '#editUser', function() {

	var text = document.getElementById("editUser").innerHTML;
	if (text == "Edit") {

		$("#userDetailBody").remove();
		var tablebody = document.createElement("tbody");
		$("#userDetailTable").append(tablebody);
		tablebody.setAttribute("id", "userDetailBody");

		var row = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId">Employee Id</td>' + '<td data-column="plantCode">' + personalDetails[0].employeeId + '</td></tr>';
		var row1 = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId">First Name</td>' + '<td data-column="plantCode" ><input type="text" class="inputs" name="personalFirstName" value="' + personalDetails[0].firstName + '" style="width:80%;"/></td></tr>';
		var row2 = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId">Last Name</td>' + '<td data-column="plantCode"><input type="text" class="inputs" name="personalLastName" value="' + personalDetails[0].lastName + '" style="width:80%";/> </tr>';
		var row3 = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId">Email</td>' + '<td data-column="plantCode"><input type="text" class="inputs" name="personalEmail" value="' + personalDetails[0].email + '" style="width:80%;"/> </tr>';
		var row4 = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId">Contact</td>' + '<td data-column="plantCode"><input type="number" class="inputs" name="personalContact" value="' + personalDetails[0].contact + '" style="width:80%;"/> </td></tr>';
		var row5 = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId">Date of Birth</td>' + '<td data-column="plantCode"><input type="date" class="inputs" name="personalDob" value="' + personalDetails[0].dob + '" style="width:80%;"/> </td></tr>';
		var row6 = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId">Password</td>' + '<td data-column="plantCode"><input type="text" class="inputs" name="personalPassword" style="width:80%;"/> </tr>';
		var row7 = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId">Role</td>' + '<td data-column="plantCode">' + personalDetails[0].role.roleName + '</td></tr>';
		var row8 = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId">Department</td>' + '<td data-column="plantCode">' + personalDetails[0].department.departmentName + '</td></tr>';
		$('#userDetailTable').append(row, row1, row2, row3, row4, row5, row6, row7, row8);

		$("#editUser").text("Save");

	} else {
		var firstName = $("input[name=personalFirstName]").val();
		var lastName = $("input[name=personalLastName]").val();
		var email = $("input[name=personalEmail]").val();
		var contact = $("input[name=personalContact]").val();
		var dob = $("input[name=personalDob]").val();
		var password = $("input[name=personalPassword]").val();


		if (!firstName || !lastName || !email || !contact || !password || !dob) {

			$("#userResponseContainer").text("* All Fields are mandatory to edit user detail.");
			$("#userResponseContainer").attr("style", "font-size:15px;color:red; width:80%; height:30px; text-align:center;");

		}
		else {

			var formData = {
				loginId: sessionStorage.getItem('employeeId'),
				firstName: firstName,
				lastName: lastName,
				email: email,
				contact: contact,
				dob: dob,
				password: password,
			}

			$.ajax({
				type: 'patch',
				url: '/WebApplication/Controllers/editPersonalLoginMaster',
				data: JSON.stringify(formData),
				contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
				success: function(response) {
					$("#userResponseContainer").text(response);
					$("#userResponseContainer").attr("style", "font-size:15px;color:green; width:60%;  height:30px; text-align:center;");
					getUserName();
					$("#editUser").text("Edit");
					setTimeout(function() {
						$("#userResponseContainer").text("");
					}, 3000);
				},
				error: function(response) {
					getUserName();
					$("#userResponseContainer").text(response.responseText);
					$("#userResponseContainer").click();
				}
			});
		}
	}
});


/*--------------------------------------------------- Select list in Modals ----------------------------------------------*/
window.getAllPlantsInList = getAllPlantsInList;
function getAllPlantsInList(id) {
	$.ajax({
		url: "/WebApplication/Controllers/getAllPlantsInList",
		type: 'GET',
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

window.getAllLinesInList = getAllLinesInList;
function getAllLinesInList(id) {
	$.ajax({
		url: "/WebApplication/Controllers/getAllLinesInList",
		type: 'GET',
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

window.getAllDepartmentInList = getAllDepartmentInList;
function getAllDepartmentInList(id) {

	$.ajax({
		url: "/WebApplication/Controllers/getAllDepartmentInList/" + sessionStorage.getItem('role') + '/' + sessionStorage.getItem('employeeId') + '',
		type: 'GET',
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

window.getAllRoleInList = getAllRoleInList;
function getAllRoleInList(id) {

	$.ajax({
		url: "/WebApplication/Controllers/getAllRoleInList/" + sessionStorage.getItem('role') + '',
		type: 'GET',
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

// controller defined in the SelectListAjaxController 

/*window.getDepartmentsByPlant = getDepartmentsByPlant; // used in documentCategory Master js 
function getDepartmentsByPlant(selectId, plantId) { // written in SelectListAjaxController
	// Clear previous options
	$('#' + selectId).empty();
	$('#' + selectId).append('<option value="">Select Dept</option>');

	$.ajax({
		url: "/WebApplication/Controllers/getDepartmentsByPlant/" + plantId,
		type: 'GET',
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		async: false,
		dataType: 'json',
		success: function(res) {
			for (var i = 0; i < res.length; i++) {
				var str = res[i];
				var parts = str.split(',');
				var option = '<option value="' + parts[1] + '">' + parts[0] + '</option>';
				$('#' + selectId).append(option);
			}
			// ✅ Trigger custom event when options are loaded
			$deptSelect.trigger('departmentsLoaded');
		},
		error: function(response) {
			alert(response.responseText);
		}
	});
}*/

window.getDepartmentsByPlant = getDepartmentsByPlant; // used in documentCategory Master js 
function getDepartmentsByPlant(selectId, plantId) { // written in SelectListAjaxController

	const $deptSelect = $('#' + selectId);
	$deptSelect.empty();  // Clear previous options
	$deptSelect.append('<option value="">Select Dept</option>');

	$.ajax({
		url: "/WebApplication/Controllers/getDepartmentsByPlant/" + plantId,
		type: 'GET',
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		async: false, // optional, you can remove async false if using events
		dataType: 'json',
		success: function(res) {
			for (var i = 0; i < res.length; i++) {
				var str = res[i];
				var parts = str.split(',');
				var option = '<option value="' + parts[1] + '">' + parts[0] + '</option>';
				$deptSelect.append(option);
			}
			// ✅ Trigger custom event when options are loaded
			$deptSelect.trigger('departmentsLoaded');
		},
		error: function(response) {
			alert(response.responseText);
		}
	});
}

window.getUsersByPlantAndDepartment = getUsersByPlantAndDepartment; // used in documentCategory Master js 
function getUsersByPlantAndDepartment(userSelectId, plantId, deptId) { // written in SelectListAjaxController
	const $userSelect = $("#" + userSelectId);
	$userSelect.empty();
	$userSelect.append('<option value="">Select User</option>');

	$.ajax({
		url: `/WebApplication/Controllers/getUsersByPlantAndDepartment/${plantId}/${deptId}`,
		type: "GET",
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
		success: function(res) {
			for (let i = 0; i < res.length; i++) {
				const user = res[i];
				const option = `<option value="${user.id}">${user.name}</option>`;
				$userSelect.append(option);
			}
			// ✅ Trigger custom event when users are loaded
			$userSelect.trigger('usersLoaded');
		},
		error: function(response) {
			alert("Error fetching users: " + response.responseText);
		}
	});
}

window.getAllDocumentCategoriesList = getAllDocumentCategoriesList;   // used in documentRegister Master js 
function getAllDocumentCategoriesList(selectId) { // written in SelectListAjaxController
	const $categorySelect = $("#" + selectId);
	$categorySelect.empty();
	$categorySelect.append('<option value="">Select Category</option>');

	$.ajax({
		url: "/WebApplication/Controllers/getAllDocumentCategoriesList",
		type: 'GET',
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		async: false, // consistent with your other functions
		dataType: 'json',
		success: function(res) {
			for (let i = 0; i < res.length; i++) {
				const str = res[i];
				const parts = str.split(',');
				const option = '<option value="' + parts[1] + '">' + parts[0] + '</option>';
				$categorySelect.append(option);
			}
			// Trigger event once loaded
			$categorySelect.trigger('categoriesLoaded');
		},
		error: function(response) {
			alert(response.responseText || "Error loading categories");
		}
	});
}


window.getAllSheetIdInList = getAllSheetIdInList;
function getAllSheetIdInList(id) {
	$.ajax({
		url: "/WebApplication/Controllers/getAllSheetIdInList",
		type: 'GET',
		contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		async: false,
		dataType: 'json',
		success: function(res) {
			for (var i = 0; i < res.length; i++) {
				var sheetId = res[i];
				var row = '<option value="' + sheetId + '">' + sheetId + '</option>';
				$('#' + id).append(row);
			}
		}, error: function(response) {
			alert(response.responseText);
		}
	});
}


window.getAllHowsInList = getAllHowsInList;
function getAllHowsInList(selectId) {
	$.ajax({
		url: "/WebApplication/Controllers/getAllHowsInList",
		type: 'GET',
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		dataType: 'json',
		success: function(res) {
			for (var i = 0; i < res.length; i++) {
				var how = res[i];
				var row = `<option value="${how.id}">${how.how}</option>`;
				$('#' + selectId).append(row);
			}
		},
		error: function(response) {
			alert("Failed to load how list");
			console.error(response.responseText);
		}
	});
}


window.getAllWhosInList = getAllWhosInList;
function getAllWhosInList(selectId) {
	$.ajax({
		url: "/WebApplication/Controllers/getAllWhosInList",
		type: 'GET',
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		dataType: 'json',
		success: function(res) {
			for (var i = 0; i < res.length; i++) {
				var who = res[i];
				var row = `<option value="${who.id}">${who.who}</option>`;
				$('#' + selectId).append(row);
			}
		},
		error: function(response) {
			alert("Failed to load how list");
			console.error(response.responseText);
		}
	});
}
window.getAllWhenInList = getAllWhenInList;
function getAllWhenInList(selectId) {
	$.ajax({
		url: "/WebApplication/Controllers/getAllWhenInList",
		type: 'GET',
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		dataType: 'json',
		success: function(res) {
			const $select = $('#' + selectId);
			$select.empty();
			$select.append(`<option value="">Select</option>`); // 🔥 add back "Select"

			res.forEach(when => {
				$select.append(`<option value="${when.id}">${when.whenColumn}</option>`);
			});
		},
		error: function(response) {
			alert("Failed to load when list");
			console.error(response.responseText);
		}
	});
}

window.getAllLinesInList = getAllLinesInList;
function getAllLinesInList(selectId) {
	$.ajax({
		url: "/WebApplication/Controllers/getListOfAllLines",
		type: 'GET',
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		dataType: 'json',
		success: function(res) {
			const $select = $('#' + selectId);
			$select.empty().append(`<option disabled selected>Select Line</option>`);
			res.forEach(line => {
				$select.append(`<option value="${line.lineId}">${line.lineName}</option>`);
			});
		},
		error: function(response) {
			alert("Failed to load line list");
			console.error(response.responseText);
		}
	});
}

window.getAllStationsInList = getAllStationsInList;
function getAllStationsInList(selectId) {
	$.ajax({
		url: "/WebApplication/Controllers/getListOfAllStations",
		type: 'GET',
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		dataType: 'json',
		success: function(res) {
			const $select = $('#' + selectId);
			$select.empty().append(`<option disabled selected>Select Station</option>`);
			res.forEach(station => {
				$select.append(`<option value="${station.id}">${station.name}</option>`);
			});
		},
		error: function(response) {
			alert("Failed to load line list");
			console.error(response.responseText);
		}
	});
}

window.getAllSheetsInList = getAllSheetsInList;
function getAllSheetsInList(selectId) {
	$.ajax({
		url: "/WebApplication/Controllers/getListOfAllSheets",
		type: 'GET',
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		dataType: 'json',
		success: function(res) {
			const $select = $('#' + selectId);
			$select.empty().append(`<option disabled selected>Select Sheet</option>`);
			res.forEach(sheet => {
				console.log("sheet" + sheet)
				$select.append(`<option value="${sheet.id}">${sheet.sheetType}</option>`);
			});
		},
		error: function(response) {
			alert("Failed to load line list");
			console.error(response.responseText);
		}
	});
}

window.getStationsByLineId = getStationsByLineId;
function getStationsByLineId(selectId, lineId) {
	if (!lineId) return;

	$.ajax({
		url: `/WebApplication/Controllers/getStationsByLine/${lineId}`,
		type: 'GET',
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		dataType: 'json',
		success: function(res) {
			const $select = $('#' + selectId);
			$select.empty().append(`<option disabled selected>Select Station</option>`);
			res.forEach(station => {
				$select.append(`<option value="${station.id}">${station.name}</option>`);
			});
		},
		error: function(response) {
			alert("Failed to load station list");
			console.error(response.responseText);
		}
	});
}

//  By saurabh for Ph Inspection master


window.getAllLinesInListforPhInspection = getAllLinesInListforPhInspection;
function getAllLinesInListforPhInspection(selectId, selectedValue) {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: "/WebApplication/Controllers/getListOfAllLines",
			type: "GET",
			contentType: "application/json",
			headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
			dataType: "json",
			success: function(res) {
				const $select = $("#" + selectId);
				$select.empty().append(`<option disabled selected>Select Line</option>`);
				res.forEach((line) => {
					$select.append(`<option value="${line.lineId}">${line.lineName}</option>`);
				});

				if (selectedValue) {
					$select.val(selectedValue);
				}

				resolve(res); // ✅
			},
			error: function(response) {
				alert("Failed to load line list");
				console.error(response.responseText);
				reject(response);
			},
		});
	});
}
window.getStationsByLine = getStationsByLine;
function getStationsByLine(lineId, selectId, selectedValue) {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `/WebApplication/Controllers/getStationByLine/${lineId}`,
			type: "GET",
			headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
			success: function(res) {
				const $select = $("#" + selectId);
				$select.empty().append(`<option disabled selected>Select Station</option>`);
				res.forEach((station) => {
					$select.append(`<option value="${station.id}">${station.name}</option>`);
				});

				if (selectedValue) {
					$select.val(selectedValue);
				}

				resolve(res);
			},
			error: function(response) {
				console.error("Failed to load stations:", response.responseText);
				reject(response);
			},
		});
	});
}
window.getSheetsByLineAndStation = getSheetsByLineAndStation;
function getSheetsByLineAndStation(lineId, stationId, selectId, selectedValue) {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `/WebApplication/Controllers/getSheetsByLineAndStation/${lineId}/${stationId}`,
			type: "GET",
			headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
			success: function(res) {
				const $select = $("#" + selectId);
				$select.empty().append(`<option disabled selected>Select Sheet</option>`);
				res.forEach((sheet) => {
					$select.append(`<option value="${sheet.id}">${sheet.sheetType}</option>`);
				});

				if (selectedValue) {
					$select.val(selectedValue);
				}

				resolve(res);
			},
			error: function(response) {
				console.error("Failed to load sheets:", response.responseText);
				reject(response);
			},
		});
	});
}






window.getAllCheckSheetFieldsInList = getAllCheckSheetFieldsInList;
function getAllCheckSheetFieldsInList(selectId) {
	$.ajax({
		url: '/WebApplication/Controllers/getListOfAllCheckSheetFields',
		type: 'GET',
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(data) {
			const formatted = data.map(item => {
				let imageUrl = null;
				let labelText = "";
				if (item.ptype === 1 && item.parameter) {
					// Handles both Windows (`\`) and `/`) slashes
					const filename = item.parameter.split(/[/\\]/).pop();

					// controller fetch the image using the image name  defined in  MachineCheckSheetField ajax controller to serve images 
					imageUrl = `/WebApplication/Controllers/MachineCheckSheetFieldImage/${filename}`;
					labelText = item.reference ?? filename; // Show reference or filename
				} else {
					labelText = `${item.parameter ?? ""} (${item.reference ?? ""})`; // Default for non-image
				}

				return {
					id: item.rowId,
					text: labelText,
					imageUrl: imageUrl
				};
			});

			// Initialize Select2 with dropdownParent
			const $select = $('#' + selectId);

			$select.select2({
				data: formatted,
				templateResult: formatOption,
				templateSelection: formatOption,
				placeholder: "Select MCS Field",
				allowClear: true,
				dropdownParent: $('#addEditDeleteBackdropModal') // make sure this is the correct modal wrapper
			});

			// ✅ Ensure the select fills container width
			$select.css("width", "100%");

			// ✅ Patch styles for Select2 DOM
			setTimeout(() => {
				$('.select2-container').css({
					'width': '100%',
					'min-height': '36px',
					'z-index': '1055'
				});

				$('.select2-selection').css({
					'border': '1px solid #ced4da',
					'min-height': '36px'
				});

				$('.select2-dropdown').css({
					'max-height': '250px',
					'overflow-y': 'auto',
					'z-index': '1056'
				});
			}, 200); // delay ensures DOM is ready
		},
		error: function() {
			alert("Failed to load CheckSheet fields.");
		}
	});
}


window.getAllIonizerFieldsInList = getAllIonizerFieldsInList;
function getAllIonizerFieldsInList(selectId) {
	$.ajax({
		url: '/WebApplication/Controllers/getListOfAllIonizerFields',
		type: 'GET',
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(data) {
			const formatted = data.map(item => {
				let imageUrl = null;
				let labelText = "";
				if (item.ptype === 1 && item.parameter) {
					// Handles both Windows (`\`) and `/`) slashes
					const filename = item.parameter.split(/[/\\]/).pop();

					// controller fetch the image using the image name  defined in  MachineCheckSheetField ajax controller to serve images 
					imageUrl = `/WebApplication/Controllers/IonizerFieldImage/${filename}`;
					labelText = item.reference ?? filename; // Show reference or filename
				} else {
					labelText = `${item.parameter ?? ""} (${item.reference ?? ""})`; // Default for non-image
				}

				return {
					id: item.rowId,
					text: labelText,
					imageUrl: imageUrl
				};
			});

			// Initialize Select2 with dropdownParent
			const $select = $('#' + selectId);

			$select.select2({
				data: formatted,
				templateResult: formatOption,
				templateSelection: formatOption,
				placeholder: "Select Ionizer Field",
				allowClear: true,
				dropdownParent: $('#addEditDeleteBackdropModal') // make sure this is the correct modal wrapper
			});

			// ✅ Ensure the select fills container width
			$select.css("width", "100%");

			// ✅ Patch styles for Select2 DOM
			setTimeout(() => {
				$('.select2-container').css({
					'width': '100%',
					'min-height': '36px',
					'z-index': '1055'
				});

				$('.select2-selection').css({
					'border': '1px solid #ced4da',
					'min-height': '36px'
				});

				$('.select2-dropdown').css({
					'max-height': '250px',
					'overflow-y': 'auto',
					'z-index': '1056'
				});
			}, 200); // delay ensures DOM is ready
		},
		error: function() {
			alert("Failed to load CheckSheet fields.");
		}
	});
}



function formatOption(option) {
	if (!option.id) return option.text; // Placeholder

	const imageUrl = option.imageUrl;
	const displayText = option.text;

	if (imageUrl) {
		return $(`

			<div style="text-align: center;">
				<div style="margin-top: 5px;">${displayText}</div>
			    <img src="${imageUrl}" style="max-width: 100%; max-height: 100px; object-fit: contain; display: block; margin: auto;" />    
			</div>
        `);
	}

	return $(`<span>${displayText}</span>`);
}



// -------------------------  other functions
window.changeFileType = changeFileType;
function changeFileType() {
	const fileType = $('input[name="resource"]:checked').val();
	const fileInput = $('#uploadExcel');

	console.log(fileType);

	if (fileType == 'excel') {
		fileInput.attr('accept', '.xlsx,.xls');
	} else if (fileType == 'video') {
		fileInput.attr('accept', '.mp4,.mov,.avi');
	} else if (fileType == 'image') {
		fileInput.attr('accept', '.jpg,.jpeg,.png,.gif');
	} else if (fileType == 'pdf') {
		fileInput.attr('accept', '.pdf');
	}
}

window.showImage = showImage;
function showImage(list, container) {

	var imageContainer = document.createElement("img");
	var attr = ["id", "image" + list[1] + "", "src", "/WebApplication/trainingResouces/" + list[3] + ".png", "width", "100%"]


	$("#" + container).append(imageContainer);
	appendAttribute(attr, imageContainer);


}

window.playVideo = playVideo
function playVideo(video) {
	video.play();
}


window.pauseVideo = pauseVideo
function pauseVideo(video) {
	video.pause();
}

window.restartVideo = restartVideo
function restartVideo(video) {
	video.currentTime = 0;
	video.play();
}


window.showMasterVideo = showMasterVideo;
function showMasterVideo(response, container) {

	var videoContainer = document.createElement("video");
	var attr = ["id", "video" + response.columnId + "", "controls", "controls", "class", "video", "autoplay", "autoplay"]

	appendAttribute(attr, videoContainer);

	var source = document.createElement("source");
	var sourceAttr = ["src", "/WebApplication/trainingResouces/" + response.resourcePath + ".mp4", "type", "video/mp4"]

	appendAttribute(sourceAttr, source);

	videoContainer.append(source);

	$("#" + container).append(videoContainer);


	var myVideo = document.getElementById("video" + response.columnId);
	playVideo(myVideo);

}


window.showVideo = showVideo;
function showVideo(response, container) {

	var video = $(".video");
	video.attr("id", "video" + response.columnId);

	var source = document.createElement("source");
	var sourceAttr = ["src", "/WebApplication/trainingResouces/" + response.resourcePath + ".mp4", "type", "video/mp4"]

	appendAttribute(sourceAttr, source);

	video.append(source);

	$("#" + container).append(video);

}

window.appendAttribute = appendAttribute;
function appendAttribute(list, element) {

	for (var i = 0; i <= list.length - 1; i = i + 2) {
		for (var j = 0; j <= i; j = j + 2) {
			element.setAttribute(list[i], list[j + 1]);
		}
	}

}

