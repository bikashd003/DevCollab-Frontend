import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './Secure/AuthContext.tsx'
import client from "./GraphQL/Client";
import { ApolloProvider } from "@apollo/client";
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
    <AuthProvider>
    <App />
    </AuthProvider>
    </ApolloProvider>
  </React.StrictMode>,
)
