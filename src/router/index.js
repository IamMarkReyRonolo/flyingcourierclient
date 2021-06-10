import Vue from "vue";
import VueRouter from "vue-router";

import LandingPage from "../views/LandingPageView.vue";
import AdminSignIn from "../components/LandingPageComponents/AdminSignIn.vue";
import SignUpPage from "../components/LandingPageComponents/SignUpPage.vue";

import LogOut from "../views/LogOut.vue";

import UserPageView from "../views/UserPageView.vue";

import AdminPageView from "../views/AdminPageView.vue";

import AccessDenied from "../components/ErrorComponents/AccessDenied.vue";
import NotFound from "../components/ErrorComponents/404.vue";

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		component: LandingPage,
	},
	{ path: "/logout", name: "LogOut", component: LogOut },
	{ path: "/signUp", component: SignUpPage },
	{ path: "/admin", component: AdminSignIn },
	{ path: "/account", component: UserPageView },
	{ path: "/administrator", component: AdminPageView },
	{ path: "/accessdenied", component: AccessDenied },
	{ path: "*", component: NotFound },
];

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes,
});

export default router;
