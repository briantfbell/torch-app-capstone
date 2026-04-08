import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tryLogin } from '../api/auth.js';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

export default function SplashPage() {
  const url = 'http://localhost:8080/';
  //Navigation
  const navigate = useNavigate();

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
  const handleLoginSubmit = async e => {
    e.preventDefault();
    await tryLogin(email, password);
    //Login submission, tokens, context, navigate to next page, etc
  };

  const [registerError, setRegisterError] = useState('');
  const handleRegisterSubmit = async data => {
    console.log(data);
    try {
      const res = await fetch(`${url}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setRegisterError(result.message || result.error);
      }

      //If success, go back to login
      setRegisterError('');
      setIsLogin(true);
    } catch (err) {
      setRegisterError('Something went wrong, please try again!');
    }
  };

  if (isLogin) {
    return (
      <div className="loginContainer">
        <Stack sx={{ width: 320, justifySelf: 'center' }}>
          <LoginForm
            handleLoginSubmit={handleLoginSubmit}
            handleEmailInput={handleEmailInput}
            handlePasswordInput={handlePasswordInput}
            email={email}
            password={password}
          />
          <p>Need an account?</p>
          <Button variant="contained" onClick={() => handleLoginState()}>
            Register
          </Button>
        </Stack>
      </div>
    );
  } else if (!isLogin) {
    return (
      <div className="registerContainer">
        <RegisterForm onSubmit={handleRegisterSubmit} error={registerError} />
        <p>Already have an account? Click here!</p>
        <Button variant="contained" onClick={() => handleLoginState()}>
          Return to Login
        </Button>
      </div>
    );
  }
}
