import { isEdge, isMobile } from '@/scripts/helper';
import { DOCUMENT_ELEMENT } from '@/scripts/constants';

if (isEdge()) {
  DOCUMENT_ELEMENT.classList.add('is-edge');
}
if (isMobile()) {
  DOCUMENT_ELEMENT.classList.add('is-mobile');
}
