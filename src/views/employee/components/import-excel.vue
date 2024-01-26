<template>
  <el-dialog
    :before-close="close"
    title="员工导入"
    :visible.sync="showDialog"
    width="500px"
    @close="close"
  >
    <el-row type="flex" justify="center" align="center">
      <div class="upload-excel">
        <input ref="upload" type="file" class="excel-upload-input" @change="uploadChange" />
        <div class="drop">
          <i class="el-icon-upload" />
          <el-button type="text" @click="getExportTemplate">下载导入模板</el-button>
          <span>
            将文件拖到此处或
            <el-button type="text" @click="handleUpload">点击上传</el-button>
          </span>
        </div>
      </div>
    </el-row>

    <el-row type="flex" justify="end" align="center">
      <el-button size="mini" type="primary" @click="$emit('update:showDialog', false)">取消</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import { getExportTemplateApi, uploadEmployeeApi } from "@/api/employee";
import FileSaver from "file-saver";
export default {
  props: {
    showDialog: {
      default: false,
      type: Boolean
    }
  },
  components: {},
  data() {
    return {};
  },
  methods: {
    // 取消
    close() {
      this.$emit("update:showDialog", false);
    },
    handleUpload() {
      this.$refs.upload.click();
    },
    // 下载导入模板
    async getExportTemplate() {
      const res = await getExportTemplateApi();
      console.log(res);
      FileSaver.saveAs(res, "员工导入模版.xlsx");
    },
    // 上传
    async uploadChange(e) {
      // console.log(e.srcElement.files);
      const file = e.srcElement.files;
      if (file.length > 0) {
        const formData = new FormData();
        formData.append("file", file[0]);
        try {
          await uploadEmployeeApi(formData);
          this.$emit("uploadSuccess");
          this.$emit("update:showDialog", false);
        } catch (error) {
          console.log(error);
        } finally {
          this.$refs.upload.value = null;
        }
      }
    }
  },
  computed: {},
  filters: {},
  watch: {}
};
</script>

<style lang="scss" scoped>
.upload-excel {
  display: flex;
  justify-content: center;
  margin: 20px;
  width: 360px;
  height: 180px;
  align-items: center;
  color: #697086;

  .excel-upload-input {
    display: none;
  }

  .drop {
    border: 1px dashed #dcdfe6;
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 160px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .drop {
    line-height: 40px;
    color: #bbb;
    i {
      font-size: 60px;
      display: block;
      color: #c0c4cc;
    }
  }
}
</style>
