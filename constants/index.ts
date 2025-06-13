export const navigationLinks = [
  {
    href: "/plans",
    label: "Plans",
  },

  {
    img: "/icons/user.svg",
    selectedImg: "/icons/user-fill.svg",
    href: "/my-profile",
    label: "My Profile",
  },
];

export const adminSideBarLinks = [
  {
    img: "/icons/admin/home.svg",
    route: "/admin",
    text: "Home",
  },
  {
    img: "/icons/admin/users.svg",
    route: "/admin/users",
    text: "All Users",
  },
  // {
  //   img: "/icons/admin/book.svg",
  //   route: "/admin/books",
  //   text: "All Books",
  // },
  // {
  //   img: "/icons/admin/bookmark.svg",
  //   route: "/admin/book-requests",
  //   text: "Borrow Requests",
  // },
  {
    img: "/icons/admin/user.svg",
    route: "/admin/account-requests",
    text: "Account Requests",
  },
];

export const FIELD_NAMES = {
  fullName: "Full name",
  email: "Email",
  // universityId: "University ID Number",
  password: "Password",
  IDCard: "Upload Your Proof of Identification",
};

export const FIELD_TYPES = {
  fullName: "text",
  email: "email",
  // universityId: "number",
  password: "password",
};

// instead of sampleBooks it will be investmentPlans
export const investmentPlans = [
  {
    id: 1,
    title: "Basic Plan",
    rating: 4.6,
    price: 100,
    duration: "1 month",
  },
  {
    id: 2,
    title: "Diamond Plan",
    rating: 4.9,
    price: 100,
    duration: "1 month",
  },
  {
    id: 3,
    title: "Platinum Plan",
    rating: 4.7,
    price: 100,
    duration: "1 month",
  },
  {
    id: 4,
    title: "Silver Plan",
    rating: 4.5,
    price: 100,
    duration: "1 month",
  }
];
