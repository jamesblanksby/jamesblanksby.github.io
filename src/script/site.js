'use strict';

/* ////////////////////////////////////////////////////////////////////////////// */
/* ///////////////////////////////////////////////////////////////// DOCUMENT /// */
/* ////////////////////////////////////////////////////////////////////////////// */

/* -------------------------------------------------------------------- READY --- */
$(init);

/* --------------------------------------------------------------------- INIT --- */
function init() {
    // header
    header_init();

    // footer
    footer_init();
}


/* ////////////////////////////////////////////////////////////////////////////// */
/* /////////////////////////////////////////////////////////////////// HEADER /// */
/* ////////////////////////////////////////////////////////////////////////////// */

/* --------------------------------------------------------------------- INIT --- */
function header_init() {
    // event
    header_event();
}

/* -------------------------------------------------------------------- EVENT --- */
function header_event() {
    // event hover
    header_event_hover();
}

/* ------------------------------------------------------------ EVENT : HOVER --- */
function header_event_hover() {
    var $document,
        $heading;
    var original = {},
        scramble = {},
        interval;

    // cache elements
    $document = $(document);
    $heading = $('header h1');

    // listen for mouseover
    $heading.on('mouseover', function() {
        // original text
        original.document = $document.prop('title');
        original.heading = $heading.text();

        // scramble interval
        interval = setInterval(function() {
            // scramble text
            scramble.document = text_scramble(original.document);
            scramble.heading = text_scramble(original.heading);

            // text content
            $document.prop('title', scramble.document);
            $heading.text(scramble.heading);
        }, 50);
    });

    // listen for mouseout
    $heading.on('mouseout', function() {
        // destroy interval
        clearInterval(interval);

        // text content
        $document.prop('title', original.document);
        $heading.text(original.heading);
    });
}


/* ////////////////////////////////////////////////////////////////////////////// */
/* /////////////////////////////////////////////////////////////////// FOOTER /// */
/* ////////////////////////////////////////////////////////////////////////////// */

/* --------------------------------------------------------------------- INIT --- */
function footer_init() {
    // prepare
    header_prepare();
}

/* ------------------------------------------------------------------ PREPARE --- */
function header_prepare() {
    // time
    header_time();

    // code
    header_code();
}

/* --------------------------------------------------------------------- TIME --- */
function header_time() {
    var $time;
    var datetime,
        date,
        year;

    // cache element
    $time = $('footer time');

    // date
    date = new Date();
    datetime = date.toISOString().split('T')[0];
    year = date.getFullYear();

    // date content
    $time.attr('datetime', datetime);
    $time.text(year);
}

/* --------------------------------------------------------------------- CODE --- */
function header_code() {
    var $code;
    var uuid;

    // cache element
    $code = $('footer code');

    // uuid
    uuid = crypto.randomUUID();

    // uuid content
    $code.text(uuid);
}


/* ////////////////////////////////////////////////////////////////////////////// */
/* ///////////////////////////////////////////////////////////////////// TEXT /// */
/* ////////////////////////////////////////////////////////////////////////////// */

/* ----------------------------------------------------------------- SCRAMBLE --- */
function text_scramble(text) {
    var symbol;

    // symbol options
    symbol = '!<>-_\\/[]{}—=+*^?#'.split('');

    // scramble text
    text = text.split('').map(function(a) { return random(4) > 1 ? random(symbol) : a; }).join('');

    return text;
}


/* ////////////////////////////////////////////////////////////////////////////// */
/* /////////////////////////////////////////////////////////////////// RANDOM /// */
/* ////////////////////////////////////////////////////////////////////////////// */

/* ------------------------------------------------------------------- RANDOM --- */
function random(input) {
    var value;

    // validate number
    if (typeof input === 'number') {
        // random integer
        value = Math.floor((Math.random() * input));
    }
    // validate array
    else if (Array.isArray(input)) {
        // random array element
        value = input[random(input.length)];
    }

    return value;
}
