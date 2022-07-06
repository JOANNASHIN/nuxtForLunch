
<template>
    <section class="fb__lunchmap">
        <header>
            <h2 class="fb__title--hidden">점심 지도</h2>
            <button>닫기버튼</button>
        </header>

        <!-- 검색영역 -->
        <form>
            <fieldset> 
                <legend>검색영역</legend>
                <input type="text" placeholder="검색어를 입력하세요.">
                <button>검색하기</button>
            </fieldset>
        </form>

        <!-- 지도 -->
        <figure id="map" class="fb__lunchmap__map"></figure>
        
        <article class="fb__lunchmap__layer">
            <!-- 레이어 -->
        </article>
    </section>
</template>

<script>
    export default {
        name: "lunchmap",

        components: {
        },

        head() {
            return {
            }
        },

        data() {
            return {
                fetches: {
                    isLoading: false,
                },

                position: {
                    lat: 37.481081960779115,
                    lon: 127.0384371421411,
                },

                locationList: []
            }
        },

        created() {

        },

        watch: {
        },

        mounted() {
            this.getData();
        },

        methods: {
            requestList() {
                return new Promise((resolve, reject) => {
                    try {
                        this.resCollection.get().then((result) => {
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
            
            async getData() {
                try {
                    const response = await this.requestList();
    
                    if (response && response.length) {
                        this.locationList = response;

                        this.customData();
                    }

                    this.fetches.isLoading = true;

                    this.$nextTick(() => {
                        this.drawMap();
                    })
                }
                catch (err) {
                    console.error(err);

                    this.fetches.isLoading = "error";
                }
            },

            customData() {
                for (let i = 0; i < this.locationList.length; i++) {
                    const restaurant = this.locationList[i];

                    let splitLocation = restaurant.location.split(",");
                    restaurant.lon = Number(splitLocation[0])
                    restaurant.lat = Number(splitLocation[1])
                    
                    console.log(restaurant);
                }
            },

            async drawMap() {
                const position = this.position;
                const container = document.getElementById('map');
                const options = {
                    center: new kakao.maps.LatLng(position.lat, position.lon),
                    level: 5
                };

                const map = new kakao.maps.Map(container, options);

                map.setZoomable(true);

                this.locationList.forEach(location => {
                    // 마커가 표시될 위치입니다 
                    const markerPosition  = new kakao.maps.LatLng(location.lon, location.lat); 

                    // 마커를 생성합니다
                    const marker = new kakao.maps.Marker({
                        position: markerPosition
                    });

                    // 마커가 지도 위에 표시되도록 설정합니다
                    marker.setMap(map);

                    let iwContent = `<div class="fb__infoWindow">
                                        <figure class="fb__infoWindow__icon">
                                        </figure>
                                        <div class="fb__infoWindow__text">
                                            ${location.name}
                                        </div>
                                    </div>`;

                    let iwPosition = new kakao.maps.LatLng(location.lat, location.lon); //인포윈도우 표시 위치입니다

                    // 커스텀 오버레이를 생성합니다
                    const customOverlay = new kakao.maps.CustomOverlay({
                        position: iwPosition,
                        content: iwContent,
                        // xAnchor: 0.3,
                        // yAnchor: 0.91
                    });

                    // 커스텀 오버레이를 지도에 표시합니다
                    customOverlay.setMap(map);
                })


                
            },
        }

    }
</script>