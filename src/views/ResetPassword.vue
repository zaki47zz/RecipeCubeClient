<script setup>
    
</script>

<template>
    <div class="col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto">
        <div class="card card-plain mt-8">
            <div class="card-header pb-0 text-left bg-transparent">
                <h3 class="font-weight-bolder text-info text-gradient">忘記密碼</h3>
                <p class="mb-0">輸入註冊Email</p>
            </div>
            <div class="card-body">
                <form> 
                    <div class="text-danger" role="alert"></div>
                    <div class="form-floating mb-3">
                        <input type="email" class="form-control" name="email" id="email"
                            placeholder="Email" required />
                        <label for="email" class="form-label">Email</label>
                        <span class="text-danger"></span>
                    </div>
                    <div class="text-center">
                        <button type="submit" class="btn bg-gradient-info w-100 mt-4 mb-0">重設密碼</button> <!-- 按下按鈕後執行 handleLoginClick -->
                    </div>
                </form>
            </div>
            <div class="card-footer text-center pt-0 px-lg-2 px-1">
                <p class="mb-4 text-sm mx-auto">
                    還沒有註冊過會員嗎?
                    <RouterLink class="text-info text-gradient font-weight-bold" :to="{ name: 'SignUp' }">註冊
                    </RouterLink>
                </p>
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped>

</style>