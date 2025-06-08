import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';

// Define the type for an individual car iItem
interface ImageType {
    mobile: string;
    tablet: string;
    desktop: string;
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
}

interface Cart {
    _id: string;
    sessionId: string;
    productId: Product;
    name: string;
    slug: string;
    price: number;
    quantity: number;
    image: ImageType;
    createdAt: string;
    updatedAt: string;
}

// Define the initial state for the cart item  slice
export interface CartSliceState {
    carts: Cart[];
    loading: boolean;
    success: boolean;
    error: string | null;
}

const initialState: CartSliceState = {
    carts: [],
    loading: false,
    success: false,
    error: null,
};

//asyncthunk to fetch cart
export const getAllCartItems = createAsyncThunk<
    Cart[],
    void,
    { rejectValue: string }
>("products/getAllCartItems", async (_, thunkAPI) => {
    try {
        const sessionId = localStorage.getItem("sessionId");
        if (!sessionId) {
            return thunkAPI.rejectWithValue("Session ID is missing");
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}cart`, {
            headers: {
                "Content-Type": "application/json",
                "x-session-id": sessionId,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return thunkAPI.rejectWithValue(
                errorData.message || "Failed to fetch cart items"
            );
        }

        const data = await response.json();
        // console.log(data)
        return data;
    } catch (error: unknown) {
        let message = "An unexpected error occurred";
        if (error instanceof Error) {
            message = error.message;
        }
        return thunkAPI.rejectWithValue(message);
    }
});

export const addToCart = createAsyncThunk<
    Cart,
    { productId: string; sessionId: string; cartData: Partial<Cart> },
    { rejectValue: string }
>("products/addToCart", async ({ productId, cartData }, thunkAPI) => {
    try {

        let sessionId = localStorage.getItem('sessionId');
        if (!sessionId) {
            sessionId = uuidv4();
            localStorage.setItem('sessionId', sessionId);
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}cart`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ productId, sessionId, cartData }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return thunkAPI.rejectWithValue(errorData.message || "Failed to add to cart");
        }

        const data: Cart = await response.json();
        return data;
    } catch (error: unknown) {
        let message = "An unexpected error occurred";
        if (error instanceof Error) {
            message = error.message;
        }
        return thunkAPI.rejectWithValue(message);
    }
});

// Update item
export const updateCartQuantity = createAsyncThunk<
    Cart,
    { _id: string; quantity: number },
    { rejectValue: string }
>("products/updateCartQuantity", async ({ _id, quantity }, thunkAPI) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}cart/${_id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ _id, quantity }),
        });

        if (!response.ok) {
            const error = await response.json();
            return thunkAPI.rejectWithValue(error.message || "Failed to update quantity");
        }

        return await response.json();
    } catch (error: unknown) {
        let message = "An unexpected error occurred";
        if (error instanceof Error) {
            message = error.message;
        }
        return thunkAPI.rejectWithValue(message);
    }
});

// Delete item
export const deleteCartItem = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>("products/deleteCartItem", async (cartId, thunkAPI) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}cart/${cartId}`, {
            method: "DELETE",
        });
        // console.log("Deleting cart item with ID:", cartId);
        if (!response.ok) {
            const error = await response.json();
            return thunkAPI.rejectWithValue(error.message || "Failed to delete item");
        }
        // console.log(response)
        return cartId;
    } catch (error: unknown) {
        let message = "An unexpected error occurred";
        if (error instanceof Error) {
            message = error.message;
        }
        return thunkAPI.rejectWithValue(message);
    }
});

// delete all cart items
export const deleteAllCartItems = createAsyncThunk<
    void,
    void,
    { rejectValue: string }
>("products/deleteAllCartItems", async (_, thunkAPI) => {
    try {
        const sessionId = localStorage.getItem("sessionId");
        if (!sessionId) {
            return thunkAPI.rejectWithValue("Session ID is missing");
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}cart/remove`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "x-session-id": sessionId,
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            return thunkAPI.rejectWithValue(
                errorData.message || "Failed to remove all cart items"
            );
        }
    } catch (error: unknown) {
        let message = "An unexpected error occurred";
        if (error instanceof Error) {
            message = error.message;
        }
        return thunkAPI.rejectWithValue(message);
    }
});




// Create the carts slice
export const cartsSlice = createSlice({
    name: "carts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // get all cart item
            .addCase(getAllCartItems.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllCartItems.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.carts = action.payload;
            })
            .addCase(getAllCartItems.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string;
            })
            // Add to cart
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                // Check if item already exists, update quantity or add new
                const existingIndex = state.carts.findIndex(
                    (item) => item._id === action.payload._id
                );

                if (existingIndex >= 0) {
                    state.carts[existingIndex] = action.payload;
                } else {
                    state.carts.push(action.payload);
                }
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string;
            })
            // update cart item
            .addCase(updateCartQuantity.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateCartQuantity.fulfilled, (state, action) => {
                const index = state.carts.findIndex(c => c._id === action.payload._id);
                if (index !== -1) {
                    state.carts[index] = action.payload;
                }
            })
            .addCase(updateCartQuantity.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string;
            })
            // delete cart item
            .addCase(deleteCartItem.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteCartItem.fulfilled, (state, action) => {
                state.carts = state.carts.filter(cart => cart._id !== action.payload);
            })
            .addCase(deleteCartItem.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string;
            })
            // remove all cart items
            .addCase(deleteAllCartItems.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteAllCartItems.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
                state.carts = [];
            })
            .addCase(deleteAllCartItems.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string;
            });
        // .addDefaultCase();
    },
});

export default cartsSlice.reducer;
