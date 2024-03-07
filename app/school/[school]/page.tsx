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
  //sorts
  const [sort, setSort] = useState('select-one');
  const [sortedData, setSortedData] = useState<StudySpot[]>([]);
  const [filteredData, setFilteredData] = useState<StudySpot[]>([]);
  const [filters, setFilters] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  //map
  const [lng, setLng] = useState<number>(0);
  const [lat, setLat] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(14.5);
  const [schoolData, setSchoolData] = useState<School | undefined>(undefined);
  const [spotsData, setSpotsData] = useState<StudySpot[]>([]);
  //Categories
  const [cafeActive, setCafeActive] = useState(false);
  const [libraryActive, setLibraryActive] = useState(false);
  const [publicSpaceActive, setPublicSpaceActive] = useState(false);
  const [workAreaActive, setWorkAreaActive] = useState(false);
  const [otherActive, setOtherActive] = useState(false);
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  //get School data
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

  //get studyspot data
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

  // load school map
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

  //load studyspot markers on nmap
  useEffect(() => {
    spotsData?.forEach((spot) => {
      if (map.current)
        new mapboxgl.Marker({ color: '#ff735c' })
          .setLngLat([Number(spot.longitude), Number(spot.latitude)])
          .addTo(map.current);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spotsData]);

  //interactivity with map
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

  //sorting
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

  //filtering
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

  //Categories
  useEffect(() => {
    // Filter the data based on the active categories
    const filteredData = sortedData.filter((spot) => {
      if (
        (cafeActive && spot.category === 'cafe') ||
        (libraryActive && spot.category === 'library') ||
        (publicSpaceActive && spot.category === 'public space') ||
        (workAreaActive && spot.category === 'work area') ||
        (otherActive && spot.category === 'other')
      ) {
        return true;
      }
      // If none of the categories are active, include the spot
      if (
        !(
          cafeActive ||
          libraryActive ||
          publicSpaceActive ||
          workAreaActive ||
          otherActive
        )
      ) {
        return true;
      }
      return false;
    });

    // Update the filtered data state
    setFilteredData(filteredData);
  }, [
    sortedData,
    cafeActive,
    libraryActive,
    publicSpaceActive,
    workAreaActive,
    otherActive,
  ]);
  //handle all of the sorting/filtering
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

  const handleCategory = (category: string) => {
    const index = categories.indexOf(category);
    if (index === -1) {
      setCategories((prevCategories) => [...prevCategories, category]);
    } else {
      setFilters((prevCategories) =>
        prevCategories.filter((c) => c !== category)
      );
    }

    switch (category) {
      case 'cafe':
        cafeActive ? setCafeActive(false) : setCafeActive(true);
        break;
      case 'library':
        libraryActive ? setLibraryActive(false) : setLibraryActive(true);
        break;
      case 'public space':
        publicSpaceActive
          ? setPublicSpaceActive(false)
          : setPublicSpaceActive(true);
        break;
      case 'work area':
        workAreaActive ? setWorkAreaActive(false) : setWorkAreaActive(true);
        break;
      case 'other':
        otherActive ? setOtherActive(false) : setOtherActive(true);
        break;
      default:
        break;
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
            <div className={styles.categories}>
              <div
                className={cafeActive ? styles.categoryActive : styles.category}
                onClick={() => handleCategory('cafe')}
              >
                Cafe
              </div>
              <div
                className={
                  libraryActive ? styles.categoryActive : styles.category
                }
                onClick={() => handleCategory('library')}
              >
                Library
              </div>
              <div
                className={
                  publicSpaceActive ? styles.categoryActive : styles.category
                }
                onClick={() => handleCategory('public space')}
              >
                Public Space
              </div>
              <div
                className={
                  workAreaActive ? styles.categoryActive : styles.category
                }
                onClick={() => handleCategory('work area')}
              >
                Work Area
              </div>
              <div
                className={
                  otherActive ? styles.categoryActive : styles.category
                }
                onClick={() => handleCategory('other')}
              >
                Other
              </div>
            </div>
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
