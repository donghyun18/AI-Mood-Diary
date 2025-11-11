import Button from "components/Button";
import Footer from "components/Footer";
import Header from "components/Header";
import Viewer from "components/Viewer";
import useDiary from "hooks/useDiary";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStringDate } from "utils/get-string-date";
import { GoPaperAirplane } from "react-icons/go";
import { CallGPT } from "api/gpt";
import Letter from "components/Letter";
import { DiaryType } from "types/diary-types";
import usePageTitle from "hooks/usePageTitle";
import { toast } from "react-toastify";
import { analyzeEmotion } from "api/analyzeEmotion";
import { matchScore } from "utils/emotion-match";
import { Emotion, emotionInfo } from "utils/emotion-utils";

export default function Diary() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasReceived, setHasReceived] = useState(false);
  const [gptAnswer, setGptAnswer] = useState("");
  const [aiEmotion, setAiEmotion] = useState<Emotion | undefined>(undefined);
  const [aiConfidence, setAiConfidence] = useState<number | undefined>(undefined);

  const params = useParams();
  const id = Number(params.id);
  usePageTitle(`Diary #${id}`);

  const getDiaries = () =>
    (JSON.parse(localStorage.getItem("diary") || "[]") as DiaryType[]);

  useEffect(() => {
    const diaries = getDiaries();
    const current = diaries.find((d) => d.id === id);
    if (current?.gptAnswer) {
      setGptAnswer(current.gptAnswer);
      setHasReceived(true);
    }
    if (current?.aiEmotion) setAiEmotion(current.aiEmotion);
    if (typeof current?.aiConfidence === "number") setAiConfidence(current.aiConfidence);
  }, [id]);

  const nav = useNavigate();
  const curDiaryItem = useDiary(id);
  if (!curDiaryItem) return <div>Loading data...</div>;
  const { createdDate, emotion, content } = curDiaryItem;

  const handleClickAPICall = async () => {
    try {
      setIsLoading(true);

      const { answer } = await CallGPT({ prompt: String(content) });
      if (!answer || !answer.trim()) {
        toast.error("Couldn't read the AI reply. Please try again.");
        return;
      }

      const diaries = getDiaries();
      const idx = diaries.findIndex((d) => d.id === id);
      if (idx !== -1) {
        diaries[idx].gptAnswer = answer;

        try {
          const { emotion: inferred, confidence } = await analyzeEmotion(String(content));
          diaries[idx].aiEmotion = inferred;
          diaries[idx].aiConfidence = confidence;
          setAiEmotion(inferred);
          setAiConfidence(confidence);
        } catch {
          // still answer is saved
        }

        localStorage.setItem("diary", JSON.stringify(diaries));
      }

      setGptAnswer(answer);
      setHasReceived(true);
    } catch (err: any) {
      const msg = err?.message ? String(err.message) : "Failed to get AI reply.";
      console.error(err);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const matchPct =
    aiEmotion && typeof aiConfidence === "number"
      ? Math.round(matchScore(emotion, aiEmotion, aiConfidence) * 100)
      : null;

  return (
    <div className="overflow-hidden">
      <Header
        title={`${getStringDate(createdDate)} Record`}
        leftChild={<Button text={"< Back"} onClick={() => nav(-1)} />}
        rightChild={<Button text={"Edit"} onClick={() => nav(`/edit/${id}`)} />}
      />
      <Viewer emotion={emotion} content={content} />
      <div className="pb-24 flex flex-col justify-center">
        <button
          className="bg-[#3498db] dark:bg-[#3498db] text-white p-2 rounded-md mb-5"
          onClick={handleClickAPICall}
          disabled={isLoading || hasReceived}
        >
          {hasReceived ? (
            "Your reply has arrived!"
          ) : isLoading ? (
            "Getting reply..."
          ) : (
            <div className="flex justify-center items-center gap-2">
              Get Reply <GoPaperAirplane />
            </div>
          )}
        </button>

        <Letter letterData={gptAnswer} isLoading={isLoading} />

        {aiEmotion && (
          <div className="mt-4 p-4 rounded-md bg-btnLight dark:bg-btnDark text-sm dark:text-white">
            <div className="mb-2 font-semibold">Emotion match</div>
            <div className="mb-2">
              You: <b>{emotionInfo[emotion].name}</b> · AI:{" "}
              <b>{emotionInfo[aiEmotion].name}</b>
              {typeof aiConfidence === "number" && (
                <> ({Math.round(aiConfidence * 100)}% conf.)</>
              )}
            </div>

            {matchPct !== null && (
              <>
                <div className="h-2 w-full bg-gray-300 rounded">
                  <div
                    className="h-2 bg-[#3498db] rounded"
                    style={{ width: `${matchPct}%` }}
                  />
                </div>
                <div className="mt-1 opacity-80">{matchPct}% match</div>
              </>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
