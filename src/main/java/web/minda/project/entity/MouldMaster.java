package web.minda.project.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "mould_master")
public class MouldMaster {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long mouldId;

	@Column(name = "mould_name")
	private String mouldName;

	@Column(name = "description")
	private String description;

	@Column(name = "date_of_install")
	private String dateOfInstallation;

	@Column(name = "supplier_name")
	private String supplierName;

	@Column(name = "cavity")
	private String cavity;

	@Column(name = "no_of_shot")
	private String noOfShot;

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

	@ManyToOne
	@JoinColumn(name = "supplier_id")
	private SupplierMaster supplier;

	public Long getMouldId() {
		return mouldId;
	}

	public void setMouldId(Long mouldId) {
		this.mouldId = mouldId;
	}

	public String getMouldName() {
		return mouldName;
	}

	public void setMouldName(String mouldName) {
		this.mouldName = mouldName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getDateOfInstallation() {
		return dateOfInstallation;
	}

	public void setDateOfInstallation(String dateOfInstallation) {
		this.dateOfInstallation = dateOfInstallation;
	}

	public String getSupplierName() {
		return supplierName;
	}

	public void setSupplierName(String supplierName) {
		this.supplierName = supplierName;
	}

	public String getCavity() {
		return cavity;
	}

	public void setCavity(String cavity) {
		this.cavity = cavity;
	}

	public String getNoOfShot() {
		return noOfShot;
	}

	public void setNoOfShot(String noOfShot) {
		this.noOfShot = noOfShot;
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

	public SupplierMaster getSupplier() {
		return supplier;
	}

	public void setSupplier(SupplierMaster supplier) {
		this.supplier = supplier;
	}

	public MouldMaster(Long mouldId, String mouldName, String description, String dateOfInstallation,
			String supplierName, String cavity, String noOfShot, String createdBy, String status,
			String dateTimeCreation, String dateTimeModified, String image, SupplierMaster supplier) {
		super();
		this.mouldId = mouldId;
		this.mouldName = mouldName;
		this.description = description;
		this.dateOfInstallation = dateOfInstallation;
		this.supplierName = supplierName;
		this.cavity = cavity;
		this.noOfShot = noOfShot;
		this.createdBy = createdBy;
		this.status = status;
		this.dateTimeCreation = dateTimeCreation;
		this.dateTimeModified = dateTimeModified;
		this.image = image;
		this.supplier = supplier;
	}

	public MouldMaster() {
		super();
		// TODO Auto-generated constructor stub
	}

}
