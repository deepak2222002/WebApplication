package web.minda.project.dto;


public class SupplierClaimReportRequest {

    private String supplierName;

    private String claimedBy;

    private String responsible;

    private String yesNo;

    private String startDate;

    private String endDate;

	public String getSupplierName() {
		return supplierName;
	}

	public void setSupplierName(String supplierName) {
		this.supplierName = supplierName;
	}

	public String getClaimedBy() {
		return claimedBy;
	}

	public void setClaimedBy(String claimedBy) {
		this.claimedBy = claimedBy;
	}

	public String getResponsible() {
		return responsible;
	}

	public void setResponsible(String responsible) {
		this.responsible = responsible;
	}

	public String getYesNo() {
		return yesNo;
	}

	public void setYesNo(String yesNo) {
		this.yesNo = yesNo;
	}

	public String getStartDate() {
		return startDate;
	}

	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

	public String getEndDate() {
		return endDate;
	}

	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}
    
    
    
}
