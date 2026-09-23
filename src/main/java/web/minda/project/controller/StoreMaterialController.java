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
import web.minda.project.entity.RackMaster;
import web.minda.project.entity.StoreMaterial;
import web.minda.project.entity.StoreMaterialCategoryMaster;
import web.minda.project.helper.ExcelUploadHelper;
import web.minda.project.repositories.StoreMaterialCategoryRepository;
import web.minda.project.repositories.StoreMaterialRepository;
import web.minda.project.service.DateTimeService;

@RestController
@RequestMapping("/Controllers")
public class StoreMaterialController {
	@Autowired
	StoreMaterialRepository storeMaterialRepository;
	StoreMaterial masterObject = new StoreMaterial();

	@Autowired
	StoreMaterialCategoryRepository storeMaterialCategoryRepository;
	StoreMaterialCategoryMaster storeMaterialCategoryMaster = new StoreMaterialCategoryMaster();

	@Autowired
	private DateTimeService dateTimeService;

	@PostMapping("/insertStoreMaterialMaster")
	public ResponseEntity<Object> insertStoreMaterialMaster(@RequestBody StoreMaterial jsonObject) {

		try {

			Optional<StoreMaterialCategoryMaster> categoryOpt = storeMaterialCategoryRepository
					.findByCategory(jsonObject.getCategory().getCategory());

			if (categoryOpt.isEmpty()) {
				return new ResponseEntity<>("Category does not exist.", HttpStatus.NOT_ACCEPTABLE);
			}

			StoreMaterialCategoryMaster category = categoryOpt.get();

			boolean materialExists = storeMaterialRepository
					.existsByMaterialAndCategory_Category(jsonObject.getMaterial(), category.getCategory());

			if (materialExists) {
				return new ResponseEntity<>("Material already exists in this category.", HttpStatus.NOT_ACCEPTABLE);
			}

			jsonObject.setCategory(category);
			jsonObject.setMaterial(jsonObject.getMaterial().toUpperCase());
			jsonObject.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
			jsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

			storeMaterialRepository.save(jsonObject);

			return new ResponseEntity<>("Data added successfully.", HttpStatus.OK);

		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("Something went wrong.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/editStoreMaterialMaster")
	public ResponseEntity<Object> editStoreMaterialMaster(@RequestBody StoreMaterial jsonObject) {

		try {

			if (jsonObject.getStoreMaterialId() == null) {
				return new ResponseEntity<>("Material ID missing.", HttpStatus.NOT_ACCEPTABLE);
			}

			System.out.println(jsonObject.getStoreMaterialId());

			Optional<StoreMaterial> materialOpt = storeMaterialRepository.findById(jsonObject.getStoreMaterialId());

			if (!materialOpt.isPresent()) {
				return new ResponseEntity<>("Material not found.", HttpStatus.NOT_ACCEPTABLE);
			}

			Optional<StoreMaterialCategoryMaster> categoryOpt = storeMaterialCategoryRepository
					.findByCategory(jsonObject.getCategory().getCategory());

			if (!categoryOpt.isPresent()) {
				return new ResponseEntity<>("Category not found.", HttpStatus.NOT_ACCEPTABLE);
			}

			StoreMaterial material = materialOpt.get();
			StoreMaterialCategoryMaster category = categoryOpt.get();

			material.setMaterial(jsonObject.getMaterial().toUpperCase());
			material.setDescription(jsonObject.getDescription());
			material.setCreatedBy(jsonObject.getCreatedBy());
			material.setStatus(jsonObject.getStatus());
			material.setCategory(category);
			material.setAllowMultiple(jsonObject.getAllowMultiple());
			
			material.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

			storeMaterialRepository.save(material);

			return new ResponseEntity<>("Data updated successfully.", HttpStatus.OK);

		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/deleteStoreMaterialMaster/{id}")
	public ResponseEntity<Object> deleteStoreMaterialMaster(@PathVariable Long id) {
		try {
			this.storeMaterialRepository.deleteById(id);
			return new ResponseEntity<Object>("Data deleted successfully", HttpStatus.OK);
		} catch (DataIntegrityViolationException e) {
			return new ResponseEntity<Object>("Unable to delete Data due to mapping", HttpStatus.CONFLICT);
		} catch (Exception e) {
			return new ResponseEntity<Object>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/download/template/storeMaterial")
	public void storeMaterialTemplate(HttpServletResponse response) throws IOException {
		response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		ServletOutputStream outputStream = response.getOutputStream();
		String[] headerList = new String[] { "Material", "Category","Allow Multiple", "Description" };
		int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256 };
		ByteArrayInputStream excelFile = ExcelController.generateExcelTemplate(headerList, COLUMN_WIDTHS,
				"StoreMaterial Master");
		response.getOutputStream().write(excelFile.readAllBytes());
		outputStream.flush();
	}

	@GetMapping("/download/data/storeMaterial")
	public void exportstoreMaterialData(HttpServletResponse response) throws IOException {
		try {
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
			List<StoreMaterial> list = this.storeMaterialRepository.getalldata();
			String[] headerList = new String[] { "Material", "Category", "Description", "Status", "Created By",
					"Date & Time" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256 };

			List<Function<StoreMaterial, Object>> getters = Arrays.asList(StoreMaterial::getMaterial,
					category -> category.getCategory().getCategory(), StoreMaterial::getDescription,
					StoreMaterial::getStatus, StoreMaterial::getCreatedBy, StoreMaterial::getDateTimeModified);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(list, getters, headerList, COLUMN_WIDTHS,
					"StoreMaterial Master");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@PostMapping("/download/data/storeMaterial")
	public void exportToExcel(HttpServletResponse response, @RequestBody StoreMaterial jsonObject) throws IOException {
		try {
			// Set the content type to Excel file
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

			// Fetch data from the repository as a List<PlantMaster>
			List<StoreMaterial> listObject = this.storeMaterialRepository.getAllStoreMaterialMaster(jsonObject.getMaterial(),
					jsonObject.getDescription(), jsonObject.getCategory().getCategory(),  jsonObject.getAllowMultiple(), jsonObject.getCreatedBy());

			String[] headerList = new String[] { "Material", "Category", "Allow Multiple", "Description", "Status", "Created By",
					"Date & Time" };
			int[] COLUMN_WIDTHS = {
				    50 * 256, // Material
				    25 * 256, // Category
				    20 * 256, // Allow Multiple
				    50 * 256, // Description
				    25 * 256, // Status
				    30 * 256, // Created By
				    25 * 256  // Date Time
				};

			List<Function<StoreMaterial, Object>> getters = Arrays.asList(
				    StoreMaterial::getMaterial,
				    material -> material.getCategory().getCategory(),
				    material -> Boolean.TRUE.equals(material.getAllowMultiple()) ? "Yes" : "No",
				    StoreMaterial::getDescription,
				    StoreMaterial::getStatus,
				    StoreMaterial::getCreatedBy,
				    StoreMaterial::getDateTimeModified
				);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(listObject, getters, headerList, COLUMN_WIDTHS,
					"StoreMaterial Master");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();

		}
	}

	@PostMapping("/getLikestoreMaterial/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getLikestoreMaterial(@PathVariable("pageNum") int page,
			@PathVariable("pageSize") int pageSize, @RequestBody StoreMaterial jsonObject) {

		try {
			System.out.println(jsonObject);
			Pageable pageable = PageRequest.of(page, pageSize);
			Page<StoreMaterial> object = this.storeMaterialRepository.getLikeStoreMaterial(jsonObject.getMaterial(),
					jsonObject.getDescription(), jsonObject.getCategory().getCategory(), jsonObject.getCreatedBy(),
					pageable);
			System.out.println(object);
			return new ResponseEntity<Object>(object, HttpStatus.OK);

		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<Object>("ng", HttpStatus.OK);
		}
	}

	@PostMapping("/uploadstorematerial/{employeeId}")
	public ResponseEntity<Object> uploadstorematerial(@RequestParam("file") MultipartFile file,
			@PathVariable("employeeId") String employeeId) {

		if (!"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet".equals(file.getContentType())) {
			return new ResponseEntity<>("Please upload XLSX file.", HttpStatus.BAD_REQUEST);
		}

		List<String> errorList = new ArrayList<>();
		errorList.add("Errors , Row");

		try (InputStream is = file.getInputStream();
				OPCPackage opcPackage = OPCPackage.open(is);
				XSSFWorkbook workbook = new XSSFWorkbook(opcPackage)) {

			XSSFSheet sheet = workbook.getSheet("StoreMaterial Master");

			if (sheet == null) {
				return new ResponseEntity<>("StoreMaterial Master sheet not found.", HttpStatus.NOT_FOUND);
			}

			Iterator<Row> rows = sheet.iterator();

			if (rows.hasNext())
				rows.next();

			while (rows.hasNext()) {

				Row currentRow = rows.next();

				if (currentRow == null || currentRow.getLastCellNum() <= 0) {
					continue;
				}
				StoreMaterial upload = new StoreMaterial();
				for (int cellIdx = 0; cellIdx < currentRow.getLastCellNum(); cellIdx++) {

					Cell currentCell = currentRow.getCell(cellIdx);
					String value = ExcelUploadHelper.getStringCellValue(currentCell).trim();

					switch (cellIdx) {
					case 0:
						upload.setMaterial(value);
						break;
					case 1:
						Optional<StoreMaterialCategoryMaster> categoryOptional = storeMaterialCategoryRepository
								.findByCategory(value);
						if (categoryOptional.isPresent()) {
							upload.setCategory(categoryOptional.get());
						} else {
							errorList.add("Category not found , " + (currentRow.getRowNum() + 1));
						}
						break;
						
					case 2:
					    if ("YES".equalsIgnoreCase(value)
					            || "TRUE".equalsIgnoreCase(value)
					            || "Y".equalsIgnoreCase(value)) {
					        upload.setAllowMultiple(true);
					    } else {
					        upload.setAllowMultiple(false);
					    }
					    break;
					case 3:
						upload.setDescription(value);
						break;
					default:
						break;
					}
				}
				if (upload.getMaterial() == null || upload.getMaterial().isEmpty()) {
					errorList.add("Material  missing , " + (currentRow.getRowNum() + 1));
					continue;
				}
				if (upload.getCategory() == null) {
					errorList.add("Category missing , " + (currentRow.getRowNum() + 1));
					continue;
				}
				boolean exists = storeMaterialRepository.existsByMaterialAndCategory_Category(upload.getMaterial(),
						upload.getCategory().getCategory());
				if (exists) {
					errorList.add("Mapping already exists , " + (currentRow.getRowNum() + 1));
					continue;
				}

				upload.setCreatedBy(employeeId);
				upload.setStatus("1");
				upload.setMaterial(upload.getMaterial().toUpperCase());
				upload.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
				upload.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

				storeMaterialRepository.save(upload);
			}

			Map<String, Object> responseMap = new HashMap<>();
			responseMap.put("message", "Excel uploaded successfully.");
			responseMap.put("errorList", errorList);

			return new ResponseEntity<>(responseMap, HttpStatus.OK);

		} catch (Exception e) {

			return new ResponseEntity<>("Upload failed : " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
