import React, { useState, useEffect } from 'react'

const Compose = (props) => {
    const [csrftoken, setCsrftoken] = useState('')

    const [isErrorMessage, setIsErrorMessage] = useState(false)

    const [errorMessage, setErrorMessage] = useState('')

    const [sender, setSender] = useState('')

    const [recipients, setRecipients] = useState('')
    const onRecipientsChange = (e) => setRecipients(e.target.value)

    const [subject, setSubject] = useState('')
    const onSubjectChange = (e) => setSubject(e.target.value)

    const [body, setBody] = useState('')
    const onBodyChange = (e) => setBody(e.target.value)

    useEffect(() => {
        fetch('/backend/get-user-email')
        .then(response => response.json())
        .then(results => {
            setSender(results.email)
        })
    }, [])

    useEffect(() => {
        fetch('/backend/get-csrf-token')
        .then(response => response.json())
        .then(results => {
            setCsrftoken(results.csrf_token)
        })
    }, [])

    const onSubmit = (e) => {
        e.preventDefault()

        fetch('/backend/emails', {
            credentials: 'include',
            method: 'POST',
            mode: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            
            body: JSON.stringify({
                recipients: recipients,
                subject: subject,
                body: body
            })
        })
        .then(response => response.json())
        .then(results => {
            console.log(results)
            if (results.message === 'Successful') {
                console.log(results)
                props.history.push('/sent')
            } else {
                console.log(results)
                setRecipients('')
                setSubject('')
                setBody('')
                setErrorMessage(results.error)
                setIsErrorMessage(true)
            }
        })
    }
    return (
        <>
            <title>Compose - Mail</title>

            <div>
                <h3 className="compose-mail-heading">New Email</h3>

                <div className={isErrorMessage ? 'alert alert-danger \
                    register-login-error-message' : 'alert alert-danger \
                    register-login-error-message hide'}
                >
                    <strong>Oops!</strong> {errorMessage}
                </div>

                <form onSubmit={onSubmit}>
                    <div className="form-group compose-mail-sender-container">
                        From:   
                        <input disabled className="form-control compose-mail-sender"
                            value={sender}
                        />
                    </div>
                    <div className="form-group compose-mail-receipients-container">
                        To: 
                        <input autoFocus className="form-control compose-mail-receipients" 
                            placeholder="Recipient(s)" value={recipients} onChange={onRecipientsChange}
                        />
                    </div>
                    <div className="form-group">
                        <input className="form-control compose-mail-subject" placeholder="Subject" 
                            value={subject} onChange={onSubjectChange}
                        />
                    </div>
                    <div className="form-group">
                        <textarea className="form-control compose-mail-body" placeholder="Body" onChange={onBodyChange}>
                            {body}
                        </textarea>
                    </div>
                    <input type="submit" className="btn btn-primary compose-mail-submit-btn" />
                </form>
            </div>
        </>
    )
}

export default Compose