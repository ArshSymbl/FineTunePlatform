import { authRoles } from "app/auth/authRoles";

export const navigations = [
  {
    name: "Dashboard",
    path: "/dashboard/default",
    icon: "dashboard",
    auth: authRoles.sa, // ONLY SUPER ADMIN(SA) CAN ACCESS
  },

  {
    name: "Job Managment",
    icon: "business_center",
    children: [
      { name: "Create New Jobs", path: "/pages/new-jobRequest", iconText: "NC" },
      { name: "Existing Jobs", path: "/pages/Existing-Jobs", iconText: "CL" },
      
    ],
  },
  {
    name: "Datasets",
    icon: "folder",
    children: [
      { name: "DataSet List", path: "/pages/product-list", iconText: "PL" },
      { name: "Upload New Datasets", path: "/pages/new-product", iconText: "NP" },
    ],
  },
  {
    name: "Models Offered",
    icon: "list",

    children: [{ name: "List", path: "/matx-list", iconText: "L" }],
  },
  // {
  //   name: "Orders",
  //   icon: "folder",
  //   children: [
  //     { name: "Order List", path: "/pages/order-list", iconText: "OL" },
  //     { name: "View Order", path: "/invoice/fdskfjdsuoiucrwevbgd", iconText: "VO" },
  //   ],
  // },
  // {
  //   name: "Help Center",
  //   icon: "help",
  //   children: [
  //     { name: "FAQ 1", path: "/pages/faq-1", iconText: "F1" },
  //     { name: "FAQ 2", path: "/pages/faq-2", iconText: "F2" },
  //   ],
  // },
  // {
  //   name: "Pricing",
  //   icon: "money",

  //   children: [
  //     { name: "Pricing 1", iconText: "P1", path: "/others/pricing-1" },
  //     { name: "Pricing 2", iconText: "P2", path: "/others/pricing-2" },
  //     { name: "Pricing 3", iconText: "P3", path: "/others/pricing-3" },
  //     { name: "Pricing 4", iconText: "P4", path: "/others/pricing-4" },
  //   ],
  // },
  // {
  //   name: "User List",
  //   icon: "people",
  //   children: [
  //     { name: "User List 1", path: "/pages/user-list-1", iconText: "U1" },
  //     { name: "User List 2", path: "/pages/user-list-2", iconText: "U2" },
  //     { name: "User List 3", path: "/pages/user-list-3", iconText: "U3" },
  //     { name: "User List 4", path: "/pages/user-list-4", iconText: "U3" },
  //   ],
  // },
  // {
  //   name: "Forms",
  //   icon: "description",

  //   children: [
  //     { name: "Order Form", path: "/forms/order-form", iconText: "OF" },
  //     { name: "Invoice Form", path: "/forms/invoice-form", iconText: "IF" },
  //     { name: "Property Listing Form", path: "/forms/property-listing-form", iconText: "PF" },
  //     { name: "Basic", path: "/forms/basic", iconText: "B" },
  //     { name: "Upload", path: "/forms/upload", iconText: "U" },
  //     { name: "Wizard", path: "/forms/wizard", iconText: "W" },
  //   ],
  // },
  
  // {
  //   name: "Session/Auth",
  //   icon: "security",
  //   children: [
  //     { name: "Sign in", iconText: "SI", path: "/session/signin" },
  //     { name: "Sign up", iconText: "SU", path: "/session/signup" },
  //     { name: "Forgot Password", iconText: "FP", path: "/session/forgot-password" },
  //     { name: "Error", iconText: "404", path: "/session/404" },
  //   ],
  // },
  // { name: "Left Sidebar Card", path: "/page-layouts/Left-sidebar-card", icon: "vertical_split" },
  // { name: "User Profile", path: "/page-layouts/user-profile", icon: "person" },
  // { name: "Account", path: "/page-layouts/account", icon: "manage_accounts" },

  // { label: "Apps", type: "label" },
  // {
  //   name: "Ecommerce",
  //   icon: "shopping_basket",

  //   children: [
  //     { name: "Shop", path: "/ecommerce/shop", iconText: "S" },
  //     { name: "Cart", path: "/ecommerce/cart", iconText: "C" },
  //     { name: "Checkout", path: "/ecommerce/checkout", iconText: "CO" },
  //   ],
  // },
  // {
  //   name: "Scrum Board",
  //   icon: "group_work",
  //   path: "/scrum-board/c5d7498bbcb84d81fc7454448871ac6a6e",
  // },
  // { name: "Invoice Builder", icon: "receipt", path: "/invoice/list" },
  // { name: "Calendar", icon: "date_range", path: "/calendar" },
  // { name: "Chat", icon: "chat", path: "/chat" },
  // { name: "Inbox", icon: "inbox", path: "/inbox" },
  // { name: "Todo", icon: "center_focus_strong", path: "/todo/list" },
  // { name: "CRUD Table", icon: "format_list_bulleted", path: "/crud-table" },

  // // { label: "Tables", type: "label" },
  // // {
  // //   name: "Data Table",
  // //   icon: "table_view",

  // //   children: [
  // //     { name: "Simple Mui Table", path: "/data-table/simple-mui-table", iconText: "T1" },
  // //     { name: "Expandable Mui Table", path: "/data-table/expandable-mui-table", iconText: "T2" },
  // //   ],
  // // },

  // { label: "Components", type: "label" },
  // {
  //   name: "Components",
  //   icon: "favorite",
  //   badge: { value: "30+", color: "secondary" },
  //   children: [
  //     { name: "Auto Complete", path: "/material/autocomplete", iconText: "A" },
  //     { name: "Buttons", path: "/material/buttons", iconText: "B" },
  //     { name: "Checkbox", path: "/material/checkbox", iconText: "C" },
  //     { name: "Dialog", path: "/material/dialog", iconText: "D" },
  //     { name: "Drag and Drop", iconText: "D", path: "/others/drag-and-drop" },
  //     { name: "Expansion Panel", path: "/material/expansion-panel", iconText: "E" },
  //     { name: "Form", path: "/material/form", iconText: "F" },
  //     { name: "Icons", path: "/material/icons", iconText: "I" },
  //     { name: "Menu", path: "/material/menu", iconText: "M" },
  //     { name: "Progress", path: "/material/progress", iconText: "P" },
  //     { name: "Radio", path: "/material/radio", iconText: "R" },
  //     { name: "Switch", path: "/material/switch", iconText: "S" },
  //     { name: "Slider", path: "/material/slider", iconText: "S" },
  //     { name: "Snackbar", path: "/material/snackbar", iconText: "S" },
  //     { name: "Table", path: "/material/table", iconText: "T" },
  //   ],
  // },
  // { name: "Map", icon: "add_location", path: "/map" },

  // { label: "Charts", type: "label" },
  // {
  //   name: "Charts",
  //   icon: "trending_up",

  //   children: [
  //     { name: "Echarts", path: "/charts/echarts", iconText: "E" },
  //     { name: "Recharts", path: "/charts/recharts", iconText: "R" },
  //     { name: "Apex Charts", path: "/charts/apex-charts", iconText: "A" },
  //   ],
  // },
  // {
  //   name: "Documentation",
  //   icon: "launch",
  //   type: "extLink",
  //   path: "http://demos.ui-lib.com/matx-react-doc/",
  // },
];

export const getfilteredNavigations = (navList = [], role) => {
  return navList.reduce((array, nav) => {
    if (nav.auth && nav.auth.includes(role)) {
      array.push(nav);
    } else {
      if (nav.children) {
        nav.children = getfilteredNavigations(nav.children, role);
        array.push(nav);
      }

      array.push(nav);
    }
    return array;
  }, []);
};
