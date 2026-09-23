package web.minda.project.entity;

import java.util.LinkedHashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "production_compound_master")
public class ProductionCompoundMaster {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long productionCompoundId;

	@Column(name = "compound")
	private String compound;

	@Column(name = "batch_weight")
	private String batchWeight;
	
	@Column(name = "master_batch")
	private String masterBatch;
	
	@Column(name = "formula_no")
	private String formulaNo;
	
	@Column(name = "expiry")
	private String expiry;
	
	
	@Column(name = "batch_cutting")
	private String batchCutting;
	
	
	@Column(name = "rms_weight")
	private String rmsWeight;
	
	
	@Column(name = "created_by")
	private String createdBy;

	@Column(name = "status")
	private String status;

	@Column(name = "date_time_creation")
	private String dateTimeCreation;

	@Column(name = "date_time_modified")
	private String dateTimeModified;

	@Column(name = "image")
	private String image;
	
	
	@OneToMany(mappedBy = "productionCompoundMaster", 
	           cascade = CascadeType.ALL, 
	           fetch = FetchType.LAZY)
	@JsonIgnoreProperties("productionCompoundMaster")
	private Set<ProductionCompoundChildPartMaster> productionCompound = new LinkedHashSet<>();


	public Long getProductionCompoundId() {
		return productionCompoundId;
	}


	public void setProductionCompoundId(Long productionCompoundId) {
		this.productionCompoundId = productionCompoundId;
	}


	public String getCompound() {
		return compound;
	}


	public void setCompound(String compound) {
		this.compound = compound;
	}


	public String getBatchWeight() {
		return batchWeight;
	}


	public void setBatchWeight(String batchWeight) {
		this.batchWeight = batchWeight;
	}


	public String getMasterBatch() {
		return masterBatch;
	}


	public void setMasterBatch(String masterBatch) {
		this.masterBatch = masterBatch;
	}


	public String getFormulaNo() {
		return formulaNo;
	}


	public void setFormulaNo(String formulaNo) {
		this.formulaNo = formulaNo;
	}


	public String getExpiry() {
		return expiry;
	}


	public void setExpiry(String expiry) {
		this.expiry = expiry;
	}


	public String getBatchCutting() {
		return batchCutting;
	}


	public void setBatchCutting(String batchCutting) {
		this.batchCutting = batchCutting;
	}


	public String getRmsWeight() {
		return rmsWeight;
	}


	public void setRmsWeight(String rmsWeight) {
		this.rmsWeight = rmsWeight;
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


	public String getImage() {
		return image;
	}


	public void setImage(String image) {
		this.image = image;
	}


	public Set<ProductionCompoundChildPartMaster> getProductionCompound() {
		return productionCompound;
	}


	public void setProductionCompound(Set<ProductionCompoundChildPartMaster> productionCompound) {
		this.productionCompound = productionCompound;
	}


	public ProductionCompoundMaster(Long productionCompoundId, String compound, String batchWeight, String masterBatch,
			String formulaNo, String expiry, String batchCutting, String rmsWeight, String createdBy, String status,
			String dateTimeCreation, String dateTimeModified, String image,
			Set<ProductionCompoundChildPartMaster> productionCompound) {
		super();
		this.productionCompoundId = productionCompoundId;
		this.compound = compound;
		this.batchWeight = batchWeight;
		this.masterBatch = masterBatch;
		this.formulaNo = formulaNo;
		this.expiry = expiry;
		this.batchCutting = batchCutting;
		this.rmsWeight = rmsWeight;
		this.createdBy = createdBy;
		this.status = status;
		this.dateTimeCreation = dateTimeCreation;
		this.dateTimeModified = dateTimeModified;
		this.image = image;
		this.productionCompound = productionCompound;
	}


	public ProductionCompoundMaster() {
		super();
		// TODO Auto-generated constructor stub
	}


	
	
}
