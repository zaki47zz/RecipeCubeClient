import AddIngredientView from '@/views/AddIngredientView.vue';
import BuyandCookView from '@/views/BuyandCookView.vue';
import CustomRecipeView from '@/views/CustomRecipeView.vue';
import InventoryView from '@/views/InventoryView.vue';
import RecipeView from '@/views/RecipeView.vue';
import UserView from '@/views/UserView.vue';
import SignIn from '@/views/SignInView.vue';
import SignUp from '@/views/SignUpView.vue';
import AboutView from '@/views/AboutView.vue';
import QuestionView from '@/views/QuestionView.vue';
import ContactView from '@/views/ContactView.vue';
import StoreView from '@/views/StoreView.vue';
import StorePrductView from '@/views/StorePrductView.vue';
import ChickoutView from '@/views/ChickoutView.vue';
import CartView from '@/views/CartView.vue';
import StoreProductDetailView from '@/views/StoreProductDetailView.vue';
import GenerateRecipeView from '@/views/GenerateRecipeView.vue';
import ResetPassword from '@/views/ResetPassword.vue';
import ResetEmailConfirmed from '@/views/ResetEmailConfirmed.vue';
import ResetPasswordSet from '@/views/ResetPasswordSet.vue';
import OrderView from '@/views/OrderView.vue';
import HomeView from '@/views/HomeView.vue';
import RecipeDetailView from '@/views/RecipeDetailView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import oAuthFirstSignIn from '@/views/oAuthFirstSignInView.vue';

import { useAuthStore } from '@/stores/auth';

import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: HomeView,
        },
        {
            path: '/inventory',
            name: 'Inventory',
            component: InventoryView,
        },
        {
            path: '/addingredient',
            name: 'AddIngredient',
            component: AddIngredientView,
        },
        {
            path: '/buyandcook',
            name: 'BuyandCook',
            component: BuyandCookView,
        },
        {
            path: '/customrecipe/:id?',
            name: 'CustomRecipe',
            component: CustomRecipeView,
        },
        {
            path: '/recipe',
            name: 'Recipe',
            component: RecipeView,
        },
        {
            path: '/user',
            name: 'user',
            component: UserView,
        },
        {
            // 登入
            path: '/signin',
            name: 'signin',
            component: SignIn,
        },
        {
            // 第一次第三方登入跳轉填寫必填資訊
            path: '/oAuthFirstSignIn',
            name: 'oAuthFirstSignIn',
            component: oAuthFirstSignIn,
        },
        {
            // 註冊
            path: '/signup',
            name: 'signup',
            component: SignUp,
        },
        {
            // 忘記密碼-1(生成清空密碼導向輸入新密碼頁面連結)
            path: '/resetpassword',
            name: 'resetpassword',
            component: ResetPassword,
        },
        {
            // 忘記密碼-2(驗證token才能訪問)
            path: '/resetpasswordset',
            name: 'resetpasswordset',
            component: ResetPasswordSet,
        },
        {
            // 重新發送電子郵件確認
            path: '/resetemailConfirmed',
            name: 'resetemailConfirmed',
            component: ResetEmailConfirmed,
        },
        {
            path: '/aboutus',
            name: 'AboutUs',
            component: AboutView,
        },
        {
            path: '/question',
            name: 'Question',
            component: QuestionView,
        },
        {
            path: '/contact',
            name: 'Contact',
            component: ContactView,
        },
        {
            //http://localhost:5175/store
            path: '/store',
            component: StoreView,
            redirect: '/storeproduct',
            name: 'store',
            children: [
                {
                    //http://localhost:5175/storeproduct
                    path: '/storeproduct',
                    component: StorePrductView,
                    name: 'storeproduct',
                },
                {
                    //http://localhost:5175/chickout
                    path: '/chickout',
                    component: ChickoutView,
                    name: 'chickout',
                },
                {
                    //http://localhost:5175/cart
                    path: '/cart',
                    component: CartView,
                    name: 'cart',
                },
                {
                    //http://localhost:5175/storeProductDetail
                    path: '/storeProductDetail',
                    component: StoreProductDetailView,
                    name: 'storeProductDetail',
                },
                {
                    //http://localhost:5175/storeProductDetail/4
                    path: '/storeProductDetail/:id',
                    component: StoreProductDetailView,
                    name: 'storeProductDetailById',
                },
                {
                    path: '/order',
                    component: OrderView,
                    name: 'order',
                },
            ],
        },
        {
            path: '/generaterecipe',
            name: 'GenerateRecipe',
            component: GenerateRecipeView,
        },
        {
            path: '/generaterecipe/recipeDetail/:id',
            name: 'RecipeDetail',
            component: RecipeDetailView,
        },
        { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
    ],
    scrollBehavior(to, from, savedPosition) {
        return { top: 0 };
    },
});

router.beforeEach((to, from, next) => {
    //登入的頁面陣列
    const requiresAuth = ['Inventory', 'AddIngredient', 'CustomRecipe', 'GenerateRecipe', 'signin'];

    //檢查使用者要去的頁面是否需要登入
    if (requiresAuth.includes(to.name)) {
        //檢查使用者是否已登入
        const authStore = useAuthStore();
        const isLoggedIn = authStore.token && authStore.checkTokenExpiry;

        if (!isLoggedIn) {
            //若沒登入，重導到首頁
            next('/');
        } else {
            //已登入則允許
            next();
        }
    } else {
        // 不需要登入的頁面直接放行
        next();
    }
});

export default router;
