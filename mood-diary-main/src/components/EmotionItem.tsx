import { Emotion, emotionInfo, getEmotionImage } from "utils/emotion-utils";

interface EmotionItemProps {
  emotion: Emotion;
  emotionName: string;
  isSelected: boolean;
  onClick: (emotion: Emotion) => void;
}

export default function EmotionItem({
  emotion,
  emotionName,
  isSelected,
  onClick,
}: EmotionItemProps) {
  const selectedColor = isSelected
    ? `${emotionInfo[emotion].bgColor} text-white font-semibold text-lg`
    : "bg-btnLight dark:bg-btnDark dark:text-lineLight";
  return (
    <div
      className={`${selectedColor}  p-5 rounded-md cursor-pointer text-center`}
      onClick={() => onClick(emotion)}
    >
      <img className="w-1/2 mb-3 mx-auto" src={getEmotionImage(emotion)} />
      <div>{emotionName}</div>
    </div>
  );
}
