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
import Graham_1 from '../img/underwear/Robert_Graham_stage_1.jpg'
import Hanro_1 from '../img/underwear/hanro_1.jpg'
import Hom_1 from '../img/underwear/hom_closet.jpg'
import Wood_1 from '../img/underwear/wood_1.jpg'
import Undr_1 from '../img/underwear/2undr_1.jpg'
import Tani_1 from '../img/underwear/tani_1.jpg'

  // Sleep and Loungewear

  // Socks

  // Travel Accessories


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
    centerMode: false,
    infinite: false,
    autoPlay: true,
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
        <img src={Hom_1} />
        <img src={Wood_1} />
        <img src={Hanro_1} />
        <img src={Undr_1} />
        <img src={Tani_1} />
      </Slider>
      <CreateLink path={pathname} to='/contact' text='MORE UNDERWEAR' />

      <Slider {...settings}>
        <img src={Graham_1} />

      </Slider>
      <CreateLink path={pathname} to='/contact' text='MORE LOUNGEWEAR AND SLEEPWEAR' />

      <Slider {...settings}>
        <img src={Graham_1} />

      </Slider>
      <CreateLink path={pathname} to='/contact' text='MORE SOCKS' />

      <Slider {...settings}>
        <img src={Graham_1} />

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
          <GoogleMap />
        </div>
      </div>

      <Footer />

		</div>
	);
}

export default Home
