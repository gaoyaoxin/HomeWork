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