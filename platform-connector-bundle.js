(()=>{
    "use strict";
    function e(e, t, r, o) {
        return new (r = r || Promise)((function(n, i) {
            function s(e) {
                try {
                    c(o.next(e))
                } catch (e) {
                    i(e)
                }
            }
            function d(e) {
                try {
                    c(o.throw(e))
                } catch (e) {
                    i(e)
                }
            }
            function c(e) {
                e.done ? n(e.value) : new r((function(t) {
                    t(e.value)
                }
                )).then(s, d)
            }
            c((o = o.apply(e, t || [])).next())
        }
        ))
    }
    var t, r, o, n, i, s;
    (s = t = t || {}).Call = "call",
    s.Reply = "reply",
    s.Syn = "syn",
    s.SynAck = "synAck",
    s.Ack = "ack",
    function(e) {
        e.Fulfilled = "fulfilled",
        e.Rejected = "rejected"
    }(r = r || {}),
    function(e) {
        e.ConnectionDestroyed = "ConnectionDestroyed",
        e.ConnectionTimeout = "ConnectionTimeout",
        e.NotInIframe = "NotInIframe",
        e.NoIframeSrc = "NoIframeSrc"
    }(o = o || {}),
    (n = n || {}).DataCloneError = "DataCloneError",
    (i = i || {}).Message = "message";
    const d = ({name: e, message: t, stack: r})=>({
        name: e,
        message: t,
        stack: r
    });
    let c = 0;
    var a = (e,s,a,l)=>{
        const {destroy: u, onDestroy: m} = a;
        return a=>{
            var p, v;
            if (e instanceof RegExp ? e.test(a.origin) : "*" === e || e === a.origin)
                return l("Child: Handshake - Received SYN-ACK, responding with ACK"),
                p = "null" === a.origin ? "*" : a.origin,
                v = {
                    penpal: t.Ack,
                    methodNames: Object.keys(s)
                },
                window.parent.postMessage(v, p),
                p = ((e,o,s)=>{
                    const {localName: c, local: a, remote: l, originForSending: u, originForReceiving: m} = e;
                    let p = !1;
                    const v = e=>{
                        if (e.source === l && e.data.penpal === t.Call)
                            if (e.origin !== m)
                                s(`${c} received message from origin ${e.origin} which did not match expected origin ` + m);
                            else {
                                const {methodName: i, args: a, id: m} = e.data;
                                s(`${c}: Received ${i}() call`),
                                e = e=>o=>{
                                    if (s(`${c}: Sending ${i}() reply`),
                                    p)
                                        s(`${c}: Unable to send ${i}() reply due to destroyed connection`);
                                    else {
                                        const i = {
                                            penpal: t.Reply,
                                            id: m,
                                            resolution: e,
                                            returnValue: o
                                        };
                                        e === r.Rejected && o instanceof Error && (i.returnValue = d(o),
                                        i.returnValueIsError = !0);
                                        try {
                                            l.postMessage(i, u)
                                        } catch (e) {
                                            throw e.name === n.DataCloneError && (o = {
                                                penpal: t.Reply,
                                                id: m,
                                                resolution: r.Rejected,
                                                returnValue: d(e),
                                                returnValueIsError: !0
                                            },
                                            l.postMessage(o, u)),
                                            e
                                        }
                                    }
                                }
                                ,
                                new Promise((e=>e(o[i].apply(o, a)))).then(e(r.Fulfilled), e(r.Rejected))
                            }
                    }
                    ;
                    return a.addEventListener(i.Message, v),
                    ()=>{
                        p = !0,
                        a.removeEventListener(i.Message, v)
                    }
                }
                )(v = {
                    localName: "Child",
                    local: window,
                    remote: window.parent,
                    originForSending: p,
                    originForReceiving: a.origin
                }, s, l),
                m(p),
                v = ((e,n,s,d,a)=>{
                    const {localName: l, local: u, remote: m, originForSending: p, originForReceiving: v} = n;
                    let f = !1;
                    return a(l + ": Connecting call sender"),
                    s.reduce(((e,n)=>{
                        var s;
                        return e[n] = (s = n,
                        (...e)=>{
                            let n;
                            a(l + `: Sending ${s}() call`);
                            try {
                                m.closed && (n = !0)
                            } catch (e) {
                                n = !0
                            }
                            if (n && d(),
                            f) {
                                const e = new Error(`Unable to send ${s}() call due to destroyed connection`);
                                throw e.code = o.ConnectionDestroyed,
                                e
                            }
                            return new Promise(((o,n)=>{
                                const d = ++c
                                  , f = e=>{
                                    if (e.source === m && e.data.penpal === t.Reply && e.data.id === d)
                                        if (e.origin !== v)
                                            a(`${l} received message from origin ${e.origin} which did not match expected origin ` + v);
                                        else {
                                            e = e.data,
                                            a(l + `: Received ${s}() reply`),
                                            u.removeEventListener(i.Message, f);
                                            let t = e.returnValue;
                                            e.returnValueIsError && (t = (e=>{
                                                const t = new Error;
                                                return Object.keys(e).forEach((r=>t[r] = e[r])),
                                                t
                                            }
                                            )(t)),
                                            (e.resolution === r.Fulfilled ? o : n)(t)
                                        }
                                }
                                ;
                                u.addEventListener(i.Message, f);
                                var h = {
                                    penpal: t.Call,
                                    id: d,
                                    methodName: s,
                                    args: e
                                };
                                m.postMessage(h, p)
                            }
                            ))
                        }
                        ),
                        e
                    }
                    ), e),
                    ()=>{
                        f = !0
                    }
                }
                )(p = {}, v, a.data.methodNames, u, l),
                m(v),
                p;
            l(`Child: Handshake - Received SYN-ACK from origin ${a.origin} which did not match expected origin ` + e)
        }
    }
    ;
    window.platformConnection = (()=>{
        let r = ()=>{
            throw new Error("onSplashScreenCompleted must be set.")
        }
        ;
        var n = (n = document.referrer && new URL(document.referrer)) ? n.protocol + "//" + n.host : /i-ready.com(:\d+)?$/;
        const s = ((e={})=>{
            const {parentOrigin: r="*", methods: n={}, timeout: s, debug: d=!1} = e
              , c = (e=>(...t)=>{
                e && console.log("[Penpal]", ...t)
            }
            )(d);
            e = (()=>{
                const e = [];
                let t = !1;
                return {
                    destroy(r) {
                        t = !0,
                        e.forEach((e=>{
                            e(r)
                        }
                        ))
                    },
                    onDestroy(r) {
                        t ? r() : e.push(r)
                    }
                }
            }
            )();
            const {destroy: l, onDestroy: u} = e
              , m = ((()=>{
                if (window === window.top) {
                    const e = new Error("connectToParent() must be called within an iframe");
                    throw e.code = o.NotInIframe,
                    e
                }
            }
            )(),
            a(r, n, e, c));
            return {
                promise: new Promise(((e,n)=>{
                    const d = ((e,t)=>{
                        let r;
                        return void 0 !== e && (r = window.setTimeout((()=>{
                            const r = new Error(`Connection timed out after ${e}ms`);
                            r.code = o.ConnectionTimeout,
                            t(r)
                        }
                        ), e)),
                        ()=>{
                            clearTimeout(r)
                        }
                    }
                    )(s, l)
                      , a = r=>{
                        (()=>{
                            try {
                                clearTimeout()
                            } catch (e) {
                                return !1
                            }
                            return !0
                        }
                        )() && r.source === parent && r.data && r.data.penpal === t.SynAck && (r = m(r)) && (window.removeEventListener(i.Message, a),
                        d(),
                        e(r))
                    }
                    ;
                    var p, v;
                    window.addEventListener(i.Message, a),
                    c("Child: Handshake - Sending SYN"),
                    p = {
                        penpal: t.Syn
                    },
                    v = r instanceof RegExp ? "*" : r,
                    window.parent.postMessage(p, v),
                    u((e=>{
                        window.removeEventListener(i.Message, a),
                        e || ((e = new Error("Connection destroyed")).code = o.ConnectionDestroyed),
                        n(e)
                    }
                    ))
                }
                )),
                destroy() {
                    l()
                }
            }
        }
        )({
            parentOrigin: n,
            methods: {
                loaderCompleted() {
                    return e(this, void 0, void 0, (function*() {
                        r()
                    }
                    ))
                }
            }
        });
        return s.promise.catch((()=>console.error("disconnected from platform before making connection"))),
        {
            preferences: {
                fetch() {
                    return e(this, void 0, void 0, (function*() {
                        return (yield s.promise).preferencesFetch()
                    }
                    ))
                },
                update(t) {
                    return e(this, void 0, void 0, (function*() {
                        return (yield s.promise).preferencesUpdate(t)
                    }
                    ))
                }
            },
            settings: {
                fetch() {
                    return e(this, void 0, void 0, (function*() {
                        return (yield s.promise).settingsFetch()
                    }
                    ))
                }
            },
            stateStore: {
                save(t) {
                    return e(this, void 0, void 0, (function*() {
                        return (yield s.promise).stateStoreSave(t)
                    }
                    ))
                },
                fetch() {
                    return e(this, void 0, void 0, (function*() {
                        return (yield s.promise).stateStoreFetch()
                    }
                    ))
                },
                delete() {
                    return e(this, void 0, void 0, (function*() {
                        return (yield s.promise).stateStoreDelete()
                    }
                    ))
                },
                mark(t, r) {
                    return e(this, void 0, void 0, (function*() {
                        localStorage.setItem(t, JSON.stringify(r))
                    }
                    ))
                },
                jump(e) {
                    (e = localStorage.getItem(e)) && this.save(JSON.parse(e)).then((()=>window.location.reload()))
                }
            },
            loader: {
                setProgress(t) {
                    return e(this, void 0, void 0, (function*() {
                        return (yield s.promise).loaderSetProgress(t)
                    }
                    ))
                },
                setCredits(t) {
                    return e(this, void 0, void 0, (function*() {
                        return (yield s.promise).loaderSetCredits(t)
                    }
                    ))
                },
                onCompleted(e) {
                    r = e
                }
            },
            student: {
                fetch() {
                    return e(this, void 0, void 0, (function*() {
                        return (yield s.promise).studentFetch()
                    }
                    ))
                }
            },
            activity: {
                fetch() {
                    return e(this, void 0, void 0, (function*() {
                        return (yield s.promise).activityFetch()
                    }
                    ))
                }
            },
            component: {
                start() {
                    return e(this, void 0, void 0, (function*() {
                        return (yield s.promise).componentStart()
                    }
                    ))
                },
                pause() {
                    return e(this, void 0, void 0, (function*() {
                        return (yield s.promise).componentPause()
                    }
                    ))
                },
                resume() {
                    return e(this, void 0, void 0, (function*() {
                        return (yield s.promise).componentResume()
                    }
                    ))
                },
                close() {
                    return e(this, void 0, void 0, (function*() {
                        return (yield s.promise).componentClose()
                    }
                    ))
                },
                complete(t) {
                    return e(this, void 0, void 0, (function*() {
                        return (yield s.promise).componentComplete(t)
                    }
                    ))
                }
            },
            learnosity: {
                start() {
                    return e(this, void 0, void 0, (function*() {
                        return (yield s.promise).learnosityStart()
                    }
                    ))
                },
                complete() {
                    return e(this, void 0, void 0, (function*() {
                        return (yield s.promise).learnosityComplete()
                    }
                    ))
                },
                close() {
                    return e(this, void 0, void 0, (function*() {
                        return (yield s.promise).learnosityClose()
                    }
                    ))
                }
            },
            fluency: {
                makeHttpRequest(t) {
                    return e(this, void 0, void 0, (function*() {
                        return (yield s.promise).fluencyMakeHttpRequest(t)
                    }
                    ))
                },
                complete() {
                    return e(this, void 0, void 0, (function*() {
                        return (yield s.promise).fluencyComplete()
                    }
                    ))
                },
                close() {
                    return e(this, void 0, void 0, (function*() {
                        return (yield s.promise).fluencyClose()
                    }
                    ))
                }
            },
            dataCapture: {
                config() {
                    return e(this, void 0, void 0, (function*() {
                        return (yield s.promise).dataCaptureConfig()
                    }
                    ))
                }
            },
            learningGames: {
                close() {
                    return e(this, void 0, void 0, (function*() {
                        return (yield s.promise).learningGamesClose()
                    }
                    ))
                }
            },
            remoteLogger: {
                error(t) {
                    return e(this, void 0, void 0, (function*() {
                        return (yield s.promise).remoteLoggerError(t)
                    }
                    ))
                },
                fatal(t) {
                    return e(this, void 0, void 0, (function*() {
                        return (yield s.promise).remoteLoggerFatal(t)
                    }
                    ))
                }
            },
            ready() {
                return e(this, void 0, void 0, (function*() {
                    yield s.promise
                }
                ))
            },
            close() {
                try {
                    s.destroy()
                } catch (e) {}
            }
        }
    }
    )()
}
)();
