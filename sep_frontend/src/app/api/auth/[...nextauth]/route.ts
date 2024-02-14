/*
Taken from the NextAuth.js documentation

Internally, NextAuth.js detects that it is being initialized in a Route Handler (by understanding that it is passed a Web Request instance), and will return a handler that returns a Response instance. A Route Handler file expects you to export some named handler functions that handle a request and return a response. NextAuth.js needs the GET and POST handlers to function properly, so we export those two.

--

The Credentials provider allows you to handle signing in with arbitrary credentials, such as a username and password, two-factor authentication or hardware device (e.g. YubiKey U2F / FIDO).

It is intended to support use cases where you have an existing system you need to authenticate users against.

https://next-auth.js.org/configuration/providers/credentials
*/

import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const auth_options = {
    providers: [
        CredentialsProvider({
          // The name to display on the sign in form (e.g. 'Sign in with...')
          name: 'Simple Event Planner JWT',
          // The credentials is used to generate a suitable form on the sign in page.
          // You can specify whatever fields you are expecting to be submitted.
          // e.g. domain, username, password, 2FA token, etc.
          // You can pass any HTML attribute to the <input> tag through the object.
          credentials: {
            username: { label: "Username", type: "text", placeholder: "jsmith" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials, req) {
            // You need to provide your own logic here that takes the credentials
            // submitted and returns either a object representing a user or value
            // that is false/null if the credentials are invalid.
            // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
            // You can also use the `req` object to obtain additional parameters
            // (i.e., the request IP address)
            const res = await fetch("/your/endpoint", {
              method: 'POST',
              body: JSON.stringify(credentials),
              headers: { "Content-Type": "application/json" }
            })
            const user = await res.json()
      
            // If no error and we have user data, return it
            if (res.ok && user) {
              return user
            }
            // Return null if user data could not be retrieved
            return null
          }
        })
      ]
}

const handler = NextAuth(auth_options)

export { handler as GET, handler as POST }