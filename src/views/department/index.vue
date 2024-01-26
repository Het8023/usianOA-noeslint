<template>
  <div class="container">
    <div class="app-container">
      <el-tree
        :expand-on-click-node="false"
        :data="departmentList"
        :props="defaultProps"
        :default-expand-all="true"
      >
        <template v-slot="{ data }">
          <el-row
            type="flex"
            align="middle"
            justify="space-between"
            style="width: 100%; height: 40px"
          >
            <el-col>{{ data.name }}</el-col>
            <el-col style="text-align: right" :span="4">
              <span class="tree-manager">{{ data.managerName }}</span>
              <el-dropdown @command="handleCommand($event, data.id)">
                <span class="el-dropdown-link">
                  操作
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add">添加部门</el-dropdown-item>
                  <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="remove">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>
      </el-tree>
    </div>
    <!-- .sync 会直接监听子组件的 update:show-dialog -->
    <add-dept
      ref="dept"
      :current-node-id="currentNodeId"
      :show-dialog.sync="showDialog"
      @updateDepartment="getDepartment"
    />
  </div>
</template>

<script>
import { getDepartmentApi, removeDepartmentApi } from "@/api/department";
import { transListToTreeDate } from "@/utils/index";
import addDept from "./components/add-dept.vue";

export default {
  name: "Department",
  components: { addDept },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "name"
      },
      departmentList: [],
      showDialog: false,
      currentNodeId: null
    };
  },
  methods: {
    // 获取部门列表
    async getDepartment() {
      const res = await getDepartmentApi();
      this.departmentList = transListToTreeDate(res, 0);
      // console.log(this.departmentList);
    },
    // 点击下拉菜单触发
    handleCommand(command, id) {
      switch (command) {
        case "add":
          this.currentNodeId = id;
          this.showDialog = true;
          break;
        case "edit":
          this.showDialog = true;
          this.currentNodeId = id;
          this.$nextTick(() => {
            this.$refs.dept.getDepartmentDetail();
          });
          break;
        case "remove":
          this.removeDepartment(id);
          break;
      }
    },
    // 删除部门
    removeDepartment(id) {
      this.$confirm("您确认要删除该部门吗？").then(async () => {
        await removeDepartmentApi(id);
        this.$message.success("删除部门成功");
        this.getDepartment();
      });
    }
  },
  created() {
    this.getDepartment();
  },
  computed: {},
  filters: {},
  watch: {}
};
</script>

<style lang="scss" scoped>
.app-container {
  padding: 30px 140px;
  font-size: 14px;
  box-sizing: border-box;
}
.tree-manager {
  min-width: 50px;
  display: inline-block;
  margin: 10px;
}
</style>
