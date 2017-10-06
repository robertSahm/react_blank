import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router-dom'
import { Textfit } from 'react-textfit'
import GoogleMap from './googlemap'
import Footer from './footer'
import LogoFull from '../img/LogoFull.svg'
import InstafeedComponent from './instafeed'

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
import Underwear1 from '../img/underwear/underwear-1-hd.jpg'
import Underwear2 from '../img/underwear/underwear-2.jpg'
import Underwear3 from '../img/underwear/underwear-3.jpg'
import Underwear4 from '../img/underwear/underwear-4.jpg'
import Underwear5 from '../img/underwear/underwear-5.jpg'

// Loungewear
import Lounge1 from '../img/loungewear/lounge-1.jpg'
import Lounge2 from '../img/loungewear/lounge-2.jpg'
import Lounge3 from '../img/loungewear/lounge-3.jpg'

// Socks
import Socks1 from '../img/socks/socks-1.jpg'
import Socks2 from '../img/socks/socks-2.jpg'
import Socks3 from '../img/socks/socks-3.jpg'
import Socks4 from '../img/socks/socks-4.jpg'
import Socks5 from '../img/socks/socks-5.jpg'
import Socks6 from '../img/socks/socks-6.jpg'
import Socks7 from '../img/socks/socks-7.jpg'
import Socks8 from '../img/socks/socks-8.jpg'

// TravAcccessories
import Acc1 from '../img/accessories/acc-1.jpg'
import Acc2 from '../img/accessories/acc-2.jpg'
import Acc3 from '../img/accessories/acc-3.jpg'
import Acc4 from '../img/accessories/acc-4.jpg'
import Acc5 from '../img/accessories/acc-5.jpg'
import Acc6 from '../img/accessories/acc-6.jpg'
import Acc7 from '../img/accessories/acc-7.jpg'
import Acc8 from '../img/accessories/acc-8.jpg'
import Acc9 from '../img/accessories/acc-9.jpg'

// Lifestyle

  // Logos
import LogoRow1 from '../img/logos/logo-row-1.png'
import LogoRow2 from '../img/logos/logo-row-2.png'
import LogoRow3 from '../img/logos/logo-row-3.png'
import LogoRow4 from '../img/logos/logo-row-4.png'

// Store Shots
import StoreShot1 from '../img/store/store-1.jpg'
import StoreShot2 from '../img/store/store-2.jpg'


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

        <div className="carousel-wrapper edge-pad">
          <Carousel {...settings}>
            <img src={Underwear1} />
            <img src={Underwear2} />
            <img src={Underwear3} />
            <img src={Underwear4} />
            <img src={Underwear5} />
          </Carousel>
          <CreateLink path={pathname} to='/underwear' text='UNDERWEAR' />
        </div>

        <div className="carousel-wrapper edge-pad">
          <Carousel {...settings}>
            <img src={Lounge1} />
            <img src={Lounge2} />
            <img src={Lounge3} />
          </Carousel>
          <CreateLink path={pathname} to='/loungewear' text='SLEEP AND LOUNGEWEAR' />
        </div>

        <div className={'row half-wrap'}>
          <div className="carousel-wrapper half small-img">
            <Carousel {...settings}>
              <img src={Socks6} />
              <img src={Socks2} />
              <img src={Socks1} />
              <img src={Socks3} />
              <img src={Socks4} />
              <img src={Socks5} />
              <img src={Socks7} />
              <img src={Socks8} />
            </Carousel>
            <CreateLink path={pathname} to='/socks' text='SOCKS' />
          </div>
          <div className="carousel-wrapper half small-img">
            <Carousel {...settings}>
              <img src={Acc2} />
              <img src={Acc1} />
              <img src={Acc3} />
              <img src={Acc4} />
              <img src={Acc5} />
              <img src={Acc6} />
              <img src={Acc7} />
              <img src={Acc8} />
              <img src={Acc9} />
            </Carousel>
            <CreateLink path={pathname} to='/accessories' text='TRAVEL ACCESSORIES' />
          </div>
        </div>

        <div className={'store-shot-row'}>
          <img src={StoreShot2} />
          <img src={StoreShot1} />
        </div>

        <div className={'address-row'}>
          <div className={'address-box'}>
            <Textfit mode="single">
              <span className={'text-gold'}>3109 M ST NW</span>
            </Textfit>
            <Textfit mode="single">
              <span className={'text-light-brown'}>WASHINGTON, DC 20007</span>
            </Textfit>
            <Textfit mode="single">
               <span className={'text-light-green'}>(202) 333-4213</span>
             </Textfit>
            <Textfit mode="single">
               <span className={'text-dark-green'}>MON-TH | 10 am - 7:30 pm</span>
             </Textfit>
             <Textfit mode="single">
               <span className={'text-dark-brown lighten'}>FRI-SAT | 10 am - 8:30 pm</span>
             </Textfit>
            <Textfit mode="single">
              <span className={'text-dark-brown'}>SUNDAY | 11 am - 6 pm</span>
            </Textfit>
          </div>
          <div className="map-wrap">
            <GoogleMap />
          </div>
        </div>

        <div className={'line'}>
          <img src={Line} />
        </div>

        <InstafeedComponent />

        <div className={'line'}>
          <img src={Line} />
        </div>

        <div className="logo-carousel">
          <img src={LogoRow1} />
          <img src={LogoRow2} />
          <img src={LogoRow3} />
          <img src={LogoRow4} />
        </div>

        <div className={'line'}>
          <img src={Line} />
        </div>

        <Footer />
      </div>
    )
  }
}

export default Home


