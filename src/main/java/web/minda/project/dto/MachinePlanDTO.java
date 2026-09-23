package web.minda.project.dto;

import java.util.List;

public class MachinePlanDTO {

    private String machineName;

    private Long mainChangeoverId;

    private Long nextChangeoverId;

    private Long spareChangeoverId;

	public String getMachineName() {
		return machineName;
	}

	public void setMachineName(String machineName) {
		this.machineName = machineName;
	}

	public Long getMainChangeoverId() {
		return mainChangeoverId;
	}

	public void setMainChangeoverId(Long mainChangeoverId) {
		this.mainChangeoverId = mainChangeoverId;
	}

	public Long getNextChangeoverId() {
		return nextChangeoverId;
	}

	public void setNextChangeoverId(Long nextChangeoverId) {
		this.nextChangeoverId = nextChangeoverId;
	}

	public Long getSpareChangeoverId() {
		return spareChangeoverId;
	}

	public void setSpareChangeoverId(Long spareChangeoverId) {
		this.spareChangeoverId = spareChangeoverId;
	}
    
   
}