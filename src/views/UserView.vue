<script setup>
// 引入 ref API，用來管理響應式狀態
import { ref } from 'vue';

// 定義一個響應式變數 username，儲存使用者名稱
const username = ref('');
// 動態修改橫幅標題
const section = ref('帳戶設定 Account settings');

// 從 localStorage 取得使用者資料並解析為 JSON，儲存到 storedUserData 中
const storedUserData = JSON.parse(localStorage.getItem('UserData'));
console.log(storedUserData);
// 定義選單項目，包含標籤名稱；activeIndex 將會控制選擇的項目
const menuItems = ref(['基本資料', '飲食偏好', '群組']);

const activeIndex = ref(-1);

// setActive 函式用於設定目前選中的選單項目
const setActive = (index) => {
    activeIndex.value = index; // 更新 activeIndex，根據點擊的項目
    section.value = menuItems.value[activeIndex.value]; // 根據 index 動態更新橫幅標題
};

const AccountSettings = ref({
    "user_Id": storedUserData?.UserId, // 從 localStorage 中取得使用者ID
    "userName": storedUserData?.UserName || "", // 預設使用者名稱
    "phone": storedUserData?.Phone || "" // 預設使用者電話
});
// 發送請求的函式
const sendBasic = async () => {
    const response = await fetch(API_URL_AccountSettings, {
        method: 'PUT',
        body: JSON.stringify(AccountSettings.value), // 將 AccountSettings 轉為 JSON 格式
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
        const updatedUserData = {
            ...storedUserData, // 保留其他資料
            UserName: AccountSettings.value.userName, // 更新姓名
            Phone: AccountSettings.value.phone // 更新電話
        }

        // 更新 localStorage
        localStorage.setItem('UserData', JSON.stringify(updatedUserData));
        alert('修改成功！'); // 顯示成功訊息


    } else {
        const data = await response.json();
        alert("修改失敗：" + data.Message); // 顯示錯誤訊息
    }
};

const API_URL_AccountSettings = `${import.meta.env.VITE_API_BASEURL}/Users/AccountSettings`;
const preferIngredientsArray = ref([]); // 儲存偏好食材
const exclusiveIngredientsArray = ref([]); // 儲存不可食用食材

const loadPreferIngredients = () => {
    const preferIngredientsString = localStorage.getItem('PreferIngredients');
    preferIngredientsArray.value = preferIngredientsString ? preferIngredientsString.split('\n').map(item => {
        const parts = item.split(',');
        return { id: parts[0], name: parts[1].replace(/"/g, '') };
    }) : [];
};
loadPreferIngredients();

const loadExclusiveIngredients = () => {
    const exclusiveIngredientsString = localStorage.getItem('ExclusiveIngredients');
    exclusiveIngredientsArray.value = exclusiveIngredientsString ? exclusiveIngredientsString.split('\n').map(item => {
        const parts = item.split(',');
        return { id: parts[0], name: parts[1].replace(/"/g, '') };
    }) : [];
};
loadExclusiveIngredients();

// 處理按鈕點擊事件
const handleButtonClick = (id) => {
    console.log(`按鈕 ID: ${id} 被點擊`); // 你可以在這裡添加更多處理邏輯
};

const API_URL_ExclusiveIngredientsDelete = `${import.meta.env.VITE_API_BASEURL}/UserIngredients/ExclusiveIngredientsDelete`;
const API_URL_PreferedIngredientsDelete = `${import.meta.env.VITE_API_BASEURL}/UserIngredients/PreferedIngrediensDelete`;

// 刪除 API 呼叫
const sendDelPreFood = async (ingredientId) => {
    try {
        const response = await fetch(`${API_URL_PreferedIngredientsDelete}?id=${ingredientId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            alert('刪除成功！');
            preferIngredientsArray.value = preferIngredientsArray.value.filter(item => item.id !== ingredientId);
            updateLocalStorage(); // 同步更新 localStorage
        } else {
            const data = await response.json();
            alert("刪除失敗：" + data.Message);
        }
    } catch (error) {
        alert("刪除請求失敗：" + error.message);
    }
};

const sendDelEXFood = async (ingredientId) => {
    try {
        const response = await fetch(`${API_URL_ExclusiveIngredientsDelete}?id=${ingredientId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            alert('刪除成功！');
            exclusiveIngredientsArray.value = exclusiveIngredientsArray.value.filter(item => item.id !== ingredientId);
            updateLocalStorage(); // 同步更新 localStorage
        } else {
            const data = await response.json();
            alert("刪除失敗：" + data.Message);
        }
    } catch (error) {
        alert("刪除請求失敗：" + error.message);
    }
};

// 更新 localStorage 的方法
const updateLocalStorage = () => {
    const exingredientsString = exclusiveIngredientsArray.value.map(item => `${item.id},"${item.name}"`).join('\n');
    localStorage.setItem('ExclusiveIngredients', exingredientsString);
    const preingredientsString = preferIngredientsArray.value.map(item => `${item.id},"${item.name}"`).join('\n');
    localStorage.setItem('PreferIngredients', preingredientsString);
};

// 點擊 X 按鈕的處理函式
const handleEXDelete = (ingredientId) => {
    sendDelEXFood(ingredientId);
};

// 點擊 X 按鈕的處理函式
const handlePreDelete = (ingredientId) => {
    sendDelPreFood(ingredientId);
};
</script>



<template>
    <!-- 橫幅區塊 -->
    <section class="banner-section">
        <div class="banner-ad bg-info-subtle block-2">
            <div class="row banner-content pt-5">
                <div class="content-wrapper text-center col-md-12">
                    <h1 class="pb-5">{{ section }}</h1>
                </div>
            </div>
        </div>
    </section>

    <div class="row">
        <!-- 左側選單 -->
        <div class="col-12 col-md-3 p-5">
            <div class="list-group">
                <!-- 使用 v-for 迴圈渲染選單項目 -->
                <!-- 根據activeIndex 動態設定選單項目樣式 -->
                <!-- ARIA 屬性幫助無障礙性 -->
                <a v-for="(item, index) in menuItems" :key="index" href="#"
                    class="list-group-item list-group-item-action" :class="{ active: activeIndex === index }"
                    :aria-current="activeIndex === index ? 'true' : null" @click="setActive(index)">
                    <!-- 點擊事件，調用 setActive 函式 -->
                    {{ item }}
                </a>
            </div>
        </div>

        <!-- 右側內容區域 -->
        <div class="col-12 col-md-9 p-5">
            <!-- 根據 activeIndex 動態顯示對應的內容 -->
            <div v-if="activeIndex === 0">
                <form @submit.prevent="sendBasic"> <!-- 使用 @submit.prevent 阻止表單的默認提交行為 -->
                    <p>
                        <strong>姓名:</strong>
                        <input type="text" v-model="AccountSettings.userName" placeholder="請輸入姓名" required />
                    </p>
                    <p>
                        <strong>Email:</strong> {{ storedUserData?.Email }} <!-- Email 不可修改 -->
                    </p>
                    <p>
                        <strong>電話:</strong>
                        <input type="text" v-model="AccountSettings.phone" placeholder="請輸入電話" required />
                    </p>
                    <button class="btn bg-gradient-info w-50 mt-4 mb-0" type="submit">確認修改</button>
                </form>
            </div>

            <div v-else-if="activeIndex === 1">
                <p><strong>偏好食材:</strong></p>
                <div>
                    <button v-for="(item, index) in preferIngredientsArray" :key="index" :id="item.id"
                        class="btn btn-info m-1" @click="handleButtonClick(item.id)">
                        {{ item.name }}
                        <!-- X 按鈕 -->
                        <button type="button" class="btn-close ms-2" aria-label="Close"
                            @click="handlePreDelete(item.id)"></button>
                    </button>
                </div>

                <p><strong>不可食用食材:</strong></p>
                <div>
                    <button v-for="(item, index) in exclusiveIngredientsArray" :key="index" :id="item.id"
                        class="btn btn-danger m-1" @click="handleButtonClick(item.id)">
                        {{ item.name }}
                        <!-- X 按鈕 -->
                        <button type="button" class="btn-close ms-2" aria-label="Close"
                            @click="handleEXDelete(item.id)"></button>
                    </button>
                </div>
            </div>

            <div v-else-if="activeIndex === 2">
                <p><strong>群組:</strong> {{ storedUserData?.GroupId }}</p>
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped>
/* 橫幅樣式 */
.banner-section {
    width: 100vw;
    margin-left: calc(50% - 50vw);
    overflow: hidden;
}

.banner-ad {
    position: relative;
    overflow: hidden;
    background: url('@/assets/img/ForBackground/ad-bg-pattern.png') no-repeat center / cover;
}
</style>
