+(function () {
            function drawPath() {

                // 缓存元素参考和测量
                linkItems = linkItems.map(function (item) {
                    var anchor = item;
                    var target = document.getElementById(
                        anchor.getAttribute("href").slice(1)
                    );

                    return {
                        listItem: item,
                        anchor: item,
                        target: target,
                        yStart: target.offsetTop
                    };
                });

                // 删除丢失的目标
                linkItems = linkItems.filter(function (item) {
                    return !!item.target;
                });

                var path = [];
                var pathIndent;

                linkItems.forEach(function (item, i) {
                    var x = item.anchor.offsetLeft,
                        y = item.anchor.offsetTop,
                        height = item.anchor.offsetHeight;

                    x = parseInt(window.getComputedStyle(item.anchor).paddingLeft) - 4;
                    if (i !== linkItems.length - 1) {
                        item.yEnd = linkItems[i + 1].yStart;
                    } else {
                        item.yEnd = document.documentElement.offsetHeight;
                    }
                    if (i === 0) {
                        path.push("M", x, y, "L", x, y + height);
                        item.pathStart = 0;
                    } else {
                        // 当有一个变化时，再画一条线
                        // 缩进级别
                        if (pathIndent !== x) path.push("L", pathIndent, y);

                        path.push("L", x, y);

                        // 设置当前路径，以便我们可以测量它
                        pathDom.setAttribute("d", path.join(" "));
                        item.pathStart = pathDom.getTotalLength() || 0;

                        path.push("L", x, y + height);
                    }

                    pathIndent = x;

                    pathDom.setAttribute("d", path.join(" "));
                    item.pathEnd = pathDom.getTotalLength();
                });

                pathLength = pathDom.getTotalLength();

                console.dir(linkItems);

                sync();
            }

            function isDiff(x1, y1, x2, y2) {
                var d1 = Math.abs(x1 - y1);
                var d2 = Math.abs(x2 - y2);

                var arr = [x1, y1, x2, y2].sort((x, y) => x - y);
                return Math.abs(arr[0] - arr[3]) < d1 + d2;
            }

            function sync() {
            
                var windowHeight = window.innerHeight;

                var pathStart = pathLength,
                    pathEnd = 0;

                var visibleItems = 0;
                console.log(linkItems)
                linkItems.forEach(function (item) {
                    // var targetBounds = item.target.getBoundingClientRect();
                    // console.log( targetBounds.bottom,  windowHeight * TOP_MARGIN, targetBounds.top,windowHeight * (1 - BOTTOM_MARGIN))
                    // if (targetBounds.bottom > windowHeight * TOP_MARGIN && targetBounds.top < windowHeight * (1 - BOTTOM_MARGIN)) {
                    //     pathStart = Math.min(item.pathStart, pathStart);
                    //     pathEnd = Math.max(item.pathEnd, pathEnd);

                    //     visibleItems += 1;

                    //     item.listItem.classList.add('visible');
                    // }
                    // window.pageYOffset ： 在edge中使用
                    // document.documentElement.scrollTop: 在chrome中使用

                    var _start =
                        window.pageYOffset || document.documentElement.scrollTop;
                    var _end = _start + window.innerHeight;

                    console.log(_start, _end);

                    if (isDiff(_start, _end, item.yStart, item.yEnd)) {
                        pathStart = Math.min(item.pathStart, pathStart);
                        pathEnd = Math.max(item.pathEnd, pathEnd);
                        console.log("isDiff",pathStart,pathEnd)

                        visibleItems += 1;

                        item.listItem.classList.add("visible");
                    } else {
                        item.listItem.classList.remove("visible");
                    }
                });

                // S指定可见路径或完全隐藏路径

                // 如果没有可见的项目
                if (visibleItems > 0 && pathStart < pathEnd) {
                    pathDom.setAttribute("stroke-dashoffset", "1");
                    pathDom.setAttribute(
                        "stroke-dasharray",
                        "1, " +
                        pathStart +
                        ", " +
                        (pathEnd - pathStart) +
                        ", " +
                        pathLength
                    );
                    pathDom.setAttribute("opacity", 1);
                } else {
                    pathDom.setAttribute("opacity", 0);
                }
            }

            function _throttle(f, t = 100) {
                var temp = 0;
                return function () {
                    var now = Date.now();
                    if (now - temp >= t) {
                        f.apply(this, arguments);
                        temp = now;
                    } else {
                        console.log(Date.now());
                    }
                };
            }

            var svg = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg"
            );
            var pathDom = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
            );
            svg.appendChild(pathDom);

            var linkItems = []
            var pathLength;
            function Catalogue(settings = {}) {
                var defult = {
                    selector: "article",
                    catalogueClass: "catalogue",
                    isPadding: true,
                    width_rem: 20
                };

                Object.assign(settings, defult);
                var { selector, isPadding, catalogueClass, width_rem } = settings;
                var aside = document.createElement("div");
                var asideDom = document.createElement("div");
                aside.append(asideDom);
                var articleDom = document.querySelector(selector);

                aside.className = catalogueClass;
                aside.style.width = width_rem + "rem";
                aside.style.top = articleDom.offsetTop + "px";

                articleDom.style.marginLeft = width_rem + "rem";
                var parent = articleDom.parentNode;

                parent.insertBefore(aside, articleDom);
                var hList = articleDom.querySelectorAll("h1,h2,h3,h4,h5,h6");
                var item = null;
                var aTarget = null;
                var level = -1;
                var alink = null;
                var i = 0;

                for (; i < hList.length; i++) {
                    item = hList[i];
                    aTarget = document.createElement("a");
                    
                    level = item.nodeName.substr(1, 1);
                    alink = document.createElement("a");
                    linkItems.push(alink)
                    aTarget.href = "#" + item.innerHTML.substr(0, 17);
                    aTarget.innerHTML = "";

                    aTarget.id = item.innerHTML;
                    item.parentNode.insertBefore(aTarget, item);

                    alink.innerHTML = item.innerHTML;
                    alink.href = "#" + item.innerHTML;
                    alink.className = " outline-h" + level;
                    alink.classList.add("catalogue_link");
                    if (isPadding) {
                        alink.classList.add("pl" + (level - 1));
                    }
                    alink.level = level;
                    asideDom.appendChild(alink);
                }


                pathDom.setAttribute("stroke", "#444");
                pathDom.setAttribute("stroke-width", "3");
                pathDom.setAttribute("fill", "transparent");
                pathDom.setAttribute("stroke-linecap", "round");
                pathDom.setAttribute("stroke-linejoin", "round");
                pathDom.setAttribute("transform", "translate(-0.5, -0.5)");



                svg.classList.add("toc-marker");
                svg.setAttribute("width", 200);
                svg.setAttribute("height", 200);

                asideDom.appendChild(svg);


            }

            window.Catalogue = Catalogue;

            window.addEventListener("load", function () {
                new Catalogue();
                window.addEventListener("resize", drawPath, false);
                window.addEventListener("scroll", _throttle(sync), false);

                drawPath();
            });
        })();
