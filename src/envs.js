export default { 
    
    // 해당 프레임워크가 사용될 시스템 이름
    // 특정 타입 템플릿에서 상단에 출력됨
    name: 'WinWebService',  
    // local 개발환경에서 작업 시, restful mockup 서버 url 정보
    // 차후, 개발 서버가 구축되면 그곳으로 변경


    // 개발
    buildUrl: 'https://localhost:44300/Service_SEMS.svc' //local wcf
   //buildUrl: 'http://192.168.0.21:54636/RestfulService.svc'  //local wcf
    
    // 운영 
    // buildUrl: 'https://commonservice.win-it.co.kr/Service_SEMS.svc'
   
    // 서버 (개발, 운영) 환경에 build하여 업로드 할 경우, 기본 api base url
}