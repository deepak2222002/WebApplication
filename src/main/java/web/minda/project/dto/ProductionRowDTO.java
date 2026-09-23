package web.minda.project.dto;

public class ProductionRowDTO {

    private String machineName;
    private String article;
    private String mouldName;

    private String partNo;
    private String category;

    private Double shotsPerDay;
    private Double perShotPcs;
    private Double totalPcs;
    private Double suggestivePcs;

    private String actualBox;
    
    
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

    public String getPartNo() {
        return partNo;
    }

    public void setPartNo(String partNo) {
        this.partNo = partNo;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getShotsPerDay() {
        return shotsPerDay;
    }

    public void setShotsPerDay(Double shotsPerDay) {
        this.shotsPerDay = shotsPerDay;
    }

    public Double getPerShotPcs() {
        return perShotPcs;
    }

    public void setPerShotPcs(Double perShotPcs) {
        this.perShotPcs = perShotPcs;
    }

    public Double getTotalPcs() {
        return totalPcs;
    }

    public void setTotalPcs(Double totalPcs) {
        this.totalPcs = totalPcs;
    }

    public Double getSuggestivePcs() {
        return suggestivePcs;
    }

    public void setSuggestivePcs(Double suggestivePcs) {
        this.suggestivePcs = suggestivePcs;
    }

    public String getActualBox() {
        return actualBox;
    }

    public void setActualBox(String actualBox) {
        this.actualBox = actualBox;
    }
}