<template>
  <div style="background: #fafafa">
    <div class="main">
      <!-- <van-tabs @click="onClick">
      <van-tab v-for="(item,index) in ['收文稿纸','原始稿纸']" :title="item" :key="index">
        content of tab {{ item }}
      </van-tab>
    </van-tabs> -->
      <header-title @isShowbh="getData">{{
        router.item || "详情"
      }}</header-title>
      <!-- <div style="text-align:left" class="height">基本信息</div> -->
      <van-skeleton title :row="6" :loading="loading" />
      <div class="xinxi linebold">
        <div class="lineFlex">
          <span style="font-weight: bold">{{
            doc_data.shou_wen_bian_hao
          }}</span>
          <span>
            <van-tag v-if="doc_data.jin_ji_cheng_du" style="padding: 5px" type="primary">
              {{ emergencyCodes(doc_data.jin_ji_cheng_du) }}
            </van-tag>
            <span>{{ mijiCodes(doc_data.wen_jian_mi_ji) }}</span>
          </span>
        </div>
        <div style="margin-top: 6px">
          发文单位：{{ doc_data.lai_wen_dan_wei }}
        </div>
        <!-- <div v-for="(item, index) in doc_xinxi" :key="index">
        <div class="row" style="word-break: break-all">{{ item.infoType }}:{{ item.infoValue }}</div>
      </div> -->
      </div>
      <div class="linebold height">
        <div class="line height">正文</div>
        <div class="fileHeight">
          <div class="file" v-for="(item, index) in zwfile" :key="index">
            <div
              v-if="item.file_category == 'mainBody'"
              @click="saveFile(item)"
            >
              {{ item.real_name }}
            </div>
          </div>
        </div>
      </div>
      <div class="linebold height" v-if="attachment">
        <div class="line height">附件</div>
        <div class="fileHeight">
          <div class="file" v-for="(item, index) in zwfile" :key="index">
            <div
              v-if="item.file_category == 'attachment'"
              @click="saveFile(item)"
            >
              {{ item.real_name }}
            </div>
          </div>
        </div>
      </div>
      <div class="linebold height" v-if="relation">
        <div class="line height">关联文档</div>
        <div class="file" v-for="(item, index) in zwfile" :key="index">
          <div v-if="item.file_category == 'relation'" @click="saveFile(item)">
            {{ item.real_name }}
          </div>
        </div>
      </div>
      <div class="linebold" v-if="receive_note.length != 0">
        <div class="option line">
          <div class="height">便签</div>
          <!-- <div style="color:blue;" @click="fold">{{flag?'展开':'收起'}}</div> -->
        </div>
        <div v-for="(item, index) in receive_note" :key="index" class="line">
          <div>
            <div>
              <span style="color: rgb(240, 173, 78); font-weight: bold"
                >来自（{{ item.submitUserName }}）的便签</span
              >:{{ item.noteContent }}
            </div>
          </div>
        </div>
        <div v-for="(item, index) in submit_note" :key="index + 1" class="line">
          <div>
            <div>
              <span style="color: rgb(240, 173, 78); font-weight: bold"
                >发自（{{ item.receiveUserName }}）的便签</span
              >:{{ item.noteContent }}
            </div>
          </div>
        </div>
      </div>
      <div class="linebold" v-if="zhengXunOpinion.length != 0">
        <div class="option line">
          <div class="height">征询意见({{ zhengXunOpinion.length }})</div>
          <!-- <div style="color:blue;" @click="fold">{{flag?'展开':'收起'}}</div> -->
        </div>
        <div v-for="(item, index) in zhengXunOpinion" :key="index" class="line">
          <div>
            <div>
              {{ item.approvalUserName }}（{{ item.displayName }}）:{{
                item.approvalOpinionInput
              }}
            </div>
            <div class="time">
              <div>{{ item.approvalDepartment }}</div>
              <div>{{ item.approvalDate }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="linebold">
        <div class="option line">
          <div class="height">审批意见({{ oa_comment.length }})</div>
          <div
            style="color: rgb(30, 108, 254)"
            @click="fold"
            v-if="oa_comment.length > 2"
          >
            {{ flag ? "展开" : "收起" }}
          </div>
        </div>
        <div
          v-for="(item, index) in filteroption"
          :key="index"
          class="line noneLine"
        >
          <div>
            <div>
              <span class="fontBlod"
                >{{ filteroption.length - index }}.{{
                  item.approvalUserName
                }}（{{ item.displayName }}）</span
              >:{{ item.approvalOpinionInput }}
            </div>
            <div class="time">
              <div>{{ item.approvalDepartment }}</div>
              <div>{{ item.approvalDate }}</div>
            </div>
          </div>
        </div>
      </div> -->
        <!-- 审批意见 -->
      <div class="linebold" v-if="oa_comment.yunlingdaopishiyijian">
        <div class="option line" >
          <div class="height">院领导审批意见({{ oa_comment.yunlingdaopishiyijian.length }})</div>
          <div
            style="color: rgb(30, 108, 254)"
            @click="foldyunlingdao"
            v-if="oa_comment.yunlingdaopishiyijian !== undefined && oa_comment.yunlingdaopishiyijian.length > 2"
          >
            {{ flag ? "展开" : "收起" }}
          </div>
        </div>
        <div
          v-for="(item, index) in filteryunlingdao"
          :key="index"
          class="line noneLine"
        >
          <div>
            <div>
              <span class="fontBlod"
                >{{ filteryunlingdao.length - index }}.{{
                  item.approvalUserName
                }}（{{ item.displayName }}）</span
              >:{{ item.approvalOpinionInput }}
            </div>
            <div class="time">
              <div>{{ item.approvalDepartment }}</div>
              <div>{{ item.approvalDate }}</div>
            </div>
          </div>
        </div>
        
       
      </div>   
      <div class="linebold" v-if="oa_comment.jiguanbumenyijian">
        <div class="option line">
          <div class="height">机关部门意见({{ oa_comment.jiguanbumenyijian.length }})</div>
          <div
            style="color: rgb(30, 108, 254)"
            @click="foldjiguanbumen"
            v-if="oa_comment.jiguanbumenyijian !== undefined && oa_comment.jiguanbumenyijian.length > 2"
          >
            {{ flag ? "展开" : "收起" }}
          </div>
        </div>
        <div
          v-for="(item, index) in filterjiguanbumen"
          :key="index"
          class="line noneLine"
        >
          <div>
            <div>
              <span class="fontBlod"
                >{{ filterjiguanbumen.length - index }}.{{
                  item.approvalUserName
                }}（{{ item.displayName }}）</span
              >:{{ item.approvalOpinionInput }}
            </div>
            <div class="time">
              <div>{{ item.approvalDepartment }}</div>
              <div>{{ item.approvalDate }}</div>
            </div>
          </div>
        </div>
      </div>  
      <div class="linebold" v-if="oa_comment.yuanshudanweiyijian">
         <div class="option line">
          <div class="height">院属单位意见({{ oa_comment.yuanshudanweiyijian.length }})</div>
          
          <div
            style="color: rgb(30, 108, 254)"
            @click="foldyuanshudanwei"
            v-if="oa_comment.yuanshudanweiyijian !== undefined && oa_comment.yuanshudanweiyijian.length > 2"
          >
            {{ flag ? "展开" : "收起" }}
          </div>
        </div>
        <div
          v-for="(item, index) in filteryuanshudanwei"
          :key="index"
          class="line noneLine"
        >
          <div>
            <div>
              <span class="fontBlod"
                >{{ filteryuanshudanwei.length - index }}.{{
                  item.approvalUserName
                }}（{{ item.displayName }}）</span
              >:{{ item.approvalOpinionInput }}
            </div>
            <div class="time">
              <div>{{ item.approvalDepartment }}</div>
              <div>{{ item.approvalDate }}</div>
            </div>
          </div>
        </div>
      </div>   
      <!-- <div class="linebold height liuc" @click="getflow">
      <div>流程跟踪</div>
      <van-icon name="arrow" />
    </div> -->
      <van-dialog
        v-model="dialog"
        title="编号选择"
        show-cancel-button
        @confirm="confirm()"
        @cancel="cancel()"
      >
        <van-tabs @click="onClick">
          <van-tab title="流水号" class="tab1">
            <div
              v-for="(item, index) in candidateNoList"
              :key="index"
              class="left"
            >
              <div @click="selected(item)">{{ item.curFullNumber }}</div>
            </div>
            <p
              style="text-align: center; height: 50px"
              v-if="candidateNoList.length == 0"
            >
              暂无数据
            </p>
          </van-tab>
          <van-tab title="预留号">
            <div
              v-for="(item, index) in reservationNoList"
              :key="index"
              class="left"
            >
              <div @click="selected(item)">{{ item.curFullNumber }}</div>
            </div>
            <p
              style="text-align: center; height: 50px"
              v-if="reservationNoList.length == 0"
            >
              暂无数据
            </p>
          </van-tab>
        </van-tabs>
        <div class="textsp">
          <div style="text-align: left">已选编号</div>
          <div class="bottominp">
            <span>{{ fontStyle }}{{ year }}</span
            ><input type="text" v-model="number" class="inputNum" /><span>{{
              str
            }}</span>
          </div>
        </div>
      </van-dialog>
    </div>
  </div>
</template>
<script>
import {
  docList,
  getAttentionList,
  getDocumentDeail,
  findBusinessDicts,
  getCandidateNo,
  validateNo,
  savedoc,
  viewUrl,
} from "@/api/api";

export default {
  data() {
    return {
      flag: true,
      max: 2,
      dialog: false,
      candidateNoList: "",
      reservationNoList: "",
      number: "",
      fontStyle: "",
      year: "",
      str: "",
      name: 0,
      objectId: "",
      config: "",
      // doc_data: "",
      allStr: "",
      emergency: [],
      miji: [],
    };
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    zwfile: {
      type: Array,
      default: [],
    },
    doc_xinxi: {
      type: Array,
      default: [],
    },
    doc_data: {
      type: Object,
      default: {},
    },
    oa_comment:{},
    // oa_comment: {
    //   type: Object,
    //   default: {},
    // },
    // a_comment: {
    //   type: Array,
    //   default: [],
    // },
    
    receive_note: {
      type: Array,
      default: () => [],
    },
    submit_note: {
      type: Array,
      default: () => [],
    },
    zhengXunOpinion: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    attachment() {
      return this.zwfile.some((f) => f.file_category == "attachment");
    },
    relation() {
      return this.zwfile.some((f) => f.file_category == "relation");
    },
    // filteroption() {
    //   return this.oa_comment.slice(0, this.max);
    // },
    filteryuanshudanwei(){
      return this.oa_comment.yuanshudanweiyijian.slice(0, this.max);
    },
    filterjiguanbumen(){
      return this.oa_comment.jiguanbumenyijian.slice(0, this.max);
    },
    filteryunlingdao(){
      return this.oa_comment.yunlingdaopishiyijian.slice(0, this.max);
    },
  },
  created() {
    this.findBusinessDictsApi();
    this.findmijiApi();
  },
  mounted() {
    this.config = this.$parent.flowConfig.numberType;
    this.doc_data = this.$parent.doc_data;
    console.log(this.doc_data);
  },
  methods: {
    onClick(name, title) {
      Toast(title);
    },
    cancel() {
      console.log("dadsa");
    },
    selected(item) {
      this.objectId = item.objectId;
      this.fontStyle = item.fontStyle;
      this.year = "〔" + item.year + "〕";
      this.number = item.serialNo;
      this.unit = item.unit;
      var str = item.curFullNumber.split("（")[1];
      if (str == undefined) {
        this.str = item.unit;
      } else {
        this.str = item.unit + "（" + str;
      }
    },
    validateNoApi() {
      return new Promise((resolve, reject) => {
        let p = {
          numberId: this.objectId,
          serialNo: this.number,
        };
        validateNo(p).then((res) => {
          this.isTrue = res.data.state;
          // this.$Toast(res.data.msg);
          this.allStr = this.fontStyle + this.year + this.number + this.str;
          resolve(this.allStr);
        });
      });
      // setTimeout(() => {

      // }, 100);
    },
    getData() {
      this.getCandidateNoApi();
      // this.dialog = true;
    },
    onClick(name, title) {
      if (name != this.name) {
        this.fontStyle = "";
        this.year = "";
        this.number = "";
        this.unit = "";
        this.str = "";
      }
    },
    async confirm() {
      await this.validateNoApi();
      //收文参数
      var swparams = {
        service_table: this.router.serviceTable,
        query_table: "sw_oa_incoming_data",
        data: {
          object_id: this.router.documentId,
          number_id: this.objectId,
          shou_wen_zi_hao: this.number,
          // "shou_wen_zi_hao":'〔'+ this.year+'〕',
          old_number_id: this.doc_data.number_id,
          old_shou_wen_zi_hao: this.doc_data.shou_wen_zi_hao,
          drafter_id: this.doc_data.drafter_id,
          shou_wen_dai_zi: this.fontStyle,
          shou_wen_bian_hao: this.allStr,
        },
      };
      // 发文参数
      var fwparams = {
        service_table: this.router.serviceTable,
        query_table: "fw_oa_outgoing_data",
        data: {
          object_id: this.router.documentId,
          number_id: this.objectId,
          fa_wen_zi_hao: this.number,
          old_number_id: this.doc_data.number_id,
          old_fa_wen_zi_hao: this.doc_data.fa_wen_zi_hao,
          drafter_id: this.doc_data.drafter_id,
          fa_wen_dai_zi: this.fontStyle,
          fa_wen_bian_hao: this.allStr,
        },
      };
      let p = "";
      if (this.router.queryTable.indexOf("incoming") > -1) {
        p = swparams;
      } else {
        p = fwparams;
      }
      await savedoc({
        docjson: JSON.stringify(p),
      }).then((res) => {
        if (res.code == 20000) {
          this.$Toast({ type: "success", message: "提交成功" });
          this.$parent.getTabledata();
        } else {
          this.$Toast({ type: "success", message: "提交失败" });
        }
      });
    },
    getCandidateNoApi() {
      // console.log(this.$parent.flowConfig.numberType);
      if (this.$parent.flowConfig === null) {
        this.$Toast("当前用户信息配置不全");
        return;
      }
      this.dialog = true;
      let p = {
        postIds: this.state.userInfo.user.postIds.join(","),
        departId: this.state.userInfo.user.deptId,
        numberType: this.$parent.flowConfig.numberType,
        draftDepartName: "",
      };
      getCandidateNo(p).then((res) => {
        this.candidateNoList = res.data.candidateNoList;
        this.reservationNoList = res.data.reservationNoList;
      });
    },
    foldjiguanbumen() {
      this.flag = !this.flag;
      this.flag ? (this.max = 2) : (this.max = this.oa_comment.jiguanbumenyijian.length);
      
    },
    foldyuanshudanwei() {
      this.flag = !this.flag;
      this.flag ? (this.max = 2) : (this.max = this.oa_comment.yuanshudanweiyijian.length);
     
    },
    foldyunlingdao() {
      this.flag = !this.flag;
      this.flag ? (this.max = 2) : (this.max = this.oa_comment.yunlingdaopishiyijian.length);
    },
    // 文件预览
    saveFile(e) {
      this.state.userInfo.user.officePhone == null
        ? ""
        : this.state.userInfo.user.officePhone;
      // H5跳转
      this.$router.push({
        name: "pdfView",
        params: {
          id: e.object_id,
        },
      });
      // if(window.master == 'iosAndroid'){
      //   let userinfo = this.state.userInfo.user.userName+this.state.userInfo.user.officePhone
      //   let url = viewUrl+'/preview/onlinePreview'+'?fileId='+e.object_id+'&watermarkText='+userinfo
      //   let index = e.real_name.lastIndexOf('.')
      //   const fileType = e.real_name.substring(index+1,e.real_name.length)//截取文件类型
      //   let p = {
      //     watermarkText:userinfo,
      //     url:url,
      //     fileType:fileType,
      //     fileSzie:e.file_size
      //   }
      //   // H5跳转
      //   this.$router.push({
      //     name: "pdfView",
      //     params: {
      //       id: e.object_id
      //     }
      //   });
      //   // 原生端跳转
      //   if(window.isTypePhone == 'Android'){
      //     railsMobilePlatform.showPdfFile(JSON.stringify(p))
      //   }else{
      //     window.webkit.messageHandlers.showPdfFile.postMessage(JSON.stringify(p))
      //   }
      // }else if(window.master == 'H5'){
      //   // H5跳转
      //   this.$router.push({
      //     name: "pdfView",
      //     params: {
      //       id: e.object_id
      //     }
      //   });
      // }
    },
    // 流程跟踪
    getflow() {
      this.$router.push({
        name: "ProcessView",
        params: {
          instanceId: this.router.instanceId,
          biaoTi: this.router.biaoTi,
        },
      });
      // if(window.master == 'iosAndroid'){
      //   let url = viewUrl + "/document/getInstanceDetail?instanceId=" + this.router.instanceId + "&isMobile=true"+'&name='+this.router.biaoTi
      //   // console.log(url)
      //   if(window.isTypePhone == 'Android'){
      //     railsMobilePlatform.showTraceView(url)
      //   }else{
      //     window.webkit.messageHandlers.showTraceView.postMessage(url)
      //   }
      // }else if(window.master == 'H5'){
      //   this.$router.push({
      //     name: "ProcessView",
      //     params: {
      //       instanceId: this.router.instanceId,
      //       biaoTi: this.router.biaoTi
      //     }
      //   });
      // }
    },
    findBusinessDictsApi() {
      findBusinessDicts({
        params: {
          categoryCodes: "emergency",
          companyId: "",
        },
      }).then((res) => {
        console.log("后台紧急程度");
        console.log(res);
        this.emergency = res.data;
      });
    },
    findmijiApi() {
      findBusinessDicts({
        params: {
          categoryCodes: "mijichengdu",
          companyId: "",
        },
      }).then((res) => {
        console.log("后台密集程度");
        console.log(res);
        this.miji = res.data;
      });
    },
    emergencyCodes(code) {
      let emergencynames = "";
      console.log("紧急程度");
      console.log(this.emergency);
      console.log(code);
      code = code || this.doc_data.jin_ji_cheng_du;
      this.emergency.forEach((val) => {
        if (val.businessCode == code) {
          emergencynames = val.businessValue;
          return;
        }
      });
      return emergencynames;
    },
    mijiCodes(code) {
      let mijinames = "";
      console.log("紧急程度");
      console.log(this.emergency);
      console.log(code);
      this.miji.forEach((val) => {
        if (val.businessCode == code) {
          mijinames = val.businessValue;
          return;
        }
      });
      return mijinames;
    },
    
  },
};
</script>
<style scoped lang="scss">
#textarea {
  width: 100%;
  height: 130px;
  border: 1px solid rgb(241, 241, 241);
}
/deep/ .van-tabs__line {
  background-color: rgb(30, 108, 254);
}
.yijian-content {
  position: relative;
}
.yijian-content .textarea-success {
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: rgb(30, 108, 254);
}
.main {
  padding: 0;
}

p {
  text-align: left;
}

.row {
  text-align: left;
  margin-bottom: 6px;
}

.linebold {
  background: #fff;
  padding: 10px;
  color: #000;
  font-size: 14px;
  text-align: left;
  margin-bottom: 10px;
}

.liuc {
  color: rgb(30, 108, 254);
  display: flex;
  justify-content: space-between;
}

.height {
  line-height: 40px;
  text-align: left;
  font-weight: bold;
}

.line {
  border-bottom: 2px solid rgb(238, 238, 238);
  text-align: left;
}

.file {
  color: rgb(30, 108, 254);
  font-weight: normal;
}

.time {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  align-items: baseline;
  color: gray;
}
.fontBlod {
  font-weight: bold;
}
footer .btn {
  font-size: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  flex: 1;
}

.btn button {
  border-radius: 7px;
  flex: 1;
  min-width: 40%;
  display: none;
  height: 40px;
  margin: 0px 4px 8px 4px;
  max-width: 100%;
}
.van-icon {
  top: 12px;
}

.option {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.yijian {
  padding: 0 6px;
}

.group {
  padding: 0 16px;
  font-size: 16px;
}

.van-radio {
  margin-top: 8px;
}

.left {
  text-align: left;
  padding: 3px 15px;
}
.tab1 {
  height: 120px;
  overflow-y: auto;
}
.inputNum {
  width: 22%;
  height: 20px;
  border: 1px solid black;
}
.bottominp {
  width: 100%;
  text-align: right;
  position: absolute;
  right: 20px;
  bottom: 60px;
}
.textsp {
  margin: 0 auto;
  padding: 6px;
  width: 95%;
  height: 100px;
  border: 1px solid #999999;
}
.fileHeight {
  max-height: 130px;
  overflow-y: auto;
}
.van-dialog .van-tab {
  font-size: 18px;
}
.noneLine:last-child {
  border-bottom: none;
}
.lineFlex {
  display: flex;
  justify-content: space-between;
}
</style>
