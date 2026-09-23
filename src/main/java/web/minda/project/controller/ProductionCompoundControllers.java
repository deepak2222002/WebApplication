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
import java.util.function.Function;

import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.ss.usermodel.Cell;
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
import web.minda.project.entity.ProductionCompoundMaster;
import web.minda.project.helper.ExcelUploadHelper;
import web.minda.project.repositories.ProductionCompoundRepository;
import web.minda.project.service.DateTimeService;

@RestController
@RequestMapping("/Controllers")
public class ProductionCompoundControllers {
	
    @Autowired
    private ProductionCompoundRepository productionCompoundRepository;

    @Autowired
    private DateTimeService dateTimeService;
	
	@PostMapping("/updateCompoundCheckbox")
	public ResponseEntity<?> updateCheckbox(@RequestBody Map<String, String> req) {

	    Long id = Long.parseLong(req.get("productionCompoundId"));

	    ProductionCompoundMaster data = productionCompoundRepository.findById(id).orElseThrow();

	    if (req.containsKey("batchCutting")) {
	        data.setBatchCutting(req.get("batchCutting"));
	    }

	    if (req.containsKey("rmsWeight")) {
	        data.setRmsWeight(req.get("rmsWeight"));
	    }

	    productionCompoundRepository.save(data);

	    return ResponseEntity.ok("Updated");
	}
	
	
	
    // ================== INSERT ==================
    @PostMapping("/insertProductionCompound")
    public ResponseEntity<Object> insert(@RequestBody ProductionCompoundMaster obj) {
        try {

            boolean exists = productionCompoundRepository
                    .existsByCompoundAndBatchWeight(
                            obj.getCompound(),
                            obj.getBatchWeight()
                    );

            if (exists) {
                return new ResponseEntity<>("Data already exists", HttpStatus.NOT_ACCEPTABLE);
            }

            obj.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
            obj.setDateTimeModified(dateTimeService.getCurrentDateAndTime());
            obj.setStatus("1");

            productionCompoundRepository.save(obj);

            return new ResponseEntity<>("Data added successfully", HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ================== UPDATE ==================
    @PostMapping("/updateProductionCompound")
    public ResponseEntity<Object> update(@RequestBody ProductionCompoundMaster obj) {
        try {

            if (obj.getProductionCompoundId() == null) {
                return new ResponseEntity<>("ID missing", HttpStatus.BAD_REQUEST);
            }

            // ✅ Fetch existing data first
            ProductionCompoundMaster existing =
                    productionCompoundRepository.findById(obj.getProductionCompoundId())
                            .orElse(null);

            if (existing == null) {
                return new ResponseEntity<>("Record not found", HttpStatus.NOT_FOUND);
            }

            // ✅ Update only editable fields
            existing.setCompound(obj.getCompound());
            existing.setMasterBatch(obj.getMasterBatch());
            existing.setFormulaNo(obj.getFormulaNo());
            existing.setBatchWeight(obj.getBatchWeight());
            existing.setExpiry(obj.getExpiry());

            existing.setBatchCutting(existing.getBatchCutting());
            existing.setRmsWeight(existing.getRmsWeight());

            existing.setImage(obj.getImage());

            existing.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

            productionCompoundRepository.save(existing);

            return new ResponseEntity<>("Updated successfully", HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>("Update failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    // ================== DELETE ==================
    @DeleteMapping("/deleteProductionCompound/{id}")
    public ResponseEntity<Object> delete(@PathVariable Long id) {
        try {
            productionCompoundRepository.deleteById(id);
            return new ResponseEntity<>("Deleted successfully", HttpStatus.OK);

        } catch (DataIntegrityViolationException e) {
            return new ResponseEntity<>("Mapping exists, cannot delete", HttpStatus.CONFLICT);

        } catch (Exception e) {
            return new ResponseEntity<>("Error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ================== PAGINATION + SEARCH ==================
    @PostMapping("/getProductionCompound/{page}/{size}")
    public ResponseEntity<Object> getAll(
            @PathVariable int page,
            @PathVariable int size,
            @RequestBody ProductionCompoundMaster filter
    ) {
        try {

            Pageable pageable = PageRequest.of(page, size);

            Page<ProductionCompoundMaster> data =
                    productionCompoundRepository.search(
                            filter.getCompound(),
                            filter.getMasterBatch(),
                            pageable
                    );

            return new ResponseEntity<>(data, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>("Error fetching data", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    
    
    @GetMapping("/download/template/productionCompound")
    public void downloadTemplate(HttpServletResponse response) throws IOException {

        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

        String[] headerList = new String[] {
                "Compound",
                "Master Batch",
                "Formula No",
                "Batch Weight",
                "Expiry",
                "Batch Cutting (0/1)",
                "RMS Weight (0/1)"
        };

        int[] COLUMN_WIDTHS = {
                40 * 256, 30 * 256, 30 * 256,
                25 * 256, 25 * 256,
                25 * 256, 25 * 256
        };

        ByteArrayInputStream excelFile =
                ExcelController.generateExcelTemplate(headerList, COLUMN_WIDTHS, "Production Compound Master");

        ServletOutputStream outputStream = response.getOutputStream();
        outputStream.write(excelFile.readAllBytes());
        outputStream.flush();
    }
    
    
    
    @GetMapping("/download/data/productionCompound")
    public void downloadData(HttpServletResponse response) throws IOException {

        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

        List<ProductionCompoundMaster> list =
                productionCompoundRepository.findAll();

        String[] headerList = new String[] {
                "Compound",
                "Master Batch",
                "Formula No",
                "Batch Weight",
                "Expiry",
                "Batch Cutting",
                "RMS Weight",
                "Created By",
                "Date Time"
        };

        int[] COLUMN_WIDTHS = {
                40 * 256, 30 * 256, 30 * 256,
                25 * 256, 25 * 256,
                20 * 256, 20 * 256,
                30 * 256, 30 * 256
        };

        List<Function<ProductionCompoundMaster, Object>> getters = Arrays.asList(
                ProductionCompoundMaster::getCompound,
                ProductionCompoundMaster::getMasterBatch,
                ProductionCompoundMaster::getFormulaNo,
                ProductionCompoundMaster::getBatchWeight,
                ProductionCompoundMaster::getExpiry,
                ProductionCompoundMaster::getBatchCutting,
                ProductionCompoundMaster::getRmsWeight,
                ProductionCompoundMaster::getCreatedBy,
                ProductionCompoundMaster::getDateTimeModified
        );

        ByteArrayInputStream excelFile =
                ExcelController.generateExcelData(list, getters, headerList, COLUMN_WIDTHS, "Production Compound Master");

        ServletOutputStream outputStream = response.getOutputStream();
        outputStream.write(excelFile.readAllBytes());
        outputStream.flush();
    }
    
    
   
    
    
    @PostMapping("/uploadProductionCompound/{employeeId}")
    public ResponseEntity<Object> uploadProductionCompound(
            @RequestParam("file") MultipartFile file,
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

            XSSFSheet sheet = workbook.getSheet("Production Compound Master");

            if (sheet == null) {
                return new ResponseEntity<>("Production Compound Master sheet not found.",
                        HttpStatus.NOT_FOUND);
            }

            Iterator<Row> rows = sheet.iterator();

            if (rows.hasNext()) rows.next(); // skip header

            while (rows.hasNext()) {

                Row currentRow = rows.next();

                if (currentRow == null || currentRow.getLastCellNum() <= 0) {
                    continue;
                }

                ProductionCompoundMaster upload = new ProductionCompoundMaster();

                for (int cellIdx = 0; cellIdx < currentRow.getLastCellNum(); cellIdx++) {

                    Cell currentCell = currentRow.getCell(cellIdx);

                    String value = ExcelUploadHelper.getStringCellValue(currentCell).trim();

                    switch (cellIdx) {

                        case 0:
                            upload.setCompound(value);
                            break;

                        case 1:
                            upload.setMasterBatch(value);
                            break;

                        case 2:
                            upload.setFormulaNo(value);
                            break;

                        case 3:
                            upload.setBatchWeight(value);
                            break;

                        case 4:
                            upload.setExpiry(value);
                            break;

                        case 5:
                            upload.setBatchCutting("1".equals(value) ? "1" : "0");
                            break;

                        case 6:
                            upload.setRmsWeight("1".equals(value) ? "1" : "0");
                            break;

                        default:
                            break;
                    }
                }

                // ✅ VALIDATION
                if (upload.getCompound() == null || upload.getCompound().isEmpty()) {
                    errorList.add("Compound missing , Row " + (currentRow.getRowNum() + 1));
                    continue;
                }

                // ✅ DUPLICATE CHECK (IMPORTANT — ADD IN REPOSITORY)
                boolean exists = productionCompoundRepository
                        .existsByCompound(
                                upload.getCompound()
                     
                        );

                if (exists) {
                    errorList.add("Duplicate record , Row " + (currentRow.getRowNum() + 1));
                    continue;
                }

                // ✅ DEFAULT VALUES
                upload.setCreatedBy(employeeId);
                upload.setStatus("1");
                upload.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
                upload.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

                productionCompoundRepository.save(upload);
            }

            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("message", "Excel uploaded successfully.");
            responseMap.put("errorList", errorList);

            return new ResponseEntity<>(responseMap, HttpStatus.OK);

        } catch (IOException e) {

            return new ResponseEntity<>("Excel parsing failed: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);

        } catch (Exception e) {

            return new ResponseEntity<>("Unexpected error: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
