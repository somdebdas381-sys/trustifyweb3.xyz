import { useMemo, useState, useContext } from "react";
import Navbar from "../components/Navbar";
import ContractCard from "../components/ContractCard";
import { ContractContext } from "../context/ContractContext";
import "../dashboard-theme.css";

function CreateContractModal({ onClose, onCreate, walletAddress }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <header>
          <h3>Create Magic Contract</h3>
          <button className="close" onClick={onClose}>
            ✕
          </button>
        </header>

        <p className="modal-hint" style={{ fontSize: '0.85rem', color: '#bdc3c7', marginBottom: '1.5rem' }}>
          This will create a secure escrow on the blockchain using your connected wallet as the client.
        </p>

        <div className="input-group">
          <label>Project Title</label>
          <input
            value={title}
            placeholder="e.g. Website Development"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Budget (ETH)</label>
          <input
            value={amount}
            type="number"
            step="0.01"
            placeholder="0.1"
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <button
          disabled={!title || !amount || parseFloat(amount) <= 0}
          className="btn-primary"
          style={{ width: '100%', marginTop: '1rem' }}
          onClick={() => {
            onCreate({
              title,
              amount,
            });
            onClose();
          }}
        >
          {(!title || !amount) ? "Fill Details" : `Deploy for ${amount} ETH`}
        </button>
      </div>
    </div>
  );
}

export default function ClientDashboard() {
  // Connect to shared ContractContext
  const { contracts, account: wallet, balance, addContract, updateContractStatus, assignFreelancer } = useContext(ContractContext);

  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [transaction, setTransaction] = useState(null);

  const myContracts = useMemo(() => {
    // Only show jobs where I am the client
    return contracts.filter(
      (c) => c.client?.toLowerCase() === wallet?.toLowerCase()
    );
  }, [contracts, wallet]);

  const availableContracts = useMemo(() => {
    // Show jobs with no freelancer that aren't mine
    return contracts.filter((c) => !c.freelancer && c.client?.toLowerCase() !== wallet?.toLowerCase());
  }, [contracts, wallet]);

  const jobsWaitingForRelease = useMemo(() => {
    return myContracts.filter(c => c.status === "Completed").length;
  }, [myContracts]);

  const handleAction = async ({ contract, action }) => {
    try {
      setTransaction({ contractId: contract.id, status: "Processing..." });
      setLoading(true);

      if (action === "accept") {
        await assignFreelancer(contract.id);
      } else if (action === "release") {
        await updateContractStatus(contract.id, "release");
      } else if (action === "complete") {
        await updateContractStatus(contract.id, "complete");
      } else {
        console.warn("Action not implemented:", action);
      }

      setTransaction({ contractId: contract.id, status: "Done" });
    } catch (error) {
      console.error("Action failed:", error);
      const errorMessage = error.reason || error.message || "Unknown error";
      setTransaction({ contractId: contract.id, status: `Failed: ${errorMessage}` });
    } finally {
      setTimeout(() => {
        setTransaction(null);
        setLoading(false);
      }, 2000);
    }
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

          {jobsWaitingForRelease > 0 && (
            <div className="hint-banner" style={{ background: 'rgba(230, 126, 34, 0.15)', borderLeft: '4px solid #e67e22', color: '#e67e22', fontWeight: 'bold' }}>
              📢 You have {jobsWaitingForRelease} completed job(s) waiting for you to release payment!
            </div>
          )}

          {loading && transaction ? (
            <div className={`status-line ${transaction.status.includes('Failed') ? 'status-error' : (transaction.status === 'Done' ? 'status-success' : 'status-loading')}`} style={{
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '10px',
              background: transaction.status.includes('Failed') ? '#c0392b' : (transaction.status === 'Done' ? '#27ae60' : '#2980b9'),
              color: 'white',
              fontWeight: 'bold'
            }}>
              {transaction.status === 'Done' ? 'Transaction Successful! ✅' : transaction.status}
            </div>
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
          walletAddress={wallet}
        />
      )}
    </div>
  );
}
