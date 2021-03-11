import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

const Home = (props) => {

    // Take users with a valid session to their inbox, otherwise take the user to the login page
    useEffect(() => {
        fetch('/backend/')
        .then(response => response.json())
        .then(results => {
            if (results.message) {
                props.history.push('/inbox')
            } else {
                props.history.push('/login')
            }
        })
    })

    return null
}

export default Home