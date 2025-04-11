import { Menu } from "@/types/menu";

const menuData: Record<string, Menu[]> = {
  admin: [
    {
      id: 1,
      title: "Dashboard",
      newTab: false,
      path: "/admin/dashboard",
    },
    {
      id: 2,
      title: "Manage Users",
      newTab: false,
      path: "/admin/users",
    },
    {
      id: 3,
      title: "Profile",
      newTab: false,
      path: "/profile",
    },
    {
      id: 4,
      title: "การชำระเงิน",
      newTab: false,
      path: "/payment",
    },
  ],

  cio: [
    {
      id: 1,
      title: "Dashboard",
      newTab: false,
      path: "/cio-dashboard",
    },
    {
      id: 2,
      title: "Emp",
      newTab: false,
      path: "/emplist",
    },
  ],

  std: [
    {
      id: 1,
      title: "ข้อมูลส่วนตัว",
      newTab: false,
      path: "/profile",
    },
    {
      id: 2,
      title: "เช็คชื่อ",
      newTab: false,
      path: "/check-history",
    },
  ],
};

export default menuData;