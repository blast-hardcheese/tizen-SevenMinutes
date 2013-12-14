/// <reference path="/Users/blast/Projects/typescript/DefinitelyTyped/jquerymobile/jquerymobile.d.ts" />
/// <reference path="/Users/blast/Projects/typescript/DefinitelyTyped/jquery/jquery.d.ts" />
/// <reference path="tizen.webidl.d.ts" />
/// <reference path="tizen.event.webidl.d.ts" />
/// <reference path="tizen.application.webidl.d.ts" />
/// <reference path="tizen.package.webidl.d.ts" />
var backEventListener = null;

var State;
(function (State) {
    State[State["INIT"] = 0] = "INIT";
    State[State["EXERCISE"] = 1] = "EXERCISE";
    State[State["FINISHED"] = 2] = "FINISHED";
})(State || (State = {}));

//Initialize function
var app = {
    refs: {
        startButton: ".container .content .start"
    },
    data: {
        state: undefined,
        timer: undefined,
        secondsRemaining: 30,
        seq: ["init", "Jumping Jacks", "Wall-Sit", "Push-Up", "Ab-Crunch", "Chair-Step", "Squats", "Tricep Dips", "Plank", "Running", "Lunge", "Push-Up to Rotation", "Side Plank"]
    },
    init: function () {
        // register once
        if (backEventListener !== null) {
            return;
        }

        var backEvent = function (e) {
            if (e.keyName == "back") {
                try  {
                    if ($.mobile.urlHistory.activeIndex <= 0) {
                        // if first page, terminate app
                        app.unregister();
                    } else {
                        // move previous page
                        $.mobile.urlHistory.activeIndex -= 1;
                        $.mobile.urlHistory.clearForward();
                        window.history.back();
                    }
                } catch (ex) {
                    app.unregister();
                }
            }
        };

        // add eventListener for tizenhwkey (Back Button)
        document.addEventListener('tizenhwkey', backEvent);
        backEventListener = backEvent;

        // Initialization
        $(app.refs.startButton).click(function () {
            console.log("Start pressed!");
            app.start();
        });

        app.become(0 /* INIT */);
    },
    start: function () {
        app.data.state = 0;
        app.become(1 /* EXERCISE */);
        app.initializeNext();
    },
    initializeNext: function () {
        app.data.state += 1;
        var curkey = app.data.seq[app.data.state];
        if (curkey != undefined) {
            console.log("Switching to:", curkey);
            app.countdown(5, function () {
                console.log("countdown reached");
                app.initializeNext();
            });
        } else {
            app.countdown(5, function () {
                console.log("End reached");
            });
        }
    },
    become: function (state) {
        switch (state) {
            case 0 /* INIT */:
                console.log("become INIT");
                $(".container .content .inner.before").show();
                break;
            case 1 /* EXERCISE */:
                console.log("become EXERCISE");
                break;
            case 2 /* FINISHED */:
                console.log("become FINISHED");
                break;
        }
    },
    countdown: function (duration, callback) {
        if (app.data.timer != undefined) {
            console.log("TIMEOUT CONFLICT");
            clearTimeout(app.data.timer);
        }
        app.data.timer = setTimeout(function () {
            app.data.timer = undefined;
            callback();
        }, duration * 1000);
    },
    unregister: function () {
        if (backEventListener !== null) {
            document.removeEventListener('tizenhwkey', backEventListener);
            backEventListener = null;
            window.tizen.application.getCurrentApplication().exit();
        }
    }
};

$(document).bind('pageinit', app.init);
$(document).unload(app.unregister);
