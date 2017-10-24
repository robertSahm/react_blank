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
import Socks9 from '../img/socks-page/socks9.jpg'
import Socks10 from '../img/socks-page/socks10.jpg'
import Socks11 from '../img/socks-page/socks11.jpg'
import Socks12 from '../img/socks-page/socks12.jpg'
import Socks13 from '../img/socks-page/socks13.jpg'
import Socks14 from '../img/socks-page/socks14.jpg'
import Socks15 from '../img/socks-page/socks15.jpg'
import Socks16 from '../img/socks-page/socks16.jpg'
import Socks17 from '../img/socks-page/socks17.jpg'
import Socks18 from '../img/socks-page/socks18.jpg'
import Socks19 from '../img/socks-page/socks19.jpg'

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

          <div className={'img-row'}> {/* 5 */}
            <img className={'three'} src={Socks16} />
            <img className={'three'} src={Socks17} />
            <img className={'three'} src={Socks19} />
          </div>

          <div className={'img-row'}> {/* 6 */}
            <img className={'two'} src={Socks15} />
            <img className={'two'} src={Socks18} />
          </div>

          <div className={'img-row'}>  {/* 1 */}
            <img className={'four'} src={Socks2} />
            <img className={'four'} src={Socks1} />
            <img className={'four'} src={Socks3} />
            <img className={'four'} src={Socks4} />
          </div>

          <div className={'img-row'}> {/* 2 */}
            <img className={'three'} src={Socks6} />
            <img className={'three'} src={Socks9} />
            <img className={'three'} src={Socks10} />
          </div>

          <div className={'img-row'}> {/* 4 */}
            <img className={'three'} src={Socks12} />
            <img className={'three'} src={Socks13} />
            <img className={'three'} src={Socks14} />
          </div>

          <div className={'img-row'}> {/* 3 */}
            <img className={'two'} src={Socks5} />
            <img className={'two'} src={Socks7} />
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

