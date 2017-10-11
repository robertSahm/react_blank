import React, { Component } from 'react'
import Line from '../img/line.svg'
import '../styles/accessories-page.css'
// images
import Acc1 from '../img/accessories-page/acc1.jpg'
import Acc2 from '../img/accessories-page/acc2.jpg'
import Acc3 from '../img/accessories-page/acc3.jpg'
import Acc4 from '../img/accessories-page/acc4.jpg'
import Acc5 from '../img/accessories-page/acc5.jpg'
import Acc6 from '../img/accessories-page/acc6.jpg'
import Acc7 from '../img/accessories-page/acc7.jpg'
import Acc8 from '../img/accessories-page/acc8.jpg'
import Acc9 from '../img/accessories-page/acc9.jpg'
import Acc10 from '../img/accessories-page/acc10.jpg'
import Acc11 from '../img/accessories-page/acc11.jpg'
import Acc12 from '../img/accessories-page/acc12.jpg'
import Acc13 from '../img/accessories-page/acc13.jpg'
import Acc14 from '../img/accessories-page/acc14.jpg'
import Acc15 from '../img/accessories-page/acc15.jpg'

class Accessories extends Component {
  render() {
    return (
      <div className={'accessories-wrap'}>
        <div className={'images-wrap'}>

          <div className={'img-row three'}>
            <div className={'img-wrap'}>
              <img src={Acc2} />
            </div>
            <div className={'img-wrap'}>
              <img src={Acc1} />
            </div>
            <div className={'img-wrap'}>
              <img src={Acc3} />
            </div>
          </div>


          <div className={'img-row two'}>
            <div className={'img-wrap'}>
              <img src={Acc5} />
            </div>
            <div className={'img-wrap'}>
              <img src={Acc4} />
            </div>
          </div>

          <div className={'img-row two'}>
            <div className={'img-wrap'}>
              <img src={Acc6} />
            </div>
            <div className={'img-wrap'}>
              <img src={Acc7} />
            </div>
          </div>

          <div className={'img-row three'}>
            <div className={'img-wrap'}>
              <img src={Acc8} />
            </div>
            <div className={'img-wrap'}>
              <img src={Acc9} />
            </div>
            <div className={'img-wrap'}>
              <img src={Acc10} />
            </div>
          </div>

          <div className={'img-row two'}>
            <div className={'img-wrap'}>
              <img src={Acc12} />
            </div>
            <div className={'img-wrap'}>
              <img src={Acc13} />
            </div>
          </div>

          <div className={'img-row two'}>
            <div className={'img-wrap'}>
              <img src={Acc14} />
            </div>
            <div className={'img-wrap'}>
              <img src={Acc15} />
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

export default Accessories

