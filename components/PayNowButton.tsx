import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";

// This value is from the props in the UI
const style = {};

function createOrder() {
  // replace this url with your server
  return fetch(
    "https://react-paypal-js-storybook.fly.dev/api/paypal/create-order",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // use the "body" param to optionally pass additional order information
      // like product ids and quantities
      body: JSON.stringify({
        cart: [
          {
            sku: "1blwyeo8",
            quantity: 2,
          },
        ],
      }),
    }
  )
    .then((response) => response.json())
    .then((order) => {
      // Your code here after create the order
      return order.id;
    });
}
function onApprove() {
  // replace this url with your server
  return fetch(
    "https://react-paypal-js-storybook.fly.dev/api/paypal/capture-order",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }
  )
    .then((response) => response.json())
    .then(() => {
      // Your code here after capture the order
    });
}

// Custom component to wrap the PayPalButtons and show loading spinner

const ButtonWrapper = () => {
  const [{ isPending }] = usePayPalScriptReducer();

  return (
    <>
      {isPending && <div className="spinner" />}
      <PayPalButtons
        style={style}
        disabled={false}
        forceReRender={[style]}
        fundingSource={undefined}
        createOrder={createOrder}
        onApprove={onApprove}
      />
    </>
  );
};

export default function PayNowButton() {
  return (
    <div style={{ width: "100%" }}>
      <div style={{ maxWidth: "200px", minHeight: "200px", margin: "auto" }}>
        <PayPalScriptProvider
          options={{
            clientId:
              "AfljowAr19UIibIt7qGFLTqKyMgk5g0YmS9WvCJyDdiEeBnbmZSXzapeHaqX8FwZS7JJ4EMmxdBVJNvi",
            components: "buttons",
            currency: "USD",
          }}
        >
          <ButtonWrapper />
        </PayPalScriptProvider>
      </div>
    </div>
  );
}
