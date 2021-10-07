import { useState, useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'

// Components
import Login from './components/Login'
import Home from './components/Home'
import Units from './components/Units'

export const BACKEND_URL = 'http://localhost:8000'

const App = () => {
  //State
  const [csrf, setCsrf] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  useEffect(() => {
    getSession()
  }, [])

  const getCSRF = () => {
    fetch(BACKEND_URL + '/csrf/', {
      credentials: 'same-origin',
    })
      .then(res => {
        const csrfToken = res.headers.get('X-CSRFToken')
        if (csrfToken !== null)
          setCsrf(csrfToken)

        console.log(csrf)  // -2
      })
  }

  const getSession = () => {
    fetch(BACKEND_URL + '/session/', {
      credentials: 'same-origin',
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)  // -2
        if (data.isAuthenticated) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
          getCSRF()
        }
      })
  }

  return (
    <Switch>
      <Route path="/" render={() => (
        <Login 
          csrf={csrf} 
          isAuthenticated={isAuthenticated}
          setAuth={(auth: boolean) => {setIsAuthenticated(auth)}}
         />
      )} exact />
      <Route path="/home" render={() => (
        <Home csrf={csrf} />
      )} exact />
      <Route path="/units" component={Units} exact />
    </Switch>
  )
}

export default App
