interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    required?: boolean;
    error?: string;
    options: { value: string | number; label: string }[];
}

export function FormSelect({ label, required, error, options, className = '', ...props }: FormSelectProps) {
    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <select
                {...props}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${error ? 'border-red-500' : 'border-gray-300'
                    } ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
