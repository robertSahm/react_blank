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
        <div className="carousel-wrapper margins">
          <Carousel {...settings}>
            <img src={DR_3} />
            <img src={UndrLifestyle1} />
            <img src={Spanx1} />
            <img src={UndrLifestyle2} />
            <img src={UndrLifestyle3} />
          </Carousel>
          <CreateLink path={pathname} to='/loungewear' text='SLEEP AND LOUNGEWEAR' />
        </div>
        <div className="carousel-wrapper third">
          <Carousel {...settings}>
            <img src={Falke1} />
            <img src={Falke2} />
            <img src={Falke3} />
            <img src={Falke5} />
          </Carousel>
          <CreateLink path={pathname} to='/loungewear' text='SOCKS' />
        </div>
        <div className="carousel-wrapper third">
          <Carousel {...settings}>
            <img src={Falke1} />
            <img src={Falke2} />
            <img src={Falke3} />
            <img src={Falke5} />
          </Carousel>
          <CreateLink path={pathname} to='/loungewear' text='SOCKS' />
        </div>
      </div>
    )
  }
}

export default Home
