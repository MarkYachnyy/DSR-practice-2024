package ru.iachnyi.dsr.practice.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.iachnyi.dsr.practice.entity.friends.FriendRequest;
import ru.iachnyi.dsr.practice.response_classes.NameAndDateFriendRelation;
import ru.iachnyi.dsr.practice.security.SecurityUtils;
import ru.iachnyi.dsr.practice.service.FriendsService;

import java.util.List;

@RestController
public class FriendsController {
    private static final Logger log = LoggerFactory.getLogger(FriendsController.class);
    @Autowired
    private FriendsService friendsService;
    @Autowired
    private SecurityUtils securityUtils;

    @GetMapping("/api/friends/all")
    public List<NameAndDateFriendRelation> getAllFriendsNames() {
        List<NameAndDateFriendRelation> res = friendsService.findAllFriends(securityUtils.getCurrentUserId());
        log.info("res length: {}", res.size());
        return res;
    }

    @GetMapping("/api/friends/requests-received")
    public List<NameAndDateFriendRelation> getRequestsReceived() {
        return friendsService.findAllRequestsReceivedByUser(securityUtils.getCurrentUserId());
    }

    @GetMapping("/api/friends/requests-sent")
    public List<NameAndDateFriendRelation> getRequestsSent() {
        return friendsService.findAllRequestsSentByUser(securityUtils.getCurrentUserId());
    }
}
