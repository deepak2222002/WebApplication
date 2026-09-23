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
@Table(name="Production_article_details")
public class ProductionArticleDetails {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id")
	private Long productionArticleDetailId;
	
	@ManyToOne
	@JoinColumn(name= "production_article_id")
	@JsonIgnoreProperties("productionArticleDetails")
	private ProductionArticleMaster productionArticle;
	
	@Column(name="customer_article")
	private String customerArticle;
	
	@Column(name="mould")
	private String mould;
	
	@Column(name="cold_runner")
	private String coldRunner;
	
	@Column(name="weight")
	private String weight;
	
	@Column(name="image_path")
	private String imagePath;
	
	@Column(name="similar_looking")
	private String similarLooking;
	
	
	@Column(name = "created_by")
	private String createdBy;

	@Column(name = "status")
	private String status;
	
	@Column(name = "date_time_creation")
	private String dateTimeCreation;

	@Column(name = "date_time_modified")
	private String dateTimeModified;

	public Long getProductionArticleDetailId() {
		return productionArticleDetailId;
	}

	public void setProductionArticleDetailId(Long productionArticleDetailId) {
		this.productionArticleDetailId = productionArticleDetailId;
	}

	public ProductionArticleMaster getProductionArticle() {
		return productionArticle;
	}

	public void setProductionArticle(ProductionArticleMaster productionArticle) {
		this.productionArticle = productionArticle;
	}

	public String getCustomerArticle() {
		return customerArticle;
	}

	public void setCustomerArticle(String customerArticle) {
		this.customerArticle = customerArticle;
	}

	public String getMould() {
		return mould;
	}

	public void setMould(String mould) {
		this.mould = mould;
	}

	public String getColdRunner() {
		return coldRunner;
	}

	public void setColdRunner(String coldRunner) {
		this.coldRunner = coldRunner;
	}

	public String getWeight() {
		return weight;
	}

	public void setWeight(String weight) {
		this.weight = weight;
	}

	public String getImagePath() {
		return imagePath;
	}

	public void setImagePath(String imagePath) {
		this.imagePath = imagePath;
	}

	public String getSimilarLooking() {
		return similarLooking;
	}

	public void setSimilarLooking(String similarLooking) {
		this.similarLooking = similarLooking;
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

	public ProductionArticleDetails(Long productionArticleDetailId, ProductionArticleMaster productionArticle,
			String customerArticle, String mould, String coldRunner, String weight, String imagePath,
			String similarLooking, String createdBy, String status, String dateTimeCreation, String dateTimeModified) {
		super();
		this.productionArticleDetailId = productionArticleDetailId;
		this.productionArticle = productionArticle;
		this.customerArticle = customerArticle;
		this.mould = mould;
		this.coldRunner = coldRunner;
		this.weight = weight;
		this.imagePath = imagePath;
		this.similarLooking = similarLooking;
		this.createdBy = createdBy;
		this.status = status;
		this.dateTimeCreation = dateTimeCreation;
		this.dateTimeModified = dateTimeModified;
	}

	public ProductionArticleDetails() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	
	
	

}
