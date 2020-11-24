import {splitOnce} from './util';
import { parseMacro } from './macroUtils';
import { encodeHTMLEntities, decodeHTMLEntities } from './domUtils';

const MarkdownIt: any = null;

export function formatTextForPreview(text: string) {
  text = decodeHTMLEntities(text);
  text = respectNewlines(text);
  return text;
}

export function formatTextForEditor(text: string) {
  text = encodeHTMLEntities(text);
  text = text.replace(/\n/g, '<br>');
  return text;
}

// Add two space to every lines to make markdown respect new line
export function respectNewlines(text: string) {
  return text.split('\n')
    .map(line => {
      // except for markdown table & code block & other special blocks
      if (line.startsWith('|') && line.endsWith('|')) {
        return line;
      } else {
        return line + '  ';
      }
    })
    .join('\n');
}

export function markdown(text: string) {
  text = md_plugin_macro(text);
  text = md_plugin_img(text);
  text = md_plugin_highlight(text);
  text = md_plugin_codes(text);
  text = md_plugin_blockquote(text);
  text = md_plugin_defcard(text);
  text = md_plugin_webclip(text);

  // let html = MarkdownIt.render(text);

  // html = html.replace(/<p>--\.(\w+?)--<\/p>/g, (m, g) => `<div class="${g}">`);
  // html = html.replace(/<p>--\/--<\/p>/g, '</div>');
  // html = html.replace(/<p>\[\[([^]*?)\]\]<\/p>/g,  (m, g) => `<dt>${g}</dt>`);
  // html = html.replace(/<p>\{\{([^]*?)\}\}<\/p>/g,  (m, g) => `<dd>${g}</dd>`);

  return text;
}

function md_plugin_highlight(text: string) {
  text = text.replace(/#!([^]+?)!#/g, (m, g) => `<span class="highlight-warn">${g}</span>`);
  text = text.replace(/#\?([^]+?)\?#/g, (m, g) => `<span class="highlight-error">${g}</span>`);
  text = text.replace(/#:([^]+?):#/g, (m, g) => `<span class="highlight-info">${g}</span>`);
  return text;
}

function md_plugin_img(text: string) {
  const macro = `
    ![:@name](@url) = <img src="@url" alt="@name" class="align-left" style="margin-left:0"/>
    ![@name:](@url) = <img src="@url" alt="@name" class="align-right" style="margin-right:0"/>
  `;
  text = parseMacro(text, macro);
  return text;
}

function md_plugin_webclip(text: string) {
  const macro = `
    ========
    \`\`\`\`webclip
    @title size=.@type

    image: @img_src
    @badgets
    \`\`\`\`
    ========
    <div class="webclip">
    <img src="@img_src" class="background" height="100px">
    <div class="content">
    <div class="title @type">
    <span>@title</span>
    </div>
    <div class="badgets">
    <hr>
    @badgets
    </div>
    </div>
    </div>

    ========

    site: @url = [tag=site href=@url icon="fa fa-home"]
    github: @url = [tag=github href=@url icon="fab fa-github"]
    demo: @url = [tag=demos href=@url icon="fas fa-cube"]
    wiki: @url = [tag=wiki href=@url icon="fab fa-wikipedia-w"]
    doc: @url = [tag=doc href=@url icon="fas fa-book"]

    ========
    [tag=@tag href=@href icon="@icon"]
    ========
    <a class="tag @tag" href="@href" target="_blank">
    <span title="@tag">
    <i class="@icon"></i>
    </span>
    </a>
    ========
  `;
  text = parseMacro(text, macro);
  return text;
}

function md_plugin_blockquote(text: string) {
  const macro = `
  > [warn] @text = <blockquote class="warn"><span class="icon-warning"><i class="fas fa-exclamation-triangle"></i></span>@text</blockquote>
  > [info] @text = <blockquote class="info"><span class="icon-info"><i class="fas fa-info-circle"></i></span>@text</blockquote>
  > [tips] @text = <blockquote class="tips"><span class="icon-tips"><i class="fas fa-sticky-note"></i></span>@text</blockquote>
  `;
  // const markdown = MarkdownIt? MarkdownIt: a => a;
  text = parseMacro(text, macro, {
    '@text'(vars: any) {
      // let res = MarkdownIt? MarkdownIt.renderInline(vars['@text']): vars['@text'];
      const res = vars['@text'];
      return res;
    }
  });
  return text;
}

function md_plugin_codes(text: string) {
  const macroText = `
  ========
  \`\`\`\`html @id
  @html
  \`\`\`\`css
  @css
  \`\`\`\`demo
  @style
  \`\`\`\`
  ========
  <div id="@id">
  <pre class="language-html"><code class="language-html">@html_escaped
  </code></pre>
  <pre class="language-css"><code class="language-css">@css
  </code></pre>
  <div class="demo">@html</div>
  <style>@style</style>
  </div>
  ========

  ========
  \`\`\`\`html @id
  @html
  \`\`\`\`css
  @css
  \`\`\`\`demo
  \`\`\`\`
  ========
  <div id="@id">
  <pre class="language-html"><code class="language-html">@html_escaped
  </code></pre>
  <pre class="language-css"><code class="language-css">@css
  </code></pre>
  <div class="demo">@html</div>
  <style>@style</style>
  </div>
  ========

  ========
  \`\`\`\`html @id
  @html
  \`\`\`\`demo
  \`\`\`\`
  ========
  <div id="@id">
  <pre class="language-html"><code class="language-html">@html_escaped
  </code></pre>
  <div class="demo">@html</div>
  </div>
  ========
  `;
  function html_escaped(vars: any) {
    return encodeHTMLEntities(vars['@html']);
  }
  function css_inject_id(vars: any) {
    const css = vars['@css'];
    const id = vars['@id'];
    const cssHunks = css.split('}');
    for (const j in cssHunks) {
      const cssLines = cssHunks[j].split('\n');
      for (const i in cssLines) {
        if (cssLines[i].includes('{')) {
        cssLines[i] = `#${id} .demo ${cssLines[i]}`;
        }
      }
      cssHunks[j] = cssLines.join('\n');
    }
    return cssHunks.join('}');
  }
  text = parseMacro(text, macroText, {'@html_escaped': html_escaped, '@style': css_inject_id});
  return text;
}

function md_plugin_defcard(text: string) {
  const macro = `
  ========
  \`\`\`\`definition
  @title

  @details
  \`\`\`\`
  ========
  <div class="def-card">
  <div class="def-card-title">@title</div>
  <table><tbody>
  @details
  </tbody></table>
  </div>

  ========
  `;
  const details = function(vars: any) {
    let dls = [];

    const lines = vars['@details'].split('\n');

    for (const line of lines) {
      const [dt, dd] = splitOnce(line, ': ').map(s => s.trim());
      dls.push([dt, encodeHTMLEntities(dd)]);
    }
    dls = dls.map(([dt, dd]) => `<tr><td><b>${dt}</b></td><td>${
      MarkdownIt ? MarkdownIt.render(dd) : dd
    }</td></tr>`);
    return dls.join('\n');
  };
  text = parseMacro(text, macro, {'@details': details});
  return text.split('\n').map(s => s.trim()).join('\n');
}

function md_plugin_macro(text: string) {
  let macroTexts = '';
  text = text.replace(/@@@\n([^]*?)@@@\n/g, (_, macroText) => {
    macroTexts += macroText;
    return '';
  });
  return parseMacro(text, macroTexts);
}
