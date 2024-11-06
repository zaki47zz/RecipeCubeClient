import { defineStore } from 'pinia';
import { ref } from 'vue';
export const useScrollStore = defineStore('scrollStore', () => {
    const appScrollContainer = ref(null); //存取scrollbar本體
    const scrollPosition = ref(0); //存取scrollbar當前位置

    const handleScroll = ({ scrollTop }) => {
        //滾動會更新當前位置(更新函式掛在App.vue的組件上了，以el-scrollbar本身的滾動事件<scroll>驅動)
        scrollPosition.value = scrollTop;
    };

    /*
    另外el-scrollbar內部有自帶元素屬性wrapRef，這是DOM元素<Ref<HTMLDivElement>:物件>，
    如果要用wow.js之類需要使用selector的功能，可以利用appScrollContainer.value.wrapRef.id
    這樣的方式來賦予這個元素有我們自訂的id(當然也可以是其他的啦，class...)，例子可參考AboutView
    */
    return { scrollPosition, appScrollContainer, handleScroll };
});
