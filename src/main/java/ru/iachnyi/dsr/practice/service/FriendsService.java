package ru.iachnyi.dsr.practice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.iachnyi.dsr.practice.entity.User;
import ru.iachnyi.dsr.practice.entity.friends.FriendRequest;
import ru.iachnyi.dsr.practice.entity.friends.FriendRequestStatus;
import ru.iachnyi.dsr.practice.repository.FriendsRepository;
import ru.iachnyi.dsr.practice.repository.UserRepository;
import ru.iachnyi.dsr.practice.response_classes.NameAndDateFriendRelation;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class FriendsService {

    @Autowired
    private FriendsRepository friendsRepository;

    @Autowired
    private UserRepository userRepository;

    public List<NameAndDateFriendRelation> findAllRequestsSentByUser(Long userId) {
        return friendsRepository.findAllRequestsBySenderId(userId, FriendRequestStatus.SENT.name())
                .stream().map(req -> new NameAndDateFriendRelation(userRepository.findById(req.getPeople().getReceiverId()).get().getName(), req.getDate().toString()))
                .collect(Collectors.toList());
    }

    public List<NameAndDateFriendRelation> findAllRequestsReceivedByUser(Long userId) {
        return friendsRepository.findAllRequestsBySenderId(userId, FriendRequestStatus.SENT.name())
                .stream().map(req -> new NameAndDateFriendRelation(userRepository.findById(req.getPeople().getSenderId()).get().getName(), req.getDate().toString()))
                .collect(Collectors.toList());
    }

    public List<NameAndDateFriendRelation> findAllFriends(Long userId) {
        Set<NameAndDateFriendRelation> received = friendsRepository.findAllRequestsByReceiverId(userId, FriendRequestStatus.ACCEPTED.name())
                .stream().map(req -> new NameAndDateFriendRelation(userRepository.findById(req.getPeople().getSenderId()).
                        orElse(new User()).getName(), req.getDate().toString()))
                .collect(Collectors.toSet());
        Set<NameAndDateFriendRelation> sent = friendsRepository.findAllRequestsBySenderId(userId, FriendRequestStatus.ACCEPTED.name())
                .stream().map(req -> new NameAndDateFriendRelation(userRepository.findById(req.getPeople().getReceiverId()).
                        orElse(new User()).getName(), req.getDate().toString()))
                .collect(Collectors.toSet());
        received.addAll(sent);
        return new ArrayList<>(received);
    }
}
