
import QWebChannel from './../common/qwebchannel'

export default class Meter {
    constructor(options) {
        this.baseUrl = options.baseUrl
        this.socket = null
    }

    init() {
        const that = this
        this.socket = new WebSocket(this.baseUrl)
        this.socket.onclose = function () {
            console.error("web channel closed")
        }
        this.socket.onerror = function (error) {
            console.error("web channel error: " + error)
        }
        this.socket.onopen = function () {
            new QWebChannel(socket, function (channel) {
                window.dialog = channel.objects.dialog
                //网页关闭函数
                window.onbeforeunload = function () {
                    console.log('网页关闭函数')
                    window.dialog.get_actionType("closeSignal")
                }
                window.onunload = function () {
                    console.log('网页关闭函数onunload')
                    window.dialog.get_actionType("closeSignal")
                }
                //反初始化
                // document.getElementById("closeHtml").onclick = function () {
                //     dialog.get_actionType("closeSignal")
                //     var element = document.getElementById("bigPriDev")
                //     element.src = ""
                // }
                //初始化
                // document.getElementById("openHtml").onclick = function () {
                window.dialog.html_loaded("one")
                // }
                //点击拍照按钮
                document.getElementById("photographPriAudio").onclick = function () {
                    dialog.photoBtnClicked("primaryDev_")
                    dialog.get_actionType("savePhotoPriDev")
                }
                //服务器返回消息
                dialog.sendPrintInfo.connect(function (message) {
                    that.output(message)
                    // 图片保存后返回路径关键字savePhoto_success:
                    if (message.indexOf("savePhoto_success:") >= 0) {
                        let imgPath = message.substr(18)
                        console.log(imgPath, '图片保存后返回路径关键字savePhoto_success')
                    }
                })
                //接收图片流用来展示，多个，较小的base64数据
                dialog.send_priImgData.connect(function (message) {
                    var element = document.getElementById("bigPriDev")
                    if (element) {
                        element.src = "data:image/jpg;base64," + message
                    }
                })
                //接收拍照base64
                dialog.send_priPhotoData.connect(function (message) {
                    that.url = []
                    that.url.push("data:image/jpg;base64," + message)
                    that.sxSaveDoc()
                })
                that.output("ready to send/receive messages!")
                //网页加载完成信号
                dialog.html_loaded("one")
            })
        }
    }

}
