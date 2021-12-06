package com.example.restjs.springrestjs.service;

import com.example.restjs.springrestjs.model.User;

import java.util.List;

public interface UserService {

    List<User> getAllUser();

    User getById(Long id);

    void saveUser(User user);

    void deleteById(Long id);

    void update(User user);

    User findByEmail (String email);

}
