import React, { useEffect } from 'react'
import { Container, Row, Col, ListGroup, Accordion} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import axios from 'axios';
import './Company.css'
import { useHistory } from 'react-router';
import {useState} from 'react';

function Company() {
    const [companyList, setCompanyList] = useState([]);
    const history = useHistory();
    const token = localStorage.getItem('token');
    // const[companyid,setCompanyId] = useState();
    if(!token) history.push('/login');

    useEffect( () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('user_id');
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }
        axios.get(`http://localhost:5000/api/company/${userId}`,config)
        .then(res => {
            console.log(res.data.company)
            setCompanyList(res.data.company)

        })
        .catch(err => {
            console.log(err);
        })
    },[])


    const handleClick = (e)=>{
        history.push('/createinvoice')
    }

    return (
        <div className="company">
                <Accordion className="">
                    {
                        companyList.map(company=>
                            <Accordion.Item eventKey={company._id}>
                                <Accordion.Header>{company.name}</Accordion.Header>
                                    <Accordion.Body>
                                        <Row>
                                            <Col>
                                                <Link to={{
                                                    pathname: `/listprod/${company._id}`
                                                }}>
                                                    List Prod
                                                </Link>
                                            </Col>
                                            <Col>
                                                <Link to={{
                                                    pathname:`/createdInvoice/${company.name}`
                                                }}>
                                                    Company Invoices
                                                </Link>
                                            </Col>
                                            <Col>
                                                <Link to={{
                                                    pathname:`/createinvoice/${company._id}`
                                                }}>
                                                    Create Invoice
                                                </Link>
                                            </Col>
                                        </Row>
                                    </Accordion.Body>
                            </Accordion.Item>
                    )}
                </Accordion>

        </div>
    )
}

export default Company
