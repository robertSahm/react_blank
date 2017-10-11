import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import Home from './components/home'
import ReactGA from 'react-ga';

ReactGA.initialize('UA-107914187-npm run1', {
  debug: true,
  titleCase: false,
  gaOptions: {

  }
});

class LoadingComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {loaded: false, module: null};
		this.sendPageChange(props.location.pathname, props.location.search)
	}

	componentDidMount(props) {
		this.props.routePromise.then(module => {
			// do stuff when route is loaded
			this.setState({ loaded: true, module: module.default });
		});
	}

	componentWillReceiveProps(nextProps) {
    // When props change, check if the URL has changed or not
    if (this.props.location.pathname !== nextProps.location.pathname
      || this.props.location.search !== nextProps.location.search) {
      this.sendPageChange(nextProps.location.pathname, nextProps.location.search)
    }
  }

  sendPageChange(pathname, search='') {
		const page = pathname + search
		ReactGA.set({page});
		ReactGA.pageview(page);
  }


	render() {
		const isLoaded = this.state.loaded;

		if ( this.state.loaded ) {
			return <this.state.module {...this.props} />
		} else {
			return <div></div>
		}
	}
}

const Routes = () =>
	<div>
		<Route exact path="/" component={Home} />
		<Route path="/underwear" component={props =>
			<LoadingComponent {...props} routePromise={import(/*webpackChunkName: "underwear"*/"./components/underwear")} />
			}
		/>

		<Route path="/lounge"
			component={props =>
				<LoadingComponent {...props} routePromise={import(/*webpackChunkName: "lounge"*/"./components/lounge")} />
			}
		/>

		<Route path="/socks"
			component={props =>
				<LoadingComponent {...props} routePromise={import(/*webpackChunkName: "socks"*/"./components/socks")} />
			}
		/>

		<Route path="/accessories"
			component={props =>
				<LoadingComponent {...props} routePromise={import(/*webpackChunkName: "accessories"*/"./components/accessories")} />
			}
		/>

		<Route path="/contact"
			component={props =>
				<LoadingComponent {...props} routePromise={import(/*webpackChunkName: "contact"*/"./components/contact")} />
			}
		/>

	</div>;

export default Routes;
