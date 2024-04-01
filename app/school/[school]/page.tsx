'use client';

import { School, StudySpot, User } from '@prisma/client';
import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';
import React, { useRef, useEffect, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import SpotCard from '../../components/spotCard/spotCard';
import marker from '../../public/icons8-location-24.png';
import Loading from './loading';
import useCheckSignIn from '@/lib/hooks/useAuthorize';

interface Props {
  params: {
    school: string;
  };
}

const School = ({ params: { school } }: Props) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState<number>(0);
  const [lat, setLat] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(13.5);
  const [schoolData, setSchoolData] = useState<School | undefined>(undefined);
  const [spotsData, setSpotsData] = useState<StudySpot[]>([]);
  const [sortedData, setSortedData] = useState<StudySpot[]>([]);
  const [filteredData, setFilteredData] = useState<StudySpot[]>([]);
  const [sort, setSort] = useState('select-one');
  const [filters, setFilters] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [cafeActive, setCafeActive] = useState(false);
  const [libraryActive, setLibraryActive] = useState(false);
  const [publicSpaceActive, setPublicSpaceActive] = useState(false);
  const [workAreaActive, setWorkAreaActive] = useState(false);
  const [otherActive, setOtherActive] = useState(false);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loadMarkers, setLoadMarkers] = useState<boolean>(false);
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const onCampusRef = useRef<HTMLInputElement>(null);
  const freeWifiRef = useRef<HTMLInputElement>(null);
  const open24HoursRef = useRef<HTMLInputElement>(null);
  const publicRestroomsRef = useRef<HTMLInputElement>(null);
  const studyResourcesRef = useRef<HTMLInputElement>(null);
  const isSignedIn = useCheckSignIn();

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
        const parsedUser = await responseData.user;
        setSchoolData(parsedData);
        setLat(Number(parsedData?.latitude));
        setLng(Number(parsedData?.longitude));
        setUser(parsedUser);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSpotsData = async () => {
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
        setFilteredData(parsedData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadMap = () => {
    if (lat !== 0 && lng !== 0) {
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
      map.current?.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: false,
          showZoom: true,
          showCompass: false,
        })
      );
      setLoadMarkers(true);
    }
  };

  const loadStudySpotMarkers = () => {
    spotsData.forEach((spot) => {
      if (map.current) {
        new mapboxgl.Marker({ color: '#ff735c' })
          .setLngLat([Number(spot.longitude), Number(spot.latitude)])
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<a href="/studyspot/${spot.id}" style="text-decoration: none; color: black;">
                <div style='padding: 5px;'>
                  <img src="${spot.photos[0]}" alt="Spot Photo" style="max-width: 100%; height: auto; border-radius: 8px;">
                  <h2>${spot.name}</h2>
                  <p>${spot.description}</p>
                </div>
              </a>`
            )
          )
          .addTo(map.current);
      }
    });
  };

  const handleSortFilterCategory = () => {
    let newData = [...spotsData];

    // Sorting
    if (sort === 'rated') {
      newData.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    } else if (sort === 'reviewed') {
      newData.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    // Filtering
    newData = newData.filter((spot) => {
      for (const filter of filters) {
        if (filter === 'studyResources') {
          if (spot.studyResources.length === 0) return false;
        } else if (!spot[filter as keyof StudySpot]) {
          return false;
        }
      }
      return true;
    });

    // Category filtering
    newData = newData.filter((spot) => {
      if (
        (cafeActive && spot.category === 'cafe') ||
        (libraryActive && spot.category === 'library') ||
        (publicSpaceActive && spot.category === 'public space') ||
        (workAreaActive && spot.category === 'work area') ||
        (otherActive && spot.category === 'other')
      ) {
        return true;
      }
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

    setFilteredData(newData);
    setSortedData(newData);
  };

  useEffect(() => {
    fetchData();
    fetchSpotsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng]);

  useEffect(() => {
    loadStudySpotMarkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadMarkers]);

  useEffect(() => {
    handleSortFilterCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sort,
    filters,
    cafeActive,
    libraryActive,
    publicSpaceActive,
    workAreaActive,
    otherActive,
  ]);

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
      setCategories((prevCategories) =>
        prevCategories.filter((c) => c !== category)
      );
    }

    switch (category) {
      case 'cafe':
        setCafeActive(!cafeActive);
        break;
      case 'library':
        setLibraryActive(!libraryActive);
        break;
      case 'public space':
        setPublicSpaceActive(!publicSpaceActive);
        break;
      case 'work area':
        setWorkAreaActive(!workAreaActive);
        break;
      case 'other':
        setOtherActive(!otherActive);
        break;
      default:
        break;
    }
  };

  const clearAll = () => {
    if (onCampusRef.current) onCampusRef.current.checked = false;
    if (freeWifiRef.current) freeWifiRef.current.checked = false;
    if (open24HoursRef.current) open24HoursRef.current.checked = false;
    if (publicRestroomsRef.current) publicRestroomsRef.current.checked = false;
    if (studyResourcesRef.current) studyResourcesRef.current.checked = false;

    setFilteredData(spotsData);
    setSortedData(spotsData);
    setSort('select-one');
    setCategories([]);
    setFilters([]);
    setCafeActive(false);
    setLibraryActive(false);
    setPublicSpaceActive(false);
    setWorkAreaActive(false);
    setOtherActive(false);
  };

  return (
    <div className={styles.main}>
      <div className={styles.bottom}>
        <section className={styles.filters}>
          <div className={styles.filtersHeader}>Filters</div>
          <div className={styles.clearAll} onClick={clearAll}>
            Clear
          </div>
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
                    ref={onCampusRef}
                    id="onCampus"
                    name="onCampus"
                    onChange={() => handleFilter('onCampus')} // Pass the filter name to
                  />
                  <span className={styles.checkmark}></span>
                </label>
              </div>
              <div className={styles.suggestedDiv}>
                <label htmlFor="freeWifi">
                  Free Wifi
                  <input
                    type="checkbox"
                    ref={freeWifiRef}
                    id="freeWifi"
                    name="freeWifi"
                    className={styles.suggestedInput}
                    onChange={() => handleFilter('wifi')}
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
                    ref={open24HoursRef}
                    name="open24Hours"
                    className={styles.suggestedInput}
                    onChange={() => handleFilter('hour24')}
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
                    ref={publicRestroomsRef}
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
                    ref={studyResourcesRef}
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
              <p className={styles.toStudy}>
                {filteredData && `${filteredData?.length} places to study`}
              </p>
            </div>
            {isSignedIn ? (
              <Link
                href={`/school/${schoolData?.id}/add/${schoolData?.id}/`}
                className={styles.sort}
              >
                Add Study Spot
              </Link>
            ) : (
              <div
                onClick={() =>
                  alert('You must be signed in to add a study spot')
                }
                className={styles.sort}
              >
                Add Study Spot
              </div>
            )}
          </div>
          {filteredData ? (
            <div className={styles.spots}>
              {filteredData.map((spot) => (
                <SpotCard key={spot.id} spotData={spot} />
              ))}
            </div>
          ) : (
            <div className={styles.spots}>
              <Loading />
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
