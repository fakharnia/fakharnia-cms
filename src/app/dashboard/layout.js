"use client"

import styles from "./page.module.css";

import { MenuProvider } from "../context/menuContext";
import { MenuComponent } from "./components/menu";

const layout = ({ children }) => {

    return (
        <>
            <title>Fakharnia CMS / Dashboard</title>
            <MenuProvider>
                <div className={`${styles.container} flex-row flex-justify-around flex-align-center`}>
                    <div className={`${styles.layout} flex-row flex-justify-between`}>
                        <MenuComponent />
                        {children}
                    </div>
                </div>
            </MenuProvider>
        </>
    )
}

export default layout