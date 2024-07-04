// Sidebar imports
import {
    UilEstate,
    UilClipboardAlt,
    UilUsersAlt,
    UilPackage,
    UilChart,
    UilSignOutAlt,
    UilMoneyWithdrawal,
    UilUsdSquare
  } from "@iconscout/react-unicons";

// Sidebar Data
export const SidebarData = [
    {
      icon: UilEstate,
      path: "/OTP/Dashboard",
      heading: "Home",
    },
    {
      icon: UilClipboardAlt,
      path: "/OTP/Dashboard/complaint_status",
      heading: "Complaints-status",
    },
    {
      icon: UilUsersAlt,
      path:"/OTP/Dashboard/ano_non_anony",
      heading: "Raise Complaint",
    },
    {
      icon: UilPackage,
      path:"/OTP/Dashboard/AllComplaints",
      heading: 'All-Complaints'
    },
    {
      icon: UilChart,
      path:"/OTP/Dashboard/Non_assign_Complaints",
      heading: 'Non-Assigned Complaints'
    },
    {
      icon: UilChart,
      path:"/OTP/Dashboard/Assigned_Complaints",
      heading: 'Assigned Complaints'
    },
    {
      icon: UilChart,
      path:"/OTP/Dashboard/Choose_message_system",
      heading: 'Messaging'
    },
  ];

  // Analytics Cards Data
export const cardsData = [
    {
      title: "Total Complaints",
      color: {
        backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
        boxShadow: "0px 10px 20px 0px #e0c6f5",
      },
      barValue: 100,
      value: "362",
      png: UilMoneyWithdrawal,
      series: [
        {
          name: "Total Complaints",
          data: [31, 71, 103, 151, 234, 302, 362],
        },
      ],
    },
    {
      title: "Open Complaints",
      color: {
        backGround: "linear-gradient(180deg, #FF919D 0%, #FC929D 100%)",
        boxShadow: "0px 10px 20px 0px #FDC0C7",
      },
      barValue: 10,
      value: "36",
      png: UilMoneyWithdrawal,
      series: [
        {
          name: "Open Complaints",
          data: [3, 8, 15, 22, 29, 33, 36],
        },
      ],
    },
    {
      title: "Resolved Complaints",
      color: {
        backGround:
          "linear-gradient(rgb(248, 212, 154) -146.42%, rgb(255 202 113) -46.42%)",
        boxShadow: "0px 10px 20px 0px #F9D59B",
      },
      barValue: 90,
      value: "351",
      png: UilClipboardAlt,
      series: [
        {
          name: "Resolved Complaints",
          data: [101, 156, 198, 233, 288, 324, 351],
        },
      ],
    },
  ];