export interface Unit {
  id: number;
  name: string;
}

export interface Department {
  id: number;
  name: string;
  units: Unit[];
}

export interface Division {
  id: number;
  name: string;
  departments: Department[];
}

export const divisionsData: Division[] = [
  {
    id: 1,
    name: "Technology",
    departments: [
      {
        id: 101,
        name: "Application Access Management",
        units: [
          {
            id: 1001,
            name: "Ent. App. Access Mgt.",
          },
          {
            id: 1002,
            name: "System Sec. and Risks",
          },
        ],
      },
      {
        id: 102,
        name: "Application Development Management",
        units: [
          {
            id: 1003,
            name: "Application Development and Maintenance",
          },
          {
            id: 1004,
            name: "Corporate Solution and BSLA",
          },
          {
            id: 1005,
            name: "Corporate Solutions and Integration",
          },
          {
            id: 1006,
            name: "ESB and Service Integration",
          },
          {
            id: 1007,
            name: "Mobile Apps, Back Office, MIS and Regulatory Reporting",
          },
          {
            id: 1008,
            name: "Payment, Statement and Digital Service Integration",
          },
          {
            id: 1009,
            name: "Remittance Solution",
          },
          {
            id: 1010,
            name: "UBA, Internet Banking and Online Systems",
          },
        ],
      },
      {
        id: 103,
        name: "Application Development and ERP Support",
        units: [
          {
            id: 1011,
            name: "Application Development",
          },
          {
            id: 1012,
            name: "Application Management",
          },
          {
            id: 1013,
            name: "Business Analysis",
          },
          {
            id: 1014,
            name: "ERP and App Support",
          },
          {
            id: 1015,
            name: "Middleware Development",
          },
          {
            id: 1016,
            name: "Satellite Application Development",
          },
        ],
      },
      {
        id: 104,
        name: "Applications Developments",
        units: [
          {
            id: 1017,
            name: "Customer Management Applications Development",
          },
          {
            id: 1018,
            name: "Delivery Mgt, System Analyst and QA",
          },
          {
            id: 1019,
            name: "Middleware and Linkage Applications Development",
          },
          {
            id: 1020,
            name: "Satelliet Application Management",
          },
        ],
      },
      {
        id: 105,
        name: "Cards and ADC Technology",
        units: [
          {
            id: 1021,
            name: "Call Center and POS Terminals",
          },
          {
            id: 1022,
            name: "Card Systems",
          },
          {
            id: 1023,
            name: "Credit Card Management and Acquiring Solutions",
          },
          {
            id: 1024,
            name: "Debit Card Management and Switching Solutions",
          },
          {
            id: 1025,
            name: "Devices and Terminal Management",
          },
          {
            id: 1026,
            name: "E-Commerce and Merchant Acquiring",
          },
        ],
      },
      {
        id: 106,
        name: "Core Banking Application",
        units: [
          {
            id: 1027,
            name: "Agent Banking, Core Banking",
          },
          {
            id: 1028,
            name: "Asset and CIB, Core Banking",
          },
          {
            id: 1029,
            name: "Asset, Treasury and AML, Core Banking",
          },
          {
            id: 1030,
            name: "CBS Support and Service",
          },
          {
            id: 1031,
            name: "Core Banking",
          },
          {
            id: 1032,
            name: "Customization and Integration, Core Banking",
          },
          {
            id: 1033,
            name: "Payments and CIB Reporting",
          },
          {
            id: 1034,
            name: "Payments, CIB and Audit, Core Banking",
          },
          {
            id: 1035,
            name: "Payments, Treasury and AML, Core Banking",
          },
          {
            id: 1036,
            name: "Research and Development, Core Banking",
          },
          {
            id: 1037,
            name: "Support, Trade Development and Product/Liability/GB",
          },
          {
            id: 1038,
            name: "Systems and Solutions, Core Banking",
          },
          {
            id: 1039,
            name: "Systems, Development and Integration, Core Banking",
          },
          {
            id: 1040,
            name: "Trade and Liability, Core Banking",
          },
          {
            id: 1041,
            name: "Treasury and Asset, Core Banking",
          },
        ],
      },
      {
        id: 107,
        name: "Core Banking Applications",
        units: [
          {
            id: 1042,
            name: "Agent Banking Support",
          },
          {
            id: 1043,
            name: "Application L1 / L2 Support",
          },
          {
            id: 1044,
            name: "Design, Change Mgt and Project Support",
          },
          {
            id: 1045,
            name: "Treasury and Trade Finance",
          },
        ],
      },
      {
        id: 108,
        name: "Enterprise Application Management",
        units: [
          {
            id: 1046,
            name: "Digital Lending",
          },
          {
            id: 1047,
            name: "Document and Loan Management Systems",
          },
          {
            id: 1048,
            name: "Enterprise Resource Planning",
          },
          {
            id: 1049,
            name: "Lead Management System",
          },
        ],
      },
      {
        id: 109,
        name: "Enterprise Solutions and ADC",
        units: [
          {
            id: 1050,
            name: "ADC Systems",
          },
          {
            id: 1051,
            name: "Cards and ADC Applications",
          },
          {
            id: 1052,
            name: "E-Commerce",
          },
          {
            id: 1053,
            name: "Enterprise Solutions",
          },
        ],
      },
      {
        id: 110,
        name: "Enterprise Systems",
        units: [
          {
            id: 1054,
            name: "Corporate Banking and Cash Management",
          },
          {
            id: 1055,
            name: "Document Management System",
          },
          {
            id: 1056,
            name: "Enterprise Resource planning",
          },
          {
            id: 1057,
            name: "Payment and Collection applications",
          },
          {
            id: 1058,
            name: "Universal Banking Applications",
          },
        ],
      },
      {
        id: 111,
        name: "Process Automation and R&D",
        units: [
          {
            id: 1059,
            name: "AVA",
          },
          {
            id: 1060,
            name: "Prism and Smart Recon",
          },
          {
            id: 1061,
            name: "R&D (AI and ML)",
          },
          {
            id: 1062,
            name: "RPA Development",
          },
        ],
      },
      {
        id: 112,
        name: "Systems Support and Service Operations",
        units: [
          {
            id: 1063,
            name: "DC and DR Operations",
          },
          {
            id: 1064,
            name: "Datacenter Management and Operations",
          },
          {
            id: 1065,
            name: "Help desk and Regional Support",
          },
          {
            id: 1066,
            name: "IT Access Control",
          },
          {
            id: 1067,
            name: "IT Compliance and Standardization",
          },
          {
            id: 1068,
            name: "IT Fulfillment and Service Desk",
          },
          {
            id: 1069,
            name: "IT Governance, Standardization and Audit",
          },
          {
            id: 1070,
            name: "Lab and Asset Management",
          },
          {
            id: 1071,
            name: "Service Operations Center and Service Desk",
          },
          {
            id: 1072,
            name: "Systems Support",
          },
          {
            id: 1073,
            name: "Technology Project Management",
          },
          {
            id: 1074,
            name: "Technology Service Desk and IT Support",
          },
        ],
      },
      {
        id: 113,
        name: "Technology Infra. and Systems Mgt.",
        units: [
          {
            id: 1075,
            name: "Core System",
          },
          {
            id: 1076,
            name: "Database Administration Services",
          },
          {
            id: 1077,
            name: "Datacenter and Enterprise Systems",
          },
          {
            id: 1078,
            name: "Enterprise Network Services",
          },
          {
            id: 1079,
            name: "System Administration",
          },
        ],
      },
      {
        id: 114,
        name: "Technology Infrastructure",
        units: [
          {
            id: 1080,
            name: "DC Operations",
          },
          {
            id: 1081,
            name: "Database Administration",
          },
          {
            id: 1082,
            name: "Enterprise Network",
          },
          {
            id: 1083,
            name: "Office Applications",
          },
          {
            id: 1084,
            name: "Systems and Facilities",
          },
          {
            id: 1085,
            name: "IT Lab and Asset Management",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Division B",
    departments: [
      {
        id: 201,
        name: "Department B1",
        units: [
          {
            id: 2001,
            name: "Unit B1.1",
          },
          {
            id: 2002,
            name: "Unit B1.2",
          },
        ],
      },
      {
        id: 202,
        name: "Department B2",
        units: [
          {
            id: 2003,
            name: "Unit B2.1",
          },
          {
            id: 2004,
            name: "Unit B2.2",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Division C",
    departments: [
      {
        id: 301,
        name: "Department C1",
        units: [
          {
            id: 3001,
            name: "Unit C1.1",
          },
          {
            id: 3002,
            name: "Unit C1.2",
          },
        ],
      },
      {
        id: 302,
        name: "Department C2",
        units: [],
      },
    ],
  },
];
