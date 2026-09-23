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
@Table(name="Production_article_child_part")
public class ProductionArticleBom {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id")
	private Long productionArticleBomId;
	
	@Column(name="description")
	private String description;
	
	@Column(name="child_part")
	private String childPart;
	
	@ManyToOne
	@JoinColumn(name= "production_article_id")
	@JsonIgnoreProperties("productionArticleBom")
	private ProductionArticleMaster productionArticle;

	
	@Column(name = "issuence_category")
	private String issuenceCategory;
	
	@Column(name = "created_by")
	private String createdBy;

	@Column(name = "status")
	private String status;
	
	@Column(name = "date_time_creation")
	private String dateTimeCreation;

	@Column(name = "date_time_modified")
	private String dateTimeModified;

	public Long getProductionArticleBomId() {
		return productionArticleBomId;
	}

	public void setProductionArticleBomId(Long productionArticleBomId) {
		this.productionArticleBomId = productionArticleBomId;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getChildPart() {
		return childPart;
	}

	public void setChildPart(String childPart) {
		this.childPart = childPart;
	}

	public ProductionArticleMaster getProductionArticle() {
		return productionArticle;
	}

	public void setProductionArticle(ProductionArticleMaster productionArticle) {
		this.productionArticle = productionArticle;
	}

	public String getIssuenceCategory() {
		return issuenceCategory;
	}

	public void setIssuenceCategory(String issuenceCategory) {
		this.issuenceCategory = issuenceCategory;
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

	public ProductionArticleBom(Long productionArticleBomId, String description, String childPart,
			ProductionArticleMaster productionArticle, String issuenceCategory, String createdBy, String status,
			String dateTimeCreation, String dateTimeModified) {
		super();
		this.productionArticleBomId = productionArticleBomId;
		this.description = description;
		this.childPart = childPart;
		this.productionArticle = productionArticle;
		this.issuenceCategory = issuenceCategory;
		this.createdBy = createdBy;
		this.status = status;
		this.dateTimeCreation = dateTimeCreation;
		this.dateTimeModified = dateTimeModified;
	}

	public ProductionArticleBom() {
		super();
		// TODO Auto-generated constructor stub
	}


	
	
}
