import { useMemo, useState, useEffect, useRef, useContext } from "react";
import FreelancerNavbar from "../components/FreelancerNavbar";
import StatsCard from "../components/StatsCard";
import ContractCard from "../components/ContractCard";
import DomainFilter from "../components/DomainFilter";
import ActivityTimeline from "../components/ActivityTimeline";
import { ContractContext } from "../context/ContractContext";
import "../dashboard-theme.css";

const DOMAINS = [
  "Web Development",
  "UI/UX Design",
  "Blockchain Development",
  "Mobile App Development",
  "SEO / Marketing",
  "Smart Contract Development",
];

function FreelancerProfile({ wallet, balance, preferredDomains }) {
  return (
    <section className="section">
      <div className="profile-card">
        <h2>Freelancer Profile</h2>
        <div className="profile-info">
          <div className="profile-row">
            <span className="profile-label">Wallet Address:</span>
            <span className="profile-value">{wallet}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Balance:</span>
            <span className="profile-value">{balance} ETH</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Work Zone:</span>
            <span className="profile-value">
              {preferredDomains.length > 0 ? preferredDomains.join(", ") : "None selected"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkZoneSelector({ preferredDomains, onUpdateDomains }) {
  const toggleDomain = (domain) => {
    if (preferredDomains.includes(domain)) {
      onUpdateDomains(preferredDomains.filter(d => d !== domain));
    } else {
      onUpdateDomains([...preferredDomains, domain]);
    }
  };

  return (
    <section className="section">
      <div className="work-zone-card">
        <h2>Work Zone Selector</h2>
        <p className="text-muted">Select your preferred domains to help clients find you.</p>
        <div className="domain-tags">
          {DOMAINS.map(domain => (
            <button
              key={domain}
              className={`domain-tag ${preferredDomains.includes(domain) ? 'active' : ''}`}
              onClick={() => toggleDomain(domain)}
            >
              {domain}
            </button>
          ))}
        </div>
        <button className="update-zone-btn">Update Work Zone</button>
      </div>
    </section>
  );
}

export default function FreelancerDashboard() {
  const [preferredDomains, setPreferredDomains] = useState(["Web Development", "UI/UX Design"]);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Hook up to shared ContractContext
  const { contracts, account: wallet, balance, updateContractStatus, assignFreelancer } = useContext(ContractContext);

  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState(null);

  const [activities, setActivities] = useState([
    { icon: "🎉", description: "Welcome to Trustify! Start exploring contracts.", timestamp: new Date().toLocaleString() },
  ]);

  const prevContractsRef = useRef(contracts);

  useEffect(() => {
    const prevContracts = prevContractsRef.current;
    contracts.forEach((contract) => {
      const prevContract = prevContracts.find((c) => c.id === contract.id);
      if (prevContract && prevContract.status !== contract.status && contract.freelancer === wallet) {
        let activity = null;
        if (contract.status === "Funded") {
          activity = {
            icon: "💰",
            description: `Contract funded: ${contract.title} (${contract.amount} ETH)`,
            timestamp: new Date().toLocaleString(),
          };
        } else if (contract.status === "Paid") {
          activity = {
            icon: "💸",
            description: `Payment received: ${contract.title} (${contract.amount} ETH)`,
            timestamp: new Date().toLocaleString(),
          };
        }
        if (activity) {
          setActivities((prev) => [activity, ...prev.slice(0, 9)]); // Keep last 10
        }
      }
    });
    prevContractsRef.current = contracts;
  }, [contracts, wallet]);

  const filteredContracts = useMemo(() => {
    return contracts.filter(contract => {
      const matchesDomain = selectedDomains.length === 0 || selectedDomains.includes(contract.domain);
      const matchesSearch = contract.title.toLowerCase().includes(searchQuery.toLowerCase());
      const isNotMine = wallet && contract.client?.toLowerCase() !== wallet.toLowerCase();
      return matchesDomain && matchesSearch && !contract.freelancer && isNotMine;
    });
  }, [contracts, selectedDomains, searchQuery, wallet]);

  const myContracts = useMemo(() => {
    if (!wallet) return [];
    return contracts.filter(c => c.freelancer?.toLowerCase() === wallet.toLowerCase());
  }, [contracts, wallet]);

  // Calculate stats
  const activeContracts = myContracts.filter(c => c.status === "Pending" || c.status === "Funded").length;
  const completedContracts = myContracts.filter(c => c.status === "Completed" || c.status === "Paid").length;
  const inEscrow = myContracts
    .filter(c => c.status === "Funded" || c.status === "Completed")
    .reduce((sum, c) => sum + parseFloat(c.amount), 0);
  const totalEarnings = myContracts
    .filter(c => c.status === "Paid")
    .reduce((sum, c) => sum + parseFloat(c.amount), 0);
  const successRate = myContracts.length > 0 ? Math.round((completedContracts / myContracts.length) * 100) : 0;

  const handleAction = async ({ contract, action }) => {
    try {
      setTransaction({ contractId: contract.id, status: "Processing..." });
      setLoading(true);

      if (action === "accept") {
        await assignFreelancer(contract.id);
        // Add activity
        setActivities((prev) => [
          {
            icon: "📝",
            description: `Accepted contract: ${contract.title}`,
            timestamp: new Date().toLocaleString(),
          },
          ...prev,
        ]);
      } else if (action === "complete") {
        await updateContractStatus(contract.id, "complete");
        // Add activity
        setActivities((prev) => [
          {
            icon: "✅",
            description: `Marked work complete: ${contract.title}`,
            timestamp: new Date().toLocaleString(),
          },
          ...prev,
        ]);
      } else if (action === "view") {
        console.log("View details for", contract.id);
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

  const handleSearch = () => {
    // Search is already handled in useMemo
  };

  const handleExplore = () => {
    setSelectedDomains([]);
    setSearchQuery("");
  };

  return (
    <div className="dashboard-layout">
      <FreelancerNavbar walletAddress={wallet} balance={balance} contracts={contracts} />

      <main className="container">
        {/* Statistics Overview */}
        <section className="section">
          <div className="stats-grid">
            <StatsCard
              icon="📋"
              value={activeContracts}
              label="Active Contracts"
              gradient="gradient-blue"
            />
            <StatsCard
              icon="✅"
              value={completedContracts}
              label="Completed Contracts"
              gradient="gradient-green"
            />
            <StatsCard
              icon="⏳"
              value={`${inEscrow.toFixed(2)}`}
              label="Pending (In Escrow)"
              gradient="gradient-orange"
            />
            <StatsCard
              icon="💰"
              value={`${totalEarnings.toFixed(2)}`}
              label="Total Earnings (ETH)"
              gradient="gradient-purple"
            />
          </div>
        </section>

        <FreelancerProfile
          wallet={wallet}
          balance={balance}
          preferredDomains={preferredDomains}
        />

        <WorkZoneSelector
          preferredDomains={preferredDomains}
          onUpdateDomains={setPreferredDomains}
        />

        <section className="section">
          <div className="section-header">
            <h2>My Assigned Work</h2>
          </div>

          <div className="card-grid">
            {myContracts.length === 0 ? (
              <div className="empty-card">
                <p className="text-muted">
                  You have no assigned contracts yet. Start by accepting work from the available contracts below.
                </p>
              </div>
            ) : (
              myContracts.map((contract) => (
                <ContractCard
                  key={contract.id}
                  contract={contract}
                  wallet={wallet}
                  onAction={handleAction}
                  isFreelancerView={true}
                />
              ))
            )}
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <h2>Discover Contracts</h2>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button className="btn-primary" onClick={handleSearch}>Search Work</button>
              <button className="btn-secondary" onClick={handleExplore}>Explore Work</button>
            </div>
          </div>

          <DomainFilter
            selectedDomains={selectedDomains}
            onDomainChange={setSelectedDomains}
          />

          {contracts.some(c => c.client.toLowerCase() === wallet?.toLowerCase() && !c.freelancer) && (
            <div className="hint-banner" style={{ marginBottom: '1rem', padding: '0.8rem', background: 'rgba(231, 76, 60, 0.1)', borderRadius: '8px', borderLeft: '4px solid #e74c3c', fontSize: '0.9rem' }}>
              <strong>🔒 Note:</strong> I found <strong>{contracts.filter(c => c.client.toLowerCase() === wallet?.toLowerCase() && !c.freelancer).length} jobs</strong> created by this wallet. They are hidden here because you cannot work for yourself.
              <br />Switch to a <strong>different MetaMask account</strong> to see and accept them!
            </div>
          )}

          <div className="hint-banner" style={{ marginBottom: '1rem', padding: '0.8rem', background: 'rgba(52, 152, 219, 0.1)', borderRadius: '8px', borderLeft: '4px solid #3498db', fontSize: '0.9rem' }}>
            <strong>💡 Hint:</strong> To accept work, make sure you are <strong>not</strong> using the same wallet that created the job.
          </div>

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
            {filteredContracts.length === 0 ? (
              <div className="empty-card" style={{ padding: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                <p className="text-muted" style={{ fontSize: '1.1rem' }}>
                  No jobs found for this account.
                </p>
                <p style={{ color: '#bdc3c7', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  💡 <strong>Try this:</strong> Clear your filters (Click "Explore Work") or switch to a <strong>different MetaMask account</strong> to see jobs created by other people.
                </p>
              </div>
            ) : (
              filteredContracts.map((contract) => (
                <ContractCard
                  key={contract.id}
                  contract={contract}
                  wallet={wallet}
                  onAction={handleAction}
                  isFreelancerView={true}
                />
              ))
            )}
          </div>
        </section>

        <section className="section">
          <ActivityTimeline activities={activities} />
        </section>
      </main>
    </div>
  );
}