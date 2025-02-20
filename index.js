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
 * 大语言模型插件
 * @param {String}      device_id           设备id 
 * @param {Number}      devLog              日志输出等级，为0时不应该输出任何日志   
 * @param {Object}      llm_config          用户配置的 apikey 等信息   
 * @param {String}      iat_server          用户配置的 iat 服务 
 * @param {String}      llm_server          用户配置的 llm 服务 
 * @param {String}      tts_server          用户配置的 tts 服务 
 * @param {String}      text                对话文本
 * @param {Function}    connectServerBeforeCb 连接 LLM 服务逻辑开始前需要调用这个方法告诉框架：eg: connectServerBeforeCb()
 * @param {Function}    connectServerCb     连接 LLM 服务后需要调用这个方法告诉框架：eg: connectServerCb(true)
 * @param {Function}    cb                  LLM 服务返回音频数据时调用，eg: cb({  count_text, text, texts })
 * @param {Function}    llmServerErrorCb    与 LLM 服务之间发生错误时调用，并且传入错误说明，eg: llmServerErrorCb("意外错误")
 * @param {Function}    llm_params_set      用户配置的设置 LLM 参数的函数
 * @param {Function}    logWSServer         将 ws 服务回传给框架，如果不是ws服务可以这么写: logWSServer({ close: ()=> {  中断逻辑... } })
 * @param {{role, content}[]}  llm_init_messages   用户配置的初始化时的对话数据
 * @param {{role, content}[]}  llm_historys llm 历史对话数据
 * @param {Function}    log                 为保证日志输出的一致性，请使用 log 对象进行日志输出，eg: log.error("错误信息")、log.info("普通信息")、log.llm_info("llm 专属信息")
 *  
*/
    main({ devLog, is_pre_connect, llm_config, text, llmServerErrorCb, llm_init_messages = [], llm_historys = [], cb, llm_params_set, logWSServer, connectServerBeforeCb, connectServerCb, log }) {

        devLog && console.log("对话记录：\n", llm_historys)

        // 请自行约定接口 key 需要配置什么字段
        const config = { ...llm_config }
        
        
        // 预先连接函数
        async function preConnect() {
            // some code...
        }
        if (is_pre_connect) {
            preConnect()
            return;
        }

        // 连接 ws 服务后并且上报给框架
        // const llm_ws = new WebSocket("ws://xxx");
        // logWSServer(llm_ws)

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

            function reData() {
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
