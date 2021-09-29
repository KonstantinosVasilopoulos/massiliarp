import { Route, Switch } from 'react-router-dom'

import App from './App'
import Login from './components/Login'
import Home from './components/Home'

const AppRoutes = () => (
    <App>
        <Switch>
            <Route path="/" component={Login} exact />
            <Route path="/home" component={Home} exact />
        </Switch>
    </App>
)

export default AppRoutes
