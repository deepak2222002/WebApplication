package web.minda.project.dto;

public interface MovingReportDTO {
	String getPartName();
	String getStoreLocation();
    String getQuantity();
    String getSupplierName();
    String getLotNumber();
    String getMfgDate();
    String getExpiryDate();
    String getBarcode();
    String getIncomingDate();
    String getDateTime();
	String getCreatedBy();
	String getTotalQty();
	String getDescription();
	String getQualityReleaseDate();
	String getCurrentStatus();
	String getLastActivityDate();
	Integer getAgingDays();
	
	
	String getQa();

}
