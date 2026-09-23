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
import web.minda.project.entity.PackingCustomerArticleMapping;
import web.minda.project.entity.PackingCustomerDetails;
import web.minda.project.entity.ProductionArticleMaster;
import web.minda.project.helper.ExcelUploadHelper;
import web.minda.project.repositories.PackingCustomerArticleMappingRepository;
import web.minda.project.repositories.PackingCustomerDetailsRepository;
import web.minda.project.repositories.ProductionArticleMasterRepository;
import web.minda.project.service.DateTimeService;

@RestController
@RequestMapping("/Controllers")
public class PackingCustomerArticleMappingController {
	@Autowired
	PackingCustomerArticleMappingRepository packingCustomerArticleMappingRepository;
	PackingCustomerArticleMapping masterObject = new PackingCustomerArticleMapping();

	@Autowired
	PackingCustomerDetailsRepository packingCustomerDetailsRepository;
	PackingCustomerDetails packingCustomerDetails = new PackingCustomerDetails();

	@Autowired
	ProductionArticleMasterRepository productionArticleMasterRepository;
	ProductionArticleMaster productionArticleMaster = new ProductionArticleMaster();

	@Autowired
	private DateTimeService dateTimeService;

	@PostMapping("/insertPackingCustomerArticleMapping")
	public ResponseEntity<Object> insertPackingCustomerArticleMapping(
			@RequestBody PackingCustomerArticleMapping jsonObject) {

		try {

			Optional<PackingCustomerDetails> customerOpt = packingCustomerDetailsRepository
					.findByCustomerName(jsonObject.getPackingCustomerDetails().getCustomerName());

			if (customerOpt.isEmpty()) {
				return new ResponseEntity<>("Customer does not exist.", HttpStatus.NOT_ACCEPTABLE);
			}

			Optional<ProductionArticleMaster> articleOpt = productionArticleMasterRepository
					.findByArticle(jsonObject.getProductionArticle().getArticle());

			if (articleOpt.isEmpty()) {
				return new ResponseEntity<>("Article does not exist.", HttpStatus.NOT_ACCEPTABLE);
			}

			ProductionArticleMaster article = articleOpt.get();
			PackingCustomerDetails customer = customerOpt.get();

			boolean mappingExists = packingCustomerArticleMappingRepository
					.existsByProductionArticle_ArticleAndPackingCustomerDetails_CustomerNameAndDestinationCode(
							article.getArticle(), customer.getCustomerName(), jsonObject.getDestinationCode());

			if (mappingExists) {
				return new ResponseEntity<>("Data already exist.", HttpStatus.NOT_ACCEPTABLE);
			}

			jsonObject.setProductionArticle(article);
			jsonObject.setPackingCustomerDetails(customer);

			jsonObject.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
			jsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

			packingCustomerArticleMappingRepository.save(jsonObject);

			return new ResponseEntity<>("Data added successfully.", HttpStatus.OK);

		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("Something went wrong.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/editPackingCustomerArticleMapping")
	public ResponseEntity<Object> editPackingCustomerArticleMapping(
			@RequestBody PackingCustomerArticleMapping jsonObject) {

		try {

			if (jsonObject.getPackingCustomerArticleMappingId() == null) {
				return new ResponseEntity<>("Mapping Id not found.", HttpStatus.NOT_ACCEPTABLE);
			}

			Optional<PackingCustomerDetails> customerOpt = packingCustomerDetailsRepository
					.findByCustomerName(jsonObject.getPackingCustomerDetails().getCustomerName());

			if (customerOpt.isEmpty()) {
				return new ResponseEntity<>("Customer does not exist.", HttpStatus.NOT_ACCEPTABLE);
			}

			Optional<ProductionArticleMaster> articleOpt = productionArticleMasterRepository
					.findByArticle(jsonObject.getProductionArticle().getArticle());

			if (articleOpt.isEmpty()) {
				return new ResponseEntity<>("Article does not exist.", HttpStatus.NOT_ACCEPTABLE);
			}

			ProductionArticleMaster article = articleOpt.get();
			PackingCustomerDetails customer = customerOpt.get();

			boolean mappingExists = packingCustomerArticleMappingRepository
					.existsByProductionArticle_ArticleAndPackingCustomerDetails_CustomerNameAndDestinationCodeAndPackingCustomerArticleMappingIdNot(
							article.getArticle(), customer.getCustomerName(), jsonObject.getDestinationCode(),
							jsonObject.getPackingCustomerArticleMappingId());

			if (mappingExists) {
				return new ResponseEntity<>("Data already exist.", HttpStatus.NOT_ACCEPTABLE);
			}

			jsonObject.setProductionArticle(article);
			jsonObject.setPackingCustomerDetails(customer);

			jsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

			packingCustomerArticleMappingRepository.save(jsonObject);

			return new ResponseEntity<>("Data updated successfully.", HttpStatus.OK);

		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/deletePackingCustomerArticleMapping/{id}")
	public ResponseEntity<Object> deletePackingCustomerArticleMapping(@PathVariable Long id) {
		try {
			this.packingCustomerArticleMappingRepository.deleteById(id);
			return new ResponseEntity<Object>("Data deleted successfully", HttpStatus.OK);
		} catch (DataIntegrityViolationException e) {
			Optional<PackingCustomerArticleMapping> object = this.packingCustomerArticleMappingRepository.findById(id);
			return new ResponseEntity<Object>("Unable to delete Data due to mapping" + object, HttpStatus.CONFLICT);
		} catch (Exception e) {
			return new ResponseEntity<Object>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/download/template/packingCustomerArticleMapping")
	public void productionArticleRouteTemplate(HttpServletResponse response) throws IOException {
		response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		ServletOutputStream outputStream = response.getOutputStream();
		String[] headerList = new String[] { "Article", "Customer Name", "Destination Code" };
		int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256 };
		ByteArrayInputStream excelFile = ExcelController.generateExcelTemplate(headerList, COLUMN_WIDTHS,
				"PackingCustomerArticleMapping");
		response.getOutputStream().write(excelFile.readAllBytes());
		outputStream.flush();
	}

	@GetMapping("/download/data/packingCustomerArticleMapping")
	public void exporproductionArticleRouteData(HttpServletResponse response) throws IOException {
		try {
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
			List<PackingCustomerArticleMapping> list = this.packingCustomerArticleMappingRepository.getalldata();
			String[] headerList = new String[] { "Article", "Customer Name", "Destination Code", "Status", "Created By",
					"Date & Time" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256 };

			List<Function<PackingCustomerArticleMapping, Object>> getters = Arrays.asList(
					article -> article.getProductionArticle() != null ? article.getProductionArticle().getArticle()
							: "",
					customer -> customer.getPackingCustomerDetails() != null
							? customer.getPackingCustomerDetails().getCustomerName()
							: "",
					PackingCustomerArticleMapping::getDestinationCode, PackingCustomerArticleMapping::getStatus,
					PackingCustomerArticleMapping::getCreatedBy, PackingCustomerArticleMapping::getDateTimeModified);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(list, getters, headerList, COLUMN_WIDTHS,
					"PackingCustomerArticleMapping");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@PostMapping("/download/data/packingCustomerArticleMapping")
	public void exportToExcel(HttpServletResponse response, @RequestBody PackingCustomerArticleMapping jsonObject)
			throws IOException {
		try {
			// Set the content type to Excel file
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

			// Fetch data from the repository as a List<PlantMaster>
			List<PackingCustomerArticleMapping> listObject = this.packingCustomerArticleMappingRepository
					.getAllPackingCustomerArticleMappingMaster(jsonObject.getProductionArticle().getArticle(),
							jsonObject.getPackingCustomerDetails().getCustomerName(), jsonObject.getDestinationCode(),
							jsonObject.getStatus(), jsonObject.getCreatedBy());

			String[] headerList = new String[] { "Article", "Customer Name", "Destination Code", "Status", "Created By",
					"Date & Time" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256 };

			List<Function<PackingCustomerArticleMapping, Object>> getters = Arrays.asList(
					article -> article.getProductionArticle() != null ? article.getProductionArticle().getArticle()
							: "",
					customer -> customer.getPackingCustomerDetails() != null
							? customer.getPackingCustomerDetails().getCustomerName()
							: "",
					PackingCustomerArticleMapping::getDestinationCode, PackingCustomerArticleMapping::getStatus,
					PackingCustomerArticleMapping::getCreatedBy, PackingCustomerArticleMapping::getDateTimeModified);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(listObject, getters, headerList, COLUMN_WIDTHS,
					"PackingCustomerArticleMapping");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();

		}
	}

	@PostMapping("/getLikepackingCustomerArticleMapping/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getLikepackingCustomerArticleMapping(@PathVariable("pageNum") int page,
			@PathVariable("pageSize") int pageSize, @RequestBody PackingCustomerArticleMapping jsonObject) {

		try {
			System.out.println(jsonObject);
			Pageable pageable = PageRequest.of(page, pageSize);
			Page<PackingCustomerArticleMapping> object = this.packingCustomerArticleMappingRepository
					.getLikePackingCustomerArticleMapping(jsonObject.getProductionArticle().getArticle(),
							jsonObject.getPackingCustomerDetails().getCustomerName(), jsonObject.getDestinationCode(),
							jsonObject.getStatus(), jsonObject.getCreatedBy(), pageable);
			System.out.println(object);
			return new ResponseEntity<Object>(object, HttpStatus.OK);

		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<Object>("ng", HttpStatus.OK);
		}
	}

	@PostMapping("/uploadpackingCustomerArticleMapping/{employeeId}")
	public ResponseEntity<Object> uploadpackingCustomerArticleMapping(@RequestParam("file") MultipartFile file,
			@PathVariable("employeeId") String employeeId) {

		if (!"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet".equals(file.getContentType())) {
			return new ResponseEntity<>("Please upload XLSX file.", HttpStatus.BAD_REQUEST);
		}

		List<String> errorList = new ArrayList<>();
		errorList.add("Errors , Row");

		try (InputStream is = file.getInputStream();
				OPCPackage opcPackage = OPCPackage.open(is);
				XSSFWorkbook workbook = new XSSFWorkbook(opcPackage)) {

			XSSFSheet sheet = workbook.getSheet("PackingCustomerArticleMapping");

			if (sheet == null) {
				return new ResponseEntity<>("PackingCustomerArticleMapping sheet not found.", HttpStatus.NOT_FOUND);
			}

			Iterator<Row> rows = sheet.iterator();

			if (rows.hasNext())
				rows.next();

			while (rows.hasNext()) {

				Row currentRow = rows.next();

				if (currentRow == null || currentRow.getLastCellNum() <= 0) {
					continue;
				}
				PackingCustomerArticleMapping upload = new PackingCustomerArticleMapping();
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
						Optional<PackingCustomerDetails> customerOptional = packingCustomerDetailsRepository
								.findByCustomerName(value);
						if (customerOptional.isPresent()) {
							upload.setPackingCustomerDetails(customerOptional.get());
						} else {
							errorList.add("Customer not found , " + (currentRow.getRowNum() + 1));
						}
						break;

					case 2:
						upload.setDestinationCode(value);
						break;

					default:
						break;
					}
				}

				if (upload.getProductionArticle() == null) {
					errorList.add("Article missing , " + (currentRow.getRowNum() + 1));
					continue;
				}

				if (upload.getPackingCustomerDetails() == null) {
					errorList.add("Customer  missing , " + (currentRow.getRowNum() + 1));
					continue;
				}
				boolean exists = packingCustomerArticleMappingRepository
						.existsByProductionArticle_ArticleAndPackingCustomerDetails_CustomerNameAndDestinationCode(

								upload.getProductionArticle().getArticle(),
								upload.getPackingCustomerDetails().getCustomerName(), upload.getDestinationCode());
				if (exists) {
					errorList.add("Mapping already exists , " + (currentRow.getRowNum() + 1));
					continue;
				}

				upload.setCreatedBy(employeeId);
				upload.setStatus("1");
				upload.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
				upload.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

				packingCustomerArticleMappingRepository.save(upload);
			}

			Map<String, Object> responseMap = new HashMap<>();
			responseMap.put("message", "Excel uploaded successfully.");
			responseMap.put("errorList", errorList);

			return new ResponseEntity<>(responseMap, HttpStatus.OK);

		} catch (Exception e) {

			return new ResponseEntity<>("Upload failed : " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
