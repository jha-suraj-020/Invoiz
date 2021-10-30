import React,{useContext, useState} from "react";
import './Login.css';
import axios from "axios";
import { Form,Button, Container } from "react-bootstrap";
import { useHistory} from 'react-router-dom';
import AuthContext from '../store/AuthContext';


function Login() {
    const context = useContext(AuthContext);
    const [email,setEmail] = useState();
    const [password,setPassword] = useState();
    const [user,setUser] = useState(null);

    // useEffect(()=>{
    //     console.log(email);
    // },[email]);
    let history = useHistory();

    const handleSubmit=(e)=>{
        e.preventDefault();
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        axios.post(
            "http://localhost:5000/api/users/login",
            {
                email: email, password: password
            },
            config
        )
        .then((res)=>{
            // console.log(res.data);
            context.login(res.data);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user_id',res.data._id);
            localStorage.setItem('name', res.data.firstName);
            if(res.status===200){
                history.push('/');
            }
        })
        .catch(err=>{
            console.log(err);
        })
    };

    return (
        <div className="login">
            <Container fluid>
                <Form onSubmit={handleSubmit}>
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
                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Remember me" />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Login
                    </Button>
                </Form>
            </Container>
        </div>
    );
}

export default Login;