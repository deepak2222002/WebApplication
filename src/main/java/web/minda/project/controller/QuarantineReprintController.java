package web.minda.project.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import web.minda.project.dto.IncomingDTO;
import web.minda.project.entity.IncomingMaterial;
import web.minda.project.entity.Qualityincoming;
import web.minda.project.entity.StoreIncomingQuality;
import web.minda.project.entity.StoreIncomingQuarantine;
import web.minda.project.entity.StoreMaterial;
import web.minda.project.repositories.IncomingMaterialRepository;
import web.minda.project.repositories.QualityIncomingRepository;
import web.minda.project.repositories.QuarantineReprintRepository;
import web.minda.project.repositories.StoreIncomingQualityRepository;
import web.minda.project.repositories.StoreIncomingQuarantineRepository;
import web.minda.project.repositories.StoreMaterialRepository;
import web.minda.project.service.ZebraUsbPrinterService;

@RestController
@RequestMapping("/Controllers")
public class QuarantineReprintController {
	
	@Autowired
	QuarantineReprintRepository quarantineReprintRepository;
	
	@Autowired
	private QualityIncomingRepository qualityLogRepo;

	@Autowired
	private StoreIncomingQualityRepository qualityRepo;

	@Autowired
	private StoreIncomingQuarantineRepository quarantineRepo;

	@Autowired
	private IncomingMaterialRepository incomingRepo;
    
	@Autowired
	private StoreMaterialRepository storeMaterialRepository;
    
    @Autowired
    private StoreIncomingQualityRepository storeIncomingQualityRepo;
    
    @Autowired
    private StoreIncomingQuarantineRepository storeIncomingQuarantineRepo;
  
	  
	  @Autowired
	  private Environment env;
	  
	  @Autowired
	private ZebraUsbPrinterService printerService;
	
	
	  @GetMapping("/getQuarantineReprint")
	  public ResponseEntity<?> getQuarantineReprint(
	          @RequestParam(defaultValue = "0") int page,
	          @RequestParam(defaultValue = "10") int size,
	          @RequestParam(required = false) String partName,
	          @RequestParam(required = false) String supplierName,
	          @RequestParam(required = false) String partType,
	          @RequestParam(required = false) String lotNumber,
	          @RequestParam(required = false) String category
	  ) {

	      partName = (partName != null && partName.trim().isEmpty()) ? null : partName;
	      supplierName = (supplierName != null && supplierName.trim().isEmpty()) ? null : supplierName;
	      partType = (partType != null && partType.trim().isEmpty()) ? null : partType;
	      lotNumber = (lotNumber != null && lotNumber.trim().isEmpty()) ? null : lotNumber;
	      category = (category != null && category.trim().isEmpty()) ? null : category;

	      Page<IncomingMaterial> incomingPage =
	              quarantineReprintRepository.getQuarantineReprint(
	                      partName, supplierName, partType, lotNumber, category,
	                      PageRequest.of(page, size)
	              );

	      List<IncomingDTO> result = new ArrayList<>();
	      
	      
//	      for (IncomingMaterial inc : incomingPage.getContent()) {
//
//	    	    System.out.println("Part Name: " + inc.getPartName());
//
//	    	    StoreIncomingQuarantine qt =
//	    	        storeIncomingQuarantineRepo
//	    	            .findTopByInMaterialIncomingMaterialIdOrderByStoreIncomingQuarantineIdDesc(
//	    	                inc.getIncomingMaterialId());
//
//	    	    System.out.println("Quarantine Record: " + qt);
//	    	    
//	    	    Optional<StoreMaterial> descOptional =  storeMaterialRepository.findByMaterial(inc.getPartName());
//	    	    
//	    	    System.out.println("Quarantine descOptional: " + descOptional);
//
//	    	    if (qt != null) {
//	    	        System.out.println("Created By: " + qt.getCreatedBy());
//	    	    }
//	    	}
//	      
//	 

	      for (IncomingMaterial inc : incomingPage.getContent()) {

	          IncomingDTO dto = new IncomingDTO();

	          dto.setIncomingMaterialId(inc.getIncomingMaterialId());
	          dto.setPartName(inc.getPartName());
	          dto.setLotNumber(inc.getLotNumber());
	          dto.setQuantity(inc.getQuantity());
	          dto.setMfgDate(inc.getMfgDate());
	          dto.setExpireDate(inc.getExpireDate());
	          dto.setBoxno(inc.getBoxNo());
	          dto.setQa(inc.getQa());
	          
	          dto.setSupplierName(inc.getSupplier());
	          Optional<StoreMaterial> descOptional =  storeMaterialRepository.findByMaterial(inc.getPartName());
	          dto.setDescription(descOptional.get().getDescription());
	          
	          dto.setDateTime(inc.getDateTimeCreation());
	          
	          StoreIncomingQuarantine qt =
	        		  storeIncomingQuarantineRepo
	        		        .findTopByInMaterialIncomingMaterialIdOrderByStoreIncomingQuarantineIdDesc(
	        		            inc.getIncomingMaterialId());

	        		if (qt != null) {
	        		    dto.setCreatedBy(qt.getCreatedBy());
	        		}
	        		
	        		dto.setPartType(qt.getPart_type());
	        		

	          if (inc.getCategory() != null) {
	              dto.setCategory(inc.getCategory().getCategory());
	          }

	          result.add(dto);
	      }

	      return ResponseEntity.ok(Map.of(
	              "data", result,
	              "total", incomingPage.getTotalElements() 
	      ));
	  }
	 
	  @PostMapping("/reprintQA")
	  public ResponseEntity<?> reprintQA(
	          @RequestBody Map<String, Object> request
	  ) {

	      Map<String, Object> response = new HashMap<>();

	      try {

	          Object idObj =
	                  request.get("incomingMaterialId");

	          if (idObj == null) {

	              response.put(
	                      "status",
	                      false
	              );

	              response.put(
	                      "message",
	                      "incomingMaterialId is required"
	              );

	              return ResponseEntity
	                      .badRequest()
	                      .body(response);
	          }

	          Long incomingId =
	                  Long.parseLong(
	                          idObj.toString()
	                  );

	          Optional<IncomingMaterial> materialOpt =
	        		  incomingRepo.findById(
	                          incomingId
	                  );

	          if (materialOpt.isEmpty()) {

	              response.put(
	                      "status",
	                      false
	              );

	              response.put(
	                      "message",
	                      "Material not found"
	              );

	              return ResponseEntity
	                      .badRequest()
	                      .body(response);
	          }

	          IncomingMaterial material =
	                  materialOpt.get();

	          String qaStatus = null;
	          String employeeId = "";

	          // default printer
	          String printerName =
	                  env.getProperty(
	                          "printer.iot"
	                  );

	          // CHECK QUARANTINE FIRST
	          Optional<StoreIncomingQuarantine>
	                  quarantineOpt =
	                  quarantineRepo
	                  .findByInMaterial_IncomingMaterialId(
	                          incomingId
	                  );

	          if (
	                  quarantineOpt
	                          .isPresent()
	          ) {
	        	  
	        	  StoreIncomingQuarantine quarantine =
	        	            quarantineOpt.get();

	        	    qaStatus =
	        	            quarantine.getQaStatus();

	        	    employeeId =
	        	            quarantine.getCreatedBy();

	              

	              printerName =
	                      env.getProperty(
	                              "printer.iot.quarantine"
	                      );

	          } else {

	              Optional<StoreIncomingQuality>
	                      qualityOpt =
	                      qualityRepo
	                      .findByInMaterial_IncomingMaterialId(
	                              incomingId
	                      );

	              if (
	                      qualityOpt
	                              .isPresent()
	              ) {

	            	  StoreIncomingQuality quality =
	            	            qualityOpt.get();

	            	    qaStatus =
	            	            quality.getQaStatus();

	            	    employeeId =
	            	            quality.getCreatedBy();
	              }
	          }

	          if (qaStatus == null) {

	              response.put(
	                      "status",
	                      false
	              );

	              response.put(
	                      "message",
	                      "No QA record found"
	              );

	              return ResponseEntity
	                      .badRequest()
	                      .body(response);
	          }

	          String qaValue;

	          switch (qaStatus) {

	              case "1":
	                  qaValue =
	                          "QA RELEASED";
	                  break;

	              case "2":
	                  qaValue =
	                          "QA REJECTED";
	                  break;

	              case "3":
	                  qaValue =
	                          "QUARANTINE";
	                  break;

	              case "4":
	                  qaValue =
	                          "SENT BACK";
	                  break;

	              case "5":
	                  qaValue =
	                          "RE RELEASED";
	                  break;

	              case "6":
	                  qaValue =
	                          "SCRAPPED";
	                  break;

	              default:
	                  qaValue =
	                          "UNKNOWN";
	          }

	          String now =
	                  new SimpleDateFormat(
	                          "yyyy-MM-dd HH:mm:ss"
	                  )
	                  .format(
	                          new Date()
	                  );

	          String qaBarcode =
	                  "q@"
	                          +
	                          qaStatus
	                          +
	                          "@"
	                          +
	                          incomingId;

	          // SAVE LOG
	          Qualityincoming log =
	                  new Qualityincoming();

	          log.setInMaterial(
	                  material
	          );

	          log.setStatus(
	                  "REPRINT"
	          );

	          Object createdBy =
	                  request.get(
	                          "createdBy"
	                  );

	          log.setCreatedBy(
	                  createdBy != null
	                          ?
	                          createdBy.toString()
	                          :
	                          "SYSTEM"
	          );

	          log.setQaStatus(
	                  qaStatus
	          );

	          log.setDateTimeCreation(
	                  now
	          );

	          log.setDateTimeModified(
	                  now
	          );

	          log.setOperation(
	                  "QA REPRINT"
	          );

	          log.setRemark(
	                  "REPRINT"
	          );

	          qualityLogRepo.save(
	                  log
	          );

	          // SAME TEMPLATE
	          String template =
	                  env.getProperty(
	                          "zebra.qa.label.template"
	                  );
	          
	          Long totalBoxes =
	        	        incomingRepo.countBoxes(
	        	                material.getPartName(),
	        	                material.getLotNumber(),
	        	                material.getMfgDate(),
	        	                material.getExpireDate()
	        	        );

	        	String boxDisplay =
	        	        "("
	        	        + material.getBoxNo()
	        	        + "/"
	        	        + totalBoxes
	        	        + ")";
	        	
	        	
	        	   System.out.println("inside the quarantine and quality reprint : "+boxDisplay);
	        	   System.out.println("qaValue : "+qaValue);


//	        	String zpl =
//	        	        String.format(
//	        	                template,
//
//	        	                qaValue,
//
//	        	                material.getPartName(),
//
//	        	                material.getQuantity(),
//
//	        	                material.getSupplier(),
//
//	        	                boxDisplay,
//
//	        	                material.getLotNumber(),
//
//	        	                now,
//
//	        	                qaBarcode,
//	        	                
//	        	                qaBarcode
//	        	        );
	        	   
	        	   
	        	   String zpl =
	        		        String.format(
	        		                template,

	        		                qaValue,

	        		                material.getPartName(),

	        		                material.getQuantity(),

	        		                material.getSupplier(),

	        		                boxDisplay,

	        		                material.getLotNumber(),

	        		                now,

	        		                employeeId,   // User on label

	        		                qaBarcode,    // QR code

	        		                qaBarcode     // Text below QR
	        		        );

	          // PRINT
	          printerService
	                  .printZpl(
	                          printerName,
	                          zpl
	                  );

	          response.put(
	                  "status",
	                  true
	          );

	          response.put(
	                  "message",
	                  "Label reprinted successfully"
	          );

	          response.put(
	                  "printer",
	                  printerName
	          );

	          response.put(
	                  "barcode",
	                  qaBarcode
	          );

	          return ResponseEntity
	                  .ok(
	                          response
	                  );

	      } catch (
	              Exception e
	      ) {

	          e.printStackTrace();

	          response.put(
	                  "status",
	                  false
	          );

	          response.put(
	                  "message",
	                  e.getMessage()
	          );

	          return ResponseEntity
	                  .internalServerError()
	                  .body(
	                          response
	                  );
	      }
	  }
	  


	  
	  @GetMapping("/getQualityReprint")
	  public ResponseEntity<?> getQualityReprint(
	          @RequestParam(defaultValue = "0") int page,
	          @RequestParam(defaultValue = "10") int size,
	          @RequestParam(required = false) String partName,
	          @RequestParam(required = false) String supplierName,
	          @RequestParam(required = false) String partType,
	          @RequestParam(required = false) String lotNumber,
	          @RequestParam(required = false) String category
	  ) {

	      partName = (partName != null && partName.trim().isEmpty()) ? null : partName;
	      supplierName = (supplierName != null && supplierName.trim().isEmpty()) ? null : supplierName;
	      partType = (partType != null && partType.trim().isEmpty()) ? null : partType;
	      lotNumber = (lotNumber != null && lotNumber.trim().isEmpty()) ? null : lotNumber;
	      category = (category != null && category.trim().isEmpty()) ? null : category;

	      Page<IncomingMaterial> incomingPage =
	              quarantineReprintRepository.getQualityReprint(
	                      partName, supplierName, partType, lotNumber, category,
	                      PageRequest.of(page, size)
	              );

	      List<IncomingDTO> result = new ArrayList<>();

	      for (IncomingMaterial inc : incomingPage.getContent()) {

	          IncomingDTO dto = new IncomingDTO();

	          dto.setIncomingMaterialId(inc.getIncomingMaterialId());
	          dto.setPartName(inc.getPartName());
	          dto.setLotNumber(inc.getLotNumber());
	          dto.setQuantity(inc.getQuantity());
	          dto.setMfgDate(inc.getMfgDate());
	          dto.setExpireDate(inc.getExpireDate());

	          dto.setQa(inc.getQa());
	          dto.setSupplierName(inc.getSupplier());
	          dto.setBoxno(inc.getBoxNo());
	        //  dto.setPartType(inc.getPart_type());
	          
	          Optional<StoreMaterial> descOptional =  storeMaterialRepository.findByMaterial(inc.getPartName());
	            dto.setDescription(descOptional.get().getDescription());
	            dto.setDateTime(inc.getDateTimeCreation());
	            
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

	                    // Fetch Created By from StoreIncomingQuality
	                    dto.setCreatedBy(latestQuality.getCreatedBy());
	                }
	            }

	          if (inc.getCategory() != null) {
	              dto.setCategory(inc.getCategory().getCategory());
	          }

	          result.add(dto);
	      }

	      return ResponseEntity.ok(Map.of(
	              "data", result,
	              "total", incomingPage.getTotalElements() 
	      ));
	  }
	  

}
