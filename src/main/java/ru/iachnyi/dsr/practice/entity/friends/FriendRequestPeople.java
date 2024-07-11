package ru.iachnyi.dsr.practice.entity.friends;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FriendRequestPeople{
    private Long senderId;
    private Long receiverId;
}