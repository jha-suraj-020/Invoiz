const express = require('express');
const { createCompany, createProduct, createInvoice, getInvoice, getAllInvoices, getAllCompanies, getAllCreatedInvoices, getAllProducts } = require('../controllers/companyController.js');
const protect = require('../middleware/protect')

const router = express.Router()

router.post('/', protect, createCompany)
router.post('/product/:id', protect, createProduct)
router.post('/invoice/:id', protect, createInvoice)
router.get('/invoice/:id', getInvoice) 

router.get('/:id', protect, getAllCompanies)
router.get('/user/invoices/:id', protect, getAllInvoices) 
router.get('/user/createdInvoices/:name', protect, getAllCreatedInvoices) 
router.get('/products/:id', protect, getAllProducts) 

module.exports = router