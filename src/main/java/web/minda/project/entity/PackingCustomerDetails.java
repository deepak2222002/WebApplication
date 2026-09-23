package web.minda.project.entity;

import java.util.LinkedHashSet;
import java.util.Set;

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
@Table(name="packing_customer_details")
public class PackingCustomerDetails {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id")
	private Long packingCustomerDetailId;
	
	@Column(name="customer_name")
	private String customerName;
	
	@Column(name="description")
	private String description;
	
	@Column(name="destination_code")
	private String destinationCode;
	
	@Column(name="address_1")
	private String address1;
	
	@Column(name="address_2")
	private String address2;
	
	@Column(name="address_3")
	private String address3;
	
	@Column(name="address_4")
	private String address4;
	
	@Column(name = "created_by")
	private String createdBy;

	@Column(name = "status")
	private String status;
	
	@Column(name = "date_time_creation")
	private String dateTimeCreation;

	@Column(name = "date_time_modified")
	private String dateTimeModified;
	
	@OneToMany(mappedBy = "packingCustomerDetails" , cascade = CascadeType.ALL,fetch = FetchType.LAZY)
	private Set<PackingCustomerArticleMapping> packingCustomerArticleMappings= new LinkedHashSet<>();

	public Long getPackingCustomerDetailId() {
		return packingCustomerDetailId;
	}

	public void setPackingCustomerDetailId(Long packingCustomerDetailId) {
		this.packingCustomerDetailId = packingCustomerDetailId;
	}

	public String getCustomerName() {
		return customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getDestinationCode() {
		return destinationCode;
	}

	public void setDestinationCode(String destinationCode) {
		this.destinationCode = destinationCode;
	}

	public String getAddress1() {
		return address1;
	}

	public void setAddress1(String address1) {
		this.address1 = address1;
	}

	public String getAddress2() {
		return address2;
	}

	public void setAddress2(String address2) {
		this.address2 = address2;
	}

	public String getAddress3() {
		return address3;
	}

	public void setAddress3(String address3) {
		this.address3 = address3;
	}

	public String getAddress4() {
		return address4;
	}

	public void setAddress4(String address4) {
		this.address4 = address4;
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

	public Set<PackingCustomerArticleMapping> getPackingCustomerArticleMappings() {
		return packingCustomerArticleMappings;
	}

	public void setPackingCustomerArticleMappings(Set<PackingCustomerArticleMapping> packingCustomerArticleMappings) {
		this.packingCustomerArticleMappings = packingCustomerArticleMappings;
	}

	public PackingCustomerDetails(Long packingCustomerDetailId, String customerName, String description,
			String destinationCode, String address1, String address2, String address3, String address4,
			String createdBy, String status, String dateTimeCreation, String dateTimeModified,
			Set<PackingCustomerArticleMapping> packingCustomerArticleMappings) {
		super();
		this.packingCustomerDetailId = packingCustomerDetailId;
		this.customerName = customerName;
		this.description = description;
		this.destinationCode = destinationCode;
		this.address1 = address1;
		this.address2 = address2;
		this.address3 = address3;
		this.address4 = address4;
		this.createdBy = createdBy;
		this.status = status;
		this.dateTimeCreation = dateTimeCreation;
		this.dateTimeModified = dateTimeModified;
		this.packingCustomerArticleMappings = packingCustomerArticleMappings;
	}

	public PackingCustomerDetails() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	
	

}
