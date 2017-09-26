import React, { Component } from 'react'
import { Link } from 'react-router-dom';

class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: false,
      props: this.props,
      pathname: this.props.pathname
    };
    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  componentDidMount(props) {
    this.setState({
      pathname: this.props.pathname
    })
    console.log(this.props.location)
  }

  toggleDropdown() {
    this.setState(prevState => ({
      hidden: !prevState.hidden
    }));
  }

  // closeDropdown() {
  //   if(this.state.pathname) {
  //     this.setState({ hidden: true })
  //   }
  // }


  render() {
    return (
      <div className={'dropdown-row'}>
        <div className="link-wrap">
          <a onClick={(e) => this.toggleDropdown(e)} className={'menu-item clickdown'}>PRODUCTS</a>
        </div>
        <div className='dropdown-wrap'>
          {this.state.hidden ? null :
            <div className="dropdown">
              <Link className={'menu-item dropdown-item'} to='/underwear'>UNDERWEAR</Link>
              <Link className={'menu-item dropdown-item'} to='/lounge'>SLEEPWEAR&nbsp;&amp;&nbsp;LOUNGEWEAR</Link>
              <Link className={'menu-item dropdown-item'} to='/accessories'>TRAVEL ACCESSORIES</Link>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default Dropdown
