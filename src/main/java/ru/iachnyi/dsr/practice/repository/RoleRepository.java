package ru.iachnyi.dsr.practice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import ru.iachnyi.dsr.practice.entity.Role;

public interface RoleRepository extends JpaRepository<Role, Long>{

}
