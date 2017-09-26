import React from 'react';
import headerLogo from "../img/Logo.TrunkAndDrawer.svg";
import LogoFull from "../img/LogoFull.svg";

const Header = () => {
	return(
		<div className={'header-wrap'}>
			<div className={'logo-wrap'}>
				<img className={'logo-full-img'} src={LogoFull} />
			</div>
		</div>
	);
};

export default Header;
