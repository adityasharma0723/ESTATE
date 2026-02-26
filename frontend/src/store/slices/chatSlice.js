import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const fetchChats = createAsyncThunk('chat/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const { data } = await API.get('/chat');
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch chats');
    }
});

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chats: [],
        activeChat: null,
        loading: false,
    },
    reducers: {
        setActiveChat: (state, action) => {
            state.activeChat = action.payload;
        },
        addMessage: (state, action) => {
            const { chatId, message } = action.payload;
            const chat = state.chats.find(c => c._id === chatId);
            if (chat) {
                chat.messages.push(message);
                chat.lastMessage = message.text;
            }
            if (state.activeChat?._id === chatId) {
                state.activeChat.messages.push(message);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChats.pending, (state) => { state.loading = true; })
            .addCase(fetchChats.fulfilled, (state, action) => {
                state.loading = false;
                state.chats = action.payload.chats;
            })
            .addCase(fetchChats.rejected, (state) => { state.loading = false; });
    },
});

export const { setActiveChat, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
