import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'

const Login = () => {
    // State
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    let history = useHistory()

    const onLoginSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        if (username !== '' && password !== '') {
            axios.post('http://127.0.0.1:8000',
                {
                    'username': username,
                    'password': password
                }
            ).then((response) => {
                if (response.data['message'] !== 'success') {
                    setErrorMsg(response.data['message'])
                } else {
                    history.push('/home')
                }
            })
        }
    }

    return (
        <div>
            { errorMsg.length > 0 &&  
                <h2>{errorMsg}</h2>
            }

            <form onSubmit={onLoginSubmit}>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" className="bg-gray-200" onChange={e => { setUsername(e.target.value) }} />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" className="bg-gray-200" onChange={e => { setPassword(e.target.value) }} />
                <input type="submit" value="Login" />
            </form>
        </div>
    )
}

export default Login
