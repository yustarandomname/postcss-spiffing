const postcss = require('postcss');
const expect = require('expect.js');
const plugin = require('..');

function translate(source) {
  const t = postcss([plugin()]).process(source).css;
  return t.replace('* {box-sizing: border-box\n}', '');
}

describe('PLACEHOLDER test', () => {
  it('replace `::placeholder-text` with `::placeholder`', () => {
    const source = `input::placeholder-text { color: red; }`;
    const expected = `input::placeholder { color: red; }`;
    const result = translate(source);
    expect(result).to.eql(expected);
  });

  it('replace `:placeholder` with `:placeholder-shown`', () => {
    const source = `input:placeholder { color: red; }`;
    const expected = `input:placeholder-shown { color: red; }`;
    const result = translate(source);
    expect(result).to.eql(expected);
  });
});
