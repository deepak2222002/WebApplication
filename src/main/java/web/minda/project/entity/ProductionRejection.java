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
@Table(name="Production_rejection")
public class ProductionRejection {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id")
	private Long productionRejectionId;
	
	@Column(name="description")
	private String description;
	
	@Column(name="rejection")
	private String rejection;
	
	@ManyToOne
	@JoinColumn(name= "production_article_id")
	@JsonIgnoreProperties("productionRejection")
	private ProductionArticleMaster productionArticle;
	
	@Column(name = "created_by")
	private String createdBy;

	@Column(name = "status")
	private String status;
	
	@Column(name = "date_time_creation")
	private String dateTimeCreation;

	@Column(name = "date_time_modified")
	private String dateTimeModified;

	public Long getProductionRejectionId() {
		return productionRejectionId;
	}

	public void setProductionRejectionId(Long productionRejectionId) {
		this.productionRejectionId = productionRejectionId;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getRejection() {
		return rejection;
	}

	public void setRejection(String rejection) {
		this.rejection = rejection;
	}

	public ProductionArticleMaster getProductionArticle() {
		return productionArticle;
	}

	public void setProductionArticle(ProductionArticleMaster productionArticle) {
		this.productionArticle = productionArticle;
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

	public ProductionRejection(Long productionRejectionId, String description, String rejection,
			ProductionArticleMaster productionArticle, String createdBy, String status, String dateTimeCreation,
			String dateTimeModified) {
		super();
		this.productionRejectionId = productionRejectionId;
		this.description = description;
		this.rejection = rejection;
		this.productionArticle = productionArticle;
		this.createdBy = createdBy;
		this.status = status;
		this.dateTimeCreation = dateTimeCreation;
		this.dateTimeModified = dateTimeModified;
	}

	public ProductionRejection() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	
	
}
