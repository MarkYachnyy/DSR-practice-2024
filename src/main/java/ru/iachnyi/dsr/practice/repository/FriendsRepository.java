package ru.iachnyi.dsr.practice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.iachnyi.dsr.practice.entity.friends.FriendRequest;
import ru.iachnyi.dsr.practice.entity.friends.FriendRequestPeople;

public interface FriendsRepository extends JpaRepository<FriendRequest, FriendRequestPeople> {

}
