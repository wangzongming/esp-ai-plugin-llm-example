# esp-ai-plugin-llm-example [![npm](https://img.shields.io/npm/v/esp-ai-plugin-llm-example.svg)](https://www.npmjs.com/package/esp-ai-plugin-llm-example) [![npm](https://img.shields.io/npm/dm/esp-ai-plugin-llm-example.svg?style=flat)](https://www.npmjs.com/package/esp-ai-plugin-llm-example)

ESP-AI LLM插件开发案例

# 安装
在你的 `ESP-AI` 项目中执行下面命令
```
npm i esp-ai-plugin-llm-example
```

# 使用 
```
const espAi = require("esp-ai"); 

espAi({
    ... 

    // 配置使用插件并且为插件配置api-key
    llm_server: "esp-ai-plugin-llm-example",
    api_key: {
        "esp-ai-plugin-llm-example": {
            token: "ht-xxx"
        },
    },

    // 引入插件
    plugins: [ 
        require("esp-ai-plugin-llm-example")
    ]
});
```
 