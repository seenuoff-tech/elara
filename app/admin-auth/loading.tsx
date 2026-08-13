export default function AdminLoading() {
  return (
    <div className="w-full h-[80vh] flex flex-col items-center justify-center">
      <div className="relative flex justify-center items-center">
        <div className="absolute animate-ping inline-flex h-16 w-16 rounded-full bg-[#0B5E64] opacity-20"></div>
        <div className="relative inline-flex rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#0B5E64] animate-spin"></div>
      </div>
      <p className="mt-6 text-[#0B5E64] font-medium tracking-widest text-sm animate-pulse uppercase">
        Loading Data...
      </p>
    </div>
  );
}
