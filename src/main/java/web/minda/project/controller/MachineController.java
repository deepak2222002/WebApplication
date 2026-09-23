package web.minda.project.controller;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import web.minda.project.entity.CompoundDataMaster;
import web.minda.project.entity.LocationMaster;
import web.minda.project.entity.MachineMaster;
import web.minda.project.helper.ExcelUploadHelper;
import web.minda.project.repositories.MachineMasterRepository;
import web.minda.project.service.DateTimeService;

@RestController
@RequestMapping("/Controllers")
public class MachineController {

	@Autowired
	MachineMasterRepository machineMasterRepository;
	MachineMaster masterObject = new MachineMaster();
	
	@Autowired
	private DateTimeService dateTimeService;

	@PostMapping("/insertMachineMaster")
	public ResponseEntity<Object> insertMachineMaster(@RequestBody MachineMaster JsonObject) {
		try {
			if (!this.machineMasterRepository.existsByMachineName(JsonObject.getMachineName())) {

				JsonObject.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
				JsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

				this.machineMasterRepository.save(JsonObject);
				return new ResponseEntity<>("Data added successfully.", HttpStatus.OK);
			} else {
				return new ResponseEntity<>("Data code already exist.", HttpStatus.NOT_ACCEPTABLE);
			}
		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<>("Something went wrong.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/editMachineMaster")
	public ResponseEntity<Object> editMachineMaster(@RequestBody MachineMaster jsonObject) {
		try {
			if (jsonObject.getMachineId()== null) {
				return new ResponseEntity<>("Data code not found.", HttpStatus.NOT_ACCEPTABLE);
			} else {
				jsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());
				this.machineMasterRepository.save(jsonObject);
				return new ResponseEntity<>("Data updated successfully.", HttpStatus.OK);
			}
		} catch (Exception e) {
			return new ResponseEntity<Object>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("deleteMachineMaster/{id}")
	public ResponseEntity<Object> deletemachine(@PathVariable Long id) {
		try {
			this.machineMasterRepository.deleteById(id);
			return new ResponseEntity<Object>("Data deleted successfully", HttpStatus.OK);
		} catch (DataIntegrityViolationException e) {
			Optional<MachineMaster> object = this.machineMasterRepository.findById(id);
			return new ResponseEntity<Object>(
					"Unable to delete Data due to mapping",
					HttpStatus.CONFLICT);
		} catch (Exception e) {
			return new ResponseEntity<Object>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}



	@GetMapping("/download/template/machine")
	public void machineTemplate(HttpServletResponse response) throws IOException {
		response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		ServletOutputStream outputStream = response.getOutputStream();
		String[] headerList = new String[] { "Machine Name", "Description", "Barcode","Tonnage","Make","Data Record",
				"IP Address","Port","Status"};
		int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256,
			    30 * 256, 15 * 256, 25 * 256, 20 * 256,
			    20 * 256  };
		ByteArrayInputStream excelFile = ExcelController.generateExcelTemplate(headerList, COLUMN_WIDTHS,
				"Machine Master");
		response.getOutputStream().write(excelFile.readAllBytes());
		outputStream.flush();
	}


	
	@PostMapping("/download/data/machine")
	public void exportToExcel(HttpServletResponse response, @RequestBody MachineMaster jsonObject) throws IOException {
		try {
			// Set the content type to Excel file
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

			// Fetch data from the repository as a List<PlantMaster>
			List<MachineMaster> listObject = this.machineMasterRepository.getAllMachineMasters(jsonObject.getMachineName(),
					jsonObject.getDescription(), jsonObject.getBarcode(), jsonObject.getTonnage(),
					jsonObject.getStatus(), jsonObject.getCreatedBy());

			String[] headerList = new String[] { "Machine Name", "Description", "Barcode","Tonnage","Status", "Created By", "Date & Time" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256 };

			List<Function<MachineMaster, Object>> getters = Arrays.asList(MachineMaster::getMachineName,
					MachineMaster::getDescription, MachineMaster::getBarcode, MachineMaster::getTonnage,
					MachineMaster::getStatus, MachineMaster::getCreatedBy, MachineMaster::getDateTimeModified);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(listObject, getters, headerList,
					COLUMN_WIDTHS, "Machine Master");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();

		}
	}

	@PostMapping("/getLikeMachine/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getLikeMachine(@PathVariable("pageNum") int page,
			@PathVariable("pageSize") int pageSize, @RequestBody MachineMaster jsonObject) {

		try {
			System.out.println(jsonObject);
			Pageable pageable = PageRequest.of(page, pageSize);
			Page<MachineMaster> object = this.machineMasterRepository.getLikeMachine(jsonObject.getMachineName(),
					jsonObject.getDescription(), jsonObject.getBarcode(), jsonObject.getTonnage(),
					jsonObject.getStatus(), jsonObject.getCreatedBy(), pageable);
			System.out.println(object);
			return new ResponseEntity<Object>(object, HttpStatus.OK);

		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<Object>("ng", HttpStatus.OK);
		}
	}
	
	
	
	
	@PostMapping("/uploadmachine/{employeeId}")
	public ResponseEntity<Object> uploadmachine(@RequestParam("file") MultipartFile file,
	                                             @PathVariable("employeeId") String employeeId) {

	    if (!"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
	            .equals(file.getContentType())) {
	        return new ResponseEntity<>("Please upload XLSX file.", HttpStatus.BAD_REQUEST);
	    }

	    List<String> errorList = new ArrayList<>();
	    errorList.add("Errors , Row");

	    try (InputStream is = file.getInputStream();
	         OPCPackage opcPackage = OPCPackage.open(is);
	         XSSFWorkbook workbook = new XSSFWorkbook(opcPackage)) {

	        XSSFSheet sheet = workbook.getSheet("Machine Master");

	        if (sheet == null) {
	            return new ResponseEntity<>("Machine Master sheet not found.",
	                    HttpStatus.NOT_FOUND);
	        }

	        Iterator<Row> rows = sheet.iterator();

	        if (rows.hasNext()) rows.next();

	        while (rows.hasNext()) {

	            Row currentRow = rows.next();

	            if (currentRow == null || currentRow.getLastCellNum() <= 0) {
	                continue;
	            }

	            MachineMaster upload = new MachineMaster();

	            for (int cellIdx = 0; cellIdx < currentRow.getLastCellNum(); cellIdx++) {

	                Cell currentCell = currentRow.getCell(cellIdx);

	                String value = ExcelUploadHelper.getStringCellValue(currentCell).trim();

	                switch (cellIdx) {

	                case 0:
	                    upload.setMachineName(value);
	                    break;

	                case 1:
	                    upload.setDescription(value);
	                    break;

	                case 2:
	                    upload.setBarcode(value);
	                    break;

	                case 3:
	                    upload.setTonnage(value);
	                    break;
	                    
	                case 4:
	                    upload.setMake(value);
	                    break;
	                    
	                case 5:
	                    upload.setDataRecord(value);
	                    break;
	                    
	                case 6:
	                    upload.setIpAddress(value);
	                    break;
	                    
	                case 7:
	                    upload.setPort(value);
	                    break;
	                    
	                case 8:
	                    upload.setStatus(value);
	                    break;

	            
	                default:
	                    break;
	                }
	            }


	            if (upload.getMachineName() == null || upload.getMachineName().isEmpty()) {
	                errorList.add("Machine Name missing , " + (currentRow.getRowNum() + 1));
	                continue;
	            }

	            boolean exists = machineMasterRepository
	                    .existsByMachineName(upload.getMachineName());

	            if (exists) {
	                errorList.add("Machine already exists , " + (currentRow.getRowNum() + 1));
	                continue;
	            }

	            upload.setCreatedBy(employeeId);
	            upload.setStatus("1");
	            upload.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
	            upload.setDateTimeModified(dateTimeService.getCurrentDateAndTime());
	            machineMasterRepository.save(upload);
	        }

	        Map<String, Object> responseMap = new HashMap<>();
	        responseMap.put("message", "Excel uploaded successfully.");
	        responseMap.put("errorList", errorList);

	        return new ResponseEntity<>(responseMap, HttpStatus.OK);

	    } catch (IOException e) {

	        return new ResponseEntity<>("Excel parsing failed: " + e.getMessage(),
	                HttpStatus.INTERNAL_SERVER_ERROR);

	    } catch (Exception e) {

	        return new ResponseEntity<>("Unexpected error: " + e.getMessage(),
	                HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	
	
}
