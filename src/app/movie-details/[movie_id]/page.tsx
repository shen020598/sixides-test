'use client';

import { apiGet } from '@/utilities/apiMethod';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function About() {
	const { movie_id } = useParams();
	const [movieDetails, setMovieDetails] = useState<MovieDetails>();

	useEffect(() => {
		getMovieDetails();
	}, [movie_id]);

	async function getMovieDetails() {
		const result = await apiGet({
			url: `https://api.themoviedb.org/3/movie/${movie_id}`,
			authorization: process.env.NEXT_PUBLIC_API_READ_ACCESS_TOKEN || ''
		});
		setMovieDetails(result);
	}

	if (!movieDetails) {
		return (
			<div className='h-screen bg-slate-100'>
				<span>loading...</span>
			</div>
		);
	}
	return (
		<div className='flex-1 bg-slate-100 flex flex-col p-10  md:p-20 lg:p-20 xl:p-20 2xl:p-20'>
			<div className='flex-1 bg-slate-100 flex flex-col md:flex-row lg:flex-row xl:flex-row 2xl:flex-row items-start'>
				{movieDetails.poster_path ? (
					<img className='h-auto  w-96' style={{ objectFit: 'contain' }} src={`https://image.tmdb.org/t/p/original/${movieDetails.poster_path}`} />
				) : (
					<img src={`https://www.reynoldsarchitecture.com/wp-content/uploads/2020/04/poster-placeholder.png`} />
				)}
				<div className='h-screen bg-slate-100 flex flex-col flex-1 sm:m-20 md:ml-10 lg:ml-10 xl:ml-10 2xl:ml-10'>
					<span className=' font-bold text-[36px]'>{movieDetails.title}</span>
					<span className='  text-[24px] my-10'>{movieDetails.overview}</span>
					<span className='  text-[18px] '>{movieDetails.release_date}</span>
				</div>
			</div>
		</div>
	);
}

type MovieDetails = {
	adult: boolean;
	backdrop_path: string;
	belongs_to_collection: any;
	budget: number;
	genres: Array<{
		id: number;
		name: string;
	}>;
	homepage: string;
	id: number;
	imdb_id: string;
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string;
	production_companies: Array<{
		id: number;
		logo_path?: string;
		name: string;
		origin_country: string;
	}>;
	production_countries: Array<{
		iso_3166_1: string;
		name: string;
	}>;
	release_date: string;
	revenue: number;
	runtime: number;
	spoken_languages: Array<{
		english_name: string;
		iso_639_1: string;
		name: string;
	}>;
	status: string;
	tagline: string;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
};
