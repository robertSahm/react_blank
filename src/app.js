import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './styles/start.css'
import './styles/typography.css'
import './styles/header.css'
import './styles/nav.css'

// get header
import Header from './components/header'
// get nav
import Nav from './components/nav'
// get routes
import Routes from './routes'
// import footer
import Footer from './components/footer'

if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');
}

const App = () =>
	<Router>
		<div>
      <Header />
			<Route route="/" component={Nav} />
			<Routes />
      <Footer />
    </div>
	</Router>;

ReactDOM.render(
	<App />, document.getElementById("app")
)
