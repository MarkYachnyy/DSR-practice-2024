DivAllSpendings = $(".div__all__spendings")[0];
SpanLoadingSpendingsMessage = $(".span__spendings__loading__message")[0];
DivOtherSpendingParticipants = $(".div__other__spending__participants")[0];
DivOverlayFriendsList = $(".div__overlay__friends")[0];
InputOverallAmount = $(".input__overall__amount")[0];
ButtonConfirmNewSpending = $(".button__confirm__new__spending")[0];
InputNewSpendingName = $(".input__new__spending__name")[0];
InputNewSpendingDate = $(".input__new__spending__date")[0];
TextNewSpendingCreationStatus = $(".text__spending__creation__status")[0];
SpanMyUserId = $(".span__my__user__id")[0];

var Username = null;
var UserId = null;

function loadAllSpendings() {
    SpanLoadingSpendingsMessage.style.display = "inline";
    $.getJSON("api/spendings/all", null, setSpendingsListHTML)
}

function setSpendingsListHTML(spendings_list) {
    SpanLoadingSpendingsMessage.style.display = "none";
    if (spendings_list.length > 0) {
        let res = "";
        for (let spending of spendings_list) {
            let names = []
            for (let name in spending.debts) {
                names.push(name);
            }
            let names_list_content = "";
            if (names.length > 3) {
                names_list_content += names[0] + ", ";
                names_list_content += names[1];
                names_list_content += ` и ещё ${names.length - 2}`;
            } else {
                for (let i = 0; i < names.length - 1; i++) {
                    names_list_content += names[i] + ", ";
                }
                names_list_content += names[names.length - 1];
            }
            res += `<div style="margin: 5px; padding: 10px; background: #EEEEEE">
                        <h3>Счёт <a href="api/spendings/${spending.id}">${spending.name}</a> от ${spending.date}</h3>
                        <p>${names_list_content}</p>
                        <p>Ваш долг ${spending.debts[Username]} руб</p>
                    </div>`
        }
        DivAllSpendings.innerHTML = res;
    } else {
        DivAllSpendings.innerHTML = "<span style='color: gray;'>Вы не состоите ни в одном счёте</span>"
    }
}

var FriendsNotAddedToSpendingList = [];
var FriendsAddedToSpendingList = [];
var PayerName = Username;

function setOverlayNonAddedFriendListHTML() {
    DivOverlayFriendsList.innerHTML = "";
    for (let name of FriendsNotAddedToSpendingList) {
        let btn = document.createElement("button");
        btn.addEventListener("click", () => {
            FriendsAddedToSpendingList.push(name);
            let index = FriendsNotAddedToSpendingList.indexOf(name);
            FriendsNotAddedToSpendingList.splice(index, 1);
            setOverlayAddedFriendListHTML();
            setOverlayNonAddedFriendListHTML();
        });
        btn.style.width = "40px";
        btn.style.height = "40px";
        btn.innerText = "+";

        let div = document.createElement("div");
        div.style.display = "flex";
        div.style.flexDirection = "row";
        div.style.justifyContent = "space-between";
        div.style.margin = "5px";
        div.style.padding = "10px";
        div.style.background = "#EEEEEE";
        div.append(btn);

        let p = document.createElement("p");
        p.innerText = name;
        div.append(p);
        DivOverlayFriendsList.append(div);
    }
}

function setOverlayAddedFriendListHTML(){
    let equalPart = Math.floor(Number(InputOverallAmount.value) / (FriendsAddedToSpendingList.length + 1));

    DivOtherSpendingParticipants.innerHTML = "";

    let div_us = document.createElement("div");
    div_us.style.display = "flex";
    div_us.style.flexDirection = "row";
    div_us.style.justifyContent = "space-between";
    div_us.style.margin = "5px";
    div_us.style.padding = "10px";
    div_us.style.background = "#EEEEEE";

    let p_us_stub = document.createElement("a");
    p_us_stub.style.width = "40px";
    p_us_stub.style.height = "40px";
    p_us_stub.innerText = "C";
    p_us_stub.style.fontSize = "35px;"
    div_us.append(p_us_stub);

    let p_us = document.createElement("p");
    p_us.innerText = Username;
    p_us.addEventListener("click", () => {
        PayerName = Username;
        setOverlayAddedFriendListHTML();
    });

    div_us.append(p_us);

    let el;
    if(Username === PayerName){
        el = document.createElement("img");
        el.src = "icon/crown.png";
        el.style.width = "40px";
        el.style.height = "40px";
    } else {
        el = document.createElement("p");
        el.innerText = `${equalPart} руб`
    }
    div_us.append(el);

    DivOtherSpendingParticipants.append(div_us)

    for (let name of FriendsAddedToSpendingList) {
        let btn = document.createElement("button");
        btn.addEventListener("click", () => {
            FriendsNotAddedToSpendingList.push(name);
            let index = FriendsAddedToSpendingList.indexOf(name);
            FriendsAddedToSpendingList.splice(index, 1);
            if(PayerName === name){
                PayerName = Username;
            }
            setOverlayAddedFriendListHTML();
            setOverlayNonAddedFriendListHTML();
        });
        btn.style.width = "40px";
        btn.style.height = "40px";
        btn.innerText = "-";

        let div = document.createElement("div");
        div.style.display = "flex";
        div.style.flexDirection = "row";
        div.style.justifyContent = "space-between";
        div.style.margin = "5px";
        div.style.padding = "10px";
        div.style.background = "#EEEEEE";
        div.append(btn);

        let p = document.createElement("p");
        p.innerText = name;
        p.addEventListener("click", () => {
            PayerName = name;
            setOverlayAddedFriendListHTML();
        });
        div.append(p);

        let el;
        if(name === PayerName){
            el = document.createElement("img");
            el.src = "icon/crown.png";
            el.style.width = "40px";
            el.style.height = "40px";
        } else {
            el = document.createElement("p");
            el.innerText = `${equalPart} руб`
        }
        div.append(el);

        DivOtherSpendingParticipants.append(div);
    }
}

$.getJSON("api/auth/user", null, user => {
    $(".span__username")[0].innerText = user.name;
    Username = user.name;
    UserId = user.id;
    loadAllSpendings();
    $(".button__create__new__spending")[0].addEventListener("click", () => {
        $(".overlay__create__new__payment")[0].style.display = "flex";
    });
});

$.getJSON("api/friends/all", null, friends_list => {
    res = "";
    for (let friend of friends_list) {
        FriendsNotAddedToSpendingList.push(friend.name);
    }
    PayerName = Username;
    setOverlayNonAddedFriendListHTML();
    setOverlayAddedFriendListHTML();
});

InputOverallAmount.addEventListener("change", () => {
    if(!isNaN(InputOverallAmount.value)){
        setOverlayAddedFriendListHTML();
    }
});

ButtonConfirmNewSpending.addEventListener("click", () => {
    if(InputNewSpendingName.value.toString().trim() === ""){
        TextNewSpendingCreationStatus.style.color = "red";
        TextNewSpendingCreationStatus.innerText = "Заполните поле ввода названия траты";
        return;
    }
    if(InputNewSpendingDate.value === ""){
        TextNewSpendingCreationStatus.style.color = "red";
        TextNewSpendingCreationStatus.innerText = "Заполните поле ввода даты траты";
        return;
    }
    if(FriendsAddedToSpendingList.length === 0){
        TextNewSpendingCreationStatus.style.color = "red";
        TextNewSpendingCreationStatus.innerText = "Добавьте в счёт хотя бы одного человека";
        return;
    }
    if(isNaN(Number(InputOverallAmount.value)) || Number(InputOverallAmount.value) <= 0){
        TextNewSpendingCreationStatus.style.color = "red";
        TextNewSpendingCreationStatus.innerText = "Введите корректное значение суммы счёта (положительное число)";
        return;
    }
    let res = {};
    res.name = InputNewSpendingName.value;
    res.date = InputNewSpendingDate.value
    res.creatorName = Username;
    res.payerName = PayerName;
    res.debts = {};
    let equalPart = Math.floor(Number(InputOverallAmount.value) / (FriendsAddedToSpendingList.length + 1));

    if(Username === PayerName){
        res.debts[Username]= 0;
    } else {
        res.debts[Username] = equalPart;
    }

    for(let name of FriendsAddedToSpendingList){
        if(name === PayerName){
            res.debts[name] = 0;
        } else {
            res.debts[name] = equalPart;
        }
    }

    $.ajax({
        url:'api/spendings/new',
        method:'post',
        data: JSON.stringify(res),
        contentType : 'application/json',
        success : response => {
            if(response.success == null){
                TextNewSpendingCreationStatus.innerText = response.error;
                TextNewSpendingCreationStatus.style.color = "red";
            } else {
                TextNewSpendingCreationStatus.innerText = response.success;
                TextNewSpendingCreationStatus.style.color = "green";
                location.reload();
            }
        }
    });
});

SpanMyUserId.addEventListener("click", () => {
    if(UserId != null){
        SpanMyUserId.innerText = UserId;
    }
})

