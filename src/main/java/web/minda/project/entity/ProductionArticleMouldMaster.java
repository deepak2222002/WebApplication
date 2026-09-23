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
@Table(name="production_article_mould")
public class ProductionArticleMouldMaster {
	
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id")
	private Long productionArticleMouldId;
	
	@Column(name="shots_per_day")
	private String shotsPerDay;
	
	@ManyToOne
	@JoinColumn(name= "production_article_id")
	@JsonIgnoreProperties("productionRejection")
	private ProductionArticleMaster productionArticle;
	
	
	@ManyToOne
	@JoinColumn(name= "production_mould_id")
	@JsonIgnoreProperties("productionMould")
	private ProductionMouldMaster productionMouldMaster;
	
	@Column(name = "image")
	private String image;
	
	@Column(name = "created_by")
	private String createdBy;

	@Column(name = "status")
	private String status;
	
	@Column(name = "date_time_creation")
	private String dateTimeCreation;

	@Column(name = "date_time_modified")
	private String dateTimeModified;

	public Long getProductionArticleMouldId() {
		return productionArticleMouldId;
	}

	public void setProductionArticleMouldId(Long productionArticleMouldId) {
		this.productionArticleMouldId = productionArticleMouldId;
	}

	public String getShotsPerDay() {
		return shotsPerDay;
	}

	public void setShotsPerDay(String shotsPerDay) {
		this.shotsPerDay = shotsPerDay;
	}

	public ProductionArticleMaster getProductionArticle() {
		return productionArticle;
	}

	public void setProductionArticle(ProductionArticleMaster productionArticle) {
		this.productionArticle = productionArticle;
	}

	public ProductionMouldMaster getProductionMouldMaster() {
		return productionMouldMaster;
	}

	public void setProductionMouldMaster(ProductionMouldMaster productionMouldMaster) {
		this.productionMouldMaster = productionMouldMaster;
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

	public ProductionArticleMouldMaster(Long productionArticleMouldId, String shotsPerDay,
			ProductionArticleMaster productionArticle, ProductionMouldMaster productionMouldMaster, String image,
			String createdBy, String status, String dateTimeCreation, String dateTimeModified) {
		super();
		this.productionArticleMouldId = productionArticleMouldId;
		this.shotsPerDay = shotsPerDay;
		this.productionArticle = productionArticle;
		this.productionMouldMaster = productionMouldMaster;
		this.image = image;
		this.createdBy = createdBy;
		this.status = status;
		this.dateTimeCreation = dateTimeCreation;
		this.dateTimeModified = dateTimeModified;
	}

	public ProductionArticleMouldMaster() {
		super();
		// TODO Auto-generated constructor stub
	}

	


}
