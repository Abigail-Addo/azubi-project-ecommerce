import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
    {
        name: 'home',
        href: '/',
    },
    {
        name: 'headphones',
        href: '/headphones',
    },
    {
        name: 'speakers',
        href: '/speakers',
    },
    {
        name: 'earphones',
        href: '/earphones',
    },
];

const Footer = () => {
    const pathname = usePathname();
    return (
        <>
            {/* footer */}
            <footer className='bg-[#101010]'>
                <div className='container mx-auto bg-[#101010] grid grid-cols-1 lg:grid-cols-2 py-12 gap-8'>
                    {/* logo */}
                    <div className='mx-auto md:mx-0'>
                        <Image
                            src='/header/logo.svg'
                            alt='Logo'
                            width={150}
                            height={50}
                            priority
                        />
                    </div>
                    {/* nav links */}
                    <div className='grid grid-cols-1 gap-10 md:flex text-center md:text-start lg:text-end text-white text-sm font-medium'>
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={clsx(
                                    'hover:text-[#D87D4A] uppercase',
                                    {
                                        'text-[#D87D4A]': pathname === link.href,
                                    },
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    {/* text */}
                    <div className='text-white opacity-40 text-center md:text-start px-6 md:px-0'>
                        <p>Audiophile is an all in one stop to fulfill your audio needs. We&#39;re a small team of music lovers and sound specialists who are devoted to helping you get the most out of personal audio. Come and visit our demo facility - we&#39;re open 7 days a week.</p>
                    </div>

                    {/* icons */}
                    <div className='md:hidden lg:flex flex lg:items-end lg:justify-end items-center justify-center gap-4 order-2 lg:order-1'>
                        <Link href="/">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="20"
                                height="20"
                                aria-label="Facebook"
                                role="img"
                                className='fill-white hover:fill-[#D87D4A]'
                            >
                                <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.406.593 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.464.099 2.797.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.31h3.59l-.467 3.622h-3.123V24h6.116C23.406 24 24 23.406 24 22.675V1.325C24 .593 23.406 0 22.675 0z" />
                            </svg>
                        </Link>

                        <Link href="/" >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="20"
                                height="20"
                                aria-label="Twitter"
                                role="img"
                                className='fill-white hover:fill-[#D87D4A]'
                            >
                                <path d="M23.954 4.569a10 10 0 01-2.825.775 4.932 4.932 0 002.163-2.724 9.865 9.865 0 01-3.127 1.195 4.916 4.916 0 00-8.374 4.482A13.94 13.94 0 011.671 3.149a4.916 4.916 0 001.523 6.574 4.897 4.897 0 01-2.224-.616c-.054 2.28 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.212.085 4.918 4.918 0 004.59 3.417 9.867 9.867 0 01-6.102 2.104c-.395 0-.779-.023-1.158-.067a13.945 13.945 0 007.557 2.212c9.054 0 14-7.496 14-13.986 0-.21 0-.423-.015-.633A9.936 9.936 0 0024 4.59z" />
                            </svg>
                        </Link>

                        <Link href="/" >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="20"
                                height="20"
                                aria-label="Instagram"
                                role="img"
                                className='fill-white hover:fill-[#D87D4A]'
                            >
                                <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zm8.25 2.75a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zM12 7a5 5 0 110 10 5 5 0 010-10zm0 1.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" />
                            </svg>
                        </Link>
                    </div>

                    <div className='md:hidden lg:flex text-white opacity-40 lg:text-start text-center order-1 lg:order-2 flex items-center justify-between'>
                        <p>Copyright 2021. All Rights Reserved</p>

                        <Link href="https://github.com/Abigail-Addo/azubi-project-ecommerce.git" target='_blank' className="underline text-white font-bold" >View code on github</Link>

                    </div>

                    <div className='hidden md:flex lg:hidden items-center justify-between'>
                        {/* icons */}
                        <div className='flex lg:items-end lg:justify-end items-center justify-center gap-4 order-2'>
                            <Link href="https://web.facebook.com/">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="20"
                                    height="20"
                                    aria-label="Facebook"
                                    role="img"
                                    className='fill-white hover:fill-[#D87D4A]'
                                >
                                    <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.406.593 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.464.099 2.797.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.31h3.59l-.467 3.622h-3.123V24h6.116C23.406 24 24 23.406 24 22.675V1.325C24 .593 23.406 0 22.675 0z" />
                                </svg>
                            </Link>

                            <Link href="https://x.com/" >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="20"
                                    height="20"
                                    aria-label="Twitter"
                                    role="img"
                                    className='fill-white hover:fill-[#D87D4A]'
                                >
                                    <path d="M23.954 4.569a10 10 0 01-2.825.775 4.932 4.932 0 002.163-2.724 9.865 9.865 0 01-3.127 1.195 4.916 4.916 0 00-8.374 4.482A13.94 13.94 0 011.671 3.149a4.916 4.916 0 001.523 6.574 4.897 4.897 0 01-2.224-.616c-.054 2.28 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.212.085 4.918 4.918 0 004.59 3.417 9.867 9.867 0 01-6.102 2.104c-.395 0-.779-.023-1.158-.067a13.945 13.945 0 007.557 2.212c9.054 0 14-7.496 14-13.986 0-.21 0-.423-.015-.633A9.936 9.936 0 0024 4.59z" />
                                </svg>
                            </Link>

                            <Link href="https://www.instagram.com/" >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="20"
                                    height="20"
                                    aria-label="Instagram"
                                    role="img"
                                    className='fill-white hover:fill-[#D87D4A]'
                                >
                                    <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zm8.25 2.75a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zM12 7a5 5 0 110 10 5 5 0 010-10zm0 1.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" />
                                </svg>
                            </Link>
                        </div>

                        <div className=' text-white opacity-40 lg:text-start text-center order-1 flex items-center justify-between'>
                            <p>Copyright 2021. All Rights Reserved</p>

                            <Link href="https://github.com/Abigail-Addo/azubi-project-ecommerce.git" target='_blank' className="underline text-white font-bold" >View code on github</Link>
                        </div>
                    </div>

                </div>
            </footer>
        </>
    )
}

export default Footer
