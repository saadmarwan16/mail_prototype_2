import React from 'react'

const SingleMail = () => {
    return (
        <>
            <title>Single Mail - Mail</title>

            <div className="container">
                <div className="contents-container">
                    <div className="row commands">
                        <div>
                            <a className="single-mail-icon" title="Go back">
                                <i className="material-icons single-mail-icon-icon">west</i>
                            </a>
                            <a className="single-mail-icon" title="Delete">
                                <i className="material-icons single-mail-icon-icon">delete</i>
                            </a>
                            <a className="single-mail-icon" title="Mark as unread">
                                <i className="material-icons single-mail-icon-icon">mark_email_unread</i>
                            </a>
                            <a className="single-mail-icon" title="Archive">
                                <i className="material-icons single-mail-icon-icon">archive</i>
                            </a>
                        </div>
                    </div>
                    <div className="row single-mail-subject-reply">
                        <h2>Okay</h2>
                        <a title="Reply" className="single-mail-icon reply-icon-container">
                            <i className="material-icons single-mail-icon-icon">reply</i>
                        </a>
                    </div>
                    <div className="single-mail-meta">
                        <div className="single-mail-sender">Sender: bar@example.com</div>
                        <div className="single-mail-recipients">Recipient(s): foo@example.com</div>
                        <div className="single-mail-timestamp">
                            <small>Timestamp: Jan 02 2021, 04:13 AM</small>
                        </div>
                    </div>
                    <div className="row single-mail-main-body jumbotron">
                        <p className="single-mail-main-body-content">Let's get to the chase</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SingleMail