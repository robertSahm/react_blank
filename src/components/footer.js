import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Textfit } from 'react-textfit'
import LogoFooter from "../img/logo-footer.svg"
import '../styles/footer.css'
import '../styles/typography.css'
// import '../styles/home.css'

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

        <div className={'footer-logo-wrap'}>
          <img className={''} src={LogoFooter} />
        </div>

        <div className={'address-row'}>
          <div className={'address-box'}>
            <Textfit mode="single">
              <span className={'text-gold'}>3109 M ST NW</span>
            </Textfit>
            <Textfit mode="single">
              <span className={'text-light-brown'}>WASHINGTON, DC 20007</span>
            </Textfit>
            <Textfit mode="single">
               <span className={'text-light-green'}>(202) 333-4213</span>
             </Textfit>
            <Textfit mode="single">
               <span className={'text-dark-green'}>MON-TH 10am - 7:30pm</span>
             </Textfit>
             <Textfit mode="single">
               <span className={'text-dark-brown lighten'}>FRI-SAT 10am - 8:30pm</span>
             </Textfit>
            <Textfit mode="single">
              <span className={'text-dark-brown'}>SUNDAY 11am - 6pm</span>
            </Textfit>
          </div>
        </div>
        <h5 className={'copyright text-gold'}>coppyright © 2017 Trunk and Drawer LLC</h5>
      </div>
    )
  }
}

export default Footer
