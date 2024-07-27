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
User = null;

function loadSpending(){
    $.getJSON(`/api/spendings/${SpendingId}` , null, spending => {
        if(spending.debts[User.name] === 0){
            $(".button__open__debt__payment__overlay").hide();
        }
        SpanSpendingName.innerText = spending.name;
        SpanSpendingDate.innerText = spending.date;
        SpanSpendingCreatorName.innerText = spending.creatorName;
        SpanSpendingPayerName.innerText = spending.payerName;
        for(let name in spending.debts){
            if(name === spending.creatorName){
                DivSpendingParticipants.innerHTML +=
                    `<div style="width:300px; display: flex; justify-content: space-between; align-items: center; padding: 10px; margin: 5px; background: #EEEEEE">
                    <p>${name}</p>
                    ${name === spending.creatorName ? "<img src='icon/wrench.png' alt='C' style='width: 40px; height: 40px;'>" : ""}
                    ${name === spending.payerName ? "<img src='icon/crown.png' alt='P' style='width: 40px; height: 40px;'>" : "Долг: " + spending.debts[name] + " ₽"}
                </div>`
            } else {
                $.get({
                    url:"api/friends/are-friends",
                    data: {
                        name1: spending.creatorName,
                        name2: name
                    },
                    success: response => {
                        if(Boolean(response)){
                            DivSpendingParticipants.innerHTML +=
                                `<div style="width:300px; display: flex; justify-content: space-between; align-items: center; padding: 10px; margin: 5px; background: #EEEEEE">
                    <p>${name}</p>
                    ${name === spending.creatorName ? "<img src='icon/wrench.png' alt='C' style='width: 40px; height: 40px;'>" : ""}
                    ${name === spending.payerName ? "<img src='icon/crown.png' alt='P' style='width: 40px; height: 40px;'>" : "Долг: " + spending.debts[name] + " ₽"}
                </div>`
                        }
                    }
                })
            }
        }
        ButtonWholeAmount.innerText = `Все ${spending.debts[User.name]} ₽`;
        ButtonWholeAmount.addEventListener("click", () => {
            InputPaymentAmount.value = String(spending.debts[User.name]);
        });
        $(".button__confirm__debt__payment")[0].addEventListener("click", () => {
            let val = Number(InputPaymentAmount.value);
            if(InputPaymentAmount.value.trim() === "" || isNaN(val)){
                TextPayDebtStatus.style.color = "red";
                TextPayDebtStatus.innerText = "Недопустимое значение суммы погашения"
            } else if(val <= 0 || val > spending.debts[User.name]){
                TextPayDebtStatus.style.color = "red";
                TextPayDebtStatus.innerText = "Введите положительное число,\nне превышающее суммы долга";
            } else {
                sendDebtPaymentRequest(val);
            }
        })
    });
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

function sendDebtPaymentRequest(amount){
    $.ajax({
        url: `api/debts/pay?spendingId=${SpendingId}`,
        method: "patch",
        data: String(amount),
        contentType: "application/json",
        success: response => {
            if(response.success != null){
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







