import React, { Component } from "react"
import { Route } from "react-router-dom"
import Home from "./components/home"

class LoadingComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {loaded: false, module: null};
	}

	componentDidMount() {
		this.props.routePromise.then(module=>{
			setTimeout(()=>{
				this.setState({ loaded: true, module: module.default });
			}, 0);
		});
	}

	render() {
		const isLoaded = this.state.loaded;

		if( this.state.loaded ) {
			return <this.state.module {...this.props} />
		} else {
			return <div></div>
		}
	}
}

const Routes = () =>
	<div>
		<Route exact path="/"component={Home} />

		<Route path="/underwear"
			component={
				props =>
					<LoadingComponent {...props} routePromise={import(/*webpackChunkName: "underwear"*/"./components/underwear")} />
			}
		/>

		<Route path="/lounge"
			component={
				props =>
					<LoadingComponent {...props} routePromise={import(/*webpackChunkName: "lounge"*/"./components/lounge")} />
			}
		/>

		<Route path="/socks"
			component={
				props =>
					<LoadingComponent {...props} routePromise={import(/*webpackChunkName: "socks"*/"./components/socks")} />
			}
		/>

		<Route path="/accessories"
			component={
				props =>
					<LoadingComponent {...props} routePromise={import(/*webpackChunkName: "accessories"*/"./components/accessories")} />
			}
		/>

		<Route path="/contact"
			component={
				props =>
					<LoadingComponent {...props} routePromise={import(/*webpackChunkName: "contact"*/"./components/contact")} />
			}
		/>

	</div>;

export default Routes;
