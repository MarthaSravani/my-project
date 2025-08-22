// Product data
const products = [
  { name: "T-Shirt", category: "Clothing" },
  { name: "Jeans", category: "Clothing" },
  { name: "Headphones", category: "Electronics" },
  { name: "Smartphone", category: "Electronics" },
  { name: "Novel", category: "Books" },
  { name: "Cookbook", category: "Books" }
];

const dropdown = document.getElementById("categoryFilter");
const productList = document.getElementById("productList");

// Function to render products
function renderProducts(filter) {
  // Clear previous list
  productList.innerHTML = "";

  // Filter products
  const filtered = filter === "All"
    ? products
    : products.filter(item => item.category === filter);

  // If no products, show message
  if (filtered.length === 0) {
    const li = document.createElement("li");
    li.className = "no-items";
    li.textContent = "No products available";
    productList.appendChild(li);
    return;
  }

  // Create list items dynamically
  filtered.forEach(product => {
    const li = document.createElement("li");
    li.textContent = product.name;
    productList.appendChild(li);
  });
}

// Initial load (show all products)
renderProducts("All");

// Event listener for dropdown changes
dropdown.addEventListener("change", (e) => {
  renderProducts(e.target.value);
});
