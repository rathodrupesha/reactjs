/*!

=========================================================
* Material Dashboard React - v1.10.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
import LocationOn from "@material-ui/icons/LocationOn";
import Notifications from "@material-ui/icons/Notifications";
import Unarchive from "@material-ui/icons/Unarchive";
import Language from "@material-ui/icons/Language";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import UserProfile from "views/UserProfile/UserProfile.js";
import TableList from "views/TableList/TableList.js";
import StaffTableList from "views/StaffTableList/StaffTableList.js";
import Typography from "views/Typography/Typography.js";
import Icons from "views/Icons/Icons.js";
import Images from "views/Images/Images.js";
import StaticContent from "views/Icons/StaticContent.js";
import SummarizeIcon from "@mui/icons-material/Summarize";
import ReviewsIcon from "@mui/icons-material/Reviews";
// core components/views for RTL layout
import RTLPage from "views/RTLPage/RTLPage.js";
import OrderMenuList from "views/OrderMenuList/OrderMenuList.js";
import ServiceList from "views/ServiceList/ServiceList.js";
import CategoryList from "views/CategoryList/CategoryList";
import AmenityList from "views/AmenityList/AmenityList";
import SubscriptionList from "./views/SubscriptionList/SubscriptionList.js";
import PaymentsIcon from "@mui/icons-material/Payments";
import BrunchDiningIcon from "@mui/icons-material/BrunchDining";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import ImageSearchIcon from "@mui/icons-material/ImageSearch";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

import BorderColorIcon from "@mui/icons-material/BorderColor";
import FolderIcon from "@mui/icons-material/Folder";
import QuizIcon from "@mui/icons-material/Quiz";
import ReceiptIcon from "@material-ui/icons/Receipt";
import FeedIcon from "@mui/icons-material/Feed";
import EventNoteIcon from "@mui/icons-material/EventNote";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import PoolIcon from "@mui/icons-material/Pool";

import PremiumServiceList from "./views/PremiumServiceList/PremiumServiceList.js";
import NotesManagement from "./views/NotesManagemet/NotesManagement.js";
import PackagesList from "./views/PackagesList/PackagesList.js";
import SlotList from "./views/SlotList/SlotList.js";
import RequestList from "./views/RequestList/RequestList.js";
import BookingList from "./views/BookingList/BookingList.js";
import OrderList from "./views/OrderList/OrderList.js";
import OrderComplainList from "./views/ComplainManagement/OrderComplainList.js";
import BookingComplainList from "./views/ComplainManagement/BookingComplainList.js";
import RequestComplainList from "./views/ComplainManagement/RequestComplainList.js";
import Content from "./views/Content/Content.js";
import DirectoryList from "./views/Directory/DirectoryList.js";
import FAQList from "./views/FAQ/FAQList.js";
import HotelReviewList from "views/HotelReviewList/HotelReviewList.js";
import MasterAdminDetails from "views/MasterAdminDetails/MasterAdminDetails.js";
import CurrentUserList from "./views/BillManagement/CurrentUserList.js";
import ViewBill from "./views/BillManagement/ViewBill";
import SubAdminList from "views/SubAdmin/SubAdminList.js";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/superadmin",
    openlyAccessible: true,
    exact: true,
  },
  {
    path: "/profile",
    name: "My Profile",
    rtlName: "ملف تعريفي للمستخدم",
    icon: Person,
    component: UserProfile,
    layout: "/superadmin",
    exact: true,
  },

  {
    type: "menu",
    name: "User Management",
    menuId: "userManagement",
    icon: PeopleAltIcon,
    layout: "/superadmin",
    items: [
      {
        path: "/users",
        name: "Customer Management",
        rtlName: "قائمة الجدول",
        icon: PeopleAltIcon,
        component: TableList,
        layout: "/superadmin",
        access_criteria: "customer_management",
        exact: true,
      },
      {
        path: "/staffs",
        name: "Staff Management",
        rtlName: "قائمة الجدول",
        icon: PeopleAltIcon,
        component: StaffTableList,
        layout: "/superadmin",
        access_criteria: "staff_management",
        exact: true,
      },
      {
        path: "/sub-admin",
        name: "SubAdmin Management",
        rtlName: "قائمة الجدول",
        icon: PeopleAltIcon,
        component: SubAdminList,
        layout: "/superadmin",
        exact: true,
      },
    ],
  },

  {
    type: "menu",
    name: "Meal Management",
    menuId: "mealManagement",
    icon: RestaurantMenuIcon,
    layout: "/superadmin",

    items: [
      {
        path: "/categories",
        name: "Category Management",
        rtlName: "قائمة الجدول",
        icon: BrunchDiningIcon,
        component: CategoryList,
        layout: "/superadmin",
        access_criteria: "category_management",
        exact: true,
      },
      {
        path: "/menu",
        name: "Order Menu Management",
        rtlName: "قائمة الجدول",
        icon: MenuBookIcon,
        component: OrderMenuList,
        layout: "/superadmin",
        access_criteria: "order_menu_management",
        exact: true,
      },
    ],
  },

  {
    path: "/services",
    name: "Front Desk/ House Keeping Services Management",
    rtlName: "قائمة الجدول",
    icon: RoomServiceIcon,
    component: ServiceList,
    layout: "/superadmin",
    access_criteria: "service_management",
    exact: true,
  },
  {
    path: "/premium-services",
    name: "Premium Services",
    rtlName: "قائمة الجدول",
    icon: WorkspacePremiumIcon,
    component: PremiumServiceList,
    layout: "/superadmin",
    exact: true,
    access_criteria: "premium_service_activities_management",
  },
  // for packages details
  {
    path: "/premium-services/:psId/packages",
    name: "",
    rtlName: "",
    icon: "",
    component: PackagesList,
    layout: "/superadmin",
    hidden: true,
    exact: true,
  },
  {
    path: "/premium-services/:psId/packages/:packageId/slots",
    name: "",
    rtlName: "",
    icon: "",
    component: SlotList,
    layout: "/superadmin",
    hidden: true,
    exact: true,
  },
  {
    path: "/current-users",
    name: "Bill Management",
    rtlName: "Bill Management",
    icon: ReceiptIcon,
    component: CurrentUserList,
    layout: "/superadmin",
    exact: true,
    access_criteria: "bill",
  },

  {
    type: "menu",
    name: "Request/Booking Management",
    menuId: "reqBookManagement",
    icon: "content_paste",
    layout: "/superadmin",
    items: [
      {
        path: "/requests",
        name: "Request Management",
        rtlName: "",
        icon: FeedIcon,
        component: RequestList,
        layout: "/superadmin",
        access_criteria: "request_management",
        exact: true,
      },
      {
        path: "/bookings",
        name: "Booking Management",
        rtlName: "",
        icon: EventNoteIcon,
        component: BookingList,
        layout: "/superadmin",
        access_criteria: "booking_management",
        exact: true,
      },
      {
        path: "/orders",
        name: "Order Management",
        rtlName: "",
        icon: RestaurantIcon,
        component: OrderList,
        layout: "/superadmin",
        access_criteria: "order_management",
        exact: true,
      },
    ],
  },

  {
    type: "menu",
    name: "Complaints",
    menuId: "complaints",
    icon: "content_paste",
    layout: "/superadmin",

    items: [
      {
        path: "/orders-complains",
        name: "Order Complain",
        rtlName: "",
        icon: "content_paste",
        component: OrderComplainList,
        layout: "/superadmin",
        access_criteria: "complaint",
        exact: true,
      },
      {
        path: "/booking-complains",
        name: "Booking Complain",
        rtlName: "",
        icon: "content_paste",
        component: BookingComplainList,
        layout: "/superadmin",
        access_criteria: "complaint",
        exact: true,
      },
      {
        path: "/request-complains",
        name: "Request Complain",
        rtlName: "",
        icon: "content_paste",
        component: RequestComplainList,
        layout: "/superadmin",
        access_criteria: "complaint",
        exact: true,
      },
    ],
  },

  {
    path: "/directory",
    name: "Directory",
    rtlName: "قائمة الجدول",
    icon: FolderIcon,
    component: DirectoryList,
    layout: "/superadmin",
    access_criteria: "static_content_management",
    exact: true,
  },

  {
    path: "/faq",
    name: "FAQ",
    rtlName: "قائمة الجدول",
    icon: QuizIcon,
    component: FAQList,
    layout: "/superadmin",
    access_criteria: "static_content_management",
    exact: true,
  },

  {
    type: "menu",
    name: "Static Content",
    menuId: "staticContent",
    icon: "content_paste",
    layout: "/superadmin",

    items: [
      {
        path: "/content",
        name: "Content",
        rtlName: "",
        icon: BorderColorIcon,
        component: Content,
        layout: "/superadmin",
        access_criteria: "static_content_management",
        exact: true,
      },
      {
        path: "/notes",
        name: "Notes Management",
        rtlName: "قائمة الجدول",
        icon: SummarizeIcon,
        component: NotesManagement,
        access_criteria: "notes",
        layout: "/superadmin",
        exact: true,
      },
    ],
  },
  {
    type: "menu",
    name: "Hotel Details Management",
    menuId: "hotelDetails",
    icon: "content_paste",
    layout: "/superadmin",
    items: [
      {
        path: "/amenities",
        name: "Amenities",
        access_criteria: "amenities",
        rtlName: "قائمة الجدول",
        icon: PoolIcon,
        component: AmenityList,
        layout: "/superadmin",
        exact: true,
      },
      {
        path: "/images",
        name: "Hotel Images",
        rtlName: "قائمة الجدول",
        icon: ImageSearchIcon,
        component: Images,
        layout: "/superadmin",
        access_criteria: "hotel",
        exact: true,
      },
      {
        path: "/hotel-reviews",
        name: "Hotel Reviews",
        rtlName: "Hotel Reviews",
        icon: ReviewsIcon,
        component: HotelReviewList,
        layout: "/superadmin",
        access_criteria: "review",
        exact: true,
      },
      {
        path: "/subscription",
        name: "Subscription Details",
        rtlName: "ملف تعريفي للمستخدم",
        icon: PaymentsIcon,
        component: SubscriptionList,
        layout: "/superadmin",
        access_criteria: "subscription",
        exact: true,
      },
    ],
  },

  {
    path: "/master-admin-details",
    name: "Master Admin Details",
    rtlName: "",
    icon: PeopleAltIcon,
    component: MasterAdminDetails,
    layout: "/superadmin",
    exact: true,
  },
];

export default dashboardRoutes;
