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

            localStorage.removeItem(productId);
            localStorage.setItem(productId, JSON.stringify({productId, productImg, productQuantity}));
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
            localStorage.setItem(productId, JSON.stringify({productId, productImg, productQuantity}));
        } else if (isProductInCart(productId)) {
            addProductQuantity(productId, productImg, productQuantity);
        };
        return false;
    };
});

function cartClear() {
    document.querySelector('div.cart__clear').onclick = function () {
        document.querySelector('div.cart').remove();
        localStorage.clear();
    };
};

function renderPage() {
    if (localStorage.length > 0) {
        let storageArray = {...localStorage};
        for (let item in storageArray) {
            insertProductToCart(JSON.parse(storageArray[item]).productId, JSON.parse(storageArray[item]).productImg, JSON.parse(storageArray[item]).productQuantity);
        };
    };
};

renderPage();
