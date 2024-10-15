//--- customersController.js ---
const conexion = require('../config/conexion');
const express = require("express");
const ruta = express();
const bodyParser = require('body-parser');
ruta.use(bodyParser.json());


// Listado de todos los clientes
ruta.get('/customers/', function(req, res) {
    let sql = "SELECT customerNumber, customerName, contactFirstName, city FROM customers ORDER BY customerNumber";
    conexion.query(sql, (err, rows) => {
       if (err) throw err;
       else {
           res.json(rows);
       }
    });
 });

// Obtener información del cliente junto con un arreglo de sus órdenes
ruta.get('/customers/:customerNumber/', function(req, res) {
    const customerNumber = req.params.customerNumber;

    // Consulta para obtener datos del cliente
    const customerQuery = `
        SELECT 
            customerNumber, 
            customerName, 
            contactFirstName, 
            phone, 
            city 
        FROM customers 
        WHERE customerNumber = ?
    `;

    // Consulta para obtener las órdenes del cliente
    const ordersQuery = `
        SELECT 
            o.orderNumber, 
            DATE_FORMAT(o.orderDate, '%d-%m-%Y') AS orderDate, 
            o.status, 
            SUM(od.quantityOrdered * od.priceEach) AS total 
        FROM orders o 
        JOIN orderdetails od ON o.orderNumber = od.orderNumber 
        WHERE o.customerNumber = ? 
        GROUP BY o.orderNumber, o.orderDate, o.status
        ORDER BY o.orderNumber
    `;

    // Ejecutar la consulta del cliente
    conexion.query(customerQuery, [customerNumber], (err, customerRows) => {
        if (err) {
            throw err;
        }

        // Verificar si el cliente existe
        if (customerRows.length === 0) {
            return res.status(404).json({
                mensaje: 'Cliente no encontrado',
                codigo: '02'
            });
        }

        const customerData = customerRows[0];

        // Ejecutar la consulta de órdenes para el cliente
        conexion.query(ordersQuery, [customerNumber], (err, ordersRows) => {
            if (err) {
                throw err;
            }

            // Formatear la respuesta JSON con la información del cliente y sus órdenes
            const result = {
                customerNumber: customerData.customerNumber,
                customerName: customerData.customerName,
                contactFirstName: customerData.contactFirstName,
                phone: customerData.phone,
                city: customerData.city,
                orders: ordersRows.map(order => ({
                    orderNumber: order.orderNumber,
                    orderDate: order.orderDate,
                    total: parseFloat(order.total), // Convertir total a número
                    status: order.status
                }))
            };

            // Responder con el JSON en el formato solicitado
            res.json(result);
        });
    });
});

module.exports = ruta;
