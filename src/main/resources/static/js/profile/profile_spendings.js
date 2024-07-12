DivAllSpendings = $(".div__all__spendings")[0];
SpanLoadingSpendingsMessage = $(".span__spendings__loading__message")[0];

function loadAllSpendings(){
    SpanLoadingSpendingsMessage.style.display = "inline";
    $.getJSON("api/spendings/all", null, setSpendingsListHTML)
}

function setSpendingsListHTML(spendings_list){
    SpanLoadingSpendingsMessage.style.display = "none";
    if(spendings_list.length > 0){
        let res = "";
        for(let spending of spendings_list){
            let sum = 0;
            for(let amount of Object.values(spending.debts)){
                sum += amount;
            }
            let names = []
            for(let name in spending.debts){
                names.push(name);
            }
            let names_list_content = "";
            if(names.length > 3){
                names_list_content += names[0] + ", ";
                names_list_content += names[1];
                names_list_content += ` и ещё ${names.length - 2}`;
            } else {
                for(let i = 0; i < names.length - 1; i++){
                    names_list_content += names[i] + ", ";
                }
                names_list_content += names[names.length - 1];
            }
            res += `<div>
                        <h3>Счёт <a href="api/spendings/${spending.id}">${spending.name}</a> от ${spending.date} на ${sum} ₽</h3>
                        <p>${names_list_content}</p>
                    </div>`
        }
        DivAllSpendings.innerHTML = res;
    } else {
        DivAllSpendings.innerHTML = "<span style='color: gray;'>Вы не состоите ни в одном счёте</span>"
    }
}

loadAllSpendings();