import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Textfit } from 'react-textfit'
import GoogleMap from './googlemap'
import Footer from './footer'

import Slider from './react-slick/lib/index'
import '../styles/slick.css'
import '../styles/slick-theme.css'
// images
import ArrowLeft from '../img/arrow-left.svg'
import ArrowRight from '../img/arrow-right.svg'
import HandLine from '../img/hand-line.svg'
import LogoFull from '../img/LogoFull.svg'
import Graham_1 from '../img/underwear/hanro_gray_fade.jpg'
import Hanro_1 from '../img/underwear/Robert_Graham_stage_1.jpg'
import Hom_1 from '../img/underwear/hom_closet.jpg'


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
    infinite: false,
    speed: 200,
    slidesToShow: 1, //Number of slides to scroll for each navigation item
    slidesToScroll: 1, // Number of slides to be visible at a time
    variableWidth: true,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className='content-home'>

      <Slider {...settings}>
        <div><img src={Graham_1} /></div>
        <div><img src={Hanro_1} /></div>
        <div><img src={Hom_1} /></div>
        <div><img src={Graham_1} /></div>
        <div><img src={Hanro_1} /></div>
        <div><img src={Hom_1} /></div>
      </Slider>
      <CreateLink path={pathname} to='/contact' text='MORE UNDERWEAR' />

      <Slider {...settings}>
        <div><img src={Graham_1} /></div>
        <div><img src={Hanro_1} /></div>
        <div><img src={Hom_1} /></div>
        <div><img src={Graham_1} /></div>
        <div><img src={Hanro_1} /></div>
        <div><img src={Hom_1} /></div>
      </Slider>
      <CreateLink path={pathname} to='/contact' text='MORE LOUNGEWEAR AND SLEEPWEAR' />

      <Slider {...settings}>
        <div><img src={Graham_1} /></div>
        <div><img src={Hanro_1} /></div>
        <div><img src={Hom_1} /></div>
        <div><img src={Graham_1} /></div>
        <div><img src={Hanro_1} /></div>
        <div><img src={Hom_1} /></div>
      </Slider>
      <CreateLink path={pathname} to='/contact' text='MORE SOCKS' />

      <Slider {...settings}>
        <div><img src={Graham_1} /></div>
        <div><img src={Hanro_1} /></div>
        <div><img src={Hom_1} /></div>
        <div><img src={Graham_1} /></div>
        <div><img src={Hanro_1} /></div>
        <div><img src={Hom_1} /></div>
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
