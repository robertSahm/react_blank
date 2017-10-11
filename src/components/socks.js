import React, { Component } from 'react'
import Line from '../img/line.svg'
import '../styles/socks-page.css'
// images
import Socks1 from '../img/socks-page/socks1.jpg'
import Socks2 from '../img/socks-page/socks2.jpg'
import Socks3 from '../img/socks-page/socks3.jpg'
import Socks4 from '../img/socks-page/socks4.jpg'
import Socks5 from '../img/socks-page/socks5.jpg'
import Socks6 from '../img/socks-page/socks6.jpg'
import Socks7 from '../img/socks-page/socks7.jpg'
import Socks8 from '../img/socks-page/socks8.jpg'
import Socks9 from '../img/socks-page/socks9.jpg'
import Socks10 from '../img/socks-page/socks10.jpg'
import Socks11 from '../img/socks-page/socks11.jpg'
import Socks12 from '../img/socks-page/socks12.jpg'
import Socks13 from '../img/socks-page/socks13.jpg'

class Socks extends Component {
  render() {
    return (
      <div className={'socks-wrap'}>
        <div className={'images-wrap'}>

          <div className={'img-row four'}>
            <div className={'img-wrap'}>
              <img src={Socks1} />
            </div>
            <div className={'img-wrap'}>
              <img src={Socks2} />
            </div>
            <div className={'img-wrap'}>
              <img src={Socks3} />
            </div>
            <div className={'img-wrap'}>
              <img src={Socks4} />
            </div>
          </div>

          <div className={'img-row four'}>
            <div className={'img-wrap'}>
              <img src={Socks5} />
            </div>
            <div className={'img-wrap'}>
              <img src={Socks6} />
            </div>
            <div className={'img-wrap'}>
              <img src={Socks7} />
            </div>
            <div className={'img-wrap'}>
              <img src={Socks11} />
            </div>
          </div>

          <div className={'img-row three'}>
            <div className={'img-wrap'}>
              <img src={Socks8} />
            </div>
            <div className={'img-wrap'}>
              <img src={Socks9} />
            </div>
            <div className={'img-wrap'}>
              <img src={Socks13} />
            </div>
          </div>

          <div className={'img-row two'}>
            <div className={'img-wrap'}>
              <img src={Socks10} />
            </div>
            <div className={'img-wrap'}>
              <img src={Socks12} />
            </div>
          </div>


        </div>


        <div className={'line'}>
          <img src={Line} />
        </div>
      </div>
    )
  }
}

export default Socks

