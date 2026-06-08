export default function LoadingSpinner() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="inline-flex items-center gap-2" role="status" aria-label="กำลังโหลด">
          <span className="h-3 w-3 animate-bounce rounded-full bg-[#ff7834] [animation-delay:-0.3s] motion-reduce:animate-none" />
          <span className="h-3 w-3 animate-bounce rounded-full bg-[#ff7834] [animation-delay:-0.15s] motion-reduce:animate-none" />
          <span className="h-3 w-3 animate-bounce rounded-full bg-[#ff7834] motion-reduce:animate-none" />
        </span>
      </div>
    </div>
  )
}
