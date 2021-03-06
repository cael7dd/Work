/**
 * Created by 87676 on 7/22/2016.
 */
(function () {
    var input,output,btnSend,btnClear,socket,url=/(.+:)/.exec(location.origin)[1]+"8000",tips;
    init();
    function init() {
        getElement();
        addExpression();
        expressionEvent();
        connectServer();
        socket.emit("user");
        addListeners();
    }
    //动态添加表情
    function addExpression() {
        var container=document.querySelector("#d_expressionContainer");
        for(var i=0;i<10;i++){
            for(var j=0;j<9;j++){
                var div=document.createElement("div");
                div.className="d_express";
                div.style.backgroundPosition=-j*28+"px "+(-28)*i+"px";
                (function (m,n) {
                    div.onclick=function (event) {
                        event.stopPropagation();
                        input.value+="$"+(-n*28)+"#$"+(-28)*m+"#";
                    }
                })(i,j);
                container.appendChild(div);
            }
        }
    }
    //添加表情点击事件
    function expressionEvent() {
        var btnExpression=document.querySelector("#d_openExpression");
        var expressionContainer=document.querySelector("#d_expressionContainer");
        btnExpression.onclick=function () {
            expressionContainer.style.display="block";
            document.addEventListener("mouseup",function () {
                expressionContainer.style.display="none";
                document.removeEventListener("mouseup",arguments.callee);
            });
        }
    }
    //获取结点
    function getElement() {
        input=document.querySelector("#input");
        output=document.querySelector("#output");
        btnSend=document.querySelector("#btn_send");
        btnClear=document.querySelector("#btn_clear");
        tips=document.querySelector("#d_tips");
    }
    //解析消息中的表情代码和其他文本，并对表情代码进行处理
    function getExpression(data) {
        var exp=/([^\$]*)\$([^\#]+)\#\$([^\#]+)\#([^\$]*)/g;
        var first=true;
        var str="";
        while (true){
            var temp=exp.exec(data);
            if(!temp){
                if(first){
                    return data;
                }
                break;
            }
            first=false;
            if(temp[2]&&temp[3]){
                str+=temp[1]+"<div class='d_lineExpress' style='background-position:"+temp[2]+"px "+temp[3]+"px'></div>"+temp[4];
            }else{
                str+=temp[1]+temp[4];
            }
        }
        return str;
    }
    //添加事件监听器
    function addListeners(){
        btnClear.onclick=function () {
            input.value="";
        };
        //发送消息
        function sendChart() {
            socket.emit("chat",input.value);
            var div=document.createElement("div");
            div.className="myLines";
            div.innerHTML="me&nbsp;:&nbsp;&nbsp;"+getExpression(input.value);
            output.appendChild(div);
            input.value="";
            output.scrollTop=output.scrollHeight;
        }
        //接受收到的chat消息
        socket.on("chat",function (data) {
            var div=document.createElement("div");
            div.className="lines";
            div.innerHTML="server&nbsp;:&nbsp;&nbsp;"+getExpression(data);
            output.appendChild(div);
            output.scrollTop=output.scrollHeight;
        });
        //有客服接受请求
        socket.on("accept",function (data) {
            tips.innerHTML="server&nbsp;&nbsp;"+data+"&nbsp;&nbsp;is&nbsp;&nbsp;served&nbsp;&nbsp;for&nbsp;&nbsp;you!";
            changeLeftBlock(data);
            btnSend.onclick=sendChart;
            document.onkeydown=function (event) {
                if(event&&event.keyCode==13){
                    event.preventDefault();
                    sendChart();
                }
            };
        });
        //有客服拒绝请求
        socket.on("declined",function (data) {
            tips.innerHTML="server&nbsp;&nbsp;"+data+"&nbsp;&nbsp;said&nbsp;:&nbsp;screw&nbsp;&nbsp;you!";
            clearLeftBlock();
            btnSend.onclick="";
            document.onkeydown="";
        });
        //没有客服
        socket.on("none",function () {
            tips.innerHTML="no&nbsp;&nbsp;services&nbsp;!&nbsp;&nbsp;try&nbsp;&nbsp;again&nbsp;&nbsp;or&nbsp;&nbsp;wait";
        });
    }
    //动态更改左侧列表，显示服务人员信息
    function changeLeftBlock(data) {
        var container=document.querySelector("#d_leftBlock");
        container.innerHTML="server "+data;
        container.style.background="#bbb";
    }
    //清除左侧服务人员信息
    function clearLeftBlock() {
        var container=document.querySelector("#d_leftBlock");
        container.innerHTML="";
        container.style.background="#fff";
    }
    //连接服务器
    function connectServer() {
        socket=io(url);
    }

})();