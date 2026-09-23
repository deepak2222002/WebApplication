let currentMachineId = null; // Declare globally

// Global variables used across your app
window.lineStationSheetMappingId = injectedLineStationSheetMappingId;// getting from the set value in the html, which set up in WebPageController
window.lineName = injectedLineName;// getting from the set value in the html, which set up in WebPageController
window.stationName = injectedStationName;// getting from the set value in the html, which set up in WebPageController
window.sheetName = injectedSheetName;
window.sheetTabNo = injectedSheetTabNo;
window.resumeMode = resumeModeInjected;

console.log(window.resumeMode, resumeMode)
$(document).ready(function () {
    getToken();

	if (!resumeMode) { // SOP
	checkModelVariant(lineStationSheetMappingId); // 🟢 NEW — Check first
	} else{
			// Proceed with lineStationSheetMappingId
			loadProcessDataSheetUpperFormBody(lineStationSheetMappingId, 1);
			updateInSaveStatusAndFindTotalCounts(lineStationSheetMappingId);
			currentMachineId=lineStationSheetMappingId;
	}
});

function checkModelVariant(mappingId) {
    $.ajax({
        type: "GET",
        url: "/WebApplication/Controllers/pds/checkModelVariant/" + mappingId,
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },

        success: function() {
            // Now page can load safely
			// Proceed with lineStationSheetMappingId
			loadProcessDataSheetUpperFormBody(lineStationSheetMappingId, 1);
			updateInSaveStatusAndFindTotalCounts(lineStationSheetMappingId);
			currentMachineId=lineStationSheetMappingId;
        },

        error: function(xhr) {
            alert("Cannot load SOP because Model or Variant is missing.\n\n" +
                  "Please reopen the Application.");
				  $("input, textarea, select, button, #submitProcessDataSheet").prop("disabled", true);
				  
				  $("#upper_processDataSheet_form_body").html("<div class='text-danger'>Either Model or Variant is not found.</div>");

        }
    });
}

function getToken() {
	const formData = {
		employeeId: "0",
		password: "12345@abc"
	};

	$.ajax({
		type: 'POST',
		url: "/WebApplication/auth/login",
		data: JSON.stringify(formData),
		async: false, // or true with proper callback handling
		contentType: "application/json",
		success: function(response) {
			sessionStorage.setItem('token', response.jwtToken);      // ✅ Store token
			sessionStorage.setItem('employeeId', "111");             // ✅ Store employeeId
		},
		error: function(error) {
			alert("Login failed: " + error.responseText);
		}
	});
}

let allCounts = [];
var globalSavedOperatorName; // global variable

// it updates the status as 0 in excelsavestatus when fresh page opens up
function updateInSaveStatusAndFindTotalCounts(lssId) { // now this also fetched the operator sign
    lineStationSheetMappingId = lssId;

    $.ajax({
        url: `/WebApplication/Controllers/pd/counts/${lssId}?resumeMode=${resumeMode}`,
        method: "GET",
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        success: function (data) {
            allCounts = data.counts;
			console.log(data);
			// Fill operator sign if available
			if (data.operatorName) { // will be set only when /filled is not called means at time of SOP
			    $("#operator-sign1").val(data.operatorName);
				globalSavedOperatorName=data.operatorName;
			}
			
			// 🔹 Disable operator sign fields
			$("#operator-sign1, #operator-sign2, #operator-sign3")
			  .prop("disabled", true)
			  .css({
			    backgroundColor: "#f5f5f5",  // light grey to indicate disabled
			    cursor: "not-allowed"
			  });
			  
        },
        error: function () {
            showResponseModal("Failed to load counts.", false);
        }
    });
}

function loadProcessDataSheetUpperFormBody(lineStationSheetMappingId, countNo) {
  $("#upper_processDataSheet_form_body").empty();
  $.ajax({
    url: "/WebApplication/Controllers/pd/ProcessDataSheetUpperForm/" + lineStationSheetMappingId + "/" + countNo,
    method: "GET",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
    success: function (machine) {
		console.log(machine);
		
      const html = `
	  <div class="container-fluid">
	  <div class="row small-text" style="margin-left: 10px;">

	  <span id="backendLogicalDateTimeText" style="display: none;">${machine.logicalShiftDateTime}</span>
	  
	      <!-- Column 1: First 4 fields -->
	      <div class="col-md-5 small-text">
		  	<input type="hidden" id="countNo" name="countNo" value="${countNo}">
			<input type="hidden" id="pdReqDataId" name="pdReqDataId" value="${machine.pdReqDataId}">
			<input type="hidden" id="lastSavedInputId" value="">
	          <div><strong>PROCESS NAME:</strong> ${machine.station.name || ''}</div>
	          <div><strong>CHECK POINT:</strong> ${machine.checkpoint || ''}</div>
	          <div><strong>SPEC:</strong> ${machine.specification || ''}</div>

			  <div><strong>DATE :</strong> ${machine.currentDate}</div>
			     <div class="d-flex align-items-center">
			  		<div class="col-md-6 small-text">
			  		   <strong>SHIFT :</strong> 
			  		   <span id="shiftDisplay">${machine.shift}</span>
			  		   <input type="hidden" id="shiftInput" name="shift" value="${machine.shift}">
			  	</div>
			  </div>

	      </div>
		  
		  <!-- Column 2: second 4 fields -->
		  <div class="col-md-4 small-text">
		  	<!-- 🔹 Placeholder for Product & Model -->
		   	<div id="productModelRow"><strong>PRODUCT & MODEL NAME:</strong> </div>
		   	<!-- 🔹 Placeholder for Part No. -->
		   	<div id="productPartNoRow"><strong>PRODUCT PART NO.:</strong> </div>

			<div><strong>MEASURING INSTR.:</strong> ${machine.measureInstrument || ''}</div>
			
			<div class="d-flex align-items-center mb-1">
			<strong class="me-2" style="white-space: nowrap;">LINE NO. :</strong>
			<input type="text" id="lineNoInput" class="form-control form-control-sm w-auto" placeholder="Enter Line No." style="max-width: 150px;">
			</div>
		  </div>
		  
	      <!-- Column 3: 3 Inputs -->
	      <div class="col-md-3 small-text">

		  	<div class="d-flex align-items-center mb-1">
		      <strong class="me-2" style="white-space: nowrap;">CONTROL NO. :</strong>
		      <input type="text" id="controlNoInput" class="form-control form-control-sm w-auto" placeholder="Enter Control No." style="max-width: 150px;">
		  	</div>
		  	<div class="d-flex align-items-center mb-1">
		      <strong class="me-2" style="white-space: nowrap;">VALID UPTO :</strong>
		      <input type="date" id="validUptoInput" class="form-control form-control-sm w-auto" style="max-width: 150px;">
		  	</div>
			
			<div class="d-flex align-items-center mb-1">
			<strong class="me-2" style="white-space: nowrap;">JIG NO. :</strong>
			<input type="text" id="jigNoInput" class="form-control form-control-sm w-auto" placeholder="Enter JIG No." style="max-width: 150px;">
			</div>

	      </div>
	  </div>
	  </div>

      `;
	  
	numberSpecsHighlight(machine.specification);
	
		$("#upper_processDataSheet_form_body").html(html);

		// 🔹 Second AJAX call for product details
		if(window.resumeMode === false){ // find the model and variant from the prod_iot other wise if 
		    $.ajax({
		        url: "/WebApplication/Controllers/pd/productDetails/" + lineStationSheetMappingId,
		        method: "GET",
		        headers: {
		            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
		        },
		        success: function (data) {
		            $("#productModelRow").html("<strong>PRODUCT & MODEL NAME:</strong> " + (data.productModel || ''));
		            $("#productPartNoRow").html("<strong>PRODUCT PART NO.:</strong> " + (data.productPartNo || ''));
		        },
		        error: function () {
					alert("Model and variant data not Updated by Labview in Prodiot table");
		            $("#productModelRow").html("<strong>PRODUCT & MODEL NAME:</strong> N/A");
		            $("#productPartNoRow").html("<strong>PRODUCT PART NO.:</strong> N/A");
		        }
		    });
		}
		
			// 🔹 third AJAX call for Fetch last saved user input values
				$.ajax({
				    url: "/WebApplication/Controllers/pd/lastSavedUserInput/" + lineStationSheetMappingId + "/" + countNo,
				    method: "GET",
				    headers: {
				        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
				    },
				    success: function (data) {
				        if (data) {
				            $("#controlNoInput").val(data.controlNo || '').prop("disabled", true);
				            $("#validUptoInput").val(data.validUpTo ? data.validUpTo.split("T")[0] : '').prop("disabled", true); 
				            $("#lineNoInput").val(data.lineNo || '').prop("disabled", true);
				            $("#jigNoInput").val(data.jigNo || '').prop("disabled", true);
				        }
				    },
				    error: function () {
				        console.warn("No previous saved inputs found for this lssId");
						alert("No last time data found for the ");
				    }
				});

			
			// showing dynamic images based on the lssid and count fetched image
		if (machine.imageUrl) {
			const imageUrl = `/WebApplication/Controllers/pd/image/${machine.imageUrl}`;
			$("#machineImage").attr("src", imageUrl);
		} else {
			$("#machineImage").attr("alt", "No image available");
		}
		
		if (window.resumeMode === true) { // fetch all the last filled data for this Lssid and countNo,
			// no matter Model, variant, shift just fetch the last saved data for this Lssid and countNo
			fetchLastFilledData(lineStationSheetMappingId, countNo);// it also make update the model and variant in frontend.

			setTimeout(function() {
			  checkALBorEOPandUpdateOperatorName(lineStationSheetMappingId);
			}, 1200);
			
			// 🔹 Disable all SOP inputs
			$("#sop-input-1, #sop-input-2, #sop-input-3")
			    .prop("disabled", true)
			    .css({
			        backgroundColor: "#f5f5f5",
			        cursor: "not-allowed"
			    });
		}
		
		if (window.resumeMode === false) {  // at time of sop so alb and eop will be disabled.
			// 🔹 Disable operator sign fields
			$("#alb-input-1, #alb-input-2, #eop-input-1, #eop-input-2")
				.prop("disabled", true)
				.css({
					backgroundColor: "#f5f5f5",  // light grey to indicate disabled
					cursor: "not-allowed"
				});
		}
		
		if(countNo>1){ // for the first time at SOP, it is fetched in updateInSaveStatusAndFindTotalCounts() and set in globalSavedOperatorName
			$("#operator-sign1").val(globalSavedOperatorName); // for next counts

			setTimeout(function() {
				// 🔹 Disable operator sign fields
				$("#operator-sign1, #operator-sign2, #operator-sign3")
					.prop("disabled", true)
					.css({
						backgroundColor: "#f5f5f5",  // light grey to indicate disabled
						cursor: "not-allowed"
					});
			}, 1200);
		}
    },
    error: function () {
      $("#upper_processDataSheet_form_body").html("<div class='text-danger'>Excel Mapping data not found.</div>");
    },
  });
}

function fetchLastFilledData(lineStationSheetMappingId, countNo){
	// fetch all the last filled data for this Lssid and countNo,
		// no matter Model, variant, shift jsut fetch the last saved data for this Lssid and countNo
	    $.ajax({
	        url: "/WebApplication/Controllers/pd/lastSavedUserInput/" + lineStationSheetMappingId + "/" + countNo,
	        method: "GET",
	        headers: {
	            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
	        },
	        success: function (data) {
				
	            if (data) {
					$("#lastSavedInputId").val(data.id);  // 👈 store hidden ID  in hidden field in form
					
					$("#productModelRow").html("<strong>PRODUCT & MODEL NAME:</strong> " + (data.model || ''));
					$("#productPartNoRow").html("<strong>PRODUCT PART NO.:</strong> " + (data.variant || ''));
					
	                $("#controlNoInput").val(data.controlNo || '');
	                $("#validUptoInput").val(data.validUpTo ? data.validUpTo.split("T")[0] : '');
	                $("#lineNoInput").val(data.lineNo || '');
	                $("#jigNoInput").val(data.jigNo || '');
	                $("#sop-input-1").val(data.sop1 || '');
	                $("#sop-input-2").val(data.sop2 || '');
	                $("#sop-input-3").val(data.sop3 || '');
	                $("#operator-sign1").val(data.operatorSign1 || '');
	                $("#alb-input-1").val(data.alb1 || '');
	                $("#alb-input-2").val(data.alb2 || '');
	                $("#operator-sign2").val(data.operatorSign2 || '');
	                $("#eop-input-1").val(data.eop1 || '');
	                $("#eop-input-2").val(data.eop2 || '');
	                $("#operator-sign3").val(data.operatorSign3 || '');
	                $("#supervisor-sign").val(data.supervisorSign || '');
					
					// then disable based on actual values
					if ($("#alb-input-1").val() && $("#alb-input-2").val() && $("#operator-sign2").val()) {
					    $("#alb-input-1, #alb-input-2, #operator-sign2")
					        .prop("disabled", true)
					        .css({
					            backgroundColor: "#f5f5f5",
					            cursor: "not-allowed"
					        });
					}
	            }
	        },
	        error: function () {
	            console.warn("No previous saved inputs found for this lssId + countNo");
	        }
	    });
}

// ✅ Function to check ALB/EOP and update operator name
function checkALBorEOPandUpdateOperatorName(lssId) {
    $.ajax({
        url: "/WebApplication/Controllers/pd/checkALBorEOPOperator/" + lssId,
        method: "GET",
		headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}`, },
        success: function(response) {
            console.log("ALB/EOP response:", response);

            // Check if ALB operator is present
            if (response.ALBoperatorName) {
                // 👉 Show ALB operator in your frontend
                $("#operator-sign2").val(response.ALBoperatorName);
			  console.log("hel");
            } 
            // Else check if EOP operator is present
            else if (response.EOPoperatorName) {
                $("#operator-sign3").val(response.EOPoperatorName);
            }

        },
        error: function(xhr) {
            console.error("Error fetching ALB/EOP operator:", xhr);
            alert("Failed to fetch operator info for LSS " + lssId);
        }
    });
}

function showResponseModal(message, isSuccess = true) {
	const container = $("#responseModalBody");
	const icon = $("#responseModalIcon");
	const label = $("#responseModalLabel");
	const $footerCloseBtn = $("#responseModal .modal-footer button");

	$("#nextCountBtn").hide();
	container.html(message); // ✅ renders HTML like <br>

	if (isSuccess) {
		container.css("color", "limegreen");
		icon.hide();
		label.text("Success");
		// Restore top close button if hidden
			$("#responseModalCloseButton").hide();
	} else {
		container.css("color", "red");
		icon.show();
		label.text("Warning");
		
		console.log("uihiu");
		// Restore top close button if hidden
		$("#responseModalCloseButton").show();
		
		$footerCloseBtn.text("Re-check");
		$footerCloseBtn.removeClass("btn-success").addClass("btn-secondary");

		$footerCloseBtn.off("click").on("click", function () {
			$("#responseModal").modal("hide");
		});
	}

	// Trigger the modal to open
	$("#responseModalTriggerButton").click();
}

// this save data in PdSheetUserInput and also add the status in the pd_sheet_data_save_status table
$("#submitProcessDataSheet").click(function () {
	
	if ($(this).attr("data-submitted") === "true") {// will run it for just only in frontend so this not work when page refreshed.
	    alert("This Process Data sheet is already filled.");
	    return;
	}
	
	// taking data from hidden input created in form createMCSFormBody()
	const countNo = $("#upper_processDataSheet_form_body input[name='countNo']").val();
	const shift = $("#upper_processDataSheet_form_body input[name='shift']").val();	

	const logicalShiftDateTime= $('#backendLogicalDateTimeText').text().trim();
	
	const productModel = $("#productModelRow").text().replace("PRODUCT & MODEL NAME:", "").trim();
	const productPartNo = $("#productPartNoRow").text().replace("PRODUCT PART NO.:", "").trim();
	let lastSavedId = null;

	const validUptoVal = $("#validUptoInput").val();
	/*let $validInput = $("#validUptoInput"); // cache selector for reuse

	// ✅ Reset any previous styles
	$validInput.css("border", "1px solid #ccc");
	
	// ✅ date validation
	if (validUptoVal) {
	    const today = new Date();
	    today.setHours(0, 0, 0, 0); // ignore time
	    const validDate = new Date(validUptoVal);

	    if (validDate <= today) {
	        alert("⚠️ Valid Upto date must be greater than today's date.");
			$validInput.css("border", "2px solid red");
	        return false; // ❌ stop saving
	    } else {
		  // ✅ highlight as valid
		   $validInput.css("border", "2px solid green");
		}
	} else {
	    alert("⚠️ Please select a Valid Upto date.");
		$validInput.css("border", "2px solid red");
	    return false; // ❌ stop saving if empty
	}*/
  const inputs = {
	lineStationSheetMapping: { id: currentMachineId },   // 👈 from hidden input
    // machine: { machineId: currentMachineId }, // Required for ManyToOne binding
	processDataSheetReqData: { id: $("#pdReqDataId").val() }, 
    controlNo: $("#controlNoInput").val(),
    validUpTo: validUptoVal,
    lineNo: $("#lineNoInput").val(),
	jigNo: $("#jigNoInput").val(),
	
    sop1: $("#sop-input-1").val(),
    sop2: $("#sop-input-2").val(),
    sop3: $("#sop-input-3").val(),
    operatorSign1: $("#operator-sign1").val(),

    alb1: $("#alb-input-1").val(),
    alb2: $("#alb-input-2").val(),
    operatorSign2: $("#operator-sign2").val(),

    eop1: $("#eop-input-1").val(),
    eop2: $("#eop-input-2").val(),
    operatorSign3: $("#operator-sign3").val(),
    shift: shift,
 //   supervisorSign: $("#supervisor-sign").val(),
	countNo:countNo,
	model: productModel,
	variant: productPartNo,
	logicalShiftDateTime
  };
  
 	let currentCountNo= countNo;
  console.log(inputs);
  
	if(resumeMode){
		 lastSavedId = $("#lastSavedInputId").val();
	}
    console.log("lastSavedId");
	let url = resumeMode
	  ? `/WebApplication/Controllers/pd/savePdSheetUserInput/resume/${lastSavedId}`
	  : `/WebApplication/Controllers/pd/savePdSheetUserInput`;

  $.ajax({
	// this save data in PdSheetUserInput and also add the status in the excelSaveStatus table
    // url: "/WebApplication/Controllers/pd/savePdSheetUserInput", 
	url: url,
    method: "POST",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
    data: JSON.stringify(inputs),
    success: function (response) {
		// fetching is there any next count present for that lssid in pd_sheet_req_data table
		// ✅ After saving, check if next count exists
		  $.ajax({
		      url: "/WebApplication/Controllers/pd/nextCount/" + lineStationSheetMappingId + "/" + currentCountNo,
		      method: "GET",
		      headers: {
		          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
		      },
		      success: function (nextCount) {
		          if (nextCount) {
		              // Show modal with NEXT button
		              showResponseModalWithNext("Sheet Count " + currentCountNo + " saved out of " + allCounts.length + ". Proceed to next sheet ", true, nextCount);
					 
				  } else {
					// ✅ Last sheet filled → trigger finalize API for saving or updating the excelSaveStatusRepo 
					// and prodIotExcelRepository after all counts done
					  let finalizeUrl = resumeMode
					      ? `/WebApplication/Controllers/pd/updateExcelSaveStatusTable/resume/${lineStationSheetMappingId}`
					      : `/WebApplication/Controllers/pd/updateExcelSaveStatusTable/${lineStationSheetMappingId}`;
					$.ajax({
					    url: finalizeUrl,
					    method: "POST",
						contentType: "application/json",
					    headers: {
					        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
					    },
						data: JSON.stringify(inputs),
					    success: function () {
					        showResponseModal(" ✅ All Sheets completed and finalized!", true);
							
							// Prevent resubmission
							$('#submitProcessDataSheet').attr("data-submitted", "true");
					    },
					    error: function () {
					        showResponseModal("Error updating status in the final Excel Save Table", false);
					    }
					});
					  
		          }
		      },
		      error: function () {
		          showResponseModal("Error checking next count.", false);
		      }
		  });
		
	  	resetProcessDataSheetForm();
    },
	error: function(response, status, error) {

		console.error("Submission error:", error);
		let message = response.responseText || "Failed to save.";
		showResponseModal(message, false); // ❌ Red error message
	}
  });
});


function showResponseModalWithNext(message, isSuccess, nextCount) {
    const container = $("#responseModalBody");
    const icon = $("#responseModalIcon");
    const label = $("#responseModalLabel");
    const footer = $("#responseModal .modal-footer");

	$("#responseModalCloseButton").hide();
    container.text(message);

    if (isSuccess) {
        container.css("color", "limegreen");
        icon.hide();
        label.text("Success");
    } else {
        container.css("color", "red");
        icon.show();
        label.text("Warning");
    }

    // Clear footer and add custom buttons
    footer.empty();
    footer.append('<button type="button" class="btn btn-secondary" style="display: none;" data-dismiss="modal">Close</button>');
    if (isSuccess && nextCount) {
        footer.append('<button type="button" class="btn btn-primary" id="nextCountBtn">Next</button>');

        $("#nextCountBtn").click(function () {
           
            loadProcessDataSheetUpperFormBody(lineStationSheetMappingId, nextCount);
			
			// Basic usage of setTimeout
			setTimeout(function() {
				$("#responseModalCloseButton").click();
			}, 1000); // 2000 milliseconds = 2 seconds
        });
    }

    $("#responseModalTriggerButton").click();
}


function resetProcessDataSheetForm() {
  // Text inputs
  $("#controlNoInput").val("");
  $("#validUptoInput").val("");
  $("#lineNoInput").val("");
  $("#jigNoInput").val("");

  $("#sop-input-1").val("");
  $("#sop-input-2").val("");
  $("#sop-input-3").val("");
  $("#operator-sign1").val("");

  $("#alb-input-1").val("");
  $("#alb-input-2").val("");
  $("#operator-sign2").val("");

  $("#eop-input-1").val("");
  $("#eop-input-2").val("");
  $("#operator-sign3").val("");

 // $("#supervisor-sign").val("");
}


function numberSpecsHighlight(specification) {
  // ✅ Extract range from SPEC like "2 ~ 4.0 Kgf.cm"
  let minValue = null, maxValue = null;
  
  if (specification) {
    // Case 1: "3.0 ~ 7.0 Kgf.cm"
    let matchRange = specification.match(/([\d.]+)\s*~\s*([\d.]+)/);
    
    // Case 2: "(0.7mm MAX)" or "0.7mm MAX"
    let matchMax = specification.match(/([\d.]+)\s*(?:mm|Kgf\.cm)?\s*\)?\s*MAX/i);
    
    if (matchRange) {
      minValue = parseFloat(matchRange[1]);
      maxValue = parseFloat(matchRange[2]);
      console.log("SPEC type: RANGE", minValue, "to", maxValue);
    } else if (matchMax) {
      maxValue = parseFloat(matchMax[1]);
      console.log("SPEC type: MAX", maxValue);
    }
  }
  // ✅ Function to validate and color input boxes
  function validateInputRange(input) {
    const val = parseFloat($(input).val());
    if (isNaN(val)) {
      $(input).css("border", "1px solid #ccc");
      return;
    }

    if (minValue !== null && maxValue !== null) {
      // Range case
      if (val >= minValue && val <= maxValue) {
        $(input).css("border", "2px solid green");
      } else {
        $(input).css("border", "2px solid red");
      }
    } else if (maxValue !== null) {
      // MAX only case
      if (val <= maxValue) {
        $(input).css("border", "2px solid green");
      } else {
        $(input).css("border", "2px solid red");
      }
    }
  }

  // ✅ Attach event listeners to all SOP, ALB, EOP inputs
  $("#sop-input-1, #sop-input-2, #sop-input-3, #alb-input-1, #alb-input-2, #eop-input-1, #eop-input-2")
    .on("input", function () {
      validateInputRange(this);
    });
}

