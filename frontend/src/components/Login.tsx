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
        <div className="w-full h-screen overflow-hidden">
            <div className="w-full h-full bg-center bg-gray-200 bg-no-repeat bg-cover transition duration-1000 ease-in transform hover:scale-105"
                style={{ 'backgroundImage': `url(${process.env.PUBLIC_URL + '/static/hoplite_2.jpg'})` }}>
                <div id="login-fade">
                    <div className="flex flex-col justify-center items-center w-full h-full">
                        {error.length > 0 &&
                            <h2 className="my-6 p-4 text-blue-dark text-xl bg-red-500 rounded-sm">{error}</h2>
                        }

                        <form className="flex flex-col items-center" onSubmit={onLoginSubmit}>
                            <h1 className="mb-8 text-white text-4xl font-bold">Welcome To Massilia<span className="text-blue-dark font-extrabold">RP</span></h1>
                            {/* <label htmlFor="username" className="my-2 text-blue text-2xl">Username</label> */}
                            <input type="text" id="username" placeholder="Username" className="w-full my-2 px-4 py-2 text-blue-dark text-lg bg-gray-200 rounded" onChange={e => { setUsername(e.target.value) }} />
                            {/* <label htmlFor="password" className="my-2 text-blue text-2xl">Password</label> */}
                            <input type="password" id="password" placeholder="Password" className="w-full my-2 px-4 py-2 text-blue-dark text-lg bg-gray-200 rounded" onChange={e => { setPassword(e.target.value) }} />
                            <input type="submit" value="Login &#8594;" className="w-full my-2 px-5 py-2 text-blue-dark text-2xl rounded bg-salmon-dark cursor-pointer hover:opacity-80" />
                        </form>

                        {isLoggedIn && <Redirect to="/home" />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
