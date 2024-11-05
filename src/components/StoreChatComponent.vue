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
        content: '聯絡商店智能客服',
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
    }, 500);
};

const getBotReply = (userInput) => {
    const lowerCaseInput = userInput.toLowerCase();

    for (const [question, answer] of Object.entries(faq)) {
        const keywords = question.toLowerCase().split(' ');

        if (keywords.some((keyword) => lowerCaseInput.includes(keyword))) {
            return `<span class="question-title" style="color: #3498db; font-weight: bold;">${question}</span><br>${answer}`;
        }

        if (keywords.some((keyword) => keyword.includes(lowerCaseInput))) {
            return `<span class="question-title" style="color: #3498db; font-weight: bold;">${question}</span><br>${answer}`;
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

        <el-dialog title="智能客服" v-model="dialogVisible" width="40%">
            <div class="chat-container">
                <div
                    v-for="(message, index) in messages"
                    :key="index"
                    v-html="message.text"
                    :class="message.sender"
                ></div>
            </div>

            <div>
                <el-input v-model="userMessage" placeholder="輸入您的問題..." @keyup.enter="sendMessage" class="mb-4" />
                <el-button type="success" @click="sendMessage" style="background-color: #3498db; border: none"
                    >發送</el-button
                >
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
    color: #9bc8fb;
}

.bot {
    text-align: left;
    color: #56c5a9;
}
</style>
