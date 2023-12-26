
"use client"

import { useState } from "react";
import Image from "next/image";
import styles from "../../styles/form.module.css";

export const InnerForm = ({ dataHandler }) => {

    const [priority, setPriority] = useState({ value: null, error: "" });
    const [fileUrl, setFileUrl] = useState({ value: "", error: "" });
    const [fileAlt, setFileAlt] = useState("");
    const [isCover, setIsCover] = useState(false);
    const [preview, setPreview] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFileUrl({ value: file.name, error: "" });
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const formValidation = () => {
        let result = true;

        if (priority.value === null) {
            result = false;
            setPriority({ ...priority, error: "Priority required!" });
        }
        if (fileUrl.value === "") {
            result = false;
            setFileUrl({ ...fileUrl, error: "File required!" });
        }

        return result;
    }

    const submitHandler = (event) => {
        event.preventDefault();

        if (formValidation()) {
            const data = {
                priority: priority.value,
                fileAlt: fileAlt,
                fileUrl: fileUrl.value,
                isCover: isCover,
                file: selectedFile,
                preview: preview
            }
            dataHandler(data);
        }
    }

    return (
        <>
            <form className={styles.form} >
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Priority *</label>
                    <input type="number" className={styles.formControl} value={priority.value} onChange={(e) => setPriority({ value: e.target.value, error: "" })} />
                    {priority.error.length > 0 ? <small className={styles.formControlError}>{priority.error}</small> : ''}
                </div>
                <div className={`${styles.formGroup}`}>
                    <label className={styles.formLabel}>File *</label>
                    {
                        preview ?
                            <Image width={200} height={190} className={styles.coverImagePreview} src={preview} alt="Preview" />
                            :
                            <i className={styles.coverImagePreview}></i>
                    }

                    <label className={styles.formUpload}>
                        <input className={styles.formControl} type="file" accept="image/*" onChange={handleFileChange} />
                        <i className={styles.innerButton}>Upload</i>
                    </label>
                    <small className={styles.formControlError}>{fileUrl.error}</small>
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>File Alt</label>
                    <input type="text" className={styles.formControl} value={fileAlt.value} onChange={(e) => setFileAlt(e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.checkboxLabel}>
                        <input type="checkbox" className={styles.hide} checked={isCover} onChange={(e) => setIsCover(e.target.checked)} />
                        <p>The Image is cover</p>
                        <i></i>
                    </label>
                </div>
                <div className={styles.formButtons}>
                    <button type="button" className={styles.submitInnerButton} onClick={submitHandler}>Add</button>
                </div>
            </form >
        </>
    )
}

export default InnerForm;