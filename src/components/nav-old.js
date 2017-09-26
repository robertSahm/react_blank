import React from 'react'
import { Link } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu'
import Dropdown from './dropdown'

const CreateLink = (props) => {
	const { path, to, text, clickdown } = props;
	return (
		<Link
			replace={(()=>to===path)()}
			to={to}
		>
			{text}
		</Link>
	);
};

// send pathname prop to dropdown to close if not 'products' link

const cueDropdown = (props) => {
	console.log(props)
}

const Nav = (props) => {
	const { pathname } = props.location;
	// const { clickdown } = props.clickStatus;

	return (
		<div>
			<div className={'nav-wrap'}>
				<div className={'link-wrap'} onClick={cueDropdown}>
					<CreateLink className={'menu-item'}
					path={pathname} to='/' text='HOME'

					/>
				</div>
				<Dropdown {...props} />
				<div className="link-wrap" onClick={cueDropdown}>
					<CreateLink className={'menu-item'} path={pathname} to='/contact' text='CONTACT' />
				</div>
			</div>
			{/*<div className={'nav-mobile-wrap'}>
				<Menu>
					<CreateLink className={'menu-item'} path={pathname} to='/' text='Home' />
					<CreateLink className={'menu-item'} path={pathname} to='/services' text='services' />
					<CreateLink className={'menu-item'} path={pathname} to='/images' text='Images' />
				</Menu>
			</div>*/}
		</div>
	);
};

export default Nav;
