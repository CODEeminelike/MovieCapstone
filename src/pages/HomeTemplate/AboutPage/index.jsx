import { useNavigate } from "react-router-dom";
import TheaterList from "../DetailPage/TheaterList";

export default function AboutPage() {
  const navigate = useNavigate();

  const handleAdminClick = () => {
    console.log("Admin");
    navigate("/admin");
  };

  return (
    <div>
      <button
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        onClick={handleAdminClick}
      >
        Admin
      </button>

      {<TheaterList movieId={1329} />}
    </div>
  );
}
