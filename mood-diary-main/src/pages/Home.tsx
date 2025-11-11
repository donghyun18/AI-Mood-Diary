import Button from "components/Button";
import DiaryList from "components/DiaryList";
import Footer from "components/Footer";
import Header from "components/Header";
import { DiaryStateContext } from "context/diary-context";
import usePageTitle from "hooks/usePageTitle";
import { useContext, useMemo, useState } from "react";
import { DiaryType } from "types/diary-types";
import EmotionHistoryChart from "components/EmotionHistoryChart";

const PAGE_SIZE = 4;

const getMonthlyData = (pivotDate: Date, data: DiaryType[]) => {
  const beginTime = new Date(
    pivotDate.getFullYear(),
    pivotDate.getMonth(),
    1,
    0,
    0,
    0
  ).getTime();

  const endTime = new Date(
    pivotDate.getFullYear(),
    pivotDate.getMonth() + 1,
    0,
    23,
    59,
    59
  ).getTime();

  return data.filter(
    (item) => beginTime <= item.createdDate && item.createdDate <= endTime
  );
};

export default function Home() {
  const data = useContext(DiaryStateContext);
  const [pivotDate, setPivotDate] = useState(new Date());
  const [showChart, setShowChart] = useState(true);
  const [visible, setVisible] = useState(PAGE_SIZE);
  usePageTitle("Emotion Diary");

  const monthlyData = useMemo(
    () => getMonthlyData(pivotDate, data),
    [pivotDate, data]
  );

  const sliced = useMemo(() => monthlyData.slice(0, visible), [monthlyData, visible]);
  const hasMore = visible < monthlyData.length;

  const onIncreaseMonth = () => {
    setPivotDate(new Date(pivotDate.getFullYear(), pivotDate.getMonth() + 1));
    setVisible(PAGE_SIZE);
  };
  const onDecreaseMonth = () => {
    setPivotDate(new Date(pivotDate.getFullYear(), pivotDate.getMonth() - 1));
    setVisible(PAGE_SIZE);
  };

  return (
    <>
      <Header
        title={`${pivotDate.getFullYear()} / ${pivotDate.getMonth() + 1}`}
        leftChild={<Button onClick={onDecreaseMonth} text={"<"} />}
        rightChild={<Button onClick={onIncreaseMonth} text={">"} />}
      />

      <div className="px-4 mt-3 flex justify-end">
        <button
          className="bg-btnLight dark:bg-btnDark text-sm px-3 py-2 rounded-md"
          onClick={() => setShowChart((s) => !s)}
        >
          {showChart ? "Hide Chart" : "Show Chart"}
        </button>
      </div>

      {showChart && (
        <div className="px-4">
          <EmotionHistoryChart diaries={monthlyData} days={30} />
        </div>
      )}

      <DiaryList data={sliced} />

      {hasMore && (
        <div className="px-4 my-4">
          <button
            className="w-full bg-btnLight dark:bg-btnDark py-3 rounded-md"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
          >
            Load more
          </button>
        </div>
      )}

      <Footer />
    </>
  );
}
