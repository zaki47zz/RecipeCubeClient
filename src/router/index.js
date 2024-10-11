import AddIngredientView from '@/views/AddIngredientView.vue';
import BuyandCookView from '@/views/BuyandCookView.vue';
import CustomRecipeView from '@/views/CustomRecipeView.vue';
import InventoryView from '@/views/InventoryView.vue';
import RecipeView from '@/views/RecipeView.vue';
import ShopView from '@/views/ShopView.vue';
import UserView from '@/views/UserView.vue';
import SignIn from '@/views/SignInView.vue';
import SignUp from '@/views/SignUpView.vue';
import AboutView from '@/views/AboutView.vue';
import QuestionView from '@/views/QuestionView.vue';
import ContactView from '@/views/ContactView.vue';

import { createRouter, createWebHistory } from 'vue-router';

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
            path: '/shop',
            name: 'Shop',
            component: ShopView,
        },
        {
            path: '/user',
            name: 'User',
            component: UserView,
        },
        {
            path: '/sign-in',
            name: 'SignIn',
            component: SignIn,
        },
        {
            path: '/sign-up',
            name: 'SignUp',
            component: SignUp,
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
    ],
});

export default router;
