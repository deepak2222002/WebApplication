window.addEventListener('beforeunload', function(event) {
	event.preventDefault();
	event.returnValue = '';
	var confirmationMessage = 'Are you sure you want to leave?';
	(event || window.event).returnValue = confirmationMessage; // Standard
	return confirmationMessage; // For some older browsers
});

function logout() {
	window.location.replace("/WebApplication/traininglogin");
}


var languages = ["Select", "English", "Hindi"];
var examAndTrainingDetails = {

	trainingId: null,
	departmentId: null,
	department: "",
	traningName: "",
	trainingLanguage: "",
	trainingPageNumber: null,
	trainingType: "",
	examType: "",
	examLanguage: "",
	pageDescription: "",
	questionId: null,
	question: "",
	questionNumber: null,
	questionType: "",
	correctAnswer: "",
	givenAnswer: "",

}
var pageSize = 25;
var currentResource = 0;
var object;
var deleteAllList = [];
var currentRow;
var totalRows;
let interval;
let totalRowInterval;

$(document).ready(function() {
	$(document).on('click', '#createTrainingModel', function() {

		$("#offcanvasCloseButton").click();
		$("#masterHeading").text("TRAINING & EXAM MODEL");

		createFirstPage();

	});
});


$(document).ready(function() {
	$(document).on('click', '#allTrainingModel', function() {

		resetAllDetails();

		$("#offcanvasCloseButton").click();
		$("#masterHeading").text("ALL TRAINING MODEL");

		$("#div3").empty();

		var searchContainer = document.createElement("div");
		searchContainer.setAttribute("class", "container d-flex justify-content-between align-items-center")
		$("#div3").append(searchContainer);

		var file = ["id", "searchTrainingExam", "type", "text", "name", "search", "class", "inputs m-2", "placeholder", "Search", "style", "height:40px; width:90%; font-size:20px;"];

		createInput(file, searchContainer, "Search Training and Exam.")

		var searchButtonAttr = ["id", "searchTrainingExamButton", "class", "btn btn-primary"];

		createButton(searchButtonAttr, searchContainer, "Search")

		var container = '<div class="w-100">' +
			'<div id="modelContainer" class="row">' +
			'</div>' +
			'</div>';

		$("#div3").append(container);

		getAllTrainingModel();

	});
});


$(document).ready(function() {
	$(document).on('click', '#userAndTrainingAssign', function() {

		resetAllDetails();

		$("#offcanvasCloseButton").click();
		$("#masterHeading").text("USER & TRAINING MAPPING");

		$("#div3").empty();

		var pagerContainer = document.createElement("div");
		pagerContainer.setAttribute("id", "pagerContainer")
		$("#div3").append(pagerContainer);

		makePagerBody("pagerContainer");

		var tableContainer = document.createElement("div");
		tableContainer.setAttribute("id", "tableContainer")
		$("#div3").append(tableContainer);

		var headerList = ["S.No", "Name", "Contact", "Email", "User", "Training Name", "Exam Name", "Exam Type", "Traing & Exam Status"];
		var searchList = ["searchName", "searchContact", "searchEmail", "searchUser", "searchTrainingName", "searchExamName", "searchExamType"];
		makeTable(headerList, searchList, "tableContainer", "table2", "100%");

		var buttonContainer = document.createElement("div");
		buttonContainer.setAttribute("class", "buttonContainer d-flex justify-content-start align-items-center")
		$("#div3").append(buttonContainer);

		var addAttr = ["id", "add", "class", "addEditDelete btn btn-dark mx-3"];

		createButton(addAttr, buttonContainer, "Add"); 

		var editAttr = ["id", "edit", "class", "addEditDelete btn btn-dark mx-3"];

		createButton(editAttr, buttonContainer, "Edit");

		var deleteAttr = ["id", "delete", "class", "btn btn-dark mx-3"];

		createButton(deleteAttr, buttonContainer, "Delete");

		var templateAttr = ["id", "templateButton", "class", "btn btn-dark mx-3 downloadTemplate"];

		createButton(templateAttr, buttonContainer, "Download Template");

		var downloadExcelAttr = ["id", "excelButton", "class", "btn btn-dark mx-3 downloadExcel"];

		createButton(downloadExcelAttr, buttonContainer, "Download Excel");

		var uploadExcelAttr = ["id", "uploadButton", "class", "btn btn-dark mx-3 uploadExcel"];

		createButton(uploadExcelAttr, buttonContainer, "Upload Excel");
		
		var showExamAttemptAttr = ["id", "showAttemptExamButton", "class", "btn btn-dark mx-3"];

		createButton(showExamAttemptAttr, buttonContainer, "Show Attempt Exam");


		loadLikeTrainingAndUser(0);


	});
});


$(document).ready(function() {
	$(document).on('click', '#departmentMaster', function() {

		resetAllDetails();

		$("#offcanvasCloseButton").click();
		$("#masterHeading").text("DEPARTMENT MASTER");

		$("#div3").empty();

		var pagerContainer = document.createElement("div");
		pagerContainer.setAttribute("id", "pagerContainer")
		$("#div3").append(pagerContainer);

		makePagerBody("pagerContainer");

		var tableContainer = document.createElement("div");
		tableContainer.setAttribute("id", "tableContainer")
		$("#div3").append(tableContainer);

		var headerList = ["S.No", "Department", "created By", "Date Time"];
		var searchList = ["searchDepartment"];
		makeTable(headerList, searchList, "tableContainer", "table2", "100%");

		var buttonContainer = document.createElement("div");
		buttonContainer.setAttribute("class", "buttonContainer d-flex justify-content-start align-items-center")
		$("#div3").append(buttonContainer);

		var addAttr = ["id", "add", "class", "addEditDelete btn btn-dark mx-3"];

		createButton(addAttr, buttonContainer, "Add");

		var editAttr = ["id", "edit", "class", "addEditDelete btn btn-dark mx-3"];

		createButton(editAttr, buttonContainer, "Edit");

		var deleteAttr = ["id", "delete", "class", "btn btn-dark mx-3"];

		createButton(deleteAttr, buttonContainer, "Delete");

		loadLikeDepartmentMasterData(0);


	});
});



$(document).ready(function() {
	$(document).on('click', '#questionMaster', function() {

		resetAllDetails();

		$("#offcanvasCloseButton").click();
		$("#masterHeading").text("QUESTION MASTER");

		$("#div3").empty();

		var pagerContainer = document.createElement("div");
		pagerContainer.setAttribute("id", "pagerContainer")
		$("#div3").append(pagerContainer);

		makePagerBody("pagerContainer");

		var tableContainer = document.createElement("div");
		tableContainer.setAttribute("id", "tableContainer")
		$("#div3").append(tableContainer);

		var headerList = ["S.No", "Question Type", "Question & Answer", "Options", "Correct Answer", "created By", "Date Time"];
		var searchList = ["searchQuestionType", "searchQuestion", "searchOption"];
		makeTable(headerList, searchList, "tableContainer", "table2", "100%");

		var buttonContainer = document.createElement("div");
		buttonContainer.setAttribute("class", "buttonContainer d-flex justify-content-start align-items-center")
		$("#div3").append(buttonContainer);

		var addAttr = ["id", "add", "class", "addEditDelete btn btn-dark mx-3"];

		createButton(addAttr, buttonContainer, "Add");

		var editAttr = ["id", "edit", "class", "addEditDelete btn btn-dark mx-3"];

		createButton(editAttr, buttonContainer, "Edit");

		var deleteAttr = ["id", "delete", "class", "btn btn-dark mx-3"];

		createButton(deleteAttr, buttonContainer, "Delete");

		var templateAttr = ["id", "templateButton", "class", "btn btn-dark mx-3 downloadTemplate"];

		createButton(templateAttr, buttonContainer, "Download Template");

		var downloadExcelAttr = ["id", "excelButton", "class", "btn btn-dark mx-3 downloadExcel"];

		createButton(downloadExcelAttr, buttonContainer, "Download Excel");

		var uploadExcelAttr = ["id", "uploadButton", "class", "btn btn-dark mx-3 uploadExcel"];

		createButton(uploadExcelAttr, buttonContainer, "Upload Excel");

		loadLikeQuestionMasterData(0);

	});
});




function handlePageChange(newPage) {

	searchLoad = false;
	var text = $("#masterHeading").text();

	if (text == "USER & TRAINING MAPPING") {
		loadLikeTrainingAndUser(newPage);
	} else if (text == "DEPARTMENT MASTER") {
		loadLikeDepartmentMasterData(newPage);
	} else if (text == "QUESTION MASTER") {
		loadLikeQuestionMasterData(newPage);
	}
}

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


$(document).on("click", "#searchTrainingExamButton", function() {

	getAllTrainingModel();

});



$(document).on("change", "#input1", function() {

	var department = $("#input1 option:selected").text();
	$("#container11").text(department + " Department Training & Test");

});



$(document).on("change", "#input2", function() {

	var language = $("#input2 option:selected").text();
	$("#container13").text("Training Language : " + language);

});


$(document).on("change", "#input3", function() {

	var language = $("#input3 option:selected").text();
	$("#container14").text("Exam Language : " + language);

});




$(document).on("input", "#input4", function() {

	var trainingheading = $("#input4").val();
	$("#container24").text(trainingheading);
	examAndTrainingDetails.traningName = trainingheading;

});

$(document).on("input", "#input9", function() {

	var description = $("#input9").val();
	examAndTrainingDetails.pageDescription = description;

});


$(document).on("input", "#question", function() {

	var suggestions = [];
	const textarea = document.getElementById("question");
	const suggestionBox = document.getElementById("suggestions");

	var formData = {
		question: textarea.value,
	}
	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getAllQuestionInList',
		data: JSON.stringify(formData),
		contentType: "application/json",
		async: false,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {
			for (var i = 0; i < res.length; i++) {
				suggestions.push(res[i]);
			}
		}, error: function(response) {
			alert(response.responseText);
		}
	});


	const input = textarea.value;
	suggestionBox.innerHTML = ""; // Clear previous suggestions
	if (input) {
		suggestions.forEach(suggestion => {

			const li = document.createElement("li");
			var list = suggestion.split(",");
			li.textContent = list[1];
			li.style.cursor = "pointer";
			li.style.padding = "5px 15px";
			li.setAttribute("class", "questionList")
			li.setAttribute("id", "q" + list[0])

			li.addEventListener("click", function() {
				textarea.value = list[1];
				suggestionBox.style.display = "none"; // Hide the suggestions
			});

			suggestionBox.appendChild(li);
		});

		suggestionBox.style.display = suggestions.length ? "block" : "none";
		suggestionBox.style.left = textarea.offsetLeft + "px";
		suggestionBox.style.top = textarea.offsetTop + textarea.offsetHeight + "px";
	} else {
		suggestionBox.style.display = "none";
	}

});



$(document).on("click", ".questionList", function(event) {

	getQuestionById(event.target.id);


});



$(document).on("click", "input[name='examType']", function() {

	var examType = $("input[name='examType']:checked").val();
	examAndTrainingDetails.examType = examType;

});


$(document).on("click", "input[name='trainingType']", function() {

	var trainingType = $("input[name='trainingType']:checked").val();
	examAndTrainingDetails.trainingType = trainingType;

});


$(document).on("click", "input[name='correctOption']", function(event) {

	$('input[name="correctOption"]').prop('checked', false);
	$("#" + event.target.id).prop('checked', true)
	var correctAnswer = $("#option" + event.target.id).val();
	examAndTrainingDetails.correctAnswer = correctAnswer;

});

$(document).on("click", "input[name='questionType']", function() {

	var questionType = $("input[name='questionType']:checked").val();
	examAndTrainingDetails.questionType = questionType;

	if (questionType == "mcq") {
		makeMcqOptions()
	} else if (questionType == "written") {
		makeWrittenTextArea()
	} else if (questionType == "images") {
		makeImagesOption();
	}
});


$(document).on("click", "#createModule", function() {

	createModule();

});



$(document).on("click", "#submitAndPreviewQuestionPaper", function() {

	submitAndPreviewQuestionPaper();

});


$(document).on("click", "#searchButton", function() {

	handlePageChange(0);

});



$(document).on('click', '#table1 tbody tr', function() {
	$(this).addClass('selected').siblings().removeClass('selected');
	row = $(this);
	let rowValues = {};
	let temp;

	row.find('td').each(function() {
		temp = $(this);
		rowValues[temp.data('column')] = temp.text();
	});

	$(this).attr("style", "background-color:blue;color:white;");
	$(this).siblings().removeAttr("style");

	object = rowValues;

	$(".descriptionContainer").text(object.resDescription);
	showVideoAurImage(rowValues);

});

$(document).on('dblclick', '#table2 tbody tr', function() {
	$(this).addClass('selected').siblings().removeClass('selected');
	row = $(this);
	let rowValues = {};
	let temp;

	row.find('td').each(function() {
		temp = $(this);
		rowValues[temp.data('column')] = temp.text();
	});


	object = rowValues;

	var text = $("#masterHeading").text();
	if (text == "USER & TRAINING MAPPING") {

		if (deleteAllList.includes(rowValues.trainingUserId) == false) {
			deleteAllList.push(rowValues.trainingUserId);
			$(this).attr("style", "background-color:blue;color:white;");
		}
	} else if (text == "QUESTION MASTER") {

		if (deleteAllList.includes(rowValues.questionId) == false) {
			deleteAllList.push(rowValues.questionId);
			$(this).attr("style", "background-color:blue;color:white;");
		}
	}

});



$(document).on('click', '#table2 tbody tr', function(event) {

	$(this).addClass('selected').siblings().removeClass('selected');
	row = $(this);
	let rowValues = {};
	let temp;

	row.find('td').each(function() {
		temp = $(this);
		rowValues[temp.data('column')] = temp.text();
	});

	object = rowValues;

	if (event.ctrlKey) {

		var text = $("#masterHeading").text();
		if (text == "USER & TRAINING MAPPING") {

			if (deleteAllList.includes(rowValues.trainingUserId) == false) {
				deleteAllList.push(rowValues.trainingUserId);
				$(this).attr("style", "background-color:blue;color:white;");
			}
		} else if (text == "QUESTION MASTER") {

			if (deleteAllList.includes(rowValues.questionId) == false) {
				deleteAllList.push(rowValues.questionId);
				$(this).attr("style", "background-color:blue;color:white;");
			}
		}

	} else {
		$(this).siblings().removeAttr("style");
		deleteAllList = [];
		object = "";
	}

});




$(document).on("click", ".nextPreviousButton", function(event) {

	if (event.target.id == "next1") {

		var department = $("#input1 option:selected").text();
		var departmentId = $("#input1").val();
		var trainingLanguage = $("#input2 option:selected").text();
		var examLanguage = $("#input3 option:selected").text();

		if (!department || trainingLanguage == "Select" || examLanguage == "Select") {

			alert("Please select all the details to go to next page.")
			return;
		}


		examAndTrainingDetails.department = department;
		examAndTrainingDetails.departmentId = departmentId;
		examAndTrainingDetails.trainingLanguage = trainingLanguage;
		examAndTrainingDetails.examLanguage = examLanguage;

		$("#container2").empty();
		$("#container9").empty();

		createSecondPage();

	} else if (event.target.id == "next2") {

		$("#container2").empty();
		$("#container28").empty();
		createThirdPage();



	} else if (event.target.id == "next3") {

		$("#container2").empty();
		$("#container9").empty();
		createQuestionSample();



	} else if (event.target.id == "next4") {

		submitAndFinishTrainingAndExamModel();


	} else if (event.target.id == "nextQuestion") {

		addQuestionInModel();


	} else if (event.target.id == "previous2") {

		createFirstPage();

	} else if (event.target.id == "previous3") {

		$("#container2").empty();
		$("#container9").empty();
		createSecondPage();

	} else if (event.target.id == "previousQuestion") {

		$("#container2").empty();
		$("#container28").empty();
		createThirdPage();

	} else if (event.target.id == "previousRes") {

		pageNumber = currentResource - 1

		if (pageNumber > 0) {
			currentResource = currentResource - 1;
			getCurrentSaveResourcesInResourceContainer(currentResource);
		}


	} else if (event.target.id == "nextRes") {

		pageNumber = currentResource + 1

		if (pageNumber <= examAndTrainingDetails.trainingPageNumber) {
			currentResource = currentResource + 1;
			getCurrentSaveResourcesInResourceContainer(currentResource);

		}

	}

});

$(document).on("click", "#uploadTraingType", function() {

	uploadResources();

});


$(document).on("click", ".editTraining", function(event) {

	getModelAllDetail(event.target.id);

});


$(document).on("click", ".deleteQuestion", function(event) {

	deleteQuestionById(event.target.id);

});

$(document).on("click", ".addEditDelete", function(event) {

	showModal("addEditDeleteBackdropButton");

	var text = $("#masterHeading").text();

	if (text == "USER & TRAINING MAPPING") {

		makeModalInputs("addEditDeleteModalBody");
		if (event.target.id == "add") {
			setTextById("addEditDeleteBackdropLabel", "Add User & Training Mapping");
			setTextById("submit", "Add");
		} else if (event.target.id == "edit") {
			setTextById("addEditDeleteBackdropLabel", "Add User & Training Mapping");
			setTextById("submit", "Edit");
			$("#name").val(object.name);
			$("#contact").val(object.contact);
			$("#email").val(object.email);
			$("#user").val(object.user);
			$("#trainingName").val(object.trainingName);
		}

	} else if (text == "DEPARTMENT MASTER") {

		makeDepartmentModalInputs("addEditDeleteModalBody");
		if (event.target.id == "add") {
			setTextById("addEditDeleteBackdropLabel", "Add Department");
			setTextById("submit", "Add");
		} else if (event.target.id == "edit") {
			setTextById("addEditDeleteBackdropLabel", "Edit Department");
			setTextById("submit", "Edit");
			$("#department").val(object.departmentName);
		}
	} else if (text == "QUESTION MASTER") {

		makeQuestionModalInputs("addEditDeleteModalBody");

		if (event.target.id == "add") {
			setTextById("addEditDeleteBackdropLabel", "Add Question");
			setTextById("submit", "Add");
		} else if (event.target.id == "edit") {
			setTextById("addEditDeleteBackdropLabel", "Edit Question");
			setTextById("submit", "Edit");
			$("#question").val(object.question);

			$("#" + object.questionType).prop('checked', true);

			if (object.questionType == "mcq") {

				makeMcqOptions()

				var list = object.options.split("@");
				$("#option1").val(list[0]);
				$("#option2").val(list[1]);
				$("#option3").val(list[2]);
				$("#option4").val(list[3]);

				if (object.correctAnswer == list[0]) {
					$("#1").click();
				} else if (object.correctAnswer == list[1]) {
					$("#2").click();
				} else if (object.correctAnswer == list[2]) {
					$("#3").click();
				} else if (object.correctAnswer == list[3]) {
					$("#4").click();
				}

			} else if (object.questionType == "written") {

				makeWrittenTextArea()
				$("#writtenAnswer").val(object.options);

			} else if (object.questionType == "images") {

				makeImagesOption();

			}

		}
	}

});


$(document).on("click", "#submit", function(event) {

	var buttonText = $(event.target).text();
	var text = $("#masterHeading").text();

	if (text == "USER & TRAINING MAPPING") {

		if (buttonText == "Add") {
			addTrainingAndUser();
		} else if (buttonText == "Edit") {
			editTrainingAndUser();
		}

	} else if (text == "DEPARTMENT MASTER") {


	} else if (text == "QUESTION MASTER") {

		if (buttonText == "Add") {
			addQuestionMaster();
		} else if (buttonText == "Edit") {
			editQuestionMaster();
		}
	}

});


$(document).on("click", "#delete", function(event) {

	var text = $("#masterHeading").text();
	if (text == "USER & TRAINING MAPPING") {
		deleteAllUserAndTraining();
	} else if (text == "QUESTION MASTER") {
		deleteAllQuestion();
	}

});


$(document).on("click", ".downloadTemplate", function(event) {

	var text = $("#masterHeading").text();
	if (text == "USER & TRAINING MAPPING") {

		downloadTrainingAndUserTempate();


	} else if (text == "QUESTION MASTER") {

		downloadQuestionMasterTemplate();

	}

});



$(document).on("click", ".downloadExcel", function(event) {

	var text = $("#masterHeading").text();
	if (text == "USER & TRAINING MAPPING") {


	} else if (text == "QUESTION MASTER") {

		downloadQuestionMasterTemplate();

	}

});




$(document).on("click", ".uploadExcel", function() {

	$("#uploadImage").attr("src", "/WebApplication/images/uploadexcel.png");
	$("#upload").removeAttr("style");
	$("#uploadExcel").removeAttr("style");
	$("#uploadCloseButton").attr("style", "background: transparent; height: 30px; width: 30px; border: 0px;");
	$("#uploadWaiting").attr("style", "display:none");
	$("#uploadExcel").val(null);

	showModal("uploadBackdropButton");

});


$(document).on("click", "#upload", function() {

	var text = $("#masterHeading").text();
	if (text == "USER & TRAINING MAPPING") {
		
		uploadTrainingAndUser();

	} else if (text == "QUESTION MASTER") {

		uploadQuestionMaster()

	}

});


$(document).on("change", "#pageSize", function() {

	pageSize = parseInt($(this).val());

	handlePageChange(0);

});

$(document).on('click', '.deleteResource', function() {

	var row = $(this).parents(".tableDataRows");
	let rowValues = {};
	let temp;

	row.find('td').each(function() {
		temp = $(this);
		rowValues[temp.data('column')] = temp.text();
	});

		var targetButtonId = $(this).parents(".tableDataRows").closest('tr').children("td").find('.deleteResource').attr('id');
		
		console.log(targetButtonId);
		
		var targetDataArray = targetButtonId.match(/[a-z]+|[^a-z]+/gi);

		var formData = {
			trainingPageId: targetDataArray[1],
		};


		$.ajax({
			type: 'POST',
			url: '/WebApplication/Controllers/deleteResource',
			async: false,
			data: JSON.stringify(formData),
			contentType: "application/json",
			headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
			success: function(response) {
				
				alert(response);
				getAllSaveResourcesInResourceContainer();
				
				setTimeout(function(){
					$("#container26").empty();
				},500);
				

			}, error: function(response) {
				alert(response.responseText);
			}

		});


	

});


$(document).on('click', '.up, .down', function() {

	var row = $(this).parents(".tableDataRows");
	let rowValues = {};
	let temp;

	row.find('td').each(function() {
		temp = $(this);
		rowValues[temp.data('column')] = temp.text();
	});


	if ($(this).is(".up")) {
		var targetButtonId = $(this).parents(".tableDataRows").closest('tr').prev('tr').children("td").find('.up').attr('id');
		var targetDataArray = targetButtonId.match(/[a-z]+|[^a-z]+/gi);

		var selfButtonId = $(this).attr("id");
		var selfDataArray = selfButtonId.match(/[a-z]+|[^a-z]+/gi);


		var selftrainingPageId = selfDataArray[1];
		var targettrainingPageId = targetDataArray[1];


		var selfPageNumber = parseInt(rowValues.resPageNumber) - 1
		var selfTargetPageNumber = rowValues.resPageNumber;


		var formData = {
			traningPageType: selftrainingPageId + ";" + targettrainingPageId,
			traningResourcePath: selfPageNumber + ";" + selfTargetPageNumber
		};


		$.ajax({
			type: 'POST',
			url: '/WebApplication/Controllers/updateResourcePageNumber',
			async: false,
			data: JSON.stringify(formData),
			contentType: "application/json",
			headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
			success: function(response) {

			}, error: function(response) {
				alert(response.responseText);
			}

		});


		getAllSaveResourcesInResourceContainer();

	} else {

		var targetButtonId = $(this).parents(".tableDataRows").closest('tr').next('tr').children("td").find('.up').attr('id');
		var targetDataArray = targetButtonId.match(/[a-z]+|[^a-z]+/gi);

		var selfButtonId = $(this).attr("id");
		var selfDataArray = selfButtonId.match(/[a-z]+|[^a-z]+/gi);


		var selftrainingPageId = selfDataArray[1];
		var targettrainingPageId = targetDataArray[1];


		var selfPageNumber = parseInt(rowValues.resPageNumber) + 1;
		var selfTargetPageNumber = rowValues.resPageNumber;


		var formData = {
			traningPageType: selftrainingPageId + ";" + targettrainingPageId,
			traningResourcePath: selfPageNumber + ";" + selfTargetPageNumber
		};


		$.ajax({
			type: 'POST',
			url: '/WebApplication/Controllers/updateResourcePageNumber',
			async: false,
			data: JSON.stringify(formData),
			contentType: "application/json",
			headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
			success: function(response) {

			}, error: function(response) {
				alert(response.responseText);
			}

		});

		getAllSaveResourcesInResourceContainer();
	}


});

function getQuestionById(id) {

	const questionId = id.match(/\d+/);

	var formData = {
		questionId: questionId[0],
	}
	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getQuestionAllDetailsById',
		data: JSON.stringify(formData),
		contentType: "application/json",
		async: false,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {

			insertQuestion(res[0]);

		}, error: function(response) {
			alert(response.responseText);
		}
	});
}


function insertQuestion(questionObject) {

	if (questionObject.questionType == "mcq") {

		$("#" + "mcq").prop('checked', true);
		makeMcqOptions();
		fillOptions(questionObject.givenAnswer, questionObject.correctAnswer);
		examAndTrainingDetails.questionType = "mcq";

	} else if (questionObject.questionType == "written") {

		$("#" + "written").prop('checked', true);
		makeWrittenTextArea();
		$("#" + "writtenAnswer").val(questionObject.givenAnswer);
		examAndTrainingDetails.questionType = "written";

	}


}

function fillOptions(givenAnswer, correctAnswer) {

	var list = givenAnswer.split("@");
	for (var i = 0; i < list.length; i++) {

		$("#option" + (i + 1)).val(list[i]);

		if (list[i] == correctAnswer) {
			$("#" + (i + 1)).prop('checked', true);
		}
	}

}

function createFirstPage() {

	$("#div3").empty();

	var container1 = document.createElement("div");
	var container2 = document.createElement("div");
	var container3 = document.createElement("div");
	var container4 = document.createElement("div");
	var container5 = document.createElement("div");
	var container6 = document.createElement("div");
	var container7 = document.createElement("div");
	var container8 = document.createElement("div");
	var container9 = document.createElement("div");
	var container10 = document.createElement("div");
	var container11 = document.createElement("div");
	var container12 = document.createElement("div");
	var container13 = document.createElement("div");
	var container14 = document.createElement("div");


	container1.setAttribute("class", "d-flex");

	container2.setAttribute("id", "container2");
	container2.setAttribute("class", "position-relative");
	container3.setAttribute("id", "container3");
	container4.setAttribute("id", "container4");
	container4.setAttribute("class", "dataContainer headingContainer d-flex justify-content-center align-items-center");
	container5.setAttribute("id", "container5");
	container5.setAttribute("class", "dataContainer");
	container6.setAttribute("id", "container6");
	container6.setAttribute("class", "dataContainer");
	container7.setAttribute("id", "container7");
	container7.setAttribute("class", "dataContainer");
	container8.setAttribute("id", "container8");
	container8.setAttribute("class", "dataContainer d-flex justify-content-end align-items-center p-3 position-absolute bottom-0");
	container9.setAttribute("id", "container9");
	container9.setAttribute("class", "examPageContainer");
	container10.setAttribute("id", "container10");
	container10.setAttribute("class", "companyLogo");
	container11.setAttribute("id", "container11");
	container11.setAttribute("class", "departmentTrainingTest d-flex justify-content-center align-items-center");
	container12.setAttribute("id", "container12");
	container12.setAttribute("class", "dataContainer");
	container13.setAttribute("id", "container13");
	container13.setAttribute("class", "dataContainer float-start");
	container14.setAttribute("id", "container14");
	container14.setAttribute("class", "dataContainer float-start");


	$("#div3").append(container1);
	container1.append(container2, container3);
	container2.append(container4, container5, container6, container7, container8)

	container4.append("Select Department, Training & Exam Language")

	var selectDepartment = document.createElement("select");
	var selectDepartmentAttr = ["id", "input1", "name", "department", "class", "mb-3 p-1", "style", "width:100%; height:50px;"];

	for (var i = 0; i <= selectDepartmentAttr.length - 1; i = i + 2) {
		for (var j = 0; j <= i; j = j + 2) {
			selectDepartment.setAttribute(selectDepartmentAttr[i], selectDepartmentAttr[j + 1]);
		}
	}

	container5.append("Select Department", selectDepartment);


	var selectLanguage = document.createElement("select");
	var selectLanguageAttr = ["id", "input2", "name", "language", "class", "mb-3 p-1", "style", "width:100%; height:50px;"];

	for (var i = 0; i <= selectLanguageAttr.length - 1; i = i + 2) {
		for (var j = 0; j <= i; j = j + 2) {
			selectLanguage.setAttribute(selectLanguageAttr[i], selectLanguageAttr[j + 1]);
		}
	}

	container6.append("Select Training Language", selectLanguage);


	var selectExamLanguage = document.createElement("select");
	var selectExamLanguageAttr = ["id", "input3", "name", "language", "class", "mb-3 p-1", "style", "width:100%; height:50px;"];

	for (var i = 0; i <= selectExamLanguageAttr.length - 1; i = i + 2) {
		for (var j = 0; j <= i; j = j + 2) {
			selectExamLanguage.setAttribute(selectExamLanguageAttr[i], selectExamLanguageAttr[j + 1]);
		}
	}

	container7.append("Select Exam Language", selectExamLanguage);


	var buttonNext = document.createElement("button");
	buttonNext.innerText = "NEXT"
	var buttonNextAttr = ["id", "next1", "class", "btn btn-dark nextPreviousButton"];

	for (var i = 0; i <= buttonNextAttr.length - 1; i = i + 2) {
		for (var j = 0; j <= i; j = j + 2) {
			buttonNext.setAttribute(buttonNextAttr[i], buttonNextAttr[j + 1]);
		}
	}

	container8.append(buttonNext);
	container3.append(container9);


	container9.append(container10, container11, container12, container13, container14);
	container12.append("* Please read and learn all the training part to clear exam successfully.");

	getAllDepartmentInList("input1");
	getAllLanguageInList("input2");
	getAllLanguageInList("input3");

	updateFirstPage();


}


function updateFirstPage() {

	if (examAndTrainingDetails.departmentId == null) {
		$('#input1 option:nth-child(1)').prop('selected', true);
	} else {

		$("#input1").val(examAndTrainingDetails.departmentId);

		var department = $("#input1 option:selected").text();
		$("#container11").text(department + " Department Training & Test");
	}

	if (examAndTrainingDetails.trainingLanguage == "") {
		$("#input2").val("Select");
	} else {

		$("#input2").val(examAndTrainingDetails.trainingLanguage);

		var language = $("#input2 option:selected").text();
		$("#container13").text("Training Language : " + language);
	}

	if (examAndTrainingDetails.trainingLanguage == "") {
		$("#input3").val("Select");
	} else {

		$("#input3").val(examAndTrainingDetails.examLanguage);

		var language = $("#input3 option:selected").text();
		$("#container14").text("Exam Language : " + language);
	}

}


function createSecondPage() {


	var container15 = document.createElement("div");
	var container16 = document.createElement("div");
	var container17 = document.createElement("div");
	var container18 = document.createElement("div");
	var container19 = document.createElement("div");
	var container20 = document.createElement("div");
	var container21 = document.createElement("div");
	var container22 = document.createElement("div");
	var container23 = document.createElement("div");
	var container24 = document.createElement("div");
	var container25 = document.createElement("div");
	var container25 = document.createElement("div");
	var container26 = document.createElement("div");
	var container27 = document.createElement("div");
	var container28 = document.createElement("div");
	var container29 = document.createElement("div");
	var container30 = document.createElement("div");
	var container31 = document.createElement("div");



	container15.setAttribute("id", "container15");
	container15.setAttribute("class", "dataContainer headingContainer d-flex justify-content-center align-items-center");
	container16.setAttribute("id", "container16");
	container16.setAttribute("class", "dataContainer mt-3");
	container17.setAttribute("id", "container17");
	container18.setAttribute("id", "container18");
	container18.setAttribute("class", "dataContainer mt-3");
	container19.setAttribute("id", "container19");
	container19.setAttribute("class", "dataContainer d-flex justify-content-between align-items-center");
	container20.setAttribute("id", "container20");
	container20.setAttribute("class", "dataContainer mt-5");
	container21.setAttribute("id", "container21");
	container21.setAttribute("class", "dataContainer mt-3");
	container22.setAttribute("id", "container22");
	container22.setAttribute("class", "dataContainer d-flex justify-content-between align-items-center");
	container23.setAttribute("id", "container23");
	container23.setAttribute("class", "dataContainer d-flex justify-content-between align-items-center p-3 position-absolute bottom-0");
	container24.setAttribute("id", "container24");
	container24.setAttribute("class", "dataContainer traningHeading d-flex justify-content-center m-1");
	container25.setAttribute("id", "container25");
	container25.setAttribute("class", "dataContainer d-flex justify-content-start m-2");
	container26.setAttribute("id", "container26");
	container26.setAttribute("class", "dataContainer resourceContainer");
	container27.setAttribute("id", "container27");
	container27.setAttribute("class", "dataContainer descriptionContainer bottom-0");
	container28.setAttribute("id", "container28");
	container28.setAttribute("class", "dataContainer d-flex justify-content-between align-items-center p-3");
	container29.setAttribute("id", "container29");
	container30.setAttribute("id", "container30");

	$("#container2").append(container15, container16, container21, container22, container25, container17, container23)

	container15.append("Create Training Model & Add Training Resources")

	var trainingHeadingAttr = ["id", "input4", "type", "text", "name", "trainingHeading", "class", "inputs", "style", "font-size: 20px; width:100%; height:50px;"];

	createInput(trainingHeadingAttr, container16, "Training Heading")

	container17.append(container20, container18, container19);

	container18.append("Select Training Resources :")

	var radio1 = ["id", "input5", "type", "radio", "name", "trainingType", "class", "inputs m-3", "style", "width:20px; height:20px;", "value", "video", "disabled", "disabled"];

	createInput(radio1, container19, "Video")

	var radio2 = ["id", "input6", "type", "radio", "name", "trainingType", "class", "inputs m-3", "style", "width:20px; height:20px;", "value", "image", "disabled", "disabled"];

	createInput(radio2, container19, "Images")

	var radio3 = ["id", "input7", "type", "radio", "name", "trainingType", "class", "inputs m-3", "style", "width:20px; height:20px;", "value", "pdf", "disabled", "disabled"];

	createInput(radio3, container19, "PDF")

	var file = ["id", "input8", "type", "file", "name", "file", "class", "m-3", "style", "width:220px;", "disabled", "disabled"];

	createInput(file, container19, "")


	var uploadFiletAttr = ["id", "uploadTraingType", "class", "btn btn-dark", "disabled", "disabled"];

	createButton(uploadFiletAttr, container19, "Upload File")

	var description = ["id", "input9", "type", "text", "name", "department", "class", "inputs", "style", "font-size: 20px; width:100%; height:50px;", "disabled", "disabled"];

	createInput(description, container20, "Description", "disabled", "disabled")



	container21.append("Select Exam Type :")

	var radio4 = ["id", "input10", "type", "radio", "name", "examType", "class", "inputs m-3", "style", "width:20px; height:20px;", "value", "MCQ"];

	createInput(radio4, container22, "MCQ")

	var radio5 = ["id", "input11", "type", "radio", "name", "examType", "class", "inputs m-3", "style", "width:20px; height:20px;", "value", "Written"];

	createInput(radio5, container22, "Written")

	var radio6 = ["id", "input12", "type", "radio", "name", "examType", "class", "inputs m-3", "style", "width:20px; height:20px;", "value", "None"];

	createInput(radio6, container22, "None")


	var createModuleAttr = ["id", "createModule", "class", "btn btn-dark"];

	createButton(createModuleAttr, container22, "Create Model")


	var previouAttr = ["id", "previous2", "class", "btn btn-dark nextPreviousButton", "disabled", "disabled"];

	createButton(previouAttr, container23, "Previous")

	var nextAttr = ["id", "next2", "class", "btn btn-dark nextPreviousButton", "disabled", "disabled"];

	createButton(nextAttr, container23, "Next")


	/*	var previouResAttr = ["id", "previousRes", "class", "btn btn-dark nextPreviousButton"];
	
		createButton(previouResAttr, container28, "Previous")
	
		var nextResAttr = ["id", "nextRes", "class", "btn btn-dark nextPreviousButton"];
	
		createButton(nextResAttr, container28, "Next")*/


	$("#container9").append(container24, container26, container27);

	container24.append("Training Heading");

	container27.append("Training Resources Description Like Images, PDF, and Videos");


	updateSecondPage();

}



function updateSecondPage() {

	if (examAndTrainingDetails.traningName == "") {
		$("#input4").val("");
	} else {
		$("#input4").val(examAndTrainingDetails.traningName);
		$("#container24").text(examAndTrainingDetails.traningName);

	}

	if (examAndTrainingDetails.examType == "") {

	} else {
		$('input[name="examType"]').val([examAndTrainingDetails.examType]);

		enableTrainingResource();
	}

	if (examAndTrainingDetails.trainingId == null) {

	} else {

		setTextById("createModule", "Update Model");

	}

	currentResource = currentResource + 1;
	getCurrentSaveResourcesInResourceContainer(currentResource);

}



function createThirdPage() {


	var container31 = document.createElement("div");
	var container32 = document.createElement("div");
	var container33 = document.createElement("div");
	var container34 = document.createElement("div");
	var container35 = document.createElement("div");
	var container36 = document.createElement("div");
	var container37 = document.createElement("div");
	var container38 = document.createElement("div");
	var container39 = document.createElement("div");
	var container40 = document.createElement("div");


	container31.setAttribute("id", "container31");
	container31.setAttribute("class", "dataContainer headingContainer d-flex justify-content-center align-items-center");
	container32.setAttribute("id", "container32");
	container32.setAttribute("class", "dataContainer mt-3");
	container33.setAttribute("i", "container33");
	container33.setAttribute("class", "dataContainer d-flex justify-content-between align-items-center p-3 position-absolute bottom-0");
	container34.setAttribute("id", "container19");
	container34.setAttribute("class", "dataContainer d-flex justify-content-between align-items-center");
	container35.setAttribute("id", "container20");
	container35.setAttribute("class", "dataContainer mt-3");
	container36.setAttribute("id", "container21");
	container36.setAttribute("class", "dataContainer mt-3");
	container37.setAttribute("id", "container22");
	container37.setAttribute("class", "dataContainer d-flex justify-content-between align-items-center");
	container38.setAttribute("id", "container23");
	container38.setAttribute("class", "dataContainer d-flex justify-content-between my-3");
	container39.setAttribute("id", "container24");
	container39.setAttribute("class", "dataContainer traningHeading d-flex justify-content-center m-1");
	container40.setAttribute("id", "container25");

	$("#container2").append(container31, container32, container33)

	container31.append("Create Training Model & Exam Model")

	var headerList = ["S.No", "Resource", "Type", "Description", "Page Number", "Page Inter Change", "Delete"];
	var searchList = [];
	makeTable(headerList, searchList, "container32", "table1", "100%");

	var previouAttr = ["id", "previous3", "class", "btn btn-dark nextPreviousButton"];

	createButton(previouAttr, container33, "Previous")

	var nextAttr = ["id", "next3", "class", "btn btn-dark nextPreviousButton"];

	createButton(nextAttr, container33, "Next")

	getAllSaveResourcesInResourceContainer()


}


function createQuestionSample() {


	var container41 = document.createElement("div");
	var container42 = document.createElement("div");
	var container43 = document.createElement("div");
	var container44 = document.createElement("div");
	var container45 = document.createElement("div");
	var container51 = document.createElement("div");
	var container52 = document.createElement("div");
	var container53 = document.createElement("div");
	var container54 = document.createElement("div");


	container41.setAttribute("id", "container41");
	container41.setAttribute("class", "dataContainer headingContainer d-flex justify-content-center align-items-center");
	container42.setAttribute("id", "container42");
	container42.setAttribute("class", "dataContainer mt-1");
	container43.setAttribute("i", "container43");
	container43.setAttribute("class", "dataContainer mt-1");
	container44.setAttribute("id", "container44");
	container44.setAttribute("class", "dataContainer d-flex justify-content-start align-items-center");
	container45.setAttribute("id", "container45");
	container45.setAttribute("class", "dataContainer optionContainers mt-1");
	container51.setAttribute("id", "container51");
	container51.setAttribute("class", "dataContainer questionHeading");
	container52.setAttribute("id", "container52");
	container52.setAttribute("class", "dataContainer questionsContainer");
	container53.setAttribute("id", "container53");
	container53.setAttribute("class", "dataContainer d-flex justify-content-between align-items-center p-3 position-absolute bottom-0");
	container54.setAttribute("id", "container54");
	container54.setAttribute("class", "dataContainer");

	$("#container2").append(container41, container42, container43, container44, container45, container51, container53);
	$("#container9").append(container51, container52);

	container41.append("Make Question Paper");

	var questionBrowser = document.createElement("textarea");
	questionBrowserAttr = ["id", "question", "class", "questionArea p-3"];
	appendAttribute(questionBrowserAttr, questionBrowser);
	container42.append("Ques No.", questionBrowser);


	var dataList = document.createElement("ul");
	container42.append(dataList);

	dataListAttr = ["id", "suggestions"];
	appendAttribute(dataListAttr, dataList);

	container43.append("Answer Type");


	var mcqAttr = ["id", "mcq", "type", "radio", "name", "questionType", "class", "inputs m-3 ", "style", "width:20px; height:20px;", "value", "mcq"]

	createInput(mcqAttr, container44, "MCQ");

	var mcqAttr = ["id", "written", "type", "radio", "name", "questionType", "class", "inputs m-3", "style", "width:20px; height:20px;", "value", "written"]

	createInput(mcqAttr, container44, "Written");

	var imagesAttr = ["id", "written", "type", "radio", "name", "questionType", "class", "inputs m-3", "style", "width:20px; height:20px;", "value", "images"]

	createInput(imagesAttr, container44, "Images");


	container51.append(examAndTrainingDetails.department + " " + examAndTrainingDetails.examType + " Question Paper");


	var preQuestionAttr = ["id", "previousQuestion", "class", "btn btn-dark nextPreviousButton"];

	createButton(preQuestionAttr, container53, "Previous")

	var submitAndPreviewAttr = ["id", "submitAndPreviewQuestionPaper", "class", "btn btn-dark"];

	createButton(submitAndPreviewAttr, container53, "Submit And Preview Question Paper")

	var nextQuestionAttr = ["id", "nextQuestion", "class", "btn btn-dark nextPreviousButton"];

	createButton(nextQuestionAttr, container53, "Add Question")


	getAllQuestionByTrainingId("questionsContainer");


}

function getAllQuestionByTrainingId(containerClass) {

	formData = {

		trainingId: examAndTrainingDetails.trainingId,

	}

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getAllQuestionByTrainingId',
		data: JSON.stringify(formData),
		contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {

			insertAllQuestionInQuestionContainer(response, containerClass);

		},
		error: function(response) {

			alert(response.responseText);

		}
	});

}


function addQuestionWithImages(form_data2) {


	let form_data = new FormData();
	let option1 = $("#option1")[0].files;
	let option2 = $("#option2")[0].files;
	let option3 = $("#option3")[0].files;
	let option4 = $("#option4")[0].files;
	var imageStatus = true;

	if (examAndTrainingDetails.trainingPageNumber == null) {

		examAndTrainingDetails.trainingPageNumber = 1;
		currentResource = 1;
	} else {

		examAndTrainingDetails.trainingPageNumber++;

	}



	let form_data2_string = JSON.stringify(form_data2);
	form_data.append('jsonObject', form_data2_string);


	if (option1.length > 0 && option2.length > 0 && option3.length > 0 && option4.length > 0) {
		form_data.append('resource1', option1[0]);
		form_data.append('resource2', option2[0]);
		form_data.append('resource3', option3[0]);
		form_data.append('resource4', option4[0]);

		imageStatus = uploadQuestionWithResource(form_data);

		if (imageStatus == false) {
			return;
		}

	}

	getAllQuestionByTrainingId("questionsContainer");

}


function addQuestionInModel() {


	examAndTrainingDetails.question = $("#question").val();

	if (examAndTrainingDetails.question == "") {
		alert("Question is empty please fill question.");
		return;

	}

	if (examAndTrainingDetails.questionNumber == null) {
		examAndTrainingDetails.questionNumber = 1;
	} else {

		examAndTrainingDetails.questionNumber = examAndTrainingDetails.questionNumber + 1;
	}


	if (examAndTrainingDetails.questionType == "mcq") {

		var option1 = $("#option1").val();
		var option2 = $("#option2").val();
		var option3 = $("#option3").val();
		var option4 = $("#option4").val();

		if (!option1 || !option2 || !option3 || !option4) {

			alert("Please fill all the option to add question");
			return;
		}

		examAndTrainingDetails.givenAnswer = option1 + "@" + option2 + "@" + option3 + "@" + option4;

		if ($('input[name="correctOption"]:checked').length == 0) {

			alert("Please select correct option to add question.");
			return;

		}


	} else if (examAndTrainingDetails.questionType == "written") {

		var answer = $("#writtenAnswer").val();

		if (!answer) {

			alert("Please fill the answer to add question");
			return;
		}

		examAndTrainingDetails.givenAnswer = answer;
		examAndTrainingDetails.correctAnswer = answer;

	} else if (examAndTrainingDetails.questionType == "images") {

		if ($('input[name="correctOption"]:checked').length == 0) {

			alert("Please select correct option to add question.");
			return;

		}

		formData = {

			questionId: examAndTrainingDetails.questionId,
			question: examAndTrainingDetails.question,
			questionNumber: examAndTrainingDetails.questionNumber,
			questionType: examAndTrainingDetails.questionType,
			correctAnswer: examAndTrainingDetails.correctAnswer,
			givenAnswer: examAndTrainingDetails.givenAnswer,
			createdBy: sessionStorage.getItem('employeeId'),
			questionStatus: "0",
			trainingAndExamDetails: {
				trainingId: examAndTrainingDetails.trainingId

			}

		}

		addQuestionWithImages(formData);
		return;


	} else {

		alert("please select answer type to fill answer to add question.");
		return;

	}




	formData = {

		questionId: examAndTrainingDetails.questionId,
		question: examAndTrainingDetails.question,
		questionNumber: examAndTrainingDetails.questionNumber,
		questionType: examAndTrainingDetails.questionType,
		correctAnswer: examAndTrainingDetails.correctAnswer,
		givenAnswer: examAndTrainingDetails.givenAnswer,
		createdBy: sessionStorage.getItem('employeeId'),
		questionStatus: "0",
		trainingAndExamDetails: {
			trainingId: examAndTrainingDetails.trainingId
		}


	}

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/addQuestionInModel',
		data: JSON.stringify(formData),
		contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {

			alert(response);
			getAllQuestionByTrainingId("questionsContainer");

		},
		error: function(response) {

			alert(response.responseText);

		}
	});


}

function insertAllQuestionInQuestionContainer(response, containerId) {

	$("." + containerId).empty();

	for (var i = 0; i < response.length; i++) {

		var data = response[i].split(";");
		var option = data[3].split("@")

		var options = getOptionByList(option);

		var row = '<div class="mt-3" style="min-height: 120px;">' +
			'<div class=""></div>' +
			'<div class="d-flex justify-content-center align-items-center">' +
			'<div class="questionNoContainer">' + (i + 1) + '</div>' + '<div class="quesContainer d-flex justify-content-between align-items-center">' + data[1] + ' <button id="' + data[0] + '" class="btn btn-dark deleteQuestion">Delete</button></div>' +
			'</div>' +
			'<div>' +
			options +
			'</div>' +
			'</div>';

		$("." + containerId).append(row);
	}

}

function getOptionByList(option) {

	var options = '';

	for (var i = 0; i < option.length; i++) {

		options = options + '<div class="option"> • ' + option[i] + '</div>';

	}

	return options;

}


function submitAndPreviewQuestionPaper() {

	$("#div3").empty();

	var container61 = document.createElement("div");
	var container62 = document.createElement("div");
	var container63 = document.createElement("div");
	var container64 = document.createElement("div");
	var container65 = document.createElement("div");


	container61.setAttribute("id", "container41");
	container61.setAttribute("class", "dataContainer headingContainer d-flex justify-content-center align-items-center");

	container62.setAttribute("id", "container62");
	container62.setAttribute("class", "dataContainer questionsContainer");

	container63.setAttribute("id", "container63");
	container63.setAttribute("class", "dataContainer mt-3 d-flex justify-content-end align-items-center p-3 position-absolute bottom-0 my-3");

	$("#div3").append(container61, container62, container63);

	container61.append("Question Paper Preview");

	getAllQuestionByTrainingId("questionsContainer");


	var nextQuestionAttr = ["id", "next4", "class", "btn btn-dark nextPreviousButton"];

	createButton(nextQuestionAttr, container63, "Submit And Finish Training and Exam Model")


}



function makeMcqOptions() {

	$("#container45").empty();

	var container46 = document.createElement("div");
	var container47 = document.createElement("div");
	var container48 = document.createElement("div");
	var container49 = document.createElement("div");
	var container50 = document.createElement("div");

	container46.setAttribute("id", "container46");
	container46.setAttribute("class", "dataContainer smallContainer mt-1");
	container47.setAttribute("id", "container47");
	container47.setAttribute("class", "dataContainer smallContainer mt-1");
	container48.setAttribute("id", "container48");
	container48.setAttribute("class", "dataContainer smallContainer mt-1");
	container49.setAttribute("id", "container49");
	container49.setAttribute("class", "dataContainer smallContainer mt-1");
	container50.setAttribute("id", "container50");
	container50.setAttribute("class", "dataContainer smallContainer mt-1");


	$("#container45").append(container46, container47, container48, container49, container50);

	var optionAttr = ["id", "1", "type", "checkbox", "name", "correctOption", "style", "width:15px; height:15px; margin-left:20px;"];

	createInput(optionAttr, container46, "Option : 1");

	var mcqAttr = ["id", "option1", "type", "text", "name", "option", "class", "inputs mt-1", "style", "width:100%;"]

	createInput(mcqAttr, container46, "");

	var optio2Attr = ["id", "2", "type", "checkbox", "name", "correctOption", "style", "width:15px; height:15px; margin-left:20px;"];

	createInput(optio2Attr, container47, "Option : 2");

	var mcqAttr = ["id", "option2", "type", "text", "name", "option", "class", "inputs mt-1"]

	createInput(mcqAttr, container47, "");

	var optio3Attr = ["id", "3", "type", "checkbox", "name", "correctOption", "style", "width:15px; height:15px; margin-left:20px;"];

	createInput(optio3Attr, container48, "Option : 3");

	var mcqAttr = ["id", "option3", "type", "text", "name", "option", "class", "inputs mt-1"]

	createInput(mcqAttr, container48, "");

	var optio4Attr = ["id", "4", "type", "checkbox", "name", "correctOption", "style", "width:15px; height:15px; margin-left:20px;"];

	createInput(optio4Attr, container49, "Option : 4");

	var mcqAttr = ["id", "option4", "type", "text", "name", "option", "class", "inputs mt-1"]

	createInput(mcqAttr, container49, "");


}

function makeImagesOption() {

	$("#container45").empty();

	var container46 = document.createElement("div");
	var container47 = document.createElement("div");
	var container48 = document.createElement("div");
	var container49 = document.createElement("div");
	var container50 = document.createElement("div");

	container46.setAttribute("id", "container46");
	container46.setAttribute("class", "dataContainer smallContainer mt-1");
	container47.setAttribute("id", "container47");
	container47.setAttribute("class", "dataContainer smallContainer mt-1");
	container48.setAttribute("id", "container48");
	container48.setAttribute("class", "dataContainer smallContainer mt-1");
	container49.setAttribute("id", "container49");
	container49.setAttribute("class", "dataContainer smallContainer mt-1");
	container50.setAttribute("id", "container50");
	container50.setAttribute("class", "dataContainer smallContainer mt-1");



	$("#container45").append(container46, container47, container48, container49, container50);

	var optionAttr = ["id", "1", "type", "checkbox", "name", "correctOption", "style", "width:15px; height:15px; margin-left:20px;"];

	createInput(optionAttr, container46, "Option : 1");

	var mcqAttr = ["id", "option1", "type", "file", "name", "option", "class", "mt-1", "style", "width:100%;"]

	createInput(mcqAttr, container46, "");

	var optionAttr = ["id", "2", "type", "checkbox", "name", "correctOption", "style", "width:15px; height:15px; margin-left:20px;"];

	createInput(optionAttr, container47, "Option : 1");

	var mcqAttr = ["id", "option2", "type", "file", "name", "option", "class", "mt-1", "style", "width:100%;"]

	createInput(mcqAttr, container47, "");

	var optionAttr = ["id", "3", "type", "checkbox", "name", "correctOption", "style", "width:15px; height:15px; margin-left:20px;"];

	createInput(optionAttr, container48, "Option : 1");

	var mcqAttr = ["id", "option3", "type", "file", "name", "option", "class", "mt-1", "style", "width:100%;"]

	createInput(mcqAttr, container48, "");

	var optionAttr = ["id", "4", "type", "checkbox", "name", "correctOption", "style", "width:15px; height:15px; margin-left:20px;"];

	createInput(optionAttr, container49, "Option : 4");

	var mcqAttr = ["id", "option4", "type", "file", "name", "option", "class", "mt-1", "style", "width:100%;"]

	createInput(mcqAttr, container49, "");


}

function makeWrittenTextArea() {

	$("#container45").empty();

	var container46 = document.createElement("div");

	container46.setAttribute("id", "container46");
	container46.setAttribute("class", "dataContainer mt-1");



	$("#container45").append(container46);

	var AnswerBrowser = document.createElement("textarea");
	var AnswerBrowserAttr = ["id", "writtenAnswer", "class", "questionArea p-3"];
	appendAttribute(AnswerBrowserAttr, AnswerBrowser);
	container46.append("Answer", AnswerBrowser);

}



function makeTable(headerList, searchList, containerId, tableId, width) {

	var table = document.createElement("table");
	$("#" + containerId).append(table);
	table.setAttribute("id", tableId);
	table.setAttribute("style", "width:" + width)
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
		imgContainer.append(img);
		searchRow.append(imgContainer);

		for (var i = 0; i < searchList.length; i++) {
			var th = document.createElement("th");
			th.setAttribute("class", "tableheading");
			var input = document.createElement("input");
			input.setAttribute("name", searchList[i]);
			input.setAttribute("id", searchList[i]);
			input.setAttribute("class", "searchFilterClass inputs");
			th.append(input);
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





function getAllDepartmentInList(id) {

	$.ajax({
		type: 'get',
		url: '/WebApplication/Controllers/getAllDepartmentInList',
		async: false,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {

			for (var i = 0; i < response.length; i++) {
				var str = response[i];
				var id_product = str.split(',');

				for (var j = 0; j < id_product.length - 1; j++) {
					var row = '<option value="' + id_product[j] + '">' + id_product[j + 1] + '</option>';
					$('#' + id).append(row);
				}
			}
		},
		error: function(response) {
			alert(response.resposeText);
		}
	});
}


function getAllLanguageInList(id) {

	for (var i = 0; i < languages.length; i++) {

		var row = '<option value="' + languages[i] + '">' + languages[i] + '</option>';
		$('#' + id).append(row);

	}

}



function uploadTrainingResource(form_data) {

	var status = false;

	$.ajax({
		url: '/WebApplication/Controllers/uploadTrainingResource',
		type: 'POST',
		data: form_data,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		contentType: false,
		async: false,
		processData: false,
		success: function(response) {
			alert(response);
			status = true;
		},
		error: function(error) {

			alert(error.responseText);
			examAndTrainingDetails.trainingPageNumber--;
		}
	});
	return status;
}


function uploadQuestionWithResource(form_data) {

	var status = false;

	$.ajax({
		url: '/WebApplication/Controllers/uploadQuestionWithResource',
		type: 'POST',
		data: form_data,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		contentType: false,
		async: false,
		processData: false,
		success: function(response) {
			alert(response);
			status = true;
		},
		error: function(error) {

			alert(error.responseText);
		}
	});
	return status;
}


function uploadResources() {


	let form_data = new FormData();
	let form_data2 = {};
	let imageFile = $("#input8")[0].files;
	var imageStatus = true;

	if (examAndTrainingDetails.trainingPageNumber == null) {

		examAndTrainingDetails.trainingPageNumber = 1;
		currentResource = 1;
	} else {

		examAndTrainingDetails.trainingPageNumber++;

	}

	form_data2 = {
		trainingPageId: "",
		trainingPageNumber: examAndTrainingDetails.trainingPageNumber,
		traningPageType: examAndTrainingDetails.trainingType,
		description: examAndTrainingDetails.pageDescription,
		traningResourcePath: "",
		createdBy: sessionStorage.getItem('employeeId'),
		dateTime: "",
		trainingAndExamDetails: {
			trainingId: examAndTrainingDetails.trainingId,
		}

	}


	let form_data2_string = JSON.stringify(form_data2);
	form_data.append('form_data2', form_data2_string);


	if (imageFile.length > 0) {
		form_data.append('resource', imageFile[0]);
		imageStatus = uploadTrainingResource(form_data);

		if (imageStatus == false) {
			return;
		}

	}
	currentResource = examAndTrainingDetails.trainingPageNumber;
	getCurrentSaveResourcesInResourceContainer(currentResource);

}

function getCurrentSaveResourcesInResourceContainer(Resource) {

	formData = {

		trainingId: examAndTrainingDetails.trainingId,
		examCompleteStatus: Resource,

	}

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getCurrentSavedResourcesByTrainingId',
		data: JSON.stringify(formData),
		contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {

			showAllTheResources(response);

		},
		error: function(response) {

			alert(response.responseText);

		}
	});

}


function getAllSaveResourcesInResourceContainer() {

	formData = {

		trainingId: examAndTrainingDetails.trainingId,

	}

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getAllSavedResourcesByTrainingId',
		data: JSON.stringify(formData),
		contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {

			insertAllResourcesInTable(response, "table1");

		},
		error: function(response) {

			alert(response.responseText);

		}
	});

}

function insertAllResourcesInTable(response, table) {

	$('#' + table + "Body").empty();


	for (var i = 0; i < response.length; i++) {

		var data = response[i].split(";");

		var row = '<tr class="tableDataRows" ><td data-column="columnId" style="width:50px;">' + (i + 1) + '</td>'
			+ '<td data-column="resPath" class="textLeftAlign"  style="width:200px;">' + data[1] + '</td>'
			+ '<td data-column="resType" style="width:100px;">' + data[2] + '</td>'
			+ '<td data-column="resDescription" style="width:300px;">' + data[3] + '</td>'
			+ '<td data-column="resPageNumber" style="width:100px;">' + data[4] + '</td>'
			+ '<td data-column="id"><button class="up" id="up' + data[0] + '">'
			+ '</button><button class="down" id="down' + data[0] + '"></button></td>'
			+ '<td data-column="delete"><button class="deleteResource" id="deleteResource' + data[0] + '"></button></td> </tr>';

		$('#' + table).append(row);
	}

}




function showAllTheResources(response) {

	$(".resourceContainer").empty();

	for (var i = 0; i < response.length; i++) {

		var list = response[i].split(",");

		$(".descriptionContainer").text(list[4]);

		if (list[2].toLocaleLowerCase() == "video") {
			showVideo(list);
		} else {
			showImage(list)
		}
	}

}

function showVideo(list) {

	var videoContainer = document.createElement("video");
	var attr = ["id", "video" + list[1] + "", "height", "200", "width", "100%", "controls", "controls"]

	appendAttribute(attr, videoContainer);

	var source = document.createElement("source");
	var sourceAttr = ["src", "/WebApplication/trainingResouces/" + list[3] + ".mp4", "type", "video/mp4"]

	appendAttribute(sourceAttr, source);

	videoContainer.append(source);

	$(".resourceContainer").append(videoContainer);


	var myVideo = document.getElementById("video" + list[1]);
	playVideo(myVideo);

}

function appendAttribute(list, element) {

	for (var i = 0; i <= list.length - 1; i = i + 2) {
		for (var j = 0; j <= i; j = j + 2) {
			element.setAttribute(list[i], list[j + 1]);
		}
	}

}


function playVideo(video) {
	video.play();
}


function pauseVideo(video) {
	video.pause();
}


function restartVideo(video) {
	video.currentTime = 0;
	video.play();
}


function showImage(list) {

	var imageContainer = document.createElement("img");
	var attr = ["id", "image" + list[1] + "", "src", "/WebApplication/trainingResouces/" + list[3] + ".png", "width", "100%"]


	$(".resourceContainer").append(imageContainer);
	appendAttribute(attr, imageContainer);


}



function createInput(attr, containerId, heading) {

	var input = document.createElement("input");
	var Attr = attr;

	for (var i = 0; i <= Attr.length - 1; i = i + 2) {
		for (var j = 0; j <= i; j = j + 2) {
			input.setAttribute(Attr[i], Attr[j + 1]);
		}
	}

	containerId.append(heading, input);

}


function dataList(attr, containerId) {

	var input = document.createElement("datalist");
	var Attr = attr;

	for (var i = 0; i <= Attr.length - 1; i = i + 2) {
		for (var j = 0; j <= i; j = j + 2) {
			input.setAttribute(Attr[i], Attr[j + 1]);
		}
	}

	containerId.append(input);

}



function createButton(attr, containerId, text) {

	var button = document.createElement("button");
	button.innerText = text;
	var Attr = attr;

	for (var i = 0; i <= Attr.length - 1; i = i + 2) {
		for (var j = 0; j <= i; j = j + 2) {
			button.setAttribute(Attr[i], Attr[j + 1]);
		}
	}

	containerId.append(button);

}



function createModule() {


	if (examAndTrainingDetails.traningName == "" || examAndTrainingDetails.examType == "") {

		alert("Please fill the training name and select the Exam type to create Training model")
		return;
	}

	formData = {

		trainingId: examAndTrainingDetails.trainingId,
		traningName: examAndTrainingDetails.traningName,
		traningLanguageType: examAndTrainingDetails.trainingLanguage,
		examName: examAndTrainingDetails.traningName + " Test",
		examType: examAndTrainingDetails.examType,
		examLanguageType: examAndTrainingDetails.examLanguage,
		createdBy: sessionStorage.getItem('employeeId'),
		examCompleteStatus: "0",
		department: {
			departmentId: examAndTrainingDetails.departmentId
		}


	}

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/addTraningModule',
		data: JSON.stringify(formData),
		contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {

			alert(response.message);
			setTextById("createModule", "Update Model");
			examAndTrainingDetails.trainingId = response.id;
			enableTrainingResource();

		},
		error: function(response) {

			alert(response.responseText);

		}
	});

}

function submitAndFinishTrainingAndExamModel() {

	formData = {

		trainingId: examAndTrainingDetails.trainingId,
		examCompleteStatus: "1",

	}

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/submitAndFinishTrainingAndExamModel',
		data: JSON.stringify(formData),
		contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {

			alert(response);
			resetAllDetails();
			$(".list li:first a").click();

		},
		error: function(response) {

			alert(response.responseText);

		}
	});

}


function setTextById(id, text) {

	$("#" + id).text(text);

}


function enableTrainingResource() {

	$("#input5").removeAttr("disabled");
	$("#input6").removeAttr("disabled");
	$("#input7").removeAttr("disabled");
	$("#input8").removeAttr("disabled");
	$("#input9").removeAttr("disabled");
	$("#uploadTraingType").removeAttr("disabled");
	$("#next2").removeAttr("disabled");
	$("#previous2").removeAttr("disabled");
}



function showVideoAurImage(rowValues) {
	$("#container26").empty();

	if (rowValues.resType.toLowerCase() == "video") {

		var videoContainer = document.createElement("video");
		var attr = ["id", "video", "height", "200", "width", "100%", "controls", "controls"]

		appendAttribute(attr, videoContainer);

		var source = document.createElement("source");
		var sourceAttr = ["src", "/WebApplication/trainingResouces/" + rowValues.resPath + ".mp4", "type", "video/mp4"]

		appendAttribute(sourceAttr, source);

		videoContainer.append(source);

		$(".resourceContainer").append(videoContainer);


		var myVideo = document.getElementById("video");
		playVideo(myVideo);

	} else {


		var imageContainer = document.createElement("img");
		var attr = ["id", "image", "src", "/WebApplication/trainingResouces/" + rowValues.resPath + ".png", "width", "100%"]


		$(".resourceContainer").append(imageContainer);
		appendAttribute(attr, imageContainer);

	}

}


function resetAllDetails() {

	examAndTrainingDetails = {

		trainingId: null,
		departmentId: null,
		department: "",
		traningName: "",
		trainingLanguage: "",
		trainingPageNumber: null,
		trainingType: "",
		examType: "",
		examLanguage: "",
		pageDescription: "",
		questionId: null,
		question: "",
		questionNumber: null,
		questionType: "",
		correctAnswer: "",
		givenAnswer: "",

	}
	currentResource = 0;

}


function getAllTrainingModel() {

	var formData = {

		examName: $("#searchTrainingExam").val(),

	}

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getAllTrainingModel',
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {

			console.log(response);
			appendAllTheModelInBody(response);


		}, error: function(error) {
			/**/
		}
	});

}


function appendAllTheModelInBody(response) {

	$("#modelContainer").empty();


	for (var i = 0; i < response.length; i++) {

		var cardClass = getColorClassBYStatus(response[i].examCompleteStatus);

		var card = '<div class="col-md-3">' +
			'<div class="card my-3 ' + cardClass + '">' +
			'<div class="card-body" style="height:100px;">' +
			'<h5 class="card-title">Department - ' + (response[i].department.departmentName) + '</h5>' +
			'<p class="card-text">' + (response[i].traningName) + '</p>' +
			'</div>' +
			'<ul class="list-group list-group-flush">' +
			'<li class="list-group-item">Exam Type ' + (response[i].examType) + '</li>' +
			'<li class="list-group-item"><button id="' + response[i].trainingId + '" class="btn btn-dark editTraining">EDIT</button> <button class="btn btn-dark deleteTraining">Delete</button></li>' +
			'</ul>' +
			'</div>' +
			'</div>';

		$("#modelContainer").append(card);
	}
}

function getColorClassBYStatus(status) {

	if (status == "1") {
		return "bg-success text-white";
	} else if (status == "0") {
		return "bg-warning";
	}

}


function getModelAllDetail(trainingId) {

	var formData = {

		trainingId: trainingId,

	}

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getModelAllDetail',
		data: JSON.stringify(formData),
		contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {

			var list = response[0].split(",");

			examAndTrainingDetails.trainingId = parseInt(list[0]);
			examAndTrainingDetails.departmentId = parseInt(list[1]);
			examAndTrainingDetails.department = list[2];
			examAndTrainingDetails.traningName = list[3];
			examAndTrainingDetails.trainingLanguage = list[4];
			examAndTrainingDetails.trainingPageNumber = (list[5] == "null" ? null : parseInt(list[5]));
			examAndTrainingDetails.trainingType = list[6];
			examAndTrainingDetails.examType = list[7];
			examAndTrainingDetails.examLanguage = list[8];
			examAndTrainingDetails.pageDescription = list[9];
			examAndTrainingDetails.questionId = null;
			examAndTrainingDetails.question = list[11];
			examAndTrainingDetails.questionNumber = (list[12] == "null" ? null : parseInt(list[12]));
			examAndTrainingDetails.questionType = list[13];
			examAndTrainingDetails.correctAnswer = list[14];
			examAndTrainingDetails.givenAnswer = list[15];


			setTimeout(function() {

				$(".list li:first a").click();

			}, 200);

		}, error: function(error) {
			/**/
		}
	});

}



function deleteQuestionById(questionId) {

	var formData = {

		questionId: questionId,
	}

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/deleteQuestionById',
		data: JSON.stringify(formData),
		contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {

			alert(response);
			getAllQuestionByTrainingId("questionsContainer");

		}, error: function(error) {
			/**/
		}
	});
}

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
		'<div><button class="btn btn-dark" id="next">Next</button></div>' +
		'</div>';

	$("#" + container).append(pager);

}


function showModal(modalButton) {

	setTimeout(function() {
		$("#" + modalButton).click();
	}, 200);

}

function hideModal(modalButton) {

	setTimeout(function() {
		$("#" + modalButton).click();
	}, 200);

}


function makeModalInputs(modalBodyId) {

	$("#" + modalBodyId).empty();

	var container46 = document.createElement("div");
	var container47 = document.createElement("div");
	var container48 = document.createElement("div");
	var container49 = document.createElement("div");
	var container50 = document.createElement("div");

	container46.setAttribute("id", "container46");
	container46.setAttribute("class", "dataContainer smallContainer mt-1");
	container47.setAttribute("id", "container47");
	container47.setAttribute("class", "dataContainer smallContainer mt-1");
	container48.setAttribute("id", "container48");
	container48.setAttribute("class", "dataContainer smallContainer mt-1");
	container49.setAttribute("id", "container49");
	container49.setAttribute("class", "dataContainer smallContainer mt-1");
	container50.setAttribute("id", "container50");
	container50.setAttribute("class", "dataContainer smallContainer mt-1");



	$("#" + modalBodyId).append(container46, container47, container48, container49, container50);

	var nameAttr = ["id", "name", "type", "text", "name", "name", "class", "inputs m1"];

	createInput(nameAttr, container46, "Name");

	var contactAttr = ["id", "contact", "type", "text", "name", "contact", "class", "inputs m1"]

	createInput(contactAttr, container47, "Contact");

	var emailAttr = ["id", "email", "type", "text", "name", "email", "class", "inputs m1"]

	createInput(emailAttr, container48, "Email");

	var userAttr = ["id", "user", "type", "number", "name", "user", "class", "inputs m1"];

	createInput(userAttr, container49, "User / Contact");

	var trainingNameAttr = ["id", "trainingName", "type", "text", "name", "trainingName", "class", "inputs m1", "list", "trainingNameList"]

	createInput(trainingNameAttr, container50, "Training Name");

	var trainingListAttr = ["id", "trainingNameList"]

	dataList(trainingListAttr, container50);

	getAllTrainingInList("trainingNameList");


}

function makeDepartmentModalInputs(modalBodyId) {

	$("#" + modalBodyId).empty();

	var container46 = document.createElement("div");

	container46.setAttribute("id", "container46");
	container46.setAttribute("class", "dataContainer mt-1");


	$("#" + modalBodyId).append(container46);

	var nameAttr = ["id", "department", "type", "text", "name", "department", "class", "inputs m1"];

	createInput(nameAttr, container46, "Department Name");


}

async function makePagerByTotalPages(res, page) {

	var totalPages = res.totalPages;

	$("#pager").empty();

	for (var i = 0; i <= totalPages - 1; i++) {
		$("#pager").append("<option value='" + i + "'>" + (i + 1) + "</option>");
	}

	$("#pager").val(page);
}


function getAllTrainingInList(dataListId) {


	var formData = {
		examName: "",
	}

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getAllTrainingModel',
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {

			for (var i = 0; i < response.length; i++) {
				var row = '<option value="' + response[i].traningName + '"></option>';
				$('#' + dataListId).append(row);
			}

		}, error: function(error) {
			/**/
		}
	});

}


function loadLikeTrainingAndUser(page) {


	var name = $('input[name="searchName"]').val() ?? "";
	var contact = $('input[name="searchContact"]').val() ?? "";
	var user = $('input[name="searchUser"]').val() ?? "";
	var trainingName = $('input[name="searchTrainingName"]').val() ?? "";
	var examName = $('input[name="searchExamName"]').val() ?? "";
	var examType = $('input[name="searchexamType"]').val() ?? "";


	var formData = {
		name: name,
		contact: contact,
		user: user,
		trainingExamDetails: {
			traningName: trainingName,
			examName: examName,
			examType: examType,
		}
	}

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getUserAndTrainingMaster/' + page + '/' + pageSize,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {

			makePagerByTotalPages(res, page);
			insertTrainingAndUserMasterInTable(res.content);

		}, error: function(response) {
			$("#warningInformationModalBody").text(response.responseText);
			$("#warningBackdropButton").click();
		}
	});

}


function insertTrainingAndUserMasterInTable($item) {

	$("#table2Body").empty();

	var sequenceNumber = pageSize * parseInt($('#pager :selected').val());

	$.each($item, function(index, value) {

		var backgroundCOlor = getExamColorClassByStatus(value.examStatus);

		var row = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId">' + (sequenceNumber + 1) + '</td>'
			+ '<td data-column="name">' + (value.name == null ? "" : value.name) + '</td>'
			+ '<td data-column="contact">' + (value.contact == null ? '' : value.contact) + '</td>'
			+ '<td data-column="email" style="width:300px">' + (value.email == null ? '' : value.email) + '</td>'
			+ '<td data-column="user">' + (value.user == null ? '' : value.user) + '</td>'
			+ '<td data-column="trainingName"  style="width:300px">' + (value.trainingExamDetails == null ? '' : value.trainingExamDetails.traningName) + '</td>'
			+ '<td data-column="examName"  style="width:300px">' + (value.trainingExamDetails == null ? '' : value.trainingExamDetails.examName) + '</td>'
			+ '<td data-column="examType">' + (value.trainingExamDetails == null ? "" : value.trainingExamDetails.examType) + '</td>'
			+ '<td data-column="examStatus" class = "' + backgroundCOlor + '"></td>'
			+ '<td data-column="examStatus" style="display:none;">' + (value.examStatus == null ? "" : value.examStatus) + '</td>'
			+ '<td data-column="trainingUserId" style="display:none;">' + (value.trainingUserId == null ? "" : value.trainingUserId) + '</td></tr>';
		$('#table2').append(row);

		sequenceNumber++;
	});

}

function getExamColorClassByStatus(status) {

	if (status == "0") {
		return "bg-secondary text-white";
	} else if (status == "1") {
		return "bg-warning";
	} else if (status == "2") {
		return "bg-success text-white";
	}

}


function resetTrainingAndUserAllDetails() {

	hideModal("addEditDeleteBackdropButton");

}


function addTrainingAndUser() {

	var trainingUserId = $("input[name=user]").val();
	var name = $("input[name=name]").val();
	var contact = $("input[name=contact]").val();
	var email = $("input[name=email]").val();
	var user = $("input[name=user]").val();
	var traningName = $("input[name=trainingName]").val();
	var createdBy = sessionStorage.getItem('employeeId');

	if (!name || !contact || !user || !trainingName || !email) {

		alert("* All Fields are mandatory to add Training And User detail.");

	}
	else {

		var formData = {
			name: name,
			contact: contact,
			email: email,
			user: user,
			examStatus: "0",
			createdBy: createdBy,
			trainingExamDetails: {
				traningName: traningName,
			},
		}

		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/insertUserAndTraining',
			data: JSON.stringify(formData),
			contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
			success: function(response) {
				alert(response);
				if (!$('#pager :selected').val()) {
					loadLikeTrainingAndUser(0);
				} else {
					loadLikeTrainingAndUser($('#pager :selected').val());
				}
				resetTrainingAndUserAllDetails();
			},
			error: function(response) {
				alert(response.responseText);
				if (!$('#pager :selected').val()) {
					loadLikeTrainingAndUser(0);
				} else {
					loadLikeTrainingAndUser($('#pager :selected').val());
				}
			}
		});
	}
}


function editTrainingAndUser() {

	var name = $("input[name=name]").val();
	var contact = $("input[name=contact]").val();
	var email = $("input[name=email]").val();
	var user = $("input[name=user]").val();
	var traningName = $("input[name=trainingName]").val();
	var createdBy = sessionStorage.getItem('employeeId');

	if (!name || !contact || !user || !trainingName || !email) {

		alert("* All Fields are mandatory to add Training And User detail.");

	}
	else {

		var formData = {
			trainingUserId: object.trainingUserId,
			name: name,
			contact: contact,
			email: email,
			user: user,
			examStatus: "0",
			createdBy: createdBy,
			trainingAndExamDetails: {
				traningName: traningName,
			},
		}

		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/editUserAndTraining',
			data: JSON.stringify(formData),
			contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
			success: function(response) {
				alert(response);
				if (!$('#pager :selected').val()) {
					loadLikeTrainingAndUser(0);
				} else {
					loadLikeTrainingAndUser($('#pager :selected').val());
				}
				resetTrainingAndUserAllDetails();
			},
			error: function(response) {
				alert(response.responseText);
				if (!$('#pager :selected').val()) {
					loadLikeTrainingAndUser(0);
				} else {
					loadLikeTrainingAndUser($('#pager :selected').val());
				}
			}
		});
	}
}



function deleteAllUserAndTraining() {


	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/delete/deleteAllUserAndTraining',
		data: JSON.stringify(deleteAllList),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			alert(response);
			if (!$('#pager :selected').val()) {
				loadLikeTrainingAndUser(0);
			} else {
				loadLikeTrainingAndUser($('#pager :selected').val());
			}
		},
		error: function(response) {
			alert(response.responseText);
			if (!$('#pager :selected').val()) {
				loadLikeTrainingAndUser(0);
			} else {
				loadLikeTrainingAndUser($('#pager :selected').val());
			}
		}
	});
}



function downloadTrainingAndUserTempate() {

	fetch('/WebApplication/Controllers/trainingAndUserTemplate', {
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
			link.download = 'Training And User' + '.xlsx';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		})
		.catch(error => {
			console.error('Error:', error);
		});


}



function uploadTrainingAndUser() {


	let form_data = new FormData();
	let excelFile = $("#uploadExcel")[0].files;

	if (excelFile.length > 0) {
		form_data.append('file', excelFile[0]);

		startUploading();

		$.ajax({
			url: '/WebApplication/Controllers/uploadTrainingAndUser/' + sessionStorage.getItem('employeeId') + '',
			type: 'POST',
			data: form_data,
			headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
			contentType: false,
			/*	async: false,*/
			processData: false,
			success: function(response) {

				convertErrorListToCsV(response);

				$("#uploadImage").attr("src", "/WebApplication/images/success.png");
				$("#uploadWaiting").text(response.message);
				resetUploadModal();

				if (!$('#pageSelect :selected').val()) {
					loadLikeTrainingAndUser(0);
				} else {
					loadLikeTrainingAndUser($('#pageSelect :selected').val());
				}

			},
			error: function(response) {

				alert(response.responseText);
				resetUploadModal();
				$("#uploadImage").attr("src", "/WebApplication/images/error.png");
				$("#uploadWaiting").text(response.responseText);

				if (!$('#pageSelect :selected').val()) {
					loadLikeTrainingAndUser(0);
				} else {
					loadLikeTrainingAndUser($('#pageSelect :selected').val());
				}
			}
		});
	} else {
		alert("Please select excel.");
	}

	totalRowInterval = setInterval(getTotalRows, 500);

}


function loadLikeDepartmentMasterData(page) {

	var departmentName = $('input[name="searchDepartment"]').val();

	var formData = {
		departmentName: departmentName,
	}

	console.log(formData);
	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getLikeDepartment/' + page,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {

			makePagerByTotalPages(res, page)
			insertDepartmentMasterInTable(res.content, page);

		}, error: function(response) {
			$("#warningInformationModalBody").text(response.responseText);
			$("#warningBackdropButton").click();
		}
	});
}


function insertDepartmentMasterInTable($item, page) {

	$("#table2Body").empty();

	var sequenceNumber = pageSize * parseInt($('#pager :selected').val());

	$.each($item, function(index, value) {

		var row = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId" style="width:50px;">' + (sequenceNumber + 1) + '</td>' +
			'<td data-column="departmentName" class="textLeftAlign">' + (value.departmentName == null ? '' : value.departmentName) + '</td>' +
			'<td data-column="createdBy">' + (value.createdBy == null ? '' : value.createdBy) + '</td>' +
			'<td data-column="dateTime">' + (value.dateTime == null ? '' : value.dateTime) + '</td>' +
			'<td data-column="departmentId" style="display:none;">' + value.departmentId + '</td></tr>';

		$('#table2').append(row);
		sequenceNumber++;
	});
}




function loadLikeQuestionMasterData(page) {

	var questionType = $('input[name="searchQuestionType"]').val();
	var question = $('input[name="searchQuestion"]').val();
	var givenAnswer = $('input[name="searchOption"]').val();

	var formData = {
		questionType: questionType,
		question: question,
		givenAnswer: givenAnswer,

	}

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getLikeQuestion/' + page + '/' + pageSize,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {

			makePagerByTotalPages(res, page)
			insertQuestionMasterInTable(res.content, page);

		}, error: function(response) {
			$("#warningInformationModalBody").text(response.responseText);
			$("#warningBackdropButton").click();
		}
	});
}


function insertQuestionMasterInTable($item, page) {

	$("#table2Body").empty();

	var sequenceNumber = pageSize * parseInt($('#pager :selected').val());

	$.each($item, function(index, value) {


		var option = value.givenAnswer.split("@")

		var options = getOptionByList(option);

		var row = '<tr class="tableDataRows" title="Double click to select the row."><td data-column="columnId" style="width:50px;">' + (sequenceNumber + 1) + '</td>' +
			'<td data-column="questionType" style="width:100px;">' + (value.questionType == null ? '' : value.questionType) + '</td>' +
			'<td data-column="question" style="width:300px;" class="textLeftAlign">' + (value.question == null ? '' : value.question) + '</td>' +
			'<td data-column="splitOptions" style="width:300px;" class="textLeftAlign py-1">' + options + '</td>' +
			'<td data-column="correctAnswer">' + (value.correctAnswer == null ? '' : value.correctAnswer) + '</td>' +
			'<td data-column="createdBy">' + (value.createdBy == null ? '' : value.createdBy) + '</td>' +
			'<td data-column="dateTime">' + (value.dateTime == null ? '' : value.dateTime) + '</td>' +
			'<td data-column="options" style="display:none;">' + (value.givenAnswer == null ? '' : value.givenAnswer) + '</td>' +
			'<td data-column="questionId" style="display:none;">' + value.questionId + '</td></tr>';

		$('#table2').append(row);
		sequenceNumber++;
	});
}


function makeQuestionModalInputs(modalBodyId) {

	$("#" + modalBodyId).empty();

	var container42 = document.createElement("div");
	var container43 = document.createElement("div");
	var container44 = document.createElement("div");
	var container45 = document.createElement("div");
	var container51 = document.createElement("div");
	var container52 = document.createElement("div");
	var container53 = document.createElement("div");
	var container54 = document.createElement("div");


	container42.setAttribute("id", "container42");
	container42.setAttribute("class", "dataContainer mt-1");
	container43.setAttribute("i", "container43");
	container43.setAttribute("class", "dataContainer mt-1");
	container44.setAttribute("id", "container44");
	container44.setAttribute("class", "dataContainer d-flex justify-content-start align-items-center");
	container45.setAttribute("id", "container45");
	container45.setAttribute("class", "dataContainer optionContainers mt-1");
	container51.setAttribute("id", "container51");
	container51.setAttribute("class", "dataContainer questionHeading");
	container52.setAttribute("id", "container52");
	container52.setAttribute("class", "dataContainer questionsContainer");
	container53.setAttribute("id", "container53");
	container53.setAttribute("class", "dataContainer d-flex justify-content-between align-items-center p-3 position-absolute bottom-0");
	container54.setAttribute("id", "container54");
	container54.setAttribute("class", "dataContainer");

	$("#" + modalBodyId).append(container42, container43, container44, container45);


	var questionBrowser = document.createElement("textarea");
	questionBrowserAttr = ["id", "question", "class", "questionArea p-3"];
	appendAttribute(questionBrowserAttr, questionBrowser);
	container42.append("Ques No.", questionBrowser);
	container43.append("Answer Type");


	var mcqAttr = ["id", "mcq", "type", "radio", "name", "questionType", "class", "inputs m-3 ", "style", "width:20px; height:20px;", "value", "mcq"]

	createInput(mcqAttr, container44, "MCQ");

	var mcqAttr = ["id", "written", "type", "radio", "name", "questionType", "class", "inputs m-3", "style", "width:20px; height:20px;", "value", "written"]

	createInput(mcqAttr, container44, "Written");

	var imagesAttr = ["id", "written", "type", "radio", "name", "questionType", "class", "inputs m-3", "style", "width:20px; height:20px;", "value", "images"]

	createInput(imagesAttr, container44, "Images");

}


function addQuestionMaster() {

	examAndTrainingDetails.question = $("#question").val();

	if (examAndTrainingDetails.question == "") {
		alert("Question is empty please fill question.");
		return;

	}

	if ($('input[name="questionType"]:checked').length == 0) {

		alert("Please select answer type to add question.");
		return;

	}


	if (examAndTrainingDetails.questionType == "mcq") {

		var option1 = $("#option1").val();
		var option2 = $("#option2").val();
		var option3 = $("#option3").val();
		var option4 = $("#option4").val();

		if (!option1 || !option2 || !option3 || !option4) {

			alert("Please fill all the option to add question");
			return;
		}

		examAndTrainingDetails.givenAnswer = option1 + "@" + option2 + "@" + option3 + "@" + option4;

		if ($('input[name="correctOption"]:checked').length == 0) {

			alert("Please select correct option to add question.");
			return;

		}


	} else if (examAndTrainingDetails.questionType == "written") {

		var answer = $("#writtenAnswer").val();

		if (!answer) {

			alert("Please fill the answer to add question");
			return;
		}

		examAndTrainingDetails.givenAnswer = answer;
		examAndTrainingDetails.correctAnswer = answer;

	} else if (examAndTrainingDetails.questionType == "images") {

		return;


	} else {

		alert("please select answer type to fill answer to add question.");
		return;

	}


	formData = {

		question: examAndTrainingDetails.question,
		questionType: examAndTrainingDetails.questionType,
		correctAnswer: examAndTrainingDetails.correctAnswer,
		givenAnswer: examAndTrainingDetails.givenAnswer,
		createdBy: sessionStorage.getItem('employeeId')

	}

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/addQuestionMaster',
		data: JSON.stringify(formData),
		contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			alert(response);
			if (!$('#pager :selected').val()) {
				loadLikeQuestionMasterData(0);
			} else {
				loadLikeQuestionMasterData($('#pager :selected').val());
			}
			resetQuestionDetails();

		},
		error: function(response) {
			alert(response.responseText);
			if (!$('#pager :selected').val()) {
				loadLikeQuestionMasterData(0);
			} else {
				loadLikeQuestionMasterData($('#pager :selected').val());
			}
		}
	});
}



function editQuestionMaster() {

	examAndTrainingDetails.question = $("#question").val();

	if (examAndTrainingDetails.question == "") {
		alert("Question is empty please fill question.");
		return;

	}

	if ($('input[name="questionType"]:checked').length == 0) {

		alert("Please select answer type to add question.");
		return;

	}


	if (examAndTrainingDetails.questionType == "mcq") {

		var option1 = $("#option1").val();
		var option2 = $("#option2").val();
		var option3 = $("#option3").val();
		var option4 = $("#option4").val();

		if (!option1 || !option2 || !option3 || !option4) {

			alert("Please fill all the option to add question");
			return;
		}

		examAndTrainingDetails.givenAnswer = option1 + "@" + option2 + "@" + option3 + "@" + option4;

		if ($('input[name="correctOption"]:checked').length == 0) {

			alert("Please select correct option to add question.");
			return;

		}


	} else if (examAndTrainingDetails.questionType == "written") {

		var answer = $("#writtenAnswer").val();

		if (!answer) {

			alert("Please fill the answer to add question");
			return;
		}

		examAndTrainingDetails.givenAnswer = answer;
		examAndTrainingDetails.correctAnswer = answer;

	} else if (examAndTrainingDetails.questionType == "images") {


		return;


	} else {

		alert("please select answer type to fill answer to add question.");
		return;

	}


	formData = {

		questionId: object.questionId,
		question: examAndTrainingDetails.question,
		questionType: examAndTrainingDetails.questionType,
		correctAnswer: examAndTrainingDetails.correctAnswer,
		givenAnswer: examAndTrainingDetails.givenAnswer,
		createdBy: sessionStorage.getItem('employeeId')

	}

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/editQuestionMaster',
		data: JSON.stringify(formData),
		contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			alert(response);
			if (!$('#pager :selected').val()) {
				loadLikeQuestionMasterData(0);
			} else {
				loadLikeQuestionMasterData($('#pager :selected').val());
			}
			resetQuestionDetails();

		},
		error: function(response) {
			alert(response.responseText);
			if (!$('#pager :selected').val()) {
				loadLikeQuestionMasterData(0);
			} else {
				loadLikeQuestionMasterData($('#pager :selected').val());
			}
		}
	});
}

function deleteAllQuestion() {

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/delete/deleteAllQuestion',
		data: JSON.stringify(deleteAllList),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			alert(response);
			if (!$('#pager :selected').val()) {
				loadLikeQuestionMasterData(0);
			} else {
				loadLikeQuestionMasterData($('#pager :selected').val());
			}
		},
		error: function(response) {
			alert(response.responseText);
			if (!$('#pager :selected').val()) {
				loadLikeQuestionMasterData(0);
			} else {
				loadLikeQuestionMasterData($('#pager :selected').val());
			}
		}
	});
}

function resetQuestionDetails() {

	hideModal("addEditDeleteBackdropButton");
	object = {}

}


function downloadQuestionMasterTemplate() {

	fetch('/WebApplication/Controllers/questionMasterTemplate', {
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
			link.download = 'Question Master' + '.xlsx';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		})
		.catch(error => {
			console.error('Error:', error);
		});

}


function startUploading() {


	$("#uploadImage").attr("src", "/WebApplication/images/processing.gif");
	$("#upload").attr("style", "display:none");
	$("#uploadExcel").attr("style", "display:none");
	$("#uploadCloseButton").attr("style", "background: transparent; height: 30px; width: 30px; border: 0px; display:none;");
	$("#uploadWaiting").removeAttr("style");
	$("#uploadWaiting").text("Please wait......");
	$("#myProgress").removeAttr("style");

}


function resetUploadModal(response) {

	$("#uploadCloseButton").css("display", "flex");
	clearInterval(interval);
	clearInterval(totalRowInterval);
	var elem = document.getElementById("myBar");
	elem.style.width = "1%";
	$("#myProgress").attr("style", "display:none;");

}

function convertErrorListToCsV(response) {
	CSVFile = new Blob([response.unUploadList.join('\n')], { type: "text/csv" });
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


function move(currentRow) {

	var width = (currentRow / totalRows) * 100;
	$("#uploadWaiting").text(currentRow + " / " + (totalRows + 1));
	var elem = document.getElementById("myBar");
	elem.style.width = width + "%";

	if (width >= 100) {
		clearInterval(interval);
		setTimeout(function() {
			$("#uploadWaiting").text("Processing! Please wait ...");
		}, 1000)
	}
}


function getCurrentRow() {

	$.ajax({
		url: "/WebApplication/Controllers/getCurrentRow",
		type: 'GET',
		async: false,
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		dataType: 'json',
		success: function(res) {
			move(res)
		}
	});
}

function getTotalRows() {

	$.ajax({
		url: "/WebApplication/Controllers/getTotalRows",
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



function uploadQuestionMaster() {


	let form_data = new FormData();
	let excelFile = $("#uploadExcel")[0].files;

	if (excelFile.length > 0) {
		form_data.append('file', excelFile[0]);

		startUploading();

		$.ajax({
			url: '/WebApplication/Controllers/uploadQuestionMaster/' + sessionStorage.getItem('employeeId') + '',
			type: 'POST',
			data: form_data,
			headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
			contentType: false,
			/*	async: false,*/
			processData: false,
			success: function(response) {

				convertErrorListToCsV(response);

				$("#uploadImage").attr("src", "/WebApplication/images/success.png");
				$("#uploadWaiting").text(response.message);
				resetUploadModal();

				if (!$('#pageSelect :selected').val()) {
					loadLikeQuestionMasterData(0);
				} else {
					loadLikeQuestionMasterData($('#pageSelect :selected').val());
				}

			},
			error: function(response) {

				alert(response.responseText);
				resetUploadModal();
				$("#uploadImage").attr("src", "/WebApplication/images/error.png");
				$("#uploadWaiting").text(response.responseText);

				if (!$('#pageSelect :selected').val()) {
					loadLikeQuestionMasterData(0);
				} else {
					loadLikeQuestionMasterData($('#pageSelect :selected').val());
				}
			}
		});
	} else {
		alert("Please select excel.");
	}

	totalRowInterval = setInterval(getTotalRows, 500);

}

