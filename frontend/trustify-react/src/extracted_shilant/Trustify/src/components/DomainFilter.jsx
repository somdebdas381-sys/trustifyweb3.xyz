const DOMAINS = [
  "Web Development",
  "UI/UX Design",
  "Blockchain Development",
  "Mobile App Development",
  "SEO / Marketing",
  "Smart Contract Development",
];

export default function DomainFilter({ selectedDomains, onDomainChange }) {
  const toggleDomain = (domain) => {
    if (selectedDomains.includes(domain)) {
      onDomainChange(selectedDomains.filter(d => d !== domain));
    } else {
      onDomainChange([...selectedDomains, domain]);
    }
  };

  return (
    <div className="domain-filter">
      <h4>Filter by Domain</h4>
      <div className="domain-tags">
        {DOMAINS.map(domain => (
          <button
            key={domain}
            className={`domain-tag ${selectedDomains.includes(domain) ? 'active' : ''}`}
            onClick={() => toggleDomain(domain)}
          >
            {domain}
          </button>
        ))}
      </div>
    </div>
  );
}