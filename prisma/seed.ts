import { PrismaPg } from "@prisma/adapter-pg";
import {
  AssetStatus,
  InquiryStatus,
  PrismaClient,
  UserRole,
  UserStatus,
} from "@prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL must be set before running the demo seed.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

const buyers = [
  {
    email: "ana.novak@northstarcapital.eu",
    name: "Ana Novak",
    company: "Northstar Capital",
    country: "PL",
    profile: {
      bio: "Acquisition lead focused on regulated payments and embedded finance platforms.",
      minBudget: "5000000",
      maxBudget: "35000000",
      preferredCountries: ["PL", "DE", "LT", "EE"],
      preferredIndustries: ["Payments", "Fintech SaaS", "Financial infrastructure"],
      preferredAssetTypes: ["Payment Institution", "SaaS platform"],
    },
  },
  {
    email: "marco.rossi@alpinedigital.it",
    name: "Marco Rossi",
    company: "Alpine Digital Group",
    country: "IT",
    profile: {
      bio: "Corporate development manager building a European financial software portfolio.",
      minBudget: "2000000",
      maxBudget: "18000000",
      preferredCountries: ["IT", "AT", "DE", "CY"],
      preferredIndustries: ["Banking software", "Regtech", "Finance SaaS"],
      preferredAssetTypes: ["Software company", "Technology business"],
    },
  },
  {
    email: "elena.petrescu@carpathianfund.ro",
    name: "Elena Petrescu",
    company: "Carpathian Growth Fund",
    country: "RO",
    profile: {
      bio: "Investor seeking founder-led financial infrastructure businesses with expansion potential.",
      minBudget: "3000000",
      maxBudget: "25000000",
      preferredCountries: ["RO", "BG", "HU", "PL"],
      preferredIndustries: ["Payments", "Fintech", "Business services"],
      preferredAssetTypes: ["Electronic Money Institution", "Payment processor"],
    },
  },
  {
    email: "jonas.lind@fjordventures.no",
    name: "Jonas Lind",
    company: "Fjord Ventures",
    country: "SE",
    profile: {
      bio: "Nordic buyer interested in compliance-led SaaS and digital asset infrastructure.",
      minBudget: "1000000",
      maxBudget: "12000000",
      preferredCountries: ["SE", "DK", "DE", "EE"],
      preferredIndustries: ["Regtech", "Crypto infrastructure", "SaaS"],
      preferredAssetTypes: ["SaaS platform", "Crypto business"],
    },
  },
  {
    email: "sophie.martin@hexagonadvisory.fr",
    name: "Sophie Martin",
    company: "Hexagon Advisory",
    country: "FR",
    profile: {
      bio: "Buy-side advisor representing strategic acquirers across European fintech markets.",
      minBudget: "7500000",
      maxBudget: "50000000",
      preferredCountries: ["FR", "BE", "LU", "DE"],
      preferredIndustries: ["Payments", "Banking technology", "Insurance technology"],
      preferredAssetTypes: ["Payment Institution", "Software company"],
    },
  },
  {
    email: "david.cohen@meridianholdings.co.uk",
    name: "David Cohen",
    company: "Meridian Holdings",
    country: "GB",
    profile: {
      bio: "Family office investor looking for licensed platforms with recurring revenue.",
      minBudget: "10000000",
      maxBudget: "70000000",
      preferredCountries: ["GB", "IE", "MT", "CY"],
      preferredIndustries: ["Payments", "Digital assets", "Finance SaaS"],
      preferredAssetTypes: ["Electronic Money Institution", "Crypto business"],
    },
  },
  {
    email: "ines.silva@atlanticpartners.pt",
    name: "Ines Silva",
    company: "Atlantic Partners",
    country: "PT",
    profile: {
      bio: "Operator-investor seeking small regulated businesses to scale in Iberia.",
      minBudget: "1500000",
      maxBudget: "10000000",
      preferredCountries: ["PT", "ES", "CY", "MT"],
      preferredIndustries: ["Payments", "Lending technology", "Compliance"],
      preferredAssetTypes: ["Payment Institution", "Fintech SaaS"],
    },
  },
  {
    email: "tomasz.wrona@vectorfin.pl",
    name: "Tomasz Wrona",
    company: "Vector Fin",
    country: "PL",
    profile: {
      bio: "Strategic buyer building a regional payments processing network.",
      minBudget: "4000000",
      maxBudget: "22000000",
      preferredCountries: ["PL", "CZ", "SK", "HU"],
      preferredIndustries: ["Payments", "Merchant services", "Fintech"],
      preferredAssetTypes: ["Payment processor", "Payment Institution"],
    },
  },
  {
    email: "clara.weber@rheintech.de",
    name: "Clara Weber",
    company: "RheinTech Ventures",
    country: "DE",
    profile: {
      bio: "Technology investor focused on B2B software serving regulated financial institutions.",
      minBudget: "2500000",
      maxBudget: "20000000",
      preferredCountries: ["DE", "AT", "CH", "NL"],
      preferredIndustries: ["Banking software", "Regtech", "Cybersecurity"],
      preferredAssetTypes: ["Software company", "SaaS platform"],
    },
  },
  {
    email: "nikos.papadopoulos@aegeanfund.gr",
    name: "Nikos Papadopoulos",
    company: "Aegean Fund",
    country: "GR",
    profile: {
      bio: "Private equity principal looking for licensed financial businesses in Southern Europe.",
      minBudget: "3000000",
      maxBudget: "16000000",
      preferredCountries: ["GR", "CY", "MT", "IT"],
      preferredIndustries: ["Payments", "Digital banking", "Financial services"],
      preferredAssetTypes: ["Electronic Money Institution", "Payment Institution"],
    },
  },
  {
    email: "laura.bianchi@pinnaclegrowth.ch",
    name: "Laura Bianchi",
    company: "Pinnacle Growth",
    country: "CH",
    profile: {
      bio: "Cross-border investor with a preference for profitable niche fintech platforms.",
      minBudget: "6000000",
      maxBudget: "40000000",
      preferredCountries: ["CH", "DE", "FR", "IT"],
      preferredIndustries: ["Fintech SaaS", "Wealth technology", "Payments"],
      preferredAssetTypes: ["SaaS platform", "Software company"],
    },
  },
  {
    email: "mikkel.hansen@bluebridge.dk",
    name: "Mikkel Hansen",
    company: "BlueBridge A/S",
    country: "DK",
    profile: {
      bio: "Strategic acquirer interested in compliance automation and payment operations.",
      minBudget: "1000000",
      maxBudget: "9000000",
      preferredCountries: ["DK", "SE", "NO", "FI"],
      preferredIndustries: ["Regtech", "Payments", "Workflow software"],
      preferredAssetTypes: ["SaaS platform", "Payment processor"],
    },
  },
  {
    email: "olga.kowalska@easternbridge.pl",
    name: "Olga Kowalska",
    company: "Eastern Bridge",
    country: "PL",
    profile: {
      bio: "Investment manager seeking scalable platforms serving Central European SMEs.",
      minBudget: "2000000",
      maxBudget: "14000000",
      preferredCountries: ["PL", "LT", "LV", "EE"],
      preferredIndustries: ["Payments", "Lending technology", "SME software"],
      preferredAssetTypes: ["Payment Institution", "Fintech SaaS"],
    },
  },
  {
    email: "andrei.ionescu@danubeadvisors.ro",
    name: "Andrei Ionescu",
    company: "Danube Advisors",
    country: "RO",
    profile: {
      bio: "M&A advisor sourcing regulated businesses for regional strategic buyers.",
      minBudget: "500000",
      maxBudget: "8000000",
      preferredCountries: ["RO", "BG", "GR", "HU"],
      preferredIndustries: ["Payments", "Regtech", "Financial infrastructure"],
      preferredAssetTypes: ["Payment Institution", "Software company"],
    },
  },
  {
    email: "emma.wilson@harbourcapital.ie",
    name: "Emma Wilson",
    company: "Harbour Capital",
    country: "IE",
    profile: {
      bio: "European growth investor targeting licensed businesses with clean compliance histories.",
      minBudget: "8000000",
      maxBudget: "45000000",
      preferredCountries: ["IE", "GB", "NL", "LU"],
      preferredIndustries: ["Payments", "Digital assets", "Banking software"],
      preferredAssetTypes: ["Electronic Money Institution", "Crypto business"],
    },
  },
];

const sellers = [
  { email: "martin.hughes@finwave.co.uk", name: "Martin Hughes", company: "FinWave Payments Ltd", country: "GB" },
  { email: "ruta.jankauskaite@balticpay.lt", name: "Ruta Jankauskaite", company: "BalticPay UAB", country: "LT" },
  { email: "lukas.schneider@rheincloud.de", name: "Lukas Schneider", company: "RheinCloud GmbH", country: "DE" },
  { email: "katrin.tamm@nordicledger.ee", name: "Katrin Tamm", company: "Nordic Ledger OÜ", country: "EE" },
  { email: "piotr.zielinski@vistaprocessing.pl", name: "Piotr Zielinski", company: "Vista Processing Sp. z o.o.", country: "PL" },
  { email: "anna.gruber@alpenstack.at", name: "Anna Gruber", company: "AlpenStack GmbH", country: "AT" },
  { email: "maria.georgiou@medfin.cy", name: "Maria Georgiou", company: "MedFin Services Ltd", country: "CY" },
  { email: "josef.auer@harbourlabs.mt", name: "Josef Auer", company: "Harbour Labs Ltd", country: "MT" },
];

const assets = [
  { sellerEmail: sellers[0].email, title: "UK Electronic Money Institution", description: "Authorised EMI with passporting history, established compliance team, and a merchant acquiring book ready for strategic integration.", askingPrice: "18500000", currency: "GBP", country: "GB", businessType: "Electronic money institution", assetType: "Regulated fintech", licenseType: "Electronic Money Institution", regulator: "FCA", businessStatus: "Operating and profitable", employees: 42, foundedYear: 2016, annualRevenue: "6200000", benefits: ["FCA authorisation", "EEA passporting history", "Merchant portfolio"], status: AssetStatus.ACTIVE },
  { sellerEmail: sellers[0].email, title: "London B2B Payment Gateway", description: "B2B gateway serving software marketplaces and professional services firms with recurring processing volume.", askingPrice: "7200000", currency: "GBP", country: "GB", businessType: "Payment gateway", assetType: "Payment processor", licenseType: "Payment Services", regulator: "FCA", businessStatus: "Operating", employees: 18, foundedYear: 2019, annualRevenue: "2400000", benefits: ["Recurring SaaS-linked revenue", "API integrations", "Low customer concentration"], status: AssetStatus.ACTIVE },
  { sellerEmail: sellers[0].email, title: "UK Compliance SaaS Carve-out", description: "Standalone transaction monitoring and onboarding workflow product being divested by a larger financial group.", askingPrice: "3900000", currency: "GBP", country: "GB", businessType: "Compliance software", assetType: "SaaS platform", licenseType: null, regulator: null, businessStatus: "Carve-out", employees: 12, foundedYear: 2021, annualRevenue: "1300000", benefits: ["Enterprise customer contracts", "Cloud-native stack", "Clear carve-out perimeter"], status: AssetStatus.DRAFT },
  { sellerEmail: sellers[1].email, title: "Lithuanian Payment Institution", description: "Small PI with strong SME customer base, open banking connections, and an experienced local operations function.", askingPrice: "4600000", currency: "EUR", country: "LT", businessType: "Payment institution", assetType: "Regulated fintech", licenseType: "Payment Institution", regulator: "Bank of Lithuania", businessStatus: "Operating", employees: 21, foundedYear: 2018, annualRevenue: "1800000", benefits: ["EU passporting", "Open banking connectivity", "SME customer base"], status: AssetStatus.ACTIVE },
  { sellerEmail: sellers[1].email, title: "Baltic Embedded Finance Platform", description: "White-label account and card infrastructure for vertical SaaS providers across the Baltics.", askingPrice: "8800000", currency: "EUR", country: "LT", businessType: "Embedded finance", assetType: "Fintech SaaS", licenseType: "Payment Institution partnership", regulator: "Bank of Lithuania", businessStatus: "Scaling", employees: 34, foundedYear: 2020, annualRevenue: "3100000", benefits: ["Embedded finance APIs", "Banking-as-a-service partners", "Multi-country pipeline"], status: AssetStatus.ACTIVE },
  { sellerEmail: sellers[1].email, title: "Vilnius Merchant Acquiring Portfolio", description: "Portfolio of Baltic e-commerce merchants with stable processing history and low chargeback levels.", askingPrice: "2100000", currency: "EUR", country: "LT", businessType: "Merchant acquiring", assetType: "Customer portfolio", licenseType: null, regulator: null, businessStatus: "Portfolio sale", employees: 5, foundedYear: 2017, annualRevenue: "950000", benefits: ["Stable merchant volume", "Low churn", "Operational handover available"], status: AssetStatus.SOLD },
  { sellerEmail: sellers[2].email, title: "German Fintech SaaS", description: "Cloud platform automating treasury reconciliation and cash forecasting for mid-market businesses.", askingPrice: "12500000", currency: "EUR", country: "DE", businessType: "Financial software", assetType: "SaaS platform", licenseType: null, regulator: null, businessStatus: "Operating and growing", employees: 58, foundedYear: 2015, annualRevenue: "5400000", benefits: ["Recurring subscription revenue", "German enterprise references", "Strong retention"], status: AssetStatus.ACTIVE },
  { sellerEmail: sellers[2].email, title: "Frankfurt Banking Software Unit", description: "Modular KYC and account servicing software with long-term contracts at regional banks.", askingPrice: "19800000", currency: "EUR", country: "DE", businessType: "Banking software", assetType: "Software company", licenseType: null, regulator: "BaFin customer environment", businessStatus: "Strategic divestment", employees: 76, foundedYear: 2012, annualRevenue: "9700000", benefits: ["Banking clients", "Deep domain IP", "Experienced delivery team"], status: AssetStatus.ACTIVE },
  { sellerEmail: sellers[2].email, title: "German Regtech Product", description: "Regulatory reporting and audit trail platform for payment institutions and investment firms.", askingPrice: "5600000", currency: "EUR", country: "DE", businessType: "Regtech", assetType: "SaaS platform", licenseType: null, regulator: null, businessStatus: "Operating", employees: 27, foundedYear: 2018, annualRevenue: "2200000", benefits: ["Regulatory content library", "High switching costs", "Subscription contracts"], status: AssetStatus.DRAFT },
  { sellerEmail: sellers[3].email, title: "Estonian Crypto Business", description: "Operating digital asset brokerage with EU compliance framework and institutional client pipeline.", askingPrice: "9300000", currency: "EUR", country: "EE", businessType: "Digital asset services", assetType: "Crypto business", licenseType: "Virtual asset service provider", regulator: "FIU Estonia", businessStatus: "Operating", employees: 29, foundedYear: 2019, annualRevenue: "3700000", benefits: ["Institutional pipeline", "AML framework", "Trading technology"], status: AssetStatus.ACTIVE },
  { sellerEmail: sellers[3].email, title: "Tallinn Digital Asset Custody Platform", description: "Technology and operating processes for institutional custody and settlement of digital assets.", askingPrice: "6400000", currency: "EUR", country: "EE", businessType: "Digital asset infrastructure", assetType: "Technology business", licenseType: "Virtual asset service provider", regulator: "FIU Estonia", businessStatus: "Paused for strategic review", employees: 16, foundedYear: 2021, annualRevenue: "1400000", benefits: ["Custody workflows", "Institutional-grade controls", "Technology transfer"], status: AssetStatus.SUSPENDED },
  { sellerEmail: sellers[3].email, title: "Estonian Compliance Analytics SaaS", description: "Risk scoring and transaction analytics software used by fintech compliance departments.", askingPrice: "2800000", currency: "EUR", country: "EE", businessType: "Compliance software", assetType: "SaaS platform", licenseType: null, regulator: null, businessStatus: "Operating", employees: 11, foundedYear: 2022, annualRevenue: "820000", benefits: ["Machine-assisted monitoring", "API-first architecture", "Fintech customer base"], status: AssetStatus.ACTIVE },
  { sellerEmail: sellers[4].email, title: "Polish Payment Processor", description: "Licensed processor focused on subscription merchants and online marketplaces in Central Europe.", askingPrice: "11600000", currency: "EUR", country: "PL", businessType: "Payment processing", assetType: "Payment processor", licenseType: "Payment Services", regulator: "KNF", businessStatus: "Operating and profitable", employees: 47, foundedYear: 2014, annualRevenue: "6800000", benefits: ["Central European reach", "Subscription merchants", "Scalable processing stack"], status: AssetStatus.ACTIVE },
  { sellerEmail: sellers[4].email, title: "Warsaw SME Lending Platform", description: "Technology and servicing platform for invoice finance and working capital products for SMEs.", askingPrice: "7600000", currency: "EUR", country: "PL", businessType: "Lending technology", assetType: "Fintech SaaS", licenseType: "Lending intermediary", regulator: "KNF registered partners", businessStatus: "Operating", employees: 31, foundedYear: 2017, annualRevenue: "2900000", benefits: ["Origination engine", "SME data partnerships", "Servicing team"], status: AssetStatus.ACTIVE },
  { sellerEmail: sellers[4].email, title: "Krakow Fraud Prevention Unit", description: "Fraud decisioning product and customer contracts available as a standalone business unit.", askingPrice: "3400000", currency: "EUR", country: "PL", businessType: "Fraud prevention", assetType: "Software company", licenseType: null, regulator: null, businessStatus: "Carve-out preparation", employees: 19, foundedYear: 2020, annualRevenue: "1100000", benefits: ["Decisioning models", "Banking integrations", "Standalone team"], status: AssetStatus.DRAFT },
  { sellerEmail: sellers[5].email, title: "Austrian Finance SaaS", description: "Finance operations and invoice automation suite serving DACH professional services companies.", askingPrice: "4800000", currency: "EUR", country: "AT", businessType: "Financial software", assetType: "SaaS platform", licenseType: null, regulator: null, businessStatus: "Operating", employees: 23, foundedYear: 2016, annualRevenue: "2100000", benefits: ["DACH customer base", "High gross margin", "Partner channel"], status: AssetStatus.ACTIVE },
  { sellerEmail: sellers[5].email, title: "Vienna KYC Technology Business", description: "Identity verification and corporate onboarding technology with integrations into regional banks.", askingPrice: "6900000", currency: "EUR", country: "AT", businessType: "Identity technology", assetType: "Technology business", licenseType: null, regulator: null, businessStatus: "Operating", employees: 26, foundedYear: 2018, annualRevenue: "2600000", benefits: ["KYC workflows", "Bank integrations", "Recurring contracts"], status: AssetStatus.ACTIVE },
  { sellerEmail: sellers[5].email, title: "Austrian Payments Consultancy", description: "Specialist compliance and payments implementation consultancy with transferable client relationships.", askingPrice: "1300000", currency: "EUR", country: "AT", businessType: "Payments consultancy", assetType: "Services business", licenseType: null, regulator: null, businessStatus: "Owner succession", employees: 9, foundedYear: 2011, annualRevenue: "980000", benefits: ["Long-term clients", "Specialist expertise", "Succession support"], status: AssetStatus.SOLD },
  { sellerEmail: sellers[6].email, title: "Cyprus EMI", description: "Cyprus-based EMI with card programme experience and a lean compliance and operations team.", askingPrice: "8200000", currency: "EUR", country: "CY", businessType: "Electronic money institution", assetType: "Regulated fintech", licenseType: "Electronic Money Institution", regulator: "Central Bank of Cyprus", businessStatus: "Operating", employees: 24, foundedYear: 2017, annualRevenue: "2700000", benefits: ["EU authorisation", "Card programme history", "Lean operating model"], status: AssetStatus.ACTIVE },
  { sellerEmail: sellers[6].email, title: "Limassol Corporate Services Platform", description: "Regulated corporate services and onboarding workflow platform serving international businesses.", askingPrice: "2500000", currency: "EUR", country: "CY", businessType: "Corporate services technology", assetType: "Fintech SaaS", licenseType: "Administrative services", regulator: "CySEC ecosystem", businessStatus: "Operating", employees: 14, foundedYear: 2019, annualRevenue: "1200000", benefits: ["International client base", "Workflow automation", "Cross-sell potential"], status: AssetStatus.ACTIVE },
  { sellerEmail: sellers[6].email, title: "Cyprus Payment Gateway Portfolio", description: "Merchant portfolio and gateway technology focused on travel and digital services merchants.", askingPrice: "1700000", currency: "EUR", country: "CY", businessType: "Payment gateway", assetType: "Customer portfolio", licenseType: null, regulator: null, businessStatus: "Portfolio sale", employees: 6, foundedYear: 2020, annualRevenue: "730000", benefits: ["Travel merchant segment", "Gateway technology", "Transition assistance"], status: AssetStatus.SOLD },
  { sellerEmail: sellers[7].email, title: "Malta Crypto Business", description: "Digital asset services business with established banking relationships and a compliance-first operating model.", askingPrice: "7400000", currency: "EUR", country: "MT", businessType: "Digital asset services", assetType: "Crypto business", licenseType: "Virtual financial asset services", regulator: "MFSA", businessStatus: "Operating", employees: 22, foundedYear: 2018, annualRevenue: "3100000", benefits: ["MFSA framework", "Banking relationships", "EU customer base"], status: AssetStatus.ACTIVE },
  { sellerEmail: sellers[7].email, title: "Valletta Fund Administration SaaS", description: "Back-office and reporting platform for alternative investment managers and fund administrators.", askingPrice: "3600000", currency: "EUR", country: "MT", businessType: "Fund technology", assetType: "SaaS platform", licenseType: null, regulator: "MFSA customer environment", businessStatus: "Operating", employees: 17, foundedYear: 2016, annualRevenue: "1500000", benefits: ["Fund administrator customers", "Reporting automation", "Recurring revenue"], status: AssetStatus.ACTIVE },
  { sellerEmail: sellers[7].email, title: "Malta VFA Compliance Practice", description: "Boutique virtual financial asset compliance practice with a transferable client book and templates.", askingPrice: "900000", currency: "EUR", country: "MT", businessType: "Compliance consultancy", assetType: "Services business", licenseType: "VFA agent services", regulator: "MFSA", businessStatus: "Owner succession", employees: 7, foundedYear: 2019, annualRevenue: "620000", benefits: ["Specialist team", "Client relationships", "Practical compliance library"], status: AssetStatus.DRAFT },
  { sellerEmail: sellers[2].email, title: "European Banking Software Company", description: "Core banking integration and payments orchestration vendor with a strong pipeline among challenger banks.", askingPrice: "23500000", currency: "EUR", country: "DE", businessType: "Banking software", assetType: "Software company", licenseType: null, regulator: "BaFin customer environment", businessStatus: "Operating and growing", employees: 94, foundedYear: 2010, annualRevenue: "12800000", benefits: ["Core banking integrations", "Challenger bank pipeline", "Engineering depth"], status: AssetStatus.ACTIVE },
  { sellerEmail: sellers[1].email, title: "Baltic Open Banking API Business", description: "Account information and payment initiation APIs with live connections across Northern Europe.", askingPrice: "5100000", currency: "EUR", country: "LT", businessType: "Open banking", assetType: "Technology business", licenseType: "Payment Institution partnership", regulator: "Bank of Lithuania", businessStatus: "Operating", employees: 20, foundedYear: 2021, annualRevenue: "1900000", benefits: ["API connectivity", "Developer adoption", "Northern Europe coverage"], status: AssetStatus.ACTIVE },
];

const inquiries = [
  { senderEmail: buyers[0].email, receiverEmail: sellers[0].email, assetTitle: assets[0].title, message: "Please share the latest authorisation scope and the split between UK and EEA processing volume.", status: InquiryStatus.NEW },
  { senderEmail: buyers[3].email, receiverEmail: sellers[3].email, assetTitle: assets[9].title, message: "We would like to understand the institutional pipeline and the current compliance team structure.", status: InquiryStatus.READ },
  { senderEmail: buyers[5].email, receiverEmail: sellers[1].email, assetTitle: assets[4].title, message: "Could you provide more detail on the embedded finance partner agreements and key concentration metrics?", status: InquiryStatus.NEW },
  { senderEmail: buyers[8].email, receiverEmail: sellers[2].email, assetTitle: assets[6].title, message: "The reconciliation platform looks relevant to our portfolio. Is the product available as a standalone transaction?", status: InquiryStatus.READ },
  { senderEmail: buyers[9].email, receiverEmail: sellers[4].email, assetTitle: assets[12].title, message: "Please confirm the processor's current scheme memberships and geographic revenue split.", status: InquiryStatus.NEW },
  { senderEmail: buyers[11].email, receiverEmail: sellers[5].email, assetTitle: assets[16].title, message: "We are interested in the DACH customer base and would appreciate a high-level retention overview.", status: InquiryStatus.CLOSED },
  { senderEmail: sellers[6].email, receiverEmail: buyers[6].email, assetTitle: assets[19].title, message: "We noticed your interest in Southern European regulated businesses. Would you like an introductory call?", status: InquiryStatus.NEW },
  { senderEmail: sellers[7].email, receiverEmail: buyers[13].email, assetTitle: assets[22].title, message: "Our VFA business may fit your mandate; we can share a non-confidential overview under NDA.", status: InquiryStatus.READ },
  { senderEmail: buyers[2].email, receiverEmail: sellers[4].email, assetTitle: assets[14].title, message: "Could you outline the servicing model and current invoice finance origination volumes?", status: InquiryStatus.NEW },
  { senderEmail: buyers[14].email, receiverEmail: sellers[7].email, assetTitle: assets[21].title, message: "Please share the current banking partner setup and the scope of the Malta VFA services.", status: InquiryStatus.CLOSED },
];

async function main() {
  const buyerIds = new Map<string, string>();
  const sellerIds = new Map<string, string>();
  const assetIds = new Map<string, string>();

  try {
    await prisma.inquiry.deleteMany();
    await prisma.asset.deleteMany();
    await prisma.buyerProfile.deleteMany();
    await prisma.user.deleteMany();

    for (const buyer of buyers) {
      const user = await prisma.user.create({
        data: {
          email: buyer.email,
          name: buyer.name,
          company: buyer.company,
          country: buyer.country,
          role: UserRole.BUYER,
          status: UserStatus.ACTIVE,
          buyerProfile: { create: buyer.profile },
        },
      });
      buyerIds.set(buyer.email, user.id);
    }

    for (const seller of sellers) {
      const user = await prisma.user.create({
        data: {
          email: seller.email,
          name: seller.name,
          company: seller.company,
          country: seller.country,
          role: UserRole.SELLER,
          status: UserStatus.ACTIVE,
        },
      });
      sellerIds.set(seller.email, user.id);
    }

    await prisma.user.create({
      data: {
        email: "manager@n5deal.eu",
        name: "N5Deal Platform Manager",
        company: "N5Deal",
        country: "NL",
        role: UserRole.MANAGER,
        status: UserStatus.ACTIVE,
      },
    });

    for (const asset of assets) {
      const createdAsset = await prisma.asset.create({
        data: {
          title: asset.title,
          description: asset.description,
          askingPrice: asset.askingPrice,
          currency: asset.currency,
          country: asset.country,
          businessType: asset.businessType,
          assetType: asset.assetType,
          licenseType: asset.licenseType,
          regulator: asset.regulator,
          businessStatus: asset.businessStatus,
          employees: asset.employees,
          foundedYear: asset.foundedYear,
          annualRevenue: asset.annualRevenue,
          benefits: asset.benefits,
          status: asset.status,
          seller: { connect: { id: sellerIds.get(asset.sellerEmail) } },
        },
      });
      assetIds.set(asset.title, createdAsset.id);
    }

    for (const inquiry of inquiries) {
      await prisma.inquiry.create({
        data: {
          message: inquiry.message,
          status: inquiry.status,
          sender: { connect: { id: buyerIds.get(inquiry.senderEmail) ?? sellerIds.get(inquiry.senderEmail) } },
          receiver: { connect: { id: buyerIds.get(inquiry.receiverEmail) ?? sellerIds.get(inquiry.receiverEmail) } },
          asset: inquiry.assetTitle ? { connect: { id: assetIds.get(inquiry.assetTitle) } } : undefined,
        },
      });
    }

    console.log(`Seeded ${buyers.length} buyers, ${sellers.length} sellers, ${assets.length} assets, and ${inquiries.length} inquiries.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
