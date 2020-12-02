/* eslint-disable require-jsdoc */
import {Message} from 'element-ui'
import TRTC      from 'trtc-js-sdk'

import store          from './../store'
export default class RtcClient {
    constructor(options) {
        console.log(options)
        this.sdkAppId_ = options.sdkAppId
        this.userId_ = options.userId
        this.userSig_ = options.userSig
        this.roomId_ = options.roomId
        this.isJoined_ = false
        this.isPublished_ = false
        this.localStream_ = null
        this.remoteStreams_ = []
        this.cameraId = null
        // check if browser is compatible with TRTC
        TRTC.checkSystemRequirements().then(result => {
            if (!result) {
                alert('Your browser is not compatible with TRTC! Please download Chrome M72+')
            }
        })
    }

    async join() {
        if (this.isJoined_) {
            console.warn('duplicate RtcClient.join() observed')
            return
        }

        // create a client for RtcClient
        this.client_ = TRTC.createClient({
            mode: 'videoCall', // 实时通话模式
            sdkAppId: this.sdkAppId_,
            userId: this.userId_,
            userSig: this.userSig_

        })

        // 处理 client 事件
        this.handleEvents()

        try {
            // join the room
            await this.client_.join({roomId: this.roomId_})
            console.log('进房成功！')
            // Message.success('进房成功！')
            this.isJoined_ = true
            store.dispatch('app/savelog', {userid: this.userId_, msg: '进房成功'}).then(res=>{
                console.log(res);
            }).catch(err=>{
                console.log(err);
            })
        } catch (error) {
            store.dispatch('app/savelog', {userid: this.userId_, msg: '进房失败'}).then(res=>{
                console.log(res);
            }).catch(err=>{
                console.log(err);
            })
            alert('进房失败原因：' + error)
            // Message.error('进房错误！')
            return
        }
        try {
            // 采集摄像头和麦克风视频流
            await this.createLocalStream({audio: true, video: true})
            // Message.info('摄像头及麦克风采集成功！')
            store.dispatch('app/savelog', {userid: this.userId_, msg: '摄像头及麦克风采集成功'}).then(res=>{
                console.log(res);
            }).catch(err=>{
                console.log(err);
            })
        } catch (error) {
            store.dispatch('app/savelog', {userid: this.userId_, msg: '摄像头和麦克风未授予其访问权限'}).then(res=>{
                console.log(res);
            }).catch(err=>{
                console.log(err);
            })
            console.error('createLocalStream with audio/video failed: ' + error)
            alert(
                '请确认已连接摄像头和麦克风并授予其访问权限！'
            )

            try {
                // fallback to capture camera only
                await this.createLocalStream({audio: false, video: true})
                // Message.info('采集摄像头成功！')
            } catch (error) {
                console.error('createLocalStream with video failed: ' + error)
                return
            }
        }
        this.localStream_.on('player-state-changed', event => {
            console.log(`local stream ${event.type} player is ${event.state}`)
            if (event.type === 'video' && event.state === 'PLAYING') {
                // dismiss the remote user UI placeholder
            } else if (event.type === 'video' && event.state === 'STOPPPED') {
                // show the remote user UI placeholder
            }
        })
        // publish local stream by default after join the room
        await this.publish()
        // 在名为 ‘local_stream’ 的 div 容器上播放本地音视频
        this.localStream_.play('local_stream')
        // Message.success('发布本地流成功！')
        console.log('发布本地流成功！');
        //this.getCameraId()
    }
    async getCameraId(){
        let cameras = null
        TRTC.getCameras().then(devices => {
            cameras = devices
            console.log(cameras);
            let type = '' //sessionStorage.getItem('videoType')
            let type2 = 'YRPPB311'// 支付盒子
            if (sessionStorage.getItem('neddHighShotMeterType') === '1') {
                let cameraText=sessionStorage.getItem('cameraMainText')
                type = cameraText.substring(0,4)
            } else if (sessionStorage.getItem('neddHighShotMeterType') === '2') {
                type = 'S300L'
            } else if (sessionStorage.getItem('neddHighShotMeterType') === '3') {
                type = 'S818YJ'
            } else if (sessionStorage.getItem('neddHighShotMeterType') === '4') {
                type = 'S200L'
            }
            let n = cameras.filter((item, index) => {
                if (item.label.includes(type) === false && item.label.includes(type2) === false) {
                    // 存储当前选择摄像头的索引
                    store.commit('user/SET_CAMERASIDX', index)
                } else{
                    console.log('cishipaochule she bei :',item.label)
                }
                return item.label.includes(type) === false && item.label.includes(type2) === false
            })
            if (n.length !== 0) {
                this.cameraId = n[ 0 ].deviceId
                console.log(n[0].deviceId);

            }

        })
        //获取到cameraid再执行join
        await this.join()
    }
    async saveCameras(){
        let cameras = null
        TRTC.getCameras().then(devices => {
            cameras = devices
            console.log(cameras);
            store.commit('user/SET_CAMERASARR', cameras)
        })
    }
    async switchCamera (id) {
        let cameras = null
        TRTC.getCameras().then(devices => {
            cameras = devices
            if (id == cameras.length){
                return false
        }
            if (cameras.length !== 0) {
                this.localStream_.switchDevice('video', cameras[ id ].deviceId).then(() => {
                    this.cameraId = cameras[ id ].deviceId
                }).catch(err => {
                    console.log(err, "切换失败")
                })
            }
        })
    }
    async switchCameraClick () {
        let cameras = null
        let camindex = -1
        TRTC.getCameras().then(devices => {
            console.log(devices);
            console.log('摄像头设备',this.cameraId);
            devices.forEach((dev,index) => {
                if (this.cameraId == dev.deviceId){
                    console.log(this.cameraId);
                    console.log('相等打印');
                    console.log(dev);
                    camindex = (index+1)%devices.length;
                    console.log(camindex);
                }
            })
            console.log(devices.length);
            //camindex = Number((camindex + 1) % devices.length)
            console.log('-----------------------------------');
            console.log(camindex);
            console.log(devices[camindex].deviceId);
            if (devices.length !== 0) {
                this.localStream_.switchDevice('video', devices[camindex].deviceId).then(() => {
                    this.cameraId = devices[camindex].deviceId
                    console.log("成功切换")
                }).catch(err => {
                    console.log(err, "切换失败")
                })
            }
        })
    }
    async leave() {
        if (!this.isJoined_) {
            console.warn('leave() - leave without join()d observed')
            Message.error('请先加入房间！')
            return
        }

        if (this.isPublished_) {
            // ensure the local stream has been unpublished before leaving.
            await this.unpublish(true)
        }
        try {
            // leave the room
            console.log('离开房间，结束推流，离开房间，关闭摄像头的界面显示');
            await this.client_.leave()
            this.localStream_.stop()
            this.localStream_.close()
            this.localStream_ = null
            this.isJoined_ = false

        } catch (error) {
            console.error('failed to leave the room because ' + error)
            location.reload()
        }
        /*finally {
            const videoTrack = this.localStream_.getVideoTrack();
            if (videoTrack) {
                this.localStream_.removeTrack(videoTrack).then(() => {
                    console.log('remove video call success');
                    // 关闭摄像头
                    videoTrack.stop();
                });
            }
            // 停止本地流，关闭本地流内部的音视频播放器
            this.localStream_.stop()
            // 关闭本地流，释放摄像头和麦克风访问权限
            this.localStream_.close()
            this.localStream_ = null
        }*/
    }

    async publish() {
        if (!this.isJoined_) {
            Message.error('请先加入房间再点击开始推流！')
            console.warn('publish() - please join() firstly')
            return
        }
        if (this.isPublished_) {
            console.warn('duplicate RtcClient.publish() observed')
            // Message.error('当前正在推流！')
            return
        }
        try {
            // 发布本地流
            await this.client_.publish(this.localStream_)
            //Message.info('发布本地流成功！')
            console.log('发布本地流成功。。。。');
            this.isPublished_ = true
        } catch (error) {
            console.error('failed to publish local stream ' + error)
            //Message.error('发布本地流失败！')
            console.log('发布本地流失败。。。。');
            this.isPublished_ = false
        }
        this.isPublished_ = true
    }

    async unpublish(isLeaving) {
        if (!this.isJoined_) {
            console.warn('unpublish() - please join() firstly')
            //Message.error('请先加入房间再停止推流！')
            console.log('请先加入房间再停止推流1');
            return
        }
        if (!this.isPublished_) {
            console.warn('RtcClient.unpublish() called but not published yet')
            //Message.error('当前尚未发布本地流！')
            return
        }

        try {
            // 停止发布本地流
            await this.client_.unpublish(this.localStream_)
            this.isPublished_ = false
            console.log('停止发布本地流成功。。。。');
            //Message.info('停止发布本地流成功！')
        } catch (error) {
            console.error('failed to unpublish local stream because ' + error)
            // Message.error('停止发布本地流失败！')
            if (!isLeaving) {
                console.warn('leaving the room because unpublish failure observed')
                // Message.error('停止发布本地流失败，退出房间！')
                this.leave()
            }
        }
    }

    async createLocalStream(options) {
        console.log("cameraId---------------:"+this.cameraId)
        if (this.cameraId==null) {
            this.localStream_ = TRTC.createStream({
                audio: options.audio, // 采集麦克风
                video: options.video, // 采集摄像头
                userId: this.userId_,
                //cameraId: this.cameraId,
                //microphoneId: this.getMicrophoneId(),
                mirror:true
            })
        }else{
            this.localStream_ = TRTC.createStream({
                audio: options.audio, // 采集麦克风
                video: options.video, // 采集摄像头
                userId: this.userId_,
                cameraId: this.cameraId,
                //microphoneId: this.getMicrophoneId(),
                mirror:true
            })
        }

        // 设置视频分辨率帧率和码率
        this.localStream_.setVideoProfile('480p')
        await this.localStream_.initialize()
    }
    getMicrophoneId(){

    }
    handleEvents() {
        // 处理 client 错误事件，错误均为不可恢复错误，建议提示用户后刷新页面
        this.client_.on('error', err => {
            console.error(err)
            alert(err)
            //Message.error('客户端错误：' + err)
            // location.reload();
        })

        // 处理用户被踢事件，通常是因为房间内有同名用户引起，这种问题一般是应用层逻辑错误引起的
        // 应用层请尽量使用不同用户ID进房
        this.client_.on('client-banned', err => {
            console.log('用户被踢出房间')
            console.log(err);
            store.commit('user/SET_REMOTELEAVE', true)
            store.dispatch('app/savelog', {userid: this.userId_, msg: '用户被踢出房间true'}).then(res=>{
                console.log(res);
            }).catch(err=>{
                console.log(err);
            })
            // Message.error('用户被踢出房间！')
            // location.reload();
        })

        // 远端用户进房通知 - 仅限主动推流用户
        this.client_.on('peer-join', evt => {
            const userId = evt.userId
            store.commit('user/SET_REMOTELEAVE', false)
            console.log('远端用户进房' + userId)
            store.dispatch('app/savelog', {userid: userId, msg: '远端用户进房通知false'}).then(res=>{
                console.log(res);
            }).catch(err=>{
                console.log(err);
            })
            // Message.info('远端用户进房 - ' + userId)
        })
        // 远端用户退房通知 - 仅限主动推流用户
        this.client_.on('peer-leave', evt => {
            const userId = evt.userId
            store.commit('user/SET_REMOTELEAVE', true)
            console.log('远端用户退房通知 - 仅限主动推流用户' + userId)
            store.dispatch('app/savelog',{userid: userId, msg: '远端用户退房true'}).then(res=>{})
            // Message.success('远端用户退房 - ' + userId)
        })

        // 处理远端流增加事件
        this.client_.on('stream-added', evt => {
            const remoteStream = evt.stream
            const id = remoteStream.getId()
            const userId = remoteStream.getUserId()
            // Message.info('远端流增加 - ' + userId)
            // 远端流默认已订阅所有音视频，此处可指定只订阅音频或者音视频，不能仅订阅视频。
            // 如果不想观看该路远端流，可调用 this.client_.unsubscribe(remoteStream) 取消订阅
            this.client_.subscribe(remoteStream)
        })

        // 远端流订阅成功事件
        this.client_.on('stream-subscribed', evt => {
            const remoteStream = evt.stream
            const id = remoteStream.getId()
            this.remoteStreams_.push(remoteStream)
            // 在指定的 div 容器上播放音视频
            remoteStream.play('remote_stream')
            console.log('远端流订阅成功')
            // Message.info('远端流订阅成功 - ' + remoteStream.getUserId())
        })

        // 处理远端流被删除事件
        this.client_.on('stream-removed', evt => {
            const remoteStream = evt.stream
            const id = remoteStream.getId()
            // 关闭远端流内部的音视频播放器
            remoteStream.stop()
            this.remoteStreams_ = this.remoteStreams_.filter(stream => {
                return stream.getId() !== id
            })
            store.commit('user/SET_REMOTELEAVE', true)
            store.dispatch('app/savelog',{userid: evt.userId, msg: '远端流被删除true'}).then(res=>{})
            // removeView(id)
            console.log(`远端流被删除`)
            // Message.info('远端流删除 - ' + remoteStream.getUserId())
        })

        // 处理远端流更新事件，在音视频通话过程中，远端流音频或视频可能会有更新
        this.client_.on('stream-updated', evt => {
            const remoteStream = evt.stream
            console.log(
                'type: ' +
                remoteStream.getType() +
                ' stream-updated hasAudio: ' +
                remoteStream.hasAudio() +
                ' hasVideo: ' +
                remoteStream.hasVideo()
            )
            // Message.info('远端流更新！')
        })

        // 远端流音频或视频mute状态通知
        this.client_.on('mute-audio', evt => {
            console.log(evt.userId + ' mute audio')
        })
        this.client_.on('unmute-audio', evt => {
            console.log(evt.userId + ' unmute audio')
        })
        this.client_.on('mute-video', evt => {
            console.log(evt.userId + ' mute video')
        })
        this.client_.on('unmute-video', evt => {
            console.log(evt.userId + ' unmute video')
        })

        // 信令通道连接状态通知
        this.client_.on('connection-state-changed', evt => {
            console.log(`RtcClient state changed to ${evt.state} from ${evt.prevState}`)
        })
    }
}
