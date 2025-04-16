// components/Furnishing.tsx
import Image from 'next/image'

const Furnishing = () => {
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">Furnishing</h2>
            <div className="grid grid-cols-3 gap-6">
                {/* Left side 2x2 cards */}
                <div className="grid grid-cols-2 grid-rows-2 gap-6 col-span-2">
                    {[
                        '/images/furniture.jpg',
                        '/images/furniture.jpg',
                        '/images/furniture.jpg',
                        '/images/furniture.jpg',
                    ].map((src, idx) => (
                        <div key={idx} className="relative bg-white/5 rounded-xl overflow-hidden group">
                            <Image
                                src={src}
                                alt={`Furnishing ${idx + 1}`}
                                width={500}
                                height={500}
                                className="object-cover w-full h-full"
                            />
                            <div className="absolute top-2 right-2 bg-white/20 rounded-full p-1 group-hover:scale-105 transition">
                                <span className="text-white text-xl">↗</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right side big card */}
                <div className="relative  rounded-3xl overflow-hidden group h-full">
                    <Image
                        src="/images/furniture.jpg"
                        alt="Furniture Feature"
                        width={1000}
                        height={1000}
                        className="object-cover w-full h-full"
                    />
                    <div className="absolute bottom-6 left-6 bg-white/20 text-white text-xl px-6 py-3 rounded-full backdrop-blur-sm flex items-center justify-between w-[220px]">
                        Furniture
                        <span className="ml-2 text-white">↗</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Furnishing
