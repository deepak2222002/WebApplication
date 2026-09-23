package web.minda.project.security;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import web.minda.project.entity.LoginMaster;

public class CustomUserDetail implements UserDetails {

	private static final long serialVersionUID = 1L;
	private LoginMaster loginMaster;

	public CustomUserDetail(LoginMaster loginMaster) {
		super();
		this.loginMaster = loginMaster;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		try {
			String roleName = loginMaster.getDepartment().getDepartmentName();		
			SimpleGrantedAuthority simpleGrantedAuthorityObject = new SimpleGrantedAuthority("ROLE_" + roleName);
			return List.of(simpleGrantedAuthorityObject);
		} catch (Exception e) {
			SimpleGrantedAuthority simpleGrantedAuthorityObject = new SimpleGrantedAuthority("ROLE_NOTFOUND");
			return List.of(simpleGrantedAuthorityObject);
		}	
	}

	@Override
	public String getPassword() {
		// TODO Auto-generated method stub
		return loginMaster.getPassword();
	}

	@Override
	public String getUsername() {
		// TODO Auto-generated method stub
		return loginMaster.getEmployeeId();
	}

	@Override
	public boolean isAccountNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isEnabled() {
		// TODO Auto-generated method stub
		return true;
	}

}
