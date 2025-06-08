import * as React from 'react';
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { IoMdClose } from "react-icons/io";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import { Backdrop } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { getAllCartItems, updateCartQuantity, deleteCartItem, deleteAllCartItems } from '@/lib/features/cart/cartSlice';
import { toast } from 'react-toastify';

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

const category = {
    headphones: 'headphones',
    earphones: 'earphones',
    speakers: 'speakers',
};

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

interface Cart {
    _id: string;
    sessionId: string;
    productId: Product;
    name: string;
    slug: string;
    price: number;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    image: {
        mobile: string;
        tablet: string;
        desktop: string;
    };
};

interface HeaderProps {
    bgColor?: string;
    showBorder?: boolean;
}


const Header: React.FC<HeaderProps> = ({ bgColor = 'transparent', showBorder = true }) => {
    const [open, setOpen] = React.useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { carts, } = useAppSelector((state) => state.carts) as {
        carts: Cart[];
        loading: boolean;
        success: boolean;
        error: string | null;
    };
    const dispatch = useAppDispatch();
    const [updatingCartId, setUpdatingCartId] = React.useState<string | null>(null);

    // backdrop states
    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const handleClose = () => {
        setOpenBackdrop(false);
    };
    const handleOpen = () => {
        setOpenBackdrop(true);
    };

    // toggle the drawer
    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    // fetch all cart items
    React.useEffect(() => {
        dispatch(getAllCartItems());
    }, [dispatch]);

    // decrease cart item
    const handleDecrease = async (_id: string, quantity: number) => {
        setUpdatingCartId(_id);
        if (quantity <= 1) {
            await dispatch(deleteCartItem(_id));
            toast.success("cart updated")
            setOpenBackdrop(true);
        } else {
            await dispatch(updateCartQuantity({ _id, quantity: quantity - 1 }));
            toast.success("cart updated")
            setOpenBackdrop(true);
        }
        setUpdatingCartId(null);
    };

    // increase cart item
    const handleIncrease = async (_id: string, quantity: number) => {
        setUpdatingCartId(_id);
        await dispatch(updateCartQuantity({ _id, quantity: quantity + 1 }));
        toast.success("cart updated")
        setOpenBackdrop(true);
        setUpdatingCartId(null);
    };

    // calculate total price
    const totalPrice = carts?.reduce((total, cart) => {
        return total + cart.price * cart.quantity;
    }, 0);

    // delete all items from cart
    const handleRemoveAll = () => {
        dispatch(deleteAllCartItems());
        toast.success("items deleted")
    };

    // mobile and tablet drawer
    const DrawerList = (
        <Box
            sx={{
                width: "100%",
                padding: '1rem',
            }}
            role="presentation"
            onClick={toggleDrawer(false)}
        >

            <List className='flex justify-end'>
                <IoMdClose />
            </List>
            <List className='grid grid-cols-1 gap-8 uppercase'>
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
            </List>
        </Box>
    );

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-10 backdrop-blur-3xl ${bgColor}`}>
                <div className={clsx(
                    'container mx-auto flex justify-between items-center py-7 px-4 lg:px-0',
                    {
                        'border-b border-gray-400': showBorder,
                    }
                )}>
                    {/* logo */}
                    <div className='flex items-center justify-center gap-6'>

                        <Image
                            src='/header/icon-hamburger.svg'
                            alt='Logo'
                            width={15}
                            height={15}
                            priority
                            onClick={toggleDrawer(true)}
                            className='lg:hidden'
                        />

                        <Image
                            src='/header/logo.svg'
                            alt='Logo'
                            width={150}
                            height={50}
                            priority
                        />
                    </div>

                    {/* nav links */}
                    <nav className='hidden lg:flex gap-16 text-white text-sm font-medium'>
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
                    </nav>

                    <button type='button' className='cursor-pointer' onClick={handleOpen}>
                        <Image
                            src='/header/icon-cart.svg'
                            alt='Logo'
                            width={20}
                            height={20}
                            priority
                        />
                    </button>
                </div>
            </header>

            {/* mobile and tablet drawer */}
            <Drawer
                open={open}
                onClose={toggleDrawer(false)}
                className='lg:hidden'
                anchor="top"
            >
                {DrawerList}
            </Drawer>

            {/* cart modal */}
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openBackdrop}
                onClick={handleClose}
                className=''
            >
                <section
                    className="container mx-auto absolute top-20 right-0 md:right-10 bg-white w-[377px] rounded-lg shadow-lg z-50 p-6 text-black h-2/4 flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-lg font-bold uppercase tracking-wider">Cart ({carts.length})</h1>
                        {carts.length > 0 && (
                            <button
                                className="text-sm underline opacity-50 hover:text-[#D87D4A] transition cursor-pointer"
                                onClick={handleRemoveAll}
                            >
                                Remove all
                            </button>
                        )}
                    </div>

                    {/* Cart Items */}
                    {carts.length > 0 ? (
                        <>
                            {/* Scrollable Items */}
                            <div className="space-y-6 overflow-y-auto flex-grow pr-2">
                                {carts.map((cart: Cart) => (
                                    <div className="flex justify-between items-center" key={cart._id}>
                                        <div className="flex items-center gap-4">
                                            <Image
                                                src={cart.image.mobile}
                                                alt={cart.name}
                                                width={64}
                                                height={64}
                                                className="rounded-lg object-cover"
                                            />
                                            <div>
                                                <p className="text-sm font-bold">{cart.name}</p>
                                                <p className="text-sm opacity-50">&#36; {(cart.price * cart.quantity).toLocaleString()}</p>
                                            </div>
                                        </div>

                                        {/* Quantity Controls */}
                                        {updatingCartId === cart._id ? (
                                            <Image
                                                src="/spinner/orange_circles.gif"
                                                alt="Updating..."
                                                width={24}
                                                height={24}
                                                className="w-6 h-6"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-between bg-[#F1F1F1] px-3 py-1 w-[96px]">
                                                <button
                                                    className="text-sm text-black opacity-25 cursor-pointer hover:text-[#D87D4A]"
                                                    onClick={() => handleDecrease(cart._id, cart.quantity)}
                                                >
                                                    -
                                                </button>
                                                <span className="text-sm font-semibold">{cart.quantity}</span>
                                                <button
                                                    className="text-sm text-black opacity-25 cursor-pointer hover:text-[#D87D4A]"
                                                    onClick={() => handleIncrease(cart._id, cart.quantity)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Fixed Total & Checkout */}
                            <div className="mt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <p className="uppercase text-sm opacity-50">Total</p>
                                    <p className="text-lg font-bold">&#36; {totalPrice.toLocaleString()}</p>
                                </div>
                                <button
                                    className="w-full cursor-pointer bg-[#D87D4A] hover:bg-[#FBAF85] text-white text-sm uppercase py-3 tracking-wider"
                                    onClick={() => router.push('/checkout')}
                                >
                                    Checkout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col justify-center items-center flex-grow">
                            <p className="text-xl font-semibold text-black opacity-50">No items in cart.</p>
                        </div>
                    )}
                </section>

            </Backdrop>


        </>
    )
}

export default Header
