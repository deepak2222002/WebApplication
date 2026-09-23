let currentMachineId = null; // Declare globally

// Global variables used across your app
window.lineStationSheetMappingId = injectedLineStationSheetMappingId;// getting from the set value in the html, which set up in WebPageController
window.lineName = injectedLineName;// getting from the set value in the html, which set up in WebPageController
window.stationName = injectedStationName;// getting from the set value in the html, which set up in WebPageController
window.sheetName = injectedSheetName;
window.sheetTabNo = injectedSheetTabNo;
window.resumeMode = resumeModeInjected;

console.log(window.resumeMode, resumeMode);


$(document).ready(function () {
   getToken();

	if (!resumeMode) { // SOP
	checkModelVariant(lineStationSheetMappingId); // 🟢 NEW — Check first
	} else{
			// Continue initializing the form with dynamic machineId
			loadPHUpperFormBody(lineStationSheetMappingId);
			createPhFormBody(lineStationSheetMappingId);
			currentMachineId=lineStationSheetMappingId;
	}
});


function checkModelVariant(mappingId) {
    $.ajax({
        type: "GET",
        url: "/WebApplication/Controllers/ph/checkModelVariant/" + mappingId,
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },

        success: function() {
            // Now page can load safely
			// Continue initializing the form with dynamic machineId
			loadPHUpperFormBody(lineStationSheetMappingId);
			createPhFormBody(lineStationSheetMappingId);
			currentMachineId=lineStationSheetMappingId;
        },

        error: function(xhr) {
            alert("Cannot load SOP because Model or Variant is missing.\n\n" +
                  "Please reopen the Application.");
				  
				  $("input, textarea, select, button").prop("disabled", true);
				  $('#submitProductHistory').prop("disabled", true);

				  $('#submitProductHistory').css({
				      pointerEvents: "none",
				      opacity: 0.5
				  });
				  $("#upper_ph_form_body").html("<div class='text-danger'>Either Model or Variant is not found.</div>");
				  
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

// ✅ Hardcoded Hindi instructions (static)
const phHindiInstr = "अगर कोई प्रॉब्लेम या N.G आता है तो ऊसी समय लाइन इनचार्ज को इन्फॉर्म करे । पार्ट नंबर वेरीफिकेसन के लिए पॅकिंग पर पार्ट नंबर चेक करे ओर कॉलम मे लिखे ।";
let sheetOpenTime; // global variable

function loadPHUpperFormBody(lineStationSheetMappingId) {
	$("#upper_ph_form_body").empty();
	
	let url = resumeMode
	  ? `/WebApplication/Controllers/ph/PhUpperFormfromProdIot/resume/${lineStationSheetMappingId}`
	  : `/WebApplication/Controllers/ph/PhUpperFormfromProdIot/${lineStationSheetMappingId}`;
	  
	$.ajax({ // getting model, variant, starttime and date from prod_iot whose status is one.
	   	url: url,
		method: "GET",
		headers: {
			Authorization: `Bearer ${sessionStorage.getItem('token')}`
		},
		success: function(machine) {
			console.log(machine);
			// Store the time globally for later use in operator time tracking
			window.globalPhCurrentTime = machine.phCurrentTime;
			window.globalPhCurrentDate = machine.phDate;
			
			sheetOpenTime= machine.sheetOpenTime;
			// Split phHindiInstr by '।' and filter empty ones
			const hindiInstructions = (phHindiInstr || '')
			    .split('।')
			    .map(line => line.trim())
			    .filter(line => line.length > 0);

			// Convert to HTML rows
			const hindiInstrHTML = hindiInstructions
				.map(line => `<div class="mb-1">• ${line} ।</div>`)
				.join('');

			const phPartName = "METER ASSY COMB";
			const startTime = (machine.startTime || '').substring(0, 5);
			const finishTime = (machine.finishTime || '').substring(0, 5);
			
			const html = `
                <div class="row mb-1 mt-1" style="margin-left: 20px;">
					
                    <!-- Column 1: Part Details -->
                    <div class="col-md-4 small-text">
                        <strong>PART :</strong> ${phPartName || ''}<br>
                        <strong>MODEL :</strong>
						<span id="phModelText">${machine.phModel || ''}</span>
						 <br>
						<div class="d-flex">
						  <strong class="me-2" style="white-space: nowrap;">PART NO. :</strong>
						  <div id="phPartNoText">
						    ${(machine.phPartNo || '')
						      .split(' ')
						      .map(part => `<span class="me-2">${part}</span>`)
						      .join('')}
						  </div>
						</div>
                    </div>

					<!-- Column 2: Time Inputs -->
					<div class="col-md-4 small-text">
					    <div class="d-flex align-items-center mb-2">
					        <strong class="me-2" style="white-space: nowrap;">START TIME :</strong>
					        <input type="time" class="form-control form-control-sm" id="startTime" style="max-width: 150px;" value="${startTime || ''}" disabled>
					    </div>
					    <div class="d-flex align-items-center">
					        <strong class="me-2" style="white-space: nowrap;">FINISH TIME :</strong>
					        <input type="time" class="form-control form-control-sm" id="finishTime" style="max-width: 150px;"  value="${resumeMode ? finishTime : ''}"  disabled>
					    </div>
					</div>

					<!-- Column 3: Date and Quantity -->
					<div class="col-md-4 small-text">
						<div class="d-flex align-items-center mb-2">
					  		<div class="me-4 d-flex align-items-center">
					    		<strong class="me-2" style="white-space: nowrap;">DATE :</strong>
					    		<span id="phDateText">${machine.phDate}</span>
					  		</div>
					  
					  		<div class="d-flex align-items-center">
					    		<strong class="me-2" style="white-space: nowrap;">SHIFT :</strong>
					    		<span id="phShiftText">${machine.shift}</span>
					  		</div>
							<span id="phLogicalDateTimeText" style="display: none;">${machine.logicalShiftDateTime}</span>
						</div>
					    <div class="d-flex align-items-center">
					        <strong class="me-2" style="white-space: nowrap;">QUANTITY :</strong>
					        <input type="number" class="form-control form-control-sm" id="phQuantity" min="1" placeholder="Enter quantity" style="max-width: 150px;" value="${resumeMode ? machine.quantity : ''}" >
					    </div>
					</div>
				</div>
				      <!-- Hindi Instructions -->
				<div class="col-md-12 mt-0 mb-1">
					<div class="p-2 border rounded" style="background-color: #f4f7fa; font-size: 0.95rem; line-height: 1.7;">
				        ${hindiInstrHTML}
				    </div>
				</div>
            `;

			$("#upper_ph_form_body").html(html);
		},
		error: function() {
			$("#upper_ph_form_body").html("<div class='text-danger'>PH machine data not found. (May be labview didnot updated the table.)</div>");
		}
	});
}

function createPhFormBody(lineStationSheetMappingId) {
	$("#phformBody").empty();

	$.ajax({  // this also updates the backend with Mark sheet open (status = 0) in saveStatus table 
		url: `/WebApplication/Controllers/ph/get-ph-inspection-data/${lineStationSheetMappingId}?resumeMode=${resumeMode}`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${sessionStorage.getItem('token')}`
		},
		success: function(data) {
			console.log("Full response:", data);

      	let html = "";
			
			// data.data.forEach((item, index) => {
			data.forEach((item, index) => {
				
				const isFirstRow = index === 0; // for first row only
				
				html += `
				    <tr>
					<td style="display:none;">
					<!-- Hidden Inputs -->
					<input type="hidden" name="lssId_${index}" value="${lineStationSheetMappingId}" />
					<input type="hidden" name="phReqDataId_${index}" value="${item.phReqDataId}" />
					<input type="hidden" name="paramNo_${index}" value="${item.paramNo}" />
					<input type="hidden" name="phUserInputDataId_${index}" id="lastSavedInputId" value="">
					
					<!-- ✅ Hidden input, so can be capture in submit buttom click-->
					<input type="hidden" name="partOrProcess_${index}" value="${item.partOrProcess}">
					<input type="hidden" name="inspectionRequirement_${index}" value="${item.inspectionRequirement}">
					</td>
					
				      <!-- Column 1: Part/Process (only once per LSSID) -->
				      ${isFirstRow ? `
				        <td rowspan="${data.length}" style="vertical-align: middle; min-width: 100px;">
				          ${item.partOrProcess}
				        </td>
				      ` : ''}

				      <!-- Column 2: Inspection Requirement -->
				      <td style="min-width: 220px;">${item.inspectionRequirement}</td>
					  
					  <!-- Column 3: Result Inputs -->
					  ${createSopInputCell(item.sopValType, item.sopDateRequired, index)}
					  
					  <!-- Column 3.2: Result Inputs -->
					  ${isFirstRow ? `
					  <td  rowspan="${data.length}"  style="min-width: 250px;">
					    <div class="lot-change-section d-flex flex-column align-items-center gap-2" data-index="${index}">
					      <div class="lot-change-list w-100"></div>
					      <button type="button" class="btn btn-sm btn-outline-primary add-lot-btn">+ Add लॉट चेंज</button>
					    </div>
					  </td>
					  ` : ''}

					        <!-- Column 4: Operator (only once) -->
							${isFirstRow ? `
							  <td rowspan="${data.length}" class="operator-section" data-index="${index}"  style="vertical-align: top; min-width: 210px;">
							    <div class="operator-entry w-100 d-flex flex-column align-items-center gap-1 m-1" style="border: 1px solid #ccc; border-radius: 10px; padding: 6px;">
							      <input type="text" class="form-control text-center operator-input" style="background-color:#f8f9fa; color:#212529;"
							             name="operator_${index}_1" placeholder="ऑपरेटर का नाम..." disabled >
								 <div class="d-flex align-items-center gap-2">	 
							      <input type="text" class="form-control text-center operator-time" style="background-color:#f8f9fa; color:#212529;"
							             name="operator_time_if_changed_${index}_1" disabled >
							      <span class="am-pm-label"></span>
								  
								  </div>
							    </div>
							   
							  </td>
							` : ''}

					      </tr>
					    `;
					  });

			  $("#phformBody").html(html);
			  
			  // Force-disable + apply styles AFTER rendering
			  $("#phformBody .operator-input, #phformBody .operator-time").each(function () {
			    $(this)
			      .prop("disabled", true)
			      .css({
			        "background-color": "#f8f9fa",
			        "color": "#212529",
			        "pointer-events": "none", // prevent click focus
			        "opacity": "1" // ensure it doesn’t look greyed out
			      });
			  });
			
		},
		error: function(err) {
			console.error("Error fetching inspection data", err);
			$("#phformBody").html("<div class='text-danger'>Failed to load inspection data</div>");

			if (err) {
			    alert(err.responseJSON.error);  // ⚠️ Show operator not found error
			    return;
			}
		}
	});
	
	
	// Step 2: If resumeMode, fetch last saved inputs & prefill
	if (resumeMode) {
		$.ajax({
			url: `/WebApplication/Controllers/ph/lastData/${lineStationSheetMappingId}`, // ✅ new simplified API
			method: "GET",
			headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
			success: function(savedInputs) {
				setTimeout(function() {
				  prefillSavedInputs(savedInputs);
				  
				  // ✅ Now this runs after prefill is complete
				  checkAndUpdateOperatorName(lineStationSheetMappingId);
				  
				  disableSOPInputs();
				}, 1000);			

			},
			error: function(err) {
			 console.error("Error fetching inspection data", err);
			 alert("No past saved data");
			 
			 // Even if no saved data, still check operator
			 checkAndUpdateOperatorName(lineStationSheetMappingId);
			 
			}
		});
		
	}  else {
		// When not resuming, just run directly	
		setTimeout(function() {
	  		checkAndUpdateOperatorName(lineStationSheetMappingId);
		}, 1000);
	}
	
}



// For SOP column
// 🧩 Helper function to generate SOP input cell
function createSopInputCell(sopValType, sopDateRequired, index) {
  const type = sopValType?.toLowerCase() || "text";
  const dateReq = sopDateRequired?.toLowerCase() === "yes";

  // 🧱 Case 1: Text only
  if (type === "text" && !dateReq) {
    return `
      <td style="min-width: 280px;">
        <div class="d-flex justify-content-around gap-1">
          <input type="text" class="form-control text-center"
                 placeholder="Enter value..." name="sop_${index}">
        </div>
      </td>
    `;
  } else if (type === "text" && dateReq) { // 🧱 Case 2: Text + Date
    return `
      <td style="min-width: 280px;">
        <div class="d-flex flex-column gap-1 justify-content-center">
          <input type="text" class="form-control text-center"
                 placeholder="Enter value..." name="sop_${index}">
          <input type="date" class="form-control text-center"
                 name="sop_date_${index}">
        </div>
      </td>
    `;
  } else if (type === "yesno" && !dateReq) {  // 🧱 Case 3: Yes/No dropdown
    return `
      <td style="min-width: 280px;">
        <div class="d-flex justify-content-center">
          <select name="sop_${index}" class="form-control form-control-sm text-center">
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      </td>
    `;
  } else if (type === "yesno" && dateReq) { // 🧱 Case 4: Yes/No dropdown + Date
    return `
      <td style="min-width: 280px;">
        <div class="d-flex flex-column align-items-center gap-1">
          <select name="sop_${index}" class="form-control form-control-sm text-center">
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <input type="date" class="form-control text-center"
                 name="sop_date_${index}">
        </div>
      </td>
    `;
  }

  // 🧱 Default fallback
  return `
    <td style="min-width: 280px;">
      <div class="d-flex justify-content-around gap-1">
        <input type="text" class="form-control text-center"
               placeholder="SOP..." name="sop_${index}">
      </div>
    </td>
  `;
}


function disableSOPInputs(){
	
	// Disable all SOP fields after prefilling
	$("#phformBody")
	  .find('input[name^="sop_"], input[name^="sop_date_"], select[name^="sop_"]')
	  .each(function () {
	    $(this).prop("disabled", true).css({
	      "background-color": "#f8f9fa",
	      "color": "#212529",
	      "pointer-events": "none",
	      "opacity": "1"
	    });
	  });
  
}



function prefillSavedInputs(savedInputs) {
	console.log(savedInputs);

    savedInputs.forEach((saved, index) => {
		$(`[name="phUserInputDataId_${index}"]`).val(saved.id || "");
        $(`[name="sop_${index}"]`).val(saved.startOfProduction || "");
		// 🧩 Prefill SOP date (if exists)
		$(`[name="sop_date_${index}"]`).val(saved.sopDate || "");
		

		// 🧩 Parse lotChangesJson safely
		let lotChanges = [];
		if (saved.lotChangesJson) {
		  try {
		    let parsed = saved.lotChangesJson;
		    if (typeof parsed === "string") parsed = JSON.parse(parsed);
		    if (typeof parsed === "string") parsed = JSON.parse(parsed); // handle double encoded
		    if (Array.isArray(parsed)) lotChanges = parsed;
		  } catch (e) {
		    console.warn("Invalid lotChangesJson format:", saved.lotChangesJson);
		    lotChanges = [];
		  }
		}

		console.log("lotChanges", lotChanges);

		// ✅ Find the correct lot-change section
		const lotSection = $(`.lot-change-section[data-index='${index}']`);
		const lotList = lotSection.find(".lot-change-list");

		// Clear any previously added entries
		lotList.empty();

		// ✅ Now fill or create new entries
		if (lotChanges.length > 0) {
		  lotChanges.forEach((lot, lotIndex) => {
		    const lotEntry = `
		      <div class="lotchange-entry w-100 d-flex flex-column align-items-center gap-1 m-1" style="border: 1px solid #ccc; border-radius: 10px; padding: 6px;">
		        <input type="text" class="form-control text-center lotchange-input"
		               name="lotChange_${index}_${lotIndex + 1}" 
		               value="${lot.lotNo || ''}" 
		               style="background-color:#f8f9fa; color:#212529;" disabled />
		        <div class="d-flex align-items-center gap-2">
		          <input type="text" class="form-control text-center"
		                 name="lotChangeDate_${index}_${lotIndex + 1}" 
		                 value="${lot.dateVal || ''}" 
		                 style="flex: 2; background-color:#f8f9fa; color:#212529;" disabled />
		          <input type="text" class="form-control text-center"
		                 name="lotChangeTime_${index}_${lotIndex + 1}" 
		                 value="${lot.timeVal || ''}" 
		                 style="flex: 1; background-color:#f8f9fa; color:#212529;" disabled />
		          <span class="am-pm-label">${lot.ampm || ''}</span>
		        </div>
		      </div>
		    `;
		    lotList.append(lotEntry);
		  });
	    // ✅ Save how many entries were prefilled
	    lotSection.attr("data-prefilled-count", lotChanges.length);
	  } else {
	    lotSection.attr("data-prefilled-count", 0);
	  }


/*        $(`[name="operator_${index}"]`).val(saved.operatorName || "");
        $(`[name="operator_time_if_changed_${index}"]`).val(saved.timeIfChanged || "");*/
		
		
		// 🧠 Parse operatorChangesJson safely
		   let operatorChanges = [];
		   if (saved.operatorChangesJson) {
		     try {
		       let parsed = saved.operatorChangesJson;

		       // Parse if it’s a string
		       if (typeof parsed === "string") parsed = JSON.parse(parsed);

		       // Handle double-encoded JSON (string inside string)
		       if (typeof parsed === "string") parsed = JSON.parse(parsed);

		       if (Array.isArray(parsed)) operatorChanges = parsed;
		     } catch (e) {
		       console.warn("Invalid operatorChangesJson format:", saved.operatorChangesJson);
		       operatorChanges = [];
		     }
		   }

		
		const operatorSection = $(`[name="operator_${index}_1"]`).closest(".operator-section");
		 operatorSection.find(".operator-entry").not(":first").remove();

		 if (operatorChanges.length > 0) {
		   operatorChanges.forEach((op, opIndex) => {
		     if (opIndex === 0) {
		       operatorSection.find(`[name="operator_${index}_1"]`).val(op.name || "");
		       operatorSection.find(`[name="operator_time_if_changed_${index}_1"]`).val(op.time || "");
		       operatorSection.find(".am-pm-label").text(op.ampm || "");
		     } else {
		       const newEntry = `
		         <div class="operator-entry w-100 d-flex flex-column align-items-center gap-1 m-1" style="border: 1px solid #ccc; border-radius: 10px; padding: 6px;">
		           <input type="text" class="form-control text-center operator-input"  style="background-color:#f8f9fa; color:#212529;"
		                  name="operator_${index}_${opIndex + 1}" value="${op.name || ''}" disabled />
		           <div class="d-flex align-items-center gap-2">
		             <input type="text" class="form-control text-center"  style="background-color:#f8f9fa; color:#212529;"
		                    name="operator_time_if_changed_${index}_${opIndex + 1}" value="${op.time || ''}" disabled/>
		             <span class="am-pm-label">${op.ampm || ''}</span>
		           </div>
		         </div>
		       `;
		       operatorSection.append(newEntry);
		     }
		   });
		 } else {
	         // fallback for old single operator fields
	         $(`[name="operator_${index}_1"]`).val(saved.operatorName || "");
	         $(`[name="operator_time_if_changed_${index}_1"]`).val(saved.timeIfChanged || "");
	       }
	     });

	if (savedInputs.length > 0) {
	    const meta = savedInputs[0];  // first row carries shared info
	    $(`#startTime`).val(meta.startTime || "");
	    $("#phModelText").text(meta.model || "");
	    $("#phPartNoText").html(
	      (meta.variant || "")
	        .split(" ")
	        .map(part => `<span class="me-2">${part}</span>`)
	        .join("")
	    );
	}
	  
}

function normalizeName(name) { // only used for comparison purpose.
    return (name || "").trim().toUpperCase();
}

function checkAndUpdateOperatorName(lssId) {
  $.ajax({
    url: `/WebApplication/Controllers/ph/current-operator/${lssId}`,
    method: "GET",
    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    success: function(response) {
      if (response.error) {
        alert(response.error);
        return;
      }

	  // Operator info can be shown in UI if needed
	  console.log("Operator ID:", response.operatorId);
	  console.log("Operator Name:", response.operatorName);
	  
      const operatorName = response.operatorName;
      if (!operatorName) return;

      const operatorSections = $(".operator-section");

      operatorSections.each(function() {
        const $section = $(this);
        const existingInputs = $section.find(".operator-input");
        const lastInput = existingInputs.last();

        // Extract base index from section
        const index = $section.data("index");
        const nextNum = existingInputs.length + 1;

		// Get current local time
		const now = new Date();
		
	  // Instead of new Date(), you can use the globally stored base time coming from backend
	  let baseTime = window.globalPhCurrentTime 
	    ? new Date(`1970-01-01T${window.globalPhCurrentTime}`) 
	    : now;
console.log("globalPhTime", window.globalPhCurrentTime);  
	  	// Use baseTime for consistency
	  	let hours = baseTime.getHours();
	  	const minutes = baseTime.getMinutes().toString().padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12; // Convert to 12-hour
        const timeOnly = `${hours.toString().padStart(2, "0")}:${minutes}`;

        if (lastInput.val() && normalizeName(lastInput.val()) !== normalizeName(operatorName)) {
          // 🧩 New operator detected → add a new entry
          const newEntry = `
            <div class="operator-entry w-100 d-flex flex-column align-items-center gap-1 m-1" style="border: 1px solid #ccc; border-radius: 10px; padding: 6px;">
              <input type="text" class="form-control text-center operator-input" style="background-color:#f8f9fa; color:#212529;"
                     name="operator_${index}_${nextNum}" value="${operatorName}" disabled />
              <div class="d-flex align-items-center gap-2">
                <input type="text" class="form-control text-center operator-time" style="background-color:#f8f9fa; color:#212529;"
                       name="operator_time_if_changed_${index}_${nextNum}" value="${timeOnly}" disabled />
                <span class="am-pm-label">${ampm}</span>
              </div>
            </div>
          `;
          $section.append(newEntry);
        } 
        else if (!lastInput.val()) {
          // 🧠 First operator — fill it directly
          lastInput.val(operatorName);
          const timeInput = $section.find(`[name="operator_time_if_changed_${index}_${existingInputs.length}"]`);
          timeInput.val(timeOnly);

          // Add or update AM/PM label next to the time input
          let ampmLabel = timeInput.closest("div").find(".am-pm-label");
          if (ampmLabel.length === 0) {
            timeInput.after(`<span class="am-pm-label">${ampm}</span>`);
          } else {
            ampmLabel.text(ampm);
          }
        }
      });
    },
    error: function(err) {
      console.error("Error fetching operator info", err);
      if (err?.responseJSON?.error) alert(err.responseJSON.error);
    }
  });
}



function showResponseModal(message, isSuccess = true) {
	const container = $("#responseModalBody");
	const icon = $("#responseModalIcon");
	const label = $("#responseModalLabel");
	const $footerCloseBtn = $("#responseModal .modal-footer button");
	
	container.html(message); // ✅ renders HTML like <br>

	if (isSuccess) {
		container.css("color", "limegreen");
		icon.hide();
		label.text("Success");
		
/*		$footerCloseBtn.text("Go to Process Data Sheet");
		$footerCloseBtn.removeClass("btn-secondary").addClass("btn-success");

		$footerCloseBtn.off("click").on("click", function () {
			if (currentMachineId) {
				//  taking transitionbaseUrl from WebPageController.java which was set up in the application properties
				// and was injected in the html before every <script> tag
				window.location.href = `${transitionbaseUrl}/WebApplication/processDataSheet?machineId=${currentMachineId}`;
			} 
		});*/

	} else {
		container.css("color", "red");
		icon.show();
		label.text("Warning");
		
		$footerCloseBtn.text("Re-check");
		$footerCloseBtn.removeClass("btn-success").addClass("btn-secondary");

		$footerCloseBtn.off("click").on("click", function () {
			$("#responseModal").modal("hide");
		});
	}

	// Trigger the modal to open
	$("#responseModalTriggerButton").click();
};


$('#submitProductHistory').click(function() {
	if ($(this).attr("data-submitted") === "true") {// will run it for just only in frontend so this not work when page refreshed.
	    alert("This Ph sheet is already filled.");
	    return;
	}
	 
    const inputs = [];
    const startTime = $('#startTime').val();
    const finishTime = $('#finishTime').val();
    const quantityInteger = $('#phQuantity').val();
	const shift= $('#phShiftText').text().trim();
	const logicalShiftDateTime= $('#phLogicalDateTimeText').text().trim();

	 
	const variant = $('#phPartNoText span')
	  .map(function () {
	    return $(this).text().trim();
	  })
	  .get()
	  .join(' ');  // join with space
	  const model = $('#phModelText').text().trim();
	  let phUserInputDataId =null;
	  
	  let missingSOP = false; // Track if any SOP field is empty	  
	  let missingLotChange = false;
	  
    $('#phformBody tr').each(function (index) {

	   const phReqDataId = $(`input[name=phReqDataId_${index}]`).val();
	   const paramNo = $(`input[name=paramNo_${index}]`).val();
	   const partOrProcess = $(`input[name=partOrProcess_${index}]`).val()?.trim() || null;
	   const inspectionRequirement = $(`input[name=inspectionRequirement_${index}]`).val()?.trim() || null;

	   if(resumeMode){
		 phUserInputDataId = $(`input[name=phUserInputDataId_${index}]`).val(); // ✅ row-specific ID
	   }

	   // 🔹 Get SOP input (could be <input> or <select>)
	   const sopInput = $(`[name="sop_${index}"]`);
	   const startOfProduction = sopInput.val()?.trim() || "";
	   const sopDateInput = $(`[name="sop_date_${index}"]`);
		let sopDateValue = $(`[name="sop_date_${index}"]`).val()?.trim() || null;

		// 🔹 Validation: make SOP compulsory
		if (!startOfProduction) {
		  missingSOP = true;
		  $(`[name="sop_${index}"]`).css("border", "2px solid red"); // highlight missing
		} else {
		  $(`[name="sop_${index}"]`).css("border", ""); // remove highlight if filled
		}
		
		// If date field exists, validate it too
		if (sopDateInput.length && !sopDateValue) {
		  missingSOP = true;
		  sopDateInput.css("border", "2px solid red");
		} else {
		  sopDateInput.css("border", "");
		}
		
		
		// 🔹 Collect all Lot Change entries dynamically
		const lotChanges = [];
		$(`[name^="lotChange_${index}_"]`).each(function () {
		  const lotChangeInput = $(this);
		  const nameAttr = lotChangeInput.attr("name"); // e.g., lotChange_0_1
		  const match = nameAttr.match(/lotChange_(\d+)_(\d+)/);
		  if (match) {
		    const count = match[2];
		    const lotNo = lotChangeInput.val().trim();
		    const dateVal = $(`[name="lotChangeDate_${index}_${count}"]`).val().trim();
		    const timeVal = $(`[name="lotChangeTime_${index}_${count}"]`).val().trim();
		    const ampm = $(`[name="lotChangeTime_${index}_${count}"]`).closest("div").find(".am-pm-label").text().trim();

		    // Validate: all must be filled
		    if (!lotNo || !dateVal || !timeVal) {
		      missingLotChange = true;
		      lotChangeInput.css("border", "2px solid red");
		    } else {
		      lotChangeInput.css("border", "");
		    }

		    lotChanges.push({ lotNo, timeVal, dateVal, ampm });
		  }
		});

		
		const operatorEntries = [];
		$(`[name^="operator_${index}_"]`).each(function(i) {
		  const opName = $(this).val().trim();
		  const timeVal = $(`[name="operator_time_if_changed_${index}_${i+1}"]`).val();
		  const ampmVal = $(`[name="operator_time_if_changed_${index}_${i+1}"]`)
		                    .closest("div")
		                    .find(".am-pm-label")
		                    .text();
		  if (opName) {
		    operatorEntries.push({
		      name: opName,
		      time: timeVal,
		      ampm: ampmVal
		    });
		  }
		});
	
		console.log("sopDate", sopDateValue);
        inputs.push({
			id: resumeMode ? phUserInputDataId || null : null, // ✅ include ID if resumemode on
			lineStationSheetMapping: { id: lineStationSheetMappingId },
			phReqDataId: { id: phReqDataId },   // ✅ send as object for @ManyToOne
			paramNo,                            // ✅ plain string
            startOfProduction,
			sopDate: sopDateValue, 
			partOrProcess,
			inspectionRequirement,
			logicalShiftDateTime,
            // lotChange1,
            // time1,
            // lotChange2,
            // time2,
			lotChangesJson: JSON.stringify(lotChanges), // 🔹 store dynamic lot list
            // operatorName: operator,
           //  timeIfChanged,
		   	operatorChangesJson: JSON.stringify(operatorEntries),  // 🔹 array of name + time
            startTime,
            finishTime,
            quantityInteger,
			//lineLeaderSign,
			//lineInchargeSign,
			//qaEngrSign,
			shift,
			variant,
			model
        });
    });
	console.log(inputs);
	// 🔹 If any SOP field is missing, stop submission
	if (missingSOP) {
	    alert("Please fill all Start of Production (SOP) fields before submitting.");
	    return; // 🚫 Stop further processing
	}
	
	if (missingLotChange) {
	  alert("❗कृपया पहले सभी लॉट चेंज इनपुट भरें।");
	  return;
	}
	
    // Send data to backend
	let url = resumeMode
	  ? `/WebApplication/Controllers/ph/save-ph-user-input/resume`
	  : `/WebApplication/Controllers/ph/save-ph-user-input`;
	  
    $.ajax({
        url: url,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(inputs),
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
        },
        success: function (response) {
			
			console.log(response);
			// Prevent resubmission
			$('#submitProductHistory').attr("data-submitted", "true");


			showResponseModal(response, true); // ✅ Green success message

			resetFormInputs();

        },
        error: function (response, status, error) {
			
			console.error("Submission error:", error);
			let message = response.responseText || "Failed to save.";
			showResponseModal(message, false); // ❌ Red error message

        }
    });
});


function resetFormInputs() {
	// Select all inputs inside your form (adjust selector if needed)
	const inputs = document.querySelectorAll("input[type='text'], input[type='time'], input[type='date'], input[type='number']");

	inputs.forEach(input => {
		input.value = "";

		// Restore placeholder styling if needed (for italic effect)
		if (input.placeholder) {
			input.style.fontStyle = 'italic';
			input.style.color = '#999';
		}
	});
}


// After table is rendered:
$("#phformBody").on("click", ".add-lot-btn", function () {
  const section = $(this).closest(".lot-change-section");
  const index = section.data("index");
  const list = section.find(".lot-change-list");

  // Check if any existing inputs are empty
  const allFilled = list.find(".lot-change-entry input").toArray().every(input => {
    return $(input).val().trim() !== "";
  });

  if (!allFilled && list.children().length > 0) {
    alert("❗कृपया पहले सभी लॉट चेंज इनपुट भरें।");
    return; // stop adding new entry
  }

  const count = list.children().length + 1; // next entry number

  // Get current time (like operator time logic)
  const now = new Date();

  // Use backend-synced base time/date if available
  let baseTime = window.globalPhCurrentTime 
    ? new Date(`1970-01-01T${window.globalPhCurrentTime}`)
    : now;

  // Parse dd/MM/yyyy format correctly
  let baseDate;
  if (window.globalPhCurrentDate) {
    const [day, month, year] = window.globalPhCurrentDate.split("/").map(Number);
    baseDate = new Date(year, month - 1, day);
  } else {
    baseDate = new Date();
  }

  // Format time
  let hours = baseTime.getHours();
  const minutes = baseTime.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const timeOnly = `${hours.toString().padStart(2, "0")}:${minutes}`;

  // Format date as dd-MM-yyyy
  const day = String(baseDate.getDate()).padStart(2, "0");
  const month = String(baseDate.getMonth() + 1).padStart(2, "0");
  const year = baseDate.getFullYear();
  const todayDate = `${day}-${month}-${year}`;

  // Create new entry HTML
  const newEntry = `
    <div class="lot-change-entry d-flex flex-column align-items-center gap-2 w-100">
      <input type="text" class="form-control text-center lot-change-no" 
             name="lotChange_${index}_${count}" placeholder="लॉट चेंज ${count}...">

      <div class="d-flex align-items-center gap-1">
        <input type="text" class="form-control text-center lot-change-date" 
               name="lotChangeDate_${index}_${count}" value="${todayDate}" >
        <input type="text" readonly class="form-control text-center lot-change-time" 
               name="lotChangeTime_${index}_${count}" value="${timeOnly}" disabled >
        <span class="am-pm-label">${ampm}</span>
      </div>
    </div>
  `;

  list.append(newEntry);

  // Add delete button if not present
  if (section.find(".delete-lot-btn").length === 0) {
    section.append(`
      <button type="button" class="btn btn-sm btn-outline-danger mt-1 delete-lot-btn">
        🗑️ Delete Last
      </button>
    `);
  }
});

// 🗑️ Delete last dynamically added entry
$("#phformBody").on("click", ".delete-lot-btn", function () {
  const section = $(this).closest(".lot-change-section");
  const list = section.find(".lot-change-list");
  const prefilledCount = parseInt(section.attr("data-prefilled-count") || "0");

  const totalEntries = list.children().length;

  // Only delete if there are more than prefilledCount entries
  if (totalEntries > prefilledCount) {
    list.children().last().remove();
  }

  // Hide delete button if only prefilled entries remain
  if (list.children().length <= prefilledCount) {
    $(this).remove();
  }
});
