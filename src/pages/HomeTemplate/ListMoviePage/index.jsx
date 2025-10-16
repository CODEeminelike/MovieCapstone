import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "./slice";
import Spinner from "@components/spinner";
import MovieCard from "../_components/Movie";

export default function ListMoviePage() {
  const loading = useSelector(
    (state) => state.listMovieReducer.loading
  );
  const data = useSelector((state) => state.listMovieReducer.data);
  const error = useSelector((state) => state.listMovieReducer.error);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  const renderListMovie = () => {
    if (!data || data.length === 0) {
      return (
        <div className="col-span-4 text-center py-8 text-gray-500">
          Không tìm thấy phim nào
        </div>
      );
    }

    return data.map((movie) => (
      <MovieCard key={movie.maPhim} movie={movie} />
    ));
  };

  if (loading) return <Spinner />;

  if (error)
    return (
      <div className="container mx-auto text-center py-8">
        <h1 className="text-red-500 text-xl">
          Đã có lỗi xảy ra: {error.message}
        </h1>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Danh Sách Phim
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {renderListMovie()}
      </div>
    </div>
  );
}
