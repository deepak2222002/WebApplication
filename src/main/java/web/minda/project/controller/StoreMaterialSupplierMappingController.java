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
import web.minda.project.entity.ProcessMaster;
import web.minda.project.entity.StoreCategoryMapping;
import web.minda.project.entity.StoreMaterial;
import web.minda.project.entity.StoreMaterialCategoryMaster;
import web.minda.project.entity.StoreMaterialSupplierMapping;
import web.minda.project.entity.SupplierMaster;
import web.minda.project.helper.ExcelUploadHelper;
import web.minda.project.repositories.StoreMaterialRepository;
import web.minda.project.repositories.StoreMaterialSupplierMappingRepository;
import web.minda.project.repositories.SupplierMasterRepository;
import web.minda.project.service.DateTimeService;

@RestController
@RequestMapping("/Controllers")
public class StoreMaterialSupplierMappingController {

	@Autowired
	SupplierMasterRepository supplierMasterRepository;

	@Autowired
	StoreMaterialRepository storeMaterialMasterRepository;

	@Autowired
	StoreMaterialSupplierMappingRepository storeMaterialSupplierMappingRepository;

	@Autowired
	private DateTimeService dateTimeService;

	@PostMapping("/insertStoreMaterialSupplierMappingMaster")
	public ResponseEntity<Object> insertStoreMaterialSupplierMappingMaster(
			@RequestBody StoreMaterialSupplierMapping jsonObject) {

		try {

			Optional<StoreMaterial> storeOpt = storeMaterialMasterRepository
					.findByMaterial(jsonObject.getStoreMaterial().getMaterial());

			if (storeOpt.isEmpty()) {
				return new ResponseEntity<>("Store Material does not exist.", HttpStatus.NOT_ACCEPTABLE);
			}

			Optional<SupplierMaster> categoryOpt = supplierMasterRepository
					.findBySupplierName(jsonObject.getSupplier().getSupplierName());

			if (categoryOpt.isEmpty()) {
				return new ResponseEntity<>("Supplier does not exist.", HttpStatus.NOT_ACCEPTABLE);
			}

			boolean mappingExists = storeMaterialSupplierMappingRepository
					.existsByStoreMaterial_MaterialIgnoreCaseAndSupplier_SupplierNameIgnoreCaseAndStoreMaterialSupplierMappingIdNot(
							jsonObject.getStoreMaterial().getMaterial(), jsonObject.getSupplier().getSupplierName(),
							jsonObject.getStoreMaterialSupplierMappingId());

			if (mappingExists) {
				return new ResponseEntity<>("Data already exist.", HttpStatus.NOT_ACCEPTABLE);
			}

			jsonObject.setStoreMaterial(storeOpt.get());
			jsonObject.setSupplier(categoryOpt.get());

			jsonObject.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
			jsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

			storeMaterialSupplierMappingRepository.save(jsonObject);

			return new ResponseEntity<>("Data added successfully.", HttpStatus.OK);

		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("Something went wrong.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/editStoreMaterialSupplierMappingMaster")
	public ResponseEntity<Object> editStoreMaterialSupplierMappingMaster(
			@RequestBody StoreMaterialSupplierMapping jsonObject) {

		try {

			if (jsonObject.getStoreMaterialSupplierMappingId() == null) {
				return new ResponseEntity<>("Mapping Id not found.", HttpStatus.NOT_ACCEPTABLE);
			}

			Optional<StoreMaterialSupplierMapping> mappingOpt = storeMaterialSupplierMappingRepository
					.findById(jsonObject.getStoreMaterialSupplierMappingId());

			if (mappingOpt.isEmpty()) {
				return new ResponseEntity<>("Mapping record not found.", HttpStatus.NOT_ACCEPTABLE);
			}

			Optional<StoreMaterial> storeOpt = storeMaterialMasterRepository
					.findByMaterial(jsonObject.getStoreMaterial().getMaterial());

			if (storeOpt.isEmpty()) {
				return new ResponseEntity<>("Material does not exist.", HttpStatus.NOT_ACCEPTABLE);
			}

			Optional<SupplierMaster> categoryOpt = supplierMasterRepository
					.findBySupplierName(jsonObject.getSupplier().getSupplierName());

			if (categoryOpt.isEmpty()) {
				return new ResponseEntity<>("Category does not exist.", HttpStatus.NOT_ACCEPTABLE);
			}

			boolean mappingExists = storeMaterialSupplierMappingRepository
					.existsByStoreMaterial_MaterialIgnoreCaseAndSupplier_SupplierNameIgnoreCaseAndStoreMaterialSupplierMappingIdNot(
							jsonObject.getStoreMaterial().getMaterial(), jsonObject.getSupplier().getSupplierName(),
							jsonObject.getStoreMaterialSupplierMappingId());

			if (mappingExists) {
				return new ResponseEntity<>("Data already exist.", HttpStatus.NOT_ACCEPTABLE);
			}

			jsonObject.setStoreMaterial(storeOpt.get());
			jsonObject.setSupplier(categoryOpt.get());

			System.out.println(categoryOpt.get().getSupplierName());

			jsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

			storeMaterialSupplierMappingRepository.save(jsonObject);

			return new ResponseEntity<>("Data updated successfully.", HttpStatus.OK);

		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/deleteStoreMaterialSupplierMapping/{id}")
	public ResponseEntity<Object> deleteStoreMaterialSupplierMapping(@PathVariable Long id) {
		try {
			this.storeMaterialSupplierMappingRepository.deleteById(id);
			return new ResponseEntity<Object>("Data deleted successfully", HttpStatus.OK);
		} catch (DataIntegrityViolationException e) {
			Optional<StoreMaterialSupplierMapping> object = this.storeMaterialSupplierMappingRepository.findById(id);
			return new ResponseEntity<Object>("Unable to delete Data due to mapping" + object, HttpStatus.CONFLICT);
		} catch (Exception e) {
			return new ResponseEntity<Object>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/download/template/storeMaterialSupplierMapping")
	public void rackTemplate(HttpServletResponse response) throws IOException {
		response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		ServletOutputStream outputStream = response.getOutputStream();
		String[] headerList = new String[] { "Material", "Supplier" };
		int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256 };
		ByteArrayInputStream excelFile = ExcelController.generateExcelTemplate(headerList, COLUMN_WIDTHS,
				"StoreMaterialSupplierMapping");
		response.getOutputStream().write(excelFile.readAllBytes());
		outputStream.flush();
	}

//	@GetMapping("/download/data/storeCategoryMapping")
//	public void exportrackData(HttpServletResponse response) throws IOException {
//		try {
//			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
//			List<StoreMaterialSupplierMapping> list = this.storeMaterialSupplierMappingRepository.getalldata();
//			String[] headerList = new String[] { "Category", "Process", "Status", "Created By", "Date & Time" };
//			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
//					25 * 256, 30 * 256 };
//
//			List<Function<StoreMaterialSupplierMapping, Object>> getters = Arrays.asList(
//					category -> category.getCategory() != null ? category.getCategory().getCategory() : "",
//					process -> process.getProcess() != null ? process.getProcess().getProcessName() : "",
//					StoreMaterialSupplierMapping::getStatus, StoreMaterialSupplierMapping::getCreatedBy,
//					StoreMaterialSupplierMapping::getDateTimeModified);
//
//			ByteArrayInputStream excelFile = ExcelController.generateExcelData(list, getters, headerList, COLUMN_WIDTHS,
//					"StoreMaterialSupplierMapping Master");
//			ServletOutputStream outputStream = response.getOutputStream();
//			response.getOutputStream().write(excelFile.readAllBytes());
//			outputStream.flush();
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//	}

	@PostMapping("/download/data/StoreMaterialSupplierMapping")
	public void exportToExcel(HttpServletResponse response, @RequestBody StoreMaterialSupplierMapping jsonObject)
			throws IOException {
		try {
			// Set the content type to Excel file
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

			// Fetch data from the repository as a List<PlantMaster>
			List<StoreMaterialSupplierMapping> listObject = this.storeMaterialSupplierMappingRepository
					.getAllStoreMaterialSupplierMappingMaster(jsonObject.getStoreMaterial().getMaterial(),
							jsonObject.getSupplier().getSupplierName(), jsonObject.getCreatedBy());

			String[] headerList = new String[] { "Material", "Supplier Name", "Created By", "Date & Time" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256 };

			List<Function<StoreMaterialSupplierMapping, Object>> getters = Arrays.asList(
					obj -> obj.getStoreMaterial() != null ? obj.getStoreMaterial().getMaterial() : "",
					obj -> obj.getSupplier() != null ? obj.getSupplier().getSupplierName() : "",
					StoreMaterialSupplierMapping::getCreatedBy, StoreMaterialSupplierMapping::getDateTimeModified);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(listObject, getters, headerList,
					COLUMN_WIDTHS, "StoreMaterialSupplierMapping");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();

		}
	}

	@PostMapping("/getLikeStoreMaterialSupplierMapping/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getLikeStoreMaterialSupplierMapping(@PathVariable("pageNum") int page,
			@PathVariable("pageSize") int pageSize, @RequestBody StoreMaterialSupplierMapping jsonObject) {

		try {
			Pageable pageable = PageRequest.of(page, pageSize);
			Page<StoreMaterialSupplierMapping> object = this.storeMaterialSupplierMappingRepository
					.getLikeStoreMaterialSupplierMapping(jsonObject.getStoreMaterial().getMaterial(),
							jsonObject.getSupplier().getSupplierName(), jsonObject.getCreatedBy(), pageable);
			return new ResponseEntity<Object>(object, HttpStatus.OK);

		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<Object>("ng", HttpStatus.OK);
		}
	}

	@PostMapping("/uploadstoreMaterialSupplierMapping/{employeeId}")
	public ResponseEntity<Object> uploadstoreCategoryMapping(@RequestParam("file") MultipartFile file,
			@PathVariable("employeeId") String employeeId) {

		if (!"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet".equals(file.getContentType())) {
			return new ResponseEntity<>("Please upload XLSX file.", HttpStatus.BAD_REQUEST);
		}

		List<String> errorList = new ArrayList<>();
		errorList.add("Errors , Row");

		try (InputStream is = file.getInputStream();
				OPCPackage opcPackage = OPCPackage.open(is);
				XSSFWorkbook workbook = new XSSFWorkbook(opcPackage)) {

			XSSFSheet sheet = workbook.getSheet("StoreMaterialSupplierMapping");

			if (sheet == null) {
				return new ResponseEntity<>("StoreMaterialSupplierMapping sheet not found.", HttpStatus.NOT_FOUND);
			}

			Iterator<Row> rows = sheet.iterator();

			if (rows.hasNext())
				rows.next();

			while (rows.hasNext()) {

				Row currentRow = rows.next();

				if (currentRow == null || currentRow.getLastCellNum() <= 0) {
					continue;
				}
				StoreMaterialSupplierMapping upload = new StoreMaterialSupplierMapping();
				for (int cellIdx = 0; cellIdx < currentRow.getLastCellNum(); cellIdx++) {

					Cell currentCell = currentRow.getCell(cellIdx);
					String value = ExcelUploadHelper.getStringCellValue(currentCell).trim();
					System.out.println(value);

					switch (cellIdx) {
					case 0:
						Optional<StoreMaterial> categoryOptional = storeMaterialMasterRepository.findByMaterial(value);
//						System.out.println(categoryOptional.get().getMaterial());
						if (categoryOptional.isPresent()) {
							upload.setStoreMaterial(categoryOptional.get());
						} else {
							errorList.add("Material not found , " + (currentRow.getRowNum() + 1));
						}
						break;
					case 1:
						Optional<SupplierMaster> processOptional = supplierMasterRepository.findBySupplierName(value);
						if (processOptional.isPresent()) {
							upload.setSupplier(processOptional.get());
						} else {
							errorList.add("Supplier not found , " + (currentRow.getRowNum() + 1));
						}
						break;

					default:
						break;
					}
				}

				if (upload.getStoreMaterial() == null) {
					errorList.add("Material missing , " + (currentRow.getRowNum() + 1));
					continue;
				}

				if (upload.getSupplier() == null) {
					errorList.add("Supplier  missing , " + (currentRow.getRowNum() + 1));
					continue;
				}

				boolean exists = storeMaterialSupplierMappingRepository
						.existsByStoreMaterial_MaterialIgnoreCaseAndSupplier_SupplierName(
								upload.getStoreMaterial().getMaterial(), upload.getSupplier().getSupplierName());
				if (exists) {
					errorList.add("Mapping already exists , " + (currentRow.getRowNum() + 1));
					continue;
				}

				upload.setCreatedBy(employeeId);
				upload.setStatus("1");
				upload.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
				upload.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

				storeMaterialSupplierMappingRepository.save(upload);
			}

			Map<String, Object> responseMap = new HashMap<>();
			responseMap.put("message", "Excel uploaded successfully.");
			responseMap.put("errorList", errorList);

			return new ResponseEntity<>(responseMap, HttpStatus.OK);

		} catch (Exception e) {
			
			System.out.println(e);

			return new ResponseEntity<>("Upload failed : " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
