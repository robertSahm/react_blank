import React, { Component } from 'react'
import Line from '../img/line.svg'
import '../styles/loungewear-page.css'
// images
import Lounge1 from '../img/loungewear-page/lounge1.jpg'
import Lounge2 from '../img/loungewear-page/lounge2.jpg'
import Lounge3 from '../img/loungewear-page/lounge3.jpg'
import Lounge4 from '../img/loungewear-page/lounge4.jpg'
import Lounge5 from '../img/loungewear-page/lounge5.jpg'
import Lounge6 from '../img/loungewear-page/lounge6.jpg'
import Lounge7 from '../img/loungewear-page/lounge7.jpg'
import Lounge8 from '../img/loungewear-page/lounge8.jpg'
import Lounge9 from '../img/loungewear-page/lounge9.jpg'
import Lounge10 from '../img/loungewear-page/lounge10.jpg'

class Loungewear extends Component {
  render() {
    return (
      <div className={'loungewear-wrap'}>
        <div className={'page-header'} >
          <h1>Sleepwear and Loungewear</h1>
          <p>Our comprehensive sleepwear and loungewear collection includes loungewear separates and sets, robes, pajamas, and tee shirts in an array of luxurious materials such as MicroModal, silk, and plush wool blends.
          </p>
          <p>
            <span>Brands:</span><br/>
            Derek Rose, Hanro, HOM, MyPakage, Robert Graham, Sleepy Jones, Tani, Tommy John, Wood
           </p>
        </div>
        <div className={'line'}>
          <img src={Line} />
        </div>
        <div className={'images-wrap'}>

          <div className={'img-wrap'}>
            <img src={Lounge7} />
          </div>
          <div className={'img-wrap'}>
            <img src={Lounge8} />
          </div>

          <div className={'img-wrap'}>
            <img src={Lounge9} />
          </div>
          <div className={'img-wrap'}>
            <img src={Lounge10} />
          </div>

          <div className={'img-wrap'}>
            <img src={Lounge5} />
          </div>
          <div className={'img-wrap'}>
            <img src={Lounge6} />
          </div>

          <div className={'img-wrap'}>
            <img src={Lounge2} />
          </div>
          <div className={'img-wrap'}>
            <img src={Lounge4} />
          </div>

          <div className={'img-wrap'}>
            <img src={Lounge3} />
          </div>
          <div className={'img-wrap'}>
            <img src={Lounge1} />
          </div>


        </div>
        <div className={'line'}>
          <img src={Line} />
        </div>
      </div>
    )
  }
}

export default Loungewear

