DivFriends = $(".div__in__friends")[0];
DivIncomingRequests = $(".div__incoming__requests")[0];
DivSentRequests = $(".div__sent__requests")[0];
TextNewFriendRequestStatus = $(".text__new__request__status")[0];
ButtonSendNewRequest = $(".button__send__friend__request")[0];
InputNewFriendId = $(".input__add__friend__id")[0];

//TODO: добавить сообщения о загрузке
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
    let res = "";
    for (let friend of friends_list) {
        res += `<p style="margin: 5px; padding: 10px; background: #EEEEEE">${friend.name} | <span style="color:green">в друзьях с ${friend.date}</span></p>`;
    }
    DivFriends.innerHTML = res;
}

function setIncomingRequestsListHTML(request_list) {
    let res = "";
    if (request_list.length > 0) {
        DivIncomingRequests.innerHTML = "";
    }
    for (let i = 0; i < request_list.length; i++) {
        request = request_list[i];
        res += `<div style="display: flex; flex-direction: row; margin: 5px; padding: 10px; background: #EEEEEE">
            <p>${request.name} | <span style="color:purple">хочет добавить вас в друзья с ${request.date}</span></p>
            <button id = "accept__friend__request__btn__${i}">Принять</button>
        </div>`;
    }
    DivIncomingRequests.innerHTML = res;

    for (let i = 0; i < request_list.length; i++) {
        let button = $(`#accept__friend__request__btn__${i}`)[0];
        button.addEventListener("click", () => {
            $.post(`/api/friends/add-friend/${request_list[i].name}`, null, () => {
                getFriendsList();
                getIncomingRequsts();
            });
        });
    }
}

function setSentRequestsListHTML(request_list) {
    let res = "";
    if (request_list.length > 0) {
        DivSentRequests.innerHTML = "";
    }
    for (let request of request_list) {
        res += `<p style="margin: 5px; padding: 10px; background: #EEEEEE">${request.name} | <span style="color:gray">запрос ожидает ответа с ${request.date}</span></p>`;
    }
    DivSentRequests.innerHTML = res;
}

function sendFriendRequest() {
    user_id = Number(InputNewFriendId.value);
    if (isNaN(user_id) || user_id % 1 !== 0 || user_id <= 0) {
        TextNewFriendRequestStatus.style.color = "red";
        TextNewFriendRequestStatus.innerText = "Id должен быть целым положительным числом";
    } else {
        TextNewFriendRequestStatus.style.color = "gray";
        TextNewFriendRequestStatus.innerText = "Обрабатываем запрос";
        $.post(`api/friends/send-request/${user_id}`, null, response => {
            processServerResponse(response);
            getSentRequsts();
        });
    }

}

function processServerResponse(response) {
    if (response.success == null) {
        TextNewFriendRequestStatus.innerText = response.error;
        TextNewFriendRequestStatus.style.color = "red";
    } else {
        TextNewFriendRequestStatus.innerText = response.success;
        TextNewFriendRequestStatus.style.color = "green";
        InputNewFriendId.value = "";
    }
}

getFriendsList();
getIncomingRequsts();
getSentRequsts();
ButtonSendNewRequest.addEventListener("click", sendFriendRequest);