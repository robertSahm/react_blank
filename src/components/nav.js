import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Dropdown from './dropdown'
import { CSSTransitionGroup } from 'react-transition-group'
import facebookLogo from '../img/logo-facebook.png'
import instaLogo from '../img/logo-instagram.svg'

class Nav extends Component {
	constructor(props) {
    super(props);
    this.state = {
      hidden: true
    };
    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  toggleDropdown() {
    this.setState(prevState => ({
      hidden: !prevState.hidden
    }));
  }

  closeDropdown() {
  	this.setState({
      hidden: true
    });
  }

	render() {
		return (
			<div>
				<div className={'nav-wrap'}>
					<div className={'link-wrap'}>
						<Link className={'menu-item'} to='/' onClick={(e) => this.closeDropdown(e)}>HOME</Link>
					</div>
					<div className={'link-wrap'}>
						 <a onClick={(e) => this.toggleDropdown(e)} className={'menu-item clickdown'}>PRODUCTS</a>
					</div>
          <CSSTransitionGroup
            transitionName="dropmenu"
            transitionEnterTimeout={300}
            transitionLeaveTimeout={300}
            className="transition-span"
          >
            {this.state.hidden ? null :
              <div className='dropdown-wrap'>
                <div className="dropdown">
    	            <Link className={'menu-item dropdown-item'} to='/underwear' onClick={(e) => this.closeDropdown(e)}>UNDERWEAR</Link>
    	            <Link className={'menu-item dropdown-item'} to='/lounge' onClick={(e) => this.closeDropdown(e)}>SLEEPWEAR&nbsp;&amp;&nbsp;LOUNGEWEAR</Link>
    	            <Link className={'menu-item dropdown-item'} to='/socks' onClick={(e) => this.closeDropdown(e)}>SOCKS</Link>
    	            <Link className={'menu-item dropdown-item'} to='/accessories' onClick={(e) => this.closeDropdown(e)}>TRAVEL ACCESSORIES</Link>
    	          </div>
              </div>
            }
          </CSSTransitionGroup>
					<div className="link-wrap">
						<Link className={'menu-item'} to='/contact' onClick={(e) => this.closeDropdown(e)}>CONTACT</Link>
					</div>
          <div className={'social-wrap'}>
            <a target="_blank" href="https://www.facebook.com/trunkanddrawer/">
              <img src={facebookLogo}/>
            </a>
            <a target="_blank" href="https://www.instagram.com/trunkanddrawer/">
              <img src={instaLogo} />
            </a>
          </div>
        </div>
			</div>
		);
	}
};

export default Nav;
