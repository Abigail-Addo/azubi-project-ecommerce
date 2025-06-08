import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";


interface ImageType {
    mobile: string;
    tablet: string;
    desktop: string;
}

interface OrderItem {
    productId: string;
    name: string;
    slug: string;
    price: number;
    quantity: number;
    image: ImageType;
}

interface CustomerInfo {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zip: string;
    country: string;
}

type PaymentMethod = "eMoney" | "cash";

interface PaymentInfo {
    method: PaymentMethod;
    eMoneyNumber?: string;
    eMoneyPin?: string;
}

interface Totals {
    total: number;
    vat: number;
    shipping: number;
    grandTotal: number;
}

interface CheckoutPayload {
    sessionId: string;
    customer: CustomerInfo;
    payment: PaymentInfo;
    items: OrderItem[];
    totals: Totals;
}

export interface CheckoutSliceState {
    loading: boolean;
    success: boolean;
    error: string | null;
    checkout: string | null;
    grandTotal: number | null;
}

// Initial state
const initialState: CheckoutSliceState = {
    loading: false,
    success: false,
    error: null,
    checkout: null,
    grandTotal: null,
};

// Thunk
export const createCheckout = createAsyncThunk<
    { checkout: string; grandTotal: number },
    CheckoutPayload,
    { rejectValue: string }
>("checkout/createCheckout", async (checkoutData, thunkAPI) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}checkout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(checkoutData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return thunkAPI.rejectWithValue(errorData.message || "Checkout failed");
        }

        const data = await response.json();
        // console.log(data)
        return {
            checkout: data.checkout,
            grandTotal: data.grandTotal,
        };
    } catch (error: unknown) {
        let message = "An unexpected error occurred";
        if (error instanceof Error) {
            message = error.message;
        }
        return thunkAPI.rejectWithValue(message);
    }
});

// Slice
export const checkoutSlice = createSlice({
    name: "checkout",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createCheckout.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(createCheckout.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.checkout = action.payload.checkout;
                state.grandTotal = action.payload.grandTotal;
            }
            )
            .addCase(
                createCheckout.rejected,
                (state, action: PayloadAction<string | undefined>) => {
                    state.loading = false;
                    state.error = action.payload || "Something went wrong";
                }
            );
    },
});

export default checkoutSlice.reducer;
