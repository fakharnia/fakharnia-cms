"use client"

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import Link from "next/link";
import Image from "next/image";
import commonStyles from "../page.module.css";
import formStyles from "../styles/form.module.css";
import { useMenu } from "@/app/context/menuContext";
import { useDashboardMessage } from "../context/messageContext";
import { getStatus } from "@/lib/status.lib";
import { updateAction } from "./action";

const Status = () => {
    const previewURL = process.env.NEXT_PUBLIC_API_STATIC_ENDPOINT;
    const router = useRouter();

    // Contextes
    const { changeMenu } = useMenu();
    const { addMessage, cancel } = useDashboardMessage();

    // Form properties
    const [_id, setId] = useState("");
    const [fa_text, setFa_text] = useState("");
    const [en_text, setEn_text] = useState("");
    const [deu_text, setDeu_text] = useState("");
    const [fa_status, setFa_status] = useState("");
    const [en_status, setEn_status] = useState("");
    const [deu_status, setDeu_status] = useState("");
    const [state, setState] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [preview, setPreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState("");
    const [deleteAvatar, setDeleteAvatar] = useState(false);

    const fetChStatus = async () => {
        const response = await getStatus()
        setId(response?._id ?? "");
        setFa_text(response?.fa_text ?? "");
        setEn_text(response?.en_text ?? "");
        setDeu_text(response?.deu_text ?? "");
        setFa_status(response?.fa_status ?? "");
        setEn_status(response?.en_status ?? "");
        setDeu_status(response?.deu_status ?? "");
        setState(response?.state ?? "");
        setAvatarUrl(response?.avatarUrl ?? "");
        setPreview(response?.avatarUrl ? `${previewURL}/avatar/${response?.avatarUrl}` : null);
        setSelectedFile(null ?? "");
        setDeleteAvatar(false);
    };

    useEffect(() => {
        fetChStatus();
        changeMenu("/dashboard/status");
    }, []);

    const onFileChanged = (event) => {
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

    const onDeleteAvatar = (event) => {
        setDeleteAvatar(true);
        setPreview(null);
        setAvatarUrl(null);
    }

    const formValidation = () => {
        var result = true;


        return result;
    }

    const submitForm = async (event) => {
        event.preventDefault();
        if (formValidation()) {
            const form = new FormData();
            form.append("_id", _id ?? null);
            form.append("fa_text", fa_text ?? null);
            form.append("en_text", en_text ?? null);
            form.append("deu_text", deu_text ?? null);
            form.append("fa_status", fa_status ?? null);
            form.append("en_status", en_status ?? null);
            form.append("deu_status", fa_status ?? null);
            form.append("state", state ?? null);
            form.append("avatarUrl", avatarUrl ?? null);
            form.append('avatar', selectedFile ?? null);
            form.append("deleteAvatar", deleteAvatar);

            try {
                const result = await updateAction(form);

                if (result !== undefined) {
                    addMessage({ text: "Status Successfully Updated", type: "message", cancel: cancel });
                    changeMenu("/dashboard");
                    router.push("/dashboard");
                } else {
                    addMessage({ text: "Operation Failed!", type: "error", cancel: cancel });
                }

            } catch (error) {
                addMessage({ text: "Connection to server failed!", type: "error", cancel: cancel });
            }
        }
    }

    return (
        <>
            <title>Fakharnia CMS | Status</title>
            <div className={commonStyles.pageContainer}>
                <div className={commonStyles.pageHeader}>
                    <h5 className={commonStyles.pageTitle}>Status</h5>
                    <Link href="/dashboard" className={commonStyles.pageReturnButton} onClick={() => { changeMenu("/dashbaord") }}>Return</Link>
                </div>
                <form className={formStyles.form} onSubmit={submitForm}>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>Daily Text (Farsi)</label>
                        <textarea className={formStyles.formControl} value={fa_text} onChange={(e) => setFa_text(e.target.value)} ></textarea>
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>Daily Text (English)</label>
                        <textarea className={formStyles.formControl} value={en_text} onChange={(e) => setEn_text(e.target.value)} ></textarea>
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>Daily Text (Deutsch)</label>
                        <textarea className={formStyles.formControl} value={deu_text} onChange={(e) => setDeu_text(e.target.value)} ></textarea>
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>Status (Farsi)</label>
                        <input type="text" className={formStyles.formControl} value={fa_status} onChange={(e) => setFa_status(e.target.value)} />
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>Status (English)</label>
                        <input type="text" className={formStyles.formControl} value={en_status} onChange={(e) => setEn_status(e.target.value)} />
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>Status (Deutsch)</label>
                        <input type="text" className={formStyles.formControl} value={deu_status} onChange={(e) => setDeu_status(e.target.value)} />
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
                            <input className={formStyles.formControl} type="file" accept="image/*" onChange={onFileChanged} />
                            <i className={formStyles.innerButton}>Upload</i>
                        </label>
                        <button className={formStyles.innerButton} type="button" onClick={onDeleteAvatar}>Delete</button>
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
