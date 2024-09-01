import React, { useState } from "react";
import axios from "axios";
import CONFIG from "../config.json";
import "./CSS/LoginSignup.css";
import signupPhoto from "../components/Assets/images/login.png";
// import logo from "./CSS/logo2 .png";

const LoginSignup = () => {
  const [state, setState] = useState("Log In");
  const isSignup = state === "Sign Up";
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    passwrd: "",
    error: null,
  });

  const onChangeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const signup = async (e) => {
    try {
      await axios
        .post(`${CONFIG.api_server}/api/user/addUser`, formData, {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
          console.log(response);
          if (response.data.success) {
            setFormData({ user: response.data.users, error: null });
            localStorage.setItem("auth-token", response.data.token);
            window.location.href = "/";
          } else {
            alert(response.data.message);
            setFormData((prev) => ({ ...prev, error: response.data.message }));
          }
        });
    } catch (err) {
      alert(err.response ? err.response.data.message : "Error occurred");
      setFormData((prev) => ({
        ...prev,
        error: err.response ? err.response.data.message : "Error occurred",
      }));
    }
  };
  const login = async (e) => {
    console.log("loged in successfully");
    try {
      await axios
        .post(`${CONFIG.api_server}/api/user/login`, formData, {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
          console.log(response);
          if (response.data.success) {
            localStorage.setItem("auth-token", response.data.token);
            window.location.href = "/";
          } else {
            alert(response.data.message);
          }
        });
    } catch (err) {
      alert(err.response ? err.response.data.message : "Error occurred");
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (isSignup) {
      signup(e);
    } else {
      login(e);
    }
  };
  return (
    <div className="LoginSignup-container">
      <h1>{state}</h1>
      <div className="loginSignup">
        <div className="imgContainer">
          <img src={signupPhoto} alt="photo" />
        </div>
        <div className="loginSignup-fields">
          <form
            onSubmit={handleSubmit}
            className="loginSignup-fields-items"
            method="post"
          >
            <div className="loginSignup-fields-Text">
              {isSignup ? <h2>Create New Account</h2> : <h2>User Login</h2>}

              <p>Please enter details</p>
            </div>
            <div className="field">
              {isSignup ? (
                <>
                  <label htmlFor="fname">First Name *</label>
                  <input
                    type="text"
                    id="fname"
                    name="first_name"
                    required
                    autoFocus
                    placeholder="Enter your first name"
                    onChange={onChangeHandler}
                  />
                </>
              ) : (
                <></>
              )}
            </div>
            <div className="field">
              {isSignup ? (
                <>
                  <label htmlFor="fname">Last Name *</label>
                  <input
                    type="text"
                    id="lname"
                    name="last_name"
                    placeholder="Enter your last name"
                    onChange={onChangeHandler}
                    required
                  />
                </>
              ) : (
                <></>
              )}
            </div>
            <div className="field">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email address"
                onChange={onChangeHandler}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="passwd">Password *</label>
              <input
                type="password"
                id="passwd"
                name="passwrd"
                minLength={"8"}
                placeholder="Enter your password"
                onChange={onChangeHandler}
                required
              />
              {isSignup ? (
                <p>
                  Already have an accocunt ?
                  <span
                    onClick={() => {
                      setState("Log In");
                      window.scrollTo(200, 200);
                    }}
                  >
                    log in
                  </span>
                </p>
              ) : (
                <p>
                  Create an account ?
                  <span
                    onClick={() => {
                      setState("Sign Up");
                      window.scrollTo(0, 0);
                    }}
                  >
                    click here
                  </span>
                </p>
              )}
            </div>

            <div className="field-checkbox">
              <input type="checkbox" id="check" required="" />
              <label htmlFor="check">
                I agree to the <a href="">Terms & Conditions</a>
              </label>
            </div>
            <button type="submit">{isSignup ? <>Signup</> : <>Login</>}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
