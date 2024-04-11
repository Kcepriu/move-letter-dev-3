import './css/styles.css';
import { TextsDocument } from './textsDocument';
import { FormAddText } from './formAddText';

const textsDocument = new TextsDocument();
new FormAddText(textsDocument.addText);

addTestText();
// ---------------------
function addTestText() {
  textsDocument.addText(
    'Do ipsum eu occaecat aliquip cupidatat eiusmod dolor officia officia.'
  );
  textsDocument.addText(
    'Do ipsum eu occaecat aliquip cupidatat eiusmod dolor officia officia.'
  );
  textsDocument.addText(
    `Do ipsum eu occaecat aliquip cupidatat eiusmod dolor officia officia.
    Do ipsum eu occaecat aliquip cupidatat eiusmod dolor officia officia.
    Do ipsum eu occaecat aliquip cupidatat eiusmod dolor officia officia.
    Do ipsum eu occaecat aliquip cupidatat eiusmod dolor officia officia.`
  );
  textsDocument.addText(
    'Do ipsum eu occaecat aliquip cupidatat eiusmod dolor officia officia.'
  );
  textsDocument.addText(
    'Do ipsum eu occaecat aliquip cupidatat eiusmod dolor officia officia.'
  );
  textsDocument.addText(
    'Do dddiffdd ipsum eu occaecat aliquip cupidatat eiusmod dolor officia officia.'
  );
}
