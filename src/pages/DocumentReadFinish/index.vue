<template>
    <div class="main">
        <!-- :oa_commentYuanlingdao='oa_commentYuanlingdao'
            :oa_commentJiguan='oa_commentJiguan'
            :oa_commentYuanshu='oa_commentYuanshu' -->
        <list 
            :loading='loading'
            :doc_xinxi='doc_xinxi'
            :doc_data='doc_data'
            :zwfile='zwfile'
            :oa_comment='oa_comment'
            :receive_note="receive_note"
            :submit_note="submit_note"
            :zhengXunOpinion="zhengXunOpinion"
        ></list>        
        <!-- <footer>
            <div class="btn">
                <van-button type="info" loading-text="加载中..." v-showBtn="{name:'chuan_yue',data:btnData}"></van-button>
                <van-button type="info" loading-text="加载中..." v-showBtn="{name:'zhi_xi',data:btnData}"></van-button>                                  
            </div>
        </footer> -->
    </div>
</template>
<script>
import {getDocumentDeail,getWorkItemOptions } from '@/api/api'
import list from '@/pages/common/list.vue'
import {minxin} from '@/common/mixins/getList.js'
export default {
    mixins:[minxin],
    data(){
        return{
            
        }
    },
    computed:{    
               
    },
    components:{list},
    mounted(){
        
    },
    methods:{        
        
    }
}
</script>
<style scoped>
    @import '../common/list.css';	
</style>