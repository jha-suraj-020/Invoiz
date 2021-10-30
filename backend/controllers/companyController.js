const fs = require('fs');
const pdf = require('pdf-creator-node');
const path = require('path');
const asyncHandler = require('express-async-handler');
const Company = require('./../models/company.js');
const Product = require('./../models/product.js');
const Invoice = require('./../models/invoice.js');
const User = require('./../models/user.js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const shortid = require('shortid')
const Razorpay = require('razorpay')

const createCompany = asyncHandler(async (req, res) => {
    const logo = req.file;
    const { name, address, paidToEmail, paidToNo } = req.body;

    console.log(req.file, req.body);

    const logoPath = logo.filename;

    if(!logo){
        res.status(400)
        throw new Error ("Image not selected")
    }

    const company = await Company.create({
        name: name,
        address: address,
        paidToEmail: paidToEmail,
        paidToNo: paidToNo,
        logoAddress: logoPath,
        handler: req.user._id
    })

    if(company) {
        res.status(201).json({
            result: "Created Successfully"
        })
    } else {
        res.status(400)
        throw new Error ('Invalid company data')
    }
})

const createProduct = asyncHandler(async (req, res) => {
    const { name, price } = req.body;

    console.log(req.body);

    const product = await Product.create({
        name: name,
        price: price,
        company: req.params.id
    })

    if(product) {
        res.status(201).json({
            result: "Created Successfully"
        })
    } else {
        res.status(400)
        throw new Error ('Invalid company data')
    }
})

function createLink(amount, name, contact, email, desc, shortId) {
    fetch("https://api.razorpay.com/v1/payment_links/", {
        body: JSON.stringify({
            "upi_link": "true",
            "amount": amount*100,
            "currency": "INR",
            "accept_partial": false,
            "expire_by": 1691097057,
            "reference_id": shortId,
            "description": desc,
            "customer": {
                "name": name,
                "contact": contact,
                "email": email
            },
            "notify": {
                "sms": true,
                "email": true
            },
            "reminder_enable": true,
            "notes": {
                "policy_name": "Jeevan Bima"
            },
        }),
        headers: {
            "Authorization": 'Basic cnpwX2xpdmVfeUlBWlk2VG5iZk9TV0M6d2ZmNGlCT0I4ZGp2YXZnNEJtQ3U5cVFq',
            "Content-Type": "application/json"
        },
        method: "POST"
    })
        // .then(res => res.json())
        // .then(resp => {
        //     res.json({ message: resp });
        // });
}

const createInvoice = asyncHandler(async (req, res) => {
    const options = {
        formate: 'A3',
        orientation: 'portrait',
        border: '2mm',
        header: {
            height: '15mm',
            contents: '<h4 style=" color: red;font-size:20;font-weight:800;text-align:center;">CUSTOMER INVOICE</h4>'
        },
        footer: {
            height: '20mm',
            contents: {
                first: 'Cover page',
                2: 'Second page',
                default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', 
                last: 'Last Page'
            }
        }
    }

    const { clientName, email, mobileNo, data, clientAddress } = req.body;

    // console.log(data, req.body)
    // res.send(data)

    const html = fs.readFileSync(path.join(__dirname, '../template.html'), 'utf-8');
    const filename = Math.random() + '_doc' + '.pdf';
    let array = [];

    const company = await Company.findById(req.params.id)
    let logoURL 

    if(company){
        logoURL = 'http://localhost:5000/' + company.logoAddress
        console.log(logoURL)
    } else {
        res.status(404)
        throw new Error('Company not found')
    }

    // const logoURL = 'http://localhost:5000/' + 'lg.png';

    data.forEach(d => {
        const prod = {
            name: d.name,
            quantity: d.quantity,
            price: d.price,
            total: d.quantity * d.price
        }
        array.push(prod);
    });

    let subtotal = 0;
    array.forEach(i => {
        subtotal += i.total
    });
    const tax = (subtotal * 20) / 100;
    const grandtotal = subtotal + tax;
    const obj = {
        prodlist: array,
        subtotal: subtotal,
        tax: tax,
        gtotal: grandtotal,
        logoURL: logoURL,
        clientName: clientName,
        email: email,
        clientAddress: clientAddress,
        mobileNo: mobileNo,
        companyName: company.name,
        companyAddress: company.address,
        date: Date.now().toString()
    }
    const document = {
        html: html,
        data: {
            products: obj
        },
        path: './docs/' + filename
    }
    pdf.create(document, options)
        .then(res => {
            console.log(res);
        }).catch(error => {
            console.log(error);
        })


    const srtid = shortid.generate();
    const invoice = await Invoice.create({
        from: company.name,
        to: email,
        amount: grandtotal,
        isPaid: false,
        shortId: srtid,
        paidToEmail: company.paidToEmail,
        paidToNo: company.paidToNo,
        clientAddress: clientAddress,
        invoiceAddress: filename
    })

    const desc = "payment for current invoice";

    if(invoice){
        createLink(grandtotal, clientName, mobileNo, email, desc, srtid)

        const invoices = await Invoice.find({ to: email, isPaid:false })

        let total = 0;
        invoices.forEach(i => {
            total += i.amount;
        });

        console.log(total);

        const desc2 = "payment for your all unpaid invoices";
        createLink(total, clientName, mobileNo, email, desc2)

        // const user = await User.find({ email: email })
        // if(user){
        //     const str = `An invoice with invoice id: ${invoice._id} is created by ${company.name}`;

        //     user.notifications.push(str);
        //     await user.save();
        //     console.log(user)
        // } 

        res.status(201).json({
            result: grandtotal
        })
    } else {
        res.status(404)
        throw new Error('Invoice not created')
    }
})

const getInvoice = asyncHandler(async (req, res) => {
    const invoice = await Invoice.findById(req.params.id)

    if(!invoice){
        res.status(404)
        throw new Error('Invoice not found')
    }

    // const filePath = 'http://localhost:5000/docs/' + invoice.invoiceAddress;

    const invoicePath = path.join('docs', invoice.invoiceAddress);

    const file = fs.createReadStream(invoicePath);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
    'Content-Disposition',
    'attachment;'
    );
    file.pipe(res);
})

const getAllInvoices = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    const invoices = await Invoice.find({ to: user.email })

    if(invoices){
        res.status('200').json({
            invoices: invoices
        })
    } else {
        res.status(404)
        throw new Error('Invoice not found')
    }
})

const getAllCompanies = asyncHandler(async (req, res) => {
    const company = await Company.find({ handler: req.params.id })

    if(company){
        res.status('200').json({
            company: company
        })
    } else {
        res.status(404)
        throw new Error('company not found')
    }
})

const getAllCreatedInvoices = asyncHandler(async (req, res) => {
    const invoices = await Invoice.find({ from: req.params.name })

    if(invoices){
        res.status('200').json({
            invoices: invoices
        })
    } else {
        res.status(404)
        throw new Error('invoices not found')
    }
})

const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ company: req.params.id })

    if(products){
        res.status('200').json({
            products: products
        })
    } else {
        res.status(404)
        throw new Error('products not found')
    }
})

module.exports = {
    createCompany,
    createProduct,
    createInvoice,
    getInvoice,
    getAllInvoices,
    getAllCompanies,
    getAllCreatedInvoices,
    getAllProducts
}