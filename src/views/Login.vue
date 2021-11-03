<template>
    <div>
        <el-form :rules="rules" ref="loginFrom" :model="loginFrom" class="loginFrom" >
            <el-form-item class="fromTitle">
                <h3>系统登录</h3>
            </el-form-item>
            <el-form-item prop="username">
                <el-input type="text" v-model="loginFrom.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" v-model="loginFrom.password" placeholder="请输入密码" @keydown.enter.native="submitLogin"></el-input>
            </el-form-item>
            <el-button type="primary" style="width: 100%"  @click="submitLogin">登录</el-button>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data () {
            return {
                loginFrom: {
                    username: 'admin',
                    password: '123'
                },
                rules: {
                    username: [
                        {required : true, message: '请输入用户名', trigger: 'blur'}
                        ],
                    password: [
                        {required : true, message: '请输入密码', trigger: 'blur'}
                        ]
                }
            }
        },
        methods: {
            submitLogin() {

                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                setTimeout(() => {
                    this.$refs.loginFrom.validate((valid) => {
                        if (valid) {
                            this.postKayValueRequest('/doLogin',this.loginFrom).then(resp=>{
                                if (resp){
                                    window.sessionStorage.setItem("user",JSON.stringify(resp.obj));
                                    let redirect = this.$route.query.redirect;
                                    this.$router.replace((redirect=="/"||redirect==undefined)?'/home':redirect)
                                    loading.close();
                                }
                            })
                        } else {
                            this.$message.error('请补充完整信息！');
                            return false;
                        }
                    });
                }, 2000);


            }
        }
    }
</script>

<style>
    .loginFrom {
        border-radius: 15px;
        background-clip: padding-box;
        border: 1px solid #efefef;
        margin: 300px auto;
        width: 450px;
        padding: 0px 20px 20px 20px;
        background-color: #FFFFFF;
        box-shadow: 0 0 25px #929292;
    }
    .fromTitle {
        margin: 0px auto 20px auto;
        text-align: center;
        color: #535353;
    }

</style>