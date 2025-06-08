"use client"

import React from 'react'
import { useRouter, useParams } from 'next/navigation'
import Footer from '@/components/footer/Footer';
import Header from '@/components/navigation/Header';
import Image from 'next/image';
import Category from '@/components/category/Category';
import AudioGear from '@/components/audio gear/AudioGear';
import { getSingleProduct } from '@/lib/features/product/productSlice'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { addToCart, deleteCartItem, updateCartQuantity, getAllCartItems } from '@/lib/features/cart/cartSlice';
import { toast } from "react-toastify";
import { getSessionId } from '@/utils/session';


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

interface CartItem {
    _id: string;
    productId: Product;
    name: string;
    slug: string;
    price: number;
    quantity: number;
    image: {
        mobile: string;
        tablet: string;
        desktop: string;
    };
    createdAt: string;
    updatedAt: string;
    sessionId: string;
}


const HeadPhoneDetails = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const params = useParams();
    const slug = params?.slug;

    const [sessionId, setSessionId] = React.useState<string | null>(null);
    const { product, loading, error } = useAppSelector((state) => state.products) as {
        product: Product | null;
        loading: boolean;
        success: boolean;
        error: string | null;
    };
    const carts = useAppSelector((state) => state.carts.carts) as CartItem[];



    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const id = getSessionId();
            setSessionId(id);
        }
    }, []);

    // console.log(product);


    React.useEffect(() => {
        if (slug) {
            dispatch(getSingleProduct(slug as string));
        }
    }, [dispatch, slug]);


    // Check if the product is in cart for this session
    const cartItem = carts.find(
        item => item.productId._id === product?._id && item.sessionId === sessionId
    );

    const isInCart = !!cartItem;

    // Use cart item quantity if exists or fallback to 1
    const quantity = cartItem?.quantity ?? 0;

    // add item to cart
    const handleAddToCart = () => {
        if (!product || !sessionId) return;

        if (isInCart && cartItem?._id) {
            dispatch(updateCartQuantity({ _id: cartItem._id, quantity: quantity + 1 }));
        } else {
            dispatch(
                addToCart({
                    productId: product._id,
                    sessionId,
                    cartData: {
                        name: product.name,
                        price: product.price,
                        quantity: 1,
                        image: product.image,
                        slug: product.slug,
                    },
                })
            ).then(() => dispatch(getAllCartItems()));
            toast.success("Item added to cart");
        }
    };

    // decrease cart item
    const handleDecrease = () => {
        if (!cartItem?._id) {
            return;
        }

        if (quantity <= 1) {
            dispatch(deleteCartItem(cartItem._id));
            toast.success("cart updated")
        } else {
            dispatch(updateCartQuantity({ _id: cartItem._id, quantity: quantity - 1 }));
            toast.success("cart updated")
        }
    };

    // increase cart item
    const handleIncrease = () => {
        if (!cartItem?._id) {
            // console.error("Cart item _id is missing");
            return;
        }

        dispatch(updateCartQuantity({ _id: cartItem._id, quantity: quantity + 1 }));
        toast.success("cart updated")
    };

    // remove item from cart
    const handleRemoveFromCart = () => {
        if (!cartItem?._id) {
            toast.error("Cart item not found");
            return;
        }

        dispatch(deleteCartItem(cartItem._id)).then(() => {
            dispatch(getAllCartItems());
            toast.info("Item removed from cart");
        });
    };

    return (
        <>
            <main className='w-screen h-screen overflow-x-hidden'>
                {/* hero section */}
                <section
                    className="w-full text-white bg-no-repeat bg-cover bg-center pt-24 pb-8 flex">
                    {/* header */}
                    <Header bgColor='bg-black' showBorder={false} />

                    {/* hero text */}
                    <div className='container mx-auto my-auto flex items-center justify-start'>
                        <button type='button'
                            className=" hover:text-[#D87D4A] focus:text-[#FBAF85] px-6 lg:px-0 py-3 text-[#000000] cursor-pointer"
                            onClick={() => router.back()}
                        >
                            Go back
                        </button>
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

                {/* details */}

                <div key={product?._id}>
                    <section className='container mx-auto grid grid-cols-1 md:grid-cols-2 md:gap-24 items-center justify-center w-full'>
                        {/* Mobile image */}
                        {product?.image.mobile && (
                            <div className="lg:hidden md:hidden block w-full h-full">
                                <Image
                                    src={product.image.mobile}
                                    alt={product.name}
                                    width={1000}
                                    height={1000}
                                    className="rounded-lg"
                                    priority
                                />
                            </div>
                        )}
                        {/* tablet image */}
                        {product?.image.tablet && (
                            <div className="hidden md:block lg:hidden w-full h-full">
                                <Image
                                    src={product.image.tablet}
                                    alt={product.name}
                                    width={1000}
                                    height={1000}
                                    className="rounded-lg"
                                    priority
                                />
                            </div>
                        )}
                        {/* Desktop image */}
                        {product?.image.desktop && (
                            <div className="hidden lg:block w-full h-full">
                                <Image
                                    src={product.image.desktop}
                                    alt={product.name}
                                    width={1000}
                                    height={1000}
                                    className='rounded-lg'
                                    priority
                                />
                            </div>
                        )}
                        {/* Text content */}
                        <div className="w-full h-full py-20 text-black rounded-lg flex items-center justify-center text-start px-6 lg:px-0">
                            <div>
                                {product?.new && (
                                    <p className="uppercase text-md opacity-50 tracking-[10px] mb-4 text-[#D87D4A]">New product</p>
                                )}
                                {/* Split product name to put last word on new line */}
                                {(() => {
                                    if (!product?.name) return null;

                                    const words = product.name.split(' ');
                                    const lastWord = words.pop();
                                    const firstPart = words.join(' ');
                                    return (
                                        <h1 className="text-5xl font-bold uppercase pb-8"> {firstPart} <br /> {lastWord}</h1>
                                    );
                                })()}

                                <p>{product?.description}</p>
                                <p className="py-8 font-semibold">&#36; {product?.price.toLocaleString()}</p>
                                {/* counter */}
                                <div className='flex gap-8'>
                                    <div className="flex items-center justify-between bg-[#F1F1F1] px-4 py-3 w-[140px] text-black font-semibold">
                                        <button
                                            type="button"
                                            disabled={quantity <= 0}
                                            className="text-xl opacity-25 cursor-pointer hover:text-[#D87D4A]"
                                            onClick={handleDecrease}
                                        >
                                            -
                                        </button>
                                        <span>{quantity}</span>
                                        <button
                                            type="button"
                                            disabled={quantity <= 0}
                                            className="text-xl opacity-25 cursor-pointer hover:text-[#D87D4A]"
                                            onClick={handleIncrease}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button type='button' className="bg-[#D87D4A] hover:bg-[#FBAF85] focus:bg-[#FBAF85] px-6 py-3 text-white uppercase cursor-pointer"
                                        onClick={isInCart ? handleRemoveFromCart : handleAddToCart}
                                    >
                                        {isInCart ? 'Remove from cart' : 'Add to cart'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* description */}
                    < section className='container mx-auto md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-12' >
                        {/* features */}
                        <div className='px-6 lg:px-0'>
                            <h1 className='text-2xl font-bold uppercase pb-6'>Features</h1>
                            {product?.features.split('\n\n').map((paragraph, idx) => (
                                <p key={idx} className={idx > 0 ? 'mt-4' : ''}>
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        {/* in the box */}
                        <div className='lg:pl-24 px-6 lg:px-0 grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-col'>
                            <h1 className='text-2xl font-bold uppercase pb-6'>In the box</h1>
                            <div className='flex flex-col'>
                                {product?.includes.map((include, index) => (
                                    <p key={index}>
                                        <span className='text-[#D87D4A] pr-8'>{include.quantity}x</span> {include.item}
                                    </p>
                                ))}
                            </div>
                        </div>

                    </section >

                    {/* gallery */}
                    <section className='container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 py-20' >
                        <div className='grid grid-col-2 gap-12'>
                            {/* Mobile image 1*/}
                            {product?.gallery.first.mobile && (
                                <div className="lg:hidden md:hidden block w-full h-full">
                                    <Image
                                        src={product.gallery.first.mobile}
                                        alt={product.name}
                                        width={1000}
                                        height={1000}
                                        className="rounded-lg"
                                        priority
                                    />
                                </div>
                            )}
                            {/* tablet image 1*/}
                            {product?.gallery.first.tablet && (
                                <div className="hidden md:block lg:hidden w-full h-full">
                                    <Image
                                        src={product.gallery.first.tablet}
                                        alt={product.name}
                                        width={1000}
                                        height={1000}
                                        className="rounded-lg"
                                        priority
                                    />
                                </div>
                            )}
                            {/* Desktop image 1*/}
                            {product?.gallery.first.desktop && (
                                <div className="hidden lg:block w-full h-full">
                                    <Image
                                        src={product.gallery.first.desktop}
                                        alt={product.name}
                                        width={1000}
                                        height={1000}
                                        className='rounded-lg'
                                        priority
                                    />
                                </div>
                            )}
                            {/* Mobile image 2*/}
                            {product?.gallery.second.mobile && (
                                <div className="lg:hidden md:hidden block w-full h-full">
                                    <Image
                                        src={product.gallery.second.mobile}
                                        alt={product.name}
                                        width={1000}
                                        height={1000}
                                        className="rounded-lg"
                                        priority
                                    />
                                </div>
                            )}
                            {/* tablet image 2*/}
                            {product?.gallery.second.tablet && (
                                <div className="hidden md:block lg:hidden w-full h-full">
                                    <Image
                                        src={product.gallery.second.tablet}
                                        alt={product.name}
                                        width={1000}
                                        height={1000}
                                        className="rounded-lg"
                                        priority
                                    />
                                </div>
                            )}
                            {/* Desktop image 2*/}
                            {product?.gallery.second.desktop && (
                                <div className="hidden lg:block w-full h-full">
                                    <Image
                                        src={product.gallery.second.desktop}
                                        alt={product.name}
                                        width={1000}
                                        height={1000}
                                        className='rounded-lg'
                                        priority
                                    />
                                </div>
                            )}
                        </div>
                        <div>
                            {/* Mobile image 3*/}
                            {product?.gallery.third.mobile && (
                                <div className="lg:hidden md:hidden flex w-full h-full">
                                    <Image
                                        src={product.gallery.third.mobile}
                                        alt={product.name}
                                        width={1000}
                                        height={1000}
                                        className="rounded-lg"
                                        priority
                                    />
                                </div>
                            )}
                            {/* tablet image 3*/}
                            {product?.gallery.third.mobile && (
                                <div className="hidden md:flex lg:hidden w-full h-full">
                                    <Image
                                        src={product.gallery.third.tablet}
                                        alt={product.name}
                                        width={1000}
                                        height={1000}
                                        className="rounded-lg"
                                        priority
                                    />
                                </div>
                            )}
                            {/* Desktop image 3*/}
                            {product?.gallery.third.mobile && (
                                <div className="hidden lg:flex w-full h-full">
                                    <Image
                                        src={product.gallery.third.desktop}
                                        alt={product.name}
                                        width={1000}
                                        height={1000}
                                        className='rounded-lg'
                                        priority
                                    />
                                </div>
                            )}
                        </div>
                    </section >

                    {/* others */}
                    <section className='container mx-auto py-16 min-h-1/4' >
                        <h1 className='text-2xl font-bold uppercase pb-6 text-center'>You may also like</h1>
                        <div className='grid md:grid-cols-3 gap-10' >
                            {/* card */}
                            {product?.others.map((item, index) => (
                                < div className='grid grid-cols-1 gap-6' key={index} >
                                    {/* Mobile image */}
                                    <div className="lg:hidden md:hidden flex w-full h-full" >
                                        <Image
                                            src={item.image.mobile}
                                            alt={item.name}
                                            width={1000}
                                            height={1000}
                                            className="rounded-lg"
                                            priority
                                        />
                                    </div>

                                    {/* tablet image */}
                                    <div className="hidden md:block lg:hidden w-full h-full">
                                        <Image
                                            src={item.image.tablet}
                                            alt={item.name}
                                            width={1000}
                                            height={1000}
                                            className="rounded-lg"
                                            priority
                                        />
                                    </div>

                                    {/* Desktop image */}
                                    <div className="hidden lg:block w-full h-full">
                                        <Image
                                            src={item.image.desktop}
                                            alt={item.name}
                                            width={1000}
                                            height={1000}
                                            className='rounded-lg'
                                            priority
                                        />
                                    </div>

                                    <div className='flex flex-col items-center justify-center'>
                                        <h1 className='text-2xl font-bold uppercase pb-6'>{item.name}</h1>
                                        <button type='button' className="bg-[#D87D4A] hover:bg-[#FBAF85] focus:bg-[#FBAF85] px-6 py-3 text-white uppercase cursor-pointer"
                                            onClick={() => {
                                                router.push(`/headphones/details/${item.slug}`);
                                            }}
                                        >
                                            See product
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section >
                </div >
                {/* category */}
                < Category />

                <AudioGear />

                < Footer />
            </main >
        </>
    )
}

export default HeadPhoneDetails
