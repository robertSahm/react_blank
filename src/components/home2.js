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
import Line from '../img/line.svg'

  // Underwear
import Graham1 from '../img/underwear/Robert_Graham_stage_1.jpg'
import Hanro1 from '../img/underwear/hanro_1.jpg'
import Hom1 from '../img/underwear/hom_closet.jpg'
import Wood1 from '../img/underwear/wood_1.jpg'
import Undr1 from '../img/underwear/2undr_1.jpg'
import Tani1 from '../img/underwear/tani_1.jpg'
import Spanx1 from '../img/underwear/spanx_3.jpg'

  // Lifestyle
import UndrLifestyle1 from '../img/lifestyle/Undr_1.jpg'
import UndrLifestyle2 from '../img/lifestyle/Undr_2.jpg'
import UndrLifestyle3 from '../img/lifestyle/Undr_3.jpg'

  // Loungewear
import DR_3 from '../img/loungewear/derek_rose_3.jpg'

  // Socks
import Falke1 from '../img/socks/falke_1.jpg'
import Falke2 from '../img/socks/falke_2.jpg'
import Falke3 from '../img/socks/falke_3.jpg'
import Falke4 from '../img/socks/falke_4.jpg'
import Falke5 from '../img/socks/falke_5.jpg'

  // Travel Accessories
import Ettinger1 from '../img/accessories/ettinger_box_1.jpg'
import Ettinger2 from '../img/accessories/ettinger_canteen_1.jpg'
import Ettinger3 from '../img/accessories/ettinger_duffel_1.jpg'
import Ettinger4 from '../img/accessories/ettinger_keychain_1.jpg'
import Ettinger5 from '../img/accessories/ettinger_passport_1.jpg'
import HookAndAlbert1 from '../img/accessories/hookandalbert_briefcase_1.jpg'
import HookAndAlbert2 from '../img/accessories/hookandalbert_duffel_2.jpg'
import HookAndAlbert3 from '../img/accessories/hookandalbert_duffel_3.jpg'

  // Logos
import LogoRow1 from '../img/logos/logo-row-1.png'
import LogoRow2 from '../img/logos/logo-row-2.png'
import LogoRow3 from '../img/logos/logo-row-3.png'
import LogoRow4 from '../img/logos/logo-row-4.png'

import InstafeedComponent from './instafeed'

const CreateLink = (props) => {
  const {path, to, text} = props;
  return (
    <Link
      replace={(()=>to===path)()}
      to={to}
    >
      <h3 className={'text-light text-wide text-center header-link'}>{text}</h3>
      <img className={'hand-line'} src={HandLine} />
    </Link>
  );
};


class Home extends Component {
  render() {
    const settings = {
      showThumbs: false,
      showStatus: false,
      dynamicHeight: false,
    }

    const { pathname } = this.props.location;

    return (
      <div className='content-home'>

        <div className="carousel-wrapper">
          <Carousel {...settings}>
            <img src={Spanx1} />
            <img src={UndrLifestyle1} />
            <img src={DR_3} />
            <img src={UndrLifestyle2} />
            <img src={UndrLifestyle3} />
          </Carousel>
          <CreateLink path={pathname} to='/underwear' text='UNDERWEAR' />
        </div>

        <div className="carousel-wrapper edge-pad">
          <Carousel {...settings}>
            <img src={UndrLifestyle1} />
            <img src={DR_3} />
            <img src={Spanx1} />
            <img src={UndrLifestyle2} />
            <img src={UndrLifestyle3} />
          </Carousel>
          <CreateLink path={pathname} to='/loungewear' text='SLEEP AND LOUNGEWEAR' />
        </div>

        <div className={'row'}>
          <div className="carousel-wrapper half small-img">
            <Carousel {...settings}>
              <img src={Falke2} />
              <img src={Falke1} />
              <img src={Falke3} />
              <img src={Falke4} />
            </Carousel>
            <CreateLink path={pathname} to='/socks' text='SOCKS' />
          </div>
          <div className="carousel-wrapper half small-img">
            <Carousel {...settings}>
              <img src={Ettinger2} />
              <img src={Ettinger1} />
              <img src={Ettinger3} />
              <img src={Ettinger4} />
              <img src={Ettinger5} />
            </Carousel>
            <CreateLink path={pathname} to='/accessories' text='TRAVEL ACCESSORIES' />
          </div>
        </div>

        <div className="carousel-wrapper logo-carousel edge-pad">
          <img src={LogoRow1} />
          <img src={LogoRow2} />
          <img src={LogoRow3} />
          <img src={LogoRow4} />
        </div>

        <div className={'row'}>
          <img className={'line'} src={Line} />
        </div>
        <InstafeedComponent />
        <div className={'row'}>
          <img className={'line'} src={Line} />
        </div>


{/*        <div className={'address-row'}>

          <div className={'address-box'}>
            <Textfit mode="single">
              <span className={'text-gold'}>3276 M ST NW</span>
            </Textfit>
            <Textfit mode="single">
              <span className={'text-light-brown'}>WASHINGTON, DC 20007</span>
            </Textfit>
            <Textfit mode="single">
               <span className={'text-light-green'}>(202) 342-2500</span>
             </Textfit>
            <Textfit mode="single">
               <span className={'text-dark-green'}>MON-FRI 10am - 6pm</span>
             </Textfit>
            <Textfit mode="single">
              <span className={'text-dark-brown'}>SAT-SUN 10am - 9pm</span>
            </Textfit>
          </div>


          <div className="map-wrap">
            <GoogleMap />
          </div>

        </div>*/}

        <Footer />
      </div>
    )
  }
}

export default Home


