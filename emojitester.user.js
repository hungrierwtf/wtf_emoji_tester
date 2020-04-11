// ==UserScript==
// @name         wtf emoji tester
// @namespace    WTDWTF
// @version      0.2.1
// @description  converts images to fake emoji
// @author       hungrier
// @match        https://what.thedailywtf.com/*
// @match        http://what.thedailywtf.com/*
// @grant        none
// @downloadURL  https://github.com/hungrierwtf/wtf_emoji_tester/raw/master/emojitester.user.js
// @homepageURL  https://github.com/hungrierwtf/wtf_emoji_tester
// ==/UserScript==

(function() {
    'use strict';

    var composerOpen = false;

    // 🤮
    var imagereg = /\!\[([^\]]+)\]\(([^\)]+)\)/g;

    function getComposerTextArea() {
        return document.querySelector('div[component="composer"] textarea.write');
    }

    function getComposerToolbar() {
        return document.querySelector('div[component="composer"] ul.formatting-group');
    }

    function getTaSelectedText(ta) {
        if (!ta || !ta.value) { return undefined; }
        return ta.value.slice(ta.selectionStart, ta.selectionEnd);
    }

    function getImages(text) {
        // ![tro-pop-46.gif](/assets/uploads/files/1578932568895-tro-pop-46.gif)

        if (!text || !text.trim || !text.trim()) {
            return [];
        }

        text = text.trim();

        var output = [];

        var m;
        while ((m = imagereg.exec(text)) !== null) {
            var caption = m[1];
            var url = m[2];
            console.log(caption,':',url);
            var e = ({
                url: url,
                caption: caption
            });
            output.push(e);
        }

        return output;
    }

    function createOneEmoji(ob) {
        if (!ob || !ob.url || !ob.caption) {
            return ''
        }

        //TODO add some caption for the summary (or just manually type it)

        var t = '\n<details><summary><img src="' + ob.url + '" class="emoji" title="' + ob.caption + '" /></summary>\n\n![' + ob.caption + '](' + ob.url + ')\n</details>\n';
        return t;
    }

    function doTheThing() {
        var ta = getComposerTextArea();
        // get selected text
        var stext = getTaSelectedText(ta);
        // process it
        var objects = getImages(stext);
        var finalText = '';
        for (var i = 0; i < objects.length; i++) {
            finalText = finalText + createOneEmoji(objects[i]);
        }
        // insert result (overwriting selection? -> ta.setRangeText)
        //TODO find some way to automatically refresh the preview after adding text
        ta.value = ta.value + finalText;
        ta.focus();
    }

    function createFa(which) {
        var i = document.createElement('i');
        i.classList.add('fa');
        i.classList.add('fa-' + which);
        return i;
    }

    function attachButton(tb) {
        var bli = document.createElement('li');
        bli.onclick = doTheThing;
        bli.appendChild(createFa('smile-o'));
        bli.appendChild(createFa('code'));

        // may need to updated this if the structure of the toolbar ever changes
        tb.insertBefore(bli,tb.lastElementChild);
    }

    function initToolbarButton() {
        var tb = getComposerToolbar();
        if (composerOpen && !tb) {
            console.log('tooblar gone');
            composerOpen = false;
        } else if (!composerOpen && tb) {
            console.log('tooblar appeared');
            attachButton(tb);
            composerOpen = true;
        }

        setTimeout(initToolbarButton, 1000);
    }

    // is there a setRepeat function or something like that? eh, this way works
    setTimeout(initToolbarButton);

})();
