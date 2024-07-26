DivAllSpendings = $(".div__all__spendings")[0];
SpanLoadingSpendingsMessage = $(".span__spendings__loading__message")[0];
DivAllDebts = $(".div__all__debts")[0];
SpanTotalDebtAmount = $(".span__total__debt__amount")[0];
CheckBoxHideZeroDebtSpendings = $("#input-check-hide-zero-debt-spendings")[0];

var Username = null;
var UserId = null;
var SpendingList = null;

var CurrentComparator = null;
var ComparatorMap = new Map();
ComparatorMap.set($("#input-sort-criteria-debt-ascend")[0].value, debtComparator);
ComparatorMap.set($("#input-sort-criteria-debt-descend")[0].value, (s1, s2) => -debtComparator(s1, s2));
ComparatorMap.set($("#input-sort-criteria-date-descend")[0].value, dateComparator);
ComparatorMap.set($("#input-sort-criteria-date-ascend")[0].value, (s1, s2) => -dateComparator(s1, s2));
document.querySelectorAll(".input__radio__sort__criteria").forEach(input => {
    input.addEventListener("click", () => {
        CurrentComparator = ComparatorMap.get(input.value);
        if(SpendingList != null){
            SpendingList.sort(CurrentComparator);
            setSpendingsListHTML(SpendingList);
        }
    });
});
$("#input-sort-criteria-date-descend")[0].click();

CheckBoxHideZeroDebtSpendings.addEventListener("click", () => setSpendingsListHTML(SpendingList));

function dateComparator(spending1, spending2){
    if(spending1.date < spending2.date){
        return -1;
    } else if (spending1.date > spending2.date){
        return 1;
    }
    return 0;
}

function debtComparator(spending1, spending2){
    if(spending1.debts[Username] < spending2.debts[Username]){
        return -1;
    } else if (spending1.debts[Username] > spending2.debts[Username]){
        return 1;
    }
    return 0;
}

function loadAllSpendings() {
    SpanLoadingSpendingsMessage.style.display = "inline";
    $.getJSON("api/spendings/all", null, spendingList => {
        SpendingList = spendingList;
        $("#input-sort-criteria-date-descend")[0].click();
    });
}

function setSpendingsListHTML(spendings_list) {
    spendings_list.sort()
    SpanLoadingSpendingsMessage.style.display = "none";
    if (spendings_list.length > 0) {
        let res = "";
        for (let spending of spendings_list) {
            if(CheckBoxHideZeroDebtSpendings.checked && spending.debts[Username] === 0) continue;
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
                        <h3>Счёт <a href="/spending?id=${spending.id}">${spending.name}</a> от ${spending.date}</h3>
                        <p>${names_list_content}</p>
                        <p>${spending.payerName === Username ? "Вы оплатили этот счёт" : "Ваш долг " + spending.debts[Username] + " ₽"}</p>
                    </div>`
        }
        DivAllSpendings.innerHTML = res;
    } else {
        DivAllSpendings.innerHTML = "<span style='color: gray;'>Вы не состоите ни в одном счёте</span>"
    }
    setDebtListHTML(getDebtMap(spendings_list));
}

function checkCurrentDistributionMethod(){
    if(CurrentMethodValue === RadioButtonEqualParts.value){
        $(".text__equal__part").show();
        $(".input__person__explicit__amount").hide();
        $(".div__overall__amount").show();
    } else {
        $(".text__equal__part").hide();
        $(".input__person__explicit__amount").show();
        $(".div__overall__amount").hide();
    }
}

var CurrentMethodValue = null;

document.querySelectorAll(".radio__btn__distribution__method").forEach(btn => {
    btn.addEventListener("click", () => {
        CurrentMethodValue = btn.value;
        checkCurrentDistributionMethod();
    });
});

$.getJSON("api/user/current", null, user => {
    $(".span__username")[0].innerText = user.name;
    Username = user.name;
    UserId = user.id;
    loadAllSpendings();
});

function getDebtMap(spending_list){
    let res = {}
    for(let spending of spending_list){
        if(res[spending.payerName] === undefined && spending.debts[Username] > 0){
            res[spending.payerName] = {}
        }
        if(spending.debts[Username] > 0){
            res[spending.payerName][spending.id] = {name: spending.name, amount: spending.debts[Username]};
        }
    }
    return res;
}

function setDebtListHTML(debtMap){
    let totalAmount = 0;
    DivAllDebts.innerHTML = Object.keys(debtMap).length > 0 ? "" : "<p style='color: gray'>Долгов перед пользователями нет</p>";
    for(let personName of Object.keys(debtMap)){
        let personAmount = 0;
        let personDiv = document.createElement("div");
        personDiv.style.background = "#EEEEEE";
        personDiv.style.margin = "5px";
        personDiv.style.padding = "10px";
        let personDivHeader = document.createElement("h3");
        let expandSpendingsList = document.createElement("button");
        expandSpendingsList.style.color = "blue";
        expandSpendingsList.innerText = "▶Счета";
        let spendingListDiv = document.createElement("div");
        spendingListDiv.style.display = "none";
        for(let spendingId of Object.keys(debtMap[personName])){
            let amount = debtMap[personName][spendingId]['amount'];
            let spendingName = debtMap[personName][spendingId]['name'];
            spendingListDiv.innerHTML += `<p>Счёт <a href="/spending?id=${spendingId}">${spendingName}</a>: долг ${amount}₽</p>`;
            totalAmount += amount;
            personAmount += amount;
        }
        expandSpendingsList.addEventListener('click', () => {
            if(spendingListDiv.style.display === 'none'){
                spendingListDiv.style.display = 'block';
                expandSpendingsList.innerText = "▼Счета";
            } else {
                spendingListDiv.style.display = 'none';
                expandSpendingsList.innerText = "▶Счета";
            }
        });
        personDivHeader.innerText = `Долг перед ${personName}: ${personAmount}₽`
        personDiv.append(personDivHeader);
        personDiv.append(expandSpendingsList);
        personDiv.append(spendingListDiv);
        DivAllDebts.append(personDiv);
        SpanTotalDebtAmount.innerText = totalAmount;
    }
}
