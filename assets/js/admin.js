document.addEventListener('DOMContentLoaded', function () {
    // Verificar si el administrador ya está autenticado
    if (localStorage.getItem('admin_authenticated') === 'true') {
        document.getElementById('admin-report-actions').style.display = 'block';
        document.getElementById('admin-logout-actions').style.display = 'block';
        document.getElementById('admin-login').style.display = 'none';
    } else {
        document.getElementById('admin-login').style.display = 'block';
        document.getElementById('admin-report-actions').style.display = 'none';
        document.getElementById('admin-logout-actions').style.display = 'none';
    }

    // Manejar el evento de login
    document.getElementById('login-btn').addEventListener('click', function () {
        const username = document.getElementById('admin-username').value;
        const password = document.getElementById('admin-password').value;

        if (username === 'admin@infinityascend.com' && password === 'admin123') {
            localStorage.setItem('admin_authenticated', 'true');
            document.getElementById('admin-report-actions').style.display = 'block';
            document.getElementById('admin-logout-actions').style.display = 'block';
            document.getElementById('admin-login').style.display = 'none';
            alert('¡Bienvenido, Administrador!');
        } else {
            alert('Credenciales incorrectas');
        }
    });

    // Manejar el evento para generar el reporte CSV
    document.getElementById('generate-report-btn').addEventListener('click', function () {
        const orderData = JSON.parse(localStorage.getItem('order_data')); // Obtener los datos de la orden almacenados

        // Si hay datos de la orden
        if (orderData && orderData.items && orderData.items.length > 0) {
            let csvContent = "Pedido,Fecha,Producto,Cantidad,Precio,Total\n";
            
            // Recorrer los productos y generar el contenido del CSV
            orderData.items.forEach(item => {
                const total = (item.price * item.quantity).toFixed(2);
                csvContent += `"${orderData.orderNumber}","${new Date(orderData.orderDate).toLocaleDateString('es-ES')}","${item.name}",${item.quantity},${item.price.toFixed(2)},${total}\n`;
            });

            // Crear un Blob con el contenido CSV
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'reporte_de_ventas.csv'; // Nombre del archivo CSV
            link.click();
        } else {
            alert('No hay órdenes disponibles para generar el reporte.');
        }
    });

    // Manejar el evento de logout
    document.getElementById('logout-btn').addEventListener('click', function () {
        localStorage.removeItem('admin_authenticated');
        document.getElementById('admin-login').style.display = 'block';
        document.getElementById('admin-report-actions').style.display = 'none';
        document.getElementById('admin-logout-actions').style.display = 'none';
        alert('Has cerrado sesión correctamente');
    });
});

