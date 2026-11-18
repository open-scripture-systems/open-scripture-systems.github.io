/* Guided study: a short, numbered way through one passage, with a note box for each step.
 *
 * A study is plain data (STUDIES below): steps with a heading, why it matters, one thing to open, a question.
 * Answers are saved on this device only, by study and passage (ws.guide.<study>.<book>.<chapter>), and can be
 * exported as a Markdown file. The step text is our own wording and is a draft that a pastor or teacher has not
 * checked yet; the panel says so. Nothing here interprets the passage: it says what to look at, not what it means.
 */
(function () {
  var state = WS.state, esc = WS.esc;
  function L(x) { return state.lang === 'en' ? x.en : x.ja; }
  var S = {
    title: { en: 'Guided study', ja: '学びの手引き' },
    draft: { en: 'Draft: this guide is new and has not yet been checked by a pastor or teacher. It tells you where to look, not what the passage means.',
      ja: '下書き：この手引きは新しく、まだ牧師や先生の確認を受けていません。どこを見るかを示すもので、箇所の意味を教えるものではありません。' },
    passage: { en: 'Passage', ja: '箇所' }, step: { en: 'Step', ja: '段階' },
    open: { en: 'Open', ja: '開く' }, done: { en: 'Done', ja: '済み' }, undo: { en: 'Not done', ja: '未完了に戻す' },
    prev: { en: 'Back', ja: '前へ' }, next: { en: 'Next', ja: '次へ' }, skip: { en: 'Skip', ja: '飛ばす' },
    note: { en: 'Your notes for this step', ja: 'この段階のメモ' },
    saved: { en: 'Saved on this device only.', ja: 'この端末にだけ保存されます。' },
    export: { en: 'Save the study as a file', ja: '学びをファイルに保存' },
    soon: { en: 'A panel for this step is not built yet. Use the link below, or write what you find.', ja: 'この段階のパネルはまだありません。下のリンクを使うか、見つけたことを書いてください。' },
    q: { en: 'Question', ja: '問い' }, why: { en: 'Why', ja: '理由' }
  };
  var STUDIES = {
    basic: {
      title: { en: 'Basic study of a passage', ja: '聖書箇所の基本的な学び' },
      steps: [
        { h: { en: 'Read it slowly, more than once', ja: '何度もゆっくり読む' },
          why: { en: 'Your own questions come first; they guide every later step.', ja: '最初に必要なのは自分の問いです。それが後のすべての段階の道しるべになります。' },
          q: { en: 'What stands out? What do you not understand yet?', ja: '目にとまった所はどこですか。まだ分からない所はどこですか。' },
          open: function () { return WS.ja(); } },
        { h: { en: 'Compare translations', ja: '訳を読み比べる' },
          why: { en: 'Where translations differ, translators made a choice. Those are places to look at the Greek.', ja: '訳が分かれる所は、翻訳者の判断が分かれた所です。そこが原語を確かめる場所です。' },
          q: { en: 'Where do the translations differ?', ja: '訳が違うのはどこですか。' },
          open: function () { return 'parallel'; } },
        { h: { en: 'Context and where the passage begins and ends', ja: '文脈と区切り' },
          why: { en: 'Words mean what they mean in their setting. Read what comes before and after.', ja: 'ことばは文脈の中で意味を持ちます。前後も読みます。' },
          q: { en: 'Where does this passage start and stop? What kind of writing is it?', ja: 'この箇所はどこから始まり、どこで終わりますか。手紙、物語、詩など、どんな文書ですか。' },
          chapterNav: true },
        { h: { en: 'People, places and events', ja: '人物、場所、出来事' },
          why: { en: 'The first readers knew who and where. Check before you read on.', ja: '最初の読者は、誰がどこにいたかを知っていました。先に確かめます。' },
          q: { en: 'Who speaks to whom? Where and when?', ja: '誰が誰に語っていますか。いつ、どこでですか。' },
          tool: 'factbook' },
        { h: { en: 'Words in the original language', ja: '原語のことば' },
          why: { en: 'Click a Greek word. A word means what its use shows, not what its roots suggest.', ja: 'ギリシア語の語を押してください。語の意味は、語源ではなく、使われ方で決まります。' },
          q: { en: 'Which words matter most here? How are they used elsewhere?', ja: 'ここで大切な語はどれですか。ほかの箇所ではどう使われていますか。' },
          open: function () { return 'greek'; }, also: 'word' },
        { h: { en: 'Other passages', ja: '聖書のほかの箇所' },
          why: { en: 'Scripture sheds light on Scripture. Read each cross reference in its own setting.', ja: '聖書は聖書によって照らされます。関連箇所は、それぞれの文脈で読みます。' },
          q: { en: 'Which other passages help, and why?', ja: 'どの箇所が助けになりますか。なぜですか。' },
          tool: 'companion' },
        { h: { en: 'Say it in your own words', ja: '自分のことばでまとめる' },
          why: { en: 'If you can say the main point plainly, you have understood it so far.', ja: '要点を短く言えれば、ここまで理解できています。' },
          q: { en: 'What is the main point, in one or two sentences?', ja: '要点を一、二文で書いてください。' } },
        { h: { en: 'Commentaries', ja: '注解書' },
          why: { en: 'Others read it before you. Check your reading against theirs after you have done your own.', ja: '先に読んだ人たちがいます。自分で読んだ後に、照らし合わせます。' },
          q: { en: 'Where do they agree or differ with your reading?', ja: '自分の読み方と、どこが同じで、どこが違いますか。' },
          open: function () { return 'commentary'; } },
        { h: { en: 'What it teaches, and living it', ja: '教えと生き方' },
          why: { en: 'Study ends in obedience and worship, with the church, in prayer.', ja: '学びは、祈りと教会の交わりの中で、従うことと礼拝に向かいます。' },
          q: { en: 'What does it teach about God? What will you do?', ja: '神について何を教えていますか。あなたは何をしますか。' } }
      ]
    }
  };

  function key() { return 'ws.guide.basic.' + state.book + '.' + state.ch; }
  function load() { return WS.store.get(key(), { at: 0, notes: {}, done: {} }); }
  function save(d) { WS.store.set(key(), d); }

  function guide(el) {
    el.classList.add('guide');
    var study = STUDIES.basic;
    el.addEventListener('input', function (ev) {
      if (ev.target.tagName !== 'TEXTAREA') return;
      var d = load(); d.notes[d.at] = ev.target.value; save(d);
    });
    el.addEventListener('click', function (ev) {
      var b = ev.target.closest('button[data-g]'); if (!b) return;
      var d = load(), n = study.steps.length, k = b.dataset.g;
      if (k === 'prev') d.at = Math.max(0, d.at - 1);
      else if (k === 'next' || k === 'skip') d.at = Math.min(n - 1, d.at + 1);
      else if (k === 'go') d.at = +b.dataset.i;
      else if (k === 'done') { d.done[d.at] = !d.done[d.at]; if (d.done[d.at] && d.at < n - 1) d.at += 1; }
      else if (k === 'open') { var p = WS.ensurePanel(b.dataset.p); if (p) p.api.setActive(); return; }
      else if (k === 'chap') { WS.go(state.book, Math.min(WS.manifest.books[state.book].chapters, Math.max(1, state.ch + (+b.dataset.d))), 1); return; }
      else if (k === 'export') { exportFile(d); return; }
      save(d); draw();
    });
    function exportFile(d) {
      var ref = WS.bookName() + ' ' + state.ch, out = ['# ' + L(study.title) + ': ' + ref, ''];
      study.steps.forEach(function (s, i) {
        out.push('## ' + (i + 1) + '. ' + L(s.h), '', '*' + L(S.q) + ':* ' + L(s.q), '', (d.notes[i] || '').trim() || '-', '');
      });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([out.join('\n')], { type: 'text/markdown' }));
      a.download = 'study-' + state.book + '-' + state.ch + '.md'; a.click();
    }
    function draw() {
      var d = load(), s = study.steps[d.at], n = study.steps.length, doneN = Object.keys(d.done).filter(function (i) { return d.done[i]; }).length;
      var site = window.WS_SITE, q = state.lang === 'en' ? '?lang=en' : '?lang=ja';
      var openId = s.open ? s.open() : null;
      var act = openId ? '<button class="btn" data-g="open" data-p="' + esc(openId) + '">' + esc(L(S.open) + '：' + WS.itemName(openId)) + '</button>' +
          (s.also ? ' <button class="btn" data-g="open" data-p="' + esc(s.also) + '">' + esc(L(S.open) + '：' + WS.itemName(s.also)) + '</button>' : '')
        : s.chapterNav ? '<button class="btn" data-g="chap" data-d="-1">‹ ' + esc(L(S.prev)) + '</button> <button class="btn" data-g="chap" data-d="1">' + esc(L(S.next)) + ' ›</button>'
        : s.tool && site ? '<p class="small">' + esc(L(S.soon)) + '</p><a class="btn" href="' + site.home + s.tool + '/' + q + '" target="_blank" rel="noopener">' +
            esc(L(S.open) + '：' + (site.tools.filter(function (x) { return x[0] === s.tool; })[0] || [0, s.tool, s.tool])[state.lang === 'en' ? 1 : 2]) + '</a>' : '';
      el.innerHTML = '<h2>' + esc(L(S.title)) + ' · ' + esc(L(study.title)) + '</h2>' +
        '<p class="gdraft" role="note">' + esc(L(S.draft)) + '</p>' +
        '<p class="small">' + esc(L(S.passage)) + '：' + esc(WS.bookName() + ' ' + state.ch) + ' · ' + esc(L(S.done)) + ' ' + doneN + '/' + n + '</p>' +
        '<ol class="gsteps">' + study.steps.map(function (x, i) {
          return '<li><button data-g="go" data-i="' + i + '" aria-current="' + (i === d.at) + '" class="' + (d.done[i] ? 'gdone' : '') + '">' + (i + 1) + '</button></li>';
        }).join('') + '</ol>' +
        '<h3>' + esc(L(S.step)) + ' ' + (d.at + 1) + '/' + n + '：' + esc(L(s.h)) + '</h3>' +
        '<p><b>' + esc(L(S.why)) + '：</b>' + esc(L(s.why)) + '</p>' +
        '<div class="gact">' + act + '</div>' +
        '<p><b>' + esc(L(S.q)) + '：</b>' + esc(L(s.q)) + '</p>' +
        '<label class="small" for="gnote">' + esc(L(S.note)) + '</label><textarea id="gnote"></textarea><p class="small">' + esc(L(S.saved)) + '</p>' +
        '<div class="grow"><button class="btn" data-g="prev">' + esc(L(S.prev)) + '</button>' +
        '<button class="btn" data-g="done">' + esc(L(d.done[d.at] ? S.undo : S.done)) + '</button>' +
        '<button class="btn" data-g="skip">' + esc(L(S.skip)) + '</button>' +
        '<button class="btn" data-g="export">' + esc(L(S.export)) + '</button></div>';
      el.querySelector('textarea').value = d.notes[d.at] || '';
    }
    return { render: draw };
  }

  WS.panel({ id: 'guide', component: 'guide', title: { en: 'Guided study', ja: '学びの手引き' }, group: 'study', build: guide });
})();
