import { DiaryStateContext } from "context/diary-context";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { DiaryType } from "types/diary-types";

export default function useDiary(id: number) {
  const data = useContext(DiaryStateContext);
  const [curDiaryItem, setCurDiaryItem] = useState<DiaryType>();

  const nav = useNavigate();

  useEffect(() => {
    const currentDiaryItem = data.find((item) => item.id === id);

    if (!currentDiaryItem) {
      toast.error("The diary entry you're looking for doesn't exist 🫢");
      nav("/", { replace: true });
    }

    setCurDiaryItem(currentDiaryItem);
  }, [id, data, nav]);

  return curDiaryItem;
}

