import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import RegisterLogin from './RegisterLogin'

import '../styles/Register-Login.css'


const Register = (props) => {

    const [csrftoken, setCsrftoken] = useState('')

    const [isErrorMessage, setIsErrorMessage] = useState(false)

    const [errorMessage, setErrorMessage] = useState('')

    const [email, setEmail] = useState('')
    const onEmailChange = (e) => setEmail(e.target.value)

    const [password, setPassword] = useState('')
    const onPasswordChange = (e) => setPassword(e.target.value)

    const [confirmation, setConfirmation] = useState('')
    const onConfirmationChange = (e) => setConfirmation(e.target.value)

    const formDetails = [
        {
            isAutoFocus: true,
            type: 'email',
            placeholder: 'Email Address',
            value: email,
            onChange: onEmailChange
        },
        {
            isAutoFocus: false,
            type: 'password',
            placeholder: 'Password',
            value: password,
            onChange: onPasswordChange
        },
        {
            isAutoFocus: false,
            type: 'password',
            placeholder: 'Password Again',
            value: confirmation,
            onChange: onConfirmationChange
        }
    ]

    useEffect(() => {
        fetch('/backend/get-csrf-token')
        .then(response => response.json())
        .then(results => {
            setCsrftoken(results.csrf_token)
        })
    }, [])

    const onSubmit = (e) => {
        e.preventDefault()

        fetch('/backend/register', {
            credentials: 'include',
            method: 'POST',
            mode: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            
            body: JSON.stringify({
                email: email,
                password: password,
                confirmation: confirmation
            })
        })
        .then(response => response.json())
        .then(results => {
            if (results.message === 'Successful') {
                props.history.push('/inbox')
            } else {
                setEmail('')
                setPassword('')
                setConfirmation('')
                setErrorMessage(results.error)
                setIsErrorMessage(true)
            }
        })
    }

    return (
        <>
            <title>Register - Mail</title>

            <div className="container-fluid register-login-container-container">
                <div className="register-login-container">
                    <div className="register-login-form-container">
                        <div className="register-login-form">
                            <div className={isErrorMessage ? 'alert alert-danger \
                                register-login-error-message' : 'alert alert-danger \
                                register-login-error-message hide'}
                            >
                                <strong>Oops!</strong> {errorMessage}
                            </div>

                            <h2 className="register-login-heading">Register</h2>

                            <RegisterLogin
                                formDetails={formDetails} 
                                submitValue="Register" 
                                onSubmit={onSubmit} 
                            />
                        
                            <small className="register-login-change-container">
                                Already have an account? 
                                <Link className="register-login-change" to="/login"> Log In</Link>
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register