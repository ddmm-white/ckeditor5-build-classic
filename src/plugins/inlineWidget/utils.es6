export const getSelectedInlineWidgetModel = selection => {
  const selectedElement = selection.getSelectedElement();

  if (selectedElement && selectedElement.is('inlineWidget')) {
    return selectedElement;
  }

  return null;
};
