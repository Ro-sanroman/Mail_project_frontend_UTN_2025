import React, { useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router";
import { login } from "../../services/authService";
import useForm from "../../hook/useForm";
import useFetch from "../../hook/useFetch";
import { AuthContext } from "../../context/authContext";
import "./LoginScreen.css";

const LoginScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { onLogin } = useContext(AuthContext);
  useEffect(
    () => {
      const query = new URLSearchParams(location.search);
      const from = query.get("from");
      if (from === "verified_email") {
        alert("Has validado tu mail exitosamente");
      }
    },
    [] //Solo queremos que se ejecute cuando se monte el componente
  );

  const LOGIN_FORM_FIELDS = {
    EMAIL: "email",
    PASSWORD: "password",
  };

  const initial_form_state = {
    [LOGIN_FORM_FIELDS.EMAIL]: "",
    [LOGIN_FORM_FIELDS.PASSWORD]: "",
  };

  const { response, error, loading, sendRequest, resetResponse } = useFetch();

  function handleLogin(form_state_sent) {
    resetResponse();
    sendRequest(() => {
      return login(
        form_state_sent[LOGIN_FORM_FIELDS.EMAIL],
        form_state_sent[LOGIN_FORM_FIELDS.PASSWORD]
      );
    });
  }

  const { form_state, onInputChange, handleSubmit, resetForm } = useForm(
    initial_form_state,
    handleLogin
  );

  useEffect(() => {
    if (response && response.ok) {
      //Queremos que persista en memoria el auth token
      //Dejamos que el context se encargue de que sucedera
      onLogin(response.body.auth_token);
    }
  }, [response]);
  return (
    <div className="screen">
      <div className="login-screen">
        <div className="form-container">
          <h2 className="title">Bienvenido!</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-field input-group">
              <label htmlFor="email" className="label">
                Email:
              </label>
              <input
                type="text"
                placeholder="name@gmail.com"
                value={form_state[LOGIN_FORM_FIELDS.EMAIL]}
                name={LOGIN_FORM_FIELDS.EMAIL}
                onChange={onInputChange}
                id={"email"}
                className="input"
              />
            </div>

            <div className="form-field input-group">
              <label htmlFor="password" className="label">
                Contraseña:
              </label>
              <input
                type="password"
                placeholder="password123"
                value={form_state[LOGIN_FORM_FIELDS.PASSWORD]}
                name={LOGIN_FORM_FIELDS.PASSWORD}
                onChange={onInputChange}
                id={"password"}
                className="input"
              />
            </div>
            <div>
              {error && <span className="error-message"> {error} </span>}
              {response && (
                <span className="success-message"> Successful Login </span>
              )}
            </div>
            <div className="button-group">
              <div className="button-login-wrapper">
                {loading ? (
                  <button disabled>Loggin In</button>
                ) : (
                  <button className="login-button" type="submit">
                    Login
                  </button>
                )}
              </div>
              <div className="button-register-wrapper">
                <button className="register-button">
                  <a href="https://mail-project-frontend-utn-2025.vercel.app/register">
                    Regístrate
                  </a>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
