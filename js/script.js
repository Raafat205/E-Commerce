var data = [];
async function getProducts() {
  var res = await fetch("https://dummyjson.com/products/category/smartphones");
data = await res.json();
  console.log(data.products);
  console.log("data");
  displayProdacts(data.products);
}
function displayProdacts(data) {
  var row = document.getElementById("myRow");
  row.innerHTML = "";
  data.forEach((product) => {
    row.innerHTML += `
           <div class="col-md-4">
                <div class="card shadow">
                    <div class="img-box overflow-hidden">
                        <img src="${
                          product.images[0]
                        }" class="card-img-top bg-dark" alt="${product.title}">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${product.title
                          .split(" ")
                          .slice(0, 3)
                          .join(" ")}</h5>
                        <div class="d-flex justify-content-between align-items-center ratings w-25 mb-1">
                        ${Array.from(
                          { length: Math.round(product.rating) },
                          () => `<i class="fa-solid fa-star text-warning"></i>`
                        ).join("")}
                        ${Array.from(
                        { length: 5 - Math.round(product.rating) },
                        () => `<i class="fa-regular fa-star"></i>`
                        ).join("")}
                        </div>
                        ${
                          product.availabilityStatus == "In Stock"
                            ? `<span>${product.price}$</span>`
                            : `<span class="text-danger">Out of Stock</span>`
                        }
                    </div>
                </div>
            </div>
        `;
  });
}

getProducts();

var filter= document.querySelector("#filter button");
var dropdownItems = document.querySelectorAll(".dropdown-item");

dropdownItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    filterProducts(e.target.innerText);
    dropdownItems.forEach((item) => {
      item.classList.remove("active");
    });
    e.target.classList.add("active");
  });
});

function filterProducts(cat){
    if(cat == "All"){
        filter.innerText = "Filter";
        displayProdacts(data.products);
        
    }else if(cat == "Apple"){
        filter.innerText = "Apple";
        displayProdacts(data.products.filter((product) => product.brand == "Apple"));
    }else{
        filter.innerText = "Android";
        displayProdacts(data.products.filter((product) => product.brand != "Apple"));
    }
}
