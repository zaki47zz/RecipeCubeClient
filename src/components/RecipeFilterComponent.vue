<template>
    <div class="container-fluid filter-container">
        <div class="row pb-2 px-3 my-3 d-flex bg-primary-subtle rounded-4 shadow justify-content-between">
            <!-- 分類欄 -->
            <div class="col-md-2">
                <p class="fw-bold mt-3 mb-0">分類 CATEGORY</p>
            </div>
            <div class="col-md-2 mt-2">
                <select class="form-select" v-model="filters.restriction">
                    <option value="">選擇葷素食</option>
                    <option :value="true">素食</option>
                    <option :value="false">葷食</option>
                </select>
            </div>
            <div class="col-md-2 mt-2">
                <select class="form-select" v-model="filters.style">
                    <option value="">選擇中西式</option>
                    <option :value="false">中式</option>
                    <option :value="true">西式</option>
                </select>
            </div>
            <div class="col-md-3 mt-2">
                <select class="form-select" v-model="filters.category">
                    <option value="">選擇主類別</option>
                    <option
                        v-for="(subcategories, category) in recipeFilterStore.categoryOptions"
                        :key="category"
                        :value="category"
                    >
                        {{ category }}
                    </option>
                </select>
            </div>
            <div class="col-md-3 mt-2">
                <select class="form-select" v-model="filters.subcategory">
                    <option value="">選擇細部類別</option>
                    <option
                        v-for="subcategory in recipeFilterStore.subcategoryOptions"
                        :key="subcategory"
                        :value="subcategory"
                    >
                        {{ subcategory }}
                    </option>
                </select>
            </div>
            <!-- 搜尋食譜名稱或食材欄位 -->
            <div v-if="showSearchField" class="col-md-3 mx-auto mt-2">
                <select class="form-select" v-model="filters.searchType">
                    <option value="">選擇搜尋食譜或食材</option>
                    <option value="recipeName">搜尋食譜名稱</option>
                    <option value="ingredient">搜尋食材名稱</option>
                </select>
            </div>

            <div v-if="showSearchField && filters.searchType === 'recipeName'" class="col-md-9 mx-auto mt-2">
                <input
                    type="text"
                    v-model="filters.searchWord"
                    class="form-control w-100 rounded-3"
                    placeholder="輸入食譜名稱"
                />
            </div>

            <div v-if="showSearchField && filters.searchType === 'ingredient'" class="col-md-9 mx-auto mt-2">
                <multiselect
                    v-model="selectedIngredients"
                    :options="groupedIngredients"
                    placeholder="搜尋或選擇食材 (可以多選)"
                    :multiple="true"
                    :close-on-select="false"
                    group-label="category"
                    group-values="ingredients"
                    :group-select="false"
                    track-by="ingredientId"
                    :custom-label="customLabel"
                >
                    <span slot="noResult">找不到該食材</span>
                </multiselect>
            </div>
        </div>
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { onMounted, watch } from 'vue';
import { useIngredientStore } from '@/stores/ingredientStore';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import { useRecipeFilterStore } from '@/stores/recipeFilterStore';
const props = defineProps({
    showSearchField: {
        type: Boolean,
        default: true,
    },
});
const recipeFilterStore = useRecipeFilterStore();
const ingredientStore = useIngredientStore();

const { filters, selectedIngredients } = storeToRefs(recipeFilterStore);

const { groupedIngredients } = storeToRefs(ingredientStore);
const { fetchIngredients } = ingredientStore;
onMounted(async () => {
    await fetchIngredients();
});

function customLabel(option) {
    // console.log('Custom label function invoked for option:', option);
    const label = option.ingredientName || '';
    const synonym = option.synonym ? ` (${option.synonym})` : '';
    return `${label}${synonym}`;
}
// Emit 篩選條件變更
const emit = defineEmits(['filterChange']);
function onFiltersChange() {
    // console.log('Filters changed:', filters.value, selectedIngredients.value);
    emit('filterChange', {
        filters: filters.value,
        selectedIngredients: selectedIngredients.value,
    });
}

// Watch `filters` 和 `selectedIngredients`，當它們變化時觸發 `onFiltersChange`
watch(filters, onFiltersChange, { deep: true });
watch(selectedIngredients, onFiltersChange, { deep: true });
//清空子類別
watch(
    () => filters.value.category,
    (newCategory) => {
        // console.log('主類別改變:', newCategory);
        filters.value.subcategory = '';
    }
);
</script>

<style scoped>
.filter-container {
    margin-bottom: 20px;
}
</style>
