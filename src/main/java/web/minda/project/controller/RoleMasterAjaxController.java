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
import web.minda.project.download.MasterTemplate;
import web.minda.project.entity.PlantMaster;
import web.minda.project.entity.RackMaster;
import web.minda.project.entity.RoleMaster;
import web.minda.project.helper.ExcelUploadHelper;
import web.minda.project.repositories.PlantMasterRepository;
import web.minda.project.repositories.RoleMasterRepository;
import web.minda.project.service.DateTimeService;

@RestController
@RequestMapping("/Controllers")
public class RoleMasterAjaxController {

	private List<String> datList;
	@Autowired
	RoleMasterRepository roleMasterRepositoryObject;
	RoleMaster roleMasterObject = new RoleMaster();

	@Autowired
	PlantMasterRepository plantRepositoryObject;
	PlantMaster plantMasterObject = new PlantMaster();

	@Autowired
	private DateTimeService dateTimeService;

	// ----------------Line Master Ajax request controller--------------//

	@PostMapping("/insertRoleMaster")
	public ResponseEntity<Object> insertRoleMaster(@RequestBody RoleMaster jsonObject) {
		try {
			jsonObject.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
			jsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

			String lastIdString = roleMasterRepositoryObject.getLastId();
			jsonObject.setRoleId(Long.parseLong(lastIdString) + 1);

			this.roleMasterRepositoryObject.save(jsonObject);
			return new ResponseEntity<>("Data added successfully.", HttpStatus.OK);

		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<Object>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	@PostMapping("/editRoleMaster")
	public ResponseEntity<Object> editRoleMaster(@RequestBody RoleMaster jsonObject) {
		try {
			if (jsonObject.getRoleId().equals("")) {
				return new ResponseEntity<>("Role ID not found.", HttpStatus.NOT_ACCEPTABLE);
			} else {
				jsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());
				this.roleMasterRepositoryObject.save(jsonObject);
				return new ResponseEntity<>("Data updated successfully.", HttpStatus.OK);
			}
		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<>("Something went wrong.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/deleteRoleMaster/{id}")
	public ResponseEntity<Object> deleteRoleMaster(@PathVariable Long id) {
		try {
			this.roleMasterRepositoryObject.deleteById(id);
			return new ResponseEntity<Object>("Data deleted successfully", HttpStatus.OK);
		} catch (DataIntegrityViolationException e) {
			return new ResponseEntity<Object>("Unable to delete Data due to mapping", HttpStatus.CONFLICT);
		} catch (Exception e) {
			return new ResponseEntity<Object>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/delete/deleteAllRoleMaster")
	public ResponseEntity<Object> deleteAllRoleMaster(@RequestBody List<String> linList) {
		Long roleIds = null;
		try {
			for (String lineId : linList) {
				roleIds = Long.parseLong(lineId);
				this.roleMasterRepositoryObject.deleteById(Long.parseLong(lineId));
			}

			return new ResponseEntity<Object>("Data deleted successfully.", HttpStatus.OK);
		} catch (DataIntegrityViolationException e) {

			return new ResponseEntity<>("Cannot delete this role because it is mapped in another master table.",
					HttpStatus.CONFLICT);

		} catch (Exception e) {
			return new ResponseEntity<Object>("Something went wrong." + e, HttpStatus.NOT_ACCEPTABLE);
		}
	}

	@GetMapping("/download/template/role")
	public void plantTemplate(HttpServletResponse response) throws IOException {
		response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		ServletOutputStream outputStream = response.getOutputStream();
		String[] headerList = new String[] { "Role Name" };
		int[] COLUMN_WIDTHS = { 50 * 256 };
		ByteArrayInputStream excelFile = ExcelController.generateExcelTemplate(headerList, COLUMN_WIDTHS,
				"Role Master");
		response.getOutputStream().write(excelFile.readAllBytes());
		outputStream.flush();
	}

	@PostMapping("/download/data/rolemaster")
	public void exportToExcelRole(HttpServletResponse response, @RequestBody RoleMaster jsonObject) throws IOException {
		try {
			// Set the content type to Excel file
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

			// Fetch data from the repository as a List<PlantMaster>
			List<RoleMaster> listObject = this.roleMasterRepositoryObject.getAllRoleMaster(jsonObject.getRoleName(),
					jsonObject.getCreatedBy());


			// Define headers for the Excel sheet
			String[] headerList = new String[] { "Role Name", "Created By", "Date & Time" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256 };

			List<Function<RoleMaster, Object>> object = Arrays.asList(RoleMaster::getRoleName, RoleMaster::getCreatedBy,
					RoleMaster::getDateTimeModified);

			// Generate the Excel file using ExcelController
			ByteArrayInputStream excelFile = ExcelController.generateExcelData(listObject, object, headerList,
					COLUMN_WIDTHS, "Role Master");

			// Write the generated Excel to the HTTP response
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();

		}
	}

	@PostMapping("/getLikeRoleMasterData/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getLikeLineData(@PathVariable("pageNum") int page,
			@PathVariable("pageSize") int pageSize, @RequestBody RoleMaster jsonObject) {
		try {
			System.out.println(jsonObject);
			Pageable pageable = PageRequest.of(page, pageSize);
			Page<RoleMaster> pagableObject = this.roleMasterRepositoryObject.getLikeRole(jsonObject.getRoleName(),
					jsonObject.getCreatedBy(), pageable);
			System.out.println(pagableObject);
			return new ResponseEntity<>(pagableObject, HttpStatus.OK);
		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/uploadrole/{employeeId}")
	public ResponseEntity<Object> uploadrole(@RequestParam("file") MultipartFile file,
			@PathVariable("employeeId") String employeeId) {
		// Validate if the file has the correct Excel format
		if (!"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet".equals(file.getContentType())) {
			return new ResponseEntity<>("Please select an Excel file with extension XLSX.", HttpStatus.BAD_REQUEST);
		}

		try (InputStream is = file.getInputStream();
				OPCPackage opcPackage = OPCPackage.open(is);
				XSSFWorkbook workbook = new XSSFWorkbook(opcPackage)) {

			XSSFSheet sheet = workbook.getSheet("Role Master");
			if (sheet == null) {
				return new ResponseEntity<>("Role Master sheet not found in the Excel file.", HttpStatus.NOT_FOUND);
			}

			Iterator<Row> rows = sheet.iterator();
			rows.next(); // Skip header row

			while (rows.hasNext()) {
				Row currentRow = rows.next();
				if (currentRow.getLastCellNum() < 0) {
					break;
				}

				RoleMaster dataObject = new RoleMaster();
				Iterator<Cell> cellsInRow = currentRow.iterator();
				int cellIdx = 0;

				while (cellsInRow.hasNext()) {
					Cell currentCell = cellsInRow.next();

					switch (cellIdx) {
					case 0:
						dataObject.setRoleName(ExcelUploadHelper.getStringCellValue(currentCell));
						break;
					default:
						break;
					}
					cellIdx++;
				}

				// Check for duplicates and save only non-duplicate records
				if (!roleMasterRepositoryObject.existsByRoleName(dataObject.getRoleName())) {
					String lastIdString = roleMasterRepositoryObject.getLastId();
					dataObject.setRoleId(Long.parseLong(lastIdString) + 1);
					dataObject.setCreatedBy(employeeId);
					dataObject.setStatus("1");
					dataObject.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
					dataObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());
					roleMasterRepositoryObject.save(dataObject);
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
