import { shortenAddress } from "../utils/contract";

export default function Navbar({ walletAddress, balance }) {
  const shortAddress = walletAddress ? shortenAddress(walletAddress) : "-";
  const formattedBalance = balance != null ? `${balance} ETH` : "-";

  return (
    <header className="navbar">
      <div className="brand">
        <span></span>
        <div>
          <div>Trustify</div>
          <div className="text-muted" style={{ fontSize: "0.85rem" }}>
            Dashboard
          </div>
        </div>
      </div>

      <div className="wallet">
        <div>
          <strong>Wallet:</strong> {shortAddress}
        </div>
        <div>
          <strong>Balance:</strong> {formattedBalance}
        </div>
      </div>
    </header>
  );
}
