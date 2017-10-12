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
        <div className={'page-header'} >
          <h1>Underwear</h1>
          <p>Trunk and Drawer features a broad selection of men's briefs, trunks, boxer briefs and boxers in a variety of brands and materials, curated for superior luxury and comfort.
          </p>
          <p>
            <span>Brands:</span><br/>
            2UNDR, Derek Rose, Hanro, HOM, MyPakage, Saxx, SPANX, Tani, Tommy John, Wood
           </p>
        </div>
        <div className={'line'}>
          <img src={Line} />
        </div>
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

