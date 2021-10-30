import axios from 'axios';
import { Col, Container, Row } from 'react-bootstrap';
import './Invoice.css';
import InvoiceTab from './InvoiceTab';
import {useState} from 'react';
import { useHistory } from 'react-router';
import { useEffect } from 'react';


function Invoice() {
    const [invoices,setInvoices] = useState([]);

    const history = useHistory();
    const token = localStorage.getItem('token');
    if(!token) history.push('/login');

    useEffect( () => {
        const userId = localStorage.getItem('user_id')
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }
        axios.get(`http://localhost:5000/api/company/user/invoices/${userId}`,config)
        .then(res => {
            console.log(res.data.invoices)
            setInvoices(res.data.invoices)
        })
        .catch(err => {
            console.log(err);
        })
    },[])

    return (
        <div className="invoice-body">
            <Container>
                <Row>
                    <Col>Invoice ID</Col>
                    <Col>Amount</Col>
                    <Col>Payment Status</Col>
                    <Col>View/Download Receipt</Col>
                </Row>
                <div className="invoice-list">
                {invoices.map(item => <InvoiceTab {...item}/>)}
                </div>
            </Container>
        </div>
    )
}

export default Invoice
