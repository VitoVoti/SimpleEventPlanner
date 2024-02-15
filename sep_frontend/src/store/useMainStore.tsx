import axios from '../lib/axios';
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Here we hold the current user's data, and Event data to share between components
const useMainStore = create(
    persist(
        (set, get) => ({
            user_token: null,
            events: [],
            event_types: [],


            setUserToken: (token : string) => set((state) => ({
                user_token: token
            })),
        }),

        {
            name: 'sep-data-' + process.env.NODE_ENV.toLowerCase(), // unique name
            storage: createJSONStorage(() => localStorage),
        }
    )
)

export default useMainStore