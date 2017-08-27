$(function(){
	
	var markers = [];   //所有的markers数组
	var locationMarker;	
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        clickableIcons: false,  //POI地图图标不可点击
        disableDefaultUI:true  //去除默认的控件
    });
    google.maps.event.addListener(map,'click',function(e){
    	console.log(e.latLng.toJSON())
    })
    //规划线路的类
    directionsDisplay = new google.maps.DirectionsRenderer;
    directionsService = new google.maps.DirectionsService;
    
    /*  获取定位信息   */    
    function getGeolocation() {
    	
    	locationMarker&&locationMarker.setMap(null);
    	clearMarker()
        // Try HTML5 geolocation. h5定位
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            var pos = {
              lat: 39.36509406503688,
              lng: 117.29690551757812
            };
            // marker 点
            var image = 'img/positionPoint.png'
            locationMarker = new google.maps.Marker({
            		map: map,
                    position: pos,  
                    icon: image,
                    animation: google.maps.Animation.DROP,
             });        
            map.setCenter(pos);  
            //获取附近的marker
            getMarker()
          }, function() {
            handleLocationError(true);
          });
        } else {
          handleLocationError(false);
        }
      }
      
      //错误信息的回调函数
      function handleLocationError(browserHasGeolocation) {
      	var content = '';
        browserHasGeolocation? content = '定位失败是否重新定位！':content = '您的浏览器不支持定位！'
        confirm({
        	content: content,
        	yes:function(index){
        		browserHasGeolocation && getGeolocation()
        		layer.close(index);
        	}
        })
      }
      
      //获取Marker
      function getMarker(){
      	 var marker = [
      	               {lat: 39.31517545076218,lng:117.15545654296875},{lat: 39.50404070558415,lng:117.22000122070312},
      	 			   {lat: 39.47754556963622,lng:117.18704223632812},{lat: 39.48920467334085,lng:117.11700439453125},
      	 			   {lat: 39.144972625112224,lng: 117.18154907226562},{lat: 39.17159402400065,lng:117.48367309570312},
      	 			   {lat: 39.47224533091449,lng:117.31338500976562}
      	  			  ]
      	 
      	 for( var i= 0; i<marker.length; i++ ){
      	 	var point = marker[i];
      	 	(function(point){
      	 		addMarker(point)
      	 	})(point)
      	 }
      	 function addMarker(pos){
      	 	var image = 'img/zhu.png'
	      	var marker = new google.maps.Marker({
	            		map: map,
	                    position: pos,  
	                    icon: image,
	                    animation: google.maps.Animation.DROP,
	            }); 
	        !function(pos){
	        	marker.addListener('click', function(e) {	        	
		            callback(pos)
			    }); 
	        }(pos)
	        
		    markers.push( marker )
      	 }
      	   
      }
           
      function callback(pos){
      	var arr = [{
      		  lat: 39.36509406503688,
              lng: 117.29690551757812
      	}]
      	arr.push(pos);
      	calculateAndDisplayRoute(directionsService, directionsDisplay,arr);
      }
      //清楚marker
      function clearMarker(){
      	  for( var i=0; i<markers.length; i++ ){
      	  	markers[i].setMap(null);
      	  } 
      }
                  
      getGeolocation() 
      
      directionsDisplay.setMap(map);
//    
      //路线规划
      function calculateAndDisplayRoute(directionsService, directionsDisplay,arr) {
        var selectedMode = 'WALKING';
        directionsService.route({
          origin: arr[0],  // Haight.
          destination: arr[1],  // Ocean Beach.       
          travelMode: google.maps.TravelMode[selectedMode]         
        }, function(response, status) {
          if (status == 'OK') {
            //步行的信息
          	var legs = response.routes[0].legs[0];
          	var distance = legs.distance;
          	var duration = legs.duration;
          	console.log( response )  //数据
            directionsDisplay.setDirections(response);  //显示
            directionsDisplay.setOptions({
            	markerOptions:{
		          	visible: false  //关闭图标
		        }
            })
          } else {
            alert( 'Directions request failed due to ' + status);
          }
        });
      }
})
