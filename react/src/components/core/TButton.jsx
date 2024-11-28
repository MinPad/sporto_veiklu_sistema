import React from 'react';
import { Link } from "react-router-dom";

export default function TButton({
    color = 'indigo',
    to = '',
    circle = false,
    href = '',
    link = false,
    target = "_blank",
    onClick = () => { },
    children
}) {
    let classes = [
        "flex",
        "whitespace-nowrap",
        "text-sm",
        "border",
        "border-2",
        "border-transparent",
        "transition-all", // Add transition for smooth hover effect
    ];

    if (link) {
        classes = [
            ...classes,
            "transition-colors",
            "bg-white",
            "hover:bg-gray-100",
            "border-gray-300",
        ];

        switch (color) {
            case "indigo":
                classes = [
                    ...classes,
                    "text-indigo-500",
                    "hover:border-indigo-500",
                    "focus:border-indigo-500",
                ];
                break;
            case "red":
                classes = [
                    ...classes,
                    "text-red-500",
                    "hover:border-red-500", // Add hover border color
                    "focus:border-red-500",
                ];
                break;
        }
    }
    else {
        classes = [
            ...classes,
            "text-white",
            "focus:ring-2",
            "focus:ring-offset-2",
        ];

        switch (color) {
            case "indigo":
                classes.push(...classes, "bg-indigo-600", "hover:bg-indigo-700");
                break;
            case "red":
                classes = [
                    ...classes,
                    "bg-red-600",
                    "hover:bg-red-700",
                    "focus:ring-red-500",
                ];
                break;
            case "green":
                classes.push(
                    ...classes,
                    "bg-emerald-500",
                    "hover:bg-emerald-600",
                    "focus:ring-emerald-400"
                );
                break;
        }
    }

    if (circle) {
        classes = [
            ...classes,
            "h-8",
            "w-8",
            "items-center",
            "justify-center",
            "rounded-full",
            "text-sm",
            "hover:border-2", // Ensure border width is consistent on hover
            "hover:border-red-500", // Add red border on hover
        ];
    }
    else {
        classes = [
            ...classes,
            "p-0",
            "py-2",
            "px-4",
            "rounded-md"
        ];
    }

    return (
        <>
            {href && (<a href={href} className={classes.join(" ")} target={target}>{children}</a>)}
            {to && (<Link to={to} className={classes.join(" ")}>{children}</Link>)}
            {!to && !href && (<button onClick={onClick} className={classes.join(" ")}>{children}</button>)}
        </>
    )
}
