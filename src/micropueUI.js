//micropue UI 1.0.js
class TypeEffect {
    constructor(element, texts, seconds, everyStopSeconds) {
        this.element = document.querySelector(element)
        this.texts = texts
        this.seconds = seconds
        this.everyStopSeconds = everyStopSeconds
    }
    type() {
        var s = 0
        var t = this.texts
        for (let i = 0; i < t.length; i++) {
            for (var j = 0; j < t[i].length; j++) {
                let char = t[i][j]
                setTimeout(((i, j) => () => {
                    this.element.innerHTML = this.element.innerHTML.replaceAll("_", "")
                    this.element.innerHTML += t[i][j] + "_";
                })(i, j), s += this.seconds);
            }
            s += this.everyStopSeconds
            if (i < t.length - 1) {
                for (var k = 0; k < t[i].length; k++) {
                    setTimeout(((k) => () => {
                        this.element.innerHTML = this.element.innerHTML.replaceAll("_", "")
                        this.element.innerHTML = t[i].substr(0, t[i].length - 1 - k) + "_"
                    })(k), s += this.seconds)
                }
            }
        }
        return s
    }
    clear(lastText, s) {
        setTimeout(() => {
            this.element.innerHTML = lastText
        }, s)
    }
}
class PageLoader {
    /**
     * @param {HTMLElement} main
     * @param {HTMLElement} title
     * @param {String} defaultTitle
     * @param {String} defaultText
     * @param {HTMLElement} leftButton
     * @param {HTMLElement} rightButton
     */
    constructor(main, title, defaultTitle, leftButton, rightButton) {
        /**
         * changes on the main element
         */
        this.main = document.querySelector(main)
        /**
         * default title when init()
         */
        this.defaultTitle = defaultTitle
        this.button = {
            left: (() => {
                try {
                    return document.querySelector(leftButton)
                } catch {
                    return undefined
                }
            })(),
            right: (() => {
                try {
                    return document.querySelector(rightButton)
                } catch {
                    return undefined
                }
            })()
        }
        this.title = document.querySelector(title)
        /**
         *  save all pages html elements:array
         */
        this.pages = []
        /**
         * now pages
         */
        this.nowpage = 0
        /**
         * save the inputs value all on this page {save(),get()}:array
         */
        var $saveInputs = {}
        this.animateStatus = false
        this.saveInputs = {
            save() {
                const s = document.querySelector(main).querySelectorAll("input,textarea")
                if (s)
                    s.forEach(self => {
                        if (self.value != "") {
                            const r = parseInt(Math.pow(Math.random() * 100, 10)).toString(16)
                            self.setAttribute("data-pageloader-index", r)
                            $saveInputs[r] = self.value
                        }
                    })
            },
            get() {
                const s = document.querySelector(main).querySelectorAll("[data-pageloader-index]")
                s.forEach(self => {
                    const o = self.getAttribute("data-pageloader-index")
                    if ($saveInputs[o]) {
                        self.value = $saveInputs[o]
                    }
                })
            }
        }
        this.WebTitle = document.querySelector("title").innerHTML
    }
    updateWebTitle(title) {
        const _title = document.querySelector("title")
        if (this.nowpage > 0)
            _title.innerHTML = this.WebTitle + " | " + title
        else
            _title.innerHTML = this.WebTitle
    }
    init() {
        this.title.innerText = this.defaultTitle
        this.main.classList.add("page-loader-default")
        if (this.button.right)
            this.button.right.classList.add("disabled")
        if (this.button.left)
            this.button.left.classList.add("disabled")
        this.title.onclick = () => {
            this.main.classList.add("scroll-smooth")
            this.main.scrollTop = 0
            setTimeout(() => {
                this.main.classList.remove("scroll-smooth")
            }, 1000)
        }
    }
    /**
     * when toggle the pages, some event can't readd, so use '[page-loader-cantuse] will close these elements.'
     */
    eachCantuse() {
        if (this.main.querySelectorAll(`[data-page-loader-cantuse]`)) {
            const cantuse_event = this.main.querySelectorAll(`[data-page-loader-cantuse]`)
            cantuse_event.forEach(s => {
                s.classList.add('page-loader-cantuse')
            })
        }
    }
    newPage(title, content, func) {
        if (this.animateStatus)
            return
        if (!title || !content) {
            console.error("error on title or content! please check the code. (PageLoader class)")
            return
        }
        if (this.nowpage == 0)
            this.main.classList.remove("page-loader-default")
        this.eachCantuse()
        this.saveInputs.save()
        this.animateStatus = true
        this.main.classList.remove("page-loader-in")
        this.main.classList.add("page-loader-out")
        this.pages[this.nowpage] = [this.title.innerText, this.main.innerHTML, this.main.scrollTop]
        this.pages[++this.nowpage] = [title, content, 0]
        setTimeout(() => {
            this.main.innerHTML = content
            this.title.innerText = title
            this.updateWebTitle(title)
            this.main.scrollTop = 0
            if (this.button.right)
                this.button.right.classList.add("disabled")
            if (this.button.left)
                this.button.left.classList.remove("disabled")
            this.main.classList.remove("page-loader-out")
            this.main.classList.add("page-loader-in")
            setTimeout(() => {
                this.main.classList.remove("page-loader-in")
                if (func)
                    func()
            }, 200)
            this.animateStatus = false
        }, 200)
    }
    next(func) {
        if (this.nowpage < this.pages.length - 1) {
            if (this.animateStatus)
                return
            this.eachCantuse()
            this.main.classList.remove("page-loader-default")
            this.saveInputs.save()
            this.animateStatus = true
            this.main.classList.remove("page-loader-in")
            this.main.classList.add("page-loader-out")
            this.pages[this.nowpage] = [this.title.innerText, this.main.innerHTML, this.main.scrollTop]
            setTimeout(() => {
                this.main.innerHTML = this.pages[++this.nowpage][1]
                this.title.innerText = this.pages[this.nowpage][0]
                this.updateWebTitle(this.pages[this.nowpage][0])
                this.main.scrollTop = this.pages[this.nowpage][2]
                this.button.left.classList.remove("disabled")
                this.saveInputs.get()
                if (this.nowpage == this.pages.length - 1) {
                    this.button.right.classList.add("disabled")
                    this.button.left.classList.remove("disabled")
                }
                this.main.classList.remove("page-loader-out")
                this.main.classList.add("page-loader-in")
                setTimeout(() => {
                    this.main.classList.remove("page-loader-in")
                    if (func)
                        func()
                }, 200)
                this.animateStatus = false
            }, 200)
        }
    }
    back(func) {
        if (this.nowpage > 0) {
            if (this.animateStatus)
                return
            this.eachCantuse()
            this.saveInputs.save()
            this.pages[this.nowpage] = [this.title.innerText, this.main.innerHTML, this.main.scrollTop]
            this.nowpage--
            this.animateStatus = true
            this.main.classList.remove("page-loader-in")
            this.main.classList.add("page-loader-out")
            setTimeout(() => {
                this.main.innerHTML = this.pages[this.nowpage][1]
                this.title.innerText = this.pages[this.nowpage][0]
                this.updateWebTitle(this.pages[this.nowpage][0])
                this.main.scrollTop = this.pages[this.nowpage][2]
                this.button.right.classList.remove("disabled")
                this.saveInputs.get()
                if (this.nowpage == 0) {
                    this.main.classList.add("page-loader-default")
                    this.button.left.classList.add("disabled")
                }
                this.main.classList.remove("page-loader-out")
                this.main.classList.add("page-loader-in")
                setTimeout(() => {
                    this.main.classList.remove("page-loader-in")
                    if (func)
                        func()
                }, 200)
                this.animateStatus = false
            }, 200)
        }
    }
}

(() => {
    let itemAddWave = document.querySelectorAll(".item")
    itemAddWave.forEach(function (s) {
        s.setAttribute("wave", "rgba(171,171,171,0.5)")
    })
})()
wave()
document.addEventListener("resize", () => { wave() })
function wave() {
    const mWave = document.querySelectorAll("[wave]")
    mWave.forEach(btn => {
        if (btn.getAttribute("data-iswave") != "true") {
            btn.setAttribute("data-iswave", "true")
            btn.addEventListener("click", (e) => {
                let wave = document.createElement("span")
                wave.classList = "wave"
                wave.style.backgroundColor = btn.getAttribute("wave")
                wave.style.top = `${e.clientY - btn.getBoundingClientRect().top}px`
                wave.style.left = `${e.clientX - btn.getBoundingClientRect().left}px`
                btn.appendChild(wave)
                setTimeout(() => {
                    wave.remove()
                }, 399)
            })
        }
    })
}
function escapeHtml(str) {
    const entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "/": "/",
        "`": "`",
        "=": "=",
    }
    return str.replace(/[&<>"'`=\/]/g, (char) => entityMap[char])
}
function decodeHtml(code) {
    const entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "/": "/",
        "`": "`",
        "=": "=",
    }
    for (let i in entityMap) {
        code = code.replaceAll(entityMap[i], i)
    }
    return code
}
function enableCodePre() {
    const c = document.querySelectorAll(".code")
    c.forEach(s => {
        s.innerHTML = escapeHtml(s.innerHTML).replaceAll("\n", "<br>").replaceAll(" ", "&nbsp;")
    })
}
(() => {
    let openlistButton = document.querySelector("#button-openlist")
    if (!openlistButton)
        return
    const leftTab = document.getElementById("left-tab")
    let listOpenStatus = false
    const rightTab = document.querySelector("#right-tab")
    const body = document.querySelector("body")
    var tabs = {
        left: {
            open() {
                listOpenStatus = true
                leftTab.classList.remove("unvisible")
            },
            close() {
                listOpenStatus = false
                leftTab.classList.add("unvisible")
            }
        },
        right: {
            open() {
                openRightTabStatus = true
                rightTab.classList.remove("unvisible")
            },
            close() {
                openRightTabStatus = false
                rightTab.classList.add("unvisible")
            }
        }
    }
    openlistButton.addEventListener("click", () => {
        if (listOpenStatus) {
            tabs.left.close()
        } else {
            tabs.left.open()
            if (document.querySelector("#right-tab"))
                tabs.right.close()
        }
    })
    function initOpenlistbutton() {
        if (window.innerWidth >= 1000) {
            openlistButton.classList.add("disabled")
        } else {
            openlistButton.classList.remove("disabled")
        }
    }
    initOpenlistbutton()
    window.addEventListener("resize", () => {
        initOpenlistbutton()
    })
    if (document.querySelector("#right-tab"))
        rightTab.addEventListener("click", () => {
            tabs.left.close()
            if (document.querySelector("#right-tab"))
                tabs.right.open()
        })
    const main = document.getElementById("main")
    var touchOpenListButton = false
    main.addEventListener("click", () => {
        if (document.querySelector("#right-tab"))
            tabs.right.close()
        if (!touchOpenListButton)
            tabs.left.close()
    })
    openlistButton.addEventListener("mouseover", () => { touchOpenListButton = true })
    openlistButton.addEventListener("mouseleave", () => { touchOpenListButton = false })
    const withApi = document.querySelectorAll("[with]")
    withApi.forEach(s => {
        s.addEventListener("click", () => {
            const l = s.getAttribute("with")
            const o = document.querySelectorAll(`[with="${l}"]`)
            o.forEach((value) => {
                value.classList.remove("active")
            })
            s.classList.add("active")
        })
    })
    const textarea = document.querySelectorAll(".textarea")
    textarea.forEach(t => {
        function s() {
            t.style.height = "auto"
            t.style.height = t.scrollHeight + "px"
        }
        t.addEventListener("input", s)
        t.addEventListener("resize", s)
        window.addEventListener("resize", s)
    })
})()
initMUI()
function initMUI() {
    //init UI icons for the default structure
    //it will run when loaded.
    const buttons = {
        openlist: document.getElementById("button-openlist"),
        back: document.getElementById("button-back"),
        next: document.getElementById("button-next")
    }
    if (buttons.openlist)
        buttons.openlist.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 36 36">
                        <g id="矩形_32" data-name="矩形 32" fill="none" stroke="#bebebe" stroke-width="3">
                            <rect width="36" height="36" rx="11" stroke="none" />
                            <rect x="1.5" y="1.5" width="33" height="33" rx="9.5" fill="none" />
                        </g>
                        <line id="直线_26" data-name="直线 26" x2="11.027" transform="translate(12.487 12.476)" fill="none"
                            stroke="#bebebe" stroke-linecap="round" stroke-width="3" />
                        <line id="直线_27" data-name="直线 27" x2="11.027" transform="translate(12.487 23.524)" fill="none"
                            stroke="#bebebe" stroke-linecap="round" stroke-width="3" />
                        <line id="直线_28" data-name="直线 28" x2="11.027" transform="translate(12.487 18)" fill="none"stroke="#bebebe" stroke-linecap="round" stroke-width="3" /></svg>`
    if (buttons.back)
        buttons.back.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16.225" height="24.225" viewBox="0 0 16.225 24.225">
                        <line id="直线_30" data-name="直线 30" x1="12" y2="10" transform="translate(2.113 2.113)"
                            fill="none" stroke="#bebebe" stroke-linecap="round" stroke-width="3" />
                        <line id="直线_31" data-name="直线 31" x1="12" y1="10" transform="translate(2.113 12.113)"
                            fill="none" stroke="#bebebe" stroke-linecap="round" stroke-width="3" />
                    </svg>`
    if (buttons.next)
        buttons.next.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16.225" height="24.225" viewBox="0 0 16.225 24.225">
                        <path id="路径_2" data-name="路径 2" d="M0,0,12,10" transform="translate(2.113 2.113)" fill="none"
                            stroke="#bebebe" stroke-linecap="round" stroke-width="3" />
                        <line id="直线_33" data-name="直线 33" y1="10" x2="12" transform="translate(2.113 12.113)"
                            fill="none" stroke="#bebebe" stroke-linecap="round" stroke-width="3" />
                    </svg>`
}

/**
 * GmicrantType
 * encode and decode.
 */

const GmicrantType = {
    /**
     * 
     * @param {String} inputText 
     * @returns {String}
     */
    encode(inputText) {
        inputText = escapeHtml(inputText).replace(/ /g, '&nbsp;').replace(/\n/g, '<br>')
        let outputText = inputText
        const rules = [
            { regex: /\[b\](.*?)\[\/b\]/g, replacement: '<strong>$1</strong>' },
            { regex: /\[i\](.*?)\[\/i\]/g, replacement: '<em>$1</em>' },
            { regex: /\[s\](.*?)\[\/s\]/g, replacement: '<s>$1</s>' },
            { regex: /\[blur\](.*?)\[\/blur\]/g, replacement: '<span style="filter:blur(4px)">$1</span>' },
            { regex: /\[highlight\](.*?)\[\/highlight\]/g, replacement: '<span style="background:yellow">$1</span>' },
            { regex: /\[h1\](.*?)\[\/h1\]/g, replacement: '<h1 class="h1">$1</h1>' },
            { regex: /\[h2\](.*?)\[\/h2\]/g, replacement: '<h2 class="h2">$1</h2>' },
            { regex: /\[h3\](.*?)\[\/h3\]/g, replacement: '<h3 class="h3">$1</h3>' },
            { regex: /\[h4\](.*?)\[\/h4\]/g, replacement: '<h4 class="h4">$1</h4>' },
            { regex: /\[h5\](.*?)\[\/h5\]/g, replacement: '<h5>$1</h5>' },
            { regex: /\[h6\](.*?)\[\/h6\]/g, replacement: '<h6>$1</h6>' },
            { regex: /\[u\](.*?)\[\/u\]/g, replacement: '<u>$1</u>' },
            { regex: /\[hr\/\]/g, replacement: '<m-hr></m-hr>' },
            { regex: /\[tip\](.*?)\[\/tip\]/g, replacement: '<p class="tip">$1</p>' },
            { regex: /\[tipblock\](.*?)\[\/tipblock\]/g, replacement: '<div class="tipblock"><p>$1</p></div>' },
            { regex: /\[warnblock\](.*?)\[\/warnblock\]/g, replacement: '<div class="warnblock"><p>$1</p></div>' },
            { regex: /\[lcode\](.*?)\[\/lcode\]/g, replacement: '<span class="lblock">$1</span>' },
            { regex: /\[frac\](.*?)\\(.*?)\[\/frac\]/g, replacement: '<span class="frac"><span class="frac-top">$1</span><hr><span class="frac-bottom">$2</span></span>' },
            { regex: /\[math\](.*?)\[\/math\]/g, replacement: '<span class="math">$1</span>' },
            { regex: /\[pow:(.*?)\](.*?)\[\/pow\]/g, replacement: '<span class="pow">$2<sup>$1</sup></span>' },
            { regex: /\[sqrt:(.*?)\](.*?)\[\/sqrt\]/g, replacement: '<span class="sqrt"><sup>$1</sup>√<span class="sqrt-content">$2</span></span>' },
            { regex: /\[sub:(.*?)\](.*?)\[\/sub\]/g, replacement: '<span class="sub">$2<sub>$1</sub></span>' },
            {
                regex: /\[code\](.*?)\[\/code\]/gs, replacement: (match, text) => {
                    text = text.replace(/<br>/gs, "\n")
                    return `<div class="code"><pre><code>${text}</code></pre></div>`
                }
            },
            { regex: /\[blue\](.*?)\[\/blue\]/gs, replacement: '<span style="color:blue">$1</span>' },
            { regex: /\[yellow\](.*?)\[\/yellow\]/gs, replacement: '<span style="color:yellow">$1</span>' },
            { regex: /\[red\](.*?)\[\/red\]/gs, replacement: '<span style="color:red">$1</span>' },
            { regex: /\[table\](.*?)\[\/table\]/gs, replacement: '<m-table>$1</m-table>' },
            { regex: /\[table-title\](.*?)\[\/table-title\]/gs, replacement: '<m-table-title>$1</m-table-title>' },
            { regex: /\[tr\](.*?)\[\/tr\]/gs, replacement: '<m-tr>$1</m-tr>' },
            { regex: /\[td\](.*?)\[\/td\]/gs, replacement: '<m-td>$1</m-td>' },
            { regex: /\[color:([#a-zA-Z0-9]+)\](.*?)\[\/color\]/g, replacement: '<span style="color:$1;">$2</span>' },
            {
                regex: /\[size:(\d+)\](.*?)\[\/size\]/g,
                replacement: (match, size, text) => {
                    if (size > 0 && size <= 50)
                        return `<span style="font-size:${size}px">${text}</span>`
                    else
                        return `<span style="font-size:15px">${text}</span>`
                }
            },
            {
                regex: /\[link\](.*?)\[\/link\]/g,
                replacement: (match, url) => {
                    let base64Url
                    try {
                        base64Url = btoa(url)
                    } catch {
                        base64Url = ''
                    }
                    return `<a href="https://micropue.com.cn/url?refresh=${base64Url}" target="_blank">${url}</a>`
                }
            }
        ];
        rules.forEach(rule => {
            outputText = outputText.replace(rule.regex, rule.replacement)
        })
        return outputText
    },
    /**
     * decode
     * @param {String} input 
     * @returns {String}
     */
    decode(inputText) {
        let outputText = decodeHtml(inputText)
        const rules = [
            { regex: /<strong>(.*?)<\/strong>/g, replacement: '[b]$1[/b]' },
            { regex: /<em>(.*?)<\/em>/g, replacement: '[i]$1[/i]' },
            { regex: /<s>(.*?)<\/s>/g, replacement: '[s]$1[/s]' },
            { regex: /<span style="filter:blur\(4px\)">(.*?)<\/span>/g, replacement: '[blur]$1[/blur]' },
            { regex: /<span style="background:yellow">(.*?)<\/span>/g, replacement: '[highlight]$1[/highlight]' },
            { regex: /<h1 class="h1">(.*?)<\/h1>/g, replacement: '[h1]$1[/h1]' },
            { regex: /<h2 class="h2">(.*?)<\/h2>/g, replacement: '[h2]$1[/h2]' },
            { regex: /<h3 class="h3">(.*?)<\/h3>/g, replacement: '[h3]$1[/h3]' },
            { regex: /<h4 class="h4">(.*?)<\/h4>/g, replacement: '[h4]$1[/h4]' },
            { regex: /<h5>(.*?)<\/h5>/g, replacement: '[h5]$1[/h5]' },
            { regex: /<h6>(.*?)<\/h6>/g, replacement: '[h6]$1[/h6]' },
            { regex: /<u>(.*?)<\/u>/g, replacement: '[u]$1[/u]' },
            { regex: /<m-hr><\/m-hr>/g, replacement: '[hr/]' },
            { regex: /<p class="tip">(.*?)<\/p>/g, replacement: '[tip]$1[/tip]' },
            { regex: /<div class="tipblock"><p>(.*?)<\/p><\/div>/g, replacement: '[tipblock]$1[/tipblock]' },
            { regex: /<div class="warnblock"><p>(.*?)<\/p><\/div>/g, replacement: '[warnblock]$1[/warnblock]' },
            { regex: /<span class="lblock">(.*?)<\/span>/g, replacement: '[lcode]$1[/lcode]' },
            { regex: /<div class="code"><pre><code>(.*?)<\/code><\/pre><\/div>/gs, replacement: '[code]$1[/code]' },
            { regex: /<span style="color:blue">(.*?)<\/span>/gs, replacement: '[blue]$1[/blue]' },
            { regex: /<span style="color:yellow">(.*?)<\/span>/gs, replacement: '[yellow]$1[/yellow]' },
            { regex: /<span style="color:red">(.*?)<\/span>/gs, replacement: '[red]$1[/red]' },
            { regex: /<m-table>(.*?)<\/m-table>/gs, replacement: '[table]$1[/table]' },
            { regex: /<m-table-title>(.*?)<\/m-table-title>/gs, replacement: '[table-title]$1[/table-title]' },
            { regex: /<m-tr>(.*?)<\/m-tr>/gs, replacement: '[tr]$1[/tr]' },
            { regex: /<m-td>(.*?)<\/m-td>/gs, replacement: '[td]$1[/td]' },
            { regex: /<a href="https:\/\/micropue\.com\.cn\/url\?refresh=.*?" target="_blank">(.*?)<\/a>/g, replacement: '[link]$1[/link]' },
            { regex: /<span style="color:([#a-zA-Z0-9]+);">(.*?)<\/span>/g, replacement: '[color:$1]$2[/color]' },
            { regex: /<span class="frac"><span class="frac-top">(.*?)<\/span><hr><span class="frac-bottom">(.*?)<\/span><\/span>/g, replacement: "[frac]$1\\$2[/frac]" },
            { regex: /<span class="math">(.*?)<\/span>/g, replacement: '[math]$1[/math]' },
            { regex: /<span class="pow">(.*?)<sup>(.*?)<\/sup><\/span>/g, replacement: '[pow:$2]$1[/pow]' },
            { regex: /<span class="sub">(.*?)<sub>(.*?)<\/sub><\/span>/g, replacement: '[sub:$2]$1[/sub]' },
            { regex: /<span class="sqrt"><sup>(.*?)<\/sup>√<span class="sqrt-content">(.*?)<\/span><\/span>/g, replacement: '[sqrt:$2]$1[/sqrt]' },
            {
                regex: /<span style="font-size:(\d+)px;">(.*?)<\/span>/g,
                replacement: (match, size, text) => {
                    if (size > 0 && size <= 50)
                        return `[size:${size}]${text}[/size]`
                    else
                        return `[size:15]${text}[/size]`
                }
            }
        ]
        rules.forEach(rule => {
            outputText = outputText.replace(rule.regex, rule.replacement)
        })
        outputText = outputText.replace(/&nbsp;/g, ' ').replace(/<br>/g, '\n')
        return outputText
    }
}
/**
 * insert something form start to end
 * @param {Number} start start
 * @param {Number} end end
 * @param {Object | String} str value you can define [0] for left [1] for right
 */
Object.defineProperty(HTMLElement.prototype, "insertFromSelection", {
    value: function (start, end, str) {
        const a = this.value
        this.value = a.slice(0, start) + str[0] + a.slice(start, end) + (str[1] != undefined ? str[1] : "") + a.slice(end, a.length)
        this.selectionStart = this.selectionEnd = start + str[0].length
    },
    enumerable: false
})
class BuiltGmicrantType {
    constructor() {
        this.main
        this.allmodels = [
            ['b', '加粗'],
            ['i', '斜体'],
            ['s', '删除线'],
            ['blur', '模糊文本'],
            ['h1', '标题1'],
            ['h2', '标题2'],
            ['h3', '标题3'],
            ['h4', '标题4'],
            ['h5', '标题5'],
            ['h6', '标题6'],
            ['u', '下划线'],
            ['hr', '横线*'],
            ['tip', '提示文本'],
            ['tipblock', '提示块'],
            ['warnblock', '警告块'],
            ['lcode', '小代码区'],
            ['code', '代码域'],
            ['blue', '蓝色文本'],
            ['yellow', '黄色文本'],
            ['red', '红色文本'],
            ['table', '表格'],
            ['table-title', '表格标题'],
            ['tr', '表格行'],
            ['td', '表格纵'],
            ['link', '链接'],
            ['color', '字体颜色*'],
            ['size', '字体大小*'],
            ['highlight', '高亮'],
            ['frac', '分数'],
            ['math', '公式'],
            ['pow', '次方'],
            ['sqrt', '根式'],
            ['sub', '下角标'],
        ]
        this.input
        this.output
        this.lhr
    }
    init(element, defaultText = '') {
        if (document.querySelector(`[data-gmicrant-type="main"]`))
            return
        this.main = document.querySelector(element)
        this.main.innerHTML = `<div data-gmicrant-type="main"><div data-gmicrant-type="bar"><div data-gmicrant-type="bar-base"></div></div><div data-gmicrant-type="content"><textarea data-gmicrant-type="input" placeholder="输入内容"></textarea><m-lhr data-gmicrant-type="lhr"></m-lhr><div data-gmicrant-type="output"></div></div></div>`
        this.input = this.main.querySelector(`[data-gmicrant-type="input"]`)
        this.output = this.main.querySelector(`[data-gmicrant-type="output"]`)
        if (defaultText != '') {
            this.input.value = defaultText
            this.output.innerHTML = GmicrantType.encode(defaultText)
        }
        this.lhr = this.main.querySelector(`[data-gmicrant-type="lhr"]`)
        const p = this.main.querySelector(`[data-gmicrant-type="bar-base"]`)
        this.allmodels.forEach(t => {
            const s = document.createElement("div")
            s.setAttribute("data-gmicrant-type", "item")
            s.setAttribute("data-gmicrant-type-insertType", t[0])
            s.setAttribute("wave", "#bebebe9e")
            s.innerHTML = `<p>${t[1]}</p>`
            s.onclick = () => {
                insert(t[0])
            }
            p.append(s)
        })
        wave()
        this.input.addEventListener("input", () => {
            this.output.innerHTML = GmicrantType.encode(this.input.value)
        })
        var clickStatus = false
        this.lhr.addEventListener("mousedown", () => {
            clickStatus = true
        })
        document.addEventListener("mouseup", () => {
            clickStatus = false
        })
        document.addEventListener("mousemove", (e) => {
            if (clickStatus) {
                const mouse = {
                    x: e.clientX - this.main.offsetLeft,
                    y: e.clientY - this.main.offsetTop
                }
                this.input.style.width = mouse.x / this.main.getBoundingClientRect().width * 100 + "%"
                this.output.style.width = (1 - mouse.x / this.main.getBoundingClientRect().width) * 100 + "%"
            }
        })
        const insert = (option) => {
            const c = {
                s: this.input.selectionStart,
                e: this.input.selectionEnd
            }
            switch (option) {
                case 'hr':
                    this.input.insertFromSelection(c.s, c.e, ['[hr/]'])
                    break
                case 'lhr':
                    this.input.insertFromSelection(c.s, c.e, ['[lhr/]'])
                    break
                case 'color':
                    this.input.insertFromSelection(c.s, c.e, ['[color:]', '[/color]'])
                    break
                case 'size':
                    this.input.insertFromSelection(c.s, c.e, ['[size:]', '[/size]'])
                    break
                case 'pow':
                    this.input.insertFromSelection(c.s, c.e, ['[pow:]', '[/pow]'])
                    break
                case 'sqrt':
                    this.input.insertFromSelection(c.s, c.e, ['[sqrt:]', '[/sqrt]'])
                    break
                case 'sub':
                    this.input.insertFromSelection(c.s, c.e, ['[sub:]', '[/sub]'])
                    break
                default:
                    this.input.insertFromSelection(c.s, c.e, [`[${option}]`, `[/${option}]`])
                    break
            }
            this.input.focus()
            this.output.innerHTML = GmicrantType.encode(this.input.value)
        }
    }
    enableAnimate() {
        const a = this.main.querySelector(`[data-gmicrant-type="bar"]`)
        function compute(i) {
            const s = i.getBoundingClientRect().left
            const r = a.offsetWidth
            const y = s - r / 2
            return Math.abs(y)
        }
        function rangmaping(value, min, max, oldmin, oldmax) {
            return (max - min) * (value / (oldmax - oldmin)) + min
        }
        const s = this.main.querySelectorAll(`[data-gmicrant-type="item"]`)
        a.addEventListener("scroll", () => {
            s.forEach(o => {
                const r = rangmaping(compute(o), 0, 1, 0, a.scrollWidth)
                o.style.transform = `scale(${1 - r})`
            })
        })
    }
    getData() {
        return this.input.value
    }
    getHTML() {
        return this.output.innerHTML
    }
}
(() => {
    function e() {
        //add event for little bar on the [data-lists=model]. When the DOM changed, it will working to add a new Event.
        /* maybe later... */
        /* Too many eventlistener! */
        //for data-enable-lists, you can use this to make a lists for your document.
        const enableLists = document.querySelectorAll("[data-enable-lists]")
        enableLists.forEach(self => {
            if (self.parentElement.querySelector("[data-lists=main]")) return
            //auto get H1,H2,H3 from html,and make a lists
            const _ele = document.createElement("div")
            _ele.setAttribute("data-lists", "model")
            const ele = document.createElement("div")
            ele.setAttribute("data-lists", "main")
            const ele_ = document.createElement("div")
            ele_.setAttribute("data-lists", "container")
            const headlines = self.querySelectorAll("h1,h2,h3,h4,h5,h6")
            headlines.forEach(headlines => {
                const s = (Math.random() * (10 ** 20)).toString(24)
                headlines.id = "data-lists-" + s
                const eachHeadlines = headlines.tagName
                const item = document.createElement("div")
                item.setAttribute("data-lists", `item-${eachHeadlines}`)
                item.innerHTML = `<p>${headlines.innerText.length > 10 ? headlines.innerText.slice(0, 7) + "..." : headlines.innerText}</p>`
                item.onclick = () => {
                    const location = document.querySelector(`#data-lists-${s}`).offsetTop - self.parentElement.scrollTop
                    self.parentElement.classList.add("scroll-smooth")
                    self.parentElement.scrollTop = self.parentElement.scrollTop + location
                    setTimeout(() => {
                        self.parentElement.classList.remove("scroll-smooth")
                    }, 1000)
                }
                ele_.append(item)
            })
            ele.prepend(ele_)
            _ele.prepend(ele)
            self.parentElement.prepend(_ele)
            //only for safari
            const browser = navigator.userAgent
            if (browser.includes(`Safari`) && !browser.includes(`Chrome`)) {
                const e = self.parentElement.querySelector("[data-lists=main]")
                if (e) {
                    const height = e.querySelector("[data-lists=container]").offsetHeight
                    e.style.minHeight = height + 5 + "px"
                }
            }
        })
    }
    const elementListener = new MutationObserver(e)
    elementListener.observe(document.querySelector("body"), {
        childList: true,
        subtree: true,
        attributes: true,
    })
})()
/**
 * shuffle array by method
 * just Array.shuffle
 */
Object.defineProperty(Array.prototype, "shuffle", {
    value: function () {
        for (var i = 0; i < this.length; i++) {
            for (var j = i; j < this.length; j++) {
                const o = parseInt(Math.random() * this.length)
                const tmp = this[j]
                this[j] = this[o]
                this[o] = tmp
            }
        }
    },
    enumerable: false
})
/**
 * shuffle object by method
 * just Object.shuffle()
 */
Object.defineProperty(Object.prototype, "shuffle", {
    value: function () {
        if (!Array.isArray(this)) {
            var s = []
            for (let i in this) {
                s.push(i)
            }
            s.shuffle()
            var o = 0
            for (let j in this) {
                const tmp = this[j]
                this[j] = this[s[o]]
                this[s[o]] = tmp
                o++
            }
        } else console.error("error! need object!")
    },
    enumerable: false
})
/**
 * to init the icons m-icon-{search}
 * you can use attribute: "size | color"
 */
class __mIcon__ extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: "open" })
    }
    connectedCallback() {
        const size = this.getAttribute("size") || "28"
        const color = this.getAttribute("color") || "#cecece"
        const type = this.getAttribute("type")
        this.style.width = size + 'px'
        this.style.height = size + 'px'
        this.style.display = "flex"
        this.style.justifyContent = "center"
        this.style.alignItems = "center"
        var svgs = {
            "search": `<svg id="组件_1_1" data-name="组件 1 – 1" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 28.121 30.997"><g id="椭圆_1" data-name="椭圆 1" fill="none" stroke="${color}" stroke-width="3"><circle cx="12" cy="12" r="12" stroke="none"/><circle cx="12" cy="12" r="10.5" fill="none"/></g><line id="直线_1" data-name="直线 1" x2="8" y2="9" transform="translate(19 21)" fill="none" stroke="${color}" stroke-width="3"/></svg>`,
            "down": `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 23.324 12.295"><line id="直线_8" data-name="直线 8" x2="9.548" y2="8.067" transform="translate(2.114 2.114)" fill="none" stroke="${color}" stroke-linecap="round" stroke-width="3"/><line id="直线_9" data-name="直线 9" x1="9.548" y2="8.067" transform="translate(11.662 2.114)" fill="none" stroke="${color}" stroke-linecap="round" stroke-width="3"/></svg>`,
            "select": `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 29.593 29"><g id="组件_5_1" data-name="组件 5 – 1" transform="translate(1.5)"><g id="矩形_5" data-name="矩形 5" transform="translate(4.093)" fill="none" stroke="${color}" stroke-width="3"><rect width="24" height="24" rx="4" stroke="none"/><rect x="1.5" y="1.5" width="21" height="21" rx="2.5" fill="none"/></g><line id="直线_4" data-name="直线 4" y2="19.735" transform="translate(0 7.765)" fill="none" stroke="${color}" stroke-linecap="round" stroke-width="3"/><line id="直线_5" data-name="直线 5" x1="20.593" transform="translate(0 27.5)" fill="none" stroke="${color}" stroke-linecap="round" stroke-width="3"/><line id="直线_6" data-name="直线 6" x2="4" y2="4.5" transform="translate(10.593 11.765)" fill="none" stroke="${color}" stroke-linecap="round" stroke-width="3"/><line id="直线_7" data-name="直线 7" y1="8.5" x2="7" transform="translate(14.593 7.765)" fill="none" stroke="${color}" stroke-linecap="round" stroke-width="3"/></g</svg>`,
            "add": `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 27.318 27.006"><g id="组_2" data-name="组 2" transform="translate(-363.9 -133.997)"><line id="直线_2" data-name="直线 2" x2="23.318" transform="translate(365.9 147.5)" fill="none" stroke="${color}" stroke-linecap="round" stroke-width="4"/><line id="直线_3" data-name="直线 3" x2="23.006" transform="translate(377.559 135.997) rotate(90)" fill="none" stroke="${color}" stroke-linecap="round" stroke-width="4"/></g></svg>`,
            "cancel": `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 40.544 40.544"><g id="组件_6_1" data-name="组件 6 – 1" transform="translate(4.95 4.95)"><line id="直线_26" data-name="直线 26" x2="30.644" y2="30.644" fill="none" stroke="${color}" stroke-linecap="round" stroke-width="7"/><line id="直线_27" data-name="直线 27" x2="30.644" y2="30.644" transform="translate(30.644) rotate(90)" fill="none" stroke="${color}" stroke-linecap="round" stroke-width="7"/></g</svg>`,
            "more": `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 16 4"><circle id="椭圆_7" data-name="椭圆 7" cx="2" cy="2" r="2" fill="${color}"/><circle id="椭圆_8" data-name="椭圆 8" cx="2" cy="2" r="2" transform="translate(6)" fill="${color}"/><circle id="椭圆_9" data-name="椭圆 9" cx="2" cy="2" r="2" transform="translate(12)" fill="${color}"/</svg>`,
            "info": `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 6.605 12.898"><g id="组件_2_1" data-name="组件 2 – 1" transform="translate(1)"><line id="直线_10" data-name="直线 10" y2="7.676" transform="translate(2.303 4.222)" fill="none" stroke="${color}" stroke-linecap="round" stroke-width="2"/><line id="直线_11" data-name="直线 11" x2="2.303" transform="translate(0 4.222)" fill="none" stroke="${color}" stroke-linecap="round" stroke-width="2"/><line id="直线_12" data-name="直线 12" x2="4.605" transform="translate(0 11.898)" fill="none" stroke="${color}" stroke-linecap="round" stroke-width="2"/><circle id="椭圆_6" data-name="椭圆 6" cx="1.151" cy="1.151" r="1.151" transform="translate(1.151)"/></g></svg>`,
            "warn": `<svg id="组件_7_1" data-name="组件 7 – 1" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 25 25"><g id="椭圆_10" data-name="椭圆 10" fill="none" stroke="${color}" stroke-width="3"><circle cx="12.5" cy="12.5" r="12.5" stroke="none"/><circle cx="12.5" cy="12.5" r="11" fill="none"/></g><line id="直线_30" data-name="直线 30" y2="8" transform="translate(12.5 6.55)" fill="none" stroke="${color}" stroke-linecap="round" stroke-width="3"/><circle id="椭圆_11" data-name="椭圆 11" cx="1.5" cy="1.5" r="1.5" transform="translate(11 17.05)" fill="${color}"/></svg>`,
            "undo": `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 31.735 37.874"><g id="组件_8_1" data-name="组件 8 – 1" transform="translate(3.536 3.536)"><path id="路径_2" data-name="路径 2" d="M1575.52,1330.277s10.326-24.983-23.626-24.736" transform="translate(-1551.394 -1299.204)" fill="none" stroke="${color}" stroke-linecap="round" stroke-width="5"/><line id="直线_31" data-name="直线 31" y1="6" x2="6" fill="none" stroke="${color}" stroke-linecap="round" stroke-width="5"/><line id="直线_32" data-name="直线 32" x2="6" y2="6" transform="translate(0 6.5)" fill="none" stroke="${color}" stroke-linecap="round" stroke-width="5"/></g></svg>`,
            "redo": `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32.632 37.874"><g id="组件_8_2" data-name="组件 8 – 2" transform="translate(2.597 3.536)"><path id="路径_2" data-name="路径 2" d="M1553.372,1330.277s-10.326-24.983,23.626-24.736" transform="translate(-1551.894 -1299.204)" fill="none" stroke="${color}" stroke-linecap="round" stroke-width="5"/><line id="直线_31" data-name="直线 31" x1="6" y1="6" transform="translate(20.5)" fill="none" stroke="${color}" stroke-linecap="round" stroke-width="5"/><line id="直线_32" data-name="直线 32" x1="6" y2="6" transform="translate(20.5 6.5)" fill="none" stroke="${color}" stroke-linecap="round" stroke-width="5"/></g></svg>`,
        }
        this.shadowRoot.innerHTML = svgs[type]
        const io = new MutationObserver(() => {
            const newOption = {
                color: this.getAttribute("color"),
                size: this.getAttribute("size"),
                type: this.getAttribute("type")
            }
            this.shadowRoot.innerHTML = svgs[newOption.type]
            const svg = { resizeEle: this.shadowRoot.querySelector("svg"), recolorEle: this.shadowRoot.querySelectorAll("[stroke],[fill]") }
            svg.resizeEle.setAttribute("width", newOption.size)
            svg.resizeEle.setAttribute("height", newOption.size)
            svg.recolorEle.forEach(self => {
                if (self.getAttribute("fill") && self.getAttribute("fill") != "none") self.setAttribute("fill", newOption.color)
                if (self.getAttribute("stroke") && self.getAttribute("stroke") != "none") self.setAttribute("stroke", newOption.color)
            })
        })
        io.observe(this, { childList: true, attributes: true })
    }
}
customElements.define("m-icon", __mIcon__)
/**
 * selection init element
 */
class __mSelection__ extends HTMLElement {
    constructor() {
        super()
        this.value = this.querySelector("m-option[selected]").getAttribute("value")

        try {
            this.querySelector("m-option[selected]").getAttribute("value")
            this.value = this.querySelector("m-option[selected]").getAttribute("value")
        } catch {
            console.error("You need to init value!")
        }
        this.is_open = false
    }
    connectedCallback() {
        const view = this.querySelector("m-select-view")
        const defaultTitle = view.innerHTML
        view.innerHTML = `<p>${defaultTitle}</p><m-icon type="down" style="margin-left:15px;" size="14" color="black"></m-icon>`
        const list = this.querySelector("m-select-options")
        const options = this.querySelectorAll("m-option")
        const ele = this
        const open$list = {
            ele,
            animate(type = `open`) {
                switch (type) {
                    case "open":
                        list.classList.remove("out")
                        list.classList.add("in")
                        this.ele.classList.add("open")
                        this.is_open = true
                        break
                    case "close":
                        list.classList.remove("in")
                        list.classList.add("out")
                        setTimeout(() => {
                            this.ele.classList.remove("open")
                            this.is_open = false
                        }, 300)
                        break
                }
            },
            init() {
                view.addEventListener("click", () => {
                    this.animate()
                })
            },
            blur() {
                var is_over = true
                view.addEventListener("mouseleave", () => {
                    is_over = false
                })
                view.addEventListener("mouseover", () => {
                    is_over = true
                })
                list.addEventListener("mouseover", () => {
                    is_over = true
                })
                list.addEventListener("mouseleave", () => {
                    is_over = false
                })
                document.addEventListener("click", () => {
                    if (!is_over)
                        this.animate("close")
                })
            }
        }
        open$list.init()
        open$list.blur()
        function remove() {
            options.forEach(self => {
                self.removeAttribute("selected")
            })
        }
        const init = () => {
            options.forEach(self => {
                self.addEventListener("click", () => {
                    remove()
                    self.setAttribute("selected", "")
                    this.value = self.getAttribute("value")
                })
            })
        }
        init()
    }
}
customElements.define("m-select", __mSelection__)
/**
 * m-menu
 */
class __mMenu__ extends HTMLElement {
    constructor() {
        super()
        this.opened = false
    }
    open() {
        this.classList.add("in")
        this.classList.remove("out")
        this.style.display = "flex"
        this.opened = true
        this.setAttribute("mui-isopen", "true")
    }
    close() {
        this.classList.remove("in")
        this.classList.add("out")
        setTimeout(() => {
            this.style.display = "none"
        }, 300)
        this.opened = false
        this.setAttribute("mui-isopen", "false")
    }
    connectedCallback() {
        const _for = this.getAttribute("for")
        if (!_for) {
            console.error("Can't find attribute \"for\" or it's empty")
        }
        const clickEle = document.querySelector(_for)
        this.setAttribute("mui-isopen", "false")
        var mouseon = false
        clickEle.addEventListener("click", () => {
            if (this.opened) {
                this.close()
            }
            else {
                this.open()
            }
        })
        clickEle.addEventListener("mouseover", () => {
            mouseon = true
        })
        clickEle.addEventListener("mouseleave", () => {
            mouseon = false
        })
        document.addEventListener("click", () => {
            if (!mouseon) {
                this.close()
            }
        })
    }
}
customElements.define("m-menu", __mMenu__)
/**
 * m-switch
 */
class __mSwitch__ extends HTMLElement {
    constructor() {
        super()
        this.checked = undefined
        this.attachShadow({ mode: "open" })
    }
    connectedCallback() {
        const style = document.createElement("style")
        style.textContent = `:host {
  --size: ${this.getAttribute("size") || 20}px;
  width: calc(var(--size) * 1.8);
  height: var(--size);
  background-color: rgb(239, 239, 239);
  display: block;
  border-radius: 100px;
  position: relative;
  transition: 0.3s;
  cursor: pointer;
}
:host span.ball {
  width: calc(var(--size) - 5px);
  height: calc(var(--size) - 5px);
  background-color: white;
  position: absolute;
  top: 0;
  left: 2px;
  border-radius: 50%;
  bottom: 0;
  margin: auto;
  transition: 0.3s;
}
:host(:hover) span.ball {
  filter: brightness(97%);
}
:host([checked=true]) {
  background-color: var(--theme-color);
}
:host([checked=true]) span.ball {
  transform: translateX(100%);
}
:host([disabled]){
filter:brightness(95%);
}
:host([disabled][checked=true]) {
  background-color: #afddff;
}
:host([disabled]) span.ball{
cursor:default;
}
:host([disabled]) span.ball:hover {
  filter: brightness(100%);
}`
        this.shadowRoot.append(style)
        this.shadowRoot.innerHTML += `<span class="ball"></span>`
        this.checked = this.getAttribute("checked") == "true" ? true : false
        const io = new MutationObserver(() => {
            this.checked = this.getAttribute("checked") == "true" ? true : false
        })
        io.observe(this, { childList: true, attributes: true })
        this.addEventListener("click", () => {
            if (this.getAttribute("disabled") == "") return
            if (this.getAttribute("checked") == "true")
                this.setAttribute("checked", "false")
            else
                this.setAttribute("checked", "true")
        })
    }
}
customElements.define("m-switch", __mSwitch__)
/**
 * m-button hover it it's beautiful!
 */
class __mButton__ extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: "open" })
    }
    connectedCallback() {
        const shadowColor = this.getAttribute("shadow-color") || "var(--theme-color)"
        const size = {
            width: this.getAttribute("mui-width") || 80,
            height: this.getAttribute("mui-height") || 40,
        }
        const text = this.innerHTML
        const style = document.createElement("style")
        style.textContent = `:host {
  --shadowColor: var(--theme-color);
  --width: 80px;
  --height: 40px;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  width: var(--width);
  height: var(--height);
  border-radius: 10px;
  transition: 0.2s;
  display: flex;
}
:host(:hover) {
  transform: scale(1.1);
}
:host(:active) {
  transform: scale(0.9);
}
:host(:active) .text {
  background-color: var(--shadowColor);
  color: white;
}
  :host .text {
  position: absolute;
  background-color: rgba(240, 240, 240, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 1;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  box-sizing: border-box;
  width: calc(var(--width) - 5px);
  height: calc(var(--height) - 5px);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  transition: 0.2s;
  cursor: pointer;
}
:host .shadow {
  --x: 0px;
  --y: 0px;
  position: absolute;
  top: 0;
  left: 0;
  filter: blur(20px);
  background-color: var(--shadowColor);
  z-index: 0;
  width: 100%;
  height: 100%;
  transform: translate(var(--x), var(--y));
}`
        this.shadowRoot.append(style)
        this.style.setProperty("--shadowColor", shadowColor)
        this.style.setProperty("--width", `${size.width}px`)
        this.style.setProperty("--height", `${size.height}px`)
        this.shadowRoot.innerHTML += `<span class="text">${text}</span><span class="shadow"></span>`
        window.addEventListener("mousemove", (e) => {
            const { clientX, clientY } = e
            const { top, left, width, height } = this.getBoundingClientRect()
            const re = {
                x: clientX - left - width / 2,
                y: clientY - top - height / 2
            }
            const shadow = this.shadowRoot.querySelector(".shadow")
            shadow.style.setProperty("--x", re.x + "px")
            shadow.style.setProperty("--y", re.y + "px")
        })
    }
}
customElements.define("m-button", __mButton__)
/**
 * m-input
 */
class __mInput__ extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: "open" })
    }
    connectedCallback() {
        const type = this.getAttribute("type") || "text"
        const placeholder = this.getAttribute("placeholder") || "输入..."
        const options = {
            shadowColor: this.getAttribute("shadow-color") || "var(--theme-color)",
            bgcolor: this.getAttribute("mui-bgcolor") || "var(--rgba-theme-color)"
        }
        this.style.setProperty("--shadowColor", options.shadowColor)
        this.style.setProperty("--bgcolor", options.bgcolor)
        const style = document.createElement("style")
        style.textContent = `
        :host {
        display:block;
  --shadowColor: var(--theme-color);
  --bgcolor: var(--rgba-theme-color);
  overflow: hidden;
  width: 150px;
  height: 50px;
  border-radius: 10px;
  position: relative;
  background-color: #f6f6f6;
}
:host label {
  position: absolute;
  z-index: 2;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  width: -moz-fit-content;
  width: fit-content;
  color: var(--bgcolor);
  font-weight: 400;
  transition: 0.3s;
  font-size: 13px;
}
:host input.focused~label {
  opacity: 0;
  filter: blur(30px);
}
:host input {
  position: absolute;
  width: calc(100% - 5px);
  height: calc(100% - 5px);
  outline: none;
  border: none;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  border-radius: 8px;
  box-sizing: border-box;
  padding: 10px 20px;
  background-color: rgba(255, 255, 255, 0.5);
  transition: all 0.3s;
  color: black;
  outline: 0px solid rgba(255, 255, 255, 0);
  z-index: 1;
  font-size: 15px;
}
:host input:focus {
  background: var(--bgcolor);
  background-position-x: 0px;
  color: white;
}
:host input::-moz-selection {
  background-color: var(--bgcolor);
}
:host input::selection {
  background-color: var(--bgcolor);
}
span {
  --x: -100%;
  --y: -100%;
  position: absolute;
  top: var(--y);
  left: var(--x);
  background-color: var(--shadowColor);
  width: 100px;
  height: 100px;
  filter: blur(50px);
  z-index: 0;
  border-radius:50%;
}`
        this.shadowRoot.appendChild(style)
        this.shadowRoot.innerHTML += `<input type="${type}"/><label>${placeholder}</label><span></span>`
        const ele = {
            label: this.shadowRoot.querySelector("label"),
            input: this.shadowRoot.querySelector("input"),
            ball: this.shadowRoot.querySelector("span")
        }
        ele.input.addEventListener("focus", () => ele.input.classList.add("focused"))
        ele.input.addEventListener("blur", () => { if (ele.input.value.length == 0) ele.input.classList.remove("focused") })
        window.addEventListener("mousemove", (e) => {
            const { clientX, clientY } = e
            const { left, top } = this.getBoundingClientRect()
            const { width, height } = ele.ball.getBoundingClientRect()
            ele.ball.style.setProperty("--x", `${clientX - left - width / 2}px`)
            ele.ball.style.setProperty("--y", `${clientY - top - height / 2}px`)
        })
    }
}
customElements.define("m-input", __mInput__)
class __mTip__ extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        const parent = this.parentElement
        const { height } = this.getBoundingClientRect()
        this.style.setProperty("--height", `${height}px`)
        parent.addEventListener("mouseover", () => {
            this.classList.add("show")
        })
        parent.addEventListener("mouseleave", () => {
            this.classList.remove("show")
        })
    }
}
customElements.define("m-tip", __mTip__)
class __mLoading__ extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: "open" })
    }
    connectedCallback() {
        const style = document.createElement("style")
        style.textContent = `
        :host{position:fixed;
        top:0;
        left:0;
        width:150px;
        height:5px;
        border-radius:30px;
        background-color:var(--theme-color);
        display:none;
        }
        :host([start]){
        display:initial;
        animation:m-loading-bar 3s linear infinite;
        }
        @keyframes m-loading-bar{
        0%{
        left:-150px;
        width:50px;
        }
        50%{width:150px;}
        100%{
        left:100%;
        width:50px;
        }
        }
        `
        this.shadowRoot.append(style)
    }
    start() {
        this.setAttribute("start", "")
    }
    end() {
        this.removeAttribute("start")
    }
}
customElements.define("m-loading", __mLoading__)
/**
 * modal box
 * options:
 * <m-modal-box> is the main element,
 * <m-modal-box-page> is the content of modal box.
 * <m-modal-box-head> is the head of page. Two buttons on this element, Absolutely you can use two or not.
 * <m-modal-box-body> is the content of the page. There are also some elements in this: <m-modal-option> and <m-modal-option-item>. The second one is in the first one.
 * You also can initializate on new ModalBox object.
 * options:{
 *  where: where to open this modal box,
 *  content: the content of the modal box, you can use the html ``.
 * }
 * open() to open the modal box;
 * close() to close the modal box;
 * is_opening to check open or not. It'll return a boolean value.
 */
class mModalBox {
    constructor(options) {
        this.is_opening = false
        this.uid = (() => {
            var uid
            uid = Math.random() * 10 ** 5
            uid = btoa(uid).replace(/\=/gs, "")
            for (var i = 1; i < uid.length / 5; i++) {
                const tmp = uid.slice(0, i * 5)
                const last = uid.slice(i * 5, uid.length - 1)
                uid = tmp + "-" + last
            }
            return uid
        })()
        this.options = {
            where: document.querySelector(options.where) || undefined,
            content: {
                head: {
                    first: (() => {
                        var r
                        try {
                            r = {
                                text: options.content.head.first.text || undefined, //button text
                                func: options.content.head.first.func || undefined //return function}
                            }
                        } catch {
                            r = undefined
                        }
                        return r
                    })(),
                    title: options.content.head.title,
                    last: (() => {
                        var r
                        try {
                            r = {
                                text: options.content.head.last.text || undefined, //button text
                                func: options.content.head.last.func || undefined //return function
                            }
                        } catch {
                            r = undefined
                        }
                        return r
                    })(),
                },
                body: options.content.body
            }
        }
    }
    open() {
        const ele = document.querySelector(`[mui-uid=${this.uid}]`)
        ele.classList.remove("out")
        ele.classList.add("in")
        ele.style.display = "flex"
        ele.setAttribute("mui-isopen", "true")
        this.is_opening = true
    }
    close() {
        const ele = document.querySelector(`[mui-uid=${this.uid}]`)
        ele.classList.remove("in")
        ele.classList.add("out")
        setTimeout(() => {
            ele.style.display = "none"
            this.is_opening = false
            ele.setAttribute("mui-isopen", "false")
        }, 600)
    }
    logout() {
        const ele = document.querySelector(`[mui-uid=${this.uid}]`)
        ele.remove()
    }
    init() {
        const _body = document.querySelector("body")
        const main = document.createElement("m-modal")
        const page = document.createElement("m-modal-page")
        const head = document.createElement("m-modal-head")
        const __el = this.options
        const headItems = {
            options: __el,
            firstChild() {
                try {
                    var ele
                    if (this.options.content.head.first) {
                        ele = document.createElement("p")
                        ele.setAttribute("m-modal-head-first-button", "")
                        ele.textContent = this.options.content.head.first.text
                        if (this.options.content.head.first.func != undefined)
                            ele.onclick = this.options.content.head.first.func
                        head.appendChild(ele)
                    }
                } catch { }
            },
            centerChild() {
                var ele = document.createElement("p")
                ele.setAttribute("m-modal-head-title", "")
                ele.innerText = this.options.content.head.title
                head.appendChild(ele)
            },
            lastChild() {
                try {
                    var ele
                    if (this.options.content.head.last) {
                        ele = document.createElement("p")
                        ele.setAttribute("m-modal-head-last-button", "")
                        ele.textContent = this.options.content.head.last.text
                        if (this.options.content.head.last.func != undefined)
                            ele.onclick = this.options.content.head.last.func
                        head.appendChild(ele)
                    }
                } catch { }
            }
        }
        headItems.firstChild()
        headItems.centerChild()
        headItems.lastChild()
        const body = document.createElement("m-modal-body")
        body.innerHTML = this.options.content.body
        page.appendChild(head)
        page.appendChild(body)
        main.appendChild(page)
        main.setAttribute("mui-isopen", "false")
        main.setAttribute("mui-uid", this.uid)
        if (this.options.where != undefined)
            this.options.where.addEventListener("click", () => {
                if (main.getAttribute("mui-isopen") == "false") {
                    this.open()
                } else {
                    this.close()
                }
            })
        _body.appendChild(main)
    }
    update(html) {
        const ele = document.querySelector(`[mui-uid=${this.uid}] m-modal-body`)
        ele.innerHTML = html
    }
}

/**
 * popup box
 * use mpopup.warn() and mpopup.tip() to build a new popup box.
 * (content,interactive) is or no interactive. true or false.
 */
const mpopup = {
    remove(div) {
        var eles = [...document.querySelectorAll("m-popup")]
        eles.reverse()
        const realall = []
        const uid = div.getAttribute("mui-uid")
        const height = div.getBoundingClientRect().height
        var is = false
        for (const item of eles) {
            if (is) {
                realall.push(item)
            }
            if (item.getAttribute(`mui-uid`) == uid) is = true
        }
        realall.forEach(self => {
            const temp = Number(self.getAttribute("mui-translateY"))
            self.style.marginTop = temp - height - 20 + "px"
            self.setAttribute("mui-translateY", temp - height - 20)
        })
    },
    structure(type, content, interactive) {
        var color = {
            color: "red",
            rgbcolor: "rgba(255, 0, 0, 0.482)"
        }
        var inter
        var text = "注意"
        switch (interactive) {
            case true:
                inter = `<m-popup-buttons><m-popup-enter>确定</m-popup-enter></m-popup-buttons>`
                break
            case false:
                inter = ``
                break
        }
        switch (type) {
            case "warn":
                break
            case "tip":
                text = "提示"
                color.color = "#ff9600"
                color.rgbcolor = "#ffc300a6"
        }
        const main = document.createElement("m-popup")
        const uid = (Math.random() * 10 ** 5).toString(36)
        main.style.setProperty("--color", color.color)
        main.style.setProperty("--rgbcolor", color.rgbcolor)
        main.setAttribute("mui-uid", uid)
        main.classList = "in"
        main.innerHTML = `<m-popup-head><m-icon type="warn" color="${color.color}" size="22"></m-icon><p>${text}</p></m-popup-head><m-popup-body><p>${content}</p>${inter}</m-popup-body><m-popup-range class="${!interactive ? "inter" : ""}"></m-popup-range>`
        if (interactive) {
            const _inter = main.querySelector("m-popup-enter")
            let ising = false
            _inter.onclick = () => {
                if (ising) return
                ising = true
                main.classList = "out"
                this.remove(main)
                setTimeout(() => {
                    main.remove()
                    ising = false
                }, 1000)
            }
        } else {
            setTimeout(() => {
                main.classList = "out"
                this.remove(main)
                setTimeout(() => {
                    main.remove()
                }, 1000)
            }, 5000)
        }
        return {
            main,
            uid
        }
    },
    move(divs, newdiv) {
        const eles = document.querySelectorAll(divs)
        const height = newdiv.getBoundingClientRect().height
        eles.forEach(self => {
            if (self.getAttribute("mui-uid") != newdiv.getAttribute("mui-uid")) {
                const temp = Number(self.getAttribute("mui-translateY")) || 10
                self.style.marginTop = `${temp + height + 20}px`
                self.setAttribute("mui-translateY", temp + height + 20)
            }
        })
    },
    warn(content, interactive = false) {
        const body = document.querySelector("body")
        const ele = this.structure("warn", content, interactive).main
        body.append(ele)
        this.move(`m-popup`, ele)
    },
    tip(content, interactive = false) {
        const body = document.querySelector("body")
        const ele = this.structure("tip", content, interactive).main
        body.append(ele)
        this.move(`m-popup`, ele)
    }
}
/**
 * live Router management.
 * init your route table like: {
 * [url,function]
 * }
 */
class RouteLoader {
    constructor(route) {
        this.defaultRouterID = this.uid()
        this.routeTable = this.structure(route)
        this.init()
        this.nowhash = decodeURI(location.hash)
        this.timeout
        this.nowRouteid = this.defaultRouterID // if this hash has been in the route table, it will change
    }

    uid() {
        var s = (Math.random() * 10 ** 20).toString(36)
        for (var i = 5; i < s.length; i += 5) {
            s = s.slice(0, i) + "-" + s.slice(i, s.length - 1)
        }
        return s
    }

    structure(route) {
        var result = []
        for (const item of route) {
            const uid = this.uid()
            const pathRegex = new RegExp(
                `^${item[0].replace(/{%}/g, "([^/]+)")}\\??(.*)$`
            )
            result.push({
                path: item[0],
                func: item[1],
                routeid: uid,
                regex: pathRegex
            })
        }
        return result
    }

    init() {
        document.body.setAttribute("router-id", this.defaultRouterID)
        var relocate = () => {
            this.nowhash = decodeURI(location.hash)
            this.locate(this.nowhash.replace(/\#/, ""))
        }
        relocate()
        window.addEventListener("hashchange", (e) => {
            relocate()
        })
    }

    change(key, params, query) {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
            this.nowRouteid = this.routeTable[key].routeid
            this.routeTable[key].func(params, query)
            document.body.setAttribute("router-id", this.routeTable[key].routeid)
        }, 100)
    }

    locate(hash) {
        for (const key in this.routeTable) {
            const match = hash.match(this.routeTable[key].regex)
            if (match) {
                const params = match.slice(1, -1)
                const query = this.parseQuery(match[match.length - 1])
                this.change(key, params, query)
                return
            }
        }
    }

    parseQuery(queryString) {
        if (!queryString) return {}
        return queryString.split("&").reduce((result, pair) => {
            const [key, value] = pair.split("=")
            result[key] = value
            return result
        }, {})
    }
}
/**
 * micropue window maker.
 */
class mWindow {
    constructor(option) {
        this.opened = false
        this.uid
        this.is_init = false
        this.options = {
            size: { //Number
                width: option.size.width || 500,
                height: option.size.height || 300
            },
            defaultLocation: { //default location Number
                x: option.defaultLocation.x || 0,
                y: option.defaultLocation.y || 0
            },
            bgcolor: option.bgcolor || "white", // the background color of the m-window-body
            zIndex: option.zIndex || 100000,
            head: {
                title: option.head.title, //title of the head.
                //buttons of the head, you can init its functions.↓
                controls: (() => {
                    if (option.head.controls.length == 0 || option.head.controls.length == undefined) return undefined
                    var result = []
                    for (const item of option.head.controls) {
                        result.push({
                            name: item.name,
                            func: item.func ? item.func : undefined
                        })
                    }
                    return result
                })()
            },
            content: option.content //HTML String The content of the body
        }
    }
    init() {
        if (this.is_init) return
        this.is_init = true
        const node = this.structure(this.options)
        document.body.append(node.ele)
        this.uid = node.uid
    }
    open() {
        if (!this.is_init) {
            console.error("You need to init the window!")
            return
        }
        if (this.opened) return
        this.opened = true
        const ele = document.querySelector(`[mui-uid="${this.uid}"]`)
        ele.classList.remove("out")
        ele.classList.add("in")
        ele.style.display = "flex"
    }
    close() {
        if (!this.is_init) {
            console.error("You need to init the window!")
            return
        }
        if (!this.opened) return
        this.opened = false
        const ele = document.querySelector(`[mui-uid="${this.uid}"]`)
        ele.classList.remove("in")
        ele.classList.add("out")
        setTimeout(() => {
            ele.style.display = "none"
        }, 300)
    }
    logout() {
        if (!this.is_init) return
        this.is_init = false
        const ele = document.querySelector(`[mui-uid="${this.uid}"]`)
        ele.remove()
    }
    structure(option) {
        const ele = document.createElement("m-window")
        ele.classList = "in"
        ele.style.setProperty("--width", `${option.size.width}px`)
        ele.style.setProperty("--height", `${option.size.height}px`)
        ele.style.setProperty("--top", `${option.defaultLocation.y}px`)
        ele.style.setProperty("--left", `${option.defaultLocation.x}px`)
        ele.style.setProperty("--zIndex", `${option.zIndex}`)
        ele.style.setProperty("--bgcolor", `${option.bgcolor}`)
        const uid = (Math.random() * 10 ** 5).toString(36)?.replace(/\./, "")
        ele.setAttribute("mui-uid", uid)
        ele.innerHTML = `<m-window-head><m-window-title>${option.head.title}</m-window-title><m-window-control></m-window-control></m-window-head><m-window-body>${option.content}</m-window-body><m-window-resize title="拖动以改变大小"></m-window-resize>`
        const eles = {
            head: ele.querySelector("m-window-head"),
            control: ele.querySelector("m-window-head m-window-control"),
            resize: ele.querySelector("m-window-resize")
        }
        const init = {
            control() {
                if (option.head.controls == undefined) return
                for (const item of option.head.controls) {
                    const ele = document.createElement("m-window-control-item")
                    ele.onclick = item.func
                    ele.innerHTML = `<p>${item.name}</p>`
                    eles.control.append(ele)
                }
            },
            move() {
                var is_on = false
                var defaultLocation = {
                    x: 0,
                    y: 0
                }
                eles.head.addEventListener("mousedown", (e) => {
                    is_on = true
                    document.body.style.userSelect = "none"
                    const { offsetTop, offsetLeft } = ele
                    defaultLocation = {
                        x: e.clientX - offsetLeft,
                        y: e.clientY - offsetTop
                    }
                })
                document.addEventListener("mouseup", () => {
                    if (is_on) is_on = false
                    document.body.style.userSelect = "initial"
                })
                document.addEventListener("mousemove", (e) => {
                    if (!is_on) return
                    const { clientX, clientY } = e
                    const result = {
                        x: clientX - defaultLocation.x,
                        y: clientY - defaultLocation.y
                    }
                    const rule = {
                        max: {
                            x: window.innerWidth,
                            y: window.innerHeight
                        },
                        check() {
                            result.x = (() => {
                                if (result.x <= 0) return 0
                                if (result.x >= this.max.x - ele.offsetWidth) return this.max.x - ele.offsetWidth
                                return result.x
                            })()
                            result.y = (() => {
                                if (result.y <= 0) return 0
                                if (result.y >= this.max.y - ele.offsetHeight) return this.max.y - ele.offsetHeight
                                return result.y
                            })()
                        }
                    }
                    rule.check()
                    ele.style.setProperty("--top", `${result.y}px`)
                    ele.style.setProperty("--left", `${result.x}px`)
                })
            },
            resize() {
                var is_on = false
                eles.resize.addEventListener("mousedown", () => {
                    is_on = true
                    document.body.style.userSelect = "none"
                })
                document.addEventListener("mouseup", () => {
                    if (is_on) is_on = false
                    document.body.style.userSelect = "initial"
                })
                document.addEventListener("mousemove", (e) => {
                    if (!is_on) return
                    const { clientX, clientY } = e
                    const { offsetTop, offsetLeft } = ele
                    const result = {
                        width: clientX - offsetLeft,
                        height: clientY - offsetTop,
                    }
                    ele.style.setProperty("--width", `${result.width}px`)
                    ele.style.setProperty("--height", `${result.height}px`)
                })
            }
        }
        init.control()
        init.move()
        init.resize()
        return {
            ele,
            uid
        }
    }
}
/**
 * mAjax made from XHR
 * option:{
 *  url,
 *  method,
 *  data,
 *  success,
 *  error
 * }
 */
class mAjax {
    constructor(option) {
        this.url = option.url
        this.method = option.method || "GET"
        this.data = option.data || {}
        this.success = option.success || function () { }
        this.error = option.error || function () { }
        this.send()
        this.sended = false
        this.abort
    }
    send() {
        if (this.sended) {
            console.error("AJAX has been sended.")
            return
        }
        const xhr = new XMLHttpRequest()
        this.abort = () => xhr.abort()
        if (this.method == "GET") {
            var data = []
            var times = 0
            var uri = this.url
            if (Object.keys(this.data) != 0) {
                uri = this.url + "?"
                for (const key in this.data) {
                    data.push([
                        (() => {
                            if (times != 0)
                                return "&"
                            else return ""
                        })(),
                        key,
                        this.data[key]
                    ])
                    times++
                }
                for (const i of data) {
                    uri += i[0] + encodeURIComponent(i[1]) + "=" + encodeURIComponent(i[2])
                }
            }
            xhr.open(this.method, uri)
            xhr.send()
            this.sended = true
        } else {
            this.sended = true
            xhr.open(this.method, this.url)
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
            var data = []
            for (const key in this.data) {
                data.push([
                    key,
                    this.data[key],
                ])
            }
            var res = ""
            for (const key in data) {
                res += `${key != 0 ? "&" : ""}${encodeURIComponent(data[key][0])}=${encodeURIComponent(data[key][1])}`
            }
            xhr.send(res)
        }
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== 4) return
            var returnData = (() => {
                const data = xhr.responseText
                if (this.isJSON(data)) {
                    return JSON.parse(data)
                } else {
                    return data
                }
            })()
            const state = {
                readyState: xhr.readyState,
                status: xhr.status
            }
            if (xhr.status >= 200)
                this.success(state, returnData)
            else
                this.error(state, returnData)
        }
    }
    isJSON(text) {
        try {
            JSON.parse(text)
            return true
        } catch {
            return false
        }
    }
}
/**
 * mCookie:
 * methods:{
 *  set,
 *  get,
 *  delete
 * }
 */
const mCookie = {
    set(option) {
        const key = option.key
        const value = option.value || ""
        const path = option.path || "/"
        const secure = option.secure || false
        const sameSite = option.sameSite || "Lax" // Lax | Strict | None
        const expires = new Date(Date.now() + (option.expires || 86400) * 1000).toUTCString()
        document.cookie = `${key}=${value}; path=${path}; expires=${expires}; ${sameSite === "None" ? "Secure;" : secure ? "Secure;" : ""
            } SameSite=${sameSite}`
    },
    all() {
        const allCookie = document.cookie.split("; ")
        const all = {}
        allCookie.forEach(self => {
            const [cookieKey, ...cookieValue] = self.split("=")
            all[cookieKey] = cookieValue.join("=")
        })
        return all
    },
    get(key) {
        return this.all()[key] || false
    },
    delete(key, path) {
        document.cookie = `${key}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 UTC`
    }
}
/**
 * virtual DOM maker
 * the DOM like: {
 *      main:{
 *          _options_:{
 *              attrs:{name:value, name:value},
 *              text:“like the innerText”,
 *              events:{name:func, name:func}
 *          }
 *      }
 * }
 */
class mDOM {
    constructor(virtualDom, where) {
        this.dom = virtualDom
        this.where = document.querySelector(where)
        this.structure(this.dom, this.where)
    }
    structure(virtualDom, where) {
        for (const tag in virtualDom) {
            const ele = document.createElement(tag)
            if (tag == "_options_") continue
            if (virtualDom[tag]._options_) {
                //attribute each.
                if (virtualDom[tag]._options_.attrs)
                    for (const name in virtualDom[tag]._options_.attrs) {
                        ele.setAttribute(name, virtualDom[tag]._options_.attrs[name])
                    }
                //text
                if (virtualDom[tag]._options_.text)
                    ele.innerText = virtualDom[tag]._options_.text
                //event init
                if (virtualDom[tag]._options_.events)
                    for (const name in virtualDom[tag]._options_.events) {
                        ele.addEventListener(name, virtualDom[tag]._options_.events[name])
                    }
            }
            this.structure(virtualDom[tag], ele)
            where.append(ele)
        }
    }
}
