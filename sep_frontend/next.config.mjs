/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, // Due to some quirks with react-big-calendar, this is set to false, and strict mode is enabled on other components via <React.StrictMode>
    webpack: (config, { isServer }) => {
        if(process.env.NODE_ENV === 'production') {
            config.mode = 'production'
        }
        else {
            config.mode = 'development'
        }

        return config;
    },
};

export default nextConfig;
