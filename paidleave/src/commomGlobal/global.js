export default {
    install(Vue) {
        Vue.config.globalProperties.$emptyValidation = function(jsonvar) {
            //console.log(this.$data);

            //let jsondataarr = JSON.parse(JSON.stringify(this.$data));

            let checklist = [...jsonvar];
            //let keys = Object.keys(jsondataarr); //키를 가져옵니다. 이때, keys 는 반복가능한 객체가 됩니다.
            //for (let i = 0; i < keys.length; i++) {
            //  let key = keys[i];
            //  console.log('key : ' + key + ', value : ' + jsondataarr[key]);
            //}

            for (let i = 0; i < checklist.length; i++) {
                let item = checklist[i];
                //console.log(item.checkval + " : " + item.checkmsg);

                if (item.checkval === "") {
                    alert(item.checkmsg);

                    return false;
                }
            }

            return true;
        };
        Vue.config.globalProperties.$aaaa = function(jsonvar) {
            //console.log(this.$data);

            //let jsondataarr = JSON.parse(JSON.stringify(this.$data));

            let checklist = [...jsonvar];
            //let keys = Object.keys(jsondataarr); //키를 가져옵니다. 이때, keys 는 반복가능한 객체가 됩니다.
            //for (let i = 0; i < keys.length; i++) {
            //  let key = keys[i];
            //  console.log('key : ' + key + ', value : ' + jsondataarr[key]);
            //}

            for (let i = 0; i < checklist.length; i++) {
                let item = checklist[i];
                //console.log(item.checkval + " : " + item.checkmsg);

                if (item.checkval === "") {
                    alert(item.checkmsg);

                    return false;
                }
            }

            return true;
        };
    },
};