package ru.iachnyi.dsr.practice.entity;

import java.util.Set;

import org.springframework.security.core.GrantedAuthority;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.Data;

@Entity
@Data
@Table(name = "roles")
public class Role implements GrantedAuthority{
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	
	@Column(unique = true)
	private String name;
	
	@Transient
	@ManyToMany(mappedBy = "roles")
	private Set<User> users;
	
	public Role() {
		
	}
	
	public Role(Long id, String name) {
		super();
		this.id = id;
		this.name = name;
	}

	@Override
	public String getAuthority() {
		return name;
	}
}
