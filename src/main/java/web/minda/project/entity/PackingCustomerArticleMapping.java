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
@Table(name="Packing_customer_article_mapping")
public class PackingCustomerArticleMapping {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id")
	private Long packingCustomerArticleMappingId;
	
	@ManyToOne
	@JoinColumn(name= "production_article_id")
	@JsonIgnoreProperties("packingCustomerArticleMappings")
	private ProductionArticleMaster productionArticle;
	
	@ManyToOne
	@JoinColumn(name= "production_customer_details_id")
	@JsonIgnoreProperties("packingCustomerArticleMappings")
	private PackingCustomerDetails packingCustomerDetails;
	
	@Column(name = "destination_code")
	private String destinationCode;
	
	@Column(name = "created_by")
	private String createdBy;

	@Column(name = "status")
	private String status;
	
	@Column(name = "date_time_creation")
	private String dateTimeCreation;

	@Column(name = "date_time_modified")
	private String dateTimeModified;

	public Long getPackingCustomerArticleMappingId() {
		return packingCustomerArticleMappingId;
	}

	public void setPackingCustomerArticleMappingId(Long packingCustomerArticleMappingId) {
		this.packingCustomerArticleMappingId = packingCustomerArticleMappingId;
	}

	public ProductionArticleMaster getProductionArticle() {
		return productionArticle;
	}

	public void setProductionArticle(ProductionArticleMaster productionArticle) {
		this.productionArticle = productionArticle;
	}

	public PackingCustomerDetails getPackingCustomerDetails() {
		return packingCustomerDetails;
	}

	public void setPackingCustomerDetails(PackingCustomerDetails packingCustomerDetails) {
		this.packingCustomerDetails = packingCustomerDetails;
	}

	public String getDestinationCode() {
		return destinationCode;
	}

	public void setDestinationCode(String destinationCode) {
		this.destinationCode = destinationCode;
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

	public PackingCustomerArticleMapping(Long packingCustomerArticleMappingId,
			ProductionArticleMaster productionArticle, PackingCustomerDetails packingCustomerDetails,
			String destinationCode, String createdBy, String status, String dateTimeCreation, String dateTimeModified) {
		super();
		this.packingCustomerArticleMappingId = packingCustomerArticleMappingId;
		this.productionArticle = productionArticle;
		this.packingCustomerDetails = packingCustomerDetails;
		this.destinationCode = destinationCode;
		this.createdBy = createdBy;
		this.status = status;
		this.dateTimeCreation = dateTimeCreation;
		this.dateTimeModified = dateTimeModified;
	}

	public PackingCustomerArticleMapping() {
		super();
		// TODO Auto-generated constructor stub
	}

	
	
}
