<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const contactMessage = ref({
    name: authStore.userData?.UserName,
    phone: authStore.userData?.Phone,
    email: authStore.userData?.Email,
    title: '',
    message: '',
});

const API_URL = `${import.meta.env.VITE_API_BASEURL}/Gmail/send`;
const send = async () => {
    const formattedMessage = `
        姓名: ${contactMessage.value.name}
        聯絡電話: ${contactMessage.value.phone}
        email: ${contactMessage.value.email}
        主旨: ${contactMessage.value.title}
        訊息: ${contactMessage.value.message}
    `;
    const emailSend = ref({
        toName: '系統',
        toEmail: authStore.Contact,
        title: '聯絡我們',
        body: formattedMessage.trim(),
    });
    const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(emailSend.value), // 將 AccountSettings 轉為 JSON 格式
        headers: { 'Content-Type': 'application/json' },
    });
    console.log('傳送內容', emailSend.value);
    if (response.ok) {
        alert('傳送成功！'); // 顯示成功訊息
    } else {
        alert('傳送失敗'); // 顯示錯誤訊息
    }
};
</script>

<template>
    <section>
        <div class="container-fluid py-0">
            <div class="contact-section rounded-3">
                <div class="contact-box">
                    <h2 class="contact-title text-black">聯絡我們</h2>
                    <div class="row g-0">
                        <div class="col-md-6">
                            <div class="contact-card d-flex justify-content-start align-items-center">
                                <div class="contact-card-icon rounded-circle">
                                    <i class="fa-solid fa-phone"></i>
                                </div>
                                <div class="contact-card-info mx-auto">
                                    <p class="p-0 m-0 fw-bold fs-6">電話</p>
                                    <p class="p-0 m-0">07-123-4567</p>
                                </div>
                            </div>
                            <div class="contact-card d-flex justify-content-start align-items-center">
                                <div class="contact-card-icon rounded-circle">
                                    <i class="fa-solid fa-envelope"></i>
                                </div>
                                <div class="contact-card-info mx-auto">
                                    <p class="p-0 m-0 fw-bold fs-6">email</p>
                                    <p class="p-0 m-0">recipecube@gmail.com</p>
                                </div>
                            </div>
                            <div class="contact-card d-flex justify-content-start align-items-center">
                                <div class="contact-card-icon rounded-circle">
                                    <i class="fa-solid fa-location-dot"></i>
                                </div>
                                <div class="contact-card-info mx-auto">
                                    <p class="p-0 m-0 fw-bold fs-6">位置</p>
                                    <p class="p-0 m-0">高雄市前金區中正四路211號8號</p>
                                </div>
                            </div>
                            <div class="contact-card d-flex justify-content-start align-items-center">
                                <div class="contact-card-icon rounded-circle">
                                    <i class="fa-solid fa-person"></i>
                                </div>
                                <div class="contact-card-info mx-auto">
                                    <p class="p-0 m-0 fw-bold fs-6">數位客服</p>
                                    <p class="p-0 m-0">https://reurl.cc/vvZVRA</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="contact-form">
                                <div class="mb-3">
                                    <label for="name" class="m-0 p-0 fs-6 text-black">姓名</label>
                                    <input
                                        v-model="contactMessage.name"
                                        name="name"
                                        type="text"
                                        placeholder="請輸入您的姓名"
                                        class="form-control w-100 text-center"
                                    />
                                </div>
                                <div class="mb-3">
                                    <label for="phone" class="m-0 p-0 fs-6 text-black">聯絡電話</label>
                                    <input
                                        v-model="contactMessage.phone"
                                        name="phone"
                                        type="text"
                                        placeholder="請輸入您的聯絡電話"
                                        class="form-control w-100 text-center"
                                    />
                                </div>
                                <div class="mb-3">
                                    <label for="email" class="m-0 p-0 fs-6 text-black">email</label>
                                    <input
                                        v-model="contactMessage.email"
                                        name="email"
                                        type="email"
                                        placeholder="請輸入您的email"
                                        class="form-control w-100 text-center"
                                    />
                                </div>
                                <div class="mb-3">
                                    <label for="title" class="m-0 p-0 fs-6 text-black">主旨</label>
                                    <input
                                        v-model="contactMessage.title"
                                        name="title"
                                        type="text"
                                        placeholder="請輸入您的主旨"
                                        class="form-control w-100 text-center"
                                    />
                                </div>
                                <div class="mb-3">
                                    <label for="message" class="m-0 p-0 fs-6 text-black">您想跟我們說</label>
                                    <textarea
                                        v-model="contactMessage.message"
                                        name="message"
                                        placeholder="請輸入您的訊息"
                                        class="form-control w-100 text-center"
                                    >
                                    </textarea>
                                </div>
                                <el-button type="warning" @click="send" round>送出</el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="css" scoped>
.contact-section {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 2rem;
    background-image: url('@/assets/img/ForBackground/contact-bg.jpg');
    background-size: cover;
    background-position: center;
    height: 100vh;
    width: 100vw;
    margin-left: calc(50% - 50vw);
    overflow: hidden;
}

.contact-box {
    background-color: rgba(255, 255, 255, 0.9);
    padding: 2rem;
    width: 60%;
    text-align: center;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.contact-title {
    font-weight: bold;
    letter-spacing: 0.1em;
}

.contact-card {
    border: 3px solid #e8ba74;
    color: black;
    font-weight: bold;
    letter-spacing: 0.1em;
    padding: 1rem;
    margin: 1rem;
    border-radius: 1rem;
}

.contact-card:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.contact-card-icon {
    width: 50px;
    height: 50px;
    color: black;
    background-color: #e1ba74;
    display: flex;
    justify-content: center;
    align-items: center;
}

.contact-form {
    font-size: 1rem;
    color: black;
    border: 3px solid #e8ba74;
    margin: 1rem;
    padding: 1rem;
    border-radius: 1rem;
}

.form-control:focus {
    border-color: #e8d5b2 !important;
    outline: 0;
    box-shadow: 0 0 0 2px #e8d5b2 !important;
}
</style>
