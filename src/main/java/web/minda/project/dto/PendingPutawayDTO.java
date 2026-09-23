package web.minda.project.dto;

import web.minda.project.entity.IncomingMaterial;

public class PendingPutawayDTO {

    private Long id;
    private String partCode;
    private String partName;
    private String lotNumber;
    private String mfgDate;
    private String expireDate;
    private String qaStatus;
    private Integer boxNo;
    private String  qa;

    public PendingPutawayDTO(IncomingMaterial i) {
        this.id = i.getIncomingMaterialId();
        this.partCode = i.getPartName(); // change if separate column
        this.partName = i.getPartName();
        this.lotNumber = i.getLotNumber();
        this.mfgDate = i.getMfgDate();
        this.expireDate = i.getExpireDate();
        this.boxNo = i.getBoxNo();
        this.qa=i.getQa();
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getPartCode() {
		return partCode;
	}

	public void setPartCode(String partCode) {
		this.partCode = partCode;
	}

	public String getPartName() {
		return partName;
	}

	public void setPartName(String partName) {
		this.partName = partName;
	}

	public String getLotNumber() {
		return lotNumber;
	}

	public void setLotNumber(String lotNumber) {
		this.lotNumber = lotNumber;
	}

	public String getMfgDate() {
		return mfgDate;
	}

	public void setMfgDate(String mfgDate) {
		this.mfgDate = mfgDate;
	}

	public String getExpireDate() {
		return expireDate;
	}

	public void setExpireDate(String expireDate) {
		this.expireDate = expireDate;
	}

	public String getQaStatus() {
		return qaStatus;
	}

	public void setQaStatus(String qaStatus) {
		this.qaStatus = qaStatus;
	}

	public Integer getBoxNo() {
		return boxNo;
	}

	public void setBoxNo(Integer boxNo) {
		this.boxNo = boxNo;
	}

	public String getQa() {
		return qa;
	}

	public void setQa(String qa) {
		this.qa = qa;
	}


    
}