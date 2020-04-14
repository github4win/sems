/*eslint-disable no-unused-vars, no-empty*/

export default {

    // 널체크
    fn_IsNull(obj)
    {
        if(obj == null || obj == 'null' || obj == undefined || obj == 'undefined' || obj == "" || obj == ''||obj.toString().trim() == "" || obj.toString().trim() == '' )
            return true;
        else 
            return false;
    },

    // 디바이스 사이즈 변경시 실행되어야 하는 이벤트 
    fn_SizeChanged_Exec(window, func)
    {
        if(this.fn_IsNull(window) || this.fn_IsNull(func))
            return;
        
        window.addEventListener('load',  func, false); // 초기 화면 Screen 설정 이벤트
        window.addEventListener('resize',  func, false); // 초기 화면 Screen 설정 이벤트
        
    },

    // 디바이스의 사이즈를 가져온다. [Mobile_V, Mobile_H, Tablet, Desktop, Desktop_L]
    fn_ScreenSize()
    {
        return window.getComputedStyle(document.querySelector(".Screen_size"), ":before").getPropertyValue("content")
    },

    // 현재 화면의 메뉴명을 경로 공간에 입력한다.
    fn_SetMenuPath(screen)
    {
        var found = screen.$router.options.routes.find(element => element.path == screen.$route.path);
        document.getElementById("path_div").innerText = found.name;
    },

    // 그리드의 컬럼을 보여준다.
    fn_Grid_ShowColumn(grid, Columns)
    {
        if(this.fn_IsNull(grid) || this.fn_IsNull(Columns))
            return;

        if(Columns.length <= 0)
            return;

        Columns.forEach(element => {
            grid.invoke("showColumn", element);    
        });
    },

    // 그리드의 컬럼을 숨긴다.
    fn_Grid_HideColumn(grid, Columns)
    {
        if(this.fn_IsNull(grid) || this.fn_IsNull(Columns))
            return;

        if(Columns.length <= 0)
            return;

        Columns.forEach(element => {
            grid.invoke("hideColumn", element);    
        });
    },

    // 머지해야할 데이터 가공
    fn_Data_Merge(data, Columns)
    {
        // 컬럼만큼 Loop시작
        Columns.forEach(col => {

            // 컬럼의 중복 제거된 Array를 구한다.
            let unique_value = this.fn_Unique_data(data, col);

            // 중복 제거된 값으로 Loop
            unique_value.forEach(uk_value => {

                // 중복 제거된 값으로 필터링 된 Array를 구한다.
                let Merge_rows = data.filter(x=>x[col.toString()] == uk_value);

                // Merge 속성은 Merge 시작 행에만 속성을 부여하기 때문에 0번째를 사용한다.
                let Merge_first_row = Merge_rows[0];
                
                // 속성이 없을 경우 추가
                if(Merge_first_row._attributes == undefined)
                {
                    Merge_first_row["_attributes"] = {};

                    // 속성이 없을 경우 추가
                    if(Merge_first_row._attributes.rowSpan == undefined)
                        Merge_first_row._attributes["rowSpan"] = {};
                }

                // Merge 시작행에 Merge 속성을 부여한다.
                Merge_first_row._attributes.rowSpan[col.toString()] = Merge_rows.length;
            });
        });
    },

    // 배열의 Unique값을 Array로 반환한다.
    fn_Unique_data(data, col_name)
    {
        // 반환할 배열
        var return_array = [];

        // 데이터 만큼 Loop시작
        data.filter(function (data_row) {

            // 반환할 배열에 값이 없을 경우에만 Push
            if (return_array.indexOf(data_row[col_name]) < 0) {

                if(data_row[col_name] != undefined)
                    return_array.push(data_row[col_name]);
            }
        });

        return return_array;
    }


}

