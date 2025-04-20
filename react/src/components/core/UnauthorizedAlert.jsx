import { XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

export default function UnauthorizedAlert({
    message,
    actionLink,
    actionLabel,
    onClose,
    type = "warning"
}) {
    const colors = {
        warning: {
            bg: "bg-yellow-100",
            border: "border-yellow-400",
            text: "text-yellow-800"
        },
        error: {
            bg: "bg-red-100",
            border: "border-red-400",
            text: "text-red-800"
        },
        info: {
            bg: "bg-blue-100",
            border: "border-blue-400",
            text: "text-blue-800"
        }
    };

    const color = colors[type] || colors.warning;

    return (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-xl px-4`}>
            <div className={`flex justify-between items-center px-4 py-2 rounded-md shadow-md border ${color.bg} ${color.border} ${color.text}`}>
                <div className="flex items-center gap-2 flex-wrap text-sm">
                    <span className="text-base">🔒</span>
                    <p>{message}</p>
                    {actionLink && (
                        <Link
                            to={actionLink}
                            className="underline font-semibold hover:opacity-80"
                        >
                            {actionLabel}
                        </Link>
                    )}
                </div>
                {onClose && (
                    <button onClick={onClose} className="text-sm ml-2">
                        <XMarkIcon className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
