/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, // Due to some quirks with react-big-calendar, this is set to false, and strict mode is enabled on other components via <React.StrictMode>
};

export default nextConfig;
