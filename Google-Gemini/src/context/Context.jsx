import { createContext, useEffect, useState } from "react";
import runchat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompt, setPrevPrompt] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoding] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index,nextWord)=>{
    setTimeout(function(){
      setResultData(prev=>prev+nextWord)
    },75*index)
}

  const newChat =()=>{
    setLoding(false)
    setShowResult(false)
  }

  const onSent = async (prompt) => {
    setResultData("")
    setLoding(true)
    setShowResult(true)
    let response;
    if(prompt !== undefined){
      response = await runchat(prompt);
      setRecentPrompt(prompt)

    }
    else{
      setPrevPrompt(prev=>[...prev,input])
      setRecentPrompt(input)
      response = await runchat(input)
    }

    let responseArray =response.split("**");
    let newResponse="" ;
    for(let i=0; i < responseArray.length; i++){
      if(i===0 || i%2 !==1){
        newResponse += responseArray[i];
      }
      else{
        newResponse += "<b>"+responseArray[i]+"</b>";
      }
    }
    let newResponse2 = newResponse.split("*").join("<br/>")
    let newResponceArray = newResponse2.split(" ");
    for(let i=0;i<newResponceArray.length; i++){

       const nextWord = newResponceArray[i];
       delayPara(i,nextWord +" ")
    }
   
    setLoding(false)
    setInput("")
  
  };
  
  const contextValue = {
    prevPrompt,
    setPrevPrompt,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
   
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
