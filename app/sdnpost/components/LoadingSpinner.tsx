// app/sdnpost/components/LoadingSpinner.tsx
export default function LoadingSpinner() {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex justify-center items-center min-h-[60vh]">
          <span className="loading loading-dots loading-lg text-orange-500"></span>
        </div>
      </div>
    )
  }