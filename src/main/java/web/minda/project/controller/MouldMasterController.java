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
import web.minda.project.entity.SupplierMaster;
import web.minda.project.entity.MouldMaster;
import web.minda.project.helper.ExcelUploadHelper;
import web.minda.project.repositories.SupplierMasterRepository;
import web.minda.project.repositories.MouldMasterRepository;
import web.minda.project.service.DateTimeService;
import web.minda.project.service.ZebraUsbPrinterService;

@RestController
@RequestMapping("/Controllers")
public class MouldMasterController {

	@Autowired
	MouldMasterRepository mouldMasterRepositoryObject;

	@Autowired
	SupplierMasterRepository supplierMasterRepositoryObject;

	@Autowired
	private DateTimeService dateTimeService;

	@Autowired
	private ZebraUsbPrinterService printerService;

	@Value("${qa.upload.path}")
	private String folderPath;

	@Autowired
	private Environment env;

	@PostMapping("/insertMouldMaster")
	public ResponseEntity<Object> insertMouldMaster(@RequestBody MouldMaster jsonObject) {

		try {

			Optional<SupplierMaster> optionObject = supplierMasterRepositoryObject
					.findBySupplierName(jsonObject.getSupplierName());

			if (!optionObject.isPresent()) {
				return new ResponseEntity<>("Supplier not found.", HttpStatus.NOT_ACCEPTABLE);
			}

			SupplierMaster department = optionObject.get();
			boolean exists = mouldMasterRepositoryObject.existsByMouldName(jsonObject.getMouldName());

			if (!exists) {

				jsonObject.setSupplier(department);
				jsonObject.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
				jsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

				mouldMasterRepositoryObject.save(jsonObject);

				return new ResponseEntity<>("Data added successfully.", HttpStatus.OK);
			} else {

				return new ResponseEntity<>("Operation already exist.", HttpStatus.NOT_ACCEPTABLE);

			}
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("Something went wrong.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/editMouldMaster")
	public ResponseEntity<Object> editMouldMaster(@RequestBody MouldMaster jsonObject) {

		try {

			if (jsonObject.getMouldId() == null) {
				return new ResponseEntity<>("Notification Id not found.", HttpStatus.NOT_ACCEPTABLE);
			}

//			Optional<MouldMaster> notificationOpt = mouldMasterRepositoryObject.findById(jsonObject.getRackId());
//			if (notificationOpt.isEmpty()) {
//				return new ResponseEntity<>("Rack not found.", HttpStatus.NOT_ACCEPTABLE);
//			}

			Optional<SupplierMaster> optionObject = supplierMasterRepositoryObject
					.findBySupplierName(jsonObject.getSupplier().getSupplierName());

			if (optionObject.isEmpty()) {
				return new ResponseEntity<>("Supplier not found.", HttpStatus.NOT_ACCEPTABLE);
			}

			SupplierMaster department = optionObject.get();

			boolean exists = mouldMasterRepositoryObject.existsByMouldNameAndMouldIdNot(jsonObject.getMouldName(),
					jsonObject.getMouldId());

			if (exists) {
				return new ResponseEntity<>("Data already exist.", HttpStatus.NOT_ACCEPTABLE);
			}

			jsonObject.setSupplier(department);
			jsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

			mouldMasterRepositoryObject.save(jsonObject);

			return new ResponseEntity<>("Data updated successfully.", HttpStatus.OK);

		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/deleteMouldMaster/{id}")
	public ResponseEntity<Object> deleteMouldMaster(@PathVariable Long id) {
		try {
			this.mouldMasterRepositoryObject.deleteById(id);
			return new ResponseEntity<Object>("Data deleted successfully", HttpStatus.OK);
		} catch (DataIntegrityViolationException e) {
			return new ResponseEntity<Object>("Unable to delete Data due to mapping", HttpStatus.CONFLICT);
		} catch (Exception e) {
			return new ResponseEntity<Object>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/download/template/mould")
	public void mouldTemplate(HttpServletResponse response) throws IOException {
		response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		ServletOutputStream outputStream = response.getOutputStream();
		String[] headerList = new String[] { "Supplier Name", "Mould Name", "Description", "Date of Installation","Cavity","Shots" };
		int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256 };
		ByteArrayInputStream excelFile = ExcelController.generateExcelTemplate(headerList, COLUMN_WIDTHS,
				"Mould Master");
		response.getOutputStream().write(excelFile.readAllBytes());
		outputStream.flush();
	}

//	@GetMapping("/download/data/notification")
//	public void exportnotificationData(HttpServletResponse response) throws IOException {
//		try {
//			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
//			List<MouldMaster> list = this.mouldMasterRepositoryObject.getAllMouldMaster();
//			String[] headerList = new String[] { "Department Name", "Operation", "Description" , "Duration", "Unit",
//					"Created By", "Date & Time" };
//			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
//					25 * 256, 30 * 256 };
//
//			List<Function<MouldMaster, Object>> getters = Arrays.asList(
//					notification -> notification.getSupplier() != null ? notification.getSupplier().getSupplierName() : "",
//					MouldMaster::getMouldName, MouldMaster::getDescription, MouldMaster::getDuration,
//					MouldMaster::getUnit, MouldMaster::getCreatedBy,
//					MouldMaster::getDateTimeModified);
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

	@PostMapping("/download/data/mould")
	public void exportToMouldExcel(HttpServletResponse response, @RequestBody MouldMaster jsonObject)
			throws IOException {
		try {
			// Set the content type to Excel file
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

			// Fetch data from the repository as a List<PlantMaster>
			List<MouldMaster> listObject = this.mouldMasterRepositoryObject.getAllMouldMaster(
					jsonObject.getSupplierName(), jsonObject.getMouldName(), jsonObject.getDescription(),
					jsonObject.getCreatedBy());

			String[] headerList = new String[] { "Supplier Name", "Mould Name", "Description", "Date od Installation",
					"Created By", "Date & Time" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256 };

			List<Function<MouldMaster, Object>> getters = Arrays.asList(MouldMaster::getSupplierName,
					MouldMaster::getMouldName, MouldMaster::getDescription, MouldMaster::getDateOfInstallation,
					MouldMaster::getCreatedBy, MouldMaster::getDateTimeModified);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(listObject, getters, headerList,
					COLUMN_WIDTHS, "Mould Master");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();

		}
	}

	@PostMapping("/getLikeMould/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getLikeMould(@PathVariable("pageNum") int page,
			@PathVariable("pageSize") int pageSize, @RequestBody MouldMaster jsonObject) {

		try {
			Pageable pageable = PageRequest.of(page, pageSize);
			Page<MouldMaster> object = this.mouldMasterRepositoryObject.getLikeMould(jsonObject.getSupplierName(),
					jsonObject.getMouldName(), jsonObject.getDescription(), jsonObject.getCreatedBy(), pageable);
			System.out.println(object);
			return new ResponseEntity<Object>(object, HttpStatus.OK);

		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<Object>("ng", HttpStatus.OK);
		}
	}

	@PostMapping("/uploadMould/{employeeId}")
	public ResponseEntity<Object> uploadMould(@RequestParam("file") MultipartFile file,
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

				MouldMaster upload = new MouldMaster();

				for (int cellIdx = 0; cellIdx < currentRow.getLastCellNum(); cellIdx++) {

					Cell currentCell = currentRow.getCell(cellIdx);

					switch (cellIdx) {

					case 0:
						String supplierName = ExcelUploadHelper.getStringCellValue(currentCell).trim();
						Optional<SupplierMaster> optionObjectional = supplierMasterRepositoryObject
								.findBySupplierName(supplierName);

						if (optionObjectional.isPresent()) {
							upload.setSupplier(optionObjectional.get());
							upload.setSupplierName(supplierName);
						} else {
							errorList.add("Supplier not found , " + (currentRow.getRowNum() + 1));
						}
						break;

					case 1:

						String mouldName = ExcelUploadHelper.getStringCellValue(currentCell).trim();
						upload.setMouldName(mouldName);
						break;

					case 2:
						String description = ExcelUploadHelper.getStringCellValue(currentCell).trim();
						upload.setDescription(description);

						break;

					case 3:
						String dateOfInstallation = ExcelUploadHelper.getStringCellValue(currentCell).trim();
						upload.setDateOfInstallation(dateOfInstallation);

						break;
						
					case 4:
						String cavity = ExcelUploadHelper.getStringCellValue(currentCell).trim();
						upload.setCavity(cavity);

						break;
						
					case 5:
						String noOfShot = ExcelUploadHelper.getStringCellValue(currentCell).trim();
						upload.setNoOfShot(noOfShot);

						break;

					default:
						break;
					}
				}

				if (upload.getSupplier() == null) {
					errorList.add("Supplier missing , " + (currentRow.getRowNum() + 1));
					continue;
				}

				boolean exists = mouldMasterRepositoryObject.existsByMouldName(upload.getMouldName());

				if (exists) {
					errorList.add("Mould already exists , " + (currentRow.getRowNum() + 1));
					continue;
				}

//				boolean exists = mouldMasterRepositoryObject.existsByRackCode(
//						upload.getSupplier().getCode() + "-" + upload.getRackName() + "." + formattedNumber);
//
//				if (exists) {
//					errorList.add("Rack already exists , " + (currentRow.getRowNum() + 1));
//					continue;
//				}

				upload.setCreatedBy(employeeId);
				upload.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
				upload.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

				mouldMasterRepositoryObject.save(upload);
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
