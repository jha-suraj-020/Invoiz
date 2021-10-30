import Axios from 'axios';
import { Container,  Row, Button, Form } from 'react-bootstrap'
import ProdCard from './ProdCard';
import {useEffect, useState} from 'react';
import axios from 'axios';

function ListProducts(props) {
    //Extract the products list
    const company_id= props.match.params.id;
    const [name,setName]=useState();
    const [price,setPrice] =useState();
    const [data,setData] = useState([]);
    const token = localStorage.getItem('token');


    //Add a SubmitHandler
    const submitHandler = (e) => {
        e.preventDefault();
        console.log("new product added");

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }
        Axios.post(
            `http://localhost:5000/api/company/product/${company_id}`,
            {name:name,price:price},config
        )
        .then((res)=>{
            console.log(res.data);
        })
        .catch(err=>{
            console.log(err);
        })
    }

    useEffect( () => {
        console.log(company_id)

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
    },[data])


    return (
        <div>
            <Container>
                <Row>
               {data.map(item => <ProdCard {...item}/>)}
                </Row>
                <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Product Name" onChange={e=>setName(e.target.value)}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="text" placeholder="Product Price"onChange={e=>setPrice(e.target.value)} />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Add New Product
                    </Button>
                </Form>
            </Container>
        </div>
    )
}

export default ListProducts
