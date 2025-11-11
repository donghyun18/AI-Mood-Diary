import { Emotion, emotionInfo, getEmotionImage } from "utils/emotion-utils";

interface ViewerProps {
  emotion: Emotion;
  content: string;
}

export default function Viewer({ emotion, content }: ViewerProps) {
  const bgColor = emotionInfo[emotion].bgColor;

  return (
    <>
      <section className="w-full mb-20 flex flex-col items-center text-center dark:text-white">
        <h4 className="font-bold text-xl my-7">Today's Emotion</h4>
        <div
          className={`${bgColor} w-64 h-64 rounded-md flex flex-col items-center justify-around text-white`}
        >
          <img src={getEmotionImage(emotion)} />
          <div className="font-semibold text-xl">
            {emotionInfo[emotion].name}
          </div>
        </div>
      </section>
      <section className="w-full my-7 flex flex-col items-center text-center dark:text-white">
        <h4 className="font-bold text-xl my-7">Today's Diary</h4>
        <div className="w-full bg-btnLight dark:bg-btnDark rounded-md break-words break-keep">
          <p className="p-5 text-left text-lg whitespace-pre-line">{content}</p>
        </div>
      </section>
    </>
  );
}
