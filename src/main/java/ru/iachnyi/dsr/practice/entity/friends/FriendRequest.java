package ru.iachnyi.dsr.practice.entity.friends;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Date;

@Entity
@Table(name="friends")
@Data
public class FriendRequest {
    @EmbeddedId
    private FriendRequestPeople people;
    private FriendRequestStatus status;
    private Date date;
}
