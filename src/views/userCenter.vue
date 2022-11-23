<template>
  <div>
    <!-- 标头 -->
    <div class="settingsStyleTitle">基本设置</div>
    <!-- 用户内容 -->
    <div style="display: flex">
      <div class="userImageStyle">
        <div class="userImageSpan">用户头像</div>
        <div style="height: 160px; margin-bottom: 12px">
          <el-image
            style="width: 160px; height: 160px; border-radius: 8px"
            :src="formData.url"
            fit="fill"
          ></el-image>
        </div>
        <el-upload action="" style="line-height: 34px; height: 34px">
          <el-button icon="el-icon-upload2" type="primary" plain
            >更换头像</el-button
          >
        </el-upload>
      </div>
      <!-- 用户设置表单 -->
      <el-form class="userSettingForm" :model="formData" label-width="80px">
        <el-form-item label="邮箱">
          <el-input v-model="formData.mail"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="formData.username"></el-input>
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input
            v-model="formData.userInfo"
            type="textarea"
            :rows="2"
          ></el-input>
        </el-form-item>
        <el-form-item label="国家/地区">
          <el-select v-model="formData.country" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所在省市" class="proviceStyle">
          <el-select v-model="formData.province" style="margin-right: 16px">
            <el-option
              v-for="item in province"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select v-model="formData.city">
            <el-option
              v-for="item in city"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="街道地址"
          ><el-input v-model="formData.address"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" class="proviceStyle">
          <el-input
            v-model="formData.phoneSuff"
            style="width: 100px; margin-right: 16px"
          ></el-input>
          <el-input v-model="formData.phoneNum"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-check">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formData: {
        url: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
        mail: "shuxiangxuebiancheng@test.com",
        username: "书香学编程",
        userInfo: "软件开发者，编程爱好者",
        country: "China",
        province: "shandong",
        city: "jinan",
        address: "山东省济南市历下区趵突泉南路1号",
        phoneSuff: "0531",
        phoneNum: "88812345",
      },
      options: [
        {
          value: "China",
          label: "中国",
        },
      ],
      province: [
        {
          value: "shandong",
          label: "山东省",
        },
      ],
      city: [
        {
          value: "jinan",
          label: "济南市",
        },
        {
          value: "qingdao",
          label: "青岛市",
        },
      ],
    };
  },
};
</script>
<style lang="less" scoped>
.settingsStyleTitle {
  margin-bottom: 12px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 540;
  font-size: 20px;
  line-height: 28px;
  text-align: left;
}
.userSettingForm {
  text-align: left;
  margin-left: 10px;
  border: 1px solid #ebeef5;
  padding: 16px;
  border-radius: 8px;
  width: 100%;
  .el-form-item {
    line-height: 50px;
    max-width: 460px;
  }
}
.userImageStyle {
  width: 300px;
  text-align: center;
  border: 1px solid #ebeef5;
  padding: 16px;
  border-radius: 8px;
}
:deep(.proviceStyle .el-form-item__content) {
  display: flex;
}
.userImageSpan {
  line-height: 32px;
  margin-bottom: 12px;
  font-weight: 500;
}
</style>
