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

function displayProdacts(data) {
  const row = document.getElementById("myRow");
  let html = "";
  data.forEach((product) => {
    html += `
      <div class="col-md-4 mb-3">
        <div class="card shadow">
          <div class="img-box overflow-hidden">
            <img src="${product.images[0]}" class="card-img-top bg-dark" alt="${product.title}">
          </div>
          <div class="card-body">
            <h5 class="card-title">${product.title.split(" ").slice(0, 3).join(" ")}</h5>
            <div class="d-flex justify-content-between align-items-center ratings w-25 mb-1">
              ${Array.from({ length: Math.round(product.rating) }, () => `<i class="fa-solid fa-star text-warning"></i>`).join("")}
              ${Array.from({ length: 5 - Math.round(product.rating) }, () => `<i class="fa-regular fa-star"></i>`).join("")}
            </div>
            ${
              product.availabilityStatus == "In Stock"
                ? `<span>${product.price}$</span>`
                : `<span class="text-danger">Out of Stock</span>`
            }
          </div>
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