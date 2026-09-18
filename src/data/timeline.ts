import type { Period, PeriodId, TimelineStop } from "@/types/timeline";

export const periods: Period[] = [
  { id: "pre-commerce", label: "Pre Commerce", colorToken: "commerce-yellow", motifToken: "motif-yellow" },
  { id: "explosion", label: "Explosion", colorToken: "commerce-orange", motifToken: "motif-orange" },
  { id: "growth", label: "Growth Phase", colorToken: "commerce-dark-green", motifToken: "motif-dark-green" },
];

export const periodById = Object.fromEntries(periods.map((period) => [period.id, period])) as Record<PeriodId, Period>;

const cbnSource = {
  publisher: "Central Bank of Nigeria",
  title: "Payments System Supervision",
  url: "https://www.cbn.gov.ng/PaymentsSystem/",
};

const jumiaHistory = {
  publisher: "Jumia Group",
  title: "Jumia: Our story",
  url: "https://group.jumia.com/download/files/press/media-kit/Jumia_mediakit_2025.pdf",
};

const paystackHistory = {
  publisher: "Paystack",
  title: "About Paystack: Company milestones",
  url: "https://paystack.com/about",
};

export const timeline: TimelineStop[] = [
  {
    id: "early-years",
    label: "Early 90s / 2000s",
    period: "pre-commerce",
    headline: "The advent of GSM technology and mobile internet.",
    events: [
      {
        title: "Kenya",
        place: "Kenya · 2000",
        description: "Competition arrived in Kenya's mobile market in 2000. Cellular connections grew rapidly while fixed-line expansion remained slow.",
        source: {
          publisher: "International Telecommunication Union",
          title: "ICT Opportunity Index: Kenya telecom reform",
          url: "https://www.itu.int/ITU-D/ict/publications/dd/material/index_ict_opp.pdf",
        },
      },
      {
        title: "South Africa",
        place: "South Africa · 1993",
        description: "Vodacom and MTN received licences to operate GSM networks in 1993. Both launched commercial service in 1994.",
        source: {
          publisher: "South African Department of Communications and Digital Technologies",
          title: "Thirty years of the ICT industry in South Africa",
          url: "https://www.dcdt.gov.za/media-room/speeches/minister-s-speech/minister-s-archive/499-speech-by-minister-gungubele-during-the-30-year-celebration-of-the-ict-industry-in-south-africa.html",
        },
      },
      {
        title: "Nigeria",
        place: "Nigeria · 2001",
        description: "The NCC issues Digital Mobile Licences to Econet, MTN and NITEL's mobile arm in 2001, opening the way for GSM service.",
        source: {
          publisher: "Nigerian Communications Commission",
          title: "Spectrum Information Memorandum: 2001 Digital Mobile Licences",
          url: "https://ncc.gov.ng/sites/default/files/2024-11/Documents/3-5ghz-spectrum/Spectrum-3.5GHz_Spectrum_Information_Memorandum_Final.pdf",
        },
      },
    ],
  },
  {
    id: "2002",
    label: "2002",
    period: "pre-commerce",
    headline: "Interswitch is founded",
    events: [
      {
        title: "Interswitch is founded",
        place: "Nigeria · 2002",
        description: "Interswitch begins building shared electronic payments infrastructure for Nigerian banks and businesses.",
        source: {
          publisher: "Interswitch",
          title: "Interswitch founder and Nigeria's digital payments revolution",
          url: "https://interswitchgroup.com/news/newsletters/details/interswitch-founder-group-managing-director-mitchell-elegbe-receives/",
        },
      },
    ],
  },
  {
    id: "2006",
    label: "2006",
    period: "pre-commerce",
    headline: "Payments infrastructure develops",
    events: [
      {
        title: "National Central Switch established",
        place: "Nigeria · 2006",
        description: "The national switch connects payment providers so electronic transactions can move across institutions.",
        source: cbnSource,
      },
    ],
  },
  {
    id: "2007",
    label: "2007",
    period: "pre-commerce",
    headline: "M-PESA launches",
    events: [
      {
        title: "M-PESA launches in Kenya",
        place: "Kenya · 2007",
        description: "Safaricom launches a mobile money service that lets customers send and receive money using their phones.",
        source: {
          publisher: "Safaricom",
          title: "M-PESA: 17 years of transforming lives",
          url: "https://newsroom.safaricom.co.ke/innovation/m-pesa-17-years-of-transforming-lives/",
        },
      },
    ],
  },
  {
    id: "2009",
    label: "2009",
    period: "explosion",
    headline: "Mobile payment rules take shape",
    events: [
      {
        title: "Mobile Payment Regulatory Framework issued",
        place: "Nigeria · 2009",
        description: "The Central Bank sets out a framework for mobile payment services in Nigeria.",
        source: cbnSource,
      },
      {
        title: "Paga is founded",
        place: "Nigeria · 2009",
        description: "Paga begins developing a way for people and businesses to make payments beyond bank branches.",
        source: {
          publisher: "Paga",
          title: "Paga: A look back at 2018",
          url: "https://paga.blog/2019/01/31/a-look-back-2018-in-review-908249c8264c/",
        },
      },
    ],
  },
  {
    id: "2010",
    label: "2010",
    period: "explosion",
    headline: "Card payments gain a common standard",
    events: [
      {
        title: "Migration to EMV cards",
        place: "Nigeria · 2010",
        description: "Nigeria moves payment cards to the EMV chip standard to improve transaction security.",
        source: cbnSource,
      },
    ],
  },
  {
    id: "2011",
    label: "2011",
    period: "explosion",
    headline: "Cash-less policy introduced",
    events: [
      {
        title: "Central Bank introduces a cash-less policy",
        place: "Nigeria · 2011",
        description: "The policy encourages electronic payments and reduces reliance on physical cash for transactions.",
        source: {
          publisher: "Central Bank of Nigeria",
          title: "Payment Modes: Cashless Policy",
          url: "https://www.cbn.gov.ng/PaymentsSystem/modes.html",
        },
      },
    ],
  },
  {
    id: "2012",
    label: "2012",
    period: "explosion",
    headline: "Jumia and Konga Launch",
    events: [
      {
        title: "Jumia",
        place: "Nigeria · 2012",
        description: "Jumia was founded in Lagos, Nigeria in 2012 and soon expanded to Morocco, South Africa, and Egypt.",
        source: jumiaHistory,
      },
      {
        title: "Konga",
        place: "Nigeria · 2012",
        description: "Konga launched in Nigeria in July 2012 as an online retail platform.",
        source: {
          publisher: "Konga",
          title: "Konga Group: The Konga Story",
          url: "https://group.konga.com/timeline.html",
        },
      },
      {
        title: "Kopo Kopo starts serving merchants",
        place: "Kenya · 2012",
        description: "Small businesses gain another way to accept mobile money payments.",
        source: {
          publisher: "GSMA",
          title: "Kopo Kopo — Kenya",
          url: "https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-for-development/gsma_resources/kopo-kopo/",
        },
      },
    ],
  },
  {
    id: "2013",
    label: "2013",
    period: "explosion",
    headline: "Jumia expands across borders",
    events: [
      {
        title: "Jumia expands to Kenya and Côte d’Ivoire",
        place: "East and West Africa · 2013",
        description: "The online marketplace enters more African markets as its retail network grows beyond Nigeria.",
        source: jumiaHistory,
      },
      {
        title: "Moov Money launches in Côte d’Ivoire",
        place: "Côte d’Ivoire · 2013",
        description: "Moov becomes the country's third mobile network operator to offer mobile money.",
        source: {
          publisher: "GSMA",
          title: "Mobile money in Côte d’Ivoire: A turnaround story",
          url: "https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-for-development/programme/mobile-money/mobile-money-in-cote-divoire-a-turnaround-story/",
        },
      },
    ],
  },
  {
    id: "2014",
    label: "2014",
    period: "explosion",
    headline: "Black Friday arrives in Nigeria",
    events: [
      {
        title: "Jumia introduces Black Friday",
        place: "Nigeria · 2014",
        description: "The marketplace brings its annual discount campaign to Nigerian online shoppers.",
        source: jumiaHistory,
      },
      {
        title: "Mobile money networks connect",
        place: "Tanzania · 2014",
        description: "Tigo, Airtel and Zantel begin enabling transfers between their mobile wallets.",
        source: {
          publisher: "GSMA",
          title: "The impact of mobile money interoperability in Tanzania",
          url: "https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-for-development/programme/mobile-money/new-publication-explores-the-impact-of-mobile-money-interoperability-in-tanzania/",
        },
      },
    ],
  },
  {
    id: "2016",
    label: "2016",
    period: "explosion",
    headline: "Paystack opens to the public",
    events: [
      {
        title: "Paystack comes out of beta",
        place: "Nigeria · 2016",
        description: "Paystack opens its online payments service to more Nigerian businesses.",
        source: paystackHistory,
      },
      {
        title: "Flutterwave is founded",
        place: "Pan-African · 2016",
        description: "A new payments platform sets out to connect fragmented payment systems.",
        source: {
          publisher: "Flutterwave",
          title: "Flutterwave Closes USD $170m Funding",
          url: "https://flutterwave.com/us/blog/flutterwave-closes-usd-170m-funding",
        },
      },
    ],
  },
  {
    id: "2017",
    label: "2017",
    period: "growth",
    headline: "Paying with a bank account",
    events: [
      {
        title: "Paystack launches Pay with Bank",
        place: "Nigeria · 2017",
        description: "Customers can pay online directly from a bank account through Paystack's checkout.",
        source: paystackHistory,
      },
      {
        title: "Jumia introduces JumiaPay",
        place: "Multiple markets · 2017",
        description: "Jumia adds its own payment option to transactions on its marketplace.",
        source: jumiaHistory,
      },
      {
        title: "Safaricom launches Masoko",
        place: "Kenya · 2017",
        description: "The mobile operator opens an online marketplace for local vendors.",
        source: {
          publisher: "Safaricom",
          title: "2018 Sustainable Business Report",
          url: "https://www.safaricom.co.ke/sustainabilityreport_2018/ebook/files/assets/common/downloads/Safaricom%202018%20Sustainable%20Business%20Report.pdf?uni=72a211ba0b44844ed7f9c1113e4e929f",
        },
      },
    ],
  },
  {
    id: "2018",
    label: "2018",
    period: "growth",
    headline: "The payments ecosystem grows",
    events: [
      {
        title: "Paystack raises an $8 million Series A",
        place: "Nigeria · 2018",
        description: "The funding supports the company's expansion of payments for African businesses.",
        source: paystackHistory,
      },
      {
        title: "Jumia Express offers next-day delivery",
        place: "Multiple markets · 2018",
        description: "Jumia expands its fulfilment network to deliver some orders by the following day.",
        source: jumiaHistory,
      },
      {
        title: "MTN and Orange announce Mowali",
        place: "Pan-African · 2018",
        description: "The joint venture aims to connect mobile money and merchant payments across networks.",
        source: {
          publisher: "GSMA",
          title: "Unlocking mobile money interoperability through Mowali",
          url: "https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-for-development/uncategorized/unlocking-mobile-money-interoperability-and-merchant-payments-across-africa-through-mowali/",
        },
      },
    ],
  },
  {
    id: "2019",
    label: "2019",
    period: "growth",
    headline: "Jumia lists on the NYSE",
    events: [
      {
        title: "Jumia lists on the New York Stock Exchange",
        place: "Pan-African · 2019",
        description: "Active in 14 African countries, Jumia lists on the New York Stock Exchange in April 2019.",
        source: {
          publisher: "Jumia Group",
          title: "Jumia listed on the New York Stock Exchange",
          url: "https://group.jumia.com/news/jumia-listed-on-the-new-york-stock-exchange?category=press-releases",
        },
      },
      {
        title: "DHL & Mall for Africa",
        place: "Multiple markets · 2019",
        description: "DHL partners with MallforAfrica to launch a new online shopping app, AfricaeShop, and expands to 34 African countries.",
        source: {
          publisher: "United Nations Economic Commission for Africa",
          title: "E-commerce in Africa: Africa eShop and Mall for Africa",
          url: "https://archive.uneca.org/sites/default/files/images/SROs/CA/rapport_final_e-commerce_webinar_14_dec_2020.pdf",
        },
      },
    ],
  },
  {
    id: "2020",
    label: "2020",
    period: "growth",
    headline: "Paystack Commerce launches",
    events: [
      {
        title: "Paystack introduces Commerce",
        place: "Africa · 2020",
        description: "Paystack introduces tools for merchants to create storefronts and sell products online.",
        source: {
          publisher: "Paystack",
          title: "Introducing Paystack Commerce",
          url: "https://prod-blog.paystack.com/blog/product/commerce",
        },
      },
      {
        title: "Flutterwave Store opens",
        place: "Africa · 2020",
        description: "Businesses can list products and accept online payments through a hosted store.",
        source: {
          publisher: "Flutterwave",
          title: "Welcome to Flutterwave Store",
          url: "https://flutterwave.com/us/blog/welcome-to-flutterwave-store",
        },
      },
    ],
  },
];
