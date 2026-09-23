
// start form search of handleBarcodeScanning() search multiple time will move to where barcode scanned and enter pressed.
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
/*var finalControlId = "";
var finalControlReadingId = "";
var finalControlResultId = "";*/
var instrumentId = "";
var selectedRow;
var imageWidth = 100;
var rqcResultId = "";
var splan;
var rowStatusList = [];
var pageChange = false;
var pageSize = 25;

var lastSequenceNumber = 0;
var lastPage;
let resolvedSampleMap = {}; // rowIndex: resolvedSample
let globalQuantity = 0;
let globalStoredPartNumber = 0;
let largestSamplingPlan = 0;
let sampleCountSizeForSP = 0;



function logout() {
	window.location.replace("/WebApplication/loginpage");
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

$(document).on('click', '#reScan', function() {
	window.finalSubmitted=false;
	$("#receiveQualityCheck").click();
});




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

function loadPartNumbers(partNoDataList) {
    $.ajax({
        type: 'get',
        url: '/WebApplication/Controllers/getAllApprovedPartNoInList',
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
        success: function (partNoList) {
            partNoList.forEach(function (pno) {
                var option = document.createElement("option");
                option.value = pno; // display part number
                partNoDataList.appendChild(option);
            });
        },
        error: function () {
            alert("Failed to load part numbers");
        }
    });
}

function validateDatalist(inputId, datalistId) {
    const input = document.getElementById(inputId);
    const dataList = document.getElementById(datalistId);

    input.addEventListener("change", function () {
        let isValid = false;
        for (let option of dataList.options) {
            if (option.value === input.value) {
                isValid = true;
                break;
            }
        }
        if (!isValid) {
            alert("Please select a valid option from the list!");
            input.value = "";
        }
    });
}

function enableMRNFieldIfValid() {
    const partNoInput = document.getElementById("partNoInput");
    const supplierInput = document.getElementById("supplierInput");
    const partNoList = document.getElementById("partNoList");
    const supplierList = document.getElementById("supplierList");
    const mrnInput = document.getElementById("input3"); // your MRN input id

    // validate part no
    let partValid = [...partNoList.options].some(opt => opt.value === partNoInput.value);
    // validate supplier
    let supplierValid = [...supplierList.options].some(opt => opt.value === supplierInput.value);

    if (partValid && supplierValid) {
        mrnInput.removeAttribute("disabled");  
    } else {
        mrnInput.setAttribute("disabled", true);
        mrnInput.value = ""; 
    }
}

$(document).ready(function() {
	$(document).on('click', '#receiveQualityCheck', function() {


		$(".fromTo").css("display", "none");
		$("#pageSelect").css("display", "none");
		$("#next").css("display", "none");
		$("#previous").css("display", "none");
		$("#ConnectButton").css("display", "block");
		$("#offcanvasCloseButton").click();


		var child1 = document.getElementById("div3");
		child1.remove();

		document.getElementById("masterHeading").innerText = "";
		$("#masterHeading").append("QUALITY CHECKING");

		var div3 = document.createElement("div");

		$("#div2").append(div3);

		div3.setAttribute("id", "div3");
		div3.setAttribute("class", "masterBody");

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
		container5.append(container6);


		/*		var button = document.createElement("button");
				button.setAttribute("id", "reScan");
		
				var increase = document.createElement("button");
				increase.setAttribute("id", "increase");
		
				var decrease = document.createElement("button");
				decrease.setAttribute("id", "decrease");
				
				var supplierDiv = document.createElement("div");
				supplierDiv.setAttribute("id", "supplierdiv");
				supplierDiv.setAttribute("style", "width:200px; height:35px;margin-left:10px; border:2px solid #cccccc; float:left;");
				supplierDiv.textContent = "Supplier Name .....................";
				
				var PartNo = document.createElement("div");
				PartNo.setAttribute("id", "partNo");
				PartNo.setAttribute("style", "width:200px; height:35px;margin-left:10px; border:2px solid #cccccc; float:left;");
				PartNo.textContent = "Part Number .....................";
		
				container10.append(supplierDiv,PartNo,button, decrease, increase)*/



		// Supplier section with label and value side by side
		/*var supplierContainer = document.createElement("div");
		supplierContainer.setAttribute("style", "display: flex; align-items: center; float: left; margin-left: 10px; margin-bottom: 10px;");

		var supplierLabel = document.createElement("label");
		supplierLabel.setAttribute("for", "supplierdiv");
		supplierLabel.setAttribute("style", "margin-right: 5px; width: 130px;font-weight:bolder;");
		supplierLabel.textContent = "Supplier Name:";

		var supplierDiv = document.createElement("div");
		supplierDiv.setAttribute("id", "supplierdiv");
		supplierDiv.setAttribute("style", "width:220px; height:35px; border:2px solid #cccccc; line-height:25px; padding-left: 5px; margin-top: 5px;");
		supplierDiv.textContent = "";

		supplierContainer.append(supplierLabel, supplierDiv);*/
		
		var supplierContainer = document.createElement("div");
		supplierContainer.setAttribute("style", "display: flex; align-items: center; float: left; margin-left: 10px; margin-bottom: 10px;");

		var supplierLabel = document.createElement("label");
		supplierLabel.setAttribute("for", "supplierInput");
		supplierLabel.setAttribute("style", "margin-right: 5px; width: 120px; font-weight: bolder;");
		supplierLabel.textContent = "Supplier Name:";

		// Input with datalist
		var supplierInput = document.createElement("input");
		supplierInput.setAttribute("id", "supplierInput");
		supplierInput.setAttribute("list", "supplierList");
		supplierInput.setAttribute("style", "width:230px; height:35px; border:2px solid #cccccc; margin-top: 5px; padding-left:5px;");

		// Datalist element
		var dataList = document.createElement("datalist");
		dataList.setAttribute("id", "supplierList");

		// Append label + input + datalist
		supplierContainer.append(supplierLabel, supplierInput, dataList);

		// Fetch supplier names and populate datalist
		$.ajax({
		    type: 'get',
		    url: '/WebApplication/Controllers/getAllSupplierNameInList',
		    headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		    success: function(supplierList) {
		        supplierList.forEach(function(name) {
		            var option = document.createElement("option");
		            option.value = name;  // for datalist, value is shown
		            dataList.appendChild(option);
		        });
		    },
		    error: function() {
		        alert("Failed to load supplier list");
		    }
		});


		/*var partContainer = document.createElement("div");
		partContainer.setAttribute("style", "display: flex; align-items: center; float: left; margin-left: 10px; margin-bottom: 10px;");

		var partLabel = document.createElement("label");
		partLabel.setAttribute("for", "partNo");
		partLabel.setAttribute("style", "margin-right: 5px; width: 100px;font-weight:bolder;");
		partLabel.textContent = "Part No.:";

		var PartNo = document.createElement("div");
		PartNo.setAttribute("id", "partNo");
		PartNo.setAttribute("style", "width:200px; height:35px; border:2px solid #cccccc; line-height:25px; padding-left: 5px;  margin-top: 5px;");
		PartNo.textContent = "";

		partContainer.append(partLabel, PartNo);
*/
	var modelContainer = document.createElement("div");
		modelContainer.setAttribute("style", "display: flex; align-items: center; float: left; margin-left: 10px; margin-bottom: 10px;");

		var modelLabel = document.createElement("label");
		modelLabel.setAttribute("for", "modelName");
		modelLabel.setAttribute("style", "margin-right:5px; width: 50px;font-weight:bolder;");
		modelLabel.textContent = "Model:";

		var ModelNo = document.createElement("div");
		ModelNo.setAttribute("id", "modelName");
		ModelNo.setAttribute("style", "width:250px; height:35px; border:2px solid #cccccc; line-height:25px; padding-left: 5px;  margin-top: 5px; disabled");
		ModelNo.textContent = "";

		modelContainer.append(modelLabel, ModelNo);
		
		
		// Buttons
		var button = document.createElement("button");
		button.setAttribute("id", "reScan");


		var increase = document.createElement("button");
		increase.setAttribute("id", "increase");


		var decrease = document.createElement("button");
		decrease.setAttribute("id", "decrease");


		// Append all to container10
		container10.append(supplierContainer, modelContainer, button, decrease, increase);


		//--------IMAGE-----------
		var image = document.createElement("img")
		image.setAttribute("id", "partNumberImage");
		image.setAttribute("style", "width:100%;");
		imageContainer.append(image);
		//---------------------------

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


		container4.append(table2);
		table2.append(thead2, tbody2);
		thead2.append(tr, tr1);

		container6.append(table3);
		table3.append(thead3, tbody3);
		thead3.append(tr2);
		// Wrap table3 in a fixed+scrollable layout
		container6.setAttribute("style", "overflow-x: auto; width: 100%; position: relative;");
		//table3.setAttribute("style", "border-collapse: collapse; width: max-content; table-layout: fixed;"); 
		table3.setAttribute("style", "border-collapse: collapse; width: auto; min-width: 100%; table-layout: auto;");
		// /* width: max-content; -> important to allow horizontal scroll */
		// min-width: 100%; → Ensures it’s at least as wide as the container (no gaps).
		// table-layout: auto; → Lets browser adjust column widths based on content.
		// overflow-x: auto; → Scrollbar appears if content exceeds container width.



		// below code is wriiten in generateSSeriesHeaders() for fixed+scrollable layout
		/*		var trFrozen = document.createElement("tr");
				var trScrollable = document.createElement("tr");
		
				thead3.append(trFrozen);
				thead3.append(trScrollable);*/




		container7.append(table4);
		table4.append(thead4, tbody4);
		thead4.append(tr3);

		var th = document.createElement("th");
		th.setAttribute("style", "width:70px;");
		var th1 = document.createElement("th");
		th1.setAttribute("style", "width:100px;");
		var th2 = document.createElement("th");
		th2.setAttribute("style", "width:50px; ");
		var th3 = document.createElement("th");
		th3.setAttribute("style", "width:70px; ");
		var th4 = document.createElement("th");
		th4.setAttribute("style", "width:70px; ");
		var th5 = document.createElement("th");
		th5.setAttribute("style", "width:150px;");
		var th6 = document.createElement("th");
		th6.setAttribute("style", "width:70px; ");
		var th7 = document.createElement("th");
		th7.setAttribute("style", "width:70px; ");
		var th8 = document.createElement("th");
		th8.setAttribute("style", "width:50px;");
		var th9 = document.createElement("th");
		th9.setAttribute("style", "width:50px; ");
		var th48 = document.createElement("th");
		th48.setAttribute("style", "width:50px;");
		var th49 = document.createElement("th");
		th49.setAttribute("style", "width:30px; ");
		var th9_1 = document.createElement("th");
		th9_1.setAttribute("style", "width:50px;;");
		var th9_2 = document.createElement("th");
		th9_2.setAttribute("style", "width:50px;");
		var th10 = document.createElement("th");
		th10.setAttribute("style", "width:40px;");
		th10.setAttribute("class", "tableHeading2");
		var th11 = document.createElement("th");
		th11.setAttribute("style", "width:250px;");
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
		var th17_2 = document.createElement("th");
		th17_2.setAttribute("style", "width:40px;");
		th17_2.setAttribute("class", "tableHeading2");
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



		//var input = document.createElement("input");
		var input1 = document.createElement("input");
		var input2 = document.createElement("input");
		var input3 = document.createElement("input");
		var input4 = document.createElement("input");
		var partNoInput = document.createElement("input");
		partNoInput.setAttribute("id", "partNoInput");
		partNoInput.setAttribute("list", "partNoList"); // datalist link
		partNoInput.setAttribute("style", "width:100%; height:35px; border:2px solid #cccccc; margin-top: 0px; padding-left:5px;");
		var partNoDataList = document.createElement("datalist");
		partNoDataList.setAttribute("id", "partNoList");

		/*var inputAttr = ["type", "text", "name", "partNumber", "id", "input1", "class", "inputs", "autocomplete", "off", "plceholder", "Part No...", "Style", "height:40px;"];
		for (var i = 0; i < inputAttr.length; i = i + 2) {
			for (var j = 0; j <= i; j = j + 2) {
				input.setAttribute(inputAttr[i], inputAttr[j + 1]);
			}
		}*/

		/*		var input1Attr = ["name", "partName", "id", "input2", "class", "inputs", "autocomplete", "off", "disabled", "disabled", "Style","height:40px;"];
				for (var i = 0; i < input1Attr.length; i = i + 2) {
					for (var j = 0; j <= i; j = j + 2) {
						input1.setAttribute(input1Attr[i], input1Attr[j + 1]);
					}
				}*/

		var input2Attr = ["type", "text", "name", "batchcode", "id", "input3", "class", "inputs", "autocomplete", "off", "Style", "height:40px;","disabled"];
		for (var i = 0; i < input2Attr.length; i = i + 2) {
			for (var j = 0; j <= i; j = j + 2) {
				input2.setAttribute(input2Attr[i], input2Attr[j + 1]);
			}
		}


		tr.append(th, th1, th2, th3, th9_1, th9_2);
		tr1.append(th4, th5, th6, th7, th8, th9,th48,th49);
		tr2.append(th10, th11, th12, th13, th14, th15, th16, th17, th17_1, th17_2);

		th.innerText = "Part No:";
		th1.append(partNoInput, partNoDataList);
		loadPartNumbers(partNoDataList);
		validateDatalist("partNoInput", "partNoList");
		validateDatalist("supplierInput", "supplierList");
		document.getElementById("partNoInput").addEventListener("change", enableMRNFieldIfValid);
		document.getElementById("supplierInput").addEventListener("change", enableMRNFieldIfValid);

		th2.innerText = "Part Name :";
		th3.setAttribute("id", "partNameContainer");
		//		$("#partNameContainer").attr("style","overflow:scroll;width:100px");
		th3.setAttribute("colspan", "2");

		th9_1.innerText = "Quantity :";
		th9_2.setAttribute("id", "quantity");
		th9_2.setAttribute("colspan","2");


		th4.innerText = "MRN No-Quantity:";
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
				th49.setAttribute("colspan", "1");
		
		th10.innerText = "S.No.";
		th11.innerText = "I. ITEM";
		th12.innerText = "CRITERIA"; "INSPEC STANDARD"
		th13.innerText = "MIN";
		th14.innerText = "MAX";
		th15.innerText = "METHOD";
		th16.innerText = "INSP. TOOL";
		th17.innerText = "S.P";
		th17_1.innerText = "STATUS";
		th17_2.innerText = "SAVE";

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
		
		var finalSubmitBtn = document.createElement("button");
			finalSubmitBtn.setAttribute("id", "finalSubmitBtn");
			finalSubmitBtn.setAttribute(
			  "style",
			  "display:none; background-color:green; color:white; padding:8px 16px; border:none; border-radius:4px; margin-top:20px; float:right;"
			);
			finalSubmitBtn.textContent = "Final Submit";

			// append at the bottom below tables
			document.getElementById("tableBodiesContainer").appendChild(finalSubmitBtn);

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
			this.nextElementSibling.textContent = "Show Image";
		} else {
			// Show image and shrink tables
			imageContainer.style.display = "block";
			tablesContainer.style.width = "60%";
			this.nextElementSibling.textContent = "Hide Image";
		}
	});



	/*	const toggleBtn = document.getElementById("toggleImageBtn");
		
		toggleBtn.addEventListener("change", function () {
			// fetch containers fresh every time
			const imageContainer = document.getElementById("imageContainer");
			const tablesContainer = document.getElementById("tablesContainer");
	
			if (!imageContainer) {
				alert("Please scan both QR inputs first!");
			} else {
				var image = document.createElement("img");
				image.setAttribute("id", "partNumberImage");
				image.setAttribute("style", "width:100%;");
				image.setAttribute("src", "yourImageSourceHere.png"); // set src properly
	
				// if already image exists, replace it
				var existingImg = document.getElementById("partNumberImage");
				if (existingImg) {
					existingImg.replaceWith(image);
				} else {
					imageContainer.append(image);
				}
			}
			
			if (!imageContainer) {
		  if (this.checked) {
			// Hide image and expand tables
			imageContainer.style.display = "none";
			tablesContainer.style.width = "100%";
			this.nextElementSibling.textContent = "Hide Image"; // toggle label
		  } else {
			// Show image and shrink tables
			imageContainer.style.display = "block";
			tablesContainer.style.width = "60%"; // or your original
			this.nextElementSibling.textContent = "Show Image";
		  }
		  
		  }
		});
	*/

});



function handleBarcodeScanning(barcode) {

	// var barcodeParts = barcode.split(' ');// split barcode on every space but fails if there is space at first part
	var cleanedBarcode = barcode.trim(); // remove leading/trailing spaces
	// .trim() removes accidental spaces at the start and end. // Handles multiple spaces, tabs, etc. naturally.

	var focusedInput = $("input:focus").attr('id');

	if (focusedInput === 'input1') {

		// Match: first group = part code (no spaces), second group = supplier name (with spaces allowed)
		var match = cleanedBarcode.match(/^(\S+)\s+(.+)$/);
		// First part = only non-space characters (\S+) → part number without spaces.
		// Second part = anything after at least one space (\s+), including spaces inside → supplier name.

		if (!match) {
			alert('Invalid barcode. Please enter both part number and supplier name.');
			return;
		} // Handles multiple spaces, tabs, etc. naturally.

		var partCode = match[1].trim();
		var supplierName = match[2].trim();

		if (partCode === '' || supplierName === '') {
			alert('Please provide part number and supplier name');
			return;
		}
		console.log("Sending to backend:", {
			partNumber: partCode,
			supplier: supplierName,
			//  result: 'fail' is backend this is passed explicitly 
		});

		// checks that particular part is there in quality master or not
		$.ajax({
			url: "/WebApplication/Controllers/checkPartNumberexists",
			type: 'POST',
			headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
			contentType: 'application/json',
			data: JSON.stringify({
				partNumber: String(partCode),
			}),
			success: function(data) {
				console.log("Part check response: ", data);

				if (!data.exists) {
					alert("This part does not exist in RQC-creation Master!");
					return;
				}// will not run below code

				$.ajax({
					url: '/WebApplication/Controllers/failed',
					method: 'GET',
					data: {
						partNumber: partCode,
						supplier: supplierName,
						//  result: 'fail' is backend this is passed explicitly 
					},
					headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
					success: function(data) {
						console.log("data:: ", data);
						let now = new Date();
						let shouldBlock = false;
						let repeatedFailure = false;

						/*				let cleanData = data.filter(item => 
											item.result?.toLowerCase() === 'fail'
										);
						
										// Find failures without action or remarks
										let failuresWithoutAction = cleanData.filter(item => {
											let actionTaken = (item.actionTaken || '').trim();
											let remarks = (item.remarks || '').trim();
											return !actionTaken && !remarks;
										});*/

						let failuresWithoutAction = data.filter(item => {
							let actionTaken = (item.actionTaken || '').trim();
							let remarks = (item.remarks || '').trim();
							return !actionTaken && !remarks;
						});


						console.log("failuresWithoutAction", failuresWithoutAction);
						// Check if any failure is older than 15 days
						for (let item of failuresWithoutAction) {
							let datetime = new Date(item.datetime);  // when this fail entry taken
							let daysDiff = (now - datetime) / (1000 * 60 * 60 * 24);
							console.log("daysDiff", daysDiff);
							
							console.log("item", item);
							
							// Case 1: >7 days but no approval/remarks → still blocked
							if (daysDiff >= 7 && !item.plantTemporaryTimestamp && !item.plantPermanentTimestamp && !item.remarks && !item.plantRejectTimestamp ) {
							    shouldBlock = true;
							    alert("This part+supplier is blocked 7 days pass for RQC Head. Plant Head approval (temporary/permanent) required!");
							    return;
							}
							
							// Case 2: Temporary approval present → check expiry (15 days from the fail entry taken)
							if (item.plantTemporaryTimestamp ) {
							    let tempDate = new Date(item.datetime);  // when this fail entry taken
							    let expiry = new Date(tempDate.getTime() + (15 * 24 * 60 * 60 * 1000)); // +15 days
							    if (now > expiry && !item.plantPermanentTimestamp && !item.remarks && !item.plantRejectTimestamp ) {
							        shouldBlock = true;
							        alert("Temporary approval expired! 15 days passed for RQC head. Permanent approval by Plant Head required.");
							        return;
							    }
							}
							
							// Case 3: >15 days with no approval/countermeasure
							 if (daysDiff > 15 && !item.plantPermanentTimestamp && !item.remarks && !item.plantRejectTimestamp) {
							     shouldBlock = true;
							     alert("15 days passed with no countermeasure. Supplier entry blocked! Ask Plant Head for Action");
							     return;
							 }
							 
							 // Case 4: >15 days with plant approval/countermeasure but rqc did not taken any action on last product.
							  if (daysDiff > 15 && item.plantPermanentTimestamp && !item.remarks) {
							      shouldBlock = true;
							      alert("15 days passed Plant head taken Permanent Action but RQC head now have to take the action on last Failed item part+supplier");
							      return;
							  }
							  
							  // Case 5: Plant permanent approval/countermeasure done even before 15 days but rqc did not taken any action on last product.
							  if (item.plantPermanentTimestamp && !item.remarks) {
							      shouldBlock = true;
							      alert("Plant head taken Permanent Action but RQC head now have to take the action on last Failed item part+supplier");
							      return;
							  }
							  
							  // Case 6: Plant head rejected but RQC head did not take action for send back
							  if (item.plantRejectTimestamp && !item.remarks) {
							      shouldBlock = true;
							      alert("Plant Head has rejected this part. RQC Head must take action for send back before proceeding!");
							      return;
							  }

						/*	if (daysDiff > 15) {
								shouldBlock = true;
								break;
							}*/
						}

						// Check for repeated failures within 15 days with no action
						if (failuresWithoutAction.length >= 2) {
							// Check if at least 2 failures happened within 15 days window
							for (let i = 0; i < failuresWithoutAction.length; i++) {
								for (let j = i + 1; j < failuresWithoutAction.length; j++) {
									let date1 = new Date(failuresWithoutAction[i].datetime);
									let date2 = new Date(failuresWithoutAction[j].datetime);
									let daysDiff = Math.abs(date1 - date2) / (1000 * 60 * 60 * 24);
									if (daysDiff <= 15) {
										repeatedFailure = true;
										break;
									}
								}
								if (repeatedFailure) break;
							}
						}

						/*if (shouldBlock) {
							alert("This part number and supplier cannot be scanned. Action pending over 15 days by RQC Head!!!");
							return;
						}*/

						if (repeatedFailure) {
							alert("This part number with this supplier has failed twice within 15 days and no action has been taken by RQC Head!!!");
							return;
						}

						// Otherwise proceed
						$('#input1').val(barcode).prop('disabled', true);
						$('#partNo').text(partCode);
						$('#supplierdiv').text(supplierName);
						$('#input3').prop('disabled', false).focus();
					},

					error: function(xhr, status, error) {
						alert("Error fetching RQC Results: " + error);
					}
				});

				globalStoredPartNumber = partCode; // storing in global variable so can be used 

			},
			error: function(xhr, status, error) {
				alert("Error checking part number: " + error);
			}
		});

	} else if (focusedInput === 'input3') {

		// Match: first group =	batch code (no spaces), second group = quantity (no spaces, but you can allow decimal/number checks)
		var match = cleanedBarcode.match(/^(\S+)\s+(\S+)$/);
		// First part = only non-space characters (\S+) → Batch Code without spaces.
		// Second part = anything after at least one space (\s+), no spaces inside → quantity, can have decimals

		if (!match) {
			alert('Invalid barcode for MRN No. and Quantity');
			return;
		} // The regex ensures there are at least two parts separated by space(s).

		var batchCode = match[1].trim(); // batch code (no spaces),
		var quantity = match[2].trim(); // quantity (no spaces, but you can allow decimal/number checks)

		if (isNaN(quantity)) {
			alert('Quantity must be a number');
			return;
		}

		$('#input3').val(batchCode);
		var span = $("<span></span>").text(quantity).css({
			color: "black",
			display: "inline-block",
			width: "80%"
		});
		$("#quantity").empty().append(span);

		globalQuantity = quantity; // storing quantity globally to be used in fetchAndResolveSamplePlans() 
		// so to fetch sampling plan based on the Sampling plan master for those rows which will be depending on quantity.

		onPartNumberBarcodeChange();
		$('#input3').prop('disabled', true);
	}
}


$(document).on('keydown', '#input1, #input3', function(e) {
	if (e.key === "Enter") {
		e.preventDefault();
		var barcodeValue = $(this).val();
		handleBarcodeScanning(barcodeValue);
	}
});


function resetQualityReadingDetails() {
	$("#input1").val("").prop('disabled', false);
	$("#input2").val("");
	$("#input3").val("").prop('disabled', true);
	$("#partNo").text("");
	$("#supplierdiv").text("");
	$("#quantity").empty();
}

//--------------------------------


//Should be used when you want to run follow-up logic inside success callback.
/*	function fetchLargestSamplingPlan(partNumber) {  // different from fetchLargestSamplingPlanonly() here async: true by default 
		// + it does not return value
		// this partNumber in argument  is misp number and not the partNumber and not used now( previously used)
		
		
		$.ajax({
			url: "/WebApplication/Controllers/fetchLargestSamplingPlan/" + partNumber,
			type: 'GET',
			headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
			data: { partNumber: partNumber },
			success: function(largestSamplingPlan) {

				// It does not return a value. Instead, it calls generateSSeriesHeaders() inside success.
				generateSSeriesHeaders(largestSamplingPlan);
				
			},
			error: function(xhr, textStatus, errorThrown) {
				console.error("Error fetching largestSamplingPlan:", xhr, textStatus, errorThrown);
				alert("Error fetching largestSamplingPlan");
			}
		});
	}*/

//Should be used when you want to run follow-up logic inside success callback.
var maxsample;
async function fetchLargestSamplingPlan(mispNumber) {  // here async: true by default 
	// + it does not return value
	// this partNumber in argument  is misp number and not the partNumber and not used now( previously used old code exactly above)
	console.log("runs");
	await fetchAndResolveSamplePlans(mispNumber);   // fetchAndResolveSamplePlans() is async
	// await Ensure it's finished
	console.log("resolvedSampleMap after awaiting:", resolvedSampleMap);

	// Find the largest sample count from resolvedSampleMap
	const sampleSizes = Object.values(resolvedSampleMap).map(Number);
	largestSamplingPlan = Math.max(...sampleSizes);
	maxsample=largestSamplingPlan;
	console.log("Largest Sampling Plan:", largestSamplingPlan);

	// Now call your next logic using it
	generateSSeriesHeaders(largestSamplingPlan);

}

async function fetchAndResolveSamplePlans(mispNumber) {
	try {
		const plans = await $.ajax({
			url: "/WebApplication/Controllers/getSamplingPlansByMispNumber", // will fetch all the LatestApprovedQualityMastersByPartNumber
			type: 'GET',
			data: { mispNumber: mispNumber },
			headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },

		});

		console.log("Fetched Plans:", plans);

		if (!globalQuantity || isNaN(globalQuantity)) {
			alert("Invalid quantity value.");
			return;
		}
		const quantity = globalQuantity; // using the quantity value stored globally

		// Call backend to resolve sample size based on quantity
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
			url: `/WebApplication/Controllers/getSamplingPlanSampleCount`,
			type: 'GET',
			data: {
				quantity: quantity
			},
			headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
			success: function(sampleCountSize) {

				console.log("sampleCountSize ", sampleCountSize);

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


function generateSSeriesHeaders(largestSamplingPlan) {
	$("#thead3").empty();


	var list = ["S.No.", "I. ITEM", "CRITERIA", "MIN", "MAX", "METHOD", "TOOL", "S.P", "Mul. Dim. Val."]
	for (var i = 1; i <= largestSamplingPlan; i++) {
		list.push("S" + i);
	}

	var tr = document.createElement("tr");

	for (var j = 0; j < list.length; j++) {

		var th = document.createElement("th");
		th.setAttribute("class", "tableHeading2")
		th.innerText = list[j];
		tr.append(th)
	}

	var th_1 = document.createElement("th");
	th_1.setAttribute("class", "tableHeading2");
	th_1.innerText = "STATUS";
	var th_2 = document.createElement("th");
	th_2.setAttribute("class", "tableHeading2")
	th_2.innerText = "SAVE";

	tr.append(th_1, th_2);

	$("#thead3").append(tr);
}


/*
function generateSSeriesHeaders(largestSamplingPlan) {
	$("#thead3").empty();

	const tr = document.createElement("tr");

	// Freeze left side columns by splitting the table into two sections:
	// One for frozen columns, one for scrollable sample columns
	// Create separate header rows ( freeze + scrollable + freeze right)
	
	// Fixed left headers
	const frozenHeaders = ["S.No.", "I. ITEM", "CRITERIA", "MIN", "MAX", "METHOD", "TOOL", "S.P"];
	frozenHeaders.forEach(header => {
		const th = document.createElement("th");
		th.className = "tableHeading2 frozen-column"; // css styling used for frozen
		th.innerText = header;
		tr.appendChild(th);
	});

	// Scrollable "S" series
	for (let i = 1; i <= largestSamplingPlan; i++) {
		const th = document.createElement("th");
		th.className = "tableHeading2";  // normal scrollable columns
		th.innerText = "S" + i;
		tr.appendChild(th);
	}

	// Fixed right headers
	const rightHeaders = ["STATUS", "SAVE"];
	rightHeaders.forEach(header => {
		const th = document.createElement("th");
		th.className = "tableHeading2 frozen-column-right"; // css styling used if needed
		th.innerText = header;
		tr.appendChild(th);
	});

	$("#thead3").append(tr); // ( freeze + scrollable + freeze right)
}*/
/*  last used
function generateSSeriesHeaders(largestSamplingPlan) {
	$("#thead3").empty();
	const tr = document.createElement("tr");

	// Left frozen headers
	const frozenHeaders = ["S.No.", "I. ITEM", "CRITERIA", "MIN", "MAX", "METHOD", "TOOL", "S.P"];
	let leftOffset = 0;
	const columnWidths = [50, 100, 150, 60, 60, 100, 100, 60]; // Approximate widths of each column

	frozenHeaders.forEach((header, index) => {
		const th = document.createElement("th");
		th.className = "tableHeading2 frozen-column";
		th.innerText = header;
		th.style.left = `${leftOffset}px`;

		leftOffset += columnWidths[index]; // Increment left offset for next sticky column
		tr.appendChild(th);
	});
	
	frozenHeaders.forEach((header, index) => {
		const th = document.createElement("th");
		th.className = "tableHeading2";
		th.innerText = header;
		th.style.position = "sticky";
		th.style.left = `${leftOffset}px`;
		th.style.zIndex = 3;
		//th.style.background = "white";

		leftOffset += columnWidths[index]; // Increment left offset for next sticky column
		tr.appendChild(th);
	});

	// Scrollable S-series
	for (let i = 1; i <= largestSamplingPlan; i++) {
		const th = document.createElement("th");
		th.className = "tableHeading2"; // normal scrollable columns
		th.innerText = "S" + i;
		tr.appendChild(th);
	}

	// Right frozen headers
	const rightHeaders = ["STATUS", "SAVE"];
	rightHeaders.forEach(header => {
		const th = document.createElement("th");
		th.className = "tableHeading2 frozen-column-right";
		th.innerText = header;
		tr.appendChild(th);
	});

	$("#thead3").append(tr);
}
*/
/*
function generateSSeriesHeaders(largestSamplingPlan) {
	$("#thead3").empty();

	const tr = document.createElement("tr");

	// Left fixed headers
	const frozenHeaders = ["S.No.", "I. ITEM", "CRITERIA", "MIN", "MAX", "METHOD", "TOOL", "S.P"];
	frozenHeaders.forEach(header => {
		const th = document.createElement("th");
		th.className = "tableHeading2"; // keep global style
		th.style.position = "sticky";
		th.style.left = "0";
		th.style.background = "white";
		th.style.zIndex = "2";
		th.style.whiteSpace = "nowrap";
		th.innerText = header;
		tr.appendChild(th);
	});

	// Scrollable S-series headers
	for (let i = 1; i <= largestSamplingPlan; i++) {
		const th = document.createElement("th");
		th.className = "tableHeading2";
		th.style.whiteSpace = "nowrap"; // ensure no wrapping
		th.innerText = "S" + i;
		tr.appendChild(th);
	}

	// Right fixed headers
	const rightHeaders = ["STATUS", "SAVE"];
	rightHeaders.forEach(header => {
		const th = document.createElement("th");
		th.className = "tableHeading2";
		th.style.position = "sticky";
		th.style.right = "0";
		th.style.background = "white";
		th.style.zIndex = "2";
		th.style.whiteSpace = "nowrap";
		th.innerText = header;
		tr.appendChild(th);
	});

	$("#thead3").append(tr);
}
*/

function resetTotalResultDiv() {
	var totalResultDiv = $("#resultContainer");
	totalResultDiv.css({ 'background-color': '', 'color': '', 'text-align': '' });
	totalResultDiv.text('');
}

function onPartNumberBarcodeChange() {
	//var partNumber = $('#partNo').text();
	var batchCode = $('#input3').val();
	var partNumber=$('#partNoInput').val();
	//console.log("t aaya ",t);
 
	resetRowStatusList(); // Reset rowStatusList
	checkPartNumberAndBatchCode(partNumber, batchCode);
	resetTotalResultDiv();

}

function resetRowStatusList() {

	rowStatusList = [];

	resetTotalResultDiv();

}

// it only checks for part code and not batch code.
function checkPartNumberAndBatchCode(partNumber, batchCode) {

	// checks that particular part is there in quality master or not
	$('#supplierInput').prop('disabled',true);
		$('#partNoInput').prop('disabled',true);
	
	$.ajax({
		url: "/WebApplication/Controllers/checkPartNumberAndBatchCode",
		type: 'POST',
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		contentType: 'application/json',
		data: JSON.stringify({ partNumber: String(partNumber), batchCode: String(batchCode) }),
		success: function(data) {

			if (data.exists) {

				console.log("data exist");

				loadQualityReadingMasterExistData(partNumber, batchCode);

			} else {
				/*resetRowStatusList();
				
				loadQualityReadingMasterExistData(partNumber, batchCode);
				fetchBomData(partNumber);
				*/

				alert("Part Number Is Not Present");
				var tableBody = $("#tbody3");
				tableBody.empty();
				$("#mispNumberContainer").val("");
				$("#input3").val("");
				$("#revNumberContainer").val("");

				$("#partNumberImage").empty();
				$("#partNumberImage").attr("src", "/images/default3.png")

			}
		},
		error: function(xhr, textStatus, errorThrown) {
			console.error("Error checking part number and batch code:", xhr, textStatus, errorThrown);
			alert("Error checking part number and batch code");
		}
	});
}

function appendImageToDiv10(imagePath) {

	$.ajax({
		url: imagePath,
		type: 'GET',
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function() {

			$("#partNumberImage").attr("src", imagePath)

			/*			oidDivImage.css({
							"overflow": "auto", // Changed to "auto"
							"position": "relative"
						});*/

			var isDragging = false;
			var startDragX, startDragY;
			var initialScrollLeft, initialScrollTop;

			$("#partNumberImage").on("wheel", function(event) {
				event.preventDefault();
				var delta = event.originalEvent.deltaY || event.originalEvent.detail || event.originalEvent.wheelDelta;
				var scaleMultiplier = 0.3;

				var offsetX = event.offsetX / $(this).width();
				var offsetY = event.offsetY / $(this).height();

				var scaleX = delta > 0 ? 1 - scaleMultiplier : 1 + scaleMultiplier;
				var scaleY = scaleX;

				var originX = (offsetX * 100) + "%";
				var originY = (offsetY * 100) + "%";

				$(this).css({
					"transform": "scale(" + scaleX + ", " + scaleY + ")",
					"transform-origin": originX + " " + originY
				});
			}).on("mousedown", function(event) {
				isDragging = true;
				startDragX = event.clientX;
				startDragY = event.clientY;
				initialScrollLeft = $(this).scrollLeft();
				initialScrollTop = $(this).scrollTop();
				$(this).css("cursor", "grabbing");
			});


			$(document).on("mousemove", function(event) {
				if (isDragging) {
					var dragX = event.clientX - startDragX;
					var dragY = event.clientY - startDragY;
					var newScrollLeft = initialScrollLeft - dragX;
					var newScrollTop = initialScrollTop - dragY;
					oidDivImage.scrollLeft(newScrollLeft);
					oidDivImage.scrollTop(newScrollTop);
				}
			}).on("mouseup", function() {
				if (isDragging) {
					isDragging = false;
					$("#partNumberImage").css("cursor", "grab");
				}
			}).on("mouseleave", function() {
				if (isDragging) {
					isDragging = false;
					$("#partNumberImage").css("cursor", "grab");
				}
			});
		},
		error: function(e) {

		}
	});
}


//-------------------------------------

function fetchBomData(partNumber) { // this now fetches Part description from material master.

	$.ajax({
		url: "/WebApplication/Controllers/checkQualityPartNumberinbom",
		type: 'POST',
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		contentType: 'application/json',
		data: JSON.stringify({ partNumber: partNumber }),
		success: function(data) {

			console.log("data: ", data);


			if ($("#input3").is(':empty')) {
				if (data && data.length > 0) {


					var span = $("<span></span>").text(data).css({
						fontSize: "11px",
						color: "black",
						marginRight: "width:50px;",

						width: "100%",
						height: "70%",
						overflow: "scroll"
					});

					$("#partNameContainer").empty().append(span);
				} else {

				}
			} else {

			}
		},
		error: function(xhr, textStatus, errorThrown) {
			console.error("Error fetching material description data:", xhr, textStatus, errorThrown);
			alert("Error fetching material description data");
		}
	});
}



//------------------------------------

function appendQualityDataToTable(data) { //called in loadQualityReadingMasterExistData1() which passes whole data of rows which are remaining.
	
	var tableBody = $("#tbody3");
	tableBody.empty();
	//largestSamplingPlan = largestSamplingPlan;// = fetchLargestSamplingPlanonly(splan); 
	// where splan  is declared globally and set in loadQualityReadingMasterExistData1()  splan = nonExistingData[0].mispNumber; 

	// Helper function to extract numeric value from criteria column
	function extractNumeric(str) { // utility to pull out the first number from a string.
		const match = str.match(/[-+]?[0-9]*\.?[0-9]+/);
		return match ? parseFloat(match[0]) : 0;
	}
	let samplingPlanValue = 0;
	console.log(data);
	$.each(data, function(index, row) {
		//Check if the row already exists for that quality id
		var selectedRow = tableBody.find('tr[data-qualityid="' + row.qualityId + '"]');
		
			// --- 🔹 Decide minCriteria / maxCriteria based on inspectionMethod ---
			 let minCriteria=null, maxCriteria=null, baseVal;
			 let criteria = row.criteria || "";
			 var inspectionMethod = (row.inspectionMethod || "").trim();
			 if( (inspectionMethod.toLowerCase() === 'measure') ||  (inspectionMethod.toLowerCase() === 'manual') ){
				// Directly use saved numeric values (already computed)
				minCriteria = parseFloat(row.min || 0);
				maxCriteria = parseFloat(row.max || 0);
				
				if (criteria.toLowerCase().includes("min")) {
					maxCriteria = "-";
				}
			 } else if ( inspectionMethod.toLowerCase() === 'visual' || inspectionMethod.toLowerCase() === 'calendar'  || inspectionMethod.toLowerCase() === 'cavity') {
			     maxCriteria = null;
			     minCriteria = null;
			 }
			
		if (selectedRow.length === 0) { // If row doesn't exist, create a new row for that qualityId
			
			// Decide what to display in the "samplingPlain" column
			samplingPlanValue = (row.samplingPlan && row.samplingPlan.toLowerCase() === 'sp')
				? sampleCountSizeForSP : row.samplingPlan;

			// A new <tr> is built from scratch, including all visible columns (criteria, inspectionItem, etc.) 
			// and hidden columns like min, max, and qualityId.
			var newRow = '<tr class="tableDataRows" data-qualityid="' + row.qualityId + '">' +
				'<td data-column="columnId">' + (1 + parseInt(index)) + '</td>' +
				'<td data-column="inspectionItem">' + row.inspectionItem + '</td>' +
				'<td data-column="criteria">' + row.criteria + '</td>' +
				'<td data-column="minCriteria">' + ((minCriteria !== null && minCriteria !== undefined) ? (isNaN(minCriteria) ? '' : minCriteria.toFixed(3)) : '') + '</td>' +
				'<td data-column="maxCriteria">' + ((maxCriteria !== null && maxCriteria !== undefined) ? (isNaN(maxCriteria) ? '' : maxCriteria.toFixed(3)) : '') + '</td>' +
				'<td data-column="min" style="display:none;">' + row.min + '</td>' +
				'<td data-column="max" style="display:none;">' + row.max + '</td>' +
				'<td data-column="inspectionMethod">' + row.inspectionMethod + '</td>' +
				'<td data-column="inspectionTool">' + row.instrument.instrumentName + '</td>' +

				'<td data-column="samplingPlain">' + samplingPlanValue + '</td>' +
				'<td data-column="multiDimensionValue">' + row.multiDimensionValue + '</td>' +

				'<td data-column="qualityId" style="display:none;">' + row.qualityId + '</td>';

			// largestSamplingPlan is global variable
			for (var i = 1; i <= largestSamplingPlan; i++) {
				newRow += '<td data-column="s' + i + '"></td>';
			}

			newRow += '<td data-column="status" style="background-color:yellow; color:yellow;"></td>';
			newRow += '</tr>';
			tableBody.append(newRow);
		}

		// Update the row
		selectedRow = tableBody.find('tr[data-qualityid="' + row.qualityId + '"]');

		// putting the values so these are used in appendQualityReadingDataToTable(data) function and 
		// '#confirmbutton2' and 'dblclick', '#tbody3 tr' and '#confirmbutton' and '#confirmbutton3'
		selectedRow.find('td[data-column="columnId"]').text(1 + parseInt(index));
		selectedRow.find('td[data-column="inspectionItem"]').text(row.inspectionItem);
		selectedRow.find('td[data-column="criteria"]').text(row.criteria);
		selectedRow.find('td[data-column="minCriteria"]').text((minCriteria !== null && minCriteria !== undefined) ? (isNaN(minCriteria) ? '' : minCriteria.toFixed(3)) : '');
		selectedRow.find('td[data-column="maxCriteria"]').text((maxCriteria !== null && maxCriteria !== undefined) ? (isNaN(maxCriteria) ? '' : maxCriteria.toFixed(3)) : '');
		selectedRow.find('td[data-column="min"]').text(row.min);
		selectedRow.find('td[data-column="max"]').text(row.max);
		selectedRow.find('td[data-column="inspectionMethod"]').text(row.inspectionMethod);
		selectedRow.find('td[data-column="inspectionTool"]').text(row.instrument.instrumentName);
		// this resolved samplingPlain used in the appendQualityReadingDataToTable(data) function	
		selectedRow.find('td[data-column="samplingPlain"]').text(samplingPlanValue);
		selectedRow.find('td[data-column="multiDimensionValue"]').text(row.multiDimensionValue);
		selectedRow.find('td[data-column="qualityId"]').text(row.qualityId);

		selectedRow.find('td[data-column="status"]').text(row.status);

		for (var i = 1; i <= largestSamplingPlan; i++) {
			selectedRow.find('td[data-column="s' + i + '"]').text(row['s' + i]);
		}

		// Update header section with revision and MISP number
		$("#revNumberContainer").empty().append($("<span></span>").text(data[0].revNumber).css({
			color: "black", display: "inline-block", width: "80%"
		}));

		// Update header section with revision and MISP number
		$("#modelName").empty().append($("<span></span>").text(data[0].model).css({
			color: "black", display: "inline-block", width: "80%"
		}));
		
		$("#mispNumberContainer").empty().append($("<span></span>").text(data[0].mispNumber).css({
			color: "black", display: "inline-block", width: "80%"
		}));
 
		// Highlight result area from background.
		$("#resultid").css("background-color", "yellow");
	});

	// this now fetches Part description from material master.
	//fetchBomData($("#partNo").text()); // updating part Description in frontend. i.e. material_description
	fetchBomData($("#partNoInput").val());
}



/*
function loadQualityReadingMasterExistData1(partNumber, batchCode) {
	console.log("loadQualityReadingMasterExistData1 called top");
	// url will fetch list of all the pre-filled, presaved readings. so it helps when page refreshed or flipped.
	var url = "/WebApplication/Controllers/getData?partNumber=" + encodeURIComponent(partNumber) + "&batchCode=" + encodeURIComponent(batchCode);
	$.ajax({
		url: url,
		type: 'GET',
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success:  async function(existingData) {  // <-- make this async so we can await
	console.log("loadQualityReadingMasterExistData1 called after url");
			// this function will return all the rows for that part number based on the latest revNum and whose inspectiondate is passed.(can be used now)
			// where rows have quality ids list and other data.
			fetchQualityMasterData(partNumber, async function(masterData) { // fetch above described data from quality master.
				// <-- mark this async too
				
				 // url  getData?  above fetch list of all the presaved readings for that partNumber and batchcode
// so existingData returned from backend have all those list which have data.qualityId required for that part from quality master table. 
// so now below code will fetch for list of nonExistingData i.e list of qualityId not yet saved in quality master table for that part and batch number.
				var nonExistingData = masterData.filter(function(data) {
					return !existingData.some(function(existingItem) {
						return existingItem.quality.qualityId === data.qualityId;
					});
				});
				
				
				if (nonExistingData.length === 0) {
					alert("All readings have been taken. No readings left.");
				} else {
					console.log(nonExistingData[0].mispNumber);
					
					await  fetchLargestSamplingPlan(nonExistingData[0].mispNumber); // ✅ Wait until it's done
					splan = nonExistingData[0].mispNumber;
					appendQualityDataToTable(nonExistingData);
				}
			});
		},
		error: function(xhr, status, error) {
			console.error(xhr.responseText);
			alert("Error: Unable to fetch data");
		}
	});
}
*/
// older one above
async function loadQualityReadingMasterExistData1(partNumber, batchCode) {
	console.log("loadQualityReadingMasterExistData1 called top");

	// url will fetch list of all the pre-filled, presaved readings. so it helps when page refreshed or flipped.
	const url = "/WebApplication/Controllers/getData?partNumber=" + encodeURIComponent(partNumber) + "&batchCode=" + encodeURIComponent(batchCode);
	// will return any saved data from quality reading
	try {
		const existingData = await $.ajax({
			url: url,
			type: 'GET',
			headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
		});

		console.log("loadQualityReadingMasterExistData1 called after url");

		// this function will return all the rows for that part number based on the latest revNum and whose inspectiondate is passed.(can be used now)
		// where rows have quality ids list and other data from quality master( not quality reading)
		const masterData = await fetchQualityMasterData(partNumber); // NOW this is awaited! 

		// url  getData?  above fetch list of all the presaved readings for that partNumber and batchcode
		// so existingData returned from backend have all those list which have data.qualityId required for that part from quality master table. 
		// so now below code will fetch for list of nonExistingData i.e list of qualityId not yet saved in quality master table for that part and batch number.
		const nonExistingData = masterData.filter(data =>
			!existingData.some(existingItem =>
				existingItem.quality.qualityId === data.qualityId
			)
		);

		if (nonExistingData.length === 0) {
			alert("All readings have been taken. No readings left.");
		} else {
			console.log(nonExistingData[0].mispNumber);

			// ✅ Step 1: Collect instruments whose calibration is due
			const today = await getServerCurrentDate(); // get server current date.
			let dueInstruments = [];
			let rowNo = 0;
			nonExistingData.forEach(item => {
				rowNo++; // increment after each iteration
				if (item.instrument && item.instrument.calibrationDue) {// will run if date is present there.
					const dueDate = new Date(item.instrument.calibrationDue);
					if (dueDate < today) {
						dueInstruments.push({
							instrumentName: item.instrument.instrumentName,
							controlNo: item.instrument.instrumentControlNo,
							calibrationDue: item.instrument.calibrationDue,
							rowNo: rowNo,
						});
					}
				}
			});

			console.log("dueInstruments", dueInstruments);
			// ✅ Step 2: If any are due, show alert/modal and stop further execution
			if (dueInstruments.length > 0) {
				// Restore back to original scanned barcode format (batchCode + quantity)
				var combined = $("#input3").val() + " " + globalQuantity;

				$("#input3").val(combined).prop("disabled", false);  // restore full text + re-enable input
				$("#quantity").empty(); // clear span area

				// reset globalQuantity too if needed
				globalQuantity = null;
				// our qr code again restored

				let msg = "⚠️ Calibration Due for Instruments:\n\n";
				dueInstruments.forEach(inst => {
					msg += `Row ${inst.rowNo} - ${inst.instrumentName} (Ctrl No: ${inst.controlNo}) → Due on: ${inst.calibrationDue}\n`;
				});

				alert(msg);
				// Or show modal here instead of alert
				return; // ⛔ Stop proceeding further
			}

			// ✅ Step 3: Continue only if no calibration is due
			await fetchLargestSamplingPlan(nonExistingData[0].mispNumber); // ✅ Correct now
			splan = nonExistingData[0].mispNumber;

			appendQualityDataToTable(nonExistingData);
			console.log(nonExistingData);
		}

	} catch (error) {
		console.error("Error in loadQualityReadingMasterExistData1:", error);
		alert("Error: Unable to fetch data");
	}
}


// Fetch server date before running your calibration check
async function getServerCurrentDate() { // checking date from CurrentDateTimeController

	const response = await fetch("/WebApplication/Controllers/server-date", {
		method: "GET",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
	});

	if (!response.ok) {
		throw new Error("Failed to fetch server date: " + response.status);
	}

	const serverDateStr = await response.text();  // e.g., "2025-08-22"
	// console.log("serverDateStr", serverDateStr);
	return new Date(serverDateStr); // JS Date object
}

/*
function fetchQualityMasterData(partNumber, callback) { // uses callback.
	var url = "/WebApplication/Controllers/getQualityMasterData?partNumber=" + encodeURIComponent(partNumber); $.ajax({
		url: url,
		type: 'GET',
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {

			var imagePartNumber = response[0].partNumber +"_"+ response[0].revNumber;
			callback(response);

			//var imagePath = `/WebApplication/uploadImages/${imagePartNumber}.png`;
			var imagePath = `/WebApplication/Controllers/rqcuploadImages/${imagePartNumber}.png`; // written  in RQCPMaserAjaxController
			
			appendImageToDiv10(imagePath);

		},
		error: function(xhr, status, error) {
			console.error(xhr.responseText);
			alert("Error: Unable to fetch data");
		}
	});
}*/
// olde version above
function fetchQualityMasterData(partNumber) { // fetch left side part dta from backend which later in appendQualityDataToTable()
	// fetch all the rows from quality master like these number of rows are for this part number,
	// which is approved and latest implement date pass so can be used.
	const url = "/WebApplication/Controllers/getQualityMasterData?partNumber=" + encodeURIComponent(partNumber);

	return new Promise((resolve, reject) => {
		$.ajax({
			url: url,
			type: 'GET',
			headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
			success: function(response) {
				var imagePartNumber = response[0].partNumber + "_" + response[0].revNumber;
				var imagePath = `/WebApplication/Controllers/rqcuploadImages/${imagePartNumber}.png`;
				appendImageToDiv10(imagePath); // keep this side-effect
				resolve(response); // <-- resolve the Promise
			},
			error: function(xhr, status, error) {
				console.error(xhr.responseText);
				alert("Error: Unable to fetch data");
				reject(error);
			}
		});
	});
}



function fetchQualityDatalength(partNumber, callback) { // have same backend as fetchQualityMasterData, just the success part does different

	$.ajax({
		url: "/WebApplication/Controllers/checkPartNumber",
		type: 'POST',
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		contentType: 'application/json',
		data: JSON.stringify({ partNumber: partNumber }),
		success: function(data) {
			console.log("data: ", data);

			var fetchQualityDataResponse = data.length;

			console.log("fetchQualityDataResponse: ", fetchQualityDataResponse);

			callback(fetchQualityDataResponse);
		},
		error: function(xhr, textStatus, errorThrown) {
			console.error("Error fetching quality data:", xhr, textStatus, errorThrown);
			alert("Error fetching quality data");
		}
	});
}

// called in checkPartNumberAndBatchCode() after when it checks for the partNumber exists in quality Master so further entry can be made.
function loadQualityReadingMasterExistData(partNumber, batchCode) {

	console.log(" funtion at last one loadQualityReadingMasterExistData()");
	var url = "/WebApplication/Controllers/getData?partNumber=" + encodeURIComponent(partNumber) + "&batchCode=" + encodeURIComponent(batchCode);
	$.ajax({
		url: url,
		type: 'GET',
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			console.log(response);
			fetchQualityDatalength(partNumber, function(result33) { // have same backend as fetchQualityMasterData 
				console.log(response);
				if (response.length < result33) {

					// if page refreshed and whole data is not filled some rows remaining, 
					// so load the remaining for those for which save Button not clicked.
					loadQualityReadingMasterExistData1(partNumber, batchCode);

				} else if (response.length == 0 && result33 == 0) {
					// this checks for means any approval will not be done for that part, as there in no parameters fetched in response.
					alert("Data Parameter Is Not Present Or Its Mapped RQC-P Parameter is not Approved yet Or Its Implement-Date Is Not Comming yet");
				} else if (response.length == result33) {
					// all the related row data is filled by user.
					fetchStatusFromDatabase();
					var tableBody = $("#tbody3");
					tableBody.empty();
				}

				else {
					fetchStatusFromDatabase();
					var tableBody = $("#tbody3");
					tableBody.empty();
				}
			});
		},
		error: function(xhr, status, error) {
			console.error(xhr.responseText);
			alert("Error: Unable to fetch data");
		}
	});
}

var inputOpen = false;

/*$(document).on('dblclick', '#tbody3 tr', function() {
	if (inputOpen) return;

	var dateVal = $('#mrnDate').val();

	    // Check if date is empty
	    if (!dateVal) {
	        alert("Please select a date before submitting.");
	        return; // stop further execution
	    } 
		
	selectedRow = $(this);
	console.log(selectedRow);
	var inspectionMethod = selectedRow.find("td[data-column='inspectionMethod']").text().trim();
	var status = selectedRow.find("td[data-column='status']").text().trim();
	var partNumber = $('#partNo').text();
	var qualityid = selectedRow.find("td[data-column='qualityId']").text().trim();
	var Plan = selectedRow.find("td[data-column='samplingPlain']").text().trim();
	// var multiDimensionValue = selectedRow.find("td[data-column='multiDimensionValue']").text().trim();
	var max = selectedRow.find("td[data-column='max']").text().trim();
	var min = selectedRow.find("td[data-column='min']").text().trim();
	console.log(qualityid);
	console.log(partNumber);
	console.log(Plan);
	console.log(max);
	console.log(min);
	console.log(inspectionMethod);
	selectedRow.find("th#tableheading2").remove();
	selectedRow.find("td.savebutton").remove();

	// check it does not already have data of pass or fail.
	if (!selectedRow.find("button.savebutton").length && status.toLowerCase() !== 'pass' && status.toLowerCase() !== 'fail') {
		var th = document.createElement("th");
		th.innerText = "Save";
		th.setAttribute("id", "tableheading2");
		th.setAttribute("style", "color: black; background-color: white;");
		selectedRow.find("th[data-column='status']").after(th);
		var td = document.createElement("td");
		var button = document.createElement("button");
		button.innerText = "Save";
		button.setAttribute("class", "savebutton");

		// below we also give id to save button so based on that related #confirm is checked
		if (inspectionMethod.toLowerCase() === 'visual') {
			if (!selectedRow.find("select").length) {
				createAndAppendSelectElement(selectedRow, Plan);
			}
			button.setAttribute("id", "confirmbutton");
			console.log(inspectionMethod);
		} else if (inspectionMethod.toLowerCase() === 'measure') {
			if (!selectedRow.find("input").length) {
				createAndAppendInputElement(selectedRow, Plan);
			}
			button.setAttribute("id", "confirmbutton2");
			console.log(inspectionMethod);
		} else if (inspectionMethod.toLowerCase() === 'calendar') {
			if (!selectedRow.find("input").length) {
				createAndAppendInputElementForCalander(selectedRow, Plan);
			}
			button.setAttribute("id", "confirmbutton4");
			console.log(inspectionMethod);
		} else if (inspectionMethod.toLowerCase() === 'cavity') {
			if (!selectedRow.find("input").length) {
				createAndAppendInputElementForCavity(selectedRow, Plan);
			}
			button.setAttribute("id", "confirmbutton5");
			console.log(inspectionMethod);
		} else if (inspectionMethod.toLowerCase() === 'manual') {
			if (!selectedRow.find("select").length) {
				createAndAppendSelectElement(selectedRow, Plan);
			}
			button.setAttribute("id", "confirmbutton");
			console.log(inspectionMethod);
		} else if (inspectionMethod.toLowerCase() === 'counting') {
			if (!selectedRow.find("select").length) {
				createAndAppendInputElement(selectedRow, Plan);
			}
			button.setAttribute("id", "confirmbutton3");
			console.log(inspectionMethod);
		} else {
			if (!selectedRow.find("input").length) {
				createAndAppendInputElement(selectedRow, Plan);
			}
			alert("No procedure code defined for this Inspection Method");
			button.setAttribute("id", " ");
			console.log(inspectionMethod);
		}
		button.setAttribute("style", "color: white; background-color: black;");
		td.appendChild(button);
		selectedRow.find("td[data-column='status']").after(td);

		inputOpen = true;
	}
});*/
var finalSubmitted = false;
// inside the dblclick handler, as the first lines:


$(document).on('dblclick', '#tbody3 tr', function () {
	if (window.finalSubmitted) {
	    alert("Final submission already done — editing disabled.");
	    return;
	}
    if (window.inputOpen) return;

    var dateVal = $('#mrnDate').val();
    if (!dateVal) {
        alert("Please select a date before submitting.");
        return;
    }

    selectedRow = $(this);
    var inspectionMethod = (selectedRow.find("td[data-column='inspectionMethod']").text() || '').trim();
    var status = (selectedRow.find("td[data-column='status']").text() || '').trim();
    // resolve sampling plan robustly (handles samplingPlain or samplingPlan)
    var Plan = parseInt(
        (selectedRow.find('td[data-column="samplingPlain"]').text().trim()) ||
        (selectedRow.find('td[data-column="samplingPlan"]').text().trim()) ||
        '0'
    ) || 0;

    // remove any existing save/header remnants
    selectedRow.find("th#tableheading2").remove();
    selectedRow.find("td.__action_edit, td.savebutton").remove();

    // only open inputs if row status not PASS/FAIL
    if (!selectedRow.find("button.savebutton").length && status.toLowerCase() !== 'pass' && status.toLowerCase() !== 'fail') {
        // add Save header cell (keeps your table header alignment)
        var th = $("<th>Save</th>").attr('id', 'tableheading2').css({ color: 'black', backgroundColor: 'white' });
        selectedRow.find("th[data-column='status']").after(th);

        var td = $("<td></td>");
        var button = $("<button>Save</button>").addClass("savebutton").css({ color: 'white', backgroundColor: 'black' });

        // create inputs based on inspectionMethod (avoid re-creating if already created)
        var method = (inspectionMethod || '').toLowerCase();
        if (method === 'visual' || method === 'manual') {
            // create selects
            createAndAppendSelectElement(selectedRow, Plan);
            button.attr('id', 'confirmbutton');
        } else if (method === 'measure') {
            createAndAppendInputElement(selectedRow, Plan);
            button.attr('id', 'confirmbutton2');
        } else if (method === 'calendar') {
            createAndAppendInputElementForCalander(selectedRow, Plan);
            button.attr('id', 'confirmbutton4');
        } else if (method === 'cavity') {
            createAndAppendInputElementForCavity(selectedRow, Plan);
            button.attr('id', 'confirmbutton5');
        } else if (method === 'counting') {
            createAndAppendInputElement(selectedRow, Plan);
            button.attr('id', 'confirmbutton3');
        } else {
            // fallback numeric inputs
            createAndAppendInputElement(selectedRow, Plan);
            alert("No procedure code defined for this Inspection Method (using numeric inputs fallback).");
            button.attr('id', 'confirmbutton2');
        }

        td.append(button);
        selectedRow.find("td[data-column='status']").after(td);

        window.inputOpen = true;
    }
});

function closeInput() {
	inputOpen = false;

}



function createAndAppendInputElementForCalander(selectedRow, samplingPlan) {
	var multiDimCount = parseInt(selectedRow.find("td[data-column='multiDimensionValue']").text().trim()) || 1;

	for (var i = 1; i <= samplingPlan; i++) {
		var tdElement = selectedRow.find("td[data-column='s" + i + "']");
		tdElement.empty();

		for (var j = 1; j <= multiDimCount; j++) {
			var input = document.createElement("input");
			input.setAttribute("type", "month");
			input.setAttribute("name", "s" + i + "_d" + j);
			// input.setAttribute("style", "width:65px; height:20px;margin:2px;min-width:120px;");
			input.setAttribute("style", "height:20px; margin:2px; min-width:50px; width:fit-content;");

			// ✅ Optional: live validation (red border if empty on blur)
			input.addEventListener("blur", function() {
				if (this.value === "") {
					this.style.border = "2px solid red";
				} else {
					this.style.border = "2px solid green";
				}
			});

			tdElement.append(input);
		}
	}

	// ✅ Attach Enter key check
	selectedRow.find("input[type='month']").keydown(function(event) {
		if (event.key === 'Enter') {
			var allFilled = true;
			selectedRow.find("input[type='month']").each(function() {
				if ($(this).val().trim() === '') {
					allFilled = false;
					return false;
				}
			});

			if (allFilled) {
				$('#confirmbutton4').click();
			}
		}
	});
}



function createAndAppendInputElementForCavity(selectedRow, samplingPlan) {
    var multiDimCount = parseInt(selectedRow.find("td[data-column='multiDimensionValue']").text().trim()) || 1;

    for (var i = 1; i <= samplingPlan; i++) {
        var tdElement = selectedRow.find("td[data-column='s" + i + "']");
        tdElement.empty();

        for (var j = 1; j <= multiDimCount; j++) {
            var input = document.createElement("input");
            input.setAttribute("type", "text");  // ✅ free text/number input
            input.setAttribute("name", "s" + i + "_d" + j);
            input.setAttribute("placeholder", "Cavity " + j); // optional
            // input.setAttribute("style", "height:20px; margin:2px; min-width:50px; width:fit-content;");
			input.setAttribute("style", "width: 50px; height:25px; margin: 2px;");
			
            // ✅ Validation: red if empty on blur, green if filled
            input.addEventListener("blur", function() {
                if (this.value.trim() === "") {
                    this.style.border = "2px solid red";
                } else {
                    this.style.border = "2px solid green";
                }
            });
			

			// Auto expand width on input so whole values visible
			input.addEventListener("input", function() {
				this.style.width = Math.max(50, this.value.length * 6) + "px";
			});

            tdElement.append(input);
        }
    }

    // ✅ Attach Enter key check
    selectedRow.find("input[type='text']").keydown(function(event) {
        if (event.key === 'Enter') {
            var allFilled = true;
            selectedRow.find("input[type='text']").each(function() {
                if ($(this).val().trim() === '') {
                    allFilled = false;
                    return false;
                }
            });

            if (allFilled) {
                $('#confirmbutton5').click();
            }
        }
    });
}


// for visual and manual OK and NG
function createAndAppendSelectElement(selectedRow, samplingPlan) {

	var multiDimCount = parseInt(selectedRow.find("td[data-column='multiDimensionValue']").text().trim()) || 1;

	for (var i = 1; i <= samplingPlan; i++) {
		var tdElement = selectedRow.find("td[data-column='s" + i + "']");
		tdElement.empty();

		for (var j = 1; j <= multiDimCount; j++) {
			var select = document.createElement("select");
			select.setAttribute("name", "s" + i + "_d" + j);
			// select.setAttribute("name", "s" + i);
			// select.setAttribute("id", "sel" + i);
			select.setAttribute("style", "width:100%;height:20px; margin:2px; min-width:35px");

			var optionDefault = document.createElement("option");
			optionDefault.value = "";
			optionDefault.text = "";
			select.appendChild(optionDefault);

			var optionOk = document.createElement("option");
			optionOk.value = "OK";
			optionOk.text = "OK";
			select.appendChild(optionOk);

			var optionNg = document.createElement("option");
			optionNg.value = "NG";
			optionNg.text = "NG";
			select.appendChild(optionNg);

			// ✅ live validation
			select.addEventListener("change", function() {
				if (this.value === "NG") {
					this.style.border = "2px solid red";
					console.log("true red");
				} else if (this.value === "OK") {
					this.style.border = "2px solid green";

				} else {
					this.style.border = "1px solid #ccc"; // reset for empty

				}
			});


			tdElement.append(select);
		}
	}

	// ✅ Attach event listener AFTER all selects are appended
	selectedRow.find("select").keydown(function(event) { 	// selectedRow.find("select") returns all <select> elements inside that row — at once.
		// only need to attach the event once to all of them using jQuery.

		if (event.key === 'Enter') {
			var allSelectFilled = true;
			selectedRow.find("select").each(function() {
				if ($(this).val().trim() === '') {
					allSelectFilled = false;
					return false;
				}
			});

			if (allSelectFilled) {
				$('#confirmbutton').click();
			}
		}
	});
}

function createAndAppendInputElement(selectedRow, samplingPlan) {
	console.log("create meaure input");
    // robustly get multi-dimension count
    var multiDimCount = parseInt(
        (selectedRow.find("td[data-column='multiDimensionValue']").text().trim()) ||
        (selectedRow.find("td[data-column='multiDimension']").text().trim()) ||
        '1'
    ) || 1;

    // try to determine samplingPlan fallback from DOM cells if the passed value is falsy
    samplingPlan = parseInt(samplingPlan) || parseInt(selectedRow.find('td[data-column="samplingPlain"]').text().trim()) || parseInt(selectedRow.find('td[data-column="samplingPlan"]').text().trim()) || 1;

    // read inspection data for runtime validation (criteria/min/max)
    var inspectionMethod = (selectedRow.find("td[data-column='inspectionMethod']").text() || '').trim();
    var criteriaText = (selectedRow.find("td[data-column='criteria']").text() || '').trim();
    var criteria = parseFloat((criteriaText.match(/\d+(\.\d+)?/) || [0])[0]) || 0;
/*    var minRaw = selectedRow.find("td[data-column='min']").text() || '';
    var maxRaw = selectedRow.find("td[data-column='max']").text() || '';
    var min = cleanNumber(minRaw);
    var max = cleanNumber(maxRaw); 
    var minimum = Math.abs(parseFloat((criteria - min).toFixed(3)));
    var maximum = Math.abs(parseFloat((criteria + max).toFixed(3)));*/
	
	// --- Get min and max directly from precomputed table columns ---
	const minRaw = selectedRow.find("td[data-column='minCriteria']").text() || selectedRow.find("td[data-column='min']").text() || "";
	const maxRaw = selectedRow.find("td[data-column='maxCriteria']").text() || selectedRow.find("td[data-column='max']").text() || "";

	const min = cleanNumber(minRaw);
	const max = cleanNumber(maxRaw);


    // generate inputs: s1..sN tds must exist in row (created earlier in master table)
    for (var i = 1; i <= samplingPlan; i++) {
        var tdElement = selectedRow.find("td[data-column='s" + i + "']");
        // ensure existing td (if table was built differently, create it)
        if (!tdElement.length) {
            // append at end if missing
            tdElement = $("<td></td>").attr("data-column", "s" + i).css({ padding: "2px", verticalAlign: "middle" });
            // put before status cell
            selectedRow.find("td[data-column='status']").before(tdElement);
        } else {
            tdElement.empty(); // clear content so we add inputs
        }

        for (var j = 1; j <= multiDimCount; j++) {
            var input = document.createElement("input");
            input.setAttribute("type", "number");
            input.setAttribute("style", "width: 65px; height:25px; margin: 2px;");
            input.setAttribute("name", "s" + i + "_d" + j);
            input.setAttribute("placeholder", "d" + j);

            // live validation handler
            input.addEventListener("input", function () {
                var v = cleanNumber(this.value);
				console.log("v aaya",v);
                this.style.border = "2px solid #ccc";

				
				if (inspectionMethod.toLowerCase() === "measure") {
				    if (criteriaText.toLowerCase().includes("min")) {
						if (v < min) this.style.border = "2px solid red";
						else this.style.border = "2px solid green";
				    } else if (criteriaText.toLowerCase().includes("max")) {
						if (v > max) this.style.border = "2px solid red";
						else this.style.border = "2px solid green";
				    } else if (criteriaText.includes("~")) {
						if (v < min || v > max) this.style.border = "2px solid red";
						else this.style.border = "2px solid green";
				    } else {
						if (v < min || v > max) this.style.border = "2px solid red";
						else this.style.border = "2px solid green";
				    }
				}

                if (inspectionMethod.toLowerCase() === 'counting') {
                    if (v > max || v < min) this.style.border = "2px solid red";
                    else this.style.border = "2px solid green";
                }

                // auto expand width
                this.style.width = Math.max(65, this.value.length * 8) + "px";
            });

            // navigation + enter handling
            input.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    // focus next numeric input in the next sample td if exists
                    var nextInput = $(this).closest('td').nextAll('td').first().find('input[type="number"]').first();
                    if (nextInput.length) {
                        nextInput.focus();
                    } else {
                        // optionally trigger save if all filled
                    }
                }
            });

            tdElement.append(input);
        }
    }

    // focus first input
    selectedRow.find("input[type='number']").first().focus();
}

/*function createAndAppendInputElement(selectedRow, samplingPlan) {

	var multiDimCount = parseInt(selectedRow.find("td[data-column='multiDimensionValue']").text().trim()) || 1;

	var inspectionMethod = selectedRow.find("td[data-column='inspectionMethod']").text().trim();
	// extract min/max/criteria values from the row
	var criteriaText = selectedRow.find("td[data-column='criteria']").text().trim();
	var criteria = parseFloat(criteriaText.match(/\d+(\.\d+)?/)[0]);

	var minRaw = selectedRow.find("td[data-column='min']").text();
	var maxRaw = selectedRow.find("td[data-column='max']").text();
	var min = cleanNumber(minRaw);
	var max = cleanNumber(maxRaw);

	var minimum = Math.abs(parseFloat((criteria - min).toFixed(3)));
	var maximum = Math.abs(parseFloat((criteria + max).toFixed(3)));


	for (var i = 1; i <= samplingPlan; i++) {
		var tdElement = selectedRow.find("td[data-column='s" + i + "']");
		tdElement.empty();  // empty that td 

		// take that td and appen multiple inputs based on the multiDimensionValue count

		for (var j = 1; j <= multiDimCount; j++) {
			var input = document.createElement("input");
			input.setAttribute("type", "number");
			input.setAttribute("style", "width: 65px; height:25px; margin: 2px;");
			input.setAttribute("name", "s" + i + "_d" + j);
			input.setAttribute("placeholder", "d" + j);


			// ✅ live validation on input for "min" or "max" written or for range values(~)
			input.addEventListener("input", function() {
				var value = cleanNumber(this.value);

				// reset styles
				this.style.border = "2px solid #ccc";

				if (inspectionMethod.toLowerCase() === 'measure') { // for measure method case i.e. confirmbutton2 case
					if (criteriaText.toLowerCase().includes("min")) {// directly uses min and max and not minimum and maximum(not using criteria)
						if (value < min) this.style.border = "2px solid red";
						else this.style.border = "2px solid green";
					} else if (criteriaText.toLowerCase().includes("max")) {
						if (value > max) this.style.border = "2px solid red";
						else this.style.border = "2px solid green";
					} else if (criteriaText.toLowerCase().includes("~")) {
						// directly uses min and max and not minimum and maximum(not using criteria)
						if (value < min || value > max) {
							this.style.border = "2px solid red";
						} else {
							this.style.border = "2px solid green";
						}
					} else { // will be using the criteria for + tolerance or - tolerance.
						if (value < minimum || value > maximum) {
							this.style.border = "2px solid red";
						} else {
							this.style.border = "2px solid green";
						}
					}
				}

				if (inspectionMethod.toLowerCase() === 'counting') { // for counting method case i.e. confirmbutton3 case
					if (value > max) {
						this.style.border = "2px solid red";
					} else if (value < min) {
						this.style.border = "2px solid red";
					} else {
						this.style.border = "2px solid green";
					}

				}

			});

			// Auto expand width on input so whole values visible
			input.addEventListener("input", function() {
				this.style.width = Math.max(65, this.value.length * 8) + "px";
			});

			tdElement.append(input);


			// adding input listener inside loops for each input
			input.addEventListener('keydown', function(event) {
				if (event.key === 'Enter') {
					var nextInput = $(this).closest('td').next('td').find('input[type="number"]').first();
					if (nextInput.length) {
						nextInput.focus();
					} else {
						var allInputsFilled = true;
						selectedRow.find("input[type='number']").each(function() {
							if ($(this).val().trim() === '') {
								allInputsFilled = false;
								return false;
							}
						});

						if (allInputsFilled) {
							$('#confirmbutton2').click();
						}
					}
				}
			});
		}
	}
	selectedRow.find("input[type='number']:first").focus();
}
*/

/*
function createAndAppendInputElement(selectedRow, samplingPlan) {

	for (var i = 1; i <= samplingPlan; i++) {
		var tdElement = selectedRow.find("td[data-column='s" + i + "']");
		tdElement.empty();

		var input = document.createElement("input");
		input.setAttribute("type", "number");
		input.setAttribute("style", "width:100%;height:25px");
		input.setAttribute("name", "s" + i);
		input.setAttribute("id", "inp" + i);
		input.setAttribute("placeholder", "S" + i);

		var inputValue = tdElement.text().trim();
		input.value = inputValue || "";

		tdElement.append(input);

		input.addEventListener('keydown', function(event) {
			if (event.key === 'Enter') {
				var nextInput = $(this).closest('td').next('td').find('input[type="number"]');
				if (nextInput.length) {
					nextInput.focus();
				} else {
					var allInputsFilled = true;
					selectedRow.find("input[type='number']").each(function() {
						if ($(this).val().trim() === '') {
							allInputsFilled = false;
							return false;
						}
					});

					if (allInputsFilled) {
						$('#confirmbutton2').click();
					}
				}
			}
		});
	}

	selectedRow.find("input[type='number']:first").focus();
}
*/



function updateTotalResultDiv2() {
	var hasFailStatus = rowStatusList.includes('FAIL');
	console.log("hasFailStatus", hasFailStatus);
	var totalResultDiv = $("#resultContainer");

	if (hasFailStatus) {
		totalResultDiv.css({ 'background-color': 'red', 'color': 'white', 'text-align': 'center' });
		totalResultDiv.text('FAILED.');


	} else {
		totalResultDiv.css({ 'background-color': 'green', 'color': 'white', 'text-align': 'center' });
		totalResultDiv.text(' PASSED.');
	}
}

/*function fetchStatusFromDatabase() {
	var partNumber = $('#partNo').text();
	var supplier = $('#supplierdiv').text();
	var batchCode = $('#input3').val();

	console.log(partNumber, "----", batchCode);

	$.ajax({
		url: "/WebApplication/Controllers/getData1",
		type: 'GET',
		headers: { Authorization: 'Bearer ' + sessionStorage.getItem('token') },
		data: { partNumber: partNumber, batchCode: batchCode },

		success: function(response) {
			rowStatusList = response;

			console.log("responsedffff", response);
			console.log("rowStatusList.length : ", rowStatusList.length);


			fetchQualityDatalength(partNumber, function(result33) {
				console.log("result33   :", result33);
				if (rowStatusList.length >= result33) {
					var hasFailStatus = rowStatusList.includes('FAIL');
					if (hasFailStatus) {
						alert("Total result is FAIL.");


						$('#failRemarkModal').modal({
							backdrop: 'static',
							keyboard: false
						});

						$('#failRemark').val('');
						$('#failRemarkModal').modal('show');// Show modal for FAIL

						// On submit of the failRemarkForm
						$('#failRemarkForm').off('submit').on('submit', function(e) {
							e.preventDefault();
							const inspectionRemark = $('#failRemark').val().trim();

							if (!inspectionRemark) {
								alert("Remark is required for FAIL status.");
								return;
							}
							$('#failRemarkModal').modal('hide');

							// Calling save and email functions with the remark						
							saveRqcData(partNumber, batchCode, "FAIL", supplier, inspectionRemark);
							sendMail(partNumber, batchCode, supplier); // send mail first
						});
					} else {
						alert("Total result is PASS.");
						saveRqcData(partNumber, batchCode, "PASS", supplier)
					}
				}
			});


		},
		error: function(xhr, textStatus, errorThrown) {
			console.error("Error fetching status from database:", xhr, textStatus, errorThrown);
			alert("Error fetching status from database");
		}
	});
}*/
function fetchStatusFromDatabase() {
    /*var partNumber = $('#partNo').text();
    var supplier = $('#supplierdiv').text();*/
	var partNumber=$('#partNoInput').val();
	var supplier =$('#supplierInput').val();
    var batchCode = $('#input3').val();

    $.ajax({
        url: "/WebApplication/Controllers/getData1",
        type: 'GET',
        headers: { Authorization: 'Bearer ' + sessionStorage.getItem('token') },
        data: { partNumber: partNumber, batchCode: batchCode },

        success: function(response) {
            rowStatusList = response;

            fetchQualityDatalength(partNumber, function(result33) {
                if (rowStatusList.length >= result33) {
                    // ✅ All rows filled → show Final Submit button
					if (window.finalSubmitted) {
					    // already finalized, ensure button hidden and exit
					    $("#finalSubmitBtn").hide();
					    return;
					}
                    $("#finalSubmitBtn").show().data({
                        partNumber: partNumber,
                        batchCode: batchCode,
                        supplier: supplier
                    });
                }
            });
        },
        error: function(xhr, textStatus, errorThrown) {
            console.error("Error fetching status from database:", xhr, textStatus, errorThrown);
            alert("Error fetching status from database");
        }
    });
}

/*$(document).on("click", "#finalSubmitBtn", function () {
	if (window.finalSubmitted) return;
    var partNumber = $(this).data("partNumber");
    var batchCode = $(this).data("batchCode");
    var supplier = $(this).data("supplier");

    var hasFailStatus = rowStatusList.includes('FAIL');

    if (hasFailStatus) {
        // Show remark modal before saving FAIL
        $('#failRemarkModal').modal({
            backdrop: 'static',
            keyboard: false
        });

        $('#failRemark').val('');
        $('#failRemarkModal').modal('show');

        $('#failRemarkForm').off('submit').on('submit', function (e) {
            e.preventDefault();
            const inspectionRemark = $('#failRemark').val().trim();

            if (!inspectionRemark) {
                alert("Remark is required for FAIL status.");
                return;
            }
            $('#failRemarkModal').modal('hide');

            // Save + Email for FAIL
            saveRqcData(partNumber, batchCode, "FAIL", supplier, inspectionRemark);
            sendMail(partNumber, batchCode, supplier);
        });
    } else {
        // Save + Email for PASS
        saveRqcData(partNumber, batchCode, "PASS", supplier);
        sendMail(partNumber, batchCode, supplier);
    }

    // Hide button after submission
    $(this).hide();
});*/
// FINAL SUBMIT button click handler
$(document).on("click", "#finalSubmitBtn", function () {
    if (window.finalSubmitted) return; // already done
	if (window.inputOpen) {
	       alert("Another row is being edited. Save/Cancel first.");
	       return;
	   }

  //  var partNumber = $('#partNo').text();
     var partNumber=$('#partNoInput').val();
     var batchCode = $('#input3').val();
   // var supplier = $('#supplierdiv').text();
     var supplier =$('#supplierInput').val();

    if (!partNumber || !batchCode) {
        alert("Part number or batch code missing.");
        return;
    }

    // Ensure rowStatusList is up-to-date; you already call fetchStatusFromDatabase elsewhere
    var hasFailStatus = rowStatusList.includes('FAIL');

    if (hasFailStatus) {
        // Show remark modal before saving FAIL
        $('#failRemarkModal').modal({ backdrop: 'static', keyboard: false });
        $('#failRemark').val('');
        $('#failRemarkModal').modal('show');

        // on submit of fail remark
        $('#failRemarkForm').off('submit.finalSubmit').on('submit.finalSubmit', function (e) {
            e.preventDefault();
            const inspectionRemark = $('#failRemark').val().trim();

            if (!inspectionRemark) {
                alert("Remark is required for FAIL status.");
                return;
            }
            $('#failRemarkModal').modal('hide');

            // finalize (PASS/FAIL saved internally)
            finalizeSubmission(partNumber, batchCode, supplier, "FAIL", inspectionRemark);
        });

    } else {
        // PASS -> finalize immediately
        finalizeSubmission(partNumber, batchCode, supplier, "PASS");
    }
});

// finalizeSubmission: save + email + lock UI
function finalizeSubmission(partNumber, batchCode, supplier, status, inspectionRemark) {
    // call existing saveRqcData and sendMail (your app code)
    try {
        // if your saveRqcData accepts remark only for FAIL, pass it optionally
        if (typeof saveRqcData === 'function') {
            saveRqcData(partNumber, batchCode, status, supplier, inspectionRemark || '');
        }
		 else {
            console.warn("saveRqcData not found");
        }

		if (status === "FAIL" && typeof sendMail === 'function') {
		            sendMail(partNumber, batchCode, supplier);
		        } else if (status === "PASS") {
		            console.log("PASS status — skipping email.");
		        } else {
		            console.warn("sendMail not found");
		        }
    } catch (e) {
        console.error("Error during final save or sendMail:", e);
        // Do not lock UI if saving failed
        return;
    }

    // Lock UI so further edits not possible
    window.finalSubmitted = true;
    // Remove all edit buttons, save buttons and prevent future dblclicks
    $('#tbody3').find('.editbutton, .savebutton').remove();

    // disable any input/selects so they become read-only
    $('#tbody3').find('input, select, textarea, button.savebutton').prop('disabled', true);

    // Hide Final Submit (or keep it visible but disabled)
    $('#finalSubmitBtn').prop('disabled', true).hide();
	$('#mrnDate').prop('disabled', true);
	$('#supplierInput').prop('disabled',true);
	$('#partNoInput').prop('disabled',true);

    // Optionally show a confirmation
    alert("Final submission completed. Editing is disabled.");

    // also hide/disable any other UI controls if you want:
    // $('#someOtherControl').prop('disabled', true);

    // Finally refresh statuses if needed
    fetchStatusFromDatabase(); // optional, may re-evaluate overall status (but the fetch handler will no-op when finalSubmitted true)
}




function saveRqcData(partNumber, batchCode, result, supplier, inspectionRemark) {
	var dateVal = $('#mrnDate').val();
	    // Check if date is empty
	    if (!dateVal) {
	        alert("Please select a date before submitting.");
	        return; // stop further execution
	    }
	var rqcData = {
		partNumber: partNumber,
		description: $('#partNameContainer').text(),
		batchCode: batchCode,
		result: result,
		supplier: supplier,
		modelName: $('#modelName').text(),
		qty: $('#quantity').text(),
		createdBy: sessionStorage.getItem('employeeId'),
		inspectionRemark: inspectionRemark,
		mrnDate:dateVal,
	};

	console.log(modelName, "rqcData", rqcData);
	
	$.ajax({
		url: "/WebApplication/Controllers/saveRqcData",
		type: 'POST',
		headers: { Authorization: 'Bearer ' + sessionStorage.getItem('token') },
		contentType: 'application/json',
		data: JSON.stringify(rqcData),
		success: function(response) {
			updateTotalResultDiv2();
			console.log("RQC Data saved successfully:", response);

			alert("Remarks added successfully");
		},
		error: function(xhr, textStatus, errorThrown) {
			console.error("Error saving RQC Data:", xhr, textStatus, errorThrown);
			alert("Error saving RQC Data");
		}
	});
}



function sendMail(partNumber, batchCode, supplier) {
	$.ajax({
		url: "/WebApplication/Controllers/sendFailureEmail",
		type: 'POST',
		headers: { Authorization: 'Bearer ' + sessionStorage.getItem('token') },
		contentType: 'application/json',
		data: JSON.stringify({
			partNumber: partNumber,
			batchCode: batchCode,
			supplier: supplier
		}),
		success: function(response) {
			console.log("Email sent successfully:", response);
			alert("Email sent successfully");
		},
		error: function(xhr, textStatus, errorThrown) {
			alert("Error sending email");
			console.error("Error sending email:", xhr, textStatus, errorThrown);
		}
	});

}

// (for Visual / OK-NG logic)
$(document).on('click', '#confirmbutton', function() {
	console.log("confirmbutton clcik hua hai");
	$("#confirmbutton").prop('disabled', true);

	var qualityid = selectedRow.find("td[data-column='qualityId']").text().trim();
	var samplingPlan = parseInt(selectedRow.find('td[data-column="samplingPlain"]').text().trim());
	var multiDimensionValue = parseInt(selectedRow.find('td[data-column="multiDimensionValue"]').text().trim());
	var createdBy = sessionStorage.getItem('employeeId');
	var batchCode = $('#input3').val();
	var dateVal = $('#mrnDate').val();

	if (samplingPlan) { 

	/*	 selectedRow.find("select").each(function () {

			if ($(this).val().trim() === '') {
				$("#confirmbutton").prop('disabled', false); 
				return false;
			}else{
				$("#confirmbutton").prop('disabled', true);
			}
		}); */
		var readingId = selectedRow.attr("data-readingid"); 
		var formData = {
			qualityreadingId: readingId ? parseInt(readingId) : null,
			qualityId: qualityid,
			//partNumber: $('#partNo').text(),
			partNumber:$('#partNoInput').val(),
			batchCode: batchCode,
			quantity: $('#quantity').text(),
			mispNumber: $('#mispNumberContainer').text(),
			revNumber: $('#revNumberContainer').text(),
			modelName: $('#modelName').text(),
			partName: $('#partNameContainer').text(),
			//supplier: $('#supplierdiv').text(),
			supplier:$('#supplierInput').val(),
			inspectionMethod: selectedRow.find("td[data-column='inspectionMethod']").text().trim(),
			quality: { qualityid: qualityid },
			mrnDate:dateVal,
			createdBy: createdBy,
		};

		var isAccepted = true;
		let savingReading = {};


		for (let i = 1; i <= samplingPlan; i++) {
			savingReading[i] = {};
			for (let j = 1; j <= multiDimensionValue; j++) {
				const inputName = `s${i}_d${j}`;
				const inputElem = selectedRow.find(`[name='${inputName}']`);
				const value = inputElem.val();

				if (!value) {
					alert(`Please enter value for Sample ${i}, Dimension ${j}`);
					$("#confirmbutton").prop('disabled', false);
					return;
				}

				savingReading[i][j] = value;

				if (formData.inspectionMethod.toLowerCase() === 'visual' || formData.inspectionMethod.toLowerCase() === 'manual') {
					if (value !== "OK") isAccepted = false;
				}
			}
		}

		formData.savingReading = JSON.stringify(savingReading);


		formData.status = isAccepted ? 'PASS' : 'FAIL';

		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/insertReading/' + qualityid,
			data: JSON.stringify(formData),
			contentType: 'application/json',
			headers: { Authorization: 'Bearer ' + sessionStorage.getItem('token') },
			success: function(response) {


				fetchQualityReadingData(qualityid, batchCode);
				$("#confirmbutton").prop('disabled', false);
				$(".savebutton").remove();

				closeInput();
				//rowStatusList.push(formData.status);

				fetchStatusFromDatabase(); // to automatically fetch the whole status of the data, means whole is fail or pass

			},
			error: function(error) {
				console.error('Error adding Quality data:', error);
				alert('Error adding Quality data. Please try again.');
				$("#confirmbutton").prop('disabled', false);
			}
		});
	} else {
		alert("Please fill in the inputs.");
	}
});

function formatMonthYear(value) { // takes "2025-02" and return like "Feb 2025"
    const date = new Date(value + "-01"); // e.g., "2025-02-01"
    return date.toLocaleString("en-US", { month: "short", year: "numeric" });
}


$(document).on('click', '#confirmbutton4', function() {
	$("#confirmbutton4").prop('disabled', true);

	var qualityid = selectedRow.find("td[data-column='qualityId']").text().trim();
	var samplingPlan = parseInt(selectedRow.find('td[data-column="samplingPlain"]').text().trim());
	var multiDimensionValue = parseInt(selectedRow.find('td[data-column="multiDimensionValue"]').text().trim());
	var createdBy = sessionStorage.getItem('employeeId');
	var batchCode = $('#input3').val();
	var dateVal = $('#mrnDate').val();
	var readingId = selectedRow.attr("data-readingid");
	if (samplingPlan) {
		var formData = {
			qualityreadingId: readingId ? parseInt(readingId) : null,
			qualityId: qualityid,
			//partNumber: $('#partNo').text(),
			partNumber:$('#partNoInput').val(),
			batchCode: batchCode,
			quantity: $('#quantity').text(),
			mispNumber: $('#mispNumberContainer').text(),
			revNumber: $('#revNumberContainer').text(),
			partName: $('#partNameContainer').text(),
			modelName: $('#modelName').text(),
			//supplier: $('#supplierdiv').text(),
			supplier:$('#supplierInput').val(),
			inspectionMethod: selectedRow.find("td[data-column='inspectionMethod']").text().trim(),
			quality: { qualityid: qualityid },
			mrnDate:dateVal,
			createdBy: createdBy,
		};

		let savingReading = {};

		for (let i = 1; i <= samplingPlan; i++) {
			savingReading[i] = {};
			for (let j = 1; j <= multiDimensionValue; j++) {
				const inputName = `s${i}_d${j}`;
				const inputElem = selectedRow.find(`[name='${inputName}']`);
				let value = inputElem.val();

				if (!value) {
					alert(`Please select a date for Sample ${i}, Dimension ${j}`);
					$("#confirmbutton4").prop('disabled', false);
					return;
				}

				//let formattedDate = new Date(value).toISOString().split('T')[0];
				let formattedDate = formatMonthYear(value);  // Store year-month  only "Aug 2025"
				
				savingReading[i][j] = formattedDate;
			}
		}

		formData.savingReading = JSON.stringify(savingReading);

		formData.status = 'PASS';

		$.ajax({
			type: 'post',
			url: '/WebApplication/Controllers/insertReading/' + qualityid,
			data: JSON.stringify(formData),
			contentType: 'application/json',
			headers: { Authorization: 'Bearer ' + sessionStorage.getItem('token') },
			success: function(response) {
				fetchQualityReadingData(qualityid, batchCode);
				$("#confirmbutton4").prop('disabled', false);
				$(".savebutton").remove();
				closeInput();
				fetchStatusFromDatabase();
			},
			error: function(error) {
				console.error('Error adding Quality data:', error);
				alert('Error adding Quality data. Please try again.');
				$("#confirmbutton4").prop('disabled', false);
			}
		});
	} else {
		alert("Please fill in the inputs.");
	}
});


function cleanNumber(value) {
	if (!value) return 0;

	value = value.trim();
	value = value.replace(/[^0-9.]/g, '');       // Keep only digits and dots
	value = value.replace(/\.{2,}/g, '.');       // Replace multiple dots with a single
	value = value.replace(/^\./, '0.');          // ".2" -> "0.2"
	value = value.replace(/^0*\.(?!\d)/, '0.');  // Handle edge "."

	// Only extract first valid float-like string
	const match = value.match(/\d+(\.\d+)?/);    // Match "0.2" from cleaned string

	var num = match ? parseFloat(match[0]) : 0;
	return isNaN(num) ? 0 : num;
}

$(document).on('click', '#confirmbutton5', function() {
    $("#confirmbutton5").prop('disabled', true);

    var qualityid = selectedRow.find("td[data-column='qualityId']").text().trim();
    var samplingPlan = parseInt(selectedRow.find('td[data-column="samplingPlain"]').text().trim());
    var multiDimensionValue = parseInt(selectedRow.find('td[data-column="multiDimensionValue"]').text().trim());
    var createdBy = sessionStorage.getItem('employeeId');
    var batchCode = $('#input3').val();
	var dateVal = $('#mrnDate').val();
	
    if (samplingPlan) {
		var readingId = selectedRow.attr("data-readingid");		
        var formData = {
			qualityreadingId: readingId ? parseInt(readingId) : null,
            qualityId: qualityid,
           // partNumber: $('#partNo').text(),
		   partNumber:$('#partNoInput').val(),
            batchCode: batchCode,
            quantity: $('#quantity').text(),
            mispNumber: $('#mispNumberContainer').text(),
            revNumber: $('#revNumberContainer').text(),
			modelName: $('#modelName').text(),
            partName: $('#partNameContainer').text(),
           // supplier: $('#supplierdiv').text(),
		    supplier:$('#supplierInput').val(),
            inspectionMethod: selectedRow.find("td[data-column='inspectionMethod']").text().trim(),
            quality: { qualityid: qualityid },
			mrnDate:dateVal,
            createdBy: createdBy,
        };

        let savingReading = {};

        for (let i = 1; i <= samplingPlan; i++) {
            savingReading[i] = {};
            for (let j = 1; j <= multiDimensionValue; j++) {
                const inputName = `s${i}_d${j}`;
                const inputElem = selectedRow.find(`[name='${inputName}']`);
                let value = inputElem.val();

                if (!value) {
                    alert(`Please enter a value for Sample ${i}, Dimension ${j}`);
                    $("#confirmbutton5").prop('disabled', false);
                    return;
                }

                // ✅ Clean numeric input
                // let numericValue = cleanNumber(value);
                savingReading[i][j] = value;
            }
        }

        formData.savingReading = JSON.stringify(savingReading);
        formData.status = 'PASS';

        $.ajax({
            type: 'post',
            url: '/WebApplication/Controllers/insertReading/' + qualityid,
            data: JSON.stringify(formData),
            contentType: 'application/json',
            headers: { Authorization: 'Bearer ' + sessionStorage.getItem('token') },
            success: function(response) {
                fetchQualityReadingData(qualityid, batchCode);
                $("#confirmbutton5").prop('disabled', false);
                $(".savebutton").remove();
                closeInput();
                fetchStatusFromDatabase();
            },
            error: function(error) {
                console.error('Error adding Quality data:', error);
                alert('Error adding Quality data. Please try again.');
                $("#confirmbutton5").prop('disabled', false);
            }
        });
    } else {
        alert("Please fill in the inputs.");
    }
});


// (for criteria-based range like ±tol) exact min or max text written. or (for range exact min ~ max ) like 0.34~0.56
$(document).on('click', '#confirmbutton2', function() {
	$("#confirmbutton2").prop('disabled', true);
	var qualityid = selectedRow.find("td[data-column='qualityId']").text().trim();
	var samplingPlan = parseInt(selectedRow.find('td[data-column="samplingPlain"]').text().trim());
	var multiDimensionValue = parseInt(selectedRow.find('td[data-column="multiDimensionValue"]').text().trim());
	var createdBy = sessionStorage.getItem('employeeId');
	var batchCode = $('#input3').val();
	var criteriaText = selectedRow.find("td[data-column='criteria']").text().trim();
	var criteria = parseFloat(criteriaText.match(/\d+(\.\d+)?/)[0]);
	var dateVal = $('#mrnDate').val();
	
	
	// ✅ Use precomputed stored min/max directly
	const minRaw = selectedRow.find("td[data-column='minCriteria']").text() || selectedRow.find("td[data-column='min']").text();
	const maxRaw = selectedRow.find("td[data-column='maxCriteria']").text() || selectedRow.find("td[data-column='max']").text();
				   
	const min = cleanNumber(minRaw);
	const max = cleanNumber(maxRaw);
		
	if (samplingPlan) {

		 selectedRow.find("input[type='number']").each(function() {

			if ($(this).val().trim() === '') {
				$("#confirmbutton2").prop('disabled', false); 
				alert("Fill all values");
				return false;
			}else{
				$("#confirmbutton2").prop('disabled', true);
			}
		});}
		var readingId = selectedRow.attr("data-readingid"); 

	var formData = {
		qualityreadingId: readingId ? parseInt(readingId) : null,
		qualityId: qualityid,
		//partNumber: $('#partNo').text(),
		partNumber:$('#partNoInput').val(),
		batchCode: batchCode,
		quantity: $('#quantity').text(),
		mispNumber: $('#mispNumberContainer').text(),
		revNumber: $('#revNumberContainer').text(),
		partName: $('#partNameContainer').text(),
		modelName: $('#modelName').text(),
		//supplier: $('#supplierdiv').text(),
		supplier:$('#supplierInput').val(),
		inspectionMethod: selectedRow.find("td[data-column='inspectionMethod']").text().trim(),
		quality: { qualityid: qualityid },
		mrnDate:dateVal,
		createdBy: createdBy,
	};
	var exceededRange = [];
	var belowRange = [];


	let savingReading = {};
	try {
		// saving sample wise
		for (let i = 1; i <= samplingPlan; i++) {
			savingReading[i] = {};
			for (let j = 1; j <= multiDimensionValue; j++) {
				const inputName = `s${i}_d${j}`;
				const inputElem = selectedRow.find(`input[name='${inputName}']`);
				const rawValue = inputElem.val();
				const inputValue = cleanNumber(rawValue);

				if (!rawValue || rawValue.trim() === "") {
					throw { sample: i, dimension: j };
				}

				savingReading[i][j] = inputValue;
				console.log(`Checking ${inputName}: value=${inputValue}, min=${min}, max=${max}`);


				if (criteriaText.toLowerCase().includes('min')) { 
					if (inputValue < min) belowRange.push(inputName);
				} else if (criteriaText.toLowerCase().includes('max')) {
					if (inputValue > max) exceededRange.push(inputName);
				} else if (criteriaText.toLowerCase().includes("~")) {
					if (inputValue < min) {
						belowRange.push(inputName);
					} else if (inputValue > max) {
						exceededRange.push(inputName);
					}
				} else {
					// for normal it uses that it takes the first number and then uses that and makes + and - tolerance.
					if (inputValue > max) {
						exceededRange.push(inputName);
					} else if (inputValue < min) {
						belowRange.push(inputName);
					}
				}
			}
		}
	} catch (e) {
		alert(`Please enter a value for Sample ${e.sample}, Dimension ${e.dimension}`);
		 $("#confirmbutton2").prop('disabled', false);
		return;
	}

	formData.savingReading = JSON.stringify(savingReading);
	var status = (exceededRange.length === 0 && belowRange.length === 0) ? 'PASS' : 'FAIL';
	formData.status = status;
	console.log(formData);

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/insertReading/' + qualityid,
		data: JSON.stringify(formData),
		contentType: 'application/json',
		headers: { Authorization: 'Bearer ' + sessionStorage.getItem('token') },
		success: function(response) {
			console.log(resetRowStatusList.length);
			fetchQualityReadingData(qualityid, batchCode);
			closeInput();
			$("#confirmbutton2").prop('disabled', false);
			$(".savebutton").remove();

			fetchStatusFromDatabase(); // to automatically fetch the whole status of the data, means whole is fail or pass
		},
		error: function(error) {
			console.error('Error adding Quality data:', error);
			alert('Error adding Quality data. Please try again.');
			$("#confirmbutton2").prop('disabled', false);
		}
	});
});


// just for counting method
$(document).on('click', '#confirmbutton3', function() {

	$("#confirmbutton3").prop('disabled', true);
	var qualityid = selectedRow.find("td[data-column='qualityId']").text().trim();
	var samplingPlan = parseInt(selectedRow.find('td[data-column="samplingPlain"]').text().trim());
	var multiDimensionValue = parseInt(selectedRow.find('td[data-column="multiDimensionValue"]').text().trim());
	var createdBy = sessionStorage.getItem('employeeId');
	var batchCode = $('#input3').val();

	var criteriaText = selectedRow.find("td[data-column='criteria']").text().trim();
	var criteria = parseFloat(criteriaText.match(/\d+(\.\d+)?/)[0]);

	var dateVal = $('#mrnDate').val();
	var min = parseFloat(selectedRow.find("td[data-column='min']").text());
	var max = parseFloat(selectedRow.find("td[data-column='max']").text());
	var minimum = criteria - min; // not used
	var maximum = criteria + max; // not used
	var readingId = selectedRow.attr("data-readingid");
	var formData = {
		qualityreadingId: readingId ? parseInt(readingId) : null,
		qualityId: qualityid,
		//partNumber: $('#partNo').text(),
		partNumber:$('#partNoInput').val(),
		batchCode: batchCode,
		quantity: $('#quantity').text(),
		mispNumber: $('#mispNumberContainer').text(),
		revNumber: $('#revNumberContainer').text(),
		partName: $('#partNameContainer').text(),
		modelName: $('#modelName').text(),
		//supplier: $('#supplierdiv').text(),
		supplier:$('#supplierInput').val(),
		inspectionMethod: selectedRow.find("td[data-column='inspectionMethod']").text().trim(),
		quality: { qualityid: qualityid },
		mrnDate:dateVal,
		createdBy: createdBy,
	};
	var exceededRange = [];
	var belowRange = [];

	const savingReading = {};
	/*	for (var i = 1; i <= samplingPlan; i++) {
			var inputName = "s" + i;
			var inputValue = parseFloat(selectedRow.find("input[name='" + inputName + "']").val());
	
			if (!inputValue) {
				alert("Please select a value for " + inputName + ".");
				$("#confirmbutton3").prop('disabled', false);
				return;
			}
			if (inputValue >= min && inputValue <= max) {
				formData[inputName] = inputValue;
			} else {
				formData[inputName] = inputValue;
				if (inputValue > max) {
					exceededRange.push(inputName);
				} else if (inputValue < min) {
					belowRange.push(inputName);
				}
			}
		}*/

	try {
		for (let i = 1; i <= samplingPlan; i++) {
			savingReading[i] = {};
			for (let j = 1; j <= multiDimensionValue; j++) {
				const inputName = `s${i}_d${j}`;
				const inputElem = selectedRow.find(`input[name='${inputName}']`);
				const rawValue = inputElem.val();
				const inputValue = cleanNumber(rawValue);

				if (!rawValue || rawValue.trim() === "") {
					throw { sample: i, dimension: j };
				}

				savingReading[i][j] = inputValue;


				if (inputValue > max) {
					exceededRange.push(inputName);
				} else if (inputValue < min) {
					belowRange.push(inputName);
				}
			}
		}
	} catch (e) {
		alert(`Please enter a value for Sample ${e.sample}, Dimension ${e.dimension}`);
		$("#confirmbutton3").prop('disabled', false);
		return;
	}
	formData.savingReading = JSON.stringify(savingReading);

	var status = (exceededRange.length === 0 && belowRange.length === 0) ? 'PASS' : 'FAIL';
	formData.status = status;

	$.ajax({
		type: 'post',
		url: '/WebApplication/Controllers/insertReading/' + qualityid,
		data: JSON.stringify(formData),
		contentType: 'application/json',
		headers: { Authorization: 'Bearer ' + sessionStorage.getItem('token') },
		success: function(response) {

			console.log(batchCode);
			console.log(resetRowStatusList.length);
			fetchQualityReadingData(qualityid, batchCode);
			closeInput();
			$("#confirmbutton3").prop('disabled', false);
			$(".savebutton").remove();

			//rowStatusList.push(formData.status);
			fetchStatusFromDatabase();  // to automatically fetch the whole status of the data, means whole is fail or pass

		},
		error: function(error) {
			console.error('Error adding Quality data:', error);
			alert('Error adding Quality data. Please try again.');
			$("#confirmbutton3").prop('disabled', false);
		}
	});

});





function fetchQualityReadingData(qualityid, batchCode) {
	$.ajax({
		url: "/WebApplication/Controllers/fetchQualityReadingData/" + qualityid + "/" + batchCode,
		type: 'GET',
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(data) {

			if (data && data.length > 0) {
				console.log("data2", data);
				appendQualityReadingDataToTable(data);
			} else {
				alert("Quality reading data not found for Quality ID: " + qualityid);
			}
		},
		error: function(xhr, textStatus, errorThrown) {
			console.error("Error fetching quality reading data:", xhr, textStatus, errorThrown);
			alert("Error fetching quality reading data");
		}
	});
}


/*function appendQualityReadingDataToTable(data) {

	var tableBody = $("#tbody3");
	//$("#tableBody3").empty();
	//var overallStatus = 'pass';
	$.each(data, function(index, row) {
		var selectedRow = tableBody.find('tr[data-qualityid="' + row.quality.qualityId + '"]');
		Object.keys(row).forEach(function(key) {
			if (row[key] === null) {
				row[key] = ' ';
			}
		});
		if (selectedRow.length === 0) {
			var newRow = '<tr class="tableDataRows" data-qualityid="' + row.quality.qualityId + '">' +
				'<td data-column="columnId">' + (1 + parseInt(index)) + '</td>' +
				'<td data-column="inspectionItem">' + row.quality.inspectionItem + '</td>' +
				'<td data-column="criteria">' + row.quality.criteria + '</td>' +
				'<td data-column="min">' + row.quality.min + '</td>' +
				'<td data-column="max">' + row.quality.max + '</td>' +
				'<td data-column="inspectionMethod">' + row.quality.inspectionMethod + '</td>' +
				'<td data-column="inspectionTool">' + row.quality.instrument.instrumentName + '</td>' +
				'<td data-column="samplingPlain">' + row.quality.samplingPlan + '</td>' +
				'<td data-column="multiDimensionValue">' + row.quality.multiDimensionValue + '</td>' +
				'<td data-column="s1">' + row.s1 + '</td>' +
				'<td data-column="s2">' + row.s2 + '</td>' +
				'<td data-column="s3">' + row.s3 + '</td>' +
				'<td data-column="s4">' + row.s4 + '</td>' +
				'<td data-column="s5">' + row.s5 + '</td>' +
				'<td data-column="s6">' + row.s6 + '</td>' +
				'<td data-column="s7">' + row.s7 + '</td>' +
				'<td data-column="s8">' + row.s8 + '</td>' +
				'<td data-column="s9">' + row.s9 + '</td>' +
				'<td data-column="s10">' + row.s10 + '</td>' +
				'<td data-column="s11">' + row.s11 + '</td>' +
				'<td data-column="s12">' + row.s12 + '</td>' +
				'<td data-column="s13">' + row.s13 + '</td>' +
				'<td data-column="s14">' + row.s14 + '</td>' +
				'<td data-column="s15">' + row.s15 + '</td>' +
				'<td data-column="s16">' + row.s16 + '</td>' +
				'<td data-column="s17">' + row.s18 + '</td>' +
				'<td data-column="s19">' + row.s19 + '</td>' +
				'<td data-column="s20">' + row.s20 + '</td>' +
				'<td data-column="status">' + row.status + '</td>' +
				'<td data-column="qualityId" style="display:none;">' + row.quality.qualityId + '</td>'
			'</tr>';
			tableBody.append(newRow);

		} else {
			//selectedRow.find('td[data-column="columnId"]').text(parseInt(index));
			selectedRow.find('td[data-column="inspectionItem"]').text(row.quality.inspectionItem);
			//
			selectedRow.find('td[data-column="criteria"]').text(row.quality.criteria);
			selectedRow.find('td[data-column="min"]').text(row.quality.min);
			selectedRow.find('td[data-column="max"]').text(row.quality.max);
			selectedRow.find('td[data-column="inspectionMethod"]').text(row.quality.inspectionMethod);
			selectedRow.find('td[data-column="inspectionTool"]').text(row.quality.instrument.instrumentName);
			selectedRow.find('td[data-column="samplingPlan"]').text(row.quality.samplingPlan);
			selectedRow.find('td[data-column="s1"]').text(row.s1);
			//
			selectedRow.find('td[data-column="s2"]').text(row.s2);
			selectedRow.find('td[data-column="s3"]').text(row.s3);
			selectedRow.find('td[data-column="s4"]').text(row.s4);
			selectedRow.find('td[data-column="s5"]').text(row.s5);
			selectedRow.find('td[data-column="s6"]').text(row.s6);
			selectedRow.find('td[data-column="s7"]').text(row.s7);
			selectedRow.find('td[data-column="s8"]').text(row.s8);
			selectedRow.find('td[data-column="s9"]').text(row.s9);
			selectedRow.find('td[data-column="s10"]').text(row.s10);
			selectedRow.find('td[data-column="s11"]').text(row.s11);
			selectedRow.find('td[data-column="s12"]').text(row.s12);
			selectedRow.find('td[data-column="s13"]').text(row.s13);
			selectedRow.find('td[data-column="s14"]').text(row.s14);
			selectedRow.find('td[data-column="s15"]').text(row.s15);
			selectedRow.find('td[data-column="s16"]').text(row.s16);
			selectedRow.find('td[data-column="s17"]').text(row.s17);
			selectedRow.find('td[data-column="s18"]').text(row.s18);
			selectedRow.find('td[data-column="s19"]').text(row.s19);
			selectedRow.find('td[data-column="s20"]').text(row.s20);
			selectedRow.find('td[data-column="status"]').text(row.status);
			var statusCell = selectedRow.find('td[data-column="status"]');
			var statusText = statusCell.text().trim().toLowerCase();

			if (statusText === 'fail') {
				statusCell.css({ 'background-color': 'red', 'color': 'black' });
			} else if (statusText === 'pass') {
				statusCell.css({ 'background-color': 'green', 'color': 'black' });
			} else {

				statusCell.css({ 'background-color': '', 'color': '' });
			}

			selectedRow.find('td[data-column="qualityId"]').text(row.quality.qualityId);
		}

	});

}*/

// this update only that row which is saved, based on this .find('tr[data-qualityid="' 
window.globalRowCounter = window.globalRowCounter || 1;

/* ---------- REPLACEMENT: appendQualityReadingDataToTable ---------- */
 function appendQualityReadingDataToTable(data) {
    const tableBody = $("#tbody3");
    if (!Array.isArray(data)) return;
	console.log("sample size max",maxsample);

    // Persist counter across calls
    window.globalRowCounter = window.globalRowCounter || 1;

    data.forEach(async function (row,index) {
		console.log("row aaya hain=>",row)
       // const seqNo = window.globalRowCounter++;
	   const seqNo = index + 1;
        // samplingPlan and multiDimension should come from the payload (row.quality)
		let samplingPlanRaw = row.quality?.samplingPlan || row.samplingPlan || "1";
        const multiDimension = parseInt(row.quality?.multiDimensionValue) || parseInt(row.multiDimensionValue) || 1;
		let samplingPlan;

		if (samplingPlanRaw.toString().toLowerCase() === "sp") {
		    // resolve SP dynamically using globalQuantity
		    samplingPlan = await fetchSPSampleSizeFromQuantity(globalQuantity);
		} else {
		    samplingPlan = parseInt(samplingPlanRaw) || 1;
		}
        // get existing row in DOM (if any)
        var existingRow = tableBody.find('tr[data-qualityid="' + row.quality.qualityId + '"]');

        // parse savingReading (if exists)
        var savingData = {};
        try {
            savingData = row.savingReading ? JSON.parse(row.savingReading) : {};
        } catch (e) {
            console.error("Invalid savingReading for qualityId", row.quality.qualityId, e);
            savingData = {};
        }

        // status styling
        var statusLower = (row.status || '').toLowerCase();
        var bg = statusLower === 'pass' ? 'green' : (statusLower === 'fail' ? 'red' : '');
        var fg = bg ? 'black' : '';

		function extractNumeric(str) { // utility to pull out the first number from a string.
				const match = str.match(/[-+]?[0-9]*\.?[0-9]+/);
				return match ? parseFloat(match[0]) : 0;
			}
				 
		let minCriteria = null, maxCriteria = null, baseVal;
		let criteria = row.criteria || "";
		var inspectionMethod = (row.inspectionMethod || "").trim();
		if ((inspectionMethod.toLowerCase() === 'measure') || (inspectionMethod.toLowerCase() === 'manual')) {
			// Directly use saved numeric values (already computed)
			minCriteria = parseFloat(row.quality?.min || 0);
			maxCriteria = parseFloat(row.quality?.max || 0);
			
			if (criteria.toLowerCase().includes("min")) {
				maxCriteria = "-";
			}
		} else if (inspectionMethod.toLowerCase() === 'visual' || inspectionMethod.toLowerCase() === 'calendar' || inspectionMethod.toLowerCase() === 'cavity') {
			maxCriteria = null;
			minCriteria = null;
		}
        // build row html (make sure we use samplingPlain since rest of code reads that)
		console.log("reading id",row.qualityreadingId);
        let rowHtml = `<tr class="tableDataRows" data-qualityid="${row.quality.qualityId}" data-readingid="${row.qualityreadingId || ''}">
            <td data-column="columnId">${seqNo}</td>
            <td data-column="inspectionItem">${row.quality.inspectionItem || ''}</td>
            <td data-column="criteria">${row.quality.criteria || ''}</td>
            <td data-column="minCriteria">${(minCriteria !== null && minCriteria !== undefined) ? (isNaN(minCriteria) ? '' : minCriteria.toFixed(3)) : ''}</td>
            <td data-column="maxCriteria">${(maxCriteria !== null && maxCriteria !== undefined) ? (isNaN(maxCriteria) ? '' : maxCriteria.toFixed(3)) : ''}</td>
			<td data-column="min" style="display:none">${row.quality.min || ''}</td>
			<td data-column="max" style="display:none">${row.quality.max || ''}</td>
			 <td data-column="inspectionMethod">${row.quality.inspectionMethod || ''}</td>
            <td data-column="inspectionTool">${(row.quality.instrument && row.quality.instrument.instrumentName) || ''}</td>
            <td data-column="samplingPlain">${samplingPlan}</td>
            <td data-column="multiDimensionValue">${multiDimension}</td>`;

        // create sample tds with disabled inputs (one <td> per sample, multiple inputs per dimension)
      /*  for (let i = 1; i <= samplingPlan; i++) {
            rowHtml += `<td data-column="s${i}" style="padding:2px; vertical-align:middle;">`;
            for (let d = 1; d <= multiDimension; d++) {
                const val = (savingData && savingData[i] && savingData[i][d] !== undefined) ? savingData[i][d] : '';
                // include name so we can easily prefill and reuse on edit
                rowHtml += `<input type="text" name="s${i}_d${d}" data-quality-id="${row.quality.qualityId}" data-sample-no="${i}" data-dimension="${d}" value="${val}" disabled style="font-size:14px; line-height:15px; min-width:40px; width:calc(${String(val).length * 0.7}ch + 10px);" />`;
            }
            rowHtml += `</td>`;
        }*/
		// create sample tds with disabled inputs
		for (let i = 1; i <= maxsample; i++) {
		    rowHtml += `<td data-column="s${i}" style="padding:2px; vertical-align:middle;">`;
		    
		    if (i <= samplingPlan) {
		        for (let d = 1; d <= multiDimension; d++) {
		            const val = (savingData && savingData[i] && savingData[i][d] !== undefined) ? savingData[i][d] : '';
		            rowHtml += `<input type="text" name="s${i}_d${d}" 
		                          data-quality-id="${row.quality.qualityId}" 
		                          data-sample-no="${i}" 
		                          data-dimension="${d}" 
		                          value="${val}" 
		                          disabled 
		                          style="font-size:14px; line-height:15px; min-width:40px; width:calc(${String(val).length * 0.7}ch + 10px);" />`;
		        }
		    } else {
		        // empty placeholder for alignment
		        rowHtml += "&nbsp;";
		    }

		    rowHtml += `</td>`;
		}


        rowHtml += `<td data-column="status" style="${bg ? 'background-color:' + bg + '; color:' + fg + ';' : ''}">${row.status || ''}</td>
                    <td data-column="qualityId" style="display:none;">${row.quality.qualityId}</td>
                </tr>`;

        if (existingRow.length === 0) {
            tableBody.append(rowHtml);
        } else {
            existingRow.replaceWith(rowHtml);
        }
    });

    // adjust widths after rendering
    document.querySelectorAll("input[data-quality-id]").forEach(inp => adjustWidth(inp));

    // inject Edit button into each row (if not already present)
   /* tableBody.find('tr.tableDataRows').each(function () {
        var $tr = $(this);
        if ($tr.find(".editbutton").length || $tr.find("td.__action_edit").length) return;

        var td = $("<td></td>").addClass("__edit_td");
        var editBtn = $("<button>Edit</button>").addClass("editbutton").css({ color: "white", backgroundColor: "blue", padding: "4px 8px", border: "none", cursor: "pointer" });
        td.append(editBtn);

        var qidCell = $tr.find("td[data-column='qualityId']");
        if (qidCell.length) qidCell.before(td);
        else $tr.append(td);
    });*/
	
	setTimeout(()=>{
		tableBody.find('tr.tableDataRows').each(function () {
			    var $tr = $(this);

			    // Skip if already has edit button
			    if ($tr.find(".editbutton").length || $tr.find("td.__action_edit").length) return;

			    // ✅ Only add Edit button if this row already has a readingId (means data was saved)
			    var readingId = $tr.attr("data-readingid");
				console.log("readingId for the edit",readingId);
			    if (readingId && readingId.trim() !== "") {
			        var td = $("<td></td>").addClass('__edit_td');
			        var editBtn = $("<button>Edit</button>")
			            .addClass("editbutton")
			            .css({
			                color: "white",
			                backgroundColor: "blue",
			                padding: "4px 8px",
			                border: "none",
			                cursor: "pointer"
			            });
			        td.append(editBtn);

			        var qidCell = $tr.find("td[data-column='qualityId']");
			        if (qidCell.length) qidCell.before(td);
			        else $tr.append(td);
			    }
			})
	},110)
	
	/*tableBody.find('tr.tableDataRows').each(function () {
	    var $tr = $(this);

	    // Skip if already has edit button
	    if ($tr.find(".editbutton").length || $tr.find("td.__action_edit").length) return;

	    // ✅ Only add Edit button if this row already has a readingId (means data was saved)
	    var readingId = $tr.attr("data-readingid");
		console.log("readingId for the edit",readingId);
	    if (readingId && readingId.trim() !== "") {
	        var td = $("<td></td>").addClass('__edit_td');
	        var editBtn = $("<button>Edit</button>")
	            .addClass("editbutton")
	            .css({
	                color: "white",
	                backgroundColor: "blue",
	                padding: "4px 8px",
	                border: "none",
	                cursor: "pointer"
	            });
	        td.append(editBtn);

	        var qidCell = $tr.find("td[data-column='qualityId']");
	        if (qidCell.length) qidCell.before(td);
	        else $tr.append(td);
	    }
	})*/;

	$("#tbody3 tr").each(function (idx) {
	    $(this).find("td:first").text(idx + 1); // update first cell with new S.No.
	});

	
	
}
/* ---------- END replacement ---------- */


/* ---------- EDIT BUTTON click handler (prefill + reuse your save handlers) ---------- */
$(document).on("click", ".editbutton", function (e) {
    e.preventDefault();
	// inside the dblclick handler, as the first lines:
	if (window.finalSubmitted) {
	    alert("Final submission already done — editing disabled.");
	    return;
	}

    var row = $(this).closest("tr");
    if (window.inputOpen) {
        alert("Another row is being edited. Save/Cancel first.");
        return;
    }

    selectedRow = row; // global used by your save handlers

    // read method and plan robustly
    var inspectionMethod = (row.find("td[data-column='inspectionMethod']").text() || '').trim().toLowerCase();
    var Plan = parseInt(row.find("td[data-column='samplingPlain']").text().trim() || row.find("td[data-column='samplingPlan']").text().trim() || '0') || 0;
    var multiDimension = parseInt(row.find("td[data-column='multiDimensionValue']").text().trim() || '1') || 1;

    // collect saved values from disabled inputs into savedVals[sample][dim]
    var savedVals = {};
    row.find("td[data-column^='s']").each(function () {
        $(this).find('input, select').each(function () {
            var $el = $(this);
            var sNo = parseInt($el.attr('data-sample-no')) || ( ($el.attr('name') && ($el.attr('name').match(/s(\d+)_/)||[])[1]) ? parseInt(($el.attr('name').match(/s(\d+)_/)||[])[1]) : 1 );
            var dim = parseInt($el.attr('data-dimension')) || ( ($el.attr('name') && ($el.attr('name').match(/_d(\d+)/)||[])[1]) ? parseInt(($el.attr('name').match(/_d(\d+)/)||[])[1]) : 1 );
            savedVals[sNo] = savedVals[sNo] || {};
            savedVals[sNo][dim] = $el.val();
        });
    });

    // remove edit cell and existing save remnants
    row.find("td.__edit_td, td.__action_edit").remove();
    row.find("th#tableheading2").remove();
    row.find("td.savebutton").remove();

    // add Save header and cell similar to dblclick
    var th = $("<th>Save</th>").attr("id", "tableheading2").css({ color: "black", backgroundColor: "white" });
    row.find("th[data-column='status']").after(th);

    var actionTd = $("<td></td>").addClass("__action_edit");
    var saveBtn = $("<button>Save</button>").addClass("savebutton").css({ color: "white", backgroundColor: "black", padding: "4px 8px", border: "none", cursor: "pointer" });
    actionTd.append(saveBtn);
    row.find("td[data-column='status']").after(actionTd);

    // create editable controls using the same create functions (they empty the tds)
    if (inspectionMethod === 'visual' || inspectionMethod === 'manual') {
        createAndAppendSelectElement(row, Plan);
        saveBtn.attr("id", "confirmbutton");
    } else if (inspectionMethod === 'measure') {
        createAndAppendInputElement(row, Plan);
        saveBtn.attr("id", "confirmbutton2");
    } else if (inspectionMethod === 'calendar') {
        createAndAppendInputElementForCalander(row, Plan);
        saveBtn.attr("id", "confirmbutton4");
    } else if (inspectionMethod === 'cavity') {
        createAndAppendInputElementForCavity(row, Plan);
        saveBtn.attr("id", "confirmbutton5");
    } else if (inspectionMethod === 'counting') {
        createAndAppendInputElement(row, Plan);
        saveBtn.attr("id", "confirmbutton3");
    } else {
        createAndAppendInputElement(row, Plan);
        saveBtn.attr("id", "confirmbutton2");
    }

    // Prefill created inputs/selects from savedVals
  /*  for (let i = 1; i <= Plan; i++) {
        for (let d = 1; d <= multiDimension; d++) {
            const name = `s${i}_d${d}`;
            const $el = row.find(`[name='${name}']`);
            if (!$el || $el.length === 0) continue;
            const val = (savedVals[i] && savedVals[i][d] !== undefined) ? savedVals[i][d] : '';
            $el.val(val);
            $el.trigger('input');
            if ($el.is('select')) $el.trigger('change');
        }
    }*/
	// Prefill created inputs/selects from savedVals
	for (let i = 1; i <= Plan; i++) {
	    for (let d = 1; d <= multiDimension; d++) {
	        const name = `s${i}_d${d}`;
	        const $el = row.find(`[name='${name}']`);
	        if (!$el || $el.length === 0) continue;

	        let val = (savedVals[i] && savedVals[i][d] !== undefined) ? savedVals[i][d] : '';

	        // 🔹 Handle <input type="month"> separately
	        if ($el.attr('type') === 'month' && val) {
	            // if already in YYYY-MM, use directly; if not, try to parse
	            if (!/^\d{4}-\d{2}$/.test(val)) {
	                let parsed = new Date(val);
	                if (!isNaN(parsed)) {
	                    let m = String(parsed.getMonth() + 1).padStart(2, '0');
	                    val = `${parsed.getFullYear()}-${m}`;
	                } else {
	                    val = ''; // fallback if parsing fails
	                }
	            }
	        }

	        $el.val(val);
	        $el.trigger('input');
	        if ($el.is('select')) $el.trigger('change');
	    }
	}


    window.inputOpen = true;
    setTimeout(function () { row.find("select, input").first().focus(); }, 30);
});
/* ---------- end edit handler ---------- */


// used in above function to adjust the input width in the frontned when save is clicked and value is retained from backend.
function adjustWidth(input) {
	const span = document.createElement("span");
	span.style.visibility = "hidden";
	span.style.position = "absolute";
	span.style.whiteSpace = "pre";
	span.style.font = getComputedStyle(input).font;
	span.textContent = input.value || input.placeholder || "";
	document.body.appendChild(span);

	// Apply measured width
	input.style.width = Math.max(40, span.offsetWidth + 10) + "px";

	span.remove();
}





/* ***********************   OTHER MASTERS **************************/
$(document).ready(function() {

	function handlePageChange(newPage) {
		searchLoad = false;
		var text = $("#masterHeading").text();

		var adjustment = (newPage === 1) ? 0 : (newPage - lastPage) * 10;

		if (searchLoad) {
			if (text == "QUALITY RESULT SUMMARY AND DEVIATION PASS") {

				loadReceivingQualityReport(newPage);

			}

		} else {

			if (text == "QUALITY RESULT SUMMARY AND DEVIATION PASS") {

				loadReceivingQualityReport(newPage);

			}
		}


		lastSequenceNumber = (newPage - 1) * 10 + 1; // Reset sequence number for the new page, always starting from 1
		lastPage = newPage;

	}


	$(document).on("change", "#pageSelect", function() {
		var selectedPage = parseInt($(this).val());
		handlePageChange(selectedPage);
	});
	//	$(document).on("click", "#pageSelect", function() {
	//		var selectedPage = parseInt($(this).val());
	//		handlePageChange(selectedPage);
	//	});


	$(document).on("click", "#previous", function() {
		var selectedPage = parseInt($("#pageSelect").val());
		if (selectedPage > 0) {
			handlePageChange(selectedPage - 1);
		}
	});


	$(document).on("click", "#next", function() {
		var selectedPage = parseInt($("#pageSelect").val());
		var totalPages = parseInt($("#pageSelect option:last").val());
		if (selectedPage < totalPages) {
			handlePageChange(selectedPage + 1);
		}
	});
});


$(document).on('click', '#searchButton', function(e) {

	var text = $("#masterHeading").text();

	if (text == "QUALITY RESULT SUMMARY AND DEVIATION PASS") {
		var page = 0;
		loadReceivingQualityReport(page);

	}
});



function getAllPartNumberInList() {
	$.ajax({
		url: "/WebApplication/oids/getAllPartNumberInList",
		type: 'GET',
		contentType: "application/json", headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		async: false,
		dataType: 'json',
		success: function(res) {

			for (var i = 0; i < res.length; i++) {
				var str = res[i];
				var id_fgpart = str.split(',');

				for (var j = 0; j < id_fgpart.length - 1; j++) {
					var row = '<option value="' + id_fgpart[j + 1] + '">' + id_fgpart[j + 1] + '</option>';
					var row2 = '<option value="' + id_fgpart[j + 1] + '">';
					$('#input1').append(row);
					$('#input2_2').append(row2);
				}
			}
		}
	});
}






$(document).ready(function() {

	$(document).on('click', '#qualityResultSummaryAndDeviationPass', function() {

		searchLoad = false;

		$(".fromTo").css("display", "block");
		$("#pageSelect").css("display", "block");
		$("#next").css("display", "block");
		$("#previous").css("display", "block");
		$("#ConnectButton").css("display", "none");
		$("#offcanvasCloseButton").click();

		var child1 = document.getElementById("div3");

		child1.remove();

		document.getElementById("masterHeading").innerText = "";
		$("#masterHeading").append("QUALITY RESULT SUMMARY AND DEVIATION PASS");

		var div3 = document.createElement("div");

		$("#div2").append(div3);

		div3.setAttribute("id", "div3");
		div3.setAttribute("class", "masterBody emptyContainer");


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
		var element4_1 = document.createElement("th");
		element4_1.innerText = "Description";
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


		element1_2.append(element2, element3, element3_2, element4, element4_1, element5, element5_1, element6, element6_3, element7, element8, element8_2);
		element2.setAttribute("class", "tableheading");
		// element2.setAttribute("scope","col");
		element3.setAttribute("class", "tableheading");
		// element3.setAttribute("scope","col");
		element3_2.setAttribute("class", "tableheading");
		// element3.setAttribute("scope","col");
		element4.setAttribute("class", "tableheading");
		element4_1.setAttribute("class", "tableheading");
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
		url: "/WebApplication/Controllers/getReceivingQualityResult/" + page,
		type: 'POST',
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		data: JSON.stringify(formdata),
		success: function(response) {

			makePagerByTotalPages(response, page)
			insertrqcresiltInTable(response.content);
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

function insertrqcresiltInTable($item) {

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
			'<td data-column="description" style="width:100px;">' + value.description + '</td>' +
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




$(document).ready(function() {
	$(document).on('dblclick', '#table1 tbody tr', function() {

		var rowData = {};
		$(this).find('td').each(function() {
			var columnName = $(this).data('column');
			var columnValue = $(this).text();
			rowData[columnName] = columnValue;
		});



		var partNumber = rowData['partNumber'];
		var batchCode = rowData['batchCode'];
		var result = rowData['result'];
		var failQty = rowData['failQty'];
		rqcResultId = rowData['rqcResultId'];
		console.log("rowData::", rowData)
		console.log("Rqc Result ID::", rqcResultId);
		var qty = rowData['qty'];
		$("#partNumber").val(partNumber);
		$("#batchCode").val(batchCode);
		$("#qty").val(qty);
		$("#failQty").val(failQty);

		if (result == "FAIL" || result == "DEVIATION-PASS") {
			$("#fillModal").modal("show");
		}

	});
});

// was for deviation which was there previously but now hidden not used, that screen not used here.
$(document).on('click', '#submitform', function(e) {

	e.preventDefault();
	var partNumber = $("#partNumber").val();
	var batchCode = $("#batchCode").val();
	var deviation = $('#deviation :selected').val();
	var deviationQty = parseInt($("#deviationQty").val());
	var qty = parseInt($("#qty").val());
	var remark = $("#remark").val();
	var failQty = parseInt($("#failQty").val());
	var createdBy = sessionStorage.getItem('employeeId');

	var formData = {
		rqcResultId: rqcResultId,
		partNumber: partNumber,
		batchCode: batchCode,
		result: deviation,
		deviationQty: deviationQty,
		qty: qty,
		remarks: remark,
		failQty: failQty,
		createdBy: createdBy
	};

	console.log(formData);

	if (deviationQty <= failQty) {
		$.ajax({
			type: 'POST',
			url: "/WebApplication/Controllers/updateRqcData",
			contentType: "application/json",
			headers: {
				Authorization: `Bearer ${sessionStorage.getItem('token')}`
			},
			data: JSON.stringify(formData),
			success: function(data) {

				loadReceivingQualityReport(0);
				$("#fillModal").modal("hide");
			},
			error: function(xhr, status, error) {
				console.error(xhr.responseText);
			}
		});
	} else {
		alert("PassQty is Greater Than Qty");
	}
});




function loadrqclikeMasterData(partNumber, batchCode, result) {

	var partNumber = $('input[title="searchPartNumber"]').val() ?? "";
	var batchCode = $('input[title="searchBatchCode"]').val() ?? "";
	var result = $('input[title="searchResult"]').val() ?? "";

	var formdata = {
		partNumber: partNumber,
		batchCode: batchCode,
		result: result
	}
	$.ajax({
		url: "/WebApplication/Controllers/find",
		type: 'POST',
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		data: JSON.stringify(formdata),
		success: function(response) {

			insertrqcresiltInTable(response);
		},
		error: function(xhr, status, error) {
			console.error(xhr.responseText);
			alert("Error: Unable to fetch data");
		}
	});
}









/*
function fetchLargestSamplingPlanonly(partNumber) { // different from fetchLargestSamplingPlan() here async: false + it return value
	console.log("last fetchLargestSamplingPlanonly() function used");
	var largestSamplingPlan;

	// browser waits until AJAX is complete before continuing.
	
	$.ajax({
		url: "/WebApplication/Controllers/fetchLargestSamplingPlan/" + partNumber,
		type: 'GET',
		async: false,  // synchronous
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		data: { partNumber: partNumber },
		success: function(data) {
				// Returns the value directly.
			largestSamplingPlan = data;
		},
		error: function(xhr, textStatus, errorThrown) {
			console.error("Error fetching largestSamplingPlan:", xhr, textStatus, errorThrown);
			alert("Error fetching largestSamplingPlan");
		}
	});

	return largestSamplingPlan; // Returns the value directly.
}
*/


// above one
/*function appendQualityDataToTable(data) {
	var tableBody = $("#tbody3");
	tableBody.empty();
	var largestSamplingPlan = fetchLargestSamplingPlanonly(splan);




	$.each(data, function(index, row) {
		var selectedRow = tableBody.find('tr[data-qualityid="' + row.qualityId + '"]');
		if (selectedRow.length === 0) {
			var newRow = '<tr class="tableDataRows" data-qualityid="' + row.qualityId + '">' +
				'<td data-column="columnId" style="20px">' + (1 + parseInt(index)) + '</td>' +
				'<td data-column="inspectionItem" style="250px">' + row.inspectionItem + '</td>' +
				'<td data-column="criteria" style="30px">' + row.criteria + '</td>' +
				'<td data-column="min" style="30px">' + row.min + '</td>' +
				'<td data-column="max" style="30px">' + row.max + '</td>' +
				'<td data-column="inspectionMethod" style="50px">' + row.inspectionMethod + '</td>' +
				'<td data-column="inspectionTool" style="50px">' + row.instrument.instrumentName + '</td>' +
				'<td data-column="samplingPlain" style="50px">' + row.samplingPlan + '</td>' +
				'<td data-column="qualityId" style="display:none;">' + row.qualityId + '</td>'


			for (var i = 1; i <= largestSamplingPlan; i++) {
				newRow += '<td data-column="s' + i + '"></td>';
			}
			newRow += '<td data-column="status" style="background-color:yellow;color:yellow">' + + '</td>';

			newRow += '</tr>';
			tableBody.append(newRow);
		}

		// Update the row data
		selectedRow = tableBody.find('tr[data-qualityid="' + row.qualityId + '"]');
		selectedRow.find('td[data-column="columnId"]').text(1 + parseInt(index));
		selectedRow.find('td[data-column="inspectionItem"]').text(row.inspectionItem);
		selectedRow.find('td[data-column="criteria"]').text(row.criteria);
		selectedRow.find('td[data-column="min"]').text(row.min);
		selectedRow.find('td[data-column="max"]').text(row.max);
		selectedRow.find('td[data-column="inspectionMethod"]').text(row.inspectionMethod);
		selectedRow.find('td[data-column="inspectionTool"]').text(row.instrument.instrumentName);
		selectedRow.find('td[data-column="samplingPlain"]').text(row.samplingPlan);
		selectedRow.find('td[data-column="status"]').text(row.status);
		selectedRow.find('td[data-column="qualityId"]').text(row.qualityId);

		for (var i = 1; i <= largestSamplingPlan; i++) {
			selectedRow.find('td[data-column="s' + i + '"]').text(row['s' + i]);
		}
		var span = $("<span></span>").text(data[0].revNumber).css({
			color: "black",
			marginRight: "width:50px;",
			display: "inline-block",
			width: "80%",
		});

		$("#revNumberContainer").empty().append(span);


		var span = $("<span></span>").text(data[0].mispNumber).css({
			color: "black",
			marginRight: "width:50px;",
			display: "inline-block",
			width: "80%",
		});

		$("#mispNumberContainer").empty().append(span);;

		$("#resultid").css("background-color", "yellow");
	});
	fetchBomData($("#mispNumberContainer").text());


}
*/



// written twice in code so use last one as it will be overriden
/*function fetchLargestSamplingPlanonly(partNumber) {  // this not used, last one is used
	console.log("first fetchLargestSamplingPlanonly() used");
	var largestSamplingPlan;

	$.ajax({
		url: "/WebApplication/Controllers/fetchLargestSamplingPlan/" + partNumber,
		type: 'GET',
		async: false,
		data: { partNumber: partNumber },
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(data) {

			largestSamplingPlan = data;
		},
		error: function(xhr, textStatus, errorThrown) {
			console.error("Error fetching largestSamplingPlan:", xhr, textStatus, errorThrown);
			alert("Error fetching largestSamplingPlan");
		}
	});

	return largestSamplingPlan;
}*/


//var result = fetchLargestSamplingPlanonly();


/*function handleBarcodeScanning(barcode) {
	var barcodeParts = barcode.split(' ');
	var focusedInput = $("input:focus").attr('id');

	if (focusedInput === 'input1') {

		if (barcodeParts.length < 2) {
			alert('Invalid barcode for part number and supplier name');
			return;
		}

		var partCode = barcodeParts[0].trim();
		var supplierName = barcodeParts.slice(1).join(' ').trim();

		if (partCode === '' || supplierName === '') {
			alert('Please provide part number and supplier name');
			return;
		}

	    
		$.ajax({
			url: '/WebApplication/Controllers/failed', 
			method: 'GET',
			data: {
				partNumber: partCode,
				supplier: supplierName,
				result: 'fail'
			},
			headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
			success: function (data) {
				console.log("data:: ",data);
				let now = new Date();
				let shouldBlock = false;

				for (let item of data) {
					let actionTaken = item.actionTaken || '';
					let remarks = item.remarks || '';
					let datetime = new Date(item.datetime);

					let daysDiff = (now - datetime) / (1000 * 60 * 60 * 24);

					if (!actionTaken.trim() && !remarks.trim() && daysDiff > 15) {
						shouldBlock = true;
						break;
					}
				}

				if (shouldBlock) {
					alert("This part number and supplier cannot be scanned. Action pending over 15 days.");
					return;
				}

				// Otherwise proceed
				$('#input1').val(barcode).prop('disabled', true);
				$('#partNo').text(partCode);
				$('#supplierdiv').text(supplierName);
				$('#input3').prop('disabled', false).focus();
			},
			error: function (xhr, status, error) {
				alert("Error fetching RQC Results: " + error);
			}
		});

	} else if (focusedInput === 'input3') {

		if (barcodeParts.length < 2) {
			alert('Invalid barcode for batch and quantity');
			return;
		}

		var batchCode = barcodeParts[0].trim();
		var quantity = barcodeParts[1].trim();

		$('#input3').val(batchCode);
		var span = $("<span></span>").text(quantity).css({
			color: "black",
			display: "inline-block",
			width: "80%"
		});
		$("#quantity").empty().append(span);

		onPartNumberBarcodeChange();
		$('#input3').prop('disabled', true);
	}
}
*/

// repeated function code below same name function will run, this will not work
/*
function appendQualityReadingDataToTable(data) {// this will not work

	var tableBody = $('<tbody>');

	$("#table5 tbody").remove();


	if ($("#table5 thead").length === 0) {
		var tableHeader = '<thead><tr>' +
			'<th style="width:30px">S.No</th>' +
			'<th style="width:110px">Part Number</th>' +
			'<th style="width:110px">Batch Code</th>' +
			'<th style="width:110px">Inspection Item</th>' +
			'<th style="width:50px">Criteria</th>' +
			'<th style="width:50px">Min</th>' +
			'<th style="width:50px">Max</th>' +
			'<th style="width:110px">Inspection Method</th>' +
			'<th style="width:110px">Inspection Tool</th>' +
			'<th style="width:110px">Sampling Plan</th>' +
			'<th style="width:50px">S1</th>' +
			'<th style="width:50px">S2</th>' +
			'<th style="width:50px">S3</th>' +
			'<th style="width:50px">S4</th>' +
			'<th style="width:50px">S5</th>' +
			'<th style="width:50px">S6</th>' +
			'<th style="width:50px">S7</th>' +
			'<th style="width:50px">S8</th>' +
			'<th style="width:50px">S9</th>' +
			'<th style="width:50px">S10</th>' +
			'<th style="width:50px">S11</th>' +
			'<th style="width:50px">S12</th>' +
			'<th style="width:50px">S13</th>' +
			'<th style="width:50px">S14</th>' +
			'<th style="width:50px">S15</th>' +
			'<th style="width:50px">S16</th>' +
			'<th style="width:50px">S17</th>' +
			'<th style="width:50px">S18</th>' +
			'<th style="width:50px">S19</th>' +
			'<th style="width:50px">S20</th>' +
			'<th>Status</th>' +
			'<th style="width:80px">CreatedBy</th>' +
			'<th>DateTime</th>' +
			'<th style="display:none">qualityReadingId</th>' +
			'</tr></thead>';
		$("#table5").append(tableHeader);
	}


	$.each(data, function(index, value) {
		var statusColor = value.status === "PASS" ? "green" : "red";
		var statusText = value.status.charAt(0).toUpperCase() + value.status.slice(1);
		var statusStyle = 'background-color: ' + statusColor + ';';
		var row = '<tr class="tableDataRows">' +
			'<td data-column="columnId" style="width:30px">' + (1 + parseInt(index)) + '</td>' +
			'<td data-column="partNumber" style="width:110px">' + value.partNumber + '</td>' +
			'<td data-column="batchCode" style="width:110px" >' + value.batchCode + '</td>' +
			'<td data-column="inspectionItem" style="text-align:left; padding-left:5px; width:110px">' + value.quality.inspectionItem + '</td>' +
			'<td data-column="criteria" style="width:50px">' + value.quality.criteria + '</td>' +
			'<td data-column="min" style="width:50px">' + value.quality.min + '</td>' +
			'<td data-column="max" style="width:50px">' + value.quality.max + '</td>' +
			'<td data-column="inspectionMethod" style="width:110px">' + value.inspectionMethod + '</td>' +
			'<td data-column="inspectionTool" style="width:110px">' + value.quality.instrument.instrumentName + '</td>' +
			'<td data-column="samplingPlain" style="width:110px">' + value.quality.samplingPlan + '</td>' +
			'<td data-column="s1" style="width:50px">' + value.s1 + '</td>' +
			'<td data-column="s2" style="width:50px">' + value.s2 + '</td>' +
			'<td data-column="s3" style="width:50px">' + value.s3 + '</td>' +
			'<td data-column="s4" style="width:50px">' + value.s4 + '</td>' +
			'<td data-column="s5" style="width:50px">' + value.s5 + '</td>' +
			'<td data-column="s6" style="width:50px">' + value.s6 + '</td>' +
			'<td data-column="s7" style="width:50px">' + value.s7 + '</td>' +
			'<td data-column="s8" style="width:50px">' + value.s8 + '</td>' +
			'<td data-column="s9" style="width:50px">' + value.s9 + '</td>' +
			'<td data-column="s10" style="width:50px">' + value.s10 + '</td>' +
			'<td data-column="s11" style="width:50px">' + value.s11 + '</td>' +
			'<td data-column="s12" style="width:50px">' + value.s12 + '</td>' +
			'<td data-column="s13" style="width:50px">' + value.s13 + '</td>' +
			'<td data-column="s14" style="width:50px">' + value.s14 + '</td>' +
			'<td data-column="s15" style="width:50px">' + value.s15 + '</td>' +
			'<td data-column="s16" style="width:50px">' + value.s16 + '</td>' +
			'<td data-column="s17" style="width:50px">' + value.s17 + '</td>' +
			'<td data-column="s18" style="width:50px">' + value.s18 + '</td>' +
			'<td data-column="s19" style="width:50px">' + value.s19 + '</td>' +
			'<td data-column="s20" style="width:50px">' + value.s20 + '</td>' +
			'<td data-column="status" style="width:150px; ' + statusStyle + '">' + statusText + '</td>' +
			'<td data-column="createdBy" style="width:80px">' + value.createdBy + '</td>' +
			'<td data-column="dateTime" >' + value.date_time + '</td>' +
			'<td data-column="qualityReadingId" style="display:none">' + value.qualityReadingId + '</td>' +
			'</tr>';

		tableBody.append(row);
	});

	$("#table5").append(tableBody);
}
*/


// written twice in code so use last one as this one will be overriden
/*
function loadQualityReadingMasterExistData(partNumber, batchCode) { // not used
	console.log(" funtion at top loadQualityReadingMasterExistData()");

	var url = "/WebApplication/Controllers/getData?partNumber=" + encodeURIComponent(partNumber) + "&batchCode=" + encodeURIComponent(batchCode);
	$.ajax({
		url: url,
		type: 'GET',
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		success: function(response) {
			
			console.log("response : ",response);


			appendQualityReadingDataToTable(response);
			// $('#fillModal').modal('show');
			$('#visualModal').modal('show');
		},
		error: function(xhr, status, error) {
			console.error(xhr.responseText);
			alert("Error: Unable to fetch data");
		}
	});
}*/



/*function resetQualityReadingDetails() {
	$("#input1").val("");
	$("#input2").val("");
}


function handleBarcodeScanning(barcode) {
	var barcodeParts = barcode.split(' ');

	var partCode = barcodeParts[0].trim();
	var batchCode = barcodeParts[1].trim();
	var quantity = barcodeParts[2].trim();

	var focusedInput = $("input:focus").attr('id');

	// Check if any of the values are empty
	if (partCode === '') {
		alert('Please fill all input fields');
		return;
	}

	if (focusedInput === 'input1') {
		$('#input1').val(partCode);
		$('#input3').val(batchCode);
		var span = $("<span></span>").text(quantity).css({
			color: "black",
			marginRight: "width:50px;",
			display: "inline-block",
			width: "80%",
		});

		$("#quantity").empty().append(span);


	}

	onPartNumberBarcodeChange();
}


$(document).on('keydown', '#input1', function(e) {
	if (e.key === "Enter") {
		e.preventDefault();
		var barcodeValue = $(this).val();
		handleBarcodeScanning(barcodeValue);
	}
});
*/





/*				///////		never used	currently may be for another master			////////					*/
// never used any where can comment it out
function fetchData2(partNumber) {
	$.ajax({
		url: "/WebApplication/Controllers/checkPartNumberinreading/" + partNumber,
		type: 'POST',
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		data: { "partNumber": partNumber },
		dataType: 'json',
		success: function(res) {

			insertQualityReadingMasterInTable(res);
			resetQualityReadingDetails();
		},
		error: function(xhr, status, error) {
			console.error(xhr.responseText);
			alert("Error: Unable to fetch data");
		}
	});
}


// never used any where can comment it out
function loadQualityReadingMasterData(partNumber, batchCode) {
	var formdata = {
		partNumber: partNumber,
		batchCode: batchCode
	}
	$.ajax({
		url: "/WebApplication/Controllers/getDataa",
		type: 'POST',
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		data: JSON.stringify(formdata),
		success: function(response) {

			insertQualityReadingMasterInTable(response);
		},
		error: function(xhr, status, error) {
			console.error(xhr.responseText);
			alert("Error: Unable to fetch data");
		}
	});
}


// never used any where can comment it out
function loadAllQualityReadingMasterData() {
	$.ajax({
		url: "/WebApplication/Controllers/allreadingDetails1",
		type: 'GET',
		contentType: "application/json",
		headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
		dataType: 'json',
		success: function(response) {


			insertQualityReadingMasterInTable(response);
			resetQualityReadingDetails();

		},
		error: function(xhr, status, error) {
			console.error(xhr.responseText);
			alert("Error: Unable to fetch data");
		}
	});
}

// not used because where ever it is called there those function itself are never called. can comment it out
function insertQualityReadingMasterInTable($item) {
	$("#tableBody").remove();
	var tablebody = document.createElement("tbody");
	$("#table1").append(tablebody);

	tablebody.setAttribute("id", "tbody3");

	$.each($item, function(index, value) {
		var row = value;


		Object.keys(row).forEach(function(key) {
			if (row[key] === null) {
				row[key] = 'N/A';
			}
		});
		var statusColor = value.status === "PASS" ? "green" : "red";
		var statusText = value.status.charAt(0).toUpperCase() + value.status.slice(1);
		var statusStyle = 'background-color: ' + statusColor + ';';
		row = '<tr class="tableDataRows">' +
			'<td data-column="columnId" style="width:20px;border:1px solid black !important;">' + (1 + parseInt(index)) + '</td>' +
			'<td data-column="partNumber" style="width:100px;border:1px solid black  !important;">' + value.partNumber + '</td>' +
			'<td data-column="batchCode" style="width:80px;border:1px solid black  !important;">' + value.batchCode + '</td>' +
			'<td data-column="inspectionItem" style="width:100px;border:1px solid black  !important;">' + value.quality.inspectionItem + '</td>' +
			'<td data-column="criteria" style="width:80px;border:1px solid black  !important;">' + value.quality.criteria + '</td>' +
			'<td data-column="min" style="width:80px;border:1px solid black  !important;">' + value.quality.min + '</td>' +
			'<td data-column="max" style="width:80px;border:1px solid black  !important;">' + value.quality.max + '</td>' +
			'<td data-column="inspectionMethod" style="width:80px;border:1px solid black  !important;">' + value.inspectionMethod + '</td>' +
			'<td data-column="inspectionTool" style="width:80px;border:1px solid black  !important;">' + value.quality.instrument.instrumentName + '</td>' +
			'<td data-column="samplingPlain" style="width:80px;border:1px solid black  !important;">' + value.quality.samplingPlan + '</td>' +
			'<td data-column="s1" style="width:80px;border:1px solid black  !important;">' + value.s1 + '</td>' +
			'<td data-column="s2" style="width:80px;border:1px solid black  !important;">' + value.s2 + '</td>' +
			'<td data-column="s3" style="width:80px;border:1px solid black  !important;">' + value.s3 + '</td>' +
			'<td data-column="s4" style="width:80px;border:1px solid black  !important;">' + value.s4 + '</td>' +
			'<td data-column="s5" style="width:80px;border:1px solid black  !important;">' + value.s5 + '</td>' +
			'<td data-column="s6" style="width:80px;border:1px solid black  !important;">' + value.s6 + '</td>' +
			'<td data-column="s7" style="width:80px;border:1px solid black  !important;">' + value.s7 + '</td>' +
			'<td data-column="s8" style="width:80px;border:1px solid black  !important;">' + value.s8 + '</td>' +
			'<td data-column="s9" style="width:80px;border:1px solid black  !important;">' + value.s9 + '</td>' +
			'<td data-column="s10" style="width:80px;border:1px solid black  !important;">' + value.s10 + '</td>' +
			'<td data-column="s11" style="width:80px;border:1px solid black  !important;">' + value.s11 + '</td>' +
			'<td data-column="s12" style="width:80px;border:1px solid black  !important;">' + value.s12 + '</td>' +
			'<td data-column="s13" style="width:80px;border:1px solid black  !important;">' + value.s13 + '</td>' +
			'<td data-column="s14" style="width:80px;border:1px solid black  !important;">' + value.s14 + '</td>' +
			'<td data-column="s15" style="width:80px;border:1px solid black  !important;">' + value.s15 + '</td>' +
			'<td data-column="s16" style="width:80px;border:1px solid black  !important;">' + value.s16 + '</td>' +
			'<td data-column="s17" style="width:80px;border:1px solid black  !important;">' + value.s17 + '</td>' +
			'<td data-column="s18" style="width:80px;border:1px solid black  !important;">' + value.s18 + '</td>' +
			'<td data-column="s19" style="width:80px;border:1px solid black  !important;">' + value.s19 + '</td>' +
			'<td data-column="s20" style="width:80px;border:1px solid black  !important;">' + value.s20 + '</td>' +
			'<td data-column="quantity" style="width:80px;border:1px solid black  !important;">' + value.quantity + '</td>' +
			'<td data-column="status" style="width:150px; ' + statusStyle + '">' + statusText + '</td>' +
			'<td data-column="createdBy" style="width:80px;border:1px solid black  !important;">' + value.createdBy + '</td>' +
			'<td data-column="dateTime" style="width:100px;border:1px solid black  !important;">' + value.date_time + '</td>' +
			'<td data-column="qualityId" style="display:none;;border:1px solid black ">' + value.qualityReadingId + '</td>' +
			'</tr>';

		$('#table1').append(row);
	});

}



// never used any where can comment it out
function createTableHeader(text, className) {
	var th = document.createElement("th");
	th.innerText = text;
	th.setAttribute("class", className);
	return th;
}


/* ======= EDIT FEATURE ADD-ON (paste at END of your existing JS file) ======= */

/*
  How it works (short):
  - A MutationObserver watches #tbody3 and injects an "Edit" button cell for rows that don't already have it.
  - Clicking Edit turns the row's disabled/display inputs into editable controls (prefilled),
    inserts Save + Cancel buttons (Save uses existing confirmbutton IDs so your existing handlers work),
    and sets the global selectedRow variable (as your save handlers expect).
  - Cancel re-fetches that single quality reading (via existing fetchQualityReadingData) to restore view.
*/

(function() {
  // safety checks
  if (typeof $ === 'undefined') {
    console.warn("jQuery required for edit-addon. This script will not run without jQuery.");
    return;
  }

  // Map inspection method => confirm button id used in your file
  const confirmIdMap = {
    visual: 'confirmbutton',
    manual: 'confirmbutton',
    measure: 'confirmbutton2',
    calendar: 'confirmbutton4',
    cavity: 'confirmbutton5',
    counting: 'confirmbutton3'
  };

  // Utility: read existing values in a td cell (supports disabled <input> created by your append function,
  // or plain text). Returns array of values (one per dimension).
  function readCellExistingValues(td) {
    const values = [];
    // find existing input elements (the saved row created <input disabled value="...">)
    const inputs = td.find('input');
    if (inputs.length) {
      inputs.each(function() {
        values.push($(this).val() ?? '');
      });
      return values;
    }
    // else fallback to plain text (if any). If multiple dimensions exist in text, attempt basic split.
    const txt = td.text().trim();
    if (!txt) return values;
    // Try splitting by common separators (comma / space / |) — fallback is single value
    if (txt.indexOf(',') !== -1) return txt.split(',').map(s => s.trim());
    if (txt.indexOf('|') !== -1) return txt.split('|').map(s => s.trim());
    // else single value
    values.push(txt);
    return values;
  }

  // Convert a saved/display cell into editable controls (prefilled),
  // according to inspectionMethod and dimension count.
  function convertCellToEditable(td, inspectionMethod, sampleNo, multiDim) {
    const existingValues = readCellExistingValues(td);
    td.empty();

    for (let d = 1; d <= multiDim; d++) {
      const existingValue = existingValues[d - 1] ?? '';

      if (inspectionMethod === 'visual' || inspectionMethod === 'manual') {
        // create <select> OK / NG
        const select = $('<select>')
          .attr('name', `s${sampleNo}_d${d}`)
          .css({ 'height': '20px', 'margin': '2px', 'min-width': '35px' });
        select.append($('<option>').val('').text(''));
        select.append($('<option>').val('OK').text('OK'));
        select.append($('<option>').val('NG').text('NG'));
        if (existingValue && (existingValue.toUpperCase() === 'OK' || existingValue.toUpperCase() === 'NG')) {
          select.val(existingValue.toUpperCase());
        }
        td.append(select);

      } else if (inspectionMethod === 'measure' || inspectionMethod === 'counting') {
        const inp = $('<input>')
          .attr('type', 'number')
          .attr('name', `s${sampleNo}_d${d}`)
          .css({ width: '65px', height: '25px', margin: '2px' })
          .val(existingValue);
        td.append(inp);

      } else if (inspectionMethod === 'calendar') {
        const inp = $('<input>')
          .attr('type', 'month')
          .attr('name', `s${sampleNo}_d${d}`)
          .css({ height: '20px', margin: '2px', 'min-width': '50px' })
          .val(existingValue);
        td.append(inp);

      } else if (inspectionMethod === 'cavity') {
        const inp = $('<input>')
          .attr('type', 'text')
          .attr('name', `s${sampleNo}_d${d}`)
          .css({ width: '50px', height: '25px', margin: '2px' })
          .val(existingValue);
        td.append(inp);

      } else {
        // default text input
        const inp = $('<input>')
          .attr('type', 'text')
          .attr('name', `s${sampleNo}_d${d}`)
          .css({ margin: '2px', minWidth: '50px' })
          .val(existingValue);
        td.append(inp);
      }
    }
  }

  // When user clicks Edit we use this to open the row for editing.
  function openRowForEditing($row) {
    if (window.inputOpen) {
      alert('Another input is open. Please save or cancel it first.');
      return;
    }

    window.selectedRow = $row; // your existing handlers expect this global var

    const inspectionMethodRaw = String($row.find("td[data-column='inspectionMethod']").text() || '').trim();
    const inspectionMethod = inspectionMethodRaw.toLowerCase();
    const samplingPlanStr = $row.find("td[data-column='samplingPlain']").text() || $row.find("td[data-column='samplingPlan']").text();
    const samplingPlan = parseInt((samplingPlanStr || '0').trim()) || 0;
    const multiDim = parseInt($row.find("td[data-column='multiDimensionValue']").text().trim()) || 1;

    if (!samplingPlan) {
      // fallback: try to detect number of sample sX cells present
      let detected = 0;
      $row.find("td").each(function() {
        const dc = $(this).attr('data-column') || '';
        const m = dc.match(/^s(\d+)$/);
        if (m) detected = Math.max(detected, parseInt(m[1]));
      });
      if (detected > 0) samplingPlan = detected;
    }

    // Convert each sample cell to editable inputs (prefilled)
    for (let i = 1; i <= samplingPlan; i++) {
      const td = $row.find(`td[data-column='s${i}']`);
      if (!td || td.length === 0) continue;
      convertCellToEditable(td, inspectionMethod, i, multiDim);
    }

    // Remove any existing action cell we added before
    $row.find('td.__action_edit').remove();

    // Create action td (Save + Cancel). Save button gets appropriate confirm id so existing handlers run.
    const actionTd = $('<td>').addClass('__action_edit savebutton'); // class name intersects with your existing removal $(".savebutton").remove()
    const saveBtnId = confirmIdMap[inspectionMethod] || 'confirmbutton2'; // safe fallback
    const saveBtn = $('<button>')
      .attr('id', saveBtnId)
      .addClass('savebutton__inner') // separate from td.savebutton
      .text('Save')
      .css({ color: 'white', 'background-color': 'black', padding: '4px 8px', border: 'none', cursor: 'pointer' });

    const cancelBtn = $('<button>')
      .addClass('cancelbutton__inner')
      .text('Cancel')
      .css({ color: 'black', 'background-color': '#ddd', marginLeft: '6px', padding: '4px 8px', border: 'none', cursor: 'pointer' });

    actionTd.append(saveBtn).append(cancelBtn);

    // Insert actionTd after status cell (but before the hidden qualityId cell if present)
    const qidCell = $row.find("td[data-column='qualityId']");
    if (qidCell.length) qidCell.before(actionTd);
    else $row.append(actionTd);

    // set global flag
    window.inputOpen = true;
  }

  // Cancel handler: fetch the saved reading again (re-renders row via existing function),
  // remove temp action cell and reset inputOpen.
  $(document).on('click', '.cancelbutton__inner', function(e) {
    e.preventDefault();
    const $btn = $(this);
    const $row = $btn.closest('tr');
    const qualityId = $row.data('qualityid') || $row.find("td[data-column='qualityId']").text().trim();
    const batchCode = $('#input3').val();

    // Remove temporary action cell immediately so user sees revert
    $row.find('td.__action_edit').remove();
    window.inputOpen = false;

    // If we have a qualityId, re-fetch from backend and re-render that row via your existing function
    if (qualityId) {
      try {
        if (typeof fetchQualityReadingData === 'function') {
          fetchQualityReadingData(qualityId, batchCode);
        } else {
          // fallback: just reload whole set if function missing
          console.warn('fetchQualityReadingData not found; cannot re-fetch row. You may need to refresh page.');
        }
      } catch (err) {
        console.error(err);
      }
    }
  });

  // Edit button click -> open row for editing
  $(document).on('click', '.editbtn__injected', function(e) {
    e.preventDefault();
    const $btn = $(this);
    const $row = $btn.closest('tr');

    openRowForEditing($row);

    // focus first input/select if found
    setTimeout(() => {
      const firstInp = $row.find('select, input').first();
      if (firstInp && firstInp.length) firstInp.focus();
    }, 50);
  });

  // MutationObserver callback: when rows are added/changed in #tbody3, inject Edit buttons
  function injectEditButtonsForRow($row) {
    // don't inject into header, or rows that already have our edit button
    if (!$row || !$row.length) return;
    if ($row.find('.editbtn__injected').length) return;

    // Only inject for data rows (having data-qualityid or a status cell)
    const qid = $row.attr('data-qualityid') || $row.find("td[data-column='qualityId']").text().trim();
    // Only inject for rows that appear to be the rendered reading rows (they have input[data-quality-id] or status cell)
    // We'll be permissive and inject into any tr with a status td
    if ($row.find("td[data-column='status']").length === 0) return;

    // Create edit button cell
    const editTd = $('<td>').addClass('actionCell__injected');
    const editBtn = $('<button>')
      .addClass('editbtn__injected')
      .text('Edit')
      .css({ color: 'white', 'background-color': 'black', padding: '4px 8px', border: 'none', cursor: 'pointer' });

    editTd.append(editBtn);

    // Insert before qualityId cell if present, else append at end
    const qidCell = $row.find("td[data-column='qualityId']");
    if (qidCell.length) qidCell.before(editTd);
    else $row.append(editTd);
  }

  // observe tbody for newly rendered rows; your appendQualityReadingDataToTable replaces/updates rows
  const target = document.getElementById('tbody3');
  if (target) {
    const mo = new MutationObserver(function(mutations) {
      mutations.forEach(function(m) {
        // if nodes added
        if (m.addedNodes && m.addedNodes.length) {
          $(m.addedNodes).each(function() {
            if (this.nodeType === 1 && this.tagName.toLowerCase() === 'tr') {
              injectEditButtonsForRow($(this));
            } else if (this.nodeType === 1) {
              // maybe a wrapper; find trs inside
              $(this).find('tr').each(function() {
                injectEditButtonsForRow($(this));
              });
            }
          });
        }
        // also handle attribute changes (status might be updated)
        if (m.type === 'attributes' && m.target && m.target.tagName && m.target.tagName.toLowerCase() === 'tr') {
          injectEditButtonsForRow($(m.target));
        }
      });
    });

    mo.observe(target, { childList: true, subtree: true, attributes: true });
  } else {
    console.warn("#tbody3 not found; automatic Edit button injection won't run.");
  }

  // Also run a one-time pass (in case table already rendered)
  $(function() {
    $('#tbody3 tr').each(function() {
      injectEditButtonsForRow($(this));
    });
  });

  // Optional: keyboard shortcut to cancel an open edit (Esc)
  $(document).on('keydown', function(e) {
    if (e.key === 'Escape' && window.inputOpen) {
      // find the temp action cell and click its cancel
      const $cancel = $('#tbody3').find('td.__action_edit').find('.cancelbutton__inner').first();
      if ($cancel && $cancel.length) $cancel.click();
    }
  });

  // Clean up: if your existing code removes ".savebutton" elements after saving,
  // the temporary action cell uses class 'savebutton' so it'll be removed automatically.
  // After save your existing success callbacks call fetchQualityReadingData(...) and closeInput() — so that flow remains.
})();

// add near other global vars at top



