'use client';

import { getSchool } from '@/lib/getSchool';
import type { Prisma, School } from '@prisma/client';
import { error } from 'console';
import getLatLong from '@/lib/getLatLong';
import getMap from '@/lib/getMap';
import Image from 'next/image';
import Map, { NavigationControl, GeolocateControl } from 'react-map-gl';
import classes from './page.module.css';

const About = () => {
  // const location = await getLatLong('2134 Santa Ynez Ave San Luis Obispo');
  // const map = getMap();
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  return (
    <div>
      <h1>About Page</h1>
      {/* <p>{`${location[1]}, ${location[0]}`}</p> */}
      {/* <Image
        src={
          'https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/-120.6632,35.3037,12.65,0/300x200?access_token=pk.eyJ1IjoibW9zaWVya3lsZSIsImEiOiJjbHN0bXR5NGswMDRzMm1ycWZxdHE3cnpsIn0.WBrqwng_VnG7M3yg6AIo5g'
        }
        width={50}
        height={50}
        alt={'map'}
      /> */}
      <div className={classes.mainStyle}>
        <Map
          mapboxAccessToken={mapboxToken}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          // style={classes.mapStyle}
          initialViewState={{
            latitude: 35.668641,
            longitude: 139.750567,
            zoom: 10,
          }}
          maxZoom={20}
          minZoom={3}
        >
          <GeolocateControl position="top-left" />
          <NavigationControl position="top-left" />
        </Map>
      </div>
    </div>
  );
};

export default About;
