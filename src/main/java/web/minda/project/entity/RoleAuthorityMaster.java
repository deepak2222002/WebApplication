package web.minda.project.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

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
//@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "groupId")
@Table(name = "role_authority_master")
public class RoleAuthorityMaster {

	@Id
//	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long roleAuthorityId;

	@Column(name = "master_name")
	private String masterName;

	@Column(name = "status")
	private String status;

	@Column(name = "created_by")
	private String createdBy;

	@Column(name = "date_time_creation")
	private String dateTimeCreation;

	@Column(name = "date_time_modified")
	private String dateTimeModified;

	@Column(name = "is_deleted", nullable = false)
	private Boolean isDelete = false;

	@ManyToOne
	@JoinColumn(name = "role_id")
//	@JsonIgnoreProperties("roleAuthorityList")
	private RoleMaster role;

	@ManyToOne
	@JoinColumn(name = "department_id")
//	@JsonIgnoreProperties("roleAuthorityList")
	private DepartmentMaster department;

	public Long getRoleAuthorityId() {
		return roleAuthorityId;
	}

	public void setRoleAuthorityId(Long roleAuthorityId) {
		this.roleAuthorityId = roleAuthorityId;
	}

	public String getMasterName() {
		return masterName;
	}

	public void setMasterName(String masterName) {
		this.masterName = masterName;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
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

	public Boolean getIsDelete() {
		return isDelete;
	}

	public void setIsDelete(Boolean isDelete) {
		this.isDelete = isDelete;
	}

	public RoleMaster getRole() {
		return role;
	}

	public void setRole(RoleMaster role) {
		this.role = role;
	}

	public DepartmentMaster getDepartment() {
		return department;
	}

	public void setDepartment(DepartmentMaster department) {
		this.department = department;
	}

	public RoleAuthorityMaster(Long roleAuthorityId, String masterName, String status, String createdBy,
			String dateTimeCreation, String dateTimeModified, Boolean isDelete, RoleMaster role,
			DepartmentMaster department) {
		super();
		this.roleAuthorityId = roleAuthorityId;
		this.masterName = masterName;
		this.status = status;
		this.createdBy = createdBy;
		this.dateTimeCreation = dateTimeCreation;
		this.dateTimeModified = dateTimeModified;
		this.isDelete = isDelete;
		this.role = role;
		this.department = department;
	}

	public RoleAuthorityMaster() {
		super();
		// TODO Auto-generated constructor stub
	}

}
