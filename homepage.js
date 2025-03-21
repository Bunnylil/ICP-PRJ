let images = [];
let currentIndex = 0;

// Fetch images from the backend
function fetchImages() {
  fetch("http://localhost:5000/api/home-thumbnails")
    .then((response) => response.json())
    .then((data) => {
      if (data.length > 0) {
        images = data.map((item) => item.imageUrl);
        updateImage(); // Set first image
        setInterval(updateImage, 5000); // Change every 5 seconds
      }
    })
    .catch((error) => console.error("Error fetching thumbnails:", error));
}

// Function to update the displayed image
function updateImage() {
  if (images.length > 0) {
    document.getElementById("thumbnail-image").src = images[currentIndex];
    currentIndex = (currentIndex + 1) % images.length; // Loop through images
  }
}

// Fetch products from backend and display them
async function fetchProducts(apiEndpoint, containerId) {
  try {
    const response = await fetch(apiEndpoint);
    const products = await response.json();

    const productContainer = document.getElementById(containerId);
    productContainer.innerHTML = ""; // Clear previous content

    products.forEach((product) => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("product");

      productDiv.innerHTML = `
                <a href="${product.link || product.page}">
                    <img src="${product.image}" alt="${
        product.name
      }" width="150">
                </a>
                <h3>${product.name}</h3>
                <p class="price">${product.price}</p>
            `;

      productContainer.appendChild(productDiv);
    });
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// hamburger.js

document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".hamburger");
  const hamburgerMenu = document.querySelector(".hamburger-menu");

  hamburger.addEventListener("click", function () {
    // Toggle the visibility of the hamburger menu
    if (hamburgerMenu.style.display === "block") {
      hamburgerMenu.style.display = "none";
    } else {
      hamburgerMenu.style.display = "block";
    }
  });

  // Close the hamburger menu when clicking outside of it
  document.addEventListener("click", function (event) {
    if (
      !hamburger.contains(event.target) &&
      !hamburgerMenu.contains(event.target)
    ) {
      hamburgerMenu.style.display = "none";
    }
  });
});
// Initialize fetch functions
fetchImages();
fetchProducts("http://localhost:5000/api/products", "product-list");
fetchProducts("http://localhost:5000/api/milk-products", "productGrid");
