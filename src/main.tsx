import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './Secure/AuthContext.tsx'
import client from "./GraphQL/Client";
import { ApolloProvider } from "@apollo/client";
import { Provider } from "react-redux";
import { store} from "./Redux/Store.ts"
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
    <ApolloProvider client={client}>
    <AuthProvider>
    <App />
    </AuthProvider>
    </ApolloProvider>
    </Provider>
  </React.StrictMode>,
)
