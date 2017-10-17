import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import Home from './components/home'
import ReactGA from 'react-ga'
import { AnimatedSwitch, AnimatedRoute } from 'react-router-transition'
import './styles/routes.css'
import './styles/underwear-page.css'

class LoadingComponent extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loaded: false,
			module: null
		}
		this.sendPageChange(props.location.pathname, props.location.search)
	}

  sendPageChange(pathname, search='') {
		const page = pathname + search
		ReactGA.set({page});
		ReactGA.pageview(page);
  }

	componentDidMount(props) {
		this.props.routePromise.then(module => {
			setTimeout(() => {
				this.setState({
					loaded: true,
					module: module.default })
				}, 0);
		});
	}

	componentWillReceiveProps(nextProps) {
		// When props change, check if the URL has changed or not
		if (
			this.props.location.pathname !== nextProps.location.pathname ||
			this.props.location.search !== nextProps.location.search) {
				this.sendPageChange(nextProps.location.pathname, nextProps.location.search)
    	}
  	}

	render() {
		if ( this.state.loaded ) {
			return (
				<this.state.module {...this.props}/>
			)
		} else {
			return (
				<div className={'loading-wrapper'}>
					<h1 className={'loading-div text-center'}></h1>
				</div>
			)
		}
	}
}

const Routes = () =>
		<AnimatedSwitch
	    atEnter={{ opacity: 0 }}
	    atLeave={{ opacity: 0 }}
	    atActive={{ opacity: 1 }}
	    className="route-wrapper"
	  >
			<AnimatedRoute
				atEnter={{ opacity: 1 }}
	    	atLeave={{ opacity: 0 }}
	    	atActive={{ opacity: 1 }}
	      exact path="/"
      	component={Home}
      />

			<AnimatedRoute
				atEnter={{ opacity: 1 }}
	    	atLeave={{ opacity: 0 }}
	    	atActive={{ opacity: 1 }}
				path="/underwear" component={props =>
				<LoadingComponent {...props}
				routePromise={import(/*webpackChunkName: "underwear"*/"./components/underwear")} />
				}
			/>

			<AnimatedRoute
				atEnter={{ opacity: 1 }}
	    	atLeave={{ opacity: 0 }}
	    	atActive={{ opacity: 1 }}
				path="/lounge"
				component={props =>
					<LoadingComponent {...props}
					routePromise={import(/*webpackChunkName: "lounge"*/"./components/lounge")} />
				}
			/>

			<AnimatedRoute
				atEnter={{ opacity: 1 }}
	    	atLeave={{ opacity: 0 }}
	    	atActive={{ opacity: 1 }}
				path="/socks"
				component={props =>
					<LoadingComponent {...props}
					routePromise={import(/*webpackChunkName: "socks"*/"./components/socks")} />
				}
			/>

			<AnimatedRoute
				atEnter={{ opacity: 1 }}
	    	atLeave={{ opacity: 0 }}
	    	atActive={{ opacity: 1 }}
				path="/accessories"
				component={props =>
					<LoadingComponent {...props}
					routePromise={import(/*webpackChunkName: "accessories"*/"./components/accessories")} />
				}
			/>

			<AnimatedRoute
				atEnter={{ opacity: 1 }}
	    	atLeave={{ opacity: 0 }}
	    	atActive={{ opacity: 1 }}
				path="/contact"
				component={props =>
					<LoadingComponent {...props}
					routePromise={import(/*webpackChunkName: "contact"*/"./components/contact")} />
				}
			/>
		</AnimatedSwitch>

export default Routes
