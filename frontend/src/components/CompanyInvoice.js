import axios from 'axios';
import { Col, Container, Row } from 'react-bootstrap';
import './Invoice.css';
import InvoiceTab from './InvoiceTab';
import {useState} from 'react';
import { useHistory } from 'react-router';
import { useEffect } from 'react';


function Invoice(props) {
    const [invoices,setInvoices] = useState([]);
    const name= props.match.params.name;
    const history = useHistory();
    const token = localStorage.getItem('token');
    if(!token) history.push('/login');
    console.log(name);
    useEffect( () => {

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }
        axios.get(`http://localhost:5000/api/company/user/createdInvoices/${name}`,config)
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
