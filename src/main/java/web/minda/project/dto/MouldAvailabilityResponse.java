package web.minda.project.dto;

public class MouldAvailabilityResponse {

    private Integer minShots;
    private Integer usedShots;
    private Integer remainingShots;
    private Boolean isAlreadyUsed;
    private String usedInArticle;
    private String usedInMachine;

  
	public MouldAvailabilityResponse() {}

//    public MouldAvailabilityResponse(Integer minShots, Integer usedShots, Integer remainingShots,
//                                     Boolean isAlreadyUsed, String usedInArticle,String usedInMachine) {
//        this.minShots = minShots;
//        this.usedShots = usedShots;
//        this.remainingShots = remainingShots;
//        this.isAlreadyUsed = isAlreadyUsed;
//        this.usedInArticle = usedInArticle;
//        this.usedInMachine=usedInMachine;
//    }
	
	public MouldAvailabilityResponse(Integer minShots, Integer usedShots, Integer remainingShots,
            Boolean isAlreadyUsed, String usedInMachine) {
this.minShots = minShots;
this.usedShots = usedShots;
this.remainingShots = remainingShots;
this.isAlreadyUsed = isAlreadyUsed;
this.usedInMachine = usedInMachine;
}
    public String getUsedInMachine() {
  		return usedInMachine;
  	}

  	public void setUsedInMachine(String usedInMachine) {
  		this.usedInMachine = usedInMachine;
  	}

    public Integer getMinShots() {
        return minShots;
    }

    public void setMinShots(Integer minShots) {
        this.minShots = minShots;
    }

    public Integer getUsedShots() {
        return usedShots;
    }

    public void setUsedShots(Integer usedShots) {
        this.usedShots = usedShots;
    }

    public Integer getRemainingShots() {
        return remainingShots;
    }

    public void setRemainingShots(Integer remainingShots) {
        this.remainingShots = remainingShots;
    }

    public Boolean getIsAlreadyUsed() {
        return isAlreadyUsed;
    }

    public void setIsAlreadyUsed(Boolean isAlreadyUsed) {
        this.isAlreadyUsed = isAlreadyUsed;
    }

    public String getUsedInArticle() {
        return usedInArticle;
    }

    public void setUsedInArticle(String usedInArticle) {
        this.usedInArticle = usedInArticle;
    }
}
