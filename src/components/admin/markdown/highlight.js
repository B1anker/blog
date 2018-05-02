var hljs = {}
var ArrayProto = [],
  objectKeys = Object.keys;

// Global internal variables used within the highlight.js library.
var languages = {},
  aliases = {};

// Regular expressions used throughout the highlight.js library.
var noHighlightRe = /^(no-?highlight|plain|text)$/i,
  languagePrefixRe = /\blang(?:uage)?-([\w-]+)\b/i,
  fixMarkupRe = /((^(<[^>]+>|\t|)+|(?:\n)))/gm;

var spanEndTag = "</span>";

// Global options used when within external APIs. This is modified when
// calling the `hljs.configure` function.
var options = {
  classPrefix: "hljs-",
  tabReplace: null,
  useBR: false,
  languages: undefined
};

// Object map that is used to escape some common HTML characters.
var escapeRegexMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};

/* Utility functions */

function escape(value) {
  return value.replace(/[&<>]/gm, function(character) {
    return escapeRegexMap[character];
  });
}

function tag(node) {
  return node.nodeName.toLowerCase();
}

function testRe(re, lexeme) {
  var match = re && re.exec(lexeme);
  return match && match.index === 0;
}

function isNotHighlighted(language) {
  return noHighlightRe.test(language);
}

function blockLanguage(block) {
  var i, match, length, _class;
  var classes = block.className + " ";

  classes += block.parentNode ? block.parentNode.className : "";

  // language-* takes precedence over non-prefixed class names.
  match = languagePrefixRe.exec(classes);
  if (match) {
    return getLanguage(match[1]) ? match[1] : "no-highlight";
  }

  classes = classes.split(/\s+/);

  for (i = 0, length = classes.length; i < length; i++) {
    _class = classes[i];

    if (isNotHighlighted(_class) || getLanguage(_class)) {
      return _class;
    }
  }
}

function inherit(parent) {
  // inherit(parent, override_obj, override_obj, ...)
  var key;
  var result = {};
  var objects = Array.prototype.slice.call(arguments, 1);

  for (key in parent) result[key] = parent[key];
  objects.forEach(function(obj) {
    for (key in obj) result[key] = obj[key];
  });
  return result;
}

/* Stream merging */

function nodeStream(node) {
  var result = [];
  (function _nodeStream(node, offset) {
    for (var child = node.firstChild; child; child = child.nextSibling) {
      if (child.nodeType === 3) offset += child.nodeValue.length;
      else if (child.nodeType === 1) {
        result.push({
          event: "start",
          offset: offset,
          node: child
        });
        offset = _nodeStream(child, offset);
        // Prevent void elements from having an end tag that would actually
        // double them in the output. There are more void elements in HTML
        // but we list only those realistically expected in code display.
        if (!tag(child).match(/br|hr|img|input/)) {
          result.push({
            event: "stop",
            offset: offset,
            node: child
          });
        }
      }
    }
    return offset;
  })(node, 0);
  return result;
}

function mergeStreams(original, highlighted, value) {
  var processed = 0;
  var result = "";
  var nodeStack = [];

  function selectStream() {
    if (!original.length || !highlighted.length) {
      return original.length ? original : highlighted;
    }
    if (original[0].offset !== highlighted[0].offset) {
      return original[0].offset < highlighted[0].offset
        ? original
        : highlighted;
    }

    /*
      To avoid starting the stream just before it should stop the order is
      ensured that original always starts first and closes last:

      if (event1 == 'start' && event2 == 'start')
        return original;
      if (event1 == 'start' && event2 == 'stop')
        return highlighted;
      if (event1 == 'stop' && event2 == 'start')
        return original;
      if (event1 == 'stop' && event2 == 'stop')
        return highlighted;

      ... which is collapsed to:
      */
    return highlighted[0].event === "start" ? original : highlighted;
  }

  function open(node) {
    function attr_str(a) {
      return " " + a.nodeName + '="' + escape(a.value) + '"';
    }
    result +=
      "<" +
      tag(node) +
      ArrayProto.map.call(node.attributes, attr_str).join("") +
      ">";
  }

  function close(node) {
    result += "</" + tag(node) + ">";
  }

  function render(event) {
    (event.event === "start" ? open : close)(event.node);
  }

  while (original.length || highlighted.length) {
    var stream = selectStream();
    result += escape(value.substring(processed, stream[0].offset));
    processed = stream[0].offset;
    if (stream === original) {
      /*
        On any opening or closing tag of the original markup we first close
        the entire highlighted node stack, then render the original tag along
        with all the following original tags at the same offset and then
        reopen all the tags on the highlighted stack.
        */
      nodeStack.reverse().forEach(close);
      do {
        render(stream.splice(0, 1)[0]);
        stream = selectStream();
      } while (
        stream === original &&
        stream.length &&
        stream[0].offset === processed
      );
      nodeStack.reverse().forEach(open);
    } else {
      if (stream[0].event === "start") {
        nodeStack.push(stream[0].node);
      } else {
        nodeStack.pop();
      }
      render(stream.splice(0, 1)[0]);
    }
  }
  return result + escape(value.substr(processed));
}

/* Initialization */

function expand_mode(mode) {
  if (mode.variants && !mode.cached_variants) {
    mode.cached_variants = mode.variants.map(function(variant) {
      return inherit(mode, { variants: null }, variant);
    });
  }
  return (
    mode.cached_variants || (mode.endsWithParent && [inherit(mode)]) || [mode]
  );
}

function compileLanguage(language) {
  function reStr(re) {
    return (re && re.source) || re;
  }

  function langRe(value, global) {
    return new RegExp(
      reStr(value),
      "m" + (language.case_insensitive ? "i" : "") + (global ? "g" : "")
    );
  }

  function compileMode(mode, parent) {
    if (mode.compiled) return;
    mode.compiled = true;

    mode.keywords = mode.keywords || mode.beginKeywords;
    if (mode.keywords) {
      var compiled_keywords = {};

      var flatten = function(className, str) {
        if (language.case_insensitive) {
          str = str.toLowerCase();
        }
        str.split(" ").forEach(function(kw) {
          var pair = kw.split("|");
          compiled_keywords[pair[0]] = [
            className,
            pair[1] ? Number(pair[1]) : 1
          ];
        });
      };

      if (typeof mode.keywords === "string") {
        // string
        flatten("keyword", mode.keywords);
      } else {
        objectKeys(mode.keywords).forEach(function(className) {
          flatten(className, mode.keywords[className]);
        });
      }
      mode.keywords = compiled_keywords;
    }
    mode.lexemesRe = langRe(mode.lexemes || /\w+/, true);

    if (parent) {
      if (mode.beginKeywords) {
        mode.begin = "\\b(" + mode.beginKeywords.split(" ").join("|") + ")\\b";
      }
      if (!mode.begin) mode.begin = /\B|\b/;
      mode.beginRe = langRe(mode.begin);
      if (!mode.end && !mode.endsWithParent) mode.end = /\B|\b/;
      if (mode.end) mode.endRe = langRe(mode.end);
      mode.terminator_end = reStr(mode.end) || "";
      if (mode.endsWithParent && parent.terminator_end)
        mode.terminator_end += (mode.end ? "|" : "") + parent.terminator_end;
    }
    if (mode.illegal) mode.illegalRe = langRe(mode.illegal);
    if (mode.relevance == null) mode.relevance = 1;
    if (!mode.contains) {
      mode.contains = [];
    }
    mode.contains = Array.prototype.concat.apply(
      [],
      mode.contains.map(function(c) {
        return expand_mode(c === "self" ? mode : c);
      })
    );
    mode.contains.forEach(function(c) {
      compileMode(c, mode);
    });

    if (mode.starts) {
      compileMode(mode.starts, parent);
    }

    var terminators = mode.contains
      .map(function(c) {
        return c.beginKeywords ? "\\.?(" + c.begin + ")\\.?" : c.begin;
      })
      .concat([mode.terminator_end, mode.illegal])
      .map(reStr)
      .filter(Boolean);
    mode.terminators = terminators.length
      ? langRe(terminators.join("|"), true)
      : {
          exec: function(/*s*/) {
            return null;
          }
        };
  }

  compileMode(language);
}

/*
  Core highlighting function. Accepts a language name, or an alias, and a
  string with the code to highlight. Returns an object with the following
  properties:

  - relevance (int)
  - value (an HTML string with highlighting markup)

  */
function highlight(name, value, ignore_illegals, continuation) {
  function subMode(lexeme, mode) {
    var i, length;

    for (i = 0, length = mode.contains.length; i < length; i++) {
      if (testRe(mode.contains[i].beginRe, lexeme)) {
        return mode.contains[i];
      }
    }
  }

  function endOfMode(mode, lexeme) {
    if (testRe(mode.endRe, lexeme)) {
      while (mode.endsParent && mode.parent) {
        mode = mode.parent;
      }
      return mode;
    }
    if (mode.endsWithParent) {
      return endOfMode(mode.parent, lexeme);
    }
  }

  function isIllegal(lexeme, mode) {
    return !ignore_illegals && testRe(mode.illegalRe, lexeme);
  }

  function keywordMatch(mode, match) {
    var match_str = language.case_insensitive
      ? match[0].toLowerCase()
      : match[0];
    return mode.keywords.hasOwnProperty(match_str) && mode.keywords[match_str];
  }

  function buildSpan(classname, insideSpan, leaveOpen, noPrefix) {
    var classPrefix = noPrefix ? "" : options.classPrefix,
      openSpan = '<span class="' + classPrefix,
      closeSpan = leaveOpen ? "" : spanEndTag;

    openSpan += classname + '">';

    return openSpan + insideSpan + closeSpan;
  }

  function processKeywords() {
    var keyword_match, last_index, match, result;

    if (!top.keywords) return escape(mode_buffer);

    result = "";
    last_index = 0;
    top.lexemesRe.lastIndex = 0;
    match = top.lexemesRe.exec(mode_buffer);

    while (match) {
      result += escape(mode_buffer.substring(last_index, match.index));
      keyword_match = keywordMatch(top, match);
      if (keyword_match) {
        relevance += keyword_match[1];
        result += buildSpan(keyword_match[0], escape(match[0]));
      } else {
        result += escape(match[0]);
      }
      last_index = top.lexemesRe.lastIndex;
      match = top.lexemesRe.exec(mode_buffer);
    }
    return result + escape(mode_buffer.substr(last_index));
  }

  function processSubLanguage() {
    var explicit = typeof top.subLanguage === "string";
    if (explicit && !languages[top.subLanguage]) {
      return escape(mode_buffer);
    }

    var result = explicit
      ? highlight(
          top.subLanguage,
          mode_buffer,
          true,
          continuations[top.subLanguage]
        )
      : highlightAuto(
          mode_buffer,
          top.subLanguage.length ? top.subLanguage : undefined
        );

    // Counting embedded language score towards the host language may be disabled
    // with zeroing the containing mode relevance. Usecase in point is Markdown that
    // allows XML everywhere and makes every XML snippet to have a much larger Markdown
    // score.
    if (top.relevance > 0) {
      relevance += result.relevance;
    }
    if (explicit) {
      continuations[top.subLanguage] = result.top;
    }
    return buildSpan(result.language, result.value, false, true);
  }

  function processBuffer() {
    result +=
      top.subLanguage != null ? processSubLanguage() : processKeywords();
    mode_buffer = "";
  }

  function startNewMode(mode) {
    result += mode.className ? buildSpan(mode.className, "", true) : "";
    top = Object.create(mode, { parent: { value: top } });
  }

  function processLexeme(buffer, lexeme) {
    mode_buffer += buffer;

    if (lexeme == null) {
      processBuffer();
      return 0;
    }

    var new_mode = subMode(lexeme, top);
    if (new_mode) {
      if (new_mode.skip) {
        mode_buffer += lexeme;
      } else {
        if (new_mode.excludeBegin) {
          mode_buffer += lexeme;
        }
        processBuffer();
        if (!new_mode.returnBegin && !new_mode.excludeBegin) {
          mode_buffer = lexeme;
        }
      }
      startNewMode(new_mode, lexeme);
      return new_mode.returnBegin ? 0 : lexeme.length;
    }

    var end_mode = endOfMode(top, lexeme);
    if (end_mode) {
      var origin = top;
      if (origin.skip) {
        mode_buffer += lexeme;
      } else {
        if (!(origin.returnEnd || origin.excludeEnd)) {
          mode_buffer += lexeme;
        }
        processBuffer();
        if (origin.excludeEnd) {
          mode_buffer = lexeme;
        }
      }
      do {
        if (top.className) {
          result += spanEndTag;
        }
        if (!top.skip) {
          relevance += top.relevance;
        }
        top = top.parent;
      } while (top !== end_mode.parent);
      if (end_mode.starts) {
        startNewMode(end_mode.starts, "");
      }
      return origin.returnEnd ? 0 : lexeme.length;
    }

    if (isIllegal(lexeme, top))
      throw new Error(
        'Illegal lexeme "' +
          lexeme +
          '" for mode "' +
          (top.className || "<unnamed>") +
          '"'
      );

    /*
      Parser should not reach this point as all types of lexemes should be caught
      earlier, but if it does due to some bug make sure it advances at least one
      character forward to prevent infinite looping.
      */
    mode_buffer += lexeme;
    return lexeme.length || 1;
  }

  var language = getLanguage(name);
  if (!language) {
    throw new Error('Unknown language: "' + name + '"');
  }

  compileLanguage(language);
  var top = continuation || language;
  var continuations = {}; // keep continuations for sub-languages
  var result = "",
    current;
  for (current = top; current !== language; current = current.parent) {
    if (current.className) {
      result = buildSpan(current.className, "", true) + result;
    }
  }
  var mode_buffer = "";
  var relevance = 0;
  try {
    var match,
      count,
      index = 0;
    while (true) {
      top.terminators.lastIndex = index;
      match = top.terminators.exec(value);
      if (!match) break;
      count = processLexeme(value.substring(index, match.index), match[0]);
      index = match.index + count;
    }
    processLexeme(value.substr(index));
    for (current = top; current.parent; current = current.parent) {
      // close dangling modes
      if (current.className) {
        result += spanEndTag;
      }
    }
    return {
      relevance: relevance,
      value: result,
      language: name,
      top: top
    };
  } catch (e) {
    if (e.message && e.message.indexOf("Illegal") !== -1) {
      return {
        relevance: 0,
        value: escape(value)
      };
    } else {
      throw e;
    }
  }
}

/*
  Highlighting with language detection. Accepts a string with the code to
  highlight. Returns an object with the following properties:

  - language (detected language)
  - relevance (int)
  - value (an HTML string with highlighting markup)
  - second_best (object with the same structure for second-best heuristically
    detected language, may be absent)

  */
function highlightAuto(text, languageSubset) {
  languageSubset = languageSubset || options.languages || objectKeys(languages);
  var result = {
    relevance: 0,
    value: escape(text)
  };
  var second_best = result;
  languageSubset.filter(getLanguage).forEach(function(name) {
    var current = highlight(name, text, false);
    current.language = name;
    if (current.relevance > second_best.relevance) {
      second_best = current;
    }
    if (current.relevance > result.relevance) {
      second_best = result;
      result = current;
    }
  });
  if (second_best.language) {
    result.second_best = second_best;
  }
  return result;
}

/*
  Post-processing of the highlighted markup:

  - replace TABs with something more useful
  - replace real line-breaks with '<br>' for non-pre containers

  */
function fixMarkup(value) {
  return !(options.tabReplace || options.useBR)
    ? value
    : value.replace(fixMarkupRe, function(match, p1) {
        if (options.useBR && match === "\n") {
          return "<br>";
        } else if (options.tabReplace) {
          return p1.replace(/\t/g, options.tabReplace);
        }
        return "";
      });
}

function buildClassName(prevClassName, currentLang, resultLang) {
  var language = currentLang ? aliases[currentLang] : resultLang,
    result = [prevClassName.trim()];

  if (!prevClassName.match(/\bhljs\b/)) {
    result.push("hljs");
  }

  if (prevClassName.indexOf(language) === -1) {
    result.push(language);
  }

  return result.join(" ").trim();
}

/*
  Applies highlighting to a DOM node containing code. Accepts a DOM node and
  two optional parameters for fixMarkup.
  */
export function highlightBlock(block) {
  var node, originalStream, result, resultNode, text;
  var language = blockLanguage(block);

  if (isNotHighlighted(language)) return;

  if (options.useBR) {
    node = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
    node.innerHTML = block.innerHTML
      .replace(/\n/g, "")
      .replace(/<br[ \/]*>/g, "\n");
  } else {
    node = block;
  }
  text = node.textContent;
  result = language ? highlight(language, text, true) : highlightAuto(text);

  originalStream = nodeStream(node);
  if (originalStream.length) {
    resultNode = document.createElementNS(
      "http://www.w3.org/1999/xhtml",
      "div"
    );
    resultNode.innerHTML = result.value;
    result.value = mergeStreams(originalStream, nodeStream(resultNode), text);
  }
  result.value = fixMarkup(result.value);

  block.innerHTML = result.value;
  block.className = buildClassName(block.className, language, result.language);
  block.result = {
    language: result.language,
    re: result.relevance
  };
  if (result.second_best) {
    block.second_best = {
      language: result.second_best.language,
      re: result.second_best.relevance
    };
  }
}

/*
  Updates highlight.js global options with values passed in the form of an object.
  */
function configure(user_options) {
  options = inherit(options, user_options);
}

/*
  Applies highlighting to all <pre><code>..</code></pre> blocks on a page.
  */
function initHighlighting() {
  if (initHighlighting.called) return;
  initHighlighting.called = true;

  var blocks = document.querySelectorAll("pre code");
  ArrayProto.forEach.call(blocks, highlightBlock);
}

/*
  Attaches highlighting to the page load event.
  */
function initHighlightingOnLoad() {
  addEventListener("DOMContentLoaded", initHighlighting, false);
  addEventListener("load", initHighlighting, false);
}

function registerLanguage(name, language) {
  var lang = (languages[name] = language(hljs));
  if (lang.aliases) {
    lang.aliases.forEach(function(alias) {
      aliases[alias] = name;
    });
  }
}

function listLanguages() {
  return objectKeys(languages);
}

function getLanguage(name) {
  name = (name || "").toLowerCase();
  return languages[name] || languages[aliases[name]];
}

/* Interface definition */

hljs.highlight = highlight;
hljs.highlightAuto = highlightAuto;
hljs.fixMarkup = fixMarkup;
hljs.highlightBlock = highlightBlock;
hljs.configure = configure;
hljs.initHighlighting = initHighlighting;
hljs.initHighlightingOnLoad = initHighlightingOnLoad;
hljs.registerLanguage = registerLanguage;
hljs.listLanguages = listLanguages;
hljs.getLanguage = getLanguage;
hljs.inherit = inherit;

// Common regexps
hljs.IDENT_RE = "[a-zA-Z]\\w*";
hljs.UNDERSCORE_IDENT_RE = "[a-zA-Z_]\\w*";
hljs.NUMBER_RE = "\\b\\d+(\\.\\d+)?";
hljs.C_NUMBER_RE =
  "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)"; // 0x..., 0..., decimal, float
hljs.BINARY_NUMBER_RE = "\\b(0b[01]+)"; // 0b...
hljs.RE_STARTERS_RE =
  "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~";

// Common modes
hljs.BACKSLASH_ESCAPE = {
  begin: "\\\\[\\s\\S]",
  relevance: 0
};
hljs.APOS_STRING_MODE = {
  className: "string",
  begin: "'",
  end: "'",
  illegal: "\\n",
  contains: [hljs.BACKSLASH_ESCAPE]
};
hljs.QUOTE_STRING_MODE = {
  className: "string",
  begin: '"',
  end: '"',
  illegal: "\\n",
  contains: [hljs.BACKSLASH_ESCAPE]
};
hljs.PHRASAL_WORDS_MODE = {
  begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|like)\b/
};
hljs.COMMENT = function(begin, end, inherits) {
  var mode = hljs.inherit(
    {
      className: "comment",
      begin: begin,
      end: end,
      contains: []
    },
    inherits || {}
  );
  mode.contains.push(hljs.PHRASAL_WORDS_MODE);
  mode.contains.push({
    className: "doctag",
    begin: "(?:TODO|FIXME|NOTE|BUG|XXX):",
    relevance: 0
  });
  return mode;
};
hljs.C_LINE_COMMENT_MODE = hljs.COMMENT("//", "$");
hljs.C_BLOCK_COMMENT_MODE = hljs.COMMENT("/\\*", "\\*/");
hljs.HASH_COMMENT_MODE = hljs.COMMENT("#", "$");
hljs.NUMBER_MODE = {
  className: "number",
  begin: hljs.NUMBER_RE,
  relevance: 0
};
hljs.C_NUMBER_MODE = {
  className: "number",
  begin: hljs.C_NUMBER_RE,
  relevance: 0
};
hljs.BINARY_NUMBER_MODE = {
  className: "number",
  begin: hljs.BINARY_NUMBER_RE,
  relevance: 0
};
hljs.CSS_NUMBER_MODE = {
  className: "number",
  begin:
    hljs.NUMBER_RE +
    "(" +
    "%|em|ex|ch|rem" +
    "|vw|vh|vmin|vmax" +
    "|cm|mm|in|pt|pc|px" +
    "|deg|grad|rad|turn" +
    "|s|ms" +
    "|Hz|kHz" +
    "|dpi|dpcm|dppx" +
    ")?",
  relevance: 0
};
hljs.REGEXP_MODE = {
  className: "regexp",
  begin: /\//,
  end: /\/[gimuy]*/,
  illegal: /\n/,
  contains: [
    hljs.BACKSLASH_ESCAPE,
    {
      begin: /\[/,
      end: /\]/,
      relevance: 0,
      contains: [hljs.BACKSLASH_ESCAPE]
    }
  ]
};
hljs.TITLE_MODE = {
  className: "title",
  begin: hljs.IDENT_RE,
  relevance: 0
};
hljs.UNDERSCORE_TITLE_MODE = {
  className: "title",
  begin: hljs.UNDERSCORE_IDENT_RE,
  relevance: 0
};
hljs.METHOD_GUARD = {
  // excludes method names from keyword processing
  begin: "\\.\\s*" + hljs.UNDERSCORE_IDENT_RE,
  relevance: 0
};

hljs.registerLanguage('vim', function(hljs) {
  return {
    lexemes: /[!#@\w]+/,
    keywords: {
      keyword:
        // express version except: ! & * < = > !! # @ @@
        'N|0 P|0 X|0 a|0 ab abc abo al am an|0 ar arga argd arge argdo argg argl argu as au aug aun b|0 bN ba bad bd be bel bf bl bm bn bo bp br brea breaka breakd breakl bro bufdo buffers bun bw c|0 cN cNf ca cabc caddb cad caddf cal cat cb cc ccl cd ce cex cf cfir cgetb cgete cg changes chd che checkt cl cla clo cm cmapc cme cn cnew cnf cno cnorea cnoreme co col colo com comc comp con conf cope '+
        'cp cpf cq cr cs cst cu cuna cunme cw delm deb debugg delc delf dif diffg diffo diffp diffpu diffs diffthis dig di dl dell dj dli do doautoa dp dr ds dsp e|0 ea ec echoe echoh echom echon el elsei em en endfo endf endt endw ene ex exe exi exu f|0 files filet fin fina fini fir fix fo foldc foldd folddoc foldo for fu go gr grepa gu gv ha helpf helpg helpt hi hid his ia iabc if ij il im imapc '+
        'ime ino inorea inoreme int is isp iu iuna iunme j|0 ju k|0 keepa kee keepj lN lNf l|0 lad laddb laddf la lan lat lb lc lch lcl lcs le lefta let lex lf lfir lgetb lgete lg lgr lgrepa lh ll lla lli lmak lm lmapc lne lnew lnf ln loadk lo loc lockv lol lope lp lpf lr ls lt lu lua luad luaf lv lvimgrepa lw m|0 ma mak map mapc marks mat me menut mes mk mks mksp mkv mkvie mod mz mzf nbc nb nbs new nm nmapc nme nn nnoreme noa no noh norea noreme norm nu nun nunme ol o|0 om omapc ome on ono onoreme opt ou ounme ow p|0 '+
        'profd prof pro promptr pc ped pe perld po popu pp pre prev ps pt ptN ptf ptj ptl ptn ptp ptr pts pu pw py3 python3 py3d py3f py pyd pyf quita qa rec red redi redr redraws reg res ret retu rew ri rightb rub rubyd rubyf rund ru rv sN san sa sal sav sb sbN sba sbf sbl sbm sbn sbp sbr scrip scripte scs se setf setg setl sf sfir sh sim sig sil sl sla sm smap smapc sme sn sni sno snor snoreme sor '+
        'so spelld spe spelli spellr spellu spellw sp spr sre st sta startg startr star stopi stj sts sun sunm sunme sus sv sw sy synti sync tN tabN tabc tabdo tabe tabf tabfir tabl tabm tabnew '+
        'tabn tabo tabp tabr tabs tab ta tags tc tcld tclf te tf th tj tl tm tn to tp tr try ts tu u|0 undoj undol una unh unl unlo unm unme uns up ve verb vert vim vimgrepa vi viu vie vm vmapc vme vne vn vnoreme vs vu vunme windo w|0 wN wa wh wi winc winp wn wp wq wqa ws wu wv x|0 xa xmapc xm xme xn xnoreme xu xunme y|0 z|0 ~ '+
        // full version
        'Next Print append abbreviate abclear aboveleft all amenu anoremenu args argadd argdelete argedit argglobal arglocal argument ascii autocmd augroup aunmenu buffer bNext ball badd bdelete behave belowright bfirst blast bmodified bnext botright bprevious brewind break breakadd breakdel breaklist browse bunload '+
        'bwipeout change cNext cNfile cabbrev cabclear caddbuffer caddexpr caddfile call catch cbuffer cclose center cexpr cfile cfirst cgetbuffer cgetexpr cgetfile chdir checkpath checktime clist clast close cmap cmapclear cmenu cnext cnewer cnfile cnoremap cnoreabbrev cnoremenu copy colder colorscheme command comclear compiler continue confirm copen cprevious cpfile cquit crewind cscope cstag cunmap '+
        'cunabbrev cunmenu cwindow delete delmarks debug debuggreedy delcommand delfunction diffupdate diffget diffoff diffpatch diffput diffsplit digraphs display deletel djump dlist doautocmd doautoall deletep drop dsearch dsplit edit earlier echo echoerr echohl echomsg else elseif emenu endif endfor '+
        'endfunction endtry endwhile enew execute exit exusage file filetype find finally finish first fixdel fold foldclose folddoopen folddoclosed foldopen function global goto grep grepadd gui gvim hardcopy help helpfind helpgrep helptags highlight hide history insert iabbrev iabclear ijump ilist imap '+
        'imapclear imenu inoremap inoreabbrev inoremenu intro isearch isplit iunmap iunabbrev iunmenu join jumps keepalt keepmarks keepjumps lNext lNfile list laddexpr laddbuffer laddfile last language later lbuffer lcd lchdir lclose lcscope left leftabove lexpr lfile lfirst lgetbuffer lgetexpr lgetfile lgrep lgrepadd lhelpgrep llast llist lmake lmap lmapclear lnext lnewer lnfile lnoremap loadkeymap loadview '+
        'lockmarks lockvar lolder lopen lprevious lpfile lrewind ltag lunmap luado luafile lvimgrep lvimgrepadd lwindow move mark make mapclear match menu menutranslate messages mkexrc mksession mkspell mkvimrc mkview mode mzscheme mzfile nbclose nbkey nbsart next nmap nmapclear nmenu nnoremap '+
        'nnoremenu noautocmd noremap nohlsearch noreabbrev noremenu normal number nunmap nunmenu oldfiles open omap omapclear omenu only onoremap onoremenu options ounmap ounmenu ownsyntax print profdel profile promptfind promptrepl pclose pedit perl perldo pop popup ppop preserve previous psearch ptag ptNext '+
        'ptfirst ptjump ptlast ptnext ptprevious ptrewind ptselect put pwd py3do py3file python pydo pyfile quit quitall qall read recover redo redir redraw redrawstatus registers resize retab return rewind right rightbelow ruby rubydo rubyfile rundo runtime rviminfo substitute sNext sandbox sargument sall saveas sbuffer sbNext sball sbfirst sblast sbmodified sbnext sbprevious sbrewind scriptnames scriptencoding '+
        'scscope set setfiletype setglobal setlocal sfind sfirst shell simalt sign silent sleep slast smagic smapclear smenu snext sniff snomagic snoremap snoremenu sort source spelldump spellgood spellinfo spellrepall spellundo spellwrong split sprevious srewind stop stag startgreplace startreplace '+
        'startinsert stopinsert stjump stselect sunhide sunmap sunmenu suspend sview swapname syntax syntime syncbind tNext tabNext tabclose tabedit tabfind tabfirst tablast tabmove tabnext tabonly tabprevious tabrewind tag tcl tcldo tclfile tearoff tfirst throw tjump tlast tmenu tnext topleft tprevious '+'trewind tselect tunmenu undo undojoin undolist unabbreviate unhide unlet unlockvar unmap unmenu unsilent update vglobal version verbose vertical vimgrep vimgrepadd visual viusage view vmap vmapclear vmenu vnew '+
        'vnoremap vnoremenu vsplit vunmap vunmenu write wNext wall while winsize wincmd winpos wnext wprevious wqall wsverb wundo wviminfo xit xall xmapclear xmap xmenu xnoremap xnoremenu xunmap xunmenu yank',
      built_in: //built in func
        'synIDtrans atan2 range matcharg did_filetype asin feedkeys xor argv ' +
        'complete_check add getwinposx getqflist getwinposy screencol ' +
        'clearmatches empty extend getcmdpos mzeval garbagecollect setreg ' +
        'ceil sqrt diff_hlID inputsecret get getfperm getpid filewritable ' +
        'shiftwidth max sinh isdirectory synID system inputrestore winline ' +
        'atan visualmode inputlist tabpagewinnr round getregtype mapcheck ' +
        'hasmapto histdel argidx findfile sha256 exists toupper getcmdline ' +
        'taglist string getmatches bufnr strftime winwidth bufexists ' +
        'strtrans tabpagebuflist setcmdpos remote_read printf setloclist ' +
        'getpos getline bufwinnr float2nr len getcmdtype diff_filler luaeval ' +
        'resolve libcallnr foldclosedend reverse filter has_key bufname ' +
        'str2float strlen setline getcharmod setbufvar index searchpos ' +
        'shellescape undofile foldclosed setqflist buflisted strchars str2nr ' +
        'virtcol floor remove undotree remote_expr winheight gettabwinvar ' +
        'reltime cursor tabpagenr finddir localtime acos getloclist search ' +
        'tanh matchend rename gettabvar strdisplaywidth type abs py3eval ' +
        'setwinvar tolower wildmenumode log10 spellsuggest bufloaded ' +
        'synconcealed nextnonblank server2client complete settabwinvar ' +
        'executable input wincol setmatches getftype hlID inputsave ' +
        'searchpair or screenrow line settabvar histadd deepcopy strpart ' +
        'remote_peek and eval getftime submatch screenchar winsaveview ' +
        'matchadd mkdir screenattr getfontname libcall reltimestr getfsize ' +
        'winnr invert pow getbufline byte2line soundfold repeat fnameescape ' +
        'tagfiles sin strwidth spellbadword trunc maparg log lispindent ' +
        'hostname setpos globpath remote_foreground getchar synIDattr ' +
        'fnamemodify cscope_connection stridx winbufnr indent min ' +
        'complete_add nr2char searchpairpos inputdialog values matchlist ' +
        'items hlexists strridx browsedir expand fmod pathshorten line2byte ' +
        'argc count getwinvar glob foldtextresult getreg foreground cosh ' +
        'matchdelete has char2nr simplify histget searchdecl iconv ' +
        'winrestcmd pumvisible writefile foldlevel haslocaldir keys cos ' +
        'matchstr foldtext histnr tan tempname getcwd byteidx getbufvar ' +
        'islocked escape eventhandler remote_send serverlist winrestview ' +
        'synstack pyeval prevnonblank readfile cindent filereadable changenr ' +
        'exp'
    },
    illegal: /;/,
    contains: [
      hljs.NUMBER_MODE,
      hljs.APOS_STRING_MODE,

      /*
      A double quote can start either a string or a line comment. Strings are
      ended before the end of a line by another double quote and can contain
      escaped double-quotes and post-escaped line breaks.

      Also, any double quote at the beginning of a line is a comment but we
      don't handle that properly at the moment: any double quote inside will
      turn them into a string. Handling it properly will require a smarter
      parser.
      */
      {
        className: 'string',
        begin: /"(\\"|\n\\|[^"\n])*"/
      },
      hljs.COMMENT('"', '$'),

      {
        className: 'variable',
        begin: /[bwtglsav]:[\w\d_]*/
      },
      {
        className: 'function',
        beginKeywords: 'function function!', end: '$',
        relevance: 0,
        contains: [
          hljs.TITLE_MODE,
          {
            className: 'params',
            begin: '\\(', end: '\\)'
          }
        ]
      },
      {
        className: 'symbol',
        begin: /<[\w-]+>/
      }
    ]
  };
});

hljs.registerLanguage('javascript', function(hljs) {
  var IDENT_RE = '[A-Za-z$_][0-9A-Za-z$_]*';
  var KEYWORDS = {
    keyword:
      'in of if for while finally var new function do return void else break catch ' +
      'instanceof with throw case default try this switch continue typeof delete ' +
      'let yield const export super debugger as async await static ' +
      // ECMAScript 6 modules import
      'import from as'
    ,
    literal:
      'true false null undefined NaN Infinity',
    built_in:
      'eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent ' +
      'encodeURI encodeURIComponent escape unescape Object Function Boolean Error ' +
      'EvalError InternalError RangeError ReferenceError StopIteration SyntaxError ' +
      'TypeError URIError Number Math Date String RegExp Array Float32Array ' +
      'Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array ' +
      'Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require ' +
      'module console window document Symbol Set Map WeakSet WeakMap Proxy Reflect ' +
      'Promise'
  };
  var EXPRESSIONS;
  var NUMBER = {
    className: 'number',
    variants: [
      { begin: '\\b(0[bB][01]+)' },
      { begin: '\\b(0[oO][0-7]+)' },
      { begin: hljs.C_NUMBER_RE }
    ],
    relevance: 0
  };
  var SUBST = {
    className: 'subst',
    begin: '\\$\\{', end: '\\}',
    keywords: KEYWORDS,
    contains: []  // defined later
  };
  var TEMPLATE_STRING = {
    className: 'string',
    begin: '`', end: '`',
    contains: [
      hljs.BACKSLASH_ESCAPE,
      SUBST
    ]
  };
  SUBST.contains = [
    hljs.APOS_STRING_MODE,
    hljs.QUOTE_STRING_MODE,
    TEMPLATE_STRING,
    NUMBER,
    hljs.REGEXP_MODE
  ]
  var PARAMS_CONTAINS = SUBST.contains.concat([
    hljs.C_BLOCK_COMMENT_MODE,
    hljs.C_LINE_COMMENT_MODE
  ]);

  return {
    aliases: ['js', 'jsx'],
    keywords: KEYWORDS,
    contains: [
      {
        className: 'meta',
        relevance: 10,
        begin: /^\s*['"]use (strict|asm)['"]/
      },
      {
        className: 'meta',
        begin: /^#!/, end: /$/
      },
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      TEMPLATE_STRING,
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      NUMBER,
      { // object attr container
        begin: /[{,]\s*/, relevance: 0,
        contains: [
          {
            begin: IDENT_RE + '\\s*:', returnBegin: true,
            relevance: 0,
            contains: [{className: 'attr', begin: IDENT_RE, relevance: 0}]
          }
        ]
      },
      { // "value" container
        begin: '(' + hljs.RE_STARTERS_RE + '|\\b(case|return|throw)\\b)\\s*',
        keywords: 'return throw case',
        contains: [
          hljs.C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE,
          hljs.REGEXP_MODE,
          {
            className: 'function',
            begin: '(\\(.*?\\)|' + IDENT_RE + ')\\s*=>', returnBegin: true,
            end: '\\s*=>',
            contains: [
              {
                className: 'params',
                variants: [
                  {
                    begin: IDENT_RE
                  },
                  {
                    begin: /\(\s*\)/,
                  },
                  {
                    begin: /\(/, end: /\)/,
                    excludeBegin: true, excludeEnd: true,
                    keywords: KEYWORDS,
                    contains: PARAMS_CONTAINS
                  }
                ]
              }
            ]
          },
          { // E4X / JSX
            begin: /</, end: /(\/\w+|\w+\/)>/,
            subLanguage: 'xml',
            contains: [
              {begin: /<\w+\s*\/>/, skip: true},
              {
                begin: /<\w+/, end: /(\/\w+|\w+\/)>/, skip: true,
                contains: [
                  {begin: /<\w+\s*\/>/, skip: true},
                  'self'
                ]
              }
            ]
          }
        ],
        relevance: 0
      },
      {
        className: 'function',
        beginKeywords: 'function', end: /\{/, excludeEnd: true,
        contains: [
          hljs.inherit(hljs.TITLE_MODE, {begin: IDENT_RE}),
          {
            className: 'params',
            begin: /\(/, end: /\)/,
            excludeBegin: true,
            excludeEnd: true,
            contains: PARAMS_CONTAINS
          }
        ],
        illegal: /\[|%/
      },
      {
        begin: /\$[(.]/ // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
      },
      hljs.METHOD_GUARD,
      { // ES6 class
        className: 'class',
        beginKeywords: 'class', end: /[{;=]/, excludeEnd: true,
        illegal: /[:"\[\]]/,
        contains: [
          {beginKeywords: 'extends'},
          hljs.UNDERSCORE_TITLE_MODE
        ]
      },
      {
        beginKeywords: 'constructor', end: /\{/, excludeEnd: true
      }
    ],
    illegal: /#(?!!)/
  };
});

hljs.registerLanguage('bash', function(hljs) {
  var VAR = {
    className: 'variable',
    variants: [
      {begin: /\$[\w\d#@][\w\d_]*/},
      {begin: /\$\{(.*?)}/}
    ]
  };
  var QUOTE_STRING = {
    className: 'string',
    begin: /"/, end: /"/,
    contains: [
      hljs.BACKSLASH_ESCAPE,
      VAR,
      {
        className: 'variable',
        begin: /\$\(/, end: /\)/,
        contains: [hljs.BACKSLASH_ESCAPE]
      }
    ]
  };
  var APOS_STRING = {
    className: 'string',
    begin: /'/, end: /'/
  };

  return {
    aliases: ['sh', 'zsh'],
    lexemes: /-?[a-z\._]+/,
    keywords: {
      keyword:
        'if then else elif fi for while in do done case esac function',
      literal:
        'true false',
      built_in:
        // Shell built-ins
        // http://www.gnu.org/software/bash/manual/html_node/Shell-Builtin-Commands.html
        'break cd continue eval exec exit export getopts hash pwd readonly return shift test times ' +
        'trap umask unset ' +
        // Bash built-ins
        'alias bind builtin caller command declare echo enable help let local logout mapfile printf ' +
        'read readarray source type typeset ulimit unalias ' +
        // Shell modifiers
        'set shopt ' +
        // Zsh built-ins
        'autoload bg bindkey bye cap chdir clone comparguments compcall compctl compdescribe compfiles ' +
        'compgroups compquote comptags comptry compvalues dirs disable disown echotc echoti emulate ' +
        'fc fg float functions getcap getln history integer jobs kill limit log noglob popd print ' +
        'pushd pushln rehash sched setcap setopt stat suspend ttyctl unfunction unhash unlimit ' +
        'unsetopt vared wait whence where which zcompile zformat zftp zle zmodload zparseopts zprof ' +
        'zpty zregexparse zsocket zstyle ztcp',
      _:
        '-ne -eq -lt -gt -f -d -e -s -l -a' // relevance booster
    },
    contains: [
      {
        className: 'meta',
        begin: /^#![^\n]+sh\s*$/,
        relevance: 10
      },
      {
        className: 'function',
        begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
        returnBegin: true,
        contains: [hljs.inherit(hljs.TITLE_MODE, {begin: /\w[\w\d_]*/})],
        relevance: 0
      },
      hljs.HASH_COMMENT_MODE,
      QUOTE_STRING,
      APOS_STRING,
      VAR
    ]
  };
});

hljs.registerLanguage('xml', function(hljs) {
  var XML_IDENT_RE = '[A-Za-z0-9\\._:-]+';
  var TAG_INTERNALS = {
    endsWithParent: true,
    illegal: /</,
    relevance: 0,
    contains: [
      {
        className: 'attr',
        begin: XML_IDENT_RE,
        relevance: 0
      },
      {
        begin: /=\s*/,
        relevance: 0,
        contains: [
          {
            className: 'string',
            endsParent: true,
            variants: [
              {begin: /"/, end: /"/},
              {begin: /'/, end: /'/},
              {begin: /[^\s"'=<>`]+/}
            ]
          }
        ]
      }
    ]
  };
  return {
    aliases: ['html', 'xhtml', 'rss', 'atom', 'xjb', 'xsd', 'xsl', 'plist'],
    case_insensitive: true,
    contains: [
      {
        className: 'meta',
        begin: '<!DOCTYPE', end: '>',
        relevance: 10,
        contains: [{begin: '\\[', end: '\\]'}]
      },
      hljs.COMMENT(
        '<!--',
        '-->',
        {
          relevance: 10
        }
      ),
      {
        begin: '<\\!\\[CDATA\\[', end: '\\]\\]>',
        relevance: 10
      },
      {
        begin: /<\?(php)?/, end: /\?>/,
        subLanguage: 'php',
        contains: [{begin: '/\\*', end: '\\*/', skip: true}]
      },
      {
        className: 'tag',
        /*
        The lookahead pattern (?=...) ensures that 'begin' only matches
        '<style' as a single word, followed by a whitespace or an
        ending braket. The '$' is needed for the lexeme to be recognized
        by hljs.subMode() that tests lexemes outside the stream.
        */
        begin: '<style(?=\\s|>|$)', end: '>',
        keywords: {name: 'style'},
        contains: [TAG_INTERNALS],
        starts: {
          end: '</style>', returnEnd: true,
          subLanguage: ['css', 'xml']
        }
      },
      {
        className: 'tag',
        // See the comment in the <style tag about the lookahead pattern
        begin: '<script(?=\\s|>|$)', end: '>',
        keywords: {name: 'script'},
        contains: [TAG_INTERNALS],
        starts: {
          end: '\<\/script\>', returnEnd: true,
          subLanguage: ['actionscript', 'javascript', 'handlebars', 'xml']
        }
      },
      {
        className: 'meta',
        variants: [
          {begin: /<\?xml/, end: /\?>/, relevance: 10},
          {begin: /<\?\w+/, end: /\?>/}
        ]
      },
      {
        className: 'tag',
        begin: '</?', end: '/?>',
        contains: [
          {
            className: 'name', begin: /[^\/><\s]+/, relevance: 0
          },
          TAG_INTERNALS
        ]
      }
    ]
  };
});
