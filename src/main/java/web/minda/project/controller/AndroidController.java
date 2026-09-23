package web.minda.project.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.annotation.JacksonInject.Value;

import web.minda.project.dto.PendingPutawayDTO;
import web.minda.project.entity.IncomingMaterial;
import web.minda.project.entity.LocationMaster;
import web.minda.project.entity.Qualityincoming;
import web.minda.project.entity.RackMaster;
import web.minda.project.entity.StoreIncomingQuality;
import web.minda.project.entity.StoreIncomingQuarantine;
import web.minda.project.entity.StoreMaterial;
import web.minda.project.entity.StoreMaterialCategoryMaster;
import web.minda.project.entity.StoreMaterialLocation;
import web.minda.project.entity.SupplierMaster;
import web.minda.project.repositories.IncomingMaterialRepository;
import web.minda.project.repositories.LocationMasterRepository;
import web.minda.project.repositories.QualityIncomingRepository;
import web.minda.project.repositories.RackMasterRepository;
import web.minda.project.repositories.StoreIncomingQualityRepository;
import web.minda.project.repositories.StoreIncomingQuarantineRepository;
import web.minda.project.repositories.StoreMaterialCategoryRepository;
import web.minda.project.repositories.StoreMaterialRepository;
import web.minda.project.repositories.StoreMaterialSupplierMappingRepository;
import web.minda.project.repositories.StoreMateriallocationRepository;
import web.minda.project.repositories.SupplierMasterRepository;
import web.minda.project.service.ZebraUsbPrinterService;

@RestController
@RequestMapping("/AndroidController")
public class AndroidController {
	@Autowired
	private IncomingMaterialRepository incomingRepo;
	
	
	@Autowired
	private StoreIncomingQualityRepository storeIncomingQualityRepository;
	
	@Autowired
	private StoreIncomingQuarantineRepository storeIncomingQuarantineRepository;

	@Autowired
	private StoreMaterialCategoryRepository categoryRepo;

	@Autowired
	private LocationMasterRepository locationRepo;

	@Autowired
	private StoreMateriallocationRepository storeMateriallocationRepository;
	
	@Autowired
	private StoreMaterialRepository storeMaterialRepository;
	
	@Autowired
	private QualityIncomingRepository qualityRepo;

	@Autowired
	private RackMasterRepository rackMasterRepository;
	
	@Autowired
	private SupplierMasterRepository supplierMasterRepository;
	
	@Autowired
	private StoreMaterialSupplierMappingRepository storeMaterialSupplierMappingRepository;


	
	@PostMapping("/insertIncoming")
	public ResponseEntity<Object> insertIncoming(@RequestBody Map<String, Object> request) {

	    Map<String, Object> response = new HashMap<>();

	    try {

	        String productName = request.get("productName").toString();
	        int totalBoxes = Integer.parseInt(request.get("noOfBoxes").toString());

	        Optional<StoreMaterial> storeMatOpt = storeMaterialRepository.findByMaterial(productName);

	        if (!storeMatOpt.isPresent()) {
	            response.put("status", false);
	            response.put("message", "Product not found");
	            return ResponseEntity.badRequest().body(response);
	        }

	        StoreMaterial storeMat = storeMatOpt.get();

//	        boolean boxInput = storeMat.getCategory() != null
//	                && Boolean.TRUE.equals(storeMat.getCategory().getBoxInput());
	        
	        boolean boxInput = false;

	        if (storeMat.getCategory() != null && storeMat.getCategory().getBoxInput() != null) {
	            boxInput = storeMat.getCategory().getBoxInput().equalsIgnoreCase("true");
	        }

	        String now = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());

	        // Printer + Template
	        String printerName = env.getProperty("printer.default");
	        String template = env.getProperty("zebra.label.template");

	        List<String> printedBarcodes = new ArrayList<>();
	        
	        String expDate = request.get("expireDate").toString();
	        boolean expired = isExpired(expDate);

	        String qaStatusValue = expired ? "3" : "0";
	        String qaValue = expired ? "EXPIRED" : "PENDING";

	        if (boxInput) {

	            for (int i = 1; i <= totalBoxes; i++) {

	                IncomingMaterial material = new IncomingMaterial();
	                material.setSupplier(request.get("materialType").toString());
	                material.setCategory(storeMat.getCategory());
	                material.setPartName(productName);
	                material.setLotNumber(request.get("lotNumber").toString());
	                material.setBoxNo(i);
	                material.setQuantity(Integer.parseInt(request.get("quantity").toString()));
	                material.setMfgDate(request.get("mfgDate").toString());
	                material.setExpireDate(request.get("expireDate").toString());
	                material.setCreatedBy(request.get("createdBy").toString());
	                material.setStatus("1");
	                material.setQaStatus(qaStatusValue);
	                material.setQa(qaValue);
	                material.setDateTimeCreation(now);
	                material.setDateTimeModified(now);
	                material.setTaggingStatus("0");
	               
	                IncomingMaterial savedMaterial = incomingRepo.save(material);
	                
	                
	                if ("3".equals(qaStatusValue)) {   // EXPIRED

	                    // 👉 SAVE IN QUARANTINE
	                    StoreIncomingQuarantine quarantineEntry = new StoreIncomingQuarantine();

	                    quarantineEntry.setInMaterial(savedMaterial);
	                    quarantineEntry.setQaStatus(qaStatusValue);
	                    quarantineEntry.setDateTimeCreation(now);
	                    quarantineEntry.setDateTimeModified(now);
	                    quarantineEntry.setQuarantineLabelPasteStatus("0");

	                    storeIncomingQuarantineRepository.save(quarantineEntry);

	                } else {

	                    // 👉 NORMAL FLOW (StoreIncomingQuality)
	                    StoreIncomingQuality storeIncomingQuality = new StoreIncomingQuality();

	                    storeIncomingQuality.setInMaterial(savedMaterial);
	                    storeIncomingQuality.setQaStatus(qaStatusValue);
	                    storeIncomingQuality.setDateTimeCreation(now);
	                    storeIncomingQuality.setDateTimeModified(now);
	                    storeIncomingQuality.setQaLabelPasteStatus("0");

	                    storeIncomingQualityRepository.save(storeIncomingQuality);
	                }
	                
	                Qualityincoming log = new Qualityincoming();
	                log.setInMaterial(savedMaterial);
	                log.setStatus(savedMaterial.getQa());
	                log.setCreatedBy(request.get("createdBy").toString());
	                log.setQaStatus(expired ? "Expired Incoming In" : "Incoming In");
	                log.setDateTimeCreation(now);
	                log.setDateTimeModified(now);
	                log.setOperation("Incoming");

	                qualityRepo.save(log);

	                String id = String.valueOf(savedMaterial.getIncomingMaterialId());
	                printedBarcodes.add(id);


	                
	                String boxDisplay = i + "/" + totalBoxes;
	                System.out.println("inside the incoming android : "+boxDisplay);
	                
	                System.out.println("inside the incoming user : "+ request.get("createdBy").toString());

//	                String zpl = String.format(
//	                        template,
//	                        id,
//	                        material.getPartName(),
//	                        material.getQuantity(),
//	                        material.getLotNumber(),
//	                        material.getSupplier(),
//	                        boxDisplay,
//	                        now,
//	                        material.getMfgDate(),
//	                        material.getExpireDate(),
//	                        id
//	                );
	                
	                String zpl = String.format(
	                        template,
	                        id,
	                        material.getPartName(),
	                        material.getQuantity(),
	                        material.getLotNumber(),
	                        material.getSupplier(),
	                        boxDisplay,
	                        now,
	                        material.getMfgDate(),
	                        material.getExpireDate(),
	                        request.get("createdBy").toString(), // User
	                        id
	                );

	                
	                if (!expired) {
	                    try {
	                        printerService.printZpl(printerName, zpl);
	                    } catch (Exception printError) {
	                        printError.printStackTrace();
	                    }
	                } else {
	                    System.out.println("⚠ Skipped printing (Expired)");
	                }
	            }
	
	            response.put("status", true);
	            response.put("message", totalBoxes + " boxes inserted and labels printed");
	            response.put("barcodes", printedBarcodes);

	        } else {

	            IncomingMaterial material = new IncomingMaterial();
	            material.setSupplier(request.get("materialType").toString());
	            material.setCategory(storeMat.getCategory());
	            material.setPartName(productName);
	            material.setLotNumber(request.get("lotNumber").toString());
	            material.setBoxNo(1);
	            material.setQuantity(Integer.parseInt(request.get("quantity").toString()));
	            material.setMfgDate(request.get("mfgDate").toString());
	            material.setExpireDate(request.get("expireDate").toString());
	            material.setCreatedBy(request.get("createdBy").toString());
	            material.setStatus("1");
                material.setQa(qaValue);
                material.setQaStatus(qaStatusValue);
	            material.setDateTimeCreation(now);
	            material.setDateTimeModified(now);
                material.setTaggingStatus("0");
                

	            IncomingMaterial savedMaterial = incomingRepo.save(material);
	            
	            
	            
	            if ("3".equals(qaStatusValue)) {   // EXPIRED

	                // 👉 SAVE IN QUARANTINE
	            	  StoreIncomingQuarantine quarantineEntry = new StoreIncomingQuarantine();

	                    quarantineEntry.setInMaterial(savedMaterial);
	                    quarantineEntry.setQaStatus(qaStatusValue);
	                    quarantineEntry.setDateTimeCreation(now);
	                    quarantineEntry.setDateTimeModified(now);
	                    quarantineEntry.setQuarantineLabelPasteStatus("0");

	                    storeIncomingQuarantineRepository.save(quarantineEntry);

	            } else {

	                // 👉 NORMAL FLOW (StoreIncomingQuality)
	                StoreIncomingQuality storeIncomingQuality = new StoreIncomingQuality();

	                storeIncomingQuality.setInMaterial(savedMaterial);
	                storeIncomingQuality.setQaStatus(qaStatusValue);
	                storeIncomingQuality.setDateTimeCreation(now);
	                storeIncomingQuality.setDateTimeModified(now);
	                storeIncomingQuality.setQaLabelPasteStatus("0");

	                storeIncomingQualityRepository.save(storeIncomingQuality);
	            }
	            
	              Qualityincoming log = new Qualityincoming();
	                log.setInMaterial(savedMaterial);
	                log.setStatus(savedMaterial.getQa());
	                log.setCreatedBy(request.get("createdBy").toString());
	                log.setQaStatus(expired ? "Expired Incoming In" : "Incoming In");
	                log.setDateTimeCreation(now);
	                log.setDateTimeModified(now);
	                log.setOperation("Incoming");

	                qualityRepo.save(log);

	            String id = String.valueOf(savedMaterial.getIncomingMaterialId());

	            // PRINT LABEL
            
//	            String zpl = String.format(
//	                    template,
//	                    id,
//	                    material.getPartName(),
//	                    material.getQuantity(),
//	                    material.getLotNumber(),
//	                    material.getSupplier(),
//	                    "1/1",
//	                    now,
//	                    material.getMfgDate(),
//	                    material.getExpireDate(),
//	                    id
//	            );
	            
	            String zpl = String.format(
	                    template,
	                    id,
	                    material.getPartName(),
	                    material.getQuantity(),
	                    material.getLotNumber(),
	                    material.getSupplier(),
	                    "1/1",
	                    now,
	                    material.getMfgDate(),
	                    material.getExpireDate(),
	                    request.get("createdBy").toString(),
	                    id
	            );


	            
	            if (!expired) {
	                try {
	                    printerService.printZpl(printerName, zpl);

	                    response.put("status", true);
	                    response.put("message", "Material saved and label printed");
	                    response.put("barcode", id);

	                } catch (Exception printError) {

	                    response.put("status", true);
	                    response.put("message", "Material saved but printing failed");
	                    response.put("barcode", id);
	                }
	            } else {
	                response.put("status", true);
	                response.put("message", "Material saved but NOT printed (Expired)");
	                response.put("barcode", id);
	            }
	        }
	        if(expired){
	            response.put("warning", "Expire date is already expired. Saved as EXPIRED.");
	        }
	        return ResponseEntity.ok(response);

	    } catch (Exception e) {
	        e.printStackTrace();
	        response.put("status", false);
	        response.put("message", "Error saving incoming material");
	        return ResponseEntity.internalServerError().body(response);
	    }
	}
	
	
	
	private boolean isExpired(String expireDateStr) {
	    try {
	        SimpleDateFormat sdf = new SimpleDateFormat("d-M-yyyy");
	        sdf.setLenient(false);

	        Date expireDate = sdf.parse(expireDateStr);

	        // current date without time
	        Date today = new Date();
	        String todayStr = sdf.format(today);
	        Date todayOnly = sdf.parse(todayStr);

	        return expireDate.before(todayOnly);

	    } catch (Exception e) {
	        e.printStackTrace();
	        return false;
	    }
	}

	@GetMapping("/getMaterialTypes")
	public List<String> getMaterialTypes() {

		List<String> list = new ArrayList<>();

		categoryRepo.findAll().forEach(cat -> {
			list.add(cat.getCategory());
		});

		return list;
	}
	
	
	
	@GetMapping("/getSupplier")
	public List<String> getSupplier() {

		List<String> list = new ArrayList<>();

		supplierMasterRepository.findAll().forEach(cat -> {
			list.add(cat.getSupplierName());
		});

		return list;
	}
	
	@GetMapping("/getProductsBySupplier/{supplier}")
	public ResponseEntity<?> getProductsBySupplier(@PathVariable String supplier){

	    Optional<SupplierMaster> supOpt =
	            supplierMasterRepository.findBySupplierName(supplier);

	    if(!supOpt.isPresent()){
	        return ResponseEntity.badRequest().body("Supplier not found");
	    }

	    Long supplierId = supOpt.get().getSupplierId();

	    Set<String> productSet = new HashSet<>();

	    storeMaterialSupplierMappingRepository
	            .findBySupplier_SupplierId(supplierId)
	            .forEach(p -> {
	                if(p.getStoreMaterial() != null){
	                    productSet.add(p.getStoreMaterial().getMaterial());
	                }
	            });
	    
	    System.out.println("productList: "+productSet);


	    return ResponseEntity.ok(new ArrayList<>(productSet));
	}
	
	@GetMapping("/getProductDetails/{product}")
	public Map<String, Object> getProductDetails(@PathVariable String product) {

	    Map<String, Object> res = new HashMap<>();

	    Optional<StoreMaterial> materialOpt = storeMaterialRepository.findByMaterial(product);

	    if (!materialOpt.isPresent()) {
	        res.put("status", false);
	        res.put("message", "Product not found");
	        return res;
	    }

	    StoreMaterial material = materialOpt.get();

	    String boxInput = "false"; 

	    if (material.getCategory() != null && material.getCategory().getBoxInput() != null) {
	        boxInput = material.getCategory().getBoxInput(); 
	    }

	    res.put("status", true);
	    res.put("category", material.getCategory().getCategory());
	    res.put("boxInput", boxInput); 

	    return res;
	}
	
	@PostMapping("/verifyMaterial")
	public Map<String, Object> verifyMaterial(@RequestBody Map<String, String> req) {

		Map<String, Object> res = new HashMap<>();

		try {

			String barcode = req.get("barcode");

			if (barcode == null || barcode.trim().isEmpty()) {
				res.put("status", false);
				res.put("message", "Barcode empty");
				return res;
			}

			// CHECK IF NUMERIC
			if (!barcode.matches("\\d+")) {
				res.put("status", false);
				res.put("message", "Invalid Material Barcode");
				return res;
			}

			Optional<IncomingMaterial> material = incomingRepo.findById(Long.valueOf(barcode));

			if (material.isPresent()) {

				res.put("status", true);
				res.put("message", "Material Found");

			} else {

				res.put("status", false);
				res.put("message", "Material Not Found");
			}

		} catch (Exception e) {

			res.put("status", false);
			res.put("message", "Server error");

		}

		return res;
	}

	
	@PostMapping("/getLikestoreMaterial/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getLikestoreMaterial(@PathVariable("pageNum") int page,
			@PathVariable("pageSize") int pageSize, @RequestBody StoreMaterial jsonObject) {

		try {
			System.out.println(jsonObject);
			Pageable pageable = PageRequest.of(page, pageSize);
			String category = jsonObject.getCategory() != null
			        ? jsonObject.getCategory().getCategory()
			        : null;

			Page<StoreMaterial> object = this.storeMaterialRepository.getLikeStoreMaterial2(
			        jsonObject.getMaterial(),
			        jsonObject.getDescription(),
			        category,
			        jsonObject.getCreatedBy(),
			        pageable);
			System.out.println(object);
			return new ResponseEntity<Object>(object, HttpStatus.OK);

		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<Object>("ng", HttpStatus.OK);
		}
	}
	
	
	@PostMapping("/updateStatus/{id}")
	public ResponseEntity<?> updateStatus(@PathVariable Long id){

	    StoreMaterial material = storeMaterialRepository.findById(id)
	            .orElseThrow();

	    if("1".equals(material.getStatus())){
	        return ResponseEntity.ok("Already Scanned");
	    }

	    material.setStatus("1");
	    storeMaterialRepository.save(material);

	    return ResponseEntity.ok("Updated");
	}


	
	@PostMapping("/verifyQa")
	public Map<String, Object> verifyQa(@RequestBody Map<String, String> req) {

	    Map<String, Object> res = new HashMap<>();

	    try {

	        String qaBarcode = req.get("qaBarcode");
	        String materialBarcode = req.get("materialBarcode");

	        if (qaBarcode == null || qaBarcode.trim().isEmpty()) {
	            res.put("status", false);
	            res.put("message", "QA Barcode Empty");
	            return res;
	        }

	        if (materialBarcode == null || materialBarcode.trim().isEmpty()) {
	            res.put("status", false);
	            res.put("message", "Material Barcode Missing");
	            return res;
	        }

	        qaBarcode = qaBarcode.trim();

	        if (!qaBarcode.matches("q@[125]@\\d+")) {
	            res.put("status", false);
	            res.put("message", "Invalid QA Barcode Format");
	            return res;
	        }

	        String[] parts = qaBarcode.split("@");
	        String qaType = parts[1];
	        String qaMaterialId = parts[2];

	        if (!qaMaterialId.equals(materialBarcode)) {
	            res.put("status", false);
	            res.put("message", "QA does not belong to this Material");
	            return res;
	        }

	        Optional<StoreIncomingQuarantine> quarantine =
	                storeIncomingQuarantineRepository.findByQaBarcode(qaBarcode);

	        Optional<StoreIncomingQuality> quality =
	                storeIncomingQualityRepository.findByQaBarcode(qaBarcode);

	        if (quarantine.isPresent()) {
	            // ✅ ALWAYS PRIORITY
	            res.put("status", true);
	            res.put("qaStatus", "5");
	            res.put("message", "QA Re-Released 🔄 (From Quarantine)");
	            return res;
	        }

	        if (quality.isPresent()) {

	            String message;

	            if ("1".equals(qaType)) {
	                message = "QA Released ✔";
	            } else if ("2".equals(qaType)) {
	                message = "QA Rejected ❌";
	            } else {
	                message = "Unknown Status";
	            }

	            res.put("status", true);
	            res.put("qaStatus", qaType);
	            res.put("message", message);
	            return res;
	        }

	        // ❌ NOT FOUND IN BOTH
	        res.put("status", false);
	        res.put("message", "QA Not Found");

	    } catch (Exception e) {
	        e.printStackTrace();
	        res.put("status", false);
	        res.put("message", "Server Error");
	    }

	    return res;
	}

	@GetMapping("/getLocations")
	public List<String> getLocations() {

		List<String> list = new ArrayList<>();

		locationRepo.findAll().forEach(loc -> {
			list.add(loc.getLocationName());
		});

		return list;
	}


	
	
	@PostMapping("/verifyLocation")
	public Map<String, Object> verifyLocation(@RequestBody Map<String, String> req) {

	    Map<String, Object> res = new HashMap<>();

	    try {

	        String barcode = req.get("barcode");

	        System.out.println("RAW BARCODE: [" + barcode + "]");

	        if (barcode != null) {
	            barcode = barcode.trim();
	        }

	        System.out.println("TRIMMED BARCODE: [" + barcode + "]");

	        Optional<RackMaster> loc =
	                rackMasterRepository.findByRackCodeIgnoreCase(barcode);

	        System.out.println("FOUND: " + loc.isPresent());

	        if (loc.isPresent()) {
	            res.put("status", true);
	            res.put("message", "Location Valid");
	        } else {
	            res.put("status", false);
	            res.put("message", "Invalid Location");
	        }

	    } catch (Exception e) {
	        e.printStackTrace();
	        res.put("status", false);
	        res.put("message", "Server error");
	    }

	    return res;
	}
	
	
	@PostMapping("/suggestLocation")
	public ResponseEntity<Map<String, Object>> suggestLocation(@RequestBody Map<String, String> req) {

	    Map<String, Object> res = new HashMap<>();

	    try {
	        System.out.println("==== SUGGEST LOCATION API CALLED ====");

	        String materialBarcode = req.get("materialBarcode");
	        System.out.println("Material Barcode: " + materialBarcode);

	        Optional<IncomingMaterial> incoming =
	                incomingRepo.findById(Long.valueOf(materialBarcode));

	        if (!incoming.isPresent()) {
	            System.out.println("❌ Incoming NOT FOUND");
	            res.put("locations", Collections.emptyList());
	            return ResponseEntity.ok(res);
	        }

	        String category = incoming.get().getCategory().getCategory();
	        System.out.println("Category: " + category);

	        List<StoreMaterialLocation> previous =
	                storeMateriallocationRepository.findByCategory(category);

	        System.out.println("Previous Locations Count: " + previous.size());

	        if (previous.isEmpty()) {
	            System.out.println("❌ No previous locations found");
	            res.put("locations", Collections.emptyList());
	            return ResponseEntity.ok(res);
	        }

	        String lastLocation = previous.get(previous.size() - 1).getLocationBarcode();
	        System.out.println("Last Location: " + lastLocation);

	        String prefix = lastLocation.split("\\.")[0];
	        System.out.println("Prefix: " + prefix);

//	        List<String> suggestions =
//	                storeMateriallocationRepository.findAvailableLocations(prefix);
	        
	        List<String> suggestions =
	        		storeMateriallocationRepository.findAvailableRackLocations(prefix);;

	        System.out.println("Suggestions: " + suggestions);

	        res.put("locations", suggestions);

	        return ResponseEntity.ok(res);

	    } catch (Exception e) {
	        e.printStackTrace();
	        res.put("locations", Collections.emptyList());
	        return ResponseEntity.ok(res);
	    }
	}

	// ------------------------------------------------
	// STORE MATERIAL INWARD
	// ------------------------------------------------
	
//	@PostMapping("/storeMaterialInward")
//	public ResponseEntity<Object> storeMaterial(@RequestBody Map<String, String> request) {
//
//	    Map<String, Object> response = new HashMap<>();
//
//	    try {
//
//	        String materialBarcode = request.get("materialBarcode");
//	        String qaBarcode = request.get("qaBarcode");
//	        String locationBarcode = request.get("locationBarcode");
//	        String createdBy = request.get("createdBy");
//
//	        String now = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
//	                .format(new Date());
//
//	        // ==========================
//	        // VALIDATION
//	        // ==========================
//	        if (materialBarcode == null || materialBarcode.trim().isEmpty()) {
//	            response.put("status", false);
//	            response.put("message", "Material barcode required");
//	            return ResponseEntity.badRequest().body(response);
//	        }
//
//	        if (locationBarcode == null || locationBarcode.trim().isEmpty()) {
//	            response.put("status", false);
//	            response.put("message", "Location barcode required");
//	            return ResponseEntity.badRequest().body(response);
//	        }
//
//	        locationBarcode = locationBarcode.trim();
//
//	        Optional<RackMaster> loc =
//	                rackMasterRepository.findByRackCodeIgnoreCase(locationBarcode);
//
//	        if (!loc.isPresent()) {
//	            response.put("status", false);
//	            response.put("message", "Invalid Location");
//	            return ResponseEntity.badRequest().body(response);
//	        }
//
//	        // ==========================
//	        // FETCH SCANNED MATERIAL
//	        // ==========================
//	        Long incomingId = Long.valueOf(materialBarcode.trim());
//
//	        Optional<IncomingMaterial> incomingOpt =
//	                incomingRepo.findById(incomingId);
//
//	        if (!incomingOpt.isPresent()) {
//	            response.put("status", false);
//	            response.put("message", "Invalid Material Barcode");
//	            return ResponseEntity.badRequest().body(response);
//	        }
//
//	        IncomingMaterial incoming = incomingOpt.get();
//
//	        // ==========================
//	        // ALREADY TAGGED CHECK
//	        // ==========================
//	        if ("1".equals(incoming.getTaggingStatus())) {
//	            response.put("status", false);
//	            response.put("message", "Material already tagged");
//	            return ResponseEntity.ok(response);
//	        }
//
//	        // ==========================
//	        // FIND SAME BATCH MATERIALS
//	        // ==========================
//	        List<IncomingMaterial> materials =
//	                incomingRepo.findByPartNameAndLotNumberAndMfgDateAndExpireDate(
//	                        incoming.getPartName(),
//	                        incoming.getLotNumber(),
//	                        incoming.getMfgDate(),
//	                        incoming.getExpireDate()
//	                );
//
//	        if (materials.isEmpty()) {
//	            response.put("status", false);
//	            response.put("message", "No matching materials found");
//	            return ResponseEntity.ok(response);
//	        }
//
//	        // ==========================
//	        // LOCATION OCCUPANCY CHECK
//	        // ==========================
//	        List<StoreMaterialLocation> existingLocations =
//	                storeMateriallocationRepository
//	                        .findAllByLocationBarcode(locationBarcode);
//
//	        boolean occupied = existingLocations.stream()
//	                .anyMatch(x -> 
//	                    (x.getMaterialBarcode() != null
//	                        && !x.getMaterialBarcode().trim().isEmpty())
//	                    ||
//	                    (x.getQaBarcode() != null
//	                        && !x.getQaBarcode().trim().isEmpty())
//	                );
//
//	        if (occupied) {
//
//	            StoreMaterialLocation existing =
//	                    existingLocations.get(0);
//
//	            String message =
//	                    "Location already occupied by:\n"
//	                            + "Product: "
//	                            + existing.getPartName()
//	                            + "\nCategory: "
//	                            + existing.getCategory();
//
//	            response.put("status", false);
//	            response.put("message", message);
//
//	            return ResponseEntity.ok(response);
//	        }
//
//	        // ==========================
//	        // STORE ALL MATCHING MATERIALS
//	        // ==========================
//	        int storedCount = 0;
//
//	        for (IncomingMaterial mat : materials) {
//
//	            if ("1".equals(mat.getTaggingStatus())) {
//	                continue;
//	            }
//
//	            StoreMaterialLocation material =
//	                    new StoreMaterialLocation();
//
//	            material.setMaterialBarcode(
//	                    String.valueOf(mat.getIncomingMaterialId())
//	            );
//
//	            material.setQaBarcode(qaBarcode);
//	            material.setLocationBarcode(locationBarcode);
//
//	            material.setLocationName(
//	                    loc.get()
//	                            .getLocation()
//	                            .getLocationName()
//	            );
//
//	            material.setPartName(mat.getPartName());
//
//	            if (mat.getCategory() != null) {
//	                material.setCategory(
//	                        mat.getCategory().getCategory()
//	                );
//	            }
//
//	            material.setStatus("Stored");
//	            material.setCreatedBy(createdBy);
//	            material.setDateTimeCreation(now);
//	            material.setDateTimeModified(now);
//
//	            storeMateriallocationRepository.save(material);
//
//	            updateTagStatusAndLog(
//	                    mat,
//	                    createdBy,
//	                    now,
//	                    locationBarcode
//	            );
//
//	            storedCount++;
//	        }
//
//	        response.put("status", true);
//	        response.put("message",
//	                storedCount + " materials stored successfully");
//
//	        return ResponseEntity.ok(response);
//
//	    } catch (Exception e) {
//
//	        e.printStackTrace();
//
//	        response.put("status", false);
//	        response.put("message", "Error storing material");
//
//	        return ResponseEntity.internalServerError().body(response);
//	    }
//	}
	
	
	@PostMapping("/storeMaterialInward")
	public ResponseEntity<Object> storeMaterial(@RequestBody Map<String, String> request) {

	    Map<String, Object> response = new HashMap<>();

	    try {

	        String materialBarcode = request.get("materialBarcode");
	        String qaBarcode = request.get("qaBarcode");
	        String locationBarcode = request.get("locationBarcode");
	        String createdBy = request.get("createdBy");

	        String now = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
	                .format(new Date());

	        // ==========================
	        // VALIDATION
	        // ==========================
	        if (materialBarcode == null || materialBarcode.trim().isEmpty()) {
	            response.put("status", false);
	            response.put("message", "Material barcode required");
	            return ResponseEntity.badRequest().body(response);
	        }

	        if (locationBarcode == null || locationBarcode.trim().isEmpty()) {
	            response.put("status", false);
	            response.put("message", "Location barcode required");
	            return ResponseEntity.badRequest().body(response);
	        }

	        locationBarcode = locationBarcode.trim();

	        Optional<RackMaster> loc =
	                rackMasterRepository.findByRackCodeIgnoreCase(locationBarcode);

	        if (!loc.isPresent()) {
	            response.put("status", false);
	            response.put("message", "Invalid Location");
	            return ResponseEntity.badRequest().body(response);
	        }

	        // ==========================
	        // FETCH SCANNED MATERIAL
	        // ==========================
	        Long incomingId = Long.valueOf(materialBarcode.trim());

	        Optional<IncomingMaterial> incomingOpt =
	                incomingRepo.findById(incomingId);

	        if (!incomingOpt.isPresent()) {
	            response.put("status", false);
	            response.put("message", "Invalid Material Barcode");
	            return ResponseEntity.badRequest().body(response);
	        }

	        IncomingMaterial incoming = incomingOpt.get();
	        
	     // CHECK ALLOW MULTIPLE
	     // ==========================
	     boolean allowMultiple = false;

	     Optional<StoreMaterial> storeMaterialOpt =
	             storeMaterialRepository.findByMaterialIgnoreCase(
	                     incoming.getPartName()
	             );

	     if (storeMaterialOpt.isPresent()) {
	         allowMultiple = Boolean.TRUE.equals(
	                 storeMaterialOpt.get().getAllowMultiple()
	         );
	     }

	        // ==========================
	        // ALREADY TAGGED CHECK
	        // ==========================
	        if ("1".equals(incoming.getTaggingStatus())) {
	            response.put("status", false);
	            response.put("message", "Material already tagged");
	            return ResponseEntity.ok(response);
	        }

	        // ==========================
	        // FIND SAME BATCH MATERIALS
	        // ==========================
//	        List<IncomingMaterial> materials =
//	                incomingRepo.findByPartNameAndLotNumberAndMfgDateAndExpireDate(
//	                        incoming.getPartName(),
//	                        incoming.getLotNumber(),
//	                        incoming.getMfgDate(),
//	                        incoming.getExpireDate()
//	                );
//
//	        if (materials.isEmpty()) {
//	            response.put("status", false);
//	            response.put("message", "No matching materials found");
//	            return ResponseEntity.ok(response);
//	        }
	        
	     // ==========================
	     // FIND MATERIALS
	     // ==========================
	     List<IncomingMaterial> materials;

	     if (allowMultiple) {

	         materials =
	                 incomingRepo.findByPartNameAndLotNumberAndMfgDateAndExpireDate(
	                         incoming.getPartName(),
	                         incoming.getLotNumber(),
	                         incoming.getMfgDate(),
	                         incoming.getExpireDate()
	                 );

	     } else {

	         materials = new ArrayList<>();
	         materials.add(incoming);
	     }

	     if (materials.isEmpty()) {
	         response.put("status", false);
	         response.put("message", "No matching materials found");
	         return ResponseEntity.ok(response);
	     }

	        // ==========================
	        // LOCATION OCCUPANCY CHECK
	        // ==========================
	        List<StoreMaterialLocation> existingLocations =
	                storeMateriallocationRepository
	                        .findAllByLocationBarcode(locationBarcode);

	        boolean occupied = existingLocations.stream()
	                .anyMatch(x -> 
	                    (x.getMaterialBarcode() != null
	                        && !x.getMaterialBarcode().trim().isEmpty())
	                    ||
	                    (x.getQaBarcode() != null
	                        && !x.getQaBarcode().trim().isEmpty())
	                );

	        if (occupied) {

	            StoreMaterialLocation existing =
	                    existingLocations.get(0);

	            String message =
	                    "Location already occupied by:\n"
	                            + "Product: "
	                            + existing.getPartName()
	                            + "\nCategory: "
	                            + existing.getCategory();

	            response.put("status", false);
	            response.put("message", message);

	            return ResponseEntity.ok(response);
	        }

	        // ==========================
	        // STORE ALL MATCHING MATERIALS
	        // ==========================
	        int storedCount = 0;

	        for (IncomingMaterial mat : materials) {

	            if ("1".equals(mat.getTaggingStatus())) {
	                continue;
	            }

	            StoreMaterialLocation material =
	                    new StoreMaterialLocation();

	            material.setMaterialBarcode(
	                    String.valueOf(mat.getIncomingMaterialId())
	            );

	         //   material.setQaBarcode(qaBarcode);
	            Optional<StoreIncomingQuality> qaOpt =
	                    storeIncomingQualityRepository
	                            .findByInMaterial_IncomingMaterialId(
	                                    mat.getIncomingMaterialId()
	                            );

	            if (qaOpt.isPresent()) {
	                material.setQaBarcode(qaOpt.get().getQaBarcode());
	            }
	            material.setLocationBarcode(locationBarcode);

	            material.setLocationName(
	                    loc.get()
	                            .getLocation()
	                            .getLocationName()
	            );

	            material.setPartName(mat.getPartName());

	            if (mat.getCategory() != null) {
	                material.setCategory(
	                        mat.getCategory().getCategory()
	                );
	            }

	            material.setStatus("Stored");
	            material.setCreatedBy(createdBy);
	            material.setDateTimeCreation(now);
	            material.setDateTimeModified(now);

	            storeMateriallocationRepository.save(material);

	            updateTagStatusAndLog(
	                    mat,
	                    createdBy,
	                    now,
	                    locationBarcode
	            );

	            storedCount++;
	        }

	        response.put("status", true);
	        response.put("message",
	                storedCount + " materials stored successfully");

	        return ResponseEntity.ok(response);

	    } catch (Exception e) {

	        e.printStackTrace();

	        response.put("status", false);
	        response.put("message", "Error storing material");

	        return ResponseEntity.internalServerError().body(response);
	    }
	}

//	@PostMapping("/storeMaterialInward")
//	public ResponseEntity<Object> storeMaterial(@RequestBody Map<String, String> request) {
//
//	    Map<String, Object> response = new HashMap<>();
//
//	    try {
//
//	        String materialBarcode = request.get("materialBarcode");
//	        String qaBarcode = request.get("qaBarcode");
//	        String locationBarcode = request.get("locationBarcode");
//	        String createdBy = request.get("createdBy");
//
//	        String now = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
//
//	        // 🔹 VALIDATION
//	        if (materialBarcode == null || materialBarcode.trim().isEmpty()) {
//	            response.put("status", false);
//	            response.put("message", "Material barcode required");
//	            return ResponseEntity.badRequest().body(response);
//	        }
//
//	        if (locationBarcode == null || locationBarcode.trim().isEmpty()) {
//	            response.put("status", false);
//	            response.put("message", "Location barcode required");
//	            return ResponseEntity.badRequest().body(response);
//	        }
//
//	        locationBarcode = locationBarcode.trim();
//
//	        Optional<RackMaster> loc = rackMasterRepository.findByRackCodeIgnoreCase(locationBarcode);
//
//	        if (!loc.isPresent()) {
//	            response.put("status", false);
//	            response.put("message", "Invalid Location");
//	            return ResponseEntity.badRequest().body(response);
//	        }
//
//	        // 🔹 FETCH INCOMING MATERIAL
//	        Long incomingId = Long.valueOf(materialBarcode.trim());
//	        Optional<IncomingMaterial> incomingOpt = incomingRepo.findById(incomingId);
//
//	        if (!incomingOpt.isPresent()) {
//	            response.put("status", false);
//	            response.put("message", "Invalid Material Barcode");
//	            return ResponseEntity.badRequest().body(response);
//	        }
//
//	        IncomingMaterial incoming = incomingOpt.get();
//	        
//	        String productName = incoming.getPartName();
//            String category = incoming.getCategory() != null
//                    ? incoming.getCategory().getCategory()
//                    : "Unknown";
//            
//            String category2 = incoming.getCategory().getCategory();
//            
//            System.out.println("category" + category );
//	        
//	  
//	        // 🔥 DUPLICATE TAG CHECK
//	        if ("1".equals(incoming.getTaggingStatus())) {
//	            response.put("status", false);
//	            response.put("message", "Material already tagged");
//	            return ResponseEntity.ok(response);
//	        }
//
//	        // 🔹 CHECK EXISTING LOCATION
//	        Optional<StoreMaterialLocation> existing =
//	                storeMateriallocationRepository.findByLocationBarcode(locationBarcode);
//
//	        // =========================================================
//	        // ✅ CASE 1: LOCATION EXISTS
//	        // =========================================================
//	        if (existing.isPresent()) {
//
//	            StoreMaterialLocation material = existing.get();
//
//	            boolean isMaterialEmpty = material.getMaterialBarcode() == null
//	                    || material.getMaterialBarcode().trim().isEmpty();
//
//	            boolean isQaEmpty = material.getQaBarcode() == null
//	                    || material.getQaBarcode().trim().isEmpty();
//
//	            boolean isCompletelyEmpty = isMaterialEmpty && isQaEmpty;
//
//	            // ✅ EMPTY LOCATION → STORE
//	            if (isCompletelyEmpty) {
//
//	                material.setMaterialBarcode(materialBarcode);
//	                material.setQaBarcode(qaBarcode);
//	                material.setPartName(productName);     
//	                material.setCategory(category2); 
//	                material.setStatus("Stored");
//	                material.setCreatedBy(createdBy);
//	                material.setDateTimeCreation(now);
//	                material.setDateTimeModified(now);
//	                material.setLocationName(loc.get().getLocation().getLocationName());
//
//	                storeMateriallocationRepository.save(material);
//
//	                // 🔥 UPDATE TAG + LOG
//	                updateTagStatusAndLog(incoming, createdBy, now,locationBarcode);
//
//	                response.put("status", true);
//	                response.put("message", "Stored in empty location");
//
//	                return ResponseEntity.ok(response);
//	            }
//
//	            // ❌ OCCUPIED LOCATION
//	         
//
//	            String message = "Location already occupied by:\n"
//	                    + "Product: " + productName + "\n"
//	                    + "Category: " + category;
//
//	            response.put("status", false);
//	            response.put("message", message);
//
//	            return ResponseEntity.ok(response);
//	        }
//
//	        // =========================================================
//	        // ✅ CASE 2: NEW LOCATION
//	        // =========================================================
//	        StoreMaterialLocation material = new StoreMaterialLocation();
//
//	        material.setMaterialBarcode(materialBarcode);
//	        material.setQaBarcode(qaBarcode);
//	        material.setLocationBarcode(locationBarcode);
//	        material.setQaBarcode(qaBarcode);
//            material.setPartName(productName); 
//            material.setCategory(category2);
//	        material.setStatus("Stored");
//	        material.setCreatedBy(createdBy);
//	        material.setDateTimeCreation(now);
//	        material.setDateTimeModified(now);
//	        material.setLocationName(loc.get().getLocation().getLocationName());
//
//	        storeMateriallocationRepository.save(material);
//
//	        // 🔥 UPDATE TAG + LOG
//	        updateTagStatusAndLog(incoming, createdBy, now,locationBarcode);
//
//	        response.put("status", true);
//	        response.put("message", "Material stored successfully");
//
//	        return ResponseEntity.ok(response);
//
//	    } catch (Exception e) {
//	        e.printStackTrace();
//
//	        response.put("status", false);
//	        response.put("message", "Error storing material");
//
//	        return ResponseEntity.internalServerError().body(response);
//	    }
//	}
	
	private void updateTagStatusAndLog(IncomingMaterial incoming, String createdBy, String now,String location) {

	    try {

	        // 🔥 PREVENT DOUBLE TAGGING
	        if ("1".equals(incoming.getTaggingStatus())) {
	            return;
	        }

	        // ✅ UPDATE TAG STATUS
	        incoming.setTaggingStatus("1");
	        incoming.setDateTimeModified(now);

	        incomingRepo.save(incoming);

	        // ✅ SAVE LOG
	        Qualityincoming log = new Qualityincoming();
	        log.setInMaterial(incoming);
	        log.setStatus(incoming.getQa());
	        log.setCreatedBy(createdBy);
	        log.setQaStatus("Material Tagged");
	        log.setDateTimeCreation(now);
	        log.setDateTimeModified(now);
	        log.setOperation("Store Tag");
	        log.setRemark("Location : "+location);

	        qualityRepo.save(log);

	    } catch (Exception e) {
	        e.printStackTrace();
	    }
	}
	
	
	
	
    @GetMapping("/pending-putaway")
    public ResponseEntity<?> getPendingPutaway() {

        try {

            List<IncomingMaterial> list = incomingRepo.findPendingPutaway();
            
            System.out.println("list: "+list);

            List<PendingPutawayDTO> response = list.stream()
                    .map(PendingPutawayDTO::new)
                    .collect(Collectors.toList());
            
            System.out.println("response: "+response);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching data");
        }
    }
	

	

	@GetMapping("/getMaterialByBarcode/{barcode}")
	public ResponseEntity<?> getMaterial(@PathVariable String barcode) {

		Optional<IncomingMaterial> material = incomingRepo.findById(Long.valueOf(barcode));

		if (!material.isPresent()) {
			return ResponseEntity.notFound().build();
		}

		return ResponseEntity.ok(material.get());
	}

	@Autowired
	private Environment env;

	@Autowired
	private ZebraUsbPrinterService printerService;

	@PostMapping("/label")
	public ResponseEntity<String> printLabel(@RequestBody Map<String, String> body) {

		try {

			String id = body.get("id");
			String partNo = body.get("partNo");
			String qty = body.get("quantity");
			String lot = body.get("lotNumber");
			String incoming = body.get("incomingDate");
			String mfg = body.get("mfgDate");
			String exp = body.get("expireDate");

			if (id == null)
				return ResponseEntity.badRequest().body("ID missing");

			// default printer
			String printerName = env.getProperty("printer.default");

			String template = env.getProperty("zebra.label.template");

			String zpl = String.format(template, id, partNo, qty, lot, incoming, mfg, exp, id);

			printerService.printZpl(printerName, zpl);

			return ResponseEntity.ok("Label printed");

		} catch (Exception e) {
			return ResponseEntity.internalServerError().body("Print error");
		}
	}
	
	
	
	
	
	////------------------------------
	
	@PostMapping("/verifyLabelTag")
	public Map<String, Object> verifyLabelTag(@RequestBody Map<String, String> req) {
			
	    Map<String, Object> res = new HashMap<>();

	    try {
	        String incoming = req.get("incomingBarcode");
	        String label = req.get("labelBarcode");
	        System.out.println("incoming "+incoming);
	        System.out.println("label "+label);

	        // ✅ Basic validation
	        if (incoming == null || label == null) {
	            res.put("success", false);
	            res.put("message", "Invalid request data");
	            return res;
	        }

	        // ✅ Parse label first
	        String[] parts = label.split("@");

	        if (parts.length != 3) {
	            res.put("success", false);
	            res.put("message", "Invalid label format");
	            return res;
	        }

	        String prefix = parts[0];
	        String status = parts[1];
	        String labelId = parts[2];

	        // ✅ Validate prefix
	        if (!"q".equalsIgnoreCase(prefix)) {
	            res.put("success", false);
	            res.put("message", "Invalid QA barcode");
	            return res;
	        }

	        // ❌ Rejected
	        if ("2".equals(status)) {
	            res.put("success", false);
	            res.put("message", "Material Rejected");
	            return res;
	        }

	        // ❌ Not match
	        if (!incoming.equals(labelId)) {
	            res.put("success", false);
	            res.put("message", "Label does not match incoming");
	            return res;
	        }

	        // ✅ DB validation
	        Optional<IncomingMaterial> incomingData =
	                incomingRepo.findById(Long.parseLong(incoming));

	        if (!incomingData.isPresent()) {
	            res.put("success", false);
	            res.put("message", "Incoming barcode not found");
	            return res;
	        }

	        Optional<StoreIncomingQuality> qaData =
	                storeIncomingQualityRepository.findByQaBarcode(label);

	        if (!qaData.isPresent()) {
	            res.put("success", false);
	            res.put("message", "QA barcode not found");
	            return res;
	        }

	        // ❌ Already scanned
	        String labestatus = qaData.get().getQaLabelPasteStatus();

	        if ("1".equals(labestatus)) {
	            res.put("success", false);
	            res.put("message", "Already Scanned");
	            return res;
	        }

	        // ✅ Update
	        storeIncomingQualityRepository.updateQaLabelStatus(label);

	        res.put("success", true);
	        res.put("message", "Label Verified Successfully");
	        
	        //insert into  qa log
	        String now = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
	        Qualityincoming log = new Qualityincoming();
            log.setInMaterial(incomingData.get());
            log.setStatus("PASTED");
            log.setCreatedBy(req.get("createdBy").toString());
            log.setQaStatus("RELEASED");
            log.setDateTimeCreation(now);
            log.setDateTimeModified(now);
            log.setOperation("Quality");
            log.setRemark("PASTED");

            qualityRepo.save(log);
	        

	    } catch (Exception e) {
	        res.put("success", false);
	        res.put("message", "Server Error");
	    }

	    return res;
	}
	
	
	
	@PostMapping("/verifyQuarantineTag")
	public Map<String, Object> verifyQuarantineTag(@RequestBody Map<String, String> req) {

	    Map<String, Object> res = new HashMap<>();

	    try {
	        String quarantineBarcode = req.get("quarantineBarcode");
	        String locationBarcode = req.get("locationBarcode");
	        String createdBy = req.get("createdBy");
	        
	       

	        // ✅ Basic validation
	        if (quarantineBarcode == null || locationBarcode == null) {
	            res.put("success", false);
	            res.put("message", "Invalid request");
	            return res;
	        }

	        // ✅ Parse barcode
	        String[] parts = quarantineBarcode.split("@");

	        if (parts.length != 3) {
	            res.put("success", false);
	            res.put("message", "Invalid barcode format");
	            return res;
	        }

	        String prefix = parts[0];
	        String status = parts[1];
	        String materialId = parts[2];

	        // ✅ Validate prefix
	        if (!"q".equalsIgnoreCase(prefix)) {
	            res.put("success", false);
	            res.put("message", "Invalid quarantine barcode");
	            return res;
	        }
	        // ✅ Accept only 2 or 3
	        if (!status.equals("2") && !status.equals("3")) {
	            res.put("success", false);
	            res.put("message", "Not a quarantine material");
	            return res;
	        }

	        // ✅ Check barcode exists
	        Optional<StoreIncomingQuarantine> data =
	        		storeIncomingQuarantineRepository.findByQaBarcode(quarantineBarcode);

	        if (!data.isPresent()) {
	            res.put("success", false);
	            res.put("message", "Barcode not found");
	            return res;
	        }

	        // ❌ Already tagged
	        if ("1".equals(data.get().getQuarantineLabelPasteStatus())) {
	            res.put("success", false);
	            res.put("message", "Already Tagged");
	            return res;
	        }

	        // ✅ Check location exists (rack_master)
//	        Optional<RackMaster> rack =
//	        		rackMasterRepository.findByRackCode(locationBarcode);
//	        System.out.println("ok3");
//	        if (!rack.isPresent()) {
//	            res.put("success", false);
//	            res.put("message", "Invalid Location");
//	            return res;
//	        }
//	        if(!rack.get().getLocation().getLocationName().equals("Quarnatine")) {
//	        	res.put("success", false);
//	            res.put("message", "Please Scan Quarantine Location");
//	            return res;
//	        }
	        Optional<RackMaster> rack =
	                rackMasterRepository.findByRackCodeAndLocation_LocationName(locationBarcode, "QUARANTINE");

	        if (!rack.isPresent()) {
	            res.put("success", false);
	            res.put("message", "Invalid or Non-Quarantine Location");
	            return res;
	        }

	        // ❌ Check location already used
	        Optional<StoreIncomingQuarantine> locationUsed =
	        		storeIncomingQuarantineRepository.findByLocation(locationBarcode);

	        if (locationUsed.isPresent()) {
	            res.put("success", false);
	            res.put("message", "Location Already Occupied "+locationUsed.get().getInMaterial().getPartName());
	            return res;
	        }

	        // ✅ UPDATE
	        storeIncomingQuarantineRepository.updateLocationAndStatus(quarantineBarcode, locationBarcode);
	        // ✅ LOG
	        String now = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());

	        Qualityincoming log = new Qualityincoming();
            log.setInMaterial(data.get().getInMaterial());
            log.setStatus("PASTED");
            log.setCreatedBy(req.get("createdBy").toString());
            log.setQaStatus("REJECTED");
            log.setDateTimeCreation(now);
            log.setDateTimeModified(now);
            log.setOperation("Quarantine");
            log.setRemark(locationBarcode);

            qualityRepo.save(log);

	        res.put("success", true);
	        res.put("message", "Quarantine Tagged Successfully");

	    } catch (Exception e) {
	        res.put("success", false);
	        res.put("message", "Server Error");
	    }

	    return res;
	}
	
	
	
	@PostMapping("/verifyQuarantineLabelTag")
	public Map<String, Object> verifyQuarantineLabelTag(@RequestBody Map<String, String> req) {
			
	    Map<String, Object> res = new HashMap<>();

	    try {
	        String incoming = req.get("incomingBarcode");
	        String label = req.get("labelBarcode");
	        System.out.println("incoming "+incoming);
	        System.out.println("label "+label);

	        // ✅ Basic validation
	        if (incoming == null || label == null) {
	            res.put("success", false);
	            res.put("message", "Invalid request data");
	            return res;
	        }

	        // ✅ Parse label first
	        String[] parts = label.split("@");

	        if (parts.length != 3) {
	            res.put("success", false);
	            res.put("message", "Invalid label format");
	            return res;
	        }

	        String prefix = parts[0];
	        String status = parts[1];
	        String labelId = parts[2];

	        // ✅ Validate prefix
	        if (!"q".equalsIgnoreCase(prefix)) {
	            res.put("success", false);
	            res.put("message", "Invalid Quarantine Barcode");
	            return res;
	        }

	       

	        // ❌ Not match
	        if (!incoming.equals(labelId)) {
	            res.put("success", false);
	            res.put("message", "Label does not match incoming");
	            return res;
	        }

	        // ✅ DB validation
	        Optional<IncomingMaterial> incomingData =
	                incomingRepo.findById(Long.parseLong(incoming));

	        if (!incomingData.isPresent()) {
	            res.put("success", false);
	            res.put("message", "Incoming barcode not found");
	            return res;
	        }
	        if(!"5".equals(incomingData.get().getStatus())){
	        	 res.put("success", false);
		         res.put("message", "Material is not re-released");
		         return res;
	        }

	        Optional<StoreIncomingQuarantine> qaData =
	        		storeIncomingQuarantineRepository.findByQaBarcode(label);

	        if (!qaData.isPresent()) {
	            res.put("success", false);
	            res.put("message", "Quarantine barcode not found");
	            return res;
	        }

	        // ❌ Already scanned
	        String labestatus = qaData.get().getQuarantineLabelPasteStatus();

	        if ("1".equals(labestatus)) {
	            res.put("success", false);
	            res.put("message", "Already Scanned");
	            return res;
	        }

	        // ✅ Update
	        storeIncomingQuarantineRepository.updateQaLabelStatus(label);

	        res.put("success", true);
	        res.put("message", "Label Verified Successfully");
	        
	        //insert into  qa log
	        String now = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
	        Qualityincoming log = new Qualityincoming();
            log.setInMaterial(incomingData.get());
            log.setStatus("PASTED");
            log.setCreatedBy(req.get("createdBy").toString());
            log.setQaStatus("RERELEASED");
            log.setDateTimeCreation(now);
            log.setDateTimeModified(now);
            log.setOperation("Quarantine");
            log.setRemark("PASTED");

            qualityRepo.save(log);
	        

	    } catch (Exception e) {
	        res.put("success", false);
	        res.put("message", "Server Error");
	    }

	    return res;
	}
	
	

}


