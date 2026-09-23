package web.minda.project.controller;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTSdtPr;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import web.minda.project.dto.IncomingDTO;
import web.minda.project.dto.PendingPutawayDTO;
import web.minda.project.dto.SupplierClaimDTO;
import web.minda.project.entity.IncomingMaterial;
import web.minda.project.entity.LoginMaster;
import web.minda.project.entity.Qualityincoming;
import web.minda.project.entity.StoreIncomingQuality;
import web.minda.project.entity.StoreIncomingQuarantine;
import web.minda.project.entity.StoreMaterial;
import web.minda.project.entity.StoreMaterialLocation;
import web.minda.project.entity.StoreQuarantineExpireDateExtend;
import web.minda.project.entity.SupplierClaim;
import web.minda.project.repositories.IncomingMaterialRepository;
import web.minda.project.repositories.LoginMasterRepository;
import web.minda.project.repositories.QualityIncomingRepository;
import web.minda.project.repositories.StoreIncomingQualityRepository;
import web.minda.project.repositories.StoreIncomingQuarantineRepository;
import web.minda.project.repositories.StoreMaterialRepository;
import web.minda.project.repositories.StoreMateriallocationRepository;
import web.minda.project.repositories.StoreQuarantineExpireDateExtendRepository;
import web.minda.project.repositories.SupplierClaimRepository;
import web.minda.project.repositories.SupplierMasterRepository;
import web.minda.project.service.ZebraUsbPrinterService;

@RestController
@RequestMapping("/Controllers")
public class IncomingControllers {
	
    @Autowired
    private IncomingMaterialRepository incomingRepo;

    @Autowired
    private QualityIncomingRepository qualityRepo;
    @Autowired
    private SupplierMasterRepository supplierMasterRepository;
    
    
    @Autowired
    private StoreIncomingQualityRepository storeIncomingQualityRepo;
    
    @Autowired
    private StoreIncomingQuarantineRepository storeIncomingQuarantineRepo;
    
    @Autowired
    private StoreQuarantineExpireDateExtendRepository storeQuarantineExpireDateExtendRepo;
    
	@Autowired
	private StoreMateriallocationRepository storeMateriallocationRepository;
	
	@Autowired
	private SupplierClaimRepository supplierClaimRepository;
	
	
	@Autowired
	private LoginMasterRepository loginMasterRepository;
	
	@Autowired
	private StoreMaterialRepository storeMaterialRepository;
   

    
    @GetMapping("/getAllSupplier")
    public ResponseEntity<?> getAllSupplier() {
        List<String> supplierNames = supplierMasterRepository.findAll()
                .stream()
                .map(s -> s.getSupplierName()) 
                .toList();

        return ResponseEntity.ok(supplierNames);
    }
    

    

    
    

    
    
    // ================= GET ALL =================
    @GetMapping("/getAll")
    public ResponseEntity<?> getAllIncoming(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String partName,
            @RequestParam(required = false) String supplierName,
            @RequestParam(required = false) String partType,
            @RequestParam(required = false) String lotNumber,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status
    ) {

        Page<IncomingMaterial> incomingPage =
                incomingRepo.findFilteredDataIncoming(
                        emptyToNull(partName),
                        emptyToNull(lotNumber),
                        emptyToNull(supplierName),
                        emptyToNull(partType),
                        emptyToNull(category),
                        emptyToNull(status),
                        PageRequest.of(page, size)
                );
        


        List<IncomingDTO> result = incomingPage.getContent().stream().map(inc -> {

            IncomingDTO dto = new IncomingDTO();

            // ================= BASIC =================
            dto.setIncomingMaterialId(inc.getIncomingMaterialId());
            dto.setPartName(inc.getPartName());
            dto.setLotNumber(inc.getLotNumber());
            dto.setQuantity(inc.getQuantity());
            dto.setMfgDate(inc.getMfgDate());
            dto.setExpireDate(inc.getExpireDate());

            dto.setQa(inc.getQa());
            dto.setSupplierName(inc.getSupplier());
            dto.setDateTime(inc.getDateTimeModified());
            dto.setCreatedBy(inc.getCreatedBy());
            dto.setQaStatus(inc.getQaStatus());
            Optional<StoreMaterial> descOptional =  storeMaterialRepository.findByMaterial(inc.getPartName());
            dto.setDescription(descOptional.get().getDescription());
            dto.setBoxno(inc.getBoxNo());

            if (inc.getCategory() != null) {
                dto.setCategory(inc.getCategory().getCategory());
            }

            // ================= QUALITY (LATEST) =================
            if (inc.getStoreIncomingQuality() != null && !inc.getStoreIncomingQuality().isEmpty()) {

                StoreIncomingQuality latestQuality = inc.getStoreIncomingQuality()
                        .stream()
                        .max(Comparator.comparing(StoreIncomingQuality::getStoreIncomingQualityId))
                        .orElse(null);

                if (latestQuality != null) {
                    dto.setPartType(latestQuality.getPart_type());
                    dto.setQaDocPath(latestQuality.getQaDocPath());
                    dto.setRemark(latestQuality.getRemark());
                    dto.setQaLabelPasteStatus(latestQuality.getQaLabelPasteStatus());
                }
            }

            // ================= QUARANTINE (LATEST) =================
            if (inc.getStoreIncomingQuarantine() != null && !inc.getStoreIncomingQuarantine().isEmpty()) {

                StoreIncomingQuarantine latestQuarantine = inc.getStoreIncomingQuarantine()
                        .stream()
                        .max(Comparator.comparing(StoreIncomingQuarantine::getStoreIncomingQuarantineId))
                        .orElse(null);

                if (latestQuarantine != null) {
                    dto.setQuarentineRemark(latestQuarantine.getQuarentineRemark());
                    dto.setQuarantineDocPath(latestQuarantine.getQuarantineDocument());
                    dto.setQuarantineLabelPasteStatus(latestQuarantine.getQuarantineLabelPasteStatus());
                    dto.setLocation(latestQuarantine.getLocation());
                }
            }

            // ================= LOCATION (LATEST - WITHOUT MAPPING) =================
            Optional<StoreMaterialLocation> locOpt =
            		storeMateriallocationRepository.findTopByMaterialBarcodeOrderByStoreMaterialLocationIdDesc(
                            String.valueOf(inc.getIncomingMaterialId())
                    );

            locOpt.ifPresent(loc -> dto.setStoreLocation(loc.getLocationName()));

            return dto;

        }).toList();

        return ResponseEntity.ok(Map.of(
                "data", result,
                "total", incomingPage.getTotalElements()
        ));
    }
    
    
    
    @GetMapping("/mainStore")
    public ResponseEntity<?> getMainStore(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String partName,
            @RequestParam(required = false) String supplierName,
            @RequestParam(required = false) String partType,
            @RequestParam(required = false) String lotNumber,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String location   // ✅ NEW
    ) {

        Page<IncomingMaterial> incomingPage =
                incomingRepo.findMainStoreData(
                        emptyToNull(partName),
                        emptyToNull(lotNumber),
                        emptyToNull(supplierName),
                        emptyToNull(partType),
                        emptyToNull(category),
                        emptyToNull(status),
                        emptyToNull(location),   // ✅ NEW
                        PageRequest.of(page, size)
                );

//        incomingPage.getContent().forEach(inc -> {
//            System.out.println("==== RAW QUERY RESULT ====");
//            System.out.println("ID: " + inc.getIncomingMaterialId());
//            System.out.println("Part: " + inc.getPartName());
//            System.out.println("Lot: " + inc.getLotNumber());
//            System.out.println("Supplier: " + inc.getSupplier());
//            System.out.println("QA Status: " + inc.getQaStatus());
//        });

        List<IncomingDTO> result = incomingPage.getContent().stream().map(inc -> {

            IncomingDTO dto = new IncomingDTO();

            // ================= BASIC =================
            dto.setIncomingMaterialId(inc.getIncomingMaterialId());
            dto.setPartName(inc.getPartName());
            dto.setLotNumber(inc.getLotNumber());
            dto.setQuantity(inc.getQuantity());
            dto.setMfgDate(inc.getMfgDate());
            dto.setExpireDate(inc.getExpireDate());

            dto.setQa(inc.getQa());
            dto.setSupplierName(inc.getSupplier());
            dto.setDateTime(inc.getDateTimeModified());
            dto.setCreatedBy(inc.getCreatedBy());
            dto.setQaStatus(inc.getQaStatus());
            dto.setBoxno(inc.getBoxNo());

            if (inc.getCategory() != null) {
                dto.setCategory(inc.getCategory().getCategory());
            }
            
            Optional<StoreMaterial> descOptional =  storeMaterialRepository.findByMaterial(inc.getPartName());
            dto.setDescription(descOptional.get().getDescription());

            // ================= QUALITY (LATEST) =================
            if (inc.getStoreIncomingQuality() != null && !inc.getStoreIncomingQuality().isEmpty()) {

                StoreIncomingQuality latestQuality = inc.getStoreIncomingQuality()
                        .stream()
                        .max(Comparator.comparing(StoreIncomingQuality::getStoreIncomingQualityId))
                        .orElse(null);

                if (latestQuality != null) {
                    dto.setPartType(latestQuality.getPart_type());
                    dto.setQaDocPath(latestQuality.getQaDocPath());
                    dto.setRemark(latestQuality.getRemark());
                    dto.setQaLabelPasteStatus(latestQuality.getQaLabelPasteStatus());
                }
            }

            // ================= QUARANTINE (LATEST) =================
            if (inc.getStoreIncomingQuarantine() != null && !inc.getStoreIncomingQuarantine().isEmpty()) {

                StoreIncomingQuarantine latestQuarantine = inc.getStoreIncomingQuarantine()
                        .stream()
                        .max(Comparator.comparing(StoreIncomingQuarantine::getStoreIncomingQuarantineId))
                        .orElse(null);

                if (latestQuarantine != null) {
                    dto.setQuarentineRemark(latestQuarantine.getQuarentineRemark());
                    dto.setQuarantineDocPath(latestQuarantine.getQuarantineDocument());
                    dto.setQuarantineLabelPasteStatus(latestQuarantine.getQuarantineLabelPasteStatus());
                    dto.setLocation(latestQuarantine.getLocation());
                }
            }

            // ================= LOCATION (LATEST - WITHOUT MAPPING) =================
            Optional<StoreMaterialLocation> locOpt =
            		storeMateriallocationRepository.findTopByMaterialBarcodeOrderByStoreMaterialLocationIdDesc(
                            String.valueOf(inc.getIncomingMaterialId())
                    );

            locOpt.ifPresent(loc -> dto.setStoreLocation(loc.getLocationBarcode()));
      
           

            return dto;

        }).toList();
        
        return ResponseEntity.ok(Map.of(
                "data", result,
                "total", incomingPage.getTotalElements()
        ));
    }

   
    // ===================== QUALITY =====================
    @GetMapping("/getAllQuality")
    public ResponseEntity<?> getAllQuality(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String partName,
            @RequestParam(required = false) String supplierName,
            @RequestParam(required = false) String partType,
            @RequestParam(required = false) String lotNumber,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status
    ) {

        Page<StoreIncomingQuality> pageData =
                incomingRepo.findQualityData(
                        emptyToNull(partName),
                        emptyToNull(lotNumber),
                        emptyToNull(supplierName),
                        emptyToNull(partType),
                        emptyToNull(category),
                        emptyToNull(status),
                        PageRequest.of(page, size)
                );
        
 
       

        List<IncomingDTO> result = pageData.getContent().stream().map(q -> {

            IncomingMaterial inc = q.getInMaterial();

            IncomingDTO dto = new IncomingDTO();

            dto.setIncomingMaterialId(inc.getIncomingMaterialId());
            dto.setPartName(inc.getPartName());
            dto.setLotNumber(inc.getLotNumber());
            dto.setQuantity(inc.getQuantity());
            dto.setMfgDate(inc.getMfgDate());
            dto.setExpireDate(inc.getExpireDate());

            dto.setQa(inc.getQa());
            dto.setSupplierName(inc.getSupplier());
            dto.setSupplierName(inc.getSupplier());
            dto.setBoxno(inc.getBoxNo());
  
            dto.setQaDocPath(q.getQaDocPath());  
            dto.setRemark(q.getRemark());   
            dto.setQaLabelPasteStatus(q.getQaLabelPasteStatus());
            dto.setPartType(q.getPart_type());

            if (inc.getCategory() != null) {
                dto.setCategory(inc.getCategory().getCategory());
            }
            
            Optional<StoreMaterial> descOptional =  storeMaterialRepository.findByMaterial(inc.getPartName());
            dto.setDescription(descOptional.get().getDescription());
            dto.setDateTime(inc.getDateTimeCreation());
            dto.setCreatedBy(q.getCreatedBy());

            return dto;
        }).toList();

        return ResponseEntity.ok(Map.of(
                "data", result,
                "total", pageData.getTotalElements()
        ));
    }

    // ===================== QUARANTINE =====================
    @GetMapping("/getAllQuarantine")
    public ResponseEntity<?> getAllQuarantine(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String partName,
            @RequestParam(required = false) String supplierName,
            @RequestParam(required = false) String partType,
            @RequestParam(required = false) String lotNumber,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status
    ) {

        Page<StoreIncomingQuarantine> pageData =
                incomingRepo.findQuarantineData(
                        emptyToNull(partName),
                        emptyToNull(lotNumber),
                        emptyToNull(supplierName),
                        emptyToNull(partType),
                        emptyToNull(category),
                        emptyToNull(status),
                        PageRequest.of(page, size)
                );

        List<IncomingDTO> result = pageData.getContent().stream().map(qt -> {

            IncomingMaterial inc = qt.getInMaterial();

            IncomingDTO dto = new IncomingDTO();

            dto.setIncomingMaterialId(inc.getIncomingMaterialId());
            dto.setPartName(inc.getPartName());
            dto.setLotNumber(inc.getLotNumber());
            dto.setQuantity(inc.getQuantity());
            dto.setMfgDate(inc.getMfgDate());
           // dto.setExpireDate(inc.getExpireDate());
            
            List<StoreQuarantineExpireDateExtend> extendList =
                    storeQuarantineExpireDateExtendRepo.findLatestByIncomingId(inc.getIncomingMaterialId());
            
            Optional<StoreMaterial> descOptional =  storeMaterialRepository.findByMaterial(inc.getPartName());
            dto.setDescription(descOptional.get().getDescription());
            dto.setBoxno(inc.getBoxNo());

            if (!extendList.isEmpty()) {
                dto.setExpireDate(extendList.get(0).getExpireDate()); // latest
            } else {
                dto.setExpireDate(inc.getExpireDate());
            }

            dto.setQa(inc.getQa());
            dto.setSupplierName(inc.getSupplier());
            
            dto.setQuarantineDocPath(qt.getQuarantineDocument());
            
            dto.setQuarentineRemark(qt.getQuarentineRemark());  
            

            dto.setPartType(qt.getPart_type());
            dto.setLocation(qt.getLocation());
            
            dto.setCreatedBy(qt.getCreatedBy());
            dto.setDateTime(inc.getDateTimeCreation());

            if (inc.getCategory() != null) {
                dto.setCategory(inc.getCategory().getCategory());
            }

            return dto;
        }).toList();
        


        return ResponseEntity.ok(Map.of(
                "data", result,
                "total", pageData.getTotalElements()
        ));
    }

    // ===================== HELPER =====================
    private String emptyToNull(String value) {
        return (value == null || value.trim().isEmpty()) ? null : value;
    }
    
    @GetMapping("/pendingCount48h")
    public ResponseEntity<?> getPending48hCount() {

        String timeLimit = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
                .format(new java.util.Date(System.currentTimeMillis() - (48L * 60 * 60 * 1000)));
        
        System.out.println("timeLimit:  "+timeLimit);

        long count = incomingRepo.countPendingOlderThan(timeLimit);
        System.out.println("count:  "+count);

        return ResponseEntity.ok(Map.of("count", count));
    }
    
    
    @GetMapping("/pending48h")
    public ResponseEntity<?> getPending48h() {

        String timeLimit = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
                .format(new Date(System.currentTimeMillis() - (48L * 60 * 60 * 1000)));

        long count = incomingRepo.countPendingOlderThan(timeLimit);
        List<IncomingMaterial> list = incomingRepo.findPendingOlderThan(timeLimit);

        return ResponseEntity.ok(Map.of(
                "count", count,
                "data", list
        ));
    }
    
    

	@Autowired
	private Environment env;

	@Autowired
	private ZebraUsbPrinterService printerService;
	
	@Value("${qa.upload.path}")
	private String folderPath;
	

	private String getQaStatusCode(String qaStatus) {
	    switch (qaStatus.toUpperCase()) {
	        case "RELEASED": return "1";
	        case "REJECTED": return "2";
	        case "SENDBACK": return "4";
	        case "RERELEASE": return "5";
	        case "SCRAP": return "6";
	        default: throw new RuntimeException("Invalid QA Status: " + qaStatus);
	    }
	}
	

    
	@PostMapping(value = "/qaAction", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> qaAction(
	        @RequestParam Long incomingId,
	        @RequestParam String qaStatus,
	        @RequestParam(required = false) String partType,
	        @RequestParam String passType,
	        @RequestParam(required = false) MultipartFile document,
	        @RequestParam(required = false) String remark,
	        @RequestParam(required = false) String moduleType,
	        @RequestParam(required = false) String newExpireDate
	) {

	    Map<String, Object> response = new HashMap<>();

	    try {

	        IncomingMaterial incoming = incomingRepo.findById(incomingId)
	                .orElseThrow(() -> new RuntimeException("Incoming not found"));

	        String now = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());

	        String employeeId = SecurityContextHolder
	                .getContext()
	                .getAuthentication()
	                .getName();

	        boolean isFromQuarantine = "QUARANTINE".equalsIgnoreCase(moduleType);

	        // ================= FILE UPLOAD =================
	        String filePath = null;

	        if (document != null && !document.isEmpty()) {
	            File folder = new File(folderPath);
	            if (!folder.exists()) folder.mkdirs();

	            String fileName = incomingId + "_" + System.currentTimeMillis() + "_" + document.getOriginalFilename();
	            File dest = new File(folderPath + fileName);

	            document.transferTo(dest);
	            filePath = "/qa_docs/" + fileName;
	        }

	        // ================= TARGET (LOT / BATCH) =================
	        List<IncomingMaterial> targets;

	        if ("LOT".equalsIgnoreCase(passType)) {
	            targets = incomingRepo.findByPartNameAndLotNumberAndMfgDateAndExpireDate(
	                    incoming.getPartName(),
	                    incoming.getLotNumber(),
	                    incoming.getMfgDate(),
	                    incoming.getExpireDate()
	            );
	        } else {
	            targets = List.of(incoming);
	        }

	        int updatedCount = 0;
	        int alreadyDoneCount = 0;

	        for (IncomingMaterial mat : targets) {

	            String currentStatus = mat.getQaStatus();
	            String action = qaStatus.toUpperCase();
	            String qaCode = getQaStatusCode(qaStatus);

	            // Skip final states
	            if (currentStatus != null && 
	            	    (currentStatus.equals("1") || 
	            	     currentStatus.equals("4") || 
	            	     currentStatus.equals("5") || 
	            	     currentStatus.equals("6"))) {

	            	    alreadyDoneCount++;
	            	    continue;
	            	}

	            String qaValue = "";
	            String qaBarcode = "";
	            String printQaValue = "";

	            // ================= STATUS =================
	            switch (action) {

	                case "RELEASED":
	                    mat.setStatus("1");
	                    mat.setQaStatus("1");
	                    qaValue = "RELEASED";
	                    printQaValue = "RELEASED";
	                    qaBarcode = "q@1@" + mat.getIncomingMaterialId();
	                    break;

	                case "REJECTED":
	                    mat.setStatus("2");
	                    mat.setQaStatus("2");
	                    qaValue = "REJECTED";
	                    printQaValue = "REJECTED";
	                    qaBarcode = "q@2@" + mat.getIncomingMaterialId();
	                    break;

	                case "SENDBACK":
	                    mat.setStatus("4");
	                    mat.setQaStatus("4");
	                    qaValue = "SENT BACK";
	                    printQaValue = "SENT BACK";
	                    qaBarcode = "q@4@" + mat.getIncomingMaterialId();
	                    break;

	                case "RERELEASE":
	                    mat.setStatus("5");
	                    mat.setQaStatus("5");
	                    qaValue = "RERELEASED";
	                    printQaValue = "RE RELEASED";  
	                    qaBarcode = "q@5@" + mat.getIncomingMaterialId();
	                    break;

	                case "SCRAP":
	                    mat.setStatus("6");
	                    mat.setQaStatus("6");
	                    qaValue = "SCRAPPED";
	                    printQaValue = "SCRAPPED";
	                    qaBarcode = "q@6@" + mat.getIncomingMaterialId();
	                    break;

	                default:
	                    throw new RuntimeException("Invalid QA Status: " + qaStatus);
	            }

	            mat.setQa(qaValue);
	            mat.setDateTimeModified(now);
	            incomingRepo.save(mat);

	            updatedCount++;

	            // ================= LOG =================
	            Qualityincoming log = new Qualityincoming();
	            log.setInMaterial(mat);
	            log.setQaStatus(qaStatus);
	            log.setCreatedBy(employeeId);
	            log.setStatus("1");
	            log.setDateTimeCreation(now);
	            log.setDateTimeModified(now);
	            log.setRemark(remark);
	            log.setOperation(isFromQuarantine ? "Quarantine" : "Quality");

	            qualityRepo.save(log);

	            // ================= QUALITY TABLE =================
	            if (!isFromQuarantine) {

	                Optional<StoreIncomingQuality> existingOpt =
	                        storeIncomingQualityRepo.findByInMaterial(mat);

	                StoreIncomingQuality qualityEntry = existingOpt.orElseGet(() -> {
	                    StoreIncomingQuality newEntry = new StoreIncomingQuality();
	                    newEntry.setInMaterial(mat);
	                    newEntry.setDateTimeCreation(now);
	                    return newEntry;
	                });

	                qualityEntry.setQaStatus(qaCode);
	                qualityEntry.setQaBarcode(qaBarcode);
	                qualityEntry.setCreatedBy(employeeId);
	                qualityEntry.setStatus("1");
	                qualityEntry.setDateTimeModified(now);

	                qualityEntry.setRemark(remark);

	                if (filePath != null) {
	                    qualityEntry.setQaDocPath(filePath);
	                }

	                if (partType != null && !partType.isEmpty()) {
	                    qualityEntry.setPart_type(partType);
	                }

	                storeIncomingQualityRepo.save(qualityEntry);
	            }

	            // ================= QUARANTINE TABLE (FIXED) =================
	            boolean shouldGoToQuarantine =
	                    "REJECTED".equalsIgnoreCase(qaStatus) ||
	                    "SCRAP".equalsIgnoreCase(qaStatus) ||
	                    "SENDBACK".equalsIgnoreCase(qaStatus) ||
	                    "RERELEASE".equalsIgnoreCase(qaStatus);

	            if (shouldGoToQuarantine) {

	                Optional<StoreIncomingQuarantine> existingQOpt =
	                        storeIncomingQuarantineRepo.findTopByInMaterialOrderByStoreIncomingQuarantineIdDesc(mat);

	                StoreIncomingQuarantine quarantineEntry;

	                if (existingQOpt.isPresent()) {
	                    // ✅ UPDATE existing
	                    quarantineEntry = existingQOpt.get();

	                    String oldRemark = quarantineEntry.getQuarentineRemark();
	                    String newRemark = remark;
	                    quarantineEntry.setQuarentineRemark(newRemark);

	                } else {
	                    // ✅ INSERT new
	                    quarantineEntry = new StoreIncomingQuarantine();
	                    quarantineEntry.setInMaterial(mat);
	                    quarantineEntry.setDateTimeCreation(now);
	                    quarantineEntry.setQuarentineRemark(remark);
	                    quarantineEntry.setQuarantineLabelPasteStatus("0");
	                }

	                quarantineEntry.setQaStatus(qaCode);
	                quarantineEntry.setQuarantineLabelPasteStatus("0");
	                quarantineEntry.setQaBarcode(qaBarcode);
	                quarantineEntry.setCreatedBy(employeeId);
	                quarantineEntry.setStatus("1");
	                quarantineEntry.setDateTimeModified(now);

	                if (filePath != null) {
	                    quarantineEntry.setQuarantineDocument(filePath);
	                }

	                if (partType != null && !partType.isEmpty()) {
	                    quarantineEntry.setPart_type(partType);
	                }

	                storeIncomingQuarantineRepo.save(quarantineEntry);
	            }

	            // ================= EXPIRE DATE =================
	            if ("RERELEASE".equalsIgnoreCase(qaStatus)
	                    && newExpireDate != null
	                    && !newExpireDate.isEmpty()) {

	                StoreQuarantineExpireDateExtend extend = new StoreQuarantineExpireDateExtend();

	                extend.setInMaterial(mat);
	                extend.setExpireDate(newExpireDate);
	                extend.setCreatedBy(employeeId);
	                extend.setStatus("1");
	                extend.setDateTimeCreation(now);
	                extend.setDateTimeModified(now);

	                storeQuarantineExpireDateExtendRepo.save(extend);
	            }

	            // ================= PRINT =================
	            if ("RELEASED".equalsIgnoreCase(qaStatus) || "RERELEASE".equalsIgnoreCase(qaStatus)) {
	                try {

	                 //   String printerName = env.getProperty("printer.iot");
	                	
	                	String printerName;

	                	// RERELEASE → print on quarantine printer
	                	if ("RERELEASE".equalsIgnoreCase(qaStatus)) {

	                	    printerName =
	                	            env.getProperty(
	                	                    "printer.iot.quarantine"
	                	            );

	                	} else {

	                	    // RELEASED → normal quality printer
	                	    printerName =
	                	            env.getProperty(
	                	                    "printer.iot"
	                	            );
	                	}
	                    String template = env.getProperty("zebra.qa.label.template");
	                    
	                    
	                 // Calculate box display
	                    String boxDisplay = "";

	                    if (mat.getBoxNo() != null) {

	                        Long totalBox =
	                                incomingRepo
	                                .countByPartNameAndLotNumberAndMfgDateAndExpireDate(
	                                        mat.getPartName(),
	                                        mat.getLotNumber(),
	                                        mat.getMfgDate(),
	                                        mat.getExpireDate()
	                                );
	                        System.out.println("inside the quality : "+totalBox);
	                        
	                        System.out.println("inside the employee : " + employeeId);

	                        boxDisplay =
	                                mat.getBoxNo()
	                                + "/"
	                                + totalBox;
	                    }

	                    String zpl =
	                            String.format(
	                                    template,

	                                    printQaValue,                   // QA STATUS

	                                    mat.getPartName(),         // PART

	                                    mat.getQuantity(),         // QTY

	                                    mat.getSupplier(),         // SUPPLIER

	                                    boxDisplay,                // BOX (1/10)

	                                    mat.getLotNumber(),        // LOT

	                                    now,   
	                                    
	                                    employeeId,// DATE

	                                    qaBarcode  ,
	                                    
	                                    qaBarcode// QR
	                            );

//	                    String zpl = String.format(
//	                            template,
//	                            qaValue,
//	                            mat.getPartName(),
//	                            mat.getQuantity(),
//	                            mat.getSupplier(),
//	                            partType,
//	                            mat.getLotNumber(),
//	                            now,
//	                            qaBarcode
//	                    );

	                    printerService.printZpl(printerName, zpl);

	                } catch (Exception e) {
	                    System.out.println("Print failed for ID " + mat.getIncomingMaterialId());
	                }
	            }
	        }

	        response.put("status", true);
	        response.put("message", "QA Updated Successfully");
	        response.put("updatedCount", updatedCount);
	        response.put("alreadyDoneCount", alreadyDoneCount);

	        return ResponseEntity.ok(response);

	    } catch (Exception e) {
	        e.printStackTrace();

	        response.put("status", false);
	        response.put("message", "QA Action Failed");

	        return ResponseEntity.internalServerError().body(response);
	    }
	}
    
    @CrossOrigin(origins = "*")
    @GetMapping("/viewDoc")
    public ResponseEntity<Resource> viewDoc(@RequestParam String path) throws Exception {

        // remove /qa_docs/ if exists
        if (path.startsWith("/qa_docs/")) {
            path = path.replace("/qa_docs/", "");
        }

        File file = new File(folderPath, path);

        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new UrlResource(file.toURI());

        String contentType = "application/octet-stream";

        if(path.toLowerCase().endsWith(".pdf")) contentType = "application/pdf";
        else if(path.toLowerCase().endsWith(".jpg") || path.toLowerCase().endsWith(".jpeg")) contentType = "image/jpeg";
        else if(path.toLowerCase().endsWith(".png")) contentType = "image/png";
        else if(path.toLowerCase().endsWith(".xlsx")) contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        else if(path.toLowerCase().endsWith(".xls")) contentType = "application/vnd.ms-excel";

//        return ResponseEntity.ok()
//                .header(HttpHeaders.CONTENT_DISPOSITION,
//                        "attachment; filename=\"" + file.getName() + "\"")
//                .contentType(MediaType.parseMediaType(contentType))
//                .body(resource);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + file.getName() + "\"")
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }
    
    
    
    @GetMapping("/getHistory")
    public ResponseEntity<?> getHistory(@RequestParam Long incomingId){

        IncomingMaterial incoming = incomingRepo.findById(incomingId)
                .orElseThrow(() -> new RuntimeException("Incoming not found"));

        List<Qualityincoming> logs = qualityRepo.findByInMaterialOrderByQualityIncomingId(incoming);

        return ResponseEntity.ok(logs);
    }
    
    


    

    @PostMapping("/saveSupplierClaim")
    public ResponseEntity<?> saveSupplierClaim(
            @ModelAttribute SupplierClaimDTO dto,
            @RequestParam(required = false) MultipartFile photo,
            @RequestParam(required = false) MultipartFile attachment) {

        try {

            IncomingMaterial currentMaterial =
            		incomingRepo.findById(
                            dto.getIncomingMaterialId())
                            .orElseThrow();

            List<IncomingMaterial> materials;

            if ("LOT".equalsIgnoreCase(dto.getPassType())) {

                materials =
                		incomingRepo
                                .findByPartNameAndLotNumberAndMfgDateAndExpireDate(
                                       currentMaterial.getPartName(),currentMaterial.getLotNumber(),
                                       currentMaterial.getMfgDate(),currentMaterial.getExpireDate());

            } else {

                materials =
                        List.of(currentMaterial);
            }

            String photoPath = null;
            String attachmentPath = null;
            
            String now = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());

            if (photo != null && !photo.isEmpty()) {
                photoPath = saveFile(photo);
            }

            if (attachment != null && !attachment.isEmpty()) {
                attachmentPath = saveFile(attachment);
            }

            for (IncomingMaterial material : materials) {

                SupplierClaim claim = new SupplierClaim();

                claim.setIncomingMaterialId(
                        material.getIncomingMaterialId());

                claim.setClaimDate(dto.getClaimDate());
                claim.setClaimedBy(dto.getClaimedBy());
                claim.setSupplierName(dto.getSupplierName());
                claim.setReceivingDate(dto.getReceivingDate());

                claim.setYesNo(dto.getYesNo());
                claim.setResponsible(dto.getResponsible());

                claim.setTargetDate(dto.getTargetDate());
                claim.setActualDate(dto.getActualDate());

                claim.setQualityHead(dto.getQualityHead());
                claim.setDepartmentHead(dto.getDepartmentHead());
                claim.setPlantManager(dto.getPlantManager());
                claim.setStoresHead(dto.getStoresHead());

                claim.setPhotoPath(photoPath);
                claim.setAttachmentPath(attachmentPath);
                claim.setCreatedDate(now);

                supplierClaimRepository.save(claim);
            }

            return ResponseEntity.ok("Saved");

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }
    
    
    
    private String saveFile(MultipartFile file) throws IOException {

        if (file == null || file.isEmpty()) {
            return null;
        }

        String uploadDir = "D:/uploads/supplier_claim/";

        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String fileName =
                System.currentTimeMillis() + "_" + file.getOriginalFilename();

        Path path = Paths.get(uploadDir + fileName);

        Files.copy(file.getInputStream(), path,
                StandardCopyOption.REPLACE_EXISTING);

        return fileName;
    }
    
    
    

    @GetMapping("/employeeRoleDropdowns")
    public ResponseEntity<Map<String, Object>> getEmployeeRoleDropdowns() {

        Map<String, Object> response = new HashMap<>();
        
        System.out.println("api called");

        response.put(
            "plantManagers",
            loginMasterRepository.findByRole_RoleName("Plant Manager")
        );

        response.put(
            "storesHeads",
            loginMasterRepository.findByRole_RoleName("Stores Head")
        );

        response.put(
            "qualityHeads",
            loginMasterRepository.findByRole_RoleName("Quality Head")
        );

        response.put(
            "departmentHeads",
            loginMasterRepository.findByRole_RoleName("Department Head")
        );
        
        
        System.out.println("api response :" +response);

        return ResponseEntity.ok(response);
    }
    
    
    @GetMapping("/supplierDropdown")
    public ResponseEntity<?> getSupplierDropdown() {

        return ResponseEntity.ok(
        		supplierMasterRepository.getAllSupplierNameInList()
        );
    }


}
