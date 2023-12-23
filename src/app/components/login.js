"use client"

import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react"

import styles from "./login.module.css";

import { useMessage } from "../context/messageContext";

const Login = () => {

    const { addMessage, cancel } = useMessage();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordInput, setPasswordInput] = useState(true);

    const submitHandler = async (event) => {
        event.preventDefault();
        const model = JSON.stringify({
            username: username,
            password: password
        });
        const result = await signIn("credentials", { redirect: false, model });
        if (result?.error) {
            addMessage({ text: "Username or Password wrong!", cancel: cancel, cancelText: "OK" });
        }

    }

    return (
        <>
            <title>Fakharnia CMS / Login</title>
            <form onSubmit={submitHandler} className={`flex-row flex-align-center flex-justify-around shadow-a ${styles.loginForm}`}>
                <Image src="/logo.svg" width={0} height={0} alt="logo" priority={true} />
                <div className="width-block flex-row flex-justify-around">
                    <label className="width-block flex-row flex-justify-between text-left">Username</label>
                    <input type="text" placeholder="Enter your username" autoComplete="username" onChange={(e) => setUsername(e.target.value)} />
                    <label className="width-block flex-row flex-justify-between text-left">
                        Password
                        <i className={(passwordInput ? "cms-eye-blocked" : "cms-eye") + " text-center color-light-a"} onMouseEnter={(e) => setPasswordInput(!passwordInput)} onMouseLeave={(e) => setPasswordInput(!passwordInput)}></i>
                    </label>
                    <input type={passwordInput ? "password" : "text"} placeholder="Enter your password" autoComplete="current-password" onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit">Submit</button>
                </div>
            </form>
        </>
    )
}

export default Login;