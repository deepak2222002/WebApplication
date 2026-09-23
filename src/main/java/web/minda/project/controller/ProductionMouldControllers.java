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
import web.minda.project.entity.MachineMaster;
import web.minda.project.entity.ProductionMouldMaster;
import web.minda.project.helper.ExcelUploadHelper;
import web.minda.project.repositories.MachineMasterRepository;
import web.minda.project.repositories.ProductionMouldRepository;
import web.minda.project.service.DateTimeService;

@RestController
@RequestMapping("/Controllers")
public class ProductionMouldControllers {
	
	@Autowired
	ProductionMouldRepository productionMouldRepository;
	ProductionMouldMaster masterObject = new ProductionMouldMaster();
	
	@Autowired
	private DateTimeService dateTimeService;
	
	@PostMapping("/insertProductionMouldMaster")
	public ResponseEntity<Object> insertProductionMouldMaster(@RequestBody ProductionMouldMaster obj) {
	    try {

	        if (productionMouldRepository.existsByMould(obj.getMould())) {
	            return new ResponseEntity<>("Mould already exists.", HttpStatus.NOT_ACCEPTABLE);
	        }

	        obj.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
	        obj.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

	        productionMouldRepository.save(obj);

	        return new ResponseEntity<>("Data added successfully.", HttpStatus.OK);

	    } catch (Exception e) {
	        return new ResponseEntity<>("Something went wrong.", HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	
	
	
	@PostMapping("/editProductionMouldMaster")
	public ResponseEntity<Object> editProductionMouldMaster(@RequestBody ProductionMouldMaster obj) {

	    try {

	        if (obj.getProductionMouldId() == null) {
	            return new ResponseEntity<>("ID missing.", HttpStatus.NOT_ACCEPTABLE);
	        }

	        Optional<ProductionMouldMaster> existingOpt =
	                productionMouldRepository.findById(obj.getProductionMouldId());

	        if (existingOpt.isEmpty()) {
	            return new ResponseEntity<>("Record not found.", HttpStatus.NOT_ACCEPTABLE);
	        }

	        ProductionMouldMaster existing = existingOpt.get();

	        existing.setMould(obj.getMould());
	        existing.setDescription(obj.getDescription());
	        existing.setToolLifeShots(obj.getToolLifeShots());
	        existing.setPreventiveShots(obj.getPreventiveShots());
	        existing.setCleaningShots(obj.getCleaningShots());
	        existing.setPerShotWeightKg(obj.getPerShotWeightKg());
	        existing.setImage(obj.getImage());
	        existing.setStatus(obj.getStatus());

	        existing.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

	        productionMouldRepository.save(existing);

	        return new ResponseEntity<>("Data updated successfully.", HttpStatus.OK);

	    } catch (Exception e) {
	        return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}

	@DeleteMapping("deleteProductionMouldMaster/{id}")
	public ResponseEntity<Object> deleteProductionMouldMaster(@PathVariable Long id) {
		try {
			this.productionMouldRepository.deleteById(id);
			return new ResponseEntity<Object>("Data deleted successfully", HttpStatus.OK);
		} catch (DataIntegrityViolationException e) {
			Optional<ProductionMouldMaster> object = this.productionMouldRepository.findById(id);
			return new ResponseEntity<Object>(
					"Unable to delete Data due to mapping",
					HttpStatus.CONFLICT);
		} catch (Exception e) {
			return new ResponseEntity<Object>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/download/template/productionMould")
	public void productionMouldTemplate(HttpServletResponse response) throws IOException {
		response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		ServletOutputStream outputStream = response.getOutputStream();
		String[] headerList = new String[] { "Mould",
                "Description",
                "Tool Life Shots",
                "Preventive Shots",
                "Cleaning Shots",
                "Per Shot Weight Kg"};
		int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256 };
		ByteArrayInputStream excelFile = ExcelController.generateExcelTemplate(headerList, COLUMN_WIDTHS,
				"Production Mould Master");
		response.getOutputStream().write(excelFile.readAllBytes());
		outputStream.flush();
	}


	
	@PostMapping("/download/data/productionMould")
	public void exportToExcel(HttpServletResponse response,
	                         @RequestBody ProductionMouldMaster jsonObject) throws IOException {
	    try {

	        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

	        List<ProductionMouldMaster> listObject =
	                productionMouldRepository.getAllMoulds(
	                        jsonObject.getMould(),
	                        jsonObject.getDescription(),
	                        jsonObject.getStatus(),
	                        jsonObject.getCreatedBy()
	                );

	        String[] headerList = new String[]{
	                "Mould",
	                "Description",
	                "Tool Life Shots",
	                "Preventive Shots",
	                "Cleaning Shots",
	                "Per Shot Weight Kg",
	                "Status",
	                "Created By",
	                "Date Time"
	        };

	        int[] COLUMN_WIDTHS = {
	                40 * 256, 40 * 256, 25 * 256,
	                25 * 256, 25 * 256, 20 * 256,
	                25 * 256, 30 * 256
	        };

	        List<Function<ProductionMouldMaster, Object>> getters = Arrays.asList(
	                ProductionMouldMaster::getMould,
	                ProductionMouldMaster::getDescription,
	                ProductionMouldMaster::getToolLifeShots,
	                ProductionMouldMaster::getPreventiveShots,
	                ProductionMouldMaster::getCleaningShots,
	                ProductionMouldMaster::getPerShotWeightKg,
	                ProductionMouldMaster::getStatus,
	                ProductionMouldMaster::getCreatedBy,
	                ProductionMouldMaster::getDateTimeModified
	        );

	        ByteArrayInputStream excelFile =
	                ExcelController.generateExcelData(listObject, getters, headerList, COLUMN_WIDTHS, "Mould Master");

	        ServletOutputStream outputStream = response.getOutputStream();
	        outputStream.write(excelFile.readAllBytes());
	        outputStream.flush();

	    } catch (Exception e) {
	        e.printStackTrace();
	    }
	}
	
	@PostMapping("/getLikeProductionMould/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getLikeproductionMould(
	        @PathVariable int pageNum,
	        @PathVariable int pageSize,
	        @RequestBody ProductionMouldMaster jsonObject) {

	    try {

	        Pageable pageable = PageRequest.of(pageNum, pageSize);

	        Page<ProductionMouldMaster> data =
	                productionMouldRepository.getLikeMould(
	                        jsonObject.getMould(),
	                        jsonObject.getDescription(),
	                        jsonObject.getStatus(),
	                        jsonObject.getCreatedBy(),
	                        pageable
	                );

	        return new ResponseEntity<>(data, HttpStatus.OK);

	    } catch (Exception e) {
	        e.printStackTrace();
	        return new ResponseEntity<>("Error", HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	
	
	
	
	@PostMapping("/uploadProductionMould/{employeeId}")
	public ResponseEntity<Object> uploadProductionMould(
	        @RequestParam("file") MultipartFile file,
	        @PathVariable String employeeId) {

	    if (!"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
	            .equals(file.getContentType())) {
	        return new ResponseEntity<>("Please upload XLSX file.", HttpStatus.BAD_REQUEST);
	    }

	    List<String> errorList = new ArrayList<>();
	    errorList.add("Errors , Row");

	    try (InputStream is = file.getInputStream();
	         OPCPackage opcPackage = OPCPackage.open(is);
	         XSSFWorkbook workbook = new XSSFWorkbook(opcPackage)) {

	        XSSFSheet sheet = workbook.getSheet("Production Mould Master");

	        if (sheet == null) {
	            return new ResponseEntity<>("Mould Master sheet not found.", HttpStatus.NOT_FOUND);
	        }

	        Iterator<Row> rows = sheet.iterator();
	        if (rows.hasNext()) rows.next();

	        while (rows.hasNext()) {

	            Row currentRow = rows.next();
	            ProductionMouldMaster upload = new ProductionMouldMaster();

	            for (int cellIdx = 0; cellIdx < currentRow.getLastCellNum(); cellIdx++) {

	                Cell cell = currentRow.getCell(cellIdx);
	                String value = ExcelUploadHelper.getStringCellValue(cell).trim();

	                switch (cellIdx) {
	                    case 0: upload.setMould(value); break;
	                    case 1: upload.setDescription(value); break;
	                    case 2: upload.setToolLifeShots(value); break;
	                    case 3: upload.setPreventiveShots(value); break;
	                    case 4: upload.setCleaningShots(value); break;
	                    case 5: upload.setPerShotWeightKg(value); break;
	                    case 6: upload.setStatus(value); break;
	                 
	                }
	            }

	            if (upload.getMould() == null || upload.getMould().isEmpty()) {
	                errorList.add("Mould missing , " + (currentRow.getRowNum() + 1));
	                continue;
	            }

	            boolean exists = productionMouldRepository.existsByMould(upload.getMould());

	            if (exists) {
	                errorList.add("Mould already exists , " + (currentRow.getRowNum() + 1));
	                continue;
	            }

	            upload.setCreatedBy(employeeId);
	            upload.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
	            upload.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

	            productionMouldRepository.save(upload);
	        }

	        Map<String, Object> res = new HashMap<>();
	        res.put("message", "Upload success");
	        res.put("errorList", errorList);

	        return new ResponseEntity<>(res, HttpStatus.OK);

	    } catch (Exception e) {
	        return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}

}
