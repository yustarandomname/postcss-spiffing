const postcss = require('postcss');
const expect = require('expect.js');
const fs = require('fs');
const path = require('path');
const plugin = require('..');

function translate(source) {
  const t = postcss([plugin()]).process(source).css;
  return t.replace('* {box-sizing: border-box\n}', '');
}

describe('DECLARATION VALUES test', () => {
  // fix nowrap
  it('replace `nowrap` with `no-wrap`', () => {
    const source = `.div { white-space: nowrap; }`;
    const expected = `.div { white-space: no-wrap; }`;
    const result = translate(source);
    expect(result).to.eql(expected);
  });

  // important
  it('replace `@important` with `!important`', () => {
    const source = `.div { color: red @important; }`;
    const expected = `.div { color: red !important; }`;
    const result = translate(source);
    expect(result).to.eql(expected);
  });

  // rgba and hsla
  it('rgb() with 3 params stay rgb', () => {
    const source = `.div { color: rgb(255, 255, 255); }`;
    const expected = `.div { color: rgb(255, 255, 255); }`;
    const result = translate(source);
    expect(result).to.eql(expected);
  });

  it('rgba() should not exist rgb() with 4th parameter', () => {
    const source = `.div { color: rgb(255, 255, 255, 0.1); }`;
    const expected = `.div { color: rgba(255, 255, 255, 0.1); }`;
    const result = translate(source);
    expect(result).to.eql(expected);
  });

  it('hsla() should not exist hsl() with 4th parameter', () => {
    const source = `.div { color: hsl(0, 0%, 100%, 0.1); }`;
    const expected = `.div { color: hsla(0, 0%, 100%, 0.1); }`;
    const result = translate(source);
    expect(result).to.eql(expected);
  });
});
