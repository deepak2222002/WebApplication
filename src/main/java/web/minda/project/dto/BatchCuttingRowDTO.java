package web.minda.project.dto;

public class BatchCuttingRowDTO {

    private String machineName;
    private String article;
    private String mouldName;

    private String compoundCode;
    private Double batchWeight;

    private Double perShotWeight;
    private Double totalWeight;
    
    private Long changeoverId;
    

    public Long getChangeoverId() {
		return changeoverId;
	}

	public void setChangeoverId(Long changeoverId) {
		this.changeoverId = changeoverId;
	}

	public String getMachineName() {
        return machineName;
    }

    public void setMachineName(String machineName) {
        this.machineName = machineName;
    }

    public String getArticle() {
        return article;
    }

    public void setArticle(String article) {
        this.article = article;
    }

    public String getMouldName() {
        return mouldName;
    }

    public void setMouldName(String mouldName) {
        this.mouldName = mouldName;
    }

    public String getCompoundCode() {
        return compoundCode;
    }

    public void setCompoundCode(String compoundCode) {
        this.compoundCode = compoundCode;
    }

    public Double getBatchWeight() {
        return batchWeight;
    }

    public void setBatchWeight(Double batchWeight) {
        this.batchWeight = batchWeight;
    }

    public Double getPerShotWeight() {
        return perShotWeight;
    }

    public void setPerShotWeight(Double perShotWeight) {
        this.perShotWeight = perShotWeight;
    }

    public Double getTotalWeight() {
        return totalWeight;
    }

    public void setTotalWeight(Double totalWeight) {
        this.totalWeight = totalWeight;
    }
}