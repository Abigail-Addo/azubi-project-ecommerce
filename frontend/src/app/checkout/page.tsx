'use client'




import Header from '@/components/navigation/Header'
import * as React from 'react';
import { useRouter } from 'next/navigation'
import { Divider, Fade, Radio, TextField } from '@mui/material'
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import Footer from '@/components/footer/Footer'
import FormControlLabel, {
    FormControlLabelProps,
} from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';
import RadioGroup, { useRadioGroup } from '@mui/material/RadioGroup';
import Image from 'next/image'
import Modal from '@mui/material/Modal';
import { getAllCartItems } from '@/lib/features/cart/cartSlice';
import { createCheckout } from "@/lib/features/checkout/checkoutSlice";
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { toast } from 'react-toastify';
import emailjs from "@emailjs/browser";
import html2canvas from 'html2canvas';
import { getSessionId } from '@/utils/session';

interface StyledFormControlLabelProps extends FormControlLabelProps {
    checked: boolean;
}

interface IFormInput {
    _id: string | number;
    name: string;
    email: string;
    contact: string;
    address: string;
    city: string;
    zip: string;
    country: string;
    paymentMethod: PaymentMethod;
    eMoneyNum: string;
    eMoneyPin: string;
}

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

type PaymentMethod = "eMoney" | "cash";



const StyledFormControlLabel = styled((props: StyledFormControlLabelProps) => (
    <FormControlLabel {...props} />
))(({ theme }) => ({
    variants: [
        {
            props: { checked: true },
            style: {
                '.MuiFormControlLabel-label': {
                    color: theme.palette.primary.main,
                },
            },
        },
    ],
}));

function MyFormControlLabel(props: FormControlLabelProps) {
    const radioGroup = useRadioGroup();

    let checked = false;

    if (radioGroup) {
        checked = radioGroup.value === props.value;
    }

    return <StyledFormControlLabel checked={checked} {...props} />;
}


const Checkout = () => {
    // const { checkout } = useAppSelector((state) => state.checkout)

    const { carts } = useAppSelector((state) => state.carts) as {
        carts: Cart[];
        loading: boolean;
        success: boolean;
        error: string | null;
    };
    const dispatch = useAppDispatch();

    const router = useRouter();
    const { control, handleSubmit, formState: { errors }, reset, watch } = useForm<IFormInput>({
        defaultValues: {
            _id: '',
            name: '',
            email: '',
            contact: '',
            address: '',
            city: '',
            zip: '',
            country: '',
            paymentMethod: "eMoney",
            eMoneyNum: '',
            eMoneyPin: '',
        },
    });
    const selectedPaymentMethod = watch("paymentMethod");
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [confirmedCart, setConfirmedCart] = React.useState<typeof carts>([]);
    const formRef = React.useRef<HTMLFormElement | null>(null);


    React.useEffect(() => {
        setOpen(false);
        setConfirmedCart([]);
    }, []);

    // function to checkout
    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            const userSessionId = getSessionId();

            if (!userSessionId) {
                toast.error("Cannot submit without a valid session ID");
                return;
            }

            const payload = {
                sessionId: userSessionId,
                customer: {
                    name: data.name,
                    email: data.email,
                    phone: data.contact,
                    address: data.address,
                    city: data.city,
                    zip: data.zip,
                    country: data.country,
                },
                payment: {
                    method: data.paymentMethod,
                    eMoneyNumber: data.eMoneyNum,
                    eMoneyPin: data.eMoneyPin,
                },
                items: carts.map(cart => ({
                    productId: cart._id,
                    name: cart.name,
                    slug: cart.slug,
                    price: cart.price,
                    quantity: cart.quantity,
                    image: cart.image,
                })),
                totals: {
                    total: totalPrice,
                    vat: vatAmount,
                    shipping: shippingFee,
                    grandTotal: grandTotal,
                },
            };

            const result = await dispatch(createCheckout(payload));

            if (createCheckout.fulfilled.match(result)) {
                setConfirmedCart(carts);
                handleOpen();

                const form = formRef.current;
                if (!form) return;

                // Clear previous hidden inputs (optional)
                Array.from(form.querySelectorAll("input[type=hidden]")).forEach(el => el.remove());

                // A. Basic customer details
                const formFields = {
                    name: data.name,
                    email: data.email,
                    contact: data.contact,
                    address: data.address,
                    city: data.city,
                    zip: data.zip,
                    country: data.country,
                    payment_method: data.paymentMethod,
                    emoney_number: data.eMoneyNum,
                    emoney_pin: data.eMoneyPin,
                };

                Object.entries(formFields).forEach(([key, value]) => {
                    const input = document.createElement("input");
                    input.type = "hidden";
                    input.name = key;
                    input.value = value;
                    form.appendChild(input);
                });

                // B. Cart summary
                const itemsSummary = carts.map(cart =>
                    `${cart.name} (x${cart.quantity}) - $${(cart.price * cart.quantity).toFixed(2)}`
                ).join('\n');

                const itemsInput = document.createElement("input");
                itemsInput.type = "hidden";
                itemsInput.name = "order_items";
                itemsInput.value = itemsSummary;
                form.appendChild(itemsInput);

                // C. Totals
                const formatCurrency = (val: number) => `$${val.toFixed(2)}`;
                [
                    ["total", formatCurrency(totalPrice)],
                    ["vat", formatCurrency(vatAmount)],
                    ["shipping", formatCurrency(shippingFee)],
                    ["grand_total", formatCurrency(grandTotal)]
                ].forEach(([key, value]) => {
                    const input = document.createElement("input");
                    input.type = "hidden";
                    input.name = key.toString();
                    input.value = value.toString();
                    form.appendChild(input);
                });

                // D. Order summary image
                const summaryElement = document.getElementById("order-summary");
                if (summaryElement) {
                    // Save current styles
                    const originalDisplay = summaryElement.style.display;
                    const originalOpacity = summaryElement.style.opacity;

                    // Temporarily force visibility
                    summaryElement.style.display = "block";
                    summaryElement.style.opacity = "1";

                    // Wait a brief moment
                    await new Promise(resolve => setTimeout(resolve, 500));

                    const canvas = await html2canvas(summaryElement, {
                        useCORS: true,
                        scale: 2,
                        backgroundColor: null, // optional: makes background transparent
                    });

                    // Restore original styles
                    summaryElement.style.display = originalDisplay;
                    summaryElement.style.opacity = originalOpacity;

                    const dataUrl = canvas.toDataURL("image/png");

                    const imageInput = document.createElement("input");
                    imageInput.type = "hidden";
                    imageInput.name = "order_summary_image";
                    imageInput.value = dataUrl;
                    form.appendChild(imageInput);
                }



                // E. Send form via emailjs
                await emailjs.sendForm(
                    process.env.NEXT_PUBLIC_EMAIL_JS_SERVICE_ID || "",
                    process.env.NEXT_PUBLIC_EMAIL_JS_TEMPLATE_ID || "",
                    form,
                    process.env.NEXT_PUBLIC_EMAIL_JS_PUBLIC_KEY || ""
                );
                reset();
            } else if (createCheckout.rejected.match(result)) {
                toast.error(result.payload as string);
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("An unexpected error occurred");
            }
        }
    };


    // fetch all cart items
    React.useEffect(() => {
        dispatch(getAllCartItems());
    }, [dispatch]);

    // calculate total price
    const totalPrice = carts?.reduce((total, cart) => {
        return total + cart.price * cart.quantity;
    }, 0);

    const shippingFee = 50;
    const vatAmount = totalPrice * 0.2;
    const grandTotal = totalPrice + shippingFee + vatAmount;





    return (
        <>
            <main className='w-screen h-screen overflow-x-hidden bg-[#F1F1F1]'>
                {/* hero section */}
                <section
                    className="w-full text-white bg-no-repeat bg-cover bg-center pt-24 pb-8 flex">
                    {/* header */}
                    <Header bgColor='bg-black' showBorder={false} />

                    {/* hero text */}
                    <div className='container mx-auto my-auto flex items-center justify-start'>
                        <button type='button'
                            className=" hover:text-[#D87D4A] focus:bg-[#FBAF85] px-6 lg:px-0 py-3 text-[#000000] cursor-pointer"
                            onClick={() => router.back()}
                        >
                            Go back
                        </button>
                    </div>
                </section>

                <section className='container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 pb-20'>
                    {/* form */}
                    <div className='col-span-2 bg-white rounded-lg grid grid-cols-1 gap-10 p-6 md:p-10 mx-6 lg:mx-0'>
                        <h1 className='uppercase text-4xl font-bold'>Checkout</h1>
                        <form
                            ref={formRef}
                            onSubmit={handleSubmit(onSubmit)}
                            className="w-full h-full grid grid-cols-1 gap-10"
                        >
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <p className='uppercase text-md text-[#D87D4A] md:col-span-2'>Billing details</p>
                                {/* name */}
                                <div>
                                    <Controller
                                        name="name"
                                        control={control}
                                        rules={{
                                            required: "Name cannot be empty"
                                        }}
                                        render={({ field }) =>
                                            <TextField
                                                {...field}
                                                id="outlined-basic"
                                                label="Name"
                                                variant="outlined"
                                                className="w-full"
                                                autoComplete="off"
                                                type="text"
                                                sx={{
                                                    "& .MuiFormLabel-root": {
                                                        color: "#999999",
                                                    },
                                                    "& .MuiFormLabel-root.Mui-focused": {
                                                        color: "#D87D4A",
                                                    },
                                                    "& .MuiOutlinedInput-root": {
                                                        "& fieldset": {
                                                            borderColor: "#999999",
                                                        },
                                                        "&:hover fieldset": {
                                                            borderColor: "#D87D4A",
                                                        },
                                                        "&.Mui-focused fieldset": {
                                                            borderColor: "#D87D4A",
                                                        },
                                                    },
                                                }}

                                            />
                                        }
                                    />
                                    {errors.name && (
                                        <p role="alert" className="text-red-500 text-sm">{errors.name.message}</p>
                                    )}
                                </div>

                                {/* email */}
                                <div>
                                    <Controller
                                        name="email"
                                        control={control}
                                        rules={{
                                            required: "Email cannot be empty",
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: "Invalid email address",
                                            }
                                        }}
                                        render={({ field }) =>
                                            <TextField
                                                {...field}
                                                id="outlined-basic"
                                                label="Email Address"
                                                variant="outlined"
                                                className="w-full"
                                                autoComplete="off"
                                                type="text"
                                                sx={{
                                                    "& .MuiFormLabel-root": {
                                                        color: "#999999",
                                                    },
                                                    "& .MuiFormLabel-root.Mui-focused": {
                                                        color: "#D87D4A",
                                                    },
                                                    "& .MuiOutlinedInput-root": {
                                                        "& fieldset": {
                                                            borderColor: "#999999",
                                                        },
                                                        "&:hover fieldset": {
                                                            borderColor: "#D87D4A",
                                                        },
                                                        "&.Mui-focused fieldset": {
                                                            borderColor: "#D87D4A",
                                                        },
                                                    },
                                                }}

                                            />
                                        }
                                    />
                                    {errors.email && (
                                        <p role="alert" className="text-red-500 text-sm">{errors.email.message}</p>
                                    )}
                                </div>
                                {/* contact */}
                                <div>
                                    <Controller
                                        name="contact"
                                        control={control}
                                        rules={{
                                            required: "Phone number cannot be empty",
                                            pattern: {
                                                value: /\d+/,
                                                message: "Only digits are allowed in this field"
                                            },
                                        }}
                                        render={({ field }) =>
                                            <TextField
                                                {...field}
                                                id="outlined-basic"
                                                label="Phone Number"
                                                variant="outlined"
                                                className="w-full"
                                                autoComplete="off"
                                                type="text"
                                                sx={{
                                                    "& .MuiFormLabel-root": {
                                                        color: "#999999",
                                                    },
                                                    "& .MuiFormLabel-root.Mui-focused": {
                                                        color: "#D87D4A",
                                                    },
                                                    "& .MuiOutlinedInput-root": {
                                                        "& fieldset": {
                                                            borderColor: "#999999",
                                                        },
                                                        "&:hover fieldset": {
                                                            borderColor: "#D87D4A",
                                                        },
                                                        "&.Mui-focused fieldset": {
                                                            borderColor: "#D87D4A",
                                                        },
                                                    },
                                                }}

                                            />
                                        }
                                    />
                                    {errors.contact && (
                                        <p role="alert" className="text-red-500 text-sm">{errors.contact.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <p className='uppercase text-md text-[#D87D4A] md:col-span-2'>Shipping Info</p>
                                {/* address */}
                                <div className='md:col-span-2'>
                                    <Controller
                                        name="address"
                                        control={control}
                                        rules={{
                                            required: "Address cannot be empty"
                                        }}
                                        render={({ field }) =>
                                            <TextField
                                                {...field}
                                                id="outlined-basic"
                                                label="Address"
                                                variant="outlined"
                                                className="w-full"
                                                autoComplete="off"
                                                type="text"
                                                sx={{
                                                    "& .MuiFormLabel-root": {
                                                        color: "#999999",
                                                    },
                                                    "& .MuiFormLabel-root.Mui-focused": {
                                                        color: "#D87D4A",
                                                    },
                                                    "& .MuiOutlinedInput-root": {
                                                        "& fieldset": {
                                                            borderColor: "#999999",
                                                        },
                                                        "&:hover fieldset": {
                                                            borderColor: "#D87D4A",
                                                        },
                                                        "&.Mui-focused fieldset": {
                                                            borderColor: "#D87D4A",
                                                        },
                                                    },
                                                }}

                                            />
                                        }
                                    />
                                    {errors.address && (
                                        <p role="alert" className="text-red-500 text-sm">{errors.address.message}</p>
                                    )}
                                </div>
                                {/* zip code */}
                                <div>
                                    <Controller
                                        name="zip"
                                        control={control}
                                        render={({ field }) =>
                                            <TextField
                                                {...field}
                                                id="outlined-basic"
                                                label="Zip Code"
                                                variant="outlined"
                                                className="w-full"
                                                autoComplete="off"
                                                type="text"
                                                sx={{
                                                    "& .MuiFormLabel-root": {
                                                        color: "#999999",
                                                    },
                                                    "& .MuiFormLabel-root.Mui-focused": {
                                                        color: "#D87D4A",
                                                    },
                                                    "& .MuiOutlinedInput-root": {
                                                        "& fieldset": {
                                                            borderColor: "#999999",
                                                        },
                                                        "&:hover fieldset": {
                                                            borderColor: "#D87D4A",
                                                        },
                                                        "&.Mui-focused fieldset": {
                                                            borderColor: "#D87D4A",
                                                        },
                                                    },
                                                }}

                                            />
                                        }
                                    />
                                </div>
                                {/* city */}
                                <div>
                                    <Controller
                                        name="city"
                                        control={control}
                                        rules={{
                                            required: "Please enter city",
                                        }}
                                        render={({ field }) =>
                                            <TextField
                                                {...field}
                                                id="outlined-basic"
                                                label="City"
                                                variant="outlined"
                                                className="w-full"
                                                autoComplete="off"
                                                type="text"
                                                sx={{
                                                    "& .MuiFormLabel-root": {
                                                        color: "#999999",
                                                    },
                                                    "& .MuiFormLabel-root.Mui-focused": {
                                                        color: "#D87D4A",
                                                    },
                                                    "& .MuiOutlinedInput-root": {
                                                        "& fieldset": {
                                                            borderColor: "#999999",
                                                        },
                                                        "&:hover fieldset": {
                                                            borderColor: "#D87D4A",
                                                        },
                                                        "&.Mui-focused fieldset": {
                                                            borderColor: "#D87D4A",
                                                        },
                                                    },
                                                }}

                                            />
                                        }
                                    />
                                    {errors.city && (
                                        <p role="alert" className="text-red-500 text-sm">{errors.city.message}</p>
                                    )}
                                </div>
                                {/* country */}
                                <div>
                                    <Controller
                                        name="country"
                                        control={control}
                                        rules={{
                                            required: "Please enter country",
                                        }}
                                        render={({ field }) =>
                                            <TextField
                                                {...field}
                                                id="outlined-basic"
                                                label="Country"
                                                variant="outlined"
                                                className="w-full"
                                                autoComplete="off"
                                                type="text"
                                                sx={{
                                                    "& .MuiFormLabel-root": {
                                                        color: "#999999",
                                                    },
                                                    "& .MuiFormLabel-root.Mui-focused": {
                                                        color: "#D87D4A",
                                                    },
                                                    "& .MuiOutlinedInput-root": {
                                                        "& fieldset": {
                                                            borderColor: "#999999",
                                                        },
                                                        "&:hover fieldset": {
                                                            borderColor: "#D87D4A",
                                                        },
                                                        "&.Mui-focused fieldset": {
                                                            borderColor: "#D87D4A",
                                                        },
                                                    },
                                                }}

                                            />
                                        }
                                    />
                                    {errors.country && (
                                        <p role="alert" className="text-red-500 text-sm">{errors.country.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <p className='uppercase text-md text-[#D87D4A] md:col-span-2'>Payment Details</p>
                                {/* paymentMethod */}
                                <p>Payment Method</p>
                                <Controller
                                    name="paymentMethod"
                                    control={control}
                                    render={({ field }) => (
                                        <div>
                                            <RadioGroup
                                                {...field}
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.target.value)}
                                                className="grid grid-cols-1 gap-4"
                                            >
                                                <div
                                                    tabIndex={0}
                                                    className="border rounded-md p-3 focus-within:border-[#D87D4A] border-gray-300 focus:outline-none"
                                                >
                                                    <MyFormControlLabel
                                                        value="eMoney"
                                                        label="E-money"
                                                        control={
                                                            <Radio
                                                                sx={{
                                                                    color: "#9CA3AF",
                                                                    "&.Mui-checked": {
                                                                        color: "#D87D4A",
                                                                    },
                                                                }}
                                                            />
                                                        }
                                                        sx={{
                                                            color: "#000000",
                                                            "& .MuiFormControlLabel-label": {
                                                                color: "#000000",
                                                            },
                                                        }}
                                                    />
                                                </div>

                                                <div
                                                    tabIndex={0}
                                                    className="border rounded-md p-3 focus-within:border-[#D87D4A] border-gray-300 focus:outline-none"
                                                >
                                                    <MyFormControlLabel
                                                        value="cash"
                                                        label="Cash on delivery"
                                                        control={
                                                            <Radio
                                                                sx={{
                                                                    color: "#9CA3AF",
                                                                    "&.Mui-checked": {
                                                                        color: "#D87D4A",
                                                                    },
                                                                }}
                                                            />
                                                        }
                                                        sx={{
                                                            color: "#000000",
                                                            "& .MuiFormControlLabel-label": {
                                                                color: "#000000",
                                                            },
                                                        }}
                                                    />
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    )}
                                />

                                {selectedPaymentMethod === "eMoney" && (
                                    <>
                                        {/* emoney number */}
                                        <div>
                                            <Controller
                                                name="eMoneyNum"
                                                control={control}
                                                rules={{
                                                    pattern: {
                                                        value: /\d+/,
                                                        message: "Only digits are allowed in this field"
                                                    },
                                                }}
                                                render={({ field }) =>
                                                    <TextField
                                                        {...field}
                                                        id="outlined-basic"
                                                        label="E-money Number"
                                                        variant="outlined"
                                                        className="w-full"
                                                        autoComplete="off"
                                                        type="text"
                                                        sx={{
                                                            "& .MuiFormLabel-root": {
                                                                color: "#999999",
                                                            },
                                                            "& .MuiFormLabel-root.Mui-focused": {
                                                                color: "#D87D4A",
                                                            },
                                                            "& .MuiOutlinedInput-root": {
                                                                "& fieldset": {
                                                                    borderColor: "#999999",
                                                                },
                                                                "&:hover fieldset": {
                                                                    borderColor: "#D87D4A",
                                                                },
                                                                "&.Mui-focused fieldset": {
                                                                    borderColor: "#D87D4A",
                                                                },
                                                            },
                                                        }}

                                                    />
                                                }
                                            />
                                            {errors.eMoneyNum && (
                                                <p role="alert" className="text-red-500 text-sm">{errors.eMoneyNum.message}</p>
                                            )}
                                        </div>
                                        {/* emoney pin */}
                                        <div>
                                            <Controller
                                                name="eMoneyPin"
                                                control={control}
                                                rules={{
                                                    pattern: {
                                                        value: /\d+/,
                                                        message: "Only digits are allowed in this field"
                                                    },
                                                }}
                                                render={({ field }) =>
                                                    <TextField
                                                        {...field}
                                                        id="outlined-basic"
                                                        label="E-money Pin"
                                                        variant="outlined"
                                                        className="w-full"
                                                        autoComplete="off"
                                                        type="password"
                                                        sx={{
                                                            "& .MuiFormLabel-root": {
                                                                color: "#999999",
                                                            },
                                                            "& .MuiFormLabel-root.Mui-focused": {
                                                                color: "#D87D4A",
                                                            },
                                                            "& .MuiOutlinedInput-root": {
                                                                "& fieldset": {
                                                                    borderColor: "#999999",
                                                                },
                                                                "&:hover fieldset": {
                                                                    borderColor: "#D87D4A",
                                                                },
                                                                "&.Mui-focused fieldset": {
                                                                    borderColor: "#D87D4A",
                                                                },
                                                            },
                                                        }}

                                                    />
                                                }
                                            />
                                            {errors.eMoneyPin && (
                                                <p role="alert" className="text-red-500 text-sm">{errors.eMoneyPin.message}</p>
                                            )}
                                        </div>
                                    </>
                                )}


                                {selectedPaymentMethod === "cash" && (
                                    <div className='flex items-center justify-center gap-6 w-full'>
                                        <Image
                                            src='/checkout/icon-cash-on-delivery.svg'
                                            alt='checkout'
                                            width={30}
                                            height={30}
                                            priority
                                        />

                                        <p className='w-full text-center md:text-start'>
                                            The &#39;Cash on Delivery&#39; option enables you to pay in cash when our delivery courier arrives at your residence. Just make sure your address is correct so that your order will not be cancelled.
                                        </p>
                                    </div>

                                )}
                            </div>

                            <button type='submit' className='hidden'></button>
                        </form>
                    </div>

                    {/* summary */}
                    <div className='bg-white rounded-lg p-6 md:p-10 mx-6 lg:mx-0 flex flex-col gap-6 h-fit w-full'>
                        <h1 className='uppercase text-xl font-semibold pb-6'>Summary</h1>
                        {carts.map((cart) => (
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
                                <div className="flex items-center justify-end">
                                    <p>&#215;{cart.quantity}</p>
                                </div>

                            </div>
                        ))}
                        <div className='flex items-center justify-between pt-8'>
                            <p className='uppercase'>Total</p>
                            <span className='font-semibold'>&#36; {totalPrice.toLocaleString()}</span>
                        </div>

                        <div className='flex items-center justify-between'>
                            <p className='uppercase'>Shipping</p>
                            <span className='font-semibold'>&#36; {shippingFee.toLocaleString()}</span>
                        </div>

                        <div className='flex items-center justify-between'>
                            <p className='uppercase'>Vat (included)(20&#37;)</p>
                            <span className='font-semibold'>&#36; {vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>

                        <div className='flex items-center justify-between'>
                            <p className='uppercase'>Grand Total</p>
                            <span className='font-semibold text-[#D87D4A]'>&#36; {grandTotal.toLocaleString()}</span>
                        </div>

                        <div>

                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                ref={formRef}
                                className="w-full h-full grid grid-cols-1 gap-10"
                            >
                                <button type='submit' className="bg-[#D87D4A] hover:bg-[#FBAF85] focus:bg-[#FBAF85] px-6 py-3 text-white uppercase cursor-pointer">
                                    Continue to pay
                                </button>
                            </form>
                        </div>
                    </div>

                </section>



                <Footer />
            </main >


            {/* checkout modal */}
            <Modal
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                onClose={(e, reason) => {
                    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                        handleClose();
                    }
                }}
                className='outline-none w-full flex items-center justify-center backdrop-blur-sm px-2'
            >
                <Fade in={open}>
                    <div className='w-full lg:w-2/4 bg-white  overflow-y-auto p-10 rounded-lg'>
                        <div className='flex items-center justify-start pb-4'>
                            <Image src="/checkout/icon-order-confirmation.svg" alt="product" width={50} height={50} />
                        </div>

                        <h1 className="text-2xl font-bold uppercase">
                            THANK YOU <br /> FOR YOUR ORDER
                        </h1>

                        <p className='opacity-50 text-sm py-4'>
                            You will receive an email confirmation shortly.
                        </p>

                        {/* Product Summary */}
                        <div className='grid grid-cols-1 md:grid-cols-2'
                        >
                            <div className='bg-[#f1f1f1] rounded-lg p-6 flex items-center justify-center flex-col'>
                                {confirmedCart.length > 0 && (
                                    <div className='grid grid-cols-3 pb-6 items-center justify-center flex-col'>
                                        <div>
                                            <Image
                                                src={confirmedCart[0].image.mobile}
                                                alt={confirmedCart[0].name}
                                                width={50}
                                                height={50}
                                            />
                                        </div>
                                        <div>
                                            <p className='uppercase text-sm font-normal'>
                                                {confirmedCart[0].name}
                                            </p>
                                            <p className='uppercase text-sm font-normal'>
                                                &#36; {confirmedCart[0].price.toLocaleString()}
                                            </p>
                                        </div>
                                        <p className='uppercase text-sm font-normal text-end'>
                                            &#215;{confirmedCart[0].quantity}
                                        </p>
                                    </div>
                                )}
                                <Divider orientation="horizontal" flexItem />
                                {confirmedCart.length > 1 && (
                                    <p className='text-sm text-center pt-4'>and {confirmedCart.length - 1} other item(s)</p>
                                )}
                            </div>
                            <div className='bg-black text-white flex flex-col items-start justify-center p-10'>
                                <p className='uppercase text-xl font-normal opacity-50'>
                                    Grand Total
                                </p>
                                <p className='uppercase text-lg font-normal'>
                                    &#36; {grandTotal.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <button
                            className="w-full cursor-pointer mt-6 bg-[#D87D4A] hover:bg-[#FBAF85] text-white text-sm uppercase py-3 tracking-wider"
                            onClick={() => router.push('/')}
                        >
                            Back to home
                        </button>
                    </div>
                </Fade>
            </Modal>

        </>
    )
}

export default Checkout
