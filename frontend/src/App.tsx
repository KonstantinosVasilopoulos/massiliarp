import { useState, useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import Cookies from 'universal-cookie/es6'

// Components
import Login from './components/Login'
import Home from './components/Home'
import Units from './components/Units'

export const BACKEND_URL = 'http://localhost:8000'

const cookies = new Cookies()

const App = () => {
  //State
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    getSession()
  })

  const getSession = () => {
    fetch(BACKEND_URL + '/api-auth/session/', {
      credentials: 'same-origin',
    })
    .then(response => response.json())
    .then(data => {
      console.log(data.isAuthenticated)  // -2
      if (data.isAuthenticated) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    })
  }

  return (
    <Switch>
      <Route path="/" render={() => (
        <Login cookies={cookies} isAuthenticated={isAuthenticated} />
      )} exact />
      <Route path="/home" render={() => (
        <Home cookies={cookies} setIsAuthenticated={(auth: boolean) => {setIsAuthenticated(auth)}} />
      )} exact />
      <Route path="/units" render={() => (
        <Units cookies={cookies} setIsAuthenticated={(auth: boolean) => {setIsAuthenticated(auth)}} />
      )} exact />
    </Switch>
  )
}

export default App
