'use client';
import React, { useState } from "react";
import style from "./page.module.scss";
import { useStateClassManager } from "./compomnets/Hooks/StateClass";


export default function Main(){
  
  return(
    <div className={style.sidebar}></div>
  )
}