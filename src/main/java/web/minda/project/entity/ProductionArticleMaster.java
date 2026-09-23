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
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "Production_article_master")
public class ProductionArticleMaster {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long productionArticleId;

	@Column(name = "article")
	private String article;

	@Column(name = "description")
	private String description;

	@ManyToOne
	@JoinColumn(name = "production_article_category_id")
	@JsonIgnoreProperties("productionArticle")
	private ProductionArticleCategoryMaster productionArticleCategory;

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
	
	@Column(name = "net_weight")
	private String netWeight;
	
	@Column(name = "gross_weight")
	private String grossWeight;
	
	

	@OneToMany(mappedBy = "productionArticle", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonIgnoreProperties("productionArticle")
	private Set<ProductionRejection> productionRejection = new LinkedHashSet<>();

	@OneToMany(mappedBy = "productionArticle", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonIgnoreProperties("productionArticle")
	private Set<ProductionOperation> productionOperation = new LinkedHashSet<>();

	@OneToMany(mappedBy = "productionArticle", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonIgnoreProperties("productionArticle")
	private Set<ProductionArticleBom> productionArticleBom = new LinkedHashSet<>();

	@OneToMany(mappedBy = "productionArticle", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonIgnoreProperties("productionArticle")
	private Set<ProductionArticleRoute> productionArticleRoutes = new LinkedHashSet<>();

	@OneToMany(mappedBy = "productionArticle", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonIgnoreProperties("productionArticle")
	private Set<ProductionArticleDetails> productionArticleDetails = new LinkedHashSet<>();

	@OneToMany(mappedBy = "productionArticle", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonIgnoreProperties("productionArticle")
	private Set<PackingCustomerArticleMapping> packingCustomerArticleMappings = new LinkedHashSet<>();

	public Long getProductionArticleId() {
		return productionArticleId;
	}

	public void setProductionArticleId(Long productionArticleId) {
		this.productionArticleId = productionArticleId;
	}

	public String getArticle() {
		return article;
	}

	public void setArticle(String article) {
		this.article = article;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public ProductionArticleCategoryMaster getProductionArticleCategory() {
		return productionArticleCategory;
	}

	public void setProductionArticleCategory(ProductionArticleCategoryMaster productionArticleCategory) {
		this.productionArticleCategory = productionArticleCategory;
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

	public String getNetWeight() {
		return netWeight;
	}

	public void setNetWeight(String netWeight) {
		this.netWeight = netWeight;
	}

	public String getGrossWeight() {
		return grossWeight;
	}

	public void setGrossWeight(String grossWeight) {
		this.grossWeight = grossWeight;
	}

	public Set<ProductionRejection> getProductionRejection() {
		return productionRejection;
	}

	public void setProductionRejection(Set<ProductionRejection> productionRejection) {
		this.productionRejection = productionRejection;
	}

	public Set<ProductionOperation> getProductionOperation() {
		return productionOperation;
	}

	public void setProductionOperation(Set<ProductionOperation> productionOperation) {
		this.productionOperation = productionOperation;
	}

	public Set<ProductionArticleBom> getProductionArticleBom() {
		return productionArticleBom;
	}

	public void setProductionArticleBom(Set<ProductionArticleBom> productionArticleBom) {
		this.productionArticleBom = productionArticleBom;
	}

	public Set<ProductionArticleRoute> getProductionArticleRoutes() {
		return productionArticleRoutes;
	}

	public void setProductionArticleRoutes(Set<ProductionArticleRoute> productionArticleRoutes) {
		this.productionArticleRoutes = productionArticleRoutes;
	}

	public Set<ProductionArticleDetails> getProductionArticleDetails() {
		return productionArticleDetails;
	}

	public void setProductionArticleDetails(Set<ProductionArticleDetails> productionArticleDetails) {
		this.productionArticleDetails = productionArticleDetails;
	}

	public Set<PackingCustomerArticleMapping> getPackingCustomerArticleMappings() {
		return packingCustomerArticleMappings;
	}

	public void setPackingCustomerArticleMappings(Set<PackingCustomerArticleMapping> packingCustomerArticleMappings) {
		this.packingCustomerArticleMappings = packingCustomerArticleMappings;
	}

	public ProductionArticleMaster(Long productionArticleId, String article, String description,
			ProductionArticleCategoryMaster productionArticleCategory, String createdBy, String status,
			String dateTimeCreation, String dateTimeModified, String image, String netWeight, String grossWeight,
			Set<ProductionRejection> productionRejection, Set<ProductionOperation> productionOperation,
			Set<ProductionArticleBom> productionArticleBom, Set<ProductionArticleRoute> productionArticleRoutes,
			Set<ProductionArticleDetails> productionArticleDetails,
			Set<PackingCustomerArticleMapping> packingCustomerArticleMappings) {
		super();
		this.productionArticleId = productionArticleId;
		this.article = article;
		this.description = description;
		this.productionArticleCategory = productionArticleCategory;
		this.createdBy = createdBy;
		this.status = status;
		this.dateTimeCreation = dateTimeCreation;
		this.dateTimeModified = dateTimeModified;
		this.image = image;
		this.netWeight = netWeight;
		this.grossWeight = grossWeight;
		this.productionRejection = productionRejection;
		this.productionOperation = productionOperation;
		this.productionArticleBom = productionArticleBom;
		this.productionArticleRoutes = productionArticleRoutes;
		this.productionArticleDetails = productionArticleDetails;
		this.packingCustomerArticleMappings = packingCustomerArticleMappings;
	}

	public ProductionArticleMaster() {
		super();
		// TODO Auto-generated constructor stub
	}

	

}
