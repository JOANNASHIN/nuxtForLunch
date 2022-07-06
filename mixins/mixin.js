import $ from "jquery";

const mixin = {
    data() {
        return {
            menuCollection: database.collection("menuList"),
            resCollection: database.collection("restaurantList"),
        }
    },
    methods: {
        /**
         * api통신
         * @param {*} object 
         */
        requestApi (object) {
            if (!object.url) return ;
            
            return new Promise((resolve, reject) => {
                fetch(object.url, {

                })
                .then(res => {
                    resolve(result);
                })
                .catch(err => {
                    console.error(err);
                    reject(error)
                })
                // try {
                //     $.ajax({
                //         type: object.type ? object.type : "POST",
                //         url: object.url,
                //         data: object.data ? object.data : "",
                //         success (result) {
                //             resolve(result);
                //         },
            
                //         error(error) {
                //             reject(error)
                //         }
                //     });
                // }
            
                // catch(error) {
                //     reject(error)
                // }
            })
        },

        getJsondata(url) {
            if (!url) return ;

            return new Promise((resolve, reject) => {
                try {
                    $.getJSON(url, (data) => {
                        resolve(data);
                    })
                }

                catch(error) {
                    reject("getJsondata has exception...", error)
                }
            })
           
        },
    }
}

export default mixin;