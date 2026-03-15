export function shortenAddress(address = "") {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function buildFakeContracts() {
  return [
    {
      id: "c1",
      title: "Website Design",
      client: "0x72fa23e4c3b5A1dE91Ac",
      freelancer: "0x92ab8f78d4b6E3a67De",
      amount: "0.1",
      status: "Pending",
      domain: "Web Development",
      deadline: "2026-04-15",
      duration: "2 weeks",
    },
    {
      id: "c2",
      title: "Logo Design",
      client: "0x72fa23e4c3b5A1dE91Ac",
      freelancer: null,
      amount: "0.05",
      status: "Funded",
      domain: "UI/UX Design",
      deadline: "2026-03-20",
      duration: "1 week",
    },
    {
      id: "c3",
      title: "Mobile App UX",
      client: "0x6f1aA7b3c2D2e0F9b4Cd",
      freelancer: "0x72fa23e4c3b5A1dE91Ac",
      amount: "0.25",
      status: "Completed",
      domain: "Mobile App Development",
      deadline: "2026-05-01",
      duration: "3 weeks",
    },
    {
      id: "c4",
      title: "SEO Improvements",
      client: "0x72fa23e4c3b5A1dE91Ac",
      freelancer: "0xF4c4f0b2E3D4d1c2a6B7",
      amount: "0.08",
      status: "Paid",
      domain: "SEO / Marketing",
      deadline: "2026-03-25",
      duration: "1 week",
    },
    {
      id: "c5",
      title: "Smart Contract Audit",
      client: "0x8b2cD9e1F3a4B5c6D7e8",
      freelancer: null,
      amount: "0.5",
      status: "Pending",
      domain: "Smart Contract Development",
      deadline: "2026-04-30",
      duration: "2 weeks",
    },
    {
      id: "c6",
      title: "Blockchain Integration",
      client: "0x72fa23e4c3b5A1dE91Ac",
      freelancer: null,
      amount: "0.3",
      status: "Funded",
      domain: "Blockchain Development",
      deadline: "2026-05-10",
      duration: "4 weeks",
    },
  ];
}
