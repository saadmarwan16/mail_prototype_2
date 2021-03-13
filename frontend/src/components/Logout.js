import React, { useEffect } from 'react'

const Logout = (props) => {

    useEffect(() => {
        fetch('/backend/logout')
        .then(response => response.json())
        .then(results => {
            console.log(results)
            props.history.push('/login')
        })
    })

    return null
}

export default Logout