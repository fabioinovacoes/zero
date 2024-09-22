document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartCountElement = document.getElementById('cart-count');
    const cartTotalElement = document.getElementById('cart-total');
    const cartItemsElement = document.getElementById('cart-items');
    const cartModal = document.getElementById('cart-modal');
    const cartBtn = document.getElementById('cart-btn');
    const closeModalBtn = document.getElementById('classe-modal-btn');
    const checkoutBtn = document.getElementById('checkout-btn');
    const addressInput = document.getElementById('address');
    const addressWarn = document.getElementById('address-warn');
    const dateSpan = document.getElementById('date-span');
    
    let cart = [];
    let cartTotal = 0;

    // Função para verificar se a loja está aberta
    function isStoreOpen() {
        const currentDate = new Date();
        const currentHour = currentDate.getHours();
        return currentHour >= 6 && currentHour < 22;
    }

    function updateStoreStatus() {
        if (isStoreOpen()) {
            dateSpan.classList.add('bg-green-600');
            dateSpan.classList.remove('bg-red-600');
            enableOrderButtons(true);
        } else {
            dateSpan.classList.add('bg-red-600');
            dateSpan.classList.remove('bg-green-600');
            enableOrderButtons(false);
        }
    }

    // Função para habilitar ou desabilitar os botões de pedido
    function enableOrderButtons(enable) {
        addToCartButtons.forEach(button => {
            button.disabled = !enable;
            button.style.opacity = enable ? '1' : '0.5';
        });
    }

    // Atualiza o estado da loja ao carregar a página
    updateStoreStatus();

    // Função para adicionar item ao carrinho
    function addToCart(name, price) {
        cart.push({ name, price });
        cartTotal += parseFloat(price);
        updateCart();
    }

    // Função para remover item do carrinho
    function removeFromCart(index) {
        cartTotal -= parseFloat(cart[index].price);
        cart.splice(index, 1);
        updateCart();
    }

    // Função para atualizar o carrinho
    function updateCart() {
        cartCountElement.innerText = cart.length;
        cartTotalElement.innerText = cartTotal.toFixed(2);

        cartItemsElement.innerHTML = '';
        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'flex justify-between mb-2';
            itemElement.innerHTML = `
                <p>${item.name}</p>
                <p>R$ ${item.price}</p>
                <button class="remove-item-btn bg-red-500 text-white px-2 py-1 rounded" data-index="${index}">Remover</button>
            `;
            cartItemsElement.appendChild(itemElement);
        });

        // Adiciona o evento de clique para remover os itens do carrinho
        const removeButtons = document.querySelectorAll('.remove-item-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                removeFromCart(index);
            });
        });
    }

    // Adiciona os itens ao carrinho ao clicar no botão
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const name = button.getAttribute('data-name');
            const price = button.getAttribute('data-price');
            addToCart(name, price);
        });
    });

    // Abre o modal do carrinho ao clicar no botão
    cartBtn.addEventListener('click', () => {
        cartModal.classList.remove('hidden');
    });

    // Fecha o modal do carrinho
    closeModalBtn.addEventListener('click', () => {
        cartModal.classList.add('hidden');
    });

    // Finaliza o pedido e envia a mensagem para o WhatsApp
    checkoutBtn.addEventListener('click', () => {
        // Verifica se o restaurante está aberto
        if (!isStoreOpen()) {
            alert("RESTAURANTE FECHADO NO MOMENTO");
            return;
        }

        const address = addressInput.value.trim();

        if (!address) {
            addressWarn.classList.remove('hidden');
            return;
        }

        const message = cart.map(item => `${item.name} - R$ ${item.price}`).join('%0A');
        const totalMessage = `Total: R$ ${cartTotal.toFixed(2)}`;
        const url = `https://api.whatsapp.com/send?phone=5541999999999&text=Pedido:%0A${message}%0A${totalMessage}%0AEndereço: ${encodeURIComponent(address)}`;

        window.open(url, '_blank');

        // Limpa o carrinho após finalizar o pedido
        clearCart();
        // Fecha o modal do carrinho
        cartModal.classList.add('hidden');
    });

    // Função para limpar o carrinho
    function clearCart() {
        cart = [];
        cartTotal = 0;
        updateCart();
    }

    // Atualiza o status da loja a cada minuto
    setInterval(updateStoreStatus, 60000);
});
