import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { login } from '../../services/authService'
import useForm from '../../hook/useForm'
import useFetch from '../../hook/useFetch'
import { useContext } from 'react'
import { AuthContext } from '../../context/authContext'
import ENVIRONMENT from '../../config/enviroment'

const LoginScreen = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const {onLogin: onLoginContext} = useContext(AuthContext)
  
  console.log('[LoginScreen] Montado, ENVIRONMENT.URL_API:', ENVIRONMENT.URL_API)
  
  useEffect(
    () => {
      const query = new URLSearchParams(location.search)
      const from = query.get('from')
      if (from === 'verified_email') {
        alert('Has validado tu mail exitosamente')
      }
    },
    [] //Solo queremos que se ejecute cuando se monte el componente
  )

  const LOGIN_FORM_FIELDS = {
        EMAIL: 'email',
        PASSWORD: 'password'
    }

    const initial_form_state = {
        [LOGIN_FORM_FIELDS.EMAIL]: '',
        [LOGIN_FORM_FIELDS.PASSWORD]: ''
    }

    const { response, error, loading, sendRequest, resetResponse } = useFetch()

    function onLogin(form_state_sent) {
        console.log('[LoginScreen] onLogin ejecutado con:', { email: form_state_sent[LOGIN_FORM_FIELDS.EMAIL], hasPassword: !!form_state_sent[LOGIN_FORM_FIELDS.PASSWORD] })
        resetResponse()
        sendRequest(
            () => {
                console.log('[LoginScreen] Llamando a login()...')
                return login(
                    form_state_sent[LOGIN_FORM_FIELDS.EMAIL],
                    form_state_sent[LOGIN_FORM_FIELDS.PASSWORD]
                )
            }
        )
    }

    const {
        form_state,
        onInputChange,
        handleSubmit,
        resetForm
    } = useForm(initial_form_state, onLogin)

    useEffect(
        () => {
          if(response){
            if(response.ok){
              //Queremos que persista en memoria el auth token
              const token = response.body?.auth_token || response.auth_token
              if(token) localStorage.setItem('auth_token', token)
              navigate('/home')
            }
            else {
              // response.ok === false -> show server message via useFetch error UI (we don't set error state here)
              // nothing to do programmatically
            }
          }
        },
        [response]
    )
  return (
      <div className="Form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="email">Email: </label>
            <input type="text" placeholder="jose@algo.com" value={form_state[LOGIN_FORM_FIELDS.EMAIL]} name={LOGIN_FORM_FIELDS.EMAIL} onChange={onInputChange} id={'email'} />
          </div>

          <div>
            <label htmlFor="password">Password: </label>
            <input type="text" placeholder="Josesito206" value={form_state[LOGIN_FORM_FIELDS.PASSWORD]} name={LOGIN_FORM_FIELDS.PASSWORD} onChange={onInputChange} id={'password'} />
          </div>

          {error && <span style={{ color: 'red' }}> {error} </span>}
          {response && !response.ok && <span style={{ color: 'red' }}> {response.message || 'Error en el servidor'} </span>}
          {response && response.ok && <span style={{ color: 'green' }}> Successful Login </span>}

          {
            loading
              ? <button disabled>Login In</button>
              : <button>Login</button>
          }
        </form>
      </div>
      )
}

      export default LoginScreen