import { useState } from 'react'
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

  const logout = () => {
    setCsrf('')
    setIsAuthenticated(false)
  }

  return (
    <Switch>
      <Route path="/" render={() => (
        <Login 
          csrf={csrf}
          setCsrf={(value: string) => {setCsrf(value)}}
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={(auth: boolean) => {setIsAuthenticated(auth)}}
        />
      )} exact />
      <Route path="/home" render={() => (
        <Home csrf={csrf} logout={() => {logout()}} />
      )} exact />
      <Route path="/units" render={() => (
        <Units csrf={csrf} logout={() => {logout()}} />
      )} exact />
    </Switch>
  )
}

export default App
