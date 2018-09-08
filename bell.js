    Bell = function (options,callback) {
        this.callback = callback;
        this.id = options.id;
        this.overTime = (options.overTime>9 || options.overTime<1)?9000:options.overTime*1000 || 9000;   //超时的时间
        this.reverse = options.reverse||false;
        this.x = options.startTime||1;  //起始时间
        this.tick = options.tick || 40; //帧数
        this.leftTime = this.overTime;
        this.x = 100;
        this.y = 60;
        this.radius = 47;
        this.isover = true;
        this.init();
    }
    Bell.prototype={
        init: function (){
            let _this = this;

            let p = Math.random();
            document.getElementById(this.id).innerHTML = "" +
                "<canvas id=\"bell" + p + '\"' +
                "width=\"200px\" height=\"120px\" style=\"border: solid gray 1px;\">" +
                "</canvas>" +
                "<audio id='audio' autoplay muted loop>" +
                "<source src=\"\.\/bell.wav\" type=\"audio/ogg\">" +
                "老电视声音无法在该浏览器播放" +
                "</audio>";
            this.el = document.getElementById("bell" + p);
            this.audio = document.getElementById('audio')
            this.ctx = this.el.getContext("2d");
            document.getElementById(this.id).addEventListener('touchstart',function (e) {
                if(_this.isover){
                    e.preventDefault();
                    _this.start();
                }
            })
            this.el.addEventListener('click',function (e) {
                if(_this.isover){
                    e.preventDefault();
                    _this.start();
                }
            })
            _this.drawBell();
            _this.drawNumber(this.ctx,0);
        },
        start(){
            let _this = this;
            _this.audio.muted = null;
            _this.isover = false;
            let drawInterval = _this.drawInterval||(1000/_this.tick);
            _this.startTime = new Date();
            _this.intervalHandler = setInterval(function () {
                _this.onTimer();
            },drawInterval)
        },
        onTimer(){
            let _this = this;

            let t = new Date() - _this.startTime;
            _this.leftTime = t;
            if(t > _this.overTime){
                clearInterval(_this.intervalHandler);
                _this.audio.muted = "muted";
                _this.isover = true;
                _this.callback();
            }

            _this.drawBell();
            let tmpT;
            if(_this.reverse){
                tmpT = Math.ceil((_this.overTime - t)/1000) ;
            }else{
                tmpT = Math.floor((t)/1000) ;
            }
            _this.drawNumber(this.ctx,tmpT);
            _this.preSecond = tmpT;
        },
        drawBell(){
            let ctx = this.ctx;
            //背景渐变色
            this.drawMask(ctx);
            //旋转蒙版弄黑
            this.drawBlackMask(ctx)
            //圆形边框
            this.drawBorder(ctx)
            //黑色的十字线
            this.drawLines(ctx)
        },
        drawNumber(ctx,str){
            ctx.beginPath();
            ctx.font="100px Arial";
            ctx.fillStyle="black"
            ctx.fillText(str,this.x - 27,this.y+36);
        },
        drawMask(ctx){
            let grd=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.radius*2.5 *(.9+.1* Math.random()));
            grd.addColorStop(0,"#bbb");
            grd.addColorStop(.4,"#999");
            grd.addColorStop(.7,"#555");
            grd.addColorStop(1,"black");
            ctx.fillStyle=grd;
            ctx.fillRect(0,0,200,120);
        },
        drawBlackMask(ctx){
            ctx.beginPath();
            ctx.fillStyle = "rgba(0,0,0,.5)";
            let movePercentage = (this.leftTime %1000)/1000;
            ctx.moveTo(this.x,this.y);
            ctx.lineTo(this.x*2,this.y);
            ctx.arc(this.x,this.y,Math.sqrt(this.x**2+this.y**2),0,movePercentage*Math.PI*2)
            ctx.fill();
        },
        drawLines(ctx){
            ctx.beginPath();
            ctx.lineWidth=1;
            ctx.strokeStyle="black"
            ctx.moveTo(this.x,0);
            ctx.lineTo(this.x,this.y*2);
            ctx.moveTo(0,this.y);
            ctx.lineTo(this.x*2,this.y);
            ctx.stroke()
        },
        drawBorder(ctx){
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle="#bbb";
            ctx.arc(this.x,this.y,this.radius+1,0,2*Math.PI);
            ctx.arc(this.x,this.y,this.radius+12,0,2*Math.PI);
            ctx.stroke();
        }
    }
