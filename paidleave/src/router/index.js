//import { createRouter, createWebHistory } from 'vue-router'
import { createRouter, createWebHashHistory } from "vue-router";
//import HomeView from "../views/HomeView.vue";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";

const routes = [{
        path: "/",
        name: "home",
        component: Login,
    },
    {
        path: "/login",
        name: "login",
        component: Login,
    },
    {
        path: "/dashboard",
        name: "dashboard",
        children: [{
                path: ":type/:menu",
                component: () =>
                    import ("../views/Content.vue"),
            },
            {
                path: "home",
                component: () =>
                    import ("../views/Home.vue"),
            },
        ],
        component: Dashboard,
    },
    {
        path: "/about",
        name: "about",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import ( /* webpackChunkName: "about" */ "../views/AboutView.vue"),
    },
];

const router = createRouter({
    //history: createWebHistory("/"),
    history: createWebHashHistory(),
    routes,
});

export default router;