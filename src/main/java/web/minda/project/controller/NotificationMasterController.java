package web.minda.project.controller;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
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
import web.minda.project.entity.NotificationMaster;
import web.minda.project.helper.ExcelUploadHelper;
import web.minda.project.repositories.DepartmentMasterRepository;
import web.minda.project.repositories.NotificationMasterRepository;
import web.minda.project.service.DateTimeService;
import web.minda.project.service.ZebraUsbPrinterService;

@RestController
@RequestMapping("/Controllers")
public class NotificationMasterController {

	@Autowired
	NotificationMasterRepository notificationMasterRepositoryObject;

	@Autowired
	DepartmentMasterRepository departmentMasterRepositoryObject;

	@Autowired
	private DateTimeService dateTimeService;

	@Autowired
	private ZebraUsbPrinterService printerService;

	@Value("${qa.upload.path}")
	private String folderPath;

	@Autowired
	private Environment env;

	@PostMapping("/insertNotificationMaster")
	public ResponseEntity<Object> insertNotificationMaster(@RequestBody NotificationMaster jsonObject) {

		try {

			Optional<DepartmentMaster> optionObject = departmentMasterRepositoryObject
					.findByDepartmentName(jsonObject.getDepartmentName());

			if (!optionObject.isPresent()) {
				return new ResponseEntity<>("Department not found.", HttpStatus.NOT_ACCEPTABLE);
			}
			
			DepartmentMaster department = optionObject.get();
			boolean exists = notificationMasterRepositoryObject.existsByOperation(jsonObject.getOperation());

			if (!exists) {
				
				jsonObject.setDepartment(department);
				jsonObject.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
				jsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

				notificationMasterRepositoryObject.save(jsonObject);

				return new ResponseEntity<>("Data added successfully.", HttpStatus.OK);
			} else {

				return new ResponseEntity<>("Operation already exist.", HttpStatus.NOT_ACCEPTABLE);

			}
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("Something went wrong.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/editNotificationMaster")
	public ResponseEntity<Object> editNotificationMaster(@RequestBody NotificationMaster jsonObject) {

		try {

			if (jsonObject.getNotificationId() == null) {
				return new ResponseEntity<>("Notification Id not found.", HttpStatus.NOT_ACCEPTABLE);
			}

//			Optional<NotificationMaster> notificationOpt = notificationMasterRepositoryObject.findById(jsonObject.getRackId());
//			if (notificationOpt.isEmpty()) {
//				return new ResponseEntity<>("Rack not found.", HttpStatus.NOT_ACCEPTABLE);
//			}

			Optional<DepartmentMaster> optionObject = departmentMasterRepositoryObject
					.findByDepartmentName(jsonObject.getDepartment().getDepartmentName());

			if (optionObject.isEmpty()) {
				return new ResponseEntity<>("Department not found.", HttpStatus.NOT_ACCEPTABLE);
			}

			DepartmentMaster department = optionObject.get();

			boolean exists = notificationMasterRepositoryObject.existsByOperationAndNotificationIdNot(
					jsonObject.getOperation(), jsonObject.getNotificationId());

			if (exists) {
				return new ResponseEntity<>("Data already exist.", HttpStatus.NOT_ACCEPTABLE);
			}
			
			
			jsonObject.setDepartment(department);
			jsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

			notificationMasterRepositoryObject.save(jsonObject);

			return new ResponseEntity<>("Data updated successfully.", HttpStatus.OK);

		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/deleteNotificationMaster/{id}")
	public ResponseEntity<Object> deleteNotificationMaster(@PathVariable Long id) {
		try {
			this.notificationMasterRepositoryObject.deleteById(id);
			return new ResponseEntity<Object>("Data deleted successfully", HttpStatus.OK);
		} catch (DataIntegrityViolationException e) {
			return new ResponseEntity<Object>("Unable to delete Data due to mapping", HttpStatus.CONFLICT);
		} catch (Exception e) {
			return new ResponseEntity<Object>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/download/template/notification")
	public void notificationTemplate(HttpServletResponse response) throws IOException {
		response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		ServletOutputStream outputStream = response.getOutputStream();
		String[] headerList = new String[] { "Department Name", "Operation", "Description" , "Duration", "Unit"};
		int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256 };
		ByteArrayInputStream excelFile = ExcelController.generateExcelTemplate(headerList, COLUMN_WIDTHS,
				"Notification Master");
		response.getOutputStream().write(excelFile.readAllBytes());
		outputStream.flush();
	}

//	@GetMapping("/download/data/notification")
//	public void exportnotificationData(HttpServletResponse response) throws IOException {
//		try {
//			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
//			List<NotificationMaster> list = this.notificationMasterRepositoryObject.getAllNotificationMaster();
//			String[] headerList = new String[] { "Department Name", "Operation", "Description" , "Duration", "Unit",
//					"Created By", "Date & Time" };
//			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
//					25 * 256, 30 * 256 };
//
//			List<Function<NotificationMaster, Object>> getters = Arrays.asList(
//					notification -> notification.getDepartment() != null ? notification.getDepartment().getDepartmentName() : "",
//					NotificationMaster::getOperation, NotificationMaster::getDescription, NotificationMaster::getDuration,
//					NotificationMaster::getUnit, NotificationMaster::getCreatedBy,
//					NotificationMaster::getDateTimeModified);
//
//			ByteArrayInputStream excelFile = ExcelController.generateExcelData(list, getters, headerList, COLUMN_WIDTHS,
//					"Rack Master");
//			ServletOutputStream outputStream = response.getOutputStream();
//			response.getOutputStream().write(excelFile.readAllBytes());
//			outputStream.flush();
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//	}

	@PostMapping("/download/data/notification")
	public void exportToNotificationExcel(HttpServletResponse response, @RequestBody NotificationMaster jsonObject)
			throws IOException {
		try {
			// Set the content type to Excel file
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

			// Fetch data from the repository as a List<PlantMaster>
			List<NotificationMaster> listObject = this.notificationMasterRepositoryObject.getAllNotificationMaster(jsonObject.getDepartmentName(), jsonObject.getOperation(),
					jsonObject.getDuration(), jsonObject.getUnit(), jsonObject.getCreatedBy());

			String[] headerList = new String[] { "Department Name", "Operation", "Description" , "Duration", "Unit",
					"Created By", "Date & Time" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256 };
			
			List<Function<NotificationMaster, Object>> getters = Arrays.asList(
					notification -> notification.getDepartment() != null ? notification.getDepartment().getDepartmentName() : "",
					NotificationMaster::getOperation, NotificationMaster::getDescription, NotificationMaster::getDuration,
					NotificationMaster::getUnit, NotificationMaster::getCreatedBy,
					NotificationMaster::getDateTimeModified);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(listObject, getters, headerList,
					COLUMN_WIDTHS, "Notification Master");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();

		}
	}

	@PostMapping("/getLikeNotification/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getLikeNotification(@PathVariable("pageNum") int page,
			@PathVariable("pageSize") int pageSize, @RequestBody NotificationMaster jsonObject) {

		try {
			Pageable pageable = PageRequest.of(page, pageSize);
			Page<NotificationMaster> object = this.notificationMasterRepositoryObject.getLikeNotification(
					jsonObject.getDepartmentName(), jsonObject.getOperation(),
					jsonObject.getDuration(), jsonObject.getUnit(), jsonObject.getCreatedBy(), pageable);
			System.out.println(object);
			return new ResponseEntity<Object>(object, HttpStatus.OK);

		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<Object>("ng", HttpStatus.OK);
		}
	}

	@PostMapping("/uploadNotification/{employeeId}")
	public ResponseEntity<Object> uploadNotification(@RequestParam("file") MultipartFile file,
			@PathVariable("employeeId") String employeeId) {

		if (!"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet".equals(file.getContentType())) {
			return new ResponseEntity<>("Please upload XLSX file.", HttpStatus.BAD_REQUEST);
		}

		List<String> errorList = new ArrayList<>();
		errorList.add("Errors , Row");

		try (InputStream is = file.getInputStream();
				OPCPackage opcPackage = OPCPackage.open(is);
				XSSFWorkbook workbook = new XSSFWorkbook(opcPackage)) {

			XSSFSheet sheet = workbook.getSheet("Notification Master");

			if (sheet == null) {
				return new ResponseEntity<>("Notification Master sheet not found.", HttpStatus.NOT_FOUND);
			}

			Iterator<Row> rows = sheet.iterator();

			if (rows.hasNext())
				rows.next();

			while (rows.hasNext()) {
				String locationCodeString = null;

				Row currentRow = rows.next();

				if (currentRow == null || currentRow.getLastCellNum() <= 0) {
					continue;
				}

				NotificationMaster upload = new NotificationMaster();

				for (int cellIdx = 0; cellIdx < currentRow.getLastCellNum(); cellIdx++) {

					Cell currentCell = currentRow.getCell(cellIdx);

					switch (cellIdx) {

					case 0:
						String departmentName = ExcelUploadHelper.getStringCellValue(currentCell).trim();
						Optional<DepartmentMaster> optionObjectional = departmentMasterRepositoryObject
								.findByDepartmentName(departmentName);

						if (optionObjectional.isPresent()) {
							upload.setDepartment(optionObjectional.get());
							upload.setDepartmentName(departmentName);
						} else {
							errorList.add("Department not found , " + (currentRow.getRowNum() + 1));
						}
						break;

					case 1:

						String operation = ExcelUploadHelper.getStringCellValue(currentCell).trim();
						upload.setOperation(operation);
						break;

					case 2:
						String description = ExcelUploadHelper.getStringCellValue(currentCell).trim();
						upload.setDescription(description);

						break;
						
					case 3:
						String duration = ExcelUploadHelper.getStringCellValue(currentCell).trim();
						upload.setDuration(duration);

						break;
						
					case 4:
						String unit = ExcelUploadHelper.getStringCellValue(currentCell).trim();
						upload.setUnit(unit);

						break;

					default:
						break;
					}
				}

				if (upload.getDepartment() == null) {
					errorList.add("Department missing , " + (currentRow.getRowNum() + 1));
					continue;
				}

				
				boolean exists = notificationMasterRepositoryObject.existsByOperation(upload.getOperation());

				if (exists) {
					errorList.add("Rack already exists , " + (currentRow.getRowNum() + 1));
					continue;
				}

//				boolean exists = notificationMasterRepositoryObject.existsByRackCode(
//						upload.getDepartment().getCode() + "-" + upload.getRackName() + "." + formattedNumber);
//
//				if (exists) {
//					errorList.add("Rack already exists , " + (currentRow.getRowNum() + 1));
//					continue;
//				}
				
				upload.setCreatedBy(employeeId);
				upload.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
				upload.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

				notificationMasterRepositoryObject.save(upload);
			}

			Map<String, Object> responseMap = new HashMap<>();
			responseMap.put("message", "Excel uploaded successfully.");
			responseMap.put("errorList", errorList);

			return new ResponseEntity<>(responseMap, HttpStatus.OK);

		} catch (Exception e) {

			return new ResponseEntity<>("Upload failed : " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
//
//	@GetMapping("/printRackBarcode/{barcode}")
//	public ResponseEntity<Object> qaAction(@PathVariable String barcode) {
//		Map<String, Object> response = new HashMap<>();
//
//		try {
//
//			// Printer + Template
//			String printerName = env.getProperty("printer.iot");
//			String template = env.getProperty("zebra.notification.label.template");
//
//			try {
//				String zpl = String.format(template, barcode, barcode);
//
//				printerService.printZpl(printerName, zpl);
//
//			} catch (Exception e) {
//				System.out.println("" + e.getMessage());
//			}
//
//			return new ResponseEntity<>("Print Successfully", HttpStatus.OK);
//
//		} catch (Exception e) {
//			e.printStackTrace();
//
//			response.put("status", false);
//			response.put("message", "QA Action Failed");
//
//			return new ResponseEntity<>("Upload failed : " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
//		}
//	}

}
