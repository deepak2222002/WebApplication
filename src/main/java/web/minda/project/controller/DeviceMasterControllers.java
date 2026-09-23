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
import web.minda.project.entity.DevicesMaster;
import web.minda.project.entity.MachineMaster;
import web.minda.project.entity.ProcessMaster;
import web.minda.project.helper.ExcelUploadHelper;
import web.minda.project.repositories.DevicesMasterRepository;
import web.minda.project.repositories.ProcessMasterRepository;
import web.minda.project.service.DateTimeService;

@RestController
@RequestMapping("/Controllers")
public class DeviceMasterControllers {

	@Autowired
	DevicesMasterRepository devicesMasterRepository;
	DevicesMaster masterObject = new DevicesMaster();
	
	@Autowired
	private DateTimeService dateTimeService;

	@PostMapping("/insertDeviceMaster")
	public ResponseEntity<Object> insertDeviceMaster(@RequestBody DevicesMaster JsonObject) {
		try {
			if (!this.devicesMasterRepository.existsByDeviceName(JsonObject.getDeviceName())) {

				JsonObject.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
				JsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

				this.devicesMasterRepository.save(JsonObject);
				return new ResponseEntity<>("Data added successfully.", HttpStatus.OK);
			} else {
				return new ResponseEntity<>("Data code already exist.", HttpStatus.NOT_ACCEPTABLE);
			}
		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<>("Something went wrong.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/editDevicesMaster")
	public ResponseEntity<Object> editDevicesMaster(@RequestBody DevicesMaster jsonObject) {
		try {
			if (jsonObject.getDevicesId() == null) {
				return new ResponseEntity<>("Data code not found.", HttpStatus.NOT_ACCEPTABLE);
			} else {
				jsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());
				this.devicesMasterRepository.save(jsonObject);
				return new ResponseEntity<>("Data updated successfully.", HttpStatus.OK);
			}
		} catch (Exception e) {
			return new ResponseEntity<Object>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/deleteDevice/{id}")
	public ResponseEntity<Object> deletedevice(@PathVariable Long id) {
		try {
			this.devicesMasterRepository.deleteById(id);
			return new ResponseEntity<Object>("Data deleted successfully", HttpStatus.OK);
		} catch (DataIntegrityViolationException e) {
			Optional<DevicesMaster> object = this.devicesMasterRepository.findById(id);
			return new ResponseEntity<Object>(
					"Unable to delete Data due to mapping",
					HttpStatus.CONFLICT);
		} catch (Exception e) {
			return new ResponseEntity<Object>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}




	@GetMapping("/download/template/device")
	public void processTemplate(HttpServletResponse response) throws IOException {
		response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		ServletOutputStream outputStream = response.getOutputStream();
		String[] headerList = new String[] { "Device Name", "Description", "Address"};
		int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256 };
		ByteArrayInputStream excelFile = ExcelController.generateExcelTemplate(headerList, COLUMN_WIDTHS,
				"Device Master");
		response.getOutputStream().write(excelFile.readAllBytes());
		outputStream.flush();
	}

	@GetMapping("/download/data/device")
	public void exportprocessData(HttpServletResponse response) throws IOException {
		try {
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
			List<DevicesMaster> list = this.devicesMasterRepository.getalldata();
			String[] headerList = new String[] {"Device Name", "Description", "Address","Status", "Created By", "Date & Time" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256 };

			List<Function<DevicesMaster, Object>> getters = Arrays.asList(DevicesMaster::getDeviceName,
					DevicesMaster::getDescription, DevicesMaster::getAddress,
					DevicesMaster::getStatus, DevicesMaster::getCreatedBy, DevicesMaster::getDateTimeModified);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(list, getters, headerList,
					COLUMN_WIDTHS, "Device Master");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	@PostMapping("/download/data/device")
	public void exportToExcel(HttpServletResponse response, @RequestBody DevicesMaster jsonObject) throws IOException {
		try {
			// Set the content type to Excel file
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

			// Fetch data from the repository as a List<PlantMaster>
			List<DevicesMaster> listObject = this.devicesMasterRepository.getAllDeviceMaster(jsonObject.getDeviceName(),
					jsonObject.getDescription(), jsonObject.getAddress(),
					jsonObject.getStatus(), jsonObject.getCreatedBy());

			String[] headerList = new String[] {"Device Name", "Description", "Address","Status", "Created By", "Date & Time" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256 };

			List<Function<DevicesMaster, Object>> getters = Arrays.asList(DevicesMaster::getDeviceName,
					DevicesMaster::getDescription, DevicesMaster::getAddress,
					DevicesMaster::getStatus, DevicesMaster::getCreatedBy, DevicesMaster::getDateTimeModified);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(listObject, getters, headerList,
					COLUMN_WIDTHS, "Device Master");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();

		}
	}

	@PostMapping("/getLikeDevice/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getLikedevice(@PathVariable("pageNum") int page,
			@PathVariable("pageSize") int pageSize, @RequestBody DevicesMaster jsonObject) {

		try {
			System.out.println(jsonObject);
			Pageable pageable = PageRequest.of(page, pageSize);
			Page<DevicesMaster> object = this.devicesMasterRepository.getLikeDevice(jsonObject.getDeviceName(),
					jsonObject.getDescription(), jsonObject.getAddress(),
					jsonObject.getStatus(), jsonObject.getCreatedBy(), pageable);
			System.out.println(object);
			return new ResponseEntity<Object>(object, HttpStatus.OK);

		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<Object>("ng", HttpStatus.OK);
		}
	}
	
	
	@PostMapping("/uploaddevice/{employeeId}")
	public ResponseEntity<Object> uploaddevice(@RequestParam("file") MultipartFile file,
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

	        XSSFSheet sheet = workbook.getSheet("Device Master");

	        if (sheet == null) {
	            return new ResponseEntity<>("Device Master sheet not found.",
	                    HttpStatus.NOT_FOUND);
	        }

	        Iterator<Row> rows = sheet.iterator();

	        if (rows.hasNext()) rows.next();

	        while (rows.hasNext()) {

	            Row currentRow = rows.next();

	            if (currentRow == null || currentRow.getLastCellNum() <= 0) {
	                continue;
	            }

	            DevicesMaster upload = new DevicesMaster();

	            for (int cellIdx = 0; cellIdx < currentRow.getLastCellNum(); cellIdx++) {

	                Cell currentCell = currentRow.getCell(cellIdx);

	                String value = ExcelUploadHelper.getStringCellValue(currentCell).trim();

	                switch (cellIdx) {

	                case 0:
	                    upload.setDeviceName(value);
	                    break;

	                case 1:
	                    upload.setDescription(value);
	                    break;

	                case 2:
	                    upload.setAddress(value);
	                    break;
	            
	                default:
	                    break;
	                }
	            }


	            if (upload.getDeviceName() == null || upload.getDeviceName().isEmpty()) {
	                errorList.add("Device Name missing , " + (currentRow.getRowNum() + 1));
	                continue;
	            }

	            boolean exists = devicesMasterRepository
	                    .existsByDeviceName(upload.getDeviceName());

	            if (exists) {
	                errorList.add("Device already exists , " + (currentRow.getRowNum() + 1));
	                continue;
	            }

	            upload.setCreatedBy(employeeId);
	            upload.setStatus("1");
	            upload.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
	            upload.setDateTimeModified(dateTimeService.getCurrentDateAndTime());
	            devicesMasterRepository.save(upload);
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
