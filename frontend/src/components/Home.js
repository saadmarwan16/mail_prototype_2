import { useEffect } from 'react'

const Home = (props) => {

    // Take users with a valid session to their inbox, otherwise take the user to the login page
    useEffect(() => {
        console.log("Before fetch")
        fetch('/backend/')
        .then(response => response.json())
        .then(results => {
            if (results.message) {
                console.log("After fetch true")
                props.history.push('/inbox')
            } else {
                console.log("After fetch false")
                props.history.push('/login')
            }
        })
    })

    return null
}

export default Home