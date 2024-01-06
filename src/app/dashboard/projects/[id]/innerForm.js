"use client"

import { useState } from "react"
import formStyles from "../../styles/form.module.css";

export const InnerForm = ({ onSubmit }) => {

    const [name, setName] = useState({ value: "", error: "" });
    const [fa_description, setFa_description] = useState({ value: "", error: "" });
    const [en_description, setEn_description] = useState({ value: "", error: "" });
    const [deu_description, setDeu_description] = useState({ value: "", error: "" });

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
            onSubmit({
                name: name.value,
                fa_description: fa_description.value,
                en_description: en_description.value,
                deu_description: deu_description.value
            });
        }
    }

    return (
        <>
            <div className={formStyles.formGroup}>
                <label className={formStyles.formLabel}>Name *</label>
                <input type="text" className={formStyles.formControl} value={name.value} onChange={(e) => setName({ value: e.target.value, error: "" })} />
                {name.error.length > 0 ? <small className={formStyles.formControlError}>{name.error}</small> : ''}
            </div>
            <div className={formStyles.formGroup}>
                <label className={formStyles.formLabel}>Farsi Description</label>
                <textarea type="text" className={formStyles.formControl} value={fa_description.value} onChange={(e) => setFa_description({ value: e.target.value, error: "" })}></textarea>
            </div>
            <div className={formStyles.formGroup}>
                <label className={formStyles.formLabel}>English Description</label>
                <textarea type="text" className={formStyles.formControl} value={en_description.value} onChange={(e) => setEn_description({ value: e.target.value, error: "" })}></textarea>
            </div>
            <div className={formStyles.formGroup}>
                <label className={formStyles.formLabel}>German Description</label>
                <textarea type="text" className={formStyles.formControl} value={deu_description.value} onChange={(e) => setDeu_description({ value: e.target.value, error: "" })}></textarea>
            </div>

            <div className={formStyles.formButtons}>
                <button type="button" className={formStyles.submitInnerButton} onClick={submitForm}>Add</button>
            </div>
        </>
    )
}
