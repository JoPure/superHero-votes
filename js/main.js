
var url = "http://54.255.175.55:8680";
var actId = 100027;
var NoChoose = true;
var alreadyVote = false;
var state = false;

function init(){
    localStorage.setItem("click","");
    var state1 = localStorage.token=="";
    var state2 = localStorage.token=="undefined";
        state = state1 || state2;

    if(!state){
        var active = new Date().getTime();
        active -=1800000;
        if(active < parseInt(localStorage.loginTime)){
            $(".statename p").text(localStorage.playerId);
            $(".stateServer p").text(localStorage.gameZone);
            $(".m_index").css("display","block");
            $(".m_login").hide();
            
            query();
        }else{
            state = true;
            localStorage.setItem("token","");
        }
    }else{
    	state = true;
    }
}



$(function(){
	
	$(".m_index .mbtn").click(function() {
		$(".m_index").hide();
		$(".m_step").show();
		$(".nav").show();
	})

    $(".m_step .role").click(function(){
        var num = $(this).attr('data-role');
        
        if(!alreadyVote
        ){
            if(num==localStorage.click && NoChoose==false ){
				$(this).removeClass();
				$(this).addClass("role" + num + "_img");
                NoChoose = true;
                localStorage.setItem("click",num);
                $('.m_step .vote').css("background", "url(img/btn_vote.png) no-repeat center top").css("background-size","cover").attr("disabled","disabled");
            }else{
                NoChoose = false;
                var state1 = localStorage.click!="";
                var state2 = localStorage.click!="undefined";
                var state3 = state1 && state2;
                if(state3){
                	var Objov = $(".role" + localStorage.click + "_imgc");
					Objov.removeClass();
					Objov.addClass("role" + localStorage.click + "_img");
                }
                localStorage.setItem("click",num);
               	$(this).removeClass();
				$(this).addClass("role" + num + "_imgc");
                $('.m_step .vote').css("background", "url(img/btn_vote2.png) no-repeat center top").css("background-size","cover").removeAttr("disabled");
            }
        }
    });

    $("#mstop .logout").click(function(){
        localStorage.setItem("token","");
        state = true;
        $(".m_login").show();
		$(".m_step").hide();
		$(".nav").hide();
		
        alreadyVote = false;
        NoChoose = true;
        var Objov = $(".role" + localStorage.click + "_imgc");
		Objov.removeClass();
		Objov.addClass("role" + localStorage.click + "_img");
        $('.m_step .vote').css("background", "url(img/btn_vote.png) no-repeat center top").css("background-size","cover").attr("disabled","disabled");
        alert(msg[5]);
    });


    $(".loginButton").click(function(){
        var username = $('#username').val();
        var password = $('#password').val();
        var gameZone = $('#gameZone').val();
        var playerId = $('#playerId').val();

        if(username=="" | password==""){
            alert(msg[1]);
        }else if(gameZone=="" | playerId==""){
            alert(msg[2]);
        }else{
            $(this).attr("disabled","disabled");
            var hash = hex_md5(password);

            $.ajax({
                type: "GET",
                url: url+"/user/login",
                data: {
                    userName: username,
                    password: hash,
                    version: 'v3'
                },
                dataType: 'jsonp',
                jsonp: "jsonCallback",

                success: function(result){
                    if(result.code==200){
                        alert(msg[4]);
                        localStorage.setItem("username",username);
                        localStorage.setItem("password",hash);
                        localStorage.setItem("gameZone",gameZone);
                        localStorage.setItem("playerId",playerId);
                        localStorage.setItem("token",result.data.token);
                        state = false;
                        $(".m_login").css("display","none");
                        $(".statename p").text(localStorage.playerId);
                        $(".stateServer p").text(localStorage.gameZone);
                        $(".m_index").css("display","block");
                        var myTimer = new Date().getTime();
                        localStorage.loginTime = myTimer;

                        clean();
                        query();
                    }else{
                        alert(msg[result.code]);
                    }
                },
                complete: function(){
                    $(".loginButton").removeAttr("disabled");
                },

                error: function(err){
                    alert(err);
                }
            });
        }
    });

    $(".vote").click(function(){
        if(state){
            alert(msg[403]);
            
	        var Objov = $(".role" + localStorage.click + "_imgc");
			Objov.removeClass();
			Objov.addClass("role" + localStorage.click + "_img");
			
            $(".m_login").show();
            $(".m_step").hide();
            $(".nav").hide();
        }else{
            $.ajax({
                type: "GET",
                url: url+"/act/vote/bubbled/doVote/platform",
                data: {
                    actId: actId,
                    groupIndex: 1,
                    token: localStorage.token,
                    objectId: "10"+localStorage.click,
                    playerId: localStorage.playerId,
                    gameZone: localStorage.gameZone
                },

                dataType: 'jsonp',
                jsonp: "jsonCallback",

                success: function(result){
                    if(result.code==200){
                        var data = result.data;
                        console.log(data);
                        for(var j=1; j<=4; j++){
                        	var str = ".role"+j+"_num";
                            var str2 = "10"+j;
                            $(str).text(data[str2]);
                        }
				        var Objov = $(".role" + localStorage.click + "_img");
						Objov.removeClass();
						Objov.addClass("role" + localStorage.click + "_imgc");
                        alreadyVote=true;
        				$('.m_step .vote').css("background", "url(img/btn_vote3.png) no-repeat center top").css("background-size","cover").attr("disabled","disabled").css("cursor","not-allowed");
                        setNum();
                    }else{
                        alert(msg[result.code]);
                    }
                },

                error: function(err){
                    alert(err);
                }
            });
        }
    });

});


function clean(){
    $('#username').val("");
    $('#password').val("");
    $('#gameZone').val("");
    $('#playerId').val("");
}

function query(){
    $.ajax({
        type: "GET",
        url: url+"/act/vote/bubbled/voted",
        data: {
            actId: actId,
            token: localStorage.token
        },
        dataType: 'jsonp',
        jsonp: "jsonCallback",

        success: function(result){
            if(result.code==200){
                var data = result.data;
                if(data.length!=0){
                    var num = data[0]-100;
                    localStorage.click = num;
                    var Objov = $(".role" + num + "_img");
					Objov.removeClass();
					Objov.addClass("role" + num + "_imgc");
                    NoChoose = false;
                    setNum();
                    alreadyVote=true;
        			$('.m_step .vote').css("background", "url(img/btn_vote3.png) no-repeat center top").css("background-size","cover").attr("disabled","disabled").css("cursor","not-allowed");
                }
            }else{
                alert(msg[result.code]);
            }
        },

        error: function(err){
            alert(err);
        }
    });
}

function setNum(){
    $.ajax({
        type: "GET",
        url: url+"/act/vote/bubbled/query",
        data: {
            actId: actId,
            sort: false,
            asc: true
        },
        dataType: 'jsonp',
        jsonp: "jsonCallback",

        success: function(result){
            if(result.code==200){
                var nums = result.data.groups[0];
                var objects = nums.objects;
                console.log(objects);
                for(var i= 0,j=1; i<4; i++,j++ ){
                    var str = ".role"+j+"_num";
                    $(str).text(objects[i].count);
                    $(str).show();
                }
            }else{
                alert(msg[result.code]);
            }
        }
    });
}

function reEdit(){
    var serverId = $("#gameZone").val();
    if(serverId<1){
        $("#gameZone").val(1);
    }
}

var msg = {
    "1": "Bắt buộc nhập tài khoản và mật khẩu",
    "2": "Bắt buộc nhập server hoặc ID",
    "3": "Thoát đăng nhập",
    "4": "Đăng nhập thành công",
    "5": "Thoát thành công",
    "403": "Đăng nhập trước",
    "108": "Đã bỏ phiếu",
    "301": "Tài khoản hoặc mật mã sai"
};