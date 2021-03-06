

// S1  
//Json取得に関するscript############################################################################## //
//##################################################################################################//
//##################################################################################################//
//##################################################################################################//
//##################################################################################################//
//##################################################################################################//
//##################################################################################################//

        //数値の初期設定
        var apiKey = 'AIzaSyDV-W1Zg9_wGJPww-NT5tz9Wi78QF-sDuM';
        var tableId = '1nPQg8swnnMOzYL7k7-McfYrDeMWjuh7bP3QThptN';
        var dataArray = {};
        var all_iventData = {};
        
        var geocode_dataArray = {};
        var geocode_iventData = {};
        
        var geocoded_marker_location = [];
        
        
        //フージョンテーブルズから取ってくる情報の初期化
        function initialize(){
            
            //urlにAPIキーとsql文をくっつけてる
            var sql = 'SELECT * FROM ' + tableId ;      //+ " WHERE week = '" + selected_date + "' ";にするとJSON自体にフィルターをかけれる
            var url = 'https://www.googleapis.com/fusiontables/v1/query';
            url += '?key=' + apiKey;
            url += '&sql=' + encodeURIComponent(sql);
            
            
            //JSON形式でFusionTablesからデータ取得
            //グローバル変数 dataArrayに中身の文字列をStringに変換してからObject型で格納
            //dataArrayからキー指定して all_iventDataに取得してきたrows(イベント情報)のobjictを生成
            $.ajax({
                url: url,
                dataType: 'json',
                success: function (data) {
                    console.log(data);
                    dataArray = JSON.parse(JSON.stringify(data));
                    console.log(dataArray["rows"]);     //dataArrayに格納できているかの確認
                    
                    all_iventData = dataArray["rows"];
                    
                },
                error: function( data ) {
                        $( '#sample-result' ).html( '<font color="red">読み込みNG(ChromeではNG)</font>' );
                }
            });
            
            
            $.getJSON("jsons/kodomo.json", function(data){
	             geocode_dataArray = JSON.parse(JSON.stringify(data)); 
                console.log(geocode_dataArray[0]);     //geocode_dataArrayに格納できているかの確認
            });
            
        }
        











// S2 
//地図表示に関するscript文################################################# //
//##################################################################################################//
//##################################################################################################//
//##################################################################################################//
//##################################################################################################//
//##################################################################################################//
//##################################################################################################//
        
        //メインのマップに名前をつける
        var main_mapview;
        
        //地図自体の表示
        function initMap() {
            
            // キャンパスの要素を取得する
            var canvas = document.getElementById( 'map-canvas' ) ;
            
            // 中心の位置座標を指定する
            var lating = new google.maps.LatLng( 35.661278, 139.395139 );

            //スタイル情報を配列に保存
            var style01 = [
              {
                stylers: [
                    { hue: "#b4cb9e" },
                    { saturation: -20 },
                    { lightness: 20 },
                    { gamma: 1.51 }
                ]
              },{
                featureType: "road",
                elementType: "geometry",
                stylers: [
                
                  { lightness: 100 },
                  { visibility: "simplified" }
                ]
              },{
                featureType: "road",
                elementType: "labels",
                stylers: [
                  { visibility: "off" }
                ]
              },{
                  featureType: "poi.government",
                  elementType: "labels",
                  stylers: [
                    { visibility: "off" }
                  ]
              },{
                featureType: "administrative.locality",
                elementType: "geometry.fill",
                stylers: [
                  {
                    color: "#ffac82"
                  },
                  {
                    weight: 3
                  }
                ]
              },{
                featureType: "administrative.locality",
                elementType: "labels.text",
                stylers: [
                  {
                    color: "#ffac82"
                  },
                  {
                    weight: 1
                  }
                ]
              }
            ];
            // 地図のオプションを設定する
            var mapOptions = {
                zoom: 13 ,				// ズーム値
                center: lating ,		// 中心座標 [lating]
                styles: style01,        //地図のスタイル適用
                disableDefaultUI: true　//デフォルトUIをオフ
            };

            // [canvas]に、[mapOptions]の内容の、地図のインスタンス([map])を作成する
            var map = new google.maps.Map( canvas , mapOptions ) ;
            
            //このfunction外でも使うためにmain_mapviewにmapを格納
            main_mapview = map ; 
        }
        
        
        
        
        //マーカーの設定
        var marker = []; //インスタンス化のための変数
        //出ているマーカーの個数をカウントする変数
        var marker_amount = 0;
        
        var ivent = [];

        
        //マーカーの表示
        function initMarker(sel){
            
            
            //ユーザーが選択した日付の取得(id="form1"のoptionのvalue値を取得)
            //変数名をgenreに変更し、取得したジャンルを格納#################
            //########################################################
            //########################################################
            //########################################################
            var selected_genre;
            selected_genre = get_genre;
            //console.log(selected_date);
            //########################################################
            //########################################################
            //########################################################
            //######################################################## 
            
            //イベントをフィルタにかけて格納し直す(検索済みのobjectを生成)
            //
            //
            //
            //
            //all_iventDataに入っている要素数を一度０にして初期化してからカウント
            var ivent_length = 0;
            ivent_length = Object.keys(all_iventData).length;

            
            //フィルターをかけたイベントを格納するobjectを生成・初期化
            var filtered_iventData = {} ;
            var filtared_ivent_length = 0;
            
            //for文でS1のall_iventDataには入っているキー値の数(ivent_length)だけ回す
            for(var i=0;i < ivent_length ; i++ ){
                
                //iventDataにイベントの情報を格納
                var iventdata = all_iventData[i];
                
                //イベント情報(iventData)の特定のキー値がvalueの値と一致するときにfiltered_ivent[]に0から順番にキー値を設定しイベント情報(iventData)を格納
                //参照する場所をivent[8]に変更##########################
                //###################################################
                //###################################################
                //###################################################
                if(iventdata[8] == selected_genre){
                //###################################################
                //###################################################
                //###################################################
                //###################################################
                    filtered_iventData[filtared_ivent_length] = iventdata;
                    
                    //次のキー値のために1をたす
                    filtared_ivent_length = filtared_ivent_length + 1 ;
                }
                
            }
            //ログに出力
            console.log("filtared_ivent_length is " + filtared_ivent_length);
            console.log("filtered_iventData is " + filtered_iventData);
            
            
            

            
            
            //マーカーの設置
            //
            //
            //
            //
            //イベントの数だけマーカーの生成を行う
            for(var i = 0;i < filtared_ivent_length ; i++){
                
                
                
                var marker_number ;
                
                //marker_numberの重複回避のためのif文
                if(marker_amount == 0){
                    marker_number = 1;
                }else{
                    marker_number = marker_amount +1;
                }
                
                marker_number = marker_number + i ;
                
                
                
                
                //イベントデータの取得.
                ivent[marker_number] = filtered_iventData[i];

                //filtered_iventData[]からキー値を指定してオブジェクトivent[]として取り出す
                //0:日にち
                //1:時間
                //2:施設名
                //3:住所
                //4:イベント名
                //5:電話番号
                //6:内容の説明
                //7:番地
                //8:ジャンル
                //が取得できる。(例: ivent[4] → ニコニコタイムXmasスペシャル)
                
                
                
                //マーカーの設定
                //var marker = []; //インスタンス化のための変数
        
                
                //GeoCodeの取得
                var marker_location = {};
                
                //for文でS1のgeocode_dataArray全てのaddressとivent[3]を検証
                for(var a = 1; a< ivent_length +1 ; a++){
                    
                    //一致した時のみ、marker_locatonに緯度経度を格納
                    
                    if(a>239){
                        continue;
                    }
                    
                    if(ivent[marker_number][3] == geocode_dataArray[a]["address"]){
                        marker_location = {
                            lat: geocode_dataArray[a]["location"][1], // 緯度
                            lng: geocode_dataArray[a]["location"][0]// 経度
                        };   
                    }
                }
                
 
                //GeoCodeをmarkerpositionに格納
                var marker_position;
                
                marker_position = {
                        lat: marker_location["lat"], // 緯度
                        lng: marker_location["lng"]// 経度
                    };
                
                console.log(marker_position);

                //マーカーを生成する(情報が重複しないために引数としてmarker_numberを渡している)
                markermake(marker_number,marker_position);
                
                
                //情報一覧表示バーの出力
                var infowindow_bars = document.getElementById("infowindow-bars");
                var div_element1 = document.createElement("div");
                div_element1.setAttribute('class', 'info-bar-title');
                div_element1.innerHTML = ivent[marker_number][4];
                var div_element2 = document.createElement("div");
                div_element2.setAttribute('class', 'info-bar-date');
                div_element2.innerHTML = "12月" + ivent[marker_number][0] + "日";
                var div_element3 = document.createElement("div");
                div_element3.setAttribute('class', 'info-bar-place');
                div_element3.innerHTML = ivent[marker_number][2];
                var img_info = document.createElement("img");
                img_info.setAttribute('class', 'info-bar-infobutton');
                img_info.setAttribute('onclick', 'info_div_view(' + marker_number + ');showinfo()');
                img_info.setAttribute('src', 'img/info.png');
                var line = document.createElement("HR");
                
                infowindow_bars.appendChild(div_element1);
                infowindow_bars.appendChild(div_element2);
                infowindow_bars.appendChild(div_element3);
                infowindow_bars.appendChild(img_info);
                infowindow_bars.appendChild(line);
                
                
            }
            
            marker_amount = marker_amount + filtared_ivent_length;
            console.log("marker_amount is " + marker_amount);
    
        }
        
        //情報一覧バーのボタンを押した時にpopupを表示するための関数
        function showinfo() {
            $("#infowindow-output,#infowindow-wrapper").show();
            console.log("表示成功");
        }; 


        //マーカーの生成をする関数
        function markermake(numbering,location){

                //マーカーの生成 (marker[]が重複せず格納されるようにする)
                marker[numbering] = new google.maps.Marker({ // マーカーの追加
                    position: location, // マーカーを立てる位置を指定
                    map: main_mapview // マーカーを立てる地図を指定
                });
                
            
                //生成した情報ウィンドウをどのマーカーに対応させるか
                marker[numbering].addListener('click', function() { // マーカーをクリックしたとき
                    //infoWindow[marker_number].open(main_mapview, marker[marker_number]); // マップとマーカーの指定(非表示にする)
                     info_div_view(numbering);
                    
                    $().ready(function(){
                        $("#infowindow-output,#infowindow-wrapper").show();
                    });
                });

        }




        //マーカー削除の関数
         function removeMarker(map){
             for(var i=1; i<= marker_amount; i++){
                    marker[i].setMap(map);
             }
             
             var infowindow_bars = document.getElementById("infowindow-bars");
             infowindow_bars.innerHTML = "<hr>";
         }



        
        //クリックされたら表示するdivの設定
         function info_div_view(num){
                document.getElementById("infowindow-output-iventtitle").innerHTML = ivent[num][4];
                document.getElementById("infowindow-output-date").innerHTML = "12月" + ivent[num][0] + "日";
                document.getElementById("infowindow-output-time").innerHTML = ivent[num][1];
                document.getElementById("infowindow-output-place").innerHTML = ivent[num][2];
                document.getElementById("infowindow-output-location").innerHTML = ivent[num][3];
                document.getElementById("infowindow-output-etc").innerHTML = ivent[num][6];                    
                document.getElementById("infowindow-output-tel").href = "tel:042-" + ivent[num][5];
                //移動ボタンにivent[3]を目的地として挿入
                document.getElementById("open_navigation").href = "http://maps.google.com/maps?saddr=&daddr=" + ivent[num][3] +"&z=15";
                console.log(ivent[num]);
         }
                

// S4
//挙動に関するscript文################################################# //
//##################################################################################################//
//##################################################################################################//
//##################################################################################################//
//##################################################################################################//
//##################################################################################################//
//##################################################################################################//

    $(function () {
        
        // スクロールを無効にする
        /*
        $(window).on('touchmove.noScroll', function(e) {
            e.preventDefault();
        });
        */
        $().ready(function(){
            $("#infowindow-output,#infowindow-wrapper").hide();
                    
        });
        
    
        $("#infowindow-output").click(function (e) {
            e.stopPropagation();
        });      
        
        $("#infowindow-wrapper").click(function () {

            $('#infowindow-output,#infowindow-wrapper').fadeOut();
        });  

		$(".genre_button").click(function () {
            $('#wrapper3').slideUp();
        }); 
        
        $("#back-to-genre").click(function () {
            $('#wrapper3').slideDown();
            if ($("#yajirushi").attr("sts") == "rot") {
                $("#yajirushi").attr("sts", "std")
            }
        }); 
        
        $("#toggle-infowindow-bars").click(function () {
            $('#infowindow-bars').toggle();
        }); 
        

        
        
        $(function() {
            var h = $(window).height();

          
          $('#loader-bg ,#loader').height(h).css('display','block');
        });
 
        
        //ソースコードの読み込み完了時の処理
        $(window).load(function () { //全ての読み込みが完了したら実行
          //initialize()を起動してjsonを読み込む
          initialize();    
          $('#loader-bg').delay(900).fadeOut(800);
          $('#loader').delay(600).fadeOut(300);
          
        });
 
        //10秒たったら強制的にロード画面を非表示
        $(function(){
          setTimeout('stopload()',10000);
        });
 
        function stopload(){
           
          $('#loader-bg').delay(900).fadeOut(800);
          $('#loader').delay(600).fadeOut(300);
            
        }
        
        $("#toggle-infowindow-bars").on("click", function () {
            if ($(this).attr("sts") == "std") {
                $(this).attr("sts", "rot")
            } else {
                $(this).attr("sts", "std")
            }
        });
        
        $("#toggle-infowindow-bars").on("click", function () {
            if ($("#yajirushi").attr("sts") == "std") {
                $("#yajirushi").attr("sts", "rot")
            } else {
                $("#yajirushi").attr("sts", "std")
            }
        });
        
        
        
	});
        
    
// S5
//ジャンル選択に関するscript文################################################# //
//##################################################################################################//
//##################################################################################################//
//##################################################################################################//
//##################################################################################################//
//##################################################################################################//
//##################################################################################################//
    
    function select_genre(genreID){
            //ジャンルボタンのvalue値を取得して格納
            get_genre = document.getElementById(genreID).value;
            console.log(get_genre);
            initMarker();     
    }  

// S6
//現在地取得script文################################################# //
//##################################################################################################//
//##################################################################################################//
//##################################################################################################//
//##################################################################################################//
//##################################################################################################//
//##################################################################################################//

    /*現在地の緯度経度を格納する変数をグローバル化*/
    var myPoint ={};
    /*現在地を示すための変数*/
    var myMarker;
    /*現在地を表示するためのオーバーレイ要素*/
    myPosition.prototype = new google.maps.OverlayView();
    //オーバーレイ要素の内容を宣言      
    function myPosition(map, lat, lng){
        this.lat_ = lat;
        this.lng_ = lng;
        this.setMap(map);
    }
    //オーバーレイするアイコンのhtml要素を生成
      myPosition.prototype.draw = function() {
    　   //一番親のhtml要素の宣言と初期化
        var myLocation_point = this.myLocation_point_;
    　   //要素が何もなかった時に生成実行
        if (!myLocation_point) {
            //今回はspanタグでかこっていアイコン生成します。
            myLocation_point = this.myLocation_point_ = document.createElement('span');
            myLocation_point.className = 'myLocation_point';
            myLocation_point.style.border = "none";
            myLocation_point.style.position = "absolutere";
            myLocation_point.style.paddingLeft = "0px";
	        //アニメーション部分は子要素として生成
	        var ring= document.createElement("span");
            ring.className='ring';
    　       //子要素に配置
            myLocation_point.appendChild(ring);
            //生成部分のDOMを取得してオーバーレイ要素として追加
            var panes = this.getPanes();
            panes.overlayLayer.appendChild(myLocation_point);
        }
    
        // 緯度、軽度の情報を、Pixel（google.maps.Point）に変換
        var point = this.getProjection().fromLatLngToDivPixel( new google.maps.LatLng( this.lat_, this.lng_ ) );
        //ポイントの"位置"をオーバーレイ要素の"位置"に追加     
        if (point) {
            myLocation_point.style.left = point.x + 'px';
            myLocation_point.style.top = point.y + 'px';
        }
    };


    //現在地を取得して実行する関数
    function get_myLocation() {
          if(navigator.geolocation){
          navigator.geolocation.getCurrentPosition(function(position){
              myPoint = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
              };
              //マーカーの追加  
              myMarker = new myPosition(main_mapview, myPoint.lat, myPoint.lng);
              
          },function(){
                alert('位置情報取得ができませんでした');
          });
        }else{
            alert('位置情報取得ができませんでした');
        }
    }
      
    