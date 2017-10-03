import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Textfit } from 'react-textfit'
import Slider from './react-slick/lib/index'
import GoogleMap from './googlemap'
import Footer from './footer'

import '../styles/slick.css'
import '../styles/slick-theme.css'
import ArrowLeft from '../img/arrow-left.svg'
import ArrowRight from '../img/arrow-right.svg'
import HandLine from '../img/hand-line.svg'
import LogoFull from '../img/LogoFull.svg'

// Slider Images
  // Underwear
import Graham1 from '../img/underwear/Robert_Graham_stage_1.jpg'
import Hanro1 from '../img/underwear/hanro_1.jpg'
import Hom1 from '../img/underwear/hom_closet.jpg'
import Wood1 from '../img/underwear/wood_1.jpg'
import Undr1 from '../img/underwear/2undr_1.jpg'
import Tani1 from '../img/underwear/tani_1.jpg'

  // Sleep and Loungewear
import DerekRose1 from '../img/loungewear/derek_rose_1.jpg'
import DerekRose2 from '../img/loungewear/derek_rose_2.jpg'
import HanroLounge1 from '../img/loungewear/Hanro_1.jpg'
import HanroLounge2 from '../img/loungewear/Hanro_2.jpg'
import HanroLounge3 from '../img/loungewear/Hanro_3.jpg'
import MyPackage1 from '../img/loungewear/mypackage_1.jpg'

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

const NextArrow = (props) => {
  const {className, onClick} = props
  return (
    <div
      className={className}
      onClick={onClick}
    >
      <img src={ArrowRight} />
    </div>
  )
}

const PrevArrow = (props) => {
  const {className, onClick} = props
  return (
    <div
      className={className}
      onClick={onClick}
    >
      <img src={ArrowLeft} />
    </div>
  )
}

const Home = (props) => {
  const { pathname } = props.location;

  const settings = {
    dots: true,
    variableWidth: true,
    infinite: true,
    centerMode: false,
    slidesToShow: 1, //Number of slides to scroll for each navigation item
    slidesToScroll: 1, // Number of slides to be visible at a time
    initialSlide: 0,
    speed: 400,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className='content-home'>

      <Slider {...settings}>
        <img src={Hom1} />
        <img src={Wood1} />
        <img src={Hanro1} />
        <img src={Undr1} />
        <img src={Tani1} />
      </Slider>
      <CreateLink path={pathname} to='/contact' text='MORE UNDERWEAR' />

      <Slider {...settings}>
        <img src={DerekRose1} />
        <img src={DerekRose2} />
        <img src={HanroLounge1} />
        <img src={HanroLounge2} />
        <img src={HanroLounge3} />
        <img src={MyPackage1} />
      </Slider>
      <CreateLink path={pathname} to='/contact' text='MORE LOUNGEWEAR AND SLEEPWEAR' />

      <Slider {...settings}>
        <img src={Falke1} />
        <img src={Falke2} />
        <img src={Falke3} />
        <img src={Falke4} />
        <img src={Falke5} />
      </Slider>
      <CreateLink path={pathname} to='/contact' text='MORE SOCKS' />

      <Slider {...settings}>
        <img src={Ettinger1} />
        <img src={Ettinger2} />
        <img src={Ettinger3} />
        <img src={Ettinger4} />
        <img src={Ettinger5} />
        <img src={HookAndAlbert1} />
        <img src={HookAndAlbert2} />
        <img src={HookAndAlbert3} />
      </Slider>
      <CreateLink path={pathname} to='/contact' text='MORE TRAVEL ACCESSORIES' />

      <div className={'address-row'}>
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
          {/*<GoogleMap />*/}
        </div>
      </div>

      <Footer />

		</div>
	);
}

export default Home
