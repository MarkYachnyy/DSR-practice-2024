DivFriends = $(".div__friends")[0];

function getFriendsList(){
    $.getJSON("api/friends/all", null, data => generateFriendsListHTML(data));
}

function generateFriendsListHTML(friends_list){
    res = "";
    for(friend in friends_list){
        res += `<p>${friend.name} | <span style="color:green">в друзьях с ${friend.date}</span></p>`;
    }
    DivFriends.innerHTML += res;
}

$.get("api/auth/name", null, name => {$(".span__username")[0].innerText = name;});
getFriendsList();