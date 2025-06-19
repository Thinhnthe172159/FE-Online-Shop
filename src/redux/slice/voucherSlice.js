// store/voucherSlice.js
import { createSlice } from '@reduxjs/toolkit';

const voucherSlice = createSlice({
    name: 'voucher',
    initialState: {
        selectedVoucher: null,
    },
    reducers: {
        selectVoucher: (state, action) => {
            state.selectedVoucher = action.payload;
        },
        clearVoucher: (state) => {
            state.selectedVoucher = null;
        },
    },
});

export const { selectVoucher, clearVoucher } = voucherSlice.actions;
export default voucherSlice.reducer;
