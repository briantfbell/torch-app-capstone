import React, { useEffect, useState } from "react";
import { Stack, Box, Dialog } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { tryLogin } from "../api/auth.js";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import { useAuth } from "../hooks/useAuth";

export default function SplashPage() {
  const url = "http://localhost:8080/";

  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const handleLoginState = () => {
    setIsLogin(!isLogin);
  };

  const [email, setEmail] = useState("");
  const handleEmailInput = (e) => {
    setEmail(e.target.value);
  };

  const [password, setPassword] = useState("");
  const handlePasswordInput = (e) => {
    setPassword(e.target.value);
  };

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

  const [registerOk, setRegisterOk] = useState(false);
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

      setRegisterError("");
      setIsLogin(true);
      setRegisterOk(true);
    } catch (err) {
      setRegisterError("Something went wrong, please try again!");
    }
  };

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

  const content = isLogin ? (
    <Stack sx={{ width: { xs: "100%", md: 320 }, maxWidth: 320, px: { xs: 2, md: 0 } }}>
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
  ) : (
    <Stack sx={{ width: { xs: "100%", md: 320 }, maxWidth: 320, px: { xs: 2, md: 0 } }}>
      <RegisterForm
        onSubmit={handleRegisterSubmit}
        error={registerError}
      />
      <p>Already have an account? Click here!</p>
      <Button variant="contained" onClick={() => handleLoginState()}>
        Return to Login
      </Button>
    <Dialog open={registerOk} onClose={() => setRegisterOk(false)}>
          <Box sx={{ p: 4, textAlign: "center" }}>
            <h2>Registration Successful!</h2>
            <p>You can now log in with your new account.</p>
            <Button variant="contained" onClick={() => setRegisterOk(false)}>
              Close
            </Button>
          </Box>
        </Dialog>
      </Stack>
  );

  return (
    <Stack
      sx={{
        position: "fixed",
        inset: 0,
        justifyContent: "space-between",
        alignItems: "center",
        py: 3,
        px: { xs: 2, md: 0 },
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", width: "100%", minHeight: 0 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          justifyContent="center"
          spacing={{ xs: 2, md: 12 }}
          sx={{ width: "100%" }}
        >
          <Box
            component="img"
            src="/artwork/splash_torch_logo.png"
            alt="TORCH"
            sx={{ maxWidth: { xs: 160, md: 450 }, maxHeight: "25vh", width: "100%", objectFit: "contain" }}
          />
          {content}
        </Stack>
      </Box>

      <Box
        component="img"
        src="/artwork/org_banner.png"
        alt="Dev Team"
        sx={{ maxWidth: "100%", maxHeight: "8vh", objectFit: "contain" }}
      />
    </Stack>
  );
}
