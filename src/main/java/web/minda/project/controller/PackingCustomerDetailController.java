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
import web.minda.project.entity.PackingCustomerDetails;
import web.minda.project.entity.ProductionArticleDetails;
import web.minda.project.helper.ExcelUploadHelper;
import web.minda.project.repositories.PackingCustomerDetailsRepository;
import web.minda.project.service.DateTimeService;

@RestController
@RequestMapping("/Controllers")
public class PackingCustomerDetailController  {
	@Autowired
	PackingCustomerDetailsRepository packingCustomerDetailsRepository;
	PackingCustomerDetails masterObject = new PackingCustomerDetails();
	
	@Autowired
	private DateTimeService dateTimeService;

	@PostMapping("/insertPackingCustomerDetails")
	public ResponseEntity<Object> insertPackingCustomerDetails(@RequestBody PackingCustomerDetails jsonObject) {
		try {
			if (!this.packingCustomerDetailsRepository.existsByCustomerNameAndDestinationCode(jsonObject.getCustomerName(),jsonObject.getDestinationCode())) {

				jsonObject.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
				jsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

				this.packingCustomerDetailsRepository.save(jsonObject);
				return new ResponseEntity<>("Data added successfully.", HttpStatus.OK);
			} else {
				return new ResponseEntity<>("Data code already exist.", HttpStatus.NOT_ACCEPTABLE);
			}
		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<>("Something went wrong.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/editPackingCustomerDetails")
	public ResponseEntity<Object> editPackingCustomerDetails(@RequestBody PackingCustomerDetails jsonObject) {

	    try {

	        if (jsonObject.getPackingCustomerDetailId() == null) {
	            return new ResponseEntity<>("Data code not found.", HttpStatus.NOT_ACCEPTABLE);
	        }

	        boolean exists = packingCustomerDetailsRepository
	                .existsByCustomerNameAndDestinationCodeAndPackingCustomerDetailIdNot(
	                        jsonObject.getCustomerName(),
	                        jsonObject.getDestinationCode(),
	                        jsonObject.getPackingCustomerDetailId());

	        if (exists) {
	            return new ResponseEntity<>("Data already exist.", HttpStatus.NOT_ACCEPTABLE);
	        }

	        jsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

	        packingCustomerDetailsRepository.save(jsonObject);

	        return new ResponseEntity<>("Data updated successfully.", HttpStatus.OK);

	    } catch (Exception e) {
	        return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}

	
	@DeleteMapping("/deletePackingCustomerDetail/{id}")
	public ResponseEntity<Object> deletePackingCustomerDetail(@PathVariable Long id) {
		try {
			this.packingCustomerDetailsRepository.deleteById(id);
			return new ResponseEntity<Object>("Data deleted successfully", HttpStatus.OK);
		} catch (DataIntegrityViolationException e) {
			Optional<PackingCustomerDetails> object = this.packingCustomerDetailsRepository.findById(id);
			return new ResponseEntity<Object>(
					"Unable to delete Data due to mapping"+object,
					HttpStatus.CONFLICT);
		} catch (Exception e) {
			return new ResponseEntity<Object>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}




	@GetMapping("/download/template/packingCustomerDetail")
	public void processTemplate(HttpServletResponse response) throws IOException {
		response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		ServletOutputStream outputStream = response.getOutputStream();
		String[] headerList = new String[] { "Customer Name", "Description", "Destination Code","Address1","Address2","Address3","Address4"};
		int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256 };
		ByteArrayInputStream excelFile = ExcelController.generateExcelTemplate(headerList, COLUMN_WIDTHS,
				"PackingCustomerDetail");
		response.getOutputStream().write(excelFile.readAllBytes());
		outputStream.flush();
	}

	@GetMapping("/download/data/packingCustomerDetail")
	public void exportprocessData(HttpServletResponse response) throws IOException {
		try {
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
			List<PackingCustomerDetails> list = this.packingCustomerDetailsRepository.getalldata();
			String[] headerList = new String[] { "Customer Name", "Description", "Destination Code","Address1","Address2","Address3","Address4","Status", "Created By", "Date & Time" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256 };

			List<Function<PackingCustomerDetails, Object>> getters = Arrays.asList(PackingCustomerDetails::getCustomerName,
					PackingCustomerDetails::getDescription, PackingCustomerDetails::getDestinationCode,PackingCustomerDetails::getAddress1,PackingCustomerDetails::getAddress2,
					PackingCustomerDetails::getAddress3,PackingCustomerDetails::getAddress4,
					PackingCustomerDetails::getStatus, PackingCustomerDetails::getCreatedBy, PackingCustomerDetails::getDateTimeModified);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(list, getters, headerList,
					COLUMN_WIDTHS, "PackingCustomerDetail");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	
	
	@PostMapping("/download/data/packingCustomerDetail")
	public void exportToExcel(HttpServletResponse response, @RequestBody PackingCustomerDetails jsonObject)
			throws IOException {
		try {
			// Set the content type to Excel file
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

			// Fetch data from the repository as a List<PlantMaster>
			List<PackingCustomerDetails> listObject = this.packingCustomerDetailsRepository
					.getAllPackingCustomerDetailsMaster(jsonObject.getCustomerName(),
							jsonObject.getDescription(), jsonObject.getDestinationCode(),jsonObject.getAddress1(),jsonObject.getAddress2(),jsonObject.getAddress3(),jsonObject.getAddress4(),
							jsonObject.getCreatedBy());

			String[] headerList = new String[] { "Customer Name", "Description", "Destination Code","Address1","Address2","Address3","Address4","Status", "Created By", "Date & Time" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256 };

			List<Function<PackingCustomerDetails, Object>> getters = Arrays.asList(PackingCustomerDetails::getCustomerName,
					PackingCustomerDetails::getDescription, PackingCustomerDetails::getDestinationCode,PackingCustomerDetails::getAddress1,PackingCustomerDetails::getAddress2,
					PackingCustomerDetails::getAddress3,PackingCustomerDetails::getAddress4,
					PackingCustomerDetails::getStatus, PackingCustomerDetails::getCreatedBy, PackingCustomerDetails::getDateTimeModified);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(listObject, getters, headerList,
					COLUMN_WIDTHS, "PackingCustomerDetail");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();

		}
	}

	@PostMapping("/getLikepackingCustomerDetail/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getLikepackingCustomerDetail(@PathVariable("pageNum") int page,
			@PathVariable("pageSize") int pageSize, @RequestBody PackingCustomerDetails jsonObject) {

		try {
			System.out.println(jsonObject);
			Pageable pageable = PageRequest.of(page, pageSize);
			Page<PackingCustomerDetails> object = this.packingCustomerDetailsRepository.getLikePackingCustomerDetails(jsonObject.getCustomerName(),
					jsonObject.getDescription(), jsonObject.getDestinationCode(),jsonObject.getAddress1(),jsonObject.getAddress2(),jsonObject.getAddress3(),jsonObject.getAddress4(),
					jsonObject.getCreatedBy(), pageable);
			System.out.println(object);
			return new ResponseEntity<Object>(object, HttpStatus.OK);

		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<Object>("ng", HttpStatus.OK);
		}
	}
	
	
	
	@PostMapping("/uploadpackingCustomerDetail/{employeeId}")
	public ResponseEntity<Object> uploadpackingCustomerDetail(@RequestParam("file") MultipartFile file,
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

	        XSSFSheet sheet = workbook.getSheet("PackingCustomerDetail");

	        if (sheet == null) {
	            return new ResponseEntity<>("PackingCustomerDetail sheet not found.",
	                    HttpStatus.NOT_FOUND);
	        }

	        Iterator<Row> rows = sheet.iterator();

	        if (rows.hasNext()) rows.next();

	        while (rows.hasNext()) {

	            Row currentRow = rows.next();

	            if (currentRow == null || currentRow.getLastCellNum() <= 0) {
	                continue;
	            }

	            PackingCustomerDetails upload = new PackingCustomerDetails();

	            for (int cellIdx = 0; cellIdx < currentRow.getLastCellNum(); cellIdx++) {

	                Cell currentCell = currentRow.getCell(cellIdx);

	                String value = ExcelUploadHelper.getStringCellValue(currentCell).trim();

	                switch (cellIdx) {

	                case 0:
	                    upload.setCustomerName(value);
	                    break;

	                case 1:
	                    upload.setDescription(value);
	                    break;

	                case 2:
	                    upload.setDestinationCode(value);
	                    break;

	                case 3:
	                    upload.setAddress1(value);
	                    break;

	                case 4:
	                    upload.setAddress2(value);
	                    break;

	                case 5:
	                    upload.setAddress3(value);
	                    break;
	                  
	                case 6:
	                    upload.setAddress4(value);
	                    break;


	                default:
	                    break;
	                }
	            }


	            if (upload.getCustomerName() == null || upload.getCustomerName().isEmpty()) {
	                errorList.add("Customer Name missing , " + (currentRow.getRowNum() + 1));
	                continue;
	            }

	            boolean exists = packingCustomerDetailsRepository
	                    .existsByCustomerNameAndDestinationCode(
	                    		upload.getCustomerName(),upload.getDestinationCode());

	            if (exists) {
	                errorList.add("Mapping already exists , " + (currentRow.getRowNum() + 1));
	                continue;
	            }

	            upload.setCreatedBy(employeeId);
	            upload.setStatus("1");
	            upload.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
	            upload.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

	            packingCustomerDetailsRepository.save(upload);
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
