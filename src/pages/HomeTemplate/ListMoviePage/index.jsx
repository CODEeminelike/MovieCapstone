import { useEffect, useState } from "react";
import Movie from "./movie";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "./slice";
import Spinner from "@components/spinner";

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
      return <div>No movies found</div>;
    }

    return data.map((item) => (
      <Movie key={item.maPhim} data={item} />
    ));
  };

  if (loading) return <Spinner />;
  if (error) return <h1>error</h1>;
  return (
    <div>
      <div className="container mx-auto grid grid-cols-4 gap-10">
        {renderListMovie()}
      </div>
    </div>
  );
}
