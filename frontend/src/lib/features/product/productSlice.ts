import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Define the type for an individual product
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

// Define the initial state for the product  slice
export interface ProductSliceState {
  products: Product[];
  product: Product | null;
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: ProductSliceState = {
  products: [],
  product: null,
  loading: false,
  success: false,
  error: null,
};

//asyncthunk to fetch products
export const getAllProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("products/getAllProducts", async (_, thunkAPI) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}products`);

    if (!response.ok) {
      const errorData = await response.json();
      return thunkAPI.rejectWithValue(
        errorData.message || "Failed to fetch products"
      );
    }

    const data: Product[] = await response.json();
    return data;
  } catch (error: unknown) {
    let message = "An unexpected error occurred";
    if (error instanceof Error) {
      message = error.message;
    }
    return thunkAPI.rejectWithValue(message);
  }
});

//asyncthunk to fetch a single product by id
export const getSingleProduct = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>("products/getSingleProduct", async (id, thunkAPI) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}products/${id}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      return thunkAPI.rejectWithValue(
        errorData.message || "Failed to fetch product"
      );
    }

    const product: Product = await response.json();
    return product;
  } catch (error: unknown) {
    let message = "An unexpected error occurred";
    if (error instanceof Error) {
      message = error.message;
    }
    return thunkAPI.rejectWithValue(message);
  }
});

// asyncthunk to get products by category
export const getProductsByCategory = createAsyncThunk<
  Product[],
  string,
  { rejectValue: string }
>("products/getProductsByCategory", async (category, thunkAPI) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}products/category/${category}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      return thunkAPI.rejectWithValue(
        errorData.message || "Failed to fetch products by category"
      );
    }

    const products: Product[] = await response.json();
    return products;
  } catch (error: unknown) {
    let message = "An unexpected error occurred";
    if (error instanceof Error) {
      message = error.message;
    }
    return thunkAPI.rejectWithValue(message);
  }
});

// Create the products slice
export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get all products
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.products = action.payload;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      })
      // get a single product
      .addCase(getSingleProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSingleProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.product = action.payload;
      })
      .addCase(getSingleProduct.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
        state.product = null;
      })
      // get products by category
      .addCase(getProductsByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.products = action.payload;
      })
      .addCase(getProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      });
    // .addDefaultCase();
  },
});

export default productsSlice.reducer;
