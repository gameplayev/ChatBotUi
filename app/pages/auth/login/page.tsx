'use client'
import React, { useEffect } from "react";
import style from './login.module.scss';
import Showpw from '@/app/compomnets/svgs/eye.svg';
import Closepw from '@/app/compomnets/svgs/eye closed.svg';
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();
    const [showPw, setShowPw] = useState<Boolean>(false);
    const [pwType, setPwType] = useState<string>("password");
    const [password, setPassword] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    const login = async () => {
        if (email.length === 0 || password.length === 0) {
            alert("이메일 또는 비밀번호를 모두 입력해 주세요.");
            return;
        } else if (!isValidEmail(email)) {
            alert("이메일을 올바르게 입력해 주세요.");
            return;
        }

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (res.status === 401) { 
                alert("이메일 또는 비밀번호가 올바르지 않습니다.");
                throw new Error(data.message);
            }
            if (!res.ok) { 
                throw new Error(data.message); 
            }

            localStorage.setItem("accessToken", data.accessToken);
            router.push('/');

        }catch(error: unknown){
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("An unknown error occurred");
          }
    }

    const HandleShowPw = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setShowPw(!showPw);
        if (showPw) {
            setPwType("password");
        } else { 
            setPwType("text"); 
        }
    }

    useEffect(() => {
        const HandleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                login();
            }
        }
        window.addEventListener("keydown", HandleKeyDown);
        return () => { window.removeEventListener("keydown", HandleKeyDown); }
    }, []);

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    return (
        <div className={style.container}>
            <div className={style.login}>
                <h1>Sign In</h1>
                <h4>Please Enter your Email and Password</h4>
                <input 
                    type="email" 
                    value={email} 
                    onChange={(event) => setEmail(event.target.value)} 
                    placeholder="Enter your Email" 
                    maxLength={100} 
                />
                <span>
                    <input 
                        type={pwType} 
                        value={password} 
                        onChange={(event) => setPassword(event.target.value)} 
                        maxLength={20} 
                        placeholder="Enter your Password" 
                    />
                    <button onClick={HandleShowPw}>
                        {showPw && (<Showpw />)}
                        {!showPw && (<Closepw />)}
                    </button>
                </span>
                <button className={style.signIn} onClick={login}>Sign In</button>
                <div className={style.register}>
                    <span>Don't have account?</span>
                    <Link href="/pages/auth/register">Create Account</Link>
                </div>
            </div>
        </div>
    );
}
