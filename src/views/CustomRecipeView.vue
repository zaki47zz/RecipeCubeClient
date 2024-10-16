<script setup>
import Isotope from 'isotope-layout';
import Swal from 'sweetalert2';
import WineWithBeef from '@/assets/img/ForComponent/WineWithBeef.jpg';
import BannerRecipe from '@/assets/img/ForBackground/banner-recipe.jpg';
import SoftBadge from '@/components/SoftBadge.vue';
import SoftPagination from '@/components/SoftPagination.vue';
import SoftPaginationItem from '@/components/SoftPaginationItem.vue';

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
</script>

<template>
    <section class="banner-section">
        <div class="banner-ad bg-warning-subtle block-2">
            <div class="row banner-content pt-5">
                <div class="content-wrapper text-center col-md-12">
                    <h1>自訂食譜 Custom Recipe</h1>
                    <header>
                        <div class="container-fluid">
                            <div class="row py-3"></div>
                        </div>
                    </header>
                </div>
            </div>
        </div>
    </section>

    <!-- 固定按鈕觸發 Offcanvas -->
    <button
        class="offcanvas-button btn blur rounded-3 shadow position-absolute"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvas"
        aria-controls="offcanvas"
    >
        <strong>參考現有食譜</strong>
    </button>

    <!-- Offcanvas -->
    <div class="offcanvas offcanvas-start blur" tabindex="-1" id="offcanvas" aria-labelledby="offcanvasLabel">
        <div class="offcanvas-header justify-content-center">
            <h5 class="offcanvas-title" id="offcanvasLabel">已有食譜</h5>
            <button
                class="btn-close rounded-circle bg-secondary"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
            ></button>
        </div>
        <div class="offcanvas-body">
            <!-- 搜尋欄 -->
            <div class="search-box mb-3">
                <input type="text" class="form-control w-100" placeholder="搜尋" />
            </div>
            <hr />
            <!-- 篩選按鈕 -->
            <div class="filter-buttons mb-3">
                <select class="form-select w-100 mb-2">
                    <option selected>葷素</option>
                    <option value="XX">XX</option>
                </select>
                <select class="form-select w-100 mb-2">
                    <option selected>類別</option>
                    <option value="XX">XX</option>
                </select>
                <select class="form-select w-100 mb-2">
                    <option selected>細部類別</option>
                    <option value="XX">XX</option>
                </select>
                <select class="form-select w-100 mb-2">
                    <option selected>自訂食譜</option>
                    <option value="XX">XX</option>
                </select>
            </div>
            <hr />
            <!-- 食譜列表 -->
            <div class="recipe-list" style="overflow-y: auto; max-height: 400px">
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">紅酒燉牛肉</h5>
                        <div class="d-flex gap-2 justify-content-center">
                            <span class="badge bg-secondary">葷</span>
                            <span class="badge bg-secondary">西式</span>
                            <span class="badge bg-secondary">主餐</span>
                        </div>
                    </div>
                </div>
                <!-- 可以添加更多食譜卡片 -->
            </div>
        </div>
    </div>
    <!-- offcanvas end -->

    <section>
        <div class="container-fluid mt-5">
            <div class="container-fluid p-4 blur-rounded rounded-3 shadow" style="background-color: blanchedalmond">
                <div class="row g-4">
                    <!-- 左側欄 -->
                    <div class="col-md-6">
                        <div class="mb-4">
                            <h5 class="mb-2">料理名稱</h5>
                            <input type="text" class="form-control w-100" placeholder="輸入料理名稱" />
                        </div>

                        <div class="mb-4">
                            <h5 class="mb-2">料理照片</h5>
                            <div class="d-flex flex-column align-items-center">
                                <div
                                    class="photo-upload-area mb-2 position-relative"
                                    style="
                                        width: 200px;
                                        height: 200px;
                                        background-color: #f8f9fa;
                                        border: 2px dashed #ced4da;
                                        border-radius: 8px;
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                        cursor: pointer;
                                    "
                                >
                                    <div class="text-center">
                                        <i
                                            class="fas fa-cloud-upload-alt mb-2"
                                            style="font-size: 24px; color: #6c757d"
                                        ></i>
                                        <p class="mb-0" style="color: #6c757d">點擊或拖曳上傳照片</p>
                                    </div>
                                    <input
                                        type="file"
                                        class="position-absolute top-0 start-0 w-100 h-100 opacity-0"
                                        accept="image/*"
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="mb-4">
                            <h5 class="mb-2">基本設定</h5>
                            <div class="row g-2">
                                <div class="col-6">
                                    <select class="form-select">
                                        <option>葷素</option>
                                        <option>葷</option>
                                        <option>素</option>
                                    </select>
                                </div>
                                <div class="col-6">
                                    <select class="form-select">
                                        <option>類別</option>
                                        <option>XX</option>
                                    </select>
                                </div>
                                <div class="col-6">
                                    <select class="form-select">
                                        <option>細部類別</option>
                                    </select>
                                </div>
                                <div class="col-6">
                                    <select class="form-select">
                                        <option>權限</option>
                                        <option>群組</option>
                                        <option>私有</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 右側食材區 -->
                    <div class="col-md-6">
                        <h5 class="mb-2">所需食材</h5>
                        <div
                            class="ingredients-area p-3 h-100"
                            style="background-color: rgba(255, 255, 255, 0.5); border-radius: 8px"
                        >
                            <select class="form-select mb-2">
                                <option>用Select2</option>
                            </select>
                            <!-- 這裡可以添加已選擇的食材列表 -->
                            <div class="selected-ingredients mt-3"></div>
                        </div>
                    </div>
                </div>

                <!-- 步驟和調味料區 -->
                <div class="row mt-4 g-4">
                    <div class="col-md-6">
                        <h5 class="mb-2">步驟</h5>
                        <div class="p-3" style="background-color: rgba(255, 255, 255, 0.5); border-radius: 8px">
                            <textarea
                                class="form-control border-0 w-100"
                                style="background: transparent"
                                rows="6"
                                placeholder="請輸入步驟..."
                            ></textarea>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <h5 class="mb-2">調味料</h5>
                        <div class="p-3" style="background-color: rgba(255, 255, 255, 0.5); border-radius: 8px">
                            <textarea
                                class="form-control border-0 w-100"
                                style="background: transparent"
                                rows="6"
                                placeholder="請輸入調味料..."
                            ></textarea>
                        </div>
                    </div>
                </div>

                <!-- 保存按鈕 -->
                <div class="row mt-4">
                    <div class="col-12 text-center">
                        <button class="btn btn-lg blur rounded-4 shadow larger">保存食譜</button>
                    </div>
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

/* offcanvas */
.offcanvas {
    width: 300px;
}
.offcanvas-body {
    padding-bottom: 0; /* 調整下邊距，避免內容太多時被裁切 */
    padding-top: 0;
    width: 300px;
}

.offcanvas-button {
    writing-mode: vertical-rl;
    text-orientation: upright;
    position: fixed;
    left: -5%;
    top: 50%;
    z-index: 100;
    width: auto;
    height: fit-content;
    padding: 8px;
    margin: 0;
}

.offcanvas .btn-close {
    position: absolute;
    color: #292929 !important;
    right: 15px;
    top: 15px;
    z-index: 101;
}
</style>
