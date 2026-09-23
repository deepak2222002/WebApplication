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
import web.minda.project.entity.CompoundDataMaster;
import web.minda.project.entity.LocationMaster;
import web.minda.project.entity.ProcessMaster;
import web.minda.project.helper.ExcelUploadHelper;
import web.minda.project.repositories.CompoundDataRepository;
import web.minda.project.service.DateTimeService;

@RestController
@RequestMapping("/Controllers")
public class CompoundDataController {
	@Autowired
	CompoundDataRepository compoundDataRepository;
	CompoundDataMaster masterObject = new CompoundDataMaster();

	@Autowired
	private DateTimeService dateTimeService;

	@PostMapping("/insertCompoundDataMaster")
	public ResponseEntity<Object> insertCompoundDataMaster(@RequestBody CompoundDataMaster JsonObject) {
		try {
			if (!this.compoundDataRepository.existsByCompoundAndBatchWeightAndLoadtimeAndMixTimeAndBlendTimeAndHandleTimeAndReLoadTimeAndReMixTimeAndReBlendTimeAndReHandleTime(JsonObject.getCompound()
					,JsonObject.getBatchWeight(),JsonObject.getLoadtime(),JsonObject.getMixTime(),JsonObject.getBlendTime(),JsonObject.getHandleTime(),JsonObject.getReLoadTime(),
					JsonObject.getReMixTime(),JsonObject.getReBlendTime(),JsonObject.getReHandleTime())) {

				JsonObject.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
				JsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

				this.compoundDataRepository.save(JsonObject);
				return new ResponseEntity<>("Data added successfully.", HttpStatus.OK);
			} else {
				return new ResponseEntity<>("Data code already exist.", HttpStatus.NOT_ACCEPTABLE);
			}
		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<>("Something went wrong.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/editCompoundDataMaster")
	public ResponseEntity<Object> editCompoundDataMaster(@RequestBody CompoundDataMaster jsonObject) {
		try {
			if (jsonObject.getCompoundDataId() == null) {
				return new ResponseEntity<>("Data code not found.", HttpStatus.NOT_ACCEPTABLE);
			} else {
				jsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());
				this.compoundDataRepository.save(jsonObject);
				return new ResponseEntity<>("Data updated successfully.", HttpStatus.OK);
			}
		} catch (Exception e) {
			return new ResponseEntity<Object>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}


	

	@DeleteMapping("/deleteCompoundData/{id}")
	public ResponseEntity<Object> deleteProcessMaster(@PathVariable Long id) {
		try {
			this.compoundDataRepository.deleteById(id);
			return new ResponseEntity<Object>("Data deleted successfully", HttpStatus.OK);
		} catch (DataIntegrityViolationException e) {
			return new ResponseEntity<Object>("Unable to delete Data due to mapping", HttpStatus.CONFLICT);
		} catch (Exception e) {
			return new ResponseEntity<Object>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}



	@GetMapping("/download/template/compoundData")
	public void plantTemplate(HttpServletResponse response) throws IOException {
		response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		ServletOutputStream outputStream = response.getOutputStream();
		String[] headerList = new String[] { "Compound", "Batch Weight", "Load Time", "Mix Time", "Blend Time", "Handle Time","Re Load Time","Re Mix Time","Re Blend Time","Re handle Time"};
		int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256, 20 * 256, 20 * 256 };
		ByteArrayInputStream excelFile = ExcelController.generateExcelTemplate(headerList, COLUMN_WIDTHS,
				"Compound Data Master");
		response.getOutputStream().write(excelFile.readAllBytes());
		outputStream.flush();
	}

	@GetMapping("/download/data/compoundData")
	public void exportPlantData(HttpServletResponse response) throws IOException {
		try {
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
			List<CompoundDataMaster> list = this.compoundDataRepository.getalldata();
			String[] headerList = new String[] { "Compound", "Batch Weight", "Load Time", "Mix Time", "Blend Time", "Handle Time","Re Load Time","Re Mix Time","Re Blend Time","Re handle Time"
					, "Created By", "Date & Time" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256 };

			List<Function<CompoundDataMaster, Object>> getters = Arrays.asList(CompoundDataMaster::getCompound,
					CompoundDataMaster::getBatchWeight, CompoundDataMaster::getLoadtime, CompoundDataMaster::getMixTime,
					CompoundDataMaster::getBlendTime, CompoundDataMaster::getHandleTime,
					CompoundDataMaster::getReLoadTime,CompoundDataMaster::getMixTime,CompoundDataMaster::getReBlendTime,CompoundDataMaster::getReHandleTime,
					CompoundDataMaster::getCreatedBy, CompoundDataMaster::getDateTimeModified);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(list, getters, headerList,
					COLUMN_WIDTHS, "Compound Data Master");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	@PostMapping("/download/data/compounddata")
	public void exportToExcel(HttpServletResponse response, @RequestBody CompoundDataMaster jsonObject) throws IOException {
		try {
			// Set the content type to Excel file
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

			// Fetch data from the repository as a List<PlantMaster>
			List<CompoundDataMaster> listObject = this.compoundDataRepository.getAllCompoundMaster(jsonObject.getCompound(),
					jsonObject.getBatchWeight(), jsonObject.getLoadtime(), jsonObject.getMixTime(),
					jsonObject.getBlendTime(),jsonObject.getHandleTime(), jsonObject.getReLoadTime(), jsonObject.getMixTime(),
					jsonObject.getReBlendTime(),jsonObject.getReHandleTime(),jsonObject.getStatus(), jsonObject.getCreatedBy());

			String[] headerList = new String[] { "Compound", "Batch Weight", "Load Time", "Mix Time", "Blend Time", "Handle Time","Re Load Time","Re Mix Time","Re Blend Time","Re handle Time"
					, "Created By", "Date & Time" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256 , 30 * 256 , 30 * 256 , 30 * 256 , 30 * 256 , 30 * 256 , 30 * 256 };

			List<Function<CompoundDataMaster, Object>> getters = Arrays.asList(CompoundDataMaster::getCompound,
					CompoundDataMaster::getBatchWeight, CompoundDataMaster::getLoadtime, CompoundDataMaster::getMixTime,
					CompoundDataMaster::getBlendTime, CompoundDataMaster::getHandleTime,
					CompoundDataMaster::getReLoadTime,CompoundDataMaster::getMixTime,CompoundDataMaster::getReBlendTime,CompoundDataMaster::getReHandleTime,
					CompoundDataMaster::getCreatedBy, CompoundDataMaster::getDateTimeModified);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(listObject, getters, headerList,
					COLUMN_WIDTHS, "Compound Data Master");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();

		}
	}

	@PostMapping("/getLikeCompoundData/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getLikeCompoundData(@PathVariable("pageNum") int page,
			@PathVariable("pageSize") int pageSize, @RequestBody CompoundDataMaster jsonObject) {

		try {
			System.out.println(jsonObject);
			Pageable pageable = PageRequest.of(page, pageSize);
			Page<CompoundDataMaster> object = this.compoundDataRepository.getLikeCompound(jsonObject.getCompound(),
					jsonObject.getBatchWeight(), jsonObject.getLoadtime(), jsonObject.getMixTime(),
					jsonObject.getBlendTime(),jsonObject.getHandleTime(), jsonObject.getReLoadTime(), jsonObject.getMixTime(),
					jsonObject.getReBlendTime(),jsonObject.getReHandleTime(),jsonObject.getStatus(), jsonObject.getCreatedBy(), pageable);
			System.out.println(object);
			return new ResponseEntity<Object>(object, HttpStatus.OK);

		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<Object>("ng", HttpStatus.OK);
		}
	}
	
	
	
	@PostMapping("/uploadCompoundData/{employeeId}")
	public ResponseEntity<Object> uploadCompoundData(@RequestParam("file") MultipartFile file,
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

	        XSSFSheet sheet = workbook.getSheet("Compound Data Master");

	        if (sheet == null) {
	            return new ResponseEntity<>("Compound Data Master sheet not found.",
	                    HttpStatus.NOT_FOUND);
	        }

	        Iterator<Row> rows = sheet.iterator();

	        if (rows.hasNext()) rows.next();

	        while (rows.hasNext()) {

	            Row currentRow = rows.next();

	            if (currentRow == null || currentRow.getLastCellNum() <= 0) {
	                continue;
	            }

	            CompoundDataMaster upload = new CompoundDataMaster();

	            for (int cellIdx = 0; cellIdx < currentRow.getLastCellNum(); cellIdx++) {

	                Cell currentCell = currentRow.getCell(cellIdx);

	                String value = ExcelUploadHelper.getStringCellValue(currentCell).trim();

	                switch (cellIdx) {

	                case 0:
	                    upload.setCompound(value);
	                    break;

	                case 1:
	                    upload.setBatchWeight(value);
	                    break;

	                case 2:
	                    upload.setLoadtime(value);
	                    break;

	                case 3:
	                    upload.setMixTime(value);
	                    break;

	                case 4:
	                    upload.setBlendTime(value);
	                    break;

	                case 5:
	                    upload.setHandleTime(value);
	                    break;
	                  
	                case 6:
	                    upload.setReLoadTime(value);
	                    break;

	                case 7:
	                    upload.setReMixTime(value);
	                    break;

	                case 8:
	                    upload.setReBlendTime(value);
	                    break;

	                case 9:
	                    upload.setReHandleTime(value);
	                    break;

	                default:
	                    break;
	                }
	            }


	            if (upload.getCompound() == null || upload.getCompound().isEmpty()) {
	                errorList.add("Compound Name missing , " + (currentRow.getRowNum() + 1));
	                continue;
	            }

	            boolean exists = compoundDataRepository
	                    .existsByCompoundAndBatchWeightAndLoadtimeAndMixTimeAndBlendTimeAndHandleTimeAndReLoadTimeAndReMixTimeAndReBlendTimeAndReHandleTime(
	                    		upload.getCompound(),upload.getBatchWeight(),upload.getLoadtime(),upload.getMixTime(),
	                    		upload.getBlendTime(),upload.getHandleTime(),upload.getReLoadTime(),upload.getReMixTime(),upload.getReBlendTime(),upload.getReHandleTime());

	            if (exists) {
	                errorList.add("Compound already exists , " + (currentRow.getRowNum() + 1));
	                continue;
	            }

	            upload.setCreatedBy(employeeId);
	            upload.setStatus("1");
	            upload.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
	            upload.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

	            compoundDataRepository.save(upload);
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
