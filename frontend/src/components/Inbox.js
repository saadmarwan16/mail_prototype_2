import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Inbox = ({ getEmail }) => {

    const [csrftoken, setCsrftoken] = useState('')

    const [mails, setMails] = useState([])

    const [isMailHovered, setIsMailHovered] = useState(false)

    const [isMailRead, setIsMailReaad] = useState([])

    useEffect(() => {getEmail()}, [])

    useEffect(() => {
        fetch('/backend/get-csrf-token')
        .then(response => response.json())
        .then(results => {
            setCsrftoken(results.csrf_token)
        })
    }, [])

    useEffect(() => {
        
        fetch('/backend/emails/inbox')
        .then(response => response.json())
        .then(results => {
            setMails(results)
        })
    }, [])

    const onMouseEnter = (e) => {
        e.target.querySelector('.mail-timestamp').style.display = 'none'
        e.target.querySelector('.mail-icons').style.display = 'flex'
    }

    const onMouseLeave = (e) => {
        e.target.querySelector('.mail-icons').style.display = 'none'
        e.target.querySelector('.mail-timestamp').style.display = 'block'
    }

    const onDeleteClick = (e, id) => {

        fetch(`/backend/emails/${id}`, {
            credentials: 'include',
            method: 'PUT',
            mode: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            
            body: JSON.stringify({
                trashed: true
            })
        })

        console.log("Got here")
        console.log(e.target.className)
        // material-icons mail-icon
        e.target.style.animationPlayState = 'running'
        e.target.addEventListener('animationend', () => {
            console.log("Animations finished")
            setMails(mails.filter((mail) => mail.id !== id))
        })
    }

    return (
        <>
            <title>Inbox - Mail</title>

            <h3 className="mailbox-name">Inbox</h3>
            <div className="list-group">

                {mails.map((item, index) => {
                    return (

                        // archived: false
                        // body: "This is a test"
                        // id: 1
                        // read: false
                        // recipients: ["foo@example.com"]
                        // sender: "bar@example.com"
                        // subject: "Test"
                        // timestamp: "Mar 12 2021, 08:47 PM"
                        // trashed: false

                        <Link className="mail" key={index} 
                            onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
                        >
                            <div className="mail-content sender">{item.sender}</div>

                            <div className="mail-main-content">
                                <div className="mail-content subject-body">
                                    <span className="subject">{item.subject}</span>
                                    <span> - </span>
                                    <span className="body">{item.body}</span>
                                </div>

                                {/* className={`task ${task.reminder ? 'reminder' : ''}`} */}
                                <div className="mail-timestamp-icons">
                                    {/* <div className={`mail-timestamp hide`}> */}
                                    <div className="mail-timestamp">
                                        <small>{item.timestamp}</small>
                                    </div>

                                    <div className="mail-icons">
                                        <i title="Delete" className="material-icons mail-icon" onClick={(e) => onDeleteClick(e, item.id)}>delete</i>
                                        {/* <i title="Restore from trash" className="material-icons mail-icon">restore_from_trash</i> */}
                                        <i title="Archive" className="material-icons mail-icon">archive</i>
                                        {/* <i title="Unarchive" className="material-icons mail-icon">unarchive</i> */}
                                        <i title="Mark as read" className={`material-icons mail-icon ${item.read ? 'hide' : ''}`}>mark_email_read</i>
                                        <i title="Mark as unread" className={`material-icons mail-icon ${item.read ? '' : 'hide'}`}>mark_email_unread</i>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </>
    )
}

export default Inbox