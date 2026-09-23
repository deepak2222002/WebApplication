package web.minda.project.controller;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
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
import web.minda.project.entity.PlantMaster;
import web.minda.project.helper.ExcelUploadHelper;
import web.minda.project.repositories.PlantMasterRepository;
import web.minda.project.service.DateTimeService;

@RestController
@RequestMapping("/Controllers")
public class PlantMasterAjaxController {

	@Autowired
	PlantMasterRepository plantRepositoryObject;
	PlantMaster plantMasterObject = new PlantMaster();

	@Autowired
	private DateTimeService dateTimeService;

	@PostMapping("/insertPlantMaster")
	public ResponseEntity<Object> insertPlantMaster(@RequestBody PlantMaster plantJsonObject) {
		try {
			if (!this.plantRepositoryObject.existsByPlantCode(plantJsonObject.getPlantCode())) {

				plantJsonObject.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
				plantJsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

				this.plantRepositoryObject.save(plantJsonObject);
				return new ResponseEntity<>("Plant added successfully.", HttpStatus.OK);
			} else {
				return new ResponseEntity<>("Plant code already exist.", HttpStatus.NOT_ACCEPTABLE);
			}
		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<>("Something went wrong.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/editPlantMaster")
	public ResponseEntity<Object> editPlantMaster(@RequestBody PlantMaster plantJsonObject) {
		try {
			if (plantJsonObject.getPlantId().equals("")) {
				return new ResponseEntity<>("Plant code not found.", HttpStatus.NOT_ACCEPTABLE);
			} else {
				plantJsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());
				this.plantRepositoryObject.save(plantJsonObject);
				return new ResponseEntity<>("Plant updated successfully.", HttpStatus.OK);
			}
		} catch (Exception e) {
			return new ResponseEntity<Object>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/deletePlantMaster/{id}")
	public ResponseEntity<Object> deletePlantMaster(@PathVariable Long id) {
		try {
				this.plantRepositoryObject.deleteById(id);
			return new ResponseEntity<Object>("Plants deleted successfully.", HttpStatus.OK);
		} catch (DataIntegrityViolationException e) {
			return new ResponseEntity<Object>("Unable to delete Data due to mapping", HttpStatus.CONFLICT);
		} catch (Exception e) {
			return new ResponseEntity<Object>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Generate Excel file from template list
	@GetMapping("/download/template/plantmaster")
	public void plantTemplate(HttpServletResponse response) throws IOException {
		// Response content type for Excel file
		response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

		// Output stream for sending the Excel file
		ServletOutputStream outputStream = response.getOutputStream();

		// Headers for the template
		String[] headerList = new String[] { "Name", "Plant Code", "Address", "City", "State", "Pincode",
				"Contact Person", "Mobile No." };
		int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256 };

		// Create the Excel file using ExcelController method
		ByteArrayInputStream excelFile = ExcelController.generateExcelTemplate(headerList, COLUMN_WIDTHS,
				"Plant Master");

		// Writing the Excel to the output stream
		response.getOutputStream().write(excelFile.readAllBytes());
		outputStream.flush();
	}

	@GetMapping("/download/data/plantmaster")
	public void exportPlantData(HttpServletResponse response) throws IOException {
		try {
			// Set the content type to Excel file
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

			// Fetch data from the repository as a List<PlantMaster>
			List<PlantMaster> listPlant = this.plantRepositoryObject.getAllPlantMasters();

			// Define headers for the Excel sheet
			String[] headerList = new String[] { "Name", "Plant Code", "Address", "City", "State", "Pin Code",
					"Contact Person", "Mobile No.", "Created By", "Date & Time" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256 };

			List<Function<PlantMaster, Object>> plantGetters = Arrays.asList(PlantMaster::getPlantName,
					PlantMaster::getPlantCode, PlantMaster::getPlantAddress, PlantMaster::getPlantCity,
					PlantMaster::getPlantState, PlantMaster::getPlantPincode, PlantMaster::getPlantContactPerson,
					PlantMaster::getPlantMobileNo, PlantMaster::getCreatedBy, PlantMaster::getDateTimeModified);

			// Generate the Excel file using ExcelController
			ByteArrayInputStream excelFile = ExcelController.generateExcelData(listPlant, plantGetters, headerList,
					COLUMN_WIDTHS, "Plant Master");

			// Write the generated Excel to the HTTP response
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();
			// Handle exceptions if needed
		}
	}


	@PostMapping("/uploadplant/{employeeId}")
	public ResponseEntity<Object> uploadPlantFile(@RequestParam("file") MultipartFile file,
			@PathVariable("employeeId") String employeeId) {
		// Validate if the file has the correct Excel format
		if (!"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet".equals(file.getContentType())) {
			return new ResponseEntity<>("Please select an Excel file with extension XLSX.", HttpStatus.BAD_REQUEST);
		}

		try (InputStream is = file.getInputStream();
				OPCPackage opcPackage = OPCPackage.open(is);
				XSSFWorkbook workbook = new XSSFWorkbook(opcPackage)) {

			XSSFSheet sheet = workbook.getSheet("Plant Master");
			if (sheet == null) {
				return new ResponseEntity<>("Plant Master sheet not found in the Excel file.", HttpStatus.NOT_FOUND);
			}

			Iterator<Row> rows = sheet.iterator();
			rows.next(); // Skip header row

			while (rows.hasNext()) {
				Row currentRow = rows.next();
				if (currentRow.getLastCellNum() < 0) {
					break;
				}

				PlantMaster plantMaster = new PlantMaster();
				Iterator<Cell> cellsInRow = currentRow.iterator();
				int cellIdx = 0;

				while (cellsInRow.hasNext()) {
					Cell currentCell = cellsInRow.next();

					switch (cellIdx) {
					case 0:
						plantMaster.setPlantName(ExcelUploadHelper.getStringCellValue(currentCell));
						break;
					case 1:
						plantMaster.setPlantCode(ExcelUploadHelper.getStringCellValue(currentCell));
						plantMaster.setPlantId(Long.valueOf(ExcelUploadHelper.getStringCellValue(currentCell)));
						break;
					case 2:
						plantMaster.setPlantAddress(ExcelUploadHelper.getStringCellValue(currentCell));
						break;
					case 3:
						plantMaster.setPlantCity(ExcelUploadHelper.getStringCellValue(currentCell));
						break;
					case 4:
						plantMaster.setPlantState(ExcelUploadHelper.getStringCellValue(currentCell));
						break;
					case 5:
						plantMaster.setPlantPincode(ExcelUploadHelper.getStringCellValue(currentCell));
						break;
					case 6:
						plantMaster.setPlantContactPerson(ExcelUploadHelper.getStringCellValue(currentCell));
						break;
					case 7:
						plantMaster.setPlantMobileNo(ExcelUploadHelper.getStringCellValue(currentCell));
						break;
					default:
						break;
					}
					cellIdx++;
				}

				// Check for duplicates and save only non-duplicate records
				if (!plantRepositoryObject.existsByPlantCode(plantMaster.getPlantCode())) {
					plantMaster.setCreatedBy(employeeId);
					plantMaster.setStatus("1");
					plantMaster.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
					plantMaster.setDateTimeModified(dateTimeService.getCurrentDateAndTime());
					plantRepositoryObject.save(plantMaster);
				}
			}

			return new ResponseEntity<>("Excel uploaded successfully.", HttpStatus.OK);

		} catch (IOException e) {
			return new ResponseEntity<>("Failed to parse the Excel file: " + e.getMessage(),
					HttpStatus.INTERNAL_SERVER_ERROR);
		} catch (Exception e) {
			return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(),
					HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}



	@PostMapping("/getLikePlantMasterData/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getLikePlantMasterData(@PathVariable("pageNum") int page,
			@PathVariable("pageSize") int pageSize, @RequestBody PlantMaster plantMaster) {

		try {

			Pageable pageable = PageRequest.of(page, pageSize);
			Page<PlantMaster> plantMasters = this.plantRepositoryObject.getLikePlant(plantMaster.getPlantName(),
					plantMaster.getPlantCode(), plantMaster.getPlantAddress(), plantMaster.getPlantCity(),
					plantMaster.getPlantState(), plantMaster.getPlantPincode(), plantMaster.getPlantContactPerson(),
					plantMaster.getPlantMobileNo(), plantMaster.getCreatedBy(),plantMaster.getPlantDescription(), pageable);

			return new ResponseEntity<Object>(plantMasters, HttpStatus.OK);

		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<Object>("ng", HttpStatus.OK);
		}
	}
}