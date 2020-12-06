<template>
    <div class="header">
        <header-title>选择人员</header-title>
        <Tree :data = 'baseData' show-checkbox @on-select-change='selectChangea' ref="tree" @on-check-change='getCheckedNodes' :select-node='true'></Tree>
        <div class="footer">
            <van-button type="info" size="large" class="btn" @click="submit">确定（提交）</van-button>
        </div>
    </div>
</template>
<script>
import {carsoaSubmit} from '@/api/api'
export default {
    data(){
        return{
            baseData:[],
            saveOpinion:{			
                userId:'',
                instanceId:'',
                instanceId:'',
                documentId:'',
                serviceTable:'',
                sign:'',
                nextActivityCode:'',
                participant:'',
                workItemId:'',
                readEnd:'',
                isDifferentiate:'',
                queryTable:'',
                opinionId:'',
                workitemType:'',
                workFlowCode:'',
                isSendMessage:0,
                isejdw:'',
                remark:'',
                attachmentCopyType:'',
                finishAccessPoint:'mobile'                             
            },
            seletedPeople:[],
            tempTreeSelect:''               
        }
    },
    computed: {
        tiJiaoP(){
            return this.router.docData
        }
    },
    mounted(){        
        this.toTree(this.router.peopData.data)
        // this.toTree(this.router)
        // console.log(this.router)
    },
    methods:{
        selectChangea(v){
            let val=v[0]
          if(!val){
            val=this.tempTreeSelect
          }else{
            this.tempTreeSelect=val
          }
          let list=this.baseData
          for (let index = 0; index < list.length; index++) {
            const element = list[index];
            let filterList = element.children.filter((item,index)=>{
                return item.checked == true
              })
            if(!val.pId&&val.id==element.id){
              let obj=JSON.parse(JSON.stringify(element))
              
              if(obj.checked){//勾选父级时
                let childArr=[]
                obj.indeterminate=false
                for (let k = 0; k < obj.children.length; k++) {
                  const childElement = obj.children[k];
                  childElement.checked=false
                  childArr.push(childElement)
                }
                obj.children=childArr
              }else if(val.indeterminate){//半选父级时
                obj.indeterminate=false
                let childList=[]
                for (let k = 0; k < obj.children.length; k++) {
                  const childIndeterminate = obj.children[k];
                  childIndeterminate.checked=true
                  childList.push(childIndeterminate)
                }
                obj.children=childList
              }
              obj.checked=!obj.checked
              this.baseData.splice(index,1,obj)
              break
            }else if(val.pId==element.id){
              for (let num = 0; num < element.children.length; num++) {
                const child = element.children[num];
                if(val.id==child.id){
                  let tempObj=child
                  tempObj.checked=!child.checked
                  element.children.splice(num,1,tempObj)
                  console.log('a0',this.getCheckedNodes())
                  //全部取消
                  if(element.indeterminate&&filterList.length==1&&filterList[0].id==val.id){
                    element.indeterminate=false
                    this.baseData.splice(index,1,element)
                    
                  }else if(filterList.length==element.children.length&&element.checked){
                    //全选中取消一个
                    element.checked=false
                    element.indeterminate=true
                    this.baseData.splice(index,1,element)
                    
                  }
                  return
                }
              }
            }
          }
        },
        getCheckedNodes(){            
            let a = this.$refs.tree.getCheckedNodes()
            console.log(a)
            // 存放user的id
            let userid = []
            let username = []
            a.forEach((item,index)=>{
                // if(item.type!="dept"){
                    userid.push(item.userId || item.id)
                    username.push(item.title)
                // }
            })
            userid = userid.join(',')           
            username = username.join(',')           
            this.saveOpinion.participant = userid
            this.seletedPeople = username
            console.log(this.seletedPeople+'ooooo')
        },
        toTree(data) {
            var data = JSON.parse(JSON.stringify(data).replace(/name/g,"title"));
            // 删除 所有 children,以防止多次调用
            data.forEach(function (item) {
                delete item.children;
            });        
            // 将数据存储为 以 id 为 KEY 的 map 索引数据列
            var map = {};
            data.forEach(function (item) {
                map[item.id] = item;
            });           
            var val = [];
            data.forEach(function (item) {               
                if(item.pId == 0){
                    item.expand = true
                }
                // 以当前遍历项，的pid,去map对象中找到索引的id
                var parent = map[item.pId];
                // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
                if (parent) {                    
                    (parent.children || ( parent.children = [] )).push(item);
                } else {
                    //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
                    val.push(item);
                }
            });
            this.baseData = val         
        },
        submit(){
            this.$Dialog.confirm({
                title: '标题',
                message: `你确定要提交给（${this.seletedPeople}）吗？`,
            })
            .then(() => {
                this.submitDoc()                
            })
            .catch(() => {
                
            });
        },
        submitDoc(){              
            this.saveOpinion.userId = sessionStorage.getItem("userId")    
            this.saveOpinion.instanceId = this.tiJiaoP.instanceId
            this.saveOpinion.documentId = this.tiJiaoP.documentId
            this.saveOpinion.queryTable = this.tiJiaoP.queryTable
            this.saveOpinion.opinionId = this.router.opinionId
            this.saveOpinion.workitemType = this.tiJiaoP.workitemType
            this.saveOpinion.workFlowCode = this.tiJiaoP.workflowCode
            this.saveOpinion.serviceTable = this.tiJiaoP.serviceTable
            this.saveOpinion.workItemId = this.tiJiaoP.workitemId
            this.saveOpinion.nextActivityCode = this.router.peopData.nodeCode
            this.saveOpinion.sign = this.router.peopData.sign
            carsoaSubmit(this.saveOpinion).then(res=>{
                if(res.code == 20000){
                    this.$Toast({ type: 'success', message: '提交成功' });
                    setTimeout(()=>{
                        window.history.go(-2);
                    },750)
                }else{
                        
                }
            })
        }
    }
}
</script>
<style scoped lang='scss'>
    /deep/ .ivu-tree{
        text-align: left;
        margin:60px 30px 80px 30px;       
    }
    
    /deep/ .ivu-tree ul{
        font-size: 18px !important;
    }
    
    .footer{        
        width: 100%;        
        position: fixed;
        bottom: 0px;
        left: 0;      
        border-radius: 18px;
        background: white
    }
    .btn{
        border-radius: 10px;
    }
    /deep/ .van-button--large{
        width: 90%;
        margin-bottom: 10px;
    }
</style>