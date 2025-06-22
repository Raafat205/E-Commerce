var data = [];
var searchInput = document.getElementById("searchInput");
var filter = document.querySelector("#filter button");
var dropdownItems = document.querySelectorAll(".dropdown-item");
var currentCategory = "All";
var currentPage = 1;
const productsPerPage = 6;
var currentFilteredProducts = [];

getProducts();

async function getProducts() {
  
  var res = await fetch("https://dummyjson.com/products/category/smartphones");
  data = await res.json();
  console.log(data.products);
  
  currentFilteredProducts = data.products;
  updateProductsDisplay();
}

dropdownItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    currentCategory = e.target.innerText;
    dropdownItems.forEach((el) => el.classList.remove("active"));
    e.target.classList.add("active");
    currentPage = 1;
    updateProductsDisplay();
  });
});

searchInput.addEventListener("input", () => {
  currentPage = 1;
  updateProductsDisplay();
});

function updateProductsDisplay() {
  if (!data.products) return; 
  let filtered = data.products;
  const searchValue = searchInput.value.toLowerCase();
  if (searchValue) {
    filtered = filtered.filter((product) =>
      product.title.toLowerCase().includes(searchValue)
    );
  }
  if (currentCategory === "Apple") {
    filtered = filtered.filter((product) => product.brand === "Apple");
    filter.innerText = "Apple";
  } else if (currentCategory === "Android") {
    filtered = filtered.filter((product) => product.brand !== "Apple");
    filter.innerText = "Android";
  } else {
    filter.innerText = "Filter";
  }
  currentFilteredProducts = filtered;
  displayPage(currentPage);
  updatePagination();
}

function displayPage(page) {
  const start = (page - 1) * productsPerPage;
  const end = start + productsPerPage;
  const pageProducts = currentFilteredProducts.slice(start, end);
  if (pageProducts.length === 0) {
    document.getElementById("myRow").innerHTML = `
      <div class="text-center text-black vh-100 d-flex align-items-center justify-content-center">
        <h2>No products found</h2>
      </div>`;
  } else {
    displayProdacts(pageProducts);
  }
}

function hideSpin(e){
  var spinner=document.querySelector(`.spin-${e}`);
  spinner.classList.add("d-none");
}

function displayProdacts(data) {

  const row = document.getElementById("myRow");
  let html = "";
  data.forEach((product, index) => {
    html += `
      <div class="col-md-4 mb-3">
        <div class="card shadow overflow-hidden rounded-3">
          <div class="img-box overflow-hidden">
            <div class="d-flex justify-content-center align-items-center my-5 spinnerBox spin-${index}">
              <div class="spinner "></div>
            </div>
            <img src="${product.thumbnail}" class="card-img-top bg-dark" alt="${product.title}" onload="hideSpin(${index})">
          </div>
          <div class="card-body">
            <h5 class="card-title">${product.title.split(" ").slice(0, 3).join(" ")}</h5>
            <div class="d-flex justify-content-between align-items-center ratings w-25 mb-1">
              ${Array.from({ length: Math.round(product.rating) }, () => `<i class="fa-solid fa-star"></i>`).join("")}
              ${Array.from({ length: 5 - Math.round(product.rating) }, () => `<i class="fa-regular fa-star"></i>`).join("")}
            </div>
            ${
              product.availabilityStatus == "In Stock"
                ? `<span>${product.price}$</span>`
                : `<span class="text-danger">Out of Stock</span>`
            }
          </div>
        </div>
        <div class="cntrls mt-2">
        <button class="btn btn-outline-dark" data-bs-toggle="modal" data-bs-target="#deleteModal" onclick="dltProduct(${product.id})">Delete</button>
        <button class="btn btn-outline-dark" data-bs-toggle="modal" data-bs-target="#editModal" onclick="setEditForm(${product.id})">Edit</button>
        </div>
      </div>`;
  });

  row.innerHTML = html;
}

function updatePagination() {
  const totalPages = Math.ceil(currentFilteredProducts.length / productsPerPage);
  const pagination = document.querySelector(".pagination");
  let html = `
    <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
      <a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>
    </li>
  `;

  for (let i = 1; i <= totalPages; i++) {
    html += `
      <li class="page-item ${currentPage === i ? "active" : ""}">
        <a class="page-link" href="#" data-page="${i}">${i}</a>
      </li>`;
  }

  html += `
    <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
      <a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>
    </li>
  `;

  pagination.innerHTML = html;
}

document.querySelector(".pagination").addEventListener("click", (e) => {
  e.preventDefault();
  const page = parseInt(e.target.getAttribute("data-page"));
  if (!isNaN(page)) {
    currentPage = page;
    displayPage(currentPage);
    updatePagination();
  }
});


var darkMoodBtn= document.querySelector(".navbar i");

darkMoodBtn.addEventListener("click",e=>darkMood())

function darkMood(){
  var page=document.getElementsByTagName("html")[0];
  var pageTheme=page.getAttribute("data-bs-theme");
  if(pageTheme=="light"){
      pageTheme="dark";
      darkMoodBtn.classList.remove("fa-moon");
      darkMoodBtn.classList.add("fa-sun");
  }else{
      pageTheme="light";
      darkMoodBtn.classList.add("fa-moon");
      darkMoodBtn.classList.remove("fa-sun");
  }
  page.setAttribute("data-bs-theme",pageTheme);
}

async function deleteProduct(id) {
  const res = await fetch(`https://dummyjson.com/products/${id}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  console.log("Deleted:", data);
}
async function dltProduct(e){
  if (!confirmDelete()) return;
  await deleteProduct(e);
  data.products=data.products.filter(prod=>prod.id!=e);
  updateProductsDisplay();
}
var deleteModal = document.getElementById("deleteModal");
async function confirmDelete(){
  return new Promise((resolve) => {
    deleteModal.querySelector(".btn-danger").onclick = () => {
      modalInstance.hide();
      resolve(true);
    };
    const onModalHidden = () => {
      deleteModal.removeEventListener("hidden.bs.modal", onModalHidden);
      resolve(false);
    };

    deleteModal.addEventListener("hidden.bs.modal", onModalHidden, { once: true });
  });
}

  var titleInput;
  var productTitleInput=document.getElementById("productTitleInput");
  var productPriceInput=document.getElementById("productPriceInput");
  var productDescriptionInput=document.getElementById("productDescriptionInput");
function setEditForm(e){
  var product=data.products.find(prod=>prod.id==e);
  titleInput=product.title;
  productTitleInput.value=product.title;
  productPriceInput.value=product.price;
  productDescriptionInput.value=product.description;
}

function editProduct() {
  var id = saveChangesBtn.getAttribute("data-id");
  var product = data.products.find(prod => prod.id == id);
  if (product) {
    product.title = productTitleInput.value;
    product.price = productPriceInput.value;
    product.description = productDescriptionInput.value;
    updateProductsDisplay();
  }
}

function checkAvailability(){
  var checker=data.products.some(prod=>prod.title==productTitleInput.value)&&titleInput!=productTitleInput.value;
  if(checker)
  document.getElementById("titleAlert").innerHTML="Product Name Unavailable";
  else
  document.getElementById("titleAlert").innerHTML="";
  return checker;
}

function editBtnCheck(){
  if(!checkAvailability()&&productTitleInput.value&&productPriceInput.value&&productDescriptionInput.value)
    saveChangesBtn.disabled=false;
  else
    saveChangesBtn.disabled=true;
}

productTitleInput.addEventListener("input",e=>{
  checkAvailability()
  editBtnCheck();
})
productPriceInput.addEventListener("input",e=>editBtnCheck())
productDescriptionInput.addEventListener("input",e=>editBtnCheck())