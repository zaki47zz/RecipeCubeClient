// src/stores/oauthLine.js
import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import liff from '@line/liff';

const decodeJWT = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );
    return JSON.parse(jsonPayload);
};

export const useOAuthLineStore = defineStore('oauthLine', {
    state: () => ({
        lineToken: null,
    }),
    actions: {
        async initializeLineSDK() {
            const router = useRouter();
            try {
                await liff.init({ liffId: '2006541501-jWaBEdv5' });
                if (liff.isLoggedIn()) {
                    this.lineToken = await liff.getIDToken();
                    if (this.lineToken) {
                        router.push('/signin');
                        const decodedData = decodeJWT(this.lineToken);
                        const oAuthLineUserEmail = { lineEmail: decodedData.email };
                        const API_URL = `${import.meta.env.VITE_API_BASEURL}/OAuth/VerifyAudience`;
                        const response = await fetch(API_URL, {
                            method: 'POST',
                            body: JSON.stringify({ oAuthGoogleJwt: this.lineToken }),
                            headers: { 'Content-Type': 'application/json' },
                        });

                        const data = await response.json();
                        if (response.ok && data.token) {
                            localStorage.setItem('token', data.token);
                            try {
                                const decoded = decodeJWT(data.token);
                                const userData = {
                                    UserId: decoded.certserialnumber,
                                    Email: decoded.email,
                                    UserName: decoded.unique_name,
                                    Phone: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone'],
                                    GroupId: decoded.groupsid,
                                    ExclusiveChecked: decoded.ExclusiveChecked,
                                    PreferredChecked: decoded.PreferredChecked,
                                    Exp: decoded.exp,
                                };

                                localStorage.setItem('UserData', JSON.stringify(userData));
                                localStorage.setItem('UserId', userData.UserId);
                                localStorage.setItem('GroupId', userData.GroupId);

                                // 當 ExclusiveChecked 為 true 時，處理食材
                                if (userData.ExclusiveChecked) {
                                    const exclusiveIngredientsResponse = await fetch(`${import.meta.env.VITE_API_BASEURL}/UserIngredients/ExclusiveIngredientsName?User_Id=${userData.UserId}`);
                                    const exclusiveIngredientsGet = await exclusiveIngredientsResponse.json();

                                    if (exclusiveIngredientsResponse.ok && exclusiveIngredientsGet.exclusiveIngredients.length > 0) {
                                        const exclusiveIngredientsFormatted = exclusiveIngredientsGet.exclusiveIngredients
                                            .map(ingredient => `${ingredient.ingredientId},"${ingredient.exclusiveIngredientName},${ingredient.exclusiveIngredientId},"`)
                                            .join('\n');
                                        localStorage.setItem('ExclusiveIngredients', exclusiveIngredientsFormatted);
                                    }
                                }

                                // 根據 PreferredChecked 呼叫 API
                                if (userData.PreferredChecked) {
                                    const preferredIngredientsResponse = await fetch(`${import.meta.env.VITE_API_BASEURL}/UserIngredients/PreferedIngredientsName?User_Id=${userData.UserId}`);
                                    const preferredIngredientsGet = await preferredIngredientsResponse.json();

                                    if (preferredIngredientsResponse.ok && preferredIngredientsGet.preferredIngredients.length > 0) {
                                        const preferIngredientsFormatted = preferredIngredientsGet.preferredIngredients
                                            .map(ingredient => `${ingredient.ingredientId},"${ingredient.preferIngredientName},${ingredient.preferIngredientId},"`)
                                            .join('\n');
                                        localStorage.setItem('PreferIngredients', preferIngredientsFormatted);
                                    }
                                }

                                window.location.href = '/'; // 頁面跳轉到主頁
                                return true; // 表示登入成功
                            } catch (error) {
                                console.error('解碼 JWT 失敗', error);
                            }
                        } else {
                            this.lineToken = null;
                            localStorage.removeItem('LIFF_STORE:2006541501-jWaBEdv5:accessToken');
                            localStorage.removeItem('LIFF_STORE:2006541501-jWaBEdv5:context');
                            localStorage.removeItem('LIFF_STORE:2006541501-jWaBEdv5:decodedIDToken');
                            localStorage.removeItem('LIFF_STORE:2006541501-jWaBEdv5:IDToken');
                            // 跳轉到 oAuthFirstSignIn
                            router.push('/oAuthFirstSignIn').then(() => {
                                // 在跳轉後可以選擇刷新頁面以確保資料清空
                                // window.location.reload(); // 可以根據需要加上
                            });
                        }
                    }

                }
            } catch (error) {
                console.error('LIFF 初始化失敗', error);
            }
        },

        handleLineLogin() {
            if (!liff.isLoggedIn()) {
                liff.login();
            }
        },
    },
});