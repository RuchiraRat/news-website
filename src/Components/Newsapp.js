import React, { useEffect, useState } from 'react';
import Card from './Card';

const Newsapp = () => {
  const [search, setSearch] = useState('Sri Lanka');
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshInterval] = useState(300000); // 5 minutes

  // Function to fetch news data
  const fetchNewsData = async (searchQuery) => {
    setLoading(true);
    setError(null);
    
    try {
      // Use proxy endpoint in production, direct API in development
      const apiUrl = process.env.NODE_ENV === 'development'
        ? `https://newsapi.org/v2/everything?q=${searchQuery}&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`
        : `/api/news?q=${searchQuery}`;

      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API request failed with status ${response.status}`);
      }

      const jsonData = await response.json();
      
      if (Array.isArray(jsonData.articles)) {
        const limitedData = jsonData.articles.slice(0, 10);
        setNewsData(limitedData);
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

  useEffect(() => {
    // Initial fetch
    fetchNewsData(search);
    
    // Set up auto-refresh
    const intervalId = setInterval(() => fetchNewsData(search), refreshInterval);
    
    // Clean up interval on component unmount or search change
    return () => clearInterval(intervalId);
  }, [search, refreshInterval]);

  const handleInputChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearch = () => {
    // Trigger new search when button is clicked
    fetchNewsData(search);
  };

  const handleCategoryClick = (category) => {
    setSearch(category);
    // Immediately fetch news for the new category
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
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div className="news-container">
        {loading && <div className="loading-message">Loading news...</div>}
        {error && (
          <div className="error-message">
            Error: {error}
            <button onClick={() => fetchNewsData(search)}>Retry</button>
          </div>
        )}
        {newsData && !loading && (
          newsData.length > 0 ? (
            <Card data={newsData} />
          ) : (
            <div className="no-results">No news found for "{search}"</div>
          )
        )}
      </div>
    </div>
  );
};

export default Newsapp;