import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tryLogin } from '../api/auth.js';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import {Stack} from '@mui/material';
import {tryLogin} from '../api/auth.js';
import { useAuth } from '../hooks/useAuth';

export default function SplashPage() {
    const url = 'http://localhost:8080/';

    //Navigation
    const navigate = useNavigate()
    const { refreshUser } = useAuth()


  //Login state
  const [isLogin, setIsLogin] = useState(true);
  const handleLoginState = () => {
    setIsLogin(!isLogin);
  };

  //Username input
  const [email, setEmail] = useState('');
  const handleEmailInput = e => {
    setEmail(e.target.value);
  };
  //Password input
  const [password, setPassword] = useState('');
  const handlePasswordInput = e => {
    setPassword(e.target.value);
  };

    //Submission handling
    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        const result = await tryLogin(email, password)

        if(result?.token) {
            await refreshUser()
            navigate('/dashboard')
        } else {
            alert(result.message || 'Login failed, do it again.')
        }
        
    }

    const [registerError, setRegisterError] = useState('')
    const handleRegisterSubmit = async (data) => {
        try{
            const res = await fetch(`${url}auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            const result = await res.json()

            if (!res.ok){
                return setRegisterError(result.message || 'Registration failed, try again. (Check your inputs)')
            }

            //If success, go back to login
            setRegisterError('')
            setIsLogin(true)
        }catch(err){
            setRegisterError('Something went wrong, please try again!')
        }

    }

    //Check if user, if they are a user, kick them to the dashboard
    const {user, loading} = useAuth()
    useEffect(() => {
        if (user) {
            navigate('/dashboard')
        }
    }, [user, navigate])
    if (loading) {
        return <div>Loading...</div>
    }
    if(user) {
        return null;
    }

 

    if(isLogin) {
        return (
            <div className='loginContainer'>
                <Stack sx={{width:320, justifySelf: 'center'}}>
                    <LoginForm
                        handleLoginSubmit={handleLoginSubmit}
                        handleEmailInput={handleEmailInput}
                        handlePasswordInput={handlePasswordInput}
                        email={email}
                        password={password}
                    />
                    <p>Need an account?</p>
                    <Button variant='contained' onClick = {() => handleLoginState()}>Register</Button>
                </Stack>
            </div>
        )
    }
    else if(!isLogin) {
        return (
            <div className='registerContainer'>
                <Stack sx={{justifySelf: 'center'}}>
                <RegisterForm
                    onSubmit={handleRegisterSubmit}
                    error={registerError}
                />
                <p>Already have an account? Click here!</p>
                <Button variant='contained' onClick = {() => handleLoginState()}>Return to Login</Button>
                </Stack>
            </div>
        )
    }
    
}
