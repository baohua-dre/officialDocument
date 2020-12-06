const mutations = {
    Login_in(state, info) {
        state.userInfo = info
    },
    set_token(state, info) {
        state.userToken = info
    },
    set_userId(state, info) {
        state.userId = info
    },
    show_loading(state) {
        state.showloading = true
    },
    hide_loading(state) {
        state.showloading = false
    },
    get_basicDept(state, info) {
        state.basicDept = info
    },
    set_yijian(state, info) {
        state.optionYj = info
    },
    get_showbh(state, info) {
        state.showBh = info
    },
    GET_submitParams(state, data) {
        state.submitparams = data
    },
    xiugai_submitParams(state, data) {
        state.submitparams = data
    },
    changfavoritesTempfalses(state) {
        state.favoritesTemp = false
    },
    changfavoritesTemptrues(state) {
        state.favoritesTemp = true
    },
}
export default mutations