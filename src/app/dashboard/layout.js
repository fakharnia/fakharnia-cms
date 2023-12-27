"use client"

import commonStyles from "./page.module.css";
import { MenuProvider } from "../context/menuContext";
import { DashboardMessageProvider } from "./context/messageContext";
import { MenuComponent } from "./components/menu";
import { DashboardMessage } from "./components/message";

const layout = ({ children }) => {

    return (
        <>
            <title>Fakharnia CMS / Dashboard</title>
            <DashboardMessageProvider>
                <MenuProvider>
                    <div className={`${commonStyles.container} flex-row flex-justify-around flex-align-center`}>
                        <div className={`${commonStyles.layout} flex-row flex-justify-between`}>
                            <MenuComponent />
                            {children}
                            <DashboardMessage />
                        </div>
                    </div>
                </MenuProvider>
            </DashboardMessageProvider>
        </>
    )
}
export default layout