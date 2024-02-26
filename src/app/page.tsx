'use client';
import { apiGet } from '@/utilities/apiMethod';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export default function Home() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [genreList, setGenreList] = useState<Genre[]>([]);
	const [allMovieList, setAllMovieList] = useState<Movie[]>([]);
	const [pageCount, setPageCount] = useState(1);
	const [selectedGenre, setSelectedGenre] = useState<Genre | undefined>();
	const [voteAverage, setVoteAverage] = useState(0);
	const displayingList = useMemo<Movie[]>(() => {
		return allMovieList
			.filter((item) => item.vote_average > voteAverage)
			.filter((item) => (selectedGenre ? item.genre_ids.includes(selectedGenre.id) : item))
			.slice(pageCount === 1 ? 0 : (pageCount - 1) * 30, pageCount * 30);
	}, [selectedGenre, pageCount, allMovieList, voteAverage]);

	useEffect(() => {
		getMovieList();
		getGenreList();
	}, []);

	async function getGenreList() {
		const result = await apiGet({
			url: 'https://api.themoviedb.org/3/genre/movie/list?language=en',
			authorization: process.env.NEXT_PUBLIC_API_READ_ACCESS_TOKEN || ''
		});
		setGenreList(result.genres);
	}

	async function getMovieList() {
		console.log('called');
		setLoading(true);
		let promiseList = [];
		for (let index = 0; index < 24; index++) {
			promiseList.push(
				apiGet({
					url: `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${index + 1}`,
					authorization: process.env.NEXT_PUBLIC_API_READ_ACCESS_TOKEN || ''
				})
			);
		}
		const promiseListResult = await Promise.all(promiseList);
		let tempAllMovieList: Movie[] = [];
		promiseListResult.forEach((item) => {
			tempAllMovieList = [...tempAllMovieList, ...item.results];
		});
		setAllMovieList(tempAllMovieList);
		sortMovie('popularity', 'asc');
		setLoading(false);
	}

	function sortMovie(name: 'popularity' | 'title' | 'release_date' | 'vote_average', order: 'asc' | 'desc') {
		setAllMovieList((prev) => {
			let tempAllMovieList = [...prev];
			if (name === 'popularity' || name === 'vote_average') {
				tempAllMovieList.sort((a, b) => {
					return b[name] - a[name];
				});
			}
			if (name === 'title') {
				tempAllMovieList.sort((a, b) => {
					if (a[name] < b[name]) return -1;
					if (a[name] > b[name]) return 1;
					return 0;
				});
			}
			if (name === 'release_date') {
				tempAllMovieList.sort((a, b) => {
					return Date.parse(b[name]) - Date.parse(a[name]);
				});
			}
			if (order === 'desc') tempAllMovieList.reverse();
			return tempAllMovieList;
		});
	}

	return (
		<div className=' flex-1 bg-gray-100 flex flex-col items-center p-10 min-h-screen'>
			<span className=' font-bold text-[36px] w-max mb-10'>Now Playing</span>
			<div className='flex flex-row w-full flex-wrap justify-center'>
				{pageCount > 1 && (
					<button onClick={() => setPageCount((prev) => prev - 1)} className=' bg-slate-300 hover:bg-slate-600 hover:text-white transition ease-in-out delay-150 rounded px-2'>
						Previous Page
					</button>
				)}
				<span className='mx-6'>{pageCount}</span>
				{displayingList.length > 0 && (
					<button onClick={() => setPageCount((prev) => prev + 1)} className=' bg-slate-300 hover:bg-slate-600 hover:text-white transition ease-in-out delay-150 rounded px-2'>
						Next Page
					</button>
				)}
				<div className='flex items-center'>
					<label className='mx-3'>Rating Filter : </label>
					<input type='number' onChange={(e) => (e.target.value === '' ? setVoteAverage(1) : setVoteAverage(parseInt(e.target.value)))} />
				</div>
			</div>
			<div className='flex flex-row w-full flex-wrap justify-center mt-8'>
				<button onClick={() => sortMovie('title', 'asc')} className=' bg-slate-300 mx-3 p-2 rounded'>
					Sort by Movie Title
				</button>
				<button onClick={() => sortMovie('release_date', 'asc')} className=' bg-slate-300 mx-3 p-2 rounded'>
					Sort by Release Date
				</button>
				<button onClick={() => sortMovie('vote_average', 'asc')} className=' bg-slate-300 mx-3 p-2 rounded'>
					Sort by Rating
				</button>
				<button onClick={() => sortMovie('popularity', 'asc')} className=' bg-slate-300 mx-3 p-2 rounded'>
					Sort by Popularity
				</button>
			</div>
			<div className='flex flex-row justify-center w-full flex-wrap mt-10'>
				{genreList.map((item, index) => {
					if (selectedGenre?.id === item.id) {
						return (
							<button key={index} onClick={() => setSelectedGenre(undefined)} className='rounded p-3  bg-slate-400 mx-3 my-2'>
								{item.name}
							</button>
						);
					}
					return (
						<button key={index} onClick={() => setSelectedGenre(item)} className='rounded p-3  bg-slate-200 mx-3 my-2'>
							{item.name}
						</button>
					);
				})}
			</div>
			{loading && <span className=' font-bold text-[36px] w-max mb-10'>Loading</span>}
			<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 items-center justify-center'>
				{displayingList.map((item, index) => {
					return (
						<div
							onClick={() => router.push(`/movie-details/${item.id}`)}
							key={index}
							className=' bg-white shadow-gray-300 shadow-[0_10px_20px_rgba(240,_46,_170,_0.7)] m-8 p-4 flex items-center flex-col rounded hover:scale-110 transition ease-in-out delay-150'
						>
							{item.poster_path ? (
								<img src={`https://image.tmdb.org/t/p/original/${item.poster_path}`} />
							) : (
								<img src={`https://www.reynoldsarchitecture.com/wp-content/uploads/2020/04/poster-placeholder.png`} />
							)}
							<span className='font-bold my-3 text-center'>{item.title}</span>
							<button className=' bg-slate-200 hover:bg-slate-600 hover:text-white transition ease-in-out delay-150 rounded px-2'>More Info</button>
						</div>
					);
				})}
			</div>
		</div>
	);
}

type Movie = {
	adult: boolean;
	backdrop_path: string;
	genre_ids: Array<number>;
	id: number;
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string;
	release_date: string;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
};

type Genre = {
	id: number;
	name: string;
};
