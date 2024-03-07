'use client';

import { School, StudySpot } from '@prisma/client';
import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';
import React, { useRef, useEffect, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import SpotCard from '../../components/spotCard/spotCard';
import type { LngLatLike } from 'mapbox-gl';
import marker from '../../public/icons8-location-24.png';

interface Props {
  params: {
    school: string;
  };
}

const School = ({ params: { school } }: Props) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [sort, setSort] = useState('select-one');
  const [sortedData, setSortedData] = useState<StudySpot[]>([]);
  const [filteredData, setFilteredData] = useState<StudySpot[]>([]);
  const [lng, setLng] = useState<number>(0);
  const [filters, setFilters] = useState<string[]>([]);
  const [lat, setLat] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(14.5);
  const [schoolData, setSchoolData] = useState<School | undefined>(undefined);
  const [spotsData, setSpotsData] = useState<StudySpot[]>([]);
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/school/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(school),
        });
        if (response.ok) {
          const responseData = await response.json();
          const parsedData = await responseData.school;
          setSchoolData(parsedData);
          setLat(Number(parsedData?.latitude));
          setLng(Number(parsedData?.longitude));
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchMoreData = async () => {
      try {
        const response = await fetch('/api/studySpots/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(school),
        });
        if (response.ok) {
          const responseData = await response.json();
          const parsedData = await responseData.spots;
          setSpotsData(parsedData);
          setSortedData(parsedData);
          setFilteredData(parsedData);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchMoreData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (lat != 0 && lng != 0) {
      mapboxgl.accessToken = mapboxToken ?? '';
      if (!mapContainer.current || map.current) {
        return;
      }
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [lng, lat],
        zoom: zoom,
        maxZoom: 20,
        minZoom: 14.5,
      });
      map.current?.scrollZoom.disable();
      map.current?.addControl(new mapboxgl.NavigationControl());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolData]);

  useEffect(() => {
    spotsData?.forEach((spot) => {
      if (map.current)
        new mapboxgl.Marker({ color: '#ff735c' })
          .setLngLat([Number(spot.longitude), Number(spot.latitude)])
          .addTo(map.current);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spotsData]);

  map.current?.on('move', () => {
    setLng(
      (prevLng: number) =>
        Number(map.current?.getCenter().lng.toFixed(4)) ?? prevLng
    );
    setLat(
      (prevLat: number) =>
        Number(map.current?.getCenter().lat.toFixed(4)) ?? prevLat
    );
    setZoom(
      (prevZoom: number) =>
        Number(map.current?.getZoom().toFixed(2)) ?? prevZoom
    );
  });

  useEffect(() => {
    const sortByRating = (data: StudySpot[]) => {
      const sortData = [...data];
      sortData.sort((a, b) => {
        const ratingA = a.rating ?? 0;
        const ratingB = b.rating ?? 0;
        return ratingB - ratingA;
      });
      return sortData;
    };
    const sortByReivews = (data: StudySpot[]) => {
      const sortData = [...data];
      sortData.sort((a, b) => b.reviewCount - a.reviewCount);
      return sortData;
    };
    if (sort == 'rated') {
      setSortedData(sortByRating(spotsData));
      // setFilteredData(sortByRating(filteredData));
    } else if (sort == 'reviewed') {
      setSortedData(sortByReivews(spotsData));
      // setSortedData(sortByReivews(filteredData));
    } else {
      setSortedData(spotsData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  useEffect(() => {
    const filterData = (data: StudySpot[]) => {
      const filtered = data.filter((spot) => {
        for (const filter of filters) {
          if (filter === 'studyResources') {
            if (spot.studyResources.length === 0) return false;
          } else if (!spot[filter as keyof StudySpot]) {
            return false;
          }
        }
        return true;
      });
      setFilteredData(filtered);
    };

    filterData(sortedData);
  }, [filters, sortedData]);

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    setSort(newSort);
  };

  const handleFilter = (filter: string) => {
    const index = filters.indexOf(filter);
    if (index === -1) {
      setFilters((prevFilters) => [...prevFilters, filter]);
    } else {
      setFilters((prevFilters) => prevFilters.filter((f) => f !== filter));
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.bottom}>
        <section className={styles.filters}>
          <div className={styles.filtersHeader}>Filters</div>
          <div className={styles.filterDiv}>
            {/* <p className={styles.filterHeader}>Sort</p> */}
            <div className={styles.sortBy}>
              <select
                className={styles.sortDropdown}
                onChange={handleSort}
                value={sort}
                id="dropdown"
                data-testid="sort"
              >
                <option className={styles.sortOption} value="select-one">
                  Sort By:
                </option>
                {/* <option className={styles.sortOption} value="recommended">
                  Recommended
                </option> */}
                <option className={styles.sortOption} value="rated">
                  Highest Rated
                </option>
                <option className={styles.sortOption} value="reviewed">
                  Most Reviewed
                </option>
              </select>
            </div>
          </div>
          <div className={styles.filterDiv}>
            <p className={styles.filterHeader}>Suggested</p>
            <div className={styles.suggested}>
              <div className={styles.suggestedDiv}>
                <label htmlFor="onCampus">
                  On Campus
                  <input
                    className={styles.suggestedInput}
                    type="checkbox"
                    id="onCampus"
                    name="onCampus"
                    onChange={() => handleFilter('onCampus')} // Pass the filter name to handleFilter
                    // checked={filters.onCampus}
                  />
                  <span className={styles.checkmark}></span>
                </label>
              </div>
              <div className={styles.suggestedDiv}>
                <label htmlFor="freeWifi">
                  Free Wifi
                  <input
                    type="checkbox"
                    id="freeWifi"
                    name="freeWifi"
                    className={styles.suggestedInput}
                    onChange={() => handleFilter('wifi')}
                    // onChange={handleFilterChange}
                    // checked={filters.freeWifi}
                  />
                  <span className={styles.checkmark}></span>
                </label>
              </div>
              <div className={styles.suggestedDiv}>
                <label htmlFor="open24Hours">
                  Open 24 Hours
                  <input
                    type="checkbox"
                    id="open24Hours"
                    name="open24Hours"
                    className={styles.suggestedInput}
                    onChange={() => handleFilter('hour24')}
                    // onChange={handleFilterChange}
                    // checked={filters.open24Hours}
                  />
                  <span className={styles.checkmark}></span>
                </label>
              </div>

              <div className={styles.suggestedDiv}>
                <label htmlFor="publicRestrooms">
                  Public Restrooms
                  <input
                    type="checkbox"
                    id="publicRestrooms"
                    name="publicRestrooms"
                    className={styles.suggestedInput}
                    onChange={() => handleFilter('restrooms')}
                    // onChange={handleFilterChange}
                    // checked={filters.publicRestrooms}
                  />
                  <span className={styles.checkmark}></span>
                </label>
              </div>

              <div className={styles.suggestedDiv}>
                <label htmlFor="studyResources">
                  Study Resources
                  <input
                    className={styles.suggestedInput}
                    type="checkbox"
                    id="studyResources"
                    name="studyResources"
                    onChange={() => handleFilter('studyResources')}
                    // onChange={handleFilterChange}
                    // checked={filters.studyResources}
                  />
                  <span className={styles.checkmark}></span>
                </label>
              </div>
            </div>
          </div>
          <div className={styles.filterDiv}>
            <p className={styles.filterHeader}>Category</p>
            <div className={styles.categories}></div>
          </div>
        </section>
        <section className={styles.left}>
          <div className={styles.header}>
            {/* <div className={styles.breadCrumbs} data-testid="bread-crumb">
              <Link className={styles.breadCrumbText} href={'/'}>
                Home
              </Link>{' '}
              &gt;{' '}
              <Link className={styles.breadCrumbText} href={`/${school}`}>
                {schoolData?.name}
              </Link>
            </div> */}
            <div>
              <h1 className="header">{schoolData?.name} study spots</h1>
              <h3>{spotsData && `${spotsData?.length} places to study`}</h3>
            </div>
            <Link
              href={`/school/${schoolData?.id}/add/${schoolData?.id}/`}
              className={styles.sort}
            >
              Add Study Spot
            </Link>
          </div>
          {filteredData ? (
            <div className={styles.spots}>
              {filteredData.map((spot) => (
                <SpotCard key={spot.id} spotData={spot} />
              ))}
            </div>
          ) : (
            <div className={styles.spots}>
              <p className={styles.loadingText}>Loading...</p>
            </div>
          )}
        </section>
        <section className={styles.right}>
          <div className={styles.mapContainer} ref={mapContainer}></div>
        </section>
      </div>
    </div>
  );
};

export default School;
