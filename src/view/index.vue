<template>
<div class="login-box" id="demo">
   <div class="input-content">
     <div class="login_tit">
          <div>
            <i class="tit-bg left"></i>
              攀枝花交警 · 重点车辆管理系统
            <i class="tit-bg right"></i>
          </div>
          <p>Pzh traffic police  key vehicle management system</p>
     </div>
     <div style="display:flex;">
       <div style="width:80%;">
          <p class="p user_icon">
            <input type="text" placeholder="账号" autocomplete="off" class="login_txtbx" v-model.lazy="loginfo.uid">
          </p> 
          <p class="p pwd_icon">
            <input type="password" placeholder="密码" autocomplete="off" class="login_txtbx" v-model.lazy="loginfo.pwd">
          </p>  
          <div style="color:white;height:30px;line-height:30px; vertical-align:middle">
            <input type="checkbox" v-model="saved" style="width:20px;height:30px; vertical-align:middle;margin-right:5px;">记住我的信息
          </div>
       </div>   
      <div class="p val_icon" style="width:20%;margin-left:10px;">
        <img style="width:100px;height:100px;" :src="qrcodeimgurl"/>
      </div>      
     </div>	
     <div class="signup">
      	  <a class="gv" href="#" id="login" @click="login()" style="font-size:1.4rem;">登&nbsp;&nbsp;录</a>{{animationid}}
          <a class="gv" href="#" style="font-size:1.4rem;">清&nbsp;&nbsp;空</a>
     </div>
   
  </div>
  <div class="canvaszz"> </div>
  <canvas id="canvas"></canvas> 
</div>
</template>

<script>
import { Loading } from 'element-ui'
export default {
  name: 'App',
  data: () => {
    return {
      uuid: null,
      loginfo: window.localStorage.getItem('loginfo') ? JSON.parse(window.localStorage.getItem('loginfo')) : {},
      saved: window.localStorage.getItem('savedflag') ? JSON.parse(window.localStorage.getItem('savedflag')) : false, 
      loadingInstance1: null,     
      ctx: null,
      qrcodeimgurl: '',
      animationid: null

    }
  },
  created () {
    this.uuid = this.$tool.generateUUID();    
    //获取二维护码
    this.$axiosClient.call('weixin/getqrcode', 'get', {scene:'scanlogin', val: this.uuid})
      .then(res => {
         this.qrcodeimgurl =  res.data
      })
      .catch(err => {
        this.$message(err)
      })  

      this.$wss.creatClient(this.uuid)      
  },
  beforeMount () {
    this.$wss.clients.push((data) => {
      if (data.event === 'scanlogon') {
        this.A_login(true)            
        this.A_user(data.user)
        this.A_mymenus(data.menus)
        this.A_code(data.codes)
        this.A_token(data.token) 
        this.$router.replace({name: 'main'})
      } else if (data.event === 'scanlogerr') {
        this.$message('扫描登录失败，请确认是否已绑定账号')
      }
    })
  },
  mounted () {
    this.updatefontsize()    
    this.animation()()
    // 当调整窗口大小时重绘canvas
    window.onresize = () => {
      this.animation()()
      this.updatefontsize()
    }    
  },
  methods: {
    login () {
      this.loadingInstance1 = Loading.service({
        fullscreen: false,
        spinner: 'el-icon-loading',
        target: '#login',
        background: 'rgba(0, 0, 0, 0.2)'
      })
      if (!(this.loginfo.uid && this.loginfo.pwd)) {
        this.$message('用户名或密码不能为空')
        this.loadingInstance1.close()
        return
      }      
      console.log(Object.assign(this.loginfo, {uuid: this.uuid}))
      this.$axiosClient.call('/sys/login', 'get', Object.assign(this.loginfo, {uuid: this.uuid}))
        .then(res => {
          if (res.status) {
            if (this.saved) {
              localStorage.setItem('loginfo', JSON.stringify(this.loginfo))
              localStorage.setItem('savedflag', JSON.stringify(this.saved))  
            } else {
              localStorage.clear()              
            }
            
            this.A_login(true)            
            this.A_user(res.data.user)
            this.A_mymenus(res.data.menus)
            this.A_code(res.data.codes) 

            this.$router.replace({name: 'main'})
          } else {
            this.$message(res.err || res.msg)
          }
          this.loadingInstance1.close()          
        })
        .catch(err => {
          this.$message(err)
          this.loadingInstance1.close()
        })      
    },
    updatefontsize () {
      let dwidth = document.documentElement.clientWidth
      if (dwidth <1024) 
        document.documentElement.style.fontSize = '11px'
      else if (dwidth < 1500) 
        document.documentElement.style.fontSize = '12px'
      else 
        document.documentElement.style.fontSize = '15px' 
    },
    animation () {
      var canvas = document.getElementById('canvas'),
          ctx = canvas.getContext('2d'),
          w = canvas.width = window.innerWidth,
          h = canvas.height = window.innerHeight,
          hue = 217,
          stars = [],
          count = 0,
          maxStars = 2500;//星星数量
      var canvas2 = document.createElement('canvas'),
          ctx2 = canvas2.getContext('2d');
      canvas2.width = 100;
      canvas2.height = 100;
      var half = canvas2.width / 2,
          gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
      gradient2.addColorStop(0.025, '#CCC');
      gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)');
      gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)');
      gradient2.addColorStop(1, 'transparent');
      ctx2.fillStyle = gradient2;
      ctx2.beginPath();
      ctx2.arc(half, half, half, 0, Math.PI * 2);
      ctx2.fill();

      // End cache

      function random(min, max) {
        if (arguments.length < 2) {
          max = min;
          min = 0;
        }

        if (min > max) {
          var hold = max;
          max = min;
          min = hold;
        }

        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      function maxOrbit(x, y) {
        var max = Math.max(x, y),
          diameter = Math.round(Math.sqrt(max * max + max * max));
        return diameter / 2;
        //星星移动范围，值越大范围越小，
      }

      var Star = function() {
        this.orbitRadius = random(maxOrbit(w, h));
        this.radius = random(60, this.orbitRadius) / 18; 
        //星星大小
        this.orbitX = w / 2;
        this.orbitY = h / 2;
        this.timePassed = random(0, maxStars);
        this.speed = random(this.orbitRadius) / 500000; 
        //星星移动速度
        this.alpha = random(2, 10) / 10;
        count++;
        stars[count] = this;
      }

      Star.prototype.draw = function() {
        var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX,
          y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY,
          twinkle = random(10);

        if (twinkle === 1 && this.alpha > 0) {
          this.alpha -= 0.05;
        } else if (twinkle === 2 && this.alpha < 1) {
          this.alpha += 0.05;
        }

        ctx.globalAlpha = this.alpha;
        ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
        this.timePassed += this.speed;
      }

      for (var i = 0; i < maxStars; i++) {
        new Star();
      }
      let progress = 0;
      let stop = null
      if (stop) window.cancelAnimationFrame(stop)
      return function run() {
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 0.5; //尾巴
        ctx.fillStyle = 'hsla(' + hue + ', 64%, 6%, 2)';
        ctx.fillRect(0, 0, w, h)

        ctx.globalCompositeOperation = 'lighter';
        for (var i = 1, l = stars.length; i < l; i++) {
          stars[i].draw();
        };
        progress += 1;
        if (progress<1000) stop = window.requestAnimationFrame(run);
        else  window.cancelAnimationFrame(stop)
      }  
    }
  },
  destroyed () {
    window.onresize = null
  }
}
</script>
<style scoped>

body {margin:0 auto;overflow:hidden;}  
.login-box{
	margin:0 auto;
	width:100%;
	height:100%;
	/*background-color:#000;*/
	position:relative;
	}
.login-box canvas {
	width:100%;
  height:auto;
	display:inline-block;vertical-align:baseline;
	position:absolute;
	z-index:-1;
	}
.login-box .canvaszz{ 
	width:100%;
	background-image: url(../assets/img/in_top_bj.png);
	height:800px;
	position:absolute;
	z-index:10;
		filter:alpha(opacity=40);  
      	-moz-opacity:0.4;  
      	-khtml-opacity: 0.4;  
      	opacity: 0.4;
	}
.login_tit{
	position: absolute;
	top:-60px;
	left:-5px;
	width:420px;
	color:#fff;
	text-align: center;

}
.tit-bg{position:absolute;top:50%;display: inline-block;width:90px;height:1px;background:url(../assets/img/login-tit.png); }
.tit-bg.left{left:0;transform:rotate(180deg);}
.tit-bg.right{right:0;}
.login_tit>div{
	position: relative;
	font-size: 1.4rem;font-weight: bold;
}
.login_tit>p{
	font-size: 1.2rem;font-family: "arial";
	margin:10px 0;
}
	
.login-box .signup{
	margin-top: 10px;
	text-align: center;
}
.login-box .signup a.gv { 
	text-decoration:none; 
	background:url(../assets/img/nav_gv.png) repeat 0px 0px; 
	width: 130px; 
	height: 43px; 
	display: inline-block; 
	text-align:center;
	line-height:43px;
	cursor:pointer;
	margin:8px 20px 8px 20px;
	font:18px/43px 'microsoft yahei'; color:#066197;
	}
.login-box .signup a.gv span {
	 display: none;
	 	
}
.login-box .signup a.gv:hover { 
	background: url(../assets/img/nav_gv.png) repeat 0px -43px; 
	color:#1d7eb8;
	-webkit-box-shadow: 0 0 6px #1d7eb8;
	transition-duration: 0.5s;
	}
	
.login-box	.topcn{
	width: 980px;
	top:200px;
	left: 50%;
	margin-left: -490px;
	position:absolute;
	z-index:20;

	}
	/*登录界面*/
.input-content{
position: absolute;z-index:9999;padding:30px;width:350px;left:50%;margin-left:-205px;top:25%;
}
.input-content .p {
    margin: 10px 0;
    height: 44px;
    position: relative;
}
.input-content .p .login_txtbx {
    font-size: 1rem;;
    height: 26px;
    line-height: 26px;
    padding: 8px 9%;
    width: 81%;
    text-indent: 1em;
    border: 1px solid #1d7eb8;
    background: rgba(0,0,0,.1);
    color: white;
}
.login_txtbx::-webkit-input-placeholder {
  color:rgba(255,255,255,.9);
 }
.login_txtbx:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
　　color:rgba(255,255,255,.9);
}
.login_txtbx::-moz-placeholder {  
　　color:rgba(255,255,255,.9);
}
.login_txtbx:-ms-input-placeholder { /* Internet Explorer 10+ */
　　color:rgba(255,255,255,.9);
}
.input-content .p .login_txtbx:focus,.input-content p .login_txtbx:hover{
	-webkit-box-shadow: 0 0 6px #1d7eb8;
	transition-duration: 0.5s;
}
.input-content .p.user_icon:before {
    content: "u";
}
.input-content .p.pwd_icon:before {
    content: "p";
}
.input-content .p.opwd_icon:before {
    content: "o";
}
.input-content .p.npwd_icon:before {
    content: "n";
}
.input-content .p.rpwd_icon:before {
    content: "r";
}
.input-content .p.val_icon:before {
    content: "";
}
.input-content .p:before {
    font-family: 'adminthemesregular';
    position: absolute;
    top: 0;
    left: 14px;
    height: 42px;
    line-height: 42px;
    font-size: 1.4rem;
    color: #fff;
}
.input-content .p .checkcode {
    float: left;
    width: 205px;
    height: 44px;
    overflow: hidden;
}
.input-content .p .checkcode input {
    float: left;
    width: 120px;
    height: 36px;
    line-height: 36px;
    border: 1px solid #1d7eb8;
    padding: 3px;
    color: white;
    outline: none;
    text-indent: 3.1em;
}
.input-content .p .checkcode canvas {
    float: right;
    width: 85px;
    height: 38px;
    padding: 3px;
    z-index: 0;
    background: rgba(28, 122, 178,.3);
}
.input-content .p .ver_btn {
    color: #f4f4f4;
    height: 42px;
    line-height: 42px;
    margin: 0;
    z-index: 1;
    position: relative;
    float: right;
    cursor: pointer;
    font-size: 1rem;
}
.passwordTit{ position:relative;padding:10px;font-size: 12px; color:#fff;line-height: 18px;margin-bottom: -20px; }
.passwordTit .border{position: absolute;display: inline-block;width:20px;height:20px;border:1px solid #1d7eb8;}
.border.left{left:0;top:0;border-right:none;border-bottom:none;}
.border.right{right:0;bottom:0;border-left:none;border-top:none;}  
</style>