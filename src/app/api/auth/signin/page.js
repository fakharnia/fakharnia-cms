"use client"

import { redirect } from "next/navigation";

const SignIn = () => {
    console.log("Hi I was meted!");
    redirect("/")
}
export default SignIn;