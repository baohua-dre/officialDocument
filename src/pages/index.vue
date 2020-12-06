<template>
  <div class="cont">
    <header-title>电子公文</header-title>
    <p class="indoc">
      <span class="lineHead"></span>
      收文
    </p>
    <div class="document">
      <div class="v1" v-for="(item, index) in swlistData" :key="index">
        <div
          class="circle"
          v-if="item.item == '待办' && oaIncomingToDoTotal != 0"
        >
          {{ oaIncomingToDoTotal }}
        </div>
        <div
          class="circle"
          v-if="item.item == '待阅' && oaIncomingToReadTotal != 0"
        >
          {{ oaIncomingToReadTotal }}
        </div>
        <div
          class="circle"
          v-if="item.item == '交办' && oaIncomingDoListABTotle != 0"
        >
          {{ oaIncomingDoListABTotle }}
        </div>
        <img class="img" :src="imgsrc(item.img)" @click="toList(item)" />
        <div class="tv1">{{ item.item }}</div>
      </div>
    </div>
    <div class="line"></div>
    <p class="indoc"><span class="lineHead"></span> 发文</p>
    <div class="document">
      <div class="v1" v-for="(item, index) in fwlistData" :key="index">
        <div
          class="circle"
          v-if="item.item == '待办' && oaOutgoingToDoTotal != 0"
        >
          {{ oaOutgoingToDoTotal }}
        </div>
        <div
          class="circle"
          v-if="item.item == '待阅' && oaOutgoingToReadTotal != 0"
        >
          {{ oaOutgoingToReadTotal }}
        </div>
        <div
          class="circle"
          v-if="item.item == '交办' && oaOutgoingDoListABTotle != 0"
        >
          {{ oaOutgoingDoListABTotle }}
        </div>
        <img class="img" :src="imgsrc(item.img)" @click="toList(item)" />
        <div class="tv1">{{ item.item }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getOaDocumentTotle,
  getBasicDeptUserByIds,
  checkAbConfigureExists,
  getoatoken1,
} from "@/api/api";
// import  {getUrl} from "@/main.js";
export default {
  data() {
    return {
      userId: '',
      single: false,
      // 切勿随意改动，有按钮信息关联
      fwlistData: [
        {
          item: "待办",
          url: "outDocument/dolist",
          img: "ic_wait_do.png",
        },

        {
          item: "待阅",
          url: "outDocument/readList",
          img: "ic_wait_read.png",
        },
        {
          item: "已办",
          url: "outDocument/toDoList",
          img: "ic_have_do.png",
        },
        {
          item: "已阅",
          url: "outDocument/toReadList",
          img: "ic_have_read.png",
        },
        {
          item: "关注",
          url: "attention/getAttentionList",
          params: "oa_outgoing_data",
          img: "ic_mine_follow.png",
        },
        // {
        //   item: "办结",
        //   url: "outDocument/toDoList",
        //   img: "ic_had_do.png",
        // },
        // {
        //   item: "流转",
        //   url: "outDocument/toDoList",
        //   img: "ic_had_do.png",
        // },
      ],
      swlistData: [
        {
          item: "待办",
          url: "inDocument/dolist",
          img: "ic_wait_do.png",
        },
        {
          item: "待阅",
          url: "inDocument/readList",
          img: "ic_wait_read.png",
        },
        {
          item: "已办",
          url: "inDocument/toDoList",
          img: "ic_have_do.png",
        },
        {
          item: "已阅",
          url: "inDocument/toReadList",
          img: "ic_have_read.png",
        },
        {
          item: "关注",
          url: "attention/getAttentionList",
          params: "oa_incoming_data",
          img: "ic_mine_follow.png",
        },
        // {
        //   item: "办结",
        //   url: "inDocument/toDoList",
        //   img: "ic_had_do.png",
        // },
        // {
        //   item: "流转",
        //   url: "inDocument/toDoList",
        //   img: "ic_had_do.png",
        // },
      ],
      oaAllTotle: "0",
      oaIncomingToDoTotal: "0",
      oaIncomingToReadTotal: " 0",
      oaIncomingDoListABTotle: "0",
      oaOutgoingToDoTotal: "0",
      oaOutgoingToReadTotal: "0",
      oaOutgoingDoListABTotle: "0",
      abRole: false,
      id_token:'',
    };
  },
  created(){
    var p = {
        userName: 'chenqiuzhen',
        passWord: 'chenqiuzhen@123'
    }
    
      //     // 2020年11月17日08:49:05
      // var that = this
      getoatoken1({
        username: p.userName,
        password: p.passWord,
      }).then((msg) => {
        // this.id_token = getUrl()
        // console.log('@@@@@@@'+id_token);
        this.userId = msg.data.userId
        console.log("this.userId")
        console.log('--------'+this.userId)
        this.$store.commit("Login_in", msg.data);
        this.$store.commit("set_token", msg.data.token);
        this.$store.commit("set_userId", msg.data.userId);
        sessionStorage.setItem("userId", msg.data.userId);
        sessionStorage.setItem("userToken", msg.data.token);
        // document.write(JSON.stringify(this.userInfos.user.roles))
        let isWenshu = this.userInfos.user.roles.some(
          (f) => f.roleName.indexOf("文书") > -1
        );
        if (isWenshu) {
          this.$set(this.swlistData, this.swlistData.length, {
            item: "办结",
            url: "inDocument/toDoList",
            img: "ic_had_do.png",
          });
          this.$set(this.swlistData, this.swlistData.length, {
            item: "流转",
            url: "inDocument/toDoList",
            img: "ic_had_do.png",
          });
        }
        // alert(that.userInfos)
        this.getnum();
    this.getBasicDeptUserByIdsApi();
    this.checkAbConfigureExistsApi();
      });

    //   getoatoken1({
    //     username: p.userName,
    //     password: p.passWord,
    //   }).then((msg) => {
    //     this.userId = msg.data.userId
    //     console.log("this.userId")
    //     console.log(this.userId)
    //     this.$store.commit("Login_in", msg.data);
    //     this.$store.commit("set_token", msg.data.token);
    //     this.$store.commit("set_userId", msg.data.userId);
    //     sessionStorage.setItem("userId", msg.data.userId);
    //     sessionStorage.setItem("userToken", msg.data.token);
    //     // document.write(JSON.stringify(this.userInfos.user.roles))
    //     let isWenshu = this.userInfos.user.roles.some(
    //       (f) => f.roleName.indexOf("文书") > -1
    //     );
    //     if (isWenshu) {
    //       this.$set(this.swlistData, this.swlistData.length, {
    //         item: "办结",
    //         url: "inDocument/toDoList",
    //         img: "ic_had_do.png",
    //       });
    //       this.$set(this.swlistData, this.swlistData.length, {
    //         item: "流转",
    //         url: "inDocument/toDoList",
    //         img: "ic_had_do.png",
    //       });
    //     }
    //     // alert(that.userInfos)
    //     this.getnum();
    // this.getBasicDeptUserByIdsApi();
    // this.checkAbConfigureExistsApi();
    //   });


  },
  mounted() {
    console.log(this.$store.state.userInfo);
  },
  computed: {
    userInfos() {
      return this.$store.state.userInfo;
    },
  },
  methods: {
    toList(p) {
      p.isdocType = "emergency";
      // if (p.url.indexOf("out") > -1) {
      //   p.isdocType = "emergency_fw";
      // } else {
      //   p.isdocType = "emergency_sw";
      // }
      this.$router.push({
        path: "/DocumentList",
        query: p,
      });
    },
    imgsrc(item) {
      return require("@/assets/document/" + item);
    },
    checkAbConfigureExistsApi() {
      let p = sessionStorage.getItem("userId");
      checkAbConfigureExists({
        params: {
          userId: p,
          roleCode: 2,
        },
      }).then((res) => {
        this.abRole = res.data.configureExists;
        // 判断用户是否显示交办
        if (res.data.configureExists) {
          this.$set(this.fwlistData, this.fwlistData.length, {
            item: "交办",
            url: "outDocument/outDoAblist",
            img: "ic_wait_read.png",
            isShow: false,
          });
          this.$set(this.swlistData, this.swlistData.length, {
            item: "交办",
            url: "inDocument/inDoAblist",
            img: "ic_wait_read.png",
          });
          //发文交办去重
          let objfw = {};
           this.fwlistData= this.fwlistData.reduce((cur,next) => {
                objfw[next.item] ? "" : objfw[next.item] = true && cur.push(next);
                return cur;
            },[]);
          //收文交办去重
          let obj = {};
           this.swlistData= this.swlistData.reduce((cur,next) => {
                obj[next.item] ? "" : obj[next.item] = true && cur.push(next);
                return cur;
            },[]);
        }
      });
    },
    getnum() {
      // alert('niaho')
      let that = this;
      let p = sessionStorage.getItem("userId");
      // document.write(p)
      // 获取待办条数
      console.log(p);
      getOaDocumentTotle({
        params: {
          userId: p,
        },
      })
        .then((res) => {
          console.log(res);
          that.oaIncomingToDoTotal = res.data[0].oaIncomingToDoTotal;
          that.oaIncomingToReadTotal = res.data[0].oaIncomingToReadTotal;
          that.oaIncomingDoListABTotle = res.data[0].oaIncomingDoListABTotle;
          that.oaOutgoingToDoTotal = res.data[0].oaOutgoingToDoTotal;
          that.oaOutgoingDoListABTotle = res.data[0].oaOutgoingDoListABTotle;
          that.oaOutgoingToReadTotal = res.data[0].oaOutgoingToReadTotal;
        })
        .catch((e) => {});
    },
    getBasicDeptUserByIdsApi() {
      let p = sessionStorage.getItem("userId");
      getBasicDeptUserByIds({
        params: {
          userIds: p,
          tagKey: "bumen",
        },
      }).then((res) => {
        let val = res.data[sessionStorage.getItem("userId")];
        this.$store.commit("get_basicDept", val.basicDept);
      });
    },
    // // 获取当前页面的url
    // getUrl(){
    //   // 获取当前窗口的URL
    //   // let url = window.location.href
    //   let url = 'http://192.168.80.102/mobile/oa/?id_token=eyJhbGciOiJSUzI1NiIsImtpZCI6IjU1NDEwMDIyMjYzNTI1MDkyNjEifQ.eyJlbWFpbCI6IjEzNzY1ODAxMjU4QDEzOS5jb20iLCJuYW1lIjoi6ZmIKuecnyIsIm1vYmlsZSI6IjEzNzY1ODAxMjU4IiwiZXh0ZXJuYWxJZCI6IjEwOTk2NCIsInVkQWNjb3VudFV1aWQiOiI5N2Y4ZGNmOTgwZjhjOTdkOWU3NDE4NzRlNDM5ZGIxZWN5TUxiNUM0bFFmIiwib3VJZCI6IjA5OTAwMDA0Iiwib3VOYW1lIjoi6Zmi5Yqe77yI5YWa5Yqe77yJIiwib3BlbklkIjpudWxsLCJpZHBVc2VybmFtZSI6IjEwOTk2NCIsInVzZXJuYW1lIjoiMTA5OTY0IiwiYXBwbGljYXRpb25OYW1lIjoi5pawT0Eg55S15a2Q5YWs5paHIiwiZW50ZXJwcmlzZUlkIjoidGt5IiwiaW5zdGFuY2VJZCI6InRreSIsImFsaXl1bkRvbWFpbiI6IiIsImV4dGVuZEZpZWxkcyI6eyJ0aGVtZUNvbG9yIjoiZ3JlZW4iLCJhcHBOYW1lIjoi5pawT0Eg55S15a2Q5YWs5paHIn0sImV4cCI6MTYwNjk5MjMwNSwianRpIjoiUzA2T3lvbkNkWlNSX0lUal9uM0dtdyIsImlhdCI6MTYwNjk5MTcwNSwibmJmIjoxNjA2OTkxNjQ1LCJzdWIiOiIxMDk5NjQifQ.dwWwkCpl1PS23xXfeUc72B3t2svHaUwkvf9Lumf8vcpo8BT0tDBHepI275CDkUNpE2zj0puTEBIBH9LTpxThL8GrZkzXCaZLmhsSkdbql1dH8jOE3HrpWGbMfydv_ONR7SstJtjyEIJGuJT3fMXIc11uIRthDw0qX6j8uW6bF_A-gulCymRpxSuBgfj61PhUbZh8Ujqa1hG2pKhuhJpjPd-LaXsQTSAOj1VAazpVNqtrxxJZJF-_BWl8A2zeN34wjMWneGJamet_FAeBicatXCkCFtDCCdpxTTCed8V2aE7mp3SvVrmCwYZDPwUJ4fx4FvuFIFiT60AMtZnj9tVS-A#/'
    //   console.log('-------'+url + typeof(url));
    //   let str = url.split('?id_token=')[1]
    //   console.log(str);
    //   // token 后面两个#/不要，要不解析不出来
    // }
  },
};
</script>
<style scoped>
.cont {
  padding: 0px 10px;
  /* font-size: 14px; */
}
.document {
  display: flex;
  /* justify-content: space-between;     */
  width: 100%;
  flex-wrap: wrap;
  /* font-size: 18px; */
}
.line {
  width: 100%;
  background: #f1f1f1;
  height: 2px;
  margin-top: 14px;
}
.indoc {
  text-align: left;
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: #165fde;
  padding: 10px;
}
.v1 {
  width: 25%;
  margin-bottom: 18px;
  position: relative;
}
.v1 img {
  width: 45px;
}
.circle {
  padding: 5px;
  width: 24px !important;
  line-height: 14px;
  font-size: 14px;
  color: white;
  background-color: red;
  text-align: center;
  border-radius: 50%;
  position: absolute;
  left: 48px;
  top: -6px;
  z-index: 333;
}
.lineHead {
  display: inline-block;
  width: 4px;
  height: 13px;
  background: #165fde;
}
</style>
