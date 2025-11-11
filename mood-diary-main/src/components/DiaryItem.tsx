import { emotionInfo, getEmotionImage } from "utils/emotion-utils";
import Button from "components/Button";
import { useNavigate } from "react-router-dom";
import { DiaryType } from "types/diary-types";
import { getStringDate } from "utils/get-string-date";

export default function DiaryItem({
  id,
  createdDate,
  emotion,
  content,
}: DiaryType) {
  const nav = useNavigate();
  const bgColor = emotionInfo[emotion].bgColor;
  return (
    <div className="flex gap-4 justify-between py-4 border-b border-lineLight dark:border-lineDark">
      <div
        onClick={() => nav(`/diary/${id}`)}
        className={`${bgColor} min-w-32 h-20 flex justify-center cursor-pointer rounded-md`}
      >
        <img className="w-1/2" src={getEmotionImage(emotion)} />
      </div>
      <div
        onClick={() => nav(`/diary/${id}`)}
        className="flex-1 cursor-pointer"
      >
        <div className="font-bold text-xl mb-1">
          {getStringDate(createdDate, "yyyy.mm.dd")}
        </div>
        <div className="max-w-sm multi-line-truncate leading-6 h-12">
          {content}
        </div>
      </div>
      <div className="min-w-20">
        <Button onClick={() => nav(`/edit/${id}`)} text={"Edit"} />
      </div>
    </div>
  );
}
