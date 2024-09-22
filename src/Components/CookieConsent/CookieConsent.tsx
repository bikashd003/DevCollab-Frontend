import { useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react';
import { useMutation } from '@apollo/client';
import { SET_COOKIE_CONSENT } from '../../GraphQL/Mutations/CookieConsent/CookieConsent';
import { message } from 'antd';

const CookieConsent = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [setCookieConsent] = useMutation(SET_COOKIE_CONSENT);
  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      const timer = setTimeout(() => {
        onOpen();
      }, 3000); // Show after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [onOpen]);
  const closeModal = () => {
    onOpenChange();
  };
  // Function to handle accepting cookies
  const handleAccept = async () => {
    localStorage.setItem('cookieConsent', 'accepted');
    try {
      // Send consent data to the database
      await setCookieConsent({ variables: { consent: 'accepted' } });
    } catch (error) {
      message.error('Error saving consent: accepted');
    }
    closeModal();
  };

  // Function to handle rejecting cookies
  const handleReject = async () => {
    localStorage.setItem('cookieConsent', 'rejected');
    try {
      // Send consent data to the database
      await setCookieConsent({ variables: { consent: 'rejected' } });
      message.success('Cookies have been rejected');
    } catch (error) {
      message.error('Error saving consent: rejected');
    }
    closeModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="lg"
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: 'easeOut',
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: 'easeIn',
            },
          },
        },
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <span className="text-lg font-mono text-blue-500">Cookie Consent</span>
            </ModalHeader>
            <ModalBody className="flex flex-col gap-4 w-full">
              <pre className="bg-gray-900 p-4 rounded-md text-green-400 font-mono text-sm">
                <code>{`
// This website uses cookies to enhance user experience

function acceptCookies() {
  // Set cookies and improve your browsing
  return 'Enhanced user experience'
}

function rejectCookies() {
  // Limit functionality but respect privacy
  return 'Basic user experience'
}

// Please choose your preference below:
                `}</code>
              </pre>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={handleReject}>
                rejectCookies()
              </Button>
              <Button color="success" onPress={handleAccept}>
                acceptCookies()
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CookieConsent;
