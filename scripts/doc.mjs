import fs from 'fs-extra';
import path from 'path';
import { unified } from 'unified';
import rehypeDocument from 'rehype-document';
import rehypePrism from '@mapbox/rehype-prism';
import stringify from 'rehype-stringify';
import rehypeFormat from 'rehype-format';
import rehypeWrap from 'rehype-wrap';
import rehypeRewrite from 'rehype-rewrite';
import rehypeAttrs from 'rehype-attr';
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import remarkParse from 'remark-parse';

const mdStr = fs.readFileSync(path.resolve(process.cwd(), 'README.md'));
const cssStr = fs.readFileSync(path.resolve(process.cwd(), 'scripts/github.css'));

const htmlStr = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeDocument, {
    title: 'store.js',
    meta: [
      { description: 'A simple, lightweight JavaScript API for handling browser localStorage , it is easy to pick up and use, has a reasonable footprint 2.36kb(gzipped: 1.04kb), and has no dependencies.' },
      { keywords: 'store,localStorage,lightweight,JavaScript' }
    ],
    style: cssStr.toString(),
  })
  .use(rehypeFormat)
  .use(rehypeWrap, { wrapper: 'div.wmde-markdown' })
  .use(rehypeRewrite, (node, index, parent) => {
    if(node.type == 'element' && node.properties.className && node.properties.className.includes('wmde-markdown')) {
      node.children = [
        {
          type: 'element',
          tagName: 'a',
          properties: {
            'aria-label': 'View source on GitHub',
            target: '__blank',
            className: 'github-corner',
            href: 'https://github.com/jaywcjlove/store.js',
          },
          children: [
            {
              type: 'element',
              tagName: 'svg',
              properties: {
                width: '54',
                height: '54',
                viewBox: '0 0 250 250',
                'aria-hidden': 'true',
                style: 'fill: rgb(32, 34, 37); color: rgb(255, 255, 255); position: fixed; z-index: 99999; border: 0px; top: 0px; right: 0px;'
              },
              children: [
                {
                  type: 'element',
                  tagName: 'path',
                  properties: {
                    d: 'M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z'
                  }
                }, {
                  type: 'element',
                  tagName: 'path',
                  properties: {
                    style: 'transform-origin: 130px 106px;',
                    className: 'octo-arm',
                    fill: 'currentColor',
                    d: 'M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2'
                  }
                }, {
                  type: 'element',
                  tagName: 'path',
                  properties: {
                    className: 'octo-body',
                    fill: 'currentColor',
                    d: 'M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z'
                  }
                }
              ]
            }
          ]
        },
        ...node.children,
      ];
    }
  })
  .use(rehypePrism)
  .use(rehypeAttrs, { properties: 'attr' })
  .use(stringify)
  .processSync(mdStr.toString())
  .toString();

const output = path.resolve(process.cwd(), 'coverage')
fs.ensureDirSync(output);
fs.writeFileSync(path.resolve(output, 'index.html'), htmlStr);
console.log('Output File: \x1b[32;1m', path.resolve(output, 'index.html'), '\x1b[0m');