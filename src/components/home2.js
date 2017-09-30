import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router-dom'
import { Textfit } from 'react-textfit'
import GoogleMap from './googlemap'
import Footer from './footer'
import LogoFull from '../img/LogoFull.svg'

// Carousel
import { Carousel } from './react-responsive-carousel';
import styles from '../styles/carousel.css'

// Images
  // General Page Images
import ArrowLeft from '../img/arrow-left.svg'
import ArrowRight from '../img/arrow-right.svg'
import HandLine from '../img/hand-line.svg'

  // Underwear
import Graham1 from '../img/underwear/Robert_Graham_stage_1.jpg'
import Hanro1 from '../img/underwear/hanro_1.jpg'
import Hom1 from '../img/underwear/hom_closet.jpg'
import Wood1 from '../img/underwear/wood_1.jpg'
import Undr1 from '../img/underwear/2undr_1.jpg'
import Tani1 from '../img/underwear/tani_1.jpg'

// Lifestyle
import Undr1Lifestyle from '../img/lifestyle/Undr_1.jpg'

class Home extends Component {

  render() {

    const settings = {
      showThumbs: false,
      showStatus: false,
      dynamicHeight: true,
    }

    return (
      <div className='content-home'>
        <Carousel {...settings}>
          <img src={Undr1Lifestyle} />
          <img src={Hom1} />
          <img src={Wood1} />
          <img src={Hanro1} />
          <img src={Tani1} />
        </Carousel>
      </div>
    )
  }
}

export default Home
