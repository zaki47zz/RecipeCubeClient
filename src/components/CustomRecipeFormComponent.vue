<script setup>
import { ref, computed, watchEffect } from 'vue';

const recipeData = ref({
    photo: null,
    recipeName: '',
    restriction: '',
    category: '',
    subcategory: '',
    visibility: '',
    cookingTime: '',
    ingredients: [],
    steps: '',
    seasonings: ''
});
// 處理圖片上傳
const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    recipeData.value.photo = file;
};
const categoryOptions = {
    "主餐": ["麵食", "飯食", "粥", "排餐", "鹹派", "火鍋", "焗烤"],
    "副餐": ["肉類料理", "青菜料理", "海鮮料理"],
    "湯品": ["無"],
    "甜點": ["甜", "鹹"]
};
const subcategoryOptions = ref([]);

// 使用 watchEffect 來自動更新子類別選項
watchEffect(() => {
    console.log(recipeData.value.category)
    if (recipeData.value.category) {
        subcategoryOptions.value = categoryOptions[recipeData.value.category] || [];
    } else {
        subcategoryOptions.value = [];
    }
    // 清空選擇的細部類別
    recipeData.value.subcategory = '';
});

const stepsList = ref([{ description: '' }]);
const seasoningsList = ref([{ description: '' }]);
// 添加新步驟
const addStep = () => {
    stepsList.value.push({ description: '' });
    console.log('添加步驟', stepsList.value); // 確認事件有被調用
};

// 移除步驟
const removeStep = (index) => {
    stepsList.value.splice(index, 1);
    console.log('移除步驟', stepsList.value.steps); // 確認事件有被調用
};
// 添加新調味料
const addSeasoning = () => {
    seasoningsList.value.push({ description: '' });
};

// 移除調味料
const removeSeasoning = (index) => {
    seasoningsList.value.splice(index, 1);
};
// 保存食譜
const saveRecipe = () => {
    recipeData.value.steps = stepsList.value.map(step => step.description).join('。');
    recipeData.value.seasonings = seasoningsList.value.map(seasoning => seasoning.description).join(', ');
    console.log("保存食譜資料:", recipeData.value);
    // 在這裡可以調用 API 來提交食譜資料
};
</script>

<template>
    <div>
        <div class="row g-4">
            <div class="col-12">
                <div class="mb-3">
                    <div class="d-flex flex-column align-items-center">
                        <div class="photo-upload-area mb-2 position-relative" style="
                                            width: 100%;
                                            height: 400px;
                                            background-color: #f8f9fa;
                                            border: 2px dashed #ced4da;
                                            border-radius: 8px;
                                            display: flex;
                                            justify-content: center;
                                            align-items: center;
                                            cursor: pointer;
                                        ">
                            <div class="text-center">
                                <i class="fas fa-cloud-upload-alt mb-2" style="font-size: 48px; color: #6c757d"></i>
                                <p class="mb-0 fs-6" style="color: #6c757d">點擊或拖曳上傳食譜照片</p>
                            </div>
                            <input type="file" class="position-absolute top-0 start-0 w-100 h-100 opacity-0"
                                accept="image/*" />
                        </div>
                    </div>
                </div>
                <div class="mb-4">
                    <input type="text" class="form-control w-100 fs-4 text-center" placeholder="輸入料理名稱" />
                </div>

                <div class="mb-2">
                    <h5 class="mb-2">食譜設定</h5>
                    <div class="row g-2">
                        <div class="col-6">
                            <select class="form-select fs-6 text-center">
                                <option>葷素</option>
                                <option>葷</option>
                                <option>素</option>
                            </select>
                        </div>
                        <div class="col-6">
                            <select class="form-select fs-6 text-center">
                                <option>權限</option>
                                <option>群組</option>
                                <option>私有</option>
                            </select>
                        </div>
                        <div class="col-6">
                            <select v-model="recipeData.category" class="form-select fs-6 text-center">
                                <option value="">選擇主類別</option>
                                <option v-for="(subcategories, category) in categoryOptions" :key="category"
                                    :value="category">
                                    {{ category }}
                                </option>
                            </select>
                        </div>
                        <div class="col-6">
                            <select v-model="recipeData.subcategory" class="form-select fs-6 text-center">
                                <option value="">選擇細部類別</option>
                                <option v-for="subcategory in subcategoryOptions" :key="subcategory"
                                    :value="subcategory">
                                    {{ subcategory }}
                                </option>
                            </select>
                        </div>

                        <div class="col-12">
                            <input type="text" class="form-control fs-6 text-center" placeholder="輸入料理所需時間，例如: 30分鐘" />
                        </div>
                    </div>
                </div>
            </div>

            <h5 class="mb-0">所需食材</h5>
            <div class="my-auto p-3 h-100" style="background-color: rgba(255, 255, 255, 0.5); border-radius: 8px">
                <select class="form-select fs-6">
                    <option>用Select2</option>
                </select>
                <div class="selected-ingredients mt-3">
                    <!-- 這裡可以添加已選擇的食材列表 -->
                    AAA
                </div>
            </div>
        </div>

        <!-- 步驟和調味料區 -->
        <div class="row mt-4 g-4">
            <div class="col-12">
                <h5 class="mb-2">步驟</h5>
                <div v-for="(step, index) in stepsList" :key="index"
                    class="mt-1 d-flex justify-content-between align-items-center gap-3">
                    <div class="circle-number">{{ index + 1 }}</div>
                    <input type="text" v-model="step.description" class="form-control fs-6 text-center"
                        placeholder="輸入步驟描述" />
                    <button class="remove-step-button" @click="removeStep(index)">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <!-- +步驟按鈕 -->
                <div class="mt-3 d-flex justify-content-center">
                    <div class="step-button" @click="addStep"><i class="fa-solid fa-plus"></i> 步驟</div>
                </div>
            </div>
            <!-- 調味料區域 -->
            <div class="col-12 mt-4">
                <h5 class="mb-2">調味料</h5>
                <div v-for="(seasoning, index) in seasoningsList" :key="index"
                    class="mt-1 d-flex justify-content-between align-items-center gap-3">
                    <div class="circle-number">{{ index + 1 }}</div>
                    <input type="text" v-model="seasoning.description" class="form-control fs-6 text-center"
                        placeholder="輸入調味料 (ex.鹽巴 5克)" />
                    <button class="remove-step-button" @click="removeSeasoning(index)">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <!-- +調味料按鈕 -->
                <div class="mt-3 d-flex justify-content-center">
                    <div class="step-button" @click="addSeasoning"><i class="fa-solid fa-plus"></i> 調味料</div>
                </div>

            </div>
        </div>

        <!-- 保存按鈕 -->
        <div class="row mt-4">
            <div class="col-12 text-center">
                <button class="btn blur text-dark shadow fs-5 w-30" @click="saveRecipe">保存食譜</button>
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped>
.circle-number {
    width: 1.8rem;
    height: 1.8rem;
    background-color: #494948;
    /* 背景顏色 */
    color: white;
    /* 文字顏色 */
    border-radius: 50%;
    /* 使元素變成圓形 */
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    font-weight: bold;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.step-button {
    font-weight: 600;
    font-size: larger;
}

.step-button:hover {
    color: #595959;
    /* 懸停時變色 */
    cursor: pointer;
    transform: scale(1.1);
    /* 懸停時放大效果 */
    transition:
        transform 0.2s,
        background-color 0.2s;
    /* 添加平滑動畫 */
}

.remove-step-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #494948;
    cursor: pointer;
    transition: transform 0.2s;
}

.remove-step-button:hover {
    transform: scale(1.2);
    color: #ff4c4c;
}
</style>