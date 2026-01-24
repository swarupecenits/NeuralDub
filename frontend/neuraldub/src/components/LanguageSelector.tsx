import React from 'react';
import { Globe } from 'lucide-react';
interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}
const languages: LanguageOption[] = [
{
  code: 'en',
  name: 'English',
  flag: '🇺🇸'
},
{
  code: 'es',
  name: 'Spanish',
  flag: '🇪🇸'
},
{
  code: 'fr',
  name: 'French',
  flag: '🇫🇷'
},
{
  code: 'de',
  name: 'German',
  flag: '🇩🇪'
},
{
  code: 'zh',
  name: 'Chinese',
  flag: '🇨🇳'
},
{
  code: 'ja',
  name: 'Japanese',
  flag: '🇯🇵'
},
{
  code: 'ar',
  name: 'Arabic',
  flag: '🇸🇦'
}];

interface LanguageSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}
export function LanguageSelector({
  label,
  value,
  onChange
}: LanguageSelectorProps) {
  return (
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
        <Globe className="w-4 h-4" />
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#0A1628] border border-white/10 rounded-lg py-3 px-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent cursor-pointer hover:border-cyan-500/30 transition-colors">

          {languages.map((lang) =>
          <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          )}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7" />

          </svg>
        </div>
      </div>
    </div>
  );
}

export default LanguageSelector;