package com.example.restjs.springrestjs.controller;

import com.example.restjs.springrestjs.model.User;
import com.example.restjs.springrestjs.service.RoleService;
import com.example.restjs.springrestjs.service.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class AdminController {

    private final UserService userService;
    private final RoleService roleService;

    public AdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping("/admin")
    public String findAll(@AuthenticationPrincipal User user, Model model){
        List<User> users = userService.getAllUser();
        model.addAttribute("allUsers", users);
        model.addAttribute("allRoles", roleService.allRoles());
        model.addAttribute("user", user);
        return "admin";
    }

    @GetMapping("/user")
    public String userInfo(@AuthenticationPrincipal User user, Model model) {
        model.addAttribute("user", user);
        model.addAttribute("roles", user.getRoles());
        return "user";
    }
}
