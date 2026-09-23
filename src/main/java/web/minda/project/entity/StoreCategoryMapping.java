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
@Table(name="store_category_Mapping_master")
public class StoreCategoryMapping {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id")
	private Long storeCategoryMappingId;
	

	@ManyToOne
	@JoinColumn(name="category_id")
	@JsonIgnoreProperties("storeCategoryMappings")
	private StoreMaterialCategoryMaster category;
	
	@ManyToOne
	@JoinColumn(name="process_id")
	@JsonIgnoreProperties("storeCategoryMappings")
	private ProcessMaster process;
	
	@Column(name = "created_by")
	private String createdBy;

	@Column(name = "status")
	private String status;
	
	@Column(name = "date_time_creation")
	private String dateTimeCreation;

	@Column(name = "date_time_modified")
	private String dateTimeModified;

	public Long getStoreCategoryMappingId() {
		return storeCategoryMappingId;
	}

	public void setStoreCategoryMappingId(Long storeCategoryMappingId) {
		this.storeCategoryMappingId = storeCategoryMappingId;
	}

	public StoreMaterialCategoryMaster getCategory() {
		return category;
	}

	public void setCategory(StoreMaterialCategoryMaster category) {
		this.category = category;
	}

	public ProcessMaster getProcess() {
		return process;
	}

	public void setProcess(ProcessMaster process) {
		this.process = process;
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

	public StoreCategoryMapping(Long storeCategoryMappingId, StoreMaterialCategoryMaster category,
			ProcessMaster process, String createdBy, String status, String dateTimeCreation, String dateTimeModified) {
		super();
		this.storeCategoryMappingId = storeCategoryMappingId;
		this.category = category;
		this.process = process;
		this.createdBy = createdBy;
		this.status = status;
		this.dateTimeCreation = dateTimeCreation;
		this.dateTimeModified = dateTimeModified;
	}

	public StoreCategoryMapping() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	
	

}
