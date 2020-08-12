<template>
  <div>
    <div class="contents">
      <!-- 버튼 시작 -->
      <div class="common-btnwrap">
					<b-button size="sm" variant="primary" style="margin-right : 10px" @click="btn_Add">추가</b-button>
					<b-button size="sm" variant="primary" style="margin-right : 10px" @click="btn_Save">저장</b-button>
					<b-button size="sm" variant="primary" style="margin-right : 10px" @click="btn_Delete">삭제</b-button>
					<!-- <b-button size="sm" variant="primary" style="margin-right : 10px" @click="Search_Tree_Grid">test</b-button> -->
      </div>
      <!-- 버튼 끝-->
      <!-- 조회조건 시작 -->
      <div class="common-schwrap">
        <fieldset>
          <div class="row">
            <div class="col-md-3 col-sm-6">
              <label class="col-md-4 col-sm-4 col-xs-4 control-label">지역</label>
              <div class="col-md-8 col-sm-8 col-xs-8">
                <b-input id="b-input-area" type="text" disabled v-model="popupLoc"></b-input>
              </div>
            </div>
            
            <b-button size="sm" variant="primary" @click="getSearch">선택</b-button>
            <b-modal id="SearchModal" title="선택" hide-footer centered>
              <sensor-management-modal v-on:PopupOK="PopupOK" v-bind:params="popup_Param"></sensor-management-modal>
            </b-modal>
            <!-- <div class="col-md-3 col-sm-6">
              <label class="col-md-4 col-sm-4 col-xs-4 control-label">구/군</label>
              <div class="col-md-8 col-sm-8 col-xs-8">
                <b-form-select 
                  v-model="gugun_value"
                  :options="gugun_options"
                  @change="cboGugun_change"
                ></b-form-select>
              </div>
            </div>
            <div class="col-md-3 col-sm-6">
              <label class="col-md-4 col-sm-4 col-xs-4 control-label">동/리</label>
              <div class="col-md-8 col-sm-8 col-xs-8">
                <b-form-select 
                  v-model="dongri_value"
                  :options="dongri_options"
                  @change="cboDongri_change"
                ></b-form-select>
              </div>
            </div> -->
          </div>
        </fieldset>
      </div>
      <!-- 조회조건 끝-->

      <!-- 컨텐츠 시작 -->
      <div style="margin-top:20px;"> 
        <div class="menu_list col-md-3 col-sm-3 col-xs-3">
          <label>IoT 센서리스트</label>
          <!-- 메인 그리드 시작 -->
          <grid
            id="grdMain"
            ref="tuiGrid"
            :data="this.grd_Data"
            :columns="gridProps.columns"
            :header="gridProps.header"
            :scrollY="gridProps.scrollY"
            :scrollX="gridProps.scrollX"
            :treeColumnOptions="gridProps.treeColumnOptions"
            :theme="gridProps.myTheme"
            @focusChange="grid_focusChange"
          ></grid>
          <!-- 메인 그리드 끝 -->
        </div>

        <!-- 세부정보 시작 -->
        <div class="menu_list_item col-md-9 col-sm-9 col-xs-9">      
          <label>IoT 센서 세부정보</label>
					<br>
            <!-- 세부정보 상세 시작 -->
						<div class="col-md-12 col-sm-12 col-xs-12 common-schwrap">
              <b-row>
                <div class="col-md-6 col-sm-6 col-xs-6">
                  <label class="col-md-3 col-sm-3 col-xs-3 Input-Area-Label"><span style="color: red;">*</span>IoT No.: </label>
                  <b-input id="b-input-IoT-No" class="col-md-8 col-sm-8 col-xs-8 Input-Text" :readonly="true" :state="Iot_NO_EmptyValidation" type="text" v-model="txt_IoT_No"  autocomplete="off"/>
                  <b-form-invalid-feedback :state="Iot_NO_EmptyValidation" class="col-lg-11 col-md-11 col-sm-11 col-xs-11" style="text-align: right">
                    IoT No는 필수 입력입니다.
                  </b-form-invalid-feedback>
                </div>
                <div class="col-md-6 col-sm-6 col-xs-6">
                  <label class="col-md-3 col-sm-3 col-xs-3 Input-Area-Label"><span style="color: red;">*</span>IoT명: </label>
                  <b-input id="b-input-IoT-Name" class="col-md-8 col-sm-8 col-xs-8 Input-Text" :state="Iot_Name_EmptyValidation" maxlength="30" type="text" v-model="txt_IoT_Name"  autocomplete="off"/>
                  <b-form-invalid-feedback :state="Iot_Name_EmptyValidation" class="col-lg-11 col-md-11 col-sm-11 col-xs-11" style="text-align: right">
                    IoT명는 필수 입력입니다.
                  </b-form-invalid-feedback>
                </div>
              </b-row>
              <b-row>
                <div class="col-md-6 col-sm-6 col-xs-6">
                  <label class="col-md-3 col-sm-3 col-xs-3 Input-Area-Label">설치일자: </label>
                  <b-input id="b-input-IoT-Date" class="col-md-8 col-sm-8 col-xs-8 Input-Text" maxlength="50" type="date" v-model="txt_IoT_Date"  autocomplete="off"/>
                </div>
                <div class="col-md-6 col-sm-6 col-xs-6">
                  <label class="col-md-3 col-sm-3 col-xs-3 Input-Area-Label"><span style="color: red;">*</span>설치지역: </label>
                  <b-form-select id="b-form-IoT-Place" v-model="txt_IoT_Place" :state="Iot_Place_EmptyValidation" :options="cboPlace" class="col-md-8 col-sm-8 col-xs-8" ></b-form-select>
                  <b-form-invalid-feedback :state="Iot_Place_EmptyValidation" class="col-lg-11 col-md-11 col-sm-11 col-xs-11" style="text-align: right">
                    설치지역은 필수 입력입니다.
                  </b-form-invalid-feedback>
                </div>
              </b-row>
              <b-row>
                <div class="col-md-6 col-sm-6 col-xs-6">
                  <label class="col-md-3 col-sm-3 col-xs-3 Input-Area-Label"><span style="color: red;">*</span>설치위치(위도): </label>
                  <b-input id="b-input-IoT-Lati" class="col-md-8 col-sm-8 col-xs-8 Input-Text" :state="Iot_Lati_EmptyValidation"  type="text" v-model="txt_IoT_Lati"  autocomplete="off"/>
                  <b-form-invalid-feedback :state="Iot_Lati_EmptyValidation" class="col-lg-11 col-md-11 col-sm-11 col-xs-11" style="text-align: right">
                    위도는 필수 입력입니다.
                  </b-form-invalid-feedback>
                </div>
                <div class="col-md-6 col-sm-6 col-xs-6">
                  <label class="col-md-3 col-sm-3 col-xs-3 Input-Area-Label"><span style="color: red;">*</span>설치지역(경도): </label>
                  <b-input id="b-input-IoT-Longi" class="col-md-8 col-sm-8 col-xs-8 Input-Text" :state="Iot_Longi_EmptyValidation" maxlength="300" type="text" v-model="txt_IoT_Longi"  autocomplete="off"/>
                  <b-form-invalid-feedback :state="Iot_Longi_EmptyValidation" class="col-lg-11 col-md-11 col-sm-11 col-xs-11" style="text-align: right">
                    경도는 필수 입력입니다.
                  </b-form-invalid-feedback>
                </div>
              </b-row>
              <b-row>
                <div class="col-md-6 col-sm-6 col-xs-6">
                  <label class="col-md-3 col-sm-3 col-xs-3 Input-Area-Label">사용여부: </label>
                  <div class="col-md-8 col-sm-8 col-xs-8">
                    <b-form-checkbox id="checkbox-1" v-model="cb_Use_YN" name="checkbox-1" value="Y" unchecked-value="N"/>
                  </div>
                </div>
              </b-row>

            </div>
            <div class="col-md-12 col-sm-12 col-xs-12 common-schwrap">
              <b-form-checkbox-group v-model="chkboxselected" :disabled="chkboxGroup">
                <b-row>
                  <div class="col-md-3 col-sm-3 col-xs-3">
                    <div class="col-md-2 col-sm-2 col-xs-2">
                    </div>
                    <div class="col-md-8 col-sm-8 col-xs-8">
                      <b-form-checkbox
                        v-model="chk_Box1"
                        value="O"
                        unchecked-value=""
                      >일산화탄소(CO)</b-form-checkbox>
                    </div>
                  </div>
                  <div class="col-md-3 col-sm-3 col-xs-3">
                    <div class="col-md-2 col-sm-2 col-xs-2">
                    </div>
                    <div class="col-md-8 col-sm-8 col-xs-8">
                      <b-form-checkbox
                        v-model="chk_Box2"
                        value="R"
                        unchecked-value=""
                      >황화수소(H₂S)</b-form-checkbox>
                    </div>
                  </div>
                  <div class="col-md-3 col-sm-3 col-xs-3">
                    <div class="col-md-2 col-sm-2 col-xs-2">
                    </div>
                    <div class="col-md-8 col-sm-8 col-xs-8">
                      <b-form-checkbox
                        v-model="chk_Box3"
                        value="T"
                        unchecked-value=""
                      >암모니아(NH₃)</b-form-checkbox>
                    </div>
                  </div>
                  <div class="col-md-3 col-sm-3 col-xs-3">
                    <div class="col-md-2 col-sm-2 col-xs-2">
                    </div>
                    <div class="col-md-8 col-sm-8 col-xs-8">
                      <b-form-checkbox
                        v-model="chk_Box4"
                        value="V"
                        unchecked-value=""
                      >메탄(CH⁴)</b-form-checkbox>
                    </div>
                  </div>
                </b-row>
                <b-row>
                  <div class="col-md-3 col-sm-3 col-xs-3">
                    <div class="col-md-2 col-sm-2 col-xs-2">
                    </div>
                    <div class="col-md-8 col-sm-8 col-xs-8">
                      <b-form-checkbox
                        v-model="chk_Box5"
                        value="P"
                        unchecked-value=""
                      >질소산화물(NOx)</b-form-checkbox>
                    </div>
                  </div>
                  <div class="col-md-3 col-sm-3 col-xs-3">
                    <div class="col-md-2 col-sm-2 col-xs-2">
                    </div>
                    <div class="col-md-8 col-sm-8 col-xs-8">
                      <b-form-checkbox
                        v-model="chk_Box6"
                        value="S"
                        unchecked-value=""
                      >염소(Cl₂)</b-form-checkbox>
                    </div>
                  </div>
                  <div class="col-md-3 col-sm-3 col-xs-3">
                    <div class="col-md-2 col-sm-2 col-xs-2">
                    </div>
                    <div class="col-md-8 col-sm-8 col-xs-8">
                      <b-form-checkbox
                        v-model="chk_Box7"
                        value="W"
                        unchecked-value=""
                      >아세톤(Aceton)</b-form-checkbox>
                    </div>
                  </div>
                  <div class="col-md-3 col-sm-3 col-xs-3">
                    <div class="col-md-2 col-sm-2 col-xs-2">
                    </div>
                    <div class="col-md-8 col-sm-8 col-xs-8">
                      <b-form-checkbox
                        v-model="chk_Box8"
                        value="25"
                        unchecked-value=""
                      >미세먼지</b-form-checkbox>
                    </div>
                  </div>
                </b-row>
                <b-row>
                  <div class="col-md-3 col-sm-3 col-xs-3">
                    <div class="col-md-2 col-sm-2 col-xs-2">
                    </div>
                    <div class="col-md-8 col-sm-8 col-xs-8">
                      <b-form-checkbox
                        v-model="chk_Box9"
                        value="Q"
                        unchecked-value=""
                      >황산화물(SOx)</b-form-checkbox>
                    </div>
                  </div>
                  <div class="col-md-3 col-sm-3 col-xs-3">
                    <div class="col-md-2 col-sm-2 col-xs-2">
                    </div>
                    <div class="col-md-8 col-sm-8 col-xs-8">
                      <b-form-checkbox
                        v-model="chk_Box10"
                        value="U"
                        unchecked-value=""
                      >수소(H₂)</b-form-checkbox>
                    </div>
                  </div>
                  <div class="col-md-3 col-sm-3 col-xs-3">
                    <div class="col-md-2 col-sm-2 col-xs-2">
                    </div>
                    <div class="col-md-8 col-sm-8 col-xs-8">
                      <b-form-checkbox
                        v-model="chk_Box11"
                        value="X"
                        unchecked-value=""
                      >에탄올(Ethanol)</b-form-checkbox>
                    </div>
                  </div>
                </b-row>
                <!-- <div class="mt-3">Selected: <strong>{{ chkboxselected }}</strong></div> -->
              </b-form-checkbox-group>
            </div>
            <!-- 세부정보 상세 끝 -->
          </div>
        <!-- 세부정보 끝 -->
      </div> 
      <!-- 컨텐츠 끝 -->
    </div>
  </div>
</template>

<script>
/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
/* eslint-disable no-redeclare */
/* eslint-disable no-empty */
// import 영역
import GlobalValue from "@/assets/js/GlobalValue.js";  // 전 화면 공통으로 사용하는 변수
import Utility from "@/assets/js/CommonUtility.js"; // 전 화면 공통으로 사용하는 함수
import { GridDefault } from "@/assets/js/GridDefault.js"; // 그리드 기본값 세팅, 그리드 EditOptions
import { SEARCH_MENU, SAVE_MENU, DELETE_MENU} from "@/api/Management.js";
import { SEARCH_COMBO1, SEARCH_COMBO2, SEARCH_TREE, SEARCH_COMBO3, SAVE_SENSOR, DELETE_SENSOR, SEARCH_TREE_AREA } from '@/api/Sensor_Management.js'
import SensorManagementModal from './Sensor_Management_Modal.vue'
import { Grid } from "@toast-ui/vue-grid"; // tui-Grid Module

  export default {

    components: {
      grid: Grid,
      SensorManagementModal
    },

    computed: {
      // 벨리데이션 체크 //
      // Iot_No
      Iot_NO_EmptyValidation() {
        return this.Check_Validation("Iot_No");
      },
      Iot_Name_EmptyValidation() {
        return this.Check_Validation("Iot_Name");
      },
      Iot_Place_EmptyValidation() {
        return this.Check_Validation("Iot_Place");
      },
      Iot_Lati_EmptyValidation() {
        return this.Check_Validation("Iot_Lati");
      },
      Iot_Longi_EmptyValidation() {
        return this.Check_Validation("Iot_Longi");
      }
    },
    data() {

      return {
        gugun_value: '',
        gugun_options: [],
        dongri_value: '',
        dongri_options: [],
        txt_IoT_No: '',
        txt_IoT_Name: '',
        txt_IoT_Date: '',
        txt_IoT_Place: '',
        txt_IoT_Lati: '',
        txt_IoT_Longi: '',
        cboPlace: [],
        cb_Use_YN : 'N',
        
        // 체크박스 값
        chk_Box1: '',
        chk_Box2: '',
        chk_Box3: '',
        chk_Box4: '',
        chk_Box5: '',
        chk_Box6: '',
        chk_Box7: '',
        chk_Box8: '',
        chk_Box9: '',
        chk_Box10: '',
        chk_Box11: '',
        chkboxGroup: true,


        chkboxselected: [],
        chkgrpOptions: [
          { text: '일산화탄소(CO)', value: 'O'},
          { text: '황화수소(H₂S)', value: 'R'},
          { text: '암모니아(NH₃)', value: 'T'},
          { text: '메탄(CH⁴)', value: 'V'},
          { text: '질소산화물(NOx)', value: 'P'},
          { text: '염소(Cl₂)', value: 'S'},
          { text: '아세톤(Aceton)', value: 'W'},
          { text: '미세먼지', value: '25'},
          { text: '황산화물(SOx)', value: 'Q'},
          { text: '수소(H₂)', value: 'U'},
          { text: '에탄올(Ethanol)', value: 'X'},
        ],
        

        save_yn : "",         // 저장 여부

        // 메뉴 세부정보 FeedBack문구
        FeedBack_IotNo: '',
        FeedBack_IotName: '',
        FeedBack_IotPlace: '',
        FeedBack_IotLati: '',
        FeedBack_IotLongi: '',

        IsValidation_IotNo: false,
        IsValidation_IotName: false,
        IsValidation_IotPlace: false,
        IsValidation_IotLati: false,
        IsValidation_IotLongi: false,

        // 메뉴경로의 필수 입력표시
        IsRequire_MenuRoute : true,
        // 전역변수
        gTreeCompare : true, // true : grid_focusChange이벤트에서 비교를 진행한다. / false: grid_focusChange이벤트에서 비교를 진행하지 않는다. (신규 메뉴 저장 후 포커스 유지를 위해 사용)

        // 조회조건
        Search_MenuName: "", // 메뉴명
        
        // 그리드 
        gridProps: [],  								// 그리드 Column Setting 배열 변수
        grd_Data: [],										// 그리드에 바인딩 할 Data 배열 변수

        Real_Node: [],                  // 최상위 노드(Win Tech)
        Search_Data: "",                // 초기 조회한 데이터(전체 데이터)

        popup_Param: '',
        popupLoc: '대한민국'
      }
    },

    created() {
      // 메인 그리드
      this.gridProps = {

        data: this.grd_Data,
        scrollY: true,
        scrollX: false,
        width:'350',
        bodyheight : '400',
        columns: [
          { header: "Iot 센서리스트",     name: "IOT_TREE_NM" },
          { header: "정렬순서",           name: "KEY_FIELD",        hidden: true },
          { header: "정렬순서",           name: "PARENT_FIELD", hidden: true}
        ],
        myTheme: {
          name: "mygrid",
          value: GridDefault.GridValue()
        },
        treeColumnOptions:{
          name:"IOT_TREE_NM", // Key가 될 컬럼 Name (반드시 보여야 한다. hidden:false시 트리 구성 안됨)
          // useCascadingCheckbox:true
        },
      }
    },

    mounted() {
      document.getElementById("div_Path_title").style.display = "block";
      Utility.fn_SetMenuPath(this); // 메뉴 Path 표시
      this.SetInit();
    },

    methods: {
      Search_Tree_Grid(gubun, param) {
        SEARCH_TREE_AREA(param).then(Tree_Data => {
          
          if (Utility.fn_IsNull(Tree_Data[0]["KEY_FIELD"])) {
            this.$refs.tuiGrid.invoke("clear");  // 메인 그리드에 바인딩 된 데이터 초기화(빈 값 row 1개 생성 방지)
          } else {
            this.Tree_DataConvert(Tree_Data);                 // 트리형으로 변환
            this.$refs.tuiGrid.invoke("expandAll");             // 트리 전체 확장(펼치기)
            this.$refs.tuiGrid.invoke("focus", 0, "IOT_TREE_NM");   // 포커스 적용
            this.Search_Data = Tree_Data;
            if (gubun != undefined) {
              for (var i = 0; i < Tree_Data.length; i++) {
                if (gubun == Tree_Data[i].IOT_NO) {
                  this.$refs.tuiGrid.invoke("focus", Tree_Data[i].rowKey, "IOT_TREE_NM");   // 포커스 적용
                }
              }
            }
          }
          
        })
      },
      PopupOK(param) {
        console.log('param', param)
        this.popupLoc = param.AREA_NAME
        this.Search_Tree_Grid(undefined, param.AREA_CODE)
      },
      async SearchInfo(param) {
        const cbo_Place = await SEARCH_COMBO3(param)
        console.log('cbo_Place', cbo_Place)
        var temp_cbo = []
        for (var i = 0; i < cbo_Place.length; i++) {
          temp_cbo.push({
            text: cbo_Place[i].CODE_NAME,
            value: cbo_Place[i].CODE_NO
          })
        }
        this.cboPlace = temp_cbo
      },
      getSearch() {
        this.popup_Param = {ModalID: 'SearchModal'}
        this.$bvModal.show('SearchModal')
      },
      // clearTxtBox() {
      //   this.txt_IoT_No = ''
      //   this.txt_IoT_Name = ''
      //   this.txt_IoT_Date = ''
      //   this.txt_IoT_Place = ''
      //   this.txt_IoT_Lati = ''
      //   this.txt_IoT_Longi = ''
      // },
      async cboDongri_change(gubun) {
        this.Search_Tree(this.gugun_value, this.dongri_value, gubun)
      },
      async Search_Tree(AREA1, AREA2, gubun) {
        const Tree_Data = await SEARCH_TREE(AREA1, AREA2)

        if(Utility.fn_IsNull(Tree_Data[0]["KEY_FIELD"])) {
          this.$refs.tuiGrid.invoke("clear");  // 메인 그리드에 바인딩 된 데이터 초기화(빈 값 row 1개 생성 방지)
        } else {
          this.Tree_DataConvert(Tree_Data);                 // 트리형으로 변환
          this.$refs.tuiGrid.invoke("expandAll");             // 트리 전체 확장(펼치기)
          if (gubun != undefined) {
            var save_rowKey = ''
            for (var i = 0; i < Tree_Data.length; i++) {
              if (gubun == Tree_Data[i].IOT_NO) {
                save_rowKey = Tree_Data[i].rowKey
              }
            }
            this.$refs.tuiGrid.invoke("focus", save_rowKey, "IOT_TREE_NM");   // 포커스 적용
          } else {
            // this.Search_Data = Tree_Data;
            this.$refs.tuiGrid.invoke("focus", 0, "IOT_TREE_NM");   // 포커스 적용
          }
          this.Search_Data = Tree_Data;
        }
      },
      async cboGugun_change(CODE_DVN, gubun) {
        
        var temp_cbo = []
        const cboDongri = await SEARCH_COMBO2(CODE_DVN)
        // 콤보박스에 값을 집어넣기 위해 루프
        for (var i = 0; i < cboDongri.length; i++) {
          temp_cbo.push({
            text: cboDongri[i].CODE_NAME,
            value: cboDongri[i].CODE_NO
          })
        }
        this.dongri_options = temp_cbo
        this.dongri_value = temp_cbo[0].value
        this.cboDongri_change(gubun)
        
        const cbo_Place = await SEARCH_COMBO3(CODE_DVN)
        var temp_cbo = []
        for (var i = 0; i < cbo_Place.length; i++) {
          temp_cbo.push({
            text: cbo_Place[i].CODE_NAME,
            value: cbo_Place[i].CODE_NO
          })
        }
        this.cboPlace = temp_cbo
      },
      
      async SetInit(gubun){
        this.Search_Tree_Grid(gubun, 'AREA0001')
        this.SearchInfo('')
        // await this.SetCombo(gubun);   // 콤보바인딩
        
      },
      async SetCombo(gubun){
        // 데이터 조회
        const cboGugun = await SEARCH_COMBO1()
        var temp_cbo = []
        // 콤보박스에 값을 집어넣기 위해 루프
        for (var i = 0; i < cboGugun.length; i++) {
          temp_cbo.push({
            text: cboGugun[i].CODE_NAME,
            value: cboGugun[i].CODE_NO
          })
        }
        // 콤보박스에 값을 집어넣음
        this.gugun_options = temp_cbo
        this.gugun_value = temp_cbo[0].value
        // 조회와 동시 동/리 콤보조회
        this.cboGugun_change(this.gugun_value, gubun)
      },

      // 벨리데이션 체크 (컨트롤 구분명)
      Check_Validation(str){
        // 벨리데이션 체크 결과값
        let b_Check = '';

        
        // Grid에서 현재 포커스된 Row를 가져온다.
        const FocusRow = Utility.fn_Grid_Focus_Row(this.$refs.tuiGrid);
        
        // if (FocusRow == '') {
        //   this.IsValidation_IotNo = false
        // } else {
          // 메뉴명
          if (str == "Iot_No") {
            // 비어 있는지 체크한다.
            b_Check = Utility.fn_Check_EmptyValidation(this.txt_IoT_No);
            
            this.IsValidation_IotNo = b_Check
            // 에러여부에 따라서 메세지를 세팅한다.
            if(b_Check) {
              this.FeedBack_IotNo = "";
            }
            else {
              this.FeedBack_IotNo = "Iot No는 필수 입력입니다.";
            }
          } else if (str == "Iot_Name") {
            
            // 비어 있는지 체크한다.
            b_Check = (Utility.fn_Check_EmptyValidation(this.txt_IoT_Name));

            // 저장시 체크할 벨리데이션 결과값 플래그
            this.IsValidation_IotName = b_Check;

            // 에러여부에 따라서 메세지를 세팅한다.
            if(b_Check) {
              this.FeedBack_IotName = "";
            }
            else {
              this.FeedBack_IotName = "Iot명은 필수 입력입니다.";
            }
          } else if (str == "Iot_Place") {
            b_Check = Utility.fn_Check_EmptyValidation(this.txt_IoT_Place);
            this.IsValidation_IotPlace = b_Check;
            if(b_Check) {
              this.FeedBack_IotPlace = "";
            }
            else {
              this.FeedBack_IotPlace = "설치지역은 필수 입력입니다.";
            }
          } else if (str == "Iot_Lati") {
            b_Check = Utility.fn_Check_EmptyValidation(this.txt_IoT_Lati);
            this.IsValidation_IotLati = b_Check;
            if(b_Check) {
              this.FeedBack_IotLati = "";
            }
            else {
              this.FeedBack_IotLati = "위도는 필수 입력입니다.";
            }
          } else if (str == "Iot_Longi") {
            b_Check = Utility.fn_Check_EmptyValidation(this.txt_IoT_Longi);
            this.IsValidation_IotLongi = b_Check;
            if(b_Check) {
              this.FeedBack_IotLongi = "";
            }
            else {
              this.FeedBack_IotLongi = "경도는 필수 입력입니다.";
            }
          } 
        // }

        
        
        return b_Check;
      },
      // 조회 데이터 트리형 변환
      Tree_DataConvert(Search_Menu) {
        // 조회된 데이터를 가지고 있을 변수
        this.Real_Node = [];    
        
        // 조회한 데이터의 수만큼 반복
        for (let idx = 0; idx < Search_Menu.length; idx++) {
        // for (let idx = 0; idx < 2; idx++) {
          let Data_Node = [];                     // i번째 데이터를 담을 배열 선언
          Data_Node = Search_Menu[idx];           // i번째 데이터 정보 저장
          // 최상위 행일경우 바로 추가
          if (Data_Node.NODE_TYPE == 'R') { 
            this.Real_Node.push(Data_Node);       // Real_Node 배열의 끝에 Data_Node 추가
          }
          // 조회 버튼 클릭 시
          else {
            // 부모 행 찾기 (i번째 데이터의 부모 코드, 이미 추가된 바인딩 데이터)
            const Parent_Node = this.Find_Parent_Node(Data_Node.PARENT_FIELD, this.Real_Node);
            if(Utility.fn_IsNull(Parent_Node)) {
              this.Real_Node.push(Data_Node);
              continue;
            }

            // 반환 받은 노드에 _children이 존재하지 않을 경우
            if (Parent_Node._children == undefined) {
              Parent_Node["_children"] = new Array();   // 배열로 추가
            }

            Parent_Node._children.push(Data_Node);   // Parent_Node의 _children의 배열의 끝에 Data_Node 추가
          }
        }
        this.$refs.tuiGrid.invoke("resetData", this.Real_Node);     // 그리드에 트리 적용
      },

      // 부모 노드 찾기
      Find_Parent_Node(Parent_Code, Data_Set) {
        // 최상위 노드의 수만큼 반복
        for (let idx = 0; idx < Data_Set.length; idx++) { 
          // 찾고자 하는 부모 노드가 최상위 노드 또는 최상위 노드의 자식 노드일 경우
          if (Parent_Code == Data_Set[idx].KEY_FIELD) {
            return Data_Set[idx];   // 최상위 노드 또는 최상위 노드의 자식 노드 반환
          }
          else  {            
            // 해당 노드에 자식 노드가 존재할 경우
            if (Data_Set[idx]._children != undefined) {

              // 해당 노드에 _children 배열이 존재할 경우
              if (Data_Set[idx]._children.length > 0) {

                // 부모 노드 찾기 (조회한 노드, 최상위 노드의 자식 노드)
                const Parent_Node = this.Find_Parent_Node(Parent_Code, Data_Set[idx]._children);

                // 부모 노드가 존재할 경우
                if (Parent_Node != undefined && Parent_Node != null) {
                  return Parent_Node;     // 최상위 노드 또는 최상위 노드의 자식 노드 반환
                }
              } 
            }
          }
        }
      },

      // PK Key로 노드 찾기
      Tree_FindNode(Node, Pkkey) {
        let Result = "";

        // 조회된 데이터가 없으면 종료
        if(Utility.fn_IsNull(Node))
          return "";

        // 노드가 여러개가 아닌 하나일경우
        if(Node.length == undefined){
          // 하위 노드가 있으면 하위노드를 재귀로 돌린다.
          if(Node._children != undefined){
            for(let child_idx = 0; child_idx < Node._children.length; child_idx++){
              Result = this.Tree_FindNode(Node._children[child_idx], Pkkey);

              if(!Utility.fn_IsNull(Result)) {
                return Result;
              }
            }
          }
          else {
            if(Node.MENU_ID == Pkkey){
              return Node;
            }
          }
        }
        else {
          // 노드의 갯수 만큼 Loop시작
          for(let idx = 0; idx < Node.length; idx++) {

            // n번째 노드
            const element = Node[idx];

            // 하위 노드가 있으면 하위노드를 재귀로 돌린다.
            if(element._children != undefined) {
              for(let child_idx = 0; child_idx < element._children.length; child_idx++) {
                Result = this.Tree_FindNode(element._children[child_idx], Pkkey);

                if(!Utility.fn_IsNull(Result)) {
                  return Result;
                }
              }
            }
            else {
              if(element.MENU_ID == Pkkey) {
                return element;
              }
            }
          }
        }

        return Result;
      },
      // 추가 버튼
      btn_Add() {

        // 조회한 노드가 존재할 경우
        if (this.$refs.tuiGrid.invoke("getRowCount") != 0) {
          const Grid_Data = this.$refs.tuiGrid.invoke("getData");   // 조회한 노드

          // 조회한 노드 수만큼
          for (let idx = 0; idx < Grid_Data.length; idx++) {
            // 저장되지 않은 데이터가 존재할 경우
            if (Grid_Data[idx].IOT_TREE_NM == "") {
              this.$bvModal.msgBoxOk("먼저 생성된 신규 행을 저장하세요.", GlobalValue.Info_option);
              return;
            }
          }
  
          const Focus_Data_Index = this.$refs.tuiGrid.invoke("getFocusedCell").rowKey;     // 포커스된 노드 Index
          const Focus_Data_info = this.$refs.tuiGrid.invoke("getRow", Focus_Data_Index);   // 포커스된 노드 정보
          const parent_row1 = this.$refs.tuiGrid.invoke('getParentRow', Focus_Data_Index); // 상위 행
          console.log('Focus_Data_info', Focus_Data_info)
          console.log('parent_row1', parent_row1)
          if (parent_row1 == null || Focus_Data_info.AREA_FULL_CODE.length < 40) {
            this.$bvModal.msgBoxOk("하위노드를 추가할 수 없습니다.", GlobalValue.Info_option);
            return
          }
          if(parent_row1.NODE_TYPE == 'G') {
            this.$bvModal.msgBoxOk("메뉴는 2단계 까지 구성이 가능합니다.", GlobalValue.Info_option);
            return;
          }

          document.getElementById('b-input-IoT-No').readOnly = false
          document.getElementById('b-input-IoT-Name').readOnly = false
          document.getElementById('b-input-IoT-Date').readOnly = false
          document.getElementById('b-form-IoT-Place').disabled = false
          document.getElementById('b-input-IoT-Lati').readOnly = false
          document.getElementById('b-input-IoT-Longi').readOnly = false
          this.chkboxGroup = false


          let Focus_Children_Length;                                           // 포커스 노드의 자식 노드의 수

          const Default_Data = {                                               // 행 추가 시 기본 값 
            IOT_NO: "",                                        // 메뉴 코드
            IOT_NM: "",                                        // 메뉴명
            INS_DATE: "",                                         // 정렬 순서
            INS_AREA: "",                                         // 비고
            INS_LAT: "",                                         // 사용 유무
            INS_LON: "",
            USE_YN: 'Y',
            IOT_TREE_NM: '',
            KEY_FIELD: "",
            PARENT_FIELD: "",
            GAS_TYPE: "",
            SAVE_TYPE: "N",            // 저장타입 (N:NEW, U:UPDATE),
            AREA_FULL_CODE: ''
          };

          this.chkboxselected = []

          if (Focus_Data_info._children == undefined) {
            Focus_Children_Length = 0
          }
          else {
            Focus_Children_Length = Focus_Data_info._children.length;
          }
          this.$refs.tuiGrid.invoke("appendTreeRow", Default_Data, {offset: Focus_Children_Length, focus: true, parentRowKey: Focus_Data_Index}); 
          this.$refs.tuiGrid.invoke("expand", Focus_Data_Index, false);
          this.$refs.tuiGrid.invoke("focus", Focus_Data_info._attributes.tree.childRowKeys[Focus_Data_info._attributes.tree.childRowKeys.length-1], "IOT_TREE_NM");   // 포커스 적용 이걸로 수정

          this.SearchInfo(Focus_Data_info.PARENT_FIELD)
          console.log('')
          
        }
        else {
          const Default_Data1 = [];
          Default_Data1[0] = {                                               // 행 추가 시 기본 값 
            MENU_ID: "",             // 메뉴 코드
            MENU_NM : "",           // 메뉴명
            SORT_NO: 0,              // 정렬 순서
            REMARK: "",              // 비고
            USE_YN: "Y",              // 사용 유무
            PARENT_MENU_ID: 0,       // 부모 코드
            SAVE_YN:"N",             // 저장여부
            MENU_AUTH: 2,            // 메뉴권한 (일반사용자)
            ACTIVE_MENU : "Y"        // 메뉴,그룹 구분(Y:메뉴)
          };

        this.$refs.tuiGrid.invoke("resetData", Default_Data1);     // 그리드에 트리 적용
        this.$refs.tuiGrid.invoke("focus", 0, "IOT_TREE_NM");   // 포커스 적용
        }
      },

      // 메인 그리드 저장 버튼
      async btn_Save() {
        // 필수입력 체크
        if (!this.IsValidation_IotNo) {
          await this.$bvModal.msgBoxOk(this.FeedBack_IotNo, GlobalValue.Info_option)
          return
        } else if (!this.IsValidation_IotName) {
          await this.$bvModal.msgBoxOk(this.FeedBack_IotName, GlobalValue.Info_option)
          return
        } else if (!this.IsValidation_IotPlace) {
          await this.$bvModal.msgBoxOk(this.FeedBack_IotPlace, GlobalValue.Info_option)
          return
        } else if (!this.IsValidation_IotLati) {
          await this.$bvModal.msgBoxOk(this.FeedBack_IotLati, GlobalValue.Info_option)
          return
        } else if (!this.IsValidation_IotLongi) {
          await this.$bvModal.msgBoxOk(this.FeedBack_IotLongi, GlobalValue.Info_option)
          return
        } else {
          const msgBox = await this.$bvModal.msgBoxConfirm('저장하시겠습니까?', GlobalValue.Info_option)

          if (msgBox) {
            var Gas_type = this.chkboxselected.join(',')
            const Focus_Data_Index = this.$refs.tuiGrid.invoke("getFocusedCell").rowKey;        // 포커스된 노드 Index
            const Focus_Data_info = this.$refs.tuiGrid.invoke("getRow", Focus_Data_Index);    
            const data = []
            data[0] = {
              data: JSON.stringify({
                IOT_NO: this.txt_IoT_No,
                IOT_NM: this.txt_IoT_Name,
                INS_DATE: this.txt_IoT_Date.replace(/-/g, ''),
                INS_AREA: this.txt_IoT_Place,
                INS_LAT: this.txt_IoT_Lati,
                INS_LON: this.txt_IoT_Longi,
                USE_YN: this.cb_Use_YN,
                SAVE_TYPE: Focus_Data_info.SAVE_TYPE === undefined ? 'U' : Focus_Data_info.SAVE_TYPE,
                USER: Utility.fn_IsNull(Utility.fn_GetUserInfo("USER_ID")) === true ? '1TEST' : Utility.fn_GetUserInfo("USER_ID"),
                GAS_TYPE: Gas_type
              })
            }

            var test = {
              IOT_NO: this.txt_IoT_No,
              IOT_NM: this.txt_IoT_Name,
              INS_DATE: this.txt_IoT_Date.replace(/-/g, ''),
              INS_AREA: this.txt_IoT_Place,
              INS_LAT: this.txt_IoT_Lati,
              INS_LON: this.txt_IoT_Longi,
              USE_YN: this.cb_Use_YN,
              SAVE_TYPE: Focus_Data_info.SAVE_TYPE === undefined ? 'U' : Focus_Data_info.SAVE_TYPE,
              USER: Utility.fn_IsNull(Utility.fn_GetUserInfo("USER_ID")) === true ? '1TEST' : Utility.fn_GetUserInfo("USER_ID"),
              GAS_TYPE: Gas_type
            }

            console.log('test', test)

            const Save_Data = {data}

            const Result = await SAVE_SENSOR(Save_Data)
            
            // 저장실패시 DB에 기술한 에러메세지를 나타낸다.
            if (Result[0].query_success == "N") {
              await this.$bvModal.msgBoxOk(Result[0].query_err_msg, GlobalValue.Err_option);
              return;
            } else { // 저장 성공시
              // 조회하고 나서 포커스 변경 이벤트를 태우지 않기 위해 전역변수를 ture로 변경
              var rt_data = Result[0].query_err_msg
              // 재조회
              this.SetInit(rt_data)
              this.$bvModal.msgBoxOk("저장되었습니다.", GlobalValue.Info_option);
            }
          }
        }
      },

      // 메인 그리드 삭제 버튼 
      async btn_Delete() {
        const Focus_Data_Index = this.$refs.tuiGrid.invoke("getFocusedCell").rowKey;        // 포커스된 노드 Index
        const Focus_Data_info = this.$refs.tuiGrid.invoke("getRow", Focus_Data_Index); 

        if (Focus_Data_info.NODE_TYPE == 'G' || Focus_Data_info.NODE_TYPE == 'R') {
          this.$bvModal.msgBoxOk('구/군, 동/리는 삭제할 수 없습니다.', GlobalValue.Info_option)
        } else {
          const msgBox = await this.$bvModal.msgBoxConfirm('삭제하시겠습니까?', GlobalValue.Info_option)

          if (msgBox) {
            const data = []
            data[0] = {
              data: JSON.stringify({
                IOT_NO: this.txt_IoT_No
              })
            }

            const Save_Data = {data}

            const Result = await DELETE_SENSOR(Save_Data)

            // 저장실패시 DB에 기술한 에러메세지를 나타낸다.
            if (Result[0].query_success == "N") {
              await this.$bvModal.msgBoxOk(Result[0].query_err_msg, GlobalValue.Err_option);
              return;
            } else {
              this.$bvModal.msgBoxOk("삭제되었습니다.", GlobalValue.Info_option);
              this.SetInit()
            }
          }
        }
      },

      // 그리드 포커스 변경 이벤트
      async grid_focusChange(DataRow) {
        
        // 그리드가 아님에도 타는 경우가 있어서 예외처리함
        if(DataRow.rowKey == null)
          return;

        // 포커스된 행의 정보
        let DataRow_info = this.$refs.tuiGrid.invoke("getRow", DataRow.rowKey);
          console.log('DataRow_info', DataRow_info)
        if (DataRow_info.IOT_NO == "") {
          this.chkboxselected = []
          if (DataRow_info.NODE_TYPE == 'R' || DataRow_info.NODE_TYPE == 'G' || DataRow_info.AREA_FULL_CODE != '') {
            // 구/군, 동/리 클릭 시 
            document.getElementById('b-input-IoT-No').readOnly = true
            document.getElementById('b-input-IoT-Name').readOnly = true
            document.getElementById('b-input-IoT-Date').readOnly = true
            document.getElementById('b-form-IoT-Place').disabled = true
            document.getElementById('b-input-IoT-Lati').readOnly = true
            document.getElementById('b-input-IoT-Longi').readOnly = true
            this.txt_IoT_No = DataRow_info.IOT_TREE_NM
            this.txt_IoT_Name = '.'
            this.txt_IoT_Date = '.'
            this.txt_IoT_Place = '.'
            this.txt_IoT_Lati = '.'
            this.txt_IoT_Longi = '.'
            this.cb_Use_YN = ''
            // 체크박스그룹 활성/비활성
            this.chkboxGroup = true
          } else {
            // newRow로 생성할 때
            document.getElementById('b-input-IoT-No').readOnly = false
            document.getElementById('b-input-IoT-Name').readOnly = false
            document.getElementById('b-input-IoT-Date').readOnly = false
            document.getElementById('b-form-IoT-Place').disabled = false
            document.getElementById('b-input-IoT-Lati').readOnly = false
            document.getElementById('b-input-IoT-Longi').readOnly = false
            this.txt_IoT_No = ''
            this.txt_IoT_Name = ''
            this.txt_IoT_Date = ''
            this.txt_IoT_Place = ''
            this.txt_IoT_Lati = ''
            this.txt_IoT_Longi = ''
            this.cb_Use_YN = ''
            // 체크박스그룹 활성/비활성
            this.chkboxGroup = false
          }
        } else {
          // Focus데이터가 있을 때
          document.getElementById('b-input-IoT-No').readOnly = true
          document.getElementById('b-input-IoT-Name').readOnly = false
          document.getElementById('b-input-IoT-Date').readOnly = false
          document.getElementById('b-form-IoT-Place').disabled = false
          document.getElementById('b-input-IoT-Lati').readOnly = false
          document.getElementById('b-input-IoT-Longi').readOnly = false
          this.txt_IoT_No = DataRow_info.IOT_NO
          this.txt_IoT_Name = DataRow_info.IOT_NM
          this.txt_IoT_Date = DataRow_info.INS_DATE
          this.txt_IoT_Place = DataRow_info.INS_AREA
          this.txt_IoT_Lati = DataRow_info.INS_LAT
          this.txt_IoT_Longi = DataRow_info.INS_LON
          this.cb_Use_YN = DataRow_info.USE_YN
          // 체크박스그룹 활성/비활성
          this.chkboxGroup = false

          if (DataRow_info.GAS_TYPE == "") {
            this.chkboxselected = []
          } else {
            var split_GAS = []
            split_GAS = DataRow_info.GAS_TYPE.split(',')
            this.chkboxselected = split_GAS
          }
        }
        
        
      },
    }
}

</script>

<style lang="less" scope>

// 메뉴리스트 부분 너비
.menu_list {
    max-width:30% !important;
}
  
// 메뉴세부정보 부분 너비
.menu_list_item {
    max-width:70% !important;
}

// 메뉴 세부정보 텍스트부분
label.Input-Area-Label {
    text-align: right;
    margin-right: 20px;
    padding-left: 0px;
}

</style>