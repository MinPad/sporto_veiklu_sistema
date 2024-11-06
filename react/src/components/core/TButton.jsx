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
        "whitespace-nowarp",
        "text-sm",
        "border",
        "border-2",
        "border-transparent",
        // "rounded",
    ];

    if (link) {
        classes = [
            ...classes,
            "transition-colors",
            "bg-white",
            "hover:bg-gray-100",
            // "border",
            "border-gray-300",
        ];

        switch (color) {
            case "indigo":
                classes = [
                    ...classes,
                    "text-indigo-500",
                    "focus:border-indigo-500",
                ];
                break;
            case "red":
                classes = [...classes, "text-red-500", "focus:border-red-500"];
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
            // case "indigo":
            //     classes = [
            //         ...classes,
            //         "text-indigo-600",
            //         "hover:bg-indigo-700",
            //         "focus:ring-indigo-500",
            //     ];
            //     break;
            case "indigo":
                classes.push(...classes, "bg-indigo-600", "hover:bg-indigo-700");
                break;
            case "red":
                classes = [...classes, "bg-red-600", "hover:bg-red-700", "focus:ring-red-500",];
                break;
            case "green":
                classes.push(...classes, "bg-emerald-500", "hover:bg-emerald-600", "focus:ring-emerald-400");
                // classes = [
                //     ...classes,
                //     "text-emerald-500",
                //     "hover:bg-emerald-600",
                //     "focus:ring-emerald-400",
                // ];
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

// export default function TButton({
//     color = 'indigo',
//     to = '',
//     circle = false,
//     href = '',
//     link = false,
//     target = "_blank",
//     children
// }) {
//     let classes = [
//         "flex",
//         "whitespace-nowrap",
//         "text-sm",
//         "border",
//         "border-2",
//         "border-transparent",
//         "py-2",
//         "px-4",
//         "rounded-md",
//         "transition-colors",
//         "bg-white", // Set a default background color
//         "text-indigo-500", // Set a default text color
//     ];

//     if (link) {
//         switch (color) {
//             case "indigo":
//                 classes.push("hover:bg-indigo-100");
//                 break;
//             case "red":
//                 classes.push("hover:bg-red-100");
//                 break;
//             // Add more colors as needed
//         }
//     } else {
//         classes.push("text-white");
//         switch (color) {
//             case "indigo":
//                 classes.push("bg-indigo-600", "hover:bg-indigo-700");
//                 break;
//             case "red":
//                 classes.push("bg-red-600", "hover:bg-red-700");
//                 break;
//             // Add more colors as needed
//         }
//     }

//     if (circle) {
//         classes.push("h-8", "w-8", "items-center", "justify-center", "rounded-full", "text-sm");
//     }

//     return (
//         <>
//             {href && (<a href={href} className={classes.join(" ")} target={target}>{children}</a>)}
//             {to && (<Link to={to} className={classes.join(" ")}>{children}</Link>)}
//             {!to && !href && (<button className={classes.join(" ")}>{children}</button>)}
//         </>
//     );
// }