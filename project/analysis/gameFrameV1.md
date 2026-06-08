부품 및 견적별 게임 프레임 및 성능 추출 

대상 : https://kjwwang.com/
> https://kjwwang.com/
```

```
> https://kjwwang.com/shop/pc_estimate.html?action=view&es_sn=16628 기준
    > 페이지 소스 보기
    ```

    <!DOCTYPE html>
    <html lang='ko'>
    <head>
    <meta charset="euc-kr">
    <meta http-equiv="Content-Script-Type" content="text/javascript">
    <meta http-equiv="Content-Style-Type" content="text/css">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="author" content="견적왕" />
    <meta name="generator" content="견적왕" />
    <meta name="description" content="7800X3D + RTX 5060 TI 16GB"/>
    <meta name="keywords" content="컴퓨터 견적은 견적왕 - PC견적 & 가격비교 사이트, 조립컴퓨터, 마이페이지, 사무용PC, 오버클럭PC, 일체형수랭PC, 컴퓨터부품, 온라인견적, PC견적, 컴퓨터 견적"/>
    <meta name="naver-site-verification" content="009abda663e40c161735d6909d24bad7eb77c8bd"/>
    <meta name="google-site-verification" content="LsIPblRh5Ct7-zK-VoG6zuu3xGF-5dXDERkooxEVdrc"/>
    <meta name="apple-mobile-web-app-title" content="7800X3D + RTX 5060 TI 16GB"/>
    <meta property="og:type" content="website">
    <meta property="og:title" content="7800X3D + RTX 5060 TI 16GB">
    <meta property="og:description" content="7800X3D + RTX 5060 TI 16GB">
    <meta property="og:image" content="/skin/shop/basic/customizing/logo.png">
    <meta property="og:url" content="https://kjwwang.com/">
        
    <title>7800X3D + RTX 5060 TI 16GB</title>
    <link rel="canonical" href="https://kjwwang.com/" >
    <link rel="shortcut icon" href="/skin/shop/basic/customizing/favicon.ico">
    <script type="text/javascript" src="/js/jquery-1.4.2.min.js"></script>
    <script type="text/javascript" src="/js/common.js"></script>

    
    <script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
    <script>
        var g4_path      = '..';
        var g4_bbs       = 'bbs';
        var g4_bbs_img   = 'img';
        var g4_url       = 'http://kjwwang.com';
        var g4_is_member = '';
        var g4_is_admin  = '';
        var g4_bo_table  = '';
        var g4_sca       = '';
        var g4_charset   = 'euc-kr';
        var g4_cookie_domain = '.kjwwang.com';
        var g4_is_gecko  = navigator.userAgent.toLowerCase().indexOf('gecko') != -1;
        var g4_is_ie     = navigator.userAgent.toLowerCase().indexOf('msie') != -1;

        function execDaumPostcode(id1, id2, id3, id4) {
            new daum.Postcode({
                oncomplete: function(data) {
                    var fullAddr = ''; // 최종 주소 변수
                    var extraAddr = ''; // 조합형 주소 변수
                    if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                        fullAddr = data.roadAddress;
                    } else { // 사용자가 지번 주소를 선택했을 경우(J)
                        fullAddr = data.jibunAddress;
                    }
                    if(data.userSelectedType === 'R'){
                        if(data.bname !== ''){
                            extraAddr += data.bname;
                        }
                        if(data.buildingName !== ''){
                            extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                        }
                        fullAddr += (extraAddr !== '' ? ' ('+ extraAddr +')' : '');
                    }
                    var zonecode_1 = data.zonecode.substring(0,3);
                    var zonecode_2 = data.zonecode.substring(3,5);
                    var postcode_1 = data.postcode.substring(0,3);
                    var postcode_2 = data.postcode.substring(4,7);
                    if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                        document.getElementById(id1).value = zonecode_1;
                        document.getElementById(id2).value = zonecode_2;
                    } else { // 사용자가 지번 주소를 선택했을 경우(J)
                        document.getElementById(id1).value = zonecode_1;
                        document.getElementById(id2).value = zonecode_2;
                    }
                    document.getElementById(id3).value = fullAddr;
                    document.getElementById(id4).focus();
                                    
                    if(typeof order_delivery_cost == 'function' ) {
                        order_delivery_cost();
                    }
                    
                }
            }).open();
        }
        
        </script>
        
        <script>
        if(window.location.protocol == 'http:'){
            window.location.protocol = 'https:';
        }
        </script>	
        
    <link rel="stylesheet" href="/skin/shop/basic/css/common.css?patch=202605125" />
    <link rel="stylesheet" href="/skin/shop/basic/css/skin.css?patch=202605125" />
    <link rel="stylesheet" href="/skin/shop/basic/css/mypage.css?patch=202605125" />
    <link rel="stylesheet" href="/skin/shop/basic/css/member.css?patch=202605125" />
    <link rel="stylesheet" href="/skin/shop/basic/css/etc.css?patch=202605125" />
    <link rel="stylesheet" href="/skin/shop/basic/css/remodal.css">
    <link rel="stylesheet" href="/skin/shop/basic/css/remodal-default-theme.css">
    <link rel="stylesheet" href="/skin/shop/basic/css/jquery.simplyscroll.css">
    <link rel="stylesheet" href="/skin/shop/basic/css/jquery-ui.css?patch=202605125">
    <link rel="stylesheet" href="/skin/shop/basic/css/king.css?patch=202605125">
    <link rel="stylesheet" href="/skin/shop/basic/css/assembly.css">
    <link rel="stylesheet" href="/skin/shop/basic/css/online.css">
    <link rel="stylesheet" href="/skin/shop/basic/css/online_estimate.css?patch=202605125">
    <link rel="stylesheet" href="/skin/shop/basic/css/auction.css">
    <link rel="stylesheet" href="/skin/shop/basic/css/detail.css">
    <link rel="stylesheet" href="/skin/shop/basic/css/month.css">
    <link rel="stylesheet" href="/skin/shop/basic/css/product.css">
    <link rel="stylesheet" href="/skin/shop/basic/css/brandshop.css?patch=202605125">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.2/css/all.min.css"/>

    <script type="text/javascript" src="/skin/shop/basic/js/jquery.min.js"></script>
    <script type="text/javascript" src="/skin/shop/basic/js/jquery-ui.js"></script>
    <script type="text/javascript" src="/skin/shop/basic/js/remodal.js"></script>
    <script type="text/javascript" src="/skin/shop/basic/js/jquery-supergallery-plugin2.min.js"></script>
    <script type="text/javascript" src="/skin/shop/basic/js/jquery.simplyscroll.min.js"></script>
    <script type="text/javascript" src="/js/basic.js?patch=20221016"></script>

    <script>
    function slide_on(obj,flag,tab){
        var img_ul = "";
        var $this = $(obj);
        if(flag){
            img_ul = $this.parents(".bnr").find("ul");
        }
        else{
            if(tab){
                if(tab=="game"){
                    var index = $(".gamepc_slide").find(".tab .on").parent().index();
                    img_ul = $(".game_list").eq(index).find("ul");
                }else if(tab=="multiple"){
                    img_ul = $this.parent().find(".inner.on > ul");
                }else if(tab=="set"){
                    img_ul = $this.parent().children("ul");
                }else{
                    //이벤트 일시
                    var index = $(".event_view").find(".tab .on").parent().index();
                    img_ul = $(".events").find("ul:eq("+index+")");
                }
            }else{
                img_ul = $this.parent().find("ul");
            }
        }

        var list_img = img_ul.children("li").width();
        var length = img_ul.children("li").length;
        var current = $("#header .current");
        var str = "";
        
        
        if($this.hasClass("next")){
            if(flag){ 
                str = img_ul.find("li").eq(0).next().attr("class");
                current.text(str.substr(-1,1)); 
            }
            img_ul.animate({
                "margin-left" : "-="+list_img+""
            },function(){
                img_ul.children("li").eq(0).appendTo(img_ul);
                img_ul.css("margin-left","0");

                        })

            
        }else{
            if(flag){ 
                str = img_ul.find("li").eq(length-1).attr("class");
                current.text(str.substr(-1,1)); 
            }
            img_ul.children("li").eq(length-1).prependTo(img_ul);
            img_ul.css("margin-left",-list_img);
            img_ul.animate({ "margin-left" : "+="+list_img+"" })
        }


    }

    function pointer_on_off(obj, type){
        if(type == "off"){
            $(obj).parent().find(".compos").addClass("pointer");
        }else{
            $(obj).parent().find(".compos").removeClass("pointer");
        }
    }

    $(document).ready(function(){
        var url = "/index.php";
        var ctgr_layer = $(".ctgr_layer");
        var ctgr_all = $(".ctgr_all li");
        var ctgr_parent = $(".ctgr_parent");

        //20240607
        $(".header_bottom").removeClass("on");
        
        $(".popular_item_1 .category_nav li").click(function(){
            var $this = $(this).attr("class");
            var target = $(".popular_item_1 .popular_all."+$this+"");
            var offset = target.offset(); 
            $("html, body").scrollTop((offset.top)-20) 
            
            return false;
        });

        $("[class^=\"popular_item_\"] .category_arr li").hover(function(){
            var idx = $(this).index();
            var parent = $(this).parents(".wrap");
            var contain = parent.find(".popular_all .prd_wrap");
            parent.find(".category_arr li").removeClass("on");
            $(this).addClass("on");

            contain.removeClass("on");
            contain.eq(idx).addClass("on");
            
        })
        /* .frame 안에 .btn 클릭 시*/
        $(".frame .btn").click(function(){
            var $this = $(this);
            var obj = $this.parents(".frame");
            var imgframe = obj.find(".bnr_all");
            var width = imgframe.find("li").width();
            
            if($this.hasClass("prev")){
                imgframe.find(".list:last").clone().show().prependTo( imgframe );
                imgframe.css("marginLeft",-width);
                imgframe.animate( {marginLeft:0}, 'fast' ,'', function(){
                    imgframe.find(".list:last").remove();
                });
            }else{
                imgframe.animate( {marginLeft:-width}, 'fast', '', function(){
                    imgframe.find(".list:first").appendTo( imgframe );
                    imgframe.css("marginLeft",0);
                });
            }
            
            return false;
        })
        
        $(".banner .cnt a").click(function(){
            var img = $(".banner .bnr a");
            var index = $(this).index();
            $(".banner .cnt a").removeClass("on");
            $(this).addClass("on");
            img.hide();
            img.eq(index).show();
            return false;
        })
        
        setInterval(function(){
            if(!$(".banner .cnt .on").next().is("a")){
                $(".banner .cnt a").eq(0).trigger("click");
            }else{
                $(".banner .cnt .on").next().trigger("click");
            }
        },4000)

        
        $(".select_area li").hover(function(){
            var idx = $(this).index();
            var parent = $(this).parent("ul");
            var child_idx = parent.index();
            var thumb = parent.parent().find(".thumb li");
        
            if(child_idx != 1){
                if(child_idx == 2){
                    idx = idx + 4;
                }
                parent.find("li").removeClass("on");
                $(this).addClass("on");
                thumb.removeClass("on")
                thumb.eq(idx).addClass("on");
            }
        })
        
        $(".ctgr_all li a").mouseover(function(){
            var cate = $(this).attr("cate");
            ctgr_layer.show();
            ctgr_layer.find("[class^=\"layer_\"]").hide();
            ctgr_layer.find(".layer_"+cate+"").show();
            ctgr_all.find("a").removeClass("on");
            $(this).addClass("on");
        });


        $(".ctgr_parent").mouseleave(function(){
            if(url!="/index.php"){
                ctgr_parent.hide();	
            }else{
                ctgr_layer.hide();
                ctgr_layer.find("[class^=\"layer_\"]").hide();
            }
            ctgr_all.find("a").removeClass("on");
        });
        
        $(".menu_all").click(function(){
            if(url!="/index.php"){
                ctgr_all.eq(0).trigger("mouseover");
                if(ctgr_parent.is(":visible")){
                    ctgr_parent.hide();	
                }else{
                    ctgr_parent.show();
                }
            }
        });
        
        /* 탑 높이에 따른 .wing의 이동 */
        /* 20221222 요청으로 고정 */
        /* $(window).scroll(function(){
            var wing = $(".wing");
            var scroll = $(window).scrollTop();
            wing.stop();
            wing.animate( { "top" : scroll+260 },300); return false;
        }); */
        
        /* .wing 안에 .btn 클릭시 */
        $(".wing .btn").click(function(){
            var img_ul = $(".wing .list ul");
            var list_img = img_ul.find("li").height();
            var length = img_ul.find("li").length;
            
            if($(this).hasClass("next")){
                img_ul.animate({
                    "margin-top" : "-="+list_img+""
                },function(){
                    img_ul.find("li").eq(0).appendTo(img_ul);
                    img_ul.css("margin-top","0");
                })
            }else{
                img_ul.find("li").eq(length-1).prependTo(img_ul);
                img_ul.css("margin-top",-list_img);
                img_ul.animate({ "margin-top" : "+="+list_img+"" })
            }
            
            return false;
        })
        
        
        $(".wing_tab > li").click(function(){
            var ul = $(".wing_tab").parent().find(".area > ul"); 
            $(".wing_tab > li").removeClass("on");
            $(this).addClass("on");
            ul.removeClass("on");
            ul.eq($(this).index()).addClass("on");
        })
        
        
        /* 전체카테고리 메뉴들 마우스오버시 서브메뉴 나타남 */
        $("#gnb > li").hover(function(){
            $(this).find(".sub_menu").stop(true,true).slideDown();
        },function(){
            $(this).find(".sub_menu").stop(true,true).slideUp();
        })
        
        
        $(".ad_box").each(function(){
            if($(this).find("li").length > 1){
                $(this).find(".arr").addClass("on");

                var ad_ul = $(this).children("ul");
                var ad_li = ad_ul.children("li");
                var len = ad_li.length;
                ad_li.sort(function() {
                    var temp = parseInt(Math.random()*len);
                    var temp1 = parseInt(Math.random()*len);
                    return temp1-temp;
                }).appendTo(ad_ul);
            }
        })
        
        setInterval(function(){
            $(".ad_box .next").trigger("click");
        },5000)

        
        var $handle = $("#custom_handle");
        $("#level_slider").slider({
            max: 300,
            slide: function( event, ui ) {
                var val = ui.value;
                console.log(val)
                //rgba(68, 80, 154, 1)
                /*
                    300 = 23% 69
                    300 = 50% 150
                    300 = 77% 	231
                    300 = 100% 	300
                    rgb(67,79,152) 0%, rgb(123,136,246) 23%, rgb(99,193,45) 50%, rgb(238,223,74) 77%, rgb(229,66,64) 100%
                */
                var  r = 0;// + val;
                var  g = 0;// + val;
                var  b = 0;// + val;
                if(0<=val && val<=69){
                    //console.log("1단계");
                    r = 67+Math.floor(0.78*val);
                    g = 79+Math.floor(0.81*val);
                    b = 152+Math.floor(1.36*val);
                }else if(69<=val && val<=150){
                    //console.log("2단계");
                    val = val - 69;
                    r = 123-Math.floor(1.944*val);
                    g = 136+Math.floor(0.7037*val);
                    b = 246-Math.floor(2.481*val);
                }else if(150<=val && val<=231){
                    //console.log("3단계");
                    val = val - 150;
                    r = 99+Math.floor(1.716*val);
                    g = 193+Math.floor(0.37037*val);
                    b = 45+Math.floor(0.035*val);
                }else if(231<=val && val<=300){
                    //console.log("4단계");
                    val = val - 231;
                    r = 238-Math.floor(0.1304*val);
                    g = 223-Math.floor(2.2753*val);
                    b = 74-Math.floor(0.14492*val);
                }
                //console.log("rgb("+r+","+g+","+b+")")
                $(".color").css("background","rgb("+r+","+g+","+b+")");
                $(".level").html(ui.value);
            }
        });
        /* 부드럽게 흐르는 심플스크롤 */
        $("#scroller").simplyScroll();
    });

    function main_search(word,target){
        document.main_search.main_search.value = word;
        if(target){
            document.main_search.target = target;
        }
        document.main_search.submit();
    }
    /* 전체카테고리 토글 */
    function all_category(){	
        $("#all_category").toggle();
    }
    //------------------------------------------------------
    //---------- 스킨에서 사용되는 자바스크립트 공통 함수 
    //------------------------------------------------------
    // 1. 콤마 찍기
    function fn_comma(str,type){
        str = String(str);
        if (type){    
            return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
        }else{
            var num = Number(str.replace(/,/gi,""));
            if (isNaN(num)){
                return "";
            }
            return num;
        }
    } 
    // 2. 값 입력시 콤마찍기 - onkeyup="fn_comma_input(this)"
    function fn_comma_input(obj) {
        if (obj.value == "") return;
        obj.value = fn_comma(fn_comma(obj.value,false),true);
    }

    // 3. 이용후기, 제품문의에 대한 임시 팝업용 .. 추후 커뮤니티가 개발되면 그쪽으로 링크해야한다.
    function fn_popup_bbs(board,pdno){
        var url = "/shop/popup.html?bo_table="+board+"&pd_no="+pdno;
        var popup = window.open(url, "bbs", "width=800,height=600,status=no,toolbar=no,menubar=no,location=no");
        popup.focus();
    }

    // 4. 무이자, 대량구매 등 각종 팝업
    function fn_open_etc(type){
        var url = "/shop/popup.html?type="+type;
        var option = "height=950, width=680";
        if(type.indexOf("data") != -1){
            option = "height=878, width=400";
        }else if(type == "member"){
            option = "height=380, width=800";
        }
        var popup = window.open(url, "etc", ""+option+",status=no,toolbar=no,menubar=no,location=no");
    }

    //5. 이미지 확대보기 팝업
    function fn_open_zoom(num){
        var url = "/shop/zoom.html?pd_no="+num;
        var popup = window.open(url, "zoom", "height=685, width=620,status=no,toolbar=no,menubar=no,location=no");
    }

    //6. 검색어 자동완성
    function fn_suggestions(search_call,search_word) {
        $("#id_suggestions > ul").html("");		
        if (search_word.length === 0) {
            $("#id_suggestions").hide();
            return;
        }
        $.ajax({
            url: "search_suggestions.php",
            data:{
                search_call : search_call,
                search_word : search_word
            },
            success : function(html){
                if (html.length > 1){
                    $("#id_suggestions").show();
                    $("#id_suggestions > ul").html( html );
                }			
            }
        });    
    }

    function fn_suggestions_ok(input,word,parent) {
        var $form = parent;
        input.value = word;
        $form.page.value = 1;
        $form.suggestions.value = "Y";
        $form.submit();
        $("#id_suggestions").hide();
        
    }


    function goViewEst(sep,sn){
        var form = $("#viewform");
        var target = "";
        if(sep=="au"){
            action = "/shop/pc_auction.html";
            
        }else{
            action = "/shop/pc_consult.html";
        }
        $("#sn").attr("name",sep+"_sn").val(sn);
        form.attr("action",action);
        form.submit();
    }

    function get_version_of_IE(){ 
        var word; 
        var agent = navigator.userAgent.toLowerCase(); 
        var name = navigator.appName; 

        // IE old version ( IE 10 or Lower ) 
        if ( name == "Microsoft Internet Explorer" ) word = "msie"; 

        else { 
            // IE 11 
            if ( agent.search("trident") > -1 ) word = "trident/.*rv:"; 
            // Microsoft Edge  
            else if ( agent.search("edge/") > -1 ) word = "edge/"; 
        } 

        return word; 
    } 
    function go_minishop(id,obj){
        var $this = $(obj);
        var get_version = get_version_of_IE();
        if(get_version == "msie"){
            alert("지원되지 않는 브라우져입니다.");
            $this.removeAttr("href");
            return false;
        }else{
            $this.attr({"href":"/minishop.php/"+id+"","target":"_blank"});
        }
        
    }
    $(function(){
        function auto_ticker(){
            /* timer = setTimeout(function(){
                var time = 400;
                $('.ticker li:first-child').animate({
                    marginTop: '-20px'
                },time, function(){
                    var parent_ul = $(this).parent();
                    $(this).detach().appendTo(parent_ul).removeAttr('style');
                    
                });
                auto_ticker();
            }, 2000); */
            $(".ticker").each(function(){
                var time = 400;
                if($(this).hasClass("notice")){
                    time = 900;
                }
                $(this).find("li:first-child").animate({
                    marginTop: '-20px'
                },time, function(){
                    var parent_ul = $(this).parent();
                    $(this).detach().appendTo(parent_ul).removeAttr('style');
                });
            })
        }
        
        $(".ticker li").hover(function(){
            $(this).parent().removeClass("ticker")
        },function(){
            $(this).parent().addClass("ticker")
        })
        
        setInterval(auto_ticker,3000);


        var event_rolling = setInterval(function(){
            $(".wing_box .event .next").trigger("click");
        },5000)


        if($(".pc_estimate.list .ebanner .next").length == 1){
            var timer = setInterval(function(){
                $(".pc_estimate.list .ebanner .next").trigger("click");
            },5000)
        }
        
    })
    </script>

    </head>

    <body>

    <div id="viewport">
        
                        <div class="fixed_banner on" style="background: #f3f5f6">
                <div class="contains">
                                    <a href="/bbs/board.php?bo_table=comm_notice&wr_id=40&page=1&pd_no=&sca=&sfl=&stx=&sst=&sod=&spt=0&page=1" target="_blank"><img src="/data/design/chuchyn_55126_1.jpg"></a>
                </div>
            </div>
            
        
        
        <!-- S:HEADER -->
        <div id="header">
            <div class="wing_box contains" >
                <div class="wing left ">
                                    <ul>
                        <li><a href='http://pf.kakao.com/_huxmZxj' target=''><img src='/data/design/chuchyn_55255_1.png'/></a></li><li><a href='/shop/kings_apply.html' target='_blank'><img src='/data/design/chuchyn_55161_1.jpg'/></a></li><li><a href='/shop/event.html?ev_no=31' target=''><img src='/data/design/chuchyn_51_1.png'/></a></li><li><a href='https://m.youtube.com/watch?v=n8XnR2jYCck' target='_blank'><img src='/data/design/chuchyn_55162_1.png'/></a></li>				</ul>
                </div>
                <div class="wing right ">    
                                    
                    <div class="event commu_box">
                                            <a href="#" class="arr prev" onclick="slide_on(this); return false;">이전</a>
                        <a href="#" class="arr next" onclick="slide_on(this); return false;">다음</a>
                        <ul>
                                                    <li><a href="/shop/log_mainpage.php?param=eJwrtjIzsVLSL87IL9BPLUvNK9HLKMnNsU8ti8/LtzWy4Nr/5vCP@D2Xdr7YfIoLtyolawAUfRyU" target="_blank"><img src="http://www.kjwwang.com/data/cheditor3/2205/165207718362602742.png" title="165207718362602742.png"></a></li>
                                                </ul>					
                    </div>
                
                    
                                
                    <div class="post commu_box">
                        <a href="/shop/postscript_main.html?bo_table=comm_postscript" target="_blank">견적왕 베스트 리뷰</a>
                        <ul>
                                                    <li>
                                <span class="num">1</span>
                                <a href="/bbs/board.php?bo_table=comm_postscript&wr_id=2391&sop=and&sca=&pd_no=&sfl=&stx=&page=1" target="_blank" class="subject">
                                    이쁘고 성능 좋은 화이트 본체 잘 업어 왔습니다~ 							</a>
                                <span class="avg">
                                    <img src="/skin/shop/basic/images/icon/bbs_avg_on.png"><span>*</span>5
                                </span>
                            </li>
                                                    <li>
                                <span class="num">2</span>
                                <a href="/bbs/board.php?bo_table=comm_postscript&wr_id=2390&sop=and&sca=&pd_no=&sfl=&stx=&page=1" target="_blank" class="subject">
                                    대략 7년 만에 구매한 컴퓨터							</a>
                                <span class="avg">
                                    <img src="/skin/shop/basic/images/icon/bbs_avg_on.png"><span>*</span>5
                                </span>
                            </li>
                                                    <li>
                                <span class="num">3</span>
                                <a href="/bbs/board.php?bo_table=comm_postscript&wr_id=2384&sop=and&sca=&pd_no=&sfl=&stx=&page=1" target="_blank" class="subject">
                                    pc 너무 잘 쓰고 있습니다.							</a>
                                <span class="avg">
                                    <img src="/skin/shop/basic/images/icon/bbs_avg_on.png"><span>*</span>5
                                </span>
                            </li>
                                                    <li>
                                <span class="num">4</span>
                                <a href="/bbs/board.php?bo_table=comm_postscript&wr_id=2383&sop=and&sca=&pd_no=&sfl=&stx=&page=1" target="_blank" class="subject">
                                    8년만에 구매한 컴퓨터 							</a>
                                <span class="avg">
                                    <img src="/skin/shop/basic/images/icon/bbs_avg_on.png"><span>*</span>5
                                </span>
                            </li>
                                                    <li>
                                <span class="num">5</span>
                                <a href="/bbs/board.php?bo_table=comm_postscript&wr_id=2382&sop=and&sca=&pd_no=&sfl=&stx=&page=1" target="_blank" class="subject">
                                    취업 후 첫 컴퓨터 구매 후기							</a>
                                <span class="avg">
                                    <img src="/skin/shop/basic/images/icon/bbs_avg_on.png"><span>*</span>5
                                </span>
                            </li>
                                                    <li>
                                <span class="num">6</span>
                                <a href="/bbs/board.php?bo_table=comm_postscript&wr_id=2381&sop=and&sca=&pd_no=&sfl=&stx=&page=1" target="_blank" class="subject">
                                    5년만에 바꾼 컴퓨터 후기							</a>
                                <span class="avg">
                                    <img src="/skin/shop/basic/images/icon/bbs_avg_on.png"><span>*</span>5
                                </span>
                            </li>
                                                    <li>
                                <span class="num">7</span>
                                <a href="/bbs/board.php?bo_table=comm_postscript&wr_id=2379&sop=and&sca=&pd_no=&sfl=&stx=&page=1" target="_blank" class="subject">
                                    감사합니다. 받아서 잘 쓰고 있어요 ~							</a>
                                <span class="avg">
                                    <img src="/skin/shop/basic/images/icon/bbs_avg_on.png"><span>*</span>5
                                </span>
                            </li>
                                                    <li>
                                <span class="num">8</span>
                                <a href="/bbs/board.php?bo_table=comm_postscript&wr_id=2378&sop=and&sca=&pd_no=&sfl=&stx=&page=1" target="_blank" class="subject">
                                    쾌적하게 잘 돌아갑니다 							</a>
                                <span class="avg">
                                    <img src="/skin/shop/basic/images/icon/bbs_avg_on.png"><span>*</span>5
                                </span>
                            </li>
                                                    <li>
                                <span class="num">9</span>
                                <a href="/bbs/board.php?bo_table=comm_postscript&wr_id=2372&sop=and&sca=&pd_no=&sfl=&stx=&page=1" target="_blank" class="subject">
                                    좋아요 감사합니다							</a>
                                <span class="avg">
                                    <img src="/skin/shop/basic/images/icon/bbs_avg_on.png"><span>*</span>5
                                </span>
                            </li>
                                                    <li>
                                <span class="num">10</span>
                                <a href="/bbs/board.php?bo_table=comm_postscript&wr_id=2370&sop=and&sca=&pd_no=&sfl=&stx=&page=1" target="_blank" class="subject">
                                    전역을 앞두고 질렀습니다..							</a>
                                <span class="avg">
                                    <img src="/skin/shop/basic/images/icon/bbs_avg_on.png"><span>*</span>5
                                </span>
                            </li>
                                                    <li>
                                <span class="num">11</span>
                                <a href="/bbs/board.php?bo_table=comm_postscript&wr_id=2369&sop=and&sca=&pd_no=&sfl=&stx=&page=1" target="_blank" class="subject">
                                    굿							</a>
                                <span class="avg">
                                    <img src="/skin/shop/basic/images/icon/bbs_avg_on.png"><span>*</span>5
                                </span>
                            </li>
                                                    <li>
                                <span class="num">12</span>
                                <a href="/bbs/board.php?bo_table=comm_postscript&wr_id=2368&sop=and&sca=&pd_no=&sfl=&stx=&page=1" target="_blank" class="subject">
                                    너무 맘에 들어 버렸습니다							</a>
                                <span class="avg">
                                    <img src="/skin/shop/basic/images/icon/bbs_avg_on.png"><span>*</span>5
                                </span>
                            </li>
                                                    <li>
                                <span class="num">13</span>
                                <a href="/bbs/board.php?bo_table=comm_postscript&wr_id=2366&sop=and&sca=&pd_no=&sfl=&stx=&page=1" target="_blank" class="subject">
                                    잘 받았습니다~							</a>
                                <span class="avg">
                                    <img src="/skin/shop/basic/images/icon/bbs_avg_on.png"><span>*</span>5
                                </span>
                            </li>
                                                    <li>
                                <span class="num">14</span>
                                <a href="/bbs/board.php?bo_table=comm_postscript&wr_id=2364&sop=and&sca=&pd_no=&sfl=&stx=&page=1" target="_blank" class="subject">
                                    5080 달아서 사용하니 아이온2 풀옵션 잘 되네요  감사합니다.							</a>
                                <span class="avg">
                                    <img src="/skin/shop/basic/images/icon/bbs_avg_on.png"><span>*</span>5
                                </span>
                            </li>
                                                    <li>
                                <span class="num">15</span>
                                <a href="/bbs/board.php?bo_table=comm_postscript&wr_id=2362&sop=and&sca=&pd_no=&sfl=&stx=&page=1" target="_blank" class="subject">
                                    와 이런거 잘 안 쓰는데 굿입니다							</a>
                                <span class="avg">
                                    <img src="/skin/shop/basic/images/icon/bbs_avg_on.png"><span>*</span>5
                                </span>
                            </li>
                                                </ul>
                    </div>
                    
                    <div class="gallery commu_box">
                        <a href="/bbs/board.php?bo_table=comm_gallery" target="_blank">견적왕 본체 갤러리</a>
                        <ul>
                                                    <li>
                                <span class="num">1</span>
                                <a href="/bbs/board.php?bo_table=comm_gallery&wr_id=5912&sop=and&sca=&pd_no=&sfl=&stx=&page=1" target="_blank" class="thumb" style="background: url('/data/file/comm_gallery/3695785709_I35WBRzO_20260602_112211.jpg') no-repeat center center; background-size: 100%;"></a>
                                <div class="writer">
                                    <a href="/bbs/board.php?bo_table=comm_gallery&wr_id=5912&sop=and&sca=&pd_no=&sfl=&stx=&page=1" target="_blank" class="subject">
                                                                                라이젠7 9800X3D  컴퓨터  PC견적 갤러리									    							</a>	
                                    <div class='kings kings_row simple'><span class='king_label shop'>견적왕.com</span><span class='name'>플레이몰</span></div>							</div>
                            </li>
                                                    <li>
                                <span class="num">2</span>
                                <a href="/bbs/board.php?bo_table=comm_gallery&wr_id=5911&sop=and&sca=&pd_no=&sfl=&stx=&page=1" target="_blank" class="thumb" style="background: url('/data/file/comm_gallery/3695785709_gFlbdpPU_20260601_163304.jpg') no-repeat center center; background-size: 100%;"></a>
                                <div class="writer">
                                    <a href="/bbs/board.php?bo_table=comm_gallery&wr_id=5911&sop=and&sca=&pd_no=&sfl=&stx=&page=1" target="_blank" class="subject">
                                                                                건담 브레이커 4 (GUNDAM BREAKER 4) 코어 울트라5 시리즈2 245K  + nVIDIA RTX 5060  컴퓨터  PC견적 갤러리									    							</a>	
                                    <div class='kings kings_row simple'><span class='king_label shop'>견적왕.com</span><span class='name'>플레이몰</span></div>							</div>
                            </li>
                                                    <li>
                                <span class="num">3</span>
                                <a href="/bbs/board.php?bo_table=comm_gallery&wr_id=5910&sop=and&sca=&pd_no=&sfl=&stx=&page=1" target="_blank" class="thumb" style="background: url('/data/file/comm_gallery/3695785709_lZM0wefV_20260601_151712.jpg') no-repeat center center; background-size: 100%;"></a>
                                <div class="writer">
                                    <a href="/bbs/board.php?bo_table=comm_gallery&wr_id=5910&sop=and&sca=&pd_no=&sfl=&stx=&page=1" target="_blank" class="subject">
                                                                                데드록 (Deadlock) 코어 울트라7 시리즈2 265KF  + nVIDIA RTX 5060 Ti  컴퓨터  PC견적 갤러리									    							</a>	
                                    <div class='kings kings_row simple'><span class='king_label shop'>견적왕.com</span><span class='name'>플레이몰</span></div>							</div>
                            </li>
                                                </ul>
                        
                        
                    </div>
                    
                    <div class="news commu_box">
                        <a href="/bbs/board.php?bo_table=comm_news" target="_blank">조립 PC 시장 트렌드</a>
                        <ul>
                                                    <li>
                                <a href="/shop/news.html?news=29" target="_blank" class="subject">2026년 5월 컴퓨터 시장 트랜드</a>
                            </li>
                                                    <li>
                                <a href="/bbs/board.php?bo_table=comm_news&wr_id=33&sop=and&sca=&pd_no=&sfl=&stx=&page=1" target="_blank" class="subject">2026년 6월 추천 PC 견적</a>
                            </li>
                                                </ul>
                    </div>
                
                    <div class="ai_consult notebook commu_box">
                        <a href="/shop/pc_workstation_consult.html" target="_blank">AI 서버 견적 상담</a>
                        
                        <ul>
                                                    <li>
                                <span class="num">1</span>
                                <a href="/shop/pc_workstation_consult.html?action=view&co_sn=146&sfl=&search_word=&page=1" target="_blank" class="subject">
                                    AI 추론 및 학습용 데스크탑							</a>
                            </li>
                                                    <li>
                                <span class="num">2</span>
                                <a href="/shop/pc_workstation_consult.html?action=view&co_sn=144&sfl=&search_word=&page=1" target="_blank" class="subject">
                                    AI 자동화 개발용 워크스테이션 견적 요청 (RAM 우선)							</a>
                            </li>
                                                    <li>
                                <span class="num">3</span>
                                <a href="/shop/pc_workstation_consult.html?action=view&co_sn=140&sfl=&search_word=&page=1" target="_blank" class="subject">
                                    AI 연구/개발용							</a>
                            </li>
                                                    <li>
                                <span class="num">4</span>
                                <a href="/shop/pc_workstation_consult.html?action=view&co_sn=139&sfl=&search_word=&page=1" target="_blank" class="subject">
                                    master cam 사용 용도의 컴퓨터 견적 부탁드립니다. 							</a>
                            </li>
                                                    <li>
                                <span class="num">5</span>
                                <a href="/shop/pc_workstation_consult.html?action=view&co_sn=138&sfl=&search_word=&page=1" target="_blank" class="subject">
                                    [6대 견적]Ram 128G 데스크탑 문의							</a>
                            </li>
                                                </ul>
                    </div>

                    
                    <div class="notebook commu_box">
                        <a href="/shop/pc_notebook.html" target="_blank">노트북견적상담</a>
                        
                        <ul>
                            <li>
                                <span class="num tip">tip</span>
                                                            <a href="/shop/pc_notebook.html?action=detail" class="subject" target="_blank">노트북 구매가이드 (2026년 06월)</a>
                            </li>
                                                    <li>
                                <span class="num">1</span>
                                <a href="/shop/pc_notebook.html?action=view&co_sn=337&sfl=&search_word=&page=1" target="_blank" class="subject">
                                    공대 노트북							</a>
                            </li>
                                                    <li>
                                <span class="num">2</span>
                                <a href="/shop/pc_notebook.html?action=view&co_sn=336&sfl=&search_word=&page=1" target="_blank" class="subject">
                                    공대 2학년 노트북 추천 해주세요. 							</a>
                            </li>
                                                    <li>
                                <span class="num">3</span>
                                <a href="/shop/pc_notebook.html?action=view&co_sn=335&sfl=&search_word=&page=1" target="_blank" class="subject">
                                    노트북 구매 처음인데 추천 부탁드립니다!!!							</a>
                            </li>
                                                    <li>
                                <span class="num">4</span>
                                <a href="/shop/pc_notebook.html?action=view&co_sn=334&sfl=&search_word=&page=1" target="_blank" class="subject">
                                    음악작업용 노트북 추천 부탁드립니다!							</a>
                            </li>
                                                    <li>
                                <span class="num">5</span>
                                <a href="/shop/pc_notebook.html?action=view&co_sn=333&sfl=&search_word=&page=1" target="_blank" class="subject">
                                    프리미어 프로, 캡컷, 게이밍 용도로 사용할 노트북							</a>
                            </li>
                                                </ul>
                    </div>
                    
                    <div class="game commu_box">
                        <a href="/shop/pc_estimate.html?action=game" target="_blank">게임별 사양 및 추천 컴퓨터 견적</a>
                        <ul>
                                                    <li>
                                <span class="num">1</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=569" target="_blank" class="subject">APEX 레전드</a>
                            </li>
                                                    <li>
                                <span class="num">2</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2084" target="_blank" class="subject">Dragon Ball Sparking Zero</a>
                            </li>
                                                    <li>
                                <span class="num">3</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1948" target="_blank" class="subject">EA SPORTS FC™ 25</a>
                            </li>
                                                    <li>
                                <span class="num">4</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1052" target="_blank" class="subject">FC 24 (피파 24)</a>
                            </li>
                                                    <li>
                                <span class="num">5</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=711" target="_blank" class="subject">GTA5</a>
                            </li>
                                                    <li>
                                <span class="num">6</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2100" target="_blank" class="subject">Metaphor: ReFantazio</a>
                            </li>
                                                    <li>
                                <span class="num">7</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1932" target="_blank" class="subject">NBA 2K25</a>
                            </li>
                                                    <li>
                                <span class="num">8</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=795" target="_blank" class="subject">P의 거짓</a>
                            </li>
                                                    <li>
                                <span class="num">9</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2344" target="_blank" class="subject">shape of dreams (셰이프 오브 드림즈)</a>
                            </li>
                                                    <li>
                                <span class="num">10</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=422" target="_blank" class="subject">W.O.W(월드오브워크레프트)</a>
                            </li>
                                                    <li>
                                <span class="num">11</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2024" target="_blank" class="subject">갓 오브 워 라그나로크</a>
                            </li>
                                                    <li>
                                <span class="num">12</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1800" target="_blank" class="subject">건담 브레이커 4 (GUNDAM BREAKER 4)</a>
                            </li>
                                                    <li>
                                <span class="num">13</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1980" target="_blank" class="subject">건파이어 리본(Gunfire Reborn)</a>
                            </li>
                                                    <li>
                                <span class="num">14</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1668" target="_blank" class="subject">검은 신화: 오공</a>
                            </li>
                                                    <li>
                                <span class="num">15</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=430" target="_blank" class="subject">검은사막</a>
                            </li>
                                                    <li>
                                <span class="num">16</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1984" target="_blank" class="subject">고스트 리콘: 브레이크 포인트</a>
                            </li>
                                                    <li>
                                <span class="num">17</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1464" target="_blank" class="subject">고스트 오브 쓰시마</a>
                            </li>
                                                    <li>
                                <span class="num">18</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1164" target="_blank" class="subject">그랑블루 판타지 리링크</a>
                            </li>
                                                    <li>
                                <span class="num">19</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2320" target="_blank" class="subject">나 혼자만 레벨업 : ARISE OVERDRIVE</a>
                            </li>
                                                    <li>
                                <span class="num">20</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1420" target="_blank" class="subject">나 혼자만 레벨업:어라이즈</a>
                            </li>
                                                    <li>
                                <span class="num">21</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2356" target="_blank" class="subject">나라카: 블레이드포인트</a>
                            </li>
                                                    <li>
                                <span class="num">22</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1844" target="_blank" class="subject">나인 솔즈 (Nine Sols)</a>
                            </li>
                                                    <li>
                                <span class="num">23</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1356" target="_blank" class="subject">노 레스트 포 더 위키드</a>
                            </li>
                                                    <li>
                                <span class="num">24</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1864" target="_blank" class="subject">노 맨즈 스카이 (No Man‘s Sky)</a>
                            </li>
                                                    <li>
                                <span class="num">25</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2368" target="_blank" class="subject">다잉 라이트: 더 비스트</a>
                            </li>
                                                    <li>
                                <span class="num">26</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1288" target="_blank" class="subject">다크 소울 3</a>
                            </li>
                                                    <li>
                                <span class="num">27</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1011" target="_blank" class="subject">더 파이널스</a>
                            </li>
                                                    <li>
                                <span class="num">28</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=935" target="_blank" class="subject">던전앤파이터</a>
                            </li>
                                                    <li>
                                <span class="num">29</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1476" target="_blank" class="subject">데드 바이 데이라이트</a>
                            </li>
                                                    <li>
                                <span class="num">30</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1300" target="_blank" class="subject">데드 아일랜드 2</a>
                            </li>
                                                    <li>
                                <span class="num">31</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1900" target="_blank" class="subject">데드록 (Deadlock)</a>
                            </li>
                                                    <li>
                                <span class="num">32</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2380" target="_blank" class="subject">데몬 엑스 마키나: 타이타닉 사이온</a>
                            </li>
                                                    <li>
                                <span class="num">33</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1236" target="_blank" class="subject">데스티니 가디언즈 2</a>
                            </li>
                                                    <li>
                                <span class="num">34</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1512" target="_blank" class="subject">데이브 더 다이브</a>
                            </li>
                                                    <li>
                                <span class="num">35</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1432" target="_blank" class="subject">도타 2</a>
                            </li>
                                                    <li>
                                <span class="num">36</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2332" target="_blank" class="subject">듄: 어웨이크닝</a>
                            </li>
                                                    <li>
                                <span class="num">37</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1224" target="_blank" class="subject">드래곤즈 도그마 2</a>
                            </li>
                                                    <li>
                                <span class="num">38</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=478" target="_blank" class="subject">디아블로2 레저렉션</a>
                            </li>
                                                    <li>
                                <span class="num">39</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=532" target="_blank" class="subject">디아블로4</a>
                            </li>
                                                    <li>
                                <span class="num">40</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1720" target="_blank" class="subject">디제이맥스 리스펙트 V</a>
                            </li>
                                                    <li>
                                <span class="num">41</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1188" target="_blank" class="subject">딥 락 갤럭틱: 서바이벌</a>
                            </li>
                                                    <li>
                                <span class="num">42</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1200" target="_blank" class="subject">라스트 에포크</a>
                            </li>
                                                    <li>
                                <span class="num">43</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2176" target="_blank" class="subject">락다운 프로토콜</a>
                            </li>
                                                    <li>
                                <span class="num">44</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2144" target="_blank" class="subject">러스트</a>
                            </li>
                                                    <li>
                                <span class="num">45</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=518" target="_blank" class="subject">레드 데드 리뎀션2</a>
                            </li>
                                                    <li>
                                <span class="num">46</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1332" target="_blank" class="subject">레디 오어 낫</a>
                            </li>
                                                    <li>
                                <span class="num">47</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2152" target="_blank" class="subject">레인보우식스 시즈</a>
                            </li>
                                                    <li>
                                <span class="num">48</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1624" target="_blank" class="subject">레전드 오브 모탈(Legend of Mortal)</a>
                            </li>
                                                    <li>
                                <span class="num">49</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1568" target="_blank" class="subject">로드나인</a>
                            </li>
                                                    <li>
                                <span class="num">50</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1076" target="_blank" class="subject">로블록스</a>
                            </li>
                                                    <li>
                                <span class="num">51</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=394" target="_blank" class="subject">로스트아크</a>
                            </li>
                                                    <li>
                                <span class="num">52</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2172" target="_blank" class="subject">루마섬</a>
                            </li>
                                                    <li>
                                <span class="num">53</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=378" target="_blank" class="subject">리그오브레전드</a>
                            </li>
                                                    <li>
                                <span class="num">54</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1796" target="_blank" class="subject">리스크 오브 레인 2 (Risk of Rain 2)</a>
                            </li>
                                                    <li>
                                <span class="num">55</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1152" target="_blank" class="subject">리씰컴퍼니</a>
                            </li>
                                                    <li>
                                <span class="num">56</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1896" target="_blank" class="subject">림버스 컴퍼니 (Limbus Company)</a>
                            </li>
                                                    <li>
                                <span class="num">57</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1324" target="_blank" class="subject">림월드</a>
                            </li>
                                                    <li>
                                <span class="num">58</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1448" target="_blank" class="subject">마비노기</a>
                            </li>
                                                    <li>
                                <span class="num">59</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1260" target="_blank" class="subject">마운트 앤 블레이드 2: 배너로드</a>
                            </li>
                                                    <li>
                                <span class="num">60</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1064" target="_blank" class="subject">마인크래프트</a>
                            </li>
                                                    <li>
                                <span class="num">61</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1404" target="_blank" class="subject">매너 로드</a>
                            </li>
                                                    <li>
                                <span class="num">62</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=947" target="_blank" class="subject">메이플스토리</a>
                            </li>
                                                    <li>
                                <span class="num">63</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1520" target="_blank" class="subject">명조: 워더링 웨이브</a>
                            </li>
                                                    <li>
                                <span class="num">64</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2120" target="_blank" class="subject">몬스터 헌터 와일즈</a>
                            </li>
                                                    <li>
                                <span class="num">65</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1132" target="_blank" class="subject">몬스터 헌터 월드</a>
                            </li>
                                                    <li>
                                <span class="num">66</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=783" target="_blank" class="subject">바이오하자드 RE:4</a>
                            </li>
                                                    <li>
                                <span class="num">67</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=899" target="_blank" class="subject">발더스 게이트3</a>
                            </li>
                                                    <li>
                                <span class="num">68</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=553" target="_blank" class="subject">발로란트</a>
                            </li>
                                                    <li>
                                <span class="num">69</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=362" target="_blank" class="subject">배틀그라운드</a>
                            </li>
                                                    <li>
                                <span class="num">70</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1344" target="_blank" class="subject">백 4 블러드</a>
                            </li>
                                                    <li>
                                <span class="num">71</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1380" target="_blank" class="subject">벨라이트</a>
                            </li>
                                                    <li>
                                <span class="num">72</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2428" target="_blank" class="subject">붉은사막</a>
                            </li>
                                                    <li>
                                <span class="num">73</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2304" target="_blank" class="subject">빈딕투스: 디파잉 페이트</a>
                            </li>
                                                    <li>
                                <span class="num">74</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=971" target="_blank" class="subject">사이버펑크 2077</a>
                            </li>
                                                    <li>
                                <span class="num">75</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2068" target="_blank" class="subject">사일런트 힐 2 (SILENT HILL 2)</a>
                            </li>
                                                    <li>
                                <span class="num">76</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1964" target="_blank" class="subject">새티스 팩토리(Satisfactory)</a>
                            </li>
                                                    <li>
                                <span class="num">77</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1368" target="_blank" class="subject">샌드랜드</a>
                            </li>
                                                    <li>
                                <span class="num">78</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=943" target="_blank" class="subject">서든어택</a>
                            </li>
                                                    <li>
                                <span class="num">79</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2148" target="_blank" class="subject">선즈 오브 더포레스트</a>
                            </li>
                                                    <li>
                                <span class="num">80</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2004" target="_blank" class="subject">소울워커</a>
                            </li>
                                                    <li>
                                <span class="num">81</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1684" target="_blank" class="subject">쉐이프즈 2 (shapez 2)</a>
                            </li>
                                                    <li>
                                <span class="num">82</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=939" target="_blank" class="subject">스타크래프트</a>
                            </li>
                                                    <li>
                                <span class="num">83</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2292" target="_blank" class="subject">스텔라 블레이드</a>
                            </li>
                                                    <li>
                                <span class="num">84</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2180" target="_blank" class="subject">스트리노바</a>
                            </li>
                                                    <li>
                                <span class="num">85</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2256" target="_blank" class="subject">스플릿 픽션</a>
                            </li>
                                                    <li>
                                <span class="num">86</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=639" target="_blank" class="subject">심즈4</a>
                            </li>
                                                    <li>
                                <span class="num">87</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1028" target="_blank" class="subject">쓰론 앤 리버티 (TL)</a>
                            </li>
                                                    <li>
                                <span class="num">88</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1744" target="_blank" class="subject">아레나 브레이크아웃: 인피니티</a>
                            </li>
                                                    <li>
                                <span class="num">89</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2208" target="_blank" class="subject">아머드 코어 6 루비콘의 화염</a>
                            </li>
                                                    <li>
                                <span class="num">90</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1416" target="_blank" class="subject">아스달 연대기 세 개의 세력</a>
                            </li>
                                                    <li>
                                <span class="num">91</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1024" target="_blank" class="subject">아이온</a>
                            </li>
                                                    <li>
                                <span class="num">92</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2392" target="_blank" class="subject">아이온2</a>
                            </li>
                                                    <li>
                                <span class="num">93</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2160" target="_blank" class="subject">아이작의 번제</a>
                            </li>
                                                    <li>
                                <span class="num">94</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2416" target="_blank" class="subject">아크레이더스</a>
                            </li>
                                                    <li>
                                <span class="num">95</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1276" target="_blank" class="subject">아크서바이벌 어센디드</a>
                            </li>
                                                    <li>
                                <span class="num">96</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2196" target="_blank" class="subject">어바우드</a>
                            </li>
                                                    <li>
                                <span class="num">97</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=959" target="_blank" class="subject">어쌔신 크리드 미라지</a>
                            </li>
                                                    <li>
                                <span class="num">98</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2232" target="_blank" class="subject">어쌔신 크리드 섀도우스</a>
                            </li>
                                                    <li>
                                <span class="num">99</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1904" target="_blank" class="subject">에이지 오브 미쏠로지 리톨드</a>
                            </li>
                                                    <li>
                                <span class="num">100</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1920" target="_blank" class="subject">에일 ＆ 테일 태번 (Ale ＆ Tale Tavern)</a>
                            </li>
                                                    <li>
                                <span class="num">101</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1532" target="_blank" class="subject">엘든 링: 황금 나무의 그림자</a>
                            </li>
                                                    <li>
                                <span class="num">102</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=911" target="_blank" class="subject">엘든링</a>
                            </li>
                                                    <li>
                                <span class="num">103</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=406" target="_blank" class="subject">오버워치2</a>
                            </li>
                                                    <li>
                                <span class="num">104</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1104" target="_blank" class="subject">용과 같이 8</a>
                            </li>
                                                    <li>
                                <span class="num">105</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2124" target="_blank" class="subject">워썬더 (WAR THUNDER)</a>
                            </li>
                                                    <li>
                                <span class="num">106</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1776" target="_blank" class="subject">워테일즈(Wartales)</a>
                            </li>
                                                    <li>
                                <span class="num">107</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1248" target="_blank" class="subject">워프레임</a>
                            </li>
                                                    <li>
                                <span class="num">108</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1760" target="_blank" class="subject">워해머 40k 스페이스 마린 2</a>
                            </li>
                                                    <li>
                                <span class="num">109</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1580" target="_blank" class="subject">원스 휴먼(Once Human)</a>
                            </li>
                                                    <li>
                                <span class="num">110</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=565" target="_blank" class="subject">원신</a>
                            </li>
                                                    <li>
                                <span class="num">111</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2156" target="_blank" class="subject">월드오브탱크</a>
                            </li>
                                                    <li>
                                <span class="num">112</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1040" target="_blank" class="subject">이스케이프 프롬 타르코프</a>
                            </li>
                                                    <li>
                                <span class="num">113</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=951" target="_blank" class="subject">이터널리턴</a>
                            </li>
                                                    <li>
                                <span class="num">114</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1116" target="_blank" class="subject">인슈라오디드</a>
                            </li>
                                                    <li>
                                <span class="num">115</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2268" target="_blank" class="subject">인조이</a>
                            </li>
                                                    <li>
                                <span class="num">116</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1328" target="_blank" class="subject">인펙션 프리 존</a>
                            </li>
                                                    <li>
                                <span class="num">117</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1828" target="_blank" class="subject">잇 테익스 투 (It Takes Two)</a>
                            </li>
                                                    <li>
                                <span class="num">118</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1724" target="_blank" class="subject">작혼: 리치 마작</a>
                            </li>
                                                    <li>
                                <span class="num">119</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2220" target="_blank" class="subject">진삼국무쌍 ORIGINS</a>
                            </li>
                                                    <li>
                                <span class="num">120</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=635" target="_blank" class="subject">철권 7</a>
                            </li>
                                                    <li>
                                <span class="num">121</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1128" target="_blank" class="subject">철권 8</a>
                            </li>
                                                    <li>
                                <span class="num">122</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1612" target="_blank" class="subject">카타클리스모(Cataclismo)</a>
                            </li>
                                                    <li>
                                <span class="num">123</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=923" target="_blank" class="subject">카트라이더 : 드리프트</a>
                            </li>
                                                    <li>
                                <span class="num">124</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1728" target="_blank" class="subject">컨커러스 블레이드</a>
                            </li>
                                                    <li>
                                <span class="num">125</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1648" target="_blank" class="subject">컬트 오브 더 램 (Cult of the Lamb)</a>
                            </li>
                                                    <li>
                                <span class="num">126</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1792" target="_blank" class="subject">코어 키퍼(Core Keeper)</a>
                            </li>
                                                    <li>
                                <span class="num">127</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=466" target="_blank" class="subject">콜 오브 듀티 : 모던 워페어 II 2022</a>
                            </li>
                                                    <li>
                                <span class="num">128</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2128" target="_blank" class="subject">콜 오브 듀티 블랙옵스6</a>
                            </li>
                                                    <li>
                                <span class="num">129</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1652" target="_blank" class="subject">크라임 씬 클리너(Crime Scene Cleaner)</a>
                            </li>
                                                    <li>
                                <span class="num">130</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1212" target="_blank" class="subject">크루세이더 킹즈 3</a>
                            </li>
                                                    <li>
                                <span class="num">131</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2280" target="_blank" class="subject">클레르 옵스퀴르 : 33 원정대</a>
                            </li>
                                                    <li>
                                <span class="num">132</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2140" target="_blank" class="subject">클로저스</a>
                            </li>
                                                    <li>
                                <span class="num">133</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2184" target="_blank" class="subject">킹덤 컴 : 딜리버런스 2</a>
                            </li>
                                                    <li>
                                <span class="num">134</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1816" target="_blank" class="subject">킹덤 컴: 딜리버런스</a>
                            </li>
                                                    <li>
                                <span class="num">135</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2064" target="_blank" class="subject">타이니 글레이드 (Tiny Glade)</a>
                            </li>
                                                    <li>
                                <span class="num">136</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1704" target="_blank" class="subject">태양 제국의 죄악 II</a>
                            </li>
                                                    <li>
                                <span class="num">137</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1500" target="_blank" class="subject">토탈워 워해머3</a>
                            </li>
                                                    <li>
                                <span class="num">138</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2000" target="_blank" class="subject">트리 오브 세이비어</a>
                            </li>
                                                    <li>
                                <span class="num">139</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2040" target="_blank" class="subject">파이널 판타지 16</a>
                            </li>
                                                    <li>
                                <span class="num">140</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2060" target="_blank" class="subject">파티 애니멀즈 (Party Animals)</a>
                            </li>
                                                    <li>
                                <span class="num">141</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1880" target="_blank" class="subject">패스 오브 엑자일 2 (Path of Exile 2)</a>
                            </li>
                                                    <li>
                                <span class="num">142</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=887" target="_blank" class="subject">패스 오브 엑자일(P.O.E)</a>
                            </li>
                                                    <li>
                                <span class="num">143</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1088" target="_blank" class="subject">팰월드(Palworld) / 팔월드</a>
                            </li>
                                                    <li>
                                <span class="num">144</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1556" target="_blank" class="subject">퍼스트 디센던트</a>
                            </li>
                                                    <li>
                                <span class="num">145</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2244" target="_blank" class="subject">퍼스트 버서커: 카잔</a>
                            </li>
                                                    <li>
                                <span class="num">146</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1628" target="_blank" class="subject">페르소나 3 리로드</a>
                            </li>
                                                    <li>
                                <span class="num">147</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1636" target="_blank" class="subject">페르소나5 더 로열</a>
                            </li>
                                                    <li>
                                <span class="num">148</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=747" target="_blank" class="subject">포르자 호라이즌5</a>
                            </li>
                                                    <li>
                                <span class="num">149</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1272" target="_blank" class="subject">풋볼매니저 2024</a>
                            </li>
                                                    <li>
                                <span class="num">150</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2008" target="_blank" class="subject">프로스트펑크 2 (Frostpunk 2)</a>
                            </li>
                                                    <li>
                                <span class="num">151</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2056" target="_blank" class="subject">프로젝트 좀보이드 (Project Zomboid)</a>
                            </li>
                                                    <li>
                                <span class="num">152</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2112" target="_blank" class="subject">플래닛 주</a>
                            </li>
                                                    <li>
                                <span class="num">153</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2116" target="_blank" class="subject">플래닛 코스터</a>
                            </li>
                                                    <li>
                                <span class="num">154</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=446" target="_blank" class="subject">피파온라인4</a>
                            </li>
                                                    <li>
                                <span class="num">155</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1516" target="_blank" class="subject">하데스 2</a>
                            </li>
                                                    <li>
                                <span class="num">156</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=2404" target="_blank" class="subject">할로우 나이트</a>
                            </li>
                                                    <li>
                                <span class="num">157</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=1176" target="_blank" class="subject">헬다이버즈2</a>
                            </li>
                                                    <li>
                                <span class="num">158</span>
                                <a href="/shop/pc_estimate.html?action=detail&game=719" target="_blank" class="subject">호그와트 레거시</a>
                            </li>
                                                </ul>
                    </div>
                    
                </div>
            </div>
        
            <div class="header_top">
                <div class="contains clear">
                    <ul class="info">
                        <li><a href="/shop/kings_apply.html" class="btn">견적왕 사이트 소개</a></li>
                        <li>
                            <span class="label label1"><a href="/bbs/board.php?bo_table=comm_notice">공지</a></span>
                            <ul id="" class="notice ticker">
                                                                <li>
                                        <a href="/bbs/board.php?bo_table=comm_notice&wr_id=96&sop=and&sca=&pd_no=&sfl=&stx=&page=1">AI 서버 견적 상담 서비스 오픈!</a>
                                    </li>
                                                                <li>
                                        <a href="/bbs/board.php?bo_table=comm_notice&wr_id=53&sop=and&sca=&pd_no=&sfl=&stx=&page=1">제품 수령 후, 원활한 이용을 위한 가이드</a>
                                    </li>
                                                                <li>
                                        <a href="/bbs/board.php?bo_table=comm_notice&wr_id=40&sop=and&sca=&pd_no=&sfl=&stx=&page=1">카드 무이자 할부안내</a>
                                    </li>
                                                        </ul>
                        </li>		
                    </ul>
                    <ul class="menu">
                                            
                            <li><a href="/bbs/login.php">로그인</a></li>
                            <li><a href="/shop/member.html">회원가입</a></li>					
                            <li><a href="/bbs/login.php?action=nonmember_order_list">주문ㆍ배송조회</a></li>					
                                        </ul>
                </div>
            </div>
            
            <div class="header_bottom on">
                <div class="mid_cont">
                    <div class="contains">
                                            <div class="logo"><a href="/"><img src="/skin/shop/basic/customizing/logo.png?20240206" /></a></div>
                        <div class="search_wrap">
                            <div class="inner">
                                                            <div class="search_form flex">
                                    <div class="form">
                                        <span>상품검색</span>
                                        <form name="main_search" method="post" action="/shop/product_search.html" target="_parent">
                                            <input type="text" name="main_search" class="input" value=""/>
                                            <a href="javascript:document.main_search.submit()" class="search_btn"></a>
                                        </form>    
                                    </div>
                                    <div class="form">
                                        <span>견적서 번호검색</span>
                                        <form name="main_est_search" method="get" action="/shop/pc_estimate.html" target="_parent">
                                            <input type="hidden" name="action" value="view" />
                                            <input type="text" name="search_es_sn" class="input" placeholder="1481" value="" />
                                            <a href="javascript:document.main_est_search.submit()" class="search_btn"></a>
                                        </form>
                                    </div>
                                </div>
                                <!-- <div class="search_word clear">
                                    <ul><li><a href='javascript:main_search("7800X3D")'>7800X3D</a></li><li><a href='javascript:main_search("AMD 5600")'>AMD 5600</a></li><li><a href='javascript:main_search("darkflash")'>darkflash</a></li><li><a href='javascript:main_search("ZOTAC Edge OC")'>ZOTAC Edge OC</a></li></ul>
                                </div> --> 				
                            </div>
                        </div>
                        <div class="board">
                                                    
                            
                            <ul class="notice ticker">
                                <li class="news"><a href="/shop/news.html?news=29" target="_blank" class="subject"><span class="new">N</span>2026년 5월 컴퓨터 시장 트랜드</a></li>
                                <li class="pcest"><a href="/bbs/board.php?bo_table=comm_news&wr_id=33&sop=and&sca=&pd_no=&sfl=&stx=&page=1">2026년 6월 추천 PC 견적</a></li>
                            </ul>
                            
                            <ul class="flex">
                            
                                <li>
                                                                    <a href="/shop/postscript_main.html?bo_table=comm_postscript" class="cnt">1779</a>
                                    <span>구매후기</span>
                                </li>
                                <li>
                                                                    <a href="/shop/pc_consult.html" class="cnt">25201</a>
                                    <span>PC견적상담</span>
                                </li>
                                <li>
                                    <span class="new">N</span>
                                                                    <a href="/shop/pc_workstation_consult.html" class="cnt">131</a>
                                    <span>서버,대량견적상담</span>
                                </li>
                                <li>
                                                                    <a href="/shop/pc_auction.html" class="cnt">17532</a>
                                    <span>역경매</span>
                                </li>
                            
                            </ul>
                            <form id="viewform" name="viewform" method="post">
                                <input type="hidden" name="action" value="view">
                                <input type="hidden" id="sn">
                            </form>
                            
                            <!--  
                                <div class="title">
                                    <span><a href="/shop/pc_auction.html">PC견적 역경매</a>, <a href="/shop/pc_consult.html">PC견적상담</a></span>
                                </div>
                                <div class="contents">
                                    <ul id="ticker" class="ticker">
                                                                            <li>
                                            <a href="#" onclick="goViewEst('au','21667');">
                                                <span class="date">[역경매] </span>
                                                <span class="subject">견적 요청드립니다</span>
                                                <span class="price">0원</span>
                                            </a>
                                        </li>
                                                                            <li>
                                            <a href="#" onclick="goViewEst('au','21666');">
                                                <span class="date">[역경매] </span>
                                                <span class="subject">견적 부탁드립니다.</span>
                                                <span class="price">2,381,660원</span>
                                            </a>
                                        </li>
                                                                            <li>
                                            <a href="#" onclick="goViewEst('au','21665');">
                                                <span class="date">[역경매] </span>
                                                <span class="subject">현금최저가 견적요청합니다!</span>
                                                <span class="price">2,775,450원</span>
                                            </a>
                                        </li>
                                                                            <li>
                                            <a href="#" onclick="goViewEst('co','27791');">
                                                <span class="date">[상담] </span>
                                                <span class="subject">컴퓨터 견적 부탁드려요</span>
                                                <span class="price">0원</span>
                                            </a>
                                        </li>
                                                                            <li>
                                            <a href="#" onclick="goViewEst('co','27790');">
                                                <span class="date">[상담] </span>
                                                <span class="subject">화이트로 맞추고 싶어요</span>
                                                <span class="price">0원</span>
                                            </a>
                                        </li>
                                                                            <li>
                                            <a href="#" onclick="goViewEst('co','27789');">
                                                <span class="date">[상담] </span>
                                                <span class="subject">200만원 미만으로 이렇게 구성해봤는데 이정도면 롤,메이플,오버워치하는데 괜찮을까요?(쇼츠영상도올려서 게임하면서 화면녹화도 합니다)</span>
                                                <span class="price">0원</span>
                                            </a>
                                        </li>
                                                                        </ul>
                                    <form id="viewform" name="viewform" method="post">
                                        <input type="hidden" name="action" value="view">
                                        <input type="hidden" id="sn">
                                    </form>
                                </div>-->
                            
                        </div>
                    </div>
                </div>
                
            
                <nav id="nav">
                    <div class="contains clear">
                        
                        <ul id="gnb">
                            <li><a href="#" onclick="all_category(); return false;">전체 카테고리<i class="fas fa-bars"></i></a></li>
                            <li>
                                <span class="menu_label ml1">컴퓨터 고수의</span>
                                <a href="/shop/pc_estimate.html?action=list">견적서모음</a>
                            </li>
                            <li><a href="/shop/pc_estimate.html?action=game">게임별견적서</a></li>
                            <li><a href="/shop/pc_estimate.html?action=keyword">키워드별견적서</a></li>

                            <li>
                                <span class="menu_label ml2">내가 만드는</span>
                                <a href="/shop/estimatepc.html">PC견적</a>
                            </li>						
                            <li><a href="/shop/pc_consult.html">PC견적QnA</a></li>
                            <li class="popular">
                                <span class="menu_label ml1">뭐살지 고민될때</span>
                                <a href="/shop/pc_estimate.html?action=popular">많이팔린PC&월간추천PC</a>
                            </li>
                            <li><a href="/shop/king_ranking.html">견적맨랭킹</a></li>
                            <li><a href="/shop/brandshop.html">브랜드샵</a></li>
                            <li><a href="/shop/event.html">이벤트</a></li>
                            <li><a href="/bbs/board.php?bo_table=comm_news">읽을거리</a></li>
                            <!-- 						<li><a href="/shop/community.html">커뮤니티</a></li>
                            -->
                            <li><a href="/shop/pc_auction.html">역경매</a></li>						
                        </ul>
                        
                    
                                            <div class="ctgr_parent " style="display: none;">
                            <div class="ctgr_all">
                                <ul>
                                    <li><a href='/shop/pc_game.html'>게임용PC</a></li>
                                    <li><a href='/shop/pc_office.html'>사무용PC</a></li>
                                    <li><a href='/shop/pc_tv.html'>방송용PC</a></li>
                                    <li><a href='/shop/pc_work.html'>워크스테이션</a></li>
                                </ul>
                                <ul>            					
                                                                    <li><a href='/shop/product_list.html?ct_no=2' cate='2'>PC 주요부품</a></li>				
                                    <li><a href='/shop/product_list.html?ct_no=6090' cate='6090'>모니터</a></li>			
                                    <li><a href='/shop/product_list.html?ct_no=6083' cate='6083'>노트북/태블릿</a></li>			
                                    <li><a href='/shop/product_list.html?ct_no=79' cate='79'>PC저장장치</a></li>					
                                    <li><a href='/shop/product_list.html?ct_no=4998' cate='4998'>음향장비</a></li>	
                                    <li><a href='/shop/product_list.html?ct_no=4995' cate='4995'>소프트웨어</a>	</li>				
                                    <li><a href='/shop/product_list.html?ct_no=70' cate='70'>인터넷 장비</a></li>		
                                    <li><a href='/shop/brandshop.html?made=gigabyte'>브랜드샵</a></li>	
                                    <li><a href='/shop/event.html'>이벤트</a></li>	
                                                                </ul>
                            </div>
                            <div class="ctgr_layer" > 						
                                            
                            </div>
                        </div><!-- ctgr_parent -->
                        
                    
                        <div id="all_category" style="display:none;position:absolute;z-index:100; top: 42px;"> 
                            <table width="100%" align="center" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" style="opacity:100;filter:alpha(opacity=100); border-left:1px solid #848484; border-right:1px solid #848484; border-bottom:1px solid #848484; border-top:1px solid #848484;">
                                <tr> 
                                    <td style="padding:0 0 0 0"> 
                                        <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                                            <tr> 
                                                <td width="199" valign=top style="border-right:1px solid #e8e8e8" > 
                                                    <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                                        <tr> 
                                                            <td height="46" bgcolor="#f2f2f2" style="padding:5px 5px 5px 8px; border-bottom:1px solid #d9d9d9"><span style="font-size:14px; font-weight:bold">게임별견적서</span></td>
                                                        </tr>
                                                    </table>
                                                    <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                                        <tr> 
                                                            <td height="25" style="padding:5px 5px 5px 8px; line-height:18px"> 
                                                                <div style="width:100%; height:200px; overflow:auto"> 
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=378'><span>리그오브레전드</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=362'><span>배틀그라운드</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=406'><span>오버워치2</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=446'><span>피파온라인4</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=711'><span>GTA5</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2344'><span>shape of dreams (셰이프 오브 드림즈)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2356'><span>나라카: 블레이드포인트</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2368'><span>다잉 라이트: 더 비스트</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2380'><span>데몬 엑스 마키나: 타이타닉 사이온</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=394'><span>로스트아크</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=553'><span>발로란트</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2428'><span>붉은사막</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2392'><span>아이온2</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2416'><span>아크레이더스</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2404'><span>할로우 나이트</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2084'><span>Dragon Ball Sparking Zero</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1948'><span>EA SPORTS FC™ 25</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2100'><span>Metaphor: ReFantazio</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1932'><span>NBA 2K25</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2024'><span>갓 오브 워 라그나로크</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1980'><span>건파이어 리본(Gunfire Reborn)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1668'><span>검은 신화: 오공</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1984'><span>고스트 리콘: 브레이크 포인트</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2320'><span>나 혼자만 레벨업 : ARISE OVERDRIVE</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1864'><span>노 맨즈 스카이 (No Man‘s Sky)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1900'><span>데드록 (Deadlock)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1512'><span>데이브 더 다이브</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2332'><span>듄: 어웨이크닝</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2176'><span>락다운 프로토콜</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2144'><span>러스트</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2152'><span>레인보우식스 시즈</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1568'><span>로드나인</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2172'><span>루마섬</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1896'><span>림버스 컴퍼니 (Limbus Company)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1520'><span>명조: 워더링 웨이브</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2120'><span>몬스터 헌터 와일즈</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2304'><span>빈딕투스: 디파잉 페이트</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2068'><span>사일런트 힐 2 (SILENT HILL 2)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1964'><span>새티스 팩토리(Satisfactory)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2148'><span>선즈 오브 더포레스트</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2004'><span>소울워커</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2292'><span>스텔라 블레이드</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2180'><span>스트리노바</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2256'><span>스플릿 픽션</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2208'><span>아머드 코어 6 루비콘의 화염</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2160'><span>아이작의 번제</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2196'><span>어바우드</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2232'><span>어쌔신 크리드 섀도우스</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1904'><span>에이지 오브 미쏠로지 리톨드</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1920'><span>에일 ＆ 테일 태번 (Ale ＆ Tale Tavern)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1532'><span>엘든 링: 황금 나무의 그림자</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2124'><span>워썬더 (WAR THUNDER)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2156'><span>월드오브탱크</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2268'><span>인조이</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1828'><span>잇 테익스 투 (It Takes Two)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2220'><span>진삼국무쌍 ORIGINS</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2128'><span>콜 오브 듀티 블랙옵스6</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2280'><span>클레르 옵스퀴르 : 33 원정대</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2140'><span>클로저스</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2184'><span>킹덤 컴 : 딜리버런스 2</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1816'><span>킹덤 컴: 딜리버런스</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2064'><span>타이니 글레이드 (Tiny Glade)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2000'><span>트리 오브 세이비어</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2040'><span>파이널 판타지 16</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2060'><span>파티 애니멀즈 (Party Animals)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1880'><span>패스 오브 엑자일 2 (Path of Exile 2)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1088'><span>팰월드(Palworld) / 팔월드</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1556'><span>퍼스트 디센던트</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2244'><span>퍼스트 버서커: 카잔</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2008'><span>프로스트펑크 2 (Frostpunk 2)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2056'><span>프로젝트 좀보이드 (Project Zomboid)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2112'><span>플래닛 주</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=2116'><span>플래닛 코스터</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1760'><span>워해머 40k 스페이스 마린 2</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1744'><span>아레나 브레이크아웃: 인피니티</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1776'><span>워테일즈(Wartales)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1728'><span>컨커러스 블레이드</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=569'><span>APEX 레전드</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1800'><span>건담 브레이커 4 (GUNDAM BREAKER 4)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=959'><span>어쌔신 크리드 미라지</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1792'><span>코어 키퍼(Core Keeper)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1844'><span>나인 솔즈 (Nine Sols)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1796'><span>리스크 오브 레인 2 (Risk of Rain 2)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1580'><span>원스 휴먼(Once Human)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=565'><span>원신</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=532'><span>디아블로4</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1040'><span>이스케이프 프롬 타르코프</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1652'><span>크라임 씬 클리너(Crime Scene Cleaner)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1628'><span>페르소나 3 리로드</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=719'><span>호그와트 레거시</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1224'><span>드래곤즈 도그마 2</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=899'><span>발더스 게이트3</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1104'><span>용과 같이 8</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1116'><span>인슈라오디드</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=747'><span>포르자 호라이즌5</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=430'><span>검은사막</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1648'><span>컬트 오브 더 램 (Cult of the Lamb)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=783'><span>바이오하자드 RE:4</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1684'><span>쉐이프즈 2 (shapez 2)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=422'><span>W.O.W(월드오브워크레프트)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1636'><span>페르소나5 더 로열</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=466'><span>콜 오브 듀티 : 모던 워페어 II 2022</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1464'><span>고스트 오브 쓰시마</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=478'><span>디아블로2 레저렉션</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1064'><span>마인크래프트</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=911'><span>엘든링</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1724'><span>작혼: 리치 마작</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1612'><span>카타클리스모(Cataclismo)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1476'><span>데드 바이 데이라이트</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=518'><span>레드 데드 리뎀션2</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1720'><span>디제이맥스 리스펙트 V</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1500'><span>토탈워 워해머3</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=971'><span>사이버펑크 2077</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1704'><span>태양 제국의 죄악 II</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1011'><span>더 파이널스</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1516'><span>하데스 2</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=795'><span>P의 거짓</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1332'><span>레디 오어 낫</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1404'><span>매너 로드</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=887'><span>패스 오브 엑자일(P.O.E)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1236'><span>데스티니 가디언즈 2</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1028'><span>쓰론 앤 리버티 (TL)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=635'><span>철권 7</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1128'><span>철권 8</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=923'><span>카트라이더 : 드리프트</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1624'><span>레전드 오브 모탈(Legend of Mortal)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=935'><span>던전앤파이터</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=943'><span>서든어택</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=639'><span>심즈4</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1176'><span>헬다이버즈2</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=947'><span>메이플스토리</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1356'><span>노 레스트 포 더 위키드</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1132'><span>몬스터 헌터 월드</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1276'><span>아크서바이벌 어센디드</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1432'><span>도타 2</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1212'><span>크루세이더 킹즈 3</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1448'><span>마비노기</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1052'><span>FC 24 (피파 24)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=939'><span>스타크래프트</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=951'><span>이터널리턴</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1288'><span>다크 소울 3</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1300'><span>데드 아일랜드 2</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1324'><span>림월드</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1344'><span>백 4 블러드</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1024'><span>아이온</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1152'><span>리씰컴퍼니</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1368'><span>샌드랜드</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1380'><span>벨라이트</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1164'><span>그랑블루 판타지 리링크</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1260'><span>마운트 앤 블레이드 2: 배너로드</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1248'><span>워프레임</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1420'><span>나 혼자만 레벨업:어라이즈</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1328'><span>인펙션 프리 존</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1416'><span>아스달 연대기 세 개의 세력</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1200'><span>라스트 에포크</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1188'><span>딥 락 갤럭틱: 서바이벌</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1272'><span>풋볼매니저 2024</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&game=1076'><span>로블록스</span></a><br/>
                                                                                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <td width="199" valign=top style="border-right:1px solid #e8e8e8" > 
                                                    <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                                        <tr> 
                                                            <td height="46" bgcolor="#f2f2f2" style="padding:5px 5px 5px 8px; border-bottom:1px solid #d9d9d9"><span style="font-size:14px; font-weight:bold">용도별견적서</span></td>
                                                        </tr>
                                                    </table>
                                                    <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                                        <tr> 
                                                            <td height="25" style="padding:5px 5px 5px 8px; line-height:18px"> 
                                                                <div style="width:100%; height:200px; overflow:auto"> 
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=79'><span>인텔 애로우레이크 모음전</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=78'><span>MSI 브랜드 기획전</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=81'><span>게이밍 모니터 삼성 오디세이 합본견적</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=62'><span>게임엔 에즈락 메인보드가 진리</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=64'><span>게임옵션 부스트업은? 라데온 AFMF로!</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=77'><span>라데온 RX 9060 / RX 9070  추천 견적</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=61'><span>모바일 게임을 PC로 즐기는 멀티 앱플레이어 (블루스택,녹스,LD플레이어,뮤뮤,미뮤) 전용</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=80'><span>인텔 B580 그래픽카드 작업용 PC</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=30'><span>초저가사무용 (인터넷+문서)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=37'><span>듀얼모니터 연결가능한 사무용 (인터넷+문서)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=38'><span>개발자용 (프로그래밍+코딩)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=39'><span>웹디자인용 (2D작업+포토샵+가벼운영상편집)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=40'><span>3D디자인용 (3D캐드+3D랜더링+영상편집)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=41'><span>사무용+3D게임 (베그)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=60'><span>AFMF! 라라랜드 PC 견적</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=42'><span>사무용+주식+동영상+맞고,포커,바둑</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=27'><span>딥러닝+머신러닝+워크스테이션</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=43'><span>음악전문가용 (큐베이스,에이블톤)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=71'><span>더 빠르고, 더 화끈하게 WD_BLACK 구매 이벤트</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=55'><span>7600 + RTX 4060 Ti 견적 조합</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=65'><span>스팀 인기 게임 맞춤 PC</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=31'><span>디아블로4</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=25'><span>로아, 배그, 대중적인 3D 게임용</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=44'><span>롤(LOL)+서든+배그+피파</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=16'><span>QHD  오버워치 끝판왕</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=29'><span>롤(LOL)+피파</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=28'><span>발로란트</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=45'><span>고사양스팀게임</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=46'><span>마인크래프트, 로블록스</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=69'><span>ASRock 라데온 RX 7000</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=19'><span>FHD 끝판왕 게임용</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=63'><span>ASRock 메인보드, 안전하게 언더볼팅!</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=47'><span>QHD 끝판왕 게임용</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=48'><span>4K / UHD 끝판왕 게임용</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=76'><span>3만원대 갓성비 어항 케이스</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=74'><span>이것이 바로 게임을 하는 이유! AMD</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=36'><span>디아블로4 원컴방송</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=70'><span>가성비 킹 케이스! 앱코 G30 견적서 모음</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=22'><span>게이밍pc 원컴방송</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=32'><span>개인 원컴방송</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=49'><span>초저가 가정용(동영상+문서+인터넷강의)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=50'><span>가정용(동영상+문서+인터넷강의+맞고,포커,바둑)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=35'><span>가정용 (동영상+문서+인터넷강의+맞고,포커,바둑+주식)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=34'><span>가정용 초중고 교육용 (인터넷강의+문서작업)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=51'><span>부모님 효도컴 (인터넷+동영상+맞고,포커,바둑)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=12'><span>가정용 (넷플릭스+롤)</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=21'><span>[2026년 6월 추천 PC 견적] 9950X3D 가 품절이라고? 대체 후보로 나온 에픽 4585PX AM5 소켓 에픽이라니... 짭제온의 재림!?</span></a><br/>
                                                                                                                                    <a href='/shop/pc_estimate.html?action=detail&keyword=15'><span>화이트 감성 PC 모음전</span></a><br/>
                                                                                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                                                            <td width="199" valign=top style="border-right:1px solid #e8e8e8"> 
                                                    <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                                        <tr> 
                                                            <td height="46" bgcolor="#f2f2f2" style="padding:5px 5px 5px 8px; border-bottom:1px solid #d9d9d9"><span style="font-size:14px; font-weight:bold">모니터/노트북/미니PC</span></td>
                                                        </tr>
                                                    </table>
                                                    <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                                        <tr> 
                                                            <td height="25" style="padding:5px 5px 5px 8px; line-height:18px"> 
                                                                <div style="width:100%; height:200px; overflow:auto"> 
                                                                                                                                    <a href='/shop/product_list.html?ct_no=6090'><span>모니터</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=6091'><span>모니터 주변기기</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=6089'><span>------------------------</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=6083'><span>노트북</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=6084'><span>노트북 액세서리</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=6085'><span>브랜드PC/데스크탑</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=6086'><span>올인원PC</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=6087'><span>미니PC/베어본</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=6088'><span>서버/워크스테이션</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=57342'><span>미니PC</span></a><br/>
                                                                                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                                                            <td width="199" valign=top style="border-right:1px solid #e8e8e8"> 
                                                    <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                                        <tr> 
                                                            <td height="46" bgcolor="#f2f2f2" style="padding:5px 5px 5px 8px; border-bottom:1px solid #d9d9d9"><span style="font-size:14px; font-weight:bold">PC주요부품</span></td>
                                                        </tr>
                                                    </table>
                                                    <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                                        <tr> 
                                                            <td height="25" style="padding:5px 5px 5px 8px; line-height:18px"> 
                                                                <div style="width:100%; height:200px; overflow:auto"> 
                                                                                                                                    <a href='/shop/product_list.html?ct_no=9'><span>CPU</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=11'><span>메인보드</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=10'><span>메모리</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=243'><span>SSD</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=13'><span>데스크탑 HDD</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=14'><span>ODD</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=12'><span>그래픽카드</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=16'><span>케이스</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=15'><span>파워서플라이</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=17'><span>키보드</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=18'><span>마우스</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=7330'><span>키보드+마우스 세트</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=574'><span>CPU쿨러</span></a><br/>
                                                                                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                                                            <td width="199" valign=top style="border-right:1px solid #e8e8e8"> 
                                                    <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                                        <tr> 
                                                            <td height="46" bgcolor="#f2f2f2" style="padding:5px 5px 5px 8px; border-bottom:1px solid #d9d9d9"><span style="font-size:14px; font-weight:bold">PC주변기기/튜닝/멀티미디어</span></td>
                                                        </tr>
                                                    </table>
                                                    <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                                        <tr> 
                                                            <td height="25" style="padding:5px 5px 5px 8px; line-height:18px"> 
                                                                <div style="width:100%; height:200px; overflow:auto"> 
                                                                                                                                    <a href='/shop/product_list.html?ct_no=36'><span>복합기</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=35'><span>프린터.플로터</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=5516'><span>복합기.프린터소모품</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=37'><span>스캐너</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=5747'><span>------------------</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=5731'><span>쿨러.튜닝.조명.액세서리</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=6888'><span>커스텀수랭용품</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=6838'><span>타블렛.액세서리</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=6933'><span>멀티미디어.TV카드.영상편집</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=6573'><span>게이밍헤드셋.스피커.마이크</span></a><br/>
                                                                                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                                                            <td width="199" valign=top style="border-right:1px solid #e8e8e8"> 
                                                    <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                                        <tr> 
                                                            <td height="46" bgcolor="#f2f2f2" style="padding:5px 5px 5px 8px; border-bottom:1px solid #d9d9d9"><span style="font-size:14px; font-weight:bold">PC저장장치</span></td>
                                                        </tr>
                                                    </table>
                                                    <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                                        <tr> 
                                                            <td height="25" style="padding:5px 5px 5px 8px; line-height:18px"> 
                                                                <div style="width:100%; height:200px; overflow:auto"> 
                                                                                                                                    <a href='/shop/product_list.html?ct_no=3548'><span>HDD 복사기</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=3031'><span>네트워크하드(NAS)</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=483'><span>노트북용 HDD</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=8080'><span>서버용 HDD</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=3181'><span>무선 외장 HDD</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=3108'><span>외장 HDD</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=426'><span>외장 SSD</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=80'><span>하드랙.외장케이스</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=2701'><span>USB 메모리</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=3077'><span>OTG USB 메모리</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=3860'><span>플래쉬 메모리/리더기</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=3908'><span>공미디어/보관함</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=3195'><span>저장장치 액세서리</span></a><br/>
                                                                                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                </tr><tr height='0'><td colspan=6></td></tr><tr>    										<td width="199" valign=top style="border-right:1px solid #e8e8e8"> 
                                                    <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                                        <tr> 
                                                            <td height="46" bgcolor="#f2f2f2" style="padding:5px 5px 5px 8px; border-bottom:1px solid #d9d9d9"><span style="font-size:14px; font-weight:bold">PC소모품/사무용품/소프트웨어</span></td>
                                                        </tr>
                                                    </table>
                                                    <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                                        <tr> 
                                                            <td height="25" style="padding:5px 5px 5px 8px; line-height:18px"> 
                                                                <div style="width:100%; height:200px; overflow:auto"> 
                                                                                                                                    <a href='/shop/product_list.html?ct_no=5640'><span>USB액세서리</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=2879'><span>마우스패드</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=5806'><span>키보드 액세서리</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=6071'><span>멀티탭</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=5652'><span>PC액세서리/기타</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=5794'><span>-------------------</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=4995'><span>소프트웨어</span></a><br/>
                                                                                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                                                            <td width="199" valign=top style="border-right:1px solid #e8e8e8"> 
                                                    <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                                        <tr> 
                                                            <td height="46" bgcolor="#f2f2f2" style="padding:5px 5px 5px 8px; border-bottom:1px solid #d9d9d9"><span style="font-size:14px; font-weight:bold">네트워크/케이블/USB/CCTV</span></td>
                                                        </tr>
                                                    </table>
                                                    <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                                        <tr> 
                                                            <td height="25" style="padding:5px 5px 5px 8px; line-height:18px"> 
                                                                <div style="width:100%; height:200px; overflow:auto"> 
                                                                                                                                    <a href='/shop/product_list.html?ct_no=70'><span>공유기/허브/랜카드/PoE</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=6620'><span>CCTV ZONE/리피터</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=6967'><span>USB ZONE/허브.액세서리</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=6968'><span>네트워크장비/주변기기</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=3354'><span>네트워크공구/자재/랙</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=75'><span>KVM스위치/분배기/선택기</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=7234'><span>컨트롤러/확장카드</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=6757'><span>광네트워크/광자재/광케이블</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=7192'><span>케이블/USB.휴대폰.모바일</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=6970'><span>케이블/LAN.데이터.전원.전선</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=6971'><span>케이블/AV(영상.음성)통합관련</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=6972'><span>케이블/영상관련.KVM</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=6973'><span>케이블/음성관련</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=6974'><span>변환케이블/컨버터/젠더/잭.커넥터</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=3670'><span>IDE/SATA/IEEE1394</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=3683'><span>USB</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=52'><span>공사자재/전기용품/UPS</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=47'><span>무선 안테나</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=3705'><span>시리얼/패러럴</span></a><br/>
                                                                                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                                                            <td width="199" valign=top style="border-right:1px solid #e8e8e8"> 
                                                    <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                                        <tr> 
                                                            <td height="46" bgcolor="#f2f2f2" style="padding:5px 5px 5px 8px; border-bottom:1px solid #d9d9d9"><span style="font-size:14px; font-weight:bold">디지털/가전/모바일</span></td>
                                                        </tr>
                                                    </table>
                                                    <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                                        <tr> 
                                                            <td height="25" style="padding:5px 5px 5px 8px; line-height:18px"> 
                                                                <div style="width:100%; height:200px; overflow:auto"> 
                                                                                                                                    <a href='/shop/product_list.html?ct_no=5003'><span>휴대폰 액세서리</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=5825'><span>태블릿/액세서리</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=5117'><span>게임기/타이틀</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=5042'><span>카메라/캠코더용품</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=5826'><span>----------------------</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=4997'><span>영상가전</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=4998'><span>음향가전</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=5133'><span>계절가전</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=4982'><span>생활가전</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=5134'><span>주방가전</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=5129'><span>이미용가전</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=6597'><span>자동차기기</span></a><br/>
                                                                                                                                    <a href='/shop/product_list.html?ct_no=7776'><span>광학기기/용품</span></a><br/>
                                                                                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                                                            <td width="199" valign=top style="border-right:1px solid #e8e8e8"> 
                                                    <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                                        <tr> 
                                                            <td height="46" bgcolor="#f2f2f2" style="padding:5px 5px 5px 8px; border-bottom:1px solid #d9d9d9"><span style="font-size:14px; font-weight:bold">중고/리퍼 존</span></td>
                                                        </tr>
                                                    </table>
                                                    <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                                        <tr> 
                                                            <td height="25" style="padding:5px 5px 5px 8px; line-height:18px"> 
                                                                <div style="width:100%; height:200px; overflow:auto"> 
                                                                                                                                    <a href='/shop/product_list.html?ct_no=8217'><span>중고/리퍼 컴퓨터 부품</span></a><br/>
                                                                                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                    
                                                                                                                            
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        
                            <div>	
                                                        <a href="/shop/log_mainpage.php?param=eJwrtrI0sFLSL87IL9AvKMpPKU0uiU9JLUnMzNHLKMnNsS9Iic/LtzUEAjNDrh33DpyL3/Zm54vNp7iI1KJkDQBTxCU7"><img src="/data/design/chuchyn_57903_2.jpg" ></a>
                            </div>
                        </div><!-- all_category -->
                    
                        
                        
                                        
                    </div>
                </nav><!-- nav -->
            </div>
                
        </div>
        <!-- E:HEADER -->


    <script>
        //상품 삭제 및 변경 (add_part,delete_part,change_part)
        var part = {};					
        //가격비교 정렬기준
        var sort = [['0','0'],['1','1'],['2','2'],['card','rank'],['4','4'],['card','rank'],['6','6'],['card','rank']];	 
        var ai_page = [1,1];
        
        //구성상품별 추천사유 레이어
        var remodal;	
        var remodal_resolution;	
        var remodal_shorts;	

        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        
        $(function(){
            remodal = $('[data-remodal-id=productInfo]').remodal();
            remodal_resolution = $('[data-remodal-id=resolutionInfo]').remodal();
            remodal_shorts = $('[data-remodal-id=shortsInfo]').remodal();
            
            $(".cont_nav li").click(function(){			
                $(this).parent().find("li").removeClass("on");
                $(this).addClass("on");

                var k = $(this).attr("key");
                var v = $(this).attr("val");
                if (v == "card" || v == "cash"){
                    sort[k][0] = v;
                }else{
                    sort[k][1] = v;
                } 						
                fn_get_estimate(k);
            });	

            $(".gname").hover(function(){
                $(this).parent().find(".spec_layer").addClass("on");
            },function(){
                $(".spec_layer").removeClass("on");
            })
            
            $(".shorts").on({
                mouseover: function () {
                    $(".shorts_layer").removeClass("on");
                    $(this).find(".shorts_layer").addClass("on");
                },
                mouseleave: function () {
                    $(".shorts_layer").removeClass("on");
                }
            });
            

            $(".result .more").click(function(){
                var list = $(".result .consult");
                var length = list.length;
                list.slice(2,length).addClass("on");
                $(this).removeClass("on");
            })

            
            /* $(".shorts").mouseover(function(){
                $(".shorts_layer").removeClass("on");
                $(this).find(".shorts_layer").addClass("on");
            }) 
            $(".game .desc li").mouseleave(function(){
                var iframe = $(this).find(".shorts_layer iframe");
                if(iframe.length > 0){
                    iframe[0].contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}','*'); 
                    $(this).find(".shorts_layer").removeClass("on");

                }
            })*/
            
            fn_get_estimate(1);
            fn_get_estimate(2); //견적서 1
            fn_get_estimate(3);	//견적서 1 - 가격비교 
            fn_get_estimate(4); //견적서 2
            fn_get_estimate(5); //견적서 2 - AI 추천
            fn_get_estimate(6); //견적서 3		
            fn_get_estimate(7); //견적서 3 - AI 추천

        });


        var urlAry = [];
        var descAry = [];
        var objAry = {};

        function onYouTubeIframeAPIReady() {
            $.each(urlAry, function(key, val){
                var player;
                var playerId = "shortsLayer_"+key;
                if($("#"+playerId+"").length > 0){
                    player = new YT.Player(playerId, {
                        videoId: urlAry[key],
                        events: {
                            'onReady': onPlayerReady,
                            'onStateChange': onPlayerStateChange
                        }
                    });
                    objAry[key] = player;
                }
                
            })
        }

        function onPlayerReady(event) {
            //openShorts(event); // 플레이영상 클릭시 이벤트 
        }
        
        function onPlayerStateChange(event) {
        
            if(event.data == 1){
                stopVideo(event)
                onYouTubeIframeAPIReadyPopup(event);
            }
            if(event.data == 2){
                
            }
        }

        var popupPlayer;
        var stopTime;
        var firstCall = false;
        var popupDesc;
        //var objAry = [];
        
        function onYouTubeIframeAPIReadyPopup(event){
            var src = event.target.playerInfo.videoData.video_id;
            stopTime = event.target.getCurrentTime();
            popupPlayer = new YT.Player('shortsLayerPopup', {
                videoId: src,
                events: {
                    'onReady': onPlayerReadyPopup,
                    'onStateChange': onPlayerStateChangePopup
                }
            });
            
            var getVal = getKeyByValue(urlAry,src);
            popupDesc = descAry[getVal].replace("<br />",' ');
            
            remodal_shorts.open(); 
        }

        function getKeyByValue(obj, val) {
            return Object.keys(obj).find(key => obj[key] === val);
        }

        function onPlayerReadyPopup(event) {
            // 재생이 중단 된 시점부터 플레이한다.
            // 음소거 여부 popupPlayer.isMuted()
            popupPlayer.seekTo(stopTime);
            
        }

        
        function onPlayerStateChangePopup(event){
            if(event.data == 1){
                
            }
            if(event.data == 2){
                
            }
        }


        $(document).on('opened', '#shortsRemodal', function () {
            $(".shorts_layer").removeClass("on")
            $("#shortsRemodal .contents .desc").html(popupDesc)
            
        });
                
        $(document).on('closed', '#shortsRemodal', function (e) {
            $("#shortsRemodal .contents .media").html("<div id=\"shortsLayerPopup\"></div>");
        });


        function playVideo(event) {
            
        }
        function stopVideo(event) {
            event.target.stopVideo();
        }

        function openShorts(key){
            //var ismobile = "";
            
            objAry[key].playVideo();
        }
        
        
        $(document).on("click",".selected", function(){
            var item = $(this).next();
            var parent = $(this).parent();
            if(item.find(".item").length > 0){
                if(item.is(":visible")){
                    item.slideUp();
                    parent.removeClass("on");
                }else{
                    item.slideDown();
                    parent.addClass("on");
                }
            }			
            return false;
        });


        $(document).on("mouseover",".select_box .item, .box.product .pd_name", function(){
            $(".thumb_layer").removeClass("on");
            $(this).find(".thumb_layer").addClass("on")
        });
        $(document).on("mouseleave",".select_box .item, .box.product .pd_name", function(){
            $(this).find(".thumb_layer").removeClass("on")
        });
        
        function goDelete(f){
            var ans = confirm("정말 삭제 하시겠습니까?");
            if (ans == true){
                f.submit();
            } 
        }

        function goList(){
            $("form.list_box").submit();
        }

        function delete_part(obj,pd_no){
            $this = $(obj);	
            $this.parent().find(".re_select").addClass("on");
            part[pd_no] = 0;
            fn_get_estimate(3);		
        }

        function add_part(obj,pd_no){
            $this = $(obj);	
            part[pd_no] = pd_no;
            $this.parent().removeClass("on");
            fn_get_estimate(3);
        }
        
        function change_part(obj,od_pd_no,new_pd_no,bool_os,img_src){
            $this = $(obj);
            var parent = $this.parents(".select_box");
            var item = parent.find(".item_layer");    
            var price = "";	
            if($this.is("li")){
                name = $this.find(".name").text();
                price = $this.find(".price").text();
                $this.closest("td").next().addClass("on");
            }else{
                name = $this.text();
                $this.closest("td").next().removeClass("on");
            }		
            var thumb = "";
            if(img_src){ 
                thumb = "<img src=\""+img_src+"\" class=\"img\">"; 
            }

            parent.find(".selected > span").html(""+thumb+""+name+"<span class=\"price\">"+price+"</span>");  
            
            if(item.is(":visible")){
                item.slideUp();
                parent.removeClass("on");
            }else{
                item.slideDown();
                parent.addClass("on");
            }	

            var str = parent.next(".btn").attr("onclick");
            var num = str.replace(/[^0-9]/g,'');
            str = str.replace(num, new_pd_no);
            //str = str.replace(od_pd_no, new_pd_no);

            
            parent.next(".btn").attr("onclick", str);
            
            part[od_pd_no] = new_pd_no;
            fn_get_estimate(3);
            if (bool_os){
                fn_get_estimate(5);
                fn_get_estimate(7);
            }    	
        }

        function fn_get_estimate(table){
            //console.log(sort);
            $.ajax({
                url: "/shop/pc_estimate.php",
                method: "POST",
                cache: false, 
                data:{
                    action : "estimate_list_ajax",
                    es_eid : "11221632194-2051549953",
                    c_pdno : "",
                    store_cf_no : "",
                    table : table,					
                    part : part,
                    sort : sort,
                    ai_page : ai_page
                },
                success : function(html){
                    $("#table"+table).html(html);
                    
                    // 견적서 조합 텍스트 (ex, 2번 cpu,메인보드 / 3번 cpu)
                    if(table == 4 || table == 6){
                        var obj = new Object();
                        var arr = [];
                        $("#table"+table+" > tr").each(function(){
                            var part = $(this).children("td:first-child").html();
                            if(part != undefined){
                                arr.push(part);
                                obj[table] = arr;
                            }
                        }) 
                        
                        $.each(obj, function(key,val){
                            var part_comb = val.join("+");
                            $("#part_table_"+key).html(part_comb);
                        })
                    }
                    

                },
                error:function(request,status,error){
                    alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
                }
            });		
        }	

        function fn_ai_refresh(i){
            ai_page[i] ++;					
        }
        
        function fn_order(com_no,pd_no){		
            //alert("구매업체:"+com_no+"\n구매사품:"+pd_no);
            document.odform.com_no.value = com_no;
            document.odform.es_pd_no.value = pd_no;
            document.odform.target = "_blank";
            document.odform.submit();		
        }

        
        function db_detail_view(obj,pd_no){
            var $this = $(obj);
            /* var parent = $this.parents("li");
            var img = parent.find(".thumb").html();
            var name = parent.find(".pd_name").text();
            var spec = parent.find(".spec").text();
            var dbArea = $("#dbSimple");
            
            dbArea.find(".thumb").html(img);
            dbArea.find(".name").text(name);
            dbArea.find(".spec").text(spec); */
            
            remodal.open();
            
            $.ajax({
                url: "/shop/product_detail_db.html",
                method: "POST",
                data:{
                    action : "ajax",
                    pd_no : pd_no
                },
                success : function(html){
                    $("#productRemodal").scrollTop(0)
                    //$("#dbDetail").html(html)
                    $("#productRemodal .contents").html(html)
                },
                error:function(request,status,error){
                    alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
                }
            });		
        }

        function guide_pop(target){
            $("#resolutionRemodal div").removeClass("on");
            $("#resolutionRemodal ."+target+"").addClass("on");
            remodal_resolution.open();
                    
        }

        function searchGallery(company){
            $("#stx").val(company)
            $("#gform").submit();
        }

        function open_share(link){
            var str = "W";
            for (var key in part) {
                str += ","+key + ":" + part[key];
            }
            window.open(link+"&compare_products="+str,'popup','scrollbars=yes, resizable=no, width=1024, height=800');		
        }

        function data_copy(){
            var clip_target= $("#copyUrl");
            clip_target.select();
            try { 
                var successful = document.execCommand('copy');
                if(successful){
                    alert(clip_target.val()+" 복사가 완료되었습니다.");
                }else{
                    alert("다시 시도해주세요.");
                }
            }catch (err) { 
                alert("이 브라우저는 지원하지 않습니다.") 
            }
        }

    </script>

    <form name="odform" method="post" action="/shop/order_estimate.html">
        <input type="hidden" name="action" value="pc_estimate">
        <input type="hidden" name="es_sn" value="16628">
        <input type="hidden" name="com_no">
        <input type="hidden" name="es_pd_no">
    </form>

    <form id="gform" name="gform" method="post" action="/bbs/board.php?bo_table=comm_gallery" target="_blank">
        <input type="hidden" name="sfl" id="sfl" value="wr_name,1" />							
        <input type="hidden" name="stx" id="stx" value="" />							
    </form>

    <link rel="stylesheet" href="/skin/shop/basic/css/font.css?patch=202605125">	
    <div id="content" class="sub">
        <div class="contains">
            <div class="estimate_compare_wrap pc_estimate view">
                <div class="title">
                    <span onclick="goList();">견적맨 견적서</span>
                    <!-- <button class="btn" onclick="goList();">목록보기</button>  -->	
                </div>
                <div class="pc_estimate_view">	
                    <div class="layout comm_bdbox choice ">
                                            <div class="head">
                            <div class="writer">
                                <span>작성자</span>
                                <a href="/minishop.php/koreaanswer" target="_blank">잉여인간17호</a>
                            </div>
                            <div class="detail">
                                <ul>
                                    <li>견적서번호</li>
                                    <li><span class="num">16628</span>번</li>
                                </ul>
                                <span class="date">작성일 <span>25-05-07</span></span>
                                <p class="diff">잉여인간17호(작성자)의<br /><a href="/minishop.php/koreaanswer" target="_blank">다른 견적서 보러가기</a></p>
                            </div>
                        </div>
                        <div class="body">
                            <h1 class="subject">7800X3D + RTX 5060 TI 16GB</h1>
                            <p class="cpu_vga">라이젠7 7800X3D + RTX 5060 Ti 조합
                            <span style="margin-left:12px; color:#c94a4a; font-size:15px; font-weight: bold;">
                                                    </span>
                            </p>
                            <table class="compos_prd_table2">
                                <thead><tr><th>구분</th><th>등급</th><th>세부 부품명</th></tr></thead>
                                <tbody id="table1"></tbody>
                            </table>    			
                        </div>
                    </div> <!-- layout -->
                    
                    
                                
                    
                    <div class="inquiry_box">	
                        <div class="title">
                            <div class='kings kings_cell'><div class='photo'><div class='data'><img src='/data/king/member/mb_icon_277.jpg'></div><span class='king_label swell'>견적왕.com</span></div>
                                <div class='info'><span class='name'>잉여인간17호</span>	<div class='graph_box type2 type comm_graph_box'>
                                        <ul class='layout'>
                                            <li><span class='percent'>34200</span><div class='graph'></div><span class='lv_data'>310</span></li>
                                            <li><span class='percent'>80</span><div class='graph'></div><span class='lv_data'>0</span></li>
                                            <li><span class='percent'>21748</span><div class='graph'></div><span class='lv_data'>197</span></li>
                                            <li><span class='percent'>1248</span><div class='graph'></div><span class='lv_data'>11</span></li>
                                        </ul>
                                    </div>
                                    <a class='link comm_shop_link' href='#' onclick="go_minishop('koreaanswer',this)">미니샵</a>
                                </div></div>						<p><span>잉여인간17호</span>님이 작성하신 견적서 설명입니다.</p>
                            
                            <ul class="site_notice">
                                <li>※ 견적왕에는 견적맨들의 다양한 의견이 있으니 꼼꼼히 비교해보세요.</li>
                                <li><a href="/shop/customer.html?incurl=customer_10.php" target="_blank" class="link">(견적맨 설명 및 유의사항 보기)</a></li>
                            </ul>
                        </div>	
                        <div class="message">
                            <div class="description">
                                <div class="box summary">
                                                                    <h2 class="tit">견적 요약 정리</h2>
                                    <div class="info">
                                        7800X3D + RTX 5060 TI 16GB	
                                    </div>
                                    <div class="detail">
                                        <ul>
                                        <li># 7800X3D + RTX 5060 TI 16GB</li>										
                                        </ul>
                                    </div>
                                                                    
                                    <!--  <p class="tit">견적 요약 정리</p>
                                    <div class="info">
                                        7800X3D + RTX 5060 TI 16GB	
                                    </div>
                                    <div class="detail">
                                        <ul>
                                        <li># 7800X3D + RTX 5060 TI 16GB</li>										
                                        </ul>
                                    </div>-->
                                </div>
                                
                                <div class="detail_description box">
                                    <h2 class="tit">견적서 상세 설명</h2>
                                    <div class="box greeting"><p>퀘이사존, 다나와, 쿨엔에서 활동 중인&nbsp; 잉여인간17호입니다.</p><p>다양한 필테 경력과 컴덕질을 경험삼아 도움 드리고자 합니다.</p><p>어떠한 스폰도 받지 않는 유저 입장에서 직접 사용해보고 테스트한 견적 위주로 견적드리겠습니다.</p></div>
                                    <div class="box product">
                                        <ul>
                                                                                <li class="flex">
                                                <div class="thumb" onclick="db_detail_view(this,'84861');"><img src="/data/pimg/84/84861_600.jpg" /></div>
                                                <div class="info">
                                                    <a href="#" class="pd_name" onclick="db_detail_view(this,'84861'); return false;"><span class="cate">[CPU]</span> AMD 라이젠7-5세대 7800X3D (라파엘) (멀티팩(정품))<div class="thumb_layer"><img src="/data/pimg/84/84861_600.jpg" /></div></a>
                                                    <a href="#" class="btn" onclick="db_detail_view(this,'84861'); return false;">상세보기</a>
                                                    <!-- <p class="spec"></p> -->
                                                </div>
                                            </li>							
                                                                                <li class="flex">
                                                <div class="thumb" onclick="db_detail_view(this,'109304');"><img src="/data/pimg/109/109304_600.jpg" /></div>
                                                <div class="info">
                                                    <a href="#" class="pd_name" onclick="db_detail_view(this,'109304'); return false;"><span class="cate">[메인보드]</span> ASUS TUF Gaming B850M-PLUS WIFI STCOM<div class="thumb_layer"><img src="/data/pimg/109/109304_600.jpg" /></div></a>
                                                    <a href="#" class="btn" onclick="db_detail_view(this,'109304'); return false;">상세보기</a>
                                                    <!-- <p class="spec"></p> -->
                                                </div>
                                            </li>							
                                                                                <li class="flex">
                                                <div class="thumb" onclick="db_detail_view(this,'108256');"><img src="/data/pimg/108/108256_600.jpg" /></div>
                                                <div class="info">
                                                    <a href="#" class="pd_name" onclick="db_detail_view(this,'108256'); return false;"><span class="cate">[메모리]</span> ESSENCORE KLEVV DDR5-5600 CL46 NEO 파인인포 (16GB) x 2 개<div class="thumb_layer"><img src="/data/pimg/108/108256_600.jpg" /></div></a>
                                                    <a href="#" class="btn" onclick="db_detail_view(this,'108256'); return false;">상세보기</a>
                                                    <!-- <p class="spec"></p> -->
                                                </div>
                                            </li>							
                                                                                <li class="flex">
                                                <div class="thumb" onclick="db_detail_view(this,'112369');"><img src="/data/pimg/112/112369_600.jpg" /></div>
                                                <div class="info">
                                                    <a href="#" class="pd_name" onclick="db_detail_view(this,'112369'); return false;"><span class="cate">[그래픽카드]</span> PALIT 지포스 RTX 5060 Ti Infinity 3 D7 16GB 이엠텍<div class="thumb_layer"><img src="/data/pimg/112/112369_600.jpg" /></div></a>
                                                    <a href="#" class="btn" onclick="db_detail_view(this,'112369'); return false;">상세보기</a>
                                                    <!-- <p class="spec"></p> -->
                                                </div>
                                            </li>							
                                                                                <li class="flex">
                                                <div class="thumb" onclick="db_detail_view(this,'107883');"><img src="/data/pimg/107/107883_600.jpg" /></div>
                                                <div class="info">
                                                    <a href="#" class="pd_name" onclick="db_detail_view(this,'107883'); return false;"><span class="cate">[SSD]</span> 솔리다임 P44 Pro M.2 NVMe 벌크 (1TB)<div class="thumb_layer"><img src="/data/pimg/107/107883_600.jpg" /></div></a>
                                                    <a href="#" class="btn" onclick="db_detail_view(this,'107883'); return false;">상세보기</a>
                                                    <!-- <p class="spec"></p> -->
                                                </div>
                                            </li>							
                                                                                <li class="flex">
                                                <div class="thumb" onclick="db_detail_view(this,'99420');"><img src="/data/pimg/99/99420_600.jpg" /></div>
                                                <div class="info">
                                                    <a href="#" class="pd_name" onclick="db_detail_view(this,'99420'); return false;"><span class="cate">[케이스]</span> 마이크로닉스 COOLMAX 스테디 블랙 (미들타워)<div class="thumb_layer"><img src="/data/pimg/99/99420_600.jpg" /></div></a>
                                                    <a href="#" class="btn" onclick="db_detail_view(this,'99420'); return false;">상세보기</a>
                                                    <!-- <p class="spec"></p> -->
                                                </div>
                                            </li>							
                                                                                <li class="flex">
                                                <div class="thumb" onclick="db_detail_view(this,'100197');"><img src="/data/pimg/100/100197_600.jpg" /></div>
                                                <div class="info">
                                                    <a href="#" class="pd_name" onclick="db_detail_view(this,'100197'); return false;"><span class="cate">[파워서플라이]</span> 마이크로닉스 Classic II 풀체인지 700W 80PLUS BRONZE ATX3.1 (PCIE5.1)<div class="thumb_layer"><img src="/data/pimg/100/100197_600.jpg" /></div></a>
                                                    <a href="#" class="btn" onclick="db_detail_view(this,'100197'); return false;">상세보기</a>
                                                    <!-- <p class="spec"></p> -->
                                                </div>
                                            </li>							
                                                                                <li class="flex">
                                                <div class="thumb" onclick="db_detail_view(this,'68150');"><img src="/data/pimg/68/68150_600.jpg" /></div>
                                                <div class="info">
                                                    <a href="#" class="pd_name" onclick="db_detail_view(this,'68150'); return false;"><span class="cate">[CPU쿨러]</span> Thermalright Peerless Assassin 120 SE 서린<div class="thumb_layer"><img src="/data/pimg/68/68150_600.jpg" /></div></a>
                                                    <a href="#" class="btn" onclick="db_detail_view(this,'68150'); return false;">상세보기</a>
                                                    <!-- <p class="spec"></p> -->
                                                </div>
                                            </li>							
                                                                                <li class="flex">
                                                <div class="thumb" onclick="db_detail_view(this,'22757');"><img src="/data/pimg/22/22757_600.jpg" /></div>
                                                <div class="info">
                                                    <a href="#" class="pd_name" onclick="db_detail_view(this,'22757'); return false;"><span class="cate">[조립PC관련]</span> [견적왕] 조립 서비스 + 1년 출장 A/S<div class="thumb_layer"><img src="/data/pimg/22/22757_600.jpg" /></div></a>
                                                    <a href="#" class="btn" onclick="db_detail_view(this,'22757'); return false;">상세보기</a>
                                                    <!-- <p class="spec"></p> -->
                                                </div>
                                            </li>							
                                                                        
                                        </ul>
                                        
                                        <a href="/shop/mypage_consult.html?tab=2&es_sn=16628" class="notify" target="_blank">&nbsp; 혹시 견적에 문제가 있나요? [견적왕에 알리기]</a>
                                        
                                                                            
                                                                            <ul>
                                            <li>CPU는 라이젠 7000번대 3D 모델 주인공인 7800X3D입니다. 순정 상태에서 13900KS를 넘어서는 뛰어난 게임 성능과 뛰어난 전성비가 장점입니다.</li>
    <li>메인보드는 1120A급 드라이버모스펫 구성의 전원부성능 / WIFI, 블루투스 지원 / 공식스펙 상 PCIe5.0 그래픽카드슬롯 적용 / M-ATX 사이즈 / 8레이어 구성 / Q-Release, Q-Antenna, M.2 Q-Latch 등 조립편의성까지 알찬 스펙의 제품인 TUF Gaming B850M-PLUS WIFI입니다.</li>
    <li>그래픽카드는 어떤 게임을 하느냐에 따라 RX 9060 XT 16GB보다 좀 더 뛰어나기도하고 뒤처지는 경우도 있는 RTX 5060 Ti 16GB입니다. VRAM 용량이 16GB이기때문에 8GB 제품 대비 VRAM 사용량이 많은 작업이나 게임에서 좀 더 유리합니다. PALIT RTX 50 시리즈 그래픽카드는 이엠텍에서 유통하고 있어 수입사 고객센터 A/S응대도 좋습니다.</li>
    <li>케이스는 그래픽카드 호환성 355mm로 가격대비 뛰어난 호환성과 TYPE-C 포트를 지원해 편의성도 좋습니다.</li>
    <li>파워서플라이는 마닉의 스테디 셀러 파워입니다.</li>
    <li>CPU쿨러는 대장급 공랭 중 뛰어난 정숙성과 성능을 겸비한 쿨러입니다.</li>
                                        </ul> 
                                                                        </div>
                                    
                                    <div class="box reason"><p><br></p></div>
                                    
                                    
                                    <div class="box office">
                                        <p>기본적인 성능으로는</p>
                                        <ul>
                                        <li> 엑셀+파워포인트+워드+한글 = 문서작업(가성비 위주)</li><li>, 인터넷+맞고+포커+바둑 (간단한 웹게임,가성비 위주)</li><li>, 인터넷 강의</li><li>, 유튜브 저화질</li><li>, 유튜브 고화질</li><li>, 넷플릭스+디즈니플러스+애플tv+왓챠 등등 (컴퓨터에서 tv를 보자)</li><li>, 주식 차트보기 (급하지 않는 매매,가성비 위주)</li><li>, 주식 매매용 (단타에도 랙이 안생기는,성능 위주)</li><li>, 포토샵+2D캐드+사진편집+동영상편집(가성비 위주)</li><li>, 일반 방송 (성능을 크게 요구하지 않는 방송, 가성비 위주)</li><li>, 음악용pc (큐베이스,에이블톤)</li></ul> 등이 가능합니다.
                                    </div>
                                    
                                                
        <div class="box game">
            <script>
                $(function(){
                    $(".game .detail_more").click(function(){
                        var parent = $(this).parent();
                        var total = $(this).attr("data");
                        
                        if(parent.hasClass("hidden")){ // 더보기
                            parent.removeClass("hidden").addClass("visible")
                            if(!parent.hasClass("option")){
                                parent.find("li:nth-child(n+6)").addClass("on")
                            }
                            $(this).find("span").text("접기");
                        }else{ // 닫기
                            parent.removeClass("visible").addClass("hidden")
                            if(!parent.hasClass("option")){
                                parent.find("li").removeClass("on")	
                            }
                            $(this).find("span").text("더보기 (총 "+total+"건)");

                            $(window).scrollTop($(this).offset().top)
                            
                        }
                        
                    })
                })	
            </script>
            <div class="desc">
                <h2 class="tit">게임 성능으로는</h2>
                <!-- <p>게임 성능으로는</p> -->
                
                            
                    <h3><span>FHD 해상도 (1920 X 1080)</span> 로 플레이할 경우</h3>
                    <div class="game_list hidden">
                        <ul>
                                                    <li>
                                - <span class="gname">APEX 레전드</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS: 64-bit Windows 7
    - CPU : AMD FX 4350 or Equivalent, Intel Core i3 6300 or Equivalent
    - 램 : 6GB RAM
    - 하드 : 56GB의 사용 가능한 공간
    - 그래픽 : AMD Radeon™ HD 7730, NVIDIA GeForce® GT 640</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS: 64-bit Windows 7
    - CPU : AMD FX 4350 or Equivalent, Intel Core i3 6300 or Equivalent
    - 램 : 6GB RAM
    - 하드 : 56GB의 사용 가능한 공간
    - 그래픽 : AMD Radeon™ HD 7730, NVIDIA GeForce® GT 640</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">Dragon Ball Sparking Zero</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10
    프로세서: Intel Core i5-9600K / AMD Ryzen 5 2600
    메모리: 8 GB RAM
    그래픽: Nvidia GeForce GTX 980 / AMD Radeon RX 590 / Intel Arc A750
    DirectX: 버전 12
    저장공간: 29 GB 사용 가능 공간
    추가 사항: Estimated performance: 1080p/60fps with graphics settings at "Low". Framerate might drop in graphics-intensive scenes. - 64-bit processor and operating system are required.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10
    프로세서: Intel Core i5-9600K / AMD Ryzen 5 2600
    메모리: 8 GB RAM
    그래픽: Nvidia GeForce GTX 980 / AMD Radeon RX 590 / Intel Arc A750
    DirectX: 버전 12
    저장공간: 29 GB 사용 가능 공간
    추가 사항: Estimated performance: 1080p/60fps with graphics settings at "Low". Framerate might drop in graphics-intensive scenes. - 64-bit processor and operating system are required.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">EA SPORTS FC™ 25</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10 - 64-Bit (Latest Update)
    프로세서: AMD Ryzen 5 1600 or Intel Core i5 6600k
    메모리: 8 GB RAM
    그래픽: AMD RX 570 or Nvidia GTX 1050 Ti
    DirectX: 버전 12
    네트워크: 초고속 인터넷 연결
    저장공간: 100 GB 사용 가능 공간
    사운드카드: DirectX: 12 Compatible video card or equivalent (feature level 12_0)</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10 - 64-Bit (Latest Update)
    프로세서: AMD Ryzen 5 1600 or Intel Core i5 6600k
    메모리: 8 GB RAM
    그래픽: AMD RX 570 or Nvidia GTX 1050 Ti
    DirectX: 버전 12
    네트워크: 초고속 인터넷 연결
    저장공간: 100 GB 사용 가능 공간
    사운드카드: DirectX: 12 Compatible video card or equivalent (feature level 12_0)</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">FC 24 (피파 24)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제: Windows 10 - 64-Bit
    프로세서: Intel Core i5-6600K @ 3.50GHz or AMD Ryzen 5 1600 @ 3.2 GHZ
    메모리: 8 GB RAM
    그래픽: NVIDIA GeForce GTX 1050 Ti 4GB or AMD Radeon RX 570 4GB
    DirectX: 버전 12
    네트워크: 초고속 인터넷 연결
    저장공간: 100 GB 사용 가능 공간
    추가 사항: DirectX: 12 Compatible video card or equivalent (feature level 12_0)</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제: Windows 10 - 64-Bit
    프로세서: Intel Core i5-6600K @ 3.50GHz or AMD Ryzen 5 1600 @ 3.2 GHZ
    메모리: 8 GB RAM
    그래픽: NVIDIA GeForce GTX 1050 Ti 4GB or AMD Radeon RX 570 4GB
    DirectX: 버전 12
    네트워크: 초고속 인터넷 연결
    저장공간: 100 GB 사용 가능 공간
    추가 사항: DirectX: 12 Compatible video card or equivalent (feature level 12_0)</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">GTA5</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- 운영체제: Windows 8.1 64비트, Windows 8 64비트, Windows 7 64비트 서비스 팩 1
    - 프로세서: 인텔 코어 2 쿼드 CPU Q6600 @ 2.40GHz (4 CPU) / AMD Phenom 9850 쿼드코어 프로세서(4 CPU) @ 2.5GHz
    - 메모리: 4 GB RAM
    - 그래픽: NVIDIA 9800 GT 1GB / AMD HD 4870 1GB (DX 10, 10.1, 11)
    - 저장공간: 72 GB 사용 가능 공간
    - 사운드카드: DirectX 10 100% 호환</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- 운영체제: Windows 8.1 64비트, Windows 8 64비트, Windows 7 64비트 서비스 팩 1
    - 프로세서: 인텔 코어 2 쿼드 CPU Q6600 @ 2.40GHz (4 CPU) / AMD Phenom 9850 쿼드코어 프로세서(4 CPU) @ 2.5GHz
    - 메모리: 4 GB RAM
    - 그래픽: NVIDIA 9800 GT 1GB / AMD HD 4870 1GB (DX 10, 10.1, 11)
    - 저장공간: 72 GB 사용 가능 공간
    - 사운드카드: DirectX 10 100% 호환</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">Metaphor: ReFantazio</span> : 상옵으로 100 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10
    프로세서: Intel Core i5-3470 or AMD FX-6300
    메모리: 6 GB RAM
    그래픽: NVIDIA GeForce GTX 750 Ti, 4GB or AMD Radeon R7 360, 4GB or Intel Arc A310, 4GB
    DirectX: 버전 11
    저장공간: 93 GB 사용 가능 공간
    추가 사항: 720p @ 30 FPS. A CPU with AVX support is required.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10
    프로세서: Intel Core i5-3470 or AMD FX-6300
    메모리: 6 GB RAM
    그래픽: NVIDIA GeForce GTX 750 Ti, 4GB or AMD Radeon R7 360, 4GB or Intel Arc A310, 4GB
    DirectX: 버전 11
    저장공간: 93 GB 사용 가능 공간
    추가 사항: 720p @ 30 FPS. A CPU with AVX support is required.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">NBA 2K25</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10 64-Bit (latest update)
    프로세서: Intel® Core™ i3-9100 or AMD Ryzen™ 3 1200
    메모리: 8 GB RAM
    그래픽: NVIDIA® GeForce® GTX 960 4 GB or AMD Radeon™ RX 570 4 GB or Intel® Arc™ A580
    DirectX: 버전 12
    네트워크: 초고속 인터넷 연결
    저장공간: 150 GB 사용 가능 공간
    추가 사항: SSD 필요. 듀얼 아날로그 게임패드 권장. 초기 설치에는 Steam 인증을 위한 일회성 인터넷 연결이 필요하며, 필요한 소프트웨어 설치(게임에 포함됨)에는 DirectX 및 Visual C++ Redistributable 2019가 포함됩니다. PC에서 NBA 2K25를 플레이하려면 AVX2를 지원하는 프로세서와 DirectX 기능 수준 12.0을 지원하는 그래픽 카드가 필요합니다.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10 64-Bit (latest update)
    프로세서: Intel® Core™ i3-9100 or AMD Ryzen™ 3 1200
    메모리: 8 GB RAM
    그래픽: NVIDIA® GeForce® GTX 960 4 GB or AMD Radeon™ RX 570 4 GB or Intel® Arc™ A580
    DirectX: 버전 12
    네트워크: 초고속 인터넷 연결
    저장공간: 150 GB 사용 가능 공간
    추가 사항: SSD 필요. 듀얼 아날로그 게임패드 권장. 초기 설치에는 Steam 인증을 위한 일회성 인터넷 연결이 필요하며, 필요한 소프트웨어 설치(게임에 포함됨)에는 DirectX 및 Visual C++ Redistributable 2019가 포함됩니다. PC에서 NBA 2K25를 플레이하려면 AVX2를 지원하는 프로세서와 DirectX 기능 수준 12.0을 지원하는 그래픽 카드가 필요합니다.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">P의 거짓</span> : 최상옵 + DLSS으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- 운영체제: Windows 10 64bit
    - 프로세서: AMD Ryzen 3 1200／Intel Core i3-6300
    - 메모리: 8 GB RAM
    - 그래픽: AMD Radeon RX 560 4GB / NVIDIA GeForce GTX 960 4GB
    - DirectX: 버전 12
    - 저장공간: 50 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- 운영체제: Windows 10 64bit
    - 프로세서: AMD Ryzen 3 1200／Intel Core i3-6300
    - 메모리: 8 GB RAM
    - 그래픽: AMD Radeon RX 560 4GB / NVIDIA GeForce GTX 960 4GB
    - DirectX: 버전 12
    - 저장공간: 50 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵 &#60; 최상옵 + DLSS</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">shape of dreams (셰이프 오브 드림즈)</span> : 상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS : Windows 10 x64 or newer
    CPU : Intel Core i5-6400 / AMD FX-8320
    램 : 8GB RAM
    하드 : 12GB 사용 가능 공간
    그래픽 : GeForce GTX 960 (2048 MB) / AMD Radeon R9 280 (2048 MB)
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS : Windows 10 x64 or newer
    CPU : Intel Core i5-6400 / AMD FX-8320
    램 : 8GB RAM
    하드 : 12GB 사용 가능 공간
    그래픽 : GeForce GTX 960 (2048 MB) / AMD Radeon R9 280 (2048 MB)
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">W.O.W(월드오브워크레프트)</span> : 상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows® 7 64-bit
    - CPU : 4코어 3.0GHz 프로세서(4th Generation Intel® Core™ Haswell 또는 AMD Ryzen™ Zen)
    - 램 : 8GB RAM
    - 하드 : 128GB 이상의 SSD 여유 공간
    - 그래픽 : DirectX® 12 3GB GPU(NVIDIA® GeForce® GTX 900 시리즈, AMD™ GCN 4th gen 또는 Intel® Iris® Xe Graphics)</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows® 7 64-bit
    - CPU : 4코어 3.0GHz 프로세서(4th Generation Intel® Core™ Haswell 또는 AMD Ryzen™ Zen)
    - 램 : 8GB RAM
    - 하드 : 128GB 이상의 SSD 여유 공간
    - 그래픽 : DirectX® 12 3GB GPU(NVIDIA® GeForce® GTX 900 시리즈, AMD™ GCN 4th gen 또는 Intel® Iris® Xe Graphics)</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">갓 오브 워 라그나로크</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10 64-bit
    프로세서: Intel i5-4670k or AMD Ryzen 3 1200
    메모리: 8 GB RAM
    그래픽: NVIDIA GTX 1060 (6GB) or AMD RX 5500 XT (8GB) or Intel Arc A750
    DirectX: 버전 12
    저장공간: 190 GB 사용 가능 공간
    추가 사항: Windows version 2004 2020-05-27 19041</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10 64-bit
    프로세서: Intel i5-4670k or AMD Ryzen 3 1200
    메모리: 8 GB RAM
    그래픽: NVIDIA GTX 1060 (6GB) or AMD RX 5500 XT (8GB) or Intel Arc A750
    DirectX: 버전 12
    저장공간: 190 GB 사용 가능 공간
    추가 사항: Windows version 2004 2020-05-27 19041</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">건담 브레이커 4 (GUNDAM BREAKER 4)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10
    프로세서: Intel Core i5-2400 / AMD FX-6300
    메모리: 8 GB RAM
    그래픽: Nvidia GeForce GTX 760 / AMD Radeon RX 280 / Intel Arc A380
    DirectX: 버전 11
    저장공간: 14 GB 사용 가능 공간
    추가 사항: ※최대 해상도: 3840x2160
    예상 성능: 그래픽 설정 "낮음"에서 1080p/60fps. 그래픽이 많은 장면에서는 프레임 속도가 떨어질 수 있습니다. - 64비트 프로세서와 운영 체제가 필요합니다.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10
    프로세서: Intel Core i5-2400 / AMD FX-6300
    메모리: 8 GB RAM
    그래픽: Nvidia GeForce GTX 760 / AMD Radeon RX 280 / Intel Arc A380
    DirectX: 버전 11
    저장공간: 14 GB 사용 가능 공간
    추가 사항: ※최대 해상도: 3840x2160
    예상 성능: 그래픽 설정 "낮음"에서 1080p/60fps. 그래픽이 많은 장면에서는 프레임 속도가 떨어질 수 있습니다. - 64비트 프로세서와 운영 체제가 필요합니다.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">건파이어 리본(Gunfire Reborn)</span> : 상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 *: Windows 7
    프로세서: Intel Core i5-6400 / AMD FX-8320
    메모리: 4 GB RAM
    그래픽: GTX 960 / R9 280
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 4 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 *: Windows 7
    프로세서: Intel Core i5-6400 / AMD FX-8320
    메모리: 4 GB RAM
    그래픽: GTX 960 / R9 280
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 4 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">검은 신화: 오공</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 64-bit
    프로세서: Intel Core i5-8400 / AMD Ryzen 5 1600
    메모리: 16 GB RAM
    그래픽: NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 580 8GB
    DirectX: 버전 11
    저장공간: 130 GB 사용 가능 공간
    사운드카드: Windows Compatible Audio Device
    추가 사항: HDD Supported, SSD Recommended. The above specifications were tested with DLSS/FSR/XeSS enabled.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 64-bit
    프로세서: Intel Core i5-8400 / AMD Ryzen 5 1600
    메모리: 16 GB RAM
    그래픽: NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 580 8GB
    DirectX: 버전 11
    저장공간: 130 GB 사용 가능 공간
    사운드카드: Windows Compatible Audio Device
    추가 사항: HDD Supported, SSD Recommended. The above specifications were tested with DLSS/FSR/XeSS enabled.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">검은사막</span> : 리마스터옵으로 100 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : 32비트 또는 64비트의 Win7 또는 그 이상
    - CPU : Intel Core i3
    - 램 : 4GB RAM
    - 하드 : 27GB
    - 그래픽 : GTS 250 / GeForce 9800 GTX / Radeon HD 3870 X2</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : 32비트 또는 64비트의 Win7 또는 그 이상
    - CPU : Intel Core i3
    - 램 : 4GB RAM
    - 하드 : 27GB
    - 그래픽 : GTS 250 / GeForce 9800 GTX / Radeon HD 3870 X2</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵 &#60; 리마스터옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">고스트 리콘: 브레이크 포인트</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10 (64-bit versions only)
    프로세서: AMD Ryzen 3 1200 @3.1 GHz, Intel Core i5 4460 @ 3.2 GHz, or better
    메모리: 8 GB RAM
    그래픽: AMD Radeon R9 280X or NVIDIA GeForce GTX 960 (4 GB VRAM with Shader Model 5.0 or better)
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 67 GB 사용 가능 공간
    추가 사항: originally released for Windows 7, the game can be played on Windows 10 and Windows 11 OS</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10 (64-bit versions only)
    프로세서: AMD Ryzen 3 1200 @3.1 GHz, Intel Core i5 4460 @ 3.2 GHz, or better
    메모리: 8 GB RAM
    그래픽: AMD Radeon R9 280X or NVIDIA GeForce GTX 960 (4 GB VRAM with Shader Model 5.0 or better)
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 67 GB 사용 가능 공간
    추가 사항: originally released for Windows 7, the game can be played on Windows 10 and Windows 11 OS</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">고스트 오브 쓰시마</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>최소:
    64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 64-bit
    프로세서: Intel Core i3-7100 or AMD Ryzen 3 1200
    메모리: 8 GB RAM
    그래픽: NVIDIA GeForce GTX 960 or AMD Radeon RX 5500 XT
    저장공간: 75 GB 사용 가능 공간
    추가 사항: SSD Recommended</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>최소:
    64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 64-bit
    프로세서: Intel Core i3-7100 or AMD Ryzen 3 1200
    메모리: 8 GB RAM
    그래픽: NVIDIA GeForce GTX 960 or AMD Radeon RX 5500 XT
    저장공간: 75 GB 사용 가능 공간
    추가 사항: SSD Recommended</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">그랑블루 판타지 리링크</span> : 중옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>최소:
    64비트 프로세서와 운영 체제가 필요합니다
    운영체제: Windows® 10 (64bit 필수)
    프로세서: Intel® Core™ i3-9100 / AMD Ryzen™ 3 3200G
    메모리: 16 GB RAM
    그래픽: NVIDIA® GeForce GTX™ 1060 6GB / AMD Radeon™ RX 580 8GB
    DirectX: 버전 11
    저장공간: 90 GB 사용 가능 공간
    추가 사항: SSD 환경 권장 (그래픽 설정의 영상 품질 '표준'으로 1080p/30fps의 게임 플레이가 가능)</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>최소:
    64비트 프로세서와 운영 체제가 필요합니다
    운영체제: Windows® 10 (64bit 필수)
    프로세서: Intel® Core™ i3-9100 / AMD Ryzen™ 3 3200G
    메모리: 16 GB RAM
    그래픽: NVIDIA® GeForce GTX™ 1060 6GB / AMD Radeon™ RX 580 8GB
    DirectX: 버전 11
    저장공간: 90 GB 사용 가능 공간
    추가 사항: SSD 환경 권장 (그래픽 설정의 영상 품질 '표준'으로 1080p/30fps의 게임 플레이가 가능)</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">나 혼자만 레벨업 : ARISE OVERDRIVE</span> : 상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10 이상
    프로세서: Intel Core i5 4460 또는 동급 AMD 프로세서 
    메모리: 8 GB RAM
    그래픽:  NVIDIA GeForce GTX 1050 
    저장 공간 : 20GB 사용 가능 공간
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10 이상
    프로세서: Intel Core i5 4460 또는 동급 AMD 프로세서 
    메모리: 8 GB RAM
    그래픽:  NVIDIA GeForce GTX 1050 
    저장 공간 : 20GB 사용 가능 공간
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">나 혼자만 레벨업:어라이즈</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 (64 비트)
    프로세서: i3 3220 3.3 GHz 또는 동급의 AMD 프로세서
    메모리: 8 GB RAM
    그래픽: NVIDIA® GeForce GTX™ 1050 2GB
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 20 GB 사용 가능 공간
    추가 사항: SSD 사용을 권장 합니다.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 (64 비트)
    프로세서: i3 3220 3.3 GHz 또는 동급의 AMD 프로세서
    메모리: 8 GB RAM
    그래픽: NVIDIA® GeForce GTX™ 1050 2GB
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 20 GB 사용 가능 공간
    추가 사항: SSD 사용을 권장 합니다.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">나라카: 블레이드포인트</span> : 상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS : Windows 10 64-bit
    CPU : Intel i5 4th generation or AMD FX 6300 or equivalent
    램 : 8 GB RAM
    하드 : 20 GB 사용 가능 공간
    그래픽 : NVIDIA GeForce GTX 1050TI or equivalent
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS : Windows 10 64-bit
    CPU : Intel i5 4th generation or AMD FX 6300 or equivalent
    램 : 8 GB RAM
    하드 : 20 GB 사용 가능 공간
    그래픽 : NVIDIA GeForce GTX 1050TI or equivalent
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">나인 솔즈 (Nine Sols)</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10 64bit
    프로세서: AMD Athlon X4 | Intel Core i5 4460
    메모리: 8 GB RAM
    그래픽: Nvidia GTX 950 | AMD R7 370
    DirectX: 버전 11
    저장공간: 15 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10 64bit
    프로세서: AMD Athlon X4 | Intel Core i5 4460
    메모리: 8 GB RAM
    그래픽: Nvidia GTX 950 | AMD R7 370
    DirectX: 버전 11
    저장공간: 15 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">노 레스트 포 더 위키드</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS: Windows 10
    Processor: Intel Core i5-8400 / AMD Ryzen 5 2600
    Memory: 16 GB RAM
    Graphics: Nvidia GeForce GTX 970 / AMD Radeon RX Vega 56
    Storage: 35 GB available space
    Additional Notes: SSD Recommended</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS: Windows 10
    Processor: Intel Core i5-8400 / AMD Ryzen 5 2600
    Memory: 16 GB RAM
    Graphics: Nvidia GeForce GTX 970 / AMD Radeon RX Vega 56
    Storage: 35 GB available space
    Additional Notes: SSD Recommended</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">노 맨즈 스카이 (No Man‘s Sky)</span> : 최상옵으로 100 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10/11 (64-bit versions)
    프로세서: Intel Core i3
    메모리: 8 GB RAM
    그래픽: Nvidia GTX 1060 3GB, AMD RX 470 4GB, Intel UHD graphics 630
    저장공간: 15 GB 사용 가능 공간
    VR 지원: SteamVR</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10/11 (64-bit versions)
    프로세서: Intel Core i3
    메모리: 8 GB RAM
    그래픽: Nvidia GTX 1060 3GB, AMD RX 470 4GB, Intel UHD graphics 630
    저장공간: 15 GB 사용 가능 공간
    VR 지원: SteamVR</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">다잉 라이트: 더 비스트</span> : 상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS : Windows 10 or newer
    CPU : Intel i5-13400F / AMD Ryzen 7 5800X
    램 : 16 GB RAM
    하드 : 70 GB 사용 가능 공간
    그래픽 : NVIDIA GeForce 1060 / AMD Radeon 5500 XT / Intel ARC A750
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS : Windows 10 or newer
    CPU : Intel i5-13400F / AMD Ryzen 7 5800X
    램 : 16 GB RAM
    하드 : 70 GB 사용 가능 공간
    그래픽 : NVIDIA GeForce 1060 / AMD Radeon 5500 XT / Intel ARC A750
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">다크 소울 3</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 *: Windows 7 SP1 64bit, Windows 8.1 64bit Windows 10 64bit
    프로세서: Intel Core i3-2100 / AMD® FX-6300
    메모리: 4 GB RAM
    그래픽: NVIDIA® GeForce GTX 750 Ti / ATI Radeon HD 7950
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 25 GB 사용 가능 공간
    사운드카드: DirectX 11 sound device
    추가 사항: Internet connection required for online play and product activation</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 *: Windows 7 SP1 64bit, Windows 8.1 64bit Windows 10 64bit
    프로세서: Intel Core i3-2100 / AMD® FX-6300
    메모리: 4 GB RAM
    그래픽: NVIDIA® GeForce GTX 750 Ti / ATI Radeon HD 7950
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 25 GB 사용 가능 공간
    사운드카드: DirectX 11 sound device
    추가 사항: Internet connection required for online play and product activation</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">더 파이널스</span> : 중옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>CPU : Intel Core i5-6600K
    AMD Ryzen 5 1600
    RAM : 12 GB RAM
    그래픽카드 : NVIDIA GeForce GTX 1050 Ti
    AMD Radeon RX 580
    API : DirectX 12
    저장공간 : 20GB</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>CPU : Intel Core i5-6600K
    AMD Ryzen 5 1600
    RAM : 12 GB RAM
    그래픽카드 : NVIDIA GeForce GTX 1050 Ti
    AMD Radeon RX 580
    API : DirectX 12
    저장공간 : 20GB</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">던전앤파이터</span> : 상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : 윈도우7 64비트 이상
    - CPU : Intel Pentium Gold 이상 AMD Athlon 이상
    - 램 : 8GB 이상
    - 하드 : SSD 여유공간 40GB 이상
    - 그래픽 : Intel UHD Graphics 610 내장 그래픽 이상 AMD Radeon Vega 3 내장 그래픽 이상</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : 윈도우7 64비트 이상
    - CPU : Intel Pentium Gold 이상 AMD Athlon 이상
    - 램 : 8GB 이상
    - 하드 : SSD 여유공간 40GB 이상
    - 그래픽 : Intel UHD Graphics 610 내장 그래픽 이상 AMD Radeon Vega 3 내장 그래픽 이상</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">데드 바이 데이라이트</span> : 최상옵으로 120 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 64-bit Operating System
    프로세서: Intel Core i3-4170 or AMD FX-8120
    메모리: 8 GB RAM
    그래픽: DX11 Compatible GeForce GTX 460 1GB or AMD HD 6850 1GB
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 50 GB 사용 가능 공간
    사운드카드: DX11 compatible</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 64-bit Operating System
    프로세서: Intel Core i3-4170 or AMD FX-8120
    메모리: 8 GB RAM
    그래픽: DX11 Compatible GeForce GTX 460 1GB or AMD HD 6850 1GB
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 50 GB 사용 가능 공간
    사운드카드: DX11 compatible</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">데드 아일랜드 2</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 : Windows 10
    프로세서 : AMD FX-9590 / Intel Core i7-7700HQ
    메모리 : 10GB
    스토리지 : 70GB
    DirectX :12
    그래픽 카드 : Radeon R9 390X (8192 VRAM) / GeForce GTX 1060 (6144 VRAM)</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 : Windows 10
    프로세서 : AMD FX-9590 / Intel Core i7-7700HQ
    메모리 : 10GB
    스토리지 : 70GB
    DirectX :12
    그래픽 카드 : Radeon R9 390X (8192 VRAM) / GeForce GTX 1060 (6144 VRAM)</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">데드록 (Deadlock)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: 미정
    프로세서: 미정
    그래픽: 미정
    사운드카드: 미정</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: 미정
    프로세서: 미정
    그래픽: 미정
    사운드카드: 미정</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">데몬 엑스 마키나: 타이타닉 사이온</span> : 상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS : Windows 8.1/10
    CPU :  Intel i5-3470 / AMD FX-8300
    램 : 6GB RAM
    하드 : 13GB 사용 가능 공간
    그래픽 : NVIDIA Geforce GTX 660 / Radeon HD7870
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS : Windows 8.1/10
    CPU :  Intel i5-3470 / AMD FX-8300
    램 : 6GB RAM
    하드 : 13GB 사용 가능 공간
    그래픽 : NVIDIA Geforce GTX 660 / Radeon HD7870
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">데스티니 가디언즈 2</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 *: Windows® 7 / Windows® 8.1 / Windows® 10 64-bit (latest Service Pack)
    프로세서: Intel® Core™ i3 3250 3.5 GHz or Intel Pentium G4560 3.5 GHz / AMD FX-4350 4.2 GHz
    메모리: 6 GB RAM
    그래픽: NVIDIA® GeForce® GTX 660 2GB or GTX 1050 2GB / AMD Radeon HD 7850 2GB
    네트워크: 초고속 인터넷 연결
    저장공간: 105 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 *: Windows® 7 / Windows® 8.1 / Windows® 10 64-bit (latest Service Pack)
    프로세서: Intel® Core™ i3 3250 3.5 GHz or Intel Pentium G4560 3.5 GHz / AMD FX-4350 4.2 GHz
    메모리: 6 GB RAM
    그래픽: NVIDIA® GeForce® GTX 660 2GB or GTX 1050 2GB / AMD Radeon HD 7850 2GB
    네트워크: 초고속 인터넷 연결
    저장공간: 105 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">데이브 더 다이브</span> : 최상으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 *: Windows 7 64 bit
    프로세서: Intel Core i3 Dual Core
    메모리: 8 GB RAM
    그래픽: NVIDIA Geforce GTS 450 / AMD Radeon HD 5570
    DirectX: 버전 11
    저장공간: 10 GB 사용 가능 공간
    사운드카드: Windows Compatible Audio Device</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 *: Windows 7 64 bit
    프로세서: Intel Core i3 Dual Core
    메모리: 8 GB RAM
    그래픽: NVIDIA Geforce GTS 450 / AMD Radeon HD 5570
    DirectX: 버전 11
    저장공간: 10 GB 사용 가능 공간
    사운드카드: Windows Compatible Audio Device</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">도타 2</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 *: Windows 7 이상
    프로세서: Intel 또는 AMD 2.8GHz 듀얼 코어 프로세서
    메모리: 4 GB RAM
    그래픽: NVIDIA GeForce 8600/9600GT, ATI/AMD Radeon HD2600/3600
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 60 GB 사용 가능 공간
    사운드카드: DirectX 호환
    * 2024년 1월 1일부터 Steam 클라이언트는 Windows 10 이상 버전만 지원합니다.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 *: Windows 7 이상
    프로세서: Intel 또는 AMD 2.8GHz 듀얼 코어 프로세서
    메모리: 4 GB RAM
    그래픽: NVIDIA GeForce 8600/9600GT, ATI/AMD Radeon HD2600/3600
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 60 GB 사용 가능 공간
    사운드카드: DirectX 호환
    * 2024년 1월 1일부터 Steam 클라이언트는 Windows 10 이상 버전만 지원합니다.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">듄: 어웨이크닝</span> : 상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS : Windows 10 64-bit 이상
    CPU : Intel Core i5-7400 / AMD Ryzen 3 1200
    램 : 16GB RAM
    하드 : 60GB 사용 가능 공간
    그래픽 : NVIDIA GeForce GTX 1060 (6GB) / AMD Radeon 5600XT (6GB)</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS : Windows 10 64-bit 이상
    CPU : Intel Core i5-7400 / AMD Ryzen 3 1200
    램 : 16GB RAM
    하드 : 60GB 사용 가능 공간
    그래픽 : NVIDIA GeForce GTX 1060 (6GB) / AMD Radeon 5600XT (6GB)</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">드래곤즈 도그마 2</span> : 중옵으로 30 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10 (64 bit)/Windows 11 (64 bit)
    프로세서: Intel Core i5 10600 / AMD Ryzen 5 3600
    메모리: 16 GB RAM
    그래픽: NVIDIA GeForce GTX 1070 / AMD Radeon RX 5500 XT with 8GB VRAM
    DirectX: 버전 12
    네트워크: 초고속 인터넷 연결
    추가 사항: 1080p/30fps 게임 플레이가 가능합니다. ※부하가 높은 상황에서는 프레임 속도가 떨어질 수 있습니다. 레이 트레이싱을 사용하려면 NVIDIA GeForce RTX 2080 Ti 또는 AMD Radeon RX 6800 그래픽 카드가 필요합니다.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10 (64 bit)/Windows 11 (64 bit)
    프로세서: Intel Core i5 10600 / AMD Ryzen 5 3600
    메모리: 16 GB RAM
    그래픽: NVIDIA GeForce GTX 1070 / AMD Radeon RX 5500 XT with 8GB VRAM
    DirectX: 버전 12
    네트워크: 초고속 인터넷 연결
    추가 사항: 1080p/30fps 게임 플레이가 가능합니다. ※부하가 높은 상황에서는 프레임 속도가 떨어질 수 있습니다. 레이 트레이싱을 사용하려면 NVIDIA GeForce RTX 2080 Ti 또는 AMD Radeon RX 6800 그래픽 카드가 필요합니다.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">디아블로2 레저렉션</span> : 상옵으로 100 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : 윈도우® 10
    - CPU : 인텔® 코어 i3-3250 또는 AMD FX-4350
    - 램 : 8 GB RAM
    - 하드 : 30 GB
    - 그래픽 : Nvidia GTX 660 또는 AMD Radeon HD 7850</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : 윈도우® 10
    - CPU : 인텔® 코어 i3-3250 또는 AMD FX-4350
    - 램 : 8 GB RAM
    - 하드 : 30 GB
    - 그래픽 : Nvidia GTX 660 또는 AMD Radeon HD 7850</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">디아블로4</span> : 풀옵(DLSS/FSR)으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : 64비트 Windows® 10 버전 1909 이상
    - CPU : Intel® Core™ i5-2500K 또는 AMD™ FX-8350
    - 램 : 8GB RAM
    - 하드 : 여유 공간이 90GB 이상 있는 SDD
    - 그래픽 : NVIDIA® GeForce® GTX 660 또는 AMD Radeon™ R9 280 - DirectX® 12 호환 시스템</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : 64비트 Windows® 10 버전 1909 이상
    - CPU : Intel® Core™ i5-2500K 또는 AMD™ FX-8350
    - 램 : 8GB RAM
    - 하드 : 여유 공간이 90GB 이상 있는 SDD
    - 그래픽 : NVIDIA® GeForce® GTX 660 또는 AMD Radeon™ R9 280 - DirectX® 12 호환 시스템</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 풀옵(DLSS/FSR)</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">디제이맥스 리스펙트 V</span> : 최상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7, 8.1, 10 (64bit)
    프로세서: Intel Core 2 Duo E8400 3.0GHz AMD Athlon 64 X2 6000+ 3.0GHz
    메모리: 4 GB RAM
    그래픽: Nvidia® GTX 460 or AMD HD 5850 or better
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 100 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7, 8.1, 10 (64bit)
    프로세서: Intel Core 2 Duo E8400 3.0GHz AMD Athlon 64 X2 6000+ 3.0GHz
    메모리: 4 GB RAM
    그래픽: Nvidia® GTX 460 or AMD HD 5850 or better
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 100 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">딥 락 갤럭틱: 서바이벌</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영체제: Win 10
    프로세서: Intel i5-4590 or similar
    메모리: 8 GB RAM
    그래픽: Geforce GTX 1050 or similar
    저장공간: 2 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영체제: Win 10
    프로세서: Intel i5-4590 or similar
    메모리: 8 GB RAM
    그래픽: Geforce GTX 1050 or similar
    저장공간: 2 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">라스트 에포크</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 Windows 10 64-bit
    프로세서 Intel Core i5-2500 / AMD FX-4350
    메모리 8 GB RAM
    그래픽 카드 NVIDIA GeForce GTX 660 Ti / AMD Radeon R9 270 with 3 GB+ of VRAM
    API DirectX 11
    저장 공간 20 GB
    추가 사항 SSD 강력 권장</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 Windows 10 64-bit
    프로세서 Intel Core i5-2500 / AMD FX-4350
    메모리 8 GB RAM
    그래픽 카드 NVIDIA GeForce GTX 660 Ti / AMD Radeon R9 270 with 3 GB+ of VRAM
    API DirectX 11
    저장 공간 20 GB
    추가 사항 SSD 강력 권장</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">락다운 프로토콜</span> : 상으로  FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 : Windows 10
    프로세서 : Intel i3-4150 / Ryzen 3 1200
    메모리 : 2GB RAM
    저장공간 : 2GB 사용 가능 공간
    그래픽 : NVIDIA GTX 1050
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 : Windows 10
    프로세서 : Intel i3-4150 / Ryzen 3 1200
    메모리 : 2GB RAM
    저장공간 : 2GB 사용 가능 공간
    그래픽 : NVIDIA GTX 1050
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">러스트</span> : 상으로  FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 : Windows 7 64 비트
    CPU : Intel Core i7-3770 / AMD FX-9590 이상
    RAM : 8GB RAM
    저장공간 : 10GB 여유 공간
    그래픽 카드 : GTX 670 2GB / AMD R9 280
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 : Windows 7 64 비트
    CPU : Intel Core i7-3770 / AMD FX-9590 이상
    RAM : 8GB RAM
    저장공간 : 10GB 여유 공간
    그래픽 카드 : GTX 670 2GB / AMD R9 280
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">레드 데드 리뎀션2</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows 7-Service Pack 1 (6.1.7601)
    - CPU : Intel® Core ™ i5-2500K / AMD FX-6300
    - 램 : 8GB
    - 하드 : 150GB
    - 그래픽 : Nvidia GeForce GTX 770 2GB / AMD Radeon R9280 3GB</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows 7-Service Pack 1 (6.1.7601)
    - CPU : Intel® Core ™ i5-2500K / AMD FX-6300
    - 램 : 8GB
    - 하드 : 150GB
    - 그래픽 : Nvidia GeForce GTX 770 2GB / AMD Radeon R9280 3GB</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>XBOX옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">레디 오어 낫</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 *: 64-bit Windows 7, Windows 8.1, Windows 10
    프로세서: Intel Core i5-4430 / AMD FX-6300
    메모리: 8 GB RAM
    그래픽: NVIDIA GeForce GTX 960 2GB / AMD Radeon R7 370 2GB
    DirectX: 버전 11
    저장공간: 90 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 *: 64-bit Windows 7, Windows 8.1, Windows 10
    프로세서: Intel Core i5-4430 / AMD FX-6300
    메모리: 8 GB RAM
    그래픽: NVIDIA GeForce GTX 960 2GB / AMD Radeon R7 370 2GB
    DirectX: 버전 11
    저장공간: 90 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">레인보우식스 시즈</span> : 상으로  FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 : Windows 10 / 11 64-bit
    CPU : Intel Core i3 560 3.3 GHz or AMD Phenom II X4 945 3.0 GHz
    RAM : 8 GB RAM
    저장공간 : 61 GB 사용 가능 공간
    그래픽 카드 : NVIDIA GeForce GTX 460 or AMD Radeon HD 5870
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 : Windows 10 / 11 64-bit
    CPU : Intel Core i3 560 3.3 GHz or AMD Phenom II X4 945 3.0 GHz
    RAM : 8 GB RAM
    저장공간 : 61 GB 사용 가능 공간
    그래픽 카드 : NVIDIA GeForce GTX 460 or AMD Radeon HD 5870
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">레전드 오브 모탈(Legend of Mortal)</span> : 최상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 or higher
    프로세서: Intel Core i3
    메모리: 8 GB RAM
    그래픽: GeForce® GT1030 or higher
    DirectX: 버전 11
    저장공간: 5 GB 사용 가능 공간
    사운드카드: DirectX compatible
    추가 사항: Recommended resolution 1920x1080</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 or higher
    프로세서: Intel Core i3
    메모리: 8 GB RAM
    그래픽: GeForce® GT1030 or higher
    DirectX: 버전 11
    저장공간: 5 GB 사용 가능 공간
    사운드카드: DirectX compatible
    추가 사항: Recommended resolution 1920x1080</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">로드나인</span> : 상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS: Windows 7(SP+1) 64-bit 이상 / Android 버전 7.0 이상 / iOS 13.0 이상
    CPU: IntelCore i5-6500 2.6Ghz 이상
    램: 8GB 이상
    하드: 50GB SSD 이상
    그래픽: NVIDIA GeForce GTX 960 4GB 이상</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS: Windows 7(SP+1) 64-bit 이상 / Android 버전 7.0 이상 / iOS 13.0 이상
    CPU: IntelCore i5-6500 2.6Ghz 이상
    램: 8GB 이상
    하드: 50GB SSD 이상
    그래픽: NVIDIA GeForce GTX 960 4GB 이상</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">로블록스</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제: Windows 7, 8, 8.1, 10, 11, OS X 10.10 Yosemite 이상
    그래픽 카드: DirectX 10 및 Shader Model 2.0 지원
    프로세서: 1.6GHz 이상 최신 프로세서 (2005~)
    메모리: 1GB
    저장 공간: 20MB
    API: DirectX 10, 11[25], Vulkan[26], Metal[27]
    인터넷: 4-8 Mb/s</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제: Windows 7, 8, 8.1, 10, 11, OS X 10.10 Yosemite 이상
    그래픽 카드: DirectX 10 및 Shader Model 2.0 지원
    프로세서: 1.6GHz 이상 최신 프로세서 (2005~)
    메모리: 1GB
    저장 공간: 20MB
    API: DirectX 10, 11[25], Vulkan[26], Metal[27]
    인터넷: 4-8 Mb/s</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">로스트아크</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows 10권장 (Windows 7 sp1 이상 지원, 64bit 운영체제만 지원)
    - CPU : Intel i3이상 / Ryzen 3이상
    - 램 : 8GB 이상
    - 하드 : 50GB 이상
    - 그래픽 : NVIDIA GeForce GTX 460 혹은 AMD Radeon HD 6850 이상</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows 10권장 (Windows 7 sp1 이상 지원, 64bit 운영체제만 지원)
    - CPU : Intel i3이상 / Ryzen 3이상
    - 램 : 8GB 이상
    - 하드 : 50GB 이상
    - 그래픽 : NVIDIA GeForce GTX 460 혹은 AMD Radeon HD 6850 이상</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">루마섬</span> : 상으로  FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 : Windows 10
    프로세서 : Intel i5
    메모리 : 8 GB 
    저장공간 : 7GB 사용 가능 공간
    그래픽 : NVIDIA GTX 1060
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 : Windows 10
    프로세서 : Intel i5
    메모리 : 8 GB 
    저장공간 : 7GB 사용 가능 공간
    그래픽 : NVIDIA GTX 1060
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">리그오브레전드</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows 7, Windows 8 또는 Windows 10 정품 (x86 32bit 또는 x64)
    - CPU : Intel: Core i3-530 AMD: A6-3650 ARM: 미지원
    - 램 : 2GB
    - 하드 : HDD 16GB 이상
    - 그래픽 : NVidia: GeForce 9600GT AMD: HD 6570 Intel: Intel HD 4600 내장 그래픽 (비디오 메모리 1GB 이상)</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows 7, Windows 8 또는 Windows 10 정품 (x86 32bit 또는 x64)
    - CPU : Intel: Core i3-530 AMD: A6-3650 ARM: 미지원
    - 램 : 2GB
    - 하드 : HDD 16GB 이상
    - 그래픽 : NVidia: GeForce 9600GT AMD: HD 6570 Intel: Intel HD 4600 내장 그래픽 (비디오 메모리 1GB 이상)</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">리스크 오브 레인 2 (Risk of Rain 2)</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 or newer, 64-bit
    프로세서: Intel Core i3-6100 / AMD FX-8350
    메모리: 4 GB RAM
    그래픽: GTX 580 / AMD HD 7870
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 4 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 or newer, 64-bit
    프로세서: Intel Core i3-6100 / AMD FX-8350
    메모리: 4 GB RAM
    그래픽: GTX 580 / AMD HD 7870
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 4 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">리씰컴퍼니</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>시스템 최소 요구 사항
    운영체제 Windows 10
    프로세서 Intel Core i5-7400 CPU @ 3.00GHz ; Shader Model 5
    그래픽 NVIDIA GeForce GTX 1050
    API DirectX 버전 11
    저장 공간 1 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>시스템 최소 요구 사항
    운영체제 Windows 10
    프로세서 Intel Core i5-7400 CPU @ 3.00GHz ; Shader Model 5
    그래픽 NVIDIA GeForce GTX 1050
    API DirectX 버전 11
    저장 공간 1 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">림버스 컴퍼니 (Limbus Company)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10
    프로세서: Intel Core i5
    메모리: 8 GB RAM
    그래픽: GeForce GT 1030
    DirectX: 버전 10
    저장공간: 10 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10
    프로세서: Intel Core i5
    메모리: 8 GB RAM
    그래픽: GeForce GT 1030
    DirectX: 버전 10
    저장공간: 10 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">림월드</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 *: Windows 7
    프로세서: Core 2 Duo
    메모리: 4 GB RAM
    그래픽: Intel HD Graphics 4000 or other shader model 4.0
    저장공간: 1 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 *: Windows 7
    프로세서: Core 2 Duo
    메모리: 4 GB RAM
    그래픽: Intel HD Graphics 4000 or other shader model 4.0
    저장공간: 1 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">마비노기</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS: Windows 7 64bit 이상
    CPU: Intel Core i3 (1세대) 2.5GHz 이상
    램: 4GB 이상
    하드: 10GB 이상
    그래픽: Geforce 8600GT 이상</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS: Windows 7 64bit 이상
    CPU: Intel Core i3 (1세대) 2.5GHz 이상
    램: 4GB 이상
    하드: 10GB 이상
    그래픽: Geforce 8600GT 이상</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">마운트 앤 블레이드 2: 배너로드</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 (64-bit only)
    프로세서: Intel® Core™ i3-8100/AMD Ryzen™ 3 1200
    메모리: 6 GB RAM
    그래픽: Intel® UHD Graphics 630/NVIDIA® GeForce® GTX 660 2GB/AMD Radeon™ HD 7850 2GB
    저장공간: 60 GB 사용 가능 공간
    추가 사항: 통합형 GPU에는 2GB의 시스템 RAM이 추가적으로 필요합니다. 이 예상치는 최종 출시 이후에 변경될 수 있습니다.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 (64-bit only)
    프로세서: Intel® Core™ i3-8100/AMD Ryzen™ 3 1200
    메모리: 6 GB RAM
    그래픽: Intel® UHD Graphics 630/NVIDIA® GeForce® GTX 660 2GB/AMD Radeon™ HD 7850 2GB
    저장공간: 60 GB 사용 가능 공간
    추가 사항: 통합형 GPU에는 2GB의 시스템 RAM이 추가적으로 필요합니다. 이 예상치는 최종 출시 이후에 변경될 수 있습니다.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">마인크래프트</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>CPU: 인텔 코어 i3-3210 3.2 GHz / AMD A8-7600 APU 3.1 GHz 와 동급의 제품
    RAM: 4GB (여유공간 2GB)
    GPU (내장): OpenGL 4.4*가 내장된 인텔 HD Graphics 4000 (아이비브릿지) / AMD 라데온 R5 시리즈 (카베리)
    GPU (외장): OpenGL 4.4가 내장된 Nvidia 지포스 400 Series 또는 AMD 라데온 HD 7000 시리즈
    저장장치: 최소 1GB (게임 파일 자체는 180MB이지만, 맵과 기타 파일을 위한 공간이 필요)
    운영체제:
    - 윈도우: 윈도우 7 이상
    - 매킨토시: OS X 10.9 Maverick
    - 리눅스: 2014년 이후의 모든 배포판
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>CPU: 인텔 코어 i3-3210 3.2 GHz / AMD A8-7600 APU 3.1 GHz 와 동급의 제품
    RAM: 4GB (여유공간 2GB)
    GPU (내장): OpenGL 4.4*가 내장된 인텔 HD Graphics 4000 (아이비브릿지) / AMD 라데온 R5 시리즈 (카베리)
    GPU (외장): OpenGL 4.4가 내장된 Nvidia 지포스 400 Series 또는 AMD 라데온 HD 7000 시리즈
    저장장치: 최소 1GB (게임 파일 자체는 180MB이지만, 맵과 기타 파일을 위한 공간이 필요)
    운영체제:
    - 윈도우: 윈도우 7 이상
    - 매킨토시: OS X 10.9 Maverick
    - 리눅스: 2014년 이후의 모든 배포판
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">매너 로드</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows® 10 (64-bit)
    프로세서: Intel® Core™ i5-4670 (quad-core) / AMD® FX-Series™ FX-4350 (quad-core)
    메모리: 8 GB RAM
    그래픽: NVIDIA® GeForce® GTX 1050 (2 GB) / AMD® Radeon™ RX-460 (4 GB) / Intel® Arc™ A380 (6 GB)
    DirectX: 버전 12
    저장공간: 15 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows® 10 (64-bit)
    프로세서: Intel® Core™ i5-4670 (quad-core) / AMD® FX-Series™ FX-4350 (quad-core)
    메모리: 8 GB RAM
    그래픽: NVIDIA® GeForce® GTX 1050 (2 GB) / AMD® Radeon™ RX-460 (4 GB) / Intel® Arc™ A380 (6 GB)
    DirectX: 버전 12
    저장공간: 15 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">메이플스토리</span> : 상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- 운영체제	최신 업데이트된 Window 7 64비트 이상
    - CPU	Pentium Dual Core급 이상
    - RAM	4GB 이상
    - 하드 디스크	여유공간 20GB 이상
    - 그래픽카드	Geforce 9600 GT / Radeon HD 5670 이상 (Shader 3.0 이상 지원 그래픽카드)
    - DirectX	9.0 이상</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- 운영체제	최신 업데이트된 Window 7 64비트 이상
    - CPU	Pentium Dual Core급 이상
    - RAM	4GB 이상
    - 하드 디스크	여유공간 20GB 이상
    - 그래픽카드	Geforce 9600 GT / Radeon HD 5670 이상 (Shader 3.0 이상 지원 그래픽카드)
    - DirectX	9.0 이상</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">명조: 워더링 웨이브</span> : (최상옵)으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 : Windows10 64비트 
    CPU : intel i5(9세대)/Ryzen 2700 
    그래픽카드 : GTX 1060/RX 570/11세대 intel 내장 그래픽 
    메모리 : 16GB 이상 
    저장 공간 : 25GB, SSD 설치 권장
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 : Windows10 64비트 
    CPU : intel i5(9세대)/Ryzen 2700 
    그래픽카드 : GTX 1060/RX 570/11세대 intel 내장 그래픽 
    메모리 : 16GB 이상 
    저장 공간 : 25GB, SSD 설치 권장
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>(최상옵)</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">몬스터 헌터 와일즈</span> : 상옵으로  FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다. 

    운영체제  Windows 10 64-bit
    프로세서  Intel Core i5 -8400 / AMD Ryzen 5 1600
    메모리  16 GB RAM
    그래픽  NVDIA GeForce GTX 1060 6GB / AMD Radeon RX580 8GB
    DirectX  버전 11
    저장공간  130 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다. 

    운영체제  Windows 10 64-bit
    프로세서  Intel Core i5 -8400 / AMD Ryzen 5 1600
    메모리  16 GB RAM
    그래픽  NVDIA GeForce GTX 1060 6GB / AMD Radeon RX580 8GB
    DirectX  버전 11
    저장공간  130 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">몬스터 헌터 월드</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS	WINDOWS® 7, 8, 8.1, 10 (64-BIT 필수)
    CPU	Intel® Core™ i5 4460 or Core™ i3 9100F or AMD FX™-6300 or Ryzen™ 3 3200G
    메모리	8GB RAM
    스토리지	52 GB 이용 가능
    그래픽	NVIDIA® GeForce® GTX 760 or GTX1050 or AMD Radeon™ R7 260x or RX 560
    DirectX	Version 11
    사운드 카드	DirectSound 대응(DirectX® 9.0c 이상)
    네트워크	광대역 인터넷 접속
    비고1 : 그래픽 'Low' 설정으로, 1080p/30fps의 게임 플레이가 가능합니다.
    비고2 : 64비트 CPU와 오페레이팅 시스템이 필요합니다.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS	WINDOWS® 7, 8, 8.1, 10 (64-BIT 필수)
    CPU	Intel® Core™ i5 4460 or Core™ i3 9100F or AMD FX™-6300 or Ryzen™ 3 3200G
    메모리	8GB RAM
    스토리지	52 GB 이용 가능
    그래픽	NVIDIA® GeForce® GTX 760 or GTX1050 or AMD Radeon™ R7 260x or RX 560
    DirectX	Version 11
    사운드 카드	DirectSound 대응(DirectX® 9.0c 이상)
    네트워크	광대역 인터넷 접속
    비고1 : 그래픽 'Low' 설정으로, 1080p/30fps의 게임 플레이가 가능합니다.
    비고2 : 64비트 CPU와 오페레이팅 시스템이 필요합니다.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">바이오하자드 RE:4</span> : 중옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>Requires a 64-bit processor and operating system
    - OS: Windows 10 (64 bit)
    - Processor: AMD Ryzen 3 1200 / Intel Core i5-7500
    - Memory: 8 GB RAM
    - Graphics: AMD Radeon RX 560 with 4GB VRAM / NVIDIA GeForce GTX 1050 Ti with 4GB VRAM
    - DirectX: Version 12</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>Requires a 64-bit processor and operating system
    - OS: Windows 10 (64 bit)
    - Processor: AMD Ryzen 3 1200 / Intel Core i5-7500
    - Memory: 8 GB RAM
    - Graphics: AMD Radeon RX 560 with 4GB VRAM / NVIDIA GeForce GTX 1050 Ti with 4GB VRAM
    - DirectX: Version 12</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">발더스 게이트3</span> : 상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows 10 64 비트
    - CPU : 인텔 i5-4690 / AMD FX 4350
    - 램 : 8GB RAM
    - 하드 : 70GB의 사용 가능한 공간
    - 그래픽 : Nvidia GTX 780 / AMD Radeon R9 280X</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows 10 64 비트
    - CPU : 인텔 i5-4690 / AMD FX 4350
    - 램 : 8GB RAM
    - 하드 : 70GB의 사용 가능한 공간
    - 그래픽 : Nvidia GTX 780 / AMD Radeon R9 280X</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">발로란트</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows 10 (빌드 17134 이상) 또는 11, 64비트
    - CPU : Intel Core 2 Duo E8400
    - 램 : 4GB
    - 그래픽 : Intel HD 4000</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows 10 (빌드 17134 이상) 또는 11, 64비트
    - CPU : Intel Core 2 Duo E8400
    - 램 : 4GB
    - 그래픽 : Intel HD 4000</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">배틀그라운드</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows 7 64-bit 이상
    - CPU : intel Core i5-4430, AMD FX-6300
    - 램 : 8GB
    - 하드 : 30GB 사용 가능 공간
    - 그래픽 : nVidia GeForce GTX 960 2GB, AMD Radeon R7 370 2GB</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows 7 64-bit 이상
    - CPU : intel Core i5-4430, AMD FX-6300
    - 램 : 8GB
    - 하드 : 30GB 사용 가능 공간
    - 그래픽 : nVidia GeForce GTX 960 2GB, AMD Radeon R7 370 2GB</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>선수옵 &#60; 국옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">백 4 블러드</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS
    Windows 10 64비트
    CPU	Intel Core i5-6600 (3.3 GHz) 또는 AMD Ryzen 5 2600 (3.4 GHz)
    RAM 8 GB
    GPU	NVIDIA GeForce GTX 1050 Ti 또는 AMD Radeon RX 570
    DX 버전 DX 12
    저장공간	40 GB HDD
    NOTES 1080p / 60fps / Low Quality Settings</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS
    Windows 10 64비트
    CPU	Intel Core i5-6600 (3.3 GHz) 또는 AMD Ryzen 5 2600 (3.4 GHz)
    RAM 8 GB
    GPU	NVIDIA GeForce GTX 1050 Ti 또는 AMD Radeon RX 570
    DX 버전 DX 12
    저장공간	40 GB HDD
    NOTES 1080p / 60fps / Low Quality Settings</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">벨라이트</span> : 중옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 *: 64-Bit Windows 7 Service Pack 1, Windows 8, Windows 10 or Windows 11
    프로세서: Intel Core i5-8600 / AMD Ryzen 5 3600
    메모리: 16 GB RAM
    그래픽: NVIDIA GeForce GTX 1070 8GB / AMD Radeon RX 580 8GB
    DirectX: 버전 12
    저장공간: 24 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 *: 64-Bit Windows 7 Service Pack 1, Windows 8, Windows 10 or Windows 11
    프로세서: Intel Core i5-8600 / AMD Ryzen 5 3600
    메모리: 16 GB RAM
    그래픽: NVIDIA GeForce GTX 1070 8GB / AMD Radeon RX 580 8GB
    DirectX: 버전 12
    저장공간: 24 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">붉은사막</span> : 상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS - Windows 10 64-bit
    CPU - Ryzen 5 2600X / i5-8500
    램 - 16GB RAM
    하드 - 135GB 사용 가능 공간
    그래픽 - GTX 1060 / RX 6500 XT
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS - Windows 10 64-bit
    CPU - Ryzen 5 2600X / i5-8500
    램 - 16GB RAM
    하드 - 135GB 사용 가능 공간
    그래픽 - GTX 1060 / RX 6500 XT
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">빈딕투스: 디파잉 페이트</span> : 최상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS : Window 10
    CPU : Intel Core i7-4770 / AMD FX8300
    램 : 16GB RAM
    그래픽 : Geforce GTX 1060 VRAM 6GB / Radeon RX 480</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS : Window 10
    CPU : Intel Core i7-4770 / AMD FX8300
    램 : 16GB RAM
    그래픽 : Geforce GTX 1060 VRAM 6GB / Radeon RX 480</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상 &#60; 최상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">사이버펑크 2077</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows 7 또는 10
    - CPU : Intel Core i5-3570K 또는 AMD FX-8310
    - 램 : 8GB RAM
    - 하드 : 70GB의 사용 가능한 공간
    - 그래픽 : NVIDIA GeForce GTX 780 또는 AMD Radeon RX 470</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows 7 또는 10
    - CPU : Intel Core i5-3570K 또는 AMD FX-8310
    - 램 : 8GB RAM
    - 하드 : 70GB의 사용 가능한 공간
    - 그래픽 : NVIDIA GeForce GTX 780 또는 AMD Radeon RX 470</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵 &#60; 최상옵+RT</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">사일런트 힐 2 (SILENT HILL 2)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10 x64
    프로세서: Intel Core i7-6700K | AMD Ryzen 5 3600
    메모리: 16 GB RAM
    그래픽: NVIDIA® GeForce® GTX 1070 Ti or AMD Radeon™ RX 5700
    DirectX: 버전 12
    저장공간: 50 GB 사용 가능 공간
    사운드카드: Windows Compatible Audio Device.
    추가 사항: Playing on minimum requirements should enable to play on Low/Medium quality settings in FullHD (1080p) in stable 30 FPS. SSD is recommended.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10 x64
    프로세서: Intel Core i7-6700K | AMD Ryzen 5 3600
    메모리: 16 GB RAM
    그래픽: NVIDIA® GeForce® GTX 1070 Ti or AMD Radeon™ RX 5700
    DirectX: 버전 12
    저장공간: 50 GB 사용 가능 공간
    사운드카드: Windows Compatible Audio Device.
    추가 사항: Playing on minimum requirements should enable to play on Low/Medium quality settings in FullHD (1080p) in stable 30 FPS. SSD is recommended.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">새티스 팩토리(Satisfactory)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 or later (64-Bit)
    프로세서: i5-3570 3.4 GHz 4 Core
    메모리: 8 GB RAM
    그래픽: Nvidia GTX 1650/GTX 1050-ti, or AMD RX 470/RX 570, or equivalent performance & VRAM
    저장공간: 20 GB 사용 가능 공간
    추가 사항: Internet connection required for multiplayer. The game is in early access and minimum requirements may change.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 or later (64-Bit)
    프로세서: i5-3570 3.4 GHz 4 Core
    메모리: 8 GB RAM
    그래픽: Nvidia GTX 1650/GTX 1050-ti, or AMD RX 470/RX 570, or equivalent performance & VRAM
    저장공간: 20 GB 사용 가능 공간
    추가 사항: Internet connection required for multiplayer. The game is in early access and minimum requirements may change.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">샌드랜드</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>Requires a 64-bit processor and operating system
    OS: Windows 10
    Processor: AMD Ryzen 5 2400G / Intel Core i5-9400F
    Memory: 4 GB RAM
    Graphics: AMD Radeon RX 590 / Nvidia GeForce GTX 1060
    DirectX: Version 12
    Storage: 20 GB available space
    Additional Notes: Estimated performance: 1080p/60fps with graphics settings at "Low". Framerate might drop in graphics-intensive scenes. - 64-bit processor and operating system are required.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>Requires a 64-bit processor and operating system
    OS: Windows 10
    Processor: AMD Ryzen 5 2400G / Intel Core i5-9400F
    Memory: 4 GB RAM
    Graphics: AMD Radeon RX 590 / Nvidia GeForce GTX 1060
    DirectX: Version 12
    Storage: 20 GB available space
    Additional Notes: Estimated performance: 1080p/60fps with graphics settings at "Low". Framerate might drop in graphics-intensive scenes. - 64-bit processor and operating system are required.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">서든어택</span> : 상옵으로 75 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS : Windows 7
    CPU : Intel Core2 Duo E6300
    램 : 2GB
    하드 : 20GB
    그래픽 : GeForce 7600GT</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS : Windows 7
    CPU : Intel Core2 Duo E6300
    램 : 2GB
    하드 : 20GB
    그래픽 : GeForce 7600GT</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">선즈 오브 더포레스트</span> : 상으로  FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 : Windows 10 64-bit
    CPU : INTEL CORE I5-8400 / AMD RYZEN 3 3300X
    RAM : 12 GB RAM
    저장공간 : 20 GB 사용 가능 공간
    그래픽 카드 : NVIDIA GeForce GTX 1060 3GB / AMD Radeon RX 570 4GB
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 : Windows 10 64-bit
    CPU : INTEL CORE I5-8400 / AMD RYZEN 3 3300X
    RAM : 12 GB RAM
    저장공간 : 20 GB 사용 가능 공간
    그래픽 카드 : NVIDIA GeForce GTX 1060 3GB / AMD Radeon RX 570 4GB
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">소울워커</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10, 64 bit or above
    프로세서: Intel Core2 duo E8300 or above
    메모리: 4 GB RAM
    그래픽: Geforce GTX 460 / Radeon HD 5850
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 20 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10, 64 bit or above
    프로세서: Intel Core2 duo E8300 or above
    메모리: 4 GB RAM
    그래픽: Geforce GTX 460 / Radeon HD 5850
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 20 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">쉐이프즈 2 (shapez 2)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 64bit
    프로세서: Intel(R) Core(TM) i5-4440 CPU
    메모리: 4 GB RAM
    그래픽: Intel(R) UHD Graphics 630, 1GB VRAM
    저장공간: 2000 MB 사용 가능 공간
    추가 사항: 풀 HD에서 '최소' 그래픽 프리셋의 경우. 스크롤 휠이 있는 2버튼 마우스가 필요합니다.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 64bit
    프로세서: Intel(R) Core(TM) i5-4440 CPU
    메모리: 4 GB RAM
    그래픽: Intel(R) UHD Graphics 630, 1GB VRAM
    저장공간: 2000 MB 사용 가능 공간
    추가 사항: 풀 HD에서 '최소' 그래픽 프리셋의 경우. 스크롤 휠이 있는 2버튼 마우스가 필요합니다.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">스타크래프트</span> : 상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows 7, OS X® 10.10
    - CPU : Intel® Pentium® D 또는 AMD™ Athlon™ 64 X2
    - 램 : 2GB
    - 하드 : 8 GB 이상의 하드 드라이브 여유 공간
    - 그래픽 : NVIDIA® GeForce; 6800 (256 MB) 또는 ATI™ Radeon™ X1600 Pro (256 MB)</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows 7, OS X® 10.10
    - CPU : Intel® Pentium® D 또는 AMD™ Athlon™ 64 X2
    - 램 : 2GB
    - 하드 : 8 GB 이상의 하드 드라이브 여유 공간
    - 그래픽 : NVIDIA® GeForce; 6800 (256 MB) 또는 ATI™ Radeon™ X1600 Pro (256 MB)</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">스텔라 블레이드</span> : 상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS : Windows 10 64-bit
    CPU : Intel Core i5-7600k / AMD Ryzen 5 1600X Processor
    램 : 16GB RAM
    하드 : 75GB 사용 가능 공간
    그래픽 :  NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 580 8GB
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS : Windows 10 64-bit
    CPU : Intel Core i5-7600k / AMD Ryzen 5 1600X Processor
    램 : 16GB RAM
    하드 : 75GB 사용 가능 공간
    그래픽 :  NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 580 8GB
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">스트리노바</span> : 상으로  FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 : Windows 7, 8, 10, 11 (64bit)
    프로세서 : Intel Core i3-4170
    메모리 : 4GB RAM
    저장공간 : 25GB 사용 가능 공간
    그래픽 : Nvidia GeForce GTX 730 / AMD R7 240
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 : Windows 7, 8, 10, 11 (64bit)
    프로세서 : Intel Core i3-4170
    메모리 : 4GB RAM
    저장공간 : 25GB 사용 가능 공간
    그래픽 : Nvidia GeForce GTX 730 / AMD R7 240
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">스플릿 픽션</span> : 상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 : 64 bit Windows 10, 11
    프로세서 : Intel Core i5-6600K / AMD Ryzen 5 2600X
    메모리 : 16GB RAM
    저장공간 : 85GB 사용 가능 공간
    그래픽 : NVIDIA GeForce GTX 970 - 4GB / Radeon RX 470 - 4GB
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 : 64 bit Windows 10, 11
    프로세서 : Intel Core i5-6600K / AMD Ryzen 5 2600X
    메모리 : 16GB RAM
    저장공간 : 85GB 사용 가능 공간
    그래픽 : NVIDIA GeForce GTX 970 - 4GB / Radeon RX 470 - 4GB
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">심즈4</span> : 최상으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS: 64 비트 필요. Windows 10
    프로세서(CPU): 3.3 GHz Intel Core i3-3220 (2 코어, 4 스레드), AMD Ryzen 3 1200 3.1 GHz (4 코어) 이상
    메모리 (RAM): 최소 4 GB 램
    하드 드라이브 (여유 공간): 최소 25 GB의 여유 공간 + 커스텀 콘텐츠와 게임 저장을 위한 1 GB 추가 공간
    디스크 드라이브: 게임의 물리적 디스크에서 설치하는 경우에만 DVD-ROM 드라이브 필요
    그래픽 카드 (비디오): 128 MB의 비디오 램, Pixel Shader 3.0 지원
    지원하는 그래픽 카드: NVIDIA GeForce 6600 이상, ATI Radeon X1300 이상, Intel GMA X4500 이상
    DirectX 버전: DirectX 11 호환</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS: 64 비트 필요. Windows 10
    프로세서(CPU): 3.3 GHz Intel Core i3-3220 (2 코어, 4 스레드), AMD Ryzen 3 1200 3.1 GHz (4 코어) 이상
    메모리 (RAM): 최소 4 GB 램
    하드 드라이브 (여유 공간): 최소 25 GB의 여유 공간 + 커스텀 콘텐츠와 게임 저장을 위한 1 GB 추가 공간
    디스크 드라이브: 게임의 물리적 디스크에서 설치하는 경우에만 DVD-ROM 드라이브 필요
    그래픽 카드 (비디오): 128 MB의 비디오 램, Pixel Shader 3.0 지원
    지원하는 그래픽 카드: NVIDIA GeForce 6600 이상, ATI Radeon X1300 이상, Intel GMA X4500 이상
    DirectX 버전: DirectX 11 호환</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">쓰론 앤 리버티 (TL)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>해상도	1080p
    그래픽 품질	낮음
    CPU	Core i5-6500
    GPU	GTX 960 4GB
    RAM	8GB
    저장장치	60GB SSD
    운영체제	Windows 10 20H2
    DirectX	12

    그래픽 하드웨어가 지원하는 경우 자동으로 활성화되는 업스케일링 (DLSS2 등) 환경에서 측정한 사양입니다.
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>해상도	1080p
    그래픽 품질	낮음
    CPU	Core i5-6500
    GPU	GTX 960 4GB
    RAM	8GB
    저장장치	60GB SSD
    운영체제	Windows 10 20H2
    DirectX	12

    그래픽 하드웨어가 지원하는 경우 자동으로 활성화되는 업스케일링 (DLSS2 등) 환경에서 측정한 사양입니다.
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">아레나 브레이크아웃: 인피니티</span> : 최상옵으로 100 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: 64-bit Windows 10 or above
    프로세서: Core i5-7500 or Ryzen 5 1400
    메모리: 16 GB RAM
    그래픽: NVIDIA GTX 960 or AMD Radeon RX 560 or Arc A380 with Video Memory 4G or above
    DirectX: 버전 12
    네트워크: 초고속 인터넷 연결
    저장공간: 60 GB 사용 가능 공간
    추가 사항: 이는 8월 Early Access 버전의 요구 사항만을 나타냅니다. 우리는 계속해서 더 많은 기기에 맞게 최적화할 예정입니다. 계속 지켜봐 주시기 바랍니다.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: 64-bit Windows 10 or above
    프로세서: Core i5-7500 or Ryzen 5 1400
    메모리: 16 GB RAM
    그래픽: NVIDIA GTX 960 or AMD Radeon RX 560 or Arc A380 with Video Memory 4G or above
    DirectX: 버전 12
    네트워크: 초고속 인터넷 연결
    저장공간: 60 GB 사용 가능 공간
    추가 사항: 이는 8월 Early Access 버전의 요구 사항만을 나타냅니다. 우리는 계속해서 더 많은 기기에 맞게 최적화할 예정입니다. 계속 지켜봐 주시기 바랍니다.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">아머드 코어 6 루비콘의 화염</span> : 상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS    Windows 10
    CPU   Intel Core i5-8600K or AMD Ryzen 3 3300X
    램   12 GB RAM
    저장공간   65 GB 사용 가능 공간
    그래픽    NVIDIA GeForce GTX 960, 4 GB or AMD Radeon RX 480, 4 GB or Intel Arc A380, 6 GB
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS    Windows 10
    CPU   Intel Core i5-8600K or AMD Ryzen 3 3300X
    램   12 GB RAM
    저장공간   65 GB 사용 가능 공간
    그래픽    NVIDIA GeForce GTX 960, 4 GB or AMD Radeon RX 480, 4 GB or Intel Arc A380, 6 GB
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">아스달 연대기 세 개의 세력</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>CPU Intel i5 (3.0 GHz 이상) Ryzen 5 (3.0 GHz 이상)
    RAM 16GB
    그래픽 카드 Nvidia GeForce GTX 970
    운영체제 (64 비트) Windows 10 (64bit)
    하드디스크 30GB 이상
    DirectX DirectX 11</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>CPU Intel i5 (3.0 GHz 이상) Ryzen 5 (3.0 GHz 이상)
    RAM 16GB
    그래픽 카드 Nvidia GeForce GTX 970
    운영체제 (64 비트) Windows 10 (64bit)
    하드디스크 30GB 이상
    DirectX DirectX 11</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">아이온</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>CPU	Intel Core i5 750 / AMD Phenom II X4 이상
    메모리	4GB 이상
    그래픽카드	nVidia GeForce GTX 260 이상
    AMD Radeon HD 5770 이상
    하드디스크	HDD 30GB 이상
    운영체제	Windows(8, 10) 32bit
    DirectX	9.0c(2008.6)</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>CPU	Intel Core i5 750 / AMD Phenom II X4 이상
    메모리	4GB 이상
    그래픽카드	nVidia GeForce GTX 260 이상
    AMD Radeon HD 5770 이상
    하드디스크	HDD 30GB 이상
    운영체제	Windows(8, 10) 32bit
    DirectX	9.0c(2008.6)</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">아이온2</span> : 상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS : 64-bit Windows 10 / 11
    CPU :  Intel i5-10400F / AMD 3300X
    램 : 16GB RAM
    하드 : SSD Recommended
    그래픽 : NVIDIA Geforce GTX 1660 (6G)</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS : 64-bit Windows 10 / 11
    CPU :  Intel i5-10400F / AMD 3300X
    램 : 16GB RAM
    하드 : SSD Recommended
    그래픽 : NVIDIA Geforce GTX 1660 (6G)</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">아이작의 번제</span> : 상으로  FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 : Windows XP, Vista, 7, OS X 버전 Leopard 10.5.8, Snow Leopard 10.6.3 이상.
    프로세서 : 2.5Hz, Intel MAC 2.5 GHz
    메모리 : 1GB 이상
    저장공간 : 50MB
    그래픽 : Direct X9.0c 호환 카드
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 : Windows XP, Vista, 7, OS X 버전 Leopard 10.5.8, Snow Leopard 10.6.3 이상.
    프로세서 : 2.5Hz, Intel MAC 2.5 GHz
    메모리 : 1GB 이상
    저장공간 : 50MB
    그래픽 : Direct X9.0c 호환 카드
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">아크레이더스</span> : 상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS - Windows 10 64bit 이상 (최신 업데이트)
    CPU - Intel Core i5-6600K / AMD Ryzen R5 1600 processor
    램 - 12GB RAM
    그래픽 - NVIDIA GeForce GTX 1050 Ti / AMD Radeon RX 580 / Intel Arc A380
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS - Windows 10 64bit 이상 (최신 업데이트)
    CPU - Intel Core i5-6600K / AMD Ryzen R5 1600 processor
    램 - 12GB RAM
    그래픽 - NVIDIA GeForce GTX 1050 Ti / AMD Radeon RX 580 / Intel Arc A380
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">아크서바이벌 어센디드</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 : Windows 10 / 11 64-bit with updates
    프로세서 : Intel Core i7-6800K / AMD Ryzen 5 2600X
    메모리 : 16 GB RAM
    그래픽 카드 : NVIDIA GeForce GTX 1080 / AMD Radeon RX 5600 XT
    API : DirectX 12
    저장 공간 : 70 GB SSD</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 : Windows 10 / 11 64-bit with updates
    프로세서 : Intel Core i7-6800K / AMD Ryzen 5 2600X
    메모리 : 16 GB RAM
    그래픽 카드 : NVIDIA GeForce GTX 1080 / AMD Radeon RX 5600 XT
    API : DirectX 12
    저장 공간 : 70 GB SSD</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">어바우드</span> : 상옵으로  FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제	Windows 10, 11 
    프로세서	AMD Ryzen 5 2600 / Intel i5-8400
    메모리	16 GB RAM
    저장공간	75 GB 사용 가능 공간 
    그래픽	AMD RX 5700 / Nvidia GTX 1070 / Intel Arc A580 
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제	Windows 10, 11 
    프로세서	AMD Ryzen 5 2600 / Intel i5-8400
    메모리	16 GB RAM
    저장공간	75 GB 사용 가능 공간 
    그래픽	AMD RX 5700 / Nvidia GTX 1070 / Intel Arc A580 
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">어쌔신 크리드 미라지</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>CPU: Intel Core i7-4790K (Intel Core i5-8400 for Intel Arc with ReBAR)/AMD Ryzen 5 1600
    GPU: Intel Arc A380 6GB/NVIDIA GeForce GTX 1060 6GB/AMD Radeon RX 570 4GB
    RAM: 8GB (dual-channel mode)
    OS: Windows 10/11
    SSD Storage: 40 GB</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>CPU: Intel Core i7-4790K (Intel Core i5-8400 for Intel Arc with ReBAR)/AMD Ryzen 5 1600
    GPU: Intel Arc A380 6GB/NVIDIA GeForce GTX 1060 6GB/AMD Radeon RX 570 4GB
    RAM: 8GB (dual-channel mode)
    OS: Windows 10/11
    SSD Storage: 40 GB</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">어쌔신 크리드 섀도우스</span> : 상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 : Windows 10, 11
    프로세서 :Intel Core i7 8700k / AMD Ryzen 5 3600
    메모리 : 16GB RAM
    저장공간 : 115GB 사용 가능 공간
    그래픽 : Nvidia GeForce GTX 1070 8GB / AMD Radeon RX 5700 8GB / Intel Arc A580 8GB (REBAR ON)
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 : Windows 10, 11
    프로세서 :Intel Core i7 8700k / AMD Ryzen 5 3600
    메모리 : 16GB RAM
    저장공간 : 115GB 사용 가능 공간
    그래픽 : Nvidia GeForce GTX 1070 8GB / AMD Radeon RX 5700 8GB / Intel Arc A580 8GB (REBAR ON)
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">에이지 오브 미쏠로지 리톨드</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10 64bit
    프로세서: Intel® i3-4130 or AMD FX 4350 at 2.4GHZ+ with 2 cores / 4 threads and AVX support
    메모리: 8 GB RAM
    그래픽: NVIDIA® GeForce® GTX 645 or AMD Radeon™ Vega 8 or Intel® Iris Graphics 550 or better
    DirectX: 버전 12
    저장공간: 25 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10 64bit
    프로세서: Intel® i3-4130 or AMD FX 4350 at 2.4GHZ+ with 2 cores / 4 threads and AVX support
    메모리: 8 GB RAM
    그래픽: NVIDIA® GeForce® GTX 645 or AMD Radeon™ Vega 8 or Intel® Iris Graphics 550 or better
    DirectX: 버전 12
    저장공간: 25 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">에일 ＆ 테일 태번 (Ale ＆ Tale Tavern)</span> : 상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10
    프로세서: Quad core
    메모리: 8 GB RAM
    그래픽: Nvidia GTX 1060
    네트워크: 초고속 인터넷 연결
    저장공간: 7 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10
    프로세서: Quad core
    메모리: 8 GB RAM
    그래픽: Nvidia GTX 1060
    네트워크: 초고속 인터넷 연결
    저장공간: 7 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">엘든 링: 황금 나무의 그림자</span> : 상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows 10
    - CPU : INTEL CORE I5-8400 or AMD RYZEN 3 3300X
    - 램 : 12GB RAM
    - 하드 : 60GB 사용 가능 공간
    - 그래픽 : NVIDIA GEFORCE GTX 1060 3 GB or AMD RADEON RX 580 4 GB</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows 10
    - CPU : INTEL CORE I5-8400 or AMD RYZEN 3 3300X
    - 램 : 12GB RAM
    - 하드 : 60GB 사용 가능 공간
    - 그래픽 : NVIDIA GEFORCE GTX 1060 3 GB or AMD RADEON RX 580 4 GB</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">엘든링</span> : 상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows 10
    - CPU : INTEL CORE I5-8400 or AMD RYZEN 3 3300X
    - 램 : 12GB RAM
    - 하드 : 60GB 사용 가능 공간
    - 그래픽 : NVIDIA GEFORCE GTX 1060 3 GB or AMD RADEON RX 580 4 GB</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows 10
    - CPU : INTEL CORE I5-8400 or AMD RYZEN 3 3300X
    - 램 : 12GB RAM
    - 하드 : 60GB 사용 가능 공간
    - 그래픽 : NVIDIA GEFORCE GTX 1060 3 GB or AMD RADEON RX 580 4 GB</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">오버워치2</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : 윈도우® 10 64-bit (최신 서비스팩) 32비트 운영체제는 지원하지 않습니다
    - CPU : Intel® Core™ i3 또는 AMD Phenom™ X3 8650
    - 램 : 6GB RAM
    - 하드 : 50GB 이상의 하드 드라이브 여유 공간
    - 그래픽 : NVIDIA® GeForce® GTX 600 시리즈, AMD Radeon™ HD 7000 시리즈</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : 윈도우® 10 64-bit (최신 서비스팩) 32비트 운영체제는 지원하지 않습니다
    - CPU : Intel® Core™ i3 또는 AMD Phenom™ X3 8650
    - 램 : 6GB RAM
    - 하드 : 50GB 이상의 하드 드라이브 여유 공간
    - 그래픽 : NVIDIA® GeForce® GTX 600 시리즈, AMD Radeon™ HD 7000 시리즈</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; PC방옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">용과 같이 8</span> : 상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>Requires a 64-bit processor and operating system
    OS: Windows 10 1903 (OS Build 18362)
    Processor: Intel Core i5-3470, 3.2 GHz or AMD Ryzen 3 1200, 3.1 GHz
    Memory: 8 GB RAM
    Graphics: NVIDIA GeForce GTX 960, 4 GB or AMD Radeon RX 460, 4 GB or Intel Arc A380, 6 GB
    DirectX: Version 12
    Storage: 82 GB available space
    Sound Card: Windows Compatible Audio Device
    Additional Notes: 1080p Low @ 30 FPS w/ Balanced FSR 1.0, requires a CPU which supports the AVX and SSE4.2 instruction set</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>Requires a 64-bit processor and operating system
    OS: Windows 10 1903 (OS Build 18362)
    Processor: Intel Core i5-3470, 3.2 GHz or AMD Ryzen 3 1200, 3.1 GHz
    Memory: 8 GB RAM
    Graphics: NVIDIA GeForce GTX 960, 4 GB or AMD Radeon RX 460, 4 GB or Intel Arc A380, 6 GB
    DirectX: Version 12
    Storage: 82 GB available space
    Sound Card: Windows Compatible Audio Device
    Additional Notes: 1080p Low @ 30 FPS w/ Balanced FSR 1.0, requires a CPU which supports the AVX and SSE4.2 instruction set</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">워썬더 (WAR THUNDER)</span> : 상으로  FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS: Windows 7 SP1/8/10(64비트)
    프로세서: 듀얼코어 2.2GHz
    메모리 : 4GB
    비디오 카드: DirectX 10.1 레벨 비디오 카드: AMD Radeon 77XX / NVIDIA GeForce GTX 660. 게임의 최소 지원 해상도는 720p입니다.
    네트워크 : 광대역 인터넷 연결
    하드 드라이브: 17GB</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS: Windows 7 SP1/8/10(64비트)
    프로세서: 듀얼코어 2.2GHz
    메모리 : 4GB
    비디오 카드: DirectX 10.1 레벨 비디오 카드: AMD Radeon 77XX / NVIDIA GeForce GTX 660. 게임의 최소 지원 해상도는 720p입니다.
    네트워크 : 광대역 인터넷 연결
    하드 드라이브: 17GB</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">워테일즈(Wartales)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 64bit
    프로세서: Intel Core i5 2.5 GHz / AMD Ryzen 5
    메모리: 8 GB RAM
    그래픽: NVidia GTX 1050 / AMD RX550
    DirectX: 버전 10
    저장공간: 30 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 64bit
    프로세서: Intel Core i5 2.5 GHz / AMD Ryzen 5
    메모리: 8 GB RAM
    그래픽: NVidia GTX 1050 / AMD RX550
    DirectX: 버전 10
    저장공간: 30 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">워프레임</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS *:Windows 7 64-Bit (32-bit not supported)
    Processor:Intel Core i7 860, Intel Core i5 750, or AMD FX-4100 (SSE 4.2 support required)
    Video:DirectX 11+ capable Graphics Card
    Memory:4 GB RAM
    Storage:50 GB available HD space
    Internet:Broadband Internet Connection Required

    Note: There is no Mac or Linux client currently available.
    * Starting January 1st, 2024, the Steam Client will only support Windows 10 and later versions.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS *:Windows 7 64-Bit (32-bit not supported)
    Processor:Intel Core i7 860, Intel Core i5 750, or AMD FX-4100 (SSE 4.2 support required)
    Video:DirectX 11+ capable Graphics Card
    Memory:4 GB RAM
    Storage:50 GB available HD space
    Internet:Broadband Internet Connection Required

    Note: There is no Mac or Linux client currently available.
    * Starting January 1st, 2024, the Steam Client will only support Windows 10 and later versions.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">워해머 40k 스페이스 마린 2</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10/11 64-bit
    프로세서: AMD Ryzen 5 2600X / Intel Core i5-8600K
    메모리: 8 GB RAM
    그래픽: 6 GB VRAM, AMD Radeon RX 580 / Nvidia GeForce GTX 1060
    DirectX: 버전 12
    저장공간: 75 GB 사용 가능 공간
    추가 사항: 30 FPS in 1920x1080 with "Low" preset. SSD required</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10/11 64-bit
    프로세서: AMD Ryzen 5 2600X / Intel Core i5-8600K
    메모리: 8 GB RAM
    그래픽: 6 GB VRAM, AMD Radeon RX 580 / Nvidia GeForce GTX 1060
    DirectX: 버전 12
    저장공간: 75 GB 사용 가능 공간
    추가 사항: 30 FPS in 1920x1080 with "Low" preset. SSD required</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">원스 휴먼(Once Human)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10 64-bit Operating System
    프로세서: Intel Core i5-4460
    메모리: 8 GB RAM
    그래픽: Nvidia GTX 750ti 4G / AMD Radeon RX550
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 55 GB 사용 가능 공간
    추가 사항: SSD is highly recommended</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10 64-bit Operating System
    프로세서: Intel Core i5-4460
    메모리: 8 GB RAM
    그래픽: Nvidia GTX 750ti 4G / AMD Radeon RX550
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 55 GB 사용 가능 공간
    추가 사항: SSD is highly recommended</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">원신</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows 7 SP1 64-bit , Windows 8.1 64-bit , Windows 10 64-bit
    - CPU : Intel Core i5 또는 동급 CPU
    - 램 : 8GB RAM
    - 하드 : 30 GB
    - 그래픽 : NVIDIA® GeForce® GT 1030 및 더 높은 사양</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows 7 SP1 64-bit , Windows 8.1 64-bit , Windows 10 64-bit
    - CPU : Intel Core i5 또는 동급 CPU
    - 램 : 8GB RAM
    - 하드 : 30 GB
    - 그래픽 : NVIDIA® GeForce® GT 1030 및 더 높은 사양</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">월드오브탱크</span> : 상으로  FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 : Windows XP SP3/Vista/7/8/10
    CPU : SSE2를 지원하는 듀얼 코어 이상의&#160;프로세서
    RAM : XP 사용 시 1.5GB,&#160;Vista/7/8/10 사용 시 2GB : 
    저장공간 : 25 GB
    그래픽 카드 : GeForce 6800 256 MB RAM&#160;&#160;/ATI HD X2400 XT 256 MB RAM, DirectX 9.0c
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 : Windows XP SP3/Vista/7/8/10
    CPU : SSE2를 지원하는 듀얼 코어 이상의&#160;프로세서
    RAM : XP 사용 시 1.5GB,&#160;Vista/7/8/10 사용 시 2GB : 
    저장공간 : 25 GB
    그래픽 카드 : GeForce 6800 256 MB RAM&#160;&#160;/ATI HD X2400 XT 256 MB RAM, DirectX 9.0c
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">이스케이프 프롬 타르코프</span> : 중옵으로 100 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS : Windows 7/8/10 64-bit
    CPU : Intel Core 2 Duo, i3 2.4 GHz 또는 AMD Athlon, Phenom II 2.6 GHz
    램 : 8 GB
    하드 : 8 GB 이상
    그래픽 : DX11와 호환되는 1 GB VRAM</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS : Windows 7/8/10 64-bit
    CPU : Intel Core 2 Duo, i3 2.4 GHz 또는 AMD Athlon, Phenom II 2.6 GHz
    램 : 8 GB
    하드 : 8 GB 이상
    그래픽 : DX11와 호환되는 1 GB VRAM</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">이터널리턴</span> : 상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS : WINDOWS® 10 (64Bit)
    CPU : Intel Core i3-3225, AMD FX-4350
    램 : 4GB RAM
    하드 : 3GB 사용 가능 공간
    그래픽 : NVIDIA GeForce GT 640, ATI Radeon HD 7700</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS : WINDOWS® 10 (64Bit)
    CPU : Intel Core i3-3225, AMD FX-4350
    램 : 4GB RAM
    하드 : 3GB 사용 가능 공간
    그래픽 : NVIDIA GeForce GT 640, ATI Radeon HD 7700</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">인슈라오디드</span> : 상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영체제: Windows 10
    프로세서: Intel Core i5-6400 (2.7 GHz 4 Core) / AMD Ryzen 5 1500X (3.5 GHz 4 Core) or equivalent
    메모리: 16 GB RAM
    그래픽: NVIDIA GeForce GTX 1060 (req. 6GB VRAM) / AMD Radeon RX 580 (req. 6GB VRAM)
    네트워크: 초고속 인터넷 연결
    저장공간: 60 GB 사용 가능 공간
    사운드카드: on board</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영체제: Windows 10
    프로세서: Intel Core i5-6400 (2.7 GHz 4 Core) / AMD Ryzen 5 1500X (3.5 GHz 4 Core) or equivalent
    메모리: 16 GB RAM
    그래픽: NVIDIA GeForce GTX 1060 (req. 6GB VRAM) / AMD Radeon RX 580 (req. 6GB VRAM)
    네트워크: 초고속 인터넷 연결
    저장공간: 60 GB 사용 가능 공간
    사운드카드: on board</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">인조이</span> : 상으로  FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 : Windows 10, 11
    CPU : Intel i5 10400 / AMD Ryzen 5 3600
    램 : 12GB RAM
    하드 : 40GB 사용 가능 공간
    그래픽 : NVIDIA RTX 2060 (6G VRAM) / AMD Radeon RX 5600 XT (6G VRAM)</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 : Windows 10, 11
    CPU : Intel i5 10400 / AMD Ryzen 5 3600
    램 : 12GB RAM
    하드 : 40GB 사용 가능 공간
    그래픽 : NVIDIA RTX 2060 (6G VRAM) / AMD Radeon RX 5600 XT (6G VRAM)</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">인펙션 프리 존</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 Windows 10
    프로세서 Intel® Core i5-3570K
    메모리 8 GB RAM
    그래픽카드 NVIDIA® GeForce® GTX 680
    AMD Radeon HD 7970
    저장 공간 5 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 Windows 10
    프로세서 Intel® Core i5-3570K
    메모리 8 GB RAM
    그래픽카드 NVIDIA® GeForce® GTX 680
    AMD Radeon HD 7970
    저장 공간 5 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">잇 테익스 투 (It Takes Two)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 8.1 64-bit or Windows 10 64-bit
    프로세서: Intel Core i3-2100T or AMD FX 6100
    메모리: 8 GB RAM
    그래픽: Nvidia GeForce GTX 660 or AMD R7 260x
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 50 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 8.1 64-bit or Windows 10 64-bit
    프로세서: Intel Core i3-2100T or AMD FX 6100
    메모리: 8 GB RAM
    그래픽: Nvidia GeForce GTX 660 or AMD R7 260x
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 50 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">작혼: 리치 마작</span> : 최상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 SP1 or higher
    프로세서: Intel Pentium Dual CPU E2180 2.00GHz
    메모리: 2 GB RAM
    그래픽: GeForce GT 430 / ATI Radeon HD 2600XT
    DirectX: 버전 10
    네트워크: 초고속 인터넷 연결
    저장공간: 2048 MB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 SP1 or higher
    프로세서: Intel Pentium Dual CPU E2180 2.00GHz
    메모리: 2 GB RAM
    그래픽: GeForce GT 430 / ATI Radeon HD 2600XT
    DirectX: 버전 10
    네트워크: 초고속 인터넷 연결
    저장공간: 2048 MB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">진삼국무쌍 ORIGINS</span> : 상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS : Windows® 10, 11 64-bit
    CPU : Intel Core i5-8400 / AMD Ryzen 5 2600
    램 : 12GB RAM
    하드 : 50GB 사용 가능 공간
    그래픽 : NVIDIA GeForce GTX 1060 (VRAM 6GB) / AMD Radeon RX 590 (VRAM 8GB)
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS : Windows® 10, 11 64-bit
    CPU : Intel Core i5-8400 / AMD Ryzen 5 2600
    램 : 12GB RAM
    하드 : 50GB 사용 가능 공간
    그래픽 : NVIDIA GeForce GTX 1060 (VRAM 6GB) / AMD Radeon RX 590 (VRAM 8GB)
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">철권 7</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제: Windows 7/8/10 (64-bit OS required)
    프로세서: Intel Core i3-4160 @ 3.60GHz or equivalent
    메모리: 6 GB RAM
    그래픽: NVIDIA GeForce GTX 660 2GB, GTX 750Ti 2GB, or equivalent
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 60 GB 사용 가능 공간
    사운드카드: DirectX compatible soundcard or onboard chipset</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제: Windows 7/8/10 (64-bit OS required)
    프로세서: Intel Core i3-4160 @ 3.60GHz or equivalent
    메모리: 6 GB RAM
    그래픽: NVIDIA GeForce GTX 660 2GB, GTX 750Ti 2GB, or equivalent
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 60 GB 사용 가능 공간
    사운드카드: DirectX compatible soundcard or onboard chipset</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">철권 8</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제: Windows 10 64-Bit
    프로세서: Intel Core i5-6600K/AMD Ryzen 5 1600
    메모리: 8 GB RAM
    그래픽: Nvidia GeForce GTX 1050Ti/AMD Radeon R9 380X
    DirectX: 버전 12
    네트워크: 초고속 인터넷 연결
    저장공간: 100 GB 사용 가능 공간
    사운드카드: DirectX compatible soundcard/Onboard chipset</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제: Windows 10 64-Bit
    프로세서: Intel Core i5-6600K/AMD Ryzen 5 1600
    메모리: 8 GB RAM
    그래픽: Nvidia GeForce GTX 1050Ti/AMD Radeon R9 380X
    DirectX: 버전 12
    네트워크: 초고속 인터넷 연결
    저장공간: 100 GB 사용 가능 공간
    사운드카드: DirectX compatible soundcard/Onboard chipset</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">카타클리스모(Cataclismo)</span> : 상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows® 10 (64-bit)
    프로세서: Intel® Core™ i7-4770 (quad-core) / AMD® FX-Series™ FX-9590 (quad-core)
    메모리: 8 GB RAM
    그래픽: NVIDIA® GeForce® GTX 760 (2 GB) / AMD® Radeon™ R9 270X (2 GB)
    DirectX: 버전 11
    저장공간: 10 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows® 10 (64-bit)
    프로세서: Intel® Core™ i7-4770 (quad-core) / AMD® FX-Series™ FX-9590 (quad-core)
    메모리: 8 GB RAM
    그래픽: NVIDIA® GeForce® GTX 760 (2 GB) / AMD® Radeon™ R9 270X (2 GB)
    DirectX: 버전 11
    저장공간: 10 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">카트라이더 : 드리프트</span> : 상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS : Windows 10 이상 (64bit)
    CPU : 인텔 1세대 i3 또는 FX 6000 시리즈 이상
    램 : 8GB
    하드 : 30GB
    그래픽 : Geforce GTX 760 또는 AMD 라데온 HD 7950</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS : Windows 10 이상 (64bit)
    CPU : 인텔 1세대 i3 또는 FX 6000 시리즈 이상
    램 : 8GB
    하드 : 30GB
    그래픽 : Geforce GTX 760 또는 AMD 라데온 HD 7950</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">컨커러스 블레이드</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 64-Bit
    프로세서: Intel I5-6400
    메모리: 8 GB RAM
    그래픽: Nvidia Geforce GTX 1050Ti
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 60 GB 사용 가능 공간
    추가 사항: Performance: 1080p / 30fps, Low Quality Settings</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 64-Bit
    프로세서: Intel I5-6400
    메모리: 8 GB RAM
    그래픽: Nvidia Geforce GTX 1050Ti
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 60 GB 사용 가능 공간
    추가 사항: Performance: 1080p / 30fps, Low Quality Settings</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">컬트 오브 더 램 (Cult of the Lamb)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 or later
    프로세서: Intel Core i3-3240 (2 * 3400); AMD FX-4300 (4 * 3800)
    메모리: 4 GB RAM
    그래픽: GeForce GTX 560 Ti (1024 VRAM); Radeon HD 7750 (1024 VRAM)
    저장공간: 4 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 or later
    프로세서: Intel Core i3-3240 (2 * 3400); AMD FX-4300 (4 * 3800)
    메모리: 4 GB RAM
    그래픽: GeForce GTX 560 Ti (1024 VRAM); Radeon HD 7750 (1024 VRAM)
    저장공간: 4 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">코어 키퍼(Core Keeper)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 64-bit
    프로세서: Intel Core i5-2300 / AMD Ryzen 3 1200
    메모리: 8 GB RAM
    그래픽: GeForce GTX 460 / Radeon HD 5850</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 64-bit
    프로세서: Intel Core i5-2300 / AMD Ryzen 3 1200
    메모리: 8 GB RAM
    그래픽: GeForce GTX 460 / Radeon HD 5850</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">콜 오브 듀티 : 모던 워페어 II 2022</span> : 중옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows® 10 64 Bit (최신 업데이트)
    - CPU : Intel® Core™ i3-6100 / Core™ i5-2500K 또는 AMD Ryzen™ 3 1200
    - 램 : 8GB RAM
    - 하드 : 125GB 사용 가능 공간
    - 그래픽 : NVIDIA® GeForce® GTX 960 또는 AMD Radeon™ RX 470 - DirectX 12.0 호환 시스템</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows® 10 64 Bit (최신 업데이트)
    - CPU : Intel® Core™ i3-6100 / Core™ i5-2500K 또는 AMD Ryzen™ 3 1200
    - 램 : 8GB RAM
    - 하드 : 125GB 사용 가능 공간
    - 그래픽 : NVIDIA® GeForce® GTX 960 또는 AMD Radeon™ RX 470 - DirectX 12.0 호환 시스템</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">콜 오브 듀티 블랙옵스6</span> : 상옵으로  FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10 64비트(최신 업데이트)
    CPU: AMD Ryzen 5 1400 또는 Intel Core i5-6600
    RAM: 8GB
    그래픽 카드: AMD Radeon RX 470 또는 NVIDIA GeForce GTX 960 또는 Intel Arc A580
    비디오 메모리: 2 GB
    저장 공간: SSD 필요, 출시 시 사용 가능한 공간 102GB</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10 64비트(최신 업데이트)
    CPU: AMD Ryzen 5 1400 또는 Intel Core i5-6600
    RAM: 8GB
    그래픽 카드: AMD Radeon RX 470 또는 NVIDIA GeForce GTX 960 또는 Intel Arc A580
    비디오 메모리: 2 GB
    저장 공간: SSD 필요, 출시 시 사용 가능한 공간 102GB</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">크라임 씬 클리너(Crime Scene Cleaner)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10/11
    프로세서: i5-7500 or similar
    메모리: 16 GB RAM
    그래픽: GTX 1060
    저장공간: 35 GB 사용 가능 공간
    추가 사항: Intel ARC 시리즈 카드가 아직 지원되지 않을 수 있습니다.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10/11
    프로세서: i5-7500 or similar
    메모리: 16 GB RAM
    그래픽: GTX 1060
    저장공간: 35 GB 사용 가능 공간
    추가 사항: Intel ARC 시리즈 카드가 아직 지원되지 않을 수 있습니다.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">크루세이더 킹즈 3</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows® 10 Home 64 bit
    프로세서: Intel® Core™ i3-2120 / AMD® FX 6350
    메모리: 6 GB RAM
    그래픽: Nvidia® GeForce™ GTX 660 (2GB) / AMD® Radeon™ HD 7870 (2GB) / Intel® Iris Pro™ 580 / Intel® Iris® Plus G7 / AMD® Radeon™ Vega 11
    저장공간: 8 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows® 10 Home 64 bit
    프로세서: Intel® Core™ i3-2120 / AMD® FX 6350
    메모리: 6 GB RAM
    그래픽: Nvidia® GeForce™ GTX 660 (2GB) / AMD® Radeon™ HD 7870 (2GB) / Intel® Iris Pro™ 580 / Intel® Iris® Plus G7 / AMD® Radeon™ Vega 11
    저장공간: 8 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">클레르 옵스퀴르 : 33 원정대</span> : 상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 : Windows 10
    프로세서 : Intel Core i7-8700K / AMD Ryzen 5 1600X"
    메모리 : 8GB RAM
    저장공간 : 55GB 사용 가능 공간
    그래픽 : NVIDIA GeForce GTX 1060 6 GB / AMD Radeon RX 5600 XT 6 GB / Intel Arc A380 6 GB
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 : Windows 10
    프로세서 : Intel Core i7-8700K / AMD Ryzen 5 1600X"
    메모리 : 8GB RAM
    저장공간 : 55GB 사용 가능 공간
    그래픽 : NVIDIA GeForce GTX 1060 6 GB / AMD Radeon RX 5600 XT 6 GB / Intel Arc A380 6 GB
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">클로저스</span> : 상으로  FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 : Windows 64비트 (Win10)
    CPU : Intel Core i5 이상
    RAM : 8GB 이상
    저장공간 : 30GB 이상
    그래픽 카드 : Nvidia GeForce 1050TI 이상 또는 동급 그래픽 카드 이상
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 : Windows 64비트 (Win10)
    CPU : Intel Core i5 이상
    RAM : 8GB 이상
    저장공간 : 30GB 이상
    그래픽 카드 : Nvidia GeForce 1050TI 이상 또는 동급 그래픽 카드 이상
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">킹덤 컴 : 딜리버런스 2</span> : 상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10 64-bit
    프로세서: Intel Core i5-8400 / AMD Ryzen 5 2600
    메모리: 16GB RAM
    저장공간: 100GB 사용 가능 공간
    그래픽: NVIDIA GeForce GTX 1060 (6GB) / AMD Radeon RX 580
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10 64-bit
    프로세서: Intel Core i5-8400 / AMD Ryzen 5 2600
    메모리: 16GB RAM
    저장공간: 100GB 사용 가능 공간
    그래픽: NVIDIA GeForce GTX 1060 (6GB) / AMD Radeon RX 580
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">킹덤 컴: 딜리버런스</span> : 상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: OS 64-bit Windows 7 or 64-bit Windows 8 (8.1) or Windows 10
    프로세서: Intel CPU Core i5-2500K 3.3GHz, AMD CPU Phenom II X4 940
    메모리: 8 GB RAM
    그래픽: Nvidia GPU GeForce GTX 660, AMD GPU Radeon HD 7870
    DirectX: 버전 11
    저장공간: 70 GB 사용 가능 공간
    사운드카드: Integrated
    추가 사항: SSD recommended</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: OS 64-bit Windows 7 or 64-bit Windows 8 (8.1) or Windows 10
    프로세서: Intel CPU Core i5-2500K 3.3GHz, AMD CPU Phenom II X4 940
    메모리: 8 GB RAM
    그래픽: Nvidia GPU GeForce GTX 660, AMD GPU Radeon HD 7870
    DirectX: 버전 11
    저장공간: 70 GB 사용 가능 공간
    사운드카드: Integrated
    추가 사항: SSD recommended</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">타이니 글레이드 (Tiny Glade)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10+
    프로세서: Intel Core i5 or AMD Ryzen
    메모리: 4 GB RAM
    그래픽: For 720p: Radeon R9 270, GeForce GTX 670, Intel Iris Xe, or similar (with 2+ GB of VRAM)
    저장공간: 3 GB 사용 가능 공간
    사운드카드: Yes, please</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10+
    프로세서: Intel Core i5 or AMD Ryzen
    메모리: 4 GB RAM
    그래픽: For 720p: Radeon R9 270, GeForce GTX 670, Intel Iris Xe, or similar (with 2+ GB of VRAM)
    저장공간: 3 GB 사용 가능 공간
    사운드카드: Yes, please</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">태양 제국의 죄악 II</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 v1607+ / 11 (64비트)
    프로세서: 4코어 프로세서 (인텔 코어 i5 5세대 또는 AMD 라이젠 2x00 시리즈)
    메모리: 8 GB RAM
    그래픽: 2GB VRAM이 장착된 3D 비디오 카드 (Nvidia GeForce 950 / AMD Radeon RX 450)
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 20 GB 사용 가능 공간
    추가 사항: 최소 화면 해상도 1920x1080</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 v1607+ / 11 (64비트)
    프로세서: 4코어 프로세서 (인텔 코어 i5 5세대 또는 AMD 라이젠 2x00 시리즈)
    메모리: 8 GB RAM
    그래픽: 2GB VRAM이 장착된 3D 비디오 카드 (Nvidia GeForce 950 / AMD Radeon RX 450)
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 20 GB 사용 가능 공간
    추가 사항: 최소 화면 해상도 1920x1080</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">토탈워 워해머3</span> : (하옵으로 120 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 *: Windows 7 64-bit
    프로세서: Intel i3/Ryzen 3 series
    메모리: 6 GB RAM
    그래픽: Nvidia GTX 900/AMD RX 400 series | Intel Iris Xe Graphics
    DirectX: 버전 11
    저장공간: 120 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 *: Windows 7 64-bit
    프로세서: Intel i3/Ryzen 3 series
    메모리: 6 GB RAM
    그래픽: Nvidia GTX 900/AMD RX 400 series | Intel Iris Xe Graphics
    DirectX: 버전 11
    저장공간: 120 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>(하옵 &#60; 중옵 &#60; 최상)</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">트리 오브 세이비어</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 *: Windows 7 (64-bit)
    프로세서: Intel i3
    그래픽: NVIDIA GeForce 200 Series or later
    DirectX: 버전 9.0
    네트워크: 초고속 인터넷 연결
    저장공간: 32 GB 사용 가능 공간
    추가 사항: Keyboard, Mouse</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 *: Windows 7 (64-bit)
    프로세서: Intel i3
    그래픽: NVIDIA GeForce 200 Series or later
    DirectX: 버전 9.0
    네트워크: 초고속 인터넷 연결
    저장공간: 32 GB 사용 가능 공간
    추가 사항: Keyboard, Mouse</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">파이널 판타지 16</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows® 10 / 11 64-bit
    프로세서: AMD Ryzen™ 5 1600 / Intel® Core™ i5-8400
    메모리: 16 GB RAM
    그래픽: AMD Radeon™ RX 5700 / Intel® Arc™ A580 / NVIDIA® GeForce® GTX 1070
    DirectX: 버전 12
    저장공간: 170 GB 사용 가능 공간
    추가 사항: 30FPS at 720p expected. SSD required. VRAM 8GB or above.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows® 10 / 11 64-bit
    프로세서: AMD Ryzen™ 5 1600 / Intel® Core™ i5-8400
    메모리: 16 GB RAM
    그래픽: AMD Radeon™ RX 5700 / Intel® Arc™ A580 / NVIDIA® GeForce® GTX 1070
    DirectX: 버전 12
    저장공간: 170 GB 사용 가능 공간
    추가 사항: 30FPS at 720p expected. SSD required. VRAM 8GB or above.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">파티 애니멀즈 (Party Animals)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10, 64-bit / Windows 11, 64-bit
    프로세서: Intel Core i5 / AMD equivalent
    메모리: 8 GB RAM
    그래픽: NVIDIA GTX 750-Ti / AMD RX 550, 2GB VRam
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 8 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10, 64-bit / Windows 11, 64-bit
    프로세서: Intel Core i5 / AMD equivalent
    메모리: 8 GB RAM
    그래픽: NVIDIA GTX 750-Ti / AMD RX 550, 2GB VRam
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 8 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">패스 오브 엑자일 2 (Path of Exile 2)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS: Windows 10
    Processor: 4 core 2.8GHz x64-compatible
    Memory: 8 GB RAM
    Graphics: NVIDIA® GeForce® GTX 960 or ATI Radeon™ RX 470
    DirectX: Version 11
    Network: Broadband Internet connection
    Storage: 100 GB available space</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS: Windows 10
    Processor: 4 core 2.8GHz x64-compatible
    Memory: 8 GB RAM
    Graphics: NVIDIA® GeForce® GTX 960 or ATI Radeon™ RX 470
    DirectX: Version 11
    Network: Broadband Internet connection
    Storage: 100 GB available space</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">패스 오브 엑자일(P.O.E)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- 운영 체제 (64 비트)	64비트 &#8211;Windows 7 / Windows 8 / Window10
    - 하드 디스크	30GB 이상 (NTFS 형식)
    - CPU X86 호환 2.6GHz 이상
    - 메모리 4GB RAM
    - 그래픽 카드 NVIDIA® GeForce® 650Ti GT 또는
    - ATI Radeon™ 7850 이상
    - DirectX 버전 11 이상</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- 운영 체제 (64 비트)	64비트 &#8211;Windows 7 / Windows 8 / Window10
    - 하드 디스크	30GB 이상 (NTFS 형식)
    - CPU X86 호환 2.6GHz 이상
    - 메모리 4GB RAM
    - 그래픽 카드 NVIDIA® GeForce® 650Ti GT 또는
    - ATI Radeon™ 7850 이상
    - DirectX 버전 11 이상</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 권장옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">팰월드(Palworld) / 팔월드</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영체제: Windows 10 or later (64-Bit)
    프로세서: i5-3570K 3.4 GHz 4 Core
    메모리: 16 GB RAM
    그래픽: GeForce GTX 1050 (2GB)
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 40 GB 사용 가능 공간
    추가 사항: Internet connection required for multiplayer. SSD required.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영체제: Windows 10 or later (64-Bit)
    프로세서: i5-3570K 3.4 GHz 4 Core
    메모리: 16 GB RAM
    그래픽: GeForce GTX 1050 (2GB)
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 40 GB 사용 가능 공간
    추가 사항: Internet connection required for multiplayer. SSD required.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">퍼스트 디센던트</span> : 울트라RT으로 100 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>최소:
    운영 체제: Windows 10 x64 20H2
    프로세서: Intel i5-3570 / AMD FX-8350
    메모리: 8 GB RAM
    그래픽: GeForce GTX 1050Ti or AMD Radeon RX 570 Video Memory 4GB
    DirectX: 버전 12
    네트워크: 초고속 인터넷 연결
    저장공간: 50 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>최소:
    운영 체제: Windows 10 x64 20H2
    프로세서: Intel i5-3570 / AMD FX-8350
    메모리: 8 GB RAM
    그래픽: GeForce GTX 1050Ti or AMD Radeon RX 570 Video Memory 4GB
    DirectX: 버전 12
    네트워크: 초고속 인터넷 연결
    저장공간: 50 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>울트라 &#60; 울트라RT</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">퍼스트 버서커: 카잔</span> : 상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 : Windows 10 64 bit
    프로세서 : Core i3-6300 / AMD Ryzen 3 1200
    메모리 : 12GB
    저장공간 :  70G
    그래픽 : 4GBs VRAM GeForce GTX 970 / Radeon RX 580 / Arc A580
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 : Windows 10 64 bit
    프로세서 : Core i3-6300 / AMD Ryzen 3 1200
    메모리 : 12GB
    저장공간 :  70G
    그래픽 : 4GBs VRAM GeForce GTX 970 / Radeon RX 580 / Arc A580
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">페르소나 3 리로드</span> : 최상(RT)으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10
    프로세서: Intel Core i5-2300, AMD FX-4350
    메모리: 8 GB RAM
    그래픽: NVIDIA GeForce GTX 650 Ti, 2 GB; AMD Radeon HD 7850, 2 GB
    DirectX: 버전 12
    저장공간: 30 GB 사용 가능 공간
    추가 사항: Performance Target: 720p, low graphics settings, @ 30 FPS</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10
    프로세서: Intel Core i5-2300, AMD FX-4350
    메모리: 8 GB RAM
    그래픽: NVIDIA GeForce GTX 650 Ti, 2 GB; AMD Radeon HD 7850, 2 GB
    DirectX: 버전 12
    저장공간: 30 GB 사용 가능 공간
    추가 사항: Performance Target: 720p, low graphics settings, @ 30 FPS</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상 &#60; 최상(RT)</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">페르소나5 더 로열</span> : 상옵으로 100 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10
    프로세서: Intel Core i7-4790, 3.4 GHz | AMD Ryzen 5 1500X, 3.5 GHz
    메모리: 8 GB RAM
    그래픽: Nvidia GeForce GTX 650 Ti, 2 GB | AMD Radeon R7 360, 2 GB
    DirectX: 버전 11
    저장공간: 41 GB 사용 가능 공간
    추가 사항: Low 720p @ 60 FPS. Requires a CPU</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10
    프로세서: Intel Core i7-4790, 3.4 GHz | AMD Ryzen 5 1500X, 3.5 GHz
    메모리: 8 GB RAM
    그래픽: Nvidia GeForce GTX 650 Ti, 2 GB | AMD Radeon R7 360, 2 GB
    DirectX: 버전 11
    저장공간: 41 GB 사용 가능 공간
    추가 사항: Low 720p @ 60 FPS. Requires a CPU</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">포르자 호라이즌5</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows 10 version 15063.0 or higher
    - CPU : Intel i5-4460 or AMD Ryzen 3 1200
    - 램 : 8GB RAM
    - 하드 : 110GB의 사용 가능한 공간
    - 그래픽 : NVidia GTX 970 OR AMD RX 470</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows 10 version 15063.0 or higher
    - CPU : Intel i5-4460 or AMD Ryzen 3 1200
    - 램 : 8GB RAM
    - 하드 : 110GB의 사용 가능한 공간
    - 그래픽 : NVidia GTX 970 OR AMD RX 470</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">풋볼매니저 2024</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS: Windows 7/8/8.1/10/11 및 업데이트 - 64비트
    프로세서: Intel Core 2 또는 AMD Athlon 64 X2 
    그래픽: Intel GMA X4500, NVIDIA GeForce 9600M GT, AMD/ATI Mobility Radeon HD 3650 - 256MB VRAM 및 DirectX® 11 필요 
    메모리: 4GB RAM
    저장 공간: 7GB 
    디스플레이: 1024x768 
    사양이 좋을수록 게임 성능이 향상됩니다.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS: Windows 7/8/8.1/10/11 및 업데이트 - 64비트
    프로세서: Intel Core 2 또는 AMD Athlon 64 X2 
    그래픽: Intel GMA X4500, NVIDIA GeForce 9600M GT, AMD/ATI Mobility Radeon HD 3650 - 256MB VRAM 및 DirectX® 11 필요 
    메모리: 4GB RAM
    저장 공간: 7GB 
    디스플레이: 1024x768 
    사양이 좋을수록 게임 성능이 향상됩니다.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">프로스트펑크 2 (Frostpunk 2)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10/11 (64-bit)
    프로세서: AMD Ryzen 5 / Intel Core i5 2.5 GHz
    메모리: 8 GB RAM
    그래픽: AMD RX 550 4 GB VRAM / NVIDIA GTX 1050Ti 4 GB VRAM / INTEL ARC A310 4GB VRAM
    DirectX: 버전 12
    저장공간: 30 GB 사용 가능 공간
    추가 사항: SSD required.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10/11 (64-bit)
    프로세서: AMD Ryzen 5 / Intel Core i5 2.5 GHz
    메모리: 8 GB RAM
    그래픽: AMD RX 550 4 GB VRAM / NVIDIA GTX 1050Ti 4 GB VRAM / INTEL ARC A310 4GB VRAM
    DirectX: 버전 12
    저장공간: 30 GB 사용 가능 공간
    추가 사항: SSD required.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">프로젝트 좀보이드 (Project Zomboid)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS: Windows 10, 64 Bit
    64bit OS required
    Processor: Intel 2.77GHz Quad-core
    Memory: 8Gb Ram
    Hard Disk Space: 5gig
    Video Card: Dedicated graphics card with 2 GB of RAM minimum, OpenGL 2.1 and GLSL 1.2 support (generally 2012 or newer)
    Sound: FMOD compatible sound card</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS: Windows 10, 64 Bit
    64bit OS required
    Processor: Intel 2.77GHz Quad-core
    Memory: 8Gb Ram
    Hard Disk Space: 5gig
    Video Card: Dedicated graphics card with 2 GB of RAM minimum, OpenGL 2.1 and GLSL 1.2 support (generally 2012 or newer)
    Sound: FMOD compatible sound card</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">플래닛 주</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 *: Windows 7 (SP1+)/8.1/10 64bit
    프로세서: Intel i5-2500 / AMD FX-6350
    메모리: 8 GB RAM
    그래픽: NVIDIA GeForce GTX 770 (2GB) / AMD Radeon R9 270X (2GB)
    저장공간: 16 GB 사용 가능 공간
    추가 사항: Minimum specifications may change during development</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 *: Windows 7 (SP1+)/8.1/10 64bit
    프로세서: Intel i5-2500 / AMD FX-6350
    메모리: 8 GB RAM
    그래픽: NVIDIA GeForce GTX 770 (2GB) / AMD Radeon R9 270X (2GB)
    저장공간: 16 GB 사용 가능 공간
    추가 사항: Minimum specifications may change during development</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">플래닛 코스터</span> : 상옵으로  FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 *:윈도우 7(SP1+)/8.1/10 64비트
    프로세서:인텔 i5-2300/AMD FX-4300
    메모리:8GB램
    제도법:엔비디아 GTX 560(2GB)/AMD 라데온 7850(2GB)
    다이렉트X:버전 11
    저장:사용 가능한 공간 8GB</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 *:윈도우 7(SP1+)/8.1/10 64비트
    프로세서:인텔 i5-2300/AMD FX-4300
    메모리:8GB램
    제도법:엔비디아 GTX 560(2GB)/AMD 라데온 7850(2GB)
    다이렉트X:버전 11
    저장:사용 가능한 공간 8GB</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">피파온라인4</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows 7/8/8.1/10 - 64-Bit / Android 버전 2.3.3 이상 / iOS 버전 7.0 이상
    - CPU : Intel Core i3-2100 @ 3.1GHz (or AMD Phenom 7950 Quad-Core, AMD Athlon II X4 620 equivalent)
    - 램 : 4GB
    - 하드 : 40GB
    - 그래픽 : Geforce GT 730, ATI Radeon HD 7570</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows 7/8/8.1/10 - 64-Bit / Android 버전 2.3.3 이상 / iOS 버전 7.0 이상
    - CPU : Intel Core i3-2100 @ 3.1GHz (or AMD Phenom 7950 Quad-Core, AMD Athlon II X4 620 equivalent)
    - 램 : 4GB
    - 하드 : 40GB
    - 그래픽 : Geforce GT 730, ATI Radeon HD 7570</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">하데스 2</span> : 최상으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 64-bit
    프로세서: Dual Core 2.4 GHz
    메모리: 8 GB RAM
    그래픽: GeForce GTX 950, Radeon R7 360, or Intel HD Graphics 630
    저장공간: 10 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 64-bit
    프로세서: Dual Core 2.4 GHz
    메모리: 8 GB RAM
    그래픽: GeForce GTX 950, Radeon R7 360, or Intel HD Graphics 630
    저장공간: 10 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">할로우 나이트</span> : 상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS - Windows 7 (64bit)
    CPU - Intel Core 2 Duo E5200
    램 - 4GB RAM
    하드 - 9GB 사용 가능 공간
    그래픽 - GeForce 9800GTX+ (1GB)
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS - Windows 7 (64bit)
    CPU - Intel Core 2 Duo E5200
    램 - 4GB RAM
    하드 - 9GB 사용 가능 공간
    그래픽 - GeForce 9800GTX+ (1GB)
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">헬다이버즈2</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>최소:
    64비트 프로세서와 운영 체제가 필요합니다
    운영체제: Windows 10
    프로세서: Intel Core i7-4790K or AMD Ryzen 5 1500X
    메모리: 8 GB RAM
    그래픽: NVIDIA GeForce GTX 1050 Ti or AMD Radeon RX 470
    저장공간: 100 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>최소:
    64비트 프로세서와 운영 체제가 필요합니다
    운영체제: Windows 10
    프로세서: Intel Core i7-4790K or AMD Ryzen 5 1500X
    메모리: 8 GB RAM
    그래픽: NVIDIA GeForce GTX 1050 Ti or AMD Radeon RX 470
    저장공간: 100 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">호그와트 레거시</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS	Windows 10 64비트
    CPU	Intel Core i5-6600 (3.3 GHz) 또는 AMD Ryzen 5 1400 (3.2 GHz)
    RAM	16 GB
    GPU	NVIDIA GeForce GTX 960 4GB 또는 AMD Radeon RX 470 4GB
    DX 버전	DX 12
    저장공간	85 GB HDD
    참고	SSD (선호), HDD (지원), 720p / 30 fps, 저품질 설정</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS	Windows 10 64비트
    CPU	Intel Core i5-6600 (3.3 GHz) 또는 AMD Ryzen 5 1400 (3.2 GHz)
    RAM	16 GB
    GPU	NVIDIA GeForce GTX 960 4GB 또는 AMD Radeon RX 470 4GB
    DX 버전	DX 12
    저장공간	85 GB HDD
    참고	SSD (선호), HDD (지원), 720p / 30 fps, 저품질 설정</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                </ul>
                        
                        <div class="detail_more on" data="158"><span>더보기 (총 158건)</span></div>
                    </div>
                                
                    <h3><span>QHD 해상도 (2560 X 1440)</span> 로 플레이할 경우</h3>
                    <div class="game_list hidden">
                        <ul>
                                                    <li>
                                - <span class="gname">APEX 레전드</span> : 중옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS: 64-bit Windows 7
    - CPU : AMD FX 4350 or Equivalent, Intel Core i3 6300 or Equivalent
    - 램 : 6GB RAM
    - 하드 : 56GB의 사용 가능한 공간
    - 그래픽 : AMD Radeon™ HD 7730, NVIDIA GeForce® GT 640</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS: 64-bit Windows 7
    - CPU : AMD FX 4350 or Equivalent, Intel Core i3 6300 or Equivalent
    - 램 : 6GB RAM
    - 하드 : 56GB의 사용 가능한 공간
    - 그래픽 : AMD Radeon™ HD 7730, NVIDIA GeForce® GT 640</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">Dragon Ball Sparking Zero</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10
    프로세서: Intel Core i5-9600K / AMD Ryzen 5 2600
    메모리: 8 GB RAM
    그래픽: Nvidia GeForce GTX 980 / AMD Radeon RX 590 / Intel Arc A750
    DirectX: 버전 12
    저장공간: 29 GB 사용 가능 공간
    추가 사항: Estimated performance: 1080p/60fps with graphics settings at "Low". Framerate might drop in graphics-intensive scenes. - 64-bit processor and operating system are required.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10
    프로세서: Intel Core i5-9600K / AMD Ryzen 5 2600
    메모리: 8 GB RAM
    그래픽: Nvidia GeForce GTX 980 / AMD Radeon RX 590 / Intel Arc A750
    DirectX: 버전 12
    저장공간: 29 GB 사용 가능 공간
    추가 사항: Estimated performance: 1080p/60fps with graphics settings at "Low". Framerate might drop in graphics-intensive scenes. - 64-bit processor and operating system are required.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">EA SPORTS FC™ 25</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10 - 64-Bit (Latest Update)
    프로세서: AMD Ryzen 5 1600 or Intel Core i5 6600k
    메모리: 8 GB RAM
    그래픽: AMD RX 570 or Nvidia GTX 1050 Ti
    DirectX: 버전 12
    네트워크: 초고속 인터넷 연결
    저장공간: 100 GB 사용 가능 공간
    사운드카드: DirectX: 12 Compatible video card or equivalent (feature level 12_0)</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10 - 64-Bit (Latest Update)
    프로세서: AMD Ryzen 5 1600 or Intel Core i5 6600k
    메모리: 8 GB RAM
    그래픽: AMD RX 570 or Nvidia GTX 1050 Ti
    DirectX: 버전 12
    네트워크: 초고속 인터넷 연결
    저장공간: 100 GB 사용 가능 공간
    사운드카드: DirectX: 12 Compatible video card or equivalent (feature level 12_0)</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">FC 24 (피파 24)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제: Windows 10 - 64-Bit
    프로세서: Intel Core i5-6600K @ 3.50GHz or AMD Ryzen 5 1600 @ 3.2 GHZ
    메모리: 8 GB RAM
    그래픽: NVIDIA GeForce GTX 1050 Ti 4GB or AMD Radeon RX 570 4GB
    DirectX: 버전 12
    네트워크: 초고속 인터넷 연결
    저장공간: 100 GB 사용 가능 공간
    추가 사항: DirectX: 12 Compatible video card or equivalent (feature level 12_0)</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제: Windows 10 - 64-Bit
    프로세서: Intel Core i5-6600K @ 3.50GHz or AMD Ryzen 5 1600 @ 3.2 GHZ
    메모리: 8 GB RAM
    그래픽: NVIDIA GeForce GTX 1050 Ti 4GB or AMD Radeon RX 570 4GB
    DirectX: 버전 12
    네트워크: 초고속 인터넷 연결
    저장공간: 100 GB 사용 가능 공간
    추가 사항: DirectX: 12 Compatible video card or equivalent (feature level 12_0)</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">GTA5</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- 운영체제: Windows 8.1 64비트, Windows 8 64비트, Windows 7 64비트 서비스 팩 1
    - 프로세서: 인텔 코어 2 쿼드 CPU Q6600 @ 2.40GHz (4 CPU) / AMD Phenom 9850 쿼드코어 프로세서(4 CPU) @ 2.5GHz
    - 메모리: 4 GB RAM
    - 그래픽: NVIDIA 9800 GT 1GB / AMD HD 4870 1GB (DX 10, 10.1, 11)
    - 저장공간: 72 GB 사용 가능 공간
    - 사운드카드: DirectX 10 100% 호환</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- 운영체제: Windows 8.1 64비트, Windows 8 64비트, Windows 7 64비트 서비스 팩 1
    - 프로세서: 인텔 코어 2 쿼드 CPU Q6600 @ 2.40GHz (4 CPU) / AMD Phenom 9850 쿼드코어 프로세서(4 CPU) @ 2.5GHz
    - 메모리: 4 GB RAM
    - 그래픽: NVIDIA 9800 GT 1GB / AMD HD 4870 1GB (DX 10, 10.1, 11)
    - 저장공간: 72 GB 사용 가능 공간
    - 사운드카드: DirectX 10 100% 호환</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">Metaphor: ReFantazio</span> : 중옵으로 100 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10
    프로세서: Intel Core i5-3470 or AMD FX-6300
    메모리: 6 GB RAM
    그래픽: NVIDIA GeForce GTX 750 Ti, 4GB or AMD Radeon R7 360, 4GB or Intel Arc A310, 4GB
    DirectX: 버전 11
    저장공간: 93 GB 사용 가능 공간
    추가 사항: 720p @ 30 FPS. A CPU with AVX support is required.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10
    프로세서: Intel Core i5-3470 or AMD FX-6300
    메모리: 6 GB RAM
    그래픽: NVIDIA GeForce GTX 750 Ti, 4GB or AMD Radeon R7 360, 4GB or Intel Arc A310, 4GB
    DirectX: 버전 11
    저장공간: 93 GB 사용 가능 공간
    추가 사항: 720p @ 30 FPS. A CPU with AVX support is required.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">NBA 2K25</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10 64-Bit (latest update)
    프로세서: Intel® Core™ i3-9100 or AMD Ryzen™ 3 1200
    메모리: 8 GB RAM
    그래픽: NVIDIA® GeForce® GTX 960 4 GB or AMD Radeon™ RX 570 4 GB or Intel® Arc™ A580
    DirectX: 버전 12
    네트워크: 초고속 인터넷 연결
    저장공간: 150 GB 사용 가능 공간
    추가 사항: SSD 필요. 듀얼 아날로그 게임패드 권장. 초기 설치에는 Steam 인증을 위한 일회성 인터넷 연결이 필요하며, 필요한 소프트웨어 설치(게임에 포함됨)에는 DirectX 및 Visual C++ Redistributable 2019가 포함됩니다. PC에서 NBA 2K25를 플레이하려면 AVX2를 지원하는 프로세서와 DirectX 기능 수준 12.0을 지원하는 그래픽 카드가 필요합니다.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10 64-Bit (latest update)
    프로세서: Intel® Core™ i3-9100 or AMD Ryzen™ 3 1200
    메모리: 8 GB RAM
    그래픽: NVIDIA® GeForce® GTX 960 4 GB or AMD Radeon™ RX 570 4 GB or Intel® Arc™ A580
    DirectX: 버전 12
    네트워크: 초고속 인터넷 연결
    저장공간: 150 GB 사용 가능 공간
    추가 사항: SSD 필요. 듀얼 아날로그 게임패드 권장. 초기 설치에는 Steam 인증을 위한 일회성 인터넷 연결이 필요하며, 필요한 소프트웨어 설치(게임에 포함됨)에는 DirectX 및 Visual C++ Redistributable 2019가 포함됩니다. PC에서 NBA 2K25를 플레이하려면 AVX2를 지원하는 프로세서와 DirectX 기능 수준 12.0을 지원하는 그래픽 카드가 필요합니다.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">P의 거짓</span> : 최상옵 + DLSS으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- 운영체제: Windows 10 64bit
    - 프로세서: AMD Ryzen 3 1200／Intel Core i3-6300
    - 메모리: 8 GB RAM
    - 그래픽: AMD Radeon RX 560 4GB / NVIDIA GeForce GTX 960 4GB
    - DirectX: 버전 12
    - 저장공간: 50 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- 운영체제: Windows 10 64bit
    - 프로세서: AMD Ryzen 3 1200／Intel Core i3-6300
    - 메모리: 8 GB RAM
    - 그래픽: AMD Radeon RX 560 4GB / NVIDIA GeForce GTX 960 4GB
    - DirectX: 버전 12
    - 저장공간: 50 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵 &#60; 최상옵 + DLSS</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">shape of dreams (셰이프 오브 드림즈)</span> : 상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS : Windows 10 x64 or newer
    CPU : Intel Core i5-6400 / AMD FX-8320
    램 : 8GB RAM
    하드 : 12GB 사용 가능 공간
    그래픽 : GeForce GTX 960 (2048 MB) / AMD Radeon R9 280 (2048 MB)
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS : Windows 10 x64 or newer
    CPU : Intel Core i5-6400 / AMD FX-8320
    램 : 8GB RAM
    하드 : 12GB 사용 가능 공간
    그래픽 : GeForce GTX 960 (2048 MB) / AMD Radeon R9 280 (2048 MB)
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">W.O.W(월드오브워크레프트)</span> : 중옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows® 7 64-bit
    - CPU : 4코어 3.0GHz 프로세서(4th Generation Intel® Core™ Haswell 또는 AMD Ryzen™ Zen)
    - 램 : 8GB RAM
    - 하드 : 128GB 이상의 SSD 여유 공간
    - 그래픽 : DirectX® 12 3GB GPU(NVIDIA® GeForce® GTX 900 시리즈, AMD™ GCN 4th gen 또는 Intel® Iris® Xe Graphics)</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows® 7 64-bit
    - CPU : 4코어 3.0GHz 프로세서(4th Generation Intel® Core™ Haswell 또는 AMD Ryzen™ Zen)
    - 램 : 8GB RAM
    - 하드 : 128GB 이상의 SSD 여유 공간
    - 그래픽 : DirectX® 12 3GB GPU(NVIDIA® GeForce® GTX 900 시리즈, AMD™ GCN 4th gen 또는 Intel® Iris® Xe Graphics)</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">갓 오브 워 라그나로크</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10 64-bit
    프로세서: Intel i5-4670k or AMD Ryzen 3 1200
    메모리: 8 GB RAM
    그래픽: NVIDIA GTX 1060 (6GB) or AMD RX 5500 XT (8GB) or Intel Arc A750
    DirectX: 버전 12
    저장공간: 190 GB 사용 가능 공간
    추가 사항: Windows version 2004 2020-05-27 19041</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10 64-bit
    프로세서: Intel i5-4670k or AMD Ryzen 3 1200
    메모리: 8 GB RAM
    그래픽: NVIDIA GTX 1060 (6GB) or AMD RX 5500 XT (8GB) or Intel Arc A750
    DirectX: 버전 12
    저장공간: 190 GB 사용 가능 공간
    추가 사항: Windows version 2004 2020-05-27 19041</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">건담 브레이커 4 (GUNDAM BREAKER 4)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10
    프로세서: Intel Core i5-2400 / AMD FX-6300
    메모리: 8 GB RAM
    그래픽: Nvidia GeForce GTX 760 / AMD Radeon RX 280 / Intel Arc A380
    DirectX: 버전 11
    저장공간: 14 GB 사용 가능 공간
    추가 사항: ※최대 해상도: 3840x2160
    예상 성능: 그래픽 설정 "낮음"에서 1080p/60fps. 그래픽이 많은 장면에서는 프레임 속도가 떨어질 수 있습니다. - 64비트 프로세서와 운영 체제가 필요합니다.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10
    프로세서: Intel Core i5-2400 / AMD FX-6300
    메모리: 8 GB RAM
    그래픽: Nvidia GeForce GTX 760 / AMD Radeon RX 280 / Intel Arc A380
    DirectX: 버전 11
    저장공간: 14 GB 사용 가능 공간
    추가 사항: ※최대 해상도: 3840x2160
    예상 성능: 그래픽 설정 "낮음"에서 1080p/60fps. 그래픽이 많은 장면에서는 프레임 속도가 떨어질 수 있습니다. - 64비트 프로세서와 운영 체제가 필요합니다.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">건파이어 리본(Gunfire Reborn)</span> : 상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 *: Windows 7
    프로세서: Intel Core i5-6400 / AMD FX-8320
    메모리: 4 GB RAM
    그래픽: GTX 960 / R9 280
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 4 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 *: Windows 7
    프로세서: Intel Core i5-6400 / AMD FX-8320
    메모리: 4 GB RAM
    그래픽: GTX 960 / R9 280
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 4 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">검은 신화: 오공</span> : 중옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 64-bit
    프로세서: Intel Core i5-8400 / AMD Ryzen 5 1600
    메모리: 16 GB RAM
    그래픽: NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 580 8GB
    DirectX: 버전 11
    저장공간: 130 GB 사용 가능 공간
    사운드카드: Windows Compatible Audio Device
    추가 사항: HDD Supported, SSD Recommended. The above specifications were tested with DLSS/FSR/XeSS enabled.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 64-bit
    프로세서: Intel Core i5-8400 / AMD Ryzen 5 1600
    메모리: 16 GB RAM
    그래픽: NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 580 8GB
    DirectX: 버전 11
    저장공간: 130 GB 사용 가능 공간
    사운드카드: Windows Compatible Audio Device
    추가 사항: HDD Supported, SSD Recommended. The above specifications were tested with DLSS/FSR/XeSS enabled.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">검은사막</span> : 최상옵으로 100 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : 32비트 또는 64비트의 Win7 또는 그 이상
    - CPU : Intel Core i3
    - 램 : 4GB RAM
    - 하드 : 27GB
    - 그래픽 : GTS 250 / GeForce 9800 GTX / Radeon HD 3870 X2</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : 32비트 또는 64비트의 Win7 또는 그 이상
    - CPU : Intel Core i3
    - 램 : 4GB RAM
    - 하드 : 27GB
    - 그래픽 : GTS 250 / GeForce 9800 GTX / Radeon HD 3870 X2</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵 &#60; 리마스터옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">고스트 리콘: 브레이크 포인트</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10 (64-bit versions only)
    프로세서: AMD Ryzen 3 1200 @3.1 GHz, Intel Core i5 4460 @ 3.2 GHz, or better
    메모리: 8 GB RAM
    그래픽: AMD Radeon R9 280X or NVIDIA GeForce GTX 960 (4 GB VRAM with Shader Model 5.0 or better)
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 67 GB 사용 가능 공간
    추가 사항: originally released for Windows 7, the game can be played on Windows 10 and Windows 11 OS</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10 (64-bit versions only)
    프로세서: AMD Ryzen 3 1200 @3.1 GHz, Intel Core i5 4460 @ 3.2 GHz, or better
    메모리: 8 GB RAM
    그래픽: AMD Radeon R9 280X or NVIDIA GeForce GTX 960 (4 GB VRAM with Shader Model 5.0 or better)
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 67 GB 사용 가능 공간
    추가 사항: originally released for Windows 7, the game can be played on Windows 10 and Windows 11 OS</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">고스트 오브 쓰시마</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>최소:
    64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 64-bit
    프로세서: Intel Core i3-7100 or AMD Ryzen 3 1200
    메모리: 8 GB RAM
    그래픽: NVIDIA GeForce GTX 960 or AMD Radeon RX 5500 XT
    저장공간: 75 GB 사용 가능 공간
    추가 사항: SSD Recommended</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>최소:
    64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 64-bit
    프로세서: Intel Core i3-7100 or AMD Ryzen 3 1200
    메모리: 8 GB RAM
    그래픽: NVIDIA GeForce GTX 960 or AMD Radeon RX 5500 XT
    저장공간: 75 GB 사용 가능 공간
    추가 사항: SSD Recommended</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">그랑블루 판타지 리링크</span> : 하옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>최소:
    64비트 프로세서와 운영 체제가 필요합니다
    운영체제: Windows® 10 (64bit 필수)
    프로세서: Intel® Core™ i3-9100 / AMD Ryzen™ 3 3200G
    메모리: 16 GB RAM
    그래픽: NVIDIA® GeForce GTX™ 1060 6GB / AMD Radeon™ RX 580 8GB
    DirectX: 버전 11
    저장공간: 90 GB 사용 가능 공간
    추가 사항: SSD 환경 권장 (그래픽 설정의 영상 품질 '표준'으로 1080p/30fps의 게임 플레이가 가능)</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>최소:
    64비트 프로세서와 운영 체제가 필요합니다
    운영체제: Windows® 10 (64bit 필수)
    프로세서: Intel® Core™ i3-9100 / AMD Ryzen™ 3 3200G
    메모리: 16 GB RAM
    그래픽: NVIDIA® GeForce GTX™ 1060 6GB / AMD Radeon™ RX 580 8GB
    DirectX: 버전 11
    저장공간: 90 GB 사용 가능 공간
    추가 사항: SSD 환경 권장 (그래픽 설정의 영상 품질 '표준'으로 1080p/30fps의 게임 플레이가 가능)</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">나 혼자만 레벨업 : ARISE OVERDRIVE</span> : 상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10 이상
    프로세서: Intel Core i5 4460 또는 동급 AMD 프로세서 
    메모리: 8 GB RAM
    그래픽:  NVIDIA GeForce GTX 1050 
    저장 공간 : 20GB 사용 가능 공간
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10 이상
    프로세서: Intel Core i5 4460 또는 동급 AMD 프로세서 
    메모리: 8 GB RAM
    그래픽:  NVIDIA GeForce GTX 1050 
    저장 공간 : 20GB 사용 가능 공간
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">나 혼자만 레벨업:어라이즈</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 (64 비트)
    프로세서: i3 3220 3.3 GHz 또는 동급의 AMD 프로세서
    메모리: 8 GB RAM
    그래픽: NVIDIA® GeForce GTX™ 1050 2GB
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 20 GB 사용 가능 공간
    추가 사항: SSD 사용을 권장 합니다.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 (64 비트)
    프로세서: i3 3220 3.3 GHz 또는 동급의 AMD 프로세서
    메모리: 8 GB RAM
    그래픽: NVIDIA® GeForce GTX™ 1050 2GB
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 20 GB 사용 가능 공간
    추가 사항: SSD 사용을 권장 합니다.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">나라카: 블레이드포인트</span> : 상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS : Windows 10 64-bit
    CPU : Intel i5 4th generation or AMD FX 6300 or equivalent
    램 : 8 GB RAM
    하드 : 20 GB 사용 가능 공간
    그래픽 : NVIDIA GeForce GTX 1050TI or equivalent
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS : Windows 10 64-bit
    CPU : Intel i5 4th generation or AMD FX 6300 or equivalent
    램 : 8 GB RAM
    하드 : 20 GB 사용 가능 공간
    그래픽 : NVIDIA GeForce GTX 1050TI or equivalent
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">나인 솔즈 (Nine Sols)</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10 64bit
    프로세서: AMD Athlon X4 | Intel Core i5 4460
    메모리: 8 GB RAM
    그래픽: Nvidia GTX 950 | AMD R7 370
    DirectX: 버전 11
    저장공간: 15 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10 64bit
    프로세서: AMD Athlon X4 | Intel Core i5 4460
    메모리: 8 GB RAM
    그래픽: Nvidia GTX 950 | AMD R7 370
    DirectX: 버전 11
    저장공간: 15 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">노 레스트 포 더 위키드</span> : 중옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS: Windows 10
    Processor: Intel Core i5-8400 / AMD Ryzen 5 2600
    Memory: 16 GB RAM
    Graphics: Nvidia GeForce GTX 970 / AMD Radeon RX Vega 56
    Storage: 35 GB available space
    Additional Notes: SSD Recommended</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS: Windows 10
    Processor: Intel Core i5-8400 / AMD Ryzen 5 2600
    Memory: 16 GB RAM
    Graphics: Nvidia GeForce GTX 970 / AMD Radeon RX Vega 56
    Storage: 35 GB available space
    Additional Notes: SSD Recommended</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">노 맨즈 스카이 (No Man‘s Sky)</span> : 최상옵으로 100 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10/11 (64-bit versions)
    프로세서: Intel Core i3
    메모리: 8 GB RAM
    그래픽: Nvidia GTX 1060 3GB, AMD RX 470 4GB, Intel UHD graphics 630
    저장공간: 15 GB 사용 가능 공간
    VR 지원: SteamVR</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10/11 (64-bit versions)
    프로세서: Intel Core i3
    메모리: 8 GB RAM
    그래픽: Nvidia GTX 1060 3GB, AMD RX 470 4GB, Intel UHD graphics 630
    저장공간: 15 GB 사용 가능 공간
    VR 지원: SteamVR</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">다잉 라이트: 더 비스트</span> : 상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS : Windows 10 or newer
    CPU : Intel i5-13400F / AMD Ryzen 7 5800X
    램 : 16 GB RAM
    하드 : 70 GB 사용 가능 공간
    그래픽 : NVIDIA GeForce 1060 / AMD Radeon 5500 XT / Intel ARC A750
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS : Windows 10 or newer
    CPU : Intel i5-13400F / AMD Ryzen 7 5800X
    램 : 16 GB RAM
    하드 : 70 GB 사용 가능 공간
    그래픽 : NVIDIA GeForce 1060 / AMD Radeon 5500 XT / Intel ARC A750
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">다크 소울 3</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 *: Windows 7 SP1 64bit, Windows 8.1 64bit Windows 10 64bit
    프로세서: Intel Core i3-2100 / AMD® FX-6300
    메모리: 4 GB RAM
    그래픽: NVIDIA® GeForce GTX 750 Ti / ATI Radeon HD 7950
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 25 GB 사용 가능 공간
    사운드카드: DirectX 11 sound device
    추가 사항: Internet connection required for online play and product activation</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 *: Windows 7 SP1 64bit, Windows 8.1 64bit Windows 10 64bit
    프로세서: Intel Core i3-2100 / AMD® FX-6300
    메모리: 4 GB RAM
    그래픽: NVIDIA® GeForce GTX 750 Ti / ATI Radeon HD 7950
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 25 GB 사용 가능 공간
    사운드카드: DirectX 11 sound device
    추가 사항: Internet connection required for online play and product activation</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">더 파이널스</span> : 하옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>CPU : Intel Core i5-6600K
    AMD Ryzen 5 1600
    RAM : 12 GB RAM
    그래픽카드 : NVIDIA GeForce GTX 1050 Ti
    AMD Radeon RX 580
    API : DirectX 12
    저장공간 : 20GB</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>CPU : Intel Core i5-6600K
    AMD Ryzen 5 1600
    RAM : 12 GB RAM
    그래픽카드 : NVIDIA GeForce GTX 1050 Ti
    AMD Radeon RX 580
    API : DirectX 12
    저장공간 : 20GB</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">던전앤파이터</span> : 상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : 윈도우7 64비트 이상
    - CPU : Intel Pentium Gold 이상 AMD Athlon 이상
    - 램 : 8GB 이상
    - 하드 : SSD 여유공간 40GB 이상
    - 그래픽 : Intel UHD Graphics 610 내장 그래픽 이상 AMD Radeon Vega 3 내장 그래픽 이상</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : 윈도우7 64비트 이상
    - CPU : Intel Pentium Gold 이상 AMD Athlon 이상
    - 램 : 8GB 이상
    - 하드 : SSD 여유공간 40GB 이상
    - 그래픽 : Intel UHD Graphics 610 내장 그래픽 이상 AMD Radeon Vega 3 내장 그래픽 이상</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">데드 바이 데이라이트</span> : 최상옵으로 120 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 64-bit Operating System
    프로세서: Intel Core i3-4170 or AMD FX-8120
    메모리: 8 GB RAM
    그래픽: DX11 Compatible GeForce GTX 460 1GB or AMD HD 6850 1GB
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 50 GB 사용 가능 공간
    사운드카드: DX11 compatible</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 64-bit Operating System
    프로세서: Intel Core i3-4170 or AMD FX-8120
    메모리: 8 GB RAM
    그래픽: DX11 Compatible GeForce GTX 460 1GB or AMD HD 6850 1GB
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 50 GB 사용 가능 공간
    사운드카드: DX11 compatible</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">데드 아일랜드 2</span> : 중옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 : Windows 10
    프로세서 : AMD FX-9590 / Intel Core i7-7700HQ
    메모리 : 10GB
    스토리지 : 70GB
    DirectX :12
    그래픽 카드 : Radeon R9 390X (8192 VRAM) / GeForce GTX 1060 (6144 VRAM)</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 : Windows 10
    프로세서 : AMD FX-9590 / Intel Core i7-7700HQ
    메모리 : 10GB
    스토리지 : 70GB
    DirectX :12
    그래픽 카드 : Radeon R9 390X (8192 VRAM) / GeForce GTX 1060 (6144 VRAM)</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">데드록 (Deadlock)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: 미정
    프로세서: 미정
    그래픽: 미정
    사운드카드: 미정</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: 미정
    프로세서: 미정
    그래픽: 미정
    사운드카드: 미정</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">데몬 엑스 마키나: 타이타닉 사이온</span> : 상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS : Windows 8.1/10
    CPU :  Intel i5-3470 / AMD FX-8300
    램 : 6GB RAM
    하드 : 13GB 사용 가능 공간
    그래픽 : NVIDIA Geforce GTX 660 / Radeon HD7870
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS : Windows 8.1/10
    CPU :  Intel i5-3470 / AMD FX-8300
    램 : 6GB RAM
    하드 : 13GB 사용 가능 공간
    그래픽 : NVIDIA Geforce GTX 660 / Radeon HD7870
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">데스티니 가디언즈 2</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 *: Windows® 7 / Windows® 8.1 / Windows® 10 64-bit (latest Service Pack)
    프로세서: Intel® Core™ i3 3250 3.5 GHz or Intel Pentium G4560 3.5 GHz / AMD FX-4350 4.2 GHz
    메모리: 6 GB RAM
    그래픽: NVIDIA® GeForce® GTX 660 2GB or GTX 1050 2GB / AMD Radeon HD 7850 2GB
    네트워크: 초고속 인터넷 연결
    저장공간: 105 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 *: Windows® 7 / Windows® 8.1 / Windows® 10 64-bit (latest Service Pack)
    프로세서: Intel® Core™ i3 3250 3.5 GHz or Intel Pentium G4560 3.5 GHz / AMD FX-4350 4.2 GHz
    메모리: 6 GB RAM
    그래픽: NVIDIA® GeForce® GTX 660 2GB or GTX 1050 2GB / AMD Radeon HD 7850 2GB
    네트워크: 초고속 인터넷 연결
    저장공간: 105 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">데이브 더 다이브</span> : 최상으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 *: Windows 7 64 bit
    프로세서: Intel Core i3 Dual Core
    메모리: 8 GB RAM
    그래픽: NVIDIA Geforce GTS 450 / AMD Radeon HD 5570
    DirectX: 버전 11
    저장공간: 10 GB 사용 가능 공간
    사운드카드: Windows Compatible Audio Device</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 *: Windows 7 64 bit
    프로세서: Intel Core i3 Dual Core
    메모리: 8 GB RAM
    그래픽: NVIDIA Geforce GTS 450 / AMD Radeon HD 5570
    DirectX: 버전 11
    저장공간: 10 GB 사용 가능 공간
    사운드카드: Windows Compatible Audio Device</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">도타 2</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 *: Windows 7 이상
    프로세서: Intel 또는 AMD 2.8GHz 듀얼 코어 프로세서
    메모리: 4 GB RAM
    그래픽: NVIDIA GeForce 8600/9600GT, ATI/AMD Radeon HD2600/3600
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 60 GB 사용 가능 공간
    사운드카드: DirectX 호환
    * 2024년 1월 1일부터 Steam 클라이언트는 Windows 10 이상 버전만 지원합니다.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 *: Windows 7 이상
    프로세서: Intel 또는 AMD 2.8GHz 듀얼 코어 프로세서
    메모리: 4 GB RAM
    그래픽: NVIDIA GeForce 8600/9600GT, ATI/AMD Radeon HD2600/3600
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 60 GB 사용 가능 공간
    사운드카드: DirectX 호환
    * 2024년 1월 1일부터 Steam 클라이언트는 Windows 10 이상 버전만 지원합니다.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">듄: 어웨이크닝</span> : 상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS : Windows 10 64-bit 이상
    CPU : Intel Core i5-7400 / AMD Ryzen 3 1200
    램 : 16GB RAM
    하드 : 60GB 사용 가능 공간
    그래픽 : NVIDIA GeForce GTX 1060 (6GB) / AMD Radeon 5600XT (6GB)</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS : Windows 10 64-bit 이상
    CPU : Intel Core i5-7400 / AMD Ryzen 3 1200
    램 : 16GB RAM
    하드 : 60GB 사용 가능 공간
    그래픽 : NVIDIA GeForce GTX 1060 (6GB) / AMD Radeon 5600XT (6GB)</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">드래곤즈 도그마 2</span> : 하옵으로 30 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10 (64 bit)/Windows 11 (64 bit)
    프로세서: Intel Core i5 10600 / AMD Ryzen 5 3600
    메모리: 16 GB RAM
    그래픽: NVIDIA GeForce GTX 1070 / AMD Radeon RX 5500 XT with 8GB VRAM
    DirectX: 버전 12
    네트워크: 초고속 인터넷 연결
    추가 사항: 1080p/30fps 게임 플레이가 가능합니다. ※부하가 높은 상황에서는 프레임 속도가 떨어질 수 있습니다. 레이 트레이싱을 사용하려면 NVIDIA GeForce RTX 2080 Ti 또는 AMD Radeon RX 6800 그래픽 카드가 필요합니다.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10 (64 bit)/Windows 11 (64 bit)
    프로세서: Intel Core i5 10600 / AMD Ryzen 5 3600
    메모리: 16 GB RAM
    그래픽: NVIDIA GeForce GTX 1070 / AMD Radeon RX 5500 XT with 8GB VRAM
    DirectX: 버전 12
    네트워크: 초고속 인터넷 연결
    추가 사항: 1080p/30fps 게임 플레이가 가능합니다. ※부하가 높은 상황에서는 프레임 속도가 떨어질 수 있습니다. 레이 트레이싱을 사용하려면 NVIDIA GeForce RTX 2080 Ti 또는 AMD Radeon RX 6800 그래픽 카드가 필요합니다.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">디아블로2 레저렉션</span> : 상옵으로 100 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : 윈도우® 10
    - CPU : 인텔® 코어 i3-3250 또는 AMD FX-4350
    - 램 : 8 GB RAM
    - 하드 : 30 GB
    - 그래픽 : Nvidia GTX 660 또는 AMD Radeon HD 7850</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : 윈도우® 10
    - CPU : 인텔® 코어 i3-3250 또는 AMD FX-4350
    - 램 : 8 GB RAM
    - 하드 : 30 GB
    - 그래픽 : Nvidia GTX 660 또는 AMD Radeon HD 7850</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">디아블로4</span> : 풀옵(DLSS/FSR)으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : 64비트 Windows® 10 버전 1909 이상
    - CPU : Intel® Core™ i5-2500K 또는 AMD™ FX-8350
    - 램 : 8GB RAM
    - 하드 : 여유 공간이 90GB 이상 있는 SDD
    - 그래픽 : NVIDIA® GeForce® GTX 660 또는 AMD Radeon™ R9 280 - DirectX® 12 호환 시스템</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : 64비트 Windows® 10 버전 1909 이상
    - CPU : Intel® Core™ i5-2500K 또는 AMD™ FX-8350
    - 램 : 8GB RAM
    - 하드 : 여유 공간이 90GB 이상 있는 SDD
    - 그래픽 : NVIDIA® GeForce® GTX 660 또는 AMD Radeon™ R9 280 - DirectX® 12 호환 시스템</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 풀옵(DLSS/FSR)</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">디제이맥스 리스펙트 V</span> : 최상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7, 8.1, 10 (64bit)
    프로세서: Intel Core 2 Duo E8400 3.0GHz AMD Athlon 64 X2 6000+ 3.0GHz
    메모리: 4 GB RAM
    그래픽: Nvidia® GTX 460 or AMD HD 5850 or better
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 100 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7, 8.1, 10 (64bit)
    프로세서: Intel Core 2 Duo E8400 3.0GHz AMD Athlon 64 X2 6000+ 3.0GHz
    메모리: 4 GB RAM
    그래픽: Nvidia® GTX 460 or AMD HD 5850 or better
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 100 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">딥 락 갤럭틱: 서바이벌</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영체제: Win 10
    프로세서: Intel i5-4590 or similar
    메모리: 8 GB RAM
    그래픽: Geforce GTX 1050 or similar
    저장공간: 2 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영체제: Win 10
    프로세서: Intel i5-4590 or similar
    메모리: 8 GB RAM
    그래픽: Geforce GTX 1050 or similar
    저장공간: 2 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">라스트 에포크</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 Windows 10 64-bit
    프로세서 Intel Core i5-2500 / AMD FX-4350
    메모리 8 GB RAM
    그래픽 카드 NVIDIA GeForce GTX 660 Ti / AMD Radeon R9 270 with 3 GB+ of VRAM
    API DirectX 11
    저장 공간 20 GB
    추가 사항 SSD 강력 권장</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 Windows 10 64-bit
    프로세서 Intel Core i5-2500 / AMD FX-4350
    메모리 8 GB RAM
    그래픽 카드 NVIDIA GeForce GTX 660 Ti / AMD Radeon R9 270 with 3 GB+ of VRAM
    API DirectX 11
    저장 공간 20 GB
    추가 사항 SSD 강력 권장</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">락다운 프로토콜</span> : 상으로  FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 : Windows 10
    프로세서 : Intel i3-4150 / Ryzen 3 1200
    메모리 : 2GB RAM
    저장공간 : 2GB 사용 가능 공간
    그래픽 : NVIDIA GTX 1050
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 : Windows 10
    프로세서 : Intel i3-4150 / Ryzen 3 1200
    메모리 : 2GB RAM
    저장공간 : 2GB 사용 가능 공간
    그래픽 : NVIDIA GTX 1050
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">러스트</span> : 상으로  FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 : Windows 7 64 비트
    CPU : Intel Core i7-3770 / AMD FX-9590 이상
    RAM : 8GB RAM
    저장공간 : 10GB 여유 공간
    그래픽 카드 : GTX 670 2GB / AMD R9 280
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 : Windows 7 64 비트
    CPU : Intel Core i7-3770 / AMD FX-9590 이상
    RAM : 8GB RAM
    저장공간 : 10GB 여유 공간
    그래픽 카드 : GTX 670 2GB / AMD R9 280
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">레드 데드 리뎀션2</span> : 상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows 7-Service Pack 1 (6.1.7601)
    - CPU : Intel® Core ™ i5-2500K / AMD FX-6300
    - 램 : 8GB
    - 하드 : 150GB
    - 그래픽 : Nvidia GeForce GTX 770 2GB / AMD Radeon R9280 3GB</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows 7-Service Pack 1 (6.1.7601)
    - CPU : Intel® Core ™ i5-2500K / AMD FX-6300
    - 램 : 8GB
    - 하드 : 150GB
    - 그래픽 : Nvidia GeForce GTX 770 2GB / AMD Radeon R9280 3GB</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>XBOX옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">레디 오어 낫</span> : 중옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 *: 64-bit Windows 7, Windows 8.1, Windows 10
    프로세서: Intel Core i5-4430 / AMD FX-6300
    메모리: 8 GB RAM
    그래픽: NVIDIA GeForce GTX 960 2GB / AMD Radeon R7 370 2GB
    DirectX: 버전 11
    저장공간: 90 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 *: 64-bit Windows 7, Windows 8.1, Windows 10
    프로세서: Intel Core i5-4430 / AMD FX-6300
    메모리: 8 GB RAM
    그래픽: NVIDIA GeForce GTX 960 2GB / AMD Radeon R7 370 2GB
    DirectX: 버전 11
    저장공간: 90 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">레인보우식스 시즈</span> : 상으로  FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 : Windows 10 / 11 64-bit
    CPU : Intel Core i3 560 3.3 GHz or AMD Phenom II X4 945 3.0 GHz
    RAM : 8 GB RAM
    저장공간 : 61 GB 사용 가능 공간
    그래픽 카드 : NVIDIA GeForce GTX 460 or AMD Radeon HD 5870
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 : Windows 10 / 11 64-bit
    CPU : Intel Core i3 560 3.3 GHz or AMD Phenom II X4 945 3.0 GHz
    RAM : 8 GB RAM
    저장공간 : 61 GB 사용 가능 공간
    그래픽 카드 : NVIDIA GeForce GTX 460 or AMD Radeon HD 5870
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">레전드 오브 모탈(Legend of Mortal)</span> : 최상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 or higher
    프로세서: Intel Core i3
    메모리: 8 GB RAM
    그래픽: GeForce® GT1030 or higher
    DirectX: 버전 11
    저장공간: 5 GB 사용 가능 공간
    사운드카드: DirectX compatible
    추가 사항: Recommended resolution 1920x1080</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 or higher
    프로세서: Intel Core i3
    메모리: 8 GB RAM
    그래픽: GeForce® GT1030 or higher
    DirectX: 버전 11
    저장공간: 5 GB 사용 가능 공간
    사운드카드: DirectX compatible
    추가 사항: Recommended resolution 1920x1080</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">로드나인</span> : 상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS: Windows 7(SP+1) 64-bit 이상 / Android 버전 7.0 이상 / iOS 13.0 이상
    CPU: IntelCore i5-6500 2.6Ghz 이상
    램: 8GB 이상
    하드: 50GB SSD 이상
    그래픽: NVIDIA GeForce GTX 960 4GB 이상</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS: Windows 7(SP+1) 64-bit 이상 / Android 버전 7.0 이상 / iOS 13.0 이상
    CPU: IntelCore i5-6500 2.6Ghz 이상
    램: 8GB 이상
    하드: 50GB SSD 이상
    그래픽: NVIDIA GeForce GTX 960 4GB 이상</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">로블록스</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제: Windows 7, 8, 8.1, 10, 11, OS X 10.10 Yosemite 이상
    그래픽 카드: DirectX 10 및 Shader Model 2.0 지원
    프로세서: 1.6GHz 이상 최신 프로세서 (2005~)
    메모리: 1GB
    저장 공간: 20MB
    API: DirectX 10, 11[25], Vulkan[26], Metal[27]
    인터넷: 4-8 Mb/s</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제: Windows 7, 8, 8.1, 10, 11, OS X 10.10 Yosemite 이상
    그래픽 카드: DirectX 10 및 Shader Model 2.0 지원
    프로세서: 1.6GHz 이상 최신 프로세서 (2005~)
    메모리: 1GB
    저장 공간: 20MB
    API: DirectX 10, 11[25], Vulkan[26], Metal[27]
    인터넷: 4-8 Mb/s</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">로스트아크</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows 10권장 (Windows 7 sp1 이상 지원, 64bit 운영체제만 지원)
    - CPU : Intel i3이상 / Ryzen 3이상
    - 램 : 8GB 이상
    - 하드 : 50GB 이상
    - 그래픽 : NVIDIA GeForce GTX 460 혹은 AMD Radeon HD 6850 이상</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows 10권장 (Windows 7 sp1 이상 지원, 64bit 운영체제만 지원)
    - CPU : Intel i3이상 / Ryzen 3이상
    - 램 : 8GB 이상
    - 하드 : 50GB 이상
    - 그래픽 : NVIDIA GeForce GTX 460 혹은 AMD Radeon HD 6850 이상</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">루마섬</span> : 상으로  FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 : Windows 10
    프로세서 : Intel i5
    메모리 : 8 GB 
    저장공간 : 7GB 사용 가능 공간
    그래픽 : NVIDIA GTX 1060
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 : Windows 10
    프로세서 : Intel i5
    메모리 : 8 GB 
    저장공간 : 7GB 사용 가능 공간
    그래픽 : NVIDIA GTX 1060
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">리그오브레전드</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows 7, Windows 8 또는 Windows 10 정품 (x86 32bit 또는 x64)
    - CPU : Intel: Core i3-530 AMD: A6-3650 ARM: 미지원
    - 램 : 2GB
    - 하드 : HDD 16GB 이상
    - 그래픽 : NVidia: GeForce 9600GT AMD: HD 6570 Intel: Intel HD 4600 내장 그래픽 (비디오 메모리 1GB 이상)</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows 7, Windows 8 또는 Windows 10 정품 (x86 32bit 또는 x64)
    - CPU : Intel: Core i3-530 AMD: A6-3650 ARM: 미지원
    - 램 : 2GB
    - 하드 : HDD 16GB 이상
    - 그래픽 : NVidia: GeForce 9600GT AMD: HD 6570 Intel: Intel HD 4600 내장 그래픽 (비디오 메모리 1GB 이상)</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">리스크 오브 레인 2 (Risk of Rain 2)</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 or newer, 64-bit
    프로세서: Intel Core i3-6100 / AMD FX-8350
    메모리: 4 GB RAM
    그래픽: GTX 580 / AMD HD 7870
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 4 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 or newer, 64-bit
    프로세서: Intel Core i3-6100 / AMD FX-8350
    메모리: 4 GB RAM
    그래픽: GTX 580 / AMD HD 7870
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 4 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">리씰컴퍼니</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>시스템 최소 요구 사항
    운영체제 Windows 10
    프로세서 Intel Core i5-7400 CPU @ 3.00GHz ; Shader Model 5
    그래픽 NVIDIA GeForce GTX 1050
    API DirectX 버전 11
    저장 공간 1 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>시스템 최소 요구 사항
    운영체제 Windows 10
    프로세서 Intel Core i5-7400 CPU @ 3.00GHz ; Shader Model 5
    그래픽 NVIDIA GeForce GTX 1050
    API DirectX 버전 11
    저장 공간 1 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">림버스 컴퍼니 (Limbus Company)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10
    프로세서: Intel Core i5
    메모리: 8 GB RAM
    그래픽: GeForce GT 1030
    DirectX: 버전 10
    저장공간: 10 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10
    프로세서: Intel Core i5
    메모리: 8 GB RAM
    그래픽: GeForce GT 1030
    DirectX: 버전 10
    저장공간: 10 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">림월드</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 *: Windows 7
    프로세서: Core 2 Duo
    메모리: 4 GB RAM
    그래픽: Intel HD Graphics 4000 or other shader model 4.0
    저장공간: 1 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 *: Windows 7
    프로세서: Core 2 Duo
    메모리: 4 GB RAM
    그래픽: Intel HD Graphics 4000 or other shader model 4.0
    저장공간: 1 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">마비노기</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS: Windows 7 64bit 이상
    CPU: Intel Core i3 (1세대) 2.5GHz 이상
    램: 4GB 이상
    하드: 10GB 이상
    그래픽: Geforce 8600GT 이상</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS: Windows 7 64bit 이상
    CPU: Intel Core i3 (1세대) 2.5GHz 이상
    램: 4GB 이상
    하드: 10GB 이상
    그래픽: Geforce 8600GT 이상</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">마운트 앤 블레이드 2: 배너로드</span> : 중옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 (64-bit only)
    프로세서: Intel® Core™ i3-8100/AMD Ryzen™ 3 1200
    메모리: 6 GB RAM
    그래픽: Intel® UHD Graphics 630/NVIDIA® GeForce® GTX 660 2GB/AMD Radeon™ HD 7850 2GB
    저장공간: 60 GB 사용 가능 공간
    추가 사항: 통합형 GPU에는 2GB의 시스템 RAM이 추가적으로 필요합니다. 이 예상치는 최종 출시 이후에 변경될 수 있습니다.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 (64-bit only)
    프로세서: Intel® Core™ i3-8100/AMD Ryzen™ 3 1200
    메모리: 6 GB RAM
    그래픽: Intel® UHD Graphics 630/NVIDIA® GeForce® GTX 660 2GB/AMD Radeon™ HD 7850 2GB
    저장공간: 60 GB 사용 가능 공간
    추가 사항: 통합형 GPU에는 2GB의 시스템 RAM이 추가적으로 필요합니다. 이 예상치는 최종 출시 이후에 변경될 수 있습니다.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">마인크래프트</span> : 중옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>CPU: 인텔 코어 i3-3210 3.2 GHz / AMD A8-7600 APU 3.1 GHz 와 동급의 제품
    RAM: 4GB (여유공간 2GB)
    GPU (내장): OpenGL 4.4*가 내장된 인텔 HD Graphics 4000 (아이비브릿지) / AMD 라데온 R5 시리즈 (카베리)
    GPU (외장): OpenGL 4.4가 내장된 Nvidia 지포스 400 Series 또는 AMD 라데온 HD 7000 시리즈
    저장장치: 최소 1GB (게임 파일 자체는 180MB이지만, 맵과 기타 파일을 위한 공간이 필요)
    운영체제:
    - 윈도우: 윈도우 7 이상
    - 매킨토시: OS X 10.9 Maverick
    - 리눅스: 2014년 이후의 모든 배포판
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>CPU: 인텔 코어 i3-3210 3.2 GHz / AMD A8-7600 APU 3.1 GHz 와 동급의 제품
    RAM: 4GB (여유공간 2GB)
    GPU (내장): OpenGL 4.4*가 내장된 인텔 HD Graphics 4000 (아이비브릿지) / AMD 라데온 R5 시리즈 (카베리)
    GPU (외장): OpenGL 4.4가 내장된 Nvidia 지포스 400 Series 또는 AMD 라데온 HD 7000 시리즈
    저장장치: 최소 1GB (게임 파일 자체는 180MB이지만, 맵과 기타 파일을 위한 공간이 필요)
    운영체제:
    - 윈도우: 윈도우 7 이상
    - 매킨토시: OS X 10.9 Maverick
    - 리눅스: 2014년 이후의 모든 배포판
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">매너 로드</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows® 10 (64-bit)
    프로세서: Intel® Core™ i5-4670 (quad-core) / AMD® FX-Series™ FX-4350 (quad-core)
    메모리: 8 GB RAM
    그래픽: NVIDIA® GeForce® GTX 1050 (2 GB) / AMD® Radeon™ RX-460 (4 GB) / Intel® Arc™ A380 (6 GB)
    DirectX: 버전 12
    저장공간: 15 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows® 10 (64-bit)
    프로세서: Intel® Core™ i5-4670 (quad-core) / AMD® FX-Series™ FX-4350 (quad-core)
    메모리: 8 GB RAM
    그래픽: NVIDIA® GeForce® GTX 1050 (2 GB) / AMD® Radeon™ RX-460 (4 GB) / Intel® Arc™ A380 (6 GB)
    DirectX: 버전 12
    저장공간: 15 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">메이플스토리</span> : 상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- 운영체제	최신 업데이트된 Window 7 64비트 이상
    - CPU	Pentium Dual Core급 이상
    - RAM	4GB 이상
    - 하드 디스크	여유공간 20GB 이상
    - 그래픽카드	Geforce 9600 GT / Radeon HD 5670 이상 (Shader 3.0 이상 지원 그래픽카드)
    - DirectX	9.0 이상</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- 운영체제	최신 업데이트된 Window 7 64비트 이상
    - CPU	Pentium Dual Core급 이상
    - RAM	4GB 이상
    - 하드 디스크	여유공간 20GB 이상
    - 그래픽카드	Geforce 9600 GT / Radeon HD 5670 이상 (Shader 3.0 이상 지원 그래픽카드)
    - DirectX	9.0 이상</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">명조: 워더링 웨이브</span> : (최상옵)으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 : Windows10 64비트 
    CPU : intel i5(9세대)/Ryzen 2700 
    그래픽카드 : GTX 1060/RX 570/11세대 intel 내장 그래픽 
    메모리 : 16GB 이상 
    저장 공간 : 25GB, SSD 설치 권장
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 : Windows10 64비트 
    CPU : intel i5(9세대)/Ryzen 2700 
    그래픽카드 : GTX 1060/RX 570/11세대 intel 내장 그래픽 
    메모리 : 16GB 이상 
    저장 공간 : 25GB, SSD 설치 권장
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>(최상옵)</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">몬스터 헌터 와일즈</span> : 상옵으로  FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다. 

    운영체제  Windows 10 64-bit
    프로세서  Intel Core i5 -8400 / AMD Ryzen 5 1600
    메모리  16 GB RAM
    그래픽  NVDIA GeForce GTX 1060 6GB / AMD Radeon RX580 8GB
    DirectX  버전 11
    저장공간  130 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다. 

    운영체제  Windows 10 64-bit
    프로세서  Intel Core i5 -8400 / AMD Ryzen 5 1600
    메모리  16 GB RAM
    그래픽  NVDIA GeForce GTX 1060 6GB / AMD Radeon RX580 8GB
    DirectX  버전 11
    저장공간  130 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">몬스터 헌터 월드</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS	WINDOWS® 7, 8, 8.1, 10 (64-BIT 필수)
    CPU	Intel® Core™ i5 4460 or Core™ i3 9100F or AMD FX™-6300 or Ryzen™ 3 3200G
    메모리	8GB RAM
    스토리지	52 GB 이용 가능
    그래픽	NVIDIA® GeForce® GTX 760 or GTX1050 or AMD Radeon™ R7 260x or RX 560
    DirectX	Version 11
    사운드 카드	DirectSound 대응(DirectX® 9.0c 이상)
    네트워크	광대역 인터넷 접속
    비고1 : 그래픽 'Low' 설정으로, 1080p/30fps의 게임 플레이가 가능합니다.
    비고2 : 64비트 CPU와 오페레이팅 시스템이 필요합니다.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS	WINDOWS® 7, 8, 8.1, 10 (64-BIT 필수)
    CPU	Intel® Core™ i5 4460 or Core™ i3 9100F or AMD FX™-6300 or Ryzen™ 3 3200G
    메모리	8GB RAM
    스토리지	52 GB 이용 가능
    그래픽	NVIDIA® GeForce® GTX 760 or GTX1050 or AMD Radeon™ R7 260x or RX 560
    DirectX	Version 11
    사운드 카드	DirectSound 대응(DirectX® 9.0c 이상)
    네트워크	광대역 인터넷 접속
    비고1 : 그래픽 'Low' 설정으로, 1080p/30fps의 게임 플레이가 가능합니다.
    비고2 : 64비트 CPU와 오페레이팅 시스템이 필요합니다.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">바이오하자드 RE:4</span> : 하옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>Requires a 64-bit processor and operating system
    - OS: Windows 10 (64 bit)
    - Processor: AMD Ryzen 3 1200 / Intel Core i5-7500
    - Memory: 8 GB RAM
    - Graphics: AMD Radeon RX 560 with 4GB VRAM / NVIDIA GeForce GTX 1050 Ti with 4GB VRAM
    - DirectX: Version 12</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>Requires a 64-bit processor and operating system
    - OS: Windows 10 (64 bit)
    - Processor: AMD Ryzen 3 1200 / Intel Core i5-7500
    - Memory: 8 GB RAM
    - Graphics: AMD Radeon RX 560 with 4GB VRAM / NVIDIA GeForce GTX 1050 Ti with 4GB VRAM
    - DirectX: Version 12</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">발더스 게이트3</span> : 상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows 10 64 비트
    - CPU : 인텔 i5-4690 / AMD FX 4350
    - 램 : 8GB RAM
    - 하드 : 70GB의 사용 가능한 공간
    - 그래픽 : Nvidia GTX 780 / AMD Radeon R9 280X</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows 10 64 비트
    - CPU : 인텔 i5-4690 / AMD FX 4350
    - 램 : 8GB RAM
    - 하드 : 70GB의 사용 가능한 공간
    - 그래픽 : Nvidia GTX 780 / AMD Radeon R9 280X</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">발로란트</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows 10 (빌드 17134 이상) 또는 11, 64비트
    - CPU : Intel Core 2 Duo E8400
    - 램 : 4GB
    - 그래픽 : Intel HD 4000</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows 10 (빌드 17134 이상) 또는 11, 64비트
    - CPU : Intel Core 2 Duo E8400
    - 램 : 4GB
    - 그래픽 : Intel HD 4000</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">배틀그라운드</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows 7 64-bit 이상
    - CPU : intel Core i5-4430, AMD FX-6300
    - 램 : 8GB
    - 하드 : 30GB 사용 가능 공간
    - 그래픽 : nVidia GeForce GTX 960 2GB, AMD Radeon R7 370 2GB</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows 7 64-bit 이상
    - CPU : intel Core i5-4430, AMD FX-6300
    - 램 : 8GB
    - 하드 : 30GB 사용 가능 공간
    - 그래픽 : nVidia GeForce GTX 960 2GB, AMD Radeon R7 370 2GB</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>선수옵 &#60; 국옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">백 4 블러드</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS
    Windows 10 64비트
    CPU	Intel Core i5-6600 (3.3 GHz) 또는 AMD Ryzen 5 2600 (3.4 GHz)
    RAM 8 GB
    GPU	NVIDIA GeForce GTX 1050 Ti 또는 AMD Radeon RX 570
    DX 버전 DX 12
    저장공간	40 GB HDD
    NOTES 1080p / 60fps / Low Quality Settings</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS
    Windows 10 64비트
    CPU	Intel Core i5-6600 (3.3 GHz) 또는 AMD Ryzen 5 2600 (3.4 GHz)
    RAM 8 GB
    GPU	NVIDIA GeForce GTX 1050 Ti 또는 AMD Radeon RX 570
    DX 버전 DX 12
    저장공간	40 GB HDD
    NOTES 1080p / 60fps / Low Quality Settings</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">벨라이트</span> : 하옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 *: 64-Bit Windows 7 Service Pack 1, Windows 8, Windows 10 or Windows 11
    프로세서: Intel Core i5-8600 / AMD Ryzen 5 3600
    메모리: 16 GB RAM
    그래픽: NVIDIA GeForce GTX 1070 8GB / AMD Radeon RX 580 8GB
    DirectX: 버전 12
    저장공간: 24 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 *: 64-Bit Windows 7 Service Pack 1, Windows 8, Windows 10 or Windows 11
    프로세서: Intel Core i5-8600 / AMD Ryzen 5 3600
    메모리: 16 GB RAM
    그래픽: NVIDIA GeForce GTX 1070 8GB / AMD Radeon RX 580 8GB
    DirectX: 버전 12
    저장공간: 24 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">붉은사막</span> : 상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS - Windows 10 64-bit
    CPU - Ryzen 5 2600X / i5-8500
    램 - 16GB RAM
    하드 - 135GB 사용 가능 공간
    그래픽 - GTX 1060 / RX 6500 XT
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS - Windows 10 64-bit
    CPU - Ryzen 5 2600X / i5-8500
    램 - 16GB RAM
    하드 - 135GB 사용 가능 공간
    그래픽 - GTX 1060 / RX 6500 XT
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">빈딕투스: 디파잉 페이트</span> : 상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS : Window 10
    CPU : Intel Core i7-4770 / AMD FX8300
    램 : 16GB RAM
    그래픽 : Geforce GTX 1060 VRAM 6GB / Radeon RX 480</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS : Window 10
    CPU : Intel Core i7-4770 / AMD FX8300
    램 : 16GB RAM
    그래픽 : Geforce GTX 1060 VRAM 6GB / Radeon RX 480</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상 &#60; 최상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">사이버펑크 2077</span> : 중옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows 7 또는 10
    - CPU : Intel Core i5-3570K 또는 AMD FX-8310
    - 램 : 8GB RAM
    - 하드 : 70GB의 사용 가능한 공간
    - 그래픽 : NVIDIA GeForce GTX 780 또는 AMD Radeon RX 470</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows 7 또는 10
    - CPU : Intel Core i5-3570K 또는 AMD FX-8310
    - 램 : 8GB RAM
    - 하드 : 70GB의 사용 가능한 공간
    - 그래픽 : NVIDIA GeForce GTX 780 또는 AMD Radeon RX 470</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵 &#60; 최상옵+RT</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">사일런트 힐 2 (SILENT HILL 2)</span> : 상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10 x64
    프로세서: Intel Core i7-6700K | AMD Ryzen 5 3600
    메모리: 16 GB RAM
    그래픽: NVIDIA® GeForce® GTX 1070 Ti or AMD Radeon™ RX 5700
    DirectX: 버전 12
    저장공간: 50 GB 사용 가능 공간
    사운드카드: Windows Compatible Audio Device.
    추가 사항: Playing on minimum requirements should enable to play on Low/Medium quality settings in FullHD (1080p) in stable 30 FPS. SSD is recommended.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10 x64
    프로세서: Intel Core i7-6700K | AMD Ryzen 5 3600
    메모리: 16 GB RAM
    그래픽: NVIDIA® GeForce® GTX 1070 Ti or AMD Radeon™ RX 5700
    DirectX: 버전 12
    저장공간: 50 GB 사용 가능 공간
    사운드카드: Windows Compatible Audio Device.
    추가 사항: Playing on minimum requirements should enable to play on Low/Medium quality settings in FullHD (1080p) in stable 30 FPS. SSD is recommended.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">새티스 팩토리(Satisfactory)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 or later (64-Bit)
    프로세서: i5-3570 3.4 GHz 4 Core
    메모리: 8 GB RAM
    그래픽: Nvidia GTX 1650/GTX 1050-ti, or AMD RX 470/RX 570, or equivalent performance & VRAM
    저장공간: 20 GB 사용 가능 공간
    추가 사항: Internet connection required for multiplayer. The game is in early access and minimum requirements may change.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 or later (64-Bit)
    프로세서: i5-3570 3.4 GHz 4 Core
    메모리: 8 GB RAM
    그래픽: Nvidia GTX 1650/GTX 1050-ti, or AMD RX 470/RX 570, or equivalent performance & VRAM
    저장공간: 20 GB 사용 가능 공간
    추가 사항: Internet connection required for multiplayer. The game is in early access and minimum requirements may change.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">샌드랜드</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>Requires a 64-bit processor and operating system
    OS: Windows 10
    Processor: AMD Ryzen 5 2400G / Intel Core i5-9400F
    Memory: 4 GB RAM
    Graphics: AMD Radeon RX 590 / Nvidia GeForce GTX 1060
    DirectX: Version 12
    Storage: 20 GB available space
    Additional Notes: Estimated performance: 1080p/60fps with graphics settings at "Low". Framerate might drop in graphics-intensive scenes. - 64-bit processor and operating system are required.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>Requires a 64-bit processor and operating system
    OS: Windows 10
    Processor: AMD Ryzen 5 2400G / Intel Core i5-9400F
    Memory: 4 GB RAM
    Graphics: AMD Radeon RX 590 / Nvidia GeForce GTX 1060
    DirectX: Version 12
    Storage: 20 GB available space
    Additional Notes: Estimated performance: 1080p/60fps with graphics settings at "Low". Framerate might drop in graphics-intensive scenes. - 64-bit processor and operating system are required.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">서든어택</span> : 상옵으로 75 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS : Windows 7
    CPU : Intel Core2 Duo E6300
    램 : 2GB
    하드 : 20GB
    그래픽 : GeForce 7600GT</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS : Windows 7
    CPU : Intel Core2 Duo E6300
    램 : 2GB
    하드 : 20GB
    그래픽 : GeForce 7600GT</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">선즈 오브 더포레스트</span> : 상으로  FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 : Windows 10 64-bit
    CPU : INTEL CORE I5-8400 / AMD RYZEN 3 3300X
    RAM : 12 GB RAM
    저장공간 : 20 GB 사용 가능 공간
    그래픽 카드 : NVIDIA GeForce GTX 1060 3GB / AMD Radeon RX 570 4GB
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 : Windows 10 64-bit
    CPU : INTEL CORE I5-8400 / AMD RYZEN 3 3300X
    RAM : 12 GB RAM
    저장공간 : 20 GB 사용 가능 공간
    그래픽 카드 : NVIDIA GeForce GTX 1060 3GB / AMD Radeon RX 570 4GB
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">소울워커</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10, 64 bit or above
    프로세서: Intel Core2 duo E8300 or above
    메모리: 4 GB RAM
    그래픽: Geforce GTX 460 / Radeon HD 5850
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 20 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10, 64 bit or above
    프로세서: Intel Core2 duo E8300 or above
    메모리: 4 GB RAM
    그래픽: Geforce GTX 460 / Radeon HD 5850
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 20 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">쉐이프즈 2 (shapez 2)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 64bit
    프로세서: Intel(R) Core(TM) i5-4440 CPU
    메모리: 4 GB RAM
    그래픽: Intel(R) UHD Graphics 630, 1GB VRAM
    저장공간: 2000 MB 사용 가능 공간
    추가 사항: 풀 HD에서 '최소' 그래픽 프리셋의 경우. 스크롤 휠이 있는 2버튼 마우스가 필요합니다.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 64bit
    프로세서: Intel(R) Core(TM) i5-4440 CPU
    메모리: 4 GB RAM
    그래픽: Intel(R) UHD Graphics 630, 1GB VRAM
    저장공간: 2000 MB 사용 가능 공간
    추가 사항: 풀 HD에서 '최소' 그래픽 프리셋의 경우. 스크롤 휠이 있는 2버튼 마우스가 필요합니다.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">스타크래프트</span> : 상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows 7, OS X® 10.10
    - CPU : Intel® Pentium® D 또는 AMD™ Athlon™ 64 X2
    - 램 : 2GB
    - 하드 : 8 GB 이상의 하드 드라이브 여유 공간
    - 그래픽 : NVIDIA® GeForce; 6800 (256 MB) 또는 ATI™ Radeon™ X1600 Pro (256 MB)</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows 7, OS X® 10.10
    - CPU : Intel® Pentium® D 또는 AMD™ Athlon™ 64 X2
    - 램 : 2GB
    - 하드 : 8 GB 이상의 하드 드라이브 여유 공간
    - 그래픽 : NVIDIA® GeForce; 6800 (256 MB) 또는 ATI™ Radeon™ X1600 Pro (256 MB)</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">스텔라 블레이드</span> : 상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS : Windows 10 64-bit
    CPU : Intel Core i5-7600k / AMD Ryzen 5 1600X Processor
    램 : 16GB RAM
    하드 : 75GB 사용 가능 공간
    그래픽 :  NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 580 8GB
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS : Windows 10 64-bit
    CPU : Intel Core i5-7600k / AMD Ryzen 5 1600X Processor
    램 : 16GB RAM
    하드 : 75GB 사용 가능 공간
    그래픽 :  NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 580 8GB
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">스트리노바</span> : 상으로  FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 : Windows 7, 8, 10, 11 (64bit)
    프로세서 : Intel Core i3-4170
    메모리 : 4GB RAM
    저장공간 : 25GB 사용 가능 공간
    그래픽 : Nvidia GeForce GTX 730 / AMD R7 240
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 : Windows 7, 8, 10, 11 (64bit)
    프로세서 : Intel Core i3-4170
    메모리 : 4GB RAM
    저장공간 : 25GB 사용 가능 공간
    그래픽 : Nvidia GeForce GTX 730 / AMD R7 240
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">스플릿 픽션</span> : 중으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 : 64 bit Windows 10, 11
    프로세서 : Intel Core i5-6600K / AMD Ryzen 5 2600X
    메모리 : 16GB RAM
    저장공간 : 85GB 사용 가능 공간
    그래픽 : NVIDIA GeForce GTX 970 - 4GB / Radeon RX 470 - 4GB
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 : 64 bit Windows 10, 11
    프로세서 : Intel Core i5-6600K / AMD Ryzen 5 2600X
    메모리 : 16GB RAM
    저장공간 : 85GB 사용 가능 공간
    그래픽 : NVIDIA GeForce GTX 970 - 4GB / Radeon RX 470 - 4GB
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">심즈4</span> : 최상으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS: 64 비트 필요. Windows 10
    프로세서(CPU): 3.3 GHz Intel Core i3-3220 (2 코어, 4 스레드), AMD Ryzen 3 1200 3.1 GHz (4 코어) 이상
    메모리 (RAM): 최소 4 GB 램
    하드 드라이브 (여유 공간): 최소 25 GB의 여유 공간 + 커스텀 콘텐츠와 게임 저장을 위한 1 GB 추가 공간
    디스크 드라이브: 게임의 물리적 디스크에서 설치하는 경우에만 DVD-ROM 드라이브 필요
    그래픽 카드 (비디오): 128 MB의 비디오 램, Pixel Shader 3.0 지원
    지원하는 그래픽 카드: NVIDIA GeForce 6600 이상, ATI Radeon X1300 이상, Intel GMA X4500 이상
    DirectX 버전: DirectX 11 호환</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS: 64 비트 필요. Windows 10
    프로세서(CPU): 3.3 GHz Intel Core i3-3220 (2 코어, 4 스레드), AMD Ryzen 3 1200 3.1 GHz (4 코어) 이상
    메모리 (RAM): 최소 4 GB 램
    하드 드라이브 (여유 공간): 최소 25 GB의 여유 공간 + 커스텀 콘텐츠와 게임 저장을 위한 1 GB 추가 공간
    디스크 드라이브: 게임의 물리적 디스크에서 설치하는 경우에만 DVD-ROM 드라이브 필요
    그래픽 카드 (비디오): 128 MB의 비디오 램, Pixel Shader 3.0 지원
    지원하는 그래픽 카드: NVIDIA GeForce 6600 이상, ATI Radeon X1300 이상, Intel GMA X4500 이상
    DirectX 버전: DirectX 11 호환</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">쓰론 앤 리버티 (TL)</span> : 중옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>해상도	1080p
    그래픽 품질	낮음
    CPU	Core i5-6500
    GPU	GTX 960 4GB
    RAM	8GB
    저장장치	60GB SSD
    운영체제	Windows 10 20H2
    DirectX	12

    그래픽 하드웨어가 지원하는 경우 자동으로 활성화되는 업스케일링 (DLSS2 등) 환경에서 측정한 사양입니다.
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>해상도	1080p
    그래픽 품질	낮음
    CPU	Core i5-6500
    GPU	GTX 960 4GB
    RAM	8GB
    저장장치	60GB SSD
    운영체제	Windows 10 20H2
    DirectX	12

    그래픽 하드웨어가 지원하는 경우 자동으로 활성화되는 업스케일링 (DLSS2 등) 환경에서 측정한 사양입니다.
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">아레나 브레이크아웃: 인피니티</span> : 상옵으로 100 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: 64-bit Windows 10 or above
    프로세서: Core i5-7500 or Ryzen 5 1400
    메모리: 16 GB RAM
    그래픽: NVIDIA GTX 960 or AMD Radeon RX 560 or Arc A380 with Video Memory 4G or above
    DirectX: 버전 12
    네트워크: 초고속 인터넷 연결
    저장공간: 60 GB 사용 가능 공간
    추가 사항: 이는 8월 Early Access 버전의 요구 사항만을 나타냅니다. 우리는 계속해서 더 많은 기기에 맞게 최적화할 예정입니다. 계속 지켜봐 주시기 바랍니다.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: 64-bit Windows 10 or above
    프로세서: Core i5-7500 or Ryzen 5 1400
    메모리: 16 GB RAM
    그래픽: NVIDIA GTX 960 or AMD Radeon RX 560 or Arc A380 with Video Memory 4G or above
    DirectX: 버전 12
    네트워크: 초고속 인터넷 연결
    저장공간: 60 GB 사용 가능 공간
    추가 사항: 이는 8월 Early Access 버전의 요구 사항만을 나타냅니다. 우리는 계속해서 더 많은 기기에 맞게 최적화할 예정입니다. 계속 지켜봐 주시기 바랍니다.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">아머드 코어 6 루비콘의 화염</span> : 상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS    Windows 10
    CPU   Intel Core i5-8600K or AMD Ryzen 3 3300X
    램   12 GB RAM
    저장공간   65 GB 사용 가능 공간
    그래픽    NVIDIA GeForce GTX 960, 4 GB or AMD Radeon RX 480, 4 GB or Intel Arc A380, 6 GB
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS    Windows 10
    CPU   Intel Core i5-8600K or AMD Ryzen 3 3300X
    램   12 GB RAM
    저장공간   65 GB 사용 가능 공간
    그래픽    NVIDIA GeForce GTX 960, 4 GB or AMD Radeon RX 480, 4 GB or Intel Arc A380, 6 GB
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">아이온</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>CPU	Intel Core i5 750 / AMD Phenom II X4 이상
    메모리	4GB 이상
    그래픽카드	nVidia GeForce GTX 260 이상
    AMD Radeon HD 5770 이상
    하드디스크	HDD 30GB 이상
    운영체제	Windows(8, 10) 32bit
    DirectX	9.0c(2008.6)</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>CPU	Intel Core i5 750 / AMD Phenom II X4 이상
    메모리	4GB 이상
    그래픽카드	nVidia GeForce GTX 260 이상
    AMD Radeon HD 5770 이상
    하드디스크	HDD 30GB 이상
    운영체제	Windows(8, 10) 32bit
    DirectX	9.0c(2008.6)</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">아이온2</span> : 상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS : 64-bit Windows 10 / 11
    CPU :  Intel i5-10400F / AMD 3300X
    램 : 16GB RAM
    하드 : SSD Recommended
    그래픽 : NVIDIA Geforce GTX 1660 (6G)</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS : 64-bit Windows 10 / 11
    CPU :  Intel i5-10400F / AMD 3300X
    램 : 16GB RAM
    하드 : SSD Recommended
    그래픽 : NVIDIA Geforce GTX 1660 (6G)</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">아이작의 번제</span> : 상으로  FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 : Windows XP, Vista, 7, OS X 버전 Leopard 10.5.8, Snow Leopard 10.6.3 이상.
    프로세서 : 2.5Hz, Intel MAC 2.5 GHz
    메모리 : 1GB 이상
    저장공간 : 50MB
    그래픽 : Direct X9.0c 호환 카드
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 : Windows XP, Vista, 7, OS X 버전 Leopard 10.5.8, Snow Leopard 10.6.3 이상.
    프로세서 : 2.5Hz, Intel MAC 2.5 GHz
    메모리 : 1GB 이상
    저장공간 : 50MB
    그래픽 : Direct X9.0c 호환 카드
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">아크레이더스</span> : 상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS - Windows 10 64bit 이상 (최신 업데이트)
    CPU - Intel Core i5-6600K / AMD Ryzen R5 1600 processor
    램 - 12GB RAM
    그래픽 - NVIDIA GeForce GTX 1050 Ti / AMD Radeon RX 580 / Intel Arc A380
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS - Windows 10 64bit 이상 (최신 업데이트)
    CPU - Intel Core i5-6600K / AMD Ryzen R5 1600 processor
    램 - 12GB RAM
    그래픽 - NVIDIA GeForce GTX 1050 Ti / AMD Radeon RX 580 / Intel Arc A380
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">아크서바이벌 어센디드</span> : 중옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 : Windows 10 / 11 64-bit with updates
    프로세서 : Intel Core i7-6800K / AMD Ryzen 5 2600X
    메모리 : 16 GB RAM
    그래픽 카드 : NVIDIA GeForce GTX 1080 / AMD Radeon RX 5600 XT
    API : DirectX 12
    저장 공간 : 70 GB SSD</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 : Windows 10 / 11 64-bit with updates
    프로세서 : Intel Core i7-6800K / AMD Ryzen 5 2600X
    메모리 : 16 GB RAM
    그래픽 카드 : NVIDIA GeForce GTX 1080 / AMD Radeon RX 5600 XT
    API : DirectX 12
    저장 공간 : 70 GB SSD</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">어바우드</span> : 상옵으로  FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제	Windows 10, 11 
    프로세서	AMD Ryzen 5 2600 / Intel i5-8400
    메모리	16 GB RAM
    저장공간	75 GB 사용 가능 공간 
    그래픽	AMD RX 5700 / Nvidia GTX 1070 / Intel Arc A580 
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제	Windows 10, 11 
    프로세서	AMD Ryzen 5 2600 / Intel i5-8400
    메모리	16 GB RAM
    저장공간	75 GB 사용 가능 공간 
    그래픽	AMD RX 5700 / Nvidia GTX 1070 / Intel Arc A580 
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">어쌔신 크리드 미라지</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>CPU: Intel Core i7-4790K (Intel Core i5-8400 for Intel Arc with ReBAR)/AMD Ryzen 5 1600
    GPU: Intel Arc A380 6GB/NVIDIA GeForce GTX 1060 6GB/AMD Radeon RX 570 4GB
    RAM: 8GB (dual-channel mode)
    OS: Windows 10/11
    SSD Storage: 40 GB</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>CPU: Intel Core i7-4790K (Intel Core i5-8400 for Intel Arc with ReBAR)/AMD Ryzen 5 1600
    GPU: Intel Arc A380 6GB/NVIDIA GeForce GTX 1060 6GB/AMD Radeon RX 570 4GB
    RAM: 8GB (dual-channel mode)
    OS: Windows 10/11
    SSD Storage: 40 GB</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">어쌔신 크리드 섀도우스</span> : 상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 : Windows 10, 11
    프로세서 :Intel Core i7 8700k / AMD Ryzen 5 3600
    메모리 : 16GB RAM
    저장공간 : 115GB 사용 가능 공간
    그래픽 : Nvidia GeForce GTX 1070 8GB / AMD Radeon RX 5700 8GB / Intel Arc A580 8GB (REBAR ON)
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 : Windows 10, 11
    프로세서 :Intel Core i7 8700k / AMD Ryzen 5 3600
    메모리 : 16GB RAM
    저장공간 : 115GB 사용 가능 공간
    그래픽 : Nvidia GeForce GTX 1070 8GB / AMD Radeon RX 5700 8GB / Intel Arc A580 8GB (REBAR ON)
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">에이지 오브 미쏠로지 리톨드</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10 64bit
    프로세서: Intel® i3-4130 or AMD FX 4350 at 2.4GHZ+ with 2 cores / 4 threads and AVX support
    메모리: 8 GB RAM
    그래픽: NVIDIA® GeForce® GTX 645 or AMD Radeon™ Vega 8 or Intel® Iris Graphics 550 or better
    DirectX: 버전 12
    저장공간: 25 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10 64bit
    프로세서: Intel® i3-4130 or AMD FX 4350 at 2.4GHZ+ with 2 cores / 4 threads and AVX support
    메모리: 8 GB RAM
    그래픽: NVIDIA® GeForce® GTX 645 or AMD Radeon™ Vega 8 or Intel® Iris Graphics 550 or better
    DirectX: 버전 12
    저장공간: 25 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">에일 ＆ 테일 태번 (Ale ＆ Tale Tavern)</span> : 상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10
    프로세서: Quad core
    메모리: 8 GB RAM
    그래픽: Nvidia GTX 1060
    네트워크: 초고속 인터넷 연결
    저장공간: 7 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10
    프로세서: Quad core
    메모리: 8 GB RAM
    그래픽: Nvidia GTX 1060
    네트워크: 초고속 인터넷 연결
    저장공간: 7 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">엘든 링: 황금 나무의 그림자</span> : 상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows 10
    - CPU : INTEL CORE I5-8400 or AMD RYZEN 3 3300X
    - 램 : 12GB RAM
    - 하드 : 60GB 사용 가능 공간
    - 그래픽 : NVIDIA GEFORCE GTX 1060 3 GB or AMD RADEON RX 580 4 GB</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows 10
    - CPU : INTEL CORE I5-8400 or AMD RYZEN 3 3300X
    - 램 : 12GB RAM
    - 하드 : 60GB 사용 가능 공간
    - 그래픽 : NVIDIA GEFORCE GTX 1060 3 GB or AMD RADEON RX 580 4 GB</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">엘든링</span> : 상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows 10
    - CPU : INTEL CORE I5-8400 or AMD RYZEN 3 3300X
    - 램 : 12GB RAM
    - 하드 : 60GB 사용 가능 공간
    - 그래픽 : NVIDIA GEFORCE GTX 1060 3 GB or AMD RADEON RX 580 4 GB</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows 10
    - CPU : INTEL CORE I5-8400 or AMD RYZEN 3 3300X
    - 램 : 12GB RAM
    - 하드 : 60GB 사용 가능 공간
    - 그래픽 : NVIDIA GEFORCE GTX 1060 3 GB or AMD RADEON RX 580 4 GB</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">오버워치2</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : 윈도우® 10 64-bit (최신 서비스팩) 32비트 운영체제는 지원하지 않습니다
    - CPU : Intel® Core™ i3 또는 AMD Phenom™ X3 8650
    - 램 : 6GB RAM
    - 하드 : 50GB 이상의 하드 드라이브 여유 공간
    - 그래픽 : NVIDIA® GeForce® GTX 600 시리즈, AMD Radeon™ HD 7000 시리즈</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : 윈도우® 10 64-bit (최신 서비스팩) 32비트 운영체제는 지원하지 않습니다
    - CPU : Intel® Core™ i3 또는 AMD Phenom™ X3 8650
    - 램 : 6GB RAM
    - 하드 : 50GB 이상의 하드 드라이브 여유 공간
    - 그래픽 : NVIDIA® GeForce® GTX 600 시리즈, AMD Radeon™ HD 7000 시리즈</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; PC방옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">용과 같이 8</span> : 중옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>Requires a 64-bit processor and operating system
    OS: Windows 10 1903 (OS Build 18362)
    Processor: Intel Core i5-3470, 3.2 GHz or AMD Ryzen 3 1200, 3.1 GHz
    Memory: 8 GB RAM
    Graphics: NVIDIA GeForce GTX 960, 4 GB or AMD Radeon RX 460, 4 GB or Intel Arc A380, 6 GB
    DirectX: Version 12
    Storage: 82 GB available space
    Sound Card: Windows Compatible Audio Device
    Additional Notes: 1080p Low @ 30 FPS w/ Balanced FSR 1.0, requires a CPU which supports the AVX and SSE4.2 instruction set</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>Requires a 64-bit processor and operating system
    OS: Windows 10 1903 (OS Build 18362)
    Processor: Intel Core i5-3470, 3.2 GHz or AMD Ryzen 3 1200, 3.1 GHz
    Memory: 8 GB RAM
    Graphics: NVIDIA GeForce GTX 960, 4 GB or AMD Radeon RX 460, 4 GB or Intel Arc A380, 6 GB
    DirectX: Version 12
    Storage: 82 GB available space
    Sound Card: Windows Compatible Audio Device
    Additional Notes: 1080p Low @ 30 FPS w/ Balanced FSR 1.0, requires a CPU which supports the AVX and SSE4.2 instruction set</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">워썬더 (WAR THUNDER)</span> : 상으로  FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS: Windows 7 SP1/8/10(64비트)
    프로세서: 듀얼코어 2.2GHz
    메모리 : 4GB
    비디오 카드: DirectX 10.1 레벨 비디오 카드: AMD Radeon 77XX / NVIDIA GeForce GTX 660. 게임의 최소 지원 해상도는 720p입니다.
    네트워크 : 광대역 인터넷 연결
    하드 드라이브: 17GB</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS: Windows 7 SP1/8/10(64비트)
    프로세서: 듀얼코어 2.2GHz
    메모리 : 4GB
    비디오 카드: DirectX 10.1 레벨 비디오 카드: AMD Radeon 77XX / NVIDIA GeForce GTX 660. 게임의 최소 지원 해상도는 720p입니다.
    네트워크 : 광대역 인터넷 연결
    하드 드라이브: 17GB</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">워테일즈(Wartales)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 64bit
    프로세서: Intel Core i5 2.5 GHz / AMD Ryzen 5
    메모리: 8 GB RAM
    그래픽: NVidia GTX 1050 / AMD RX550
    DirectX: 버전 10
    저장공간: 30 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 64bit
    프로세서: Intel Core i5 2.5 GHz / AMD Ryzen 5
    메모리: 8 GB RAM
    그래픽: NVidia GTX 1050 / AMD RX550
    DirectX: 버전 10
    저장공간: 30 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">워프레임</span> : 중옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS *:Windows 7 64-Bit (32-bit not supported)
    Processor:Intel Core i7 860, Intel Core i5 750, or AMD FX-4100 (SSE 4.2 support required)
    Video:DirectX 11+ capable Graphics Card
    Memory:4 GB RAM
    Storage:50 GB available HD space
    Internet:Broadband Internet Connection Required

    Note: There is no Mac or Linux client currently available.
    * Starting January 1st, 2024, the Steam Client will only support Windows 10 and later versions.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS *:Windows 7 64-Bit (32-bit not supported)
    Processor:Intel Core i7 860, Intel Core i5 750, or AMD FX-4100 (SSE 4.2 support required)
    Video:DirectX 11+ capable Graphics Card
    Memory:4 GB RAM
    Storage:50 GB available HD space
    Internet:Broadband Internet Connection Required

    Note: There is no Mac or Linux client currently available.
    * Starting January 1st, 2024, the Steam Client will only support Windows 10 and later versions.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">워해머 40k 스페이스 마린 2</span> : 중옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10/11 64-bit
    프로세서: AMD Ryzen 5 2600X / Intel Core i5-8600K
    메모리: 8 GB RAM
    그래픽: 6 GB VRAM, AMD Radeon RX 580 / Nvidia GeForce GTX 1060
    DirectX: 버전 12
    저장공간: 75 GB 사용 가능 공간
    추가 사항: 30 FPS in 1920x1080 with "Low" preset. SSD required</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10/11 64-bit
    프로세서: AMD Ryzen 5 2600X / Intel Core i5-8600K
    메모리: 8 GB RAM
    그래픽: 6 GB VRAM, AMD Radeon RX 580 / Nvidia GeForce GTX 1060
    DirectX: 버전 12
    저장공간: 75 GB 사용 가능 공간
    추가 사항: 30 FPS in 1920x1080 with "Low" preset. SSD required</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">원스 휴먼(Once Human)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10 64-bit Operating System
    프로세서: Intel Core i5-4460
    메모리: 8 GB RAM
    그래픽: Nvidia GTX 750ti 4G / AMD Radeon RX550
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 55 GB 사용 가능 공간
    추가 사항: SSD is highly recommended</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10 64-bit Operating System
    프로세서: Intel Core i5-4460
    메모리: 8 GB RAM
    그래픽: Nvidia GTX 750ti 4G / AMD Radeon RX550
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 55 GB 사용 가능 공간
    추가 사항: SSD is highly recommended</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">원신</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows 7 SP1 64-bit , Windows 8.1 64-bit , Windows 10 64-bit
    - CPU : Intel Core i5 또는 동급 CPU
    - 램 : 8GB RAM
    - 하드 : 30 GB
    - 그래픽 : NVIDIA® GeForce® GT 1030 및 더 높은 사양</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows 7 SP1 64-bit , Windows 8.1 64-bit , Windows 10 64-bit
    - CPU : Intel Core i5 또는 동급 CPU
    - 램 : 8GB RAM
    - 하드 : 30 GB
    - 그래픽 : NVIDIA® GeForce® GT 1030 및 더 높은 사양</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">월드오브탱크</span> : 상으로  FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 : Windows XP SP3/Vista/7/8/10
    CPU : SSE2를 지원하는 듀얼 코어 이상의&#160;프로세서
    RAM : XP 사용 시 1.5GB,&#160;Vista/7/8/10 사용 시 2GB : 
    저장공간 : 25 GB
    그래픽 카드 : GeForce 6800 256 MB RAM&#160;&#160;/ATI HD X2400 XT 256 MB RAM, DirectX 9.0c
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 : Windows XP SP3/Vista/7/8/10
    CPU : SSE2를 지원하는 듀얼 코어 이상의&#160;프로세서
    RAM : XP 사용 시 1.5GB,&#160;Vista/7/8/10 사용 시 2GB : 
    저장공간 : 25 GB
    그래픽 카드 : GeForce 6800 256 MB RAM&#160;&#160;/ATI HD X2400 XT 256 MB RAM, DirectX 9.0c
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">이스케이프 프롬 타르코프</span> : 하옵으로 100 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS : Windows 7/8/10 64-bit
    CPU : Intel Core 2 Duo, i3 2.4 GHz 또는 AMD Athlon, Phenom II 2.6 GHz
    램 : 8 GB
    하드 : 8 GB 이상
    그래픽 : DX11와 호환되는 1 GB VRAM</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS : Windows 7/8/10 64-bit
    CPU : Intel Core 2 Duo, i3 2.4 GHz 또는 AMD Athlon, Phenom II 2.6 GHz
    램 : 8 GB
    하드 : 8 GB 이상
    그래픽 : DX11와 호환되는 1 GB VRAM</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">이터널리턴</span> : 상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS : WINDOWS® 10 (64Bit)
    CPU : Intel Core i3-3225, AMD FX-4350
    램 : 4GB RAM
    하드 : 3GB 사용 가능 공간
    그래픽 : NVIDIA GeForce GT 640, ATI Radeon HD 7700</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS : WINDOWS® 10 (64Bit)
    CPU : Intel Core i3-3225, AMD FX-4350
    램 : 4GB RAM
    하드 : 3GB 사용 가능 공간
    그래픽 : NVIDIA GeForce GT 640, ATI Radeon HD 7700</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">인슈라오디드</span> : 중옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영체제: Windows 10
    프로세서: Intel Core i5-6400 (2.7 GHz 4 Core) / AMD Ryzen 5 1500X (3.5 GHz 4 Core) or equivalent
    메모리: 16 GB RAM
    그래픽: NVIDIA GeForce GTX 1060 (req. 6GB VRAM) / AMD Radeon RX 580 (req. 6GB VRAM)
    네트워크: 초고속 인터넷 연결
    저장공간: 60 GB 사용 가능 공간
    사운드카드: on board</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영체제: Windows 10
    프로세서: Intel Core i5-6400 (2.7 GHz 4 Core) / AMD Ryzen 5 1500X (3.5 GHz 4 Core) or equivalent
    메모리: 16 GB RAM
    그래픽: NVIDIA GeForce GTX 1060 (req. 6GB VRAM) / AMD Radeon RX 580 (req. 6GB VRAM)
    네트워크: 초고속 인터넷 연결
    저장공간: 60 GB 사용 가능 공간
    사운드카드: on board</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">인조이</span> : 중으로  FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 : Windows 10, 11
    CPU : Intel i5 10400 / AMD Ryzen 5 3600
    램 : 12GB RAM
    하드 : 40GB 사용 가능 공간
    그래픽 : NVIDIA RTX 2060 (6G VRAM) / AMD Radeon RX 5600 XT (6G VRAM)</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 : Windows 10, 11
    CPU : Intel i5 10400 / AMD Ryzen 5 3600
    램 : 12GB RAM
    하드 : 40GB 사용 가능 공간
    그래픽 : NVIDIA RTX 2060 (6G VRAM) / AMD Radeon RX 5600 XT (6G VRAM)</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">인펙션 프리 존</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 Windows 10
    프로세서 Intel® Core i5-3570K
    메모리 8 GB RAM
    그래픽카드 NVIDIA® GeForce® GTX 680
    AMD Radeon HD 7970
    저장 공간 5 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 Windows 10
    프로세서 Intel® Core i5-3570K
    메모리 8 GB RAM
    그래픽카드 NVIDIA® GeForce® GTX 680
    AMD Radeon HD 7970
    저장 공간 5 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">잇 테익스 투 (It Takes Two)</span> : 상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 8.1 64-bit or Windows 10 64-bit
    프로세서: Intel Core i3-2100T or AMD FX 6100
    메모리: 8 GB RAM
    그래픽: Nvidia GeForce GTX 660 or AMD R7 260x
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 50 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 8.1 64-bit or Windows 10 64-bit
    프로세서: Intel Core i3-2100T or AMD FX 6100
    메모리: 8 GB RAM
    그래픽: Nvidia GeForce GTX 660 or AMD R7 260x
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 50 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">작혼: 리치 마작</span> : 최상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 SP1 or higher
    프로세서: Intel Pentium Dual CPU E2180 2.00GHz
    메모리: 2 GB RAM
    그래픽: GeForce GT 430 / ATI Radeon HD 2600XT
    DirectX: 버전 10
    네트워크: 초고속 인터넷 연결
    저장공간: 2048 MB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 SP1 or higher
    프로세서: Intel Pentium Dual CPU E2180 2.00GHz
    메모리: 2 GB RAM
    그래픽: GeForce GT 430 / ATI Radeon HD 2600XT
    DirectX: 버전 10
    네트워크: 초고속 인터넷 연결
    저장공간: 2048 MB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">진삼국무쌍 ORIGINS</span> : 상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS : Windows® 10, 11 64-bit
    CPU : Intel Core i5-8400 / AMD Ryzen 5 2600
    램 : 12GB RAM
    하드 : 50GB 사용 가능 공간
    그래픽 : NVIDIA GeForce GTX 1060 (VRAM 6GB) / AMD Radeon RX 590 (VRAM 8GB)
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS : Windows® 10, 11 64-bit
    CPU : Intel Core i5-8400 / AMD Ryzen 5 2600
    램 : 12GB RAM
    하드 : 50GB 사용 가능 공간
    그래픽 : NVIDIA GeForce GTX 1060 (VRAM 6GB) / AMD Radeon RX 590 (VRAM 8GB)
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">철권 7</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제: Windows 7/8/10 (64-bit OS required)
    프로세서: Intel Core i3-4160 @ 3.60GHz or equivalent
    메모리: 6 GB RAM
    그래픽: NVIDIA GeForce GTX 660 2GB, GTX 750Ti 2GB, or equivalent
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 60 GB 사용 가능 공간
    사운드카드: DirectX compatible soundcard or onboard chipset</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제: Windows 7/8/10 (64-bit OS required)
    프로세서: Intel Core i3-4160 @ 3.60GHz or equivalent
    메모리: 6 GB RAM
    그래픽: NVIDIA GeForce GTX 660 2GB, GTX 750Ti 2GB, or equivalent
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 60 GB 사용 가능 공간
    사운드카드: DirectX compatible soundcard or onboard chipset</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">철권 8</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제: Windows 10 64-Bit
    프로세서: Intel Core i5-6600K/AMD Ryzen 5 1600
    메모리: 8 GB RAM
    그래픽: Nvidia GeForce GTX 1050Ti/AMD Radeon R9 380X
    DirectX: 버전 12
    네트워크: 초고속 인터넷 연결
    저장공간: 100 GB 사용 가능 공간
    사운드카드: DirectX compatible soundcard/Onboard chipset</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제: Windows 10 64-Bit
    프로세서: Intel Core i5-6600K/AMD Ryzen 5 1600
    메모리: 8 GB RAM
    그래픽: Nvidia GeForce GTX 1050Ti/AMD Radeon R9 380X
    DirectX: 버전 12
    네트워크: 초고속 인터넷 연결
    저장공간: 100 GB 사용 가능 공간
    사운드카드: DirectX compatible soundcard/Onboard chipset</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">카타클리스모(Cataclismo)</span> : 상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows® 10 (64-bit)
    프로세서: Intel® Core™ i7-4770 (quad-core) / AMD® FX-Series™ FX-9590 (quad-core)
    메모리: 8 GB RAM
    그래픽: NVIDIA® GeForce® GTX 760 (2 GB) / AMD® Radeon™ R9 270X (2 GB)
    DirectX: 버전 11
    저장공간: 10 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows® 10 (64-bit)
    프로세서: Intel® Core™ i7-4770 (quad-core) / AMD® FX-Series™ FX-9590 (quad-core)
    메모리: 8 GB RAM
    그래픽: NVIDIA® GeForce® GTX 760 (2 GB) / AMD® Radeon™ R9 270X (2 GB)
    DirectX: 버전 11
    저장공간: 10 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">카트라이더 : 드리프트</span> : 상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS : Windows 10 이상 (64bit)
    CPU : 인텔 1세대 i3 또는 FX 6000 시리즈 이상
    램 : 8GB
    하드 : 30GB
    그래픽 : Geforce GTX 760 또는 AMD 라데온 HD 7950</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS : Windows 10 이상 (64bit)
    CPU : 인텔 1세대 i3 또는 FX 6000 시리즈 이상
    램 : 8GB
    하드 : 30GB
    그래픽 : Geforce GTX 760 또는 AMD 라데온 HD 7950</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">컨커러스 블레이드</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 64-Bit
    프로세서: Intel I5-6400
    메모리: 8 GB RAM
    그래픽: Nvidia Geforce GTX 1050Ti
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 60 GB 사용 가능 공간
    추가 사항: Performance: 1080p / 30fps, Low Quality Settings</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 64-Bit
    프로세서: Intel I5-6400
    메모리: 8 GB RAM
    그래픽: Nvidia Geforce GTX 1050Ti
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 60 GB 사용 가능 공간
    추가 사항: Performance: 1080p / 30fps, Low Quality Settings</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">컬트 오브 더 램 (Cult of the Lamb)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 or later
    프로세서: Intel Core i3-3240 (2 * 3400); AMD FX-4300 (4 * 3800)
    메모리: 4 GB RAM
    그래픽: GeForce GTX 560 Ti (1024 VRAM); Radeon HD 7750 (1024 VRAM)
    저장공간: 4 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 or later
    프로세서: Intel Core i3-3240 (2 * 3400); AMD FX-4300 (4 * 3800)
    메모리: 4 GB RAM
    그래픽: GeForce GTX 560 Ti (1024 VRAM); Radeon HD 7750 (1024 VRAM)
    저장공간: 4 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">코어 키퍼(Core Keeper)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 64-bit
    프로세서: Intel Core i5-2300 / AMD Ryzen 3 1200
    메모리: 8 GB RAM
    그래픽: GeForce GTX 460 / Radeon HD 5850</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 64-bit
    프로세서: Intel Core i5-2300 / AMD Ryzen 3 1200
    메모리: 8 GB RAM
    그래픽: GeForce GTX 460 / Radeon HD 5850</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">콜 오브 듀티 : 모던 워페어 II 2022</span> : 하옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows® 10 64 Bit (최신 업데이트)
    - CPU : Intel® Core™ i3-6100 / Core™ i5-2500K 또는 AMD Ryzen™ 3 1200
    - 램 : 8GB RAM
    - 하드 : 125GB 사용 가능 공간
    - 그래픽 : NVIDIA® GeForce® GTX 960 또는 AMD Radeon™ RX 470 - DirectX 12.0 호환 시스템</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows® 10 64 Bit (최신 업데이트)
    - CPU : Intel® Core™ i3-6100 / Core™ i5-2500K 또는 AMD Ryzen™ 3 1200
    - 램 : 8GB RAM
    - 하드 : 125GB 사용 가능 공간
    - 그래픽 : NVIDIA® GeForce® GTX 960 또는 AMD Radeon™ RX 470 - DirectX 12.0 호환 시스템</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">콜 오브 듀티 블랙옵스6</span> : 중옵으로  FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10 64비트(최신 업데이트)
    CPU: AMD Ryzen 5 1400 또는 Intel Core i5-6600
    RAM: 8GB
    그래픽 카드: AMD Radeon RX 470 또는 NVIDIA GeForce GTX 960 또는 Intel Arc A580
    비디오 메모리: 2 GB
    저장 공간: SSD 필요, 출시 시 사용 가능한 공간 102GB</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10 64비트(최신 업데이트)
    CPU: AMD Ryzen 5 1400 또는 Intel Core i5-6600
    RAM: 8GB
    그래픽 카드: AMD Radeon RX 470 또는 NVIDIA GeForce GTX 960 또는 Intel Arc A580
    비디오 메모리: 2 GB
    저장 공간: SSD 필요, 출시 시 사용 가능한 공간 102GB</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">크라임 씬 클리너(Crime Scene Cleaner)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10/11
    프로세서: i5-7500 or similar
    메모리: 16 GB RAM
    그래픽: GTX 1060
    저장공간: 35 GB 사용 가능 공간
    추가 사항: Intel ARC 시리즈 카드가 아직 지원되지 않을 수 있습니다.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10/11
    프로세서: i5-7500 or similar
    메모리: 16 GB RAM
    그래픽: GTX 1060
    저장공간: 35 GB 사용 가능 공간
    추가 사항: Intel ARC 시리즈 카드가 아직 지원되지 않을 수 있습니다.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">크루세이더 킹즈 3</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows® 10 Home 64 bit
    프로세서: Intel® Core™ i3-2120 / AMD® FX 6350
    메모리: 6 GB RAM
    그래픽: Nvidia® GeForce™ GTX 660 (2GB) / AMD® Radeon™ HD 7870 (2GB) / Intel® Iris Pro™ 580 / Intel® Iris® Plus G7 / AMD® Radeon™ Vega 11
    저장공간: 8 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows® 10 Home 64 bit
    프로세서: Intel® Core™ i3-2120 / AMD® FX 6350
    메모리: 6 GB RAM
    그래픽: Nvidia® GeForce™ GTX 660 (2GB) / AMD® Radeon™ HD 7870 (2GB) / Intel® Iris Pro™ 580 / Intel® Iris® Plus G7 / AMD® Radeon™ Vega 11
    저장공간: 8 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">클레르 옵스퀴르 : 33 원정대</span> : 상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 : Windows 10
    프로세서 : Intel Core i7-8700K / AMD Ryzen 5 1600X"
    메모리 : 8GB RAM
    저장공간 : 55GB 사용 가능 공간
    그래픽 : NVIDIA GeForce GTX 1060 6 GB / AMD Radeon RX 5600 XT 6 GB / Intel Arc A380 6 GB
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 : Windows 10
    프로세서 : Intel Core i7-8700K / AMD Ryzen 5 1600X"
    메모리 : 8GB RAM
    저장공간 : 55GB 사용 가능 공간
    그래픽 : NVIDIA GeForce GTX 1060 6 GB / AMD Radeon RX 5600 XT 6 GB / Intel Arc A380 6 GB
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">클로저스</span> : 상으로  FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 : Windows 64비트 (Win10)
    CPU : Intel Core i5 이상
    RAM : 8GB 이상
    저장공간 : 30GB 이상
    그래픽 카드 : Nvidia GeForce 1050TI 이상 또는 동급 그래픽 카드 이상
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 : Windows 64비트 (Win10)
    CPU : Intel Core i5 이상
    RAM : 8GB 이상
    저장공간 : 30GB 이상
    그래픽 카드 : Nvidia GeForce 1050TI 이상 또는 동급 그래픽 카드 이상
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">킹덤 컴 : 딜리버런스 2</span> : 하으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10 64-bit
    프로세서: Intel Core i5-8400 / AMD Ryzen 5 2600
    메모리: 16GB RAM
    저장공간: 100GB 사용 가능 공간
    그래픽: NVIDIA GeForce GTX 1060 (6GB) / AMD Radeon RX 580
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10 64-bit
    프로세서: Intel Core i5-8400 / AMD Ryzen 5 2600
    메모리: 16GB RAM
    저장공간: 100GB 사용 가능 공간
    그래픽: NVIDIA GeForce GTX 1060 (6GB) / AMD Radeon RX 580
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">킹덤 컴: 딜리버런스</span> : 상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: OS 64-bit Windows 7 or 64-bit Windows 8 (8.1) or Windows 10
    프로세서: Intel CPU Core i5-2500K 3.3GHz, AMD CPU Phenom II X4 940
    메모리: 8 GB RAM
    그래픽: Nvidia GPU GeForce GTX 660, AMD GPU Radeon HD 7870
    DirectX: 버전 11
    저장공간: 70 GB 사용 가능 공간
    사운드카드: Integrated
    추가 사항: SSD recommended</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: OS 64-bit Windows 7 or 64-bit Windows 8 (8.1) or Windows 10
    프로세서: Intel CPU Core i5-2500K 3.3GHz, AMD CPU Phenom II X4 940
    메모리: 8 GB RAM
    그래픽: Nvidia GPU GeForce GTX 660, AMD GPU Radeon HD 7870
    DirectX: 버전 11
    저장공간: 70 GB 사용 가능 공간
    사운드카드: Integrated
    추가 사항: SSD recommended</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">타이니 글레이드 (Tiny Glade)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10+
    프로세서: Intel Core i5 or AMD Ryzen
    메모리: 4 GB RAM
    그래픽: For 720p: Radeon R9 270, GeForce GTX 670, Intel Iris Xe, or similar (with 2+ GB of VRAM)
    저장공간: 3 GB 사용 가능 공간
    사운드카드: Yes, please</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10+
    프로세서: Intel Core i5 or AMD Ryzen
    메모리: 4 GB RAM
    그래픽: For 720p: Radeon R9 270, GeForce GTX 670, Intel Iris Xe, or similar (with 2+ GB of VRAM)
    저장공간: 3 GB 사용 가능 공간
    사운드카드: Yes, please</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">태양 제국의 죄악 II</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 v1607+ / 11 (64비트)
    프로세서: 4코어 프로세서 (인텔 코어 i5 5세대 또는 AMD 라이젠 2x00 시리즈)
    메모리: 8 GB RAM
    그래픽: 2GB VRAM이 장착된 3D 비디오 카드 (Nvidia GeForce 950 / AMD Radeon RX 450)
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 20 GB 사용 가능 공간
    추가 사항: 최소 화면 해상도 1920x1080</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 v1607+ / 11 (64비트)
    프로세서: 4코어 프로세서 (인텔 코어 i5 5세대 또는 AMD 라이젠 2x00 시리즈)
    메모리: 8 GB RAM
    그래픽: 2GB VRAM이 장착된 3D 비디오 카드 (Nvidia GeForce 950 / AMD Radeon RX 450)
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 20 GB 사용 가능 공간
    추가 사항: 최소 화면 해상도 1920x1080</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">트리 오브 세이비어</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 *: Windows 7 (64-bit)
    프로세서: Intel i3
    그래픽: NVIDIA GeForce 200 Series or later
    DirectX: 버전 9.0
    네트워크: 초고속 인터넷 연결
    저장공간: 32 GB 사용 가능 공간
    추가 사항: Keyboard, Mouse</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 *: Windows 7 (64-bit)
    프로세서: Intel i3
    그래픽: NVIDIA GeForce 200 Series or later
    DirectX: 버전 9.0
    네트워크: 초고속 인터넷 연결
    저장공간: 32 GB 사용 가능 공간
    추가 사항: Keyboard, Mouse</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">파이널 판타지 16</span> : 상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows® 10 / 11 64-bit
    프로세서: AMD Ryzen™ 5 1600 / Intel® Core™ i5-8400
    메모리: 16 GB RAM
    그래픽: AMD Radeon™ RX 5700 / Intel® Arc™ A580 / NVIDIA® GeForce® GTX 1070
    DirectX: 버전 12
    저장공간: 170 GB 사용 가능 공간
    추가 사항: 30FPS at 720p expected. SSD required. VRAM 8GB or above.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows® 10 / 11 64-bit
    프로세서: AMD Ryzen™ 5 1600 / Intel® Core™ i5-8400
    메모리: 16 GB RAM
    그래픽: AMD Radeon™ RX 5700 / Intel® Arc™ A580 / NVIDIA® GeForce® GTX 1070
    DirectX: 버전 12
    저장공간: 170 GB 사용 가능 공간
    추가 사항: 30FPS at 720p expected. SSD required. VRAM 8GB or above.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">파티 애니멀즈 (Party Animals)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10, 64-bit / Windows 11, 64-bit
    프로세서: Intel Core i5 / AMD equivalent
    메모리: 8 GB RAM
    그래픽: NVIDIA GTX 750-Ti / AMD RX 550, 2GB VRam
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 8 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10, 64-bit / Windows 11, 64-bit
    프로세서: Intel Core i5 / AMD equivalent
    메모리: 8 GB RAM
    그래픽: NVIDIA GTX 750-Ti / AMD RX 550, 2GB VRam
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 8 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">패스 오브 엑자일 2 (Path of Exile 2)</span> : 상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS: Windows 10
    Processor: 4 core 2.8GHz x64-compatible
    Memory: 8 GB RAM
    Graphics: NVIDIA® GeForce® GTX 960 or ATI Radeon™ RX 470
    DirectX: Version 11
    Network: Broadband Internet connection
    Storage: 100 GB available space</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS: Windows 10
    Processor: 4 core 2.8GHz x64-compatible
    Memory: 8 GB RAM
    Graphics: NVIDIA® GeForce® GTX 960 or ATI Radeon™ RX 470
    DirectX: Version 11
    Network: Broadband Internet connection
    Storage: 100 GB available space</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">패스 오브 엑자일(P.O.E)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- 운영 체제 (64 비트)	64비트 &#8211;Windows 7 / Windows 8 / Window10
    - 하드 디스크	30GB 이상 (NTFS 형식)
    - CPU X86 호환 2.6GHz 이상
    - 메모리 4GB RAM
    - 그래픽 카드 NVIDIA® GeForce® 650Ti GT 또는
    - ATI Radeon™ 7850 이상
    - DirectX 버전 11 이상</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- 운영 체제 (64 비트)	64비트 &#8211;Windows 7 / Windows 8 / Window10
    - 하드 디스크	30GB 이상 (NTFS 형식)
    - CPU X86 호환 2.6GHz 이상
    - 메모리 4GB RAM
    - 그래픽 카드 NVIDIA® GeForce® 650Ti GT 또는
    - ATI Radeon™ 7850 이상
    - DirectX 버전 11 이상</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 권장옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">팰월드(Palworld) / 팔월드</span> : 중옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영체제: Windows 10 or later (64-Bit)
    프로세서: i5-3570K 3.4 GHz 4 Core
    메모리: 16 GB RAM
    그래픽: GeForce GTX 1050 (2GB)
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 40 GB 사용 가능 공간
    추가 사항: Internet connection required for multiplayer. SSD required.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영체제: Windows 10 or later (64-Bit)
    프로세서: i5-3570K 3.4 GHz 4 Core
    메모리: 16 GB RAM
    그래픽: GeForce GTX 1050 (2GB)
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 40 GB 사용 가능 공간
    추가 사항: Internet connection required for multiplayer. SSD required.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">퍼스트 버서커: 카잔</span> : 중으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 : Windows 10 64 bit
    프로세서 : Core i3-6300 / AMD Ryzen 3 1200
    메모리 : 12GB
    저장공간 :  70G
    그래픽 : 4GBs VRAM GeForce GTX 970 / Radeon RX 580 / Arc A580
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 : Windows 10 64 bit
    프로세서 : Core i3-6300 / AMD Ryzen 3 1200
    메모리 : 12GB
    저장공간 :  70G
    그래픽 : 4GBs VRAM GeForce GTX 970 / Radeon RX 580 / Arc A580
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">페르소나 3 리로드</span> : 최상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10
    프로세서: Intel Core i5-2300, AMD FX-4350
    메모리: 8 GB RAM
    그래픽: NVIDIA GeForce GTX 650 Ti, 2 GB; AMD Radeon HD 7850, 2 GB
    DirectX: 버전 12
    저장공간: 30 GB 사용 가능 공간
    추가 사항: Performance Target: 720p, low graphics settings, @ 30 FPS</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10
    프로세서: Intel Core i5-2300, AMD FX-4350
    메모리: 8 GB RAM
    그래픽: NVIDIA GeForce GTX 650 Ti, 2 GB; AMD Radeon HD 7850, 2 GB
    DirectX: 버전 12
    저장공간: 30 GB 사용 가능 공간
    추가 사항: Performance Target: 720p, low graphics settings, @ 30 FPS</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상 &#60; 최상(RT)</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">페르소나5 더 로열</span> : 상옵으로 100 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10
    프로세서: Intel Core i7-4790, 3.4 GHz | AMD Ryzen 5 1500X, 3.5 GHz
    메모리: 8 GB RAM
    그래픽: Nvidia GeForce GTX 650 Ti, 2 GB | AMD Radeon R7 360, 2 GB
    DirectX: 버전 11
    저장공간: 41 GB 사용 가능 공간
    추가 사항: Low 720p @ 60 FPS. Requires a CPU</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10
    프로세서: Intel Core i7-4790, 3.4 GHz | AMD Ryzen 5 1500X, 3.5 GHz
    메모리: 8 GB RAM
    그래픽: Nvidia GeForce GTX 650 Ti, 2 GB | AMD Radeon R7 360, 2 GB
    DirectX: 버전 11
    저장공간: 41 GB 사용 가능 공간
    추가 사항: Low 720p @ 60 FPS. Requires a CPU</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">포르자 호라이즌5</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows 10 version 15063.0 or higher
    - CPU : Intel i5-4460 or AMD Ryzen 3 1200
    - 램 : 8GB RAM
    - 하드 : 110GB의 사용 가능한 공간
    - 그래픽 : NVidia GTX 970 OR AMD RX 470</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows 10 version 15063.0 or higher
    - CPU : Intel i5-4460 or AMD Ryzen 3 1200
    - 램 : 8GB RAM
    - 하드 : 110GB의 사용 가능한 공간
    - 그래픽 : NVidia GTX 970 OR AMD RX 470</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">풋볼매니저 2024</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS: Windows 7/8/8.1/10/11 및 업데이트 - 64비트
    프로세서: Intel Core 2 또는 AMD Athlon 64 X2 
    그래픽: Intel GMA X4500, NVIDIA GeForce 9600M GT, AMD/ATI Mobility Radeon HD 3650 - 256MB VRAM 및 DirectX® 11 필요 
    메모리: 4GB RAM
    저장 공간: 7GB 
    디스플레이: 1024x768 
    사양이 좋을수록 게임 성능이 향상됩니다.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS: Windows 7/8/8.1/10/11 및 업데이트 - 64비트
    프로세서: Intel Core 2 또는 AMD Athlon 64 X2 
    그래픽: Intel GMA X4500, NVIDIA GeForce 9600M GT, AMD/ATI Mobility Radeon HD 3650 - 256MB VRAM 및 DirectX® 11 필요 
    메모리: 4GB RAM
    저장 공간: 7GB 
    디스플레이: 1024x768 
    사양이 좋을수록 게임 성능이 향상됩니다.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">프로스트펑크 2 (Frostpunk 2)</span> : 상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10/11 (64-bit)
    프로세서: AMD Ryzen 5 / Intel Core i5 2.5 GHz
    메모리: 8 GB RAM
    그래픽: AMD RX 550 4 GB VRAM / NVIDIA GTX 1050Ti 4 GB VRAM / INTEL ARC A310 4GB VRAM
    DirectX: 버전 12
    저장공간: 30 GB 사용 가능 공간
    추가 사항: SSD required.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10/11 (64-bit)
    프로세서: AMD Ryzen 5 / Intel Core i5 2.5 GHz
    메모리: 8 GB RAM
    그래픽: AMD RX 550 4 GB VRAM / NVIDIA GTX 1050Ti 4 GB VRAM / INTEL ARC A310 4GB VRAM
    DirectX: 버전 12
    저장공간: 30 GB 사용 가능 공간
    추가 사항: SSD required.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">프로젝트 좀보이드 (Project Zomboid)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS: Windows 10, 64 Bit
    64bit OS required
    Processor: Intel 2.77GHz Quad-core
    Memory: 8Gb Ram
    Hard Disk Space: 5gig
    Video Card: Dedicated graphics card with 2 GB of RAM minimum, OpenGL 2.1 and GLSL 1.2 support (generally 2012 or newer)
    Sound: FMOD compatible sound card</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS: Windows 10, 64 Bit
    64bit OS required
    Processor: Intel 2.77GHz Quad-core
    Memory: 8Gb Ram
    Hard Disk Space: 5gig
    Video Card: Dedicated graphics card with 2 GB of RAM minimum, OpenGL 2.1 and GLSL 1.2 support (generally 2012 or newer)
    Sound: FMOD compatible sound card</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">플래닛 주</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 *: Windows 7 (SP1+)/8.1/10 64bit
    프로세서: Intel i5-2500 / AMD FX-6350
    메모리: 8 GB RAM
    그래픽: NVIDIA GeForce GTX 770 (2GB) / AMD Radeon R9 270X (2GB)
    저장공간: 16 GB 사용 가능 공간
    추가 사항: Minimum specifications may change during development</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 *: Windows 7 (SP1+)/8.1/10 64bit
    프로세서: Intel i5-2500 / AMD FX-6350
    메모리: 8 GB RAM
    그래픽: NVIDIA GeForce GTX 770 (2GB) / AMD Radeon R9 270X (2GB)
    저장공간: 16 GB 사용 가능 공간
    추가 사항: Minimum specifications may change during development</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">플래닛 코스터</span> : 상옵으로  FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 *:윈도우 7(SP1+)/8.1/10 64비트
    프로세서:인텔 i5-2300/AMD FX-4300
    메모리:8GB램
    제도법:엔비디아 GTX 560(2GB)/AMD 라데온 7850(2GB)
    다이렉트X:버전 11
    저장:사용 가능한 공간 8GB</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 *:윈도우 7(SP1+)/8.1/10 64비트
    프로세서:인텔 i5-2300/AMD FX-4300
    메모리:8GB램
    제도법:엔비디아 GTX 560(2GB)/AMD 라데온 7850(2GB)
    다이렉트X:버전 11
    저장:사용 가능한 공간 8GB</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">피파온라인4</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows 7/8/8.1/10 - 64-Bit / Android 버전 2.3.3 이상 / iOS 버전 7.0 이상
    - CPU : Intel Core i3-2100 @ 3.1GHz (or AMD Phenom 7950 Quad-Core, AMD Athlon II X4 620 equivalent)
    - 램 : 4GB
    - 하드 : 40GB
    - 그래픽 : Geforce GT 730, ATI Radeon HD 7570</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows 7/8/8.1/10 - 64-Bit / Android 버전 2.3.3 이상 / iOS 버전 7.0 이상
    - CPU : Intel Core i3-2100 @ 3.1GHz (or AMD Phenom 7950 Quad-Core, AMD Athlon II X4 620 equivalent)
    - 램 : 4GB
    - 하드 : 40GB
    - 그래픽 : Geforce GT 730, ATI Radeon HD 7570</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">하데스 2</span> : 최상으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 64-bit
    프로세서: Dual Core 2.4 GHz
    메모리: 8 GB RAM
    그래픽: GeForce GTX 950, Radeon R7 360, or Intel HD Graphics 630
    저장공간: 10 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 64-bit
    프로세서: Dual Core 2.4 GHz
    메모리: 8 GB RAM
    그래픽: GeForce GTX 950, Radeon R7 360, or Intel HD Graphics 630
    저장공간: 10 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">할로우 나이트</span> : 상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS - Windows 7 (64bit)
    CPU - Intel Core 2 Duo E5200
    램 - 4GB RAM
    하드 - 9GB 사용 가능 공간
    그래픽 - GeForce 9800GTX+ (1GB)
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS - Windows 7 (64bit)
    CPU - Intel Core 2 Duo E5200
    램 - 4GB RAM
    하드 - 9GB 사용 가능 공간
    그래픽 - GeForce 9800GTX+ (1GB)
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">헬다이버즈2</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>최소:
    64비트 프로세서와 운영 체제가 필요합니다
    운영체제: Windows 10
    프로세서: Intel Core i7-4790K or AMD Ryzen 5 1500X
    메모리: 8 GB RAM
    그래픽: NVIDIA GeForce GTX 1050 Ti or AMD Radeon RX 470
    저장공간: 100 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>최소:
    64비트 프로세서와 운영 체제가 필요합니다
    운영체제: Windows 10
    프로세서: Intel Core i7-4790K or AMD Ryzen 5 1500X
    메모리: 8 GB RAM
    그래픽: NVIDIA GeForce GTX 1050 Ti or AMD Radeon RX 470
    저장공간: 100 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">호그와트 레거시</span> : 중옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS	Windows 10 64비트
    CPU	Intel Core i5-6600 (3.3 GHz) 또는 AMD Ryzen 5 1400 (3.2 GHz)
    RAM	16 GB
    GPU	NVIDIA GeForce GTX 960 4GB 또는 AMD Radeon RX 470 4GB
    DX 버전	DX 12
    저장공간	85 GB HDD
    참고	SSD (선호), HDD (지원), 720p / 30 fps, 저품질 설정</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS	Windows 10 64비트
    CPU	Intel Core i5-6600 (3.3 GHz) 또는 AMD Ryzen 5 1400 (3.2 GHz)
    RAM	16 GB
    GPU	NVIDIA GeForce GTX 960 4GB 또는 AMD Radeon RX 470 4GB
    DX 버전	DX 12
    저장공간	85 GB HDD
    참고	SSD (선호), HDD (지원), 720p / 30 fps, 저품질 설정</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                </ul>
                        
                        <div class="detail_more on" data="155"><span>더보기 (총 155건)</span></div>
                    </div>
                                
                    <h3><span>4K UHD 해상도 (3840 X 2160)</span> 로 플레이할 경우</h3>
                    <div class="game_list hidden">
                        <ul>
                                                    <li>
                                - <span class="gname">APEX 레전드</span> : 하옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS: 64-bit Windows 7
    - CPU : AMD FX 4350 or Equivalent, Intel Core i3 6300 or Equivalent
    - 램 : 6GB RAM
    - 하드 : 56GB의 사용 가능한 공간
    - 그래픽 : AMD Radeon™ HD 7730, NVIDIA GeForce® GT 640</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS: 64-bit Windows 7
    - CPU : AMD FX 4350 or Equivalent, Intel Core i3 6300 or Equivalent
    - 램 : 6GB RAM
    - 하드 : 56GB의 사용 가능한 공간
    - 그래픽 : AMD Radeon™ HD 7730, NVIDIA GeForce® GT 640</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">EA SPORTS FC™ 25</span> : 상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10 - 64-Bit (Latest Update)
    프로세서: AMD Ryzen 5 1600 or Intel Core i5 6600k
    메모리: 8 GB RAM
    그래픽: AMD RX 570 or Nvidia GTX 1050 Ti
    DirectX: 버전 12
    네트워크: 초고속 인터넷 연결
    저장공간: 100 GB 사용 가능 공간
    사운드카드: DirectX: 12 Compatible video card or equivalent (feature level 12_0)</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10 - 64-Bit (Latest Update)
    프로세서: AMD Ryzen 5 1600 or Intel Core i5 6600k
    메모리: 8 GB RAM
    그래픽: AMD RX 570 or Nvidia GTX 1050 Ti
    DirectX: 버전 12
    네트워크: 초고속 인터넷 연결
    저장공간: 100 GB 사용 가능 공간
    사운드카드: DirectX: 12 Compatible video card or equivalent (feature level 12_0)</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">FC 24 (피파 24)</span> : 중옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제: Windows 10 - 64-Bit
    프로세서: Intel Core i5-6600K @ 3.50GHz or AMD Ryzen 5 1600 @ 3.2 GHZ
    메모리: 8 GB RAM
    그래픽: NVIDIA GeForce GTX 1050 Ti 4GB or AMD Radeon RX 570 4GB
    DirectX: 버전 12
    네트워크: 초고속 인터넷 연결
    저장공간: 100 GB 사용 가능 공간
    추가 사항: DirectX: 12 Compatible video card or equivalent (feature level 12_0)</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제: Windows 10 - 64-Bit
    프로세서: Intel Core i5-6600K @ 3.50GHz or AMD Ryzen 5 1600 @ 3.2 GHZ
    메모리: 8 GB RAM
    그래픽: NVIDIA GeForce GTX 1050 Ti 4GB or AMD Radeon RX 570 4GB
    DirectX: 버전 12
    네트워크: 초고속 인터넷 연결
    저장공간: 100 GB 사용 가능 공간
    추가 사항: DirectX: 12 Compatible video card or equivalent (feature level 12_0)</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">NBA 2K25</span> : 중옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10 64-Bit (latest update)
    프로세서: Intel® Core™ i3-9100 or AMD Ryzen™ 3 1200
    메모리: 8 GB RAM
    그래픽: NVIDIA® GeForce® GTX 960 4 GB or AMD Radeon™ RX 570 4 GB or Intel® Arc™ A580
    DirectX: 버전 12
    네트워크: 초고속 인터넷 연결
    저장공간: 150 GB 사용 가능 공간
    추가 사항: SSD 필요. 듀얼 아날로그 게임패드 권장. 초기 설치에는 Steam 인증을 위한 일회성 인터넷 연결이 필요하며, 필요한 소프트웨어 설치(게임에 포함됨)에는 DirectX 및 Visual C++ Redistributable 2019가 포함됩니다. PC에서 NBA 2K25를 플레이하려면 AVX2를 지원하는 프로세서와 DirectX 기능 수준 12.0을 지원하는 그래픽 카드가 필요합니다.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10 64-Bit (latest update)
    프로세서: Intel® Core™ i3-9100 or AMD Ryzen™ 3 1200
    메모리: 8 GB RAM
    그래픽: NVIDIA® GeForce® GTX 960 4 GB or AMD Radeon™ RX 570 4 GB or Intel® Arc™ A580
    DirectX: 버전 12
    네트워크: 초고속 인터넷 연결
    저장공간: 150 GB 사용 가능 공간
    추가 사항: SSD 필요. 듀얼 아날로그 게임패드 권장. 초기 설치에는 Steam 인증을 위한 일회성 인터넷 연결이 필요하며, 필요한 소프트웨어 설치(게임에 포함됨)에는 DirectX 및 Visual C++ Redistributable 2019가 포함됩니다. PC에서 NBA 2K25를 플레이하려면 AVX2를 지원하는 프로세서와 DirectX 기능 수준 12.0을 지원하는 그래픽 카드가 필요합니다.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">P의 거짓</span> : 중옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- 운영체제: Windows 10 64bit
    - 프로세서: AMD Ryzen 3 1200／Intel Core i3-6300
    - 메모리: 8 GB RAM
    - 그래픽: AMD Radeon RX 560 4GB / NVIDIA GeForce GTX 960 4GB
    - DirectX: 버전 12
    - 저장공간: 50 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- 운영체제: Windows 10 64bit
    - 프로세서: AMD Ryzen 3 1200／Intel Core i3-6300
    - 메모리: 8 GB RAM
    - 그래픽: AMD Radeon RX 560 4GB / NVIDIA GeForce GTX 960 4GB
    - DirectX: 버전 12
    - 저장공간: 50 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵 &#60; 최상옵 + DLSS</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">shape of dreams (셰이프 오브 드림즈)</span> : 하으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS : Windows 10 x64 or newer
    CPU : Intel Core i5-6400 / AMD FX-8320
    램 : 8GB RAM
    하드 : 12GB 사용 가능 공간
    그래픽 : GeForce GTX 960 (2048 MB) / AMD Radeon R9 280 (2048 MB)
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS : Windows 10 x64 or newer
    CPU : Intel Core i5-6400 / AMD FX-8320
    램 : 8GB RAM
    하드 : 12GB 사용 가능 공간
    그래픽 : GeForce GTX 960 (2048 MB) / AMD Radeon R9 280 (2048 MB)
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">갓 오브 워 라그나로크</span> : 중옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10 64-bit
    프로세서: Intel i5-4670k or AMD Ryzen 3 1200
    메모리: 8 GB RAM
    그래픽: NVIDIA GTX 1060 (6GB) or AMD RX 5500 XT (8GB) or Intel Arc A750
    DirectX: 버전 12
    저장공간: 190 GB 사용 가능 공간
    추가 사항: Windows version 2004 2020-05-27 19041</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10 64-bit
    프로세서: Intel i5-4670k or AMD Ryzen 3 1200
    메모리: 8 GB RAM
    그래픽: NVIDIA GTX 1060 (6GB) or AMD RX 5500 XT (8GB) or Intel Arc A750
    DirectX: 버전 12
    저장공간: 190 GB 사용 가능 공간
    추가 사항: Windows version 2004 2020-05-27 19041</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">건담 브레이커 4 (GUNDAM BREAKER 4)</span> : 하옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10
    프로세서: Intel Core i5-2400 / AMD FX-6300
    메모리: 8 GB RAM
    그래픽: Nvidia GeForce GTX 760 / AMD Radeon RX 280 / Intel Arc A380
    DirectX: 버전 11
    저장공간: 14 GB 사용 가능 공간
    추가 사항: ※최대 해상도: 3840x2160
    예상 성능: 그래픽 설정 "낮음"에서 1080p/60fps. 그래픽이 많은 장면에서는 프레임 속도가 떨어질 수 있습니다. - 64비트 프로세서와 운영 체제가 필요합니다.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10
    프로세서: Intel Core i5-2400 / AMD FX-6300
    메모리: 8 GB RAM
    그래픽: Nvidia GeForce GTX 760 / AMD Radeon RX 280 / Intel Arc A380
    DirectX: 버전 11
    저장공간: 14 GB 사용 가능 공간
    추가 사항: ※최대 해상도: 3840x2160
    예상 성능: 그래픽 설정 "낮음"에서 1080p/60fps. 그래픽이 많은 장면에서는 프레임 속도가 떨어질 수 있습니다. - 64비트 프로세서와 운영 체제가 필요합니다.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">건파이어 리본(Gunfire Reborn)</span> : 상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 *: Windows 7
    프로세서: Intel Core i5-6400 / AMD FX-8320
    메모리: 4 GB RAM
    그래픽: GTX 960 / R9 280
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 4 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 *: Windows 7
    프로세서: Intel Core i5-6400 / AMD FX-8320
    메모리: 4 GB RAM
    그래픽: GTX 960 / R9 280
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 4 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">검은사막</span> : 중옵으로 100 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : 32비트 또는 64비트의 Win7 또는 그 이상
    - CPU : Intel Core i3
    - 램 : 4GB RAM
    - 하드 : 27GB
    - 그래픽 : GTS 250 / GeForce 9800 GTX / Radeon HD 3870 X2</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : 32비트 또는 64비트의 Win7 또는 그 이상
    - CPU : Intel Core i3
    - 램 : 4GB RAM
    - 하드 : 27GB
    - 그래픽 : GTS 250 / GeForce 9800 GTX / Radeon HD 3870 X2</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵 &#60; 리마스터옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">고스트 리콘: 브레이크 포인트</span> : 상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10 (64-bit versions only)
    프로세서: AMD Ryzen 3 1200 @3.1 GHz, Intel Core i5 4460 @ 3.2 GHz, or better
    메모리: 8 GB RAM
    그래픽: AMD Radeon R9 280X or NVIDIA GeForce GTX 960 (4 GB VRAM with Shader Model 5.0 or better)
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 67 GB 사용 가능 공간
    추가 사항: originally released for Windows 7, the game can be played on Windows 10 and Windows 11 OS</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10 (64-bit versions only)
    프로세서: AMD Ryzen 3 1200 @3.1 GHz, Intel Core i5 4460 @ 3.2 GHz, or better
    메모리: 8 GB RAM
    그래픽: AMD Radeon R9 280X or NVIDIA GeForce GTX 960 (4 GB VRAM with Shader Model 5.0 or better)
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 67 GB 사용 가능 공간
    추가 사항: originally released for Windows 7, the game can be played on Windows 10 and Windows 11 OS</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">고스트 오브 쓰시마</span> : 하옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>최소:
    64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 64-bit
    프로세서: Intel Core i3-7100 or AMD Ryzen 3 1200
    메모리: 8 GB RAM
    그래픽: NVIDIA GeForce GTX 960 or AMD Radeon RX 5500 XT
    저장공간: 75 GB 사용 가능 공간
    추가 사항: SSD Recommended</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>최소:
    64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 64-bit
    프로세서: Intel Core i3-7100 or AMD Ryzen 3 1200
    메모리: 8 GB RAM
    그래픽: NVIDIA GeForce GTX 960 or AMD Radeon RX 5500 XT
    저장공간: 75 GB 사용 가능 공간
    추가 사항: SSD Recommended</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">나 혼자만 레벨업 : ARISE OVERDRIVE</span> : 중으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10 이상
    프로세서: Intel Core i5 4460 또는 동급 AMD 프로세서 
    메모리: 8 GB RAM
    그래픽:  NVIDIA GeForce GTX 1050 
    저장 공간 : 20GB 사용 가능 공간
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10 이상
    프로세서: Intel Core i5 4460 또는 동급 AMD 프로세서 
    메모리: 8 GB RAM
    그래픽:  NVIDIA GeForce GTX 1050 
    저장 공간 : 20GB 사용 가능 공간
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">나 혼자만 레벨업:어라이즈</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 (64 비트)
    프로세서: i3 3220 3.3 GHz 또는 동급의 AMD 프로세서
    메모리: 8 GB RAM
    그래픽: NVIDIA® GeForce GTX™ 1050 2GB
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 20 GB 사용 가능 공간
    추가 사항: SSD 사용을 권장 합니다.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 (64 비트)
    프로세서: i3 3220 3.3 GHz 또는 동급의 AMD 프로세서
    메모리: 8 GB RAM
    그래픽: NVIDIA® GeForce GTX™ 1050 2GB
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 20 GB 사용 가능 공간
    추가 사항: SSD 사용을 권장 합니다.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">나라카: 블레이드포인트</span> : 하으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS : Windows 10 64-bit
    CPU : Intel i5 4th generation or AMD FX 6300 or equivalent
    램 : 8 GB RAM
    하드 : 20 GB 사용 가능 공간
    그래픽 : NVIDIA GeForce GTX 1050TI or equivalent
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS : Windows 10 64-bit
    CPU : Intel i5 4th generation or AMD FX 6300 or equivalent
    램 : 8 GB RAM
    하드 : 20 GB 사용 가능 공간
    그래픽 : NVIDIA GeForce GTX 1050TI or equivalent
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">나인 솔즈 (Nine Sols)</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10 64bit
    프로세서: AMD Athlon X4 | Intel Core i5 4460
    메모리: 8 GB RAM
    그래픽: Nvidia GTX 950 | AMD R7 370
    DirectX: 버전 11
    저장공간: 15 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10 64bit
    프로세서: AMD Athlon X4 | Intel Core i5 4460
    메모리: 8 GB RAM
    그래픽: Nvidia GTX 950 | AMD R7 370
    DirectX: 버전 11
    저장공간: 15 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">노 레스트 포 더 위키드</span> : 하옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS: Windows 10
    Processor: Intel Core i5-8400 / AMD Ryzen 5 2600
    Memory: 16 GB RAM
    Graphics: Nvidia GeForce GTX 970 / AMD Radeon RX Vega 56
    Storage: 35 GB available space
    Additional Notes: SSD Recommended</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS: Windows 10
    Processor: Intel Core i5-8400 / AMD Ryzen 5 2600
    Memory: 16 GB RAM
    Graphics: Nvidia GeForce GTX 970 / AMD Radeon RX Vega 56
    Storage: 35 GB available space
    Additional Notes: SSD Recommended</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">다크 소울 3</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 *: Windows 7 SP1 64bit, Windows 8.1 64bit Windows 10 64bit
    프로세서: Intel Core i3-2100 / AMD® FX-6300
    메모리: 4 GB RAM
    그래픽: NVIDIA® GeForce GTX 750 Ti / ATI Radeon HD 7950
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 25 GB 사용 가능 공간
    사운드카드: DirectX 11 sound device
    추가 사항: Internet connection required for online play and product activation</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 *: Windows 7 SP1 64bit, Windows 8.1 64bit Windows 10 64bit
    프로세서: Intel Core i3-2100 / AMD® FX-6300
    메모리: 4 GB RAM
    그래픽: NVIDIA® GeForce GTX 750 Ti / ATI Radeon HD 7950
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 25 GB 사용 가능 공간
    사운드카드: DirectX 11 sound device
    추가 사항: Internet connection required for online play and product activation</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">던전앤파이터</span> : 상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : 윈도우7 64비트 이상
    - CPU : Intel Pentium Gold 이상 AMD Athlon 이상
    - 램 : 8GB 이상
    - 하드 : SSD 여유공간 40GB 이상
    - 그래픽 : Intel UHD Graphics 610 내장 그래픽 이상 AMD Radeon Vega 3 내장 그래픽 이상</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : 윈도우7 64비트 이상
    - CPU : Intel Pentium Gold 이상 AMD Athlon 이상
    - 램 : 8GB 이상
    - 하드 : SSD 여유공간 40GB 이상
    - 그래픽 : Intel UHD Graphics 610 내장 그래픽 이상 AMD Radeon Vega 3 내장 그래픽 이상</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">데드 바이 데이라이트</span> : 중옵으로 120 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 64-bit Operating System
    프로세서: Intel Core i3-4170 or AMD FX-8120
    메모리: 8 GB RAM
    그래픽: DX11 Compatible GeForce GTX 460 1GB or AMD HD 6850 1GB
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 50 GB 사용 가능 공간
    사운드카드: DX11 compatible</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 64-bit Operating System
    프로세서: Intel Core i3-4170 or AMD FX-8120
    메모리: 8 GB RAM
    그래픽: DX11 Compatible GeForce GTX 460 1GB or AMD HD 6850 1GB
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 50 GB 사용 가능 공간
    사운드카드: DX11 compatible</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">데드 아일랜드 2</span> : 하옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 : Windows 10
    프로세서 : AMD FX-9590 / Intel Core i7-7700HQ
    메모리 : 10GB
    스토리지 : 70GB
    DirectX :12
    그래픽 카드 : Radeon R9 390X (8192 VRAM) / GeForce GTX 1060 (6144 VRAM)</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 : Windows 10
    프로세서 : AMD FX-9590 / Intel Core i7-7700HQ
    메모리 : 10GB
    스토리지 : 70GB
    DirectX :12
    그래픽 카드 : Radeon R9 390X (8192 VRAM) / GeForce GTX 1060 (6144 VRAM)</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">데몬 엑스 마키나: 타이타닉 사이온</span> : 하으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS : Windows 8.1/10
    CPU :  Intel i5-3470 / AMD FX-8300
    램 : 6GB RAM
    하드 : 13GB 사용 가능 공간
    그래픽 : NVIDIA Geforce GTX 660 / Radeon HD7870
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS : Windows 8.1/10
    CPU :  Intel i5-3470 / AMD FX-8300
    램 : 6GB RAM
    하드 : 13GB 사용 가능 공간
    그래픽 : NVIDIA Geforce GTX 660 / Radeon HD7870
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">데스티니 가디언즈 2</span> : 중옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 *: Windows® 7 / Windows® 8.1 / Windows® 10 64-bit (latest Service Pack)
    프로세서: Intel® Core™ i3 3250 3.5 GHz or Intel Pentium G4560 3.5 GHz / AMD FX-4350 4.2 GHz
    메모리: 6 GB RAM
    그래픽: NVIDIA® GeForce® GTX 660 2GB or GTX 1050 2GB / AMD Radeon HD 7850 2GB
    네트워크: 초고속 인터넷 연결
    저장공간: 105 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 *: Windows® 7 / Windows® 8.1 / Windows® 10 64-bit (latest Service Pack)
    프로세서: Intel® Core™ i3 3250 3.5 GHz or Intel Pentium G4560 3.5 GHz / AMD FX-4350 4.2 GHz
    메모리: 6 GB RAM
    그래픽: NVIDIA® GeForce® GTX 660 2GB or GTX 1050 2GB / AMD Radeon HD 7850 2GB
    네트워크: 초고속 인터넷 연결
    저장공간: 105 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">데이브 더 다이브</span> : 최상으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 *: Windows 7 64 bit
    프로세서: Intel Core i3 Dual Core
    메모리: 8 GB RAM
    그래픽: NVIDIA Geforce GTS 450 / AMD Radeon HD 5570
    DirectX: 버전 11
    저장공간: 10 GB 사용 가능 공간
    사운드카드: Windows Compatible Audio Device</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 *: Windows 7 64 bit
    프로세서: Intel Core i3 Dual Core
    메모리: 8 GB RAM
    그래픽: NVIDIA Geforce GTS 450 / AMD Radeon HD 5570
    DirectX: 버전 11
    저장공간: 10 GB 사용 가능 공간
    사운드카드: Windows Compatible Audio Device</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">도타 2</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 *: Windows 7 이상
    프로세서: Intel 또는 AMD 2.8GHz 듀얼 코어 프로세서
    메모리: 4 GB RAM
    그래픽: NVIDIA GeForce 8600/9600GT, ATI/AMD Radeon HD2600/3600
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 60 GB 사용 가능 공간
    사운드카드: DirectX 호환
    * 2024년 1월 1일부터 Steam 클라이언트는 Windows 10 이상 버전만 지원합니다.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 *: Windows 7 이상
    프로세서: Intel 또는 AMD 2.8GHz 듀얼 코어 프로세서
    메모리: 4 GB RAM
    그래픽: NVIDIA GeForce 8600/9600GT, ATI/AMD Radeon HD2600/3600
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 60 GB 사용 가능 공간
    사운드카드: DirectX 호환
    * 2024년 1월 1일부터 Steam 클라이언트는 Windows 10 이상 버전만 지원합니다.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">듄: 어웨이크닝</span> : 하으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS : Windows 10 64-bit 이상
    CPU : Intel Core i5-7400 / AMD Ryzen 3 1200
    램 : 16GB RAM
    하드 : 60GB 사용 가능 공간
    그래픽 : NVIDIA GeForce GTX 1060 (6GB) / AMD Radeon 5600XT (6GB)</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS : Windows 10 64-bit 이상
    CPU : Intel Core i5-7400 / AMD Ryzen 3 1200
    램 : 16GB RAM
    하드 : 60GB 사용 가능 공간
    그래픽 : NVIDIA GeForce GTX 1060 (6GB) / AMD Radeon 5600XT (6GB)</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">디아블로2 레저렉션</span> : 중옵으로 100 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : 윈도우® 10
    - CPU : 인텔® 코어 i3-3250 또는 AMD FX-4350
    - 램 : 8 GB RAM
    - 하드 : 30 GB
    - 그래픽 : Nvidia GTX 660 또는 AMD Radeon HD 7850</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : 윈도우® 10
    - CPU : 인텔® 코어 i3-3250 또는 AMD FX-4350
    - 램 : 8 GB RAM
    - 하드 : 30 GB
    - 그래픽 : Nvidia GTX 660 또는 AMD Radeon HD 7850</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">디아블로4</span> : 중옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : 64비트 Windows® 10 버전 1909 이상
    - CPU : Intel® Core™ i5-2500K 또는 AMD™ FX-8350
    - 램 : 8GB RAM
    - 하드 : 여유 공간이 90GB 이상 있는 SDD
    - 그래픽 : NVIDIA® GeForce® GTX 660 또는 AMD Radeon™ R9 280 - DirectX® 12 호환 시스템</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : 64비트 Windows® 10 버전 1909 이상
    - CPU : Intel® Core™ i5-2500K 또는 AMD™ FX-8350
    - 램 : 8GB RAM
    - 하드 : 여유 공간이 90GB 이상 있는 SDD
    - 그래픽 : NVIDIA® GeForce® GTX 660 또는 AMD Radeon™ R9 280 - DirectX® 12 호환 시스템</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 풀옵(DLSS/FSR)</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">디제이맥스 리스펙트 V</span> : 최상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7, 8.1, 10 (64bit)
    프로세서: Intel Core 2 Duo E8400 3.0GHz AMD Athlon 64 X2 6000+ 3.0GHz
    메모리: 4 GB RAM
    그래픽: Nvidia® GTX 460 or AMD HD 5850 or better
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 100 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7, 8.1, 10 (64bit)
    프로세서: Intel Core 2 Duo E8400 3.0GHz AMD Athlon 64 X2 6000+ 3.0GHz
    메모리: 4 GB RAM
    그래픽: Nvidia® GTX 460 or AMD HD 5850 or better
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 100 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">딥 락 갤럭틱: 서바이벌</span> : 중옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영체제: Win 10
    프로세서: Intel i5-4590 or similar
    메모리: 8 GB RAM
    그래픽: Geforce GTX 1050 or similar
    저장공간: 2 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영체제: Win 10
    프로세서: Intel i5-4590 or similar
    메모리: 8 GB RAM
    그래픽: Geforce GTX 1050 or similar
    저장공간: 2 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">라스트 에포크</span> : 중옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 Windows 10 64-bit
    프로세서 Intel Core i5-2500 / AMD FX-4350
    메모리 8 GB RAM
    그래픽 카드 NVIDIA GeForce GTX 660 Ti / AMD Radeon R9 270 with 3 GB+ of VRAM
    API DirectX 11
    저장 공간 20 GB
    추가 사항 SSD 강력 권장</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 Windows 10 64-bit
    프로세서 Intel Core i5-2500 / AMD FX-4350
    메모리 8 GB RAM
    그래픽 카드 NVIDIA GeForce GTX 660 Ti / AMD Radeon R9 270 with 3 GB+ of VRAM
    API DirectX 11
    저장 공간 20 GB
    추가 사항 SSD 강력 권장</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">락다운 프로토콜</span> : 상으로  FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 : Windows 10
    프로세서 : Intel i3-4150 / Ryzen 3 1200
    메모리 : 2GB RAM
    저장공간 : 2GB 사용 가능 공간
    그래픽 : NVIDIA GTX 1050
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 : Windows 10
    프로세서 : Intel i3-4150 / Ryzen 3 1200
    메모리 : 2GB RAM
    저장공간 : 2GB 사용 가능 공간
    그래픽 : NVIDIA GTX 1050
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">러스트</span> : 상으로  FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 : Windows 7 64 비트
    CPU : Intel Core i7-3770 / AMD FX-9590 이상
    RAM : 8GB RAM
    저장공간 : 10GB 여유 공간
    그래픽 카드 : GTX 670 2GB / AMD R9 280
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 : Windows 7 64 비트
    CPU : Intel Core i7-3770 / AMD FX-9590 이상
    RAM : 8GB RAM
    저장공간 : 10GB 여유 공간
    그래픽 카드 : GTX 670 2GB / AMD R9 280
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">레드 데드 리뎀션2</span> : XBOX옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows 7-Service Pack 1 (6.1.7601)
    - CPU : Intel® Core ™ i5-2500K / AMD FX-6300
    - 램 : 8GB
    - 하드 : 150GB
    - 그래픽 : Nvidia GeForce GTX 770 2GB / AMD Radeon R9280 3GB</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows 7-Service Pack 1 (6.1.7601)
    - CPU : Intel® Core ™ i5-2500K / AMD FX-6300
    - 램 : 8GB
    - 하드 : 150GB
    - 그래픽 : Nvidia GeForce GTX 770 2GB / AMD Radeon R9280 3GB</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>XBOX옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">레디 오어 낫</span> : 하옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 *: 64-bit Windows 7, Windows 8.1, Windows 10
    프로세서: Intel Core i5-4430 / AMD FX-6300
    메모리: 8 GB RAM
    그래픽: NVIDIA GeForce GTX 960 2GB / AMD Radeon R7 370 2GB
    DirectX: 버전 11
    저장공간: 90 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 *: 64-bit Windows 7, Windows 8.1, Windows 10
    프로세서: Intel Core i5-4430 / AMD FX-6300
    메모리: 8 GB RAM
    그래픽: NVIDIA GeForce GTX 960 2GB / AMD Radeon R7 370 2GB
    DirectX: 버전 11
    저장공간: 90 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">레인보우식스 시즈</span> : 상으로  FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 : Windows 10 / 11 64-bit
    CPU : Intel Core i3 560 3.3 GHz or AMD Phenom II X4 945 3.0 GHz
    RAM : 8 GB RAM
    저장공간 : 61 GB 사용 가능 공간
    그래픽 카드 : NVIDIA GeForce GTX 460 or AMD Radeon HD 5870
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 : Windows 10 / 11 64-bit
    CPU : Intel Core i3 560 3.3 GHz or AMD Phenom II X4 945 3.0 GHz
    RAM : 8 GB RAM
    저장공간 : 61 GB 사용 가능 공간
    그래픽 카드 : NVIDIA GeForce GTX 460 or AMD Radeon HD 5870
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">레전드 오브 모탈(Legend of Mortal)</span> : 최상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 or higher
    프로세서: Intel Core i3
    메모리: 8 GB RAM
    그래픽: GeForce® GT1030 or higher
    DirectX: 버전 11
    저장공간: 5 GB 사용 가능 공간
    사운드카드: DirectX compatible
    추가 사항: Recommended resolution 1920x1080</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 or higher
    프로세서: Intel Core i3
    메모리: 8 GB RAM
    그래픽: GeForce® GT1030 or higher
    DirectX: 버전 11
    저장공간: 5 GB 사용 가능 공간
    사운드카드: DirectX compatible
    추가 사항: Recommended resolution 1920x1080</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">로블록스</span> : 중옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제: Windows 7, 8, 8.1, 10, 11, OS X 10.10 Yosemite 이상
    그래픽 카드: DirectX 10 및 Shader Model 2.0 지원
    프로세서: 1.6GHz 이상 최신 프로세서 (2005~)
    메모리: 1GB
    저장 공간: 20MB
    API: DirectX 10, 11[25], Vulkan[26], Metal[27]
    인터넷: 4-8 Mb/s</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제: Windows 7, 8, 8.1, 10, 11, OS X 10.10 Yosemite 이상
    그래픽 카드: DirectX 10 및 Shader Model 2.0 지원
    프로세서: 1.6GHz 이상 최신 프로세서 (2005~)
    메모리: 1GB
    저장 공간: 20MB
    API: DirectX 10, 11[25], Vulkan[26], Metal[27]
    인터넷: 4-8 Mb/s</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">로스트아크</span> : 중옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows 10권장 (Windows 7 sp1 이상 지원, 64bit 운영체제만 지원)
    - CPU : Intel i3이상 / Ryzen 3이상
    - 램 : 8GB 이상
    - 하드 : 50GB 이상
    - 그래픽 : NVIDIA GeForce GTX 460 혹은 AMD Radeon HD 6850 이상</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows 10권장 (Windows 7 sp1 이상 지원, 64bit 운영체제만 지원)
    - CPU : Intel i3이상 / Ryzen 3이상
    - 램 : 8GB 이상
    - 하드 : 50GB 이상
    - 그래픽 : NVIDIA GeForce GTX 460 혹은 AMD Radeon HD 6850 이상</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">리그오브레전드</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows 7, Windows 8 또는 Windows 10 정품 (x86 32bit 또는 x64)
    - CPU : Intel: Core i3-530 AMD: A6-3650 ARM: 미지원
    - 램 : 2GB
    - 하드 : HDD 16GB 이상
    - 그래픽 : NVidia: GeForce 9600GT AMD: HD 6570 Intel: Intel HD 4600 내장 그래픽 (비디오 메모리 1GB 이상)</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows 7, Windows 8 또는 Windows 10 정품 (x86 32bit 또는 x64)
    - CPU : Intel: Core i3-530 AMD: A6-3650 ARM: 미지원
    - 램 : 2GB
    - 하드 : HDD 16GB 이상
    - 그래픽 : NVidia: GeForce 9600GT AMD: HD 6570 Intel: Intel HD 4600 내장 그래픽 (비디오 메모리 1GB 이상)</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">리씰컴퍼니</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>시스템 최소 요구 사항
    운영체제 Windows 10
    프로세서 Intel Core i5-7400 CPU @ 3.00GHz ; Shader Model 5
    그래픽 NVIDIA GeForce GTX 1050
    API DirectX 버전 11
    저장 공간 1 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>시스템 최소 요구 사항
    운영체제 Windows 10
    프로세서 Intel Core i5-7400 CPU @ 3.00GHz ; Shader Model 5
    그래픽 NVIDIA GeForce GTX 1050
    API DirectX 버전 11
    저장 공간 1 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">림버스 컴퍼니 (Limbus Company)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10
    프로세서: Intel Core i5
    메모리: 8 GB RAM
    그래픽: GeForce GT 1030
    DirectX: 버전 10
    저장공간: 10 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10
    프로세서: Intel Core i5
    메모리: 8 GB RAM
    그래픽: GeForce GT 1030
    DirectX: 버전 10
    저장공간: 10 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">마비노기</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS: Windows 7 64bit 이상
    CPU: Intel Core i3 (1세대) 2.5GHz 이상
    램: 4GB 이상
    하드: 10GB 이상
    그래픽: Geforce 8600GT 이상</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS: Windows 7 64bit 이상
    CPU: Intel Core i3 (1세대) 2.5GHz 이상
    램: 4GB 이상
    하드: 10GB 이상
    그래픽: Geforce 8600GT 이상</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">마운트 앤 블레이드 2: 배너로드</span> : 하옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 (64-bit only)
    프로세서: Intel® Core™ i3-8100/AMD Ryzen™ 3 1200
    메모리: 6 GB RAM
    그래픽: Intel® UHD Graphics 630/NVIDIA® GeForce® GTX 660 2GB/AMD Radeon™ HD 7850 2GB
    저장공간: 60 GB 사용 가능 공간
    추가 사항: 통합형 GPU에는 2GB의 시스템 RAM이 추가적으로 필요합니다. 이 예상치는 최종 출시 이후에 변경될 수 있습니다.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 (64-bit only)
    프로세서: Intel® Core™ i3-8100/AMD Ryzen™ 3 1200
    메모리: 6 GB RAM
    그래픽: Intel® UHD Graphics 630/NVIDIA® GeForce® GTX 660 2GB/AMD Radeon™ HD 7850 2GB
    저장공간: 60 GB 사용 가능 공간
    추가 사항: 통합형 GPU에는 2GB의 시스템 RAM이 추가적으로 필요합니다. 이 예상치는 최종 출시 이후에 변경될 수 있습니다.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">마인크래프트</span> : 하옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>CPU: 인텔 코어 i3-3210 3.2 GHz / AMD A8-7600 APU 3.1 GHz 와 동급의 제품
    RAM: 4GB (여유공간 2GB)
    GPU (내장): OpenGL 4.4*가 내장된 인텔 HD Graphics 4000 (아이비브릿지) / AMD 라데온 R5 시리즈 (카베리)
    GPU (외장): OpenGL 4.4가 내장된 Nvidia 지포스 400 Series 또는 AMD 라데온 HD 7000 시리즈
    저장장치: 최소 1GB (게임 파일 자체는 180MB이지만, 맵과 기타 파일을 위한 공간이 필요)
    운영체제:
    - 윈도우: 윈도우 7 이상
    - 매킨토시: OS X 10.9 Maverick
    - 리눅스: 2014년 이후의 모든 배포판
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>CPU: 인텔 코어 i3-3210 3.2 GHz / AMD A8-7600 APU 3.1 GHz 와 동급의 제품
    RAM: 4GB (여유공간 2GB)
    GPU (내장): OpenGL 4.4*가 내장된 인텔 HD Graphics 4000 (아이비브릿지) / AMD 라데온 R5 시리즈 (카베리)
    GPU (외장): OpenGL 4.4가 내장된 Nvidia 지포스 400 Series 또는 AMD 라데온 HD 7000 시리즈
    저장장치: 최소 1GB (게임 파일 자체는 180MB이지만, 맵과 기타 파일을 위한 공간이 필요)
    운영체제:
    - 윈도우: 윈도우 7 이상
    - 매킨토시: OS X 10.9 Maverick
    - 리눅스: 2014년 이후의 모든 배포판
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">매너 로드</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows® 10 (64-bit)
    프로세서: Intel® Core™ i5-4670 (quad-core) / AMD® FX-Series™ FX-4350 (quad-core)
    메모리: 8 GB RAM
    그래픽: NVIDIA® GeForce® GTX 1050 (2 GB) / AMD® Radeon™ RX-460 (4 GB) / Intel® Arc™ A380 (6 GB)
    DirectX: 버전 12
    저장공간: 15 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows® 10 (64-bit)
    프로세서: Intel® Core™ i5-4670 (quad-core) / AMD® FX-Series™ FX-4350 (quad-core)
    메모리: 8 GB RAM
    그래픽: NVIDIA® GeForce® GTX 1050 (2 GB) / AMD® Radeon™ RX-460 (4 GB) / Intel® Arc™ A380 (6 GB)
    DirectX: 버전 12
    저장공간: 15 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">메이플스토리</span> : 상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- 운영체제	최신 업데이트된 Window 7 64비트 이상
    - CPU	Pentium Dual Core급 이상
    - RAM	4GB 이상
    - 하드 디스크	여유공간 20GB 이상
    - 그래픽카드	Geforce 9600 GT / Radeon HD 5670 이상 (Shader 3.0 이상 지원 그래픽카드)
    - DirectX	9.0 이상</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- 운영체제	최신 업데이트된 Window 7 64비트 이상
    - CPU	Pentium Dual Core급 이상
    - RAM	4GB 이상
    - 하드 디스크	여유공간 20GB 이상
    - 그래픽카드	Geforce 9600 GT / Radeon HD 5670 이상 (Shader 3.0 이상 지원 그래픽카드)
    - DirectX	9.0 이상</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">명조: 워더링 웨이브</span> : (최상옵)으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 : Windows10 64비트 
    CPU : intel i5(9세대)/Ryzen 2700 
    그래픽카드 : GTX 1060/RX 570/11세대 intel 내장 그래픽 
    메모리 : 16GB 이상 
    저장 공간 : 25GB, SSD 설치 권장
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 : Windows10 64비트 
    CPU : intel i5(9세대)/Ryzen 2700 
    그래픽카드 : GTX 1060/RX 570/11세대 intel 내장 그래픽 
    메모리 : 16GB 이상 
    저장 공간 : 25GB, SSD 설치 권장
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>(최상옵)</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">몬스터 헌터 월드</span> : 중옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS	WINDOWS® 7, 8, 8.1, 10 (64-BIT 필수)
    CPU	Intel® Core™ i5 4460 or Core™ i3 9100F or AMD FX™-6300 or Ryzen™ 3 3200G
    메모리	8GB RAM
    스토리지	52 GB 이용 가능
    그래픽	NVIDIA® GeForce® GTX 760 or GTX1050 or AMD Radeon™ R7 260x or RX 560
    DirectX	Version 11
    사운드 카드	DirectSound 대응(DirectX® 9.0c 이상)
    네트워크	광대역 인터넷 접속
    비고1 : 그래픽 'Low' 설정으로, 1080p/30fps의 게임 플레이가 가능합니다.
    비고2 : 64비트 CPU와 오페레이팅 시스템이 필요합니다.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS	WINDOWS® 7, 8, 8.1, 10 (64-BIT 필수)
    CPU	Intel® Core™ i5 4460 or Core™ i3 9100F or AMD FX™-6300 or Ryzen™ 3 3200G
    메모리	8GB RAM
    스토리지	52 GB 이용 가능
    그래픽	NVIDIA® GeForce® GTX 760 or GTX1050 or AMD Radeon™ R7 260x or RX 560
    DirectX	Version 11
    사운드 카드	DirectSound 대응(DirectX® 9.0c 이상)
    네트워크	광대역 인터넷 접속
    비고1 : 그래픽 'Low' 설정으로, 1080p/30fps의 게임 플레이가 가능합니다.
    비고2 : 64비트 CPU와 오페레이팅 시스템이 필요합니다.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">발더스 게이트3</span> : 중옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows 10 64 비트
    - CPU : 인텔 i5-4690 / AMD FX 4350
    - 램 : 8GB RAM
    - 하드 : 70GB의 사용 가능한 공간
    - 그래픽 : Nvidia GTX 780 / AMD Radeon R9 280X</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows 10 64 비트
    - CPU : 인텔 i5-4690 / AMD FX 4350
    - 램 : 8GB RAM
    - 하드 : 70GB의 사용 가능한 공간
    - 그래픽 : Nvidia GTX 780 / AMD Radeon R9 280X</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">발로란트</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows 10 (빌드 17134 이상) 또는 11, 64비트
    - CPU : Intel Core 2 Duo E8400
    - 램 : 4GB
    - 그래픽 : Intel HD 4000</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows 10 (빌드 17134 이상) 또는 11, 64비트
    - CPU : Intel Core 2 Duo E8400
    - 램 : 4GB
    - 그래픽 : Intel HD 4000</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">백 4 블러드</span> : 중옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS
    Windows 10 64비트
    CPU	Intel Core i5-6600 (3.3 GHz) 또는 AMD Ryzen 5 2600 (3.4 GHz)
    RAM 8 GB
    GPU	NVIDIA GeForce GTX 1050 Ti 또는 AMD Radeon RX 570
    DX 버전 DX 12
    저장공간	40 GB HDD
    NOTES 1080p / 60fps / Low Quality Settings</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS
    Windows 10 64비트
    CPU	Intel Core i5-6600 (3.3 GHz) 또는 AMD Ryzen 5 2600 (3.4 GHz)
    RAM 8 GB
    GPU	NVIDIA GeForce GTX 1050 Ti 또는 AMD Radeon RX 570
    DX 버전 DX 12
    저장공간	40 GB HDD
    NOTES 1080p / 60fps / Low Quality Settings</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">사이버펑크 2077</span> : 하옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows 7 또는 10
    - CPU : Intel Core i5-3570K 또는 AMD FX-8310
    - 램 : 8GB RAM
    - 하드 : 70GB의 사용 가능한 공간
    - 그래픽 : NVIDIA GeForce GTX 780 또는 AMD Radeon RX 470</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows 7 또는 10
    - CPU : Intel Core i5-3570K 또는 AMD FX-8310
    - 램 : 8GB RAM
    - 하드 : 70GB의 사용 가능한 공간
    - 그래픽 : NVIDIA GeForce GTX 780 또는 AMD Radeon RX 470</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵 &#60; 최상옵+RT</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">사일런트 힐 2 (SILENT HILL 2)</span> : 하옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10 x64
    프로세서: Intel Core i7-6700K | AMD Ryzen 5 3600
    메모리: 16 GB RAM
    그래픽: NVIDIA® GeForce® GTX 1070 Ti or AMD Radeon™ RX 5700
    DirectX: 버전 12
    저장공간: 50 GB 사용 가능 공간
    사운드카드: Windows Compatible Audio Device.
    추가 사항: Playing on minimum requirements should enable to play on Low/Medium quality settings in FullHD (1080p) in stable 30 FPS. SSD is recommended.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10 x64
    프로세서: Intel Core i7-6700K | AMD Ryzen 5 3600
    메모리: 16 GB RAM
    그래픽: NVIDIA® GeForce® GTX 1070 Ti or AMD Radeon™ RX 5700
    DirectX: 버전 12
    저장공간: 50 GB 사용 가능 공간
    사운드카드: Windows Compatible Audio Device.
    추가 사항: Playing on minimum requirements should enable to play on Low/Medium quality settings in FullHD (1080p) in stable 30 FPS. SSD is recommended.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">새티스 팩토리(Satisfactory)</span> : 중옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 or later (64-Bit)
    프로세서: i5-3570 3.4 GHz 4 Core
    메모리: 8 GB RAM
    그래픽: Nvidia GTX 1650/GTX 1050-ti, or AMD RX 470/RX 570, or equivalent performance & VRAM
    저장공간: 20 GB 사용 가능 공간
    추가 사항: Internet connection required for multiplayer. The game is in early access and minimum requirements may change.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 or later (64-Bit)
    프로세서: i5-3570 3.4 GHz 4 Core
    메모리: 8 GB RAM
    그래픽: Nvidia GTX 1650/GTX 1050-ti, or AMD RX 470/RX 570, or equivalent performance & VRAM
    저장공간: 20 GB 사용 가능 공간
    추가 사항: Internet connection required for multiplayer. The game is in early access and minimum requirements may change.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">샌드랜드</span> : 중옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>Requires a 64-bit processor and operating system
    OS: Windows 10
    Processor: AMD Ryzen 5 2400G / Intel Core i5-9400F
    Memory: 4 GB RAM
    Graphics: AMD Radeon RX 590 / Nvidia GeForce GTX 1060
    DirectX: Version 12
    Storage: 20 GB available space
    Additional Notes: Estimated performance: 1080p/60fps with graphics settings at "Low". Framerate might drop in graphics-intensive scenes. - 64-bit processor and operating system are required.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>Requires a 64-bit processor and operating system
    OS: Windows 10
    Processor: AMD Ryzen 5 2400G / Intel Core i5-9400F
    Memory: 4 GB RAM
    Graphics: AMD Radeon RX 590 / Nvidia GeForce GTX 1060
    DirectX: Version 12
    Storage: 20 GB available space
    Additional Notes: Estimated performance: 1080p/60fps with graphics settings at "Low". Framerate might drop in graphics-intensive scenes. - 64-bit processor and operating system are required.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">서든어택</span> : 상옵으로 75 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS : Windows 7
    CPU : Intel Core2 Duo E6300
    램 : 2GB
    하드 : 20GB
    그래픽 : GeForce 7600GT</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS : Windows 7
    CPU : Intel Core2 Duo E6300
    램 : 2GB
    하드 : 20GB
    그래픽 : GeForce 7600GT</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">소울워커</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10, 64 bit or above
    프로세서: Intel Core2 duo E8300 or above
    메모리: 4 GB RAM
    그래픽: Geforce GTX 460 / Radeon HD 5850
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 20 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10, 64 bit or above
    프로세서: Intel Core2 duo E8300 or above
    메모리: 4 GB RAM
    그래픽: Geforce GTX 460 / Radeon HD 5850
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 20 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">쉐이프즈 2 (shapez 2)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 64bit
    프로세서: Intel(R) Core(TM) i5-4440 CPU
    메모리: 4 GB RAM
    그래픽: Intel(R) UHD Graphics 630, 1GB VRAM
    저장공간: 2000 MB 사용 가능 공간
    추가 사항: 풀 HD에서 '최소' 그래픽 프리셋의 경우. 스크롤 휠이 있는 2버튼 마우스가 필요합니다.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 64bit
    프로세서: Intel(R) Core(TM) i5-4440 CPU
    메모리: 4 GB RAM
    그래픽: Intel(R) UHD Graphics 630, 1GB VRAM
    저장공간: 2000 MB 사용 가능 공간
    추가 사항: 풀 HD에서 '최소' 그래픽 프리셋의 경우. 스크롤 휠이 있는 2버튼 마우스가 필요합니다.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">스타크래프트</span> : 상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows 7, OS X® 10.10
    - CPU : Intel® Pentium® D 또는 AMD™ Athlon™ 64 X2
    - 램 : 2GB
    - 하드 : 8 GB 이상의 하드 드라이브 여유 공간
    - 그래픽 : NVIDIA® GeForce; 6800 (256 MB) 또는 ATI™ Radeon™ X1600 Pro (256 MB)</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows 7, OS X® 10.10
    - CPU : Intel® Pentium® D 또는 AMD™ Athlon™ 64 X2
    - 램 : 2GB
    - 하드 : 8 GB 이상의 하드 드라이브 여유 공간
    - 그래픽 : NVIDIA® GeForce; 6800 (256 MB) 또는 ATI™ Radeon™ X1600 Pro (256 MB)</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">스텔라 블레이드</span> : 중으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS : Windows 10 64-bit
    CPU : Intel Core i5-7600k / AMD Ryzen 5 1600X Processor
    램 : 16GB RAM
    하드 : 75GB 사용 가능 공간
    그래픽 :  NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 580 8GB
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS : Windows 10 64-bit
    CPU : Intel Core i5-7600k / AMD Ryzen 5 1600X Processor
    램 : 16GB RAM
    하드 : 75GB 사용 가능 공간
    그래픽 :  NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 580 8GB
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">스트리노바</span> : 상으로  FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 : Windows 7, 8, 10, 11 (64bit)
    프로세서 : Intel Core i3-4170
    메모리 : 4GB RAM
    저장공간 : 25GB 사용 가능 공간
    그래픽 : Nvidia GeForce GTX 730 / AMD R7 240
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 : Windows 7, 8, 10, 11 (64bit)
    프로세서 : Intel Core i3-4170
    메모리 : 4GB RAM
    저장공간 : 25GB 사용 가능 공간
    그래픽 : Nvidia GeForce GTX 730 / AMD R7 240
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">심즈4</span> : 최상으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS: 64 비트 필요. Windows 10
    프로세서(CPU): 3.3 GHz Intel Core i3-3220 (2 코어, 4 스레드), AMD Ryzen 3 1200 3.1 GHz (4 코어) 이상
    메모리 (RAM): 최소 4 GB 램
    하드 드라이브 (여유 공간): 최소 25 GB의 여유 공간 + 커스텀 콘텐츠와 게임 저장을 위한 1 GB 추가 공간
    디스크 드라이브: 게임의 물리적 디스크에서 설치하는 경우에만 DVD-ROM 드라이브 필요
    그래픽 카드 (비디오): 128 MB의 비디오 램, Pixel Shader 3.0 지원
    지원하는 그래픽 카드: NVIDIA GeForce 6600 이상, ATI Radeon X1300 이상, Intel GMA X4500 이상
    DirectX 버전: DirectX 11 호환</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS: 64 비트 필요. Windows 10
    프로세서(CPU): 3.3 GHz Intel Core i3-3220 (2 코어, 4 스레드), AMD Ryzen 3 1200 3.1 GHz (4 코어) 이상
    메모리 (RAM): 최소 4 GB 램
    하드 드라이브 (여유 공간): 최소 25 GB의 여유 공간 + 커스텀 콘텐츠와 게임 저장을 위한 1 GB 추가 공간
    디스크 드라이브: 게임의 물리적 디스크에서 설치하는 경우에만 DVD-ROM 드라이브 필요
    그래픽 카드 (비디오): 128 MB의 비디오 램, Pixel Shader 3.0 지원
    지원하는 그래픽 카드: NVIDIA GeForce 6600 이상, ATI Radeon X1300 이상, Intel GMA X4500 이상
    DirectX 버전: DirectX 11 호환</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">쓰론 앤 리버티 (TL)</span> : 하옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>해상도	1080p
    그래픽 품질	낮음
    CPU	Core i5-6500
    GPU	GTX 960 4GB
    RAM	8GB
    저장장치	60GB SSD
    운영체제	Windows 10 20H2
    DirectX	12

    그래픽 하드웨어가 지원하는 경우 자동으로 활성화되는 업스케일링 (DLSS2 등) 환경에서 측정한 사양입니다.
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>해상도	1080p
    그래픽 품질	낮음
    CPU	Core i5-6500
    GPU	GTX 960 4GB
    RAM	8GB
    저장장치	60GB SSD
    운영체제	Windows 10 20H2
    DirectX	12

    그래픽 하드웨어가 지원하는 경우 자동으로 활성화되는 업스케일링 (DLSS2 등) 환경에서 측정한 사양입니다.
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">아레나 브레이크아웃: 인피니티</span> : 하옵으로 100 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: 64-bit Windows 10 or above
    프로세서: Core i5-7500 or Ryzen 5 1400
    메모리: 16 GB RAM
    그래픽: NVIDIA GTX 960 or AMD Radeon RX 560 or Arc A380 with Video Memory 4G or above
    DirectX: 버전 12
    네트워크: 초고속 인터넷 연결
    저장공간: 60 GB 사용 가능 공간
    추가 사항: 이는 8월 Early Access 버전의 요구 사항만을 나타냅니다. 우리는 계속해서 더 많은 기기에 맞게 최적화할 예정입니다. 계속 지켜봐 주시기 바랍니다.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: 64-bit Windows 10 or above
    프로세서: Core i5-7500 or Ryzen 5 1400
    메모리: 16 GB RAM
    그래픽: NVIDIA GTX 960 or AMD Radeon RX 560 or Arc A380 with Video Memory 4G or above
    DirectX: 버전 12
    네트워크: 초고속 인터넷 연결
    저장공간: 60 GB 사용 가능 공간
    추가 사항: 이는 8월 Early Access 버전의 요구 사항만을 나타냅니다. 우리는 계속해서 더 많은 기기에 맞게 최적화할 예정입니다. 계속 지켜봐 주시기 바랍니다.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">아머드 코어 6 루비콘의 화염</span> : 하으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS    Windows 10
    CPU   Intel Core i5-8600K or AMD Ryzen 3 3300X
    램   12 GB RAM
    저장공간   65 GB 사용 가능 공간
    그래픽    NVIDIA GeForce GTX 960, 4 GB or AMD Radeon RX 480, 4 GB or Intel Arc A380, 6 GB
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS    Windows 10
    CPU   Intel Core i5-8600K or AMD Ryzen 3 3300X
    램   12 GB RAM
    저장공간   65 GB 사용 가능 공간
    그래픽    NVIDIA GeForce GTX 960, 4 GB or AMD Radeon RX 480, 4 GB or Intel Arc A380, 6 GB
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">아이작의 번제</span> : 상으로  FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 : Windows XP, Vista, 7, OS X 버전 Leopard 10.5.8, Snow Leopard 10.6.3 이상.
    프로세서 : 2.5Hz, Intel MAC 2.5 GHz
    메모리 : 1GB 이상
    저장공간 : 50MB
    그래픽 : Direct X9.0c 호환 카드
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 : Windows XP, Vista, 7, OS X 버전 Leopard 10.5.8, Snow Leopard 10.6.3 이상.
    프로세서 : 2.5Hz, Intel MAC 2.5 GHz
    메모리 : 1GB 이상
    저장공간 : 50MB
    그래픽 : Direct X9.0c 호환 카드
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">아크레이더스</span> : 하으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS - Windows 10 64bit 이상 (최신 업데이트)
    CPU - Intel Core i5-6600K / AMD Ryzen R5 1600 processor
    램 - 12GB RAM
    그래픽 - NVIDIA GeForce GTX 1050 Ti / AMD Radeon RX 580 / Intel Arc A380
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS - Windows 10 64bit 이상 (최신 업데이트)
    CPU - Intel Core i5-6600K / AMD Ryzen R5 1600 processor
    램 - 12GB RAM
    그래픽 - NVIDIA GeForce GTX 1050 Ti / AMD Radeon RX 580 / Intel Arc A380
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">아크서바이벌 어센디드</span> : 하옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 : Windows 10 / 11 64-bit with updates
    프로세서 : Intel Core i7-6800K / AMD Ryzen 5 2600X
    메모리 : 16 GB RAM
    그래픽 카드 : NVIDIA GeForce GTX 1080 / AMD Radeon RX 5600 XT
    API : DirectX 12
    저장 공간 : 70 GB SSD</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 : Windows 10 / 11 64-bit with updates
    프로세서 : Intel Core i7-6800K / AMD Ryzen 5 2600X
    메모리 : 16 GB RAM
    그래픽 카드 : NVIDIA GeForce GTX 1080 / AMD Radeon RX 5600 XT
    API : DirectX 12
    저장 공간 : 70 GB SSD</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">어바우드</span> : 상옵으로  FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제	Windows 10, 11 
    프로세서	AMD Ryzen 5 2600 / Intel i5-8400
    메모리	16 GB RAM
    저장공간	75 GB 사용 가능 공간 
    그래픽	AMD RX 5700 / Nvidia GTX 1070 / Intel Arc A580 
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제	Windows 10, 11 
    프로세서	AMD Ryzen 5 2600 / Intel i5-8400
    메모리	16 GB RAM
    저장공간	75 GB 사용 가능 공간 
    그래픽	AMD RX 5700 / Nvidia GTX 1070 / Intel Arc A580 
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">어쌔신 크리드 미라지</span> : 중옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>CPU: Intel Core i7-4790K (Intel Core i5-8400 for Intel Arc with ReBAR)/AMD Ryzen 5 1600
    GPU: Intel Arc A380 6GB/NVIDIA GeForce GTX 1060 6GB/AMD Radeon RX 570 4GB
    RAM: 8GB (dual-channel mode)
    OS: Windows 10/11
    SSD Storage: 40 GB</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>CPU: Intel Core i7-4790K (Intel Core i5-8400 for Intel Arc with ReBAR)/AMD Ryzen 5 1600
    GPU: Intel Arc A380 6GB/NVIDIA GeForce GTX 1060 6GB/AMD Radeon RX 570 4GB
    RAM: 8GB (dual-channel mode)
    OS: Windows 10/11
    SSD Storage: 40 GB</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">어쌔신 크리드 섀도우스</span> : 하으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 : Windows 10, 11
    프로세서 :Intel Core i7 8700k / AMD Ryzen 5 3600
    메모리 : 16GB RAM
    저장공간 : 115GB 사용 가능 공간
    그래픽 : Nvidia GeForce GTX 1070 8GB / AMD Radeon RX 5700 8GB / Intel Arc A580 8GB (REBAR ON)
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 : Windows 10, 11
    프로세서 :Intel Core i7 8700k / AMD Ryzen 5 3600
    메모리 : 16GB RAM
    저장공간 : 115GB 사용 가능 공간
    그래픽 : Nvidia GeForce GTX 1070 8GB / AMD Radeon RX 5700 8GB / Intel Arc A580 8GB (REBAR ON)
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">에이지 오브 미쏠로지 리톨드</span> : 중옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10 64bit
    프로세서: Intel® i3-4130 or AMD FX 4350 at 2.4GHZ+ with 2 cores / 4 threads and AVX support
    메모리: 8 GB RAM
    그래픽: NVIDIA® GeForce® GTX 645 or AMD Radeon™ Vega 8 or Intel® Iris Graphics 550 or better
    DirectX: 버전 12
    저장공간: 25 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10 64bit
    프로세서: Intel® i3-4130 or AMD FX 4350 at 2.4GHZ+ with 2 cores / 4 threads and AVX support
    메모리: 8 GB RAM
    그래픽: NVIDIA® GeForce® GTX 645 or AMD Radeon™ Vega 8 or Intel® Iris Graphics 550 or better
    DirectX: 버전 12
    저장공간: 25 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">에일 ＆ 테일 태번 (Ale ＆ Tale Tavern)</span> : 상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10
    프로세서: Quad core
    메모리: 8 GB RAM
    그래픽: Nvidia GTX 1060
    네트워크: 초고속 인터넷 연결
    저장공간: 7 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10
    프로세서: Quad core
    메모리: 8 GB RAM
    그래픽: Nvidia GTX 1060
    네트워크: 초고속 인터넷 연결
    저장공간: 7 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">엘든 링: 황금 나무의 그림자</span> : 중옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows 10
    - CPU : INTEL CORE I5-8400 or AMD RYZEN 3 3300X
    - 램 : 12GB RAM
    - 하드 : 60GB 사용 가능 공간
    - 그래픽 : NVIDIA GEFORCE GTX 1060 3 GB or AMD RADEON RX 580 4 GB</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows 10
    - CPU : INTEL CORE I5-8400 or AMD RYZEN 3 3300X
    - 램 : 12GB RAM
    - 하드 : 60GB 사용 가능 공간
    - 그래픽 : NVIDIA GEFORCE GTX 1060 3 GB or AMD RADEON RX 580 4 GB</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">엘든링</span> : 중옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows 10
    - CPU : INTEL CORE I5-8400 or AMD RYZEN 3 3300X
    - 램 : 12GB RAM
    - 하드 : 60GB 사용 가능 공간
    - 그래픽 : NVIDIA GEFORCE GTX 1060 3 GB or AMD RADEON RX 580 4 GB</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows 10
    - CPU : INTEL CORE I5-8400 or AMD RYZEN 3 3300X
    - 램 : 12GB RAM
    - 하드 : 60GB 사용 가능 공간
    - 그래픽 : NVIDIA GEFORCE GTX 1060 3 GB or AMD RADEON RX 580 4 GB</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">오버워치2</span> : 상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : 윈도우® 10 64-bit (최신 서비스팩) 32비트 운영체제는 지원하지 않습니다
    - CPU : Intel® Core™ i3 또는 AMD Phenom™ X3 8650
    - 램 : 6GB RAM
    - 하드 : 50GB 이상의 하드 드라이브 여유 공간
    - 그래픽 : NVIDIA® GeForce® GTX 600 시리즈, AMD Radeon™ HD 7000 시리즈</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : 윈도우® 10 64-bit (최신 서비스팩) 32비트 운영체제는 지원하지 않습니다
    - CPU : Intel® Core™ i3 또는 AMD Phenom™ X3 8650
    - 램 : 6GB RAM
    - 하드 : 50GB 이상의 하드 드라이브 여유 공간
    - 그래픽 : NVIDIA® GeForce® GTX 600 시리즈, AMD Radeon™ HD 7000 시리즈</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; PC방옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">용과 같이 8</span> : 하옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>Requires a 64-bit processor and operating system
    OS: Windows 10 1903 (OS Build 18362)
    Processor: Intel Core i5-3470, 3.2 GHz or AMD Ryzen 3 1200, 3.1 GHz
    Memory: 8 GB RAM
    Graphics: NVIDIA GeForce GTX 960, 4 GB or AMD Radeon RX 460, 4 GB or Intel Arc A380, 6 GB
    DirectX: Version 12
    Storage: 82 GB available space
    Sound Card: Windows Compatible Audio Device
    Additional Notes: 1080p Low @ 30 FPS w/ Balanced FSR 1.0, requires a CPU which supports the AVX and SSE4.2 instruction set</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>Requires a 64-bit processor and operating system
    OS: Windows 10 1903 (OS Build 18362)
    Processor: Intel Core i5-3470, 3.2 GHz or AMD Ryzen 3 1200, 3.1 GHz
    Memory: 8 GB RAM
    Graphics: NVIDIA GeForce GTX 960, 4 GB or AMD Radeon RX 460, 4 GB or Intel Arc A380, 6 GB
    DirectX: Version 12
    Storage: 82 GB available space
    Sound Card: Windows Compatible Audio Device
    Additional Notes: 1080p Low @ 30 FPS w/ Balanced FSR 1.0, requires a CPU which supports the AVX and SSE4.2 instruction set</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">워테일즈(Wartales)</span> : 중옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 64bit
    프로세서: Intel Core i5 2.5 GHz / AMD Ryzen 5
    메모리: 8 GB RAM
    그래픽: NVidia GTX 1050 / AMD RX550
    DirectX: 버전 10
    저장공간: 30 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 64bit
    프로세서: Intel Core i5 2.5 GHz / AMD Ryzen 5
    메모리: 8 GB RAM
    그래픽: NVidia GTX 1050 / AMD RX550
    DirectX: 버전 10
    저장공간: 30 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">워프레임</span> : 하옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS *:Windows 7 64-Bit (32-bit not supported)
    Processor:Intel Core i7 860, Intel Core i5 750, or AMD FX-4100 (SSE 4.2 support required)
    Video:DirectX 11+ capable Graphics Card
    Memory:4 GB RAM
    Storage:50 GB available HD space
    Internet:Broadband Internet Connection Required

    Note: There is no Mac or Linux client currently available.
    * Starting January 1st, 2024, the Steam Client will only support Windows 10 and later versions.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS *:Windows 7 64-Bit (32-bit not supported)
    Processor:Intel Core i7 860, Intel Core i5 750, or AMD FX-4100 (SSE 4.2 support required)
    Video:DirectX 11+ capable Graphics Card
    Memory:4 GB RAM
    Storage:50 GB available HD space
    Internet:Broadband Internet Connection Required

    Note: There is no Mac or Linux client currently available.
    * Starting January 1st, 2024, the Steam Client will only support Windows 10 and later versions.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">원스 휴먼(Once Human)</span> : 중옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10 64-bit Operating System
    프로세서: Intel Core i5-4460
    메모리: 8 GB RAM
    그래픽: Nvidia GTX 750ti 4G / AMD Radeon RX550
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 55 GB 사용 가능 공간
    추가 사항: SSD is highly recommended</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10 64-bit Operating System
    프로세서: Intel Core i5-4460
    메모리: 8 GB RAM
    그래픽: Nvidia GTX 750ti 4G / AMD Radeon RX550
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 55 GB 사용 가능 공간
    추가 사항: SSD is highly recommended</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">원신</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows 7 SP1 64-bit , Windows 8.1 64-bit , Windows 10 64-bit
    - CPU : Intel Core i5 또는 동급 CPU
    - 램 : 8GB RAM
    - 하드 : 30 GB
    - 그래픽 : NVIDIA® GeForce® GT 1030 및 더 높은 사양</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows 7 SP1 64-bit , Windows 8.1 64-bit , Windows 10 64-bit
    - CPU : Intel Core i5 또는 동급 CPU
    - 램 : 8GB RAM
    - 하드 : 30 GB
    - 그래픽 : NVIDIA® GeForce® GT 1030 및 더 높은 사양</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">월드오브탱크</span> : 상으로  FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 : Windows XP SP3/Vista/7/8/10
    CPU : SSE2를 지원하는 듀얼 코어 이상의&#160;프로세서
    RAM : XP 사용 시 1.5GB,&#160;Vista/7/8/10 사용 시 2GB : 
    저장공간 : 25 GB
    그래픽 카드 : GeForce 6800 256 MB RAM&#160;&#160;/ATI HD X2400 XT 256 MB RAM, DirectX 9.0c
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 : Windows XP SP3/Vista/7/8/10
    CPU : SSE2를 지원하는 듀얼 코어 이상의&#160;프로세서
    RAM : XP 사용 시 1.5GB,&#160;Vista/7/8/10 사용 시 2GB : 
    저장공간 : 25 GB
    그래픽 카드 : GeForce 6800 256 MB RAM&#160;&#160;/ATI HD X2400 XT 256 MB RAM, DirectX 9.0c
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">이터널리턴</span> : 중옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS : WINDOWS® 10 (64Bit)
    CPU : Intel Core i3-3225, AMD FX-4350
    램 : 4GB RAM
    하드 : 3GB 사용 가능 공간
    그래픽 : NVIDIA GeForce GT 640, ATI Radeon HD 7700</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS : WINDOWS® 10 (64Bit)
    CPU : Intel Core i3-3225, AMD FX-4350
    램 : 4GB RAM
    하드 : 3GB 사용 가능 공간
    그래픽 : NVIDIA GeForce GT 640, ATI Radeon HD 7700</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">인슈라오디드</span> : 하옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영체제: Windows 10
    프로세서: Intel Core i5-6400 (2.7 GHz 4 Core) / AMD Ryzen 5 1500X (3.5 GHz 4 Core) or equivalent
    메모리: 16 GB RAM
    그래픽: NVIDIA GeForce GTX 1060 (req. 6GB VRAM) / AMD Radeon RX 580 (req. 6GB VRAM)
    네트워크: 초고속 인터넷 연결
    저장공간: 60 GB 사용 가능 공간
    사운드카드: on board</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영체제: Windows 10
    프로세서: Intel Core i5-6400 (2.7 GHz 4 Core) / AMD Ryzen 5 1500X (3.5 GHz 4 Core) or equivalent
    메모리: 16 GB RAM
    그래픽: NVIDIA GeForce GTX 1060 (req. 6GB VRAM) / AMD Radeon RX 580 (req. 6GB VRAM)
    네트워크: 초고속 인터넷 연결
    저장공간: 60 GB 사용 가능 공간
    사운드카드: on board</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">작혼: 리치 마작</span> : 최상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 SP1 or higher
    프로세서: Intel Pentium Dual CPU E2180 2.00GHz
    메모리: 2 GB RAM
    그래픽: GeForce GT 430 / ATI Radeon HD 2600XT
    DirectX: 버전 10
    네트워크: 초고속 인터넷 연결
    저장공간: 2048 MB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 SP1 or higher
    프로세서: Intel Pentium Dual CPU E2180 2.00GHz
    메모리: 2 GB RAM
    그래픽: GeForce GT 430 / ATI Radeon HD 2600XT
    DirectX: 버전 10
    네트워크: 초고속 인터넷 연결
    저장공간: 2048 MB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">진삼국무쌍 ORIGINS</span> : 중으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS : Windows® 10, 11 64-bit
    CPU : Intel Core i5-8400 / AMD Ryzen 5 2600
    램 : 12GB RAM
    하드 : 50GB 사용 가능 공간
    그래픽 : NVIDIA GeForce GTX 1060 (VRAM 6GB) / AMD Radeon RX 590 (VRAM 8GB)
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS : Windows® 10, 11 64-bit
    CPU : Intel Core i5-8400 / AMD Ryzen 5 2600
    램 : 12GB RAM
    하드 : 50GB 사용 가능 공간
    그래픽 : NVIDIA GeForce GTX 1060 (VRAM 6GB) / AMD Radeon RX 590 (VRAM 8GB)
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">카타클리스모(Cataclismo)</span> : 상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows® 10 (64-bit)
    프로세서: Intel® Core™ i7-4770 (quad-core) / AMD® FX-Series™ FX-9590 (quad-core)
    메모리: 8 GB RAM
    그래픽: NVIDIA® GeForce® GTX 760 (2 GB) / AMD® Radeon™ R9 270X (2 GB)
    DirectX: 버전 11
    저장공간: 10 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows® 10 (64-bit)
    프로세서: Intel® Core™ i7-4770 (quad-core) / AMD® FX-Series™ FX-9590 (quad-core)
    메모리: 8 GB RAM
    그래픽: NVIDIA® GeForce® GTX 760 (2 GB) / AMD® Radeon™ R9 270X (2 GB)
    DirectX: 버전 11
    저장공간: 10 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">카트라이더 : 드리프트</span> : 중옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS : Windows 10 이상 (64bit)
    CPU : 인텔 1세대 i3 또는 FX 6000 시리즈 이상
    램 : 8GB
    하드 : 30GB
    그래픽 : Geforce GTX 760 또는 AMD 라데온 HD 7950</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS : Windows 10 이상 (64bit)
    CPU : 인텔 1세대 i3 또는 FX 6000 시리즈 이상
    램 : 8GB
    하드 : 30GB
    그래픽 : Geforce GTX 760 또는 AMD 라데온 HD 7950</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">컨커러스 블레이드</span> : 하옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 64-Bit
    프로세서: Intel I5-6400
    메모리: 8 GB RAM
    그래픽: Nvidia Geforce GTX 1050Ti
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 60 GB 사용 가능 공간
    추가 사항: Performance: 1080p / 30fps, Low Quality Settings</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 64-Bit
    프로세서: Intel I5-6400
    메모리: 8 GB RAM
    그래픽: Nvidia Geforce GTX 1050Ti
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 60 GB 사용 가능 공간
    추가 사항: Performance: 1080p / 30fps, Low Quality Settings</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">컬트 오브 더 램 (Cult of the Lamb)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 or later
    프로세서: Intel Core i3-3240 (2 * 3400); AMD FX-4300 (4 * 3800)
    메모리: 4 GB RAM
    그래픽: GeForce GTX 560 Ti (1024 VRAM); Radeon HD 7750 (1024 VRAM)
    저장공간: 4 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: Windows 7 or later
    프로세서: Intel Core i3-3240 (2 * 3400); AMD FX-4300 (4 * 3800)
    메모리: 4 GB RAM
    그래픽: GeForce GTX 560 Ti (1024 VRAM); Radeon HD 7750 (1024 VRAM)
    저장공간: 4 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">코어 키퍼(Core Keeper)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 64-bit
    프로세서: Intel Core i5-2300 / AMD Ryzen 3 1200
    메모리: 8 GB RAM
    그래픽: GeForce GTX 460 / Radeon HD 5850</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 64-bit
    프로세서: Intel Core i5-2300 / AMD Ryzen 3 1200
    메모리: 8 GB RAM
    그래픽: GeForce GTX 460 / Radeon HD 5850</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">크라임 씬 클리너(Crime Scene Cleaner)</span> : 중옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10/11
    프로세서: i5-7500 or similar
    메모리: 16 GB RAM
    그래픽: GTX 1060
    저장공간: 35 GB 사용 가능 공간
    추가 사항: Intel ARC 시리즈 카드가 아직 지원되지 않을 수 있습니다.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10/11
    프로세서: i5-7500 or similar
    메모리: 16 GB RAM
    그래픽: GTX 1060
    저장공간: 35 GB 사용 가능 공간
    추가 사항: Intel ARC 시리즈 카드가 아직 지원되지 않을 수 있습니다.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">크루세이더 킹즈 3</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows® 10 Home 64 bit
    프로세서: Intel® Core™ i3-2120 / AMD® FX 6350
    메모리: 6 GB RAM
    그래픽: Nvidia® GeForce™ GTX 660 (2GB) / AMD® Radeon™ HD 7870 (2GB) / Intel® Iris Pro™ 580 / Intel® Iris® Plus G7 / AMD® Radeon™ Vega 11
    저장공간: 8 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows® 10 Home 64 bit
    프로세서: Intel® Core™ i3-2120 / AMD® FX 6350
    메모리: 6 GB RAM
    그래픽: Nvidia® GeForce™ GTX 660 (2GB) / AMD® Radeon™ HD 7870 (2GB) / Intel® Iris Pro™ 580 / Intel® Iris® Plus G7 / AMD® Radeon™ Vega 11
    저장공간: 8 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">클레르 옵스퀴르 : 33 원정대</span> : 하으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영체제 : Windows 10
    프로세서 : Intel Core i7-8700K / AMD Ryzen 5 1600X"
    메모리 : 8GB RAM
    저장공간 : 55GB 사용 가능 공간
    그래픽 : NVIDIA GeForce GTX 1060 6 GB / AMD Radeon RX 5600 XT 6 GB / Intel Arc A380 6 GB
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영체제 : Windows 10
    프로세서 : Intel Core i7-8700K / AMD Ryzen 5 1600X"
    메모리 : 8GB RAM
    저장공간 : 55GB 사용 가능 공간
    그래픽 : NVIDIA GeForce GTX 1060 6 GB / AMD Radeon RX 5600 XT 6 GB / Intel Arc A380 6 GB
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">클로저스</span> : 상으로  FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 : Windows 64비트 (Win10)
    CPU : Intel Core i5 이상
    RAM : 8GB 이상
    저장공간 : 30GB 이상
    그래픽 카드 : Nvidia GeForce 1050TI 이상 또는 동급 그래픽 카드 이상
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 : Windows 64비트 (Win10)
    CPU : Intel Core i5 이상
    RAM : 8GB 이상
    저장공간 : 30GB 이상
    그래픽 카드 : Nvidia GeForce 1050TI 이상 또는 동급 그래픽 카드 이상
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">킹덤 컴: 딜리버런스</span> : 하옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: OS 64-bit Windows 7 or 64-bit Windows 8 (8.1) or Windows 10
    프로세서: Intel CPU Core i5-2500K 3.3GHz, AMD CPU Phenom II X4 940
    메모리: 8 GB RAM
    그래픽: Nvidia GPU GeForce GTX 660, AMD GPU Radeon HD 7870
    DirectX: 버전 11
    저장공간: 70 GB 사용 가능 공간
    사운드카드: Integrated
    추가 사항: SSD recommended</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제 *: OS 64-bit Windows 7 or 64-bit Windows 8 (8.1) or Windows 10
    프로세서: Intel CPU Core i5-2500K 3.3GHz, AMD CPU Phenom II X4 940
    메모리: 8 GB RAM
    그래픽: Nvidia GPU GeForce GTX 660, AMD GPU Radeon HD 7870
    DirectX: 버전 11
    저장공간: 70 GB 사용 가능 공간
    사운드카드: Integrated
    추가 사항: SSD recommended</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">타이니 글레이드 (Tiny Glade)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10+
    프로세서: Intel Core i5 or AMD Ryzen
    메모리: 4 GB RAM
    그래픽: For 720p: Radeon R9 270, GeForce GTX 670, Intel Iris Xe, or similar (with 2+ GB of VRAM)
    저장공간: 3 GB 사용 가능 공간
    사운드카드: Yes, please</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10+
    프로세서: Intel Core i5 or AMD Ryzen
    메모리: 4 GB RAM
    그래픽: For 720p: Radeon R9 270, GeForce GTX 670, Intel Iris Xe, or similar (with 2+ GB of VRAM)
    저장공간: 3 GB 사용 가능 공간
    사운드카드: Yes, please</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">태양 제국의 죄악 II</span> : 상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 v1607+ / 11 (64비트)
    프로세서: 4코어 프로세서 (인텔 코어 i5 5세대 또는 AMD 라이젠 2x00 시리즈)
    메모리: 8 GB RAM
    그래픽: 2GB VRAM이 장착된 3D 비디오 카드 (Nvidia GeForce 950 / AMD Radeon RX 450)
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 20 GB 사용 가능 공간
    추가 사항: 최소 화면 해상도 1920x1080</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 v1607+ / 11 (64비트)
    프로세서: 4코어 프로세서 (인텔 코어 i5 5세대 또는 AMD 라이젠 2x00 시리즈)
    메모리: 8 GB RAM
    그래픽: 2GB VRAM이 장착된 3D 비디오 카드 (Nvidia GeForce 950 / AMD Radeon RX 450)
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 20 GB 사용 가능 공간
    추가 사항: 최소 화면 해상도 1920x1080</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">트리 오브 세이비어</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제 *: Windows 7 (64-bit)
    프로세서: Intel i3
    그래픽: NVIDIA GeForce 200 Series or later
    DirectX: 버전 9.0
    네트워크: 초고속 인터넷 연결
    저장공간: 32 GB 사용 가능 공간
    추가 사항: Keyboard, Mouse</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제 *: Windows 7 (64-bit)
    프로세서: Intel i3
    그래픽: NVIDIA GeForce 200 Series or later
    DirectX: 버전 9.0
    네트워크: 초고속 인터넷 연결
    저장공간: 32 GB 사용 가능 공간
    추가 사항: Keyboard, Mouse</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">파이널 판타지 16</span> : 하옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows® 10 / 11 64-bit
    프로세서: AMD Ryzen™ 5 1600 / Intel® Core™ i5-8400
    메모리: 16 GB RAM
    그래픽: AMD Radeon™ RX 5700 / Intel® Arc™ A580 / NVIDIA® GeForce® GTX 1070
    DirectX: 버전 12
    저장공간: 170 GB 사용 가능 공간
    추가 사항: 30FPS at 720p expected. SSD required. VRAM 8GB or above.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows® 10 / 11 64-bit
    프로세서: AMD Ryzen™ 5 1600 / Intel® Core™ i5-8400
    메모리: 16 GB RAM
    그래픽: AMD Radeon™ RX 5700 / Intel® Arc™ A580 / NVIDIA® GeForce® GTX 1070
    DirectX: 버전 12
    저장공간: 170 GB 사용 가능 공간
    추가 사항: 30FPS at 720p expected. SSD required. VRAM 8GB or above.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">파티 애니멀즈 (Party Animals)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10, 64-bit / Windows 11, 64-bit
    프로세서: Intel Core i5 / AMD equivalent
    메모리: 8 GB RAM
    그래픽: NVIDIA GTX 750-Ti / AMD RX 550, 2GB VRam
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 8 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10, 64-bit / Windows 11, 64-bit
    프로세서: Intel Core i5 / AMD equivalent
    메모리: 8 GB RAM
    그래픽: NVIDIA GTX 750-Ti / AMD RX 550, 2GB VRam
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 8 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">패스 오브 엑자일(P.O.E)</span> : 권장옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- 운영 체제 (64 비트)	64비트 &#8211;Windows 7 / Windows 8 / Window10
    - 하드 디스크	30GB 이상 (NTFS 형식)
    - CPU X86 호환 2.6GHz 이상
    - 메모리 4GB RAM
    - 그래픽 카드 NVIDIA® GeForce® 650Ti GT 또는
    - ATI Radeon™ 7850 이상
    - DirectX 버전 11 이상</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- 운영 체제 (64 비트)	64비트 &#8211;Windows 7 / Windows 8 / Window10
    - 하드 디스크	30GB 이상 (NTFS 형식)
    - CPU X86 호환 2.6GHz 이상
    - 메모리 4GB RAM
    - 그래픽 카드 NVIDIA® GeForce® 650Ti GT 또는
    - ATI Radeon™ 7850 이상
    - DirectX 버전 11 이상</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 권장옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">팰월드(Palworld) / 팔월드</span> : 하옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영체제: Windows 10 or later (64-Bit)
    프로세서: i5-3570K 3.4 GHz 4 Core
    메모리: 16 GB RAM
    그래픽: GeForce GTX 1050 (2GB)
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 40 GB 사용 가능 공간
    추가 사항: Internet connection required for multiplayer. SSD required.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영체제: Windows 10 or later (64-Bit)
    프로세서: i5-3570K 3.4 GHz 4 Core
    메모리: 16 GB RAM
    그래픽: GeForce GTX 1050 (2GB)
    DirectX: 버전 11
    네트워크: 초고속 인터넷 연결
    저장공간: 40 GB 사용 가능 공간
    추가 사항: Internet connection required for multiplayer. SSD required.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">포르자 호라이즌5</span> : 중옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows 10 version 15063.0 or higher
    - CPU : Intel i5-4460 or AMD Ryzen 3 1200
    - 램 : 8GB RAM
    - 하드 : 110GB의 사용 가능한 공간
    - 그래픽 : NVidia GTX 970 OR AMD RX 470</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows 10 version 15063.0 or higher
    - CPU : Intel i5-4460 or AMD Ryzen 3 1200
    - 램 : 8GB RAM
    - 하드 : 110GB의 사용 가능한 공간
    - 그래픽 : NVidia GTX 970 OR AMD RX 470</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">풋볼매니저 2024</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS: Windows 7/8/8.1/10/11 및 업데이트 - 64비트
    프로세서: Intel Core 2 또는 AMD Athlon 64 X2 
    그래픽: Intel GMA X4500, NVIDIA GeForce 9600M GT, AMD/ATI Mobility Radeon HD 3650 - 256MB VRAM 및 DirectX® 11 필요 
    메모리: 4GB RAM
    저장 공간: 7GB 
    디스플레이: 1024x768 
    사양이 좋을수록 게임 성능이 향상됩니다.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS: Windows 7/8/8.1/10/11 및 업데이트 - 64비트
    프로세서: Intel Core 2 또는 AMD Athlon 64 X2 
    그래픽: Intel GMA X4500, NVIDIA GeForce 9600M GT, AMD/ATI Mobility Radeon HD 3650 - 256MB VRAM 및 DirectX® 11 필요 
    메모리: 4GB RAM
    저장 공간: 7GB 
    디스플레이: 1024x768 
    사양이 좋을수록 게임 성능이 향상됩니다.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">프로스트펑크 2 (Frostpunk 2)</span> : 하옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>운영 체제: Windows 10/11 (64-bit)
    프로세서: AMD Ryzen 5 / Intel Core i5 2.5 GHz
    메모리: 8 GB RAM
    그래픽: AMD RX 550 4 GB VRAM / NVIDIA GTX 1050Ti 4 GB VRAM / INTEL ARC A310 4GB VRAM
    DirectX: 버전 12
    저장공간: 30 GB 사용 가능 공간
    추가 사항: SSD required.</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>운영 체제: Windows 10/11 (64-bit)
    프로세서: AMD Ryzen 5 / Intel Core i5 2.5 GHz
    메모리: 8 GB RAM
    그래픽: AMD RX 550 4 GB VRAM / NVIDIA GTX 1050Ti 4 GB VRAM / INTEL ARC A310 4GB VRAM
    DirectX: 버전 12
    저장공간: 30 GB 사용 가능 공간
    추가 사항: SSD required.</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">프로젝트 좀보이드 (Project Zomboid)</span> : 최상옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS: Windows 10, 64 Bit
    64bit OS required
    Processor: Intel 2.77GHz Quad-core
    Memory: 8Gb Ram
    Hard Disk Space: 5gig
    Video Card: Dedicated graphics card with 2 GB of RAM minimum, OpenGL 2.1 and GLSL 1.2 support (generally 2012 or newer)
    Sound: FMOD compatible sound card</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS: Windows 10, 64 Bit
    64bit OS required
    Processor: Intel 2.77GHz Quad-core
    Memory: 8Gb Ram
    Hard Disk Space: 5gig
    Video Card: Dedicated graphics card with 2 GB of RAM minimum, OpenGL 2.1 and GLSL 1.2 support (generally 2012 or newer)
    Sound: FMOD compatible sound card</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">피파온라인4</span> : 최상옵으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>- OS : Windows 7/8/8.1/10 - 64-Bit / Android 버전 2.3.3 이상 / iOS 버전 7.0 이상
    - CPU : Intel Core i3-2100 @ 3.1GHz (or AMD Phenom 7950 Quad-Core, AMD Athlon II X4 620 equivalent)
    - 램 : 4GB
    - 하드 : 40GB
    - 그래픽 : Geforce GT 730, ATI Radeon HD 7570</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>- OS : Windows 7/8/8.1/10 - 64-Bit / Android 버전 2.3.3 이상 / iOS 버전 7.0 이상
    - CPU : Intel Core i3-2100 @ 3.1GHz (or AMD Phenom 7950 Quad-Core, AMD Athlon II X4 620 equivalent)
    - 램 : 4GB
    - 하드 : 40GB
    - 그래픽 : Geforce GT 730, ATI Radeon HD 7570</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">하데스 2</span> : 최상으로 144 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 64-bit
    프로세서: Dual Core 2.4 GHz
    메모리: 8 GB RAM
    그래픽: GeForce GTX 950, Radeon R7 360, or Intel HD Graphics 630
    저장공간: 10 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>64비트 프로세서와 운영 체제가 필요합니다
    운영 체제: Windows 10 64-bit
    프로세서: Dual Core 2.4 GHz
    메모리: 8 GB RAM
    그래픽: GeForce GTX 950, Radeon R7 360, or Intel HD Graphics 630
    저장공간: 10 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>최상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">할로우 나이트</span> : 상으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS - Windows 7 (64bit)
    CPU - Intel Core 2 Duo E5200
    램 - 4GB RAM
    하드 - 9GB 사용 가능 공간
    그래픽 - GeForce 9800GTX+ (1GB)
    </pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS - Windows 7 (64bit)
    CPU - Intel Core 2 Duo E5200
    램 - 4GB RAM
    하드 - 9GB 사용 가능 공간
    그래픽 - GeForce 9800GTX+ (1GB)
    </pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하 &#60; 중 &#60; 상</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">헬다이버즈2</span> : 중옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>최소:
    64비트 프로세서와 운영 체제가 필요합니다
    운영체제: Windows 10
    프로세서: Intel Core i7-4790K or AMD Ryzen 5 1500X
    메모리: 8 GB RAM
    그래픽: NVIDIA GeForce GTX 1050 Ti or AMD Radeon RX 470
    저장공간: 100 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>최소:
    64비트 프로세서와 운영 체제가 필요합니다
    운영체제: Windows 10
    프로세서: Intel Core i7-4790K or AMD Ryzen 5 1500X
    메모리: 8 GB RAM
    그래픽: NVIDIA GeForce GTX 1050 Ti or AMD Radeon RX 470
    저장공간: 100 GB 사용 가능 공간</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                    <li>
                                - <span class="gname">호그와트 레거시</span> : 하옵으로 60 FPS 가능합니다.     						<div class="spec_layer">
                                    <div class="spec"><span>최소사양</span><pre>OS	Windows 10 64비트
    CPU	Intel Core i5-6600 (3.3 GHz) 또는 AMD Ryzen 5 1400 (3.2 GHz)
    RAM	16 GB
    GPU	NVIDIA GeForce GTX 960 4GB 또는 AMD Radeon RX 470 4GB
    DX 버전	DX 12
    저장공간	85 GB HDD
    참고	SSD (선호), HDD (지원), 720p / 30 fps, 저품질 설정</pre></div>
                                    <div class="spec"><span>권장사양</span><pre>OS	Windows 10 64비트
    CPU	Intel Core i5-6600 (3.3 GHz) 또는 AMD Ryzen 5 1400 (3.2 GHz)
    RAM	16 GB
    GPU	NVIDIA GeForce GTX 960 4GB 또는 AMD Radeon RX 470 4GB
    DX 버전	DX 12
    저장공간	85 GB HDD
    참고	SSD (선호), HDD (지원), 720p / 30 fps, 저품질 설정</pre></div>
                                    <div class="spec"><span>옵션단계</span><pre>하옵 &#60; 중옵 &#60; 최상옵</pre></div>
                                </div>
                            </li>
                                                </ul>
                        
                        <div class="detail_more on" data="113"><span>더보기 (총 113건)</span></div>
                    </div>
                            <div class="btm">
                                <div class="flex">
                        <span>위 내용을 표로 정리하면 다음과 같습니다.</span>
                        <div class="btn_wrap">
                            <span class="btn guide" onclick="guide_pop('resolution');">해상도란?</span>
                            <span class="btn guide" onclick="guide_pop('setting');">내 모니터 해상도 확인하는 법</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="game_list option hidden">
                <table class="game_option">
                    <tr>
                        <th>번호</th>
                        <th>게임</th>
                        <th>평균프레임</th>
                        <th>옵션단계</th>
                        <th>FHD해상도</th>
                        <th>QHD해상도</th>
                        <th>UHD해상도</th>
                    </tr>
                    <tr>
                            <td>1</td><td>APEX 레전드</td><td>144 FPS</td><td>하옵 &#60; 중옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>중옵까지 지원</td><td>하옵까지 지원</td>
                        </tr><tr>
                            <td>2</td><td>Dragon Ball Sparking Zero</td><td>60 FPS</td><td>최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>3</td><td>EA SPORTS FC™ 25</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>상옵까지 지원</td>
                        </tr><tr>
                            <td>4</td><td>FC 24 (피파 24)</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>중옵까지 지원</td>
                        </tr><tr>
                            <td>5</td><td>GTA5</td><td>144 FPS</td><td>중옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>6</td><td>Metaphor: ReFantazio</td><td>100 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵</td>
                            <td>상옵까지 지원</td><td>중옵까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>7</td><td>NBA 2K25</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>중옵까지 지원</td>
                        </tr><tr>
                            <td>8</td><td>P의 거짓</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 최상옵 &#60; 최상옵 + DLSS</td>
                            <td>최상옵 + DLSS까지 지원</td><td>최상옵 + DLSS까지 지원</td><td>중옵까지 지원</td>
                        </tr><tr>
                            <td>9</td><td>shape of dreams (셰이프 오브 드림즈)</td><td>60 FPS</td><td>하 &#60; 중 &#60; 상</td>
                            <td>상까지 지원</td><td>상까지 지원</td><td>하까지 지원</td>
                        </tr><tr>
                            <td>10</td><td>W.O.W(월드오브워크레프트)</td><td>144 FPS</td><td>중옵 &#60; 상옵</td>
                            <td>상옵까지 지원</td><td>중옵까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>11</td><td>갓 오브 워 라그나로크</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>중옵까지 지원</td>
                        </tr><tr>
                            <td>12</td><td>건담 브레이커 4 (GUNDAM BREAKER 4)</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>하옵까지 지원</td>
                        </tr><tr>
                            <td>13</td><td>건파이어 리본(Gunfire Reborn)</td><td>144 FPS</td><td>상옵</td>
                            <td>상옵까지 지원</td><td>상옵까지 지원</td><td>상옵까지 지원</td>
                        </tr><tr>
                            <td>14</td><td>검은 신화: 오공</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>중옵까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>15</td><td>검은사막</td><td>100 FPS</td><td>하옵 &#60; 중옵 &#60; 최상옵 &#60; 리마스터옵</td>
                            <td>리마스터옵까지 지원</td><td>최상옵까지 지원</td><td>중옵까지 지원</td>
                        </tr><tr>
                            <td>16</td><td>고스트 리콘: 브레이크 포인트</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>상옵까지 지원</td>
                        </tr><tr>
                            <td>17</td><td>고스트 오브 쓰시마</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>하옵까지 지원</td>
                        </tr><tr>
                            <td>18</td><td>그랑블루 판타지 리링크</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 최상옵</td>
                            <td>중옵까지 지원</td><td>하옵까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>19</td><td>나 혼자만 레벨업 : ARISE OVERDRIVE</td><td>60 FPS</td><td>하 &#60; 중 &#60; 상</td>
                            <td>상까지 지원</td><td>상까지 지원</td><td>중까지 지원</td>
                        </tr><tr>
                            <td>20</td><td>나 혼자만 레벨업:어라이즈</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>최상옵까지 지원</td>
                        </tr><tr>
                            <td>21</td><td>나라카: 블레이드포인트</td><td>60 FPS</td><td>하 &#60; 중 &#60; 상</td>
                            <td>상까지 지원</td><td>상까지 지원</td><td>하까지 지원</td>
                        </tr><tr>
                            <td>22</td><td>나인 솔즈 (Nine Sols)</td><td>144 FPS</td><td>최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>최상옵까지 지원</td>
                        </tr><tr>
                            <td>23</td><td>노 레스트 포 더 위키드</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>중옵까지 지원</td><td>하옵까지 지원</td>
                        </tr><tr>
                            <td>24</td><td>노 맨즈 스카이 (No Man‘s Sky)</td><td>100 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>25</td><td>다잉 라이트: 더 비스트</td><td>60 FPS</td><td>하 &#60; 중 &#60; 상</td>
                            <td>상까지 지원</td><td>상까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>26</td><td>다크 소울 3</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>최상옵까지 지원</td>
                        </tr><tr>
                            <td>27</td><td>더 파이널스</td><td>144 FPS</td><td>하옵 &#60; 중옵 &#60; 최상옵</td>
                            <td>중옵까지 지원</td><td>하옵까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>28</td><td>던전앤파이터</td><td>60 FPS</td><td>상옵</td>
                            <td>상옵까지 지원</td><td>상옵까지 지원</td><td>상옵까지 지원</td>
                        </tr><tr>
                            <td>29</td><td>데드 바이 데이라이트</td><td>120 FPS</td><td>하옵 &#60; 중옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>중옵까지 지원</td>
                        </tr><tr>
                            <td>30</td><td>데드 아일랜드 2</td><td>144 FPS</td><td>하옵 &#60; 중옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>중옵까지 지원</td><td>하옵까지 지원</td>
                        </tr><tr>
                            <td>31</td><td>데드록 (Deadlock)</td><td>60 FPS</td><td>최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>32</td><td>데몬 엑스 마키나: 타이타닉 사이온</td><td>60 FPS</td><td>하 &#60; 중 &#60; 상</td>
                            <td>상까지 지원</td><td>상까지 지원</td><td>하까지 지원</td>
                        </tr><tr>
                            <td>33</td><td>데스티니 가디언즈 2</td><td>144 FPS</td><td>하옵 &#60; 중옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>중옵까지 지원</td>
                        </tr><tr>
                            <td>34</td><td>데이브 더 다이브</td><td>144 FPS</td><td>최상</td>
                            <td>최상까지 지원</td><td>최상까지 지원</td><td>최상까지 지원</td>
                        </tr><tr>
                            <td>35</td><td>도타 2</td><td>144 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>최상옵까지 지원</td>
                        </tr><tr>
                            <td>36</td><td>듄: 어웨이크닝</td><td>60 FPS</td><td>하 &#60; 중 &#60; 상</td>
                            <td>상까지 지원</td><td>상까지 지원</td><td>하까지 지원</td>
                        </tr><tr>
                            <td>37</td><td>드래곤즈 도그마 2</td><td>30 FPS</td><td>하옵 &#60; 중옵 &#60; 최상옵</td>
                            <td>중옵까지 지원</td><td>하옵까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>38</td><td>디아블로2 레저렉션</td><td>100 FPS</td><td>중옵 &#60; 상옵</td>
                            <td>상옵까지 지원</td><td>상옵까지 지원</td><td>중옵까지 지원</td>
                        </tr><tr>
                            <td>39</td><td>디아블로4</td><td>144 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵 &#60; 풀옵(DLSS/FSR)</td>
                            <td>풀옵(DLSS/FSR)까지 지원</td><td>풀옵(DLSS/FSR)까지 지원</td><td>중옵까지 지원</td>
                        </tr><tr>
                            <td>40</td><td>디제이맥스 리스펙트 V</td><td>60 FPS</td><td>최상</td>
                            <td>최상까지 지원</td><td>최상까지 지원</td><td>최상까지 지원</td>
                        </tr><tr>
                            <td>41</td><td>딥 락 갤럭틱: 서바이벌</td><td>144 FPS</td><td>하옵 &#60; 중옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>중옵까지 지원</td>
                        </tr><tr>
                            <td>42</td><td>라스트 에포크</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>중옵까지 지원</td>
                        </tr><tr>
                            <td>43</td><td>락다운 프로토콜</td><td> FPS</td><td>상</td>
                            <td>상까지 지원</td><td>상까지 지원</td><td>상까지 지원</td>
                        </tr><tr>
                            <td>44</td><td>러스트</td><td> FPS</td><td>상</td>
                            <td>상까지 지원</td><td>상까지 지원</td><td>상까지 지원</td>
                        </tr><tr>
                            <td>45</td><td>레드 데드 리뎀션2</td><td>60 FPS</td><td>XBOX옵 &#60; 상옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>상옵까지 지원</td><td>XBOX옵까지 지원</td>
                        </tr><tr>
                            <td>46</td><td>레디 오어 낫</td><td>144 FPS</td><td>하옵 &#60; 중옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>중옵까지 지원</td><td>하옵까지 지원</td>
                        </tr><tr>
                            <td>47</td><td>레인보우식스 시즈</td><td> FPS</td><td>상</td>
                            <td>상까지 지원</td><td>상까지 지원</td><td>상까지 지원</td>
                        </tr><tr>
                            <td>48</td><td>레전드 오브 모탈(Legend of Mortal)</td><td>60 FPS</td><td>최상</td>
                            <td>최상까지 지원</td><td>최상까지 지원</td><td>최상까지 지원</td>
                        </tr><tr>
                            <td>49</td><td>로드나인</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵</td>
                            <td>상옵까지 지원</td><td>상옵까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>50</td><td>로블록스</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>중옵까지 지원</td>
                        </tr><tr>
                            <td>51</td><td>로스트아크</td><td>144 FPS</td><td>하옵 &#60; 중옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>중옵까지 지원</td>
                        </tr><tr>
                            <td>52</td><td>루마섬</td><td> FPS</td><td>상</td>
                            <td>상까지 지원</td><td>상까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>53</td><td>리그오브레전드</td><td>144 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>최상옵까지 지원</td>
                        </tr><tr>
                            <td>54</td><td>리스크 오브 레인 2 (Risk of Rain 2)</td><td>144 FPS</td><td>최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>55</td><td>리씰컴퍼니</td><td>60 FPS</td><td>최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>최상옵까지 지원</td>
                        </tr><tr>
                            <td>56</td><td>림버스 컴퍼니 (Limbus Company)</td><td>60 FPS</td><td>최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>최상옵까지 지원</td>
                        </tr><tr>
                            <td>57</td><td>림월드</td><td>60 FPS</td><td>최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>58</td><td>마비노기</td><td>144 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>최상옵까지 지원</td>
                        </tr><tr>
                            <td>59</td><td>마운트 앤 블레이드 2: 배너로드</td><td>144 FPS</td><td>하옵 &#60; 중옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>중옵까지 지원</td><td>하옵까지 지원</td>
                        </tr><tr>
                            <td>60</td><td>마인크래프트</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>중옵까지 지원</td><td>하옵까지 지원</td>
                        </tr><tr>
                            <td>61</td><td>매너 로드</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>최상옵까지 지원</td>
                        </tr><tr>
                            <td>62</td><td>메이플스토리</td><td>60 FPS</td><td>상옵</td>
                            <td>상옵까지 지원</td><td>상옵까지 지원</td><td>상옵까지 지원</td>
                        </tr><tr>
                            <td>63</td><td>명조: 워더링 웨이브</td><td>60 FPS</td><td>(최상옵)</td>
                            <td>(최상옵)까지 지원</td><td>(최상옵)까지 지원</td><td>(최상옵)까지 지원</td>
                        </tr><tr>
                            <td>64</td><td>몬스터 헌터 와일즈</td><td> FPS</td><td>상옵</td>
                            <td>상옵까지 지원</td><td>상옵까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>65</td><td>몬스터 헌터 월드</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>중옵까지 지원</td>
                        </tr><tr>
                            <td>66</td><td>바이오하자드 RE:4</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵</td>
                            <td>중옵까지 지원</td><td>하옵까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>67</td><td>발더스 게이트3</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵</td>
                            <td>상옵까지 지원</td><td>상옵까지 지원</td><td>중옵까지 지원</td>
                        </tr><tr>
                            <td>68</td><td>발로란트</td><td>144 FPS</td><td>하옵 &#60; 중옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>최상옵까지 지원</td>
                        </tr><tr>
                            <td>69</td><td>배틀그라운드</td><td>144 FPS</td><td>선수옵 &#60; 국옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>70</td><td>백 4 블러드</td><td>144 FPS</td><td>하옵 &#60; 중옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>중옵까지 지원</td>
                        </tr><tr>
                            <td>71</td><td>벨라이트</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 최상옵</td>
                            <td>중옵까지 지원</td><td>하옵까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>72</td><td>붉은사막</td><td>60 FPS</td><td>하 &#60; 중 &#60; 상</td>
                            <td>상까지 지원</td><td>상까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>73</td><td>빈딕투스: 디파잉 페이트</td><td>60 FPS</td><td>하 &#60; 중 &#60; 상 &#60; 최상</td>
                            <td>최상까지 지원</td><td>상까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>74</td><td>사이버펑크 2077</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 최상옵 &#60; 최상옵+RT</td>
                            <td>최상옵까지 지원</td><td>중옵까지 지원</td><td>하옵까지 지원</td>
                        </tr><tr>
                            <td>75</td><td>사일런트 힐 2 (SILENT HILL 2)</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>상옵까지 지원</td><td>하옵까지 지원</td>
                        </tr><tr>
                            <td>76</td><td>새티스 팩토리(Satisfactory)</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>중옵까지 지원</td>
                        </tr><tr>
                            <td>77</td><td>샌드랜드</td><td>144 FPS</td><td>하옵 &#60; 중옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>중옵까지 지원</td>
                        </tr><tr>
                            <td>78</td><td>서든어택</td><td>75 FPS</td><td>상옵</td>
                            <td>상옵까지 지원</td><td>상옵까지 지원</td><td>상옵까지 지원</td>
                        </tr><tr>
                            <td>79</td><td>선즈 오브 더포레스트</td><td> FPS</td><td>상</td>
                            <td>상까지 지원</td><td>상까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>80</td><td>소울워커</td><td>60 FPS</td><td>최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>최상옵까지 지원</td>
                        </tr><tr>
                            <td>81</td><td>쉐이프즈 2 (shapez 2)</td><td>60 FPS</td><td>최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>최상옵까지 지원</td>
                        </tr><tr>
                            <td>82</td><td>스타크래프트</td><td>60 FPS</td><td>상옵</td>
                            <td>상옵까지 지원</td><td>상옵까지 지원</td><td>상옵까지 지원</td>
                        </tr><tr>
                            <td>83</td><td>스텔라 블레이드</td><td>60 FPS</td><td>하 &#60; 중 &#60; 상</td>
                            <td>상까지 지원</td><td>상까지 지원</td><td>중까지 지원</td>
                        </tr><tr>
                            <td>84</td><td>스트리노바</td><td> FPS</td><td>상</td>
                            <td>상까지 지원</td><td>상까지 지원</td><td>상까지 지원</td>
                        </tr><tr>
                            <td>85</td><td>스플릿 픽션</td><td>60 FPS</td><td>하 &#60; 중 &#60; 상</td>
                            <td>상까지 지원</td><td>중까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>86</td><td>심즈4</td><td>144 FPS</td><td>최상</td>
                            <td>최상까지 지원</td><td>최상까지 지원</td><td>최상까지 지원</td>
                        </tr><tr>
                            <td>87</td><td>쓰론 앤 리버티 (TL)</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>중옵까지 지원</td><td>하옵까지 지원</td>
                        </tr><tr>
                            <td>88</td><td>아레나 브레이크아웃: 인피니티</td><td>100 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>상옵까지 지원</td><td>하옵까지 지원</td>
                        </tr><tr>
                            <td>89</td><td>아머드 코어 6 루비콘의 화염</td><td>60 FPS</td><td>하 &#60; 중 &#60; 상</td>
                            <td>상까지 지원</td><td>상까지 지원</td><td>하까지 지원</td>
                        </tr><tr>
                            <td>90</td><td>아스달 연대기 세 개의 세력</td><td>60 FPS</td><td>최상옵</td>
                            <td>최상옵까지 지원</td><td>미지원</td><td>미지원</td>
                        </tr><tr>
                            <td>91</td><td>아이온</td><td>60 FPS</td><td>최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>92</td><td>아이온2</td><td>60 FPS</td><td>하 &#60; 중 &#60; 상</td>
                            <td>상까지 지원</td><td>상까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>93</td><td>아이작의 번제</td><td> FPS</td><td>상</td>
                            <td>상까지 지원</td><td>상까지 지원</td><td>상까지 지원</td>
                        </tr><tr>
                            <td>94</td><td>아크레이더스</td><td>60 FPS</td><td>하 &#60; 중 &#60; 상</td>
                            <td>상까지 지원</td><td>상까지 지원</td><td>하까지 지원</td>
                        </tr><tr>
                            <td>95</td><td>아크서바이벌 어센디드</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>중옵까지 지원</td><td>하옵까지 지원</td>
                        </tr><tr>
                            <td>96</td><td>어바우드</td><td> FPS</td><td>하옵 &#60; 중옵 &#60; 상옵</td>
                            <td>상옵까지 지원</td><td>상옵까지 지원</td><td>상옵까지 지원</td>
                        </tr><tr>
                            <td>97</td><td>어쌔신 크리드 미라지</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>중옵까지 지원</td>
                        </tr><tr>
                            <td>98</td><td>어쌔신 크리드 섀도우스</td><td>60 FPS</td><td>하 &#60; 중 &#60; 상</td>
                            <td>상까지 지원</td><td>상까지 지원</td><td>하까지 지원</td>
                        </tr><tr>
                            <td>99</td><td>에이지 오브 미쏠로지 리톨드</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>중옵까지 지원</td>
                        </tr><tr>
                            <td>100</td><td>에일 ＆ 테일 태번 (Ale ＆ Tale Tavern)</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵</td>
                            <td>상옵까지 지원</td><td>상옵까지 지원</td><td>상옵까지 지원</td>
                        </tr><tr>
                            <td>101</td><td>엘든 링: 황금 나무의 그림자</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵</td>
                            <td>상옵까지 지원</td><td>상옵까지 지원</td><td>중옵까지 지원</td>
                        </tr><tr>
                            <td>102</td><td>엘든링</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵</td>
                            <td>상옵까지 지원</td><td>상옵까지 지원</td><td>중옵까지 지원</td>
                        </tr><tr>
                            <td>103</td><td>오버워치2</td><td>144 FPS</td><td>하옵 &#60; PC방옵 &#60; 상옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>상옵까지 지원</td>
                        </tr><tr>
                            <td>104</td><td>용과 같이 8</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵</td>
                            <td>상옵까지 지원</td><td>중옵까지 지원</td><td>하옵까지 지원</td>
                        </tr><tr>
                            <td>105</td><td>워썬더 (WAR THUNDER)</td><td> FPS</td><td>상</td>
                            <td>상까지 지원</td><td>상까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>106</td><td>워테일즈(Wartales)</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>중옵까지 지원</td>
                        </tr><tr>
                            <td>107</td><td>워프레임</td><td>144 FPS</td><td>하옵 &#60; 중옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>중옵까지 지원</td><td>하옵까지 지원</td>
                        </tr><tr>
                            <td>108</td><td>워해머 40k 스페이스 마린 2</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>중옵까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>109</td><td>원스 휴먼(Once Human)</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>중옵까지 지원</td>
                        </tr><tr>
                            <td>110</td><td>원신</td><td>60 FPS</td><td>최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>최상옵까지 지원</td>
                        </tr><tr>
                            <td>111</td><td>월드오브탱크</td><td> FPS</td><td>상</td>
                            <td>상까지 지원</td><td>상까지 지원</td><td>상까지 지원</td>
                        </tr><tr>
                            <td>112</td><td>이스케이프 프롬 타르코프</td><td>100 FPS</td><td>하옵 &#60; 중옵 &#60; 최상옵</td>
                            <td>중옵까지 지원</td><td>하옵까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>113</td><td>이터널리턴</td><td>60 FPS</td><td>중옵 &#60; 상옵</td>
                            <td>상옵까지 지원</td><td>상옵까지 지원</td><td>중옵까지 지원</td>
                        </tr><tr>
                            <td>114</td><td>인슈라오디드</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵</td>
                            <td>상옵까지 지원</td><td>중옵까지 지원</td><td>하옵까지 지원</td>
                        </tr><tr>
                            <td>115</td><td>인조이</td><td> FPS</td><td>하 &#60; 중 &#60; 상</td>
                            <td>상까지 지원</td><td>중까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>116</td><td>인펙션 프리 존</td><td>60 FPS</td><td>최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>117</td><td>잇 테익스 투 (It Takes Two)</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>상옵까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>118</td><td>작혼: 리치 마작</td><td>60 FPS</td><td>최상</td>
                            <td>최상까지 지원</td><td>최상까지 지원</td><td>최상까지 지원</td>
                        </tr><tr>
                            <td>119</td><td>진삼국무쌍 ORIGINS</td><td>60 FPS</td><td>하 &#60; 중 &#60; 상</td>
                            <td>상까지 지원</td><td>상까지 지원</td><td>중까지 지원</td>
                        </tr><tr>
                            <td>120</td><td>철권 7</td><td>60 FPS</td><td>최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>121</td><td>철권 8</td><td>60 FPS</td><td>최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>122</td><td>카타클리스모(Cataclismo)</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵</td>
                            <td>상옵까지 지원</td><td>상옵까지 지원</td><td>상옵까지 지원</td>
                        </tr><tr>
                            <td>123</td><td>카트라이더 : 드리프트</td><td>144 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵</td>
                            <td>상옵까지 지원</td><td>상옵까지 지원</td><td>중옵까지 지원</td>
                        </tr><tr>
                            <td>124</td><td>컨커러스 블레이드</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>하옵까지 지원</td>
                        </tr><tr>
                            <td>125</td><td>컬트 오브 더 램 (Cult of the Lamb)</td><td>60 FPS</td><td>최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>최상옵까지 지원</td>
                        </tr><tr>
                            <td>126</td><td>코어 키퍼(Core Keeper)</td><td>60 FPS</td><td>최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>최상옵까지 지원</td>
                        </tr><tr>
                            <td>127</td><td>콜 오브 듀티 : 모던 워페어 II 2022</td><td>144 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵</td>
                            <td>중옵까지 지원</td><td>하옵까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>128</td><td>콜 오브 듀티 블랙옵스6</td><td> FPS</td><td>하옵 &#60; 중옵 &#60; 상옵</td>
                            <td>상옵까지 지원</td><td>중옵까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>129</td><td>크라임 씬 클리너(Crime Scene Cleaner)</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>중옵까지 지원</td>
                        </tr><tr>
                            <td>130</td><td>크루세이더 킹즈 3</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>최상옵까지 지원</td>
                        </tr><tr>
                            <td>131</td><td>클레르 옵스퀴르 : 33 원정대</td><td>60 FPS</td><td>하 &#60; 중 &#60; 상</td>
                            <td>상까지 지원</td><td>상까지 지원</td><td>하까지 지원</td>
                        </tr><tr>
                            <td>132</td><td>클로저스</td><td> FPS</td><td>상</td>
                            <td>상까지 지원</td><td>상까지 지원</td><td>상까지 지원</td>
                        </tr><tr>
                            <td>133</td><td>킹덤 컴 : 딜리버런스 2</td><td>60 FPS</td><td>하 &#60; 중 &#60; 상</td>
                            <td>상까지 지원</td><td>하까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>134</td><td>킹덤 컴: 딜리버런스</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵</td>
                            <td>상옵까지 지원</td><td>상옵까지 지원</td><td>하옵까지 지원</td>
                        </tr><tr>
                            <td>135</td><td>타이니 글레이드 (Tiny Glade)</td><td>60 FPS</td><td>최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>최상옵까지 지원</td>
                        </tr><tr>
                            <td>136</td><td>태양 제국의 죄악 II</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>상옵까지 지원</td>
                        </tr><tr>
                            <td>137</td><td>토탈워 워해머3</td><td>120 FPS</td><td>(하옵 &#60; 중옵 &#60; 최상)</td>
                            <td>(하옵까지 지원</td><td>미지원</td><td>미지원</td>
                        </tr><tr>
                            <td>138</td><td>트리 오브 세이비어</td><td>60 FPS</td><td>최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>최상옵까지 지원</td>
                        </tr><tr>
                            <td>139</td><td>파이널 판타지 16</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>상옵까지 지원</td><td>하옵까지 지원</td>
                        </tr><tr>
                            <td>140</td><td>파티 애니멀즈 (Party Animals)</td><td>60 FPS</td><td>최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>최상옵까지 지원</td>
                        </tr><tr>
                            <td>141</td><td>패스 오브 엑자일 2 (Path of Exile 2)</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>상옵까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>142</td><td>패스 오브 엑자일(P.O.E)</td><td>60 FPS</td><td>하옵 &#60; 권장옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>권장옵까지 지원</td>
                        </tr><tr>
                            <td>143</td><td>팰월드(Palworld) / 팔월드</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>중옵까지 지원</td><td>하옵까지 지원</td>
                        </tr><tr>
                            <td>144</td><td>퍼스트 디센던트</td><td>100 FPS</td><td>울트라 &#60; 울트라RT</td>
                            <td>울트라RT까지 지원</td><td>미지원</td><td>미지원</td>
                        </tr><tr>
                            <td>145</td><td>퍼스트 버서커: 카잔</td><td>60 FPS</td><td>하 &#60; 중 &#60; 상</td>
                            <td>상까지 지원</td><td>중까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>146</td><td>페르소나 3 리로드</td><td>60 FPS</td><td>최상 &#60; 최상(RT)</td>
                            <td>최상(RT)까지 지원</td><td>최상까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>147</td><td>페르소나5 더 로열</td><td>100 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵</td>
                            <td>상옵까지 지원</td><td>상옵까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>148</td><td>포르자 호라이즌5</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>중옵까지 지원</td>
                        </tr><tr>
                            <td>149</td><td>풋볼매니저 2024</td><td>60 FPS</td><td>최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>최상옵까지 지원</td>
                        </tr><tr>
                            <td>150</td><td>프로스트펑크 2 (Frostpunk 2)</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 상옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>상옵까지 지원</td><td>하옵까지 지원</td>
                        </tr><tr>
                            <td>151</td><td>프로젝트 좀보이드 (Project Zomboid)</td><td>60 FPS</td><td>최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>최상옵까지 지원</td>
                        </tr><tr>
                            <td>152</td><td>플래닛 주</td><td>60 FPS</td><td>최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>153</td><td>플래닛 코스터</td><td> FPS</td><td>상옵</td>
                            <td>상옵까지 지원</td><td>상옵까지 지원</td><td>미지원</td>
                        </tr><tr>
                            <td>154</td><td>피파온라인4</td><td>144 FPS</td><td>중옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>최상옵까지 지원</td>
                        </tr><tr>
                            <td>155</td><td>하데스 2</td><td>144 FPS</td><td>최상</td>
                            <td>최상까지 지원</td><td>최상까지 지원</td><td>최상까지 지원</td>
                        </tr><tr>
                            <td>156</td><td>할로우 나이트</td><td>60 FPS</td><td>하 &#60; 중 &#60; 상</td>
                            <td>상까지 지원</td><td>상까지 지원</td><td>상까지 지원</td>
                        </tr><tr>
                            <td>157</td><td>헬다이버즈2</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>최상옵까지 지원</td><td>중옵까지 지원</td>
                        </tr><tr>
                            <td>158</td><td>호그와트 레거시</td><td>60 FPS</td><td>하옵 &#60; 중옵 &#60; 최상옵</td>
                            <td>최상옵까지 지원</td><td>중옵까지 지원</td><td>하옵까지 지원</td>
                        </tr>    		</table>
                <div class="detail_more on" data="158"><span>더보기 (총 158건)</span></div>
            </div>
            
            
        </div>

                                            
                                
                                                                    <div class="box result">
                                        <h2 class="tit">PC견적QnA에서 해당 견적서로 추천드렸던 질문과 답변을 보여드립니다.</h2>
                                        
                                        <div class="list">
                                                                                    <div class="consult">
                                                <div class="data flex">
                                                    <span class="type">고민</span>
                                                    <div class="question"><span class="id">( <span>min***</span>님 )</span> 게임은 배그 위주로 하고 모니터는 fhd 180hz 정도 사용할 것 같습니다. 호환성 및 성능 괜찮을까요? 배그 렉 없이 플레이 하고 싶어서 783dx와 5060ti로 조합하였습니다. </div>
                                                </div>
                                                <div class="data flex">
                                                    <span class="type">답변</span>
                                                    <div class="question">
                                                        <p class="reasons">해당 견적서를 추천 드린 이유로는~</p>
                                                        메모리는 라이젠 용으로 나온 NEO 시리즈가 가격대가 좀 더 좋아서 변경하셔도 좋을 거 같고, 나머진 호환 문제 없어서 조립서비스 추가 후 이륙하셔도 무방합니다 ^^    											</div>
                                                </div>
                                            </div>
                                                                                </div>
                                                                        </div>
                                                                </div>
                            </div>
                        </div><!-- message -->
                    </div>											
                    <div class="btn_wrap reverse">    							
                                        </div>
                    
                                    
                </div><!-- pc_estimate_view -->
                
                
                
                <div class="pc_estimate_search_list basic">
                    <div class="contains">
                        <div class="title">아래는 지금까지 설명드렸던 견적서 조건에 일치하는, 컴퓨터를 판매하는 여러 업체들을 가격비교 한 것입니다.</div>
                        <div class="contents complete">
                            <div class="info">
                                <span class="num"><span>1</span>번</span>
                                <!-- <span class="txt">견적서</span> -->
                                <span class="writer">
                                    <span>지금까지 위에서 설명드린 견적서</span> 
                                </span>
                                <!-- 기존 사용 <span class="writer">
                                    <span>잉여인간17호</span> 님의 <span>&#34;7800X3D + RTX 5060 TI 16GB&#34;</span> 견적서
                                </span> -->
                                <!-- <span class="writer">
                                    (견적번호 : 16628번) &#34;<span>잉여인간17호</span>&#34;님이 작성하신 &#34;<span>7800X3D + RTX 5060 TI 16GB</span>&#34; 견적서
                                </span> -->
                            </div>
                                                    
                            <div class="product independ">
                                <div class="compos">
                                    <table class="compos_prd_table2">
                                        <thead><tr><th>부품</th><th>등급</th><th>세부 부품명</th></tr></thead>        							
                                        <tbody id="table2"></tbody>
                                    </table> 
                                </div>
                                
                                                            
                                                            
                                                            <!-- <div class="banner">
                                    <ul>
                                        <li><a href="#"><img src="/skin/shop/basic/images/common/pc_vb1.png" /></a></li>
                                        <li><a href="#"><img src="/skin/shop/basic/images/common/pc_vb2.png" /></a></li>
                                    </ul>
                                </div> -->
                                <!-- <div class="desc">
                                    <p>
                                        <span class="writer">
                                            견적번호 : <span>16628</span>번<br /> &#34;잉여인간17호&#34; 님의  &#34;7800X3D + RTX 5060 TI 16GB&#34; 견적서
                                        </span>
                                    </p>
                                </div> -->
                            </div>
                            
                            <div class="compat_result">
                                <p class="sub_title">위 &#34;1번 견적서&#34; 조건에 맞는, <span>업체별 가격비교 결과</span></p>
                                <ul class="desc" style="display: none;">
                                    <li>견적왕은 커뮤니티에서 활동하고 있는 전문가들의 <span>다양한 지식과 의견을, 견적서 형태로</span> 모아서 보여줍니다.</li>
                                    <li>견적서에 맞는 제품들을 <span>판매업체별로 가격비교</span>하고, 판매업체에 대한 조율과 관리 그리고 <span>책임도 함께 집니다.</span></li>
                                    <li><span class="verify">판매업체 검증 기준</span><span>중고부품 절대 사용 안 됨</span>, 제품에 대한 절대 책임의무 질 것(<span>하자에 대한 환불, AS 등</span>)</li>
                                </ul>
                                <div class="cont_nav">					
                                    <ul class="type">
                                        <li key="3" val="card" class="on card"><span>카드가</span><span>무이자 할부</span></li>
                                        <li key="3" val="cash" class="cash"><span>현금가</span><span>100% 영수증</span></li>
                                    </ul>        						
                                    <ul class="sort">
                                        <li key="3" val="rank" class="on">인기판매처순</li>
                                        <li key="3" val="low">낮은가격순</li>
                                        <li key="3" val="high">높은가격순</li>
                                    </ul>					
                                </div>        					
                                <ul class="product type1" id="table3"></ul>
                            </div>
                        </div>
                    </div><!-- contains -->
                </div><!-- pc_estimate_search_list -->
                            
                <div class="pc_estimate_search_list detail" id="table_4567">
                    <div class="contains">
                        <!-- <div class="title">여기서부터는 위 견적서에 나온 주요 부품으로, 견적왕에서 이미 구매되었던 고객님의 제품을 보여드립니다.</div> -->
                        <div class="contents complete" id="table_45">
                            <div class="info">
                                <span class="num"><span>2</span>번</span>
                                <span class="txt"><span id="part_table_4">CPU+그래픽카드+메인보드</span>는 1번 견적서와 같고, 나머지 부품은 호환성이 검증된 제품을 견적왕 시스템에서 조합한 것입니다.</span>
                            </div>
                            <div class="product independ">
                                <div class="compos">
                                    <table class="compos_prd_table2">
                                        <thead><tr><th>부품</th><th>등급</th><th>세부 부품명</th></tr></thead>        							
                                        <tbody id="table4"></tbody>
                                    </table>	
                                </div>
                            </div>
                            <div class="compat_result">
                                <p class="sub_title">위 "2번 견적서" 에 일치하는 완제품 검색 결과</span></p>
                                <div class="cont_nav">					
                                    <ul class=""><!-- type -->
                                        <li key="5" val="card" class="on card"><span>카드가</span><span>무이자 할부</span></li>
                                        <li key="5" val="cash" class="cash"><span>현금가</span><span>100% 영수증</span></li>
                                    </ul>
                                    <!-- <ul class="sort">
                                        <li key="5" val="rank" class="refresh" onclick='fn_ai_refresh(0)'>새로고침</li>
                                    </ul> -->					
                                </div>        					
                                <ul class="product type1" id="table5"></ul>
                            </div>
                        
                        </div>
                        <div class="contents complete" id="table_67">
                            <div class="info">
                                <span class="num"><span>3</span>번</span>
                                <span class="txt"><span id="part_table_6">CPU+그래픽카드</span>는 1번 견적서와 같고, 나머지 부품은 호환성이 검증된 제품을 견적왕 시스템에서 조합한 것입니다.</span>
                            </div>
                            <div class="product independ">
                                <div class="compos">
                                    <table class="compos_prd_table2"><!-- 공통class -->
                                        <thead><tr><th>부품</th><th>등급</th><th>세부 부품명</th></tr></thead>        							
                                        <tbody id="table6"></tbody>
                                    </table>	
                                </div>
                            </div>
                            <div class="compat_result">
                                <p class="sub_title">위 "3번 견적서" 에 일치하는 완제품 검색 결과</span></p>
                                <div class="cont_nav">					
                                    <ul class=""><!-- type -->
                                        <li key="7" val="card" class="on card"><span>카드가</span><span>무이자 할부</span></li>
                                        <li key="7" val="cash" class="cash"><span>현금가</span><span>100% 영수증</span></li>
                                    </ul>
                                    <!-- <ul class="sort">
                                        <li key="7" val="rank" class="refresh" onclick='fn_ai_refresh(1)'>새로고침</li>
                                    </ul> -->						
                                </div>
                                <ul class="product type1" id="table7"></ul>
                            </div>
                        
                        </div>
                    </div><!-- contains -->
                </div><!-- pc_estimate_search_list -->
                <input type="text" id="copyUrl" value="https://kjwwang.com/shop/pc_estimate.html?action=view&es_sn=16628" class="copy_input">
            </div>
        </div>
    </div>					


    <div id="shortsRemodal" class="remodal" data-remodal-id="shortsInfo" role="dialog" aria-labelledby="modal1Title" aria-describedby="modal1Desc">
        <div>
            <button data-remodal-action="cancel" class="cancel">닫기</button>
            <div id="modal1Cont" class="contents">
                <div class="media">
                    <div id="shortsLayerPopup"></div>
                </div>
                <p class="desc"></p>
                <p class="notice">(쇼츠 특성상 실제 플레이 영상과 다르게, 깨져 보일 수 있습니다.)</p>
            </div>
        </div>
    </div>

    <div id="productRemodal" class="remodal" data-remodal-id="productInfo" role="dialog" aria-labelledby="modal1Title" aria-describedby="modal1Desc">
        <div>
            <button data-remodal-action="cancel" class="cancel">닫기</button>
            <div id="modal1Title" class="title">상품 상세 보기</div>
            <div id="modal1Cont" class="contents">
                <!-- <div id="dbSimple" class="head flex">
                    <div class="thumb"></div>
                    <div class="info">
                        <p class="name"></p>
                        <p class="spec"></p>
                    </div>
                </div>
                <div id="dbDetail" class="body"></div> -->
            </div>
        </div>
    </div>		    				


    <div id="resolutionRemodal" class="remodal" data-remodal-id="resolutionInfo" role="dialog" aria-labelledby="modal1Title" aria-describedby="modal1Desc">
        <div>
            <!-- <button data-remodal-action="cancel" class="cancel">닫기</button> -->
            
            <div id="modal1Cont" class="modal_contents">
                <div class="resolution">
                    <ul>
                        <li>
                            <p class="title">해상도란 무엇인가요?</p>
                            <div class="contents">
                                <p class="desc">
                                    모니터는 수많은 점(픽셀)로 화면을 표현합니다.<br />
                                    해상도는 가로 방향의 픽셀 수 x 세로 방향의 픽셀 수 입니다. 
                                </p>
                                <img src="/skin/shop/basic/images/common/resolution1.png" alt="해상도 1920*1080" />
                                <p class="ex">ex) 1920 x 1080 = 가로 1920개의 픽셀, 세로 1080개의 픽셀 = 총 2,073,600개의 픽셀</p>
                            </div>
                        </li>
                        <li>
                            <p class="title">해상도가 높으면 어떤게 좋은가요?</p>
                            <div class="contents">
                                <p class="desc">
                                    해상도가 높을 수록 픽셀의 밀도가 올라갑니다.<br />
                                    밀도가 높을수록 더욱 세밀한 표현이 가능하여 화면의 선명도가 올라갑니다.   
                                </p>
                                <ul class="flex">
                                    <li>
                                        <img src="/skin/shop/basic/images/common/resolution2.png" alt="견적왕 150*95" />
                                        <span>150 X 95</span>
                                    </li>
                                    <li>
                                        <img src="/skin/shop/basic/images/common/resolution3.png" alt="견적왕 70*44" />
                                        <span>70 X 44</span>
                                    </li>
                                </ul>
                                
                            </div>
                        </li>
                        <li>
                            <p class="title">왜 해상도가 높아질수록<br />좋은 그래픽카드가 필요한 건가요?</p>
                            <div class="contents">
                                <p class="desc">
                                    해상도가 높아질수록 화면에 표현할 픽셀이 많아집니다.<br />
                                    표현할 픽셀이 많아질수록 그래픽카드가 할 일은 더욱 많아집니다.   
                                </p>
                                <img src="/skin/shop/basic/images/common/resolution4.png" alt="" />
                            </div>
                        </li>
                        
                    </ul>
                </div>
                <div class="setting">
                    <p class="title">내 모니터 해상도 확인하는 법</p>
                    <div class="contents">
                        <ul>
                            <li>
                                <p class="desc">1. 바탕화면에 우클릭 후 디스플레이 설정에 들어갑니다.</p>
                                <img src="/skin/shop/basic/images/common/setting1.png" alt="" />
                            </li>
                            <li>
                                <p class="desc">2.스크롤을 내려 [디스플레이 해상도] 에 설정되어 있는 해상도를 확인합니다.</p>
                                <img src="/skin/shop/basic/images/common/setting2.png" alt="" />
                                <div class="detail">
                                    <ul>
                                        <li>FHD : 1920 x 1080</li>
                                        <li>QHD : 2560 x 1440</li>
                                        <li>UHD : 3840 x 2140</li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                        
                    </div>
                
                </div>
            </div><!-- modal_contents -->
                
        </div>
    </div>
        <!-- S:FOOTER -->
        <div id="footer">
            <div class="contains">
                <div class="footer_top clear">
                    <ul>
                        <li><a href="/shop/kings_apply.html">회사소개</a></li>
                        <li><a href="/shop/customer.html?incurl=customer_07.php">이용약관</a></li>
                        <li><a href="/shop/customer.html?incurl=customer_08.php" class="privacy">개인정보처리방침</a></li>
                        <li><a href="/shop/customer.html?incurl=customer_01.php">고객센터</a></li>
                        <li><a href="/shop/customer.html?incurl=customer_09.php">판매처별 연락처</a></li>
                    </ul>
                </div>
                <div class="footer_bottom clear">
                    <div class="company_info">
                        <!-- <img src="/skin/shop/basic/customizing/logo.png" /> -->
                        <ul>
                            <li>
                                <span>상호</span> : 주식회사 견적왕 
                            </li>
                            <li>
                                <span>대표이사</span> : 민경준 
                                <span>주소</span> : 서울 용산구 새창로45길 30 4층 401호(사이버빌딩) <a href="http://www.ftc.go.kr/info/bizinfo/communicationViewPopup.jsp?wrkr_no=8448601757" class="confirm" target="_blank">사업자 정보확인</a>
                            </li>
                            <li>
                                <span>사업자등록번호</span> : 844-86-01757 
                                <span>통신판매업신고</span> : 제 2020-서울용산-2106 호 <a href="http://www.ftc.go.kr/bizCommPop.do?wrkr_no=8448601757" class="confirm" target="_blank">서비스가입사실 확인</a>							                                                                                   
                            </li>
                            <li>
                                <span>고객센터주문상담</span> :  070-4112-8899 
                                <span>FAX</span> : 02-3273-8898 
                                <span>EMAIL</span> : kjwangM@gmail.com						</li>
                            <li>
                                <span>분쟁조정기관표시</span> : 전자거래분쟁중재위원회 
                                <span>개인정보관리 책임자</span> : 민경준						</li>
                            <li>
                                <span>호스팅 제공자</span> : (주)코리아서버호스팅						</li>
                        </ul>
                        <span class="copyright">Copyright 2020 &copy; 주식회사 견적왕 ALL Rights Reserved.</span>
                    </div>
                    <div class="contact">
                        <dl>
                            <dt>판매처 문의</dt>
                            <dd>
                                <p class="contact_sales"><span>재고확인, 배송, 주문취소, 반품은</span> 판매처에 문의 부탁드립니다.</p>
                                <a href="/shop/customer.html?incurl=customer_09.php" target="_blank" class="shop_tel_btn">판매처별 전화번호 보기</a>				
                            </dd>
                            <dt>견적왕 문의</dt>
                            <dd>
                                <p class="contact_sales">견적왕 이용문의 및 불편사항</p>
                                <span class="tel">070-4112-8899</span>
                                <span class="time" style='text-align:left'>ㆍ문의시간 10:00 ~ 17:00 (토, 일, 공휴일 휴무)<br/>ㆍ점심시간 13:00 ~ 14:00<br/></span>
                            </dd>
                        </dl>
                    </div>
                    <div class="safety clear">
                        <ul>
                            <li class="txt">
                                <span>현금결제시 고객님의 안전거래를 위해 가입한 구매안전 서비스를 이용하실 수 있습니다.</span>
                            </li>
                            <li><a href="https://www.allatpay.com/servlet/AllatBiz/svcinfo/si_escrow.jsp?menu_id=S0305&action_flag=SEARCH&search_no=biz_no&es_business_no=8448601757" target="_blank"><img src="/skin/shop/basic/images/common/safety.png" alt="" /></a></li>
                        </ul>
                    </div>				
                </div>
            </div>		
        </div>
        <!-- E:FOOTER -->
    </div>

    <!-- Enliple Tracker Start -->
    <script type="text/javascript">
    (function(a,g,e,n,t){a.enp=a.enp||function(){(a.enp.q=a.enp.q||[]).push(arguments)};n=g.createElement(e);n.async=!0;n.defer=!0;n.src="https://cdn.megadata.co.kr/dist/prod/enp_tracker_self_hosted.min.js";t=g.getElementsByTagName(e)[0];t.parentNode.insertBefore(n,t)})(window,document,"script");
    enp('create', 'common', 'scv1809', { device: 'W' });  // W:웹, M: 모바일, B: 반응형
    enp('send', 'common', 'scv1809');
    </script>
    <!-- Enliple Tracker End -->

    <script language="javascript" src="../js/wrest.js"></script>

    <!-- 새창 대신 사용하는 iframe -->
    <iframe width=0 height=0 name='hiddenframe' style='display:none;'></iframe>


    </body>
    </html>

        
            
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-S19YQGBHT5"></script>
        <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments)};
        gtag('js', new Date());
        gtag('config', 'G-S19YQGBHT5');
            </script>
            
        
        

    ```
    > 텍스트 전체복사
    ```
    이전다음
    165207718362602742.png
    견적왕 베스트 리뷰
    1 이쁘고 성능 좋은 화이트 본체 잘 업어 왔습니다~ *5
    2 대략 7년 만에 구매한 컴퓨터 *5
    3 pc 너무 잘 쓰고 있습니다. *5
    4 8년만에 구매한 컴퓨터 *5
    5 취업 후 첫 컴퓨터 구매 후기 *5
    6 5년만에 바꾼 컴퓨터 후기 *5
    7 감사합니다. 받아서 잘 쓰고 있어요 ~ *5
    8 쾌적하게 잘 돌아갑니다 *5
    9 좋아요 감사합니다 *5
    10 전역을 앞두고 질렀습니다.. *5
    11 굿 *5
    12 너무 맘에 들어 버렸습니다 *5
    13 잘 받았습니다~ *5
    14 5080 달아서 사용하니 아이온2 풀옵션 잘 되네요 감사합니다. *5
    15 와 이런거 잘 안 쓰는데 굿입니다 *5
    견적왕 본체 갤러리
    1
    라이젠7 9800X3D 컴퓨터 PC견적 갤러리 견적왕.com플레이몰
    2
    건담 브레이커 4 (GUNDAM BREAKER 4) 코어 울트라5 시리즈2 245K + nVIDIA RTX 5060 컴퓨터 PC견적 갤러리 견적왕.com플레이몰
    3
    데드록 (Deadlock) 코어 울트라7 시리즈2 265KF + nVIDIA RTX 5060 Ti 컴퓨터 PC견적 갤러리 견적왕.com플레이몰
    조립 PC 시장 트렌드
    2026년 5월 컴퓨터 시장 트랜드
    2026년 6월 추천 PC 견적
    AI 서버 견적 상담
    1 AI 추론 및 학습용 데스크탑
    2 AI 자동화 개발용 워크스테이션 견적 요청 (RAM 우선)
    3 AI 연구/개발용
    4 master cam 사용 용도의 컴퓨터 견적 부탁드립니다.
    5 [6대 견적]Ram 128G 데스크탑 문의
    노트북견적상담
    tip 노트북 구매가이드 (2026년 06월)
    1 공대 노트북
    2 공대 2학년 노트북 추천 해주세요.
    3 노트북 구매 처음인데 추천 부탁드립니다!!!
    4 음악작업용 노트북 추천 부탁드립니다!
    5 프리미어 프로, 캡컷, 게이밍 용도로 사용할 노트북
    게임별 사양 및 추천 컴퓨터 견적
    1 APEX 레전드
    2 Dragon Ball Sparking Zero
    3 EA SPORTS FC™ 25
    4 FC 24 (피파 24)
    5 GTA5
    6 Metaphor: ReFantazio
    7 NBA 2K25
    8 P의 거짓
    9 shape of dreams (셰이프 오브 드림즈)
    10 W.O.W(월드오브워크레프트)
    11 갓 오브 워 라그나로크
    12 건담 브레이커 4 (GUNDAM BREAKER 4)
    13 건파이어 리본(Gunfire Reborn)
    14 검은 신화: 오공
    15 검은사막
    16 고스트 리콘: 브레이크 포인트
    17 고스트 오브 쓰시마
    18 그랑블루 판타지 리링크
    19 나 혼자만 레벨업 : ARISE OVERDRIVE
    20 나 혼자만 레벨업:어라이즈
    21 나라카: 블레이드포인트
    22 나인 솔즈 (Nine Sols)
    23 노 레스트 포 더 위키드
    24 노 맨즈 스카이 (No Man‘s Sky)
    25 다잉 라이트: 더 비스트
    26 다크 소울 3
    27 더 파이널스
    28 던전앤파이터
    29 데드 바이 데이라이트
    30 데드 아일랜드 2
    31 데드록 (Deadlock)
    32 데몬 엑스 마키나: 타이타닉 사이온
    33 데스티니 가디언즈 2
    34 데이브 더 다이브
    35 도타 2
    36 듄: 어웨이크닝
    37 드래곤즈 도그마 2
    38 디아블로2 레저렉션
    39 디아블로4
    40 디제이맥스 리스펙트 V
    41 딥 락 갤럭틱: 서바이벌
    42 라스트 에포크
    43 락다운 프로토콜
    44 러스트
    45 레드 데드 리뎀션2
    46 레디 오어 낫
    47 레인보우식스 시즈
    48 레전드 오브 모탈(Legend of Mortal)
    49 로드나인
    50 로블록스
    51 로스트아크
    52 루마섬
    53 리그오브레전드
    54 리스크 오브 레인 2 (Risk of Rain 2)
    55 리씰컴퍼니
    56 림버스 컴퍼니 (Limbus Company)
    57 림월드
    58 마비노기
    59 마운트 앤 블레이드 2: 배너로드
    60 마인크래프트
    61 매너 로드
    62 메이플스토리
    63 명조: 워더링 웨이브
    64 몬스터 헌터 와일즈
    65 몬스터 헌터 월드
    66 바이오하자드 RE:4
    67 발더스 게이트3
    68 발로란트
    69 배틀그라운드
    70 백 4 블러드
    71 벨라이트
    72 붉은사막
    73 빈딕투스: 디파잉 페이트
    74 사이버펑크 2077
    75 사일런트 힐 2 (SILENT HILL 2)
    76 새티스 팩토리(Satisfactory)
    77 샌드랜드
    78 서든어택
    79 선즈 오브 더포레스트
    80 소울워커
    81 쉐이프즈 2 (shapez 2)
    82 스타크래프트
    83 스텔라 블레이드
    84 스트리노바
    85 스플릿 픽션
    86 심즈4
    87 쓰론 앤 리버티 (TL)
    88 아레나 브레이크아웃: 인피니티
    89 아머드 코어 6 루비콘의 화염
    90 아스달 연대기 세 개의 세력
    91 아이온
    92 아이온2
    93 아이작의 번제
    94 아크레이더스
    95 아크서바이벌 어센디드
    96 어바우드
    97 어쌔신 크리드 미라지
    98 어쌔신 크리드 섀도우스
    99 에이지 오브 미쏠로지 리톨드
    100 에일 ＆ 테일 태번 (Ale ＆ Tale Tavern)
    101 엘든 링: 황금 나무의 그림자
    102 엘든링
    103 오버워치2
    104 용과 같이 8
    105 워썬더 (WAR THUNDER)
    106 워테일즈(Wartales)
    107 워프레임
    108 워해머 40k 스페이스 마린 2
    109 원스 휴먼(Once Human)
    110 원신
    111 월드오브탱크
    112 이스케이프 프롬 타르코프
    113 이터널리턴
    114 인슈라오디드
    115 인조이
    116 인펙션 프리 존
    117 잇 테익스 투 (It Takes Two)
    118 작혼: 리치 마작
    119 진삼국무쌍 ORIGINS
    120 철권 7
    121 철권 8
    122 카타클리스모(Cataclismo)
    123 카트라이더 : 드리프트
    124 컨커러스 블레이드
    125 컬트 오브 더 램 (Cult of the Lamb)
    126 코어 키퍼(Core Keeper)
    127 콜 오브 듀티 : 모던 워페어 II 2022
    128 콜 오브 듀티 블랙옵스6
    129 크라임 씬 클리너(Crime Scene Cleaner)
    130 크루세이더 킹즈 3
    131 클레르 옵스퀴르 : 33 원정대
    132 클로저스
    133 킹덤 컴 : 딜리버런스 2
    134 킹덤 컴: 딜리버런스
    135 타이니 글레이드 (Tiny Glade)
    136 태양 제국의 죄악 II
    137 토탈워 워해머3
    138 트리 오브 세이비어
    139 파이널 판타지 16
    140 파티 애니멀즈 (Party Animals)
    141 패스 오브 엑자일 2 (Path of Exile 2)
    142 패스 오브 엑자일(P.O.E)
    143 팰월드(Palworld) / 팔월드
    144 퍼스트 디센던트
    145 퍼스트 버서커: 카잔
    146 페르소나 3 리로드
    147 페르소나5 더 로열
    148 포르자 호라이즌5
    149 풋볼매니저 2024
    150 프로스트펑크 2 (Frostpunk 2)
    151 프로젝트 좀보이드 (Project Zomboid)
    152 플래닛 주
    153 플래닛 코스터
    154 피파온라인4
    155 하데스 2
    156 할로우 나이트
    157 헬다이버즈2
    158 호그와트 레거시
    견적왕 사이트 소개공지
    제품 수령 후, 원활한 이용을 위한 가이드
    카드 무이자 할부안내
    AI 서버 견적 상담 서비스 오픈!
    로그인회원가입주문ㆍ배송조회
        
    상품검색 
    
    견적서 번호검색 
    1481
    
    N2026년 5월 컴퓨터 시장 트랜드
    2026년 6월 추천 PC 견적
    1779 구매후기
    25201 PC견적상담
    N131 서버,대량견적상담
    17532 역경매
    전체 카테고리
    컴퓨터 고수의
    견적서모음
    게임별견적서
    키워드별견적서
    내가 만드는
    PC견적
    PC견적QnA
    뭐살지 고민될때
    많이팔린PC&월간추천PC
    견적맨랭킹
    브랜드샵
    이벤트
    읽을거리
    역경매
    견적맨 견적서
    작성자
    잉여인간17호
    견적서번호
    16628번
    작성일 25-05-07
    잉여인간17호(작성자)의
    다른 견적서 보러가기

    7800X3D + RTX 5060 TI 16GB
    라이젠7 7800X3D + RTX 5060 Ti 조합

    구분	등급	세부 부품명
    CPU	라이젠7 7800X3D	AMD 라이젠7-5세대 7800X3D (라파엘) (멀티팩(정품))부품개별구매
    메인보드	B850 (AMD)	ASUS TUF Gaming B850M-PLUS WIFI STCOM부품개별구매
    메모리	16(GB) DDR5 x 2 개	ESSENCORE KLEVV DDR5-5600 CL46 NEO 파인인포 (16GB) x 2 개부품개별구매
    그래픽카드	nVIDIA RTX 5060 Ti	PALIT 지포스 RTX 5060 Ti Infinity 3 D7 16GB 이엠텍부품개별구매
    SSD	1(TB) M.2(NVMe)	솔리다임 P44 Pro M.2 NVMe 벌크 (1TB)부품개별구매
    케이스	미들타워	마이크로닉스 COOLMAX 스테디 블랙 (미들타워)부품개별구매
    파워	700(W) ATX	마이크로닉스 Classic II 풀체인지 700W 80PLUS BRONZE ATX3.1 (PCIE5.1)부품개별구매
    CPU쿨러	공랭 6(EA)	Thermalright Peerless Assassin 120 SE 서린부품개별구매
    조립	프리미업조립	[견적왕] 조립 서비스 + 1년 출장 A/S부품개별구매

    견적왕.com 잉여인간17호님이 작성하신 견적서 설명입니다.
    ※ 견적왕에는 견적맨들의 다양한 의견이 있으니 꼼꼼히 비교해보세요.
    (견적맨 설명 및 유의사항 보기)
    견적 요약 정리
    7800X3D + RTX 5060 TI 16GB
    # 7800X3D + RTX 5060 TI 16GB
    견적서 상세 설명
    퀘이사존, 다나와, 쿨엔에서 활동 중인  잉여인간17호입니다.

    다양한 필테 경력과 컴덕질을 경험삼아 도움 드리고자 합니다.

    어떠한 스폰도 받지 않는 유저 입장에서 직접 사용해보고 테스트한 견적 위주로 견적드리겠습니다.


    [CPU] AMD 라이젠7-5세대 7800X3D (라파엘) (멀티팩(정품)) 상세보기

    [메인보드] ASUS TUF Gaming B850M-PLUS WIFI STCOM 상세보기

    [메모리] ESSENCORE KLEVV DDR5-5600 CL46 NEO 파인인포 (16GB) x 2 개 상세보기

    [그래픽카드] PALIT 지포스 RTX 5060 Ti Infinity 3 D7 16GB 이엠텍 상세보기

    [SSD] 솔리다임 P44 Pro M.2 NVMe 벌크 (1TB) 상세보기

    [케이스] 마이크로닉스 COOLMAX 스테디 블랙 (미들타워) 상세보기

    [파워서플라이] 마이크로닉스 Classic II 풀체인지 700W 80PLUS BRONZE ATX3.1 (PCIE5.1) 상세보기

    [CPU쿨러] Thermalright Peerless Assassin 120 SE 서린 상세보기

    [조립PC관련] [견적왕] 조립 서비스 + 1년 출장 A/S 상세보기
    혹시 견적에 문제가 있나요? [견적왕에 알리기]
    CPU는 라이젠 7000번대 3D 모델 주인공인 7800X3D입니다. 순정 상태에서 13900KS를 넘어서는 뛰어난 게임 성능과 뛰어난 전성비가 장점입니다.
    메인보드는 1120A급 드라이버모스펫 구성의 전원부성능 / WIFI, 블루투스 지원 / 공식스펙 상 PCIe5.0 그래픽카드슬롯 적용 / M-ATX 사이즈 / 8레이어 구성 / Q-Release, Q-Antenna, M.2 Q-Latch 등 조립편의성까지 알찬 스펙의 제품인 TUF Gaming B850M-PLUS WIFI입니다.
    그래픽카드는 어떤 게임을 하느냐에 따라 RX 9060 XT 16GB보다 좀 더 뛰어나기도하고 뒤처지는 경우도 있는 RTX 5060 Ti 16GB입니다. VRAM 용량이 16GB이기때문에 8GB 제품 대비 VRAM 사용량이 많은 작업이나 게임에서 좀 더 유리합니다. PALIT RTX 50 시리즈 그래픽카드는 이엠텍에서 유통하고 있어 수입사 고객센터 A/S응대도 좋습니다.
    케이스는 그래픽카드 호환성 355mm로 가격대비 뛰어난 호환성과 TYPE-C 포트를 지원해 편의성도 좋습니다.
    파워서플라이는 마닉의 스테디 셀러 파워입니다.
    CPU쿨러는 대장급 공랭 중 뛰어난 정숙성과 성능을 겸비한 쿨러입니다.


    기본적인 성능으로는 엑셀+파워포인트+워드+한글 = 문서작업(가성비 위주), 인터넷+맞고+포커+바둑 (간단한 웹게임,가성비 위주), 인터넷 강의, 유튜브 저화질, 유튜브 고화질, 넷플릭스+디즈니플러스+애플tv+왓챠 등등 (컴퓨터에서 tv를 보자), 주식 차트보기 (급하지 않는 매매,가성비 위주), 주식 매매용 (단타에도 랙이 안생기는,성능 위주), 포토샵+2D캐드+사진편집+동영상편집(가성비 위주), 일반 방송 (성능을 크게 요구하지 않는 방송, 가성비 위주), 음악용pc (큐베이스,에이블톤) 등이 가능합니다.
    게임 성능으로는
    FHD 해상도 (1920 X 1080) 로 플레이할 경우
    - APEX 레전드 : 최상옵으로 144 FPS 가능합니다.
    - Dragon Ball Sparking Zero : 최상옵으로 60 FPS 가능합니다.
    - EA SPORTS FC™ 25 : 최상옵으로 60 FPS 가능합니다.
    - FC 24 (피파 24) : 최상옵으로 60 FPS 가능합니다.
    - GTA5 : 최상옵으로 144 FPS 가능합니다.
    - Metaphor: ReFantazio : 상옵으로 100 FPS 가능합니다.
    - NBA 2K25 : 최상옵으로 60 FPS 가능합니다.
    - P의 거짓 : 최상옵 + DLSS으로 60 FPS 가능합니다.
    - shape of dreams (셰이프 오브 드림즈) : 상으로 60 FPS 가능합니다.
    - W.O.W(월드오브워크레프트) : 상옵으로 144 FPS 가능합니다.
    - 갓 오브 워 라그나로크 : 최상옵으로 60 FPS 가능합니다.
    - 건담 브레이커 4 (GUNDAM BREAKER 4) : 최상옵으로 60 FPS 가능합니다.
    - 건파이어 리본(Gunfire Reborn) : 상옵으로 144 FPS 가능합니다.
    - 검은 신화: 오공 : 최상옵으로 60 FPS 가능합니다.
    - 검은사막 : 리마스터옵으로 100 FPS 가능합니다.
    - 고스트 리콘: 브레이크 포인트 : 최상옵으로 60 FPS 가능합니다.
    - 고스트 오브 쓰시마 : 최상옵으로 60 FPS 가능합니다.
    - 그랑블루 판타지 리링크 : 중옵으로 60 FPS 가능합니다.
    - 나 혼자만 레벨업 : ARISE OVERDRIVE : 상으로 60 FPS 가능합니다.
    - 나 혼자만 레벨업:어라이즈 : 최상옵으로 60 FPS 가능합니다.
    - 나라카: 블레이드포인트 : 상으로 60 FPS 가능합니다.
    - 나인 솔즈 (Nine Sols) : 최상옵으로 144 FPS 가능합니다.
    - 노 레스트 포 더 위키드 : 최상옵으로 60 FPS 가능합니다.
    - 노 맨즈 스카이 (No Man‘s Sky) : 최상옵으로 100 FPS 가능합니다.
    - 다잉 라이트: 더 비스트 : 상으로 60 FPS 가능합니다.
    - 다크 소울 3 : 최상옵으로 60 FPS 가능합니다.
    - 더 파이널스 : 중옵으로 144 FPS 가능합니다.
    - 던전앤파이터 : 상옵으로 60 FPS 가능합니다.
    - 데드 바이 데이라이트 : 최상옵으로 120 FPS 가능합니다.
    - 데드 아일랜드 2 : 최상옵으로 144 FPS 가능합니다.
    - 데드록 (Deadlock) : 최상옵으로 60 FPS 가능합니다.
    - 데몬 엑스 마키나: 타이타닉 사이온 : 상으로 60 FPS 가능합니다.
    - 데스티니 가디언즈 2 : 최상옵으로 144 FPS 가능합니다.
    - 데이브 더 다이브 : 최상으로 144 FPS 가능합니다.
    - 도타 2 : 최상옵으로 144 FPS 가능합니다.
    - 듄: 어웨이크닝 : 상으로 60 FPS 가능합니다.
    - 드래곤즈 도그마 2 : 중옵으로 30 FPS 가능합니다.
    - 디아블로2 레저렉션 : 상옵으로 100 FPS 가능합니다.
    - 디아블로4 : 풀옵(DLSS/FSR)으로 144 FPS 가능합니다.
    - 디제이맥스 리스펙트 V : 최상으로 60 FPS 가능합니다.
    - 딥 락 갤럭틱: 서바이벌 : 최상옵으로 144 FPS 가능합니다.
    - 라스트 에포크 : 최상옵으로 60 FPS 가능합니다.
    - 락다운 프로토콜 : 상으로 FPS 가능합니다.
    - 러스트 : 상으로 FPS 가능합니다.
    - 레드 데드 리뎀션2 : 최상옵으로 60 FPS 가능합니다.
    - 레디 오어 낫 : 최상옵으로 144 FPS 가능합니다.
    - 레인보우식스 시즈 : 상으로 FPS 가능합니다.
    - 레전드 오브 모탈(Legend of Mortal) : 최상으로 60 FPS 가능합니다.
    - 로드나인 : 상옵으로 60 FPS 가능합니다.
    - 로블록스 : 최상옵으로 60 FPS 가능합니다.
    - 로스트아크 : 최상옵으로 144 FPS 가능합니다.
    - 루마섬 : 상으로 FPS 가능합니다.
    - 리그오브레전드 : 최상옵으로 144 FPS 가능합니다.
    - 리스크 오브 레인 2 (Risk of Rain 2) : 최상옵으로 144 FPS 가능합니다.
    - 리씰컴퍼니 : 최상옵으로 60 FPS 가능합니다.
    - 림버스 컴퍼니 (Limbus Company) : 최상옵으로 60 FPS 가능합니다.
    - 림월드 : 최상옵으로 60 FPS 가능합니다.
    - 마비노기 : 최상옵으로 144 FPS 가능합니다.
    - 마운트 앤 블레이드 2: 배너로드 : 최상옵으로 144 FPS 가능합니다.
    - 마인크래프트 : 최상옵으로 60 FPS 가능합니다.
    - 매너 로드 : 최상옵으로 60 FPS 가능합니다.
    - 메이플스토리 : 상옵으로 60 FPS 가능합니다.
    - 명조: 워더링 웨이브 : (최상옵)으로 60 FPS 가능합니다.
    - 몬스터 헌터 와일즈 : 상옵으로 FPS 가능합니다.
    - 몬스터 헌터 월드 : 최상옵으로 60 FPS 가능합니다.
    - 바이오하자드 RE:4 : 중옵으로 60 FPS 가능합니다.
    - 발더스 게이트3 : 상옵으로 60 FPS 가능합니다.
    - 발로란트 : 최상옵으로 144 FPS 가능합니다.
    - 배틀그라운드 : 최상옵으로 144 FPS 가능합니다.
    - 백 4 블러드 : 최상옵으로 144 FPS 가능합니다.
    - 벨라이트 : 중옵으로 60 FPS 가능합니다.
    - 붉은사막 : 상으로 60 FPS 가능합니다.
    - 빈딕투스: 디파잉 페이트 : 최상으로 60 FPS 가능합니다.
    - 사이버펑크 2077 : 최상옵으로 60 FPS 가능합니다.
    - 사일런트 힐 2 (SILENT HILL 2) : 최상옵으로 60 FPS 가능합니다.
    - 새티스 팩토리(Satisfactory) : 최상옵으로 60 FPS 가능합니다.
    - 샌드랜드 : 최상옵으로 144 FPS 가능합니다.
    - 서든어택 : 상옵으로 75 FPS 가능합니다.
    - 선즈 오브 더포레스트 : 상으로 FPS 가능합니다.
    - 소울워커 : 최상옵으로 60 FPS 가능합니다.
    - 쉐이프즈 2 (shapez 2) : 최상옵으로 60 FPS 가능합니다.
    - 스타크래프트 : 상옵으로 60 FPS 가능합니다.
    - 스텔라 블레이드 : 상으로 60 FPS 가능합니다.
    - 스트리노바 : 상으로 FPS 가능합니다.
    - 스플릿 픽션 : 상으로 60 FPS 가능합니다.
    - 심즈4 : 최상으로 144 FPS 가능합니다.
    - 쓰론 앤 리버티 (TL) : 최상옵으로 60 FPS 가능합니다.
    - 아레나 브레이크아웃: 인피니티 : 최상옵으로 100 FPS 가능합니다.
    - 아머드 코어 6 루비콘의 화염 : 상으로 60 FPS 가능합니다.
    - 아스달 연대기 세 개의 세력 : 최상옵으로 60 FPS 가능합니다.
    - 아이온 : 최상옵으로 60 FPS 가능합니다.
    - 아이온2 : 상으로 60 FPS 가능합니다.
    - 아이작의 번제 : 상으로 FPS 가능합니다.
    - 아크레이더스 : 상으로 60 FPS 가능합니다.
    - 아크서바이벌 어센디드 : 최상옵으로 60 FPS 가능합니다.
    - 어바우드 : 상옵으로 FPS 가능합니다.
    - 어쌔신 크리드 미라지 : 최상옵으로 60 FPS 가능합니다.
    - 어쌔신 크리드 섀도우스 : 상으로 60 FPS 가능합니다.
    - 에이지 오브 미쏠로지 리톨드 : 최상옵으로 60 FPS 가능합니다.
    - 에일 ＆ 테일 태번 (Ale ＆ Tale Tavern) : 상옵으로 60 FPS 가능합니다.
    - 엘든 링: 황금 나무의 그림자 : 상옵으로 60 FPS 가능합니다.
    - 엘든링 : 상옵으로 60 FPS 가능합니다.
    - 오버워치2 : 최상옵으로 144 FPS 가능합니다.
    - 용과 같이 8 : 상옵으로 60 FPS 가능합니다.
    - 워썬더 (WAR THUNDER) : 상으로 FPS 가능합니다.
    - 워테일즈(Wartales) : 최상옵으로 60 FPS 가능합니다.
    - 워프레임 : 최상옵으로 144 FPS 가능합니다.
    - 워해머 40k 스페이스 마린 2 : 최상옵으로 60 FPS 가능합니다.
    - 원스 휴먼(Once Human) : 최상옵으로 60 FPS 가능합니다.
    - 원신 : 최상옵으로 60 FPS 가능합니다.
    - 월드오브탱크 : 상으로 FPS 가능합니다.
    - 이스케이프 프롬 타르코프 : 중옵으로 100 FPS 가능합니다.
    - 이터널리턴 : 상옵으로 60 FPS 가능합니다.
    - 인슈라오디드 : 상옵으로 60 FPS 가능합니다.
    - 인조이 : 상으로 FPS 가능합니다.
    - 인펙션 프리 존 : 최상옵으로 60 FPS 가능합니다.
    - 잇 테익스 투 (It Takes Two) : 최상옵으로 60 FPS 가능합니다.
    - 작혼: 리치 마작 : 최상으로 60 FPS 가능합니다.
    - 진삼국무쌍 ORIGINS : 상으로 60 FPS 가능합니다.
    - 철권 7 : 최상옵으로 60 FPS 가능합니다.
    - 철권 8 : 최상옵으로 60 FPS 가능합니다.
    - 카타클리스모(Cataclismo) : 상옵으로 60 FPS 가능합니다.
    - 카트라이더 : 드리프트 : 상옵으로 144 FPS 가능합니다.
    - 컨커러스 블레이드 : 최상옵으로 60 FPS 가능합니다.
    - 컬트 오브 더 램 (Cult of the Lamb) : 최상옵으로 60 FPS 가능합니다.
    - 코어 키퍼(Core Keeper) : 최상옵으로 60 FPS 가능합니다.
    - 콜 오브 듀티 : 모던 워페어 II 2022 : 중옵으로 144 FPS 가능합니다.
    - 콜 오브 듀티 블랙옵스6 : 상옵으로 FPS 가능합니다.
    - 크라임 씬 클리너(Crime Scene Cleaner) : 최상옵으로 60 FPS 가능합니다.
    - 크루세이더 킹즈 3 : 최상옵으로 60 FPS 가능합니다.
    - 클레르 옵스퀴르 : 33 원정대 : 상으로 60 FPS 가능합니다.
    - 클로저스 : 상으로 FPS 가능합니다.
    - 킹덤 컴 : 딜리버런스 2 : 상으로 60 FPS 가능합니다.
    - 킹덤 컴: 딜리버런스 : 상옵으로 60 FPS 가능합니다.
    - 타이니 글레이드 (Tiny Glade) : 최상옵으로 60 FPS 가능합니다.
    - 태양 제국의 죄악 II : 최상옵으로 60 FPS 가능합니다.
    - 토탈워 워해머3 : (하옵으로 120 FPS 가능합니다.
    - 트리 오브 세이비어 : 최상옵으로 60 FPS 가능합니다.
    - 파이널 판타지 16 : 최상옵으로 60 FPS 가능합니다.
    - 파티 애니멀즈 (Party Animals) : 최상옵으로 60 FPS 가능합니다.
    - 패스 오브 엑자일 2 (Path of Exile 2) : 최상옵으로 60 FPS 가능합니다.
    - 패스 오브 엑자일(P.O.E) : 최상옵으로 60 FPS 가능합니다.
    - 팰월드(Palworld) / 팔월드 : 최상옵으로 60 FPS 가능합니다.
    - 퍼스트 디센던트 : 울트라RT으로 100 FPS 가능합니다.
    - 퍼스트 버서커: 카잔 : 상으로 60 FPS 가능합니다.
    - 페르소나 3 리로드 : 최상(RT)으로 60 FPS 가능합니다.
    - 페르소나5 더 로열 : 상옵으로 100 FPS 가능합니다.
    - 포르자 호라이즌5 : 최상옵으로 60 FPS 가능합니다.
    - 풋볼매니저 2024 : 최상옵으로 60 FPS 가능합니다.
    - 프로스트펑크 2 (Frostpunk 2) : 최상옵으로 60 FPS 가능합니다.
    - 프로젝트 좀보이드 (Project Zomboid) : 최상옵으로 60 FPS 가능합니다.
    - 플래닛 주 : 최상옵으로 60 FPS 가능합니다.
    - 플래닛 코스터 : 상옵으로 FPS 가능합니다.
    - 피파온라인4 : 최상옵으로 144 FPS 가능합니다.
    - 하데스 2 : 최상으로 144 FPS 가능합니다.
    - 할로우 나이트 : 상으로 60 FPS 가능합니다.
    - 헬다이버즈2 : 최상옵으로 60 FPS 가능합니다.
    - 호그와트 레거시 : 최상옵으로 60 FPS 가능합니다.
    접기
    QHD 해상도 (2560 X 1440) 로 플레이할 경우
    - APEX 레전드 : 중옵으로 144 FPS 가능합니다.
    - Dragon Ball Sparking Zero : 최상옵으로 60 FPS 가능합니다.
    - EA SPORTS FC™ 25 : 최상옵으로 60 FPS 가능합니다.
    - FC 24 (피파 24) : 최상옵으로 60 FPS 가능합니다.
    - GTA5 : 최상옵으로 144 FPS 가능합니다.
    - Metaphor: ReFantazio : 중옵으로 100 FPS 가능합니다.
    - NBA 2K25 : 최상옵으로 60 FPS 가능합니다.
    - P의 거짓 : 최상옵 + DLSS으로 60 FPS 가능합니다.
    - shape of dreams (셰이프 오브 드림즈) : 상으로 60 FPS 가능합니다.
    - W.O.W(월드오브워크레프트) : 중옵으로 144 FPS 가능합니다.
    - 갓 오브 워 라그나로크 : 최상옵으로 60 FPS 가능합니다.
    - 건담 브레이커 4 (GUNDAM BREAKER 4) : 최상옵으로 60 FPS 가능합니다.
    - 건파이어 리본(Gunfire Reborn) : 상옵으로 144 FPS 가능합니다.
    - 검은 신화: 오공 : 중옵으로 60 FPS 가능합니다.
    - 검은사막 : 최상옵으로 100 FPS 가능합니다.
    - 고스트 리콘: 브레이크 포인트 : 최상옵으로 60 FPS 가능합니다.
    - 고스트 오브 쓰시마 : 최상옵으로 60 FPS 가능합니다.
    - 그랑블루 판타지 리링크 : 하옵으로 60 FPS 가능합니다.
    - 나 혼자만 레벨업 : ARISE OVERDRIVE : 상으로 60 FPS 가능합니다.
    - 나 혼자만 레벨업:어라이즈 : 최상옵으로 60 FPS 가능합니다.
    - 나라카: 블레이드포인트 : 상으로 60 FPS 가능합니다.
    - 나인 솔즈 (Nine Sols) : 최상옵으로 144 FPS 가능합니다.
    - 노 레스트 포 더 위키드 : 중옵으로 60 FPS 가능합니다.
    - 노 맨즈 스카이 (No Man‘s Sky) : 최상옵으로 100 FPS 가능합니다.
    - 다잉 라이트: 더 비스트 : 상으로 60 FPS 가능합니다.
    - 다크 소울 3 : 최상옵으로 60 FPS 가능합니다.
    - 더 파이널스 : 하옵으로 144 FPS 가능합니다.
    - 던전앤파이터 : 상옵으로 60 FPS 가능합니다.
    - 데드 바이 데이라이트 : 최상옵으로 120 FPS 가능합니다.
    - 데드 아일랜드 2 : 중옵으로 144 FPS 가능합니다.
    - 데드록 (Deadlock) : 최상옵으로 60 FPS 가능합니다.
    - 데몬 엑스 마키나: 타이타닉 사이온 : 상으로 60 FPS 가능합니다.
    - 데스티니 가디언즈 2 : 최상옵으로 144 FPS 가능합니다.
    - 데이브 더 다이브 : 최상으로 144 FPS 가능합니다.
    - 도타 2 : 최상옵으로 144 FPS 가능합니다.
    - 듄: 어웨이크닝 : 상으로 60 FPS 가능합니다.
    - 드래곤즈 도그마 2 : 하옵으로 30 FPS 가능합니다.
    - 디아블로2 레저렉션 : 상옵으로 100 FPS 가능합니다.
    - 디아블로4 : 풀옵(DLSS/FSR)으로 144 FPS 가능합니다.
    - 디제이맥스 리스펙트 V : 최상으로 60 FPS 가능합니다.
    - 딥 락 갤럭틱: 서바이벌 : 최상옵으로 144 FPS 가능합니다.
    - 라스트 에포크 : 최상옵으로 60 FPS 가능합니다.
    - 락다운 프로토콜 : 상으로 FPS 가능합니다.
    - 러스트 : 상으로 FPS 가능합니다.
    - 레드 데드 리뎀션2 : 상옵으로 60 FPS 가능합니다.
    - 레디 오어 낫 : 중옵으로 144 FPS 가능합니다.
    - 레인보우식스 시즈 : 상으로 FPS 가능합니다.
    - 레전드 오브 모탈(Legend of Mortal) : 최상으로 60 FPS 가능합니다.
    - 로드나인 : 상옵으로 60 FPS 가능합니다.
    - 로블록스 : 최상옵으로 60 FPS 가능합니다.
    - 로스트아크 : 최상옵으로 144 FPS 가능합니다.
    - 루마섬 : 상으로 FPS 가능합니다.
    - 리그오브레전드 : 최상옵으로 144 FPS 가능합니다.
    - 리스크 오브 레인 2 (Risk of Rain 2) : 최상옵으로 144 FPS 가능합니다.
    - 리씰컴퍼니 : 최상옵으로 60 FPS 가능합니다.
    - 림버스 컴퍼니 (Limbus Company) : 최상옵으로 60 FPS 가능합니다.
    - 림월드 : 최상옵으로 60 FPS 가능합니다.
    - 마비노기 : 최상옵으로 144 FPS 가능합니다.
    - 마운트 앤 블레이드 2: 배너로드 : 중옵으로 144 FPS 가능합니다.
    - 마인크래프트 : 중옵으로 60 FPS 가능합니다.
    - 매너 로드 : 최상옵으로 60 FPS 가능합니다.
    - 메이플스토리 : 상옵으로 60 FPS 가능합니다.
    - 명조: 워더링 웨이브 : (최상옵)으로 60 FPS 가능합니다.
    - 몬스터 헌터 와일즈 : 상옵으로 FPS 가능합니다.
    - 몬스터 헌터 월드 : 최상옵으로 60 FPS 가능합니다.
    - 바이오하자드 RE:4 : 하옵으로 60 FPS 가능합니다.
    - 발더스 게이트3 : 상옵으로 60 FPS 가능합니다.
    - 발로란트 : 최상옵으로 144 FPS 가능합니다.
    - 배틀그라운드 : 최상옵으로 144 FPS 가능합니다.
    - 백 4 블러드 : 최상옵으로 144 FPS 가능합니다.
    - 벨라이트 : 하옵으로 60 FPS 가능합니다.
    - 붉은사막 : 상으로 60 FPS 가능합니다.
    - 빈딕투스: 디파잉 페이트 : 상으로 60 FPS 가능합니다.
    - 사이버펑크 2077 : 중옵으로 60 FPS 가능합니다.
    - 사일런트 힐 2 (SILENT HILL 2) : 상옵으로 60 FPS 가능합니다.
    - 새티스 팩토리(Satisfactory) : 최상옵으로 60 FPS 가능합니다.
    - 샌드랜드 : 최상옵으로 144 FPS 가능합니다.
    - 서든어택 : 상옵으로 75 FPS 가능합니다.
    - 선즈 오브 더포레스트 : 상으로 FPS 가능합니다.
    - 소울워커 : 최상옵으로 60 FPS 가능합니다.
    - 쉐이프즈 2 (shapez 2) : 최상옵으로 60 FPS 가능합니다.
    - 스타크래프트 : 상옵으로 60 FPS 가능합니다.
    - 스텔라 블레이드 : 상으로 60 FPS 가능합니다.
    - 스트리노바 : 상으로 FPS 가능합니다.
    - 스플릿 픽션 : 중으로 60 FPS 가능합니다.
    - 심즈4 : 최상으로 144 FPS 가능합니다.
    - 쓰론 앤 리버티 (TL) : 중옵으로 60 FPS 가능합니다.
    - 아레나 브레이크아웃: 인피니티 : 상옵으로 100 FPS 가능합니다.
    - 아머드 코어 6 루비콘의 화염 : 상으로 60 FPS 가능합니다.
    - 아이온 : 최상옵으로 60 FPS 가능합니다.
    - 아이온2 : 상으로 60 FPS 가능합니다.
    - 아이작의 번제 : 상으로 FPS 가능합니다.
    - 아크레이더스 : 상으로 60 FPS 가능합니다.
    - 아크서바이벌 어센디드 : 중옵으로 60 FPS 가능합니다.
    - 어바우드 : 상옵으로 FPS 가능합니다.
    - 어쌔신 크리드 미라지 : 최상옵으로 60 FPS 가능합니다.
    - 어쌔신 크리드 섀도우스 : 상으로 60 FPS 가능합니다.
    - 에이지 오브 미쏠로지 리톨드 : 최상옵으로 60 FPS 가능합니다.
    - 에일 ＆ 테일 태번 (Ale ＆ Tale Tavern) : 상옵으로 60 FPS 가능합니다.
    - 엘든 링: 황금 나무의 그림자 : 상옵으로 60 FPS 가능합니다.
    - 엘든링 : 상옵으로 60 FPS 가능합니다.
    - 오버워치2 : 최상옵으로 144 FPS 가능합니다.
    - 용과 같이 8 : 중옵으로 60 FPS 가능합니다.
    - 워썬더 (WAR THUNDER) : 상으로 FPS 가능합니다.
    - 워테일즈(Wartales) : 최상옵으로 60 FPS 가능합니다.
    - 워프레임 : 중옵으로 144 FPS 가능합니다.
    - 워해머 40k 스페이스 마린 2 : 중옵으로 60 FPS 가능합니다.
    - 원스 휴먼(Once Human) : 최상옵으로 60 FPS 가능합니다.
    - 원신 : 최상옵으로 60 FPS 가능합니다.
    - 월드오브탱크 : 상으로 FPS 가능합니다.
    - 이스케이프 프롬 타르코프 : 하옵으로 100 FPS 가능합니다.
    - 이터널리턴 : 상옵으로 60 FPS 가능합니다.
    - 인슈라오디드 : 중옵으로 60 FPS 가능합니다.
    - 인조이 : 중으로 FPS 가능합니다.
    - 인펙션 프리 존 : 최상옵으로 60 FPS 가능합니다.
    - 잇 테익스 투 (It Takes Two) : 상옵으로 60 FPS 가능합니다.
    - 작혼: 리치 마작 : 최상으로 60 FPS 가능합니다.
    - 진삼국무쌍 ORIGINS : 상으로 60 FPS 가능합니다.
    - 철권 7 : 최상옵으로 60 FPS 가능합니다.
    - 철권 8 : 최상옵으로 60 FPS 가능합니다.
    - 카타클리스모(Cataclismo) : 상옵으로 60 FPS 가능합니다.
    - 카트라이더 : 드리프트 : 상옵으로 144 FPS 가능합니다.
    - 컨커러스 블레이드 : 최상옵으로 60 FPS 가능합니다.
    - 컬트 오브 더 램 (Cult of the Lamb) : 최상옵으로 60 FPS 가능합니다.
    - 코어 키퍼(Core Keeper) : 최상옵으로 60 FPS 가능합니다.
    - 콜 오브 듀티 : 모던 워페어 II 2022 : 하옵으로 144 FPS 가능합니다.
    - 콜 오브 듀티 블랙옵스6 : 중옵으로 FPS 가능합니다.
    - 크라임 씬 클리너(Crime Scene Cleaner) : 최상옵으로 60 FPS 가능합니다.
    - 크루세이더 킹즈 3 : 최상옵으로 60 FPS 가능합니다.
    - 클레르 옵스퀴르 : 33 원정대 : 상으로 60 FPS 가능합니다.
    - 클로저스 : 상으로 FPS 가능합니다.
    - 킹덤 컴 : 딜리버런스 2 : 하으로 60 FPS 가능합니다.
    - 킹덤 컴: 딜리버런스 : 상옵으로 60 FPS 가능합니다.
    - 타이니 글레이드 (Tiny Glade) : 최상옵으로 60 FPS 가능합니다.
    - 태양 제국의 죄악 II : 최상옵으로 60 FPS 가능합니다.
    - 트리 오브 세이비어 : 최상옵으로 60 FPS 가능합니다.
    - 파이널 판타지 16 : 상옵으로 60 FPS 가능합니다.
    - 파티 애니멀즈 (Party Animals) : 최상옵으로 60 FPS 가능합니다.
    - 패스 오브 엑자일 2 (Path of Exile 2) : 상옵으로 60 FPS 가능합니다.
    - 패스 오브 엑자일(P.O.E) : 최상옵으로 60 FPS 가능합니다.
    - 팰월드(Palworld) / 팔월드 : 중옵으로 60 FPS 가능합니다.
    - 퍼스트 버서커: 카잔 : 중으로 60 FPS 가능합니다.
    - 페르소나 3 리로드 : 최상으로 60 FPS 가능합니다.
    - 페르소나5 더 로열 : 상옵으로 100 FPS 가능합니다.
    - 포르자 호라이즌5 : 최상옵으로 60 FPS 가능합니다.
    - 풋볼매니저 2024 : 최상옵으로 60 FPS 가능합니다.
    - 프로스트펑크 2 (Frostpunk 2) : 상옵으로 60 FPS 가능합니다.
    - 프로젝트 좀보이드 (Project Zomboid) : 최상옵으로 60 FPS 가능합니다.
    - 플래닛 주 : 최상옵으로 60 FPS 가능합니다.
    - 플래닛 코스터 : 상옵으로 FPS 가능합니다.
    - 피파온라인4 : 최상옵으로 144 FPS 가능합니다.
    - 하데스 2 : 최상으로 144 FPS 가능합니다.
    - 할로우 나이트 : 상으로 60 FPS 가능합니다.
    - 헬다이버즈2 : 최상옵으로 60 FPS 가능합니다.
    - 호그와트 레거시 : 중옵으로 60 FPS 가능합니다.
    접기
    4K UHD 해상도 (3840 X 2160) 로 플레이할 경우
    - APEX 레전드 : 하옵으로 144 FPS 가능합니다.
    - EA SPORTS FC™ 25 : 상옵으로 60 FPS 가능합니다.
    - FC 24 (피파 24) : 중옵으로 60 FPS 가능합니다.
    - NBA 2K25 : 중옵으로 60 FPS 가능합니다.
    - P의 거짓 : 중옵으로 60 FPS 가능합니다.
    - shape of dreams (셰이프 오브 드림즈) : 하으로 60 FPS 가능합니다.
    - 갓 오브 워 라그나로크 : 중옵으로 60 FPS 가능합니다.
    - 건담 브레이커 4 (GUNDAM BREAKER 4) : 하옵으로 60 FPS 가능합니다.
    - 건파이어 리본(Gunfire Reborn) : 상옵으로 144 FPS 가능합니다.
    - 검은사막 : 중옵으로 100 FPS 가능합니다.
    - 고스트 리콘: 브레이크 포인트 : 상옵으로 60 FPS 가능합니다.
    - 고스트 오브 쓰시마 : 하옵으로 60 FPS 가능합니다.
    - 나 혼자만 레벨업 : ARISE OVERDRIVE : 중으로 60 FPS 가능합니다.
    - 나 혼자만 레벨업:어라이즈 : 최상옵으로 60 FPS 가능합니다.
    - 나라카: 블레이드포인트 : 하으로 60 FPS 가능합니다.
    - 나인 솔즈 (Nine Sols) : 최상옵으로 144 FPS 가능합니다.
    - 노 레스트 포 더 위키드 : 하옵으로 60 FPS 가능합니다.
    - 다크 소울 3 : 최상옵으로 60 FPS 가능합니다.
    - 던전앤파이터 : 상옵으로 60 FPS 가능합니다.
    - 데드 바이 데이라이트 : 중옵으로 120 FPS 가능합니다.
    - 데드 아일랜드 2 : 하옵으로 144 FPS 가능합니다.
    - 데몬 엑스 마키나: 타이타닉 사이온 : 하으로 60 FPS 가능합니다.
    - 데스티니 가디언즈 2 : 중옵으로 144 FPS 가능합니다.
    - 데이브 더 다이브 : 최상으로 144 FPS 가능합니다.
    - 도타 2 : 최상옵으로 144 FPS 가능합니다.
    - 듄: 어웨이크닝 : 하으로 60 FPS 가능합니다.
    - 디아블로2 레저렉션 : 중옵으로 100 FPS 가능합니다.
    - 디아블로4 : 중옵으로 144 FPS 가능합니다.
    - 디제이맥스 리스펙트 V : 최상으로 60 FPS 가능합니다.
    - 딥 락 갤럭틱: 서바이벌 : 중옵으로 144 FPS 가능합니다.
    - 라스트 에포크 : 중옵으로 60 FPS 가능합니다.
    - 락다운 프로토콜 : 상으로 FPS 가능합니다.
    - 러스트 : 상으로 FPS 가능합니다.
    - 레드 데드 리뎀션2 : XBOX옵으로 60 FPS 가능합니다.
    - 레디 오어 낫 : 하옵으로 144 FPS 가능합니다.
    - 레인보우식스 시즈 : 상으로 FPS 가능합니다.
    - 레전드 오브 모탈(Legend of Mortal) : 최상으로 60 FPS 가능합니다.
    - 로블록스 : 중옵으로 60 FPS 가능합니다.
    - 로스트아크 : 중옵으로 144 FPS 가능합니다.
    - 리그오브레전드 : 최상옵으로 144 FPS 가능합니다.
    - 리씰컴퍼니 : 최상옵으로 60 FPS 가능합니다.
    - 림버스 컴퍼니 (Limbus Company) : 최상옵으로 60 FPS 가능합니다.
    - 마비노기 : 최상옵으로 144 FPS 가능합니다.
    - 마운트 앤 블레이드 2: 배너로드 : 하옵으로 144 FPS 가능합니다.
    - 마인크래프트 : 하옵으로 60 FPS 가능합니다.
    - 매너 로드 : 최상옵으로 60 FPS 가능합니다.
    - 메이플스토리 : 상옵으로 60 FPS 가능합니다.
    - 명조: 워더링 웨이브 : (최상옵)으로 60 FPS 가능합니다.
    - 몬스터 헌터 월드 : 중옵으로 60 FPS 가능합니다.
    - 발더스 게이트3 : 중옵으로 60 FPS 가능합니다.
    - 발로란트 : 최상옵으로 144 FPS 가능합니다.
    - 백 4 블러드 : 중옵으로 144 FPS 가능합니다.
    - 사이버펑크 2077 : 하옵으로 60 FPS 가능합니다.
    - 사일런트 힐 2 (SILENT HILL 2) : 하옵으로 60 FPS 가능합니다.
    - 새티스 팩토리(Satisfactory) : 중옵으로 60 FPS 가능합니다.
    - 샌드랜드 : 중옵으로 144 FPS 가능합니다.
    - 서든어택 : 상옵으로 75 FPS 가능합니다.
    - 소울워커 : 최상옵으로 60 FPS 가능합니다.
    - 쉐이프즈 2 (shapez 2) : 최상옵으로 60 FPS 가능합니다.
    - 스타크래프트 : 상옵으로 60 FPS 가능합니다.
    - 스텔라 블레이드 : 중으로 60 FPS 가능합니다.
    - 스트리노바 : 상으로 FPS 가능합니다.
    - 심즈4 : 최상으로 144 FPS 가능합니다.
    - 쓰론 앤 리버티 (TL) : 하옵으로 60 FPS 가능합니다.
    - 아레나 브레이크아웃: 인피니티 : 하옵으로 100 FPS 가능합니다.
    - 아머드 코어 6 루비콘의 화염 : 하으로 60 FPS 가능합니다.
    - 아이작의 번제 : 상으로 FPS 가능합니다.
    - 아크레이더스 : 하으로 60 FPS 가능합니다.
    - 아크서바이벌 어센디드 : 하옵으로 60 FPS 가능합니다.
    - 어바우드 : 상옵으로 FPS 가능합니다.
    - 어쌔신 크리드 미라지 : 중옵으로 60 FPS 가능합니다.
    - 어쌔신 크리드 섀도우스 : 하으로 60 FPS 가능합니다.
    - 에이지 오브 미쏠로지 리톨드 : 중옵으로 60 FPS 가능합니다.
    - 에일 ＆ 테일 태번 (Ale ＆ Tale Tavern) : 상옵으로 60 FPS 가능합니다.
    - 엘든 링: 황금 나무의 그림자 : 중옵으로 60 FPS 가능합니다.
    - 엘든링 : 중옵으로 60 FPS 가능합니다.
    - 오버워치2 : 상옵으로 144 FPS 가능합니다.
    - 용과 같이 8 : 하옵으로 60 FPS 가능합니다.
    - 워테일즈(Wartales) : 중옵으로 60 FPS 가능합니다.
    - 워프레임 : 하옵으로 144 FPS 가능합니다.
    - 원스 휴먼(Once Human) : 중옵으로 60 FPS 가능합니다.
    - 원신 : 최상옵으로 60 FPS 가능합니다.
    - 월드오브탱크 : 상으로 FPS 가능합니다.
    - 이터널리턴 : 중옵으로 60 FPS 가능합니다.
    - 인슈라오디드 : 하옵으로 60 FPS 가능합니다.
    - 작혼: 리치 마작 : 최상으로 60 FPS 가능합니다.
    - 진삼국무쌍 ORIGINS : 중으로 60 FPS 가능합니다.
    - 카타클리스모(Cataclismo) : 상옵으로 60 FPS 가능합니다.
    - 카트라이더 : 드리프트 : 중옵으로 144 FPS 가능합니다.
    - 컨커러스 블레이드 : 하옵으로 60 FPS 가능합니다.
    - 컬트 오브 더 램 (Cult of the Lamb) : 최상옵으로 60 FPS 가능합니다.
    - 코어 키퍼(Core Keeper) : 최상옵으로 60 FPS 가능합니다.
    - 크라임 씬 클리너(Crime Scene Cleaner) : 중옵으로 60 FPS 가능합니다.
    - 크루세이더 킹즈 3 : 최상옵으로 60 FPS 가능합니다.
    - 클레르 옵스퀴르 : 33 원정대 : 하으로 60 FPS 가능합니다.
    - 클로저스 : 상으로 FPS 가능합니다.
    - 킹덤 컴: 딜리버런스 : 하옵으로 60 FPS 가능합니다.
    - 타이니 글레이드 (Tiny Glade) : 최상옵으로 60 FPS 가능합니다.
    - 태양 제국의 죄악 II : 상옵으로 60 FPS 가능합니다.
    - 트리 오브 세이비어 : 최상옵으로 60 FPS 가능합니다.
    - 파이널 판타지 16 : 하옵으로 60 FPS 가능합니다.
    - 파티 애니멀즈 (Party Animals) : 최상옵으로 60 FPS 가능합니다.
    - 패스 오브 엑자일(P.O.E) : 권장옵으로 60 FPS 가능합니다.
    - 팰월드(Palworld) / 팔월드 : 하옵으로 60 FPS 가능합니다.
    - 포르자 호라이즌5 : 중옵으로 60 FPS 가능합니다.
    - 풋볼매니저 2024 : 최상옵으로 60 FPS 가능합니다.
    - 프로스트펑크 2 (Frostpunk 2) : 하옵으로 60 FPS 가능합니다.
    - 프로젝트 좀보이드 (Project Zomboid) : 최상옵으로 60 FPS 가능합니다.
    - 피파온라인4 : 최상옵으로 144 FPS 가능합니다.
    - 하데스 2 : 최상으로 144 FPS 가능합니다.
    - 할로우 나이트 : 상으로 60 FPS 가능합니다.
    - 헬다이버즈2 : 중옵으로 60 FPS 가능합니다.
    - 호그와트 레거시 : 하옵으로 60 FPS 가능합니다.
    접기
    위 내용을 표로 정리하면 다음과 같습니다.
    해상도란? 내 모니터 해상도 확인하는 법
    번호	게임	평균프레임	옵션단계	FHD해상도	QHD해상도	UHD해상도
    1	APEX 레전드	144 FPS	하옵 < 중옵 < 최상옵	최상옵까지 지원	중옵까지 지원	하옵까지 지원
    2	Dragon Ball Sparking Zero	60 FPS	최상옵	최상옵까지 지원	최상옵까지 지원	미지원
    3	EA SPORTS FC™ 25	60 FPS	하옵 < 중옵 < 상옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	상옵까지 지원
    4	FC 24 (피파 24)	60 FPS	하옵 < 중옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	중옵까지 지원
    5	GTA5	144 FPS	중옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	미지원
    6	Metaphor: ReFantazio	100 FPS	하옵 < 중옵 < 상옵	상옵까지 지원	중옵까지 지원	미지원
    7	NBA 2K25	60 FPS	하옵 < 중옵 < 상옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	중옵까지 지원
    8	P의 거짓	60 FPS	하옵 < 중옵 < 최상옵 < 최상옵 + DLSS	최상옵 + DLSS까지 지원	최상옵 + DLSS까지 지원	중옵까지 지원
    9	shape of dreams (셰이프 오브 드림즈)	60 FPS	하 < 중 < 상	상까지 지원	상까지 지원	하까지 지원
    10	W.O.W(월드오브워크레프트)	144 FPS	중옵 < 상옵	상옵까지 지원	중옵까지 지원	미지원
    11	갓 오브 워 라그나로크	60 FPS	하옵 < 중옵 < 상옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	중옵까지 지원
    12	건담 브레이커 4 (GUNDAM BREAKER 4)	60 FPS	하옵 < 중옵 < 상옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	하옵까지 지원
    13	건파이어 리본(Gunfire Reborn)	144 FPS	상옵	상옵까지 지원	상옵까지 지원	상옵까지 지원
    14	검은 신화: 오공	60 FPS	하옵 < 중옵 < 상옵 < 최상옵	최상옵까지 지원	중옵까지 지원	미지원
    15	검은사막	100 FPS	하옵 < 중옵 < 최상옵 < 리마스터옵	리마스터옵까지 지원	최상옵까지 지원	중옵까지 지원
    16	고스트 리콘: 브레이크 포인트	60 FPS	하옵 < 중옵 < 상옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	상옵까지 지원
    17	고스트 오브 쓰시마	60 FPS	하옵 < 중옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	하옵까지 지원
    18	그랑블루 판타지 리링크	60 FPS	하옵 < 중옵 < 최상옵	중옵까지 지원	하옵까지 지원	미지원
    19	나 혼자만 레벨업 : ARISE OVERDRIVE	60 FPS	하 < 중 < 상	상까지 지원	상까지 지원	중까지 지원
    20	나 혼자만 레벨업:어라이즈	60 FPS	하옵 < 중옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	최상옵까지 지원
    21	나라카: 블레이드포인트	60 FPS	하 < 중 < 상	상까지 지원	상까지 지원	하까지 지원
    22	나인 솔즈 (Nine Sols)	144 FPS	최상옵	최상옵까지 지원	최상옵까지 지원	최상옵까지 지원
    23	노 레스트 포 더 위키드	60 FPS	하옵 < 중옵 < 최상옵	최상옵까지 지원	중옵까지 지원	하옵까지 지원
    24	노 맨즈 스카이 (No Man‘s Sky)	100 FPS	하옵 < 중옵 < 상옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	미지원
    25	다잉 라이트: 더 비스트	60 FPS	하 < 중 < 상	상까지 지원	상까지 지원	미지원
    26	다크 소울 3	60 FPS	하옵 < 중옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	최상옵까지 지원
    27	더 파이널스	144 FPS	하옵 < 중옵 < 최상옵	중옵까지 지원	하옵까지 지원	미지원
    28	던전앤파이터	60 FPS	상옵	상옵까지 지원	상옵까지 지원	상옵까지 지원
    29	데드 바이 데이라이트	120 FPS	하옵 < 중옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	중옵까지 지원
    30	데드 아일랜드 2	144 FPS	하옵 < 중옵 < 최상옵	최상옵까지 지원	중옵까지 지원	하옵까지 지원
    31	데드록 (Deadlock)	60 FPS	최상옵	최상옵까지 지원	최상옵까지 지원	미지원
    32	데몬 엑스 마키나: 타이타닉 사이온	60 FPS	하 < 중 < 상	상까지 지원	상까지 지원	하까지 지원
    33	데스티니 가디언즈 2	144 FPS	하옵 < 중옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	중옵까지 지원
    34	데이브 더 다이브	144 FPS	최상	최상까지 지원	최상까지 지원	최상까지 지원
    35	도타 2	144 FPS	하옵 < 중옵 < 상옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	최상옵까지 지원
    36	듄: 어웨이크닝	60 FPS	하 < 중 < 상	상까지 지원	상까지 지원	하까지 지원
    37	드래곤즈 도그마 2	30 FPS	하옵 < 중옵 < 최상옵	중옵까지 지원	하옵까지 지원	미지원
    38	디아블로2 레저렉션	100 FPS	중옵 < 상옵	상옵까지 지원	상옵까지 지원	중옵까지 지원
    39	디아블로4	144 FPS	하옵 < 중옵 < 상옵 < 풀옵(DLSS/FSR)	풀옵(DLSS/FSR)까지 지원	풀옵(DLSS/FSR)까지 지원	중옵까지 지원
    40	디제이맥스 리스펙트 V	60 FPS	최상	최상까지 지원	최상까지 지원	최상까지 지원
    41	딥 락 갤럭틱: 서바이벌	144 FPS	하옵 < 중옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	중옵까지 지원
    42	라스트 에포크	60 FPS	하옵 < 중옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	중옵까지 지원
    43	락다운 프로토콜	FPS	상	상까지 지원	상까지 지원	상까지 지원
    44	러스트	FPS	상	상까지 지원	상까지 지원	상까지 지원
    45	레드 데드 리뎀션2	60 FPS	XBOX옵 < 상옵 < 최상옵	최상옵까지 지원	상옵까지 지원	XBOX옵까지 지원
    46	레디 오어 낫	144 FPS	하옵 < 중옵 < 최상옵	최상옵까지 지원	중옵까지 지원	하옵까지 지원
    47	레인보우식스 시즈	FPS	상	상까지 지원	상까지 지원	상까지 지원
    48	레전드 오브 모탈(Legend of Mortal)	60 FPS	최상	최상까지 지원	최상까지 지원	최상까지 지원
    49	로드나인	60 FPS	하옵 < 중옵 < 상옵	상옵까지 지원	상옵까지 지원	미지원
    50	로블록스	60 FPS	하옵 < 중옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	중옵까지 지원
    51	로스트아크	144 FPS	하옵 < 중옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	중옵까지 지원
    52	루마섬	FPS	상	상까지 지원	상까지 지원	미지원
    53	리그오브레전드	144 FPS	하옵 < 중옵 < 상옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	최상옵까지 지원
    54	리스크 오브 레인 2 (Risk of Rain 2)	144 FPS	최상옵	최상옵까지 지원	최상옵까지 지원	미지원
    55	리씰컴퍼니	60 FPS	최상옵	최상옵까지 지원	최상옵까지 지원	최상옵까지 지원
    56	림버스 컴퍼니 (Limbus Company)	60 FPS	최상옵	최상옵까지 지원	최상옵까지 지원	최상옵까지 지원
    57	림월드	60 FPS	최상옵	최상옵까지 지원	최상옵까지 지원	미지원
    58	마비노기	144 FPS	하옵 < 중옵 < 상옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	최상옵까지 지원
    59	마운트 앤 블레이드 2: 배너로드	144 FPS	하옵 < 중옵 < 최상옵	최상옵까지 지원	중옵까지 지원	하옵까지 지원
    60	마인크래프트	60 FPS	하옵 < 중옵 < 최상옵	최상옵까지 지원	중옵까지 지원	하옵까지 지원
    61	매너 로드	60 FPS	하옵 < 중옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	최상옵까지 지원
    62	메이플스토리	60 FPS	상옵	상옵까지 지원	상옵까지 지원	상옵까지 지원
    63	명조: 워더링 웨이브	60 FPS	(최상옵)	(최상옵)까지 지원	(최상옵)까지 지원	(최상옵)까지 지원
    64	몬스터 헌터 와일즈	FPS	상옵	상옵까지 지원	상옵까지 지원	미지원
    65	몬스터 헌터 월드	60 FPS	하옵 < 중옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	중옵까지 지원
    66	바이오하자드 RE:4	60 FPS	하옵 < 중옵 < 상옵	중옵까지 지원	하옵까지 지원	미지원
    67	발더스 게이트3	60 FPS	하옵 < 중옵 < 상옵	상옵까지 지원	상옵까지 지원	중옵까지 지원
    68	발로란트	144 FPS	하옵 < 중옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	최상옵까지 지원
    69	배틀그라운드	144 FPS	선수옵 < 국옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	미지원
    70	백 4 블러드	144 FPS	하옵 < 중옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	중옵까지 지원
    71	벨라이트	60 FPS	하옵 < 중옵 < 최상옵	중옵까지 지원	하옵까지 지원	미지원
    72	붉은사막	60 FPS	하 < 중 < 상	상까지 지원	상까지 지원	미지원
    73	빈딕투스: 디파잉 페이트	60 FPS	하 < 중 < 상 < 최상	최상까지 지원	상까지 지원	미지원
    74	사이버펑크 2077	60 FPS	하옵 < 중옵 < 최상옵 < 최상옵+RT	최상옵까지 지원	중옵까지 지원	하옵까지 지원
    75	사일런트 힐 2 (SILENT HILL 2)	60 FPS	하옵 < 중옵 < 상옵 < 최상옵	최상옵까지 지원	상옵까지 지원	하옵까지 지원
    76	새티스 팩토리(Satisfactory)	60 FPS	하옵 < 중옵 < 상옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	중옵까지 지원
    77	샌드랜드	144 FPS	하옵 < 중옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	중옵까지 지원
    78	서든어택	75 FPS	상옵	상옵까지 지원	상옵까지 지원	상옵까지 지원
    79	선즈 오브 더포레스트	FPS	상	상까지 지원	상까지 지원	미지원
    80	소울워커	60 FPS	최상옵	최상옵까지 지원	최상옵까지 지원	최상옵까지 지원
    81	쉐이프즈 2 (shapez 2)	60 FPS	최상옵	최상옵까지 지원	최상옵까지 지원	최상옵까지 지원
    82	스타크래프트	60 FPS	상옵	상옵까지 지원	상옵까지 지원	상옵까지 지원
    83	스텔라 블레이드	60 FPS	하 < 중 < 상	상까지 지원	상까지 지원	중까지 지원
    84	스트리노바	FPS	상	상까지 지원	상까지 지원	상까지 지원
    85	스플릿 픽션	60 FPS	하 < 중 < 상	상까지 지원	중까지 지원	미지원
    86	심즈4	144 FPS	최상	최상까지 지원	최상까지 지원	최상까지 지원
    87	쓰론 앤 리버티 (TL)	60 FPS	하옵 < 중옵 < 최상옵	최상옵까지 지원	중옵까지 지원	하옵까지 지원
    88	아레나 브레이크아웃: 인피니티	100 FPS	하옵 < 중옵 < 상옵 < 최상옵	최상옵까지 지원	상옵까지 지원	하옵까지 지원
    89	아머드 코어 6 루비콘의 화염	60 FPS	하 < 중 < 상	상까지 지원	상까지 지원	하까지 지원
    90	아스달 연대기 세 개의 세력	60 FPS	최상옵	최상옵까지 지원	미지원	미지원
    91	아이온	60 FPS	최상옵	최상옵까지 지원	최상옵까지 지원	미지원
    92	아이온2	60 FPS	하 < 중 < 상	상까지 지원	상까지 지원	미지원
    93	아이작의 번제	FPS	상	상까지 지원	상까지 지원	상까지 지원
    94	아크레이더스	60 FPS	하 < 중 < 상	상까지 지원	상까지 지원	하까지 지원
    95	아크서바이벌 어센디드	60 FPS	하옵 < 중옵 < 최상옵	최상옵까지 지원	중옵까지 지원	하옵까지 지원
    96	어바우드	FPS	하옵 < 중옵 < 상옵	상옵까지 지원	상옵까지 지원	상옵까지 지원
    97	어쌔신 크리드 미라지	60 FPS	하옵 < 중옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	중옵까지 지원
    98	어쌔신 크리드 섀도우스	60 FPS	하 < 중 < 상	상까지 지원	상까지 지원	하까지 지원
    99	에이지 오브 미쏠로지 리톨드	60 FPS	하옵 < 중옵 < 상옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	중옵까지 지원
    100	에일 ＆ 테일 태번 (Ale ＆ Tale Tavern)	60 FPS	하옵 < 중옵 < 상옵	상옵까지 지원	상옵까지 지원	상옵까지 지원
    101	엘든 링: 황금 나무의 그림자	60 FPS	하옵 < 중옵 < 상옵	상옵까지 지원	상옵까지 지원	중옵까지 지원
    102	엘든링	60 FPS	하옵 < 중옵 < 상옵	상옵까지 지원	상옵까지 지원	중옵까지 지원
    103	오버워치2	144 FPS	하옵 < PC방옵 < 상옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	상옵까지 지원
    104	용과 같이 8	60 FPS	하옵 < 중옵 < 상옵	상옵까지 지원	중옵까지 지원	하옵까지 지원
    105	워썬더 (WAR THUNDER)	FPS	상	상까지 지원	상까지 지원	미지원
    106	워테일즈(Wartales)	60 FPS	하옵 < 중옵 < 상옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	중옵까지 지원
    107	워프레임	144 FPS	하옵 < 중옵 < 최상옵	최상옵까지 지원	중옵까지 지원	하옵까지 지원
    108	워해머 40k 스페이스 마린 2	60 FPS	하옵 < 중옵 < 상옵 < 최상옵	최상옵까지 지원	중옵까지 지원	미지원
    109	원스 휴먼(Once Human)	60 FPS	하옵 < 중옵 < 상옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	중옵까지 지원
    110	원신	60 FPS	최상옵	최상옵까지 지원	최상옵까지 지원	최상옵까지 지원
    111	월드오브탱크	FPS	상	상까지 지원	상까지 지원	상까지 지원
    112	이스케이프 프롬 타르코프	100 FPS	하옵 < 중옵 < 최상옵	중옵까지 지원	하옵까지 지원	미지원
    113	이터널리턴	60 FPS	중옵 < 상옵	상옵까지 지원	상옵까지 지원	중옵까지 지원
    114	인슈라오디드	60 FPS	하옵 < 중옵 < 상옵	상옵까지 지원	중옵까지 지원	하옵까지 지원
    115	인조이	FPS	하 < 중 < 상	상까지 지원	중까지 지원	미지원
    116	인펙션 프리 존	60 FPS	최상옵	최상옵까지 지원	최상옵까지 지원	미지원
    117	잇 테익스 투 (It Takes Two)	60 FPS	하옵 < 중옵 < 상옵 < 최상옵	최상옵까지 지원	상옵까지 지원	미지원
    118	작혼: 리치 마작	60 FPS	최상	최상까지 지원	최상까지 지원	최상까지 지원
    119	진삼국무쌍 ORIGINS	60 FPS	하 < 중 < 상	상까지 지원	상까지 지원	중까지 지원
    120	철권 7	60 FPS	최상옵	최상옵까지 지원	최상옵까지 지원	미지원
    121	철권 8	60 FPS	최상옵	최상옵까지 지원	최상옵까지 지원	미지원
    122	카타클리스모(Cataclismo)	60 FPS	하옵 < 중옵 < 상옵	상옵까지 지원	상옵까지 지원	상옵까지 지원
    123	카트라이더 : 드리프트	144 FPS	하옵 < 중옵 < 상옵	상옵까지 지원	상옵까지 지원	중옵까지 지원
    124	컨커러스 블레이드	60 FPS	하옵 < 중옵 < 상옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	하옵까지 지원
    125	컬트 오브 더 램 (Cult of the Lamb)	60 FPS	최상옵	최상옵까지 지원	최상옵까지 지원	최상옵까지 지원
    126	코어 키퍼(Core Keeper)	60 FPS	최상옵	최상옵까지 지원	최상옵까지 지원	최상옵까지 지원
    127	콜 오브 듀티 : 모던 워페어 II 2022	144 FPS	하옵 < 중옵 < 상옵	중옵까지 지원	하옵까지 지원	미지원
    128	콜 오브 듀티 블랙옵스6	FPS	하옵 < 중옵 < 상옵	상옵까지 지원	중옵까지 지원	미지원
    129	크라임 씬 클리너(Crime Scene Cleaner)	60 FPS	하옵 < 중옵 < 상옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	중옵까지 지원
    130	크루세이더 킹즈 3	60 FPS	하옵 < 중옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	최상옵까지 지원
    131	클레르 옵스퀴르 : 33 원정대	60 FPS	하 < 중 < 상	상까지 지원	상까지 지원	하까지 지원
    132	클로저스	FPS	상	상까지 지원	상까지 지원	상까지 지원
    133	킹덤 컴 : 딜리버런스 2	60 FPS	하 < 중 < 상	상까지 지원	하까지 지원	미지원
    134	킹덤 컴: 딜리버런스	60 FPS	하옵 < 중옵 < 상옵	상옵까지 지원	상옵까지 지원	하옵까지 지원
    135	타이니 글레이드 (Tiny Glade)	60 FPS	최상옵	최상옵까지 지원	최상옵까지 지원	최상옵까지 지원
    136	태양 제국의 죄악 II	60 FPS	하옵 < 중옵 < 상옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	상옵까지 지원
    137	토탈워 워해머3	120 FPS	(하옵 < 중옵 < 최상)	(하옵까지 지원	미지원	미지원
    138	트리 오브 세이비어	60 FPS	최상옵	최상옵까지 지원	최상옵까지 지원	최상옵까지 지원
    139	파이널 판타지 16	60 FPS	하옵 < 중옵 < 상옵 < 최상옵	최상옵까지 지원	상옵까지 지원	하옵까지 지원
    140	파티 애니멀즈 (Party Animals)	60 FPS	최상옵	최상옵까지 지원	최상옵까지 지원	최상옵까지 지원
    141	패스 오브 엑자일 2 (Path of Exile 2)	60 FPS	하옵 < 중옵 < 상옵 < 최상옵	최상옵까지 지원	상옵까지 지원	미지원
    142	패스 오브 엑자일(P.O.E)	60 FPS	하옵 < 권장옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	권장옵까지 지원
    143	팰월드(Palworld) / 팔월드	60 FPS	하옵 < 중옵 < 최상옵	최상옵까지 지원	중옵까지 지원	하옵까지 지원
    144	퍼스트 디센던트	100 FPS	울트라 < 울트라RT	울트라RT까지 지원	미지원	미지원
    145	퍼스트 버서커: 카잔	60 FPS	하 < 중 < 상	상까지 지원	중까지 지원	미지원
    146	페르소나 3 리로드	60 FPS	최상 < 최상(RT)	최상(RT)까지 지원	최상까지 지원	미지원
    147	페르소나5 더 로열	100 FPS	하옵 < 중옵 < 상옵	상옵까지 지원	상옵까지 지원	미지원
    148	포르자 호라이즌5	60 FPS	하옵 < 중옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	중옵까지 지원
    149	풋볼매니저 2024	60 FPS	최상옵	최상옵까지 지원	최상옵까지 지원	최상옵까지 지원
    150	프로스트펑크 2 (Frostpunk 2)	60 FPS	하옵 < 중옵 < 상옵 < 최상옵	최상옵까지 지원	상옵까지 지원	하옵까지 지원
    151	프로젝트 좀보이드 (Project Zomboid)	60 FPS	최상옵	최상옵까지 지원	최상옵까지 지원	최상옵까지 지원
    152	플래닛 주	60 FPS	최상옵	최상옵까지 지원	최상옵까지 지원	미지원
    153	플래닛 코스터	FPS	상옵	상옵까지 지원	상옵까지 지원	미지원
    154	피파온라인4	144 FPS	중옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	최상옵까지 지원
    155	하데스 2	144 FPS	최상	최상까지 지원	최상까지 지원	최상까지 지원
    156	할로우 나이트	60 FPS	하 < 중 < 상	상까지 지원	상까지 지원	상까지 지원
    157	헬다이버즈2	60 FPS	하옵 < 중옵 < 최상옵	최상옵까지 지원	최상옵까지 지원	중옵까지 지원
    158	호그와트 레거시	60 FPS	하옵 < 중옵 < 최상옵	최상옵까지 지원	중옵까지 지원	하옵까지 지원
    접기
    PC견적QnA에서 해당 견적서로 추천드렸던 질문과 답변을 보여드립니다.
    고민
    ( min***님 ) 게임은 배그 위주로 하고 모니터는 fhd 180hz 정도 사용할 것 같습니다. 호환성 및 성능 괜찮을까요? 배그 렉 없이 플레이 하고 싶어서 783dx와 5060ti로 조합하였습니다.
    답변
    해당 견적서를 추천 드린 이유로는~

    메모리는 라이젠 용으로 나온 NEO 시리즈가 가격대가 좀 더 좋아서 변경하셔도 좋을 거 같고, 나머진 호환 문제 없어서 조립서비스 추가 후 이륙하셔도 무방합니다 ^^
    아래는 지금까지 설명드렸던 견적서 조건에 일치하는, 컴퓨터를 판매하는 여러 업체들을 가격비교 한 것입니다.
    1번지금까지 위에서 설명드린 견적서
    부품	등급	세부 부품명
    CPU	라이젠7 7800X3D	AMD 라이젠7-5세대 7800X3D (라파엘) (멀티팩(정품))상세보기
    메인보드	B850 (AMD)	ASUS TUF Gaming B850M-PLUS WIFI STCOM상세보기
    메모리	16(GB) DDR5 x 2 개	
    ESSENCORE KLEVV DDR5-5600 CL46 NEO 파인인포 (16GB) x 2 개
    상세보기
    그래픽카드	nVIDIA RTX 5060 Ti	
    PALIT 지포스 RTX 5060 Ti Infinity 3 D7 16GB 이엠텍
    상세보기
    SSD	1(TB) M.2(NVMe)	
    솔리다임 P44 Pro M.2 NVMe 벌크 (1TB)
    상세보기
    케이스	미들타워	
    마이크로닉스 COOLMAX 스테디 블랙 (미들타워)
    상세보기
    파워	700(W) ATX	
    마이크로닉스 Classic II 풀체인지 700W 80PLUS BRONZE ATX3.1 (PCIE5.1)
    상세보기
    CPU쿨러	공랭 6(EA)	
    Thermalright Peerless Assassin 120 SE 서린
    상세보기
    조립	프리미업조립	[견적왕] 조립 서비스 + 1년 출장 A/S상세보기
    OS	Windows	
    윈도우가 포함되어 있지 않습니다.
    윈도우 구매를 원하시는 경우, 클릭 후 구매할 제품을 선택해 주세요. (구매 시 무료로 설치되어 출고됩니다.)
    상세보기
    위 "1번 견적서" 조건에 맞는, 업체별 가격비교 결과

    카드가무이자 할부현금가100% 영수증 인기판매처순낮은가격순높은가격순
    현재 조건에서 카드가로 구매가능한 업체가 없습니다.
    2번CPU+메인보드+그래픽카드는 1번 견적서와 같고, 나머지 부품은 호환성이 검증된 제품을 견적왕 시스템에서 조합한 것입니다.
    부품	등급	세부 부품명
    CPU	라이젠7 7800X3D	AMD 라이젠7-5세대 7800X3D (라파엘) (멀티팩(정품))
    메인보드	B850 (AMD)	ASUS TUF Gaming B850M-PLUS WIFI STCOM
    그래픽카드	nVIDIA RTX 5060 Ti	PALIT 지포스 RTX 5060 Ti Infinity 3 D7 16GB 이엠텍
    위 "2번 견적서" 에 일치하는 완제품 검색 결과

    카드가무이자 할부현금가100% 영수증
    현재 조건에서 카드가로 구매가능한 업체가 없습니다.
    3번CPU+그래픽카드는 1번 견적서와 같고, 나머지 부품은 호환성이 검증된 제품을 견적왕 시스템에서 조합한 것입니다.
    부품	등급	세부 부품명
    CPU	라이젠7 7800X3D	AMD 라이젠7-5세대 7800X3D (라파엘) (멀티팩(정품))
    그래픽카드	nVIDIA RTX 5060 Ti	PALIT 지포스 RTX 5060 Ti Infinity 3 D7 16GB 이엠텍
    위 "3번 견적서" 에 일치하는 완제품 검색 결과

    카드가무이자 할부현금가100% 영수증

    업체명 : 피씨포맨

    CPU	라이젠7 7800X3D	AMD 라이젠7-5세대 7800X3D (라파엘) (멀티팩(정품))
    그래픽카드	nVIDIA RTX 5060 Ti	PALIT 지포스 RTX 5060 Ti Infinity 3 D7 16GB 이엠텍
    메모리	16(GB) DDR5 x 2 개	PATRIOT DDR5-5600 CL46 EVO (16GB) x 2 개
    메인보드	B650 (AMD)	ASUS TUF Gaming B650EM-E WIFI 대원씨티에스 (AMD B650/M-ATX)
    SSD	1(TB) M.2(NVMe)	GIGABYTE AORUS Gen4 7300 V2 M.2 NVMe 제이씨현 (1TB)
    파워	850(W) ATX	마이크로닉스 Classic II 850W 80PLUS GOLD 풀모듈러 ATX3.1
    케이스	미니타워(ITX)	마이크로닉스 WIZMAX 우드리안 PRO (미니타워)
    CPU쿨러	공랭(듀얼타워) 6(EA)	PCCOOLER CPS RT620 PRO ARGB 카본스틸 (블랙)
    조립	프리미업조립	[견적왕] 조립 서비스 + 1년 출장 A/S
    안녕하세요 견적왕 유저 분들 에게 인정받는 조립PC 판매점 이 되겠습니다. (조립PC만 판매하고있습니다 양해 부탁드리겠습니다.)

    주문후 3~4일 발송완료 후기 점수 만족
    본체갤러리 273건갤러리보기
    1번 견적서와의 스펙 차이점
    파워 : 용량이 150W 더 높음
    CPU쿨러 : 공랭(듀얼타워) 6(EA) 사용
    2,730,430 원
    구매하기

    업체명 : 피씨포맨

    CPU	라이젠7 7800X3D	AMD 라이젠7-5세대 7800X3D (라파엘) (멀티팩(정품))
    그래픽카드	nVIDIA RTX 5060 Ti	PALIT 지포스 RTX 5060 Ti Infinity 3 D7 16GB 이엠텍
    메모리	16(GB) DDR5 x 2 개	ESSENCORE KLEVV DDR5-5600 CL46 AMD 파인인포 (16GB) x 2 개
    메인보드	B650 (AMD)	ASRock B650M Pro X3D 대원씨티에스
    SSD	1(TB) M.2(NVMe)	Western Digital WD BLACK SN850X M.2 NVMe (1TB)
    파워	850(W) ATX	쿨러마스터 MWE GOLD 850 V3 ATX3.1 블랙
    케이스	미들타워	DARKFLASH DRX70 MESH RGB 강화유리 블랙 (미들타워)
    CPU쿨러	공랭(듀얼타워) 6(EA)	PCCOOLER CPS RT620 PRO 카본스틸 (블랙)
    조립	프리미업조립	[견적왕] 조립 서비스 + 1년 출장 A/S
    안녕하세요 견적왕 유저 분들 에게 인정받는 조립PC 판매점 이 되겠습니다. (조립PC만 판매하고있습니다 양해 부탁드리겠습니다.)

    주문후 3~4일 발송완료 후기 점수 만족
    본체갤러리 273건갤러리보기
    1번 견적서와의 스펙 차이점
    파워 : 용량이 150W 더 높음
    CPU쿨러 : 공랭(듀얼타워) 6(EA) 사용
    2,641,590 원
    구매하기

    업체명 : 피씨포맨

    CPU	라이젠7 7800X3D	AMD 라이젠7-5세대 7800X3D (라파엘) (멀티팩(정품))
    그래픽카드	nVIDIA RTX 5060 Ti	PALIT 지포스 RTX 5060 Ti Infinity 3 D7 16GB 이엠텍
    메모리	16(GB) DDR5 x 2 개	ESSENCORE KLEVV DDR5-5600 CL46 AMD 파인인포 (16GB) x 2 개
    메인보드	B650 (AMD)	ASRock B650M Pro X3D 대원씨티에스
    SSD	1(TB) M.2(NVMe)	Western Digital WD BLACK SN850X M.2 NVMe (1TB)
    파워	700(W) ATX	마이크로닉스 Classic II 풀체인지 700W 80PLUS실버 ATX3.1
    케이스	미들타워	마이크로닉스 COOLMAX 스테디 블랙 (미들타워)
    CPU쿨러	공랭(듀얼타워) 6(EA)	3RSYS Socoool RC1400 Quiet 쌍철봉 (블랙)
    조립	프리미업조립	[견적왕] 조립 서비스 + 1년 출장 A/S
    안녕하세요 견적왕 유저 분들 에게 인정받는 조립PC 판매점 이 되겠습니다. (조립PC만 판매하고있습니다 양해 부탁드리겠습니다.)

    주문후 3~4일 발송완료 후기 점수 만족
    본체갤러리 273건갤러리보기
    1번 견적서와의 스펙 차이점
    CPU쿨러 : 공랭(듀얼타워) 6(EA) 사용
    2,620,910 원
    구매하기
    https://kjwwang.com/shop/pc_estimate.html?action=view&es_sn=16628
    회사소개이용약관개인정보처리방침고객센터판매처별 연락처
    상호 : 주식회사 견적왕
    대표이사 : 민경준 주소 : 서울 용산구 새창로45길 30 4층 401호(사이버빌딩) 사업자 정보확인
    사업자등록번호 : 844-86-01757 통신판매업신고 : 제 2020-서울용산-2106 호 서비스가입사실 확인
    고객센터주문상담 : 070-4112-8899 FAX : 02-3273-8898 EMAIL : kjwangM@gmail.com
    분쟁조정기관표시 : 전자거래분쟁중재위원회 개인정보관리 책임자 : 민경준
    호스팅 제공자 : (주)코리아서버호스팅
    Copyright 2020 © 주식회사 견적왕 ALL Rights Reserved.
    판매처 문의
    재고확인, 배송, 주문취소, 반품은 판매처에 문의 부탁드립니다.

    판매처별 전화번호 보기
    견적왕 문의
    견적왕 이용문의 및 불편사항

    070-4112-8899
    ㆍ문의시간 10:00 ~ 17:00 (토, 일, 공휴일 휴무)
    ㆍ점심시간 13:00 ~ 14:00
    현금결제시 고객님의 안전거래를 위해 가입한 구매안전 서비스를 이용하실 수 있습니다.

---

대충 이런식으로 견적과 게임 프레임이 나온단 말이지. 
해당 페이지에서 견적 및 조합별 게임 프레임도 받아오는게 좋을것 같고, 이쪽에서 서비스를 많이 참고를 해야할것 같아.
크롤링을 해서 데이터 학습도 필요할것 같고,

너가 접속 혹은 크롤링 할 수 있으면 알아서 하셈.
