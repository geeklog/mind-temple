import { resolvePath } from '../util/fileUtil';
import fs from 'fs';
import path from 'path';
import { flatten } from 'lodash';

export default async (req, res) => {
  let resourcePath: string = req.path.replace('\/book\/', '');
  resourcePath = decodeURIComponent(resourcePath);
  const filePath = resolvePath(resourcePath);
  const text = fs.readFileSync(filePath).toString();
  const {toc, content } = parseBookContent(text);
  res.render('book', { book: {
    name: path.basename(filePath),
    // theme: {
    //   main: '#f18686',
    //   light: '#f5c3c3',
    //   light2: '#fffefc',
    //   dark: '#e76161',
    //   bgcover: '#f5c3c3'
    // },
    theme: {
      theme: req.query.theme || 'unknown',
      mainColor: '#f18686'
    },
    toc,
    content
  }});
};

const splitLines = text => text.split('\r\n').join('\n').split('\r').join('\n').split('\n');

const parseBookContent = (bookText) => {
  const lines = splitLines(bookText);

  let parags = [];
  let currParag;
  const toc = [];

  let iHeader = 1;
  let iChapter = 0;
  for (let line of lines) {
    if (line.startsWith('## ')) {
      line = line.replace('## ', '');
      const id = iHeader++;
      currParag = [];
      parags.push(currParag);
      currParag.push(`<h2 id="${id}">${line}</h2>`);
      toc.push({id, text: line});
      continue;
    }

    const parts = line.split(/\s+/g);

    if (parts[0].startsWith('第') && parts[0].endsWith('回')) {
      const id = iHeader++;
      const tocText = [parts[0].padEnd(6, '　'), ...parts.slice(1)]
        .join('　').replace(/\(\d+\)/g, '');
      currParag = [];
      parags.push(currParag);
      currParag.push(`<h2 id="${id}">${line}</h2>`);
      toc.push({id, text: tocText});
      continue;
    }

    currParag.push(line);
  }
  // parags = parags.slice(0, 3);
  parags = parags.map(parag => {
    iChapter ++;
    const footnotes = [];

    parag = parag.map((line) => {
      if (line === '--------------------') {
        return '';
      }

      if (!line.trim()) {
        line = '';

      } else {
        const m = line.match(/^\((\d+)\)/);
        if (m) { // footnote line
          // make footnote tag and jump back
          const iFootnote = m[1];
          footnotes[Number(iFootnote)] = line.replace(/\((\d+)\)\s*/g, '');
          line = '';

        } else { // normal line
          // make jump to footnote
          line = '<p>' + line.replace(/\((\d+)\)/g, (g0, iFootnote) =>
            `<sub class="tooltip"><a id="ref_${iChapter}_${iFootnote}" href="#fn_${iChapter}_${iFootnote}">${iFootnote}</a>%footnote${iFootnote}</sub>`,
          ) + '</p>';
        }
      }

      return line;
    });

    parag = parag.map((line) => {
      return line.replace(/%footnote(\d+)/g, (g0, iFootnote) => {
        if (footnotes[Number(iFootnote)]) {
          return `<span class="tooltiptext">${footnotes[Number(iFootnote)]}</span>`;
        } else {
          return '';
        }
      });
    });

    return parag;
  });

  return {
    content: flatten(parags).map(p => p.trim()).filter(p => !!p).join(''),
    toc,
  };
};
