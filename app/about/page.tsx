'use client';

import { getSchool } from '@/lib/getSchool';
import type { Prisma, School } from '@prisma/client';
import { error } from 'console';
import type { FeatureCollection } from 'geojson';
import Map, {
  NavigationControl,
  GeolocateControl,
  Source,
  Layer,
} from 'react-map-gl';
import styles from './page.module.css';
import type { CircleLayer } from 'react-map-gl';
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
interface Props {
  params: {
    school: string;
  };
}

const About = () => {
  // const [viewState, setViewState] = useState({
  //   latitude: 35.305,
  //   longitude: -120.6625,
  //   zoom: 14.5,
  //   pitch: 0,
  // });

  // const location = await getLatLong('2134 Santa Ynez Ave San Luis Obispo');
  // const map = getMap();
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const mapContainer = useRef<any>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(-120.6625);
  const [lat, setLat] = useState(35.305);
  const [zoom, setZoom] = useState(12);

  useEffect(() => {
    mapboxgl.accessToken = mapboxToken ?? '';
    if (!mapContainer.current || map.current) {
      return;
    }
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className={styles.mainStyle}>
      {/* <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={mapboxToken}
        mapStyle="mapbox://styles/mapbox/light-v8"
        style={{ height: 400 }}
        maxZoom={15}
        minZoom={10}
        reuseMaps
      ></Map> */}
      <div className={styles.mapContainer} ref={mapContainer}></div>
    </main>
  );
};

export default About;
