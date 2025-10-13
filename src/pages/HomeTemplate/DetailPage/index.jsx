import { useParams } from "react-router-dom";
import { fetchDetailMovie } from "./slice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

export default function DetailPage() {
  const state = useSelector((state) => state.detailReducer);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchDetailMovie(id));
  }, [id]);

  if (state.loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>DetailPage: {state.data?.tenPhim}</h1>
    </div>
  );
}
