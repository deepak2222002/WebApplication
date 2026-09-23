package web.minda.project.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "sub_breakdown_master")
public class SubBreakdownMaster {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long subBreakdownId;

	@Column(name = "sub_breakdown")
	private String subBreakdown;

	@Column(name = "location")
	private String location;

	@Column(name = "created_by")
	private String createdBy;

	@Column(name = "date_time")
	private String dateTime;

	@Column(name = "status")
	private String status;

	@Column(name = "description")
	private String description;

	@ManyToOne
	private BreakdownMaster breakdown;

	public Long getSubBreakdownId() {
		return subBreakdownId;
	}

	public void setSubBreakdownId(Long subBreakdownId) {
		this.subBreakdownId = subBreakdownId;
	}

	public String getSubBreakdown() {
		return subBreakdown;
	}

	public void setSubBreakdown(String subBreakdown) {
		this.subBreakdown = subBreakdown;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
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

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public BreakdownMaster getBreakdown() {
		return breakdown;
	}

	public void setBreakdown(BreakdownMaster breakdown) {
		this.breakdown = breakdown;
	}

	public SubBreakdownMaster(Long subBreakdownId, String subBreakdown, String location, String createdBy,
			String dateTime, String status, String description, BreakdownMaster breakdown) {
		super();
		this.subBreakdownId = subBreakdownId;
		this.subBreakdown = subBreakdown;
		this.location = location;
		this.createdBy = createdBy;
		this.dateTime = dateTime;
		this.status = status;
		this.description = description;
		this.breakdown = breakdown;
	}

	public SubBreakdownMaster() {
		super();
		// TODO Auto-generated constructor stub
	}

	@Override
	public String toString() {
		return "[" + subBreakdown + ", " + location + ", " + description + ", " + breakdown.getBreakdownCategory()
				+ "]";
	}

	public String toStringWithoutBreakdown() {
		return "[" + subBreakdown + ", " + location + ", " + description + ", " + breakdown + "]";
	}

}
