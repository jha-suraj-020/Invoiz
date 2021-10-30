import React,{useState} from "react";
import './Signup.css';
import axios from 'axios';
import { Button, Container, Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";

function Signup() {
    const [fname,setFname] = useState();
    const [lname,setLname] = useState();
    const [address,setAddress] = useState();
    const [email,setEmail] = useState();
    const [password,setPassword] = useState();
    let history = useHistory();

    const handleSubmit=(e)=>{
        e.preventDefault();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                //  Authorization: `Bearer ${token}`,
            }
        }
        axios.post("http://localhost:5000/api/users/",{
            firstName:fname,lastName:lname,address:address,email:email,password:password,
        },config).then((response)=>{
            console.log(response);
            if(response.status===201){
                history.push('/login');
            }
        });
    };



    return (
        <Container className="signup">
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" placeholder="First Name" onChange={e=>setFname(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" placeholder="Last Name" onChange={e=>setLname(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="text" as="textarea" rows="3" placeholder="Address" onChange={e=>setAddress(e.target.value)}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" onChange={e=>setEmail(e.target.value)}/>
                    <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)}/>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </Container>
    );
}

export default Signup;