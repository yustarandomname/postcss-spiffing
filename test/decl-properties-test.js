const postcss = require('postcss');
const expect = require('expect.js');
const fs = require('fs');
const path = require('path');
const plugin = require('..');

function translate(source) {
  const t = postcss([plugin()]).process(source).css;
  return t.replace('* {box-sizing: border-box\n}', '');
}

describe('DECLARATION PROPERTIES test', () => {
  // corner-radius -> border-radius
  it('replace `corner-radius` with `border-radius`', () => {
    const source = `.div { corner-radius: 3rem }`;
    const expected = `.div { border-radius: 3rem }`;
    const result = translate(source);
    expect(result).to.eql(expected);
  });

  // *-blend-mode -> *-blend
  it('*-blend-mode -> *-blend | background', () => {
    const source = `.div { background-blend-mode: multiply }`;
    const expected = `.div { background-blend: multiply }`;
    const result = translate(source);
    expect(result).to.eql(expected);
  });

  it('*-blend-mode -> *-blend | mix', () => {
    const source = `.div { mix-blend-mode: multiply }`;
    const expected = `.div { mix-blend: multiply }`;
    const result = translate(source);
    expect(result).to.eql(expected);
  });
});
