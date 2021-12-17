package com.example.restjs.springrestjs.controller;

import com.example.restjs.springrestjs.model.Role;
import com.example.restjs.springrestjs.model.User;
import com.example.restjs.springrestjs.service.RoleService;
import com.example.restjs.springrestjs.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@RestController
@RequestMapping("/rest/user")
public class UserRestController {

    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public UserRestController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping
    public ResponseEntity<User> getCurrentUser(Authentication auth) {
        if (auth.getPrincipal() instanceof User) {
            User user = (User) auth.getPrincipal();
            return new ResponseEntity<>(user, HttpStatus.OK);
        }
        OAuth2User auth2User = ((OAuth2AuthenticationToken) auth).getPrincipal();
        String authEmail = (String) auth2User.getAttributes().get("email");
        User findUser = userService.findByEmail(authEmail);
        if (findUser == null) {
            User newGoogleUser = new User();
            newGoogleUser.setName((String) auth2User.getAttributes().get("name"));
            newGoogleUser.setLastName((String) auth2User.getAttributes().get("family_name"));
            newGoogleUser.setPassword((String) auth2User.getAttributes().get("sub"));
            newGoogleUser.setAge((byte) 20);
            newGoogleUser.setEmail(authEmail);
            Set<Role> role = new HashSet<>();
            role.add(roleService.findRoleById(2L));
            newGoogleUser.setRoles(role);
            userService.saveUser(newGoogleUser);
            return new ResponseEntity<>(newGoogleUser, HttpStatus.OK);
        }
        return new ResponseEntity<>(findUser, HttpStatus.OK);
    }

}
//   System.out.println(AuthorityUtils.authorityListToSet(auth.getAuthorities()));
//        System.out.printf(String.valueOf(user.getAuthorities().stream().filter(data -> Objects.equals(data, "ROLE_USER")).findFirst().get()));