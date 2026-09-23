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
@Table(name = "store_material_master")
public class StoreMaterial {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long storeMaterialId;

	@Column(name = "material")
	private String material;

	@Column(name = "uom")
	private String uom;

	@Column(name = "description")
	private String description;

	@Column(name = "created_by")
	private String createdBy;

	@Column(name = "status")
	private String status;
	
	@Column(name = "allow_multiple")
	private Boolean allowMultiple = false;

	@Column(name = "date_time_creation")
	private String dateTimeCreation;

	@Column(name = "date_time_modified")
	private String dateTimeModified;

	@Column(name = "image")
	private String image;

	@ManyToOne
	@JoinColumn(name = "category_id")
	@JsonIgnoreProperties("storeMaterial")
	private StoreMaterialCategoryMaster category;

	@OneToMany(mappedBy = "storeMaterial", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonIgnoreProperties("storeMaterial")
	private Set<StoreMaterialSupplierMapping> storeMaterialSupplierMappings = new LinkedHashSet<>();

	public Long getStoreMaterialId() {
		return storeMaterialId;
	}

	public void setStoreMaterialId(Long storeMaterialId) {
		this.storeMaterialId = storeMaterialId;
	}

	public String getMaterial() {
		return material;
	}

	public void setMaterial(String material) {
		this.material = material;
	}

	public String getUom() {
		return uom;
	}

	public void setUom(String uom) {
		this.uom = uom;
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

	public Boolean getAllowMultiple() {
		return allowMultiple;
	}

	public void setAllowMultiple(Boolean allowMultiple) {
		this.allowMultiple = allowMultiple;
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

	public StoreMaterialCategoryMaster getCategory() {
		return category;
	}

	public void setCategory(StoreMaterialCategoryMaster category) {
		this.category = category;
	}

	public Set<StoreMaterialSupplierMapping> getStoreMaterialSupplierMappings() {
		return storeMaterialSupplierMappings;
	}

	public void setStoreMaterialSupplierMappings(Set<StoreMaterialSupplierMapping> storeMaterialSupplierMappings) {
		this.storeMaterialSupplierMappings = storeMaterialSupplierMappings;
	}

	public StoreMaterial(Long storeMaterialId, String material, String uom, String description, String createdBy,
			String status, Boolean allowMultiple, String dateTimeCreation, String dateTimeModified, String image,
			StoreMaterialCategoryMaster category, Set<StoreMaterialSupplierMapping> storeMaterialSupplierMappings) {
		super();
		this.storeMaterialId = storeMaterialId;
		this.material = material;
		this.uom = uom;
		this.description = description;
		this.createdBy = createdBy;
		this.status = status;
		this.allowMultiple = allowMultiple;
		this.dateTimeCreation = dateTimeCreation;
		this.dateTimeModified = dateTimeModified;
		this.image = image;
		this.category = category;
		this.storeMaterialSupplierMappings = storeMaterialSupplierMappings;
	}

	public StoreMaterial() {
		super();
		// TODO Auto-generated constructor stub
	}

	

}
