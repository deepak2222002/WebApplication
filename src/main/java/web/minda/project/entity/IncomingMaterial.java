package web.minda.project.entity;

import java.util.LinkedHashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;

@Entity
@Table(name = "store_incoming_material")
public class IncomingMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long incomingMaterialId;
    
    @ManyToOne
	@JoinColumn(name="category_id")
	@JsonIgnoreProperties("incomingMaterials")
	private StoreMaterialCategoryMaster category;
    
    @Column(name="supplier")
    private String supplier;

    @Column(name="part_name")
    private String partName;
    
    @Column(name="lot_name")
    private String lotNumber;
    
    @Column(name="box_no")
    private Integer boxNo;
    
    @Column(name="quantity")
    private Integer quantity;
    
    @Column(name="mfg_date")
    private String mfgDate;
    
    @Column(name="expire_date")
    private String expireDate;

	@Column(name = "created_by")
	private String createdBy;

	@Column(name = "status")
	private String status;
	
	@Column(name = "date_time_creation")
	private String dateTimeCreation;

	@Column(name = "date_time_modified")
	private String dateTimeModified;

	@Column(name = "qa")
	private String qa;
	
	@Column(name = "qa_status")
	private String qaStatus;
		
	@Column(name = "tagging_status")
	private String taggingStatus;
	
	
	@OneToMany(mappedBy = "inMaterial" ,cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonIgnoreProperties("inMaterial")
	private Set<Qualityincoming> qualityincomings = new LinkedHashSet<>();
	
	
	@OneToMany(mappedBy = "inMaterial" ,cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonIgnoreProperties("inMaterial")
	private Set<StoreIncomingQuality> storeIncomingQuality = new LinkedHashSet<>();
	
	
	@OneToMany(mappedBy = "inMaterial" ,cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonIgnoreProperties("inMaterial")
	private Set<StoreIncomingQuarantine> storeIncomingQuarantine = new LinkedHashSet<>();
	
	@OneToMany(mappedBy = "inMaterial" ,cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonIgnoreProperties("inMaterial")
	private Set<StoreQuarantineExpireDateExtend> storeQuarantineExpireDateExtend = new LinkedHashSet<>();

	public Long getIncomingMaterialId() {
		return incomingMaterialId;
	}

	public void setIncomingMaterialId(Long incomingMaterialId) {
		this.incomingMaterialId = incomingMaterialId;
	}

	public StoreMaterialCategoryMaster getCategory() {
		return category;
	}

	public void setCategory(StoreMaterialCategoryMaster category) {
		this.category = category;
	}

	public String getSupplier() {
		return supplier;
	}

	public void setSupplier(String supplier) {
		this.supplier = supplier;
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

	public Integer getBoxNo() {
		return boxNo;
	}

	public void setBoxNo(Integer boxNo) {
		this.boxNo = boxNo;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
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

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getDateTimeCreation() {
		return dateTimeCreation;
	}

	public void setDateTimeCreation(String dateTimeCreation) {
		this.dateTimeCreation = dateTimeCreation;
	}

	public String getDateTimeModified() {
		return dateTimeModified;
	}

	public void setDateTimeModified(String dateTimeModified) {
		this.dateTimeModified = dateTimeModified;
	}

	public String getQa() {
		return qa;
	}

	public void setQa(String qa) {
		this.qa = qa;
	}

	public String getQaStatus() {
		return qaStatus;
	}

	public void setQaStatus(String qaStatus) {
		this.qaStatus = qaStatus;
	}

	public String getTaggingStatus() {
		return taggingStatus;
	}

	public void setTaggingStatus(String taggingStatus) {
		this.taggingStatus = taggingStatus;
	}

	public Set<Qualityincoming> getQualityincomings() {
		return qualityincomings;
	}

	public void setQualityincomings(Set<Qualityincoming> qualityincomings) {
		this.qualityincomings = qualityincomings;
	}

	public Set<StoreIncomingQuality> getStoreIncomingQuality() {
		return storeIncomingQuality;
	}

	public void setStoreIncomingQuality(Set<StoreIncomingQuality> storeIncomingQuality) {
		this.storeIncomingQuality = storeIncomingQuality;
	}

	public Set<StoreIncomingQuarantine> getStoreIncomingQuarantine() {
		return storeIncomingQuarantine;
	}

	public void setStoreIncomingQuarantine(Set<StoreIncomingQuarantine> storeIncomingQuarantine) {
		this.storeIncomingQuarantine = storeIncomingQuarantine;
	}

	public Set<StoreQuarantineExpireDateExtend> getStoreQuarantineExpireDateExtend() {
		return storeQuarantineExpireDateExtend;
	}

	public void setStoreQuarantineExpireDateExtend(Set<StoreQuarantineExpireDateExtend> storeQuarantineExpireDateExtend) {
		this.storeQuarantineExpireDateExtend = storeQuarantineExpireDateExtend;
	}

	@Override
	public String toString() {
		return "IncomingMaterial [incomingMaterialId=" + incomingMaterialId + ", category=" + category + ", supplier="
				+ supplier + ", partName=" + partName + ", lotNumber=" + lotNumber + ", boxNo=" + boxNo + ", quantity="
				+ quantity + ", mfgDate=" + mfgDate + ", expireDate=" + expireDate + ", createdBy=" + createdBy
				+ ", status=" + status + ", dateTimeCreation=" + dateTimeCreation + ", dateTimeModified="
				+ dateTimeModified + ", qa=" + qa + ", qaStatus=" + qaStatus + ", taggingStatus=" + taggingStatus
				+ ", qualityincomings=" + qualityincomings + ", storeIncomingQuality=" + storeIncomingQuality
				+ ", storeIncomingQuarantine=" + storeIncomingQuarantine + ", storeQuarantineExpireDateExtend="
				+ storeQuarantineExpireDateExtend + "]";
	}

	public IncomingMaterial(Long incomingMaterialId, StoreMaterialCategoryMaster category, String supplier,
			String partName, String lotNumber, Integer boxNo, Integer quantity, String mfgDate, String expireDate,
			String createdBy, String status, String dateTimeCreation, String dateTimeModified, String qa,
			String qaStatus, String taggingStatus, Set<Qualityincoming> qualityincomings,
			Set<StoreIncomingQuality> storeIncomingQuality, Set<StoreIncomingQuarantine> storeIncomingQuarantine,
			Set<StoreQuarantineExpireDateExtend> storeQuarantineExpireDateExtend) {
		super();
		this.incomingMaterialId = incomingMaterialId;
		this.category = category;
		this.supplier = supplier;
		this.partName = partName;
		this.lotNumber = lotNumber;
		this.boxNo = boxNo;
		this.quantity = quantity;
		this.mfgDate = mfgDate;
		this.expireDate = expireDate;
		this.createdBy = createdBy;
		this.status = status;
		this.dateTimeCreation = dateTimeCreation;
		this.dateTimeModified = dateTimeModified;
		this.qa = qa;
		this.qaStatus = qaStatus;
		this.taggingStatus = taggingStatus;
		this.qualityincomings = qualityincomings;
		this.storeIncomingQuality = storeIncomingQuality;
		this.storeIncomingQuarantine = storeIncomingQuarantine;
		this.storeQuarantineExpireDateExtend = storeQuarantineExpireDateExtend;
	}

	public IncomingMaterial() {
		super();
		// TODO Auto-generated constructor stub
	}


	



	

}