import React from 'react';
import {
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  Text,
  HStack,
  useToast,
  useDisclosure
} from '@chakra-ui/react';
import { 
  FaShare, 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin,
  FaTelegram,
  FaWhatsapp,
  FaLink,
  FaEnvelope
} from 'react-icons/fa';
import { SiZalo, SiMessenger } from 'react-icons/si';
import PropTypes from 'prop-types';

const ShareButton = ({ url, title, description = '', size = 'md' }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const shareOptions = [
    {
      name: 'Facebook',
      icon: FaFacebook,
      color: '#1877F2',
      handler: () => {
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
      }
    },
    {
      name: 'Twitter',
      icon: FaTwitter,
      color: '#1DA1F2',
      handler: () => {
        const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
      }
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedin,
      color: '#0A66C2',
      handler: () => {
        const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
      }
    },
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      color: '#25D366',
      handler: () => {
        const shareUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
      }
    },
    {
      name: 'Telegram',
      icon: FaTelegram,
      color: '#0088CC',
      handler: () => {
        const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
      }
    },
    {
      name: 'Messenger',
      icon: SiMessenger,
      color: '#00B2FF',
      handler: () => {
        const shareUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=YOUR_APP_ID&redirect_uri=${encodeURIComponent(window.location.href)}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
      }
    },
    {
      name: 'Zalo',
      icon: SiZalo,
      color: '#0068FF',
      handler: () => {
        const shareUrl = `https://zalo.me/share?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
      }
    },
    {
      name: 'Email',
      icon: FaEnvelope,
      color: '#EA4335',
      handler: () => {
        const subject = encodeURIComponent(title);
        const body = encodeURIComponent(`${description}\n\n${url}`);
        const shareUrl = `mailto:?subject=${subject}&body=${body}`;
        window.location.href = shareUrl;
      }
    },
    {
      name: 'Sao chép liên kết',
      icon: FaLink,
      color: '#4A5568',
      handler: async () => {
        try {
          await navigator.clipboard.writeText(url);
          toast({
            title: 'Thành công!',
            description: 'Đã sao chép liên kết vào clipboard',
            status: 'success',
            duration: 2000,
            isClosable: true,
          });
        } catch (err) {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = url;
          document.body.appendChild(textArea);
          textArea.select();
          textArea.setSelectionRange(0, 99999);
          document.execCommand('copy');
          document.body.removeChild(textArea);
          
          toast({
            title: 'Thành công!',
            description: 'Đã sao chép liên kết',
            status: 'success',
            duration: 2000,
            isClosable: true,
          });
        }
      }
    }
  ];

  const handleShare = (shareHandler) => {
    shareHandler();
    onClose();
  };

  return (
    <Menu isOpen={isOpen} onClose={onClose}>
      <MenuButton
        as={IconButton}
        aria-label="Chia sẻ"
        icon={<Icon as={FaShare} />}
        size={size}
        variant="outline"
        onClick={onOpen}
        _hover={{
          transform: 'scale(1.05)',
          transition: 'transform 0.2s'
        }}
      />
      
      <MenuList 
        maxH="400px" 
        overflowY="auto"
        boxShadow="lg"
        border="1px"
        borderColor="gray.200"
      >
        {shareOptions.map((option) => (
          <MenuItem
            key={option.name}
            onClick={() => handleShare(option.handler)}
            _hover={{
              bg: 'gray.50',
              transform: 'translateX(4px)',
              transition: 'all 0.2s'
            }}
            py={3}
          >
            <HStack spacing={3}>
              <Icon 
                as={option.icon} 
                color={option.color} 
                fontSize="lg"
              />
              <Text fontSize="sm" fontWeight="medium">
                {option.name}
              </Text>
            </HStack>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

ShareButton.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg'])
};

export default ShareButton;