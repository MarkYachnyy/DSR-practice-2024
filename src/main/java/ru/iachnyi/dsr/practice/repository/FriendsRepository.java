package ru.iachnyi.dsr.practice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ru.iachnyi.dsr.practice.entity.friends.FriendRequest;
import ru.iachnyi.dsr.practice.entity.friends.FriendRequestPeople;
import ru.iachnyi.dsr.practice.entity.friends.FriendRequestStatus;

import java.util.List;

public interface FriendsRepository extends JpaRepository<FriendRequest, FriendRequestPeople> {

    @Query(value = "SELECT * FROM friends WHERE receiver_id = ?1 AND status = ?2", nativeQuery = true)
    List<FriendRequest> findAllRequestsByReceiverId(long receiverId, String status);

    @Query(value = "SELECT * FROM friends WHERE sender_id = ?1 AND status = ?2", nativeQuery = true)
    List<FriendRequest> findAllRequestsBySenderId(long senderId, String status);


}
