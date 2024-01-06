"use client"

import { useState } from "react"
import formStyles from "../../styles/form.module.css";

export const InnerForm = ({ onSubmit }) => {

    const [title, setTitle] = useState({ value: "", error: "" });

    const formValidation = () => {
        let result = true;
        if (title.value.length === 0) {
            result = false;
            setTitle({ ...title, error: "Title required!" })
        }
        return result;
    }

    const submitForm = () => {
        if (formValidation()) {
            onSubmit(title.value);
            setTitle({ value: "", error: "" });
        }
    }

    return (
        <>
            <div className={formStyles.formGroup}>
                <label className={formStyles.formLabel}>Title *</label>
                <input type="text" className={formStyles.formControl} value={title.value} onChange={(e) => setTitle({ value: e.target.value, error: "" })} />
                {title.error.length > 0 ? <small className={formStyles.formControlError}>{title.error}</small> : ''}
            </div>
            <div className={formStyles.formButtons}>
                <button type="button" className={formStyles.submitInnerButton} onClick={submitForm}>Add</button>
            </div>
        </>
    )
}
