
const API_KEY = "ad821249e775687e799305ba95310035";
const BASE_PATH = "https://api.themoviedb.org/3";

interface Igenre{
    id: number;
    name: string;
}
export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  budget?: number;
  genres?: Igenre[];
  homepage?: string;
  release_date?: string;
  tagline?: string;
}


export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface ITv {
    id: number;
    backdrop_path: string;
    poster_path: string;
    name: string;
    overview: string;
    first_air_date: string;
    popularity: number;
}
  


export interface IGetTvResults {
dates: {
    maximum: string;
    minimum: string;
};
page: number;
results: ITv[];
total_pages: number;
total_results: number;
}

export interface IMedia {
    id: number;
    backdrop_path: string;
    poster_path: string;
    name: string;
    overview: string;
    original_language: string;
    media_type: string;
    first_air_date: string;
    popularity: number;
}
  

export interface IGetSearchResult {
dates: {
    maximum: string;
    minimum: string;
};
page: number;
results: IMedia[];
total_pages: number;
total_results: number;
}




export function getMovies_playing() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getMovies_latest() {
    return fetch(`${BASE_PATH}/movie/latest?api_key=${API_KEY}`).then(
      (response) => response.json()
    );
}

export function getMovies_topRated() {
    return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
      (response) => response.json()
    );
}

export function getMovies_upComing() {
    return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
      (response) => response.json()
    );
}

export function getTv_latest() {
    return fetch(`${BASE_PATH}/tv/latest?api_key=${API_KEY}`).then(
      (response) => response.json()
    );
}
  
export function getTv_airing() {
    return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then(
    (response) => response.json()
    );
}
  
export function getTv_popular() {
    return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then(
    (response) => response.json()
    );
}

export function getTv_topRated() {
    return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
    );
}

export function getSearch_result(keyword:string|null) {
    if(!keyword) keyword = '';
    return fetch(`${BASE_PATH}/search/multi?api_key=${API_KEY}&query=${keyword}`).then(
    (response) => response.json()
    );
}

export function getMovieDetail(movieId:string|null) {
    if(!movieId) movieId = '';
    console.log(movieId);
    return fetch(`${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}`).then(
    (response) => response.json()
    );
}

export function getTvDetail(tvId:string|null) {
    if(!tvId) tvId = '';
    return fetch(`${BASE_PATH}/tv/${tvId}?api_key=${API_KEY}`).then(
    (response) => response.json()
    );
}