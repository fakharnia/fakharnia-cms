"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import commonStyles from "../page.module.css";
import componentStyles from "./page.module.css";
import { useMessage } from "@/app/context/messageContext";
import { useMenu } from "@/app/context/menuContext";
import { getsAction, deleteAction } from "./action";

export const Designs = () => {
    const previewURL = process.env.NEXT_PUBLIC_API_STATIC_ENDPOINT;

    const { changeMenu } = useMenu();
    const { addMessage, cancel } = useMessage();

    const [designs, setDesigns] = useState([]);

    const fetchDesigns = async () => {
        const response = await getsAction();
        setDesigns(response ?? []);
    }

    useEffect(() => {
        fetchDesigns();
        changeMenu("/dashboard/designs");
    }, []);

    const onDesignDeleted = async (designId) => {
        const result = await deleteAction(designId);
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
            <div className={commonStyles.pageContainer}>
                <div className={commonStyles.pageHeader}>
                    <h5 className={commonStyles.pageTitle}>Designs</h5>
                    <Link className={commonStyles.pageAddButton} href="./designs/0">Add</Link>
                </div>
                <ul className={componentStyles.designList}>
                    {
                        designs.map((design, index) =>
                        (
                            <li key={index} className={componentStyles.design}>
                                <Image className={componentStyles.designImage} src={`${previewURL}/design/${design.coverUrl}`} width={500} height={190} alt={design.coverAlt} />
                                <h5 className={componentStyles.designTitle}>{design.title}</h5>
                                <p className={componentStyles.designDescription}>{design.description}</p>
                                <div className={componentStyles.designOptions}>
                                    <Link className={componentStyles.designButton} href={"/dashboard/designs/" + design._id}>Edit</Link>
                                    <button className={componentStyles.designButton} onClick={() => { onDesignDeleted(design._id) }}>Delete</button>
                                </div>
                            </li>
                        ))
                    }
                </ul>
                {designs.length === 0 ? <p className={componentStyles.noData}>There isn&apos;t any design yet!</p> : ""}
            </div>
        </>
    )
}

export default Designs;