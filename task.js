'use strict';

let cartArray;

function insertProductToCart(productId, productImg, productQuantity) {
    if (!document.querySelector('div.cart')) {
        document.querySelector('body').insertAdjacentHTML('afterbegin',
            `<div class="cart">
                     <div class="cart__title">Корзина</div>
                     <div class="cart__products"></div>
                     <div class="cart__clear">Очистить корзину</div>
                  </div>`
        );
    };
    document.querySelector('div.cart__products').insertAdjacentHTML('beforeend',
        `<div class="cart__product" data-id="${productId}">
                <img class="cart__product-image" src="${productImg}">
                <div class="cart__product-count">${productQuantity}</div>
              </div>`
    );
    cartClear();
};

function valueChange(item, buttonEvent) {
    let productValue = item.querySelector('div.product__quantity-value');
    let productCount = parseInt(productValue.innerText);
    if (buttonEvent == '+') {
        productValue.textContent = ++productCount;
    } else if (buttonEvent == '-') {
        productCount <= 1 ? productValue.textContent = 1 : productValue.textContent = --productCount;
    };
};

function isProductInCart(productId) {
    cartArray = Array.from(document.querySelectorAll('div.cart__product'));
    for (let node in cartArray) {
        if (cartArray[node].dataset.id == productId) {
            return true;
        };
    };
    return false;
};

function addProductQuantity(productId, productImg, productQuantity) {
    cartArray = Array.from(document.querySelectorAll('div.cart__product'));
    for (let node in cartArray) {
        if (cartArray[node].dataset.id == productId) {
            productQuantity = parseInt(cartArray[node].querySelector('div.cart__product-count').textContent) + parseInt(productQuantity);
            cartArray[node].querySelector('div.cart__product-count').textContent = productQuantity;
            updateLocalstorage();
        };
    };
};

Array.from(document.querySelectorAll('div.product')).forEach(function (item, index) {
    item.onclick = function (event) {
        valueChange(item, event.path[0].innerText, index);
        return false;
    };
});

Array.from(document.querySelectorAll('div.product__add')).forEach(function (item, index) {
    item.onclick = function (event) {
        let productQuantity = event.path[2].querySelector('div.product__quantity-value').innerText;
        let productId = event.path[3].dataset.id;
        let productImg = event.path[3].querySelector('img').src;
        if (productQuantity != 0 && !isProductInCart(productId)) {
            insertProductToCart(productId, productImg, productQuantity);
            updateLocalstorage();
        } else if (isProductInCart(productId)) {
            addProductQuantity(productId, productImg, productQuantity);
        };
        return false;
    };
});

function cartClear() {
    document.querySelector('div.cart__clear').onclick = function () {
        document.querySelector('div.cart').remove();
        localStorage.removeItem('cart');
    };
};

function renderPage() {
    if (localStorage.cart) {
        let arrayFromStorage = JSON.parse(localStorage.cart);
        if (arrayFromStorage.length > 0) {
            for (let item in arrayFromStorage) {
                insertProductToCart(arrayFromStorage[item].productId, arrayFromStorage[item].productImg, arrayFromStorage[item].productQuantity);
            };
        };
    };
};

function updateLocalstorage() {
    let storageArray = [];
    let allProducts = Array.from(document.querySelectorAll('div.cart__product'));
    if (allProducts && allProducts.length > 0) {
        for (let item in allProducts) {
            storageArray.push({
                'productId': allProducts[item].dataset.id,
                'productImg': allProducts[item].querySelector('img').src,
                'productQuantity': allProducts[item].querySelector('div.cart__product-count').innerText,
            });
        };
    };
    localStorage.removeItem('cart');
    localStorage.setItem('cart', JSON.stringify(storageArray));
};

renderPage();
