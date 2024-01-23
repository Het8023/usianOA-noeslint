<template>
  <div class="box">
    <div class="logo"></div>
    <div class="form">
      <div class="login">
        <h1>登录</h1>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
          <el-form-item prop="mobile">
            <el-input v-model="ruleForm.mobile" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="ruleForm.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item prop="isAred">
            <el-checkbox name="type" v-model="ruleForm.isAred">同意用户协议</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      ruleForm: {
        mobile: "16692175274",
        password: "123456",
        isAred: false
      },
      rules: {
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "密码长度应该为6-16位之间",
            trigger: "blur"
          }
        ],
        isAred: [
          {
            validator: (rule, value, callback) => {
              value ? callback() : callback(new Error("没有勾选用户平台协议"));
            }
          }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          await this.$store.dispatch("user/login", this.ruleForm);
          this.$router.push("/");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  computed: {},
  filters: {},
  watch: {}
};
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100vh;
  // background-color: aquamarine;
  display: flex;
  .logo {
    flex: 3;
    background-image: url("../../assets/common/login_back.png");
    background-size: 100% 100%;
  }
  .form {
    flex: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    .login {
      width: 300px;
      .el-button {
        width: 100%;
      }
    }
  }
}
</style>
