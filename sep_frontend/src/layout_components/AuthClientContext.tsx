"use client";
// From https://github.com/nextauthjs/next-auth/issues/5647

import { SessionProvider } from "next-auth/react";

export interface AuthClientContextProps {
    session: any;
    children: React.ReactNode;
}

export default function AuthClientContext({ session, children }: AuthClientContextProps) {
    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    );
}