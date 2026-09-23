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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import web.minda.project.dto.ChildPartRowDTO;
import web.minda.project.dto.ChildPartSaveDTO;
import web.minda.project.entity.ProductionArticleBom;
import web.minda.project.entity.ProductionArticleMaster;
import web.minda.project.entity.ProductionOperation;
import web.minda.project.helper.ExcelUploadHelper;
import web.minda.project.repositories.ProductionArticleBomRepository;
import web.minda.project.repositories.ProductionArticleMasterRepository;
import web.minda.project.service.DateTimeService;

@RestController
@RequestMapping("/Controllers")
public class ProductionArticleBomController {
	@Autowired
	ProductionArticleBomRepository productionArticleBomRepository;
	ProductionArticleBom masterObject = new ProductionArticleBom();

	@Autowired
	ProductionArticleMasterRepository productionArticleMasterRepository;
	ProductionArticleMaster productionArticleMaster = new ProductionArticleMaster();

	@Autowired
	private DateTimeService dateTimeService;


	
	@PostMapping("/insertProductionArticleBom")
	public ResponseEntity<Object> insertProductionArticleBom(@RequestBody ProductionArticleBom jsonObject) {

	    try {

	        Optional<ProductionArticleMaster> articleOpt =
	                productionArticleMasterRepository
	                .findByArticle(jsonObject.getProductionArticle().getArticle());

	        if (articleOpt.isEmpty()) {
	            return new ResponseEntity<>("Article does not exist.", HttpStatus.NOT_ACCEPTABLE);
	        }

	        ProductionArticleMaster article = articleOpt.get();

	        // ✅ DUPLICATE CHECK
	        boolean exists = productionArticleBomRepository
	                .existsByChildPartAndProductionArticle_Article(
	                        jsonObject.getChildPart(),
	                        article.getArticle()
	                );

	        if (exists) {
	            return new ResponseEntity<>("Data already exists.", HttpStatus.NOT_ACCEPTABLE);
	        }
	        
	        System.out.println("exists: "+exists);

	        jsonObject.setProductionArticle(article);
	        jsonObject.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
	        jsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

	        productionArticleBomRepository.save(jsonObject);

	        return new ResponseEntity<>("Data added successfully.", HttpStatus.OK);

	    } catch (Exception e) {
	        e.printStackTrace();
	        return new ResponseEntity<>("Something went wrong.", HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	
	@PostMapping("/editProductionArticleBom")
	public ResponseEntity<Object> editProductionArticleBom(@RequestBody ProductionArticleBom jsonObject) {

	    try {

	        if (jsonObject.getProductionArticleBomId() == null) {
	            return new ResponseEntity<>("ChildPart ID missing.", HttpStatus.NOT_ACCEPTABLE);
	        }

	        Optional<ProductionArticleBom> bomOpt =
	                productionArticleBomRepository.findById(jsonObject.getProductionArticleBomId());

	        if (bomOpt.isEmpty()) {
	            return new ResponseEntity<>("BOM record not found.", HttpStatus.NOT_ACCEPTABLE);
	        }

	        Optional<ProductionArticleMaster> articleOpt =
	                productionArticleMasterRepository.findByArticle(
	                        jsonObject.getProductionArticle().getArticle());

	        if (articleOpt.isEmpty()) {
	            return new ResponseEntity<>("Article not found.", HttpStatus.NOT_ACCEPTABLE);
	        }

	        ProductionArticleBom bom = bomOpt.get();
	        ProductionArticleMaster article = articleOpt.get();

	        // ✅ DUPLICATE CHECK (exclude current ID)
	        boolean exists = productionArticleBomRepository
	                .existsByChildPartAndProductionArticle_ArticleAndProductionArticleBomIdNot(
	                        jsonObject.getChildPart(),
	                        article.getArticle(),
	                        jsonObject.getProductionArticleBomId()
	                );

	        if (exists) {
	            return new ResponseEntity<>("Data already exists.", HttpStatus.NOT_ACCEPTABLE);
	        }

	        bom.setDescription(jsonObject.getDescription());
	        bom.setChildPart(jsonObject.getChildPart());
	        bom.setProductionArticle(article);
	        bom.setStatus(jsonObject.getStatus());

	        bom.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

	        productionArticleBomRepository.save(bom);

	        return new ResponseEntity<>("Data updated successfully.", HttpStatus.OK);

	    } catch (Exception e) {
	        e.printStackTrace();
	        return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}

	@DeleteMapping("/deleteProductionArticleBom/{id}")
	public ResponseEntity<Object> deleteproductionArticleBom(@PathVariable Long id) {
		try {
			this.productionArticleBomRepository.deleteById(id);
			return new ResponseEntity<Object>("Data deleted successfully", HttpStatus.OK);
		} catch (DataIntegrityViolationException e) {
			Optional<ProductionArticleBom> object = this.productionArticleBomRepository.findById(id);
			return new ResponseEntity<Object>("Unable to delete Data due to mapping " + object, HttpStatus.CONFLICT);
		} catch (Exception e) {
			return new ResponseEntity<Object>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/download/template/productionArticleBom")
	public void productionArticleBomTemplate(HttpServletResponse response) throws IOException {
		response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		ServletOutputStream outputStream = response.getOutputStream();
		String[] headerList = new String[] { "Article", "Description", "Child Part","Issuence Category(Production/Mixingmill/Article)" };
		int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256 };
		ByteArrayInputStream excelFile = ExcelController.generateExcelTemplate(headerList, COLUMN_WIDTHS,
				"ProductionArticleBom");
		response.getOutputStream().write(excelFile.readAllBytes());
		outputStream.flush();
	}



	@PostMapping("/download/data/productionArticleBom")
	public void exportToExcel(HttpServletResponse response, @RequestBody ProductionArticleBom jsonObject)
			throws IOException {
		try {
			// Set the content type to Excel file
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

			// Fetch data from the repository as a List<PlantMaster>
			List<ProductionArticleBom> listObject = this.productionArticleBomRepository
					.getAllProductionArticleBomMaster(jsonObject.getProductionArticle().getArticle(),
							jsonObject.getChildPart(), jsonObject.getDescription(), jsonObject.getCreatedBy());

			String[] headerList = new String[] { "Article", "Description", "Child Part", "Status", "Created By",
					"Date & Time" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256 };

			List<Function<ProductionArticleBom, Object>> getters = Arrays.asList(
					article -> article.getProductionArticle().getArticle(), ProductionArticleBom::getChildPart,
					ProductionArticleBom::getStatus, ProductionArticleBom::getCreatedBy,
					ProductionArticleBom::getDateTimeModified);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(listObject, getters, headerList, COLUMN_WIDTHS,
					"ProductionArticleBom Master");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();

		}
	}

	@PostMapping("/getLikeProductionArticleBom/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getLikeProductionArticleBom(@PathVariable("pageNum") int page,
			@PathVariable("pageSize") int pageSize, @RequestBody ProductionArticleBom jsonObject) {

		try {
			System.out.println(jsonObject);
			Pageable pageable = PageRequest.of(page, pageSize);
			Page<ProductionArticleBom> object = this.productionArticleBomRepository.getLikeProductionArticleBom(
					jsonObject.getProductionArticle().getArticle(), jsonObject.getChildPart(),
					jsonObject.getDescription(), jsonObject.getCreatedBy(), pageable);
			System.out.println(object);
			return new ResponseEntity<Object>(object, HttpStatus.OK);

		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<Object>("ng", HttpStatus.OK);
		}
	}

	@PostMapping("/uploadproductionarticlebom/{employeeId}")
	public ResponseEntity<Object> uploadproductionarticlebom(@RequestParam("file") MultipartFile file,
			@PathVariable("employeeId") String employeeId) {

		if (!"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet".equals(file.getContentType())) {
			return new ResponseEntity<>("Please upload XLSX file.", HttpStatus.BAD_REQUEST);
		}

		List<String> errorList = new ArrayList<>();
		errorList.add("Errors , Row");

		try (InputStream is = file.getInputStream();
				OPCPackage opcPackage = OPCPackage.open(is);
				XSSFWorkbook workbook = new XSSFWorkbook(opcPackage)) {

			XSSFSheet sheet = workbook.getSheet("ProductionArticleBom");

			if (sheet == null) {
				return new ResponseEntity<>("ProductionArticleBom sheet not found.", HttpStatus.NOT_FOUND);
			}

			Iterator<Row> rows = sheet.iterator();

			if (rows.hasNext())
				rows.next();

			while (rows.hasNext()) {

				Row currentRow = rows.next();

				if (currentRow == null || currentRow.getLastCellNum() <= 0) {
					continue;
				}
				ProductionArticleBom upload = new ProductionArticleBom();
				for (int cellIdx = 0; cellIdx < currentRow.getLastCellNum(); cellIdx++) {

					Cell currentCell = currentRow.getCell(cellIdx);
					String value = ExcelUploadHelper.getStringCellValue(currentCell).trim();

					switch (cellIdx) {
					case 0:
						Optional<ProductionArticleMaster> articleOptional = productionArticleMasterRepository
								.findByArticle(value);
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
						upload.setChildPart(value);
						break;
					
					case 3:
						upload.setIssuenceCategory(value);
						break;
					default:
						break;
					}
				}
				if (upload.getProductionArticle() == null) {
					errorList.add("Article  missing , " + (currentRow.getRowNum() + 1));
					continue;
				}
				if (upload.getChildPart() == null || upload.getChildPart().isEmpty()) {
					errorList.add("ChildPart missing , " + (currentRow.getRowNum() + 1));
					continue;
				}
				boolean exists = productionArticleBomRepository.existsByProductionArticle_ArticleAndChildPart(
						upload.getProductionArticle().getArticle(), upload.getChildPart());
				if (exists) {
					errorList.add("Mapping already exists , " + (currentRow.getRowNum() + 1));
					continue;
				}

				upload.setCreatedBy(employeeId);
				upload.setStatus("1");
				upload.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
				upload.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

				productionArticleBomRepository.save(upload);
			}

			Map<String, Object> responseMap = new HashMap<>();
			responseMap.put("message", "Excel uploaded successfully.");
			responseMap.put("errorList", errorList);

			return new ResponseEntity<>(responseMap, HttpStatus.OK);

		} catch (Exception e) {

			return new ResponseEntity<>("Upload failed : " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	
	
	@GetMapping("/getAllMaterialsInList")
	public ResponseEntity<List<Map<String, String>>> getAllMaterialsInList() {

	    List<Object[]> results = productionArticleBomRepository.findAllMaterialWithDescription();

	    List<Map<String, String>> list = new ArrayList<>();

	    for (Object[] row : results) {
	        Map<String, String> map = new HashMap<>();
	        map.put("material", (String) row[0]);
	        map.put("description", (String) row[1]);
	        list.add(map);
	    }

	    return ResponseEntity.ok(list);
	}
	
	
	@PutMapping("/updateProductionArticleBomStatus/{id}/{status}")
	public ResponseEntity<?> updateStatus(
	        @PathVariable Long id,
	        @PathVariable String status) {

	    Optional<ProductionArticleBom> bomOpt = productionArticleBomRepository.findById(id);

	    if (bomOpt.isEmpty()) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found");
	    }

	    ProductionArticleBom bom = bomOpt.get();
	    bom.setStatus(status);

	    bom.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

	    productionArticleBomRepository.save(bom);

	    return ResponseEntity.ok("Status updated");
	}
	
//	
//	@PutMapping("/updateProductionArticleBomBatchCutting/{id}/{status}")
//	public ResponseEntity<?> updateBatchCutting(
//	        @PathVariable Long id,
//	        @PathVariable String status) {
//
//	    Optional<ProductionArticleBom> bomOpt = productionArticleBomRepository.findById(id);
//
//	    if (bomOpt.isEmpty()) {
//	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found");
//	    }
//
//	    ProductionArticleBom bom = bomOpt.get();
//	    bom.setBatchCutting(status);
//	    bom.setDateTimeModified(dateTimeService.getCurrentDateAndTime());
//
//	    productionArticleBomRepository.save(bom);
//
//	    return ResponseEntity.ok("Batch Cutting updated");
//	}
	
//	
//	@PutMapping("/updateProductionArticleBomRmsWeight/{id}/{status}")
//	public ResponseEntity<?> updateRMSWeight(
//	        @PathVariable Long id,
//	        @PathVariable String status) {
//
//	    Optional<ProductionArticleBom> bomOpt = productionArticleBomRepository.findById(id);
//
//	    if (bomOpt.isEmpty()) {
//	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found");
//	    }
//
//	    ProductionArticleBom bom = bomOpt.get();
//	    bom.setRmsWeight(status);
//	    bom.setDateTimeModified(dateTimeService.getCurrentDateAndTime());
//
//	    productionArticleBomRepository.save(bom);
//
//	    return ResponseEntity.ok("RMS Weight updated");
//	}
	
	
	@PostMapping("/saveArticleChildParts")
	public ResponseEntity<?> saveArticleChildParts(@RequestBody ChildPartSaveDTO dto) {

	    ProductionArticleMaster article =
	    		productionArticleMasterRepository.findById(dto.getArticleId())
	            .orElseThrow(() -> new RuntimeException("Article not found"));

	    for (ChildPartRowDTO row : dto.getChildParts()) {

	        ProductionArticleBom bom = new ProductionArticleBom();
	        bom.setProductionArticle(article);
	        bom.setChildPart(row.getChildPart());
	        bom.setDescription(row.getDescription());
	        bom.setIssuenceCategory(row.getIssuenceCategory());

	        bom.setStatus("1");

	        productionArticleBomRepository.save(bom);
	    }

	    return ResponseEntity.ok("Child Parts Saved Successfully");
	}

	
	@PutMapping("/updateChildPart")
	public ResponseEntity<?> updateChildPart(@RequestBody ProductionArticleBom obj) {

	    ProductionArticleBom old =
	            productionArticleBomRepository.findById(obj.getProductionArticleBomId())
	            .orElseThrow(() -> new RuntimeException("Child Part not found"));

	    old.setChildPart(obj.getChildPart());
	    old.setDescription(obj.getDescription());
	    old.setIssuenceCategory(obj.getIssuenceCategory());
	    old.setStatus(obj.getStatus());

	    old.setDateTimeModified(java.time.LocalDateTime.now().toString());

	    productionArticleBomRepository.save(old);

	    return ResponseEntity.ok("Child Part Updated Successfully");
	}
	@DeleteMapping("/deleteChildPart/{id}")
	public ResponseEntity<?> deleteChildPart(@PathVariable Long id) {

	    productionArticleBomRepository.deleteById(id);

	    return ResponseEntity.ok("Child Part Deleted Successfully");
	}
	
	@GetMapping("/getChildPartByArticle/{articleId}")
	public ResponseEntity<?> getChildPartByArticle(@PathVariable Long articleId) {

	    List<ProductionArticleBom> list =
	            productionArticleBomRepository.findByProductionArticleProductionArticleId(articleId);

	    return ResponseEntity.ok(list);
	}
}
