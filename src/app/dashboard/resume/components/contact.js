import { useState } from "react";
import Image from "next/image";
import formStyles from "../../styles/form.module.css";
import commonStyles from "../../page.module.css";

export const ContactForm = ({ onSubmit }) => {

    const [link, setLink] = useState({ value: "", error: "" });
    const [priority, setPriority] = useState({ value: "", error: "" });
    const [iconClass, setIconClass] = useState({ value: "", error: "" });

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
                    setPriority({ value: value, error: "Enter the Priority" });
                }
                break;
            case "iconClass":
                setIconClass({ value: value, error: null });
                if (!value) {
                    setIconClass({ value: value, error: "Enter the Icon Class" });
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
        if (iconClass.value === null || !iconClass.value) {
            result = false;
            setIconClass({ ...iconClass, error: "Icon Class is required!" });
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
                iconClass: iconClass.value
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
                <div className={formStyles.formGroup}>
                    <label className={formStyles.formLabel}>Icon Class *</label>
                    <input type="text" className={formStyles.formControl} value={iconClass.value} onChange={(e) => onChangeController("iconClass", e.target.value)} />
                    {iconClass.error ? <small className={formStyles.formControlError}>{iconClass.error}</small> : null}
                </div>

                <div className={formStyles.formButtons}>
                    <button type="button" className={formStyles.submitInnerButton} onClick={submitForm}>Add</button>
                </div>
            </form >
        </>
    )
}