
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Simple Event Planner",
    description: "Frontend for the Simple Event Planner application",
};

// Style imports
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

const inter = Inter({ subsets: ["latin"] });

// MUI imports
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { Grid } from "@mui/material"

// Navbar and Footer
import SiteNav from "../layout_components/SiteNav";
import SiteFooter from "../layout_components/SiteFooter";

// Auth stuff
import type {AppProps} from "next/app";
import AuthClientContext from "@/layout_components/AuthClientContext";
import { getServerSession } from "next-auth";

// Toasts
import { Toaster } from 'sonner';

export default function RootLayout({
    children,
    }: Readonly<{
        children: React.ReactNode;
    }>) {

    const session = getServerSession();
    
    return (
        <html lang="en">
            <body className={inter.className}>
                <AppRouterCacheProvider options={{ enableCssLayer: true }}> {/* Needed by MUI when we use Next.js */}
                    <ThemeProvider theme={theme} > {/* MUI themeing */}
                            <AuthClientContext session={session}>
                                <SiteNav />
                                <Grid container>
                                    {children}
                                </Grid>
                                <SiteFooter />
                                <Toaster />
                            </AuthClientContext>
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
