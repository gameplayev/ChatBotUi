'use client'
import React, { useState, useEffect } from "react";
import style from "./register.module.scss";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register(){
    const route = useRouter();
    const [email,setEmail] = useState<string>("");
    const [password,setPassword] = useState<string>("");
    const [passwordCheck, setPasswordCheck] = useState<string>("");
    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };
    const register = async () => {
        if(email.length === 0 || password.length === 0 || passwordCheck.length === 0){
            alert("이메일과 비밀번호를 모두입력해 주세요");
            return;
        }else if(password !== passwordCheck){
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }else if(!isValidEmail(email)){
            alert("이메일이 올바르지 않습니다.");
            return;
        }else if(password.length < 6){
            alert("비밀번호는 최소 6자리 이여야 합니다.");
            return;
        }
        try{
            const res = await fetch("/api/auth/register",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify({email,password}),
            });
            const data = await res.json();
            if(res.status === 400){alert("이메일 또는 비밀번호가 올바르지 않습니다."); throw new Error(data.message);}
            if(!res.ok) { throw new Error(data.message); }
        
            alert("회원가입이 성공적으로 마무리 되었습니다.");
            route.push('/pages/auth/login');
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("An unknown error occurred");
        }
    }
    useEffect(()=>{
        const HandleKeyDown = (event:KeyboardEvent) =>{
            if(event.key === "Enter"){
                register();
            }
        }
        window.addEventListener("keydown",HandleKeyDown);
        return ()=> {window.removeEventListener("keydown",HandleKeyDown);}
    },[]);


    return (
        <div className={style.container}>
            <div className={style.register}>
                <h1>Create Account</h1>
                <h4>Wtire down your Email and password</h4>
                <input className={style.emailUi} type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter your Email" maxLength={100}/>
                <input className={style.pwUi} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" maxLength={20}/>
                <input className={style.pwUi} type="password" value={passwordCheck} onChange={(event) => setPasswordCheck(event.target.value)} placeholder="Enter your password Again" maxLength={20}/>
                <button className={style.regbutton} onClick={register}>Register</button>
                <div><span>Already have Account?</span><Link href={'/pages/auth/login/'}>Go to Login</Link></div>
            </div>
        </div>
    )
}