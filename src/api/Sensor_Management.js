import request from '@/utils/request'

// 구/군 콤보박스 조회
export function SEARCH_COMBO1() {
  return request({
    url: '/SELECT_COMBO1',
    method: 'get'
  });
}

// 동/리 콤보박스 조회
export function SEARCH_COMBO2(CODE_DVN) {
  return request({
    url: '/SELECT_COMBO2?data={AREA1:"' + CODE_DVN + '"}',
    method: 'get'
  });
}

// 세부정보 콤보 조회
export function SEARCH_COMBO3(CODE_DVN) {
  return request({
    url: '/SELECT_COMBO3?data={CODE_DVN:"' + CODE_DVN + '"}',
    method: 'get'
  });
}

// 트리데이터 조회
export function SEARCH_TREE(AREA1, AREA2) {
  return request({
    url: '/SELECT_TREE?data={AREA1:"' + AREA1 + '",AREA2:"' + AREA2 + '"}',
    method: 'get'
  });
}

// 트리데이터 조회
export function SEARCH_TREE_AREA(AREA1) {
  return request({
    url: '/SELECT_TREE_AREA?data={AREA_NAME:"' + AREA1 + '"}',
    method: 'get'
  });
}

// 센서데이터 저장
export function SAVE_SENSOR(data) {
  return request({
    url: '/SAVE_SENSOR',
    method: 'post',
    data: data
  });
}

// 센서데이터 삭제
export function DELETE_SENSOR(data) {
  return request({
    url: '/DELETE_SENSOR',
    method: 'post',
    data: data
  });
}