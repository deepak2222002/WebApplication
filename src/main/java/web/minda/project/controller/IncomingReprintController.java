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
import web.minda.project.entity.StoreMaterial;
import web.minda.project.repositories.IncomingReprintRepository;
import web.minda.project.repositories.QualityIncomingRepository;
import web.minda.project.repositories.StoreMaterialRepository;
import web.minda.project.service.ZebraUsbPrinterService;
@RestController
@RequestMapping("/Controllers")
public class IncomingReprintController {
	
	  @Autowired
	  IncomingReprintRepository incomingReprintRepository;
	  
	    @Autowired
	    private QualityIncomingRepository qualityRepo;
	    
		@Autowired
		private StoreMaterialRepository storeMaterialRepository;
	  
	  @Autowired
	  private Environment env;
	  
	  @Autowired
	private ZebraUsbPrinterService printerService;
	
	 
	 @GetMapping("/getIncomingReprint")
	  public ResponseEntity<?> getIncomingReprint(
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
	    		  incomingReprintRepository.getIncomingReprint(
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
	          dto.setBoxno(inc.getBoxNo());

	          dto.setQa(inc.getQa());
	          dto.setSupplierName(inc.getSupplier());
	          
	          Optional<StoreMaterial> descOptional =  storeMaterialRepository.findByMaterial(inc.getPartName());
	            dto.setDescription(descOptional.get().getDescription());
	            dto.setDateTime(inc.getDateTimeCreation());
	            dto.setCreatedBy(inc.getCreatedBy());
	            
	            
	     

	          if (inc.getCategory() != null) {
	              dto.setCategory(inc.getCategory().getCategory());
	          }
	          
	          if (inc.getStoreIncomingQuality() != null && !inc.getStoreIncomingQuality().isEmpty()) {

	                StoreIncomingQuality latestQuality = inc.getStoreIncomingQuality()
	                        .stream()
	                        .max(Comparator.comparing(StoreIncomingQuality::getStoreIncomingQualityId))
	                        .orElse(null);

	                if (latestQuality != null) {
	                    dto.setPartType(latestQuality.getPart_type());
	                   
	                }
	            }

	          result.add(dto);
	      }

	      return ResponseEntity.ok(Map.of(
	              "data", result,
	              "total", incomingPage.getTotalElements() 
	      ));
	  }
	 
	 @PostMapping("/reprintIncoming")
	 public ResponseEntity<?> reprintIncoming(
	         @RequestBody Map<String, Object> request) {

	     Map<String, Object> response = new HashMap<>();

	     try {

	         Object idObj = request.get("incomingMaterialId");

	         if (idObj == null) {
	             response.put("status", false);
	             response.put("message", "incomingMaterialId is required");
	             return ResponseEntity.badRequest().body(response);
	         }

	         String id = idObj.toString();

	         Optional<IncomingMaterial> optional =
	                 incomingReprintRepository.findById(Long.parseLong(id));
	         
	         
	         

	         if (optional.isEmpty()) {
	             response.put("status", false);
	             response.put("message", "Material not found");
	             return ResponseEntity.badRequest().body(response);
	         }

	         IncomingMaterial material = optional.get();

	         String now =
	             new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
	                 .format(new Date());
	         
	         
	         long totalBoxes =
	        	        incomingReprintRepository.countByPartNameAndLotNumberAndMfgDateAndExpireDate(
	        	                material.getPartName(),
	        	                material.getLotNumber(),
	        	                material.getMfgDate(),
	        	                material.getExpireDate()
	        	        );

	        	String boxDisplay =
	        	        material.getBoxNo() + "/" + totalBoxes;
	        	
	        	
	        	   System.out.println("inside the incoming reprint : "+boxDisplay);

	         Qualityincoming log = new Qualityincoming();

	         log.setInMaterial(material);
	         log.setStatus("REPRINT");

	         Object createdBy = request.get("createdBy");

	         log.setCreatedBy(
	             createdBy != null
	                 ? createdBy.toString()
	                 : "SYSTEM"
	         );

	         log.setQaStatus("RELEASED");
	         log.setDateTimeCreation(now);
	         log.setDateTimeModified(now);
	         log.setOperation("Quality");
	         log.setRemark("REPRINT");

	         qualityRepo.save(log);

	         String printerName =
	             env.getProperty("printer.default");

	         String template =
	             env.getProperty("zebra.label.template");

	         String employeeId =
	        	        createdBy != null
	        	                ? createdBy.toString()
	        	                : "SYSTEM";

	        	String zpl = String.format(
	        	        template,
	        	        material.getIncomingMaterialId(), // QR Code

	        	        material.getPartName(),

	        	        material.getQuantity(),

	        	        material.getLotNumber(),

	        	        material.getSupplier(),

	        	        boxDisplay,

	        	        now,

	        	        material.getMfgDate(),

	        	        material.getExpireDate(),

	        	        employeeId,                       // User

	        	        material.getIncomingMaterialId()  // Text below QR
	        	);
	         
	  

	         printerService.printZpl(printerName, zpl);

	         response.put("status", true);
	         response.put("message", "Label reprinted successfully");

	         return ResponseEntity.ok(response);

	     } catch (Exception e) {

	         e.printStackTrace();

	         response.put("status", false);
	         response.put("message", e.getMessage());

	         return ResponseEntity.internalServerError()
	                 .body(response);
	     }
	 }
	 
	 
	 
	 
  //   String zpl = String.format(
 	//        template,
 	//        material.getIncomingMaterialId(),
 	//        material.getPartName(),
 	//        material.getQuantity(),
 	//        material.getLotNumber(),
 	//        material.getSupplier(),
 	//        boxDisplay,
 	//        now,
 	 //       material.getMfgDate(),
 	 //       material.getExpireDate(),
 	 //       material.getIncomingMaterialId()
 //	);
	

}
