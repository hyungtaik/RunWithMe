import http from "@/utils/http-common";

export default {
  state: {
    loading: false,
    error: null,
    isLogin:false,
    authToken:"",
    userInfo:{},
  },
  getters: {
    loading: state => state.loading,
    error: state => state.error,
    userInfo: state => state.userInfo,
    authToken: state => state.authToken,
    isLogin:state =>state.isLogin,
  },
  mutations: {
    mutateIsLogin(state, isLogin) {
      state.isLogin = isLogin
    },
    mutateUserInfo(state, userInfo) {
      state.userInfo = userInfo;
      state.loading = false;
      state.error = null;
      state.isLogin = true;
    },
    mutateAuthCode(state, authCode) {
      state.authCode = authCode
    },
    setLogout(state) {
      state.userInfo = {};
      state.loading = false;
      state.error = null;
      state.authCode=""
      state.isLogin=false;
      // this.$router.push("/");
    },
    setLoading(state, data) {
      state.loading = data;
      state.error = null;
    },
    setError(state, data) {
      state.error = data;
      state.userInfo = {};
      state.loading = false;
    },
    clearError(state) {
      state.error = null;
    }
  },
  actions: {
      login(context, { userEmail, userPw }) {
        context.commit("clearError");
        context.commit("setLoading", true);
        console.log("login on")
        http.post("/users/signin",{
          userEmail:userEmail,
          userPw:userPw        
        }).then(res => {
            context.commit('mutateUserInfo', res.data.data)
            context.commit('mutateAuthCode',res.headers.auth)
            localStorage.setItem("userInfo",JSON.stringify(res.data.data))
            console.log(res.data.data)
            console.log(res.headers.auth)// 토큰얻기
        })
        .catch(function(error) {
          // Handle Errors here.
          console.log(error)
          context.commit('mutateUserInfo',{})
          context.commit("setError", error);
          localStorage.removeItem("userInfo")
          // ...
        });
    },

    signUserUp({commit}, data) {
      commit("setLoading", true);
      commit("clearError");
      console.log("signUserup Data Check")
      var signUpUnit = data.data
      var jsons = JSON.stringify(signUpUnit)
      console.log(signUpUnit)
      console.log(jsons)
      http.post("/users",{jsons})
        .then(res => {
          commit("setLoading", false);
          console.log("회원가입 성공")
          console.log(res)
          this.$router.push("/")

          // const newUser = {
          //   uid: user.user.uid
          // };
          // console.log(newUser);
          // localStorage.setItem("userInfo", JSON.stringify(newUser));
          // commit("setUser", newUser);
        })
        .catch(error => {
          commit("setLoading", false);
          commit("setError", error);
          console.log("회원가입 실패")
          console.log(error);
        });
    },
    signOut(context) {
      localStorage.removeItem("userInfo");
      context.commit("setLogout");
    },
  }
};
