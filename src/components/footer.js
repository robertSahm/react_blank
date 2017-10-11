import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import AddressBox from './address-box'
import LogoFooter from '../img/logo-footer.svg'
import '../styles/footer.css'
import '../styles/typography.css'
import facebookLogo from '../img/logo-facebook.png'
import instaLogo from '../img/logo-instagram.svg'

class Footer extends Component {
  render() {
    return (
      <div className={'footer-wrap'}>

        <div className={'footer-nav-wrap'}>
          <Link className={'menu-item'} to='/home'>HOME</Link>
          <Link className={'menu-item'} to='/home'>CONTACT</Link>
          <Link className={'menu-item'} to='/underwear'>UNDERWEAR</Link>
          <Link className={'menu-item'} to='/lounge'>SLEEPWEAR&nbsp;&amp;&nbsp;LOUNGEWEAR</Link>
          <Link className={'menu-item'} to='/socks'>SOCKS</Link>
          <Link className={'menu-item'} to='/accessories'>TRAVEL ACCESSORIES</Link>
        </div>

        <div className={'social-wrap'}>
          <img src={facebookLogo} />
          <img src={instaLogo} />
        </div>

        <div className={'footer-logo-wrap'}>
          <img className={''} src={LogoFooter} />
        </div>

        <div className={'address-row'} >
          <AddressBox />
        </div>

        <h5 className={'copyright text-gold'}>coppyright © 2017 Momentum Retail LLC</h5>
      </div>
    )
  }
}

export default Footer
