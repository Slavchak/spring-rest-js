package com.example.restjs.springrestjs.service;

import com.example.restjs.springrestjs.model.Role;

import java.util.List;

public interface RoleService {

    List<Role> allRoles();

    Role findRoleByName(String name);

    Role findRoleById (Long id);
}

