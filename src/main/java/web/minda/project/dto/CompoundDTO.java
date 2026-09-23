package web.minda.project.dto;

public class CompoundDTO {

    private String article;
    private String childPart;
    private String batchWeight;
    private String batchCutting;
    private String rmsWeight;
    private String status;
    private String category; 
    private String issuenceCategory;

    public CompoundDTO(String article, String childPart, String batchWeight,
                       String batchCutting, String rmsWeight, String status,
                       String category,String issuenceCategory) {
        this.article = article;
        this.childPart = childPart;
        this.batchWeight = batchWeight;
        this.batchCutting = batchCutting;
        this.rmsWeight = rmsWeight;
        this.status = status;
        this.category = category;
        this.issuenceCategory = issuenceCategory;
    }

    public String getArticle() { return article; }
    public String getChildPart() { return childPart; }
    public String getBatchWeight() { return batchWeight; }
    public String getBatchCutting() { return batchCutting; }
    public String getRmsWeight() { return rmsWeight; }
    public String getStatus() { return status; }
    public String getCategory() { return category; }

	public String getIssuenceCategory() {
		return issuenceCategory;
	}

  
}