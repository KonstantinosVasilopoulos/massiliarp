import ReactDOM from 'react-dom'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'

// Routes
import AppRoutes from './routes'

ReactDOM.render(
  <Router>
    <AppRoutes />
  </Router>,
  document.getElementById('root')
)
