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
@Table(name = "process_Master")
public class ProcessMaster {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long processId;

	@Column(name = "process_name")
	private String processName;

	@Column(name = "description")
	private String description;

	@Column(name = "process_data")
	private String processData;

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

	@OneToMany(mappedBy = "process", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonIgnoreProperties("process")
	Set<StoreCategoryMapping> storeCategoryMappings = new LinkedHashSet<>();

	@OneToMany(mappedBy = "process", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonIgnoreProperties("process")
	Set<ProductionArticleRoute> productionArticleRoutes = new LinkedHashSet<>();

	public Long getProcessId() {
		return processId;
	}

	public void setProcessId(Long processId) {
		this.processId = processId;
	}

	public String getProcessName() {
		return processName;
	}

	public void setProcessName(String processName) {
		this.processName = processName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getProcessData() {
		return processData;
	}

	public void setProcessData(String processData) {
		this.processData = processData;
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

	public Set<StoreCategoryMapping> getStoreCategoryMappings() {
		return storeCategoryMappings;
	}

	public void setStoreCategoryMappings(Set<StoreCategoryMapping> storeCategoryMappings) {
		this.storeCategoryMappings = storeCategoryMappings;
	}

	public Set<ProductionArticleRoute> getProductionArticleRoutes() {
		return productionArticleRoutes;
	}

	public void setProductionArticleRoutes(Set<ProductionArticleRoute> productionArticleRoutes) {
		this.productionArticleRoutes = productionArticleRoutes;
	}

	public ProcessMaster(Long processId, String processName, String description, String processData, String createdBy,
			String status, String dateTimeCreation, String dateTimeModified, String image,
			Set<StoreCategoryMapping> storeCategoryMappings, Set<ProductionArticleRoute> productionArticleRoutes) {
		super();
		this.processId = processId;
		this.processName = processName;
		this.description = description;
		this.processData = processData;
		this.createdBy = createdBy;
		this.status = status;
		this.dateTimeCreation = dateTimeCreation;
		this.dateTimeModified = dateTimeModified;
		this.image = image;
		this.storeCategoryMappings = storeCategoryMappings;
		this.productionArticleRoutes = productionArticleRoutes;
	}

	public ProcessMaster() {
		super();
		// TODO Auto-generated constructor stub
	}

}
