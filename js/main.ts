/// <reference path="/Users/blast/Projects/typescript/DefinitelyTyped/jquerymobile/jquerymobile.d.ts" />
/// <reference path="/Users/blast/Projects/typescript/DefinitelyTyped/jquery/jquery.d.ts" />
/// <reference path="tizen.webidl.d.ts" />
/// <reference path="tizen.event.webidl.d.ts" />
/// <reference path="tizen.application.webidl.d.ts" />
/// <reference path="tizen.package.webidl.d.ts" />

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
            app.data.state = 1;
            app.become(State.COUNTDOWN);
        });

        $(".container .content .b").each(function(i, elem) { $(elem).click({label: i}, function(event) {
            app.become(event.data["label"]);
        }); });
        app.become(State.INIT);
    },

    // Switch to the next state
    nextExercise: function() {
        var curkey = app.data.seq[app.data.state];
        if(curkey != undefined) {
            console.log("Switching to:", curkey);
            app.become(State.COUNTDOWN);
            app.countdown(5, function() {
                console.log("countdown reached");
                app.initializeNext();
            });
        } else {
            app.countdown(5, function() {
                app.become(State.FINISHED);
                console.log("End reached");
            });
        }
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
                app.countdownEach(5, function(left: Number) {
                    $(app.refs.exerciseLabel).text(label);
                    $(app.refs.exerciseText).text("" + left + " second" + ((left > 1) ? "s":"") + " left");
                    $(app.refs.exerciseImage).attr("src", "images/aocaktm.gif");
                }, function() {
                    app.data.state += 1;
                    if(app.data.state < app.data.seq.length) {
                        app.become(State.COUNTDOWN);
                    } else {
                        app.become(State.FINISHED);
                    }
                });
                $(".container .content .inner.exercise").show();
                console.log("become EXERCISE");
                break;
            case State.FINISHED:
                console.log("become FINISHED");
                $(".container .content .inner.finished").show();
                break;
        }
    },

    countdown: function(duration: number, callback: Function) {
        if(app.data.timer != undefined) {
            console.log("TIMEOUT CONFLICT");
            clearTimeout(app.data.timer);
        }
        app.data.timer = setTimeout(function() {
            app.data.timer = undefined;
            callback();
        }, duration * 1000);
    },

    countdownEach: function(left: number, callback: Function, done: Function) {
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
