import React from 'react'
import "./Map.css"
import {Map as LeafletMap, TileLayer} from 'react-leaflet'
import { showDataOnMap } from './util'
//We download the react-leaflet version 2.7.0
//center is where the map starts the lat and long , zoom (how far at begining)
function Map({countries,casesType , center , zoom}) {
    return (
        <div className = "map">
            <LeafletMap center={center} zoom={zoom}>
            <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
            {showDataOnMap(countries , casesType)}
            </LeafletMap>
        </div>
    )
}

export default Map
