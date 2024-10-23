<script setup>
import CategorySwiperComponent from '@/components/CategorySwiperComponent.vue';
import Swal from 'sweetalert2';

//加入食材庫存提醒
const alertClearCheck = () => {
    Swal.fire({
        title: '您確定嗎?',
        text: '即將加入食材至庫存',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '加入',
        cancelButtonText: '取消',
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: '成功加入!',
                icon: 'success',
            });
        }
    });
};
</script>

<template>
    <section class="banner-section">
        <div class="banner-ad bg-primary-subtle block-2">
            <div class="row banner-content pt-5">
                <div class="content-wrapper text-center col-md-12">
                    <h1 class="pb-5">加入食材 Add Ingredient</h1>
                </div>
            </div>
        </div>
    </section>

    <section class="pt-5 overflow-hidden">
        <div class="container-fluid banner-ad">
            <CategorySwiperComponent color="bg-primary-subtle"></CategorySwiperComponent>
        </div>
    </section>

    <div class="d-flex justify-content-center my-3">
        <hr class="horizontal dark my-0 w-50" />
    </div>

    <section class="py-3 overflow-hidden">
        <div class="container-fluid post-it shadow">
            <div class="row">
                <div class="col-md-12">
                    <div class="d-flex justify-content-between mt-2">
                        <h5>今天買了</h5>
                        <p class="badge bg-secondary"><i class="fa-solid fa-repeat"></i> 數量換算表</p>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="table-responsive p-3">
                    <table class="table table-borderless text-center table-hover align-middle mb-0">
                        <thead>
                            <tr>
                                <th scope="col" class="text-dark">編號</th>
                                <th scope="col" class="text-dark">食材</th>
                                <th scope="col" class="text-dark">數量</th>
                                <th scope="col" class="text-dark">權限</th>
                                <th scope="col" class="text-dark">期限</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row" class="text-dark">1</th>
                                <td class="text-dark">菠菜</td>
                                <td class="text-dark">
                                    <input type="text" class="form-control inline-control w-30" /> 把
                                </td>
                                <td class="text-dark">
                                    <select class="form-control inline-control text-center">
                                        <option value="0">群組</option>
                                        <option value="1">私人</option>
                                    </select>
                                </td>
                                <td class="text-dark">
                                    <input
                                        type="date"
                                        class="form-control inline-control text-center"
                                        value="2024-10-30"
                                    />
                                </td>
                                <td class="text-dark">
                                    <i class="fa-solid fa-trash"></i>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row" class="text-dark">1</th>
                                <td class="text-dark">菠菜</td>
                                <td class="text-dark">
                                    <input type="text" class="form-control inline-control w-30" /> 把
                                </td>
                                <td class="text-dark">
                                    <select class="form-control inline-control text-center">
                                        <option value="0">群組</option>
                                        <option value="1">私人</option>
                                    </select>
                                </td>
                                <td class="text-dark">
                                    <input
                                        type="date"
                                        class="form-control inline-control text-center"
                                        value="2024-10-30"
                                    />
                                </td>
                                <td class="text-dark">
                                    <i class="fa-solid fa-trash"></i>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>

    <section class="pt-3">
        <div class="container-fluid">
            <div class="row justify-content-center">
                <div class="col-lg-3">
                    <button class="btn bg-primary-subtle text-dark shadow fs-5 w-100" @click="alertClearCheck">
                        加入食材
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

.post-it {
    background: #fffaa2;
    padding: 1% 3% 3%;
    text-align: center;
}
</style>
