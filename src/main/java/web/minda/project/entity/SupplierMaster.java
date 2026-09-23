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
@Table(name = "supplier_master")
public class SupplierMaster {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long supplierId;

	@Column(name = "supplier_name")
	private String supplierName;

	@Column(name = "address")
	private String address;

	@Column(name = "contact_no")
	private String contactNo;

	@Column(name = "status")
	private String status;

	@Column(name = "created_by")
	private String createdBy;

	@Column(name = "date_time_creation")
	private String dateTimeCreation;

	@Column(name = "date_time_modified")
	private String dateTimeModified;

	@OneToMany(mappedBy = "supplier", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonIgnoreProperties("supplier")
	private Set<StoreMaterialSupplierMapping> storeMaterialSupplierMappings = new LinkedHashSet<>();

	public Long getSupplierId() {
		return supplierId;
	}

	public void setSupplierId(Long supplierId) {
		this.supplierId = supplierId;
	}

	public String getSupplierName() {
		return supplierName;
	}

	public void setSupplierName(String supplierName) {
		this.supplierName = supplierName;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getContactNo() {
		return contactNo;
	}

	public void setContactNo(String contactNo) {
		this.contactNo = contactNo;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
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

	public Set<StoreMaterialSupplierMapping> getStoreMaterialSupplierMappings() {
		return storeMaterialSupplierMappings;
	}

	public void setStoreMaterialSupplierMappings(Set<StoreMaterialSupplierMapping> storeMaterialSupplierMappings) {
		this.storeMaterialSupplierMappings = storeMaterialSupplierMappings;
	}

	public SupplierMaster() {
		super();
		// TODO Auto-generated constructor stub
	}

	public SupplierMaster(Long supplierId, String supplierName, String address, String contactNo, String status,
			String createdBy, String dateTimeCreation, String dateTimeModified,
			Set<StoreMaterialSupplierMapping> storeMaterialSupplierMappings) {
		super();
		this.supplierId = supplierId;
		this.supplierName = supplierName;
		this.address = address;
		this.contactNo = contactNo;
		this.status = status;
		this.createdBy = createdBy;
		this.dateTimeCreation = dateTimeCreation;
		this.dateTimeModified = dateTimeModified;
		this.storeMaterialSupplierMappings = storeMaterialSupplierMappings;
	}

}
