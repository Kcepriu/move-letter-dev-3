import './css/styles.css';
import { TextsDocument } from './textsDocument';
import { FormAddText } from './formAddText';

const textsDocument = new TextsDocument();
new FormAddText(textsDocument.addText);

addTestText();
// ---------------------
function addTestText() {
  textsDocument.addText(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '
  );

  textsDocument.addText(
    'Integer euismod, sapien ac sodales consectetur, metus tellus consequat nisl, '
  );
  textsDocument.addText(
    'nec dignissim enim odio vel metus. Sed sed tellus nec elit sagittis tempus. Mauris nec commodo ipsum.'
  );

  textsDocument.addText(
    'Vivamus auctor fringilla sapien, eu tincidunt lacus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Ut dignissim, velit vel consequat fermentum, libero risus venenatis quam, eu fermentum velit nulla non magna.'
  );
  textsDocument.addText(
    `Duis convallis pretium erat, sit amet luctus mauris mattis eu. Proin auctor orci quis felis pulvinar, ac eleifend sapien posuere. Integer at libero libero.`
  );
  textsDocument.addText(
    'Sed nec dapibus leo. Nulla facilisi. Vestibulum et erat vel nisi maximus malesuada. Mauris vestibulum odio ac nunc volutpat, ac malesuada sapien vestibulum. Proin quis risus ut magna accumsan malesuada.'
  );
  textsDocument.addText(
    'Cras ullamcorper nisi eu sem laoreet, vel suscipit est consequat. Sed nec luctus ipsum. Suspendisse sit amet libero vel arcu rutrum scelerisque. Vivamus convallis semper justo, id ultricies velit fringilla a.'
  );
  textsDocument.addText(
    'Phasellus vel ultrices eros. In vitae justo quis felis consectetur convallis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.'
  );
}
