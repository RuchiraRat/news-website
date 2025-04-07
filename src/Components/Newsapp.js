import React, { useEffect, useState } from 'react';
import Card from './Card';

const Newsapp = () => {
  const [search, setSearch] = useState('Sri Lanka');
  const [newsData, setNewsData] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshInterval] = useState(300000); // 5 minutes

  const fetchNewsData = async (searchQuery) => {
    setLoading(true);
    setError(null);
    
    try {
      let apiUrl;
      // Use different endpoints based on environment
      if (process.env.NODE_ENV === 'development') {
        if (!process.env.REACT_APP_NEWS_API_KEY) {
          throw new Error('API key is missing in development environment');
        }
        apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`;
      } else {
        apiUrl = `/api/news?q=${encodeURIComponent(searchQuery)}`;
      }

      const response = await fetch(apiUrl);
      
      // First check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON but got: ${text.substring(0, 100)}...`);
      }

      const jsonData = await response.json();
      
      if (!response.ok) {
        throw new Error(jsonData.message || `Request failed with status ${response.status}`);
      }

      if (!jsonData.articles || !Array.isArray(jsonData.articles)) {
        throw new Error('Invalid response format - articles array missing');
      }

      const limitedData = jsonData.articles.slice(0, 10);
      setNewsData(limitedData.length > 0 ? limitedData : []);

    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message);
      setNewsData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsData(search);
    
    const intervalId = setInterval(() => fetchNewsData(search), refreshInterval);
    return () => clearInterval(intervalId);
  }, [search, refreshInterval]);

  const handleInputChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearch = () => {
    if (search.trim()) {
      fetchNewsData(search);
    }
  };

  const handleCategoryClick = (category) => {
    setSearch(category);
    fetchNewsData(category);
  };

  return (
    <div className="news-app">
      <nav className="news-nav">
        <div className="logo">
          <h1>SriCast News</h1>
        </div>
        <ul className="nav-links">
          <li>All News</li>
          <li>Trending</li>
        </ul>
        <div className='searchBar'>
          <input
            type='text'
            placeholder='Search News'
            value={search}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </nav>

      <div className="app-header">
        <p className='head'>Stay Updated with SriCast News</p>
      </div>

      <div className='categoryBtn'>
        {['sports', 'politics', 'entertainment', 'health', 'fitness'].map((category) => (
          <button 
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={search.toLowerCase() === category ? 'active' : ''}
            disabled={loading}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div className="news-container">
        {loading && <div className="loading-message">Loading news...</div>}
        
        {error && (
          <div className="error-message">
            Error: {error.includes('Expected JSON') ? 'Server returned invalid response' : error}
            <button onClick={() => fetchNewsData(search)}>Retry</button>
          </div>
        )}
        
        {!loading && !error && newsData.length === 0 && (
          <div className="no-results">
            No news found for "{search}". Try a different search term.
          </div>
        )}
        
        {!loading && !error && newsData.length > 0 && (
          <Card data={newsData} />
        )}
      </div>
    </div>
  );
};

export default Newsapp;