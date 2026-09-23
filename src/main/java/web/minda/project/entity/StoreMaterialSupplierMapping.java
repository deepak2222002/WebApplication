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
@Table(name="store_material_supplier_mapping")
public class StoreMaterialSupplierMapping {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long storeMaterialSupplierMappingId;
	
	@ManyToOne
	@JoinColumn(name="store_material_id")
	@JsonIgnoreProperties("storeMaterialSupplierMappings")
	private StoreMaterial storeMaterial;
	
	@ManyToOne
	@JoinColumn(name = "supplier_id")
	@JsonIgnoreProperties("storeMaterialSupplierMappings")
	private SupplierMaster supplier;
	
	@Column(name = "created_by")
	private String createdBy;

	@Column(name = "status")
	private String status;
	
	@Column(name = "date_time_creation")
	private String dateTimeCreation;

	@Column(name = "date_time_modified")
	private String dateTimeModified;

	public Long getStoreMaterialSupplierMappingId() {
		return storeMaterialSupplierMappingId;
	}

	public void setStoreMaterialSupplierMappingId(Long storeMaterialSupplierMappingId) {
		this.storeMaterialSupplierMappingId = storeMaterialSupplierMappingId;
	}

	public StoreMaterial getStoreMaterial() {
		return storeMaterial;
	}

	public void setStoreMaterial(StoreMaterial storeMaterial) {
		this.storeMaterial = storeMaterial;
	}

	public SupplierMaster getSupplier() {
		return supplier;
	}

	public void setSupplier(SupplierMaster supplier) {
		this.supplier = supplier;
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

	public StoreMaterialSupplierMapping(Long storeMaterialSupplierMappingId, StoreMaterial storeMaterial,
			SupplierMaster supplier, String createdBy, String status, String dateTimeCreation,
			String dateTimeModified) {
		super();
		this.storeMaterialSupplierMappingId = storeMaterialSupplierMappingId;
		this.storeMaterial = storeMaterial;
		this.supplier = supplier;
		this.createdBy = createdBy;
		this.status = status;
		this.dateTimeCreation = dateTimeCreation;
		this.dateTimeModified = dateTimeModified;
	}

	public StoreMaterialSupplierMapping() {
		super();
		// TODO Auto-generated constructor stub
	}

	@Override
	public String toString() {
		return "StoreMaterialSupplierMapping [storeMaterialSupplierMappingId=" + storeMaterialSupplierMappingId
				+ ", storeMaterial=" + storeMaterial + ", supplier=" + supplier + ", createdBy=" + createdBy
				+ ", status=" + status + ", dateTimeCreation=" + dateTimeCreation + ", dateTimeModified="
				+ dateTimeModified + "]";
	}
	
	
	
	

}
