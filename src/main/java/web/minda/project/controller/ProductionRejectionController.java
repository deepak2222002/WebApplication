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
import web.minda.project.entity.ProductionArticleCategoryMaster;
import web.minda.project.entity.ProductionArticleMaster;
import web.minda.project.entity.ProductionRejection;
import web.minda.project.helper.ExcelUploadHelper;
import web.minda.project.repositories.ProductionArticleMasterRepository;
import web.minda.project.repositories.ProductionRejectionMasterRepository;
import web.minda.project.service.DateTimeService;

@RestController
@RequestMapping("/Controllers")
public class ProductionRejectionController {
	@Autowired
	ProductionRejectionMasterRepository productionRejectionMasterRepository;
	ProductionRejection masterObject = new ProductionRejection();
	
	@Autowired
	ProductionArticleMasterRepository productionArticleMasterRepository;
	ProductionArticleMaster productionArticleMaster = new ProductionArticleMaster();
	
	@Autowired
	private DateTimeService dateTimeService;

	@PostMapping("/insertProductionRejection")
	public ResponseEntity<Object> insertProductionRejection(@RequestBody ProductionRejection jsonObject) {

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

	        productionRejectionMasterRepository.save(jsonObject);

	        return new ResponseEntity<>("Data added successfully.", HttpStatus.OK);

	    } catch (Exception e) {
	        e.printStackTrace();
	        return new ResponseEntity<>("Something went wrong.", HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	@PostMapping("/editProductionRejection")
	public ResponseEntity<Object> editProductionRejection(@RequestBody ProductionRejection jsonObject) {

	    try {

	        if (jsonObject.getProductionRejectionId() == null) {
	            return new ResponseEntity<>("Rejection ID missing.", HttpStatus.NOT_ACCEPTABLE);
	        }

	        Optional<ProductionRejection> rejectionOpt =
	                productionRejectionMasterRepository
	                        .findById(jsonObject.getProductionRejectionId());

	        if (rejectionOpt.isEmpty()) {
	            return new ResponseEntity<>("Rejection record not found.", HttpStatus.NOT_ACCEPTABLE);
	        }

	        Optional<ProductionArticleMaster> articleOpt =
	                productionArticleMasterRepository
	                        .findByArticle(jsonObject.getProductionArticle().getArticle());

	        if (articleOpt.isEmpty()) {
	            return new ResponseEntity<>("Article not found.", HttpStatus.NOT_ACCEPTABLE);
	        }

	        ProductionRejection rejection = rejectionOpt.get();
	        ProductionArticleMaster article = articleOpt.get();

	        rejection.setDescription(jsonObject.getDescription());
	        rejection.setRejection(jsonObject.getRejection());
	        rejection.setProductionArticle(article);
	        rejection.setStatus(jsonObject.getStatus());

	        rejection.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

	        productionRejectionMasterRepository.save(rejection);

	        return new ResponseEntity<>("Data updated successfully.", HttpStatus.OK);

	    } catch (Exception e) {
	        e.printStackTrace();
	        return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}

	@DeleteMapping("/deleteProductionRejection/{id}")
	public ResponseEntity<Object> deleteProductionRejection(@PathVariable Long id) {
		try {
			this.productionRejectionMasterRepository.deleteById(id);
			return new ResponseEntity<Object>("Data deleted successfully", HttpStatus.OK);
		} catch (DataIntegrityViolationException e) {
			Optional<ProductionRejection> object = this.productionRejectionMasterRepository.findById(id);
			return new ResponseEntity<Object>(
					"Unable to delete Data due to mapping",
					HttpStatus.CONFLICT);
		} catch (Exception e) {
			return new ResponseEntity<Object>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}




	@GetMapping("/download/template/productionRejection")
	public void ProductionRejectionTemplate(HttpServletResponse response) throws IOException {
		response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		ServletOutputStream outputStream = response.getOutputStream();
		String[] headerList = new String[] { "Article","Description" ,"Rejection"};
		int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256 };
		ByteArrayInputStream excelFile = ExcelController.generateExcelTemplate(headerList, COLUMN_WIDTHS,
				"ProductionRejection Master");
		response.getOutputStream().write(excelFile.readAllBytes());
		outputStream.flush();
	}

//	@GetMapping("/download/data/productionRejection")
//	public void exportProductionRejectionData(HttpServletResponse response) throws IOException {
//		try {
//			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
//			List<ProductionRejection> list = this.productionRejectionMasterRepository.getalldata();
//			String[] headerList = new String[] { "Article","Description" ,"Rejection","Status", "Created By", "Date & Time" };
//			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
//					25 * 256, 30 * 256 };
//
//			List<Function<ProductionRejection, Object>> getters = Arrays.asList(article->article.getProductionArticle().getArticle(),
//					ProductionRejection::getDescription,ProductionRejection::getRejection,
//					ProductionRejection::getStatus, ProductionRejection::getCreatedBy, ProductionRejection::getDateTimeModified);
//
//			ByteArrayInputStream excelFile = ExcelController.generateExcelData(list, getters, headerList,
//					COLUMN_WIDTHS, "ProductionRejection");
//			ServletOutputStream outputStream = response.getOutputStream();
//			response.getOutputStream().write(excelFile.readAllBytes());
//			outputStream.flush();
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//	}
	
	@PostMapping("/download/data/productionRejection")
	public void exportToExcel(HttpServletResponse response, @RequestBody ProductionRejection jsonObject)
			throws IOException {
		try {
			// Set the content type to Excel file
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

			// Fetch data from the repository as a List<PlantMaster>
			List<ProductionRejection> listObject = this.productionRejectionMasterRepository
					.getAllProductionRejectionMaster(jsonObject.getProductionArticle().getArticle(),
							jsonObject.getRejection(),jsonObject.getDescription(),
							 jsonObject.getCreatedBy());

			String[] headerList = new String[] { "Article","Description" ,"Rejection","Status", "Created By", "Date & Time" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256 };

			List<Function<ProductionRejection, Object>> getters = Arrays.asList(article->article.getProductionArticle().getArticle(),
					ProductionRejection::getDescription,ProductionRejection::getRejection,
					ProductionRejection::getStatus, ProductionRejection::getCreatedBy, ProductionRejection::getDateTimeModified);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(listObject, getters, headerList,
					COLUMN_WIDTHS, "ProductionRejection");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();

		}
	}

	@PostMapping("/getLikeProductionRejection/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getLikeProductionRejection(@PathVariable("pageNum") int page,
			@PathVariable("pageSize") int pageSize, @RequestBody ProductionRejection jsonObject) {

		try {
			System.out.println("skd");
			System.out.println("skd"+jsonObject.getRejection());
			Pageable pageable = PageRequest.of(page, pageSize);
			Page<ProductionRejection> object = this.productionRejectionMasterRepository.getLikeProductionRejection(jsonObject.getProductionArticle().getArticle(),
					jsonObject.getRejection(),jsonObject.getDescription(),
					 jsonObject.getCreatedBy(), pageable);
			System.out.println("ok1"+object);
			return new ResponseEntity<Object>(object, HttpStatus.OK);

		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<Object>("ng", HttpStatus.OK);
		}
	}
	
	
	@PostMapping("/uploadProductionRejection/{employeeId}")
	public ResponseEntity<Object> uploadProductionRejection(@RequestParam("file") MultipartFile file,
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

	        XSSFSheet sheet = workbook.getSheet("ProductionRejection");

	        if (sheet == null) {
	            return new ResponseEntity<>("ProductionRejection sheet not found.", HttpStatus.NOT_FOUND);
	        }

	        Iterator<Row> rows = sheet.iterator();

	        if (rows.hasNext()) rows.next();

	        while (rows.hasNext()) {

	            Row currentRow = rows.next();

	            if (currentRow == null || currentRow.getLastCellNum() <= 0) {
	                continue;
	            }
	            ProductionRejection upload = new ProductionRejection();
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
	                    upload.setRejection(value);
	                break;
	                default:
	                    break;
	                }
	            }	            
	            if (upload.getProductionArticle() == null ) {
	                errorList.add("Article  missing , " + (currentRow.getRowNum() + 1));
	                continue;
	            }
	            if (upload.getRejection() == null || upload.getRejection().isEmpty()) {
	                errorList.add("rejection missing , " + (currentRow.getRowNum() + 1));
	                continue;
	            }
	        

	            upload.setCreatedBy(employeeId);
	            upload.setStatus("1");
	            upload.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
	            upload.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

	            productionRejectionMasterRepository.save(upload);
	        }

	        Map<String, Object> responseMap = new HashMap<>();
	        responseMap.put("message", "Excel uploaded successfully.");
	        responseMap.put("errorList", errorList);

	        return new ResponseEntity<>(responseMap, HttpStatus.OK);

	    } catch (Exception e) {
	    	
	    	System.out.println(e);

	        return new ResponseEntity<>("Upload failed : " + e.getMessage(),
	                HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	
	
}
