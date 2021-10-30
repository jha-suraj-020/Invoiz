import React, { useState} from 'react'
import { Container, Form , Button, Dropdown,  Col, Row} from 'react-bootstrap';
// import { Multiselect } from 'multiselect-react-dropdown';
import axios from 'axios';
import './createInvoice.css'
import { useHistory } from 'react-router';
import { useEffect } from 'react';
import { findRenderedComponentWithType } from 'react-dom/test-utils';

// const data = [
//     {
//         name: "abc",
//         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod ullam repudiandae provident, deleniti ratione ipsum sunt porro deserunt",
//         unit:"pack",
//         quantity: 2,
//         price: 20,
//         imgurl: "https://micro-cdn.sumo.com/image-resize/sumo-convert?uri=https://media.sumo.com/storyimages/ef624259-6815-44e2-b905-580f927bd608&hash=aa79d9187ddde664f8b3060254f1a5d57655a3340145e011b5b5ad697addb9c0&format=webp"
//     },
//     {
//         name: "abd",
//         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod ullam repudiandae provident, deleniti ratione ipsum sunt porro deserunt",
//         unit:"pack",
//         quantity: 4,
//         price: 80,
//         imgurl: "https://micro-cdn.sumo.com/image-resize/sumo-convert?uri=https://media.sumo.com/storyimages/ef624259-6815-44e2-b905-580f927bd608&hash=aa79d9187ddde664f8b3060254f1a5d57655a3340145e011b5b5ad697addb9c0&format=webp"
//     },
//     {
//         name: "adc",
//         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod ullam repudiandae provident, deleniti ratione ipsum sunt porro deserunt",
//         unit:"pack",
//         quantity: 3,
//         price: 60,
//         imgurl: "https://micro-cdn.sumo.com/image-resize/sumo-convert?uri=https://media.sumo.com/storyimages/ef624259-6815-44e2-b905-580f927bd608&hash=aa79d9187ddde664f8b3060254f1a5d57655a3340145e011b5b5ad697addb9c0&format=webp"
//     },
// ]

function CreateInvoice(props) {

    const company_id= props.match.params.id;
    const [customerName, setCustomerName] = useState('');
    const [customerAddress, setCustomerAddress] = useState('')
    const [customerNumber, setCustomerNumber] = useState('')
    const [data,setData] = useState([]);

    const [name, setName] = useState('');
    const [foundName, setFoundName] = useState(data);
    const [product,setProduct] = useState({
        prodName: '',
        price: 0,
        quantity: 0
    });

    const [list, setList] = useState([]);
    const [email, setEmail] = useState('');

    const history = useHistory();
    const token = localStorage.getItem('token');
    if(!token) history.push('/login');

    // Filtering the search
    const filter = (e) => {
        const keyword = e.target.value;
        if (keyword !== '') {
            const results = data.filter((name) => {
                return name.name.toLowerCase().startsWith(keyword.toLowerCase());
            });
            setFoundName(results);
        }
        else{
            setFoundName([]);
        }
        setName(keyword);
    };

    // For fetching data from backend
    useEffect(() => {

        const userId = localStorage.getItem('userId')
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }
        axios.get(`http://localhost:5000/api/company/products/${company_id}`,config)
        .then(res => {
            console.log(res.data.products)
            setData(res.data.products)
        })
        .catch(err => {
            console.log(err);
        })
    }, []);

    const findPrice = (prodName) => {
        const found = data.find(prod=> prod.name === prodName);
        return found.price
    }

    const handleSelect = (e) => {
        setProduct({
            ...product,
            prodName: e.target.innerHTML,
            price: findPrice(e.target.innerHTML)
        })
        setFoundName([]);
        setName(e.target.innerHTML);
    }


    const addItem = () => {
        const newList = list;
        newList.push(product);
        setList(newList);
        setName("")
        setFoundName([]);
        console.log(newList)
    }

    //Posting the list
    const submitHandler = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }
        axios.post(
            `http://localhost:5000/api/company/invoice/${company_id}`,
            JSON.stringify({
                clientName: customerName,
                email: email,
                mobileNo: customerNumber,
                data: list,
                clientAddress: customerAddress
            })
            ,config
        )
        .then((res)=>{
            console.log(res.data);

        })
        .catch(err=>{
            console.log(err);
        })
    }

    return (
        <div className="createInvoice">
            <Container>
                <Form onSubmit={submitHandler}>
                    <Row className="g-2">
                        <Col xs={8}>
                            <Form.Group className="mb-3">
                                <Form.Control type="text" placeholder="Product Name" value={name} onChange={filter}/>
                            </Form.Group>
                            <Dropdown.Menu show={name.length}>
                            {foundName.map (item =>
                                    <div>
                                        <Dropdown.Item eventKey={item.id} onClick={handleSelect}>
                                            {item.name}
                                        </Dropdown.Item>
                                    </div>
                            )}
                            </Dropdown.Menu>

                            {list.map(item =>  <Row>
                                <Col>{item.prodName}</Col>
                                <Col>{item.price}</Col>
                                <Col>{item.quantity}</Col>
                                </Row>)}
                            <Form.Group className="mb-3" >
                                <Form.Control type="text" placeholder="Client Name" onChange={e=>setCustomerName(e.target.value)}/>
                            </Form.Group>
                            <Form.Group className="mb-3" >
                                <Form.Control type="text" placeholder="Mobile Number" onChange={e=>setCustomerNumber(e.target.value)}/>
                            </Form.Group>
                            <Form.Group className="mb-3" >
                                <Form.Control type="text" placeholder="Client Address"  onChange={e=>setCustomerAddress(e.target.value)}/>
                            </Form.Group>

                        </Col>
                        <Col >
                            <Form.Control type="number" placeholder="Quantity" value={product.quantity} onChange={e=>setProduct({...product, quantity: e.target.value})}/>
                        </Col>
                        <Col>
                            <Button onClick={addItem}>Add</Button>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Recepient's Email</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" onChange={e=>setEmail(e.target.value)}/>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Container>
        </div>
    )
}

export default CreateInvoice
