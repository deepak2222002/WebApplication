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
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
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
import web.minda.project.entity.ProductionArticleMouldMaster;
import web.minda.project.entity.ProductionMouldMaster;
import web.minda.project.helper.ExcelUploadHelper;
import web.minda.project.repositories.ProductionArticleMasterRepository;
import web.minda.project.repositories.ProductionArticleMouldRepository;
import web.minda.project.repositories.ProductionMouldRepository;
import web.minda.project.service.DateTimeService;

@RestController
@RequestMapping("/Controllers")
public class ProductionArticleMouldController {

	
	@Autowired
	private ProductionArticleMasterRepository productionArticleRepository;

	@Autowired
	private ProductionMouldRepository productionMouldRepository;
	
	@Autowired
	private ProductionArticleMouldRepository productionArticleMouldRepository;
	
	
	@Autowired
	private DateTimeService dateTimeService;
	
	@PostMapping("/insertProductionArticleMouldMaster")
	public ResponseEntity<Object> insert(@RequestBody ProductionArticleMouldMaster obj) {
	    try {

	        // 🔥 Fetch Article
	        ProductionArticleMaster article =
	                productionArticleRepository.findById(
	                        obj.getProductionArticle().getProductionArticleId()
	                ).orElseThrow(() -> new RuntimeException("Article not found"));

	        // 🔥 Fetch Mould
	        ProductionMouldMaster mould =
	                productionMouldRepository.findById(
	                        obj.getProductionMouldMaster().getProductionMouldId()
	                ).orElseThrow(() -> new RuntimeException("Mould not found"));

	        // 🔥 Set managed entities
	        obj.setProductionArticle(article);
	        obj.setProductionMouldMaster(mould);

	        obj.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
	        obj.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

	        productionArticleMouldRepository.save(obj);

	        return new ResponseEntity<>("Data added successfully", HttpStatus.OK);

	    } catch (Exception e) {
	        e.printStackTrace();
	        return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	
	
	
	@PostMapping("/editProductionArticleMouldMaster")
	public ResponseEntity<Object> edit(@RequestBody ProductionArticleMouldMaster obj) {

	    try {
	        Optional<ProductionArticleMouldMaster> existingOpt =
	                productionArticleMouldRepository.findById(obj.getProductionArticleMouldId());

	        if (existingOpt.isEmpty()) {
	            return new ResponseEntity<>("Record not found", HttpStatus.NOT_ACCEPTABLE);
	        }

	        ProductionArticleMouldMaster existing = existingOpt.get();

	        // 🔥 Fetch Article
	        ProductionArticleMaster article =
	                productionArticleRepository.findById(
	                        obj.getProductionArticle().getProductionArticleId()
	                ).orElseThrow(() -> new RuntimeException("Article not found"));

	        // 🔥 Fetch Mould
	        ProductionMouldMaster mould =
	                productionMouldRepository.findById(
	                        obj.getProductionMouldMaster().getProductionMouldId()
	                ).orElseThrow(() -> new RuntimeException("Mould not found"));

	        // 🔥 Set managed entities
	        existing.setProductionArticle(article);
	        existing.setProductionMouldMaster(mould);

	        existing.setShotsPerDay(obj.getShotsPerDay());
	        existing.setStatus(obj.getStatus());

	        existing.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

	        productionArticleMouldRepository.save(existing);

	        return new ResponseEntity<>("Updated successfully", HttpStatus.OK);

	    } catch (Exception e) {
	        e.printStackTrace();
	        return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	
	@DeleteMapping("/deleteProductionArticleMouldMaster/{id}")
	public ResponseEntity<Object> delete(@PathVariable Long id) {
	    try {
	        productionArticleMouldRepository.deleteById(id);
	        return new ResponseEntity<>("Data deleted successfully", HttpStatus.OK);

	    } catch (DataIntegrityViolationException e) {
	        return new ResponseEntity<>(
	                "Unable to delete due to mapping (FK constraint)",
	                HttpStatus.CONFLICT);

	    } catch (Exception e) {
	        return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	
	@GetMapping("/download/template/productionArticleMould")
	public void template(HttpServletResponse response) throws IOException {

	    response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

	    String[] headerList = new String[]{
	            "Article",
	            "Mould",
	            "Shots Per Day",
	            "Status"
	    };

	    int[] COLUMN_WIDTHS = {
	            40 * 256, 40 * 256, 25 * 256, 20 * 256
	    };

	    ByteArrayInputStream excelFile =
	            ExcelController.generateExcelTemplate(headerList, COLUMN_WIDTHS, "Article Mould Master");

	    ServletOutputStream outputStream = response.getOutputStream();
	    outputStream.write(excelFile.readAllBytes());
	    outputStream.flush();
	}
	
	
	@PostMapping("/download/data/productionArticleMould")
	public void exportToExcel(HttpServletResponse response,
	                         @RequestBody ProductionArticleMouldMaster jsonObject) throws IOException {

	    response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

	    List<ProductionArticleMouldMaster> list =
	            productionArticleMouldRepository.getAllData(
	                    jsonObject.getProductionArticle() != null
	                            ? jsonObject.getProductionArticle().getProductionArticleId()
	                            : null,
	                    jsonObject.getProductionMouldMaster() != null
	                            ? jsonObject.getProductionMouldMaster().getProductionMouldId()
	                            : null,
	                    jsonObject.getStatus()
	            );

	    String[] headers = {
	            "Article",
	            "Mould",
	            "Shots Per Day",
	            "Status",
	            "Created By",
	            "Date Time"
	    };

	    int[] widths = {40 * 256, 40 * 256, 25 * 256, 20 * 256, 25 * 256, 30 * 256};

	    List<Function<ProductionArticleMouldMaster, Object>> getters = Arrays.asList(
	            obj -> obj.getProductionArticle().getArticle(),
	            obj -> obj.getProductionMouldMaster().getMould(),
	            ProductionArticleMouldMaster::getShotsPerDay,
	            ProductionArticleMouldMaster::getStatus,
	            ProductionArticleMouldMaster::getCreatedBy,
	            ProductionArticleMouldMaster::getDateTimeModified
	    );

	    ByteArrayInputStream excelFile =
	            ExcelController.generateExcelData(list, getters, headers, widths, "Article Mould Master");

	    ServletOutputStream outputStream = response.getOutputStream();
	    outputStream.write(excelFile.readAllBytes());
	    outputStream.flush();
	}
	
	
	@PostMapping("/getLikeProductionArticleMould/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getLike(
	        @PathVariable int pageNum,
	        @PathVariable int pageSize,
	        @RequestBody ProductionArticleMouldMaster jsonObject) {

	    try {
	        Pageable pageable = PageRequest.of(pageNum, pageSize);

	        Page<ProductionArticleMouldMaster> data =
	                productionArticleMouldRepository.search(
	                        jsonObject.getProductionArticle() != null
	                                ? jsonObject.getProductionArticle().getArticle()
	                                : null,
	                        jsonObject.getProductionMouldMaster() != null
	                                ? jsonObject.getProductionMouldMaster().getMould()
	                                : null,
	                        jsonObject.getStatus(),
	                        pageable
	                );

	        return new ResponseEntity<>(data, HttpStatus.OK);

	    } catch (Exception e) {
	        e.printStackTrace();
	        return new ResponseEntity<>("Error", HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	
	
	@PostMapping("/uploadProductionArticleMould/{employeeId}")
	public ResponseEntity<Object> uploadProductionArticleMould(
	        @RequestParam("file") MultipartFile file,
	        @PathVariable String employeeId) {

	    // ✅ File validation
	    if (!"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
	            .equals(file.getContentType())) {
	        return new ResponseEntity<>("Please upload XLSX file.", HttpStatus.BAD_REQUEST);
	    }

	    List<String> errorList = new ArrayList<>();
	    errorList.add("Errors , Row");

	    int successCount = 0;
	    int failCount = 0;

	    try (InputStream is = file.getInputStream();
	         OPCPackage opcPackage = OPCPackage.open(is);
	         XSSFWorkbook workbook = new XSSFWorkbook(opcPackage)) {

	        XSSFSheet sheet = workbook.getSheet("Article Mould Master");

	        // ✅ Sheet validation
	        if (sheet == null) {
	            return new ResponseEntity<>("Article Mould Master sheet not found.", HttpStatus.NOT_FOUND);
	        }

	        Iterator<Row> rows = sheet.iterator();

	        if (rows.hasNext()) rows.next(); // skip header

	        while (rows.hasNext()) {

	            Row row = rows.next();

	            if (row == null || row.getLastCellNum() <= 0) continue;

	            String articleName = ExcelUploadHelper.getStringCellValue(row.getCell(0)).trim();
	            String mouldName = ExcelUploadHelper.getStringCellValue(row.getCell(1)).trim();
	            String shots = ExcelUploadHelper.getStringCellValue(row.getCell(2)).trim();
	            String status = ExcelUploadHelper.getStringCellValue(row.getCell(3)).trim();

	            int rowNum = row.getRowNum() + 1;

	            // 🔍 Debug print
	            System.out.println("Row " + rowNum + " => "
	                    + "Article: [" + articleName + "]"
	                    + ", Mould: [" + mouldName + "]"
	                    + ", Shots: [" + shots + "]"
	                    + ", Status: [" + status + "]");

	            try {

	                // ✅ Required validation
	                if (articleName.isEmpty()) {
	                    errorList.add("Article missing , Row " + rowNum);
	                    failCount++;
	                    continue;
	                }

	                if (mouldName.isEmpty()) {
	                    errorList.add("Mould missing , Row " + rowNum);
	                    failCount++;
	                    continue;
	                }

	                // ✅ Fetch Article (Ignore case + trim)
	                Optional<ProductionArticleMaster> articleOpt =
	                        productionArticleRepository.findByArticleIgnoreCase(articleName.trim());

	                if (!articleOpt.isPresent()) {
	                    System.out.println("❌ Article NOT FOUND: " + articleName);
	                    errorList.add("Invalid Article , Row " + rowNum);
	                    failCount++;
	                    continue;
	                }

	                // ✅ Fetch Mould
	                ProductionMouldMaster mould =
	                        productionMouldRepository.findByMouldIgnoreCase(mouldName.trim());

	                if (mould == null) {
	                    System.out.println("❌ Mould NOT FOUND: " + mouldName);
	                    errorList.add("Invalid Mould , Row " + rowNum);
	                    failCount++;
	                    continue;
	                }

	                // ✅ Duplicate check
	                boolean exists = productionArticleMouldRepository
	                        .existsByProductionArticleAndProductionMouldMaster(
	                                articleOpt.get(), mould
	                        );

	                if (exists) {
	                    System.out.println("⚠️ Duplicate: " + articleName + " - " + mouldName);
	                    errorList.add("Duplicate entry , Row " + rowNum);
	                    failCount++;
	                    continue;
	                }

	                // ✅ Status conversion
	                String finalStatus;
	                if (status.equals("1")) {
	                    finalStatus = "ACTIVE";
	                } else if (status.equals("0")) {
	                    finalStatus = "INACTIVE";
	                } else {
	                    finalStatus = status.toUpperCase();
	                }

	                // ✅ Save
	                ProductionArticleMouldMaster obj = new ProductionArticleMouldMaster();
	                obj.setProductionArticle(articleOpt.get());
	                obj.setProductionMouldMaster(mould);
	                obj.setShotsPerDay(shots);
	                obj.setStatus(finalStatus);
	                obj.setCreatedBy(employeeId);
	                obj.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
	                obj.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

	                ProductionArticleMouldMaster saved = productionArticleMouldRepository.save(obj);

	                System.out.println("✅ SAVED ID: " + saved.getProductionArticleMouldId());

	                successCount++;

	            } catch (Exception innerEx) {
	                System.out.println("❌ ERROR Row " + rowNum + ": " + innerEx.getMessage());
	                errorList.add("Error processing row , Row " + rowNum);
	                failCount++;
	            }
	        }

	        // ✅ Final response
	        Map<String, Object> res = new HashMap<>();
	        res.put("message", "Excel upload completed");
	        res.put("successCount", successCount);
	        res.put("failCount", failCount);
	        res.put("errorList", errorList);

	        return new ResponseEntity<>(res, HttpStatus.OK);

	    } catch (Exception e) {
	        return new ResponseEntity<>("Upload failed : " + e.getMessage(),
	                HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	@GetMapping("/getAllProductionArticle")
	public List<ProductionArticleMaster> getAllArticles() {
	    return productionArticleRepository.findAll();
	}

	@GetMapping("/getAllProductionMould")
	public List<ProductionMouldMaster> getAllMoulds() {
	    return productionMouldRepository.findAll();
	}
}
