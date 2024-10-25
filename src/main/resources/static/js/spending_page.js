SpanSpendingName = $(".span__spending__name")[0];
SpanSpendingDate = $(".span__spending__date")[0];
SpanSpendingCreatorName = $(".span__spending__creator__name")[0];
SpanSpendingPayerName = $(".span__spending__payer__name")[0];
SpendingId = new URLSearchParams(window.location.search).get("id");
DivSpendingParticipants = $(".div__spending__participants")[0];
OverlayPayDebt = $(".overlay__pay__debt")[0];
ButtonWholeAmount = $(".button__set__whole__debt__amount")[0];
InputPaymentAmount = $(".input__debt__payment__amount")[0];
TextPayDebtStatus = $(".debt__payment__status")[0];
OverlayDeleteSpending = $(".overlay__delete__spending")[0];
User = null;

function loadSpending() {
    $.getJSON(`/api/spendings/${SpendingId}`, null, spending => {
        if (spending.debts[User.name] === 0) {
            $(".button__open__debt__payment__overlay").hide();
        }
        SpanSpendingName.innerText = spending.name;
        SpanSpendingDate.innerText = spending.date;
        SpanSpendingCreatorName.innerText = spending.creatorName;
        SpanSpendingPayerName.innerText = spending.payerName;
        for (let name in spending.debts) {
            if (name === spending.creatorName) {
                let div = document.createElement("div");
                div.style.width = "300px";
                div.style.display = "flex";
                div.style.justifyContent = "space-between";
                div.style.alignItems = "center";
                div.style.padding = "10px";
                div.style.margin = "5px";
                div.style.background = "#EEEEEE";

                let p = document.createElement("p");
                p.innerText = name;
                div.appendChild(p);

                if(name === spending.creatorName){
                    div.appendChild(createWrenchImage());
                }

                if(name === spending.payerName){
                    div.appendChild(createCrownImage());
                }

                DivSpendingParticipants.appendChild(div);
            } else {
                $.get({
                    url: "api/friends/are-friends",
                    data: {
                        name1: spending.creatorName,
                        name2: name
                    },
                    success: response => {
                        if (Boolean(response)) {

                            let div = document.createElement("div");
                            div.style.width = "300px";
                            div.style.display = "flex";
                            div.style.justifyContent = "space-between";
                            div.style.alignItems = "center";
                            div.style.padding = "10px";
                            div.style.margin = "5px";
                            div.style.background = "#EEEEEE";

                            let p = document.createElement("p");
                            p.innerText = name;
                            div.appendChild(p);

                            if(name === spending.creatorName){
                                div.appendChild(createWrenchImage());
                            }

                            if(name === spending.payerName) {
                                div.appendChild(createCrownImage());
                            } else {
                                div.appendChild(document.createTextNode("Долг: " + spending.debts[name] + " ₽"));
                            }

                            DivSpendingParticipants.appendChild(div);
                        } else if(User.name === spending.creatorName){
                            let div = document.createElement("div");
                            div.style.width = "300px";
                            div.style.display = "flex";
                            div.style.justifyContent = "space-between";
                            div.style.alignItems = "center";
                            div.style.padding = "10px";
                            div.style.margin = "5px";
                            div.style.background = "#EEEEEE";

                            let p1 = document.createElement("p");
                            p1.style.color = "gray";
                            p1.innerText = name;
                            div.appendChild(p1);

                            let p2 = document.createElement("p");
                            p2.style.color = "gray";
                            p2.innerText = "Пользователь еще не принял запрос";
                            div.appendChild(p2);

                            DivSpendingParticipants.appendChild(div);
                        } else if(User.name === name){
                            $(".button__open__debt__payment__overlay").hide();

                            let div = document.createElement("div");
                            div.style.width = "300px";
                            div.style.display = "flex";
                            div.style.justifyContent = "space-between";
                            div.style.alignItems = "center";
                            div.style.padding = "10px";
                            div.style.margin = "5px";
                            div.style.background = "#EEEEEE";

                            let p1 = document.createElement("p");
                            p1.style.color = "gray";
                            p1.innerText = name;
                            div.appendChild(p1);

                            let p2 = document.createElement("p");
                            p2.style.color = "gray";
                            p2.innerText = "Вы еще не приняли запрос";
                            div.appendChild(p2);

                            DivSpendingParticipants.appendChild(div);
                        }
                    }
                })
            }
        }
        ButtonWholeAmount.innerText = `Все ${spending.debts[User.name]} ₽`;
        ButtonWholeAmount.addEventListener("click", () => {
            InputPaymentAmount.value = String(spending.debts[User.name]);
        });
        if(User.name === spending.creatorName || User.name === spending.payerName){
            $(".button__delete__spending")[0].style.display = "block";
        } else {
            $(".button__delete__spending")[0].style.display = "none";
        }
        $(".button__confirm__debt__payment")[0].addEventListener("click", () => {
            let val = Number(InputPaymentAmount.value);
            if (InputPaymentAmount.value.trim() === "" || isNaN(val)) {
                TextPayDebtStatus.style.color = "red";
                TextPayDebtStatus.innerText = "Недопустимое значение суммы погашения"
            } else if (val <= 0 || val > spending.debts[User.name]) {
                TextPayDebtStatus.style.color = "red";
                TextPayDebtStatus.innerText = "Введите положительное число,\nне превышающее суммы долга";
            } else {
                sendDebtPaymentRequest(val);
            }
        })
    });
}

$(".button__delete__spending")[0].addEventListener("click", () => {
    OverlayDeleteSpending.style.display = "flex";
});

$(".button__cancel__delete__spending")[0].addEventListener("click", () => {
    OverlayDeleteSpending.style.display = "none";
});

$(".button__confirm__delete__spending")[0].addEventListener("click", () => {
    $.ajax({
        url: `api/spendings/delete/${SpendingId}`,
        method: "delete",
        contentType: "application/json",
        success: response => {
            if (response.success != null) {
                location.reload();
            } else {

            }
        }
    })
})

function createWrenchImage(){
    let img = document.createElement("img");
    img.src = "icon/wrench.png";
    img.alt = "C";
    img.style.width = "40px";
    img.style.height = "40px";
    return img;
}

function createCrownImage(){
    let img = document.createElement("img");
    img.src = "icon/crown.png";
    img.alt = "P";
    img.style.width = "40px";
    img.style.height = "40px";
    return img;
}

$.getJSON("api/user/current", null, user => {
    User = user;
    loadSpending();
});

$(".button__close__pay__debt__overlay")[0].addEventListener("click", () => {
    OverlayPayDebt.style.display = "none";
});

$(".button__open__debt__payment__overlay")[0].addEventListener("click", () => {
    OverlayPayDebt.style.display = "flex";
});

function sendDebtPaymentRequest(amount) {
    $.ajax({
        url: `api/debts/pay?spendingId=${SpendingId}`,
        method: "patch",
        data: String(amount),
        contentType: "application/json",
        success: response => {
            if (response.success != null) {
                TextPayDebtStatus.style.color = "green";
                TextPayDebtStatus.innerText = response.success;
                location.reload();
            } else {
                TextPayDebtStatus.style.color = "red";
                TextPayDebtStatus.innerText = response.error
            }
        }
    })
}







