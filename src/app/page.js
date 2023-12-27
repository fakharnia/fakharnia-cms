"use client"

import styles from "./page.module.css";
import { redirect } from "next/navigation"
import { useSession } from "next-auth/react"
import Login from "./components/login";

const Home = () => {
  const session = useSession({ required: true, onUnauthenticated() { } })

  if (session.status === "authenticated") {
    redirect("/dashboard");
  }

  return (
    <div className={styles.container}>
      <Login />
    </div >
  )
}
export default Home;
