import React from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const category = {
    headphones: 'headphones',
    earphones: 'earphones',
    speakers: 'speakers',
};

const Category = () => {
    const pathname = usePathname();



    return (
        <>
            {/* category */}
            <section className="container mx-auto flex items-center justify-center md:py-28 py-20">
                <div className='container mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-10'>
                    {/* headphone */}
                    <div className="bg-[#F1F1F1] rounded-lg pt-20 pb-6 relative flex flex-col items-center text-center">
                        <div className="absolute -top-16 md:-top-30 lg:-top-18 w-full flex justify-center">
                            {/* Mobile image */}
                            <Image
                                src="/home/category/mobile/headphone.png"
                                alt="Headphones"
                                width={150}
                                height={150}
                                className="flex md:hidden"
                                priority
                            />
                            {/* Tablet image */}
                            <Image
                                src="/home/category/tablet/headphone.png"
                                alt="Headphones"
                                width={150}
                                height={150}
                                className="hidden md:flex lg:hidden"
                                priority
                            />
                            {/* Desktop image */}
                            <Image
                                src="/home/category/desktop/headphone.png"
                                alt="Headphones"
                                width={150}
                                height={150}
                                className="hidden lg:flex"
                                priority
                            />
                        </div>

                        {/* Text content */}
                        <h3 className="text-lg font-semibold uppercase mt-4">Headphones</h3>
                        <Link
                            href={`/${category.headphones}`}
                            className={clsx(
                                'hover:text-[#D87D4A] uppercase flex items-center justify-center gap-2 mt-2 text-sm font-medium',
                                { 'text-[#D87D4A]': pathname === '/headphones' }
                            )}
                        >
                            <p>Shop</p>
                            <Image
                                src="/home/category/icon-arrow-right.svg"
                                alt="Arrow Right"
                                width={8}
                                height={8}
                                priority
                            />
                        </Link>
                    </div>

                    {/* speaker */}
                    <div className="bg-[#F1F1F1] rounded-lg pt-20 pb-6 relative flex flex-col items-center text-center">
                        <div className="absolute -top-16 md:-top-30 lg:-top-18 w-full flex justify-center">
                            {/* Mobile image */}
                            <Image
                                src="/home/category/mobile/speaker.png"
                                alt="speaker"
                                width={150}
                                height={150}
                                className="flex md:hidden"
                                priority
                            />
                            {/* Tablet image */}
                            <Image
                                src="/home/category/tablet/speaker.png"
                                alt="speaker"
                                width={150}
                                height={150}
                                className="hidden md:flex lg:hidden"
                                priority
                            />
                            {/* Desktop image */}
                            <Image
                                src="/home/category/desktop/speaker.png"
                                alt="speaker"
                                width={150}
                                height={150}
                                className="hidden lg:flex"
                                priority
                            />
                        </div>

                        {/* Text content */}
                        <h3 className="text-lg font-semibold uppercase mt-4">Speakers</h3>
                        <Link
                            href={`/${category.speakers}`}
                            className={clsx(
                                'hover:text-[#D87D4A] uppercase flex items-center justify-center gap-2 mt-2 text-sm font-medium',
                                { 'text-[#D87D4A]': pathname === '/speakers' }
                            )}
                        >
                            <p>Shop</p>
                            <Image
                                src="/home/category/icon-arrow-right.svg"
                                alt="Arrow Right"
                                width={8}
                                height={8}
                                priority
                            />
                        </Link>
                    </div>

                    {/* earphone */}
                    <div className="bg-[#F1F1F1] rounded-lg pt-20 pb-6 relative flex flex-col items-center text-center">
                        <div className="absolute -top-16 md:-top-30 lg:-top-18 w-full flex justify-center">
                            {/* Mobile image */}
                            <Image
                                src="/home/category/mobile/earphone.png"
                                alt="earphone"
                                width={150}
                                height={150}
                                className="flex md:hidden"
                                priority
                            />
                            {/* Tablet image */}
                            <Image
                                src="/home/category/tablet/earphone.png"
                                alt="earphone"
                                width={150}
                                height={150}
                                className="hidden md:flex lg:hidden"
                                priority
                            />
                            {/* Desktop image */}
                            <Image
                                src="/home/category/desktop/earphone.png"
                                alt="earphone"
                                width={150}
                                height={150}
                                className="hidden lg:block"
                                priority
                            />
                        </div>

                        {/* Text content */}
                        <h3 className="text-lg font-semibold uppercase mt-4">Earphones</h3>
                        <Link
                            href={`/${category.earphones}`}
                            className={clsx(
                                'hover:text-[#D87D4A] uppercase flex items-center justify-center gap-2 mt-2 text-sm font-medium',
                                { 'text-[#D87D4A]': pathname === '/earphones' }
                            )}
                        >
                            <p>Shop</p>
                            <Image
                                src="/home/category/icon-arrow-right.svg"
                                alt="Arrow Right"
                                width={8}
                                height={8}
                                priority
                            />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Category
