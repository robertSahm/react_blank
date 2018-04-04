import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router-dom'

const CreateLink = (props) => {
  const {path, to, text} = props;
  return (
    <Link
      replace={(()=>to===path)()}
      to={to}
    >
      <h3 className={'text-light text-wide text-center header-link'}>{text}</h3>
    </Link>
  );
};

class Home extends Component {
  render() {

    const { pathname } = this.props.location;

    return (
      <div className='content-home'>

        <h1>Home!!!!</h1>
      </div>
    )
  }
}

export default Home


