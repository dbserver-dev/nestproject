const { defineConfig } = require("@vue/cli-service");
const path = require("path");

module.exports = defineConfig({
    transpileDependencies: true,
    lintOnSave: false,
    devServer: {
        client: {
            overlay: false,
        },
        host: '0.0.0.0',
        port: 8088,
        // Proxy 설정
        proxy: {
            // 경로가 "/api" 로 시작하는 요청을 대상으로 proxy 설정
            "/": {
                target: "http://localhost",
                changeOrigin: true,
                // 요청 경로에서 '/api' 제거
                pathRewrite: { "^/api": "" },
                ws: false,
            },
        },
    },
    // ✅ `@` alias 설정 추가
    configureWebpack: {
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "src"), // `@`를 `src/` 경로로 설정
                path: "path-browserify" // ✅ `path` 모듈을 `path-browserify`로 대체
            },
            fallback: {
                process: require.resolve("process/browser") // ✅ `process` 폴리필 추가
            }
        },
        plugins: [
            new(require("webpack")).ProvidePlugin({
                process: "process/browser", // ✅ `process` 전역 객체 제공
            }),
        ],
    }
});
