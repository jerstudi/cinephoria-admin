/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { parseStringToArray } from "@/lib/utils";
import { toast } from "sonner";
import type { Movie } from "./schema";

export type MoviesFilteredByStatus = {
  status: boolean;
  activeCount: number;
  totalCount: number;
};

export type MoviesFilteredByFavorite = {
  favorite: boolean;
  count: number;
  totalCount: number;
};

export type MoviesFilteredByGender = {
  gender: string;
  count: number;
};

export const movieFilteredByStatus = (data: Movie[]): string => {
  const status = data.filter((s) => s.active);
  const statusValue = status ? "active" : "disabled";
  return statusValue;
};

export const movieFilteredByFavorite = (data: Movie[]): boolean => {
  const favorite = data.filter((s) => s.favorite);
  const favoriteValue = favorite ? true : false;
  return favoriteValue;
};

export const movieFilteredByGender = (data: Movie[]) => {
  const gender = data.filter((g) => g.gender);
  return gender;
};

// Filter movies by status
export const moviesFilteredByStatus = (
  data: Movie[],
): MoviesFilteredByStatus[] => {
  if (!data || data.length === 0) {
    toast.error("No data");
    return [];
  }

  const moviesFilteredByStatusCount = new Map<boolean, number>();
  const movieStatusFilter = data.filter((movie) => movie.active);

  movieStatusFilter.forEach((m) => {
    moviesFilteredByStatusCount.set(
      m.active,
      (moviesFilteredByStatusCount.get(m.active) ?? 0) + 1,
    );
  });

  return Array.from(moviesFilteredByStatusCount.entries()).map(
    ([status, activeCount]) => ({
      status,
      activeCount,
      totalCount: data.length,
    }),
  );
};

// Filter movies by favorite
export const moviesFilteredByFavorite = (
  data: Movie[],
): MoviesFilteredByFavorite[] => {
  if (!data || data.length === 0) {
    toast.error("No data");
    return [];
  }

  const moviesFilteredByFavoriteCount = new Map<boolean, number>();
  const movieFavoriteFilter = data.filter((movie) => movie.favorite);

  movieFavoriteFilter.forEach((m) => {
    moviesFilteredByFavoriteCount.set(
      m.favorite,
      (moviesFilteredByFavoriteCount.get(m.favorite) ?? 0) + 1,
    );
  });

  return Array.from(moviesFilteredByFavoriteCount.entries()).map(
    ([favorite, count]) => ({
      favorite,
      count,
      totalCount: data.length,
    }),
  );
};

// Filter movies by gender
export const moviesFilteredByGender = (
  data: Movie[],
): MoviesFilteredByGender[] => {
  if (!data || data.length === 0) {
    toast.error("No data");
    return [];
  }

  const getMovieGenders = data.map((movie) =>
    parseStringToArray({ str: movie.gender }),
  ); // Return string[][]

  const flatArrayMovieGenders = Array.prototype.flat()
    ? getMovieGenders.flat()
    : getMovieGenders.reduce((acc, value) => acc.concat(value), []); // Return string[]

  const movieFilteredByGenderCount = new Map<string, number>();
  flatArrayMovieGenders.forEach((g) => {
    movieFilteredByGenderCount.set(
      g,
      (movieFilteredByGenderCount.get(g) ?? 0) + 1,
    );
  });

  return Array.from(movieFilteredByGenderCount.entries()).map(
    ([gender, count]) => ({
      gender,
      count,
      totalCount: data.length,
    }),
  );
};
