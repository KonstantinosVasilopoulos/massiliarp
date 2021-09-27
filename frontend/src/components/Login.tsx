import React, { useState } from 'react'
import axios from 'axios'

const Login = () => {
    // State
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const onLoginSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        if (username !== '' && password !== '') {
            axios.post('http://127.0.0.1:8000',
                {
                    'username': username,
                    'password': password
                }
            ).then((response) => {
                console.log(response)
            })
        }
    }

    return (
        <form onSubmit={onLoginSubmit}>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" className="bg-gray-200" onChange={e => { setUsername(e.target.value) }} />
            <label htmlFor="password">Password</label>
            <input type="password" id="password" className="bg-gray-200" onChange={e => { setPassword(e.target.value) }} />
            <input type="submit" value="Login" />
        </form>
    )
}

export default Login
