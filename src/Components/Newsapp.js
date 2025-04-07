import React, { useEffect, useState } from 'react';
import Card from './Card';

const Newsapp = () => {
  const [search, setSearch] = useState('Sri lanka');
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(300000); // 5 minutes

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      setError(null);
      try {
        // In production, this should be a backend endpoint that hides your API key
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=${search}&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const jsonData = await response.json();
        console.log(jsonData);

        if (Array.isArray(jsonData.articles)) {
          let dt = jsonData.articles.slice(0, 10);
          setNewsData(dt);
        } else {
          throw new Error('No articles found in response');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        setNewsData([]);
      } finally {
        setLoading(false);
      }
    };

    getData();
    
    // Set up auto-refresh
    const intervalId = setInterval(getData, refreshInterval);
    
    // Clean up interval on component unmount or search change
    return () => clearInterval(intervalId);
  }, [search, refreshInterval]);

  const handleInput = (e) => {
    setSearch(e.target.value);
  };

  const handleCategoryClick = (category) => {
    setSearch(category);
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
        {['sports', 'politics', 'entertainment', 'health', 'fitness'].map((category) => (
          <button 
            key={category}
            onClick={() => handleCategoryClick(category)}
            value={category}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {loading && <div className="loading">Loading news...</div>}
      {error && <div className="error">Error: {error}</div>}
      {newsData && !loading && <Card data={newsData} />}
      {!newsData && !loading && !error && <div>No news found</div>}
    </div>
  );
};

export default Newsapp;