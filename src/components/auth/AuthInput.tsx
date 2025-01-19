interface AuthInputProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}

export default function AuthInput({
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
}: AuthInputProps) {
  return (
    <div>
      <label className="block text-gray-300 mb-2">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-200 placeholder-gray-500"
        required={required}
      />
    </div>
  );
}
