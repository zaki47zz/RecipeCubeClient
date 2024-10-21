<script setup></script>

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

    <section>
        <div class="container-fluid mt-5 px-3">
            <div class="row g-4">
                <div class="col-md-4 col-12 p-4">
                    <div class="d-flex justify-content-center">
                        <h4>參考已有食譜</h4>
                    </div>
                    <div class="sidebar-body">
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
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item list-group-item-action">紅酒燉牛肉</li>
                            <li class="list-group-item list-group-item-action">彈跳甲魚湯</li>
                            <li class="list-group-item list-group-item-action">世紀濃湯</li>
                        </ul>
                    </div>
                </div>
                <div class="col-md-8 col-12 p-4 rounded-3 shadow" style="background-color: blanchedalmond">
                    <div class="row g-4">
                        <div class="col-12">
                            <div class="mb-3">
                                <div class="d-flex flex-column align-items-center">
                                    <div
                                        class="photo-upload-area mb-2 position-relative"
                                        style="
                                            width: 100%;
                                            height: 400px;
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
                                                style="font-size: 48px; color: #6c757d"
                                            ></i>
                                            <p class="mb-0 fs-6" style="color: #6c757d">點擊或拖曳上傳食譜照片</p>
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
                                <input
                                    type="text"
                                    class="form-control w-100 fs-4 text-center"
                                    placeholder="輸入料理名稱"
                                />
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
                                            <option>類別</option>
                                            <option>XX</option>
                                        </select>
                                    </div>
                                    <div class="col-6">
                                        <select class="form-select fs-6 text-center">
                                            <option>細部類別</option>
                                        </select>
                                    </div>
                                    <div class="col-6">
                                        <select class="form-select fs-6 text-center">
                                            <option>權限</option>
                                            <option>群組</option>
                                            <option>私有</option>
                                        </select>
                                    </div>
                                    <div class="col-12">
                                        <input
                                            type="text"
                                            class="form-control fs-6 text-center"
                                            placeholder="輸入料理所需時間，例如: 30分鐘"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h5 class="mb-0">所需食材</h5>
                        <div
                            class="my-auto p-3 h-100"
                            style="background-color: rgba(255, 255, 255, 0.5); border-radius: 8px"
                        >
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
                            <!-- 步驟1 -->
                            <div class="mt-1 d-flex justify-content-between align-items-center gap-3">
                                <div class="circle-number">1</div>
                                <input
                                    type="text"
                                    class="form-control fs-6 text-center"
                                    placeholder="小火熱鍋，加入蔥薑爆香"
                                />
                                <i class="step-button fa-solid fa-xmark"></i>
                            </div>
                            <!-- 步驟2 -->
                            <div class="mt-1 d-flex justify-content-between align-items-center gap-3">
                                <div class="circle-number">2</div>
                                <input
                                    type="text"
                                    class="form-control fs-6 text-center"
                                    placeholder="牛肉切丁，下鍋拌炒"
                                />
                                <i class="step-button fa-solid fa-xmark"></i>
                            </div>
                            <!-- +步驟按鈕 -->
                            <div class="mt-3 d-flex justify-content-center">
                                <div class="step-button"><i class="fa-solid fa-plus"></i> 步驟</div>
                            </div>
                        </div>
                        <div class="col-12">
                            <h5 class="mb-2">調味料</h5>
                            <div class="p-3" style="background-color: rgba(255, 255, 255, 0.5); border-radius: 8px">
                                <textarea
                                    class="form-control border-0 w-100 fs-6"
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
                            <button class="btn blur text-dark shadow fs-5 w-30">保存食譜</button>
                        </div>
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
.circle-number {
    width: 1.8rem;
    height: 1.8rem;
    background-color: #494948; /* 背景顏色 */
    color: white; /* 文字顏色 */
    border-radius: 50%; /* 使元素變成圓形 */
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
    color: #595959; /* 懸停時變色 */
    cursor: pointer;
    transform: scale(1.1); /* 懸停時放大效果 */
    transition:
        transform 0.2s,
        background-color 0.2s; /* 添加平滑動畫 */
}
</style>
