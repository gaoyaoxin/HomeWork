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