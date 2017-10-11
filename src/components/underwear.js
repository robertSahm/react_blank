import React, { Component } from 'react'
import Line from '../img/line.svg'
import '../styles/underwear-page.css'
// images
import Underwear1 from '../img/underwear-page/und-page-1.jpg'
import Underwear2 from '../img/underwear-page/und-page-2.jpg'
import Underwear3 from '../img/underwear-page/und-page-3.jpg'
import Underwear4 from '../img/underwear-page/und-page-4.jpg'
import Underwear5 from '../img/underwear-page/und-page-5.jpg'
import Underwear6 from '../img/underwear-page/und-page-6.jpg'

class Underwear extends Component {


  render() {
    return (
      <div className={'underwear-wrap'}>
        <div className={'images-wrap'}>
          <div className={'img-wrap'}>
            <img src={Underwear1} />
          </div>
          <div className={'img-wrap'}>
            <img src={Underwear2} />
          </div>
          <div className={'img-wrap'}>
            <img src={Underwear3} />
          </div>
          <div className={'img-wrap'}>
            <img src={Underwear4} />
          </div>
          <div className={'img-wrap'}>
            <img src={Underwear5} />
          </div>
          <div className={'img-wrap'}>
            <img src={Underwear6} />
          </div>
        </div>
        <div className={'line'}>
          <img src={Line} />
        </div>
      </div>
    )
  }
}

export default Underwear

