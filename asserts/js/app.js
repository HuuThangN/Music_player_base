const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const cd = $('.cd')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const songdiv = $('.song')
const randomBtn = $('.btn-random')
const repeateBtn = $('.btn-repeat')
const playList = $('.playlist')

const app = {
    currentIndex:0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,

    songs: [
        {
            name: 'Nơi này có anh',
            singer: 'Sơn Tùng',
            path: './asserts/music/NoiNayCoAnh.mp3',
            image: './asserts/img/noi-nay-co-anh.jpg'
        },
        {
            name: 'Đi qua mùa hạ',
            singer: 'Thai Dinh',
            path: './asserts/music/DiQuaMuaHa-ThaiDinh.mp3',
            image: './asserts/img/di-qua-mua-ha.jpg'
        },
        {
            name: 'Nấu cho em ăn',
            singer: 'Đen',
            path: './asserts/music/NauAnChoEm-Den.mp3',
            image: 'asserts/img/nauchoeman.jpg'
        },
        {
            name: 'Có thể được không',
            singer: 'TruongYHaoZhangZiHao',
            path: './asserts/music/CoTheDuocKhong-TruongYHaoZhangZiHao.mp3',
            image: './asserts/img/co-the-duoc-khong.jpg'
        },
        {
            name: 'Anh đã ổn hơn',
            singer: 'Longer',
            path: './asserts/music/anh-da-on-hon.mp3',
            image: './asserts/img/anh-da-on-hon.jpg'
        },
        {
            name: 'Lạc đường',
            singer: 'Phạm Trưởng',
            path: './asserts/music/LacDuong-PhamTruong.mp3',
            image: './asserts/img/Lac-duong.jpg'
        },
        {
            name: 'Yêu người có ước mơ',
            singer: 'Buitruonglinh',
            path: './asserts/music/YeuNguoiCoUocMo-buitruonglinh.mp3',
            image: './asserts/img/yeunguoicouocmo.jpg'
        }
    ],

    render: function(){
        const htmls = this.songs.map((song,index) => {
            return `<div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>`
        })
        playList.innerHTML = htmls.join('')
    },

    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function(){
        const _this = this
        const cdWidth = cd.offsetWidth
        

        //xu ly cd quay / dung
        const cdThumbRotate = cdThumb.animate([
            {   transform: 'rotate(360deg)'}
        ], {
            duration: 10000, //10s
            iteration: Infinity
        })
        cdThumbRotate.pause()
        //xu ly phong to/ thu nho cd
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0         
            cd.style.opacity = newCdWidth / cdWidth
        }   

        //xu ly khi click play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause()
            }else{
                audio.play()
            }
        }
        
        //khi song duoc play
        audio.onplay = function(){
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbRotate.play()
        }
        //khi song bi pause
        audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbRotate.pause()

        }
        //khi tien do bai hat thay doi
        audio.ontimeupdate = function(){
            if(audio.duration) {
                const progressPercent = Math.floor(this.currentTime / this.duration * 100)
                progress.value = progressPercent
            }
        }
        //xu ly khi tua song
        progress.onchange = function(e){
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }
        //khi next song
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        //khi prev song
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()

        }
        //xu ly khi click select song
        playList.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            if( songNode || e.target.closest('.option')){
                //khi click vao song
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    audio.play()
                    _this.render()
                }
                //khi click vao option
                if(e.target.closest('.option')){

                }
            }
        }
        //xu ly khi click random song
        randomBtn.onclick = function(){
            _this.isRandom = !_this.isRandom
            this.classList.toggle('active', _this.isRandom)

        }
        //xu ly next song khi audio ended
        audio.onended = function(){
            if(_this.isRepeat){
                this.play()
            }else{
                nextBtn.click()
            }
        }
        //xu ly lap lai song
        repeateBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat
            this.classList.toggle('active',_this.isRepeat)
        }

    },
    
    scrollToActiveSong: function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        }, 200)
    },

    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    
    nextSong: function(){
        this.currentIndex ++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function(){
        this.currentIndex --
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length -1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function(){
        let newindex
        do {
            newindex = Math.floor(Math.random() * this.songs.length)
        }while(newindex === this.currentIndex)
        this.currentIndex = newindex
        this.loadCurrentSong()

    },

    start: function(){
        //dinh nghia cac thuoc tinh cho object
        this.defineProperties()

        //lang nghe / xu ly cac su kien
        this.handleEvents()

        //tai thong tin bai hat dau tien vao UI khi chay ung dung
        this.loadCurrentSong()

        //render playlist
        this.render()
    }
}

app.start()