'use client'

import { Input } from "@/components/ui/input"

interface InputTextProps {
  holder: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputText({
  holder,
  type = "text",
  value = "", // 👈 valor padrão evita undefined
  onChange
}: InputTextProps) {
  return (
    <div>
      <Input
        placeholder={holder}
        type={type}
        value={value}
        onChange={onChange}
        className="w-96 h-14 m-8 rounded-md border border-[#5E5E5E] bg-[#5E5E5E] text-white placeholder-gray-300 focus:ring-2 focus:ring-[#0E4194] focus:outline-none"
      />
    </div>
  );
}
