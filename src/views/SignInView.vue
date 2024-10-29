<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import VueJwtDecode from 'vue-jwt-decode'; // 引入 jwt-decode 函式庫
const router = useRouter(); // 創建 router 實例
const API_URL = `${import.meta.env.VITE_API_BASEURL}/Users/SignIn`;
const user = ref({
    // 後續記得帳號功能，可以在按下記住密碼button後，將帳號密碼寫入localStorage，登入時讀取localStorage帳密，在tokin到期時一起清除
    email: 'user18@example.com',
    password: 'Password123!',
});
const loginmessage = ref('');
const send = async () => {
    const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(user.value),
        headers: { 'Content-Type': 'application/json' },
    });

    const datas = await response.json();
    if (response.ok) {
        const originaltoken = datas.token; //原始JWT
        console.log('原始jwt', originaltoken);
        const decoded = VueJwtDecode.decode(originaltoken);
        console.log('解碼後jwt', decoded);
        if (originaltoken) {
            localStorage.setItem('token', originaltoken); // 儲存 JWT
            /*  解析JWT 取得並將UserId寫入localStorage.getItem('UserId')
                使用方法 const UserId = localStorage.getItem('UserId');
            */
            try {
                const decoded = VueJwtDecode.decode(originaltoken); // 使用 VueJwtDecode 解碼 JWT
                console.log(decoded);
                if (decoded.certserialnumber) {
                    // console.log(decoded.unique_name);
                    // localStorage.setItem('UserId', decoded.certserialnumber);  // 存入登入用戶的 ID
                    // localStorage.setItem('UserName', username);  // 存入登入用戶的 UserName
                    // console.log(username);
                    const UserData = {
                        UserId: decoded.certserialnumber,
                        Email: decoded.email,
                        UserName: decodeURIComponent(escape(decoded.unique_name)),
                        Phone: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone'],
                        GroupId: decoded.groupsid,
                        ExclusiveChecked: decoded.ExclusiveChecked,
                        PreferredChecked: decoded.PreferredChecked,
                        Exp: decoded.exp, // JWT 過期時間
                        // Email: decoded.email
                    };

                    localStorage.setItem('UserId', UserData.UserId);
                    const UserId = localStorage.getItem('UserId');

                    localStorage.setItem('GroupId', UserData.GroupId);
                    const GroupId = localStorage.getItem('GroupId');

                    localStorage.setItem('UserData', JSON.stringify(UserData));
                    // console.log("已存入的使用者資料:", UserData);
                    // console.log("UserId:", UserId);

                    // 根據 ExclusiveChecked 呼叫 API
                    if (UserData.ExclusiveChecked) {
                        try {
                            const exclusiveIngredientsResponse = await fetch(`${import.meta.env.VITE_API_BASEURL}/UserIngredients/ExclusiveIngredientsName?User_Id=${UserData.UserId}`);
                            const exclusiveIngredientsGet = await exclusiveIngredientsResponse.json();

                            if (exclusiveIngredientsResponse.ok && exclusiveIngredientsGet.exclusiveIngredients.length > 0) {
                                const exclusiveIngredientsFormatted = exclusiveIngredientsGet.exclusiveIngredients
                                    .map(ingredient => `${ingredient.exclusiveIngredientId},"${ingredient.exclusiveIngredientName}"`)
                                    .join('\n');
                                localStorage.setItem('ExclusiveIngredients', exclusiveIngredientsFormatted);
                            }
                        } catch (error) {
                            console.error('獲取專屬食材時出錯:', error);
                        }
                    }

                    // 根據 PreferredChecked 呼叫 API
                    if (UserData.PreferredChecked) {
                        try {
                            const preferredIngredientsResponse = await fetch(`${import.meta.env.VITE_API_BASEURL}/UserIngredients/PreferedIngredientsName?User_Id=${UserData.UserId}`);
                            const preferredIngredientsGet = await preferredIngredientsResponse.json();

                            if (preferredIngredientsResponse.ok && preferredIngredientsGet.preferredIngredients.length > 0) {
                                const preferIngredientsFormatted = preferredIngredientsGet.preferredIngredients
                                    .map(ingredient => `${ingredient.preferIngredientId},"${ingredient.preferIngredientName}"`)
                                    .join('\n');
                                localStorage.setItem('PreferIngredients', preferIngredientsFormatted);
                            }
                        } catch (error) {
                            console.error('獲取偏好食材時出錯:', error);
                        }
                    }



                } else {
                    console.error('找不到 certserialnumber');
                }
            } catch (error) {
                console.error('解碼 JWT 失敗', error);
            }
            alert(datas.message);
            return true; // 表示登入成功
        }
    } else {
        loginmessage.value = datas.message; // 顯示錯誤訊息
        return false; // 表示登入失敗
    }
};

const handleLoginClick = async () => {
    const loginSuccess = await send(); // 先發送請求
    if (loginSuccess) {
        // 只有在登入成功時才刷新頁面並跳轉到 "/"
        location.assign('/'); // 刷新頁面並跳轉到 "/"
    }
};
</script>

<template>
    <div class="col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto">
        <div class="card card-plain mt-8">
            <div class="card-header pb-0 text-left bg-transparent">
                <h3 class="font-weight-bolder text-info text-gradient">歡迎回來</h3>
                <p class="mb-0">輸入Email與密碼登入</p>
            </div>
            <div class="card-body">
                <form @submit.prevent="handleLoginClick">
                    <!-- 修改事件綁定為 handleLoginClick -->
                    <div class="text-danger" role="alert"></div>
                    <div class="form-floating mb-3">
                        <input type="email" class="form-control" name="email" v-model.trim="user.email" id="email"
                            placeholder="Email" required />
                        <label for="email" class="form-label">Email</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="password" class="form-control" name="password" v-model.trim="user.password"
                            id="password" value="" placeholder="密碼" required />
                        <label for="password" class="form-label">密碼</label>
                    </div>
                    <span class="text-danger text-center">{{ loginmessage }}</span>
                    <!-- <div class="form-check form-switch">
                        <input class="form-check-input" />
                        <label class="form-check-label">記住密碼</label>
                    </div> -->
                    <!-- 好像不存在同設備頻繁登出登入的需求，後續再考慮實作此功能 -->
                    <div class="text-center">
                        <button type="submit" class="btn bg-gradient-info w-100 mt-4 mb-0">登入</button>
                        <!-- 按下按鈕後執行 handleLoginClick -->
                    </div>
                </form>
            </div>
            <div class="card-footer text-center pt-0 px-lg-2 px-1">
                <p class="mb-4 text-sm mx-auto">
                    不記得密碼嗎?
                    <RouterLink class="text-info text-gradient font-weight-bold" :to="{ name: 'resetpassword' }">忘記密碼
                    </RouterLink>
                    <br />
                    還沒有註冊過會員嗎?
                    <RouterLink class="text-info text-gradient font-weight-bold" :to="{ name: 'signup' }">註冊
                    </RouterLink>
                    <br />
                    沒有收到驗證電子郵件嗎?
                    <RouterLink class="text-info text-gradient font-weight-bold" :to="{ name: 'resetemailConfirmed' }">
                        重新發送電子郵件確認
                    </RouterLink>
                </p>
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped></style>
