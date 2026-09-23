package web.minda.project.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "breakdown_master")
public class BreakdownMaster {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long breakdownId;

	@Column(name = "breakdown_category")
	private String breakdownCategory;

	@Column(name = "created_by")
	private String createdBy;

	@Column(name = "date_time")
	private String dateTime;

	@Column(name = "status")
	private String status;

	public Long getBreakdownId() {
		return breakdownId;
	}

	public void setBreakdownId(Long breakdownId) {
		this.breakdownId = breakdownId;
	}

	public String getBreakdownCategory() {
		return breakdownCategory;
	}

	public void setBreakdownCategory(String breakdownCategory) {
		this.breakdownCategory = breakdownCategory;
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

	@Override
	public String toString() {
		return "BreakdownMaster [breakdownId=" + breakdownId + ", breakdownCategory=" + breakdownCategory
				+ ", createdBy=" + createdBy + ", dateTime=" + dateTime + "]";
	}

	public BreakdownMaster(Long breakdownId, String breakdownCategory, String createdBy, String dateTime) {
		super();
		this.breakdownId = breakdownId;
		this.breakdownCategory = breakdownCategory;
		this.createdBy = createdBy;
		this.dateTime = dateTime;
	}

	public BreakdownMaster() {
		super();
		// TODO Auto-generated constructor stub
	}

}
