var postcss = require('postcss');

function handleDeclProp(declaration) {
  switch (declaration.prop) {
    case 'corner-radius':
      // replace `corner-radius` with `border-radius`
      declaration.prop = 'border-radius';
      break;
    case 'background-blend-mode':
    case 'mix-blend-mode':
      // *-blend-mode -> *-blend
      declaration.prop = declaration.prop.replace(/-blend-mode$/, '-blend');
      break;
  }
}

function handleDeclValue(declaration) {
  // replace `^imporant` with `!important`
  if (declaration.value.match(/\=important$/)) {
    declaration.value = declaration.value
      .substring(0, declaration.value.length - 11)
      .trim();
    declaration.important = true;
  }

  // rgb and hsl with 4th param -> rgba() and hsla()
  declaration.value = declaration.value.replace(
    /rgb(\(\d+,\s\d+,\s\d+,\s\d+\.*\d*\))/,
    'rgba$1'
  );

  declaration.value = declaration.value.replace(
    /hsl(\(\d+,\s\d+%,\s\d+%,\s\d+\.*\d*\))/,
    'hsla$1'
  );
}

module.exports = postcss.plugin('propper-css', () => (css) => {
  const starRules = new postcss.rule({ selector: '*' });
  starRules.nodes.push(
    postcss.decl({ prop: 'box-sizing', value: 'border-box' })
  );
  css.root().nodes.push(starRules);

  css.walkDecls((decl) => {
    decl.value && handleDeclValue(decl);

    decl.prop && handleDeclProp(decl);
  });

  css.walkRules((rule) => {
    // console.log(rule.nodes);
    if (rule.selector.includes('::placeholder-text')) {
      rule.selector = rule.selector.replace(
        '::placeholder-text',
        '::placeholder'
      );
    } else if (rule.selector.includes(':placeholder')) {
      rule.selector = rule.selector.replace(
        ':placeholder',
        ':placeholder-shown'
      );
    }
  });

  css.walkAtRules((delc) => {
    console.log(delc);
  });
});
