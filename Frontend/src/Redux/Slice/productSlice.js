import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    product: [],
    cart: [],
    addresses: [],
    selectedAddresses: null,
  },

  reducers: {
    // state, action
    setProduct: (state, action) => {
      state.product = action.payload;
    },
    setCart: (state, action) => {
      state.cart = action.payload;
    },

    // check exist address or add/push new in state
    addAddress: (state, action) => {
      if (!state.addresses) state.addresses = [];
      state.addresses.push(action.payload);
    },

    setSelectedAddress: (state, action) => {
      state.selectedAddresses = action.payload;
    },
    deleteAddress: (state, action) => {
      state.addresses = state.addresses.filter(
        (_, index) => index !== action.payload,
      );

      //Reset selected Address if it was deleted
      if (state.selectedAddresses === action.payload) {
        state.selectedAddresses = null;
      }
    },
  },
});

export const { setProduct, setCart, addAddress, setSelectedAddress, deleteAddress } = productSlice.actions;
export default productSlice.reducer;
