import React from 'react'
import Image from 'next/image'


const AudioGear = () => {
    return (
        <>
            {/* audio gear */}
            <section className='container py-20 mx-auto grid grid-cols-1 lg:grid-cols-2 lg:gap-10 items-center justify-center w-full'>
                {/* Mobile image */}
                <div className="lg:hidden md:hidden flex w-full h-full order-1 lg:order-2">
                    <Image
                        src="/home/audiogear/mobile.jpg"
                        alt="Speaker"
                        width={1000}
                        height={1000}
                        className="rounded-lg"
                        priority
                    />
                </div>

                {/* tablet image */}
                <div className="hidden md:block lg:hidden w-full h-full order-1 lg:order-2">
                    <Image
                        src="/home/audiogear/tablet.jpg"
                        alt="Speaker"
                        width={1000}
                        height={1000}
                        className="rounded-lg"
                        priority
                    />
                </div>

                {/* Desktop image */}
                <div className="hidden lg:flex w-full h-full order-1 lg:order-2">
                    <Image
                        src="/home/audiogear/desktop.jpg"
                        alt="Speaker"
                        width={1000}
                        height={1000}
                        className='rounded-lg'
                        priority
                    />
                </div>

                {/* Text content */}
                <div className="w-full h-full py-20 text-black rounded-lg flex items-center justify-center order-2 lg:order-1 text-center lg:text-start px-6 lg:px-0">
                    <div>
                        <h1 className="text-4xl font-semibold uppercase leading-tight mb-6">Bringing you the <br /> <span className='text-[#D87D4A]'>best</span> audio gear</h1>
                        <p>Located at the heart of New York City, Audiophile is the premier store for high end headphones, earphones, speakers, and audio accessories. We have a large showroom and luxury demonstration rooms available for you to browse and experience a wide range of our products. Stop by our store to meet some of the fantastic people who make Audiophile the best place to buy your portable audio equipment.</p>
                    </div>
                </div>

            </section>
        </>
    )
}

export default AudioGear