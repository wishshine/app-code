(function() {

	var store = {
		/**
		 * 添加缓存
		 * @param {Object} key
		 * @param {Object} value
		 */
		addStroe: function(key, value) {
			if(key != undefined && key != '') {
				if(value != undefined && value != '') {
					value = JSON.stringify(value);
					localStorage.setItem(key, value);
					console.log('添加本地缓存key:' + key + '---value:' + value);
				}
			}
		},
		/**
		 * 获取本地缓存值
		 * @param {Object} key
		 */
		getStoreValue: function(key) {
			if(key != undefined && key != '') {
				var value = localStorage.getItem(key);
				console.log('获取本地缓存key:' + key + '---value:' + value)
				if(value != undefined && value != '') {
					value = JSON.parse(value);
					return value;
				}
			}
			return undefined;
		},
		/**
		 * 移除缓存值
		 * @param {Object} key
		 */
		removeStoreValue: function(key) {
			if(key != undefined && key != '') {
				var value = localStorage.getItem(key);
				localStorage.removeItem(key);
				console.log('移除本地缓存key:' + key + '---value:' + value);
			}
		},
		/**
		 * 缓存用户信息
		 * @param {Object} UserLogin
		 */
		addUserLogin: function(UserLogin) {
			var key = AppConfig.store.userKey;
			store.addStroe(key, UserLogin);
		},
		/**
		 * 获取本地用户信息缓存值
		 * @param {Object} key
		 */
		getUserLogin: function() {
			var key = AppConfig.store.userKey;
			return store.getStoreValue(key);
		},
		/**
		 * 移除本地用户缓存
		 */
		removeUserLogin: function() {
			var key = AppConfig.store.userKey;
			store.removeStoreValue(key);
		},
	};

	var common = {
		/**
		 * 判断字符是否为空
		 * @param {Object} str
		 */
		isStrBlank: function(str) {
			if(str == null || str == '') {
				return true;
			}
			return false;
		},
	}

	var program = {
		/**
		 * 设置返回为确认退出
		 */
		setBacConfirmExit: function() {
			mui.back = function() {
				var btn = ["确定", "取消"];
				mui.confirm('确认退出吗？', '', btn, function(e) {
					if(e.index == 0) {
						plus.runtime.quit();
					}
				});
			}
		},
		/**
		 * 双击退出
		 */
		setBackPressExit: function() {
			var backButtonPress = 0;
			mui.back = function() {
				backButtonPress++;
				if(backButtonPress == 1) {
					mui.toast('再点一次退出程序');
				} else if(backButtonPress > 1) {
					plus.runtime.quit();
				}
				setTimeout(function() {
					backButtonPress = 0;
				}, 800);
			}

		},
		/**
		 * 设置返回键为后台运行
		 */
		setBacendRun: function() {
			var backButtonPress = 0;
			mui.back = function() {
				backButtonPress++;
				if(backButtonPress > 1) {
					var main = plus.android.runtimeMainActivity();
					main.moveTaskToBack(false);
				}
				setTimeout(function() {
					backButtonPress = 0;
				}, 800);
			}
		},

	};

	var ui = {
		/**
		 * 跳转到登录页面
		 */
		goLoginView: function() {
			var loginPage = AppConfig.pages.login;
			var mainView = plus.webview.currentWebview();
			if(mainView.id == loginPage.id) {
				return;
			}
			var view = plus.webview.getWebviewById(loginPage.id);
			if(view == null) {
				view = plus.webview.create(loginPage.url, loginPage.id);
				setTimeout(function() {
					view.show('slide-in-left')
				}, 500);
			} else {
				view.show('slide-in-right');
			}
		},
		/**
		 * 返回主页
		 */
		reloadMainView: function() {
			var mainViewId = AppUtils.store.getMainViewId();
			var view = plus.webview.getLaunchWebview();
			view.reload();
		}

	};

	var http = {
		/**
		 * ajax post请求
		 * @param {Object} url
		 * @param {Object} param
		 * @param {Object} callBac
		 */
		postJson: function(url, param, callBac) {
			url = AppConfig.http.requestHost + url; //
			var userLogin = store.getUserLogin();
			if(userLogin) {
				url = url + '?_token=' + userLogin.token;
			}
			var sendData = param ? JSON.stringify(param) : undefined;
			console.log('请求地址：' + url + ',请求参数：' + JSON.stringify(param));
			mui.ajax(url, {
				data: sendData,
				dataType: 'json', //服务器返回json格式数据
				type: 'post', //HTTP请求类型
				timeout: 10000, //超时时间设置为10秒；
				headers: {
					'Content-Type': 'application/json'
				},
				success: function(data) {
					console.log('请求地址：' + url + ',返回结果：' + JSON.stringify(data));
					if(data.code == '-99') { //登录异常
						mui.toast(data.msg);
						AppUtils.store.removeUserLogin();
						AppUtils.ui.goLoginView(); //跳转到登录页面
					} else {
						//执行回调函数
						callBac(data);
					}
				},
				error: function(xhr, type, errorThrown) {
					//异常处理；
					console.log(type);
					mui.toast('与服务器连接异常:' + type);
				}
			});
		}

	}

	AppUtils = {
		store: store,
		common: common,
		program: program,
		ui: ui,
		http: http,
	}

	window.AppUtils = AppUtils;

})();