<template>
  <div class="main">
    <header-title>{{ router.item }}</header-title>
    <van-pull-refresh
      @refresh="onRefresh"
      success-text="刷新成功"
      v-model="isLoading"
    >
      <van-list
        v-model="Loadinglist"
        :finished="finished"
        :immediate-check="false"
        :offset="50"
        finished-text="没有更多数据了"
        @load="onLoad"
      >
        <div style="border-bottom: 2px solid #DCDCDC"
          v-for="(item, index) in listData"
          :key="index"
          class="root"
          @click="detalis(item)"
        >
          <div class="one">
            <div class="bianhao">
              <div class="leftcode">
                {{
                  item.shouWenBianHao ||
                  item.faWenBianHao ||
                  item.shou_wen_bian_hao ||
                  item.fa_wen_bian_hao
                }}
              </div>
              <div class="rightcode">
                <!-- <div class="emergency" v-show="item.jinJiChengDu!=''"></div> -->
                <van-tag
                  type="primary" v-if="item.jinJiChengDu"
                  >
                  {{emergencyCodes(item.jin_ji_cheng_du || item.jinJiChengDu)}}
                  </van-tag>
                <div style="color:rgb(191, 191, 191)">
                  {{ flowCodes(item.workflowCode) }}
                </div>
              </div>
            </div>
          </div>
          <div class="one">
            <div
              class="biaoti"
              style="
                font-size: 15px;
                font-weight: bold;
                color: #000000;
              "
            >
              {{ item.biaoTi || item.biao_ti || item.biaoti }}
            </div>
            <div class="biaoti">
              <span>
                提交人：
                <span style="color:#000;">{{item.drafterName || item.drafter_name}}</span>
              </span>
              <span style="color:#9e9e9e">{{ item.drafterDate || item.drafter_date }}</span>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import {
  docList,
  getAttentionList,
  findBusinessDicts,
  getSearchConditionByCompany,
} from "@/api/api";
let emergency = [];
let CategoryCode = [];
export default {
  data() {
    return {
      loading: true,
      params: {
        //列表参数
        userId: "",
        biaoTi: "",
        laiWenZiHao: "",
        shouWenBianHao: "",
        faWenBianHao: "",
        pageSize: 10,
        pageNum: 1,
        isFinish: "",
      },
      attentionP: {
        queryTable: "",
        pageSize: 10,
        pageNum: 1,
        userId: "",
      },
      listData: [],
      isLoading: false,
      finished: false,
      Loadinglist: false,
      searchPage: 1,
    };
  },
  computed: {
    store() {
      return this.$store.state.userInfo;
    },
  },
  updated() {
    // 处理未匹配到的紧急程度
    let dom = document.getElementsByClassName("van-tag");
    for (let index = 0; index < dom.length; index++) {
      if (dom[index].innerHTML == "") {
        dom[index].style.display = "none";
      }
    }
  },
  created() {
    // 获取数字字典，紧急程度，公文类型
    this.findBusinessDictsApi();
    this.getSearchConditionByCompanyApi();
  },
  beforeRouteEnter(to, from, next) {
    next((res) => {
      res.router.item.indexOf("关注") > -1 ? res.attention() : res.getList();
    });
  },
  methods: {
    detalis(p) {
      console.log(p);
      let doctype = "",
        queryTable = "",
        requestType = "";
      //判断收发文类型，传递判断值

      // 收发文列表判断
      this.router.url.indexOf("out") > -1
        ? ((doctype = "outgoing"), (queryTable = "oa_outgoing_data"))
        : ((doctype = "incoming"), (queryTable = "oa_incoming_data"));
      p.doctype = doctype;
      p.queryTable = queryTable;
      // 接口数据不全，暂时本地字段判断展示
      // switch (p.workitemType) {
      //     case 'ToDo':
      //         requestType = 'dai_ban'
      //         break;
      //     case 'ToRead':
      //         requestType = 'dai_yue'
      //         break;
      //     default:
      //         break;
      // }
      console.log(p);
      switch (this.router.item) {
        case "待办":
          p.workitemType == "ZhengXun"
            ? (requestType = "dai_zheng_xun")
            : (requestType = "dai_ban");
          break;
        case "交办":
          p.workitemType == "ZhengXun"
            ? (requestType = "dai_zheng_xun")
            : (requestType = "dai_ban");
          break;
        case "待阅":
          requestType = "dai_yue";
          break;
        case "已办":
          requestType = "yi_ban";
          break;
        case "已阅":
          requestType = "yi_yue";
          break;
        case "流转":
          p == "ZhengXun"
            ? (requestType = "yi_zheng_xun")
            : (requestType = "liu_zhuan");
          break;
        default:
          break;
      }
      p.requestType = requestType;
      let navTo = this.router.item;
      if (navTo.indexOf("待办") > -1 || navTo.indexOf("交办") > -1) {
        this.$router.push({
          path: "/DocumentToDo/Document",
          query: p,
        });
      } else if (navTo.indexOf("待阅") > -1) {
        this.$router.push({
          path: "/DocumentToRead/index",
          query: p,
        });
      } else if (navTo.indexOf("已办") > -1 || navTo.indexOf("流转") > -1) {
        this.$router.push({
          path: "/DocumentToFinish/index",
          query: p,
        });
      } else if (navTo.indexOf("已阅") > -1) {
        this.$router.push({
          path: "/DocumentReadFinish/index",
          query: p,
        });
      } else if (
        navTo.indexOf("关注") > -1 ||
        navTo.indexOf("办结") > -1 ||
        navTo.indexOf("列表") > -1
      ) {
        this.$router.push({
          path: "/DoucumentAttentionFinish/index",
          query: p,
        });
      }
    },
    // 关注公文列表
    attention() {
      this.attentionP.userId = sessionStorage.getItem("userId");
      this.attentionP.queryTable = this.router.params;
      getAttentionList(this.attentionP).then((res) => {
        if (this.params.pageNum != 1 && this.finished != true) {
          this.listData.push(...res.data);
        } else {
          this.listData = res.data;
        }
        if (res.total <= this.listData.length) {
          this.finished = true;
        }
      });
    },
    // 下拉加载
    onLoad() {
      setTimeout(() => {
        console.log("++");
        // 检索page判断
        if (this.router.search) {
          this.searchPage++;
        } else {
          this.params.pageNum++;
        }
        this.getList();
      }, 1000);
    },
    // 待办待阅等列表
    getList() {
      console.log(this.router.params);
      if (this.router.item.indexOf("已办") > -1) {
        this.params.isFinish = 0;
      } else if (this.router.item.indexOf("办结") > -1) {
        this.params.isFinish = 1;
      } else if (this.router.item.indexOf("流转") > -1) {
        this.params.isFinish = 2;
      }
      let params = {};
      if (this.router.search) {
        // this.params = this.router.params
        this.params = JSON.parse(this.router.params);
        this.params.pageNum = this.searchPage;
      } else {
        this.params.userId = sessionStorage.getItem("userId");
      }
      let url = JSON.parse(JSON.stringify(this.router.url));

      docList("/" + url, {
        params: this.params,
      }).then((res) => {
        if (this.finished == false && this.params.pageNum != 1) {
          this.listData.push(...res.data);
        } else {
          this.listData = res.data;
        }
        if (res.total <= this.listData.length) {
          this.finished = true;
        }
        // 每次加载完都要设置为false
        this.Loadinglist = false;
      });
    },

    emergencyCodes(code) {
      let emergencynames = "";
      console.log("紧急程度");
      console.log(emergency);
      console.log(code);
      emergency.forEach((val) => {
        if (val.businessCode == code) {
          emergencynames = val.businessValue;
          return;
        }
      });
      return emergencynames;
    },
    show(e) {
      if (e != "" && e != undefined && emergency.length != 0) {
        return true;
      } else {
        return false;
      }
    },
    flowCodes(code) {
      let codename = "";
      CategoryCode.forEach((val) => {
        if (val.businessCode == code) {
          codename = val.businessValue;
          return;
        }
      });
      return codename;
    },
    findBusinessDictsApi() {
      console.log(this.router);
      // this.state.userInfo.user.companyId
      findBusinessDicts({
        params: {
          // categoryCodes: this.router.isdocType,
          categoryCodes: 'emergency',
          companyId: "",
        },
      }).then((res) => {
        console.log("后台紧急程度");
        console.log(res);
        emergency = res.data;
      });
    },
    getSearchConditionByCompanyApi() {
      getSearchConditionByCompany({
        params: {
          categoryCode: "document_type",
          companyId: "",
        },
      }).then((res) => {
        CategoryCode = res.data;
      });
    },
    // 上拉刷新
    onRefresh() {
      // 初始化页数变成1
      if (this.router.search) {
        this.searchPage = 1;
      } else {
        this.params.pageNum = 1;
      }
      this.listData = [];
      this.router.item.indexOf("关注") > -1 ? this.attention() : this.getList();
      this.isLoading = false;
      this.finished = false;
      this.Loadinglist = false;
    },
  },
};
</script>
<style scoped>
.main {
  position: absolute;
  width: 100%;
  height: auto;
}
.van-pull-refresh {
  height: 100%;
}
.root {
  /* font-size: 18px; */
  background-color: white;
  margin-bottom: 1px;
}
.bianhao {
  color: rgb(30, 108, 254);
}
.biaoti {
  text-align: left;
  word-break: break-all;
  padding: 5px 0;
  display: flex;
  justify-content: space-between;
}
.one {
  padding: 0 15px;
  margin-top: 6px;
  /* font-size: 18px; */
}
.one div {
  text-align: left;
  display: flex;
  justify-content: space-between;
}
.bianhao {
  /* font-size: 16px; */
}
.emergency {
  border: 1px #e25bff solid;
  border-radius: 7px;
  margin-right: 5px;
  padding: 1px;
  width: 100px;
  height: 100px;
}

.rightcode {
  display: flex;
  justify-content: space-around;
  width: auto;
}
.leftcode {
  width: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  white-space: nowrap;
  -webkit-line-clamp: 1;
}
/deep/.van-tag {
  margin-right: 8px;
  height: 23px;
}
.van-tag--primary {
  background-color: rgb(30, 108, 254);
}
</style>
