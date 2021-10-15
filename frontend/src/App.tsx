import { useState, useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import Cookies from 'universal-cookie/es6'

// Components
import Login from './components/Login'
import Home from './components/Home'
import Units from './components/Units'
import Population from './components/Population'
import Events from './components/Events'
import Buildings from './components/Buildings'

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
        <Login cookies={cookies} />
      )} exact />
      <Route path="/home" render={() => (
        <Home cookies={cookies} setIsAuthenticated={(auth: boolean) => { setIsAuthenticated(auth) }} />
      )} exact />
      <Route path="/units" render={() => (
        <Units cookies={cookies} setIsAuthenticated={(auth: boolean) => { setIsAuthenticated(auth) }} />
      )} exact />
      <Route path="/population" render={() => (
        <Population cookies={cookies} setIsAuthenticated={(auth: boolean) => { setIsAuthenticated(auth) }} />
      )} exact />
      <Route path="/events" render={() => (
        <Events cookies={cookies} setIsAuthenticated={(auth: boolean) => { setIsAuthenticated(auth) }} />
      )} exact />
      <Route path="/buildings" render={() => (
        <Buildings cookies={cookies} setIsAuthenticated={(auth: boolean) => { setIsAuthenticated(auth) }} />
      )} exact />
    </Switch>
  )
}

export default App
