import React, { useEffect, useState } from "react";
import { Stack, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { tryLogin } from "../api/auth.js";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import { useAuth } from "../hooks/useAuth";

export default function SplashPage() {
  const url = "http://localhost:8080/";

  //Navigation
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  //Login state
  const [isLogin, setIsLogin] = useState(true);
  const handleLoginState = () => {
    setIsLogin(!isLogin);
  };

  //Username input
  const [email, setEmail] = useState("");
  const handleEmailInput = (e) => {
    setEmail(e.target.value);
  };
  //Password input
  const [password, setPassword] = useState("");
  const handlePasswordInput = (e) => {
    setPassword(e.target.value);
  };

  //Submission handling
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const result = await tryLogin(email, password);

    if (result?.token) {
      await refreshUser();
      navigate("/dashboard");
    } else {
      alert(result.message || "Login failed, do it again.");
    }
  };

  const [registerError, setRegisterError] = useState("");
  const handleRegisterSubmit = async (data) => {
    try {
      const res = await fetch(`${url}auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        return setRegisterError(
          result.message ||
            "Registration failed, try again. (Check your inputs)",
        );
      }

      //If success, go back to login
      setRegisterError("");
      setIsLogin(true);
    } catch (err) {
      setRegisterError("Something went wrong, please try again!");
    }
  };

  //Check if user, if they are a user, kick them to the dashboard
  const { user, loading } = useAuth();
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (user) {
    return null;
  }

  if (isLogin) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          minHeight: "100vh",
          width: "100%",
          position: "relative",
          pb: 8,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          //   Spacing between the TORCH logo and registration content
          spacing={12}
        >
          {/* Left side - TORCH logo */}
          <Box
            component="img"
            src="/artwork/splash_torch_logo.png"
            alt="TORCH"
            sx={{ maxWidth: 450, width: "100%", objectFit: "contain" }}
          />

          {/* Right side - Login form */}
          <Stack sx={{ width: 320 }}>
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
        </Stack>

        {/* Bottom centered - org logos */}
        <Box
          component="img"
          src="/artwork/org_banner.png"
          alt="Dev Team"
          sx={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            height: 70,
            objectFit: "contain",
          }}
        />
      </Stack>
    );
  } else if (!isLogin) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          minHeight: "100vh",
          width: "100%",
          position: "relative",
          pb: 8,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={12}
        >
          {/* Left side - TORCH logo */}
          <Box
            component="img"
            src="/artwork/splash_torch_logo.png"
            alt="TORCH"
            sx={{ maxWidth: 450, width: "100%", objectFit: "contain" }}
          />

          {/* Right side - Register form */}
          <Stack sx={{ width: 320 }}>
            <RegisterForm
              onSubmit={handleRegisterSubmit}
              error={registerError}
            />
            <p>Already have an account? Click here!</p>
            <Button variant="contained" onClick={() => handleLoginState()}>
              Return to Login
            </Button>
          </Stack>
        </Stack>

        {/* Bottom centered - org logos */}
        <Box
          component="img"
          src="/artwork/org_banner.png"
          alt="Dev Team"
          sx={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            height: 70,
            objectFit: "contain",
          }}
        />
      </Stack>
    );
  }
}
