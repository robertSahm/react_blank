import React, { Component } from 'react';
import Instafeed from 'react-instafeed';

class InstafeedComponent extends Component {
  render() {
    const instafeedTarget = 'instafeed';
    return (
      <div id={instafeedTarget}>
      <Instafeed
        limit='5'
        ref='instafeed'
        resolution='standard_resolution'
        sortBy='most-recent'
        target={instafeedTarget}
        template=''
        userId='trunkanddrawer'
        clientId='ac5be985aadf4a6b9146d17dec8f3973'
        accessToken='e425ebad5f1346a5ba35ec2407aa31a0'
      />
      </div>
    )
  }
}

export default InstafeedComponent;
