"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from 'react-markdown';

import styles from "../page.module.css";
import serviceStyles from "./page.module.css";

import { getServices, deleteService } from "@/lib/service.lib";
import { useMenu } from "@/app/context/menuContext";
import { useMessage } from "@/app/context/messageContext";


const Services = () => {

    const { changeMenu } = useMenu();
    const [services, setServices] = useState([]);
    const previewURL = process.env.NEXT_PUBLIC_API;
    const { addMessage, cancel } = useMessage();

    const fetchServices = async () => {
        const response = await getServices();
        setServices(response ?? []);
    }

    useEffect(() => {
        fetchServices();
        changeMenu("/dashboard/services");
    }, [])

    const handleDelete = async (serviceId) => {
        const result = await deleteService(serviceId);
        if (result !== undefined) {
            addMessage({ text: "PService Successfully Deleted", okText: "OK", ok: cancel });
            await fetchServices();
        } else {
            addMessage({ text: "Operation Failed!", okText: "OK", ok: cancel });
        }
    }

    return (
        <>
            <title>Fakharnia CMS | Services</title>
            <div className={styles.pageContainer}>
                <div className={styles.pageHeader}>
                    <h5 className={styles.pageTitle}>Services</h5>
                    <Link className={styles.pageAddButton} href="./services/0">Add</Link>
                </div>
                <ul className={serviceStyles.servicesList}>
                    {
                        services.map((service, index) =>
                        (<li key={index} className={serviceStyles.service}>
                            <Image className={serviceStyles.serviceImage} src={`${previewURL}/public/service/${service.coverUrl}`} width={500} height={190} alt={service.coverAlt} />
                            <h5 className={serviceStyles.serviceTitle}>{service.title}</h5>
                            <ReactMarkdown className={serviceStyles.serviceDescription}>{service.content}</ReactMarkdown>
                            <div className={serviceStyles.serviceOptions}>
                                <Link className={serviceStyles.serviceButton} href={"/dashboard/services/" + service._id}>Edit</Link>
                                <button className={serviceStyles.serviceButton} onClick={() => { handleDelete(service._id) }}>Delete</button>
                            </div>
                        </li>)
                        )
                    }
                </ul>
                {services.length === 0 ? <p className={serviceStyles.noData}>There isn't any service yet!</p> : ""}
            </div>
        </>
    )
}

export default Services;