"use client"

import { useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';
import Link from "next/link";
import Image from "next/image";
import commonStyles from "../page.module.css";
import componentStyles from "./page.module.css";
import { useMenu } from "@/app/context/menuContext";
import { useDashboardMessage } from "../context/messageContext";
import { deleteAction, getsAction } from "./action";

const Services = () => {
    const previewURL = process.env.NEXT_PUBLIC_API_STATIC_ENDPOINT;

    const { changeMenu } = useMenu();
    const { addMessage, cancel } = useDashboardMessage();

    const [services, setServices] = useState([]);

    const fetchServices = async () => {
        const response = await getsAction();
        setServices(response ?? []);
    }

    useEffect(() => {
        fetchServices();
        changeMenu("/dashboard/services");
    }, [])

    const onDeleteService = async (serviceId) => {
        const result = await deleteAction(serviceId);
        if (result !== undefined) {
            addMessage({ text: "Service Successfully Deleted", cancel: cancel });
            await fetchServices();
        } else {
            addMessage({ text: "Operation Failed!", cancel: cancel });
        }
    }

    return (
        <>
            <title>Fakharnia CMS | Services</title>
            <div className={commonStyles.pageContainer}>
                <div className={commonStyles.pageHeader}>
                    <h5 className={commonStyles.pageTitle}>Services</h5>
                    <Link className={commonStyles.pageAddButton} href="./services/0">Add</Link>
                </div>
                <ul className={componentStyles.servicesList}>
                    {
                        services.map((service, index) =>
                        (<li key={index} className={componentStyles.service}>
                            <Image className={componentStyles.serviceImage} src={`${previewURL}/service/${service.coverUrl}`} width={500} height={190} alt={service.coverAlt} />
                            <h5 className={componentStyles.serviceTitle}>{service.en_title}</h5>
                            <div className={componentStyles.serviceOptions}>
                                <Link className={componentStyles.serviceButton} href={"/dashboard/services/" + service._id}>Edit</Link>
                                <button className={componentStyles.serviceButton} onClick={() => { onDeleteService(service._id) }}>Delete</button>
                            </div>
                        </li>)
                        )
                    }
                </ul>
                {services.length === 0 ? <p className={componentStyles.noData}>There isn't any service yet!</p> : ""}
            </div>
        </>
    )
}

export default Services;