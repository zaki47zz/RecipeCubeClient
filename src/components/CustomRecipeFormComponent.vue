<script setup>
import { ref, computed, watchEffect, onMounted } from 'vue';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';
const recipeData = ref({
    photo: '',
    recipeName: '',
    restriction: null,
    category: '',
    detailedCategory: '',
    visibility: null,
    // time: '',
    selectedIngredients: [],
    ingredientQuantities: [],
    steps: '',
    seasoning: '',
    userId: '0',
    isCustom: true,
    status: true,
    westEast: null,
    previewUrl: '',
});
const BaseURL = import.meta.env.VITE_API_BASEURL; // https://localhost:7188/api
const BaseUrlWithoutApi = BaseURL.replace('/api', ''); // 去掉 "/api" 得到基本的 URL;
const POSTAPI = `${BaseURL}/Recipes`
const getIngredientsApi = `${BaseURL}/Ingredients`
const ingredients = ref([]);
const selectedIngredients = ref([]);
const groupedIngredients = ref([]);
// 使用fetch獲取數據 (這段寫在recipeStore了)

const groupIngredientsByCategory = (data) => {
    const grouped = data.reduce((acc, ingredient) => {
        // 如果該分類不存在，先創建一個分類
        let category = acc.find(group => group.category === ingredient.category);
        if (!category) {
            category = { category: ingredient.category, ingredients: [] };
            acc.push(category);
        }
        // 將食材加入對應分類
        category.ingredients.push(ingredient);
        return acc;
    }, []);

    groupedIngredients.value = grouped;
};
const fetchIngredients = async () => {
    try {
        const response = await fetch(getIngredientsApi);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();  // 只需要調用一次 .json()
        ingredients.value = data;
        groupIngredientsByCategory(data);  // 將數據分組
        console.log("食材data:", data);  // 打印出來檢查
        // console.log("分組後的食材:", groupedIngredients.value);  // 檢查分組結果 
    } catch (error) {
        console.error("Fetch Fail", error);
    }
}
onMounted(() => {
    const storedUserId = localStorage.getItem('UserId');
    if (storedUserId) {
        recipeData.value.userId = storedUserId;
        // console.log("userId", recipeData.value.userId)
    }
    // console.log("store:", storedUserId)
    // fetchRecipes();
    fetchIngredients();
});
function customLabel(option) {
    // 合併名稱和同義字來讓它們參與過濾
    const label = option.ingredientName || '';
    const synonym = option.synonym ? ` (${option.synonym})` : '';

    // 返回顯示的名稱和同義字
    return `${label}${synonym}`;
}

const ingredientQuantities = ref({});

// 使用 watchEffect 自動追蹤 selectedIngredients 的變化
watchEffect(() => {
    // 清空沒有選中的食材數量
    Object.keys(ingredientQuantities.value).forEach((id) => {
        if (!selectedIngredients.value.some(ingredient => ingredient.ingredientId === parseInt(id))) {
            delete ingredientQuantities.value[id];
        }
    });

    // 對於每個新的選中的食材，如果它不在 ingredientQuantities 中，就添加它
    selectedIngredients.value.forEach((ingredient) => {
        if (!ingredientQuantities.value[ingredient.ingredientId]) {
            ingredientQuantities.value[ingredient.ingredientId] = '';
        }
    });
    console.log(ingredientQuantities.value)
});
const fileName = ref('');
// 處理圖片上傳
const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        recipeData.value.photo = file; // 保留原始 file
        console.log("圖片:", recipeData.value.photo);
        const reader = new FileReader();
        reader.onload = (e) => {
            // 這裡是用於顯示圖片預覽的 URL
            recipeData.value.previewUrl = e.target.result;
        };
        reader.readAsDataURL(file);
    }
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
    recipeData.value.detailedCategory = '';
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
const saveRecipe = async () => {
    recipeData.value.steps = stepsList.value.map(step => step.description).join('。');
    recipeData.value.seasoning = seasoningsList.value.map(seasoning => seasoning.description).join(', ');
    recipeData.value.selectedIngredients = selectedIngredients.value.map(ingredient => parseInt(ingredient.ingredientId));

    // 儲存食材和對應數量
    // 只儲存每個食材對應的數量
    recipeData.value.ingredientQuantities = Object.fromEntries(
        Object.entries(ingredientQuantities.value).map(([key, value]) => [parseInt(key), parseFloat(value)])
    );
    console.log("")
    console.log("保存食譜資料:", recipeData.value);
    const formData = new FormData();
    // 添加圖片
    if (recipeData.value.photo) {
        formData.append('photo', recipeData.value.photo);
    }
    formData.append('recipeName', recipeData.value.recipeName);
    formData.append('restriction', recipeData.value.restriction);
    formData.append('category', recipeData.value.category);
    formData.append('detailedCategory', recipeData.value.detailedCategory);
    formData.append('visibility', recipeData.value.visibility);

    // 添加 selectedIngredients
    recipeData.value.selectedIngredients.forEach((ingredientId, index) => {
        formData.append(`selectedIngredients[${index}]`, ingredientId);
    });
    // formData.append('ingredientQuantities', JSON.stringify(recipeData.value.ingredientQuantities));
    Object.entries(recipeData.value.ingredientQuantities).forEach(([ingredientId, quantity], index) => {
        formData.append(`ingredientQuantities[${ingredientId}]`, quantity);
    });
    formData.append('steps', recipeData.value.steps);
    formData.append('seasoning', recipeData.value.seasoning);
    formData.append('userId', recipeData.value.userId);
    formData.append('isCustom', recipeData.value.isCustom);
    formData.append('status', recipeData.value.status);
    formData.append('westEast', recipeData.value.westEast);
    // 在這裡可以調用 API 來提交食譜資料4
    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }
    try {
        const response = await fetch(POSTAPI, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            // throw new Error('儲存食譜失敗')
            const errorData = await response.json();
            console.error('Error details:', errorData);
            throw new Error('儲存食譜失敗');
        }
        const data = await response.json();
        console.log('Recipe saved successfully:', data);
    } catch (error) {
        console.error("error saving recipe:", error)
    }
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
                            <div v-if="!recipeData.previewUrl" class="text-center">
                                <i class="fas fa-cloud-upload-alt mb-2" style="font-size: 48px; color: #6c757d"></i>
                                <p class="mb-0 fs-6" style="color: #6c757d">點擊或拖曳上傳食譜照片</p>
                            </div>
                            <img v-else :src="recipeData.previewUrl" alt="食譜預覽"
                                style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;" />
                            <input type="file" class="position-absolute top-0 start-0 w-100 h-100 opacity-0"
                                accept="image/*" @change="handlePhotoUpload" />
                        </div>
                    </div>
                </div>
                <div class="mb-4">
                    <input type="text" v-model="recipeData.recipeName" class="form-control w-100 fs-4 text-center"
                        placeholder="輸入料理名稱" />
                </div>

                <div class="mb-2">
                    <h5 class="mb-2">食譜設定</h5>
                    <div class="row g-2">
                        <div class="col-6">
                            <select class="form-select fs-6 text-center" v-model="recipeData.restriction">
                                <option :value="null">葷素</option>
                                <option :value="false">葷</option>
                                <option :value="true">素</option>
                            </select>
                        </div>
                        <div class="col-6">
                            <select class="form-select fs-6 text-center" v-model="recipeData.visibility">
                                <option :value="null">權限</option>
                                <option :value="true">群組</option>
                                <option :value="false">私有</option>
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
                            <select v-model="recipeData.detailedCategory" class="form-select fs-6 text-center">
                                <option value="">選擇細部類別</option>
                                <option v-for="subcategory in subcategoryOptions" :key="subcategory"
                                    :value="subcategory">
                                    {{ subcategory }}
                                </option>
                            </select>
                        </div>
                        <div class="col-6">
                            <select class="form-select fs-6 text-center" v-model="recipeData.westEast">
                                <option :value="null">中式/西式</option>
                                <option :value="true">西式</option>
                                <option :value="false">中式</option>
                            </select>
                        </div>
                        <div class="col-6">
                            <input type="text" v-model="recipeData.time" class="form-control fs-6 text-center"
                                placeholder="輸入料理所需時間，例如: 30分鐘" />
                        </div>
                    </div>
                </div>
            </div>

            <h5 class="mb-0">所需食材</h5>
            <div class="my-auto p-3 h-100" style="background-color: rgba(255, 255, 255, 0.5); border-radius: 8px">

                <multiselect v-model="selectedIngredients" :options="groupedIngredients" placeholder="搜尋或選擇食材 (可以多選)"
                    :multiple="true" :close-on-select="false" group-label="category" group-values="ingredients"
                    :group-select="false" track-by="ingredientId" :custom-label="customLabel">
                    <span slot="noResult">找不到該食材</span>

                </multiselect>
                <div class="selected-ingredients mt-3">
                    <div v-for="ingredient in selectedIngredients" :key="ingredient.ingredientId" class="mb-2">
                        <label>{{ ingredient.ingredientName }} 數量：</label>
                        <input type="number" v-model="ingredientQuantities[ingredient.ingredientId]"
                            class="form-control w-50" placeholder="請輸入數量" />
                        <label>{{ ingredient.unit }}</label>
                    </div>
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