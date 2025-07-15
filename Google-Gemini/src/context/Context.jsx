import { createContext, useEffect, useState } from "react";
import runchat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [response, setResponse] = useState("");

  const onSent = async (prompt) => {
    const reply = await runchat(prompt);
    setResponse(reply);
  };

  // Only runs once on mount
  useEffect(() => {
    onSent("What is React JS?");
  }, []);

  const contextValue = {
    response,
    sendPrompt: onSent,
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
