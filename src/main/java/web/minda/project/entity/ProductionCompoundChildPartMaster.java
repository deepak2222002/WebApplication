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
@Table(name = "production_compound_child_part_master")
public class ProductionCompoundChildPartMaster {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long productionCompoundChildPartId;
	
	
	@ManyToOne
	@JoinColumn(name= "production_compound_id")
	@JsonIgnoreProperties("productionCompound")
	private ProductionCompoundMaster productionCompoundMaster;

	@Column(name = "acceleraters")
	private String acceleraters;
	
	@Column(name = "unit")
	private String unit;
	
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

	public Long getProductionCompoundChildPartId() {
		return productionCompoundChildPartId;
	}

	public void setProductionCompoundChildPartId(Long productionCompoundChildPartId) {
		this.productionCompoundChildPartId = productionCompoundChildPartId;
	}

	public ProductionCompoundMaster getProductionCompoundMaster() {
		return productionCompoundMaster;
	}

	public void setProductionCompoundMaster(ProductionCompoundMaster productionCompoundMaster) {
		this.productionCompoundMaster = productionCompoundMaster;
	}

	public String getAcceleraters() {
		return acceleraters;
	}

	public void setAcceleraters(String acceleraters) {
		this.acceleraters = acceleraters;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
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

	public ProductionCompoundChildPartMaster(Long productionCompoundChildPartId,
			ProductionCompoundMaster productionCompoundMaster, String acceleraters, String unit, String createdBy,
			String status, String dateTimeCreation, String dateTimeModified, String image) {
		super();
		this.productionCompoundChildPartId = productionCompoundChildPartId;
		this.productionCompoundMaster = productionCompoundMaster;
		this.acceleraters = acceleraters;
		this.unit = unit;
		this.createdBy = createdBy;
		this.status = status;
		this.dateTimeCreation = dateTimeCreation;
		this.dateTimeModified = dateTimeModified;
		this.image = image;
	}

	public ProductionCompoundChildPartMaster() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	
	
	
	

}
