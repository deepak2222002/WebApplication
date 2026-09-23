window.addEventListener('beforeunload', function(event) {
	event.preventDefault();
	event.returnValue = '';
	var confirmationMessage = 'Are you sure you want to leave?';
	(event || window.event).returnValue = confirmationMessage; // Standard
	return confirmationMessage; // For some older browsers
});

var trainingExamDetailId = injectedTrainingExamDetailId;
var stationId = injectedStationId;

var examAndTrainingDetails = {

	stationId: null,
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
	trainingExamOutputId: null,
	batchId: "",

}
var currentQuestion = 0;
var currentResource = 0;
var interval;
var hour = 0;
var min = 0;
var sec = 0;


function resetDetails() {
	examAndTrainingDetails = {

		stationId: null,
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
		trainingExamOutputId: null,
		batchId: "",

	}

	currentQuestion = 0;
	currentResource = 0;
	interval;
	hour = 0;
	min = 0;
	sec = 0;
}



function logout() {
	window.location.replace("/WebApplication/usertraininglogin");
}

$(document).ready(function() {
	$(document).on('click', '#examList', function() {
		/*		searchLoad = true;
		
				$("#offcanvasCloseButton").click();
				$("#masterHeading").text("EXAM LIST");
		
				$("#div3").empty();*/

		startTraining(trainingExamDetailId);

		/*	var searchContainer = document.createElement("div");
			searchContainer.setAttribute("class", "container d-flex justify-content-between align-items-center")
			$("#div3").append(searchContainer);
	
			var container = '<div class="container my-3">' +
				'<div id="modelContainer" class="row">' +
				'</div>' +
				'</div>';
	
			$("#div3").append(container);
	
			getAllTrainingModelByuser("");*/

	});
});


$(document).ready(function() {
	$(document).on('click', '#trainingExamPassed', function() {
		searchLoad = true;

		$("#offcanvasCloseButton").click();
		$("#masterHeading").text("TRAINING AND EXAM PASSED");

		$("#div3").empty();

		var container = '<div class="container my-3">' +
			'<div id="modelContainer" class="row">' +
			'</div>' +
			'</div>';

		$("#div3").append(container);

		getAllTrainingModelByuser("2");

	});
});



$(document).on("click", ".startTrainingAndTest", function(event) {

	/*	startTraining(event.target.id);*/
	startTraining(trainingExamDetailId);
});



$(document).on("click", ".questionSwitchButton", function(event) {

	var text = $("#" + event.target.id).text();
	currentQuestion = parseInt(text) - 1;
	switchAndUpdateQuestionStatus(event.target.id, "1", currentQuestion);
	examAndTrainingDetails.questionId = event.target.id;
	getAllQuestionByTrainingId();
	showElementById("saveAndnextQuestion");
	showElementById("clearResponse");
	hideElementById("submitExam");


});


$(document).on("click", "#submitTrainingAndStartExam", function(event) {

	updateTrainingAndExamStatus("1");
	makeQuestionBody();

});


$(document).on("click", "#saveAndnextQuestion", function(event) {

	updateQuestionAnswerById("3");

});


$(document).on("click", "#clearResponse", function(event) {


	if (examAndTrainingDetails.questionType == "mcq") {
		$('input[name="options"]').prop('checked', false);
	} else if (examAndTrainingDetails.questionType == "written") {
		$("#writtenAnswer").val("");
	} else if (examAndTrainingDetails.questionType == "images") {
		$('input[name="options"]').prop('checked', false);
	}

	updateQuestionAnswerById("1");

});



$(document).on("click", "#submitExam", function(event) {

	updateTrainingAndExamStatus("2");

	examAndTrainingDetails = {

		stationId: null,
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
		trainingExamOutputId: null,
		batchId: "",

	}
	currentQuestion = 0;
	currentResource = 0;
	hour = 0;
	min = 0;
	sec = 0;

	clearInterval(interval);

	makeCongratulationPage();
	/*	$(".list li:first a").click();*/



});


/*$(document).on("click", ".nextPreviousButton", function(event) {

	if (event.target.id == "next1") {

		makeTestSecondPage();

	} else if (event.target.id == "next2") {

		currentResource++;
		makeResourcePage();

	} else if (event.target.id == "previous2") {

		startTraining(examAndTrainingDetails.trainingId);

	} else if (event.target.id == "previous3") {

		currentResource--;
		makeTestSecondPage();

	} else if (event.target.id == "previousRes") {

		pageNumber = currentResource - 1

		if (pageNumber > 0) {
			currentResource = currentResource - 1;
			makeResourcePage();

		}

	} else if (event.target.id == "nextRes") {

		pageNumber = currentResource + 1

		if (pageNumber <= examAndTrainingDetails.trainingPageNumber) {
			currentResource = currentResource + 1;
			makeResourcePage();

		} else {
			hideElementById("nextRes");
			showElementById("submitTrainingAndStartExam");

		}
	}

});
*/


$(document).on("click", ".nextPreviousButton", function(event) {

	if (event.target.id == "next1") {

		/*makeTestSecondPage();*/

		currentResource++;
		makeResourcePage();

	}/* else if (event.target.id == "next2") {

		currentResource++;
		makeResourcePage();

	} else if (event.target.id == "previous2") {

		startTraining(examAndTrainingDetails.trainingId);

	}*/ else if (event.target.id == "previous3") {

		/*currentResource--;
		makeResourcePage();*/

		startTraining(trainingExamDetailId);

	} else if (event.target.id == "previousRes") {

		pageNumber = currentResource - 1

		if (pageNumber > 0) {
			currentResource = currentResource - 1;
			makeResourcePage();

		}

	} else if (event.target.id == "nextRes") {

		pageNumber = currentResource + 1

		if (pageNumber <= examAndTrainingDetails.trainingPageNumber) {
			currentResource = currentResource + 1;
			makeResourcePage();

		} else {
			hideElementById("nextRes");
			hideElementById("previous3");
			hideElementById("previousRes");
			showElementById("submitTrainingAndStartExam");

		}
	}

});



$(document).on("click", "input[name='options']", function(event) {

	$('input[name="options"]').prop('checked', false);
	$("#" + event.target.id).prop('checked', true)
	var correctAnswer = $("#option" + event.target.id).val();

});


function updateQuestionAnswerById(questionStatus) {

	var attemptAnswer;

	if (examAndTrainingDetails.questionType == "mcq") {
		attemptAnswer = $("input[name='options']:checked").val();

		if (!attemptAnswer) {

			alert("Please select an option to save and next question.")
			return;
		}

	} else if (examAndTrainingDetails.questionType == "written") {
		attemptAnswer = $("#writtenAnswer").val();

	} else if (examAndTrainingDetails.questionType == "images") {
		attemptAnswer = $("input[name='options']:checked").val();

		if (!attemptAnswer) {

			alert("Please select an option to save and next question.")
			return;
		}
	}


	var formData = {
		trainingExamOutputId: examAndTrainingDetails.trainingExamOutputId,
		attemptAnswer: attemptAnswer,
		questionStatus: questionStatus,
		trainingAndExamDetails: examAndTrainingDetails.trainingId,
		questionNumber: currentQuestion

	}

	$.ajax({
		type: 'post',
		url: '/WebApplication/TrainingAndTest/updateQuestionAnswerById',
		data: JSON.stringify(formData),
		async: false,
		contentType: "application/json",
		success: function(response) {

			currentQuestion++;
			getNextQuestionByTrainingId();
			getAllQuestionByTrainingId();

		}, error: function(error) {

			alert(error.responseText);
		}
	});

}



function updateTrainingAndExamStatus(examStatus) {

	var formData = {
		examStatus: examStatus,
		trainingExamDetails: {
			trainingId: examAndTrainingDetails.trainingId,
		},
		station: {
			id: stationId
		}

	}

	$.ajax({
		type: 'post',
		url: '/WebApplication/TrainingAndTest/updateTrainingAndExamStatus',
		data: JSON.stringify(formData),
		async: false,
		contentType: "application/json", /*headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },*/
		success: function(response) {

			alert(response.message);
			examAndTrainingDetails.batchId = response.batchId;

			currentQuestion = 0;
			currentResource = 0;
			hour = 0;
			min = 0;
			sec = 0;

			clearInterval(interval);

		}, error: function(error) {

			alert(error.responseText);
		}
	});

}


function switchAndUpdateQuestionStatus(trainingExamOutputId, questionStatus, questionNumber) {

	var formData = {
		trainingExamOutputId: trainingExamOutputId,
		questionStatus: questionStatus,
		trainingAndExamDetails: examAndTrainingDetails.trainingId,
		batchId: examAndTrainingDetails.batchId,
		questionNumber: questionNumber,
		user: "111"

	}

	$.ajax({
		type: 'post',
		url: '/WebApplication/TrainingAndTest/switchAndUpdateQuestionStatus',
		data: JSON.stringify(formData),
		async: false,
		contentType: "application/json", /*headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },*/
		success: function(response) {

			insertAllQuestionInQuestionContainer(response, "questionContainer");

		}, error: function(error) {

			alert(error.responseText);
		}
	});

}


function getNextQuestionByTrainingId() {

	var formData = {
		user: "111",
		batchId: examAndTrainingDetails.batchId,
		trainingAndExamDetails: examAndTrainingDetails.trainingId,
	}

	$.ajax({
		type: 'post',
		url: '/WebApplication/TrainingAndTest/getNextQuestionByUserAndTrainingId/' + currentQuestion,
		data: JSON.stringify(formData),
		async: false,
		contentType: "application/json", /*headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },*/
		success: function(response) {

			insertAllQuestionInQuestionContainer(response, "questionContainer")

		}, error: function(error) {

			alert(error.responseText);
			getAllQuestionByTrainingId();
			showElementById("submitExam");
			hideElementById("clearResponse");
			hideElementById("saveAndnextQuestion");
		}
	});

}



function getAllQuestionByTrainingId() {

	var formData = {
		user: "111",
		batchId: examAndTrainingDetails.batchId,
		trainingAndExamDetails: examAndTrainingDetails.trainingId,

	}

	$.ajax({
		type: 'post',
		url: '/WebApplication/TrainingAndTest/getAllQuestionByTrainingId',
		data: JSON.stringify(formData),
		async: false,
		contentType: "application/json", /*headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },*/
		success: function(response) {

			insertAllQuestionStatusInContainer(response, "questionStatusContainer")

		}, error: function(error) {

			alert(error.responseText);
		}
	});

}


function startTraining(examId) {

	resetDetails();
	getModelAllDetail(examId);
	makeTestFrontPage()

}

function getModelAllDetail(trainingId) {

	var formData = {

		trainingId: trainingId,

	}

	$.ajax({
		type: 'post',
		url: '/WebApplication/TrainingAndTest/getModelAllDetail',
		data: JSON.stringify(formData),
		async: false,
		contentType: "application/json", /*headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },*/
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


		}, error: function(error) {
			/**/
		}
	});

}


function makeQuestionBody() {


	$("#div3").empty();

	var questionBody = `<div class="container-fluid py-2">

    <!-- Header -->
    <div class="card shadow-sm mb-1">
        <div class="card-body d-flex justify-content-between align-items-center">
            <h5 class="mb-0 fw-bold">${examAndTrainingDetails.examType + " " + examAndTrainingDetails.traningName + " Test"}</h5>
            <span class="badge bg-danger fs-6 timer">⏱ 00:00:00</span>
        </div>
    </div>

    <div class="row g-1">
		        <!-- Question Section -->
		        <div class="col-lg-8">
		            <div class="card shadow-sm" style="height:85vh;">
		                <div class="card-header bg-primary text-white fw-bold">
		                   	Exam Language : ${examAndTrainingDetails.examLanguage}
		                </div>
		
		                <div class="card-body questionContainer">
		                	
		                </div>
		
		                <div class="card-footer d-flex justify-content-between">
		                <button class="btn btn-primary nextPreviousButtons" id="submitExam" style="display: none;">
		                        Submit Exam
		                    </button>
		                <button class="btn btn-primary nextPreviousButtons" id="saveAndnextQuestion">
		                        Save & Next →
		                    </button>
		                    <button class="btn btn-outline-secondary nextPreviousButton" id="clearResponse" >
		                        Clear Response
		                    </button>
		                     
		                </div>
		            </div>
		        </div>
		
		        <!-- Navigation Panel -->
		        <div class="col-lg-4">
		            <div class="card shadow-sm h-100">
		                <div class="card-body">
		
		                    <h6 class="fw-bold mb-3">Question Status</h6>
		
		                    <div class="d-grid gap-2 mb-3">
		                        <span class="badge bg-success p-2">Answered</span>
		                        <span class="badge bg-danger p-2">Not Answered</span>
		                        <span class="badge bg-secondary p-2">Not Visited</span>
		                        <span class="badge bg-warning text-dark p-2">Marked for Review</span>
		                    </div>
		
		                    <hr>
		
		                    <h6 class="fw-bold mb-3">Choose a Question</h6>
		                    <div class="d-flex flex-wrap gap-2 questionStatusContainer">
		                        
		                    </div>
		
		                </div>
		            </div>
		        </div>
		
		    </div>
		</div>`

	$("#div3").append(questionBody);


	getAllQuestionByTrainingId();
	getNextQuestionByTrainingId()

	interval = setInterval(startTime, 1000);

	/*var container11 = document.createElement("div");
	var container12 = document.createElement("div");
	var container13 = document.createElement("div");
	var container14 = document.createElement("div");
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
	var container26 = document.createElement("div");
	var container27 = document.createElement("div");
	var container28 = document.createElement("div");
	var container29 = document.createElement("div");
	var container30 = document.createElement("div");


	container11.setAttribute("id", "container11");
	container11.setAttribute("class", "traningHeading d-flex justify-content-center align-items-center");
	container12.setAttribute("id", "container12");
	container12.setAttribute("class", "d-flex");
	container13.setAttribute("id", "container13");
	container13.setAttribute("class", "position-relative");
	container14.setAttribute("id", "container14");
	container14.setAttribute("class", "");
	container15.setAttribute("id", "container15");
	container15.setAttribute("class", "dataContainer sectionHeading");
	container16.setAttribute("id", "container16");
	container16.setAttribute("class", "questionContainer");
	container17.setAttribute("id", "container17");
	container17.setAttribute("class", "dataContainer d-flex justify-content-between align-items-center p-3 position-absolute bottom-0 my-1 w-100");
	container18.setAttribute("id", "container18");
	container18.setAttribute("class", "dataContainer timeContainer d-flex justify-content-center align-items-center");
	container19.setAttribute("id", "container19");
	container19.setAttribute("class", "dataContainer indicatorContainer");
	container20.setAttribute("id", "container20");
	container20.setAttribute("class", "questionStatusContainer row");
	container21.setAttribute("id", "container21");
	container21.setAttribute("class", "dataContainer mt-2 answered");
	container22.setAttribute("id", "container22");
	container22.setAttribute("class", "dataContainer mt-2 notAnswered");
	container23.setAttribute("id", "container23");
	container23.setAttribute("class", "dataContainer mt-2 notVisited");
	container24.setAttribute("id", "container24");
	container24.setAttribute("class", "dataContainer mt-2 markedForReview");
	container25.setAttribute("id", "container25");
	container25.setAttribute("class", "dataContainer d-flex justify-content-center align-items-center");
	container26.setAttribute("id", "container26");
	container26.setAttribute("class", "dataContainer");
	container27.setAttribute("id", "container27");
	container27.setAttribute("class", "dataContainer");
		container4.setAttribute("id", "container4");
		container4.setAttribute("class", "d-flex justify-content-end align-items-center p-3 position-absolute bottom-0 my-3 w-100");

	$("#div3").append(container11, container12);

	container11.append(examAndTrainingDetails.examType + " " + examAndTrainingDetails.traningName + " Test");

	container12.append(container13, container14);
	container13.append(container15, container16, container17);

	container14.append(container18, container19, container20);

	container20.append(container25);
	container25.append("Choose A Question")

	container18.append("00:00:00");
	container19.append(container21, container22, container23, container24);

	container21.append("Answered");
	container22.append("Not Answered");
	container23.append("Not Visited");
	container24.append("Marked For Review");


	container15.append("Exam Language " + examAndTrainingDetails.examLanguage);


	var clearresponseAttr = ["id", "clearResponse", "class", "btn btn-dark nextPreviousButton mx-3"];

	createButton(clearresponseAttr, container17, "Clear Response");

	var savenextAttr = ["id", "saveAndnextQuestion", "class", "btn btn-dark nextPreviousButton mx-3"];

	createButton(savenextAttr, container17, "Save & Next");

	var submutExamAttr = ["id", "submitExam", "class", "btn btn-dark nextPreviousButton mx-3", "style", "display:none;"];

	createButton(submutExamAttr, container17, "Submit Exam");

	getAllQuestionByTrainingId();
	getNextQuestionByTrainingId()*/;

	//interval = setInterval(startTime, 1000);


}

async function startTime() {
	sec = sec + 1;

	if (sec == 59) {

		min = min + 1;
		sec = 0;
	}

	if (min == 59) {

		hour = hour + 1;
		min = 0;
	}

	$(".timer").text("⏱ " + (hour.toString().length == 1 ? "0" + hour : hour)
		+ ":" + (min.toString().length == 1 ? "0" + min : min) + ":"
		+ (sec.toString().length == 1 ? "0" + sec : sec));


}



function insertAllQuestionInQuestionContainer(response, containerClass) {

	$("." + containerClass).empty();

	var data = response[0];
	var question = data.question
	var option = data.givenAnswer.split("@")
	var options;
	if (data.questionType == "mcq") {

		options = getOptionByList(option, data.attemptAnswer);

	} else if (data.questionType == "written") {

		options = makeTextBoxForInput(data.attemptAnswer);
	} else if (data.questionType == "images") {

		options = getImagesByList(option, data.attemptAnswer);

	}


	examAndTrainingDetails.givenAnswer = data.givenAnswer;
	examAndTrainingDetails.trainingExamOutputId = data.trainingExamOutputId;
	examAndTrainingDetails.questionType = data.questionType;
	/*
		var row = '<div class="mt-3" style="min-height: 120px;">' +
			'<div class=""></div>' +
			'<div class="justify-content-center align-items-center">' +
			'<div class="questionNoContainer my-3 p-2">Ques No. ' + (currentQuestion + 1) + '</div>' +
			'<div class="quesContainer p-2 d-flex justify-content-between align-items-center">' + data.question + '</div>' +
			'</div>' +
			'<div>' +
			options +
			'</div>' +
			'</div>';
	*/
	var questionDesign = `<div>
							<h5 class="mb-4 fw-semibold">
		                	Ques No. ${(currentQuestion + 1)} 
		                	</h5>
		                    <h5 class="mb-4 fw-semibold">
		                        ${question}
		                    </h5>
							${options}
		                </div>`;

	$("." + containerClass).append(questionDesign);

}



function insertAllQuestionStatusInContainer(response, containerClass) {

	$("." + containerClass).empty();

	for (var i = 0; i < response.length; i++) {
		var data = response[i];
		var colorCLass = getQuestionColourByStatus(data.questionStatus);

		/*		var row = '<div class="col-md-3 my-1">' +
					'<div class="d-flex justify-content-center align-items-center ques">' +
					'<button id="' + data.trainingExamOutputId + '" class="questionSwitchButton ' + colorCLass + '">' + (i + 1) + '</button></div>' +
					'</div>';*/

		var button = `<button id="${data.trainingExamOutputId}" class="btn btn-${colorCLass} rounded-circle h-25 questionSwitchButton" style="width:45px;">${(i + 1)}</button>`;

		$("." + containerClass).append(button);

	}

}

function getQuestionColourByStatus(status) {

	if (status == "0") {

		return "secondary";

	} else if (status == "1") {

		return "danger";
	} else if (status == "2") {

		return "warning";
	} else if (status == "3") {

		return "success";
	}

}

function getOptionByList(option, correctAnswer) {

	var options = '';

	console.log(correctAnswer + option[i]);

	for (var i = 0; i < option.length; i++) {
		if (correctAnswer == option[i]) {
			options = options + `<div class="form-check mb-3">
		                        	<input class="form-check-input checkbox" type="checkbox" value="${option[i]}" name="options" id="option${i}" checked>
			                        <label class="form-check-label fs-5">
			                            ${option[i]}
			                        </label>
		                    </div>`;


			/*	options = options + '<div class="option d-flex justify-content-start align-items-center">' +
					'<input type="checkbox" name="options" class="checkbox mx-3" value="' + option[i] + '" id="' + "option" + i + '" checked />' + option[i] + '</div>';
	*/
		} else {

			options = options + `<div class="form-check mb-3">
		                        	<input class="form-check-input checkbox" type="checkbox" value="${option[i]}" name="options" id="option${i}">
			                        <label class="form-check-label fs-5">
			                            ${option[i]}
			                        </label>
		                    </div>`;
			/*options = options + '<div class="option d-flex justify-content-start align-items-center">' +
				'<input type="checkbox" name="options" class="checkbox mx-3" value="' + option[i] + '" id="' + "option" + i + '" />' + option[i] + '</div>';
*/
		}

	}

	return options;

}


function getImagesByList(option, correctAnswer) {

	var options = '';

	for (var i = 0; i < option.length; i++) {

		if (correctAnswer == option[i]) {

			options = options + '<div class="dataContainer smallConatainer d-flex justify-content-start align-items-center">' +
				'<input type="checkbox" name="options" class="checkbox mx-3" value="' + option[i] + '" id="' + "option" + i + '" checked />' +
				'<img src="/WebApplication/trainingResouces/' + option[i] + '.png" class="optionImages"></div>';

		} else {

			options = options + '<div class="dataContainer smallConatainer d-flex justify-content-start align-items-center">' +
				'<input type="checkbox" name="options" class="checkbox mx-3" value="' + option[i] + '" id="' + "option" + i + '" />' +
				'<img src="/WebApplication/trainingResouces/' + option[i] + '.png" class="optionImages"></div>';

		}

	}

	return '<div class="d-flex">' + options + '</div>';

}


function makeTextBoxForInput(correctAnswer) {

	var options = '';

	if (correctAnswer != null || correctAnswer != "") {

		options = '<div class="option d-flex justify-content-start align-items-center">' +
			'<textarea id="writtenAnswer" name="options" class="questionArea p-3 mx-3">' + correctAnswer + '</textarea></div>';

	} else {

		options = '<div class="option d-flex justify-content-start align-items-center">' +
			'<textarea id="writtenAnswer" class="questionArea p-3 mx-3"></textarea></div>';
	}

	return options;

}



function makeTestFrontPage() {

	$("#div3").empty();

	/*	var container1 = document.createElement("div");
		var container2 = document.createElement("div");
		var container3 = document.createElement("div");
		var container4 = document.createElement("div");
	
		container1.setAttribute("id", "container1");
		container1.setAttribute("class", "companyLogo");
		container2.setAttribute("id", "container2");
		container2.setAttribute("class", "departmentTrainingTest d-flex align-items-center");
		container3.setAttribute("id", "container3");
		container3.setAttribute("class", "d-flex align-items-center");
		container4.setAttribute("id", "container4");
		container4.setAttribute("class", "d-flex justify-content-end align-items-center p-3 position-absolute bottom-0 my-3 w-100");
	
		$("#div3").append(container1, container2, container3, container4);
	
		container2.append(examAndTrainingDetails.department + " Department Training & Test");
		container3.append("* Please read and learn all the training part to clear exam successfully.");*/


	var container1 = ` <nav class="navbar bg-white shadow-sm">
        <div class="container justify-content-center">
        	<img src="/WebApplication/images/copyrightImage.png" alt="JNS" height="200" width="700">
        </div>
    </nav>`;

	var container2 = `<div class="container d-flex align-items-center justify-content-center" style="min-height: 60vh;">
        <div class="text-center col-lg-8 col-md-10">

            <h1 class="fw-bold text-primary mb-4">
                ${examAndTrainingDetails.department} Department Training & Test
            </h1>

            <p class="text-secondary fs-5 mb-4">
                Please complete the training modules carefully before attempting the examination.
            </p>

            <div class="alert alert-info d-inline-block px-4">
                <strong>Note:</strong> Read and understand all training content to clear the exam successfully.
            </div>

            <div class="mt-5">
                <button id="next1" class="btn btn-secondary btn-lg px-5 shadow nextPreviousButton">
                    Start Training
                </button>
            </div>

        </div>
    </div>`;

	$("#div3").append(container1, container2);

	/*var nextAttr = ["id", "next1", "class", "btn btn-dark nextPreviousButton mx-3"];

	createButton(nextAttr, container4, "Next");*/


}


function makeCongratulationPage() {

	$("#div3").empty();

	var container1 = `<div class="container vh-100 d-flex align-items-center justify-content-center">
        <div class="card shadow-lg text-center p-4" style="max-width: 420px;">
            <div class="card-body">

                <div class="mb-3">
                    <span class="fs-1 text-success">✔</span>
                </div>

                <h3 class="card-title text-success mb-3">
                    Congratulations!
                </h3>

                <p class="card-text text-muted">
                    You have successfully completed the training and submitted the exam.
                    <br>
                    Your submission has been recorded.
                </p>

                <div class="d-grid gap-2 mt-4">
                    <a class="btn btn-success">
                        Wait.......
                    </a>
                </div>

            </div>
        </div>
    </div>`;

	$("#div3").append(container1);


}


function makeTestSecondPage() {

	$("#div3").empty();

	var container5 = document.createElement("div");
	var container6 = document.createElement("div");
	var container7 = document.createElement("div");

	container5.setAttribute("id", "container5");
	container6.setAttribute("id", "container6");
	container7.setAttribute("id", "container7");
	container7.setAttribute("class", "d-flex justify-content-between align-items-center p-3 position-absolute bottom-0 my-3 w-100");

	$("#div3").append(container5, container6, container7);

	container5.append("Training & Test Index");

	var headerList = ["S.No", "Resource", "Type", "Description", "Page Number"];
	var searchList = [];
	makeTable(headerList, searchList, "container6", "table1", "100%");

	var previousAttr = ["id", "previous2", "class", "btn btn-dark nextPreviousButton mx-3"];

	createButton(previousAttr, container7, "Previous");

	var nextAttr = ["id", "next2", "class", "btn btn-dark nextPreviousButton mx-3"];

	createButton(nextAttr, container7, "Next");

	getAllSaveResourcesInResourceContainer();

}


async function checkAndEnableButtonWhenVideoWillComplete() {
	const videoElement = $(".videos").get(0);
	let lastTime = 0; // Store the last known time
	let fastForward = false;
	let fastForwardTime = null;


	videoElement.addEventListener("ended", function() {


		console.log(fastForward + " " + fastForwardTime);
		if (!fastForward && fastForwardTime == null) {
			//console.log("runn");
			$("#nextRes").removeAttr("disabled");
			clearInterval(interval);

		} else {
			var time = Math.ceil(fastForwardTime);
			var minSec = getMinAndSecFromSec(time);
			alert("You are fastforwad the video please play back video from " + minSec + " second.");
		}
	});

	// Track if the user fast-forwards
	videoElement.addEventListener("timeupdate", function() {
		const currentTime = videoElement.currentTime;

		if (currentTime > lastTime) {
			// User is playing the video normally or fast-forwarding
			if (currentTime - lastTime > 2) { // Check for fast-forwarding
				console.log("User fast-forwarded the video.");
				fastForward = true;
				if (fastForwardTime == null) {
					fastForwardTime = lastTime;
				}
			}
		} else if (currentTime < lastTime) {
			console.log("User rewound the video.");

			if (fastForwardTime != null && currentTime < fastForwardTime) {
				console.log(fastForwardTime);
				fastForward = false;
				fastForwardTime = null;
			}
		}

		lastTime = currentTime; // Update lastTime
	});

}


function getMinAndSecFromSec(seconds) {

	var min = seconds / 60;
	var second = seconds % 60;

	return Math.floor(min) + " : " + Math.floor(second);

}
function getAllSaveResourcesInResourceContainer() {

	formData = {

		trainingId: examAndTrainingDetails.trainingId,

	}

	$.ajax({
		type: 'post',
		url: '/WebApplication/TrainingAndTest/getAllSavedResourcesByTrainingId',
		data: JSON.stringify(formData),
		async: false,
		contentType: "application/json",
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
			+ '<td data-column="resPath" class="textLeftAlign">' + data[1] + '</td>'
			+ '<td data-column="resType" style="width:100px;">' + data[2] + '</td>'
			+ '<td data-column="resDescription" style="width:300px;" class="textLeftAlign">' + data[3] + '</td>'
			+ '<td data-column="resPageNumber" style="width:100px;">' + data[4] + '</td></tr>';

		$('#' + table).append(row);
	}

}


function makeResourcePage() {

	$("#div3").empty();
	var previousButton;
	if (currentResource <= 1) {
		previousButton = `<button id="previous3" class="btn btn-outline-secondary btn-lg nextPreviousButton">
		            ← Previous
		        </button>`;
	} else {
		previousButton = `<button id="previousRes" class="btn btn-outline-secondary btn-lg nextPreviousButton">
		            ← Previous
		        </button>`;
	}

	var resourcePageDesign = `<div class="container-fluid py-2">
		    <!-- Content Card -->
		    <div class="card shadow-sm border-0 mx-auto">
		        <div class="card-body p-1">
		            <div class="w-100 row align-items-center">
		                <!-- Image Section -->
		                <div class="col-lg-8">
		                    <div class="border rounded p-3 bg-white resourceContainer">
		                    </div>
		                </div>
		                <!-- Text Section -->
		                <div class="col-lg-4">
		                    <h4 class="fw-bold text-primary mb-3">
		                        Training Instruction : 
		                    </h4>
		                    <p class="fs-5 text-dark descriptionContainer h-75">
		                       
		                    </p>
		                    <span class="badge bg-danger fs-6 w-100 mb-auto timer">⏱ 00:00:00</span>
		                </div>
		            </div>
		        </div>
		    </div>
		
		    <!-- Navigation Buttons -->
		    <div class="d-flex justify-content-between align-items-center mt-4 px-3">
				${previousButton}
		        <button id="nextRes" class="btn btn-primary btn-lg px-4 nextPreviousButton">
		            Next →
		        </button>
		        
		        <button id="submitTrainingAndStartExam" class="btn btn-primary btn-lg px-4 nextPreviousButton" style="display: none;">
		            Finish Training & Start Exam
		        </button>
		    </div>
		</div>`;

	$("#div3").append(resourcePageDesign);

	getCurrentSaveResourcesInResourceContainer(currentResource);

	/*	var container7 = document.createElement("div");
		var container8 = document.createElement("div");
		var container9 = document.createElement("div");
		var container10 = document.createElement("div");
	
		container7.setAttribute("class", "d-flex")
		container8.setAttribute("id", "container8");
		container8.setAttribute("class", "descriptionContainer d-flex justify-content-start");
		container9.setAttribute("id", "container9");
		container9.setAttribute("class", "resourceContainer d-flex justify-content-center");
		container10.setAttribute("id", "container10");
		container10.setAttribute("class", "d-flex justify-content-between align-items-center p-3 position-absolute bottom-0 my-3 w-100");
	
		$("#div3").append(container7, container10);
	
		container7.append(container9, container8);
	
		if (currentResource <= 1) {
	
			var previousAttr = ["id", "previous3", "class", "btn btn-dark nextPreviousButton mx-3"];
			createButton(previousAttr, container10, "Previous");
	
		} else {
	
			var previousAttr = ["id", "previousRes", "class", "btn btn-dark nextPreviousButton mx-3"];
			createButton(previousAttr, container10, "Previous Res");
	
		}
	
		var submitTrainingAndStartExamAttr = ["id", "submitTrainingAndStartExam", "class", "btn btn-dark nextPreviousButton mx-3"];
	
		createButton(submitTrainingAndStartExamAttr, container10, "Finish Training & Start Exam");
	
		hideElementById("submitTrainingAndStartExam");
	
		var nextAttr = ["id", "nextRes", "class", "btn btn-dark nextPreviousButton mx-3"];
	
		createButton(nextAttr, container10, "Next");
	
	
		getCurrentSaveResourcesInResourceContainer(currentResource);*/

	interval = setInterval(startTime, 1000);

}




function getCurrentSaveResourcesInResourceContainer(Resource) {
	formData = {
		trainingId: examAndTrainingDetails.trainingId,
		examCompleteStatus: Resource,
	}
	$.ajax({
		type: 'post',
		url: '/WebApplication/TrainingAndTest/getCurrentSavedResourcesByTrainingId',
		data: JSON.stringify(formData),
		async: false,
		contentType: "application/json",
		success: function(response) {
			showAllTheResources(response);
		},
		error: function(response) {
			alert(response.responseText);
		}
	});
}


function showAllTheResources(response) {

	$(".resourceContainer").empty();

	for (var i = 0; i < response.length; i++) {
		var list = response[i]
		$(".descriptionContainer").text(list[4]);
		if (list[2].toLocaleLowerCase() == "video") {
			showVideo(list);
			$("#nextRes").attr("disabled", "disabled");
			checkAndEnableButtonWhenVideoWillComplete();
		} else {
			showImage(list)
		}
	}

}

function showVideo(list) {

	var videoContainer = document.createElement("video");
	var attr = ["id", "video" + list[1] + "", "class", "videos", "controls", "controls", "width", "1920", "height", "1080"]

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
	var attr = ["id", "image" + list[1] + "", "src", "/WebApplication/trainingResouces/" + list[3] + ".png", "class", "images"]

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



function getAllTrainingModelByuser(examStatus) {

	var formData = {
		user: "111",
		examStatus: examStatus
	}

	$.ajax({
		type: 'post',
		url: '/WebApplication/TrainingAndTest/getAllTrainingModelByuser',
		data: JSON.stringify(formData),
		contentType: "application/json",
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

	console.log(response);

	for (var i = 0; i < response.length; i++) {

		var cardClass = getColorClassBYStatus(response[i].examStatus);

		var card = '<div class="col-md-3">' +
			'<div class="card my-3 ' + cardClass + '">' +
			'<div class="card-body" style="height:100px;">' +
			'<h5 class="card-title">Department - ' + (response[i].trainingExamDetails.department.departmentName) + '</h5>' +
			'<p class="card-text">' + (response[i].trainingExamDetails.traningName) + '</p>' +
			'</div>' +
			'<ul class="list-group list-group-flush">' +
			'<li class="list-group-item">Exam Type ' + (response[i].trainingExamDetails.examType) + '</li>' +
			'<li class="list-group-item"><button id="' + response[i].trainingExamDetails.trainingId + '" class="btn btn-dark startTrainingAndTest">Start Training & Test</button></li>' +
			'</ul>' +
			'</div>' +
			'</div>';

		$("#modelContainer").append(card);
	}
}



function getColorClassBYStatus(status) {

	if (status == "0") {
		return "bg-secondary text-white";
	} else if (status == "1") {
		return "bg-warning";
	} else if (status == "2") {
		return "bg-success text-white";
	}

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


function setTextById(id, text) {

	$("#" + id).text(text);

}


function hideElementById(id) {

	$("#" + id).hide();

}

function showElementById(id) {

	$("#" + id).show();

}
