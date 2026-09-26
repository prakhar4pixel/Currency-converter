const BASE_URL = "https://open.er-api.com/v6/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
    for (currency in countryList) {

        let newOption = document.createElement("option");
        newOption.innerText = currency;
        newOption.value = currency;

        if (select.name === "from" && currency === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currency === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;
    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }
    try {
        const URL = `${BASE_URL}/${fromCurr.value}`;
        let response = await fetch(URL);
        if (!response.ok) {
            msg.innerText = "Failed to fetch exchange rate.";
            return;
        }
        let data = await response.json();
        let rate = data.rates[toCurr.value];
        let finalAmount = (amtVal * rate).toFixed(2);
        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } catch (err) {
        msg.innerText = "Error fetching rate. Please try again.";
    }
};

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/shiny/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};


btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

window.addEventListener("load", () => {
    updateExchangeRate();
});