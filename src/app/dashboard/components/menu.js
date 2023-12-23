"use client";

import Image from "next/image";
import Link from "next/link";

import { useMenu } from "@/app/context/menuContext";

import styles from "../page.module.css";

export const MenuComponent = () => {

    const { menu, changeMenu } = useMenu();

    const navigationItems = [
        { path: '/dashboard/chats', label: 'Chats' },
        { path: '/dashboard/status', label: 'Status' },
        { path: '/dashboard/services', label: 'Services' },
        { path: '/dashboard/projects', label: 'Projects' },
        { path: '/dashboard/designs', label: 'Designs' },
        { path: '/dashboard/resume', label: 'Resume' },
        { path: '/dashboard/posts', label: 'Posts' },
    ];

    const navigate = (path) => {
        changeMenu(path);
    }

    return (
        <>
            <div className={styles.menu}>
                <Link href="/dashboard" >
                    <Image src="/logo.svg" alt="logo" width={0} height={0} onClick={() => navigate("/dashboard")} />
                </Link>

                <button type="button" className="cms-logout"></button>
                <ul>
                    {navigationItems.map((item) => (
                        <li key={item.path} className={menu === item.path ? styles.active : ''} >
                            <Link href={item.path} onClick={() => navigate(item.path)}>{item.label}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}
