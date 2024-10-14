<script setup></script>

<template>
    <section class="banner-section">
        <div class="banner-ad bg-danger-subtle block-2">
            <div class="row banner-content pt-5">
                <div class="content-wrapper text-center col-md-12">
                    <h1>隨買隨煮 Buy & Cook</h1>
                    <header>
                        <div class="container-fluid">
                            <div class="row py-3"></div>
                        </div>
                    </header>
                </div>
            </div>
        </div>
    </section>

    <section class="py-5">
        <div class="container-fluid">
            <div class="row justify-content-center">
                <div class="col-lg-3">
                    <div class="d-flex gap-4 align-items-start">
                        <div class="icon">
                            <i class="fa-solid fa-1" style="font-size: 50px"></i>
                        </div>
                        <div class="text-md-start">
                            <h5>選擇食材</h5>
                            <p>請在下方食材列表選擇食材</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3">
                    <div class="d-flex gap-4 align-items-start">
                        <div class="icon">
                            <i class="fa-solid fa-2" style="font-size: 50px"></i>
                        </div>
                        <div class="text-md-start">
                            <h5>產生食譜</h5>
                            <p>按下產生食譜按鈕生成食譜</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3">
                    <div class="d-flex gap-4 align-items-start">
                        <div class="icon">
                            <i class="fa-solid fa-3" style="font-size: 50px"></i>
                        </div>
                        <div class="text-md-start">
                            <h5>開始料理</h5>
                            <p>選擇料理食譜，準備大顯身手</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 改成swiper -->
    <section>
        <div class="my-1 d-flex justify-content-between align-items-center">
            <h4>食材列表(改成SWIPER)</h4>
            <div class="search-box">
                <input type="text" class="form-control h-30 w-100 text-center" placeholder="搜尋" />
            </div>
        </div>
        <div class="scroll-container d-flex gap-3 m-0 overflow-auto">
            <!-- 常用食材 -->
            <div class="card shadow p-2" style="min-width: 200px">
                <h6 class="text-center">您的常用食材</h6>
                <div class="d-flex flex-wrap justify-content-center gap-2">
                    <span class="badge food-badge bg-success">青椒</span>
                    <span class="badge food-badge bg-success">高麗菜</span>
                    <span class="badge food-badge bg-success">菠菜</span>
                </div>
            </div>

            <!-- 類別區塊 (多個可以複製) -->
            <div class="card shadow p-2" style="min-width: 200px">
                <h6 class="text-center">蔬菜類</h6>
                <div class="d-flex flex-wrap justify-content-center gap-2">
                    <span class="badge food-badge bg-success">青椒</span>
                    <span class="badge food-badge bg-success">菠菜</span>
                    <span class="badge food-badge bg-success">高麗菜</span>
                    <span class="badge food-badge bg-success">青椒</span>
                    <span class="badge food-badge bg-success">菠菜</span>
                    <span class="badge food-badge bg-success">高麗菜</span>
                    <span class="badge food-badge bg-success">青椒</span>
                    <span class="badge food-badge bg-success">菠菜</span>
                    <span class="badge food-badge bg-success">高麗菜</span>
                    <span class="badge food-badge bg-success">青椒</span>
                    <span class="badge food-badge bg-success">菠菜</span>
                    <span class="badge food-badge bg-success">高麗菜</span>
                </div>
            </div>

            <div class="card shadow p-2" style="min-width: 200px">
                <h6 class="text-center">牛肉類</h6>
            </div>
            <div class="card shadow p-2" style="min-width: 200px">
                <h6 class="text-center">豬肉類</h6>
            </div>
            <div class="card shadow p-2" style="min-width: 200px">
                <h6 class="text-center">雞肉類</h6>
            </div>
            <div class="card shadow p-2" style="min-width: 200px">
                <h6 class="text-center">蛋奶類</h6>
            </div>
            <div class="card shadow p-2" style="min-width: 200px">
                <h6 class="text-center">菌菇類</h6>
            </div>
            <div class="card shadow p-2" style="min-width: 200px">
                <h6 class="text-center">液體類</h6>
            </div>
            <div class="p-2 text-center" style="min-width: 200px">
                <p>沒有您想要的食材嗎?</p>
                <button class="btn blur rounded-3 shadow text-center">加入自定義食材</button>
            </div>
        </div>
    </section>

    <section class="pt-3">
        <div class="container-fluid">
            <div class="row justify-content-center">
                <div class="col-lg-3"><button class="btn bg-gradient-info shadow fs-5 w-100">產生食譜</button></div>
            </div>
        </div>
    </section>

    <!-- 加上一個DataTables -->
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
    background: url('@/assets/img/ForBackground/background-pattern.jpg') no-repeat center / cover;
    position: relative;
}

.banner-ad {
    position: relative;
    overflow: hidden;
    background: url('@/assets/img/ForBackground/ad-bg-pattern.png') no-repeat center / cover;
}
</style>
