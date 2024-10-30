<script setup>
import { ref } from 'vue';
import question from '@/assets/img/ForBackground/question-bg.jpg';

const activeIndex = ref(0);
const faqs = [
    {
        question: '加入食材都沒有我想要的食材?',
        answer: '在隨買隨煮及加入食材的頁面食材滑動列表最右邊皆設有自定義食材功能，您可以透過該功能向我們發送自定義食材需求，通過審核後，我們就會將該食材列入食材資料庫中囉!',
    },
    {
        question: '我要怎麼讓其他人不要看到我的庫存食材?',
        answer: '在加入食材時，您可以設定您的食材權限，如果您不想讓群組的其他人看見您的食材，請將權限設置為私人。',
    },
    {
        question: '商城東西好多，我都不知道買什麼，該怎麼辦?',
        answer: '在商店頁面右下方有一個粉紅色按鈕，其為我們特色功能之一的智能推薦按鈕，按下後將根據您的使用習慣及當前的庫存狀況推薦您購買商品，您甚至可以一鍵將所有商品加入您的購物車。',
    },
    {
        question: '我填入的偏好食材與不可食用食材是固定會影響食譜篩選嗎?',
        answer: '不會，偏好食材與不可食用食材的篩選是預設關閉的，必須在使用者設定頁面開啟，才會影響食譜篩選。',
    },
    {
        question: '常見問題沒有我想問的問題，有辦法聯絡你們嗎?',
        answer: '請洽"聯絡我們"頁面，當中有email資訊，用email聯繫我們，會有專人為您處理喔!',
    },
];

const toggleAccordion = (index) => {
    activeIndex.value = activeIndex.value === index ? null : index;
};
</script>

<template>
    <section>
        <div class="header">
            <div class="title">
                <h1>常見問題</h1>
                <h1>FAQs</h1>
            </div>
        </div>
    </section>

    <section>
        <div class="container">
            <div class="row mt-5">
                <div class="col-lg-6">
                    <img :src="question" class="img-fluid FAQ-img" alt="FAQ illustration" />
                </div>
                <div class="col-lg-6">
                    <div class="accordion accordion-flush" id="accordion-flush">
                        <div v-for="(faq, index) in faqs" :key="index" class="accordion-item border mb-3 rounded-3">
                            <h5 class="accordion-header rounded-3">
                                <button
                                    class="accordion-button"
                                    :class="{ collapsed: activeIndex !== index }"
                                    type="button"
                                    @click="toggleAccordion(index)"
                                    style="font-weight: bold"
                                >
                                    {{ faq.question }}
                                </button>
                            </h5>
                            <div class="accordion-collapse" :class="{ collapse: true, show: activeIndex === index }">
                                <div class="accordion-body">
                                    <p>{{ faq.answer }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="css" scoped>
/* header 本人 */
.header {
    position: relative;
    overflow: hidden;
    height: 40vh;
    width: 100vw;
    margin-left: calc(50% - 50vw);
    color: #eee;
    z-index: 0;
}
/* 背景 */
.header:before {
    content: '';
    width: 100%;
    height: 200%;
    position: absolute;
    top: 0;
    left: 0;
    transform: translateZ(0) scale(1, 1);
    background: #1b2030 url('src/assets/img/ForBackground/bg-header.jpg') 50% 0 no-repeat;
    background-size: cover;
    background-attachment: fixed;
    animation: grow 180s linear 10ms infinite;
    transition: all 0.4s ease-in-out;
    z-index: -2;
}
/* 下方 mask */
.header:after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: -1;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 40%, rgb(254, 254, 254) 100%);
}
/* 文字 */
.title {
    width: 100%;
    padding-top: 5%;
    text-align: center;
    text-shadow: 0 2px 3px rgba(255, 255, 255, 0.4);
}
/* 上下移動縮放特效 */
@keyframes grow {
    0% {
        transform: scale(1) translateY(0px);
    }
    50% {
        transform: scale(1.2) translateY(-250px);
    }
}

.FAQ-img {
    width: 100%;
    height: auto;
    border-radius: 2rem;
    object-fit: fill;
}

.accordion-item {
    background: rgba(221, 217, 218, 0.3);
    font-weight: bold;
    letter-spacing: 0.1em;
    padding: 0.5rem;
}

h5 button.accordion-button {
    background-color: transparent;
    font-size: large;
}

.accordion-button:not(.collapsed) {
    background-color: transparent;
}

.accordion-button:focus {
    box-shadow: none;
    border-color: rgba(0, 0, 0, 0.125);
}

.accordion-body {
    color: #364868;
}

/* 箭頭 */
.accordion-button::after {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'%3E%3Cpath fill='black' d='m12 13.171l4.95-4.95l1.414 1.415L12 16L5.636 9.636L7.05 8.222z'/%3E%3C/svg%3E");
}
.accordion-button:not(.collapsed)::after {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'%3E%3Cpath fill='black' d='m12 13.171l4.95-4.95l1.414 1.415L12 16L5.636 9.636L7.05 8.222z'/%3E%3C/svg%3E");
    transform: rotate(180deg);
}
</style>
