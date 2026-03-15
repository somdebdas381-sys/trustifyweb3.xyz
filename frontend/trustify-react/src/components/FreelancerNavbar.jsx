import { shortenAddress } from "../utils/contract";

export default function FreelancerNavbar({ walletAddress, balance }) {
  const shortAddress = walletAddress ? shortenAddress(walletAddress) : "-";
  const formattedBalance = balance != null ? `${balance} ETH` : "-";

  return (
    <header className="navbar">
      <div className="brand">
        <div>
          <div className="brand-name">Trustify</div>
          <div className="brand-subtitle">Freelancer Dashboard</div>
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