<script setup>
import Swal from 'sweetalert2';
import SoftAlert from '@/components/SoftAlert.vue';
import SoftBadge from '@/components/SoftBadge.vue';
import SoftPagination from '@/components/SoftPagination.vue';
import SoftPaginationItem from '@/components/SoftPaginationItem.vue';
import InventorySkeleton from '@/components/InventorySkeleton.vue';
import { onMounted, ref, computed } from 'vue';

const BaseURL = import.meta.env.VITE_API_BASEURL;
const BaseUrlWithoutApi = BaseURL.replace('/api', ''); // 去掉 "/api" 得到基本的 URL(抓圖片要用的);
const ApiURL = `${BaseURL}/Inventories`;
const userId = localStorage.getItem('UserId');
const InventoriesURL = `${ApiURL}/${userId}`; //抓庫存的API

const inventories = ref([]); //庫存放這
const totalInventories = ref(0); //總共多少項目放這
const ingredientCategory = ref(new Set()); //分類放這，用Set避免重複
const selectedInventories = ref([]); //用戶選到的庫存會被加到這

const isLoading = ref(true); //判斷是否還在載入的flag
const allSelect = ref(false); //判斷全選與否的flag
const isWarning = ref(false); //判斷有無錯誤訊息的flag
const warningMessage = ref('');

//當DOM加載完執行fetch
onMounted(() => {
    fetchInventories();
});

//fetch庫存資料，使用非同步方法
const fetchInventories = async () => {
    try {
        isLoading.value = true;
        const response = await fetch(InventoriesURL);
        if (!response.ok) {
            warningMessage.value = '網路連線有異常';
        }
        const data = await response.json();
        inventories.value = data.map((inventory) => ({
            //因為陣列每項inventory都是物件，要用物件角度思考
            ...inventory, //...展開式表示把原先物件內容還原
            synonymArray: inventory.synonym.split(',').map((synonym) => synonym.trim()), //加入新的一項，拆分synonym然後去空白轉陣列
        }));
        totalInventories.value = inventories.value.length;
        ingredientCategory.value = new Set(inventories.value.map((i) => i.category)); //利用map回傳陣列存進set再存進ref set
    } catch (error) {
        warningMessage.value = `API操作出現錯誤: ${error}`;
    } finally {
        isLoading.value = false;
    }
};

//設定庫存圖片路徑
const getIngredientImageUrl = (fileName) => {
    return `${BaseUrlWithoutApi}/images/ingredient/${fileName}`;
};

//清空列表按鈕的提醒
const alertClearCheck = () => {
    Swal.fire({
        title: '您確定嗎?',
        text: '即將清空所選食材列表',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '清空',
        cancelButtonText: '取消',
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: '清空了!',
                icon: 'success',
            });
        }
    });
};

////篩選功能
//先給定響應式物件存條件資料
const filters = ref({
    category: '',
    visibility: '',
    expiry: '',
    searchWord: '',
});

//利用computed的監測特性來實時更改篩選庫存
const filteredInventories = computed(() => {
    return inventories.value.filter((inventory) => {
        //利用filter逐項遍歷每個inventory項目作篩選，利用5個Boolean來決定項目要不要顯示
        //個人項目篩選(只能看到屬於自己或群組公開的食材)
        const userMatch = inventory.userId === userId || (!inventory.visibility && inventory.userId != userId);
        //分類篩選(用戶沒篩選或篩選符合會回傳true)
        const categoryMatch = !filters.value.category || inventory.category === filters.value.category;
        //權限篩選
        const visibilityMatch =
            !filters.value.visibility || //沒篩選
            (filters.value.visibility === 'group' && !inventory.visibility) || //當用戶選群組而我們的項目剛好是群組項目時true
            (filters.value.visibility === 'private' && inventory.visibility); //同理
        //期限篩選
        const expiryMatch =
            !filters.value.expiry ||
            (filters.value.expiry === 'expiring' && inventory.isExpiring) ||
            (filters.value.expiry === 'expired' && inventory.isExpired) ||
            (filters.value.expiry === 'normal' && !inventory.isExpiring && !inventory.isExpired);
        //搜尋篩選
        const searchMatch =
            !filters.value.searchWord ||
            inventory.ingredientName.toLowerCase().includes(filters.value.searchWord.toLowerCase()) || //因為有英文，要lower一下
            //也要篩一下同義字陣列，因為多一層要再用一個some(檢查是否有item符合條件，就是filter的"只檢查"版本)包起來
            inventory.synonymArray.some((synonym) =>
                synonym.toLowerCase().includes(filters.value.searchWord.toLowerCase())
            );

        //因為filter只會傳回結果是true的項目回陣列，所以可以這樣回傳Boolean來控制
        return userMatch && categoryMatch && visibilityMatch && expiryMatch && searchMatch;
    });
});
////篩選功能結束

//卡片點擊
const activateCard = (event, inventoryId) => {
    const selectedCard = event.currentTarget.closest('.card');
    if (!selectedCard.classList.contains('active')) {
        selectedCard.classList.add('active');
        selectedInventories.value.push(inventoryId);
    } else {
        selectedCard.classList.remove('active');
        const deletingIndex = selectedInventories.value.indexOf(inventoryId);
        if (deletingIndex > -1) {
            selectedInventories.value.splice(deletingIndex, 1);
        }
    }
};

//全選按鈕
const selectAllCard = () => {
    filteredInventories.value.forEach((inventory) => {
        const card = document.querySelector(`.card[data-inventoryId="${inventory.inventoryId}"]`);
        if (card && !card.classList.contains('active')) {
            card.classList.add('active');
            if (!selectedInventories.value.includes(inventory.inventoryId)) {
                selectedInventories.value.push(inventory.inventoryId);
            }
        }
    });
    allSelect.value = true;
};

//取消全選按鈕
const deselectAllCard = () => {
    selectedInventories.value.forEach((inventoryId) => {
        const card = document.querySelector(`.card[data-inventoryId="${inventoryId}"]`);
        //找到有data-inventoryId="已選擇號碼"的card
        if (card) {
            //存在的話，刪掉active
            card.classList.remove('active');
        }
    });
    selectedInventories.value = []; //清掉所選
    allSelect.value = false;
};

//修改功能
const editCard = () => {
    console.log('修改邏輯');
};

//個別刪除功能
const deleteCard = async (inventoryId) => {
    try {
        isLoading.value = true;
        const deleteURL = `${ApiURL}/${inventoryId}`;
        const response = await fetch(deleteURL, { method: 'DELETE' });
        if (!response.ok) {
            warningMessage.value = '刪除失敗，網路連線有異常';
        }
    } catch (error) {
        warningMessage.value = `API操作出現錯誤: ${error}`;
    } finally {
        fetchInventories();
        isLoading.value = false;
    }
};

//群體刪除功能
const deleteCards = () => {
    for (let inventory of selectedInventories.value) {
        deleteCard(inventory);
    }
};
</script>

<template>
    <section class="banner-section">
        <div class="banner-ad bg-primary-subtle block-2">
            <div class="row banner-content pt-5">
                <div class="content-wrapper text-center col-md-12">
                    <h1>庫存 Inventory</h1>
                    <header>
                        <div class="container-fluid">
                            <div class="row py-3"></div>
                        </div>
                    </header>
                </div>
            </div>
        </div>
    </section>

    <section class="pt-5">
        <div class="container-fluid">
            <div class="row justify-content-center">
                <div class="text-center">
                    <h4>
                        在下方食材列表，您可以看到您所屬群組的庫存食材，您可以進行兩種操作(這裡之後用driver.js做導覽)
                    </h4>
                </div>
            </div>
            <div class="row justify-content-center my-5">
                <div class="col-lg-3">
                    <div class="d-flex gap-4 justify-content-center align-items-center">
                        <div class="driver text-center px-3 m-1 rounded-3">
                            <h5><i class="fa-solid fa-box-open mt-3"></i> 管理食材</h5>
                            <p>對個別食材進行數量的修改或刪除</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3">
                    <div class="d-flex gap-4 justify-content-center align-items-center">
                        <div class="driver text-center px-3 m-1 rounded-3">
                            <h5><i class="fa-solid fa-utensils mt-3"></i> 產生食譜</h5>
                            <p>選取食材讓我們為您自動生成食譜</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="py-1">
        <div class="container-fluid">
            <div class="col-sm-10 offset-sm-2 offset-md-0 col-lg-12 d-none d-lg-block">
                <div class="row g-3 py-1 px-3 my-3 d-flex bg-primary-subtle rounded-4 shadow justify-content-between">
                    <div class="col-md-2">
                        <p class="fw-bold">分類 CATEGORY</p>
                    </div>
                    <div class="col-md-2 mt-2">
                        <select class="form-select" v-model="filters.category">
                            <option value="">類別</option>
                            <option v-for="category in ingredientCategory" :value="category">
                                {{ category }}
                            </option>
                        </select>
                    </div>
                    <div class="col-md-2 mt-2">
                        <select class="form-select" v-model="filters.visibility">
                            <option value="">群組/私有</option>
                            <option value="group">群組</option>
                            <option value="private">私有</option>
                        </select>
                    </div>
                    <div class="col-md-2 mt-2">
                        <select class="form-select" v-model="filters.expiry">
                            <option value="">期限</option>
                            <option value="expiring">即期</option>
                            <option value="expired">過期</option>
                            <option value="normal">正常</option>
                        </select>
                    </div>
                    <div class="col-md-3 mt-2">
                        <input
                            type="text"
                            class="form-control w-100 text-center"
                            placeholder="搜尋"
                            v-model="filters.searchWord"
                        />
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section>
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-12">
                    <div class="banner-ad p-3">
                        <div class="tabs-header d-flex justify-content-between">
                            <h3>食材列表</h3>
                            <div>
                                <button class="btn blur shadow fs-6 me-1">歷史編輯紀錄</button>
                                <button v-if="allSelect" class="btn blur shadow fs-6 me-1" @click="deselectAllCard">
                                    取消全選
                                </button>
                                <button v-else class="btn blur shadow fs-6 me-1" @click="selectAllCard">全選</button>
                                <button class="btn blur shadow fs-6 text-danger me-1" @click="deleteCards">刪除</button>
                            </div>
                        </div>
                        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
                            <div v-if="isLoading" class="col"><InventorySkeleton></InventorySkeleton></div>
                            <div
                                v-else
                                class="col"
                                v-for="inventory in filteredInventories"
                                :key="inventory.inventoryId"
                            >
                                <div
                                    class="card h-100 p-0 shadow-sm position-relative"
                                    :data-inventoryId="inventory.inventoryId"
                                >
                                    <SoftBadge
                                        v-if="inventory.isExpiring"
                                        variant="gradient"
                                        color="info"
                                        class="position-absolute top-2 start-2"
                                    >
                                        即將過期
                                    </SoftBadge>
                                    <SoftBadge
                                        v-if="inventory.isExpired"
                                        variant="gradient"
                                        color="warning"
                                        class="position-absolute top-2 start-2"
                                    >
                                        已過期
                                    </SoftBadge>
                                    <span class="position-absolute top-0 end-0 p-2 z-index-3">
                                        <button class="card-control" @click.stop="editCard(inventory.inventoryId)">
                                            <i class="fa-solid fa-pencil"></i>
                                        </button>
                                        <button class="card-control" @click.stop="deleteCard(inventory.inventoryId)">
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </span>
                                    <div
                                        class="card-body d-flex flex-column"
                                        @click="activateCard($event, inventory.inventoryId)"
                                    >
                                        <div class="image-container mb-3">
                                            <img
                                                :src="getIngredientImageUrl(inventory.photo)"
                                                :alt="inventory.ingredientName"
                                                class="product-image"
                                            />
                                            <span class="amount-badge"
                                                >{{ inventory.quantity }}{{ inventory.unit }}</span
                                            >
                                        </div>
                                        <h5 class="card-title text-center">{{ inventory.ingredientName }}</h5>
                                        <p class="card-text text-center">{{ inventory.category }}</p>
                                        <p class="card-text text-center mt-auto">{{ inventory.expiryDate }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section>
        <div
            class="h-screen flex justify-center items-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500"
        >
            <div class="p-8 rounded-lg shadow-lg bg-white w-96">
                <div class="mb-4 text-center">
                    <img
                        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                        alt="Instagram Logo"
                        class="h-12"
                    />
                </div>
                <div class="mb-4">
                    <input
                        type="text"
                        placeholder="Inventory ID"
                        class="w-full py-2 px-3 rounded-lg border border-gray-300"
                    />
                </div>
                <div class="mb-4">
                    <input
                        type="text"
                        placeholder="Group ID"
                        class="w-full py-2 px-3 rounded-lg border border-gray-300"
                    />
                </div>
                <div class="mb-4">
                    <input
                        type="text"
                        placeholder="User ID"
                        class="w-full py-2 px-3 rounded-lg border border-gray-300"
                    />
                </div>
                <div class="mb-4">
                    <input
                        type="text"
                        placeholder="Ingredient ID"
                        class="w-full py-2 px-3 rounded-lg border border-gray-300"
                    />
                </div>
                <div class="mb-4">
                    <input
                        type="text"
                        placeholder="Quantity"
                        class="w-full py-2 px-3 rounded-lg border border-gray-300"
                    />
                </div>
                <div class="mb-4">
                    <input
                        type="text"
                        placeholder="Expiry Date"
                        class="w-full py-2 px-3 rounded-lg border border-gray-300"
                    />
                </div>
                <div class="mb-4">
                    <input
                        type="text"
                        placeholder="Is Expiring"
                        class="w-full py-2 px-3 rounded-lg border border-gray-300"
                    />
                </div>
                <div class="mb-4">
                    <input
                        type="text"
                        placeholder="Visibility"
                        class="w-full py-2 px-3 rounded-lg border border-gray-300"
                    />
                </div>
                <div class="text-center">
                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    </section>

    <section class="banner-ad d-flex justify-content-center">
        <div class="row banner-content p-3">
            <div class="content-wrapper text-center col-md-12"></div>
            <soft-pagination color="info" class="p-0 m-0">
                <soft-pagination-item prev />
                <soft-pagination-item label="1" active />
                <soft-pagination-item label="2" />
                <soft-pagination-item label="3" />
                <soft-pagination-item next />
            </soft-pagination>
        </div>
    </section>

    <section>
        <div
            class="offcanvas offcanvas-end rounded-3"
            data-bs-scroll="true"
            data-bs-backdrop="false"
            tabindex="-1"
            id="offcanvasIngredient"
        >
            <div class="offcanvas-header justify-content-center">
                <button
                    type="button"
                    class="btn-close rounded-circle bg-dark"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                ></button>
            </div>
            <div class="offcanvas-body">
                <div class="order-md-last">
                    <h4 class="d-flex justify-content-between align-items-center mb-3">
                        <span class="text-dark">您所選的食材</span>
                        <span class="badge bg-dark rounded-pill">3</span>
                    </h4>
                    <ul class="list-group mb-3">
                        <li class="list-group-item d-flex justify-content-between lh-sm">
                            <div>
                                <h6 class="my-0">青椒</h6>
                                <small class="text-body-secondary">蔬菜類</small>
                            </div>
                            <span class="text-body-secondary">到期日: 2024/10/13</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between lh-sm">
                            <div>
                                <h6 class="my-0">青椒</h6>
                                <small class="text-body-secondary">蔬菜類</small>
                            </div>
                            <span class="text-body-secondary">到期日: 2024/10/13</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between lh-sm">
                            <div>
                                <h6 class="my-0">青椒</h6>
                                <small class="text-body-secondary">蔬菜類</small>
                            </div>
                            <span class="text-body-secondary">到期日: 2024/10/13</span>
                        </li>
                    </ul>

                    <RouterLink class="w-100 btn bg-gradient-info shadow fs-5" :to="{ name: 'GenerateRecipe' }"
                        >產生食譜</RouterLink
                    >
                    <button class="w-100 btn blur text-danger shadow fs-5" @click="alertClearCheck">
                        清空所選食材
                    </button>
                </div>
            </div>
        </div>
    </section>

    <section class="pt-3">
        <div class="container-fluid">
            <div class="row justify-content-center">
                <div class="col-lg-3">
                    <RouterLink
                        class="btn bg-primary-subtle text-dark shadow fs-5 w-100"
                        :to="{ name: 'GenerateRecipe' }"
                        >產生食譜</RouterLink
                    >
                </div>
                <div class="col-lg-3">
                    <button
                        type="button"
                        class="btn blur shadow text-dark fs-5 w-100"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasIngredient"
                        aria-controls="offcanvasIngredient"
                    >
                        查看您選擇的食材
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="css" scoped>
/* General Styles */
.container-fluid {
    padding: 0;
    margin: 0;
    max-width: 100vw;
}

/* Banner Styles */
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

.card {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.card.active {
    background-color: rgba(253, 255, 164);
    opacity: 80%;
}

.card-body {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}

.card-control {
    cursor: pointer;
    background: transparent;
    border: none;
    padding: 0 3px 0 3px;
}

.card-control:hover {
    transform: scale(1.1);
}

.image-container {
    width: 100%;
    height: 200px;
    margin-top: 15px;
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f0f0f0;
    border-radius: 10px;
}

.product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.amount-badge {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.25em 0.75em;
    font-size: 0.875rem;
    font-weight: 700;
    color: black;
    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid black;
    border-radius: 1rem;
}

.product-name {
    margin-top: 20px;
    text-align: center;
    width: 100%;
}

.product-category,
.expiry-date {
    text-align: center;
    width: 100%;
}

.expiry-date {
    position: absolute;
    bottom: 0%;
    left: 50%;
    transform: translateX(-50%);
}

.driver {
    box-shadow:
        rgba(0, 0, 0, 0.16) 0px 10px 36px 0px,
        rgba(0, 0, 0, 0.06) 0px 0px 0px 1px !important;
    cursor: pointer;
}
.driver:hover {
    transform: scale(1.05);
}
</style>
