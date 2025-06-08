"use client"



import React from 'react'
import Footer from '@/components/footer/Footer'
import Header from '@/components/navigation/Header'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import Category from '@/components/category/Category'
import AudioGear from '@/components/audio gear/AudioGear'
import { getProductsByCategory } from '@/lib/features/product/productSlice'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'

interface Product {
    _id: string;
    id: number;
    slug: string;
    name: string;
    image: {
        mobile: string;
        tablet: string;
        desktop: string;
    };
    category: string;
    categoryImage: {
        mobile: string;
        tablet: string;
        desktop: string;
    };
    new: boolean;
    price: number;
    description: string;
    features: string;
    includes: {
        quantity: number;
        item: string;
    }[];
    gallery: {
        first: {
            mobile: string;
            tablet: string;
            desktop: string;
        };
        second: {
            mobile: string;
            tablet: string;
            desktop: string;
        };
        third: {
            mobile: string;
            tablet: string;
            desktop: string;
        };
    };
    others: {
        slug: string;
        name: string;
        image: {
            mobile: string;
            tablet: string;
            desktop: string;
        };
    }[];
    __v: number;
    createdAt: string;
    updatedAt: string;
};

const Headphones = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { products, loading, error, success } = useAppSelector((state) => state.products) as {
        products: Product[];
        loading: boolean;
        success: boolean;
        error: string | null;
    };
    const params = useParams();
    const category = params?.category;



    React.useEffect(() => {
        if (category) {
            dispatch(getProductsByCategory(category as string));
        }
    }, [dispatch, category]);

    return (
        <>
            <main className='w-screen h-screen overflow-x-hidden'>
                {/* Hero section */}
                <section
                    className="lg:min-h-6/12 min-h-4/12 w-full text-white px-6 py-24 flex bg-[#000000]"
                >
                    {/* header */}
                    <Header bgColor='bg-transparent' showBorder={true} />
                    {/* hero text */}
                    <div className='container mx-auto flex items-center justify-center'>
                        <h1 className="lg:text-5xl text-3xl font-bold uppercase pt-16">{category}</h1>
                    </div>
                </section>

                {/* Loading state */}
                {loading && (
                    <div className="flex justify-center items-center py-40">
                        <Image
                            src="/spinner/orange_circles.gif"
                            className='w-40 h-28 flex mx-auto my-auto'
                            width={40}
                            height={40}
                            alt="Loading..."
                            priority
                        />

                    </div>
                )}

                {/* Error */}
                {!loading && (error) && (
                    <div className="flex justify-center items-center py-40">
                        <p className="text-xl font-semibold text-red-600">
                            {error ? error : "No products found."}
                        </p>
                    </div>
                )}

                {success && products && products.map((product: Product, index: number) => (
                    <section className='py-20 gap-16 grid grid-cols-1' key={product._id} >
                        {/* headphones */}
                        <section className={`container mx-auto flex flex-col lg:flex-row lg:gap-24 items-center justify-center w-full ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
                            {/* Mobile image */}
                            <div className="lg:hidden md:hidden block w-full h-full">
                                <Image
                                    src={product.categoryImage.mobile}
                                    alt={product.name}
                                    width={1000}
                                    height={1000}
                                    className="rounded-lg"
                                    priority
                                />
                            </div>

                            {/* tablet image */}
                            <div className="hidden md:block lg:hidden w-full h-full">
                                <Image
                                    src={product.categoryImage.tablet}
                                    alt={product.name}
                                    width={1000}
                                    height={1000}
                                    className="rounded-lg"
                                    priority
                                />
                            </div>

                            {/* Desktop image */}
                            <div className="hidden lg:block w-full h-full">
                                <Image
                                    src={product.categoryImage.desktop}
                                    alt={product.name}
                                    width={1000}
                                    height={1000}
                                    className='rounded-lg'
                                    priority
                                />
                            </div>

                            {/* Text content */}
                            <div className="w-full h-full py-20 text-black rounded-lg text-center flex items-center justify-center lg:text-start px-6 lg:px-0">
                                <div>
                                    {product.new && (
                                        <p className="uppercase text-md opacity-50 tracking-[10px] mb-4 text-[#D87D4A]">New product</p>
                                    )}

                                    {/* Split product name to put last word on new line */}
                                    {(() => {
                                        const words = product.name.split(' ');
                                        const lastWord = words.pop();
                                        const firstPart = words.join(' ');
                                        return (
                                            <h1 className="text-5xl font-bold uppercase">    {firstPart} <br /> {lastWord}</h1>
                                        );
                                    })()}
                                    <p className="mb-6">{product.description}</p>
                                    <button type='button' className="bg-[#D87D4A] hover:bg-[#FBAF85] focus:bg-[#FBAF85] px-6 py-3 text-white uppercase cursor-pointer"
                                        onClick={() => router.push(`/${category}/details/${product.slug}`)}
                                    >
                                        See Product
                                    </button>
                                </div>
                            </div>
                        </section>
                    </section>
                ))}

                {/* category */}
                <Category />

                <AudioGear />


                <Footer />
            </main>
        </>
    )
}

export default Headphones
