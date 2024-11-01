<script setup>
import { ref, onMounted } from 'vue';
import { ElButton, ElDialog, ElInput } from 'element-plus';
import { chatBot } from '@/assets/js/ChatBot';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
const dialogVisible = ref(false);
const messages = ref([{ text: '您好！有什麼我可以幫忙的嗎？', sender: 'bot' }]);
const userMessage = ref('');

const faq = chatBot();

onMounted(() => {
    initTippy();
});

const initTippy = function () {
    tippy('#button-chat-bot', {
        content: '聯絡商店客服',
        placement: 'right-end',
        animation: 'fade',
    });
};

const sendMessage = () => {
    if (userMessage.value.trim() === '') return;

    messages.value.push({ text: userMessage.value, sender: 'user' });

    setTimeout(() => {
        const userInput = userMessage.value.trim();
        const botReply = getBotReply(userInput);
        messages.value.push({ text: botReply, sender: 'bot' });
        userMessage.value = ''; // 清空輸入框
    }, 1000);
};

const getBotReply = (userInput) => {
    const lowerCaseInput = userInput.toLowerCase();

    for (const [question, answer] of Object.entries(faq)) {
        const keywords = question.toLowerCase().split(' ');

        // 檢查用戶輸入中是否包含任何關鍵字的子字符串
        if (keywords.some((keyword) => lowerCaseInput.includes(keyword))) {
            return answer;
        }

        // 也可以檢查用戶輸入是否包含問題的關鍵字
        if (keywords.some((keyword) => keyword.includes(lowerCaseInput))) {
            return answer;
        }
    }
    return '抱歉，我目前無法回答這個問題。';
};

const handleClose = () => {
    dialogVisible.value = false;
};

const handleOpen = () => {
    dialogVisible.value = true;
};
</script>

<template>
    <div>
        <el-button class="floating-icon-bot" type="primary" @click="handleOpen" id="button-chat-bot"
            ><i class="fa-solid fa-headset"></i
        ></el-button>

        <el-dialog title="客服聊天機器人" v-model="dialogVisible" width="40%">
            <div class="chat-container">
                <div v-for="(message, index) in messages" :key="index" :class="message.sender">
                    {{ message.text }}
                </div>
            </div>

            <div>
                <el-input v-model="userMessage" placeholder="輸入您的問題..." @keyup.enter="sendMessage" class="mb-4" />
                <el-button type="success" @click="sendMessage">發送</el-button>
            </div>

            <template #footer>
                <el-button @click="handleClose">關閉</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<style lang="css" scoped>
@import '@/assets/css/StoreStyle.css';

.chat-container {
    max-height: 300px;
    overflow-y: auto;
    margin-bottom: 10px;
}
.user {
    text-align: right;
    color: blue;
}
.bot {
    text-align: left;
    color: green;
}
</style>
