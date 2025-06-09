'use client'

import React from 'react'
import Header from '@/components/navigation/Header'
import Image from 'next/image'
import Footer from '@/components/footer/Footer'
import Category from '@/components/category/Category'
import AudioGear from '@/components/audio gear/AudioGear'
import { useRouter } from 'next/navigation'
import { getAllProducts } from '@/lib/features/product/productSlice'
import { useAppDispatch } from '@/lib/hooks'


const Home = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // fetch all products
  React.useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);


  return (
    <>
      <main className='w-screen h-screen overflow-x-hidden'>
        {/* Hero section with responsive background images */}
        <section
          className="min-h-6/12 lg:min-h-11/12 w-full text-white bg-no-repeat bg-cover bg-center px-6 py-24 
            bg-[url('/home/hero/mobile.jpg')]
             md:bg-[url('/home/hero/tablet.jpg')]
             lg:bg-[url('/home/hero/desktop.jpg')]
             flex"
        >

          {/* header */}
          <Header bgColor='bg-transparent' showBorder={true} />

          {/* hero text */}
          <div className='container mx-auto my-auto flex items-center lg:justify-start justify-center'>
            <div className="max-w-lg text-center lg:text-start">
              <p className="uppercase text-md opacity-40 tracking-[10px] text-gray-300 mb-4 ">New product</p>
              <h1 className="text-5xl font-bold uppercase">XX99 Mark II <br /> Headphones</h1>
              <p className="mb-6">Experience natural, lifelike audio and exceptional build quality made for the passionate music enthusiast.</p>
              <button type='button' className="bg-[#D87D4A] hover:bg-[#FBAF85] focus:bg-[#FBAF85] px-6 py-3 text-white uppercase cursor-pointer"
                onClick={() => router.push("/headphones/details/xx99-mark-two-headphones")}
              >
                See Product
              </button>
            </div>
          </div>
        </section>

        {/* category */}
        <Category />

        {/* speaker detail 1*/}
        <section className="container rounded-lg mx-auto py-12 lg:pt-20 lg:py-0  bg-[#D87D4A] bg-[url('/home/details/pattern-circles.svg')] bg-no-repeat bg-fill bg-center lg:bg-left overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Mobile image */}
          <div className="lg:hidden flex items-center justify-center">
            <Image
              src="/home/details/speaker1/mobile.png"
              alt="Speaker"
              width={200}
              height={200}
              className="md:hidden"
              priority
            />
          </div>

          {/* tablet image */}
          <div className="hidden md:flex items-center justify-center lg:hidden ">
            <Image
              src="/home/details/speaker1/tablet.png"
              alt="Speaker"
              width={250}
              height={250}
              className="hidden md:flex lg:hidden"
              priority
            />
          </div>

          {/* Desktop image */}
          <div className="hidden lg:flex z-10 justify-end">
            <Image
              src="/home/details/speaker1/desktop.png"
              alt="Speaker"
              width={400}
              height={400}
              className='translate-y-5'
              priority
            />
          </div>

          {/* Text content */}
          <div className="max-w-sm mx-auto text-center lg:text-start text-white lg:translate-y-12 px-6 lg:px-0">
            <h1 className="text-5xl font-bold uppercase leading-tight">ZX9<br />Speaker</h1>
            <p className="mt-6 mb-6 opacity-90">
              Experience natural, lifelike audio and exceptional build quality made for the passionate music enthusiast.
            </p>
            <button className="bg-black hover:bg-[#4C4C4C] px-6 py-3 text-white uppercase cursor-pointer"
              onClick={() => router.push("/speakers/details/zx9-speaker")}>
              See Product
            </button>
          </div>
        </section>

        {/* speaker detail 2*/}
        <section className="container mx-auto my-8 min-h-6/12 md:min-h-3/12 rounded-lg lg:min-h-6/12 w-full text-white bg-no-repeat bg-cover bg-right
            bg-[url('/home/details/speaker2/mobile.jpg')]
             md:bg-[url('/home/details/speaker2/tablet.jpg')]
             lg:bg-[url('/home/details/speaker2/desktop.jpg')]
             flex">
          {/* Text content */}
          <div className="max-w-sm lg:text-start my-auto text-black lg:pl-32 md:pl-16 pl-6">
            <h1 className="text-4xl font-semibold uppercase leading-tight mb-6">ZX7 Speaker</h1>
            <button className="bg-white hover:bg-[#000000] hover:text-[#ffffff] px-6 py-3 text-black uppercase cursor-pointer"
              onClick={() => router.push("/speakers/details/zx7-speaker")}>
              See Product
            </button>
          </div>
        </section>

        {/* earphone details */}
        <section className='container mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center justify-center w-full'>
          {/* Mobile image */}
          <div className="lg:hidden md:hidden flex w-full h-full ">
            <Image
              src="/home/details/earphones/mobile.jpg"
              alt="Speaker"
              width={1000}
              height={1000}
              className="rounded-lg"
              priority
            />
          </div>

          {/* tablet image */}
          <div className="hidden md:flex lg:hidden w-full h-full">
            <Image
              src="/home/details/earphones/tablet.jpg"
              alt="Speaker"
              width={1000}
              height={1000}
              className="rounded-lg"
              priority
            />
          </div>

          {/* Desktop image */}
          <div className="hidden lg:flex w-full h-full">
            <Image
              src="/home/details/earphones/desktop.jpg"
              alt="Speaker"
              width={1000}
              height={1000}
              className='rounded-lg'
              priority
            />
          </div>

          {/* Text content */}
          <div className="w-full h-full py-20 text-black bg-[#F1F1F1] rounded-lg flex items-center justify-center">
            <div>
              <h1 className="text-4xl font-semibold uppercase leading-tight mb-6">YX1 EARPHONES</h1>
              <button className="bg-white hover:bg-[#000000] hover:text-[#ffffff] px-6 py-3 text-black uppercase cursor-pointer"
                onClick={() => router.push("/earphones/details/yx1-earphones")}>
                See Product
              </button>
            </div>
          </div>
        </section>

        <AudioGear />

        <Footer />


      </main>
    </>
  )
}

export default Home
