import React, { Component } from 'react'
import { Textfit } from 'react-textfit'
import AddressBox from './address-box'
import GoogleMap from './googlemap'
import LineSmall from '../img/line-small.svg'
import '../styles/contact.css'
import '../styles/typography.css'

class Contact extends Component {

  render() {
    return (
      <div className={'contact-wrap'}>
        <div className={'line'}>
          <img src={LineSmall} />
        </div>
        <div className={'email-wrap'}>
          <a href="mailto:info@trunkanddrawer.com">
            INFO@TRUNKANDDRAWER.COM
          </a>
        </div>
        <div className={'line'}>
          <img src={LineSmall} />
        </div>
        <div className={'address-row'} >
          <AddressBox />
          <div className={'map-wrap'}>
            <GoogleMap />
          </div>
        </div>
      </div>
    )
  }
}

export default Contact
