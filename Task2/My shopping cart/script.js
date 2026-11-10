
// 1. Products
const products = [
    {
        id: 1,
        name: "Fake Nails",
        price: 5.00,
        image: "images/nail1.jpg"
    },
    {
        id: 2,
        name: "Nail",
        price: 8.00,
        image: "images/nail2.jpeg"
    },
    {
        id: 3,
        name: "Nail Lacqeur",
        price: 9.00,
        image: "images/nail22.jpg"
    }
];

// 2. Get cart from localStorage
let cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];

// 3. Save cart
function saveCart() {
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
}

// 4. Format price
function formatPrice(price) {
    return "$" + price.toFixed(2);
}

// 5. Add products to cart (index.html)
document.querySelectorAll(".add-to-cart").forEach(button => {

    button.addEventListener("click", function () {

        const productId = Number(this.dataset.id);

        const existingProduct = cart.find(item => item.id === productId);

        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push({
                id: productId,
                quantity: 1
            });
        }

        saveCart();
        updateCartCount();

        alert("Product added to cart!");

    });

});

// 6. Update cart count
function updateCartCount() {

    const cartCount = document.getElementById("cartCount");

    if (cartCount) {

        const total = cart.reduce(
            (sum, item) => sum + item.quantity,
            0
        );

        cartCount.textContent = total;
    }
}

// 7. Display cart products (cart.html)
function displayCart() {

    const cartItems = document.getElementById("cartItems");
    const emptyCart = document.getElementById("emptyCart");
    const cartSummary = document.getElementById("cartSummary");

    // Check if we are on cart.html
    if (!cartItems || !emptyCart) {
        return;
    }

    cartItems.innerHTML = "";

    // Empty cart
    if (cart.length === 0) {

        emptyCart.classList.remove("d-none");

        if (cartSummary) {
            cartSummary.classList.add("d-none");
        }

        updateCartTotals();
        return;
    }

    emptyCart.classList.add("d-none");

    if (cartSummary) {
        cartSummary.classList.remove("d-none");
    }

    // Show each product
    cart.forEach(item => {

        const product = products.find(p => p.id === item.id);

        if (!product) {
            return;
        }

        cartItems.innerHTML += `
            <div class="card cart-item mb-3">
                <div class="card-body">
                    <div class="row align-items-center g-3">

                        <div class="col-4 col-md-2">
                            <img
                                src="${product.image}"
                                alt="${product.name}"
                                class="cart-product-image img-fluid">
                        </div>

                        <div class="col-8 col-md-3">
                            <h5>${product.name}</h5>
                            <p class="price mb-0">
                                ${formatPrice(product.price)}
                            </p>
                        </div>

                        <div class="col-6 col-md-3">
                            <button
                                class="btn btn-outline-secondary"
                                data-action="decrease"
                                data-id="${product.id}">-</button>

                            <span class="mx-2">${item.quantity}</span>

                            <button
                                class="btn btn-outline-secondary"
                                data-action="increase"
                                data-id="${product.id}">+</button>
                        </div>

                        <div class="col-6 col-md-2">
                            <strong>
                                ${formatPrice(product.price * item.quantity)}
                            </strong>
                        </div>

                        <div class="col-12 col-md-2">
                            <button
                                class="btn btn-danger btn-sm"
                                data-action="remove"
                                data-id="${product.id}">
                                <i class="bi bi-trash"></i> Remove
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        `;
    });

    updateCartTotals();
}

// 8. Increase, decrease or remove products
document.addEventListener("click", function (event) {

    const button = event.target.closest("button[data-action]");

    if (!button) {
        return;
    }

    const productId = Number(button.dataset.id);
    const action = button.dataset.action;

    const item = cart.find(p => p.id === productId);

    if (!item) {
        return;
    }

    if (action === "increase") {
        item.quantity++;
    }

    if (action === "decrease" && item.quantity > 1) {
        item.quantity--;
    }

    if (action === "remove") {
        cart = cart.filter(p => p.id !== productId);
    }

    saveCart();
    displayCart();
    updateCartCount();
});

// 9. Calculate totals
function updateCartTotals() {

    let totalQuantity = 0;
    let subtotal = 0;

    cart.forEach(item => {

        const product = products.find(p => p.id === item.id);

        if (product) {
            totalQuantity += item.quantity;
            subtotal += product.price * item.quantity;
        }
    });

    const quantityElement = document.getElementById("totalQuantity");
    const subtotalElement = document.getElementById("subtotal");
    const finalTotalElement = document.getElementById("finalTotal");

    if (quantityElement) {
        quantityElement.textContent = totalQuantity;
    }

    if (subtotalElement) {
        subtotalElement.textContent = formatPrice(subtotal);
    }

    if (finalTotalElement) {
        finalTotalElement.textContent = formatPrice(subtotal);
    }
}

// 10. Clear all products
const clearCartButton = document.getElementById("clearCart");

if (clearCartButton) {

    clearCartButton.addEventListener("click", function () {

        cart = [];

        saveCart();
        displayCart();
        updateCartCount();
    });
}

// 11. Run functions when page loads
updateCartCount();
displayCart();
