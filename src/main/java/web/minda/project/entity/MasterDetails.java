package web.minda.project.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "master_details")
public class MasterDetails {

	@Id
	@Column(name = "id")
	private int masterId;

	@Column(name = "master_ids")
	private String masterIdS;

	@Column(name = "master_name")
	private String masterName;

	@Column(name = "created_by")
	private String createdBy;

	@Column(name = "date_time")
	private String dateTime;

	@Column(name = "module")
	private String module;

	public int getMasterId() {
		return masterId;
	}

	public void setMasterId(int masterId) {
		this.masterId = masterId;
	}

	public String getMasterIdS() {
		return masterIdS;
	}

	public void setMasterIdS(String masterIdS) {
		this.masterIdS = masterIdS;
	}

	public String getMasterName() {
		return masterName;
	}

	public void setMasterName(String masterName) {
		this.masterName = masterName;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public String getDateTime() {
		return dateTime;
	}

	public void setDateTime(String dateTime) {
		this.dateTime = dateTime;
	}

	public String getModule() {
		return module;
	}

	public void setModule(String module) {
		this.module = module;
	}

	@Override
	public String toString() {
		return "[" + masterId + ", " + masterIdS + ", " + masterName + ", " + createdBy + ", " + dateTime + ", "
				+ module + "]";
	}

	public MasterDetails(int masterId, String masterIdS, String masterName, String createdBy, String dateTime,
			String module) {
		super();
		this.masterId = masterId;
		this.masterIdS = masterIdS;
		this.masterName = masterName;
		this.createdBy = createdBy;
		this.dateTime = dateTime;
		this.module = module;
	}

	public MasterDetails() {
		super();
		// TODO Auto-generated constructor stub
	}

}
