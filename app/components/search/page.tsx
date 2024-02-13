'use client';

import styles from './page.module.css';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { getSchools } from '@/lib/getSchools';
import Link from 'next/link';
import type { School } from '@prisma/client';
import { useEffect } from 'react';

const Search = () => {
  const [search, setSearch] = useState<string>('');
  const [searchResults, setSearchResults] = useState<School[]>([]);
  const [data, setData] = useState<School[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/schools/');
        if (response.ok) {
          const responseData = await response.json();
          const schools = await responseData.schools;
          setData(schools);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSearchResults = (input: string) => {
    const filteredResults = data.filter((school) => {
      const schoolName = school.name.toUpperCase();
      return schoolName.includes(input.toUpperCase());
    });
    setSearchResults(filteredResults);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value;
    setSearch(newSearch);
    if (newSearch.length === 0) {
      setSearchResults([]);
    } else {
      getSearchResults(newSearch);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearch('');
    router.push(`/${search}/`);
  };
  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.searchDiv}>
        <input
          className={styles.search}
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search for your school"
        />
      </form>
      <div className={styles.searchResults}>
        {searchResults.length === 0 ? (
          <p className={styles.SearchNoResults}>No results found</p>
        ) : (
          <p className={styles.searchNoResults}>
            Items({searchResults.length})
          </p>
        )}
        {searchResults.length !== 0 &&
          searchResults.map((school) => (
            <div key={school.id}>
              <Link
                className={styles.searchResultJName}
                href={`/${search}/`}
                passHref
              >
                {school.name}
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Search;
