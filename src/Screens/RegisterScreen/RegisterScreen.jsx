import React, { useState } from 'react'
import useForm from '../../hook/useForm'
import { register } from '../../services/authService'
import useFetch from '../../hook/useFetch'



const RegisterScreen = () => {

    //Guardamos los campos que tendra nuestro form
    const REGISTER_FORM_FIELDS = {
        USERNAME: 'username',
        EMAIL: 'email',
        PASSWORD: 'password'
    }

    //Que valor tendra inicialmente el estado de formulario
    const initial_form_state = {
        [REGISTER_FORM_FIELDS.USERNAME]: '',
        [REGISTER_FORM_FIELDS.EMAIL]: '',
        [REGISTER_FORM_FIELDS.PASSWORD]: ''
    }

    //Estados para manejar una consulta al servidor
    const {response, error, loading, sendRequest} = useFetch()

    function onRegister (form_state_sent) {

        sendRequest(
            () => {
                return register(
                    form_state_sent[REGISTER_FORM_FIELDS.USERNAME], 
                    form_state_sent[REGISTER_FORM_FIELDS.EMAIL], 
                    form_state_sent[REGISTER_FORM_FIELDS.PASSWORD]
                )
            }
        )
    }

    
    //Alternativa, usar react hook forms / React formik
    const {
        form_state, 
        onInputChange, 
        handleSubmit, 
        resetForm
    } = useForm(
        initial_form_state, 
        onRegister
    )
    
    
  return (
    <div className="screen">
      <div className="register-screen">
        <div className="form-container">
          <h2 className="title">Registrate</h2>
          <form onSubmit={handleSubmit} className="register-form">
            <div className='form-field input-group'>
              <label htmlFor="username" className="label">Nombre de usuario:</label>
              <input 
                type="text" 
                placeholder='name' 
                value={form_state[REGISTER_FORM_FIELDS.USERNAME]}
                name={REGISTER_FORM_FIELDS.USERNAME}
                id='username'
                onChange={onInputChange}
                className="input"
              />
            </div>
            <div className='form-field input-group'>
              <label htmlFor="email" className="label">Email:</label>
              <input 
                type="text" 
                placeholder='name@gmail.com' 
                value={form_state[REGISTER_FORM_FIELDS.EMAIL]}
                name={REGISTER_FORM_FIELDS.EMAIL}
                onChange={onInputChange}
                id={'email'}
                className="input"
              />
            </div>
            <div className='form-field input-group'>
              <label htmlFor="password" className="label">Contraseña:</label>
              <input 
                type="password" 
                placeholder='password123' 
                value={form_state[REGISTER_FORM_FIELDS.PASSWORD]}
                name={REGISTER_FORM_FIELDS.PASSWORD}
                onChange={onInputChange}
                id={'password'}
                className="input"
              />
            </div>
            <div>
              {error && <span className="error-message"> {error} </span>}
              {response && <span className="success-message"> Usuario registrado con éxito </span>}
            </div>
            <div className="button-group">
              {
                loading 
                ? <button className="register-button" disabled>Registrando</button>
                : <button className="register-button" type="submit">Registrarse</button>
              }
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterScreen