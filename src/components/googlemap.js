import React, { Component } from 'react'
import mapMarker from '../img/map-marker.svg'

import { compose, withProps } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";
import InfoBox from "react-google-maps/lib/components/addons/InfoBox";
import demoFancyMapStyles from "./demoFancyMapStyles.json";

const StyledMapWithAnInfoBox = compose (
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyAVu4du-oZNQCxxpZnkfx8YKDo9zSu4WvU&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `415px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
    center: { lat: 38.904995, lng: -77.065170 },
  }),
  withScriptjs,
  withGoogleMap
)(props =>
  <GoogleMap
    defaultZoom={17}
    defaultCenter={props.center}
    defaultOptions={{ styles: demoFancyMapStyles }}
  >
    <InfoBox
      defaultPosition={new google.maps.LatLng(props.center.lat, props.center.lng)}
      options={{ closeBoxURL: ``, enableEventPropagation: true }}
    >
      <div style={{
        backgroundColor: `transparent`,
        opacity: '1',
        margin: '0',
        padding: '0px'
      }}>
        <img src={mapMarker} />
      </div>
    </InfoBox>
  </GoogleMap>
);

export default StyledMapWithAnInfoBox
