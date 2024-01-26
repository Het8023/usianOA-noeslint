<template>
  <el-cascader
    :value="value"
    size="mini"
    class="inputW"
    :props="props"
    :options="options"
    @change="handleChange"
  />
</template>
<script>
import { getDepartmentApi } from "@/api/department";
import { transListToTreeDate } from "@/utils";
export default {
  name: "SeletTree",
  props: {
    value: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      options: [],
      props: {
        label: "name",
        value: "id",
        children: "children"
      }
    };
  },
  created() {
    this.getDepartment();
  },
  methods: {
    async getDepartment() {
      const res = await getDepartmentApi();

      this.options = transListToTreeDate(res, 0);
    },
    handleChange(event) {
      console.log("event===>", event);
      if (event.length > 0) {
        this.$emit("input", event[event.length - 1]);
      } else {
        this.$emit("input", null);
      }
    }
  }
};
</script>
<style scoped></style>
