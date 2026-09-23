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

import org.springframework.data.domain.Pageable;
import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
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
import web.minda.project.entity.ProductionCompoundChildPartMaster;
import web.minda.project.entity.ProductionCompoundMaster;
import web.minda.project.helper.ExcelUploadHelper;
import web.minda.project.repositories.ProductionCompoundChildPartRepository;
import web.minda.project.repositories.ProductionCompoundRepository;
import web.minda.project.service.DateTimeService;

@RestController
@RequestMapping("/Controllers")
public class ProductionCompoundChildPartControllers {

    @Autowired
    private ProductionCompoundChildPartRepository childRepo;

    @Autowired
    private ProductionCompoundRepository parentRepo;

    @Autowired
    private DateTimeService dateTimeService;
	
    
    
    @PostMapping("/insertProductionCompoundChildPart")
    public ResponseEntity<Object> insert(@RequestBody ProductionCompoundChildPartMaster obj) {
        try {

            if (obj.getProductionCompoundMaster() == null ||
                obj.getProductionCompoundMaster().getProductionCompoundId() == null) {

                return new ResponseEntity<>("Production Compound ID required", HttpStatus.BAD_REQUEST);
            }

            // ✅ Fetch parent
            ProductionCompoundMaster parent = parentRepo
                    .findById(obj.getProductionCompoundMaster().getProductionCompoundId())
                    .orElse(null);

            if (parent == null) {
                return new ResponseEntity<>("Invalid Production Compound ID", HttpStatus.NOT_FOUND);
            }

            obj.setProductionCompoundMaster(parent);

            obj.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
            obj.setDateTimeModified(dateTimeService.getCurrentDateAndTime());
            obj.setStatus("1");

            childRepo.save(obj);

            return new ResponseEntity<>("Data added successfully", HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    
    @PostMapping("/updateProductionCompoundChildPart")
    public ResponseEntity<Object> update(@RequestBody ProductionCompoundChildPartMaster obj) {
        try {

            if (obj.getProductionCompoundChildPartId() == null) {
                return new ResponseEntity<>("ID missing", HttpStatus.BAD_REQUEST);
            }

            ProductionCompoundChildPartMaster existing =
                    childRepo.findById(obj.getProductionCompoundChildPartId()).orElse(null);

            if (existing == null) {
                return new ResponseEntity<>("Record not found", HttpStatus.NOT_FOUND);
            }

            // ✅ Update parent if changed
            if (obj.getProductionCompoundMaster() != null &&
                obj.getProductionCompoundMaster().getProductionCompoundId() != null) {

                ProductionCompoundMaster parent = parentRepo
                        .findById(obj.getProductionCompoundMaster().getProductionCompoundId())
                        .orElse(null);

                if (parent != null) {
                    existing.setProductionCompoundMaster(parent);
                }
            }

            // ✅ Update fields
            existing.setAcceleraters(obj.getAcceleraters());
            existing.setUnit(obj.getUnit());
            existing.setImage(obj.getImage());

            existing.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

            childRepo.save(existing);

            return new ResponseEntity<>("Updated successfully", HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>("Update failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    
    @DeleteMapping("/deleteProductionCompoundChildPart/{id}")
    public ResponseEntity<Object> delete(@PathVariable Long id) {
        try {
            childRepo.deleteById(id);
            return new ResponseEntity<>("Deleted successfully", HttpStatus.OK);

        } catch (DataIntegrityViolationException e) {
            return new ResponseEntity<>("Mapping exists, cannot delete", HttpStatus.CONFLICT);

        } catch (Exception e) {
            return new ResponseEntity<>("Error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
	
    
    
    @PostMapping("/getProductionCompoundChildPart/{page}/{size}")
    public ResponseEntity<Object> getAll(
            @PathVariable int page,
            @PathVariable int size,
            @RequestBody Map<String, Object> filter
    ) {
        try {

            Pageable pageable = PageRequest.of(page, size);

            String compound = null;

            if (filter.get("productionCompoundMaster") != null) {
                Map<String, Object> pcm =
                    (Map<String, Object>) filter.get("productionCompoundMaster");

                compound = pcm.get("compound") != null
                        ? pcm.get("compound").toString()
                        : null;
            }

            String acceleraters = filter.get("acceleraters") != null
                    ? filter.get("acceleraters").toString()
                    : null;

            Page<ProductionCompoundChildPartMaster> data =
                    childRepo.search(compound, acceleraters, pageable);

            return new ResponseEntity<>(data, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>("Error fetching data", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    
    @GetMapping("/download/template/productionCompoundChildPart")
    public void downloadTemplate(HttpServletResponse response) throws IOException {

        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

        String[] headerList = new String[] {
                "Compound",          // parent reference
                "Acceleraters",
                "Unit"
        };

        int[] COLUMN_WIDTHS = {
                40 * 256, 30 * 256, 25 * 256
        };

        ByteArrayInputStream excelFile =
                ExcelController.generateExcelTemplate(
                        headerList,
                        COLUMN_WIDTHS,
                        "Production Compound Child Part"
                );

        ServletOutputStream outputStream = response.getOutputStream();
        outputStream.write(excelFile.readAllBytes());
        outputStream.flush();
    }
    
    
    @GetMapping("/download/data/productionCompoundChildPart")
    public void downloadData(HttpServletResponse response) throws IOException {

        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

        List<ProductionCompoundChildPartMaster> list = childRepo.findAll();

        String[] headerList = new String[] {
                "Compound",
                "Acceleraters",
                "Unit",
                "Created By",
                "Date Time"
        };

        int[] COLUMN_WIDTHS = {
                40 * 256, 30 * 256, 25 * 256,
                30 * 256, 30 * 256
        };

        List<Function<ProductionCompoundChildPartMaster, Object>> getters = Arrays.asList(
                obj -> obj.getProductionCompoundMaster() != null
                        ? obj.getProductionCompoundMaster().getCompound()
                        : "",
                ProductionCompoundChildPartMaster::getAcceleraters,
                ProductionCompoundChildPartMaster::getUnit,
                ProductionCompoundChildPartMaster::getCreatedBy,
                ProductionCompoundChildPartMaster::getDateTimeModified
        );

        ByteArrayInputStream excelFile =
                ExcelController.generateExcelData(
                        list,
                        getters,
                        headerList,
                        COLUMN_WIDTHS,
                        "Production Compound Child Part"
                );

        ServletOutputStream outputStream = response.getOutputStream();
        outputStream.write(excelFile.readAllBytes());
        outputStream.flush();
    }
    
    
    
    @PostMapping("/uploadProductionCompoundChildPart/{employeeId}")
    public ResponseEntity<Object> uploadProductionCompoundChildPart(
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

            XSSFSheet sheet = workbook.getSheet("Production Compound Child Part");

            if (sheet == null) {
                return new ResponseEntity<>("Sheet not found.", HttpStatus.NOT_FOUND);
            }

            Iterator<Row> rows = sheet.iterator();

            if (rows.hasNext()) rows.next(); // skip header

            while (rows.hasNext()) {

                Row currentRow = rows.next();

                if (currentRow == null || currentRow.getLastCellNum() <= 0) {
                    continue;
                }

                ProductionCompoundChildPartMaster upload = new ProductionCompoundChildPartMaster();

                String compoundName = "";

                for (int cellIdx = 0; cellIdx < currentRow.getLastCellNum(); cellIdx++) {

                    Cell currentCell = currentRow.getCell(cellIdx);
                    String value = ExcelUploadHelper.getStringCellValue(currentCell).trim();

                    switch (cellIdx) {

                        case 0:
                            compoundName = value;
                            break;

                        case 1:
                            upload.setAcceleraters(value);
                            break;

                        case 2:
                            upload.setUnit(value);
                            break;

                        default:
                            break;
                    }
                }

                // ✅ VALIDATION
                if (compoundName == null || compoundName.isEmpty()) {
                    errorList.add("Compound missing , Row " + (currentRow.getRowNum() + 1));
                    continue;
                }

                // ✅ FIND PARENT
                ProductionCompoundMaster parent =
                        parentRepo.findByCompound(compoundName).orElse(null);

                if (parent == null) {
                    errorList.add("Invalid Compound , Row " + (currentRow.getRowNum() + 1));
                    continue;
                }

                upload.setProductionCompoundMaster(parent);

                // ✅ DEFAULT VALUES
                upload.setCreatedBy(employeeId);
                upload.setStatus("1");
                upload.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
                upload.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

                childRepo.save(upload);
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
