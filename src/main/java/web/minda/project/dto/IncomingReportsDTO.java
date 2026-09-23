package web.minda.project.dto;

public interface IncomingReportsDTO {
	
	String getPartName();
    String getQuantity();
    String getSupplierName();
    String getLotNumber();
    String getMfgDate();
    String getExpiryDate();
    String getDateTime();
	String getCreatedBy();
	String getTotalQty();
	String getDescription();
	String getCategory();
	String getQaBarcode();
	String getIncomingMaterialId();
	String getBoxNo();
	String getQaStatus();
	String getTaggingStatus();
}
