/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * credential: 跨域
 *
 */


const dev = {
    routerMode: 'history', // hash
    /* beta */
    // baseUrl: 'https://yunservice.inca.com.cn/', //正式
    baseUrl: `https://service.he-mingtang.com/`,      // 测试
    // baseUrl: `http://lws.test.inca.com.cn/`, // 开发
    credential: true,
};

const prod = {
    ...dev,
};

export default process.env.NODE_ENV === 'development' ? dev : prod;
