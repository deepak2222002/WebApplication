package web.minda.project.dto;

public class MixingmillRowDTO {

    private String machineName;
    private String article;
    private String mouldName;

    private String compoundCode;
    private Double batchWeight;

    private Double shotsPerDay;
    private Double perShotWeight;
    private Double totalWeight;
    private Double suggestiveBatch;

    private String actualBatch;
    
    
    private Long changeoverId;
    
    private String planId;
    
    
    private String type;
    
    private String plannedDate;
    
    private String entryType;
    
    private String shift;
    
    
    
   
	public String getShift() {
		return shift;
	}

	public void setShift(String shift) {
		this.shift = shift;
	}

	public String getEntryType() {
		return entryType;
	}

	public void setEntryType(String entryType) {
		this.entryType = entryType;
	}

	public String getPlannedDate() {
		return plannedDate;
	}

	public void setPlannedDate(String plannedDate) {
		this.plannedDate = plannedDate;
	}

	public String getPlanId() {
		return planId;
	}

	public void setPlanId(String planId) {
		this.planId = planId;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

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

    public Double getShotsPerDay() {
        return shotsPerDay;
    }

    public void setShotsPerDay(Double shotsPerDay) {
        this.shotsPerDay = shotsPerDay;
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

    public Double getSuggestiveBatch() {
        return suggestiveBatch;
    }

    public void setSuggestiveBatch(Double suggestiveBatch) {
        this.suggestiveBatch = suggestiveBatch;
    }

    public String getActualBatch() {
        return actualBatch;
    }

    public void setActualBatch(String actualBatch) {
        this.actualBatch = actualBatch;
    }
}