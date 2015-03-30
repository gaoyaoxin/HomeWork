/**
 * 主配置文件
 */
(function () {

    'use strict';

    angular.module('home', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'restangular', 'ui.router', 'ui.tree', 'ngMaterial', 'ngMessages', 'angular-datepicker', 'textAngular', 'ui.router.stateHelper'])
        .config(['RestangularProvider', '$urlRouterProvider', 'stateHelperProvider', '$mdThemingProvider', 'Theme', 'Router', 'Config', configProvider])
        .run(runConfig);

    /**
     *
     * @param RestangularProvider
     * @param $urlRouterProvider
     * @param stateHelperProvider
     * @param $mdThemingProvider
     * @param Theme
     * @param Router
     */
    function configProvider(RestangularProvider, $urlRouterProvider, stateHelperProvider, $mdThemingProvider, Theme, Router, Config) {
        /**
         * 主题
         */
        //angular.forEach(Theme.palettes, function (palette, name) {
        //    $mdThemingProvider.definePalette(name, palette);
        //});
        //angular.forEach(Theme.themes, function (theme) {
        //    $mdThemingProvider.theme(theme.name).primaryPalette(theme.primaryPalette);
        //});

        //配置路由
        angular.forEach(Router, function (router, key) {
            stateHelperProvider.state(router);
        });
        $urlRouterProvider.otherwise('/');

        if (Config.Urls.RestUrl) {
            RestangularProvider.setDefaultHttpFields({
                'withCredentials': true
            });
            RestangularProvider.setBaseUrl(Config.Urls.RestUrl);
        }
    }

    runConfig.$inject = ['$rootScope', 'Config', '$previousState', 'Restangular', 'AuthFactory', 'RestInterceptor', '$state', '$log'];
    function runConfig($rootScope, Config, $previousState, Restangular, AuthFactory, RestInterceptor, $state, $log) {
        //与登陆与验证有关的初始化
        $rootScope.toLogin = function () {
            $state.go('login');
        };
        $rootScope.isSelf = function (id) {
            return $rootScope.userId === id;
        };
        $rootScope.quit = AuthFactory.quit;


        //Restangular的拦截器初始化
        Restangular.addResponseInterceptor(RestInterceptor.responseInterceptor);
        Restangular.addFullRequestInterceptor(RestInterceptor.fullRequestInterceptor);
        Restangular.setErrorInterceptor(RestInterceptor.errorInterceptor);

        //拦截地址重定向的开始与完成事件
        $rootScope.$on('$locationChangeStart', function () {
            $log.info('开始验证');
            AuthFactory.auth().then(function () {
                $log.info('验证成功')
            }).catch(function () {
                $log.info('验证失败');
            });
        });
        $rootScope.$on('$locationChangeSuccess', function () {
            $log.info('加载完成');
        });

        //初始化前一个状态的信息
        $rootScope.$previousState = $previousState;
        $rootScope.back = function () {
            $previousState.go();
        };
        $rootScope.Config = Config;
        $rootScope.dateOptions = Config.dateOptions[0];
    }
})();

/**
 * 创建人：pengchao
 * 创建时间：2015-3-27-0027
 * 工厂名字：Runtime
 * 作用：运行时Rest接口
 */
(function () {
    'use strict';

    angular.module('home').factory('RuntimeRest', RuntimeRest);

  RuntimeRest.$inject = ['$log', 'Config','Restangular'];

    function RuntimeRest($log, Config,Restangular) {
        //接口定义
      var factory = Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl((Config.Urls.RestUrl || '') + 'runtime');
      });
        activate();
        return factory;

        ////////////////////////////////////////////////
        ////////////下面为私有函数定义////////////////////
        ////////////////////////////////////////////////

        /**
         * 启动逻辑逻辑
         */
        function activate() {
          $log.info('加载Runtime');
        }
    }

})();

/**
 * 创建人：pengchao
 * 创建时间：2015-3-27-0027
 * 工厂名字：Runtime
 * 作用：运行时管理工厂
 */
(function () {
    'use strict';

    angular.module('home').factory('Runtime', Runtime);

    Runtime.$inject = ['$log', 'Config'];

    function Runtime($log, Config) {
        //接口定义
        var factory = {};
        factory.registerCallback = registerCallback;


        var callbacks = {};
        activate();
        return factory;

        ////////////////////////////////////////////////
        ////////////下面为私有函数定义////////////////////
        ////////////////////////////////////////////////

        /**
         * 启动逻辑逻辑
         */
        function activate() {
            log.info('加载Runtime');
        }

        /**
         * 注册回调函数
         * @param id  需要监听的事件
         * @param callback 回调函数
         */
        function registerCallback(id, callback) {
            if (!callbacks[id]) {
                callbacks[id] = [];
            }
            callbacks[id].push(callback);
        }

        /**
         * 发送一个事件通知
         * @param id 事件ID
         */
        function notify(id) {
            var calls = callbacks[id];
            if (!calls) {
                return;
            }
            angular.forEach(calls, function (call) {
                call();
            });
        }
    }

})();

/**
 * 创建人：pengchao
 * 创建时间：2015-3-27-0027
 * 工厂名字：Repository
 * 作用：流程仓库的Rest工厂
 */
(function () {
    'use strict';

    angular.module('home').factory('RepositoryRest', RepositoryRest);

    RepositoryRest.$inject = ['$log', 'Config', 'Restangular'];

    function RepositoryRest($log, Config,Restangular) {
        //接口定义
        var factory = Restangular.withConfig(function(RestangularConfigurer) {
          RestangularConfigurer.setBaseUrl((Config.Urls.RestUrl || '') + 'repository');
        });
        activate();
        return factory;

        ////////////////////////////////////////////////
        ////////////下面为私有函数定义////////////////////
        ////////////////////////////////////////////////

        /**
         * 启动逻辑逻辑
         */
        function activate() {
          $log.info('加载Repository');
        }
    }

})();

/**
 * 创建人：pengchao
 * 创建时间：2015-3-27-0027
 * 工厂名字：Repository
 * 作用：仓库管理工厂
 */
(function () {
    'use strict';

    angular.module('home').factory('Repository', Repository);

    Repository.$inject = ['$log', 'Config','RepositoryRest'];

    function Repository($log, Config,RepositoryRest) {
        var models;
        //接口定义
        var factory = {};
        factory.Models = RepositoryRest.service(Config.Names.models);
        factory.getModels = getModels;
        factory.deployModel = deployModel;
        factory.createModel = createModel;

        activate();
        return factory;

        ////////////////////////////////////////////////
        ////////////下面为私有函数定义////////////////////
        ////////////////////////////////////////////////

        /**
         * 启动逻辑逻辑
         */
        function activate() {
            $log.info('加载Repository');
        }

        function getModels(param) {
            models = RepositoryRest.all(Config.Names.models).getList();
            return models.$object;
        }

        function deployModel(model) {
            return RepositoryRest.one(Config.Names.deployments, model.id).post();
        }

        function createModel(model) {
            return models.post(model);
        }
    }

})();

/**
 * 创建人：pengchao
 * 创建时间：2015-3-23-0023
 * 工厂名字：ModelFactory
 * 作用：管理流程模型的工厂
 */
(function () {
    'use strict';

    angular.module('home').factory('Model', Model);

    Model.$inject = ['$log', 'Config', 'RepositoryRest'];

    function Model($log, Config, RepositoryRest) {
        //接口定义
        return RepositoryRest.service(Config.Names.models);
    }

})();

/**
 * 创建人：pengchao
 * 创建时间：2015-3-27-0027
 * 工厂名字：History
 * 作用：历史rest管理器
 */
(function () {
  'use strict';

  angular.module('home').factory('HistoryRest', HistoryRest);

  HistoryRest.$inject = ['$log', 'Config', 'Restangular'];

  function HistoryRest($log, Config, Restangular) {
    //接口定义
    var factory = Restangular.withConfig(function (RestangularConfigurer) {
      RestangularConfigurer.setBaseUrl((Config.Urls.RestUrl || '') + 'history');
    });
    activate();
    return factory;

    ////////////////////////////////////////////////
    ////////////下面为私有函数定义////////////////////
    ////////////////////////////////////////////////

    /**
     * 启动逻辑逻辑
     */
    function activate() {
      $log.info('加载History');
    }
  }

})();

/**
 * 创建人：pengchao
 * 创建时间：2015-3-27-0027
 * 工厂名字：History
 * 作用：历史管理工厂
 */
(function () {
    'use strict';

    angular.module('home').factory('History', History);

    History.$inject = ['$log', 'Config'];

    function History($log, Config) {
        //接口定义
        var factory = {};
        factory.registerCallback = registerCallback;


        var callbacks = {};
        activate();
        return factory;

        ////////////////////////////////////////////////
        ////////////下面为私有函数定义////////////////////
        ////////////////////////////////////////////////

        /**
         * 启动逻辑逻辑
         */
        function activate() {
            log.info('加载History');
        }

        /**
         * 注册回调函数
         * @param id  需要监听的事件
         * @param callback 回调函数
         */
        function registerCallback(id, callback) {
            if (!callbacks[id]) {
                callbacks[id] = [];
            }
            callbacks[id].push(callback);
        }

        /**
         * 发送一个事件通知
         * @param id 事件ID
         */
        function notify(id) {
            var calls = callbacks[id];
            if (!calls) {
                return;
            }
            angular.forEach(calls, function (call) {
                call();
            });
        }
    }

})();

/**
 * �����ˣ�pengchao
 * ����ʱ�䣺2015-3-27-0027
 * �������֣�Deployment
 * ���ã�����
 */
(function () {
    'use strict';

    angular.module('home').factory('Deployment', Deployment);

    Deployment.$inject = ['$log', 'Config', 'RepositoryRest'];

    function Deployment($log, Config, RepositoryRest) {
        //�ӿڶ���
        return RepositoryRest.service(Config.Names.deployments);
    }

})();
/**
 * �����ˣ�pengchao
 * ����ʱ�䣺2015-3-27-0027
 * �������֣�Deployment
 * ���ã�����
 */
(function () {
    'use strict';

    angular.module('home').factory('Definitions', Definitions);

    Definitions.$inject = ['$log', 'Config', 'RepositoryRest'];

    function Definitions($log, Config, RepositoryRest) {
        //�ӿڶ���
        return RepositoryRest.service(Config.Names.processDef);
    }

})();
/**
 * 创建人：pengchao
 * 创建时间：2015-3-27-0027
 * 工厂名字：RestInterceptor
 * 作用：Restangular拦截器工厂
 */
(function () {
  'use strict';

  angular.module('home').factory('RestInterceptor', RestInterceptor);

  RestInterceptor.$inject = ['$log', 'Config'];

  function RestInterceptor($log, Config) {
    //接口定义
    var factory = {};
    factory.fullRequestInterceptor = fullRequestInterceptor;
    factory.responseInterceptor = responseInterceptor;
    factory.errorInterceptor = errorInterceptor;
    activate();
    return factory;

    ////////////////////////////////////////////////
    ////////////下面为私有函数定义////////////////////
    ////////////////////////////////////////////////

    /**
     * 启动逻辑逻辑
     */
    function activate() {
      $log.info('加载RestInterceptor');
    }

    function fullRequestInterceptor(element, operation, route, url, headers, params, httpConfig) {
      return {
        element: element,
        headers: headers,
        params: params,
        httpConfig: httpConfig
      };
    }

    function responseInterceptor(data, operation, what, url, response, deferred) {
      var header = data.header;
      var model = data.data;
      if (header && header.rc === 0) {
        return model;
      } else {
        if (header) {
          deferred.reject(header);
        } else {
          deferred.reject(response);
        }
      }
    }

    function errorInterceptor(response, deferred, responseHandler) {
      return true;
    }
  }

})();

var module = angular.module('home');

module.directive('menuToggle', function () {
  return {
    scope: {
      section: '='
    },
    templateUrl:'components/directive/menuToggle/menu-toggle.tmpl.html',
    link:function($scope,$element) {
      var controller = $element.parent().controller();

      $scope.isOpen = function () {
        return controller.isOpen($scope.section);
      };

      $scope.toggle = function () {
        controller.toggleOpen($scope.section);
      };

      var parentNode = $element[0].parentNode.parentNode.parentNode;
      if(parentNode.classList.contains("parent-list-item")) {
        var heading = parentNode.querySelector('h2');
        $element[0].firstChild.setAttribute('aria-describedby', heading.id);
      }
    }
  };
});

/**
 *
 * @type {module}
 */

var module = angular.module('home');


module.directive('menuLink', function () {
  return {
    scope: {
      section: '='
    },
    templateUrl: 'components/directive/menuLink/menu-link.tmpl.html',
    link: function ($scope, $element) {
      var controller = $element.parent().controller();

      $scope.isSelected = function () {
        return controller.isSelected($scope.section);
      };

      $scope.focusSection = function (section,event) {
        controller.autoFocusContent = true;
        controller.goSelect(section,event);
      };
    }
  };
});


/**
 * 登陆的factory
 */
(function () {
  'use strict';

  angular.module('home').service("$previousState", previousStateService);
  previousStateService.$inject = ['$rootScope', '$state'];
  function previousStateService($rootScope, $state) {
    var previous = null;
    var memos = {};

    var lastPrevious = null;

    $rootScope.$on("$stateChangeStart", function (evt, toState, toStateParams, fromState, fromStateParams) {
      lastPrevious = previous;
      previous = {state: fromState, params: fromStateParams};
    });

    $rootScope.$on("$stateChangeError", function () {
      previous = lastPrevious;
      lastPrevious = null;
    });

    $rootScope.$on("$stateChangeSuccess", function () {
      lastPrevious = null;
    });

    var $previousState = {
      get: function (memoName) {
        return memoName ? memos[memoName] : previous;
      },
      go: function (memoName) {
        var to = $previousState.get(memoName);
        return $state.go(to.state, to.params)
      },
      memo: function (memoName) {
        memos[memoName] = previous;
      }
    };

    return $previousState;
  }
})();

/**
 * 创建人：pengchao
 * 创建时间：2015-3-23-0023
 * 工厂名字：userName
 * 作用：将个人ID转换成名字输出
 */
(function () {
  'use strict';

  angular.module('home').filter('userName', userNameFilter);

  userNameFilter.$inject = ['AuthFactory', 'UserFactory'];

  function userNameFilter(AuthFactory, UserFactory) {
    return userNameFilterImpl;

    function userNameFilterImpl(value) {
      var val = value || AuthFactory.loginID;
      var len = val.indexOf('@');
      if (len !== -1) {
        val = val.substr(0, len);
      }
      return UserFactory.findUserById(val).name;
    }
  }
})();


/**
 * 创建人：pengchao
 * 创建时间：2015-3-24-0024
 * 工厂名字：userItem
 * 作用：用户项过滤器
 */
(function(){
    'use strict';

    angular.module('home').filter('userItem', userItemFilter);

    userItemFilter.$inject=[];

    function userItemFilter(){
        return userItemFilterImpl;

        function userItemFilterImpl(user){
          if(!user){
            return '';
          }
          var space = "     ";
          return user.name + space + user.sex === 0 ? '男' : '女' + space +  (new Date().getYear() - new Date(user.birthday).getYear()) + "岁" + space + user.nation + space + user.school + space + user.professional + space + user.telephone;
        }
    }
})();


/**
 * 创建人：pengchao
 * 创建时间：2015-3-23-0023
 * 工厂名字：trustHtml
 * 作用：将一般字符串转换成html信任域的字符串
 */
(function(){
    'use strict';

    angular.module('home').filter('trustHtml', trustHtmlFilter);

    trustHtmlFilter.$inject=['$sce'];

    function trustHtmlFilter($sce){
        return trustHtmlFilterImpl;

        function trustHtmlFilterImpl(value){
          value = value || "<p>未填写</p>";
          return $sce.trustAsHtml(value);
        }
    }
})();

/**
 * 创建人：pengchao
 * 创建时间：2015-3-23-0023
 * 工厂名字：shaImg
 * 作用：将图片Sha1码转换成地址
 */
(function () {
  'use strict';

  angular.module('home').filter('shaImg', shaImgFilter);

  shaImgFilter.$inject = ['Config'];

  function shaImgFilter(Config) {
    return shaImgFilterImpl;

    function shaImgFilterImpl(value) {
      if(!value) {
        return 'assets/images/img/face.jpg';
      }
      value = value || '';
      return Config.Urls.fileUrl + value;
    }
  }
})();


/**
 * 创建人：pengchao
 * 创建时间：2015-3-23-0023
 * 工厂名字：sex
 * 作用：性别过滤器
 */
(function(){
    'use strict';

    angular.module('home').filter('sex', sexFilter);

    sexFilter.$inject=[];

    function sexFilter(){
        return sexFilterImpl;

        function sexFilterImpl(value){
          return value === 1 ? "女" : "男";
        }
    }
})();


/**
 * 创建人：pengchao
 * 创建时间：2015-3-23-0023
 * 工厂名字：postType
 * 作用：岗位类型过滤器
 */
(function(){
    'use strict';

    angular.module('home').filter('postType', postTypeFilter);

    postTypeFilter.$inject=['UserFactory'];

    function postTypeFilter(UserFactory){
        return postTypeFilterImpl;

        function postTypeFilterImpl(value){
          if (!value) {
            return '未设置';
          }
          var type = UserFactory.postTypeMap[value] || {name: '岗位类型未初始化'};
          return type.name;
        }
    }
})();

/**
 * 创建人：pengchao
 * 创建时间：2015-3-23-0023
 * 工厂名字：postLevel
 * 作用：岗位等级过滤器
 */
(function () {
  'use strict';

  angular.module('home').filter('postLevel', postLevelFilter);

  postLevelFilter.$inject = ['UserFactory'];

  function postLevelFilter(UserFactory) {
    return postLevelFilterImpl;

    function postLevelFilterImpl(value) {
      if (!value) {
        return '未设置';
      }
      var type = UserFactory.postLevelMap[value] || {name: '岗位级别未初始化'};
      return type.name;
    }
  }
})();

/**
 * 创建人：pengchao
 * 创建时间：2015-3-23-0023
 * 工厂名字：noticeType
 * 作用：通知类型过滤器
 */
(function () {
  'use strict';

  angular.module('home').filter('noticeType', noticeTypeFilter);

  noticeTypeFilter.$inject = ['Config'];

  function noticeTypeFilter(Config) {
    return noticeTypeFilterImpl;


    function noticeTypeFilterImpl(value) {
      value = value || 1;
      return Config.NoticeTypes[value - 1].name;
    }
  }
})();


/**
 * 创建人：pengchao
 * 创建时间：2015-3-23-0023
 * 工厂名字：nospace
 * 作用：将空值使用''并且去掉左右空格的过滤器
 */
(function(){
    'use strict';

    angular.module('home').filter('nospace', nospaceFilter);

    nospaceFilter.$inject=[];

    function nospaceFilter() {
      return nospaceFilterImpl;


      function nospaceFilterImpl(value) {
        return (!value) ? '' : value.replace(/ /g, '');
      }
    }
})();


/**
 * 创建人：pengchao
 * 创建时间：2015-3-23-0023
 * 工厂名字：newType
 * 作用：新闻类型过滤器
 */
(function(){
    'use strict';

    angular.module('home').filter('newType', newTypeFilter);

    newTypeFilter.$inject=['Config'];

    function newTypeFilter(Config){
        return newTypeFilterImpl;

        function newTypeFilterImpl(value){
          value = value || 1;
          return Config.NewsTypes[value - 1].name;
        }
    }
})();

/**
 * 创建人：pengchao
 * 创建时间：2015-3-27-0027
 * 工厂名字：modelEdit
 * 作用：跳转到模型编辑
 */
(function () {
    'use strict';

    angular.module('home').filter('modelEdit', modelEditFilter);

    modelEditFilter.$inject = ['Config'];

    function modelEditFilter(Config) {
        return modelEditFilterImpl;

        function modelEditFilterImpl(value) {
          return Config.Urls.RestUrl + "workflow/modeler.html?modelId=" + value;
        }
    }
})();

/**
 * 创建人：pengchao
 * 创建时间：2015-3-24-0024
 * 工厂名字：humanizeDoc
 * 作用：
 */
(function () {
  'use strict';

  angular.module('home').filter('humanizeDoc', humanizeDocFilter);

  humanizeDocFilter.$inject = [];

  function humanizeDocFilter() {
    return humanizeDocFilterImpl;

    function humanizeDocFilterImpl(doc) {
      if (!doc) return;
      if (doc.type === 'directive') {
        return doc.name.replace(/([A-Z])/g, function ($1) {
          return '-' + $1.toLowerCase();
        });
      }
      return doc.label || doc.name;
    }
  }
})();

/**
 * 创建人：pengchao
 * 创建时间：2015-3-23-0023
 * 工厂名字：department
 * 作用：通过部门id显示部门名称或者部门路径
 */
(function () {
  'use strict';

  angular.module('home').filter('department', departmentFilter);

  departmentFilter.$inject = ['UserFactory'];

  function departmentFilter(UserFactory) {
    return departmentFilterImpl;

    /**
     * 过滤器实现
     * @param value     原始值
     * @param param     参数 plain是默认的，表示只显示本省，tree代表显示整个部门路径
     * @param space     间隔 两个部门之间的间隔是什么
     * @returns {string} 过滤后的值
     */
    function departmentFilterImpl(value, param, space) {
      param = param || 'plain';
      value = value || '0';
      space = space || ' ';
      if (param === 'plain') {
        var dep = UserFactory.findDepartmentById(value);
        return dep.name;
      } else if (param === 'tree') {
        var deps = UserFactory.findDepartmentsById(value);
        var result = '';
        for (var i = 0; i < deps.length; i++) {
          result += deps[i].name;
          if (i !== deps.length - 1) {
            result += space;
          }
        }
        return result;
      }
    }
  }
})();

/**
 * 创建人：pengchao
 * 创建时间：2015-3-23-0023
 * 工厂名字：default
 * 作用：将空值使用'未填写'或者默认值并且去掉左右空格的过滤器
 */
(function () {
  'use strict';

  angular.module('home').filter('default', defaultFilter);

  defaultFilter.$inject = [];

  function defaultFilter() {
    return defaultFilterImpl;


    function defaultFilterImpl(value, def) {
      def = def || "未填写";
      if (!angular.isString(value)) {
        return (!value) ? def : value;
      }
      return (!value) ? def : value.replace(/ /g, '');
    }
  }
})();


/**
 * 创建人：pengchao
 * 创建时间：2015-3-23-0023
 * 工厂名字：dayAge
 * 作用：将日期转换成日期 岁数的形式
 */
(function(){
    'use strict';

    angular.module('home').filter('dayAge', dayAgeFilter);

    dayAgeFilter.$inject=['$filter'];

    function dayAgeFilter($filter){
        return dayAgeFilterImpl;

      /**
       * 过滤器实现
       * @param value     原始值
       * @returns {string} 过滤后的值
       */
        function dayAgeFilterImpl(value){
          var date;
          if (!value) {
            return "未填写";
          } else {
            date = new Date(value);
          }
          return $filter('date')(date, 'yyyy年MM月dd日') + "   " + (new Date().getYear() - date.getYear()) + "岁";
        }
    }
})();

/**
 * 创建人：pengchao
 * 创建时间：2015-3-23-0023
 * 工厂名字：md5Factory
 * 作用：md5码工厂
 */
(function () {
  'use strict';

  angular.module('home').factory('md5Factory', md5Factory);

  md5Factory.$inject = ['$log', 'Config'];

  function md5Factory($log, Config) {
    //接口定义
    var factory = md5;

    activate();
    return factory;

    ////////////////////////////////////////////////
    ////////////下面为私有函数定义////////////////////
    ////////////////////////////////////////////////

    /**
     * 启动逻辑逻辑
     */
    function activate() {
      $log.info('加载md5Factory');
    }


    /**
     * 产生MD5码
     * @param string 需要产生md5的字符串
     * @param key    关键字
     * @param raw    原始串
     * @returns {*}  md5码值
     */
    function md5(string, key, raw) {
      if (!key) {
        if (!raw) {
          return hex_md5(string);
        }
        return raw_md5(string);
      }
      if (!raw) {
        return hex_hmac_md5(key, string);
      }
      return raw_hmac_md5(key, string);
    }

    /*
     * Take string arguments and return either raw or hex encoded strings
     */
    function raw_md5(s) {
      return rstr_md5(str2rstr_utf8(s));
    }

    function hex_md5(s) {
      return rstr2hex(raw_md5(s));
    }

    function raw_hmac_md5(k, d) {
      return rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d));
    }

    function hex_hmac_md5(k, d) {
      return rstr2hex(raw_hmac_md5(k, d));
    }

    /*
     * Encode a string as utf-8
     */
    function str2rstr_utf8(input) {
      return unescape(encodeURIComponent(input));
    }

    /*
     * Convert a raw string to a hex string
     */
    function rstr2hex(input) {
      var hex_tab = '0123456789abcdef',
        output = '',
        x,
        i;
      for (i = 0; i < input.length; i += 1) {
        x = input.charCodeAt(i);
        output += hex_tab.charAt((x >>> 4) & 0x0F) +
        hex_tab.charAt(x & 0x0F);
      }
      return output;
    }

    /*
     * Calculate the HMAC-MD5, of a key and some data (raw strings)
     */
    function rstr_hmac_md5(key, data) {
      var i,
        bkey = rstr2binl(key),
        ipad = [],
        opad = [],
        hash;
      ipad[15] = opad[15] = undefined;
      if (bkey.length > 16) {
        bkey = binl_md5(bkey, key.length * 8);
      }
      for (i = 0; i < 16; i += 1) {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5C5C5C5C;
      }
      hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
      return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
    }

    /*
     * Calculate the MD5 of a raw string
     */
    function rstr_md5(s) {
      return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
    }

    /*
     * Convert a raw string to an array of little-endian words
     * Characters >255 have their high-byte silently ignored.
     */
    function rstr2binl(input) {
      var i,
        output = [];
      output[(input.length >> 2) - 1] = undefined;
      for (i = 0; i < output.length; i += 1) {
        output[i] = 0;
      }
      for (i = 0; i < input.length * 8; i += 8) {
        output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
      }
      return output;
    }

    /*
     * Convert an array of little-endian words to a string
     */
    function binl2rstr(input) {
      var i,
        output = '';
      for (i = 0; i < input.length * 32; i += 8) {
        output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
      }
      return output;
    }

    /*
     * Calculate the MD5 of an array of little-endian words, and a bit length.
     */
    function binl_md5(x, len) {
      /* append padding */
      x[len >> 5] |= 0x80 << (len % 32);
      x[(((len + 64) >>> 9) << 4) + 14] = len;

      var i, olda, oldb, oldc, oldd,
        a = 1732584193,
        b = -271733879,
        c = -1732584194,
        d = 271733878;

      for (i = 0; i < x.length; i += 16) {
        olda = a;
        oldb = b;
        oldc = c;
        oldd = d;

        a = md5_ff(a, b, c, d, x[i], 7, -680876936);
        d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
        c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
        b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
        a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
        d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
        c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
        b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
        a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
        d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
        c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
        b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
        a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
        d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
        c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
        b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

        a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
        d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
        c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
        b = md5_gg(b, c, d, a, x[i], 20, -373897302);
        a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
        d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
        c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
        b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
        a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
        d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
        c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
        b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
        a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
        d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
        c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
        b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

        a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
        d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
        c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
        b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
        a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
        d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
        c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
        b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
        a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
        d = md5_hh(d, a, b, c, x[i], 11, -358537222);
        c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
        b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
        a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
        d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
        c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
        b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

        a = md5_ii(a, b, c, d, x[i], 6, -198630844);
        d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
        c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
        b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
        a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
        d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
        c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
        b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
        a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
        d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
        c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
        b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
        a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
        d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
        c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
        b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
      }
      return [a, b, c, d];
    }

    /*
     * These functions implement the four basic operations the algorithm uses.
     */
    function md5_cmn(q, a, b, x, s, t) {
      return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
    }

    function md5_ff(a, b, c, d, x, s, t) {
      return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }

    function md5_gg(a, b, c, d, x, s, t) {
      return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }

    function md5_hh(a, b, c, d, x, s, t) {
      return md5_cmn(b ^ c ^ d, a, b, x, s, t);
    }

    function md5_ii(a, b, c, d, x, s, t) {
      return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    /*
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
     * to work around bugs in some JS interpreters.
     */
    function safe_add(x, y) {
      var lsw = (x & 0xFFFF) + (y & 0xFFFF),
        msw = (x >> 16) + (y >> 16) + (lsw >> 16);
      return (msw << 16) | (lsw & 0xFFFF);
    }

    /*
     * Bitwise rotate a 32-bit number to the left.
     */
    function bit_rol(num, cnt) {
      return (num << cnt) | (num >>> (32 - cnt));
    }
  }

})();

/**
 * 创建人：pengchao
 * 创建时间：2015-3-23-0023
 * 工厂名字：UserFactory
 * 作用：用户管理的工厂
 */
(function () {
  'use strict';

  angular.module('home').factory('UserFactory', UserFactory);

  UserFactory.$inject = ['$log', 'Config', 'Restangular', '$q'];

  function UserFactory($log, Config, Restangular, $q) {
    //接口定义
    var factory = {};
    factory.registerCallback = registerCallback;
    factory.reload = reloadData;
    factory.findUserById = findUserById;
    factory.queryUsersByDep = queryUsersByDep;
    factory.findPositionByDepId = findPositionByDepId;
    factory.findPositionById = findPositionById;
    factory.getPostByDep = getPostByDep;
    factory.depMap = {};
    factory.userMap = {};
    factory.postMap = {};
    factory.postTypeMap = {};
    factory.postLevelMap = {};
    factory.registerCallback = registerCallback;
    factory.findDepartmentById = findDepartmentById;
    factory.findDepartmentsById = findDepartmentsById;
    factory.addDepartment = addDepartment;
    factory.adjustDepTree = adjustDepTree;
    factory.getPostButDep = getPostButDep;
    factory.addDepPost = addDepPost;
    factory.removePost = removePost;

    var callbacks = {};
    activate();
    return factory;

    ////////////////////////////////////////////////
    ////////////下面为私有函数定义////////////////////
    ////////////////////////////////////////////////

    /**
     * 启动逻辑逻辑
     */
    function activate() {
      $q.all([
        Restangular.all('department').getList().then(function (data) {
          factory.departments = data;
        }),
        Restangular.all('position').getList().then(function (data) {
          factory.positions = data;
        }),
        Restangular.all('userinfo').getList().then(function (data) {
          factory.users = data;
        }),
        Restangular.all('posttype').getList().then(function (data) {
          factory.postTypes = data;
        }),
        Restangular.all('postlevel').getList().then(function (data) {
          factory.postLevels = data;
        }),
        Restangular.all('userdeppost').getList().then(function (data) {
          factory.userDepPosts = data;
        }),
        Restangular.all('deppost').getList().then(function (data) {
          factory.depPosts = data;
        })])
        .finally(function () {
          adjustDepTree();
          $log.info('用户信息加载完成');
        });
      $log.info('加载UserFactory');
    }

    /**
     * 重新加载数据
     */
    function reloadData() {
      activate();
    }

    /**
     * 调整树结构
     * @returns {Array}  组织树
     */
    function adjustDepTree() {
      var department, roots = [];
      factory.depMap = {}, factory.userMap = {}, factory.postMap = {}, factory.postTypeMap = {}, factory.postLevelMap = {};
      for (var i = 0; i < factory.departments.length; i++) {
        department = factory.departments[i];
        factory.depMap[department.id] = department;
        department.children = [];
      }

      angular.forEach(factory.postTypes, function (type) {
        factory.postTypeMap[type.id] = type;
      });
      angular.forEach(factory.postLevels, function (level) {
        factory.postLevelMap[level.id] = level;
      });

      angular.forEach(factory.positions, function (post) {
        factory.postMap[post.id] = post;
      });

      for (var i = 0; i < factory.users.length; i++) {
        var user = factory.users[i];
        factory.userMap[user.id] = user;
      }

      for (var i = 0; i < factory.departments.length; i++) {
        department = factory.departments[i];
        if (department.pid !== '0') {
          var parent = factory.depMap[department.pid];
          if (!parent) {
            continue;
          }
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(department);
        }
      }

      angular.forEach(factory.departments, function (dep) {
        if (dep.pid === '0') {
          roots.push(dep);
        }
      });
      factory.depTree = roots;
      notify(Config.Events.UserInitEvent);
      return roots;
    }

    /**
     * 通过用户ID查询用户信息
     * @param id 用户ID
     * @returns {{用户信息}}
     */
    function findUserById(id) {
      return factory.userMap[id];
    }

    /**
     * 查找部门下面的人员
     * @param dep 部门
     * @returns {*} 人员
     */
    function queryUsersByDep(dep) {
      if (!dep || dep.id === '0') {
        return factory.users;
      }
      var items = {};
      var children = depChildren(dep);
      angular.forEach(factory.userDepPosts, function (userDepPost) {
        if (children[userDepPost.depId] && factory.userMap[userDepPost.userId]) {
          items[userDepPost.userId] = factory.userMap[userDepPost.userId];
        }
      });
      var results = [];
      for (var key in items) {
        results.push(items[key]);
      }
      return results;
    }

    /**
     * 组织部门下面的children
     * @param dep 部门
     * @returns {{}} 所有的children
     */
    function depChildren(dep) {
      var results = {};
      var roots = [];
      roots.push(dep);
      while (roots && roots.length > 0) {
        var items = [];
        angular.forEach(roots, function (root) {
          results[root.id] = root;
          if (root.children && root.children.length > 0) {
            items = items.concat(root.children);
          }
        });
        roots = items;
      }
      return results;
    }

    /**
     * 查找部门下面的岗位
     * @param depId 部门ID
     * @returns {Array} 岗位列表
     */
    function findPositionByDepId(depId) {
      var results = [];
      angular.forEach(factory.depPosts, function (depPost) {
        if (depPost.depId === depId) {
          results.push(factory.postMap[depPost.postId]);
        }
      });
      return results;
    }

    /**
     * 通过部门查找岗位
     * @param dep 部门
     * @returns {Array} 包装过后的岗位列表
     */
    function getPostByDep(dep) {
      var results = [];
      if (dep) {
        angular.forEach(factory.depPosts, function (depPost) {
          if (depPost.depId === dep.id) {
            results.push({checked: false, post: factory.postMap[depPost.postId], depPost: depPost});
          }
        });
      }

      return results;
    }

    /**
     * 获取所有的岗位信息，将特定部门下的岗位标识为灰色
     * @param dep 部门
     * @returns {Array} 岗位列表包装
     */
    function getPostButDep(dep) {
      var results = {};
      for (var key in factory.postMap) {
        var position = factory.postMap[key];
        results[key] = {checked: false, disabled: false, post: position};
      }
      if (dep) {
        angular.forEach(factory.depPosts, function (depPost) {
          if (depPost.depId === dep.id) {
            results[depPost.postId].checked = true;
            results[depPost.postId].disabled = true;
            results[depPost.postId].depPost = depPost;
          }
        });
      }
      var dest = [];
      for (var key in results) {
        dest.push(results[key]);
      }
      return dest;
    }

    /**
     * 删除岗位
     * @param post 岗位
     * @returns {jQuery.promise|promise.promise|d.promise|promise|.ready.promise|jQuery.ready.promise|*}
     */
    function removePost(post) {
      var def = $q.defer();
      post.remove()
        .then(function () {
          var index = factory.positions.indexOf(post);
          if (index > -1) factory.positions.splice(index, 1);
          adjustDepTree();
          def.resolve();
        })
        .catch(function (response) {
          def.reject(response);
        });
      return def.promise;
    }

    /**
     * 通过ID查找部门 递归到根节点
     * @param id 部门iD
     * @returns {Array} 列表
     */
    function findDepartmentsById(id) {
      var results = [];
      while (id !== '0') {
        var dep = findDepartmentById(id);
        if(!dep) {
          break;
        }
        results.push(dep);
        id = dep.pid;
      }
      results.reverse();
      return results;
    }

    /**
     * 添加部门岗位关联
     * @param posts 岗位
     * @returns {jQuery.promise|promise.promise|d.promise|promise|.ready.promise|jQuery.ready.promise|*}
     */
    function addDepPost(posts) {
      var defer = $q.defer();
      Restangular.one('deppost').customPOST(posts, 'list')
        .then(function (data) {
          defer.resolve();
          Restangular.all('deppost').getList().then(function (data) {
            factory.depPosts = data;
            adjustDepTree();
          })
        })
        .catch(function (response) {
          defer.reject(response);
        });
      return defer.promise;
    }

    /**
     * 通过id查找岗位
     * @param id id
     * @returns {*} 岗位
     */
    function findPositionById(id) {
      return factory.postMap[id];
    }

    /**
     * 添加部门
     * @param department 部门
     */
    function addDepartment(department) {
      factory.departments.push(department);
      adjustDepTree();
    }

    /**
     * 根据部门ID查找部门
     * @param depId 部门ID
     * @returns {*} 部门
     */
    function findDepartmentById(depId) {
      if (!depId) {
        return null;
      }
      return factory.depMap[depId];
    }

    /**
     * 注册回调函数
     * @param id  需要监听的事件
     * @param callback 回调函数
     */
    function registerCallback(id, callback) {
      if (!callbacks[id]) {
        callbacks[id] = [];
      }
      callbacks[id].push(callback);
    }

    /**
     * 发送一个事件通知
     * @param id 事件ID
     */
    function notify(id) {
      var calls = callbacks[id];
      if (!calls) {
        return;
      }
      angular.forEach(calls, function (call) {
        call();
      });
    }
  }

})();

/**
 * 创建人：pengchao
 * 创建时间：2015-3-23-0023
 * 工厂名字：MenuFactory
 * 作用：主页菜单工厂
 */
(function () {
  'use strict';

  angular.module('home').factory('MenuFactory', MenuFactory);

  MenuFactory.$inject = ['$log', 'Config', 'Restangular', '$q'];

  function MenuFactory($log, Config, Restangular, $q) {
    //接口定义
    var factory = {};
    factory.registerCallback = registerCallback;
    factory.sections = [];
    factory.reload = reload;
    factory.selectPage = selectPage;
    factory.selectSection = function (section) { factory.openedSection = section; };
    factory.toggleSelectSection = function (section) { factory.openedSection = (factory.openedSection === section ? null : section); };
    factory.isSectionSelected = function (section) { return factory.openedSection === section; };
    factory.isPageSelected = function (page) { return factory.currentPage === page; };
    factory.registerCallback = registerCallback;

    var callbacks = {};
    activate();
    return factory;

    ////////////////////////////////////////////////
    ////////////下面为私有函数定义////////////////////
    ////////////////////////////////////////////////

    /**
     * 启动逻辑逻辑
     */
    function activate() {
      $log.info('加载MenuFactory开始...');
      $log.info('加载MenuFactory结束');
    }

    function reload() {
      var deferred = $q.defer();
      Restangular.all('menu').getList()
        .then(function (data) {
          factory.sections = data;
          deferred.resolve(0);
          notify(Config.Events.MenuInit);
        })
        .catch(function (response) {
          deferred.reject();
        });
      return deferred.promise;
    }

    /**
     * 注册回调函数
     * @param id  需要监听的事件
     * @param callback 回调函数
     */
    function registerCallback(id, callback) {
      if (!callbacks[id]) {
        callbacks[id] = [];
      }
      callbacks[id].push(callback);
    }

    /**
     * 发送一个事件通知
     * @param id 事件ID
     */
    function notify(id) {
      var calls = callbacks[id];
      if (!calls) {
        return;
      }
      angular.forEach(calls, function (call) {
        call();
      });
    }

    function selectPage(section, page) {
      page && page.url && $location.path(page.url);
      factory.currectSection = section;
      factory.currentPage = page;
    }
  }

})();

/**
 * 创建人：pengchao
 * 创建时间：2015-3-23-0023
 * 工厂名字：DialogFactory
 * 作用：对话框工厂
 */
(function () {
  'use strict';

  angular.module('home').factory('DialogFactory', DialogFactory);

  DialogFactory.$inject = ['$log', '$mdDialog'];

  function DialogFactory($log, $mdDialog) {
    //接口定义
    var factory = {};
    factory.registerCallback = registerCallback;
    factory.alert = function (txt, ev) {
      return $mdDialog.show($mdDialog.alert().title('注意').content(txt).ok('确定').targetEvent(ev));
    };

    factory.fail = function (txt, ev) {
      return $mdDialog.show($mdDialog.alert().title('错误').content(txt).ok('确定').targetEvent(ev));
    };

    factory.success = function (txt, ev) {
      return $mdDialog.show($mdDialog.alert().title('成功').content(txt).ok('确定').targetEvent(ev));
    };

    var callbacks = {};
    activate();
    return factory;

    ////////////////////////////////////////////////
    ////////////下面为私有函数定义////////////////////
    ////////////////////////////////////////////////

    /**
     * 启动逻辑逻辑
     */
    function activate() {
      $log.info('加载DialogFactory');
    }

    /**
     * 注册回调函数
     * @param id  需要监听的事件
     * @param callback 回调函数
     */
    function registerCallback(id, callback) {
      if (!callbacks[id]) {
        callbacks[id] = [];
      }
      callbacks[id].push(callback);
    }

    /**
     * 发送一个事件通知
     * @param id 事件ID
     */
    function notify(id) {
      var calls = callbacks[id];
      if (!calls) {
        return;
      }
      angular.forEach(calls, function (call) {
        call();
      });
    }
  }

})();

/**
 * 创建人：pengchao
 * 创建时间：2015-3-23-0023
 * 工厂名字：AuthenticationFactory
 * 作用：证明，鉴定;身份验证;认证;密押
 */
(function () {
  'use strict';

  angular.module('home').factory('AuthFactory', AuthFactory);

  AuthFactory.$inject = ['$rootScope', '$log', 'Restangular', '$q', '$cookieStore', 'MenuFactory', '$location', 'md5Factory'];

  function AuthFactory($rootScope, $log, Restangular, $q, $cookieStore, MenuFactory, $location, md5Factory) {
    //接口定义
    var factory = {};
    factory.auth = auth;
    factory.quit = quit;
    factory.login = login;
    activate();
    return factory;

    ////////////////////////////////////////////////
    ////////////下面为私有函数定义////////////////////
    ////////////////////////////////////////////////

    /**
     * 启动逻辑逻辑
     */
    function activate() {
      $log.info('加载AuthenticationFactory开始...');
      $log.info('加载AuthenticationFactory结束');
    }

    /**
     * 验证
     * @returns {*} 验证是否成功
     */
    function auth() {
      var def = $q.defer();
      if ($rootScope.isLogin || $location.path() === '/' || $location.path() === '/register') {
        def.resolve(0);
      } else {
        var query = $location.search();
        var token = query.token || $cookieStore.get('auth_token');
        if (!token || !angular.isString(token)) {
          def.reject(0);
          $rootScope.toLogin();
        } else {
          Restangular.one('auth').customPOST({token: token}, 'auth')
            .then(function (data) {
              setAuth(data.username, token, true);
              MenuFactory.reload()
                .finally(function () {
                  def.resolve(0);
                });
            })
            .catch(function (response) {
              $rootScope.toLogin();
              def.reject(response);
            });
        }
      }
      return def.promise;
    }

    /**
     * 登陆接口
     * @param userName 用户名
     * @param password 密码
     * @returns {*} 登陆事件的promise
     */
    function login(userName, password) {
      var deferred = $q.defer();
      clearAuth();
      if (!userName || !password) {
        deferred.reject();
      } else {
        Restangular.one('auth').customGET('login', {username: userName, password: md5Factory(password)})
          .then(function (data) {
            setAuth(userName, data.token, true);
            MenuFactory.reload()
              .then(function (data) {
                deferred.resolve(data);
              })
              .catch(function (response) {
                deferred.resolve(response);
              });
          }, function (response) {
            factory.isLogin = false;
            deferred.reject(response);
          });

        return deferred.promise;
      }
    }

    /**
     * 退出登录
     */
    function quit() {
      clearAuth();
      $rootScope.toLogin();
    }

    /**
     * 清除登陆信息
     */
    function clearAuth() {
      setAuth();
    }

    /**
     * 设置登录信息
     * @param id  登陆ID
     * @param token token
     * @param login 是否登陆
     */
    function setAuth(id, token, login) {
      $rootScope.token = token;
      if(token) {
        //$cookieStore.put('auth_token', token);
      }else{
        $cookieStore.remove('auth_token');
      }
      $rootScope.userId = id;
      $rootScope.isLogin = login;
    }


  }

})();

/**
 * 创建人：pengchao
 * 创建时间：2015-3-26-0026
 * 工厂名字：String
 * 作用：扩展String的方法
 */
(function () {
    'use strict';

  ///** 在字符串末尾追加字符串 **/
  //String.prototype.append = function (str) {
  //  return this.concat(str);
  //};
  //
  ///** 删除指定索引位置的字符，索引无效将不删除任何字符 **/
  //String.prototype.deleteCharAt = function (index) {
  //  if (index < 0 || index >= this.length) {
  //    return this.valueOf();
  //  }
  //  else if (index == 0) {
  //    return this.substring(1, this.length);
  //  }
  //  else if (index == this.length - 1) {
  //    return this.substring(0, this.length - 1);
  //  }
  //  else {
  //    return this.substring(0, index) + this.substring(index + 1);
  //  }
  //};
  //
  ///** 删除指定索引区间的字符串 **/
  //String.prototype.deleteString = function (start, end) {
  //  if (start == end) {
  //    return this.deleteCharAt(start);
  //  }
  //  else {
  //    if (start > end) {
  //      var temp = start;
  //      start = end;
  //      end = temp;
  //    }
  //    if (start < 0) {
  //      start = 0;
  //    }
  //    if (end > this.length - 1) {
  //      end = this.length - 1;
  //    }
  //    return this.substring(0, start) + this.substring(end + 1, this.length);
  //  }
  //};
  //
  ///** 检查字符串是否以subStr结尾 **/
  //String.prototype.endWith = function (subStr) {
  //  if (subStr.length > this.length) {
  //    return false;
  //  }
  //  else {
  //    return (this.lastIndexOf(subStr) == (this.length - subStr.length)) ? true : false;
  //  }
  //};
  //
  ///** 比较两个字符串是否相等，也可以直接用 == 进行比较 **/
  //String.prototype.equal = function (str) {
  //  if (this.length != str.length) {
  //    return false;
  //  }
  //  else {
  //    for (var i = 0; i < this.length; i++) {
  //      if (this.charAt(i) != str.charAt(i)) {
  //        return false;
  //      }
  //    }
  //    return true;
  //  }
  //};
  //
  //
  ///** 比较两个字符串是否相等，不区分大小写 **/
  //String.prototype.equalIgnoreCase = function (str) {
  //  var temp1 = this.toLowerCase();
  //  var temp2 = str.toLowerCase();
  //  return temp1.equal(temp2);
  //};
  //
  ///** 将指定的字符串插入到指定的位置后面，索引无效将直接追加到字符串的末尾 **/
  //String.prototype.insert = function (ofset, subStr) {
  //  if (ofset < 0 || ofset >= this.length - 1) {
  //    return this.append(subStr);
  //  }
  //  return this.substring(0, ofset + 1) + subStr + this.substring(ofset + 1);
  //};
  //
  ///** 判断字符串是否数字串 **/
  //String.prototype.isAllNumber = function () {
  //  for (var i = 0; i < this.length; i++) {
  //    if (this.charAt(i) < '0' || this.charAt(i) > '9') {
  //      return false;
  //    }
  //  }
  //  return true;
  //};
  //
  ///** 将字符串反序排列 **/
  //String.prototype.reserve = function () {
  //  var temp = "";
  //  for (var i = this.length - 1; i >= 0; i--) {
  //    temp = temp.concat(this.charAt(i));
  //  }
  //  return temp;
  //};
  //
  ///** 将指定的位置的字符设置为另外指定的字符或字符串.索引无效将直接返回不做任何处理 **/
  //String.prototype.setCharAt = function (index, subStr) {
  //  if (index < 0 || index > this.length - 1) {
  //    return this.valueOf();
  //  }
  //  return this.substring(0, index) + subStr + this.substring(index + 1);
  //};
  //
  ///** 检查字符串是否以subStr开头 **/
  //String.prototype.startWith = function (subStr) {
  //  if (subStr.length > this.length) {
  //    return false;
  //  }
  //  return (this.indexOf(subStr) == 0) ? true : false;
  //};
  //
  ///** 计算长度，每个汉字占两个长度，英文字符每个占一个长度 **/
  //String.prototype.charLength = function () {
  //  var temp = 0;
  //  for (var i = 0; i < this.length; i++) {
  //    if (this.charCodeAt(i) > 255) {
  //      temp += 2;
  //    }
  //    else {
  //      temp += 1;
  //    }
  //  }
  //  return temp;
  //};
  //
  //String.prototype.charLengthReg = function () {
  //  return this.replace(/[^\x00-\xff]/g, "**").length;
  //};
  //
  ///** 去掉首尾空格 **/
  //String.prototype.trim = function () {
  //  return this.replace(/(^\s*)|(\s*$)/g, "");
  //};
  ///** 测试是否是数字 **/
  //String.prototype.isNumeric = function () {
  //  var tmpFloat = parseFloat(this);
  //  if (isNaN(tmpFloat))
  //    return false;
  //  var tmpLen = this.length - tmpFloat.toString().length;
  //  return tmpFloat + "0".Repeat(tmpLen) == this;
  //};
  ///** 测试是否是整数 **/
  //String.prototype.isInt = function () {
  //  if (this == "NaN")
  //    return false;
  //  return this == parseInt(this).toString();
  //};
  //
  ///** 获取N个相同的字符串 **/
  //String.prototype.Repeat = function (num) {
  //  var tmpArr = [];
  //  for (var i = 0; i < num; i++) tmpArr.push(this);
  //  return tmpArr.join("");
  //};
  //
  ///** 合并多个空白为一个空白 **/
  //String.prototype.resetBlank = function () {
  //  return this.replace(/s+/g, " ");
  //};
  //
  ///** 除去左边空白 **/
  //String.prototype.LTrim = function () {
  //  return this.replace(/^s+/g, "");
  //};
  //
  ///** 除去右边空白 **/
  //String.prototype.RTrim = function () {
  //  return this.replace(/s+$/g, "");
  //};
  //
  ///** 除去两边空白 **/
  //String.prototype.trim = function () {
  //  return this.replace(/(^s+)|(s+$)/g, "");
  //};
  //
  ///** 保留数字 **/
  //String.prototype.getNum = function () {
  //  return this.replace(/[^d]/g, "");
  //};
  //
  ///** 保留字母 **/
  //String.prototype.getEn = function () {
  //  return this.replace(/[^A-Za-z]/g, "");
  //};
  //
  ///** 保留中文 **/
  //String.prototype.getCn = function () {
  //  return this.replace(/[^u4e00-u9fa5uf900-ufa2d]/g, "");
  //};
  //
  ///** 得到字节长度 **/
  //String.prototype.getRealLength = function () {
  //  return this.replace(/[^x00-xff]/g, "--").length;
  //};
  //
  ///** 从左截取指定长度的字串 **/
  //String.prototype.left = function (n) {
  //  return this.slice(0, n);
  //};
  //
  ///** 从右截取指定长度的字串 **/
  //String.prototype.right = function (n) {
  //  return this.slice(this.length - n);
  //};

})();

/**
 * MD5 码生成器
 */

(function () {
  'use strict';

  angular.module('home').constant('Config', {
    Nations: [
      {id: 0, name: '汉族'},
      {id: 1, name: '苗族'},
      {id: 2, name: '蒙古族'},
      {id: 3, name: '回族'},
      {id: 4, name: '壮族'},
      {id: 5, name: '维吾尔族'},
      {id: 6, name: '藏族'},
      {id: 7, name: '彝族'},
      {id: 8, name: '布依族'},
      {id: 9, name: '朝鲜族'},
      {id: 10, name: '满族'},
      {id: 11, name: '侗族'},
      {id: 12, name: '瑶族'},
      {id: 13, name: '白族'},
      {id: 14, name: '土家族'},
      {id: 15, name: '哈尼族'},
      {id: 16, name: '哈萨克族'},
      {id: 17, name: '傣族'},
      {id: 18, name: '黎族'},
      {id: 19, name: '僳僳族'},
      {id: 20, name: '佤族'},
      {id: 21, name: '畲族'},
      {id: 22, name: '拉祜族'},
      {id: 23, name: '水族'},
      {id: 24, name: '东乡族'},
      {id: 25, name: '纳西族'},
      {id: 26, name: '景颇族'},
      {id: 27, name: '柯尔克孜族'},
      {id: 28, name: '土族'},
      {id: 29, name: '达斡尔族'},
      {id: 30, name: '仫佬族'},
      {id: 31, name: '仡佬族'},
      {id: 32, name: '羌族'},
      {id: 33, name: '锡伯族'},
      {id: 34, name: '布朗族'},
      {id: 35, name: '撒拉族'},
      {id: 36, name: '毛南族'},
      {id: 37, name: '阿昌族'},
      {id: 38, name: '普米族'},
      {id: 39, name: '塔吉克族'},
      {id: 40, name: '怒族'},
      {id: 41, name: '乌孜别克族'},
      {id: 42, name: '俄罗斯族'},
      {id: 43, name: '鄂温克族'},
      {id: 44, name: '德昂族'},
      {id: 45, name: '保安族'},
      {id: 46, name: '裕固族'},
      {id: 47, name: '京族'},
      {id: 48, name: '基诺族'},
      {id: 49, name: '高山族'},
      {id: 50, name: '塔塔尔族'},
      {id: 51, name: '独龙族'},
      {id: 52, name: '鄂伦春族'},
      {id: 53, name: '赫哲族'},
      {id: 54, name: '门巴族'},
      {id: 55, name: '珞巴族'}
    ],
    Politicals: [
      {id: 0, name: '群众'},
      {id: 1, name: '团员'},
      {id: 2, name: '党员'},
      {id: 3, name: '预备党员'},
      {id: 4, name: '民主党派'},
      {id: 5, name: '罪犯'}
    ],
    Sexes: [
      {id: 0, name: '男'},
      {id: 1, name: '女'}
    ],
    Statuses: [
      {id: 0, name: '在职'},
      {id: 1, name: '离职'},
      {id: 2, name: '待岗'},
      {id: 3, name: '停职'},
      {id: 4, name: '退休'}
    ],
    Events: {
      UserInitEvent: "userInit",
      MenuInit: 'menuInit',
      ModelInit: 'ModelInit'
    },
    DepartmentTypes: [
      {id: '0', name: '未选择', infoUrl: 'components/template/department.no.info.tmp.html'},
      {
        id: '1',
        name: '公司',
        infoUrl: 'components/template/company.info.tmp.html',
        addUrl: 'components/template/company.add.tmp.html',
        editUrl: 'components/template/company.edit.tmp.html'
      },
      {
        id: '2',
        name: '部门',
        infoUrl: 'components/template/department.info.tmp.html',
        addUrl: 'components/template/department.add.tmp.html',
        editUrl: 'components/template/department.edit.tmp.html'
      },
      {
        id: '3',
        name: '分公司',
        infoUrl: 'components/template/branch.info.tmp.html',
        addUrl: 'components/template/branch.add.tmp.html',
        editUrl: 'components/template/branch.edit.tmp.html'
      },
      {
        id: '4',
        name: '子公司',
        infoUrl: 'components/template/subsidiaries.info.tmp.html',
        addUrl: 'components/template/subsidiaries.add.tmp.html',
        editUrl: 'components/template/subsidiaries.edit.tmp.html'
      },
      {
        id: '5',
        name: '项目部',
        infoUrl: 'components/template/pro.department.info.tmp.html',
        addUrl: 'components/template/pro.department.add.tmp.html',
        editUrl: 'components/template/pro.department.edit.tmp.html'
      }
    ],
    toolbars: [
      ['h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'p',
        'pre',
        'quote',
        'bold',
        'italics',
        'underline',
        'strikeThrough',
        'ul',
        'ol',
        'undo',
        'redo',
        'clear',
        'justifyLeft',
        'justifyCenter',
        'justifyRight',
        'indent',
        'outdent',
        'html',
        'insertImage',
        'insertLink',
        'insertVideo']
    ],
    dateOptions: [
      {
        // Strings and translations
        monthsFull: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        monthsShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        weekdaysFull: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        weekdaysShort: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        showMonthsShort: undefined,
        showWeekdaysFull: undefined,

        // Buttons
        today: '今天',
        clear: '清除',
        close: '关闭',

        // Accessibility labels
        labelMonthNext: '下个月',
        labelMonthPrev: '上个月',
        labelMonthSelect: '选择月份',
        labelYearSelect: '选择年份',

        // Formats
        format: 'yyyy年mm月dd日',
        formatSubmit: undefined,
        hiddenPrefix: undefined,
        hiddenSuffix: '_submit',
        hiddenName: undefined,

        // Editable input
        editable: undefined,

        // Dropdown selectors
        selectYears: undefined,
        selectMonths: undefined,

        // First day of the week
        firstDay: undefined,

        // Date limits
        min: undefined,
        max: undefined,

        // Disable dates
        disable: undefined,

        // Root picker container
        container: undefined,

        // Hidden input container
        containerHidden: undefined,

        // Close on a user action
        closeOnSelect: true,
        closeOnClear: true,

        // Events
        onStart: undefined,
        onRender: undefined,
        onOpen: undefined,
        onClose: undefined,
        onSet: undefined,
        onStop: undefined
      }
    ],
    RestOptions: {
      'get': {name: '获取', dlg: '正在加载数据,请稍候...'},
      'getList': {name: '获取', dlg: '正在加载数据,请稍候...'},
      'post': {name: '增加', dlg: '正在提交数据,请稍候...'},
      'put': {name: '更新', dlg: '正在更新数据,请稍候...'},
      'delete': {name: '删除', dlg: '正在删除数据,请稍候...'},
      'remove': {name: '删除', dlg: '正在删除数据,请稍候...'},
      'head': {name: '头部', dlg: '正在加载数据,请稍候...'},
      'options': {name: '选项', dlg: '正在加载数据,请稍候...'},
      'patch': {name: 'patch', dlg: '正在加载数据,请稍候...'},
      'trace': {name: '打印', dlg: '正在加载数据,请稍候...'}
    },
    NewsTypes: [
      {id: 1, name: '工程'},
      {id: 2, name: '企业文化'},
      {id: 3, name: '行业新闻'},
      {id: 4, name: '外部'},
      {id: 5, name: '综合新闻'}
    ],
    NoticeTypes: [
      {id: 1, name: '事务公告'},
      {id: 2, name: '招募公告'},
      {id: 3, name: '变更公告'},
      {id: 4, name: '启事公告'},
      {id: 5, name: '其他公告'}
    ],
    Urls: {
      fileUrl: 'http://192.168.0.240:9050/file/direct/origin/',
      RestUrl: undefined
    },
    Names: {
      repository: 'repository',      //仓库
      deployments: 'deployments',    //部署
      resources: 'resources',        //资源
      resourcedata: 'resourcedata',  //资源内容
      processDef: 'process-definitions',
      model: 'model',
      identitylinks: 'identitylinks',
      models: 'models',
      source: 'source',
      sourceExtra: 'source-extra',

      runtime: 'runtime',
      processInstances: 'process-instances',
      diagram: 'diagram',
      users: 'users',
      variables: 'variables',
      executions: 'executions',
      activities: 'activities',
      scope: 'scope',
      tasks: 'tasks',
      cascadeHistory: 'cascadeHistory',
      deleteReason: 'deleteReason',
      comments: 'comments',
      events: 'events',
      attachments: 'attachments',
      content: 'content',
      signals: 'signals',

      history: 'history',
      historicProcessInstances: 'historic-process-instances',
      data: 'data',
      historicDetail: 'historic-detail',

      form: 'form',
      formData: 'form-data',

      management: 'management',
      tables: 'tables',
      properties: 'properties',
      engine: 'engine',
      jobs: 'jobs',
      exceptionStacktrace: 'exception-stacktrace',

      identity: 'identity',
      picture: 'picture',
      info: 'info',
      groups: 'groups',
      members: 'members'
    }

  });
})();

/**
 * 创建人：pengchao
 * 创建时间：2015-3-26-0026
 * 工厂名字：Theme
 * 作用：主题定义
 */
(function () {
    'use strict';

    angular.module('home').constant('Theme', {
      palettes:{
        white:{
          '50': '22fe22',
          '100': '36fe55',
          '200': '52fd14',
          '300': '65fd45',
          '400': '62ff15',
          '500': 'ffffff',
          '600': 'abfda1',
          '700': 'acfed5',
          '800': 'cdffe5',
          '900': 'cefed8',
          'A100': 'adfde5',
          'A200': 'cffca8',
          'A400': 'caff85',
          'A700': 'acffef'
        },
        altgreen:{
          '50': '#e0f2f1',
          '100': '#b2dfdb',
          '200': '#80cbc4',
          '300': '#4db6ac',
          '400': '#26a69a',
          '500': '#30b77a',
          '600': '#00897b',
          '700': '#00796b',
          '800': '#00695c',
          '900': '#004d40',
          'A100': '#a7ffeb',
          'A200': '#64ffda',
          'A400': '#1de9b6',
          'A700': '#00bfa5',
          'contrastDefaultColor': 'dark',
          'contrastLightColors': '500 600 700 800 900',
          'contrastStrongLightColors': '500 600 700'
        },
        gray: {
          '0': '#ffffff',
          '50': '#fafafa',
          '100': '#f5f5f5',
          '200': '#9e9e9e',
          '300': '#e0e0e0',
          '400': '#bdbdbd',
          '500': '#eeeeee',
          '600': '#757575',
          '700': '#616161',
          '800': '#424242',
          '900': '#212121',
          '1000': '#000000',
          'A100': '#ffffff',
          'A200': '#eeeeee',
          'A400': '#bdbdbd',
          'A700': '#616161',
          'contrastDefaultColor': 'dark',
          'contrastLightColors': '600 700 800 900'
        }
      },
      themes:[
        {name:'altTheme',primaryPalette:'white'},
        {name:'default',primaryPalette:'altgreen'},
        {name:'userTheme',primaryPalette:'gray'}
      ]
    });
})();

/**
 * 创建人：pengchao
 * 创建时间：2015-3-26-0026
 * 工厂名字：Router
 * 作用：路由配置
 */
(function () {
    'use strict';

    angular.module('home').constant('Router', {
        main: {
            name: 'main',
            url: '/main',
            templateUrl: 'app/main/main.html',
            controller: 'MainCtrl',
            controllerAs: 'vm',
            children: [
                {
                    name: 'user',
                    url: '/user',
                    templateUrl: 'app/user/user.html',
                    controller: 'UserCtrl',
                    controllerAs: 'vm',
                    children: [
                        {
                            name: 'list',
                            templateUrl: 'app/user/list/UserList.html',
                            controller: 'UserListCtrl',
                            controllerAs: 'vm'
                        },
                        {
                            name: 'info',
                            url: '/info/:id',
                            templateUrl: 'app/user/info/UserInfo.html',
                            controller: 'UserInfoCtrl',
                            controllerAs: 'vm'
                        },
                        {
                            name: 'change',
                            url: '/change/:id',
                            templateUrl: 'app/user/change/UserChange.html',
                            controller: 'UserChangeCtrl',
                            controllerAs: 'vm'
                        },
                        {
                            name: 'add',
                            url: '/add',
                            templateUrl: 'app/user/add/UserAdd.html',
                            controller: 'UserAddCtrl',
                            controllerAs: 'vm'
                        }
                    ]
                },
                {
                    name: 'dep',
                    url: '/dep',
                    templateUrl: 'app/dep/Department.html',
                    controller: 'DepartmentCtrl',
                    controllerAs: 'vm',
                    children: [
                        {
                            name: 'list',
                            url: '/list',
                            templateUrl: 'app/dep/list/DepartmentList.html',
                            controller: 'DepartmentListCtrl',
                            controllerAs: 'vm'
                        },
                        {
                            name: 'change',
                            url: '/change/:id',
                            templateUrl: 'app/dep/change/DepartmentChange.html',
                            controller: 'DepartmentChangeCtrl',
                            controllerAs: 'vm'
                        },
                        {
                            name: 'add',
                            url: '/add?typeId&depId',
                            templateUrl: 'app/dep/add/DepartmentAdd.html',
                            controller: 'DepartmentAddCtrl',
                            controllerAs: 'vm'
                        }
                    ]
                },
                {
                    name: 'position',
                    url: '/position',
                    templateUrl: 'app/position/Position.html',
                    controller: 'PositionCtrl',
                    controllerAs: 'vm',
                    children: [
                        {
                            name: 'list',
                            url: '/list/:depId/postions',
                            templateUrl: 'app/position/list/PositionList.html',
                            controller: 'PositionListCtrl',
                            controllerAs: 'vm'
                        },
                        {
                            name: 'depAdd',
                            url: '/list/:depId/depadd',
                            templateUrl: 'app/position/depadd/DepPostAdd.html',
                            controller: 'DepPostAddCtrl',
                            controllerAs: 'vm'
                        },
                        {
                            name: 'change',
                            url: '/change/:id',
                            templateUrl: 'app/position/change/PositionChange.html',
                            controller: 'PositionChangeCtrl',
                            controllerAs: 'vm'
                        },
                        {
                            name: 'add',
                            url: '/add',
                            templateUrl: 'app/position/add/PositionAdd.html',
                            controller: 'PositionAddCtrl',
                            controllerAs: 'vm'
                        }
                    ]
                },
                {
                    name: 'new',
                    url: '/new',
                    templateUrl: 'app/inf/new/new.html',
                    controller: 'NewCtrl',
                    controllerAs: 'vm',
                    children: [
                        {
                            name: 'list',
                            url: '/list',
                            templateUrl: 'app/inf/new/list/news.html',
                            controller: 'NewsCtrl',
                            controllerAs: 'vm'
                        },
                        {
                            name: 'preview',
                            url: '/preview',
                            templateUrl: 'app/inf/new/preview/NewPreview.html',
                            controller: 'NewPreviewCtrl',
                            controllerAs: 'vm'
                        },
                        {
                            name: 'add',
                            url: '/add',
                            templateUrl: 'app/inf/new/add/NewAdd.html',
                            controller: 'NewAddCtrl',
                            controllerAs: 'vm'
                        },
                        {
                            name: 'info',
                            url: '/info/:id',
                            templateUrl: 'app/inf/new/info/NewInfo.html',
                            controller: 'NewInfoCtrl',
                            controllerAs: 'vm'
                        }
                    ]
                },
                {
                    name: 'notice',
                    url: '/notice',
                    templateUrl: 'app/inf/notice/Notice.html',
                    controller: 'NoticeCtrl',
                    controllerAs: 'vm',
                    children: [
                        {
                            name: 'list',
                            url: '/list',
                            templateUrl: 'app/inf/notice/list/NoticeList.html',
                            controller: 'NoticeListCtrl',
                            controllerAs: 'vm'
                        },
                        {
                            name: 'add',
                            url: '/add',
                            templateUrl: 'app/inf/notice/add/NoticeAdd.html',
                            controller: 'NoticeAddCtrl',
                            controllerAs: 'vm'
                        },
                        {
                            name: 'preview',
                            url: '/preview',
                            templateUrl: 'app/inf/notice/preview/NoticePreview.html',
                            controller: 'NoticePreviewCtrl',
                            controllerAs: 'vm'
                        },
                        {
                            name: 'info',
                            url: '/info/:id',
                            templateUrl: 'app/inf/notice/info/NoticeInfo.html',
                            controller: 'NoticeInfoCtrl',
                            controllerAs: 'vm'
                        }
                    ]
                },
                {
                    name: 'process',
                    url: '/process',
                    templateUrl: 'app/process/process.html',
                    controller: 'ProcessCtrl',
                    controllerAs: 'vm',
                    children: [
                        {
                            name: 'model',
                            url: '/model',
                            templateUrl: 'app/process/model/model.html',
                            controller: 'ModelCtrl',
                            controllerAs: 'vm',
                            children: [
                                {
                                    name: 'list',
                                    url: '/list',
                                    templateUrl: 'app/process/model/list/model.list.html',
                                    controller: 'ModelListCtrl',
                                    controllerAs: 'vm'
                                },
                                {
                                    name:'info',
                                    url:'/info/:id',
                                    templateUrl: 'app/process/model/info/ModelInfo.html',
                                    controller: 'ModelInfoCtrl',
                                    controllerAs: 'vm'
                                }
                            ]
                        },
                        {
                            name: 'deployment',
                            url: '/deployment',
                            templateUrl: 'app/process/deployment/Deployment.html',
                            controller: 'DeploymentCtrl',
                            controllerAs: 'vm',
                            children: [
                                {
                                    name: 'list',
                                    url: '/list',
                                    templateUrl: 'app/process/deployment/list/DeploymentList.html',
                                    controller: 'DeploymentListCtrl',
                                    controllerAs: 'vm'
                                }
                            ]
                        },
                        {
                            name: 'definition',
                            url: '/definition',
                            templateUrl: 'app/process/definition/Definition.html',
                            controller: 'DefinitionCtrl',
                            controllerAs: 'vm',
                            children: [
                                {
                                    name: 'list',
                                    url: '/list',
                                    templateUrl: 'app/process/definition/list/DefinitionList.html',
                                    controller: 'DefinitionListCtrl',
                                    controllerAs: 'vm'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        login: {
            name: 'login',
            url: '/',
            templateUrl: 'app/login/login.html',
            controller: 'LoginCtrl',
            controllerAs: 'vm'
        },
        register:{
            name:'register',
            url:'/register?type',
            templateUrl:'app/register/Register.html',
            controller: 'RegisterController',
            controllerAs:'vm'
        }
    });
})();

/**
 * 创建人：田黄雪薇
 * 创建时间：2015-3-30-0030
 * 工厂名字：RegisterControllerCtrl
 * 作用：注册控制器
 */
(function () {
    'use strict';

    angular.module('home').controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$log', 'Config', '$timeout','$stateParams','Restangular','DialogFactory','md5Factory'];

    function RegisterController($log, Config, $timeout,$stateParams,Restangular,DialogFactory,md5Factory) {
        //接口定义
        var vm = this;
        vm.user = {
            type:$stateParams.type
        };
        vm.submit = submit;
        vm.ssn = vm.user.type == 0 ? '学号' : '教师编号';

        activate();
        ////////////////////////////////////////////////
        ////////////下面为私有函数定义////////////////////
        ////////////////////////////////////////////////

        /**
         * 启动逻辑逻辑
         */
        function activate() {
            $log.info('加载RegisterControllerCtrl');
        }

        function submit(ev) {
            if(vm.newForm.$invalid) {
                return ;
            }
            if(vm.user.password !== vm.password) {
                DialogFactory.fail("两次输入的密码不符", ev);
                return;
            }

            vm.user.password = md5Factory(vm.password);

            Restangular.all('user').post(vm.user)
                .then(function (data) {
                    DialogFactory.success('用户创建成功, 跳转到登陆页面!',ev)
                        .finally(function () {
                            $state.go('login');
                        });
                })
                .catch(function (response) {
                    DialogFactory.fail('用户创建失败\n,'  + response.rm , ev);
                });
        }
    }

})();
/**
 * 创建人：pengchao
 * 创建时间：2015-3-23-0023
 * 工厂名字：MainCtrl
 * 作用：主页控制器
 */
(function () {
  'use strict';

  angular.module('home').controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$log', 'Config', '$timeout', 'MenuFactory', '$rootScope', '$location', '$mdSidenav','$state'];

  function MainCtrl($log, Config, $timeout, MenuFactory, $rootScope, $location, $mdSidenav,$state) {
    //接口定义
    var vm = this;
    vm.sections = MenuFactory.sections;
    vm.openMenu = openMenu;
    vm.closeMenu = closeMenu;
    vm.path = path;
    vm.goHome = goHome;
    vm.openPage = openPage;
    vm.isSectionSelected = isSectionSelected;
    //$rootScope.$on('$locationChangeSuccess', openPage);
    vm.focusMainContent = focusMainContent;

    vm.isOpen = isOpen;
    vm.isSelected = isSelected;
    vm.toggleOpen = toggleOpen;
    vm.autoFocusContent = false;
    vm.goSelect = goSelect;

    var mainContentArea = document.querySelector("[role='main']");

    activate();
    ////////////////////////////////////////////////
    ////////////下面为私有函数定义////////////////////
    ////////////////////////////////////////////////

    /**
     * 启动逻辑逻辑
     */
    function activate() {
      $log.info('加载MainCtrl开始...');

      MenuFactory.registerCallback(Config.Events.MenuInit, function () {
        $timeout(function () {
          vm.sections = MenuFactory.sections;
        });
      });
      $log.info('加载MainCtrl结束');
    }

    function openMenu() {
      $timeout(function () {
        $mdSidenav('left').open();
      });
    }

    function closeMenu() {
      $timeout(function () {
        try {
          $mdSidenav('left').close();
        } catch (e) {
          $log.info(e);
        }
      });
    }

    function goHome($event) {
      MenuFactory.selectPage(null, null);
      return $state.go('login');
    }

    function openPage() {
      //vm.closeMenu();
      //
      //if (self.autoFocusContent) {
      //  focusMainContent();
      //  self.autoFocusContent = false;
      //}
    }

    function path() {
      return $location.path();
    }

    function focusMainContent($event) {
      //if ($event) {
      //  $event.preventDefault();
      //}
      //
      //$timeout(function () {
      //  mainContentArea.focus();
      //}, 90);
    }

    function isSelected(page) {
      return MenuFactory.isPageSelected(page);
    }

    function goSelect(section,event) {
      $log.info('goSelect');
      $state.go(section.url);
      event.stopPropagation();
    }

    function isSectionSelected(section) {
      var selected = false;
      var openedSection = MenuFactory.openedSection;
      if (openedSection === section) {
        selected = true;
      } else if (section.children) {
        section.children.forEach(function (childSection) {
          if (childSection === openedSection) {
            selected = true;
          }
        });
      }

      return selected;
    }

    function isOpen(section) {
      return MenuFactory.isSectionSelected(section);
    }

    function toggleOpen(section) {
      MenuFactory.toggleSelectSection(section);
    }
  }

})();

/**
 * 创建人：pengchao
 * 创建时间：2015-3-23-0023
 * 工厂名字：LoginCtrl
 * 作用：
 */
(function () {
  'use strict';

  angular.module('home').controller('LoginCtrl', LoginCtrl);

  LoginCtrl.$inject = ['$log', '$state', 'AuthFactory','Restangular'];

  function LoginCtrl($log, $state, AuthFactory,Restangular) {
    //接口定义
    var vm = this;
    vm.user = {};
    vm.login = login;
    vm.stuRegister = stuRegister;
    vm.teacherRegister = teacherRegister;

    activate();
    ////////////////////////////////////////////////
    ////////////下面为私有函数定义////////////////////
    ////////////////////////////////////////////////

    /**
     * 启动逻辑逻辑
     */
    function activate() {
      $log.info('加载LoginCtrl开始...');
      $log.info('加载LoginCtrl结束');
    }

    /**
     * 私有函数，登陆处理
     * @param ev 事件
     */
    function login(ev) {
      if (vm.loginForm.$invalid) {
        return;
      }
      AuthFactory.login(vm.user.userName, vm.user.password, ev)
        .then(function () {
          $state.go('main');
        });
    }
    function stuRegister(ev) {
      $state.go('register', {type: 0});
    }

    function teacherRegister(ev) {
      $state.go('register', {type: 1});
    }
  }

})();

angular.module("home").run(["$templateCache", function($templateCache) {$templateCache.put("app/login/login.html","<div style=\"position:absolute;top:50%;left:50%;\"><div layout=\"row\" style=\"width:500px;height:230px;position: relative; margin:-115px auto auto -250px;\"><div flex=\"\" hide-sm=\"\" flex-order=\"1\" align=\"right\" layout-padding=\"\"><img src=\"../assets/images/img/login_01.png\" layout-padding=\"\"><div class=\"login-font\">作业管理系统</div><p class=\"login-font-p\">2015年田黄雪薇版权所有</p></div><div flex=\"\" flex-order=\"2\" align=\"center\"><form name=\"vm.loginForm\" layout=\"column\" layout-align=\"center center\"><md-input-container flex=\"\"><label align=\"left\">账号</label> <input required=\"\" ng-model=\"vm.user.userName\" placeholder=\"请输入用户名\"><div ng-messages=\"vm.loginForm.user.userName.$error\"><div ng-message=\"required\">账号不能为空</div></div></md-input-container><md-input-container flex=\"\"><label align=\"left\">密码</label> <input required=\"\" ng-model=\"vm.user.password\" type=\"password\" placeholder=\"请输入密码\"><div ng-messages=\"vm.loginForm.user.password.$error\"><div ng-message=\"required\">密码不能为空</div></div></md-input-container><md-button class=\"md-raised md-primary\" style=\"width: 175px;box-shadow: none;color:#fff\" ng-click=\"vm.login($event)\" flex=\"\">登陆</md-button></form><md-button ng-click=\"vm.stuRegister($event)\" style=\"margin-top: 20px;color: green;padding: 10px\">学生注册</md-button><md-button ng-click=\"vm.teacherRegister($event)\" style=\"margin-top: 20px;color: green;padding: 10px\">老师注册</md-button></div></div></div>");
$templateCache.put("app/register/Register.html","<md-content class=\"md-padding\" layout=\"column\" layout-align=\"center center\"><form name=\"vm.newForm\" layout=\"column\" layout-align=\"center center\"><md-input-container><label>账户</label> <input required=\"\" ng-model=\"vm.user.id\" placeholder=\"请输入账号\"></md-input-container><md-input-container><label>名字</label> <input required=\"\" ng-model=\"vm.user.name\" placeholder=\"请输入名字\"></md-input-container><md-input-container><label>{{vm.ssn}}</label> <input required=\"\" ng-model=\"vm.user.sn\" placeholder=\"请输入编号\"></md-input-container><md-input-container><label>密码</label> <input required=\"\" type=\"password\" ng-model=\"vm.user.password\" placeholder=\"请输入密码\"></md-input-container><md-input-container><label>确认密码</label> <input required=\"\" type=\"password\" ng-model=\"vm.password\" placeholder=\"请输入确认密码\"></md-input-container><md-button class=\"md-primary\" style=\"margin-top: 50px;min-width: 200px\" ng-click=\"vm.submit($event)\">提交</md-button></form></md-content>");
$templateCache.put("app/main/main.html","<section layout=\"row\" flex=\"\" class=\"body\"><md-sidenav class=\"site-sidenav md-sidenav-left md-whiteframe-z2\" md-component-id=\"left\" md-is-locked-open=\"$mdMedia(\'gt-sm\')\"><md-toolbar><h1 class=\"md-toolbar-tools\"><a ng-href=\"/\" layout=\"row\" flex=\"\" style=\"color:#fff\"><svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewbox=\"0 0 100 100\" enable-background=\"new 0 0 100 100\" xml:space=\"preserve\" style=\"width: 40px; height: 40px;\"><path d=\"M 50 0 L 100 14 L 92 80 L 50 100 L 8 80 L 0 14 Z\" fill=\"#b2b2b2\"></path><path d=\"M 50 5 L 6 18 L 13.5 77 L 50 94 Z\" fill=\"#E42939\"></path><path d=\"M 50 5 L 94 18 L 86.5 77 L 50 94 Z\" fill=\"#B72833\"></path><path d=\"M 50 7 L 83 75 L 72 75 L 65 59 L 50 59 L 50 50 L 61 50 L 50 26 Z\" fill=\"#b2b2b2\"></path><path d=\"M 50 7 L 17 75 L 28 75 L 35 59 L 50 59 L 50 50 L 39 50 L 50 26 Z\" fill=\"#fff\"></path></svg><div class=\"docs-logotype\">OA管理系统</div></a></h1></md-toolbar><md-content flex=\"\" role=\"navigation\"><ul class=\"docs-menu\"><li ng-repeat=\"section in vm.sections\" class=\"parent-list-item\" ng-class=\"{\'parentActive\' : vm.isSectionSelected(section)}\"><h2 class=\"menu-heading\" ng-if=\"section.type === \'heading\'\" id=\"heading_{{ section.name | nospace}}\">{{section.name}}</h2><menu-link section=\"section\" ng-if=\"section.type === \'link\'\"></menu-link><menu-toggle section=\"section\" ng-if=\"section.type === \'toggle\'\"></menu-toggle><ul ng-if=\"section.children\" class=\"menu-nested-list\"><li ng-repeat=\"child in section.children\" ng-class=\"{\'childActive\' : isSectionSelected(child)}\"><menu-toggle section=\"child\"></menu-toggle></li></ul></li></ul></md-content></md-sidenav><div layout=\"column\" tabindex=\"-1\" role=\"main\" flex=\"\"><md-toolbar><div class=\"md-toolbar-tools\" ng-click=\"vm.openMenu()\"><button class=\"docs-menu-icon\" hide-gt-sm=\"\" aria-label=\"Toggle Menu\"><md-icon md-svg-src=\"../assets/images/svg/ic_menu_24px.svg\"></md-icon></button><div layout=\"row\" flex=\"\" class=\"fill-height\"><div class=\"md-toolbar-item md-breadcrumb\" style=\"color: #fff\"><span ng-if=\"vm.menu.currentPage.name !== vm.menu.currentSection.name\"><span hide-sm=\"\" hide-md=\"\">{{vm.menu.currentSection.name}}</span> <span class=\"docs-menu-separator-icon\" style=\"\" hide-sm=\"\" hide-md=\"\"><img src=\"../assets/images/icons/docArrow.png\" alt=\"\" aria-hidden=\"true\">]</span></span> <span class=\"md-breadcrumb-page\">{{(vm.menu.currentPage) || \'OA\' }}</span></div><span flex=\"\"></span><div class=\"md-toolbar-item md-tools docs-tools\" layout=\"column\" layout-gt-md=\"row\"><div><img src=\"../assets/images/img/face.jpg\" class=\"face\" alt=\"这个是我自己\"></div></div></div></div></md-toolbar><md-content ui-view=\"\" md-scroll-y=\"\" flex=\"\" class=\"md-padding\" style=\"background: #eee\"></md-content></div></section>");
$templateCache.put("components/dlg/model.add.dlg.html","<md-dialog><md-subheader>创建模型</md-subheader><form name=\"vm.addForm\" layout=\"column\"><div class=\"md-padding\"><md-input-container><label>模型key</label><md-input required=\"\" ng-model=\"vm.model.key\"></md-input></md-input-container><md-input-container><label>模型名称</label><md-input required=\"\" ng-model=\"vm.model.name\"></md-input></md-input-container><md-input-container><label>模型描述</label><md-input required=\"\" ng-model=\"vm.model.description\"></md-input></md-input-container></div><div class=\"md-padding\" layout=\"row\"><md-button ng-click=\"vm.submit()\" flex=\"\">确定</md-button><md-button ng-click=\"vm.cancel()\" flex=\"\">取消</md-button></div></form></md-dialog>");
$templateCache.put("components/template/branch.add.tmp.html","<md-whiteframe class=\"md-whiteframe-z2 md-padding\" layout=\"row\" layout-align=\"space-around start\" style=\"padding: 20px\"><md-whiteframe layout=\"column\" flex=\"30\"><div class=\"md-padding\"><md-input-container class=\"add-edit\"><label>名称</label> <input required=\"\" ng-model=\"vm.department.name\" type=\"text\"><div ng-messages=\"vm.addForm.department.name.$error\"><div ng-message=\"required\">公司名称不能为空</div></div></md-input-container><md-input-container class=\"add-edit\"><label>企业简称</label> <input ng-model=\"vm.department.shortName\" type=\"text\"></md-input-container><md-input-container class=\"add-edit\"><label>直接上级</label> <input required=\"\" ng-model=\"vm.department.name\" type=\"text\"><div ng-messages=\"vm.addForm.department.name.$error\"><div ng-message=\"required\">直接上级不能为空</div></div></md-input-container><md-input-container class=\"add-edit\"><label>负责人</label> <input required=\"\" ng-model=\"vm.department.legalRep\" type=\"text\"><div ng-messages=\"vm.addForm.department.legalRep.$error\"><div ng-message=\"required\">负责人不能为空</div></div></md-input-container><md-input-container class=\"add-edit\"><label>注册号</label> <input required=\"\" ng-model=\"vm.department.registeredNum\" type=\"text\"><div ng-messages=\"vm.addForm.department.registeredNum.$error\"><div ng-message=\"required\">注册号不能为空</div></div></md-input-container><md-input-container class=\"add-edit\"><label>地址</label> <input required=\"\" ng-model=\"vm.department.address\" type=\"text\"><div ng-messages=\"vm.addForm.department.address.$error\"><div ng-message=\"required\">地址不能为空</div></div></md-input-container><md-input-container class=\"add-edit\"><label>电话</label> <input ng-model=\"vm.department.telephone\" type=\"text\"></md-input-container><md-input-container class=\"add-edit\"><label>传真</label> <input ng-model=\"vm.department.fax\" type=\"text\"></md-input-container><md-input-container class=\"add-edit\"><label>邮编</label> <input ng-model=\"vm.department.pc\" type=\"text\"></md-input-container><md-input-container class=\"add-edit\"><label>电子邮箱</label> <input required=\"\" ng-model=\"vm.department.email\" type=\"email\"><div ng-messages=\"vm.addForm.department.email.$error\"><div ng-message=\"required\">输入合法的电子邮箱</div></div></md-input-container><md-input-container class=\"add-edit\"><label>官方网站</label> <input required=\"\" ng-model=\"vm.department.website\" type=\"text\"><div ng-messages=\"vm.addForm.department.website.$error\"><div ng-message=\"required\">官方网站不能为空</div></div></md-input-container></div></md-whiteframe><md-whiteframe flex=\"70\"><md-content layout=\"column\" class=\"editer-total content-border\"><md-content class=\"md-toolbar-tools\">分公司介绍</md-content><text-angular ng-model=\"vm.department.description\" ta-toolbar=\"{{Config.toolbars}}\"></text-angular><md-content><md-button class=\"md-toolbar-tools\" flex=\"\" ng-model=\"vm.department.attachment\">添加附件</md-button></md-content></md-content></md-whiteframe></md-whiteframe>");
$templateCache.put("components/template/branch.edit.tmp.html","<md-whiteframe class=\"md-whiteframe-z2 md-padding\" layout=\"row\" layout-align=\"space-around start\" style=\"padding: 20px\"><md-whiteframe layout=\"column\" flex=\"30\"><form name=\"vm.addForm\" class=\"md-padding\"><md-input-container class=\"add-edit\"><label>名称</label> <input required=\"\" ng-model=\"vm.department.name\" type=\"text\"><div ng-messages=\"vm.addForm.department.name.$error\"><div ng-message=\"required\">公司名称不能为空</div></div></md-input-container><md-input-container class=\"add-edit\"><label>企业简称</label> <input ng-model=\"vm.department.shortName\" type=\"text\"></md-input-container><md-input-container class=\"add-edit\"><label>直接上级</label> <input required=\"\" ng-model=\"vm.department.name\" type=\"text\"><div ng-messages=\"vm.addForm.department.name.$error\"><div ng-message=\"required\">直接上级不能为空</div></div></md-input-container><md-input-container class=\"add-edit\"><label>负责人</label> <input required=\"\" ng-model=\"vm.department.legalRep\" type=\"text\"><div ng-messages=\"vm.addForm.department.legalRep.$error\"><div ng-message=\"required\">负责人不能为空</div></div></md-input-container><md-input-container class=\"add-edit\"><label>注册号</label> <input required=\"\" ng-model=\"vm.department.registeredNum\" type=\"text\"><div ng-messages=\"vm.addForm.department.registeredNum.$error\"><div ng-message=\"required\">注册号不能为空</div></div></md-input-container><md-input-container class=\"add-edit\"><label>地址</label> <input required=\"\" ng-model=\"vm.department.address\" type=\"text\"><div ng-messages=\"vm.addForm.department.address.$error\"><div ng-message=\"required\">地址不能为空</div></div></md-input-container><md-input-container class=\"add-edit\"><label>电话</label> <input ng-model=\"vm.department.telephone\" type=\"text\"></md-input-container><md-input-container class=\"add-edit\"><label>传真</label> <input ng-model=\"vm.department.fax\" type=\"text\"></md-input-container><md-input-container class=\"add-edit\"><label>邮编</label> <input ng-model=\"vm.department.pc\" type=\"text\"></md-input-container><md-input-container class=\"add-edit\"><label>电子邮箱</label> <input required=\"\" ng-model=\"vm.department.email\" type=\"email\"><div ng-messages=\"vm.addForm.department.email.$error\"><div ng-message=\"required\">输入合法的电子邮箱</div></div></md-input-container><md-input-container class=\"add-edit\"><label>官方网站</label> <input required=\"\" ng-model=\"vm.department.website\" type=\"text\"><div ng-messages=\"vm.addForm.department.website.$error\"><div ng-message=\"required\">官方网站不能为空</div></div></md-input-container></form></md-whiteframe><md-whiteframe flex=\"70\"><md-content layout=\"column\" class=\"editer-total content-border\"><md-content class=\"md-toolbar-tools\">分公司介绍</md-content><text-angular ng-model=\"vm.department.description\" ta-toolbar=\"{{Config.toolbars}}\"></text-angular><md-content><md-button class=\"md-toolbar-tools\" flex=\"\" ng-model=\"vm.department.attachment\">添加附件</md-button></md-content></md-content></md-whiteframe></md-whiteframe>");
$templateCache.put("components/template/branch.info.tmp.html","<md-whiteframe class=\"md-whiteframe-z2 md-padding\" layout=\"column\"><md-whiteframe layout=\"row\" layout-align=\"space-around start\"><div class=\"md-padding layout-form\" style=\"margin: 30px 30px 0 30px;\"><div class=\"info\"><span>企 业 名 称:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.name | default}}</label></div><div class=\"info\"><span>企 业 简 称:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.shortName | default}}</label></div><div class=\"info\"><span>负 责 人:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.legalRep | default}}</label></div><div class=\"info\"><span>注 册 号:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.registeredNum | default}}</label></div><div class=\"info\"><span>地 址:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.address | default}}</label></div><div class=\"info\"><span>企 业 电 话:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.telephone | default}}</label></div><div class=\"info\"><span>传 真:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.fax | default}}</label></div><div class=\"info\"><span>邮 编:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.pc | default}}</label></div><div class=\"info\"><span>电 子 邮 箱:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.email | default}}</label></div><div class=\"info\"><span>官 方 网 站:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.website | default}}</label></div></div></md-whiteframe><md-whiteframe flex=\"\"><md-content layout=\"column\" class=\"dep-description\"><h2>公司介绍</h2><div ng-bind-html=\"vm.selectDep.description | trustHtml\"></div></md-content><md-button class=\"more-info\">查看完整信息</md-button></md-whiteframe></md-whiteframe>");
$templateCache.put("components/template/company.add.tmp.html","<md-whiteframe class=\"md-whiteframe-z2 md-padding\" layout=\"row\" layout-align=\"space-around start\" style=\"padding: 20px\"><md-whiteframe layout=\"column\" flex=\"30\"><div class=\"md-padding\"><md-input-container class=\"add-edit\"><label>企业名称</label> <input required=\"\" ng-model=\"vm.department.name\" type=\"text\"><div ng-messages=\"vm.addForm.department.name.$error\"><div ng-message=\"required\">公司名称不能为空</div></div></md-input-container><md-input-container class=\"add-edit\"><label>企业简称</label> <input required=\"\" ng-model=\"vm.department.shortName\" type=\"text\"><div ng-messages=\"vm.addForm.department.shortName.$error\"><div ng-message=\"required\">企业简称不能为空</div></div></md-input-container><md-input-container class=\"add-edit\"><label>法定代表人</label> <input required=\"\" ng-model=\"vm.department.legalRep\" type=\"text\"><div ng-messages=\"vm.addForm.department.legalRep.$error\"><div ng-message=\"required\">法定代表人不能为空</div></div></md-input-container><md-input-container class=\"add-edit\"><label>注册号</label> <input required=\"\" ng-model=\"vm.department.registeredNum\" type=\"text\"><div ng-messages=\"vm.addForm.department.registeredNum.$error\"><div ng-message=\"required\">注册号不能为空</div></div></md-input-container><md-input-container class=\"add-edit\"><label>注册资金</label> <input required=\"\" ng-model=\"vm.department.registeredCapital\" type=\"text\"><div ng-messages=\"vm.addForm.department.registeredCapital.$error\"><div ng-message=\"required\">注册资金不能为空</div></div></md-input-container><md-input-container class=\"add-edit\"><label>企业地址</label> <input required=\"\" ng-model=\"vm.department.address\" type=\"text\"><div ng-messages=\"vm.addForm.department.address.$error\"><div ng-message=\"required\">企业地址不能为空</div></div></md-input-container><md-input-container class=\"add-edit\"><label>电话</label> <input ng-model=\"vm.department.telephone\" type=\"text\"></md-input-container><md-input-container class=\"add-edit\"><label>传真</label> <input ng-model=\"vm.department.fax\" type=\"text\"></md-input-container><md-input-container class=\"add-edit\"><label>邮编</label> <input ng-model=\"vm.department.pc\" type=\"text\"></md-input-container><md-input-container class=\"add-edit\"><label>电子邮箱</label> <input required=\"\" ng-model=\"vm.department.email\" type=\"email\"><div ng-messages=\"vm.addForm.department.email.$error\"><div ng-message=\"required\">输入合法的电子邮箱</div></div></md-input-container><md-input-container class=\"add-edit\"><label>开户行</label> <input ng-model=\"vm.department.bank\" type=\"text\"></md-input-container><md-input-container class=\"add-edit\"><label>开户账号</label> <input ng-model=\"vm.department.bankAccount\" type=\"text\"></md-input-container><md-input-container class=\"add-edit\"><label>官方网站</label> <input required=\"\" ng-model=\"vm.department.website\" type=\"text\"><div ng-messages=\"vm.addForm.department.website.$error\"><div ng-message=\"required\">官方网站不能为空</div></div></md-input-container></div></md-whiteframe><md-whiteframe flex=\"70\"><md-content layout=\"column\" class=\"editer-total content-border\"><md-content class=\"md-toolbar-tools\">企业介绍</md-content><text-angular ng-model=\"vm.department.description\" ta-toolbar=\"{{Config.toolbars}}\"></text-angular><md-content><md-button class=\"md-toolbar-tools\" flex=\"\" ng-model=\"vm.department.attachment\">添加附件</md-button></md-content></md-content></md-whiteframe></md-whiteframe>");
$templateCache.put("components/template/company.edit.tmp.html","<md-whiteframe class=\"md-padding\" layout=\"row\" layout-align=\"space-around start\" style=\"padding: 20px\"><md-whiteframe layout=\"column\" flex=\"30\"><form name=\"vm.addForm\" class=\"md-padding\"><md-input-container class=\"add-edit\"><label>企业名称</label> <input required=\"\" ng-model=\"vm.department.name\" type=\"text\"><div ng-messages=\"vm.addForm.department.name.$error\"><div ng-message=\"required\">公司名称不能为空</div></div></md-input-container><md-input-container class=\"add-edit\"><label>企业简称</label> <input required=\"\" ng-model=\"vm.department.shortName\" type=\"text\"><div ng-messages=\"vm.addForm.department.shortName.$error\"><div ng-message=\"required\">企业简称不能为空</div></div></md-input-container><md-input-container class=\"add-edit\"><label>法定代表人</label> <input required=\"\" ng-model=\"vm.department.legalRep\" type=\"text\"><div ng-messages=\"vm.addForm.department.legalRep.$error\"><div ng-message=\"required\">法定代表人不能为空</div></div></md-input-container><md-input-container class=\"add-edit\"><label>注册号</label> <input required=\"\" ng-model=\"vm.department.registeredNum\" type=\"text\"><div ng-messages=\"vm.addForm.department.registeredNum.$error\"><div ng-message=\"required\">注册号不能为空</div></div></md-input-container><md-input-container class=\"add-edit\"><label>注册资金</label> <input required=\"\" ng-model=\"vm.department.registeredCapital\" type=\"text\"><div ng-messages=\"vm.addForm.department.registeredCapital.$error\"><div ng-message=\"required\">注册资金不能为空</div></div></md-input-container><md-input-container class=\"add-edit\"><label>企业地址</label> <input required=\"\" ng-model=\"vm.department.address\" type=\"text\"><div ng-messages=\"vm.addForm.department.address.$error\"><div ng-message=\"required\">企业地址不能为空</div></div></md-input-container><md-input-container class=\"add-edit\"><label>电话</label> <input ng-model=\"vm.department.telephone\" type=\"text\"></md-input-container><md-input-container class=\"add-edit\"><label>传真</label> <input ng-model=\"vm.department.fax\" type=\"text\"></md-input-container><md-input-container class=\"add-edit\"><label>邮编</label> <input ng-model=\"vm.department.pc\" type=\"text\"></md-input-container><md-input-container class=\"add-edit\"><label>电子邮箱</label> <input required=\"\" ng-model=\"vm.department.email\" type=\"email\"><div ng-messages=\"vm.addForm.department.email.$error\"><div ng-message=\"required\">输入合法的电子邮箱</div></div></md-input-container><md-input-container class=\"add-edit\"><label>开户行</label> <input ng-model=\"vm.department.bank\" type=\"text\"></md-input-container><md-input-container class=\"add-edit\"><label>开户账号</label> <input ng-model=\"vm.department.bankAccount\" type=\"text\"></md-input-container><md-input-container class=\"add-edit\"><label>官方网站</label> <input required=\"\" ng-model=\"vm.department.website\" type=\"text\"><div ng-messages=\"vm.addForm.department.website.$error\"><div ng-message=\"required\">官方网站不能为空</div></div></md-input-container></form></md-whiteframe><md-whiteframe flex=\"70\"><md-content layout=\"column\" class=\"editer-total content-border\"><md-content class=\"md-toolbar-tools toolbar-border\">企业介绍</md-content><text-angular class=\"content-border\" ng-model=\"vm.department.description\" ta-toolbar=\"{{Config.toolbars}}\"></text-angular><md-content><md-button class=\"md-toolbar-tools\" flex=\"\" ng-model=\"vm.department.attachment\">添加附件</md-button></md-content></md-content></md-whiteframe></md-whiteframe>");
$templateCache.put("components/template/company.info.tmp.html","<md-whiteframe class=\"md-padding\" layout=\"column\"><md-whiteframe layout=\"row\" layout-align=\"space-around start\"><div class=\"md-padding layout-form\" style=\"margin: 30px 30px 0 30px;\"><div class=\"info\"><span>企 业 名 称:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.name | default}}</label></div><div class=\"info\"><span>企 业 简 称:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.shortName | default}}</label></div><div class=\"info\"><span>法 定 代 表 人:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.legalRep | default}}</label></div><div class=\"info\"><span>注 册 号:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.registeredNum | default}}</label></div><div class=\"info\"><span>注 册 资 金:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.registeredCapital | default}}</label></div><div class=\"info\"><span>企 业 地 址:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.address | default}}</label></div><div class=\"info\"><span>企 业 电 话:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.telephone | default}}</label></div><div class=\"info\"><span>传 真:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.fax | default}}</label></div><div class=\"info\"><span>邮 编:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.pc | default}}</label></div><div class=\"info\"><span>电 子 邮 箱:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.email | default}}</label></div><div class=\"info\"><span>开 户 银 行:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.bank | default}}</label></div><div class=\"info\"><span>开 户 账 号:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.bankAccount | default}}</label></div><div class=\"info\"><span>官 方 网 站:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.website | default}}</label></div></div></md-whiteframe><md-whiteframe flex=\"\"><md-content layout=\"column\" class=\"dep-description\"><h2>公司介绍</h2><div ng-bind-html=\"vm.selectDep.description | trustHtml\"></div></md-content><md-button class=\"more-info\">查看完整信息</md-button></md-whiteframe></md-whiteframe>");
$templateCache.put("components/template/department-add.tmp.html","<md-content style=\"height: 100%\"><script type=\"text/ng-template\" id=\"department_renderer.html\"><div layout=\"row\" ui-tree-handle data-nodrag layout-align=\"center center\"> <md-button data-nodrag ng-click=\"vm.toggleTree(this)\" ng-if=\"hasChild()\" aria-label=\"toggle\"><i class=\"fa\" ng-class=\"{\'fa-angle-down\': collapsed, \'fa-angle-up\': !collapsed}\"></i> </md-button> <md-button flex style=\"text-align: left\" data-nodrag ng-click=\"vm.depClick(this)\" aria-label=\"department.name\"> {{department.name}} </md-button> <md-button aria-label=\"dd\" ng-click=\"vm.addDialog(this,$event)\">+</md-button> </div> <ol ui-tree-nodes=\"\" ng-model=\"department.children\" ng-if=\"!collapsed\"> <li ng-repeat=\"department in department.children\" ui-tree-node ng-include=\"\'department_renderer.html\'\" data-nodrag> </li> </ol></script><div ui-tree=\"\" id=\"tree-root\" data-drag-enabled=\"false\"><ol ui-tree-nodes=\"\" ng-model=\"vm.departmentTree\"><li ng-repeat=\"department in vm.departmentTree\" ui-tree-node=\"\" ng-include=\"\'department_renderer.html\'\" data-nodrag=\"\"></li></ol></div></md-content>");
$templateCache.put("components/template/department.add.tmp.html","<md-whiteframe class=\"md-padding\" layout=\"row\" layout-align=\"space-around start\" style=\"padding: 20px\"><md-whiteframe layout=\"column\" flex=\"30\"><div class=\"md-padding\"><md-input-container><label>部门名称</label> <input required=\"\" ng-model=\"vm.department.name\" type=\"text\"><div ng-messages=\"vm.addForm.department.name.$error\"><div ng-message=\"required\">门名称不能为空</div></div></md-input-container><md-input-container><label>部门简称</label> <input ng-model=\"vm.department.shortName\" type=\"text\"></md-input-container><md-input-container><label>电话</label> <input ng-model=\"vm.department.telephone\" type=\"text\"></md-input-container><md-input-container><label>传真</label> <input ng-model=\"vm.department.fax\" type=\"text\"></md-input-container><md-input-container><label>地址</label> <input ng-model=\"vm.department.address\" type=\"text\"></md-input-container></div></md-whiteframe><md-whiteframe flex=\"70\"><md-content layout=\"column\" class=\"editer-total content-border\"><md-content class=\"md-toolbar-tools\">部门介绍</md-content><text-angular ng-model=\"vm.department.description\" ta-toolbar=\"{{Config.toolbars}}\"></text-angular><md-content><md-button class=\"md-toolbar-tools\" flex=\"\">添加附件</md-button></md-content></md-content></md-whiteframe></md-whiteframe>");
$templateCache.put("components/template/department.edit.tmp.html","<md-whiteframe class=\"md-whiteframe-z2 md-padding\" layout=\"column\"><md-whiteframe layout=\"row\" layout-align=\"space-around start\"><form name=\"vm.addForm\" class=\"md-padding layout-form\" style=\"margin: 30px 30px 0 30px;\"><md-input-container><label>部门名称</label> <input required=\"\" ng-model=\"vm.department.name\" type=\"text\"><div ng-messages=\"vm.addForm.department.name.$error\"><div ng-message=\"required\">门名称不能为空</div></div></md-input-container><md-input-container><label>部门简称</label> <input ng-model=\"vm.department.shortName\" type=\"text\"></md-input-container><md-input-container><label>电话</label> <input ng-model=\"vm.department.telephone\" type=\"text\"></md-input-container><md-input-container><label>传真</label> <input ng-model=\"vm.department.fax\" type=\"text\"></md-input-container><md-input-container><label>地址</label> <input ng-model=\"vm.department.address\" type=\"text\"></md-input-container></form></md-whiteframe><md-whiteframe flex=\"\"><md-content layout=\"column\" class=\"editer-total content-border\"><md-content class=\"md-toolbar-tools\">部门介绍</md-content><text-angular ng-model=\"vm.department.description\" ta-toolbar=\"{{Config.toolbars}}\"></text-angular><md-content><md-button class=\"md-toolbar-tools\" flex=\"\">添加附件</md-button></md-content></md-content></md-whiteframe></md-whiteframe>");
$templateCache.put("components/template/department.info.tmp.html","<md-whiteframe class=\"md-whiteframe-z2 md-padding\" layout=\"column\"><md-whiteframe layout=\"row\" layout-align=\"space-around start\"><div class=\"md-padding layout-form\" style=\"margin: 30px 30px 0 30px;\"><div class=\"info\"><span>部 门 名 称:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.name | default}}</label></div><div class=\"info\"><span>部 门 简 称:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.shortName | default}}</label></div><div class=\"info\"><span>电 话:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.telephone | default}}</label></div><div class=\"info\"><span>传 真:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.fax | default}}</label></div><div class=\"info\"><span>地 址:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.address | default}}</label></div></div></md-whiteframe><md-whiteframe flex=\"\"><md-content layout=\"column\" class=\"dep-description\"><h2>部门介绍</h2><div ng-bind-html=\"vm.selectDep.description | trustHtml\"></div></md-content><md-button class=\"more-info\">查看完整信息</md-button></md-whiteframe></md-whiteframe>");
$templateCache.put("components/template/department.no.info.tmp.html","<md-content class=\"md-padding\" layout-align=\"center center\">请选择部门</md-content>");
$templateCache.put("components/template/department.tmp.html","<md-content style=\"height: 100%\"><script type=\"text/ng-template\" id=\"department_renderer.html\"><div layout=\"row\" ui-tree-handle data-nodrag> <md-button data-nodrag ng-click=\"vm.toggleTree(this)\" ng-if=\"hasChild()\" aria-label=\"toggle\"><i class=\"fa\" ng-class=\"{\'fa-angle-down\': collapsed, \'fa-angle-up\': !collapsed}\"></i> </md-button> <md-button flex style=\"text-align: left\" data-nodrag ng-click=\"vm.depClick(this)\" aria-label=\"department.name\"> {{department.name}} </md-button> </div> <ol ui-tree-nodes=\"\" ng-model=\"department.children\" ng-if=\"!collapsed\"> <li ng-repeat=\"department in department.children\" ui-tree-node ng-include=\"\'department_renderer.html\'\" data-nodrag> </li> </ol></script><div ui-tree=\"\" id=\"tree-root\" data-drag-enabled=\"false\"><ol ui-tree-nodes=\"\" ng-model=\"vm.departmentTree\"><li ng-repeat=\"department in vm.departmentTree\" ui-tree-node=\"\" ng-include=\"\'department_renderer.html\'\" data-nodrag=\"\"></li></ol></div></md-content>");
$templateCache.put("components/template/dlg.dep.tmp.html","<md-dialog aria-label=\"选择部门\"><md-content><md-subheader class=\"md-sticky-no-effect\" style=\"background-color: #003399; color:white\">选择部门</md-subheader><div><div ng-include=\"\" src=\"\'components/template/department.tmp.html\'\"></div></div></md-content></md-dialog>");
$templateCache.put("components/template/dlg.edit.salary.tmp.html","<md-dialog aria-label=\"输入\"><md-content><md-subheader class=\"md-sticky-no-effect\" style=\"margin-left:-15px\">{{vm.header || \'请输入\'}}</md-subheader><form name=\"vm.inputForm\" layout=\"column\"><md-input-container><label>{{vm.name}}</label> <input required=\"\" type=\"number\" ng-model=\"vm.value\"></md-input-container><md-content layout=\"row\" layout-align=\"space-around center\"><md-button ng-click=\"vm.cancel()\" style=\"color: #999\">取消</md-button><md-button ng-click=\"vm.submit()\" style=\"color: #999\">确定</md-button></md-content></form></md-content></md-dialog>");
$templateCache.put("components/template/dlg.position.tmp.html","<md-dialog aria-label=\"选择岗位\"><md-content layout=\"column\" layout-align=\"center center\"><md-list><md-item ng-repeat=\"position in vm.positions\" style=\"width: 100%\"><md-button ng-click=\"vm.answer(position)\" style=\"width: 100%;color: #000000\">{{position.name}}</md-button></md-item></md-list><label ng-if=\"vm.positions.length < 1\">该部门下没有岗位</label><br><md-button ng-click=\"vm.cancel()\">取消</md-button></md-content></md-dialog>");
$templateCache.put("components/template/dlg.type.tmp.html","<md-dialog aria-label=\"选择类型\"><md-content><md-subheader class=\"md-sticky-no-effect\">选择类型</md-subheader><md-list><md-item ng-repeat=\"item in items\"><md-button aria-label=\"{{item.name}}\" ng-click=\"select(item)\" style=\"width: 100%\">{{item.name}}</md-button></md-item></md-list></md-content></md-dialog>");
$templateCache.put("components/template/pro.department.add.tmp.html","<md-whiteframe class=\"md-padding\" layout=\"row\" layout-align=\"space-around start\" style=\"padding: 20px\"><md-whiteframe layout=\"column\" flex=\"30\"><div class=\"md-padding\"><md-input-container><label>部门名称</label> <input required=\"\" addform=\"vm.department.name\" type=\"text\"><div ng-messages=\"vm.addForm.department.name.$error\"><div ng-message=\"required\">门名称不能为空</div></div></md-input-container><md-input-container><label>部门简称</label> <input addform=\"vm.department.shortName\" type=\"text\"></md-input-container><md-input-container><label>电话</label> <input addform=\"vm.department.telephone\" type=\"text\"></md-input-container><md-input-container><label>传真</label> <input addform=\"vm.department.fax\" type=\"text\"></md-input-container><md-input-container><label>地址</label> <input addform=\"vm.department.address\" type=\"text\"></md-input-container></div></md-whiteframe><md-whiteframe flex=\"\"><md-content layout=\"column\" class=\"editer-total content-border\"><md-content class=\"md-toolbar-tools\">项目部介绍</md-content><text-angular addform=\"vm.department.description\" ta-toolbar=\"{{Config.toolbars}}\"></text-angular><md-content><md-button class=\"md-toolbar-tools\" flex=\"\">添加附件</md-button></md-content></md-content></md-whiteframe></md-whiteframe>");
$templateCache.put("components/template/pro.department.edit.tmp.html","<md-whiteframe class=\"md-whiteframe-z2 md-padding\" layout=\"column\"><md-whiteframe layout=\"row\" layout-align=\"space-around start\"><form name=\"vm.addForm\" class=\"md-padding layout-form\" style=\"margin: 30px 30px 0 30px;\"><md-input-container><label>部门名称</label> <input required=\"\" ng-model=\"vm.department.name\" type=\"text\"><div ng-messages=\"vm.addForm.department.name.$error\"><div ng-message=\"required\">门名称不能为空</div></div></md-input-container><md-input-container><label>部门简称</label> <input ng-model=\"vm.department.shortName\" type=\"text\"></md-input-container><md-input-container><label>电话</label> <input ng-model=\"vm.department.telephone\" type=\"text\"></md-input-container><md-input-container><label>传真</label> <input ng-model=\"vm.department.fax\" type=\"text\"></md-input-container><md-input-container><label>地址</label> <input ng-model=\"vm.department.address\" type=\"text\"></md-input-container></form></md-whiteframe><md-whiteframe flex=\"\"><md-content layout=\"column\" class=\"editer-total content-border\"><md-content class=\"md-toolbar-tools\">项目部介绍</md-content><text-angular ng-model=\"vm.department.description\" ta-toolbar=\"{{Config.toolbars}}\"></text-angular><md-content><md-button class=\"md-toolbar-tools\" flex=\"\">添加附件</md-button></md-content></md-content></md-whiteframe></md-whiteframe>");
$templateCache.put("components/template/pro.department.info.tmp.html","<md-whiteframe class=\"md-whiteframe-z2 md-padding\" layout=\"column\"><md-whiteframe layout=\"row\" layout-align=\"space-around start\"><div class=\"md-padding layout-form\" style=\"margin: 30px 30px 0 30px;\"><div class=\"info\"><span>项 目 部 名 称:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.name | default}}</label></div><div class=\"info\"><span>项 目 部 简 称:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.shortName | default}}</label></div><div class=\"info\"><span>电 话:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.telephone | default}}</label></div><div class=\"info\"><span>传 真:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.fax | default}}</label></div><div class=\"info\"><span>地 址:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.address | default}}</label></div></div></md-whiteframe><md-whiteframe flex=\"\"><md-content layout=\"column\" class=\"dep-description\"><h2>项目部介绍</h2><div ng-bind-html=\"vm.selectDep.description | trustHtml\"></div></md-content><md-button class=\"more-info\">查看完整信息</md-button></md-whiteframe></md-whiteframe>");
$templateCache.put("components/template/subsidiaries.add.tmp.html","<md-whiteframe class=\"md-whiteframe-z2 md-padding\" layout=\"row\" layout-align=\"space-around start\" style=\"padding: 20px\"><md-whiteframe layout=\"column\" flex=\"30\"><div class=\"md-padding\"><md-input-container class=\"add-edit\"><label>企业名称</label> <input required=\"\" ng-model=\"vm.department.name\" type=\"text\"><div ng-messages=\"vm.addForm.department.name.$error\"><div ng-message=\"required\">企业名称不能为空</div></div></md-input-container><md-input-container class=\"add-edit\"><label>企业简称</label> <input required=\"\" ng-model=\"vm.department.shortName\" type=\"text\"><div ng-messages=\"vm.addForm.department.shortName.$error\"><div ng-message=\"required\">企业简称不能为空</div></div></md-input-container><md-input-container class=\"add-edit\"><label>法定代表人</label> <input required=\"\" ng-model=\"vm.department.legalRep\" type=\"text\"><div ng-messages=\"vm.addForm.department.legalRep.$error\"><div ng-message=\"required\">法定代表人不能为空</div></div></md-input-container><md-input-container class=\"add-edit\"><label>注册号</label> <input required=\"\" ng-model=\"vm.department.registeredNum\" type=\"text\"><div ng-messages=\"vm.addForm.department.registeredNum.$error\"><div ng-message=\"required\">注册号不能为空</div></div></md-input-container><md-input-container class=\"add-edit\"><label>注册资金</label> <input required=\"\" ng-model=\"vm.department.registeredCapital\" type=\"text\"><div ng-messages=\"vm.addForm.department.registeredCapital.$error\"><div ng-message=\"required\">注册资金不能为空</div></div></md-input-container><md-input-container class=\"add-edit\"><label>企业地址</label> <input required=\"\" ng-model=\"vm.department.address\" type=\"text\"><div ng-messages=\"vm.addForm.department.address.$error\"><div ng-message=\"required\">企业地址不能为空</div></div></md-input-container><md-input-container class=\"add-edit\"><label>电话</label> <input ng-model=\"vm.department.telephone\" type=\"text\"></md-input-container><md-input-container class=\"add-edit\"><label>传真</label> <input ng-model=\"vm.department.fax\" type=\"text\"></md-input-container><md-input-container class=\"add-edit\"><label>邮编</label> <input ng-model=\"vm.department.pc\" type=\"text\"></md-input-container><md-input-container class=\"add-edit\"><label>电子邮箱</label> <input required=\"\" ng-model=\"vm.department.email\" type=\"email\"><div ng-messages=\"vm.addForm.department.email.$error\"><div ng-message=\"required\">输入合法的电子邮箱</div></div></md-input-container><md-input-container class=\"add-edit\"><label>开户行</label> <input ng-model=\"vm.department.bank\" type=\"text\"></md-input-container><md-input-container class=\"add-edit\"><label>开户账号</label> <input ng-model=\"vm.department.bankAccount\" type=\"text\"></md-input-container><md-input-container class=\"add-edit\"><label>官方网站</label> <input required=\"\" ng-model=\"vm.department.website\" type=\"text\"><div ng-messages=\"vm.addForm.department.website.$error\"><div ng-message=\"required\">官方网站不能为空</div></div></md-input-container></div></md-whiteframe><md-whiteframe flex=\"70\"><md-content layout=\"column\" class=\"editer-total content-border\"><md-content class=\"md-toolbar-tools\">企业介绍</md-content><text-angular ng-model=\"vm.department.description\" ta-toolbar=\"{{Config.toolbars}}\"></text-angular><md-content><md-button class=\"md-toolbar-tools\" flex=\"\" ng-model=\"vm.department.attachment\">添加附件</md-button></md-content></md-content></md-whiteframe></md-whiteframe>");
$templateCache.put("components/template/subsidiaries.edit.tmp.html","<md-whiteframe class=\"md-whiteframe-z2 md-padding\" layout=\"row\" layout-align=\"space-around start\" style=\"padding: 20px\"><md-whiteframe layout=\"column\" flex=\"30\"><form name=\"vm.addForm\" class=\"md-padding\"><md-input-container class=\"add-edit\"><label>企业名称</label> <input required=\"\" ng-model=\"vm.department.name\" type=\"text\"><div ng-messages=\"vm.addForm.department.name.$error\"><div ng-message=\"required\">企业名称不能为空</div></div></md-input-container><md-input-container class=\"add-edit\"><label>企业简称</label> <input required=\"\" ng-model=\"vm.department.shortName\" type=\"text\"><div ng-messages=\"vm.addForm.department.shortName.$error\"><div ng-message=\"required\">企业简称不能为空</div></div></md-input-container><md-input-container class=\"add-edit\"><label>法定代表人</label> <input required=\"\" ng-model=\"vm.department.legalRep\" type=\"text\"><div ng-messages=\"vm.addForm.department.legalRep.$error\"><div ng-message=\"required\">法定代表人不能为空</div></div></md-input-container><md-input-container class=\"add-edit\"><label>注册号</label> <input required=\"\" ng-model=\"vm.department.registeredNum\" type=\"text\"><div ng-messages=\"vm.addForm.department.registeredNum.$error\"><div ng-message=\"required\">注册号不能为空</div></div></md-input-container><md-input-container class=\"add-edit\"><label>注册资金</label> <input required=\"\" ng-model=\"vm.department.registeredCapital\" type=\"text\"><div ng-messages=\"vm.addForm.department.registeredCapital.$error\"><div ng-message=\"required\">注册资金不能为空</div></div></md-input-container><md-input-container class=\"add-edit\"><label>企业地址</label> <input required=\"\" ng-model=\"vm.department.address\" type=\"text\"><div ng-messages=\"vm.addForm.department.address.$error\"><div ng-message=\"required\">企业地址不能为空</div></div></md-input-container><md-input-container class=\"add-edit\"><label>电话</label> <input ng-model=\"vm.department.telephone\" type=\"text\"></md-input-container><md-input-container class=\"add-edit\"><label>传真</label> <input ng-model=\"vm.department.fax\" type=\"text\"></md-input-container><md-input-container class=\"add-edit\"><label>邮编</label> <input ng-model=\"vm.department.pc\" type=\"text\"></md-input-container><md-input-container class=\"add-edit\"><label>电子邮箱</label> <input required=\"\" ng-model=\"vm.department.email\" type=\"email\"><div ng-messages=\"vm.addForm.department.email.$error\"><div ng-message=\"required\">输入合法的电子邮箱</div></div></md-input-container><md-input-container class=\"add-edit\"><label>开户行</label> <input ng-model=\"vm.department.bank\" type=\"text\"></md-input-container><md-input-container class=\"add-edit\"><label>开户账号</label> <input ng-model=\"vm.department.bankAccount\" type=\"text\"></md-input-container><md-input-container class=\"add-edit\"><label>官方网站</label> <input required=\"\" ng-model=\"vm.department.website\" type=\"text\"><div ng-messages=\"vm.addForm.department.website.$error\"><div ng-message=\"required\">官方网站不能为空</div></div></md-input-container></form></md-whiteframe><md-whiteframe flex=\"70\"><md-content layout=\"column\" class=\"editer-total content-border\"><md-content class=\"md-toolbar-tools\">企业介绍</md-content><text-angular ng-model=\"vm.department.description\" ta-toolbar=\"{{Config.toolbars}}\"></text-angular><md-content><md-button class=\"md-toolbar-tools\" flex=\"\" ng-model=\"vm.department.attachment\">添加附件</md-button></md-content></md-content></md-whiteframe></md-whiteframe>");
$templateCache.put("components/template/subsidiaries.info.tmp.html","<md-whiteframe class=\"md-whiteframe-z2 md-padding\" layout=\"column\"><md-whiteframe layout=\"row\" layout-align=\"space-around start\"><div class=\"md-padding layout-form\" style=\"margin: 30px 30px 0 30px;\"><div class=\"info\"><span>企 业 名 称:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.name | default}}</label></div><div class=\"info\"><span>企 业 简 称:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.shortName | default}}</label></div><div class=\"info\"><span>法 定 代 表 人:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.legalRep | default}}</label></div><div class=\"info\"><span>注 册 号:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.registeredNum | default}}</label></div><div class=\"info\"><span>注 册 资 金:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.registeredCapital | default}}</label></div><div class=\"info\"><span>企 业 地 址:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.address | default}}</label></div><div class=\"info\"><span>企 业 电 话:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.telephone | default}}</label></div><div class=\"info\"><span>传 真:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.fax | default}}</label></div><div class=\"info\"><span>邮 编:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.pc | default}}</label></div><div class=\"info\"><span>电 子 邮 箱:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.email | default}}</label></div><div class=\"info\"><span>开 户 银 行:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.bank | default}}</label></div><div class=\"info\"><span>开 户 账 号:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.bankAccount | default}}</label></div><div class=\"info\"><span>官 方 网 站:<b class=\"force_justify\"></b></span> <label>{{vm.selectDep.website | default}}</label></div></div></md-whiteframe><md-whiteframe flex=\"\"><md-content layout=\"column\" class=\"dep-description\"><h2>子公司介绍</h2><div ng-bind-html=\"vm.selectDep.description | trustHtml\"></div></md-content><md-button class=\"more-info\">查看完整信息</md-button></md-whiteframe></md-whiteframe>");
$templateCache.put("components/directive/menuLink/menu-link.tmpl.html","<md-button ng-class=\"{\'active\' : isSelected()}\" ng-click=\"focusSection(section,$event)\">{{section | humanizeDoc}} <span class=\"visually-hidden\" ng-if=\"isSelected()\">current page</span></md-button>");
$templateCache.put("components/directive/menuToggle/menu-toggle.tmpl.html","<md-button class=\"md-button-toggle\" ng-click=\"toggle()\" aria-controls=\"docs-menu-{{section.name | nospace}}\" flex=\"\" layout=\"row\" aria-expanded=\"{{isOpen()}}\">{{section.name}} <span aria-hidden=\"true\" class=\"md-toggle-icon\" ng-class=\"{\'toggled\' : isOpen()}\"></span> <span class=\"visually-hidden\">Toggle {{isOpen()? \'expanded\' : \'collapsed\'}}</span></md-button><ul ng-show=\"isOpen()\" id=\"docs-menu-{{section.name | nospace}}\" class=\"menu-toggle-list\"><li ng-repeat=\"page in section.children\"><menu-link section=\"page\"></menu-link></li></ul>");
$templateCache.put("components/template/dlg/rest.error.html","<md-dialog aria-label=\"输入\"><md-content layout=\"column\" layout-align=\"center center\"><h2>{{vm.title}}</h2><br><p>{{vm.content}}</p><br><md-button ng-click=\"vm.cancel()\">确定</md-button></md-content></md-dialog>");
$templateCache.put("components/template/dlg/rest.progress.html","<md-dialog aria-label=\"输入\"><md-content layout=\"column\" layout-align=\"center center\"><h2>{{vm.content}}</h2><br><md-progress-circular md-mode=\"indeterminate\"></md-progress-circular></md-content></md-dialog>");}]);