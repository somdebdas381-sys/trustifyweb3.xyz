import { useMemo, useState, useContext } from "react";
import Navbar from "../components/Navbar";
import ContractCard from "../components/ContractCard";
import { ContractContext } from "../context/ContractContext";
import "../dashboard-theme.css";

function CreateContractModal({ onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("Pending");
  const [client, setClient] = useState("");

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <header>
          <h3>Create Contract</h3>
          <button className="close" onClick={onClose}>
            ✕
          </button>
        </header>

        <div className="input-group">
          <label>Title</label>
          <input
            value={title}
            placeholder="Website Design"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Amount (ETH)</label>
          <input
            value={amount}
            type="number"
            placeholder="0.1"
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Client Address</label>
          <input
            value={client}
            placeholder="0x..."
            onChange={(e) => setClient(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>Pending</option>
            <option>Funded</option>
            <option>Completed</option>
            <option>Paid</option>
          </select>
        </div>

        <button
          disabled={!title || !amount || !client}
          onClick={() => {
            onCreate({
              id: `c-${Date.now()}`,
              title,
              amount,
              client,
              freelancer: null,
              status,
              domain: "Uncategorized",
              deadline: "TBD",
            });
            onClose();
          }}
        >
          Create
        </button>

        <p className="status-line">
          You can always edit this once the smart contract flow is wired.
        </p>
      </div>
    </div>
  );
}

export default function ClientDashboard() {
  const [wallet] = useState(localStorage.getItem('walletAddress') || "0x72fa23e4c3b5A1dE91Ac");
  const [balance] = useState("1.2");
  
  // Connect to shared ContractContext
  const { contracts, addContract, updateContractStatus, assignFreelancer } = useContext(ContractContext);
  
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [transaction, setTransaction] = useState(null);

  const myContracts = useMemo(() => {
    return contracts.filter(
      (c) =>
        c.client?.toLowerCase() === wallet.toLowerCase() ||
        c.freelancer?.toLowerCase() === wallet.toLowerCase()
    );
  }, [contracts, wallet]);

  const availableContracts = useMemo(() => {
    return contracts.filter((c) => !c.freelancer);
  }, [contracts]);

  const handleAction = async ({ contract, action }) => {
    setTransaction({ contractId: contract.id, status: "Processing..." });
    setLoading(true);

    // Simulate blockchain call
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (action === "accept") {
      updateContractStatus(contract.id, "Pending");
      assignFreelancer(contract.id, wallet);
    } else if (action === "deposit") {
      updateContractStatus(contract.id, "Funded");
    } else if (action === "release") {
      updateContractStatus(contract.id, "Paid");
    } else if (action === "refund") {
      updateContractStatus(contract.id, "Pending");
    } else if (action === "complete") {
      updateContractStatus(contract.id, "Completed");
    }

    setTransaction({ contractId: contract.id, status: "Done" });

    setTimeout(() => {
      setTransaction(null);
      setLoading(false);
    }, 1000);
  };

  const handleCreate = (newContract) => {
    addContract(newContract);
  };

  return (
    <div className="dashboard-layout">
      <Navbar walletAddress={wallet} balance={balance} />

      <main className="container">
        <section className="section">
          <div className="section-header">
            <h2>My Contracts</h2>
            <button onClick={() => setCreating(true)}>+ Create Contract</button>
          </div>

          {loading && transaction ? (
            <p className="status-line">
              {transaction.status} ({transaction.contractId})
            </p>
          ) : null}

          <div className="card-grid">
            {myContracts.length === 0 ? (
              <div className="card" style={{ padding: "1.5rem" }}>
                <p className="text-muted">
                  You have no active contracts yet. Create one, or accept a job
                  below.
                </p>
              </div>
            ) : (
              myContracts.map((contract) => (
                <ContractCard
                  key={contract.id}
                  contract={contract}
                  wallet={wallet}
                  onAction={handleAction}
                />
              ))
            )}
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <h2>Available Contracts</h2>
          </div>

          <div className="card-grid">
            {availableContracts.length === 0 ? (
              <div className="card" style={{ padding: "1.5rem" }}>
                <p className="text-muted">No open contracts at the moment.</p>
              </div>
            ) : (
              availableContracts.map((contract) => (
                <ContractCard
                  key={contract.id}
                  contract={contract}
                  wallet={wallet}
                  onAction={handleAction}
                />
              ))
            )}
          </div>
        </section>
      </main>

      {creating && (
        <CreateContractModal
          onClose={() => setCreating(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
