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
@Table(name = "mould_preventive_maintenance_master")
public class MouldPreventiveMaintenanceMaster {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long preventiveMaintenanceId;

	@Column(name = "mould_name")
	private String mouldName;

	@Column(name = "child_part_name")
	private String childPartName;

	@Column(name = "pm_date")
	private String pmDate;

	@Column(name = "alert_days")
	private String alertDays;

	@Column(name = "current_life")
	private String currentLife;
	
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
	@JoinColumn(name = "mould_childpart_id")
	private MouldChildPartMaster mouldChildPart;

	public Long getPreventiveMaintenanceId() {
		return preventiveMaintenanceId;
	}

	public void setPreventiveMaintenanceId(Long preventiveMaintenanceId) {
		this.preventiveMaintenanceId = preventiveMaintenanceId;
	}

	public String getMouldName() {
		return mouldName;
	}

	public void setMouldName(String mouldName) {
		this.mouldName = mouldName;
	}

	public String getChildPartName() {
		return childPartName;
	}

	public void setChildPartName(String childPartName) {
		this.childPartName = childPartName;
	}

	public String getPmDate() {
		return pmDate;
	}

	public void setPmDate(String pmDate) {
		this.pmDate = pmDate;
	}

	public String getAlertDays() {
		return alertDays;
	}

	public void setAlertDays(String alertDays) {
		this.alertDays = alertDays;
	}

	public String getCurrentLife() {
		return currentLife;
	}

	public void setCurrentLife(String currentLife) {
		this.currentLife = currentLife;
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

	public MouldChildPartMaster getMouldChildPart() {
		return mouldChildPart;
	}

	public void setMouldChildPart(MouldChildPartMaster mouldChildPart) {
		this.mouldChildPart = mouldChildPart;
	}

	public MouldPreventiveMaintenanceMaster(Long preventiveMaintenanceId, String mouldName, String childPartName,
			String pmDate, String alertDays, String currentLife, String createdBy, String status,
			String dateTimeCreation, String dateTimeModified, String image, MouldChildPartMaster mouldChildPart) {
		super();
		this.preventiveMaintenanceId = preventiveMaintenanceId;
		this.mouldName = mouldName;
		this.childPartName = childPartName;
		this.pmDate = pmDate;
		this.alertDays = alertDays;
		this.currentLife = currentLife;
		this.createdBy = createdBy;
		this.status = status;
		this.dateTimeCreation = dateTimeCreation;
		this.dateTimeModified = dateTimeModified;
		this.image = image;
		this.mouldChildPart = mouldChildPart;
	}

	public MouldPreventiveMaintenanceMaster() {
		super();
		// TODO Auto-generated constructor stub
	}

	

}
