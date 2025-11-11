import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button, { ButtonType } from "components/Button";
import Editor from "components/Editor";
import Header from "components/Header";
import { DiaryDispatchContext } from "context/diary-context";
import { DiaryType } from "types/diary-types";
import useDiary from "hooks/useDiary";
import Footer from "components/Footer";
import usePageTitle from "hooks/usePageTitle";

export default function Edit() {
  const params = useParams();
  const id = Number(params.id);
  const nav = useNavigate();
  const dispatchContext = useContext(DiaryDispatchContext);

  const curDiaryItem = useDiary(id);
  usePageTitle(`Edit Diary #${id}`);

  const onClickDelete = () => {
    if (window.confirm("Are you sure you want to delete this diary? This action cannot be undone!")) {
      dispatchContext?.onDelete(id);
      nav("/", { replace: true });
    }
  };

  const onSubmit = (input: DiaryType) => {
    const { id, createdDate, emotion, content } = input;
    if (window.confirm("Do you want to save the changes?")) {
      dispatchContext?.onUpdate(
        id,
        new Date(createdDate).getTime(),
        emotion,
        content
      );
    }
    nav("/", { replace: true });
  };

  return (
    <>
      <Header
        title={"Edit Diary"}
        leftChild={<Button text={"< Back"} onClick={() => nav(-1)} />}
        rightChild={
          <Button
            text={"Delete"}
            type={ButtonType.NEGATIVE}
            onClick={onClickDelete}
          />
        }
      />
      <Editor initData={curDiaryItem} onUpdate={onSubmit} />
      <Footer />
    </>
  );
}
