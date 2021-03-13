import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

import Home from './Home'
import Inbox from './Inbox'
import SingleMail from './SingleMail'
import Login from './Login'
import Logout from './Logout'
import Register from './Register'
import Compose from './Compose'
import Sent from './Sent'
import Archived from './Archived'
import Trash from './Trash'

import '../styles/Main.css'

const App = () => {

    const [email, setEmail] = useState('')

    const getEmail = () => {
        fetch('/backend/get-user-email')
        .then(response => response.json())
        .then(results => {
            setEmail(results.email)
        })
    }

    return (
        <>
            <Router>
                <Switch>
                    <Route path='/' exact component={Home} />
                    <Route path='/login' component={Login} />
                    <Route path='/logout' component={Logout} />
                    <Route path='/register' component={Register} />

                    <div className="main-mailbox-body">
                        <div className="container">
                            <h2 className="mailbox-owner-address">{email}</h2>

                            <Link className="btn btn-sm btn-outline-primary mailbox-btn" exact to="/inbox">Inbox</Link>
                            <Link className="btn btn-sm btn-outline-primary mailbox-compose-btn" to="/compose">Compose</Link>
                            <Link className="btn btn-sm btn-outline-primary mailbox-btn" to="/sent">Sent</Link>
                            <Link className="btn btn-sm btn-outline-primary mailbox-btn" to="/archived">Archived</Link>
                            <Link className="btn btn-sm btn-outline-primary mailbox-btn" to="/trash">Trash</Link>
                            <Link className="btn btn-sm btn-outline-primary mailbox-logout-btn" to="/logout">Log Out</Link>
                            <hr className="mailbox-seperator" />

                            <div className="container">
                                <Route path='/inbox' exact component={Inbox} getEmail={getEmail} />
                                <Route path='/inbox/:id' component={SingleMail} />
                                <Route path='/compose' component={Compose} />
                                <Route path='/sent' component={Sent} />
                                <Route path='/archived' component={Archived} />
                                <Route path='/trash' component={Trash} />
                            </div>
                        </div>
                    </div>
                </Switch>
            </Router>
        </>
    )
}

export default App