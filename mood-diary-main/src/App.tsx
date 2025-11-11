import "./App.css";
import { useContext, useEffect, useReducer, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Home from "pages/Home";
import New from "pages/New";
import Edit from "pages/Edit";
import Diary from "pages/Diary";
import {
  Action,
  ActionType,
  DiaryType,
  onCreateType,
  onDeleteType,
  onUpdateType,
} from "types/diary-types";
import { DiaryDispatchContext, DiaryStateContext } from "context/diary-context";
import NotFound from "pages/NotFound";
import ThemeContext from "context/theme-context";

function reducer(state: DiaryType[], action: ActionType) {
  let nextState;
  switch (action.type) {
    case Action.INIT:
      return action.data;
    case Action.CREATE: {
      nextState = [action.data, ...state];
      break;
    }
    case Action.UPDATE: {
      nextState = state.map((item) =>
        String(item.id) === String(action.data.id) ? action.data : item
      );
      break;
    }
    case Action.DELETE: {
      nextState = state.filter((item) => String(item.id) !== String(action.id));
      break;
    }
    default:
      return state;
  }

  localStorage.setItem("diary", JSON.stringify(nextState));
  return nextState;
}

function App() {
  const { isDarkMode } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(true);
  const [data, dispatch] = useReducer(reducer, []);
  const idRef = useRef(0);

  useEffect(() => {
    const storedData = localStorage.getItem("diary");
    if (!storedData) {
      setIsLoading(false);
      return;
    }

    const parsedData = JSON.parse(storedData);
    if (!Array.isArray(parsedData)) {
      setIsLoading(false);
      return;
    }

    let maxId = 0;
    parsedData.forEach((item) => {
      if (item.id > maxId) {
        maxId = item.id;
      }
    });

    idRef.current = maxId + 1;

    dispatch({
      type: Action.INIT,
      data: parsedData,
    });
    setIsLoading(false);
  }, []);

  const onCreate: onCreateType = (createdDate, emotion, content) => {
    dispatch({
      type: Action.CREATE,
      data: {
        id: idRef.current++,
        createdDate,
        emotion,
        content,
      },
    });
    toast.success("Your diary has been created 🎉");
  };

  const onUpdate: onUpdateType = (id, createdDate, emotion, content) => {
    dispatch({
      type: Action.UPDATE,
      data: {
        id,
        createdDate,
        emotion,
        content,
      },
    });
    toast.success("Your diary has been updated 😸");
  };

  const onDelete: onDeleteType = (id) => {
    dispatch({
      type: Action.DELETE,
      id,
    });
    toast.success("Your diary has been deleted 😺");
  };

  if (isLoading) {
    return <div>Loading your diaries 📒</div>;
  }

  return (
    <>
      <ToastContainer theme={isDarkMode ? "dark" : "light"} />
      <DiaryStateContext.Provider value={data}>
        <DiaryDispatchContext.Provider value={{ onCreate, onUpdate, onDelete }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new" element={<New />} />
            <Route path="/diary/:id" element={<Diary />} />
            <Route path="edit/:id" element={<Edit />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DiaryDispatchContext.Provider>
      </DiaryStateContext.Provider>
    </>
  );
}

export default App;
