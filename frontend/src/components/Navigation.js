import {useState,useEffect, useContext} from 'react'
import {Link, NavLink} from 'react-router-dom'
import { Button } from 'react-bootstrap'
import './Navigation.css'
import { useHistory } from 'react-router';
import AuthContext from '../store/AuthContext';


function Navigation() {
    const context = useContext(AuthContext);
    const history = useHistory();
    const [check,setCheck] = useState();
    const isLoggedIn = context.isLoggedIn

    const signoutHandler = (e) => {
        context.logout();
        history.push('/login');
    }

    return (
        <div>
            <nav className="header">
                <Link to='/'>
                    <div className="logo">Invoiz</div>
                </Link>
                    <ul>
                        <li>
                            <Link to='/invoice'>Invoices</Link>
                        </li>
                        <li>
                            <Link to='/createcompany'>Create Company</Link>
                        </li>
                        <li>
                            <Link to='/company'>Your Companies</Link>
                        </li>
                        {
                            isLoggedIn?(
                                <li>
                                    <Button onClick={signoutHandler}>Sign out</Button>
                                </li>
                            ):(
                                <>
                                <li>
                                    <Link to='/login'>Login</Link>
                                </li>
                                <li>
                                    <Link to='/signup'>Signup</Link>
                                </li>
                                </>
                            )
                        }


                    </ul>
            </nav>
        </div>
    )
}

export default Navigation
