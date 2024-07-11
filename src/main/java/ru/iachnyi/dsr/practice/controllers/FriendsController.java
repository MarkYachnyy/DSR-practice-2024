package ru.iachnyi.dsr.practice.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.iachnyi.dsr.practice.entity.User;
import ru.iachnyi.dsr.practice.entity.friends.FriendRequest;
import ru.iachnyi.dsr.practice.entity.friends.FriendRequestStatus;
import ru.iachnyi.dsr.practice.repository.UserRepository;
import ru.iachnyi.dsr.practice.response_classes.NameAndDateFriendRelation;
import ru.iachnyi.dsr.practice.response_classes.SimpleSuccessOrErrorResponse;
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
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/api/friends/all")
    public List<NameAndDateFriendRelation> getAllFriends() {
        List<NameAndDateFriendRelation> res = friendsService.findAllFriends(securityUtils.getCurrentUserId());
        return res;
    }

    @GetMapping("/api/friends/all-requests-received")
    public List<NameAndDateFriendRelation> getRequestsReceived() {
        List<NameAndDateFriendRelation> res = friendsService.findAllRequestsReceivedByUser(securityUtils.getCurrentUserId());
        log.info("res length: {}", res.size());
        return res;
    }

    @GetMapping("/api/friends/all-requests-sent")
    public List<NameAndDateFriendRelation> getRequestsSent() {
        return friendsService.findAllRequestsSentByUser(securityUtils.getCurrentUserId());
    }

    @PostMapping("/api/friends/send-request/{id}")
    public SimpleSuccessOrErrorResponse sendRequest(@PathVariable long id) {
        SimpleSuccessOrErrorResponse res = new SimpleSuccessOrErrorResponse();
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            res.setError("Пользователя с таким id не существует");
        } else if (securityUtils.getCurrentUserId() == id) {
            res.setError("Это ваш id!");
        } else {
            long currId = securityUtils.getCurrentUserId();
            List<FriendRequest> requestsSent = friendsService.findAllRequestsBySenderIdAndReceiverId(currId, id);
            if (!requestsSent.isEmpty()) {
                FriendRequest request = requestsSent.getFirst();
                res.setError(request.getStatus() == FriendRequestStatus.ACCEPTED ? "Данный пользватель уже у вас в друзьях" : "Вы уже отправили запрос данному пользователю");
            } else {
                List<FriendRequest> requestsReceived = friendsService.findAllRequestsBySenderIdAndReceiverId(id, currId);
                if (!requestsReceived.isEmpty()) {
                    FriendRequest request = requestsReceived.getFirst();
                    res.setError(request.getStatus() == FriendRequestStatus.ACCEPTED ? "Данный пользватель уже у вас в друзьях" : "У вас уже есть входящий запрос от данного пользователя, примите его");
                } else {
                    friendsService.sendFriendRequest(currId, id);
                    res.setSuccess("Запрос успешно отправлен");
                }
            }

        }
        return res;
    }

    @PostMapping("/api/friends/add-friend/{name}")
    public void addFriend(@PathVariable String name) {
        Long firstId = securityUtils.getCurrentUserId();
        Long secondId = userRepository.findByName(name).orElseThrow(() -> new UsernameNotFoundException("kys now")).getId();
        friendsService.addFriend(firstId, secondId);
    }
}
