package web.minda.project.controller;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;

import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
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
import web.minda.project.entity.DepartmentMaster;
import web.minda.project.helper.ExcelUploadHelper;
import web.minda.project.repositories.DepartmentMasterRepository;
import web.minda.project.service.DateTimeService;

@RestController
@RequestMapping("/Controllers")
public class DepartmentMasterAjaxController {
	@Autowired
	DepartmentMasterRepository departmentMasterRepositoryObject;

	@Autowired
	private DateTimeService dateTimeService;

	@PostMapping("/getLikeDepartmentMasterData/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getLikeDepartmentData(@PathVariable("pageNum") int page,
			@PathVariable("pageSize") int pageSize, @RequestBody DepartmentMaster jsonObject) {
		try {
			System.out.println(jsonObject);
			Pageable pageable = PageRequest.of(page, pageSize);
			Page<DepartmentMaster> pagableObject = this.departmentMasterRepositoryObject
					.getLikeDepartment(jsonObject.getDepartmentName(), jsonObject.getCreatedBy(), pageable);
			System.out.println(pagableObject);
			return new ResponseEntity<>(pagableObject, HttpStatus.OK);
		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/insertDepartmentMaster")
	public ResponseEntity<Object> insertDepartmentMaster(@RequestBody DepartmentMaster jsonObject) {
		try {
			jsonObject.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
			jsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());
			
			String lastIdString = departmentMasterRepositoryObject.getLastId();
			jsonObject.setDepartmentId(Long.parseLong(lastIdString) + 1);

			this.departmentMasterRepositoryObject.save(jsonObject);
			return new ResponseEntity<>("Data added successfully.", HttpStatus.OK);

		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<Object>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	@PostMapping("/editDepartmentMaster")
	public ResponseEntity<Object> editDepartmentMaster(@RequestBody DepartmentMaster jsonObject) {
		try {
			if (jsonObject.getDepartmentId().equals("")) {
				return new ResponseEntity<>("Department ID not found.", HttpStatus.NOT_ACCEPTABLE);
			} else {
				Optional<DepartmentMaster> existingOpt = departmentMasterRepositoryObject
						.findById(jsonObject.getDepartmentId());
				if (existingOpt.isEmpty()) {
					return new ResponseEntity<>("Department not found.", HttpStatus.NOT_FOUND);
				}

				DepartmentMaster existing = existingOpt.get();
				existing.setDepartmentName(jsonObject.getDepartmentName());
				existing.setCreatedBy(jsonObject.getCreatedBy());
				jsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());
				this.departmentMasterRepositoryObject.save(existing);
				return new ResponseEntity<>("Data updated successfully.", HttpStatus.OK);
			}
		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<>("Something went wrong.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/deleteDepartmentMaster/{id}")
	public ResponseEntity<Object> deleteDepartmentMaster(@PathVariable Long id) {
		try {
			this.departmentMasterRepositoryObject.deleteById(id);

			return new ResponseEntity<Object>("Data deleted successfully.", HttpStatus.OK);
//		} catch (DataIntegrityViolationException e) {
//			LineMaster lineObject = this.departmentMasterRepositoryObject.findByLineId(lineIds);
//			return new ResponseEntity<Object>(
//					"Unable to delete plants due to mapping.\n Line Number = " + lineObject.getLineNumber(),
//					HttpStatus.CONFLICT);
		} catch (Exception e) {
			return new ResponseEntity<Object>("Something went wrong.", HttpStatus.NOT_ACCEPTABLE);
		}
	}

	@GetMapping("/download/template/department")
	public void plantTemplate(HttpServletResponse response) throws IOException {
		response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		ServletOutputStream outputStream = response.getOutputStream();
		String[] headerList = new String[] { "Department Name" };
		int[] COLUMN_WIDTHS = { 50 * 256 };
		ByteArrayInputStream excelFile = ExcelController.generateExcelTemplate(headerList, COLUMN_WIDTHS,
				"Department Master");
		response.getOutputStream().write(excelFile.readAllBytes());
		outputStream.flush();
	}
	
	@PostMapping("/download/data/department")
	public void exportToExcelRole(HttpServletResponse response, @RequestBody DepartmentMaster jsonObject) throws IOException {
		try {
			// Set the content type to Excel file
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

			// Fetch data from the repository as a List<PlantMaster>
			List<DepartmentMaster> listObject = this.departmentMasterRepositoryObject.getAllDepartmentMaster(jsonObject.getDepartmentName(),
					jsonObject.getCreatedBy());


			// Define headers for the Excel sheet
			String[] headerList = new String[] { "Department Name", "Created By", "Date & Time" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256 };

			List<Function<DepartmentMaster, Object>> object = Arrays.asList(DepartmentMaster::getDepartmentName, DepartmentMaster::getCreatedBy,
					DepartmentMaster::getDateTimeModified);

			// Generate the Excel file using ExcelController
			ByteArrayInputStream excelFile = ExcelController.generateExcelData(listObject, object, headerList,
					COLUMN_WIDTHS, "DepartmentMaster");

			// Write the generated Excel to the HTTP response
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();

		}
	}


	@PostMapping("/uploadDepartment/{employeeId}")
	public ResponseEntity<Object> uploadDepartment(@RequestParam("file") MultipartFile file,
			@PathVariable("employeeId") String employeeId) {
		// Validate if the file has the correct Excel format
		if (!"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet".equals(file.getContentType())) {
			return new ResponseEntity<>("Please select an Excel file with extension XLSX.", HttpStatus.BAD_REQUEST);
		}

		try (InputStream is = file.getInputStream();
				OPCPackage opcPackage = OPCPackage.open(is);
				XSSFWorkbook workbook = new XSSFWorkbook(opcPackage)) {

			XSSFSheet sheet = workbook.getSheet("Department Master");
			if (sheet == null) {
				return new ResponseEntity<>("Department Master sheet not found in the Excel file.",
						HttpStatus.NOT_FOUND);
			}

			Iterator<Row> rows = sheet.iterator();
			rows.next(); // Skip header row

			while (rows.hasNext()) {
				Row currentRow = rows.next();
				if (currentRow.getLastCellNum() < 0) {
					break;
				}

				DepartmentMaster dataObject = new DepartmentMaster();
				Iterator<Cell> cellsInRow = currentRow.iterator();
				int cellIdx = 0;

				while (cellsInRow.hasNext()) {
					Cell currentCell = cellsInRow.next();

					switch (cellIdx) {
					case 0:
						dataObject.setDepartmentName(ExcelUploadHelper.getStringCellValue(currentCell));
						break;
					default:
						break;
					}
					cellIdx++;
				}

				// Check for duplicates and save only non-duplicate records
				if (!departmentMasterRepositoryObject.existsByDepartmentName(dataObject.getDepartmentName())) {
					String lastIdString = departmentMasterRepositoryObject.getLastId();
					dataObject.setDepartmentId(Long.parseLong(lastIdString) + 1);
					dataObject.setCreatedBy(employeeId);
					dataObject.setStatus("1");
					dataObject.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
					dataObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());
					departmentMasterRepositoryObject.save(dataObject);
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

}
