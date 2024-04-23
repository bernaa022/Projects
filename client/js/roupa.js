document.addEventListener('DOMContentLoaded', (event) => {
  // Recupera o carrinho do localStorage ou cria um novo se nada estiver salvo
  let cart = JSON.parse(localStorage.getItem('cart')) || {};

  const cartButton = document.getElementById('show-cart-btn');
  const cartDisplay = document.getElementById('cart-display');
  const cartItemsList = document.getElementById('cart-items');
  const cartCount = document.getElementById('cart-count');

  // Listener para adicionar itens ao carrinho
  document.body.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('add-to-cart-btn')) {
      const product = e.target.getAttribute('data-product');
      const price = e.target.getAttribute('data-price');
      addToCart(product, parseFloat(price.replace('€', '')));
    }
  });

  // Listener para os botões de alterar a quantidade
  cartItemsList.addEventListener('click', function(e) {
    const product = e.target.getAttribute('data-product');
    if (e.target.classList.contains('increase-qty')) {
      increaseQuantity(product);
    } else if (e.target.classList.contains('decrease-qty')) {
      decreaseQuantity(product);
    }
  });

  function addToCart(product, price) {
    if (cart[product]) {
      cart[product].qty += 1;
    } else {
      cart[product] = { price: price, qty: 1 };
    }
    saveCart();
    updateCartDisplay();
  }

  function increaseQuantity(product) {
    if (cart[product]) {
      cart[product].qty += 1;
      saveCart();
      updateCartDisplay();
    }
  }

  function decreaseQuantity(product) {
    if (cart[product] && cart[product].qty > 1) {
      cart[product].qty -= 1;
    } else {
      delete cart[product];
    }
    saveCart();
    updateCartDisplay();
  }

  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  function updateCartDisplay() {
    let cartItems = '';
    let totalCount = 0;
    let totalPrice = 0;
  
    for (let item in cart) {
      cartItems += `<li>${item} - €${cart[item].price.toFixed(2)}
                      <button class="quantity-btn decrease-qty" data-product="${item}">-</button>
                      <span class="item-qty">${cart[item].qty}</span>
                      <button class="quantity-btn increase-qty" data-product="${item}">+</button>
                    </li>`;
      totalCount += cart[item].qty;
      totalPrice += cart[item].qty * cart[item].price;
    }
  
    cartItemsList.innerHTML = cartItems;
    cartCount.innerText = totalCount;
    cartDisplay.querySelector('.cart-total span#cart-total-value').innerText = `€${totalPrice.toFixed(2)}`;
  
    cartButton.classList.toggle('has-items', totalCount > 0);
  }

  // Alternar a visibilidade do carrinho
  cartButton.addEventListener('click', function() {
    cartDisplay.classList.toggle('show');
  });

  // Inicializa a exibição do carrinho com os itens salvos
  updateCartDisplay();
});

// Função Play/Pause do vídeo
var video = document.getElementById("background-video");
function playPause() {
  if (video.paused) {
    video.play();
    document.getElementById("playPauseBtn").innerHTML = '<i class="fas fa-pause"></i>Pause';
  } else {
    video.pause();
    document.getElementById("playPauseBtn").innerHTML = '<i class="fas fa-play"></i>Play';
  }
}