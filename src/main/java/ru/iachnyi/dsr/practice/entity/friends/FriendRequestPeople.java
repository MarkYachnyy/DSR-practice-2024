package ru.iachnyi.dsr.practice.entity.friends;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class FriendRequestPeople{
    private Long senderId;
    private Long receiverId;
}