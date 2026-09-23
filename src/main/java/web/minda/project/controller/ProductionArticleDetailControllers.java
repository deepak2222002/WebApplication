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
import web.minda.project.entity.ProductionArticleBom;
import web.minda.project.entity.ProductionArticleDetails;
import web.minda.project.entity.ProductionArticleMaster;
import web.minda.project.entity.ProductionArticleRoute;
import web.minda.project.helper.ExcelUploadHelper;
import web.minda.project.repositories.ProductionArticleDetailsRepository;
import web.minda.project.repositories.ProductionArticleMasterRepository;
import web.minda.project.service.DateTimeService;

@RestController
@RequestMapping("/Controllers")
public class ProductionArticleDetailControllers {

	@Autowired
	ProductionArticleDetailsRepository productionArticleDetailsRepository;
	ProductionArticleDetails masterObject = new ProductionArticleDetails();

	@Autowired
	ProductionArticleMasterRepository productionArticleMasterRepository;
	ProductionArticleMaster productionArticleMaster = new ProductionArticleMaster();

	@Autowired
	private DateTimeService dateTimeService;

	@PostMapping("/insertProductionArticleDetail")
	public ResponseEntity<Object> insertProductionArticleDetail(@RequestBody ProductionArticleDetails jsonObject) {

		try {

			Optional<ProductionArticleMaster> articleOpt = productionArticleMasterRepository
					.findByArticle(jsonObject.getProductionArticle().getArticle());

			if (articleOpt.isEmpty()) {
				return new ResponseEntity<>("Article does not exist.", HttpStatus.NOT_ACCEPTABLE);
			}

			ProductionArticleMaster article = articleOpt.get();

			boolean dataExist = productionArticleDetailsRepository
					.existsByProductionArticle_ArticleAndCustomerArticleAndMouldAndColdRunnerAndWeightAndImagePathAndSimilarLooking(
							article.getArticle(), jsonObject.getCustomerArticle(), jsonObject.getMould(),
							jsonObject.getColdRunner(), jsonObject.getWeight(), jsonObject.getImagePath(),
							jsonObject.getSimilarLooking());

			if (dataExist) {
				return new ResponseEntity<>("Data Already exist.", HttpStatus.NOT_ACCEPTABLE);
			}

			jsonObject.setProductionArticle(article);

			jsonObject.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
			jsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

			productionArticleDetailsRepository.save(jsonObject);

			return new ResponseEntity<>("Data added successfully.", HttpStatus.OK);

		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("Something went wrong.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/editProductionArticleDetail")
	public ResponseEntity<Object> editProductionArticleDetail(@RequestBody ProductionArticleDetails jsonObject) {

		try {

			if (jsonObject.getProductionArticleDetailId() == null) {
				return new ResponseEntity<>("CustomerArticle ID missing.", HttpStatus.NOT_ACCEPTABLE);
			}

			Optional<ProductionArticleDetails> detailOpt = productionArticleDetailsRepository
					.findById(jsonObject.getProductionArticleDetailId());

			if (detailOpt.isEmpty()) {
				return new ResponseEntity<>("Record not found.", HttpStatus.NOT_ACCEPTABLE);
			}

			Optional<ProductionArticleMaster> articleOpt = productionArticleMasterRepository
					.findByArticle(jsonObject.getProductionArticle().getArticle());

			if (articleOpt.isEmpty()) {
				return new ResponseEntity<>("Article not found.", HttpStatus.NOT_ACCEPTABLE);
			}

			ProductionArticleMaster article = articleOpt.get();

			boolean dataExist = productionArticleDetailsRepository
					.existsByProductionArticle_ArticleAndCustomerArticleAndMouldAndColdRunnerAndWeightAndImagePathAndSimilarLookingAndProductionArticleDetailIdNot(
							article.getArticle(), jsonObject.getCustomerArticle(), jsonObject.getMould(),
							jsonObject.getColdRunner(), jsonObject.getWeight(), jsonObject.getImagePath(),
							jsonObject.getSimilarLooking(), jsonObject.getProductionArticleDetailId());

			if (dataExist) {
				return new ResponseEntity<>("Data Already exist.", HttpStatus.NOT_ACCEPTABLE);
			}

			ProductionArticleDetails detail = detailOpt.get();

			detail.setProductionArticle(article);
			detail.setCustomerArticle(jsonObject.getCustomerArticle());
			detail.setMould(jsonObject.getMould());
			detail.setColdRunner(jsonObject.getColdRunner());
			detail.setWeight(jsonObject.getWeight());
			detail.setImagePath(jsonObject.getImagePath());
			detail.setSimilarLooking(jsonObject.getSimilarLooking());
			detail.setStatus(jsonObject.getStatus());

			detail.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

			productionArticleDetailsRepository.save(detail);

			return new ResponseEntity<>("Data updated successfully.", HttpStatus.OK);

		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/deleteProductionArticleDetail/{id}")
	public ResponseEntity<Object> deleteproductionArticleBom(@PathVariable Long id) {
		try {
			this.productionArticleDetailsRepository.deleteById(id);
			return new ResponseEntity<Object>("Data deleted successfully", HttpStatus.OK);
		} catch (DataIntegrityViolationException e) {
			Optional<ProductionArticleDetails> object = this.productionArticleDetailsRepository.findById(id);
			return new ResponseEntity<Object>("Unable to delete Data due to mapping", HttpStatus.CONFLICT);
		} catch (Exception e) {
			return new ResponseEntity<Object>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/download/template/productionArticleDetail")
	public void productionArticleBomTemplate(HttpServletResponse response) throws IOException {
		response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		ServletOutputStream outputStream = response.getOutputStream();
		String[] headerList = new String[] { "Article", "Customer Article", "Mould", "Cold Runner", "Weight",
				"Image Path", "Similiar Looking" };
		int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256 };
		ByteArrayInputStream excelFile = ExcelController.generateExcelTemplate(headerList, COLUMN_WIDTHS,
				"ProductionArticleDetail");
		response.getOutputStream().write(excelFile.readAllBytes());
		outputStream.flush();
	}

//	@GetMapping("/download/data/productionArticleDetail")
//	public void exportproductionArticleBomData(HttpServletResponse response) throws IOException {
//		try {
//			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
//			List<ProductionArticleDetails> list = this.productionArticleDetailsRepository.getalldata();
//			String[] headerList = new String[] { "Article", "Customer Article", "Mould", "Cold Runner", "Weight",
//					"Image Path", "Similiar Looking", "Created By", "Date & Time" };
//			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
//					25 * 256, 30 * 256 };
//
//			List<Function<ProductionArticleDetails, Object>> getters = Arrays.asList(
//					article -> article.getProductionArticle().getArticle(),
//					ProductionArticleDetails::getCustomerArticle, ProductionArticleDetails::getMould,
//					ProductionArticleDetails::getColdRunner, ProductionArticleDetails::getWeight,
//					ProductionArticleDetails::getImagePath, ProductionArticleDetails::getSimilarLooking,
//					ProductionArticleDetails::getStatus, ProductionArticleDetails::getCreatedBy,
//					ProductionArticleDetails::getDateTimeModified);
//
//			ByteArrayInputStream excelFile = ExcelController.generateExcelData(list, getters, headerList, COLUMN_WIDTHS,
//					"ProductionArticleDetail");
//			ServletOutputStream outputStream = response.getOutputStream();
//			response.getOutputStream().write(excelFile.readAllBytes());
//			outputStream.flush();
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//	}

	@PostMapping("/download/data/productionArticleDetail")
	public void exportToExcel(HttpServletResponse response, @RequestBody ProductionArticleDetails jsonObject)
			throws IOException {
		try {
			// Set the content type to Excel file
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

			// Fetch data from the repository as a List<PlantMaster>
			List<ProductionArticleDetails> listObject = this.productionArticleDetailsRepository
					.getAllProductionArticleDetailsMaster(jsonObject.getProductionArticle().getArticle(),
							jsonObject.getCustomerArticle(), jsonObject.getMould(), jsonObject.getColdRunner(),
							jsonObject.getWeight(), jsonObject.getImagePath(), jsonObject.getSimilarLooking(),
							jsonObject.getCreatedBy());

			String[] headerList = new String[] { "Article", "Customer Article", "Mould", "Cold Runner", "Weight",
					"Image Path", "Similiar Looking", "Created By", "Date & Time" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256 };

			List<Function<ProductionArticleDetails, Object>> getters = Arrays.asList(
					article -> article.getProductionArticle().getArticle(),
					ProductionArticleDetails::getCustomerArticle, ProductionArticleDetails::getMould,
					ProductionArticleDetails::getColdRunner, ProductionArticleDetails::getWeight,
					ProductionArticleDetails::getImagePath, ProductionArticleDetails::getSimilarLooking,
					ProductionArticleDetails::getStatus, ProductionArticleDetails::getCreatedBy,
					ProductionArticleDetails::getDateTimeModified);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(listObject, getters, headerList,
					COLUMN_WIDTHS, "ProductionArticleDetail");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();

		}
	}

	@PostMapping("/getLikeProductionArticleDetail/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getLikeProductionArticleDetail(@PathVariable("pageNum") int page,
			@PathVariable("pageSize") int pageSize, @RequestBody ProductionArticleDetails jsonObject) {

		try {
			System.out.println(jsonObject);
			Pageable pageable = PageRequest.of(page, pageSize);
			Page<ProductionArticleDetails> object = this.productionArticleDetailsRepository
					.getLikeProductionArticleDetails(jsonObject.getProductionArticle().getArticle(),
							jsonObject.getCustomerArticle(), jsonObject.getMould(), jsonObject.getColdRunner(),
							jsonObject.getWeight(), jsonObject.getImagePath(), jsonObject.getSimilarLooking(),
							jsonObject.getCreatedBy(), pageable);
			System.out.println(object);
			return new ResponseEntity<Object>(object, HttpStatus.OK);

		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<Object>("ng", HttpStatus.OK);
		}
	}

	@PostMapping("/uploadproductionarticledetail/{employeeId}")
	public ResponseEntity<Object> uploadproductionarticledetail(@RequestParam("file") MultipartFile file,
			@PathVariable("employeeId") String employeeId) {

		if (!"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet".equals(file.getContentType())) {
			return new ResponseEntity<>("Please upload XLSX file.", HttpStatus.BAD_REQUEST);
		}

		List<String> errorList = new ArrayList<>();
		errorList.add("Errors , Row");

		try (InputStream is = file.getInputStream();
				OPCPackage opcPackage = OPCPackage.open(is);
				XSSFWorkbook workbook = new XSSFWorkbook(opcPackage)) {

			XSSFSheet sheet = workbook.getSheet("ProductionArticleDetail");

			if (sheet == null) {
				return new ResponseEntity<>("ProductionArticleDetail sheet not found.", HttpStatus.NOT_FOUND);
			}

			Iterator<Row> rows = sheet.iterator();

			if (rows.hasNext())
				rows.next();

			while (rows.hasNext()) {

				Row currentRow = rows.next();

				if (currentRow == null || currentRow.getLastCellNum() <= 0) {
					continue;
				}
				ProductionArticleDetails upload = new ProductionArticleDetails();
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
						upload.setCustomerArticle(value);
						break;
					case 2:
						upload.setMould(value);
						break;
					case 3:
						upload.setColdRunner(value);
						break;
					case 4:
						upload.setWeight(value);
						break;
					case 5:
						upload.setImagePath(value);
						break;
					case 6:
						upload.setSimilarLooking(value);
						break;
					default:
						break;
					}
				}
				if (upload.getProductionArticle() == null) {
					errorList.add("Article  missing , " + (currentRow.getRowNum() + 1));
					continue;
				}
				if (upload.getCustomerArticle() == null || upload.getCustomerArticle().isEmpty()) {
					errorList.add("CustomerArticle missing , " + (currentRow.getRowNum() + 1));
					continue;
				}

				boolean exists = productionArticleDetailsRepository.existsByProductionArticle_ArticleAndCustomerArticle(
						upload.getProductionArticle().getArticle(), upload.getCustomerArticle());
				if (exists) {
					errorList.add("Mapping already exists , " + (currentRow.getRowNum() + 1));
					continue;
				}

				upload.setCreatedBy(employeeId);
				upload.setStatus("1");
				upload.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
				upload.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

				productionArticleDetailsRepository.save(upload);
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
