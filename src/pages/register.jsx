import { useState, useEffect, useRef, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./register.module.css";
import { AuthContext } from "../context/UserContext";
import { registerUser, resendOtp, verifyUser } from "../services/authservices";

function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [registerError, setRegisterError] = useState("");

  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const otpInputs = useRef([]);

  const { user, updateUser } = useContext(AuthContext);

  const passwordsMatch = password === confirmPassword;
  const isValid = useMemo(() => (
    username.trim() !== "" &&
    email.trim() !== "" &&
    password.trim() !== "" &&
    passwordsMatch)
    , [username, email, password, passwordsMatch]
  )

  /* ================= REGISTER ================= */
  const handleRegister = async () => {
    setRegisterError("");

    // const res = await fetch("http://localhost:3000/api/auth/register", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   credentials: "include",
    //   body: JSON.stringify({ username, email, password }),
    // });

    const payload = { username, email, password }
    const data = await registerUser(payload);

    // const data = await res.json();

    if (data.status) {
      setShowOtpModal(true);
      startTimer();
    } else {
      setRegisterError(data.message);
    }
  };

  /* ================= TIMER ================= */
  const startTimer = () => {
    setTimer(60);
    setCanResend(false);
  };

  useEffect(() => {
    if (!showOtpModal) return;

    if (timer === 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, showOtpModal]);

  /* ================= OTP INPUT ================= */
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && otpInputs.current[index + 1]) {
      otpInputs.current[index + 1].focus();
    }
  };

  /* ================= VERIFY OTP ================= */
  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join("");

    // const res = await fetch("http://localhost:3000/api/auth/verify-otp", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   credentials: "include",
    //   body: JSON.stringify({ email, otp: enteredOtp }),
    // });

    const payload = { email, otp: enteredOtp };
    const res = await verifyUser(payload);

    const data = await res.json();

    if (data.status) {
      localStorage.setItem("token", data.token);
      updateUser(data.user);
      navigate("/");
    } else {
      setOtpError(data.message);
    }
  };

  /* ================= RESEND ================= */
  const handleResend = async () => {
    // await fetch("/api/auth/resend-otp", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ email }),
    // });
    await resendOtp(email);

    setOtpError("OTP resent");
    startTimer();
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2>Sign Up</h2>

        <input
          type="text"
          placeholder="Username"
          className={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
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
        </div>

        <div className={styles.passwordWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <span
            className={styles.toggle}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        {!passwordsMatch && confirmPassword !== "" && (
          <p className={styles.error}>Passwords do not match</p>
        )}

        {registerError && (
          <p className={styles.error}>{registerError}</p>
        )}

        <button
          className={`${styles.signupBtn} ${!isValid ? styles.disabled : ""
            }`}
          disabled={!isValid}
          onClick={handleRegister}
        >
          Sign Up
        </button>

        <div className={styles.divider}>
          <span>OR</span>
        </div>

        <button className={styles.googleBtn}>
          Continue with Google
        </button>

        <p className={styles.footerText}>
          Already have an account? <span>Log In</span>
        </p>
      </div>

      {/* ================= OTP MODAL ================= */}
      {showOtpModal && (
        <div className={styles.modal}>
          <div className={styles.modalCard}>
            <h3>Verify OTP</h3>

            <div className={styles.otpBoxes}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  maxLength="1"
                  value={digit}
                  ref={(el) => (otpInputs.current[index] = el)}
                  onChange={(e) =>
                    handleOtpChange(e.target.value, index)
                  }
                />
              ))}
            </div>

            {otpError && (
              <p className={styles.error}>{otpError}</p>
            )}

            <button onClick={handleVerifyOtp}>
              Submit
            </button>

            <div className={styles.rowButtons}>
              <button
                disabled={!canResend}
                onClick={handleResend}
                className={styles.secondary}
              >
                Resend
              </button>

              <button
                className={styles.secondary}
                onClick={() => setShowOtpModal(false)}
              >
                Back
              </button>
            </div>

            <p className={styles.timer}>
              {canResend
                ? "You can resend OTP now"
                : `Resend available in ${timer}s`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signup;