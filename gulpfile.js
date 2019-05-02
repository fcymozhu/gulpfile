// 这个js就是我们程序写给gulp要做的任务。
//1、创建gulp对象
// var gulp = require("gulp");

/*
	第一个参数  任务的名字
	第二个参数  回调函数

 */
/*gulp.task("hello", function(){
	console.log("hello world");
})*/

var gulp = require("gulp");

//实现index.html的拷贝
gulp.task("copy-html", function(){
	return gulp.src("index.html")
	.pipe(gulp.dest("dist"))
	.pipe(connect.reload());
})

//实现图片的拷贝
gulp.task("images", function(){
	//找到所有后缀为.jpg的图片完成拷贝
	// return gulp.src("images/*.jpg").pipe(gulp.dest("dist/images"));
	
	//找到后缀为.jpg或者.png的图片完成拷贝
	// return gulp.src("images/*.{jpg,png}").pipe(gulp.dest("dist/images"));
	
	//拷贝header文件夹内部的图片
	// return gulp.src("images/*/*").pipe(gulp.dest("dist/images"));
	
	//拷贝所有的图片，文件夹内的图片也拷贝过来
	return gulp.src("images/**/*")
	.pipe(gulp.dest("dist/images"))
	.pipe(connect.reload());
})


//要将两个文件夹内的内容，拷贝到同一个文件夹内部
gulp.task("data", function(){
	return gulp.src(['json/*.json', "xml/*.xml", "!json/xxx.json"])
	.pipe(gulp.dest("dist/data"))
	.pipe(connect.reload());
})


//gulp中一次性同时执行多个任务
gulp.task("build", ['copy-html', 'images', 'data'], function(){
	console.log("编译完成");
})

/*
	是否能够去实时监听文件的变化，实现，当我们这边的文件发生改变的时候，dist路径下的文件可以直接实现自动拷贝
 */
//gulp监听
gulp.task("watch", function(){
	/*
		两个参数
		第一个参数：监听文件的路径
		第二个参数：当前监听文件发生变化以后，去执行的任务
	 */
	gulp.watch("index.html", ['copy-html']);
	gulp.watch("images/**/*", ["images"]);
	gulp.watch(['json/*.json', "xml/*.xml", "!json/xxx.json"], ['data']);
	gulp.watch("stylesheet/index.scss", ['scss']);
	gulp.watch(['javascripts/index1.js', "javascripts/index2.js"], ['scripts']);
})
/*
	gulp的插件的用法：
		<1>需要将gulp插件下载到本地
			cnpm install gulp-插件名字 --save-dev
			cnpm i gulp-插件名字 -D
		<2>引入gulpfile.js文件  require()
		<3>使用插件
 */
/*
	gulp-scss 插件下载到本地
	在windows系统下，我们需要 gulp-sass-china

 */
var scss = require("gulp-scss");
var minify = require("gulp-minify-css");

gulp.task("scss", function(){
	return gulp.src("stylesheet/index.scss")
	.pipe(scss())
	.pipe(gulp.dest("dist/css"))
	.pipe(minify())
	.pipe(rename("index.min.css"))
	.pipe(gulp.dest("dist/css"))
	.pipe(connect.reload());
})

var connect = require("gulp-connect");
gulp.task("server", function(){
	connect.server({
		root: "dist",    //服务器的根目录
		port: 9090,      //设置端口号
		livereload: true //实时刷新
	});
})


/*
	同时启动服务器，同时启动监听
	可以给gulp设置默认任务，执行任务  gulp  直接默认任务
	【注】实时监听，实时刷新
 */
gulp.task("default", ["watch", 'server']);


//创建任务
var concat = require("gulp-concat");
//压缩js文件插件引入
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");

gulp.task("scripts", function(){
	return gulp.src(['javascripts/index1.js', "javascripts/index2.js"])
	.pipe(concat("index.js"))
	.pipe(gulp.dest("dist/js"))
	.pipe(uglify())
	.pipe(rename("index.min.js"))
	.pipe(gulp.dest("dist/js"))
	.pipe(connect.reload());
})

/*
	.js
	.css   开发版本  写代码的时候，会有大量的注释，严格代码缩进，程序阅读的时候更好理解。
	一般情况下会分成两个版本 
	.min.js
	.min.css 上线版本  压缩版本  取出所有的注释，将所有代码缩进除去(空格、换行)
 */

















