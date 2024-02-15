import Axios from 'axios'
const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_CORE_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'ngrok-skip-browser-warning': true,
    },
    //withCredentials: true,
})

export default axios
