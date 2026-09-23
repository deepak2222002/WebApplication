package web.minda.project.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import web.minda.project.entity.LoginMaster;
import web.minda.project.repositories.LoginMasterRepository;

@Service
public class CustomeUserDetailService implements UserDetailsService {


    @Autowired
    private LoginMasterRepository loginMasterRepository;


    @Override
    public UserDetails loadUserByUsername(String employeeId)
            throws UsernameNotFoundException {


        LoginMaster loginMaster =
                loginMasterRepository.findByEmployeeIds(employeeId);


        if (loginMaster == null) {
            throw new UsernameNotFoundException("Employee Id not found");
        }


        return new CustomUserDetail(loginMaster);
    }

}

