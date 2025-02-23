'use client';
import React, { useEffect, useState, useRef } from "react";
import style from "./page.module.scss";
import MenuSvg from './compomnets/svgs/layout-sidebar-inactive.svg';
import NewChatSvg from './compomnets/svgs/file-pencil.svg';
import UserIcon from './compomnets/svgs/user.svg';
import { useRouter } from "next/navigation";
import {isLoggedIn} from './compomnets/funcs/Islogged';

export default function Main(){
  const [isOpen, setIsOpen] = useState(false);
  const [logged,setLogged] = useState(false);
  const router = useRouter();

  const HandleLogOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push('/pages/auth/login');
  };
  useEffect(()=>{
    if(isLoggedIn()){
      setLogged(true);
    }else{
      setLogged(false);
    }
  },[]);
  return(
    <div>
      <div className={style.nav}>
        <div>
          <span><MenuSvg/></span>
          <span><NewChatSvg/></span>
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
      {/*the space for make chat gpt chat (!add condition which check user is logged!) */}
    </div>
    
  )
}