import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import { useAccount } from "wagmi";
import { useBalance } from "wagmi";

function App() {
  const { address } = useAccount();
  const { data, isError, isLoading } = useBalance({
    addressOrName: address,
  });

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: 12,
        }}
      >
        <ConnectButton />
      </div>
      {data && (
        <div
          data-test="account"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 500,
          }}
        >
          <div>
            <h3>Account</h3>
            <div
              style={{
                backgroundColor: "#ccc",
                padding: 36,
                borderRadius: 5,
                display: "inlineBlock",
              }}
            >
              <div data-test="account-address">Address: {address}</div>
              <br />
              <br />
              <div data-test="account-balance">
                Balance: {data?.formatted} {data?.symbol}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
