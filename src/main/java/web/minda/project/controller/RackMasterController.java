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
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
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
import web.minda.project.entity.IncomingMaterial;
import web.minda.project.entity.LocationMaster;
import web.minda.project.entity.Qualityincoming;
import web.minda.project.entity.RackMaster;
import web.minda.project.helper.ExcelUploadHelper;
import web.minda.project.repositories.LocationMasterRepository;
import web.minda.project.repositories.RackMasterRepository;
import web.minda.project.service.DateTimeService;
import web.minda.project.service.ZebraUsbPrinterService;

@RestController
@RequestMapping("/Controllers")
public class RackMasterController {

	@Autowired
	RackMasterRepository rackMasterRepository;
	RackMaster masterObject = new RackMaster();

	@Autowired
	LocationMasterRepository locationMasterRepository;
	LocationMaster locationmasterObject = new LocationMaster();

	@Autowired
	private DateTimeService dateTimeService;

	@Autowired
	private ZebraUsbPrinterService printerService;

	@Value("${qa.upload.path}")
	private String folderPath;

	@Autowired
	private Environment env;

	@PostMapping("/insertRackMaster")
	public ResponseEntity<Object> insertRackMaster(@RequestBody RackMaster jsonObject) {

		try {

			System.out.println("RackCode from request: " + jsonObject.getRackCode());
			Optional<LocationMaster> locationOpt = locationMasterRepository
					.findByLocationName(jsonObject.getLocation().getLocationName());

			if (!locationOpt.isPresent()) {
				return new ResponseEntity<>("Location not found.", HttpStatus.NOT_ACCEPTABLE);
			}

			LocationMaster location = locationOpt.get();

			String formattedNumber = String.format("%03d", Integer.valueOf(jsonObject.getRackNumber()));

			boolean exists = rackMasterRepository.existsByRackCode(
					locationOpt.get().getCode() + "-" + jsonObject.getRackName() + "." + formattedNumber);

			if (!exists) {
				jsonObject.setLocation(location);
				jsonObject.setRackCode(
						locationOpt.get().getCode() + "-" + jsonObject.getRackName() + "." + formattedNumber);
				jsonObject.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
				jsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

				rackMasterRepository.save(jsonObject);

				return new ResponseEntity<>("Data added successfully.", HttpStatus.OK);
			} else {

				return new ResponseEntity<>("Rack Code already exist.", HttpStatus.NOT_ACCEPTABLE);

			}
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("Something went wrong.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/editRackMaster")
	public ResponseEntity<Object> editRackMaster(@RequestBody RackMaster jsonObject) {

		try {

			if (jsonObject.getRackId() == null) {
				return new ResponseEntity<>("Rack Id not found.", HttpStatus.NOT_ACCEPTABLE);
			}

//			Optional<RackMaster> rackOpt = rackMasterRepository.findById(jsonObject.getRackId());
//			if (rackOpt.isEmpty()) {
//				return new ResponseEntity<>("Rack not found.", HttpStatus.NOT_ACCEPTABLE);
//			}

			Optional<LocationMaster> locationOpt = locationMasterRepository
					.findByLocationName(jsonObject.getLocation().getLocationName());

			if (locationOpt.isEmpty()) {
				return new ResponseEntity<>("Location not found.", HttpStatus.NOT_ACCEPTABLE);
			}

			LocationMaster location = locationOpt.get();

			boolean exists = rackMasterRepository.existsByBinNameAndLocation_LocationNameAndRackIdNot(
					jsonObject.getBinName(), location.getLocationName(), jsonObject.getRackId());

			if (exists) {
				return new ResponseEntity<>("Data already exist.", HttpStatus.NOT_ACCEPTABLE);
			}

//			RackMaster rack = rackOpt.get();

//			rack.setBinName(jsonObject.getBinName());
//			rack.setCreatedBy(jsonObject.getCreatedBy());
//			rack.setStatus(jsonObject.getStatus());
			jsonObject.setLocation(location);
			jsonObject.setRackCode(
					locationOpt.get().getCode() + "_" + jsonObject.getRackName() + "_" + jsonObject.getRackNumber());
			jsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

			rackMasterRepository.save(jsonObject);

			return new ResponseEntity<>("Data updated successfully.", HttpStatus.OK);

		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/deleteRackMaster/{id}")
	public ResponseEntity<Object> deleteRackMaster(@PathVariable Long id) {
		try {
			this.rackMasterRepository.deleteById(id);
			return new ResponseEntity<Object>("Data deleted successfully", HttpStatus.OK);
		} catch (DataIntegrityViolationException e) {
			return new ResponseEntity<Object>("Unable to delete Data due to mapping", HttpStatus.CONFLICT);
		} catch (Exception e) {
			return new ResponseEntity<Object>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/download/template/rack")
	public void rackTemplate(HttpServletResponse response) throws IOException {
		response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		ServletOutputStream outputStream = response.getOutputStream();
		String[] headerList = new String[] { "Location Name", "Rack Name", "Rack Number" };
		int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256 };
		ByteArrayInputStream excelFile = ExcelController.generateExcelTemplate(headerList, COLUMN_WIDTHS,
				"Rack Master");
		response.getOutputStream().write(excelFile.readAllBytes());
		outputStream.flush();
	}

	@GetMapping("/download/data/rack")
	public void exportrackData(HttpServletResponse response) throws IOException {
		try {
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
			List<RackMaster> list = this.rackMasterRepository.getalldata();
			String[] headerList = new String[] { "Location Name", "Rack Name", "Rack Number", "Rack Code", "Status",
					"Created By", "Date & Time" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256 };

			List<Function<RackMaster, Object>> getters = Arrays.asList(
					rack -> rack.getLocation() != null ? rack.getLocation().getLocationName() : "",
					RackMaster::getRackName, RackMaster::getRackNumber, RackMaster::getRackCode, RackMaster::getStatus,
					RackMaster::getCreatedBy, RackMaster::getDateTimeModified);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(list, getters, headerList, COLUMN_WIDTHS,
					"Rack Master");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@PostMapping("/download/data/rack")
	public void exportToExcel(HttpServletResponse response, @RequestBody RackMaster jsonObject) throws IOException {
		try {
			// Set the content type to Excel file
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

			// Fetch data from the repository as a List<PlantMaster>
			List<RackMaster> listObject = this.rackMasterRepository.getAllRackMaster(
					jsonObject.getLocation().getLocationName(), jsonObject.getBinName(), jsonObject.getStatus(),
					jsonObject.getCreatedBy());

			String[] headerList = new String[] { "Location Name", "Bin Name", "Rack Name", "Rack Number", "Code",
					"Status", "Created By", "Date & Time" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256 };
			List<Function<RackMaster, Object>> getters = Arrays.asList(
					rack -> rack.getLocation() != null ? rack.getLocation().getLocationName() : "",
					RackMaster::getBinName, RackMaster::getRackName, RackMaster::getRackNumber, RackMaster::getRackCode,
					RackMaster::getStatus, RackMaster::getCreatedBy, RackMaster::getDateTimeModified);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(listObject, getters, headerList,
					COLUMN_WIDTHS, "Rack Master");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();

		}
	}

	@PostMapping("/getLikeRack/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getLikeRackData(@PathVariable("pageNum") int page,
			@PathVariable("pageSize") int pageSize, @RequestBody RackMaster jsonObject) {

		try {
			System.out.println(jsonObject);
			Pageable pageable = PageRequest.of(page, pageSize);
			Page<RackMaster> object = this.rackMasterRepository.getLikeRack(jsonObject.getLocation().getLocationName(),
					jsonObject.getRackName(), jsonObject.getRackNumber(), jsonObject.getStatus(),
					jsonObject.getCreatedBy(), pageable);
			System.out.println(object);
			return new ResponseEntity<Object>(object, HttpStatus.OK);

		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<Object>("ng", HttpStatus.OK);
		}
	}

	@PostMapping("/uploadrack/{employeeId}")
	public ResponseEntity<Object> uploadrack(@RequestParam("file") MultipartFile file,
			@PathVariable("employeeId") String employeeId) {

		if (!"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet".equals(file.getContentType())) {
			return new ResponseEntity<>("Please upload XLSX file.", HttpStatus.BAD_REQUEST);
		}

		List<String> errorList = new ArrayList<>();
		errorList.add("Errors , Row");

		try (InputStream is = file.getInputStream();
				OPCPackage opcPackage = OPCPackage.open(is);
				XSSFWorkbook workbook = new XSSFWorkbook(opcPackage)) {

			XSSFSheet sheet = workbook.getSheet("Rack Master");

			if (sheet == null) {
				return new ResponseEntity<>("Rack Master sheet not found.", HttpStatus.NOT_FOUND);
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

				RackMaster upload = new RackMaster();

				for (int cellIdx = 0; cellIdx < currentRow.getLastCellNum(); cellIdx++) {

					Cell currentCell = currentRow.getCell(cellIdx);

					switch (cellIdx) {

					case 0:
						String locationName = ExcelUploadHelper.getStringCellValue(currentCell).trim();
						Optional<LocationMaster> locationOptional = locationMasterRepository
								.findByLocationName(locationName);

						if (locationOptional.isPresent()) {
							upload.setLocation(locationOptional.get());
							locationCodeString = locationOptional.get().getCode();
						} else {
							errorList.add("Location not found , " + (currentRow.getRowNum() + 1));
						}
						break;

					case 1:

						String rackName = ExcelUploadHelper.getStringCellValue(currentCell).trim();
						upload.setRackName(rackName);
						break;

					case 2:
						String rackNumber = ExcelUploadHelper.getStringCellValue(currentCell).trim();
						upload.setRackNumber(rackNumber);

						break;

					default:
						break;
					}
				}

				if (upload.getLocation() == null) {
					errorList.add("Location missing , " + (currentRow.getRowNum() + 1));
					continue;
				}

				String formattedNumber = String.format("%03d", Integer.valueOf(upload.getRackNumber()));

				boolean exists = rackMasterRepository.existsByRackCode(
						upload.getLocation().getCode() + "-" + upload.getRackName() + "." + formattedNumber);

				if (exists) {
					errorList.add("Rack already exists , " + (currentRow.getRowNum() + 1));
					continue;
				}

				upload.setCreatedBy(employeeId);
				upload.setStatus("1");
				upload.setRackCode(upload.getLocation().getCode() + "-" + upload.getRackName() + "." + formattedNumber);
				upload.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
				upload.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

				rackMasterRepository.save(upload);
			}

			Map<String, Object> responseMap = new HashMap<>();
			responseMap.put("message", "Excel uploaded successfully.");
			responseMap.put("errorList", errorList);

			return new ResponseEntity<>(responseMap, HttpStatus.OK);

		} catch (Exception e) {

			return new ResponseEntity<>("Upload failed : " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	
	
	

	@GetMapping("/printRackBarcode/{barcode}")
	public ResponseEntity<Object> qaAction(
	        @PathVariable String barcode) {

	    Map<String, Object> response = new HashMap<>();

	    try {

	        String printerName =
	                env.getProperty("printer.iot");

	        String template =
	                env.getProperty("zebra.rack.label.template");

	        System.out.println("Barcode : " + barcode);

	        String[] parts = barcode.split("[-.]");

	        if (parts.length < 3) {
	            return new ResponseEntity<>(
	                    "Invalid Barcode Format",
	                    HttpStatus.BAD_REQUEST);
	        }

	        String storeCode = parts[0];     // MS
	        String rackCode = parts[1];      // AL
	        String locationCode = parts[2];  // 076

	        LocationMaster locationMaster =
	        		locationMasterRepository
	                        .findByCode(storeCode)
	                        .orElseThrow(() ->
	                                new RuntimeException(
	                                        "Store Code Not Found : "
	                                                + storeCode));

	        String storeDesc =
	                locationMaster.getLocationName();

	        String rackDesc = "Rack Number";
	        
	        System.out.println("details: "+storeDesc+ " barcode");

	        String zpl =
	                String.format(
	                        template,

	                        barcode,

	                        storeCode,
	                        storeDesc,

	                        rackCode,
	                        rackDesc,

	                        locationCode,

	                        barcode
	                );

	        printerService.printZpl(
	                printerName,
	                zpl
	        );

	        return new ResponseEntity<>(
	                "Print Successfully",
	                HttpStatus.OK
	        );

	    } catch (Exception e) {

	        e.printStackTrace();

	        response.put("status", false);
	        response.put(
	                "message",
	                "Printer is not connected or printing failed"
	        );

	        return new ResponseEntity<>(
	                response,
	                HttpStatus.INTERNAL_SERVER_ERROR
	        );
	    }
	}

//	@GetMapping("/printRackBarcode/{barcode}")
//	public ResponseEntity<Object> qaAction(@PathVariable String barcode) {
//		Map<String, Object> response = new HashMap<>();
//
//		try {
//
//			// Printer + Template
//			String printerName = env.getProperty("printer.iot");
//			String template = env.getProperty("zebra.rack.label.template");
//			
//			System.out.println("Barcode: "+barcode);
//
//			try {
//				//String zpl = String.format(template, barcode, barcode);
//				
//				String[] parts = barcode.split("[-.]");
//
//				String storeCode = parts[0];
//				String rackCode = parts[1];
//				String locationCode = parts[2];
//
//				// fetch descriptions
//				String storeDesc = "Main Store";
//				String rackDesc = "Rack Number";
//
//				String zpl = String.format(
//				        template,
//				        barcode,          // QR
//
//				        storeCode,
//				        storeDesc,
//
//				        rackCode,
//				        rackDesc,
//
//				        locationCode,
//
//				        barcode
//				);
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
