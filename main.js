// Your code starts here
const addToQueBtn = document.getElementById("addToQue");
const queListTable = document.querySelector("#queList tbody");
const guestListTable = document.querySelector("#guestList tbody");

let queNumber = localStorage.getItem("que") || 0;
let guestId = localStorage.getItem("guest_id") || 0;

let queList = JSON.parse(localStorage.getItem("que_list")) || [];
let guestList = JSON.parse(localStorage.getItem("guest_list")) || [];

let selectedElement;
let selectedElements = [];

// Get Que List from Local Storage
if (queList !== null) {
  queList.forEach((el) => {
    let newTr = document.createElement("tr");

    if (el.age >= 18) {
      newTr.innerHTML = `<td>${el.name}</td>
      <td>${el.age}</td>
      <td><button class="btn btn-sm btn-outline-danger">Decline</button>
      <button class="btn btn-sm btn-outline-success">Accept</button></td>`;
    } else {
      newTr.innerHTML = `<td>${el.name}</td>
      <td>${el.age}</td>
      <td><button class="btn btn-sm btn-outline-danger">Decline</button>`;
    }

    queListTable.appendChild(newTr);
  });
}

// Get Guest List from Local Storage
if (guestList !== null) {
  guestList.forEach((el) => {
    let newTr = document.createElement("tr");
    newTr.innerHTML = `<td>${el.name}</td>
    <td>${el.age}</td>
    <td><button class="btn btn-sm btn-outline-info">Edit</button></td>`;

    guestListTable.appendChild(newTr);
  });
}

class Que {
  constructor() {
    this.name = `Que ${queNumber}`;
    this.age = Math.floor(Math.random() * (50 - 14) + 14);
  }

  isAdult() {
    if (this.age >= 18) {
      return true;
    } else {
      return false;
    }
  }
}

class Guest {
  constructor(name, age, id) {
    this.name = name;
    this.age = age;
    this.id = id;
  }
}

// Generate new Que on button click
addToQueBtn.addEventListener("click", function () {
  queNumber++;
  localStorage.setItem("que", queNumber);

  let newQue = new Que();

  queList.push(newQue);
  localStorage.setItem("que_list", JSON.stringify(queList));

  let newTr = document.createElement("tr");
  let td1 = document.createElement("td");
  let td2 = document.createElement("td");
  let td3 = document.createElement("td");

  td1.textContent = newQue.name;
  td2.textContent = newQue.age;

  if (newQue.isAdult()) {
    td3.innerHTML = `<button class="btn btn-sm btn-outline-danger">Decline</button>
    <button class="btn btn-sm btn-outline-success">Accept</button>`;
  } else {
    td3.innerHTML = `<button class="btn btn-sm btn-outline-danger">Decline</button>`;
  }

  newTr.appendChild(td1);
  newTr.appendChild(td2);
  newTr.appendChild(td3);

  queListTable.appendChild(newTr);
});

queListTable.addEventListener("click", function (e) {
  e.preventDefault();

  let acceptBtn = e.target.classList.contains("btn-outline-success");
  let declineBtn = e.target.classList.contains("btn-outline-danger");

  let eventTr = e.target.parentElement.parentElement;
  let nameTd = eventTr.firstChild.textContent;

  if (acceptBtn) {
    if (guestList.length < 15) {
      let arrElement = queList.find((el) => el.name.includes(nameTd));

      guestListTable.appendChild(eventTr);

      e.target.parentElement.innerHTML = `<button class="btn btn-sm btn-outline-info">Edit</button>`;

      guestId++;
      localStorage.setItem("guest_id", guestId);

      let newGuest = new Guest(arrElement.name, arrElement.age, guestId);

      queList.splice(queList.indexOf(arrElement), 1);
      localStorage.setItem("que_list", JSON.stringify(queList));
      guestList.push(newGuest);
      localStorage.setItem("guest_list", JSON.stringify(guestList));
    } else {
      alert("Guets List is full");
    }
  }

  if (declineBtn) {
    let arrElement = queList.find((el) => el.name.includes(nameTd));

    queList.splice(queList.indexOf(arrElement), 1);
    localStorage.setItem("que_list", JSON.stringify(queList));

    eventTr.remove();
  }
});

guestListTable.addEventListener("click", function (e) {
  e.preventDefault();

  let btn = e.target.classList.contains("btn-outline-info");
  let btnText = e.target.textContent;
  let nameTd = e.target.parentElement.parentElement.firstChild;

  if (btn && btnText === "Edit") {
    e.target.textContent = "Save";

    selectedElement = guestList.find((el) =>
      el.name.includes(nameTd.textContent)
    );

    selectedElements.push(selectedElement);

    nameTd.innerHTML = `<input class="form-control form-control-sm" value="${nameTd.textContent}">`;
  } else if (btn && btnText === "Save") {
    e.target.textContent = "Edit";

    nameTd.textContent = `${nameTd.firstChild.value}`;

    selectedElements.forEach((el) => {
      let selectedTr = e.target.parentElement.parentElement;
      let selectedTrIndex = selectedTr.rowIndex;

      if (el.id === selectedTrIndex) {
        el.name = selectedTr.firstChild.textContent;
      }
    });

    localStorage.setItem("guest_list", JSON.stringify(guestList));
  }
});
