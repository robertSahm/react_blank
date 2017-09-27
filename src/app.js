import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './styles/home.css'
import './styles/typography.css'
import './styles/header.css'
import './styles/nav.css'

// get header
import Header from './components/header'
// get nav
import Nav from './components/nav'
// get routes
import Routes from './routes'


const App = () =>
	<Router>
		<div>
      <Header />
			<Route route="/" component={Nav} />
			<Routes />
		</div>
	</Router>;

ReactDOM.render(
	<App />, document.getElementById("app")
)
