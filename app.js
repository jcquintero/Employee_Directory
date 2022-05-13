// GLOBAL VARIABLES

let employeeList = [];

const apiURL = `https://randomuser.me/api/?results=12&nat=us&inc=name,email, phone,location,picture,cell,dob`;
//const apiURL = `http://tweb.eafit.edu.co/PSIGW/PeopleSoftServiceListeningConnector/PSFT_CS/EA_EBS_PERS_PS.1.wsdl, phone,location,picture,cell,dob`;
const directoryContainer = document.querySelector('.directory-container');
const searchInput = document.querySelector('.search-input');
const overlay = document.querySelector('.overlay');
const modalText = document.querySelector('.modal-content');
const modalClose = document.querySelector('.modal-x-closer');

// FETCH DATA FROM API

fetch(apiURL)
  .then(response => response.json())
  .then(response => response.results)
  .then(displayEmployees)
  .catch(
    error =>
      (directoryContainer.innerHTML = `Sorry, there has been an error pulling data from the API`)
  );

// DISPLAY EMPLOYEE INFORMATION

function displayEmployees(employeeData) {
  employees = employeeData;
  // STORE EMPLOYEE HTML
  let employeeHTML = ``;
  // LOOP THROUGH EACH EMPLOYEE AND CREATE MARKUP
  employees.forEach((employee, i) => {
    let name = employee.name;
    let email = employee.email;
    let city = employee.location.city;
    let state = employee.location.state;
    let picture = employee.picture;

    employeeHTML += `
    <div class="directory-container__card" data-index="${i}">
        <img src="${picture.large}" alt="${name.first} ${
      name.last
    }" class="card__img" />
        <div class="card__info">
          <h2 class="card__info-name"><text-shadow: 4px 4px 4px #aaa;>${name.first} ${name.last}</h2>
          <p class="card__info-email">${email}</p>
          <p class="card__info-address">${city}, ${state}</p>
        </div>
      </div>
    `;
  });
  directoryContainer.innerHTML = employeeHTML;
}

// EMPLOYEE SEARCH

searchInput.addEventListener('keyup', function(e) {
  let employeeCards = document.querySelectorAll('.directory-container__card');
  let currentQuery = this.value;

  for (let i = 0; i < employeeCards.length; i++) {
    if (
      !employeeCards[i].innerText
        .toUpperCase()
        .includes(currentQuery.toUpperCase())
    ) {
      employeeCards[i].style.display = 'none';
    } else {
      employeeCards[i].style.display = 'flex';
    }
  }
});

// EMPLOYEE MODALS

function modalDisplay(index) {
  let {
    name,
    dob,
    phone,
    email,
    location: { city, street, state, postcode },
    picture
  } = employees[index];

  let date = new Date(dob.date);

  const modalContent = `
  <div class="modal-individual data-index="${index}">
        <img src="${picture.large}" alt="${name.first} ${
    name.last
  }" class="card__img-modal" />
        <div>
          <h2 class="card__info-name">${name.first} ${name.last}</h2>
          <p class="card__info-email">${email}</p>
          <hr />
          <p>${phone}</p>
          <p class="card__info-address">${street} <br/>${city}, ${state} ${postcode}</p>
          <p><strong>Birthday:</strong> ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
        </div>
      </div>
  `;
  overlay.classList.remove('modal-hide');
  modalText.innerHTML = modalContent;
}

directoryContainer.addEventListener('click', e => {
  if (e.target !== directoryContainer) {
    const card = e.target.closest('.directory-container__card');
    const index = card.getAttribute('data-index');

    modalDisplay(index);
  }
});

modalClose.addEventListener('click', () => {
  overlay.classList.add('modal-hide');
});
