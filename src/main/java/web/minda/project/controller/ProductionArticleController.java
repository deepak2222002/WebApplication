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
import web.minda.project.entity.StoreMaterial;
import web.minda.project.entity.StoreMaterialCategoryMaster;
import web.minda.project.helper.ExcelUploadHelper;
import web.minda.project.repositories.ProductionArticleCategoryRepository;
import web.minda.project.repositories.ProductionArticleMasterRepository;

import web.minda.project.service.DateTimeService;

@RestController
@RequestMapping("/Controllers")
public class ProductionArticleController {
	@Autowired
	ProductionArticleMasterRepository productionArticleMasterRepository;
	ProductionArticleMaster masterObject = new ProductionArticleMaster();

	@Autowired
	ProductionArticleCategoryRepository productionArticleCategoryRepository;
	ProductionArticleCategoryMaster storeMaterialCategoryMaster = new ProductionArticleCategoryMaster();

	@Autowired
	private DateTimeService dateTimeService;

//	@PostMapping("/insertProductionArticleMaster")
//	public ResponseEntity<Object> insertProductionArticle(@RequestBody ProductionArticleMaster jsonObject) {
//
//		try {
//
//			// ✅ Fetch category from DB
//			Optional<ProductionArticleCategoryMaster> category = productionArticleCategoryRepository
//					.findByArticleCategory(jsonObject.getProductionArticleCategory().getArticleCategory());
//
//			if (category == null) {
//				return new ResponseEntity<>("Category does not exist.", HttpStatus.NOT_ACCEPTABLE);
//			}
//
//			// ✅ Set managed entity (VERY IMPORTANT)
//			jsonObject.setProductionArticleCategory(category.get());
//
//			boolean materialExists = productionArticleMasterRepository
//					.existsByArticleAndProductionArticleCategory_ArticleCategory(jsonObject.getArticle(),
//							category.get().getArticleCategory());
//
//			if (materialExists) {
//				return new ResponseEntity<>("Article already exists in this category.", HttpStatus.NOT_ACCEPTABLE);
//			}
//
//			jsonObject.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
//			jsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());
//
//			productionArticleMasterRepository.save(jsonObject);
//
//			return new ResponseEntity<>("Data added successfully.", HttpStatus.OK);
//
//		} catch (Exception e) {
//			e.printStackTrace();
//			return new ResponseEntity<>("Something went wrong.", HttpStatus.INTERNAL_SERVER_ERROR);
//		}
//	}
//
//	@PostMapping("/editProductionArticleMaster")
//	public ResponseEntity<Object> editProductionArticle(@RequestBody ProductionArticleMaster jsonObject) {
//
//		try {
//
//			if (jsonObject.getProductionArticleId() == null) {
//				return new ResponseEntity<>("Article ID missing.", HttpStatus.NOT_ACCEPTABLE);
//			}
//
//			// ✅ Fetch existing article (MANDATORY)
//			ProductionArticleMaster existingArticle = productionArticleMasterRepository
//					.findById(jsonObject.getProductionArticleId()).orElse(null);
//
//			if (existingArticle == null) {
//				return new ResponseEntity<>("Article not found.", HttpStatus.NOT_ACCEPTABLE);
//			}
//
//			// ✅ Fetch category using NAME (same as insert)
//			Optional<ProductionArticleCategoryMaster> category = productionArticleCategoryRepository
//					.findByArticleCategory(jsonObject.getProductionArticleCategory().getArticleCategory());
//
//			if (category == null) {
//				return new ResponseEntity<>("Category does not exist.", HttpStatus.NOT_ACCEPTABLE);
//			}
//
//			// ✅ Optional duplicate check (recommended)
//			boolean materialExists = productionArticleMasterRepository
//					.existsByArticleAndProductionArticleCategory_ArticleCategoryAndProductionArticleIdNot(
//							jsonObject.getArticle(), category.get().getArticleCategory(),
//							jsonObject.getProductionArticleId());
//
//			if (materialExists) {
//				return new ResponseEntity<>("Article already exists in this category.", HttpStatus.NOT_ACCEPTABLE);
//			}
//
//			// ✅ Update fields (IMPORTANT)
//			existingArticle.setArticle(jsonObject.getArticle());
//			existingArticle.setDescription(jsonObject.getDescription());
//			existingArticle.setCreatedBy(jsonObject.getCreatedBy());
//			existingArticle.setImage(jsonObject.getImage());
//			existingArticle.setStatus(jsonObject.getStatus());
//
//			// ✅ Set managed category
//			existingArticle.setProductionArticleCategory(category.get());
//
//			existingArticle.setDateTimeModified(dateTimeService.getCurrentDateAndTime());
//
//			// ✅ Save
//			productionArticleMasterRepository.save(existingArticle);
//
//			return new ResponseEntity<>("Data updated successfully.", HttpStatus.OK);
//
//		} catch (Exception e) {
//			e.printStackTrace();
//			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
//		}
//	}
	
	
	
	
	@PostMapping("/insertProductionArticleMaster")
	public ResponseEntity<Object> insertProductionArticle(@RequestBody ProductionArticleMaster jsonObject) {

	    try {

	        // ✅ Validation
	        if (jsonObject.getArticle() == null || jsonObject.getArticle().trim().isEmpty()) {
	            return new ResponseEntity<>("Article is required.", HttpStatus.NOT_ACCEPTABLE);
	        }

	        if (jsonObject.getStatus() == null || jsonObject.getStatus().trim().isEmpty()) {
	            return new ResponseEntity<>("Status is required.", HttpStatus.NOT_ACCEPTABLE);
	        }

	        // ✅ Duplicate check (based on article only OR article + status)
	        boolean exists = productionArticleMasterRepository
	                .existsByArticleAndStatus(jsonObject.getArticle(), jsonObject.getStatus());

	        if (exists) {
	            return new ResponseEntity<>("Article already exists with this status.", HttpStatus.NOT_ACCEPTABLE);
	        }

	        // ✅ Set timestamps
	        jsonObject.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
	        jsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

	        // ✅ Save
	        productionArticleMasterRepository.save(jsonObject);

	        return new ResponseEntity<>("Data added successfully.", HttpStatus.OK);

	    } catch (Exception e) {
	        e.printStackTrace();
	        return new ResponseEntity<>("Something went wrong.", HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	
	
	
	@PostMapping("/editProductionArticleMaster")
	public ResponseEntity<Object> editProductionArticle(@RequestBody ProductionArticleMaster jsonObject) {

	    try {

	        if (jsonObject.getProductionArticleId() == null) {
	            return new ResponseEntity<>("Article ID missing.", HttpStatus.NOT_ACCEPTABLE);
	        }

	        ProductionArticleMaster existingArticle = productionArticleMasterRepository
	                .findById(jsonObject.getProductionArticleId())
	                .orElse(null);

	        if (existingArticle == null) {
	            return new ResponseEntity<>("Article not found.", HttpStatus.NOT_ACCEPTABLE);
	        }

	        // ✅ Duplicate check
	        boolean exists = productionArticleMasterRepository
	                .existsByArticleAndStatusAndProductionArticleIdNot(
	                        jsonObject.getArticle(),
	                        jsonObject.getStatus(),
	                        jsonObject.getProductionArticleId()
	                );

	        if (exists) {
	            return new ResponseEntity<>("Article already exists with this status.", HttpStatus.NOT_ACCEPTABLE);
	        }

	        // ✅ Update fields
	        existingArticle.setArticle(jsonObject.getArticle());
	        existingArticle.setDescription(jsonObject.getDescription());
	        existingArticle.setNetWeight(jsonObject.getNetWeight());
	        existingArticle.setGrossWeight(jsonObject.getGrossWeight());
	        existingArticle.setCreatedBy(jsonObject.getCreatedBy());
	        existingArticle.setImage(jsonObject.getImage());
	        existingArticle.setStatus(jsonObject.getStatus());

	        existingArticle.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

	        productionArticleMasterRepository.save(existingArticle);

	        return new ResponseEntity<>("Data updated successfully.", HttpStatus.OK);

	    } catch (Exception e) {
	        e.printStackTrace();
	        return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}

	@DeleteMapping("/deleteProductionArticleMaster/{id}")
	public ResponseEntity<Object> deleteProductionArticleMaster(@PathVariable Long id) {
		try {
			this.productionArticleMasterRepository.deleteById(id);
			return new ResponseEntity<Object>("Data deleted successfully", HttpStatus.OK);
		} catch (DataIntegrityViolationException e) {
			return new ResponseEntity<Object>("Unable to delete Data due to mapping", HttpStatus.CONFLICT);
		} catch (Exception e) {
			return new ResponseEntity<Object>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/download/template/productionArticle")
	public void productionArticleTemplate(HttpServletResponse response) throws IOException {
		response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		ServletOutputStream outputStream = response.getOutputStream();
		String[] headerList = new String[] { "Article", "Description","Net Weight","Gross Weight","Status(PRODUCTION/DEVELOPMENT)" };
		int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256 };
		ByteArrayInputStream excelFile = ExcelController.generateExcelTemplate(headerList, COLUMN_WIDTHS,
				"ProductionArticle Master");
		response.getOutputStream().write(excelFile.readAllBytes());
		outputStream.flush();
	}

//	@GetMapping("/download/data/productionArticle")
//	public void exportproductionArticleData(HttpServletResponse response) throws IOException {
//		try {
//			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
//			List<ProductionArticleMaster> list = this.productionArticleMasterRepository.getalldata();
//			String[] headerList = new String[] { "Article", "Category", "Description", "Status", "Created By",
//					"Date & Time" };
//			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
//					25 * 256, 30 * 256 };
//
//			List<Function<ProductionArticleMaster, Object>> getters = Arrays.asList(ProductionArticleMaster::getArticle,
//					articlecategory -> articlecategory.getProductionArticleCategory().getArticleCategory(),
//					ProductionArticleMaster::getDescription, ProductionArticleMaster::getStatus,
//					ProductionArticleMaster::getCreatedBy, ProductionArticleMaster::getDateTimeModified);
//
//			ByteArrayInputStream excelFile = ExcelController.generateExcelData(list, getters, headerList, COLUMN_WIDTHS,
//					"ProductionArticle Master");
//			ServletOutputStream outputStream = response.getOutputStream();
//			response.getOutputStream().write(excelFile.readAllBytes());
//			outputStream.flush();
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//	}

	@PostMapping("/download/data/productionArticle")
	public void exportToExcel(HttpServletResponse response, @RequestBody ProductionArticleMaster jsonObject)
			throws IOException {
		try {
			// Set the content type to Excel file
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

			// Fetch data from the repository as a List<PlantMaster>
			List<ProductionArticleMaster> listObject = this.productionArticleMasterRepository
					.getAllProductionArticleMaster(jsonObject.getArticle(), jsonObject.getDescription(),
							jsonObject.getProductionArticleCategory().getArticleCategory(), jsonObject.getCreatedBy());

			String[] headerList = new String[] { "Article", "Description","Net Weight","Gross Weight","Status", "Created By",
					"Date & Time" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256 };

			List<Function<ProductionArticleMaster, Object>> getters = Arrays.asList(ProductionArticleMaster::getArticle,
					ProductionArticleMaster::getDescription,
					ProductionArticleMaster::getNetWeight,
					ProductionArticleMaster::getGrossWeight,
					ProductionArticleMaster::getStatus,
					ProductionArticleMaster::getCreatedBy, 
					ProductionArticleMaster::getDateTimeModified);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(listObject, getters, headerList, COLUMN_WIDTHS,
					"ProductionArticle Master");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();

		}
	}

	@PostMapping("/getLikesproductionArticle/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getLikesproductionArticle(@PathVariable("pageNum") int page,
			@PathVariable("pageSize") int pageSize, @RequestBody ProductionArticleMaster jsonObject) {

		try {
			System.out.println(jsonObject);
			Pageable pageable = PageRequest.of(page, pageSize);
			Page<ProductionArticleMaster> object = this.productionArticleMasterRepository.getLikeProductionArticle(
					jsonObject.getArticle(), jsonObject.getDescription(),
					jsonObject.getProductionArticleCategory().getArticleCategory(), jsonObject.getCreatedBy(),
					pageable);
			System.out.println(object);
			return new ResponseEntity<Object>(object, HttpStatus.OK);

		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<Object>("ng", HttpStatus.OK);
		}
	}
	
	
	
	@PostMapping("/uploadproductionarticle/{employeeId}")
	public ResponseEntity<Object> uploadproductionarticle(
	        @RequestParam("file") MultipartFile file,
	        @PathVariable("employeeId") String employeeId) {

	    if (!"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet".equals(file.getContentType())) {
	        return new ResponseEntity<>("Please upload XLSX file.", HttpStatus.BAD_REQUEST);
	    }

	    List<String> errorList = new ArrayList<>();
	    errorList.add("Errors , Row");

	    try (InputStream is = file.getInputStream();
	         OPCPackage opcPackage = OPCPackage.open(is);
	         XSSFWorkbook workbook = new XSSFWorkbook(opcPackage)) {

	        XSSFSheet sheet = workbook.getSheet("ProductionArticle Master");

	        if (sheet == null) {
	            return new ResponseEntity<>("ProductionArticle Master sheet not found.", HttpStatus.NOT_FOUND);
	        }

	        Iterator<Row> rows = sheet.iterator();

	        if (rows.hasNext()) rows.next(); // skip header

	        while (rows.hasNext()) {

	            Row currentRow = rows.next();

	            if (currentRow == null || currentRow.getLastCellNum() <= 0) continue;

	            ProductionArticleMaster upload = new ProductionArticleMaster();

	            for (int cellIdx = 0; cellIdx < currentRow.getLastCellNum(); cellIdx++) {

	                Cell currentCell = currentRow.getCell(cellIdx);
	                String value = ExcelUploadHelper.getStringCellValue(currentCell).trim();

	                switch (cellIdx) {

	                    case 0: // Article
	                        upload.setArticle(value);
	                        break;

	             

	                    case 1: // Description
	                        upload.setDescription(value);
	                        break;
	                    
	                    case 2: // Description
	                    	if (value != null && !value.isEmpty()) {
	                            try {
	                                Double.parseDouble(value);
	                                upload.setNetWeight(value);
	                            } catch (NumberFormatException e) {
	                                errorList.add("Invalid Net Weight (Must be numeric) , Row " + (currentRow.getRowNum() + 1));
	                            }
	                        }
	                        break;
	                    
	                     case 3: // Description
	                    	 if (value != null && !value.isEmpty()) {
	                    	        try {
	                    	            Double.parseDouble(value);
	                    	            upload.setGrossWeight(value);
	                    	        } catch (NumberFormatException e) {
	                    	            errorList.add("Invalid Gross Weight (Must be numeric) , Row " + (currentRow.getRowNum() + 1));
	                    	        }
	                    	    }
	                        break;    
	                        
	                    case 4: // Status
	                        if (value.equalsIgnoreCase("PRODUCTION") || value.equalsIgnoreCase("DEVELOPMENT")) {
	                            upload.setStatus(value.toUpperCase());
	                        } else {
	                            errorList.add("Invalid Status (Use PRODUCTION/DEVELOPMENT) , Row " + (currentRow.getRowNum() + 1));
	                        }
	                        break;

	                    default:
	                        break;
	                }
	            }

	            // ✅ Validations
	            if (upload.getArticle() == null || upload.getArticle().isEmpty()) {
	                errorList.add("Article missing , Row " + (currentRow.getRowNum() + 1));
	                continue;
	            }

	            if (upload.getStatus() == null || upload.getStatus().isEmpty()) {
	                errorList.add("Status missing , Row " + (currentRow.getRowNum() + 1));
	                continue;
	            }

	            // ✅ Duplicate check
	            boolean exists = productionArticleMasterRepository
	                    .existsByArticleAndStatus(upload.getArticle(), upload.getStatus());

	            if (exists) {
	                errorList.add("Article already exists with same status , Row " + (currentRow.getRowNum() + 1));
	                continue;
	            }

	            // ✅ Save
	            upload.setCreatedBy(employeeId);
	            upload.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
	            upload.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

	            productionArticleMasterRepository.save(upload);
	        }

	        Map<String, Object> responseMap = new HashMap<>();
	        responseMap.put("message", "Excel uploaded successfully.");
	        responseMap.put("errorList", errorList);

	        return new ResponseEntity<>(responseMap, HttpStatus.OK);

	    } catch (Exception e) {
	        return new ResponseEntity<>("Upload failed : " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}

//	@PostMapping("/uploadproductionarticle/{employeeId}")
//	public ResponseEntity<Object> uploadproductionarticle(@RequestParam("file") MultipartFile file,
//			@PathVariable("employeeId") String employeeId) {
//
//		if (!"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet".equals(file.getContentType())) {
//			return new ResponseEntity<>("Please upload XLSX file.", HttpStatus.BAD_REQUEST);
//		}
//
//		List<String> errorList = new ArrayList<>();
//		errorList.add("Errors , Row");
//
//		try (InputStream is = file.getInputStream();
//				OPCPackage opcPackage = OPCPackage.open(is);
//				XSSFWorkbook workbook = new XSSFWorkbook(opcPackage)) {
//
//			XSSFSheet sheet = workbook.getSheet("ProductionArticle Master");
//
//			if (sheet == null) {
//				return new ResponseEntity<>("ProductionArticle Master sheet not found.", HttpStatus.NOT_FOUND);
//			}
//
//			Iterator<Row> rows = sheet.iterator();
//
//			if (rows.hasNext())
//				rows.next();
//
//			while (rows.hasNext()) {
//
//				Row currentRow = rows.next();
//
//				if (currentRow == null || currentRow.getLastCellNum() <= 0) {
//					continue;
//				}
//				ProductionArticleMaster upload = new ProductionArticleMaster();
//				for (int cellIdx = 0; cellIdx < currentRow.getLastCellNum(); cellIdx++) {
//
//					Cell currentCell = currentRow.getCell(cellIdx);
//					String value = ExcelUploadHelper.getStringCellValue(currentCell).trim();
//
//					switch (cellIdx) {
//					case 0:
//						upload.setArticle(value);
//						break;
//					case 1:
//						Optional<ProductionArticleCategoryMaster> categoryOptional = productionArticleCategoryRepository
//								.findByArticleCategory(value);
//						System.out.println(value);
//						if (categoryOptional.isPresent()) {
//							upload.setProductionArticleCategory(categoryOptional.get());
//						} else {
//							errorList.add("Category not found , " + (currentRow.getRowNum() + 1));
//							System.out.println("not found");
//						}
//						break;
//					case 2:
//						upload.setDescription(value);
//						break;
//					default:
//						break;
//					}
//				}
//				if (upload.getArticle() == null || upload.getArticle().isEmpty()) {
//					errorList.add("Article  missing , " + (currentRow.getRowNum() + 1));
//					continue;
//				}
//				if (upload.getProductionArticleCategory() == null) {
//					errorList.add("Category missing , " + (currentRow.getRowNum() + 1));
//					continue;
//				}
//				boolean exists = productionArticleMasterRepository
//						.existsByArticleAndProductionArticleCategory_ArticleCategory(upload.getArticle(),
//								upload.getProductionArticleCategory().getArticleCategory());
//				if (exists) {
//					errorList.add("Mapping already exists , " + (currentRow.getRowNum() + 1));
//					continue;
//				}
//
//				upload.setCreatedBy(employeeId);
//				upload.setStatus("1");
//				upload.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
//				upload.setDateTimeModified(dateTimeService.getCurrentDateAndTime());
//
//				productionArticleMasterRepository.save(upload);
//			}
//
//			Map<String, Object> responseMap = new HashMap<>();
//			responseMap.put("message", "Excel uploaded successfully.");
//			responseMap.put("errorList", errorList);
//
//			return new ResponseEntity<>(responseMap, HttpStatus.OK);
//
//		} catch (Exception e) {
//
//			return new ResponseEntity<>("Upload failed : " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
//		}
//	}

}
