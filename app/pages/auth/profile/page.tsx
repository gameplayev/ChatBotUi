'use client'
import React from "react";
import style from './profile.module.scss';
import {useRouter} from 'next/navigation'
import { useState, useEffect } from "react";

export default function profile(){
    const router = useRouter();
    const [email, setEmail] = useState<string>("");
    const [chatNum,setChatNum] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [click, setClick] = useState<boolean>(false);

    const profile = async() =>{
        const accessToken = localStorage.getItem("accessToken");
        try{
            const res = await fetch('/api/auth/profile',{
                method:"GET",
                headers: {Authorization:"Bearer "+ accessToken},
            });
            const data = await res.json();
            if(res.status === 404){alert("failed to find User"); router.push('/'); throw new Error("failed to find User");}
            if(!res.ok) { alert("failed to connect with server"); router.push('/'); throw new Error("failed to connect with server");}
            setEmail(data.user.email);
            setChatNum(data.user.chatNumber);
            setLoading(false);
        }catch(error: unknown){
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("An unknown error occurred");
          }
    }
    const removeProfile = async() => {
        const accessToken = localStorage.getItem("accessToken");
        try{
            const res = await fetch('/api/auth/delete',{
                method:"DELETE",
                headers: {Authorization: "Bearer " + accessToken},
            });
            if(res.status === 404 || res.status === 401) {alert("failed to Delete User"); router.push('/'); throw new Error("failed to Delete User");}
            if(!res.ok) {alert("failed to connect with server"); router.push('/'); throw new Error("failed to connect with server");}
            alert("Successfully Deleted your account!");
            localStorage.removeItem("accessToken");
            router.push('/');
        }catch(error:any){
            throw new Error(error.message);
        }
    }
    const HandleDelete = () => {
        if(confirm("Are you sure?")){
            removeProfile();
        }
    }

    useEffect(()=>{
        profile();
    },[])
    if(loading) return <div className={style.loading}>loading...</div>

    return(
        <div className={style.container}>
            <h2>Hello {email}</h2>
            <h4>You have been chatted {chatNum} times with GPT!</h4>
            <div className={style.actions} onClick={() => setClick(!click)}>actions
            </div>
            {click && <div className={style.delete}><span onClick={HandleDelete}>DELETE ACCOUNT</span><span onClick={() => router.push('/')}>Go To HOME</span></div>}
        </div>
    )
}