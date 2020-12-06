<template>
  <div class="main">
    <list
      :loading="loading"
      :doc_xinxi="doc_xinxi"
      :doc_data="doc_data"
      :zwfile="zwfile"
      :oa_comment="oa_comment"
      :receive_note="receive_note"
      :submit_note="submit_note"
      :zhengXunOpinion="zhengXunOpinion"
    ></list>
    <div class="yijian">
      <div class="height">填写意见</div>
      <div class="yijian-content">
        <textarea name="" id="textarea" @blur="blurText" v-model="textarea" placeholder="请输入填写意见">
        </textarea>
        <div @click="success" class="textarea-success">常用意见</div>
        <van-popup
          v-model="showSuccess"
          position="bottom"
          :style="{ height: '50%' }"
        >
          <van-picker
            class="fonts"
            show-toolbar
            :columns="columnsSuccess"
            @confirm="onConfirm"
            @cancel="onCancel"
          />
        </van-popup>
      </div>
      <!-- <button @click="end($event)">会签反馈</button> -->
    </div>
    <footer>
      <van-skeleton title :row="2" :loading="btloading" />
      <div class="btn">
        <van-button
          type="info"
          loading-text="加载中..."
          v-showBtn="{ name: 'ti_jiao', data: btnData }"
          @click.stop="TiJiao"
        >提交</van-button>
        <van-button
          type="info"
          class="zxyj"
          loading-text="加载中..."
          v-showBtn="{ name: 'zheng_xun_yi_jian', data: btnData }"
          @click="zhiXi('zheng_xun_yi_jian')"
        >征询意见</van-button>
        <van-button
          type="danger"
          loading-text="加载中..."
          v-showBtn="{ name: 'hui_qian_fan_kui', data: btnData }"
          @click="huiqian()"
        >会签反馈</van-button>

        <van-button
          type="primary"
          loading-text="加载中..."
          v-showBtn="{ name: 'jie_shu', data: btnData }"
          @click="end($event)"
        >结束</van-button>
        <van-button
          type="danger"
          loading-text="加载中..."
          v-showBtn="{ name: 'tui_hui', data: btnData }"
          @click="sendBack"
        >退回</van-button>
        <van-button
          type="info"
          loading-text="加载中..."
          v-showBtn="{ name: 'zhi_xi', data: btnData }"
          @click="zhiXi('zhi_xi')"
        >知会</van-button>
      </div>
    </footer>
    <van-dialog
      v-model="dialog"
      title="选择人员"
      show-cancel-button
      @confirm="confirm"
      @cancel="cancel"
    >
      <van-radio-group v-model="name" class="group">
        <div v-for="(item, index) in radio" :key="index">
          <van-radio :name="index" @click="change(item)">{{
            item.nodeName
          }}</van-radio>
        </div>
      </van-radio-group>
    </van-dialog>
  </div>
</template>
<script>
import {
  saveOpinion,
  nextNodeUserTree,
  getByWorkitemId,
  carsoaSubmit,
  getoftenComments,
  getWorkItemToBack
} from "@/api/api";
import list from "@/pages/common/list.vue";
import { minxin } from "@/common/mixins/getList.js";
import { mapState } from "vuex";
export default {
  mixins: [minxin],
  data() {
    return {
      showSuccess: false, //意见弹出层
      columnsSuccess: [], //弹出层数据
      dialog: false,
      radio: [],
      name: 0,
      peopleData: [],
      textarea: "",
      textareaid: "",
      textfildjson: "",
      workitemType: "",
      backP:{
        userCode:'',
        workItemId:'',
        commentText:'',
        documentId:'',
        opinionId:'',
        workitemType:''
      },
      // 提交和结束的接口参数
      endP: {
        userId: "",
        instanceId: "",
        documentId: "",
        sign: "",
        nextActivityCode: "",
        participant: "",
        workItemId: "",
        serviceTable: "",
        queryTable: "",
        opinionId: "",
        workFlowCode:'',
        finishAccessPoint: "mobile",
        readEnd: ""
      },
      saveOpinion: {
        documentId: "",
        objectId: "",
        instanceId: "",
        workitemId: "",
        activityCode: "",
        displayName: "",
        approvalUserId: "",
        approvalOpinion: "",
        approvalOpinionInput: "",
        waitDoOrRead: "",
        approvalOpinionImgId: "",
        counterSignDept: "",
        counterSignDeptId: "",
        approvalUserName: "",
        approvalDepartment: "",
        approvalDepartmentInfo: "",
        approvalDepartmentId: "",
        approvalPosition: "",
        deptLevel: "",
        departSortNumber: "",
        departPostSortNumber: "",
        attachmentFileId: "",
        attachmentFileName: "",
        commentBath: "",
        optionalFeedbackComment: "",
        textField: "",
        textFieldJson: "",
        state: "0",
        mobileOrPc: "mobile"
      },
      isBlurText:false //是否执行了意见
    };
  },
  computed: {
    ...mapState(["optionYj"])
  },
  components: { list },
  mounted() {
    this.getByWorkitemIdApi();
    
    this.textarea = this.optionYj.yj;
    this.apiGetoftenComments();
  },
  watch: {
    optionYj(newVal) {
      this.textarea = newVal.yj;
    }
  },
  methods: {
    //获取常用意见
    apiGetoftenComments() {
      const params = {
        pageSize: 1,
        pageNum: 999,
        userId: sessionStorage.getItem("userId")
      };
      getoftenComments({
        params: params
      }).then(res => {
        if (res.code == 20000) {
          //成功关注改变状态
          res.data.forEach(item => {
            this.columnsSuccess.push(item.oftenComments);
          });
        }
      });
    },
    sendBack(){
      this.$Dialog
        .confirm({
          title: "标题",
          message: "请确定是否要退回？"
        })
        .then(() => {
          this.getWorkItemToBackApi()
        })
        .catch(() => {
          // on cancel
        });
    },
    async getWorkItemToBackApi(){
      if(this.isBlurText == false){
        await this.blurText()
      }
      this.backP.userCode = sessionStorage.getItem("userId")
      this.backP.workItemId = this.router.workitemId
      this.backP.documentId = this.router.documentId
      // this.backP.opinionId = this.$store.state.optionYj.id;
      this.backP.workitemType = this.workitemType
      this.backP.commentText = ''
      await getWorkItemToBack(this.backP).then(res=>{
        if (res.code == 20000) {
          this.$Toast({ type: "success", message: "退回成功" });
            setTimeout(() => {
              window.history.back(-1);
            }, 550);
          } else {
        }
      })
    },
    blurText() {
      this.isBlurText = true
      // 延迟执行，先出发点击事件，后失焦
      // setTimeout(() => {
        let p = this.router;
        let user = this.state.userInfo.user;
        let basicDept = this.state.basicDept;
        this.saveOpinion.documentId = p.documentId;
        this.saveOpinion.workitemId = p.workitemId;
        this.saveOpinion.approvalUserName = user.userName;
        this.saveOpinion.approvalDepartmentInfo = user.departName;
        this.saveOpinion.approvalDepartment = user.dept.deptName;
        this.saveOpinion.departPostSortNumber = user.sortNumber;
        this.saveOpinion.instanceId = p.instanceId;
        this.saveOpinion.deptName = user.dept.deptName;
        this.saveOpinion.approvalUserId = user.userId;
        this.saveOpinion.activityCode = p.activityCode;
        this.saveOpinion.approvalOpinionInput = this.textarea;
        this.saveOpinion.waitDoOrRead = "ToDo";
        this.saveOpinion.textFieldJson = this.textfildjson;
        this.saveOpinion.departSortNumber = basicDept.sortNumber;
        this.saveOpinion.approvalDepartmentId = basicDept.objectId;
        this.saveOpinion.deptLevel = basicDept.deptLevel;
        if (this.optionYj.id) {
          this.saveOpinion.objectId = this.optionYj.id;
        }
        return new Promise((resolve, reject)=>{
            setTimeout(() => {
              saveOpinion(this.saveOpinion).then(res => {
                let a = {
                  yj: res.data.approvalOpinionInput,
                  id: res.data.objectId
                };
                // 提前赋值防止赋值失败
                this.endP.opinionId = res.data.objectId;
                this.backP.opinionId = res.data.objectId;
                // 也可以注释掉
                this.$store.commit("set_yijian", a);
                resolve()
            }, 100);
          });
        })
      // }, 100);
    },
    getByWorkitemIdApi() {
      getByWorkitemId({
        params: {
          type: "ToDo",
          workitemId: this.router.workitemId
        }
      }).then(res => {
        console.log(res);
        this.textfildjson = res.data.textField;
        this.workitemType = res.data.workitemType;
        this.saveOpinion.displayName = res.data.displayName
      });
    },
    confirm() {
      //回到最初的起点
      this.peopleData = this.radio[this.name];
      this.name = 0;
      this.$router.push({
        path: "/DocumentToDo/selectPeople/submit",
        query: {
          peopData: this.peopleData,
          docData: this.router,
          opinionId: this.endP.opinionId
        }
      });
    },
    zhiXi(e) {
      this.router.zhixiType = e;
      this.$router.push({
        path: "/DocumentToDo/selectPeople/zhixi",
        query: this.router
      });
    },
    cancel() {
      //回到最初的起点
      this.name = 0;
    },
    huiqian() {
      this.$router.push({
        name: "feedback",
        params: {
          result: this.oa_comment,
          query: this.router
        }
      });
    },
    change(e) {
      this.peopleData = e;
    },
    async TiJiao() {
      if(this.isBlurText == false){
        await this.blurText()
      }
      // await this.blurText()
    
      // 全是业务代码！！！！！！！！！！！！！！！！！！！！！！！！
      if(this.$store.state.optionYj.hasOwnProperty('id')){
        this.endP.opinionId = this.$store.state.optionYj.id;
        this.backP.opinionId = this.$store.state.optionYj.id;
      }
      await nextNodeUserTree({
        params: {
          workItemId: this.router.workitemId,
          userId: sessionStorage.getItem("userId"),
          departId: this.state.userInfo.user.deptId
        }
      }).then(res => {        
        let name = ''
        this.radio = res.data;   
        if(res.directSubmit!=''){
          this.dialog = false;
          const nextcode = res.data[0].nodeCode
          this.endP.userId = sessionStorage.getItem("userId");
          this.endP.instanceId = this.router.instanceId;
          this.endP.documentId = this.router.documentId;
          this.endP.queryTable = this.router.queryTable;
          this.endP.participant = res.directSubmit;
          this.endP.workitemType = this.workitemType;
          this.endP.workFlowCode = this.router.workflowCode;
          this.endP.serviceTable = this.router.serviceTable;
          this.endP.workItemId = this.router.workitemId;
          this.endP.nextActivityCode = nextcode;          
          res.data[0].data.forEach(item=>{
            item.type == 'user'?name = item.name:''
          })
          this.$Dialog.confirm({
            title: '标题',
            message: '确定要提交到('+name+')吗？',
          })
          .then(() => {
            // on confirm
            this.carsoaApi()
          })
          .catch(() => {
            // on cancel
          })
        }else{
          this.dialog = true;
        }
      });
    },
    end(e) {
      this.endP.userId = sessionStorage.getItem("userId");
      this.endP.instanceId = this.router.instanceId;
      this.endP.documentId = this.router.documentId;
      this.endP.queryTable = this.router.queryTable;
      this.endP.workitemType = this.workitemType;
      this.endP.workFlowCode = this.router.workflowCode;      
      this.endP.serviceTable = this.router.serviceTable;
      this.endP.workItemId = this.router.workitemId;
      this.endP.nextActivityCode = "Activity4";
      this.$Dialog
        .confirm({
          title: "标题",
          message: "请确定是否要结束？"
        })
        .then(() => {
          this.carsoaApi()
        })
        .catch(() => {
          // on cancel
        });
    },
    // 提交结束接口
    carsoaApi(){
      carsoaSubmit(this.endP).then(res => {
          if (res.code == 20000) {
            this.$Toast({ type: "success", message: "提交成功" });
            setTimeout(() => {
              window.history.back(-1);
            }, 750);
          } else {
          }
        });
    },
    success() {
      this.showSuccess = true;
    },
    onConfirm(value, index) {
      this.textarea = value;
      this.showSuccess = false;
      this.blurText();
    },
    onCancel() {
      this.showSuccess = false;
    }
  }
};
</script>
<style scoped>
@import "../common/list.css";
.zxyj{
  background: #ebb563;
  border: #ebb563;
  font-size: 18px
}

</style>
