import React, {useState, Fragment } from 'react';
import './App.css';
import {Container, Input, Divider } from 'semantic-ui-react'
import Tweet from './components/Tweet/Tweet';
import useTwitterApi from './hooks/useTwitterApi';

function App() {
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  
  const [{ tweets, isLoading, isError }, doFetch] = useTwitterApi();
  var tweetCards = [];


  function refreshTweets() {
    tweetCards = tweets.map ? tweets.map((tweet) => {
      return <Tweet key={tweet.id} tweet={tweet} />
    }) : [];
  }

  function filterTweets() {
    //if(tweets.length > 0) {
      tweetCards = tweets.filter? tweets.filter((tweet) => { return tweet.includes?tweet.includes(search):''}):[];
    //}
  }

  return ([refreshTweets(),
  <Fragment>
    <div className="App">
      <header className="App-header">
        <p>
          Demo App using React, NodeJS and Twitter API
        </p>
      </header>
    </div>
    <>
    <div className='search-container'>
      <form onSubmit={event => {
        doFetch(`http://localhost:3001/api/v1/timeline?screen_name=${query}`);
        event.preventDefault();
      }}>
        
      <Container className='header-container'>
          <Input action='Search' focus id='searchInput' className="search-field" value={query} 
          onChange={event => setQuery(event.target.value)} placeholder='View tweets by user' fluid />
      </Container>
      </form>
      <form onSubmit={event => {filterTweets();
        event.preventDefault();
      }}>
        <Container className='header-container'>
          <Input focus id='filterInput' action='Search' className="search-field" value={search}
            onChange={event => setSearch(event.target.value)} placeholder='Filter tweets by...' fluid />
        </Container>
      </form>
      <Divider />
    </div>
      
      {isError && <div>Something went wrong ...</div>}
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
          <Container className="dashboard-container">
            {tweetCards}
          </Container>
        )}
    </>

  </Fragment>
  ]);
}

export default App;
