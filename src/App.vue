<template>
  <div id="app">
    <div class="wrapper">
      <!-- 사이드 메뉴바 시작 -->
      <b-nav id="sidebar" class="nav-Sidebar">
        <!-- 사이드 메뉴바 뒤로가기 버튼 -->
        <div id="dismiss" class="div-Back">
          <i class="fas fa-arrow-left"></i>
        </div>
        <!-- 사이드 메뉴바 헤더-->
        <div class="sidebar-header">
          <h2>유해물질 모니터링</h2>
        </div>

        <!-- 사이드 메뉴바 메뉴 부분 -->
        <div class="div-sidebar-menu" v-for="menu in GetMainMenu(this.menuitems)" v-bind:key="menu.idx">
          <b-link v-b-toggle="'collapse-menu'+menu.group">
            <span>{{menu.menuname}}</span>
          </b-link>
          <b-collapse :id="'collapse-menu'+menu.group">
            <div class="div-sidebar-submenu" v-for="submenu in GetChildMenu(menu.group)" v-bind:key="submenu.idx">
              <b-link :to="submenu.url" @click="closeSide">
                <span>- {{submenu.menuname}}</span>
              </b-link>
            </div>
          </b-collapse>
        </div>
      </b-nav>
      <!-- 사이드 메뉴바 종료 -->

      <!-- 사이드 메뉴바 활성화 시 배경 영역 -->
      <div class="overlay"></div>

      <!-- 메인 메뉴바 시작 -->
      <b-navbar class="nav-main" toggleable="lg" type="light" id="Mainmenu">
        <b-navbar-brand tag="h1" href="#" class="nav-brand">
          <img style="margin-top:-10px; " id="btn_menu" src="./assets/image/menu_list.png" />
          <span class="title">유해물질 모니터링</span>
        </b-navbar-brand>
        <!-- 메뉴 나오는 공간 -->
        <!-- 화면 사이즈가 줄었을때 버튼이 나타나는걸 주석처리함 -->
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav v-for="menu in GetMainMenu(this.menuitems)" v-bind:key="menu.idx">
            <b-nav-item-dropdown disabled no-caret="true">
              <template v-slot:button-content>{{menu.menuname}}</template>
              <!-- <b-dropdown-item href="#">EN</b-dropdown-item> -->
              <b-dropdown-item v-for="submenu in GetChildMenu(menu.group)" v-bind:key="submenu.idx" :to="submenu.url">
                {{submenu.menuname}}
              </b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
        <!-- 제일 오른쪽에 들어갈 메뉴들 예를 들면 로그인버튼 로그아웃 버튼 -->
        <b-navbar-nav class="ml-auto">
          <!-- <b-nav-item v-b-modal.modal-prevent-closing>Login</b-nav-item> -->
          <b-nav-item id="login" v-b-modal.modal-prevent-closing>
            <img style="margin-top:2px; width:25px;" id="btn_menu" src="./assets/image/Login.png" />
          </b-nav-item>
          <b-nav-item class="logout" id="logout" @click="Logout" style="display:none;">
            <img style="margin-top:2px;" id="btn_menu" src="./assets/image/Logout.png" />
          </b-nav-item>
        </b-navbar-nav>
        <!-- 제일 오른쪽에 들어갈 메뉴들 예를 들면 로그인버튼 로그아웃 버튼 -->
      </b-navbar>
      <!-- 메인 메뉴바 종료 -->
      <!-- 로그인 모달 창 -->
      <b-modal id="modal-prevent-closing" ref="modal" title="로그인" @ok="Login" size="sm">
        <form ref="form" @submit.stop.prevent="handleSubmit">
          <b-form-group label="아이디" label-for="name-input" invalid-feedback="Name is required">
            <b-form-input id="name-input" v-model="input_id" required></b-form-input>
          </b-form-group>
          <b-form-group label="비밀번호" label-for="name-input" invalid-feedback="Name is required">
            <b-form-input type="password" id="name-input" v-model="input_pw" required></b-form-input>
          </b-form-group>
        </form>
      </b-modal>
      <!-- 로그인 모달 창 -->
      <!-- 메뉴 타이틀이 보여지는 영역 -->
      <div id = "div_Path_title" class="div_Path">
        <!-- <div><img id="btn_title" src="./assets/image/house.png"/></div> -->
        <div id="path_div" class="s_title">{{this.title}}</div>
      </div>
      <!-- 메뉴 타이틀이 보여지는 영역 -->
    </div>
    <!-- 실제 메뉴 화면이 보여지는 영역 -->
    <router-view />
    <!-- 실제 메뉴 화면이 보여지는 영역 -->
    <!-- 화면 최상위로 스크롤하는 버튼 영역 -->
    <div
      id="btntop"
      style="display:none; position:fixed; bottom:15px; right:5px; background:gray; opacity:30%; padding:0px 5px;"
    >
      <b-link href="#app">
        <b-icon-capslock-fill style="color:#ffffff98;"></b-icon-capslock-fill>
      </b-link>
    </div>

    <!-- Screen Size CSS -->
    <div class="Screen_size"></div>

    <!-- 화면 최상위로 스크롤하는 버튼 영역 -->
  </div>
</template>

<script>
import { getMenu, LoginCheck } from "@/api/AppVue.js";
import { setToken, getToken, removeToken } from "@/utils/Cookie"; // 로그인 정보를 저장할 Cookie
import GlobalValue from "@/assets/js/GlobalValue.js";
import Utility from "@/assets/js/CommonUtility.js"; // 전 화면 공통으로 사용하는 함수
/*eslint-disable no-unused-vars, no-empty*/

export default {
  name: "Menu",
  data() {
    return {
      menuitems: [], // 메뉴 바인딩
      title: "", // 메뉴 타이틀
      input_id: "", // 로그인 ID
      input_pw: "" // 로그인 PW
    };
  },
  mounted() {
    this.onload(), // 로그인/ 로그아웃 체크 (새로고침시 휘발성을 방지)
    // this.smoothscrolling(); // 스크롤 최상으로 올리기

    // 사이드바 메뉴 동작 구현
    $("#dismiss, .overlay").on("click", function() {
      // hide sidebar
      $("#sidebar").removeClass("active");
      // hide overlay
      $(".overlay").removeClass("active");
    });

    $("#btn_menu").on("click", function() {
      // open sidebar
      $("#sidebar").addClass("active");
      $(".overlay").addClass("active");
      // fade in the overlay

      $(".collapse.in").toggleClass("in");
      $("a[aria-expanded=true]").attr("aria-expanded", "false");
    });

    this.getMenu(); // 메뉴를 조회한다
  },

  // 브라우저에서 해당 url을 벗어날때 실행되는 이벤트
  destroyed() {
    removeToken("USER_ID");
    removeToken("USER_NM");
    removeToken("MENU_AUTH");
    document.getElementById("login").style.display = "block";
    document.getElementById("logout").style.display = "none";
  },

  // 이벤트 선언부
  methods: {
    // 초기 시용자 Screen 설정 이벤트
    onload() {
      // 로그인 정보가 있는 경우 로그아웃/ 없는 경우 로그인
      if (getToken("USER_ID") != null) 
      {
        document.getElementById("login").style.display = "none";
        document.getElementById("logout").style.display = "block";
      }
    },

    // Screen 사이즈 변경시 발생되는 이벤트
    resize: () => {
      window.onresize = () => {
        document.querySelector("wrapper", ":before");
      };
    },

    // 메뉴 조회
    getMenu() {
      getMenu(getToken("MENU_AUTH")).then(response => {
        // debugger;
        var arr = []; // 배열 선언
        for (var i = 0; i < response.length; i++) 
        {
          // 라우터의 Name 지정
          var found = this.$router.options.routes.find(element => element.path == response[i].MENU_PATH);
          if (found != "undefinded" && found != undefined && found != null) 
          {
            found.name = response[i].MENU_NM;
          }
          arr[i] = {
            idx: response[i]["MENU_ID"],
            menuname: response[i]["MENU_NM"],
            child: response[i]["CHILD"],
            group: response[i]["GROUP"],
            url: response[i]["MENU_PATH"]
          };
        }
        this.menuitems = arr;
        //this.$router.push({ path: "/Rent_Book" }); // 도서 대여화면을 초기 화면으로 보여준다.
      });
    },

    // 대메뉴를 구한다.
    GetMainMenu: function() {
      // debugger;
      var MainMenu = [];
      for (let i = 0; i < this.menuitems.length; i++) 
      {
        if (this.menuitems[i].child === "N") 
        {
          MainMenu.push(this.menuitems[i]);
        }
      }
      return MainMenu;
    },

    // 대메뉴에 속한 소메뉴를 구한다.
    GetChildMenu: function(group_idx) {
      // debugger;
      var ChildMenu = [];
      for (let i = 0; i < this.menuitems.length; i++) 
      {
        if (this.menuitems[i].group == group_idx && this.menuitems[i].child === "Y") 
        {
          ChildMenu.push(this.menuitems[i]);
        }
      }
      return ChildMenu;
    },

    // 사이드바 메뉴 클릭시 자동으로 사이드바 닫아주기
    closeSide() {
      // hide sidebar
      $("#sidebar").removeClass("active");
      // hide overlay
      $(".overlay").removeClass("active");
    },

    // 화면 제일 위로 올라가는 버튼 클릭 이벤트
    smoothscrolling() {
      $(window).scroll(function() {
        if ($(this).scrollTop() > 50) 
        {
          $("#btntop").fadeIn();
        } 
        else 
        {
          $("#btntop").fadeOut();
        }
      });
      $("#btntop").click(function() {
        $("html, body").animate({scrollTop: 0},200);
        return false;
      });
    },

    // 로그인 이벤트
    async Login(bvModalEvt) {
      bvModalEvt.preventDefault(); // 로그인창이 안닫히고 대기 한다.
      var msgBox; // 알림 모달창

      // 아이디가 입력되지 않은 경우
      if (Utility.fn_IsNull(this.input_id)) 
      {
        try 
        {
          msgBox = await this.$bvModal.msgBoxOk("아이디를 입력하세요.", GlobalValue.Err_option); // 알림창을 보여준다.
          if (msgBox) 
          {
            this.$bvModal.close; // 알림창 닫기
          }
        } 
        catch (err) 
        {
          this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
        }
        return;
      }
      // 비밀번호가 입력되지 않은 경우
      else if (Utility.fn_IsNull(this.input_pw)) 
      {
        try 
        {
          msgBox = await this.$bvModal.msgBoxOk("비밀번호를 입력하세요.", GlobalValue.Err_option); // 알림창을 보여준다.
          if (msgBox) 
          {
            this.$bvModal.close; // 알림창 닫기
          }
        } 
        catch (err) 
        {
          this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
        }
        return;
      }
      // 실제 로그인 메서드가 실행되는 부분
      else 
      {
        try 
        {
          // 로그인 결과를 logcheck 변수에 담는다.
          let logcheck = await LoginCheck(this.input_id.trim(), this.input_pw.trim());
          
          // 로그인 에러 발생시
          if (logcheck[0].query_success != "Y") 
          {
            msgBox = await this.$bvModal.msgBoxOk(logcheck[0].query_err_msg, GlobalValue.Err_option); // 알림창을 보여준다.

            if (msgBox) 
            {
              // 알림 모달창을 닫는다.
              this.$bvModal.close;
              return;
            }
          }
          // 로그인이 성공한 경우
          else 
          {
            bvModalEvt.returnValue = true; //  로그인 모달 창이 preventDefault함수로 이벤트가 중지된 상태이기 때문에 닫아준다.
            document.getElementById("login").style.display = "none"; // 로그인 visible 숨김
            document.getElementById("logout").style.display = "block"; // 로그아웃 visible 보이기
            this.$bvModal.hide("modal-prevent-closing"); // 로그인 모달창을 닫아준다.
            setToken("USER_ID", logcheck[0].USER_ID); // Cookie에 사용자 ID 저장
            setToken("USER_NM", logcheck[0].USER_NM); // Cookie에 사용자 이름 저장
            setToken("MENU_AUTH", logcheck[0].MENU_AUTH); // Cookie에 사용자 메뉴 권한 저장
            this.getMenu(); // 로그인한 계정 메뉴 권한에 맞는 메뉴 조회
          }
        } 
        catch (err) 
        {
          alert(err);
        }
      }
    },

    // 로그아웃 이벤트
    async Logout() {
      var msgBox; // 알림 모달창
      msgBox = await this.$bvModal.msgBoxConfirm("로그아웃 하시겠습니까?", GlobalValue.Info_option);
      if(msgBox)
      {
        msgBox = await this.$bvModal.msgBoxOk("로그아웃 되었습니다.", GlobalValue.Success_option); // 알림창을 보여준다.
        this.$bvModal.close;      // 알림창을 닫는다.
        document.getElementById("login").style.display = "block";   // 로그인 이미지를 보여준다.
        document.getElementById("logout").style.display = "none";   // 로그아웃 이미지를 숨긴다.
        removeToken("USER_ID");   // 쿠키에 저장된 사용자 ID를 지운다.
        removeToken("USER_NM");   // 쿠키에 저장된 사용자 이름을 지운다.
        removeToken("MENU_AUTH"); // 쿠키에 저장된 사용자 ID를 지운다.
        this.getMenu();           // 메뉴를 다시 조회한다.
      }
    }
  }
};
</script>

<style lang="less">
@import "assets/less/MainMenu.less";

b-icon-capslock-fill {
  color: #ffffff98;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
}

.nav-Sidebar {
  overflow-y: hidden;
}
.title {
  padding-left: 10px;
  font-size: 23px;
  font-weight: bold;
  color: #fff;
  position: relative;
  top: -3px;
}
.navbar-light .navbar-nav .nav-link {
  color: #fff !important;
}

// 대 메뉴 클릭시 대메뉴 CSS
.navbar-light .navbar-nav .active > .nav-link,
.navbar-light .navbar-nav .nav-link.active,
.navbar-light .navbar-nav .nav-link.show,
.navbar-light .navbar-nav .show > .nav-link {
  color: #004bba !important;
  opacity: 1;
  font-weight: 900;
}

// .dropdown-item:focus, // 20200211 메뉴 hover 작업하면서 권오윤 삭제
.dropdown-item:hover {
  color: #fff !important;
  text-decoration: none;
  background-color: #005ad5 !important;
}
.nav-main .nav-brand img {
  width: 22px;
  height: 22px;
}
.dropdown-toggle:after {
  display: inline-block;
  margin-left: 0.5em !important;
  vertical-align: 0.255em;
  content: "";
  border-top: 0.3em solid;
  border-right: 0.3em solid transparent;
  border-bottom: 0;
  border-left: 0.3em solid transparent;
  position: relative;
  top: 3px;
}
.logout img {
  width: 35px;
}
.s_title {
  // margin-left:5px;
  letter-spacing: -1px;
}

/* 테이블 */
.tui-grid-border-line-top {
  /* background-color: #000; */
  background: #f3f4f6;
  border-top: 2px solid #004bba;
  color: #121212;
  font-size: 15px;
  font-weight: 700;
  background-color: none !important;
}

.tui-grid-no-scroll-x .tui-grid-border-line-bottom {
  background-color: #cbcbcb;
}
.tui-grid-body-container {
  position: relative;
  margin-top: -1px;
  border-bottom: solid 1px#ccc !important;
  height: 40px !important;
}

.tui-grid-cell {
  background-color: #fff;
  border-color: #ccc;
  border-left-width: 0;
  border-right-width: 0;
  border-top-width: 0;
  border-bottom-width: 1px;
  color: #333;
}

.tui-grid-border-line-left {
  top: 0;
  bottom: 17px;
  left: 0;
  width: 0;
  background-color: #fff !important;
}

.tui-grid-border-line-right {
  top: 0;
  bottom: 0;
  right: 0;
  width: 0;
}
.tui-grid-cell-header {
  background-color: #f3f4f6 !important;
  /* border-color: #ccc; */
  /* border-left-width: 1px; */
  /* border-right-width: 1px; */
  border-top-width: 0;
  /* border-bottom-width: 1px; */
  /* color: #222; */
  height: 34px !important;
}
.tui-grid-cell-row-header {
  background-color: #f3f4f6;
  border-color: #ccc !important;
  border-left-width: 0;
  border-right-width: 0;
  border-top-width: 0;
  border-bottom-width: 1px;
  color: #333;
}

.tui-pagination .tui-page-btn {
  display: inline-block;
  position: relative;
  width: 28px;
  padding: 8px 0 6px;
  margin-left: 0;
  color: #333;
  font-size: 12px;
  font-weight: 400;
  line-height: 1;
  text-decoration: none;
  vertical-align: middle;
  border: 1px solid #ddd;
  border-width: 1px 1px 1px 0;
}

.tui-grid-border-line {
  position: absolute;
  z-index: 99 !important;
}
.sidebar-header {
  background-color: #004bba;
}
.sidebar-header h2 {
  position: absolute;
  top: 20px;
  left: 10px;
  color: #fff;
  font-size: 25px;
}
.nav-Sidebar .div-sidebar-menu a {
  color: #fff;
  text-decoration: none;
  background-color: transparent;
}

.nav-Sidebar .div-sidebar-menu a:hover {
  color: #fff;
  background: #ffb500;
  font-weight: 900;
}

.nav-Sidebar .div-sidebar-menu {
  width: 100vw;
  border-bottom: solid 1px rgba(255, 255, 255, 0.1);
}

.nav-Sidebar .div-Back {
  width: 35px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  background: none;
  position: absolute;
  top: 17px;
  right: 10px;
  cursor: pointer;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  // border: solid 1px #ffffff7a;
  background-color: #ffb500;
}
.btn-primary {
  color: #fff;
  background-color: #005ad5 !important;
  border-color: #005ad5 !important;
}
.tui-pagination .tui-first-child.tui-is-selected {
  border-left: 1px solid #005ad5 !important;
}
.tui-pagination .tui-is-selected,
.tui-pagination strong {
  color: #fff;
  background: #005ad5 !important;
  border-color: #005ad5 !important;
  cursor: default;
}
.tui-pagination .tui-page-btn {
  border-right: 1px solid #ddd !important;
}
.tui-grid-cell-summary {
  background-color: #e3edff !important;
  border-color: #ccc;
  border-left-width: 1px;
  border-right-width: 1px;
  color: #333;
}
.form-group {
  margin-bottom: 0rem !important;
}

.tui-grid-header-area {
  max-height: 68px;
}
</style>
