/*eslint-disable no-unused-vars, no-empty*/

let GridDefault= {

    // 그리드 테두리선
    Defualt_outline : {border: "#000", showVerticalBorder: true},

    Area_Summary:{showVerticalBorder: true},

    // 그리드 셀의 스타일
    Cell_Normal: {background: "#fff", border: "#ccc", showVerticalBorder: true, showHorizontalBorder: true},

    // 그리드 헤더의 스타일
    Cell_Header: {border: "#ccc"},

    // 그리드 서머리의 스타일
    Cell_Summary: {border: "#ccc", showVerticalBorder: true, background: "#f5da81"},

    // Row Hover Color
    Row_Hover : {background: "#f5da81"},

    // 스크롤바 테두리선
    scrollbar: {border: "#000"},

    // 헤더 정렬 
    header: {align: "center", minheight:40, height:40, complexColumns:[]},

    // Row별 크기
    rowHeight: 30,

    // 그리드 전체 크기
    bodyHeight: 300,

    // 컬럼 사이즈 재조정 가능 여부
    columnOptions : {resizable: true} ,

    // 사용자 pageOptions 설정 사용 여부
    pageOptions: {useClient: true, perPage: 10},

    // 기본, 공통으로 사용할 그리드 설정
    GridValue(){
        var Grid_Value = {
            //outline: this.Defualt_outline,
            area: {
                summary: this.Area_Summary
            },
            cell: {
                normal: this.Cell_Normal,
                header: this.Cell_Header,
                summary: this.Cell_Summary
            },
            row: {hover: this.Row_Hover},
            scrollbar: this.scrollbar
        }

        return Grid_Value;
    }
}
// 그리드 Cell 안에 들어갈 텍스트 박스  (옵션은 MaxLength만 있음)
let TextBoxEditor = /** @class */ (function () {
    function TextBoxEditor(props) {
        const el = document.createElement('input');
        const { maxLength, upper } = props.columnInfo.editor.options;

        // 입력시 발생하는 이벤트
        el.addEventListener('keypress', function (event) {
            if (upper)
            {
                // 소문자 알파벳 a ~ z
                if(event.keyCode >= 97 && event.keyCode <= 122)
                {
                    if(!event.ctrlKey && !event.metaKey && !event.altKey)
                    {
                        var newChar = event.keyCode - 32;
                        var start = event.target.selectionStart;
                        if(start >= maxLength)
                            return;
                        var end = event.target.selectionEnd;
                        event.target.value = event.target.value.substring(0, start) + String.fromCharCode(newChar) + event.target.value.substring(end);
                        event.target.setSelectionRange(start+1, start+1);
                        event.preventDefault();
                    }
                }
            }
            
        });

        el.type = 'text';
        el.maxLength = maxLength;
        el.value = String(props.value);

        this.el = el;
    }
    TextBoxEditor.prototype.getElement = function () {
        return this.el;
    };
    TextBoxEditor.prototype.getValue = function () {
        return this.el.value;
    };
    TextBoxEditor.prototype.mounted = function () {
        this.el.select();
    };

    return TextBoxEditor;
}());

// 그리드 Cell 안에 들어갈 텍스트 박스  (옵션은 MaxLength만 있음)
let NumberTextEditor = /** @class */ (function () {
    function NumberTextEditor(props) {
        const el = document.createElement('input');
        const { maxLength, min, max } = props.columnInfo.editor.options;

        // 입력시 발생하는 이벤트
        el.addEventListener('keypress', function (event) {
            
            var start = event.target.selectionStart;
            var end = event.target.selectionEnd;

            // keyCode 48 ~ 57 : 숫자
            // keyCode 45 : Minus (-)
            // keyCode 46 : 소수점 (.)
            if(event.keyCode == 45 || event.keyCode == 46)
            {
                let returnYN = true;

                // 숫자 중간에 -가 들어가는 경우는 입력하지 않는다.
                if(start > 0 && event.keyCode == 45)
                    returnYN = false;

                // 소수점이 두번 들어가지 않도록 한다.
                if(event.keyCode == 46 && event.target.value.indexOf('.') > 0)
                    returnYN = false;

                event.returnValue = returnYN;
            }
            else if(event.keyCode < 48 || event.keyCode>57)
                event.returnValue = false;

            if(!event.returnValue)                
                return;

            let val = "";

            // 입력한 문자가 숫자가 아닌경우
            // ".7" 과 같이 앞에 0이 없는데도 불구하고 isNaN함수에서는 숫자로 판단하므로 substring으로 제한함
            if(event.target.value.substring(0,1) == "." || isNaN(event.target.value + String.fromCharCode(event.keyCode)))
            {
                val = event.target.value + String.fromCharCode(event.keyCode);
            }
            else if (start > 0 && String.fromCharCode(event.keyCode) == ".")
            {
                val = event.target.value + String.fromCharCode(event.keyCode);
            }
            else
            {
                val = Number(event.target.value + String.fromCharCode(event.keyCode));

                if(val  <= min)
                    val = min;
                else if(val == max)    
                    val = max;
                else if(val > max)
                    val = Number(event.target.value);
            }

            if(String(val).length > maxLength)
            {
                val = String(val).substring(0,maxLength);
            }

            event.target.value = val;
            event.target.setSelectionRange(start+1, start+1);
            event.preventDefault();
            
        });

        el.type = 'text';
        el.maxLength = maxLength;
        el.value = String(props.value);

        this.el = el;
    }
    NumberTextEditor.prototype.getElement = function () {
        return this.el;
    };
    NumberTextEditor.prototype.getValue = function () {
        return this.el.value;
    };
    NumberTextEditor.prototype.mounted = function () {
        this.el.select();
    };

    return NumberTextEditor;
}());

// 숫자형식에 천원단위로 콤마를 붙인다.
 function NumberComma(val) {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
 }

 // 그리드의 체크된 데이터를 Array로 변환한다.
 // grid : vue에서 사용하는 TuiGrid
 // columns : grid에서 사용하는 컬럼 Array
 // add_Parameter : grid에 없지만 추가해야 하는 Parameter
 function Grid_CheckedData(grid, columns, add_parameter){

    // 결과값을 담을 변수 ... (반드시 변수명이 "data"로 되어야 WebService와 연동이 됨)
    let data = [];

    // grid에서 체크된 데이터를 뽑는다.
    let CheckedRows = grid.invoke('getCheckedRows');

    // 체크된 데이터 만큼 Loop
    for(var i = 0; i < CheckedRows.length; i++)
    {
        let str_data = '{';

        for(var j = 0; j < columns.length; j++)
        {
            // 그리드에 없는 컬럼일 경우 continue
            if(CheckedRows[i][columns[j]] == undefined)
                continue;

            // 컬럼 명
            let Column_Name = columns[j].toString();

            // 컬럼 데이터
            let Column_Data = CheckedRows[i][columns[j]].toString();
            
            if(j > 0)
                str_data += ",";

            str_data += '"'+columns[j].toString()+'":"'+ Column_Data+'"';
        }

        // 추가 파라미터 Json형태 문자열로 변경
        let SubParameter = "";   
        for (var key of Object.keys(add_parameter)) {

            if (SubParameter !== "")
                SubParameter += ",";
            
            SubParameter += '"'+key+'":"'+add_parameter[key]+'"';
        }

        // 추가 파라미터가 있을 경우에만 추가
        if(SubParameter !== "")
            str_data += "," + SubParameter;

        str_data += '}';

        // JSON으로 변경 
        data[i] = {data:JSON.stringify(str_data)}
    }
    return {data};
 }

export {GridDefault, TextBoxEditor, NumberComma, NumberTextEditor, Grid_CheckedData};