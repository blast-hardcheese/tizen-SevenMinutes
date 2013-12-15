/// <reference path="deps/jquerymobile/jquerymobile.d.ts" />
/// <reference path="deps/jquery/jquery.d.ts" />
/// <reference path="deps/tizen.webidl.d.ts" />
/// <reference path="deps/tizen.event.webidl.d.ts" />
/// <reference path="deps/tizen.application.webidl.d.ts" />
/// <reference path="deps/tizen.package.webidl.d.ts" />

var backEventListener = null;

enum State {
    INIT,
    COUNTDOWN,
    EXERCISE,
    FINISHED,
}

//Initialize function
var app = {
    refs: {
        startButton: ".container .content .start",
        countdownLabel: ".container .content .countdown .text",
        countdownDescription: ".container .content .countdown .next",
        exerciseLabel: ".container .content .exercise .label",
        exerciseText: ".container .content .exercise .text",
        exerciseImage: ".container .content .exercise .image",
    },

    data: {
        state: undefined,

        timer: undefined,
        next: undefined,
        secondsRemaining: 30,

        seq: ["init", "Jumping Jacks", "Wall-Sit", "Push-Up", "Ab-Crunch", "Chair-Step", "Squats", "Tricep Dips", "Plank", "Running", "Lunge", "Push-Up to Rotation", "Side Plank"],
    },

    init: function () {
        // register once
        if ( backEventListener !== null ) {
            return;
        }
        
        var backEvent = function(e) {
            if ( e.keyName == "back" ) {
                try {
                    if ( $.mobile.urlHistory.activeIndex <= 0 ) {
                        // if first page, terminate app
                        app.unregister();
                    } else {
                        // move previous page
                        $.mobile.urlHistory.activeIndex -= 1;
                        $.mobile.urlHistory.clearForward();
                        window.history.back();
                    }
                } catch( ex ) {
                    app.unregister();
                }
            }
        }
        
        // add eventListener for tizenhwkey (Back Button)
        document.addEventListener( 'tizenhwkey', backEvent );
        backEventListener = backEvent;

        // Initialization
        $(app.refs.startButton).click(function() {
            event.preventDefault();

            app.data.state = 1;
            app.become(State.COUNTDOWN);
            return false;
        });

        $(".container").click(function() {
            if(app.data.next != undefined) {
                clearTimeout(app.data.timer);
                var next = app.data.next;
                app.data.next = undefined;
                next();
            }
        });
        app.become(State.INIT);
    },

    become: function(state: State) {
        $(".container .content .inner").hide();
        var label = app.data.seq[app.data.state];
        switch(state) {
            case State.INIT:
                console.log("become INIT");
                $(".container .content .inner.before").show();
                break;
            case State.COUNTDOWN:
                $(".container .content .inner.countdown").show();
                console.log("become COUNTDOWN");
                app.countdownEach(5, function(left: Number) {
                    $(app.refs.countdownLabel).text("In " + left + "...");
                }, function() {
                    app.become(State.EXERCISE);
                });
                $(app.refs.countdownDescription).text("Prepare to start: " + label);
                break;
            case State.EXERCISE:
                console.log("become EXERCISE");
                $(app.refs.exerciseImage).css("background-image", "url(images/" + label.replace(" ", "_") + ".png)");

                app.countdownEach(30, function(left: number) {
                    $(app.refs.exerciseImage).css("background-position-x", (left % 2)?"-15em":"0");
                    $(app.refs.exerciseLabel).text(label);
                    $(app.refs.exerciseText).text("" + left + " second" + ((left > 1) ? "s":"") + " left");
                    console.log("image:", $(app.refs.exerciseImage));
                }, function() {
                    app.data.state += 1;
                    if(app.data.state < app.data.seq.length) {
                        app.become(State.COUNTDOWN);
                    } else {
                        app.become(State.FINISHED);
                    }
                });
                $(".container .content .inner.exercise").show();
                break;
            case State.FINISHED:
                console.log("become FINISHED");
                $(".container .content .inner.finished").show();
                break;
        }
    },

    countdownEach: function(left: number, callback: Function, done: Function) {
        app.data.next = done;
        if(app.data.timer != undefined) {
            console.log("TIMEOUT CONFLICT");
            clearTimeout(app.data.timer);
        }
        if(left > 0) {
            callback(left);
            app.data.timer = setTimeout(function() {
                app.data.timer = undefined;
                app.countdownEach(left - 1, callback, done);
            }, 1000);
        } else {
            done();
        }
    },

    unregister: function() {
        if ( backEventListener !== null ) {
            document.removeEventListener( 'tizenhwkey', backEventListener );
            backEventListener = null;
            window.tizen.application.getCurrentApplication().exit();
        }
    },
};

$(document).bind( 'pageinit', app.init );
$(document).unload( app.unregister );
