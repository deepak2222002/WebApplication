
$(document).on('click', '#signMaster', function() {

	$("#offcanvasCloseButton").click();
	$("#masterHeading").text("SIGN MASTER")

	$("#tableContainer").empty();
	$("#pagerContainer").empty();
	makePagerBody("pagerContainer");


	var headerList = ["S. No.", "Name","Department","Plant Code","Signature","Created By", "Creation Date","Updated Date"];
	var searchList = ["searchName","searchDepartment","searchPlantCode","","searchCreatedBy", "",""];
	var placeholderList = ["Name","Department","Plant Code","","Created By"];
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

window.loadLikeExcelSignData = loadLikeExcelSignData;
function loadLikeExcelSignData(page, pageSize) {
	var name = $('#searchName').val() ?? "";
	var department = $('#searchDepartment').val() ?? "";
    var plantCode = $('#searchPlantCode').val() ?? "";
	var createdfBy = $('#searchCreatedBy').val() ?? "";

	var formData = {
		user:{firstName: name},
		department: { departmentName: department },
		 plant: { plantCode: plantCode },
		createdBy: createdfBy
	}

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getLikeExcelSignMaster/' + page + '/' + pageSize,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {
			console.log("response aaya",res);
			makePagerByTotalPages(res, page);
			insertExcelSignInTable(res.content, "table1");
		},
		error: function(response) {
			console.log("response",response);
		}
	});
}

function loadSignature(fileName, imgElementId) {
    fetch('/WebApplication/Controllers/sign/' + fileName, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to load signature: " + response.status);
        }
        return response.blob();
    })
    .then(blob => {
        const url = URL.createObjectURL(blob);
        document.getElementById(imgElementId).src = url;
    })
    .catch(err => {
        console.error(err);
        document.getElementById(imgElementId).alt = "Signature not found";
    });
}



/*-------------------------------- For visibility on frontend ---------------------*/
window.insertExcelSignInTable = insertExcelSignInTable;
function insertExcelSignInTable($item, tableId) {
	$("#" + tableId + "Body").empty();

	var sequenceNumber = getSequenceNumber();

	$.each($item, function(index, value) {
		var row = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId" class="width50">' + (sequenceNumber + 1) + '</td>'
			+ '<td data-column="name" class="width150">' + (value.user?.firstName == null ? '' : value.user?.firstName) + '</td>'
			+ '<td data-column="loginId" style="display:none;">' + (value.user?.loginId == null ? '' : value.user?.loginId) + '</td>'
			+ '<td data-column="department" class="width150">' + (value.department?.departmentName == null ? '' : value.department?.departmentName) + '</td>'
			+ '<td data-column="departmentId" style="display:none;">' + (value.department?.departmentId == null ? '' : value.department?.departmentId) + '</td>'
			+ '<td data-column="plantCode" class="width150">' + (value.plant?.plantCode == null ? '' : value.plant?.plantCode) + '</td>'
			+ '<td data-column="signature" class="width150"><img id="sign_' + value.excelSignId + '" style="width:100px; height:40px; object-fit:contain; border:1px solid #ccc;" /></td>'
			+ '<td data-column="createdBy" class="width50">' + (value.createdBy == null ? '' : value.createdBy) + '</td>'
			+ '<td data-column="createdTime" class="width70">' + (value.createdTime == null ? '' : value.createdTime) + '</td>'
			+ '<td data-column="updatedTime" class="width70">' + (value.updatedTime == null ? '' : value.updatedTime) + '</td>'
			+ '<td data-column="excelSignId" style="display:none;">' + (value.excelSignId == null ? '' : value.excelSignId) +'</td></tr>';
		$("#" + tableId).append(row);
		loadSignature(value.signature, "sign_" + value.excelSignId);

		sequenceNumber++;
	});
}


window.ExcelSignMasterInputs = ExcelSignMasterInputs;
function ExcelSignMasterInputs(modalBodyId) {

	$("#" + modalBodyId).empty();

	var container1 = document.createElement("div");
	var container2 = document.createElement("div");
	var container3 = document.createElement("div"); // for signature upload
	var container4 = document.createElement("div"); // for preview + crop
	var container5 = document.createElement("div");
	var container6 = document.createElement("div");

	container1.setAttribute("class", "dataContainer smallContainer mt-1");
	container3.setAttribute("class", "dataContainer smallContainer mt-1");
	container4.setAttribute("class", "dataContainer  mt-1");
	container5.setAttribute("class", "dataContainer smallContainer mt-1");
	container6.setAttribute("class", "dataContainer smallContainer mt-1");


	$("#" + modalBodyId).append(container5,container6,container1,container3, container4);

	// Name input
	var plantcodeAttr = ["id", "plantcodeinput", "class", "inputs m1 selectInput"];

		createSelectList(plantcodeAttr, container5, "Plant Code");
		insertOptionById("plantcodeinput", "Select");
	var departmentAttr=["id","departmentinput","class","inputs m1 selectInput"];
	    createSelectList(departmentAttr,container6,"Department");
		insertOptionById("departmentinput","Select");	
	const nameAttr = [	"id", "nameInput","class", "inputs m1 selectInput"];
		createSelectList(nameAttr, container1, "Name");
		insertOptionById("departmentinput","Select");

	insertOptionById("designationinput", "Select");
	insertOptionById("designationinput", "Line Leader");
	insertOptionById("designationinput", "Supervisor");
	insertOptionById("designationinput", "Line Engineer");

	// Signature upload input
	var signAttr = [
		"id", "signUpload",
		"type", "file",
		"name", "signature",
		"class", "inputs m1 fileInput",
		"accept", "image/*"
	];
	createInput(signAttr, container3, "Upload Signature");

	// Preview + crop box
	container4.innerHTML = `
		<div style="width:300px; height:150px; border:1px solid #ccc; overflow:hidden;">
			<img id="signPreview" style="max-width:100%; display:none;" />
		</div>
		<button type="button" id="cropBtn" style="margin-top:8px; display:none;">Crop & Save</button>
		<canvas id="signCanvas" style="display:none; border:1px solid #ddd; margin-top:8px;"></canvas>
	`;

	// Event handling for cropping
	let cropper;
	$("#signUpload").on("change", function (event) {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = function (e) {
				$("#signPreview").attr("src", e.target.result).show();
				if (cropper) cropper.destroy(); // destroy old cropper if re-upload
				cropper = new Cropper(document.getElementById("signPreview"), {
					aspectRatio: 3 / 1, // signature box ratio
					viewMode: 1,
					autoCropArea: 1,
					movable: true,
					zoomable: true,
					scalable: false,
					rotatable: false
				});
				$("#cropBtn").show();
			};
			reader.readAsDataURL(file);
		}
	});

	// Crop & show on canvas
	$("#cropBtn").on("click", function () {
		const canvas = cropper.getCroppedCanvas({
			width: 300,
			height: 100
		});
		$("#signCanvas").show().attr("width", 300).attr("height", 100);
		const ctx = document.getElementById("signCanvas").getContext("2d");
		ctx.clearRect(0, 0, 300, 100);
		ctx.drawImage(canvas, 0, 0);

		// If you need final base64 string for saving to DB:
		const base64Image = canvas.toDataURL("image/png");
		// console.log("Signature Base64:", base64Image);
	});
	
	// Step 1: Load plants initially
	getAllPlantsInList("plantcodeinput");

	// Disable department and name initially
	$("#departmentinput").prop("disabled", true);
	$("#nameInput").prop("disabled", true);

	// Step 2: When a plant is selected, load its departments
	$("#plantcodeinput").on("change", function () {
	    const selectedPlant = $(this).val();

	    if (selectedPlant && selectedPlant !== "Select") {
	        $("#departmentinput").prop("disabled", false);
	        $("#nameInput").prop("disabled", true)
	            .empty()
	            .append('<option value="">Select User</option>');

	        // Load departments for this plant
	        getDepartmentsByPlant("departmentinput", selectedPlant);
	    } else {
	        // Reset both if no plant is selected
	        $("#departmentinput").prop("disabled", true)
	            .empty()
	            .append('<option value="">Select Dept</option>');
	        $("#nameInput").prop("disabled", true)
	            .empty()
	            .append('<option value="">Select User</option>');
	    }
	});

	// Step 3: When department changes, load names
	$("#departmentinput").on("change", function () {
	    const selectedPlant = $("#plantcodeinput").val();
	    const selectedDept = $(this).val();

	    if (selectedPlant && selectedDept) {
	        $("#nameInput").prop("disabled", false);
	        getUsersByPlantAndDepartment("nameInput", selectedPlant, selectedDept);
	    } else {
	        $("#nameInput").prop("disabled", true)
	            .empty()
	            .append('<option value="">Select User</option>');
	    }
	});


}


window.addExcelSign = addExcelSign;
function addExcelSign() {
	const plantCode = $("#plantcodeinput").val();
	const department = $("#departmentinput").val();
    const name = $("#nameInput").val();
	const createdBy = sessionStorage.getItem('employeeId');
	let signatureBase64 = "";
		const canvas = document.getElementById("signCanvas");
		if (canvas && canvas.toDataURL) {
			signatureBase64 = canvas.toDataURL("image/png");
		}

	if (!showMandatory(['#nameInput','#departmentinput','#plantcodeinput'])) {

		showErrorResponse("responseContainer", "Add these mandatory fields");
		return;// Stop execution
	}
	else {
		const formData = {
			plant:{plantCode: plantCode},
			department: {departmentId:department},
			user:{loginId: name},
		  signature: signatureBase64,
		  createdBy: createdBy
		};

		console.log(formData);

		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/insertExcelSignMaster',
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


window.editExcelSign = editExcelSign;
function editExcelSign() {

	const plantCode = $("#plantcodeinput").val();
		const department = $("#departmentinput").val();
	    const name = $("#nameInput").val();
	const createdBy = sessionStorage.getItem('employeeId');
	let signatureBase64 = "";
	    const canvas = document.getElementById("signCanvas");
	    // Only get base64 if user has actually uploaded/cropped new signature
	    if (canvas && canvas.style.display !== "none" && canvas.toDataURL) {
	        signatureBase64 = canvas.toDataURL("image/png");
	    }

	if (!showMandatory(['#nameInput','#designationinput'])) {

		showErrorResponse("responseContainer", "Add these mandatory fields");
		return;// Stop execution
	}
	else {
		
		const formData = {
		  excelSignId: excelSignId,
		  plant:{plantCode: plantCode},
		  			department: {departmentId:department},
		  			user:{loginId: name},
		  signature:signatureBase64,
		  createdBy: createdBy
		};

		console.log(formData);
		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/editExcelSignMaster',
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

window.deleteExcelSign = deleteExcelSign;
function deleteExcelSign() {

	if (deleteAllList.length >= 1) {


		console.log("del", deleteAllList);

		$('#delete').off('click').on('click', function() {

			$.ajax({
				type: 'post',
				url: '/WebApplication/Controllers/delete/deleteAllExcelSignMaster',
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

		$("#warningInformationModalBody").text("Please select row from table to delete mapping.");
		$("#warningBackdropButton").click();
	}

}