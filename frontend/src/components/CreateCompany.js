import Axios from 'axios';
import { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useHistory } from 'react-router';
import './CreateCompany.css';

function CreateCompany(props) {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [number, setNumber] = useState('');
    const [img, setImg] = useState(null);

    const history = useHistory();
    const token = localStorage.getItem('token');
    if(!token) history.push('/login');

    const submitHandler = (e) => {
        e.preventDefault();
        console.log(name);
        console.log(address);
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('address', address);
        formData.append('paidToEmail', email);
        formData.append('paidToNo', number);
        formData.append('image', img);

        Axios.post(
            "http://localhost:5000/api/company",
            formData,
            config
        )
        .then((res)=>{
            console.log(res.data);
        })
        .then(err=>{
            console.log(err);
        })
    }

    return (
        <div className="create-company">
            <Container>
                <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Control type="text" onChange={e => setName(e.target.value)} placeholder="COMPANY NAME" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control type="text" onChange={e => setAddress(e.target.value)} placeholder="ADDRESS" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control type="text" onChange={e => setEmail(e.target.value)} placeholder="COMPANY EMAIL" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control type="text" onChange={e => setNumber(e.target.value)} placeholder="COMPANY NUMBER" />
                    </Form.Group>
                    <Form.Group className="position-relative mb-3">
                        <Form.Label>Company Logo</Form.Label>
                        <Form.Control
                        type="file"
                        required
                        name="file"
                        onChange={e=> setImg(e.target.files[0])} />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Container>
        </div>
    )
}

export default CreateCompany
