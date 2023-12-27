"use client"

import { useState } from "react"
import formStyles from "../../styles/form.module.css";

export const InnerForm = ({ onSubmit }) => {

    const [name, setName] = useState({ value: "", error: "" });
    const [description, setDescription] = useState({ value: "", error: "" });

    const formValidation = () => {
        let result = true;
        if (name.value.length === 0) {
            result = false;
            setName({ ...name, error: "Name required!" })
        }
        return result;
    }

    const submitForm = () => {
        if (formValidation()) {
            onSubmit({ name: name.value, description: description.value });
            setName({ value: "", error: "" });
            setDescription({ value: "", error: "" });
        }
    }

    return (
        <>
            <div className={formStyles.formGroup}>
                <label className={formStyles.formLabel}>Title *</label>
                <input type="text" className={formStyles.formControl} value={name.value} onChange={(e) => setName({ value: e.target.value, error: "" })} />
                {name.error.length > 0 ? <small className={formStyles.formControlError}>{name.error}</small> : ''}
            </div>
            <div className={formStyles.formGroup}>
                <label className={formStyles.formLabel}>Description (MD)</label>
                <input type="text" className={formStyles.formControl} value={description.value} onChange={(e) => setDescription({ value: e.target.value, error: "" })} />
            </div>
            <div className={formStyles.formButtons}>
                <button type="button" className={formStyles.submitInnerButton} onClick={submitForm}>Add</button>
            </div>
        </>
    )
}
