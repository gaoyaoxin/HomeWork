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
