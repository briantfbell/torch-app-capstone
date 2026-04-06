import React from 'react'
import { useState, useEffect, useContext } from 'react'
import {useNavigate} from 'react-router-dom'
import Button from '@mui/material/Button'
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm'

export default function SplashPage() {
    //Navigation
    const navigate = useNavigate()

    //Login state
    const [isLogin, setIsLogin] = useState(true);
    const handleLoginState = () => {
        setIsLogin(!isLogin)
    }

    //Username input
    const [username, setUsername] = useState('')
    const handleUsernameInput = (e) => {
        setUsername(e.target.value)
    }
    //Password input
    const [password, setPassword] = useState('')
    const handlePasswordInput = (e) => {
        setPassword(e.target.value)
    }

    //Submission handling
    const handleLoginSubmit = async (e) => {
        e.preventDefault()

        //Login submission, tokens, context, navigate to next page, etc
    }
    const handleRegistrSubmit = async (e) => {
        e.preventDefault()

        //Registration, context, send to back end, return to login page
    }


    if(isLogin) {
        return (
            <div className='loginContainer'>
                <LoginForm
                    handleSubmit={handleLoginSubmit}
                    handleUsernameInput={handleUsernameInput}
                    handlePasswordInput={handlePasswordInput}
                    username={username}
                    password={password}
                />
                <p>Need an account? Click here!</p>
                <Button variant='contained' onClick = {() => handleLoginState()}>Register</Button>
            </div>
        )
    }
    else if(!isLogin) {
        return (
            <div className='registerContainer'>
                <RegisterForm

                />
                <p>Already have an account? Click here!</p>
                <Button variant='contained' onClick = {() => handleLoginState()}>Return to Login</Button>
            </div>
        )
    }
    
}
