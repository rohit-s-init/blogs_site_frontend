import { useState, useContext } from "react";
import styles from "./login.module.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/UserContext";
import { login } from "../services/authservices";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const isValid = email.trim() !== "" && password.trim() !== "";

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {

      const data = await login(email,password);

      if (data.status) {
        updateUser(data.user);     // update global auth state
        navigate("/");      // redirect
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2>Log in</h2>

        <input
          type="text"
          placeholder="Email or Username"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className={styles.passwordWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className={styles.toggle}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button
          className={`${styles.loginBtn} ${
            !isValid ? styles.disabled : ""
          }`}
          disabled={!isValid || loading}
          onClick={handleLogin}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        <div className={styles.divider}>
          <span>OR</span>
        </div>

        <button className={styles.googleBtn}>
          Continue with Google
        </button>

        <p className={styles.footerText}>
          New to Reddit?{" "}
          <span onClick={() => navigate("/signin")}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;