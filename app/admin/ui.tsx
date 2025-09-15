// app/admin/ui.tsx
import React from "react";

export function SectionCard({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-gray-200 shadow-sm p-5 bg-white">
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            {children}
        </div>
    );
}

export function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <label className="block mb-3">
            <div className="text-sm font-medium text-gray-700 mb-1">{label}</div>
            {children}
        </label>
    );
}

export function Button({
    children,
    className = "",
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium shadow-sm transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed bg-black text-white ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

export function TextInput(
    props: React.InputHTMLAttributes<HTMLInputElement>
) {
    return (
        <input
            {...props}
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/30 ${props.className || ""
                }`}
        />
    );
}

export function TextArea(
    props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
    return (
        <textarea
            {...props}
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/30 ${props.className || ""
                }`}
        />
    );
}
