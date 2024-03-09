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
    if (currCode === "USD" && select.name === "from") {
      option.selected = true;
    } else if (currCode === "INR" && select.name === "to") {
      option.selected = true;
    }
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Updating Flags whenever Country change in Dropdowns
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let flagSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = flagSrc;
};

// Converting Amount and Displaying Result
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input").value;
  if (amount === "" || amount <= 0) {
    msg.innerHTML = "Please enter a valid amount (Minimum 0.1)";
    msg.style.color = "red";
    return;
  } else if (fromCurr.value === toCurr.value) {
    msg.innerHTML = "Both currencies are same. Please choose different ones.";
    msg.style.color = "red";
    return;
  }

  const API_URL = `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurr.value}&to=${toCurr.value}`;
  try {
    let response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Error fetching exchange rate: ${response.status}`);
    }
    let data = await response.json();
    let rate = data.rates[toCurr.value];
    msg.innerText = `${amount} ${fromCurr.value} = ${rate} ${toCurr.value}`;
    msg.style.color = "black";
  } catch (error) {
    console.error("Error:", error);
    msg.innerText = "An error occurred. Please try again later.";
    msg.style.color = "red";
  }
};

// Adding Event Listener to Buttons
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Update on page load
window.addEventListener("load", () => {
  updateExchangeRate();
});
