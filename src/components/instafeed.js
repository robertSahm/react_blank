import React, { Component } from 'react'
import Instafeed from 'react-instafeed'
import InstaLogo from '../img/logo-instagram.svg'
import '../styles/instafeed.css'

class InstafeedComponent extends Component {
  render() {
    const instafeedTarget = 'instafeed'
    return (
    <div>
      <div className="insta-header">
        <img className={'insta-logo'} src={InstaLogo} />
        <h1 className={'insta-header-text'}>
          <span>@</span>TrunkAndDrawer
          </h1>
      </div>
      <div id={instafeedTarget}>
        <Instafeed
          limit='5'
          ref='instafeed'
          resolution='standard_resolution'
          sortBy='most-recent'
          target={instafeedTarget}
          userId='4706293043'
          clientId='ac5be985aadf4a6b9146d17dec8f3973'
          accessToken='4706293043.ac5be98.4743bffb7ac14279acdbf10046a63ffa'
          template='
            <div class="post">
              <img src="{{image}}" />
            </div>
          '
        />
      </div>
    </div>
    )
  }
}

export default InstafeedComponent

/*
curl -F 'client_id=ac5be985aadf4a6b9146d17dec8f3973' \
    -F 'client_secret=e425ebad5f1346a5ba35ec2407aa31a0' \
    -F 'grant_type=authorization_code' \
    -F 'redirect_uri=https://trunkanddrawer.com/sorry' \
    -F 'code=CODE' \
    https://api.instagram.com/oauth/access_token
*/
