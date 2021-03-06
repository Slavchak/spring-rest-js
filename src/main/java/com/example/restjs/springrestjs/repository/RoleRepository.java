package com.example.restjs.springrestjs.repository;

import com.example.restjs.springrestjs.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role,Long> {

    Role findRoleByName (String name);

    Role findRoleById (Long id);
}
