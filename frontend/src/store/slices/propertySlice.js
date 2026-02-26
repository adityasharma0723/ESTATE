import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const fetchProperties = createAsyncThunk(
    'properties/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const { data } = await API.get('/properties', { params });
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch');
        }
    }
);

export const fetchPropertyById = createAsyncThunk(
    'properties/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await API.get(`/properties/${id}`);
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch property');
        }
    }
);

export const fetchFeaturedProperties = createAsyncThunk(
    'properties/fetchFeatured',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await API.get('/properties', { params: { featured: true, limit: 6 } });
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch featured');
        }
    }
);

const propertySlice = createSlice({
    name: 'properties',
    initialState: {
        properties: [],
        featured: [],
        current: null,
        pagination: null,
        loading: false,
        error: null,
        filters: {
            city: '',
            propertyType: '',
            status: '',
            minPrice: '',
            maxPrice: '',
            bedrooms: '',
            sort: 'newest',
            search: '',
            page: 1,
        },
    },
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = {
                city: '',
                propertyType: '',
                status: '',
                minPrice: '',
                maxPrice: '',
                bedrooms: '',
                sort: 'newest',
                search: '',
                page: 1,
            };
        },
        clearCurrent: (state) => {
            state.current = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProperties.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProperties.fulfilled, (state, action) => {
                state.loading = false;
                state.properties = action.payload.properties;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchProperties.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchPropertyById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPropertyById.fulfilled, (state, action) => {
                state.loading = false;
                state.current = action.payload.property;
            })
            .addCase(fetchPropertyById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchFeaturedProperties.fulfilled, (state, action) => {
                state.featured = action.payload.properties;
            });
    },
});

export const { setFilters, resetFilters, clearCurrent } = propertySlice.actions;
export default propertySlice.reducer;
