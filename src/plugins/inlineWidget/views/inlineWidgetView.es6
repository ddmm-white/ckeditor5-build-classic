import global from '@ckeditor/ckeditor5-utils/src/dom/global';
import View from '@ckeditor/ckeditor5-ui/src/view';

import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import checkIcon from '@ckeditor/ckeditor5-core/theme/icons/check.svg';
import cancelIcon from '@ckeditor/ckeditor5-core/theme/icons/cancel.svg';

import './inlineWidgetView.css';

export default class InlineWidgetView extends View {
  constructor(locale, { saveButtonLabel, cancelButtonLabel }) {
    super(locale);

    this.saveButtonView = this._createButton(
      saveButtonLabel,
      checkIcon,
      'ck-button-save',
      'save'
    );

    this.cancelButtonView = this._createButton(
      cancelButtonLabel,
      cancelIcon,
      'ck-button-cancel',
      'cancel'
    );
    const bind = this.bindTemplate;
    const _this = this;
    this.setTemplate({
      tag: 'div',
      attributes: {
        class: ['ck', 'ck-widget-container']
      },
      children: [
        {
          tag: 'div',
          children: [
            {
              tag: 'div',
              attributes: {
                class: ['ck-widget-view']
              },
              children: [
                {
                  tag: 'textarea',
                  attributes: {
                    id: 'ck-widget-textarea'
                  }
                }
              ]
            }
          ]
        },
        this.saveButtonView,
        this.cancelButtonView
      ]
    });
  }

  _createButton(label, icon, className, eventName) {
    const button = new ButtonView(this.locale);

    button.set({
      label,
      icon,
      tooltip: true
    });

    if (eventName) {
      button.delegate('execute').to(this, eventName);
    }

    return button;
  }
}
