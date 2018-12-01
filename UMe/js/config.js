(function() {

	//子页面布局样式
	var subpagesStyle = {
		top: '44px', //子页面顶部位置
		bottom: '50px', //子页面底部位置
	}

	//程序配置
	var AppConfig = {
		//初始激活页面id
		activePageId: 'message',	
		//页面
		pages: {
			login: {
				id: 'message',
				url: 'pages/login.html',
			},
		},
		//子页面
		subpages: {
			message: {
				id: 'message',
				url: 'pages/message.html',
				styles: subpagesStyle
			},
			linkList: {
				id: 'linkList',
				url: 'pages/linkList.html',
				styles: subpagesStyle
			},
		},
		//http配置
		http: {
			//请求服务端地址			
			requestHost: 'http://111.231.248.54:8090',
		},
		//缓存相关
		store: {
			//缓存用户信息key
			userKey: '#token_user_Info',
			//主程序viewId
			mainViewIdKey:'#mainViewIdKey',
		},
		//正则表达式
		regExp: {
			usernameReg:/^[a-zA-Z0-9]{4,20}$/,
			passwordReg:/^[a-zA-Z0-9]{6,15}$/
		},

	};

	window.AppConfig = AppConfig;
})();