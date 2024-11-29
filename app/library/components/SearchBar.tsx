// app/library/components/SearchBar.tsx
export default function SearchBar({ 
    value, 
    onChange 
  }: { 
    value: string; 
    onChange: (value: string) => void; 
  }) {
    return (
      <div className="max-w-xl mx-auto mb-8">
        <input
          type="text"
          placeholder="ค้นหานิทาน..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-6 py-4 text-lg rounded-full border-2 border-pink-200 focus:border-pink-400 focus:outline-none"
        />
      </div>
    );
  }