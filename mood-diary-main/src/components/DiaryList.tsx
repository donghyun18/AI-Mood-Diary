import Button, { ButtonType } from "components/Button";
import DiaryItem from "components/DiaryItem";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DiaryType } from "types/diary-types";

interface DiaryListProps {
  data: DiaryType[];
}

export default function DiaryList({ data }: DiaryListProps) {
  const nav = useNavigate();

  const [sortType, setSortType] = useState<"latest" | "oldest">("latest");

  const onChangeSortType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortType(e.target.value as "latest" | "oldest");
  };

  const getSortedDate = () => {
    return data.toSorted((a, b) => {
      if (sortType === "oldest") {
        return Number(a.createdDate) - Number(b.createdDate);
      } else {
        return Number(b.createdDate) - Number(a.createdDate);
      }
    });
  };

  const sortedData = getSortedDate();

  return (
    <div className="dark:text-white">
      <div className="my-5 flex gap-3">
        <select
          onChange={onChangeSortType}
          className="bg-btnLight dark:bg-btnDark rounded-md py-3 px-5 cursor-pointer"
        >
          <option value={"latest"}>Newest first</option>
          <option value={"oldest"}>Oldest first</option>
        </select>
        <Button
          onClick={() => nav("/new")}
          className="flex-1"
          text={"Write New Diary"}
          type={ButtonType.POSITIVE}
        />
      </div>
      <div>
        {sortedData.map((item) => (
          <DiaryItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}
