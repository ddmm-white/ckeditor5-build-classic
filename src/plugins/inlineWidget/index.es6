import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';

import InlineWidgetEditing from './inlineWidgetEditing.es6';

export default class InlineWidget extends Plugin {
  static get requires() {
    return [InlineWidgetEditing, Widget];
  }

  static get pluginName() {
    return 'InlineWidget';
  }
}
