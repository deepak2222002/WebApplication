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
import web.minda.project.entity.ProductionArticleMaster;
import web.minda.project.entity.ProductionOperation;
import web.minda.project.entity.ProductionRejection;
import web.minda.project.helper.ExcelUploadHelper;
import web.minda.project.repositories.ProductionArticleMasterRepository;
import web.minda.project.repositories.ProductionOperationMasterRepository;

import web.minda.project.service.DateTimeService;

@RestController
@RequestMapping("/Controllers")
public class ProductionOperationController {

	@Autowired
	ProductionOperationMasterRepository productionOperationMasterRepository;
	ProductionOperation masterObject = new ProductionOperation();
	
	@Autowired
	ProductionArticleMasterRepository productionArticleMasterRepository;
	ProductionArticleMaster productionArticleMaster = new ProductionArticleMaster();
	
	@Autowired
	private DateTimeService dateTimeService;

	@PostMapping("/insertProductionOperation")
	public ResponseEntity<Object> insertProductionOperation(@RequestBody ProductionOperation jsonObject) {

	    try {
	        Optional<ProductionArticleMaster> articleOpt =
	                productionArticleMasterRepository
	                        .findByArticle(jsonObject.getProductionArticle().getArticle());

	        if (articleOpt.isEmpty()) {
	            return new ResponseEntity<>("Article does not exist.", HttpStatus.NOT_ACCEPTABLE);
	        }

	        ProductionArticleMaster article = articleOpt.get();

	        jsonObject.setProductionArticle(article);

	        jsonObject.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
	        jsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

	        productionOperationMasterRepository.save(jsonObject);

	        return new ResponseEntity<>("Data added successfully.", HttpStatus.OK);

	    } catch (Exception e) {
	        e.printStackTrace();
	        return new ResponseEntity<>("Something went wrong.", HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}

	@PostMapping("/editProductionOperation")
	public ResponseEntity<Object> editProductionOperation(@RequestBody ProductionOperation jsonObject) {

	    try {

	        if (jsonObject.getProductionOperationId() == null) {
	            return new ResponseEntity<>("Operation ID missing.", HttpStatus.NOT_ACCEPTABLE);
	        }

	        Optional<ProductionOperation> operationOpt =
	                productionOperationMasterRepository
	                        .findById(jsonObject.getProductionOperationId());

	        if (operationOpt.isEmpty()) {
	            return new ResponseEntity<>("Operation not found.", HttpStatus.NOT_ACCEPTABLE);
	        }

	        Optional<ProductionArticleMaster> articleOpt =
	                productionArticleMasterRepository
	                        .findByArticle(jsonObject.getProductionArticle().getArticle());

	        if (articleOpt.isEmpty()) {
	            return new ResponseEntity<>("Article not found.", HttpStatus.NOT_ACCEPTABLE);
	        }

	        ProductionOperation operation = operationOpt.get();
	        ProductionArticleMaster article = articleOpt.get();

	        operation.setDescription(jsonObject.getDescription());
	        operation.setOperation(jsonObject.getOperation());
	        operation.setProductionArticle(article);
	        operation.setStatus(jsonObject.getStatus());

	        operation.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

	        productionOperationMasterRepository.save(operation);

	        return new ResponseEntity<>("Data updated successfully.", HttpStatus.OK);

	    } catch (Exception e) {
	        e.printStackTrace();
	        return new ResponseEntity<>("Something went wrong.", HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	@DeleteMapping("/deleteProductionOperation/{id}")
	public ResponseEntity<Object> deleteProductionOperation(@PathVariable Long id) {
		try {
			this.productionOperationMasterRepository.deleteById(id);
			return new ResponseEntity<Object>("Data deleted successfully", HttpStatus.OK);
		} catch (DataIntegrityViolationException e) {
			Optional<ProductionOperation> object = this.productionOperationMasterRepository.findById(id);
			return new ResponseEntity<Object>(
					"Unable to delete Data due to mapping",
					HttpStatus.CONFLICT);
		} catch (Exception e) {
			return new ResponseEntity<Object>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}




	@GetMapping("/download/template/productionOperation")
	public void productionOperationTemplate(HttpServletResponse response) throws IOException {
		response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		ServletOutputStream outputStream = response.getOutputStream();
		String[] headerList = new String[] { "Article","Description" ,"Operation"};
		int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256 };
		ByteArrayInputStream excelFile = ExcelController.generateExcelTemplate(headerList, COLUMN_WIDTHS,
				"ProductionOperation");
		response.getOutputStream().write(excelFile.readAllBytes());
		outputStream.flush();
	}

	@GetMapping("/download/data/productionOperation")
	public void exportproductionOperationData(HttpServletResponse response) throws IOException {
		try {
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
			List<ProductionOperation> list = this.productionOperationMasterRepository.getalldata();
			String[] headerList = new String[] { "Article","Description" ,"Operation","Status", "Created By", "Date & Time" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256 };

			List<Function<ProductionOperation, Object>> getters = Arrays.asList(article->article.getProductionArticle().getArticle(),
					ProductionOperation::getDescription,ProductionOperation::getOperation,
					ProductionOperation::getStatus, ProductionOperation::getCreatedBy, ProductionOperation::getDateTimeModified);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(list, getters, headerList,
					COLUMN_WIDTHS, "ProductionOperation Master");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	@PostMapping("/download/data/productionOperation")
	public void exportToExcel(HttpServletResponse response, @RequestBody ProductionOperation jsonObject)
			throws IOException {
		try {
			// Set the content type to Excel file
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

			// Fetch data from the repository as a List<PlantMaster>
			List<ProductionOperation> listObject = this.productionOperationMasterRepository
					.getAllProductionOperationMaster(jsonObject.getProductionArticle().getArticle(),
							jsonObject.getOperation(),jsonObject.getDescription(),
							 jsonObject.getCreatedBy());

			String[] headerList = new String[] { "Article","Description" ,"Operation","Status", "Created By", "Date & Time" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256 };

			List<Function<ProductionOperation, Object>> getters = Arrays.asList(article->article.getProductionArticle().getArticle(),
					ProductionOperation::getDescription,ProductionOperation::getOperation,
					ProductionOperation::getStatus, ProductionOperation::getCreatedBy, ProductionOperation::getDateTimeModified);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(listObject, getters, headerList,
					COLUMN_WIDTHS, "ProductionOperation Master");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();

		}
	}

	@PostMapping("/getLikeProductionOperation/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getLikeProductionOperation(@PathVariable("pageNum") int page,
			@PathVariable("pageSize") int pageSize, @RequestBody ProductionOperation jsonObject) {

		try {
			System.out.println(jsonObject.getOperation());
			Pageable pageable = PageRequest.of(page, pageSize);
			Page<ProductionOperation> object = this.productionOperationMasterRepository.getLikeProductionOperation(jsonObject.getProductionArticle().getArticle(),
					jsonObject.getOperation(),jsonObject.getDescription(),
					 jsonObject.getCreatedBy(), pageable);
			return new ResponseEntity<Object>(object, HttpStatus.OK);

		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<Object>("ng", HttpStatus.OK);
		}
	}
	
	
	@PostMapping("/uploadproductionoperation/{employeeId}")
	public ResponseEntity<Object> uploadproductionoperation(@RequestParam("file") MultipartFile file,
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

	        XSSFSheet sheet = workbook.getSheet("ProductionOperation");

	        if (sheet == null) {
	            return new ResponseEntity<>("ProductionOperation sheet not found.", HttpStatus.NOT_FOUND);
	        }

	        Iterator<Row> rows = sheet.iterator();

	        if (rows.hasNext()) rows.next();

	        while (rows.hasNext()) {

	            Row currentRow = rows.next();

	            if (currentRow == null || currentRow.getLastCellNum() <= 0) {
	                continue;
	            }
	            ProductionOperation upload = new ProductionOperation();
	            for (int cellIdx = 0; cellIdx < currentRow.getLastCellNum(); cellIdx++) {

	                Cell currentCell = currentRow.getCell(cellIdx);
	                String value = ExcelUploadHelper.getStringCellValue(currentCell).trim();

	                switch (cellIdx) {
	                case 0:       
	                	  Optional<ProductionArticleMaster> articleOptional =
                          productionArticleMasterRepository.findByArticle(value);
		                  if (articleOptional.isPresent()) {
		                  	 upload.setProductionArticle(articleOptional.get());
		                  } else {
		                      errorList.add("Article not found , " + (currentRow.getRowNum() + 1));
		                  }
	                    break;
	                case 1:
	                	 upload.setDescription(value);
	                break;                
                    case 2:                	
	                    upload.setOperation(value);
	                break;
	                default:
	                    break;
	                }
	            }	            
	            if (upload.getProductionArticle() == null ) {
	                errorList.add("Article  missing , " + (currentRow.getRowNum() + 1));
	                continue;
	            }
	            if (upload.getOperation() == null || upload.getOperation().isEmpty()) {
	                errorList.add("Operation missing , " + (currentRow.getRowNum() + 1));
	                continue;
	            }
	            
	            boolean exists = productionOperationMasterRepository
	                    .existsByProductionArticle_ArticleAndAndOperation(
	                            upload.getProductionArticle().getArticle(),
	                            upload.getOperation()
	                    );
	            if (exists) {
	                errorList.add("Mapping already exists , " + (currentRow.getRowNum() + 1));
	                continue;
	            }
	        

	            upload.setCreatedBy(employeeId);
	            upload.setStatus("1");
	            upload.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
	            upload.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

	            productionOperationMasterRepository.save(upload);
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
