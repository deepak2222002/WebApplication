package web.minda.project.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="shift_master")
public class ShiftMaster {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id")
	private Long shiftId;
	
	@Column(name="shift_name")
	private String shiftName;
	
	@Column(name="description")
	private String description;
	
	@Column(name="shift_start")
	private String shiftStart;
	
	@Column(name="shift_end")
	private String shiftEnd;
	
	@Column(name = "created_by")
	private String createdBy;

	@Column(name = "status")
	private String status;
	
	@Column(name = "date_time_creation")
	private String dateTimeCreation;

	@Column(name = "date_time_modified")
	private String dateTimeModified;

	public Long getShiftId() {
		return shiftId;
	}

	public void setShiftId(Long shiftId) {
		this.shiftId = shiftId;
	}

	public String getShiftName() {
		return shiftName;
	}

	public void setShiftName(String shiftName) {
		this.shiftName = shiftName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getShiftStart() {
		return shiftStart;
	}

	public void setShiftStart(String shiftStart) {
		this.shiftStart = shiftStart;
	}

	public String getShiftEnd() {
		return shiftEnd;
	}

	public void setShiftEnd(String shiftEnd) {
		this.shiftEnd = shiftEnd;
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

	public ShiftMaster(Long shiftId, String shiftName, String description, String shiftStart, String shiftEnd,
			String createdBy, String status, String dateTimeCreation, String dateTimeModified) {
		super();
		this.shiftId = shiftId;
		this.shiftName = shiftName;
		this.description = description;
		this.shiftStart = shiftStart;
		this.shiftEnd = shiftEnd;
		this.createdBy = createdBy;
		this.status = status;
		this.dateTimeCreation = dateTimeCreation;
		this.dateTimeModified = dateTimeModified;
	}

	@Override
	public String toString() {
		return "ShiftMaster [shiftId=" + shiftId + ", shiftName=" + shiftName + ", description=" + description
				+ ", shiftStart=" + shiftStart + ", shiftEnd=" + shiftEnd + ", createdBy=" + createdBy + ", status="
				+ status + ", dateTimeCreation=" + dateTimeCreation + ", dateTimeModified=" + dateTimeModified + "]";
	}

	public ShiftMaster() {
		super();
		// TODO Auto-generated constructor stub
	}
	

	
	

}
