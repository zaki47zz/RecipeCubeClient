<script setup>
import { ref } from 'vue';

const BASE_URL = import.meta.env.VITE_API_BASEURL

const API_URL = `${BASE_URL}/SignUp`

const user = ref( {
    "email": "",
    "pwd1": "",
    "pwd2": "",
})

const validity = ref({
    "emailRequired": true,
    'emailFormat': true,
    "pwdRequired": true,
    'pwdConfirm': true,
    "pwdFormat": true,
    'isValid': false
})

const emailRule = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const pwdRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/

const validate = async () => {
    //解構賦值
    const { useremail, pwd1, pwd2} = user.value

    //驗證資料正確性

    //資料一定要輸入的驗證
    validity.value.userNameRequired = username.length > 0
    validity.value.pwdRequired = pwd1.length > 0
    validity.value.emailRequired = useremail.length > 0

    //密碼跟密碼確認需一致
    validity.value.pwdConfirm = pwd1 === pwd2
    validity.value.pwdFormat = pwdRule.test(pwd2)

    //Email格式是否正確
    validity.value.emailFormat = emailRule.test(useremail)

    validity.value.isValid = validity.value.emailRequired && validity.value.emailFormat && validity.value.pwdRequired &&  validity.value.pwdConfirm && validity.value.pwdFormat

    if (validity.value.isValid) {

        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(user.value),
            headers: { 'Content-Type': 'application/json' }
        })
        if (response.ok) {
            alert('註冊成功!!')
        }


    }
}
</script>

<template>
    
</template>

<style lang="css" scoped>

</style>