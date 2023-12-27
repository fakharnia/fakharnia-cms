
"use client"

import { useState } from "react";
import Image from "next/image";
import commonStyles from "../../page.module.css";
import formStyles from "../../styles/form.module.css";

export const InnerForm = ({ onSubmit }) => {

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
            onSubmit(data);
        }
    }

    return (
        <>
            <div className={commonStyles.pageHeader}>
                <h5 className={commonStyles.pageTitle}>Add Image</h5>
            </div>
            <form className={formStyles.form} >
                <div className={`${formStyles.formGroup}`}>
                    <label className={formStyles.formLabel}>File *</label>
                    {
                        preview ?
                            <Image width={200} height={190} className={formStyles.coverImagePreview} src={preview} alt="Preview" />
                            :
                            <i className={formStyles.coverImagePreview}></i>
                    }

                    <label className={formStyles.formUpload}>
                        <input className={formStyles.formControl} type="file" accept="image/*" onChange={handleFileChange} />
                        <i className={formStyles.innerButton}>Upload</i>
                    </label>
                    <small className={formStyles.formControlError}>{fileUrl.error}</small>
                </div>
                <div className={formStyles.formGroup}>
                    <label className={formStyles.formLabel}>File Alt</label>
                    <input type="text" className={formStyles.formControl} value={fileAlt.value} onChange={(e) => setFileAlt(e.target.value)} />
                </div>
                <div className={formStyles.formGroup}>
                    <label className={formStyles.checkboxLabel}>
                        <input type="checkbox" className={formStyles.hide} checked={isCover} onChange={(e) => setIsCover(e.target.checked)} />
                        <p>The Image is cover of this design</p>
                        <i></i>
                    </label>
                </div>
                <div className={formStyles.formGroup}>
                    <label className={formStyles.formLabel}>Priority *</label>
                    <input type="number" className={formStyles.formControl} value={priority.value} onChange={(e) => setPriority({ value: e.target.value, error: "" })} />
                    {priority.error.length > 0 ? <small className={formStyles.formControlError}>{priority.error}</small> : ''}
                </div>

                <div className={formStyles.formButtons}>
                    <button type="button" className={formStyles.submitInnerButton} onClick={submitHandler}>Add</button>
                </div>
            </form >
        </>
    )
}

export default InnerForm;