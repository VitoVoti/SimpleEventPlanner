import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

const inter = Inter({ subsets: ["latin"] });

import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { Grid } from "@mui/material"
import SiteNav from "./layout_components/SiteNav";
import SiteFooter from "./layout_components/SiteFooter";

export const metadata: Metadata = {
  title: "Simple Event Planner",
  description: "Frontend for the Simple Event Planner application",
};

export default function RootLayout({
    children,
    }: Readonly<{
        children: React.ReactNode;
    }>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AppRouterCacheProvider options={{ enableCssLayer: true }}> {/* Needed by MUI when we use Next.js */}
                    <ThemeProvider theme={theme} > {/* MUI themeing */}
                        <SiteNav />
                        <Grid container>
                            {children}
                        </Grid>
                        <SiteFooter />
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
