<script setup></script>

<template>
    <div class="skeleton-card">
        <div class="skeleton-image"></div>
        <div class="skeleton-info">
            <div class="skeleton-text short"></div>
            <div class="skeleton-text medium"></div>
            <div class="skeleton-text long"></div>
        </div>
    </div>
</template>

<style lang="css" scoped>
.skeleton-card {
    width: 100%;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
}

.skeleton-image {
    width: 100px;
    height: 100px;
    border-radius: 8px;
    background-color: #e0e0e0;
    margin-bottom: 12px;
}

.skeleton-info {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.skeleton-text {
    height: 12px;
    border-radius: 4px;
    background-color: #e0e0e0;
    margin: 6px 0;
}

.skeleton-text.short {
    width: 40%;
}

.skeleton-text.medium {
    width: 60%;
}

.skeleton-text.long {
    width: 80%;
}

/* 動畫 */
@keyframes skeleton-loading {
    0% {
        background-color: #e0e0e0;
    }
    50% {
        background-color: #f0f0f0;
    }
    100% {
        background-color: #e0e0e0;
    }
}

.skeleton-text,
.skeleton-image {
    animation: skeleton-loading 0.8s infinite ease-in-out;
}
</style>
