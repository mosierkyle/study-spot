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
import Stars from '../components/stars/stars';
import Image from 'next/image';

const About = () => {
  return (
    <main className={styles.mainStyle}>
      <Stars rating={4.5} />
    </main>
  );
};

export default About;
