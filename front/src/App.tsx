import React, { useEffect, useState } from 'react';
import type { LineLayer } from 'react-map-gl';
import Map, { Layer, Source } from 'react-map-gl';

import DrawControl from './Draw-control';

const TOKEN = 'pk.eyJ1IjoiZmFrZXVzZXJnaXRodWIiLCJhIjoiY2pwOGlneGI4MDNnaDN1c2J0eW5zb2ZiNyJ9.mALv0tCpbYUPtzT7YysA2g';

const dataLayer: LineLayer = {
  id: 'data',
  type: 'line',
  paint: {
    'line-color': '#b60aef',
    'line-width': 4
  },
};

interface ICoordinates {
  valueX: string;
  valueY: string;
}

export default function App() {
  const [coordinates, setCoordinates] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(
        'http://localhost:1337/api/plots?populate=*'
    )
        .then(resp => resp.json())
        .then(json => {
          const coordinatesData = json.data;
          const result = coordinatesData.map((item: { attributes: { Coordinate: ICoordinates[] } }) => {
            return item.attributes.Coordinate.map(coordinate => {
              return [coordinate.valueX, coordinate.valueY];
            });
          });
          setCoordinates(result);
        })
        .catch(() => setError('Could not load data'));
  }, []);


  const geoJSON = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          text: 'Fort Greene'
        },
        geometry: {
          type: 'Polygon',
          coordinates: coordinates
        }
      }
    ]
  };

  if (error) return <p style={{ textAlign: 'center' }}>Could not load data. Sorry, try late...</p>;

  return (
      <>
        <Map
            initialViewState={{
              longitude: -73.9757752418518,
              latitude: 40.69144210646147,
              zoom: 16
            }}
            mapStyle='mapbox://styles/mapbox/streets-v9'
            mapboxAccessToken={TOKEN}
        >
          <DrawControl
              position='top-left'
              displayControlsDefault={false}
              controls={{
                polygon: true,
                trash: true
              }}
              defaultMode='draw_polygon'
          />
          <Source type='geojson' data={geoJSON as any}>
            <Layer {...dataLayer} />
          </Source>
        </Map>
      </>
  );
}
