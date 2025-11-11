import { createContext, useEffect, useState } from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeContext = createContext({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const loadDarkModeSetting = () => {
    const storedDarkModeSetting = localStorage.getItem("darkMode");
    return storedDarkModeSetting ? JSON.parse(storedDarkModeSetting) : false;
  };

  const [isDarkMode, setIsDarkMode] = useState(loadDarkModeSetting());

  useEffect(() => {
    const body = document.querySelector("body");
    isDarkMode ? body?.classList.add("dark") : body?.classList.remove("dark");

    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));

    return () => {
      body?.classList.remove("dark");
    };
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
