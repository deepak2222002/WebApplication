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
@Table(name = "preventive_maintenance_history_master")
public class PreventiveMaintenanceHistoryMaster {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long preventiveMaintenanceHistoryId;

	@Column(name = "mould_name")
	private String mouldName;

	@Column(name = "child_part_name")
	private String childPartName;

	@Column(name = "total_life")
	private String totalLife;

	@Column(name = "current_life")
	private String currentLife;

	@Column(name = "pm_date")
	private String pmDate;

	@Column(name = "life_status")
	private String lifeStatus;

	@Column(name = "pm_status")
	private String pmStatus;

	@Column(name = "action_taken")
	private String actionTaken;

	@Column(name = "remark")
	private String remark;

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

	public Long getPreventiveMaintenanceHistoryId() {
		return preventiveMaintenanceHistoryId;
	}

	public void setPreventiveMaintenanceHistoryId(Long preventiveMaintenanceHistoryId) {
		this.preventiveMaintenanceHistoryId = preventiveMaintenanceHistoryId;
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

	public String getTotalLife() {
		return totalLife;
	}

	public void setTotalLife(String totalLife) {
		this.totalLife = totalLife;
	}

	public String getCurrentLife() {
		return currentLife;
	}

	public void setCurrentLife(String currentLife) {
		this.currentLife = currentLife;
	}

	public String getPmDate() {
		return pmDate;
	}

	public void setPmDate(String pmDate) {
		this.pmDate = pmDate;
	}

	public String getLifeStatus() {
		return lifeStatus;
	}

	public void setLifeStatus(String lifeStatus) {
		this.lifeStatus = lifeStatus;
	}

	public String getPmStatus() {
		return pmStatus;
	}

	public void setPmStatus(String pmStatus) {
		this.pmStatus = pmStatus;
	}

	public String getActionTaken() {
		return actionTaken;
	}

	public void setActionTaken(String actionTaken) {
		this.actionTaken = actionTaken;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
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

	public PreventiveMaintenanceHistoryMaster(Long preventiveMaintenanceHistoryId, String mouldName,
			String childPartName, String totalLife, String currentLife, String pmDate, String lifeStatus,
			String pmStatus, String actionTaken, String remark, String createdBy, String status,
			String dateTimeCreation, String dateTimeModified, String image) {
		super();
		this.preventiveMaintenanceHistoryId = preventiveMaintenanceHistoryId;
		this.mouldName = mouldName;
		this.childPartName = childPartName;
		this.totalLife = totalLife;
		this.currentLife = currentLife;
		this.pmDate = pmDate;
		this.lifeStatus = lifeStatus;
		this.pmStatus = pmStatus;
		this.actionTaken = actionTaken;
		this.remark = remark;
		this.createdBy = createdBy;
		this.status = status;
		this.dateTimeCreation = dateTimeCreation;
		this.dateTimeModified = dateTimeModified;
		this.image = image;
	}

	public PreventiveMaintenanceHistoryMaster() {
		super();
		// TODO Auto-generated constructor stub
	}

}
