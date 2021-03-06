angular.module('starter.directive', [])
  .directive('hideTabs', function ($rootScope) {  //隐藏底部tabs指令
    return {
      restrict: 'AE',
      link: function ($scope) {
        $rootScope.hideTabs = 'tabs-item-hide';
        //监听$destory事件,这个事件会在页面发生跳转的时候触发
        $scope.$on('$destroy', function () {
          $rootScope.hideTabs = ' ';
        })
      }
    }
  })
  .directive('hideShow', function () {  //点击触发显示隐藏元素指令
    return {
      restrict: 'AE',
      link: function (scope, element, attrs) {
        scope.showme = false;
        scope.showme1 = false;
        scope.showme2 = false;
        scope.showme3 = false;
        scope.toggle = function (arg) {//每次点击调用此方法都让scope.showme值反转1次
          if (arg == 0) {
            scope.showme = !scope.showme;
          }
          if (arg == 1) {
            scope.showme1 = !scope.showme1;
          }
          if (arg == 2) {
            scope.showme2 = !scope.showme2;
          }
          if (arg == 3) {
            scope.showme3 = !scope.showme3;
          }
        }
      }
    }
  })
  .directive('scrollTop', function ($ionicScrollDelegate) {//返回顶部指令
    return {
      restrict: 'AE',
      link: function (scope, element, attrs) {
        scope.scrollTop = function () {
          $ionicScrollDelegate.scrollTop(500);
        };
      }
    }
  })
  .directive('toolTip', [function () { //提示框tooltip

    return {
      restrict: 'EA',
      templateUrl: 'templates/popover/tooltip.html',
      scope: {
        message: "=",
        type: "="
      },
      link: function (scope, element, attrs) {

      }
    };
  }])
  .directive('checkForm', function ($rootScope, CommonService) {//验证表单类型 提示
    $rootScope.verifyarray = [];
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        $rootScope.commonService = CommonService;
        $rootScope.verifyarray = [];
        $rootScope.verify = true;
        $rootScope.verifyarray[scope.$id] = true;
        scope.publicCheckForm = function (regular, value, content, isshowtip) { //验证公共部分封装
          if (regular) {
            if (value == 0) {
              $rootScope.verifyarray[scope.$id] = false;
              $rootScope.verify = false;
              return;
            }
            $rootScope.verifyarray[scope.$id] = true;
            $rootScope.verify = true;
            angular.forEach($rootScope.verifyarray, function (item, index) {
              if (!item) {
                $rootScope.verify = false;
              }
            });
          } else {
            if (value || value == 0) {
              if (isshowtip) {
                $rootScope.commonService.toolTip(content, '');
              }
              $rootScope.verifyarray[scope.$id] = false;
              $rootScope.verify = false;
            }
            if (!attrs.required && value == null) {//非必填项 清空不验证
              $rootScope.verifyarray[scope.$id] = true;
              $rootScope.verify = true;
              angular.forEach($rootScope.verifyarray, function (item) {
                if (!item) {
                  $rootScope.verify = false;
                }
              });
            }
          }
        }
        scope.checkForm = function (value, content, type, regular, isShow, maxvalue) {
          var isShow = isShow || true;
          if (type == 'regular') {//自定义正则验证
            scope.publicCheckForm(eval(regular).test(value), value, content, isShow)
          }
          if (type == 'mobilephone') {//验证手机号
            scope.publicCheckForm(/^1(3|4|5|7|8)\d{9}$/.test(value), value, content, isShow)
          }
          if (type == 'phoneandtel') {//验证手机号和电话
            if(!value){
              return;
            }
            RegExp = /^((0[1-9]\d{1,2}\d{7,8})|(1[3584]\d{9})|(400|800)\d{7,9})$/;
            scope.publicCheckForm(RegExp.test(value), value, content, isShow)
          }
          if (type == 'maxvalue') {//最大不能超过maxvalue值
            scope.publicCheckForm(value > 0 && value <= maxvalue, value, content, isShow);
          }
          if (type == 'positivenumber') {//正数验证(如 价格)
            scope.publicCheckForm(/^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/.test(value), value, content, isShow)
          }
          if (type == 'positiveinteger') {//正整数
            scope.publicCheckForm(/^[1-9]\d*$/.test(value), value, content, isShow);
          }
          if (type == 'identitycard') {//验证身份证号
            scope.publicCheckForm(/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value), value, content, isShow)
          }
          if (type == 'maxvaule' && regular == '提现') {
            if (value > maxvalue) {
              scope.publicCheckForm('', 0, content, isShow);
            } else if (value <= 0) {
              scope.publicCheckForm(false, 0, "提现金额必须为正数！", isShow);
            } else {
              scope.publicCheckForm(true, value, "", false);
            }

          }
        };

        scope.checkAtLeastOne = function (array, keystr) {  //检测相同遍历数据至少填写一个
          $rootScope.verifyLeastOne = false;
          angular.forEach(array, function (item) {
            if (item[keystr]) {
              $rootScope.verifyLeastOne = true;
            }
          })
        }

        scope.checkAtLeastOneIsSame = function (array, keystr1, keystr2) {  //两个数据 每种品类至少填写一个数据
          var checkAtLeastOneIsSame = [];//每条记录的验证true false
          angular.forEach(array, function (item, index) {
            if (item.checked) {
              checkAtLeastOneIsSame[index] = false;
              angular.forEach(item.details, function (items) {
                if (items[keystr1] || items[keystr2]) {
                  checkAtLeastOneIsSame[index] = true;
                }
              })
            }

          })
          $rootScope.checkAtLeastOneIsSame = checkAtLeastOneIsSame.indexOf(false) == -1 ? true : false; //有一个类别是false就是false

        }
      }
    }
  })
  .directive('repeatFinish', function () { //利用angular指令监听ng-repeat渲染完成后执行脚本
    return {
      link: function (scope, element, attrs) {
        if (scope.$last) {                   // 这个判断意味着最后一个 OK
          scope.$eval(attrs.repeatFinish)    // 执行绑定的表达式
        }
      }
    }
  })
