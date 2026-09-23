package web.minda.project.controller;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.function.Function;


import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import web.minda.project.dto.ExpiryReportsDTO;
import web.minda.project.dto.IncomingReportsDTO;
import web.minda.project.dto.MasterReportDTO;
import web.minda.project.dto.MovingReportDTO;
import web.minda.project.dto.QaLogDTO;
import web.minda.project.dto.StoreLiveStockReportDTO;
import web.minda.project.dto.SupplierClaimReportDTO;
import web.minda.project.dto.SupplierClaimReportRequest;
import web.minda.project.entity.DevicesMaster;
import web.minda.project.entity.IncomingMaterial;
import web.minda.project.entity.Qualityincoming;
import web.minda.project.repositories.IncomingMaterialReportRepository;
import web.minda.project.repositories.QualityIncomingReportRepository;
import web.minda.project.repositories.SupplierClaimRepository;

@RestController
@RequestMapping("/Controllers")
public class IncomingReportsController {

	@Autowired
	IncomingMaterialReportRepository incomingMaterialReportRepository;

	@Autowired
	QualityIncomingReportRepository qualityIncomingReportRepositoryObject;
	
	
	@Autowired
	private SupplierClaimRepository supplierClaimRepository;

	@Autowired
	private Environment env;

//	@PostMapping("/getJobCardReports/{pageNum}/{pageSize}")
//	public ResponseEntity<Object> getJobCardReports(@PathVariable("pageNum") int page,
//			@PathVariable("pageSize") int pageSize, @RequestBody Map<String, Object>jsonObject) {
//
//		try {
//			Pageable pageable = PageRequest.of(page, pageSize);
//			String partName = (String) jsonObject.get("partName");
//	        String startDate = (String) jsonObject.get("startDate");
//	        String endDate = (String) jsonObject.get("endDate");
//			Page<Object[]> object = this.incomingMaterialReportRepository.getJobCardReports(partName,startDate,endDate,
//					 pageable);
//			System.out.println(object);
//			return new ResponseEntity<Object>(object, HttpStatus.OK);
//
//		} catch (Exception e) {
//			System.out.println(e);
//			return new ResponseEntity<Object>("ng", HttpStatus.OK);
//		}
//	}
//	

	@PostMapping("/getStoreLiveStockReports/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getStoreLiveStockReports(@PathVariable("pageNum") int page,
			@PathVariable("pageSize") int pageSize, @RequestBody Map<String, Object> jsonObject) {

		try {
			Pageable pageable = PageRequest.of(page, pageSize);
			String partName = (String) jsonObject.get("partName");
			String rackCode = (String) jsonObject.get("storeLocation");
			String lotNumber = (String) jsonObject.get("lotNumber");
			String startDate = (String) jsonObject.get("startDate");
			String endDate = (String) jsonObject.get("endDate");

			Page<StoreLiveStockReportDTO> object = this.incomingMaterialReportRepository.getStoreLiveStockReports(partName,
					rackCode, lotNumber, startDate + " 00:00:00", endDate + " 23:59:59", pageable);
			System.out.println(object);
			return new ResponseEntity<Object>(object, HttpStatus.OK);

		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<Object>("Internal Server Error.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/download/data/getStoreLiveStockReports")
	public void exportToStoreLiveStockReportsExcel(HttpServletResponse response,
			@RequestBody Map<String, Object> jsonObject) throws IOException {
		try {
			// Set the content type to Excel file
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
			String partName = (String) jsonObject.get("partName");
			String rackCode = (String) jsonObject.get("storeLocation");
			String lotNumber = (String) jsonObject.get("lotNumber");
			String startDate = (String) jsonObject.get("startDate");
			String endDate = (String) jsonObject.get("endDate");

			List<StoreLiveStockReportDTO> listObject = this.incomingMaterialReportRepository.getStoreLiveStockReportsList(
					partName, rackCode, lotNumber, startDate + " 00:00:00", endDate + " 23:59:59");

			String[] headerList = new String[] {"Location", "Rack Name", "Part Name", "Description", "Quantity",
					"Supplier Name", "Lot Number", "Total QTy", "MFG Date", "Expiry Date", "Operator", "Barcode",
					"Live Status", "Expiry Status", "Date & Time" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256,
					30 * 256 };

			List<Function<StoreLiveStockReportDTO, Object>> getters = Arrays.asList(
					StoreLiveStockReportDTO::getLocationName, StoreLiveStockReportDTO::getStoreLocation,
					StoreLiveStockReportDTO::getPartName, StoreLiveStockReportDTO::getDescription,
					StoreLiveStockReportDTO::getQuantity, StoreLiveStockReportDTO::getSuppierName,
					StoreLiveStockReportDTO::getLotNumber, StoreLiveStockReportDTO::getTotalQty,
					StoreLiveStockReportDTO::getMfgDate, StoreLiveStockReportDTO::getExpiryDate,
					StoreLiveStockReportDTO::getCreatedBy, StoreLiveStockReportDTO::getBarcode,
					StoreLiveStockReportDTO::getLiveStatus, StoreLiveStockReportDTO::getExpiredStatus,
					StoreLiveStockReportDTO::getDateTime);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(listObject, getters, headerList,
					COLUMN_WIDTHS, "Incoming Report");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();
			System.err.println(e);

		}
	}

	@PostMapping("/getIncomingReports/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getIncomingReports(@PathVariable("pageNum") int page,
			@PathVariable("pageSize") int pageSize, @RequestBody Map<String, Object> jsonObject) {

		try {
			Pageable pageable = PageRequest.of(page, pageSize);
			String partName = (String) jsonObject.get("partName");
			String lotNumber = (String) jsonObject.get("lotNumber");
			String supplier = (String) jsonObject.get("supplier");
			String startDate = (String) jsonObject.get("startDate");
			String endDate = (String) jsonObject.get("endDate");
			String qaStatus = (String) jsonObject.get("qaStatus");
			String status = (qaStatus.equals("Pending")) ? "0"
					: (qaStatus.equals("Release")) ? "1"
							: (qaStatus.equals("Reject")) ? "2"
									: (qaStatus.equals("Expired")) ? "3"
											: (qaStatus.equals("Scrap")) ? "4"
													: (qaStatus.equals("Re-Release")) ? "5"
															: (qaStatus.equals("Send Back")) ? "6" : "";
			Page<IncomingReportsDTO> object = this.incomingMaterialReportRepository.getIncomingReports(partName, lotNumber,
					status, supplier, startDate + " 00:00:00", endDate + " 23:59:59", pageable);
			System.out.println(object);
			return new ResponseEntity<Object>(object, HttpStatus.OK);

		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<Object>("Internal Server Error.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/download/data/incomingreport")
	public void exportToExcel(HttpServletResponse response, @RequestBody Map<String, Object> jsonObject)
			throws IOException {
		try {
			// Set the content type to Excel file
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
			String partName = (String) jsonObject.get("partName");
			String lotNumber = (String) jsonObject.get("lotNumber");
			String supplier = (String) jsonObject.get("supplier");
			String startDate = (String) jsonObject.get("startDate");
			String endDate = (String) jsonObject.get("endDate");
			String qaStatus = (String) jsonObject.get("qaStatus");
			String status = (qaStatus.equals("Pending")) ? "0"
					: (qaStatus.equals("Release")) ? "1"
							: (qaStatus.equals("Reject")) ? "2"
									: (qaStatus.equals("Expired")) ? "3"
											: (qaStatus.equals("Scrap")) ? "4"
													: (qaStatus.equals("Re-Release")) ? "5"
															: (qaStatus.equals("Send Back")) ? "6" : "";
			List<IncomingReportsDTO> listObject = this.incomingMaterialReportRepository.getIncomingReportsInList(partName,
					lotNumber, status, supplier, startDate + " 00:00:00", endDate + " 23:59:59");

			String[] headerList = new String[] { "Supplier Name", "Part Name", "Description", "Quantity", "Lot Number",
					"MFG Date", "Expiry Date", "Incoming Date", "Material Type", "Created By", "Date & Time" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256,
					30 * 256 };

			List<Function<IncomingReportsDTO, Object>> getters = Arrays.asList(IncomingReportsDTO::getSupplierName,
					IncomingReportsDTO::getPartName, IncomingReportsDTO::getDescription,
					IncomingReportsDTO::getQuantity, IncomingReportsDTO::getLotNumber, IncomingReportsDTO::getMfgDate,
					IncomingReportsDTO::getExpiryDate, IncomingReportsDTO::getDateTime, IncomingReportsDTO::getPartName,
					IncomingReportsDTO::getCreatedBy, IncomingReportsDTO::getDateTime);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(listObject, getters, headerList,
					COLUMN_WIDTHS, "Incoming Report");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();
			System.err.println(e);

		}
	}

	@PostMapping("/getQADetailReport")
	public ResponseEntity<Object> getQADetailReport(@RequestBody Map<String, Object> jsonObject) {

		try {
			String materialId = (String) jsonObject.get("materialId");

			List<Qualityincoming> object = this.qualityIncomingReportRepositoryObject.getAllListOfQualityLog(materialId);
			return new ResponseEntity<Object>(object, HttpStatus.OK);

		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<Object>("ng", HttpStatus.OK);
		}
	}

	@PostMapping("/getReleaseMaterialPendingReports/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getReleaseMaterialPendingReports(@PathVariable("pageNum") int page,
			@PathVariable("pageSize") int pageSize, @RequestBody Map<String, Object> jsonObject) {

		try {
			Pageable pageable = PageRequest.of(page, pageSize);
			String partName = (String) jsonObject.get("partName");
			String qaStatus = (String) jsonObject.get("qaStatus");
			String startDate = (String) jsonObject.get("startDate");
			String endDate = (String) jsonObject.get("endDate");
			Page<IncomingReportsDTO> object = this.incomingMaterialReportRepository.getReleaseMaterialPendingReports(partName,
					qaStatus, startDate + " 00:00:00", endDate + " 23:59:59", pageable);
			System.out.println(object);
			return new ResponseEntity<Object>(object, HttpStatus.OK);

		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<Object>("Internal Server Error.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/download/data/getReleaseMaterialPendingReports")
	public void exportTotReleaseMaterialPendingReportsExcel(HttpServletResponse response,
			@RequestBody Map<String, Object> jsonObject) throws IOException {
		try {
			// Set the content type to Excel file
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
			String partName = (String) jsonObject.get("partName");
			String qaStatus = (String) jsonObject.get("qaStatus");
			String startDate = (String) jsonObject.get("startDate");
			String endDate = (String) jsonObject.get("endDate");
			List<IncomingReportsDTO> listObject = this.incomingMaterialReportRepository
					.getReleaseMaterialPendingReportsInList(partName, qaStatus, startDate + " 00:00:00",
							endDate + " 23:59:59");

			String[] headerList = new String[] { "Supplier Name", "Part Name", "Description", "Quantity", "Lot Number",
					"MFG Date", "Expiry Date", "Incoming Date", "Material Type", "Created By", "Date & Time" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256,
					30 * 256 };

			List<Function<IncomingReportsDTO, Object>> getters = Arrays.asList(IncomingReportsDTO::getSupplierName,
					IncomingReportsDTO::getPartName, IncomingReportsDTO::getDescription,
					IncomingReportsDTO::getQuantity, IncomingReportsDTO::getLotNumber, IncomingReportsDTO::getMfgDate,
					IncomingReportsDTO::getExpiryDate, IncomingReportsDTO::getDateTime, IncomingReportsDTO::getPartName,
					IncomingReportsDTO::getCreatedBy, IncomingReportsDTO::getDateTime);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(listObject, getters, headerList,
					COLUMN_WIDTHS, "Quality Release Pening Report");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();
			System.err.println(e);

		}
	}

	@PostMapping("/getExpiryReports/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getExpiryReports(@PathVariable("pageNum") int page,
			@PathVariable("pageSize") int pageSize, @RequestBody Map<String, Object> jsonObject) {

		try {
			Pageable pageable = PageRequest.of(page, pageSize);
			String partName = (String) jsonObject.get("partName");
			String lotNumber = (String) jsonObject.get("lotNumber");
			String supplier = (String) jsonObject.get("supplier");
			String startDate = (String) jsonObject.get("startDate");
			String endDate = (String) jsonObject.get("endDate");
			String qaStatus = (String) jsonObject.get("qaStatus");
			String status = (qaStatus.equals("Pending")) ? "0"
					: (qaStatus.equals("Release")) ? "1"
							: (qaStatus.equals("Reject")) ? "2"
									: (qaStatus.equals("Expired")) ? "3"
											: (qaStatus.equals("Scrap")) ? "4"
													: (qaStatus.equals("Re-Release")) ? "5"
															: (qaStatus.equals("Send Back")) ? "6" : "";
			Page<ExpiryReportsDTO> object = this.incomingMaterialReportRepository.getExpiryReports(partName, lotNumber,
					supplier, startDate + " 00:00:00", endDate + " 23:59:59", pageable);
			System.out.println(object);
			return new ResponseEntity<Object>(object, HttpStatus.OK);

		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<Object>("Internal Server Error.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/download/data/getExpiryReports")
	public void exportToExpiryReportsExcel(HttpServletResponse response, @RequestBody Map<String, Object> jsonObject)
			throws IOException {
		try {
			// Set the content type to Excel file
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
			String partName = (String) jsonObject.get("partName");
			String lotNumber = (String) jsonObject.get("lotNumber");
			String supplier = (String) jsonObject.get("supplier");
			String startDate = (String) jsonObject.get("startDate");
			String endDate = (String) jsonObject.get("endDate");
			String qaStatus = (String) jsonObject.get("qaStatus");
			String status = (qaStatus.equals("Pending")) ? "0"
					: (qaStatus.equals("Release")) ? "1"
							: (qaStatus.equals("Reject")) ? "2"
									: (qaStatus.equals("Expired")) ? "3"
											: (qaStatus.equals("Scrap")) ? "4"
													: (qaStatus.equals("Re-Release")) ? "5"
															: (qaStatus.equals("Send Back")) ? "6" : "";
			List<ExpiryReportsDTO> listObject = this.incomingMaterialReportRepository.getExpiryReportsInList(partName,
					lotNumber, supplier, startDate + " 00:00:00", endDate + " 23:59:59");

			String[] headerList = new String[] { "Supplier Name", "Part Name", "Description", "Location", "Rack Name",
					"Quantity", "Lot Number", "Total Qty", "MFG Date", "Expiry Date", "Operator", "Barcode",
					"Live Status", "Expired Status", "Date & Time" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256,
					30 * 256 };

			List<Function<ExpiryReportsDTO, Object>> getters = Arrays.asList(ExpiryReportsDTO::getSupplierName,
					ExpiryReportsDTO::getPartName, ExpiryReportsDTO::getDescription, ExpiryReportsDTO::getLocationName,
					ExpiryReportsDTO::getStoreLocation, ExpiryReportsDTO::getQuantity, ExpiryReportsDTO::getLotNumber,
					ExpiryReportsDTO::getTotalQty, ExpiryReportsDTO::getMfgDate, ExpiryReportsDTO::getExpiryDate,
					ExpiryReportsDTO::getCreatedBy, ExpiryReportsDTO::getBarcode, ExpiryReportsDTO::getliveStatus,
					ExpiryReportsDTO::getExpiredStatus, ExpiryReportsDTO::getDateTime);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(listObject, getters, headerList,
					COLUMN_WIDTHS, "Expiry Report");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();
			System.err.println(e);

		}
	}

//	@PostMapping("/getMovingReports/{pageNum}/{pageSize}")
//	public ResponseEntity<Object> getMovingReports(@PathVariable("pageNum") int page,
//			@PathVariable("pageSize") int pageSize, @RequestBody Map<String, Object> jsonObject) {
//
//		try {
//			Pageable pageable = PageRequest.of(page, pageSize);
//			String partName = (String) jsonObject.get("partName");
//			String startDate = (String) jsonObject.get("startDate");
//			String endDate = (String) jsonObject.get("endDate");
//			Page<MovingReportDTO> object = this.incomingMaterialReportRepository.getMovingReports(partName, startDate,
//					endDate, pageable);
//			System.out.println(object);
//			return new ResponseEntity<Object>(object, HttpStatus.OK);
//
//		} catch (Exception e) {
//			System.out.println(e);
//			return new ResponseEntity<Object>("Internal Server Error.", HttpStatus.INTERNAL_SERVER_ERROR);
//		}
//	}
	
	
	@PostMapping("/getMovingReports/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getMovingReports(
	        @PathVariable("pageNum") int page,
	        @PathVariable("pageSize") int pageSize,
	        @RequestBody Map<String, Object> jsonObject) {

	    Pageable pageable = PageRequest.of(page, pageSize);

	    String partName = (String) jsonObject.get("partName");
	    String startDate = (String) jsonObject.get("startDate");
	    String endDate = (String) jsonObject.get("endDate");

	    Integer agingDays = null;

	    if (jsonObject.get("agingDays") != null
	            && !jsonObject.get("agingDays").toString().isEmpty()) {

	        agingDays = Integer.parseInt(
	                jsonObject.get("agingDays").toString());
	    }

	    Page<MovingReportDTO> object =
	            incomingMaterialReportRepository.getMovingReports(
	                    partName,
	                    startDate,
	                    endDate,
	                    agingDays,
	                    pageable);

	    return ResponseEntity.ok(object);
	}

	@PostMapping("/getQaLogReports/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getQaLogReports(@PathVariable("pageNum") int page,
			@PathVariable("pageSize") int pageSize, @RequestBody Map<String, Object> jsonObject) {

		try {
			Pageable pageable = PageRequest.of(page, pageSize);
			String partName = (String) jsonObject.get("partName");
			String qaStatus = (String) jsonObject.get("qaStatus");
			String startDate = (String) jsonObject.get("startDate");
			String endDate = (String) jsonObject.get("endDate");
			Page<QaLogDTO> object = this.qualityIncomingReportRepositoryObject.getQaLogReport(pageable);
			System.out.println(object);
			return new ResponseEntity<Object>(object, HttpStatus.OK);

		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<Object>("Internal Server Error.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	
	
	
//	@PostMapping("/getQaLogReports/{pageNum}/{pageSize}")
//	public ResponseEntity<Object> getQaLogReports(
//	        @PathVariable("pageNum") int page,
//	        @PathVariable("pageSize") int pageSize, 
//	        @RequestBody Map<String, Object> jsonObject) {
//
//	    try {
//	        Pageable pageable = PageRequest.of(page, pageSize);
//	        
//	        // Safely extract all variables
//	        String partName = (String) jsonObject.get("partName");
//	        String qaStatus = (String) jsonObject.get("qaStatus");
//	        String startDate = (String) jsonObject.get("startDate");
//	        String endDate = (String) jsonObject.get("endDate");
//	        
//	        // NEW EXTRACTED VARIABLES
//	        String supplier = (String) jsonObject.get("supplier");
//	        String lotNumber = (String) jsonObject.get("lotNumber");
//	        String status = (String) jsonObject.get("status");
//
//	        // PASS ALL VARIABLES TO THE REPOSITORY
//	        Page<QaLogDTO> object = this.qualityIncomingReportRepositoryObject.getQaLogReport(
//	            partName, qaStatus, startDate, endDate, supplier, lotNumber, status, pageable
//	        );
//	        
//	        System.out.println("Fetched Data Count: " + object.getTotalElements());
//	        return new ResponseEntity<>(object, HttpStatus.OK);
//
//	    } catch (Exception e) {
//	        System.out.println(e);
//	        return new ResponseEntity<>("Internal Server Error.", HttpStatus.INTERNAL_SERVER_ERROR);
//	    }
//	}
	
	@PostMapping("/getSupplierClaimReport/{page}/{size}")
	public ResponseEntity<?> getSupplierClaimReport(
	        @RequestBody SupplierClaimReportRequest request,
	        @PathVariable int page,
	        @PathVariable int size) {

	    try {

	        Pageable pageable = PageRequest.of(page, size);

	        Page<SupplierClaimReportDTO> data =
	                supplierClaimRepository.getSupplierClaimReport(

	                        request.getSupplierName(),
	                        request.getClaimedBy(),
	                        request.getResponsible(),
	                        request.getYesNo(),
	                        request.getStartDate(),
	                        request.getEndDate(),
	                        pageable
	                );

	        return ResponseEntity.ok(data);

	    } catch (Exception e) {

	        e.printStackTrace();

	        return ResponseEntity
	                .status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body(e.getMessage());
	    }
	}
	
	
	
	@GetMapping("/viewSupplierClaimFile")
	public ResponseEntity<Resource> viewSupplierClaimFile(
	        @RequestParam String fileName) {

	    try {

	        String basePath =
	                env.getProperty("supplier.claim.files.path");

	        Path filePath =
	                Paths.get(basePath, fileName);

	        Resource resource =
	                new UrlResource(filePath.toUri());

	        if (!resource.exists()) {
	            return ResponseEntity.notFound().build();
	        }

	        String contentType =
	                Files.probeContentType(filePath);

	        if (contentType == null) {
	            contentType = "application/octet-stream";
	        }

	        return ResponseEntity.ok()
	                .contentType(MediaType.parseMediaType(contentType))
	                .body(resource);

	    } catch (Exception e) {

	        e.printStackTrace();

	        return ResponseEntity
	                .status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .build();
	    }
	}
	
	
	
	@PostMapping("/getMasterReport/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getMasterReport(
	        @PathVariable("pageNum") int page,
	        @PathVariable("pageSize") int pageSize,
	        @RequestBody Map<String, Object> jsonObject) {

	    try {

	        Pageable pageable = PageRequest.of(page, pageSize);

	        String partNumber =
	                (String) jsonObject.get("partNumber");

	        String storeLocation =
	                (String) jsonObject.get("storeLocation");

	        String lotNumber =
	                (String) jsonObject.get("lotNumber");

	        Page<MasterReportDTO> object =
	                incomingMaterialReportRepository.getMasterReport(
	                        partNumber,
	                        lotNumber,
	                        storeLocation,
	                        pageable);

	        return new ResponseEntity<>(object, HttpStatus.OK);

	    } catch (Exception e) {

	        e.printStackTrace();

	        return new ResponseEntity<>(
	                "Internal Server Error",
	                HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	
	

}
