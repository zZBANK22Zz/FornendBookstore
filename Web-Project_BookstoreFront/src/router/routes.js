const routes = [
  { path: "", component: () => import("pages/LoginPage.vue") },
  { path: "/register", component: () => import("pages/RegisterPage.vue") },
  ,
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [{
      path: '/book',
      component: () => import('../pages/BookListPage.vue'),
    }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
