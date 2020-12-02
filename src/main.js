import Vue       from 'vue'
import App       from './App.vue'
import router    from './router'
import store     from './store'
import filters   from './filters'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Cookies   from 'js-cookie'
import 'xe-utils'
import VXETable  from 'vxe-table'
import 'vxe-table/lib/index.css'
import {
    message
} from '@/common/resetMessage'

VXETable.setup({
    // 默认表格参数
    size: 'small',
    showOverflow: true,
    showHeaderOverflow: true,
    align: 'center',
    headerAlign: 'center',
    stripe: false,
    border: false,
    resizable: true,
    fit: true,
    showHeader: true,
    highlightCurrentRow: false,
    highlightHoverRow: false,
    highlightCurrentColumn: false,
    highlightHoverColumn: false,
    export: {}, // 导出默认参数
    import: {}, // 导入默认参数
    zIndex: 100, // 全局 zIndex 起始值
    rowId: '_XID',
    radioConfig: {
        trigger: 'default'
    },
    checkboxConfig: {
        trigger: 'default'
    },
    sortConfig: {
        remote: false,
        trigger: 'default'
    },
    filterConfig: {
        remote: false
    },
    expandConfig: {
        trigger: 'default'
    },
    treeConfig: {
        children: 'children',
        hasChild: 'hasChild',
        indent: 20
    },
    tooltipConfig: {
        theme: 'dark'
    },
    validConfig: {
        message: 'default'
    },
    // 版本号（对于某些带 Storage 数据储存的功能有用到，上升版本号可以用于重置 Storage 数据）
    version: 0,
    // 配置式表格的默认参数
    grid: {
        proxyConfig: {
            autoLoad: true,
            message: true,
            props: {
                list: null,
                result: 'result',
                total: 'page.total'
            }
        }
    },
    // 默认快捷菜单
    menu: {},
    // 默认 tooltip 主题样式
    tooltip: {
        trigger: 'hover',
        theme: 'dark'
    },
    // 默认分页参数
    pager: {
        perfect: true,
        pageSize: 10,
        pagerCount: 7,
        pageSizes: [10,
            15,
            20,
            50,
            100],
        layouts: ['PrevJump',
            'PrevPage',
            'Jump',
            'PageCount',
            'NextPage',
            'NextJump',
            'Sizes',
            'Total'] // 非常灵活的分页布局，支持任意位置随意换
    },
    // 默认工具栏参数
    toolbar: {
        refresh: false,
        import: {
            mode: 'covering'
        },
        export: {
            types: ['csv',
                'html',
                'xml',
                'txt']
        },
        resizable: {
            storage: false
        },
        custom: {
            storage: false
        },
        buttons: []
    },
    // 默认模态窗口参数
    modal: {
        minWidth: 340,
        minHeight: 200,
        lockView: true,
        mask: true,
        duration: 3000,
        marginSize: 8,
        dblclickZoom: true,
        remember: false,
        animat: true
    },
    // 默认优化配置项
    optimization: {
        animat: true,
        delayHover: 250,
        scrollX: {
            gt: 100
        },
        scrollY: {
            gt: 500
        }
    },
    // 集成国际化（将对列头、校验提示..进行自动翻译）

})

Vue.use(VXETable)
Vue.use(ElementUI)

Vue.config.productionTip = true
//系统错误捕获
const errorHandler = (error, vm) => {
    console.error('抛出全局异常');
    console.error(vm);
    console.error(error);
}
Vue.config.errorHandler = errorHandler;
Vue.prototype.$throw = (error) => errorHandler(error, this);

import VueSocketio from 'vue-socket.io';
import socketio from 'socket.io-client';

console.log(window.location.pathname);
if (window.location.pathname === '/home/remoteCall/callDoctor' || window.location.pathname === '/home/remoteCall/doctorVideo') {
    Vue.use(VueSocketio, socketio('https://ws.he-mingtang.com', {
    // Vue.use(VueSocketio, socketio('https://socketprod.inca.com.cn', { // 正式
        transports: ['websocket', 'xhr-polling', 'jsonp-polling']
    }));
} else {
    Vue.use(VueSocketio, socketio('https://ws.he-mingtang.com', {
    // Vue.use(VueSocketio, socketio('https://dzsf.inca.com.cn', { // 正式
        transports: ['websocket', 'xhr-polling', 'jsonp-polling']
    }));
}
Vue.prototype.$message = message

// 全局过滤器
Object.keys(filters).forEach(filterName => {
    Vue.filter(filterName, filters[filterName])
})
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
