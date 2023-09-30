require('dotenv').config()
const express = require("express")
const cors = require("cors")
const admin = require('firebase-admin');
const bodyParser = require("body-parser")
const serviceAccount = require("../server/budgetwise-plaid-firebase-adminsdk-peiul-bb8871b08b.json");
const  { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');



const app = express()
app.use(cors())
app.use(bodyParser.json())

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const db = admin.firestore();

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const client = new PlaidApi(configuration);


app.post('/create_link_token', async function (request, response) {
  const plaidRequest = {
    user: {
      client_user_id: "user",
    },
    client_name: 'Plaid Test App',
    products: ['auth'],
    language: 'en',
    redirect_uri: 'http://localhost:5000/',
    country_codes: ['US'],
  };
  try {
    const createTokenResponse = await client.linkTokenCreate(plaidRequest);
    response.json(createTokenResponse.data);
  } catch (error) {
    response.status(500).send("Server Error")
  }
});


app.post("/auth", async function(request, response) {
  try {
    const access_token = request.body.access_token;
    const plaidRequest = {
      access_token: access_token,
    };
    const plaidResponse = await client.authGet(plaidRequest);
    const uniqueId = plaidResponse.data.item_id || '1';
    const docRef = db.collection('plaidData').doc(uniqueId);
    await docRef.set(plaidResponse.data);

    response.json(plaidResponse.data);
  } catch (error) {
    console.error("Error writing to Firestore: ", error);
    response.status(500).send("Server Error");
  }
});


app.post('/exchange_public_token', async function (
  request,
  response,
  next,
) {
  const publicToken = request.body.public_token;
  try {
    const plaidResponse = await client.itemPublicTokenExchange({
      public_token: publicToken,
    });
    const accessToken = plaidResponse.data.access_token;
    response.json({ accessToken });
  } catch (error) {
    response.status(500).send("Server Error")
  }
});



const port = 5000
app.listen(port, () => console.log("Server is running on port:", port))
