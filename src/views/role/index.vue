<template>
  <div class="container">
    <div class="app-container">
      <el-button type="primary" @click="showDialog = true">添加角色</el-button>
      <br />
      <el-table :data="roleList" border style="width: 100%">
        <el-table-column type="index" label="序号" width="100"></el-table-column>
        <el-table-column prop="name" label="角色">
          <template slot-scope="slot">
            <el-input
              type="text"
              v-if="slot.row.isEdit"
              v-model="slot.row.editRow.name"
              size="mini"
            ></el-input>
            <span v-else>{{slot.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="启用">
          <template slot-scope="slot">
            <el-switch
              v-if="slot.row.isEdit"
              v-model="slot.row.editRow.state"
              size="mini"
              :active-value="1"
              :inactive-value="0"
            />
            <span v-else>{{slot.row.state == 1? "已启用" : "禁用"}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述">
          <template slot-scope="slot">
            <el-input
              type="textarea"
              v-model="slot.row.editRow.description"
              :rows="3"
              v-if="slot.row.isEdit"
              size="mini"
            ></el-input>
            <span v-else>{{slot.row.description}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="操作">
          <template slot-scope="slot">
            <el-row v-if="slot.row.isEdit">
              <el-col :span="12">
                <el-button type="primary" size="mini" @click="handleConfrimRole(slot.row)">确定</el-button>
              </el-col>
              <el-col :span="12">
                <el-button size="mini" @click="slot.row.isEdit = false">取消</el-button>
              </el-col>
            </el-row>
            <template v-else>
              <el-button type="text" size="mini" @click="handleGetPermission(slot.row.id)">分配权限</el-button>
              <el-button type="text" size="mini" @click="handleEdit(slot.row)">编辑</el-button>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="confirmDel(slot.row.id)">
                <el-button slot="reference" style="margin-left: 10px" type="text" size="mini">删除</el-button>
              </el-popconfirm>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-row type="flex" align="middle" justify="center" style="height: 60px">
        <!-- 放置分页组件 -->
        <el-pagination
          :current-page="page"
          :page-size="pagesize"
          layout="total,  prev, pager, next"
          :total="total"
          @current-change="handleCurrentChange"
        />
      </el-row>

      <el-dialog title="新增角色" width="500px" :visible.sync="showDialog" :before-close="btnCancel">
        <el-form ref="form" :rules="rules" :model="roleForm" label-width="100px">
          <el-form-item label="角色名称" prop="name">
            <el-input
              v-model="roleForm.name"
              style="width: 300px"
              placeholder="请输入角色名称"
              size="mini"
            />
          </el-form-item>
          <el-form-item label="启用">
            <el-switch v-model="roleForm.state" size="mini" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input
              v-model="roleForm.description"
              type="textarea"
              :rows="3"
              style="width: 300px"
              size="mini"
              placeholder="请输入角色描述"
            />
          </el-form-item>
          <el-form-item>
            <el-row type="flex" justify="center" align="middle">
              <el-col :span="12">
                <el-button type="primary" size="mini" @click="confirmButton">确定</el-button>
                <el-button size="mini" @click="btnCancel">取消</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!-- 分配权限 -->
      <el-dialog title="分配权限" :visible.sync="showPermissionDialog">
        <el-tree
          ref="permissionTree"
          :data="permissionList"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="permissionIds"
          :props="defaultProps"
        />
        <el-row type="flex" justify="center" align="middle">
          <el-button size="mini" type="primary" @click="submitPermission">确定</el-button>
          <el-button size="mini" @click="showPermissionDialog = false">取消</el-button>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  getRoleListApi,
  addRoleApi,
  updateRoleInfoApi,
  removeRoleApi,
  getRoleDetailApi,
  assignPremissionApi
} from "@/api/role";
import { getPermissionListApi } from "@/api/permission";
import { transListToTreeDate } from "@/utils";
export default {
  name: "Role",
  components: {},
  data() {
    return {
      page: 1,
      pagesize: 5,
      roleList: [],
      total: 0,
      showDialog: false,
      showPermissionDialog: false,
      permissionList: [],
      permissionIds: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      roleId: "",
      roleForm: {
        name: "",
        description: "",
        state: 1
      },
      rules: {
        name: [
          { required: true, message: "角色名称不能为空", trigger: "blur" }
        ],
        description: [
          { required: true, message: "角色描述不能为空", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 获取用户列表
    async getRoleList() {
      const res = await getRoleListApi({
        page: this.page,
        pagesize: this.pagesize
      });
      // console.log(res);
      this.roleList = res.rows.map(item => {
        return {
          ...item,
          isEdit: false,
          editRow: {
            name: item.name,
            description: item.description,
            state: item.state
          }
        };
      });
      // console.log(this.roleList);
      this.total = res.total;
    },
    // 取消
    btnCancel() {
      this.$refs.form.resetFields();
      this.showDialog = false;
    },
    // 添加
    confirmButton() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          console.log(this.roleForm);
          const res = await addRoleApi(this.roleForm);
          // console.log(res);
          this.btnCancel();
        }
      });
    },
    // 分页
    handleCurrentChange(val) {
      this.page = val;
      this.getRoleList();
    },
    // 打开当前行编辑
    handleEdit(row) {
      row.isEdit = true;
    },
    // 确定修改
    async handleConfrimRole(row) {
      const res = await updateRoleInfoApi(row.id, {
        name: row.editRow.name,
        description: row.editRow.description,
        state: row.editRow.state,
        id: row.id
      });
      // console.log(res);
      row.isEdit = false;
      this.getRoleList();
    },
    // 删除用户
    async confirmDel(id) {
      const res = await removeRoleApi(id);
      this.getRoleList();
    },
    // 打开弹窗获取权限列表
    async handleGetPermission(id) {
      this.roleId = id;

      const res = await getPermissionListApi();
      this.permissionList = transListToTreeDate(res, 0);

      const { permIds } = await getRoleDetailApi(id);
      this.permissionIds = permIds;
      this.showPermissionDialog = true;
    },
    // 确认分配
    async submitPermission() {
      await assignPremissionApi({
        id: this.roleId,
        permIds: this.$refs.permissionTree.getCheckedKeys()
      });
      this.$message.success("角色分配成功");
      this.showPermissionDialog = false;
    }
  },
  created() {
    this.getRoleList();
  },
  computed: {},
  filters: {},
  watch: {}
};
</script>


<style lang="scss" scoped>
</style>
