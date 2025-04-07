import React, { useEffect, useState } from 'react';
import Card from './Card';

const Newsapp = () => {
  const [search, setSearch] = useState('Sri lanka');
  const [newsData, setNewsData] = useState(null);
  const API_KEY = '4cbcd26a680144e096f4c7a9b16cd835';

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=${search}&apiKey=${API_KEY}`
        );
        const jsonData = await response.json();
        console.log(jsonData);

        if (Array.isArray(jsonData.articles)) {
          let dt = jsonData.articles.slice(0, 10);
          setNewsData(dt);
        } else {
          console.error('No articles found in response:', jsonData);
          setNewsData([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setNewsData([]);
      }
    };

    getData();
  }, [search]); // Triggers fetch whenever 'search' changes

  const handleInput = (e) => {
    setSearch(e.target.value);
  };

  const userInput = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div>
      <nav>
        <div>
          <h1>SriCast News</h1>
        </div>
        <ul style={{ display: 'flex', gap: '11px' }}>
          <li style={{ fontWeight: 600, fontSize: '17px' }}>All News</li>
          <li style={{ fontWeight: 600, fontSize: '17px' }}>Trending</li>
        </ul>
        <div className='searchBar'>
          <input
            type='text'
            placeholder='Search News'
            value={search}
            onChange={handleInput}
          />
          <button onClick={() => setSearch(search)}>Search</button>
        </div>
      </nav>

      <div>
        <p className='head'>Stay Updated with SriCast News</p>
      </div>

      <div className='categoryBtn'>
        <button onClick={userInput} value='sports'>
          Sports
        </button>
        <button onClick={userInput} value='politics'>
          Politics
        </button>
        <button onClick={userInput} value='entertainment'>
          Entertainment
        </button>
        <button onClick={userInput} value='health'>
          Health
        </button>
        <button onClick={userInput} value='fitness'>
          Fitness
        </button>
      </div>

      <div>{newsData ? <Card data={newsData} /> : null}</div>
    </div>
  );
};

export default Newsapp;