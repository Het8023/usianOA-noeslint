<template>
  <div class="container">
    <div class="app-container">
      <div class="left">
        <!-- 搜索框 -->
        <el-input
          v-model="queryParams.keyword"
          style="margin-bottom: 10px"
          type="text"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="输入员工姓名全员搜索"
          @input="handleSearch"
        />
        <!-- tree结构 -->
        <el-tree
          ref="deptTree"
          :data="depts"
          :props="defaultProps"
          default-expand-all
          :expand-on-click-node="false"
          highlight-current
          node-key="id"
          @current-change="selectNode"
        />
      </div>
      <div class="right">
        <!-- 操作按钮 -->
        <el-row style="margin: 10px" type="flex" align="middle" justify="end">
          <el-col :span="16">
            <el-button size="mini">群发通知</el-button>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" size="mini" @click="todetail">添加员工</el-button>
            <el-button size="mini" @click="showDialog = true">excel导入</el-button>
            <el-button size="mini" @click="exportEmployee">excel导出</el-button>
          </el-col>
        </el-row>
        <!-- 表格 -->
        <el-table :data="list">
          <el-table-column align="center" type="selection" />
          <el-table-column align="center" label="头像">
            <template v-slot="{ row }">
              <el-avatar v-if="row.staffPhoto" :size="30" :src="row.staffPhoto" />
              <span v-else class="username">{{ row.username?.charAt(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="username" label="姓名" />
          <el-table-column prop="mobile" label="手机号" sortable align="center" />
          <el-table-column prop="workNumber" label="工号" sortable align="center" />
          <el-table-column align="center" prop="formOfEmployment" label="聘用形式">
            <template v-slot="{ row }">
              <span v-if="row.formOfEmployment === 1">正式</span>
              <span v-else-if="row.formOfEmployment === 2">非正式</span>
              <span v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="departmentName" label="部门" />
          <el-table-column prop="timeOfEntry" label="入职时间" align="center" />
          <el-table-column align="center" width="280px" label="操作">
            <template v-slot="{ row }">
              <el-button size="mini" type="text" @click="handleRouter(row.id)">查看</el-button>
              <el-button size="mini" type="text" @click="handleRole(row.id)">角色</el-button>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="handleDelete(row.id)">
                <el-button slot="reference" size="mini" type="text">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row style="padding-top: 20px" type="flex" justify="center" align="midlle">
          <el-pagination
            :current-page="queryParams.page"
            :page-size="queryParams.pagesize"
            layout="total, prev, pager, next"
            :total="total"
            @current-change="handleCurrentChange"
          />
        </el-row>

        <!-- 导入 -->
        <ImportExcel :show-dialog.sync="showDialog"></ImportExcel>

        <!-- 角色分配弹窗 -->
        <el-dialog title="分配角色" :visible.sync="roleDialog">
          <el-checkbox-group v-model="roleIds">
            <el-checkbox
              v-for="(item,index) in roleList"
              :key="index"
              :label="item.id"
            >{{item.name}}</el-checkbox>
          </el-checkbox-group>
          <el-row type="flex" justify="center" align="middle" style="height:80px">
            <el-button type="primary" size="mini" @click="handleAssignRole">确定</el-button>
            <el-button size="mini" @click="roleDialog = false">取消</el-button>
          </el-row>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import { getDepartmentApi } from "@/api/department";
import { transListToTreeDate } from "@/utils";
import { getEnableRoleListApi } from "@/api/role";
import {
  exportEmployeeApi,
  deleteEmployeeApi,
  getEmployeListApi,
  assignRoleApi,
  getEmployeeDetailApi
} from "@/api/employee";
import ImportExcel from "./components/import-excel";
import _ from "lodash";
import FileSaver from "file-saver";
export default {
  name: "Employee",
  components: {
    ImportExcel
  },
  data() {
    return {
      depts: [],
      defaultProps: {
        label: "name",
        children: "children"
      },
      queryParams: {
        page: 1,
        pagesize: 10,
        keyword: "",
        departmentId: null
      },
      total: 0,
      list: [],
      showDialog: false,
      roleDialog: false,
      roleIds: [],
      roleList: [],
      staffId: null
    };
  },
  created() {
    this.getDepartmentList();
  },
  methods: {
    // 获取组织部门列表
    async getDepartmentList() {
      const res = await getDepartmentApi();
      this.depts = transListToTreeDate(res, 0);

      this.queryParams.departmentId = this.depts[0].id;
      this.$nextTick(() => {
        this.$refs.deptTree.setCurrentKey(this.queryParams.departmentId);
      });

      this.getEmployeList();
    },
    // 设置选中的节点
    selectNode(event) {
      this.queryParams.departmentId = event.id;
      this.queryParams.page = 1;
      this.getEmployeList();
    },
    // 获取员工列表
    async getEmployeList() {
      const res = await getEmployeListApi(this.queryParams);
      // console.log("Res=>13", res);
      this.list = res.rows;
      this.total = res.total;
    },
    // 分页方法
    handleCurrentChange(page) {
      this.queryParams.page = page;
      this.getEmployeList();
    },
    // 模糊查询方法
    handleSearch: _.debounce(function() {
      this.queryParams.page = 1;
      this.getEmployeList();
    }, 300),
    // 前往详情页
    todetail() {
      this.$router.push("/employee/detail");
    },
    // 导出文件
    async exportEmployee() {
      const res = await exportEmployeeApi();
      FileSaver.saveAs(res, "员工信息.xlsx");
    },
    // 删除员工
    async handleDelete(id) {
      await deleteEmployeeApi(id);
      // console.log(res);
      this.getEmployeList();
    },
    // 编辑
    handleRouter(id) {
      this.$router.push(`/employee/detail/${id}`);
    },
    // 打开角色分配弹窗
    async handleRole(id) {
      this.staffId = id;
      const res = await getEnableRoleListApi();

      // 员工角色回显
      const { roleIds } = await getEmployeeDetailApi(id);

      this.roleList = res;
      this.roleIds = roleIds;
      this.roleDialog = true;
    },
    // 修改角色分配
    async handleAssignRole() {
      const res = await assignRoleApi({
        id: this.staffId,
        roleIds: this.roleIds
      });
      this.$message.success("分配用户角色成功");
      this.roleDialog = false;
    }
  }
};
</script>
<style scoped lang="scss">
.app-container {
  display: flex;

  .left {
    width: 280px;
    padding: 20px;
    border-right: 1px solid #eaeef4;
  }

  .right {
    flex: 1;
    padding: 20px;

    .username {
      height: 30px;
      width: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      background: #04c9be;
      font-size: 12px;
      display: inline-block;
    }
  }
}
</style>
