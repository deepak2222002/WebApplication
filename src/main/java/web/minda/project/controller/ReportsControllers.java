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
import web.minda.project.entity.DevicesMaster;
import web.minda.project.entity.MachineMaster;
import web.minda.project.entity.ProcessMaster;
import web.minda.project.helper.ExcelUploadHelper;
import web.minda.project.repositories.DevicesMasterRepository;
import web.minda.project.repositories.ProcessMasterRepository;
import web.minda.project.service.DateTimeService;

@RestController
@RequestMapping("/Controllers")
public class ReportsControllers {

	@Autowired
	DevicesMasterRepository devicesMasterRepository;
	DevicesMaster masterObject = new DevicesMaster();

	@Autowired
	private DateTimeService dateTimeService;

	@GetMapping("/download/data/jobCardInformationReport")
	public void exportToJobCard(HttpServletResponse response) throws IOException {
		try {
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
			List<DevicesMaster> list = this.devicesMasterRepository.getalldata();
			String[] headerList = new String[] { "Part Number", "Description", "No.of Batches", "UOM", "Weight",
					"Material Type", "Created By", "Date & Time" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256 };

			List<Function<DevicesMaster, Object>> getters = Arrays.asList(DevicesMaster::getDeviceName,
					DevicesMaster::getDescription, DevicesMaster::getAddress, DevicesMaster::getStatus,
					DevicesMaster::getCreatedBy, DevicesMaster::getDateTimeModified);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(list, getters, headerList, COLUMN_WIDTHS,
					"Job Card Report");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@GetMapping("/download/data/storeLiveStockReport")
	public void exportToStoreLive(HttpServletResponse response) throws IOException {
		try {
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
			List<DevicesMaster> list = this.devicesMasterRepository.getalldata();
			String[] headerList = new String[] { "Part Number", "Description", "Store Location", "UOM", "Quantity",
					"Supplier Name", "Lot Number", "Total Qty", "MFG Date", "Expiry Date", "Operator", "Barcode",
					"Date & Time", "Live Status", "Expired Status" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256,
					30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256 };

			List<Function<DevicesMaster, Object>> getters = Arrays.asList(DevicesMaster::getDeviceName,
					DevicesMaster::getDescription, DevicesMaster::getAddress, DevicesMaster::getStatus,
					DevicesMaster::getCreatedBy, DevicesMaster::getDateTimeModified);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(list, getters, headerList, COLUMN_WIDTHS,
					"Store Live Report");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@GetMapping("/download/data/IncomingReport")
	public void exportToIncoming(HttpServletResponse response) throws IOException {
		try {
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
			List<DevicesMaster> list = this.devicesMasterRepository.getalldata();
			String[] headerList = new String[] { "Supplier Name", "Part Number", "Description", "UOM", "Quantity",
					"Lot Number", "MFG Date", "Expiry Date", "Incoming Date", "Material Type", "Operator" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256 };

			List<Function<DevicesMaster, Object>> getters = Arrays.asList(DevicesMaster::getDeviceName,
					DevicesMaster::getDescription, DevicesMaster::getAddress, DevicesMaster::getStatus,
					DevicesMaster::getCreatedBy, DevicesMaster::getDateTimeModified);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(list, getters, headerList, COLUMN_WIDTHS,
					"Incoming Report");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@GetMapping("/download/data/IssueReport")
	public void exportToIssue(HttpServletResponse response) throws IOException {
		try {
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
			List<DevicesMaster> list = this.devicesMasterRepository.getalldata();
			String[] headerList = new String[] { "JOb Card Id", "Part Number", "Description", "UOM", "Quantity",
					"Supplier Name", "Lot Number", "IssueDate & Time", "Material Id", "material Type", "Operator" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256 };

			List<Function<DevicesMaster, Object>> getters = Arrays.asList(DevicesMaster::getDeviceName,
					DevicesMaster::getDescription, DevicesMaster::getAddress, DevicesMaster::getStatus,
					DevicesMaster::getCreatedBy, DevicesMaster::getDateTimeModified);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(list, getters, headerList, COLUMN_WIDTHS,
					"Issue report");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@GetMapping("/download/data/ExpiryReport")
	public void exportToExpiry(HttpServletResponse response) throws IOException {
		try {
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
			List<DevicesMaster> list = this.devicesMasterRepository.getalldata();
			String[] headerList = new String[] { "Part Number", "Description", "UOM", "Supplier Name", "Quantity",
					"Lot Number", "Invoice Number", "Expiry Date", "Material Id", "Material Type", "No. of Days" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256 };

			List<Function<DevicesMaster, Object>> getters = Arrays.asList(DevicesMaster::getDeviceName,
					DevicesMaster::getDescription, DevicesMaster::getAddress, DevicesMaster::getStatus,
					DevicesMaster::getCreatedBy, DevicesMaster::getDateTimeModified);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(list, getters, headerList, COLUMN_WIDTHS,
					"Expiry Report");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@GetMapping("/download/data/releaseMatPendingReport")
	public void exportToReleaseMatPending(HttpServletResponse response) throws IOException {
		try {
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
			List<DevicesMaster> list = this.devicesMasterRepository.getalldata();
			String[] headerList = new String[] { "Part Number", "Description", "UOM", "Quantity", "Supplier Name",
					"Lot Number", "Material Id QC", "Tagging Date", "Tagging Time", "Tagging Status", "Operator Id",
					"Date & Time" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256,
					30 * 256 };

			List<Function<DevicesMaster, Object>> getters = Arrays.asList(DevicesMaster::getDeviceName,
					DevicesMaster::getDescription, DevicesMaster::getAddress, DevicesMaster::getStatus,
					DevicesMaster::getCreatedBy, DevicesMaster::getDateTimeModified);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(list, getters, headerList, COLUMN_WIDTHS,
					"Release Pending Report");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@GetMapping("/download/data/masterReport")
	public void exportToMaster(HttpServletResponse response) throws IOException {
		try {
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
			List<DevicesMaster> list = this.devicesMasterRepository.getalldata();
			String[] headerList = new String[] { "Store Location", "Supplier Name", "Part Number", "Description", "UO",
					"Quantity", "Lot Number", "Incoming Date", "Quality Release  Date", "Material tagging Date",
					"Operator Id", "Barcode Id", "Material Category", "Material Status", "Issuance Date",
					"Issunace Qty", "Qty In Stock", "Operator Id" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256,
					30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256 };

			List<Function<DevicesMaster, Object>> getters = Arrays.asList(DevicesMaster::getDeviceName,
					DevicesMaster::getDescription, DevicesMaster::getAddress, DevicesMaster::getStatus,
					DevicesMaster::getCreatedBy, DevicesMaster::getDateTimeModified);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(list, getters, headerList, COLUMN_WIDTHS,
					"Master Report");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@GetMapping("/download/data/movingReport")
	public void exportToMoving(HttpServletResponse response) throws IOException {
		try {
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
			List<DevicesMaster> list = this.devicesMasterRepository.getalldata();
			String[] headerList = new String[] { "Store Location", "Supplier Name", "Part Number", "Description", "UOM",
					"Quantity", "Lot Number", "Incoming Date", "Qty Release Date"};
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256
					, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256};

			List<Function<DevicesMaster, Object>> getters = Arrays.asList(DevicesMaster::getDeviceName,
					DevicesMaster::getDescription, DevicesMaster::getAddress, DevicesMaster::getStatus,
					DevicesMaster::getCreatedBy, DevicesMaster::getDateTimeModified);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(list, getters, headerList, COLUMN_WIDTHS,
					"Moving Report");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@PostMapping("/getLikeJobCardInformationReport/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getLikeJobCardInformationReport(@PathVariable("pageNum") int page,
			@PathVariable("pageSize") int pageSize, @RequestBody DevicesMaster jsonObject) {

		try {
			System.out.println(jsonObject);
			Pageable pageable = PageRequest.of(page, pageSize);
			Page<DevicesMaster> object = this.devicesMasterRepository.getLikeDevice(jsonObject.getDeviceName(),
					jsonObject.getDescription(), jsonObject.getAddress(), jsonObject.getStatus(),
					jsonObject.getCreatedBy(), pageable);
			System.out.println(object);
			return new ResponseEntity<Object>(object, HttpStatus.OK);

		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<Object>("ng", HttpStatus.OK);
		}
	}

//	@PostMapping("/getLikeStoreLiveStockReport/{pageNum}/{pageSize}")
//	public ResponseEntity<Object> getLikeStoreLiveStockReport(@PathVariable("pageNum") int page,
//			@PathVariable("pageSize") int pageSize, @RequestBody DevicesMaster jsonObject) {
//
//		try {
//			System.out.println(jsonObject);
//			Pageable pageable = PageRequest.of(page, pageSize);
//			Page<DevicesMaster> object = this.devicesMasterRepository.getLikeDevice(jsonObject.getDeviceName(),
//					jsonObject.getDescription(), jsonObject.getAddress(), jsonObject.getStatus(),
//					jsonObject.getCreatedBy(), pageable);
//			System.out.println(object);
//			return new ResponseEntity<Object>(object, HttpStatus.OK);
//
//		} catch (Exception e) {
//			System.out.println(e);
//			return new ResponseEntity<Object>("ng", HttpStatus.OK);
//		}
//	}
//
////	@PostMapping("/getLikeIncomingReport/{pageNum}/{pageSize}")
////	public ResponseEntity<Object> getLikeIncomingReport(@PathVariable("pageNum") int page,
////			@PathVariable("pageSize") int pageSize, @RequestBody DevicesMaster jsonObject) {
////
////		try {
////			System.out.println(jsonObject);
////			Pageable pageable = PageRequest.of(page, pageSize);
////			Page<DevicesMaster> object = this.devicesMasterRepository.getLikeDevice(jsonObject.getDeviceName(),
////					jsonObject.getDescription(), jsonObject.getAddress(), jsonObject.getStatus(),
////					jsonObject.getCreatedBy(), pageable);
////			System.out.println(object);
////			return new ResponseEntity<Object>(object, HttpStatus.OK);
////
////		} catch (Exception e) {
////			System.out.println(e);
////			return new ResponseEntity<Object>("ng", HttpStatus.OK);
////		}
////	}
//
//	@PostMapping("/getLikeIssueReport/{pageNum}/{pageSize}")
//	public ResponseEntity<Object> getLikeIssueReport(@PathVariable("pageNum") int page,
//			@PathVariable("pageSize") int pageSize, @RequestBody DevicesMaster jsonObject) {
//
//		try {
//			System.out.println(jsonObject);
//			Pageable pageable = PageRequest.of(page, pageSize);
//			Page<DevicesMaster> object = this.devicesMasterRepository.getLikeDevice(jsonObject.getDeviceName(),
//					jsonObject.getDescription(), jsonObject.getAddress(), jsonObject.getStatus(),
//					jsonObject.getCreatedBy(), pageable);
//			System.out.println(object);
//			return new ResponseEntity<Object>(object, HttpStatus.OK);
//
//		} catch (Exception e) {
//			System.out.println(e);
//			return new ResponseEntity<Object>("ng", HttpStatus.OK);
//		}
//	}
//
//	@PostMapping("/getLikeExpiryReport/{pageNum}/{pageSize}")
//	public ResponseEntity<Object> getLikeExpiryReport(@PathVariable("pageNum") int page,
//			@PathVariable("pageSize") int pageSize, @RequestBody DevicesMaster jsonObject) {
//
//		try {
//			System.out.println(jsonObject);
//			Pageable pageable = PageRequest.of(page, pageSize);
//			Page<DevicesMaster> object = this.devicesMasterRepository.getLikeDevice(jsonObject.getDeviceName(),
//					jsonObject.getDescription(), jsonObject.getAddress(), jsonObject.getStatus(),
//					jsonObject.getCreatedBy(), pageable);
//			System.out.println(object);
//			return new ResponseEntity<Object>(object, HttpStatus.OK);
//
//		} catch (Exception e) {
//			System.out.println(e);
//			return new ResponseEntity<Object>("ng", HttpStatus.OK);
//		}
//	}
//
//	@PostMapping("/getLikeReleaseMatPendingReport/{pageNum}/{pageSize}")
//	public ResponseEntity<Object> getLikeReleaseMatPendingReport(@PathVariable("pageNum") int page,
//			@PathVariable("pageSize") int pageSize, @RequestBody DevicesMaster jsonObject) {
//
//		try {
//			System.out.println(jsonObject);
//			Pageable pageable = PageRequest.of(page, pageSize);
//			Page<DevicesMaster> object = this.devicesMasterRepository.getLikeDevice(jsonObject.getDeviceName(),
//					jsonObject.getDescription(), jsonObject.getAddress(), jsonObject.getStatus(),
//					jsonObject.getCreatedBy(), pageable);
//			System.out.println(object);
//			return new ResponseEntity<Object>(object, HttpStatus.OK);
//
//		} catch (Exception e) {
//			System.out.println(e);
//			return new ResponseEntity<Object>("ng", HttpStatus.OK);
//		}
//	}
//
//	@PostMapping("/getLikeMasterReport/{pageNum}/{pageSize}")
//	public ResponseEntity<Object> getLikeMasterReport(@PathVariable("pageNum") int page,
//			@PathVariable("pageSize") int pageSize, @RequestBody DevicesMaster jsonObject) {
//
//		try {
//			System.out.println(jsonObject);
//			Pageable pageable = PageRequest.of(page, pageSize);
//			Page<DevicesMaster> object = this.devicesMasterRepository.getLikeDevice(jsonObject.getDeviceName(),
//					jsonObject.getDescription(), jsonObject.getAddress(), jsonObject.getStatus(),
//					jsonObject.getCreatedBy(), pageable);
//			System.out.println(object);
//			return new ResponseEntity<Object>(object, HttpStatus.OK);
//
//		} catch (Exception e) {
//			System.out.println(e);
//			return new ResponseEntity<Object>("ng", HttpStatus.OK);
//		}
//	}
//
//	@PostMapping("/getLikeMovingReport/{pageNum}/{pageSize}")
//	public ResponseEntity<Object> getLikeMovingReport(@PathVariable("pageNum") int page,
//			@PathVariable("pageSize") int pageSize, @RequestBody DevicesMaster jsonObject) {
//
//		try {
//			System.out.println(jsonObject);
//			Pageable pageable = PageRequest.of(page, pageSize);
//			Page<DevicesMaster> object = this.devicesMasterRepository.getLikeDevice(jsonObject.getDeviceName(),
//					jsonObject.getDescription(), jsonObject.getAddress(), jsonObject.getStatus(),
//					jsonObject.getCreatedBy(), pageable);
//			System.out.println(object);
//			return new ResponseEntity<Object>(object, HttpStatus.OK);
//
//		} catch (Exception e) {
//			System.out.println(e);
//			return new ResponseEntity<Object>("ng", HttpStatus.OK);
//		}
//	}

}
