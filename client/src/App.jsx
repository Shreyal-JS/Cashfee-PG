import { useState } from 'react'
import axios from 'axios'
import {load} from '@cashfreepayments/cashfree-js'

function App() {


  let cashfree;


  let initializeSDK = async function() {
    cashfree = await load({
      mode: "sandbox",
    })
  }

  initializeSDK();

  const [orderId, setOrderId] = useState("");

  const getSessionId = async () => {
    try {
      let res = await axios.get("http://localhost:5000/payment");

      if (res.data && res.data.payment_session_id) {

        console.log(res.data);

        setOrderId(res.data.order_id)

        return res.data.payment_session_id
      }
    } catch (error) { 
      console.log(error);
    }
  }


  const verifyPayment = async (e) => {
    try {
      
      let res = await axios.post("http://localhost:5000/verify", {
        orderId: orderId
      })

      if (res && res.data ) {
        
        alert("Payment Verified!");
      }

    } catch (error) {
      console.log(error)
    }
  }

  const handleClick = async (e) => {
    e.preventDefault()
    try {

      let sessionId = await getSessionId();


      let checkoutOption = {
        paymentSessionId : sessionId,
        redirectTarget: "_modal",
      }

      cashfree.checkout(checkoutOption).then((res) =>{
        console.log("Payment Initialized")

        verifyPayment(orderId)
      })

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <h1>Cashfree Payment Test</h1>
      <div className="card">
        <button onClick={handleClick}>
          Pay Now
        </button>
      </div>
    </>
  )
}

export default App
