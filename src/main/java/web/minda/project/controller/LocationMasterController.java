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
import web.minda.project.entity.LocationMaster;
import web.minda.project.entity.PlantMaster;
import web.minda.project.entity.ShiftMaster;
import web.minda.project.helper.ExcelUploadHelper;
import web.minda.project.repositories.LocationMasterRepository;
import web.minda.project.service.DateTimeService;

@RestController
@RequestMapping("/Controllers")
public class LocationMasterController {

	@Autowired
	LocationMasterRepository locationMasterRepository;
	LocationMaster masterObject = new LocationMaster();

	@Autowired
	private DateTimeService dateTimeService;

	@PostMapping("/insertLocationMaster")
	public ResponseEntity<Object> insertLocationMaster(@RequestBody LocationMaster JsonObject) {
		try {
			if (!this.locationMasterRepository.existsByLocationName(JsonObject.getLocationName())) {

				JsonObject.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
				JsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

				this.locationMasterRepository.save(JsonObject);
				return new ResponseEntity<>("Data added successfully.", HttpStatus.OK);
			} else {
				return new ResponseEntity<>("Data code already exist.", HttpStatus.NOT_ACCEPTABLE);
			}
		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<>("Something went wrong.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/editLocationMaster")
	public ResponseEntity<Object> editLocationMaster(@RequestBody LocationMaster jsonObject) {
		try {
			if (jsonObject.getLocationId() == null) {
				return new ResponseEntity<>("Data code not found.", HttpStatus.NOT_ACCEPTABLE);
			} else {
				jsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());
				this.locationMasterRepository.save(jsonObject);
				return new ResponseEntity<>("Data updated successfully.", HttpStatus.OK);
			}
		} catch (Exception e) {
			return new ResponseEntity<Object>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/deleteLocationMaster/{id}")
	public ResponseEntity<Object> deleteLocation(@PathVariable Long id) {
		try {
			this.locationMasterRepository.deleteById(id);
			return new ResponseEntity<Object>("Data deleted successfully", HttpStatus.OK);
		} catch (DataIntegrityViolationException e) {
			return new ResponseEntity<Object>("Unable to delete Data due to mapping", HttpStatus.CONFLICT);
		} catch (Exception e) {
			return new ResponseEntity<Object>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/download/template/location")
	public void plantTemplate(HttpServletResponse response) throws IOException {
		response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		ServletOutputStream outputStream = response.getOutputStream();
		String[] headerList = new String[] { "Location Name", "Description", "Code", "Label File Path", "MaximumRacks",
				"Reprint" };
		int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256 };
		ByteArrayInputStream excelFile = ExcelController.generateExcelTemplate(headerList, COLUMN_WIDTHS,
				"Location Master");
		response.getOutputStream().write(excelFile.readAllBytes());
		outputStream.flush();
	}

//	@GetMapping("/download/data/location")
//	public void exportPlantData(HttpServletResponse response) throws IOException {
//		try {
//			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
//			List<LocationMaster> list = this.locationMasterRepository.getalldata();
//			String[] headerList = new String[] { "Location Name", "Description", "Code", "Label File Path",
//					"MaximumRacks", "Reprint", "Created By", "Date & Time" };
//			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
//					25 * 256, 30 * 256 };
//
//			List<Function<LocationMaster, Object>> getters = Arrays.asList(LocationMaster::getLocationName,
//					LocationMaster::getDescription, LocationMaster::getCode, LocationMaster::getLabelFilePath,
//					LocationMaster::getMaximumRacks, LocationMaster::getReprint, LocationMaster::getCreatedBy,
//					LocationMaster::getDateTimeModified);
//
//			ByteArrayInputStream excelFile = ExcelController.generateExcelData(list, getters, headerList, COLUMN_WIDTHS,
//					"Location Master");
//			ServletOutputStream outputStream = response.getOutputStream();
//			response.getOutputStream().write(excelFile.readAllBytes());
//			outputStream.flush();
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//	}

	@PostMapping("/download/data/location")
	public void exportToExcel(HttpServletResponse response, @RequestBody LocationMaster jsonObject)
			throws IOException {
		try {
			// Set the content type to Excel file
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

			// Fetch data from the repository as a List<PlantMaster>
			List<LocationMaster> listObject = this.locationMasterRepository.getAllLocationMaster(
					jsonObject.getLocationName(), jsonObject.getDescription(), jsonObject.getCode(),
					jsonObject.getLabelFilePath(), jsonObject.getMaximumRacks(), jsonObject.getReprint(),
					jsonObject.getCreatedBy());

			String[] headerList = new String[] { "Location Name", "Description", "Code", "Label File Path",
					"MaximumRacks", "Reprint", "Created By", "Date & Time" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256 };

			List<Function<LocationMaster, Object>> getters = Arrays.asList(LocationMaster::getLocationName,
					LocationMaster::getDescription, LocationMaster::getCode, LocationMaster::getLabelFilePath,
					LocationMaster::getMaximumRacks, LocationMaster::getReprint, LocationMaster::getCreatedBy,
					LocationMaster::getDateTimeModified);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(listObject, getters, headerList,
					COLUMN_WIDTHS, "Location Master");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();

		}
	}

	@PostMapping("/getLikeLocation/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getLikeLocation(@PathVariable("pageNum") int page,
			@PathVariable("pageSize") int pageSize, @RequestBody LocationMaster jsonObject) {

		try {
			System.out.println(jsonObject);
			Pageable pageable = PageRequest.of(page, pageSize);
			Page<LocationMaster> object = this.locationMasterRepository.getLikeLocation(jsonObject.getLocationName(),
					jsonObject.getDescription(), jsonObject.getCode(), jsonObject.getLabelFilePath(),
					jsonObject.getMaximumRacks(), jsonObject.getReprint(), jsonObject.getCreatedBy(), pageable);
			System.out.println(object);
			return new ResponseEntity<Object>(object, HttpStatus.OK);

		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<Object>("ng", HttpStatus.OK);
		}
	}

	@PostMapping("/uploadlocation/{employeeId}")
	public ResponseEntity<Object> uploadlocation(@RequestParam("file") MultipartFile file,
			@PathVariable("employeeId") String employeeId) {

		if (!"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet".equals(file.getContentType())) {
			return new ResponseEntity<>("Please upload XLSX file.", HttpStatus.BAD_REQUEST);
		}

		List<String> errorList = new ArrayList<>();
		errorList.add("Errors , Row");

		try (InputStream is = file.getInputStream();
				OPCPackage opcPackage = OPCPackage.open(is);
				XSSFWorkbook workbook = new XSSFWorkbook(opcPackage)) {

			XSSFSheet sheet = workbook.getSheet("Location Master");

			if (sheet == null) {
				return new ResponseEntity<>("Location Master sheet not found.", HttpStatus.NOT_FOUND);
			}

			Iterator<Row> rows = sheet.iterator();

			if (rows.hasNext())
				rows.next();

			while (rows.hasNext()) {

				Row currentRow = rows.next();

				if (currentRow == null || currentRow.getLastCellNum() <= 0) {
					continue;
				}

				LocationMaster upload = new LocationMaster();

				for (int cellIdx = 0; cellIdx < currentRow.getLastCellNum(); cellIdx++) {

					Cell currentCell = currentRow.getCell(cellIdx);

					String value = ExcelUploadHelper.getStringCellValue(currentCell).trim();

					switch (cellIdx) {

					case 0:
						upload.setLocationName(value);
						break;

					case 1:
						upload.setDescription(value);
						break;

					case 2:
						upload.setCode(value);
						break;

					case 3:
						upload.setLabelFilePath(value);
						break;

					case 4:
						upload.setMaximumRacks(value);
						break;

					case 5:
						upload.setReprint(value);
						break;

					default:
						break;
					}
				}

				if (upload.getLocationName() == null || upload.getLocationName().isEmpty()) {
					errorList.add("Location Name missing , " + (currentRow.getRowNum() + 1));
					continue;
				}

				boolean exists = locationMasterRepository.existsByLocationName(upload.getLocationName());

				if (exists) {
					errorList.add("Location already exists , " + (currentRow.getRowNum() + 1));
					continue;
				}

				upload.setCreatedBy(employeeId);
				upload.setStatus("1");
				upload.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
				upload.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

				locationMasterRepository.save(upload);
			}

			Map<String, Object> responseMap = new HashMap<>();
			responseMap.put("message", "Excel uploaded successfully.");
			responseMap.put("errorList", errorList);

			return new ResponseEntity<>(responseMap, HttpStatus.OK);

		} catch (IOException e) {

			return new ResponseEntity<>("Excel parsing failed: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);

		} catch (Exception e) {

			return new ResponseEntity<>("Unexpected error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
