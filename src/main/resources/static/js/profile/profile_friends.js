DivFriends = $(".div__in__friends")[0];
DivIncomingRequests = $(".div__incoming__requests")[0];
DivSentRequests = $(".div__sent__requests")[0];
TextNewFriendRequestStatus = $(".text__new__request__status")[0];
ButtonSendNewRequest = $(".button__send__friend__request")[0];
InputNewFriendName = $(".input__add__friend__name")[0];

function getFriendsList() {
    $.getJSON("api/friends/all", null, data => setFriendsListHTML(data));
}

function getIncomingRequsts() {
    $.getJSON("api/friends/all-requests-received", null, data => setIncomingRequestsListHTML(data));
}

function getSentRequsts() {
    $.getJSON("api/friends/all-requests-sent", null, data => setSentRequestsListHTML(data));
}

function setFriendsListHTML(friends_list) {
    if(friends_list.length > 0){
        DivFriends.innerHTML = "";
    } else {
        DivFriends.innerHTML = "<p style='color: gray'>Пользователи в друзьях отсутвствуют</p>";
    }
    for (let friend of friends_list) {
        DivFriends.innerHTML += `<p style="margin: 5px; padding: 10px; background: #EEEEEE">${friend.name} | <span style="color:green">в друзьях с ${friend.date}</span></p>`;
    }
}

function setIncomingRequestsListHTML(request_list) {
    if (request_list.length > 0) {
        DivIncomingRequests.innerHTML = "";
    } else {
        DivIncomingRequests.innerHTML = "<p style='color: gray'>Входящих запросов нет</p>";
    }
    for (let i = 0; i < request_list.length; i++) {
        request = request_list[i];
        DivIncomingRequests.innerHTML += `<div style="display: flex; flex-direction: row; margin: 5px; padding: 10px; background: #EEEEEE">
            <p>${request.name} | <span style="color:purple">хочет добавить вас в друзья с ${request.date}</span></p>
            <button id = "accept__friend__request__btn__${i}">Принять</button>
        </div>`;
    }

    for (let i = 0; i < request_list.length; i++) {
        let button = $(`#accept__friend__request__btn__${i}`)[0];
        button.addEventListener("click", () => {
            $.post(`/api/friends/add-friend/${request_list[i].name}`, null, response => {
                getFriendsList();
                getIncomingRequsts();
            });
        });
    }
}

function setSentRequestsListHTML(request_list) {
    if (request_list.length > 0) {
        DivSentRequests.innerHTML = "";
    } else {
        DivSentRequests.innerHTML = "<p style='color: gray'>Исходящих запросов нет</p>";
    }
    for (let request of request_list) {
        DivSentRequests.innerHTML += `<p style="margin: 5px; padding: 10px; background: #EEEEEE">${request.name} | <span style="color:gray">запрос ожидает ответа с ${request.date}</span></p>`;
    }
}

function sendFriendRequest() {
    user_id = InputNewFriendName.value;
    if (user_id.trim() === "") {
        TextNewFriendRequestStatus.style.color = "red";
        TextNewFriendRequestStatus.innerText = "Поле не должно быть пустым";
    } else {
        TextNewFriendRequestStatus.style.color = "gray";
        TextNewFriendRequestStatus.innerText = "Обрабатываем запрос";
        $.post(`api/friends/send-request/${user_id}`, null, response => {
            processNewFriendServerResponse(response);
            getSentRequsts();
        });
    }

}

function processNewFriendServerResponse(response) {
    if (response.success == null) {
        TextNewFriendRequestStatus.innerText = response.error;
        TextNewFriendRequestStatus.style.color = "red";
    } else {
        TextNewFriendRequestStatus.innerText = response.success;
        TextNewFriendRequestStatus.style.color = "green";
        InputNewFriendName.value = "";
    }
}

getFriendsList();
getIncomingRequsts();
getSentRequsts();
ButtonSendNewRequest.addEventListener("click", sendFriendRequest);