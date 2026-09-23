let currentMachineId = null; // Declare globally

// Global variables used across your app
window.lineStationSheetMappingId = injectedLineStationSheetMappingId;// getting from the set value in the html, which set up in WebPageController
window.lineName = injectedLineName;// getting from the set value in the html, which set up in WebPageController
window.stationName = injectedStationName;// getting from the set value in the html, which set up in WebPageController
window.sheetName = injectedSheetName;
window.sheetTabNo = injectedSheetTabNo;
window.resumeMode = resumeModeInjected;


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
/*   operator name set only in the  --->   /machineparameters at time of SOP  
and for later time it is fetched from the database in /filled case when resumeMode and then --->  /lastData runs*/
$(document).ready(function () {
    getToken();

	if (!resumeMode) { // SOP
		checkModelVariant(lineStationSheetMappingId); // 🟢 NEW — Check first
	} else{
		            // Now page can load safely
            loadMCSUpperFormBody(lineStationSheetMappingId);
            createMCSFormBody(lineStationSheetMappingId);
            currentMachineId = lineStationSheetMappingId;
	}
});


function checkModelVariant(mappingId) {
    $.ajax({
        type: "GET",
        url: "/WebApplication/Controllers/mcs/checkModelVariant/" + mappingId,
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },

        success: function() {
            // Now page can load safely
            loadMCSUpperFormBody(mappingId);
            createMCSFormBody(mappingId);
            currentMachineId = mappingId;
        },

        error: function(xhr) {
            alert("Cannot load SOP because Model or Variant is missing.\n\n" +
                  "Please reopen the Application.");

				  $("input, textarea, select, button").prop("disabled", true);
				  $('#submitMachineCheckSheet').prop("disabled", true);

				  $('#submitMachineCheckSheet').css({
				      pointerEvents: "none",
				      opacity: 0.5
				  });
				  
				  $("#machcheckformBody").html("<div class='text-danger'>Either Model or Variant is not found.</div>");

        }
    });
}


function loadMCSUpperFormBody(lineStationSheetMappingId) {
    $("#upper_mcs_form_body").empty();

    $.ajax({
        url: "/WebApplication/Controllers/mcs/JigNo/" + lineStationSheetMappingId,
        method: "GET",
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
        },
        success: function(machine) {
			console.log("machine", machine);
			// fetching shoft from backend server time so later even when the operator takes time for filling the form 
			//  so then also it will not show up the wrong shift, and will be from previous time to 7:30 whenthe sheet was opened,
			// so at time of saving same is used for saving the shift.
           
            const html = `
                <div class="row mb-1">
				<span id="backendLogicalDateTimeText" style="display: none;">${machine.logicalShiftDateTime}</span>
				
                    <div class="col-md-6 small-text">
                        <strong>SHIFT :</strong> 
                        <span id="shiftDisplay">${machine.shift}</span>
                        <input type="hidden" id="shiftInput" name="shift" value="${machine.shift}">
                    </div>
                    <div class="col-md-6 small-text">
                        <label for="jigNumberInput"><strong>JIG NUMBER :</strong></label>
                        <input 
                            type="text" 
                            id="jigNumberInput" 
                            name="jigNumber" 
                            class="form-control form-control-sm d-inline-block w-auto ms-2"
                            value="${machine.jigNumber || ''}"
                            placeholder="Enter Jig Number"
                        >
                    </div>
                </div>
            `;
            $("#upper_mcs_form_body").html(html);
        },
        error: function() {
            $("#upper_mcs_form_body").html("<div class='text-danger'>Machine data not found.</div>");
        }
    });
}


function createMCSFormBody(lineStationSheetMappingId) {
	$("#machcheckformBody").empty();

	$.ajax({ 	// written in MachineCheckSheetFormAjaxController
		url: `/WebApplication/Controllers/mcs/machineparameters/${lineStationSheetMappingId}?resumeMode=${resumeMode}`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${sessionStorage.getItem('token')}` // ✅ Add token here
		},
		success: function(data) {
			
			// Prefill operator sign if backend provided it
			if (data.length > 0 && data[0].operatorName) {
			    $("#operator-sign").val(data[0].operatorName).prop("disabled", true);
			}
			
			data.forEach((item, index) => {
				console.log(item.paramId);  // Log item.id to check its value
				console.log(item); 
				let fileName;
				if(item.ptype==1){
					const imageurl = item.machParam_content?.trim() || '';
					fileName = imageurl.split(/[/\\]/).pop(); // Extract just the filename
				}
				
				const row = `
	                    <div class="row g-0 text-center">
							<!-- ✅ Hidden input for paramId  and machineId, so can be capture in submit form-->
							<input type="hidden" name="paramId_${index}" value="${item.paramId}" />
							<input type="hidden" name="linkId_${index}" value="${item.linkId}" />
							<input type="hidden" name="lssId_${index}" value="${lineStationSheetMappingId}" />
							<!-- ✅ Hidden input, so can be capture in submit buttom click--> 
							<input type="hidden" name="howText_${index}" value="${item.how}">
							<input type="hidden" name="whoText_${index}" value="${item.who}">
							<input type="hidden" name="whenText_${index}" value="${item.whenData}">
							<input type="hidden" name="parameter_${index}" value="${item.machParam_content}">
							<input type="hidden" name="ptype_${index}" value="${item.ptype}">
							<input type="hidden" name="dateText_${index}" value="${item.due_text}">
							<input type="hidden" name="vtype_${index}" value="${item.vtype}">
							<input type="hidden" name="passif_${index}" value="${item.passif}">
							<input type="hidden" name="value1_${index}" value="${item.value1}">
							<input type="hidden" name="value2_${index}" value="${item.value2}">							
							
	                        <div class="col-1 p-0 outerBordered d-flex align-items-center justify-content-center" style="max-width: 60px;">${index + 1}</div>
	                        <div class="col-4 p-0 outerBordered d-flex align-items-center justify-content-center" style="min-width: 25%;">
							
							${	item.ptype == 1
											? `<img src="/WebApplication/Controllers/MachineCheckSheetFieldImage/${fileName}" 
											       alt="Image" style="max-height: 80px; max-width: 100%;" />`
											: (item.machParam_content || '')
							}
							</div>

	                        <div class="col d-flex flex-row flex-wrap p-0">
							
	                            <div class="d-flex flex-row bordered-section flex-grow-1" style="flex: 0 0 35%; min-width: 200px;">
								<div class="bordered w-50 p-1" style="min-height: 40px;">
								    ${item.due_text && item.due_text !== '----'
						? `<div class="small">${item.due_text}</div><input type="date" class="form-control form-control-sm mt-1"  id="due-${item.paramId}" value="${item.due_date}"/>`
						: `<div class="d-flex align-items-center justify-content-center h-100">${item.due_text || ''}</div>`
					}
								</div>
								
								<div class="bordered w-50 p-1" style="min-height: 40px;">
									${item.done_text !== '----'
						? `<div class="d-flex align-items-center justify-content-center flex-column h-100">
									            <div class="small">${item.done_text}</div>
									            <input type="date" class="form-control form-control-sm mt-1" id="done-${item.paramId}"  value="${item.done_date}" />
									       </div>`
						: `<div class="d-flex align-items-center justify-content-center h-100">${item.done_text || ''}</div>`
					}
								</div>
										
								</div>

	                            <div class="outerBordered d-flex align-items-center justify-content-center flex-grow-1" style="flex: 0 0 15%; min-width: 100px;">
	                                ${item.how || ''}
	                            </div>
	                            <div class="outerBordered d-flex align-items-center justify-content-center flex-grow-1" style="flex: 0 0 15%; min-width: 100px;">
	                                ${item.who || ''}
	                            </div>
								
								<div class="outerBordered d-flex align-items-center justify-content-center p-0 flex-grow-1" style="flex: 0 0 15%; min-width: 100px;">
								    ${item.whenData && item.whenData.includes('-')
						? (() => {
							const parts = item.whenData.split('-').map(part => part.trim());
							return `
								                <div class="d-flex flex-column align-items-center justify-content-center w-100 h-100 text-center px-1">
								                    <div class="w-100 small">${parts[0]}</div>
								                    <hr class="w-100 my-1" style="border-top: 0.5px solid #000;" />
								                    <div class="w-100 small">${parts[1]}</div>
								                </div>
								            `;
						})()
						: `<span class="small w-100 text-center">${item.whenData || ''}</span>`
					}
								</div>
								
								<div class="outerBordered d-flex align-items-center justify-content-center p-0 flex-grow-1" style="flex: 0 0 20%; min-width: 120px;">
								    ${
								        item.whenData
								        ? (() => {
								            const parts = item.whenData.split('-').map(p => p.trim());
								            if (parts.length > 1) {
								                return `
								                    <div class="d-flex flex-column align-items-center justify-content-center w-100 h-100 px-1">
								                        ${parts.map((part, i) => renderInputField(item.vtype, item.paramId, i, item.passif, item.value1, item.value2, parts)).join('<hr class="w-100 my-1" style="border-top: 0.5px solid #000;" />')}
								                    </div>
								                `;
								            } else {
								                return renderInputField(item.vtype, item.paramId, 0, item.passif, item.value1, item.value2, parts);
								            }
								        })()
								        : ''
								    }
								</div>

	                        </div>
	                    </div>
	                `;
				$("#machcheckformBody").append(row);
			});

			if (resumeMode) {
			    $.ajax({
			        url: `/WebApplication/Controllers/mcs/lastData/${lineStationSheetMappingId}`,
			        method: "GET",
			        headers: {
			            Authorization: `Bearer ${sessionStorage.getItem('token')}`
			        },
			        success: function(savedData) {
			            console.log("Saved Data:", savedData);

						savedData.forEach((sd, index) => {
							const paramId = sd.field.rowId;
						             if (sd.inputData) {
						                 try {
						                     const parsed = JSON.parse(sd.inputData); 
						                     let partIndex = 0;
						                     Object.entries(parsed).forEach(([key, val]) => {
						                         // exactly same naming as in createMCSFormBody
						                         const baseName = `dataInput_${paramId}_${partIndex}`;
						                         const selector = $(`[name='${baseName}']`);

						                         if (selector.length) {
						                             selector.val(val);
						                         }
						                         partIndex++;
						                     });
						                 } catch (e) {
						                     console.error("Invalid inputData JSON", e);
						                 }
						             }
			 

			                // 3️⃣ Prefill jig number and signatures 
			                if (sd.operatorSign) $("#operator-sign").val(sd.operatorSign).prop("disabled", true); // it is set only in SOP
			             //   if (sd.inchargeSign) $("#incharge-sign").val(sd.inchargeSign); 
			            });
			        },
			        error: function(err) {
			            console.error("Error resuming data", err);
			        }
			    });
			}

 
		},
		error: function(err) {
			console.error("Error fetching data", err, err.responseText);
			console.error("Error text",  err.responseText);
			$("#machcheckformBody").html("<div class='text-danger'>Failed to load data</div>");
		}
	});
}


function renderInputField(vtype, paramId, partIndex, passif, value1, value2, parts) {
    const baseName = `dataInput_${paramId}_${partIndex}`;
	const key = parts[partIndex].trim().toUpperCase(); // <-- exact key for this input (e.g., "SOP" or "ALB")

    if (vtype === "yesno") {
        return `
            <select name="${baseName}" class="form-control form-control-sm text-center" data-key="${key}" data-when-parts='${JSON.stringify(parts)}'
			 oninput="validateField(this, '${passif}', '${value1}', '${value2}')" data-index="2" >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
            </select>
        `;
    } else if (vtype === "number") {
        return `
            <input type="number" class="form-control form-control-sm text-center" data-key="${key}" data-when-parts='${JSON.stringify(parts)}'  oninput="validateField(this, '${passif}', '${value1}', '${value2}')" 
                   name="${baseName}" placeholder="Enter Number" data-index="3" />
        `;
	} else if (vtype === "date") {
	    return `
	        <input type="date" class="form-control form-control-sm text-center" data-key="${key}" data-when-parts='${JSON.stringify(parts)}'  oninput="validateField(this, '${passif}', '${value1}', '${value2}')" 
	               name="${baseName}" placeholder="Enter Number" data-index="1" />
	    `;
	} else { // default: text
        return `
            <input type="text" class="form-control form-control-sm text-center" data-key="${key}" data-when-parts='${JSON.stringify(parts)}' oninput="validateField(this, '${passif}', '${value1}', '${value2}')" 
                   name="${baseName}" placeholder="Enter Text"  data-index="0" />
        `;
    }
}

function validateField(input, passif, value1, value2) {
    let val = input.value.trim();
    let isValid = false;

    // If no validation rule, don't mark invalid
    if (!passif) {
        input.style.border = ""; // reset border
        return true; 
    }

    if (passif === "Between") {
        let num = parseFloat(val);
        isValid = !isNaN(num) && num >= parseFloat(value1) && num <= parseFloat(value2);
    }
    else if (passif === "Not_between") {
        let num = parseFloat(val);
        isValid = !isNaN(num) && (num < parseFloat(value1) || num > parseFloat(value2));
    }
    else if (passif === "Equal") {
        isValid = val === value1;
    }
    else if (passif === "Greater_than") {
        let num = parseFloat(val);
        isValid = !isNaN(num) && num > parseFloat(value1);
    }
    else if (passif === "Less_than") {
        let num = parseFloat(val);
        isValid = !isNaN(num) && num < parseFloat(value1);
    }
    else if (passif === "Yes" || passif === "No") {
        isValid = val.toLowerCase() === passif.toLowerCase();
    }

    // Apply border color
    if (isValid) {
        input.style.border = "2px solid green";
    } else {
        input.style.border = "2px solid red";
    }

    return isValid;
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
		
/*		$footerCloseBtn.text("Go to PH Sheet");
		$footerCloseBtn.removeClass("btn-secondary").addClass("btn-success");

		$footerCloseBtn.off("click").on("click", function () {
			if (currentMachineId) {
				//  taking transitionbaseUrl from WebPageController.java which was set up in the application properties
				// and was injected in the html before every <script> tag
				window.location.href = `${transitionbaseUrl}/WebApplication/producthistorysheet?machineId=${currentMachineId}`;
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


/* submit button clicked */
$('#submitMachineCheckSheet').click(function() {
	
	// 🔒 HARD LOCK — UI level ( because otherise the user can double-click before AJAX fires. )
	if ($(this).prop("disabled")) {
	    return;
	}
	$('#submitMachineCheckSheet')
	.text("disabled")
	    .prop('disabled', true)
	    .css({
	        pointerEvents: "none",
	        opacity: 0.6
	    });
		
		
	const dataToSend = [];
	let invalidDate = false; // for blocking when the date is due date passed 
	
	if ($(this).data("submitted")) { // will run it for just only in frontend so this not work when page refreshed.
	     alert("This machine check sheet is already filled.");
	     return;
	 }
	 
	console.log("Submitting for machine ID:", currentMachineId);
	const shift = $("#upper_mcs_form_body input[name='shift']").val();
	const logicalShiftDateTime= $('#backendLogicalDateTimeText').text().trim();
	
	console.log("shift", shift);
	$('#machcheckformBody .row').each(function(index) {
		
		// taking data from hidden input created in form createMCSFormBody()
		const paramId = $(this).find(`input[name='paramId_${index}']`).val();
		// if (!paramId) return; // now not in use
		const linkId = $(this).find(`input[name='linkId_${index}']`).val(); //  capture linkId
		console.log("linkId", linkId);
		 if (!linkId) {
			alert("Linkid Not Found");
			$('#submitMachineCheckSheet').prop('disabled', false).text("Submit Machine Check Sheet")
			.css({
			    pointerEvents: "auto",
			    opacity: 1
			});
			return; // ensure we have it
		 }
		 
		 // collecting from hidden inputs.
		 const howText = $(this).find(`input[name='howText_${index}']`).val()?.trim() || null;
		 const whoText = $(this).find(`input[name='whoText_${index}']`).val()?.trim() || null;
		 const whenText = $(this).find(`input[name='whenText_${index}']`).val()?.trim() || null;
		 const parameter = $(this).find(`input[name='parameter_${index}']`).val()?.trim() || null;
		 const ptype = $(this).find(`input[name='ptype_${index}']`).val() || null;
		 const dateText = $(this).find(`input[name='dateText_${index}']`).val()?.trim() || null;
		 const vtype = $(this).find(`input[name='vtype_${index}']`).val()?.trim() || null;
		 
		 const passif = $(this).find(`input[name='passif_${index}']`).val()?.trim() || null;
		 const value1 = $(this).find(`input[name='value1_${index}']`).val()?.trim() || null;
		 const value2 = $(this).find(`input[name='value2_${index}']`).val()?.trim() || null;

		 
		const currentLssId = $(this).find(`input[name='lssId_${index}']`).val();// taking data from the hidden input created 

		// 👇 Collect dynamic inputs into JSON
		const inputData = {};
		const jigNumber = $('#jigNumberInput').val()?.trim() || null;

		const whenParts = $(this).find("[data-when-parts]").first().data("whenParts") || []; // store parts when rendering form

		console.log("whenParts", whenParts);
		whenParts.forEach((part, partIndex) => {
			const key = part.trim().toUpperCase();  // normalize (trim + case)
		    const val = $(`input[name='dataInput_${paramId}_${partIndex}'], select[name='dataInput_${paramId}_${partIndex}']`).val();
		    inputData[key] = val || null;
		});
		
		const operatorSign = $('#operator-sign').val()?.trim() || null;
		// const inchargeSign = $('#incharge-sign').val()?.trim() || null;
		
		const dueDate = $(`#due-${paramId}`).val() || null;
		const doneDate = $(`#done-${paramId}`).val() || null;
		// 👇 fetch the due_text label from the DOM
		//  const dueTextLabel = $(this).find(`#due-${paramId}`).prev(".small").text() || " ";
		const dueTextLabel = $(this).find(`#due-${paramId}`).prev(".small").text().trim()
		    || $(this).find(`#due-${paramId}`).closest(".bordered").children("div").first().text().trim() || "Due Date";

		// --- Validation: mandatory dates ---
/*		if (!dueDate || !doneDate) {
		    alert(`⚠️ Please select all the Date.`);
		    invalidDate = true;
		    // return; // stop current row loop
			 return false; // ✅ breaks out of .each completely
		}*/
/*		if (!doneDate) {
		    alert(`⚠️ Please select a Done Date for [${dueTextLabel}].`);
		    invalidDate = true;
		     return;
			// return false; // ✅ breaks out of .each completely
		}*/
		
		// --- Validate due date not expired---
		if (dueDate) {

			const today = new Date();
			today.setHours(0, 0, 0, 0); // midnight today

			const due = new Date(dueDate);
			due.setHours(0, 0, 0, 0);   // midnight due date
			
		    if (due <= today) {
		        alert(`⚠️ The due date (${dueDate}) for [${dueTextLabel}] is today or already passed.`);
				invalidDate = true; // used later to stop whole submission
				$('#submitMachineCheckSheet').prop('disabled', false).text("Submit Machine Check Sheet")
				.css({
				    pointerEvents: "auto",
				    opacity: 1
				});
		        return; // stop current for each loop
		    }
			
			// --- Validate done < due ---
			if (doneDate) {
			    const done = new Date(doneDate);
			    if (done >= due) {
			        alert(`⚠️ The due date (${dueDate})  must be greater than the done date (${doneDate}) for [${dueTextLabel}].`);
			        invalidDate = true; // used later to stop whole submission
					$('#submitMachineCheckSheet').prop('disabled', false).text("Submit Machine Check Sheet")
					.css({
					    pointerEvents: "auto",
					    opacity: 1
					});
			        return; // stop current for each loop
			    }
			}
		}
		


		dataToSend.push({
			field: { rowId: paramId },    // ✅ fieldId maps to MachineCheckSheetField.rowid
			link: { rowId: linkId },      // ✅ matches MachineCheckSheetLink.linkId
			lineStationSheetMapping: { id: currentLssId }, // ✅ matches entity
			dateDue: dueDate,
			dateDone: doneDate,
			inputData: JSON.stringify(inputData),  // ✅ send JSON string
			operatorSign: operatorSign,
			// inchargeSign: inchargeSign,
			jigNo: jigNumber,
			shift: shift,
			parameter: parameter,
			howText: howText,
			whoText: whoText,
			whenText: whenText,
			ptype: ptype,
			dateText: dateText,
			vtype: vtype,
			logicalShiftDateTime
		});
	});
	
	if (invalidDate) {
		$('#submitMachineCheckSheet').prop('disabled', false).text("Submit Machine Check Sheet")
		.css({
		    pointerEvents: "auto",
		    opacity: 1
		});
	    return; // stop whole submit handler
	}

	console.log("dataToSend", JSON.stringify(dataToSend, null, 2));

	let url = resumeMode
	  ? `/WebApplication/Controllers/mcs/save-machine-user-input/resume/${lineStationSheetMappingId}`
	  : `/WebApplication/Controllers/mcs/save-machine-user-input/${lineStationSheetMappingId}`;
	  
	  if (dataToSend.length === 0) {
	      alert("⚠️ No valid data to submit.");
	      $('#submitMachineCheckSheet').prop('disabled', false).text("Submit Machine Check Sheet");

	      return;
	  }

	$.ajax({
		// url: "/WebApplication/Controllers/mcs/save-machine-user-input",
		url: url,
		method: "POST",
		headers: {
			Authorization: `Bearer ${sessionStorage.getItem('token')}`
		},
		contentType: "application/json",
		data: JSON.stringify(dataToSend),
		success: function (response) {
		    // ✅ Success modal
			showResponseModal(response, true); // ✅ Green success message

			// Reset the form after successful submission
			resetForm();
			
			// prevent resubmission
		$('#submitMachineCheckSheet').data("submitted", true);
		
		// 		✔ Prevents accidental edits
		// ✔ Matches backend finalization
		$('#machcheckformBody input, #machcheckformBody select')
		    .prop('disabled', true);
		$('#operator-sign, #jigNumberInput').prop('disabled', true);

		},
		error: function(response, status, error) {

			console.error("Submission error:", error);
			console.error("response.responseText:", response.responseText);
			// 🔓 UNLOCK only on error
			$('#submitMachineCheckSheet')
			    .prop('disabled', false)
				.text("Submit Machine Check Sheet")
			    .css({
			        pointerEvents: "auto",
			        opacity: 1
			    });

			let message = response.responseText || "Failed to save.";
			showResponseModal(message, false); // ❌ Red error message
		}
	});
});

// Function to reset the form
function resetForm() {
	// Reset form inputs and select elements within the form body
	$('#machcheckformBody input[type="text"], #machcheckformBody input[type="date"], #machcheckformBody input[type="number"], #machcheckformBody input[type="hidden"]').val('');

	// If you have select elements or other form elements, reset them too
	$('#machcheckformBody select').prop('selectedIndex', 0); // For select elements
	
	// Reset operator and incharge sign inputs
	$('#operator-sign').val('');
  	$('#jigNumber').val('');
}

