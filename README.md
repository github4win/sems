# vue_site

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### 2020년 01월 29일 KWON-OHYOON 작성
사용화면 : Management_Book.vue , Book_Kind_Modal.vue
설치사유 : 도서 관리 화면 그리드에서 도서분류 클릭시 도서분류를 선택할 수 있는 체크박스를 Modal 창으로 나타내기 위해 설치하였습니다.
설치모듈 : vue-js-modal
설치방법 : 
1. Terminal 창에서  npm install vue-js-modal --save 입력 후 실행합니다.
2. 프로젝트 디렉토리 /src폴더 하위 main.js 아래와 같이 수정합니다.
  ㄴ import VModal from 'vue-js-modal' // vue-js-modal을 사용하기 위한 import
  ㄴ Vue.config.productionTip = false 다음 줄에 아래 코드를 추가합니다.
  ㄴ Vue.use(VModal, { dynamic: true })  // 프로젝트에서 vue-js-modal을 동적으로 만들어 사용할 수 있도록 합니다.
    (width, height, draggable)등 옵션값을 지정할 수 있습니다.
사용방법: 
 - 모달창을 호출할 부모창 Template 코드 안에 <modals-container />를 반드시 작성해야 합니다.
 - 그 외 사용방법은 Management_Book.vue , Book_Kind_Modal.vue 파일을 참고 해주시기 바랍니다.
### 2020년 01월 29일 KWON-OHYOON 작성

### 2020년 02월 21일 CJH 작성
Asset_Add_Pop >> Asset_Add_POP으로 수정
Asset select pop >> Asset_Select_POP 으로 수정
최신버전 풀 받고도 오류 발생시 위의 수정내용 반영 해보시기 바랍니다.

### 2020년 03월 04일 KWON-SANGJUN 작성
npm install --save ol

### 2020년 04월 06일 CJH 작성
<!-- npm install --save @toast-ui/vue-chart -->
<!-- toast-chart를 추가하였습니다.
그리드처럼 impoart { barChart, lineChart}(사용할 차트 종류)  from '@toast-ui/vue-chart' 로 사용합니다. -->

### 2020년 04월 09일 CJH 작성
상단의 @toast-ui/vue-chart 를 삭제하고 tui-chart 를 추가하였습니다.
npm install --save tui-chart 실행.
impoart tui from 'tui-chart'
tui.chartType(document.getElementById('divID'),data,options) 으로 사용합니다. (Test_sub_2.vue 화면에서 사용)
옵션 속성 참고 : https://github.com/nhn/tui.chart/wiki/features-series

날짜 관련 이벤트 쉽게 다루기위해 npm 설치
npm install --save moment 
moment(시간).format('형식') 형태로 사용.
참고 사이트: https://github.com/jinyowo/JS-Calendar/wiki/**-moment.js-(%EB%82%A0%EC%A7%9C%EA%B4%80%EB%A0%A8-%EC%9E%91%EC%97%85%EC%9D%84-%EC%9C%84%ED%95%9C-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC)

### 2020년 08월 20일 CJH 작성
TuiGrid입력시 Tab 또는 Enter Key를 누르면 항상 첫페이지의 Rowkey로 계산되므로 아래 로직을 추가해서 수정함.
수정기준 버전 4.14 (4.14 이전버전에서는 없을 수도 있음)

node_modules\tui-grid\dist\tui-grid.js 파일

19085 줄 추가

변경전)
  focus_1.startEditing(store, rowKey, columnName);

변경후)
  rowKey = (store.data.pageOptions.page-1) * store.data.pageOptions.perPage + rowKey;
  focus_1.startEditing(store, rowKey, columnName);

19109 줄 추가

변경전)
  focus_1.startEditing(store, nextRowKey, nextColumnName);
변경후)
  nextRowKey = (store.data.pageOptions.page-1) * store.data.pageOptions.perPage + nextRowKey;
  focus_1.startEditing(store, nextRowKey, nextColumnName);

### 2020년 09월 18일 CJH 작성
npm install vue-loading-overlay 
