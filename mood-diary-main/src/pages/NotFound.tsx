import Button from "components/Button";
import usePageTitle from "hooks/usePageTitle";
import { useNavigate } from "react-router-dom";
import { Emotion, getEmotionImage } from "utils/emotion-utils";

export default function NotFound() {
  const nav = useNavigate();
  usePageTitle("Page Not Found");
  return (
    <div className="flex flex-col items-center p-10">
      <div className="flex justify-center items-center text-[10rem] font-bold text-red">
        <span>4</span>
        <img className="mx-3" src={getEmotionImage(Emotion.TERRIBLE)} />
        <span>4</span>
      </div>
      <p className="uppercase text-7xl font-bold text-red">not found</p>
      <p className="text-5xl font-bold mt-20 dark:text-white">
        The page could not be found.
      </p>
      <p className="text-lg my-6 dark:text-white">
        Please make sure the URL is correct.
      </p>
      <Button
        text={"Go Back Home"}
        onClick={() => nav("/", { replace: true })}
      />
    </div>
  );
}

