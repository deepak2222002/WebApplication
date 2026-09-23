window.addEventListener('beforeunload', function(event) {
	// Cancel the event
	event.preventDefault();
	// Chrome requires returnValue to be set
	event.returnValue = '';

	// Display the confirmation dialog
	var confirmationMessage = 'Are you sure you want to leave?';
	(event || window.event).returnValue = confirmationMessage; // Standard
	return confirmationMessage; // For some older browsers
});

let feederinterval;
let ledInterval;
var curretDate = '';
var graphNameWithoutSpace = [];
var graphName = [];
var imageWidth = 100;
/*var tableHeadName = ["CKT. No.", "Batch Size", "Lot Size"];
var feederHeadName = ["S.No.", "M. Code", "Description"];
var detalTableHeadName = ["Seq.No.", "Seq. Interchange", "Part Code", "CKT. No.", "Order No.", "Date & Time", "Seq. Change", "Status", "Hold Status (✔)", "Holding Reason", "Machine Shift", "Wire", "Wire Desc.", "Applicator A", "Terminal A", "T.A Desc.", "Swap", "Applicator B", "Terminal B", "T.B Desc.", "Batch Size", "Lot Size"];
var detalFeederHeadName = ["S.No.", "M. Code", "Description", "Qty", "Machine Request (✔)"];
var circuitNumbers = [];
var circuitNumberIndex = 0;
var lineLeaderId = [];
var lineLeader = "";
var lineLeaderIndex = 0;*/
var object;
var machinePrinted = 0;
var tableCountInDiv = 1;
var noOfGraphsInRow = 3;
var graphNameIndex = 1;
var graphIdIndex = 0;
var pagerLength = 0;
var actualColor = "rgba(141,195,232,0.5)";
var targetColor = "rgba(255,99,132,1)";
var actualType = "bar";
var targetType = "line";
var actualBorderWidth = 1;
var targetBorderWidth = 2;

var graphIdIndexForLoadTableData = 0;
var graphNameIndexForLoadTableData = 1;
var wiprejectionresponse;

var resolvedSampleMap = {};
var sampleCountSizeForSP = 0;
// var globalQuantity = 0;

/*var screenFeede = [];
var componentAndQuantity = [];
var object = "";*/



getCurrentDateAndTime();

// Declare this once globally
window.rqcRowDataMap = {};

$(document).on('dblclick', '#table1 tbody tr', function() {
	$(this).addClass('selected').siblings().removeClass('selected');
	row = $(this);
	let rowValues = {}; //An empty object to hold your data
	let temp;
	//gdggaegagagagaegaeggdutdtudutut
	row.find('td').each(function() {
		temp = $(this);
		rowValues[temp.data('column')] = temp.text();
	});

	var text = document.getElementById("masterHeading").innerHTML;
	if (text == "HARNESS WISE TRACKING REPORT") {
		object = rowValues;
		var userResponse = window.confirm("Do you want to open selected row CKT WISE TRACKING REPORT.       Part code = " + object.partCode + " Batch code = " + object.batchCode);

		if (userResponse) {
			var from = $("input[name=from]").val();
			var to = $("input[name=to]").val();

			$("#cktWiseTrackingReport").click();
			$("#backToHarness").css("display", "block");

			setTimeout(function() {
				$('input[title="searchPartCode"]').val(object.partCode);
				$('input[title="searchOrderNo"]').val(object.batchCode);
				$("#from").val(from);
				$("#to").val(to);
				$("#searchButton").click();
			}, 500);
		} else {

		}
	} else if (text == "RECEIVING QUALITY REPORT") {
		object = rowValues;
		// console.log(object);
		//const clickedRow = $(this); // capture `this` here

/*		setTimeout(function() {
			//$("#confirm").modal("show");
			//document.getElementById("confirmationBackdropButton").click();
			$('#confirmationBackdropModal').modal('hide');
		}, 500);*/
		var userResponse = window.confirm("Do you want to open selected row Material Detail Report. Part code = " + object.partNumber + " MRN No. = " + object.batchCode);

		if (userResponse) {
			var from = $("input[name=from]").val();
			var to = $("input[name=to]").val();

			$("#receiveQualityReport").click();
			$("#backToHarness").css("display", "block");

			console.log("object.partNumber",object.partNumber,  "object.batchCode",object.batchCode, "---------------------------------------");
			
			
			setTimeout(async function() {
				
				/*$("#input1").val(partNumber);
				$("#input3").val(batchCode);*/
				
				$("#input1").val(object.partNumber);
				$("#input1").prop("disabled", true);
				
				$("#input3").val(object.batchCode);
				$("#input3").prop("disabled", true);


				console.log("object.partNumber, object.batchCode, object.supplier, object.qty", object.partNumber, object.batchCode, object.supplier, object.qty);
				console.log("1");
				await loadReceiveQualityReportByPartNumber(object.partNumber, object.batchCode, object.supplier, object.qty);
				//loadReceiveQualityReportByPartNumber(object.partNumber, object.batchCode);
				loadPartTotalResult(object.partNumber, object.batchCode);
				
/*				const uiKey = clickedRow.data("uikey"); // use captured row here
				console.log(uiKey);
				// from your <tr>
				const object2 = window.rqcRowDataMap[uiKey];
				//console.log(object2);
				
				// Pass the RQC data object that you already have from previous page
				populateInlineRemarkSection(object2); // `object` contains RQC fields like remark, attachmentPath etc.
*/
			}, 1000);

		} else {

		}
	} else if (text == "FINAL INSPECTION REPORT") {
		object = rowValues;
		var userResponse = window.confirm("Do you want to open selected row Material Detail Report.                   Part code = " + object.partNumber + " Batch code = " + object.batchCode);

		if (userResponse) {
			var from = $("input[name=from]").val();
			var to = $("input[name=to]").val();

			$("#finalInspectionReport").click();
			$("#backToHarness").css("display", "block");

			setTimeout(function() {
				$("#input1").val(object.partNumber);
				$('#input3').val(object.batchCode);

				loadFinalInspectionReportByPartNumber(object.partNumber, object.batchCode);
				loadFinalPartTotalResult(object.partNumber, object.batchCode);

			}, 500);

		} else {

		}
	}
});



$(document).on('click', '#backToHarness', function() {

	var text = document.getElementById("masterHeading").innerHTML;
	if (text == "CKT WISE TRACKING REPORT") {

		var userResponse = window.confirm("Do you really want to go back on harness wise report.");
		if (userResponse) {
			var from = $("input[name=from]").val();
			var to = $("input[name=to]").val();
			var partCode = $('input[title="searchPartCode"]').val() ?? '';
			var batchCode = $('input[title="searchOrderNo"]').val() ?? '';

			$("#hearnessWiseTrackingReport").click();
			$("#planButtonDiv").css("display", "none")

			setTimeout(function() {
				$('input[title="searchPartCode"]').val(partCode);
				$('input[title="searchOrderNo"]').val(batchCode);
				$("#from").val(from);
				$("#to").val(to);
				$("#searchButton").click();
			}, 500);
		} else {

		}
	} else if (text == "RECEIVE QUALITY PRINTING REPORT") {
		var userResponse = window.confirm("Do you really want to go back on Receiving quality report.");
		if (userResponse) {
			var from = $("input[name=from]").val();
			var to = $("input[name=to]").val();
			var partCode = $("input[name=partNumber]").val();
			var batchCode = $("input[name=batchcode]").val();

			$("#receivingQualityReport").click();

			setTimeout(function() {
				//$('input[title="searchPartCode"]').val(partCode);
				//$('input[title="searchBatchCode"]').val(batchCode);
				$("#from").val(from);
				$("#to").val(to);
				$("#searchButton").click();
			}, 500);
		} else {

		}
	} else if (text == "FINAL INSPECTION REPORT") {

		var userResponse = window.confirm("Do you really want to go back on Final Inpection report.");
		if (userResponse) {
			var from = $("input[name=from]").val();
			var to = $("input[name=to]").val();
			var partCode = $("input[name=partNumber]").val();
			var batchCode = $("input[name=batchcode]").val();

			$("#finalInspectionsReport").click();

			setTimeout(function() {
				$('input[title="searchPartCode"]').val(partCode);
				$('input[title="searchBatchCode"]').val(batchCode);
				$("#from").val(from);
				$("#to").val(to);
				$("#searchButton").click();
			}, 500);
		} else {

		}
	}
});



function loadReportsNameAndId() {

	graphName = [];
	graphNameWithoutSpace = [];
	machinePrinted = 0;
	tableCountInDiv = 1;
	noOfGraphsInRow = 3;
	graphNameIndex = 1;
	graphIdIndex = 0;

	$.ajax({
		url: "/WebApplication/Controllers/getAllReportsInList",
		type: 'GET',
		contentType: "application/json",
		dataType: 'json',
		async: false,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {
			for (var i = 0; i < res.length; i++) {
				var str = res[i];
				var id_report = str.split(',');

				for (var j = 0; j < id_report.length - 1; j++) {

					let stringWithSpaces = id_report[j + 1];
					let stringWithoutSpaces = stringWithSpaces.replace(/\s/g, "");
					graphName.push(id_report[j]);
					graphName.push(id_report[j + 1]);
					graphNameWithoutSpace.push(id_report[j]);
					graphNameWithoutSpace.push(stringWithoutSpaces)
				}
			}
		}
	});
}


function loadConveyorGraphNameAndId() {
	graphName = [];
	graphNameWithoutSpace = [];
	machinePrinted = 0;
	tableCountInDiv = 1;
	noOfGraphsInRow = 3;
	graphNameIndex = 1;
	graphIdIndex = 0;

	$.ajax({
		url: "/WebApplication/Controllers/getAllConveyorGraphNameInList",
		type: 'GET',
		contentType: "application/json",
		dataType: 'json',
		async: false,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {
			for (var i = 0; i < res.length; i++) {
				var str = res[i];
				var id_report = str.split(',');

				for (var j = 0; j < id_report.length - 1; j++) {

					let stringWithSpaces = id_report[j + 1];
					let stringWithoutSpaces = stringWithSpaces.replace(/\s/g, "");
					graphName.push(id_report[j]);
					graphName.push(id_report[j + 1]);
					graphNameWithoutSpace.push(id_report[j]);
					graphNameWithoutSpace.push(stringWithoutSpaces)
				}
			}
		}
	});
}



function getCurrentDateAndTime() {

	var formData = {
		lineLeaderId: 1,
	}

	$.ajax({
		type: 'post',
		url: "/WebApplication/Controllers/getCurrentDateAndTime",
		data: JSON.stringify(formData),
		contentType: "application/json",
		async: false,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			curretDate = response;
		},
		error: function(response) {

		}
	});
}



//module modal display
$(document).on('click', '#developer', function() {
	$('#myModal').modal('show');
});

$('.link').off('click').on('click', function(event) {


	var target = event.target.id;

	if (target == "masters") {

		window.location.replace("/WebApplication/loginpage");

		location.href = "/WebApplication/masters/dashboard?token=" + sessionStorage.getItem("token");

	} else if (target == "maintenance") {

		window.location.replace("/WebApplication/maintenance/dashboard?token=" + sessionStorage.getItem("token"));


	} else if (target == "lineleader") {
		window.location.replace("/WebApplication/lineleader/dashboard?token=" + sessionStorage.getItem("token"));


	} else if (target == "feeder") {
		window.location.replace("/WebApplication/feeder/dashboard?token=" + sessionStorage.getItem("token"));

	}
	else if (target == "workinprogress") {
		window.location.replace("/WebApplication/workinprogress/dashboard?token=" + sessionStorage.getItem("token"));

	} else if (target == "lpcqualitychecking") {
		window.location.replace("/WebApplication/lpcqualitychecking/dashboard?token=" + sessionStorage.getItem("token"));


	} else if (target == "receivequalitychecking") {
		window.location.replace("/WebApplication/receivequalitychecking/dashboard?token=" + sessionStorage.getItem("token"));

	} else if (target == "oidsClient") {
		window.location.replace("/WebApplication/jointcrimping/dashboard?token=" + sessionStorage.getItem("token"));

	} else if (target == "reports") {
		window.location.replace("/WebApplication/reports/dashboard?token=" + sessionStorage.getItem("token"));

	} else if (target == "applicatorMonitering") {
		window.location.replace("/WebApplication/applicatormonitoring/dashboard?token=" + sessionStorage.getItem("token"));

	} else if (target == "finalInspection") {
		window.location.replace("/WebApplication/finalinspection/dashboard?token=" + sessionStorage.getItem("token"));

	} else if (target == "manpower") {
		window.location.replace("/WebApplication/manpower/dashboard?token=" + sessionStorage.getItem("token"));
	} else if (target == "manpowerScanningScreen") {
		window.location.replace("/WebApplication/manpowerScanningScreen/dashboard?token=" + sessionStorage.getItem("token"));
	} else if (target == "fg") {
		window.location.replace("/WebApplication/fg?token=" + sessionStorage.getItem("token"));
	}
	else if (target == "applicatorTv") {
		window.location.replace("/WebApplication/applicatordashboard/dashboard?token=" + sessionStorage.getItem("token"));
	}
});




function logout() {
	window.location.replace("/WebApplication/loginpage");
}

function getCurrentDate() {

	var formData = {
		lineLeaderId: 1,
	}
	$.ajax({
		type: 'post',
		url: "/WebApplication/Controllers/getCurrentDate1",
		data: JSON.stringify(formData),
		contentType: "application/json",
		async: false,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			$("#from").val(response);
			$("#to").val(response);
			$("#fromm").val(response);
			$("#too").val(response);
		},
		error: function(response) {

		}
	});
}


/*-----------pagination-------------*/
var lastSequenceNumber = 0;
var lastPage;
var pageSize = 25;
var searchLoad = false; clearInterval(interval);
var sequence = 0;
var interval;
var lastResponseData;
var lastResponseLpc;
var lastResponseConveyerPacking;
var pageChange = false;

$(document).ready(function() {
	function handlePageChange(newPage) {
		var text = $("#masterHeading").text();

		var adjustment = (newPage === 1) ? 0 : (newPage - lastPage) * pageSize;

		if (searchLoad) {
			if (text == "WORK IN PROGRESS REPORT") {
				loadLpcMpcrAssemblyData(newPage);
				lastSequenceNumber += adjustment;
			} else if (text == "LPC QUALITY CHECKING REPORT") {
				loadLikeLPCData(newPage);
				lastSequenceNumber += adjustment;
			} else if (text == "CKT WISE TRACKING REPORT") {
				loadHarnessLiveDataAndPager(newPage);
				lastSequenceNumber += adjustment;
			} else if (text == "CONVEYOR PACKING REPORT") {
				loadLikeConveyorPackData(newPage);
				lastSequenceNumber += adjustment;
			} else if (text == "CONVEYOR RUNNING REPORT") {
				loadLikeConveyorRunningData(newPage);
				lastSequenceNumber += adjustment;
			} else if (text == "CKT PLAN REPORT") {
				loadLikeDateWiseCktPlanData(newPage);
				lastSequenceNumber += adjustment;
			} else if (text == "CONVEYOR REPORT") {
				loadConveyorData(newPage);
				lastSequenceNumber += adjustment;
			} else if (text == "HARNESS WISE TRACKING REPORT") {
				loadHarnessWiseDataAndPager(newPage);
				lastSequenceNumber += adjustment;
			} else if (text == "RECEIVING QUALITY REPORT") {
				loadReceivingQualityReport(newPage);
				lastSequenceNumber += adjustment;
			} else if (currDashboard == "MACHINE DASHBOARD") {
				setMachineDashboardVariables();

			} else if (currDashboard == "CONVEYOR DASHBOARD") {
				setConveyorDashboardVariables();
			} else if (text == "WORK IN PROGRESS REJECTION REPORT") {
				searchWipRejection(newPage);
				lastSequenceNumber += adjustment;
			} else if (text == "MANPOWER DEPLOYMENT REPORT") {
				loadManPowerDeploymentReport(newPage)
				lastSequenceNumber += adjustment;
			} else if (text == "MANPOWER DEPLOYMENT ENTRY REPORT") {
				loadManpowerEntryReport(newPage)
				lastSequenceNumber += adjustment;
			}
		} else {
			if (text == "WORK IN PROGRESS REPORT") {
				loadLpcMpcrAssemblyData(newPage);
				lastSequenceNumber += adjustment;
			} else if (text == "LPC QUALITY CHECKING REPORT") {
				loadLPCReportDataAndPager(newPage);
				lastSequenceNumber += adjustment;
			} else if (text == "CKT WISE TRACKING REPORT") {
				loadHarnessLiveDataAndPager(newPage);
				lastSequenceNumber += adjustment;
			} else if (text == "CONVEYOR PACKING REPORT") {
				loadConveyorPackDataAndPager(newPage);
				lastSequenceNumber += adjustment;
			} else if (text == "CONVEYOR RUNNING REPORT") {
				loadConveyorRunningkDataAndPager(newPage);
				lastSequenceNumber += adjustment;
			} else if (text == "HARNESS WISE TRACKING REPORT") {
				loadHarnessWiseDataAndPager(newPage);
				lastSequenceNumber += adjustment;
			} else if (text == "CKT PLAN REPORT") {
				loadLikeDateWiseCktPlanData(newPage);
				lastSequenceNumber += adjustment;
			} else if (text == "CONVEYOR REPORT") {
				loadConveyorData(newPage);
				lastSequenceNumber += adjustment;
			} else if (text == "RECEIVING QUALITY REPORT") {
				loadReceivingQualityReport(newPage);
				lastSequenceNumber += adjustment;
			} else if (currDashboard == "MACHINE DASHBOARD") {
				setMachineDashboardVariables();

			} else if (currDashboard == "CONVEYOR DASHBOARD") {
				setConveyorDashboardVariables();
			}
			else if (text == "WORK IN PROGRESS REJECTION REPORT") {
				searchWipRejection(newPage);
				lastSequenceNumber += adjustment;
			} else if (text == "MANPOWER DEPLOYMENT REPORT") {
				loadManPowerDeploymentReport(newPage)
				lastSequenceNumber += adjustment;
			} else if (text == "MANPOWER DEPLOYMENT ENTRY REPORT") {
				loadManpowerEntryReport(newPage)
				lastSequenceNumber += adjustment;
			}
		}

		lastSequenceNumber = (newPage - 1) * pageSize + 1; // Reset sequence number for the new page, always starting from 1
		lastPage = newPage;
	}

	$(document).on("change", "#pageSelect", function() {

		setTimeout(function() {
			$("#loadingBackdropModalMessage").text("Getting selected page......");
		}, 1000);

		var selectedPage = parseInt($(this).val());
		handlePageChange(selectedPage);

	});


	$(document).on("click", "#previous", function() {
		var selectedPage = parseInt($("#pageSelect").val());
		if (selectedPage > 0) {
			setTimeout(function() {
				$("#loadingBackdropModalMessage").text("Getting previous page.......");
			}, 1000);
			handlePageChange(selectedPage - 1);
		}
	});


	$(document).on("click", "#next", function() {
		var selectedPage = parseInt($("#pageSelect").val());
		var totalPages = parseInt($("#pageSelect option:last").val());
		if (selectedPage < totalPages) {
			setTimeout(function() {
				$("#loadingBackdropModalMessage").text("Getting next page......");
			}, 1000);
			handlePageChange(selectedPage + 1);
		}
	});
});


$(document).on('click', '.excelDownload', function() {
	var text = document.getElementById("masterHeading").innerHTML;
	// console.log(text);
	if (text == "WORK IN PROGRESS REPORT") {

		var partCode = $('input[title="searchPartCode"]').val() ?? '';
		var batchCode = $('input[title="searchOrderNo"]').val() ?? '';
		var circuitNumber = $('input[title="searchCktNO"]').val() ?? '';
		var from = $("input[name=from]").val();
		var to = $("input[name=to]").val();
		var passingStatus = $('#searchStatus :selected').val();

		if (!from || !to) {
			alert("Please select from and to date to download excel report.");
			return;
		}

		$("#loadingBackdropButton").click();
		$("#loadingBackdropModalMessage").text("Getting excel from selected details.");

		var formData = {
			batchNumber: partCode,
			circuitNumber: circuitNumber,
			batchCode: batchCode,
			passingStatus: passingStatus,
			dateTime: from + "," + to,


		}

		fetch('/WebApplication/Controllers/download/data/wipReport', {
			method: 'POST', // Change method to POST
			headers: {
				'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData)
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
				let currDateTime = new Date();
				link.download = 'Work In Progress Report' + '.xlsx';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				setTimeout(function() {
					$("#loadingBackdropButton").click();
				}, 1000);
			})
			.catch(error => {
				console.error('Error:', error);
				setTimeout(function() {
					$("#loadingBackdropButton").click();
				}, 1000);
			});

	}
	else if (text == "CKT PLAN REPORT") {

		var partCode = $('input[title="searchPartCode"]').val() ?? '';
		var circuitNumber = $('input[title="searchCktNO"]').val() ?? '';
		var batchCode = $('input[title="searchOrderNo"]').val() ?? '';
		var machineNumber = $('input[title="searchMachineNo"]').val() ?? '';
		var from = $("input[name=from]").val();
		var to = $("input[name=to]").val();
		var runningStatus = $('#searchRunningStatus :selected').val();

		if (!from || !to) {
			alert("Please select from and to date to download excel report.");
			return;
		}


		$("#loadingBackdropButton").click();
		$("#loadingBackdropModalMessage").text("Getting excel from selected details.");

		var formData = {
			partCode: partCode,
			circuitNumber: circuitNumber,
			batchCode: batchCode,
			dateTime: from + "," + to,
			runningStatus: runningStatus,
			machine: {
				machineNumber: machineNumber
			}
		}

		fetch('/WebApplication/Controllers/download/data/dateWiseCktPlanReport', {
			method: 'POST', // Change method to POST
			headers: {
				'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData)
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
				let currDateTime = new Date();
				link.download = 'Date Wise Ckt Plan Report' + '.xlsx';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				setTimeout(function() {
					$("#loadingBackdropButton").click();
				}, 1000);
			})
			.catch(error => {
				console.error('Error:', error);
				setTimeout(function() {
					$("#loadingBackdropButton").click();
				}, 1000);
			});

	}
	else if (text == "CKT WISE TRACKING REPORT") {

		var partNumber = $('input[title="searchPartCode"]').val() ?? '';
		var batchCode = $('input[title="searchOrderNo"]').val() ?? '';
		var from = $("input[name=from]").val();
		var to = $("input[name=to]").val();

		if (!from || !to) {
			alert("Please select from and to date to download excel report.");
			return;
		}

		$("#loadingBackdropButton").click();
		$("#loadingBackdropModalMessage").text("Getting excel from selected details.");

		var formData = {
			mindaPart: partNumber,
			customerPart: batchCode,
			dateTime: from + "," + to,
		}



		fetch('/WebApplication/Controllers/download/data/cktWiseTrackingReport', {
			method: 'POST', // Change method to POST
			headers: {
				'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData)
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
				let currDateTime = new Date();
				link.download = 'CKT Wise tracking report' + '.xlsx';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				setTimeout(function() {
					$("#loadingBackdropButton").click();
				}, 1000);
			})
			.catch(error => {
				console.error('Error:', error);
				setTimeout(function() {
					$("#loadingBackdropButton").click();
				}, 1000);
			});

	} else if (text == "HARNESS WISE TRACKING REPORT") {

		var partNumber = $('input[title="searchPartCode"]').val() ?? '';
		var batchCode = $('input[title="searchOrderNo"]').val() ?? '';
		var from = $("input[name=from]").val();
		var to = $("input[name=to]").val();

		if (!from || !to) {
			alert("Please select from and to date to download excel report.");
			return;
		}

		$("#loadingBackdropButton").click();
		$("#loadingBackdropModalMessage").text("Getting excel from selected details.");

		var formData = {
			mindaPart: partNumber,
			customerPart: batchCode,
			dateTime: from + "," + to,
		}



		fetch('/WebApplication/Controllers/download/data/harnessWiseTrackingReport', {
			method: 'POST', // Change method to POST
			headers: {
				'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData)
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
				let currDateTime = new Date();
				link.download = 'Harness Wise tracking report' + '.xlsx';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				setTimeout(function() {
					$("#loadingBackdropButton").click();
				}, 1000);
			})
			.catch(error => {
				console.error('Error:', error);
				setTimeout(function() {
					$("#loadingBackdropButton").click();
				}, 1000);
			});

	}
	else if (text == "RECEIVING QUALITY REPORT") {

		var partNumber = $('input[title="searchPartCode"]').val() ?? '';
		var batchCode = $('input[title="searchBatchCode"]').val() ?? '';
		var result = $('input[title="searchResult"]').val() ?? '';
		var from = $("input[name=from]").val();
		var to = $("input[name=to]").val();
		var mrnDate = $('input[title="searchMRNDate"]').val() ?? '';   // 👈 added
		var supplier = $('input[title="searchSupplier"]').val() ?? ''; // 👈 added

		if (!from || !to) {
			alert("Please select the date to get Receiving quality data.");
			return false;
		}

		$("#loadingBackdropButton").click();
		$("#loadingBackdropModalMessage").text("Getting Receiving Quality Report.");

		var formData = {
			partNumber: partNumber,
			batchCode: batchCode,
			result: result,
			mrnDate: mrnDate,  
			supplier: supplier, 
			datetime: from + "," + to
		};

		console.log(formData);

		fetch('/WebApplication/Controllers/download/data/receivingQualityReport', {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData)
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
				let currDateTime = new Date();
				link.download = 'Receving Quality report' + '.xlsx';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				setTimeout(function() {
					$("#loadingBackdropButton").click();
				}, 1000);
			})
			.catch(error => {
				console.error('Error:', error);
				setTimeout(function() {
					$("#loadingBackdropButton").click();
				}, 1000);
			});

	} else if (text == "FINAL INSPECTION REPORT") {

		var partNumber = $('input[title="searchPartCode"]').val() ?? '';
		var batchCode = $('input[title="searchBatchCode"]').val() ?? '';
		var result = $('input[title="searchResult"]').val() ?? '';
		var from = $("input[name=from]").val();
		var to = $("input[name=to]").val();

		if (!from || !to) {
			alert("Please select the date to get Receiving quality data.");
			return false;
		}

		$("#loadingBackdropButton").click();
		$("#loadingBackdropModalMessage").text("Getting Final Inspection Report.");

		var formData = {
			partNumber: partNumber,
			batchCode: batchCode,
			result: result,
			datetime: from + "," + to
		};

		// console.log(formData);

		fetch('/WebApplication/Controllers/download/data/finalInspectionReport', {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData)
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
				let currDateTime = new Date();
				link.download = 'Final Inspection report' + '.xlsx';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				setTimeout(function() {
					$("#loadingBackdropButton").click();
				}, 1000);
			})
			.catch(error => {
				console.error('Error:', error);
				setTimeout(function() {
					$("#loadingBackdropButton").click();
				}, 1000);
			});

	} else if (text == "CONVEYOR REPORT") {

		var lineNumber = $('input[title="searchLineNo"]').val() ?? '';
		var mindaPart = $('input[title="searchMindaPart"]').val() ?? '';
		var customerPart = $('input[title="searchCustomerPart"]').val() ?? '';
		var from = $("input[name=from]").val();
		var to = $("input[name=to]").val();

		if (!from || !to) {
			alert("Please select date to get date wise ckt plan report.");
			return;
		}

		if (lineNumber == "" && mindaPart == "" && customerPart == "" && !from && !to) {
			$("#conveyorReport").click();
			return;
		}


		$("#loadingBackdropButton").click();
		$("#loadingBackdropModalMessage").text("Getting Conveyor Report.");

		var formData = {
			lineNumber: lineNumber,
			mindaPart: mindaPart,
			customerPart: customerPart,
			shiftStartTime: from + "," + to,
		}

		console.log(formData);

		fetch('/WebApplication/Controllers/download/data/conveyerreport', {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData)
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
				let currDateTime = new Date();
				link.download = 'Conveyer report' + '.xlsx';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				setTimeout(function() {
					$("#loadingBackdropButton").click();
				}, 1000);
			})
			.catch(error => {
				console.error('Error:', error);
				setTimeout(function() {
					$("#loadingBackdropButton").click();
				}, 1000);
			});

	} else if (text == "WORK IN PROGRESS REJECTION REPORT") {

		var fromDate = $("#from").val();
		var toDate = $("#to").val();
		var partCode = $('input[title="searchPartCode"]').val() ?? '';

		if (!fromDate || !toDate) {
			alert("Please select date to get date wise ckt plan report.");
			return;
		}


		var formData = {
			fromDate: fromDate,
			toDate: toDate,
			partCode: partCode
		};

		$("#loadingBackdropButton").click();
		$("#loadingBackdropModalMessage").text("Getting Wip rejection Report.");

		fetch('/WebApplication/Controllers/download/data/wiprejectionreportexcel', {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData)
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
				let currDateTime = new Date();
				link.download = 'Wip rejection report' + '.xlsx';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				setTimeout(function() {
					$("#loadingBackdropButton").click();
				}, 1000);
			})
			.catch(error => {
				console.error('Error:', error);
				setTimeout(function() {
					$("#loadingBackdropButton").click();
				}, 1000);
			});
	} else if (text == "IOT DASHBOARD - LPC SECTION") {
		iotMachineDashboardDifferenceForExcel();
	} else if (text == "IOT DASHBOARD - ASSEMBLY SECTION") {
		iotConveyorDashboardDifferenceForExcel();
	} else if (text == "MANPOWER SHORTAGE REPORT") { downloadManpowerShortageReportDataAsExcel(manpowerresponse) }

	else if (text == "MANPOWER DEPLOYMENT REPORT") {
		console.log("text: ", text);
		var conveyor = $('input[title="searchConveyor"]').val() ?? '';
		var station = $('input[title="searchStation"]').val() ?? '';
		var employee = $('input[title="searchEmployee"]').val() ?? '';
		var from = $("input[name=from]").val();
		var to = $("input[name=to]").val();

		if (!from || !to) {
			alert("Please select the date to get Receiving quality data.");
			return false;
		}

		$("#loadingBackdropButton").click();
		$("#loadingBackdropModalMessage").text("Getting Receiving Quality Report.");

		var formdata = {

			"lineStation": {
				"line": {
					"lineName": conveyor
				},
				"operation": {
					"operation": station
				}
			},
			"loginIn": {
				"employeeId": employee
			},
			"dateTime": from + "," + to


		}


		console.log(formdata);


		fetch('/WebApplication/Controllers/download/data/dataManPowerReport', {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formdata)
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
				let currDateTime = new Date();
				link.download = 'ManPower Deployment report' + '.xlsx';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				setTimeout(function() {
					$("#loadingBackdropButton").click();
				}, 1000);
			})
			.catch(error => {
				console.error('Error:', error);
				setTimeout(function() {
					$("#loadingBackdropButton").click();
				}, 1000);
			});

	} else if (text == "MANPOWER DEPLOYMENT ENTRY REPORT") {
		console.log("text: ", text);
		var conveyor = $('input[title="searchConveyor"]').val() ?? '';
		var employee = $('input[title="searchEmployee"]').val() ?? '';
		var from = $("input[name=from]").val();
		var to = $("input[name=to]").val();

		if (!from || !to) {
			alert("Please select the date to get Receiving quality data.");
			return false;
		}

		$("#loadingBackdropButton").click();
		$("#loadingBackdropModalMessage").text("Getting Receiving Quality Report.");

		var formdata = {


			employeeId: employee,
			macConv: conveyor,
			"dateTime": from + "," + to


		}

		console.log(formdata);


		fetch('/WebApplication/Controllers/download/data/manpowerEntryReport', {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formdata)
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
				let currDateTime = new Date();
				link.download = 'ManPower Deployment Entry report' + '.xlsx';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				setTimeout(function() {
					$("#loadingBackdropButton").click();
				}, 1000);
			})
			.catch(error => {
				console.error('Error:', error);
				setTimeout(function() {
					$("#loadingBackdropButton").click();
				}, 1000);
			});

	}
});



$(document).on('input', '.searchFilterClass', function() {
	var text = document.getElementById("masterHeading").innerHTML;
	if (text == "PLANT MASTER") {
		loadLikePlantData(0);
	} else if (text == "WORK IN PROGRESS REPORT") {
		/*loadLpcMpcrAssemblyData*/
	} else if (text == "LPC QUALITY CHECKING REPORT") {
		loadLikeLPCData(0);
		loadLikeLPCDataforexcel();
	} else if (text == "PRODUCT MASTER") {
		loadLikeProductData(0);
	} /*else if (text == "CONVEYOR PACKING REPORT") {
		loadLikeConveyorPackData(0);
	}*/ else if (text == "CONVEYOR RUNNING REPORT") {
		loadLikeConveyorRunningData(0);
	}
});





$(document).ready(function() {
	$(document).on('click', '#wipReport', function() {

		searchLoad = false; clearInterval(interval);

		$("#planDateDiv").css("display", "block");
		$("#pagerDiv").css("display", "block");
		$("#printPreview").css("display", "none");
		$("#pageSelect").css("display", "block");
		$("#next").css("display", "block");
		$("#previous").css("display", "block");
		$("#backToHarness").css("display", "none");
		$("#toggleActionFilterBtn").closest(".switch").css("display", "none");
				
		clearInterval(interval);
		$("#offcanvasCloseButton").click();

		var child1 = document.getElementById("div3");
		var child2 = document.getElementById("div4");

		child1.remove();
		if (child2) { child2.remove(); }

		document.getElementById("masterHeading").innerText = "";
		$("#masterHeading").append("WORK IN PROGRESS REPORT");

		var div3 = document.createElement("div");
		var div4 = document.createElement("div");

		$("#div2").append(div3, div4);

		div3.setAttribute("id", "div3");
		div3.setAttribute("class", "masterBody");

		div4.setAttribute("id", "div4");
		div4.setAttribute("class", "masterBody");
		div4.setAttribute("Style", "overflow-y:scroll; display:none;");

		var bottom = document.createElement("div");

		bottom.setAttribute("id", "bottom");
		/*	bottom.setAttribute("style","height: 50%;")*/

		$("#div4").append(bottom);

		var element1 = document.createElement("table");
		$("#div3").append(element1);
		element1.setAttribute("id", "table1");
		element1.setAttribute("cellspacing", "0px");
		/*element1.setAttribute("cellpaddding","10px");*/
		element1.setAttribute("class", "table-hover");

		var w = window.innerWidth;

		if (w < 500) {
			element1.setAttribute("style", "width:300%;");
		} else if (w < 1100) {
			element1.setAttribute("style", "width:250%;");
		}
		else if (w < 1500) {
			element1.setAttribute("style", "width:100%;");
		} else if (w < 1000) {
			element1.setAttribute("style", "width:150%;");
		} else {
			element1.setAttribute("style", "width:100%;");
		}


		var element1_1 = document.createElement("thead");
		element1.append(element1_1);

		var element1_2 = document.createElement("tr");


		var element1_3 = document.createElement("tbody");
		element1.append(element1_3)
		element1_3.setAttribute("id", "tableBody");

		// search
		/*********************/


		var searchRow = document.createElement("tr");
		searchRow.setAttribute("id", "searchRow");
		var tr = document.createElement("th");
		tr.setAttribute("class", "tableheading");
		var img = document.createElement("img");
		img.setAttribute("src", "/WebApplication/images/searchFilter.png");
		img.setAttribute("id", "searchButton");
		img.setAttribute("width", "22");
		img.setAttribute("height", "22");
		tr.append(img);
		searchRow.append(tr);

		var searchTitles = ["searchPartCode", "searchCktNumber", "searchBatchCode", "searchBatchNumber", "searchBatchSize", "searchLotSize", "fromTo"];

		for (var i = 0; i < searchTitles.length; i++) {

			if (searchTitles[i] == "") {

				var searchContainer = document.createElement("th");
				searchContainer.setAttribute("class", "tableheading");

				searchRow.append(searchContainer);

			} else if (searchTitles[i] == "fromTo") {
				var th = document.createElement("th");
				th.setAttribute("class", "tableheading");
				th.setAttribute("style", "width:60px;");


				var th2 = document.createElement("th");
				th2.setAttribute("class", "tableheading");
				th2.setAttribute("style", "width:60px;");

				var input = document.createElement("input");
				input.setAttribute("type", "date");
				input.setAttribute("style", "width:100%;");
				input.setAttribute("name", "from");
				input.setAttribute("class", "searchFilterClass");
				th.append(input);

				var input2 = document.createElement("input");
				input2.setAttribute("type", "date");
				input2.setAttribute("style", "width:100%;");
				input2.setAttribute("name", "to");
				input2.setAttribute("class", "searchFilterClass");
				th2.append(input2);

				searchRow.append(th, th2);

			} else {
				var dataList = document.createElement("datalist");
				var searchContainer = document.createElement("th");
				searchContainer.setAttribute("class", "tableheading");
				var searchinput = document.createElement("input");
				searchinput.setAttribute("style", "width:100%;");
				searchinput.setAttribute("title", searchTitles[i]);
				searchinput.setAttribute("list", searchTitles[i]);
				searchinput.setAttribute("class", "searchFilterClass inputs");
				searchContainer.append(searchinput, dataList);

				var dataListAttr = ["id", searchTitles[i]];
				for (var j = 0; j <= dataListAttr.length - 1; j = j + 2) {
					for (var k = 0; k <= j; k = k + 2) {
						dataList.setAttribute(dataListAttr[j], dataListAttr[k + 1]);

					}
				}
				searchRow.append(searchContainer);
			}
		}

		element1_1.append(searchRow);

		/*********************/
		element1_1.append(element1_2);

		var element2 = document.createElement("th");
		element2.innerText = "S.No.";
		var element3 = document.createElement("th");
		element3.innerText = "Part Code";
		var element4 = document.createElement("th");
		element4.innerText = "CKT Number";
		var element5 = document.createElement("th");
		element5.innerText = "Batch Code";
		var element6 = document.createElement("th");
		element6.innerText = "Bunch No";
		var element7 = document.createElement("th");
		element7.innerText = "Bunch Size ";
		var element8 = document.createElement("th");
		element8.innerText = "Lot Size";
		var element9 = document.createElement("th");
		element9.innerText = "Date & Time";
		var element9_2 = document.createElement("th");
		element9_2.innerText = "Id";


		element1_2.append(element2, element3, element4, element5, element6, element7, element8, element9, element9_2);
		element2.setAttribute("class", "tableheading");
		// element2.setAttribute("scope","col");
		element3.setAttribute("class", "tableheading");
		// element3.setAttribute("scope","col");
		element4.setAttribute("class", "tableheading");
		// element4.setAttribute("scope","col");
		element5.setAttribute("class", "tableheading");
		// element5.setAttribute("scope","col");
		element6.setAttribute("class", "tableheading");
		// element6.setAttribute("scope","col");
		element7.setAttribute("class", "tableheading");
		// element7.setAttribute("scope","col");
		element8.setAttribute("class", "tableheading");
		// element8.setAttribute("scope","col");
		element9.setAttribute("class", "tableheading");
		element9.setAttribute("colspan", "2");
		element9_2.setAttribute("class", "tableheading");
		element9_2.setAttribute("style", "display:none;");
		// element9.setAttribute("scope","col");

		var element18_2 = document.createElement("div");
		element18_2.setAttribute("class", "buttonsContainer");

		var element41 = document.createElement("div");
		element41.setAttribute("class", "buttonsContainer");

		var element44 = document.createElement("button");
		element44.setAttribute("class", "data");
		element44.setAttribute("title", "Excel Download");

		element41.append(element44);
		element18_2.append(element41);

		$("#bottom").append(element18_2);


		$("#pageSelect").empty();
		loadWIPReportDataAndPager(0);


	});

	$(document).on('click', '#liveMachineStatus', function() {
		searchLoad = false;
		clearInterval(interval);


		$(".fromTo").css("display", "none");
		$("#excelDownload").css("display", "none");
		$("#pageSelect").css("display", "none");
		$("#printPreview").css("display", "none");
		$("#next").css("display", "none");
		$("#previous").css("display", "none");
		$("#backToHarness").css("display", "none");
		$("#offcanvasCloseButton").click();

		document.getElementById("masterHeading").innerText = "";
		$("#masterHeading").append("LIVE MACHINE STATUS");

		var child1 = document.getElementById("div3");
		child1.remove();
		var child2 = document.getElementById("div4");
		if (child2) {
			child2.remove();
		}

		var div3 = document.createElement("div");
		div3.setAttribute("style", "width:100%;");
		$("#div2").append(div3);

		div3.setAttribute("id", "div3");
		div3.setAttribute("class", "masterBody grid-container");
		var response = getAllMachineStatusData();

		var numberOfMachines = response.length;

		for (var i = 1; i <= numberOfMachines; i++) {
			var machineDiv = document.createElement("div");
			machineDiv.setAttribute("id", "machineDiv" + i);
			machineDiv.setAttribute("class", "machineDiv");
			div3.append(machineDiv);
		}

		buildMachineBlocks(numberOfMachines);
		interval = setInterval(function() {
			buildMachineBlocks(numberOfMachines);
		}, 3000);
	});

	$(document).on('click', '#liveConveyorStatus', function() {
		searchLoad = false;
		clearInterval(interval);

		$(".fromTo").css("display", "none");
		$("#excelDownload").css("display", "none");
		$("#pageSelect").css("display", "none");
		$("#printPreview").css("display", "none");
		$("#next").css("display", "none");
		$("#previous").css("display", "none");
		$("#backToHarness").css("display", "none");
		$("#offcanvasCloseButton").click();

		document.getElementById("masterHeading").innerText = "";
		$("#masterHeading").append("LIVE CONVEYOR STATUS");

		var child1 = document.getElementById("div3");
		child1.remove();
		var child2 = document.getElementById("div4");
		if (child2) {
			child2.remove();
		}

		var div3 = document.createElement("div");
		div3.setAttribute("style", "width:100%;");
		$("#div2").append(div3);

		div3.setAttribute("id", "div3");
		div3.setAttribute("class", "masterBody grid-container");
		var response = getAllConveyorStatusData();

		var numberOfConveyors = response.length;

		for (var i = 1; i <= numberOfConveyors; i++) {
			var machineDiv = document.createElement("div");
			machineDiv.setAttribute("id", "machineDiv" + i);
			machineDiv.setAttribute("class", "machineDiv");
			div3.append(machineDiv);
		}

		buildConveyorBlocks(numberOfConveyors);
		interval = setInterval(function() {
			buildConveyorBlocks(numberOfConveyors);
		}, 3000);
	});

	$(document).on('click', '#machineDashboard', function() {
		searchLoad = false;
		clearInterval(interval);
		currDashboard = "MACHINE DASHBOARD";

		$(".fromTo").css("display", "none");
		$("#excelDownload").css("display", "none");
		$("#pageSelect").css("display", "block");
		$("#printPreview").css("display", "none");
		$("#next").css("display", "none");
		$("#previous").css("display", "none");
		$("#backToHarness").css("display", "none");
		$("#offcanvasCloseButton").click();

		document.getElementById("masterHeading").innerText = "";
		$("#masterHeading").append("MACHINE DASHBOARD");

		var child1 = document.getElementById("div3");
		child1.remove();
		var child2 = document.getElementById("div4");
		if (child2) {
			child2.remove();
		}

		var div3 = document.createElement("div");
		div3.setAttribute("style", "width:100%;");
		$("#div2").append(div3);

		div3.setAttribute("id", "div3");
		div3.setAttribute("class", "masterBody dashboard-containers");

		var divIds = ["divA", "divB", "divC", "divD", "divE", "divF"];

		for (var i = 0; i < divIds.length; i++) {
			var div = document.createElement("div");
			div.setAttribute("id", divIds[i]);
			div.setAttribute("class", "dashboardDiv");
			div3.append(div);
		}
		setMachineDashboardVariablesAndPager();
	});

	$(document).on('click', '#conveyorDashboard', function() {
		searchLoad = false;
		clearInterval(interval);
		currDashboard = "CONVEYOR DASHBOARD";

		$(".fromTo").css("display", "none");
		$("#excelDownload").css("display", "none");
		$("#pageSelect").css("display", "block");
		$("#printPreview").css("display", "none");
		$("#next").css("display", "none");
		$("#previous").css("display", "none");
		$("#backToHarness").css("display", "none");
		$("#offcanvasCloseButton").click();

		document.getElementById("masterHeading").innerText = "";
		$("#masterHeading").append("CONVEYOR DASHBOARD");

		var child1 = document.getElementById("div3");
		child1.remove();
		var child2 = document.getElementById("div4");
		if (child2) {
			child2.remove();
		}

		var div3 = document.createElement("div");
		div3.setAttribute("style", "width:100%;");
		$("#div2").append(div3);

		div3.setAttribute("id", "div3");
		div3.setAttribute("class", "masterBody dashboard-containers");

		var divIds = ["divA", "divB", "divC", "divD", "divE", "divF"];

		for (var i = 0; i < divIds.length; i++) {
			var div = document.createElement("div");
			div.setAttribute("id", divIds[i]);
			div.setAttribute("class", "dashboardDiv");
			div3.append(div);
		}
		setConveyorDashboardVariablesAndPager();
	});

});

/* Dashboard Variables */
var machineDashboardHeader = "";
var currStatus = [];
var prodValues = [];
var prodLabels = [];
var currJob = [];
var breakdownValues = [];
var breakdownLabels = [];
var mcStatusValues = [];
var mcStatusLabels = ["Run Time (mins)", "Stop Time (mins)"];
var convStatusLabels = ["Run Time", "Stop Time", "Brk Time (mins)"];
var oaeValues = [];
var oaeLabels = ['OAE', 'Avail', 'Prod', 'Qlty', 'OEE'];
var oleLabels = ['Avail', 'Prod', 'Qlty', 'OAE', 'OLE'];
var borderColors = [];
var bgColors = [];
var currDashboard;
var axisLabels = [];

/**************  Conveyor Dashboard ****************/

function setConveyorDashboardVariablesAndPager() {
	var formData = {
		lineNumber: "",
	}
	$.ajax({
		url: "/WebApplication/Controllers/getConveyorDashboardData",
		type: 'POST',
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		data: JSON.stringify(formData),
		async: false,
		success: function(res) {
			$("#pageSelect").empty();
			for (var i = 0; i < res.length; i++) {
				$("#pageSelect").append(
					"<option value='" + res[i].lineNumber + "' style='padding:2px; font-weight: 300; color: rgb(40, 40, 40);'>" + res[i].lineName + "</option>"
				);
			}
			$("#pageSelect").val("001");

			setConveyorDashboardVariables();
		},
		error: function(e) {
			alert("Something went wrong ⚠️");
		}
	});
}

function setConveyorDashboardVariables() {
	var lineNumber = $('select[id="pageSelect"] :selected').val();

	// bar gaph axis label set
	if (lineNumber == '001') {
		axisLabels = ['Production (Packaging)', 'Conveyors', 'B/D Conveyors', 'Time(in mins)'];
	} else {
		axisLabels = ['Production (Packaging)', 'Time (in hrs)', 'Breakdowns', 'Time(in mins)'];
	}


	var formData = {
		lineNumber: lineNumber,
	}
	$.ajax({
		url: "/WebApplication/Controllers/getConveyorDashboardData",
		type: 'POST',
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		data: JSON.stringify(formData),
		success: function(res) {
			setConveyorDashboardData(res[0]);
		},
		error: function(e) {
			alert("Something went wrong ⚠️");
		}
	});
}

function setConveyorDashboardData(data) {
	resetMachineDashboardVariables();
	machineDashboardHeader = data.lineModel.toUpperCase();

	//mcStatusSummary
	mcStatusValues.push(parseInt(data.runningTime), parseInt(data.stopTime), parseInt(data.breakTime));

	// ole
	var ole = parseInt((parseInt(data.quality) * parseInt(data.productivity) * parseInt(data.availability)) / 10000);
	var oae = (parseInt(data.availability) * ole) / 100;
	oaeValues.push(data.availability, data.productivity, data.quality, oae, ole);

	// currJob
	currJob.push("Model Name", data.model, "Minda Part", data.partCode, "Cust. Part", data.customerPartNumber, "Ciruit Testing", data.circuitTest, "Cony. Count", data.coveyorCount);

	// currStatus
	var progress;
	if (parseInt(data.avgCycleTime) <= 0) {
		progress = 0;
	} else {
		progress = parseInt((parseInt(data.desireCycleTime) / parseInt(data.avgCycleTime)) * 100);
	}
	currStatus.push("Current Status", data.status, "Desired CT", data.desireCycleTime, "Avg CT", data.avgCycleTime, "Packaging", data.packing, "Progress", progress);

	// downtime
	const breakpoint = /\<&>|\@&@/
	var bdData = data.downtime.split(breakpoint);
	for (var i = 0; i < bdData.length - 1; i += 2) {
		breakdownLabels.push(bdData[i]);
		breakdownValues.push(parseInt(bdData[i + 1]));
	}

	// productionPerHour
	var prodArr = data.productionPerHour.split(breakpoint)
	for (var i = 0; i < prodArr.length - 1; i += 2) {
		prodLabels.push(prodArr[i]);
		prodValues.push(prodArr[i + 1]);
	}

	$("#masterHeading").append(machineDashboardHeader);
	$("#divA").append(buildConveyorCurrStatusDiv(currStatus));
	$("#divD").append(buildConveyorCurrJobDiv(currJob));
	$("#divE").append(buildConveyorDowntimeDiv(breakdownValues, breakdownLabels));
	$("#divC").append(buildConveyorStatusSummaryDiv(mcStatusValues, convStatusLabels));
	$("#divB").append(buildConveyorProdPerHourDiv(prodValues, prodLabels));
	$("#divF").append(buildConveyorOleChartDiv(oaeValues, oleLabels));

}

/*function buildConveyorOleChartDiv(dataValues, labels) {
	var mainDiv = document.createElement("div");
	mainDiv.setAttribute("id", "oleMainDiv");
	mainDiv.setAttribute("class", "oleMainDiv");
	mainDiv.setAttribute("style", "width:100%; height:100%");

	var div1 = document.createElement("div");
	div1.setAttribute("id", "oleDiv1");
	div1.setAttribute("class", "oleDivs");

	var div2 = document.createElement("div");
	div2.setAttribute("id", "oleDiv2");
	div2.setAttribute("class", "oleDivs");

	mainDiv.append(div1, div2);
	var max = 100;

	var avblCanvas = document.createElement("canvas");
	avblCanvas.setAttribute("id", "avblCanvas");
	div1.append(avblCanvas);

	//window.myGauge = new Chart(avblCanvas.getContext('2d'), config);

	//var ctx = document.getElementById('avblDiv').getContext('2d');

	var ctx = avblCanvas.getContext('2d');

	new Chart(ctx, {
		type: 'gauge',
		data: {
			datasets: [{
				data: [45, max],
				value: 45,
				backgroundColor: ['#4dee4d', 'lightgrey'],
				borderWidth: 0,
			}]
		},
		options: {
			responsive: true,
			title: {
				display: true,
				text: 'Avail%',
				fontSize: 28,
				padding: 0,
			},
			needle: {
				radiusPercentage: 1,
				widthPercentage: 3,
				lengthPercentage: 95,
				color: '#000000',
				padding: 0,
			},
			valueLabel: {
				display: true,
			},
			cutoutPercentage: 75

		}
	}
	);

	return mainDiv;
}*/

function buildConveyorOleChartDiv(dataValues, labels) {
	var colors = ['rgba(255, 160, 6,1)', 'rgba(0,255,0,0.8)', 'rgba(8, 206, 255, 1)', 'rgba(255, 228, 11,1)', '#fca4f1', '#00000000'];
	var labelx = [...labels];

	labelx.forEach((element, index) => {
		labelx[index] = element + " " + parseInt(dataValues[index]) + "%";
	});
	var data = [];
	for (var i = 0; i < 5; i++) {
		var arr = ['0', '0', '0', '0', '0', '0'];
		arr[i] = parseInt(dataValues[i]);
		arr[arr.length - 1] = (100 - parseInt(dataValues[i])) + '';

		data.push(arr);
	}

	var canvas = document.createElement('canvas'); // Create canvas element
	canvas.id = "oleChartCanvas" // Assign an ID
	canvas.style.width = "100%";
	const ctx = canvas.getContext('2d');
	new Chart(ctx, {
		type: 'doughnut',
		data: {
			labels: labelx,
			datasets: [
				{
					data: data[0],
					backgroundColor: colors,
					borderRadius: 50,
					cutout: '10%',
				}, {
					weight: 0.3
				},
				{
					data: data[1],
					backgroundColor: colors,
					borderRadius: 50,

					cutout: '10%',
				}, {
					weight: 0.2
				},
				{
					data: data[2],
					backgroundColor: colors,
					borderRadius: 50,

					cutout: '10%',
				}, {
					weight: 0.4
				},
				{
					data: data[3],
					backgroundColor: colors,
					borderRadius: 50,

					cutout: '10%',
				}, {
					weight: 0.4
				},
				{
					data: data[4],
					backgroundColor: colors,
					borderRadius: 50,

					cutout: '10%',
				}
			]
		},
		options: {
			responsive: true,
			plugins: {
				title: {
					display: true,
				},
				datalabels: {
					display: false,
				},
				legend: {
					position: 'bottom',
					align: "center",
					labels: {
						usePointStyle: true,
					}
				},
			},
		}
	});
	return canvas;
}


function buildConveyorProdPerHourDiv(dataValues, labels) {
	var canvas = document.createElement('canvas'); // Create canvas element
	canvas.id = "productionPreHourCanvas" // Assign an ID
	canvas.setAttribute("style", "width: 100%;")
	Chart.register(ChartDataLabels);
	new Chart(canvas, {
		type: 'bar',
		data: {
			labels: labels,
			datasets: [{
				data: dataValues,
				backgroundColor: 'rgba(8, 206, 255, 0.5)',
				borderColor: 'rgba(135, 206, 235, 1)',
				borderWidth: 1,
			}]
		},
		options: {
			responsive: true,
			plugins: {
				title: {
					display: true,
					text: "Production",
					padding: {
						top: 10,
						bottom: 25,
						left: 0,
						right: 0
					},
					font: {
						size: 16,
					}
				},
				datalabels: {
					anchor: 'end',
					align: 'end',
					color: 'rgba(0,0,0,0.6)',
					font: {
						weight: 'bold',
					},
					formatter: function(value, context) {
						return value;
					}
				},
				legend: {
					display: false
				},
			},
			scales: {
				y: {
					beginAtZero: true,
					title: {
						display: true,
						text: axisLabels[0],
					},
					grid: {
						display: false
					},
				},
				x: {
					title: {
						display: true,
						text: axisLabels[1],
					},
					grid: {
						display: false
					},
				}
			}
		}
	});

	return canvas;
}

function buildConveyorStatusSummaryDiv(dataValues, labels) {
	var canvas = document.createElement('canvas');
	canvas.id = "mcStatusSummaryCanvas"; // Assign an ID
	canvas.style.width = "100%";

	new Chart(canvas.getContext("2d"), {
		type: "pie",
		data: {
			labels: labels,
			datasets: [{
				data: dataValues,
				backgroundColor: [
					'rgba(0,255,0,0.7)',
					'rgba(255,0,0,0.6)',
					'rgba(255,255,0,0.7)',
				]
			}]
		},
		options: {
			plugins: {
				title: {
					display: true,
					text: "Conveyor Status Summary",
					position: 'top',
					align: 'center',
					font: {
						size: 16,
					}
				},
				datalabels: {
					color: 'black',
					font: {
						weight: 'bold',
					},
					backgroundColor: 'white',
					borderRadius: 6,
				},
				legend: {
					position: 'bottom',
					align: "center",
					labels: {
						usePointStyle: true,
					}
				},
			}
		}
	});
	return canvas;
}

function buildConveyorDowntimeDiv(dataValues, labels) {
	generateRandomColor(labels.length);
	var canvas = document.createElement('canvas'); // Create canvas element
	canvas.id = "downtimeCanvas" // Assign an ID
	canvas.setAttribute("style", "width: 100%;");
	Chart.register(ChartDataLabels);
	new Chart(canvas, {
		type: 'bar',
		data: {
			labels: labels,
			datasets: [{
				axis: 'y',
				data: dataValues,
				backgroundColor: bgColors,
				borderColor: borderColors,
				borderWidth: 2,
			}]
		},
		options: {
			indexAxis: 'y',
			responsive: true,
			plugins: {
				title: {
					display: true,
					text: "Downtime",
					font: {
						size: 16,
					}
				},
				datalabels: {
					anchor: 'center',
					align: 'center',
					color: 'black',
					font: {
						weight: 'bold',
					},
					formatter: function(value, context) {
						return value;
					},
				}, legend: {
					display: false
				},
			},
			scales: {
				y: {
					beginAtZero: true,
					title: {
						display: true,
						text: axisLabels[2],
					},
					grid: {
						display: false
					},
				},
				x: {
					title: {
						display: true,
						text: axisLabels[3],
					},
					grid: {
						display: false
					},
				}
			}
		}
	});

	return canvas;
}

function buildConveyorCurrJobDiv(data) {
	var element1 = document.createElement("table");
	element1.setAttribute("id", "statusTable");
	element1.setAttribute("cellspacing", "0px");
	element1.setAttribute("class", "machineTable");
	element1.setAttribute("style", "width:100%;height:100%;");

	var element1_1 = document.createElement("thead");
	element1_1.setAttribute("style", "width:100%;");

	var element1_2 = document.createElement("tr");
	element1_2.setAttribute("style", "width:100%");
	element1_1.append(element1_2);

	element1_2.setAttribute("id", "statusTableBody");

	element1.append(element1_1);

	var td3 = document.createElement("th");
	td3.innerText = "Line Details";
	td3.setAttribute("style", "text-align: center; font-size: 26px; padding:4px; color:dodgerblue;");
	td3.setAttribute("colspan", "2");

	element1_2.append(td3);

	var element1_3 = document.createElement("tbody");
	element1.append(element1_3);

	for (var j = 0; j < data.length; j += 2) {
		var row = '<tr class="jobRows" style="background-color: white;"><td class="convJobLabels">' + data[j] + " :" + '</td><td class="tdValues">' + data[j + 1] + '</td></tr>';
		element1_3.innerHTML += row;
	}

	return element1;
}

function buildConveyorCurrStatusDiv(data) {
	var element1 = document.createElement("table");
	element1.setAttribute("id", "statusTable");
	element1.setAttribute("cellspacing", "0px");
	element1.setAttribute("class", "machineTable");
	element1.setAttribute("style", "width:100%;height:100%;");

	var element1_1 = document.createElement("thead");
	element1_1.setAttribute("style", "width:100%;");

	var element1_2 = document.createElement("tr");
	element1_2.setAttribute("style", "width:100%");
	element1_1.append(element1_2);

	element1_2.setAttribute("id", "statusTableBody");

	element1.append(element1_1);

	var td3 = document.createElement("th");

	if (data[1] == '1') {
		td3.innerText = "RUNNING";
		td3.setAttribute("style", "background-color: #d2fcbd; color: #087800; font-size: 24px; padding:4px;");
	} else {
		td3.innerText = "STOPPED";
		td3.setAttribute("style", "background-color: #ffabab; color: #f00000; font-size: 24px; padding:4px;");
	}
	td3.setAttribute("colspan", "2");
	td3.setAttribute("id", "machineRunStatus")

	element1_2.append(td3);

	var element1_3 = document.createElement("tbody");
	element1.append(element1_3);

	for (var j = 2; j < 6; j += 2) {
		var row = '<tr class="statusRows" style="background-color: white;"><td class="convTdLabels">' + data[j] + " :" + '</td><td class="tdValues">' + data[j + 1] + " secs" + '</td></tr>';
		element1_3.innerHTML += row;
	}
	var row = '<tr class="statusRows" style="background-color: white;"><td class="convTdLabels">' + data[6] + " :" + '</td><td class="tdValues">' + data[7] + '</td></tr>';
	element1_3.innerHTML += row;

	var element1_4 = document.createElement("tfoot");
	element1_4.setAttribute("style", "width:100%; height:20%");

	var td4 = document.createElement("th");
	td4.setAttribute("colspan", "2");
	var progress = document.createElement("progress");
	progress.setAttribute("style", "width:100%; height:100%; border:none;");
	progress.setAttribute("id", "conveyorProgressBar");
	progress.setAttribute("max", "100");
	progress.setAttribute("value", data[data.length - 1]);
	td4.append(progress);
	element1_4.append(td4);
	element1.append(element1_4);

	return element1;
}


/**************  Machine Dashboard ****************/

function resetMachineDashboardVariables() {
	currStatus = [];
	currJob = [];
	breakdownValues = [];
	breakdownLabels = [];
	mcStatusValues = [];
	oaeValues = [];
	borderColors = [];
	bgColors = [];
	prodLabels = [];
	prodValues = [];
	machineDashboardHeader = "";
	$("#divA").empty();
	$("#divB").empty();
	$("#divC").empty();
	$("#divD").empty();
	$("#divE").empty();
	$("#divF").empty();
	$("#masterHeading").empty();
}

function setMachineDashboardVariablesAndPager() {
	var formData = {
		machineNumber: "",
	}

	$.ajax({
		url: "/WebApplication/Controllers/getMachineDashboardData",
		type: 'POST',
		contentType: "application/json",
		async: false,
		data: JSON.stringify(formData),
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {
			$("#pageSelect").empty();
			for (var i = 0; i < res.length; i++) {
				$("#pageSelect").append(
					"<option value='" + res[i].machineNumber + "' style='padding:2px; font-weight: 300; color: rgb(40, 40, 40);'>" + res[i].machineName + "</option>"
				);
			}
			$("#pageSelect").val("001");

			setMachineDashboardVariables();
		},
		error: function(e) {
			alert("Something went wrong ⚠️");
		}
	});
}

function setMachineDashboardVariables() {
	var machineNumber = $('select[id="pageSelect"] :selected').val();

	// bar gaph axis label set
	if (machineNumber == '001') {
		axisLabels = ['No. of circuits', 'Machines', 'B/D Machines', 'Time(in mins)'];
	} else {
		axisLabels = ['No. of circuits', 'Time (in hrs)', 'Breakdowns', 'Time(in mins)'];
	}

	var formData = {
		machineNumber: machineNumber,
	}

	$.ajax({
		url: "/WebApplication/Controllers/getMachineDashboardData",
		type: 'POST',
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		data: JSON.stringify(formData),
		success: function(res) {
			console.log(res);
			setMachineDashboardData(res[0]);
		},
		error: function(e) {
			alert(e.responseText);
		}
	});
}

function setMachineDashboardData(data) {
	resetMachineDashboardVariables();
	machineDashboardHeader = data.machineModel.toUpperCase();

	//mcStatusSummary
	mcStatusValues.push(data.runningTime, data.stopTime);

	// oee
	var oee = parseInt((parseInt(data.quality) * parseInt(data.productivity) * parseInt(data.availability)) / 10000);
	var oae = parseInt(oee * parseInt(data.availability) / 100);
	oaeValues.push(oae, data.availability, data.productivity, data.quality, oee);

	// currJob
	currJob.push("Curr Job", data.job, "Article", data.runningCkt, "Progress", data.progress);

	// currStatus
	var progress;
	if (parseInt(data.target) <= 0) {
		progress = 0;
	} else {
		progress = parseInt((parseInt(data.actual) / parseInt(data.target)) * 100);
	}
	currStatus.push("Current Status", data.status, "Total Target", data.target, "Target Till", data.desiredQuantity, "Actual Count", data.actual, "Progress", progress);

	// downtime
	const breakpoint = /\<&>|\@&@/
	var bdData = data.breakdownData.split(breakpoint);
	for (var i = 0; i < bdData.length - 1; i += 2) {
		breakdownLabels.push(bdData[i]);
		breakdownValues.push(parseInt(bdData[i + 1]));
	}

	// productionPerHour
	var prodArr = data.productionPerHour.split(breakpoint)
	for (var i = 0; i < prodArr.length - 1; i += 2) {
		prodLabels.push(prodArr[i]);
		prodValues.push(prodArr[i + 1]);
	}

	$("#masterHeading").append(machineDashboardHeader);
	$("#divA").append(buildMcCurrStatusDiv(currStatus));
	$("#divD").append(buildMcCurrJobDiv(currJob));
	$("#divB").append(buildMcProdPerHourDiv(prodValues, prodLabels));
	$("#divE").append(buildMcDowntimeDiv(breakdownValues, breakdownLabels));
	$("#divC").append(buildMCStatusSummaryDiv(mcStatusValues, mcStatusLabels));
	$("#divF").append(buildMcOeeChartDiv(oaeValues, oaeLabels));

}

function buildMcOeeChartDiv(dataValues, labels) {
	var colors = ['rgba(255, 160, 6,1)', 'rgba(0,255,0,0.8)', 'rgba(8, 206, 255, 1)', 'rgba(255, 228, 11,1)', '#fca4f1', '#00000000'];
	var labelx = [...labels];

	labelx.forEach((element, index) => {
		labelx[index] = element + " " + parseInt(dataValues[index]) + "%";
	});
	var data = [];
	for (var i = 0; i < 6; i++) {
		var arr = ['0', '0', '0', '0', '0', '0'];
		arr[i] = parseInt(dataValues[i]);
		arr[arr.length - 1] = (100 - parseInt(dataValues[i])) + '';

		data.push(arr);
	}

	var canvas = document.createElement('canvas'); // Create canvas element
	canvas.id = "oeeChartCanvas" // Assign an ID
	canvas.style.width = "100%";
	const ctx = canvas.getContext('2d');
	new Chart(ctx, {
		type: 'doughnut',
		data: {
			labels: labelx,
			datasets: [
				{
					data: data[0],
					backgroundColor: colors,
					borderRadius: 50,
					cutout: '10%',
				}, {
					weight: 0.3
				},
				{
					data: data[1],
					backgroundColor: colors,
					borderRadius: 50,
					cutout: '10%',
				}, {
					weight: 0.2
				},
				{
					data: data[2],
					backgroundColor: colors,
					borderRadius: 50,
					cutout: '10%',
				}, {
					weight: 0.4
				},
				{
					data: data[3],
					backgroundColor: colors,
					borderRadius: 20,
					cutout: '10%',
				},
				{
					weight: 0.4
				},
				{
					data: data[4],
					backgroundColor: colors,
					borderRadius: 20,
					cutout: '10%',
				}
			]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				title: {
					display: true,
				},
				datalabels: {
					display: false,
				},
				legend: {
					position: 'bottom',
					align: "center",
					labels: {
						usePointStyle: true,
					}
				},
			},
		}
	});
	return canvas;
}

function buildMCStatusSummaryDiv(dataValues, labels) {
	var canvas = document.createElement('canvas');
	canvas.id = "mcStatusSummaryCanvas"; // Assign an ID
	canvas.style.width = "100%";

	new Chart(canvas.getContext("2d"), {
		type: "pie",
		data: {
			labels: labels,
			datasets: [{
				data: dataValues,
				backgroundColor: [
					'rgba(0,255,0,0.7)',
					'rgba(255,0,0,0.6)',
				]
			}]
		},
		options: {
			plugins: {
				maintainAspectRatio: false,
				title: {
					display: true,
					text: "M/C Status Summary",
					align: 'center',
					font: {
						size: 16,
					}
				},
				datalabels: {
					color: 'black',
					font: {
						weight: 'bold',
					},
					backgroundColor: 'white',
					borderRadius: 6,
				},
				legend: {
					position: 'bottom',
					align: "center",
					labels: {
						usePointStyle: true,
					}
				},
			}
		}
	});
	return canvas;
}

// Function to generate random colors
function generateRandomColor(n) {
	bgColors = [];
	borderColors = [];
	for (var j = 0; j < n; j++) {
		var r = Math.floor(Math.random() * 255);
		var g = Math.floor(Math.random() * 255);
		var b = Math.floor(Math.random() * 255);

		borderColors.push('rgba(' + r + ', ' + g + ', ' + b + ', 1)');
		bgColors.push('rgba(' + r + ', ' + g + ', ' + b + ', 0.4)');
	}
}


function buildMcDowntimeDiv(dataValues, labels) {
	generateRandomColor(labels.length);

	var canvas = document.createElement('canvas'); // Create canvas element
	canvas.id = "downtimeCanvas" // Assign an ID
	canvas.setAttribute("style", "width: 100%;");
	Chart.register(ChartDataLabels);
	new Chart(canvas, {
		type: 'bar',
		data: {
			labels: labels,
			datasets: [{
				axis: 'y',
				data: dataValues,
				backgroundColor: bgColors,
				borderColor: borderColors,
				borderWidth: 2,
			}]
		},
		options: {
			indexAxis: 'y',
			responsive: true,
			plugins: {
				title: {
					display: true,
					text: "Downtime",
					font: {
						size: 16,
					}
				},
				datalabels: {
					anchor: 'center',
					align: 'center',
					color: 'black',
					font: {
						weight: 'bold',
					},
					formatter: function(value, context) {
						return value;
					},
				}, legend: {
					display: false
				},
			},
			scales: {
				y: {
					beginAtZero: true,
					title: {
						display: true,
						text: axisLabels[2],
					},
					grid: {
						display: false
					},
				},
				x: {
					title: {
						display: true,
						text: axisLabels[3],
					},
					grid: {
						display: false
					},
				}
			}
		}
	});

	return canvas;
}

function buildMcProdPerHourDiv(dataValues, labels) {
	var canvas = document.createElement('canvas'); // Create canvas element
	canvas.id = "productionPreHourCanvas" // Assign an ID
	canvas.setAttribute("style", "width: 100%;")
	Chart.register(ChartDataLabels);
	new Chart(canvas, {
		type: 'bar',
		data: {
			labels: labels,
			datasets: [{
				data: dataValues,
				backgroundColor: 'rgba(8, 206, 255, 0.5)',
				borderColor: 'rgba(135, 206, 235, 1)',
				borderWidth: 2,
			}]
		},
		options: {
			responsive: true,
			plugins: {
				title: {
					display: true,
					text: "Production",
					padding: {
						top: 10,
						bottom: 25,
						left: 0,
						right: 0
					},
					font: {
						size: 16,
					}
				},
				datalabels: {
					anchor: 'end',
					align: 'end',
					color: 'rgba(0,0,0,0.6)',
					font: {
						weight: 'bold',
					},
					formatter: function(value, context) {
						return value;
					}
				},
				legend: {
					display: false
				},
			},
			scales: {
				y: {
					beginAtZero: true,
					title: {
						display: true,
						text: axisLabels[0],
					},
					grid: {
						display: false
					},
				},
				x: {
					title: {
						display: true,
						text: axisLabels[1],
					},
					grid: {
						display: false
					},
				}
			}
		}
	});

	return canvas;
}

function buildMcCurrJobDiv(data) {
	var element1 = document.createElement("table");
	element1.setAttribute("id", "statusTable");
	element1.setAttribute("cellspacing", "0px");
	element1.setAttribute("class", "machineTable");
	element1.setAttribute("style", "width:100%;height:100%;");

	var element1_1 = document.createElement("thead");
	element1_1.setAttribute("style", "width:100%;");

	var element1_2 = document.createElement("tr");
	element1_2.setAttribute("style", "width:100%");
	element1_1.append(element1_2);

	element1_2.setAttribute("id", "statusTableBody");

	element1.append(element1_1);

	var td3 = document.createElement("th");
	td3.innerText = "Current Job";
	td3.setAttribute("style", "text-align: center; font-size: 26px; padding:4px; color:dodgerblue;");
	td3.setAttribute("colspan", "2");

	element1_2.append(td3);

	var element1_3 = document.createElement("tbody");
	element1.append(element1_3);

	for (var j = 0; j < data.length; j += 2) {
		var row = '<tr class="jobRows" style="background-color: white;"><td class="jobLabels">' + data[j] + " :" + '</td><td class="tdValues">' + data[j + 1] + '</td></tr>';
		element1_3.innerHTML += row;
	}

	return element1;
}

function buildMcCurrStatusDiv(data) {
	var element1 = document.createElement("table");
	element1.setAttribute("id", "statusTable");
	element1.setAttribute("cellspacing", "0px");
	element1.setAttribute("class", "machineTable");
	element1.setAttribute("style", "width:100%;height:100%;");

	var element1_1 = document.createElement("thead");
	element1_1.setAttribute("style", "width:100%;");

	var element1_2 = document.createElement("tr");
	element1_2.setAttribute("style", "width:100%");
	element1_1.append(element1_2);

	element1_2.setAttribute("id", "statusTableBody");

	element1.append(element1_1);

	var td3 = document.createElement("th");

	if (data[1] == '1') {
		td3.innerText = "RUNNING";
		td3.setAttribute("style", "background-color: #d2fcbd; color: #087800; font-size: 24px; padding:4px;");
	} else {
		td3.innerText = "STOPPED";
		td3.setAttribute("style", "background-color: #ffabab; color: #f00000; font-size: 24px; padding:4px;");
	}
	td3.setAttribute("colspan", "2");
	td3.setAttribute("id", "machineRunStatus")

	element1_2.append(td3);

	var element1_3 = document.createElement("tbody");
	element1.append(element1_3);

	for (var j = 2; j < 8; j += 2) {
		var row = '<tr class="statusRows" style="background-color: white;"><td class="tdLabels">' + data[j] + " :" + '</td><td class="tdValues">' + data[j + 1] + '</td></tr>';
		element1_3.innerHTML += row;
	}

	var element1_4 = document.createElement("tfoot");
	element1_4.setAttribute("style", "width:100%; height:20%");

	var td4 = document.createElement("th");
	td4.setAttribute("colspan", "2");
	var progress = document.createElement("progress");
	progress.setAttribute("style", "width:100%; height:100%; border:none;");
	progress.setAttribute("id", "machineProgressBar");
	progress.setAttribute("max", "100");
	progress.setAttribute("value", data[data.length - 1]);
	td4.append(progress);
	element1_4.append(td4);
	element1.append(element1_4);

	return element1;
}

function buildConveyorBlocks(numberOfMachines) {
	var response = getAllConveyorStatusData();

	if (response == undefined || response == '0') {
		alert("Server not responding ⚠️");
		return;
	} else if (response.length == 0) {
		clearInterval(interval);

		alert("No conveyor available ⚠️");
		return;
	}

	for (var i = 1; i <= numberOfMachines; i++) {
		var element1 = document.createElement("table");
		element1.setAttribute("id", "machineTable" + i);
		element1.setAttribute("cellspacing", "0px");
		element1.setAttribute("class", "machineTable");
		element1.setAttribute("style", "width:100%;height:100%;");
		$("#machineTable" + i).remove();
		$("#machineDiv" + i).append(element1);

		var element1_1 = document.createElement("thead");
		element1_1.setAttribute("style", "width:100%;");

		var element1_2 = document.createElement("tr");
		element1_2.setAttribute("style", "width:100%")
		element1_1.append(element1_2);

		element1_2.setAttribute("id", "machineTableBody" + i);

		element1.append(element1_1);

		var element2 = document.createElement("th");
		element2.innerText = response[i - 1].lineName;
		element2.setAttribute("class", "machineNameHead");
		element1_2.append(element2);

		var td3 = document.createElement("th");

		if (response[i - 1].status == '1') {
			td3.innerText = "RUNNING";
			td3.setAttribute("style", "background-color: #d2fcbd; color: #087800; font-size: 12px; padding:4px; width: 60%;");
		} else {
			td3.innerText = "STOPPED";
			td3.setAttribute("style", "background-color: #ffabab; color: #f00000; font-size: 12px; padding:4px; width: 60%;");
		}
		element1_2.append(td3);

		var element1_3 = document.createElement("tbody");
		element1.append(element1_3);

		var list = ["Part Code", response[i - 1].partCode, "Model", response[i - 1].model, "Act / Plan", response[i - 1].packed, "Updated", response[i - 1].lastUpdated];
		for (var j = 0; j < list.length - 1; j += 2) {
			var row = '<tr class="tableDataRows"><td class="machineDataLabel">' + list[j] + '</td><td class="machineDataValue">' + list[j + 1] + '</td></tr>';
			element1_3.innerHTML += row;
		}

	}
}

function buildMachineBlocks(numberOfMachines) {
	var response = getAllMachineStatusData();

	if (response == undefined || response == '0') {
		alert("Server not responding ⚠️");
		return;
	} else if (response.length == 0) {
		clearInterval(interval);
		alert("No machine available ⚠️");
		return;
	}

	for (var i = 1; i <= numberOfMachines; i++) {
		var element1 = document.createElement("table");
		element1.setAttribute("id", "machineTable" + i);
		element1.setAttribute("cellspacing", "0px");
		element1.setAttribute("class", "machineTable");
		element1.setAttribute("style", "width:100%;height:100%;");
		$("#machineTable" + i).remove();
		$("#machineDiv" + i).append(element1);

		var element1_1 = document.createElement("thead");
		element1_1.setAttribute("style", "width:100%;");

		var element1_2 = document.createElement("tr");
		element1_2.setAttribute("style", "width:100%")
		element1_1.append(element1_2);

		element1_2.setAttribute("id", "machineTableBody" + i);

		element1.append(element1_1);

		var element2 = document.createElement("th");
		element2.innerText = response[i - 1].machineName;
		element2.setAttribute("class", "machineNameHead");
		element1_2.append(element2);

		var td3 = document.createElement("th");

		if (response[i - 1].status == '1') {
			td3.innerText = "RUNNING";
			td3.setAttribute("style", "background-color: #d2fcbd; color: #087800; font-size: 12px; padding:4px; width: 60%;");
		} else {
			td3.innerText = "STOPPED";
			td3.setAttribute("style", "background-color: #ffabab; color: #f00000; font-size: 12px; padding:4px; width: 60%;");
		}
		element1_2.append(td3);

		var element1_3 = document.createElement("tbody");
		element1.append(element1_3);

		var list = ["Act / Tgt", response[i - 1].actual + " / " + response[i - 1].target, "Curr CKT", response[i - 1].runningCkt, "Progress", response[i - 1].progress, "Updated", response[i - 1].lastUpdated];
		for (var j = 0; j < list.length - 1; j += 2) {
			var row = '<tr class="tableDataRows"><td class="machineDataLabel">' + list[j] + '</td><td class="machineDataValue">' + list[j + 1] + '</td></tr>';
			element1_3.innerHTML += row;
		}

	}
}

function getAllMachineStatusData() {
	var response = "";
	$.ajax({
		url: "/WebApplication/Controllers/getAllMachineStatusData",
		type: 'POST',
		contentType: "application/json",
		async: false,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		dataType: 'json',
		success: function(res) {
			response = res;
		}, error: function(e) {
			response = e.responseText;
		}
	});
	return response;
}

function getAllConveyorStatusData() {
	var response = "";
	$.ajax({
		url: "/WebApplication/Controllers/getAllConveyorStatusData",
		type: 'POST',
		contentType: "application/json",
		async: false,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		dataType: 'json',
		success: function(res) {
			response = res;
		}, error: function(e) {
			response = e.responseText;
		}
	});
	return response;
}

function loadWIPReportDataAndPager(page) {
	$.ajax({
		url: "/WebApplication/Controllers/getWorkInProgressReportInPages?page=" + page,
		type: 'GET',
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		dataType: 'json',
		success: function(res) {
			makePagerByTotalPages(res, page)
			insertQualityReportInTable(res.content, page + 1);
		}
	});
}

function loadWIPReportPager(page) {

	$.ajax({
		url: "/WebApplication/Controllers/getWorkInProgressReportInPages?page=" + page,
		type: 'GET',
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		dataType: 'json',
		success: function(res) {
			var totalPages = res.totalPages;
			$("#pageSelect").empty();
			for (var i = 0; i <= totalPages - 1; i++) {
				$("#pageSelect").append("<option value='" + i + "'>" + (i + 1) + "</option>");
			}
			$("#pageSelect").val(page);
		}
	});

}


function insertQualityReportInTable($item, page) {

	$("#tableBody").remove();

	var tablebody = document.createElement("tbody");
	$("#table1").append(tablebody);
	tablebody.setAttribute("id", "tableBody");

	var sequenceNumber;

	if (page == 0) {
		sequenceNumber = 1;
	} else {
		var prevPageLastSeq = (page - 1) * pageSize;
		sequenceNumber = prevPageLastSeq + 1;
	}

	$.each($item, function(index, value) {
		value.sequenceNumber = sequenceNumber;
		var row = '<tr class="tableDataRows"><td data-column="columnId" style="width:70px">' + sequenceNumber + '</td>' + 
		'<td data-column="partCode">' + value.partCode + '</td>' + 
		'<td data-column="circuitNumber">' + value.circuitNumber + '</td>' +
		 '<td data-column="batchCode">' + value.batchCode + '</td>' + 
		 '<td data-column="batchNumber">' + value.batchNumber + '</td>' + 
		 '<td data-column="batchSize">' + value.batchSize + '</td>' + 
		 '<td data-column="lotSize">' + value.lotSize + '</td>' + 
		 '<td data-column="dateTime" Style="width:200px;" colspan="2">' + value.dateTime + 
		 '</td><td data-column="workInprogressId" style="display:none" >' + value.workInprogressId + '</td></tr>';

		$('#table1').append(row);
		sequenceNumber++;
	});
}


function insertDetailedReportInTable($item) {

	$("#tableBody9").remove();

	var tablebody = document.createElement("tbody");
	$("#table9").append(tablebody);
	tablebody.setAttribute("id", "tableBody9");

	$.each($item, function(index, value) {
		if (value.passingStatus == 1) {
			var row = '<tr class="tableDataRows"><td data-column="columnId" style="width:70px">' + (1 + parseInt(index)) + '</td>' + '<td data-column="batchCode">' + value.batchCode + '</td>' + '<td data-column="batchNumber">' + value.batchNumber + '</td>' + '<td data-column="batchSize">' + value.batchSize + '</td>' + '<td data-column="lotSize">' + value.lotSize + '</td>' + '<td data-column="circuitNumber">' + value.circuitNumber + '</td>' + '<td data-column="dateTime">' + value.dateTime + '</td><td data-column="passingStatus" style="background-color:#A08DEF; color:white; font-weight:bold;">Machine to LPC</td></tr>';
			$('#table9').append(row);
		} else if (value.passingStatus == 2) {
			var row = '<tr class="tableDataRows"><td data-column="columnId" style="width:70px">' + (1 + parseInt(index)) + '</td>' + '<td data-column="batchCode">' + value.batchCode + '</td>' + '<td data-column="batchNumber">' + value.batchNumber + '</td>' + '<td data-column="batchSize">' + value.batchSize + '</td>' + '<td data-column="lotSize">' + value.lotSize + '</td>' + '<td data-column="circuitNumber">' + value.circuitNumber + '</td>' + '<td data-column="dateTime">' + value.dateTime + '</td><td data-column="passingStatus" style="background-color:#8B72EC; color:white; font-weight:bold;">LPC To MPCR</td></tr>';
			$('#table9').append(row);

		} else if (value.passingStatus == 3) {
			var row = '<tr class="tableDataRows"><td data-column="columnId" style="width:70px">' + (1 + parseInt(index)) + '</td>' + '<td data-column="batchCode">' + value.batchCode + '</td>' + '<td data-column="batchNumber">' + value.batchNumber + '</td>' + '<td data-column="batchSize">' + value.batchSize + '</td>' + '<td data-column="lotSize">' + value.lotSize + '</td>' + '<td data-column="circuitNumber">' + value.circuitNumber + '</td>' + '<td data-column="dateTime">' + value.dateTime + '</td><td data-column="passingStatus" style="background-color:#7152EE; color:white; font-weight:bold;">MPCR To Assmbly</td></tr>';
			$('#table9').append(row);

		} else if (value.passingStatus == 4) {
			var row = '<tr class="tableDataRows"><td data-column="columnId" style="width:70px">' + (1 + parseInt(index)) + '</td>' + '<td data-column="batchCode">' + value.batchCode + '</td>' + '<td data-column="batchNumber">' + value.batchNumber + '</td>' + '<td data-column="batchSize">' + value.batchSize + '</td>' + '<td data-column="lotSize">' + value.lotSize + '</td>' + '<td data-column="circuitNumber">' + value.circuitNumber + '</td>' + '<td data-column="dateTime">' + value.dateTime + '</td><td data-column="passingStatus" style="background-color:#5D39EE; color:white; font-weight:bold;">Assmbly In</td></tr>';
			$('#table9').append(row);

		}

	});
}



$(document).on('dblclick', '#table1 tbody tr', function() {
	$(this).addClass('selected').siblings().removeClass('selected');
	row = $(this);
	let rowValues = {}; //An empty object to hold your data
	let temp;

	row.find('td').each(function() {
		temp = $(this);
		rowValues[temp.data('column')] = temp.text();

	});

	var text = document.getElementById("masterHeading").innerHTML;
	if (text == "WORK IN PROGRESS REPORT") {
		$('#detailedModal').modal('show');

		var circuitNumber = rowValues.circuitNumber;
		var workInprogressId = rowValues.workInprogressId;

		if (!circuitNumber || !workInprogressId) {

			$('#warningModal').modal('show');

			$('#warningClose').off('click').on('click', function() {
				$('#warningModal').modal('hide');
				return;
			});

		} else {
			var formData = { circuitNumber: circuitNumber, workInprogressId: workInprogressId };
			$.ajax({
				type: 'POST',
				url: '/WebApplication/Controllers/getDetailedWorkInProgressReport',
				async: false,
				data: JSON.stringify(formData),
				contentType: "application/json",
				headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
				success: function(response) {
					createDetailedTable();
					insertDetailedReportInTable(response);
				}
			});

		}

		$('#detailedClose').off('click').on('click', function() {
			$('#detailedModal').modal('hide');
			return;
		});
	} else if (text == "LPC QUALITY CHECKING REPORT") {

		$('#detailedModal').modal('show');

		var lineLeaderId = rowValues.lineLeaderId;

		if (!lineLeaderId) {

			$('#warningModal').modal('show');

			$('#warningClose').off('click').on('click', function() {
				$('#warningModal').modal('hide');
				return;
			});

		} else {
			var formData = {
				lineLeader: { lineLeaderId: lineLeaderId }
			};
			$.ajax({
				type: 'POST',
				url: '/WebApplication/Controllers/getDetailedLPCReport',
				async: false,
				data: JSON.stringify(formData),
				contentType: "application/json",
				headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
				success: function(response) {
					createDetailedTable();
					insertLPCDetailedReportInTable(response);
				}
			});

		}

		$('#detailedClose').off('click').on('click', function() {
			$('#detailedModal').modal('hide');
			return;
		});
	}


});

function createDetailedTable() {

	var child1 = document.getElementById("div15");
	child1.remove();
	var div15 = document.createElement("div");

	$("#div24").append(div15);

	div15.setAttribute("id", "div15");
	div15.setAttribute("class", "modal-body");
	div15.setAttribute("style", "padding:0px 5px;max-height:500px;overflow-y:scroll;");


	var element1 = document.createElement("table");
	$("#div15").append(element1);
	element1.setAttribute("id", "table9");
	element1.setAttribute("cellspacing", "0px");
	element1.setAttribute("class", "table-hover");
	/*	element1.setAttribute("style", "width:100%");*/

	var w = window.innerWidth;

	if (w < 600) {
		element1.setAttribute("style", "width:150%;");
	} else if (w < 1100) {
		element1.setAttribute("style", "width:100%;");
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
	element1_1.setAttribute("id", "tableHead9")

	var element1_2 = document.createElement("tr");
	element1_1.append(element1_2)

	var element1_3 = document.createElement("tbody");
	element1.append(element1_3)
	element1_3.setAttribute("id", "tableBody9")

	var text = document.getElementById("masterHeading").innerHTML;
	if (text == "WORK IN PROGRESS REPORT") {

		var element2 = document.createElement("th");
		element2.innerText = "S.No.";
		var element3 = document.createElement("th");
		element3.innerText = "Batch Code";
		var element3_2 = document.createElement("th");
		element3_2.innerText = "Bunch No.";
		var element4 = document.createElement("th");
		element4.innerText = "Bunch Size";
		var element5 = document.createElement("th");
		element5.innerText = "lot Size";
		var element6 = document.createElement("th");
		element6.innerText = "Circuit Number";
		var element7 = document.createElement("th");
		element7.innerText = "Date Time";
		/*	var element8 = document.createElement("th");
			element8.innerText = "Machine";*/
		var element9 = document.createElement("th");
		element9.innerText = "Passing Status";

		element1_2.append(element2, element3, element3_2, element4, element5, element6, element7, element9);

		element2.setAttribute("class", "tableheading");
		element2.setAttribute("style", "width:70px");
		// element2.setAttribute("scope","col");
		element3.setAttribute("class", "tableheading");
		element3_2.setAttribute("class", "tableheading");
		// element3.setAttribute("scope","col");
		element4.setAttribute("class", "tableheading");
		// element4.setAttribute("scope","col");
		element5.setAttribute("class", "tableheading");
		// element5.setAttribute("scope","col");
		element6.setAttribute("class", "tableheading");
		// element6.setAttribute("scope","col");
		element7.setAttribute("class", "tableheading");
		// element7.setAttribute("scope","col");
		element9.setAttribute("class", "tableheading");


	} else if ("LPC QUALITY CHECKING REPORT") {

		var element2 = document.createElement("th");
		element2.innerText = "S.No.";
		var element3 = document.createElement("th");
		element3.innerText = "Part Code";
		var element3_2 = document.createElement("th");
		element3_2.innerText = "Batch Code.";
		var element4 = document.createElement("th");
		element4.innerText = "CKT Number";
		var element5 = document.createElement("th");
		element5.innerText = "Lot Size";
		var element6 = document.createElement("th");
		element6.innerText = "Bunch Number";
		var element7 = document.createElement("th");
		element7.innerText = "Date Time";
		/*	var element8 = document.createElement("th");
			element8.innerText = "Machine";*/
		var element9 = document.createElement("th");
		element9.innerText = "Passing Status";

		element1_2.append(element2, element3, element3_2, element4, element5, element6, element7, element9);

		element2.setAttribute("class", "tableheading");
		element2.setAttribute("style", "width:70px");
		// element2.setAttribute("scope","col");
		element3.setAttribute("class", "tableheading");
		element3_2.setAttribute("class", "tableheading");
		// element3.setAttribute("scope","col");
		element4.setAttribute("class", "tableheading");
		// element4.setAttribute("scope","col");
		element5.setAttribute("class", "tableheading");
		// element5.setAttribute("scope","col");
		element6.setAttribute("class", "tableheading");
		// element6.setAttribute("scope","col");
		element7.setAttribute("class", "tableheading");
		// element7.setAttribute("scope","col");
		element9.setAttribute("class", "tableheading");

	}


}


function loadLikeWorkInProgressData(page) {

	searchLoad = true;
	var partCode = $('input[title="searchPartCode"]').val() ?? "";
	var circuitNumber = $('input[title="searchCktNumber"]').val() ?? "";
	var batchCode = $('input[title="searchBatchCode"]').val() ?? "";
	var batchNumber = $('input[title="searchBatchNumber"]').val() ?? "";
	var lotSize = $('input[title="searchLotSize"]').val() ?? "";

	if (partCode == "" && circuitNumber == "" && batchCode == "" && batchNumber == "" && lotSize == "") {
		$("#wipReport").click();
	}

	var formData = {
		partCode: partCode,
		circuitNumber: circuitNumber,
		batchCode: batchCode,
		batchNumber: batchNumber,
		lotSize: lotSize
	}
	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getLikeWorkInProgessReport/' + page,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {
			makePager(res.totalElements, page)
			insertQualityReportInTable(res.content, page + 1);
		},
		error: function(response) {
			$("#warningInformationModalBody").text(response.responseText);
			$("#warningBackdropButton").click();
		}
	});
}



function loadLikeWorkInProgressDataForExcel() {
	searchLoad = true;
	var partCode = $('input[title="searchPartCode"]').val() ?? "";
	var circuitNumber = $('input[title="searchCktNumber"]').val() ?? "";
	var batchCode = $('input[title="searchBatchCode"]').val() ?? "";
	var batchNumber = $('input[title="searchBatchNumber"]').val() ?? "";
	var lotSize = $('input[title="searchLotSize"]').val() ?? "";

	if (partCode == "" && circuitNumber == "" && batchCode == "" && batchNumber == "" && lotSize == "") {
		$("#wipReport").click();
	}

	var formData = {
		partCode: partCode,
		circuitNumber: circuitNumber,
		batchCode: batchCode,
		batchNumber: batchNumber,
		lotSize: lotSize
	}

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getLikeWorkInProgessReportForExcel',
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {
			lastResponseData = res;
		},
		error: function(response) {
			$("#warningInformationModalBody").text(response.responseText);
			$("#warningBackdropButton").click();
		}
	});
}


function downloadWorkInProgressDataAsExcel(data) {
	const filename = 'work_in_progress_data.xlsx';
	const headers = ['Part Code', 'Circuit Number', 'Batch Code', 'Batch Number', 'Lot Size', 'Created By', 'Date & Time'];

	let csvContent = headers.join('\t').toUpperCase() + '\n';

	data.forEach(entry => {
		const escapedBatchNumber = "'" + entry.batchNumber;

		const row = [
			entry.partCode,
			entry.circuitNumber,
			entry.batchCode,
			escapedBatchNumber,
			entry.lotSize,
			entry.createdBy,
			entry.dateTime
		].join('\t');
		csvContent += row + '\n';
	});

	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

	if (navigator.msSaveBlob) {
		navigator.msSaveBlob(blob, filename);
	} else {
		const link = document.createElement('a');
		if (link.download !== undefined) {
			const url = URL.createObjectURL(blob);
			link.setAttribute('href', url);
			link.setAttribute('download', filename);
			link.style.visibility = 'hidden';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	}
}




$(document).ready(function() {

	$(document).on('click', '#lpcQualityReport', function() {

		searchLoad = false; clearInterval(interval);

		$("#planDateDiv").css("display", "none");
		$("#pagerDiv").css("display", "block");
		$("#printPreview").css("display", "none");
		$("#backToHarness").css("display", "none");
		$("#toggleActionFilterBtn").closest(".switch").css("display", "none");
				
		clearInterval(interval);

		$("#offcanvasCloseButton").click();

		var child1 = document.getElementById("div3");
		var child2 = document.getElementById("div4");

		child1.remove();
		if (child2) { child2.remove(); }

		document.getElementById("masterHeading").innerText = "";
		$("#masterHeading").append("LPC QUALITY CHECKING REPORT");

		var div3 = document.createElement("div");
		var div4 = document.createElement("div");

		$("#div2").append(div3, div4);

		div3.setAttribute("id", "div3");
		div3.setAttribute("class", "masterBody");

		div4.setAttribute("id", "div4");
		div4.setAttribute("class", "masterBody");
		div4.setAttribute("Style", "overflow-y:scroll; display:none;");

		var bottom = document.createElement("div");

		bottom.setAttribute("id", "bottom");
		/*	bottom.setAttribute("style","height: 50%;")*/

		$("#div4").append(bottom);

		var element1 = document.createElement("table");
		$("#div3").append(element1);
		element1.setAttribute("id", "table1");
		element1.setAttribute("cellspacing", "0px");
		/*element1.setAttribute("cellpaddding","10px");*/
		element1.setAttribute("class", "table-hover");

		var w = window.innerWidth;

		if (w < 500) {
			element1.setAttribute("style", "width:300%;");
		} else if (w < 1100) {
			element1.setAttribute("style", "width:250%;");
		}
		else if (w < 1500) {
			element1.setAttribute("style", "width:100%;");
		} else if (w < 1000) {
			element1.setAttribute("style", "width:150%;");
		} else {
			element1.setAttribute("style", "width:100%;");
		}


		var element1_1 = document.createElement("thead");
		element1.append(element1_1);

		var element1_2 = document.createElement("tr");


		var element1_3 = document.createElement("tbody");
		element1.append(element1_3)
		element1_3.setAttribute("id", "tableBody");

		// search
		/*********************/


		var searchRow = document.createElement("tr");
		searchRow.setAttribute("id", "searchRow");
		var imgContainer = document.createElement("th");
		imgContainer.setAttribute("class", "tableheading");
		var img = document.createElement("img");
		img.setAttribute("src", "/WebApplication/images/searchFilter.png");
		img.setAttribute("width", "22");
		img.setAttribute("height", "22");
		imgContainer.append(img);
		searchRow.append(imgContainer);

		var searchTitles = ["searchPartCode", "searchBatchCode", "searchCktNumber", "searchLotSize", "searchBatchSize", "searchDateTime"];

		/*var placeholders = ["Plant Code...", "Address...", "State...", "City...", "Pincode...", "Contact...", "Contact Person...", "Created By...", "Date & Time..."];*/
		for (var i = 0; i < searchTitles.length; i++) {
			var searchContainer = document.createElement("th");
			searchContainer.setAttribute("class", "tableheading");
			var searchinput = document.createElement("input");
			searchinput.setAttribute("style", "width:100%;");
			searchinput.setAttribute("title", searchTitles[i]);
			/*	searchinput.setAttribute("placeholder", placeholders[i]);*/
			searchinput.setAttribute("class", "searchFilterClass inputs");
			searchContainer.append(searchinput);
			searchRow.append(searchContainer);
		}

		element1_1.append(searchRow);

		/*********************/
		element1_1.append(element1_2);

		var element2 = document.createElement("th");
		element2.innerText = "S.No.";
		var element3 = document.createElement("th");
		element3.innerText = "Machine No.";
		var element4 = document.createElement("th");
		element4.innerText = "Part Code";
		var element5 = document.createElement("th");
		element5.innerText = "Batch Code";
		var element6 = document.createElement("th");
		element6.innerText = "CKT Number";
		var element7 = document.createElement("th");
		element7.innerText = "Lot Size";
		var element8 = document.createElement("th");
		element8.innerText = "Bunch Size";
		var element9 = document.createElement("th");
		element9.innerText = "Date & Time";
		var element9_2 = document.createElement("th");
		element9_2.innerText = "Id";


		element1_2.append(element2, element4, element5, element6, element7, element8, element9, element9_2);
		element2.setAttribute("class", "tableheading");
		// element2.setAttribute("scope","col");
		element3.setAttribute("class", "tableheading");
		// element3.setAttribute("scope","col");
		element4.setAttribute("class", "tableheading");
		// element4.setAttribute("scope","col");
		element5.setAttribute("class", "tableheading");
		// element5.setAttribute("scope","col");
		element6.setAttribute("class", "tableheading");
		// element6.setAttribute("scope","col");
		element7.setAttribute("class", "tableheading");
		// element7.setAttribute("scope","col");
		element8.setAttribute("class", "tableheading");
		// element8.setAttribute("scope","col");
		element9.setAttribute("class", "tableheading");
		element9_2.setAttribute("class", "tableheading");
		element9_2.setAttribute("style", "display:none;");
		// element9.setAttribute("scope","col");

		var element18_2 = document.createElement("div");
		element18_2.setAttribute("class", "buttonsContainer");

		var element41 = document.createElement("div");
		element41.setAttribute("class", "buttonsContainer");

		var element44 = document.createElement("button");
		element44.setAttribute("class", "data");
		element44.setAttribute("title", "Excel Download");

		element41.append(element44);
		element18_2.append(element41);

		$("#bottom").append(element18_2);

		$("#pageSelect").empty();
		getAllLineLeaderIdInCountPages();
		loadLPCReportDataAndPager(0);
	});
});


function loadLPCReportDataAndPager(page) {

	$.ajax({
		type: "GET",
		url: "/WebApplication/Controllers/getAllPlanFromLineLeader/" + page,
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
		success: function(res) {
			$("#pageSelect").val(page);

			insertLPCPendingBarcodeonMachine(res);

		}, error: function(e) {
			console.log("Error hai bhai....")
		}
	});
}

function getAllLineLeaderIdInCountPages() {
	$.ajax({
		type: "POST",
		url: "/WebApplication/Controllers/getAllLineLeaderIdPageCount",
		async: false,
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
		success: function(res) {
			$('#pageSelect').empty();
			for (var j = 0; j < Math.ceil(parseInt(res) / pageSize); j++) {
				var row = '<option value=' + j + '>' + (j + 1) + '</option>';
				$('#pageSelect').append(row);
			}
		}, error: function(e) {
			console.log("Error hai bhai....")
		}
	});
}


function insertLPCPendingBarcodeonMachine($item) {

	$("#tableBody").remove();

	var tablebody = document.createElement("tbody");
	$("#table1").append(tablebody);
	tablebody.setAttribute("id", "tableBody");

	var sequenceNumber = pageSize * parseInt($('#pageSelect :selected').val());


	$.each($item, function(index, value) {
		value.sequenceNumber = sequenceNumber;
		var row =
			'<tr class="tableDataRows"><td data-column="columnId" style="width:70px">' +
			(sequenceNumber + 1) +
			"</td>" +
			'<td data-column="partCode">' +
			value.partCode +
			"</td>" +
			'<td data-column="batchCode">' +
			value.batchCode +
			"</td>" +
			'<td data-column="circuitNumber">' +
			value.circuitNumber +
			"</td>" +
			'<td data-column="lotSize">' +
			value.lotSize +
			"</td>" +
			'<td data-column="batchSize">' +
			value.batchSize +
			"</td>" +
			'<td data-column="dateTime" style="width:200px">' +
			value.dateTime +
			"</td>" +
			/*'<td class="progress" style="width:200px>' +
			+
			"</td>" +*/
			'<td data-column="lineLeaderId" style="display:none;">' +
			value.lineLeaderId +
			"</td></tr>";
		$("#table1").append(row);
		sequenceNumber++;
	});
}


function insertLPCDetailedReportInTable($item) {

	$("#tableBody9").remove();

	var tablebody = document.createElement("tbody");
	$("#table9").append(tablebody);
	tablebody.setAttribute("id", "tableBody9");

	$.each($item, function(index, value) {
		if (value.qualityStatus == 0) {
			var row = '<tr class="tableDataRows"><td data-column="columnId" style="width:70px">' + (1 + parseInt(index)) + '</td>' + '<td data-column="partCode">' + value.lineLeader.partCode + '</td>' + '<td data-column="batchCode">' + value.lineLeader.batchCode + '</td>' + '<td data-column="circuitNumber">' + value.circuitNumber + '</td>' + '<td data-column="lotSize">' + value.lotSize + '</td>' + '<td data-column="bunchNumber">' + value.batchNumber + '</td>' + '<td data-column="dateTime">' + value.dateTime + '</td><td data-column="passingStatus" style="background-color:limegreen; color:white; font-weight:bold;">QA Released</td></tr>';
			$('#table9').append(row);
		} else if (value.qualityStatus == 1) {
			var row = '<tr class="tableDataRows"><td data-column="columnId" style="width:70px">' + (1 + parseInt(index)) + '</td>' + '<td data-column="partCode">' + value.lineLeader.partCode + '</td>' + '<td data-column="batchCode">' + value.lineLeader.batchCode + '</td>' + '<td data-column="circuitNumber">' + value.circuitNumber + '</td>' + '<td data-column="lotSize">' + value.lotSize + '</td>' + '<td data-column="bunchNumber">' + value.batchNumber + '</td>' + '<td data-column="dateTime">' + value.dateTime + '</td><td data-column="passingStatus" style="background-color:red; color:white; font-weight:bold;">QA Pending</td></tr>';
			$('#table9').append(row);
		}

	});
}

function loadLikeLPCData(page) {

	searchLoad = true;
	var partCode = $('input[title="searchPartCode"]').val() ?? "";
	var circuitNumber = $('input[title="searchCktNumber"]').val() ?? "";
	var batchCode = $('input[title="searchBatchCode"]').val() ?? "";
	var batchSize = $('input[title="searchBatchNumber"]').val() ?? "";
	var lotSize = $('input[title="searchLotSize"]').val() ?? "";

	var formData = {
		partCode: partCode,
		circuitNumber: circuitNumber,
		batchCode: batchCode,
		batchSize: batchSize,
		lotSize: lotSize
	}
	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getLikeLPCReport/' + page,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {

			makePagerByTotalPages(res, page)
			insertLPCPendingBarcodeonMachine(res.content);
		},
		error: function(response) {
			$("#warningInformationModalBody").text(response.responseText);
			$("#warningBackdropButton").click();
		}
	});
}

function makePagerByTotalPages(res, page) {

	var totalPages = res.totalPages;

	if (pageChange) {
		$("#pageSelect").empty();
		for (var i = 0; i <= totalPages - 1; i++) {
			$("#pageSelect").append("<option value='" + i + "'>" + (i + 1) + "</option>");
		}
		pageChange = false;
	}


	if (searchLoad) {

		$("#pageSelect").empty();
		for (var i = 0; i <= totalPages - 1; i++) {
			$("#pageSelect").append("<option value='" + i + "'>" + (i + 1) + "</option>");
		}
		$("#pageSelect").val(page);

	}
	$("#pageSelect").val(page);
}


//---------fro excel download--

function loadLikeLPCDataforexcel() {

	searchLoad = true;
	var partCode = $('input[title="searchPartCode"]').val() ?? "";
	var circuitNumber = $('input[title="searchCktNumber"]').val() ?? "";
	var batchCode = $('input[title="searchBatchCode"]').val() ?? "";
	var batchSize = $('input[title="searchBatchNumber"]').val() ?? "";
	var lotSize = $('input[title="searchLotSize"]').val() ?? "";

	var formData = {
		partCode: partCode,
		circuitNumber: circuitNumber,
		batchCode: batchCode,
		batchSize: batchSize,
		lotSize: lotSize
	}
	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getLikeLPCReportForExcel',
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {

			lastResponseLpc = res;

		},
		error: function(response) {
			$("#warningInformationModalBody").text(response.responseText);
			$("#warningBackdropButton").click();
		}
	});
}
function downloadLpcReportDataAsExcel(data) {
	const filename = 'LpcReport.xlsx';
	const headers = ['Part Code', 'Circuit Number', 'Batch Code', 'Batch Code', 'Lot Size', 'Created By', 'Date & Time'];

	let csvContent = headers.join('\t').toUpperCase() + '\n';

	data.forEach(entry => {

		console.log(entry.circuitNumber);

		console.log(entry.batchSize);

		console.log(entry.createdBy);

		const row = [
			entry.partCode,
			entry.circuitNumber,
			entry.batchCode,
			entry.batchSize,
			entry.lotSize,
			entry.createdBy,
			entry.dateTime
		].join('\t');
		csvContent += row + '\n';
	});

	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

	if (navigator.msSaveBlob) {
		navigator.msSaveBlob(blob, filename);
	} else {
		const link = document.createElement('a');
		if (link.download !== undefined) {
			const url = URL.createObjectURL(blob);
			link.setAttribute('href', url);
			link.setAttribute('download', filename);
			link.style.visibility = 'hidden';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	}
}





$(document).ready(function() {

	$(document).on('click', '#cktWiseTrackingReport', function() {

		searchLoad = false; clearInterval(interval);

		$(".fromTo").css("display", "block");
		$("#excelDownload").css("display", "block");
		$("#pageSelect").css("display", "block");
		$("#printPreview").css("display", "none");
		$("#next").css("display", "block");
		$("#previous").css("display", "block");
		$("#backToHarness").css("display", "none");
		$("#toggleActionFilterBtn").closest(".switch").css("display", "none");
				
		$("#offcanvasCloseButton").click();


		var child1 = document.getElementById("div3");
		var child2 = document.getElementById("div4");

		child1.remove();
		if (child2) { child2.remove(); }

		document.getElementById("masterHeading").innerText = "";
		$("#masterHeading").append("CKT WISE TRACKING REPORT");

		var div3 = document.createElement("div");
		var div4 = document.createElement("div");

		$("#div2").append(div3, div4);

		div3.setAttribute("id", "div3");
		div3.setAttribute("class", "masterBody emptyContainer");

		div4.setAttribute("id", "div4");
		div4.setAttribute("class", "masterBody");
		div4.setAttribute("Style", "overflow-y:scroll; display:none;");

		var bottom = document.createElement("div");

		bottom.setAttribute("id", "bottom");
		/*	bottom.setAttribute("style","height: 50%;")*/

		$("#div4").append(bottom);

		var element1 = document.createElement("table");
		$("#div3").append(element1);
		element1.setAttribute("id", "table1");
		element1.setAttribute("cellspacing", "0px");
		/*element1.setAttribute("cellpaddding","10px");*/
		element1.setAttribute("class", "table-hover");

		var w = window.innerWidth;

		if (w < 500) {
			element1.setAttribute("style", "width:300%;");
		} else if (w < 1100) {
			element1.setAttribute("style", "width:250%;");
		}
		else if (w < 1500) {
			element1.setAttribute("style", "width:100%;");
		} else if (w < 1000) {
			element1.setAttribute("style", "width:150%;");
		} else {
			element1.setAttribute("style", "width:100%;");
		}

		var element1_1 = document.createElement("thead");
		element1.append(element1_1);

		var element1_2 = document.createElement("tr");


		var element1_3 = document.createElement("tbody");
		element1.append(element1_3)
		element1_3.setAttribute("id", "tableBody");


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

		var searchTitles = ["searchPartCode", "searchOrderNo"];

		for (var i = 0; i < searchTitles.length; i++) {
			var searchContainer = document.createElement("th");
			searchContainer.setAttribute("class", "tableheading");
			var searchinput = document.createElement("input");
			var list = document.createElement("datalist")
			searchinput.setAttribute("style", "width:100%;");
			searchinput.setAttribute("title", searchTitles[i]);
			searchinput.setAttribute("list", searchTitles[i]);
			list.setAttribute("id", searchTitles[i]);
			searchinput.setAttribute("class", "searchFilterClass inputs");
			searchContainer.append(searchinput, list);
			searchRow.append(searchContainer);
		}

		element1_1.append(searchRow);
		element1_1.append(element1_2);


		var element2 = document.createElement("th");
		element2.innerText = "S.No.";
		var element3 = document.createElement("th");
		element3.innerText = "Part Code";
		var element3_2 = document.createElement("th");
		element3_2.innerText = "Leading No.";
		var element4 = document.createElement("th");
		element4.innerText = "CKT No.";
		var element5 = document.createElement("th");
		element5.innerText = "Lot Size";
		var element5_1 = document.createElement("th");
		element5_1.innerText = "Machine No";
		var element6 = document.createElement("th");
		element6.innerText = "Cut & Strip";
		var element6_3 = document.createElement("th");
		element6_3.innerText = "Quality";
		var element7 = document.createElement("th");
		element7.innerText = "Semi Auto";
		var element8 = document.createElement("th");
		element8.innerText = "MPCR-IN";
		var element8_2 = document.createElement("th");
		element8_2.innerText = "MPCR-OUT";
		var element9 = document.createElement("th");
		element9.innerText = "Assembly";
		/*	var element9 = document.createElement("th");
					element9.innerText = "Date & Time";*/
		var element9_2 = document.createElement("th");
		element9_2.innerText = "Id";


		element1_2.append(element2, element3, element3_2, element4, element5, element5_1, element6, element6_3, element7, element8, element8_2, element9, element9_2);
		element2.setAttribute("class", "tableheading");
		// element2.setAttribute("scope","col");
		element3.setAttribute("class", "tableheading");
		// element3.setAttribute("scope","col");
		element3_2.setAttribute("class", "tableheading");
		// element3.setAttribute("scope","col");
		element4.setAttribute("class", "tableheading");
		// element4.setAttribute("scope","col");
		element5.setAttribute("class", "tableheading");
		element5_1.setAttribute("class", "tableheading");
		// element5.setAttribute("scope","col");
		element6.setAttribute("class", "tableheading");
		// element6.setAttribute("scope","col");
		element6_3.setAttribute("class", "tableheading");
		// element6_3.setAttribute("scope","col");
		element7.setAttribute("class", "tableheading");
		// element7.setAttribute("scope","col");
		element8.setAttribute("class", "tableheading");
		element8_2.setAttribute("class", "tableheading");
		// element8.setAttribute("scope","col");
		element9.setAttribute("class", "tableheading");
		element9_2.setAttribute("class", "tableheading");
		element9_2.setAttribute("style", "display:none;");
		// element9.setAttribute("scope","col");

		var element18_2 = document.createElement("div");
		element18_2.setAttribute("class", "buttonsContainer");

		var element41 = document.createElement("div");
		element41.setAttribute("class", "buttonsContainer");

		var element44 = document.createElement("button");
		element44.setAttribute("class", "data");
		element44.setAttribute("title", "Excel Download");

		element41.append(element44);
		element18_2.append(element41);

		$("#bottom").append(element18_2);

		$("#pageSelect").empty();
		getCurrentDate();
		getAllPartCodeInList();

	});

});


function getAllMindaPartInList() {
	$.ajax({
		url: "/WebApplication/Controllers/getAllFgPartInList",
		type: 'GET',
		contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		async: false,
		dataType: 'json',
		success: function(res) {
			for (var i = 0; i < res.length; i++) {
				var str = res[i];
				var id_Mindapart = str.split(',');

				for (var j = 0; j < id_Mindapart.length - 1; j++) {
					var row = '<option value="' + id_Mindapart[j + 1] + '" style="font-size:5px;">';
					$('#partNumberList').append(row);
					$('#partNumberDataList').append(row);
				}
			}
		}
	});
}


function getAllPartCodeInList() {
	$.ajax({
		url: "/WebApplication/Controllers/getAllFgPartInList",
		type: 'GET',
		contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		async: false,
		dataType: 'json',
		success: function(res) {
			for (var i = 0; i < res.length; i++) {
				var str = res[i];
				var id_Mindapart = str.split(',');

				for (var j = 0; j < id_Mindapart.length - 1; j++) {
					var row = '<option value="' + id_Mindapart[j + 1] + '" style="font-size:5px;">';
					$("#searchPartCode").append(row);
				}
			}
		}
	});
}


function getCompletCountByLineLeaderId(lineLeaderId) {

	var returnData;

	var formData = {
		lineLeaderId: lineLeaderId,

	}
	$.ajax({
		type: 'post',
		url: "/WebApplication/Controllers/getCompletCountByLineLeaderId",
		data: JSON.stringify(formData),
		contentType: "application/json",
		async: false,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			returnData = response;
		},
		error: function(response) {

		}
	});

	return returnData;
}

function getCompleteQualityLpcMpcrAssemblyByLineLeaderId(lineLeaderIds) {

	var returnData;
	var iterableformData = [];


	for (var i = 0; i < lineLeaderIds.length; i++) {

		var lineLeader = {
			lineLeaderId: lineLeaderIds[i],
		}
		iterableformData.push(lineLeader);

	}

	$.ajax({
		type: 'post',
		url: "/WebApplication/Controllers/getCompleteQualityLpcMpcrAssemblyByLineLeaderId",
		data: JSON.stringify(iterableformData),
		contentType: "application/json",
		async: false,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			returnData = response;
		},
		error: function(response) {

		}
	});

	return returnData;
}



function getQualityCountByLineLeaderId(lineLeaderId) {

	var returnData;

	var formData = {
		lineLeaderId: lineLeaderId,

	}
	$.ajax({
		type: 'post',
		url: "/WebApplication/Controllers/getQualityCountByLineLeaderId",
		data: JSON.stringify(formData),
		contentType: "application/json",
		async: false,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			returnData = response;
		},
		error: function(response) {

		}
	});

	return returnData;
}

function getLPCCountByLineLeaderId(lineLeaderId) {

	var returnData;

	var formData = {
		lineLeaderId: lineLeaderId,

	}
	$.ajax({
		type: 'post',
		url: "/WebApplication/Controllers/getLPCCountByLineLeaderId",
		data: JSON.stringify(formData),
		contentType: "application/json",
		async: false,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			returnData = response;
		},
		error: function(response) {

		}
	});

	return returnData;
}

function getMPCRInCountByLineLeaderId(lineLeaderId) {

	var returnData;

	var formData = {
		lineLeaderId: lineLeaderId,

	}
	$.ajax({
		type: 'post',
		url: "/WebApplication/Controllers/getMPCRInCountByLineLeaderId",
		data: JSON.stringify(formData),
		contentType: "application/json",
		async: false,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			returnData = response;
		},
		error: function(response) {

		}
	});

	return returnData;
}


function getMPCRCountByLineLeaderId(lineLeaderId) {

	var returnData;

	var formData = {
		lineLeaderId: lineLeaderId,

	}
	$.ajax({
		type: 'post',
		url: "/WebApplication/Controllers/getMPCRCountByLineLeaderId",
		data: JSON.stringify(formData),
		contentType: "application/json",
		async: false,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			returnData = response;
		},
		error: function(response) {

		}
	});

	return returnData;
}


function getAssemblyCountByLineLeaderId(lineLeaderId) {

	var returnData;

	var formData = {
		lineLeaderId: lineLeaderId,

	}
	$.ajax({
		type: 'post',
		url: "/WebApplication/Controllers/getAssemblyCountByLineLeaderId",
		data: JSON.stringify(formData),
		contentType: "application/json",
		async: false,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			returnData = response;
		},
		error: function(response) {

		}
	});

	return returnData;
}


$(document).on('click', '#searchButton', function(e) {

	var text = $("#masterHeading").text();

	if (text == "CKT WISE TRACKING REPORT") {
		var page = 0;
		loadHarnessLiveDataAndPager(page)
	} else if (text == "HARNESS WISE TRACKING REPORT") {
		var page = 0;
		loadHarnessWiseDataAndPager(page)
	} else if (text == "CONVEYOR PACKING REPORT") {
		var page = 0;
		loadLikeConveyorPackData(page);
	} else if (text == "CKT PLAN REPORT") {
		var page = 0;
		loadLikeDateWiseCktPlanData(page);
	} else if (text == "WORK IN PROGRESS REPORT") {
		var page = 0;
		loadLpcMpcrAssemblyData(page);
	} else if (text == "CONVEYOR REPORT") {
		var page = 0;
		loadConveyorData(page);
	} else if (text == "IOT DASHBOARD - LPC SECTION") {
		var page = 0;
		loadIotDashboard();
	} else if (text == "IOT DASHBOARD - ASSEMBLY SECTION") {
		var page = 0;
		loadIotConveyorDashboard();
	} else if (text == "WORK IN PROGRESS REJECTION REPORT") {
		var page = 0;
		searchWipRejection(page);
	} else if (text == "RECEIVING QUALITY REPORT") {
		var page = 0;
		loadReceivingQualityReport(page);

	} else if (text == "FINAL INSPECTION REPORT") {
		var page = 0;
		loadFinalControlReport(page);

	} else if (text == "MANPOWER DEPLOYMENT REPORT") {
		var page = 0;
		loadManPowerDeploymentReport(page);

	} else if (text == "MANPOWER DEPLOYMENT ENTRY REPORT") {
		var page = 0;
		loadManpowerEntryReport(page);

	} else if (text == "MANPOWER SHORTAGE REPORT") {
		var page = 0;
		getAllShortageByConveyor();

	}
	else if (text == "MANPOWER REPORT") {

		manpowerDashboardData();

	}
});

function loadHarnessLiveDataAndPager(page) {

	searchLoad = true;

	var partCode = $('input[title="searchPartCode"]').val() ?? '';
	var batchCode = $('input[title="searchOrderNo"]').val() ?? '';
	var from = $("input[name=from]").val();
	var to = $("input[name=to]").val();

	if (!from && !to) {
		alert("Please select date to get date wise ckt plan report.");
		return;
	}

	const startDate = new Date(from);
	const endDate = new Date(to);
	var difference = dateDifference(startDate, endDate);

	if (difference < 0) {
		alert("Selected From date is greater than To date pleaase check it.");
		return;
	}


	$("#loadingBackdropButton").click();
	$("#loadingBackdropModalMessage").text("Getting CKT numbers via part code.");

	var formData = {
		mindaPart: partCode,
		customerPart: batchCode,
		dateTime: from + "," + to
	}

	$.ajax({
		type: 'post',
		url: "/WebApplication/Controllers/getHarnessLiveData/" + page,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {

			makePager(response.totalPages, page)
			insertHarnessLiveDataInTable(response.content);
			$("#div3").removeClass("emptyContainer");
			setTimeout(function() {
				$("#loadingBackdropButton").click();
			}, 500);
		},
		error: function(response) {

			setTimeout(function() {
				$("#loadingBackdropButton").click();
				alert(response.responseText);
			}, 500);

		}
	});
}


//----fro excel download---------------
var totalRows = 0;

function loadHarnessLiveDataForExcel() {

	$("#loadingBackdropButton").click();
	$("#loadingBackdropModalMessage").text("Getting CKT numbers via part code.");

	var partNumber = $("input[name=partNumber]").val();
	var dateTime = $("input[name=to]").val();

	if (!partNumber) {
		alert("Part Code is mandatory to get details.");
	} else {
		var formData = {
			mindaPart: partNumber,
			dateTime: dateTime
		};

		$.ajax({
			type: 'post',
			url: "/WebApplication/Controllers/getHarnessLiveDataForExcelData",
			data: JSON.stringify(formData),
			contentType: "application/json",
			headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
			success: function(response) {
				if (response.length > 0) {
					var text = document.getElementById("masterHeading").innerHTML;
					if (text == "CKT WISE TRACKING REPORT") {
						var formattedData = formatDataForDownload(response);
						$(".data").on("click", function() {

							downloadHarnessLiveDataAsExcel(formattedData);

							totalRows = 0;
						});
					}
				} else {
					setTimeout(function() {
						$("#loadingBackdropButton").click();
					}, 500);
					setTimeout(function() {
						alert("No data found for Part No = " + partNumber);
					}, 1000);
				}
			},
			error: function(response) {

			}
		});
	}
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
			$("#uploadBackdropModal").hide();
		}, 2000)
	}
}

function formatDataForDownload(data) {

	var formattedData = [];

	for (var i = 0; i < data.length; i++) {
		var list = data[i].split(',');

		var completCount = getCompletCountByLineLeaderId(list[6]);
		var qualityCount = getQualityCountByLineLeaderId(list[6]);
		var lpcCount = getLPCCountByLineLeaderId(list[6]);
		var mpcrInCount = getMPCRInCountByLineLeaderId(list[6]);
		var mpcrCount = getMPCRCountByLineLeaderId(list[6]);
		var assemblyCount = getAssemblyCountByLineLeaderId(list[6]);

		var compleTDLotInPercent = getPecentageForexcel((parseInt(list[4]) * parseInt(completCount)), parseInt(list[3]));
		var compleTDQualityInPercent = getPecentageForexcel((parseInt(list[4]) * parseInt(qualityCount)), parseInt(list[3]));
		var compleTDLpcInPercent = getPecentageForexcel((parseInt(list[4]) * parseInt(lpcCount)), parseInt(list[3]));
		var compleTDMpcrInInPercent = getPecentageForexcel((parseInt(list[4]) * parseInt(mpcrInCount)), parseInt(list[3]));
		var compleTDMpcrOutInPercent = getPecentageForexcel((parseInt(list[4]) * parseInt(mpcrCount)), parseInt(list[3]));
		var compleTDAssemblyInPercent = getPecentageForexcel((parseInt(list[4]) * parseInt(assemblyCount)), parseInt(list[3]));


		var formattedRow = [
			list[0],
			list[1],
			list[2],
			list[3],
			list[5],
			compleTDLotInPercent,
			compleTDQualityInPercent,
			compleTDLpcInPercent,
			compleTDMpcrInInPercent,
			compleTDMpcrOutInPercent,
			compleTDAssemblyInPercent
		];

		formattedData.push(formattedRow);
	}

	return formattedData;
}

function downloadHarnessLiveDataAsExcel(data) {
	const filename = 'work_in_progress_data.xlsx';
	const headers = ['Part Code', 'Batch Code', 'Circuit Number', 'Lot Size', 'Machine Number', 'Completion Lot (%)', 'Quality Lot (%)', 'LPC Lot (%)', 'MPCR In (%)', 'MPCR Out (%)', 'Assembly (%)'];

	let csvContent = headers.join('\t').toUpperCase() + '\n';

	data.forEach((row) => {
		const rowData = row.join('\t');
		csvContent += rowData + '\n';
	});

	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

	if (navigator.msSaveBlob) {
		navigator.msSaveBlob(blob, filename);
	} else {
		const link = document.createElement('a');
		if (link.download !== undefined) {
			const url = URL.createObjectURL(blob);
			link.setAttribute('href', url);
			link.setAttribute('download', filename);
			link.style.visibility = 'hidden';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);


		}
	}
}

function getPecentageForexcel(completeLot, lotSize) {

	var green = "background-color:limegreen; color:white;";
	var yellow = "background-color:yellow; color:black;";
	var compleLotInPercent = Math.ceil((completeLot / lotSize) * 100);

	if (compleLotInPercent >= 100) {
		return completeLot + "  (" + compleLotInPercent + "%)";
	} else {
		return completeLot + "  (" + compleLotInPercent + "%)";
	}
}

function insertHarnessLiveDataInTable(res) {

	$("#tableBody").remove();

	var tablebody = document.createElement("tbody");
	$("#table1").append(tablebody);
	tablebody.setAttribute("id", "tableBody");

	var sequenceNumber;

	if (!$('#pageSelect :selected').val()) {
		sequenceNumber = 0;
	} else {
		sequenceNumber = pageSize * parseInt($('#pageSelect :selected').val());
	}

	var rows = '';

	var lineLeaderIds = [];

	for (var i = 0; i < res.length; i++) {
		var str = res[i];
		var list = str.split(',');
		lineLeaderIds.push(list[6]);
	}

	var allCompletCount = getCompleteQualityLpcMpcrAssemblyByLineLeaderId(lineLeaderIds);

	for (var i = 0; i < res.length; i++) {
		var str = res[i];
		var list = str.split(',');

		var compleTDLotInPercent = getPecentage(allCompletCount[i][0].split(","), parseInt(list[3]));
		var compleTDQualityInPercent = getPecentage(allCompletCount[i][1].split(","), parseInt(list[3]));
		var compleTDLpcInPercent = getPecentage(allCompletCount[i][2].split(","), parseInt(list[3]));
		var compleTDMpcrInInPercent = getPecentage(allCompletCount[i][3].split(","), parseInt(list[3]));
		var compleTDMpcrOutInPercent = getPecentage(allCompletCount[i][4].split(","), parseInt(list[3]));
		var compleTDAssemblyInPercent = getPecentage(allCompletCount[i][5].split(","), parseInt(list[3]));

		var row = '<tr class="tableDataRows"><td data-column="columnId" style="width:70px">' + (sequenceNumber + 1) + '</td><td data-column="partCode">' + list[0] + '</td><td data-column="batchCode">' + list[1] + '</td><td data-column="circuitumber">' + list[2] + '</td><td data-column="lotSize">' + list[3] + '</td><td data-column="machineNumber">' + list[7] + "</td>" + compleTDLotInPercent + compleTDQualityInPercent + compleTDLpcInPercent + compleTDMpcrInInPercent + compleTDMpcrOutInPercent + compleTDAssemblyInPercent + '</td><td data-column="lineLeaderId" style="display:none;">' + list[6] + "</td></tr>";
		rows += row;
		sequenceNumber++;
	}

	$("#table1").append(rows);

	setTimeout(function() {
		$("#loadingBackdropButton").click();
	}, 500);
}


function getPecentage(completeLot, lotSize) {



	var green = "background-color:limegreen; color:white;";
	var yellow = "background-color:yellow; color:black;";

	if (completeLot[1] == "null") {
		var compleLotInPercent = Math.floor((completeLot[0] / lotSize) * 100);

		if (compleLotInPercent >= 100) {
			return '<td style="' + green + ' ">' + Math.floor(completeLot[0]) + "  (" + compleLotInPercent + "%)</td>";
		} else {
			return '<td style="' + yellow + ' ">' + Math.floor(completeLot[0]) + "  (" + compleLotInPercent + "%)</td>";
		}
	} else {
		var compleLotInPercent = Math.floor((completeLot[1] / lotSize) * 100);
		if (compleLotInPercent >= 100) {
			return '<td style="' + green + ' ">' + Math.floor(completeLot[1]) + "  (" + compleLotInPercent + "%)</td>";
		} else {
			return '<td style="' + yellow + ' ">' + Math.floor(completeLot[1]) + "  (" + compleLotInPercent + "%)</td>";
		}
	}

}





$(document).ready(function() {

	$(document).on('click', '#hearnessWiseTrackingReport', function() {

		$(".fromTo").css("display", "block");
		$("#excelDownload").css("display", "block");
		$("#pageSelect").css("display", "block");
		$("#printPreview").css("display", "none");
		$("#next").css("display", "block");
		$("#previous").css("display", "block");
		$("#backToHarness").css("display", "none");
		$("#toggleActionFilterBtn").closest(".switch").css("display", "none");
				
		$("#offcanvasCloseButton").click();

		var child1 = document.getElementById("div3");
		var child2 = document.getElementById("div4");

		child1.remove();
		if (child2) { child2.remove(); }

		document.getElementById("masterHeading").innerText = "";
		$("#masterHeading").append("HARNESS WISE TRACKING REPORT");

		var div3 = document.createElement("div");
		var div4 = document.createElement("div");

		$("#div2").append(div3, div4);

		div3.setAttribute("id", "div3");
		div3.setAttribute("class", "masterBody emptyContainer");

		div4.setAttribute("id", "div4");
		div4.setAttribute("class", "masterBody");
		div4.setAttribute("Style", "overflow-y:scroll; display:none;");

		var bottom = document.createElement("div");

		bottom.setAttribute("id", "bottom");
		/*	bottom.setAttribute("style","height: 50%;")*/

		$("#div4").append(bottom);

		var element1 = document.createElement("table");
		$("#div3").append(element1);
		element1.setAttribute("id", "table1");
		element1.setAttribute("cellspacing", "0px");
		/*element1.setAttribute("cellpaddding","10px");*/
		element1.setAttribute("class", "table-hover");

		var w = window.innerWidth;

		if (w < 500) {
			element1.setAttribute("style", "width:300%;");
		} else if (w < 1100) {
			element1.setAttribute("style", "width:250%;");
		}
		else if (w < 1500) {
			element1.setAttribute("style", "width:100%;");
		} else if (w < 1000) {
			element1.setAttribute("style", "width:150%;");
		} else {
			element1.setAttribute("style", "width:100%;");
		}


		var element1_1 = document.createElement("thead");
		element1.append(element1_1);

		var element1_2 = document.createElement("tr");


		var element1_3 = document.createElement("tbody");
		element1.append(element1_3)
		element1_3.setAttribute("id", "tableBody");


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

		var searchTitles = ["searchPartCode", "searchOrderNo"];

		for (var i = 0; i < searchTitles.length; i++) {
			var searchContainer = document.createElement("th");
			searchContainer.setAttribute("class", "tableheading");
			var searchinput = document.createElement("input");
			var list = document.createElement("datalist")
			searchinput.setAttribute("style", "width:100%;");
			searchinput.setAttribute("title", searchTitles[i]);
			searchinput.setAttribute("list", searchTitles[i]);
			list.setAttribute("id", searchTitles[i]);
			searchinput.setAttribute("class", "searchFilterClass inputs");
			searchContainer.append(searchinput, list);
			searchRow.append(searchContainer);
		}

		element1_1.append(searchRow);
		element1_1.append(element1_2);

		var element2 = document.createElement("th");
		element2.innerText = "S.No.";
		var element3 = document.createElement("th");
		element3.innerText = "Part Code";
		var element3_2 = document.createElement("th");
		element3_2.innerText = "Leading No.";
		var element4 = document.createElement("th");
		element4.innerText = "Lot Plan";
		var element5 = document.createElement("th");
		element5.innerText = "No Of Circuit";
		var element6 = document.createElement("th");
		element6.innerText = "Cut & Strip";
		var element6_3 = document.createElement("th");
		element6_3.innerText = "Semi Auto";
		var element7 = document.createElement("th");
		element7.innerText = "MPCR";
		var element8 = document.createElement("th");
		element8.innerText = "Assembly";



		element1_2.append(element2, element3, element3_2, element4, element5, element6, element6_3, element7, element8);
		element2.setAttribute("class", "tableheading");
		// element2.setAttribute("scope","col");
		element3.setAttribute("class", "tableheading");
		// element3.setAttribute("scope","col");
		element3_2.setAttribute("class", "tableheading");
		// element3.setAttribute("scope","col");
		element4.setAttribute("class", "tableheading");
		// element4.setAttribute("scope","col");
		element5.setAttribute("class", "tableheading");
		// element5.setAttribute("scope","col");
		element6.setAttribute("class", "tableheading");
		// element6.setAttribute("scope","col");
		element6_3.setAttribute("class", "tableheading");
		// element6_3.setAttribute("scope","col");
		element7.setAttribute("class", "tableheading");
		// element7.setAttribute("scope","col");
		// element9.setAttribute("scope","col");
		element8.setAttribute("class", "tableheading");
		// element7.setAttribute("scope","col");

		var element18_2 = document.createElement("div");
		element18_2.setAttribute("class", "buttonsContainer");

		var element41 = document.createElement("div");
		element41.setAttribute("class", "buttonsContainer");

		var element44 = document.createElement("button");
		element44.setAttribute("class", "data");
		element44.setAttribute("title", "Excel Download");

		element41.append(element44);
		element18_2.append(element41);

		$("#bottom").append(element18_2);
		$("#pageSelect").empty();
		getAllPartCodeInList();
		getCurrentDate();

	});

});

function getNoOfCircuitsByPartCode(partCode, batchCode) {

	var returnData;

	var formData = {
		partCode: partCode,
		batchCode: batchCode
	}
	$.ajax({
		type: 'post',
		url: "/WebApplication/Controllers/getNoOfCircuitsByPartCode",
		data: JSON.stringify(formData),
		contentType: "application/json",
		async: false,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			returnData = response;
		},
		error: function(response) {

		}
	});

	return returnData;
}



function getCompleteCountByPartAndBatchCode(partCode, batchCode) {

	$("#loadingBackdropModalMessage").text("Getting Quality passed lots by Part Code.");

	var returnData;

	var formData = {
		partCode: partCode,
		batchCode: batchCode,
	}
	$.ajax({
		type: 'post',
		url: "/WebApplication/Controllers/getCompleteCountByPartAndBatchCode",
		data: JSON.stringify(formData),
		contentType: "application/json",
		async: false,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			returnData = response;
		},
		error: function(response) {

		}
	});

	return returnData;
}

function getLpcCountByPartAndBatchCode(partCode, batchCode) {

	$("#loadingBackdropModalMessage").text("Getting LPC IN lots by Part Code.");

	var returnData;

	var formData = {
		partCode: partCode,
		batchCode: batchCode,

	}
	$.ajax({
		type: 'post',
		url: "/WebApplication/Controllers/getLpcCountByPartAndBatchCode",
		data: JSON.stringify(formData),
		contentType: "application/json",
		async: false,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			returnData = response;
		},
		error: function(response) {

		}
	});

	return returnData;
}


function getMpcrCountByPartAndBatchCode(partCode, batchCode) {

	$("#loadingBackdropModalMessage").text("Getting MPCR IN  and OUT lots by Part Code.");

	var returnData;

	var formData = {
		partCode: partCode,
		batchCode: batchCode,

	}
	$.ajax({
		type: 'post',
		url: "/WebApplication/Controllers/getMpcrCountByPartAndBatchCode",
		data: JSON.stringify(formData),
		contentType: "application/json",
		async: false,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			returnData = response;
		},
		error: function(response) {

		}
	});

	return returnData;
}


function getAssemblyCountByPartAndBatchCode(partCode, batchCode) {

	$("#loadingBackdropModalMessage").text("Getting Assembly IN lots by Part Code.");

	var returnData;

	var formData = {
		partCode: partCode,
		batchCode: batchCode,
	}
	$.ajax({
		type: 'post',
		url: "/WebApplication/Controllers/getAssemblyCountByPartAndBatchCode",
		data: JSON.stringify(formData),
		contentType: "application/json",
		async: false,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			returnData = response;
		},
		error: function(response) {

		}
	});

	return returnData;
}


function loadHarnessWiseDataAndPager(page) {
	searchLoad = true;

	var partCode = $('input[title="searchPartCode"]').val() ?? '';
	var batchCode = $('input[title="searchOrderNo"]').val() ?? '';
	var from = $("input[name=from]").val();
	var to = $("input[name=to]").val();

	if (!from && !to) {
		alert("Please select date to get date wise ckt plan report.");
		return;
	}

	const startDate = new Date(from);
	const endDate = new Date(to);
	var difference = dateDifference(startDate, endDate);

	if (difference < 0) {
		alert("Selected From date is greater than To date pleaase check it.");
		return;
	}


	$("#loadingBackdropButton").click();
	$("#loadingBackdropModalMessage").text("Getting Harness Wise Report.");

	var formData = {
		mindaPart: partCode,
		customerPart: batchCode,
		dateTime: from + "," + to
	}

	$.ajax({
		type: 'post',
		url: "/WebApplication/Controllers/getHarnessWiseData/" + page,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			makePager(response.totalPages, page)
			insertHarnessWiseDataInTable(response.content);
			$("#div3").removeClass("emptyContainer");
			setTimeout(function() {
				$("#loadingBackdropButton").click();
			}, 500);
		},
		error: function(response) {
			setTimeout(function() {
				$("#loadingBackdropButton").click();
				alert(response.responseText);
			}, 500);
		}
	});
}


function resetTableBody(tableBodyId) {
	$("#" + tableBodyId).empty();

	/*		$("#tableBody").remove();
			var tablebody = document.createElement("tbody");
			$("#table1").append(tablebody);
			tablebody.setAttribute("id", "tableBody");*/
}

function loadHarnessWiseDataForExcel() {

	$("#loadingBackdropButton").click();
	$("#loadingBackdropModalMessage").text("Getting Harness Data via part code and Date.");

	var dateTime = $("input[name=to]").val();

	var formData = {
		dateTime: dateTime
	}

	$.ajax({
		type: 'post',
		url: "/WebApplication/Controllers/getHarnessWiseDataForExcel",
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			if (response.length > 0) {
				console.log("harnesswisedata::" + response)
				var text = document.getElementById("masterHeading").innerHTML;
				if (text == "HARNESS WISE TRACKING REPORT") {
					var formattedData = formatDataForDownloadForHarness(response);
					$(".data").on("click", function() {
						/*  $("#uploadBackdropLabel").text("Converting Excel :");
						 document.querySelector("#uploadImage").setAttribute("src", "/images/processing.gif");
						 $("#upload").attr("style", "display:none");
						 $("#uploadExcel").attr("style", "display:none");
						 $("#uploadCloseButton").attr("style", "background: transparent; height: 30px; width: 30px; border: 0px; display:none;");
						 $("#uploadWaiting").removeAttr("style");
						 $("#uploadWaiting").text("Please wait......");
						 $("#myProgress").removeAttr("style");
						 $("#uploadBackdropButton").click();
						 totalRows = response.length; 
						 move(totalRows);
						 */
						downloadHarnessLiveDataAsExcel(formattedData);

						totalRows = 0;
					});
				}


			} else {
				setTimeout(function() {
					$("#loadingBackdropButton").click();
				}, 500);
				setTimeout(function() {
					alert("No data found aganist Part No = " + partNumber);
				}, 1000);
			}
		},
		error: function(response) {

		}
	});
}

function formatDataForDownloadForHarness(data) {

	var formattedDataForHarness = [];

	for (var i = 0; i < data.length; i++) {
		var list = data[i].split(',');

		var compleTDLotInPercent = completeLotPercentageExcel(getCompleteCountByPartAndBatchCode(list[0], list[1]), list[3], list[2]);
		var compleTDLpcInPercent = getPercentageByAddingExcel(getLpcCountByPartAndBatchCode(list[0], list[1]), list[3], list[2]);
		var compleTDMpcrInInPercent = getPercentageByAddingExcel(getMpcrCountByPartAndBatchCode(list[0], list[1]), list[3], list[2]);
		var compleTDAssemblyInPercent = getPercentageByAddingExcel(getAssemblyCountByPartAndBatchCode(list[0], list[1]), list[3], list[2]);



		var formattedRows = [
			list[0],
			list[1],
			list[2],
			list[3],
			list[5],
			compleTDLotInPercent,
			compleTDLpcInPercent,
			compleTDMpcrInInPercent,
			compleTDAssemblyInPercent
		];

		formattedDataForHarness.push(formattedRows);
	}

	return formattedDataForHarness;
}

function downloadHarnessWiseDataAsExcel(data) {
	const filename = 'HarnessWiseData.xlsx';
	const headers = ['Part Code', 'Batch Code', 'Circuit Number', 'Lot Size', 'Machine Number', 'Completion Lot (%)', 'Quality Lot (%)', 'LPC Lot (%)', 'MPCR In (%)', 'MPCR Out (%)', 'Assembly (%)'];

	let csvContent = headers.join('\t').toUpperCase() + '\n';

	data.forEach((row) => {
		const rowData = row.join('\t');
		csvContent += rowData + '\n';
	});

	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

	if (navigator.msSaveBlob) {
		navigator.msSaveBlob(blob, filename);
	} else {
		const link = document.createElement('a');
		if (link.download !== undefined) {
			const url = URL.createObjectURL(blob);
			link.setAttribute('href', url);
			link.setAttribute('download', filename);
			link.style.visibility = 'hidden';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);


		}
	}
}
function completeLotPercentageExcel(list, batchSize, lotSize) {
	var completeLot = 0;

	for (var i = 0; i < list.length; i++) {
		completeLot = completeLot + parseInt(list[i]);
	}

	var green = "background-color:limegreen; color:white;";
	var yellow = "background-color:yellow; color:black;";



	var compleLotInPercent = Math.ceil((completeLot / lotSize) * 100);

	if (compleLotInPercent >= 100) {
		return completeLot + "  (" + compleLotInPercent + "%" + ")";
	} else {
		return completeLot + "  (" + compleLotInPercent + "%" + ")";
	}
}


function getPercentageByAddingExcel(list, batchSize, lotSize) {

	var completeLot = 0;

	for (var i = 0; i < list.length; i++) {

		completeLot = completeLot + parseInt(list[i]);
	}

	var green = "background-color:limegreen; color:white;";
	var yellow = "background-color:yellow; color:black;";


	var compleLotInPercent = Math.ceil((completeLot / lotSize) * batchSize);

	if (compleLotInPercent >= 100) {
		return completeLot + "  (" + compleLotInPercent + "%" + ")";
	} else {
		return completeLot + "  (" + compleLotInPercent + "%" + ")";
	}

}

function loadHarnessWisePager(page) {

	var dateTime = $("input[name=to]").val();
	$("#loadingBackdropModalMessage").text("Getting all pages via part code.");

	var formData = {
		dateTime: dateTime
	}

	$.ajax({
		type: 'post',
		url: "/WebApplication/Controllers/getHarnessWisePager",
		data: JSON.stringify(formData),
		contentType: "application/json",
		async: false,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {

			$("#pageSelect").empty();
			for (var i = 0; i <= Math.ceil(parseInt(response.length) / pageSize); i++) {

				$("#pageSelect").append("<option value='" + i + "'>" + (i + 1) + "</option>");
			}
			$("#pageSelect").val(page);
		},
		error: function(response) {

		}
	});
}



function insertHarnessWiseDataInTable(res) {

	$("#tableBody").remove();
	var tablebody = document.createElement("tbody");
	$("#table1").append(tablebody);
	tablebody.setAttribute("id", "tableBody");

	var sequenceNumber = pageSize * parseInt($('#pageSelect :selected').val());

	for (var i = 0; i < res.length; i++) {
		var str = res[i];
		var list = str.split(',');

		var noOfCircuit = getNoOfCircuitsByPartCode(list[0], list[1]);

		var compleTDLotInPercent = completeLotPercentage(getCompleteCountByPartAndBatchCode(list[0], list[1]), list[3], list[2], parseInt(noOfCircuit));
		/*		var compleTDLpcInPercent = completeLotPercentage(getLpcCountByPartAndBatchCode(list[0], list[1]), list[3], list[2], noOfCircuit);
				var compleTDMpcrInPercent = completeLotPercentage(getMpcrCountByPartAndBatchCode(list[0], list[1]), list[3], list[2], noOfCircuit);
				var compleTDAssemblyInPercent = completeLotPercentage(getAssemblyCountByPartAndBatchCode(list[0], list[1]), list[3], list[2], noOfCircuit);*/
		/*	+ compleTDLpcInPercent + compleTDMpcrInPercent + compleTDAssemblyInPercent*/

		var row = '<tr class="tableDataRows"><td data-column="columnId" style="width:70px">' + (sequenceNumber + 1) + "</td>" + '<td data-column="partCode">' + list[0] + "</td>"
			+ '<td data-column="batchCode">' + list[1] + "</td>" + '<td data-column="lotSize">' + list[2] + "</td>" + '<td data-column="noOfCircuit">' + noOfCircuit + "</td>" + compleTDLotInPercent + "</td></tr>";
		$("#table1").append(row);
		sequenceNumber++;
	}

	setTimeout(function() {
		$("#loadingBackdropButton").click();
	}, 500);
}

function completeLotPercentage(list, batchSize, lotSize, noOfCircuit) {
	var lpcCKTCount = 0;
	var mpcrCKTCount = 0;
	var assyCKTCount = 0;


	for (var i = 0; i < list.length; i++) {

		var splitedList = list[i].split(",");

		if (splitedList[1] == "1") {
			lpcCKTCount = lpcCKTCount + 1;
		} else if (splitedList[1] == "3" || splitedList[1] == "2") {
			lpcCKTCount = lpcCKTCount + 1;
			mpcrCKTCount = mpcrCKTCount + 1;
		} else if (splitedList[1] == "4") {
			lpcCKTCount = lpcCKTCount + 1;
			mpcrCKTCount = mpcrCKTCount + 1;
			assyCKTCount = assyCKTCount + 1;
		}
	}

	var green = "background-color:limegreen; color:white;";
	var yellow = "background-color:yellow; color:black;";

	var lpc = getColorAndPercentageByCKT(lpcCKTCount, noOfCircuit, lotSize);
	var mpcr = getColorAndPercentageByCKT(mpcrCKTCount, noOfCircuit, lotSize);
	var assy = getColorAndPercentageByCKT(assyCKTCount, noOfCircuit, lotSize);

	/**/

	if (list.length == noOfCircuit) {
		return '<td style="' + green + ' ">' + list.length + " SS / " + (list.length * lotSize) + "  (" + Math.floor(list.length / noOfCircuit * 100) + "%" + ")" + '</td>' + lpc + mpcr + assy;
	} else {
		return '<td style="' + yellow + ' ">' + list.length + " SS / " + (list.length * lotSize) + "  (" + Math.floor(list.length / noOfCircuit * 100) + "%" + ")" + '</td>' + lpc + mpcr + assy;
	}
}

function getColorAndPercentageByCKT(totalCircuit, noOfCircuit, lotSize) {

	var percentage = totalCircuit / noOfCircuit * 100;
	var green = "background-color:limegreen; color:white;";
	var yellow = "background-color:yellow; color:black;";

	if (percentage == 100) {
		return '</td>' + '<td style="' + green + ' ">' + totalCircuit + " SS / " + (totalCircuit * lotSize) + "  (" + Math.floor(totalCircuit / noOfCircuit * 100) + "%" + ")" + '</td>';
	} else {
		return '</td>' + '<td style="' + yellow + ' ">' + totalCircuit + " SS / " + (totalCircuit * lotSize) + "  (" + Math.floor(totalCircuit / noOfCircuit * 100) + "%" + ")" + '</td>';
	}

}


function getPercentageByAdding(list, batchSize, lotSize) {

	var completeLot = 0;

	for (var i = 0; i < list.length; i++) {

		completeLot = completeLot + parseInt(list[i]);
	}

	var green = "background-color:limegreen; color:white;";
	var yellow = "background-color:yellow; color:black;";


	var compleLotInPercent = Math.ceil((completeLot / lotSize) * 100);

	if (compleLotInPercent >= 100) {
		return '<td style="' + green + ' ">' + completeLot + "  (" + compleLotInPercent + "%" + ")" + '</td>';
	} else {
		return '<td style="' + yellow + ' ">' + completeLot + "  (" + compleLotInPercent + "%" + ")" + '</td>';
	}

}


$(document).ready(function() {

	$(document).on('click', '#conveyorPackingReport', function() {

		searchLoad = false;
		clearInterval(interval);

		$("#planDateDiv").css("display", "none");
		$("#pagerDiv").css("display", "block");
		$("#printPreview").css("display", "none");
		$("#backToHarness").css("display", "none");
		$("#toggleActionFilterBtn").closest(".switch").css("display", "none");
				
		clearInterval(interval);

		$("#offcanvasCloseButton").click();

		var child1 = document.getElementById("div3");
		var child2 = document.getElementById("div4");

		child1.remove();
		if (child2) { child2.remove(); }

		document.getElementById("masterHeading").innerText = "";
		$("#masterHeading").append("CONVEYOR PACKING REPORT");

		var div3 = document.createElement("div");
		var div4 = document.createElement("div");

		$("#div2").append(div3, div4);

		div3.setAttribute("id", "div3");
		div3.setAttribute("class", "masterBody");

		div4.setAttribute("id", "div4");
		div4.setAttribute("class", "masterBody");
		div4.setAttribute("Style", "overflow-y:scroll; display:none;");

		var bottom = document.createElement("div");

		bottom.setAttribute("id", "bottom");
		/*	bottom.setAttribute("style","height: 50%;")*/

		$("#div4").append(bottom);

		var element1 = document.createElement("table");
		$("#div3").append(element1);
		element1.setAttribute("id", "table1");
		element1.setAttribute("cellspacing", "0px");
		/*element1.setAttribute("cellpaddding","10px");*/
		element1.setAttribute("class", "table-hover");

		var w = window.innerWidth;

		if (w < 500) {
			element1.setAttribute("style", "width:300%;");
		} else if (w < 1100) {
			element1.setAttribute("style", "width:250%;");
		}
		else if (w < 1500) {
			element1.setAttribute("style", "width:100%;");
		} else if (w < 1000) {
			element1.setAttribute("style", "width:150%;");
		} else {
			element1.setAttribute("style", "width:100%;");
		}


		var element1_1 = document.createElement("thead");
		element1.append(element1_1);

		var element1_2 = document.createElement("tr");


		var element1_3 = document.createElement("tbody");
		element1.append(element1_3)
		element1_3.setAttribute("id", "tableBody");

		// search
		/*********************/


		var searchRow = document.createElement("tr");
		searchRow.setAttribute("id", "searchRow");
		var tr = document.createElement("th");
		tr.setAttribute("class", "tableheading");
		var img = document.createElement("img");
		img.setAttribute("src", "/WebApplication/images/searchFilter.png");
		img.setAttribute("id", "searchButton");
		img.setAttribute("width", "22");
		img.setAttribute("height", "22");
		tr.append(img);
		searchRow.append(tr);

		var searchTitles = ["searchModel", "searchMindaPartNumber", "searchCustomerPartNumber", "", "", "", "fromTo"];

		for (var i = 0; i < searchTitles.length; i++) {

			if (searchTitles[i] == "") {

				var searchContainer = document.createElement("th");
				searchContainer.setAttribute("class", "tableheading");

				searchRow.append(searchContainer);

			} else if (searchTitles[i] == "fromTo") {
				var th = document.createElement("th");
				th.setAttribute("class", "tableheading");
				th.setAttribute("style", "width:60px;");


				var th2 = document.createElement("th");
				th2.setAttribute("class", "tableheading");
				th2.setAttribute("style", "width:60px;");

				var input = document.createElement("input");
				input.setAttribute("type", "date");
				input.setAttribute("style", "width:100%;");
				input.setAttribute("name", "from");
				input.setAttribute("class", "searchFilterClass");
				th.append(input);

				var input2 = document.createElement("input");
				input2.setAttribute("type", "date");
				input2.setAttribute("style", "width:100%;");
				input2.setAttribute("name", "to");
				input2.setAttribute("class", "searchFilterClass");
				th2.append(input2);

				searchRow.append(th, th2);

			} else {
				var dataList = document.createElement("datalist");
				var searchContainer = document.createElement("th");
				searchContainer.setAttribute("class", "tableheading");
				var searchinput = document.createElement("input");
				searchinput.setAttribute("style", "width:100%;");
				searchinput.setAttribute("title", searchTitles[i]);
				searchinput.setAttribute("list", searchTitles[i]);
				searchinput.setAttribute("class", "searchFilterClass inputs");
				searchContainer.append(searchinput, dataList);

				var dataListAttr = ["id", searchTitles[i]];
				for (var j = 0; j <= dataListAttr.length - 1; j = j + 2) {
					for (var k = 0; k <= j; k = k + 2) {
						dataList.setAttribute(dataListAttr[j], dataListAttr[k + 1]);

					}
				}

				searchRow.append(searchContainer);
			}



		}

		element1_1.append(searchRow);

		/*********************/
		element1_1.append(element1_2);

		var element2 = document.createElement("th");
		element2.innerText = "S.No.";
		var element3 = document.createElement("th");
		element3.innerText = "Model";
		var element3_2 = document.createElement("th");
		element3_2.innerText = "Minda Part No";
		var element4 = document.createElement("th");
		element4.innerText = "Customer Part No ";
		var element5 = document.createElement("th");
		element5.innerText = "Description";
		var element6 = document.createElement("th");
		element6.innerText = "Pack Qty";
		var element6_3 = document.createElement("th");
		element6_3.innerText = "Actual Qty";
		var element7 = document.createElement("th");
		element7.innerText = "Date Time";



		element1_2.append(element2, element3, element3_2, element4, element5, element6, element6_3, element7);
		element2.setAttribute("class", "tableheading");
		// element2.setAttribute("scope","col");
		element3.setAttribute("class", "tableheading");
		// element3.setAttribute("scope","col");
		element3_2.setAttribute("class", "tableheading");
		// element3.setAttribute("scope","col");
		element4.setAttribute("class", "tableheading");
		// element4.setAttribute("scope","col");
		element5.setAttribute("class", "tableheading");
		// element5.setAttribute("scope","col");
		element6.setAttribute("class", "tableheading");
		// element6.setAttribute("scope","col");
		element6_3.setAttribute("class", "tableheading");
		// element6_3.setAttribute("scope","col");
		element7.setAttribute("class", "tableheading");
		element7.setAttribute("colspan", "2");
		// element7.setAttribute("scope","col");
		// element9.setAttribute("scope","col");

		var element18_2 = document.createElement("div");
		element18_2.setAttribute("class", "buttonsContainer");

		var element41 = document.createElement("div");
		element41.setAttribute("class", "buttonsContainer");

		var element44 = document.createElement("button");
		element44.setAttribute("class", "data");
		element44.setAttribute("title", "Excel Download");

		element41.append(element44);
		element18_2.append(element41);

		$("#bottom").append(element18_2);
		$("#pageSelect").empty();
		getAllMindaPartInConveyorList();
		getAllCustomerPartInList();
		getAllModelInList();
		loadConveyorPackDataAndPager(0);


	});

});


function getAllMindaPartInConveyorList() {
	$.ajax({
		url: "/WebApplication/Controllers/getAllFgPartInList",
		type: 'GET',
		contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		async: false,
		dataType: 'json',
		success: function(res) {
			for (var i = 0; i < res.length; i++) {
				var str = res[i];
				var id_Mindapart = str.split(',');

				for (var j = 0; j < id_Mindapart.length - 1; j++) {
					var row = '<option value="' + id_Mindapart[j + 1] + '" style="font-size:5px;">';
					$('#searchMindaPartNumber').append(row);
				}
			}
		}
	});
}



function getAllCustomerPartInList() {
	$.ajax({
		url: "/WebApplication/Controllers/getAllCustomerPartInList",
		type: 'GET',
		contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		async: false,
		dataType: 'json',
		success: function(res) {
			for (var i = 0; i < res.length; i++) {
				var str = res[i];
				var id_Mindapart = str.split(',');

				for (var j = 0; j < id_Mindapart.length - 1; j++) {
					var row = '<option value="' + id_Mindapart[j + 1] + '" style="font-size:5px;">';
					$('#searchCustomerPartNumber').append(row);
				}
			}
		}
	});
}



function getAllModelInList() {
	$.ajax({
		url: "/WebApplication/Controllers/getAllModelInList",
		type: 'GET',
		contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		async: false,
		dataType: 'json',
		success: function(res) {
			for (var i = 0; i < res.length; i++) {
				var str = res[i];
				var id_Mindapart = str.split(',');

				for (var j = 0; j < id_Mindapart.length - 1; j++) {
					var row = '<option value="' + id_Mindapart[j + 1] + '" style="font-size:5px;">';
					$('#searchModel').append(row);
				}
			}
		}
	});
}


function loadConveyorPackDataAndPager(page) {

	searchLoad = true;

	$.ajax({
		type: 'GET',
		url: "/WebApplication/Controllers/getConveyorPackData/" + page,
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			if (response.length > 0) {
				loadConveyorPackDataPager(page);
				insertConveyorPackDataInTable(response);
				searchLoad = false;
			} else {
				setTimeout(function() {
					$("#loadingBackdropButton").click();
				}, 500);
				setTimeout(function() {
					alert("No data found aganist Part No = " + partNumber);
				}, 1000);
			}
		},
		error: function(response) {

		}
	});
}

function loadConveyorPackDataPager(page) {

	$.ajax({
		type: 'GET',
		url: "/WebApplication/Controllers/getConveyorPackDataPager",
		contentType: "application/json",
		async: false,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			makePager(response, page);
		},
		error: function(response) {

		}
	});
}


function makePager(response, page) {

	if (pageChange) {
		$("#pageSelect").empty();
		for (var i = 0; i < Math.ceil(parseInt(response) / pageSize); i++) {
			$("#pageSelect").append("<option value='" + i + "'>" + (i + 1) + "</option>");
		}
		pageChange = false;
	}

	if (searchLoad) {
		$("#pageSelect").empty();
		for (var i = 0; i < Math.ceil(parseInt(response) / pageSize); i++) {
			$("#pageSelect").append("<option value='" + i + "'>" + (i + 1) + "</option>");
		}
	}
	$("#pageSelect").val(page);
}

function insertConveyorPackDataInTable($item) {

	$("#tableBody").remove();

	var tablebody = document.createElement("tbody");
	$("#table1").append(tablebody);
	tablebody.setAttribute("id", "tableBody");

	var sequenceNumber = pageSize * parseInt($('#pageSelect :selected').val());
	/*var sequenceNumber = 0;*/

	$.each($item, function(index, value) {
		var row = '<tr class="tableDataRows"><td data-column="columnId" style="width:70px">' + (sequenceNumber + 1) + '</td>' + '<td data-column="model" style="width:200px;">' + value.model + '</td>' + '<td data-column="mindaPart" style="width:200px;">' + value.mindaPart + '</td>' + '<td data-column="customerPart" style="width:200px;">' + value.customerPart + '</td>' + '<td data-column="description" style="width:200px;">' + value.description + '</td>' + '<td data-column="packQuantity">' + value.packQuantity + '</td>' + '<td data-column="actualQuantity">' + value.actualQuantity + '</td>' + '<td data-column="dateTime" colspan="2" style="max-width:150px;">' + value.dateTime + '</td></tr>';

		$('#table1').append(row);
		sequenceNumber++;
	});

}



function loadLikeConveyorPackData(page) {

	searchLoad = true;

	var model = $('input[title="searchModel"]').val() ?? "";
	var mindaPart = $('input[title="searchMindaPartNumber"]').val() ?? "";
	var customerPart = $('input[title="searchCustomerPartNumber"]').val() ?? "";
	var from = $('input[name="from"]').val() ?? "";
	var to = $('input[name="to"]').val() ?? "";

	if (model == "" && mindaPart == "" && customerPart == "" && !from && !to) {
		$("#conveyorPackingReport").click();
		return;
	}
	if (!from && !to) {
		alert("Please select date to see report.")
	} else {
		var formData = {
			model: model,
			mindaPart: mindaPart,
			customerPart: customerPart,
			dateTime: from + "," + to
		}
		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/getLikeConveyorPackData/' + page,
			data: JSON.stringify(formData),
			contentType: "application/json",
			headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
			success: function(response) {

				makePager(response.conveyorLikePager, page);
				insertConveyorPackDataInTable(response.conveyorPackData);

			},
			error: function(response) {
				$("#warningInformationModalBody").text(response.responseText);
				$("#warningBackdropButton").click();
			}
		});
	}


}


////for excel download

function loadLikeConveyorPackDataForExcel() {

	searchLoad = true;

	var model = $('input[title="searchModel"]').val() ?? "";
	var mindaPart = $('input[title="searchMindaPartNumber"]').val() ?? "";
	var customerPart = $('input[title="searchCustomerPartNumber"]').val() ?? "";
	var from = $('input[name="from"]').val() ?? "";
	var to = $('input[name="to"]').val() ?? "";

	if (model == "" && mindaPart == "" && customerPart == "" && !from && !to) {
		$("#conveyorPackingReport").click();
		return;
	}
	if (!from && !to) {
		alert("Please select date to see report.")
	} else {
		var formData = {
			model: model,
			mindaPart: mindaPart,
			customerPart: customerPart,
			dateTime: from + "," + to
		}
		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/getLikeConveyorPackDataForExcel',
			data: JSON.stringify(formData),
			contentType: "application/json",
			headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
			success: function(response) {

				lastResponseConveyerPacking = response.conveyorPackData;
				;

			},
			error: function(response) {
				$("#warningInformationModalBody").text(response.responseText);
				$("#warningBackdropButton").click();
			}
		});
	}


}

function downloadConveyerPackingReportDataAsExcel(data) {
	const filename = 'Conveyer Packing Report.xlsx';
	const headers = ['Model', 'Minda Part Number', 'Customer Part No.', 'Description', 'PackQty', 'ActualQty', 'Date & Time'];

	let csvContent = headers.join('\t').toUpperCase() + '\n';

	data.forEach(entry => {
		const row = [
			entry.model,
			entry.mindaPart,
			entry.customerPart,
			entry.description,
			entry.packQuantity,
			entry.actualQuantity,
			entry.dateTime
		].join('\t');
		csvContent += row + '\n';
	});

	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

	if (navigator.msSaveBlob) {
		navigator.msSaveBlob(blob, filename);
	} else {
		const link = document.createElement('a');
		if (link.download !== undefined) {
			const url = URL.createObjectURL(blob);
			link.setAttribute('href', url);
			link.setAttribute('download', filename);
			link.style.visibility = 'hidden';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	}
}




//------------------------





$(document).ready(function() {

	$(document).on('click', '#conveyorRunningReport', function() {

		searchLoad = false; clearInterval(interval);

		$("#planDateDiv").css("display", "none");
		$("#pagerDiv").css("display", "block");
		$("#printPreview").css("display", "none");
		$("#backToHarness").css("display", "none");
		$("#toggleActionFilterBtn").closest(".switch").css("display", "none");
				
		clearInterval(interval);
		$("#offcanvasCloseButton").click();

		var child1 = document.getElementById("div3");
		var child2 = document.getElementById("div4");

		child1.remove();
		if (child2) { child2.remove(); }

		document.getElementById("masterHeading").innerText = "";
		$("#masterHeading").append("CONVEYOR RUNNING REPORT");

		var div3 = document.createElement("div");
		var div4 = document.createElement("div");

		$("#div2").append(div3, div4);

		div3.setAttribute("id", "div3");
		div3.setAttribute("class", "masterBody");

		div4.setAttribute("id", "div4");
		div4.setAttribute("class", "masterBody");
		div4.setAttribute("Style", "overflow-y:scroll; display:none;");

		var bottom = document.createElement("div");

		bottom.setAttribute("id", "bottom");
		/*	bottom.setAttribute("style","height: 50%;")*/

		$("#div4").append(bottom);

		var element1 = document.createElement("table");
		$("#div3").append(element1);
		element1.setAttribute("id", "table1");
		element1.setAttribute("cellspacing", "0px");
		/*element1.setAttribute("cellpaddding","10px");*/
		element1.setAttribute("class", "table-hover");

		var w = window.innerWidth;

		if (w < 500) {
			element1.setAttribute("style", "width:300%;");
		} else if (w < 1100) {
			element1.setAttribute("style", "width:250%;");
		}
		else if (w < 1500) {
			element1.setAttribute("style", "width:100%;");
		} else if (w < 1000) {
			element1.setAttribute("style", "width:150%;");
		} else {
			element1.setAttribute("style", "width:100%;");
		}


		var element1_1 = document.createElement("thead");
		element1.append(element1_1);

		var element1_2 = document.createElement("tr");


		var element1_3 = document.createElement("tbody");
		element1.append(element1_3)
		element1_3.setAttribute("id", "tableBody");

		// search
		/*********************/


		var searchRow = document.createElement("tr");
		searchRow.setAttribute("id", "searchRow");
		var tr = document.createElement("th");
		tr.setAttribute("class", "tableheading");
		var img = document.createElement("img");
		img.setAttribute("src", "/WebApplication/images/searchFilter.png");
		img.setAttribute("width", "22");
		img.setAttribute("height", "22");
		tr.append(img);
		searchRow.append(tr);

		var searchTitles = ["searchLineNumber", "searchShiftStartTime", "searchShiftEndTime"];
		var placeholder = ["Line No...", "YYYY-MM-DD", "YYYY-MM-DD"];

		for (var i = 0; i < searchTitles.length; i++) {

			var dataList = document.createElement("datalist");

			var searchContainer = document.createElement("th");
			searchContainer.setAttribute("class", "tableheading");
			var searchinput = document.createElement("input");
			searchinput.setAttribute("style", "width:100%;");
			searchinput.setAttribute("title", searchTitles[i]);
			if (i > 0) {
				searchinput.setAttribute("type", "date");
			}
			searchinput.setAttribute("placeholder", placeholder[i]);
			searchinput.setAttribute("class", "searchFilterClass inputs");
			searchContainer.append(searchinput, dataList);

			searchRow.append(searchContainer);
		}

		element1_1.append(searchRow);

		/*********************/
		element1_1.append(element1_2);

		var element2 = document.createElement("th");
		element2.innerText = "S.No.";
		var element2_2 = document.createElement("th");
		element2_2.innerText = "Line No.";
		var element3 = document.createElement("th");
		element3.innerText = "Shift Start Time";
		var element3_2 = document.createElement("th");
		element3_2.innerText = "Shift End Time";
		var element4 = document.createElement("th");
		element4.innerText = "Conveyor Count";
		var element5 = document.createElement("th");
		element5.innerText = "Circuit Testing OK";
		var element6 = document.createElement("th");
		element6.innerText = "Packing";
		var element6_3 = document.createElement("th");
		element6_3.innerText = "Circuit Testing NG";
		var element7 = document.createElement("th");
		element7.innerText = "Total Run Time";


		element1_2.append(element2, element2_2, element3, element3_2, element4, element5, element6, element6_3, element7);
		element2.setAttribute("class", "tableheading");
		// element2.setAttribute("scope","col");
		element2_2.setAttribute("class", "tableheading");
		// element2.setAttribute("scope","col");
		element3.setAttribute("class", "tableheading");
		// element3.setAttribute("scope","col");
		element3_2.setAttribute("class", "tableheading");
		// element3.setAttribute("scope","col");
		element4.setAttribute("class", "tableheading");
		// element4.setAttribute("scope","col");
		element5.setAttribute("class", "tableheading");
		// element5.setAttribute("scope","col");
		element6.setAttribute("class", "tableheading");
		// element6.setAttribute("scope","col");
		element6_3.setAttribute("class", "tableheading");
		// element6_3.setAttribute("scope","col");
		element7.setAttribute("class", "tableheading");
		// element7.setAttribute("scope","col");
		// element9.setAttribute("scope","col");

		$("#pageSelect").empty();
		loadConveyorRunningkDataAndPager(0);
	});
});



function loadConveyorRunningkDataAndPager(page) {

	searchLoad = true;

	$.ajax({
		type: 'GET',
		url: "/WebApplication/Controllers/getConveyorRunningData/" + page,
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			if (response.length > 0) {
				loadConveyorRunningDataPager(page);
				insertConveyorRunningDataInTable(response);
				searchLoad = false;
			} else {
				setTimeout(function() {
					$("#loadingBackdropButton").click();
				}, 500);
				setTimeout(function() {
					alert("No data found aganist Part No = " + partNumber);
				}, 1000);
			}
		},
		error: function(response) {

		}
	});
}

function loadConveyorRunningDataPager(page) {

	$.ajax({
		type: 'GET',
		url: "/WebApplication/Controllers/getConveyorRunningDataPager",
		contentType: "application/json",
		async: false,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			makePager(response, page);
		},
		error: function(response) {

		}
	});
}

function insertConveyorRunningDataInTable($item) {

	$("#tableBody").remove();

	var tablebody = document.createElement("tbody");
	$("#table1").append(tablebody);
	tablebody.setAttribute("id", "tableBody");

	var sequenceNumber = pageSize * parseInt($('#pageSelect :selected').val());
	/*var sequenceNumber = 0;*/



	$.each($item, function(index, value) {
		var totalTimeDifference = getTotalRunTime(value.shiftStartTime, value.shiftEndTime);
		var row = '<tr class="tableDataRows"><td data-column="columnId" style="width:70px">' + (sequenceNumber + 1) + '</td>' + '<td data-column="lineNumber">' + value.lineNumber + '</td>' + '<td data-column="shiftStart">' + (value.shiftStartTime == null ? '' : value.shiftStartTime) + '</td>' + '<td data-column="shiftEnd">' + (value.shiftEndTime == null ? '' : value.shiftEndTime) + '</td>' + '<td data-column="conveyorCount">' + value.conveyorCount + '</td>' + '<td data-column="circuitTestingOk">' + value.circuitTestingOk + '</td>' + '<td data-column="packing">' + value.packing + '</td>' + '<td data-column="circuitTestingNg">' + value.circuitTestingNg + '</td>' + '<td data-column="stopageTime" style="text-align:left; padding-left:10px;">' + totalTimeDifference + '</td></tr>';

		$('#table1').append(row);
		sequenceNumber++;
	});

}


function getTotalRunTime(startTime, endTime, breakdowntime) {

	if (startTime && endTime == null) {

		const date1 = new Date(startTime);
		getCurrentDateAndTime();
		const date2 = new Date(curretDate);

		// Calculate the time difference in milliseconds
		const timeDifference = date2 - date1;

		const hours = Math.floor(timeDifference / (1000 * 60 * 60));
		const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

		var totalRunMinutes = (hours * 60) + minutes;

		var runMinutes = totalRunMinutes - breakdowntime;


		return Math.floor(runMinutes / 60) + "H / " + Math.floor(runMinutes % 60) + "M";
	} else {
		// Convert strings to Date objects
		const date1 = new Date(startTime);
		const date2 = new Date(endTime);

		// Calculate the time difference in milliseconds
		const timeDifference = date2 - date1;

		const hours = Math.floor(timeDifference / (1000 * 60 * 60));
		const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);


		var totalRunMinutes = (hours * 60) + minutes;
		var runMinutes = totalRunMinutes - breakdowntime;


		return Math.floor(runMinutes / 60) + "H / " + Math.floor(runMinutes % 60) + "M";
	}
}

function getTotalTime(startTime, endTime) {

	if (startTime == null || endTime == null) {
		return "Running";
	} else {
		// Convert strings to Date objects
		const date1 = new Date(startTime);
		const date2 = new Date(endTime);

		// Calculate the time difference in milliseconds
		const timeDifference = date2 - date1;

		const hours = Math.floor(timeDifference / (1000 * 60 * 60));
		const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
		// console.log

		return hours + "H / " + minutes + "M";
	}
}


function loadLikeConveyorRunningData(page) {

	searchLoad = true;

	var lineNumber = $('input[title="searchLineNumber"]').val() ?? "";
	var shiftStartTime = $('input[title="searchShiftStartTime"]').val() ?? "";
	var shiftEndTime = $('input[title="searchShiftEndTime"]').val() ?? "";

	if (lineNumber == "" && shiftStartTime == "" && shiftEndTime == "") {
		$("#conveyorRunningReport").click();
	}

	var formData = {
		shiftStartTime: shiftStartTime,
		shiftEndTime: shiftEndTime,
		lineNumber: lineNumber,
	}
	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getLikeConveyorRunningData/' + page,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {

			makePager(response.conveyorLikePager, page);
			insertConveyorRunningDataInTable(response.conveyorRunningData);

		},
		error: function(response) {
			$("#warningInformationModalBody").text(response.responseText);
			$("#warningBackdropButton").click();
		}
	});
}






$(document).ready(function() {

	$(document).on('click', '#receiveQualityReport', function() {

		console.log("Opening Double-click screen");
		// console.log("Setting mispNumberContainer with:", Inspectionlist[8], "found element:", $("#mispNumberContainer").length);

		
		searchLoad = false; clearInterval(interval); 

		$(".fromTo").css("display", "none");
		$("#printPreview").css("display", "block");
		$("#toggleImageBtn").css("display","block");
		$("#toggleImageBtndiv").css("display","block");
		$("#pageSelect").css("display", "none");
		
		$("#next").css("display", "none");
		$("#previous").css("display", "none");
		$("#backToHarness").css("display", "none");
		$("#excelDownload").css("display", "none");
		$("#toggleActionFilterBtn").closest(".switch").css("display", "none");
				
		$("#offcanvasCloseButton").click();

		var child1 = document.getElementById("div3");
		var child2 = document.getElementById("div4");

		child1.remove();
		if (child2) { child2.remove(); }

		document.getElementById("masterHeading").innerText = "";
		$("#masterHeading").append("RECEIVE QUALITY PRINTING REPORT");

		var div3 = document.createElement("div");
		var div4 = document.createElement("div");

		$("#div2").append(div3, div4);

		div3.setAttribute("id", "div3");
		div3.setAttribute("class", "masterBody");

		div4.setAttribute("id", "div4");
		div4.setAttribute("class", "masterBody");
		div4.setAttribute("Style", "overflow-y:scroll;display:none;");

		var bottom = document.createElement("div");

		bottom.setAttribute("id", "bottom");

		$("#div4").append(bottom);

		var table = document.createElement("table");
		table.setAttribute("id", "table1");
		table.setAttribute("cellspacing", "0px");
		table.setAttribute("border", "1px");


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

		container1.setAttribute("id", "imageAndTableContainer");
		container2.setAttribute("id", "tablesContainer");
		container3.setAttribute("id", "imageContainer");
		container4.setAttribute("id", "tableHeadContainer");
		container5.setAttribute("id", "tableBodiesContainer");
		container6.setAttribute("id", "tableParameterContainer");
		container7.setAttribute("id", "tableSamplesContainer");
		container8.setAttribute("id", "resultContainer");
		container9.setAttribute("id", "approveAndResult");
		container10.setAttribute("id", "buttonContainer");

		$("#div3").append(container1);
		container1.append(container2, container3);
		container2.append(container10, container4, container5);
		container5.append(container6, container7);

		var table2 = document.createElement("table");
		var table3 = document.createElement("table");
		var table4 = document.createElement("table");

		var thead2 = document.createElement("thead");
		var thead3 = document.createElement("thead");
		var thead4 = document.createElement("thead");

		var tbody2 = document.createElement("tbody");
		var tbody3 = document.createElement("tbody");
		var tbody4 = document.createElement("tbody");

		table2.setAttribute("id", "table2");
		table2.setAttribute("style", "width:100%");
		thead2.setAttribute("id", "thead2");
		tbody2.setAttribute("id", "tbody2");

		table3.setAttribute("id", "table3");
		table3.setAttribute("style", "width:100%");
		thead3.setAttribute("id", "thead3");
		tbody3.setAttribute("id", "tbody3");

		table4.setAttribute("id", "table4");
		thead4.setAttribute("id", "thead4");
		tbody4.setAttribute("id", "tbody4");


		var w = window.innerWidth;

		if (w < 500) {
			table.setAttribute("style", "width:300%;");
		} else if (w < 1100) {
			table.setAttribute("style", "width:250%;");
		}
		else if (w < 1500) {
			table.setAttribute("style", "width:100%;");
			table2.setAttribute("style", "width:100%;");
			table3.setAttribute("style", "width:100%;");
			table4.setAttribute("style", "width:150%;");
		} else if (w < 1000) {
			table.setAttribute("style", "width:150%;");
		} else {
			table.setAttribute("style", "width:100%;");
		}


		var tr = document.createElement("tr");
		var tr1 = document.createElement("tr");
		var tr2 = document.createElement("tr");
		var tr3 = document.createElement("tr");
		var tr4 = document.createElement("tr");
		var tr5 = document.createElement("tr");
		var tr6 = document.createElement("tr");
		var tr7 = document.createElement("tr");


		container2.append(container9, container8);
		container8.append("RESULT /T.Q/P.Q/F.Q");

		container4.append(table2);
		table2.append(thead2, tbody2);
		thead2.append(tr, tr1);

		container6.append(table3);
		table3.append(thead3, tbody3);
		thead3.append(tr2);

		container7.append(table4);
		table4.append(thead4, tbody4);
		thead4.append(tr3);

		var th = document.createElement("th");
		th.setAttribute("style", "width:70px; font-size:15px;");
		var th1 = document.createElement("th");
		th1.setAttribute("style", "width:100px;");
		var th2 = document.createElement("th");
		th2.setAttribute("style", "width:75px; font-size:15px;");
		var th3 = document.createElement("th");
		th3.setAttribute("style", "width:70px; font-size:15px;");
		var th4 = document.createElement("th");
		th4.setAttribute("style", "width:70px; font-size:15px;");
		var th5 = document.createElement("th");
		th5.setAttribute("style", "width:150px; font-size:15px;");
		var th6 = document.createElement("th");
		th6.setAttribute("style", "width:75px; font-size:15px;");
		var th7 = document.createElement("th");
		th7.setAttribute("style", "width:70px; font-size:15px;");
		var th8 = document.createElement("th");
		th8.setAttribute("style", "width:55px; font-size:15px;");
		var th9 = document.createElement("th");
		th9.setAttribute("style", "width:50px; font-size:15px;");
		var th48 = document.createElement("th");
		th48.setAttribute("style", "width:90px; font-size:15px;");
		var th49 = document.createElement("th");
		th49.setAttribute("style", "width:25px; font-size:15px; ");
		var th10 = document.createElement("th");
		th10.setAttribute("style", "width:40px;");
		th10.setAttribute("class", "tableHeading2");
		var th11 = document.createElement("th");
		th11.setAttribute("style", "width:100px;");
		th11.setAttribute("class", "tableHeading2");
		var th12 = document.createElement("th");
		th12.setAttribute("style", "width:90px;");
		th12.setAttribute("class", "tableHeading2");
		var th13 = document.createElement("th");
		th13.setAttribute("style", "width:50px;");
		th13.setAttribute("class", "tableHeading2");
		var th14 = document.createElement("th");
		th14.setAttribute("style", "width:50px;");
		th14.setAttribute("class", "tableHeading2");
		var th15 = document.createElement("th");
		th15.setAttribute("style", "width:100px;");
		th15.setAttribute("class", "tableHeading2");
		var th16 = document.createElement("th");
		th16.setAttribute("style", "width:100px;");
		th16.setAttribute("class", "tableHeading2");
		var th17 = document.createElement("th");
		th17.setAttribute("style", "width:40px;");
		th17.setAttribute("class", "tableHeading2");
		var th17_1 = document.createElement("th");
		th17_1.setAttribute("style", "width:40px;");
		th17_1.setAttribute("class", "tableHeading2");



		var input = document.createElement("input");
		var input1 = document.createElement("input");
		var input2 = document.createElement("input");
		var input3 = document.createElement("input");
		var input4 = document.createElement("input");

		var inputAttr = ["name", "partNumber", "id", "input1", "class", "inputs", "autocomplete", "off", "plceholder", "Part No...", "Style", "height:40px; font-size:14px;"];
		for (var i = 0; i < inputAttr.length; i = i + 2) {
			for (var j = 0; j <= i; j = j + 2) {
				input.setAttribute(inputAttr[i], inputAttr[j + 1]);
			}
		}

		

		var input2Attr = ["name", "batchcode", "id", "input3", "class", "inputs", "autocomplete", "off", "Style", "height:40px; font-size:14px;"];
		for (var i = 0; i < input2Attr.length; i = i + 2) {
			for (var j = 0; j <= i; j = j + 2) {
				input2.setAttribute(input2Attr[i], input2Attr[j + 1]);
			}
		}

		tr.append(th, th1, th2, th3);
		tr1.append(th4, th5, th6, th7, th8, th9,th48,th49);
		tr2.append(th10, th11, th12, th13, th14, th15, th16, th17, th17_1);
		//tr3.append(th18, th19, th20, th21, th22, th23, th24, th25, th26, th27, th28);

		th.innerText = "PART No :";
		th1.append(input);
		th1.setAttribute("colspan", "2");

		th2.innerText = "Part Name :";
		th3.setAttribute("id", "partNameContainer");
		th3.setAttribute("colspan", "4");

		th4.innerText = "MRN No :";
		th5.append(input2);

		th6.innerText = "RQC-P No :";
		th7.setAttribute("id", "mispNumberContainer");

		th8.innerText = "Rev No :";
		th9.setAttribute("id", "revNumberContainer");
		th9.setAttribute("colspan", "1");
		th48.innerText = "MRN Date :";
				const dateInput = document.createElement("input");
				dateInput.type = "date";
				dateInput.id = "mrnDate";  // id for your input
				dateInput.name = "mrnDate"; // optional name attribute

				th49.appendChild(dateInput);
						th49.setAttribute("colspan", "1")
						document.getElementById("tableHeadContainer").style.marginBottom = "60px";
	

		th10.innerText = "S.No.";
		th11.innerText = "I. ITEM";
		th12.innerText = "CRITERIA";
		th13.innerText = "MIN";
		th14.innerText = "MAX";
		th15.innerText = "METHOD";
		th16.innerText = "INSP. TOOL";
		th17.innerText = "S.Size";
		th17_1.innerText = "M.D.V";
		

		(async () => { 
			// object.partNumber & object.qty  fetched when dblclk is made and object is set globally
		    await fetchAndResolveSamplePlans(object.partNumber, object.qty);

		    const largestSamplingPlan = Math.max(...Object.values(resolvedSampleMap).map(Number));
			
			// 🔹 Add "S.No" column first
			const thSno = document.createElement("th");
			thSno.style.width = "30px";
			thSno.className = "tableHeading2";
			thSno.innerText = "S.No";
			tr3.appendChild(thSno);

			// 🔹 Then "Result" column
		    const thResult = document.createElement("th");
		    thResult.style.width = "40px";
		    thResult.className = "tableHeading2";
		    thResult.innerText = " Result";
		    tr3.appendChild(thResult);

		    for (let i = 1; i <= largestSamplingPlan; i++) {
		        const th = document.createElement("th");
		        th.style.width = "40px";
		        th.className = "tableHeading2";
		        th.innerText = "S" + i;
		        tr3.appendChild(th);
		    }
		})();


		var button = document.createElement("button");
		button.setAttribute("id", "reScan");

		var increase = document.createElement("button");
		increase.setAttribute("id", "increase");

		var decrease = document.createElement("button");
		decrease.setAttribute("id", "decrease");
		
		
		
		// Inject CSS once
		const style = document.createElement("style");
		style.textContent = `
		  .floating-label-container {
		    position: relative;
		    float: left;
			margin:10px;
		    margin-left: 7px;
		    margin-bottom: 10px;
			margin-right: 5px;
		  }
		  .floating-box {
		    border: 2px solid #cccccc;
		    border-radius: 6px;
		    padding: 8px 6px;
		    font-size: 14px;
		    line-height: 20px;
		    box-sizing: border-box;
		    background: #fff;
		    min-height: 35px;
		  }
		  .floating-label {
		    position: absolute;
		    top: -10px;
		    left: 10px;
		    background: white;
		    padding: 0 6px;
		    font-size: 13px;
		    font-weight: bold;
		    color: #444;
		  }
		`;
		document.head.appendChild(style);

		// Supplier
		var supplierContainer = document.createElement("div");
		supplierContainer.className = "floating-label-container";
		supplierContainer.style.width = "280px";

		var supplierLabel = document.createElement("label");
		supplierLabel.className = "floating-label";
		supplierLabel.textContent = "Supplier Name";

		var supplierDiv = document.createElement("div");
		supplierDiv.id = "supplierdiv";
		supplierDiv.className = "floating-box";
		supplierDiv.textContent = "";

		supplierContainer.append(supplierLabel, supplierDiv);

		// Quantity
		var quantityContainer = document.createElement("div");
		quantityContainer.className = "floating-label-container";
		quantityContainer.style.width = "100px";

		var quantityLabel = document.createElement("label");
		quantityLabel.className = "floating-label";
		quantityLabel.textContent = "Quantity";

		var quantityDiv = document.createElement("div");
		quantityDiv.id = "quantity";
		quantityDiv.className = "floating-box";
		quantityDiv.textContent = "";

		quantityContainer.append(quantityLabel, quantityDiv);

		// Model
		var modelContainer = document.createElement("div");
		modelContainer.className = "floating-label-container";
		modelContainer.style.width = "280px";

		var modelLabel = document.createElement("label");
		modelLabel.className = "floating-label";
		modelLabel.textContent = "Model";

		var modelDiv = document.createElement("div");
		modelDiv.id = "modelName";
		modelDiv.className = "floating-box";
		modelDiv.textContent = "";

		modelContainer.append(modelLabel, modelDiv);

		// Append to container10
		container10.append(supplierContainer, quantityContainer, modelContainer, button, decrease, increase);


/*
		// Supplier section
		var supplierContainer = document.createElement("div");
		supplierContainer.setAttribute("style", "display: flex; align-items: center; float: left; margin-left: 10px; margin-bottom: 10px;");

		var supplierLabel = document.createElement("label");
		supplierLabel.setAttribute("for", "supplierdiv");
		supplierLabel.setAttribute("style", "margin-right: 5px; width: 120px; font-weight:bolder;");
		supplierLabel.textContent = "Supplier Name:";

		var supplierDiv = document.createElement("div");
		supplierDiv.setAttribute("id", "supplierdiv");
		supplierDiv.setAttribute("style", "width:200px; height:35px; border:2px solid #cccccc; line-height:25px; padding-left: 5px; margin-top: 5px;");
		supplierDiv.textContent = "";

		supplierContainer.append(supplierLabel, supplierDiv);


		// Quantity section
		var quantityContainer = document.createElement("div");
		quantityContainer.setAttribute("style", "display: flex; align-items: center; float: left; margin-left: 10px; margin-bottom: 10px;");

		var quantityLabel = document.createElement("label");
		quantityLabel.setAttribute("for", "quantity");
		quantityLabel.setAttribute("style", "margin-right: 5px; width: 70px;font-weight:bolder;");
		quantityLabel.textContent = "Quantity:";

		var quantityDiv = document.createElement("div");
		quantityDiv.setAttribute("id", "quantity");
		quantityDiv.setAttribute("style", "width:80px; height:35px; border:2px solid #cccccc; line-height:25px; padding-left: 5px; margin-top: 5px;");
		quantityDiv.textContent = "";

		quantityContainer.append(quantityLabel, quantityDiv);

		
		var modelContainer = document.createElement("div");
			modelContainer.setAttribute("style", "display: flex; align-items: center; float: left; margin-left: 10px; margin-bottom: 10px;");

			var modelLabel = document.createElement("label");
			modelLabel.setAttribute("for", "modelName");
			modelLabel.setAttribute("style", "margin-right:5px; width: 50px;font-weight:bolder;");
			modelLabel.textContent = "Model:";

			var ModelNo = document.createElement("div");
			ModelNo.setAttribute("id", "modelName");
			ModelNo.setAttribute("style", "width:130px; height:35px; border:2px solid #cccccc; line-height:25px; padding-left: 5px;  margin-top: 5px; disabled");
			ModelNo.textContent = "";   

			modelContainer.append(modelLabel, ModelNo); 
		// Append to container10
		container10.append(supplierContainer, quantityContainer, modelContainer, button, decrease, increase);  */

	});
	
	
	const toggleBtn = document.getElementById("toggleImageBtn");

		toggleBtn.addEventListener("change", function() {
			// fetch containers fresh every time
			const imageContainer = document.getElementById("imageContainer");
			const tablesContainer = document.getElementById("tablesContainer");

			if (!imageContainer || !tablesContainer) {
				alert("Please scan both QR inputs first!");
				this.checked = false; // reset the toggle
				return;
			}

			if (this.checked) {
			    // Hide image and expand tables
			    imageContainer.style.display = "none";
			    tablesContainer.style.width = "100%";
				tablesContainer.style.height = "auto";

			    // left & right half
			    tableParameterContainer.style.width = "50%";
			    tableSamplesContainer.style.width = "50%";

			    // ✅ remove scroll & let columns auto adjust
			    tableSamplesContainer.style.overflow = "visible";
			    tableSamplesContainer.style.height = "auto";

			    const rightTable = tableSamplesContainer.querySelector("table");
			    if (rightTable) { 
			        rightTable.style.tableLayout = "auto";  // let browser decide
			        rightTable.style.width = "100%";        // take full width
					
					// Force browser to reflow widths based on content
					const cells = rightTable.querySelectorAll("td, th");
					cells.forEach(td => {
					    td.style.whiteSpace = "nowrap";
					    td.style.maxWidth = "none";
					});
			    }

			    this.nextElementSibling.textContent = "Show Image";
			}
        else { 
			// SHRINK mode
				// Show image and shrink tables
				imageContainer.style.display = "block";
				tablesContainer.style.width = "60%";
				tablesContainer.style.height = "100%";
				
				tableParameterContainer.style.width = "70%";
				   tableSamplesContainer.style.width = "30%";

				   // restore scroll
				   tableSamplesContainer.style.overflowX = "auto";
				   tableSamplesContainer.style.height = "400px"; // or your default

				   const rightTable = tableSamplesContainer.querySelector("table");
				   if (rightTable) {
				       rightTable.style.tableLayout = "auto";   // back to fixed layout
				       rightTable.style.width = "150%";          // or your normal width
					   
					   
					   // Prevent overlap by adding a minimum width
					   const ths = rightTable.querySelectorAll("th");
					   ths.forEach(th => {
					       th.style.minWidth = "70px"; // each sample column gets at least 70px
					   });

					   const tds = rightTable.querySelectorAll("td");
					   tds.forEach(td => {
					       td.style.whiteSpace = "nowrap";
					      // td.style.textOverflow = "ellipsis"; // for compressing text,
					      // td.style.overflow = "hidden";  // make text....
						  td.style.textOverflow = "clip";  // don't show "..."
						  td.style.overflow = "visible";   // show the full content
						  td.style.maxWidth = "none";      // remove leftover limits
					   });
				   }
				this.nextElementSibling.textContent = "Hide Image";
			}
		});
});

$(document).on('click', '#reScan', function() {

	var text = document.getElementById("masterHeading").innerHTML;
	if (text == "RECEIVE QUALITY PRINTING REPORT") {

		$("#receiveQualityReport").click();

	} else if (text == "FINAL INSPECTION REPORT") {

		$("#finalInspectionReport").click();

	}
});



$(document).on('keydown', '#input1', async function(e) {
	if (e.key === "Enter") {
		e.preventDefault();

		var text = document.getElementById("masterHeading").innerHTML;
		if (text == "RECEIVE QUALITY PRINTING REPORT") {

			$("#input1").attr("disabled", "disabled");
			$("#input3").attr("disabled", "disabled");

			sequence = 0;

			var barcode = $("input[name=partNumber]").val();
			var list = barcode.split(" ");

			$("input[name=partNumber]").val(list[0]);
			$("input[name=batchcode]").val(list[1]);

			var partNumber = $("input[name=partNumber]").val();
			var batchcode = $("input[name=batchcode]").val();


			if (partNumber == "" || batchcode == "") {
				alert("Part No and MRN No. both are mandatory to get Receive Quality Report.");
				$("#input1").removeAttr("disabled");
				$("#input3").removeAttr("disabled");
			} else {
				console.log("2");
				
				await loadReceiveQualityReportByPartNumber(partNumber, batchcode);
				loadPartTotalResult(partNumber, batchcode);
			}

		} else if (text == "FINAL INSPECTION REPORT") {

			if (partNumber == "") {
				alert("Please scan Barcode to see final inspection report.");
				$("#input1").removeAttr("disabled");
				$("#input3").removeAttr("disabled");
			} else {

				$("#input1").attr("disabled", "disabled");
				$("#input3").attr("disabled", "disabled");

				var partNumber = $("input[name=partNumber]").val();
				var list = partNumber.split(",");

				$("input[name=partNumber]").val(list[0]);
				$("input[name=batchcode]").val(partNumber);

				loadFinalInspectionReportByPartNumber(list[0], partNumber);
				loadFinalPartTotalResult(list[0], partNumber);

			}
		}

	}
});


$(document).on('keydown', '#input3', async function(e) {
	if (e.key === "Enter") {
		e.preventDefault();

		$("#input3").attr("disabled", "disabled");

		sequence = 0;
		var partNumber = $("input[name=partNumber]").val();
		var batchcode = $("input[name=batchcode]").val();

		if (partNumber == "" || batchcode == "") {
			alert("Part No and MRN No. both are mandatory to get Receive Quality Report.");
			$("#input1").removeAttr("disabled");
			$("#input3").removeAttr("disabled");
		} else {
			await loadReceiveQualityReportByPartNumber(partNumber, batchcode);
			loadPartTotalResult(partNumber, batchcode);
		}
	}
});


/*function loadReceiveQualityReportByPartNumber(partNumber, batchcode) {

	$.ajax({
		type: 'GET',
		url: "/WebApplication/Controllers/getReceiveQualityReportByPartNumber/" + partNumber + "/" + batchcode,
		contentType: "application/json",
		async: false,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {

			$("#tbody3").remove();
			var tablebody = document.createElement("tbody");
			$("#table3").append(tablebody);
			tablebody.setAttribute("id", "tbody3");

			$("#tbody4").remove();
			var tablebody = document.createElement("tbody");
			$("#table4").append(tablebody);
			tablebody.setAttribute("id", "tbody4");

			if (response.length > 0) {

				for (var i = 0; i < response.length; i++) {
					var str = response[i];
					var Inspectionlist = str.split(';');

					$("#mispNumberContainer").text(Inspectionlist[8]);
					$("#partNameContainer").text(Inspectionlist[9]);
					$("#revNumberContainer").text(Inspectionlist[10]);
					$("#approveAndResult").text("Approved By : " + Inspectionlist[12] + " , Inspected By : " + Inspectionlist[12]);
					var img = document.createElement("img");
					img.setAttribute("src", "/WebApplication/uploadImages/" + Inspectionlist[11] + "_" + Inspectionlist[10] + ".png");
					img.setAttribute("style", "width:" + imageWidth + "%");
					$("#imageContainer").css("background-image", "url('/WebApplication/uploadImages/" + Inspectionlist[11] + ".png')");
					$("#imageContainer").children("img").remove();
					$("#imageContainer").append(img);

					var sampleList = loadReceiveQualityReadingByPartNumberAndSamplingPlan(partNumber, Inspectionlist[6], Inspectionlist[7]);
					insertReceiveQualityReportDataInTable(Inspectionlist, i);
					insertReceiveQualitySampleReportDataInTable(sampleList);

				}
			} else {
				alert("Part No. parameter data not found in Quality Master.")
			}
		},
		error: function(response) {

		}
	});
}
*/
//  api different fom the quality checkmodule this same function API, it does based on part number
async function fetchAndResolveSamplePlans(partNumber, QuantityValue) {
	try {
		const plans = await $.ajax({
			url: "/WebApplication/Controllers/getSamplingPlansByPartNumber", // will fetch all the LatestApprovedQualityMastersByPartNumber
			type: 'GET',
			data: { partNumber: partNumber },
			headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },

		});

		console.log("Fetched Plans:", plans);

		if (!QuantityValue || isNaN(QuantityValue)) {
			alert("Invalid quantity value.");
			return;
		}
		const quantity = QuantityValue; // using the quantity value stored globally

		// Call backend to resolve sample size based on quantity and storing in global variable
		sampleCountSizeForSP = await fetchSPSampleSizeFromQuantity(quantity); // Await here//Fetch once, then reuse for all where SP
		resolvedSampleMap = {}; // re-initialize global variable 

		console.log(quantity);
		plans.forEach((row, rowIndex) => { // rowIndex wise one by one saving this.
			const sp = row.samplingPlan?.trim(); // fetching sampling_plan value

			if (!sp) {
				resolvedSampleMap[rowIndex] = 0;
			} else if (!isNaN(sp)) {  // If sp is a valid number
				resolvedSampleMap[rowIndex] = parseInt(sp); // numeric
			} else if (sp.toLowerCase() === 'sp') {

				resolvedSampleMap[rowIndex] = sampleCountSizeForSP;// saving the returned countSize for SP fetched from backend
			} else {
				console.log(" else part runs");
				resolvedSampleMap[rowIndex] = 0;
			}
		});

		console.log(resolvedSampleMap);

	} catch (error) {
		alert("Error fetching sampling plans or sample size.");
		console.error(error);
	}
}

function fetchSPSampleSizeFromQuantity(quantity) {
	// Call backend to resolve sample size based on quantity
	return new Promise((resolve, reject) => {
		$.ajax({  // AJAX is asynchronous(by-default) unless explicitly made async: false, does not wait for the AJAX request to complete
	//but async: false, is deprecated by browsers, as This creates a very poor user experience, user cannot click, scroll, or interact while the request is in progress
		      url: `/WebApplication/Controllers/getSamplingPlanSampleCount`, // written in ModuleQualityCheckAjaxController
		      type: 'GET',
		      data: {
		          quantity: quantity
		      },
			headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		      success: function(sampleCountSize) {
					
				console.log("sampleCountSize ",sampleCountSize);
		          
				  resolve(sampleCountSize);		 
		          //generateSampleInputs(sampleCountSize, partNumber, quantity, rowIndex);
		      },
		      error: function() {
		          
				alert(`Sampling plan not found for the quantity ${quantity}`);
				resolve(0); // fallback
		      }
		  });	  
	  });
}

/*
async function loadReceiveQualityReportByPartNumber(partNumber, batchcode, supplier, qty) {

	var supplierDiv = document.getElementById("supplierdiv");
	var quantityDiv = document.getElementById("quantity");

	$.ajax({
		type: 'GET',
		url: "/WebApplication/Controllers/getReceiveQualityReportByPartNumber/" + partNumber + "/" + batchcode,
		contentType: "application/json",
		async: false,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {

			$("#tbody3").remove();
			var tablebody = document.createElement("tbody");
			$("#table3").append(tablebody);
			tablebody.setAttribute("id", "tbody3");

			$("#tbody4").remove();
			var tablebody = document.createElement("tbody");
			$("#table4").append(tablebody);
			tablebody.setAttribute("id", "tbody4");

			
			if (response.length > 0) {
				globalQuantity = qty; // set into global quantity used in below function
				await fetchAndResolveSamplePlans(batchcode); // or pass mispNumber if needed


				for (var i = 0; i < response.length; i++) {
					var str = response[i];
					var Inspectionlist = str.split(';');

					// Set values into the supplier and quantity divs
					supplierDiv.textContent = supplier || "N/A";
					quantityDiv.textContent = qty || "N/A";

					$("#mispNumberContainer").text(Inspectionlist[8]);
					$("#partNameContainer").text(Inspectionlist[9]);
					$("#revNumberContainer").text(Inspectionlist[10]);
					$("#approveAndResult").text("Approved By : " + Inspectionlist[12] + " , Inspected By : " + Inspectionlist[12]);
					var img = document.createElement("img");
					// img.setAttribute("src", "/WebApplication/uploadImages/" + Inspectionlist[11] + "_" + Inspectionlist[10] + ".png");
					img.setAttribute("src", "/WebApplication/Controllers/rqcuploadImages/" + Inspectionlist[11] + "_" + Inspectionlist[10] + ".png");
					
					img.setAttribute("style", "width:" + imageWidth + "%");
					$("#imageContainer").css("background-image", "url('/WebApplication/uploadImages/" + Inspectionlist[11] + ".png')");
					$("#imageContainer").children("img").remove();
					$("#imageContainer").append(img);

					const rowIndex = i;
					let samplingPlan = resolvedSampleMap[rowIndex] || 0;
					var sampleList = loadReceiveQualityReadingByPartNumberAndSamplingPlan(partNumber, samplingPlan, Inspectionlist[7]);
					
					// var sampleList = loadReceiveQualityReadingByPartNumberAndSamplingPlan(partNumber, Inspectionlist[6], Inspectionlist[7]);
					insertReceiveQualityReportDataInTable(Inspectionlist, i); // for all left Columns data in table
					 insertReceiveQualitySampleReportDataInTable(sampleList);

				}
			} else {
				alert("Part No. parameter data not found in Quality Master.")
			}
		},
		error: function(response) {

		}
	});
}*/

async function loadReceiveQualityReportByPartNumber(partNumber, batchcode, supplier, qty) {

	var supplierDiv = document.getElementById("supplierdiv");
	var quantityDiv = document.getElementById("quantity");

	// Use a promise wrapper instead of $.ajax({ success: ... })
	const response = await $.ajax({
		type: 'GET',
		url: "/WebApplication/Controllers/getReceiveQualityReportByPartNumber/" + partNumber + "/" + batchcode,
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
	});

	$("#tbody3").remove();
	var tablebody = document.createElement("tbody");
	$("#table3").append(tablebody);
	tablebody.setAttribute("id", "tbody3");

	$("#tbody4").remove();
	var tablebody = document.createElement("tbody");
	$("#table4").append(tablebody);
	tablebody.setAttribute("id", "tbody4");
	let inspectedByEmpId=null;
	let approveBy=null;
	let createdBy=null;
	
	console.log("response",response);
	if (response.length > 0) {
		//globalQuantity = qty; 
		await fetchAndResolveSamplePlans(partNumber, qty); // ✅ await here

		for (let i = 0; i < response.length; i++) {
			const str = response[i];
			const Inspectionlist = str.split(';');

			supplierDiv.textContent = supplier || "N/A";
			quantityDiv.textContent = qty || "N/A";

			console.log("Inspectionlist[8]", Inspectionlist[8]);
			$("#mispNumberContainer").text(Inspectionlist[8]);
			$("#partNameContainer").text(Inspectionlist[9]);
			
			$("#revNumberContainer").text(Inspectionlist[10]);
			$("#mrnDate").val(Inspectionlist[15]);
			$("#mrnDate").prop("disabled", true);
			$("#modelName").text(Inspectionlist[17]);
			// $("#approveAndResult").text("Approved By : " + Inspectionlist[12] + " , Inspected By : " + Inspectionlist[13]);
			
			approveBy = Inspectionlist[12]; 
			inspectedByEmpId=Inspectionlist[13];
			createdBy=Inspectionlist[16];
			const img = document.createElement("img");
			img.setAttribute("src", "/WebApplication/Controllers/rqcuploadImages/" + Inspectionlist[11] + "_" + Inspectionlist[10] + ".png");
			img.setAttribute("style", "width:" + imageWidth + "%");
			$("#imageContainer").children("img").remove();
			$("#imageContainer").append(img);
 
			const rowIndex = i;
			const samplingPlan = resolvedSampleMap[rowIndex] || 0;
			console.log("samplingPlan", samplingPlan, " resolvedSampleMap ", resolvedSampleMap);
			const sampleList = loadReceiveQualityReadingByPartNumberAndSamplingPlan(
				partNumber,
				samplingPlan,
				Inspectionlist[7]
			);
			
			console.log(sampleList);
			insertReceiveQualityReportDataInTable(Inspectionlist, i); // for all left Columns data in table
			insertReceiveQualitySampleReportDataInTable(sampleList, i+1);
		}
		
		
		// ✅ Now fetch inspectedByName only once
		$.ajax({
		    type: "GET",
		    url: "/WebApplication/Controllers/getInspectedByName/" + inspectedByEmpId,
			headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		    success: function(fullName) {
		        console.log("Employee Name:", fullName);
		        $("#approveAndResult").text("Created By : " + createdBy + ", Approved By : " + approveBy + " , Inspected By : " + fullName);
		    },
		    error: function(err) {
		        alert("Inspection Employee name not found!");
		    }
		});
	} else {
		alert("Part No. parameter data not found in Quality Master.");
	}
}

function loadFinalInspectionReportByPartNumber(partNumber, batchcode) {

	$.ajax({
		type: 'GET',
		url: "/WebApplication/Controllers/getFinalInspectionReportByPartNumber/" + partNumber + "/" + batchcode,
		contentType: "application/json",
		async: false,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {

			console.log(response);

			$("#tbody3").remove();
			var tablebody = document.createElement("tbody");
			$("#table3").append(tablebody);
			tablebody.setAttribute("id", "tbody3");

			$("#tbody4").remove();
			var tablebody = document.createElement("tbody");
			$("#table4").append(tablebody);
			tablebody.setAttribute("id", "tbody4");

			if (response.length > 0) {

				for (var i = 0; i < response.length; i++) {
					var str = response[i];
					var Inspectionlist = str.split(';');

					$("#mispNumberContainer").text(Inspectionlist[8]);
					$("#partNameContainer").text(Inspectionlist[9]);
					$("#revNumberContainer").text(Inspectionlist[10]);
					$("#approveAndResult").text("Approved By : " + Inspectionlist[12] + " , Inspected By : " + Inspectionlist[1]);
					var img = document.createElement("img");
					//img.setAttribute("src", "/WebApplication/uploadImages/" + Inspectionlist[11] + "_" + Inspectionlist[10] + ".png");
					img.setAttribute("src", "/WebApplication/Controllers/rqcuploadImages/" + Inspectionlist[11] + "_" + Inspectionlist[10] + ".png");
					
					img.setAttribute("style", "width:" + imageWidth + "%");
					/*$("#imageContainer").css("background-image", "url('/WebApplication/uploadImages/" + Inspectionlist[11] + ".png')");*/
					$("#imageContainer").children("img").remove();
					$("#imageContainer").append(img);

					var sampleList = loadFinalInspectionReadingByPartNumberAndSamplingPlan(partNumber, Inspectionlist[6], Inspectionlist[7]);
					insertFinalInspectionReportDataInTable(Inspectionlist, i);
					insertFinalInspectionSampleReportDataInTable(sampleList);

				}
			} else {
				alert("Barcode parameter data not found in final inspection report.")
			}
		},
		error: function(response) {

		}
	});
}
$(document).on('click', '#increase', function() {

	if (imageWidth < 500) {
		imageWidth = imageWidth + 10;
		$("#imageContainer").children("img").attr("style", "width:" + imageWidth + "%");
	}


});
$(document).on('click', '#decrease', function() {


	if (imageWidth > 100) {
		imageWidth = imageWidth - 10;
		$("#imageContainer").children("img").attr("style", "width:" + imageWidth + "%");
	}

});

function loadPartTotalResult(partNumber, batchcode) {
	var mispNumber = $("#mispNumberContainer").text();
	var revNumber = $("#revNumberContainer").text();

	formData = {
		partNumber: partNumber,
		partDescription: batchcode,
		mispNumber: mispNumber,
		revNumber: revNumber
	}

	console.log("formData", formData);
	$.ajax({
		type: 'post',
		url: "/WebApplication/Controllers/getPartTotalResult",
		data: JSON.stringify(formData),
		contentType: "application/json",
		async: false,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {

			console.log("response", response);
			if (response.rqcResult.length > 0) {
				let inspectedBy = null;
				inspectedByEmpId = response.rqcResult[0].createdBy;
				// ✅ Now fetch inspectedByName only once
				$.ajax({
					type: "GET",
					url: "/WebApplication/Controllers/getInspectedByName/" + inspectedByEmpId,
					headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
					success: function(fullName) {
						console.log(fullName);
						inspectedBy = fullName;


						if (response.rqcResult[0].result == "PASS") {
							$("#resultContainer").attr("style", "background-color:limegreen; color:white;");
							$("#resultContainer").text("Created by " + response.createdAndApprove[0] + ", Approve By " + response.createdAndApprove[1] + ", Inspected By " + inspectedBy + ", Result = " + response.rqcResult[0].result + " / T.Q = " + response.rqcResult[0].qty + " / P.Q = " + response.rqcResult[0].qty + " / F.Q = " + response.rqcResult[0].failQty);
						} else if (response.rqcResult[0].result == "FAIL") {
							$("#resultContainer").attr("style", "background-color:red; color:white;");
							$("#resultContainer").text("Created by " + response.createdAndApprove[0] + ", Approve By " + response.createdAndApprove[1] + ", Inspected By " + inspectedBy + ", Result = " + response.rqcResult[0].result + " / T.Q = " + response.rqcResult[0].qty + " / P.Q = " + response.rqcResult[0].deviationQty + " / F.Q = " + response.rqcResult[0].failQty);
						} else if (response.rqcResult[0].result == "DEVIATION-PASS") {
							$("#resultContainer").attr("style", "background-color:blue; color:white;");
							$("#resultContainer").text("Created by " + response.createdAndApprove[0] + ", Approve By " + response.createdAndApprove[1] + ", Inspected By " + inspectedBy + ", Result = " + response.rqcResult[0].result + " / T.Q = " + response.rqcResult[0].qty + " / P.Q = " + response.rqcResult[0].deviationQty + " / F.Q = " + response.rqcResult[0].failQty);
						}
					},
					error: function(err) {
						alert("Inspection Employee name not found!");
					}
				});
				
				
			} else {
				alert("Part No Full result not found.");
			}
		},
		error: function(response) {
			alert(response.responseText);
		}
	});
}



function loadFinalPartTotalResult(partNumber, batchcode) {
	var mispNumber = $("#mispNumberContainer").text();
	var revNumber = $("#revNumberContainer").text();

	var formData = {
		partNumber: partNumber,
		partDescription: batchcode,
		mispNumber: mispNumber,
		revNumber: revNumber
	}
	console.log(formData)

	$.ajax({
		type: 'post',
		url: "/WebApplication/Controllers/getFinalPartTotalResult",
		data: JSON.stringify(formData),
		contentType: "application/json",
		async: false,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {

			if (response.rqcResult.length > 0) {
				if (response.rqcResult[0].result == "PASS") {
					$("#resultContainer").attr("style", "background-color:limegreen; color:white;");
					$("#resultContainer").text("Created by " + response.createdAndApprove[0] + ", Approve By " + response.createdAndApprove[1] + ", Result = " + response.rqcResult[0].result + " / T.Q = " + response.rqcResult[0].qty + " / P.Q = " + response.rqcResult[0].qty + " / F.Q = " + response.rqcResult[0].failQty);
				} else if (response.rqcResult[0].result == "FAIL") {
					$("#resultContainer").attr("style", "background-color:red; color:white;");
					$("#resultContainer").text("Created by " + response.createdAndApprove[0] + ", Approve By " + response.createdAndApprove[1] + ", Result = " + response.rqcResult[0].result + " / T.Q = " + response.rqcResult[0].qty + " / P.Q = " + response.rqcResult[0].deviationQty + " / F.Q = " + response.rqcResult[0].failQty);
				} else if (response.rqcResult[0].result == "DEVIATION-PASS") {
					$("#resultContainer").attr("style", "background-color:blue; color:white;");
					$("#resultContainer").text("Created by " + response.createdAndApprove[0] + ", Approve By " + response.createdAndApprove[1] + ", Result = " + response.rqcResult[0].result + " / T.Q = " + response.rqcResult[0].qty + " / P.Q = " + response.rqcResult[0].deviationQty + " / F.Q = " + response.rqcResult[0].failQty);
				}
			} else {
				alert("Part No Full result not found.")
			}
		},
		error: function(response) {
			alert(response.responseText);
		}
	});
}



function loadReceiveQualityReadingByPartNumberAndSamplingPlan(partNumber, samplingPlan, qualityId) {

	formData = {
		qualityId: qualityId,
		partNumber: partNumber,
		samplingPlan: samplingPlan
	}

	var samplelist = [];

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getReceiveQualityReadingByPartNumberandSamplingPlan',
		data: JSON.stringify(formData),
		contentType: 'application/json',
		async: false,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			if (response.length > 0) {
				samplelist = response;
			}
		},
		error: function(response) {

		}
	});
	return samplelist;
}

function loadFinalInspectionReadingByPartNumberAndSamplingPlan(partNumber, samplingPlan, qualityId) {

	formData = {
		qualityId: qualityId,
		partNumber: partNumber,
		samplingPlan: samplingPlan
	}

	var samplelist = [];

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getFinalInspectionReadingByPartNumberandSamplingPlan',
		data: JSON.stringify(formData),
		contentType: 'application/json',
		async: false,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			if (response.length > 0) {
				samplelist = response;
			}
		},
		error: function(response) {

		}
	});
	return samplelist;
}

function insertReceiveQualityReportDataInTable(Inspectionlist, sq) {

	console.log("Inspectionlist", Inspectionlist);
	
	// Utility function: extract the first numeric value from a string
	 function extractNumeric(str) {
	     const match = (str || "").toString().match(/[-+]?[0-9]*\.?[0-9]+/);
	     return match ? parseFloat(match[0]) : 0;
	 }

	 // --- 🔹 Compute minCriteria / maxCriteria ---
	 let minCriteria, maxCriteria, baseVal;
	 let criteria = Inspectionlist[1] || "";   // criteria is column[1]
	 let inspectionMethod = (Inspectionlist[4] || "").trim(); // inspectionMethod is column[4]

	/*
	if (inspectionMethod.toLowerCase() === 'measure') {
	     if (criteria.toLowerCase().includes("~")) {
	         minCriteria = parseFloat(Inspectionlist[2] || 0); // min
	         maxCriteria = parseFloat(Inspectionlist[3] || 0); // max
	     } else if (criteria.toLowerCase().includes("max")) {
	         maxCriteria = parseFloat(Inspectionlist[3] || 0);
	         minCriteria = 0;
	     } else if (criteria.toLowerCase().includes("min")) {
	         minCriteria = parseFloat(Inspectionlist[2] || 0);
			 maxCriteria = 0;
		 } else {
			 baseVal = extractNumeric(criteria);
			 maxCriteria = baseVal + parseFloat(Inspectionlist[3] || 0);
			 minCriteria = baseVal - parseFloat(Inspectionlist[2] || 0);
		 }
	 } else if (inspectionMethod.toLowerCase() === 'manual') {
		 baseVal = extractNumeric(criteria);
		 maxCriteria = baseVal + parseFloat(Inspectionlist[3] || 0);
		 minCriteria = baseVal - parseFloat(Inspectionlist[2] || 0);
	 }*/ 
	 if ((inspectionMethod.toLowerCase() === 'measure') || (inspectionMethod.toLowerCase() === 'manual')) {
	 	// Directly use saved numeric values (already computed)
	 	minCriteria = parseFloat(Inspectionlist[2] || 0);
	 	maxCriteria = parseFloat(Inspectionlist[3]|| 0);
		if (criteria.toLowerCase().includes("min")) {
			maxCriteria = "-";
		}
	 } else if ( inspectionMethod.toLowerCase() === 'visual' || inspectionMethod.toLowerCase() === 'calendar' ||
		 						inspectionMethod.toLowerCase() === 'cavity' ) {
		 maxCriteria = null; 
		 minCriteria = null;
	 } 
	
		// Decide what to display in the "samplingPlan" column
	var samplingPlanValue = (Inspectionlist[6] && Inspectionlist[6].toLowerCase() === 'sp') 
				    ? sampleCountSizeForSP : Inspectionlist[6];
				
	var row = '<tr class="tableDataRows"><td data-column="columnId" style="width:40px;">' + (sq + 1) + '</td>' 
	+ '<td data-column="inspectionItem" style="text-align:left; padding-left:5px; width:60px;"><div class="scrollable-cell">' + Inspectionlist[0] + '</div></td>' 
	+ '<td data-column="criteria" style="width:100px; text-align:left; padding-left:5px;"><div class="scrollable-cell">' + Inspectionlist[1] + '</div></td>'
	+ '<td data-column="minCriteria" style="width:40px;">' + (minCriteria !== null ? minCriteria.toFixed(2) : " ") + '</td>' 
	+ '<td data-column="maxCriteria" style="width:40px;">' + (maxCriteria !== null ? maxCriteria.toFixed(2) : " ") + '</td>' 
	+ '<td data-column="inspectionMethod" style="width:100px;"><div class="scrollable-cell">' + Inspectionlist[4] + '</div></td>' 
	+ '<td data-column="inspectionTool" style="width:150px;"><div class="scrollable-cell">' + Inspectionlist[5] + '</div></td>' 
	+ '<td data-column="samplingPlan" style="width:40px;">' + samplingPlanValue + '</td>' 
	+ '<td data-column="multiDimensionValue" style="width:40px;">' + Inspectionlist[14] + '</td></tr>';
	
	$('#table3').append(row);
	
	/*
	+ '<td data-column="min" style="width:40px">' + Inspectionlist[2] + '</td>'
	+ '<td data-column="max" style="width:40px">' + Inspectionlist[3] + '</td>' 
	*/
}

function insertReceiveQualitySampleReportDataInTable(sampleList, sequence) {

	if (sampleList.length == 0) {
		return
	}
	var samplePlanTd = createSampleTd(sampleList);
	var row = '<tr class="tableDataRows">' + '<td style="width:30px; text-align:center;">' + sequence + '</td>' + samplePlanTd + '</tr>';
	// sequence++;
	$('#table4').append(row);
}


function insertFinalInspectionReportDataInTable(Inspectionlist, sq) {

	var row = '<tr class="tableDataRows"><td data-column="columnId" style="width:40px;">' + (sq + 1) + '</td>' + '<td data-column="inspectionItem" style="text-align:left; padding-left:10px; width:200px;"><div class="scrollable-cell">' + Inspectionlist[0] + '</div></td>' + '<td data-column="criteria" style="width:70px;"><div class="scrollable-cell">' + Inspectionlist[1] + '</div></td>' + '<td data-column="min" style="width:40px">' + Inspectionlist[2] + '</td>' + '<td data-column="max" style="width:40px">' + Inspectionlist[3] + '</td>' + '<td data-column="inspectionMethod" style="width:100px;">' + Inspectionlist[4] + '</td>' + '<td data-column="inspectionTool" style="width:150px;">' + Inspectionlist[5] + '</td>' + '<td data-column="samplingPlan" style="width:40px;">' + Inspectionlist[6] + '</td></tr>';
	$('#table3').append(row);
}

function insertFinalInspectionSampleReportDataInTable(sampleList) {

	if (sampleList.length == 0) {
		return
	}
	var samplePlanTd = createSampleTd(sampleList);
	var row = '<tr class="tableDataRows">' + samplePlanTd + '</tr>';
	sequence++;
	$('#table4').append(row);
}

/*
function createSampleTd(sampleList) {

	var samplePlanTd = "";
	for (var i = 0; i < sampleList[0].length; i++) {
		if (sampleList[0][i] == "PASS") {
			samplePlanTd = samplePlanTd + "<td style='background-color:limeGreen; color:white; width:50px;'>" + sampleList[0][i] + "</td>";
		} else if (sampleList[0][i] == "FAIL") {
			samplePlanTd = samplePlanTd + "<td style='background-color:red; color:white; width:50px;'>" + sampleList[0][i] + "</td>";
		} else {
			samplePlanTd = samplePlanTd + "<td style='width:40px;background-color:#F9C64F; '>" + sampleList[0][i] + "</td>";
		}
	}
	return samplePlanTd;
}*/
/*
function createSampleTd(sampleList) {
    var samplePlanTd = "";

    // First column: PASS/FAIL status
    var status = sampleList[0][0];
    if (status === "PASS") {
        samplePlanTd += "<td style='background-color:limeGreen; color:white; width:50px;'>" + status + "</td>";
    } else if (status === "FAIL") {
        samplePlanTd += "<td style='background-color:red; color:white; width:50px;'>" + status + "</td>";
    } else {
        samplePlanTd += "<td style='width:40px;background-color:#F9C64F; '>" + status + "</td>";
    }

    // Second column: JSON with samples → parse
    var readingsJson = {};
    try {
        readingsJson = JSON.parse(sampleList[0][1]);
    } catch (e) {
        console.error("Invalid JSON in sampleList[0][1]", e);
        return samplePlanTd;
    }

    // Loop through outer sample numbers
    Object.keys(readingsJson).forEach(sampleNo => {
        var inner = readingsJson[sampleNo];
        // Create HTML for all inner values
        var innerContent = Object.keys(inner)
            .map(innerNo => `${innerNo}: ${inner[innerNo]}`)
            .join("<br>");
        // Add as one cell
        samplePlanTd += `<td style='width:80px;'>${innerContent}</td>`;
    });

    return samplePlanTd;
}
*/
function createSampleTd(sampleList) {
    var samplePlanTd = "";

    // First column: PASS/FAIL status
    var status = sampleList[0][0];
    if (status === "PASS") {
        samplePlanTd += "<td style='background-color:limeGreen; color:white; width:50px;'>" + status + "</td>";
    } else if (status === "FAIL") {
        samplePlanTd += "<td style='background-color:red; color:white; width:50px;'>" + status + "</td>";
    } else {
        samplePlanTd += "<td style='width:40px;background-color:#F9C64F; '>" + status + "</td>";
    }

    // Parse JSON with samples
    var readingsJson = {};
    try {
        readingsJson = JSON.parse(sampleList[0][1]);
    } catch (e) {
        console.error("Invalid JSON in sampleList[0][1]", e);
        return samplePlanTd;
    }

    // Loop through outer sample numbers
    Object.keys(readingsJson).forEach(sampleNo => {
        var inner = readingsJson[sampleNo];
        // Create horizontal layout for inner values
        var innerContent = Object.keys(inner)
            .map(innerNo => {
				return `<span style="display:inline-block; margin:2px;">${inner[innerNo]}</span>`
				
			})
            .join("/");

        // Add as one cell
        samplePlanTd += `<td style='width:auto; white-space:nowrap;'>${innerContent}</td>`;
    });

    return samplePlanTd;
}


$(document).on('click', '#printPreview', function(e) {
	printDiv();
});

$(document).on('click', '#print', function(e) {
	printDiv();
});

function syncRowHeights() {
    const leftRows = document.querySelectorAll("#table3 tbody tr");
    const rightRows = document.querySelectorAll("#table4 tbody tr");

    leftRows.forEach((leftRow, i) => {
        if (rightRows[i]) {
            const leftHeight = leftRow.offsetHeight;
            const rightHeight = rightRows[i].offsetHeight;
            const maxHeight = Math.max(leftHeight, rightHeight);

            leftRow.style.height = maxHeight +10+ "px";
            rightRows[i].style.height = maxHeight + "px";
        }
    });
}


/*function printDiv() {


	var partNumber = $("input[name=partNumber]").val();
	var batchCode = $("input[name=batchcode]").val();
	var mrnDateVal = $("#mrnDate").val();
	var to= $("#to").val();
	var from=$("#from").val();

	$("#tablesContainer").css("width", "100%");
	$("#div3").css("border", "0px");
	$("#reScan").css("display", "none");
	$("#increase").css("display", "none");
	$("#decrease").css("display", "none");
	$("th").css("border", "0px");
	$("#tableParameterContainer").css("border", "0px");
	$("#tableSamplesContainer").css("border", "0px");
	//$("#imageContainer").css("display", "none");
	$("#printPreview").css("display", "none");
	$("#tableParameterContainer").css("width", "70%");
	$("#tableSamplesContainer").css("width", "30%");
	$("#table4").css("width", "100%");

	$("#imageContainer").show();
	var printContents = document.getElementById("body").outerHTML;

	var originalContents = document.body.innerHTML;

	document.body.style.backgroundColor = 'white';

	document.body.innerHTML = printContents;

	$("#input1").val(partNumber);
	$("#input3").val(batchCode);
	$("#mrnDate").val(mrnDateVal);
	const imageContainer = document.getElementById("imageContainer");
	    const tablesContainer = document.getElementById("tablesContainer");
		tableParameterContainer.style.width = "100%";
		tableParameterContainer.style.display = "block";
		tableSamplesContainer.style.width = "100%";
		tableSamplesContainer.style.display = "block";
	
						   tablesContainer.style.width = "100%";

						    // left & right half
						    tableParameterContainer.style.width = "50%";
						    tableSamplesContainer.style.width = "50%";

						    // ✅ remove scroll & let columns auto adjust
						    tableSamplesContainer.style.overflow = "visible";
						    tableSamplesContainer.style.height = "auto";

						    const rightTable = tableSamplesContainer.querySelector("table");
						    if (rightTable) {
						        rightTable.style.tableLayout = "auto";  // let browser decide
						        rightTable.style.width = "100%";        // take full width
						    }
							tableSamplesContainer.style.overflow = "visible";
							tableSamplesContainer.style.height = "auto";
							const rightTable = tableSamplesContainer.querySelector("table");
							if (rightTable) {
							    rightTable.style.tableLayout = "auto";
							    rightTable.style.width = "100%";
							}

	//syncRowHeights();

	window.print();
	$("#imageContainer").show();
	   $("#tablesContainer").removeAttr("style");
	   $("#tableParameterContainer").removeAttr("style");
	   $("#tableSamplesContainer").removeAttr("style");
	   if (rightTable) {
	       rightTable.style.tableLayout = "";
	       rightTable.style.width = "";
	   }

	document.body.style.backgroundColor = '';
	document.body.innerHTML = originalContents;
	const toggleBtn = document.getElementById("toggleImageBtn");
	if (toggleBtn) {
	  toggleBtn.addEventListener("change", function() {
	    const imageContainer = document.getElementById("imageContainer");
	    const tablesContainer = document.getElementById("tablesContainer");

	    if (!imageContainer || !tablesContainer) {
	      alert("Please scan both QR inputs first!");
	      this.checked = false;
	      return;
	    }
		if (this.checked) {
					    // Hide image and expand tables
					    imageContainer.style.display = "none";
					    tablesContainer.style.width = "100%";

					    // left & right half
					    tableParameterContainer.style.width = "50%";
					    tableSamplesContainer.style.width = "50%";

					    // ✅ remove scroll & let columns auto adjust
					    tableSamplesContainer.style.overflow = "visible";
					    tableSamplesContainer.style.height = "auto";

					    const rightTable = tableSamplesContainer.querySelector("table");
					    if (rightTable) {
					        rightTable.style.tableLayout = "auto";  // let browser decide
					        rightTable.style.width = "100%";        // take full width
					    }

					    this.nextElementSibling.textContent = "Show Image";
					}

					else {
									// Show image and shrink tables
									imageContainer.style.display = "block";
									tablesContainer.style.width = "60%";
									
									tableParameterContainer.style.width = "70%";
									   tableSamplesContainer.style.width = "30%";

									   // restore scroll
									   tableSamplesContainer.style.overflow = "auto";
									   tableSamplesContainer.style.height = "400px"; // or your default

									   const rightTable = tableSamplesContainer.querySelector("table");
									   if (rightTable) {
									       rightTable.style.tableLayout = "fixed";   // back to fixed layout
									       rightTable.style.width = "150%";          // or your normal width
									   }
									this.nextElementSibling.textContent = "Hide Image";
								}
	  })
	  }

	$("#tablesContainer").removeAttr("style");
	$("#div3").removeAttr("style");
	$("#reScan").removeAttr("style");
	$("#increase").removeAttr("style");
	$("#decrease").removeAttr("style");
	$("#tableParameterContainer").removeAttr("style");
	$("#tableSamplesContainer").removeAttr("style");
	$("th").css("border", "1px solid black");
	$("#imageContainer").removeAttr("style");
	$("#tableParameterContainer").removeAttr("style");
	$("#printPreview").css("display", "block");
	$("#tableSamplesContainer").removeAttr("style");
	$("#table4").css("width", "150%");
	$("#input1").val(partNumber);
	$("#input3").val(batchCode);
	$("#mrnDate").val(mrnDateVal);
	$("#to").val(to);
	$("#from").val(from);
	
	
	

	$('.link').off('click').on('click', function(event) {


		var target = event.target.id;

		if (target == "masters") {

			window.location.replace("/WebApplication/loginpage");

			location.href = "/WebApplication/masters/dashboard?token=" + sessionStorage.getItem("token");

		} else if (target == "maintenance") {

			window.location.replace("/WebApplication/maintenance/dashboard?token=" + sessionStorage.getItem("token"));


		} else if (target == "lineleader") {
			window.location.replace("/WebApplication/lineleader/dashboard?token=" + sessionStorage.getItem("token"));


		} else if (target == "feeder") {
			window.location.replace("/WebApplication/feeder/dashboard?token=" + sessionStorage.getItem("token"));

		}
		else if (target == "workinprogress") {
			window.location.replace("/WebApplication/workinprogress/dashboard?token=" + sessionStorage.getItem("token"));

		} else if (target == "lpcqualitychecking") {
			window.location.replace("/WebApplication/lpcqualitychecking/dashboard?token=" + sessionStorage.getItem("token"));


		} else if (target == "receivequalitychecking") {
			window.location.replace("/WebApplication/receivequalitychecking/dashboard?token=" + sessionStorage.getItem("token"));

		} else if (target == "oidsClient") {
			window.location.replace("/WebApplication/jointcrimping/dashboard?token=" + sessionStorage.getItem("token"));

		} else if (target == "reports") {
			window.location.replace("/WebApplication/reports/dashboard?token=" + sessionStorage.getItem("token"));

		} else if (target == "applicatorMonitering") {
			window.location.replace("/WebApplication/applicatormonitoring/dashboard?token=" + sessionStorage.getItem("token"));

		} else if (target == "finalInspection") {
			window.location.replace("/WebApplication/finalinspection/dashboard?token=" + sessionStorage.getItem("token"));

		} else if (target == "manpower") {
			window.location.replace("/WebApplication/manpower/dashboard?token=" + sessionStorage.getItem("token"));
		} else if (target == "manpowerScanningScreen") {
			window.location.replace("/WebApplication/manpowerScanningScreen/dashboard?token=" + sessionStorage.getItem("token"));
		} else if (target == "fg") {
			window.location.replace("/WebApplication/fg?token=" + sessionStorage.getItem("token"));
		}
		else if (target == "applicatorTv") {
			window.location.replace("/WebApplication/applicatordashboard/dashboard?token=" + sessionStorage.getItem("token"));
		}
	});
	
	
	
	document.getElementById('toggleActionFilterBtn').addEventListener('change', function () {
	    showOnlyActionRequired = this.checked; // true if checked, false if unchecked

	    // You can optionally log this
	   // console.log("Filter active:", showOnlyActionRequired);
	   
	   
	   if (!showOnlyActionRequired) { // when toggle from action only to show all so change date
	   	const today = new Date().toISOString().split("T")[0];

	   	// Set both FROM and TO to today’s date
	   	$("input[name=from]").val(today);
	   	$("input[name=to]").val(today);
	   }


	    // Reload table with new filter
	    loadReceivingQualityReport(0);
		// for action required it will fetch for all the dates and for all it will take the dates selected
	});



}
*/

function printDiv() {
    var partNumber = $("input[name=partNumber]").val();
    var batchCode = $("input[name=batchcode]").val();
    var mrnDateVal = $("#mrnDate").val();
    var to = $("#to").val();
    var from = $("#from").val();

    // prepare UI
    $("#tablesContainer").css("width", "100%");
    $("#div3").css("border", "0px");
    $("#reScan").hide();
    $("#increase").hide();
    $("#decrease").hide();
    $("th").css("border", "0px");
    $("#tableParameterContainer, #tableSamplesContainer").css("border", "0px");
    $("#printPreview").hide();
    $("#tableParameterContainer").css("width", "70%");
    $("#tableSamplesContainer").css("width", "100%");
    $("#table4").css("width", "100%");
    $("#imageContainer").show();

	$("#tableSamplesContainer").css("height", "auto");
/*	tableSamplesContainer.style.height = "auto";
	
	"100%"*/
    // ✅ clone DOM with data
    var tablesClone = document.getElementById("tablesContainer").cloneNode(true);
    var imageClone = document.getElementById("imageContainer")
        ? document.getElementById("imageContainer").cloneNode(true)
        : null;

    // ✅ open print window only once
    var printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Print</title>');

    // ✅ add CSS (both table + floating label styles)
    printWindow.document.write(`
        <style>
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid black; padding: 4px; }

            .floating-label-container {
				width: 260px;
                position: relative;
                float: left;
                margin: 10px;
                margin-left: 7px;
                margin-bottom: 10px;
                margin-right: 5px;
                display: inline-block;
                vertical-align: top;
            }
            .floating-box {
				width: 260px;
                padding: 8px 6px;
                font-size: 14px;
                line-height: 20px;
                box-sizing: border-box;
                background: #fff;
                min-height: 35px;
                display: inline-block;
            }
            .floating-label {
                position: absolute;
                top: -10px;
                left: 10px;
                background: white;
                padding: 0 6px;
                font-size: 13px;
                font-weight: bold;
                color: #444;
            }
        </style>
    `);

    printWindow.document.write('</head><body>');

    // ✅ append content
    if (imageClone) {
        printWindow.document.body.appendChild(imageClone);
    }
    printWindow.document.body.appendChild(tablesClone);

    printWindow.document.write('</body></html>');
    printWindow.document.close();

    // ✅ trigger print
    printWindow.focus();
    printWindow.print();
    printWindow.close();

    // restore UI
    $("#tablesContainer, #tableParameterContainer, #tableSamplesContainer").removeAttr("style");
    $("#reScan, #increase, #decrease, #printPreview").show();
    $("th").css("border", "1px solid black");

    $("#input1").val(partNumber);
    $("#input3").val(batchCode);
    $("#mrnDate").val(mrnDateVal);
    $("#to").val(to);
    $("#from").val(from);
	
	const toggleBtn = document.getElementById("toggleImageBtn");
	    if (toggleBtn) {
	        // 1) uncheck the toggle (initial state = unchecked)
	        toggleBtn.checked = false;

	        // 2) update the label text next to it to initial text ("Hide Image")
	        if (toggleBtn.nextElementSibling) {
	            toggleBtn.nextElementSibling.textContent = "Hide Image";
	        }

	        // 3) ensure the image is visible
	        $("#imageContainer").show();

	        // 4) dispatch change event so your existing change-handler runs and sets widths/etc.
	        try {
	            toggleBtn.dispatchEvent(new Event('change', { bubbles: true }));
	        } catch (e) {
	            // fallback for older browsers
	            var evt = document.createEvent('HTMLEvents');
	            evt.initEvent('change', true, false);
	            toggleBtn.dispatchEvent(evt);
	        }
	    }

}

/*

function printDiv() {
    var partNumber = $("input[name=partNumber]").val();
    var batchCode = $("input[name=batchcode]").val();
    var mrnDateVal = $("#mrnDate").val();
    var to = $("#to").val();
    var from = $("#from").val();

    // prepare UI
    $("#tablesContainer").css("width", "100%");
    $("#div3").css("border", "0px");
    $("#reScan").hide();
    $("#increase").hide();
    $("#decrease").hide();
    $("th").css("border", "0px");
    $("#tableParameterContainer, #tableSamplesContainer").css("border", "0px");
    $("#printPreview").hide();
    $("#tableParameterContainer").css("width", "70%");
    $("#tableSamplesContainer").css("width", "30%");
    $("#table4").css("width", "100%");
    $("#imageContainer").show();

    // ✅ clone live DOM with data (not just static HTML)
    var tablesClone = document.getElementById("tablesContainer").cloneNode(true);
    var imageClone = document.getElementById("imageContainer") 
        ? document.getElementById("imageContainer").cloneNode(true) 
        : null;

    var printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Print</title>');
    printWindow.document.write('<style>table{border-collapse:collapse;width:100%;} th,td{border:1px solid black;padding:4px;}</style>');
    printWindow.document.write('</head><body>');

    if (imageClone) {
        printWindow.document.body.appendChild(imageClone);
    }
    printWindow.document.body.appendChild(tablesClone);

    printWindow.document.write('</body></html>');
    printWindow.document.close();

    printWindow.focus();
    printWindow.print();
    printWindow.close();

    // restore UI
    $("#tablesContainer, #tableParameterContainer, #tableSamplesContainer").removeAttr("style");
    $("#reScan, #increase, #decrease, #printPreview").show();
    $("th").css("border", "1px solid black");

    $("#input1").val(partNumber);
    $("#input3").val(batchCode);
    $("#mrnDate").val(mrnDateVal);
    $("#to").val(to);
    $("#from").val(from);
	
	const toggleBtn = document.getElementById("toggleImageBtn");
	    if (toggleBtn) {
	        // 1) uncheck the toggle (initial state = unchecked)
	        toggleBtn.checked = false;

	        // 2) update the label text next to it to initial text ("Hide Image")
	        if (toggleBtn.nextElementSibling) {
	            toggleBtn.nextElementSibling.textContent = "Hide Image";
	        }

	        // 3) ensure the image is visible
	        $("#imageContainer").show();

	        // 4) dispatch change event so your existing change-handler runs and sets widths/etc.
	        try {
	            toggleBtn.dispatchEvent(new Event('change', { bubbles: true }));
	        } catch (e) {
	            // fallback for older browsers
	            var evt = document.createEvent('HTMLEvents');
	            evt.initEvent('change', true, false);
	            toggleBtn.dispatchEvent(evt);
	        }
	    }
	
}
*/


$(document).ready(function() {

	$(document).on('click', '#finalInspectionReport', function() {

		searchLoad = false; clearInterval(interval);

		$(".fromTo").css("display", "none");
		$("#printPreview").css("display", "block");
		$("#pageSelect").css("display", "none");
		$("#next").css("display", "none");
		$("#previous").css("display", "none");
		$("#backToHarness").css("display", "none");
		$("#excelDownload").css("display", "none");
		$("#toggleActionFilterBtn").closest(".switch").css("display", "none");
				
		$("#offcanvasCloseButton").click();

		var child1 = document.getElementById("div3");
		var child2 = document.getElementById("div4");

		child1.remove();
		if (child2) { child2.remove(); }

		document.getElementById("masterHeading").innerText = "";
		$("#masterHeading").append("FINAL INSPECTION REPORT");

		var div3 = document.createElement("div");
		var div4 = document.createElement("div");

		$("#div2").append(div3, div4);

		div3.setAttribute("id", "div3");
		div3.setAttribute("class", "masterBody");

		div4.setAttribute("id", "div4");
		div4.setAttribute("class", "masterBody");
		div4.setAttribute("Style", "overflow-y:scroll;display:none;");

		var bottom = document.createElement("div");

		bottom.setAttribute("id", "bottom");

		$("#div4").append(bottom);

		var table = document.createElement("table");
		table.setAttribute("id", "table1");
		table.setAttribute("cellspacing", "0px");
		table.setAttribute("border", "1px");


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

		container1.setAttribute("id", "imageAndTableContainer");
		container2.setAttribute("id", "tablesContainer");
		container3.setAttribute("id", "imageContainer");
		container4.setAttribute("id", "tableHeadContainer");
		container5.setAttribute("id", "tableBodiesContainer");
		container6.setAttribute("id", "tableParameterContainer");
		container7.setAttribute("id", "tableSamplesContainer");
		container8.setAttribute("id", "resultContainer");
		container9.setAttribute("id", "approveAndResult");
		container10.setAttribute("id", "buttonContainer");

		$("#div3").append(container1);
		container1.append(container2, container3);
		container2.append(container10, container4, container5);
		container5.append(container6, container7);

		var table2 = document.createElement("table");
		var table3 = document.createElement("table");
		var table4 = document.createElement("table");

		var thead2 = document.createElement("thead");
		var thead3 = document.createElement("thead");
		var thead4 = document.createElement("thead");

		var tbody2 = document.createElement("tbody");
		var tbody3 = document.createElement("tbody");
		var tbody4 = document.createElement("tbody");

		table2.setAttribute("id", "table2");
		table2.setAttribute("style", "width:100%");
		thead2.setAttribute("id", "thead2");
		tbody2.setAttribute("id", "tbody2");

		table3.setAttribute("id", "table3");
		table3.setAttribute("style", "width:100%");
		thead3.setAttribute("id", "thead3");
		tbody3.setAttribute("id", "tbody3");

		table4.setAttribute("id", "table4");
		thead4.setAttribute("id", "thead4");
		tbody4.setAttribute("id", "tbody4");


		var w = window.innerWidth;

		if (w < 500) {
			table.setAttribute("style", "width:300%;");
		} else if (w < 1100) {
			table.setAttribute("style", "width:250%;");
		}
		else if (w < 1500) {
			table.setAttribute("style", "width:100%;");
			table2.setAttribute("style", "width:100%;");
			table3.setAttribute("style", "width:100%;");
			table4.setAttribute("style", "width:150%;");
		} else if (w < 1000) {
			table.setAttribute("style", "width:150%;");
		} else {
			table.setAttribute("style", "width:100%;");
		}


		var tr = document.createElement("tr");
		var tr1 = document.createElement("tr");
		var tr2 = document.createElement("tr");
		var tr3 = document.createElement("tr");
		var tr4 = document.createElement("tr");
		var tr5 = document.createElement("tr");
		var tr6 = document.createElement("tr");
		var tr7 = document.createElement("tr");


		container2.append(container9, container8);
		container8.append("RESULT /T.Q/P.Q/F.Q");

		container4.append(table2);
		table2.append(thead2, tbody2);
		thead2.append(tr, tr1);

		container6.append(table3);
		table3.append(thead3, tbody3);
		thead3.append(tr2);

		container7.append(table4);
		table4.append(thead4, tbody4);
		thead4.append(tr3);

		var th = document.createElement("th");
		th.setAttribute("style", "width:70px; font-size:18px;");
		var th1 = document.createElement("th");
		th1.setAttribute("style", "width:100px;");
		var th2 = document.createElement("th");
		th2.setAttribute("style", "width:50px; font-size:18px;");
		var th3 = document.createElement("th");
		th3.setAttribute("style", "width:70px; font-size:18px;");
		var th4 = document.createElement("th");
		th4.setAttribute("style", "width:70px; font-size:18px;");
		var th5 = document.createElement("th");
		th5.setAttribute("style", "width:150px; font-size:18px;");
		var th6 = document.createElement("th");
		th6.setAttribute("style", "width:70px; font-size:18px;");
		var th7 = document.createElement("th");
		th7.setAttribute("style", "width:70px; font-size:18px;");
		var th8 = document.createElement("th");
		th8.setAttribute("style", "width:50px; font-size:18px;");
		var th9 = document.createElement("th");
		th9.setAttribute("style", "width:50px; font-size:18px;");
		var th10 = document.createElement("th");
		th10.setAttribute("style", "width:40px;");
		th10.setAttribute("class", "tableHeading2");
		var th11 = document.createElement("th");
		th11.setAttribute("style", "width:150px;");
		th11.setAttribute("class", "tableHeading2");
		var th12 = document.createElement("th");
		th12.setAttribute("style", "width:70px;");
		th12.setAttribute("class", "tableHeading2");
		var th13 = document.createElement("th");
		th13.setAttribute("style", "width:50px;");
		th13.setAttribute("class", "tableHeading2");
		var th14 = document.createElement("th");
		th14.setAttribute("style", "width:50px;");
		th14.setAttribute("class", "tableHeading2");
		var th15 = document.createElement("th");
		th15.setAttribute("style", "width:100px;");
		th15.setAttribute("class", "tableHeading2");
		var th16 = document.createElement("th");
		th16.setAttribute("style", "width:100px;");
		th16.setAttribute("class", "tableHeading2");
		var th17 = document.createElement("th");
		th17.setAttribute("style", "width:40px;");
		th17.setAttribute("class", "tableHeading2");
		var th17_1 = document.createElement("th");
		th17_1.setAttribute("style", "width:40px;");
		th17_1.setAttribute("class", "tableHeading2");
		var th18 = document.createElement("th");
		th18.setAttribute("style", "width:40px;");
		th18.setAttribute("class", "tableHeading2");
		var th19 = document.createElement("th");
		th19.setAttribute("style", "width:40px;");
		th19.setAttribute("class", "tableHeading2");
		var th20 = document.createElement("th");
		th20.setAttribute("style", "width:40px;");
		th20.setAttribute("class", "tableHeading2");
		var th21 = document.createElement("th");
		th21.setAttribute("style", "width:40px;");
		th21.setAttribute("class", "tableHeading2");
		var th22 = document.createElement("th");
		th22.setAttribute("style", "width:40px;");
		th22.setAttribute("class", "tableHeading2");
		var th23 = document.createElement("th");
		th23.setAttribute("style", "width:40px;");
		th23.setAttribute("class", "tableHeading2");
		var th24 = document.createElement("th");
		th24.setAttribute("style", "width:40px;");
		th24.setAttribute("class", "tableHeading2");
		var th25 = document.createElement("th");
		th25.setAttribute("style", "width:40px;");
		th25.setAttribute("class", "tableHeading2");
		var th26 = document.createElement("th");
		th26.setAttribute("style", "width:40px;");
		th26.setAttribute("class", "tableHeading2");
		var th27 = document.createElement("th");
		th27.setAttribute("style", "width:40px;");
		th27.setAttribute("class", "tableHeading2");
		var th28 = document.createElement("th");
		th28.setAttribute("style", "width:40px;");
		th28.setAttribute("class", "tableHeading2");
		var th29 = document.createElement("th");
		th29.setAttribute("style", "width:40px;");
		th29.setAttribute("class", "tableHeading2");
		var th30 = document.createElement("th");
		th30.setAttribute("style", "width:40px;");
		th30.setAttribute("class", "tableHeading2");



		var input = document.createElement("input");
		var input1 = document.createElement("input");
		var input2 = document.createElement("input");
		var input3 = document.createElement("input");
		var input4 = document.createElement("input");

		var inputAttr = ["name", "partNumber", "id", "input1", "class", "inputs", "autocomplete", "off", "plceholder", "Part No...", "Style", "height:40px; font-size:20px;"];
		for (var i = 0; i < inputAttr.length; i = i + 2) {
			for (var j = 0; j <= i; j = j + 2) {
				input.setAttribute(inputAttr[i], inputAttr[j + 1]);
			}
		}

		/*		var input1Attr = ["name", "partName", "id", "input2", "class", "inputs", "autocomplete", "off", "disabled", "disabled", "Style","height:40px;"];
				for (var i = 0; i < input1Attr.length; i = i + 2) {
					for (var j = 0; j <= i; j = j + 2) {
						input1.setAttribute(input1Attr[i], input1Attr[j + 1]);
					}
				}*/

		var input2Attr = ["name", "batchcode", "id", "input3", "class", "inputs", "autocomplete", "off", "Style", "height:40px; font-size:20px;"];
		for (var i = 0; i < input2Attr.length; i = i + 2) {
			for (var j = 0; j <= i; j = j + 2) {
				input2.setAttribute(input2Attr[i], input2Attr[j + 1]);
			}
		}

		/*		var input3Attr = ["name", "mispNumber", "id", "input4", "class", "inputs", "autocomplete", "off", "disabled", "disabled", "Style","height:40px;"];
				for (var i = 0; i < input3Attr.length; i = i + 2) {
					for (var j = 0; j <= i; j = j + 2) {
						input3.setAttribute(input3Attr[i], input3Attr[j + 1]);
					}
				}
		
				var input4Attr = ["name", "revNumber", "id", "input5", "class", "inputs", "autocomplete", "off", "disabled", "disabled", "Style","height:40px;"];
				for (var i = 0; i < input4Attr.length; i = i + 2) {
					for (var j = 0; j <= i; j = j + 2) {
						input4.setAttribute(input4Attr[i], input4Attr[j + 1]);
					}
				}*/


		tr.append(th, th1, th2, th3);
		tr1.append(th4, th5, th6, th7, th8, th9);
		tr2.append(th10, th11, th12, th13, th14, th15, th16, th17, th17_1);
		tr3.append(th18, th19, th20, th21, th22, th23, th24, th25, th26, th27, th28);

		th.innerText = "Minda Part :";
		th1.append(input);

		th2.innerText = "Description :";
		th3.setAttribute("id", "partNameContainer");
		th3.setAttribute("colspan", "3");

		th4.innerText = "MRN No :";
		th5.append(input2);

		th6.innerText = "RQC-P No :";
		th7.setAttribute("id", "mispNumberContainer");

		th8.innerText = "Rev No :";
		th9.setAttribute("id", "revNumberContainer");

		th10.innerText = "S.No.";
		th11.innerText = "I. ITEM";
		th12.innerText = "CRITERIA";
		th13.innerText = "MIN";
		th14.innerText = "MAX";
		th15.innerText = "METHOD";
		th16.innerText = "INSP. TOOL";
		th17.innerText = "S.Size";
		th17_1.innerText = "M.D.V";

		th18.innerText = "Result"; 
		th19.innerText = "S1";
		th20.innerText = "S2";
		th21.innerText = "S3";
		th22.innerText = "S4";
		th23.innerText = "S5";
		th24.innerText = "S6";
		th25.innerText = "S7";
		th26.innerText = "S8";
		th27.innerText = "S9";
		th28.innerText = "S10";


		var button = document.createElement("button");
		button.setAttribute("id", "reScan");

		var increase = document.createElement("button");
		increase.setAttribute("id", "increase");

		var decrease = document.createElement("button");
		decrease.setAttribute("id", "decrease");

		// Supplier section
		var supplierContainer = document.createElement("div");
		supplierContainer.setAttribute("style", "display: flex; align-items: center; float: left; margin-left: 10px; margin-bottom: 10px;");

		var supplierLabel = document.createElement("label");
		supplierLabel.setAttribute("for", "supplierdiv");
		supplierLabel.setAttribute("style", "margin-right: 5px; width: 130px; font-weight:bolder;");
		supplierLabel.textContent = "Supplier Name:";

		var supplierDiv = document.createElement("div");
		supplierDiv.setAttribute("id", "supplierdiv");
		supplierDiv.setAttribute("style", "width:200px; height:35px; border:2px solid #cccccc; line-height:25px; padding-left: 5px; margin-top: 5px;");
		supplierDiv.textContent = ".....................";

		supplierContainer.append(supplierLabel, supplierDiv);


		// Quantity section
		var quantityContainer = document.createElement("div");
		quantityContainer.setAttribute("style", "display: flex; align-items: center; float: left; margin-left: 10px; margin-bottom: 10px;");

		var quantityLabel = document.createElement("label");
		quantityLabel.setAttribute("for", "quantity");
		quantityLabel.setAttribute("style", "margin-right: 5px; width: 100px;font-weight:bolder;");
		quantityLabel.textContent = "Quantity:";

		var quantityDiv = document.createElement("div");
		quantityDiv.setAttribute("id", "quantity");
		quantityDiv.setAttribute("style", "width:200px; height:35px; border:2px solid #cccccc; line-height:25px; padding-left: 5px; margin-top: 5px;");
		quantityDiv.textContent = ".....................";

		quantityContainer.append(quantityLabel, quantityDiv);

		// Append to container10
		container10.append(supplierContainer, quantityContainer, button, decrease, increase);

		//container10.append(button, increase, decrease)

	});
});

//------------MachineUtilization-------------
$(document).ready(function() {

	$(document).on('click', '#machineUtilization', function() {

		searchLoad = false; clearInterval(interval);

		$("#planDateDiv").css("display", "none");
		$("#pagerDiv").css("display", "block");
		$("#printPreview").css("display", "none");
		$("#backToHarness").css("display", "none");
		$("#toggleActionFilterBtn").closest(".switch").css("display", "none");
				
		$("#offcanvasCloseButton").click();

		var child1 = document.getElementById("div3");
		var child2 = document.getElementById("div4");

		child1.remove();
		if (child2) { child2.remove(); }

		document.getElementById("masterHeading").innerText = "";
		$("#masterHeading").append("MACHINE UTILIZATION REPORT");

		var div3 = document.createElement("div");
		var div4 = document.createElement("div");

		$("#div2").append(div3, div4);

		div3.setAttribute("id", "div3");
		div3.setAttribute("class", "masterBody");

		div4.setAttribute("id", "div4");
		div4.setAttribute("class", "masterBody");
		div4.setAttribute("Style", "overflow-y:scroll; display:none;");

		var bottom = document.createElement("div");

		bottom.setAttribute("id", "bottom");
		/*	bottom.setAttribute("style","height: 50%;")*/

		$("#div4").append(bottom);

		var element1 = document.createElement("table");
		$("#div3").append(element1);
		element1.setAttribute("id", "table1");
		element1.setAttribute("cellspacing", "0px");
		/*element1.setAttribute("cellpaddding","10px");*/
		element1.setAttribute("class", "table-hover");

		var w = window.innerWidth;

		if (w < 500) {
			element1.setAttribute("style", "width:300%;");
		} else if (w < 1100) {
			element1.setAttribute("style", "width:250%;");
		}
		else if (w < 1500) {
			element1.setAttribute("style", "width:100%;");
		} else if (w < 1000) {
			element1.setAttribute("style", "width:150%;");
		} else {
			element1.setAttribute("style", "width:100%;");
		}


		var element1_1 = document.createElement("thead");
		element1.append(element1_1);

		var element1_2 = document.createElement("tr");


		var element1_3 = document.createElement("tbody");
		element1.append(element1_3)
		element1_3.setAttribute("id", "tableBody");

		// search
		/*********************/


		var searchRow = document.createElement("tr");
		searchRow.setAttribute("id", "searchRow");
		var imgContainer = document.createElement("th");
		imgContainer.setAttribute("class", "tableheading");
		var img = document.createElement("img");
		img.setAttribute("src", "/WebApplication/images/searchFilter.png");
		img.setAttribute("width", "22");
		img.setAttribute("height", "22");
		img.setAttribute("id", "searchButton");
		imgContainer.append(img);
		searchRow.append(imgContainer);


		var searchTitles = ["searchDate_Time"];

		//var placeholders = ["Plant Code. "Date & Time..."];
		for (var i = 0; i < searchTitles.length; i++) {
			var searchContainer = document.createElement("th");
			searchContainer.setAttribute("class", "tableheading");
			var searchinput = document.createElement("input");
			searchinput.setAttribute("type", "date")
			searchinput.setAttribute("style", "width:100%;");
			searchinput.setAttribute("title", searchTitles[i]);
			/*	searchinput.setAttribute("placeholder", placeholders[i]);*/
			searchinput.setAttribute("class", "searchFilterClass inputs");
			searchContainer.append(searchinput);
			searchRow.append(searchContainer);
		}

		element1_1.append(searchRow);

		/*********************/
		element1_1.append(element1_2);

		var element2 = document.createElement("th");
		element2.innerText = "S.No.";
		var element3 = document.createElement("th");
		element3.innerText = "Machine Name";
		var element4 = document.createElement("th");
		element4.innerText = "Per Day Capacity";
		var element5 = document.createElement("th");
		element5.innerText = "Total Ckt Plan";
		var element6 = document.createElement("th");
		element6.innerText = "Machine Load";
		var element6_1 = document.createElement("th");
		element6_1.innerText = "Machine Progress";
		var element7 = document.createElement("th");
		element7.innerText = "Date & Time";

		var element9_2 = document.createElement("th");
		element9_2.innerText = "Id";
		element9_2.setAttribute("style", "display:none");


		element1_2.append(element2, element3, element4, element5, element6, element6_1, element7, element9_2);
		element2.setAttribute("class", "tableheading");
		// element2.setAttribute("scope","col");
		element3.setAttribute("class", "tableheading");
		// element3.setAttribute("scope","col");
		element4.setAttribute("class", "tableheading");
		// element4.setAttribute("scope","col");
		element5.setAttribute("class", "tableheading");
		// element5.setAttribute("scope","col");
		element6.setAttribute("class", "tableheading");
		element6_1.setAttribute("class", "tableheading");
		// element6.setAttribute("scope","col");
		element7.setAttribute("class", "tableheading");

		element9_2.setAttribute("class", "tableheading");
		element9_2.setAttribute("style", "display:none;");
		// element9.setAttribute("scope","col");

		/*var element18_2 = document.createElement("div");
		element18_2.setAttribute("class", "buttonsContainer");

		var element41 = document.createElement("div");
		element41.setAttribute("class", "buttonsContainer");

		var element44 = document.createElement("button");
		element44.setAttribute("class", "data");
		element44.setAttribute("title", "Excel Download");

		element41.append(element44);
		element18_2.append(element41);

		$("#bottom").append(element18_2);*/

		$("#pageSelect").empty();

		//loadMachineUtilization();

	});
});
function insertMachineUtilization($item) {

	$("#tableBody").remove();


	var tablebody = document.createElement("tbody");
	$("#table1").append(tablebody);
	tablebody.setAttribute("id", "tableBody");

	$.each($item, function(index, value) {
		var machineLoadColor = '';
		var textColor = '';
		if (value.machineload >= 80 && value.machineload < 90) {
			machineLoadColor = 'yellow';
			textColor = 'black';
		} else if (value.machineload >= 90) {
			machineLoadColor = 'red';
			textColor = 'white';
		} else if (value.machineload >= 0 && value.machineload < 80) {
			machineLoadColor = 'green';
			textColor = 'white';
		}

		var progress = (value.machineload / 100) * 100;

		var row =
			'<tr class="tableDataRows"><td data-column="columnId" style="width:70px">' +
			(parseInt(index) + 1) +
			"</td>" +
			'<td data-column="graphName">' +
			value.graphName +
			"</td>" +
			'<td data-column="perDayCapacity">' +
			value.per_day_capacity +
			"</td>" +
			'<td data-column="totalCktPlan">' +
			value.totalCktPlan +
			"</td>" +
			'<td data-column="machineLoad" style="background-color: ' + machineLoadColor + '; color: ' + textColor + '">' +
			value.machineload + "%" +
			"</td>" +
			'<td data-column="machineprogress">' +
			'<div class="progress" style="height: 20px;">' +
			'<div class="progress-bar bg-success" role="progressbar" style="width: ' + progress + '%" aria-valuenow="' + progress + '" aria-valuemin="0" aria-valuemax="100"></div>' +
			'</div>' +
			"</td>" +
			'<td data-column="dateTime">' +
			value.date_time +
			"</td>" +
			'<td data-column="machineUtilizationId" style="display:none;">' +
			value.machineUtilizationId +
			"</td></tr>";
		$("#tableBody").append(row);

	});
}




function loadMachineUtilization() {

	$.ajax({
		type: "GET",
		url: "/WebApplication/Controllers/getAllMachineUtilication",
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
		success: function(res) {
			//$("#pageSelect").val(page);

			insertMachineUtilization(res);


		}, error: function(e) {
			console.log("Error")
		}
	});
}


function loadDataTimeformachineutilization() {

	searchLoad = true;
	var datetime = $('input[title="searchDate_Time"]').val() ?? "";

	var formData = {
		date_time: datetime
	}
	console.log("formData::", formData)
	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getLikeMachineUtilization',
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {

			if (res.length == 0) {
				alert("Data not found");
			}
			insertMachineUtilization(res);

		},
		error: function(response) {
			$("#warningInformationModalBody").text(response.responseText);
			$("#warningBackdropButton").click();
		}
	});
}





$(document).ready(function() {

	$(document).on('click', '#dateWiseCktPlanReport', function() {

		searchLoad = false; clearInterval(interval);

		$(".fromTo").css("display", "block");
		$("#excelDownload").css("display", "block");
		$("#pageSelect").css("display", "block");
		$("#printPreview").css("display", "none");
		$("#next").css("display", "block");
		$("#previous").css("display", "block");
		$("#backToHarness").css("display", "none");
		$("#toggleActionFilterBtn").closest(".switch").css("display", "none");
				
		$("#offcanvasCloseButton").click();

		var child1 = document.getElementById("div3");
		var child2 = document.getElementById("div4");

		child1.remove();
		if (child2) { child2.remove(); }

		document.getElementById("masterHeading").innerText = "";
		$("#masterHeading").append("CKT PLAN REPORT");

		var div3 = document.createElement("div");
		var div4 = document.createElement("div");

		$("#div2").append(div3, div4);

		div3.setAttribute("id", "div3");
		div3.setAttribute("class", "masterBody emptyContainer");

		div4.setAttribute("id", "div4");
		div4.setAttribute("class", "masterBody");
		div4.setAttribute("Style", "overflow-y:scroll; display:none;");

		var bottom = document.createElement("div");

		bottom.setAttribute("id", "bottom");
		/*	bottom.setAttribute("style","height: 50%;")*/

		$("#div4").append(bottom);

		var element1 = document.createElement("table");
		$("#div3").append(element1);
		element1.setAttribute("id", "table1");
		element1.setAttribute("cellspacing", "0px");
		/*element1.setAttribute("cellpaddding","10px");*/
		element1.setAttribute("class", "table-hover");

		var w = window.innerWidth;

		if (w < 500) {
			element1.setAttribute("style", "width:300%;");
		} else if (w < 1100) {
			element1.setAttribute("style", "width:250%;");
		}
		else if (w < 1500) {
			element1.setAttribute("style", "width:220%;");
		} else if (w < 2000) {
			element1.setAttribute("style", "width:150%;");
		} else {
			element1.setAttribute("style", "width:100%;");
		}

		var element1_1 = document.createElement("thead");
		element1.append(element1_1);

		var element1_2 = document.createElement("tr");


		var element1_3 = document.createElement("tbody");
		element1.append(element1_3)
		element1_3.setAttribute("id", "tableBody");

		// search
		/*********************/


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

		var searchTitles = ["searchPartCode", "searchOrderNo", "searchCktNO", "searchMachineNo"];

		for (var i = 0; i < searchTitles.length; i++) {
			var searchContainer = document.createElement("th");
			searchContainer.setAttribute("class", "tableheading");
			var searchinput = document.createElement("input");
			var list = document.createElement("datalist")
			searchinput.setAttribute("style", "width:100%;");
			searchinput.setAttribute("title", searchTitles[i]);
			searchinput.setAttribute("list", searchTitles[i]);
			list.setAttribute("id", searchTitles[i]);
			searchinput.setAttribute("class", "searchFilterClass inputs");
			searchContainer.append(searchinput, list);
			searchRow.append(searchContainer);
		}

		var searchContainer = document.createElement("th");
		searchContainer.setAttribute("class", "tableheading");
		var searchinput = document.createElement("select");
		searchinput.setAttribute("id", "searchRunningStatus");
		searchinput.setAttribute("class", "searchFilterClass inputs");
		var opt1 = document.createElement("option");
		opt1.innerText = "All";
		opt1.setAttribute("value", "");
		var opt2 = document.createElement("option");
		opt2.innerText = "Complete";
		opt2.setAttribute("value", "4");
		var opt3 = document.createElement("option");
		opt3.innerText = "In Progress";
		opt3.setAttribute("value", "3");
		var opt4 = document.createElement("option");
		opt4.innerText = "Waiting";
		opt4.setAttribute("value", "2");
		var opt5 = document.createElement("option");
		opt5.innerText = "Hold";
		opt5.setAttribute("value", "0");
		searchinput.append(opt1, opt2, opt3, opt4, opt5);

		searchContainer.append(searchinput);
		searchRow.append(searchContainer);

		element1_1.append(searchRow);

		/*********************/
		element1_1.append(element1_2);


		var element2 = document.createElement("th");
		element2.innerText = "S.No.";
		var element3 = document.createElement("th");
		element3.innerText = "Part Code";
		var element3_2 = document.createElement("th");
		element3_2.innerText = "Order No.";
		var element4 = document.createElement("th");
		element4.innerText = "CKT No.";
		var element5 = document.createElement("th");
		element5.innerText = "Machine No";
		var element5_1 = document.createElement("th");
		element5_1.innerText = "Status";
		var element5_2 = document.createElement("th");
		element5_2.innerText = "Reason";
		var element6 = document.createElement("th");
		element6.innerText = "Lot Size";
		var element6_2 = document.createElement("th");
		element6_2.innerText = "Date Time";
		var element6_3 = document.createElement("th");
		element6_3.innerText = "Wire Code";
		var element7 = document.createElement("th");
		element7.innerText = "Wire Desc";
		var element8 = document.createElement("th");
		element8.innerText = "Ter. A";
		var element8_2 = document.createElement("th");
		element8_2.innerText = "Ter. A Desc";
		var element9 = document.createElement("th");
		element9.innerText = "Ter. B";
		var element10 = document.createElement("th");
		element10.innerText = "Ter. B Desc";
		var element11 = document.createElement("th");
		element11.innerText = "Seal A";
		var element12 = document.createElement("th");
		element12.innerText = "Seal A Desc";
		var element13 = document.createElement("th");
		element13.innerText = "Seal B";
		var element14 = document.createElement("th");
		element14.innerText = "Seal B Desc";


		element1_2.append(element2, element3, element3_2, element4, element5, element5_1, element5_2, element6, element6_2, element6_3, element7, element8, element8_2, element9, element10, element10, element11, element12, element13, element14);
		element2.setAttribute("class", "tableheading");
		// element2.setAttribute("scope","col");
		element3.setAttribute("class", "tableheading");
		// element3.setAttribute("scope","col");
		element3_2.setAttribute("class", "tableheading");
		// element3.setAttribute("scope","col");
		element4.setAttribute("class", "tableheading");
		// element4.setAttribute("scope","col");
		element5.setAttribute("class", "tableheading");
		element5_1.setAttribute("class", "tableheading");
		// element5.setAttribute("scope","col");
		element5_2.setAttribute("class", "tableheading");
		// element5.setAttribute("scope","col");
		element6.setAttribute("class", "tableheading");
		// element6.setAttribute("scope","col");
		element6_2.setAttribute("class", "tableheading");
		// element6.setAttribute("scope","col");
		element6_3.setAttribute("class", "tableheading");
		// element6_3.setAttribute("scope","col");
		element7.setAttribute("class", "tableheading");
		// element7.setAttribute("scope","col");
		element8.setAttribute("class", "tableheading");
		element8_2.setAttribute("class", "tableheading");
		// element8.setAttribute("scope","col");
		element9.setAttribute("class", "tableheading");
		// element9.setAttribute("scope","col");
		element10.setAttribute("class", "tableheading");
		// element9.setAttribute("scope","col");
		element11.setAttribute("class", "tableheading");
		// element9.setAttribute("scope","col");
		element12.setAttribute("class", "tableheading");
		// element9.setAttribute("scope","col");
		element13.setAttribute("class", "tableheading");
		// element9.setAttribute("scope","col");
		element14.setAttribute("class", "tableheading");
		// element9.setAttribute("scope","col");

		var element18_2 = document.createElement("div");
		element18_2.setAttribute("class", "buttonsContainer");

		var element41 = document.createElement("div");
		element41.setAttribute("class", "buttonsContainer");

		var element44 = document.createElement("button");
		element44.setAttribute("class", "data");
		element44.setAttribute("title", "Excel Download");

		element41.append(element44);
		element18_2.append(element41);

		$("#bottom").append(element18_2);

		$("#pageSelect").empty();
		getCurrentDate();
		getAllPartCodeInList();

	});

});



function loadLikeDateWiseCktPlanData(page) {


	searchLoad = true;
	var partCode = $('input[title="searchPartCode"]').val() ?? '';
	var circuitNumber = $('input[title="searchCktNO"]').val() ?? '';
	var batchCode = $('input[title="searchOrderNo"]').val() ?? '';
	var machineName = $('input[title="searchMachineNo"]').val() ?? '';
	var from = $("input[name=from]").val();
	var to = $("input[name=to]").val();
	var runningStatus = $('#searchRunningStatus :selected').val();
	console.log(from + to)

	if (!from && !to) {
		alert("Please select date to get date wise ckt plan report.");
		return;
	}

	if (partCode == "" && circuitNumber == "" && batchCode == "" && machineName == "" && !from && !to) {
		$("#dateWiseCktPlanReport").click();
		return;
	}

	const startDate = new Date(from);
	const endDate = new Date(to);
	var difference = dateDifference(startDate, endDate);

	if (difference < 0) {
		alert("Selected From date is greater than To date pleaase check it.");
		return;
	}


	$("#loadingBackdropButton").click();
	$("#loadingBackdropModalMessage").text("Getting Date Wise CKT Plan Report.");

	var formData = {
		partCode: partCode,
		circuitNumber: circuitNumber,
		batchCode: batchCode,
		dateTime: from + "," + to,
		runningStatus: runningStatus,
		machine: {
			machineName: machineName
		}
	}

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getDateWiseCktPlanReport/' + page,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {
			makePager(res.totalPages, page)
			insertDateWiseCktPlanInTable(res.content, page + 1);
			$("#div3").removeClass("emptyContainer");
			setTimeout(function() {
				$("#loadingBackdropButton").click();
			}, 500);
		},
		error: function(response) {
			setTimeout(function() {
				$("#loadingBackdropButton").click();
				alert(response.responseText);
			}, 500);

		}
	});
}

function getColorAndStringByStatus(status) {


	if (status == 4) {
		return '<td style="background-color:limegreen; color:white;">Cutting Complete</td>';
	} else if (status == 3) {
		return '<td style="background-color:yellow;">Cutting In Progress</td>';
	} else if (status == 2) {
		return '<td style="background-color:blue; color:white;">Waiting For Cutting</td>';
	} else if (status == 0) {
		return '<td style="background-color:red; color:white;">Hold</td>';
	}
}

function insertDateWiseCktPlanInTable($item, page) {
	$("#tableBody").remove();

	var tablebody = document.createElement("tbody");
	$("#table1").append(tablebody);
	tablebody.setAttribute("id", "tableBody");

	var sequenceNumber = pageSize * parseInt($('#pageSelect :selected').val());

	$.each($item, function(index, value) {
		var colorStatus = getColorAndStringByStatus(value.runningStatus)

		var row = '<tr class="tableDataRows"><td data-column="columnId" style="width:70px; max-width:70px;">' + (sequenceNumber + 1) + '</td>'
			+ '<td data-column="partCode">' + (value.partCode == null ? '' : value.partCode) + '</td>'
			+ '<td data-column="batchCode">' + (value.batchCode == null ? '' : value.batchCode) + '</td>'
			+ '<td data-column="circuitNumber">' + value.circuitNumber + '</td>'
			+ '<td data-column="machineNo">' + (value.machine == null ? '' : value.machine.machineName) + '</td>'
			+ colorStatus
			+ '<td data-column="breakdown">' + (value.subBreakdown == null ? '' : value.subBreakdown.breakdown.breakdownCategory + " / " + value.subBreakdown.subBreakdown) + '</td>'
			+ '<td data-column="lotSize">' + (value.planSize == null ? '' : value.planSize) + '</td>'
			+ '<td data-column="dateTime">' + (value.dateTime == null ? '' : value.dateTime.slice(0, 10)) + '</td>'
			+ '<td data-column="wireCode">' + (value.wireCode == null ? '' : value.wireCode) + '</td>'
			+ '<td data-column="wireDescription" style="width:300px; text-align:left; padding-left:10px;">' + (value.wireDescription == null ? '' : value.wireDescription) + '</td>'
			+ '<td data-column="terminalA" >' + (value.terminalA == null ? '' : value.terminalA) + '</td>'
			+ '<td data-column="terminalADescription" style="width:400px; text-align:left; padding-left:10px;">' + (value.terminalADescription == null ? '' : value.terminalADescription) + '</td>'
			+ '<td data-column="terminalB">' + (value.terminalB == null ? '' : value.terminalB) + '</td>'
			+ '<td data-column="terminalBDescription" style="width:400px; text-align:left; padding-left:10px;">' + (value.terminalBDescription == null ? '' : value.terminalBDescription) + '</td>'
			+ '<td data-column="sealA">' + (value.sealA == null ? '' : value.sealA) + '</td>'
			+ '<td data-column="sealADescription" style="width:400px; text-align:left; padding-left:10px;">' + (value.sealADescription == null ? '' : value.sealADescription) + '</td>'
			+ '<td data-column="sealB">' + (value.sealB == null ? '' : value.sealB) + '</td>'
			+ '<td data-column="sealBDescription" style="width:400px; text-align:left; padding-left:10px;">' + (value.sealBDescription == null ? '' : value.sealBDescription) + '</td></tr>';
		$('#table1').append(row);
		sequenceNumber++;
	});
}




$(document).ready(function() {

	$(document).on("click", "#applicatorDashboard", function() {
		searchLoad = false; clearInterval(interval);

		$(".fromTo").css("display", "none");
		$("#excelDownload").css("display", "none");
		$("#pageSelect").css("display", "none");
		$("#printPreview").css("display", "none");
		$("#next").css("display", "none");
		$("#previous").css("display", "none");
		$("#backToHarness").css("display", "none");
		$("#toggleActionFilterBtn").closest(".switch").css("display", "none");
				
		$("#offcanvasCloseButton").click();

		document.getElementById("masterHeading").innerText = "";
		$("#masterHeading").append("APPLICATOR DASHBOARD");

		var child1 = document.getElementById("div3");
		child1.remove();
		var child2 = document.getElementById("div4");
		if (child2) {
			child2.remove();
		}

		var div3 = document.createElement("div");
		$("#div2").append(div3);

		div3.setAttribute("id", "div3");
		div3.setAttribute("class", "masterBody grid-container");
		var response = getAllApplicatorLocation();

		var numberOfMachines = response.length;


		for (var i = 0; i <= numberOfMachines - 1; i++) {
			var machineDiv = document.createElement("div");
			machineDiv.setAttribute("id", "machineDiv" + i);
			machineDiv.setAttribute("class", "machineDiv2");
			div3.append(machineDiv);
		}

		buildMachineApplicatorBlocks(numberOfMachines);

	});
});


function buildMachineApplicatorBlocks(numberOfMachines) {
	var response = getAllApplicatorLocation();


	for (var i = 0; i < numberOfMachines; i++) {
		var pairs = response[i].split(', ');

		var applicatorNumber = pairs[0].split(": ")[1];
		var childpartnumber = pairs[1].split(": ")[1];
		var pendingLife = parseInt(pairs[3].split(": ")[1]);
		var totalLife = parseInt(pairs[2].split(": ")[1]);
		var currentStatus = parseInt(pairs[4].split(": ")[1]);
		var lastrunningdate = pairs[6].split(": ")[1];
		var machinename = pairs[7].split(": ")[1];
		var status = pairs[5].split(": ")[1];


		console.log("childpartnumber", childpartnumber);

		console.log("totalLife", totalLife);

		console.log("machine:", machinename);
		console.log("status:", status);


		var element1 = document.createElement("table");
		element1.setAttribute("id", "machineTable" + i);
		element1.setAttribute("cellspacing", "0px");
		element1.setAttribute("class", "machineTable");
		element1.setAttribute("style", "width:100%;height:50%;");
		$("#machineTable" + i).remove();
		$("#machineDiv" + i).append(element1);

		var element1_1 = document.createElement("thead");
		element1_1.setAttribute("style", "width:100%;");

		var element1_2 = document.createElement("tr");
		element1_2.setAttribute("style", "width:100%");
		element1_1.append(element1_2);

		element1_2.setAttribute("id", "machineTableBody" + i);

		element1.append(element1_1);

		var element2 = document.createElement("th");
		element2.innerText = machinename;
		element2.setAttribute("colspan", "2");
		element2.setAttribute("class", "machineNameHead2");
		element1_2.append(element2);

		var element1_3 = document.createElement("tbody");
		element1.append(element1_3);

		var footer = document.createElement("tfoot");
		footer.setAttribute("style", "width:100%;");
		element1.append(footer);

		var footRow = document.createElement("tr");
		footRow.setAttribute("class", "machineStatusRow");
		var td3 = document.createElement("td");
		td3.setAttribute("colspan", "2");

		var progressValue = 100 - (pendingLife / totalLife) * 100;
		progressValue = Math.max(0, Math.min(progressValue, 100));


		/*    var progressBarColor = '';
			if (status === 'green') {
				progressBarColor = 'bg-success'; 
			} else if (status === 'yellow') {
				progressBarColor = 'bg-warning';
			} else if (status === 'red') {
				progressBarColor = 'bg-danger'; 
			} else {
				progressBarColor = 'bg-info'; 
			}*/
		var progressBarColor = '';
		if (status === 'green') {
			progressBarColor = 'green';
			color = 'white';
		} else if (status === 'yellow') {
			progressBarColor = 'yellow';
			color = 'black';
		} else if (status === 'red') {
			progressBarColor = 'red';
			color = 'black';
		} else {
			progressBarColor = 'bg-info';
		}

		/*        var progressBarHTML = '<div class="progress" style="height:40px;font-size:13px; position: relative;border-radius:0px">' + 
									  '<div class="progress-bar ' + progressBarColor + '" role="progressbar" ' +
									  'style="width: ' + progressValue + '%; height: 100%;" aria-valuenow="' + 
									  progressValue + '" aria-valuemin="0" aria-valuemax="100"></div>' +
									  '<span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);' +
									  'white-space: nowrap;">' + pendingLife + '/' + totalLife + '</span></div>'
									  '<div style"height:40px; font-size:15px; background-color:'+ progressBarColor+'">'+ pendingLife +'</div>'*/


		var progressBarHTML = '<div style="height:40px; font-size:15px; background-color:' + progressBarColor + '; text-align:center; font-weight:bold;"><span style="display: inline-block; line-height: 40px;top:-50px; color:' + color + ';">' + pendingLife + '</span></div>';

		var list = ["Applicator", applicatorNumber, "ChildPart", childpartnumber, "Total Life", totalLife, "Pending Shot", progressBarHTML];

		for (var j = 0; j < list.length - 1; j += 2) {
			var row = '<tr class="tableDataRows2"><td class="Applicator">' + list[j] + '</td><td class="ChildPart">' + list[j + 1] + '</td></tr>';
			element1_3.innerHTML += row;
		}

		/*   var rowspanCell = document.createElement("td");
		   rowspanCell.setAttribute("rowspan", "2");
		   rowspanCell.innerHTML = "Bal. Life (Pending/TotalLife)";
		   footRow.appendChild(rowspanCell);
   
		   var progressBarCell = document.createElement("td");
		   progressBarCell.innerHTML = progressBarHTML;
		   footRow.appendChild(progressBarCell);*/

		//footer.appendChild(footRow);
	}
}




function getAllApplicatorLocation() {
	var response = "";
	$.ajax({
		url: "/WebApplication/fg/alllifedetaildashboard",
		type: 'GET',
		contentType: "application/json",
		async: false,
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		dataType: 'json',
		success: function(res) {

			response = res;
		}, error: function(e) {
			response = e.responseText;
		}
	});
	return response;
}



$(document).ready(function() {

	$(document).on('click', '#lpcMpcrAssemblyReport', function() {

		searchLoad = false; clearInterval(interval);

		$(".fromTo").css("display", "block");
		$("#excelDownload").css("display", "block");
		$("#pageSelect").css("display", "block");
		$("#printPreview").css("display", "none");
		$("#next").css("display", "block");
		$("#previous").css("display", "block");
		$("#backToHarness").css("display", "none");
		$("#toggleActionFilterBtn").closest(".switch").css("display", "none");
				
		$("#offcanvasCloseButton").click();

		var child1 = document.getElementById("div3");
		var child2 = document.getElementById("div4");

		child1.remove();
		if (child2) { child2.remove(); }

		document.getElementById("masterHeading").innerText = "";
		$("#masterHeading").append("WORK IN PROGRESS REPORT");

		var div3 = document.createElement("div");
		var div4 = document.createElement("div");

		$("#div2").append(div3, div4);

		div3.setAttribute("id", "div3");
		div3.setAttribute("class", "masterBody emptyContainer");

		div4.setAttribute("id", "div4");
		div4.setAttribute("class", "masterBody");
		div4.setAttribute("Style", "overflow-y:scroll; display:none;");

		var bottom = document.createElement("div");

		bottom.setAttribute("id", "bottom");

		$("#div4").append(bottom);

		var element1 = document.createElement("table");
		$("#div3").append(element1);
		element1.setAttribute("id", "table1");
		element1.setAttribute("cellspacing", "0px");
		element1.setAttribute("class", "table-hover");

		var w = window.innerWidth;

		if (w < 500) {
			element1.setAttribute("style", "width:300%;");
		} else if (w < 1100) {
			element1.setAttribute("style", "width:250%;");
		}
		else if (w < 1500) {
			element1.setAttribute("style", "width:100%;");
		} else if (w < 2000) {
			element1.setAttribute("style", "width:100%;");
		} else {
			element1.setAttribute("style", "width:120%;");
		}

		var element1_1 = document.createElement("thead");
		element1.append(element1_1);

		var element1_2 = document.createElement("tr");


		var element1_3 = document.createElement("tbody");
		element1.append(element1_3)
		element1_3.setAttribute("id", "tableBody");

		// search
		/*********************/


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

		var searchTitles = ["searchPartCode", "searchOrderNo", "searchCktNO"];

		for (var i = 0; i < searchTitles.length; i++) {
			var searchContainer = document.createElement("th");
			searchContainer.setAttribute("class", "tableheading");
			var searchinput = document.createElement("input");
			var list = document.createElement("datalist")
			searchinput.setAttribute("style", "width:100%;");
			searchinput.setAttribute("title", searchTitles[i]);
			searchinput.setAttribute("list", searchTitles[i]);
			list.setAttribute("id", searchTitles[i]);
			searchinput.setAttribute("class", "searchFilterClass inputs");
			searchContainer.append(searchinput, list);
			searchRow.append(searchContainer);
		}

		var searchContainer = document.createElement("th");
		searchContainer.setAttribute("class", "tableheading");
		var searchinput = document.createElement("select");
		searchinput.setAttribute("id", "searchStatus");
		searchinput.setAttribute("class", "searchFilterClass inputs");
		var opt1 = document.createElement("option");
		opt1.innerText = "All";
		opt1.setAttribute("value", "All");
		var opt2 = document.createElement("option");
		opt2.innerText = "QUALITY";
		opt2.setAttribute("value", "QUALITY");
		var opt3 = document.createElement("option");
		opt3.innerText = "SEMI AUTO";
		opt3.setAttribute("value", "LPC");
		var opt4 = document.createElement("option");
		opt4.innerText = "MPCR - IN";
		opt4.setAttribute("value", "MPCRIN");
		var opt5 = document.createElement("option");
		opt5.innerText = "MPCR - OUT";
		opt5.setAttribute("value", "MPCROUT");
		var opt6 = document.createElement("option");
		opt6.innerText = "ASSEMBLY";
		opt6.setAttribute("value", "ASSEMBLY");
		searchinput.append(opt1, opt2, opt3, opt4, opt5, opt6);

		searchContainer.append(searchinput);
		searchRow.append(searchContainer);

		element1_1.append(searchRow);
		element1_1.append(element1_2);


		var element2 = document.createElement("th");
		element2.innerText = "S.No.";
		var element3 = document.createElement("th");
		element3.innerText = "Part Code";
		var element3_2 = document.createElement("th");
		element3_2.innerText = "Order No.";
		var element4 = document.createElement("th");
		element4.innerText = "CKT No.";
		var element5 = document.createElement("th");
		element5.innerText = "Location";
		var element5_1 = document.createElement("th");
		element5_1.innerText = "Quantity";
		var element6 = document.createElement("th");
		element6.innerText = "Lot Size";
		var element6_3 = document.createElement("th");
		element6_3.innerText = "Date Time";
		/*	var element7 = document.createElement("th");
			element7.innerText = "Wire Desc";
			var element8 = document.createElement("th");
			element8.innerText = "Ter. A";
			var element8_2 = document.createElement("th");
			element8_2.innerText = "Ter. A Desc";
			var element9 = document.createElement("th");
			element9.innerText = "Ter. B";
			var element10 = document.createElement("th");
			element10.innerText = "Ter. B Desc";
			var element11 = document.createElement("th");
			element11.innerText = "Seal A";
			var element12 = document.createElement("th");
			element12.innerText = "Seal A Desc";
			var element13 = document.createElement("th");
			element13.innerText = "Seal B";
			var element14 = document.createElement("th");
			element14.innerText = "Seal B Desc";*/


		element1_2.append(element2, element3, element3_2, element4, element5, element5_1, element6, element6_3);
		element2.setAttribute("class", "tableheading");
		// element2.setAttribute("scope","col");
		element3.setAttribute("class", "tableheading");
		// element3.setAttribute("scope","col");
		element3_2.setAttribute("class", "tableheading");
		// element3.setAttribute("scope","col");
		element4.setAttribute("class", "tableheading");
		// element4.setAttribute("scope","col");
		element5.setAttribute("class", "tableheading");
		element5_1.setAttribute("class", "tableheading");
		// element5.setAttribute("scope","col");
		element6.setAttribute("class", "tableheading");;
		// element6.setAttribute("scope","col");
		element6_3.setAttribute("class", "tableheading");
		// element6_3.setAttribute("scope","col");
		/*element7.setAttribute("class", "tableheading");
		// element7.setAttribute("scope","col");
		element8.setAttribute("class", "tableheading");
		element8_2.setAttribute("class", "tableheading");
		// element8.setAttribute("scope","col");
		element9.setAttribute("class", "tableheading");
		// element9.setAttribute("scope","col");
		element10.setAttribute("class", "tableheading");
		// element9.setAttribute("scope","col");
		element11.setAttribute("class", "tableheading");
		// element9.setAttribute("scope","col");
		element12.setAttribute("class", "tableheading");
		// element9.setAttribute("scope","col");
		element13.setAttribute("class", "tableheading");
		// element9.setAttribute("scope","col");
		element14.setAttribute("class", "tableheading");*/
		// element9.setAttribute("scope","col");

		var element18_2 = document.createElement("div");
		element18_2.setAttribute("class", "buttonsContainer");

		var element41 = document.createElement("div");
		element41.setAttribute("class", "buttonsContainer");

		var element44 = document.createElement("button");
		element44.setAttribute("class", "data");
		element44.setAttribute("title", "Excel Download");

		element41.append(element44);
		element18_2.append(element41);

		$("#bottom").append(element18_2);
		$("#pageSelect").empty();
		getCurrentDate();
		getAllPartCodeInList();

	});

});



function loadLpcMpcrAssemblyData(page) {

	searchLoad = true;

	var partCode = $('input[title="searchPartCode"]').val() ?? '';
	var batchCode = $('input[title="searchOrderNo"]').val() ?? '';
	var circuitNumber = $('input[title="searchCktNO"]').val() ?? '';
	var from = $("input[name=from]").val();
	var to = $("input[name=to]").val();
	var passingStatus = $('#searchStatus :selected').val();

	if (!from && !to) {
		alert("Please select date to get Work In progress report.");
		return;
	}

	if (partCode == "" && circuitNumber == "" && batchCode == "" && !from && !to) {
		$("#lpcMpcrAssemblyReport").click();
		return;
	}

	$("#loadingBackdropButton").click();
	$("#loadingBackdropModalMessage").text("Getting WIP Report.");

	var formData = {
		batchNumber: partCode,
		circuitNumber: circuitNumber,
		batchCode: batchCode,
		passingStatus: passingStatus,
		dateTime: from + "," + to,
	}



	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getLpcMpcrAndAssemblyReport/' + page,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {



			makePager(res.totalPages, page)
			insertLPCMPCRAssemblyInTable(res.content, page + 1);
			$("#div3").removeClass("emptyContainer");
			setTimeout(function() {
				$("#loadingBackdropButton").click();
			}, 500);
		},
		error: function(response) {

			setTimeout(function() {
				$("#loadingBackdropButton").click();
				alert(response.responseText);
			}, 500);

		}
	});
}

function getLocationByStatus(quality, location, planDate) {

	var color = getColorByTime(planDate)

	if (quality == "1" && location == "4") {

		return '<td style="' + color + '">ASSEMBLY IN</td>';

	} else if (quality == "1" && location == "3") {

		return '<td style="' + color + '">MPCR OUT</td>';

	} else if (quality == "1" && location == "2") {

		return '<td style="' + color + '">MPCR IN</td>';

	} else if (quality == "1" && location == "1") {

		return '<td style="' + color + '">LPC OUT</td>';

	} else if (quality == "1" && location == "0") {

		return '<td style="' + color + '">LPC & Q.A PASSED</td>';

	} else if (quality == "0" && location == "0") {

		return '<td style="' + color + '">QUALITY PENDING</td>';

	}
}


function getColorByTime(planDate) {

	var color;
	var location = $('#searchStatus :selected').val();

	// Convert strings to Date objects
	const date1 = new Date(planDate);
	const date2 = new Date(curretDate);

	// Calculate the time difference in milliseconds
	const timeDifference = date2 - date1;

	const hours = Math.floor(timeDifference / (1000 * 60 * 60));
	const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);



	if (location == "LPC") {
		if (hours > 48) {
			color = "background-color:red; color:white;";
		} else if (hours > 24 && hours < 48) {
			color = "background-color:yellow;";
		} else {
			color = "background-color:limegreen; color:white;";
		}
	} else if (location == "MPCRIN") {

		if (hours > 72) {
			color = "background-color:red; color:white;";
		} else if (hours > 24 && hours < 72) {
			color = "background-color:yellow;";
		} else {
			color = "background-color:limegreen; color:white;";
		}

	} else if (location == "MPCROUT") {

		if (hours > 96) {
			color = "background-color:red; color:white;";
		} else if (hours > 48 && hours < 96) {
			color = "background-color:yellow;";
		} else {
			color = "background-color:limegreen; color:white;";
		}
	} else if (location == "ASSEMBLY") {
		color = "background-color:limeGreen; color:white;";
		/*if (hours > 48) {
			
		} else if (hours > 24 && hours < 48) {
			color = "background-color:limeGreen;";
		} else {
			color = "background-color:limegreen; color:white;";
		}*/
	} else {
		if (hours > 48) {
			color = "background-color:red; color:white;";
		} else if (hours > 24 && hours < 48) {
			color = "background-color:yellow;";
		} else {
			color = "background-color:limegreen; color:white;";
		}
	}
	return color;
}



function insertLPCMPCRAssemblyInTable(res, page) {
	$("#tableBody").remove();

	var tablebody = document.createElement("tbody");
	$("#table1").append(tablebody);
	tablebody.setAttribute("id", "tableBody");

	var sequenceNumber = pageSize * parseInt($('#pageSelect :selected').val());

	for (var i = 0; i < res.length; i++) {
		var str = res[i];
		var value = str.split(',');
		/*var colorStatus = getColorAndStringByStatus(value[])*/
		var location = getLocationByStatus(value[7], value[8], value[10]);

		var row = '<tr class="tableDataRows"><td data-column="columnId" style="width:70px;">' + (sequenceNumber + 1) + '</td>'
			+ '<td data-column="partCode">' + (value[1] == null ? '' : value[1]) + '</td>' + '<td data-column="batchCode">'
			+ (value[2] == null ? '' : value[2]) + '</td>' + '<td data-column="circuitNumber">' + value[3] + '</td>'
			+ location + '<td data-column="quantity">' + (value[5] * value[11]) + '</td>'
			+ '<td data-column="lotSize">' + (value[4] == null ? '' : value[4]) + '</td>' + '<td data-column="dateTime">' + (value[10] == null ? '' : value[10]) + '</td></tr>';
		$('#table1').append(row);
		sequenceNumber++;
	}
}




$(document).ready(function() {

	$(document).on('click', '#conveyorReport', function() {

		searchLoad = false; clearInterval(interval);


		$(".fromTo").css("display", "block");
		$("#excelDownload").css("display", "block");
		$("#pageSelect").css("display", "block");
		$("#printPreview").css("display", "none");
		$("#next").css("display", "block");
		$("#previous").css("display", "block");
		$("#backToHarness").css("display", "none");
		$("#toggleActionFilterBtn").closest(".switch").css("display", "none");
				
		$("#offcanvasCloseButton").click();

		var child1 = document.getElementById("div3");
		var child2 = document.getElementById("div4");

		child1.remove();
		if (child2) { child2.remove(); }

		document.getElementById("masterHeading").innerText = "";
		$("#masterHeading").append("CONVEYOR REPORT");

		var div3 = document.createElement("div");
		var div4 = document.createElement("div");

		$("#div2").append(div3, div4);

		div3.setAttribute("id", "div3");
		div3.setAttribute("class", "masterBody emptyContainer");

		div4.setAttribute("id", "div4");
		div4.setAttribute("class", "masterBody");
		div4.setAttribute("Style", "overflow-y:scroll; display:none;");

		var bottom = document.createElement("div");

		bottom.setAttribute("id", "bottom");
		/*	bottom.setAttribute("style","height: 50%;")*/

		$("#div4").append(bottom);

		var element1 = document.createElement("table");
		$("#div3").append(element1);
		element1.setAttribute("id", "table1");
		element1.setAttribute("cellspacing", "0px");
		/*element1.setAttribute("cellpaddding","10px");*/
		element1.setAttribute("class", "table-hover");

		var w = window.innerWidth;

		if (w < 500) {
			element1.setAttribute("style", "width:300%;");
		} else if (w < 1100) {
			element1.setAttribute("style", "width:250%;");
		}
		else if (w < 1500) {
			element1.setAttribute("style", "width:100%;");
		} else if (w < 2000) {
			element1.setAttribute("style", "width:100%;");
		} else {
			element1.setAttribute("style", "width:120%;");
		}

		var element1_1 = document.createElement("thead");
		element1.append(element1_1);

		var element1_2 = document.createElement("tr");


		var element1_3 = document.createElement("tbody");
		element1.append(element1_3)
		element1_3.setAttribute("id", "tableBody");

		// search
		/*********************/


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


		var searchTitles = ["searchLineNo", "searchMindaPart", "searchCustomerPart"];

		for (var i = 0; i < searchTitles.length; i++) {

			if (searchTitles[i] == "") {

				var searchContainer = document.createElement("th");
				searchContainer.setAttribute("class", "tableheading");
				searchRow.append(searchContainer);

			} else if (searchTitles[i] == "fromTo") {
				var th = document.createElement("th");
				th.setAttribute("class", "tableheading");
				th.setAttribute("style", "max-width:100px;");


				var th2 = document.createElement("th");
				th2.setAttribute("class", "tableheading");
				th2.setAttribute("style", "max-width:100px;");

				var input = document.createElement("input");
				input.setAttribute("type", "date");
				input.setAttribute("style", "width:100%; font-size:12px;");
				input.setAttribute("name", "from");
				input.setAttribute("class", "searchFilterClass");
				th.append(input);

				var input2 = document.createElement("input");
				input2.setAttribute("type", "date");
				input2.setAttribute("style", "width:100%;font-size:12px;");
				input2.setAttribute("name", "to");
				input2.setAttribute("class", "searchFilterClass");
				th2.append(input2);

				searchRow.append(th, th2);

			} else {
				var dataList = document.createElement("datalist");
				var searchContainer = document.createElement("th");
				searchContainer.setAttribute("class", "tableheading");
				var searchinput = document.createElement("input");
				searchinput.setAttribute("style", "width:100%;");
				searchinput.setAttribute("title", searchTitles[i]);
				searchinput.setAttribute("list", searchTitles[i]);
				searchinput.setAttribute("class", "searchFilterClass inputs");
				searchContainer.append(searchinput, dataList);

				var dataListAttr = ["id", searchTitles[i]];
				for (var j = 0; j <= dataListAttr.length - 1; j = j + 2) {
					for (var k = 0; k <= j; k = k + 2) {
						dataList.setAttribute(dataListAttr[j], dataListAttr[k + 1]);

					}
				}

				searchRow.append(searchContainer);
			}
		}

		element1_1.append(searchRow);
		element1_1.append(element1_2);


		var element2 = document.createElement("th");
		element2.innerText = "S.No.";
		var element3 = document.createElement("th");
		element3.innerText = "Line No.";
		var element3_2 = document.createElement("th");
		element3_2.innerText = "Minda Part";
		var element4 = document.createElement("th");
		element4.innerText = "C. Part";
		var element5 = document.createElement("th");
		element5.innerText = "Model";
		var element5_1 = document.createElement("th");
		element5_1.innerText = "Conv. O/P";
		var element6 = document.createElement("th");
		element6.innerText = "CKT O/P ";
		var element6_3 = document.createElement("th");
		element6_3.innerText = "Packing";
		var element7 = document.createElement("th");
		element7.innerText = "Plan";
		var element8 = document.createElement("th");
		element8.innerText = "Eff";
		var element8_2 = document.createElement("th");
		element8_2.innerText = "1st H";
		var element9 = document.createElement("th");
		element9.innerText = "1st Hour";
		var element10 = document.createElement("th");
		element10.innerText = "Total Time";
		var element10_2 = document.createElement("th");
		element10_2.innerText = "Run Time";
		var element11 = document.createElement("th");
		element11.innerText = "Stop Time";
		var element12 = document.createElement("th");
		element12.innerText = "Date Time";
		/*	var element13 = document.createElement("th");
			element13.innerText = "Seal B";
			var element14 = document.createElement("th");
			element14.innerText = "Seal B Desc";*/


		element1_2.append(element2, element3, element3_2, element4, element5, element5_1, element6, element6_3, element7, element8, element9, element10, element10_2, element11, element12);
		element2.setAttribute("class", "tableheading");
		// element2.setAttribute("scope","col");
		element3.setAttribute("class", "tableheading");
		// element3.setAttribute("scope","col");
		element3_2.setAttribute("class", "tableheading");
		// element3.setAttribute("scope","col");
		element4.setAttribute("class", "tableheading");
		// element4.setAttribute("scope","col");
		element5.setAttribute("class", "tableheading");
		element5_1.setAttribute("class", "tableheading");
		// element5.setAttribute("scope","col");
		element6.setAttribute("class", "tableheading");;
		// element6.setAttribute("scope","col");
		element6_3.setAttribute("class", "tableheading");
		// element6_3.setAttribute("scope","col");
		element7.setAttribute("class", "tableheading");
		// element7.setAttribute("scope","col");
		element8.setAttribute("class", "tableheading");
		element8_2.setAttribute("class", "tableheading");
		// element8.setAttribute("scope","col");
		element9.setAttribute("class", "tableheading");
		// element9.setAttribute("scope","col");
		element10.setAttribute("class", "tableheading");
		// element9.setAttribute("scope","col");
		element10_2.setAttribute("class", "tableheading");
		// element9.setAttribute("scope","col");
		element11.setAttribute("class", "tableheading");
		// element9.setAttribute("scope","col");
		element12.setAttribute("class", "tableheading");

		var element18_2 = document.createElement("div");
		element18_2.setAttribute("class", "buttonsContainer");

		var element41 = document.createElement("div");
		element41.setAttribute("class", "buttonsContainer");

		var element44 = document.createElement("button");
		element44.setAttribute("class", "data");
		element44.setAttribute("title", "Excel Download");

		element41.append(element44);
		element18_2.append(element41);

		$("#pageSelect").empty();

	});

});



function loadConveyorData(page) {


	searchLoad = true;

	var lineNumber = $('input[title="searchLineNo"]').val() ?? '';
	var mindaPart = $('input[title="searchMindaPart"]').val() ?? '';
	var customerPart = $('input[title="searchCustomerPart"]').val() ?? '';
	var from = $("input[name=from]").val();
	var to = $("input[name=to]").val();

	if (!from && !to) {
		alert("Please select date to get date wise ckt plan report.");
		return;
	}

	if (lineNumber == "" && mindaPart == "" && customerPart == "" && !from && !to) {
		$("#conveyorReport").click();
		return;
	}


	$("#loadingBackdropButton").click();
	$("#loadingBackdropModalMessage").text("Getting Conveyor Report.");

	var formData = {
		lineNumber: lineNumber,
		mindaPart: mindaPart,
		customerPart: customerPart,
		shiftStartTime: from + "," + to,
	}

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/getConveyorReport/' + page,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(res) {

			makePager(res.totalPages, page)
			insertConveyorReportInTable(res.content, page + 1);
			$("#div3").removeClass("emptyContainer");
			setTimeout(function() {
				$("#loadingBackdropButton").click();
			}, 500);
		},
		error: function(response) {

			setTimeout(function() {
				$("#loadingBackdropButton").click();
				alert(response.responseText);
			}, 500);

		}
	});
}

function insertConveyorReportInTable($item, page) {
	$("#tableBody").remove();

	var tablebody = document.createElement("tbody");
	$("#table1").append(tablebody);
	tablebody.setAttribute("id", "tableBody");

	var sequenceNumber = pageSize * parseInt($('#pageSelect :selected').val());

	$.each($item, function(index, value) {
		var runTimeDifference = getTotalRunTime(value.shiftStartTime, value.shiftEndTime, value.breakdownTime);
		var totalTimeDifference = getTotalTime(value.shiftStartTime, value.shiftEndTime);
		var firstHour = geColorByProduceAndActual(value.firstHour);

		var row = '<tr class="tableDataRows"><td data-column="columnId" style="width:70px; max-width:70px;">' + (sequenceNumber + 1) + '</td>'
			+ '<td data-column="lineNumber">' + (value.lineNumber == null ? '' : value.lineNumber) + '</td>'
			+ '<td data-column="mindaPart" style="width:200px;">' + (value.mindaPart == null ? '' : value.mindaPart) + '</td>'
			+ '<td data-column="customerPart" style="width:200px;">' + value.customerPart + '</td>'
			+ '<td data-column="model">' + (value.model == null ? '' : value.model)
			+ '</td><td data-column="conveyorCount">' + (value.conveyorCount == null ? '' : value.conveyorCount) + '</td>'
			+ '<td data-column="circuitTestingOk">' + (value.circuitTestingOk == null ? '' : value.circuitTestingOk) + '</td>'
			+ '<td data-column="packing">' + (value.packing == null ? '' : value.packing) + '</td>'
			+ '<td data-column="lotSize" style="width:50px;">' + (value.lotSize == null ? '' : value.lotSize) + '</td>'
			+ '<td data-column="efficiency" style="width:50px;">' + Math.floor(value.packing / value.lotSize * 100) + ' %</td>'
			+ firstHour
			+ '<td data-column="totalTime" style="text-align:left; padding-left:10px;">' + totalTimeDifference + '</td>'
			+ '<td data-column="runTime" style="text-align:left; padding-left:10px;">' + runTimeDifference + '</td>'
			+ '<td data-column="breakdownTime" style="text-align:left; padding-left:10px;">' + (Math.floor(value.breakdownTime / 60) + "H /" + Math.floor(value.breakdownTime % 60) + "M") + '</td>'
			+ '<td data-column="value.shiftStartTime" style="width:200px;">' + (value.shiftStartTime == null ? '' : value.shiftStartTime) + '</td></tr>';
		$('#table1').append(row);
		sequenceNumber++;
	});
}


function geColorByProduceAndActual(firstHour) {

	if (firstHour == null || firstHour == "") {
		return '<td data-column="firstHour">' + (firstHour == null ? '' : firstHour) + '</td>';
	} else {
		var list = firstHour.split("/");
		var percentage = parseInt(list[0]) / parseInt(list[1]) * 100;

		if (percentage >= 80) {

			return '<td data-column="firstHour" style="background-color:limegreen; color:white; width:50px;">' + (firstHour == null ? '' : firstHour) + '</td>';

		} else if (percentage < 80 && percentage >= 60) {

			return '<td data-column="firstHour" style="background-color:yellow; ; width:50px;">' + (firstHour == null ? '' : firstHour) + '</td>';

		} else if (percentage < 60 && percentage >= 0) {

			return '<td data-column="firstHour" style="background-color:red; color:white; ; width:50px;">' + (firstHour == null ? '' : firstHour) + '</td>';

		} else {
			return '<td data-column="firstHour" style="background-color:red; width:50px;">' + (firstHour == null ? '' : firstHour) + '</td>';
		}
	}
}

function rgbToHex(r, g, b) {
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function hexToRgb(hex) {
	hex = hex.replace(/^#/, '');
	var r = parseInt(hex.substring(0, 2), 16);
	var g = parseInt(hex.substring(2, 4), 16);
	var b = parseInt(hex.substring(4, 6), 16);

	return r + "," + g + "," + b;
}



$(document).ready(function() {

	$(document).on('click', '#iotDashboardLpcSection', function() {

		searchLoad = false; clearInterval(interval);

		$(".fromTo").css("display", "none");
		$("#excelDownload").css("display", "block");
		$("#pageSelect").css("display", "none");
		$("#printPreview").css("display", "none");
		$("#next").css("display", "none");
		$("#previous").css("display", "none");
		$("#backToHarness").css("display", "none");
		$("#toggleActionFilterBtn").closest(".switch").css("display", "none");
				
		$("#offcanvasCloseButton").click();

		try {
			var child1 = document.getElementById("div3");
			var child2 = document.getElementById("div4");
			child2.remove();
			child1.remove();
		} catch (err) {
			var child1 = document.getElementById("div3");
			child1.remove();
		}

		document.getElementById("masterHeading").innerText = "";
		$("#masterHeading").append("IOT DASHBOARD - LPC SECTION");

		var div3 = document.createElement("div");
		var div6 = document.createElement("div");

		$("#div2").append(div3);
		div3.append(div6);

		div3.setAttribute("id", "div3");
		div3.setAttribute("class", "masterBody");

		var from = document.createElement("input");
		var to = document.createElement("input");
		var machine = document.createElement("input");
		var target = document.createElement("input");
		var actual = document.createElement("input");
		var targetLine = document.createElement("input");
		var targetBar = document.createElement("input");
		var actualLine = document.createElement("input");
		var actualBar = document.createElement("input");
		var lineLabel1 = document.createElement("label");
		var barlabel1 = document.createElement("label");
		var lineLabel2 = document.createElement("label");
		var barlabel2 = document.createElement("label");
		var div1 = document.createElement("div");
		var div2 = document.createElement("div");
		var div4 = document.createElement("div");
		var div5 = document.createElement("div");
		var machineList = document.createElement("datalist");
		var img = document.createElement("img");
		img.setAttribute("src", "/WebApplication/images/searchFilter.png");
		img.setAttribute("id", "searchButton");
		img.setAttribute("width", "22");
		img.setAttribute("height", "22");

		var table = document.createElement("table");
		table.setAttribute("style", "width:100%;color:white;");
		var thead = document.createElement("thead");
		var tr = document.createElement("tr");
		var td1 = document.createElement("th");
		td1.setAttribute("class", "tableheading");
		td1.innerText = "FROM :";
		var td2 = document.createElement("th");
		td2.setAttribute("class", "tableheading");
		td2.append(from);
		var td3 = document.createElement("th");
		td3.setAttribute("class", "tableheading");
		td3.innerText = "TO :";
		var td4 = document.createElement("th");
		td4.setAttribute("class", "tableheading");
		td4.append(to);
		var td5 = document.createElement("th");
		td5.setAttribute("class", "tableheading");
		td5.innerText = "Machine :";
		var td6 = document.createElement("th");
		td6.setAttribute("class", "tableheading");
		td6.append(machine, machineList);
		var td7 = document.createElement("th");
		td7.setAttribute("style", "width:50px;");
		td7.setAttribute("class", "tableheading");
		td7.append(img);
		var td8 = document.createElement("th");
		td8.setAttribute("class", "tableheading");
		td8.innerText = "Target :";
		var td9 = document.createElement("th");
		td9.setAttribute("style", "width:200px;");
		td9.setAttribute("class", "tableheading");
		td9.append(target, div1, div2);
		var td10 = document.createElement("th");
		td10.setAttribute("class", "tableheading");
		td10.innerText = "Actual :";
		var td11 = document.createElement("th");
		td11.setAttribute("class", "tableheading");
		td11.setAttribute("style", "width:200px;");
		td11.append(actual, div4, div5);

		lineLabel1.innerText = "Line";
		div1.append(lineLabel1, targetLine);
		div1.setAttribute("style", "width:60px; float:left;");
		barlabel1.innerText = "Bar";
		div2.append(barlabel1, targetBar);
		div2.setAttribute("style", "width:60px; float:left;");



		lineLabel2.innerText = "Line";
		div4.append(lineLabel2, actualLine);
		div4.setAttribute("style", "width:60px; float:left;");
		barlabel2.innerText = "Bar";
		div5.append(barlabel2, actualBar);
		div5.setAttribute("style", "width:60px; float:left;");


		var fromAttr = ["type", "date", "id", "fromm", "class", "inputs", "autocomplete", "off", "name", "fromm"];

		for (var i = 0; i <= fromAttr.length - 1; i = i + 2) {
			for (var j = 0; j <= i; j = j + 2) {
				from.setAttribute(fromAttr[i], fromAttr[j + 1]);

			}
		}

		var toAttr = ["type", "date", "id", "too", "class", "inputs", "autocomplete", "off", "name", "too"];

		for (var i = 0; i <= toAttr.length - 1; i = i + 2) {
			for (var j = 0; j <= i; j = j + 2) {
				to.setAttribute(toAttr[i], toAttr[j + 1]);

			}
		}

		var machineAttr = ["type", "text", "placeholder", "Select", "id", "machineNo", "class", "inputs", "autocomplete", "off", "name", "machineNumber", "list", "machineList"];

		for (var i = 0; i <= machineAttr.length - 1; i = i + 2) {
			for (var j = 0; j <= i; j = j + 2) {
				machine.setAttribute(machineAttr[i], machineAttr[j + 1]);

			}
		}

		var machineListAttr = ["id", "machineList"];

		for (var i = 0; i <= machineListAttr.length - 1; i = i + 2) {
			for (var j = 0; j <= i; j = j + 2) {
				machineList.setAttribute(machineListAttr[i], machineListAttr[j + 1]);

			}
		}

		var actualLineAttr = ["type", "radio", "id", "actualLine", "class", "inputss", "name", "actual", "style", "margin-left:10px;margin-top:5px;", "value", "line"];

		for (var i = 0; i <= actualLineAttr.length - 1; i = i + 2) {
			for (var j = 0; j <= i; j = j + 2) {
				actualLine.setAttribute(actualLineAttr[i], actualLineAttr[j + 1]);

			}
		}

		var actualBarAttr = ["type", "radio", "id", "actualBar", "class", "inputss", "name", "actual", "style", "margin-left:10px;margin-top:5px;", "value", "bar"];

		for (var i = 0; i <= actualBarAttr.length - 1; i = i + 2) {
			for (var j = 0; j <= i; j = j + 2) {
				actualBar.setAttribute(actualBarAttr[i], actualBarAttr[j + 1]);

			}
		}

		var targetLineAttr = ["type", "radio", "id", "targetLine", "class", "inputss", "name", "target", "style", "margin-left:10px;margin-top:5px;", "value", "line"];

		for (var i = 0; i <= targetLineAttr.length - 1; i = i + 2) {
			for (var j = 0; j <= i; j = j + 2) {
				targetLine.setAttribute(targetLineAttr[i], targetLineAttr[j + 1]);

			}
		}

		var targetBarAttr = ["type", "radio", "id", "targetBar", "class", "inputss", "name", "target", "style", "margin-left:10px;margin-top:5px;", "value", "bar"];

		for (var i = 0; i <= targetBarAttr.length - 1; i = i + 2) {
			for (var j = 0; j <= i; j = j + 2) {
				targetBar.setAttribute(targetBarAttr[i], targetBarAttr[j + 1]);

			}
		}

		var targetList = targetColor.match(/\b\d+\b/g);
		var actualList = actualColor.match(/\b\d+\b/g);

		var targetC = rgbToHex(parseInt(targetList[0]), parseInt(targetList[1]), parseInt(targetList[2]));
		var actualC = rgbToHex(parseInt(actualList[0]), parseInt(actualList[1]), parseInt(actualList[2]));


		var targetAttr = ["type", "color", "id", "targetNo", "name", "targetNumber", "value", targetC];

		for (var i = 0; i <= targetAttr.length - 1; i = i + 2) {
			for (var j = 0; j <= i; j = j + 2) {
				target.setAttribute(targetAttr[i], targetAttr[j + 1]);

			}
		}
		var actualAttr = ["type", "color", "id", "actualNo", "name", "actualNumber", "value", actualC];

		for (var i = 0; i <= actualAttr.length - 1; i = i + 2) {
			for (var j = 0; j <= i; j = j + 2) {
				actual.setAttribute(actualAttr[i], actualAttr[j + 1]);

			}
		}


		div6.append(table)
		table.append(thead);
		thead.append(tr);
		tr.append(td7, td1, td2, td3, td4, td5, td6, td8, td9, td10, td11);


		graphName = []
		loadReportsNameAndId();
		machinePrinted = Math.ceil(graphName.length / 2);


		for (var i = 0; i <= Math.ceil((graphName.length / 2) / 3 - 1); i++) {
			var divId = "floatDivContainer" + (i + 1);

			var floatDivContainer = document.createElement("div");
			floatDivContainer.setAttribute("id", divId);
			floatDivContainer.setAttribute("class", "floatDivContainer");

			div3.append(floatDivContainer);

			if (machinePrinted < 3) {
				for (var j = 0; j < machinePrinted; j++) {

					var divId = "tableContainer" + (j + 1);

					var floatDiv = document.createElement("div");
					floatDiv.setAttribute("id", divId);
					floatDiv.setAttribute("class", "floatingLeaderDiv");
					floatDivContainer.append(floatDiv);


					var div1Class = "reportsNameContainer";
					var div2Class = "canvasContainer";

					var div1Id = "noData" + graphNameWithoutSpace[graphNameIndex];

					var div1 = document.createElement("div");
					var div2 = document.createElement("div");
					div1.setAttribute("style", "text-align:center");
					div1.setAttribute("class", div1Class);
					div1.setAttribute("id", div1Id);
					div2.setAttribute("id", div2Class + graphNameWithoutSpace[graphNameIndex])

					var heading = document.createElement("span");
					heading.innerText = graphName[graphNameIndex];
					heading.setAttribute("class", "heading3");
					div1.append(heading)

					var machineId = document.createElement("span");
					machineId.innerText = graphNameWithoutSpace[graphIdIndex];
					machineId.setAttribute("style", "display:none");
					div1.append(machineId)

					floatDiv.append(div1, div2);


					graphNameIndex = graphNameIndex + 2;
					graphIdIndex = graphIdIndex + 2;

				}
			} else {

				for (var j = 0; j < 3; j++) {

					var divId = "tableContainer" + (j + 1);

					var floatDiv = document.createElement("div");
					floatDiv.setAttribute("id", divId);
					floatDiv.setAttribute("class", "floatingLeaderDiv");
					floatDivContainer.append(floatDiv);


					var div1Class = "reportsNameContainer";
					var div2Class = "canvasContainer";

					var div1Id = "noData" + graphNameWithoutSpace[graphNameIndex];

					var div1 = document.createElement("div");
					var div2 = document.createElement("div");
					div1.setAttribute("style", "text-align:center");
					div1.setAttribute("class", div1Class);
					div1.setAttribute("id", div1Id);
					div2.setAttribute("id", div2Class + graphNameWithoutSpace[graphNameIndex])

					var heading = document.createElement("span");
					heading.innerText = graphName[graphNameIndex];
					heading.setAttribute("class", "heading3");
					div1.append(heading)

					var machineId = document.createElement("span");
					machineId.innerText = graphNameWithoutSpace[graphIdIndex];
					machineId.setAttribute("style", "display:none");
					div1.append(machineId)

					floatDiv.append(div1, div2);

					graphNameIndex = graphNameIndex + 2;
					graphIdIndex = graphIdIndex + 2;

				}

				machinePrinted = machinePrinted - 3;
			}
		}

		getCurrentDate();
		getAllMachinesInListforLpcDashboard();
		$("#targetLine").prop("checked", true);
		$("#actualBar").prop("checked", true);
		setTimeout(function() {
			loadIotDashboard();
		}, 500)



	});

});

$(document).on('change', '#targetNo', function(event) {

	var selectedColor = event.target.value;


	targetColor = 'rgba(' + hexToRgb(selectedColor) + ',1)';

	setTimeout(function() {
		$("#searchButton").click();
	}, 500);



});

$(document).on('change', '#actualNo', function(event) {

	var selectedColor = event.target.value;

	actualColor = 'rgba(' + hexToRgb(selectedColor) + ',0.5)';

	setTimeout(function() {
		$("#searchButton").click();
	}, 500);

});

function getAllMachinesInList() {
	$.ajax({
		url: "/WebApplication/Controllers/getAllMachinesInList",
		type: 'GET',
		contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		async: false,
		dataType: 'json',
		success: function(res) {
			for (var i = 0; i < res.length; i++) {
				var str = res[i];
				var id_machine = str.split(',');

				for (var j = 0; j < id_machine.length - 1; j++) {
					var row = '<option value="' + id_machine[j + 1] + '">';
					$('#machineList').append(row);
				}
			}
		}
	});
}
function getAllMachinesInListforLpcDashboard() {
	$.ajax({
		url: "/WebApplication/Controllers/getAllMachinesInList",
		type: 'GET',
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		async: false,
		dataType: 'json',
		success: function(res) {
			$('#machineList').append('<option value="ALL">ALL</option>');

			for (var i = 0; i < res.length; i++) {
				var str = res[i];
				var id_machine = str.split(',');

				for (var j = 0; j < id_machine.length - 1; j++) {
					var row = '<option value="' + id_machine[j + 1] + '">' + id_machine[j + 1] + '</option>';
					$('#machineList').append(row);
				}
			}
		}
	});
}




function loadIotDashboard() {

	var from = $("input[name=fromm]").val();
	var to = $("input[name=too]").val();
	var machineNumber = $("input[name=machineNumber]").val();
	var difference;


	if (!from || !to) {
		alert("Please select from and to date to get machine wise report.");
		return;
	}

	const startDate = new Date(from);
	const endDate = new Date(to);
	difference = dateDifference(startDate, endDate);
	loadDataByTimeDifference(difference);

}


function iotMachineDashboardDifferenceForExcel() {

	var from = $("input[name=fromm]").val();
	var to = $("input[name=too]").val();
	var difference;

	if (!from || !to) {
		alert("Please select from and to date to get excel report.");
		return;
	}

	const startDate = new Date(from);
	const endDate = new Date(to);
	difference = dateDifference(startDate, endDate);
	downloadExcelByTimeDifference(difference);

}


function downloadExcelByTimeDifference(difference) {

	var machineNumber = $("#machineNo").val();
	var from = $("input[name=fromm]").val();
	var to = $("input[name=too]").val();

	if (!from && !to) {
		alert("Please select date to get LPC section report.");
		return;
	}

	if (machineNumber == "" || !machineNumber) {
		machineNumber = "All";
	}

	$("#loadingBackdropButton").click();
	$("#loadingBackdropModalMessage").text("Getting LPC section report.");

	var formData = {
		machineName: machineNumber,
		graphName: graphName,
		from: from,
		to: to
	}

	if (!difference) {
		getGraphDataAverageAndDateWiseInExcel(formData);
	}
	else if (difference < 0) {
		alert("Selected From date is greater than To date pleaase check it.");
		return;
	} if (difference == 0) {
		getGraphDataAverageAndDateWiseInExcel(formData);
	}
	else if (difference <= 10) {

		getGraphDataAverageAndDateWiseInExcel(formData);

	} else if (difference > 10 && difference <= 30) {

		if (machineNumber == "All") {
			getGraphDataAverageAndDateWiseInExcel(formData);
		} else {
			getGraphDataWeeklyWiseInExcel(formData);
		}

	} else if (difference > 30) {

		if (machineNumber == "All") {
			getGraphDataAverageAndDateWiseInExcel(formData);
		} else {
			getGraphDataMonthlyWiseInExcel(formData);
		}
	}

}


function getGraphDataAverageAndDateWiseInExcel(formData) {

	fetch('/WebApplication/Controllers/getGraphDataAverageAndDateWiseInExcel', {
		method: 'POST',
		headers: {
			'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(formData)
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
			let currDateTime = new Date();
			link.download = 'LPC Dashboard report' + '.xlsx';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			setTimeout(function() {
				$("#loadingBackdropButton").click();
			}, 1000);
		})
		.catch(error => {
			console.error('Error:', error);
			setTimeout(function() {
				$("#loadingBackdropButton").click();
			}, 1000);
		});

}


function getGraphDataWeeklyWiseInExcel(formData) {

	fetch('/WebApplication/Controllers/getGraphDataWeeklyWiseInExcel', {
		method: 'POST',
		headers: {
			'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(formData)
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
			let currDateTime = new Date();
			link.download = 'LPC Dashboard report' + '.xlsx';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			setTimeout(function() {
				$("#loadingBackdropButton").click();
			}, 1000);
		})
		.catch(error => {
			console.error('Error:', error);
			setTimeout(function() {
				$("#loadingBackdropButton").click();
			}, 1000);
		});

}

function getGraphDataMonthlyWiseInExcel(formData) {

	fetch('/WebApplication/Controllers/getGraphDataMonthlyWiseInExcel', {
		method: 'POST',
		headers: {
			'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(formData)
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
			let currDateTime = new Date();
			link.download = 'LPC Dashboard report' + '.xlsx';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			setTimeout(function() {
				$("#loadingBackdropButton").click();
			}, 1000);
		})
		.catch(error => {
			console.error('Error:', error);
			setTimeout(function() {
				$("#loadingBackdropButton").click();
			}, 1000);
		});

}




function dateDifference(startDate, endDate) {

	const startMillis = startDate.getTime();
	const endMillis = endDate.getTime();

	const differenceMillis = endMillis - startMillis;

	const differenceDays = differenceMillis / (1000 * 3600 * 24);

	console.log(differenceDays);

	return differenceDays;
}

function loadDataByTimeDifference(difference) {

	$("#loadingBackdropButton").click();
	$("#loadingBackdropModalMessage").text("Getting LPC section report.");


	for (var i = 0; i < Math.ceil((graphName.length / 2)); i++) {

		var graphN = graphName[graphNameIndexForLoadTableData];
		var graphN2 = graphNameWithoutSpace[graphNameIndexForLoadTableData];

		var dateTime = $("input[name=too]").val();
		var from = $("input[name=fromm]").val();
		var to = $("input[name=too]").val();
		var machineNumber = $("input[name=machineNumber]").val();

		if (!difference) {

			loadMachineAverageAndDateWiseData(graphN, graphN2, from, to, difference);
		}
		else if (difference < 0) {

			alert("Selected From date is greater than To date pleaase check it.");
			return;

		} if (difference == 0) {

			loadMachineAverageAndDateWiseData(graphN, graphN2, from, to, difference);

		}
		else if (difference <= 10) {
			if (!machineNumber) {
				loadMachineAverageAndDateWiseData(graphN, graphN2, from, to, difference);
			} else if (machineNumber == "ALL") {
				console.log("okkk")
				loadAllMachineAverageAndDateWiseData(graphN, graphN2, from, to, difference);
			} else {
				loadMachineAverageAndDateWiseData(graphN, graphN2, from, to, difference);
			}


		} else if (difference > 10 && difference <= 30) {

			if (!machineNumber) {
				loadMachineAverageAndDateWiseData(graphN, graphN2, from, to, difference);
			} else if (machineNumber == "ALL") {
				loadAllMachineWeeklyWiseData(graphN, graphN2, from, to, difference);
			} else {
				loadMachineWeeklyWiseData(graphN, graphN2, from, to, difference);
			}


		} else if (difference > 30) {

			if (!machineNumber) {
				loadMachineAverageAndDateWiseData(graphN, graphN2, from, to, difference);
			} else if (machineNumber == "ALL") {
				loadallMachineWiseData(graphN, graphN2, from, to, difference);
			} else {
				loadMachineMonthlyWiseData(graphN, graphN2, from, to, difference);
			}
		}
		graphIdIndexForLoadTableData = graphIdIndexForLoadTableData + 2;
		graphNameIndexForLoadTableData = graphNameIndexForLoadTableData + 2

	}

	graphIdIndexForLoadTableData = 0;
	graphNameIndexForLoadTableData = 1;

	setTimeout(function() {
		$("#loadingBackdropButton").click();
	}, 1000);

}

function loadMachineAverageAndDateWiseData(graphN, graphN2, from, to, differene) {

	var formData = {};
	var machineNumber = $("input[name=machineNumber]").val();

	if (!machineNumber) {
		formData = {
			deviceNumber: 0,
			graphName: graphN,
			dateTime: from + "," + to
		};
	} else {
		formData = {
			deviceNumber: machineNumber,
			graphName: graphN,
			dateTime: from + "," + to
		};
	}

	$.ajax({
		type: 'POST',
		url: '/WebApplication/Controllers/getGraphDataDateWise',
		async: false,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			console.log(response);
			if (response.length == 0) {
				var divId = "#noData" + graphN2;
				$(divId).removeAttr("style");
				$(divId).attr("style", "text-align:center;background-color:red;color:white;")
			} else {
				var divId = "#noData" + graphN2;
				$(divId).removeAttr("style");
				$(divId).attr("style", "text-align:center;")

				if (machineNumber == 0) {
					insertAverageGraphData(response, graphN2);
				} else {
					insertDateGraphData(response, graphN2);
				}
			}

		}, error: function(response) {
			alert(response.responseText);


		}
	});
}
function loadAllMachineAverageAndDateWiseData(graphN, graphN2, from, to, differene) {
	var formData = {
		deviceNumber: "ALL",
		graphName: graphN,
		dateTime: from + "," + to
	};

	$.ajax({
		type: 'POST',
		url: '/WebApplication/Controllers/getAllGraphDataDateWise',
		async: false,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			if (!response || response.trim().length === 0) {
				var divId = "#noData" + graphN2;
				$(divId).removeAttr("style");
				$(divId).attr("style", "text-align:center;background-color:red;color:white;");
			} else {
				var divId = "#noData" + graphN2;
				$(divId).removeAttr("style");
				$(divId).attr("style", "text-align:center;");
				console.log("Response all : ", response);
				insertCumulativeAverageGraphData(response, graphN2);
			}
		},
		error: function(response) {
			alert(response.responseText);
		}
	});
}

function insertCumulativeAverageGraphData(response, graphN2) {
	var dates = response.split(';');
	var labels = [];
	var averageActualData = [];
	var averageTargetData = [];
	var unit = '';

	dates.forEach(dateData => {
		if (!dateData.trim()) return;
		var pairs = dateData.split(',');
		var date = "";
		var averageActual = 0;
		var averageTarget = 0;

		for (var i = 0; i < pairs.length; i += 2) {
			var key = pairs[i].trim();
			var value = pairs[i + 1].trim();

			switch (key) {
				case "date":
					date = value;
					break;
				case "average_actual":
					averageActual = parseFloat(value);
					break;
				case "average_target":
					averageTarget = parseFloat(value);
					break;
				case "unit":
					unit = value;
					break;
			}
		}

		if (date) {
			labels.push(date);
			averageActualData.push(averageActual);
			averageTargetData.push(averageTarget);
		}
	});

	var canvas = document.createElement('canvas');
	canvas.setAttribute("id", "canvas" + graphN2);
	canvas.setAttribute("class", "graphs");

	$("#canvasContainer" + graphN2).empty();
	$("#canvasContainer" + graphN2).append(canvas);

	const ctx = canvas.getContext('2d');
	Chart.register(ChartDataLabels);
	var myChart = new Chart(ctx, {
		type: actualType,
		data: {
			labels: labels,
			datasets: [{
				label: 'Average Actual',
				data: averageActualData,
				backgroundColor: actualColor,
				borderColor: actualColor,
				borderWidth: actualBorderWidth,
				fill: false,
				datalabels: {
					display: true,
					color: 'black',
					anchor: 'start',
					align: 'end',
					rotation: -90,
					formatter: function(value, context) {

						var formattedValue = value.toFixed(2);

						if (unitType === '%') {
							return formattedValue + '%';
						} else {
							return formattedValue;
						}
					}
				}
			}, {
				label: 'Average Target',
				data: averageTargetData,
				type: targetType,
				backgroundColor: targetColor,
				borderColor: targetColor,
				borderWidth: targetBorderWidth,
				fill: false,
				datalabels: {
					display: false
				}

			}]
		},
		options: {
			responsive: true,
			plugins: {
				title: {
					display: false,
					//text: 'Cumulative Average Graph Data'
				},
				datalabels: {
					display: false
				}
			},
			scales: {
				x: {
					grid: {
						display: false
					}
				},
				y: {
					beginAtZero: true,
					grid: {
						display: false
					},
					ticks: {
						callback: function(value, index, values) {

							if (unit === '%') {
								return value.toLocaleString() + '%';
							} else {
								return value.toLocaleString();
							}
						}
					},
					title: {
						display: true,
						// text: (unit === '%') ? 'Value (%)' : 'Value (Number)'
					}
				}
			}
		}
	});

}


/*function insertCumulativeAverageGraphData(response, graphN2) {
	var dates = response.split(';');
	var labels = [];
	var averageActualData = [];
	var averageTargetData = [];

	dates.forEach(dateData => {
		if (!dateData.trim()) return;
		var pairs = dateData.split(',');
		var date = "";
		var averageActual = 0;
		var averageTarget = 0;

		for (var i = 0; i < pairs.length; i += 2) {
			var key = pairs[i].trim();
			var value = pairs[i + 1].trim();

			switch (key) {
				case "date":
					date = value;
					break;
				case "average_actual":
					averageActual = parseFloat(value);
					break;
				case "average_target":
					averageTarget = parseFloat(value);
					break;
			}
		}

		if (date) {
			labels.push(date);
			averageActualData.push(averageActual);
			averageTargetData.push(averageTarget);
		}
	});

	var canvas = document.createElement('canvas');
	canvas.setAttribute("id", "canvas" + graphN2);
	canvas.setAttribute("class", "graphs");

	$("#canvasContainer" + graphN2).empty();
	$("#canvasContainer" + graphN2).append(canvas);

	const ctx = canvas.getContext('2d');

	var myChart = new Chart(ctx, {
		type: actualType,
		data: {
			labels: labels,
			datasets: [{
				label: 'Average Actual',
				data: averageActualData,
				backgroundColor: actualColor,
				borderColor: actualColor,
				borderWidth: actualBorderWidth,
				fill: false
			}, {
				label: 'Average Target',
				data: averageTargetData,
				type: targetType,
				backgroundColor: targetColor,
				borderColor: targetColor,
				borderWidth: targetBorderWidth,
				fill: false
			}]
		},
		options: {
			responsive: true,
			plugins: {
				title: {
					display: true,
					text: 'Cumulative Average Graph Data'
				},
				datalabels: {
					display: false
				}
			},
			scales: {
				x: {
					grid: {
						display: false
					}
				},
				y: {
					beginAtZero: true,
					grid: {
						display: true
					}
				}
			}
		}
	});
}
*/

/*function insertCumulativeAverageGraphData(response, graphN2) {
	var pairs = response.split(',');

	var totalActualSum = 0;
	var numRows = 0;
	var averageActual = 0;
	var averageTarget = 0;

	for (var i = 0; i < pairs.length; i += 2) {
		var key = pairs[i].trim();
		var value = parseFloat(pairs[i + 1].trim());
	    
		switch (key) {
			case "total_actual_sum":
				totalActualSum = value;
				break;
			case "num_rows":
				numRows = value;
				break;
			case "average_actual":
				averageActual = value;
				break;
			case "average_target":
				averageTarget = value;
				break;
		}
	}

	var canvas = document.createElement('canvas');
	canvas.setAttribute("id", "canvas" + graphN2);
	canvas.setAttribute("class", "graphs");

	$("#canvasContainer" + graphN2).empty();
	$("#canvasContainer" + graphN2).append(canvas);

	const ctx = canvas.getContext('2d');

	var myChart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: ['Average Actual', 'Average Target'],
			datasets: [{
				label: 'Average Actual',
				data: [averageActual],
				backgroundColor: 'rgba(75, 192, 192, 0.2)',
				borderColor: 'rgba(75, 192, 192, 1)',
				borderWidth: 1,
			},{
				label: 'Average Target',
				data: [averageTarget],
				backgroundColor: 'rgba(153, 102, 255, 0.2)',
				borderColor: 'rgba(153, 102, 255, 1)',
				borderWidth: 1,
			}]
		},
		options: {
			responsive: false,
			plugins: {
				title: {
					display: false,
				},
				datalabels: {
					display: false
				}
			},
			scales: {
				x: {
					grid: {
						display: false
					}
				},
				y: {
					beginAtZero: true,
					grid: {
						display: false
					}
				}
			}
		}
	});
}
*/


function loadMachineWeeklyWiseData(graphN, graphN2, from, to, differene) {

	var machineNumber = $("input[name=machineNumber]").val();

	var formData = {
		deviceNumber: machineNumber,
		graphName: graphN,
		dateTime: from + "," + to
	};

	$.ajax({
		type: 'POST',
		url: '/WebApplication/Controllers/getGraphDataDateWiseWeekly',
		async: false,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			if (response.length == 0) {
				var divId = "#noData" + graphN2;
				$(divId).removeAttr("style");
				$(divId).attr("style", "text-align:center;background-color:red;color:white;")
			} else {
				var divId = "#noData" + graphN2;
				$(divId).removeAttr("style");
				$(divId).attr("style", "text-align:center;")
				insertWeeklyAndMonthlyGraphData(response, graphN2);
			}

		}, error: function(response) {
			alert(response.responseText);

		}
	});

}

function loadMachineMonthlyWiseData(graphN, graphN2, from, to, difference) {

	var machineNumber = $("input[name=machineNumber]").val();

	var formData = {
		deviceNumber: machineNumber,
		graphName: graphN,
		dateTime: from + "," + to
	};

	$.ajax({
		type: 'POST',
		url: '/WebApplication/Controllers/getGraphDataDateWiseMonthly',
		async: false,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			/*	*/
			if (response.length == 0) {
				var divId = "#noData" + graphN2;
				$(divId).removeAttr("style");
				$(divId).attr("style", "text-align:center;background-color:red;color:white;")
			} else {
				var divId = "#noData" + graphN2;
				$(divId).removeAttr("style");
				$(divId).attr("style", "text-align:center;")
				insertWeeklyAndMonthlyGraphData(response, graphN2);
			}

		}, error: function(response) {
			alert(response.responseText);

		}
	});

}

function loadAllMachineWeeklyWiseData(graphN, graphN2, from, to, difference) {
	var formData = {
		graphName: graphN,
		dateTime: from + "," + to
	};
	console.log(formData);
	$.ajax({
		type: 'POST',
		url: '/WebApplication/Controllers/getAllGraphDataDateWiseWeekly',
		async: false,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			console.log("response d :", response);
			if (response.length == 0) {
				var divId = "#noData" + graphN2;
				$(divId).removeAttr("style");
				$(divId).attr("style", "text-align:center;background-color:red;color:white;");
			} else {
				var divId = "#noData" + graphN2;
				$(divId).removeAttr("style");
				$(divId).attr("style", "text-align:center;");
				insertWeeklyAndMonthlyGraphData(response, graphN2);
			}
		},
		error: function(response) {
			console.error("Error:", response);
			alert(response.responseText);
		}
	});
}


function loadallMachineWiseData(graphN, graphN2, from, to, difference) {

	var formData = {
		graphName: graphN,
		dateTime: from + "," + to
	};

	$.ajax({
		type: 'POST',
		url: '/WebApplication/Controllers/getAllGraphDataDateWiseMonthly',
		async: false,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			console.log("response b :", response)
			/*	*/
			if (response.length == 0) {
				var divId = "#noData" + graphN2;
				$(divId).removeAttr("style");
				$(divId).attr("style", "text-align:center;background-color:red;color:white;")
			} else {
				var divId = "#noData" + graphN2;
				$(divId).removeAttr("style");
				$(divId).attr("style", "text-align:center;")
				insertWeeklyAndMonthlyGraphData(response, graphN2);
			}

		}, error: function(response) {
			alert(response.responseText);

		}
	});

}

function loadMachineDataViaDate(graphN, graphN2, dateTime) {

	var formData = {
		graphName: graphN,
		dateTime: dateTime
	};

	$.ajax({
		type: 'POST',
		url: '/WebApplication/Controllers/geGraphDataViaData',
		async: false,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			if (response.length == 0) {
				var divId = "#noData" + graphN2;
				$(divId).removeAttr("style");
				$(divId).attr("style", "text-align:center;background-color:red;color:white;")
			} else {
				var divId = "#noData" + graphN2;
				$(divId).removeAttr("style");
				$(divId).attr("style", "text-align:center;")
				insertGraphData(response, graphN2);
			}

		}, error: function(response) {
			alert(response.responseText);

		}

	});

}



function insertGraphData($item, graphN2) {

	var maxHeight = 0;
	var label = [];
	var actual = [];
	var target = [];
	var unitType = '';
	$.each($item, function(index, value) {
		label.push(value.deviceNumber);
		actual.push(value.actual);
		target.push(value.target);
	});


	var canvas = document.createElement('canvas'); // Create canvas element
	canvas.setAttribute("id", "canvas" + graphN2);
	canvas.setAttribute("class", "graphs");

	$("#canvasContainer" + graphN2).empty();
	$("#canvasContainer" + graphN2).append(canvas);

	const ctx = canvas.getContext('2d');
	Chart.register(ChartDataLabels);
	var myChart = new Chart(ctx, {

		type: actualType,
		data: {
			labels: label,
			datasets: [{
				label: 'Actual',
				data: actual,
				backgroundColor: actualColor,
				borderColor: actualColor,
				borderWidth: actualBorderWidth,
				datalabels: {
					display: true,
					color: 'black',
					anchor: 'start',
					align: 'end',
					rotation: -90,
					formatter: function(value, context) {

						var formattedValue = value.toFixed(2);

						if (unitType === '%') {
							return formattedValue + '%';
						} else {
							return formattedValue;
						}
					}
				}


			},/*{
                label: 'Bar Graph',
                data: actual,
                backgroundColor: 'red',
                borderColor: actualColor,
                borderWidth: actualBorderWidth
            }, */{
				label: 'Target',
				data: target, // Use data1 here
				type: targetType,
				fill: false,
				backgroundColor: targetColor,
				borderColor: targetColor,
				borderWidth: targetBorderWidth,
				datalabels: {
					display: false
				}

			}]
		},
		options: {
			responsive: false,
			plugins: {
				title: {
					display: false,
				},
				datalabels: {
					display: false
				}
			},

			scales: {
				x: {
					grid: {
						display: false
					}
				},
				y: {
					beginAtZero: true,
					grid: {
						display: false
					}
				}
			}
		}
	});
}



function insertDateGraphData($item, graphN2) {

	var maxHeight = 0;
	var label = [];
	var actual = [];
	var target = [];
	var unitType = '';
	$.each($item, function(index, value) {
		label.push(value.dateTime.slice(0, 10));
		actual.push(value.actual);
		target.push(value.target);
	});


	var canvas = document.createElement('canvas'); // Create canvas element
	canvas.setAttribute("id", "canvas" + graphN2);
	canvas.setAttribute("class", "graphs");

	$("#canvasContainer" + graphN2).empty();
	$("#canvasContainer" + graphN2).append(canvas);

	const ctx = canvas.getContext('2d');
	Chart.register(ChartDataLabels);
	var myChart = new Chart(ctx, {

		type: actualType,
		data: {
			labels: label,
			datasets: [{
				label: 'Actual',
				data: actual,
				backgroundColor: actualColor,
				borderColor: actualColor,
				borderWidth: actualBorderWidth,
				datalabels: {
					display: true,
					color: 'black',
					anchor: 'start',
					align: 'end',
					rotation: -90,
					formatter: function(value, context) {

						var formattedValue = value;

						if (unitType === '%') {
							return formattedValue + '%';
						} else {
							return formattedValue;
						}
					}
				}

			},/*{
                label: 'Bar Graph',
                data: actual,
                backgroundColor: 'red',
                borderColor: actualColor,
                borderWidth: actualBorderWidth
            }, */{
				label: 'Target',
				data: target, // Use data1 here
				type: targetType,
				fill: false,
				backgroundColor: targetColor,
				borderColor: targetColor,
				borderWidth: targetBorderWidth,
				datalabels: {
					display: false
				}

			}]
		},
		options: {
			responsive: false,
			plugins: {
				title: {
					display: false,
				}, datalabels: {
					display: false
				}
			},
			scales: {
				x: {
					grid: {
						display: false
					}
				},
				y: {
					beginAtZero: true,
					grid: {
						display: false
					}
				}
			}
		}
	});
}


/*function insertAverageGraphData(response, graphN2) {

	var maxHeight = 0;
	var label = [];
	var actual = [];
	var target = [];

	for (var i = 0; i < response.length; i++) {
		var str = response[i];
		var list = str.split(',');

		label.push(list[5]);
		actual.push(list[8]);
		target.push(list[9]);

	}

	var canvas = document.createElement('canvas'); // Create canvas element
	canvas.setAttribute("id", "canvas" + graphN2);
	canvas.setAttribute("class", "graphs");

	$("#canvasContainer" + graphN2).empty();
	$("#canvasContainer" + graphN2).append(canvas);

	const ctx = canvas.getContext('2d');

	var myChart = new Chart(ctx, {

		type: actualType,
		data: {
			labels: label,
			datasets: [{
				label: 'Actual',
				data: actual,
				backgroundColor: actualColor,
				borderColor: actualColor,
				borderWidth: actualBorderWidth,

			},{
				label: 'Bar Graph',
				data: actual,
				backgroundColor: 'red',
				borderColor: actualColor,
				borderWidth: actualBorderWidth
			}, {
				label: 'Target',
				data: target, // Use data1 here
				type: targetType,
				fill: false,
				backgroundColor: targetColor,
				borderColor: targetColor,
				borderWidth: targetBorderWidth,

			}]
		},
		options: {
			responsive: false,
			plugins: {
				title: {
					display: false,
				}, datalabels: {
					display: false
				}
			},
			scales: {
				x: {
					grid: {
						display: false
					}
				},
				y: {
					beginAtZero: true,
					grid: {
						display: false
					}
				}
			}
		}
	});
}*/
function insertAverageGraphData(response, graphN2) {
	var label = [];
	var actual = [];
	var target = [];
	var unitType = '';

	for (var i = 0; i < response.length; i++) {
		var str = response[i];
		var list = str.split(',');

		label.push(list[5]);
		actual.push(parseFloat(list[8]));
		target.push(parseFloat(list[9]));

		unitType = list[6];
	}

	var canvas = document.createElement('canvas');
	canvas.setAttribute("id", "canvas" + graphN2);
	canvas.setAttribute("class", "graphs");

	$("#canvasContainer" + graphN2).empty();
	$("#canvasContainer" + graphN2).append(canvas);

	const ctx = canvas.getContext('2d');
	Chart.register(ChartDataLabels);

	var myChart = new Chart(ctx, {
		type: actualType,
		data: {
			labels: label,
			datasets: [{
				label: 'Actual',
				data: actual,
				backgroundColor: actualColor,
				borderColor: actualColor,
				borderWidth: actualBorderWidth,
				datalabels: {
					display: true,
					color: 'black',
					anchor: 'start',
					align: 'end',
					rotation: -90,
					formatter: function(value, context) {

						var formattedValue = value.toFixed(2);

						if (unitType === '%') {
							return formattedValue + '%';
						} else {
							return formattedValue;
						}
					}
				}
			}, {
				label: 'Target',
				data: target,
				type: targetType,
				fill: false,
				backgroundColor: targetColor,
				borderColor: targetColor,
				borderWidth: targetBorderWidth,
				datalabels: {
					display: false
				}
			}]
		},
		options: {
			responsive: true,
			plugins: {
				title: {
					display: false,
				},
				datalabels: {
					display: false
				}
			},
			scales: {
				x: {
					grid: {
						display: false
					}
				},
				y: {
					beginAtZero: true,
					grid: {
						display: false
					},
					ticks: {
						callback: function(value, index, values) {
							if (unitType === '%') {
								return value.toLocaleString() + '%';
							} else {
								return value.toLocaleString();
							}
						}
					},
					title: {
						display: true,
					},
					grid: {
						display: false
					}
				}
			}
		}
	});
}


function insertWeeklyAndMonthlyGraphData(response, graphN2) {
	var label = [];
	var actual = [];
	var target = [];
	var unitType = '';

	for (var i = 0; i < response.length; i++) {
		var str = response[i];
		var list = str.split(',');

		unitType = list[6];
		console.log("unitType", unitType)

		label.push(list[9]);

		if (unitType === '1') {
			actual.push(parseFloat(list[8]));
			target.push(parseFloat(list[4]));
		} else if (unitType === '%') {
			actual.push(parseFloat(list[8]));
			target.push(parseFloat(list[4]));
		} else {
			actual.push(parseFloat(list[8]));
			target.push(parseFloat(list[4]));
		}
	}

	var canvas = document.createElement('canvas');
	canvas.setAttribute("id", "canvas" + graphN2);
	canvas.setAttribute("class", "graphs");

	$("#canvasContainer" + graphN2).empty();
	$("#canvasContainer" + graphN2).append(canvas);

	const ctx = canvas.getContext('2d');
	Chart.register(ChartDataLabels);
	var myChart = new Chart(ctx, {
		type: actualType,
		data: {
			labels: label,
			datasets: [{
				label: 'Actual',
				data: actual,
				backgroundColor: actualColor,
				borderColor: actualColor,
				borderWidth: actualBorderWidth,
				datalabels: {
					display: true,
					color: 'black',
					anchor: 'start',
					align: 'end',
					rotation: -90,
					formatter: function(value, context) {
						// Convert value to fixed 2 decimal places
						var formattedValue = value.toFixed(2);

						if (unitType === '%') {
							return formattedValue + '%';
						} else {
							return formattedValue;
						}
					}
				}
			}, {
				label: 'Target',
				data: target,
				type: targetType,
				fill: false,
				backgroundColor: targetColor,
				borderColor: targetColor,
				borderWidth: targetBorderWidth,
				datalabels: {
					display: false
				}
			}]
		},
		options: {
			responsive: true,
			plugins: {
				title: {
					display: false,

					//text: 'Weekly and Monthly Graph Data'
				},
				legend: {
					position: 'top',
				},
				tooltip: {
					mode: 'index',
					intersect: false,
				},
				datalabels: {
					display: false
				}
			},
			scales: {
				x: {
					grid: {
						display: false
					}
				},
				y: {
					type: 'linear',
					position: 'left',
					beginAtZero: true,
					ticks: {
						callback: function(value, index, values) {
							if (unitType === '%') {
								return value.toLocaleString() + '%';
							} else {
								return value.toLocaleString();
							}
						}
					},
					title: {
						display: true,
						//text: (unitType === '%') ? 'Value (%)' : 'Value (Number)'
					}, grid: {
						display: false
					},
				}
			}
		}
	});
}


/*function insertWeeklyAndMonthlyGraphData(response, graphN2) {

	var maxHeight = 0;
	var label = [];
	var actual = [];
	var target = [];

	for (var i = 0; i < response.length; i++) {
		var str = response[i];
		var list = str.split(',');


		label.push(list[9]);
		actual.push(list[8]);
		target.push(list[4]);

	}

	var canvas = document.createElement('canvas'); // Create canvas element
	canvas.setAttribute("id", "canvas" + graphN2);
	canvas.setAttribute("class", "graphs");

	$("#canvasContainer" + graphN2).empty();
	$("#canvasContainer" + graphN2).append(canvas);

	const ctx = canvas.getContext('2d');

	var myChart = new Chart(ctx, {

		type: actualType,
		data: {
			labels: label,
			datasets: [{
				label: 'Actual',
				data: actual,
				backgroundColor: actualColor,
				borderColor: actualColor,
				borderWidth: actualBorderWidth,

			},{
				label: 'Bar Graph',
				data: actual,
				backgroundColor: 'red',
				borderColor: actualColor,
				borderWidth: actualBorderWidth
			}, {
				label: 'Target',
				data: target, // Use data1 here
				type: targetType,
				fill: false,
				backgroundColor: targetColor,
				borderColor: targetColor,
				borderWidth: targetBorderWidth,

			}]
		},
		options: {
			responsive: false,
			plugins: {
				title: {
					display: false,
				}, datalabels: {
					display: false
				}
			},
			scales: {
				x: {
					grid: {
						display: false
					}
				},
				y: {
					beginAtZero: true,
					grid: {
						display: false
					}
				}
			}
		}
	});
}

*/


$(document).ready(function() {

	$(document).on('click', '#iotDashboardAssemblySection', function() {

		searchLoad = false; clearInterval(interval);

		$(".fromTo").css("display", "none");
		$("#excelDownload").css("display", "block");
		$("#pageSelect").css("display", "none");
		$("#printPreview").css("display", "none");
		$("#next").css("display", "none");
		$("#previous").css("display", "none");
		$("#backToHarness").css("display", "none");
		$("#toggleActionFilterBtn").closest(".switch").css("display", "none");
				
		$("#offcanvasCloseButton").click();

		try {
			var child1 = document.getElementById("div3");
			var child2 = document.getElementById("div4");
			child2.remove();
			child1.remove();
		} catch (err) {
			var child1 = document.getElementById("div3");
			child1.remove();
		}

		document.getElementById("masterHeading").innerText = "";
		$("#masterHeading").append("IOT DASHBOARD - ASSEMBLY SECTION");

		var div3 = document.createElement("div");
		var div6 = document.createElement("div");

		$("#div2").append(div3);
		div3.append(div6);

		div3.setAttribute("id", "div3");
		div3.setAttribute("class", "masterBody");

		div6.setAttribute("id", "div6");
		div6.setAttribute("style", "width:100%; height:40px; ");

		var from = document.createElement("input");
		var to = document.createElement("input");
		var machine = document.createElement("input");
		var target = document.createElement("input");
		var actual = document.createElement("input");
		var targetLine = document.createElement("input");
		var targetBar = document.createElement("input");
		var actualLine = document.createElement("input");
		var actualBar = document.createElement("input");
		var lineLabel1 = document.createElement("label");
		var barlabel1 = document.createElement("label");
		var lineLabel2 = document.createElement("label");
		var barlabel2 = document.createElement("label");
		var div1 = document.createElement("div");
		var div2 = document.createElement("div");
		var div4 = document.createElement("div");
		var div5 = document.createElement("div");
		var machineList = document.createElement("datalist");
		var img = document.createElement("img");
		img.setAttribute("src", "/WebApplication/images/searchFilter.png");
		img.setAttribute("id", "searchButton");
		img.setAttribute("width", "22");
		img.setAttribute("height", "22");

		var table = document.createElement("table");
		table.setAttribute("style", "width:100%;color:white;");
		var tbody = document.createElement("tbody");
		var tr = document.createElement("tr");
		var td1 = document.createElement("th");
		td1.setAttribute("class", "tableheading");
		td1.innerText = "FROM :";
		var td2 = document.createElement("th");
		td2.setAttribute("class", "tableheading");
		td2.append(from);
		var td3 = document.createElement("th");
		td3.setAttribute("class", "tableheading");
		td3.innerText = "TO :";
		var td4 = document.createElement("th");
		td4.setAttribute("class", "tableheading");
		td4.append(to);
		var td5 = document.createElement("th");
		td5.setAttribute("class", "tableheading");
		td5.innerText = "Conveyor :";
		var td6 = document.createElement("th");
		td6.setAttribute("class", "tableheading");
		td6.append(machine, machineList);
		var td7 = document.createElement("th");
		td7.setAttribute("style", "width:50px;");
		td7.setAttribute("class", "tableheading");
		td7.append(img);
		var td8 = document.createElement("th");
		td8.setAttribute("class", "tableheading");
		td8.innerText = "Target :";
		var td9 = document.createElement("th");
		td9.setAttribute("style", "width:200px;");
		td9.setAttribute("class", "tableheading");
		td9.append(target, div1, div2);
		var td10 = document.createElement("th");
		td10.setAttribute("class", "tableheading");
		td10.innerText = "Actual :";
		var td11 = document.createElement("th");
		td11.setAttribute("class", "tableheading");
		td11.setAttribute("style", "width:200px;");
		td11.append(actual, div4, div5);

		lineLabel1.innerText = "Line";
		div1.append(lineLabel1, targetLine);
		div1.setAttribute("style", "width:60px; float:left;");
		barlabel1.innerText = "Bar";
		div2.append(barlabel1, targetBar);
		div2.setAttribute("style", "width:60px; float:left;");



		lineLabel2.innerText = "Line";
		div4.append(lineLabel2, actualLine);
		div4.setAttribute("style", "width:60px; float:left;");
		barlabel2.innerText = "Bar";
		div5.append(barlabel2, actualBar);
		div5.setAttribute("style", "width:60px; float:left;");


		var fromAttr = ["type", "date", "id", "fromm", "class", "inputs", "autocomplete", "off", "name", "fromm"];

		for (var i = 0; i <= fromAttr.length - 1; i = i + 2) {
			for (var j = 0; j <= i; j = j + 2) {
				from.setAttribute(fromAttr[i], fromAttr[j + 1]);

			}
		}

		var toAttr = ["type", "date", "id", "too", "class", "inputs", "autocomplete", "off", "name", "too"];

		for (var i = 0; i <= toAttr.length - 1; i = i + 2) {
			for (var j = 0; j <= i; j = j + 2) {
				to.setAttribute(toAttr[i], toAttr[j + 1]);

			}
		}

		var machineAttr = ["type", "text", "placeholder", "Select", "id", "lineNo", "class", "inputs", "autocomplete", "off", "name", "lineNumber", "list", "lineList"];

		for (var i = 0; i <= machineAttr.length - 1; i = i + 2) {
			for (var j = 0; j <= i; j = j + 2) {
				machine.setAttribute(machineAttr[i], machineAttr[j + 1]);

			}
		}

		var machineListAttr = ["id", "lineList"];

		for (var i = 0; i <= machineListAttr.length - 1; i = i + 2) {
			for (var j = 0; j <= i; j = j + 2) {
				machineList.setAttribute(machineListAttr[i], machineListAttr[j + 1]);

			}
		}

		var actualLineAttr = ["type", "radio", "id", "actualLine", "class", "inputss", "name", "actual", "style", "margin-left:10px;margin-top:5px;", "value", "line"];

		for (var i = 0; i <= actualLineAttr.length - 1; i = i + 2) {
			for (var j = 0; j <= i; j = j + 2) {
				actualLine.setAttribute(actualLineAttr[i], actualLineAttr[j + 1]);

			}
		}

		var actualBarAttr = ["type", "radio", "id", "actualBar", "class", "inputss", "name", "actual", "style", "margin-left:10px;margin-top:5px;", "value", "bar"];

		for (var i = 0; i <= actualBarAttr.length - 1; i = i + 2) {
			for (var j = 0; j <= i; j = j + 2) {
				actualBar.setAttribute(actualBarAttr[i], actualBarAttr[j + 1]);

			}
		}

		var targetLineAttr = ["type", "radio", "id", "targetLine", "class", "inputss", "name", "target", "style", "margin-left:10px;margin-top:5px;", "value", "line"];

		for (var i = 0; i <= targetLineAttr.length - 1; i = i + 2) {
			for (var j = 0; j <= i; j = j + 2) {
				targetLine.setAttribute(targetLineAttr[i], targetLineAttr[j + 1]);

			}
		}

		var targetBarAttr = ["type", "radio", "id", "targetBar", "class", "inputss", "name", "target", "style", "margin-left:10px;margin-top:5px;", "value", "bar"];

		for (var i = 0; i <= targetBarAttr.length - 1; i = i + 2) {
			for (var j = 0; j <= i; j = j + 2) {
				targetBar.setAttribute(targetBarAttr[i], targetBarAttr[j + 1]);

			}
		}

		var targetList = targetColor.match(/\b\d+\b/g);
		var actualList = actualColor.match(/\b\d+\b/g);

		var targetC = rgbToHex(parseInt(targetList[0]), parseInt(targetList[1]), parseInt(targetList[2]));
		var actualC = rgbToHex(parseInt(actualList[0]), parseInt(actualList[1]), parseInt(actualList[2]));


		var targetAttr = ["type", "color", "id", "targetNo", "name", "targetNumber", "value", targetC];

		for (var i = 0; i <= targetAttr.length - 1; i = i + 2) {
			for (var j = 0; j <= i; j = j + 2) {
				target.setAttribute(targetAttr[i], targetAttr[j + 1]);

			}
		}
		var actualAttr = ["type", "color", "id", "actualNo", "name", "actualNumber", "value", actualC];

		for (var i = 0; i <= actualAttr.length - 1; i = i + 2) {
			for (var j = 0; j <= i; j = j + 2) {
				actual.setAttribute(actualAttr[i], actualAttr[j + 1]);

			}
		}


		div6.append(table)
		table.append(tbody);
		tbody.append(tr);
		tr.append(td7, td1, td2, td3, td4, td5, td6, td8, td9, td10, td11);

		graphName = []
		loadConveyorGraphNameAndId();
		machinePrinted = Math.ceil(graphName.length / 2);


		for (var i = 0; i <= Math.ceil((graphName.length / 2) / 3 - 1); i++) {
			var divId = "floatDivContainer" + (i + 1);

			var floatDivContainer = document.createElement("div");
			floatDivContainer.setAttribute("id", divId);
			floatDivContainer.setAttribute("class", "floatDivContainer");

			div3.append(floatDivContainer);

			if (machinePrinted < 3) {
				for (var j = 0; j < machinePrinted; j++) {

					var divId = "tableContainer" + (j + 1);

					var floatDiv = document.createElement("div");
					floatDiv.setAttribute("id", divId);
					floatDiv.setAttribute("class", "floatingLeaderDiv");
					floatDivContainer.append(floatDiv);


					var div1Class = "reportsNameContainer";
					var div2Class = "canvasContainer";

					var div1Id = "noData" + graphNameWithoutSpace[graphNameIndex];

					var div1 = document.createElement("div");
					var div2 = document.createElement("div");
					div1.setAttribute("style", "text-align:center");
					div1.setAttribute("class", div1Class);
					div1.setAttribute("id", div1Id);
					div2.setAttribute("id", div2Class + graphNameWithoutSpace[graphNameIndex])

					var heading = document.createElement("span");
					heading.innerText = graphName[graphNameIndex];
					heading.setAttribute("class", "heading3");
					div1.append(heading)

					var machineId = document.createElement("span");
					machineId.innerText = graphNameWithoutSpace[graphIdIndex];
					machineId.setAttribute("style", "display:none");
					div1.append(machineId)

					floatDiv.append(div1, div2);


					graphNameIndex = graphNameIndex + 2;
					graphIdIndex = graphIdIndex + 2;

				}
			} else {

				for (var j = 0; j < 3; j++) {

					var divId = "tableContainer" + (j + 1);

					var floatDiv = document.createElement("div");
					floatDiv.setAttribute("id", divId);
					floatDiv.setAttribute("class", "floatingLeaderDiv");
					floatDivContainer.append(floatDiv);


					var div1Class = "reportsNameContainer";
					var div2Class = "canvasContainer";

					var div1Id = "noData" + graphNameWithoutSpace[graphNameIndex];

					var div1 = document.createElement("div");
					var div2 = document.createElement("div");
					div1.setAttribute("style", "text-align:center");
					div1.setAttribute("class", div1Class);
					div1.setAttribute("id", div1Id);
					div2.setAttribute("id", div2Class + graphNameWithoutSpace[graphNameIndex])

					var heading = document.createElement("span");
					heading.innerText = graphName[graphNameIndex];
					heading.setAttribute("class", "heading3");
					div1.append(heading)

					var machineId = document.createElement("span");
					machineId.innerText = graphNameWithoutSpace[graphIdIndex];
					machineId.setAttribute("style", "display:none");
					div1.append(machineId)

					floatDiv.append(div1, div2);

					graphNameIndex = graphNameIndex + 2;
					graphIdIndex = graphIdIndex + 2;

				}

				machinePrinted = machinePrinted - 3;
			}
		}

		getCurrentDate();
		getAllLinesInListForDashBoard();
		$("#targetLine").prop("checked", true);
		$("#actualBar").prop("checked", true);

		setTimeout(function() {
			loadIotConveyorDashboard();
		}, 500)
	});

});


$(document).on('click', '#targetLine', function(event) {

	targetType = event.target.value;
	targetBorderWidth = 2;
	setTimeout(function() {
		$("#searchButton").click();
	}, 100)

});

$(document).on('click', '#targetBar', function(event) {

	targetType = event.target.value;
	targetBorderWidth = 1;
	setTimeout(function() {
		$("#searchButton").click();
	}, 100)

});

$(document).on('click', '#actualLine', function(event) {

	actualType = event.target.value;
	actualBorderWidth = 2;
	setTimeout(function() {
		$("#searchButton").click();
	}, 100)

});

$(document).on('click', '#actualBar', function(event) {

	actualType = event.target.value;
	actualBorderWidth = 1;
	setTimeout(function() {
		$("#searchButton").click();
	}, 100)

});

function getAllLinesInList() {
	$.ajax({
		url: "/WebApplication/Controllers/getAllLinesInList",
		type: 'GET',
		contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		async: false,
		dataType: 'json',
		success: function(res) {
			for (var i = 0; i < res.length; i++) {
				var str = res[i];
				var id_machine = str.split(',');

				for (var j = 0; j < id_machine.length - 1; j++) {
					var row = '<option value="' + id_machine[j + 1] + '">';
					$('#lineList').append(row);
				}
			}
		}
	});
}

function getAllLinesInListForDashBoard() {
	$.ajax({
		url: "/WebApplication/Controllers/getAllLinesInList",
		type: 'GET',
		contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		async: false,
		dataType: 'json',
		success: function(res) {
			$('#lineList').append('<option value="ALL">ALL</option>');
			for (var i = 0; i < res.length; i++) {
				var str = res[i];
				var id_machine = str.split(',');

				for (var j = 0; j < id_machine.length - 1; j++) {
					var row = '<option value="' + id_machine[j + 1] + '">';
					$('#lineList').append(row);
				}
			}
		}
	});
}


function iotConveyorDashboardDifferenceForExcel() {

	var from = $("input[name=fromm]").val();
	var to = $("input[name=too]").val();
	var difference;

	if (!from || !to) {
		alert("Please select from and to date to get excel report.");
		return;
	}

	const startDate = new Date(from);
	const endDate = new Date(to);
	difference = dateDifference(startDate, endDate);
	downloadConveyorExcelByTimeDifference(difference);

}


function downloadConveyorExcelByTimeDifference(difference) {

	var lineNumber = $("#lineNo").val();
	var from = $("input[name=fromm]").val();
	var to = $("input[name=too]").val();

	if (!from && !to) {
		alert("Please select date to get LPC section report.");
		return;
	}

	if (lineNumber == "" || !lineNumber) {
		lineNumber = "All";
	}

	$("#loadingBackdropButton").click();
	$("#loadingBackdropModalMessage").text("Getting Assembly section report.");

	var formData = {
		lineNumber: lineNumber,
		graphName: graphName,
		from: from,
		to: to
	}

	if (!difference) {
		getConveyorGraphDataAverageAndDateWiseInExcel(formData);
	}
	else if (difference < 0) {
		alert("Selected From date is greater than To date pleaase check it.");
		return;
	} if (difference == 0) {
		getConveyorGraphDataAverageAndDateWiseInExcel(formData);
	}
	else if (difference <= 10) {

		getConveyorGraphDataAverageAndDateWiseInExcel(formData);

	} else if (difference > 10 && difference <= 30) {

		if (lineNumber == "All") {
			getConveyorGraphDataAverageAndDateWiseInExcel(formData);
		} else {
			getConveyorGraphDataWeeklyWiseInExcel(formData);
		}
	} else if (difference > 30) {
		if (lineNumber == "All") {
			getConveyorGraphDataAverageAndDateWiseInExcel(formData);
		} else {
			getConveyorGraphDataMonthlyWiseInExcel(formData);
		}
	}

}


function getConveyorGraphDataAverageAndDateWiseInExcel(formData) {

	fetch('/WebApplication/Controllers/getConveyorGraphDataAverageAndDateWiseInExcel', {
		method: 'POST',
		headers: {
			'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(formData)
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
			let currDateTime = new Date();
			link.download = 'Assembly Dashboard report' + '.xlsx';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			setTimeout(function() {
				$("#loadingBackdropButton").click();
			}, 1000);
		})
		.catch(error => {
			console.error('Error:', error);
			setTimeout(function() {
				$("#loadingBackdropButton").click();
			}, 1000);
		});

}


function getConveyorGraphDataWeeklyWiseInExcel(formData) {

	fetch('/WebApplication/Controllers/getConveyorGraphDataWeeklyWiseInExcel', {
		method: 'POST',
		headers: {
			'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(formData)
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
			let currDateTime = new Date();
			link.download = 'Assembly Dashboard report' + '.xlsx';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			setTimeout(function() {
				$("#loadingBackdropButton").click();
			}, 1000);
		})
		.catch(error => {
			console.error('Error:', error);
			setTimeout(function() {
				$("#loadingBackdropButton").click();
			}, 1000);
		});

}

function getConveyorGraphDataMonthlyWiseInExcel(formData) {

	fetch('/WebApplication/Controllers/getConveyorGraphDataMonthlyWiseInExcel', {
		method: 'POST',
		headers: {
			'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(formData)
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
			let currDateTime = new Date();
			link.download = 'Assembly Dashboard report' + '.xlsx';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			setTimeout(function() {
				$("#loadingBackdropButton").click();
			}, 1000);
		})
		.catch(error => {
			console.error('Error:', error);
			setTimeout(function() {
				$("#loadingBackdropButton").click();
			}, 1000);
		});
}


function loadIotConveyorDashboard() {

	var from = $("input[name=fromm]").val();
	var to = $("input[name=too]").val();
	var lineNumber = $("input[name=lineNumber]").val();
	var difference;


	if (!from || !to) {
		alert("Please select from and to date to get Conveyor wise report.");
		return;
	}

	const startDate = new Date(from);
	const endDate = new Date(to);
	difference = dateDifference(startDate, endDate);
	loadConveyorDataByTimeDifference(difference);

}


function loadConveyorDataByTimeDifference(difference) {

	$("#loadingBackdropButton").click();
	$("#loadingBackdropModalMessage").text("Getting Assembly section report.");

	for (var i = 0; i < Math.ceil((graphName.length / 2)); i++) {

		var graphN = graphName[graphNameIndexForLoadTableData];
		var graphN2 = graphNameWithoutSpace[graphNameIndexForLoadTableData];
		var dateTime = $("input[name=too]").val();
		var from = $("input[name=fromm]").val();
		var to = $("input[name=too]").val();
		var lineNumber = $("input[name=lineNumber]").val();


		if (!difference) {

			loadConveyorAverageAndDateWiseData(graphN, graphN2, from, to, difference);
		}
		else if (difference < 0) {

			alert("Selected From date is greater than To date pleaase check it.");
			return;

		} if (difference == 0) {

			loadConveyorAverageAndDateWiseData(graphN, graphN2, from, to, difference);

		}
		else if (difference <= 10) {
			if (!lineNumber) {
				loadConveyorAverageAndDateWiseData(graphN, graphN2, from, to, difference);
			} else if (lineNumber == "ALL") {
				loadAllConveyerAverageAndDateWiseData(graphN, graphN2, from, to, difference);
			} else {
				loadConveyorAverageAndDateWiseData(graphN, graphN2, from, to, difference);
			}


		} else if (difference > 10 && difference <= 30) {

			if (!lineNumber) {
				loadConveyorAverageAndDateWiseData(graphN, graphN2, from, to, difference);
			} else if (lineNumber == "ALL") {
				loadAllConveyorWeeklyWiseData(graphN, graphN2, from, to, difference);
			} else {
				loadConveyorWeeklyWiseData(graphN, graphN2, from, to, difference);
			}


		} else if (difference > 30) {

			if (!lineNumber) {
				loadConveyorAverageAndDateWiseData(graphN, graphN2, from, to, difference);
			} else if (lineNumber == "ALL") {
				loadAllConveyorMonthlyWiseData(graphN, graphN2, from, to, difference);
			} else {

				loadConveyorMonthlyWiseData(graphN, graphN2, from, to, difference);
			}

		}

		graphIdIndexForLoadTableData = graphIdIndexForLoadTableData + 2;
		graphNameIndexForLoadTableData = graphNameIndexForLoadTableData + 2
	}
	graphIdIndexForLoadTableData = 0;
	graphNameIndexForLoadTableData = 1;

	setTimeout(function() {
		$("#loadingBackdropButton").click();
	}, 1000);

}

function loadConveyorAverageAndDateWiseData(graphN, graphN2, from, to, differene) {

	var formData = {};
	var lineNumber = $("input[name=lineNumber]").val();

	if (!lineNumber) {
		formData = {
			deviceNumber: 0,
			graphName: graphN,
			dateTime: from + "," + to
		};
	} else {
		formData = {
			deviceNumber: lineNumber,
			graphName: graphN,
			dateTime: from + "," + to
		};
	}

	$.ajax({
		type: 'POST',
		url: '/WebApplication/Controllers/getConveyorGraphDataDateWise',
		async: false,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {

			if (response.length == 0) {
				var divId = "#noData" + graphN2;
				$(divId).removeAttr("style");
				$(divId).attr("style", "text-align:center;background-color:red;color:white;")
			} else {
				var divId = "#noData" + graphN2;
				$(divId).removeAttr("style");
				$(divId).attr("style", "text-align:center;")

				if (lineNumber == 0) {
					insertConveyorAverageGraphData(response, graphN2);
				} else {
					insertConveyorDateGraphData(response, graphN2);
				}
			}

		}, error: function(response) {
			alert(response.responseText);

		}
	});
}

function loadAllConveyerAverageAndDateWiseData(graphN, graphN2, from, to, differene) {
	var formData = {
		deviceNumber: "ALL",
		graphName: graphN,
		dateTime: from + "," + to
	};

	$.ajax({
		type: 'POST',
		url: '/WebApplication/Controllers/getAllConveyorGraphDataDateWise',
		async: false,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			if (!response || response.trim().length === 0) {
				var divId = "#noData" + graphN2;
				$(divId).removeAttr("style");
				$(divId).attr("style", "text-align:center;background-color:red;color:white;");
			} else {
				var divId = "#noData" + graphN2;
				$(divId).removeAttr("style");
				$(divId).attr("style", "text-align:center;");
				console.log("Response all : ", response);
				insertConveyerCumulativeAverageGraphData(response, graphN2);
			}
		},
		error: function(response) {
			alert(response.responseText);
		}
	});
}
function insertConveyerCumulativeAverageGraphData(response, graphN2) {
	var dates = response.split(';');
	var labels = [];
	var averageActualData = [];
	var averageTargetData = [];
	var unit = '';

	dates.forEach(dateData => {
		if (!dateData.trim()) return;
		var pairs = dateData.split(',');
		var date = "";
		var averageActual = 0;
		var averageTarget = 0;

		for (var i = 0; i < pairs.length; i += 2) {
			var key = pairs[i].trim();
			var value = pairs[i + 1].trim();

			switch (key) {
				case "date":
					date = value;
					break;
				case "average_actual":
					averageActual = parseFloat(value);
					break;
				case "average_target":
					averageTarget = parseFloat(value);
					break;
				case "unit":
					unit = value;
					break;
			}
		}

		if (date) {
			labels.push(date);
			averageActualData.push(averageActual);
			averageTargetData.push(averageTarget);
		}
	});

	var canvas = document.createElement('canvas');
	canvas.setAttribute("id", "canvas" + graphN2);
	canvas.setAttribute("class", "graphs");

	$("#canvasContainer" + graphN2).empty();
	$("#canvasContainer" + graphN2).append(canvas);

	const ctx = canvas.getContext('2d');
	Chart.register(ChartDataLabels);
	var myChart = new Chart(ctx, {
		type: actualType,
		data: {
			labels: labels,
			datasets: [{
				label: 'Average Actual',
				data: averageActualData,
				backgroundColor: actualColor,
				borderColor: actualColor,
				borderWidth: actualBorderWidth,
				fill: false,
				datalabels: {
					display: true,
					color: 'black',
					anchor: 'start',
					align: 'end',
					rotation: -90,
					formatter: function(value, context) {

						var formattedValue = value.toFixed(2);

						if (unitType === '%') {
							return formattedValue + '%';
						} else {
							return formattedValue;
						}
					}
				}
			}, {
				label: 'Average Target',
				data: averageTargetData,
				type: targetType,
				backgroundColor: targetColor,
				borderColor: targetColor,
				borderWidth: targetBorderWidth,
				fill: false,
				datalabels: {
					display: false
				}
			}]
		},
		options: {
			responsive: true,
			plugins: {
				title: {
					display: false,
					//text: 'Cumulative Average Graph Data'
				},
				datalabels: {
					display: false
				}
			},
			scales: {
				x: {
					grid: {
						display: false
					}
				},
				y: {
					beginAtZero: true,
					grid: {
						display: false
					},
					ticks: {
						callback: function(value, index, values) {

							if (unit === '%') {
								return value.toLocaleString() + '%';
							} else {
								return value.toLocaleString();
							}
						}
					},
					title: {
						display: true,
						// text: (unit === '%') ? 'Value (%)' : 'Value (Number)'
					}
				}
			}
		}
	});
}




function loadConveyorWeeklyWiseData(graphN, graphN2, from, to, differene) {

	var lineNumber = $("input[name=lineNumber]").val();

	var formData = {
		deviceNumber: lineNumber,
		graphName: graphN,
		dateTime: from + "," + to
	};

	$.ajax({
		type: 'POST',
		url: '/WebApplication/Controllers/getConveyorGraphDataDateWiseWeekly',
		async: false,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			/*	*/
			if (response.length == 0) {
				var divId = "#noData" + graphN2;
				$(divId).removeAttr("style");
				$(divId).attr("style", "text-align:center;background-color:red;color:white;")
			} else {
				var divId = "#noData" + graphN2;
				$(divId).removeAttr("style");
				$(divId).attr("style", "text-align:center;")
				insertConveyorWeeklyAndMonthlyGraphData(response, graphN2);
			}

		}, error: function(response) {
			alert(response.responseText);

		}
	});

}

function loadConveyorMonthlyWiseData(graphN, graphN2, from, to, difference) {

	var lineNumber = $("input[name=lineNumber]").val();

	var formData = {
		deviceNumber: lineNumber,
		graphName: graphN,
		dateTime: from + "," + to
	};

	$.ajax({
		type: 'POST',
		url: '/WebApplication/Controllers/getConveyorGraphDataDateWiseMonthly',
		async: false,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			/*	*/
			if (response.length == 0) {
				var divId = "#noData" + graphN2;
				$(divId).removeAttr("style");
				$(divId).attr("style", "text-align:center;background-color:red;color:white;")
			} else {
				var divId = "#noData" + graphN2;
				$(divId).removeAttr("style");
				$(divId).attr("style", "text-align:center;")
				insertConveyorWeeklyAndMonthlyGraphData(response, graphN2);
			}

		}, error: function(response) {
			alert(response.responseText);


		}
	});

}


function loadAllConveyorWeeklyWiseData(graphN, graphN2, from, to, differene) {

	var formData = {
		graphName: graphN,
		dateTime: from + "," + to
	};

	$.ajax({
		type: 'POST',
		url: '/WebApplication/Controllers/getAllConveyorGraphDataDateWiseWeekly',
		async: false,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			/*	*/
			if (response.length == 0) {
				var divId = "#noData" + graphN2;
				$(divId).removeAttr("style");
				$(divId).attr("style", "text-align:center;background-color:red;color:white;")
			} else {
				var divId = "#noData" + graphN2;
				$(divId).removeAttr("style");
				$(divId).attr("style", "text-align:center;")
				insertConveyorWeeklyAndMonthlyGraphData(response, graphN2);
			}

		}, error: function(response) {
			alert(response.responseText);

		}
	});

}

function loadAllConveyorMonthlyWiseData(graphN, graphN2, from, to, difference) {

	var formData = {
		graphName: graphN,
		dateTime: from + "," + to
	};

	$.ajax({
		type: 'POST',
		url: '/WebApplication/Controllers/getAllConveyorGraphDataDateWiseMonthly',
		async: false,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			/*	*/
			if (response.length == 0) {
				var divId = "#noData" + graphN2;
				$(divId).removeAttr("style");
				$(divId).attr("style", "text-align:center;background-color:red;color:white;")
			} else {
				var divId = "#noData" + graphN2;
				$(divId).removeAttr("style");
				$(divId).attr("style", "text-align:center;")
				insertConveyorWeeklyAndMonthlyGraphData(response, graphN2);
			}

		}, error: function(response) {
			alert(response.responseText);


		}
	});

}

function loadConveyorDataViaDate(graphN, graphN2, dateTime) {

	var formData = {
		graphName: graphN,
		dateTime: dateTime
	};

	$.ajax({
		type: 'POST',
		url: '/WebApplication/Controllers/geConveyorGraphDataViaData',
		async: false,
		data: JSON.stringify(formData),
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			if (response.length == 0) {
				var divId = "#noData" + graphN2;
				$(divId).removeAttr("style");
				$(divId).attr("style", "text-align:center;background-color:red;color:white;")
			} else {
				var divId = "#noData" + graphN2;
				$(divId).removeAttr("style");
				$(divId).attr("style", "text-align:center;")
				insertConveyorGraphData(response, graphN2);
			}

		}, error: function(response) {
			alert(response.responseText);

		}

	});

}



function insertConveyorGraphData($item, graphN2) {

	var maxHeight = 0;
	var label = [];
	var actual = [];
	var target = [];
	var unitType = '';
	$.each($item, function(index, value) {
		label.push(value.deviceNumber);
		actual.push(value.actual);
		target.push(value.target);
	});


	var canvas = document.createElement('canvas'); // Create canvas element
	canvas.setAttribute("id", "canvas" + graphN2);
	canvas.setAttribute("class", "graphs");

	$("#canvasContainer" + graphN2).empty();
	$("#canvasContainer" + graphN2).append(canvas);

	const ctx = canvas.getContext('2d');
	Chart.register(ChartDataLabels);
	var myChart = new Chart(ctx, {

		type: actualType,
		data: {
			labels: label,
			datasets: [{
				label: 'Actual',
				data: actual,
				backgroundColor: actualColor,
				borderColor: actualColor,
				borderWidth: actualBorderWidth,
				datalabels: {
					display: true,
					color: 'black',
					anchor: 'start',
					align: 'end',
					rotation: -90,
					formatter: function(value, context) {

						var formattedValue = value.toFixed(2);

						if (unitType === '%') {
							return formattedValue + '%';
						} else {
							return formattedValue;
						}
					}
				}
			},/*{
                label: 'Bar Graph',
                data: actual,
                backgroundColor: 'red',
                borderColor: actualColor,
                borderWidth: actualBorderWidth
            }, */{
				label: 'Target',
				data: target, // Use data1 here
				type: targetType,
				fill: false,
				backgroundColor: targetColor,
				borderColor: targetColor,
				borderWidth: targetBorderWidth,
				datalabels: {
					display: false
				}
			}]
		},
		options: {
			responsive: false,
			plugins: {
				title: {
					display: false,
				}, datalabels: {
					display: false
				}
			},
			scales: {
				x: {
					grid: {
						display: false
					}
				},
				y: {
					beginAtZero: true,
					grid: {
						display: false
					}
				}
			}
		}
	});
}



function insertConveyorDateGraphData($item, graphN2) {

	var maxHeight = 0;
	var label = [];
	var actual = [];
	var target = [];
	var unitType = '';
	$.each($item, function(index, value) {
		label.push(value.dateTime.slice(0, 10));
		actual.push(value.actual);
		target.push(value.target);
	});


	var canvas = document.createElement('canvas'); // Create canvas element
	canvas.setAttribute("id", "canvas" + graphN2);
	canvas.setAttribute("class", "graphs");

	$("#canvasContainer" + graphN2).empty();
	$("#canvasContainer" + graphN2).append(canvas);

	const ctx = canvas.getContext('2d');
	Chart.register(ChartDataLabels);
	var myChart = new Chart(ctx, {

		type: actualType,
		data: {
			labels: label,
			datasets: [{
				label: 'Actual',
				data: actual,
				backgroundColor: actualColor,
				borderColor: actualColor,
				borderWidth: actualBorderWidth,
				datalabels: {
					display: true,
					color: 'black',
					anchor: 'start',
					align: 'end',
					rotation: -90,
					formatter: function(value, context) {

						var formattedValue = value;

						if (unitType === '%') {
							return formattedValue + '%';
						} else {
							return formattedValue;
						}
					}
				}
			},/*{
                label: 'Bar Graph',
                data: actual,
                backgroundColor: 'red',
                borderColor: actualColor,
                borderWidth: actualBorderWidth
            }, */{
				label: 'Target',
				data: target, // Use data1 here
				type: targetType,
				fill: false,
				backgroundColor: targetColor,
				borderColor: targetColor,
				borderWidth: targetBorderWidth,
				datalabels: {
					display: false
				}
			}]
		},
		options: {
			responsive: false,
			plugins: {
				title: {
					display: false,
				}, datalabels: {
					display: false
				}
			},
			scales: {
				x: {
					grid: {
						display: false
					}
				},
				y: {
					beginAtZero: true,
					grid: {
						display: false
					}
				}
			}
		}
	});
}


function insertConveyorAverageGraphData(response, graphN2) {

	var label = [];
	var actual = [];
	var target = [];
	var unitType = '';

	for (var i = 0; i < response.length; i++) {
		var str = response[i];
		var list = str.split(',');

		label.push(list[5]);
		actual.push(parseFloat(list[8]));
		target.push(parseFloat(list[9]));

		unitType = list[6];
	}

	var canvas = document.createElement('canvas');
	canvas.setAttribute("id", "canvas" + graphN2);
	canvas.setAttribute("class", "graphs");

	$("#canvasContainer" + graphN2).empty();
	$("#canvasContainer" + graphN2).append(canvas);

	const ctx = canvas.getContext('2d');
	Chart.register(ChartDataLabels);
	var myChart = new Chart(ctx, {
		type: actualType,
		data: {
			labels: label,
			datasets: [{
				label: 'Actual',
				data: actual,
				backgroundColor: actualColor,
				borderColor: actualColor,
				borderWidth: actualBorderWidth,
				datalabels: {
					display: true,
					color: 'black',
					anchor: 'start',
					align: 'end',
					rotation: -90,
					formatter: function(value, context) {

						var formattedValue = value.toFixed(2);

						if (unitType === '%') {
							return formattedValue + '%';
						} else {
							return formattedValue;
						}
					}
				}
			}, {
				label: 'Target',
				data: target,
				type: targetType,
				fill: false,
				backgroundColor: targetColor,
				borderColor: targetColor,
				borderWidth: targetBorderWidth,
				datalabels: {
					display: false
				}
			}]
		},
		options: {
			responsive: true,
			plugins: {
				title: {
					display: false,
					//text: 'Machine Wise Eff Trends'
				},
				datalabels: {
					display: false
				}
			},
			scales: {
				x: {
					grid: {
						display: false
					}
				},
				y: {
					beginAtZero: true,
					grid: {
						display: false
					},
					ticks: {
						callback: function(value, index, values) {

							if (unitType === '%') {
								return value.toLocaleString() + '%';
							} else {
								return value.toLocaleString();
							}
						}
					},
					title: {
						display: true,
						//text: (unitType === '%') ? 'Value (%)' : 'Value (Number)'
					}
				}
			}
		}
	});
}

function insertConveyorWeeklyAndMonthlyGraphData(response, graphN2) {

	var label = [];
	var actual = [];
	var target = [];
	var unitType = '';

	for (var i = 0; i < response.length; i++) {
		var str = response[i];
		var list = str.split(',');

		unitType = list[6];
		console.log("unitType", unitType)

		label.push(list[9]);

		if (unitType === '1') {
			actual.push(parseFloat(list[8]));
			target.push(parseFloat(list[4]));
		} else if (unitType === '%') {
			actual.push(parseFloat(list[8]));
			target.push(parseFloat(list[4]));
		} else {
			actual.push(parseFloat(list[8]));
			target.push(parseFloat(list[4]));
		}
	}

	var canvas = document.createElement('canvas');
	canvas.setAttribute("id", "canvas" + graphN2);
	canvas.setAttribute("class", "graphs");

	$("#canvasContainer" + graphN2).empty();
	$("#canvasContainer" + graphN2).append(canvas);

	const ctx = canvas.getContext('2d');
	Chart.register(ChartDataLabels);
	var myChart = new Chart(ctx, {
		type: actualType,
		data: {
			labels: label,
			datasets: [{
				label: 'Actual',
				data: actual,
				backgroundColor: actualColor,
				borderColor: actualColor,
				borderWidth: actualBorderWidth,
				datalabels: {
					display: true,
					color: 'black',
					anchor: 'start',
					align: 'end',
					rotation: -90,
					formatter: function(value, context) {

						var formattedValue = value.toFixed(2);

						if (unitType === '%') {
							return formattedValue + '%';
						} else {
							return formattedValue;
						}
					}
				}
			}, {
				label: 'Target',
				data: target,
				type: targetType,
				fill: false,
				backgroundColor: targetColor,
				borderColor: targetColor,
				borderWidth: targetBorderWidth,
				datalabels: {
					display: false
				}
			}]
		},
		options: {
			responsive: true,
			plugins: {
				title: {
					display: false,
					//text: 'Weekly and Monthly Graph Data'
				},
				legend: {
					position: 'top',
				},
				tooltip: {
					mode: 'index',
					intersect: false,
				},
				datalabels: {
					display: false
				}
			},
			scales: {
				x: {
					stacked: true,
					grid: {
						display: false
					}
				},
				y: {
					type: 'linear',
					position: 'left',
					beginAtZero: true,
					ticks: {
						callback: function(value, index, values) {

							if (unitType === '%') {
								return value.toLocaleString() + '%';
							} else {
								return value.toLocaleString();
							}
						}
					},
					title: {
						display: true,
						//text: (unitType === '%') ? 'Value (%)' : 'Value (Number)'
					}, grid: {
						display: false
					},
				}
			}
		}
	});
}


/*function insertConveyorWeeklyAndMonthlyGraphData(response, graphN2) {

	var maxHeight = 0;
	var label = [];
	var actual = [];
	var target = [];

	for (var i = 0; i < response.length; i++) {
		var str = response[i];
		var list = str.split(',');


		label.push(list[9]);
		actual.push(list[8]);
		target.push(list[4]);

	}

	var canvas = document.createElement('canvas'); // Create canvas element
	canvas.setAttribute("id", "canvas" + graphN2);
	canvas.setAttribute("class", "graphs");

	$("#canvasContainer" + graphN2).empty();
	$("#canvasContainer" + graphN2).append(canvas);

	const ctx = canvas.getContext('2d');

	var myChart = new Chart(ctx, {

		type: actualType,
		data: {
			labels: label,
			datasets: [{
				label: 'Actual',
				data: actual,
				backgroundColor: actualColor,
				borderColor: actualColor,
				borderWidth: actualBorderWidth
			},{
				label: 'Bar Graph',
				data: actual,
				backgroundColor: 'red',
				borderColor: actualColor,
				borderWidth: actualBorderWidth
			}, {
				label: 'Target',
				data: target, // Use data1 here
				type: targetType,
				fill: false,
				backgroundColor: targetColor,
				borderColor: targetColor,
				borderWidth: targetBorderWidth
			}]
		},
		options: {
			responsive: false,
			plugins: {
				title: {
					display: false,
				}, datalabels: {
					display: false
				}
			},
			scales: {
				x: {
					grid: {
						display: false
					}
				},
				y: {
					beginAtZero: true,
					grid: {
						display: false
					}
				}
			}
		}
	});
}
*/

//-----wiprejection--------

$(document).ready(function() {

	$(document).on('click', '#wipRejectionReport', function() {

		searchLoad = false; clearInterval(interval); interval = null;
		$(".fromTo").css("display", "block");
		$("#excelDownload").css("display", "block");
		$("#pageSelect").css("display", "block");
		$("#printPreview").css("display", "none");
		$("#next").css("display", "block");
		$("#previous").css("display", "block");
		$("#backToHarness").css("display", "none");
		$("#toggleActionFilterBtn").closest(".switch").css("display", "none");
				
		$("#offcanvasCloseButton").click();

		var child1 = document.getElementById("div3");
		var child2 = document.getElementById("div4");

		child1.remove();
		if (child2) { child2.remove(); }

		document.getElementById("masterHeading").innerText = "";
		$("#masterHeading").append("WORK IN PROGRESS REJECTION REPORT");

		var div3 = document.createElement("div");
		var div4 = document.createElement("div");

		$("#div2").append(div3);

		div3.setAttribute("id", "div3");
		div3.setAttribute("class", "masterBody");

		div4.setAttribute("id", "div4");
		div4.setAttribute("class", "masterBody");
		div4.setAttribute("Style", "overflow-y:scroll;");

		var bottom = document.createElement("div");

		bottom.setAttribute("id", "bottom");
		/*	bottom.setAttribute("style","height: 50%;")*/

		$("#div4").append(bottom);

		var element1 = document.createElement("table");
		$("#div3").append(element1);
		element1.setAttribute("id", "table1");
		element1.setAttribute("cellspacing", "0px");
		/*element1.setAttribute("cellpaddding","10px");*/
		element1.setAttribute("class", "table-hover");

		var w = window.innerWidth;

		if (w < 500) {
			element1.setAttribute("style", "width:300%;");
		} else if (w < 1100) {
			element1.setAttribute("style", "width:250%;");
		}
		else if (w < 1500) {
			element1.setAttribute("style", "width:100%;");
		} else if (w < 1000) {
			element1.setAttribute("style", "width:150%;");
		} else {
			element1.setAttribute("style", "width:100%;");
		}


		var element1_1 = document.createElement("thead");
		element1.append(element1_1);

		var element1_2 = document.createElement("tr");


		var element1_3 = document.createElement("tbody");
		element1.append(element1_3)
		element1_3.setAttribute("id", "tableBody");


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

		var searchTitles = ["searchPartCode", "searchBatchCode"];

		for (var i = 0; i < searchTitles.length; i++) {
			var searchContainer = document.createElement("th");
			searchContainer.setAttribute("class", "tableheading");
			var searchinput = document.createElement("input");
			var list = document.createElement("datalist")
			searchinput.setAttribute("style", "width:100%;");
			searchinput.setAttribute("title", searchTitles[i]);
			searchinput.setAttribute("list", searchTitles[i]);
			list.setAttribute("id", searchTitles[i]);
			searchinput.setAttribute("class", "searchFilterClass inputs");
			searchContainer.append(searchinput, list);
			searchRow.append(searchContainer);
		}

		element1_1.append(searchRow);
		element1_1.append(element1_2);

		var element2 = document.createElement("th");
		element2.innerText = "S.No.";
		var element3 = document.createElement("th");
		element3.innerText = "Part Code";
		var element3_2 = document.createElement("th");
		element3_2.innerText = "Batch Code.";
		var element4 = document.createElement("th");
		element4.innerText = "Circuit Number";
		var element5 = document.createElement("th");
		element5.innerText = "Planing Date";
		var element6 = document.createElement("th");
		element6.innerText = "Quantity";
		var element6_3 = document.createElement("th");
		element6_3.innerText = "Location";
		var element6_4 = document.createElement("th");
		element6_4.innerText = "Date-Time";
		var element7 = document.createElement("th");
		element7.innerText = "Created By";
		var element7_1 = document.createElement("th");
		element7_1.innerText = "Status";



		element1_2.append(element2, element3, element3_2, element4, element6, element5, element6_3, element6_4, element7,);
		element2.setAttribute("class", "tableheading");
		// element2.setAttribute("scope","col");
		element3.setAttribute("class", "tableheading");
		// element3.setAttribute("scope","col");
		element3_2.setAttribute("class", "tableheading");
		// element3.setAttribute("scope","col");
		element4.setAttribute("class", "tableheading");
		// element4.setAttribute("scope","col");
		element5.setAttribute("class", "tableheading");
		// element5.setAttribute("scope","col");
		element6.setAttribute("class", "tableheading");
		// element6.setAttribute("scope","col");
		element6_3.setAttribute("class", "tableheading");
		element6_4.setAttribute("class", "tableheading");
		// element6_3.setAttribute("scope","col");
		element7.setAttribute("class", "tableheading");
		element7_1.setAttribute("class", "tableheading");
		// element7.setAttribute("scope","col");
		// element9.setAttribute("scope","col");

		var element18_2 = document.createElement("div");
		element18_2.setAttribute("class", "buttonsContainer");

		var element41 = document.createElement("div");
		element41.setAttribute("class", "buttonsContainer");

		var element44 = document.createElement("button");
		element44.setAttribute("class", "data");
		element44.setAttribute("title", "Excel Download");

		element41.append(element44);
		element18_2.append(element41);

		$("#bottom").append(element18_2);
		$("#pageSelect").empty();
		getAllMindaPartInList();

	});

});


function searchWipRejection(page) {

	searchLoad = true;

	var fromDate = $("#from").val();
	var toDate = $("#to").val();
	var partCode = $('input[title="searchPartCode"]').val() ?? '';

	if (!fromDate && !toDate) {
		alert("Please select from and to date to get WIP rejection report.");
		return;
	}

	var formData = {
		fromDate: fromDate,
		toDate: toDate,
		partCode: partCode
	};

	$("#loadingBackdropButton").click();
	$("#loadingBackdropModalMessage").text("Getting WIP rejection report.");


	$.ajax({
		type: 'POST',
		url: '/WebApplication/Controllers/getWidRejection/' + page,
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		data: JSON.stringify(formData),
		success: function(data) {

			if (data.length === 0) {
				alert("Data is not present");
			} else {
				console.log("hola")
				makePagerByTotalPages(data, page)
				insertwiprejectionreportInTable(data.content);
				wiprejectionresponse = data;
				setTimeout(function() {
					$("#loadingBackdropButton").click();
				}, 500);
			}
		},
		error: function(xhr, status, error) {
			alert(xhr.responseText);
			setTimeout(function() {
				$("#loadingBackdropButton").click();
			}, 500);
		}
	});
}




function downloadTemplateAsExcel(data) {
	const filename = 'WIPREJECTION.xlsx';
	const sheetName = 'WIP REJECTION';
	const headers = ['Part-Number', 'Ckt-Number', 'Location', 'Plan-Date', 'Quantity', 'Date-Time', 'Created-By'];


	const formattedData = data.map(entry => {
		return {
			'Part-Number': entry.partCode,
			'Ckt-Number': entry.cktNumber,
			'Location': entry.location,
			'Plan-Date': entry.plandate,
			'Quantity': entry.quantity,
			'Date-Time': entry.datetime,
			'Created-By': entry.createdBy,

		};
	});

	const worksheet = XLSX.utils.json_to_sheet(formattedData, { header: headers });
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

	const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
	const blob = new Blob([wbout], { type: 'application/octet-stream' });

	if (navigator.msSaveBlob) {
		navigator.msSaveBlob(blob, filename);
	} else {
		const link = document.createElement('a');
		const url = URL.createObjectURL(blob);
		link.setAttribute('href', url);
		link.setAttribute('download', filename);
		link.style.visibility = 'hidden';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
}



function insertwiprejectionreportInTable($item) {

	$("#tableBody").empty();


	var tablebody = document.createElement("tbody");
	tablebody.setAttribute("id", "tableBody13");

	$("#table1").append(tablebody);



	$.each($item, function(index, value) {
		Object.keys(value).forEach(function(key) {
			if (value[key] === null) {
				value[key] = '';
			}
		});

		var row = '<tr class="tableDataRows">' +
			'<td data-column="columnId" style="width:50px">' + (1 + parseInt(index)) + '</td>' +
			'<td data-column="partCode" style="width:100px">' + value.partCode + '</td>' +
			'<td data-column="batchCode">' + value.cktNumber + '</td>' +
			'<td data-column="cktNumber">' + value.batchCode + '</td>' +
			'<td data-column="quantity">' + value.quantity + '</td>' +
			'<td data-column="plandate">' + value.plandate + '</td>' +
			'<td data-column="location">' + value.location + '</td>' +

			'<td data-column="dateTime" style="width:150px">' + value.dateTime + '</td>' +
			'<td data-column="createdBy" style="width:150px">' + value.createdBy + '</td>' +

			'<td data-column="wiprejectionId" style="display:none;">' + value.wipRejectionId + '</td>' +
			'</tr>';

		$('#table1').append(row);
	});
}





$(document).ready(function() {

	$(document).on('click', '#receivingQualityReport', function() {

		searchLoad = false; clearInterval(interval);

		$(".fromTo").css("display", "block");
		$("#excelDownload").css("display", "block");
		$("#pageSelect").css("display", "block");
		$("#printPreview").css("display", "none");
		$("#toggleImageBtn").css("display","none");
		$("#toggleImageBtndiv").css("display","none");
		$("#next").css("display", "block");
		$("#previous").css("display", "block");
		$("#backToHarness").css("display", "none");
		//$("#toggleActionFilterBtn").css("display", "inline-block");
		$(".switch").css("display", "inline-block");

		$("#offcanvasCloseButton").click();
		

		var child1 = document.getElementById("div3");
		var child2 = document.getElementById("div4");

		child1.remove();
		if (child2) { child2.remove(); }

		document.getElementById("masterHeading").innerText = "";
		$("#masterHeading").append("RECEIVING QUALITY REPORT");

		var div3 = document.createElement("div");
		var div4 = document.createElement("div");

		$("#div2").append(div3, div4);

		div3.setAttribute("id", "div3");
		div3.setAttribute("class", "masterBody emptyContainer");

		div4.setAttribute("id", "div4");
		div4.setAttribute("class", "masterBody");
		div4.setAttribute("Style", "overflow-y:scroll; display:none;");

		var bottom = document.createElement("div");

		bottom.setAttribute("id", "bottom");
		/*	bottom.setAttribute("style","height: 50%;")*/

		$("#div4").append(bottom);

		var element1 = document.createElement("table");
		$("#div3").append(element1);
		element1.setAttribute("id", "table1");
		element1.setAttribute("cellspacing", "0px");
		/*element1.setAttribute("cellpaddding","10px");*/
		element1.setAttribute("class", "table-hover");

		var w = window.innerWidth;

		if (w < 500) {
			element1.setAttribute("style", "width:300%;");
		} else if (w < 1100) {
			element1.setAttribute("style", "width:250%;");
		}
		else if (w < 1500) {
			element1.setAttribute("style", "width:100%;");
		} else if (w < 1000) {
			element1.setAttribute("style", "width:150%;");
		} else {
			element1.setAttribute("style", "width:100%;");
		}

		var element1_1 = document.createElement("thead");
		element1.append(element1_1);

		var element1_2 = document.createElement("tr");


		var element1_3 = document.createElement("tbody");
		element1.append(element1_3)
		element1_3.setAttribute("id", "tableBody");


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

		var searchTitles = ["searchPartCode", "searchBatchCode", "searchMRNDate", "searchSupplier", "searchResult"];

		for (var i = 0; i < searchTitles.length; i++) {
			var searchContainer = document.createElement("th");
			searchContainer.setAttribute("class", "tableheading");
			var searchinput = document.createElement("input");
			var list = document.createElement("datalist")
			searchinput.setAttribute("style", "width:100%;");
			searchinput.setAttribute("title", searchTitles[i]);
			searchinput.setAttribute("list", searchTitles[i]);
			list.setAttribute("id", searchTitles[i]);
			searchinput.setAttribute("class", "searchFilterClass inputs");
			searchContainer.append(searchinput, list);
			searchRow.append(searchContainer);
		}

		element1_1.append(searchRow);
		element1_1.append(element1_2);


		var element2 = document.createElement("th");
		element2.innerText = "S.No.";
		var element3 = document.createElement("th");
		element3.innerText = "Part No.";
		var element3_2 = document.createElement("th");
		element3_2.innerText = "MRN No.";
		var element3_2_1 = document.createElement("th");
		element3_2_1.innerText = "MRN Date";
		var element3_2_2 = document.createElement("th");
		element3_2_2.innerText = "Supplier";
		var element4 = document.createElement("th");
		element4.innerText = "Result";
/*		var element4_1 = document.createElement("th");
		element4_1.innerText = "Inspec. remark";*/
		var element4_2 = document.createElement("th");
		element4_2.innerText = "Description";
		var element5 = document.createElement("th");
		element5.innerText = "Total Qty";
		var element5_1 = document.createElement("th");
		element5_1.innerText = "Pass Qty";
		var element6 = document.createElement("th");
		element6.innerText = "Fail Qty";
		var element6_3 = document.createElement("th");
		element6_3.innerText = "Deviation Qty";
		var element7 = document.createElement("th");
		element7.innerText = "RQC Head Remark";
		var element8 = document.createElement("th");
		element8.innerText = "Checked By";
		var element8_2 = document.createElement("th");
		element8_2.innerText = "Date Time";
		/*var element9 = document.createElement("th");
		element9.innerText = "Assembly";
		var element9 = document.createElement("th");
		element9.innerText = "Date & Time";
		var element9_2 = document.createElement("th");
		element9_2.innerText = "Id";*/


		element1_2.append(element2, element3, element3_2, element3_2_1, element3_2_2, element4, element4_2,  element8, element8_2, element5, element5_1, element6, element6_3); // ,element7, element4_1,
		element2.setAttribute("class", "tableheading");
		// element2.setAttribute("scope","col");
		element3.setAttribute("class", "tableheading");

		// element3.setAttribute("scope","col");
		element3_2.setAttribute("class", "tableheading");
		element3_2_1.setAttribute("class", "tableheading");
		element3_2_2.setAttribute("class", "tableheading");
		// element3.setAttribute("scope","col");
		element4.setAttribute("class", "tableheading");
		// element4.setAttribute("scope","col");
		//element4_1.setAttribute("class", "tableheading");
		element4_2.setAttribute("class", "tableheading");
		// element4.setAttribute("scope","col");
		element5.setAttribute("class", "tableheading");
		element5_1.setAttribute("class", "tableheading");
		// element5.setAttribute("scope","col");
		element6.setAttribute("class", "tableheading");
		// element6.setAttribute("scope","col");
		element6_3.setAttribute("class", "tableheading");
		// element6_3.setAttribute("scope","col");
		element7.setAttribute("class", "tableheading");
		// element7.setAttribute("scope","col");
		element8.setAttribute("class", "tableheading");
		element8_2.setAttribute("class", "tableheading");
		// element8.setAttribute("scope","col");
		/*element9.setAttribute("class", "tableheading");
		element9_2.setAttribute("class", "tableheading");
		element9_2.setAttribute("style", "display:none;");
		// element9.setAttribute("scope","col");*/

		var element18_2 = document.createElement("div");
		element18_2.setAttribute("class", "buttonsContainer");

		var element41 = document.createElement("div");
		element41.setAttribute("class", "buttonsContainer");

		var element44 = document.createElement("button");
		element44.setAttribute("class", "data");
		element44.setAttribute("title", "Excel Download");

		element41.append(element44);
		element18_2.append(element41);

		$("#bottom").append(element18_2);

		$("#pageSelect").empty();
		getCurrentDate();
	});
});



function loadReceivingQualityReport(page) {

	searchLoad = true;

	var partNumber = $('input[title="searchPartCode"]').val() ?? '';
	var batchCode = $('input[title="searchBatchCode"]').val() ?? '';
	var supplier = $('input[title="searchSupplier"]').val() ?? '';
	var result = $('input[title="searchResult"]').val() ?? '';
	var from = $("input[name=from]").val();
	var to = $("input[name=to]").val();
	var mrnDate = $('input[title="searchMRNDate"]').val() ?? '';


	// Use default very old date range if filtering only "Action Required"
	if (showOnlyActionRequired) { 
		// if action only button is selected 
		from = "2025-01-01";  // so all data will get fetch having action required
		to = new Date().toISOString().split("T")[0]; // Today's date in yyyy-mm-dd
		
		// 🔽 Update the UI so user sees these dates
		$("input[name=from]").val(from);
		$("input[name=to]").val(to);
	} else {  
		// Validate user has selected dates
		if (!from || !to) { // Use date only when not filtering action required
			alert("Please select the date to get Receiving quality data.");
			return false;
		}
	}
	

	$("#loadingBackdropButton").click();
	$("#loadingBackdropModalMessage").text("Getting Receiving Quality Report.");

	var formdata = {
		partNumber: partNumber,
		batchCode: batchCode,
		mrnDate: mrnDate,
		result: result,
		supplier: supplier,
		datetime: from + "," + to
	}

	console.log(formdata);

	$.ajax({
		url: "/WebApplication/Controllers/getReceivingQualityResult1/" + page,
		type: 'POST',
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		data: JSON.stringify(formdata),
		success: function(response) {

			console.log("loadReceivingQualityReport response", response);
			makePagerByTotalPages(response, page)
			loadUserDepartmentAndRenderTable(response.content);
			$("#div3").removeClass("emptyContainer");
			setTimeout(function() {
				$("#loadingBackdropButton").click();

			}, 500);


		}, error: function(response) {
			setTimeout(function() {
				$("#loadingBackdropButton").click();
				alert(response.responseText);
			}, 500);

		}
	});
}



function loadUserDepartmentAndRenderTable(data) {
	var employeeId = sessionStorage.getItem('employeeId');

	$.ajax({
		url: "/WebApplication/Controllers/getDepartmentByEmployeeId/" + employeeId,
		type: 'GET',
		headers: {
			Authorization: `Bearer ${sessionStorage.getItem('token')}`
		},
		success: function(response) {

			// console.log("response : ", response);
			if (response && response.department) {
				sessionStorage.setItem('userDepartment', response.department.toLowerCase());
			} else {
				sessionStorage.setItem('userDepartment', '');
			}

/*			// ✅ Auto-enable Action Required only button for plant head or quality
			if (response.department.toLowerCase() === 'plant head' || department === 'quality') {
				showOnlyActionRequired = true;
				document.getElementById('toggleActionFilterBtn').checked = true;

				// Also update the date fields
				const from = "2025-01-01";
				const to = new Date().toISOString().split("T")[0];
				$("input[name=from]").val(from);
				$("input[name=to]").val(to);
			}*/
			
			insertrqcresiltInTable(data);
		},
		error: function(err) {
			console.error("Failed to fetch department info", err);
			alert("Unable to load department info. Please try again.");
		}
	});
}

let showOnlyActionRequired = false;

document.getElementById('toggleActionFilterBtn').addEventListener('change', function () {
    showOnlyActionRequired = this.checked; // true if checked, false if unchecked

    // You can optionally log this
   // console.log("Filter active:", showOnlyActionRequired);
   
   
   if (!showOnlyActionRequired) { // when toggle from action only to show all so change date
   	const today = new Date().toISOString().split("T")[0];

   	// Set both FROM and TO to today’s date
   	$("input[name=from]").val(today);
   	$("input[name=to]").val(today);
   }


    // Reload table with new filter
    loadReceivingQualityReport(0);
	// for action required it will fetch for all the dates and for all it will take the dates selected
});


function insertrqcresiltInTable($item) {
	
	let showColumn = 0;

	$("#tableBody").remove();
	var tablebody = document.createElement("tbody");
	$("#table1").append(tablebody);
	tablebody.setAttribute("id", "tableBody");

	var sequenceNumber = pageSize * parseInt($('#pageSelect :selected').val());
	var employId = sessionStorage.getItem('employeeId');
	var userDepartment = sessionStorage.getItem('userDepartment');

	var userRole = sessionStorage.getItem('role').toLowerCase();

	let showActionColumn = false;

	// Step 1: Create map for repeat fail check
	const failureMap = {};
	$item.forEach(item => {
		if (item.result?.toLowerCase() === 'fail') {
			//console.log(item);
			const repeatKey = `${item.partNumber}_${item.supplier}`;
			if (!failureMap[repeatKey]) failureMap[repeatKey] = [];
			failureMap[repeatKey].push(item);
		}
	});
	window.globalFailureMap = failureMap; // sending it in window so to use in populateInlineRemarkSection()
	
	let needsAction; // true if urgent // for DMR BUTTON and when toggling button so adding row at end of this $.each()
	
	// Step 2: Build rows
	$.each($item, function(index, value) {

		const uiKey = `${value.partNumber}_${value.batchCode}_${value.supplier}`; // used in DOM

		//console.log("uiKey",uiKey);
		const repeatKey = `${value.partNumber}_${value.supplier}`; // used for logic

		let row = `<tr class="tableDataRows" data-uikey="${uiKey}">` +
			`<td data-column="columnId" style="width:20px;">${1 + parseInt(sequenceNumber)}</td>` +
			`<td data-column="partNumber" style="width:100px;">${value.partNumber}</td>` +
			`<td data-column="batchCode" style="width:80px;">${value.batchCode}</td>` +
			`<td data-column="mrnDate" style="width:100px;">${value.mrnDate}</td>` +
			`<td data-column="supplier" style="width:80px;">${value.supplier}</td>` +
			`<td data-column="result" style="width:100px; background-color: ${value.result?.toLowerCase() === 'pass' ? '#15f705' : value.result?.toLowerCase() === 'fail' ? '#ff0505' : 'inherit'}; color: ${value.result?.toLowerCase() === 'pass' ? 'black' : value.result?.toLowerCase() === 'fail' ? 'white' : 'inherit'};">${value.result}</td>` +
			`<td data-column="description" style="width:200px; text-align:left; padding-left:10px;">${value.description}</td>` +
			`<td data-column="createdBy" style="width:80px;">${value.createdBy}</td>` +
			`<td data-column="dateTime" style="width:120px;">${value.datetime}</td>` +
			`<td data-column="qty" style="width:100px;">${value.qty}</td>` +
			`<td data-column="passQty" style="width:100px;">${value.passQty}</td>` +
			`<td data-column="failQty" style="width:100px;">${value.failQty}</td>` +
			//`<td data-column="deviationQty" style="width:100px;">${value.deviationQty}</td>` +
			`<td data-column="deviationQty" style="width:100px;">${value.deviationQty}</td>`;
			
			if (userDepartment === 'rqc' && userRole === 'administrator') {
				row += `<td data-column="inspectionRemark" style="width:150px;">${value.inspectionRemark != null ? value.inspectionRemark : '-'}</td>`;
			}
				if (showColumn == 1) {	row += `<td data-column="rqcFormRemark" style="width:100px; display:none;">
				${value.rqcFormRemark != null ? value.rqcFormRemark : '-'}</td>`}



				needsAction = false;// by default value
				
		// Handle action button logic only for 'fail' rows
		if (value.result?.toLowerCase() === 'fail') {
			const failDate = new Date(value.datetime);
			const now = new Date();
			const fifteenDaysLater = new Date(failDate);
			fifteenDaysLater.setDate(failDate.getDate() + 15);
			
			const sevenDaysLater = new Date(failDate);
			sevenDaysLater.setDate(failDate.getDate() + 7);
			
			// Using rqcFormRemark instead of remarks
			const rqcFormRemarkLower = (value.rqcFormRemark || '').toLowerCase();

			// Check for repeat fail within 15 days			
			const isRepeatFailWithin15Days = failureMap[repeatKey]?.some(item => {
				//  has the same part number, batch code, and supplier.
				if (item === value) return false;
				const itemDate = new Date(item.datetime);
				const daysDiff = Math.abs(itemDate - failDate) / (1000 * 60 * 60 * 24);
				// previous record has RQC remarks filled
				const isNoRqcRemark = !item.rqcFormRemark || item.rqcFormRemark.trim() === '';

				return daysDiff <= 15 && item.result?.toLowerCase() === 'fail' && isNoRqcRemark;
			});


			let shouldShowButton = false;
			let isRqcButtonDisabled = false;


			if (userDepartment === 'rqc') {
				if (!value.rqcFormRemark || value.rqcFormRemark.trim() === '') {
					// RQC shows button only if not repeat fail and within 15 days
					if (!isRepeatFailWithin15Days && now <= fifteenDaysLater) {
						shouldShowButton = true;
					} else { // if repeatfail or may be after 15 days.
						isRqcButtonDisabled = true;
						shouldShowButton = true; // Show button as disabled
					}
				}
			} else if (userDepartment === 'plant head' || userDepartment === 'quality') {
				if (!value.rqcFormRemark || value.rqcFormRemark.trim() === '') {
					// no rqc remark present and either 15 days passed or isRepeatFailWithin15Days
					if (isRepeatFailWithin15Days || now > fifteenDaysLater || now > sevenDaysLater ) { // now after 7 days it starts showing.
						shouldShowButton = true;
					} 
				}
			}
			
				// DMR Button
			if ((userDepartment === 'rqc' && userRole === 'administrator') || userDepartment === 'purchase' 
				|| userDepartment === 'plant head' || userDepartment === 'quality') {
					
					// this below condition will not work for purchase
				if (shouldShowButton) { // for rqc and plant head or quality head
					needsAction=true;
					//console.log(needsAction , "in 1st if", 1 + parseInt(sequenceNumber));
					//console.log(needsAction);
				}
					// console.log(needsAction);
				
				if (userDepartment === 'rqc') {// Re-release disapproved
					const rerelease = Number(value.rereleaseApproval);
					//If Re-release disapproved by either rqc head or plant head or quality head→ needs action again
					if (rerelease === 3 || rerelease === 5 || rerelease === 7) {
							// Re-release was disapproved by someone; action needed again
						    needsAction = true;
					}
					
					// after re-relase dissaprove and rqc head taken action for the send back
					const backSupplier = Number(value.backSupplierApproval);
									
					if (value.backSupplierApproval !== null && backSupplier === 0){
						needsAction = false;
						
					} 
					
				}
	
				if (userDepartment === 'rqc') {  // for if finalize button is enabled in modal
						let approvalStatus = '-';
						let showConfirmBtn = false;						

						const rerelease = Number(value.rereleaseApproval);
						const backSupplier = Number(value.backSupplierApproval);

						// ✅ If re-release or send-back was approved → show finalize button
						if (backSupplier === 2) {
							approvalStatus = '✅ Send Back to Suppl. Approved (Purchase)';
							showConfirmBtn = false;
						} else if (rerelease === 6) {
							approvalStatus = '✅ Re-release Approved (Plant Head)';
							showConfirmBtn = true;
						}  else if (rerelease === 8) {
							approvalStatus = '✅ Re-release Approved (Quality)';
							showConfirmBtn = true;
						} 
						// Final Action Column
						if (showConfirmBtn) {
							if (value.actionTaken === "1" || value.actionTaken === "2") {
								needsAction=false;
							}else{
								needsAction=true;
							}
						}
						
						const isBackSupplierApproved = value.backSupplierApproval !== null && backSupplier === 2;
						if(isBackSupplierApproved){ // purchase made the send back approved so now not to show the action required to RQC.
							needsAction=false;
						}
						// console.log(needsAction , "in 2st if", 1 + parseInt(sequenceNumber));
						
				}
				
			
				if (userDepartment === 'purchase') {
						// Determine the "Action For" text based on RQC flags
						let showActionButton = false;

						if (value.backSupplierApproval !== null && value.backSupplierApproval !== '' && Number(value.backSupplierApproval) === 0) {
							showActionButton = true;
						} else if (value.rereleaseApproval !== null && value.rereleaseApproval !== '' && Number(value.rereleaseApproval) === 0) {
							showActionButton = true;
						}
						if (showActionButton) {
							needsAction=true;
						}
						
				}
				if (userDepartment === 'plant head' || userDepartment === 'quality') {
						// Check if final action was already taken
						const rereleaseStatus = Number(value.rereleaseApproval);
						// Loop through records and render rows
						if (rereleaseStatus === 4) { // sent to plant head or quality head
							// Action pending – show button
							needsAction=true;
						}
						
						if(value.plantPermanentTimestamp || value.plantRejectTimestamp){ //null and undefined are falsy
							needsAction = false;
						}
				}
					
				let buttonText = needsAction ? '⚠ Action Required' : 'View DMR';
				let buttonClass = needsAction ? 'btn-warning' : 'btn-secondary';
					row += `
					  <td>
					    <button 
					      class="btn ${buttonClass} btn-sm open-dmr ${needsAction ? 'animate-pulse' : ''}" 
					      data-part="${value.partNumber}" 
					      data-batch="${value.batchCode}" 
					      data-supplier="${value.supplier}" 
					      data-qty="${value.qty}"  
					      data-uikey="${uiKey}"
						  data-department="${userDepartment}" 
					      style="padding:2px 5px; font-size:12px;">
					      ${buttonText}
					    </button>
					  </td>`;
			}
			
			
			// deviation history column for plant head and quality
			if (userDepartment === 'plant head' || userDepartment === 'quality') {
				// if(needsAction){ // if needsAction is true  //  always show deviation history
			    row += `
			      <td>
			        <button 
			          class="btn btn-info btn-sm open-deviation-history" 
			          data-part="${value.partNumber}"
			          style="padding:2px 5px; font-size:12px;">
			          View History
			        </button>
			      </td>`;
				  // }
			}
						
		} // failure loop closed

		/// outside of failure column
		
		// Hidden column
		row += `<td data-column="rqcResultId" style="display:none;">${value.rqcResultId}</td></tr>`;

		//  $('#table1').append(row);
		// If filtering is OFF (showOnlyActionRequired === false) → show all rows.
		// 		If filtering is ON (true) → only show rows where needsAction === true.
		if (!showOnlyActionRequired || needsAction) {
		    $('#table1').append(row);
		}

		window.rqcRowDataMap[uiKey] = value; // Save full object
		
		//console.log(value);
		// console.log(window.rqcRowDataMap);

		sequenceNumber++;
	});

	// Add Action column header if necessary
	const $thead = $('#table1 thead');
	if ($thead.length) {
		//if only one <tr> exists in <thead>, this may fail silently
		const $headerRow = $thead.find('tr').length > 1 ? $thead.find('tr').eq(1) : $thead.find('tr').eq(0);

		const columnsToAdd = [];

		if (userDepartment === 'rqc' && userRole === 'administrator') {
			if (!$headerRow.find('th.inspection-remark-header').length) {
				columnsToAdd.push('<th class="inspection-remark-header" style="width:150px;color:white;background-color:#1a1a1a;font-size:16px">Inspection Remark</th>');
			}
		}

		if (!$headerRow.find('th.dmr-header').length) {
			columnsToAdd.push('<th class="dmr-header" style="width:120px; color:white; background-color:#1a1a1a; font-size:16px;">DMR</th>');
		}
		if (userDepartment === 'plant head' || userDepartment === 'quality') {
			if (!$headerRow.find('th.deviation-history-header').length)
				columnsToAdd.push('<th class="deviation-history-header" style="width:180px;color:white;background-color:#1a1a1a;font-size:16px">Deviation history</th>');
		}

		if (columnsToAdd.length) {
			$headerRow.append(columnsToAdd.join(''));
		}
	}
}


function viewAttachment(filePath) {
	const token = sessionStorage.getItem('token');
	if (!token) {
		alert("Unauthorized: No token found.");
		return;
	}
	
	console.log(filePath );

	fetch(`/WebApplication/Controllers/download-attachment?filename=${encodeURIComponent(filePath)}`, {
		method: 'GET',
		headers: {
			'Authorization': `Bearer ${token}`
		}
	})
	.then(response => {
		if (!response.ok) {
			throw new Error("Failed to fetch file.");
		}
		return response.blob();
	})
	.then(blob => {
		const url = window.URL.createObjectURL(blob);
		const fileName = filePath.split('/').pop();// file path contains uploads\filename
		const ext = fileName.toLowerCase();
		

		if (ext.endsWith(".pdf") || ext.endsWith(".png") || ext.endsWith(".jpg") || ext.endsWith(".jpeg")) {
			window.open(url, "_blank"); // Open in new tab
		} else {
			const a = document.createElement("a");
			a.href = url;
			a.download = fileName;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		}
	})
	.catch(error => {
		console.error("Error viewing attachment:", error);
		alert("Unable to view/download attachment.");
	});
}


/*function insertrqcresiltInTable($item) {
	$("#tableBody").remove();
	var tablebody = document.createElement("tbody");
	$("#table1").append(tablebody);
	tablebody.setAttribute("id", "tableBody");

	var sequenceNumber = pageSize * parseInt($('#pageSelect :selected').val());
	var employId = sessionStorage.getItem('employeeId');
	var userRole = sessionStorage.getItem('userRole');

	// Flag to determine if "Action" column should be added
	var showActionColumn = false;

	// First pass to check if any item needs action button
	$.each($item, function(index, value) {
		if (value.result && value.result.toLowerCase() === 'fail') {
			var failDate = new Date(value.datetime);
			var fifteenDaysLater = new Date(failDate);
			fifteenDaysLater.setDate(failDate.getDate() + 15);
			var now = new Date();
			var remarksLower = (value.remarks || '').toLowerCase();
			var validRemarks = ['scrap', 'send back to supplier', 're-release'];

			var shouldShowButton = (
				(userRole === 'rqc' && now <= fifteenDaysLater && !validRemarks.includes(remarksLower)) ||
				(userRole === 'plant head' && now > fifteenDaysLater && !validRemarks.includes(remarksLower))
			);

			if (shouldShowButton) {
				showActionColumn = true;
				return false; // break loop early
			}
		}
	});

	// Rebuild header with "Action" column if needed
	var $thead = $('#table1 thead');
	if ($thead.length) {
		var $headerRow = $thead.find('tr').eq(1);
		if (showActionColumn && !$headerRow.find('th.action-header').length) {
			$headerRow.append('<th class="action-header" style="width:120px;color:white;background-color:	#1a1a1a;font-size:16px">Action</th>');
		}
	}

	// Now populate the table body
	$.each($item, function(index, value) {
		var row = '<tr class="tableDataRows">' +
			'<td data-column="columnId" style="width:20px;">' + (1 + parseInt(sequenceNumber)) + '</td>' +
			'<td data-column="partNumber" style="width:100px;">' + value.partNumber + '</td>' +
			'<td data-column="batchCode" style="width:80px;">' + value.batchCode + '</td>' +
			'<td data-column="supplier" style="width:80px;">' + value.supplier + '</td>' +
			'<td data-column="result" style="width:100px;">' + value.result + '</td>' +
			'<td data-column="description" style="width:200px; text-align:left; padding-left:10px;">' + value.description + '</td>' +
			'<td data-column="qty" style="width:100px;">' + value.qty + '</td>' +
			'<td data-column="passQty" style="width:100px;">' + value.passQty + '</td>' +
			'<td data-column="failQty" style="width:100px;">' + value.failQty + '</td>' +
			'<td data-column="deviationQty" style="width:100px;">' + value.deviationQty + '</td>' +
			'<td data-column="remarks" style="width:100px;">' + value.remarks + '</td>' +
			'<td data-column="createdBy" style="width:80px;">' + value.createdBy + '</td>' +
			'<td data-column="dateTime" style="width:100px;">' + value.datetime + '</td>';

		// Append Action button if applicable
		if (value.result && value.result.toLowerCase() === 'fail') {
			var failDate = new Date(value.datetime);
			var fifteenDaysLater = new Date(failDate);
			fifteenDaysLater.setDate(failDate.getDate() + 15);
			var now = new Date();
			var remarksLower = (value.remarks || '').toLowerCase();
			var validRemarks = ['scrap', 'send back to supplier', 're-release'];

			var shouldShowButton = (
				(userRole === 'rqc' && now <= fifteenDaysLater && !validRemarks.includes(remarksLower)) ||
				(userRole === 'plant head' && now > fifteenDaysLater && !validRemarks.includes(remarksLower))
			);

			if (shouldShowButton) {
				row += `
		  <td>
			<button 
			  class="actionTakenButton btn btn-sm btn-warning" 
			  style="padding: 5px 10px; font-size: 12px; border-radius: 5px;" 
			  data-rqcresultid="${value.rqcResultId}" 
			  data-faildate="${value.datetime}">
			  <i class="fas fa-check-circle" style="margin-right: 5px;"></i>Take Action
			</button>
		  </td>`;
			}
		}

		row += '<td data-column="rqcResultId" style="display:none;">' + value.rqcResultId + '</td></tr>';
		$('#table1').append(row);
		sequenceNumber++;
	});
}


*/


/*(function appendCustomActionButtonCSS() {
	
	if (document.getElementById('actionBtnStyle')) return; //prevent firing more than once 
	
	const style = document.createElement('style');
	style.innerHTML = `
    .actionTakenButton {
      background-color: #ff9800;
      color: white;
      border: none;
      padding: 6px 12px;
      font-size: 12px;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .actionTakenButton:hover {
      background-color: #e68900;
    }
  `;
	document.head.appendChild(style);
})();*/


function updateCountdown(endDate) {
	clearInterval(window.countdownInterval);

	// Display target date
	document.getElementById('targetDateSpan').textContent = endDate.toLocaleString();

	window.countdownInterval = setInterval(function() {
		const now = new Date();

		// Live Date
		document.getElementById('liveDateTimeSpan').textContent = now.toLocaleString();

		const distance = endDate - now;

		if (distance <= 0) {
			clearInterval(window.countdownInterval);
			document.getElementById('countdownTimerSpan').textContent = "Action Time Expired!";
			document.getElementById("countdownTimerSpan").style.backgroundColor = "#dc3545"; // red
		} else {
			const days = Math.floor(distance / (1000 * 60 * 60 * 24));
			const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((distance % (1000 * 60)) / 1000);

			document.getElementById('countdownTimerSpan').textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
		}
	}, 1000);
}



let counter = 0;

// Function to show date-time in desired format
function getCurrentDateTime() {
	const now = new Date();
	const year = now.getFullYear();
	const month = ('0' + (now.getMonth() + 1)).slice(-2);
	const day = ('0' + now.getDate()).slice(-2);
	const hours = ('0' + now.getHours()).slice(-2);
	const minutes = ('0' + now.getMinutes()).slice(-2);
	const seconds = ('0' + now.getSeconds()).slice(-2);

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Function to check if a date-time is within 15 days (including time)
function isWithin15Days(targetDateTimeStr) {
	const now = new Date();
	const targetDate = new Date(targetDateTimeStr);

	const diffInMs = now - targetDate;
	const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

	return diffInDays <= 15;
}


(function appendCustomActionButtonCSS() {
  if (document.getElementById('actionBtnStyle')) return;//prevent firing more than once 

  const style = document.createElement('style');
  style.id = 'actionBtnStyle';
  style.innerHTML = `
    .actionTakenButton {
      background-color: #ff9800;
      color: white;
      border: none;
      padding: 6px 12px;
      font-size: 12px;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .actionTakenButton:hover {
      background-color: #e68900;
    }
  `;
  document.head.appendChild(style);
})();


// ✅ Declare this globally once

$(document).on('click', '.actionTakenButton', function() {
	
	var $btn = $(this);
	var $row = $btn.closest('tr');
	
	var rereleaseApproval = Number($btn.data('rerelease'));


	// Print all row values for debugging
/*	$row.find('td').each(function(index) {
	    var columnText = $(this).text().trim();
	    console.log("Column " + index + ": " + columnText);
	});*/

	
	// Extract UI key to uniquely identify the row
	var uiKey = $btn.data('uikey'); // Comes from insertrqcresiltInTable
	var rqcResultId = $btn.data('rqcresultid');
	var failDateTime = $btn.data('faildate');

	// Extract other values
	var partNumber = $btn.data('partnumber');
	var batchCode = $btn.data('batchcode');
	var supplier = $btn.data('supplier');
	var totalquantity = $btn.data('qty');
	var failedquantity = $btn.data('failqty');
	var plantTemporaryTimestamp = $btn.data('planttemporarytimestamp');
	var plantPermanentTimestamp = $btn.data('plantpermanenttimestamp');
	var plantRejectTimestamp = $btn.data('plantrejecttimestamp');
	// console.log("plantRejectTimestamp", plantRejectTimestamp, "plantPermanentTimestamp", plantPermanentTimestamp,  "plantTemporaryTimestamp", plantTemporaryTimestamp  );
	
	console.log("Clicked UI Key:", uiKey);
	console.log("Supplier: ", supplier, "partNumber", partNumber, "batchCode", batchCode);

	var failDate = new Date(failDateTime);
	var endDate = new Date(failDate);
	endDate.setDate(failDate.getDate() + 15);

	// Save all values in a single place
	window.clickedRowData = {
		partNumber,
		batchCode,
		supplier,
		rqcResultId,
		totalquantity,
		failedquantity,
		uiKey,
		rereleaseApproval,
		plantTemporaryTimestamp,
		plantPermanentTimestamp,
		plantRejectTimestamp
	};

	window.targetEndDate = endDate;

	// Show confirmation modal (can also pass data into it here if needed)
	$('#confirmationBackdropModal').modal('dispose'); // Remove existing Bootstrap instance
	$('#confirmationBackdropModal').modal({
		backdrop: 'static',
		keyboard: false
	});
	
	const reReleaseBtn = document.getElementById('reReleaseBtn');
	const sendBackBtn = document.getElementById('sendBackBtn');
	const rereleaseDisapproved = [3, 5, 7].includes(window.clickedRowData.rereleaseApproval);

	// Reset both first (avoid stale state)
	if (reReleaseBtn) {
	    reReleaseBtn.disabled = false;

		reReleaseBtn.classList.remove('d-none');
	}
	if (sendBackBtn) {
	    sendBackBtn.disabled = false;
	}

	// Case 1: Plant Head permanent approval → disable Send Back
	if (plantPermanentTimestamp) { // permanent approval by plant head given
	    sendBackBtn.disabled = true; // 🔒 Disable
	}

	// Case 2: Re-release disapproved → disable re-release, enable send back
	if (rereleaseDisapproved) {  // disable re-release on when re-release dissaproved 
	    reReleaseBtn.disabled = true; // 🔒 Disable
		reReleaseBtn.classList.add('d-none');
	    sendBackBtn.disabled = false; // re-enable even if permanent approval earlier
	}

	// Case 3: Plant Head rejected → disable re-release, enable send back
	if (plantRejectTimestamp) { // plant head has rejected
		console.log("plantRejectTimestamp", plantRejectTimestamp);
	    reReleaseBtn.disabled = true; // 🔒 Disable
		reReleaseBtn.classList.add('d-none');
	    sendBackBtn.disabled = false;
	}


	$('#confirmationBackdropModal').modal('show');

	counter++;

	const currentDateTime = getCurrentDateTime();

	const dateTimeEl = document.getElementById('dateTimeSpan');
	if (dateTimeEl) dateTimeEl.textContent = currentDateTime;

	if (window.targetEndDate) {
		updateCountdown(window.targetEndDate);
	}

	// document.getElementById("confirmationBackdropButton").click();
		//1st way
/*		document.getElementById("confirmationBackdropButton").click();
		$('#confirmationBackdropModal').modal({
				    backdrop: 'static',
				    keyboard: false
				});*/
		 // 2nd way
/*		$('#confirmationBackdropModal').modal({
		    backdrop: 'static',
		    keyboard: false
		}).modal('show');
*/

});

(function appendPlantActionButtonCSS() {
  if (document.getElementById('plantActionBtnStyle')) return; // prevent duplicate injection

  const style = document.createElement('style');
  style.id = 'plantActionBtnStyle';
  style.innerHTML = `
    .plantActionTakenButton {
      background-color: #4CAF50; /* green tone for plant head */
      color: white;
      border: none;
      padding: 6px 12px;
      font-size: 12px;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .plantActionTakenButton:hover {
      background-color: #43a047; /* slightly darker on hover */
    }
  `;
  document.head.appendChild(style);
})();

// Function to calculate days passed
/*function calculateDaysPassed(failDate) {
    let now = new Date();
    let diffMs = now - failDate; // difference in milliseconds
    let days = Math.floor(diffMs / (1000 * 60 * 60 * 24)); // convert ms → days
    return days;
}
*/

function calculateTimePassed(failDate) {
  const now = new Date();
  const fail = new Date(failDate);

  const diffMs = now - fail;

  const totalMinutes = Math.floor(diffMs / (1000 * 60)); // ignore seconds
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  return { days, hours, minutes };
}

$(document).on('click', '.plantActionTakenButton', function() {
    var $btn = $(this);

	// Clear any existing interval before starting a new one
	if (window.timeSpentInterval) {
	    clearInterval(window.timeSpentInterval);
	}
    // Collect values (similar to RQC logic)
    var partNumber = $btn.data('partnumber');
    var batchCode = $btn.data('batchcode');
    var supplier = $btn.data('supplier');
    var rqcResultId = $btn.data('rqcresultid');
    const failDateTime = $btn.data('faildate');
	const failDate = new Date(failDateTime);
	var isRepeatFail = $btn.data('isrepeatfailwithin15days'); 
	var plantTemporaryTimestamp = $btn.data('planttemporarytimestamp'); 
	var plantPermanentTimestamp = $btn.data('plantpermanenttimestamp');
	var plantRejectTimestamp = $btn.data('plantrejecttimestamp');
	console.log("plantTemporaryTimestamp",plantTemporaryTimestamp);
	var uiKey = $btn.data('uikey');
	
    window.clickedRowData = {
        partNumber,
        batchCode,
        supplier,
        rqcResultId,
        failDateTime,
		isRepeatFail,
		plantTemporaryTimestamp,
		uiKey,
		plantPermanentTimestamp,
		plantRejectTimestamp
    };


		// Update modal values
	  document.getElementById('failedDateSpan').textContent = new Date(failDateTime).toLocaleString();
	  
	  
	  // Start a fresh interval for THIS row
	  window.timeSpentInterval = setInterval(function() {
	      const now = new Date();
	      document.getElementById('currentDateTimeSpan').textContent = now.toLocaleString();

		  // Update UI every second calculated "daysPassed"	
		  // let daysPassed = calculateDaysPassed(failDate); // fetched/calculated dynamically
		  // document.getElementById("timeSpentByRQC").innerText = daysPassed + " / 15 days";
		  
	      const { days, hours, minutes } = calculateTimePassed(failDate);
		  

		  const timeElem = document.getElementById("timeSpentByRQC");

		  if (days > 15) {
		      // Highlight when exceeded
		      timeElem.innerText = "15 days passed";
		      timeElem.style.backgroundColor = "red";   // 🔴 highlight
		      timeElem.style.color = "white";           // text visible
		      timeElem.style.fontWeight = "bold";

			  $("#temporaryApprovalBtn").hide();
		  } else {
		      // Normal display
		      timeElem.innerText = `${days} / 15 days, ${hours} hrs, ${minutes} mins`;
		      timeElem.style.backgroundColor = "";  // reset
		      timeElem.style.color = "";
		      timeElem.style.fontWeight = "";
		  }
	/*      document.getElementById("timeSpentByRQC").innerText =
	          `${days} / 15 days, ${hours} hrs, ${minutes} mins`;*/

	  }, 1000);

	  
	  // Show Plant Head modal 
	  setTimeout(function() {
	  	$('#confirmationPlantBackdropModal').modal({
	    	  backdrop: 'static',
	      	keyboard: false
	  	}).modal('show');
	  }, 1250); // delay 1.5s
	  
	  // Highlight Repeat Fail
	  const repeatEl = document.getElementById('repeatFailHighlight');
	  console.log("isRepeatFail", isRepeatFail);
	  if (isRepeatFail) {
	      repeatEl.textContent = "⚠ Repeat Failure within 15 days";
	      repeatEl.style.color = "red";
	      repeatEl.style.fontWeight = "bold";
	  } else {
	      repeatEl.textContent = "";
	  }
	  
	  
	  // 👇 Hide Temporary Approval button if already taken
	   if (plantTemporaryTimestamp && plantTemporaryTimestamp.trim() !== "") {
	       $("#temporaryApprovalBtn").hide();
		   
		   // Add message under repeatFailHighlight
		   repeatEl.innerHTML += "<br><span style='color:blue; font-weight:bold;'>Temporary action already taken</span>";

	   } else {
	       $("#temporaryApprovalBtn").show();
	   }
	   
	   
    // You can reuse updateCountdown() for #countdownTimerSpan
    // const failDate = new Date(failDateTime);
    const targetEndDate = new Date(failDate);
    targetEndDate.setDate(failDate.getDate() + 15);
    // updateCountdown(targetEndDate, "countdownTimerSpan");
});
/*
$('#confirmationPlantBackdropModal').on('hidden.bs.modal', function () {
    if (window.timeSpentInterval) {
        clearInterval(window.timeSpentInterval);
		console.log("called   ----------------")
        window.timeSpentInterval = null;
    }
});*/


// again show the confirmation modal so no accidental problem
$('#temporaryApprovalBtn').on('click', function() {
    console.log("Temporary Approval given by Plant Head", window.clickedRowData);
	openPlantConfirmationModal("Temporary");
    // TODO: Call backend API to mark temporary approval
    $('#confirmationPlantBackdropModal').modal('hide');
});

$('#permanentApprovalBtn').on('click', function() {
    console.log("Permanent Approval given by Plant Head", window.clickedRowData);
	
	openPlantConfirmationModal("Permanent");
    // TODO: Call backend API to mark permanent approval
    $('#confirmationPlantBackdropModal').modal('hide');
});


$(document).on("click", "#rejectBtn", function () {
	
	openPlantConfirmationModal("Reject");
    // alert("Currently no procedure defined for this !!!!");
	$('#confirmationPlantBackdropModal').modal('hide');
});

let plantActionType = null;
function openPlantConfirmationModal(type) {
	plantActionType = type.toLowerCase();  // "temporary" / "permanent"
   //  plantActionData = data;

    // Customize message
    let msg = "";
    switch (plantActionType) {
        case "temporary":
            msg = "Are you sure you want to give <strong>Temporary Approval</strong>?";
            break;
        case "permanent":
            msg = "Are you sure you want to give <strong>Permanent Approval</strong>?";
            break;
		case "reject":
			msg = "Are you sure you want to <strong style='color:red;'>Reject / Disapprove</strong> this supplier/part?";
			break;	
        default:
            msg = "Are you sure you want to continue?";
    }


    $("#plantConfirmationMessage").html(msg);
    $("#plantConfirmationModal").modal("show");
	
}

// Confirm click
$("#plantConfirmActionBtn").on("click", function () {
    $("#plantConfirmationModal").modal("hide");

    if (plantActionType === "temporary") {
        handlePlantAction("TEMPORARY", "Temporary Approval recorded successfully!");
    } else if (plantActionType === "permanent") {
        handlePlantAction("PERMANENT", "Permanent Approval recorded successfully!");
    } else if (plantActionType === "reject") {
        handlePlantAction("REJECT", "Reject recorded successfully!");
    }
});


function handlePlantAction(actionType, successMessage) {
    const userDepartment = sessionStorage.getItem('userDepartment');
    let payload = {
        rqcResultId: window.clickedRowData.rqcResultId,
        action: actionType.toUpperCase(),   // TEMPORARY / PERMANENT / REJECT
        userDepartment: userDepartment,
    };

    const uiKey = window.clickedRowData.uiKey;
    console.log("uiKey", uiKey);
    console.log("payload", payload);

    $.ajax({
        url: "/WebApplication/Controllers/plant/approval",
        method: "POST",
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        },
        data: JSON.stringify(payload),
        success: function(res) {
            console.log(actionType + " saved!", res);

            // Reload or update the table row
            loadReceivingQualityReport(0);

            setTimeout(function() {
                const object2 = window.rqcRowDataMap[uiKey];
                const globalFailureMap = window.globalFailureMap;
                console.log(object2);
                console.log(globalFailureMap);

                // Update inline section UI
                populateInlineRemarkSection(object2, globalFailureMap);
                alert(successMessage);
            }, 900);
        },
        error: function(err) {
            console.error("Error saving " + actionType, err);
            alert("Failed to save " + actionType + "!");
        }
    });
}


/*
$("#plantConfirmActionBtn").on("click", function () {
    $("#plantConfirmationModal").modal("hide");

    if (plantActionType === "temporary") {
        handlePlantTemporaryApproval();
    } else if (plantActionType === "permanent") {
        handlePlantPermanentApproval();
	} else if (plantActionType === "reject") {
	   	handlePlantReject();
	}
});
*/
/*
function handlePlantTemporaryApproval() {
	 const userDepartment = sessionStorage.getItem('userDepartment');
    let payload = {
        rqcResultId: window.clickedRowData.rqcResultId,
        action: "TEMPORARY",
        // timestamp: new Date().toISOString(), // in backend server time is used
		userDepartment:userDepartment,
    };
	const uiKey = window.clickedRowData.uiKey;
	console.log("uiKey", uiKey);
	console.log("payload", payload);
    $.ajax({
        url: "/WebApplication/Controllers/plant/approval",
        method: "POST",
        contentType: "application/json",
		headers: {
		    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
		},
        data: JSON.stringify(payload),
        success: function(res) {
            console.log("Temporary Approval saved!", res);
           // $('#confirmationPlantBackdropModal').modal('hide');
            		
			 // Reload or update the table row to reflect new status
			loadReceivingQualityReport(0);

			setTimeout(function() {
			const object2 = window.rqcRowDataMap[uiKey];
			const globalFailureMap = window.globalFailureMap;
			console.log(object2);
			console.log(globalFailureMap);
														
			// Pass the RQC data object 
			populateInlineRemarkSection(object2, globalFailureMap); // `object2` contains RQC fields like remark, attachmentPath etc.
			alert("Temporary Approval recorded successfully!");
			 }, 900);
        },
        error: function(err) {
            console.error("Error saving approval", err);
            alert("Failed to save approval!");
        }
    });
}

function handlePlantPermanentApproval() {
	const userDepartment = sessionStorage.getItem('userDepartment');
    let payload = {
        rqcResultId: window.clickedRowData.rqcResultId,
        action: "PERMANENT",
        // timestamp: new Date().toISOString(),  // in backend server time is used
		userDepartment:userDepartment,
    };
	
	const uiKey = window.clickedRowData.uiKey;
	console.log("uiKey", uiKey);

    $.ajax({
        url: "/WebApplication/Controllers/plant/approval",
        method: "POST",
        contentType: "application/json",
		headers: {
		    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
		},
        data: JSON.stringify(payload),
        success: function(res) {
            console.log("Permanent Approval saved!", res);
          //  $('#confirmationPlantBackdropModal').modal('hide');
			
			 // Reload or update the table row to reflect new status
			loadReceivingQualityReport(0);

			setTimeout(function() {
			const object2 = window.rqcRowDataMap[uiKey];
			const globalFailureMap = window.globalFailureMap;
			console.log(object2);
			console.log(globalFailureMap);
														
			// Pass the RQC data object 
			populateInlineRemarkSection(object2, globalFailureMap); // `object2` contains RQC fields like remark, attachmentPath etc.
			alert("Permanent Approval recorded successfully!");
			 }, 900);
        },
        error: function(err) {
            console.error("Error saving approval", err);
            alert("Failed to save approval!");
        }
    });
}

function handlePlantReject() {
    const userDepartment = sessionStorage.getItem('userDepartment');
    let payload = {
        rqcResultId: window.clickedRowData.rqcResultId,
        action: "REJECT",
        userDepartment: userDepartment,
    };

    const uiKey = window.clickedRowData.uiKey;
    console.log("uiKey", uiKey);
    console.log("payload", payload);

    $.ajax({
        url: "/WebApplication/Controllers/plant/approval",
        method: "POST",
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        },
        data: JSON.stringify(payload),
        success: function(res) {
            console.log("Reject saved!", res);

            // Reload or update the table row
            loadReceivingQualityReport(0);

            setTimeout(function() {
                const object2 = window.rqcRowDataMap[uiKey];
                const globalFailureMap = window.globalFailureMap;
                console.log(object2);
                console.log(globalFailureMap);

                // Update inline section UI
                populateInlineRemarkSection(object2, globalFailureMap);
                alert("Reject recorded successfully!");
            }, 900);
        },
        error: function(err) {
            console.error("Error saving reject", err);
            alert("Failed to save reject!");
        }
    });
}
*/

/*$(document).on('click', '.actionTakenButton', function() {
	var $btn = $(this);
	var $row = $btn.closest('tr');

	// Extract required values from the row
	var partNumber = $row.find('td[data-column="partNumber"]').text().trim();
	var batchCode = $row.find('td[data-column="batchCode"]').text().trim();
	var supplier = $row.find('td[data-column="supplier"]').text().trim();
	var rqcResultId = $btn.data('rqcresultid');
	var failDateTime = $btn.data('faildate');

	console.log("supplier: ", supplier);

	var failDate = new Date(failDateTime);
	var endDate = new Date(failDate);
	endDate.setDate(failDate.getDate() + 15);

	// Save these for later use in update function
	window.clickedRowData = {
		partNumber: partNumber,
		batchCode: batchCode,
		supplier: supplier,
		rqcResultId: rqcResultId
	};

	window.targetEndDate = endDate;

	// Show modal
	document.getElementById("confirmationBackdropButton").click();
});*/

/*function updateActionStatus(actionStatusValue, remarks) {
	if (!window.clickedRowData) {
		alert("No data available from the clicked row!");
		return;
	}

	const { partNumber, batchCode, supplier } = window.clickedRowData;

	if (!partNumber || !batchCode) {
		alert("Part number or batch code is missing!");
		return;
	}

	$.ajax({
		url: '/WebApplication/Controllers/qualityreading/action_status_rqcresult_and_reading',
		method: 'PUT',
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		data: {
			partNumber: partNumber,
			batchCode: batchCode,
			remarks: remarks,
			supplier: supplier,
			actionStatus: actionStatusValue
		},
		success: function() {
			alert("Action status updated successfully.");
			loadReceivingQualityReport(0);
		},
		error: function(xhr, status, error) {
			alert("Failed to update action status: " + error);
		}
	});
}
*/



/*$('#confirmationBackdropModal').on('shown.bs.modal', function(e) {
	counter++;

	const counterEl = document.getElementById('counterSpan');
	if (counterEl) counterEl.textContent = counter;

	const currentDateTime = getCurrentDateTime();

	const dateTimeEl = document.getElementById('dateTimeSpan');
	if (dateTimeEl) dateTimeEl.textContent = currentDateTime;

	if (window.targetEndDate) {
		updateCountdown(window.targetEndDate);
	}
});*/


// ✅ Ensure the modal flag resets when closed
/*$('#confirmationBackdropModal').on('hidden.bs.modal', function () {
	isConfirmationModalOpen = false;

	// Clean up interval when modal is closed
	if (window.countdownInterval) {
		clearInterval(window.countdownInterval);
		window.countdownInterval = null;
	}
});*/


/*function insertrqcresiltInTable($item) {

	$("#tableBody").remove();

	var tablebody = document.createElement("tbody");
	$("#table1").append(tablebody);
	tablebody.setAttribute("id", "tableBody");

	var sequenceNumber = pageSize * parseInt($('#pageSelect :selected').val());

	$.each($item, function(index, value) {

		row = '<tr class="tableDataRows">' +
			'<td data-column="columnId" style="width:20px;">' + (1 + parseInt(sequenceNumber)) + '</td>' +
			'<td data-column="partNumber" style="width:100px;">' + value.partNumber + '</td>' +
			'<td data-column="batchCode" style="width:80px;">' + value.batchCode + '</td>' +
			'<td data-column="result" style="width:100px;">' + value.result + '</td>' +
			'<td data-column="description" style="width:200px; text-align:left; padding-left:10px;">' + value.description + '</td>' +
			'<td data-column="qty" style="width:100px;">' + value.qty + '</td>' +
			'<td data-column="passQty" style="width:100px;">' + value.passQty + '</td>' +
			'<td data-column="failQty" style="width:100px;">' + value.failQty + '</td>' +
			'<td data-column="deviationQty" style="width:100px;">' + value.deviationQty + '</td>' +
			'<td data-column="remarks" style="width:100px;">' + value.remarks + '</td>' +
			'<td data-column="createdBy" style="width:80px;">' + value.createdBy + '</td>' +
			'<td data-column="dateTime" style="width:100px;">' + value.datetime + '</td>' +
			'<td data-column="rqcResultId" style="display:none;">' + value.rqcResultId + '</td>' +
			'</tr>';

		$('#table1').append(row);
		sequenceNumber = sequenceNumber + 1;
	});

}*/



$(document).ready(function() {

	$(document).on('click', '#finalInspectionsReport', function() {

		searchLoad = false; clearInterval(interval);

		$(".fromTo").css("display", "block");
		$("#excelDownload").css("display", "block");
		$("#pageSelect").css("display", "block");
		$("#printPreview").css("display", "none");
		$("#next").css("display", "block");
		$("#previous").css("display", "block");
		$("#backToHarness").css("display", "none");
		$("#toggleActionFilterBtn").closest(".switch").css("display", "none");
				
		$("#offcanvasCloseButton").click();

		var child1 = document.getElementById("div3");
		var child2 = document.getElementById("div4");

		child1.remove();
		if (child2) { child2.remove(); }

		document.getElementById("masterHeading").innerText = "";
		$("#masterHeading").append("FINAL INSPECTION REPORT");

		var div3 = document.createElement("div");
		var div4 = document.createElement("div");

		$("#div2").append(div3, div4);

		div3.setAttribute("id", "div3");
		div3.setAttribute("class", "masterBody emptyContainer");

		div4.setAttribute("id", "div4");
		div4.setAttribute("class", "masterBody");
		div4.setAttribute("Style", "overflow-y:scroll; display:none;");

		var bottom = document.createElement("div");

		bottom.setAttribute("id", "bottom");
		/*	bottom.setAttribute("style","height: 50%;")*/

		$("#div4").append(bottom);

		var element1 = document.createElement("table");
		$("#div3").append(element1);
		element1.setAttribute("id", "table1");
		element1.setAttribute("cellspacing", "0px");
		/*element1.setAttribute("cellpaddding","10px");*/
		element1.setAttribute("class", "table-hover");

		var w = window.innerWidth;

		if (w < 500) {
			element1.setAttribute("style", "width:300%;");
		} else if (w < 1100) {
			element1.setAttribute("style", "width:250%;");
		}
		else if (w < 1500) {
			element1.setAttribute("style", "width:100%;");
		} else if (w < 1000) {
			element1.setAttribute("style", "width:150%;");
		} else {
			element1.setAttribute("style", "width:100%;");
		}

		var element1_1 = document.createElement("thead");
		element1.append(element1_1);

		var element1_2 = document.createElement("tr");


		var element1_3 = document.createElement("tbody");
		element1.append(element1_3)
		element1_3.setAttribute("id", "tableBody");


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

		var searchTitles = ["searchPartCode", "searchBatchCode", "searchResult"];

		for (var i = 0; i < searchTitles.length; i++) {
			var searchContainer = document.createElement("th");
			searchContainer.setAttribute("class", "tableheading");
			var searchinput = document.createElement("input");
			var list = document.createElement("datalist")
			searchinput.setAttribute("style", "width:100%;");
			searchinput.setAttribute("title", searchTitles[i]);
			searchinput.setAttribute("list", searchTitles[i]);
			list.setAttribute("id", searchTitles[i]);
			searchinput.setAttribute("class", "searchFilterClass inputs");
			searchContainer.append(searchinput, list);
			searchRow.append(searchContainer);
		}

		element1_1.append(searchRow);
		element1_1.append(element1_2);


		var element2 = document.createElement("th");
		element2.innerText = "S.No.";
		var element3 = document.createElement("th");
		element3.innerText = "Part No.";
		var element3_2 = document.createElement("th");
		element3_2.innerText = "Barcode";
		var element4 = document.createElement("th");
		element4.innerText = "Result";
		var element4_2 = document.createElement("th");
		element4_2.innerText = "Description";
		var element5 = document.createElement("th");
		element5.innerText = "Total Qty";
		var element5_1 = document.createElement("th");
		element5_1.innerText = "Pass Qty";
		var element6 = document.createElement("th");
		element6.innerText = "Fail Qty";
		var element6_3 = document.createElement("th");
		element6_3.innerText = "Deviation Qty";
		var element7 = document.createElement("th");
		element7.innerText = "Remark";
		var element8 = document.createElement("th");
		element8.innerText = "Checked By";
		var element8_2 = document.createElement("th");
		element8_2.innerText = "Date Time";
		/*var element9 = document.createElement("th");
		element9.innerText = "Assembly";
		var element9 = document.createElement("th");
		element9.innerText = "Date & Time";
		var element9_2 = document.createElement("th");
		element9_2.innerText = "Id";*/


		element1_2.append(element2, element3, element3_2, element4, element4_2, element5, element5_1, element6, element6_3, element7, element8, element8_2);
		element2.setAttribute("class", "tableheading");
		// element2.setAttribute("scope","col");
		element3.setAttribute("class", "tableheading");
		// element3.setAttribute("scope","col");
		element3_2.setAttribute("class", "tableheading");
		// element3.setAttribute("scope","col");
		element4.setAttribute("class", "tableheading");
		// element4.setAttribute("scope","col");
		element4_2.setAttribute("class", "tableheading");
		// element4.setAttribute("scope","col");
		element5.setAttribute("class", "tableheading");
		element5_1.setAttribute("class", "tableheading");
		// element5.setAttribute("scope","col");
		element6.setAttribute("class", "tableheading");
		// element6.setAttribute("scope","col");
		element6_3.setAttribute("class", "tableheading");
		// element6_3.setAttribute("scope","col");
		element7.setAttribute("class", "tableheading");
		// element7.setAttribute("scope","col");
		element8.setAttribute("class", "tableheading");
		element8_2.setAttribute("class", "tableheading");
		// element8.setAttribute("scope","col");
		/*element9.setAttribute("class", "tableheading");
		element9_2.setAttribute("class", "tableheading");
		element9_2.setAttribute("style", "display:none;");
		// element9.setAttribute("scope","col");*/

		var element18_2 = document.createElement("div");
		element18_2.setAttribute("class", "buttonsContainer");

		var element41 = document.createElement("div");
		element41.setAttribute("class", "buttonsContainer");

		var element44 = document.createElement("button");
		element44.setAttribute("class", "data");
		element44.setAttribute("title", "Excel Download");

		element41.append(element44);
		element18_2.append(element41);

		$("#bottom").append(element18_2);

		$("#pageSelect").empty();
		getCurrentDate();
	});
});



function loadFinalControlReport(page) {

	searchLoad = true;

	var partNumber = $('input[title="searchPartCode"]').val() ?? '';
	var batchCode = $('input[title="searchBatchCode"]').val() ?? '';
	var result = $('input[title="searchResult"]').val() ?? '';
	var from = $("input[name=from]").val();
	var to = $("input[name=to]").val();

	if (!from || !to) {
		alert("Please select the date to get Receiving quality data.");
		return false;
	}

	$("#loadingBackdropButton").click();
	$("#loadingBackdropModalMessage").text("Getting Receiving Quality Report.");

	var formdata = {
		partNumber: partNumber,
		batchCode: batchCode,
		result: result,
		datetime: from + "," + to
	}


	console.log(formdata);

	$.ajax({
		url: "/WebApplication/Controllers/getFinalControlResult/" + page,
		type: 'POST',
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		data: JSON.stringify(formdata),
		success: function(response) {

			makePagerByTotalPages(response, page)
			insertFinalControlresiltInTable(response.content);
			$("#div3").removeClass("emptyContainer");
			setTimeout(function() {
				$("#loadingBackdropButton").click();

			}, 500);


		}, error: function(response) {
			setTimeout(function() {
				$("#loadingBackdropButton").click();
				alert(response.responseText);
			}, 500);

		}
	});
}

function insertFinalControlresiltInTable($item) {

	$("#tableBody").remove();

	var tablebody = document.createElement("tbody");
	$("#table1").append(tablebody);
	tablebody.setAttribute("id", "tableBody");

	var sequenceNumber = pageSize * parseInt($('#pageSelect :selected').val());

	$.each($item, function(index, value) {

		row = '<tr class="tableDataRows">' +
			'<td data-column="columnId" style="width:20px;">' + (1 + parseInt(sequenceNumber)) + '</td>' +
			'<td data-column="partNumber" style="width:100px;">' + value.partNumber + '</td>' +
			'<td data-column="batchCode" style="width:80px;">' + value.batchCode + '</td>' +
			'<td data-column="result" style="width:100px;">' + value.result + '</td>' +
			'<td data-column="description" style="width:200px; text-align:left; padding-left:10px;">' + value.description + '</td>' +
			'<td data-column="qty" style="width:100px;">' + value.qty + '</td>' +
			'<td data-column="passQty" style="width:100px;">' + value.passQty + '</td>' +
			'<td data-column="failQty" style="width:100px;">' + value.failQty + '</td>' +
			'<td data-column="deviationQty" style="width:100px;">' + value.deviationQty + '</td>' +
			'<td data-column="remarks" style="width:100px;">' + value.remarks + '</td>' +
			'<td data-column="createdBy" style="width:80px;">' + value.createdBy + '</td>' +
			'<td data-column="dateTime" style="width:100px;">' + value.datetime + '</td>' +
			'<td data-column="finalControlResultId" style="display:none;">' + value.finalControlResultId + '</td>' +
			'</tr>';

		$('#table1').append(row);
		sequenceNumber = sequenceNumber + 1;
	});

}


//-------------Manpower report-------


$(document).ready(function() {

	$(document).on('click', '#manPowerReport', function() {

		searchLoad = false; clearInterval(interval);

		$(".fromTo").css("display", "block");
		$("#excelDownload").css("display", "block");
		$("#pageSelect").css("display", "block");
		$("#printPreview").css("display", "none");
		$("#next").css("display", "block");
		$("#previous").css("display", "block");
		$("#backToHarness").css("display", "none");
		$("#toggleActionFilterBtn").closest(".switch").css("display", "none");
				
		$("#offcanvasCloseButton").click();

		var child1 = document.getElementById("div3");
		var child2 = document.getElementById("div4");

		child1.remove();
		if (child2) { child2.remove(); }

		document.getElementById("masterHeading").innerText = "";
		$("#masterHeading").append("MANPOWER DEPLOYMENT REPORT");

		var div3 = document.createElement("div");
		var div4 = document.createElement("div");

		$("#div2").append(div3, div4);

		div3.setAttribute("id", "div3");
		div3.setAttribute("class", "masterBody emptyContainer");

		div4.setAttribute("id", "div4");
		div4.setAttribute("class", "masterBody");
		div4.setAttribute("Style", "overflow-y:scroll; display:none;");

		var bottom = document.createElement("div");

		bottom.setAttribute("id", "bottom");
		/*	bottom.setAttribute("style","height: 50%;")*/

		$("#div4").append(bottom);

		var element1 = document.createElement("table");
		$("#div3").append(element1);
		element1.setAttribute("id", "table1");
		element1.setAttribute("cellspacing", "0px");
		/*element1.setAttribute("cellpaddding","10px");*/
		element1.setAttribute("class", "table-hover");

		var w = window.innerWidth;

		if (w < 500) {
			element1.setAttribute("style", "width:300%;");
		} else if (w < 1100) {
			element1.setAttribute("style", "width:250%;");
		}
		else if (w < 1500) {
			element1.setAttribute("style", "width:100%;");
		} else if (w < 1000) {
			element1.setAttribute("style", "width:150%;");
		} else {
			element1.setAttribute("style", "width:100%;");
		}

		var element1_1 = document.createElement("thead");
		element1.append(element1_1);

		var element1_2 = document.createElement("tr");


		var element1_3 = document.createElement("tbody");
		element1.append(element1_3)
		element1_3.setAttribute("id", "tableBody");


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

		var searchTitles = ["searchConveyor", "searchStation", "searchEmployeeDeployed", "searchEmployeePlanned"];
		var placeholder = ["Conveyor", "Station", "Emp.Planned", "Emp.Deployed"];
		for (var i = 0; i < searchTitles.length; i++) {
			var searchContainer = document.createElement("th");
			searchContainer.setAttribute("class", "tableheading");
			var searchinput = document.createElement("input");
			var list = document.createElement("datalist")
			searchinput.setAttribute("style", "width:100%;");
			searchinput.setAttribute("title", searchTitles[i]);
			searchinput.setAttribute("list", searchTitles[i]);
			searchinput.setAttribute("placeholder", placeholder[i]);
			list.setAttribute("id", searchTitles[i]);
			searchinput.setAttribute("class", "searchFilterClass inputs");
			searchContainer.append(searchinput, list);
			searchRow.append(searchContainer);
		}

		element1_1.append(searchRow);
		element1_1.append(element1_2);


		var element2 = document.createElement("th");
		element2.innerText = "S.No.";
		var element2_1 = document.createElement("th");
		element2_1.innerText = "Conveyor";
		var element3 = document.createElement("th");
		element3.innerText = "Station";
		var element3_2 = document.createElement("th");
		element3_2.innerText = "Skill Require";
		var element4 = document.createElement("th");
		element4.innerText = "Emp. Planned";
		var element4_2 = document.createElement("th");
		element4_2.innerText = "Emp. Deployed";
		var element5 = document.createElement("th");
		element5.innerText = "Name";
		var element5_1 = document.createElement("th");
		element5_1.innerText = "Skill Planned";
		var element6 = document.createElement("th");
		element6.innerText = "skill Depl";
		var element6_3 = document.createElement("th");
		element6_3.innerText = "Emp. Status";
		var element7 = document.createElement("th");
		element7.innerText = "In-Time";
		var element8 = document.createElement("th");
		element8.innerText = "Out-Time";

		var element9 = document.createElement("th");
		element9.innerText = "Date-Time";
		/*var element9 = document.createElement("th");
		element9.innerText = "Date & Time";
		var element9_2 = document.createElement("th");
		element9_2.innerText = "Id";*/


		element1_2.append(element2, element2_1, element3, element3_2, element4, element4_2, element5, element5_1, element6, element6_3, element7, element8, element9);
		element2.setAttribute("class", "tableheading");
		element2_1.setAttribute("class", "tableheading");
		// element2.setAttribute("scope","col");
		element3.setAttribute("class", "tableheading");
		// element3.setAttribute("scope","col");
		element3_2.setAttribute("class", "tableheading");
		// element3.setAttribute("scope","col");
		element4.setAttribute("class", "tableheading");
		// element4.setAttribute("scope","col");
		element4_2.setAttribute("class", "tableheading");
		// element4.setAttribute("scope","col");
		element5.setAttribute("class", "tableheading");
		element5_1.setAttribute("class", "tableheading");
		// element5.setAttribute("scope","col");
		element6.setAttribute("class", "tableheading");
		// element6.setAttribute("scope","col");
		element6_3.setAttribute("class", "tableheading");
		// element6_3.setAttribute("scope","col");
		element7.setAttribute("class", "tableheading");
		// element7.setAttribute("scope","col");
		element8.setAttribute("class", "tableheading");

		// element8.setAttribute("scope","col");
		element9.setAttribute("class", "tableheading");
		/*element9_2.setAttribute("class", "tableheading");
		element9_2.setAttribute("style", "display:none;");
		// element9.setAttribute("scope","col");*/

		var element18_2 = document.createElement("div");
		element18_2.setAttribute("class", "buttonsContainer");

		var element41 = document.createElement("div");
		element41.setAttribute("class", "buttonsContainer");

		var element44 = document.createElement("button");
		element44.setAttribute("class", "data");
		element44.setAttribute("title", "Excel Download");

		element41.append(element44);
		element18_2.append(element41);

		$("#bottom").append(element18_2);

		$("#pageSelect").empty();
		getCurrentDate();
		getAllConveyorInList();
		getAllOperationInStationList();

	});
});






function loadManPowerDeploymentReport(page) {

	searchLoad = true;

	var conveyor = $('input[title="searchConveyor"]').val() ?? '';
	var station = $('input[title="searchStation"]').val() ?? '';
	var employee1 = $('input[title="searchEmployeeDeployed"]').val() ?? '';
	var employee2 = $('input[title="searchEmployeePlanned"]').val() ?? '';
	var from = $("input[name=from]").val();
	var to = $("input[name=to]").val();

	if (!from || !to) {
		alert("Please select the date to get Receiving quality data.");
		return false;
	}

	$("#loadingBackdropButton").click();
	$("#loadingBackdropModalMessage").text("Getting Receiving Quality Report.");

	var formdata = {

		"lineStation": {
			"line": {
				"lineName": conveyor
			},
			"operation": {
				"operation": station
			}
		},
		"loginIn": {
			"employeeId": employee2
		},
		"login": {
			"employeeId": employee1
		},

		"dateTime": from + "," + to


	}


	console.log(formdata);

	$.ajax({
		url: "/WebApplication/Controllers/getManPowerReportData/" + page,
		type: 'POST',
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		data: JSON.stringify(formdata),
		success: function(response) {
			console.log("response  ", response);
			if (response.content.length == 0) {
				alert("Data Not Found");
			}
			makePagerByTotalPages(response, page);

			insertManPowerDeploymentReport(response.content);
			$("#div3").removeClass("emptyContainer");

			setTimeout(function() {
				$("#loadingBackdropButton").click();

			}, 500);


		}, error: function(response) {
			setTimeout(function() {
				$("#loadingBackdropButton").click();
				alert(response.responseText);
			}, 500);

		}
	});
}

function insertManPowerDeploymentReport($item) {

	$("#tableBody").remove();

	var tablebody = document.createElement("tbody");
	$("#table1").append(tablebody);
	tablebody.setAttribute("id", "tableBody");

	var sequenceNumber = pageSize * parseInt($('#pageSelect :selected').val());

	$.each($item, function(index, value) {

		Object.keys(value).forEach(function(key) {
			if (value[key] === null) {
				value[key] = '';
			}
		});
		console.log("value: ", value);


		var employeeStatusClass = getSkillMatchedClassBySkill(value[3], value[12]);

		var row = '<tr class="tableDataRows">' +
			'<td data-column="columnId" style="width:20px;">' + (1 + parseInt(sequenceNumber)) + '</td>' +
			'<td data-column="conveyor" style="width:100px;">' + value[17] + '</td>' +
			'<td data-column="station" style="width:100px;">' + value[2] + '</td>' +
			'<td data-column="skillRequired" style="width:100px;">' + value[3] + '</td>' +
			'<td data-column="employeeDeployed" style="width:80px;">' + value[4] + '</td>' +
			'<td data-column="employeePlanned" style="width:100px;">' + value[11] + '</td>' +
			'<td data-column="name" style="width:150px; text-align:left; padding-left:10px;">' + value[13] + " " + value[14] + '</td>' +
			'<td data-column="skillDeployed" style="width:100px;">' + value[7] + '</td>' +
			'<td data-column="skillPlanned" style="width:100px;">' + value[12] + '</td>' +
			'<td data-column="employeeStatus" style="width:100px;" class="' + employeeStatusClass + '">' + "" + '</td>' +
			'<td data-column="inTime" style="width:100px;">' + value[9] + '</td>' +
			'<td data-column="outTime" style="width:100px;">' + value[10] + '</td>' +
			'<td data-column="datetime" style="width:100px;">' + value[15] + '</td>' +
			'<td data-column="manpowerDeploymentId" style="display:none;">' + value[0] + '</td>' +
			'</tr>';

		$('#table1').append(row);
		sequenceNumber = sequenceNumber + 1;
	});

}


function getSkillMatchedClassBySkill(stationSkill, operatorSkill) {



	if (operatorSkill === null || operatorSkill === undefined || operatorSkill === "null") {

		return "notFound";
	}

	if (stationSkill < operatorSkill) {

		return "skillMatched";
	} else if (stationSkill == operatorSkill) {

		return "skillMatched";
	} else if (stationSkill > operatorSkill) {
		if (stationSkill == "L4" && operatorSkill == "L3") {
			return "deviation-1st";
		} else if (stationSkill == "L4" && operatorSkill == "L2") {
			return "deviation-2st";
		} else if (stationSkill == "L3" && operatorSkill == "L2") {
			return "deviation-1st";
		} else if (stationSkill == "L3" && operatorSkill == "L1") {
			return "deviation-2st";
		} else if (stationSkill == "L2" && operatorSkill == "L1") {
			return "deviation-1st";
		} else {
			return "notFound";
		}
	} else {
		return "notFound";
	}
}


function getAllConveyorInList() {
	$.ajax({
		url: "/WebApplication/Controllers/getAllLineNamesInList",
		type: 'GET',
		contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		async: false,
		dataType: 'json',
		success: function(res) {

			for (var i = 0; i < res.length; i++) {
				var str = res[i];
				var id_lineNumber = str.split(',');

				for (var j = 0; j < id_lineNumber.length - 1; j++) {
					var row = '<option value="' + id_lineNumber[j + 1] + '">' + id_lineNumber[j + 1] + '</option>';
					$('#searchConveyor').append(row);
				}
			}
		}, error: function(response) {
			alert(response.responseText);
		}
	});

}

function getAllOperationInStationList() {
	$.ajax({
		url: "/WebApplication/Controllers/getAllOperationInList",
		type: 'GET',
		contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		async: false,
		dataType: 'json',
		success: function(res) {
			for (var i = 0; i < res.length; i++) {
				var str = res[i];
				var id_operation = str.split(',');

				for (var j = 0; j < id_operation.length - 1; j++) {
					var row = '<option value="' + id_operation[j + 1] + '">';
					$('#searchStation').append(row);
				}
			}
		}, error: function(response) {
			$("#warningInformationModalBody").text(response.responseText);
			$("#warningBackdropButton").click();
		}
	});
}


//-----------Entry Screen---------


$(document).ready(function() {

	$(document).on('click', '#manpowerEntryReport', function() {

		searchLoad = false; clearInterval(interval);

		$(".fromTo").css("display", "block");
		$("#excelDownload").css("display", "block");
		$("#pageSelect").css("display", "block");
		$("#printPreview").css("display", "none");
		$("#next").css("display", "block");
		$("#previous").css("display", "block");
		$("#backToHarness").css("display", "none");
		$("#toggleActionFilterBtn").closest(".switch").css("display", "none");
				
		$("#offcanvasCloseButton").click();

		var child1 = document.getElementById("div3");
		var child2 = document.getElementById("div4");

		child1.remove();
		if (child2) { child2.remove(); }

		document.getElementById("masterHeading").innerText = "";
		$("#masterHeading").append("MANPOWER DEPLOYMENT ENTRY REPORT");

		var div3 = document.createElement("div");
		var div4 = document.createElement("div");

		$("#div2").append(div3, div4);

		div3.setAttribute("id", "div3");
		div3.setAttribute("class", "masterBody emptyContainer");

		div4.setAttribute("id", "div4");
		div4.setAttribute("class", "masterBody");
		div4.setAttribute("Style", "overflow-y:scroll; display:none;");

		var bottom = document.createElement("div");

		bottom.setAttribute("id", "bottom");
		/*	bottom.setAttribute("style","height: 50%;")*/

		$("#div4").append(bottom);

		var element1 = document.createElement("table");
		$("#div3").append(element1);
		element1.setAttribute("id", "table1");
		element1.setAttribute("cellspacing", "0px");
		/*element1.setAttribute("cellpaddding","10px");*/
		element1.setAttribute("class", "table-hover");

		var w = window.innerWidth;

		if (w < 500) {
			element1.setAttribute("style", "width:300%;");
		} else if (w < 1100) {
			element1.setAttribute("style", "width:250%;");
		}
		else if (w < 1500) {
			element1.setAttribute("style", "width:100%;");
		} else if (w < 1000) {
			element1.setAttribute("style", "width:150%;");
		} else {
			element1.setAttribute("style", "width:100%;");
		}

		var element1_1 = document.createElement("thead");
		element1.append(element1_1);

		var element1_2 = document.createElement("tr");


		var element1_3 = document.createElement("tbody");
		element1.append(element1_3)
		element1_3.setAttribute("id", "tableBody");


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

		var searchTitles = ["searchConveyor", "searchEmployee"];
		var placeholder = ["Conveyor", "Employee"];
		for (var i = 0; i < searchTitles.length; i++) {
			var searchContainer = document.createElement("th");
			searchContainer.setAttribute("class", "tableheading");
			var searchinput = document.createElement("input");
			var list = document.createElement("datalist")
			searchinput.setAttribute("style", "width:100%;");
			searchinput.setAttribute("title", searchTitles[i]);
			searchinput.setAttribute("list", searchTitles[i]);
			searchinput.setAttribute("placeholder", placeholder[i]);
			list.setAttribute("id", searchTitles[i]);
			searchinput.setAttribute("class", "searchFilterClass inputs");
			searchContainer.append(searchinput, list);
			searchRow.append(searchContainer);
		}

		element1_1.append(searchRow);
		element1_1.append(element1_2);


		var element2 = document.createElement("th");
		element2.innerText = "S.No.";

		var element3 = document.createElement("th");
		element3.innerText = "Conveyor";
		var element5 = document.createElement("th");
		element5.innerText = "Name";
		var element6_3 = document.createElement("th");
		element6_3.innerText = "Emp. Status";
		var element7 = document.createElement("th");
		element7.innerText = "In-Time";
		var element8 = document.createElement("th");
		element8.innerText = "Out-Time";
		var element8_2 = document.createElement("th");
		element8_2.innerText = "EmployeeId";
		var element9 = document.createElement("th");
		element9.innerText = "Date-Time";
		var element9_1 = document.createElement("th");
		element9_1.innerText = "skillLevel";
		/*var element9_2 = document.createElement("th");
		element9_2.innerText = "Id";*/


		element1_2.append(element2, element5, element3, element8_2, element9_1, element6_3, element7, element8, element9);
		element2.setAttribute("class", "tableheading");

		element3.setAttribute("class", "tableheading");
		// element3.setAttribute("scope","col");
		element5.setAttribute("class", "tableheading");

		element6_3.setAttribute("class", "tableheading");

		element7.setAttribute("class", "tableheading");

		element8.setAttribute("class", "tableheading");
		element8_2.setAttribute("class", "tableheading");

		element9_1.setAttribute("class", "tableheading");
		element9.setAttribute("class", "tableheading");

		var element18_2 = document.createElement("div");
		element18_2.setAttribute("class", "buttonsContainer");

		var element41 = document.createElement("div");
		element41.setAttribute("class", "buttonsContainer");

		var element44 = document.createElement("button");
		element44.setAttribute("class", "data");
		element44.setAttribute("title", "Excel Download");

		element41.append(element44);
		element18_2.append(element41);

		$("#bottom").append(element18_2);

		$("#pageSelect").empty();
		loadManpowerEntryReport(0);
		getCurrentDate();
		getAllConveyorInList();

	});
});






function loadManpowerEntryReport(page) {

	searchLoad = true;

	var conveyor = $('input[title="searchConveyor"]').val() ?? '';
	var employee = $('input[title="searchEmployee"]').val() ?? '';
	var from = $("input[name=from]").val();
	var to = $("input[name=to]").val();

	if (!from || !to) {
		alert("Please select the date to get Receiving quality data.");
		return false;
	}

	$("#loadingBackdropButton").click();
	$("#loadingBackdropModalMessage").text("Getting Receiving Quality Report.");

	var formdata = {
		employeeId: employee,
		macConv: conveyor,
		dateTime: from + "," + to
	}

	console.log(formdata);

	$.ajax({
		url: "/WebApplication/Controllers/getManPowerEntryData/" + page,
		type: 'POST',
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		data: JSON.stringify(formdata),
		success: function(response) {
			console.log("response  ", response);
			if (response.content.length == 0) {
				alert("Data Not Found");
			}
			makePagerByTotalPages(response, page);

			insertManPowerDeploymentEntryReport(response.content);
			$("#div3").removeClass("emptyContainer");

			setTimeout(function() {
				$("#loadingBackdropButton").click();

			}, 500);


		}, error: function(response) {
			setTimeout(function() {
				$("#loadingBackdropButton").click();
				alert(response.responseText);
			}, 500);

		}
	});
}

function insertManPowerDeploymentEntryReport($item) {

	$("#tableBody").remove();

	var tablebody = document.createElement("tbody");
	$("#table1").append(tablebody);
	tablebody.setAttribute("id", "tableBody");

	var sequenceNumber = pageSize * parseInt($('#pageSelect :selected').val());

	$.each($item, function(index, value) {

		Object.keys(value).forEach(function(key) {
			if (value[key] === null) {
				value[key] = '';
			}
		});

		var row = '<tr class="tableDataRows">' +
			'<td data-column="columnId" style="width:20px;">' + (1 + parseInt(sequenceNumber)) + '</td>' +
			'<td data-column="name" style="width:150px; text-align:left; padding-left:10px;">' + value.employeeName + '</td>' +
			'<td data-column="conveyor" style="width:100px;">' + value.macConv + '</td>' +
			'<td data-column="employeeId" style="width:100px;">' + value.employeeId + '</td>' +
			'<td data-column="skillLevel" style="width:100px;">' + value.skillLevel + '</td>' +
			'<td data-column="employeeStatus" style="width:100px;background-color:green">' + " " + '</td>' +
			'<td data-column="inTime" style="width:100px;">' + value.inTime + '</td>' +
			'<td data-column="outTime" style="width:100px;">' + value.outTime + '</td>' +
			'<td data-column="dateTime" style="width:100px;">' + value.dateTime + '</td>' +
			'<td data-column="manpowerDeploymentId" style="display:none;">' + value.manpowerDeploymentId + '</td>' +
			'</tr>';

		$('#table1').append(row);
		sequenceNumber = sequenceNumber + 1;
	});

}

//-----------Manpower Shortage Screen---------
$(document).ready(function() {
	$(document).on('click', '#manpowerShortageReport', function() {
		searchLoad = false;
		clearInterval(interval);

		$(".fromTo").css("display", "block");
		$("#excelDownload").css("display", "block");
		$("#pageSelect").css("display", "block");
		$("#printPreview").css("display", "none");
		$("#next").css("display", "block");
		$("#previous").css("display", "block");
		$("#backToHarness").css("display", "none");
		$("#toggleActionFilterBtn").closest(".switch").css("display", "none");
				
		$("#offcanvasCloseButton").click();

		var child1 = document.getElementById("div3");
		var child2 = document.getElementById("div4");

		child1.remove();
		if (child2) { child2.remove(); }

		document.getElementById("masterHeading").innerText = "";
		$("#masterHeading").append("MANPOWER SHORTAGE REPORT");

		var div3 = document.createElement("div");
		var div4 = document.createElement("div");

		$("#div2").append(div3, div4);

		div3.setAttribute("id", "div3");
		div3.setAttribute("class", "masterBody emptyContainer");

		div4.setAttribute("id", "div4");
		div4.setAttribute("class", "masterBody");
		div4.setAttribute("style", "overflow-y:scroll; display:none;");

		var bottom = document.createElement("div");
		bottom.setAttribute("id", "bottom");
		$("#div4").append(bottom);

		var element1 = document.createElement("table");
		$("#div3").append(element1);
		element1.setAttribute("id", "table1");
		element1.setAttribute("cellspacing", "0px");
		element1.setAttribute("class", "table-hover");

		var w = window.innerWidth;

		if (w < 500) {
			element1.setAttribute("style", "width:300%;");
		} else if (w < 1100) {
			element1.setAttribute("style", "width:250%;");
		} else if (w < 1500) {
			element1.setAttribute("style", "width:100%;");
		} else if (w < 1000) {
			element1.setAttribute("style", "width:150%;");
		} else {
			element1.setAttribute("style", "width:100%;");
		}

		var element1_1 = document.createElement("thead");
		element1.append(element1_1);

		var element1_2 = document.createElement("tr");
		element1_1.append(element1_2);

		var element1_3 = document.createElement("tbody");
		element1.append(element1_3);
		element1_3.setAttribute("id", "tableBody");

		var searchRow = document.createElement("tr");
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

		var searchTitles = ["searchConveyor"];
		var placeholder = ["Conveyor"];
		for (var i = 0; i < searchTitles.length; i++) {
			var searchContainer = document.createElement("th");
			searchContainer.setAttribute("class", "tableheading");
			var searchinput = document.createElement("input");
			var list = document.createElement("datalist");
			searchinput.setAttribute("style", "width:100%;");
			searchinput.setAttribute("title", searchTitles[i]);
			searchinput.setAttribute("list", searchTitles[i]);
			searchinput.setAttribute("placeholder", placeholder[i]);
			list.setAttribute("id", searchTitles[i]);
			searchinput.setAttribute("class", "searchFilterClass inputs");
			searchContainer.append(searchinput, list);
			searchRow.append(searchContainer);
		}

		element1_1.append(searchRow);

		var searchContainerFilter = document.createElement("th");
		searchContainerFilter.setAttribute("class", "tableheading");

		var filter = document.createElement("select");
		filter.setAttribute("id", "filter");
		filter.setAttribute("class", " inputs");

		var option0 = document.createElement("option");
		option0.value = "all";
		option0.text = "All";

		var option1 = document.createElement("option");
		option1.value = "extraEmployeeCount";
		option1.text = "Extra";

		var option2 = document.createElement("option");
		option2.value = "shortFall";
		option2.text = "ShortFall";

		var option3 = document.createElement("option");
		option3.value = "deviation1Count";
		option3.text = "Deviation-1";

		var option4 = document.createElement("option");
		option4.value = "deviation2Count";
		option4.text = "Deviation-2";

		searchContainerFilter.append(filter)

		filter.append(option0,
			option1, option2, option3, option4);
		searchRow.append(searchContainerFilter);
		element1_1.append(element1_2);

		var columns = [
			{ text: "S.No.", dataColumn: "column" },
			{ text: "Conveyor", dataColumn: "conveyor" },
			{ text: "Date-Time", dataColumn: "date" },
			{ text: "Extra", dataColumn: "extraEmployeeCount" },
			{ text: "Short Fall", dataColumn: "shortFall" },
			{ text: "Deviation-1", dataColumn: "deviation1Count" },
			{ text: "Deviation-2", dataColumn: "deviation2Count" },
			{ text: "Skill Matched", dataColumn: "skillMatched" }
		];

		columns.forEach(col => {
			var th = document.createElement("th");
			th.innerText = col.text;
			th.setAttribute("class", "tableheading");
			th.setAttribute("data-column", col.dataColumn);
			element1_2.append(th);
		});

		var element18_2 = document.createElement("div");
		element18_2.setAttribute("class", "buttonsContainer");

		var element41 = document.createElement("div");
		element41.setAttribute("class", "buttonsContainer");

		var element44 = document.createElement("button");
		element44.setAttribute("class", "data");
		element44.setAttribute("title", "Excel Download");

		element41.append(element44);
		element18_2.append(element41);

		$("#bottom").append(element18_2);

		$("#pageSelect").empty();
		/*loadManpowerEntryReport(0)
		getCurrentDate();*/
		getAllShortageByConveyor();
		getAllConveyorInList();

		$("#filter").on('change', function() {
			var selectedFilter = $(this).val();
			filterTableByColumn(selectedFilter);
		});
	});
});
var manpowerresponse;

function getAllShortageByConveyor(page) {
	searchLoad = true;

	var conveyor = $('input[title="searchConveyor"]').val() ?? '';
	var from = $("input[name=from]").val();
	var to = $("input[name=to]").val();

	if (!from || !to) {
		alert("Please select the date to get Receiving quality data.");
		return false;
	}

	$("#loadingBackdropButton").click();
	$("#loadingBackdropModalMessage").text("Getting Receiving Quality Report.");

	var formdata = {
		"lineStation": {
			"line": {
				"lineName": conveyor
			},
		},
		"dateTime": from + "," + to
	}

	console.log(formdata);

	$.ajax({
		url: "/WebApplication/Controllers/getAllShortageByConveyor",
		type: 'POST',
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		data: JSON.stringify(formdata),
		success: function(response) {
			manpowerresponse = response;
			console.log("response  ", response);
			if (response.length == 0) {
				alert("Data Not Found");
			}
			makePagerByTotalPages(response, page);
			insertManPowerShortageReport(response);
			$("#div3").removeClass("emptyContainer");
			setTimeout(function() {
				$("#loadingBackdropButton").click();
			}, 500);
		}, error: function(response) {
			setTimeout(function() {
				$("#loadingBackdropButton").click();
				alert(response.responseText);
			}, 500);
		}
	});
}

function insertManPowerShortageReport(data) {
	$("#tableBody").remove();

	var tablebody = document.createElement("tbody");
	$("#table1").append(tablebody);
	tablebody.setAttribute("id", "tableBody");

	var sequenceNumber = 1;

	if (data && typeof data === 'object') {
		Object.keys(data).forEach(function(conveyor) {
			var dateMap = data[conveyor];

			if (dateMap && typeof dateMap === 'object') {
				Object.keys(dateMap).forEach(function(date) {
					var value = dateMap[date];

					if (value && typeof value === 'object') {
						var row = '<tr class="tableDataRows">' +
							'<td data-column="columnId" style="width:20px;">' + sequenceNumber + '</td>' +
							'<td data-column="conveyor" style="width:100px;">' + conveyor + '</td>' +
							'<td data-column="date" style="width:100px;">' + date + '</td>' +
							'<td data-column="extraEmployeeCount" style="width:100px;">' + value.extraEmployeeCount + '</td>' +
							'<td data-column="shortFall" style="width:100px;">' + value.shortFall + '</td>' +
							'<td data-column="deviation1Count" style="width:100px;">' + value.deviation1Count + '</td>' +
							'<td data-column="deviation2Count" style="width:100px;">' + value.deviation2Count + '</td>' +
							'<td data-column="skillMatched" style="width:100px;">' + value.skillMatched + '</td>' +
							'</tr>';

						$('#table1').append(row);
						sequenceNumber++;
					}
				});
			}
		});
	} else {
		console.error("Data is not an object or is null/undefined:", data);
	}
}

function filterTableByColumn(columnName) {
	$("#table1 .tableDataRows").each(function() {
		var columnValue = $(this).find(`td[data-column="${columnName}"]`).text();
		if (columnValue === "0") {
			$(this).hide();
		} else {
			$(this).show();
		}
	});
}


function downloadManpowerShortageReportDataAsExcel(data) {
	const filename = 'manpowershortagereport.xlsx';
	const sheetName = 'Manpower Shortage Report';
	const headers = ['Conveyor', 'Extra', 'Short Fall', 'Deviation-1', 'Deviation-2', 'Skill Matched', 'Date & Time'];


	const formattedData = [];
	for (const conveyor in data) {
		for (const date in data[conveyor]) {
			formattedData.push({
				'Conveyor': conveyor,
				'Extra': data[conveyor][date].extraEmployeeCount,
				'Short Fall': data[conveyor][date].shortFall,
				'Deviation-1': data[conveyor][date].deviation1Count,
				'Deviation-2': data[conveyor][date].deviation2Count,
				'Skill Matched': data[conveyor][date].skillMatched,
				'Date & Time': date,
			});
		}
	}

	const worksheet = XLSX.utils.json_to_sheet(formattedData, { header: headers });
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

	const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
	const blob = new Blob([wbout], { type: 'application/octet-stream' });

	if (navigator.msSaveBlob) {
		navigator.msSaveBlob(blob, filename);
	} else {
		const link = document.createElement('a');
		const url = URL.createObjectURL(blob);
		link.setAttribute('href', url);
		link.setAttribute('download', filename);
		link.style.visibility = 'hidden';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
}



$(document).on('click', '#generateManpowerReport', function() {
	searchLoad = false; clearInterval(interval);

	$(".fromTo").css("display", "block");
	$("#excelDownload").css("display", "none");
	$("#pageSelect").css("display", "none");
	$("#printPreview").css("display", "none");
	$("#next").css("display", "none");
	$("#previous").css("display", "none");
	$("#backToHarness").css("display", "none");
	$("#offcanvasCloseButton").click();

	var child1 = document.getElementById("div3");
	var child2 = document.getElementById("div4");

	child1.remove();
	if (child2) { child2.remove(); }

	document.getElementById("masterHeading").innerText = "";
	$("#masterHeading").append("MANPOWER REPORT");

	var div3 = document.createElement("div");
	var div4 = document.createElement("div");

	$("#div2").append(div3, div4);

	div3.setAttribute("id", "div3");
	div3.setAttribute("class", "masterBody emptyContainer");

	div4.setAttribute("id", "div4");
	div4.setAttribute("class", "masterBody");
	div4.setAttribute("Style", "overflow-y:scroll; display:none;");

	var bottom = document.createElement("div");

	bottom.setAttribute("id", "bottom");
	/*	bottom.setAttribute("style","height: 50%;")*/

	$("#div4").append(bottom);

	var element1 = document.createElement("table");
	$("#div3").append(element1);
	element1.setAttribute("id", "table1");
	element1.setAttribute("cellspacing", "0px");
	/*element1.setAttribute("cellpaddding","10px");*/
	element1.setAttribute("class", "table-hover");

	var w = window.innerWidth;

	if (w < 500) {
		element1.setAttribute("style", "width:300%;");
	} else if (w < 1100) {
		element1.setAttribute("style", "width:250%;");
	}
	else if (w < 1500) {
		element1.setAttribute("style", "width:100%;");
	} else if (w < 1000) {
		element1.setAttribute("style", "width:150%;");
	} else {
		element1.setAttribute("style", "width:100%;");
	}

	var element1_1 = document.createElement("thead");
	element1.append(element1_1);

	var element1_2 = document.createElement("tr");


	var element1_3 = document.createElement("tbody");
	element1.append(element1_3)
	element1_3.setAttribute("id", "tableBody");


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

	var searchTitles = [];
	var placeholder = [];
	for (var i = 0; i < searchTitles.length; i++) {
		var searchContainer = document.createElement("th");
		searchContainer.setAttribute("class", "tableheading");
		var searchinput = document.createElement("input");
		var list = document.createElement("datalist")

		searchinput.setAttribute("title", searchTitles[i]);
		searchinput.setAttribute("list", searchTitles[i]);
		searchinput.setAttribute("placeholder", placeholder[i]);
		list.setAttribute("id", searchTitles[i]);
		searchinput.setAttribute("class", "searchFilterClass inputs");
		searchContainer.append(searchinput, list);
		searchRow.append(searchContainer);
	}

	element1_1.append(searchRow);
	element1_1.append(element1_2);

	var element18_2 = document.createElement("div");
	element18_2.setAttribute("class", "buttonsContainer");

	var element41 = document.createElement("div");
	element41.setAttribute("class", "buttonsContainer");

	var element44 = document.createElement("button");
	element44.setAttribute("class", "data");
	element44.setAttribute("title", "Excel Download");

	element41.append(element44);
	element18_2.append(element41);

	$("#bottom").append(element18_2);

	$("#pageSelect").empty();

	getCurrentDate();
	getAllConveyorInList();


	manpowerDashboardData();

});
function manpowerDashboardData() {
	var conveyor = $('input[title="searchConveyor"]').val() ?? '';
	var from = $("input[name=from]").val();
	var to = $("input[name=to]").val();

	$.ajax({
		type: 'POST',
		url: '/WebApplication/Controllers/getAllConveyorData',
		contentType: 'application/json',
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		data: JSON.stringify({ dateTime: from + "," + to, conveyor: conveyor }),
		success: function(response) {
			if (!response || !response.conveyorDataMap) {
				console.error("Invalid response format", response);
				alert("Error retrieving conveyor data.");
				return;
			}

			console.log(response); // Log the entire response for debugging
			$("#div3").removeClass("emptyContainer");
			const totalPeopleDeployed = response.totalPeopleDeployedAllConveyors;
			const totalGateIns = response.totalGateIns;
			const presentCount = response.presentCount;
			const absentCount = response.absentCount;
			const conveyorDataMap = response.conveyorDataMap;
			const allConveyorPresentEmployee = response.allConveyorPresentEmployee;
			const totalInfo = `Total People Planned: ${totalPeopleDeployed} | Total Gate Ins: ${totalGateIns}`;
			alert(totalInfo);



			$('#summary').remove();
			const summary = $('<div id="summary" class="summary-container"></div>');
			$('#div3').append(summary);

			summary.html(`
                <div class="card mb-3">
                    <div class="card-header bg-primary text-white">
                        <h5 class="card-title">Dashboard Summary</h5>
                    </div>
                    <div class="card-body">
                        <div class="summary-row">
                            <Button class="btn btn-primary" id="totalPeopleDeployed"><strong>Total Planned:</strong> ${totalPeopleDeployed}</Button>
                            <Button class="btn btn-secondary" id="totalGateIns"><strong>Total Gate Ins:</strong> ${totalGateIns}</Button>
                            <Button class="btn btn-success" id="allConveyorPresentEmployee"><strong>Total Deployed:</strong> ${allConveyorPresentEmployee}</Button>
                            <Button class="btn btn-danger" id="allAbsentData"><strong>Absent Employees:</strong> ${absentCount}</Button>
                            <button id="showMissingMap" class="btn btn-warning">Show Missing Map</button>
                        </div>
                    </div>
                </div>
            `);

			// Append styles
			$('<style>').text(`
                .summary-container { padding: 1px; background-color: #e6e6e6; }
                .card { border-radius: 10px; overflow: hidden; }
                .card-header { font-size: 1.25rem; text-align: center; }
                .card-body { font-size: 1rem; line-height: 1.6; }
                .summary-row { display: flex; flex-wrap: wrap; gap: 50px; }
                .summary-item { flex: 1; justify-content: center; align-items: center; margin-left: 5%; }
            `).appendTo('head');

			$('#chartsContainer').remove();
			const chartsContainer = $('<div id="chartsContainer"></div>');
			$('#div3').append(chartsContainer);
			chartsContainer.addClass('charts-grid');

			for (const [conveyorName, datesData] of Object.entries(conveyorDataMap)) {
				let totalExtra = 0, totalShortFall = 0, totalDeviation1 = 0, totalDeviation2 = 0, totalSkillMatched = 0;
				let absent = 0, present = 0;
				let totalMissingEmployees = 0;

				for (const [date, data] of Object.entries(datesData)) {
					if (date >= from && date <= to) {
						totalExtra += data.extraEmployeeCount || 0;
						totalShortFall += data.shortFall || 0;
						totalDeviation1 += data.deviation1Count || 0;
						totalDeviation2 += data.deviation2Count || 0;
						totalSkillMatched += data.skillMatched || 0;
						absent += data.absent || 0;
						present += data.present || 0;
					}
				}

				if (response.missingMap && response.missingMap[conveyorName]) {
					const datesArray = response.missingMap[conveyorName];

					for (const date in datesArray) {
						const employees = datesArray[date];
						totalMissingEmployees += employees.length;
					}
				}

				console.log(`Total Missing Employees for ${conveyorName}: `, totalMissingEmployees);


				const totalEmployees = response.totalEmployeeDeployedMap[conveyorName] || 0;
				const totalGateInEmployees = response.totalPresentEmployee[conveyorName] || 0;



				const labels = ['Total Empl.', 'Total GateIn', 'Present', 'Absent', 'Missing', 'Extra', 'Skill Matched', 'Shortfall', 'Deviation 1', 'Deviation 2'];
				const values = [totalEmployees, totalGateInEmployees, present, absent, totalMissingEmployees, totalExtra, totalSkillMatched, totalShortFall, totalDeviation1, totalDeviation2];

				const chartDiv = $(`<div class="chart-item"><h3>${conveyorName}</h3></div>`);
				const canvasId = `chart_${conveyorName.replace(/\s+/g, '_')}`;
				const canvas = $('<canvas></canvas>').attr('id', canvasId).attr('width', '400').attr('height', '400').attr('class', 'canvasClass');
				chartDiv.append(canvas);
				chartsContainer.append(chartDiv);

				const ctx = document.getElementById(canvasId).getContext('2d');
				Chart.register(ChartDataLabels);
				const chartData = {
					labels: labels,
					datasets: [{
						label: `Data for ${conveyorName}`,
						data: values,
						backgroundColor: ['#36a2eb', '#ff6384', '#ffcd56', '#ff0000', '#9966ff', '#FF9F40', '#4bc0c0', '#800080', '#008000'],
						borderColor: ['#36a2eb', '#ff6384', '#ffcd56', '#ff0000', '#9966ff', '#FF9F40', '#4bc0c0', '#800080', '#008000'],
						borderWidth: 1
					}]
				};


				new Chart(ctx, {
					type: 'bar',
					data: chartData,
					options: {
						responsive: true,
						maintainAspectRatio: false,
						plugins: {
							legend: { position: 'top' },
							tooltip: {
								callbacks: {
									label: function(tooltipItem) {
										return `${tooltipItem.label}: ${tooltipItem.raw}`;
									}
								}
							},
							datalabels: {
								anchor: 'center',
								align: 'center',
								color: 'black',
								font: { weight: 'bold', size: 14 },
								formatter: function(value) {
									return value;
								}
							}
						},
						scales: {
							x: { stacked: true, beginAtZero: true, grid: { display: false } },
							y: { stacked: true, beginAtZero: true, grid: { display: false } }
						}
					}
				});
			}


			if (response.missingMap) {
				$('#showMissingMap').on('click', function() {
					console.log("Show missing map clicked");
					showMissingMap(response.missingMap);

				});
			} else {
				$('#showMissingMap').hide();
			}

			if (response.absentMap) {
				$('#allAbsentData').on('click', function() {
					showAllAbsentMap(response.absentMap);

				});
			} else {
				$('#showMissingMap').hide();
			}

			$('#allConveyorPresentEmployee').on('click', function() {
				showTotalDeployedMapData(response.totalEmployeeDeployedMapData);

			});

			$('#totalGateIns').on('click', function() {
				showTotalGateInMapData(response.totalGateInDatas);

			});

		},
		error: function(error) {
			console.error('Error fetching data', error);
			alert("An error occurred while fetching data.");
		}
	});
}


function showMissingMap(missingMap) {
	// Clear previous content
	$('#missingDataContent').empty();
	$('#missingDataModalLabel').text("Missing Employee");

	// Create a main table
	const table = $('<table class="table table-bordered"></table>');
	const header = $('<thead><tr><th style="background-color:#b3b3b3">Conveyor Name</th><th style="background-color:#b3b3b3">Date</th><th style="background-color:#b3b3b3">Missing Data</th></tr></thead>');
	const body = $('<tbody></tbody>');
	table.append(header);

	for (const [conveyorName, datesData] of Object.entries(missingMap)) {
		for (const [date, items] of Object.entries(datesData)) {
			const row = $('<tr></tr>');
			row.append(`<td style="width:30%">${conveyorName}</td>`);
			row.append(`<td>${date}</td>`);

			const subTable = $(`
	         <table class="table table-bordered">
	             <thead>
	                 <tr>
	                     <th style="color:white;background-color:black">Emp. Planned</th>
	                     <th style="color:white;background-color:black">Emp. Deploy</th>
	                     <th style="color:white;background-color:black">Name</th>
	                     <th style="color:white;background-color:black">Station</th>
						 <th style="color:white;background-color:black">In-Time</th>
						 <th style="color:white;background-color:black">Out-Time</th>
	                 </tr>
	             </thead>
	         </table>
	     `);
			const subBody = $('<tbody></tbody>');

			items.forEach(item => {
				const itemArray = item.split(',');

				const subRow = $('<tr></tr>');
				subRow.append(`<td>${itemArray[4].trim()}</td>`);
				let deployed = itemArray[7]?.trim();
				if (!deployed || deployed.toLowerCase() == "null" || deployed == "") {
					deployed = "&nbsp;";
				}
				subRow.append(`<td>${deployed}</td>`);

				let nameData = itemArray[13]?.trim();

				if (!nameData || nameData.toLowerCase() == "null" || nameData == "") {
					nameData = itemArray[12]?.trim();
				}

				if (!nameData || nameData.toLowerCase() == "null" || nameData == "") {
					nameData = "&nbsp;";
				}

				subRow.append(`<td>${nameData}</td>`);
				subRow.append(`<td>${itemArray[2].trim()}</td>`);

				subRow.append(`<td>${itemArray[14].trim()}</td>`);

				let out = itemArray[15]?.trim();
				if (!out || out.toLowerCase() == "null" || out == "") {
					out = "&nbsp;";
				}
				subRow.append(`<td>${out}</td>`);

				subBody.append(subRow);
			});

			subTable.append(subBody);
			row.append(`<td></td>`);
			$(row).find('td:last').append(subTable);

			body.append(row);
		}
	}

	table.append(body);
	$('#missingDataContent').append(table);

	$('#missingDataModal').modal('show');
}

function showAllAbsentMap(absentMap) {
	// Clear previous content
	$('#missingDataContent').empty();
	$('#missingDataModalLabel').text("Absent Employee");

	// Create a main table
	const table = $('<table class="table table-bordered"></table>');
	const header = $('<thead><tr><th style="background-color:#b3b3b3">Conveyor Name</th><th style="background-color:#b3b3b3">Date</th><th style="background-color:#b3b3b3">Absent Data</th></tr></thead>');
	const body = $('<tbody></tbody>');
	table.append(header);

	for (const [conveyorName, datesData] of Object.entries(absentMap)) {
		for (const [date, items] of Object.entries(datesData)) {
			const row = $('<tr></tr>');
			row.append(`<td style="width:30%">${conveyorName}</td>`);
			row.append(`<td>${date}</td>`);

			const subTable = $(`
	         <table class="table table-bordered">
	             <thead>
	                 <tr>
	                     <th style="color:white;background-color:black">Emp. Planned</th>
	                     <th style="color:white;background-color:black">Emp. Deploy</th>
	                     <th style="color:white;background-color:black">Name</th>
	                     <th style="color:white;background-color:black">Station</th>
	                 </tr>
	             </thead>
	         </table>
	     `);
			const subBody = $('<tbody></tbody>');

			items.forEach(item => {
				const itemArray = item.split(',');

				const subRow = $('<tr></tr>');

				subRow.append(`<td>${itemArray[4].trim()}</td>`);
				let deployed = itemArray[13]?.trim();
				if (!deployed || deployed.toLowerCase() == "null" || deployed == "") {
					deployed = "&nbsp;";
				}
				subRow.append(`<td>${deployed}</td>`);

				let nameData = itemArray[13]?.trim();

				if (!nameData || nameData.toLowerCase() == "null" || nameData == "") {
					nameData = itemArray[12]?.trim();
				}

				if (!nameData || nameData.toLowerCase() == "null" || nameData == "") {
					nameData = "&nbsp;";
				}
				subRow.append(`<td>${nameData}</td>`);
				subRow.append(`<td>${itemArray[2].trim()}</td>`);

				subBody.append(subRow);
			});

			subTable.append(subBody);
			row.append(`<td></td>`);
			$(row).find('td:last').append(subTable);

			body.append(row);
		}
	}


	table.append(body);
	$('#missingDataContent').append(table);

	$('#missingDataModal').modal('show');
}

function showTotalDeployedMapData(totalEmployeeDeployedMapData) {
	// Clear previous content
	$('#missingDataContent').empty();
	$('#missingDataModalLabel').text("Total Deployed Employee");

	// Create a main table
	const table = $('<table class="table table-bordered"></table>');
	const header = $('<thead><tr><th style="background-color:#b3b3b3">Conveyor Name</th><th style="background-color:#b3b3b3">Date</th><th style="background-color:#b3b3b3">Deployed Data</th></tr></thead>');
	const body = $('<tbody></tbody>');
	table.append(header);

	for (const [conveyorName, datesData] of Object.entries(totalEmployeeDeployedMapData)) {
		for (const [date, items] of Object.entries(datesData)) {
			const row = $('<tr></tr>');
			row.append(`<td style="width:30%">${conveyorName}</td>`);
			row.append(`<td>${date}</td>`);

			const subTable = $(`
          <table class="table table-bordered">
              <thead>
                  <tr>
                      <th style="color:white;background-color:black">Emp. Planned</th>
                      <th style="color:white;background-color:black">Emp. Deploy</th>
                      <th style="color:white;background-color:black">Name</th>
                      <th style="color:white;background-color:black">Station</th>
                  </tr>
              </thead>
          </table>
      `);
			const subBody = $('<tbody></tbody>');

			items.forEach(item => {
				const itemArray = item.split(',');

				const subRow = $('<tr></tr>');
				subRow.append(`<td>${itemArray[4].trim()}</td>`);
				let deployed = itemArray[13]?.trim();
				if (!deployed || deployed.toLowerCase() == "null" || deployed == "") {
					deployed = "&nbsp;";
				}
				subRow.append(`<td>${deployed}</td>`);
				let nameData = itemArray[13]?.trim();

				if (!nameData || nameData.toLowerCase() == "null" || nameData == "") {
					nameData = itemArray[12]?.trim();
				}

				if (!nameData || nameData.toLowerCase() == "null" || nameData == "") {
					nameData = "&nbsp;";
				}

				subRow.append(`<td>${nameData}</td>`);
				subRow.append(`<td>${itemArray[2].trim()}</td>`);

				subBody.append(subRow);
			});

			subTable.append(subBody);
			row.append(`<td></td>`);
			$(row).find('td:last').append(subTable);

			body.append(row);
		}
	}

	table.append(body);
	$('#missingDataContent').append(table);

	$('#missingDataModal').modal('show');
}
function showTotalGateInMapData(totalGateInMapData) {
	// Clear previous content
	$('#missingDataContent').empty();
	$('#missingDataModalLabel').text("Total Gate In Employee");

	// Create a main table
	const table = $('<table class="table table-bordered"></table>');
	const header = $('<thead><tr><th style="background-color:#b3b3b3">Conveyor Name</th><th style="background-color:#b3b3b3">Date</th><th style="background-color:#b3b3b3">Gate In Data</th></tr></thead>');
	const body = $('<tbody></tbody>');
	table.append(header);

	for (const [conveyorName, datesData] of Object.entries(totalGateInMapData)) {
		for (const [date, items] of Object.entries(datesData)) {
			const row = $('<tr></tr>');
			row.append(`<td style="width:30%">${conveyorName}</td>`);
			row.append(`<td>${date}</td>`);

			const subTable = $(`
	         <table class="table table-bordered">
	             <thead>
	                 <tr>
	                     <th style="color:white;background-color:black">Emp. Id</th>
	                     <th style="color:white;background-color:black">Name</th>
	                     <th style="color:white;background-color:black">Station</th>
	                     <th style="color:white;background-color:black">IN-Time</th>
	                 </tr>
	             </thead>
	         </table>
	     `);
			const subBody = $('<tbody></tbody>');

			items.forEach(item => {
				const itemArray = item.split(',');

				const subRow = $('<tr></tr>');

				subRow.append(`<td>${itemArray[7].trim()}</td>`);

				subRow.append(`<td>${itemArray[11].trim()}</td>`);

				subRow.append(`<td>${itemArray[12].trim()}</td>`);

				subRow.append(`<td>${itemArray[3].trim()}</td>`);

				subBody.append(subRow);
			});

			subTable.append(subBody);
			row.append(`<td></td>`);
			$(row).find('td:last').append(subTable);

			body.append(row);
		}
	}

	table.append(body);
	$('#missingDataContent').append(table);

	$('#missingDataModal').modal('show');
}


/*function showMissingMap(missingMap) {

	// Clear previous content
	$('#missingDataContent').empty();
	$('#missingDataModalLabel').text("Missing Employee");

	// Create a main table
	const table = $('<table class="table table-bordered"></table>');
	const header = $('<thead><tr><th style="background-color:#b3b3b3">Conveyor Name</th><th style="background-color:#b3b3b3">Missing Data</th></tr></thead>');
	const body = $('<tbody></tbody>');
	table.append(header);

	for (const [conveyorName, missingData] of Object.entries(missingMap)) {
		const row = $('<tr></tr>');
		row.append(`<td style="width:30%">${conveyorName}</td>`);


		const subTable = $(`
			<table class="table table-bordered">
				<thead>
					<tr>
						<th style="color:white;background-color:black">Emp. Planned</th>
						<th style="color:white;background-color:black">Emp. Deploy</th>
						<th style="color:white;background-color:black">Name</th>
						<th style="color:white;background-color:black">Station</th>
					</tr>
				</thead>
			</table>
		`);
		const subBody = $('<tbody></tbody>');

		missingData.forEach(item => {
			const itemArray = item.split(',');

			const subRow = $('<tr></tr>');
			subRow.append(`<td>${itemArray[4].trim()}</td>`);
			let deployed = itemArray[13]?.trim();
			if (!deployed || deployed.toLowerCase() == "null" || deployed == "") {
				deployed = "&nbsp;";
			}
			subRow.append(`<td>${deployed}</td>`);
			let nameData = itemArray[13]?.trim();


			if (!nameData || nameData.toLowerCase() == "null" || nameData == "") {
				nameData = itemArray[12]?.trim();
			}

			if (!nameData || nameData.toLowerCase() == "null" || nameData == "") {
				nameData = "&nbsp;";
			}

			subRow.append(`<td>${nameData}</td>`);
			subRow.append(`<td>${itemArray[2].trim()}</td>`);



			subBody.append(subRow);
		});

		subTable.append(subBody);
		row.append(`<td></td>`);
		$(row).find('td:last').append(subTable);

		body.append(row);
	}

	table.append(body);
	$('#missingDataContent').append(table);

	$('#missingDataModal').modal('show');
}


function showAllAbsentMap(missingMap) {

	// Clear previous content
	$('#missingDataContent').empty();
	$('#missingDataModalLabel').text("Absent Employee");

	// Create a main table
	const table = $('<table class="table table-bordered"></table>');
	const header = $('<thead><tr><th style="background-color:#b3b3b3">Conveyor Name</th><th style="background-color:#b3b3b3">Absent Data</th></tr></thead>');
	const body = $('<tbody></tbody>');
	table.append(header);

	for (const [conveyorName, missingData] of Object.entries(missingMap)) {
		const row = $('<tr></tr>');
		row.append(`<td style="width:30%">${conveyorName}</td>`);

		const subTable = $(`
			<table class="table table-bordered">
				<thead>
					<tr>
						<th style="color:white;background-color:black">Emp. Planned</th>
						<th style="color:white;background-color:black">Emp. Deploy</th>
						<th style="color:white;background-color:black">Name</th>
						<th style="color:white;background-color:black">Station</th>
					</tr>
				</thead>
			</table>
		`);
		const subBody = $('<tbody></tbody>');
		subBody.css("height", "5%");
		subBody.css("overflow-y", "auto");
		missingData.forEach(item => {
			const itemArray = item.split(',');

			const subRow = $('<tr></tr>');
			subRow.append(`<td>${itemArray[4].trim()}</td>`);
			let deployed = itemArray[13]?.trim();
			if (!deployed || deployed.toLowerCase() == "null" || deployed == "") {
				deployed = "&nbsp;";
			}
			subRow.append(`<td>${deployed}</td>`);

			let nameData = itemArray[13]?.trim();


			if (!nameData || nameData.toLowerCase() == "null" || nameData == "") {
				nameData = itemArray[12]?.trim();
			}

			if (!nameData || nameData.toLowerCase() == "null" || nameData == "") {
				nameData = "&nbsp;";
			}

			subRow.append(`<td>${nameData}</td>`);
			subRow.append(`<td>${itemArray[2].trim()}</td>`);

			subBody.append(subRow);
		});

		subTable.append(subBody);
		row.append(`<td></td>`);
		$(row).find('td:last').append(subTable);

		body.append(row);
	}

	table.append(body);
	$('#missingDataContent').append(table);

	$('#missingDataModal').modal('show');
}

function showTotalDeployedMapData(missingMap) {

	// Clear previous content
	$('#missingDataContent').empty();
	$('#missingDataModalLabel').text("Deployed Employee");

	// Create a main table
	const table = $('<table class="table table-bordered"></table>');
	const header = $('<thead><tr><th style="background-color:#b3b3b3">Conveyor Name</th><th style="background-color:#b3b3b3">Deployed Data</th></tr></thead>');
	const body = $('<tbody></tbody>');
	table.append(header);

	for (const [conveyorName, missingData] of Object.entries(missingMap)) {
		const row = $('<tr></tr>');
		row.append(`<td style="width:30%">${conveyorName}</td>`);

		const subTable = $(`
			<table class="table table-bordered">
				<thead>
					<tr>
						<th style="color:white;background-color:black">Emp. Planned</th>
						<th style="color:white;background-color:black">Emp. Deploy</th>
						<th style="color:white;background-color:black">Name</th>
						<th style="color:white;background-color:black">Station</th>
						<th style="color:white;background-color:black">In-Time</th>
						<th style="color:white;background-color:black">Attendance</th>
					</tr>
				</thead>
				<tbody></tbody>
			</table>
		`);

		const subBody = subTable.find('tbody');

		missingData.forEach(item => {
			const itemArray = item.split(',');


			const subRow = $('<tr></tr>');
			subRow.append(`<td>${itemArray[4].trim()}</td>`);
			let deployed = itemArray[13]?.trim();
			if (!deployed || deployed.toLowerCase() == "null" || deployed == "") {
				deployed = "&nbsp;";
			}
			subRow.append(`<td>${deployed}</td>`);

			let nameData = itemArray[13]?.trim();
			if (!nameData || nameData.toLowerCase() == "null" || nameData == "") {
				nameData = itemArray[12]?.trim();
			}
			if (!nameData || nameData.toLowerCase() == "null" || nameData == "") {
				nameData = "&nbsp;";
			}
			subRow.append(`<td>${nameData}</td>`);

			subRow.append(`<td>${itemArray[2].trim()}</td>`);

			let attendance = itemArray[10]?.trim();
			if (!attendance || attendance.toLowerCase() == "null" || attendance == "") {
				attendance = "&nbsp;";
			}
			subRow.append(`<td>${attendance}</td>`);

			let intime = itemArray[14]?.trim();
			if (!intime || intime.toLowerCase() == "null" || intime == "") {
				intime = "&nbsp;";
			}
			subRow.append(`<td>${intime}</td>`);

			subBody.append(subRow);
		});

		row.append(`<td></td>`);
		$(row).find('td:last').append(subTable);

		body.append(row);
	}

	table.append(body);
	$('#missingDataContent').append(table);

	$('#missingDataModal').modal('show');
}

function showTotalGateInMapData(missingMap) {

	// Clear previous content
	$('#missingDataContent').empty();
	$('#missingDataModalLabel').text("TotalGateIn Employee");

	// Create a main table
	const table = $('<table class="table table-bordered"></table>');
	const header = $('<thead><tr><th style="background-color:#b3b3b3">Conveyor Name</th><th style="background-color:#b3b3b3">Deployed Data</th></tr></thead>');
	const body = $('<tbody></tbody>');
	table.append(header);

	for (const [conveyorName, missingData] of Object.entries(missingMap)) {
		const row = $('<tr></tr>');
		row.append(`<td style="width:30%">${conveyorName}</td>`);

		const subTable = $(`
			<table class="table table-bordered">
				<thead>
					<tr>
						<th style="color:white;background-color:black">Employee Id</th>
						<th style="color:white;background-color:black">Name</th>
						<th style="color:white;background-color:black">Station</th>
						<th style="color:white;background-color:black">In-Time</th>
					</tr>
				</thead>
				<tbody></tbody>
			</table>
		`);

		const subBody = subTable.find('tbody');

		missingData.forEach(item => {
			const itemArray = item.split(',');


			const subRow = $('<tr></tr>');
			subRow.append(`<td>${itemArray[7].trim()}</td>`);

			subRow.append(`<td>${itemArray[11].trim()}</td>`);

			subRow.append(`<td>${itemArray[12].trim()}</td>`);

			subRow.append(`<td>${itemArray[3].trim()}</td>`);


			subBody.append(subRow);
		});

		row.append(`<td></td>`);
		$(row).find('td:last').append(subTable);

		body.append(row);
	}

	table.append(body);
	$('#missingDataContent').append(table);

	$('#missingDataModal').modal('show');
}

*/


$(document).on("click", "#closeDetails", function() {
	$('#missingDataModal').modal('hide');
});


//------------------------------------------------------ 

function updateActionStatus(actionStatus, remarks, uiKey) {
	if (!window.clickedRowData) {
		alert("No data available from the clicked row!");
		return;
	}

	const { rqcResultId } = window.clickedRowData;

	if (!rqcResultId) {
		alert("Missing RQC Result ID!");
		return;
	}
	
	console.log(actionStatus, remarks, uiKey );

	$.ajax({
		url: '/WebApplication/Controllers/action_status_rqcresult_and_reading',
		method: 'PUT',
		headers: {
		    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
		},
		data: {
			rqcResultId: rqcResultId,
			remarks: remarks,
			actionStatus: actionStatus
		},
		success: function() {
			
			loadReceivingQualityReport(0);

			// loadReceivingQualityReport(0) updates the object2 but it takes time on slow network
			const checkInterval = setInterval(function () {
			    const object2 = window.rqcRowDataMap[uiKey];
				const globalFailureMap = window.globalFailureMap;

			    if (object2 && (object2.actionTaken === "1" || object2.actionTaken === "2")) { 
			        clearInterval(checkInterval); // Stop checking

			        //console.log(object2);
					//console.log(globalFailureMap);
					// Pass the RQC data object 
					populateInlineRemarkSection(object2, globalFailureMap); // `object2` contains RQC fields like remark, attachmentPath etc.

			        alert("Action status updated successfully.");
			    }
			}, 200); // check every 200ms

		},
		error: function(xhr, status, error) {
			console.error("XHR Response:", xhr);
			console.error("Status:", status);
			console.error("Error:", error);
			alert("Failed to update action status: " + xhr.responseText);
		}

	});
}


let modalMode = ""; // 'reRelease' or 'sendBackSupplier'
document.getElementById("reReleaseBtn").addEventListener("click", function() {
	modalMode = "reRelease"; // Set mode

	// Trigger the hidden close button to properly close the modal
	$('#confirmationBackdropModal').modal('hide'); // confirmationBackdropModal close


	// Change modal heading
	document.getElementById("fillModalLabel").innerText = "Re-Release Deviation Form:";

	document.getElementById("deviationPassGroup").style.display = "block";
	document.getElementById("deviationQtyGroup").style.display = "block";
	
	// ✅ Reset form fields
	$("#remark").val("");
	$("#deviationQty").val("");
	$("#attachment").val("");
 	//console.log(window.clickedRowData);
	// Optional: Delay to ensure modal is closed before opening the next
	setTimeout(() => {
		// ✅ Pre-fill modal fields using clickedRowData
		if (window.clickedRowData) {
			$("#partNumber").val(window.clickedRowData.partNumber || "");
			$("#batchCode").val(window.clickedRowData.batchCode || "");
			$("#qty").val(window.clickedRowData.totalquantity || "");
			$("#failQty").val(window.clickedRowData.failedquantity || "");
			$("#supplier").val(window.clickedRowData.supplier || "");
			// Add others if needed: e.g., qty, failQty, etc.
		}
		
		// Now show the fillModal
		$("#fillModal").modal("show");
	}, 300); // 300ms delay helps avoid modal overlap issues

});

document.getElementById("sendBackBtn").addEventListener("click", function () {
	modalMode = "sendBackSupplier"; // Set mode

	// Trigger the hidden close button to properly close the modal
	$('#confirmationBackdropModal').modal('hide');// confirmationBackdropModal close

    // Change modal heading
    document.getElementById("fillModalLabel").innerText = "Send back to supplier:";

    // Hide deviation-related fields
    document.getElementById("deviationPassGroup").style.display = "none";
    document.getElementById("deviationQtyGroup").style.display = "none";

	// ✅ Reset form fields
	$("#remark").val("");
	$("#deviationQty").val("");
	$("#attachment").val("");

	setTimeout(() => {
		// ✅ Pre-fill modal fields using clickedRowData
		if (window.clickedRowData) {
			$("#partNumber").val(window.clickedRowData.partNumber || "");
			$("#batchCode").val(window.clickedRowData.batchCode || "");
			$("#qty").val(window.clickedRowData.totalquantity || "");
			$("#failQty").val(window.clickedRowData.failedquantity || "");
			$("#supplier").val(window.clickedRowData.supplier || "");
			// Add others if needed: e.g., qty, failQty, etc.
		}
    // Show the fill modal
    $('#fillModal').modal('show');

	}, 300); // 300ms delay helps avoid modal overlap issues

});


document.getElementById("myForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const remark = document.getElementById("remark").value.trim();
	if (!remark) {
	    alert("Remark is required. Please fill it before submitting.");
	    return; // stop submission if remark is empty
	}
    const deviationQty = document.getElementById("deviationQty").value.trim();
    const file = document.getElementById("attachment").files[0]; // get file input
    const id = window.clickedRowData?.rqcResultId;
	const uiKey = window.clickedRowData.uiKey;
	
    if (!id) {
        alert("Invalid item. Cannot proceed.");
        return;
    }

    const formData = new FormData();
    formData.append("id", id);
    formData.append("rqc_form_remark", remark);
	formData.append("uiKey", window.clickedRowData.uiKey); //  IMPORTANT for attachment save

    if (modalMode === "reRelease") {
		
			const deviationQtynumber = deviationQty === "" ? NaN : Number(deviationQty);

		    if (isNaN(deviationQtynumber) || deviationQtynumber <= 0) {
		        alert("Deviation quantity must be a filled as positive number.");
				
		        return;
		    }

		    if (deviationQtynumber > window.clickedRowData.totalquantity) {
		        alert("Deviation quantity cannot be greater than total quantity (" +  window.clickedRowData.totalquantity + ").");
		        return;
		    }
		
        formData.append("deviation_qty", deviationQty);
        if (file) {
            formData.append("attachment", file);
        }

        fetch("/WebApplication/Controllers/rqc/updateReRelease", {
            method: "POST",
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                // ⚠️ Don't set 'Content-Type': browser will auto-set with boundary
            },
            body: formData
        })
        .then(res => {
		    if (!res.ok) {
		        return res.text().then(text => {
		            throw new Error(text || "Re-release failed");
		        });
		    }
		    return res.text();
		}) // your controller returns ResponseEntity<String>
        .then(data => {
			loadReceivingQualityReport(0);	 // update table
           
		   setTimeout(function() {
		   const object2 = window.rqcRowDataMap[uiKey];
		   const globalFailureMap = window.globalFailureMap;
		    console.log(object2);
		   				
		   // Pass the RQC data object 
		   populateInlineRemarkSection(object2, globalFailureMap); // `object2` contains RQC fields like remark, attachmentPath etc.
		   
		   alert(data || "Re-release deviation submitted successfully!");
		   }, 900);
		   
            $("#fillModal").modal("hide");

        })
        .catch(err => {
            console.error("Error:", err);
            alert("Error occurred during re-release submission.");
        });

    } else if (modalMode === "sendBackSupplier") {
        if (file) {
            formData.append("attachment", file);
        }

        fetch("/WebApplication/Controllers/rqc/sendBackToSupplier", {
            method: "POST",
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            },
            body: formData
        })
        .then(res => {
		    if (!res.ok) {
		        return res.text().then(text => {
		            throw new Error(text || "Send Back to Supplier failed");
		        });
		    }
		    return res.text();
		})
        .then(data => {
			loadReceivingQualityReport(0);	 // update table

			setTimeout(function() {
			const object2 = window.rqcRowDataMap[uiKey];
			const globalFailureMap = window.globalFailureMap;
			// console.log(object2);
							
			// Pass the RQC data object
			populateInlineRemarkSection(object2, globalFailureMap); // `object2` contains RQC fields like remark, attachmentPath etc.
			alert(data || "Remark added as sent back to the supplier.");
			}, 900);
			
            $("#fillModal").modal("hide");
        })
        .catch(err => {
            console.error("Error:", err);
            alert("Error occurred while sending back to supplier.");
        });
    }
});


/*final action  by rqc head*/
function prepareRowAndOpenFinalAction(partNumber, batchCode, supplier, rqcResultId, statusLabel, uiKey) {
	window.clickedRowData = {
		partNumber,
		batchCode,
		supplier,
		rqcResultId,
		statusLabel,
		uiKey
	};
	openFinalActionModal(statusLabel);
}


function openFinalActionModal(statusLabel) {
	const { rqcResultId } = window.clickedRowData;

	if (!rqcResultId) {
		alert("RQC Result ID is missing!");
		return;
	}

	$('#finalActionText').text(`Confirm finalization for: ${statusLabel}?`);
	$('#finalConfirmationRemark').val('');
	$('#finalrqcActionModal').modal('show');
}

function confirmFinalAction() {
	const userRemark = $('#finalConfirmationRemark').val().trim();
	const uiKey = window.clickedRowData.uiKey;
	
	let actionStatusValue;
	let systemRemark = "";

	if (window.clickedRowData.statusLabel === 'sendback') {
		actionStatusValue = "2";
		systemRemark = "Sent back to supplier finalized";
	} else if (window.clickedRowData.statusLabel === 're-release') {
		actionStatusValue = "1";
		systemRemark = "Re-released finalized";
	}
	
	// Only combine if user added a remark
	const fullRemark = userRemark ? `${systemRemark}: ${userRemark}` : systemRemark;
	console.log(actionStatusValue, systemRemark, fullRemark, userRemark, uiKey);

	updateActionStatus(actionStatusValue, fullRemark, uiKey);
	$('#finalrqcActionModal').modal('hide');
}
/* final action  by rqc head completed end */

/* purchase action modal */
$(document).on('click', '.purchase-action-btn', function() {
	
    const rqcResultId = $(this).data('id');
    const actionPath = $(this).data('action-path'); // 'sendBack' or 'reRelease'
	const uiKey = $(this).data('uikey'); // ✅ capture it here
	
    // Clear previous modal content, reset fields, etc.
    $('#purchaseModal textarea[name="remarks"]').val('');
    $('#purchaseModal input[type="file"]').val('');
	
    $('#purchaseModal').data('rqcResultId', rqcResultId);
    $('#purchaseModal').data('actionPath', actionPath);
	$('#purchaseModal').data('uiKey', uiKey); // ✅ store it
	
    if (actionPath === 'sendBack') {
        $('#purchaseModalTitle').text('Send Back to Supplier Approval: ');
        $('#sendForPlantHeadBtn').hide();
        $('#approveBtn').show().text('Approve');
        //$('#disapproveBtn').show().text('Disapprove');
		$('#disapproveBtn').hide();
    } else if (actionPath === 'reRelease') {
        $('#purchaseModalTitle').text('Re-release Approval: ');
        $('#sendForPlantHeadBtn').show().text('Send for Approval to Plant / Quality Head');
        $('#approveBtn').hide();
        $('#disapproveBtn').show().text('Disapprove');
    }

	// Show modal with static backdrop and disabled keyboard close
	$('#purchaseModal').modal({
	    backdrop: 'static',  // ✅ Don't add a second backdrop
	    keyboard: false
	});
	
    $('#purchaseModal').modal('show');
});

$('#approveBtn').click(function() {
    handlePurchaseAction('approve');
});

$('#disapproveBtn').click(function() {
    handlePurchaseAction('disapprove');
});

$('#sendForPlantHeadBtn').click(function() {
    handlePurchaseAction('sendForPlantHead');
});

function handlePurchaseAction(actionType) {

    const rqcResultId = $('#purchaseModal').data('rqcResultId');
    const actionPath = $('#purchaseModal').data('actionPath');
	const remarks = $('#purchaseModal textarea[name="remarks"]').val()?.trim();
    const attachment = $('#purchaseModal input[type="file"]')[0].files[0];
	const uiKey = $('#purchaseModal').data('uiKey'); // ✅ store it
	
	
	// ❗ Require remarks if disapproving
	if (actionType === 'disapprove' && (!remarks || remarks.length === 0)) {
	    alert("Remarks are required when disapproving.");
	    return;
	}
	
    // Prepare form data to send via AJAX, including file upload
    let formData = new FormData();
    formData.append('rqcResultId', rqcResultId);
    formData.append('actionPath', actionPath);
    formData.append('actionType', actionType);
    formData.append('remarks', remarks);
    if (attachment) {
        formData.append('attachment', attachment);
    }
	formData.append("uiKey", uiKey); // IMPORTANT for attachment save

    $.ajax({
        url: '/WebApplication/Controllers/purchase/approve-or-reject', // your backend endpoint
        method: 'POST',
		headers: {
		    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
		},
        data: formData,
        contentType: false,
        processData: false,
        success: function(res) {
            $('#purchaseModal').modal('hide');
            // Reload or update the table row to reflect new status
           loadReceivingQualityReport(0);
		   
			setTimeout(function() {
		   const object2 = window.rqcRowDataMap[uiKey];
		   const globalFailureMap = window.globalFailureMap;
		   // console.log(object2);
		   				
		   // Pass the RQC data object 
		   populateInlineRemarkSection(object2, globalFailureMap); // `object2` contains RQC fields like remark, attachmentPath etc.
		   alert('Action saved successfully!');
		    }, 900);
        },
        error: function(err) {
            alert('Error saving action. Please try again.');
        }
    });
}
/* purchase action modal end */


/* plant or quality head action modal  */
let currentApprovalId = null;

$(document).on('click', '.open-approval-modal', function () {
    currentApprovalId = $(this).data('id'); // Store the ID
    const userDepartment = $(this).data('department'); // Get department from button
	const uiKey = $(this).data('uikey'); // ✅ capture it here
	console.log(uiKey);
    // Store department and ID in modal's data attributes
    $('#finalApprovalModal').data('rqc-id', currentApprovalId);
    $('#finalApprovalModal').data('user-department', userDepartment);
	$('#finalApprovalModal').data('uiKey', uiKey);
	
	$('#finalApprovalModal').modal({
	    backdrop: 'static',  // prevent second backdrop
	    keyboard: false
	}).modal('show');

    $('#finalApprovalModal').modal('show');
});

$('#modalApproveBtn').click(function () {
    const id = $('#finalApprovalModal').data('rqc-id');
    const userDepartment = $('#finalApprovalModal').data('user-department');
	const uiKey = $('#finalApprovalModal').data('uiKey');

    let status;
    if (userDepartment === 'plant head') {
        status = 6; // Approved by Plant Head
    } else if (userDepartment === 'quality') {
        status = 8; // Approved by Quality Head
    } else {
        alert("Unauthorized department for approval.");
        return;
    }
	//console.log(uiKey);
    updateRereleaseApproval(id, status, userDepartment, uiKey);
    $('#finalApprovalModal').modal('hide');
});

$('#modalDisapproveBtn').click(function () {
    const id = $('#finalApprovalModal').data('rqc-id');
    const userDepartment = $('#finalApprovalModal').data('user-department');
	const uiKey = $('#finalApprovalModal').data('uiKey');

	
    let status;
    if (userDepartment === 'plant head') {
        status = 5; // Disapproved by Plant Head
    } else if (userDepartment === 'quality') {
        status = 7; // Disapproved by Quality Head
    } else {
        alert("Unauthorized department for disapproval.");
        return;
    }
	//console.log(uiKey);
    updateRereleaseApproval(id, status, userDepartment, uiKey);
    $('#finalApprovalModal').modal('hide');
});

function updateRereleaseApproval(id, status, userDepartment, uiKey) {
	
	console.log("Sending AJAX with:", {
	    id: id,
	    status: status,
	    userDepartment: userDepartment
	});

	
	console.log(userDepartment);
    $.ajax({
        url: '/WebApplication/Controllers/rqc/updateFinalApproval',
        type: 'POST',
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        },
        contentType: 'application/json',
        data: JSON.stringify({
            id: id,
            rereleaseApproval: status,
			userDepartment: userDepartment   // ✅ Add userDepartment here
        }),
        success: function (response) {

            // Reload or update the table row to reflect new status
            loadReceivingQualityReport(0);
			
			setTimeout(function() {
			const object2 = window.rqcRowDataMap[uiKey];
			const globalFailureMap = window.globalFailureMap;
			// console.log(object2);
							
			// Pass the RQC data object 
			populateInlineRemarkSection(object2, globalFailureMap); // `object2` contains RQC fields like remark, attachmentPath etc.
			alert('Action saved successfully.');
			 }, 900);
        },
        error: function () {
            alert('Error while saving.');
        }
    });
}


/* plant or quality head action modal end  */



/*      plant head part completes     */
function getDisplayDepartment(dept) {
  const map = {
    'rqc': 'RQC',
    'plant head': 'Plant Head',
    'quality': 'Quality',
    'purchase': 'Purchase',
  };
  return map[dept?.toLowerCase()] || dept;
}


// for dmr button clicked in any department 
// Inside your `open-dmr` click handler
$(document).on('dblclick', '.open-dmr', function (e) {
    e.stopPropagation(); // do nothing on dblclick
    e.preventDefault();
});

$(document).on('click', '.open-dmr', function (e) {
	e.stopPropagation();
	let partNumber = $(this).data("part");
	let batchCode = $(this).data("batch");
	let supplier = $(this).data("supplier");
	let qty = $(this).data("qty");
	let uiKey = $(this).data("uikey"); // ✅ now works as expected
	
	let userDepartment = $(this).data("department"); 
	console.log(uiKey);
					
	// Call the new UI builder function directly (no need to trigger #receiveQualityReport)
	buildReceiveQualityUI(partNumber, batchCode, supplier, qty);
	

	setTimeout(async function() {
		$("#input1").val(partNumber).prop("disabled", true);
		$("#input3").val(batchCode).prop("disabled", true);


	await loadReceiveQualityReportByPartNumber(partNumber, batchCode, supplier, qty);
	loadPartTotalResult(partNumber, batchCode,);
	
	const object2 = window.rqcRowDataMap[uiKey];
	const globalFailureMap = window.globalFailureMap;
	// console.log(object2);
					
	// Pass the RQC data object that you already have from previous page
	populateInlineRemarkSection(object2, globalFailureMap); // `object2` contains RQC fields like remark, attachmentPath etc.
	
	// ✅ Set department in modal title
	let displayDept = getDisplayDepartment(userDepartment); // function defined above
	document.getElementById("departmentSpan").textContent = `(${displayDept})`;

	// show the modal
	$("#dmrModal").modal("show");
	}, 500);

});

// making the drm modal
function buildReceiveQualityUI(partNumber, batchCode, supplier, qty) {
	
	console.log("Opening DMR") 
	searchLoad = false;
	clearInterval(interval);

	var bottom = document.createElement("div");

	bottom.setAttribute("id", "bottom");

	$("#div4").append(bottom);

	var table = document.createElement("table");
	table.setAttribute("id", "table1");
	table.setAttribute("cellspacing", "0px");
	table.setAttribute("border", "1px");


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

	container1.setAttribute("id", "imageAndTableContainer");
	container2.setAttribute("id", "tablesContainer");
	container3.setAttribute("id", "imageContainer");
	container4.setAttribute("id", "tableHeadContainer");
	container5.setAttribute("id", "tableBodiesContainer");
	container5.setAttribute("style", "margin:0px; padding:0px;");

	container6.setAttribute("id", "tableParameterContainer");
	container7.setAttribute("id", "tableSamplesContainer");
	container8.setAttribute("id", "resultContainer");
	container9.setAttribute("id", "approveAndResult");
	container10.setAttribute("id", "buttonContainer");

	
	$("#dmrModalContent")
	  .css({
	    "min-height": "80vh",
	    "max-height": "80vh",
	    "overflow-y": "auto",
		"padding-right": "15px", // Avoid content cut off by scrollbar
		"box-sizing": "border-box"
	  })
	  .empty()
	  .append(container1);

	  
	// $("#div3").append(container1);
	$("#dmrModalContent").empty().append(container1); // appending to html container
	container1.append(container2, container3);
	container2.append(container10, container4, container5);
	container5.append(container6, container7);

	var table2 = document.createElement("table");
	var table3 = document.createElement("table");
	var table4 = document.createElement("table");

	var thead2 = document.createElement("thead");
	var thead3 = document.createElement("thead");
	var thead4 = document.createElement("thead");

	var tbody2 = document.createElement("tbody");
	var tbody3 = document.createElement("tbody");
	var tbody4 = document.createElement("tbody");

	table2.setAttribute("id", "table2");
	table2.setAttribute("style", "width:100%");
	thead2.setAttribute("id", "thead2");
	tbody2.setAttribute("id", "tbody2");

	table3.setAttribute("id", "table3");
	table3.setAttribute("style", "width:100%");
	thead3.setAttribute("id", "thead3");
	tbody3.setAttribute("id", "tbody3");

	table4.setAttribute("id", "table4");
	thead4.setAttribute("id", "thead4");
	tbody4.setAttribute("id", "tbody4");


	var w = window.innerWidth;

	if (w < 500) {
		table.setAttribute("style", "width:300%;");
	} else if (w < 1100) {
		table.setAttribute("style", "width:250%;");
	}
	else if (w < 1500) {
		table.setAttribute("style", "width:100%;");
		table2.setAttribute("style", "width:100%;");
		table3.setAttribute("style", "width:100%;");
		table4.setAttribute("style", "width:150%;");
	} else if (w < 1000) {
		table.setAttribute("style", "width:150%;");
	} else {
		table.setAttribute("style", "width:100%;");
	}


	var tr = document.createElement("tr");
	var tr1 = document.createElement("tr");
	var tr2 = document.createElement("tr");
	var tr3 = document.createElement("tr");
	var tr4 = document.createElement("tr");
	var tr5 = document.createElement("tr");
	var tr6 = document.createElement("tr");
	var tr7 = document.createElement("tr");


	container2.append(container9, container8);
	container8.append("RESULT /T.Q/P.Q/F.Q");

	container4.append(table2);
	table2.append(thead2, tbody2);
	thead2.append(tr, tr1);

	container6.append(table3);
	table3.append(thead3, tbody3);
	thead3.append(tr2);

	container7.append(table4);
	table4.append(thead4, tbody4);
	thead4.append(tr3);
 
	var th = document.createElement("th");
	th.setAttribute("style", "width:70px; font-size:14px;");
	var th1 = document.createElement("th");
	th1.setAttribute("style", "width:100px;");
	var th2 = document.createElement("th");
	th2.setAttribute("style", "width:50px; font-size:14px;");
	var th3 = document.createElement("th");
	th3.setAttribute("style", "width:70px; font-size:14px;");
	var th4 = document.createElement("th");
	th4.setAttribute("style", "width:70px; font-size:14px;");
	var th5 = document.createElement("th");
	th5.setAttribute("style", "width:150px; font-size:14px;");
	var th6 = document.createElement("th");
	th6.setAttribute("style", "width:70px; font-size:14px;");
	var th7 = document.createElement("th");
	th7.setAttribute("style", "width:70px; font-size:14px;");
	var th8 = document.createElement("th");
	th8.setAttribute("style", "width:55px; font-size:14px;");
	var th9 = document.createElement("th");
	th9.setAttribute("style", "width:45px; font-size:14px;");
	var th48 = document.createElement("th");
	th48.setAttribute("style", "width:50px;font-size:14px;");
	var th49 = document.createElement("th");
	th49.setAttribute("style", "width:30px; font-size:14px;");
	var th10 = document.createElement("th");
	th10.setAttribute("style", "width:40px;");
	th10.setAttribute("class", "tableHeading2");
	var th11 = document.createElement("th");
	th11.setAttribute("style", "width:100px;");
	th11.setAttribute("class", "tableHeading2");
	var th12 = document.createElement("th");
	th12.setAttribute("style", "width:90px;");
	th12.setAttribute("class", "tableHeading2");
	var th13 = document.createElement("th");
	th13.setAttribute("style", "width:50px;");
	th13.setAttribute("class", "tableHeading2");
	var th14 = document.createElement("th");
	th14.setAttribute("style", "width:50px;");
	th14.setAttribute("class", "tableHeading2");
	var th15 = document.createElement("th");
	th15.setAttribute("style", "width:100px;");
	th15.setAttribute("class", "tableHeading2");
	var th16 = document.createElement("th");
	th16.setAttribute("style", "width:100px;");
	th16.setAttribute("class", "tableHeading2");
	var th17 = document.createElement("th");
	th17.setAttribute("style", "width:40px;");
	th17.setAttribute("class", "tableHeading2");
	var th17_1 = document.createElement("th");
	th17_1.setAttribute("style", "width:40px;");
	th17_1.setAttribute("class", "tableHeading2");
/*	var th18 = document.createElement("th");
	th18.setAttribute("style", "width:40px;");
	th18.setAttribute("class", "tableHeading2");
	var th19 = document.createElement("th");
	th19.setAttribute("style", "width:40px;");
	th19.setAttribute("class", "tableHeading2");
	var th20 = document.createElement("th");
	th20.setAttribute("style", "width:40px;");
	th20.setAttribute("class", "tableHeading2");
	var th21 = document.createElement("th");
	th21.setAttribute("style", "width:40px;");
	th21.setAttribute("class", "tableHeading2");
	var th22 = document.createElement("th");
	th22.setAttribute("style", "width:40px;");
	th22.setAttribute("class", "tableHeading2");
	var th23 = document.createElement("th");
	th23.setAttribute("style", "width:40px;");
	th23.setAttribute("class", "tableHeading2");
	var th24 = document.createElement("th");
	th24.setAttribute("style", "width:40px;");
	th24.setAttribute("class", "tableHeading2");
	var th25 = document.createElement("th");
	th25.setAttribute("style", "width:40px;");
	th25.setAttribute("class", "tableHeading2");
	var th26 = document.createElement("th");
	th26.setAttribute("style", "width:40px;");
	th26.setAttribute("class", "tableHeading2");
	var th27 = document.createElement("th");
	th27.setAttribute("style", "width:40px;");
	th27.setAttribute("class", "tableHeading2");
	var th28 = document.createElement("th");
	th28.setAttribute("style", "width:40px;");
	th28.setAttribute("class", "tableHeading2");
	var th29 = document.createElement("th");
	th29.setAttribute("style", "width:40px;");
	th29.setAttribute("class", "tableHeading2");
	var th30 = document.createElement("th");
	th30.setAttribute("style", "width:40px;");
	th30.setAttribute("class", "tableHeading2");*/

	var input = document.createElement("input");
	var input1 = document.createElement("input");
	var input2 = document.createElement("input");
	var input3 = document.createElement("input");
	var input4 = document.createElement("input");

	var inputAttr = ["name", "partNumber", "id", "input1", "class", "inputs", "autocomplete", "off", "plceholder", "Part No...", "Style", "height:40px; font-size:14px;"];
	for (var i = 0; i < inputAttr.length; i = i + 2) {
		for (var j = 0; j <= i; j = j + 2) {
			input.setAttribute(inputAttr[i], inputAttr[j + 1]);
		}
	}

	var input2Attr = ["name", "batchcode", "id", "input3", "class", "inputs", "autocomplete", "off", "Style", "height:40px; font-size:14px;"];
	for (var i = 0; i < input2Attr.length; i = i + 2) {
		for (var j = 0; j <= i; j = j + 2) {
			input2.setAttribute(input2Attr[i], input2Attr[j + 1]);
		}
	}

	tr.append(th, th1, th2, th3);
	tr1.append(th4, th5, th6, th7, th8, th9,th48,th49);
	tr2.append(th10, th11, th12, th13, th14, th15, th16, th17, th17_1);
	//tr3.append(th18, th19, th20, th21, th22, th23, th24, th25, th26, th27, th28);

	th.innerText = "PART No :";
	th1.append(input);
	th1.setAttribute("colspan", "2");

	th2.innerText = "Part Name :";
	th3.setAttribute("id", "partNameContainer");
	th3.setAttribute("colspan", "5");

	th4.innerText = "MRN No :";
	th5.append(input2);

	th6.innerText = "RQC-P No :";
	th7.setAttribute("id", "mispNumberContainer");

	th8.innerText = "Rev No :";
	th9.setAttribute("id", "revNumberContainer");
	th48.innerText = "MRN Date :";
	const dateInput = document.createElement("input");
			dateInput.type = "date";
			dateInput.id = "mrnDate";  // id for your input
			dateInput.name = "mrnDate"; // optional name attribute

	th49.appendChild(dateInput);
			th49.setAttribute("colspan", "1");

	th10.innerText = "S.No.";
	th11.innerText = "I. ITEM";
	th12.innerText = "CRITERIA";
	th13.innerText = "MIN";
	th14.innerText = "MAX";
	th15.innerText = "METHOD";
	th16.innerText = "INSP. TOOL";
	th17.innerText = "S.Size";
	th17_1.innerText = "M.D.V";
	
/*	th18.innerText = "Result";
	th19.innerText = "S1";
	th20.innerText = "S2";
	th21.innerText = "S3";
	th22.innerText = "S4";
	th23.innerText = "S5";
	th24.innerText = "S6";
	th25.innerText = "S7";
	th26.innerText = "S8";
	th27.innerText = "S9";
	th28.innerText = "S10";*/


	(async () => {  // so no need to make the whole function async
	    await fetchAndResolveSamplePlans(partNumber, qty);

	    const largestSamplingPlan = Math.max(...Object.values(resolvedSampleMap).map(Number));
		
		// 🔹 Add "S.No" column first
		const thSno = document.createElement("th");
		thSno.style.width = "40px";
		thSno.className = "tableHeading2";
		thSno.innerText = "S.No";
		tr3.appendChild(thSno);

		// 🔹 Then "Result" column
	    const thResult = document.createElement("th");
	    thResult.style.width = "40px";
	    thResult.className = "tableHeading2";
	    thResult.innerText = "Result";
	    tr3.appendChild(thResult);

	    for (let i = 1; i <= largestSamplingPlan; i++) {
	        const th = document.createElement("th");
	        th.style.width = "40px";
	        th.className = "tableHeading2";
	        th.innerText = "S" + i;
	        tr3.appendChild(th);
	    }
	})();
	
	
	var button = document.createElement("button");
	button.setAttribute("id", "reScan");

	var increase = document.createElement("button");
	increase.setAttribute("id", "increase");

	var decrease = document.createElement("button");
	decrease.setAttribute("id", "decrease");

	// Inject CSS once
	const style = document.createElement("style");
	style.textContent = `
  .floating-label-container {
    position: relative;
    float: left;
	margin:10px;
    margin-left: 4px;
    margin-bottom: 10px;
	margin-right: 3px;
  }
  .floating-box {
    border: 2px solid #cccccc;
    border-radius: 6px;
    padding: 8px 6px;
    font-size: 14px;
    line-height: 20px;
    box-sizing: border-box;
    background: #fff;
    min-height: 35px;
  }
  .floating-label {
    position: absolute;
    top: -10px;
    left: 10px;
    background: white;
    padding: 0 6px;
    font-size: 13px;
    font-weight: bold;
    color: #444;
  }
`;
	document.head.appendChild(style);

	// Supplier
	var supplierContainer = document.createElement("div");
	supplierContainer.className = "floating-label-container";
	supplierContainer.style.width = "250px";

	var supplierLabel = document.createElement("label");
	supplierLabel.className = "floating-label";
	supplierLabel.textContent = "Supplier Name";

	var supplierDiv = document.createElement("div");
	supplierDiv.id = "supplierdiv";
	supplierDiv.className = "floating-box";
	supplierDiv.textContent = "";

	supplierContainer.append(supplierLabel, supplierDiv);

	// Quantity
	var quantityContainer = document.createElement("div");
	quantityContainer.className = "floating-label-container";
	quantityContainer.style.width = "80px";

	var quantityLabel = document.createElement("label");
	quantityLabel.className = "floating-label";
	quantityLabel.textContent = "Quantity";

	var quantityDiv = document.createElement("div");
	quantityDiv.id = "quantity";
	quantityDiv.className = "floating-box";
	quantityDiv.textContent = "";

	quantityContainer.append(quantityLabel, quantityDiv);

	// Model
	var modelContainer = document.createElement("div");
	modelContainer.className = "floating-label-container";
	modelContainer.style.width = "280px";

	var modelLabel = document.createElement("label");
	modelLabel.className = "floating-label";
	modelLabel.textContent = "Model";

	var modelDiv = document.createElement("div");
	modelDiv.id = "modelName";
	modelDiv.className = "floating-box";
	modelDiv.textContent = "";

	modelContainer.append(modelLabel, modelDiv);

	// Append to container10
	container10.append(supplierContainer, quantityContainer, modelContainer, decrease, increase);
	

	$("#imageAndTableContainer")
	  .css({
	    "min-height": "60vh",
	    "max-height": "60vh",
		"overflow-y": "auto",
	  });

}

$('#dmrModal').on('click','.hope', function () {
	console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkk")
  $('#dmrModalContent').empty();
});// ake empty the whole modal so on double click the row the reports also visible. and it does not create 


/* making table in dmr table */ // used in populateInlineRemarkSection()
function setupDmrTableIfNotExists() {
    if ($('#dmrTable').length === 0) {
        const tableHtml = `
            <table id="dmrTable" class="table table-bordered table-striped">
                <thead>
                    <tr id="dmrHeaderRow"></tr>
                </thead>
                <tbody id="dmrTableBody"></tbody>
            </table>
        `;
		
        $('#dmrModalContent').append(tableHtml);
		
		// Apply font-size after a brief delay to ensure DOM update
		setTimeout(() => {
		  const thead = document.querySelector('#dmrTable thead');
		  const tbody = document.querySelector('#dmrTable tbody');

		  if (thead) thead.style.setProperty('font-size', '12px', 'important');
		  if (tbody) tbody.style.setProperty('font-size', '13px', 'important');
		}, 100);
    }
}


function populateInlineRemarkSection(object, globalFailureMap) {
	
	const uiKey = `${object.partNumber}_${object.batchCode}_${object.supplier}`;
	const value = object;
	// const failureMap = {}; // using olde one globalFailureMap

	const userDepartment = sessionStorage.getItem('userDepartment')?.toLowerCase();
	const userRole = sessionStorage.getItem('role')?.toLowerCase();

	let showActionColumn = false;
	let showColumn = 1;
	let shouldShowButton; // for rqc and (plant head  or quality head.) to show Take Action button
	
	let row = "<tr>";
	const repeatKey = `${value.partNumber}_${value.supplier}`;

	// DMR & RQC Remarks
	row += `<td data-column="inspectionRemark" style="width:150px;">${value.inspectionRemark ?? '-'}</td>`;
	row += `<td data-column="rqcFormRemark" style="width:100px;">${value.rqcFormRemark ?? '-'}</td>`;

	console.log(globalFailureMap);
	// Check Fail
	if (value.result?.toLowerCase() === 'fail') {
		const failDate = new Date(value.datetime);
		const now = new Date();
		const fifteenDaysLater = new Date(failDate);
		fifteenDaysLater.setDate(failDate.getDate() + 15);
		
		const sevenDaysLater = new Date(failDate);
		sevenDaysLater.setDate(failDate.getDate() + 7);

		
		const isRepeatFailWithin15Days = globalFailureMap[repeatKey]?.some(item => { // using this globalFailureMap
			if (item === value) return false;
			const itemDate = new Date(item.datetime);
			const daysDiff = Math.abs(itemDate - failDate) / (1000 * 60 * 60 * 24);
			return daysDiff <= 15 && item.result?.toLowerCase() === 'fail' && (!item.rqcFormRemark || item.rqcFormRemark.trim() === '');
		});
		
			
		 shouldShowButton = false;
		let isRqcButtonDisabled = false;

		if (userDepartment === 'rqc') {
			// if rqc filled the remarks means taken action so don't show button unless it is 
			// rerelease disapproved AND NOT already sent back to supplier or sent back to supplier gets approved
			if (!value.rqcFormRemark || value.rqcFormRemark.trim() === '') {
				if (!isRepeatFailWithin15Days && now <= fifteenDaysLater) {
					shouldShowButton = true;
				} else { 
					isRqcButtonDisabled = true;
					shouldShowButton = true;
				}
				
				if(value.plantPermanentTimestamp || value.plantRejectTimestamp){  //null and undefined values are falsy whose negative will be true
					isRqcButtonDisabled = false;
				}
			}
		} else if (userDepartment === 'plant head' || userDepartment === 'quality') {
			if (!value.rqcFormRemark || value.rqcFormRemark.trim() === '') {
				if (isRepeatFailWithin15Days || now > fifteenDaysLater || now > sevenDaysLater) {
					shouldShowButton = true;
				} 			
				
			}
			
		/*	if (!value.rqcFormRemark || value.rqcFormRemark.trim() === '') {
			    if (isRepeatFailWithin15Days || now > sevenDaysLater) {  // 7 days 
			        shouldShowButton = true;
			    }
			}*/
			
			if(value.plantPermanentTimestamp || value.plantRejectTimestamp){  //null and undefined values are falsy whose negative will be true
				shouldShowButton = false;
				console.log("3")
			}
		}

		if ((userDepartment === 'rqc' && userRole === 'administrator') || userDepartment === 'plant head' || userDepartment === 'quality') {
			
			const rereleaseApproval = Number(value.rereleaseApproval);
			const isReReleaseDisapproved = rereleaseApproval === 3 || rereleaseApproval === 5 || rereleaseApproval === 7;
			const backSupplier = Number(value.backSupplierApproval);

			// ✅ Final logic not to show if already sent back to supplier or it gets approved
			const isBackSupplierPending = value.backSupplierApproval !== null && backSupplier === 0;
			const isBackSupplierApproved = value.backSupplierApproval !== null && backSupplier === 2;
			// const isBackSupplierApproved = value.backSupplierApproval !== null && backSupplier === 2;

			// ✅ Should show button only if:
			// - shouldShowButton is true
			// - OR rerelease disapproved
			// - AND NOT already sent back to supplier or sent back to supplier gets approved
			
			if ((shouldShowButton || isReReleaseDisapproved) && !isBackSupplierPending && !isBackSupplierApproved) {
				// ✅ Show button
				// if ((shouldShowButton || isReReleaseDisapproved) && !(value.backSupplierApproval !== null && backSupplier === 0)) {
				showActionColumn = true; // value.backSupplierApproval !== null && backSupplier === 0
				const disabledAttr = isRqcButtonDisabled ? 'disabled' : '';
				
				let buttonClass="";
				if (userDepartment === 'rqc' && userRole === 'administrator') {
				    buttonClass = "actionTakenButton";
				} else if (userDepartment === 'plant head' || userDepartment === 'quality') {
				    buttonClass = "plantActionTakenButton";
				}			
				
				row += `
				<td>
					<button 
						class="${buttonClass ? buttonClass + ' ' : ''} btn btn-sm btn-warning" 
						style="padding: 5px 8px; font-size: 12px; border-radius: 5px;" 
						data-uikey="${uiKey}"
						data-rqcresultid="${value.rqcResultId}" 
						data-faildate="${value.datetime}"
						data-partnumber="${value.partNumber}"
						data-batchcode="${value.batchCode}"
						data-supplier="${value.supplier}"
						data-qty="${value.qty}"
						data-failqty="${value.failQty}"
						data-rerelease="${value.rereleaseApproval}" 
						data-isRepeatFailWithin15Days="${isRepeatFailWithin15Days}" 
						data-planttemporarytimestamp="${value.plantTemporaryTimestamp}"   
						data-plantpermanenttimestamp="${value.plantPermanentTimestamp}" 
						data-plantrejecttimestamp="${value.plantRejectTimestamp}"
						${disabledAttr}>
						<i class="fas fa-check-circle" style="margin-right: 5px;"></i>Take Action
					</button> 

					${(userDepartment === 'rqc' && userRole === 'administrator' && value.plantTemporaryTimestamp)
						? `<div style="font-size:11px; color:red; margin-top:4px;">
								Temporary action taken by ${value.temporaryApprovalBy || "Unknown"} on ${value.plantTemporaryTimestamp}
						   </div>`
						: ''}

						
					${ ((userDepartment === 'rqc' && userRole === 'administrator') 
						   || userDepartment === 'plant head' 
						   || userDepartment === 'quality') && value.plantPermanentTimestamp
						? `<div style="font-size:11px; color:green; margin-top:2px;">
									Permanent approval done by ${value.permanentApprovalBy || "Unknown"} on ${value.plantPermanentTimestamp}
							   </div>`
							: ''}
												
					${ ((userDepartment === 'rqc' && userRole === 'administrator') 
						   || userDepartment === 'plant head' 
						   || userDepartment === 'quality') && value.plantRejectTimestamp
						? `<div style="font-size:11px; color:red; margin-top:2px;">
									Rejection done by ${value.plantRejectBy || "Unknown"} on ${value.plantRejectTimestamp}
							   </div>`
							: ''}
					
				</td>`;

				console.log("1")
	/*		} else if(value.backSupplierApproval !== null && backSupplier === 0){
				row += `<td>-</td>`;*/
			} else { // if part will not run when show button is on.
				if(value.plantPermanentTimestamp && (userDepartment === 'plant head' || userDepartment === 'quality')){
					row += `<td>				
						<div style="font-size:11px; color:green; margin-top:2px;">
													Permanent approval done by ${value.permanentApprovalBy || "Unknown"}
					 		</div>
						</td>`;
						console.log("2")
				} else if(value.plantRejectTimestamp && (userDepartment === 'plant head' || userDepartment === 'quality')){
					row += `<td>				
						<div style="font-size:11px; color:red; margin-top:2px;">
							Rejection done by ${value.plantRejectBy || "Unknown"}
						</div>
					</td>`;
				} else {
					row += `<td>-</td>`;
				}
			}
		}
	}

	// RQC Attachment for certain roles
	if (['rqc', 'purchase', 'plant head', 'quality'].includes(userDepartment)) {
		const filePath = value.rqcAttachmentPath;
		row += filePath?.trim()
			? `<td style="width:140px;"><button class="btn btn-sm btn-success" title="View RQC Attachment" onclick="viewAttachment('${filePath}')"><i class="fas fa-eye"></i> View</button></td>`
			: `<td style="width:140px;">-</td>`;
	}

	// Purchase Remark + Attachment
	if (['purchase', 'plant head', 'quality'].includes(userDepartment)) {
		row += `<td style="width:160px;">${value.purchFormRemark?.trim() || '-'}</td>`;
		const purchaseFilePath = value.purchAttachmentPath;
		row += purchaseFilePath?.trim()
			? `<td style="width:140px;"><button class="btn btn-sm btn-info" onclick="viewAttachment('${purchaseFilePath}')"><i class="fas fa-eye"></i> View</button></td>`
			: `<td style="width:140px;">-</td>`;
	}
	
	// Purchase Remark + Attachment   to RQC
	if ((userDepartment === 'rqc' && userRole === 'administrator')){
		
		const rerelease = Number(value.rereleaseApproval);
		const backSupplier = Number(value.backSupplierApproval);
		// if purchase disapprove send back or disapprove re-release or approve the send back with any reply.
		if (backSupplier === 2 || backSupplier === 3 || rerelease === 3){ 
			row += `<td style="width:160px;">${value.purchFormRemark?.trim() || '-'}</td>`;
			const purchaseFilePath = value.purchAttachmentPath;
			row += purchaseFilePath?.trim()
				? `<td style="width:140px;"><button class="btn btn-sm btn-info" onclick="viewAttachment('${purchaseFilePath}')"><i class="fas fa-eye"></i> View</button></td>`
				: `<td style="width:140px;">-</td>`;
		}
	}
	
	// Approval Status & Final Action
	if (userDepartment === 'rqc') {
		let approvalStatus = '-';
		let showConfirmBtn = false;
		let finalActionLabel = '';

		const rerelease = Number(value.rereleaseApproval);
		const backSupplier = Number(value.backSupplierApproval);

		// --- Send Back statuses (shown may be after re-release) ---
		if (value.backSupplierApproval !== null && backSupplier === 0)
			approvalStatus += 'Send Back Approval Pending<br>';
		else if (backSupplier === 2)
			approvalStatus += '✅ Send Back to Suppl. Approved (Purchase)<br>', showConfirmBtn = false, finalActionLabel = 'sendback';
		else if (backSupplier === 3)
			approvalStatus += '❌ Disapproved back to supplier (Purchase)<br>';

		// --- Re-release statuses --- 
		if (value.rereleaseApproval !== null && rerelease === 0)
			approvalStatus += 'Re-release Approval Pending<br>';
		else if (rerelease === 3)
			approvalStatus += '❌ Disapproved re-release (Purchase)<br>';
		else if (rerelease === 4)
			approvalStatus += '⏳ Sent to Quality / Plant Head<br>';
		else if (rerelease === 6)
			approvalStatus += '✅ Re-release Approved (Plant Head)<br>', showConfirmBtn = true, finalActionLabel = 're-release';
		else if (rerelease === 5)
			approvalStatus += '❌ Re-release Disapproved (Plant Head)<br>';
		else if (rerelease === 8)
			approvalStatus += '✅ Re-release Approved (Quality)<br>', showConfirmBtn = true, finalActionLabel = 're-release';
		else if (rerelease === 7)
			approvalStatus += '❌ Re-release Disapproved (Quality)<br>';
		

		if (userRole === 'administrator') {
			row += `<td style="font-weight:bold; background-color:#f9f9f9; color:#333;">${approvalStatus}</td>`;
		}

		if (showConfirmBtn) { 
			console.log("showConfirmBtn",showConfirmBtn,"value.actionTaken",value.actionTaken,":");
			if (value.actionTaken === "1" || value.actionTaken === "2") {
				const finalizedRemark = value.remarks || "✔ Finalized";
				row += `<td style="color: green; font-weight: bold;">✅ ${finalizedRemark}</td>`;
			} else {
				row += `<td>
					<button class="btn btn-sm btn-warning" onclick="prepareRowAndOpenFinalAction(
						'${value.partNumber}', '${value.batchCode}', '${value.supplier}', '${value.rqcResultId}', '${finalActionLabel}', '${uiKey}'
					)">Finalize</button>
				</td>`;
			}
		} else {
			row += `<td>-</td>`;
		}
	}

	// Purchase Role Buttons
	if (userDepartment === 'purchase') {
		let actionForText = '-';
		let showActionButton = false;
		let rqcSelectedPath = null;

		if (value.backSupplierApproval !== null && Number(value.backSupplierApproval) === 0) {
			actionForText = "For Send Back to Supplier";
			rqcSelectedPath = 'sendBack';
			showActionButton = true;
		} else if (value.rereleaseApproval !== null && Number(value.rereleaseApproval) === 0) {
			actionForText = "Re-release";
			rqcSelectedPath = 'reRelease';
			showActionButton = true;
		}

		row += `<td>${actionForText}</td>`;

		if (showActionButton) {
			row += `<td><button class="btn btn-primary btn-sm purchase-action-btn" data-id="${value.rqcResultId}" data-action-path="${rqcSelectedPath}" data-uikey="${uiKey}">Take Action</button></td>`;
		} else {
			let forwardStatus = '-';
			const rerelease = Number(value.rereleaseApproval);
			const backSupplier = Number(value.backSupplierApproval);
			if (backSupplier === 2) forwardStatus = '✅ Sent Back Approved';
			else if (backSupplier === 3) forwardStatus = '❌ Send Back Disapproved';
			else if (rerelease === 3) forwardStatus = '❌ Re-release Disapproved';
			else if (rerelease === 4) forwardStatus = '⏳ Sent to Quality / Plant Head';
			/*else if (rerelease === 6) forwardStatus = '✅ Re-release Approved (<strong>Plant Head</strong>)';
			else if (rerelease === 8) forwardStatus = '✅ Re-release Approved (<strong>Quality</strong>)';
			else if (rerelease === 5) forwardStatus = '❌ (<strong>Plant Head</strong>) Re-release Disapproved ❌';
			else if (rerelease === 7) forwardStatus = '❌ (<strong>Quality</strong>) Re-release Disapproved ❌';*/ //  💵 
			
			else if (rerelease === 6)
			    forwardStatus = '<span style="color:green;">✅ Re-release Approved by <strong style="color:#006400;">Plant Head</strong></span>';
			else if (rerelease === 8)
			    forwardStatus = '<span style="color:green;">✅ Re-release Approved by <strong style="color:#1e90ff;">Quality</strong></span>';
			else if (rerelease === 5)
			    forwardStatus = '<span style="color:red;">❌ Re-release Disapproved by <strong style="color:#8b0000;">Plant Head</strong></span>';
			else if (rerelease === 7)
			    forwardStatus = '<span style="color:red;">❌ Re-release Disapproved by <strong style="color:#8b0000;">Quality</strong></span>';

			row += `<td style="font-weight: bold; color: #005cbf;">${forwardStatus}</td>`;
		}
	}

	// Final Action (Plant Head / Quality)
	if (['plant head', 'quality'].includes(userDepartment)) {
		const rereleaseStatus = Number(value.rereleaseApproval);
		if (rereleaseStatus === 4) {
			row += `<td><button class="btn btn-primary btn-sm open-approval-modal" 
			data-id="${value.rqcResultId}" data-department="${userDepartment}"  
			data-uikey="${uiKey}">
			<i class="bi bi-pencil-square"></i> Final Action</button>
			</td>`;
		} else {
			
			// Action already taken – show appropriate status
			let forwardStatus = '-';

			if (userDepartment === 'plant head') {
				if (rereleaseStatus === 6) {
					forwardStatus = '✅ Re-release Approved';
				} else if (rereleaseStatus === 5) {
					forwardStatus = '❌ Re-release Disapproved';
				} else if (rereleaseStatus === 8){
				    forwardStatus = '<span style="color:green;">✅ Re-release Approved by <strong style="color:#1e90ff;">Quality</strong></span>';
				} else if (rereleaseStatus === 7){
				    forwardStatus = '<span style="color:red;">❌ Re-release Disapproved by <strong style="color:#8b0000;">Quality</strong></span>';
				}
			}

			if (userDepartment === 'quality') {
				if (rereleaseStatus === 8) {
					forwardStatus = '✅ Re-release Approved';
				} else if (rereleaseStatus === 7) {
					forwardStatus = '❌ Re-release Disapproved';
				} else if (rereleaseStatus === 6){
				    forwardStatus = '<span style="color:green;">✅ Re-release Approved by <strong style="color:#006400;">Plant Head</strong></span>';
				} else  if (rereleaseStatus === 5){
				    forwardStatus = '<span style="color:red;">❌ Re-release Disapproved by <strong style="color:#8b0000;">Plant Head</strong></span>';
				}
			}
			row += `<td>${forwardStatus}</td>`;
		}
	}
	
	// Deviation history column for plant head and quality
	if (userDepartment === 'plant head' || userDepartment === 'quality') {
	  const rereleaseStatus = Number(value.rereleaseApproval);
		// shouldShowButton will means isRepeatFailWithin15Days or no action taken even after fifteenDaysLater
		// rereleaseStatus === 4 means ⏳ Sent to Quality / Plant Head for final action
	  if (shouldShowButton || rereleaseStatus === 4) {
	    row += `
	      <td>
	        <button 
	          class="btn btn-info btn-sm open-deviation-history" 
	          data-part="${value.partNumber}"
	          style="padding: 2px 5px; font-size: 12px;">
	          View History
	        </button>
	      </td>`;
	  } /*else {
		row += `<td>-</td>`;
	  }*/
	}


	// Hidden ID column
	row += `<td data-column="rqcResultId" style="display:none;">${value.rqcResultId}</td>`;
	row += "</tr>";
	setupDmrTableIfNotExists(); // must be first

	// Append final row
	$('#dmrTableBody').empty().append(row);


	// Add headers if missing
	const $thead = $('#dmrTable thead');
	if ($thead.length) {
		const $headerRow = $thead.find('tr').eq(0);
		const columnsToAdd = [];

		// columnsToAdd.push('<th class="dmr-header" style="width:120px; color:white; background-color:#1a1a1a; font-size:16px;">DMR</th>');

		if (!$headerRow.find('th.inspection-remark-header').length){
		columnsToAdd.push('<th class="inspection-remark-header" style="width:150px; color:white; background-color:#1a1a1a; font-size:16px;">Inspection Remark</th>');
		}
		if (!$headerRow.find('th.rqc-form-remark-header').length){
		columnsToAdd.push('<th class="rqc-form-remark-header" style="width:100px; color:white; background-color:#1a1a1a; font-size:16px;">RQC Remark</th>');
		}
		
		if (showColumn === 1) {
			
			if (((userDepartment === 'rqc' && userRole === 'administrator') || userDepartment === 'plant head' || userDepartment === 'quality' )  && !$headerRow.find('th.action-header').length) {
				let actionHeaderLabel = "Initiate Approval";
				if (userDepartment === 'plant head' || userDepartment === 'quality') actionHeaderLabel = "Take Action";
				columnsToAdd.push(`<th class="action-header" style="min-width:100px;color:white; background-color:#1a1a1a; font-size:16px">${actionHeaderLabel}</th>`);
			}

			if (['rqc','purchase', 'plant head', 'quality'].includes(userDepartment)) {
				if (!$headerRow.find('th.rqc-attachment-header').length)
					columnsToAdd.push('<th class="rqc-attachment-header" style="width:140px;color:white; background-color:#1a1a1a;font-size:16px">RQC Attach.</th>');
			}

			if (['purchase', 'plant head', 'quality'].includes(userDepartment)) {
				if (!$headerRow.find('th.purchase-remark-header').length)
					columnsToAdd.push('<th class="purchase-remark-header" style="width:160px;color:white;background-color:#1a1a1a;font-size:16px">Purchase Remark</th>');
				if (!$headerRow.find('th.purchase-attachment-header').length)
					columnsToAdd.push('<th class="purchase-attachment-header" style="width:140px;color:white;background-color:#1a1a1a;font-size:16px">Purchase Attachment</th>');
			}
			
			if (userDepartment === 'purchase') {
				if (!$headerRow.find('th.actionfor-header').length)
					columnsToAdd.push('<th class="actionfor-header" style="width:140px;color:white; background-color:#1a1a1a;font-size:16px">Action For</th>');
				if (!$headerRow.find('th.response-header').length)
					columnsToAdd.push('<th class="response-header" style="width:140px;color:white; background-color:#1a1a1a;font-size:16px">Response</th>');
			}
			
			if (userDepartment === 'rqc' && userRole === 'administrator') {
				const rerelease = Number(value.rereleaseApproval);
				const backSupplier = Number(value.backSupplierApproval);
				if (backSupplier === 2 || backSupplier === 3 || rerelease === 3){ 
						if (!$headerRow.find('th.purchase-remark-header').length)
							columnsToAdd.push('<th class="purchase-remark-header" style="width:160px;color:white;background-color:#1a1a1a;font-size:16px">Purchase Remark</th>');
						if (!$headerRow.find('th.purchase-attachment-header').length)
							columnsToAdd.push('<th class="purchase-attachment-header" style="width:140px;color:white;background-color:#1a1a1a;font-size:16px">Purchase Attachment</th>');
				}
			}
				

			if (userDepartment === 'rqc' && userRole === 'administrator') {
				if (!$headerRow.find('th.rqc-approval-header').length)
					columnsToAdd.push('<th class="rqc-approval-header" style="width:180px;color:white;background-color:#1a1a1a;font-size:16px">Approval Status</th>');
			}

			if (['plant head', 'quality'].includes(userDepartment) && !$headerRow.find('th.final-decision-header').length)
				columnsToAdd.push('<th class="final-decision-header" style="min-width:110px;color:white;background-color:#1a1a1a;font-size:16px">Final Decision</th>');

			if (userDepartment === 'rqc' && !$headerRow.find('th.final-action-header').length){
				columnsToAdd.push('<th class="final-action-header" style="width:200px;color:white;background-color:#1a1a1a;font-size:16px">Final Action</th>');
			}
			
			// deviation history
			if (userDepartment === 'plant head' || userDepartment === 'quality') {
	  			const rereleaseStatus = Number(value.rereleaseApproval);
				if (shouldShowButton || rereleaseStatus === 4) {
					if (!$headerRow.find('th.view-history').length){
						columnsToAdd.push('<th class="view-history" style="width:140px;color:white; background-color:#1a1a1a;font-size:16px">Deviation History</th>');
					}			
				}
			}	
		}

		if (columnsToAdd.length) {
			$headerRow.append(columnsToAdd.join(''));
		}
	}
}

$(document).on("click", ".open-deviation-history", function () {
    const partNumber = $(this).data("part");
    $("#historyPartNo").text(partNumber);

    let matchingHistory = [];

    // Search all matching part entries across suppliers
    for (const key in globalFailureMap) {
		console.log(globalFailureMap);
        if (key.startsWith(partNumber + "_")) {
            const supplier = key.split("_")[1]; // get supplier from key
            globalFailureMap[key].forEach((entry) => {
                matchingHistory.push({
                    supplier: supplier,
                    deviationQty: entry.deviationQty || "0",
                    datetime: entry.datetime || "-",
					purchFormRemark: entry.purchFormRemark,
					purchAttachmentPath: entry.purchAttachmentPath,
                });
            });
        }
    }

    // Render table rows
    let historyHtml = "";
	let shownCount = 0; // for indexing in table
    if (matchingHistory.length === 0) {
        historyHtml = `<tr><td colspan="4" class="text-center text-muted">No deviation history found for this part.</td></tr>`;
    } else {
        matchingHistory.forEach((entry, index) => {
			const deviation = parseFloat(entry.deviationQty); // converting string to number

			if(!isNaN(deviation) && deviation > 0){
				shownCount++; // for showing serial number
				historyHtml += `
				  <tr>
				    <td>${shownCount}</td>
				    <td>${entry.supplier}</td>
				    <td>${entry.deviationQty}</td>
				    <td>${entry.datetime}</td>
					<td>${entry.purchFormRemark}</td>
				  </tr>`;

			  }
        });
    }

    $("#deviationHistoryBody").html(historyHtml);
    $("#deviationHistoryModal").modal("show");
});




