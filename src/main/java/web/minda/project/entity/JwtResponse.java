package web.minda.project.entity;

public class JwtResponse {

	private String jwtToken;

	private String username;

	private String role;

	private String department;

	private String name;

	public String getJwtToken() {
		return jwtToken;
	}

	public void setJwtToken(String jwtToken) {
		this.jwtToken = jwtToken;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Override
	public String toString() {
		return "JwtResponse [jwtToken=" + jwtToken + ", username=" + username + ", role= " + role + ", department= "
				+ department + ", name= " + name + "]";
	}

	public JwtResponse(String jwtToken, String username, String role, String department, String name) {
		super();
		this.jwtToken = jwtToken;
		this.username = username;
		this.role = role;
		this.department = department;
		this.name = name;

	}

	public JwtResponse() {
		super();
		// TODO Auto-generated constructor stub
	}

	public static class Builder {

		private String jwtToken;
		private String username;
		private String role;
		private String department;
		private String name;

		public Builder JwtToken(String jwtToken) {
			this.jwtToken = jwtToken;
			return this;
		}

		public Builder Username(String username) {
			this.username = username;
			return this;
		}

		public Builder Role(String role) {
			this.role = role;
			return this;
		}

		public Builder Department(String department) {
			this.department = department;
			return this;
		}

		public Builder Name(String name) {
			this.name = name;
			return this;
		}

		public JwtResponse build() {
			return new JwtResponse(jwtToken, username, role, department, name);
		}
	}

	public static Builder builder() {
		return new Builder();
	}

}
