"use client"

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import Link from "next/link";
import Image from "next/image";
import styles from "../page.module.css";
import formStyles from "../styles/form.module.css";
import { useMenu } from "@/app/context/menuContext";
import { useMessage } from "@/app/context/messageContext";
import { getStatus } from "@/lib/status.lib";

const Status = () => {

    const [_id, setId] = useState("");
    const [dailyText, setDailyText] = useState("");
    const [title, setTitle] = useState("");
    const [state, setState] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [preview, setPreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState("");
    const [deleteAvatar, setDeleteAvatar] = useState(false);

    const { addMessage, cancel } = useMessage();

    const previewURL = process.env.NEXT_PUBLIC_API;

    const router = useRouter();

    const { changeMenu } = useMenu();

    const [data, setData] = useState([]);

    const fetChStatus = async () => {
        const response = await getStatus()
        setData(response ?? []);
        setId(response?._id ?? "");
        setDailyText(response?.dailyText ?? "");
        setTitle(response?.title ?? "");
        setState(response?.state ?? "");
        setAvatarUrl(response?.avatarUrl ?? "");
        setPreview(response?.avatarUrl ? `${previewURL}/public/avatar/${response?.avatarUrl}` : null);
        setSelectedFile(null ?? "");
        setDeleteAvatar(false);
    };

    useEffect(() => {
        fetChStatus();
        changeMenu("/dashboard/status");
    }, []);



    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setAvatarUrl(file.name);
            setDeleteAvatar(false);
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteAvatar = (event) => {
        setDeleteAvatar(true);
        setPreview(null);
        setAvatarUrl(null);
    }

    const submitHandler = async (event) => {
        event.preventDefault();

        const form = new FormData();
        form.append("_id", _id ?? null);
        form.append("dailyText", dailyText ?? null);
        form.append("title", title ?? null);
        form.append("state", state ?? null);
        form.append("avatarUrl", avatarUrl ?? null);
        form.append('avatar', selectedFile ?? null);
        form.append("deleteAvatar", deleteAvatar);

        await submit(form);

        addMessage({ text: "Status Successfully Updated", okText: "OK", ok: cancel });
        changeMenu("/dashboard");
        router.push("/dashboard");
    }

    return (
        <>
            <title>Fakharnia CMS | Status</title>
            <div className={styles.pageContainer}>
                <div className={styles.pageHeader}>
                    <h5 className={styles.pageTitle}>Status</h5>
                    <Link href="/dashboard" className={styles.pageReturnButton} onClick={() => { changeMenu("/dashbaord") }}>Return</Link>
                </div>
                <form className={formStyles.form} onSubmit={submitHandler}>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>Daily Text</label>
                        <textarea className={formStyles.formControl} value={dailyText} onChange={(e) => setDailyText(e.target.value)} ></textarea>
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>Title</label>
                        <input type="text" className={formStyles.formControl} value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>state</label>
                        <select className={formStyles.formControl} value={state} onChange={(e) => setState(e.target.value)}>
                            <option value="online">Online</option>
                            <option value="away">Away</option>
                            <option value="break">In Break</option>
                        </select>
                    </div>
                    <div className={`${formStyles.formGroup} ${formStyles.formGroupHasButton}`}>
                        {
                            preview ?
                                <Image width={100} height={100} className={formStyles.imagePreview} src={preview} alt="Preview" />
                                :
                                <i className={formStyles.imagePreview}></i>
                        }

                        <label className={formStyles.formUpload}>
                            <input className={formStyles.formControl} type="file" accept="image/*" onChange={handleFileChange} />
                            <i className={formStyles.innerButton}>Upload</i>
                        </label>
                        <button className={formStyles.innerButton} type="button" onClick={handleDeleteAvatar}>Delete</button>
                    </div>
                    <div className={formStyles.formButtons}>
                        <button type="submit" className={formStyles.submitButton}>Save Changes</button>
                    </div>
                </form>
            </div>
        </>
    )
}
export default Status;
