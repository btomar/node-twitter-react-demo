
import { useState, useEffect} from 'react';
import axios from 'axios';
//import useInterval from './useInterval';

const useTwitterApi = () => {
  const [tweets, setTweets] = useState({ tweets: [] });
  const [url, setUrl] = useState(
    `http://localhost:3001/api/v1/statuses/home_timeline`,
  );
  //const [query, setQuery] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  //const [delay, setDelay] = useState(2000);

  // useInterval(() => {
  //   // Do some API call here
  //   const fetchTweetUpdates = async () => {
  //     setIsError(false);
  //     setIsLoading(true);
  //     try {
  //       const result = await axios(`http://localhost:3001/api/v1/statuses/filter?track=bhtomar`);
  //       setTweets(result.data);
  //     } catch (error) {
  //       setIsError(true);
  //     }
  //     setIsLoading(false);
  //   };
 
  //   fetchTweetUpdates();
  //   setTimeout(() => {
  //     console.log('Fetching user latest tweers');
  //   }, 2000);
  // }, delay);

  useEffect(() => {
    const fetchTweets = async () => {
      setIsError(false);
      setIsLoading(true);
 
      try {
        const result = await axios(url);
 
        setTweets(result.data);
      } catch (error) {
        setIsError(true);
      }
 
      setIsLoading(false);
    };
 
    fetchTweets();


  }, [url]);

 
  return [{ tweets, isLoading, isError }, setUrl];
}

export default useTwitterApi;