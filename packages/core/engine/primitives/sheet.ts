export function setSheet(sheet: CSSStyleSheet) {
  //this is only possible because of ...spreading the adoptedStylesheets.
  //Normally, you can't access the cssRules of an adopted stylesheet
  const filtered = [...document.adoptedStyleSheets].filter((sheet) => {
    const includesUmbra = sheet.cssRules[0].cssText.includes('theme')
    return !includesUmbra
  })
  document.adoptedStyleSheets = [...filtered, sheet]
}
