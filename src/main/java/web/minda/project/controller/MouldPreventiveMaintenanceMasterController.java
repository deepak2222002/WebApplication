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
import web.minda.project.entity.MouldChildPartMaster;
import web.minda.project.entity.MouldPreventiveMaintenanceMaster;
import web.minda.project.helper.ExcelUploadHelper;
import web.minda.project.repositories.MouldPreventiveMaintenanceMasterRepository;
import web.minda.project.repositories.MouldChildPartMasterRepository;
import web.minda.project.repositories.MouldPreventiveMaintenanceMasterRepository;
import web.minda.project.service.DateTimeService;
import web.minda.project.service.ZebraUsbPrinterService;

@RestController
@RequestMapping("/Controllers")
public class MouldPreventiveMaintenanceMasterController {

	@Autowired
	MouldPreventiveMaintenanceMasterRepository mouldPreventiveMaintenanceMasterRepositoryObject;

	@Autowired
	MouldChildPartMasterRepository mouldChildPartMasterRepositoryObject;

	@Autowired
	private DateTimeService dateTimeService;

	@Autowired
	private ZebraUsbPrinterService printerService;

	@Value("${qa.upload.path}")
	private String folderPath;

	@Autowired
	private Environment env;

	@PostMapping("/insertMouldPreventiveMaintenanceMaster")
	public ResponseEntity<Object> insertMouldPreventiveMaintenanceMaster(
			@RequestBody MouldPreventiveMaintenanceMaster jsonObject) {

		try {

			Optional<MouldChildPartMaster> optionObject = mouldChildPartMasterRepositoryObject.findByChildPartName(jsonObject.getChildPartName());

			if (!optionObject.isPresent()) {
				return new ResponseEntity<>("Mould not found.", HttpStatus.NOT_ACCEPTABLE);
			}

			MouldChildPartMaster mappingObject = optionObject.get();
			boolean exists = mouldPreventiveMaintenanceMasterRepositoryObject
					.existsByMouldNameAndChildPartName(jsonObject.getChildPartName(), jsonObject.getChildPartName());

			if (!exists) {

				jsonObject.setMouldChildPart(mappingObject);
				jsonObject.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
				jsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

				mouldPreventiveMaintenanceMasterRepositoryObject.save(jsonObject);

				return new ResponseEntity<>("Data added successfully.", HttpStatus.OK);
			} else {

				return new ResponseEntity<>("Preventive Maintenance already exist.", HttpStatus.NOT_ACCEPTABLE);

			}
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("Something went wrong.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/editMouldPreventiveMaintenanceMaster")
	public ResponseEntity<Object> editMouldPreventiveMaintenanceMaster(
			@RequestBody MouldPreventiveMaintenanceMaster jsonObject) {

		try {

			if (jsonObject.getPreventiveMaintenanceId() == null) {
				return new ResponseEntity<>("Mould Preventive Maintenance Id not found.", HttpStatus.NOT_ACCEPTABLE);
			}

//			Optional<MouldPreventiveMaintenanceMaster> notificationOpt = mouldPreventiveMaintenanceMasterRepositoryObject.findById(jsonObject.getRackId());
//			if (notificationOpt.isEmpty()) {
//				return new ResponseEntity<>("Rack not found.", HttpStatus.NOT_ACCEPTABLE);
//			}

			Optional<MouldChildPartMaster> optionObject = mouldChildPartMasterRepositoryObject.findByChildPartName(jsonObject.getChildPartName());

			if (optionObject.isEmpty()) {
				return new ResponseEntity<>("Mould not found.", HttpStatus.NOT_ACCEPTABLE);
			}

			MouldChildPartMaster mappingObject = optionObject.get();

			boolean exists = mouldPreventiveMaintenanceMasterRepositoryObject
					.existsByMouldNameAndPreventiveMaintenanceIdNot(jsonObject.getChildPartName(),
							jsonObject.getPreventiveMaintenanceId());

			if (exists) {
				return new ResponseEntity<>("Data already exist.", HttpStatus.NOT_ACCEPTABLE);
			}

			jsonObject.setMouldChildPart(mappingObject);
			jsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

			mouldPreventiveMaintenanceMasterRepositoryObject.save(jsonObject);

			return new ResponseEntity<>("Data updated successfully.", HttpStatus.OK);

		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/deleteMouldPreventiveMaintenanceMaster/{id}")
	public ResponseEntity<Object> deleteMouldPreventiveMaintenanceMaster(@PathVariable Long id) {
		try {
			this.mouldPreventiveMaintenanceMasterRepositoryObject.deleteById(id);
			return new ResponseEntity<Object>("Data deleted successfully", HttpStatus.OK);
		} catch (DataIntegrityViolationException e) {
			return new ResponseEntity<Object>("Unable to delete Data due to mapping", HttpStatus.CONFLICT);
		} catch (Exception e) {
			return new ResponseEntity<Object>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/download/template/mouldPreventiveMaintenance")
	public void mouldPreventiveMaintenanceTemplate(HttpServletResponse response) throws IOException {
		response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		ServletOutputStream outputStream = response.getOutputStream();
		String[] headerList = new String[] { "Mould Name", "Child Part", "P.M Due Date", "Alert Days" };
		int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
				20 * 256, 20 * 256, 20 * 256, 20 * 256 };
		ByteArrayInputStream excelFile = ExcelController.generateExcelTemplate(headerList, COLUMN_WIDTHS,
				"Mould Preventive Maintenance Master");
		response.getOutputStream().write(excelFile.readAllBytes());
		outputStream.flush();
	}

//	@GetMapping("/download/data/notification")
//	public void exportnotificationData(HttpServletResponse response) throws IOException {
//		try {
//			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
//			List<MouldPreventiveMaintenanceMaster> list = this.mouldPreventiveMaintenanceMasterRepositoryObject.getAllMouldPreventiveMaintenanceMaster();
//			String[] headerList = new String[] { "Department Name", "Operation", "Description" , "Duration", "Unit",
//					"Created By", "Date & Time" };
//			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
//					25 * 256, 30 * 256 };
//
//			List<Function<MouldPreventiveMaintenanceMaster, Object>> getters = Arrays.asList(
//					notification -> notification.getSupplier() != null ? notification.getSupplier().getChildPartName() : "",
//					MouldPreventiveMaintenanceMaster::getChildPartName, MouldPreventiveMaintenanceMaster::getDescription, MouldPreventiveMaintenanceMaster::getDuration,
//					MouldPreventiveMaintenanceMaster::getUnit, MouldPreventiveMaintenanceMaster::getCreatedBy,
//					MouldPreventiveMaintenanceMaster::getDateTimeModified);
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

	@PostMapping("/download/data/mouldPreventiveMaintenance")
	public void exportToMouldPreventiveMaintenanceExcel(HttpServletResponse response,
			@RequestBody MouldPreventiveMaintenanceMaster jsonObject) throws IOException {
		try {
			// Set the content type to Excel file
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

			// Fetch data from the repository as a List<PlantMaster>
			List<MouldPreventiveMaintenanceMaster> listObject = this.mouldPreventiveMaintenanceMasterRepositoryObject
					.getAllMouldPreventiveMaintenanceMaster(jsonObject.getChildPartName(), jsonObject.getChildPartName(),
							jsonObject.getCreatedBy());

			String[] headerList = new String[] { "Mould Name", "Child Part", "P.M Due Date", "Alert Days", "Created By",
					"Date & Time" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256 };

			List<Function<MouldPreventiveMaintenanceMaster, Object>> getters = Arrays.asList(
					MouldPreventiveMaintenanceMaster::getChildPartName, MouldPreventiveMaintenanceMaster::getChildPartName,
					MouldPreventiveMaintenanceMaster::getPmDate, MouldPreventiveMaintenanceMaster::getAlertDays,
					MouldPreventiveMaintenanceMaster::getCreatedBy,
					MouldPreventiveMaintenanceMaster::getDateTimeModified);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(listObject, getters, headerList,
					COLUMN_WIDTHS, "Mould Preventive Maintenance Master");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();

		}
	}

	@PostMapping("/getLikeMouldPreventiveMaintenance/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getLikeMouldPreventiveMaintenance(@PathVariable("pageNum") int page,
			@PathVariable("pageSize") int pageSize, @RequestBody MouldPreventiveMaintenanceMaster jsonObject) {

		try {
			Pageable pageable = PageRequest.of(page, pageSize);
			Page<MouldPreventiveMaintenanceMaster> object = this.mouldPreventiveMaintenanceMasterRepositoryObject
					.getLikeMouldPreventiveMaintenance(jsonObject.getChildPartName(), jsonObject.getChildPartName(),
							jsonObject.getCreatedBy(), pageable);

			return new ResponseEntity<Object>(object, HttpStatus.OK);

		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<Object>("ng", HttpStatus.OK);
		}
	}

	@PostMapping("/uploadMouldPreventiveMaintenance/{employeeId}")
	public ResponseEntity<Object> uploadMouldPreventiveMaintenance(@RequestParam("file") MultipartFile file,
			@PathVariable("employeeId") String employeeId) {

		if (!"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet".equals(file.getContentType())) {
			return new ResponseEntity<>("Please upload XLSX file.", HttpStatus.BAD_REQUEST);
		}

		List<String> errorList = new ArrayList<>();
		errorList.add("Errors , Row");

		try (InputStream is = file.getInputStream();
				OPCPackage opcPackage = OPCPackage.open(is);
				XSSFWorkbook workbook = new XSSFWorkbook(opcPackage)) {

			XSSFSheet sheet = workbook.getSheet("Mould Master");

			if (sheet == null) {
				return new ResponseEntity<>("Mould Master sheet not found.", HttpStatus.NOT_FOUND);
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

				MouldPreventiveMaintenanceMaster upload = new MouldPreventiveMaintenanceMaster();

				for (int cellIdx = 0; cellIdx < currentRow.getLastCellNum(); cellIdx++) {

					Cell currentCell = currentRow.getCell(cellIdx);

					switch (cellIdx) {

					case 0:
						String chidlPartName = ExcelUploadHelper.getStringCellValue(currentCell).trim();
						Optional<MouldChildPartMaster> optionObjectional = mouldChildPartMasterRepositoryObject
								.findByChildPartName(chidlPartName);

						if (optionObjectional.isPresent()) {
							upload.setMouldChildPart(optionObjectional.get());
							upload.setChildPartName(chidlPartName);
						} else {
							errorList.add("Mould not found , " + (currentRow.getRowNum() + 1));
						}
						break;

					case 1:
						String pmDate = ExcelUploadHelper.getStringCellValue(currentCell).trim();
						upload.setPmDate(pmDate);

						break;

					case 2:
						String alertDays = ExcelUploadHelper.getStringCellValue(currentCell).trim();
						upload.setAlertDays(alertDays);

						break;

					default:
						break;
					}
				}

				if (upload.getMouldChildPart() == null) {
					errorList.add("Mould Child Part missing , " + (currentRow.getRowNum() + 1));
					continue;
				}

				boolean exists = mouldPreventiveMaintenanceMasterRepositoryObject
						.existsByMouldNameAndChildPartName(upload.getChildPartName(), upload.getChildPartName());

				if (exists) {
					errorList.add("Mould already exists , " + (currentRow.getRowNum() + 1));
					continue;
				}

//				boolean exists = mouldPreventiveMaintenanceMasterRepositoryObject.existsByRackCode(
//						upload.getSupplier().getCode() + "-" + upload.getRackName() + "." + formattedNumber);
//
//				if (exists) {
//					errorList.add("Rack already exists , " + (currentRow.getRowNum() + 1));
//					continue;
//				}

				upload.setCreatedBy(employeeId);
				upload.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
				upload.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

				mouldPreventiveMaintenanceMasterRepositoryObject.save(upload);
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
