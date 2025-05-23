import React, { useState, useEffect, useRef } from 'react';
import { 
  IconButton, 
  Text, 
  HStack, 
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useColorModeValue,
  Tooltip
} from '@chakra-ui/react';
import { 
  Heart,
  HeartFill,
  EmojiSmileFill,
  EmojiLaughingFill,
  EmojiSurpriseFill,
  EmojiFrownFill,
  EmojiAngryFill,
  EmojiHeartEyesFill
} from 'react-bootstrap-icons';
import PropTypes from 'prop-types';

// Định nghĩa các loại cảm xúc với Bootstrap Icons
const REACTION_TYPES = {
  like: {
    icon: EmojiSmileFill,
    label: 'Thích',
    color: 'blue.500',
    emoji: '👍'
  },
  love: {
    icon: EmojiHeartEyesFill,
    label: 'Yêu thích',
    color: 'pink.500',
    emoji: '❤️'
  },
  haha: {
    icon: EmojiLaughingFill,
    label: 'Haha',
    color: 'yellow.500',
    emoji: '😂'
  },
  wow: {
    icon: EmojiSurpriseFill,
    label: 'Wow',
    color: 'orange.500',
    emoji: '😮'
  },
  sad: {
    icon: EmojiFrownFill,
    label: 'Buồn',
    color: 'blue.600',
    emoji: '😢'
  },
  angry: {
    icon: EmojiAngryFill,
    label: 'Giận dữ',
    color: 'red.600',
    emoji: '😡'
  }
};

const Reaction = ({ 
  reactions = {}, 
  userReaction = null, 
  onReact, 
  size = 'md', 
  showCount = true,
  variant = 'icon' // 'icon' hoặc 'emoji'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeTimeoutRef = useRef(null);
  
  // Color mode values
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const popoverBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  // Tính tổng số reactions
  const totalReactions = Object.values(reactions).reduce((sum, count) => sum + count, 0);

  // Lấy reaction hiện tại của user
  const currentReaction = userReaction ? REACTION_TYPES[userReaction] : null;

  // Xử lý click reaction
  const handleReactionClick = (reactionType) => {
    // Nếu click vào reaction đã chọn → bỏ reaction
    if (userReaction === reactionType) {
      onReact(null);
    } else {
      // Chọn reaction mới
      onReact(reactionType);
    }
    setIsOpen(false);
  };

  // Xử lý click để thả tim
  const handleMainButtonClick = () => {
    handleReactionClick('love');
  };

  // Xử lý hover với độ trễ
  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 500); // Độ trễ 500ms
  };

  // Dọn dẹp timeout khi component unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Render reaction picker
  const ReactionPicker = () => (
    <HStack spacing={2} p={2}>
      {Object.entries(REACTION_TYPES).map(([type, config]) => (
        <Tooltip key={type} label={config.label} placement="top">
          <IconButton
            size="md" // Tăng kích thước
            variant="ghost"
            onClick={() => handleReactionClick(type)}
            _hover={{ 
              bg: hoverBg,
              transform: 'scale(1.3)', // Phóng to hơn khi hover
              transition: 'all 0.3s'
            }}
            transition="all 0.3s"
          >
            {variant === 'emoji' ? (
              <Text fontSize="2xl">{config.emoji}</Text> // Tăng kích thước emoji
            ) : (
              <Box as={config.icon} color={config.color} size={28} /> // Tăng kích thước icon
            )}
          </IconButton>
        </Tooltip>
      ))}
    </HStack>
  );

  // Render reaction summary (hiển thị top reactions)
  const ReactionSummary = () => {
    const topReactions = Object.entries(reactions)
      .filter(([_, count]) => count > 0)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    if (topReactions.length === 0) return null;

    return (
      <HStack spacing={1} fontSize="sm">
        {topReactions.map(([type, count]) => {
          const config = REACTION_TYPES[type];
          return (
            <HStack key={type} spacing={1}>
              {variant === 'emoji' ? (
                <Text fontSize="sm">{config.emoji}</Text>
              ) : (
                <Box as={config.icon} color={config.color} size="12px" />
              )}
              <Text fontSize="xs" color={textColor}>
                {count}
              </Text>
            </HStack>
          );
        })}
      </HStack>
    );
  };

  return (
    <HStack spacing={2}>
      <Popover 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        placement="top-start"
      >
        <PopoverTrigger>
          <IconButton
            size={size}
            variant="ghost"
            colorScheme={currentReaction ? 'blue' : 'gray'}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleMainButtonClick}
            _hover={{ bg: hoverBg }}
          >
            {currentReaction ? (
              variant === 'emoji' ? (
                <Text fontSize={size === 'sm' ? 'sm' : 'md'}>
                  {currentReaction.emoji}
                </Text>
              ) : (
                <Box 
                  as={currentReaction.icon} 
                  color={currentReaction.color}
                />
              )
            ) : (
              <Heart size={size === 'sm' ? 16 : 20} />
            )}
          </IconButton>
        </PopoverTrigger>
        
        <PopoverContent 
          bg={popoverBg}
          borderColor={borderColor}
          shadow="lg"
          width="auto"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <PopoverBody p={1}>
            <ReactionPicker />
          </PopoverBody>
        </PopoverContent>
      </Popover>

      {showCount && (
        <Box>
          {totalReactions > 0 ? (
            <HStack spacing={2}>
              <ReactionSummary />
              <Text fontSize="sm" color={textColor}>
                {totalReactions}
              </Text>
            </HStack>
          ) : (
            <Text fontSize="sm" color={textColor}>
              0
            </Text>
          )}
        </Box>
      )}
    </HStack>
  );
};

Reaction.propTypes = {
  reactions: PropTypes.object, // { like: 5, love: 2, haha: 1, ... }
  userReaction: PropTypes.oneOf(['like', 'love', 'haha', 'wow', 'sad', 'angry']),
  onReact: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
  showCount: PropTypes.bool,
  variant: PropTypes.oneOf(['icon', 'emoji'])
};

export default Reaction;