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
      console.log(accessToken.data);
      const auth = await axios.post("/auth", {access_token: accessToken.data.accessToken})
      console.log(auth.data);
      /*
          {
    accounts: [
      {
        account_id: 'KoxpBg5R74SvdzpwNLprUag4WyL5XvfRQyREv',
        balances: {
          available: 100,
          current: 110,
          iso_currency_code: 'USD',
          limit: null,
          unofficial_currency_code: null
        },
        mask: '0000',
        name: 'Plaid Checking',
        official_name: 'Plaid Gold Standard 0% Interest Checking',
        subtype: 'checking',
        type: 'depository'
      }
    ],
    item: {
      available_products: Array(8) [
        'assets', 'balance', 'signal', 'identity', 'investments', 'liabilities', 'recurring_transactions',
        'transactions'
      ],
      billed_products: [ 'auth' ],
      consent_expiration_time: null,
      error: null,
      institution_id: 'ins_56',
      item_id: 'Wx1KZr5JWLfJ7QkMDEkZuVGQqoJ9ZEFlagRxG',
      optional_products: null,
      products: [ 'auth' ],
      update_type: 'background',
      webhook: ''
    },
    numbers: {
      ach: [
        {
          account: '1111222233330000',
          account_id: 'KoxpBg5R74SvdzpwNLprUag4WyL5XvfRQyREv',
          routing: '011401533',
          wire_routing: '021000021'
        }
      ],
      bacs: [],
      eft: [],
      international: []
    },
    request_id: 'r804SQuK99Gudud'
  }
      */
      setAccount(auth.data.numbers.ach[0])
    }
    fetchAccess()
  }, [])
  /*
    {
      accessToken: 'access-sandbox-b42469ca-400f-46b7-97b9-65b42292b325'
    }
  */

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
      console.log("res:", res.data);
      setToken(res.data.link_token)
    }

    fetchToken()
  }, [])

  const { open, ready } = usePlaidLink({
    token: token,
    onSuccess: (public_token, metadata) => {
      console.log(public_token, metadata);
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
