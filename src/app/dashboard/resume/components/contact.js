import { useState } from "react";
import Image from "next/image";
import formStyles from "../../styles/form.module.css";
import commonStyles from "../../page.module.css";

export const ContactForm = ({ onSubmit }) => {

    const [link, setLink] = useState({ value: "", error: "" });
    const [priority, setPriority] = useState({ value: "", error: "" });
    const [fileUrl, setFileUrl] = useState({ value: "", error: "" });
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
            case "link":
                setLink({ value: value, error: null });
                if (value.length === 0) {
                    setLink({ value: value, error: "Enter the Title" });
                }
                break;
            case "priority":
                setPriority({ value: value, error: null });
                if (isNaN(value) || value === undefined) {
                    setPriority({ value: value, error: "Enter the Priority Rate" });
                }
                break;
        }
    }

    const formValidation = () => {
        let result = true;
        if (link.value === null) {
            result = false;
            setLink({ ...link, error: "Title is required!" });
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
                link: link.value,
                priority: priority.value,
                fileUrl: fileUrl.value,
                file: selectedFile,
                fileAlt: fileAlt,
                preview: preview
            }
            onSubmit(data);
        }
    }

    return (
        <>
            <div className={commonStyles.pageHeader}>
                <h5 className={commonStyles.pageTitle}>Add Contact</h5>
            </div>
            <form className={formStyles.form} >
                <div className={formStyles.formGroup}>
                    <label className={formStyles.formLabel}>Link *</label>
                    <input type="text" className={formStyles.formControl} value={link.value} onChange={(e) => onChangeController("link", e.target.value)} />
                    {link.error ? <small className={formStyles.formControlError}>{link.error}</small> : null}
                </div>
                <div className={formStyles.formGroup}>
                    <label className={formStyles.formLabel}>Priority *</label>
                    <input type="number" min={1} max={5} className={formStyles.formControl} value={priority.value} onChange={(e) => onChangeController("priority", e.target.value)} />
                    {priority.error ? <small className={formStyles.formControlError}>{priority.error}</small> : null}
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