import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import Home from './components/home'
// import ReactGA from 'react-ga';

class LoadingComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {loaded: false, module: null};
		// this.sendPageChange(props.location.pathname, props.location.search)
	}

	componentDidMount(props) {
		this.props.routePromise.then(module => {
			// do stuff when route is loaded
			setTimeout(()=>{
				this.setState({ loaded: true, module: module.default });
			}, 0);
		});
	}

	componentWillReceiveProps(nextProps) {
    // When props change, check if the URL has changed or not
    if (this.props.location.pathname !== nextProps.location.pathname
      || this.props.location.search !== nextProps.location.search) {
      this.sendPageChange(nextProps.location.pathname, nextProps.location.search)
    }
  }

  // sendPageChange(pathname, search='') {
		// const page = pathname + search
		// ReactGA.set({page});
		// ReactGA.pageview(page);
  // }

	render() {
		const isLoaded = this.state.loaded;

		if ( this.state.loaded ) {
			return (
				 <this.state.module {...this.props} />
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
	<div className={'routes-wrapper'}>

		<Route exact path="/" component={Home} />

		<Route path="/page_1" component={props =>
			<LoadingComponent {...props}
			routePromise={import(/*webpackChunkName: "page_1"*/"./components/page_1")} />
			}
		/>

	</div>;

export default Routes;
