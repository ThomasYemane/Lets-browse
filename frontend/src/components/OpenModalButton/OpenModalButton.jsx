// frontend/src/components/OpenModalButton/OpenModalButton.jsx
import { useModal } from '../../context/Modal';

export default function OpenModalButton({
  modalComponent,   // component to render in the modal
  buttonText,       // text on the button
  onButtonClick,    // optional: runs when the button is clicked
  onModalClose      // optional: runs when the modal is closed
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const handleClick = () => {
    if (typeof onModalClose === 'function') setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onButtonClick === 'function') onButtonClick();
  };

  return <button onClick={handleClick}>{buttonText}</button>;
}
