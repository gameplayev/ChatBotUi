'use client';
import React, { useEffect, useState } from "react";
import style from "./page.module.scss";
import { useStateClassManager } from "./compomnets/Hooks/StateClass";
import MenuSvg from './compomnets/svgs/layout-sidebar-inactive.svg';
import NewChatSvg from './compomnets/svgs/file-pencil.svg';
import UserIcon from './compomnets/svgs/user.svg';

export default function Main(){
  const [sidebar, addSidebar, removeSidebar] = useStateClassManager();
  const [userIconOpen,setUserIconOpen] = useState<boolean>(false);
  const [userLogin, setUserLogin] = useState<boolean>(false);
  useEffect(()=>{
    addSidebar(style.sidebar);
  },[])
  return(
    <div>
      <div className={style.nav}>
        <div>
          <span><MenuSvg/></span>
          <span><NewChatSvg/></span>
        </div>
        <div>
          <span><UserIcon/></span>

        </div>
      </div>
      <div className={sidebar}></div>
    </div>
    
  )
}