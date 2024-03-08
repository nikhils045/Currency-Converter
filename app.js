const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Adding Country Codes in Dropdowns
for (let select of dropdowns) {
  for (currCode in countryList) {
    let option = document.createElement("option");
    option.innerHTML = currCode;
    option.value = currCode;
    select.append(option);
    if (currCode == "USD" && select.name == "from") {
      option.selected = "selected";
    } else if (currCode == "INR" && select.name == "to") {
      option.selected = "selected";
    }
  }

  select.addEventListener("click", (evt) => {
    updateFlag(evt.target);
  });
}

// Updating Flags whenever Country change in Dropdowns
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Converting Amount and Displaying Result
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = 1;
  }else if (fromCurr.value === toCurr.value) {
    msg.innerHTML = `BOTH OPTIONS ARE SAME, CHANGE ANYONE`;
  }

  const API_KEY = `https://api.frankfurter.app/latest?amount=${amtVal}&from=${fromCurr.value}&to=${toCurr.value}`;
  let response = await fetch(API_KEY);
  let data = await response.json();
  let rate = data.rates[toCurr.value];
  msg.innerText = `${amtVal} ${fromCurr.value} = ${rate} ${toCurr.value}`;
};

// Adding Event Listener to Buttons
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Whenever Page refreshes Result will show of predefined value
window.addEventListener("load", () => {
  updateExchangeRate();
});
