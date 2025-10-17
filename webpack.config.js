const webpack = require('webpack')
const {merge} = require("webpack-merge")
const devConfig = require("./webpack.config.dev")
const prodConfig = require("./webpack.config.prod")
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");

const commonConfig = {
    mode: 'development',
    entry: "./src/index.js",
    output: {
        filename: "tac.js",
        path: path.resolve(__dirname, "./dist")
    },
    resolve: {
        alias: {
            "@": path.join(__dirname, "./src"), // 这样@符号就表示项目根目录中src这一层路径
            // 强制所有对 'sass' 的解析使用 Embedded Sass 实现，避免旧 API 产生的弃用告警
            'sass': require.resolve('sass-embedded')
        }
    },
    module: {
        rules: [
            {
                test: /\.(css)$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "sass-loader",
                        options: {
                            implementation: require('sass-embedded'),
                            api: 'modern'
                        }
                    }
                ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                use: {
                    loader: 'file-loader',
                    options: {
                        esModule: false,
                        name: '[name].[ext]',
                        outputPath: 'tac/images'
                    }
                },
                type: 'javascript/auto'
            },
            // {
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     loader: 'babel-loader',
            //     options: {
            //         //  预设babel做怎样的兼容性处理
            //         presets: ['@babel/preset-env']
            //     }
            // }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            // 指定抽离的之后形成的文件名
            filename: 'tac/css/tac.css'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin()
    ],
    devServer: {
        // 开发时可直接访问到 ./public、./dist、./examples 下的静态资源
        port: 3000,
        // 允许其他端口（如 Vite 的 5173/5174）跨域访问本服务提供的 /gen 与 /check 接口
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
        static: ["./dist", "./public", "./examples"],
        setupMiddlewares: (middlewares, devServer) => {
            const app = devServer.app;
            // 处理预检请求，避免跨域时 OPTIONS 被拦截
            app.use((req, res, next) => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
                if (req.method === 'OPTIONS') {
                    return res.sendStatus(204);
                }
                next();
            });
            // 简易开发环境接口，避免 8080 后端缺失导致请求失败
            app.post('/gen', (req, res) => {
                try {
                    const url = new URL(req.url, 'http://localhost');
                    const type = url.searchParams.get('type') || (req.body && req.body.type) || 'SLIDER';
                    // 目前仅提供 SLIDER 的示例数据，其它类型返回占位数据
                    if (type === 'SLIDER') {
                        const slider = require('./src/slider.json');
                        return res.json(slider);
                    }
                    // 占位返回，前端可正常处理为失败或提示刷新
                    return res.json({
                        id: 'mock-' + Date.now(),
                        captcha: { type }
                    });
                } catch (e) {
                    return res.status(500).json({ code: 500, msg: 'mock gen error', error: String(e) });
                }
            });

            app.post('/check', (req, res) => {
                // 简易校验：开发环境直接返回成功
                return res.json({ code: 200, msg: 'ok' });
            });

            return middlewares;
        }
    }
}

module.exports = (env, argv) => {
    if (argv && argv.mode === 'production') {
        console.log("=============production==================")
        return merge(commonConfig, prodConfig);
    }else {
        console.log("=============development==================")
        return merge(commonConfig, devConfig);
    }
}

