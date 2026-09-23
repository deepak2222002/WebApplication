
$(document).on('click', '#ionizerFieldMaster', function() {

	$(".fromToDiv").css("display", "none");
	
	$("#offcanvasCloseButton").click();
	$("#masterHeading").text("IONIZER FIELD MASTER");

	$("#tableContainer").empty();
	$("#pagerContainer").empty();
	makePagerBody("pagerContainer");
	
	var headerList = ["S. No.", "Parameter", "Date Text", "How", "Who", "When", "Reference", "Vtype", "Passif", "Value1", "Value2", "Created by","Creation Date", "Modified by", "Date Modified"];
	var searchList = ["searchParameter", "searchDateText", "searchHow", "searchWho", "searchWhen", "searchReference", "searchVtype", "searchPassif", "searchValue1", "searchValue2", "", "", "", ""];
	var placeholderList = ["Parameter", "Date Text", "How", "Who", "When", "Reference", "Vtype", "Passif", "Value1", "Value2", ""];
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
	

window.loadLikeIonizerFieldData = loadLikeIonizerFieldData;
function loadLikeIonizerFieldData(page, pageSize) {

	var ptype = $('#searchPtype').val() ?? "";
	var parameter = $('#searchParameter').val() ?? "";
	var howvalue = $('#searchHow').val() ?? "";
	var whovalue = $('#searchWho').val() ?? "";
	var whenvalue = $('#searchWhen').val() ?? "";
	var dateText = $('#searchDateText').val() ?? "";
	
	var vType = $('#searchVtype').val() ?? "";
	var reference = $('#searchReference').val() ?? "";
	var passIf = $('#searchPassif').val() ?? "";
	var value1 = $('#searchValue1').val() ?? "";
	var value2 = $('#searchValue2').val() ?? "";
	
	var formData = {
		ptype: ptype,
		parameter: parameter,
		how: {
			id: howvalue === "" ? null : parseInt(howvalue)
		},
		who: {
			id: whovalue === "" ? null : parseInt(whovalue)
		},
		when: {
			id: whenvalue === "" ? null : parseInt(whenvalue)
		},
		dateText: dateText,
		vType: vType,
		reference:reference,
		passIf: passIf,
		value1: value1,
		value2: value2,
	}
	console.log(formData);

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getLikeIonizerFieldData/' + page + '/' + pageSize,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {
	  console.log(res);
			makePagerByTotalPages(res, page);
			insertIonizerFieldInTable(res.content, "table1");
		},
		error: function(response) {


		}
	});
}



window.ionizerFieldInputs =ionizerFieldInputs;
function ionizerFieldInputs(modalBodyId) {

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
	var container55 = document.createElement("div");
	var container56 = document.createElement("div");
	
	container46.setAttribute("class", "dataContainer smallContainer mt-1");
	container47.setAttribute("class", "dataContainer smallContainer mt-1");
	container48.setAttribute("class", "dataContainer smallContainer mt-1");
	container49.setAttribute("class", "dataContainer smallContainer mt-1");
	container50.setAttribute("class", "dataContainer smallContainer mt-1");
	container51.setAttribute("class", "dataContainer smallContainer mt-1");
	container52.setAttribute("class", "dataContainer smallContainer mt-1");
	container53.setAttribute("class", "dataContainer smallContainer mt-1");
	container54.setAttribute("class", "dataContainer smallContainer mt-1");
	container55.setAttribute("class", "dataContainer smallContainer mt-1");
	container56.setAttribute("class", "dataContainer smallContainer mt-1");

	$("#" + modalBodyId).append(container46, container47, container48, container49, container50, container51, container52, container53, container54, container55, container56);
		
	var ptypeDropdownAttr = ["id", "ptypeinput", "class", "inputs m1 selectInput"];
	createSelectList(ptypeDropdownAttr, container46, "Param. Type");
	insertOptionById("ptypeinput", "Select");
	$('#ptypeinput').append(`<option value="0" selected>Text</option>`);
	$('#ptypeinput').append(`<option value="1">Image</option>`);

	
	$('#ptypeinput').on('change', function () {
	    const value = $(this).val();
	    if (value === "0") {
	        $('#paramTextWrapper').show();
	        $('#paramFileWrapper').hide();
			$('#imagePreviewBox').hide().empty(); // Hide preview
	    } else if (value === "1") {
	        $('#paramTextWrapper').hide();
	        $('#paramFileWrapper').show();
	    }
	});
	


	
	// Create text wrapper div
	const paramTextWrapper = document.createElement("div");
	paramTextWrapper.id = "paramTextWrapper";

	// Create scroll wrapper inside text wrapper
	const scrollWrapper = document.createElement("div");
	scrollWrapper.id = "paramTextScrollWrapper";
	scrollWrapper.style.maxHeight = "280px";
	scrollWrapper.style.overflowX = "auto";


	const paramTextAttr = ["id", "parameternameinput", "name", "parameterName", "class", "inputs m1 textInput", "placeholder", "Parameter Name...",
	 "maxlength", "1000", "wrap", "soft", "max-height","250px", "overflow-y", "auto", "overflow-x", "hidden" ];
	 // Input inside scrollWrapper
	 createTextarea(paramTextAttr, scrollWrapper, "Parameter Name");

	// append scroll inside text wrapper
	paramTextWrapper.appendChild(scrollWrapper);

	// Append full text wrapper to container
	container47.appendChild(paramTextWrapper);



	// Create file wrapper div
	const paramFileWrapper = document.createElement("div");
	paramFileWrapper.id = "paramFileWrapper";
	container47.appendChild(paramFileWrapper);
	
	// hidden imagePreviewBox
	const imagePreviewBox = document.createElement("div");
	imagePreviewBox.id = "imagePreviewBox";
	imagePreviewBox.style.display = "none";
	imagePreviewBox.style.border = "1px solid #ccc";
	imagePreviewBox.style.padding = "8px";
	imagePreviewBox.style.marginTop = "8px";
	imagePreviewBox.style.maxHeight = "200px";
	imagePreviewBox.style.overflowY = "auto";
	imagePreviewBox.style.textAlign = "center";
	imagePreviewBox.style.backgroundColor = "#f9f9f9";

	// Append to container47 (same as file input)
	container47.appendChild(imagePreviewBox);


	const paramFileAttr = ["id", "parameterfileinput", "type", "file", "name", "file", "class", "inputs m1 fileInput"];
	createInput(paramFileAttr, paramFileWrapper, "Upload Parameter Image");


	// Hide file input initially
	$('#paramFileWrapper').hide();

	// on change of file input if any image selected so show that
	$('#parameterfileinput').on('change', function () {
		const file = this.files[0];

		if (file && file.type.startsWith('image/')) {
			const reader = new FileReader();
			reader.onload = function (e) {
				$('#imagePreviewBox').html(`<img src="${e.target.result}" alt="Image Preview" style="max-width: 100%; max-height: 180px;">`);
				$('#imagePreviewBox').show();
			};
			reader.readAsDataURL(file);
		} else {
			$('#imagePreviewBox').hide().empty();
		}
	});
	
	
	
	var howDropdownAttr = ["id", "howDropdown", "class", "inputs m1 selectInput"];
	createSelectList(howDropdownAttr, container48, "How");
	insertOptionById("howDropdown", "Select");
	
	
	var whoDropdownAttr = ["id", "whoDropdown", "class", "inputs m1 selectInput"];
	createSelectList(whoDropdownAttr, container49, "Who");
	insertOptionById("whoDropdown", "Select");
	
	var whenDropdownAttr = ["id", "whenDropdown", "class", "inputs m1 selectInput"];
	createSelectList(whenDropdownAttr, container50, "When");
	insertOptionById("whenDropdown", "Select");
	
	var dateRequiredAttr = ["id", "dateRequired", "class", "inputs m1 selectInput"];
	createSelectList(dateRequiredAttr, container51, "Date Required ");
	insertOptionById("dateRequired", "Select");
	$('#dateRequired').append(`<option value="Yes">Yes</option>`);
	$('#dateRequired').append(`<option value="No">No</option>`);
	$(container52).empty().hide(); 
	
	$('#dateRequired').on('change', function () {
	    const selected = $(this).val();

	    $(container52).empty().hide(); // clear and hide

	    if (selected === "Yes") {
	        var dateTextAttr = ["id", "dateTextinput", "type", "text", "name", "dateText", "class", "inputs m1 textInput", "placeholder", "Date Text...", "maxlength", "150"];
	        createInput(dateTextAttr, container52, "Date Text");
	        $(container52).show();
	    }
	});

	
	var referenceAttr = ["id", "referenceinput", "type", "text", "name", "reference", "class", "inputs m1 textInput", "placeholder", "Reference...", "maxlength", "50"];
	createInput(referenceAttr, container53, "Reference");

	var vtypeDropdownAttr = ["id", "vtypeDropdown", "class", "inputs m1 selectInput"];
	createSelectList(vtypeDropdownAttr, container54, "VType");
	insertOptionById("vtypeDropdown", "Select");
	$('#vtypeDropdown').append(`<option value="text">Text</option>`);
	$('#vtypeDropdown').append(`<option value="yesno">Yes/No</option>`);
	$('#vtypeDropdown').append(`<option value="number">Number</option>`);
	$('#vtypeDropdown').append(`<option value="date">Date</option>`);

	const passIfWrapper = document.createElement("div");
	passIfWrapper.id = "passIfWrapper";
	passIfWrapper.style.display = "none"; // Initially hidden
	container55.appendChild(passIfWrapper);


	const valueWrapper = document.createElement("div");
	valueWrapper.id = "valueWrapper";
	valueWrapper.style.display = "none"; // Initially hidden
	container56.appendChild(valueWrapper);
	// for vtype Dropdown
	$('#vtypeDropdown').on('change', function () {
		const selected = $(this).val();

		// Clear both wrappers
		$('#passIfWrapper').empty().hide();
		$('#valueWrapper').empty().hide();

		if (selected === "yesno") {
			// Show and populate passif dropdown with Yes/No
			const passifAttr = ["id", "passifDropdown", "class", "inputs m1 selectInput"];
			createSelectList(passifAttr, passIfWrapper, "Pass If");
			insertOptionById("passifDropdown", "Select");
			$('#passifDropdown').append(`<option value="Yes">Yes</option>`);
			$('#passifDropdown').append(`<option value="No">No</option>`);
			$('#passIfWrapper').show();

		} else if (selected === "number") {
			// Show and populate passif dropdown with conditions
			const passifAttr = ["id", "passifDropdown", "class", "inputs m1 selectInput"];
			createSelectList(passifAttr, passIfWrapper, "Pass If");
			insertOptionById("passifDropdown", "Select");

			$('#passifDropdown').append(`<option value="Greater_than">Greater Than</option>`);
			$('#passifDropdown').append(`<option value="Less_than">Less Than</option>`);
			$('#passifDropdown').append(`<option value="Equal">Equal To</option>`);
			$('#passifDropdown').append(`<option value="Between">Lies Between</option>`);
			$('#passifDropdown').append(`<option value="Not_between">Does Not Lie Between</option>`);
			$('#passIfWrapper').show();

			// Setup on-change handler for passifDropdown
			$('#passifDropdown').off('change').on('change', function() {
				const passifValue = $(this).val();

				$('#valueWrapper').empty().hide();

				const value1Attr = ["id", "value1Input", "name", "value1", "class", "inputs m1 textInput", "placeholder", "Value 1"];
				const value2Attr = ["id", "value2Input", "name", "value2", "class", "inputs m1 textInput", "placeholder", "Value 2"];

				// Always add Value 1
				createInput(value1Attr, valueWrapper, "Value 1");

				if (passifValue === "Between" || passifValue === "Not_between") {
					// Add Value 2 only if needed
					createInput(value2Attr, valueWrapper, "Value 2");
				}

				$('#valueWrapper').show();
			});
		}
	});

	
	// Call it when page loads or required
	getAllHowsInList("howDropdown");
	getAllWhosInList("whoDropdown");
	getAllWhenInList("whenDropdown");
}


/*-------------------------------- For visibility on frontend ---------------------*/
window.insertIonizerFieldInTable = insertIonizerFieldInTable;
function insertIonizerFieldInTable($item, tableId) {
	$("#" + tableId + "Body").empty();

	var sequenceNumber = getSequenceNumber();

	$.each($item, function(index, value) {

		var row = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId" class="width50">' + (sequenceNumber + 1) + '</td>'
			+ '<td data-column="ptype" style="display:none;" class="width50">' + (value.ptype == null ? '' : value.ptype) + '</td>'
			

			+ '<td data-column="parameter" class="width150 textLeftAlign">'
			+ (value.ptype == 1 
			    ? '<span style="color:blue;">Image</span><span class="hiddenUrl" style="display:none;">' + value.parameter + '</span>' 
			    : (value.parameter ?? ''))
			+ '</td>'
			
			+ '<td data-column="dateRequired" class="width50" style="display:none;">' + (value.dateRequired == null ? '' : value.dateRequired) + '</td>'
			+ '<td data-column="dateText" class="width100">' + (value.dateText == null ? '' : value.dateText) + '</td>' 
			
			+ '<td data-column="how" class="width100" data-how-id="' + (value.how?.id ?? '') + '" data-how-text="' + (value.how?.how ?? '') + '">' 
			+ (value.how?.how ?? '')
			+ '</td>'
			+ '<td data-column="who" class="width100" data-who-id="' + (value.who?.id ?? '') + '" data-who-text="' + (value.who?.who ?? '') + '">'
			+ (value.who?.who ?? '')
			+ '</td>'
			
			+ '<td data-column="whenColumn" class="width100" data-whencolumn-id="' + (value.whenColumn?.id ?? '') + '" data-whencolumn-text="' + (value.whenColumn?.whenColumn ?? '') + '">' 
			+ (value.whenColumn?.whenColumn ?? '') 
			+ '</td>' 

			+ '<td data-column="reference" class="width50">' + (value.reference == null ? '' : value.reference) + '</td>'
			+ '<td data-column="vtype" class="width50">' + (value.vtype == null ? '' : value.vtype) + '</td>'
			+ '<td data-column="passif" class="width50">' + (value.passif == null ? '' : value.passif) + '</td>'
			+ '<td data-column="value1" class="width50">' + (value.value1 == null ? '' : value.value1) + '</td>'
			+ '<td data-column="value2" class="width50">' + (value.value2 == null ? '' : value.value2) + '</td>'
			+ '<td data-column="createdBy" class="width50">' + (value.createdBy == null ? '' : value.createdBy) + '</td>'
			+ '<td data-column="dateTimeCreationd" class="width100">' + (value.dateTimeCreation == null ? '' : value.dateTimeCreation) + '</td>'
			+ '<td data-column="modifiedBy" class="width50">' + (value.modifiedBy == null ? '' : value.modifiedBy) + '</td>'
			+ '<td data-column="dateTimeModified" class="width100">' + (value.dateTimeModified == null ? '' : value.dateTimeModified) + '</td>'
			+ '<td data-column="IonizerfieldId" style="display:none;">' + (value.rowId == null ? '' : value.rowId) + '</td></tr>';
		$("#" + tableId).append(row);
		sequenceNumber++;
	});
}



window.addIonizerField = addIonizerField;
function addIonizerField() {
	const ptype = $('#ptypeinput').val();
	const parameterText = $('#parameternameinput').val();
	const file = $('#parameterfileinput')[0].files[0];
	const howId = $('#howDropdown').val();
	const whoId = $('#whoDropdown').val();
	const whenId = $('#whenDropdown').val();  
	let dateRequired = $('#dateRequired').val();
	let dateText = $('#dateTextinput').val();   // only exists if "Yes" was selected
	const referenceinputText = $('#referenceinput').val();
	const vtype = $('#vtypeDropdown').val();
	const passif = $('#passifDropdown').val() ?? "";
	const value1 = $('#value1Input')?.val() ?? "";
	const value2 = $('#value2Input')?.val() ?? "";
	const createdBy = sessionStorage.getItem('employeeId');

	//!showMandatory(['#sheetidinput', '#fieldnameinput', '#cellnoinput', '#fieldtypeinput', '#fieldmandatoryinput'])
	if (!ptype || (ptype === "0" && !parameterText) || (ptype === "1" && !file) || 	!howId || howId === "Select" ||
		!whoId || whoId === "Select" ||!whenId || whenId === "Select" || !vtype || vtype === "Select" || !referenceinputText ||
		!dateRequired || dateRequired === "Select") {
			
		showErrorResponse("responseContainer", "Please fill all required fields.");
		return;
	}	
	
	// ✅ If dateRequired = Yes, then dateText must not be empty
	if (dateRequired === "Yes" && !dateText) {
	    showErrorResponse("responseContainer", "Please provide Date Text when Date Required is Yes.");
	    return;
	} else if(dateRequired === "No"){
		dateText="----";
	}

	// vtype specific validation
	if (vtype === "yesno" && !passif) {
		showErrorResponse("responseContainer", "Please select 'Pass If' for Yes/No type.");
		return;
	}

	if (vtype === "number") {
		if (!passif) {
			showErrorResponse("responseContainer", "Please select 'Pass If' for Number type.");
			return;
		}
		if ((passif === "between" || passif === "not_between") && (!value1 || !value2)) {
			showErrorResponse("responseContainer", "Please provide both values for 'between' condition.");
			return;
		}
		if ((passif === "gt" || passif === "lt" || passif === "eq") && !value1) {
			showErrorResponse("responseContainer", "Please provide Value 1 for selected numeric condition.");
			return;
		}
	}

	const formData = new FormData();
	formData.append("ptype", ptype);
	formData.append("parameter", ptype === "0" ? parameterText : ""); // if image, server will store file path
	formData.append("file", file ?? "");
	formData.append("howId", howId);
	formData.append("whoId", whoId);
	formData.append("whenId", whenId);   
	formData.append("dateRequired", dateRequired);  
	formData.append("dateText", dateText); 
	formData.append("reference", referenceinputText);
	formData.append("vtype", vtype);
	formData.append("passif", passif);
	formData.append("value1", value1);
	formData.append("value2", value2);
	formData.append("createdBy", createdBy);

	$.ajax({
		type: 'POST',
		url: '/WebApplication/Controllers/insertIonizerField',
		data: formData, //  may also contain the input image file
		processData: false,
		contentType: false,
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


window.editIonizerField = editIonizerField;
function editIonizerField() {

	const ptype = $('#ptypeinput').val();
	const parameterText = $('#parameternameinput').val();
	const file = $('#parameterfileinput')[0].files[0]; // optional file change

	// in edit i can't directly set parameterfileinput from the program, like i can only chose file from browser path which will set the path.
	// not possible to set path by program so i not able to set the path from the parameterfileinput i hiddenly created this in '.edit' in commonjs
	const existingFile = $('#existingParameterFilename').val(); // 🔸 Get existing filename

	const howId = $('#howDropdown').val();
	const whoId = $('#whoDropdown').val();
	const whenId = $('#whenDropdown').val();  
	let dateRequired = $('#dateRequired').val();
	let dateText = $('#dateTextinput').val();  
	const referenceinputText = $('#referenceinput').val();
	const vtype = $('#vtypeDropdown').val();
	const passif = $('#passifDropdown').val() ?? "";
	const value1 = $('#value1Input')?.val() ?? "";
	const value2 = $('#value2Input')?.val() ?? "";
	const modifiedBy = sessionStorage.getItem('employeeId');

	
	// (ptype === "1" && !file && !existingFile) will throw only when both are missing.
	if (!ptype || (ptype === "0" && !parameterText) || (ptype === "1" && !file && !existingFile) || 
		!howId || howId === "Select" || !whoId || whoId === "Select" || !whenId || whenId === "Select" || 
		 !vtype || vtype === "Select" || !referenceinputText || !dateRequired || dateRequired === "Select" ) {
			
		showErrorResponse("responseContainer", "Please fill all required fields.");
		return; // Stop execution 
	}

	// ✅ If dateRequired = Yes, then dateText must not be empty
	if (dateRequired === "Yes" && !dateText) {
	    showErrorResponse("responseContainer", "Please provide Date Text when Date Required is Yes.");
	    return;
	} else if(dateRequired === "No"){
		dateText="----";
	}
	
	if (vtype === "yesno" && !passif) {
		showErrorResponse("responseContainer", "Please select 'Pass If' for Yes/No type.");
		return;
	}

	if (vtype === "number") {
		if (!passif) {
			showErrorResponse("responseContainer", "Please select 'Pass If' for Number type.");
			return;
		}
		if ((passif === "between" || passif === "not_between") && (!value1 || !value2)) {
			showErrorResponse("responseContainer", "Please provide both values for 'between' condition.");
			return;
		}
		if ((passif === "gt" || passif === "lt" || passif === "eq") && !value1) {
			showErrorResponse("responseContainer", "Please provide Value 1 for selected numeric condition.");
			return;
		}
	}
	

		const formData = new FormData();
		formData.append("rowid", IonizerfieldId); // 🔴 Add this — assumed your edit uses `rowId`
		formData.append("ptype", ptype);
		formData.append("parameter", ptype === "0" ? parameterText : ""); // For text
		if (file) {
			formData.append("file", file); // Only if new additional file is selected by user.
		} else if(existingFile){
			formData.append("existingFile", existingFile);  // older saved file path is set again.
		}
		formData.append("howId", howId);
		formData.append("whoId", whoId);
		formData.append("whenId", whenId);
		formData.append("dateRequired", dateRequired);     
		formData.append("dateText", dateText);
		formData.append("vtype", vtype);
		formData.append("reference", referenceinputText);
		formData.append("passif", passif);
		formData.append("value1", value1);
		formData.append("value2", value2);
		formData.append("createdBy", createdBy); // coming from mastercomman js set in .edit
		formData.append("modifiedBy", modifiedBy);
		formData.append("dateTimeCreation", dateTimeCreation);
		
		for (const [key, value] of formData.entries()) {
		    console.log(`${key}:`, value);
		}

		$.ajax({
			type: 'POST',
			url: '/WebApplication/Controllers/editIonizerField',
			data: formData, //  may also contain the input image file
			processData: false,
			contentType: false,
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

window.deleteIonizerField = deleteIonizerField;
function deleteIonizerField() {

	if (deleteAllList.length >= 1) {

		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/delete/deleteAllIonizerField',
			data: JSON.stringify(deleteAllList),
			contentType: "application/json",
			headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
			success: function(response) {
				loadDataAndPager();
				$("#informationBackdropButton").click();
				resetValues();
			},
			error: function(response) {
				loadDataAndPager();
				$("#informationBackdropButton").click();
				$("#warningInformationModalBody").text(response.responseText);
				$("#warningBackdropButton").click();
				resetValues();
			}
		});
	} else if (!object.rowId && deleteAllList.length == 0) {

		$("#warningInformationModalBody").text("Please select row from table to delete line.");
		$("#warningBackdropButton").click();
	}

}