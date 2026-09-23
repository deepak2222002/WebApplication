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
@Table(name = "production_article_category_master")
public class ProductionArticleCategoryMaster {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long productionArticleCategoryId;

	@Column(name = "article_category")
	private String articleCategory;

	@Column(name = "description")
	private String description;

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

	@OneToMany(mappedBy = "productionArticleCategory", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonIgnoreProperties("productionArticleCategory")
	private Set<ProductionArticleMaster> productionArticle = new LinkedHashSet<>();

	public Long getProductionArticleCategoryId() {
		return productionArticleCategoryId;
	}

	public void setProductionArticleCategoryId(Long productionArticleCategoryId) {
		this.productionArticleCategoryId = productionArticleCategoryId;
	}

	public String getArticleCategory() {
		return articleCategory;
	}

	public void setArticleCategory(String articleCategory) {
		this.articleCategory = articleCategory;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
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

	public Set<ProductionArticleMaster> getProductionArticle() {
		return productionArticle;
	}

	public void setProductionArticle(Set<ProductionArticleMaster> productionArticle) {
		this.productionArticle = productionArticle;
	}

	public ProductionArticleCategoryMaster(Long productionArticleCategoryId, String articleCategory, String description,
			String createdBy, String status, String dateTimeCreation, String dateTimeModified, String image,
			Set<ProductionArticleMaster> productionArticle) {
		super();
		this.productionArticleCategoryId = productionArticleCategoryId;
		this.articleCategory = articleCategory;
		this.description = description;
		this.createdBy = createdBy;
		this.status = status;
		this.dateTimeCreation = dateTimeCreation;
		this.dateTimeModified = dateTimeModified;
		this.image = image;
		this.productionArticle = productionArticle;
	}

	public ProductionArticleCategoryMaster() {
		super();
		// TODO Auto-generated constructor stub
	}

	public boolean isPresent() {
		// TODO Auto-generated method stub
		return false;
	}

	public ProductionArticleCategoryMaster get() {
		// TODO Auto-generated method stub
		return null;
	}

	
}
