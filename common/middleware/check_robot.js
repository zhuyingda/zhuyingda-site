'use strict';

var detector = require('detector');
var chalk = require('chalk');

function getTime() {
    var date = new Date();
    return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日' +
        date.getHours() + '时' + date.getMinutes() + '分' + date.getSeconds() + '秒';
}

/**
 * middleware
 */
module.exports = think.middleware({
    /**
     * run
     */
    run: function () {
        var ua = this.http.req.headers['user-agent'];
        var visitor = detector.parse(ua);
        //未知问题，先这样写，看看问题出在哪
        if (ua === undefined) {
            console.log("异常时间：" + getTime());
            if (this.http.req.headers) {
                console.log("捕获异常，ua为undefined：", this.http.req.headers,'来自ip：',this.http.ip());
            } else if (this.http.req) {
                console.log("捕获异常，headers都没有：", this.http.req);
            } else if (this.http) {
                console.log("捕获异常，req都没有：", this.http);
            } else {
                console.log("捕获异常，this对象有问题：", this);
            }
            return;
        }
        //忽略360云监控
        if (ua.indexOf("360JK") != -1 && ua.indexOf("yunjiankong") != -1) {
            return;
        }
        if (ua.indexOf("360JK") != -1 && ua.indexOf("qiyunce") != -1) {
            return;
        }
        //忽略自己的网络请求
        if (ua.indexOf("console") != -1 && ua.indexOf("appendix") != -1 && ua.indexOf("ven") != -1) {
            return;
        }
        //忽略阿里巴巴安全扫描
        if (ua.indexOf("Alibaba.Security.Heimdall") != -1 && this.http.ip().indexOf("121.42.0") != -1) {
            return;
        }

        //360搜索隐身爬虫
        if (visitor.browser.name == "firefox" && visitor.browser.version == "7") {
            if (this.http.ip().indexOf("218.30.118") != -1 || this.http.ip().indexOf("220.181.158") != -1) {
                return;
            }
        }
        /**
         * 爬虫白名单
         * 谷歌
         */
        if (this.http.ip().indexOf("203.208.60") === 0 || this.http.ip().indexOf("66.249") === 0 || this.http.ip().indexOf("64.233") === 0) {
            if (ua.includes("Googlebot") || ua.includes("Google Web Preview") || ua.includes("Google-Site-Verification") || ua.includes("Google Favicon")) {
                console.log("[" + getTime() + "], 谷歌爬虫:", ua);
                return;
            }
        }
        /**
         * 爬虫白名单
         * 微软
         */
        if (this.http.ip().indexOf("40.77.167") === 0 || this.http.ip().indexOf("207.46.13") === 0 || this.http.ip().indexOf("157.55.39") === 0) {
            if (ua.includes("bingbot")) {
                console.log("[" + getTime() + "], 微软爬虫:", ua);
                return;
            }
        }
        /**
         * 爬虫白名单
         * 雅虎
         */
        if (this.http.ip().indexOf("68.180.230") === 0 || this.http.ip().indexOf("68.180.229") === 0) {
            if (ua.includes("yahoo")) {
                console.log("[" + getTime() + "], 雅虎爬虫:", ua);
                return;
            }
        }
        /**
         * 爬虫白名单
         * 百度
         */
        if (this.http.ip().indexOf("123.125.71") === 0 || this.http.ip().indexOf("220.181") === 0 || this.http.ip().indexOf("180.76.15") === 0) {
            if (ua.includes("Baiduspider")) {
                console.log("[" + getTime() + "], 百度爬虫:", ua);
                return;
            }
        }
        /**
         * 爬虫白名单
         * 360搜索
         */
        if (this.http.ip().indexOf("218.30.118") === 0 || this.http.ip().indexOf("220.181.158") === 0 || this.http.ip().indexOf("182.118") === 0 || this.http.ip().indexOf("101.226") === 0 || this.http.ip().indexOf("180.153") === 0) {
            if (ua.includes("360Spider") || ua.includes("HaosouSpider")) {
                console.log("[" + getTime() + "], 360搜索爬虫:", ua);
                return;
            }
        }
        /**
         * 爬虫白名单
         * 搜狗
         */
        if (this.http.ip().indexOf("61.135.189.70") === 0 || this.http.ip().indexOf("101.226.65.108") === 0) {
            if (ua.includes("sogou")) {
                console.log("[" + getTime() + "], 搜狗爬虫:", ua);
                return;
            }
        }
        /**
         * 爬虫白名单
         * 开发者头条
         */
        if (this.http.ip().indexOf("125.39.192") === 0) {
            if (ua.includes("ToutiaoSpider")) {
                console.log("[" + getTime() + "], 开发者头条爬虫:", ua);
                return;
            }
        }
        /**
         * 爬虫白名单
         * 知乎
         */
        if (this.http.ip() === "60.28.215.75" || this.http.ip() === "54.223.144.196") {
            if (ua.includes("ZhihuExternalHit")) {
                console.log("[" + getTime() + "], 知乎爬虫:", ua);
                return;
            }
        }

        //暂时放过所有机器人请求，记录其ua
        if (visitor.device.name == 'na' || visitor.os.name == 'na' || visitor.browser.name == 'na') {
            console.log(chalk.styles.red.open + "野爬机器人" + chalk.styles.red.close + ",来自IP: ", this.http.ip(), "UA:", this.http.req.headers['user-agent']);
            //console.log("referer:",this.http.referrer());
            return think.prevent();
        } else {
            var logStr = getTime() + ',' +
                " 来自IP: " + chalk.styles.yellow.open + this.http.ip() + chalk.styles.yellow.close + ", " +
                chalk.styles.blue.open + visitor.device.name + chalk.styles.blue.close + "设备, " +
                visitor.os.name + "系统(版本:" + visitor.os.version + "), " +
                chalk.styles.cyan.open + visitor.browser.name + chalk.styles.cyan.close + "浏览器(版本:" + visitor.browser.version + ")";
            console.log(logStr);
        }
    }
})