
<template>
    <section>
        <h2>맛집</h2>
        <figure>
            <!-- 지도 -->
        </figure>

        <article>
            <!-- 레이어 -->
        </article>
    </section>
</template>

<script>
    import AddTodoModal from '/components/AddTodoModal.vue';
    import draggable from 'vuedraggable';

    export default {
        name: "toodList",

        components: {
            "add-todo-modal": AddTodoModal,
            "draggable": draggable
        },

        head() {
            return {
            }
        },

        data() {
            return {
                fetches: {
                    todo: false,
                    dbConnect: false
                },

                addModal: {
                    isOpen: false,
                    mode: "ADD"
                },

                todoList: [],

                searchText: "",
                
                count: {
                    total: 0,
                    ing: 0,
                    end: 0,
                },

                sendData: {},

                sliders: [],

                sortType: "deadline",

                listType: "all",

                editMode: false,

            }
        },

        created() {
            this.todoListInit();
        },

        watch: {
            sortType(_value, _before) {
                this.orderBySortType(_value);
            }
        },

        methods: {
            /**
             * 기본이벤트 
             */

            // todolist 리스트 가져오기
            async todoListInit(_from) {
                try {
                    const response = await this.requestTodoList(this.sortType);

                    this.todoList = response;
                    this.fetches.todo = true;
                    this.updateCount();

                    this.$nextTick(() => {
                        //최초 생성
                        if (!this.sliders.length) {
                            this.makeSlider();
                        }
                        //슬라이드 다 이동
                        else {
                            this.sliders.forEach(slide => {
                                slide.slideTo(0)
                            })
                        }
                    })
                }

                catch (error) {
                    console.error("error", error)
                    this.fetches.todo = "error";
                }

                finally {
                    this.fetches.dbConnect = false;
                }
            },

            // 상단 개수 수정
            updateCount() {
                const count = this.count;

                let _ingCount = 0;
                let _endCount = 0;
                
                this.todoList.forEach(todo => {
                    if (todo.status === true) {
                        _endCount++;
                    }
                    else {
                        _ingCount++;
                    }
                })

                count.total = this.todoList.length;
                count.ing = _ingCount;
                count.end = _endCount;
            },

            // 검색하기
            async searchTodoList(e) {
                const response = await this.requestTodoList();
                const targetLists = response.filter(v => v.content.indexOf(this.searchText) != -1);

                this.todoList = targetLists;
            },

            // 추가하기 (모달 열기)
            addTodoList(e) {
                this.addModal.mode = "ADD";
                this.sendData = {
                    deadline: moment(new Date()).format("YYYY-MM-DD")
                };

                this.addModal.isOpen = true;
                this.resetSlide();
            },

            // 수정하기 (모달 열기)
            editTodoList(list, index) {
                Object.assign(this.sendData, list);
                this.addModal.mode = "EDIT";

                this.resetSlide(this.sliders[index]);
                this.addModal.isOpen = true;
            },

            // 삭제하기
            async deleteFromList(uuid, index) {
                try {
                    this.fetches.dbConnect = true;
                    const ref = this.getDocument(uuid);
    
                    if (ref) {
                        await ref.delete()
                    }

                    this.todoList.splice(index, 1);
    
                    this.resetSlide();
                    this.updateCount();
                }
                catch(error) {
                    console.error("deleteFromList error", error);
                }

                finally {
                    this.fetches.dbConnect = false;
                }
            },

            // 상태 변경하기 (진행중 / 완료)
            async updateStatus({id, status}, index) {
                try {
                    this.fetches.dbConnect = true;
                    const ref = this.getDocument(id);

                    await ref.update({
                        status: status ? false : true,
                    });

                    this.todoList[index].status = status ? false : true;
                    this.updateCount();
                }

                catch(error) {
                    console.error("updateStatus error", error);
                }

                finally {
                    this.fetches.dbConnect = false;
                }
            },

            //전체삭제
            async deleteAll(e) {
                try {
                    this.fetches.dbConnect = true;
        
                    await this.collection.get().then(result => {
                        result.docs.forEach(doc => {
                            console.log("doc.id", doc.id)
                            this.collection.doc(doc.id).delete();
                        });

                        this.todoList = [];
                        this.updateCount();
                    })
                }

                catch(error) {
                    console.error("deleteAll error", error);
                }
            },    
            
            /**
             * 기타 이벤트
             */

            //추가 모달 닫기
            closeAddModal() {
                this.addModal.isOpen = false;
            },

            //추가완료
            completeAddTodo() {
                this.todoListInit();
                this.closeAddModal();
            },

            //DB > DOC 구하기
            getDocument (uuid) {
                return this.collection.doc(uuid);
            },

            //날짜 데이터
            getDate() {
                return moment(new Date()).format("YYYY-MM-DD");
            },
            
            //요일 들어간 날짜 구하기
            getDateText() {
                const date = new Date()
                const dayList = ["일", "월", "화", "수", "목", "금", "토"];
                // return moment(date).format("YYYY.MM.DD") + " " + dayList[date.getDay()];
                return moment(date).format("YYYY.MM.DD");
            },

            //요일 들어간 날짜 구하기
            getDday(_deadline) {
                const today = moment(new Date()).format("YYYY-MM-DD");
                let dday = moment(_deadline).diff(moment(today), "days");

                if (dday == 0) dday = "D-DAY";
                else if (dday < 0) dday = `D${String(dday).replace("-", "+")}`
                else dday = `D-${dday}`;

                return dday;
            },

            //슬라이드 실행
            makeSlider() {
                const listElementList = this.$refs["todoEachBox"];

                if (listElementList && listElementList.length) {
                    listElementList.forEach((el, idx) => {
                        this.sliders[idx] = new Swiper(el, {
                            loop: false,
                            initSlide: 0,
                            slidesPerView: "auto",
                        })
                    })
                }
            },

            //슬라이드 리셋
            resetSlide(slide) {
                if (slide) {
                    slide.slideTo(0);
                }
                else {
                    if (this.sliders && this.sliders.length) {
                        this.sliders.forEach(slide => {
                            slide.slideTo(0);
                        })
                    }
                }
            },

            // 컨트롤러 HIDE
            hideOtherController(e) {
                const $this = $(e.target);
                const _index = $this.closest(".fb__todo__each").index();

                this.sliders.forEach((slide, idx) => {
                    if (_index != idx) this.resetSlide(slide);
                });
            },      
            
            changeToEditMode() {
                this.editMode = true;
            },

            //정렬
            async orderBySortType(_value) {
                const response = await this.requestTodoList(_value);
                console.log(_value, response);
                this.todoList = response;
            },

            //편집 취소
            async sortCancel() {
                const response = await this.requestTodoList();
                this.todoList = response;
                this.editMode = false;
            },

            //편집 적용
            sortChangeSaved() {
                this.todoList.forEach((list, index) => {
                    list.order = index;
                    this.collection.doc(list.id).update(list);
                });
                
                this.sortType = "order";
                this.editMode = false;
            },
        }
    }
</script>