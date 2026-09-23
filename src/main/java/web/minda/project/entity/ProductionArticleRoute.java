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
@Table(name="Production_article_process")
public class ProductionArticleRoute {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id")
	private Long productionArticleRouteId;
	
	@ManyToOne
	@JoinColumn(name= "production_article_id")
	@JsonIgnoreProperties("productionArticleRoutes")
	private ProductionArticleMaster productionArticle;
	
	@ManyToOne
	@JoinColumn(name= "process_id")
	@JsonIgnoreProperties("productionArticleRoutes")
	private ProcessMaster process;
	
	@Column(name="scan")
	private String scan;
	
	@Column(name = "created_by")
	private String createdBy;

	@Column(name = "status")
	private String status;
	
	@Column(name = "date_time_creation")
	private String dateTimeCreation;

	@Column(name = "date_time_modified")
	private String dateTimeModified;

	public Long getProductionArticleRouteId() {
		return productionArticleRouteId;
	}

	public void setProductionArticleRouteId(Long productionArticleRouteId) {
		this.productionArticleRouteId = productionArticleRouteId;
	}

	public ProductionArticleMaster getProductionArticle() {
		return productionArticle;
	}

	public void setProductionArticle(ProductionArticleMaster productionArticle) {
		this.productionArticle = productionArticle;
	}

	public ProcessMaster getProcess() {
		return process;
	}

	public void setProcess(ProcessMaster process) {
		this.process = process;
	}

	public String getScan() {
		return scan;
	}

	public void setScan(String scan) {
		this.scan = scan;
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

	public ProductionArticleRoute(Long productionArticleRouteId, ProductionArticleMaster productionArticle,
			ProcessMaster process, String scan, String createdBy, String status, String dateTimeCreation,
			String dateTimeModified) {
		super();
		this.productionArticleRouteId = productionArticleRouteId;
		this.productionArticle = productionArticle;
		this.process = process;
		this.scan = scan;
		this.createdBy = createdBy;
		this.status = status;
		this.dateTimeCreation = dateTimeCreation;
		this.dateTimeModified = dateTimeModified;
	}

	public ProductionArticleRoute() {
		super();
		// TODO Auto-generated constructor stub
	}
	

	
}
