import React, { FC, useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import Cookies from 'universal-cookie/es6'
import axios from 'axios'
import { BACKEND_URL } from '../App'

interface Props {
    cookies: Cookies
}

const Login: FC<Props> = ({ cookies }) => {
    // State
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const isResponseOk = (response: any) => {
        if (response.status >= 200 && response.status <= 299) {
            return response.json()
        } else {
            throw Error(response.statusText)
        }
    }

    useEffect(() => {
        axios.get(BACKEND_URL + '/api-auth/session/', {
            withCredentials: true,
        })
        .then(response => {
            setIsLoggedIn(response.data.isAuthenticated)
        })
    }, [])

    const onLoginSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        fetch(BACKEND_URL + '/api-auth/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
            },
            credentials: 'same-origin',
            body: JSON.stringify({username: username, password: password}),
        })
        .then(res => isResponseOk(res))
        .then(data => {
            console.log(data)
            setUsername('')
            setPassword('')
            setIsLoggedIn(true)
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

            { isLoggedIn && <Redirect to="/home" /> }
        </div>
    )
}

export default Login
