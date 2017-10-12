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

class Socks extends Component {
  render() {
    return (
      <div className={'socks-wrap'}>
        <div className={'page-header'} >
          <h1>Socks</h1>
          <p>We carry an extensive assortment of socks designed for business, fashion, formal, and casual wear, designed for the full range of activities including running, biking, hiking, and work.
          </p>
          <p>
            <span>Brands:</span><br/>
            American Trench, Darn Tough, Falke, Happy Socks, Hook & Albert, Stance (coming soon), Tommy John, VK Nagrani
           </p>
        </div>

        <div className={'line'}>
          <img src={Line} />
        </div>

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


          <div className={'img-row three'}>
            <div className={'img-wrap'}>
              <img src={Socks5} />
            </div>
            <div className={'img-wrap'}>
              <img src={Socks6} />
            </div>
            <div className={'img-wrap'}>
              <img src={Socks7} />
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
              <img src={Socks10} />
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

