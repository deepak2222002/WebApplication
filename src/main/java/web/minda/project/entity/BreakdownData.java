package web.minda.project.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "breakdown_data")
public class BreakdownData {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long breakdownDataId;

	@Column(name = "machine_name")
	private String machineName;

	@Column(name = "location")
	private String location;

	@Column(name = "breakdown_category")
	private int breakdownCategory;

	@Column(name = "sub_breakdown_category")
	private int subBreakdownCategory;

	@Column(name = "start_date")
	private String startDate;

	@Column(name = "end_date")
	private String endDate;

	@Column(name = "total_breakdown")
	private int totalBreakdown;

	@Column(name = "status")
	private String status;

	@Column(name = "remarks")
	private String remarks;

	@Column(name = "reason")
	private String reason;

	@Column(name = "attended_by")
	private String attendedBy;

	public Long getBreakdownDataId() {
		return breakdownDataId;
	}

	public void setBreakdownDataId(Long breakdownDataId) {
		this.breakdownDataId = breakdownDataId;
	}

	public String getMachineName() {
		return machineName;
	}

	public void setMachineName(String machineName) {
		this.machineName = machineName;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public int getBreakdownCategory() {
		return breakdownCategory;
	}

	public void setBreakdownCategory(int breakdownCategory) {
		this.breakdownCategory = breakdownCategory;
	}

	public int getSubBreakdownCategory() {
		return subBreakdownCategory;
	}

	public void setSubBreakdownCategory(int subBreakdownCategory) {
		this.subBreakdownCategory = subBreakdownCategory;
	}

	public String getStartDate() {
		return startDate;
	}

	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

	public String getEndDate() {
		return endDate;
	}

	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}

	public int getTotalBreakdown() {
		return totalBreakdown;
	}

	public void setTotalBreakdown(int totalBreakdown) {
		this.totalBreakdown = totalBreakdown;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public String getAttendedBy() {
		return attendedBy;
	}

	public void setAttendedBy(String attendedBy) {
		this.attendedBy = attendedBy;
	}

	public BreakdownData(Long breakdownDataId, String machineName, String location, int breakdownCategory,
			int subBreakdownCategory, String startDate, String endDate, int totalBreakdown, String status,
			String remarks, String reason, String attendedBy) {
		super();
		this.breakdownDataId = breakdownDataId;
		this.machineName = machineName;
		this.location = location;
		this.breakdownCategory = breakdownCategory;
		this.subBreakdownCategory = subBreakdownCategory;
		this.startDate = startDate;
		this.endDate = endDate;
		this.totalBreakdown = totalBreakdown;
		this.status = status;
		this.remarks = remarks;
		this.reason = reason;
		this.attendedBy = attendedBy;
	}

	public BreakdownData() {
		super();
		// TODO Auto-generated constructor stub
	}

}
