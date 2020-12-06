import { getDocumentDeail, getWorkItemOptions } from '@/api/api'
import { mapMutations } from "vuex";
export const minxin = {
    data() {
        return {
            listData: {
                objectId: '',
                isDistribute: '',
                serviceTable: '',
                userId: '',
                doctype: ''
            },
            listData1: {
                objectId: '',
                isDistribute: '',
                serviceTable: '',
                userId: '',
                doctype: ''
            },
            btnParams: {
                activityCode: '',
                workflowCode: '',
                requestType: ''
            },
            loading: true,
            btloading: true,
            doc_xinxi: [],
            zwfile: [],
            oa_comment:[],
            btnData: [],
            flowConfig: {},
            doc_data: {},
            receive_note: [],
            zhengXunOpinion: [],
            submit_note: []
        }
    },
    computed: {
        state() {
            return this.$store.state;
        },
        router() {
            return this.$route.query
        },
    },
    mounted() {
        this.getTabledata()
            // 关注，办结，已阅详情不需要按钮展示
        if (this.router.isFinish == 2 || this.router.requestType == "yi_yue" || this.router.requestType == "") return
        this.getBtn()
    },
    methods: {
        // getListOriginPageApi() {
        //     getListOriginPage({
        //         documentId: this.router.documentId || this.router.document_id
        //     }).then(res => {
        //         if (res.data.length == 0) {
        //             this.isTab = false
        //             return
        //         }
        //         this.isTab = true
        //         this.listData.userId = this.state.userInfo.userId;
        //         this.listData.objectId = this.router.documentId || this.router.document_id;
        //         this.listData.serviceTable = this.router.serviceTable || this.router.service_table;
        //         this.listData.doctype = this.router.doctype;
        //     })
        // },
        ...mapMutations(['changfavoritesTempfalses', 'changfavoritesTemptrues']),
        getTabledata() {
            this.listData.userId = sessionStorage.getItem("userId");
            this.listData.objectId = this.router.documentId || this.router.document_id;
            this.listData.serviceTable = this.router.serviceTable || this.router.service_table;
            this.listData.doctype = this.router.doctype;
            // this.listData.objectId = this.router
            try {
                getDocumentDeail({
                    params: this.listData
                }).then(res => {
                    console.log('我已重新更新')
                    this.loading = false
                    this.doc_xinxi = res.data.doc_xinxi.infoValue
                    this.zwfile = res.data.attachmentList
                    if (res.data.oa_comment) {
                        // this.oa_comment = res.data.oa_comment.yuanshudanweiyijian
                        this.oa_comment = res.data.oa_comment
                        this.flowConfig = res.data.flowConfig
                        this.doc_data = res.data.doc_data
                        if (res.data.oa_comment.temporaryOpinion && res.data.oa_comment.temporaryOpinion.length > 0) {
                            let a = {
                                    yj: res.data.oa_comment.temporaryOpinion[0].approvalOpinionInput,
                                    id: res.data.oa_comment.temporaryOpinion[0].objectId
                                }
                                // console.log()
                            this.$store.commit('set_yijian', a)
                        } else {
                            this.$store.commit('set_yijian', {})
                        }
                        
                    }

                    // if (res.data.oa_comment) {
                    //     this.oa_comment = res.data.oa_comment.allOpinion
                    //     this.flowConfig = res.data.flowConfig
                    //     this.doc_data = res.data.doc_data
                    //     if (res.data.oa_comment.temporaryOpinion && res.data.oa_comment.temporaryOpinion.length > 0) {
                    //         let a = {
                    //                 yj: res.data.oa_comment.temporaryOpinion[0].approvalOpinionInput,
                    //                 id: res.data.oa_comment.temporaryOpinion[0].objectId
                    //             }
                    //             // console.log()
                    //         this.$store.commit('set_yijian', a)
                    //     } else {
                    //         this.$store.commit('set_yijian', {})
                    //     }
                    // }


                    if (res.data.isAttention == 'true') {
                        this.changfavoritesTemptrues()
                    } else {
                        this.changfavoritesTempfalses()
                    }
                    if (res.data.receive_note) {
                        this.receive_note = res.data.receive_note
                    }
                    if (res.data.submit_note) {
                        this.submit_note = res.data.submit_note
                            // console.log('jj', this.submit_note)
                    }
                    if (res.data.oa_comment.zhengXunOpinion) {
                        this.zhengXunOpinion = res.data.oa_comment.zhengXunOpinion
                            // console.log('aa', this.zhengXunOpinion)
                    }
                })
            } catch (error) {
                console.log(error)
            }
        },
        getBtn() {
            this.btnParams.activityCode = this.router.activityCode || this.router.activity_code
            this.btnParams.workflowCode = this.router.workflowCode || this.router.workflow_code
            this.btnParams.requestType = this.router.requestType
            getWorkItemOptions({
                params: this.btnParams
            }).then(res => {
                this.btloading = false
                this.btnData = res.data
                let bianhaoShow = res.data.some(f => f.infoType == 'bian_hao')
                console.log('编号', bianhaoShow)
                this.$store.commit('get_showbh', bianhaoShow)
            })
        }
    },
}