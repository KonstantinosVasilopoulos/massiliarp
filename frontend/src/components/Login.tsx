import React, { FC, useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { BACKEND_URL } from '../App'

interface Props {
    getCsrf: Function
    setCsrf: Function
    setIsAuthenticated: Function
}

const Login: FC<Props> = ({ getCsrf, setCsrf, setIsAuthenticated }) => {
    // State
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loggedIn, setLoggedIn] = useState(false)

    const getCSRF = () => {
        fetch(BACKEND_URL + '/api-auth/csrf/', {
            credentials: 'include',
        })
        .then(res => {
            const csrfToken = res.headers.get('X-CSRFToken')
            if (csrfToken !== null)
                setCsrf(csrfToken)

            console.log(csrfToken)  // -2
        })
    }

    useEffect(() => {
        getSession()
    }, [])

    const getSession = () => {
        fetch(BACKEND_URL + '/api-auth/session/', {
            credentials: 'include',
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)  // -2
            if (data.isAuthenticated) {
                setIsAuthenticated(true)
                setLoggedIn(true)
            } else {
                setIsAuthenticated(false)
                getCSRF()
            }
        })
        .catch(err => {
            console.log(err)
        })
    }

    const isResponseOk = (response: any) => {
        if (response.status >= 200 && response.status <= 299) {
            return response.json()
        } else {
            throw Error(response.statusText)
        }
    }

    const onLoginSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        fetch(BACKEND_URL + '/api-auth/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrf(),
            },
            credentials: 'include',
            body: JSON.stringify({username: username, password: password}),
        })
        .then(res => isResponseOk(res))
        .then(data => {
            console.log(data)
            setIsAuthenticated(true)
            setUsername('')
            setPassword('')
            setLoggedIn(true)
        })
        .catch(err => {
            console.log(err)
            setError(err)
        })
    }

    return (
        <div>
            { error.length > 0 &&  
                <h2>{error}</h2>
            }

            <form onSubmit={onLoginSubmit}>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" className="bg-gray-200" onChange={e => { setUsername(e.target.value) }} />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" className="bg-gray-200" onChange={e => { setPassword(e.target.value) }} />
                <input type="submit" value="Login" />
            </form>

            { loggedIn && <Redirect to="/home" /> }
        </div>
    )
}

export default Login
