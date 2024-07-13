/**
 * esp-ai LLM 插件开发
 * 
 * 演示请求流式返回的 LLM 服务
*/
module.exports = {
    // 插件名字
    name: "esp-ai-plugin-llm-example",
    // 插件类型 LLM | TTS | IAT
    type: "LLM",
    /**
     * 插件逻辑
     * 
     * @param {String} text 用户提问的句子
     * @param {({ text, texts })=>void} cb llm响应后需要调用的方法
     * @param {({ text })=>void} onError 错误时，需要调用，并传入错误提示语
     * @param {Object[]} llm_historys 对话历史
    */
    main({ text, llm_historys, onError, cb }) {
        // 获取到用户配置
        const { devLog, api_key, llm_server, llm_init_messages = [], llm_params_set } = G_config;
        devLog && console.log('\n\n=== 开始请求 LLM，输入: ', text, " ===");
        devLog && console.log("对话记录：\n", llm_historys) 

        // 请自行约定接口 key 需要配置什么字段
        const config = {
            api_key: api_key[llm_server]?.apiKey,
            llm: api_key[llm_server]?.llm,
        }

        /**
         * 这个变量是固定写法，需要回传给 cb()
         * 具体需要怎么更改见下面逻辑
        */
        const texts = {
            all_text: "",
            count_text: "",
        }

        // 模拟服务返回的数据
        function moniServer(cb) {
            const moni_data = [
                "你好,",
                "有什么我可以帮您的？",
                "请尽管吩咐！",
            ];

            function reData(){
                const res_text = moni_data.splice(0, 1);
                cb(res_text[0], moni_data.length); 
                moni_data.length && setTimeout(reData, 1000);
            }
            reData(); 
        }
 

        // 请求llm服务的参数, 将对话信息给到参数中
        const r_params = {
            "model": config.llm,
            "messages": [
                ...llm_init_messages,
                ...llm_historys,
                {
                    "role": "user", "content": text
                },
            ]
        };
        // 根据接口需求自行给接口
        const body = JSON.stringify(llm_params_set ? llm_params_set(r_params) : r_params);

        moniServer((chunk_text, length) => {
            devLog && console.log('LLM 输出 ：', chunk_text);
            texts["count_text"] += chunk_text;
            cb({ text, texts, is_over: length === 0 })
        })  
    }
}
