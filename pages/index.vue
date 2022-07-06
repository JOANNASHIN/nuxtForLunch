
<template>
    <section class="fb__content fb__main">
        <h2 class="fb__title--hidden">점심추천 메인페이지</h2>

        <!-- 
            1. 완전 랜덤
            2. 스무고개 
            3. 다이어트 중 ?
            4. 가까운순
            - 배달 or 걸어서
        -->
        <template v-if="false === fetches.getMenuData">
            loading...
        </template>

        <template v-else-if="true === fetches.getMenuData">
                <main class="fb__main__wrapper">
                    <div class="fb__main__recommend">
                        <span class="recommend__text">오늘 점심으로</span>

                        <div ref="rollingSlider" class="recommend__rolling swiper-container">
                            <span v-show="false == fetches.menuRolling" class="recommend__menu recommend__menu--before">
                                어떤거
                            </span>
                            
                            <ul ref="rollingWrapper" class="recommend__wrapper swiper-wrapper">
                                <template v-for="(menu, index) in menuList">
                                    <li class="recommend__list swiper-slide" :key="index">
                                        <em class="recommend__menu">{{menu.name}}</em>
                                    </li>
                                </template>
                            </ul>
                        </div>

                        <span class="recommend__text">먹을까요?</span>
                    </div>

                    <nav class="fb__main__nav">
                        <button class="nav__delivery" @click="menuRolling($event)">고르기</button>
                    </nav>

                    <template v-if="true === fetches.menuSelected">
                        <nav class="fb__main__nav">
                            <a class="" href="/lunchMap">지도</a>
                            <!-- <button class="nav__walk">걸어서</button>
                            <button class="nav__delivery">배달</button> -->
                        </nav>
                    </template>
                </main>
        </template>

        <template v-else-if="'error' === fetches.getMenuData">
            오류가 발생하였습니다. 잠시 후 다시 시도해주세요.
        </template>
    
    </section>
</template>

<script>
    export default {
        name: "forLunchMain",

        components: {
        },

        head() {
            return {
            }
        },

        data() {
            return {
                fetches: {
                    getMenuData: false,
                    menuSelected: false,
                    menuRolling: false,
                },

                selectedMenu: null,
                rollingSlide: {},
                menuList: null,
                addData: [
                    {
            "name": "모범 떡볶이",
            "location": "37.48512597601747, 127.03206392495402",
            "mainImage": "",
            "address": "서울특별시 강남구 도곡1동 강남대로 240",
            "isWish": false,
            "score": 5,
            "howFar": "12",
            "tel": "",
            "photo": [
                {
                    "id": 0,
                    "src": "https://lh5.googleusercontent.com/p/AF1QipMr5RRBonBhcrYDEfHtOlbXKnulTgVvRLkUbPKU=w408-h306-k-no"
                }
            ],
            "openingHours": "",
            "description": "",
            "menu": [
                {
                    "name": "떡볶이"
                }
            ],
            "menuImage": []
        },

        {
            "name": "신전 떡볶이",
            "location": "",
            "mainImage": "",
            "address": "서울특별시 강남구 도곡1동 강남대로 240",
            "isWish": false,
            "score": 5,
            "howFar": "12",
            "tel": "",
            "photo": [
                {
                    "id": 0,
                    "src": "https://lh5.googleusercontent.com/p/AF1QipMr5RRBonBhcrYDEfHtOlbXKnulTgVvRLkUbPKU=w408-h306-k-no"
                }
            ],
            "openingHours": "",
            "description": "",
            "menu": [
                {
                    "name": "떡볶이"
                }
            ],
            "menuImage": []
        },

        {
            "name": "춘천 닭갈비",
            "location": "",
            "mainImage": "",
            "address": "서울특별시 강남구 도곡1동 강남대로 240",
            "isWish": true,
            "score": 5,
            "howFar": "5",
            "tel": "",
            "photo": [
                {
                    "id": 0,
                    "src": "https://lh5.googleusercontent.com/p/AF1QipMr5RRBonBhcrYDEfHtOlbXKnulTgVvRLkUbPKU=w408-h306-k-no"
                }
            ],
            "openingHours": "",
            "description": "",
            "menu": [
                {
                    "name": "닭갈비"
                },

                {
                    "name": "닭갈비볶음밥"
                }
            ],
            "menuImage": []
        }
                ]
            }
        },

        created() {
            console.clear();
            this.getMenuData();
            // this.addToDB("M");
            // this.deleteAll("M");
            // this.addToDB("R");
            // this.deleteAll("R");
        },

        watch: {
        },

        mounted() {
        },

        methods: {
            async deleteAll(type) {
                if (type == "M") {
                    await this.menuCollection.get().then(result => {
                        result.docs.forEach(doc => {
                            console.log("doc.id", doc.id)
                            this.menuCollection.doc(doc.id).delete();
                        });
                    })
                }
                else {
                       await this.resCollection.get().then(result => {
                        result.docs.forEach(doc => {
                            console.log("doc.id", doc.id)
                            this.menuCollection.doc(doc.id).delete();
                        });
                    })
                }
            },

            async addMenu(v) {
                await this.menuCollection.add(v)
                    .then(result => {
                        console.log(result);
                    })
                    .catch(err => {
                        console.error(err);
                    });
            },
            
            async addRestaurant(v) {
                await this.resCollection.add(v)
                    .then(result => {
                        console.log(result);
                    })
                    .catch(err => {
                        console.error(err);
                    });
            },

            addToDB(type) {
                this.addData.forEach(v => {
                    if (type == "M") {
                        this.addMenu(v);
                    }
                    else {
                        this.addRestaurant(v);
                    }
                })
            },

            requestMenuList(_orderBy) {
                return new Promise((resolve, reject) => {
                    try {
                        this.menuCollection.get().then((result) => {
                            const customData = [];

                            result.forEach(list => {
                                customData.push(Object.assign(list.data(), {
                                    id: list.id
                                }));
                            })

                            resolve(customData);
                        })
                    }

                    catch (error) {
                        reject(error);
                    }
                })
            },
            
            async getMenuData() {
                try {
                    const response = await this.requestMenuList();
    
                    if (response && response.length) {
                        this.menuList = response;
                    }

                    this.fetches.getMenuData = true;

                    this.$nextTick(() => {
                        this.menuSelectSlider();
                    })
                }
                catch (err) {
                    console.error(err);

                    this.fetches.getMenuData = "error";
                }
            },

            menuSelectSlider() {
                this.rollingSlide = new Swiper(".recommend__rolling", {
                    loop: true,
                    slidesPerView: 1,
                    direction: "vertical",
                    allowTouchMove: false,
                })
            },

            menuRolling() {
                this.fetches.menuRolling = true;
                const _menuTotal = document.querySelectorAll(".recommend__list").length;
                const _randomCount = Math.floor(Math.random() * _menuTotal);

                if(this.rollingSlide) this.rollingSlide.slideToLoop(_randomCount, 800);

                this.fetches.menuSelected = true;

                if (this.menuList && this.menuList.length) {
                    this.selectedMenu = this.menuList[_randomCount];
                    console.log(this.selectedMenu);

                    this.showRestaurantList();
                }
            },

            async showRestaurantList() {
                try {
                    
                }
                catch (ex) {
                    console.error(ex);
                }
            },

            requestRestaurantList() {
                return new Promise((resolve, reject) => {
                    try {
                        this.menuCollection.get().then((result) => {
                            const customData = [];

                            result.forEach(list => {
                                customData.push(Object.assign(list.data(), {
                                    id: list.id
                                }));
                            })

                            resolve(customData);
                        })
                    }

                    catch (error) {
                        reject(error);
                    }
                })
            }
        }

    }
</script>