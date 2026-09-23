package web.minda.project.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;


@Entity
@Table(name="production_mould_master")
public class ProductionMouldMaster {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id")
	private Long productionMouldId;

	@Column(name="mould")
	private String mould;
	
	@Column(name="description")
	private String description;
	
	
	@Column(name="tool_life_shots")
	private String toolLifeShots;
	
	@Column(name="preventive_shot")
	private String preventiveShots;
	
	@Column(name="cleaning_shots")
	private String cleaningShots;
	
	@Column(name="per_shot_weight_Kg")
	private String perShotWeightKg;
	
	@Column(name="image")
	private String image;
	
	@Column(name = "created_by")
	private String createdBy;

	@Column(name = "status")
	private String status;
	
	@Column(name = "date_time_creation")
	private String dateTimeCreation;

	@Column(name = "date_time_modified")
	private String dateTimeModified;

	public Long getProductionMouldId() {
		return productionMouldId;
	}

	public void setProductionMouldId(Long productionMouldId) {
		this.productionMouldId = productionMouldId;
	}

	public String getMould() {
		return mould;
	}

	public void setMould(String mould) {
		this.mould = mould;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getToolLifeShots() {
		return toolLifeShots;
	}

	public void setToolLifeShots(String toolLifeShots) {
		this.toolLifeShots = toolLifeShots;
	}

	public String getPreventiveShots() {
		return preventiveShots;
	}

	public void setPreventiveShots(String preventiveShots) {
		this.preventiveShots = preventiveShots;
	}

	public String getCleaningShots() {
		return cleaningShots;
	}

	public void setCleaningShots(String cleaningShots) {
		this.cleaningShots = cleaningShots;
	}

	public String getPerShotWeightKg() {
		return perShotWeightKg;
	}

	public void setPerShotWeightKg(String perShotWeightKg) {
		this.perShotWeightKg = perShotWeightKg;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
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

	public ProductionMouldMaster(Long productionMouldId, String mould, String description, String toolLifeShots,
			String preventiveShots, String cleaningShots, String perShotWeightKg, String image, String createdBy,
			String status, String dateTimeCreation, String dateTimeModified) {
		super();
		this.productionMouldId = productionMouldId;
		this.mould = mould;
		this.description = description;
		this.toolLifeShots = toolLifeShots;
		this.preventiveShots = preventiveShots;
		this.cleaningShots = cleaningShots;
		this.perShotWeightKg = perShotWeightKg;
		this.image = image;
		this.createdBy = createdBy;
		this.status = status;
		this.dateTimeCreation = dateTimeCreation;
		this.dateTimeModified = dateTimeModified;
	}

	public ProductionMouldMaster() {
		super();
		// TODO Auto-generated constructor stub
	}

	

}
