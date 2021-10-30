import React,{useEffect, useState} from 'react';


const AuthContext = React.createContext({
    token: '',
    name: '',
    userID: '',
    isLoggedIn: false,
    login: () => {

    },
    logout: () => {

    }
})

export const AuthContextProvider = (props) =>{
    let initialToken, userName, userId;
    if(typeof window !== 'undefined'){
        initialToken = window.localStorage.getItem('token');
        userName = window.localStorage.getItem('name');
        userId = window.localStorage.getItem('userId')
    }

    const [token, setToken] = useState(initialToken);
    const [name, setName] = useState(userName);
    const [userID, setuserID] = useState(userId);


    const userIsLoggedIn = !!token;

    const loginHandler = (userData) => {
        setToken(userData.token);
        setName(userData.firstName)
        setuserID(userData.id)

        console.log(userData)

        if(typeof window !== 'undefined'){
            window.localStorage.setItem('token',token);
            window.localStorage.setItem('name',name);
            window.localStorage.setItem('userId',userID);
        }
    }

    const logoutHandler = () => {
        setToken(null)
        setName(null)
        setuserID(null)
        if(typeof window !== 'undefined'){
            window.localStorage.clear();
        }
    }

    const contextValue = {
        token: token,
        name: name,
        userID: userID,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler
    }

    return (
        <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>
    )
}

export default AuthContext;