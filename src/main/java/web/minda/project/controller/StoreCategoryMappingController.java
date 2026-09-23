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
import web.minda.project.entity.StoreMaterialCategoryMaster;
import web.minda.project.helper.ExcelUploadHelper;
import web.minda.project.repositories.ProcessMasterRepository;
import web.minda.project.repositories.StoreCategoryMappingRepository;
import web.minda.project.repositories.StoreMaterialCategoryRepository;
import web.minda.project.service.DateTimeService;

@RestController
@RequestMapping("/Controllers")
public class StoreCategoryMappingController {


	@Autowired
	StoreMaterialCategoryRepository storeMaterialCategoryRepository;
	StoreMaterialCategoryMaster masterObject = new StoreMaterialCategoryMaster();
	
	@Autowired
	ProcessMasterRepository processMasterRepository;
	ProcessMaster processMaster = new ProcessMaster();
	
	@Autowired
	StoreCategoryMappingRepository storeCategoryMappingRepository;
	StoreCategoryMapping storeCategoryMapping = new StoreCategoryMapping();

	@Autowired
	private DateTimeService dateTimeService;

	@PostMapping("/insertStoreCategoryMappingMaster")
	public ResponseEntity<Object> insertStoreCategoryMappingMaster(@RequestBody StoreCategoryMapping jsonObject) {

	    try {

	        Optional<ProcessMaster> processOpt =
	                processMasterRepository.findByProcessName(
	                        jsonObject.getProcess().getProcessName());

	        if (processOpt.isEmpty()) {
	            return new ResponseEntity<>("Process does not exist.", HttpStatus.NOT_ACCEPTABLE);
	        }

	        Optional<StoreMaterialCategoryMaster> categoryOpt =
	                storeMaterialCategoryRepository.findByCategory(
	                        jsonObject.getCategory().getCategory());

	        if (categoryOpt.isEmpty()) {
	            return new ResponseEntity<>("Category does not exist.", HttpStatus.NOT_ACCEPTABLE);
	        }

	        boolean mappingExists =
	                storeCategoryMappingRepository
	                        .existsByProcess_ProcessNameAndCategory_Category(
	                                jsonObject.getProcess().getProcessName(),
	                                jsonObject.getCategory().getCategory());

	        if (mappingExists) {
	            return new ResponseEntity<>("Data already exist.", HttpStatus.NOT_ACCEPTABLE);
	        }

	        jsonObject.setProcess(processOpt.get());
	        jsonObject.setCategory(categoryOpt.get());

	        jsonObject.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
	        jsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

	        storeCategoryMappingRepository.save(jsonObject);

	        return new ResponseEntity<>("Data added successfully.", HttpStatus.OK);

	    } catch (Exception e) {
	        e.printStackTrace();
	        return new ResponseEntity<>("Something went wrong.", HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	
	
	@PostMapping("/editStoreCategoryMappingMaster")
	public ResponseEntity<Object> editStoreCategoryMappingMaster(@RequestBody StoreCategoryMapping jsonObject) {

	    try {

	        if (jsonObject.getStoreCategoryMappingId() == null) {
	            return new ResponseEntity<>("Mapping Id not found.", HttpStatus.NOT_ACCEPTABLE);
	        }

	        Optional<StoreCategoryMapping> mappingOpt =
	                storeCategoryMappingRepository
	                        .findById(jsonObject.getStoreCategoryMappingId());

	        if (mappingOpt.isEmpty()) {
	            return new ResponseEntity<>("Mapping record not found.", HttpStatus.NOT_ACCEPTABLE);
	        }

	        Optional<ProcessMaster> processOpt =
	                processMasterRepository
	                        .findByProcessName(jsonObject.getProcess().getProcessName());

	        if (processOpt.isEmpty()) {
	            return new ResponseEntity<>("Process does not exist.", HttpStatus.NOT_ACCEPTABLE);
	        }

	        Optional<StoreMaterialCategoryMaster> categoryOpt =
	                storeMaterialCategoryRepository
	                        .findByCategory(jsonObject.getCategory().getCategory());

	        if (categoryOpt.isEmpty()) {
	            return new ResponseEntity<>("Category does not exist.", HttpStatus.NOT_ACCEPTABLE);
	        }

	        boolean mappingExists =
	                storeCategoryMappingRepository
	                        .existsByProcess_ProcessNameAndCategory_CategoryAndStoreCategoryMappingIdNot(
	                                jsonObject.getProcess().getProcessName(),
	                                jsonObject.getCategory().getCategory(),
	                                jsonObject.getStoreCategoryMappingId());

	        if (mappingExists) {
	            return new ResponseEntity<>("Data already exist.", HttpStatus.NOT_ACCEPTABLE);
	        }

	        StoreCategoryMapping mapping = mappingOpt.get();

	        mapping.setProcess(processOpt.get());
	        mapping.setCategory(categoryOpt.get());
	        mapping.setStatus(jsonObject.getStatus());

	        mapping.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

	        storeCategoryMappingRepository.save(mapping);

	        return new ResponseEntity<>("Data updated successfully.", HttpStatus.OK);

	    } catch (Exception e) {
	        e.printStackTrace();
	        return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	
	@DeleteMapping("/deleteStoreCategoryMapping/{id}")
	public ResponseEntity<Object> deleteStoreCategoryMapping(@PathVariable Long id) {
		try {
			this.storeCategoryMappingRepository.deleteById(id);
			return new ResponseEntity<Object>("Data deleted successfully", HttpStatus.OK);
		} catch (DataIntegrityViolationException e) {
			Optional<StoreCategoryMapping> object = this.storeCategoryMappingRepository.findById(id);
			return new ResponseEntity<Object>(
					"Unable to delete Data due to mapping"+object,
					HttpStatus.CONFLICT);
		} catch (Exception e) {
			return new ResponseEntity<Object>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}



	@GetMapping("/download/template/storeCategoryMapping")
	public void rackTemplate(HttpServletResponse response) throws IOException {
		response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		ServletOutputStream outputStream = response.getOutputStream();
		String[] headerList = new String[] { "Category", "Process"};
		int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256 };
		ByteArrayInputStream excelFile = ExcelController.generateExcelTemplate(headerList, COLUMN_WIDTHS,
				"StoreCategoryMapping Master");
		response.getOutputStream().write(excelFile.readAllBytes());
		outputStream.flush();
	}

	@GetMapping("/download/data/storeCategoryMapping")
	public void exportrackData(HttpServletResponse response) throws IOException {
		try {
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
			List<StoreCategoryMapping> list = this.storeCategoryMappingRepository.getalldata();
			String[] headerList = new String[] {"Category", "Process", "Status", "Created By", "Date & Time" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256 };

			List<Function<StoreCategoryMapping, Object>> getters = Arrays.asList(category -> category.getCategory() != null ? category.getCategory().getCategory() : "",
					 process -> process.getProcess() != null ? process.getProcess().getProcessName() : "", StoreCategoryMapping::getStatus,StoreCategoryMapping::getCreatedBy, StoreCategoryMapping::getDateTimeModified);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(list, getters, headerList,
					COLUMN_WIDTHS, "StoreCategoryMapping Master");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@PostMapping("/getLikeStoreCategoryMapping/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getLikeStoreCategoryMapping(@PathVariable("pageNum") int page,
			@PathVariable("pageSize") int pageSize, @RequestBody StoreCategoryMapping jsonObject) {

		try {
			System.out.println("ok1"+jsonObject.getProcess().getProcessName());
			Pageable pageable = PageRequest.of(page, pageSize);
			Page<StoreCategoryMapping> object = this.storeCategoryMappingRepository.getLikeStoreMaterialMapping(jsonObject.getCategory().getCategory(),
					jsonObject.getProcess().getProcessName(), jsonObject.getStatus(), jsonObject.getCreatedBy(), pageable);
			System.out.println(object);
			return new ResponseEntity<Object>(object, HttpStatus.OK);

		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<Object>("ng", HttpStatus.OK);
		}
	}
	
	
	@PostMapping("/uploadstoreCategoryMapping/{employeeId}")
	public ResponseEntity<Object> uploadstoreCategoryMapping(@RequestParam("file") MultipartFile file,
	                                         @PathVariable("employeeId") String employeeId) {

	    if (!"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
	            .equals(file.getContentType())) {
	        return new ResponseEntity<>("Please upload XLSX file.", HttpStatus.BAD_REQUEST);
	    }

	    List<String> errorList = new ArrayList<>();
	    errorList.add("Errors , Row");

	    try (InputStream is = file.getInputStream();
	         OPCPackage opcPackage = OPCPackage.open(is);
	         XSSFWorkbook workbook = new XSSFWorkbook(opcPackage)) {

	        XSSFSheet sheet = workbook.getSheet("StoreCategoryMapping Master");

	        if (sheet == null) {
	            return new ResponseEntity<>("StoreCategoryMapping Master sheet not found.", HttpStatus.NOT_FOUND);
	        }

	        Iterator<Row> rows = sheet.iterator();

	        if (rows.hasNext()) rows.next();

	        while (rows.hasNext()) {

	            Row currentRow = rows.next();

	            if (currentRow == null || currentRow.getLastCellNum() <= 0) {
	                continue;
	            }
	            StoreCategoryMapping upload = new StoreCategoryMapping();
	            for (int cellIdx = 0; cellIdx < currentRow.getLastCellNum(); cellIdx++) {

	                Cell currentCell = currentRow.getCell(cellIdx);
	                String value = ExcelUploadHelper.getStringCellValue(currentCell).trim();

	                switch (cellIdx) {
	                case 0:              	
	                    Optional<StoreMaterialCategoryMaster> categoryOptional =
                        storeMaterialCategoryRepository.findByCategory(value);
		                if (categoryOptional.isPresent()) {
		                	 upload.setCategory(categoryOptional.get());
		                } else {
		                    errorList.add("Category not found , " + (currentRow.getRowNum() + 1));
		                } 
			                    break;
	                case 1:
	                    Optional<ProcessMaster> processOptional =
	                            processMasterRepository.findByProcessName(value);
	                    if (processOptional.isPresent()) {
	                    	 upload.setProcess(processOptional.get());
	                    } else {
	                        errorList.add("Process not found , " + (currentRow.getRowNum() + 1));
	                    }  
	                break;                
            
	                default:
	                    break;
	                }
	            }	            
	       
	            if (upload.getCategory() == null) {
	                errorList.add("Category missing , " + (currentRow.getRowNum() + 1));
	                continue;
	            }
	            
	            if (upload.getProcess() == null) {
	                errorList.add("Process  missing , " + (currentRow.getRowNum() + 1));
	                continue;
	            }
	            
	            boolean exists = storeCategoryMappingRepository
	                    .existsByProcess_ProcessNameAndCategory_Category(
	                            upload.getProcess().getProcessName(),
	                            upload.getCategory().getCategory()
	                    );
	            if (exists) {
	                errorList.add("Mapping already exists , " + (currentRow.getRowNum() + 1));
	                continue;
	            }

	            upload.setCreatedBy(employeeId);
	            upload.setStatus("1");
	            upload.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
	            upload.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

	            storeCategoryMappingRepository.save(upload);
	        }

	        Map<String, Object> responseMap = new HashMap<>();
	        responseMap.put("message", "Excel uploaded successfully.");
	        responseMap.put("errorList", errorList);

	        return new ResponseEntity<>(responseMap, HttpStatus.OK);

	    } catch (Exception e) {

	        return new ResponseEntity<>("Upload failed : " + e.getMessage(),
	                HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	
}
