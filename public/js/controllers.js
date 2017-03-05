app.controller("NavCtrl", function($rootScope, $scope, $http, $location) {
  $scope.logout = function() {
    sessionStorage.clear();
    $http.post("/logout")
      .success(function() {
        $rootScope.currentUser = null;
        $location.url("/home");
      });
  }
  $scope.cartItems=JSON.parse(localStorage.getItem('CardCart'));
  $http.get("/storeInfo").success(function(data) {
    $rootScope.StoreInfo=data;
  })
});

app.controller("SignUpCtrl", function($scope, $http, $rootScope, $location) {
  $scope.signup = function(user) {
    // TODO: verify passwords are the same and notify user
    if (user.password == user.password2) {
      $http.post('/signup', user)
        .success(function(user) {
          $rootScope.currentUser = user;
          $location.url("/profile");
        });
    }
  }
});

app.controller("LoginCtrl", function($location, $scope, $http, $rootScope) {
  $scope.login = function(user) {
    $http.post('/login', user)
      .success(function(response) {
        sessionStorage.setItem('un', JSON.stringify(response));
        console.log(response)
        $rootScope.currentUser = response;

        $location.url("/profile");
      });
  }
});

app.controller("StartCtrl", function($location, $scope) {
  $scope.cardInfo;
  $scope.bannerInfo;
  $scope.showBannerStepTwo = false;
  $scope.showcardStepTwo = false;
  $scope.fonts = [
      "'Roboto Condensed'",
      "'Cabin Condensed'",
      "'Droid Sans'"
  ];

  $scope.textOne = {
      font: "'Roboto Condensed'",
      size: 18
  };
  $scope.textTwo = {
      font: "'Roboto Condensed'",
      size: 18
  };
  $scope.textThree = {
      font: "'Roboto Condensed'",
      size: 18
  };
  $( "#banner-text-one" ).draggable({
    
  });
  $( "#banner-text-two" ).draggable({
    
  });
  $( "#banner-text-three" ).draggable({
    
  });
  $( "#banner-text-four" ).draggable({
    
  });
  $scope.startCard = function() {
    $scope.showBannerStepTwo = false;
    $scope.showcardStepTwo = true;
  }
  $scope.startBanner = function() {
    $scope.showcardStepTwo = false;
    $scope.showBannerStepTwo = true;
  }
  $scope.saveToCanvas = function() {
      html2canvas(document.getElementById("frontOfCard"), {
          onrendered: function(canvas) {
              $scope.canvasFrontImg = canvas.toDataURL("image/png");
          }
      });
      
      html2canvas(document.getElementById("backOfCard"), {
          onrendered: function(canvas) {
              $scope.canvasBackImg = canvas.toDataURL("image/png");
          }
      });
  }
  $scope.saveToCanvasBanner = function() {
      html2canvas(document.getElementById("banner_display"), {
          onrendered: function(canvas) {
              $scope.canvasBanner = canvas.toDataURL("image/png");
          }
      });
  }
  $scope.addToCart = function() {
    var saveCard={
          frontOfCard: $scope.canvasFrontImg,
          backOfCard: $scope.canvasBackImg,
          finish:$scope.finishCard,
          quantity:$scope.quantityCard,
          phoneUpdates:$scope.phoneUpdates,
      }
      localStorage.setItem('CardCart', JSON.stringify(saveCard));
      $location.url("/cart");
  }
  $scope.addToCartBanner = function() {
    var bannerQty=$scope.quantityBanner.split(" ");
    console.log(bannerQty)
    var saveBanner={
          banner:$scope.canvasBanner,
          quantity:bannerQty[0],
          price:bannerQty[1],
          phoneUpdates:$scope.phoneUpdates
      }
      localStorage.setItem('CardCart', JSON.stringify(saveBanner));
      $location.url("/cart");
  }
});
app.controller("cartCtrl", function( $scope, checkoutSrvc, $rootScope) {
   $scope.currentCartItems=JSON.parse(localStorage.getItem('CardCart'));
   console.log($scope.currentCartItems);
   $scope.checkOut=function (item) {
      if($rootScope.currentUser.username) {
          var prodInfo=JSON.parse(localStorage.getItem('CardCart'));
          console.log($rootScope.currentUser)
          var pushCard = {
            user_id: $rootScope.currentUser.username,
            finish: prodInfo.finish,
            quantity: prodInfo.qty,
            frontOfCard:  prodInfo.frontOfCard,
            backOfCard:   prodInfo.backOfCard,
            banner: prodInfo.banner,
            companyId:'lardsCards',
            phoneUpdates: prodInfo.phoneUpdates,
            userEmail: $rootScope.currentUser.username,
            totalPrice: prodInfo.total,
            totalOwed: prodInfo.total,
            nonce: item
          }
          console.log(pushCard);
          checkoutSrvc.checkOut(pushCard)
      } else {
        console.log("Please Log In")
      }
      // 
      
      
  }
    $scope.getKey = function() {
        console.log('test')
        
        checkoutSrvc.getKeys().then(function(key){
          braintree.setup(key.data, "dropin", {
            container: "payment-form",
            onPaymentMethodReceived: function (payload) {
              $scope.checkOut(payload.nonce);
            }
          });
          
        })
        
      }
});

app.service('checkoutSrvc', function($http){
	this.checkOut=function(prodInfo){
		return $http({
			method:"POST",
			url:'/order',
			data: prodInfo
		});
	};
  this.getKeys=function() {
    console.log('hit')
    return $http({
        method:"GET",
			  url:'/client_token',
    })
  }
});
app.controller("adminCtrl", function($scope, adminSrvc, $location) {
    var data = JSON.parse(sessionStorage.getItem('un'));
    if(data === null) {
      return $location.url("/home");
    }
     if(!data.admin) {
      return $location.url("/home");
    }
    adminSrvc.getProducts().then(function(res) {
      $scope.orders=res
    })

    $scope.updateOrder=function(id, ord){
      var updated={
			id:id,
			updatedProd:ord
		};
      adminSrvc.putProducts(updated).then(function(res){
        $scope.orders=res;
      })
    }
    $scope.addManagementOrder=function(){
        adminSrvc.postProducts($scope.managementOrder).then(function(res){
        console.log(res)
      })
    }
    $scope.addStoreInfo=function(){
        adminSrvc.postStoreInfo($scope.storeInfo).then(function(res){
        console.log(res)
      })
    }
    $scope.getOrdersOwedOn=function(){
      adminSrvc.getProducts().then(function(res) {
        var ard=[];
        for(var i = 0; i < res.length; i++) {
          
          if (res[i].totalPrice - res[i].amountPaid != 0 && res[i].totalPrice) {
            ard.push(res[i])
          }
        };
        $scope.orders= ard
      })
    }
    $scope.getAllOrders=function(){
      adminSrvc.getProducts().then(function(res) {
      $scope.orders=res
    })
    }
});
app.service("adminSrvc", function($http, $q){
  console.log(sessionStorage.getItem('user'))
  this.getProducts=function(){
		var deferred=$q.defer();
		$http({
			method:"GET",
			url:'/order'
		}).then(
			function(res){
				var products=res.data;
				deferred.resolve(products);
			})		
		return deferred.promise;
	};
  this.putProducts=function(ord){
		var deferred=$q.defer();
		$http({
			method:"PUT",
			url:'/order',
      data: ord,
		}).then(
			function(res){
				var products=res.data;
				deferred.resolve(products);
			})		
		return deferred.promise;
	};
  this.postProducts=function(ord){
		var deferred=$q.defer();
		$http({
			method:"POST",
			url:'/order',
      data: ord,
		}).then(
			function(res){
				var products=res.data;
				deferred.resolve(products);
			})		
		return deferred.promise;
	};
  this.getStoreInfo=function(ord){
		var deferred=$q.defer();
		$http({
			method:"GET",
			url:'/storeInfo',
		}).then(
			function(res){
				var products=res.data;
				deferred.resolve(products);
			})		
		return deferred.promise;
	};
  this.postStoreInfo=function(info){
		var deferred=$q.defer();
		$http({
			method:"POST",
			url:'/storeInfoRel',
      data: info,
		}).then(
			function(res){
				var products=res.data;
				deferred.resolve(products);
			})		
		return deferred.promise;
	};
})
