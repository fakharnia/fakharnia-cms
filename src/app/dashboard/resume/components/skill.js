import { useState } from "react";
import Image from "next/image";
import formStyles from "../../styles/form.module.css";
import commonStyles from "../../page.module.css";

export const SkillForm = ({ onSubmit }) => {

    const [title, setTitle] = useState({ value: "", error: "" });
    const [priority, setPriority] = useState({ value: "", error: "" });
    const [fileUrl, setFileUrl] = useState({ value: "", error: "" });
    const [rate, setRate] = useState();
    const [fileAlt, setFileAlt] = useState("");
    const [preview, setPreview] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    const onFileChanged = (event) => {
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

    const onChangeController = (propertyName, value) => {
        switch (propertyName) {
            case "title":
                setTitle({ value: value, error: null });
                if (value.length === 0) {
                    setTitle({ value: value, error: "Enter the Title" });
                }
                break;

            case "priority":
                setPriority({ value: value, error: null });
                if (isNaN(value) || value === undefined) {
                    setPriority({ value: value, error: "Enter the Priority" });
                }
                break;
        }
    }

    const formValidation = () => {
        let result = true;
        if (title.value === null) {
            result = false;
            setTitle({ ...title, error: "Title is required!" });
        }

        if (isNaN(priority.value) || priority.value === undefined) {
            result = false;
            setPriority({ ...readingRate, error: "Priority is required!" });
        }
        return result;
    }

    const submitForm = (event) => {
        event.preventDefault();

        if (formValidation()) {
            const data = {
                _id: null,
                title: title.value,
                priority: priority.value,
                fileUrl: fileUrl.value,
                file: selectedFile,
                rate: rate,
                fileAlt: fileAlt,
                preview: preview
            }
            onSubmit(data);
        }
    }

    return (
        <>
            <div className={commonStyles.pageHeader}>
                <h5 className={commonStyles.pageTitle}>Add Skill</h5>
            </div>
            <form className={formStyles.form} >
                <div className={formStyles.formGroup}>
                    <label className={formStyles.formLabel}>Title *</label>
                    <input type="text" className={formStyles.formControl} value={title.value} onChange={(e) => onChangeController("title", e.target.value)} />
                    {title.error ? <small className={formStyles.formControlError}>{title.error}</small> : null}
                </div>
                <div className={formStyles.formGroup}>

                    <label className={formStyles.formLabel}>Priority *</label>
                    <input type="number" min={1} max={5} className={formStyles.formControl} value={priority.value} onChange={(e) => onChangeController("priority", e.target.value)} />
                    {priority.error ? <small className={formStyles.formControlError}>{priority.error}</small> : null}
                </div>
                <div className={formStyles.formGroup}>
                    <label className={formStyles.formLabel}>Rate</label>
                    <input type="number" className={formStyles.formControl} value={rate} onChange={(e) => setRate(e.target.value)} />
                </div>
                <div className={`${formStyles.formGroup} ${formStyles.formGroupHasButton}`}>
                    <label className={formStyles.formLabel}>Icon</label>
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
                </div>
                <div className={formStyles.formGroup}>
                    <label className={formStyles.formLabel}>Icon Alt</label>
                    <input type="text" className={formStyles.formControl} value={fileAlt} onChange={(e) => setFileAlt(e.target.value)} />
                </div>
                <div className={formStyles.formButtons}>
                    <button type="button" className={formStyles.submitInnerButton} onClick={submitForm}>Add</button>
                </div>
            </form >
        </>
    )
}