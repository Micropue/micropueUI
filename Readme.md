# Welcome to micropue UI

`micropue UI` is a dynamic web UI and utility library developed by MICROPUE. It uses javascript and css, and the package size is less than **150KB**, which is very lightweight.The micropue UI provides a wealth of component and tool functions and classes.
**Please read the document.html document carefully before using it.**

micropueUI is constantly updated!

Enjoy it.
<pre>npm install micropue-ui@lastest</pre>
<pre>&lt;script&nbsp;src="https://unpkg.com/micropue-ui@1.0.6/src/micropueUI.js"&gt;&lt;/script&gt;</pre>
<pre>&lt;link&nbsp;rel="stylesheet"&nbsp;href="https://unpkg.com/micropue-ui@1.0.6/src/micropueUI.css"/&gt;</pre>
<h1 class="h1">A&nbsp;preliminary&nbsp;understanding&nbsp;of&nbsp;micropue&nbsp;UI</h1><br>micropue&nbsp;UI&nbsp;is&nbsp;a&nbsp;dynamic&nbsp;web&nbsp;UI&nbsp;component&nbsp;and&nbsp;tool&nbsp;function&nbsp;library&nbsp;developed&nbsp;by&nbsp;MICROPUE,&nbsp;with&nbsp;rich&nbsp;UI&nbsp;animation&nbsp;and&nbsp;design.&nbsp;And&nbsp;the&nbsp;adaptation&nbsp;on&nbsp;each&nbsp;device&nbsp;is&nbsp;very&nbsp;good.<br><m-hr></m-hr><h2 class="h2">Light&nbsp;weight</h2><br>The&nbsp;javascript&nbsp;and&nbsp;css&nbsp;files&nbsp;total&nbsp;less&nbsp;than&nbsp;<strong>150KB</strong>.<br><br><h2 class="h2">Integration</h2><br>All&nbsp;functions&nbsp;are&nbsp;integrated&nbsp;and&nbsp;integrated&nbsp;to&nbsp;achieve&nbsp;dynamic&nbsp;modification&nbsp;without&nbsp;polluting&nbsp;the&nbsp;whole&nbsp;world.&nbsp;Including&nbsp;support&nbsp;for&nbsp;semantic&nbsp;GmicrantType&nbsp;syntax&nbsp;adds&nbsp;unlimited&nbsp;motivation&nbsp;for&nbsp;development.<br><m-hr></m-hr><br><h2 class="h2">Simple&nbsp;page&nbsp;implementation</h2><br>Easily&nbsp;implement&nbsp;single-page&nbsp;applications&nbsp;using&nbsp;the&nbsp;combination&nbsp;of&nbsp;the&nbsp;default&nbsp;framework&nbsp;and&nbsp;PageLoader.<br>HTML:<br><div class="code"><pre><code data-highlighted="yes" class="hljs language-php-template"><span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span>&nbsp;<span class="hljs-attr">id</span>=<span class="hljs-string">"left-tab"</span>&nbsp;<span class="hljs-attr">class</span>=<span class="hljs-string">"unvisible"</span>&gt;</span>
&nbsp;&nbsp;<span class="hljs-tag">&lt;<span class="hljs-name">div</span>&nbsp;<span class="hljs-attr">class</span>=<span class="hljs-string">"head"</span>&gt;</span>
&nbsp;&nbsp;&nbsp;&nbsp;<span class="hljs-tag">&lt;<span class="hljs-name">p</span>&nbsp;<span class="hljs-attr">class</span>=<span class="hljs-string">"title"</span>&gt;</span>LEFT&nbsp;TAB&nbsp;TITLE<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>
&nbsp;&nbsp;<span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
&nbsp;&nbsp;<span class="hljs-tag">&lt;<span class="hljs-name">div</span>&nbsp;<span class="hljs-attr">class</span>=<span class="hljs-string">"container"</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
<span class="hljs-tag">&lt;<span class="hljs-name">div</span>&nbsp;<span class="hljs-attr">id</span>=<span class="hljs-string">"main"</span>&gt;</span>
&nbsp;&nbsp;<span class="hljs-tag">&lt;<span class="hljs-name">div</span>&nbsp;<span class="hljs-attr">class</span>=<span class="hljs-string">"head"</span>&gt;</span>
&nbsp;&nbsp;&nbsp;&nbsp;<span class="hljs-tag">&lt;<span class="hljs-name">div</span>&nbsp;<span class="hljs-attr">class</span>=<span class="hljs-string">"controls"</span>&gt;</span>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="hljs-tag">&lt;<span class="hljs-name">div</span>&nbsp;<span class="hljs-attr">id</span>=<span class="hljs-string">"button-openlist"</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="hljs-tag">&lt;<span class="hljs-name">div</span>&nbsp;<span class="hljs-attr">id</span>=<span class="hljs-string">"button-back"</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span><span class="hljs-comment">&lt;!--&nbsp;selectable--&gt;</span>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="hljs-tag">&lt;<span class="hljs-name">div</span>&nbsp;<span class="hljs-attr">id</span>=<span class="hljs-string">"button-next"</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span><span class="hljs-comment">&lt;!--&nbsp;selectable&nbsp;--&gt;</span>
&nbsp;&nbsp;&nbsp;&nbsp;<span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
&nbsp;&nbsp;&nbsp;&nbsp;<span class="hljs-tag">&lt;<span class="hljs-name">p</span>&nbsp;<span class="hljs-attr">class</span>=<span class="hljs-string">"title"</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>
&nbsp;&nbsp;<span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
&nbsp;&nbsp;<span class="hljs-tag">&lt;<span class="hljs-name">div</span>&nbsp;<span class="hljs-attr">class</span>=<span class="hljs-string">"container"</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
<span class="hljs-tag">&lt;<span class="hljs-name">div</span>&nbsp;<span class="hljs-attr">id</span>=<span class="hljs-string">"right-tab"</span>&nbsp;<span class="hljs-attr">class</span>=<span class="hljs-string">"unvisible"</span>&gt;</span>
&nbsp;&nbsp;<span class="hljs-tag">&lt;<span class="hljs-name">div</span>&nbsp;<span class="hljs-attr">class</span>=<span class="hljs-string">"head"</span>&gt;</span>
&nbsp;&nbsp;&nbsp;&nbsp;<span class="hljs-tag">&lt;<span class="hljs-name">p</span>&nbsp;<span class="hljs-attr">class</span>=<span class="hljs-string">"title"</span>&gt;</span>RIGHT&nbsp;TAB&nbsp;TITlE<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>
&nbsp;&nbsp;<span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
&nbsp;&nbsp;<span class="hljs-tag">&lt;<span class="hljs-name">div</span>&nbsp;<span class="hljs-attr">class</span>=<span class="hljs-string">"container"</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span></code></pre></div><br>JAVASCRIPT:<br><br><div class="code"><pre><code data-highlighted="yes" class="hljs language-javascript"><span class="hljs-keyword">const</span>&nbsp;page&nbsp;=&nbsp;<span class="hljs-keyword">new</span>&nbsp;<span class="hljs-title class_">PageLoader</span>(<span class="hljs-string">"#main&nbsp;.container"</span>,&nbsp;<span class="hljs-string">"#main&nbsp;.head&nbsp;.title"</span>,&nbsp;<span class="hljs-string">"DEFAULT&nbsp;TITLE"</span>,&nbsp;<span class="hljs-string">"#button-back"</span>,&nbsp;<span class="hljs-string">"#button-next"</span>)
<span class="hljs-comment">//The&nbsp;#button-back&nbsp;or&nbsp;#button-next&nbsp;is&nbsp;selectable.</span>
<span class="hljs-keyword">const</span>&nbsp;routes&nbsp;=&nbsp;[
&nbsp;&nbsp;[<span class="hljs-string">"/path"</span>,<span class="hljs-keyword">function</span>]
]

<span class="hljs-keyword">new</span>&nbsp;<span class="hljs-title class_">RouteLoader</span>(routes)
<span class="hljs-comment">//start&nbsp;define&nbsp;your&nbsp;route&nbsp;table.</span>
</code></pre></div>
