'use client';
import React, { useEffect, useState } from "react";
import style from "./page.module.scss";
import MenuSvg from './compomnets/svgs/layout-sidebar-inactive.svg';
import NewChatSvg from './compomnets/svgs/file-pencil.svg';
import UserIcon from './compomnets/svgs/user.svg';
import UploadIcon from './compomnets/svgs/upload.svg';
import { useRouter } from "next/navigation";
import {isLoggedIn} from './compomnets/funcs/Islogged';
import Markdown from "react-markdown";

interface chat{
  gptRes:string,
  userRes:string,
}


export default function Main(){
  const [isOpen, setIsOpen] = useState(false);
  const [logged,setLogged] = useState(false);
  const [prompt,setPrompt] = useState("");
  const [chatHistory,setChatHistory] = useState<{role: string;content: string}[]>([]);
  const [chatData, setChatData] = useState<chat[]>([]);
  const router = useRouter();

  const saveMessagesHistory = (updatedMessages: { role: string; content: string }[]) => {
    localStorage.setItem("chatHistory", JSON.stringify(updatedMessages));
  };

  const GPT = async () =>{
    if(!prompt.trim()) {return;}

    const newHistory = [...chatHistory, {role: "user",content: prompt}];
    setChatHistory(newHistory);
    setChatData((prev) => [...prev, {gptRes:"unset",userRes:prompt}]);
    setPrompt("");
    saveMessagesHistory(newHistory);
    
    try{
      const res = await fetch('/api/GPT',{
        method:"POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify({messages: newHistory}),
      });

      const data = await res.json();
      if(res.status === 500) {alert("failed to get answer"); location.reload(); throw new Error("failed to get answer");}
      if(!res.ok){alert("failed to get answer"); location.reload(); throw new Error("failed to get answer");}
      const updateMessage = [...newHistory, {role: "assistant",content: data.reply}];
      setChatHistory(updateMessage);
      saveMessagesHistory(updateMessage);
      setChatData(prev => {
        if (prev.length === 0) return prev;
        return prev.map((chat, index) =>
          index === prev.length - 1 ? { ...chat, gptRes: data.reply } : chat
        );
      });
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch('/api/ChatNum',{
        method:"PATCH",
        headers:{Authorization:"Bearer "+ accessToken},
      });
      if(!response.ok || response.status === 500){throw new Error("값이 증가되지 않았습니다");}
    }catch(error:any){
      throw new Error(error.message);
    }
  }

  const HandleLogOut = () => {
    localStorage.removeItem("accessToken");
    router.push('/pages/auth/login');
  };
  const HandleGptRes = () => {
    if(logged){
      GPT();
    }else{
      alert("GPT와 대화하려면 로그인 해 주세요");
    }
  }
  const HandleNewChat = () =>{
    localStorage.removeItem("chatRecord");
    localStorage.removeItem("chatHistory");
    location.reload();
  }

  useEffect(()=>{
    if(chatData.length > 0) localStorage.setItem("chatRecord", JSON.stringify(chatData));
  },[chatData])

  useEffect(()=>{
    const savedChat = localStorage.getItem("chatRecord");
    if(savedChat) setChatData(JSON.parse(savedChat));
  },[]);

  useEffect(()=>{
    const saveHistory = localStorage.getItem("chatHistory");
    if(saveHistory){setChatHistory(JSON.parse(saveHistory));}
    
    if(isLoggedIn()){
      setLogged(true);
    }else{
      setLogged(false);
    }

  },[]);
  useEffect(()=>{
      const HandleKeyDown = async(event:KeyboardEvent) =>{
        if(event.key === "Enter"){
            if(isLoggedIn()){
              console.log("/");
              await GPT();
            }
            else{
              alert("GPT와 대화하려면 로그인을 먼저 해야합니다");
            }
        }
      }
      window.addEventListener("keydown",HandleKeyDown);
      return ()=> {window.removeEventListener("keydown",HandleKeyDown);}
  },[]);
  return(
    <div>
      <div className={style.nav}>
        <div>
          <span><MenuSvg/></span>
          <span onClick={HandleNewChat}><NewChatSvg/></span>
        </div>
        <div>
          <span onClick={()=> setIsOpen((prev) => !prev)}><UserIcon/></span>
          {isOpen && (
            <div className={style.userIconMenu}>
              {logged && (
                <div>
                  <div onClick={()=> router.push('/pages/auth/profile')}>프로필 보기</div>
                  <div onClick={HandleLogOut}>로그아웃 하기</div>
                </div>
              )}
              {!logged &&(<div>
                <div onClick={()=> router.push('/pages/auth/login')}>로그인 하기</div>
              </div>)}
            </div>
          )}
        </div>
      </div>
      <div className={style.gpt}>
          <div className={style.gptcontent}>
            {chatData.map((prev,index)=>(
              <div key={index}>
                <span className={style.userRes}>{prev.userRes}</span>
                {prev.gptRes === "unset" ? <span>loading...</span>: 
                  <Markdown children={prev.gptRes}></Markdown>
                }
              </div>))}
            </div>
          <div className={style.gptui}>
            <span><input onChange={(evnet)=> setPrompt(evnet.target.value)} value={prompt} type="text" /><span onClick={HandleGptRes} className={style.upload}><UploadIcon/></span></span>
          </div>
      </div>
    </div>
    
  )
}