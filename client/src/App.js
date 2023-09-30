import React, { useEffect, useState } from "react"
import { usePlaidLink } from "react-plaid-link"
import axios from "axios"
import './App.css';

axios.defaults.baseURL = "http://localhost:5000"

const Authorization = ({publicToken}) => {
  const [account, setAccount] = useState()

  useEffect(() => {
    const fetchAccess = async () => {
      let accessToken = await axios.post("/exchange_public_token", {public_token: publicToken})
      const auth = await axios.post("/auth", {access_token: accessToken.data.accessToken})
      setAccount(auth.data.numbers.ach[0])
    }
    fetchAccess()
  }, [])

  return account && (
    <div>
      <p>number: {account.account}</p>
      <p>routing: {account.routing}</p>
    </div>
  )
}

function App() {
  const [token, setToken] = useState()
  const [publicToken, setPublicToken] = useState()

  useEffect(() => {
    const fetchToken = async () => {
      const res = await axios.post("/create_link_token")
      setToken(res.data.link_token)
    }
    fetchToken()
  }, [])

  const { open, ready } = usePlaidLink({
    token: token,
    onSuccess: (public_token, metadata) => {
      setPublicToken(public_token)
    },
  });

  return  publicToken ? (<Authorization publicToken={publicToken} />) : (
    <button onClick={() => open()} disabled={!ready}>
      Connect a bank account
    </button>
  );
}

export default App;
