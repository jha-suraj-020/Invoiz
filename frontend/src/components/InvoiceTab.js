import { Button, Col, Row } from "react-bootstrap"
import './InvoiceTab.css'
import { useHistory } from 'react-router';
import { Link } from "react-router-dom";
import axios from "axios";

function InvoiceTab(item) {
    const history = useHistory();
    const token = localStorage.getItem('token');
    if(!token) history.push('/login');

    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement('script')
            script.src = src
            script.onload = () => {
                resolve(true)
            }
            script.onerror = () => {
                resolve(false)
            }
            document.body.appendChild(script)
        })
    }
    async function displayRazorpay() {
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?')
            return
        }

        const data = await fetch('http://localhost:5000/razorpay', { method: 'POST' }).then((t) =>
            t.json()
        )

        const options = {
            key: 'rzp_test_fojLAXlUSy8SKB',
            currency: data.currency,
            amount: data.amount.toString(),
            order_id: data.id,
            name: 'Donation',
            description: 'Thank you for nothing. Please give us some money',
            image: 'http://localhost:5000/lg.png',
            handler: function (response) {
                alert(response.razorpay_payment_id)
                alert(response.razorpay_order_id)
                alert(response.razorpay_signature)
            },
            prefill: {
                name: "Subramanya G",
                email: 'subramanyag9112@gmail.com',
                phone_number: '+91-9482117332'
            }
        }
        const paymentObject = new window.Razorpay(options)
        paymentObject.open()
    }

    const handleClick = (e) => {
        displayRazorpay();
    }


    return (
        <div>
            <Row className="invoice-list">
                <Col>{item._id}</Col>
                <Col>{item.amount}</Col>
                <Col>
                    <Button onClick={handleClick} disabled={item.isPaid}>{item.isPaid ? 'Paid' : 'Pay'}</Button></Col>
                <Col><a href={'http://localhost:5000/api/company/invoice/'+item._id}>Download</a></Col>
            </Row>
        </div>
    )
}

export default InvoiceTab
