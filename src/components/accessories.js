import React, { Component } from 'react'
import Line from '../img/line.svg'
import '../styles/accessories-page.css'
// images
import Acc1 from '../img/accessories-page/acc1.jpg'
import Acc2 from '../img/accessories-page/acc2.jpg'
import Acc3 from '../img/accessories-page/acc3.jpg'
import Acc4 from '../img/accessories-page/acc4.jpg'
import Acc5 from '../img/accessories-page/acc5.jpg'
import Acc7 from '../img/accessories-page/acc7.jpg'
import Acc8 from '../img/accessories-page/acc8.jpg'
import Acc9 from '../img/accessories-page/acc9.jpg'
import Acc10 from '../img/accessories-page/acc10.jpg'
import Acc11 from '../img/accessories-page/acc11.jpg'
import Acc12 from '../img/accessories-page/acc12.jpg'
import Acc13 from '../img/accessories-page/acc13.jpg'
import Acc14 from '../img/accessories-page/acc14.jpg'
import Acc16 from '../img/accessories-page/acc16.jpg'
import Acc17 from '../img/accessories-page/acc17.jpg'
import Acc18 from '../img/accessories-page/acc18.jpg'
import Acc19 from '../img/accessories-page/acc19.jpg'
import Acc20 from '../img/accessories-page/acc20.jpg'

class Accessories extends Component {
  render() {
    return (
      <div className={'accessories-wrap'}>
        <div className={'page-header'} >
          <h1>Travel Accessories</h1>
          <p>Trunk and Drawer carries the finest handcrafted leather goods and umbrellas carefully constructed for the worldly traveler and professional gentleman.
          </p>
          <p>
            <span>Brands:</span><br/>
            Ettinger, Hook & Albert, Pasotti
           </p>
        </div>
        <div className={'line'}>
          <img src={Line} />
        </div>

        <div className={'images-wrap'}>

          <div className={'img-row'}>
            <img className={'three'} src={Acc2} />
            <img className={'three'} src={Acc1} />
            <img className={'three'} src={Acc3} />
          </div>

          <div className={'img-row'}>
            <img className={'two'} src={Acc5} />
            <img className={'two'} src={Acc4} />
          </div>

          <div className={'img-row'}>
            <img className={'three'} src={Acc8} />
            <img className={'three'} src={Acc9} />
            <img className={'three'} src={Acc10} />
          </div>

          <div className={'img-row'}>
            <img className={'two'} src={Acc12} />
            <img className={'two'} src={Acc14} />
          </div>

          <div className={'img-row'}>
            <img className={'two'} src={Acc19} />
            <img className={'two'} src={Acc20} />
            {/*<img className={'two'} src={Acc15} />*/}
          </div>

          <div className={'img-row'}>
            <img className={'three'} src={Acc16} />
            <img className={'three'} src={Acc17} />
            <img className={'three'} src={Acc18} />
          </div>

        </div>
        <div className={'line'}>
          <img src={Line} />
        </div>
      </div>
    )
  }
}

export default Accessories

