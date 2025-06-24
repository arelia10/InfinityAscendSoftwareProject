  document.addEventListener('DOMContentLoaded', function () {
    const orderDataStre = sessionStorage.getItem('order_data');
    
    if (!orderDataStre) {
        window.location.href = '/index.html';
        return;
    }

    try {
        const orderData = JSON.parse(orderDataStre);
        
        // Guardar la orden en localStorage para el acceso en la página de administración
        localStorage.setItem('order_data', JSON.stringify(orderData));

        // Mostrar número de pedido y fecha
        document.getElementById('order-number').textContent = `Pedido #${orderData.orderNumber}`;
        const orderDate = new Date(orderData.orderDate);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('order-date').textContent = orderDate.toLocaleDateString(window.i18n ? window.i18n.currentLanguage : 'en', options);

        // Mostrar productos comprados
        const productsContainer = document.getElementById('order-products');
        orderData.items.forEach((item) => {
            const productKey = orderData.productKeys.find(key => key.productId === item.id);
            const productElement = document.createElement('div');
            productElement.className = 'order-product';
            productElement.innerHTML = `
                <div class="order-product-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="order-product-info">
                    <div class="order-product-name">${item.name} x${item.quantity}</div>
                    <div class="order-product-price">${window.infinityUtils.formatPrice(item.price * item.quantity)}</div>
                    ${productKey ? `
                        <div class="license-key">
                            <span class="license-key-value">${productKey.key}</span>
                            <button class="copy-key" data-key="${productKey.key}">Copiar</button>
                        </div>
                    ` : ''}
                </div>
            `;
            productsContainer.appendChild(productElement);
        });
        
        // Función para generar y descargar la boleta
        document.getElementById('downloadInvoice').addEventListener('click', function() {
            const products = orderData.items.map(item => {
                return `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`;
            }).join('\n');
            
            const invoiceContent = `Factura de Compra\n\nNúmero de Pedido: ${orderData.orderNumber}\nFecha: ${new Date(orderData.orderDate).toLocaleDateString()}\n\nProductos Comprados:\n${products}\n\nTotal: $${orderData.items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}`;

            const blob = new Blob([invoiceContent], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `boleta_${orderData.orderNumber}.txt`;
            link.click();
        });

    } catch (error) {
        console.error('Error parsing order data:', error);
        window.location.href = '/index.html';
    }
});
