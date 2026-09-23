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
import web.minda.project.entity.ColdMaster;
import web.minda.project.entity.MouldMaster;
import web.minda.project.entity.SupplierMaster;
import web.minda.project.helper.ExcelUploadHelper;
import web.minda.project.repositories.ColdMasterRepository;
import web.minda.project.repositories.MouldMasterRepository;
import web.minda.project.service.DateTimeService;

@RestController
@RequestMapping("/Controllers")
public class ColdMasterController {
	
	@Autowired
	ColdMasterRepository coldMasterRepository;
	
	@Autowired
	MouldMasterRepository mouldMasterRepository;
	
	@Autowired
	private DateTimeService dateTimeService;
	

	
	@PostMapping("/insertColdMaster")
	public ResponseEntity<Object> insertColdMaster(@RequestBody ColdMaster jsonObject) {

	    try {

	        boolean exists = coldMasterRepository.existsByColdName(jsonObject.getColdName());

	        if (!exists) {

	            // ✅ Find mould by name
	            String mouldName = jsonObject.getMould().getMouldName();

	            Optional<MouldMaster> mouldOptional =
	                    mouldMasterRepository.findByMouldName(mouldName);

	            if (!mouldOptional.isPresent()) {
	                return new ResponseEntity<>("Mould not found.", HttpStatus.NOT_FOUND);
	            }

	            // ✅ Set full mould entity
	            jsonObject.setMould(mouldOptional.get());

	            jsonObject.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
	            jsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

	            coldMasterRepository.save(jsonObject);

	            return new ResponseEntity<>("Data added successfully.", HttpStatus.OK);

	        } else {

	            return new ResponseEntity<>("Operation already exist.", HttpStatus.NOT_ACCEPTABLE);

	        }

	    } catch (Exception e) {
	        e.printStackTrace();
	        return new ResponseEntity<>("Something went wrong.", HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	
	
	@PostMapping("/editColdMaster")
	public ResponseEntity<Object> editColdMaster(@RequestBody ColdMaster jsonObject) {
		System.out.println("ok1");

	    try {

	    	System.out.println("ok2");
	        // ✅ Check ID
	        if (jsonObject.getColdId() == null) {
	            return new ResponseEntity<>(
	                    "Cold Id not found.",
	                    HttpStatus.NOT_ACCEPTABLE
	            );
	        }

	        // ✅ Check existing cold
	        Optional<ColdMaster> coldOpt =
	                coldMasterRepository.findById(jsonObject.getColdId());

	        if (coldOpt.isEmpty()) {
	            return new ResponseEntity<>(
	                    "Cold not found.",
	                    HttpStatus.NOT_ACCEPTABLE
	            );
	        }

	        // ✅ Find mould using mouldName
	        Optional<MouldMaster> mouldOpt =
	                mouldMasterRepository.findByMouldName(
	                        jsonObject.getMould().getMouldName()
	                );

	        if (mouldOpt.isEmpty()) {
	            return new ResponseEntity<>(
	                    "Mould not found.",
	                    HttpStatus.NOT_ACCEPTABLE
	            );
	        }

	        // ✅ Duplicate check
	        boolean exists =
	                coldMasterRepository.existsByColdNameAndColdIdNot(
	                        jsonObject.getColdName(),
	                        jsonObject.getColdId()
	                );

	        if (exists) {
	            return new ResponseEntity<>(
	                    "Data already exist.",
	                    HttpStatus.NOT_ACCEPTABLE
	            );
	        }

	        ColdMaster existingCold = coldOpt.get();

	        // ✅ Update fields
	        existingCold.setColdName(jsonObject.getColdName());
	        existingCold.setCreatedBy(jsonObject.getCreatedBy());

	        existingCold.setImage(jsonObject.getImage());

	        existingCold.setMould(mouldOpt.get());

	        existingCold.setDateTimeModified(
	                dateTimeService.getCurrentDateAndTime()
	        );

	        // Optional fields
	        existingCold.setStatus(jsonObject.getStatus());

	        // ✅ Save
	        coldMasterRepository.save(existingCold);

	        return new ResponseEntity<>(
	                "Data updated successfully.",
	                HttpStatus.OK
	        );

	    } catch (Exception e) {

	        e.printStackTrace();

	        return new ResponseEntity<>(
	                "Something went wrong",
	                HttpStatus.INTERNAL_SERVER_ERROR
	        );
	    }
	}
	
	
	@DeleteMapping("/deleteColdMaster/{id}")
	public ResponseEntity<Object> deleteColdMaster(@PathVariable Long id) {

	    try {

	        // Optional existence check
	        Optional<ColdMaster> coldOpt =
	                coldMasterRepository.findById(id);

	        if (coldOpt.isEmpty()) {
	            return new ResponseEntity<>(
	                    "Cold not found",
	                    HttpStatus.NOT_ACCEPTABLE
	            );
	        }

	        // ✅ Delete
	        coldMasterRepository.deleteById(id);

	        return new ResponseEntity<>(
	                "Data deleted successfully",
	                HttpStatus.OK
	        );

	    } catch (DataIntegrityViolationException e) {

	        return new ResponseEntity<>(
	                "Unable to delete Data due to mapping",
	                HttpStatus.CONFLICT
	        );

	    } catch (Exception e) {

	        e.printStackTrace();

	        return new ResponseEntity<>(
	                "Something went wrong",
	                HttpStatus.INTERNAL_SERVER_ERROR
	        );
	    }
	}
	
	
	@PostMapping("/getLikeCold/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getLikeCold(
	        @PathVariable("pageNum") int page,
	        @PathVariable("pageSize") int pageSize,
	        @RequestBody ColdMaster jsonObject) {

	    try {

	        Pageable pageable = PageRequest.of(page, pageSize);

	        // ✅ Get mouldName safely
	        String mouldName = null;

	        if (jsonObject.getMould() != null) {
	            mouldName = jsonObject.getMould().getMouldName();
	        }

	        Page<ColdMaster> object =
	                this.coldMasterRepository.getLikecold(
	                        jsonObject.getColdName(),
	                        mouldName,
	                        pageable);

	        return new ResponseEntity<>(object, HttpStatus.OK);

	    } catch (Exception e) {

	        e.printStackTrace();

	        return new ResponseEntity<>("ng", HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	
	
	@GetMapping("/download/template/cold")
	public void mouldTemplate(HttpServletResponse response) throws IOException {
		response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		ServletOutputStream outputStream = response.getOutputStream();
		String[] headerList = new String[] { "Mould Name", "Cold Name"};
		int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256 };
		ByteArrayInputStream excelFile = ExcelController.generateExcelTemplate(headerList, COLUMN_WIDTHS,
				"Cold Master");
		response.getOutputStream().write(excelFile.readAllBytes());
		outputStream.flush();
	}
	
	
	@PostMapping("/uploadCold/{employeeId}")
	public ResponseEntity<Object> uploadCold(
	        @RequestParam("file") MultipartFile file,
	        @PathVariable("employeeId") String employeeId) {

	    // ✅ Check XLSX file
	    if (!"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
	            .equals(file.getContentType())) {

	        return new ResponseEntity<>(
	                "Please upload XLSX file.",
	                HttpStatus.BAD_REQUEST
	        );
	    }

	    List<String> errorList = new ArrayList<>();
	    errorList.add("Errors , Row");

	    try (InputStream is = file.getInputStream();
	         OPCPackage opcPackage = OPCPackage.open(is);
	         XSSFWorkbook workbook = new XSSFWorkbook(opcPackage)) {

	        // ✅ Sheet Name
	        XSSFSheet sheet = workbook.getSheet("Cold Master");

	        if (sheet == null) {
	            return new ResponseEntity<>(
	                    "Cold Master sheet not found.",
	                    HttpStatus.NOT_FOUND
	            );
	        }

	        Iterator<Row> rows = sheet.iterator();

	        // ✅ Skip header
	        if (rows.hasNext()) {
	            rows.next();
	        }

	        while (rows.hasNext()) {

	            Row currentRow = rows.next();

	            // ✅ Skip empty row
	            if (currentRow == null || currentRow.getLastCellNum() <= 0) {
	                continue;
	            }

	            ColdMaster upload = new ColdMaster();

	            for (int cellIdx = 0;
	                 cellIdx < currentRow.getLastCellNum();
	                 cellIdx++) {

	                Cell currentCell = currentRow.getCell(cellIdx);

	                switch (cellIdx) {

	                    // =========================================
	                    // COLUMN 0 -> MOULD NAME
	                    // =========================================
	                    case 0:

	                        String mouldName =
	                                ExcelUploadHelper
	                                        .getStringCellValue(currentCell)
	                                        .trim();

	                        Optional<MouldMaster> mouldOptional =
	                                mouldMasterRepository
	                                        .findByMouldName(mouldName);

	                        if (mouldOptional.isPresent()) {

	                            upload.setMould(mouldOptional.get());

	                        } else {

	                            errorList.add(
	                                    "Mould not found , "
	                                            + (currentRow.getRowNum() + 1)
	                            );
	                        }

	                        break;

	                    // =========================================
	                    // COLUMN 1 -> COLD NAME
	                    // =========================================
	                    case 1:

	                        String coldName =
	                                ExcelUploadHelper
	                                        .getStringCellValue(currentCell)
	                                        .trim();

	                        upload.setColdName(coldName);

	                        break;

	                    default:
	                        break;
	                }
	            }

	            // =========================================
	            // VALIDATION
	            // =========================================

	            if (upload.getMould() == null) {

	                errorList.add(
	                        "Mould missing , "
	                                + (currentRow.getRowNum() + 1)
	                );

	                continue;
	            }

	            if (upload.getColdName() == null
	                    || upload.getColdName().trim().isEmpty()) {

	                errorList.add(
	                        "Cold Name missing , "
	                                + (currentRow.getRowNum() + 1)
	                );

	                continue;
	            }

	            // =========================================
	            // DUPLICATE CHECK
	            // =========================================

	            boolean exists =
	                    coldMasterRepository
	                            .existsByColdName(upload.getColdName());

	            if (exists) {

	                errorList.add(
	                        "Cold already exists , "
	                                + (currentRow.getRowNum() + 1)
	                );

	                continue;
	            }

	            // =========================================
	            // SAVE
	            // =========================================

	            upload.setDateTimeCreation(
	                    dateTimeService.getCurrentDateAndTime()
	            );

	            upload.setDateTimeModified(
	                    dateTimeService.getCurrentDateAndTime()
	            );
	            upload.setCreatedBy(employeeId);

	            upload.setStatus("ACTIVE");

	            coldMasterRepository.save(upload);
	        }

	        // =========================================
	        // RESPONSE
	        // =========================================

	        Map<String, Object> responseMap = new HashMap<>();

	        responseMap.put(
	                "message",
	                "Excel uploaded successfully."
	        );

	        responseMap.put(
	                "errorList",
	                errorList
	        );

	        return new ResponseEntity<>(
	                responseMap,
	                HttpStatus.OK
	        );

	    } catch (Exception e) {

	        e.printStackTrace();

	        return new ResponseEntity<>(
	                "Upload failed : " + e.getMessage(),
	                HttpStatus.INTERNAL_SERVER_ERROR
	        );
	    }
	}
	
	
	
	@PostMapping("/download/data/cold")
	public void exportToColdExcel(
	        HttpServletResponse response,
	        @RequestBody ColdMaster jsonObject)
	        throws IOException {

	    try {

	        // ✅ Excel content type
	        response.setContentType(
	                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
	        );

	        // ✅ Get mouldName safely
	        String mouldName = null;

	        if (jsonObject.getMould() != null) {
	            mouldName = jsonObject.getMould().getMouldName();
	        }

	        // ✅ Fetch data
	        List<ColdMaster> listObject =
	                this.coldMasterRepository.getAllColdMaster(
	                        jsonObject.getColdName(),
	                        mouldName
	                );

	        // ✅ Excel headers
	        String[] headerList = new String[] {
	                "Mould Name",
	                "Cold Name",
	              //  "Status",
	                "Created By",
	                "Date & Time"
	        };

	        // ✅ Column widths
	        int[] COLUMN_WIDTHS = {
	                35 * 256,
	                35 * 256,
	                20 * 256,
	                30 * 256
	        };

	        // ✅ Data mapping
	        List<Function<ColdMaster, Object>> getters =
	                Arrays.asList(

	                        // Mould Name
	                        cold -> cold.getMould() != null
	                                ? cold.getMould().getMouldName()
	                                : "",

	                        // Cold Name
	                        ColdMaster::getColdName,

	                        // Status
	                       // ColdMaster::getStatus,
	                        ColdMaster::getCreatedBy,

	                        // Date Time
	                        ColdMaster::getDateTimeModified
	                );

	        // ✅ Generate Excel
	        ByteArrayInputStream excelFile =
	                ExcelController.generateExcelData(
	                        listObject,
	                        getters,
	                        headerList,
	                        COLUMN_WIDTHS,
	                        "Cold Master"
	                );

	        // ✅ Write response
	        ServletOutputStream outputStream =
	                response.getOutputStream();

	        response.getOutputStream()
	                .write(excelFile.readAllBytes());

	        outputStream.flush();

	    } catch (Exception e) {

	        e.printStackTrace();
	    }
	}

}
