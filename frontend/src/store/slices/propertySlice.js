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
        addPropertyRealTime: (state, action) => {
            if (action.payload.isApproved) {
                state.properties.unshift(action.payload);
            }
        },
        updatePropertyRealTime: (state, action) => {
            const index = state.properties.findIndex(p => p._id === action.payload._id);
            if (index !== -1) {
                if (action.payload.isApproved === false) {
                    state.properties.splice(index, 1);
                } else {
                    state.properties[index] = action.payload;
                }
            } else if (action.payload.isApproved) {
                state.properties.unshift(action.payload);
            }
            if (state.current && state.current._id === action.payload._id) {
                state.current = action.payload;
            }
        },
        removePropertyRealTime: (state, action) => {
            state.properties = state.properties.filter(p => p._id !== action.payload);
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

export const { setFilters, resetFilters, clearCurrent, addPropertyRealTime, updatePropertyRealTime, removePropertyRealTime } = propertySlice.actions;
export default propertySlice.reducer;
