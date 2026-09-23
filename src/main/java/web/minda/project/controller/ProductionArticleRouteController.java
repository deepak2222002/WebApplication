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
import web.minda.project.dto.ProcessRowDTO;
import web.minda.project.dto.ProcessSaveDTO;
import web.minda.project.entity.ProcessMaster;
import web.minda.project.entity.ProductionArticleMaster;
import web.minda.project.entity.ProductionArticleRoute;
import web.minda.project.entity.StoreCategoryMapping;
import web.minda.project.entity.StoreMaterialCategoryMaster;
import web.minda.project.helper.ExcelUploadHelper;
import web.minda.project.repositories.ProcessMasterRepository;
import web.minda.project.repositories.ProductionArticleMasterRepository;
import web.minda.project.repositories.ProductionArticleRouteRepository;

import web.minda.project.service.DateTimeService;

@RestController
@RequestMapping("/Controllers")
public class ProductionArticleRouteController {

	@Autowired
	ProductionArticleRouteRepository productionArticleRouteRepository;
	ProductionArticleRoute masterObject = new ProductionArticleRoute();

	@Autowired
	ProcessMasterRepository processMasterRepository;
	ProcessMaster processMaster = new ProcessMaster();

	@Autowired
	ProductionArticleMasterRepository productionArticleMasterRepository;
	ProductionArticleMaster productionArticleMaster = new ProductionArticleMaster();

	@Autowired
	private DateTimeService dateTimeService;
	
	
	@PostMapping("/saveArticleProcesses")
	public ResponseEntity<?> saveArticleProcesses(@RequestBody ProcessSaveDTO dto) {

	    ProductionArticleMaster article =
	    		productionArticleMasterRepository.findById(dto.getArticleId())
	            .orElseThrow(() -> new RuntimeException("Article not found"));

	    for (ProcessRowDTO row : dto.getProcesses()) {

	        if (row.getProcess() == null || row.getProcess().trim().isEmpty()) {
	            continue;
	        }

	        Optional<ProcessMaster> processMaster = processMasterRepository.findByProcessName(row.getProcess());

	        if (processMaster == null) {
	            throw new RuntimeException("Process not found: " + row.getProcess());
	        }

	        ProductionArticleRoute route = new ProductionArticleRoute();
	        route.setProductionArticle(article);
	        route.setProcess(processMaster.get());

	        route.setScan("0");
	        route.setStatus("1");
	        route.setCreatedBy("111");
	        
	        route.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
	        route.setDateTimeModified(dateTimeService.getCurrentDateAndTime());


	        productionArticleRouteRepository.save(route);
	    }

	    return ResponseEntity.ok("Processes Saved Successfully");
	}
	
	@PutMapping("/updateProcess")
	public ResponseEntity<?> updateProcess(@RequestBody ProductionArticleRoute obj) {

	    ProductionArticleRoute old =
	            productionArticleRouteRepository.findById(obj.getProductionArticleRouteId())
	            .orElseThrow(() -> new RuntimeException("Process Route not found"));

	    if (obj.getProcess() != null && obj.getProcess().getProcessName() != null) {

	        Optional<ProcessMaster> pm =
	                processMasterRepository.findByProcessName(obj.getProcess().getProcessName());

	        if (pm == null) {
	            throw new RuntimeException("Process not found: " + obj.getProcess().getProcessName());
	        }

	        old.setProcess(pm.get());
	    }

	    old.setStatus(obj.getStatus());
	    old.setDateTimeModified(java.time.LocalDateTime.now().toString());

	    productionArticleRouteRepository.save(old);

	    return ResponseEntity.ok("Process Updated Successfully");
	}
	
	@DeleteMapping("/deleteProcess/{id}")
	public ResponseEntity<?> deleteProcess(@PathVariable Long id) {

	    productionArticleRouteRepository.deleteById(id);

	    return ResponseEntity.ok("Process Deleted Successfully");
	}
	
	
	@GetMapping("/getProcessByArticle/{articleId}")
	public ResponseEntity<?> getProcessByArticle(@PathVariable Long articleId) {

	    List<ProductionArticleRoute> list =
	            productionArticleRouteRepository.findByProductionArticleProductionArticleId(articleId);

	    return ResponseEntity.ok(list);
	}

	@PostMapping("/insertProductionArticleRouteMaster")
	public ResponseEntity<Object> insertProductionArticleRouteMaster(@RequestBody ProductionArticleRoute jsonObject) {

		try {

			Optional<ProcessMaster> processOpt = processMasterRepository
					.findByProcessName(jsonObject.getProcess().getProcessName());

			if (processOpt.isEmpty()) {
				return new ResponseEntity<>("Process does not exist.", HttpStatus.NOT_ACCEPTABLE);
			}

			Optional<ProductionArticleMaster> articleOpt = productionArticleMasterRepository
					.findByArticle(jsonObject.getProductionArticle().getArticle());

			if (articleOpt.isEmpty()) {
				return new ResponseEntity<>("Article does not exist.", HttpStatus.NOT_ACCEPTABLE);
			}

			ProcessMaster process = processOpt.get();
			ProductionArticleMaster article = articleOpt.get();

			boolean mappingExists = productionArticleRouteRepository
					.existsByProcess_ProcessNameAndProductionArticle_Article(process.getProcessName(),
							article.getArticle());

			if (mappingExists) {
				return new ResponseEntity<>("Data already exist.", HttpStatus.NOT_ACCEPTABLE);
			}

			jsonObject.setProcess(process);
			jsonObject.setProductionArticle(article);

			jsonObject.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
			jsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

			productionArticleRouteRepository.save(jsonObject);

			return new ResponseEntity<>("Data added successfully.", HttpStatus.OK);

		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("Something went wrong.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/editProductionArticleRouteMaster")
	public ResponseEntity<Object> editProductionArticleRouteMaster(@RequestBody ProductionArticleRoute jsonObject) {

		try {

			if (jsonObject.getProductionArticleRouteId() == null) {
				return new ResponseEntity<>("Mapping Id not found.", HttpStatus.NOT_ACCEPTABLE);
			}

			Optional<ProductionArticleRoute> routeOpt = productionArticleRouteRepository
					.findById(jsonObject.getProductionArticleRouteId());

			if (routeOpt.isEmpty()) {
				return new ResponseEntity<>("Mapping not found.", HttpStatus.NOT_ACCEPTABLE);
			}

			Optional<ProcessMaster> processOpt = processMasterRepository
					.findByProcessName(jsonObject.getProcess().getProcessName());

			if (processOpt.isEmpty()) {
				return new ResponseEntity<>("Process does not exist.", HttpStatus.NOT_ACCEPTABLE);
			}

			Optional<ProductionArticleMaster> articleOpt = productionArticleMasterRepository
					.findByArticle(jsonObject.getProductionArticle().getArticle());

			if (articleOpt.isEmpty()) {
				return new ResponseEntity<>("Article does not exist.", HttpStatus.NOT_ACCEPTABLE);
			}

			ProcessMaster process = processOpt.get();
			ProductionArticleMaster article = articleOpt.get();

			boolean mappingExists = productionArticleRouteRepository
					.existsByProcess_ProcessNameAndProductionArticle_ArticleAndProductionArticleRouteIdNot(
							process.getProcessName(), article.getArticle(), jsonObject.getProductionArticleRouteId());

			if (mappingExists) {
				return new ResponseEntity<>("Data already exist.", HttpStatus.NOT_ACCEPTABLE);
			}

			ProductionArticleRoute route = routeOpt.get();

			route.setProcess(process);
			route.setProductionArticle(article);
			route.setScan(jsonObject.getScan());
			route.setStatus(jsonObject.getStatus());

			route.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

			productionArticleRouteRepository.save(route);

			return new ResponseEntity<>("Data updated successfully.", HttpStatus.OK);

		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/deleteProductionArticleRoute/{id}")
	public ResponseEntity<Object> deleteProductionArticleRoute(@PathVariable Long id) {
		try {
			this.productionArticleRouteRepository.deleteById(id);
			return new ResponseEntity<Object>("Data deleted successfully", HttpStatus.OK);
		} catch (DataIntegrityViolationException e) {
			Optional<ProductionArticleRoute> object = this.productionArticleRouteRepository.findById(id);
			return new ResponseEntity<Object>("Unable to delete Data due to mapping", HttpStatus.CONFLICT);
		} catch (Exception e) {
			return new ResponseEntity<Object>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/download/template/productionArticleRoute")
	public void productionArticleRouteTemplate(HttpServletResponse response) throws IOException {
		response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		ServletOutputStream outputStream = response.getOutputStream();
		String[] headerList = new String[] { "Article", "Process Name", "Scan" };
		int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256 };
		ByteArrayInputStream excelFile = ExcelController.generateExcelTemplate(headerList, COLUMN_WIDTHS,
				"ProductionArticleRoute");
		response.getOutputStream().write(excelFile.readAllBytes());
		outputStream.flush();
	}
//
//	@GetMapping("/download/data/productionArticleRoute")
//	public void exporproductionArticleRouteData(HttpServletResponse response) throws IOException {
//		try {
//			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
//			List<ProductionArticleRoute> list = this.productionArticleRouteRepository.getalldata();
//			String[] headerList = new String[] { "Article", "Process Name", "Scan", "Status", "Created By",
//					"Date & Time" };
//			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
//					25 * 256, 30 * 256 };
//
//			List<Function<ProductionArticleRoute, Object>> getters = Arrays.asList(
//					article -> article.getProductionArticle() != null ? article.getProductionArticle().getArticle()
//							: "",
//					process -> process.getProcess() != null ? process.getProcess().getProcessName() : "",
//					ProductionArticleRoute::getScan, ProductionArticleRoute::getStatus,
//					ProductionArticleRoute::getCreatedBy, ProductionArticleRoute::getDateTimeModified);
//
//			ByteArrayInputStream excelFile = ExcelController.generateExcelData(list, getters, headerList, COLUMN_WIDTHS,
//					"ProductionArticleRoute");
//			ServletOutputStream outputStream = response.getOutputStream();
//			response.getOutputStream().write(excelFile.readAllBytes());
//			outputStream.flush();
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//	}

	@PostMapping("/download/data/productionArticleRoute")
	public void exportToExcel(HttpServletResponse response, @RequestBody ProductionArticleRoute jsonObject)
			throws IOException {
		try {
			// Set the content type to Excel file
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

			// Fetch data from the repository as a List<PlantMaster>
			List<ProductionArticleRoute> listObject = this.productionArticleRouteRepository
					.getAllProductionArticleRouteMaster(jsonObject.getProductionArticle().getArticle(),
							jsonObject.getProcess().getProcessName(), jsonObject.getScan(), jsonObject.getStatus(),
							jsonObject.getCreatedBy());

			String[] headerList = new String[] { "Article", "Process Name", "Scan", "Status", "Created By",
					"Date & Time" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256 };

			List<Function<ProductionArticleRoute, Object>> getters = Arrays.asList(
					article -> article.getProductionArticle() != null ? article.getProductionArticle().getArticle()
							: "",
					process -> process.getProcess() != null ? process.getProcess().getProcessName() : "",
					ProductionArticleRoute::getScan, ProductionArticleRoute::getStatus,
					ProductionArticleRoute::getCreatedBy, ProductionArticleRoute::getDateTimeModified);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(listObject, getters, headerList,
					COLUMN_WIDTHS, "ProductionArticleRoute");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();

		}
	}

	@PostMapping("/getLikeProductionArticleRoute/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getLikeProductionArticleRoute(@PathVariable("pageNum") int page,
			@PathVariable("pageSize") int pageSize, @RequestBody ProductionArticleRoute jsonObject) {

		try {
			Pageable pageable = PageRequest.of(page, pageSize);
			Page<ProductionArticleRoute> object = this.productionArticleRouteRepository.getLikeProductionArticleRoute(
					jsonObject.getProductionArticle().getArticle(), jsonObject.getProcess().getProcessName(),
					jsonObject.getScan(), jsonObject.getStatus(), jsonObject.getCreatedBy(), pageable);
			System.out.println(object);
			return new ResponseEntity<Object>(object, HttpStatus.OK);

		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<Object>("ng", HttpStatus.OK);
		}
	}

	@PostMapping("/uploadproductionArticleroute/{employeeId}")
	public ResponseEntity<Object> uploadproductionArticleroute(@RequestParam("file") MultipartFile file,
			@PathVariable("employeeId") String employeeId) {

		if (!"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet".equals(file.getContentType())) {
			return new ResponseEntity<>("Please upload XLSX file.", HttpStatus.BAD_REQUEST);
		}

		List<String> errorList = new ArrayList<>();
		errorList.add("Errors , Row");

		try (InputStream is = file.getInputStream();
				OPCPackage opcPackage = OPCPackage.open(is);
				XSSFWorkbook workbook = new XSSFWorkbook(opcPackage)) {

			XSSFSheet sheet = workbook.getSheet("ProductionArticleRoute");

			if (sheet == null) {
				return new ResponseEntity<>("ProductionArticleRoute sheet not found.", HttpStatus.NOT_FOUND);
			}

			Iterator<Row> rows = sheet.iterator();

			if (rows.hasNext())
				rows.next();

			while (rows.hasNext()) {

				Row currentRow = rows.next();

				if (currentRow == null || currentRow.getLastCellNum() <= 0) {
					continue;
				}
				ProductionArticleRoute upload = new ProductionArticleRoute();
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
						Optional<ProcessMaster> processOptional = processMasterRepository.findByProcessName(value);
						if (processOptional.isPresent()) {
							upload.setProcess(processOptional.get());
						} else {
							errorList.add("Process not found , " + (currentRow.getRowNum() + 1));
						}
						break;

					case 2:
						upload.setScan(value);
						break;

					default:
						break;
					}
				}

				if (upload.getProductionArticle() == null) {
					errorList.add("Article missing , " + (currentRow.getRowNum() + 1));
					continue;
				}

				if (upload.getProcess() == null) {
					errorList.add("Process  missing , " + (currentRow.getRowNum() + 1));
					continue;
				}
				boolean exists = productionArticleRouteRepository
						.existsByProcess_ProcessNameAndProductionArticle_Article(upload.getProcess().getProcessName(),
								upload.getProductionArticle().getArticle());
				if (exists) {
					errorList.add("Mapping already exists , " + (currentRow.getRowNum() + 1));
					continue;
				}

				upload.setCreatedBy(employeeId);
				upload.setStatus("1");
				upload.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
				upload.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

				productionArticleRouteRepository.save(upload);
			}

			Map<String, Object> responseMap = new HashMap<>();
			responseMap.put("message", "Excel uploaded successfully.");
			responseMap.put("errorList", errorList);

			return new ResponseEntity<>(responseMap, HttpStatus.OK);

		} catch (Exception e) {

			return new ResponseEntity<>("Upload failed : " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	
	@PutMapping("/updateScanStatus/{id}/{status}")
	public ResponseEntity<?> updateScanStatus(
	        @PathVariable Long id,
	        @PathVariable int status) {

	    try {

	        Optional<ProductionArticleRoute> routeOpt =
	                productionArticleRouteRepository.findById(id);

	        if (routeOpt.isEmpty()) {
	            return new ResponseEntity<>("Record not found", HttpStatus.NOT_ACCEPTABLE);
	        }

	        ProductionArticleRoute route = routeOpt.get();

	        route.setScan(String.valueOf(status)); // or int if column is int

	        route.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

	        productionArticleRouteRepository.save(route);

	        return new ResponseEntity<>("Scan updated", HttpStatus.OK);

	    } catch (Exception e) {
	        e.printStackTrace();
	        return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}

}
