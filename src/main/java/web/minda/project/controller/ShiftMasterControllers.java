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
import web.minda.project.entity.DepartmentMaster;
import web.minda.project.entity.DevicesMaster;
import web.minda.project.entity.ProcessMaster;
import web.minda.project.entity.ShiftMaster;
import web.minda.project.helper.ExcelUploadHelper;
import web.minda.project.repositories.ProcessMasterRepository;
import web.minda.project.repositories.ShiftMasterRepository;
import web.minda.project.service.DateTimeService;

@RestController
@RequestMapping("/Controllers")
public class ShiftMasterControllers {

	@Autowired
	ShiftMasterRepository shiftMasterRepository;
	ShiftMaster masterObject = new ShiftMaster();
	
	@Autowired
	private DateTimeService dateTimeService;

	@PostMapping("/insertShiftMaster")
	public ResponseEntity<Object> insertShiftMaster(@RequestBody ShiftMaster JsonObject) {
		try {
			if (!this.shiftMasterRepository.existsByShiftName(JsonObject.getShiftName())) {

				JsonObject.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
				JsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

				this.shiftMasterRepository.save(JsonObject);
				return new ResponseEntity<>("Data added successfully.", HttpStatus.OK);
			} else {
				return new ResponseEntity<>("Data code already exist.", HttpStatus.NOT_ACCEPTABLE);
			}
		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<>("Something went wrong.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/editShiftMaster")
	public ResponseEntity<Object> editShiftMaster(@RequestBody ShiftMaster jsonObject) {
		try {
			if (jsonObject.getShiftId() == null){
				return new ResponseEntity<>("Data code not found.", HttpStatus.NOT_ACCEPTABLE);
			} else {
				jsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());
				this.shiftMasterRepository.save(jsonObject);
				return new ResponseEntity<>("Data updated successfully.", HttpStatus.OK);
			}
		} catch (Exception e) {
			return new ResponseEntity<Object>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/deleteshift/{id}")
	public ResponseEntity<Object> deleteshift(@PathVariable Long id) {
		try {
			this.shiftMasterRepository.deleteById(id);
			return new ResponseEntity<Object>("Data deleted successfully", HttpStatus.OK);
		} catch (DataIntegrityViolationException e) {
			Optional<ShiftMaster> object = this.shiftMasterRepository.findById(id);
			return new ResponseEntity<Object>(
					"Unable to delete Data due to mapping"+object,
					HttpStatus.CONFLICT);
		} catch (Exception e) {
			return new ResponseEntity<Object>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}



	@GetMapping("/download/template/shift")
	public void shiftTemplate(HttpServletResponse response) throws IOException {
		response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		ServletOutputStream outputStream = response.getOutputStream();
		String[] headerList = new String[] { "Shift Name", "Description", "Start","End"};
		int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256 };
		ByteArrayInputStream excelFile = ExcelController.generateExcelTemplate(headerList, COLUMN_WIDTHS,
				"Shift Master");
		response.getOutputStream().write(excelFile.readAllBytes());
		outputStream.flush();
	}

//	@GetMapping("/download/data/shift")
//	public void exportshiftData(HttpServletResponse response) throws IOException {
//		try {
//			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
//			List<ShiftMaster> list = this.shiftMasterRepository.getalldata();
//			String[] headerList = new String[] { "Shift Name", "Description", "Start","End","Status", "Created By", "Date & Time" };
//			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
//					25 * 256, 30 * 256 };
//
//			List<Function<ShiftMaster, Object>> getters = Arrays.asList(ShiftMaster::getShiftName,
//					ShiftMaster::getDescription, ShiftMaster::getShiftStart,ShiftMaster::getShiftEnd,
//					ShiftMaster::getStatus, ShiftMaster::getCreatedBy, ShiftMaster::getDateTimeModified);
//
//			ByteArrayInputStream excelFile = ExcelController.generateExcelData(list, getters, headerList,
//					COLUMN_WIDTHS, "Shift Master");
//			ServletOutputStream outputStream = response.getOutputStream();
//			response.getOutputStream().write(excelFile.readAllBytes());
//			outputStream.flush();
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//	}
	
	@PostMapping("/download/data/shift")
	public void exportToExcel(HttpServletResponse response, @RequestBody ShiftMaster jsonObject) throws IOException {
		try {
			// Set the content type to Excel file
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

			// Fetch data from the repository as a List<PlantMaster>
			List<ShiftMaster> listObject = this.shiftMasterRepository.getAllShiftMaster(jsonObject.getShiftName(),
					jsonObject.getDescription(), jsonObject.getShiftStart(),jsonObject.getShiftEnd(),
					jsonObject.getStatus(), jsonObject.getCreatedBy());


			String[] headerList = new String[] { "Shift Name", "Description", "Start","End","Status", "Created By", "Date & Time" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256 };

			List<Function<ShiftMaster, Object>> getters = Arrays.asList(ShiftMaster::getShiftName,
					ShiftMaster::getDescription, ShiftMaster::getShiftStart,ShiftMaster::getShiftEnd,
					ShiftMaster::getStatus, ShiftMaster::getCreatedBy, ShiftMaster::getDateTimeModified);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(listObject, getters, headerList,
					COLUMN_WIDTHS, "Shift Master");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();

		}
	}

	@PostMapping("/getLikeshift/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getLikeShift(@PathVariable("pageNum") int page,
			@PathVariable("pageSize") int pageSize, @RequestBody ShiftMaster jsonObject) {

		try {
			System.out.println(jsonObject);
			Pageable pageable = PageRequest.of(page, pageSize);
			Page<ShiftMaster> object = this.shiftMasterRepository.getLikeShift(jsonObject.getShiftName(),
					jsonObject.getDescription(), jsonObject.getShiftStart(),jsonObject.getShiftEnd(),
					jsonObject.getStatus(), jsonObject.getCreatedBy(), pageable);
			System.out.println(object);
			return new ResponseEntity<Object>(object, HttpStatus.OK);

		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<Object>("ng", HttpStatus.OK);
		}
	}
	
	
	
	@PostMapping("/uploadshift/{employeeId}")
	public ResponseEntity<Object> uploadshift(@RequestParam("file") MultipartFile file,
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

	        XSSFSheet sheet = workbook.getSheet("Shift Master");

	        if (sheet == null) {
	            return new ResponseEntity<>("Shift Master sheet not found.",
	                    HttpStatus.NOT_FOUND);
	        }

	        Iterator<Row> rows = sheet.iterator();

	        if (rows.hasNext()) rows.next();

	        while (rows.hasNext()) {

	            Row currentRow = rows.next();

	            if (currentRow == null || currentRow.getLastCellNum() <= 0) {
	                continue;
	            }

	            ShiftMaster upload = new ShiftMaster();

	            for (int cellIdx = 0; cellIdx < currentRow.getLastCellNum(); cellIdx++) {

	                Cell currentCell = currentRow.getCell(cellIdx);

	                String value = ExcelUploadHelper.getStringCellValue(currentCell).trim();

	                switch (cellIdx) {

	                case 0:
	                    upload.setShiftName(value);
	                    break;

	                case 1:
	                    upload.setDescription(value);
	                    break;

	                case 2:
	                    upload.setShiftStart(value);
	                    break;
	                    
	                case 3:
	                    upload.setShiftEnd(value);
	                    break;
	            
	                default:
	                    break;
	                }
	            }


	            if (upload.getShiftName() == null || upload.getShiftName().isEmpty()) {
	                errorList.add("Device Name missing , " + (currentRow.getRowNum() + 1));
	                continue;
	            }

	            boolean exists = shiftMasterRepository
	                    .existsByShiftName(upload.getShiftName());

	            if (exists) {
	                errorList.add("Device already exists , " + (currentRow.getRowNum() + 1));
	                continue;
	            }

	            upload.setCreatedBy(employeeId);
	            upload.setStatus("1");
	            upload.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
	            upload.setDateTimeModified(dateTimeService.getCurrentDateAndTime());
	            shiftMasterRepository.save(upload);
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
