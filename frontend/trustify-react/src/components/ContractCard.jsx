import { shortenAddress } from "../utils/contract";

const STATUS_CLASS = {
  Pending: "pending",
  Funded: "funded",
  Completed: "completed",
  Paid: "paid",
};

export default function ContractCard({ contract, wallet, onAction, isFreelancerView = false }) {
  const isClient = wallet && wallet.toLowerCase() === contract.client?.toLowerCase();
  const isFreelancer =
    wallet && wallet.toLowerCase() === contract.freelancer?.toLowerCase();

  const statusClass = STATUS_CLASS[contract.status] || "pending";
  const statusText = contract.status || "Pending";

  const handle = (action) => {
    if (typeof onAction === "function") {
      onAction({ contract, action });
    }
  };

  return (
    <div className="contract-card">
      <div className="row">
        <h3>{contract.title}</h3>
        <span className={`badge ${statusClass}`}>{statusText}</span>
      </div>

      <div className="row">
        <p>
          <strong>Client:</strong> {shortenAddress(contract.client)}
        </p>
        {isFreelancerView && (
          <p>
            <strong>Domain:</strong> {contract.domain}
          </p>
        )}
      </div>

      <div className="row">
        <p>
          <strong>Budget:</strong> {contract.amount} ETH
        </p>
        {isFreelancerView && contract.freelancer && (
          <p>
            <strong>Deadline:</strong> {contract.deadline}
          </p>
        )}
        {isFreelancerView && !contract.freelancer && (
          <p>
            <strong>Duration:</strong> {contract.duration}
          </p>
        )}
      </div>

      <div className="actions">
        {isFreelancerView ? (
          <>
            {isFreelancer && contract.status === "Pending" && (
              <button onClick={() => handle("complete")}>Mark Complete</button>
            )}
            {isFreelancer && contract.status === "Completed" && (
              <div className="text-muted">Awaiting payment</div>
            )}
            {isFreelancer && contract.status === "Paid" && (
              <div className="text-muted">Payment received</div>
            )}
            {!contract.freelancer && (
              <button onClick={() => handle("accept")}>Accept Contract</button>
            )}
            <button onClick={() => handle("view")}>View Details</button>
          </>
        ) : (
          <>
            {isClient && (
              <>
                <button onClick={() => handle("deposit")}>Deposit</button>
                <button onClick={() => handle("release")}>Release Payment</button>
                <button onClick={() => handle("refund")}>Refund</button>
              </>
            )}

            {isFreelancer && (
              <button onClick={() => handle("complete")}>Mark Complete</button>
            )}

            {!isClient && !isFreelancer && !contract.freelancer && (
              <button onClick={() => handle("accept")}>Accept Job</button>
            )}

            {!isClient && !isFreelancer && contract.freelancer && (
              <div className="text-muted">No actions available</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
