"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../page.module.css";
import designStyles from "./page.module.css";
import { useMessage } from "@/app/context/messageContext";
import { deleteDesign, getDesigns } from "@/lib/design.lib";
import { useMenu } from "@/app/context/menuContext";


export const Designs = () => {
    const { changeMenu } = useMenu();
    const [designs, setDesigns] = useState([]);
    const previewURL = process.env.NEXT_PUBLIC_API;
    const { addMessage, cancel } = useMessage();

    const fetchDesigns = async () => {
        const response = await getDesigns();
        setDesigns(response ?? []);
    }

    useEffect(() => {
        fetchDesigns();
        changeMenu("/dashboard/design");
    }, []);

    const handleDelete = async (designId) => {
        const result = await deleteDesign(designId);
        if (result !== undefined) {
            addMessage({ text: "Design Successfully Deleted", okText: "OK", ok: cancel });
            await fetchDesigns();
        } else {
            addMessage({ text: "Operation Failed!", okText: "OK", ok: cancel });
        }
    }

    return (
        <>
            <title>Fakharnai CMS | Desgins</title>
            <div className={styles.pageContainer}>
                <div className={styles.pageHeader}>
                    <h5 className={styles.pageTitle}>Designs</h5>
                    <Link className={styles.pageAddButton} href="./designs/0">Add</Link>
                </div>
                <ul className={designStyles.designList}>
                    {
                        designs.map((design, index) =>
                        (
                            <li key={index} className={designStyles.design}>
                                <Image className={designStyles.designImage} src={`${previewURL}/public/design/${design.coverUrl}`} width={500} height={190} alt={design.coverAlt} />
                                <h5 className={designStyles.designTitle}>{design.title}</h5>
                                <p className={designStyles.designDescription}>{design.description}</p>
                                <div className={designStyles.designOptions}>
                                    <Link className={designStyles.designButton} href={"/dashboard/designs/" + design._id}>Edit</Link>
                                    <button className={designStyles.designButton} onClick={() => { handleDelete(design._id) }}>Delete</button>
                                </div>
                            </li>
                        ))
                    }
                </ul>
                {designs.length === 0 ? <p className={designStyles.noData}>There isn't any design yet!</p> : ""}
            </div>
        </>
    )
}

export default Designs;