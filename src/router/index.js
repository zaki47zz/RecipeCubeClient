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

import { createRouter, createWebHistory } from 'vue-router';
import OrderView from '@/views/OrderView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: '/',
            redirect: '/inventory',
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
            path: '/customrecipe',
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
            name: 'User',
            component: UserView,
        },
        {
            // 登入
            path: '/sign-in',
            name: 'SignIn',
            component: SignIn,
        },
        {
            // 註冊
            path: '/sign-up',
            name: 'SignUp',
            component: SignUp,
        },
        {
            // 忘記密碼
            path: '/resetPassword',
            name: 'resetPassword',
            component: ResetPassword,
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
    ],
});

export default router;
