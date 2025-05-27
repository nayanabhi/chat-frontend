"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  Link,
} from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import apiRequest from "@/utils/apiCalls";
import { HttpMethod } from "@/utils/httpMethods";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {

      const response = await apiRequest({
        method: HttpMethod.POST,
        url: "/auth/register",
        data: { fullName, phone, email, password },
      });

      setSuccess("Account created successfully! You can now log in.");
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Signup failed. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#4d464c",
        boxShadow: "3",
        borderRadius: 2,
        // background: "linear-gradient(to right, #667eea, #764ba2)", // Full page gradient background
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 4, mt: 0 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Create an Account
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <Box component="form" onSubmit={handleSignup} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Full Name"
              type="text"
              variant="outlined"
              margin="normal"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Phone"
              type="phone"
              variant="outlined"
              margin="normal"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
              Sign Up
            </Button>
          </Box>

          {/* Login link */}
          <Box mt={2} display="flex" justifyContent="center">
            <Link href="/" variant="body2">
              Already have an account? Login
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
