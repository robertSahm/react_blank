import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Textfit } from 'react-textfit'
import GoogleMap from './googlemap'
import Footer from './footer'
import LogoFull from '../img/LogoFull.svg'

// React Carousel
import { Carousel } from 'react-carousel'
import 'react-carousel/lib/carousel.css'


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

const Home = (props) => {
  const { pathname } = props.location;

  return (
    <div className='content-home'>

      <Carousel viewportWidth="400px" cellPadding={ 5 }>
        <img src='https://placekitten.com/200/300'/>
        <img src='https://placekitten.com/300/300'/>
        <img src='https://placekitten.com/400/300'/>
      </Carousel>



      <Footer />

		</div>
	);
}

export default Home
