<template>
  <el-upload
    class="avatar-uploader"
    :show-file-list="false"
    action
    :http-request="handleAvatarRequest"
    :before-upload="beforeAvatarUpload"
  >
    <img v-if="value" :src="value" class="avatar" />
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script>
import COS from "cos-js-sdk-v5";
export default {
  components: {},
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },
  methods: {
    handleAvatarRequest(res) {
      const cos = new COS({
        SecretId: "AKIDQrMmkkdMvQFyeN5gFi8ShvMpFfClIj9Y",
        SecretKey: "pXVRJ7pSxKYaJsMPXYP4NYnvDYu7MgNz"
      });
      cos.putObject(
        {
          Bucket: "usian-1257833045",
          Region: "ap-nanjing",
          Key: res.file.name,
          Body: res.file,
          StorageClass: "STANDARD",
          onProgress: function(progressData) {}
        },
        // 上传完成之后
        (err, data) => {
          console.log(data);
          if (data.statusCode == 200 && data.Location) {
            this.$emit("input", "https://" + data.Location);
          } else {
            this.$message.error(err.Message);
          }
        }
      );
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }
  },
  computed: {},
  filters: {},
  watch: {}
};
</script>

<style lang="scss" scoped>
.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
