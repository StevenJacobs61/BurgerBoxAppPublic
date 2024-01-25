import React from 'react'
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps'

export default function Maps() {

    const position = {lat:50.772464023651075, lng:0.09994265988449393};

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY}>
        <Map zoom={15} center={position} mapId={process.env.NEXT_PUBLIC_MAP_ID}>
            <AdvancedMarker position={position}></AdvancedMarker>
        </Map>
    </APIProvider>
  )
}
